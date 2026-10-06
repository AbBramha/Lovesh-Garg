'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const projects = [
  { id: 1, title: 'The Glass Pavilion', image: '/Image-15946.jpg', location: 'New York', area: '12,000 sq ft' },
  { id: 2, title: 'Brutal Echo', image: '/Image-4569.jpg', location: 'London', area: '8,500 sq ft' },
  { id: 3, title: 'Minimalist Haven', image: '/Image-52072.jpg', location: 'Tokyo', area: '4,200 sq ft' },
  { id: 4, title: 'Concrete Oasis', image: '/Image-15946.jpg', location: 'Berlin', area: '9,100 sq ft' },
  { id: 5, title: 'Timber Retreat', image: '/Image-4569.jpg', location: 'Oslo', area: '5,400 sq ft' },
  { id: 6, title: 'Urban Light', image: '/Image-52072.jpg', location: 'Paris', area: '6,800 sq ft' },
];

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
    <section className="relative min-h-[90vh] py-24 flex flex-col justify-center bg-[#0a0a0a]">
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
          <h2 className="text-sm tracking-[0.3em] uppercase text-white font-medium">Selected Works</h2>
          
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
              </div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <h3 className="text-2xl md:text-4xl font-light mb-2 text-white">{project.title}</h3>
                <div className="flex gap-4 text-xs md:text-sm text-neutral-300 font-light tracking-wide">
                  <span>{project.location}</span>
                  <span>|</span>
                  <span>{project.area}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Spacer block to ensure the last item isn't flush with the right screen edge on scroll */}
          <div className="w-[1px] flex-shrink-0"></div>
        </div>
      </div>
    </section>
  );
}
