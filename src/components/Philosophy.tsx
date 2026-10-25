'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import siteContent from '@/data/siteContent.json';

export default function Philosophy() {
  const { philosophy } = siteContent;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

  return (
    <section id="philosophy" ref={containerRef} className="relative py-10 md:py-16 min-h-[100svh] md:min-h-[60vh] flex items-center overflow-hidden bg-white">
      {/* Background elements */}
      <motion.div 
        style={{ y }} 
        className="absolute inset-0 pointer-events-none -top-1/4 h-[150%]"
        initial={{ willChange: "transform" }}
      >
        {/* Desktop Image */}
        <Image 
          src={philosophy.desktopImage || "/Philosophy section.png"}
          alt="Philosophy Background Desktop"
          fill
          quality={80}
          className="object-cover object-center hidden md:block"
        />
        {/* Mobile Image */}
        <Image 
          src={philosophy.mobileImage || "/Philosophy section 9-16.png"}
          alt="Philosophy Background Mobile"
          fill
          quality={80}
          className="object-cover object-center md:hidden"
        />
      </motion.div>

      <div className="w-full px-6 md:px-10 lg:px-12 xl:px-16 relative z-10">
        <div className="max-w-3xl mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            {/* Text Content - Blended on Mobile, Normal on Desktop */}
            <div className="mix-blend-difference md:mix-blend-normal text-white md:text-black">
              <h2 className="text-xs md:text-sm tracking-[0.3em] uppercase font-semibold mb-4 text-white md:text-black">
                {philosophy.sectionTitle || "Philosophy"}
              </h2>
              
              <p className="text-xl md:text-4xl lg:text-4xl font-light leading-snug text-white md:text-black">
                {philosophy.heading}
              </p>
              
              <div className="mt-6 md:mt-8 w-12 md:w-16 h-[1px] bg-white md:bg-black"></div>
              
              <div className="mt-6 md:mt-8 text-sm md:text-base max-w-2xl font-light leading-relaxed space-y-3 md:space-y-4 text-white/90 md:text-black/80">
                <p>{philosophy.paragraph1}</p>
                {philosophy.paragraph2 && <p>{philosophy.paragraph2}</p>}
              </div>
            </div>

            {/* Architect Box - Untouched */}
            <div className="mt-8 md:mt-10 text-white font-light bg-black/80 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 md:px-6 md:py-4 shadow-2xl w-fit">
              <p className="uppercase tracking-widest text-[10px] md:text-xs mb-0.5 md:mb-1 text-white/80">
                {philosophy.architectTitle || "Architect & Visionary"}
              </p>
              <p className="text-base md:text-xl font-medium text-white">
                {philosophy.architectName || "Mr. Lovesh Garg"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
