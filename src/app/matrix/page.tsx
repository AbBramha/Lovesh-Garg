'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Option {
  id: string;
  label: string;
  desc: string;
  img: string;
  scores: Record<string, number>;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  multiSelect: boolean;
  options: Option[];
  endNote: string;
}

const questions: Question[] = [
  {
    id: 1,
    title: "What kind of space draws you in?",
    subtitle: "Imagine these spaces. Which ones would you most enjoy coming home to? (Choose up to 2 options)",
    multiSelect: true,
    options: [
      { id: '1A', label: "Calm & Refined", desc: "Clean lines, uncluttered surfaces, neutral colours and soft natural light.", img: "/matrix/Calm & Refined (Clean lines, neutral colours).jpg", scores: { "Modern Minimal": 3, "Modern Style": 1 } },
      { id: '1B', label: "Warm & Inviting", desc: "Wood, textured surfaces, warm lighting and comfortable, welcoming spaces.", img: "/matrix/Warm & Inviting (Wood, textured surfaces, warm lighting).jpg", scores: { "Japandi": 3, "Contemporary Indian": 1 } },
      { id: '1C', label: "Bold & Dramatic", desc: "Strong geometry, statement materials, dramatic lighting and a sense of grandeur.", img: "/matrix/Bold & Dramatic.jpg", scores: { "Contemporary Luxury": 3, "Neo Classical": 1, "Classical Indian": 1 } },
      { id: '1D', label: "Connected to Nature & Deeply Relaxing", desc: "Natural materials, greenery, filtered light and a strong connection between indoors and outdoors.", img: "/matrix/Connected to Nature (Greenery, indoor outdoor flow).jpg", scores: { "Tropical Modern": 3, "Contemporary Indian": 1 } }
    ],
    endNote: "Architectural insight: The feeling of a space comes from more than furniture or decoration. Proportion, light, material, colour, texture and spatial openness all contribute to its atmosphere."
  },
  {
    id: 2,
    title: "Which material combination feels most like you?",
    subtitle: "If you had to choose the material language of your home, which combination would you naturally gravitate towards? (Choose 1 option)",
    multiSelect: false,
    options: [
      { id: '2A', label: "Stone + Wood + Linen", desc: "Natural stone, timber, soft fabrics and restrained colours.", img: "/matrix/Q2_A Stone  Wood  Linen.jpg", scores: { "Contemporary Indian": 3, "Modern Style": 1 } },
      { id: '2B', label: "Concrete + Glass + Metal", desc: "Exposed concrete, glass, metal and clean architectural surfaces.", img: "/matrix/Q2_B Concrete + Glass + Metal.jpg", scores: { "Industrial": 3, "Modern Style": 1 } },
      { id: '2C', label: "Marble + Wood + Brass", desc: "Rich stone, timber, brass details and carefully controlled lighting.", img: "/matrix/Q2_C Marble + Wood + Brass.jpg", scores: { "Contemporary Luxury": 3, "Neo Classical": 1 } },
      { id: '2D', label: "Plaster + Terracotta + Timber", desc: "Earthy plaster finishes, terracotta, timber and handcrafted textures.", img: "/matrix/Q2_D Plaster + Terracotta + Timber.jpg", scores: { "Classical Indian": 3, "Contemporary Indian": 1, "Tropical Modern": 1 } },
      { id: '2E', label: "Timber, clay, terrazzo, cane, plants & natural stone", desc: "A rich combination of natural materials, greenery and varied textures.", img: "/matrix/Q2_E Timber, clay, terrazzo, cane, plants & natural stone.jpg", scores: { "Contemporary Indian": 3, "Tropical Modern": 1, "Japandi": 1 } },
      { id: '2F', label: "Coloured tile, patterned fabric, painted surfaces & furniture", desc: "Colour, pattern and furniture become important parts of the design.", img: "/matrix/Q2_F Coloured tile, patterned fabric, painted surfaces.jpg", scores: { "Classical Indian": 3, "Modern Style": 1 } },
      { id: '2G', label: "Subtle & muted colours, soft fabric, rattan & minimal furniture", desc: "Calm neutral tones, lightweight natural textures and simple furniture.", img: "/matrix/Q2_G Subtle muted colours, soft fabric, rattan, minimal furniture.jpg", scores: { "Japandi": 3, "Modern Minimal": 1 } }
    ],
    endNote: "Architectural insight: Materiality is not simply about colour. Texture, reflectivity, scale, warmth, ageing and the way materials meet each other influence how a space is experienced."
  },
  {
    id: 3,
    title: "How do you prefer to live?",
    subtitle: "Think about your everyday life rather than how you want your home to look. You can choose up to 2 options.",
    multiSelect: true,
    options: [
      { id: '3A', label: "I prefer order and want everything to have a place.", desc: "You may benefit from integrated storage, clean circulation and a reduced material palette.", img: "/matrix/Q3_A Order (Highly organized, integrated storage).jpg", scores: { "Modern Minimal": 3, "Japandi": 1 } },
      { id: '3B', label: "I spend time outdoors and want nature to be part of daily life.", desc: "You may benefit from courtyards, shaded terraces, large openings and garden connections.", img: "/matrix/Q3_B Outdoors (Courtyard, shaded terrace).jpg", scores: { "Tropical Modern": 3, "Contemporary Indian": 1 } },
      { id: '3C', label: "I enjoy hosting, displaying objects and changing my surroundings.", desc: "You may benefit from flexible rooms, strong focal points and adaptable lighting.", img: "/matrix/Q3_C Hosting (Flexible room with a strong focal point dining).jpg", scores: { "Modern Style": 3, "Contemporary Luxury": 1 } },
      { id: '3D', label: "I value openness, flexibility and a slightly unconventional atmosphere.", desc: "You may benefit from open planning, robust materials and expressive structural elements.", img: "/matrix/Q3_D Openness (Open plan, robust structural elements).jpg", scores: { "Industrial": 3, "Modern Style": 1 } },
      { id: '3E', label: "I want a home that feels settled, familiar and built to last.", desc: "You may benefit from balanced proportions, durable finishes and references to local architecture.", img: "/matrix/Q3_E Settled (Durable finishes, traditional proportions).jpg", scores: { "Contemporary Indian": 3, "Classical Indian": 1, "Japandi": 1 } },
      { id: '3F', label: "I like grandeur and want every space to feel like a feature.", desc: "You may benefit from distinct spaces, strong architectural details and layered lighting.", img: "/matrix/Q3_F Grandeur (Distinct formal space, layered lighting).jpg", scores: { "Neo Classical": 3, "Classical Indian": 1 } }
    ],
    endNote: "Architectural insight: Good architecture begins with understanding how a person actually lives. Storage, circulation, indoor–outdoor connections, flexibility, focal points and proportions can be designed around lifestyle."
  },
  {
    id: 4,
    title: "How much personality should your home show?",
    subtitle: "Imagine someone visiting your home for the first time. Which statement feels closest to you? Choose 1 option.",
    multiSelect: false,
    options: [
      { id: '4A', label: "\"I want my home to feel calm and uncluttered.\"", desc: "I prefer simplicity, consistency and visual quiet.", img: "/matrix/Q4_A Calm & uncluttered (Visually quiet).jpg", scores: { "Modern Minimal": 3, "Japandi": 1 } },
      { id: '4B', label: "\"I want my home to feel carefully curated.\"", desc: "I like a clean base with selected artwork, objects and details.", img: "/matrix/Q4_B Carefully curated (Clean base with a few selected artworks).jpg", scores: { "Japandi": 3, "Modern Minimal": 1 } },
      { id: '4C', label: "\"I want my home to tell my story.\"", desc: "I enjoy collecting things, displaying memories and bringing individuality into my surroundings.", img: "/matrix/Q4_C Tells my story (Eclectic, displaying memories collections).jpg", scores: { "Contemporary Indian": 3, "Modern Style": 1 } },
      { id: '4D', label: "\"I want my home to make a statement.\"", desc: "I enjoy distinctive forms, colours, materials or architectural features that create a strong impression.", img: "/matrix/Q4_D Make a statement (Distinctive, striking architectural feature).jpg", scores: { "Contemporary Luxury": 3, "Neo Classical": 1 } }
    ],
    endNote: "Architectural insight: Personal expression does not necessarily mean more decoration. It can come through art, colour, material, architecture, lighting or the way spaces are composed."
  },
  {
    id: 5,
    title: "What do you want your home to feel like 10 years from now?",
    subtitle: "Choose the option that resonates most with your long-term vision.",
    multiSelect: false,
    options: [
      { id: '5A', label: "Timeless", desc: "I want it to remain elegant even as trends change.", img: "/matrix/Q5_A Timeless (Elegant, trend-proof).jpg", scores: { "Neo Classical": 3, "Modern Minimal": 1 } },
      { id: '5B', label: "Personal", desc: "I want it to evolve with my life and continue telling my story.", img: "/matrix/Q5_B Personal (Evolving, character-rich).jpg", scores: { "Contemporary Indian": 3, "Modern Style": 1 } },
      { id: '5C', label: "Impressive", desc: "I want it to have a strong identity and leave an impression.", img: "/matrix/Q5_C Impressive (Strong identity, striking).jpg", scores: { "Contemporary Luxury": 3, "Neo Classical": 1 } },
      { id: '5D', label: "Comfortable", desc: "I want it to feel familiar, relaxed and welcoming for years to come.", img: "/matrix/Q5_D Comfortable (Familiar, relaxed, welcoming).jpg", scores: { "Japandi": 3, "Contemporary Indian": 1 } },
      { id: '5E', label: "Connected", desc: "I want it to age naturally and develop a stronger relationship with its surroundings over time.", img: "/matrix/Q5_E Connected (Aging naturally with its surroundings).jpg", scores: { "Tropical Modern": 3, "Contemporary Indian": 1 } }
    ],
    endNote: "Architectural insight: A successful home is not designed only for the day it is completed. Materials, proportions, flexibility and the relationship with surroundings influence how a space ages."
  }
];

