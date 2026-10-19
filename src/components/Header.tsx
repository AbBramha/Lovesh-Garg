'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      transition={{ duration: 0.8, ease: "easeOut", delay: 6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20 py-3' 
          : 'bg-white/10 backdrop-blur-sm border-b border-white/10 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
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
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${scrolled ? 'text-black/70' : 'text-white/80'}`}>
          <Link href="/#philosophy" className={`transition-colors ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}>Philosophy</Link>
          <Link href="/#works" className={`transition-colors ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}>Works</Link>
          <Link href="/#design-matrix" className={`transition-colors ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}>Matrix</Link>
          <Link href="/#contact" className={`transition-colors ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}>Contact</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          className={`md:hidden p-1 focus:outline-none transition-colors duration-300 ${scrolled ? 'text-black' : 'text-white'}`}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden px-6 py-5 border-t ${
              scrolled 
                ? 'bg-white/95 backdrop-blur-xl border-black/10 text-black' 
                : 'bg-black/95 backdrop-blur-xl border-white/10 text-white'
            }`}
          >
            <nav className="flex flex-col gap-4 text-xs font-semibold tracking-widest uppercase">
              <Link 
                href="/#philosophy" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 opacity-80 hover:opacity-100 transition-opacity"
              >
                Philosophy
              </Link>
              <Link 
                href="/#works" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 opacity-80 hover:opacity-100 transition-opacity"
              >
                Works
              </Link>
              <Link 
                href="/#design-matrix" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 opacity-80 hover:opacity-100 transition-opacity"
              >
                Matrix
              </Link>
              <Link 
                href="/#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 opacity-80 hover:opacity-100 transition-opacity"
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
