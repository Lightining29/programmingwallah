import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Authentic KBC Broadcast Studio Moving Searchlights & Lasers
 * Inspired by the TV broadcast arena:
 * - Sweeping Overhead Angled Beams (Criss-crossing golden-amber and cyan beams from overhead truss).
 * - High-Power Stage Floor Projector Beams.
 * - Reactive states: Ambient continuous sway, Amber focus on Lock, Emerald celebratory sweep on Correct, and Crimson warning on Wrong.
 */
export default function KbcStageLasers({ 
  triggerUpwardSweep = false, 
  isCelebratingCorrect = false,
  isWrongAnswer = false,
  isLocked = false
}) {
  const [isQuestionHeldUp, setIsQuestionHeldUp] = useState(false);

  // When new question arrives, hold lasers high for a moment then resume ambient sway
  useEffect(() => {
    if (triggerUpwardSweep) {
      setIsQuestionHeldUp(true);
      const timer = setTimeout(() => {
        setIsQuestionHeldUp(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [triggerUpwardSweep]);

  // ── 1. Overhead Criss-Cross Moving Beams (Sweeping Yellow/Amber & Cyan/Blue) ──
  // Matching Image 1: 3 golden spotlights from top-left, 3 cyan spotlights from top-right
  const overheadCrissCrossBeams = useMemo(() => [
    // Left Golden/Amber Cluster (Angling down towards center & right)
    { id: 'top-gold-1', originLeft: '26%', originTop: '4%', baseAngle: 28, sweepRange: [20, 36], duration: 8.5, color: 'gold', delay: 0 },
    { id: 'top-gold-2', originLeft: '33%', originTop: '5%', baseAngle: 18, sweepRange: [10, 26], duration: 11.2, color: 'gold', delay: 0.3 },
    { id: 'top-gold-3', originLeft: '40%', originTop: '6%', baseAngle: 8,  sweepRange: [2, 16],  duration: 9.7, color: 'gold', delay: 0.15 },

    // Right Cyan/Blue Cluster (Angling down towards center & left)
    { id: 'top-cyan-1', originLeft: '60%', originTop: '6%', baseAngle: -8,  sweepRange: [-16, -2],  duration: 10.4, color: 'cyan', delay: 0.2 },
    { id: 'top-cyan-2', originLeft: '67%', originTop: '5%', baseAngle: -18, sweepRange: [-26, -10], duration: 7.9,  color: 'cyan', delay: 0.4 },
    { id: 'top-cyan-3', originLeft: '74%', originTop: '4%', baseAngle: -28, sweepRange: [-36, -20], duration: 12.0, color: 'cyan', delay: 0.1 }
  ], []);

  // ── 2. Six Floor Laser Projector Beams ──
  const floorBeams = useMemo(() => [
    { id: 'f-1', baseLeft: '22%', baseAngle: -36, sweepUpAngle: -14, downAngle: -55, ambientRange: [-42, -28], delay: 0 },
    { id: 'f-2', baseLeft: '22%', baseAngle: 22,  sweepUpAngle: 10,  downAngle: 36,  ambientRange: [16, 28],   delay: 0.15 },
    { id: 'f-3', baseLeft: '50%', baseAngle: -16, sweepUpAngle: -6,  downAngle: -28, ambientRange: [-22, -10], delay: 0.3 },
    { id: 'f-4', baseLeft: '50%', baseAngle: 16,  sweepUpAngle: 6,   downAngle: 28,  ambientRange: [10, 22],   delay: 0.1 },
    { id: 'f-5', baseLeft: '78%', baseAngle: -22, sweepUpAngle: -10, downAngle: -36, ambientRange: [-28, -16], delay: 0.2 },
    { id: 'f-6', baseLeft: '78%', baseAngle: 36,  sweepUpAngle: 14,  downAngle: 55,  ambientRange: [28, 42],   delay: 0.35 }
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">

      {/* ── Floor Stage Ambient Glow ── */}
      <div 
        className={`absolute -bottom-8 left-0 right-0 h-32 blur-2xl pointer-events-none transition-colors duration-700 ${
          isWrongAnswer
            ? 'bg-gradient-to-t from-red-950/70 via-red-900/30 to-transparent'
            : isCelebratingCorrect
              ? 'bg-gradient-to-t from-emerald-950/70 via-emerald-900/30 to-transparent'
              : isLocked
                ? 'bg-gradient-to-t from-amber-950/70 via-amber-900/30 to-transparent'
                : 'bg-gradient-to-t from-blue-950/50 via-blue-900/20 to-transparent'
        }`}
      />

      {/* ── 1. OVERHEAD REAL MOVING CRISS-CROSS VOLUMETRIC CONES (From Arena Truss) ── */}
      {overheadCrissCrossBeams.map((beam) => {
        const isGold = beam.color === 'gold';
        
        let targetAngle = [beam.sweepRange[0], beam.sweepRange[1], beam.sweepRange[0]];
        let transition = {
          duration: beam.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: beam.delay
        };

        if (isWrongAnswer) {
          targetAngle = [beam.baseAngle, beam.baseAngle * 1.4];
          transition = { duration: 3.0, ease: 'easeOut' };
        } else if (isCelebratingCorrect) {
          targetAngle = [beam.baseAngle, beam.sweepRange[1] * 1.5, beam.sweepRange[0] * 1.5, beam.baseAngle];
          transition = { duration: 4.0, ease: 'easeInOut' };
        } else if (isLocked) {
          // Focus inwards towards the hotseat center
          targetAngle = isGold ? 12 : -12;
          transition = { duration: 1.2, ease: 'easeOut' };
        }

        // Color palettes
        const beamCore = isWrongAnswer
          ? 'linear-gradient(180deg, rgba(239,68,68,0.9) 0%, rgba(220,38,38,0.5) 40%, rgba(220,38,38,0.1) 80%, transparent 100%)'
          : isCelebratingCorrect
            ? 'linear-gradient(180deg, rgba(16,185,129,0.9) 0%, rgba(52,211,153,0.55) 40%, rgba(16,185,129,0.1) 80%, transparent 100%)'
            : isGold
              ? 'linear-gradient(180deg, rgba(251,191,36,0.85) 0%, rgba(245,158,11,0.5) 40%, rgba(217,119,6,0.12) 80%, transparent 100%)'
              : 'linear-gradient(180deg, rgba(56,189,248,0.85) 0%, rgba(14,165,233,0.5) 40%, rgba(3,105,161,0.12) 80%, transparent 100%)';

        const glowColor = isWrongAnswer
          ? 'rgba(239, 68, 68, 0.6)'
          : isCelebratingCorrect
            ? 'rgba(16, 185, 129, 0.6)'
            : isGold
              ? 'rgba(245, 158, 11, 0.55)'
              : 'rgba(56, 189, 248, 0.55)';

        return (
          <motion.div
            key={beam.id}
            style={{
              left: beam.originLeft,
              top: beam.originTop,
              transformOrigin: 'top center',
              willChange: 'transform, opacity'
            }}
            animate={{
              rotate: targetAngle,
              opacity: isWrongAnswer ? [0.4, 0.9, 0.3, 0.9] : isLocked ? 0.95 : 0.82
            }}
            transition={transition}
            className="absolute pointer-events-none flex flex-col items-center -translate-x-1/2 z-10"
          >
            {/* Projector Lens Emitter */}
            <div 
              className="w-4 h-4 rounded-full bg-white shadow-lg pointer-events-none"
              style={{ boxShadow: `0 0 15px #ffffff, 0 0 30px ${glowColor}` }}
            />

            {/* Volumetric Fanning Light Cone */}
            <div 
              className="relative w-28 sm:w-36 h-[110vh] pointer-events-none -mt-1"
              style={{
                background: beamCore,
                clipPath: 'polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)',
                filter: `drop-shadow(0 0 16px ${glowColor})`
              }}
            >
              {/* Ultra-bright Center Filament */}
              <div 
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 sm:w-1.5 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                  boxShadow: '0 0 8px #ffffff'
                }}
              />
            </div>
          </motion.div>
        );
      })}

      {/* ── 2. FLOOR PROJECTOR BEAMS (Shooting upwards) ── */}
      {floorBeams.map((beam) => {
        let targetAngle = [beam.ambientRange[0], beam.ambientRange[1], beam.ambientRange[0]];
        let transition = {
          duration: 5.5 + beam.delay * 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: beam.delay
        };

        if (isWrongAnswer) {
          targetAngle = [beam.baseAngle, beam.downAngle];
          transition = { duration: 3.0, ease: 'easeInOut' };
        } else if (isCelebratingCorrect) {
          targetAngle = [beam.baseAngle, beam.sweepUpAngle * 0.4, beam.sweepUpAngle * 0.8];
          transition = { duration: 4.2, ease: 'easeInOut' };
        } else if (isQuestionHeldUp) {
          targetAngle = beam.sweepUpAngle;
          transition = { duration: 1.0, ease: [0.16, 1, 0.3, 1] };
        }

        const isWrong = isWrongAnswer;
        const beamGradient = isWrong
          ? 'linear-gradient(90deg, #ff0033 0%, rgba(255,50,80,0.8) 20%, #ffffff 50%, rgba(255,50,80,0.8) 80%, #ff0033 100%)'
          : isCelebratingCorrect
            ? 'linear-gradient(90deg, #059669 0%, #34d399 20%, #ffffff 50%, #34d399 80%, #059669 100%)'
            : isLocked
              ? 'linear-gradient(90deg, #d97706 0%, #fbbf24 20%, #ffffff 50%, #fbbf24 80%, #d97706 100%)'
              : 'linear-gradient(90deg, #0284c7 0%, #38bdf8 20%, #ffffff 50%, #38bdf8 80%, #0284c7 100%)';

        return (
          <motion.div
            key={beam.id}
            style={{
              left: beam.baseLeft,
              bottom: 0,
              transformOrigin: 'bottom center',
              willChange: 'transform, opacity'
            }}
            animate={{
              rotate: targetAngle,
              opacity: isWrong ? [1, 0.3, 1, 0.2, 0.9] : isLocked ? 0.95 : 0.85
            }}
            transition={transition}
            className="absolute h-[135vh] pointer-events-none flex items-center justify-center -translate-x-1/2 z-10"
          >
            {/* Outer Glow */}
            <div 
              className={`absolute w-7 sm:w-10 h-full blur-[4px] pointer-events-none transition-colors duration-500 ${
                isWrong ? 'bg-red-500/80 shadow-[0_0_30px_#ef4444]' :
                isCelebratingCorrect ? 'bg-emerald-500/80 shadow-[0_0_30px_#10b981]' :
                isLocked ? 'bg-amber-500/80 shadow-[0_0_30px_#f59e0b]' :
                'bg-cyan-400/80 shadow-[0_0_30px_#00e5ff]'
              }`}
            />

            {/* Solid Laser Shaft */}
            <div 
              className="relative w-3.5 sm:w-4 h-full pointer-events-none"
              style={{ background: beamGradient }}
            />

            {/* White Core Filament */}
            <div className="absolute w-1 sm:w-1.5 h-full bg-white shadow-[0_0_8px_#ffffff] pointer-events-none" />

            {/* Base Emitter Spark */}
            <div className="absolute bottom-0 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_#ffffff] -translate-y-1" />
          </motion.div>
        );
      })}

      {/* ── CELEBRATION WHOLE-STAGE FLASH EFFECT ── */}
      {isCelebratingCorrect && (
        <motion.div
          animate={{
            opacity: [0, 0.5, 0.05, 0.75, 0.1, 0.6, 0.05, 0.2, 0.7, 0.05, 0.8, 0]
          }}
          transition={{ duration: 4.0, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-b from-cyan-300/30 via-emerald-500/20 to-transparent mix-blend-screen pointer-events-none z-30"
        />
      )}

    </div>
  );
}