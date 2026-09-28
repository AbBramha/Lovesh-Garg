'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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

export default function DesignMatrix() {
  const [step, setStep] = useState(0); // 0 = Intro, 1-5 = Questions, 6 = Result
  
  const [selections, setSelections] = useState<Record<number, string[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  });

  const [results, setResults] = useState<{primary: string, secondary: string, supporting: string} | null>(null);

  const handleSelect = (questionId: number, optionId: string, multiSelect: boolean) => {
    setSelections(prev => {
      const current = prev[questionId];
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter(id => id !== optionId) };
      } else {
        if (multiSelect) {
          if (current.length >= 2) {
            // Keep the last chosen, and add the new one
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
    
    // Initialize styles
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
      if (b[1].total !== a[1].total) return b[1].total - a[1].total; // Sort by total points
      return b[1].primaryCount - a[1].primaryCount; // Tie-breaker: most +3s
    });

    setResults({
      primary: sortedStyles[0][0],
      secondary: sortedStyles[1][0],
      supporting: sortedStyles[2][0]
    });
    setStep(6);
  };

  const handleNext = () => {
    if (step === 5) {
      calculateResult();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <section className="bg-black text-white min-h-screen py-24 md:py-32 overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-7xl relative">
        
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
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
              <button 
                onClick={() => setStep(1)}
                className="bg-white text-black px-10 py-4 uppercase tracking-widest text-sm hover:bg-white/80 transition-colors"
              >
                Start Experience
              </button>
            </motion.div>
          )}

          {step > 0 && step <= 5 && (
            <motion.div 
              key={`q${step}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="mb-10 md:mb-16">
                <span className="uppercase tracking-widest text-xs font-semibold text-white/50 mb-2 block">Question 0{step} / 05</span>
                <h3 className="text-3xl md:text-5xl font-serif font-light mb-4">{questions[step - 1].title}</h3>
                <p className="text-lg text-white/70 max-w-3xl">{questions[step - 1].subtitle}</p>
              </div>

              {/* Horizontal Scroll on Mobile, Grid on Desktop */}
              <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible">
                {questions[step - 1].options.map((option) => {
                  const isSelected = selections[step].includes(option.id);
                  return (
                    <div 
                      key={option.id}
                      onClick={() => handleSelect(step, option.id, questions[step - 1].multiSelect)}
                      className={`min-w-[85vw] sm:min-w-[300px] md:min-w-0 snap-center cursor-pointer transition-all duration-300 group ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <div className={`relative aspect-[4/3] mb-4 overflow-hidden rounded-sm transition-all duration-300 ${isSelected ? 'ring-2 ring-white ring-offset-4 ring-offset-black' : ''}`}>
                        <Image 
                          src={option.img}
                          alt={option.label}
                          fill
                          className={`object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                        />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 mt-1 shrink-0 flex items-center justify-center border transition-colors ${isSelected ? 'border-white bg-white text-black' : 'border-white/30'}`}>
                          {isSelected && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg leading-tight mb-2">{option.label}</h4>
                          <p className="text-white/60 text-sm leading-relaxed">{option.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
                <p className="text-xs text-white/40 italic max-w-2xl">{questions[step - 1].endNote}</p>
                
                <button 
                  onClick={handleNext}
                  disabled={selections[step].length === 0}
                  className="w-full md:w-auto bg-white text-black px-10 py-4 uppercase tracking-widest text-sm hover:bg-white/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {step === 5 ? 'See Result' : 'Next Question'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 6 && results && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-16">
                <span className="uppercase tracking-widest text-xs font-semibold text-white/50 mb-4 block">Your Design Matrix</span>
                <h2 className="text-5xl md:text-7xl font-serif font-light mb-6">The {results.primary}</h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  Based on your preferences, your aesthetic naturally aligns with {results.primary}, influenced by {results.secondary} and {results.supporting} elements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
                <div className="md:col-span-8 relative aspect-video md:aspect-auto md:h-[600px] overflow-hidden">
                  <Image 
                    src={resultImages[results.primary]}
                    alt={results.primary}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm px-6 py-3 border border-white/10">
                    <p className="uppercase tracking-widest text-xs font-semibold text-white/70">Primary Style</p>
                    <p className="text-xl font-serif">{results.primary}</p>
                  </div>
                </div>
                
                <div className="md:col-span-4 flex flex-col gap-6">
                  <div className="relative flex-1 aspect-square md:aspect-auto overflow-hidden">
                    <Image 
                      src={resultImages[results.secondary]}
                      alt={results.secondary}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm px-6 py-3 border border-white/10">
                      <p className="uppercase tracking-widest text-xs font-semibold text-white/70">Secondary Influence</p>
                      <p className="text-lg font-serif">{results.secondary}</p>
                    </div>
                  </div>
                  <div className="relative flex-1 aspect-square md:aspect-auto overflow-hidden">
                    <Image 
                      src={resultImages[results.supporting]}
                      alt={results.supporting}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm px-6 py-3 border border-white/10">
                      <p className="uppercase tracking-widest text-xs font-semibold text-white/70">Supporting Element</p>
                      <p className="text-lg font-serif">{results.supporting}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  className="bg-white text-black px-12 py-5 uppercase tracking-widest text-sm hover:bg-white/80 transition-colors"
                >
                  Book a Consultation
                </button>
                <button 
                  onClick={() => {
                    setStep(0);
                    setSelections({ 1: [], 2: [], 3: [], 4: [], 5: [] });
                  }}
                  className="block mx-auto mt-6 text-sm underline opacity-50 hover:opacity-100 uppercase tracking-widest"
                >
                  Retake Quiz
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
    </section>
  );
}
