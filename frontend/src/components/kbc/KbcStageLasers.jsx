import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KbcStageLasers({ 
  triggerUpwardSweep = false, 
  isCelebratingCorrect = false 
}) {
  const [showSweep, setShowSweep] = useState(false);

  // Trigger the upward laser sweep whenever triggerUpwardSweep prop toggles
  useEffect(() => {
    if (triggerUpwardSweep) {
      setShowSweep(true);
      const timer = setTimeout(() => {
        setShowSweep(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [triggerUpwardSweep]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">

      {/* ── 1. AMBIENT MOVING LASER LIGHTING (FITS RIGHT IN SCREEN) ── */}
      {/* Top Left Spotlight Beam */}
      <motion.div
        animate={{
          rotate: isCelebratingCorrect ? [-45, 35, -30, 40, -45] : [-20, 20, -20],
          opacity: isCelebratingCorrect ? [1, 0.2, 0.9, 0.3, 1] : [0.25, 0.5, 0.25]
        }}
        transition={{
          duration: isCelebratingCorrect ? 0.6 : 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-32 left-1/4 w-32 h-[120vh] origin-top bg-gradient-to-b from-cyan-400/40 via-sky-500/15 to-transparent blur-xl pointer-events-none"
      />

      {/* Top Right Spotlight Beam */}
      <motion.div
        animate={{
          rotate: isCelebratingCorrect ? [45, -35, 30, -40, 45] : [20, -20, 20],
          opacity: isCelebratingCorrect ? [0.3, 1, 0.2, 0.9, 0.3] : [0.25, 0.5, 0.25]
        }}
        transition={{
          duration: isCelebratingCorrect ? 0.6 : 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-32 right-1/4 w-32 h-[120vh] origin-top bg-gradient-to-b from-amber-400/40 via-yellow-500/15 to-transparent blur-xl pointer-events-none"
      />

      {/* ── 2. NEW QUESTION ARRIVAL: INTENSE UPWARD LASER SWEEP ── */}
      <AnimatePresence>
        {showSweep && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* The Main High-Intensity Horizontal Laser Bar sweeping UPWARDS */}
            <motion.div
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ y: '-20vh', opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 h-4 bg-gradient-to-r from-transparent via-cyan-300 via-amber-200 to-transparent shadow-[0_0_35px_#38bdf8,0_0_70px_#f59e0b,0_0_100px_#ffffff]"
            >
              {/* Core intense white energy laser line */}
              <div className="w-full h-1 bg-white shadow-[0_0_15px_#ffffff]" />
            </motion.div>

            {/* Upward Energy Blast Aura */}
            <motion.div
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ y: '-30vh', opacity: [0, 0.6, 0.3, 0] }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute left-0 right-0 h-48 bg-gradient-to-t from-cyan-500/30 via-amber-400/20 to-transparent blur-2xl"
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── 3. CORRECT ANSWER CELEBRATION: FLICKERING LIGHTS, JIZ-JAZZ & UP-DOWN LASERS ── */}
      {isCelebratingCorrect && (
        <div className="absolute inset-0 pointer-events-none">
          
          {/* A. RAPID STROBE FLICKER OVERLAY */}
          <motion.div
            animate={{ opacity: [0.4, 0.05, 0.35, 0.08, 0.5, 0.1, 0.4] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-b from-amber-400/20 via-emerald-400/15 to-transparent mix-blend-screen"
          />

          {/* B. JIZ-JAZZ (ZIG-ZAG) DIAGONAL SWEEPING LASER BEAMS */}
          {/* Zig-Zag Laser Left */}
          <motion.div
            animate={{
              x: ['-40%', '50%', '-20%', '40%', '-40%'],
              y: ['-20%', '30%', '-10%', '20%', '-20%'],
              rotate: [-55, 30, -40, 45, -55]
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-[140vw] h-1.5 bg-gradient-to-r from-transparent via-cyan-400 via-white to-transparent shadow-[0_0_20px_#06b6d4,0_0_40px_#38bdf8]"
          />

          {/* Zig-Zag Laser Right */}
          <motion.div
            animate={{
              x: ['40%', '-50%', '20%', '-40%', '40%'],
              y: ['20%', '-30%', '10%', '-20%', '20%'],
              rotate: [55, -30, 40, -45, 55]
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 right-1/4 w-[140vw] h-1.5 bg-gradient-to-r from-transparent via-yellow-400 via-white to-transparent shadow-[0_0_20px_#eab308,0_0_40px_#f59e0b]"
          />

          {/* C. UP-DOWN BOUNCING STAGE LIGHT PILLARS */}
          <div className="absolute inset-0 flex justify-between px-6 sm:px-16">
            {/* Left Bouncing Pillar */}
            <motion.div
              animate={{ y: [0, -60, 30, -40, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
              className="w-8 h-full bg-gradient-to-t from-emerald-500/40 via-cyan-400/20 to-transparent blur-lg"
            />

            {/* Center-Left Bouncing Pillar */}
            <motion.div
              animate={{ y: [0, 40, -50, 20, 0] }}
              transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-full bg-gradient-to-t from-amber-400/40 via-yellow-300/20 to-transparent blur-lg"
            />

            {/* Center-Right Bouncing Pillar */}
            <motion.div
              animate={{ y: [0, -50, 25, -35, 0] }}
              transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-full bg-gradient-to-t from-cyan-400/40 via-sky-300/20 to-transparent blur-lg"
            />

            {/* Right Bouncing Pillar */}
            <motion.div
              animate={{ y: [0, 50, -45, 30, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
              className="w-8 h-full bg-gradient-to-t from-emerald-500/40 via-teal-300/20 to-transparent blur-lg"
            />
          </div>

          {/* Screen Perimeter Laser Glow */}
          <div className="absolute inset-0 border-4 border-amber-400/70 shadow-[inset_0_0_50px_rgba(245,158,11,0.5)] animate-pulse" />

        </div>
      )}

    </div>
  );
}
