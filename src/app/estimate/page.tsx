'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type ServiceType = 'Architecture' | 'Interior';
type PropertyType = 'Independent House' | 'Apartment / Flat' | 'Commercial / Flat';
type PackageTier = 'Essential' | 'Premium' | 'Luxury';
type AreaUnit = 'SQFT' | 'SQM';

interface PackageRates {
  Architecture: { sqft: number; sqm: number };
  Interior: { sqft: number; sqm: number };
}

// Exact calculation rates from the brief
const ratesTable: Record<PackageTier, PackageRates> = {
  Essential: {
    Architecture: { sqft: 1300, sqm: 13988 },
    Interior: { sqft: 1200, sqm: 12912 }
  },
  Premium: {
    Architecture: { sqft: 1500, sqm: 16140 },
    Interior: { sqft: 1500, sqm: 16140 }
  },
  Luxury: {
    Architecture: { sqft: 1500, sqm: 16140 },
    Interior: { sqft: 2200, sqm: 23672 }
  }
};

const serviceCards = [
  {
    id: 'Architecture' as ServiceType,
    title: 'Architecture',
    subtitle: 'Ground-up Planning & Envelope',
    desc: 'Spatial flow, site layout, architectural elevations, structural concept, and facade engineering.',
    img: '/matrix/Bold & Dramatic.jpg'
  },
  {
    id: 'Interior' as ServiceType,
    title: 'Interior',
    subtitle: 'Interior Architecture & Millwork',
    desc: 'Interior zoning, bespoke joinery, materiality, decorative finishes, custom lighting, and styling.',
    img: '/matrix/Calm & Refined (Clean lines, neutral colours).jpg'
  }
];

const propertyTypes = [
  {
    id: 'Independent House' as PropertyType,
    title: 'Independent House',
    subtitle: 'Villas, Bungalows & Estates',
    desc: 'Private residences, farmhouses, and standalone multi-level family villas.',
    img: '/matrix/Tropical Modern.jpg'
  },
  {
    id: 'Apartment / Flat' as PropertyType,
    title: 'Apartment / Flat',
    subtitle: 'Penthouses & High-Rises',
    desc: 'Luxury condominium interiors, floor-through apartments, and duplex penthouses.',
    img: '/matrix/Modern Minimal.jpg'
  },
  {
    id: 'Commercial / Flat' as PropertyType,
    title: 'Commercial / Flat',
    subtitle: 'Offices, Studios & Retail',
    desc: 'Boutique office suites, corporate studios, design-led retail, and creative commercial spaces.',
    img: '/matrix/Industrial.jpg'
  }
];

const packageTiers = [
  {
    id: 'Essential' as PackageTier,
    title: 'Essential',
    tag: 'Clean & Cost-Effective',
    desc: 'Disciplined spatial planning, clean architectural lines, durable standard finishes, and optimized execution.',
    img: '/matrix/Modern Minimal.jpg',
    features: ['Optimized spatial zoning', 'Durable engineered finishes', 'Quality functional lighting', 'Clean modern detailing']
  },
  {
    id: 'Premium' as PackageTier,
    title: 'Premium',
    tag: 'Most Popular',
    desc: 'Elevated architectural detailing, natural stones, rich timber veneers, custom ambient lighting, and bespoke joinery.',
    img: '/matrix/Japandi.jpg',
    features: ['Custom architectural accents', 'Natural stone & fine timber', 'Layered architectural lighting', 'Bespoke built-in joinery']
  },
  {
    id: 'Luxury' as PackageTier,
    title: 'Luxury',
    tag: 'Bespoke Opulence',
    desc: 'Uncompromising artisanal craftsmanship, imported bookmatched marble, signature metalwork, and grand custom finishes.',
    img: '/matrix/Contemporary Luxury.jpg',
    features: ['Imported bookmatched marble', 'Handcrafted brass & fluted wood', 'Statement decorative illumination', 'Full luxury concierge execution']
  }
];

