'use client';
import { motion } from 'framer-motion';

const steps = [
  'Discover',
  'Research',
  'Sketch',
  '3D Visualization',
  'Construction Drawings',
  'Execution',
  'Completion'
];

export default function DesignProcess() {
  return (
    <section className="py-24 bg-white text-black overflow-hidden relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[url('/4th%20section.png')] bg-cover bg-center pointer-events-none"></div>
      
      {/* Top Left Title */}
      <div className="absolute top-12 left-12 z-20">
        <h2 className="text-sm tracking-[0.3em] uppercase text-black font-semibold">Design Process</h2>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-2xl md:text-4xl font-light py-8 hover:text-black/60 transition-colors cursor-default"
              >
                {step}
              </motion.div>
              
              {index < steps.length - 1 && (
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: '40px' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="w-[2px] bg-black"
                ></motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
