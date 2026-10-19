'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProjectEstimator() {
  return (
    <section id="project-estimator" className="bg-[#050505] text-white py-24 md:py-32 overflow-hidden font-sans border-t border-white/5 relative flex items-center min-h-[60vh]">
      
      {/* Futuristic Ambient Neon Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left Cool Cyan Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/15 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
        {/* Bottom Right Deep Violet Glow */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        {/* Center Light Maroon Glow */}
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-rose-800/30 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="uppercase tracking-[0.25em] text-xs font-semibold text-white/50 mb-4 block font-mono">Budget Estimator</span>
          <h2 className="text-4xl md:text-6xl font-light mb-8 font-serif leading-tight">
            The Project Blueprint
          </h2>
          <p className="text-xl md:text-2xl font-light mb-12 text-white/70 italic">
            "Clarity is the first step of construction. Calculate an indicative architectural & interior budget for your space before the first line is drawn."
          </p>
          <p className="mb-12 text-white/60 uppercase tracking-widest text-xs md:text-sm font-semibold font-mono">
            3 simple questions · Architecture & Interior · Essential, Premium & Luxury Packages
          </p>
          <Link href="/estimate">
            <button 
              className="bg-white text-black px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-[0_0_25px_rgba(255,255,255,0.25)]"
            >
              Estimate Your Project
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
