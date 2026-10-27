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

  // Active highlighted level on the leaderboard:
  // If player answered wrong, their place in the leaderboard moves down!
  // Example: player was at 200 pts and gave wrong answer -> drops to 100 pts (Level 1)
  const activeLevel = Math.max(
    1,
    isWrongAnswer 
      ? Math.max(1, currentLevel - 1)
      : Math.min(totalQuestions, Math.max(1, currentLevel))
  );

  // Auto-scroll to active current level
  useEffect(() => {
    if (currentStepRef.current) {
      currentStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeLevel]);

  // Organize steps according to total questions (16 or 30)
  const ladderSteps = KBC_PRIZE_LADDER
    .slice(0, Math.min(totalQuestions, KBC_PRIZE_LADDER.length))
    .map(step => {
      // Dynamic padav rule: safe milestones every 5 levels in 30-question mode
      const isPadav = totalQuestions > 16 
        ? (step.level % 5 === 0)
        : (step.level === 5 || step.level === 10 || step.level === 15 || step.level === 16);

      let padavLabel = '';
      if (isPadav) {
        if (step.level === totalQuestions) {
          padavLabel = totalQuestions > 16 ? 'JACKPOT' : '7 CRORE';
        } else {
          padavLabel = `PADAV ${Math.floor(step.level / 5)}`;
        }
      }

      return {
        ...step,
        points: step.level * 100,
        isSafe: isPadav,
        padavLabel
      };
    })
    .reverse(); // Render descending from top level down to level 1

  return (
    <div 
      className="w-full rounded-3xl p-3 sm:p-4 border border-amber-400/40 shadow-[0_0_35px_rgba(0,0,0,0.85)] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl"
      style={{
        background: 'linear-gradient(180deg, rgba(10, 16, 42, 0.95) 0%, rgba(6, 10, 26, 0.98) 100%)'
      }}
    >
      {/* ── HEADER ── */}
      <div className="pb-3 border-b border-indigo-900/60 mb-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/30">
              <Trophy className="w-4 h-4 font-black" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                POINT LEADERBOARD
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Authentic KBC Dhanrashi & Points Tree
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold">
            {totalQuestions} Levels
          </span>
        </div>

        {/* Contestant's Real-Time Points & Safe Padav Status */}
        <div className={`p-2.5 rounded-2xl border transition-all duration-500 ${
          isWrongAnswer 
            ? 'bg-red-950/70 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.5)]'
            : isOut 
              ? 'bg-red-950/50 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : 'bg-[#12183d]/80 border-indigo-500/30'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <span>Your Points:</span>
              <strong className={`font-mono font-black ${isWrongAnswer ? 'text-red-300 text-sm animate-pulse' : isOut ? 'text-red-300 line-through' : 'text-amber-300 text-sm'}`}>
                ⭐ {userPoints.toLocaleString()} pts
              </strong>
              {isWrongAnswer && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-600/40 text-red-200 border border-red-500 font-mono font-bold animate-pulse">
                  -100 pts
                </span>
              )}
            </span>

            <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Safe: {safePoints} pts
            </span>
          </div>

          {/* Out / Cutoff Alert Banner */}
          {(isWrongAnswer || isOut) && (
            <div className="mt-1.5 pt-1.5 border-t border-red-500/30 flex items-center gap-1.5 text-[10px] text-red-300 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>
                {isWrongAnswer 
                  ? `Wrong Answer: Place dropped down to Level ${activeLevel} (${activeLevel * 100} pts)` 
                  : `OUT: Points locked to safe padav (${safePoints} pts / ${safePrize})`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── LADDER STEPS (Level 30 or 16 down to Level 1) ── */}
      <div className={`space-y-1 overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-indigo-800 ${
        totalQuestions > 16 ? 'max-h-[460px] sm:max-h-[520px]' : 'max-h-[460px]'
      }`}>
        {ladderSteps.map(step => {
          const isCurrent = step.level === activeLevel;
          const isPassed = step.level < activeLevel;
          const isDroppedStep = isWrongAnswer && step.level === activeLevel;

          return (
            <motion.div
              key={step.level}
              ref={isCurrent ? currentStepRef : null}
              layout
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-700 ${
                isDroppedStep
                  ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white font-black shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-[1.02] border-2 border-red-300 animate-pulse'
                  : isCurrent
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/40 scale-[1.02] border-2 border-white'
                    : isPassed
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                      : step.isSafe
                        ? 'bg-amber-500/15 border border-amber-400/40 text-amber-200'
                        : 'bg-slate-950/50 border border-indigo-950/60 text-slate-300 hover:text-white'
              }`}
            >
              {/* Left: Level Number & Current Marker */}
              <div className="flex items-center gap-2">
                <span className={`w-6 text-right font-mono text-xs font-black ${
                  isDroppedStep 
                    ? 'text-white' 
                    : isCurrent 
                      ? 'text-slate-950' 
                      : isPassed 
                        ? 'text-emerald-400' 
                        : 'text-amber-400'
                }`}>
                  {isDroppedStep ? '▼' : isCurrent ? '◆' : isPassed ? <Check className="w-3.5 h-3.5 inline text-emerald-400 stroke-[3]" /> : step.level}
                </span>

                <span className={`font-mono text-[11px] font-bold ${
                  isDroppedStep ? 'text-white font-black' : isCurrent ? 'text-slate-950 font-black' : isPassed ? 'text-emerald-300' : 'text-white'
                }`}>
                  {step.points.toLocaleString()} pts {isDroppedStep ? '(DROPPED)' : ''}
                </span>
              </div>

              {/* Right: Prize Amount & Padav Badge */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black ${
                  isDroppedStep 
                    ? 'text-white' 
                    : isCurrent 
                      ? 'text-slate-950' 
                      : step.isSafe 
                        ? 'text-amber-300' 
                        : 'text-slate-200'
                }`}>
                  {step.prize}
                </span>

                {step.isSafe && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase font-sans ${
                    isCurrent 
                      ? 'bg-slate-950 text-amber-400' 
                      : 'bg-amber-400/30 text-amber-300 border border-amber-400/50'
                  }`}>
                    {step.padavLabel || 'PADAV'}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── FOOTER ── */}
      <div className="mt-3 pt-2 border-t border-indigo-900/60 flex items-center justify-between text-[10px] text-slate-400 font-sans">
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          Safe Padavs: {totalQuestions > 16 ? 'Q5, Q10, Q15, Q20, Q25, Q30' : 'Q5, Q10, Q15, Q16'}
        </span>
        <span className="text-red-400/80 font-mono text-[9px]">
          *Wrong answer = -100 pts & place drops
        </span>
      </div>

    </div>
  );
}
