#!/usr/bin/env python3
"""
HASH256 GPU Miner CLI
GPU-accelerated miner for hash256.org proof-of-work token on Ethereum.
"""

import os
import sys
import time
import ctypes
import argparse
import signal
import json
from pathlib import Path

try:
    from web3 import Web3
    from eth_account import Account
except ImportError:
    print("ERROR: pip install web3 eth-account")
    sys.exit(1)

# Load .env if present
env_file = Path(__file__).parent / ".env"
if env_file.exists():
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

DEFAULT_CONTRACT = os.getenv("HASH256_CONTRACT", "0x0000000000000000000000000000000000000000")

CONTRACT_ABI = json.loads("""[
    {"inputs":[{"internalType":"address","name":"miner","type":"address"}],"name":"getChallenge","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"miningState","outputs":[{"internalType":"uint256","name":"difficulty","type":"uint256"},{"internalType":"uint256","name":"epoch","type":"uint256"},{"internalType":"uint256","name":"reward","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"name":"mine","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"difficulty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
]""")


class GPUMiner:
    def __init__(self, lib_path=None):
        if lib_path is None:
            script_dir = Path(__file__).parent
            candidates = [
                script_dir / "cuda" / "libhash256miner.so",
                script_dir / "cuda" / "libhash256miner.dylib",
            ]
            for c in candidates:
                if c.exists():
                    lib_path = str(c)
                    break
        if lib_path is None or not Path(lib_path).exists():
            raise FileNotFoundError(
                "CUDA library not found. Build: cd cuda && make ARCH=sm_86"
            )
        self.lib = ctypes.CDLL(lib_path)
        self.lib.mine_batch.argtypes = [
            ctypes.c_char_p, ctypes.c_char_p,
            ctypes.c_uint64, ctypes.c_uint64, ctypes.c_int,
            ctypes.c_char_p, ctypes.c_char_p,
        ]
        self.lib.mine_batch.restype = ctypes.c_int
        self.lib.get_gpu_info.argtypes = [ctypes.c_char_p, ctypes.c_int]
        self.lib.get_gpu_info.restype = ctypes.c_int
        info_buf = ctypes.create_string_buffer(512)
        count = self.lib.get_gpu_info(info_buf, 512)
        print(f"  [GPU] {info_buf.value.decode()} ({count} device(s))")

    def mine(self, challenge_hex, target_hex, start_nonce, batch_size=16777216, threads_per_block=256):
        challenge_hex = challenge_hex.replace("0x", "").lower()
        target_hex = target_hex.replace("0x", "").lower()
        nonce_out = ctypes.create_string_buffer(65)
        hash_out = ctypes.create_string_buffer(65)
        found = self.lib.mine_batch(
            challenge_hex.encode(), target_hex.encode(),
            ctypes.c_uint64(start_nonce), ctypes.c_uint64(batch_size),
            ctypes.c_int(threads_per_block), nonce_out, hash_out,
        )
        if found:
            return nonce_out.value.decode(), hash_out.value.decode()
        return None, None


class CPUMiner:
    def __init__(self):
        print("  [CPU] CPU fallback (SLOW - testing only)")

    def mine(self, challenge_hex, target_hex, start_nonce, batch_size=50000, threads_per_block=0):
        challenge_bytes = bytes.fromhex(challenge_hex.replace("0x", ""))
        target_bytes = bytes.fromhex(target_hex.replace("0x", ""))
        for i in range(batch_size):
            nonce = start_nonce + i
            nonce_bytes = nonce.to_bytes(32, byteorder='big')
            input_data = challenge_bytes + nonce_bytes
            hash_result = Web3.keccak(input_data)
            if hash_result < target_bytes:
                return nonce_bytes.hex(), hash_result.hex()
        return None, None


