import React from 'react';
import { Plus, AppWindow } from 'lucide-react';
import macSound from '../services/sound.js';

export default function MissionControlModal({
  isOpen,
  onClose,
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  onAddWorkspace,
  windows,
  onFocusWindow
}) {
  if (!isOpen) return null;

  const openWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized);

  const handleSelectWin = (winId) => {
    macSound.playPop();
    onFocusWindow(winId);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xl flex flex-col justify-between p-6 select-none animate-in fade-in duration-200"
    >
      {/* Spaces Top Bar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full flex items-center justify-center gap-3 shrink-0"
      >
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl">
          {workspaces.map((ws, idx) => (
            <button
              key={ws.id}
              onClick={() => { macSound.playClick(); onSelectWorkspace(ws.id); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeWorkspace === ws.id ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="w-4 h-2.5 rounded bg-sky-500/40 border border-current" />
              <span>{ws.name || `Desktop ${idx + 1}`}</span>
            </button>
          ))}
          <button
            onClick={() => { macSound.playPop(); onAddWorkspace(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold"
            title="Add Space"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Miniature Window Previews Grid */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="flex-1 flex items-center justify-center p-8 overflow-auto"
      >
        {openWindows.length === 0 ? (
          <div className="text-white/60 text-sm font-medium">No open windows in this space</div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-8 max-w-5xl">
            {openWindows.map(win => (
              <div
                key={win.id}
                onClick={() => handleSelectWin(win.id)}
                className="w-72 h-44 rounded-2xl bg-slate-900/90 border border-white/30 shadow-2xl hover:scale-105 hover:ring-2 hover:ring-sky-400 transition cursor-pointer flex flex-col overflow-hidden group"
              >
                {/* Header */}
                <div className="h-7 px-3 bg-slate-800/90 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 truncate max-w-[140px]">{win.title}</span>
                  <div className="w-6" />
                </div>

                {/* Simulated Body Miniature */}
                <div className="flex-1 bg-slate-950 p-3 flex flex-col justify-center items-center text-slate-400">
                  <AppWindow className="w-8 h-8 opacity-40 group-hover:opacity-80 transition" />
                  <span className="text-[11px] font-semibold mt-2 text-white">{win.title.split('—')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-white/50 font-medium pb-2">
        Click any window to focus • Press Escape to dismiss Mission Control
      </div>
    </div>
  );
}
