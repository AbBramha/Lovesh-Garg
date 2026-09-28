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

      <div className="w-full px-6 md:px-12 lg:px-20 xl:px-32 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-sm tracking-[0.3em] uppercase text-black font-semibold mb-8">Philosophy</h2>
            
            <p className="text-3xl md:text-5xl font-light leading-snug text-black">
              Architecture is not just about spaces. It's about how we experience them.
            </p>
            
            <div className="mt-12 w-16 h-[1px] bg-black"></div>
            
            <div className="mt-12 text-lg text-black/80 max-w-2xl font-light leading-relaxed space-y-6">
              <p>
                At Nidhivan Design Studio, we believe that thoughtful architecture begins with understanding people, nature, and the spaces that connect them. Every design is an opportunity to create something meaningful, where form meets function and simplicity meets purpose.
              </p>
              <p>
                We strive to create timeless spaces that embrace natural light, respect their surroundings, and bring a sense of harmony to everyday life.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
