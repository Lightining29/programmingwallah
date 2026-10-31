import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle, 
  Pin, 
  Trophy, 
  Maximize2,
  X
} from 'lucide-react';
import macSound from '../services/sound.js';

export default function GamePlayerWindow({ 
  game, 
  onClose, 
  onToggleDock, 
  isDocked = false,
  currentUser 
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [playSeconds, setPlaySeconds] = useState(0);
  const iframeRef = useRef(null);

  // Load high score from local and backend
  useEffect(() => {
    if (!game) return;
    const local = localStorage.getItem(`high_score_${game.id}`);
    if (local) setHighScore(parseInt(local, 10));

    fetch('/api/macos/desktop/games')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.games)) {
          const found = data.games.find(g => g.gameId === game.id);
          if (found && found.highScore > (parseInt(local, 10) || 0)) {
            setHighScore(found.highScore);
          }
        }
      })
      .catch(() => {});
  }, [game]);

  // Track playtime
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setPlaySeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Listen to postMessage score updates from game canvas
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'GAME_SCORE_UPDATE' && e.data.gameId === game?.id) {
        const newScore = e.data.score;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem(`high_score_${game.id}`, newScore);
          macSound.playTink();

          // Save to backend MySQL database
          fetch(`/api/macos/desktop/games/${game.id}/record`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: newScore, playtimeSeconds: playSeconds })
          }).catch(() => {});
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [game, highScore, playSeconds]);

  if (!game) return null;

  const handleRestart = () => {
    macSound.playClick();
    if (iframeRef.current) {
      const src = iframeRef.current.srcdoc;
      iframeRef.current.srcdoc = '';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.srcdoc = src;
      }, 50);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white select-none overflow-hidden relative">
      {/* Game Window Navigation & Control Toolbar */}
      <div className="h-10 px-3 bg-slate-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{game.iconEmoji || '🎮'}</span>
          <span className="font-bold text-xs text-white truncate">{game.title}</span>
          <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
            {game.categoryName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* High Score Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Best: {highScore}</span>
          </div>

          {/* Dock / Pin Toggle */}
          <button
            onClick={() => {
              macSound.playPop();
              if (onToggleDock) onToggleDock(game.id);
            }}
            className={`p-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center gap-1 ${
              isDocked 
                ? 'bg-blue-600 border-blue-500 text-white' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isDocked ? 'Pinned in Dock' : 'Add to Dock'}
          >
            <Pin className="w-3 h-3" />
            <span className="hidden sm:inline text-[10px] font-medium">{isDocked ? 'In Dock' : 'Pin to Dock'}</span>
          </button>

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition cursor-pointer"
            title="Restart Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Instructions */}
          <button
            onClick={() => setShowHelp(prev => !prev)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition cursor-pointer"
            title="Game Controls & Rules"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Game Screen (Embedded Canvas/HTML5 Sandbox) */}
      <div className="flex-1 w-full h-full relative bg-black overflow-hidden">
        <iframe
          ref={iframeRef}
          title={game.title}
          srcDoc={game.entryCode}
          sandbox="allow-scripts allow-forms allow-modals allow-downloads"
          className="w-full h-full border-none block"
        />

        {/* Instructions Overlay Modal */}
        {showHelp && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md p-6 flex flex-col justify-between animate-in fade-in duration-150">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{game.iconEmoji}</span>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{game.title}</h3>
                    <p className="text-xs text-slate-400">{game.categoryName} • {game.developer}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-slate-200">
                <p>{game.description}</p>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="font-bold text-sky-400 block mb-1">🎮 How to Play / Controls:</span>
                  <p className="text-slate-300 font-mono text-[11px]">{game.controls}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/15 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition cursor-pointer"
              >
                Resume Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
