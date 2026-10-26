'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import siteContent from '@/data/siteContent.json';

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

  const header = (siteContent as any).header || {
    logo: '/nidhivan-tree-logo.png',
    brandName: 'Nidhivan',
    brandSubtitle: 'Design Studio',
    navLinks: [
      { id: 'philosophy', label: 'Philosophy', href: '/#philosophy' },
      { id: 'works', label: 'Works', href: '/#works' },
      { id: 'matrix', label: 'Matrix', href: '/#design-matrix' },
      { id: 'estimator', label: 'Estimator', href: '/#project-estimator' },
      { id: 'contact', label: 'Contact', href: '/#contact' }
    ],
    ctaText: '',
    ctaLink: '/estimate'
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-black/10 py-3' 
          : 'bg-white/10 backdrop-blur-sm border-b border-white/10 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-8 rounded-md bg-white p-0.5 overflow-hidden shrink-0 border border-white/20 shadow-sm flex items-center justify-center">
            <Image 
              src={header.logo || '/nidhivan-tree-logo.png'}
              alt={`${header.brandName || 'Nidhivan'} Logo`}
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div className={`font-serif text-xl md:text-2xl font-medium tracking-wide transition-colors duration-300 ${scrolled ? 'text-black' : 'text-white'}`}>
            {header.brandName || 'Nidhivan'}{' '}
            {header.brandSubtitle && (
              <span className="font-light text-xs md:text-sm tracking-widest uppercase ml-2 opacity-80">
                {header.brandSubtitle}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center">
          <nav className={`flex items-center gap-8 text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${scrolled ? 'text-black/70' : 'text-white/80'}`}>
            {(header.navLinks || []).map((link: any) => (
              <Link 
                key={link.id || link.href} 
                href={link.href} 
                className={`transition-colors ${scrolled ? 'hover:text-black' : 'hover:text-white'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

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
              {(header.navLinks || []).map((link: any) => (
                <Link 
                  key={link.id || link.href}
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 opacity-80 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