const resultImages: Record<string, string> = {
  "Contemporary Indian": "/matrix/Contemporary Indian.jpg",
  "Classical Indian": "/matrix/Classical Indian.jpg",
  "Modern Minimal": "/matrix/Modern Minimal.jpg",
  "Modern Style": "/matrix/Modern Style.jpg",
  "Japandi": "/matrix/Japandi.jpg",
  "Tropical Modern": "/matrix/Tropical Modern.jpg",
  "Contemporary Luxury": "/matrix/Contemporary Luxury.jpg",
  "Neo Classical": "/matrix/Neo Classical.jpg",
  "Industrial": "/matrix/Industrial.jpg"
};

interface StyleDetails {
  subtitle: string;
  description: string;
  materials: string[];
  spatialVibe: string;
}

const styleDetails: Record<string, StyleDetails> = {
  "Contemporary Luxury": {
    subtitle: "Bold Geometry · Statement Materials · Layered Grandeur",
    description: "Defined by strong geometric forms, statement materials like rich marble, warm timber, and polished brass accents. Features carefully controlled, dramatic lighting and a grand sense of volume crafted to leave an unforgettable impression.",
    materials: ["Bookmatched Marble", "Warm Timber", "Brushed Brass Details", "Layered Illumination"],
    spatialVibe: "Sculpted opulence, high-impact focal drama & tailored refinement."
  },
  "Japandi": {
    subtitle: "Warm Minimalist · Tactile Serenity · Organic Comfort",
    description: "A harmonious synthesis of Scandinavian warmth and Japanese functional minimalism. Emphasizes warm wood tones, tactile textured surfaces, soft natural lighting, and comfortable, welcoming spaces designed for mindful, clutter-free everyday living.",
    materials: ["Natural Oak & Ash", "Rattan & Linen", "Wabi-Sabi Ceramics", "Muted Earth Tones"],
    spatialVibe: "Calm visual quiet, organic warmth & understated balance."
  },
  "Tropical Modern": {
    subtitle: "Biophilic Harmony · Verdant Courtyards · Breathing Spaces",
    description: "Blurs the threshold between indoor sanctuary and outdoor nature. Utilizes tranquil courtyards, shaded verandas, deep overhangs, and expansive glass portals that capture breezes, filtered daylight, and lush greenery that ages gracefully with time.",
    materials: ["Indigenous Stone & Teak", "Courtyards & Water", "Shaded Deep Terraces", "Abundant Natural Greenery"],
    spatialVibe: "Deeply relaxing, indoor-outdoor flow & climate-responsive serenity."
  },
  "Modern Minimal": {
    subtitle: "Clean Lines · Uncluttered Restraint · Pure Light",
    description: "Rooted in simplicity, visual quiet, and spatial discipline. Features crisp geometric planes, concealed integrated storage, seamless circulation, and a restrained monochromatic palette that elevates soft natural daylight into the primary design element.",
    materials: ["Smooth Micro-cement", "Concealed Millwork", "Linen & Glass", "Soft Diffused Daylight"],
    spatialVibe: "Impeccable order, visual quiet & calming spatial clarity."
  },
  "Contemporary Indian": {
    subtitle: "Rooted Heritage · Artisanal Warmth · Evolving Story",
    description: "A sensitive dialogue between cultural roots and contemporary aesthetics. Combines balanced proportions, native stone, terracotta, timber, cane, and terrazzo to craft a home that feels familiar, durable, and built to celebrate life stories across generations.",
    materials: ["Natural Stone & Timber", "Terracotta & Clay Finishes", "Cane, Plants & Terrazzo", "Handcrafted Metal"],
    spatialVibe: "Grounded permanence, cultural depth & evolving warmth."
  },
  "Classical Indian": {
    subtitle: "Artisanal Craftsmanship · Heritage Proportions · Regal Depth",
    description: "Rooted in timeless cultural heritage and artisanal mastery. Celebrates traditional balanced proportions, earthy lime plaster walls, terracotta accents, intricately carved timber, and vibrant patterned fabrics that bestow a stately, sanctuary-like presence.",
    materials: ["Earthy Plaster & Lime", "Hand-carved Timber", "Terracotta & Tile Inlays", "Heritage Patterned Fabrics"],
    spatialVibe: "Artisanal authenticity, regal gravitas & crafted timelessness."
  },
  "Modern Style": {
    subtitle: "Dynamic Living · Flexible Volumes · Strong Focal Points",
    description: "Designed for expressive, dynamic contemporary lifestyles and hosting. Features versatile open-plan rooms, strong focal features, adaptable lighting systems, and crisp materials that comfortably adjust between intimate downtime and lively gatherings.",
    materials: ["Architectural Metal & Glass", "Engineered Hardwood", "Adaptable Lighting", "Statement Sculptural Accents"],
    spatialVibe: "Flexible openness, vibrant hosting & dynamic modern comfort."
  },
  "Neo Classical": {
    subtitle: "Symmetrical Harmony · Stately Grandeur · Timeless Elegance",
    description: "Inspired by classical symmetry, noble proportions, and architectural hierarchy. Showcases distinct formal spaces, layered cornices and mouldings, statement chandeliers, and curated luxury materials that remain elegant even as passing trends change.",
    materials: ["Fine Marble & Stone", "Architectural Mouldings", "Layered Chandeliers & Brass", "Formal Symmetrical Millwork"],
    spatialVibe: "Generational prestige, formal grandeur & dignified elegance."
  },
  "Industrial": {
    subtitle: "Structural Honesty · Open Loft Volumes · Raw Authenticity",
    description: "Celebrates unadorned structural honesty and unconventional volume. Highlights exposed concrete walls, blackened structural steel, expansive Crittall-style glass panels, and open circulation that together create an authentic, edgy, and spacious architectural statement.",
    materials: ["Board-formed Concrete", "Blackened Steel Framing", "Expansive Glazing", "Raw Reclaimed Timber"],
    spatialVibe: "High-volume openness, raw tactile edge & structural authenticity."
  }
};

