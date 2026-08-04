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
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/Architect_constructing_buildings…_1080p_202608041523.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0d0d0d]"></div>
      </motion.div>

      {/* Main Text - Middle Left */}
      <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-24 z-10 mix-blend-difference">
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-left"
        >
          Designing Spaces<br />That Feel Alive.
        </motion.h1>
      </div>
      
      {/* Subtitle Text - Bottom Middle */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-center mix-blend-difference w-full px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xl text-neutral-300 font-light"
        >
          <p className="uppercase tracking-widest text-sm mb-2">Architect & Visionary</p>
          <p className="text-2xl">Mr. Lovesh Garg</p>
        </motion.div>
      </div>
    </section>
  );
}
