import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { KBC_PRIZE_LADDER, getDynamicPrizeLadder } from '../../data/kbcQuestions.js';

/**
 * Authentic KBC Point Leaderboard / Ladder
 * Enhanced 200px Width Specification (Fits entirely on single screen without scrolling):
 * - Top Double-Hexagon Header (₹7 CRORE or ₹3,20,000 JACKPOT PRIZE)
 * - Vertical Cyan Laser Spine Line down the center
 * - Elongated Hexagonal Chevrons (Q15 down to Q1) with rich glowing neon borders & increased rung height
 * - Active Level with golden bloom & horizontal cyan laser beam
 */
export default function KbcPointsLadder({
  currentLevel = 1,
  totalQuestions = 16,
  userPoints = 0,
  isOut = false,
  isWrongAnswer = false,
  safePoints = 0,
  safePrize = '₹0',
  candidateName = 'Hotseat Contestant',
  candidatePhoto = null
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

  // Total steps dynamically matching any question count (e.g. 10, 16, 25, 30, 50, 100)
  const stepsSlice = getDynamicPrizeLadder(totalQuestions);
  
  // Top milestone step (e.g. Level 50 Supreme Jackpot, Level 30 Grand Padav, or Level 16 Jackpot)
  const topStep = stepsSlice[stepsSlice.length - 1] || {
    level: totalQuestions || 16,
    prize: '₹100 Crore',
    points: (totalQuestions || 16) * 100
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

  // Robust parsing of top prize amount (handles ₹100 Crore, ₹7 Crore, as well as ₹3,20,000 without split errors)
  const topPrizeInfo = useMemo(() => {
    const raw = (topStep.prize || '₹7 Crore').trim();
    const unitMatch = raw.match(/(crore|cr|lakh|lakhs|thousand|k)/i);
    if (unitMatch) {
      const unit = unitMatch[0].toUpperCase();
      const numPart = raw.replace(new RegExp(unit, 'i'), '').trim();
      return { main: numPart, sub: unit === 'CR' ? 'CRORE' : unit, isLargeUnit: true };
    }
    // Numeric prize e.g. ₹3,20,000
    return { main: raw, sub: 'JACKPOT PRIZE', isLargeUnit: false };
  }, [topStep.prize]);

  return (
    <div 
      className="w-[200px] rounded-2xl p-2 border border-amber-400/60 shadow-[0_0_35px_rgba(0,0,0,0.95),inset_0_0_15px_rgba(251,191,36,0.15)] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl select-none shrink-0"
      style={{
        background: 'linear-gradient(180deg, rgba(8, 14, 38, 0.98) 0%, rgba(4, 8, 22, 0.99) 100%)'
      }}
    >
      {/* ── HIGH-TECH CONTESTANT HUD (Top Banner) ── */}
      <div className="pb-1.5 mb-1 border-b border-indigo-900/70 relative z-10 flex flex-col gap-1 text-[10px] font-mono leading-none">
        {/* Candidate Info Line */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-300 shrink-0 flex items-center justify-center">
              {candidatePhoto ? (
                <img src={candidatePhoto} alt={candidateName} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-300 font-bold text-[9px]">
                  {(candidateName || 'C').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="font-sans font-bold text-[10.5px] text-white truncate max-w-[95px] drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
              {candidateName || 'Contestant'}
            </span>
          </div>
          <span className="text-cyan-300 font-black text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 shrink-0">
            Q{activeLevel}/{totalQuestions}
          </span>
        </div>

        {/* Live Points & Safe Padav Line */}
        <div className="flex items-center justify-between text-[9px]">
          <span className={`font-black flex items-center gap-1 ${
            isWrongAnswer ? 'text-red-300 animate-pulse' : isOut ? 'text-red-400 line-through' : 'text-amber-300'
          }`}>
            ⭐ {(userPoints || 0).toLocaleString()} <span className="text-[8px] text-amber-400/80 font-sans">pts</span>
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-0.5 text-[8.5px]">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
            {safePoints} pts
          </span>
        </div>
      </div>

      {/* ── TOP BEVELED DOUBLE-HEXAGON POD (Jackpot Milestone - Increased Height & 200px Fit) ── */}
      <div 
        ref={isTopActive ? currentStepRef : null}
        className="relative flex flex-col items-center justify-center my-0.5 z-10"
      >
        <div 
          className={`relative w-[188px] h-[58px] flex flex-col items-center justify-center text-center transition-all duration-500 ${
            isTopActive
              ? 'scale-105 filter drop-shadow-[0_0_24px_rgba(251,191,36,0.95)] animate-pulse'
              : 'hover:scale-[1.02]'
          }`}
        >
          {/* SVG Double Beveled Hexagonal Frame */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            viewBox="0 0 196 64" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="goldHexGrad200" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a"/>
                <stop offset="35%" stopColor="#f59e0b"/>
                <stop offset="70%" stopColor="#fbbf24"/>
                <stop offset="100%" stopColor="#b45309"/>
              </linearGradient>
              <linearGradient id="goldFillGrad200" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isTopActive ? 'rgba(245, 158, 11, 0.55)' : 'rgba(24, 18, 56, 0.95)'}/>
                <stop offset="100%" stopColor={isTopActive ? 'rgba(120, 53, 15, 0.75)' : 'rgba(8, 12, 32, 0.98)'}/>
              </linearGradient>
            </defs>

            {/* Outer Hexagon */}
            <polygon 
              points="20,2 176,2 194,24 194,40 176,62 20,62 2,40 2,24" 
              fill="url(#goldFillGrad200)" 
              stroke="url(#goldHexGrad200)" 
              strokeWidth="2.4"
            />
            {/* Inner Hexagon Border */}
            <polygon 
              points="24,6 172,6 188,26 188,38 172,58 24,58 8,38 8,26" 
              fill="none" 
              stroke={isTopActive ? '#fef08a' : '#d97706'} 
              strokeWidth="1.2"
              strokeDasharray={isTopActive ? 'none' : '4 3'}
              opacity="0.85"
            />
          </svg>

          {/* Crisp Top Typography */}
          <div className="relative z-10 flex flex-col items-center justify-center leading-tight px-1.5 w-full text-center select-none" style={{ whiteSpace: 'nowrap' }}>
            <span 
              className={`font-sans font-black whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-500 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-tight ${
                topPrizeInfo.isLargeUnit ? 'text-lg sm:text-xl leading-none' : 'text-xs sm:text-sm font-black'
              }`}
              style={{ whiteSpace: 'nowrap', display: 'inline-block' }}
            >
              {topPrizeInfo.main}
            </span>
            <span className="font-sans font-black text-[9px] text-amber-300 uppercase tracking-[0.15em] whitespace-nowrap drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] block mt-0.5">
              {topPrizeInfo.sub}
            </span>
            <span className="text-[8px] font-mono font-bold text-amber-400/90 whitespace-nowrap block">
              {(topStep.level * 100).toLocaleString()} pts
            </span>
          </div>

          {/* Horizontal laser beam if top step is active */}
          {isTopActive && (
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-[2.5px] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, rgba(254,240,138,1) 0%, rgba(56,189,248,0.9) 60%, transparent 100%)',
                boxShadow: '0 0 10px #38bdf8'
              }}
            />
          )}
        </div>
      </div>

      {/* ── THE VERTICAL LADDER (CYAN LASER SPINE & RUNGS WITH SCROLL SUPPORT FOR 50 LEVELS) ── */}
      <div className={`relative w-full my-0.5 ${totalQuestions > 16 ? 'max-h-[500px] overflow-y-auto pr-0.5' : ''}`}>
        
        {/* Cyan Vertical Laser Spine Line */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-1 w-[2px] pointer-events-none z-0"
          style={{
            background: 'linear-gradient(180deg, rgba(6,182,212,0.95) 0%, rgba(59,130,246,0.85) 50%, rgba(99,102,241,0.6) 100%)',
            boxShadow: '0 0 8px rgba(6, 182, 212, 0.85)'
          }}
        />

        {/* Stacked Rungs: Fits completely with comfortable height & smooth auto-scroll */}
        <div className="space-y-[3px] relative z-10">
          {ladderSteps.map(step => {
            const isCurrent = step.level === activeLevel;
            const isPassed = step.level < activeLevel;
            const isDroppedStep = isWrongAnswer && step.level === activeLevel;

            let strokeColor = '#38bdf8';
            let strokeWidth = '1.2';
            let fillColor = 'rgba(6, 11, 30, 0.94)';
            let textColor = 'text-cyan-100';
            let filterStyle = 'none';

            if (isDroppedStep) {
              strokeColor = '#ef4444';
              strokeWidth = '1.8';
              fillColor = 'rgba(127, 29, 29, 0.92)';
              textColor = 'text-white';
              filterStyle = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.85))';
            } else if (isCurrent) {
              strokeColor = '#fef08a';
              strokeWidth = '2';
              fillColor = 'rgba(180, 83, 9, 0.94)';
              textColor = 'text-white';
              filterStyle = 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.95))';
            } else if (isPassed) {
              strokeColor = '#10b981';
              strokeWidth = '1.2';
              fillColor = 'rgba(6, 40, 28, 0.9)';
              textColor = 'text-emerald-200';
            } else if (step.isSafe) {
              strokeColor = '#f59e0b';
              strokeWidth = '1.6';
              fillColor = 'rgba(24, 18, 52, 0.94)';
              textColor = 'text-amber-300';
              filterStyle = 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.45))';
            }

            return (
              <motion.div
                key={step.level}
                ref={isCurrent ? currentStepRef : null}
                layout
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`relative w-full h-[25px] sm:h-[27px] flex items-center justify-between px-3 text-[11px] font-bold transition-all duration-200 cursor-default ${
                  isCurrent ? 'scale-[1.03] z-20' : 'hover:scale-[1.015]'
                }`}
                style={{ filter: filterStyle }}
              >
                {/* SVG Elongated Hexagonal Background */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox="0 0 196 28" 
                  preserveAspectRatio="none"
                >
                  <polygon 
                    points="14,1 182,1 194,14 182,27 14,27 2,14" 
                    fill={fillColor} 
                    stroke={strokeColor} 
                    strokeWidth={strokeWidth}
                  />
                  {/* Subtle inner horizontal gloss line on top */}
                  <line x1="18" y1="3" x2="178" y2="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </svg>

                {/* Left: Level Number with Diamond/Check indicator */}
                <span className={`relative z-10 font-mono text-[10px] font-black w-5 text-left flex items-center gap-0.5 ${
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

                {/* Center: Prize Amount */}
                <span className={`relative z-10 text-[11px] sm:text-[12px] font-black tracking-tight text-center flex-1 truncate px-1 ${textColor} ${
                  isCurrent ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]' : ''
                }`}>
                  {step.prize}
                </span>

                {/* Right: Milestone Dot or Points */}
                <span className="relative z-10 text-[9px] font-mono text-slate-400 w-8 text-right truncate">
                  {step.isSafe ? (
                    <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-bold border border-amber-400/40">
                      PADAV
                    </span>
                  ) : (
                    <span>{step.points}</span>
                  )}
                </span>

                {/* Horizontal Laser Beam on Active Level */}
                {isCurrent && (
                  <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-[2.5px] pointer-events-none z-30"
                    style={{
                      background: 'linear-gradient(90deg, rgba(254,240,138,1) 0%, rgba(56,189,248,0.9) 60%, transparent 100%)',
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.9)'
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* ── FOOTER: SAFE PADAV LEGEND ── */}
      <div className="mt-1 pt-1 border-t border-indigo-900/70 flex items-center justify-between text-[8px] text-slate-400 font-sans relative z-10">
        <span className="text-amber-300 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm" />
          Safe: Q5, Q10, Q15
        </span>
        <span className="text-cyan-400 font-mono font-bold">
          +100 pts/lvl
        </span>
      </div>

    </div>
  );
}
