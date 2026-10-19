'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';

export default function FeaturedProjects() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section id="works" className="relative min-h-[90vh] py-24 flex flex-col justify-center bg-[#0a0a0a]">
      {/* Global Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image 
          src="/ChatGPT Image Aug 4, 2026, 03_48_23 PM.png"
          alt="Selected Works Background"
          fill
          quality={80}
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
      </div>
      
      <div className="w-full relative z-10">
        <div className="px-6 md:px-12 lg:px-20 mb-8 md:mb-12 flex justify-between items-end">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/40 block mb-1">Portfolio</span>
            <h2 className="text-sm md:text-base tracking-[0.3em] uppercase text-white font-medium">Selected Works</h2>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Previous project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Next project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        
        {/* Horizontal Slider */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-8 px-6 md:px-12 lg:px-20 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-10"
        >
          {projects.map((project, index) => (
            <motion.div 
              key={project.id} 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="w-[80vw] max-w-[380px] aspect-square flex-shrink-0 relative group shadow-2xl snap-center md:snap-start"
            >
              <Link href={`/projects/${project.slug}`} className="block w-full h-full">
                <div className="absolute inset-0 overflow-hidden rounded-sm">
                  <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
                    <Image 
                      src={project.image} 
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 80vw, 380px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>

                  {/* Hover Pill Cue */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-white">
                    <span>Explore</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-gradient-to-t from-black/95 via-black/50 to-transparent">
                  <span className="text-[10px] uppercase font-mono text-white/50 block mb-1">
                    {project.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-light mb-2 text-white group-hover:text-neutral-200 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex gap-4 text-xs md:text-sm text-neutral-300 font-light tracking-wide">
                    <span>{project.location}</span>
                    <span>|</span>
                    <span>{project.area}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {/* Spacer block to ensure the last item isn't flush with the right screen edge on scroll */}
          <div className="w-[1px] flex-shrink-0"></div>
        </div>
      </div>
    </section>
  );
}
