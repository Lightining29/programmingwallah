import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { KBC_PRIZE_LADDER } from '../../data/kbcQuestions.js';

export default function KbcPointsLadder({
  currentLevel = 1,
  totalQuestions = 16,
  userPoints = 0,
  isOut = false,
  isWrongAnswer = false,
  safePoints = 0,
  safePrize = '₹0'
}) {
  const currentStepRef = useRef(null);

  // Active highlighted level on the ladder:
  // If player answered wrong, their place in the ladder drops down
  const activeLevel = Math.max(
    1,
    isWrongAnswer 
      ? Math.max(1, currentLevel - 1)
      : Math.min(totalQuestions, Math.max(1, currentLevel))
  );

  // Auto-scroll to active current level if scrollable
  useEffect(() => {
    if (currentStepRef.current) {
      currentStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeLevel]);

  // Total ladder steps matching question count (16 or 30)
  const stepsSlice = KBC_PRIZE_LADDER.slice(0, Math.min(totalQuestions, KBC_PRIZE_LADDER.length));
  
  // Top milestone jackpot step (Level 16 or Level 30)
  const topStep = stepsSlice[stepsSlice.length - 1] || {
    level: 16,
    prize: '₹7 Crore',
    points: 1600
  };
  const isTopActive = activeLevel === topStep.level;

  // Remaining steps below the top pod, ordered descending from (topLevel - 1) down to 1
  const ladderSteps = stepsSlice
    .slice(0, stepsSlice.length - 1)
    .map(step => {
      // Dynamic padav milestone rule:
      // In 16-level: Level 5 (₹10k), Level 10 (₹3.2L), Level 15 (₹1 Cr)
      // In 30-level: every 5 levels
      const isPadav = totalQuestions > 16 
        ? (step.level % 5 === 0)
        : (step.level === 5 || step.level === 10 || step.level === 15);

      let padavLabel = '';
      if (isPadav) {
        padavLabel = `PADAV ${Math.floor(step.level / 5)}`;
      }

      return {
        ...step,
        points: step.level * 100,
        isSafe: isPadav,
        padavLabel
      };
    })
    .reverse();

  // Parse top prize for large ₹7 / CRORE display
  const topPrizeText = topStep.prize || '₹7 Crore';
  const rupeeMatch = topPrizeText.match(/₹\s*([0-9.]+)/);
  const rupeeNum = rupeeMatch ? `₹${rupeeMatch[1]}` : '₹7';
  const unitText = topPrizeText.replace(/₹\s*[0-9.]+/, '').trim().toUpperCase() || 'CRORE';

  return (
    <div 
      className="w-full rounded-3xl p-3 sm:p-4 border border-amber-400/50 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl select-none"
      style={{
        background: 'linear-gradient(180deg, rgba(8, 14, 38, 0.98) 0%, rgba(4, 8, 22, 0.99) 100%)'
      }}
    >
      {/* ── ULTRA-COMPACT CONTESTANT HUD BAR ── */}
      <div className="pb-2.5 mb-2 border-b border-indigo-900/60 relative z-10 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300 font-medium text-[11px]">Score:</span>
            <span className={`font-mono font-black ${
              isWrongAnswer ? 'text-red-300 animate-pulse' : isOut ? 'text-red-400 line-through' : 'text-amber-300'
            }`}>
              ⭐ {(userPoints || 0).toLocaleString()} pts
            </span>
            {isWrongAnswer && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-red-600/40 text-red-200 border border-red-500 font-mono font-bold animate-pulse">
                -100
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Safe: {safePoints} pts
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-indigo-950/80 border border-indigo-500/40 text-indigo-300">
              Q{activeLevel}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Drop Alert if wrong answer */}
        {(isWrongAnswer || isOut) && (
          <div className="py-1 px-2 rounded-lg bg-red-950/80 border border-red-500/60 flex items-center gap-1.5 text-[10px] text-red-200 font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>
              {isWrongAnswer 
                ? `Dropped down to Level ${activeLevel} (${activeLevel * 100} pts)` 
                : `Cutoff: Points locked to safe padav (${safePoints} pts)`}
            </span>
          </div>
        )}
      </div>

      {/* ── TOP BEVELED DOUBLE-HEXAGON POD ("₹7 CRORE") ── */}
      <div 
        ref={isTopActive ? currentStepRef : null}
        className="relative flex flex-col items-center justify-center my-1 z-10 transition-all duration-700"
      >
        <div 
          className={`relative w-44 sm:w-48 h-20 sm:h-22 flex flex-col items-center justify-center text-center transition-all duration-700 ${
            isTopActive
              ? 'scale-105 filter drop-shadow-[0_0_25px_rgba(251,191,36,0.9)] animate-pulse'
              : 'hover:scale-102'
          }`}
        >
          {/* SVG Double Beveled Hexagonal Outer & Inner Frame */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            viewBox="0 0 180 90" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="goldHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fef08a"/>
                <stop offset="35%" stop-color="#f59e0b"/>
                <stop offset="70%" stop-color="#fbbf24"/>
                <stop offset="100%" stop-color="#b45309"/>
              </linearGradient>
              <linearGradient id="goldFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color={isTopActive ? 'rgba(245, 158, 11, 0.45)' : 'rgba(20, 16, 48, 0.95)'}/>
                <stop offset="100%" stop-color={isTopActive ? 'rgba(120, 53, 15, 0.65)' : 'rgba(8, 12, 30, 0.98)'}/>
              </linearGradient>
            </defs>

            {/* Outer Hexagon */}
            <polygon 
              points="28,2 152,2 178,35 178,55 152,88 28,88 2,55 2,35" 
              fill="url(#goldFillGrad)" 
              stroke="url(#goldHexGrad)" 
              strokeWidth="2.5"
            />
            {/* Inner Hexagon Border */}
            <polygon 
              points="32,7 148,7 172,37 172,53 148,83 32,83 8,53 8,37" 
              fill="none" 
              stroke={isTopActive ? '#fef08a' : '#d97706'} 
              strokeWidth="1.2"
              strokeDasharray={isTopActive ? 'none' : '6 4'}
              opacity="0.85"
            />
          </svg>

          {/* Large ₹7 & CRORE Typography */}
          <div className="relative z-10 flex flex-col items-center justify-center leading-none">
            <span className="font-serif font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-tight">
              {rupeeNum}
            </span>
            <span className="font-sans font-black text-xs sm:text-sm text-amber-300 uppercase tracking-[0.25em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] -mt-0.5">
              {unitText}
            </span>
            <span className="mt-1 px-2 py-0.2 rounded-full font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-slate-950/80 border border-amber-400/50 text-amber-300 shadow-inner">
              Level {topStep.level} • {(topStep.level * 100).toLocaleString()} pts
            </span>
          </div>

          {/* Horizontal laser beam if top step is active */}
          {isTopActive && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 sm:w-28 h-[3px] bg-gradient-to-r from-yellow-300 via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] pointer-events-none" />
          )}
        </div>
      </div>

      {/* ── THE VERTICAL LADDER CONTAINER (WITH CYAN LASER CENTER SPINE) ── */}
      <div className="relative w-full my-1 pt-1">
        
        {/* The Cyan/Blue Vertical Laser Spine Line Passing Straight Through Center */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-2 w-[2.5px] pointer-events-none z-0"
          style={{
            background: 'linear-gradient(180deg, rgba(6,182,212,0.95) 0%, rgba(59,130,246,0.85) 50%, rgba(99,102,241,0.6) 100%)',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.8), 0 0 20px rgba(59, 130, 246, 0.4)'
          }}
        />

        {/* Stacked Elongated Hexagonal Rungs */}
        <div className={`space-y-1 relative z-10 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-indigo-900 ${
          totalQuestions > 16 ? 'max-h-[380px] sm:max-h-[440px]' : 'max-h-[420px]'
        }`}>
          {ladderSteps.map(step => {
            const isCurrent = step.level === activeLevel;
            const isPassed = step.level < activeLevel;
            const isDroppedStep = isWrongAnswer && step.level === activeLevel;

            // Border & Glow styling matching the image:
            // - Active: Blazing golden amber border (like ₹79 CRORE in photo)
            // - Padav: Radiant amber gold outline
            // - Normal: Sleek cyan/light blue neon outline
            let strokeColor = '#38bdf8';
            let strokeWidth = '1.5';
            let fillColor = 'rgba(6, 11, 30, 0.9)';
            let textColor = 'text-cyan-100';
            let pointsColor = 'text-slate-400';
            let filterStyle = 'none';

            if (isDroppedStep) {
              strokeColor = '#ef4444';
              strokeWidth = '2';
              fillColor = 'rgba(127, 29, 29, 0.9)';
              textColor = 'text-white';
              pointsColor = 'text-red-200';
              filterStyle = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))';
            } else if (isCurrent) {
              strokeColor = '#fef08a';
              strokeWidth = '2.5';
              fillColor = 'rgba(180, 83, 9, 0.85)';
              textColor = 'text-white';
              pointsColor = 'text-yellow-200';
              filterStyle = 'drop-shadow(0 0 14px rgba(245, 158, 11, 0.9))';
            } else if (isPassed) {
              strokeColor = '#10b981';
              strokeWidth = '1.4';
              fillColor = 'rgba(6, 40, 28, 0.85)';
              textColor = 'text-emerald-200';
              pointsColor = 'text-emerald-400';
            } else if (step.isSafe) {
              strokeColor = '#f59e0b';
              strokeWidth = '1.8';
              fillColor = 'rgba(24, 18, 48, 0.9)';
              textColor = 'text-amber-300';
              pointsColor = 'text-amber-400';
              filterStyle = 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))';
            }

            return (
              <motion.div
                key={step.level}
                ref={isCurrent ? currentStepRef : null}
                layout
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`relative w-full h-[27px] sm:h-[28px] flex items-center justify-between px-3 sm:px-4 text-xs font-bold transition-all duration-300 ${
                  isCurrent ? 'scale-[1.03] z-20' : 'hover:scale-[1.01]'
                }`}
                style={{ filter: filterStyle }}
              >
                {/* SVG Elongated Hexagonal Background with Pointed Chevrons */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox="0 0 300 28" 
                  preserveAspectRatio="none"
                >
                  <polygon 
                    points="14,1.5 286,1.5 298,14 286,26.5 14,26.5 2,14" 
                    fill={fillColor} 
                    stroke={strokeColor} 
                    strokeWidth={strokeWidth}
                  />
                </svg>

                {/* Left: Compact Level Number & Status Indicator */}
                <div className="relative z-10 flex items-center gap-1.5 w-10 sm:w-12 shrink-0">
                  <span className={`font-mono text-[10px] sm:text-[11px] font-black ${
                    isDroppedStep 
                      ? 'text-white' 
                      : isCurrent 
                        ? 'text-yellow-300 animate-pulse' 
                        : isPassed 
                          ? 'text-emerald-400' 
                          : step.isSafe 
                            ? 'text-amber-400' 
                            : 'text-cyan-400'
                  }`}>
                    {isDroppedStep ? '▼' : isCurrent ? '◆' : isPassed ? '✓' : step.level}
                  </span>
                  {step.isSafe && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_#f59e0b]" />
                  )}
                </div>

                {/* Center: Bold Prize Label (Matching Photo, e.g. ₹10 LAKHS, 80 LAKH, etc.) */}
                <div className="relative z-10 flex-1 text-center font-black tracking-wide truncate px-1">
                  <span className={`text-[11px] sm:text-xs font-sans tracking-wide uppercase ${textColor} ${
                    isCurrent ? 'font-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]' : ''
                  }`}>
                    {step.prize}
                  </span>
                </div>

                {/* Right: Very Compact Points Value (e.g. 1500 pts) */}
                <div className="relative z-10 w-16 sm:w-18 text-right font-mono text-[9px] sm:text-[10px] font-bold shrink-0 truncate">
                  <span className={pointsColor}>
                    {step.points.toLocaleString()} pts
                  </span>
                </div>

                {/* Horizontal Laser Beam shooting out to the right for Active Level (Matching Photo!) */}
                {isCurrent && (
                  <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-14 sm:w-20 h-[2.5px] pointer-events-none z-30"
                    style={{
                      background: 'linear-gradient(90deg, rgba(254,240,138,1) 0%, rgba(56,189,248,0.9) 60%, transparent 100%)',
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.9), 0 0 16px rgba(251, 191, 36, 0.7)'
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* ── FOOTER: COMPACT LEGEND ── */}
      <div className="mt-2 pt-1.5 border-t border-indigo-900/60 flex items-center justify-between text-[9px] text-slate-400 font-sans relative z-10">
        <span className="flex items-center gap-1 text-amber-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
          Safe Padavs: Q5, Q10, Q15
        </span>
        <span className="text-cyan-400 font-mono">
          +100 pts/level
        </span>
      </div>

    </div>
  );
}