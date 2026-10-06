'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type ProjectType = 'Residential' | 'Commercial' | 'Interior';
type FinishQuality = 'Standard' | 'Premium' | 'Luxury';
type Currency = 'INR' | 'USD';

const baseRates: Record<ProjectType, number> = {
  Residential: 1500,
  Commercial: 2000,
  Interior: 500
};

const qualityMultipliers: Record<FinishQuality, number> = {
  Standard: 1.0,
  Premium: 1.3,
  Luxury: 1.8
};

const USD_TO_INR = 83;
const SQM_TO_SQFT = 10.764;

export default function EstimatePage() {
  const [projectType, setProjectType] = useState<ProjectType>('Residential');
  const [finishQuality, setFinishQuality] = useState<FinishQuality>('Standard');
  const [area, setArea] = useState<number>(1500);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert displayed area to actual SqFt for math if USD (SqM) is selected
  const areaInSqFt = currency === 'INR' ? area : area * SQM_TO_SQFT;
  
  // Calculate Base Cost in INR
  const baseCostInr = areaInSqFt * baseRates[projectType] * qualityMultipliers[finishQuality];
  
  // Convert final cost to selected currency
  const finalCost = currency === 'INR' ? baseCostInr : baseCostInr / USD_TO_INR;

  // Create a reasonable estimate range (-5% to +15%)
  const minCost = finalCost * 0.95;
  const maxCost = finalCost * 1.15;

  const formatCurrency = (value: number, curr: Currency) => {
    if (curr === 'INR') {
      if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)} Cr`;
      } else if (value >= 100000) {
        return `₹${(value / 100000).toFixed(2)} L`;
      }
      return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    } else {
      // Use K for thousands, M for millions in USD
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}k`;
      }
      return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
  };

  const handleCurrencyToggle = () => {
    if (currency === 'INR') {
      setCurrency('USD');
      setArea(Math.round(area / SQM_TO_SQFT)); // Convert current value to SqM
    } else {
      setCurrency('INR');
      setArea(Math.round(area * SQM_TO_SQFT)); // Convert current value back to SqFt
    }
  };

  const maxSliderValue = currency === 'INR' ? 10000 : 1000;

  return (
    <main className="bg-[#050505] text-white min-h-screen py-16 md:py-24 overflow-x-hidden font-sans relative">
      
      <Link href="/#project-estimator" className="absolute top-6 left-6 md:top-8 md:left-8 text-white/50 hover:text-white uppercase tracking-widest text-xs z-50 flex items-center gap-2 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>

      {/* Futuristic Ambient Neon Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left Cool Cyan Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/15 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
        {/* Bottom Right Deep Violet Glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        {/* Center Light Maroon Glow */}
        <div className="absolute top-[30%] left-[20%] w-[50%] h-[50%] bg-rose-800/20 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10 mt-12">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="uppercase tracking-widest text-xs font-semibold text-white/50 mb-4 block">Project Estimator</span>
          <h1 className="text-4xl md:text-6xl font-light mb-6 font-serif">The Digital Blueprint</h1>
          <p className="text-lg text-white/60">
            Select your parameters to calculate a rough construction estimate for your space.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 relative pb-24 md:pb-0">
          
          {/* LEFT PANEL: Inputs */}
          <div className="w-full md:w-3/5 flex flex-col gap-10">
            
            {/* Currency Toggle */}
            <div className="flex items-center justify-end">
              <div className="bg-white/5 p-1 rounded-full flex items-center border border-white/10">
                <button 
                  onClick={() => currency !== 'INR' && handleCurrencyToggle()}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-all ${currency === 'INR' ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'}`}
                >
                  🇮🇳 INR / Sq.Ft
                </button>
                <button 
                  onClick={() => currency !== 'USD' && handleCurrencyToggle()}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-all ${currency === 'USD' ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'}`}
                >
                  🌍 USD / Sq.M
                </button>
              </div>
            </div>

            {/* Project Type */}
            <div>
              <label className="uppercase tracking-widest text-xs font-semibold text-white/50 mb-4 block">1. Project Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Residential', 'Commercial', 'Interior'] as ProjectType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setProjectType(type)}
                    className={`py-4 px-4 border rounded-lg text-sm tracking-wide transition-all duration-300 ${projectType === type ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/60 hover:border-white/30 hover:bg-white/5'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Slider */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="uppercase tracking-widest text-xs font-semibold text-white/50 block">2. Total Area ({currency === 'INR' ? 'Sq.Ft' : 'Sq.M'})</label>
                <div className="bg-transparent border-b border-white/30 px-2 py-1 flex items-center gap-2">
                  <input 
                    type="number" 
                    value={area}
                    onChange={(e) => setArea(Math.max(0, parseInt(e.target.value) || 0))}
                    className="bg-transparent text-right w-20 outline-none text-xl font-light text-white"
                  />
                  <span className="text-white/40 text-sm">{currency === 'INR' ? 'sq.ft' : 'sq.m'}</span>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max={maxSliderValue} 
                step={currency === 'INR' ? 100 : 10}
                value={area}
                onChange={(e) => setArea(parseInt(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-white/30 text-xs mt-2 font-mono">
                <span>0</span>
                <span>{maxSliderValue}+</span>
              </div>
            </div>

            {/* Finish Quality */}
            <div>
              <label className="uppercase tracking-widest text-xs font-semibold text-white/50 mb-4 block">3. Finish Quality</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Standard', 'Premium', 'Luxury'] as FinishQuality[]).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setFinishQuality(quality)}
                    className={`py-4 px-4 border rounded-lg text-sm tracking-wide transition-all duration-300 ${finishQuality === quality ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/60 hover:border-white/30 hover:bg-white/5'}`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Live Calculator (Sticky on Desktop, Fixed Bottom on Mobile) */}
          <div className={`w-full md:w-2/5 ${isMobile ? 'fixed bottom-0 left-0 right-0 z-50 p-2 bg-black/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]' : 'sticky top-24 self-start'}`}>
            <div className={`bg-white/5 border border-white/10 ${isMobile ? 'rounded-xl p-4 flex flex-col gap-1' : 'rounded-2xl p-8'} relative overflow-hidden backdrop-blur-md`}>
              
              {/* Background abstract element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 blur-[100px] rounded-full"></div>

              <span className={`uppercase tracking-widest font-semibold text-white/50 block ${isMobile ? 'text-[10px] mb-1' : 'text-xs mb-6'}`}>Estimated Construction Cost</span>
              
              <div className={`${isMobile ? 'mb-1' : 'mb-2'}`}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={minCost + maxCost}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMobile ? 'flex-row items-baseline gap-2' : 'flex-col xl:flex-row xl:items-baseline gap-2'}`}
                  >
                    <span className={`font-light font-serif tracking-tight text-white ${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl lg:text-6xl'}`}>
                      {formatCurrency(minCost, currency)}
                    </span>
                    <span className={`font-light mx-1 ${isMobile ? 'text-lg text-white/40' : 'text-2xl text-white/40 hidden xl:inline'}`}>-</span>
                    <span className={`font-light font-serif tracking-tight text-white/60 ${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'}`}>
                      {formatCurrency(maxCost, currency)}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {!isMobile && (
                <p className="text-xs text-white/40 mb-8 italic">
                  *This is a rough preliminary estimate. Actual costs vary based on site conditions, material choices, and timeline.
                </p>
              )}

              <button className={`w-full bg-white text-black font-medium uppercase tracking-widest hover:bg-neutral-200 transition-colors ${isMobile ? 'py-3 rounded-lg text-xs mt-2' : 'py-5 rounded-lg text-sm'}`}>
                Get Detailed Quote
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
