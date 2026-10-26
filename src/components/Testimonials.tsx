'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import siteContent from '@/data/siteContent.json';

const defaultTestimonials = [
  {
    id: "1",
    text: "He doesn't just design buildings; he curates an entire experience of living.",
    client: "Sarah J., Residential Client",
    bg: "/6th%20section.png"
  },
  {
    id: "2",
    text: "A masterful balance of raw materiality and sublime elegance.",
    client: "Design Digest",
    bg: "/ChatGPT%20Image%20Aug%204,%202026,%2003_12_09%20PM.png"
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const list = (siteContent.testimonials && siteContent.testimonials.length > 0)
    ? siteContent.testimonials
    : defaultTestimonials;

  const activeIndex = list.length > 0 ? current % list.length : 0;
  const currentItem = list[activeIndex] || defaultTestimonials[0];

  const getCleanBgUrl = (bgPath: string) => {
    if (!bgPath) return '/6th%20section.png';
    // If spaces exist and aren't encoded, encode them
    return encodeURI(decodeURI(bgPath));
  };

  return (
    <section 
      className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white cursor-pointer select-none" 
      onClick={() => setCurrent((prev) => (prev + 1) % list.length)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.8, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${getCleanBgUrl(currentItem.bg)}")` }}
        ></motion.div>
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-3xl sm:text-4xl md:text-6xl font-light italic leading-tight mb-8 font-serif">
              "{currentItem.text}"
            </p>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-300">
              {currentItem.client}
            </p>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {list.map((_, idx) => (
            <button 
              key={idx} 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(idx);
              }}
              aria-label={`Go to review ${idx + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 cursor-pointer ${idx === activeIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
