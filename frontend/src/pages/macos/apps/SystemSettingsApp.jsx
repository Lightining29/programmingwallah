import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Sun, 
  Moon, 
  Palette, 
  Monitor, 
  Image, 
  Volume2, 
  VolumeX, 
  Wifi, 
  Bluetooth, 
  Sliders, 
  Eye, 
  Lock, 
  Shield, 
  User, 
  Users, 
  Key, 
  Keyboard, 
  Mouse, 
  HardDrive, 
  Clock, 
  RotateCcw, 
  Gamepad2, 
  Code, 
  Globe, 
  Bell, 
  Battery, 
  Share2, 
  Cpu, 
  Terminal, 
  Check, 
  Info,
  Sparkles,
  Zap,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import macSound from '../services/sound.js';

// 9 Accent Colors matching macOS Sequoia
export const ACCENT_COLORS = [
  { id: 'multicolor', name: 'Multicolor', hex: 'linear-gradient(135deg, #f43f5e, #8b5cf6, #06b6d4, #10b981)', isMulti: true },
  { id: 'blue', name: 'Blue', hex: '#007aff' },
  { id: 'purple', name: 'Purple', hex: '#af52de' },
  { id: 'pink', name: 'Pink', hex: '#ff2d55' },
  { id: 'red', name: 'Red', hex: '#ff3b30' },
  { id: 'orange', name: 'Orange', hex: '#ff9500' },
  { id: 'yellow', name: 'Yellow', hex: '#ffcc00' },
  { id: 'green', name: 'Green', hex: '#34c759' },
  { id: 'graphite', name: 'Graphite', hex: '#8e8e93' }
];

