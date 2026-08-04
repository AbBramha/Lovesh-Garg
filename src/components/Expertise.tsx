'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const areas = [
  { id: 'residential', title: 'Residential', image: '/Image-15946.jpg' },
  { id: 'commercial', title: 'Commercial', image: '/Image-4569.jpg' },
  { id: 'interiors', title: 'Interiors', image: '/Image-52072.jpg' },
  { id: 'landscape', title: 'Landscape', image: '/4th%20section.png' }, // placeholder
];

export default function Expertise() {
  return (
    <section className="bg-black text-white">
      {areas.map((area, index) => (
        <motion.div 
          key={area.id}
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
      ))}
    </section>
  );
}
