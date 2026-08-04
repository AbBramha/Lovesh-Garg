'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import Image from 'next/image';

const projects = [
  { id: 1, title: 'The Glass Pavilion', image: '/Image-15946.jpg', location: 'New York', area: '12,000 sq ft' },
  { id: 2, title: 'Brutal Echo', image: '/Image-4569.jpg', location: 'London', area: '8,500 sq ft' },
  { id: 3, title: 'Minimalist Haven', image: '/Image-52072.jpg', location: 'Tokyo', area: '4,200 sq ft' },
];

export default function FeaturedProjects() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.66%']); // 3 items, so translate by -66.66%

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <Image 
          src="/ChatGPT Image Aug 4, 2026, 03_48_23 PM.png"
          alt="Selected Works Background"
          fill
          quality={80}
          className="object-cover object-center pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
        
        <div className="absolute top-12 left-6 md:left-12 z-20">
          <h2 className="text-sm tracking-[0.3em] uppercase text-white font-medium">Selected Works</h2>
        </div>
        
        <motion.div 
          style={{ x }} 
          className="flex gap-16 px-6 md:px-32 relative z-10"
          initial={{ willChange: "transform" }}
        >
          {projects.map((project, index) => (
            <div key={project.id} className="w-[85vw] max-w-[400px] aspect-square flex-shrink-0 relative group shadow-2xl">
              <div className="absolute inset-0 overflow-hidden">
                <motion.div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 85vw, 400px"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <h3 className="text-3xl md:text-5xl font-light mb-2 text-white">{project.title}</h3>
                <div className="flex gap-4 text-sm text-neutral-300 font-light tracking-wide">
                  <span>{project.location}</span>
                  <span>|</span>
                  <span>{project.area}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