export const SYSTEM_WALLPAPERS = [
  { id: 'sonoma-dark', name: 'macOS Sonoma Dark', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80' },
  { id: 'ventura-dark', name: 'macOS Ventura Horizon', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2560&q=80' },
  { id: 'monterey-abstract', name: 'Monterey Canyon', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2560&q=80' },
  { id: 'bigsur-night', name: 'Big Sur Peak', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=80' },
  { id: 'aurora-borealis', name: 'Aurora Borealis', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2560&q=80' },
  { id: 'cyber-nebula', name: 'Deep Space Nebula', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2560&q=80' }
];

export const SETTINGS_SECTIONS = [
  { id: 'appearance', name: 'Aspecto', icon: Palette, category: 'personal' },
  { id: 'accessibility', name: 'Accesibilidad', icon: Eye, category: 'personal' },
  { id: 'controlcenter', name: 'Centro de control', icon: Sliders, category: 'personal' },
  { id: 'siri', name: 'Siri y Spotlight', icon: Sparkles, category: 'personal' },
  { id: 'privacy', name: 'Privacidad y seguridad', icon: Shield, category: 'personal' },
  { id: 'desktopdock', name: 'Escritorio y Dock', icon: HardDrive, category: 'desktop' },
  { id: 'displays', name: 'Pantallas', icon: Monitor, category: 'hardware' },
  { id: 'wallpaper', name: 'Fondo de pantalla', icon: Image, category: 'desktop' },
  { id: 'screensaver', name: 'Salvapantallas', icon: Eye, category: 'desktop' },
  { id: 'battery', name: 'Batería', icon: Battery, category: 'hardware' },
  { id: 'lockscreen', name: 'Pantalla de bloqueo', icon: Lock, category: 'personal' },
  { id: 'users', name: 'Usuarios y cuentas', icon: Users, category: 'accounts' },
  { id: 'passwords', name: 'Contraseñas', icon: Key, category: 'accounts' },
  { id: 'general', name: 'General', icon: Cpu, category: 'system' },
  { id: 'sound', name: 'Sonido', icon: Volume2, category: 'hardware' },
  { id: 'wifi', name: 'Wi-Fi', icon: Wifi, category: 'network' },
  { id: 'bluetooth', name: 'Bluetooth', icon: Bluetooth, category: 'network' },
  { id: 'network', name: 'Red', icon: Globe, category: 'network' },
  { id: 'notifications', name: 'Notificaciones', icon: Bell, category: 'system' },
  { id: 'keyboard', name: 'Teclado', icon: Keyboard, category: 'hardware' },
  { id: 'mouse', name: 'Ratón y Trackpad', icon: Mouse, category: 'hardware' },
  { id: 'storage', name: 'Almacenamiento', icon: HardDrive, category: 'system' },
  { id: 'datetime', name: 'Fecha y hora', icon: Clock, category: 'system' },
  { id: 'updates', name: 'Actualización de software', icon: RefreshCw, category: 'system' },
  { id: 'timemachine', name: 'Time Machine', icon: RotateCcw, category: 'system' },
  { id: 'gamecenter', name: 'Game Center', icon: Gamepad2, category: 'apps' },
  { id: 'developer', name: 'Developer Settings', icon: Code, category: 'system' }
];

export default function SystemSettingsApp({
  currentSettings = {},
  onUpdateSetting,
  currentUser = {},
  onClose
}) {
  const [activeTab, setActiveTab] = useState('appearance');
  const [history, setHistory] = useState(['appearance']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecentDropdownOpen, setIsRecentDropdownOpen] = useState(false);
  const [storageData, setStorageData] = useState(null);
  const [recentVisited, setRecentVisited] = useState(['battery', 'appearance', 'general', 'desktopdock', 'passwords']);

  // Fetch real storage stats
  useEffect(() => {
    fetch('/api/macos/desktop/storage')
      .then(res => res.json())
      .then(d => {
        if (d.success) setStorageData(d.storage);
      })
      .catch(() => {});
  }, []);

  const navigateToTab = (tabId) => {
    if (tabId === activeTab) return;
    macSound.playPop();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(tabId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setActiveTab(tabId);
    setRecentVisited(prev => [tabId, ...prev.filter(x => x !== tabId)].slice(0, 7));
    setIsRecentDropdownOpen(false);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      macSound.playClick();
      const prevTab = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setActiveTab(prevTab);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      macSound.playClick();
      const nextTab = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setActiveTab(nextTab);
    }
  };

  const filteredSections = SETTINGS_SECTIONS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSectionObj = SETTINGS_SECTIONS.find(s => s.id === activeTab) || SETTINGS_SECTIONS[0];

  return (
    <div className="w-full h-full flex bg-[#1e1e1e] text-[#e2e8f0] select-none overflow-hidden font-sans">
      {/* ── Left Navigation Sidebar ── */}
      <aside className="w-64 bg-[#252526]/80 backdrop-blur-2xl border-r border-white/10 flex flex-col shrink-0">
        {/* Search input ("Buscar") */}
        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-white/10 focus:border-blue-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* User Apple ID card */}
        <div 
          onClick={() => navigateToTab('users')}
          className="mx-2 my-1.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 cursor-pointer transition"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
            {currentUser?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser?.displayName || currentUser?.username || 'AppleTree User'}</p>
            <p className="text-[10px] text-slate-400 truncate">Apple ID, iCloud y más</p>
          </div>
        </div>

        {/* Categories list */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 scrollbar-thin">
          {filteredSections.map(sec => {
            const Icon = sec.icon;
            const isActive = activeTab === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => navigateToTab(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{sec.name}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Main Settings Panel ── */}
      <main className="flex-1 flex flex-col bg-[#1c1c1e] overflow-hidden">
        {/* Navigation Toolbar with < > and Section Title Dropdown */}
        <div className="h-12 px-6 bg-[#252526]/60 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* History < > buttons */}
            <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg border border-white/5">
              <button
                onClick={handleBack}
                disabled={historyIndex <= 0}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
                title="Atrás"
              >
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </button>
              <button
                onClick={handleForward}
                disabled={historyIndex >= history.length - 1}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
                title="Adelante"
              >
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Section Title Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRecentDropdownOpen(prev => !prev)}
                className="flex items-center gap-1.5 text-sm font-bold text-white hover:opacity-80 transition cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5"
              >
                <span>{activeSectionObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* History Dropdown matching screenshot */}
              {isRecentDropdownOpen && (
                <div className="absolute top-8 left-0 w-48 rounded-xl bg-[#2a2a2c] border border-white/15 p-1 shadow-2xl z-50 text-xs animate-in fade-in duration-100">
                  <span className="text-[10px] font-bold text-slate-400 px-2.5 py-1 block uppercase tracking-wider">
                    Recientes
                  </span>
                  {recentVisited.map(tabKey => {
                    const sec = SETTINGS_SECTIONS.find(s => s.id === tabKey);
                    if (!sec) return null;
                    const Icon = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => navigateToTab(sec.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                          activeTab === sec.id ? 'bg-blue-600 text-white font-bold' : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{sec.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Settings Content Area ── */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* ═══════════════ 1. ASPECTO (APPEARANCE) ═══════════════ */}
          {activeTab === 'appearance' && (
            <div className="max-w-2xl space-y-6">
              {/* Theme Mode Cards: Claro, Oscuro, Automático */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Modo</span>
                <div className="grid grid-cols-3 gap-4">
                  {/* Claro */}
                  <div
                    onClick={() => {
                      macSound.playPop();
                      onUpdateSetting('theme', 'light');
                      onUpdateSetting('dark_mode', false);
                    }}
                    className={`p-3 rounded-2xl bg-white/5 border-2 flex flex-col items-center gap-2 cursor-pointer transition ${
                      !currentSettings.dark_mode && currentSettings.theme !== 'auto'
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-full h-16 rounded-xl bg-slate-200 border border-slate-300 p-1 flex flex-col justify-between shadow-inner">
                      <div className="h-2 w-1/3 bg-slate-400 rounded-full" />
                      <div className="flex gap-1 justify-end">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">Claro</span>
                  </div>

                  {/* Oscuro */}
                  <div
                    onClick={() => {
                      macSound.playPop();
                      onUpdateSetting('theme', 'dark');
                      onUpdateSetting('dark_mode', true);
                    }}
                    className={`p-3 rounded-2xl bg-white/5 border-2 flex flex-col items-center gap-2 cursor-pointer transition ${
                      currentSettings.dark_mode !== false && currentSettings.theme !== 'auto'
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-full h-16 rounded-xl bg-slate-900 border border-slate-800 p-1 flex flex-col justify-between shadow-inner">
                      <div className="h-2 w-1/3 bg-slate-700 rounded-full" />
                      <div className="flex gap-1 justify-end">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">Oscuro</span>
                  </div>

                  {/* Automático */}
                  <div
                    onClick={() => {
                      macSound.playPop();
                      onUpdateSetting('theme', 'auto');
                    }}
                    className={`p-3 rounded-2xl bg-white/5 border-2 flex flex-col items-center gap-2 cursor-pointer transition ${
                      currentSettings.theme === 'auto'
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-full h-16 rounded-xl overflow-hidden border border-white/15 flex shadow-inner">
                      <div className="w-1/2 bg-slate-200" />
                      <div className="w-1/2 bg-slate-900" />
                    </div>
                    <span className="text-xs font-bold text-white">Automático</span>
                  </div>
                </div>
              </div>

              {/* 9 Accent Colors */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Color de acento</span>
                <div className="flex items-center gap-3">
                  {ACCENT_COLORS.map(color => {
                    const isSelected = currentSettings.accent_color === color.hex || (color.isMulti && currentSettings.accent_color === 'multicolor');
                    return (
                      <button
                        key={color.id}
                        onClick={() => {
                          macSound.playPop();
                          onUpdateSetting('accent_color', color.isMulti ? 'multicolor' : color.hex);
                        }}
                        style={{ background: color.hex }}
                        className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                          isSelected ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
                        }`}
                        title={color.name}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Highlight color & Tinting toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Color de contraste</span>
                  <select
                    value={currentSettings.highlight_color || '#007aff'}
                    onChange={(e) => onUpdateSetting('highlight_color', e.target.value)}
                    className="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-white outline-none"
                  >
                    <option value="#007aff">Azul</option>
                    <option value="#af52de">Morado</option>
                    <option value="#34c759">Verde</option>
                    <option value="#ff9500">Naranja</option>
                    <option value="#ff3b30">Rojo</option>
                  </select>
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Permitir el tintado del fondo de pantalla en las ventanas</span>
                    <span className="text-[11px] text-slate-400">Mejora la translucidez realista de macOS</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentSettings.settings?.appearance?.allowTinting !== false}
                    onChange={(e) => onUpdateSetting('settings.appearance.allowTinting', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Scrollbars behavior matching screenshot */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
                <span className="font-semibold text-white block">Mostrar barras de desplazamiento</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="scrollbar" defaultChecked className="accent-blue-600" />
                    <span>Automáticamente según el ratón o trackpad</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="scrollbar" className="accent-blue-600" />
                    <span>Durante el desplazamiento</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="scrollbar" className="accent-blue-600" />
                    <span>Siempre</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ 2. ESCRITORIO Y DOCK ═══════════════ */}
          {activeTab === 'desktopdock' && (
            <div className="max-w-2xl space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-5 text-xs">
                <h3 className="text-sm font-bold text-white">Configuración del Dock</h3>

                {/* Dock Size Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">Tamaño: Pequeño — Grande</span>
                    <span className="font-mono text-slate-400">{currentSettings.dock_size || 56}px</span>
                  </div>
                  <input
                    type="range"
                    min="36"
                    max="88"
                    value={currentSettings.dock_size || 56}
                    onChange={(e) => onUpdateSetting('dock_size', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* Magnification Toggle & Slider */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Ampliación al pasar el cursor</span>
                    <input
                      type="checkbox"
                      checked={Boolean(currentSettings.dock_magnification)}
                      onChange={(e) => onUpdateSetting('dock_magnification', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Dock Position on screen */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="font-semibold text-white">Posición en pantalla</span>
                  <div className="flex gap-1 bg-black/30 p-1 rounded-lg border border-white/10">
                    {['left', 'bottom', 'right'].map(pos => (
                      <button
                        key={pos}
                        onClick={() => {
                          macSound.playPop();
                          onUpdateSetting('dock_position', pos);
                        }}
                        className={`px-3 py-1 rounded text-xs font-semibold capitalize transition cursor-pointer ${
                          (currentSettings.dock_position || 'bottom') === pos
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {pos === 'left' ? 'Izquierda' : pos === 'bottom' ? 'Abajo' : 'Derecha'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-Hide Dock */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <span className="font-semibold text-white block">Ocultar y mostrar el Dock automáticamente</span>
                    <span className="text-[11px] text-slate-400">El Dock se revela cuando acercas el ratón al borde</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(currentSettings.dock_autohide)}
                    onChange={(e) => onUpdateSetting('dock_autohide', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ 3. FONDO DE PANTALLA (WALLPAPER) ═══════════════ */}
          {activeTab === 'wallpaper' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Fondos de pantalla de macOS</h3>
                <p className="text-xs text-slate-400">Haz clic en cualquier fondo para aplicarlo al instante</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SYSTEM_WALLPAPERS.map(wp => (
                  <div
                    key={wp.id}
                    onClick={() => {
                      macSound.playPop();
                      onUpdateSetting('wallpaper_url', wp.url);
                    }}
                    className={`group relative rounded-xl overflow-hidden border-2 transition cursor-pointer aspect-video shadow-md ${
                      currentSettings.wallpaper_url === wp.url || currentSettings.wallpaper === wp.url
                        ? 'border-blue-500 ring-2 ring-blue-500/50 scale-[1.02]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={wp.url} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white truncate">{wp.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Wallpaper URL */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-white block">Fondo de pantalla personalizado (URL)</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    defaultValue={currentSettings.wallpaper_url || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onUpdateSetting('wallpaper_url', e.target.value);
                        macSound.playPop();
                      }
                    }}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                  <button
                    onClick={(e) => {
                      const inp = e.target.previousElementSibling;
                      if (inp && inp.value) {
                        onUpdateSetting('wallpaper_url', inp.value);
                        macSound.playPop();
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ 4. PANTALLAS (DISPLAYS) ═══════════════ */}
          {activeTab === 'displays' && (
            <div className="max-w-2xl space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-5 text-xs">
                <h3 className="text-sm font-bold text-white">Liquid Retina XDR Display (ProMotion 120Hz)</h3>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">Brillo de pantalla</span>
                    <span className="font-mono text-slate-400">{currentSettings.screen_brightness || 100}%</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="100"
                    value={currentSettings.screen_brightness || 100}
                    onChange={(e) => onUpdateSetting('screen_brightness', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <span className="font-semibold text-white block">True Tone</span>
                    <span className="text-[11px] text-slate-400">Ajusta automáticamente los colores a la luz ambiental</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 rounded" />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <span className="font-semibold text-white block">Night Shift</span>
                    <span className="text-[11px] text-slate-400">Reduce la luz azul durante la noche</span>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ 5. SONIDO (SOUND) ═══════════════ */}
          {activeTab === 'sound' && (
            <div className="max-w-2xl space-y-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-5 text-xs">
                <h3 className="text-sm font-bold text-white">Efectos de sonido y salida</h3>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">Volumen de salida</span>
                    <span className="font-mono text-slate-400">{currentSettings.sound_volume || 85}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentSettings.sound_volume !== undefined ? currentSettings.sound_volume : 85}
                    onChange={(e) => onUpdateSetting('sound_volume', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="font-semibold text-white">Silenciar sonido</span>
                  <input
                    type="checkbox"
                    checked={Boolean(currentSettings.is_muted)}
                    onChange={(e) => onUpdateSetting('is_muted', e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2">
                  <span className="font-semibold text-white block">Probar efectos de sonido</span>
                  <div className="flex gap-2">
                    <button onClick={() => macSound.playPop()} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold cursor-pointer">Pop</button>
                    <button onClick={() => macSound.playClick()} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer">Click</button>
                    <button onClick={() => macSound.playTink()} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer">Tink</button>
                    <button onClick={() => macSound.playTrash()} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer">Trash</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ 6. ALMACENAMIENTO (STORAGE) ═══════════════ */}
          {activeTab === 'storage' && (
            <div className="max-w-2xl space-y-6 text-xs">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">Macintosh HD (512 GB SSD)</h3>
                  <span className="text-emerald-400 font-bold">384 GB disponible</span>
                </div>

                {/* Storage multi-color bar */}
                <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-800 shadow-inner">
                  <div style={{ width: '22%' }} className="bg-blue-500" title="Sistema macOS" />
                  <div style={{ width: '18%' }} className="bg-purple-500" title="Herramientas Developer" />
                  <div style={{ width: '12%' }} className="bg-amber-500" title="Aplicaciones" />
                  <div style={{ width: '8%' }} className="bg-emerald-500" title="Archivos de Usuario" />
                  <div style={{ width: '40%' }} className="bg-slate-700" title="Espacio Libre" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span>Sistema (46.2 GB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-500" />
                    <span>Developer (38.6 GB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-500" />
                    <span>Aplicaciones (24.1 GB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span>Archivos ({storageData?.userStorageMB || '0.8'} MB)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => {
                      macSound.playTrash();
                      alert('Caché del sistema limpiada correctamente (1.2 GB liberados).');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                  >
                    Vaciar caché del sistema
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ 7. GENERAL ═══════════════ */}
          {activeTab === 'general' && (
            <div className="max-w-2xl space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-3xl"></div>
                  <div>
                    <h3 className="text-base font-bold text-white">AppleTree Mac Studio M3 Max</h3>
                    <p className="text-slate-400">Chip Apple M3 Max • Memoria 64 GB • macOS Sequoia 15.2</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Almacenamiento:</span>
                  <span className="font-semibold text-white">512 GB SSD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Número de serie:</span>
                  <span className="font-mono text-white">C02G80XYMD6T</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Entorno de ejecución:</span>
                  <span className="font-semibold text-emerald-400">Isolated VFS POSIX + MySQL 9.3</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ 8. GAME CENTER ═══════════════ */}
          {activeTab === 'gamecenter' && (
            <div className="max-w-2xl space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-2xl shadow">
                    🎮
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Perfil de Game Center</h3>
                    <p className="text-slate-400">Conéctate con amigos y sincroniza récords en la nube</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="font-semibold text-white block">Apodo de jugador</span>
                  <input
                    type="text"
                    defaultValue="AppleTree Pro Gamer"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="font-semibold text-white">Sonidos y efectos en juegos</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 rounded" />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ 9. DEVELOPER SETTINGS ═══════════════ */}
          {activeTab === 'developer' && (
            <div className="max-w-2xl space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white">Herramientas de Desarrollador e IDE</h3>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <span className="font-semibold text-white block">JDK Runtime Primario</span>
                    <span className="text-slate-400">OpenJDK compilador y JVM</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/30">
                    OpenJDK 27.0.1
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <span className="font-semibold text-white block">Monaco Java Language Intelligence</span>
                    <span className="text-slate-400">Autocompletado de miembros e importaciones automáticas</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Activo</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <span className="font-semibold text-white block">MySQL Live Activity Logs (SSE)</span>
                    <span className="text-slate-400">Transmisión de eventos de base de datos en tiempo real</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Conectado</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ FALLBACK FOR OTHER CATEGORIES ═══════════════ */}
          {!['appearance', 'desktopdock', 'wallpaper', 'displays', 'sound', 'storage', 'general', 'gamecenter', 'developer'].includes(activeTab) && (
            <div className="max-w-2xl space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
                    <activeSectionObj.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeSectionObj.name}</h3>
                    <p className="text-slate-400">Configuración gestionada por macOS Sequoia Web Pro</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Estado del servicio:</span>
                    <span className="font-bold text-emerald-400">Activo y optimizado</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Perfil de usuario:</span>
                    <span className="font-semibold text-white">{currentUser?.username || 'Usuario actual'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
