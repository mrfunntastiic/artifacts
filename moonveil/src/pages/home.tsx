import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Moon, ArrowRight, Printer, Laptop, Palette, CheckCircle2, Mail, MapPin, Phone, Menu, X, ArrowUpRight, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.png";
import aboutSide from "@/assets/about-side.png";

const waNumber = "6285290115868";
const openWA = (message = "") => {
  const url = `https://wa.me/${waNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  window.open(url, '_blank');
};

const navLinks = [
  { name: "Beranda", href: "#home" },
  { name: "Profil", href: "#about" },
  { name: "Layanan", href: "#services" },
  { name: "Harga", href: "#pricing" },
  { name: "Kontak", href: "#contact" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id.substring(1));
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nama = formData.get("nama");
    const email = formData.get("email");
    const pesan = formData.get("pesan");
    
    const text = `Halo tim Moonveil Creations, saya ${nama} (${email}). ${pesan}`;
    openWA(text);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("#home"); }} className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Moon className="w-5 h-5 text-primary" />
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">Moonveil <span className="text-primary">Creations</span></span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <Button onClick={() => openWA("Halo Moonveil Creations, saya ingin berkonsultasi mengenai layanan Anda.")} className="rounded-full shadow-[0_0_15px_rgba(250,195,20,0.3)] hover:shadow-[0_0_25px_rgba(250,195,20,0.5)] transition-shadow">
              Hubungi WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6"
          >
            <ul className="flex flex-col gap-6 text-xl font-display font-medium">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className="block py-2 text-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <Button onClick={() => openWA()} className="w-full mt-8 rounded-full" size="lg">
              Hubungi WhatsApp
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          style={{ y, opacity }} 
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent z-10" />
          <img 
            src={heroBg} 
            alt="Moonveil Creations Studio" 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 py-20">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Kualitas Premium & Cepat
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-7xl font-display font-bold leading-tight mb-6 text-white"
            >
              Ciptakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">Kesan</span>,<br />
              Abadikan <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-white">Pesan</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl leading-relaxed"
            >
              Moonveil Creations: Menghidupkan visi Anda, dari layar hingga cetakan. Solusi branding terpadu untuk kebutuhan fisik dan digital Anda.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" onClick={() => scrollTo("#pricing")} className="rounded-full h-12 md:h-14 px-6 md:px-8 text-sm md:text-base shadow-[0_0_20px_rgba(250,195,20,0.2)] w-full sm:w-auto">
                Lihat Pricelist
              </Button>
              <Button size="lg" variant="outline" onClick={() => openWA()} className="rounded-full h-12 md:h-14 px-6 md:px-8 text-sm md:text-base border-border hover:bg-secondary group w-full sm:w-auto">
                Hubungi WhatsApp
                <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </motion.div>
      </section>

      {/* Profil Section */}
      <section id="about" className="py-16 md:py-24 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="relative"
            >
              <div className="aspect-[3/2] sm:aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden relative border border-border/50">
                <img src={aboutSide} alt="Moonveil Design Studio" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent" />
              </div>
              
              <div className="absolute -bottom-10 -right-10 bg-card border border-border p-6 rounded-2xl shadow-2xl max-w-[250px] hidden md:block backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Moon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-white">Premium</div>
                    <div className="text-xs text-muted-foreground">Quality & Speed</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeIn}>
                <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">Profil Singkat</h2>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Menjembatani Kebutuhan Dunia Fisik dan Digital</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Moonveil Creations adalah agensi kreatif yang bergerak di bidang solusi branding terpadu. Kami menghadirkan layanan profesional mulai dari percetakan berkualitas tinggi hingga pengembangan website modern yang estetis dan fungsional.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="relative p-8 rounded-2xl bg-secondary/30 border border-border/50 backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-2xl" />
                <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Visi Kami
                </h4>
                <p className="text-muted-foreground italic">
                  "Kami percaya bahwa setiap ide hebat berhak mendapatkan presentasi yang memukau. Dengan perpaduan kreativitas dan teknologi, kami membantu bisnis maupun individu untuk bersinar—layaknya cahaya bulan yang menembus batas—melalui identitas visual yang kuat dan kehadiran digital yang efektif."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Apa yang kami kerjakan */}
      <section className="py-16 md:py-24 bg-card/30 relative border-y border-border/30">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">Solusi Terpadu</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white">Apa yang Kami Kerjakan</h3>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Printer,
                title: "Creative Printing",
                desc: "Cetak kartu nama, brosur, banner, dan kebutuhan promosi fisik lainnya dengan presisi tajam."
              },
              {
                icon: Laptop,
                title: "Web Development",
                desc: "Pembuatan website yang responsif, cepat, dan profesional untuk membangun kredibilitas di dunia maya."
              },
              {
                icon: Palette,
                title: "Branding Design",
                desc: "Desain visual yang menyatukan pesan bisnis Anda agar mudah diingat oleh pelanggan."
              }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <Card className="bg-background border-border/50 hover:border-primary/50 transition-colors duration-300 h-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Layanan Unggulan */}
      <section id="services" className="py-16 md:py-24 relative">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mb-16"
          >
            <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">Layanan Utama</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Layanan Unggulan Kami</h3>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Kami menawarkan berbagai macam jasa percetakan untuk memenuhi segala kebutuhan bisnis dan personal Anda.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Digital Printing",
                desc: "Cetak dokumen, brosur, kartu nama, dan poster dengan kualitas tinggi dan waktu pengerjaan cepat.",
                button: null
              },
              {
                title: "Cetak Undangan",
                desc: "Cetak undangan pernikahan, ulang tahun, dan acara lainnya dengan berbagai pilihan bahan dan desain elegan.",
                button: { text: "Isi Data Pengantin", url: "https://forms.gle/auNtpyCCjhFhCAaKA" }
              },
              {
                title: "Offset Printing",
                desc: "Solusi cetak skala besar untuk buku, majalah, dan kemasan produk dengan biaya lebih ekonomis.",
                button: null
              },
              {
                title: "Large Format",
                desc: "Cetak banner, spanduk, baliho, dan stiker outdoor/indoor dengan ukuran kustom sesuai kebutuhan.",
                button: null
              },
              {
                title: "Merchandise",
                desc: "Cetak pada media mug, kaos, totebag, dan gantungan kunci untuk keperluan promosi atau kado.",
                button: null
              },
              {
                title: "Pembuatan Website",
                desc: "Jasa pembuatan website company profile, landing page, dan toko online dengan desain modern dan responsif.",
                button: { text: "Konsultasi Website", action: "Halo, saya tertarik untuk membuat website dengan Moonveil." }
              },
              {
                title: "Undangan Wedding Digital",
                desc: "Undangan pernikahan digital interaktif dengan desain elegan, animasi cantik, RSVP online, dan bisa dibagikan lewat WhatsApp.",
                button: { text: "Pesan Sekarang", action: "Halo Moonveil Creations, saya ingin memesan Undangan Wedding Digital. Mohon info lebih lanjut." }
              }
            ].map((service, idx) => (
              <Card key={idx} className="bg-card border-border hover:bg-secondary/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-white group-hover:text-primary transition-colors flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary/70" />
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.desc}</p>
                </CardContent>
                {service.button && (
                  <CardFooter>
                    <Button 
                      variant="link" 
                      className="text-primary px-0 hover:text-white"
                      onClick={() => {
                        if (service.button?.url) {
                          window.open(service.button.url, "_blank");
                        } else if (service.button?.action) {
                          openWA(service.button.action);
                        }
                      }}
                    >
                      {service.button.text} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-card/20 relative border-t border-border/30">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">Investasi</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Daftar Harga Transparan</h3>
            <p className="text-muted-foreground text-lg">
              Pilih kategori untuk melihat detail harga kami.
            </p>
          </motion.div>

          <Tabs defaultValue="kertas" className="w-full max-w-4xl mx-auto">
            <TabsList className="flex flex-col sm:grid sm:grid-cols-3 w-full h-auto gap-3 bg-transparent mb-10">
              <TabsTrigger value="kertas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 rounded-full border border-border data-[state=active]:border-primary shadow-sm text-sm md:text-base w-full">
                Kertas & Karton (A3+)
              </TabsTrigger>
              <TabsTrigger value="stiker" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 rounded-full border border-border data-[state=active]:border-primary shadow-sm text-sm md:text-base w-full">
                Stiker & Label (A3+)
              </TabsTrigger>
              <TabsTrigger value="web" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 rounded-full border border-border data-[state=active]:border-primary shadow-sm text-sm md:text-base w-full">
                Pembuatan Website
              </TabsTrigger>
            </TabsList>
            
            {/* Kertas & Karton */}
            <TabsContent value="kertas" className="mt-0">
              <Card className="border-border bg-background shadow-xl overflow-hidden">
                <CardHeader className="pb-2 pt-6 px-4 md:px-6">
                  <CardTitle className="text-lg md:text-xl text-white">Harga per Lembar A3+ (INC PPN)</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Satuan: Rupiah / lembar. 1S = 1 Sisi, 2S = 2 Sisi.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-sm border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-secondary/60 text-muted-foreground">
                          <th className="text-left px-4 py-3 font-semibold text-white sticky left-0 bg-secondary/60 min-w-[140px]">Media Bahan</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap" colSpan={2}>1–5 lbr</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap border-l border-border/30" colSpan={2}>6–25 lbr</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap border-l border-border/30" colSpan={2}>26–74 lbr</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap border-l border-border/30" colSpan={2}>&gt;75 lbr</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap border-l border-border/30" colSpan={2}>&gt;100 lbr</th>
                        </tr>
                        <tr className="bg-secondary/30 text-muted-foreground text-xs">
                          <th className="sticky left-0 bg-secondary/30"></th>
                          {["1S","2S","1S","2S","1S","2S","1S","2S","1S","2S"].map((s, i) => (
                            <th key={i} className={`px-3 py-2 text-center ${i % 2 === 0 && i > 0 ? "border-l border-border/30" : ""}`}>{s}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["HVS 100 GR",       "4.000","8.000","2.250","–","2.250","–","2.000","4.000","1.700","3.400"],
                          ["ART PAPER 120 GR", "5.000","10.000","3.500","7.000","2.250","4.500","2.000","4.000","1.800","3.600"],
                          ["ART PAPER 150 GR", "5.000","10.000","3.500","7.000","2.250","4.500","2.000","4.000","1.900","3.800"],
                          ["ART CARTON 230 GR","5.000","10.000","4.000","8.000","3.250","6.500","3.000","6.000","2.400","4.800"],
                          ["ART CARTON 260 GR","5.000","10.000","4.000","8.000","3.250","6.500","3.000","6.000","2.500","5.000"],
                          ["ART CARTON 310 GR","5.500","11.000","4.500","9.000","3.750","7.500","3.500","7.000","3.300","6.600"],
                          ["BC 200",            "5.500","11.000","4.500","9.000","3.750","7.500","3.500","7.000","3.000","6.000"],
                          ["Jasmine",           "5.500","11.000","4.500","9.000","3.750","7.500","3.500","7.000","3.300","6.600"],
                          ["Linen",             "5.500","11.000","4.500","9.000","4.000","8.000","3.750","7.500","3.500","7.000"],
                          ["Oddmill 190",       "9.000","18.000","8.500","17.000","8.000","16.000","7.500","15.000","7.000","14.000"],
                          ["Ivory 230",         "5.500","11.000","4.500","9.000","3.750","7.500","3.500","7.000","3.300","6.600"],
                        ].map(([name, ...prices], rowIdx) => (
                          <tr key={rowIdx} className={`border-t border-border/30 hover:bg-secondary/20 transition-colors ${rowIdx % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                            <td className={`px-4 py-3 font-medium text-white sticky left-0 ${rowIdx % 2 === 0 ? "bg-background" : "bg-[#0d1625]"}`}>{name}</td>
                            {prices.map((p, i) => (
                              <td key={i} className={`px-3 py-3 text-center text-muted-foreground ${i % 2 === 0 && i > 0 ? "border-l border-border/20" : ""} ${p !== "–" ? "text-white/80" : ""}`}>{p}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-center py-6 px-4">
                    <Button onClick={() => openWA("Halo, saya ingin menanyakan harga cetak kertas/karton A3+.")} className="rounded-full px-8">
                      Pesan / Tanya Harga
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stiker & Label */}
            <TabsContent value="stiker" className="mt-0">
              <Card className="border-border bg-background shadow-xl overflow-hidden">
                <CardHeader className="pb-2 pt-6 px-4 md:px-6">
                  <CardTitle className="text-lg md:text-xl text-white">Harga per Lembar A3+ (INC PPN)</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Satuan: Rupiah / lembar. 1S = 1 Sisi. Stiker umumnya 1 sisi.</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs md:text-sm border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-secondary/60 text-muted-foreground">
                          <th className="text-left px-4 py-3 font-semibold text-white sticky left-0 bg-secondary/60 min-w-[160px]">Media Bahan</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap" colSpan={2}>1–5 lbr</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap border-l border-border/30" colSpan={2}>6–25 lbr</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap border-l border-border/30" colSpan={2}>26–74 lbr</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap border-l border-border/30" colSpan={2}>&gt;75 lbr</th>
                          <th className="px-3 py-3 text-center font-semibold whitespace-nowrap border-l border-border/30" colSpan={2}>&gt;100 lbr</th>
                        </tr>
                        <tr className="bg-secondary/30 text-muted-foreground text-xs">
                          <th className="sticky left-0 bg-secondary/30"></th>
                          {["1S","2S","1S","2S","1S","2S","1S","2S","1S","2S"].map((s, i) => (
                            <th key={i} className={`px-3 py-2 text-center ${i % 2 === 0 && i > 0 ? "border-l border-border/30" : ""}`}>{s}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["STICKER CROMO",      "5.500","–","4.250","–","3.750","–","3.500","–","3.000","–"],
                          ["STICKER VINYL",       "9.000","–","8.000","–","7.250","–","6.000","–","–","–"],
                          ["STICKER TRANSPARAN",  "9.000","–","8.000","–","7.250","–","7.000","–","6.000","–"],
                          ["STIKER HOLOGRAM",     "15.000","–","13.000","–","11.500","–","11.000","–","8.600","–"],
                          ["STIKER VINYL CAMEL",  "9.500","–","9.000","–","8.500","–","8.000","–","7.500","–"],
                          ["LMO 200 GR",          "12.500","25.000","12.000","24.000","11.500","23.000","10.000","20.000","9.800","19.600"],
                          ["LMO 125 GR",          "12.000","24.000","11.500","23.000","10.000","20.000","9.500","19.000","9.000","18.000"],
                          ["LMO 275 GR",          "17.000","28.000","16.000","27.000","15.000","26.500","14.500","29.000","14.000","28.000"],
                          ["STICKER SILVER",      "15.000","–","13.000","–","11.500","–","11.000","–","8.600","–"],
                          ["PVC SHEET",           "50.000","–","45.000","–","35.000","–","30.000","–","29.000","–"],
                          ["KALKIR 80 GR",        "6.000","–","5.500","–","5.000","–","4.500","–","4.200","–"],
                        ].map(([name, ...prices], rowIdx) => (
                          <tr key={rowIdx} className={`border-t border-border/30 hover:bg-secondary/20 transition-colors ${rowIdx % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                            <td className={`px-4 py-3 font-medium text-white sticky left-0 ${rowIdx % 2 === 0 ? "bg-background" : "bg-[#0d1625]"}`}>{name}</td>
                            {prices.map((p, i) => (
                              <td key={i} className={`px-3 py-3 text-center ${i % 2 === 0 && i > 0 ? "border-l border-border/20" : ""} ${p !== "–" ? "text-white/80" : "text-muted-foreground/40"}`}>{p}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-center py-6 px-4">
                    <Button onClick={() => openWA("Halo, saya ingin menanyakan harga cetak stiker/label A3+.")} className="rounded-full px-8">
                      Pesan / Tanya Harga
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Website */}
            <TabsContent value="web" className="mt-0">
              <Card className="border-border bg-background shadow-xl">
                <CardHeader className="text-center pb-8 pt-12">
                  <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">Harga Custom Sesuai Kebutuhan</CardTitle>
                  <CardDescription className="text-base max-w-lg mx-auto">
                    Harga pembuatan website disesuaikan dengan jenis, fitur, dan kompleksitas proyek Anda. Konsultasi gratis!
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-12">
                  <Button size="lg" onClick={() => openWA("Halo, saya ingin menanyakan estimasi harga pembuatan website.")} className="rounded-full px-8">
                    Konsultasi Gratis
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground mt-8">
            * Harga dapat berubah sewaktu-waktu tergantung volume dan spesifikasi kustom.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 z-0" />
        <div className="container relative z-10 mx-auto px-6 md:px-12 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-white mb-4 md:mb-6">Siap Memulai Proyek Anda?</h2>
            <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10">
              Konsultasikan kebutuhan cetak dan digital Anda dengan tim ahli kami. Kami siap memberikan penawaran terbaik.
            </p>
            <Button size="lg" onClick={() => openWA()} className="rounded-full h-12 md:h-16 px-7 md:px-10 text-base md:text-lg shadow-[0_0_30px_rgba(250,195,20,0.3)] hover:shadow-[0_0_40px_rgba(250,195,20,0.5)] w-full sm:w-auto">
              <Phone className="mr-2 w-5 h-5" /> +62 852 9011 5868
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-card/40 relative border-t border-border/50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">Hubungi Kami</h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">Mari Ciptakan Sesuatu yang Luar Biasa</h3>
              
              <div className="space-y-6 mt-10">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">WhatsApp / Telepon</h4>
                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      +62 852 9011 5868
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Email</h4>
                    <a href="mailto:uunharyanto0201@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      uunharyanto0201@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Alamat</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Dk. Kaligenteng RT 01 RW 03 Ds. Kaliboja<br />
                      Kec. Paninggaran Kab. Pekalongan
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <Card className="bg-background border-border/50 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Kirim Pesan</CardTitle>
                  <CardDescription>Isi form di bawah dan pesan Anda akan langsung dikirim melalui WhatsApp.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="nama" className="text-sm font-medium text-white">Nama Lengkap</label>
                      <Input id="nama" name="nama" required placeholder="John Doe" className="bg-secondary/30 border-border focus-visible:ring-primary h-12" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
                      <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-secondary/30 border-border focus-visible:ring-primary h-12" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="pesan" className="text-sm font-medium text-white">Pesan</label>
                      <Textarea id="pesan" name="pesan" required placeholder="Ceritakan tentang proyek Anda..." className="bg-secondary/30 border-border focus-visible:ring-primary min-h-[120px]" />
                    </div>
                    <Button type="submit" className="w-full h-12 mt-4 text-base rounded-lg group">
                      Kirim Pesan <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-primary" />
            <span className="text-xl font-display font-bold tracking-tight text-white">Moonveil <span className="text-primary">Creations</span></span>
          </div>
          
          <p className="text-muted-foreground text-sm text-center md:text-left">
            Ciptakan Kesan, Abadikan Pesan.
          </p>
          
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Moonveil Creations. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Ensure Star icon is available
function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
