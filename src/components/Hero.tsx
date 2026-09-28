'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
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
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60 hidden md:block"
        >
          <source src="/hero video.mp4" type="video/mp4" />
        </video>
        {/* Mobile Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60 md:hidden"
        >
          <source src="/hero reel final.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0d0d0d]"></div>
      </motion.div>

      {/* Main Text & Buttons */}
      <div className="absolute top-32 bottom-6 md:top-1/2 md:bottom-auto md:-translate-y-1/2 left-5 md:left-24 z-10 mix-blend-difference flex flex-col justify-between md:block pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-4xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-left mb-4 md:mb-8 pointer-events-auto"
        >
          Designing Spaces<br />That Feel Alive.
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-start gap-2 md:gap-4 pointer-events-auto"
        >
          <button className="px-4 py-1.5 md:px-8 md:py-3 text-[11px] md:text-base bg-white text-black rounded md:rounded-lg font-medium tracking-wide hover:bg-neutral-200 transition-colors">
            Find Your Design Style
          </button>
          <button className="px-4 py-1.5 md:px-8 md:py-3 text-[11px] md:text-base border border-white text-white rounded md:rounded-lg font-medium tracking-wide hover:bg-white/10 transition-colors">
            Estimate Your Project
          </button>
        </motion.div>
      </div>
      
      {/* Subtitle Text - Bottom Right */}
      <div className="absolute bottom-6 right-5 md:bottom-12 md:right-24 z-10 text-right">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-white font-light bg-black/40 backdrop-blur-md border border-white/10 rounded-lg md:rounded-xl px-4 py-2.5 md:px-8 md:py-6 shadow-2xl"
        >
          <p className="uppercase tracking-widest text-[8px] md:text-sm mb-0.5 md:mb-2 text-white/80">Architect & Visionary</p>
          <p className="text-sm md:text-2xl font-medium">Mr. Lovesh Garg</p>
        </motion.div>
      </div>
    </section>
  );
}
