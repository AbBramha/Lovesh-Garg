'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import matrixData from '@/data/designMatrix.json';

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

const questions: Question[] = (matrixData.questions as Question[]);
const resultImages: Record<string, string> = (matrixData.resultImages as Record<string, string>);
const styleDetails: Record<string, StyleDetails> = (matrixData.styleDetails as Record<string, StyleDetails>);

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
                <a href="https://cal.id/nidhivandesignstudio-gmail" target="_blank" rel="noopener noreferrer">
                  <button 
                    className="bg-white text-black px-10 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
                  >
                    Book Consultation Call
                  </button>
                </a>
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