export default function EstimatePage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  // User selections
  const [services, setServices] = useState<ServiceType[]>(['Architecture']);
  const [propertyType, setPropertyType] = useState<PropertyType>('Independent House');
  const [area, setArea] = useState<number>(2500);
  const [unit, setUnit] = useState<AreaUnit>('SQFT');
  const [packageTier, setPackageTier] = useState<PackageTier>('Premium');

  // Load state from sessionStorage on mount
  useEffect(() => {
    const savedStep = sessionStorage.getItem('estimateStep');
    const savedData = sessionStorage.getItem('estimateData');

    if (savedStep) {
      setStep(parseInt(savedStep, 10));
    }
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.services) setServices(parsed.services);
        if (parsed.propertyType) setPropertyType(parsed.propertyType);
        if (parsed.area) setArea(parsed.area);
        if (parsed.unit) setUnit(parsed.unit);
        if (parsed.packageTier) setPackageTier(parsed.packageTier);
      } catch (e) {
        console.error(e);
      }
    }
    setMounted(true);
  }, []);

  // Save state to sessionStorage
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem('estimateStep', step.toString());
      sessionStorage.setItem(
        'estimateData',
        JSON.stringify({ services, propertyType, area, unit, packageTier })
      );
    }
  }, [step, services, propertyType, area, unit, packageTier, mounted]);

  const toggleService = (s: ServiceType) => {
    setServices((prev) => {
      if (prev.includes(s)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((item) => item !== s);
      } else {
        return [...prev, s];
      }
    });
  };

  const handleUnitToggle = (newUnit: AreaUnit) => {
    if (newUnit === unit) return;
    if (newUnit === 'SQM') {
      setUnit('SQM');
      setArea(Math.round(area / 10.764));
    } else {
      setUnit('SQFT');
      setArea(Math.round(area * 10.764));
    }
  };

  // Calculation Math
  const rates = ratesTable[packageTier];
  const isSqft = unit === 'SQFT';

  const archRate = isSqft ? rates.Architecture.sqft : rates.Architecture.sqm;
  const interiorRate = isSqft ? rates.Interior.sqft : rates.Interior.sqm;

  const archCost = services.includes('Architecture') ? area * archRate : 0;
  const interiorCost = services.includes('Interior') ? area * interiorRate : 0;
  const totalCost = archCost + interiorCost;

  const minRange = totalCost * 0.95;
  const maxRange = totalCost * 1.10;

  const formatCost = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleNext = () => {
    if (step < 4) setStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleReset = () => {
    sessionStorage.removeItem('estimateStep');
    sessionStorage.removeItem('estimateData');
    setStep(1);
    setServices(['Architecture']);
    setPropertyType('Independent House');
    setArea(2500);
    setUnit('SQFT');
    setPackageTier('Premium');
  };

  return (
    <main className="bg-[#050505] text-white min-h-[100svh] py-6 md:py-10 flex flex-col font-sans relative overflow-x-hidden">
      {/* Top Navigation */}
      <Link
        href="/#project-estimator"
        onClick={handleReset}
        className="absolute top-6 left-6 md:top-8 md:left-8 text-white/50 hover:text-white uppercase tracking-widest text-xs z-50 flex items-center gap-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* Futuristic Background Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute top-[35%] left-[25%] w-[45%] h-[45%] bg-rose-800/15 blur-[140px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10 flex-1 flex flex-col justify-center mt-12 md:mt-8">
        <AnimatePresence mode="wait">
          {/* QUESTION 01: What type of project are you planning? (Multi-select) */}
          {step === 1 && (
            <motion.div
              key="q1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="mb-8 md:mb-10">
                <span className="uppercase tracking-[0.25em] text-[10px] md:text-xs font-semibold text-white/50 mb-2 block font-mono">
                  Question 01 / 03
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-light mb-3">
                  What type of project are you planning?
                </h2>
                <p className="text-sm md:text-base text-white/70 max-w-2xl font-light">
                  Select <span className="text-white font-medium">Architecture</span>, <span className="text-white font-medium">Interior</span>, or choose both for an integrated end-to-end design service. (Multiple selections allowed)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {serviceCards.map((card) => {
                  const isSelected = services.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => toggleService(card.id)}
                      className={`cursor-pointer transition-all duration-300 rounded-sm border p-4 md:p-6 bg-white/[0.03] backdrop-blur-sm group ${
                        isSelected
                          ? 'border-white bg-white/[0.08] shadow-[0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white/50'
                          : 'border-white/10 hover:border-white/30 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="relative aspect-[16/10] mb-5 overflow-hidden rounded-sm">
                        <Image
                          src={card.img}
                          alt={card.title}
                          fill
                          className={`object-cover transition-transform duration-700 ${
                            isSelected ? 'scale-105' : 'group-hover:scale-105'
                          }`}
                        />
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full border flex items-center justify-center transition-all bg-black/60 backdrop-blur-md border-white/40">
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-serif font-light text-white">{card.title}</h3>
                        <span className="text-[10px] uppercase tracking-widest text-white/50 font-mono">
                          {card.subtitle}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-xs text-white/40 italic font-mono">
                  {services.length === 2 ? 'Both Architecture & Interior selected' : `${services[0]} selected`}
                </span>
                <button
                  onClick={handleNext}
                  disabled={services.length === 0}
                  className="bg-white text-black px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-white/10"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* QUESTION 02: Tell us about your project (Property Type & Area) */}
          {step === 2 && (
            <motion.div
              key="q2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="mb-6 md:mb-8">
                <span className="uppercase tracking-[0.25em] text-[10px] md:text-xs font-semibold text-white/50 mb-2 block font-mono">
                  Question 02 / 03
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-light mb-2">
                  Tell us about your project
                </h2>
                <p className="text-sm md:text-base text-white/70 max-w-2xl font-light">
                  Select your property typology and adjust the anticipated built-up area.
                </p>
              </div>

              {/* 1. Property Type Selector */}
              <div className="mb-8">
                <label className="uppercase tracking-widest text-[11px] font-semibold text-white/50 mb-3 block font-mono">
                  1. Property Typology
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {propertyTypes.map((prop) => {
                    const isSelected = propertyType === prop.id;
                    return (
                      <div
                        key={prop.id}
                        onClick={() => setPropertyType(prop.id)}
                        className={`cursor-pointer transition-all duration-300 rounded-sm border p-3.5 bg-white/[0.03] backdrop-blur-sm group ${
                          isSelected
                            ? 'border-white bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.12)] ring-1 ring-white/40'
                            : 'border-white/10 hover:border-white/30 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="relative aspect-video mb-3 overflow-hidden rounded-sm">
                          <Image
                            src={prop.img}
                            alt={prop.title}
                            fill
                            className={`object-cover transition-transform duration-700 ${
                              isSelected ? 'scale-105' : 'group-hover:scale-105'
                            }`}
                          />
                        </div>
                        <h4 className="text-base font-serif font-light text-white mb-1">{prop.title}</h4>
                        <p className="text-[11px] text-white/50 leading-relaxed font-light line-clamp-2">
                          {prop.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Project Area Input & Slider with SQFT / SQM Toggle */}
              <div className="bg-white/[0.03] border border-white/10 rounded-sm p-6 mb-8 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <label className="uppercase tracking-widest text-[11px] font-semibold text-white/50 block font-mono">
                      2. Project Area
                    </label>
                    <span className="text-xs text-white/40 font-light">
                      Enter the estimated built-up area of your space
                    </span>
                  </div>

                  {/* Unit Toggle Button */}
                  <div className="bg-black/60 p-1 rounded-full flex items-center border border-white/10 self-start sm:self-auto">
                    <button
                      onClick={() => handleUnitToggle('SQFT')}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all font-mono ${
                        unit === 'SQFT' ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      SQ.FT
                    </button>
                    <button
                      onClick={() => handleUnitToggle('SQM')}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all font-mono ${
                        unit === 'SQM' ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      SQ.M
                    </button>
                  </div>
                </div>

                {/* Number Input & Display */}
                <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-6">
                  <span className="text-sm text-white/60 font-light">Total Estimated Area:</span>
                  <div className="flex items-baseline gap-2">
                    <input
                      type="number"
                      min={100}
                      max={isSqft ? 30000 : 3000}
                      value={area || ''}
                      onChange={(e) => setArea(Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-transparent text-right w-32 outline-none text-2xl md:text-3xl font-serif text-white border-none focus:ring-0"
                    />
                    <span className="text-white/50 font-mono text-sm uppercase">{unit}</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={isSqft ? 500 : 50}
                  max={isSqft ? 15000 : 1500}
                  step={isSqft ? 100 : 10}
                  value={area}
                  onChange={(e) => setArea(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-[10px] text-white/40 uppercase font-mono mr-2">Quick Presets:</span>
                  {(isSqft ? [1200, 2500, 4500, 8000] : [110, 230, 420, 750]).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setArea(preset)}
                      className={`text-xs px-3 py-1 rounded-sm border transition-colors font-mono ${
                        area === preset
                          ? 'border-white bg-white/20 text-white'
                          : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {preset.toLocaleString()} {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <button
                  onClick={handlePrev}
                  className="border border-white/30 text-white px-8 py-3.5 uppercase tracking-widest text-xs font-semibold hover:bg-white/10 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!area || area <= 0}
                  className="bg-white text-black px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-white/10"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* QUESTION 03: Choose your preferred package? (Essential / Premium / Luxury) */}
          {step === 3 && (
            <motion.div
              key="q3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="mb-8 md:mb-10">
                <span className="uppercase tracking-[0.25em] text-[10px] md:text-xs font-semibold text-white/50 mb-2 block font-mono">
                  Question 03 / 03
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-light mb-3">
                  Choose your preferred package
                </h2>
                <p className="text-sm md:text-base text-white/70 max-w-2xl font-light">
                  Select a tier reflecting your desired standard of finishes, materials, and architectural detailing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {packageTiers.map((tier) => {
                  const isSelected = packageTier === tier.id;
                  const tierRates = ratesTable[tier.id];
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setPackageTier(tier.id)}
                      className={`cursor-pointer transition-all duration-300 rounded-sm border p-5 bg-white/[0.03] backdrop-blur-sm flex flex-col justify-between group ${
                        isSelected
                          ? 'border-white bg-white/[0.08] shadow-[0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white/50'
                          : 'border-white/10 hover:border-white/30 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div>
                        <div className="relative aspect-[16/10] mb-4 overflow-hidden rounded-sm">
                          <Image
                            src={tier.img}
                            alt={tier.title}
                            fill
                            className={`object-cover transition-transform duration-700 ${
                              isSelected ? 'scale-105' : 'group-hover:scale-105'
                            }`}
                          />
                          <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 border border-white/20 text-[10px] font-semibold tracking-wider uppercase text-white/90">
                            {tier.tag}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-2xl font-serif font-light text-white">{tier.title}</h3>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white text-black' : 'border-white/30'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                        </div>

                        {/* Rate preview badges */}
                        <div className="flex items-center gap-2 mb-3 font-mono text-[11px] text-white/60">
                          <span>Arch: ₹{tierRates.Architecture.sqft}/ft²</span>
                          <span>•</span>
                          <span>Int: ₹{tierRates.Interior.sqft}/ft²</span>
                        </div>

                        <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                          {tier.desc}
                        </p>
                      </div>

                      {/* Feature Points */}
                      <div className="pt-3 border-t border-white/10">
                        <ul className="flex flex-col gap-1.5">
                          {tier.features.map((feat, idx) => (
                            <li key={idx} className="text-[11px] text-white/50 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-white/60" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <button
                  onClick={handlePrev}
                  className="border border-white/30 text-white px-8 py-3.5 uppercase tracking-widest text-xs font-semibold hover:bg-white/10 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="bg-white text-black px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-md shadow-white/10"
                >
                  Calculate Estimate
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: FINAL RESULT SCREEN */}
          {step === 4 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto w-full pb-16"
            >
              {/* Top Banner */}
              <div className="text-center mb-10">
                <span className="uppercase tracking-[0.25em] text-xs font-semibold text-white/50 mb-3 block font-mono">
                  Indicative Construction Estimate
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-light mb-4">
                  The Project Blueprint
                </h2>
                <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto font-light leading-relaxed">
                  Calculated based on your selection of <span className="text-white font-normal">{services.join(' & ')}</span> for a <span className="text-white font-normal">{propertyType}</span> under the <span className="text-white font-normal">{packageTier}</span> specification tier.
                </p>
              </div>

              {/* Hero Cost Box */}
              <div className="bg-white/[0.04] border border-white/15 rounded-sm p-8 md:p-12 mb-8 backdrop-blur-md relative overflow-hidden text-center shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[90px] pointer-events-none" />

                <span className="uppercase tracking-widest text-xs font-semibold text-white/50 block mb-3 font-mono">
                  Total Estimated Construction Cost
                </span>

                <div className="mb-3">
                  <span className="text-5xl md:text-7xl font-serif font-light tracking-tight text-white block">
                    {formatCost(totalCost)}
                  </span>
                </div>

                <div className="text-xs md:text-sm text-white/50 font-mono mb-8">
                  Indicative Budget Range: <span className="text-white/80">{formatCost(minRange)} – {formatCost(maxRange)}</span>
                </div>

                {/* Parameters Pill Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 pt-6 text-left">
                  <div className="border-r border-white/10 pr-2">
                    <span className="text-[10px] uppercase font-mono text-white/40 block">Service Scope</span>
                    <span className="text-xs md:text-sm text-white font-serif">{services.join(' + ')}</span>
                  </div>
                  <div className="border-r border-white/10 pr-2">
                    <span className="text-[10px] uppercase font-mono text-white/40 block">Property Type</span>
                    <span className="text-xs md:text-sm text-white font-serif">{propertyType}</span>
                  </div>
                  <div className="border-r border-white/10 pr-2">
                    <span className="text-[10px] uppercase font-mono text-white/40 block">Built-up Area</span>
                    <span className="text-xs md:text-sm text-white font-serif">
                      {area.toLocaleString()} {unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-white/40 block">Selected Tier</span>
                    <span className="text-xs md:text-sm text-white font-serif">{packageTier} Package</span>
                  </div>
                </div>
              </div>

              {/* Itemized Cost Breakdown (Especially useful if both Architecture & Interior chosen) */}
              <div className="bg-white/[0.02] border border-white/10 rounded-sm p-6 md:p-8 mb-10 backdrop-blur-sm">
                <h4 className="text-lg font-serif font-light text-white mb-4">Cost Computation Breakdown</h4>

                <div className="flex flex-col gap-3 font-mono text-xs md:text-sm">
                  {services.includes('Architecture') && (
                    <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                      <div>
                        <span className="text-white">Architecture Scope</span>
                        <span className="text-white/40 text-xs block">
                          {area.toLocaleString()} {unit} @ ₹{archRate.toLocaleString()}/{isSqft ? 'sq.ft' : 'sq.m'}
                        </span>
                      </div>
                      <span className="text-white font-semibold">{formatCost(archCost)}</span>
                    </div>
                  )}

                  {services.includes('Interior') && (
                    <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                      <div>
                        <span className="text-white">Interior Architecture Scope</span>
                        <span className="text-white/40 text-xs block">
                          {area.toLocaleString()} {unit} @ ₹{interiorRate.toLocaleString()}/{isSqft ? 'sq.ft' : 'sq.m'}
                        </span>
                      </div>
                      <span className="text-white font-semibold">{formatCost(interiorCost)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 text-sm md:text-base font-semibold">
                    <span className="text-white font-serif">Combined Subtotal</span>
                    <span className="text-white">{formatCost(totalCost)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-white/40 italic mt-6 leading-relaxed">
                  *Disclaimer: This is a preliminary architectural and construction estimation based on standard market indices for {packageTier} specifications. Actual turnkey execution costs will be finalized following site inspection, soil analysis, structural engineering, and customized material finishes.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="text-center pb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/#contact" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white text-black px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10">
                    Book Consultation Call
                  </button>
                </Link>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto border border-white/20 text-white/70 hover:text-white px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-white/5 transition-colors"
                >
                  Recalculate Estimate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
