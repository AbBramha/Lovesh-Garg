'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DesignMatrix() {
  return (
    <section id="design-matrix" className="bg-black text-white min-h-screen py-24 md:py-32 overflow-hidden font-sans flex items-center">
      <div className="container mx-auto px-6 max-w-7xl relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-6xl font-light mb-8 font-serif leading-tight">
            Discover the design language that feels like you.
          </h2>
          <p className="text-xl md:text-2xl font-light mb-12 text-white/70 italic">
            “Architecture is more than choosing a style. It is about how you want to feel, live, interact and experience a space.”
          </p>
          <p className="mb-12 text-white/60 uppercase tracking-widest text-sm font-semibold">
            5 questions · 60 seconds · Discover your Design Matrix
          </p>
          <Link href="/matrix">
            <button 
              className="bg-white text-black px-10 py-4 uppercase tracking-widest text-sm hover:bg-white/80 transition-colors"
            >
              Start Experience
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
