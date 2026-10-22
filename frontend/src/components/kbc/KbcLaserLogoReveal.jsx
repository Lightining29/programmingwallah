import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Play } from 'lucide-react';
import { kbcAudio } from '../../utils/kbcAudio.js';

export default function KbcLaserLogoReveal({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: Corner lasers, 1: Concentric rings & scan, 2: Full logo bloom, 3: Complete
  const [hasVideo, setHasVideo] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    kbcAudio.playLaserSweep();

    // If video fails or isn't used, fallback timer completes the animation
    const t1 = setTimeout(() => {
      setStage(1);
    }, 900);

    const t2 = setTimeout(() => {
      setStage(2);
      kbcAudio.playQuestionArrival();
    }, 2000);

    const t3 = setTimeout(() => {
      setStage(3);
      if (onComplete) onComplete();
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02030a] text-white overflow-hidden select-none">
      
      {/* ── HIGH-DEFINITION LASER SHOW VIDEO (If available) ── */}
      {hasVideo && (
        <video
          ref={videoRef}
          src="/kbc-logo-reveal.mp4"
          autoPlay
          playsInline
          onEnded={() => {
            if (onComplete) onComplete();
          }}
          onError={() => {
            setHasVideo(false);
          }}
          className="absolute inset-0 w-full h-full object-cover z-25"
        />
      )}

      {/* ── AMBIENT LASER NEBULA & FOG (Fallback / Backdrop) ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#040718] to-[#02030a]" />

      {/* ── LASERS CONVERGING FROM CORNERS (STAGE 0) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-Left to Center Laser */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-sky-300 to-transparent origin-top-left rotate-[28deg] shadow-[0_0_15px_#38bdf8] animate-pulse" />
        
        {/* Top-Right to Center Laser */}
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-amber-400 via-yellow-300 to-transparent origin-top-right -rotate-[28deg] shadow-[0_0_15px_#f59e0b] animate-pulse" />

        {/* Bottom-Left to Center Laser */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400 via-teal-300 to-transparent origin-bottom-left -rotate-[28deg] shadow-[0_0_15px_#10b981] animate-pulse" />

        {/* Bottom-Right to Center Laser */}
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-indigo-400 via-purple-300 to-transparent origin-bottom-right rotate-[28deg] shadow-[0_0_15px_#818cf8] animate-pulse" />
      </div>

      {/* ── SWEEPING HORIZONTAL SCANNING LASER LINE ── */}
      <motion.div
        initial={{ top: '-10%', opacity: 0 }}
        animate={{ top: ['0%', '110%'], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-300 via-white to-transparent shadow-[0_0_25px_#38bdf8,0_0_50px_#38bdf8] pointer-events-none z-20"
      />

      {/* ── PULSING CONCENTRIC LASER RINGS ── */}
      <div className="absolute flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(56,189,248,0.3)]"
        />
        <motion.div
          animate={{ scale: [1.1, 0.7, 1.1], opacity: [0.3, 0.8, 0.3], rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-amber-400/50 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
        />
      </div>

      {/* ── CENTRAL KBC GOLDEN EMBLEM & LOGO REVEAL ── */}
      <div className="relative z-30 text-center flex flex-col items-center">
        
        {/* Emblem Medallion */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0, rotate: -45 }}
          animate={{ scale: stage >= 1 ? 1 : 0.6, opacity: stage >= 1 ? 1 : 0.4, rotate: 0 }}
          transition={{ duration: 1.2, type: 'spring', bounce: 0.35 }}
          className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full p-2 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 shadow-[0_0_60px_rgba(234,179,8,0.6)] flex items-center justify-center mb-6"
        >
          {/* Inner Blue Disc */}
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0a1128] via-[#040817] to-[#020510] border-4 border-amber-300 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            
            {/* Holographic light scan over emblem */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(255,255,255,0.25)_360deg)] pointer-events-none"
            />

            {/* Glowing Rupee Symbol */}
            <span className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              ₹
            </span>

            {/* Circular Text Accent */}
            <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-amber-200 uppercase mt-1">
              KBC ARENA
            </span>
          </div>

          {/* Rotating Corner Laser Nodes */}
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8] animate-ping" />
          <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-ping" />
        </motion.div>

        {/* Title Reveal */}
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: stage >= 1 ? 0 : 25, opacity: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-black tracking-widest uppercase">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Laser Stage Production</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 tracking-wider uppercase drop-shadow-[0_4px_20px_rgba(245,158,11,0.5)]">
            Kaun Banega Crorepati
          </h1>

          <p className="text-sm sm:text-base font-bold text-cyan-300 tracking-widest uppercase flex items-center justify-center gap-2">
            <span>MERN & SQL Grand Exam Hotseat</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </p>
        </motion.div>

        {/* Loading / Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-300 shadow-[0_0_10px_#fbbf24]"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono tracking-wider animate-pulse">
            Connecting Studio Lasers & Stage Lights...
          </span>
        </motion.div>

      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer z-40 backdrop-blur-sm"
      >
        <span>Skip Intro</span>
        <span>⏩</span>
      </button>

    </div>
  );
}
