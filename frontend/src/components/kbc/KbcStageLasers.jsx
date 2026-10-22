import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Stage Laser Lighting (Aurora Cobalt & Aurora Crimson Edition)
 * Inspired by high-end concert laser rigs (X-Laser Aurora Cobalt / Aurora Crimson).
 * 
 * Features:
 * - Crisp, bright, razor-sharp beam shafts (NO blurry fog).
 * - Solid white-hot luminous core with electric neon coronas.
 * - Piercing overhead downward red lasers on wrong answer.
 * - Dynamic celebration dance & strobe flicker on correct answer.
 * - Never disappears!
 */
export default function KbcStageLasers({ 
  triggerUpwardSweep = false, 
  isCelebratingCorrect = false,
  isWrongAnswer = false
}) {
  const [isQuestionHeldUp, setIsQuestionHeldUp] = useState(false);

  // When new question arrives, hold lasers high for a moment then resume ambient
  useEffect(() => {
    if (triggerUpwardSweep) {
      setIsQuestionHeldUp(true);
      const timer = setTimeout(() => {
        setIsQuestionHeldUp(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [triggerUpwardSweep]);

  // ── 1. Floor Projector Beams (Emanating from bottom stage floor) ──
  const floorBeams = useMemo(() => [
    // Station 1: Left (~18%)
    { id: 1, baseLeft: '18%', baseAngle: -42, sweepUpAngle: -18, downAngle: -60, ambientRange: [-48, -34], delay: 0 },
    { id: 2, baseLeft: '18%', baseAngle: 24,  sweepUpAngle: 12,  downAngle: 38,  ambientRange: [18, 30],   delay: 0.2 },

    // Station 2: Mid-Left (~38%)
    { id: 3, baseLeft: '38%', baseAngle: -30, sweepUpAngle: -10, downAngle: -45, ambientRange: [-36, -22], delay: 0.4 },
    { id: 4, baseLeft: '38%', baseAngle: 28,  sweepUpAngle: 14,  downAngle: 42,  ambientRange: [20, 34],   delay: 0.1 },

    // Station 3: Mid-Right (~62%)
    { id: 5, baseLeft: '62%', baseAngle: -28, sweepUpAngle: -14, downAngle: -42, ambientRange: [-34, -20], delay: 0.3 },
    { id: 6, baseLeft: '62%', baseAngle: 30,  sweepUpAngle: 10,  downAngle: 45,  ambientRange: [22, 36],   delay: 0.5 },

    // Station 4: Right (~82%)
    { id: 7, baseLeft: '82%', baseAngle: -24, sweepUpAngle: -12, downAngle: -38, ambientRange: [-30, -18], delay: 0.2 },
    { id: 8, baseLeft: '82%', baseAngle: 42,  sweepUpAngle: 18,  downAngle: 60,  ambientRange: [34, 48],   delay: 0.4 },

    // Station Center Highlights (~50%)
    { id: 9, baseLeft: '50%', baseAngle: -12, sweepUpAngle: -4,  downAngle: -24, ambientRange: [-18, -6],  delay: 0.1 },
    { id: 10, baseLeft: '50%', baseAngle: 12, sweepUpAngle: 4,   downAngle: 24,  ambientRange: [6, 18],    delay: 0.3 }
  ], []);

  // ── 2. Overhead Downward Projector Beams (Shooting down on Wrong Answer, matching photo) ──
  const overheadDownwardBeams = useMemo(() => [
    // Station Left Ceiling Rig (~16%)
    { id: 'top-1', left: '16%', angle: 34, delay: 0 },
    { id: 'top-2', left: '16%', angle: 52, delay: 0.05 },
    { id: 'top-3', left: '24%', angle: 22, delay: 0.08 },
    
    // Station Right Ceiling Rig (~84%)
    { id: 'top-4', left: '84%', angle: -34, delay: 0 },
    { id: 'top-5', left: '84%', angle: -52, delay: 0.05 },
    { id: 'top-6', left: '76%', angle: -22, delay: 0.08 },

    // Station Center Ceiling Rig (~50%)
    { id: 'top-7', left: '46%', angle: -10, delay: 0.02 },
    { id: 'top-8', left: '54%', angle: 10, delay: 0.02 }
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">

      {/* ── STAGE FLOOR AMBIENCE (Clean subtle gradient, non-muddy) ── */}
      <div 
        className={`absolute -bottom-10 left-0 right-0 h-32 blur-xl pointer-events-none transition-colors duration-700 ${
          isWrongAnswer
            ? 'bg-gradient-to-t from-red-950/80 via-red-900/40 to-transparent'
            : 'bg-gradient-to-t from-blue-950/60 via-blue-900/20 to-transparent'
        }`}
      />

      {/* Backstage floor flare on wrong answer */}
      {isWrongAnswer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.7, 0.9, 0.75] }}
          transition={{ duration: 1.0, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[250px] rounded-[100%] bg-red-600/30 blur-2xl pointer-events-none"
        />
      )}

      {/* 4 Floor Projector Bases */}
      {[18, 38, 62, 82].map((pos) => (
        <div
          key={pos}
          style={{ left: `${pos}%` }}
          className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
        >
          {/* Intense Projector Spot Lens */}
          <div 
            className={`w-5 h-2.5 rounded-full transition-all duration-500 ${
              isWrongAnswer
                ? 'bg-white shadow-[0_0_20px_#ffffff,0_0_35px_#ef4444,0_0_50px_#dc2626]'
                : 'bg-white shadow-[0_0_20px_#ffffff,0_0_35px_#38bdf8,0_0_50px_#0284c7]'
            }`}
          />
          <div 
            className={`w-10 h-4 -mt-1 rounded-full blur-sm transition-colors duration-500 ${
              isWrongAnswer ? 'bg-red-500/60' : 'bg-cyan-500/50'
            }`}
          />
        </div>
      ))}

      {/* ── 10 HIGH-POWER, CRISP FLOOR BEAMS (Never Blurry, Solid Bright) ── */}
      {floorBeams.map((beam) => {
        let targetAngle;
        let targetOpacity;
        let targetScaleY;
        let transitionConfig;

        if (isWrongAnswer) {
          // ── WRONG ANSWER: Move down with high power bright red beam towards down and STOP ──
          targetAngle = beam.downAngle;
          targetOpacity = 1.0;
          targetScaleY = 1.1;
          transitionConfig = {
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1] // Snappy down sweep, then STOPS and HOLDS
          };
        } else if (isCelebratingCorrect) {
          // ── CORRECT CELEBRATION: Move up to middle -> flicker -> move down -> flicker -> move up ──
          const midAngle = beam.sweepUpAngle * 0.4;
          const downAngle = beam.baseAngle * 1.35;
          const finalUpAngle = beam.sweepUpAngle * 0.8;

          targetAngle = [
            beam.baseAngle,
            midAngle,
            midAngle,
            downAngle,
            downAngle,
            finalUpAngle
          ];
          targetScaleY = [1, 1.15, 1.25, 0.85, 0.8, 1.2];
          targetOpacity = [0.9, 1, 0.25, 1, 0.25, 1];
          transitionConfig = {
            duration: 4.2,
            times: [0, 0.2, 0.35, 0.65, 0.8, 1],
            ease: 'easeInOut'
          };
        } else if (isQuestionHeldUp) {
          // ── NEW QUESTION: Sweeps up and stops/holds right there ──
          targetAngle = beam.sweepUpAngle;
          targetOpacity = 1.0;
          targetScaleY = 1.15;
          transitionConfig = {
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1]
          };
        } else {
          // ── NORMAL AMBIENT: Continuous swaying (NEVER disappears) ──
          targetAngle = [beam.ambientRange[0], beam.ambientRange[1], beam.ambientRange[0]];
          targetOpacity = [0.95, 1.0, 0.95];
          targetScaleY = 1;
          transitionConfig = {
            duration: 4.8 + beam.delay * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: beam.delay
          };
        }

        return (
          <motion.div
            key={beam.id}
            style={{
              left: beam.baseLeft,
              bottom: 0,
              transformOrigin: 'bottom center',
              filter: isWrongAnswer
                ? 'drop-shadow(0 0 6px #ff0033) drop-shadow(0 0 16px #dc2626)'
                : 'drop-shadow(0 0 6px #00e5ff) drop-shadow(0 0 16px #0066ff)'
            }}
            animate={{
              rotate: targetAngle,
              opacity: targetOpacity,
              scaleY: targetScaleY
            }}
            transition={transitionConfig}
            className="absolute h-[145vh] pointer-events-none flex items-center justify-center -translate-x-1/2"
          >
            {/* 1. Tight, high-contrast glow corona (No wide blur - only blur-[3px]) */}
            <div 
              className={`absolute w-6 sm:w-7 h-full blur-[3px] pointer-events-none transition-all duration-500 ${
                isWrongAnswer
                  ? 'bg-gradient-to-t from-rose-600 via-red-500 to-red-600/60'
                  : 'bg-gradient-to-t from-cyan-400 via-sky-400 to-blue-500/80'
              }`}
            />

            {/* 2. Solid, Sharp Piercing White-Hot Core (Clean 3px - 4px core with intense neon borders) */}
            <div 
              className="relative w-2.5 sm:w-3 h-full pointer-events-none"
              style={{
                background: isWrongAnswer
                  ? 'linear-gradient(90deg, #ff0033 0%, #ffffff 38%, #ffffff 62%, #ff0033 100%)'
                  : 'linear-gradient(90deg, #00d9ff 0%, #ffffff 38%, #ffffff 62%, #00d9ff 100%)',
                boxShadow: isWrongAnswer
                  ? '0 0 10px #ffffff, 0 0 22px #ef4444'
                  : '0 0 10px #ffffff, 0 0 22px #38bdf8'
              }}
            />

            {/* 3. Floor Projector Emitter Base Spark */}
            <div 
              className={`absolute bottom-0 w-3.5 h-3.5 rounded-full bg-white -translate-y-1 transition-all duration-500 ${
                isWrongAnswer 
                  ? 'shadow-[0_0_20px_#ffffff,0_0_35px_#ef4444]' 
                  : 'shadow-[0_0_20px_#ffffff,0_0_35px_#38bdf8]'
              }`}
            />
          </motion.div>
        );
      })}

      {/* ── 3. OVERHEAD HIGH-POWER DOWNWARD RED LASER RIG (Active on Wrong Answer, Crisp & Sharp) ── */}
      {isWrongAnswer && overheadDownwardBeams.map((beam) => (
        <motion.div
          key={beam.id}
          initial={{ scaleY: 0, opacity: 0, rotate: beam.angle }}
          animate={{ scaleY: 1.25, opacity: 1, rotate: beam.angle }}
          transition={{ duration: 0.65, delay: beam.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            left: beam.left,
            top: 0,
            transformOrigin: 'top center',
            filter: 'drop-shadow(0 0 8px #ff0033) drop-shadow(0 0 18px #cc0000)'
          }}
          className="absolute h-[155vh] pointer-events-none flex items-center justify-center -translate-x-1/2 z-20"
        >
          {/* Overhead Projector Lens Spark at Top */}
          <div className="absolute top-0 w-5 h-5 rounded-full bg-white shadow-[0_0_25px_#ffffff,0_0_45px_#ef4444] -translate-y-1" />

          {/* Tight Red Glow Corona (No wide blur!) */}
          <div className="absolute w-7 sm:w-9 h-full bg-gradient-to-b from-red-500 via-rose-500 to-red-600/70 blur-[3px] pointer-events-none" />

          {/* Solid White-Hot Piercing Beam Core (Sharp column) */}
          <div 
            className="relative w-2.5 sm:w-3.5 h-full pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, #ff0033 0%, #ffffff 38%, #ffffff 62%, #ff0033 100%)',
              boxShadow: '0 0 12px #ffffff, 0 0 25px #ef4444'
            }}
          />

          {/* Floor Impact Spot */}
          <div className="absolute bottom-12 w-10 h-4 rounded-full bg-red-400/60 blur-[3px] pointer-events-none shadow-[0_0_20px_#ef4444]" />
        </motion.div>
      ))}

      {/* ── CELEBRATION WHOLE-STAGE STROBE FLASH EFFECT ── */}
      {isCelebratingCorrect && (
        <motion.div
          animate={{
            opacity: [
              0,
              0.5, 0.05, 0.75, 0.1, 0.6, 0.05, 0.2,
              0.7, 0.05, 0.8, 0.1, 0.65, 0.05, 0.35, 0
            ]
          }}
          transition={{ duration: 4.2, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-b from-cyan-300/30 via-blue-500/15 to-transparent mix-blend-screen pointer-events-none z-30"
        />
      )}

    </div>
  );
}
