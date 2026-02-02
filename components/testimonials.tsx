"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";

const testimonials = [
    {
        id: 1,
        category: "Chronic Care",
        title: "Managing Diabetes seamlessly",
        description: "Xinna has completely changed how I track my glucose levels and medication. It's like having a doctor in my pocket.",
        author: "Ahmad Zul",
        role: "Diabetes Patient",
        image: "/placeholder-user.jpg",
    },
    {
        id: 2,
        category: "Fitness & Wellness",
        title: "Optimizing my recovery",
        description: "The integration with my wearable data is flawless. Xinna gives me actionable insights that actually improve my sleep.",
        author: "Sarah Chen",
        role: "Yoga Instructor",
        image: "/placeholder-user-2.jpg",
    },
    {
        id: 3,
        category: "General Health",
        title: "Always there when I'm sick",
        description: "I love how quickly I can get a consultation. The AI agent understood my symptoms immediately and suggested the right path.",
        author: "Budi Santoso",
        role: "Software Engineer",
        image: "/placeholder-user-3.jpg",
    }
];

export function Testimonials() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const activeTestimonial = testimonials[current];

    return (
        <section className="pt-32 overflow-hidden">
            {/* Split Header */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-slate-900"
                    >
                        Built for <br />
                        the patient-first era
                    </motion.h2>
                    <div className="flex flex-col justify-end">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 text-lg md:text-xl font-medium max-w-md leading-relaxed"
                        >
                            Xinna is built for user trust, whether you're managing a chronic condition, a wellness enthusiast, or seeking quick medical advice.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Carousel Section (Cards Only) - Bleed to edges */}
            <div className="relative w-full">
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: false, // Set to false to better handle the start alignment
                    }}
                    className="w-full"
                >
                    <CarouselContent className="ml-12 gap-4">
                        {testimonials.map((item) => (
                            <CarouselItem key={item.id} className="pl-4 basis-full md:basis-[80%] lg:basis-[60%]">
                                <TestimonialCard item={item} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                <div className="container mx-auto px-4 mt-16">
                    {/* Content Below (Animated Fade-In) */}
                    <div className="min-h-[160px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                                    <div className="space-y-2 shrink-0">
                                        <h4 className="text-xl font-black uppercase tracking-tight text-slate-900">{activeTestimonial.author}</h4>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{activeTestimonial.role}</p>
                                        <p className="text-slate-500 font-medium max-w-2xl text-lg md:text-2xl leading-snug">
                                            "{activeTestimonial.description}"
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        {/* Navigation Controls */}
                        <div className="flex items-center gap-4 mt-8 justify-start">
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full hover:bg-slate-50 border-1 shadow-sm transition-transform active:scale-90"
                                    onClick={() => api?.scrollPrev()}
                                >
                                    <ArrowLeft className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-10 rounded-full hover:bg-slate-50 border-1 shadow-sm transition-transform active:scale-90"
                                    onClick={() => api?.scrollNext()}
                                >
                                    <ArrowRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <Separator className="mt-8" />
                    </div>

                </div>
            </div>

        </section>
    );
}

function TestimonialCard({ item }: { item: typeof testimonials[0] }) {
    return (
        <div className="w-full group cursor-pointer">
            {/* Visual Card Area Only */}
            <div className="relative aspect-[16/10] md:aspect-[21/10] rounded-[3rem] overflow-hidden bg-slate-100 border border-slate-200/60 shadow-2xl shadow-slate-200/30">
                {/* Background Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                        <div className="size-12 rounded-full border-2 border-slate-400 border-dashed" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Insert Image Here</span>
                    </div>
                </div>

                {/* Category Overlay (Top Left) */}
                <div className="absolute inset-x-8 top-10 md:top-16 md:inset-x-12">
                    <h3 className="text-4xl md:text-7xl font-bold text-slate-900 uppercase tracking-tighter decoration-2 transition-all group-hover:scale-[1.02] origin-left">
                        {item.category.split(' ')[0]}<br />
                        {item.category.split(' ').slice(1).join(' ')}
                    </h3>
                </div>
            </div>

        </div>
    );
}
