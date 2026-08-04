'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import Image from 'next/image';

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 min-h-[80vh] flex items-center overflow-hidden bg-white">
      {/* Background elements */}
      <motion.div 
        style={{ y }} 
        className="absolute inset-0 pointer-events-none -top-1/4 h-[150%]"
        initial={{ willChange: "transform" }}
      >
        <Image 
          src="/Philosophy section.png"
          alt="Philosophy Background"
          fill
          quality={80}
          className="object-cover object-center"
        />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-sm tracking-[0.3em] uppercase text-black font-semibold mb-8">Philosophy</h2>
            
            <p className="text-3xl md:text-5xl font-light leading-snug text-black">
              Every building begins with a <span className="italic font-semibold font-serif">conversation</span> between people, light, and space.
            </p>
            
            <div className="mt-12 w-16 h-[1px] bg-black"></div>
            
            <p className="mt-12 text-lg text-black/80 max-w-2xl font-light leading-relaxed">
              We don't just build structures; we craft experiences. By understanding the intricate dance of natural light and human interaction, we shape spaces that inspire, endure, and tell a unique story of their inhabitants.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
