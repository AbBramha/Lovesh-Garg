'use client';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-32 bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 items-center">
        <div className="w-full md:w-1/2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="aspect-[3/4] md:aspect-square w-full relative overflow-hidden bg-neutral-900"
          >
            <img 
              src="/5th%20section.png" 
              alt="Architect at site"
              className="w-full h-full object-cover opacity-80 mix-blend-lighten"
            />
          </motion.div>
        </div>
        
        <div className="w-full md:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-sm tracking-[0.3em] uppercase text-neutral-500 mb-6">The Studio</h2>
            <h3 className="text-4xl md:text-5xl font-light mb-8">Designing with Context</h3>
            
            <div className="space-y-6 text-neutral-400 font-light leading-relaxed">
              <p>
                Founded on the principle that architecture should be a profound response to its environment, the studio focuses on creating spaces that harmonize with their surroundings. 
              </p>
              <p>
                From the rugged landscapes of Ladakh to the dense urban fabric of modern cities, every project is an exploration of materiality, light, and human scale.
              </p>
            </div>
            
            <div className="mt-12 flex gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-3xl font-light text-white mb-2">15+</p>
                <p className="text-xs uppercase tracking-widest text-neutral-500">Years Exp</p>
              </div>
              <div>
                <p className="text-3xl font-light text-white mb-2">40+</p>
                <p className="text-xs uppercase tracking-widest text-neutral-500">Projects</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