export default function MatrixPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  
  const [selections, setSelections] = useState<Record<number, string[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  });

  const [results, setResults] = useState<{primary: string, secondary: string, supporting: string} | null>(null);

  // Load state from sessionStorage on mount
  useEffect(() => {
    const savedStep = sessionStorage.getItem('matrixStep');
    const savedSelections = sessionStorage.getItem('matrixSelections');
    
    if (savedStep) {
      setStep(parseInt(savedStep, 10));
    }
    if (savedSelections) {
      setSelections(JSON.parse(savedSelections));
    }
    
    setMounted(true);
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem('matrixStep', step.toString());
      sessionStorage.setItem('matrixSelections', JSON.stringify(selections));
    }
  }, [step, selections, mounted]);

  const handleSelect = (questionId: number, optionId: string, multiSelect: boolean) => {
    setSelections(prev => {
      const current = prev[questionId];
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter(id => id !== optionId) };
      } else {
        if (multiSelect) {
          if (current.length >= 2) {
            return { ...prev, [questionId]: [current[1], optionId] };
          }
          return { ...prev, [questionId]: [...current, optionId] };
        } else {
          return { ...prev, [questionId]: [optionId] };
        }
      }
    });
  };

  const calculateResult = () => {
    const scores: Record<string, { total: number, primaryCount: number }> = {};
    
    Object.keys(resultImages).forEach(style => {
      scores[style] = { total: 0, primaryCount: 0 };
    });

    Object.entries(selections).forEach(([qId, selectedIds]) => {
      const question = questions.find(q => q.id === parseInt(qId));
      if (!question) return;

      selectedIds.forEach(optId => {
        const option = question.options.find(o => o.id === optId);
        if (option) {
          Object.entries(option.scores).forEach(([style, points]) => {
            if (scores[style]) {
              scores[style].total += points;
              if (points === 3) scores[style].primaryCount += 1;
            }
          });
        }
      });
    });

    const sortedStyles = Object.entries(scores).sort((a, b) => {
      if (b[1].total !== a[1].total) return b[1].total - a[1].total;
      return b[1].primaryCount - a[1].primaryCount;
    });

    setResults({
      primary: sortedStyles[0][0],
      secondary: sortedStyles[1][0],
      supporting: sortedStyles[2][0]
    });
    setStep(6);
  };

  const handlePrev = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleNext = () => {
    if (step === 5) {
      calculateResult();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <main className="bg-[#0d0d0d] text-white h-[100svh] py-4 md:py-8 flex flex-col overflow-hidden font-sans relative">
      <Link href="/#design-matrix" onClick={() => sessionStorage.clear()} className="absolute top-6 left-6 md:top-8 md:left-8 text-white/50 hover:text-white uppercase tracking-widest text-xs z-50 flex items-center gap-2 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>

      <div className="container mx-auto px-6 max-w-7xl relative flex-1 flex flex-col mt-12 md:mt-8 overflow-y-auto overflow-x-hidden pb-4 hide-scrollbar">
        <AnimatePresence mode="wait">
          {step > 0 && step <= 5 && (
            <motion.div 
              key={`q${step}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col h-full max-h-full justify-center"
            >
              <div className="mb-4 md:mb-6 shrink-0">
                <span className="uppercase tracking-widest text-[10px] md:text-xs font-semibold text-white/50 mb-1 md:mb-2 block">Question 0{step} / 05</span>
                <h3 className="text-2xl md:text-4xl font-serif font-light mb-2">{questions[step - 1].title}</h3>
                <p className="text-sm md:text-base text-white/70 max-w-3xl">{questions[step - 1].subtitle}</p>
              </div>

              <div className="flex overflow-x-auto md:overflow-y-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-1 min-h-0 items-start md:pb-8">
                {questions[step - 1].options.map((option) => {
                  const isSelected = selections[step].includes(option.id);
                  return (
                    <div 
                      key={option.id}
                      onClick={() => handleSelect(step, option.id, questions[step - 1].multiSelect)}
                      className={`min-w-[85vw] sm:min-w-[300px] md:min-w-0 snap-center cursor-pointer transition-all duration-300 group ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <div className={`relative aspect-video mb-3 overflow-hidden rounded-sm transition-all duration-300 ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}`}>
                        <Image 
                          src={option.img}
                          alt={option.label}
                          fill
                          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 33vw, 25vw"
                          className={`object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                        />
                      </div>
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className={`w-4 h-4 md:w-5 md:h-5 mt-0.5 shrink-0 flex items-center justify-center border transition-colors ${isSelected ? 'border-white bg-white text-black' : 'border-white/30'}`}>
                          {isSelected && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm md:text-base leading-tight mb-1">{option.label}</h4>
                          <p className="text-white/60 text-xs md:text-sm leading-relaxed hidden sm:block line-clamp-2">{option.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 shrink-0 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4 md:pt-6">
                <p className="text-[10px] md:text-xs text-white/40 italic max-w-2xl hidden md:block">{questions[step - 1].endNote}</p>
                
                <div className="flex gap-4 w-full md:w-auto">
                  {step > 1 && (
                    <button 
                      onClick={handlePrev}
                      className="flex-1 md:flex-none border border-white/30 text-white px-6 md:px-10 py-3 md:py-4 uppercase tracking-widest text-xs md:text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
                    >
                      Previous
                    </button>
                  )}
                  <button 
                    onClick={handleNext}
                    disabled={selections[step].length === 0}
                    className="flex-1 md:flex-none bg-white text-black px-6 md:px-10 py-3 md:py-4 uppercase tracking-widest text-xs md:text-sm hover:bg-white/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {step === 5 ? 'See Result' : 'Next'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 6 && results && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto pb-16"
            >
              {/* Top Header */}
              <div className="text-center mb-12 md:mb-16">
                <span className="uppercase tracking-[0.25em] text-xs font-semibold text-white/50 mb-3 block">
                  Your Custom Architectural Blueprint
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-light mb-4 text-white">
                  The {results.primary}
                </h2>
                <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
                  Based on your preferences, your aesthetic naturally aligns with <span className="text-white font-normal">{results.primary}</span>, complemented by <span className="text-white font-normal">{results.secondary}</span> and enriched with <span className="text-white font-normal">{results.supporting}</span> accents.
                </p>
              </div>

              {/* 1. PRIMARY DESIGN LANGUAGE CARD */}
              <div className="mb-10 bg-white/[0.03] border border-white/10 rounded-sm overflow-hidden p-6 md:p-8 backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Photo */}
                  <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-sm border border-white/10 shadow-2xl">
                    <Image 
                      src={resultImages[results.primary]}
                      alt={results.primary}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 border border-white/20 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-white/90">
                      Primary Design Language
                    </div>
                  </div>

                  {/* Text Section Beside Photo */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/50 font-semibold mb-2 block">
                      Core Aesthetic · 60% Influence
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif font-light text-white mb-2">
                      {results.primary}
                    </h3>
                    <p className="text-xs md:text-sm text-white/60 italic mb-4 font-serif">
                      "{styleDetails[results.primary]?.subtitle}"
                    </p>
                    <p className="text-xs md:text-sm text-white/80 leading-relaxed mb-6 font-light">
                      {styleDetails[results.primary]?.description}
                    </p>

                    {/* Material Palette Chips */}
                    <div className="mb-4">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-2 font-mono">
                        Key Materials & Language
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {styleDetails[results.primary]?.materials.map((mat, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-white/80 rounded-sm">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-[11px] text-white/50">
                      <span className="text-white/70 font-medium">Atmosphere:</span> {styleDetails[results.primary]?.spatialVibe}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. SECONDARY & SUPPORTING CARDS (Beside Photos) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                
                {/* SECONDARY INFLUENCE */}
                <div className="bg-white/[0.03] border border-white/10 rounded-sm p-6 backdrop-blur-sm flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center mb-4">
                    {/* Photo */}
                    <div className="sm:col-span-5 relative aspect-square overflow-hidden rounded-sm border border-white/10">
                      <Image 
                        src={resultImages[results.secondary]}
                        alt={results.secondary}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 border border-white/20 text-[9px] font-semibold tracking-wider uppercase text-white/90">
                        Secondary
                      </div>
                    </div>

                    {/* Text Section Beside Photo */}
                    <div className="sm:col-span-7 flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-1">
                        Secondary Influence · 25%
                      </span>
                      <h4 className="text-xl font-serif font-light text-white mb-1">
                        {results.secondary}
                      </h4>
                      <p className="text-[11px] text-white/50 italic mb-2 font-serif">
                        "{styleDetails[results.secondary]?.subtitle}"
                      </p>
                      <p className="text-xs text-white/70 leading-relaxed font-light">
                        {styleDetails[results.secondary]?.description}
                      </p>
                    </div>
                  </div>

                  {/* Materials & Spatial Note */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {styleDetails[results.secondary]?.materials.slice(0, 3).map((mat, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 text-white/70 rounded-sm">
                          {mat}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-white/40">
                      <span className="text-white/60">Role:</span> {styleDetails[results.secondary]?.spatialVibe}
                    </p>
                  </div>
                </div>

                {/* SUPPORTING ELEMENT */}
                <div className="bg-white/[0.03] border border-white/10 rounded-sm p-6 backdrop-blur-sm flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center mb-4">
                    {/* Photo */}
                    <div className="sm:col-span-5 relative aspect-square overflow-hidden rounded-sm border border-white/10">
                      <Image 
                        src={resultImages[results.supporting]}
                        alt={results.supporting}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 border border-white/20 text-[9px] font-semibold tracking-wider uppercase text-white/90">
                        Supporting
                      </div>
                    </div>

                    {/* Text Section Beside Photo */}
                    <div className="sm:col-span-7 flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-1">
                        Supporting Element · 15%
                      </span>
                      <h4 className="text-xl font-serif font-light text-white mb-1">
                        {results.supporting}
                      </h4>
                      <p className="text-[11px] text-white/50 italic mb-2 font-serif">
                        "{styleDetails[results.supporting]?.subtitle}"
                      </p>
                      <p className="text-xs text-white/70 leading-relaxed font-light">
                        {styleDetails[results.supporting]?.description}
                      </p>
                    </div>
                  </div>

                  {/* Materials & Spatial Note */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {styleDetails[results.supporting]?.materials.slice(0, 3).map((mat, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 text-white/70 rounded-sm">
                          {mat}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-white/40">
                      <span className="text-white/60">Role:</span> {styleDetails[results.supporting]?.spatialVibe}
                    </p>
                  </div>
                </div>

              </div>

              {/* Consultation & Reset Buttons */}
              <div className="text-center pb-12">
                <Link href="/#contact">
                  <button 
                    className="bg-white text-black px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
                  >
                    Book Consultation Call
                  </button>
                </Link>
                <button 
                  onClick={() => {
                    sessionStorage.clear();
                    setStep(1);
                    setSelections({ 1: [], 2: [], 3: [], 4: [], 5: [] });
                  }}
                  className="block mx-auto mt-4 text-xs underline text-white/50 hover:text-white uppercase tracking-widest transition-colors"
                >
                  Retake Design Matrix
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </main>
  );
}
