'use client';
import { motion } from 'framer-motion';

const experiences = [
  { year: '2022', title: 'National Architecture Award', category: 'Awards' },
  { year: '2019', title: 'Studio Founded', category: 'Milestone' },
  { year: '2015', title: 'Master of Architecture, AA London', category: 'Education' },
  { year: '2012', title: 'Junior Architect at ZHA', category: 'Experience' }
];

export default function Experience() {
  return (
    <section className="relative py-32 bg-black text-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-80" 
        style={{ backgroundImage: "url('/Timeline_installation_architectu…_2K_202608041602.jpeg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h2 className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-16 text-center">Recognition & Experience</h2>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col md:flex-row justify-between items-baseline border-b border-white/10 pb-8 hover:border-white/40 transition-colors"
            >
              <div className="flex gap-12 items-baseline">
                <span className="text-xl md:text-2xl font-light text-neutral-500">{exp.year}</span>
                <span className="text-2xl md:text-3xl font-light">{exp.title}</span>
              </div>
              <span className="text-xs uppercase tracking-widest text-neutral-600 mt-4 md:mt-0">{exp.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
