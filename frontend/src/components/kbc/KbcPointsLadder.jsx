import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { KBC_PRIZE_LADDER } from '../../data/kbcQuestions.js';

/**
 * Authentic KBC Point Leaderboard / Ladder
 * Compact 150px Width Specification (Fits entirely on single screen without scrolling):
 * - Top Double-Hexagon Header (₹7 CRORE)
 * - Vertical Cyan Laser Spine Line down the center
 * - 15 Elongated Hexagonal Chevrons (Q15 down to Q1)
 * - Active Level with golden bloom & horizontal cyan beam
 */
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

  // Active highlighted level
  const activeLevel = Math.max(
    1,
    isWrongAnswer 
      ? Math.max(1, currentLevel - 1)
      : Math.min(totalQuestions, Math.max(1, currentLevel))
  );

  // Auto-scroll if list ever exceeds container
  useEffect(() => {
    if (currentStepRef.current) {
      currentStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeLevel]);

  // Total steps matching question count (16 or 30)
  const stepsSlice = KBC_PRIZE_LADDER.slice(0, Math.min(totalQuestions, KBC_PRIZE_LADDER.length));
  
  // Top milestone step (Level 16 or Level 30)
  const topStep = stepsSlice[stepsSlice.length - 1] || {
    level: 16,
    prize: '₹7 Crore',
    points: 1600
  };
  const isTopActive = activeLevel === topStep.level;

  // Remaining steps below the top pod, descending from (topLevel - 1) down to 1
  const ladderSteps = stepsSlice
    .slice(0, stepsSlice.length - 1)
    .map(step => {
      const isPadav = totalQuestions > 16 
        ? (step.level % 5 === 0)
        : (step.level === 5 || step.level === 10 || step.level === 15);

      return {
        ...step,
        points: step.level * 100,
        isSafe: isPadav
      };
    })
    .reverse();

  // Parse top prize for ₹7 & CRORE
  const topPrizeText = topStep.prize || '₹7 Crore';
  const rupeeMatch = topPrizeText.match(/₹\s*([0-9.]+)/);
  const rupeeNum = rupeeMatch ? `₹${rupeeMatch[1]}` : '₹7';
  const unitText = topPrizeText.replace(/₹\s*[0-9.]+/, '').trim().toUpperCase() || 'CRORE';

  return (
    <div 
      className="w-[150px] rounded-2xl p-1.5 border border-amber-400/50 shadow-[0_0_30px_rgba(0,0,0,0.9)] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl select-none shrink-0"
      style={{
        background: 'linear-gradient(180deg, rgba(8, 14, 38, 0.98) 0%, rgba(4, 8, 22, 0.99) 100%)'
      }}
    >
      {/* ── ULTRA-COMPACT 1-ROW HUD (Fits in 150px) ── */}
      <div className="pb-1 mb-1 border-b border-indigo-900/60 relative z-10 flex items-center justify-between text-[10px] font-mono leading-none">
        <span className={`font-black ${isWrongAnswer ? 'text-red-300 animate-pulse' : isOut ? 'text-red-400 line-through' : 'text-amber-300'}`}>
          ⭐ {userPoints}
        </span>
        <span className="text-emerald-400 font-bold flex items-center gap-0.5 text-[9px]">
          <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
          {safePoints}
        </span>
        <span className="text-indigo-300 font-bold text-[9px]">
          Q{activeLevel}/{totalQuestions}
        </span>
      </div>

      {/* ── TOP BEVELED DOUBLE-HEXAGON POD ("₹7 CRORE") ── */}
      <div 
        ref={isTopActive ? currentStepRef : null}
        className="relative flex flex-col items-center justify-center my-0.5 z-10"
      >
        <div 
          className={`relative w-[136px] h-12 flex flex-col items-center justify-center text-center transition-all duration-500 ${
            isTopActive
              ? 'scale-105 filter drop-shadow-[0_0_20px_rgba(251,191,36,0.95)] animate-pulse'
              : ''
          }`}
        >
          {/* SVG Double Beveled Hexagonal Frame */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            viewBox="0 0 160 70" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="goldHexGrad150" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a"/>
                <stop offset="35%" stopColor="#f59e0b"/>
                <stop offset="70%" stopColor="#fbbf24"/>
                <stop offset="100%" stopColor="#b45309"/>
              </linearGradient>
              <linearGradient id="goldFillGrad150" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isTopActive ? 'rgba(245, 158, 11, 0.5)' : 'rgba(22, 16, 52, 0.95)'}/>
                <stop offset="100%" stopColor={isTopActive ? 'rgba(120, 53, 15, 0.7)' : 'rgba(8, 12, 30, 0.98)'}/>
              </linearGradient>
            </defs>

            {/* Outer Hexagon */}
            <polygon 
              points="22,2 138,2 158,26 158,44 138,68 22,68 2,44 2,26" 
              fill="url(#goldFillGrad150)" 
              stroke="url(#goldHexGrad150)" 
              strokeWidth="2"
            />
            {/* Inner Hexagon Border */}
            <polygon 
              points="26,6 134,6 152,28 152,42 134,64 26,64 8,42 8,28" 
              fill="none" 
              stroke={isTopActive ? '#fef08a' : '#d97706'} 
              strokeWidth="1"
              strokeDasharray={isTopActive ? 'none' : '4 3'}
              opacity="0.8"
            />
          </svg>

          {/* Large ₹7 & CRORE Typography */}
          <div className="relative z-10 flex flex-col items-center justify-center leading-none">
            <span className="font-serif font-black text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-500 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-tight">
              {rupeeNum}
            </span>
            <span className="font-sans font-black text-[9px] sm:text-[10px] text-amber-300 uppercase tracking-[0.2em] -mt-0.5">
              {unitText}
            </span>
            <span className="text-[7.5px] font-mono font-bold text-amber-400/90 -mt-0.5">
              {(topStep.level * 100).toLocaleString()} pts
            </span>
          </div>

          {/* Horizontal laser beam if top step is active */}
          {isTopActive && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-[2.5px] bg-gradient-to-r from-yellow-300 to-transparent shadow-[0_0_10px_#38bdf8] pointer-events-none" />
          )}
        </div>
      </div>

      {/* ── THE VERTICAL LADDER (CYAN LASER SPINE & 15 COMPACT RUNGS) ── */}
      <div className="relative w-full my-0.5">
        
        {/* Cyan Vertical Laser Spine Line */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-1 w-[2px] pointer-events-none z-0"
          style={{
            background: 'linear-gradient(180deg, rgba(6,182,212,0.95) 0%, rgba(59,130,246,0.85) 50%, rgba(99,102,241,0.6) 100%)',
            boxShadow: '0 0 8px rgba(6, 182, 212, 0.8)'
          }}
        />

        {/* Stacked Rungs: Fits completely without scrolling in 16-question mode */}
        <div className="space-y-[2px] relative z-10">
          {ladderSteps.map(step => {
            const isCurrent = step.level === activeLevel;
            const isPassed = step.level < activeLevel;
            const isDroppedStep = isWrongAnswer && step.level === activeLevel;

            let strokeColor = '#38bdf8';
            let strokeWidth = '1.2';
            let fillColor = 'rgba(6, 11, 30, 0.92)';
            let textColor = 'text-cyan-100';
            let filterStyle = 'none';

            if (isDroppedStep) {
              strokeColor = '#ef4444';
              strokeWidth = '1.8';
              fillColor = 'rgba(127, 29, 29, 0.9)';
              textColor = 'text-white';
              filterStyle = 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))';
            } else if (isCurrent) {
              strokeColor = '#fef08a';
              strokeWidth = '2';
              fillColor = 'rgba(180, 83, 9, 0.9)';
              textColor = 'text-white';
              filterStyle = 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.9))';
            } else if (isPassed) {
              strokeColor = '#10b981';
              strokeWidth = '1.2';
              fillColor = 'rgba(6, 40, 28, 0.85)';
              textColor = 'text-emerald-200';
            } else if (step.isSafe) {
              strokeColor = '#f59e0b';
              strokeWidth = '1.6';
              fillColor = 'rgba(24, 18, 48, 0.9)';
              textColor = 'text-amber-300';
              filterStyle = 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.4))';
            }

            return (
              <motion.div
                key={step.level}
                ref={isCurrent ? currentStepRef : null}
                layout
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`relative w-full h-[19px] sm:h-[20px] flex items-center justify-between px-2 text-[10px] font-bold transition-all duration-200 ${
                  isCurrent ? 'scale-[1.03] z-20' : ''
                }`}
                style={{ filter: filterStyle }}
              >
                {/* SVG Elongated Hexagonal Background */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox="0 0 180 24" 
                  preserveAspectRatio="none"
                >
                  <polygon 
                    points="10,1 170,1 179,12 170,23 10,23 1,12" 
                    fill={fillColor} 
                    stroke={strokeColor} 
                    strokeWidth={strokeWidth}
                  />
                </svg>

                {/* Left: Level Number */}
                <span className={`relative z-10 font-mono text-[9px] font-black w-4 text-left ${
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

                {/* Center: Prize Amount (Matching Reference Image) */}
                <span className={`relative z-10 text-[9.5px] font-black tracking-tight text-center flex-1 truncate px-0.5 ${textColor} ${
                  isCurrent ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]' : ''
                }`}>
                  {step.prize}
                </span>

                {/* Right: Milestone Dot or Points */}
                <span className="relative z-10 text-[8px] font-mono text-slate-400 w-5 text-right truncate">
                  {step.isSafe ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_#f59e0b] inline-block" />
                  ) : (
                    <span>{step.points}</span>
                  )}
                </span>

                {/* Horizontal Laser Beam on Active Level */}
                {isCurrent && (
                  <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-[2px] pointer-events-none z-30"
                    style={{
                      background: 'linear-gradient(90deg, rgba(254,240,138,1) 0%, rgba(56,189,248,0.9) 60%, transparent 100%)',
                      boxShadow: '0 0 8px rgba(56, 189, 248, 0.9)'
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* ── FOOTER: SAFE PADAV LEGEND ── */}
      <div className="mt-1 pt-1 border-t border-indigo-900/60 flex items-center justify-between text-[8px] text-slate-400 font-sans relative z-10">
        <span className="text-amber-300 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm" />
          Safe: Q5, Q10, Q15
        </span>
        <span className="text-cyan-400 font-mono">
          +100/lvl
        </span>
      </div>

    </div>
  );
}