'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20 py-3' 
          : 'bg-white/10 backdrop-blur-sm border-b border-white/10 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <div className="flex items-center gap-3">
          <div className={`relative w-12 h-10 overflow-hidden transition-all duration-300 ${scrolled ? 'invert' : ''}`}>
            <Image 
              src="/logo.png"
              alt="Nidhivan Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className={`font-serif text-xl md:text-2xl font-medium tracking-wide transition-colors duration-300 ${scrolled ? 'text-black' : 'text-white'}`}>
            Nidhivan <span className="font-light text-xs md:text-sm tracking-widest uppercase ml-2 opacity-80">Design Studio</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${scrolled ? 'text-black/70' : 'text-white/80'}`}>
          <a href="#" className={`transition-colors ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}>Philosophy</a>
          <a href="#" className={`transition-colors ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}>Works</a>
          <a href="#" className={`transition-colors ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}>Matrix</a>
          <a href="#" className={`transition-colors ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}>Contact</a>
        </nav>

        {/* Mobile Menu Icon */}
        <button className={`md:hidden focus:outline-none transition-colors duration-300 ${scrolled ? 'text-black' : 'text-white'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </motion.header>
  );
}
