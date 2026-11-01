import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * High-Tech Interactive KBC Broadcast Studio Lighting & Stage Rig
 * 100% Procedural SVG & Framer Motion - Zero Static Pictures
 * 
 * Features:
 * - Overhead Metallic Structural Truss Arch with Industrial Spotlights & LED Neon Tracks
 * - Procedural Tiered Studio Amphitheater Ambient Backlights
 * - Interactive Criss-Crossing Volumetric Moving Searchlights (Tracks mouse hover & lock states)
 * - Colorful lighting: Golden Amber, Electric Cyan, Royal Violet, and Emerald Accents
 * - Stage Floor Projector Laser Beams & Concentric 3D Perspective Glowing Rings
 * - Reactive Light Shows for: Option Hover, Lock Focus, <10s Time Urgency, Sahi Celebration, & Galat Siren
 */
export default function KbcStageLasers({ 
  triggerUpwardSweep = false, 
  isCelebratingCorrect = false,
  isWrongAnswer = false,
  isLocked = false,
  hoveredOption = null,
  selectedOption = null,
  isTimeUrgent = false
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

  // ── 1. Overhead Criss-Cross Moving Beams (Curated Elegant 4-Searchlight Rig) ──
  const overheadCrissCrossBeams = useMemo(() => [
    // Left Golden/Amber Searchlight (Sweeping down towards center & right)
    { id: 'top-gold-1', originLeft: '28%', originTop: '4.5%', baseAngle: 24, sweepRange: [16, 32], duration: 9.2, color: 'gold', delay: 0 },
    // Left Electric Cyan Searchlight (Sweeping down towards center)
    { id: 'top-cyan-1', originLeft: '40%', originTop: '6.0%', baseAngle: 12, sweepRange: [4, 20], duration: 11.5, color: 'cyan', delay: 0.2 },

    // Right Electric Cyan Searchlight (Sweeping down towards center)
    { id: 'top-cyan-2', originLeft: '60%', originTop: '6.0%', baseAngle: -12, sweepRange: [-20, -4], duration: 11.0, color: 'cyan', delay: 0.1 },
    // Right Golden/Amber Searchlight (Sweeping down towards center & left)
    { id: 'top-gold-2', originLeft: '72%', originTop: '4.5%', baseAngle: -24, sweepRange: [-32, -16], duration: 9.8, color: 'gold', delay: 0.3 }
  ], []);

  // ── 2. Four Floor Laser Projector Beams ──
  // Balanced stage floor beams: outer framing + iconic center criss-cross behind question
  const floorBeams = useMemo(() => [
    { id: 'f-1', baseLeft: '22%', baseAngle: -28, sweepUpAngle: -12, downAngle: -48, ambientRange: [-34, -22], color: 'cyan', delay: 0 },
    { id: 'f-2', baseLeft: '48%', baseAngle: -15, sweepUpAngle: -6,  downAngle: -24, ambientRange: [-20, -10], color: 'gold', delay: 0.2 },
    { id: 'f-3', baseLeft: '52%', baseAngle: 15,  sweepUpAngle: 6,   downAngle: 24,  ambientRange: [10, 20],   color: 'cyan', delay: 0.1 },
    { id: 'f-4', baseLeft: '78%', baseAngle: 28,  sweepUpAngle: 12,  downAngle: 48,  ambientRange: [22, 34],   color: 'gold', delay: 0.3 }
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">

      {/* ── ATMOSPHERIC STUDIO BACKDROP: Pure Translucent Studio Arena Glow (Zero Opaque Black Mask) ── */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: isWrongAnswer
            ? 'radial-gradient(ellipse at 50% 35%, rgba(153, 27, 27, 0.45) 0%, rgba(69, 10, 10, 0.75) 55%, rgba(2, 6, 23, 0.95) 100%)'
            : isCelebratingCorrect
              ? 'radial-gradient(ellipse at 50% 35%, rgba(5, 150, 105, 0.45) 0%, rgba(4, 120, 87, 0.7) 55%, rgba(2, 6, 23, 0.95) 100%)'
              : 'radial-gradient(ellipse at 50% 35%, rgba(14, 116, 144, 0.35) 0%, rgba(30, 27, 75, 0.65) 55%, rgba(2, 6, 23, 0.95) 100%)'
        }}
      />

      {/* ── OVERHEAD METALLIC STRUCTURAL LIGHTING TRUSS ARCH (Industrial Stage Rig) ── */}
      <svg className="absolute top-0 left-0 right-0 w-full h-36 sm:h-44 pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 1440 180">
        <defs>
          <linearGradient id="trussSteel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="25%" stopColor="#475569" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="75%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="neonCyanTrack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="80%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="neonGoldTrack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="neonVioletTrack" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#e9d5ff" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Top Outer Curved Structural Pipe */}
        <path d="M 120,-10 Q 720,80 1320,-10" stroke="url(#trussSteel)" strokeWidth="6" fill="none" />

        {/* Bottom Inner Curved Structural Pipe */}
        <path d="M 180,18 Q 720,110 1260,18" stroke="url(#trussSteel)" strokeWidth="5" fill="none" />

        {/* Glowing Neon LED Guide Tracks along the Truss (Cyan, Gold, & Violet) */}
        <path d="M 220,10 Q 720,95 1220,10" stroke="url(#neonCyanTrack)" strokeWidth="2.5" fill="none" className="opacity-85" />
        <path d="M 260,25 Q 720,116 1180,25" stroke="url(#neonGoldTrack)" strokeWidth="1.8" fill="none" className="opacity-75" />
        <path d="M 300,38 Q 720,126 1140,38" stroke="url(#neonVioletTrack)" strokeWidth="1.2" fill="none" className="opacity-65" />

        {/* Industrial Truss Diamond Cross-Bracing Lattices */}
        {[
          [200, 5, 230, 22], [230, 22, 260, 11], [260, 11, 290, 28], [290, 28, 320, 17],
          [320, 17, 350, 36], [350, 36, 380, 24], [380, 24, 410, 44], [410, 44, 440, 32],
          [440, 32, 470, 52], [470, 52, 500, 40], [500, 40, 530, 60], [530, 60, 560, 48],
          [880, 48, 910, 60], [910, 60, 940, 40], [940, 40, 970, 52], [970, 52, 1000, 32],
          [1000, 32, 1030, 44], [1030, 44, 1060, 24], [1060, 24, 1090, 36], [1090, 36, 1120, 17],
          [1120, 17, 1150, 28], [1150, 28, 1180, 11], [1180, 11, 1210, 22], [1210, 22, 1240, 5]
        ].map(([x1, y1, x2, y2], idx) => (
          <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="2" strokeOpacity="0.65" />
        ))}

        {/* Industrial Stage Spotlight Fixture Cans Mounted to Truss */}
        {[
          { cx: 288, cy: 30, color: '#f59e0b' },
          { cx: 403, cy: 46, color: '#c084fc' },
          { cx: 518, cy: 62, color: '#fde047' },
          { cx: 633, cy: 75, color: '#38bdf8' },
          { cx: 807, cy: 75, color: '#00f2fe' },
          { cx: 922, cy: 62, color: '#a855f7' },
          { cx: 1037, cy: 46, color: '#38bdf8' },
          { cx: 1152, cy: 30, color: '#00f2fe' }
        ].map((fixture, idx) => (
          <g key={idx}>
            {/* Fixture Mount Bracket */}
            <rect x={fixture.cx - 6} y={fixture.cy - 12} width="12" height="10" fill="#334155" rx="1.5" />
            {/* Fixture Cylindrical Can */}
            <rect x={fixture.cx - 8} y={fixture.cy - 2} width="16" height="18" fill="#0f172a" stroke="#64748b" strokeWidth="1" rx="2" />
            {/* High-Power LED Lens Flare Emitter */}
            <circle cx={fixture.cx} cy={fixture.cy + 15} r="6" fill="#ffffff" />
            <circle cx={fixture.cx} cy={fixture.cy + 15} r="10" fill={fixture.color} fillOpacity="0.5" />
          </g>
        ))}
      </svg>

      {/* ── 3D PERSPECTIVE GLOWING STAGE FLOOR CONCENTRIC RINGS ── */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[850px] sm:w-[1100px] h-[380px] pointer-events-none -z-10 opacity-85 select-none"
        style={{
          transform: 'perspective(800px) rotateX(68deg)',
          background: isWrongAnswer
            ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.2) 0%, rgba(185,28,28,0.06) 45%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(6,182,212,0.28) 0%, rgba(168,85,247,0.15) 35%, rgba(99,102,241,0.08) 60%, transparent 75%)'
        }}
      >
        <div className={`absolute inset-2 rounded-full border-2 transition-colors duration-700 ${
          isWrongAnswer ? 'border-red-500/60 shadow-[0_0_35px_#ef4444]' : 'border-cyan-400/60 shadow-[0_0_35px_#00f2fe]'
        }`} />
        <div className="absolute inset-10 rounded-full border border-purple-400/40 shadow-[0_0_25px_#c084fc]" />
        <div className="absolute inset-20 rounded-full border border-amber-400/45 shadow-[0_0_25px_#f59e0b]" />
        <div className="absolute inset-30 rounded-full border border-indigo-400/35 shadow-[0_0_15px_#6366f1]" />
        <div className="absolute inset-40 rounded-full border-2 border-cyan-300/35 shadow-[0_0_20px_#38bdf8]" />
        
        {/* Pulsing Hotseat Center Emitter Podium */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 animate-pulse transition-colors duration-700 ${
          isWrongAnswer 
            ? 'bg-gradient-to-tr from-red-500/20 to-rose-500/20 border-red-500/70 shadow-[0_0_40px_#ef4444]' 
            : 'bg-gradient-to-tr from-cyan-500/25 via-purple-500/20 to-amber-500/20 border-cyan-400/80 shadow-[0_0_45px_#00f2fe]'
        }`} />
      </div>

      {/* ── 1. OVERHEAD REAL MOVING CRISS-CROSS VOLUMETRIC CONES (From Arena Truss) ── */}
      {overheadCrissCrossBeams.map((beam) => {
        const isGold = beam.color === 'gold';
        const isViolet = beam.color === 'violet';
        
        let targetAngle = [beam.sweepRange[0], beam.sweepRange[1], beam.sweepRange[0]];
        let transition = {
          duration: isTimeUrgent ? beam.duration * 0.45 : beam.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: beam.delay
        };

        if (isWrongAnswer) {
          targetAngle = [beam.baseAngle * 0.7, beam.baseAngle * 1.5, beam.baseAngle * 0.7];
          transition = { duration: 2.2, repeat: Infinity, ease: 'easeInOut' };
        } else if (isCelebratingCorrect) {
          targetAngle = [beam.baseAngle, beam.sweepRange[1] * 1.6, beam.sweepRange[0] * 1.6, beam.baseAngle];
          transition = { duration: 3.5, ease: 'easeInOut' };
        } else if (isLocked) {
          // Dramatic snap: all beams converge directly towards the center hotseat
          targetAngle = isGold ? 10 : isViolet ? 0 : -10;
          transition = { duration: 1.0, ease: 'easeOut' };
        } else if (hoveredOption !== null) {
          // Interactive: Beams tilt towards hovered option
          const isLeftHovered = hoveredOption === 0 || hoveredOption === 2;
          targetAngle = isLeftHovered 
            ? (isGold ? 6 : -22) 
            : (isGold ? 22 : -6);
          transition = { duration: 0.6, ease: 'easeOut' };
        }

        // Vibrant multi-color palettes - rich opacity throughout the entire vertical drop
        const beamCore = isWrongAnswer
          ? 'linear-gradient(180deg, rgba(239,68,68,0.95) 0%, rgba(239,68,68,0.8) 35%, rgba(220,38,38,0.6) 70%, rgba(220,38,38,0.25) 100%)'
          : isCelebratingCorrect
            ? 'linear-gradient(180deg, rgba(16,185,129,0.95) 0%, rgba(52,211,153,0.8) 35%, rgba(16,185,129,0.6) 70%, rgba(16,185,129,0.25) 100%)'
            : isGold
              ? 'linear-gradient(180deg, rgba(251,191,36,0.95) 0%, rgba(245,158,11,0.8) 35%, rgba(251,191,36,0.6) 70%, rgba(217,119,6,0.25) 100%)'
              : 'linear-gradient(180deg, rgba(56,189,248,0.95) 0%, rgba(14,165,233,0.8) 35%, rgba(56,189,248,0.6) 70%, rgba(3,105,161,0.25) 100%)';

        const glowColor = isWrongAnswer
          ? 'rgba(239, 68, 68, 0.85)'
          : isCelebratingCorrect
            ? 'rgba(16, 185, 129, 0.85)'
            : isGold
              ? 'rgba(245, 158, 11, 0.85)'
              : 'rgba(56, 189, 248, 0.85)';

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
              opacity: isWrongAnswer ? [0.85, 1, 0.85] : isLocked ? 0.98 : 0.92
            }}
            transition={transition}
            className="absolute pointer-events-none flex flex-col items-center -translate-x-1/2 z-10"
          >
            {/* Projector Lens Emitter */}
            <div 
              className="w-4 h-4 rounded-full bg-white shadow-lg pointer-events-none"
              style={{ boxShadow: `0 0 16px #ffffff, 0 0 32px ${glowColor}` }}
            />

            {/* Volumetric Fanning Light Cone */}
            <div 
              className="relative w-36 sm:w-52 h-[125vh] pointer-events-none -mt-1"
              style={{
                background: beamCore,
                clipPath: 'polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)',
                filter: `drop-shadow(0 0 22px ${glowColor})`
              }}
            >
              {/* Ultra-bright Center Filament */}
              <div 
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.85) 60%, transparent 100%)',
                  boxShadow: '0 0 12px #ffffff'
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
          duration: isTimeUrgent ? (3.5 + beam.delay) : (5.5 + beam.delay * 2),
          repeat: Infinity,
          ease: 'easeInOut',
          delay: beam.delay
        };

        if (isWrongAnswer) {
          targetAngle = [beam.baseAngle, beam.downAngle, beam.baseAngle];
          transition = { duration: 2.4, repeat: Infinity, ease: 'easeInOut' };
        } else if (isCelebratingCorrect) {
          targetAngle = [beam.baseAngle, beam.sweepUpAngle * 0.4, beam.sweepUpAngle * 0.8];
          transition = { duration: 3.8, ease: 'easeInOut' };
        } else if (isQuestionHeldUp) {
          targetAngle = beam.sweepUpAngle;
          transition = { duration: 1.0, ease: [0.16, 1, 0.3, 1] };
        }

        const isWrong = isWrongAnswer;
        const isGold = beam.color === 'gold';

        const beamGradient = isWrong
          ? 'linear-gradient(90deg, #ff0033 0%, rgba(255,50,80,0.9) 20%, #ffffff 50%, rgba(255,50,80,0.9) 80%, #ff0033 100%)'
          : isCelebratingCorrect
            ? 'linear-gradient(90deg, #059669 0%, #34d399 20%, #ffffff 50%, #34d399 80%, #059669 100%)'
            : isLocked
              ? 'linear-gradient(90deg, #d97706 0%, #fbbf24 20%, #ffffff 50%, #fbbf24 80%, #d97706 100%)'
              : isGold
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
              opacity: isWrong ? [0.85, 1, 0.85] : isLocked ? 0.98 : 0.92
            }}
            transition={transition}
            className="absolute h-[140vh] pointer-events-none flex items-center justify-center -translate-x-1/2 z-10"
          >
            {/* Outer Glow */}
            <div 
              className={`absolute w-10 sm:w-14 h-full blur-[5px] pointer-events-none transition-colors duration-500 ${
                isWrong ? 'bg-red-500/80 shadow-[0_0_35px_#ef4444]' :
                isCelebratingCorrect ? 'bg-emerald-500/80 shadow-[0_0_35px_#10b981]' :
                isLocked ? 'bg-amber-500/80 shadow-[0_0_35px_#f59e0b]' :
                isGold ? 'bg-amber-400/80 shadow-[0_0_35px_#f59e0b]' :
                'bg-cyan-400/80 shadow-[0_0_35px_#00e5ff]'
              }`}
            />

            {/* Solid Laser Shaft */}
            <div 
              className="relative w-4 sm:w-5 h-full pointer-events-none"
              style={{ background: beamGradient }}
            />

            {/* White Core Filament */}
            <div className="absolute w-1.5 sm:w-2 h-full bg-white shadow-[0_0_12px_#ffffff] pointer-events-none" />

            {/* Base Emitter Spark */}
            <div className="absolute bottom-0 w-5 h-5 rounded-full bg-white shadow-[0_0_24px_#ffffff] -translate-y-1" />
          </motion.div>
        );
      })}

      {/* ── CELEBRATION WHOLE-STAGE FLASH EFFECT ── */}
      {isCelebratingCorrect && (
        <motion.div
          animate={{
            opacity: [0, 0.55, 0.05, 0.8, 0.1, 0.65, 0.05, 0.25, 0.75, 0.05, 0.85, 0]
          }}
          transition={{ duration: 4.0, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-b from-cyan-300/35 via-emerald-500/25 to-transparent mix-blend-screen pointer-events-none z-30"
        />
      )}

    </div>
  );
}
