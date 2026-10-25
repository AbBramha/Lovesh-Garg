'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import siteContent from '@/data/siteContent.json';

export default function Hero() {
  const { hero } = siteContent;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      <motion.div 
        style={{ y, opacity }} 
        className="absolute inset-0 w-full h-full"
        initial={{ willChange: "transform, opacity" }}
      >
        {/* Desktop Video */}
        <video 
          autoPlay 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60 hidden md:block"
        >
          <source src={hero.desktopVideo || "/Hero video 16-9.mp4"} type="video/mp4" />
        </video>
        {/* Mobile Video */}
        <video 
          autoPlay 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60 md:hidden"
        >
          <source src={hero.mobileVideo || "/Hero video  9-16.mp4"} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0d0d0d]"></div>
      </motion.div>

      {/* Main Text & Buttons */}
      <div className="absolute top-32 bottom-6 md:top-1/2 md:bottom-auto md:-translate-y-1/2 left-5 md:left-24 z-10 mix-blend-difference flex flex-col justify-between md:block pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 6.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-left mb-4 md:mb-8 pointer-events-auto whitespace-pre-line"
        >
          {hero.headline || "Designing Spaces\nThat Feel Alive."}
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 6.6 }}
          className="flex flex-col sm:flex-row items-start gap-2 md:gap-4 pointer-events-auto"
        >
          <Link href="#design-matrix">
            <button className="px-4 py-1.5 md:px-8 md:py-3 text-[11px] md:text-base bg-white text-black rounded md:rounded-lg font-medium tracking-wide hover:bg-neutral-200 transition-colors">
              {hero.button1Text || "Find Your Design Style"}
            </button>
          </Link>
          <Link href="#project-estimator">
            <button className="px-4 py-1.5 md:px-8 md:py-3 text-[11px] md:text-base border border-white text-white rounded md:rounded-lg font-medium tracking-wide hover:bg-white/10 transition-colors">
              {hero.button2Text || "Estimate Your Project"}
            </button>
          </Link>
        </motion.div>
      </div>
      
    </section>
  );
}
