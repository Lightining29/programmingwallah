import React, { useState } from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Battery, 
  Search, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  Info, 
  Activity, 
  Compass, 
  Cloud, 
  ExternalLink, 
  Sparkles, 
  Globe, 
  Play, 
  Check, 
  ChevronRight, 
  Layers, 
  Gamepad2, 
  Database, 
  Code, 
  Terminal, 
  Folder, 
  RotateCcw, 
  Power, 
  Moon, 
  Lock, 
  SlidersHorizontal,
  Music,
  Share2
} from 'lucide-react';
import macSound from '../services/sound.js';
import { GAMES_CATALOG } from '../services/gameCatalog.js';

export default function GlobalMenuBar({
  activeAppId = 'finder',
  activeMenu,
  setActiveMenu,
  activeMenuRef,
  currentUser,
  windows = {},
  openApp,
  closeWindow,
  toggleMaximize,
  minimizeWindow,
  focusWindow,
  toggleFullscreenMode,
  isFullscreen,
  setIsLocked,
  screenBrightness,
  setScreenBrightness,
  soundVolume,
  setSoundVolume,
  isMuted,
  setIsMuted,
  isDarkMode,
  setIsDarkMode,
  setIsNotificationCenterOpen,
  setIsLaunchpadOpen,
  setIsMissionControlOpen,
  setIsSpotlightOpen,
  setIsSiriOpen,
  launchGame,
  navigate,
  currentTime,
  formatMacDate,
  onTriggerSleep,
  onTriggerRestart,
  onTriggerShutdown,
  onVsCodeRunCode,
  onVsCodeNewFile,
  onVsCodeTogglePreview,
  onMySQLNewQuery,
  onMySQLRunQuery,
  onSafariNewTab
}) {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [airDropMode, setAirDropMode] = useState('Everyone');
  const [focusMode, setFocusMode] = useState(false);

  // Helper for menu item click
  const handleMenuClick = (menuId) => {
    macSound.playClick();
    setActiveMenu(prev => prev === menuId ? null : menuId);
  };

  // Helper for hover switching
  const handleMenuMouseEnter = (menuId) => {
    if (activeMenu && !['spotlight', 'controlCenter', 'wifi', 'bluetooth', 'sound'].includes(activeMenu)) {
      setActiveMenu(menuId);
    }
  };

  const getAppName = (appId) => {
    switch (appId) {
      case 'vscode': return 'Code';
      case 'mysql-studio':
      case 'mysqlstudio': return 'MySQL Studio';
      case 'gamecenter': return 'Game Center';
      case 'safari': return 'Safari';
      case 'finder': return 'Finder';
      case 'settings': return 'System Settings';
      case 'terminal': return 'Terminal';
      case 'activitymonitor': return 'Activity Monitor';
      case 'appstore': return 'App Store';
      default:
        if (appId?.startsWith('game-')) {
          const game = GAMES_CATALOG.find(g => g.id === appId.replace('game-', ''));
          return game ? game.title : 'Game';
        }
        return 'Finder';
    }
  };

  // Menu bar sections by active application
  const getAppMenuItems = () => {
    switch (activeAppId) {
      case 'vscode':
        return [
          { id: 'app', label: 'Code' },
          { id: 'file', label: 'File' },
          { id: 'edit', label: 'Edit' },
          { id: 'selection', label: 'Selection' },
          { id: 'view', label: 'View' },
          { id: 'go', label: 'Go' },
          { id: 'run', label: 'Run' },
          { id: 'terminal', label: 'Terminal' },
          { id: 'help', label: 'Help' }
        ];
      case 'mysql-studio':
      case 'mysqlstudio':
        return [
          { id: 'app', label: 'MySQL Studio' },
          { id: 'file', label: 'File' },
          { id: 'edit', label: 'Edit' },
          { id: 'view', label: 'View' },
          { id: 'database', label: 'Database' },
          { id: 'query', label: 'Query' },
          { id: 'window', label: 'Window' },
          { id: 'help', label: 'Help' }
        ];
      case 'gamecenter':
        return [
          { id: 'app', label: 'Game Center' },
          { id: 'file', label: 'File' },
          { id: 'view', label: 'View' },
          { id: 'games', label: 'Games' },
          { id: 'window', label: 'Window' },
          { id: 'help', label: 'Help' }
        ];
      case 'safari':
        return [
          { id: 'app', label: 'Safari' },
          { id: 'file', label: 'File' },
          { id: 'edit', label: 'Edit' },
          { id: 'view', label: 'View' },
          { id: 'history', label: 'History' },
          { id: 'bookmarks', label: 'Bookmarks' },
          { id: 'window', label: 'Window' },
          { id: 'help', label: 'Help' }
        ];
      case 'terminal':
        return [
          { id: 'app', label: 'Terminal' },
          { id: 'shell', label: 'Shell' },
          { id: 'edit', label: 'Edit' },
          { id: 'view', label: 'View' },
          { id: 'window', label: 'Window' },
          { id: 'help', label: 'Help' }
        ];
      case 'settings':
        return [
          { id: 'app', label: 'System Settings' },
          { id: 'edit', label: 'Edit' },
          { id: 'view', label: 'View' },
          { id: 'window', label: 'Window' },
          { id: 'help', label: 'Help' }
        ];
      default:
        return [
          { id: 'app', label: 'Finder' },
          { id: 'file', label: 'File' },
          { id: 'edit', label: 'Edit' },
          { id: 'view', label: 'View' },
          { id: 'go', label: 'Go' },
          { id: 'window', label: 'Window' },
          { id: 'help', label: 'Help' }
        ];
    }
  };

  return (
    <header 
      ref={activeMenuRef}
      onClick={(e) => e.stopPropagation()}
      className="h-7 w-full fixed top-0 left-0 z-[999999] px-3 backdrop-blur-3xl bg-black/45 border-b border-white/10 flex items-center justify-between text-xs text-white/90 shadow-sm select-none"
    >
      {/* ── Left Side: Apple Logo + Dynamic App Menus ── */}
      <div className="flex items-center gap-1">
        {/*  Apple Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('apple')}
            onMouseEnter={() => handleMenuMouseEnter('apple')}
            className={`font-bold text-sm px-2 py-0.5 rounded transition cursor-pointer flex items-center ${
              activeMenu === 'apple' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/95'
            }`}
          >
            
          </button>

          {activeMenu === 'apple' && (
            <div className="absolute top-7 left-0 w-64 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-white/15 p-1.5 shadow-2xl z-[999999] text-slate-200 text-xs animate-in fade-in duration-100">
              <button 
                onClick={() => { openApp('aboutMac'); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span className="font-semibold">About This Mac</span>
                <Info className="w-3.5 h-3.5 opacity-60" />
              </button>

              <div className="h-px bg-white/10 my-1" />

              <button 
                onClick={() => { openApp('settings'); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>System Settings...</span>
                <span className="text-[10px] text-white/40">⌘,</span>
              </button>

              <button 
                onClick={() => { openApp('appstore'); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-sky-300 font-semibold"
              >
                <span>App Store...</span>
                <span className="text-[9px] bg-sky-500/30 px-1 rounded text-sky-200">Store</span>
              </button>

              <button 
                onClick={() => { openApp('gamecenter'); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-purple-600 hover:text-white flex items-center justify-between cursor-pointer text-purple-300 font-bold"
              >
                <span className="flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Game Center...</span>
                </span>
                <span className="text-[9px] bg-purple-500/30 px-1 rounded text-purple-200">Playhop</span>
              </button>

              <div className="h-px bg-white/10 my-1" />

              {/* Recent Items Submenu Trigger */}
              <div className="relative group/recent">
                <button 
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Recent Items</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
                <div className="hidden group-hover/recent:block absolute left-full top-0 ml-1 w-56 rounded-xl bg-slate-900 border border-white/15 p-1 shadow-2xl text-xs space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 block uppercase">Applications</span>
                  <button onClick={() => { openApp('vscode'); setActiveMenu(null); }} className="w-full text-left px-2 py-1 rounded hover:bg-blue-600 hover:text-white cursor-pointer">Visual Studio Code</button>
                  <button onClick={() => { openApp('mysql-studio'); setActiveMenu(null); }} className="w-full text-left px-2 py-1 rounded hover:bg-blue-600 hover:text-white cursor-pointer">MySQL Studio</button>
                  <button onClick={() => { openApp('gamecenter'); setActiveMenu(null); }} className="w-full text-left px-2 py-1 rounded hover:bg-blue-600 hover:text-white cursor-pointer">Game Center</button>
                  <button onClick={() => { openApp('safari'); setActiveMenu(null); }} className="w-full text-left px-2 py-1 rounded hover:bg-blue-600 hover:text-white cursor-pointer">Safari</button>
                </div>
              </div>

              <div className="h-px bg-white/10 my-1" />

              <button 
                onClick={() => {
                  if (activeAppId) closeWindow(activeAppId);
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Force Quit Application...</span>
                <span className="text-[10px] text-white/40">⌥⌘⎋</span>
              </button>

              <div className="h-px bg-white/10 my-1" />

              <button 
                onClick={() => { setActiveMenu(null); if (onTriggerSleep) onTriggerSleep(); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Sleep</span>
                <Moon className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button 
                onClick={() => { setActiveMenu(null); if (onTriggerRestart) onTriggerRestart(); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Restart...</span>
                <RotateCcw className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button 
                onClick={() => { setActiveMenu(null); if (onTriggerShutdown) onTriggerShutdown(); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-amber-300"
              >
                <span>Shut Down...</span>
                <Power className="w-3.5 h-3.5 opacity-60" />
              </button>

              <div className="h-px bg-white/10 my-1" />

              <button 
                onClick={() => { setIsLocked(true); setActiveMenu(null); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Lock Screen</span>
                <span className="text-[10px] text-white/40">⌃⌘Q</span>
              </button>

              <button 
                onClick={async () => {
                  setActiveMenu(null);
                  try { await fetch('/api/macos/auth/logout', { method: 'POST' }); } catch {}
                  setIsLocked(true);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white flex items-center justify-between cursor-pointer text-rose-300 hover:text-white"
              >
                <span>Log Out {currentUser?.username || 'User'}...</span>
                <span className="text-[10px] text-white/40">⇧⌘Q</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic App Menus based on activeAppId */}
        {getAppMenuItems().map(item => {
          const isAppItem = item.id === 'app';
          const isMenuOpen = activeMenu === item.id;

          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => handleMenuClick(item.id)}
                onMouseEnter={() => handleMenuMouseEnter(item.id)}
                className={`px-2 py-0.5 rounded transition cursor-pointer text-[11px] ${
                  isAppItem ? 'font-extrabold tracking-tight text-white' : 'font-medium'
                } ${
                  isMenuOpen ? 'bg-white/20 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>

              {/* Dropdowns for App Menu Items */}
              {isMenuOpen && (
                <div className="absolute top-7 left-0 w-56 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-white/15 p-1.5 shadow-2xl z-[999999] text-slate-200 text-xs animate-in fade-in duration-100">
                  {/* APP MENU */}
                  {item.id === 'app' && (
                    <>
                      <button onClick={() => { openApp('aboutMac'); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer">
                        About {item.label}
                      </button>
                      <button onClick={() => { openApp('settings'); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Settings...</span>
                        <span className="text-[10px] text-white/40">⌘,</span>
                      </button>
                      <div className="h-px bg-white/10 my-1" />
                      <button onClick={() => { minimizeWindow(activeAppId); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Hide {item.label}</span>
                        <span className="text-[10px] text-white/40">⌘H</span>
                      </button>
                      <button onClick={() => { closeWindow(activeAppId); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between text-rose-300">
                        <span>Quit {item.label}</span>
                        <span className="text-[10px] text-white/40">⌘Q</span>
                      </button>
                    </>
                  )}

                  {/* FILE MENU */}
                  {item.id === 'file' && (
                    <>
                      <button onClick={() => { if (onVsCodeNewFile) onVsCodeNewFile(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>New File</span>
                        <span className="text-[10px] text-white/40">⌘N</span>
                      </button>
                      <button onClick={() => { openApp(activeAppId); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>New Window</span>
                        <span className="text-[10px] text-white/40">⇧⌘N</span>
                      </button>
                      <div className="h-px bg-white/10 my-1" />
                      <button onClick={() => { closeWindow(activeAppId); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Close Window</span>
                        <span className="text-[10px] text-white/40">⌘W</span>
                      </button>
                    </>
                  )}

                  {/* EDIT MENU */}
                  {item.id === 'edit' && (
                    <>
                      <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Undo</span>
                        <span className="text-[10px] text-white/40">⌘Z</span>
                      </button>
                      <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Redo</span>
                        <span className="text-[10px] text-white/40">⇧⌘Z</span>
                      </button>
                      <div className="h-px bg-white/10 my-1" />
                      <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Cut</span>
                        <span className="text-[10px] text-white/40">⌘X</span>
                      </button>
                      <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Copy</span>
                        <span className="text-[10px] text-white/40">⌘C</span>
                      </button>
                      <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Paste</span>
                        <span className="text-[10px] text-white/40">⌘V</span>
                      </button>
                      <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Select All</span>
                        <span className="text-[10px] text-white/40">⌘A</span>
                      </button>
                    </>
                  )}

                  {/* VIEW MENU */}
                  {item.id === 'view' && (
                    <>
                      <button onClick={() => { toggleFullscreenMode(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer flex justify-between">
                        <span>Enter Full Screen</span>
                        <span className="text-[10px] text-white/40">⌃⌘F</span>
                      </button>
                      <button onClick={() => { setIsNotificationCenterOpen(prev => !prev); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer">
                        Notification Center & Widgets
                      </button>
                      <button onClick={() => { setIsLaunchpadOpen(true); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer">
                        Launchpad
                      </button>
                    </>
                  )}

                  {/* RUN MENU (VS Code) */}
                  {item.id === 'run' && (
                    <>
                      <button onClick={() => { if (onVsCodeRunCode) onVsCodeRunCode(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold cursor-pointer flex justify-between">
                        <span>▶ Run Code</span>
                        <span className="text-[10px] text-white/60">F5</span>
                      </button>
                      <button onClick={() => { if (onVsCodeTogglePreview) onVsCodeTogglePreview(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer">
                        Toggle Live Web Preview
                      </button>
                    </>
                  )}

                  {/* DATABASE & QUERY (MySQL Studio) */}
                  {item.id === 'database' && (
                    <>
                      <button onClick={() => { openApp('mysql-studio'); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer">
                        Connect Database...
                      </button>
                      <button onClick={() => { openApp('mysql-studio'); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer">
                        Refresh Schemas
                      </button>
                    </>
                  )}
                  {item.id === 'query' && (
                    <>
                      <button onClick={() => { if (onMySQLRunQuery) onMySQLRunQuery(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white font-bold cursor-pointer flex justify-between">
                        <span>Execute Query</span>
                        <span className="text-[10px] text-white/60">⌘↵</span>
                      </button>
                      <button onClick={() => { if (onMySQLNewQuery) onMySQLNewQuery(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer">
                        New Query Tab
                      </button>
                    </>
                  )}

                  {/* GAMES MENU (Game Center) */}
                  {item.id === 'games' && (
                    <>
                      <button onClick={() => { openApp('gamecenter'); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white font-bold cursor-pointer">
                        Discover 100+ Games
                      </button>
                      <div className="h-px bg-white/10 my-1" />
                      {GAMES_CATALOG.slice(0, 5).map(g => (
                        <button
                          key={g.id}
                          onClick={() => { launchGame(g); setActiveMenu(null); }}
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-purple-600 hover:text-white cursor-pointer flex items-center gap-2"
                        >
                          <span>{g.iconEmoji}</span>
                          <span>{g.title}</span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* GO / SELECTION / WINDOW / HELP FALLBACK */}
                  {!['app', 'file', 'edit', 'view', 'run', 'database', 'query', 'games'].includes(item.id) && (
                    <>
                      <button onClick={() => setActiveMenu(null)} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer">
                        Action for {item.label}
                      </button>
                      <button onClick={() => { openApp('settings'); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer">
                        Preferences...
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Right Side Status Controls ── */}
      <div className="flex items-center gap-2.5">
        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreenMode}
          className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-bold text-emerald-300 hover:text-white transition cursor-pointer"
          title="Toggle Fullscreen macOS Mode (⌃⌘F)"
        >
          {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
        </button>

        {/* Battery Status */}
        <div className="flex items-center gap-1 opacity-90 text-[11px] cursor-pointer" onClick={() => handleMenuClick('battery')}>
          <span>100%</span>
          <Battery className="w-4 h-4 text-emerald-400 rotate-90" />
        </div>

        {/* Wi-Fi Icon & Popup */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('wifi')}
            className={`p-1 rounded hover:bg-white/10 transition cursor-pointer ${
              activeMenu === 'wifi' ? 'bg-white/20' : ''
            }`}
            title="Wi-Fi Network"
          >
            <Wifi className={`w-3.5 h-3.5 ${wifiEnabled ? 'text-white' : 'text-slate-500'}`} />
          </button>

          {activeMenu === 'wifi' && (
            <div className="absolute top-7 right-0 w-64 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-white/15 p-3 shadow-2xl z-[999999] text-slate-100 text-xs animate-in fade-in duration-100 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold flex items-center gap-1.5"><Wifi className="w-4 h-4 text-blue-400" /> Wi-Fi</span>
                <input
                  type="checkbox"
                  checked={wifiEnabled}
                  onChange={(e) => setWifiEnabled(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              {wifiEnabled && (
                <div className="space-y-1">
                  <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[11px] text-blue-300">AppleTree-5G Ultra-Fast</p>
                      <p className="text-[9px] text-slate-400">Connected • 950 Mbps</p>
                    </div>
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="p-2 rounded-xl hover:bg-white/5 flex items-center justify-between text-slate-300 cursor-pointer">
                    <p className="text-[11px]">AppleTree-Guest</p>
                    <span className="text-[9px] text-slate-500">Encrypted</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sound Volume Quick Icon & Popup */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('sound')}
            className={`p-1 rounded hover:bg-white/10 transition cursor-pointer ${
              activeMenu === 'sound' ? 'bg-white/20' : ''
            }`}
            title="Sound Volume"
          >
            {isMuted || soundVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
          </button>

          {activeMenu === 'sound' && (
            <div className="absolute top-7 right-0 w-56 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-white/15 p-3 shadow-2xl z-[999999] text-slate-100 text-xs animate-in fade-in duration-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>Sound Volume</span>
                <span>{soundVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolume}
                onChange={(e) => setSoundVolume(parseInt(e.target.value, 10))}
                className="w-full accent-blue-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-400">Output: MacBook Speakers</span>
                <button
                  onClick={() => setIsMuted(prev => !prev)}
                  className="text-[10px] text-blue-400 hover:underline cursor-pointer"
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Siri Quick Button */}
        <button
          onClick={() => setIsSiriOpen(prev => !prev)}
          className="p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          title="Ask Siri"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-400 animate-pulse" />
        </button>

        {/* Spotlight Search (Cmd+Space) */}
        <button
          onClick={() => setIsSpotlightOpen(true)}
          className="hover:opacity-75 transition-opacity cursor-pointer p-0.5"
          title="Spotlight Search (Cmd+Space)"
        >
          <Search className="w-3.5 h-3.5 text-white/90" />
        </button>

        {/* Control Center Toggle */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('controlCenter')}
            className={`p-1 rounded hover:bg-white/10 transition cursor-pointer ${
              activeMenu === 'controlCenter' ? 'bg-white/20' : ''
            }`}
            title="Control Center"
          >
            <Sliders className="w-3.5 h-3.5 text-white/90" />
          </button>

          {/* Full macOS Control Center Panel */}
          {activeMenu === 'controlCenter' && (
            <div className="absolute top-7 right-0 w-80 rounded-3xl backdrop-blur-3xl bg-slate-950/95 border border-white/15 p-4 shadow-2xl z-[999999] text-slate-100 text-xs animate-in fade-in duration-150 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-extrabold flex items-center gap-1.5"><Sliders className="w-4 h-4 text-blue-400" /> Control Center</span>
                <span className="text-[10px] text-emerald-400 font-bold">● macOS Sequoia Pro</span>
              </div>

              {/* 2x2 Network and Focus Modules */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Wi-Fi Card */}
                <div 
                  onClick={() => setWifiEnabled(prev => !prev)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                    wifiEnabled 
                      ? 'bg-blue-600/30 border-blue-500/40 text-blue-300' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <Wifi className="w-4 h-4" />
                  <div>
                    <p className="font-bold text-[11px]">Wi-Fi</p>
                    <p className="text-[9px] opacity-75">{wifiEnabled ? 'AppleTree-5G' : 'Off'}</p>
                  </div>
                </div>

                {/* Bluetooth Card */}
                <div 
                  onClick={() => setBluetoothEnabled(prev => !prev)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                    bluetoothEnabled 
                      ? 'bg-blue-600/30 border-blue-500/40 text-blue-300' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <Bluetooth className="w-4 h-4" />
                  <div>
                    <p className="font-bold text-[11px]">Bluetooth</p>
                    <p className="text-[9px] opacity-75">{bluetoothEnabled ? 'On' : 'Off'}</p>
                  </div>
                </div>

                {/* Dark Mode Card */}
                <div 
                  onClick={() => setIsDarkMode(prev => !prev)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                    isDarkMode 
                      ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300' 
                      : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <div>
                    <p className="font-bold text-[11px]">Dark Mode</p>
                    <p className="text-[9px] opacity-75">{isDarkMode ? 'On' : 'Light'}</p>
                  </div>
                </div>

                {/* Focus / DND Card */}
                <div 
                  onClick={() => setFocusMode(prev => !prev)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                    focusMode 
                      ? 'bg-purple-600/30 border-purple-500/40 text-purple-300' 
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-400 animate-pulse" />
                  <div>
                    <p className="font-bold text-[11px]">Focus</p>
                    <p className="text-[9px] opacity-75">{focusMode ? 'Do Not Disturb' : 'Off'}</p>
                  </div>
                </div>
              </div>

              {/* Display Brightness Slider */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span>Display</span>
                  <span>{screenBrightness}%</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="100"
                  value={screenBrightness}
                  onChange={(e) => setScreenBrightness(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sound Volume Slider */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span>Sound</span>
                  <span>{soundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>

              {/* Now Playing Widget */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[11px] text-white">macOS Soundscapes</p>
                    <p className="text-[9px] text-slate-400">Ambient Coding Audio</p>
                  </div>
                </div>
                <button
                  onClick={() => macSound.playPop()}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Date & Time (Opens Notification Center) */}
        <button
          onClick={() => setIsNotificationCenterOpen(prev => !prev)}
          className="font-semibold text-white/95 tracking-wide text-[11px] hover:opacity-80 transition cursor-pointer ml-1"
          title="Notification Center & Widgets"
        >
          {formatMacDate(currentTime)}
        </button>
      </div>
    </header>
  );
}