class Hash256Contract:
    def __init__(self, rpc_url, contract_address, private_key=None):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not self.w3.is_connected():
            raise ConnectionError(f"Cannot connect to RPC: {rpc_url}")
        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(contract_address), abi=CONTRACT_ABI
        )
        self.private_key = private_key
        self.wallet = Account.from_key(private_key).address if private_key else None
        print(f"  [RPC] Chain: {self.w3.eth.chain_id} | Block: {self.w3.eth.block_number}")

    def get_challenge(self, miner_address):
        addr = Web3.to_checksum_address(miner_address)
        return self.contract.functions.getChallenge(addr).call().hex()

    def get_mining_state(self):
        try:
            r = self.contract.functions.miningState().call()
            return {"difficulty": r[0], "epoch": r[1], "reward": r[2]}
        except Exception:
            d = self.contract.functions.difficulty().call()
            return {"difficulty": d, "epoch": 0, "reward": 0}

    def difficulty_to_target(self, difficulty):
        if difficulty == 0:
            raise ValueError("Difficulty is 0")
        target = (2**256 - 1) // difficulty
        return target.to_bytes(32, byteorder='big').hex()

    def submit_solution(self, nonce_hex, gas_price_gwei=None, gas_limit=200000):
        if not self.private_key:
            raise ValueError("Private key required")
        nonce_int = int(nonce_hex, 16)
        tx = self.contract.functions.mine(nonce_int).build_transaction({
            'from': self.wallet,
            'nonce': self.w3.eth.get_transaction_count(self.wallet),
            'gas': gas_limit,
            'gasPrice': self.w3.to_wei(gas_price_gwei, 'gwei') if gas_price_gwei else self.w3.eth.gas_price,
            'chainId': self.w3.eth.chain_id,
        })
        signed = self.w3.eth.account.sign_transaction(tx, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        print(f"  [TX] Sent: {tx_hash.hex()}")
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        if receipt['status'] == 1:
            print(f"  [TX] CONFIRMED! Gas: {receipt['gasUsed']}")
            return True
        print(f"  [TX] FAILED!")
        return False


def main():
    parser = argparse.ArgumentParser(description="HASH256 GPU Miner")
    parser.add_argument("--wallet", "-w", default=os.getenv("MINER_WALLET"))
    parser.add_argument("--rpc", "-r", default=os.getenv("MINER_RPC_URL", "https://eth.llamarpc.com"))
    parser.add_argument("--private-key", "-k", default=os.getenv("MINER_PRIVATE_KEY"))
    parser.add_argument("--contract", "-c", default=DEFAULT_CONTRACT)
    parser.add_argument("--batch-size", "-b", type=int, default=16777216)
    parser.add_argument("--threads", "-t", type=int, default=256)
    parser.add_argument("--start-nonce", type=int, default=0)
    parser.add_argument("--gas-price", type=float, default=None)
    parser.add_argument("--gas-limit", type=int, default=200000)
    parser.add_argument("--cuda-lib", default=None)
    parser.add_argument("--cpu", action="store_true")
    args = parser.parse_args()

    if not args.wallet:
        parser.error("--wallet required (or set MINER_WALLET in .env)")

    print("""
    ╔══════════════════════════════════════════════════╗
    ║          HASH256 GPU MINER v1.0.0               ║
    ║          https://hash256.org                    ║
    ╚══════════════════════════════════════════════════╝
    """)

    # Init miner
    if args.cpu:
        miner = CPUMiner()
    else:
        try:
            miner = GPUMiner(lib_path=args.cuda_lib)
        except FileNotFoundError as e:
            print(f"  [!] {e}")
            print("  [!] Falling back to CPU...\n")
            miner = CPUMiner()

    # Connect
    contract = Hash256Contract(args.rpc, args.contract, args.private_key)
    wallet = args.wallet

    # Mining loop
    running = True
    total_hashes = 0
    solutions = 0
    t0 = time.time()

    def stop(sig, frame):
        nonlocal running
        print("\n  [!] Stopping...")
        running = False
    signal.signal(signal.SIGINT, stop)

    print(f"\n  Wallet: {wallet}")
    print(f"  Batch:  {args.batch_size:,} hashes/round")
    print(f"  Submit: {'AUTO' if args.private_key else 'MANUAL (no key)'}\n")

    nonce_offset = args.start_nonce

    while running:
        try:
            challenge = contract.get_challenge(wallet)
            state = contract.get_mining_state()
            target = contract.difficulty_to_target(state["difficulty"])

            print(f"  [EPOCH] {state.get('epoch','?')} | Diff: {state['difficulty']:,} | Challenge: 0x{challenge[:16]}...")

            batch_num = 0
            found = False
            while running and not found:
                t1 = time.time()
                start_n = nonce_offset + batch_num * args.batch_size
                nonce_hex, hash_hex = miner.mine(
                    challenge, target, start_n,
                    batch_size=args.batch_size, threads_per_block=args.threads
                )
                elapsed = time.time() - t1
                total_hashes += args.batch_size
                hr = args.batch_size / elapsed if elapsed > 0 else 0
                avg_hr = total_hashes / (time.time() - t0)

                sys.stdout.write(
                    f"\r  [MINING] Batch #{batch_num} | {hr/1e6:.1f} MH/s (avg {avg_hr/1e6:.1f}) | "
                    f"Total: {total_hashes:,} | Found: {solutions}"
                )
                sys.stdout.flush()

                if nonce_hex:
                    found = True
                    solutions += 1
                    print(f"\n\n  {'='*50}")
                    print(f"  SOLUTION FOUND!")
                    print(f"  Nonce: 0x{nonce_hex}")
                    print(f"  Hash:  0x{hash_hex}")
                    print(f"  {'='*50}\n")

                    if args.private_key:
                        try:
                            contract.submit_solution(nonce_hex, args.gas_price, args.gas_limit)
                        except Exception as e:
                            print(f"  [ERROR] Submit failed: {e}")
                    else:
                        print(f"  Submit manually: mine({int(nonce_hex, 16)})")

                batch_num += 1
                if batch_num % 50 == 0:
                    new_ch = contract.get_challenge(wallet)
                    if new_ch != challenge:
                        print(f"\n  [!] New epoch, challenge changed")
                        break

            if running:
                time.sleep(1)

        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"\n  [ERROR] {e} - retry in 10s")
            time.sleep(10)

    total_time = time.time() - t0
    print(f"\n\n  Session: {total_time:.0f}s | Hashes: {total_hashes:,} | "
          f"Avg: {total_hashes/total_time/1e6:.1f} MH/s | Solutions: {solutions}\n")


if __name__ == "__main__":
    main()
