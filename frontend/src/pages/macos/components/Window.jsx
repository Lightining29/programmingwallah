import React, { useRef, useState } from 'react';
import macSound from '../services/sound.js';

export default function Window({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  x,
  y,
  w,
  h,
  minW = 320,
  minH = 200,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  children,
  toolbarExtra,
  isDark = true
}) {
  const [isSnapping, setIsSnapping] = useState(null); // 'left', 'right', 'top'
  const dragRef = useRef(null);

  if (!isOpen || isMinimized) return null;

  // ── Drag & Move Logic with Snapping Preview ──
  const handleMouseDownHeader = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    onFocus(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = x;
    const initialY = y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const newX = Math.max(0, initialX + dx);
      const newY = Math.max(26, initialY + dy);

      // Snap boundary detection
      if (moveEvent.clientY <= 30) {
        setIsSnapping('top');
      } else if (moveEvent.clientX <= 20) {
        setIsSnapping('left');
      } else if (moveEvent.clientX >= window.innerWidth - 20) {
        setIsSnapping('right');
      } else {
        setIsSnapping(null);
      }

      onUpdatePosition(id, { x: newX, y: newY });
    };

    const handleMouseUp = (upEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (upEvent.clientY <= 30) {
        onMaximize(id);
      } else if (upEvent.clientX <= 20) {
        // Snap left 50%
        onUpdatePosition(id, {
          x: 0,
          y: 26,
          w: Math.floor(window.innerWidth / 2),
          h: window.innerHeight - 26 - 80,
          isMaximized: false
        });
      } else if (upEvent.clientX >= window.innerWidth - 20) {
        // Snap right 50%
        onUpdatePosition(id, {
          x: Math.floor(window.innerWidth / 2),
          y: 26,
          w: Math.floor(window.innerWidth / 2),
          h: window.innerHeight - 26 - 80,
          isMaximized: false
        });
      }
      setIsSnapping(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // ── 8-Direction Resizing Handles ──
  const handleMouseDownResize = (e, direction) => {
    e.stopPropagation();
    onFocus(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = w;
    const startH = h;
    const startWinX = x;
    const startWinY = y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let nextW = startW;
      let nextH = startH;
      let nextX = startWinX;
      let nextY = startWinY;

      if (direction.includes('e')) nextW = Math.max(minW, startW + dx);
      if (direction.includes('s')) nextH = Math.max(minH, startH + dy);
      if (direction.includes('w')) {
        const potentialW = startW - dx;
        if (potentialW >= minW) {
          nextW = potentialW;
          nextX = startWinX + dx;
        }
      }
      if (direction.includes('n')) {
        const potentialH = startH - dy;
        if (potentialH >= minH) {
          nextH = potentialH;
          nextY = startWinY + dy;
        }
      }

      onUpdatePosition(id, { x: nextX, y: nextY, w: nextW, h: nextH });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const currentW = isMaximized ? window.innerWidth : w;
  const currentH = isMaximized ? (window.innerHeight - 26 - 80) : h;
  const currentX = isMaximized ? 0 : x;
  const currentY = isMaximized ? 26 : y;

  return (
    <>
      {/* Snap Preview Ghost Box */}
      {isSnapping && (
        <div
          style={{ zIndex: 999 }}
          className={`fixed pointer-events-none transition-all duration-150 border-2 border-sky-400 bg-sky-500/20 backdrop-blur-sm rounded-xl ${
            isSnapping === 'top'
              ? 'top-[26px] left-0 w-full h-[calc(100vh-106px)]'
              : isSnapping === 'left'
              ? 'top-[26px] left-0 w-1/2 h-[calc(100vh-106px)]'
              : 'top-[26px] right-0 w-1/2 h-[calc(100vh-106px)]'
          }`}
        />
      )}

      {/* Main Window Container */}
      <div
        onClick={() => onFocus(id)}
        style={{
          zIndex,
          left: currentX,
          top: currentY,
          width: currentW,
          height: currentH
        }}
        className={`absolute rounded-xl overflow-hidden backdrop-blur-3xl border shadow-2xl flex flex-col transition-[box-shadow,opacity] duration-150 select-none ${
          isDark ? 'bg-slate-900/95 border-white/20 text-slate-100' : 'bg-white/95 border-black/10 text-slate-800'
        } ${isActive ? 'ring-1 ring-sky-400/50 shadow-2xl shadow-black/80' : 'opacity-95 shadow-lg'}`}
      >
        {/* Title Bar Toolbar */}
        <div
          onMouseDown={handleMouseDownHeader}
          onDoubleClick={() => onMaximize(id)}
          className={`h-10 px-4 border-b flex items-center justify-between cursor-move shrink-0 ${
            isDark ? 'bg-slate-800/80 border-white/10' : 'bg-slate-100/90 border-black/10'
          }`}
        >
          {/* Traffic Lights */}
          <div className="flex items-center gap-2 group/lights">
            <button
              title="Close (Cmd+W)"
              onClick={(e) => { e.stopPropagation(); macSound.playClick(); onClose(id); }}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center cursor-pointer transition shadow-inner"
            >
              <span className="opacity-0 group-hover/lights:opacity-100 text-[9px] text-black font-black leading-none">×</span>
            </button>
            <button
              title="Minimize (Cmd+M)"
              onClick={(e) => { e.stopPropagation(); macSound.playClick(); onMinimize(id); }}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 flex items-center justify-center cursor-pointer transition shadow-inner"
            >
              <span className="opacity-0 group-hover/lights:opacity-100 text-[8px] text-black font-black leading-none">-</span>
            </button>
            <button
              title="Maximize / Zoom"
              onClick={(e) => { e.stopPropagation(); macSound.playClick(); onMaximize(id); }}
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 flex items-center justify-center cursor-pointer transition shadow-inner"
            >
              <span className="opacity-0 group-hover/lights:opacity-100 text-[7px] text-black font-black leading-none">+</span>
            </button>
          </div>

          {/* Window Title & Icon */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 pointer-events-none truncate max-w-[50%]">
            {icon && <span className="w-3.5 h-3.5 shrink-0 flex items-center">{icon}</span>}
            <span className="truncate">{title}</span>
          </div>

          {/* Extra Actions / Spacer */}
          <div className="flex items-center gap-2">
            {toolbarExtra || <div className="w-12" />}
          </div>
        </div>

        {/* Window Content Body */}
        <div className="flex-1 flex flex-col overflow-hidden relative select-text">
          {children}
        </div>

        {/* 8 Resizing Handles (disabled when maximized) */}
        {!isMaximized && (
          <>
            <div onMouseDown={(e) => handleMouseDownResize(e, 'n')} className="absolute top-0 left-0 right-0 h-1.5 cursor-n-resize" />
            <div onMouseDown={(e) => handleMouseDownResize(e, 's')} className="absolute bottom-0 left-0 right-0 h-1.5 cursor-s-resize" />
            <div onMouseDown={(e) => handleMouseDownResize(e, 'w')} className="absolute top-0 bottom-0 left-0 w-1.5 cursor-w-resize" />
            <div onMouseDown={(e) => handleMouseDownResize(e, 'e')} className="absolute top-0 bottom-0 right-0 w-1.5 cursor-e-resize" />
            <div onMouseDown={(e) => handleMouseDownResize(e, 'nw')} className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" />
            <div onMouseDown={(e) => handleMouseDownResize(e, 'ne')} className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" />
            <div onMouseDown={(e) => handleMouseDownResize(e, 'sw')} className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" />
            <div onMouseDown={(e) => handleMouseDownResize(e, 'se')} className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" />
          </>
        )}
      </div>
    </>
  );
}
