import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Professional Stage Laser Lighting (Aurora Cobalt Edition)
 * Inspired by high-end stage concert laser projectors (X-Laser Aurora Cobalt).
 * 
 * Behaviors:
 * 1. Thick, intense cobalt blue and bright cyan laser beams with glowing white cores.
 * 2. Emitted from 4 projector source stations on the bottom stage floor.
 * 3. Never disappears during the KBC exam.
 * 4. When a new question arrives (triggerUpwardSweep): Lasers sweep up and stay held/stopped there.
 * 5. When contestant answers correctly (isCelebratingCorrect):
 *    - Move faster up to middle
 *    - Flicker bright strobe
 *    - Move down
 *    - Flicker bright strobe
 *    - Move back up!
 */
export default function KbcStageLasers({ 
  triggerUpwardSweep = false, 
  isCelebratingCorrect = false 
}) {
  // When triggerUpwardSweep fires, hold lasers in the high/elevated "question arrival" position
  const [isQuestionHeldUp, setIsQuestionHeldUp] = useState(false);

  useEffect(() => {
    if (triggerUpwardSweep) {
      setIsQuestionHeldUp(true);
      // Hold high for 4.5 seconds, then return to smooth ambient sway
      const timer = setTimeout(() => {
        setIsQuestionHeldUp(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [triggerUpwardSweep]);

  // Define 10 high-intensity Aurora Cobalt beams emanating from 4 floor projector stations
  const laserBeams = useMemo(() => [
    // Station 1: Left (~18%)
    { id: 1, baseLeft: '18%', baseAngle: -42, sweepUpAngle: -18, ambientRange: [-48, -34], delay: 0 },
    { id: 2, baseLeft: '18%', baseAngle: 24,  sweepUpAngle: 12,  ambientRange: [18, 30],   delay: 0.2 },

    // Station 2: Mid-Left (~38%)
    { id: 3, baseLeft: '38%', baseAngle: -30, sweepUpAngle: -10, ambientRange: [-36, -22], delay: 0.4 },
    { id: 4, baseLeft: '38%', baseAngle: 28,  sweepUpAngle: 14,  ambientRange: [20, 34],   delay: 0.1 },

    // Station 3: Mid-Right (~62%)
    { id: 5, baseLeft: '62%', baseAngle: -28, sweepUpAngle: -14, ambientRange: [-34, -20], delay: 0.3 },
    { id: 6, baseLeft: '62%', baseAngle: 30,  sweepUpAngle: 10,  ambientRange: [22, 36],   delay: 0.5 },

    // Station 4: Right (~82%)
    { id: 7, baseLeft: '82%', baseAngle: -24, sweepUpAngle: -12, ambientRange: [-30, -18], delay: 0.2 },
    { id: 8, baseLeft: '82%', baseAngle: 42,  sweepUpAngle: 18,  ambientRange: [34, 48],   delay: 0.4 },

    // Station Center Highlights (~50%)
    { id: 9, baseLeft: '50%', baseAngle: -12, sweepUpAngle: -4,  ambientRange: [-18, -6],  delay: 0.1 },
    { id: 10, baseLeft: '50%', baseAngle: 12, sweepUpAngle: 4,   ambientRange: [6, 18],    delay: 0.3 }
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">

      {/* ── AMBIENT STAGE FLOOR HAZE & PROJECTOR LENS FLARES ── */}
      <div className="absolute -bottom-10 left-0 right-0 h-40 bg-gradient-to-t from-blue-950/80 via-blue-900/30 to-transparent blur-2xl pointer-events-none" />

      {/* 4 Floor Projector Bases */}
      {[18, 38, 62, 82].map((pos) => (
        <div
          key={pos}
          style={{ left: `${pos}%` }}
          className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
        >
          {/* Intense Projector Spot Lens */}
          <div className="w-5 h-2.5 rounded-full bg-cyan-200 shadow-[0_0_20px_#38bdf8,0_0_35px_#0284c7,0_0_50px_#ffffff]" />
          <div className="w-12 h-6 -mt-1 rounded-full bg-blue-600/40 blur-md" />
        </div>
      ))}

      {/* ── 10 AURORA COBALT LASER BEAMS ── */}
      {laserBeams.map((beam) => {
        // Dynamic angle calculation based on current state:
        // 1. isCelebratingCorrect: Sequence: [up to middle] -> [flicker] -> [down] -> [flicker] -> [up]
        // 2. isQuestionHeldUp: Elevated angle pointing straight up to highlight question
        // 3. Normal Ambient: Continuous alive swaying
        let targetAngle;
        let targetOpacity;
        let targetScaleY;
        let transitionConfig;

        if (isCelebratingCorrect) {
          // CELEBRATION SEQUENCE:
          // 0.0 - 0.7s: Move faster up to middle (converge to near 0deg)
          // 0.7 - 1.4s: Flicker bright strobe
          // 1.4 - 2.4s: Move down (sweep toward floor angles ±55deg)
          // 2.4 - 3.0s: Flicker bright strobe
          // 3.0 - 4.0s: Move back up!
          const midAngle = beam.sweepUpAngle * 0.4;
          const downAngle = beam.baseAngle * 1.35;
          const finalUpAngle = beam.sweepUpAngle * 0.8;

          targetAngle = [
            beam.baseAngle,      // 0s: start
            midAngle,            // ~0.8s: faster up to middle
            midAngle,            // ~1.3s: hold at middle while flickering
            downAngle,           // ~2.3s: sweep down
            downAngle,           // ~2.9s: hold at bottom while flickering
            finalUpAngle         // ~4.0s: sweep dramatically back up!
          ];

          // Bright strobe flicker at middle and bottom
          targetOpacity = [
            0.9,
            1,
            0.15, 1, 0.2, 1, 0.3, 1, // Rapid flicker at middle
            0.9,
            0.1, 1, 0.2, 1, 0.15, 1, // Rapid flicker at bottom
            1
          ];

          targetScaleY = [1, 1.15, 1.25, 0.85, 0.8, 1.2];

          transitionConfig = {
            duration: 4.0,
            times: [0, 0.18, 0.32, 0.58, 0.72, 1],
            ease: 'easeInOut'
          };
        } else if (isQuestionHeldUp) {
          // QUESTION ARRIVAL: Sweeps up and stops/holds right there
          targetAngle = beam.sweepUpAngle;
          targetOpacity = 0.95;
          targetScaleY = 1.15;
          transitionConfig = {
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1] // Snappy rise then hold
          };
        } else {
          // NORMAL AMBIENT: Continuous swaying back and forth (NEVER disappears)
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
            {/* 1. Volumetric Cobalt Beam Aura (Wide soft diffusion) */}
            <div className="absolute w-12 sm:w-16 h-full bg-gradient-to-t from-blue-700/80 via-blue-600/35 to-cyan-400/10 blur-xl pointer-events-none" />

            {/* 2. Intense Electric Cyan Glow Layer */}
            <div className="absolute w-4 sm:w-5 h-full bg-gradient-to-t from-cyan-400/90 via-sky-400/60 to-blue-500/20 blur-[4px] pointer-events-none shadow-[0_0_25px_#00e5ff,0_0_50px_#0055ff]" />

            {/* 3. Razor-Sharp Solid White-Hot Laser Core (3px - 4px) */}
            <div className="relative w-[3px] sm:w-[4px] h-full bg-white shadow-[0_0_10px_#ffffff,0_0_20px_#38bdf8,0_0_35px_#0284c7] pointer-events-none" />

            {/* 4. Floor Emitter Spark (At beam base) */}
            <div className="absolute bottom-0 w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#38bdf8] -translate-y-1" />
          </motion.div>
        );
      })}

      {/* ── CELEBRATION WHOLE-STAGE STROBE FLASH EFFECT ── */}
      {isCelebratingCorrect && (
        <motion.div
          animate={{
            opacity: [
              0,
              0.4, 0.05, 0.5, 0.1, 0.45, 0.05, // First burst at middle (~1s)
              0.1,
              0.5, 0.08, 0.55, 0.1, 0.4, 0.05, // Second burst at bottom (~2.6s)
              0.3, 0
            ]
          }}
          transition={{ duration: 4.0, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-b from-cyan-300/25 via-blue-500/15 to-transparent mix-blend-screen pointer-events-none"
        />
      )}

    </div>
  );
}
