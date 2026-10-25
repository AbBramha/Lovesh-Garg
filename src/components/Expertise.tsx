'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import siteContent from '@/data/siteContent.json';

export default function Expertise() {
  const areas = siteContent.expertise || [
    { id: 'residential', title: 'Residential', image: '/residential.png' },
    { id: 'commercial', title: 'Commercial', image: '/commercial.png' },
    { id: 'interiors', title: 'Interiors', image: '/Interiors.png' },
    { id: 'landscape', title: 'Landscape', image: '/Landscape.png' },
  ];
  return (
    <section id="expertise" className="bg-black text-white">
      {areas.map((area, index) => (
        <Link key={area.id} href="/#contact" className="block w-full">
          <motion.div 
            className="relative h-[25vh] md:h-[33vh] w-full overflow-hidden group cursor-pointer border-b border-white/10"
            initial="initial"
            whileHover="hover"
          >
            <motion.div 
              className="absolute inset-0 opacity-40 mix-blend-luminosity transition-all duration-700"
              variants={{
                initial: { scale: 1, opacity: 0.3 },
                hover: { scale: 1.05, opacity: 0.7, mixBlendMode: 'normal' }
              } as any}
            >
              <Image 
                src={area.image}
                alt={area.title}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
            
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700"></div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.h3 
                className="text-4xl md:text-6xl font-light uppercase tracking-widest text-transparent"
                style={{ WebkitTextStroke: '1px white' }}
                variants={{
                  initial: { WebkitTextStroke: '1px rgba(255,255,255,0.5)', color: 'transparent' },
                  hover: { WebkitTextStroke: '1px white', color: 'white' }
                } as any}
                transition={{ duration: 0.4 }}
              >
                {area.title}
              </motion.h3>
            </div>
          </motion.div>
        </Link>
      ))}
    </section>
  );
}
