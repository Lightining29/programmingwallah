import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowUp, ArrowDown, Award, Sparkles, X, Medal, Crown, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { kbcAudio } from '../../utils/kbcAudio.js';

export default function MovingLeaderboardModal({
  players = [],
  onClose,
  currentUserTeam = null,
  currentLevel = 1,
  isAdmin = false
}) {
  useEffect(() => {
    try {
      kbcAudio.playHighPoints();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#38bdf8', '#34d399', '#f43f5e']
      });
    } catch (e) {}
  }, []);

  const topThree = players.slice(0, 3);
  const restPlayers = players.slice(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl my-auto rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(30,58,138,0.6)] overflow-hidden border"
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 30, 0.98) 100%)',
          borderColor: 'rgba(251, 191, 36, 0.65)',
          color: '#ffffff'
        }}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer z-20"
            title="Minimize Leaderboard"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-indigo-900/50 mb-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest mb-2 shadow-inner">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>KBC Live Tournament Leaderboard</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 tracking-wide drop-shadow-md">
            REAL-TIME MOVING PLAYER RANKS
          </h2>
          <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: '#94a3b8' }}>
            Broadcasting live across all screens • Watch players glide up on correct answers!
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 relative z-10">
            {topThree.map((player, idx) => {
              const rank = idx + 1;
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const isThird = rank === 3;

              let podiumBg = 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)';
              let podiumBorder = 'rgba(71, 85, 105, 0.6)';
              let badgeColor = '🥈 Silver';
              let medalIcon = '🥈';

              if (isFirst) {
                podiumBg = 'linear-gradient(135deg, rgba(120, 53, 15, 0.85) 0%, rgba(15, 23, 42, 0.98) 100%)';
                podiumBorder = 'rgba(251, 191, 36, 0.7)';
                badgeColor = '👑 1st Rank';
                medalIcon = '🥇';
              } else if (isSecond) {
                podiumBg = 'linear-gradient(135deg, rgba(51, 65, 85, 0.85) 0%, rgba(15, 23, 42, 0.98) 100%)';
                podiumBorder = 'rgba(203, 213, 225, 0.6)';
                badgeColor = '2nd Rank';
                medalIcon = '🥈';
              } else if (isThird) {
                podiumBg = 'linear-gradient(135deg, rgba(67, 20, 7, 0.85) 0%, rgba(15, 23, 42, 0.98) 100%)';
                podiumBorder = 'rgba(249, 115, 22, 0.6)';
                badgeColor = '3rd Rank';
                medalIcon = '🥉';
              }

              return (
                <div
                  key={player.id}
                  className={`rounded-2xl p-4 text-center border relative transition-all duration-500 shadow-xl ${
                    isFirst ? 'sm:-translate-y-2 ring-2 ring-amber-400/50 shadow-amber-500/20' : ''
                  }`}
                  style={{
                    background: podiumBg,
                    borderColor: podiumBorder,
                    color: '#ffffff'
                  }}
                >
                  <div className="text-2xl mb-1">{medalIcon}</div>
                  <div 
                    className="text-[11px] font-black uppercase tracking-wider mb-1"
                    style={{ color: isFirst ? '#fbbf24' : isSecond ? '#e2e8f0' : '#fdba74' }}
                  >
                    {badgeColor}
                  </div>
                  <div className="font-black text-sm sm:text-base truncate" style={{ color: '#ffffff' }}>
                    {player.name}
                  </div>
                  <div className="mt-2 text-lg sm:text-xl font-black font-mono" style={{ color: '#fbbf24' }}>
                    {player.points.toLocaleString()} <span className="text-xs font-sans text-amber-300/80">pts</span>
                  </div>
                  <div className="text-[11px] mt-1 flex items-center justify-center gap-2" style={{ color: '#94a3b8' }}>
                    <span style={{ color: '#34d399' }}>{player.correctCount} Correct</span>
                    <span>•</span>
                    <span style={{ color: '#f87171' }}>{player.wrongCount} Wrong</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Animated Moving Leaderboard List with Framer Motion Spring Layout */}
        <div className="relative z-10">
          <div className="flex items-center justify-between pb-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <span>Rank & Player</span>
            <div className="flex items-center gap-6">
              <span>Movement</span>
              <span>Total Points</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            <AnimatePresence>
              {players.map((player, index) => {
                const rank = index + 1;
                const isUser = player.isUser;
                const gainedPoints = player.lastPointsGained > 0;
                const rankDelta = player.rankDelta || 0; // positive = moved up, negative = moved down

                return (
                  <motion.div
                    key={player.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      mass: 0.8
                    }}
                    style={{
                      background: isUser
                        ? 'linear-gradient(135deg, rgba(8, 47, 73, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : rank === 1
                        ? 'linear-gradient(135deg, rgba(120, 53, 15, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : gainedPoints
                        ? 'linear-gradient(135deg, rgba(6, 78, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
                      border: isUser
                        ? '2px solid #22d3ee'
                        : rank === 1
                        ? '1.5px solid rgba(251, 191, 36, 0.7)'
                        : gainedPoints
                        ? '1.5px solid rgba(52, 211, 153, 0.6)'
                        : '1px solid rgba(71, 85, 105, 0.4)',
                      boxShadow: isUser
                        ? '0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 10px rgba(6, 182, 212, 0.2)'
                        : '0 4px 12px rgba(0, 0, 0, 0.3)',
                      color: '#ffffff'
                    }}
                    className="flex items-center justify-between p-3 rounded-xl transition-all"
                  >
                    {/* Left: Rank & Player info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className={`w-7 h-7 rounded-lg font-black font-mono text-xs flex items-center justify-center shrink-0 ${
                          rank === 1 ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/40' :
                          rank === 2 ? 'bg-slate-200 text-slate-950' :
                          rank === 3 ? 'bg-amber-700 text-amber-100' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {rank}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span 
                            className="font-bold text-sm truncate max-w-[180px] sm:max-w-[280px]"
                            style={{ color: isUser ? '#38bdf8' : '#ffffff' }}
                          >
                            {player.name}
                          </span>
                          {isUser && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] flex items-center gap-2 mt-0.5" style={{ color: '#94a3b8' }}>
                          <span style={{ color: '#cbd5e1' }}>{player.correctCount} Correct</span>
                          <span>•</span>
                          <span style={{ color: '#34d399' }} className="flex items-center gap-1 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Dynamic Rank Movement & Points */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      {/* Movement indicator */}
                      <div className="w-20 text-center">
                        {rankDelta > 0 ? (
                          <motion.span
                            initial={{ scale: 0.6, y: 5 }}
                            animate={{ scale: 1, y: 0 }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black"
                          >
                            <ArrowUp className="w-3.5 h-3.5 stroke-[3]" /> +{rankDelta} UP
                          </motion.span>
                        ) : rankDelta < 0 ? (
                          <motion.span
                            initial={{ scale: 0.6, y: -5 }}
                            animate={{ scale: 1, y: 0 }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-black"
                          >
                            <ArrowDown className="w-3.5 h-3.5 stroke-[3]" /> {rankDelta} DN
                          </motion.span>
                        ) : (
                          <span className="text-slate-500 text-xs font-mono font-bold">-</span>
                        )}
                      </div>

                      {/* Points */}
                      <div className="text-right min-w-[90px]">
                        <div className="text-sm sm:text-base font-black font-mono text-amber-400">
                          {player.points.toLocaleString()} <span className="text-[10px] font-sans text-amber-300/80">pts</span>
                        </div>
                        {gainedPoints && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-[11px] font-black text-emerald-400 flex items-center justify-end gap-0.5"
                          >
                            <ArrowUp className="w-3 h-3 stroke-[3]" /> +{player.lastPointsGained}
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Leaderboard updates in real-time as answers are revealed.</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition border border-slate-700"
            >
              Continue to Hotseat Stage
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
