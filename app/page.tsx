"use client";

import Link from "next/link";
import Image from "next/image";
import { Pill as PillIcon, Star, ShoppingCart } from "lucide-react";
import { getProducts } from "@/lib/actions/product-actions";
import { ProductCard } from "@/components/product-card";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useChat } from "@/components/chat-context";
import { Search, FileQuestionMark } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { HyperText } from "@/components/ui/hyper-text";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Marquee } from "@/components/ui/marquee";
import { Testimonials } from "@/components/testimonials";


export default function Home() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { openChat, setInitialMessage } = useChat();
  const [hasFinishedTyping, setHasFinishedTyping] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  useEffect(() => {
    getProducts().then(data => {
      setMedicines(data);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      openChat(searchQuery);
      setSearchQuery("");
    }
  };

  const displayedMedicines = medicines.slice(0, 8);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden  border-slate-100">
        {/* Interactive Background */}
        <motion.div
          className={`absolute inset-0 z-0 ${!hasFinishedTyping ? "pointer-events-none" : ""}`}
          initial={{ opacity: 0 }}
          animate={hasFinishedTyping ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <InteractiveGridPattern
            className="min-h-screen"
            squares={[40, 40]}
          />
        </motion.div>

        <div className="container relative z-10 px-4 text-center ">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasFinishedTyping ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className={!hasFinishedTyping ? "pointer-events-none" : ""}
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 px-4 py-1.5 rounded-full mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">

              <span className="text-sm font-bold uppercase tracking-widest text-slate-500"><AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">✨ Welcome to Xinna</AnimatedShinyText></span>
            </div>
          </motion.div>
          <div className="min-h-[140px] flex items-center justify-center">
            <TypingAnimation
              cursorStyle="underscore"
              className="text-6xl md:text-7xl font-bold uppercase tracking-tight text-slate-900 leading-tight"
              duration={50}
              onComplete={() => setHasFinishedTyping(true)}
            >
              Your Personal Health Agent
            </TypingAnimation>
          </div>
          <div className="space-y-6">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={hasFinishedTyping ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className={!hasFinishedTyping ? "pointer-events-none" : ""}
            >
              <RotatingQuotes />
            </motion.div>


            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={hasFinishedTyping ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`max-w-2xl mx-auto w-full ${!hasFinishedTyping ? "pointer-events-none" : ""}`}
              style={{ visibility: hasFinishedTyping ? "visible" : "hidden" }} // Use visibility hidden to keep layout but hide content during typing if opacity is not enough for screen readers/focus
            // Actually opacity 0 keeps layout. Visibility hidden removes it from accessibility tree but keeps layout.
            // Let's stick to opacity for visual, but maybe visibility to avoid tab focus.
            >
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white border border-slate-200 rounded-[2rem] p-2 shadow-2xl shadow-primary/5 transition-all focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/5">
                  <div className="pl-6 text-slate-400">
                    <FileQuestionMark className="size-6" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tell us about your symptoms"
                    className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg font-medium placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all transform active:scale-95"
                  >
                    Consult
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {['Headache', 'Flu & Cough', 'Vitamin', 'First Aid'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => openChat(`I need a recommendation for ${tag}`)}
                    className="text-[10px] bg-white font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors border border-slate-300 rounded-full px-4 py-1.5 hover:border-primary/20"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section >

      <div className="py-24 mx-auto border-slate-100">
        <Marquee fade pauseOnHover className="[--duration:40s]">
          {[
            "https://res.cloudinary.com/djxplzruy/image/upload/v1770018065/gavxblgfqe0b9kgbphtg.svg",
            "https://res.cloudinary.com/djxplzruy/image/upload/v1770018063/g80gsatrf8a7djyyoijr.svg",
            "https://res.cloudinary.com/djxplzruy/image/upload/v1770017823/ibugsesprskv6rbh2hdj.svg",
            "https://res.cloudinary.com/djxplzruy/image/upload/v1770017823/s304hjna65x87cybfx9j.svg",
            "https://res.cloudinary.com/djxplzruy/image/upload/v1770017824/ju2a7qo2xqwnoy3nnve5.svg"
          ].map((brand) => (
            <div key={brand} className="flex items-center justify-center px-8 grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100">
              <Image
                src={brand}
                alt={brand}
                width={360}
                height={120}
                className="h-12 md:h-32 w-auto object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Product Grid */}
      <motion.main
        ref={sectionRef}
        style={{ opacity, y, scale }}
        className="container px-4 md:px-8 py-32 mx-auto shadow-2xl shadow-primary/5 rounded-[3rem] bg-white border border-slate-100 relative z-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Our Products</h2>
            <p className="text-slate-400 text-lg font-medium">Our curated collection of premium medications.</p>
          </div>
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors border-b-2 border-primary hover:border-primary pb-1 w-fit">
            View All Products
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-x-6 lg:gap-x-10 md:gap-y-20 md:ml-0">
            {displayedMedicines.length === 0 ? (
              <div className="col-span-full h-40 flex items-center justify-center text-slate-300 italic min-w-full">
                No products available yet.
              </div>
            ) : (
              displayedMedicines.map((item: any) => (
                <CarouselItem key={item.id} className="basis-[85%] sm:basis-[50%] md:basis-auto md:pl-0">
                  <ProductCard
                    product={item}
                  />
                </CarouselItem>
              ))
            )}
          </CarouselContent>
        </Carousel>

      </motion.main>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter */}
      {/* Contact Section */}
      <section className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center p-12 md:p-24 rounded-[3rem] border border-slate-100 bg-white overflow-hidden"
        >
          {/* Background Flickering Grid */}
          <div className="absolute inset-0 z-0">
            <div>

            </div>
            <FlickeringGrid
              className="w-full h-full gradient-to-b from-primary to-blue-500"
              squareSize={4}
              gridGap={6}
              color="rgb(0, 0, 0)"
              maxOpacity={0.15}
              flickerChance={0.1}
            />
            {/* Fade effect at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
          </div>



          {/* Content */}
          <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-tight">
              Any question?
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
              Have questions about medication or need trusted medical advice? Our team of pharmacists is ready to assist you <span className="text-primary font-bold">anytime</span> to ensure your health is always the top priority.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function RotatingQuotes() {
  const [index, setIndex] = useState(0);

  const quotes = [
    '"It is health that is real wealth and not pieces of gold and silver." — Mahatma Gandhi',
    '"To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear." — Gautama Buddha',
    '"The greatest wealth is health." — Virgil',
    '"Let food be thy medicine and medicine be thy food." — Hippocrates',
    '"Early to bed and early to rise makes a man healthy, wealthy, and wise." — Benjamin Franklin'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-20 flex items-center justify-center max-w-2xl mx-auto">
      <HyperText
        key={index}
        className="text-slate-500 text-lg md:text-xl font-medium tracking-tight leading-relaxed text-center"
        duration={1000}
      >
        {quotes[index]}
      </HyperText>
    </div>
  );
}
