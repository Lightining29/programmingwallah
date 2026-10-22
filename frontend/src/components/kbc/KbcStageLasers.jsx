import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Stage Laser Lighting (Aurora Cobalt & Aurora Crimson Edition)
 * Inspired by high-end concert laser rigs (X-Laser Aurora Cobalt / Aurora Crimson).
 * 
 * Behaviors:
 * 1. Ambient: Thick, vibrant cobalt blue beams continuously swaying (never disappears).
 * 2. New Question (triggerUpwardSweep): Lasers sweep up and stop/hold there.
 * 3. Correct Answer (isCelebratingCorrect):
 *    - Move faster up to middle
 *    - Flicker bright strobe
 *    - Move down
 *    - Flicker bright strobe
 *    - Move back up!
 * 4. Wrong Answer (isWrongAnswer):
 *    - Changes laser colors to high-power bright red!
 *    - Fires high-power downward red laser beams from overhead rigs toward the stage floor.
 *    - Moves downward with high power and STOPS and LOCKS there.
 *    - Never disappears until the next question arrives!
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

      {/* ── STAGE FLOOR HAZE & AMBIENCE (Switches Blue <-> Red on wrong answer) ── */}
      <div 
        className={`absolute -bottom-10 left-0 right-0 h-48 blur-2xl pointer-events-none transition-colors duration-700 ${
          isWrongAnswer
            ? 'bg-gradient-to-t from-red-950 via-red-900/60 to-transparent'
            : 'bg-gradient-to-t from-blue-950/80 via-blue-900/30 to-transparent'
        }`}
      />

      {/* Backstage fiery glow on wrong answer (Matches concert photo) */}
      {isWrongAnswer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.75, 1, 0.85] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[340px] rounded-[100%] bg-red-600/40 blur-3xl pointer-events-none"
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
                ? 'bg-rose-200 shadow-[0_0_25px_#ef4444,0_0_40px_#dc2626,0_0_55px_#ffffff]'
                : 'bg-cyan-200 shadow-[0_0_20px_#38bdf8,0_0_35px_#0284c7,0_0_50px_#ffffff]'
            }`}
          />
          <div 
            className={`w-12 h-6 -mt-1 rounded-full blur-md transition-colors duration-500 ${
              isWrongAnswer ? 'bg-red-600/50' : 'bg-blue-600/40'
            }`}
          />
        </div>
      ))}

      {/* ── 10 HIGH-POWER FLOOR BEAMS ── */}
      {floorBeams.map((beam) => {
        let targetAngle;
        let targetOpacity;
        let targetScaleY;
        let transitionConfig;

        if (isWrongAnswer) {
          // ── WRONG ANSWER: Move down with high power bright red beam towards down and STOP ──
          targetAngle = beam.downAngle;
          targetOpacity = 1.0; // High power maximum brightness
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
          targetOpacity = [0.85, 1, 0.2, 1, 0.2, 1]; // Exact 6 values matching times array!
          transitionConfig = {
            duration: 4.2,
            times: [0, 0.2, 0.35, 0.65, 0.8, 1],
            ease: 'easeInOut'
          };
        } else if (isQuestionHeldUp) {
          // ── NEW QUESTION: Sweeps up and stops/holds right there ──
          targetAngle = beam.sweepUpAngle;
          targetOpacity = 0.95;
          targetScaleY = 1.15;
          transitionConfig = {
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1]
          };
        } else {
          // ── NORMAL AMBIENT: Continuous swaying (NEVER disappears) ──
          targetAngle = [beam.ambientRange[0], beam.ambientRange[1], beam.ambientRange[0]];
          targetOpacity = [0.85, 0.95, 0.85];
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
              transformOrigin: 'bottom center'
            }}
            animate={{
              rotate: targetAngle,
              opacity: targetOpacity,
              scaleY: targetScaleY
            }}
            transition={transitionConfig}
            className="absolute h-[145vh] pointer-events-none flex items-center justify-center -translate-x-1/2"
          >
            {/* 1. Volumetric Beam Aura (Red if wrong, Cobalt Blue if normal) */}
            <div 
              className={`absolute w-12 sm:w-16 h-full blur-xl pointer-events-none transition-all duration-500 ${
                isWrongAnswer
                  ? 'bg-gradient-to-t from-red-700 via-rose-600/40 to-red-500/10'
                  : 'bg-gradient-to-t from-blue-700/80 via-blue-600/35 to-cyan-400/10'
              }`}
            />

            {/* 2. Intense Glow Mantle Layer */}
            <div 
              className={`absolute w-4 sm:w-5 h-full blur-[4px] pointer-events-none transition-all duration-500 ${
                isWrongAnswer
                  ? 'bg-gradient-to-t from-rose-500 via-red-500/70 to-red-600/30 shadow-[0_0_25px_#ff0033,0_0_50px_#cc0000,0_0_80px_#990000]'
                  : 'bg-gradient-to-t from-cyan-400/90 via-sky-400/60 to-blue-500/20 shadow-[0_0_25px_#00e5ff,0_0_50px_#0055ff]'
              }`}
            />

            {/* 3. Razor-Sharp Solid White Core with colored corona */}
            <div 
              className={`relative w-[3px] sm:w-[4px] h-full bg-white pointer-events-none transition-all duration-500 ${
                isWrongAnswer
                  ? 'shadow-[0_0_12px_#ffffff,0_0_25px_#ef4444,0_0_40px_#b91c1c]'
                  : 'shadow-[0_0_10px_#ffffff,0_0_20px_#38bdf8,0_0_35px_#0284c7]'
              }`}
            />

            {/* 4. Floor Emitter Spark */}
            <div 
              className={`absolute bottom-0 w-3 h-3 rounded-full bg-white -translate-y-1 transition-all duration-500 ${
                isWrongAnswer ? 'shadow-[0_0_20px_#ef4444]' : 'shadow-[0_0_15px_#38bdf8]'
              }`}
            />
          </motion.div>
        );
      })}

      {/* ── 3. OVERHEAD HIGH-POWER DOWNWARD RED LASER RIG (Active on Wrong Answer) ── */}
      {isWrongAnswer && overheadDownwardBeams.map((beam) => (
        <motion.div
          key={beam.id}
          initial={{ scaleY: 0, opacity: 0, rotate: beam.angle }}
          animate={{ scaleY: 1.25, opacity: 1, rotate: beam.angle }}
          transition={{ duration: 0.65, delay: beam.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            left: beam.left,
            top: 0,
            transformOrigin: 'top center'
          }}
          className="absolute h-[155vh] pointer-events-none flex items-center justify-center -translate-x-1/2 z-20"
        >
          {/* Overhead Projector Lens Spark at Top */}
          <div className="absolute top-0 w-5 h-5 rounded-full bg-white shadow-[0_0_30px_#ef4444,0_0_55px_#dc2626,0_0_80px_#ff0033] -translate-y-1" />

          {/* Volumetric Red Beam Aura (Extra wide concert spread) */}
          <div className="absolute w-16 sm:w-24 h-full bg-gradient-to-b from-red-600 via-rose-600/50 to-red-500/15 blur-2xl pointer-events-none" />

          {/* Electric Neon Red Glow */}
          <div className="absolute w-6 sm:w-8 h-full bg-gradient-to-b from-rose-500 via-red-500/80 to-red-600/40 blur-[5px] shadow-[0_0_30px_#ff0033,0_0_60px_#cc0000,0_0_100px_#990000] pointer-events-none" />

          {/* Razor-Sharp White-Hot Core Shooting Downward */}
          <div className="relative w-[4px] sm:w-[5px] h-full bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#ef4444,0_0_55px_#b91c1c] pointer-events-none" />

          {/* Floor Contact Ground Reflection Flare */}
          <div className="absolute bottom-10 w-12 h-6 rounded-full bg-red-500/40 blur-md pointer-events-none" />
        </motion.div>
      ))}

      {/* ── CELEBRATION WHOLE-STAGE STROBE FLASH EFFECT ── */}
      {isCelebratingCorrect && (
        <motion.div
          animate={{
            opacity: [
              0,
              0.6, 0.05, 0.85, 0.1, 0.7, 0.05, 0.2,
              0.8, 0.05, 0.9, 0.1, 0.75, 0.05, 0.4, 0
            ]
          }}
          transition={{ duration: 4.2, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-b from-cyan-300/35 via-blue-500/20 to-transparent mix-blend-screen pointer-events-none z-30"
        />
      )}

      {/* ── WRONG ANSWER WHOLE-ENVIRONMENT RED AMBIENCE & CRIMSON WASH (Holds until next question) ── */}
      {isWrongAnswer && (
        <>
          {/* Dense Crimson Atmospheric Fog */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.55, 0.75, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.55)_0%,rgba(153,27,27,0.4)_50%,rgba(69,10,10,0.65)_100%)] mix-blend-screen pointer-events-none z-10"
          />

          {/* Stage Floor Crimson Reflection Wash */}
          <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-red-600/40 via-red-900/30 to-transparent blur-2xl pointer-events-none z-10" />
        </>
      )}

    </div>
  );
}
