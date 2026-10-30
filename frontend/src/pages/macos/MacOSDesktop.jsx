import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wifi, Battery, Search, Sliders, X, Minus, Maximize2, 
  Terminal, Code2, Trophy, Compass, Folder, FileText, 
  Settings, Calculator, Trash2, ExternalLink, RefreshCw, 
  Volume2, Lock, Play, Copy, Check, Info, 
  GraduationCap, Briefcase, Phone, Sparkles, ChevronRight,
  Monitor, Cpu, HardDrive, ShieldCheck, ArrowLeft, Eye,
  Cloud, Upload, Download, Share2, Plus, 
  Calendar as CalendarIcon, Clock, Layers, FilePlus, FolderPlus,
  PlayCircle, FileCode, CheckCircle2, SplitSquareVertical,
  Terminal as TerminalIcon, AlertCircle, HelpCircle,
  Package, Box, CheckCheck, List, Grid, MoreHorizontal,
  ChevronLeft, ArrowUpRight, Globe, CornerDownLeft, GitBranch,
  PlaySquare, Wrench, FileCheck, Split, BookOpen, Mic
} from 'lucide-react';

// ── Pure Web Audio Sound Synthesizer (Instant native macOS sound effects) ──
class MacAudio {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }
  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }
  playTrash() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }
  playTink() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }
}
const macSound = new MacAudio();

// ── AUTHENTIC REAL macOS SQUIRCLE ICONS (Pixel-Perfect SVG Art) ──

export const MacFinderIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="finderBgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="finderLeftGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#finderBgGrad)" />
    <path d="M5 27 C5 14.85 14.85 5 27 5 L50 5 L50 95 L27 95 C14.85 95 5 85.15 5 73 Z" fill="url(#finderLeftGrad)" />
    <path d="M50 5 L50 95" stroke="#0369a1" strokeWidth="2" opacity="0.6" />
    <circle cx="32" cy="40" r="5" fill="#0f172a" />
    <circle cx="68" cy="40" r="5" fill="#0f172a" />
    <path d="M 27 63 Q 50 84 73 63" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50 40 L 46 54 L 54 54" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MacVSCodeIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="vscBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#vscBg)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <g transform="translate(18, 16) scale(0.64)">
      <path d="M74.9 97.4L98.5 86V14L74.9 2.6c-2.4-1.2-5.3-.9-7.5.7L25.3 35.8 8.8 23.3c-2.1-1.6-5.1-1.6-7.2.1-2.1 1.7-2.6 4.7-1.1 7L17 50 .5 69.6c-1.5 2.3-1 5.3 1.1 7 2.1 1.7 5.1 1.7 7.2.1l16.5-12.5 42.1 32.5c2.2 1.6 5.1 1.9 7.5.7zM77 24.3l10.3 5v41.4l-10.3 5V24.3zm-42 25.7l28-21.7v43.4L35 50z" fill="#007acc"/>
      <path d="M74.9 2.6c-2.4-1.2-5.3-.9-7.5.7L25.3 35.8l9.7 7.5 39.9-30.8V2.6c0-.1 0-.1 0 0z" fill="#0065a9"/>
      <path d="M74.9 97.4c-2.4 1.2-5.3.9-7.5-.7L25.3 64.2l9.7-7.5 39.9 30.8v9.9z" fill="#005085"/>
      <path d="M8.8 23.3c-2.1-1.6-5.1-1.6-7.2.1-2.1 1.7-2.6 4.7-1.1 7L17 50 .5 69.6c-1.5 2.3-1 5.3 1.1 7 2.1 1.7 5.1 1.7 7.2.1l16.5-12.5 4-3.1L21 50l8.3-11.2-4-3L8.8 23.3z" fill="#1f9cf0"/>
    </g>
  </svg>
);

export const MacSafariIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <radialGradient id="safariBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="70%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </radialGradient>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="#f8fafc" />
    <circle cx="50" cy="50" r="38" fill="url(#safariBg)" />
    <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeDasharray="2 4" />
    <g transform="translate(50, 50) rotate(45)">
      <polygon points="0,-28 6,0 0,0 -6,0" fill="#ef4444" />
      <polygon points="0,28 6,0 0,0 -6,0" fill="#ffffff" />
      <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
    </g>
  </svg>
);

export const MacTerminalIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="#18181b" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
    <path d="M5 26 L95 26" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <circle cx="16" cy="15" r="2.5" fill="#ef4444" />
    <circle cx="25" cy="15" r="2.5" fill="#f59e0b" />
    <circle cx="34" cy="15" r="2.5" fill="#10b981" />
    <path d="M 22 45 L 36 55 L 22 65" fill="none" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="42" y="63" width="16" height="4" rx="1" fill="#f8fafc" />
  </svg>
);

export const MacTeraBoxIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="tbBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#tbBg)" />
    <path d="M68 62 H32 C25 62 19 56 19 49 C19 43 23 38 29 37 C31 29 38 23 47 23 C56 23 63 29 66 37 C72 38 77 43 77 49 C77 56 73 62 68 62 Z" fill="#ffffff" />
    <path d="M42 38 H58 M50 38 V54" stroke="#0284c7" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

export const MacKbcIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="kbcBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#kbcBg)" stroke="url(#gold)" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="32" fill="none" stroke="url(#gold)" strokeWidth="3" />
    <circle cx="50" cy="50" r="26" fill="rgba(245, 158, 11, 0.15)" />
    <path d="M40 36 H60 V46 C60 52 56 56 50 56 C44 56 40 52 40 46 Z" fill="url(#gold)" />
    <path d="M47 56 H53 V62 H47 Z M38 62 H62 V65 H38 Z" fill="url(#gold)" />
    <path d="M40 38 H34 C31 38 31 46 35 46 H40 M60 38 H66 C69 38 69 46 65 46 H60" fill="none" stroke="url(#gold)" strokeWidth="2.5" />
  </svg>
);

export const MacSettingsIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="gearBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#71717a" />
        <stop offset="100%" stopColor="#3f3f46" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="#27272a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <circle cx="50" cy="50" r="30" fill="url(#gearBg)" />
    <g transform="translate(50,50)" fill="#71717a">
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
        <rect key={deg} x="-4" y="-34" width="8" height="8" rx="2" transform={`rotate(${deg})`} />
      ))}
    </g>
    <circle cx="50" cy="50" r="14" fill="#18181b" />
  </svg>
);

export const MacNotesIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="#fef08a" />
    <path d="M5 24 L95 24" stroke="#eab308" strokeWidth="6" />
    <line x1="16" y1="38" x2="84" y2="38" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="16" y1="52" x2="84" y2="52" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="16" y1="66" x2="84" y2="66" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="16" y1="80" x2="60" y2="80" stroke="#cbd5e1" strokeWidth="2" />
  </svg>
);

export const MacCalculatorIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="#27272a" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <circle cx="34" cy="36" r="11" fill="#71717a" />
    <circle cx="66" cy="36" r="11" fill="#f97316" />
    <circle cx="34" cy="66" r="11" fill="#52525b" />
    <circle cx="66" cy="66" r="11" fill="#f97316" />
    <text x="34" y="40" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">AC</text>
    <text x="66" y="40" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">÷</text>
    <text x="34" y="71" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">7</text>
    <text x="66" y="71" fill="#ffffff" fontSize="17" fontWeight="bold" textAnchor="middle">=</text>
  </svg>
);

export const MacTrashIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="#3f3f46" opacity="0.3" />
    <g transform="translate(26, 20) scale(0.48)" fill="none" stroke="#e4e4e7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 28 H88 M36 28 V16 C36 12 40 8 44 8 H56 C60 8 64 12 64 16 V28" />
      <path d="M20 28 L28 88 C29 93 33 96 38 96 H62 C67 96 71 93 72 88 L80 28" fill="rgba(255,255,255,0.08)" />
      <line x1="40" y1="44" x2="40" y2="80" />
      <line x1="50" y1="44" x2="50" y2="80" />
      <line x1="60" y1="44" x2="60" y2="80" />
    </g>
  </svg>
);

export const MacFolderIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M10 26 C10 20 14 16 20 16 H38 L46 24 H80 C86 24 90 28 90 34 V74 C90 80 86 84 80 84 H20 C14 84 10 80 10 74 Z" fill="#0284c7" />
    <path d="M10 38 C10 32 14 30 20 30 H80 C86 30 90 32 90 38 V74 C90 80 86 84 80 84 H20 C14 84 10 80 10 74 Z" fill="#38bdf8" />
  </svg>
);

// ── Wallpapers Library (Dark Mode Focused with High-Def Backdrops) ──
const WALLPAPERS = [
  {
    id: 'sequoia-dark',
    name: 'macOS Sequoia Dark Pro',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2850&q=80'
  },
  {
    id: 'cyber-nebula',
    name: 'Deep Space Galaxy',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2850&q=80'
  },
  {
    id: 'monterey-glow',
    name: 'macOS Monterey Dark',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=2850&q=80'
  },
  {
    id: 'nordic-mountains',
    name: 'Alps Aurora Peak',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2850&q=80'
  },
  {
    id: 'cyber-city',
    name: 'Tokyo Cyberpunk Midnight',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2850&q=80'
  },
  {
    id: 'sonoma-sunset',
    name: 'Sonoma Horizon Twilight',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2850&q=80'
  }
];

export default function MacOSDesktop() {
  const navigate = useNavigate();

  // ── Auto Fullscreen Trigger on First User Click ──
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreenMode = () => {
    macSound.playPop();
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // First interaction auto-trigger fullscreen if user enters page
  const handleDesktopCanvasClick = (e) => {
    if (!document.fullscreenElement && !sessionStorage.getItem('dismissed_fs_session')) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      }
    }
  };

  // ── Clock & Calendar State ──
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMacDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dateNum = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day} ${month} ${dateNum}  ${hours}:${minutes} ${ampm}`;
  };

  // ── Virtual File System (Desktop & Finder Persistence) ──
  const [desktopItems, setDesktopItems] = useState(() => {
    const saved = localStorage.getItem('appletree_macos_desktop_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'vault', name: 'Course Vault', type: 'system', icon: 'vault', targetApp: 'finder' },
      { id: 'vscode-icon', name: 'VS Code', type: 'system', icon: 'vscode', targetApp: 'vscode' },
      { id: 'terabox', name: 'TeraBox Cloud', type: 'system', icon: 'terabox', targetApp: 'terabox' },
      { id: 'safari-icon', name: 'Safari', type: 'system', icon: 'safari', targetApp: 'safari' },
      { id: 'projects', name: 'My Projects', type: 'folder', items: [
        { id: 'p1', name: 'App.java', type: 'file', content: 'public class App { public static void main(String[] args) { System.out.println("Java 21 Ready"); } }' },
        { id: 'p2', name: 'main.py', type: 'file', content: 'print("AppleTree Python 3.12 Engine")' }
      ] },
      { id: 'kbc-icon', name: 'KBC Quiz', type: 'system', icon: 'kbc', targetApp: 'kbc' },
      { id: 'terminal-icon', name: 'Terminal', type: 'system', icon: 'terminal', targetApp: 'terminal' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('appletree_macos_desktop_items', JSON.stringify(desktopItems));
  }, [desktopItems]);

  // ── TeraBox Cloud Storage State ──
  const [teraBoxFiles, setTeraBoxFiles] = useState([
    { id: 'tb-1', name: 'Java_FullStack_Roadmap_2026.pdf', size: '2.4 MB', modified: 'Oct 29, 2026', type: 'pdf' },
    { id: 'tb-2', name: 'AWS_DevOps_Projects_Bundle.zip', size: '154.2 MB', modified: 'Oct 30, 2026', type: 'archive' },
    { id: 'tb-3', name: 'Python_AI_Datasets_Collection.tar.gz', size: '320.5 MB', modified: 'Oct 28, 2026', type: 'archive' },
    { id: 'tb-4', name: 'MERN_Enterprise_Ecommerce_Code.zip', size: '48.9 MB', modified: 'Oct 27, 2026', type: 'archive' }
  ]);
  const [teraBoxUsedGB, setTeraBoxUsedGB] = useState(527.8);
  const [teraBoxTotalGB] = useState(1024);
  const [isUploadingTeraBox, setIsUploadingTeraBox] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ── Desktop Controls & Selection ──
  const [contextMenu, setContextMenu] = useState(null);
  const [renamingItemId, setRenamingItemId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [currentWallpaper, setCurrentWallpaper] = useState(WALLPAPERS[0].url);
  const [isLocked, setIsLocked] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [soundVolume, setSoundVolume] = useState(85);
  const [screenBrightness, setScreenBrightness] = useState(100);
  const [dockSize, setDockSize] = useState(52); // px
  const [accentColor, setAccentColor] = useState('blue'); // blue, purple, amber, emerald
  const [bouncingApp, setBouncingApp] = useState(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState('displays');
  const [isSiriOpen, setIsSiriOpen] = useState(false);
  const [siriPrompt, setSiriPrompt] = useState('');
  const [siriResponse, setSiriResponse] = useState('');

  // ── Window Management State ──
  const [highestZ, setHighestZ] = useState(30);
  const [activeAppId, setActiveAppId] = useState('vscode');

  const [windows, setWindows] = useState({
    vscode: {
      id: 'vscode',
      title: 'Visual Studio Code — main.py',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 25,
      x: 70,
      y: 40,
      w: 960,
      h: 600
    },
    safari: {
      id: 'safari',
      title: 'Safari — AppleTree Web Explorer',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 15,
      x: 100,
      y: 45,
      w: 940,
      h: 580
    },
    finder: {
      id: 'finder',
      title: 'Finder — Macintosh HD',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 12,
      x: 60,
      y: 50,
      w: 880,
      h: 540
    },
    terabox: {
      id: 'terabox',
      title: 'TeraBox Cloud Drive (1024 GB Free Storage)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 14,
      x: 120,
      y: 60,
      w: 840,
      h: 540
    },
    terminal: {
      id: 'terminal',
      title: 'Terminal — zsh (JDK 21 + Python 3.12)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 16,
      x: 140,
      y: 90,
      w: 760,
      h: 480
    },
    kbc: {
      id: 'kbc',
      title: 'KBC Quiz Arena — Live Competition',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 18,
      x: 90,
      y: 45,
      w: 900,
      h: 580
    },
    notes: {
      id: 'notes',
      title: 'Notes',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 19,
      x: 220,
      y: 110,
      w: 660,
      h: 480
    },
    calculator: {
      id: 'calculator',
      title: 'Calculator',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 20,
      x: 340,
      y: 130,
      w: 300,
      h: 420
    },
    settings: {
      id: 'settings',
      title: 'System Settings',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 22,
      x: 160,
      y: 55,
      w: 840,
      h: 560
    },
    aboutMac: {
      id: 'aboutMac',
      title: 'About This Mac',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 28,
      x: 290,
      y: 130,
      w: 440,
      h: 380
    }
  });

  const focusWindow = (id) => {
    setHighestZ(prev => {
      const nextZ = prev + 1;
      setWindows(curr => ({
        ...curr,
        [id]: { ...curr[id], zIndex: nextZ, isMinimized: false }
      }));
      return nextZ;
    });
    setActiveAppId(id);
    setActiveMenu(null);
  };

  const openApp = (id) => {
    macSound.playPop();
    setBouncingApp(id);
    setTimeout(() => setBouncingApp(null), 1200);

    setHighestZ(prev => {
      const nextZ = prev + 1;
      setWindows(curr => ({
        ...curr,
        [id]: { ...curr[id], isOpen: true, isMinimized: false, zIndex: nextZ }
      }));
      return nextZ;
    });
    setActiveAppId(id);
    setActiveMenu(null);
  };

  const closeWindow = (id) => {
    macSound.playClick();
    setWindows(curr => ({
      ...curr,
      [id]: { ...curr[id], isOpen: false, isMaximized: false }
    }));
  };

  const minimizeWindow = (id) => {
    macSound.playClick();
    setWindows(curr => ({
      ...curr,
      [id]: { ...curr[id], isMinimized: true }
    }));
  };

  const toggleMaximize = (id) => {
    macSound.playClick();
    setWindows(curr => ({
      ...curr,
      [id]: { ...curr[id], isMaximized: !curr[id].isMaximized }
    }));
    focusWindow(id);
  };

  // ── Drag & Move Window Logic ──
  const dragRef = useRef({ id: null, startX: 0, startY: 0, winX: 0, winY: 0 });

  const handleMouseDownHeader = (e, id) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    focusWindow(id);
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      winX: windows[id].x,
      winY: windows[id].y
    };

    const handleMouseMove = (moveEvent) => {
      if (!dragRef.current.id) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      setWindows(curr => {
        const win = curr[dragRef.current.id];
        if (!win || win.isMaximized) return curr;
        return {
          ...curr,
          [dragRef.current.id]: {
            ...win,
            x: Math.max(0, dragRef.current.winX + dx),
            y: Math.max(26, dragRef.current.winY + dy)
          }
        };
      });
    };

    const handleMouseUp = () => {
      dragRef.current.id = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // ── Folder & File Operations ──
  const createNewFolder = (folderName = 'untitled folder') => {
    macSound.playPop();
    const existing = desktopItems.filter(i => i.name.startsWith(folderName));
    const finalName = existing.length > 0 ? `${folderName} ${existing.length + 1}` : folderName;
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: finalName,
      type: 'folder',
      items: []
    };
    setDesktopItems(prev => [...prev, newFolder]);
    setContextMenu(null);
  };

  const createNewTextFile = (fileName = 'untitled.py') => {
    macSound.playPop();
    const newFile = {
      id: `file-${Date.now()}`,
      name: fileName,
      type: 'file',
      content: '# New file in AppleTree Workspace\nprint("Hello from macOS")\n'
    };
    setDesktopItems(prev => [...prev, newFile]);
    setContextMenu(null);
  };

  const deleteDesktopItem = (id) => {
    macSound.playTrash();
    setDesktopItems(prev => prev.filter(i => i.id !== id));
    setContextMenu(null);
  };

  const handleStartRename = (item) => {
    setRenamingItemId(item.id);
    setRenameValue(item.name);
    setContextMenu(null);
  };

  const handleFinishRename = () => {
    if (renamingItemId && renameValue.trim()) {
      setDesktopItems(prev => prev.map(item => item.id === renamingItemId ? { ...item, name: renameValue.trim() } : item));
    }
    setRenamingItemId(null);
  };

  const handleDesktopContextMenu = (e) => {
    e.preventDefault();
    macSound.playClick();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 300),
      targetId: null
    });
  };

  // ── Keyboard Shortcuts (⌘+Space, ⌃⌘F, Esc) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.code === 'Space')) {
        e.preventDefault();
        setActiveMenu(prev => prev === 'spotlight' ? null : 'spotlight');
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f' && e.ctrlKey) {
        e.preventDefault();
        toggleFullscreenMode();
      }
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setContextMenu(null);
        setIsSiriOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // ── VISUAL STUDIO CODE STATE (JDK 21, Python 3.12, Extensions) ──
  // ═══════════════════════════════════════════════════════════════
  const [vsCodeFiles, setVsCodeFiles] = useState([
    {
      id: 'f-py',
      name: 'main.py',
      folder: 'src',
      lang: 'python',
      content: 
`#  Visual Studio Code on macOS Sequoia (Python 3.12.2)
import sys

def master_tech_career():
    print("🚀 Initializing AppleTree Python & AI Sandbox...")
    print(f"System: macOS Sequoia 15.2 | Python {sys.version.split()[0]}")
    
    tracks = [
        {"role": "Java Full Stack Developer", "package": "₹8-18 LPA", "status": "Active"},
        {"role": "AWS DevOps Cloud Architect", "package": "₹10-22 LPA", "status": "Active"},
        {"role": "Python AI & ML Specialist", "package": "₹12-25 LPA", "status": "Active"},
        {"role": "React & MERN Stack Lead", "package": "₹8-16 LPA", "status": "Active"}
    ]
    for idx, track in enumerate(tracks, start=1):
        print(f"  [{idx}] {track['role']} -> Target: {track['package']}")
    print("\\n✓ Status: 100% Industry Certified & Placement Ready!")

if __name__ == "__main__":
    master_tech_career()
`
    },
    {
      id: 'f-java',
      name: 'App.java',
      folder: 'src',
      lang: 'java',
      content:
`// ☕ OpenJDK 21.0.2 LTS running on AppleTree macOS
public class App {
    public static void main(String[] args) {
        System.out.println("☕ Compiling with OpenJDK 21 LTS (Oracle / RedHat Spec)...");
        System.out.println("Academy: AppleTree Infotech Ghaziabad");
        System.out.println("Modules: Spring Boot 3.3, Microservices, Hibernate ORM, Kafka");
        System.out.println("Status: Java Enterprise Engine Active 🚀");
    }
}`
    },
    {
      id: 'f-js',
      name: 'server.js',
      folder: 'src',
      lang: 'javascript',
      content:
`// Node.js 20 LTS Microservice
const express = {
  get: (path, cb) => cb({ path }, { send: msg => console.log("Response:", msg) })
};

console.log("Starting AppleTree API Service on port 5000...");
express.get("/api/status", (req, res) => {
  res.send("✓ AppleTree Enterprise Server Healthy (Uptime: 99.99%)");
});
`
    },
    {
      id: 'f-html',
      name: 'index.html',
      folder: 'public',
      lang: 'html',
      content:
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AppleTree Infotech Portal</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-slate-900 text-white font-sans">
  <div id="root">
    <h1>AppleTree Infotech Portal</h1>
    <p>Premier Tech Training & Placements in Delhi NCR</p>
  </div>
</body>
</html>`
    },
    {
      id: 'f-css',
      name: 'styles.css',
      folder: 'public',
      lang: 'css',
      content:
`/* AppleTree Theme Stylesheet */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
}
.hero-gradient {
  background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
}`
    },
    {
      id: 'f-md',
      name: 'README.md',
      folder: 'root',
      lang: 'markdown',
      content:
`# AppleTree Developer Workspace
- Pre-installed Runtimes:
  - **OpenJDK 21.0.2 LTS**
  - **Python 3.12.2**
  - **Node.js 20.18.0 LTS**
- Run any file using the green ▶ Run button or in the integrated terminal!
`
    }
  ]);

  const [activeVsCodeFileId, setActiveVsCodeFileId] = useState('f-py');
  const [vsCodeTabs, setVsCodeTabs] = useState(['f-py', 'f-java', 'f-js', 'f-html']);
  const [vsCodeTerminalOutput, setVsCodeTerminalOutput] = useState([
    'developer@appletree-mac-pro ~/workspace % python3 --version',
    'Python 3.12.2',
    'developer@appletree-mac-pro ~/workspace % java -version',
    'openjdk version "21.0.2" 2026-01-16 LTS',
    'OpenJDK Runtime Environment (build 21.0.2+13-LTS)',
    'OpenJDK 64-Bit Server VM (build 21.0.2+13-LTS, mixed mode, sharing)',
    'developer@appletree-mac-pro ~/workspace % python3 main.py',
    '🚀 Initializing AppleTree Python & AI Sandbox...',
    'System: macOS Sequoia 15.2 | Python 3.12.2',
    '  [1] Java Full Stack Developer -> Target: ₹8-18 LPA',
    '  [2] AWS DevOps Cloud Architect -> Target: ₹10-22 LPA',
    '  [3] Python AI & ML Specialist -> Target: ₹12-25 LPA',
    '  [4] React & MERN Stack Lead -> Target: ₹8-16 LPA',
    '',
    '✓ Status: 100% Industry Certified & Placement Ready!'
  ]);
  const [vsCodeTerminalInput, setVsCodeTerminalInput] = useState('');
  const [vsCodeTerminalHistory, setVsCodeTerminalHistory] = useState([]);
  const [vsCodeHistoryIndex, setVsCodeHistoryIndex] = useState(-1);
  const [vsCodeBottomTab, setVsCodeBottomTab] = useState('terminal'); // terminal, output, problems, debug
  const [isVsCodeRunning, setIsVsCodeRunning] = useState(false);
  const [vsCodeActiveSidebar, setVsCodeActiveSidebar] = useState('explorer'); // 'explorer', 'search', 'git', 'run', 'extensions'
  const [vsCodeExtSearch, setVsCodeExtSearch] = useState('');
  const [vsCodeFileSearch, setVsCodeFileSearch] = useState('');
  const [newFileInputName, setNewFileInputName] = useState('');
  const [isCreatingNewFile, setIsCreatingNewFile] = useState(false);
  const [gitCommitMsg, setGitCommitMsg] = useState('');

  // ── VS Code Extensions List (Marketplace) ──
  const [vsCodeExtensions, setVsCodeExtensions] = useState([
    { id: 'ext-py', name: 'Python', publisher: 'Microsoft', version: 'v2026.4', downloads: '124M', desc: 'IntelliSense, Linting, Debugging & Code Formatting (Python 3.12 ready)', installed: true, icon: '🐍' },
    { id: 'ext-java', name: 'Extension Pack for Java', publisher: 'Microsoft', version: 'v1.31', downloads: '48M', desc: 'Java language support, Debugger & Maven projects (OpenJDK 21 LTS ready)', installed: true, icon: '☕' },
    { id: 'ext-pylance', name: 'Pylance', publisher: 'Microsoft', version: 'v2026.2', downloads: '88M', desc: 'Performant Python type analysis and auto-imports', installed: true, icon: '⚡' },
    { id: 'ext-prettier', name: 'Prettier - Code Formatter', publisher: 'Prettier', version: 'v10.4', downloads: '42M', desc: 'Opinionated code formatter for JS, CSS, HTML', installed: true, icon: '✨' },
    { id: 'ext-tailwind', name: 'Tailwind CSS IntelliSense', publisher: 'Tailwind Labs', version: 'v0.12', downloads: '18M', desc: 'Intelligent Tailwind CSS class suggestions', installed: true, icon: '🎨' },
    { id: 'ext-gitlens', name: 'GitLens — Git supercharged', publisher: 'GitKraken', version: 'v14.8', downloads: '32M', desc: 'Supercharge Git inside VS Code', installed: true, icon: '🌿' },
    { id: 'ext-springboot', name: 'Spring Boot Tools', publisher: 'VMware', version: 'v1.54', downloads: '14M', desc: 'Spring Boot application support for Java microservices', installed: true, icon: '🍃' },
    { id: 'ext-copilot', name: 'GitHub Copilot', publisher: 'GitHub', version: 'v1.178', downloads: '25M', desc: 'Your AI pair programmer directly in VS Code', installed: false, icon: '🤖' },
    { id: 'ext-docker', name: 'Docker', publisher: 'Microsoft', version: 'v1.29', downloads: '38M', desc: 'Manage containers, images and registries', installed: false, icon: '🐳' },
    { id: 'ext-eslint', name: 'ESLint', publisher: 'Microsoft', version: 'v2.4', downloads: '36M', desc: 'Integrates ESLint into VS Code', installed: false, icon: '🔍' },
    { id: 'ext-icons', name: 'Material Icon Theme', publisher: 'Philipp Kief', version: 'v5.1', downloads: '28M', desc: 'Material Design Icons for VS Code', installed: true, icon: '📁' }
  ]);

  const activeVsCodeFile = vsCodeFiles.find(f => f.id === activeVsCodeFileId) || vsCodeFiles[0];

  const handleOpenVsCodeTab = (fileId) => {
    macSound.playClick();
    if (!vsCodeTabs.includes(fileId)) {
      setVsCodeTabs(prev => [...prev, fileId]);
    }
    setActiveVsCodeFileId(fileId);
  };

  const handleCloseVsCodeTab = (e, fileId) => {
    e.stopPropagation();
    macSound.playClick();
    const newTabs = vsCodeTabs.filter(id => id !== fileId);
    setVsCodeTabs(newTabs);
    if (activeVsCodeFileId === fileId && newTabs.length > 0) {
      setActiveVsCodeFileId(newTabs[newTabs.length - 1]);
    }
  };

  const handleCreateNewVsCodeFile = (e) => {
    e.preventDefault();
    const name = newFileInputName.trim();
    if (!name) {
      setIsCreatingNewFile(false);
      return;
    }
    const ext = name.split('.').pop().toLowerCase();
    const lang = ext === 'java' ? 'java' : ext === 'py' ? 'python' : ext === 'js' ? 'javascript' : ext === 'html' ? 'html' : ext === 'css' ? 'css' : 'text';
    const newId = `f-${Date.now()}`;
    const newFile = {
      id: newId,
      name,
      folder: 'src',
      lang,
      content: lang === 'java'
        ? `public class ${name.replace('.java', '')} {\n    public static void main(String[] args) {\n        System.out.println("Hello from ${name}");\n    }\n}`
        : lang === 'python'
        ? `# ${name}\nprint("Running ${name} with Python 3.12")\n`
        : `// ${name}\nconsole.log("Hello from ${name}");\n`
    };
    setVsCodeFiles(prev => [...prev, newFile]);
    setVsCodeTabs(prev => [...prev, newId]);
    setActiveVsCodeFileId(newId);
    setNewFileInputName('');
    setIsCreatingNewFile(false);
    macSound.playPop();
  };

  const handleDeleteVsCodeFile = (e, fileId) => {
    e.stopPropagation();
    macSound.playTrash();
    setVsCodeFiles(prev => prev.filter(f => f.id !== fileId));
    setVsCodeTabs(prev => prev.filter(id => id !== fileId));
    if (activeVsCodeFileId === fileId) {
      const remaining = vsCodeFiles.filter(f => f.id !== fileId);
      if (remaining.length > 0) setActiveVsCodeFileId(remaining[0].id);
    }
  };

  const handleRunVsCodeCode = () => {
    macSound.playPop();
    setIsVsCodeRunning(true);
    setVsCodeBottomTab('terminal');

    const cmdRun = activeVsCodeFile.lang === 'java' 
      ? `javac ${activeVsCodeFile.name} && java ${activeVsCodeFile.name.replace('.java', '')}`
      : activeVsCodeFile.lang === 'javascript'
      ? `node ${activeVsCodeFile.name}`
      : `python3 ${activeVsCodeFile.name}`;

    setVsCodeTerminalOutput(prev => [
      ...prev,
      `developer@appletree-mac-pro ~/workspace % ${cmdRun}`,
      '⚡ Compiling with AppleTree Hostinger & Local Sandbox...'
    ]);

    setTimeout(() => {
      setIsVsCodeRunning(false);
      macSound.playPop();
      if (activeVsCodeFile.lang === 'java') {
        setVsCodeTerminalOutput(prev => [
          ...prev,
          '☕ Compiling with OpenJDK 21 LTS (Oracle / RedHat Spec)...',
          'Academy: AppleTree Infotech Ghaziabad',
          'Modules: Spring Boot 3.3, Microservices, Hibernate ORM, Kafka',
          'Status: Java Enterprise Engine Active 🚀',
          '[Process exited with code 0]'
        ]);
      } else if (activeVsCodeFile.lang === 'python') {
        setVsCodeTerminalOutput(prev => [
          ...prev,
          '🚀 Initializing AppleTree Python & AI Sandbox...',
          'System: macOS Sequoia 15.2 | Python 3.12.2',
          '  [1] Java Full Stack Developer -> Target: ₹8-18 LPA',
          '  [2] AWS DevOps Cloud Architect -> Target: ₹10-22 LPA',
          '  [3] Python AI & ML Specialist -> Target: ₹12-25 LPA',
          '  [4] React & MERN Stack Lead -> Target: ₹8-16 LPA',
          '',
          '✓ Status: 100% Industry Certified & Placement Ready!',
          '[Process exited with code 0]'
        ]);
      } else {
        setVsCodeTerminalOutput(prev => [
          ...prev,
          'Starting AppleTree API Service on port 5000...',
          'Response: ✓ AppleTree Enterprise Server Healthy (Uptime: 99.99%)',
          '[Process exited with code 0]'
        ]);
      }
    }, 500);
  };

  const handleVsCodeTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = vsCodeTerminalInput.trim();
    if (!cmd) return;
    setVsCodeTerminalHistory(prev => [...prev, cmd]);
    setVsCodeHistoryIndex(-1);

    const lower = cmd.toLowerCase();
    let res = '';

    if (lower === 'clear') {
      setVsCodeTerminalOutput([]);
      setVsCodeTerminalInput('');
      return;
    } else if (lower.includes('java -version')) {
      res = `openjdk version "21.0.2" 2026-01-16 LTS
OpenJDK Runtime Environment (build 21.0.2+13-LTS)
OpenJDK 64-Bit Server VM (build 21.0.2+13-LTS, mixed mode, sharing)`;
    } else if (lower.includes('python --version') || lower.includes('python3 --version')) {
      res = 'Python 3.12.2';
    } else if (lower.includes('node -v')) {
      res = 'v20.18.0 LTS';
    } else if (lower.includes('git status')) {
      res = `On branch main
Your branch is up to date with 'origin/main'.
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   src/main.py
	modified:   src/App.java`;
    } else if (lower.startsWith('pip install')) {
      const pkg = cmd.replace(/pip install/i, '').trim();
      res = `Collecting ${pkg || 'package'}
  Downloading ${pkg || 'package'}-2.4.1-py3-none-any.whl (1.2 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1.2/1.2 MB 18.4 MB/s eta 0:00:00
Installing collected packages: ${pkg || 'package'}
Successfully installed ${pkg || 'package'}-2.4.1`;
    } else if (lower.includes('pip list')) {
      res = `Package            Version
------------------ ---------
pip                24.0
numpy              1.26.4
pandas             2.2.1
requests           2.31.0
fastapi            0.110.0
torch              2.2.1
spring-boot-starter 3.3.0`;
    } else if (lower.startsWith('python') || lower.startsWith('python3')) {
      res = `🚀 Initializing AppleTree Python & AI Sandbox...
System: macOS Sequoia 15.2 | Python 3.12.2
Execution completed successfully [Code: 0]`;
    } else if (lower.startsWith('javac') || lower.startsWith('java')) {
      res = `☕ OpenJDK 21.0.2 LTS Execution Complete.
Class App compiled without errors. Spring Boot 3.3 runtime verified.`;
    } else if (lower === 'ls' || lower === 'dir') {
      res = vsCodeFiles.map(f => f.name).join('   ');
    } else if (lower.startsWith('cat ')) {
      const fn = cmd.replace(/^cat /i, '').trim();
      const target = vsCodeFiles.find(f => f.name.toLowerCase() === fn.toLowerCase());
      res = target ? target.content : `cat: ${fn}: No such file or directory`;
    } else if (lower === 'help') {
      res = `Available Commands:
  python3 <file>    Run Python 3.12 file
  javac <file>      Compile Java 21 file
  java -version     Display OpenJDK 21 LTS spec
  python --version  Display Python version
  node -v           Display Node.js runtime
  pip install <pkg> Install Python package
  pip list          List installed packages
  ls                List workspace files
  cat <file>        Print file content
  clear             Clear terminal screen`;
    } else {
      res = `[developer@appletree-mac-pro: ${cmd} executed successfully]`;
    }

    setVsCodeTerminalOutput(prev => [
      ...prev,
      `developer@appletree-mac-pro ~/workspace % ${cmd}`,
      res
    ]);
    setVsCodeTerminalInput('');
  };

  // ═══════════════════════════════════════════════════════════════
  // ── REAL SAFARI BROWSER (SEARCH ENGINE & WEB PAGES) ──
  // ═══════════════════════════════════════════════════════════════
  const [safariTabs, setSafariTabs] = useState([
    { id: 'tab-1', title: 'Google Search: Python Docs', query: 'python list methods', url: 'search:python list methods', mode: 'search' },
    { id: 'tab-2', title: 'AppleTree Infotech Programs', query: '', url: 'https://programmingwala.com/programs', mode: 'webpage' }
  ]);
  const [activeSafariTabId, setActiveSafariTabId] = useState('tab-1');
  const [safariInput, setSafariInput] = useState('python list methods');

  const activeSafariTab = safariTabs.find(t => t.id === activeSafariTabId) || safariTabs[0];

  const handleOpenSafariNewTab = () => {
    macSound.playPop();
    const newId = `tab-${Date.now()}`;
    const newTab = {
      id: newId,
      title: 'New Tab',
      query: '',
      url: 'search:apple developer',
      mode: 'search'
    };
    setSafariTabs(prev => [...prev, newTab]);
    setActiveSafariTabId(newId);
    setSafariInput('');
  };

  const handleCloseSafariTab = (e, tabId) => {
    e.stopPropagation();
    macSound.playClick();
    if (safariTabs.length <= 1) return;
    const remaining = safariTabs.filter(t => t.id !== tabId);
    setSafariTabs(remaining);
    if (activeSafariTabId === tabId) {
      setActiveSafariTabId(remaining[remaining.length - 1].id);
      setSafariInput(remaining[remaining.length - 1].query || remaining[remaining.length - 1].url);
    }
  };

  const executeSafariSearch = (e) => {
    if (e) e.preventDefault();
    macSound.playClick();
    const q = safariInput.trim();
    if (!q) return;

    const isUrl = q.startsWith('http') || q.includes('.com') || q.includes('.org') || q.includes('.edu') || q.includes('.io') || q.includes('localhost');
    
    setSafariTabs(prev => prev.map(tab => {
      if (tab.id === activeSafariTabId) {
        return {
          ...tab,
          title: isUrl ? q.replace(/https?:\/\//, '') : `${q} - Google Search`,
          query: isUrl ? '' : q,
          url: isUrl ? (q.startsWith('http') ? q : `https://${q}`) : `search:${q}`,
          mode: isUrl ? 'webpage' : 'search'
        };
      }
      return tab;
    }));
  };

  // ── Terminal Window State ──
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'sys', text: ' AppleTree macOS Sequoia [Version 15.2.0 (Build 24C101)]' },
    { type: 'sys', text: 'OpenJDK 21 LTS & Python 3.12 pre-installed. Type "help" or "vscode" to begin.' },
    { type: 'input', cmd: 'neofetch', output: '' },
    { type: 'output', text: `
                 OS: macOS Sequoia 15.2 (Dark Edition)
             Host: AppleTree Mac Studio (M3 Max 16-Core)
           Kernel: Darwin 24.2.0
         Shell: zsh 5.9 (x86_64-apple-darwin24.0)
           Java: OpenJDK 21.0.2 LTS
             Python: Python 3.12.2
                 TeraBox: 527.8 GB / 1024 GB (Active Sync)` }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef(null);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    macSound.playClick();
    const newItems = [{ type: 'input', cmd }];

    const lower = cmd.toLowerCase();
    if (lower === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (lower === 'help') {
      newItems.push({
        type: 'output',
        text: 'Commands: neofetch, ls, python3, java -version, vscode, safari, terabox, clear, exit'
      });
    } else if (lower === 'vscode' || lower === 'code') {
      openApp('vscode');
      newItems.push({ type: 'output', text: 'Opening Visual Studio Code with JDK 21 and Python 3.12...' });
    } else if (lower === 'safari') {
      openApp('safari');
      newItems.push({ type: 'output', text: 'Launching Safari Browser...' });
    } else if (lower === 'terabox') {
      openApp('terabox');
      newItems.push({ type: 'output', text: 'Opening TeraBox Cloud (1024 GB)...' });
    } else if (lower.includes('java -version')) {
      newItems.push({
        type: 'output',
        text: `openjdk version "21.0.2" 2026-01-16 LTS\nOpenJDK Runtime Environment (build 21.0.2+13-LTS)\nOpenJDK 64-Bit Server VM (build 21.0.2+13-LTS, mixed mode, sharing)`
      });
    } else if (lower.includes('python --version') || lower.includes('python3 --version')) {
      newItems.push({ type: 'output', text: 'Python 3.12.2' });
    } else if (lower === 'ls') {
      newItems.push({
        type: 'output',
        text: 'Desktop/   Documents/   Downloads/   Applications/   TeraBox-Cloud/   workspace/'
      });
    } else {
      newItems.push({ type: 'output', text: `zsh: command executed: ${cmd}` });
    }

    setTerminalHistory(prev => [...prev, ...newItems]);
    setTerminalInput('');
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // ── Notes State ──
  const [notesContent, setNotesContent] = useState(
    ' AppleTree macOS Developer Notes\n- Java 21 LTS Features: Virtual Threads, Pattern Matching\n- Python 3.12: Faster CPython, Type Parameter Syntax\n- TeraBox Cloud: 1024 GB free high-speed backup active'
  );

  // ── Calculator State ──
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState(null);
  const [calcOp, setCalcOp] = useState(null);

  const handleCalcNumber = (num) => {
    macSound.playClick();
    setCalcDisplay(prev => prev === '0' ? String(num) : prev + num);
  };

  const handleCalcOp = (op) => {
    macSound.playClick();
    setCalcPrev(parseFloat(calcDisplay));
    setCalcOp(op);
    setCalcDisplay('0');
  };

  const handleCalcEquals = () => {
    macSound.playPop();
    if (calcPrev === null || !calcOp) return;
    const cur = parseFloat(calcDisplay);
    let res = 0;
    if (calcOp === '+') res = calcPrev + cur;
    if (calcOp === '-') res = calcPrev - cur;
    if (calcOp === '×') res = calcPrev * cur;
    if (calcOp === '÷') res = cur !== 0 ? calcPrev / cur : 'Error';
    setCalcDisplay(String(res));
    setCalcPrev(null);
    setCalcOp(null);
  };

  // ── Siri Simulation ──
  const handleAskSiri = (e) => {
    if (e) e.preventDefault();
    if (!siriPrompt.trim()) return;
    macSound.playPop();
    const q = siriPrompt.toLowerCase();
    let reply = '';
    if (q.includes('weather')) {
      reply = 'It is currently 24°C and clear in Ghaziabad with excellent air conditions.';
    } else if (q.includes('python')) {
      reply = 'Python 3.12.2 is pre-installed in your macOS system with pip 24.0 ready in VS Code.';
    } else if (q.includes('java')) {
      reply = 'OpenJDK 21.0.2 LTS is configured as your primary Java Development Kit with Spring Boot support.';
    } else if (q.includes('terabox')) {
      reply = 'TeraBox Cloud Drive has 527.8 GB used of 1024 GB free cloud storage.';
    } else {
      reply = `Here is what I found for "${siriPrompt}": AppleTree Infotech provides elite industry courses with 100% placement support.`;
    }
    setSiriResponse(reply);
  };

  return (
    <div 
      onClick={handleDesktopCanvasClick}
      className="fixed inset-0 w-screen h-screen overflow-hidden select-none bg-black text-white font-sans transition-all duration-300"
      onContextMenu={handleDesktopContextMenu}
      style={{
        filter: `brightness(${screenBrightness}%)`,
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%), url('${currentWallpaper}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* ════════════════ TOP MENU BAR (AUTHENTIC macOS TRANSLUCENT) ════════════════ */}
      <header className="h-7 w-full fixed top-0 left-0 z-[99999] px-3.5 backdrop-blur-3xl bg-black/45 border-b border-white/10 flex items-center justify-between text-xs text-white/90 shadow-sm select-none">
        <div className="flex items-center gap-3.5">
          {/* Apple Logo Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'apple' ? null : 'apple')}
              className="font-bold text-sm hover:opacity-75 transition-opacity px-1 flex items-center cursor-pointer"
            >
              
            </button>

            {activeMenu === 'apple' && (
              <div className="absolute top-7 left-0 w-60 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-white/15 p-1.5 shadow-2xl z-50 text-slate-200 text-xs animate-in fade-in duration-100">
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
                  onClick={() => { openApp('vscode'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-sky-400"
                >
                  <span className="flex items-center gap-1.5 font-semibold">Visual Studio Code</span>
                  <span className="text-[10px] bg-sky-500/30 px-1 rounded text-sky-200">JDK+PY</span>
                </button>
                <button 
                  onClick={() => { openApp('safari'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Safari Browser</span>
                  <Compass className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => { openApp('terabox'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-sky-300"
                >
                  <span>TeraBox Cloud (1024 GB)</span>
                  <Cloud className="w-3.5 h-3.5" />
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={toggleFullscreenMode}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-emerald-400 font-semibold"
                >
                  <span>{isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}</span>
                  <span className="text-[10px] text-white/40">⌃⌘F</span>
                </button>
                <button 
                  onClick={() => { setIsLocked(true); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Lock Screen</span>
                  <Lock className="w-3.5 h-3.5 opacity-60" />
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={() => navigate('/')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white flex items-center justify-between font-bold text-amber-300 hover:text-white cursor-pointer"
                >
                  <span>Exit to AppleTree Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <span className="font-extrabold tracking-tight capitalize text-white">
            {activeAppId === 'vscode' ? 'Code' : activeAppId === 'safari' ? 'Safari' : activeAppId === 'finder' ? 'Finder' : activeAppId === 'settings' ? 'Settings' : activeAppId === 'terminal' ? 'Terminal' : 'macOS'}
          </span>

          {/* Contextual App Menu Items */}
          {activeAppId === 'vscode' ? (
            <div className="hidden sm:flex items-center gap-3 text-white/80 text-[11px]">
              <button onClick={() => { setIsCreatingNewFile(true); openApp('vscode'); }} className="hover:text-white transition cursor-pointer font-medium">New File</button>
              <button onClick={() => handleRunVsCodeCode()} className="hover:text-emerald-400 text-emerald-300 transition cursor-pointer font-bold flex items-center gap-1">▶ Run Code</button>
              <button onClick={() => { setVsCodeActiveSidebar('extensions'); openApp('vscode'); }} className="hover:text-white transition cursor-pointer">Extensions</button>
              <button onClick={() => { setVsCodeBottomTab('terminal'); openApp('vscode'); }} className="hover:text-white transition cursor-pointer">Terminal</button>
            </div>
          ) : activeAppId === 'safari' ? (
            <div className="hidden sm:flex items-center gap-3 text-white/80 text-[11px]">
              <button onClick={() => handleOpenSafariNewTab()} className="hover:text-white transition cursor-pointer font-medium">+ New Tab</button>
              <button onClick={() => { setSafariInput('https://google.com'); executeSafariSearch(); }} className="hover:text-white transition cursor-pointer">Google</button>
              <button onClick={() => { setSafariInput('python list methods'); executeSafariSearch(); }} className="hover:text-white transition cursor-pointer">Python Docs</button>
              <button onClick={() => openApp('vscode')} className="hover:text-sky-300 transition cursor-pointer">Code in VS Code</button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3 text-white/80 text-[11px]">
              <button onClick={() => openApp('vscode')} className="hover:text-white transition cursor-pointer">File</button>
              <button onClick={() => openApp('vscode')} className="hover:text-white transition cursor-pointer">Edit</button>
              <button onClick={() => openApp('safari')} className="hover:text-white transition cursor-pointer">Search</button>
              <button onClick={() => openApp('terminal')} className="hover:text-white transition cursor-pointer">Terminal</button>
              <button onClick={() => openApp('aboutMac')} className="hover:text-white transition cursor-pointer">Help</button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Fullscreen Quick Button */}
          <button
            onClick={toggleFullscreenMode}
            className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-bold text-emerald-300 hover:text-white transition cursor-pointer"
            title="Toggle Fullscreen macOS Mode (⌃⌘F)"
          >
            <Maximize2 className="w-3 h-3" />
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-bold text-amber-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Web Mode</span>
          </Link>

          <div className="flex items-center gap-1 opacity-90 text-[11px]">
            <span>100%</span>
            <Battery className="w-4 h-4 text-emerald-400 rotate-90" />
          </div>

          <Wifi className="w-3.5 h-3.5 text-white/90" />

          {/* Siri Quick Button */}
          <button
            onClick={() => setIsSiriOpen(prev => !prev)}
            className="p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Ask Siri"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveMenu(activeMenu === 'spotlight' ? null : 'spotlight')}
            className="hover:opacity-75 transition-opacity cursor-pointer p-0.5"
            title="Spotlight Search (Cmd+Space)"
          >
            <Search className="w-3.5 h-3.5 text-white/90" />
          </button>

          {/* Control Center Toggle */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'controlCenter' ? null : 'controlCenter')}
              className="hover:opacity-75 transition-opacity cursor-pointer p-0.5"
              title="Control Center"
            >
              <Sliders className="w-3.5 h-3.5 text-white/90" />
            </button>

            {activeMenu === 'controlCenter' && (
              <div className="absolute top-7 right-0 w-72 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-white/15 p-3.5 shadow-2xl z-50 text-slate-100 text-xs animate-in fade-in duration-150 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-blue-400" /> Control Center</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">● macOS Dark Pro</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="font-bold text-[11px]">Wi-Fi</p>
                      <p className="text-[9px] text-white/60">AppleTree-5G</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-400/30 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <div>
                      <p className="font-bold text-[11px] text-indigo-200">Dark Mode</p>
                      <p className="text-[9px] text-indigo-300/80">Always On</p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span>Display Brightness</span>
                    <span>{screenBrightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={screenBrightness}
                    onChange={(e) => setScreenBrightness(e.target.value)}
                    className="w-full accent-blue-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span>Sound Volume</span>
                    <span>{soundVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(e.target.value)}
                    className="w-full accent-blue-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveMenu(activeMenu === 'calendar' ? null : 'calendar')}
            className="font-semibold text-white/95 tracking-wide text-[11px] hover:opacity-80 transition cursor-pointer"
          >
            {formatMacDate(currentTime)}
          </button>
        </div>
      </header>

      {/* ════════════════ SPOTLIGHT SEARCH (Cmd+Space / Ctrl+K) ════════════════ */}
      {activeMenu === 'spotlight' && (
        <div 
          className="fixed inset-0 z-[99990] flex items-start justify-center pt-24 bg-black/55 backdrop-blur-md"
          onClick={() => setActiveMenu(null)}
        >
          <div 
            className="w-full max-w-lg rounded-2xl backdrop-blur-3xl bg-slate-900/95 border border-white/20 shadow-2xl p-3 text-white animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
              <Search className="w-5 h-5 text-blue-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Spotlight Search: Launch apps, search Google in Safari, or run code..."
                value={spotlightQuery}
                onChange={(e) => setSpotlightQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && spotlightQuery.trim()) {
                    macSound.playPop();
                    const q = spotlightQuery.toLowerCase();
                    if (q.includes('code') || q.includes('vs')) openApp('vscode');
                    else if (q.includes('safari') || q.includes('web') || q.includes('google')) {
                      setSafariInput(spotlightQuery);
                      openApp('safari');
                    } else if (q.includes('terminal')) openApp('terminal');
                    else if (q.includes('terabox')) openApp('terabox');
                    else if (q.includes('kbc')) openApp('kbc');
                    else {
                      setSafariInput(spotlightQuery);
                      openApp('safari');
                    }
                    setActiveMenu(null);
                  }
                }}
                className="w-full bg-transparent text-white placeholder-white/40 text-sm outline-none font-medium"
              />
            </div>
            <div className="p-2 space-y-1 text-xs">
              <div onClick={() => { openApp('vscode'); setActiveMenu(null); }} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition cursor-pointer">
                <div className="w-5 h-5"><MacVSCodeIcon /></div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Visual Studio Code</p>
                  <p className="text-[10px] text-white/50">Run Python 3.12 & OpenJDK 21 LTS Code</p>
                </div>
                <span className="text-[10px] text-white/40">App</span>
              </div>
              <div onClick={() => { openApp('safari'); setActiveMenu(null); }} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition cursor-pointer">
                <div className="w-5 h-5"><MacSafariIcon /></div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Safari Browser</p>
                  <p className="text-[10px] text-white/50">Google Search Engine & Web Navigation</p>
                </div>
                <span className="text-[10px] text-white/40">App</span>
              </div>
              <div onClick={() => { openApp('terabox'); setActiveMenu(null); }} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition cursor-pointer">
                <div className="w-5 h-5"><MacTeraBoxIcon /></div>
                <div className="flex-1">
                  <p className="font-semibold text-white">TeraBox Cloud (1024 GB)</p>
                  <p className="text-[10px] text-white/50">Free Cloud Storage Attached</p>
                </div>
                <span className="text-[10px] text-white/40">App</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ SIRI VOICE ORB OVERLAY ════════════════ */}
      {isSiriOpen && (
        <div 
          className="fixed inset-0 z-[99992] flex items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={() => setIsSiriOpen(false)}
        >
          <div 
            className="w-full max-w-md rounded-3xl backdrop-blur-3xl bg-slate-900/95 border border-white/20 p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-400 flex items-center justify-center p-1 animate-pulse shadow-xl shadow-fuchsia-500/20">
              <div className="w-full h-full rounded-full bg-black/40 flex items-center justify-center">
                <Mic className="w-8 h-8 text-white drop-shadow" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Siri on macOS</h3>
              <p className="text-xs text-slate-400">Ask about programming runtimes, weather, or launch apps</p>
            </div>

            <form onSubmit={handleAskSiri} className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Ask Siri: e.g. 'What is the Python version?'"
                value={siriPrompt}
                onChange={e => setSiriPrompt(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white outline-none"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer">
                Ask
              </button>
            </form>

            {siriResponse && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left text-xs text-slate-200 leading-relaxed animate-in fade-in">
                {siriResponse}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════ DESKTOP ICONS GRID ════════════════ */}
      <main className="absolute top-10 right-4 flex flex-col gap-5 items-end z-10 pointer-events-auto select-none">
        {desktopItems.map(item => {
          return (
            <div
              key={item.id}
              onDoubleClick={() => {
                if (item.targetApp) openApp(item.targetApp);
                else if (item.type === 'folder') openApp('finder');
                else if (item.type === 'file') openApp('vscode');
              }}
              onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
                macSound.playClick();
                setContextMenu({
                  x: Math.min(e.clientX, window.innerWidth - 220),
                  y: Math.min(e.clientY, window.innerHeight - 280),
                  targetId: item.id
                });
              }}
              className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/15 border border-transparent hover:border-white/20 transition-all duration-150 cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center drop-shadow-2xl">
                {item.icon === 'vscode' ? <MacVSCodeIcon /> :
                 item.icon === 'safari' ? <MacSafariIcon /> :
                 item.icon === 'terabox' ? <MacTeraBoxIcon /> :
                 item.icon === 'terminal' ? <MacTerminalIcon /> :
                 item.icon === 'kbc' ? <MacKbcIcon /> :
                 item.type === 'folder' ? <MacFolderIcon /> :
                 <FileText className="w-10 h-10 text-sky-400" />}
              </div>

              {renamingItemId === item.id ? (
                <input
                  type="text"
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleFinishRename}
                  onKeyDown={(e) => e.key === 'Enter' && handleFinishRename()}
                  className="mt-1 text-[11px] text-center bg-blue-600 text-white rounded px-1 outline-none w-full"
                />
              ) : (
                <span className="mt-1 text-[11px] text-white font-medium text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate w-full group-hover:text-sky-300">
                  {item.name}
                </span>
              )}
            </div>
          );
        })}
      </main>

      {/* ════════════════ DESKTOP & FILE CONTEXT MENU ════════════════ */}
      {contextMenu && (
        <div 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-[99995] w-56 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-white/15 p-1.5 shadow-2xl text-slate-200 text-xs select-none animate-in fade-in duration-100"
          onClick={() => setContextMenu(null)}
        >
          {contextMenu.targetId ? (
            <>
              <button 
                onClick={() => {
                  const item = desktopItems.find(i => i.id === contextMenu.targetId);
                  if (item?.targetApp) openApp(item.targetApp);
                  else if (item?.type === 'folder') openApp('finder');
                  else openApp('vscode');
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer font-semibold"
              >
                <span>Open</span>
                <span className="text-[10px] text-white/40">⌘O</span>
              </button>
              <button 
                onClick={() => openApp('vscode')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-sky-400"
              >
                <span>Open with VS Code</span>
                <Code2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  const itm = desktopItems.find(i => i.id === contextMenu.targetId);
                  if (itm) handleStartRename(itm);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Rename</span>
                <span className="text-[10px] text-white/40">↵</span>
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button 
                onClick={() => deleteDesktopItem(contextMenu.targetId)}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white flex items-center justify-between cursor-pointer text-rose-400 font-semibold"
              >
                <span>Move to Trash</span>
                <span className="text-[10px] text-white/40">⌘⌫</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => createNewFolder()}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer font-semibold"
              >
                <span>New Folder</span>
                <span className="text-[10px] text-white/40">⌥⌘N</span>
              </button>
              <button 
                onClick={() => createNewTextFile('main.py')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-sky-400"
              >
                <span>New Python Script (.py)</span>
                <FileCode className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => createNewTextFile('App.java')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-amber-300"
              >
                <span>New Java Class (.java)</span>
                <FileCode className="w-3.5 h-3.5" />
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button 
                onClick={() => openApp('vscode')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Open in VS Code</span>
                <Code2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => openApp('terminal')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Open in Terminal</span>
                <TerminalIcon className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => { openApp('settings'); setActiveSettingsTab('displays'); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
              >
                <span>Change Wallpaper...</span>
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button 
                onClick={toggleFullscreenMode}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-emerald-400"
              >
                <span>{isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}</span>
                <span className="text-[10px] text-white/40">⌃⌘F</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* ════════════════ WINDOWS ECOSYSTEM ════════════════ */}

      {/* ── 1. VISUAL STUDIO CODE (AUTHENTIC WORKING IDE WITH EXTENSIONS & RUNNERS) ── */}
      {windows.vscode.isOpen && !windows.vscode.isMinimized && (
        <div
          onClick={() => focusWindow('vscode')}
          style={{
            zIndex: windows.vscode.zIndex,
            left: windows.vscode.isMaximized ? 0 : windows.vscode.x,
            top: windows.vscode.isMaximized ? 26 : windows.vscode.y,
            width: windows.vscode.isMaximized ? '100vw' : windows.vscode.w,
            height: windows.vscode.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.vscode.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-[#1e1e1e]/98 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-150 ${activeAppId === 'vscode' ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          {/* VS Code Title Bar */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'vscode')}
            className="h-10 px-4 bg-[#252526] border-b border-[#1e1e1e] flex items-center justify-between cursor-move shrink-0 select-none"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('vscode')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer hover:opacity-80" />
              <button onClick={() => minimizeWindow('vscode')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer hover:opacity-80" />
              <button onClick={() => toggleMaximize('vscode')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer hover:opacity-80" />
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#cccccc] font-sans">
              <div className="w-3.5 h-3.5"><MacVSCodeIcon /></div>
              <span>{activeVsCodeFile.name} — AppleTree Workspace [macOS Dark Pro]</span>
            </div>

            {/* Run Button in Header */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunVsCodeCode}
                disabled={isVsCodeRunning}
                className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                title={`Run ${activeVsCodeFile.name} with ${activeVsCodeFile.lang === 'java' ? 'OpenJDK 21 LTS' : 'Python 3.12.2'}`}
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{isVsCodeRunning ? 'Running...' : `Run ${activeVsCodeFile.lang === 'java' ? 'Java 21' : activeVsCodeFile.lang === 'python' ? 'Python' : 'Code'}`}</span>
              </button>
            </div>
          </div>

          {/* VS Code Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Activity Bar (Icons) */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-2.5 gap-4 shrink-0 text-[#858585] select-none border-r border-[#252526]">
              <button 
                onClick={() => setVsCodeActiveSidebar(vsCodeActiveSidebar === 'explorer' ? null : 'explorer')}
                className={`p-2 rounded hover:text-white transition cursor-pointer relative ${vsCodeActiveSidebar === 'explorer' ? 'text-white border-l-2 border-[#007acc] pl-1.5' : ''}`}
                title="Explorer (Files)"
              >
                <Layers className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setVsCodeActiveSidebar(vsCodeActiveSidebar === 'search' ? null : 'search')}
                className={`p-2 rounded hover:text-white transition cursor-pointer ${vsCodeActiveSidebar === 'search' ? 'text-white border-l-2 border-[#007acc] pl-1.5' : ''}`}
                title="Search across workspace"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setVsCodeActiveSidebar(vsCodeActiveSidebar === 'git' ? null : 'git')}
                className={`p-2 rounded hover:text-white transition cursor-pointer relative ${vsCodeActiveSidebar === 'git' ? 'text-white border-l-2 border-[#007acc] pl-1.5' : ''}`}
                title="Source Control (Git)"
              >
                <GitBranch className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#007acc]" />
              </button>
              <button 
                onClick={() => handleRunVsCodeCode()}
                className="p-2 rounded hover:text-emerald-400 text-emerald-500 transition cursor-pointer"
                title="Run & Debug"
              >
                <PlaySquare className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setVsCodeActiveSidebar(vsCodeActiveSidebar === 'extensions' ? null : 'extensions')}
                className={`p-2 rounded hover:text-white transition cursor-pointer relative ${vsCodeActiveSidebar === 'extensions' ? 'text-white border-l-2 border-[#007acc] pl-1.5' : ''}`}
                title="Extensions Marketplace"
              >
                <Box className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 px-1 rounded-full bg-[#007acc] text-white text-[9px] font-bold">
                  {vsCodeExtensions.filter(e => e.installed).length}
                </span>
              </button>
              <div className="flex-1" />
              <button 
                onClick={() => { openApp('settings'); }}
                className="p-2 rounded hover:text-white transition cursor-pointer"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar View (Explorer / Extensions / Git / Search) */}
            {vsCodeActiveSidebar && (
              <div className="w-56 bg-[#252526] border-r border-[#1e1e1e] flex flex-col shrink-0 overflow-hidden font-sans">
                {vsCodeActiveSidebar === 'explorer' && (
                  <>
                    <div className="h-9 px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] border-b border-[#1e1e1e]">
                      <span>Explorer: WORKSPACE</span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setIsCreatingNewFile(true)}
                          className="hover:text-white p-0.5 rounded cursor-pointer"
                          title="New File..."
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => macSound.playPop()}
                          className="hover:text-white p-0.5 rounded cursor-pointer"
                          title="Refresh"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {isCreatingNewFile && (
                      <form onSubmit={handleCreateNewVsCodeFile} className="p-2 bg-[#1e1e1e] border-b border-[#333333]">
                        <input
                          type="text"
                          autoFocus
                          placeholder="filename.py or filename.java"
                          value={newFileInputName}
                          onChange={(e) => setNewFileInputName(e.target.value)}
                          onBlur={() => { if (!newFileInputName) setIsCreatingNewFile(false); }}
                          className="w-full bg-black/60 border border-[#007acc] rounded px-2 py-1 text-xs text-white outline-none font-mono"
                        />
                      </form>
                    )}

                    <div className="p-2 space-y-1 overflow-y-auto flex-1 font-mono text-xs">
                      <div className="text-[10px] text-slate-400 font-sans font-bold px-1.5 uppercase flex items-center gap-1">
                        <span>▼</span> <span>src</span>
                      </div>
                      {vsCodeFiles.map(file => (
                        <div
                          key={file.id}
                          onClick={() => handleOpenVsCodeTab(file.id)}
                          className={`group px-2.5 py-1.5 rounded flex items-center justify-between cursor-pointer transition select-none ${
                            activeVsCodeFileId === file.id ? 'bg-[#37373d] text-white font-bold' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span>{file.name.endsWith('.java') ? '☕' : file.name.endsWith('.py') ? '🐍' : file.name.endsWith('.html') ? '🌐' : '📄'}</span>
                            <span className="truncate">{file.name}</span>
                          </span>
                          <button
                            onClick={(e) => handleDeleteVsCodeFile(e, file.id)}
                            className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 transition"
                            title="Delete file"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {vsCodeActiveSidebar === 'extensions' && (
                  <>
                    <div className="h-9 px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] border-b border-[#1e1e1e]">
                      <span>Extensions: Marketplace</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">100% Free</span>
                    </div>

                    <div className="p-2 border-b border-[#1e1e1e]">
                      <input
                        type="text"
                        placeholder="Search Extensions..."
                        value={vsCodeExtSearch}
                        onChange={(e) => setVsCodeExtSearch(e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-[#333333] rounded px-2 py-1 text-xs text-white placeholder-slate-500 outline-none"
                      />
                    </div>

                    <div className="p-2 space-y-2 overflow-y-auto flex-1 text-xs">
                      {vsCodeExtensions
                        .filter(ext => !vsCodeExtSearch || ext.name.toLowerCase().includes(vsCodeExtSearch.toLowerCase()) || ext.desc.toLowerCase().includes(vsCodeExtSearch.toLowerCase()))
                        .map(ext => (
                          <div key={ext.id} className="p-2.5 rounded bg-black/40 border border-white/5 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white flex items-center gap-1.5">{ext.icon} {ext.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{ext.downloads}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-snug">{ext.desc}</p>
                            <div className="pt-1.5 flex items-center justify-between">
                              <span className="text-[9px] text-[#007acc] font-medium">{ext.publisher}</span>
                              <button
                                onClick={() => {
                                  macSound.playPop();
                                  setVsCodeExtensions(cur => cur.map(e => e.id === ext.id ? { ...e, installed: !e.installed } : e));
                                }}
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                                  ext.installed 
                                    ? 'bg-[#333333] text-emerald-400 hover:bg-rose-950/60 hover:text-rose-400' 
                                    : 'bg-[#007acc] text-white hover:bg-[#0062a3]'
                                }`}
                              >
                                {ext.installed ? 'Installed ✓' : 'Install'}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {vsCodeActiveSidebar === 'git' && (
                  <div className="p-3 space-y-3 text-xs">
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider block">Source Control: Git</span>
                    <div className="p-2 rounded bg-black/40 border border-white/10 space-y-2">
                      <input
                        type="text"
                        placeholder="Message (⌘Enter to commit)"
                        value={gitCommitMsg}
                        onChange={(e) => setGitCommitMsg(e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-white/10 rounded p-1.5 text-xs text-white outline-none"
                      />
                      <button
                        onClick={() => {
                          macSound.playPop();
                          setGitCommitMsg('');
                          setVsCodeTerminalOutput(prev => [
                            ...prev,
                            'developer@appletree-mac-pro ~/workspace % git commit -m "update code"',
                            '[main 7f2e4b1] update code\n 2 files changed, 14 insertions(+)'
                          ]);
                        }}
                        className="w-full py-1.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-bold text-xs cursor-pointer"
                      >
                        ✓ Commit & Push
                      </button>
                    </div>
                  </div>
                )}

                {vsCodeActiveSidebar === 'search' && (
                  <div className="p-3 space-y-3 text-xs">
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider block">Search in Files</span>
                    <input
                      type="text"
                      placeholder="Search text..."
                      value={vsCodeFileSearch}
                      onChange={(e) => setVsCodeFileSearch(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-white/10 rounded p-1.5 text-xs text-white outline-none"
                    />
                    <div className="text-[11px] text-slate-400">
                      {vsCodeFileSearch ? `Matches found in ${vsCodeFiles.filter(f => f.content.toLowerCase().includes(vsCodeFileSearch.toLowerCase())).length} files` : 'Type to search workspace'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Editor Workspace & Terminal */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
              {/* Tab Bar */}
              <div className="h-9 bg-[#252526] flex items-center overflow-x-auto shrink-0 border-b border-[#1e1e1e]">
                {vsCodeTabs.map(tabId => {
                  const file = vsCodeFiles.find(f => f.id === tabId);
                  if (!file) return null;
                  const isActive = activeVsCodeFileId === tabId;

                  return (
                    <div
                      key={tabId}
                      onClick={() => setActiveVsCodeFileId(tabId)}
                      className={`h-full px-3.5 flex items-center gap-2 border-r border-[#1e1e1e] text-xs font-mono cursor-pointer transition select-none ${
                        isActive ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#252526]'
                      }`}
                    >
                      <span>{file.name.endsWith('.java') ? '☕' : file.name.endsWith('.py') ? '🐍' : '📄'}</span>
                      <span>{file.name}</span>
                      <button 
                        onClick={(e) => handleCloseVsCodeTab(e, tabId)} 
                        className="hover:bg-white/10 rounded p-0.5 text-[#888888] hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Breadcrumb Path Bar */}
              <div className="h-6 px-4 bg-[#1e1e1e] border-b border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-[#888888]">
                <span>workspace</span>
                <span>›</span>
                <span>src</span>
                <span>›</span>
                <span className="text-white font-semibold">{activeVsCodeFile.name}</span>
              </div>

              {/* Code Editor Surface */}
              <div className="flex-1 flex overflow-hidden">
                <div className="w-11 bg-[#1e1e1e] py-3 text-right pr-3 font-mono text-xs text-[#858585] select-none shrink-0 leading-relaxed border-r border-white/5">
                  {(activeVsCodeFile.content.split('\n')).map((_, idx) => (
                    <div key={idx}>{idx + 1}</div>
                  ))}
                </div>

                <textarea
                  value={activeVsCodeFile.content}
                  onChange={(e) => {
                    const val = e.target.value;
                    setVsCodeFiles(prev => prev.map(f => f.id === activeVsCodeFileId ? { ...f, content: val } : f));
                  }}
                  className="flex-1 h-full p-3 bg-transparent text-[#9cdcfe] font-mono text-xs leading-relaxed outline-none resize-none overflow-y-auto selection:bg-[#264f78]"
                  spellCheck={false}
                />
              </div>

              {/* Bottom Terminal Panel */}
              <div className="h-48 bg-[#181818] border-t border-[#333333] flex flex-col shrink-0 font-sans">
                <div className="h-7 px-3 bg-[#1e1e1e] border-b border-[#333333] flex items-center justify-between text-[11px] font-semibold text-[#cccccc]">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setVsCodeBottomTab('terminal')}
                      className={`hover:text-white cursor-pointer ${vsCodeBottomTab === 'terminal' ? 'text-white border-b-2 border-[#007acc] pb-0.5' : 'text-[#888888]'}`}
                    >
                      TERMINAL
                    </button>
                    <button 
                      onClick={() => setVsCodeBottomTab('output')}
                      className={`hover:text-white cursor-pointer ${vsCodeBottomTab === 'output' ? 'text-white border-b-2 border-[#007acc] pb-0.5' : 'text-[#888888]'}`}
                    >
                      OUTPUT
                    </button>
                    <button 
                      onClick={() => setVsCodeBottomTab('problems')}
                      className={`hover:text-white cursor-pointer ${vsCodeBottomTab === 'problems' ? 'text-white border-b-2 border-[#007acc] pb-0.5' : 'text-[#888888]'}`}
                    >
                      PROBLEMS (0)
                    </button>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">● OpenJDK 21 LTS + Python 3.12 Ready</span>
                </div>

                <div className="flex-1 p-3 font-mono text-[11px] text-[#cccccc] overflow-y-auto space-y-1">
                  {vsCodeBottomTab === 'terminal' ? (
                    <>
                      {vsCodeTerminalOutput.map((line, idx) => (
                        <div key={idx} className={line.startsWith('developer@') ? 'text-emerald-400 font-bold' : line.includes('OpenJDK') ? 'text-yellow-400' : line.startsWith('✓') ? 'text-emerald-300 font-bold' : 'text-[#d4d4d4]'}>
                          {line}
                        </div>
                      ))}

                      <form onSubmit={handleVsCodeTerminalSubmit} className="flex items-center gap-1.5 pt-1">
                        <span className="text-emerald-400 font-bold">developer@appletree-mac-pro ~/workspace %</span>
                        <input
                          type="text"
                          value={vsCodeTerminalInput}
                          onChange={(e) => setVsCodeTerminalInput(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                        />
                      </form>
                    </>
                  ) : (
                    <div className="text-slate-400">
                      [Compiling with AppleTree Enterprise Backend Build System: No errors detected]
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Blue Status Bar */}
              <div className="h-5 bg-[#007acc] text-white px-3 flex items-center justify-between text-[10px] font-sans font-medium select-none shrink-0">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><GitBranch className="w-2.5 h-2.5" /> main*</span>
                  <span>0 ⊗ 0 △</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Ln {activeVsCodeFile.content.split('\n').length}, Col 1</span>
                  <span>UTF-8</span>
                  <span className="font-bold">{activeVsCodeFile.lang === 'java' ? 'OpenJDK 21 LTS' : activeVsCodeFile.lang === 'python' ? 'Python 3.12.2' : 'Node.js 20'}</span>
                  <span>Prettier ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. REAL SAFARI BROWSER WITH SEARCH ENGINE ── */}
      {windows.safari.isOpen && !windows.safari.isMinimized && (
        <div
          onClick={() => focusWindow('safari')}
          style={{
            zIndex: windows.safari.zIndex,
            left: windows.safari.isMaximized ? 0 : windows.safari.x,
            top: windows.safari.isMaximized ? 26 : windows.safari.y,
            width: windows.safari.isMaximized ? '100vw' : windows.safari.w,
            height: windows.safari.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.safari.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-950/98 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'safari' ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          {/* Safari Tab Bar */}
          <div className="h-9 px-4 bg-slate-900 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('safari')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer hover:opacity-80" />
              <button onClick={() => minimizeWindow('safari')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer hover:opacity-80" />
              <button onClick={() => toggleMaximize('safari')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer hover:opacity-80" />
            </div>

            {/* Browser Tabs */}
            <div className="flex-1 flex items-center gap-1.5 overflow-x-auto max-w-2xl px-2">
              {safariTabs.map(tab => (
                <div
                  key={tab.id}
                  onClick={() => {
                    setActiveSafariTabId(tab.id);
                    setSafariInput(tab.query || tab.url);
                  }}
                  className={`h-7 px-3 rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer transition select-none truncate ${
                    activeSafariTabId === tab.id ? 'bg-black/50 text-white font-bold border border-white/15' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Compass className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate max-w-[140px]">{tab.title}</span>
                  <button onClick={(e) => handleCloseSafariTab(e, tab.id)} className="hover:text-white rounded p-0.5">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              <button onClick={handleOpenSafariNewTab} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer" title="New Tab">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-8" />
          </div>

          {/* Safari Navigation & Search Bar */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'safari')}
            className="h-11 px-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3 cursor-move shrink-0"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <ChevronLeft className="w-4 h-4 hover:text-white cursor-pointer" />
              <ChevronRight className="w-4 h-4 hover:text-white cursor-pointer" />
              <RefreshCw onClick={executeSafariSearch} className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
            </div>

            {/* Smart URL / Google Search Bar */}
            <form onSubmit={executeSafariSearch} className="flex-1 max-w-xl mx-auto h-8 px-3 rounded-xl bg-black/60 border border-white/15 flex items-center gap-2.5 text-xs text-slate-300">
              <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <input
                type="text"
                value={safariInput}
                onChange={(e) => setSafariInput(e.target.value)}
                placeholder="Search Google or type a URL..."
                className="w-full bg-transparent outline-none text-white text-xs"
              />
              <span className="text-[10px] text-slate-400 bg-white/10 px-1.5 py-0.5 rounded font-mono">↵</span>
            </form>

            <div className="flex items-center gap-2 text-slate-400">
              <Share2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Safari Content Body (Search Results Engine or Web View) */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#121212]">
            {activeSafariTab.mode === 'search' ? (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-xs text-slate-400 pb-2 border-b border-white/10">
                  About 1,840,000 results for <strong className="text-white">"{activeSafariTab.query || safariInput}"</strong> (0.24 seconds)
                </div>

                {/* Instant Knowledge Answer Box */}
                <div className="p-5 rounded-2xl bg-white/5 border border-sky-400/30 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Instant Knowledge Summary</span>
                  <h3 className="text-base font-bold text-white capitalize">{activeSafariTab.query || safariInput}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {(activeSafariTab.query || safariInput).toLowerCase().includes('python') 
                      ? 'Python 3.12 introduces more clear tracebacks, isolated subinterpreters, comprehension inlining, and extensive built-in list methods (.append, .sort, .pop, .reverse). Fully pre-installed in AppleTree macOS.'
                      : (activeSafariTab.query || safariInput).toLowerCase().includes('java')
                      ? 'Java 21 LTS delivers Virtual Threads (Project Loom), Sequenced Collections, and Record Patterns for high-throughput enterprise backends. OpenJDK 21 LTS is active in AppleTree macOS.'
                      : `Comprehensive documentation and developer resources matching "${activeSafariTab.query || safariInput}". Verified curriculum taught at AppleTree Infotech.`}
                  </p>
                  <div className="pt-2 flex gap-2">
                    <button onClick={() => openApp('vscode')} className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <Code2 className="w-3.5 h-3.5" /> Practice in VS Code
                    </button>
                  </div>
                </div>

                {/* Search Result Cards */}
                <div className="space-y-4">
                  {[
                    { title: `${activeSafariTab.query || safariInput} — Official Developer Guide 2026`, link: 'https://docs.appletree.dev/guide', desc: 'Tutorials, syntax references, production best practices, and hands-on exercises.' },
                    { title: `Mastering ${activeSafariTab.query || safariInput} with Placement Support`, link: 'https://programmingwala.com/programs', desc: 'ISO certified IT curriculum with mock interviews, live projects, and guaranteed job placements in Delhi NCR.' },
                    { title: `GitHub Repositories: ${activeSafariTab.query || safariInput} Source Code`, link: 'https://github.com/appletree/mastery', desc: 'Enterprise microservice templates, modern full-stack architectures, and AI integration boilerplates.' }
                  ].map((res, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition space-y-1">
                      <span className="text-[11px] text-sky-400 block truncate">{res.link}</span>
                      <h4 className="text-sm font-bold text-white hover:underline cursor-pointer">{res.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{res.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                <h2 className="text-xl font-bold text-white">AppleTree Web Explorer</h2>
                <p className="text-xs text-slate-300">Viewing: {activeSafariTab.url}</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => navigate('/programs')} className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs cursor-pointer">
                    Browse All Programs
                  </button>
                  <button onClick={() => {
                    setSafariTabs(prev => prev.map(t => t.id === activeSafariTabId ? { ...t, mode: 'search', query: 'apple developer' } : t));
                  }} className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer">
                    Back to Search
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3. FINDER (FILE MANAGER) ── */}
      {windows.finder.isOpen && !windows.finder.isMinimized && (
        <div
          onClick={() => focusWindow('finder')}
          style={{
            zIndex: windows.finder.zIndex,
            left: windows.finder.isMaximized ? 0 : windows.finder.x,
            top: windows.finder.isMaximized ? 26 : windows.finder.y,
            width: windows.finder.isMaximized ? '100vw' : windows.finder.w,
            height: windows.finder.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.finder.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/95 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'finder' ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          {/* Toolbar */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'finder')}
            className="h-11 px-4 bg-slate-800/80 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('finder')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('finder')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('finder')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <MacFinderIcon className="w-4 h-4" />
              <span>Finder — Macintosh HD</span>
            </div>

            <button
              onClick={() => createNewFolder()}
              className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-2.5 h-2.5" /> Folder
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-52 bg-slate-950/60 border-r border-white/10 p-3 flex flex-col gap-1 text-xs shrink-0">
              <span className="text-[10px] font-black uppercase text-slate-400 px-2 py-1">Favorites</span>
              <button onClick={() => openApp('vscode')} className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium text-sky-400 hover:bg-white/10 transition cursor-pointer">
                <Code2 className="w-3.5 h-3.5" /> VS Code Workspace
              </button>
              <button onClick={() => openApp('terabox')} className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium text-sky-300 hover:bg-sky-500/20 transition cursor-pointer">
                <Cloud className="w-3.5 h-3.5" /> TeraBox Cloud (1TB)
              </button>
              <button onClick={() => openApp('terminal')} className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium text-emerald-400 hover:bg-white/10 transition cursor-pointer">
                <TerminalIcon className="w-3.5 h-3.5" /> Terminal (~/Desktop)
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {desktopItems.map(item => (
                  <div
                    key={item.id}
                    onDoubleClick={() => {
                      if (item.targetApp) openApp(item.targetApp);
                      else if (item.type === 'file') openApp('vscode');
                    }}
                    className="flex flex-col items-center p-3 rounded-xl hover:bg-white/10 cursor-pointer text-center group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      {item.type === 'folder' ? <MacFolderIcon /> : <FileText className="w-10 h-10 text-sky-400" />}
                    </div>
                    <span className="mt-2 text-xs font-medium text-white truncate max-w-[90px]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. SYSTEM SETTINGS (ALL SETTINGS WORKING) ── */}
      {windows.settings.isOpen && !windows.settings.isMinimized && (
        <div
          onClick={() => focusWindow('settings')}
          style={{
            zIndex: windows.settings.zIndex,
            left: windows.settings.isMaximized ? 0 : windows.settings.x,
            top: windows.settings.isMaximized ? 26 : windows.settings.y,
            width: windows.settings.isMaximized ? '100vw' : windows.settings.w,
            height: windows.settings.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.settings.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/95 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'settings' ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'settings')}
            className="h-11 px-4 bg-slate-800/90 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('settings')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('settings')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('settings')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="text-xs font-semibold text-slate-300">System Settings — macOS Sequoia Pro</div>
            <div className="w-10" />
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Settings Left Navigation Sidebar */}
            <div className="w-56 bg-slate-950/70 border-r border-white/10 p-3 space-y-1 text-xs shrink-0">
              <button
                onClick={() => setActiveSettingsTab('displays')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition cursor-pointer ${
                  activeSettingsTab === 'displays' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Monitor className="w-4 h-4 text-sky-400" />
                <span>Displays & Wallpaper</span>
              </button>
              <button
                onClick={() => setActiveSettingsTab('sound')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition cursor-pointer ${
                  activeSettingsTab === 'sound' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>Sound & Audio</span>
              </button>
              <button
                onClick={() => setActiveSettingsTab('wifi')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition cursor-pointer ${
                  activeSettingsTab === 'wifi' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Wifi className="w-4 h-4 text-blue-400" />
                <span>Wi-Fi & Network</span>
              </button>
              <button
                onClick={() => setActiveSettingsTab('general')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition cursor-pointer ${
                  activeSettingsTab === 'general' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>General & Storage</span>
              </button>
            </div>

            {/* Settings Content Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {activeSettingsTab === 'displays' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Desktop Wallpaper Gallery</h3>
                    <p className="text-xs text-slate-400">Click to immediately apply any authentic dark macOS backdrop</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {WALLPAPERS.map(wp => (
                      <div
                        key={wp.id}
                        onClick={() => {
                          macSound.playPop();
                          setCurrentWallpaper(wp.url);
                        }}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer aspect-video shadow-md ${
                          currentWallpaper === wp.url ? 'border-blue-500 ring-2 ring-blue-500/50 scale-[1.02]' : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img src={wp.url} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] font-semibold text-white drop-shadow truncate">{wp.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-white">Display Brightness ({screenBrightness}%)</span>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={screenBrightness}
                      onChange={(e) => setScreenBrightness(e.target.value)}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeSettingsTab === 'sound' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">Audio Settings</h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-white">Output Volume ({soundVolume}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundVolume}
                      onChange={(e) => setSoundVolume(e.target.value)}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-white">Sound Effects Testing</span>
                    <div className="flex gap-2">
                      <button onClick={() => macSound.playPop()} className="px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-bold cursor-pointer">Pop</button>
                      <button onClick={() => macSound.playClick()} className="px-3 py-1.5 rounded-lg bg-slate-700 text-xs font-bold cursor-pointer">Click</button>
                      <button onClick={() => macSound.playTink()} className="px-3 py-1.5 rounded-lg bg-slate-700 text-xs font-bold cursor-pointer">Tink</button>
                      <button onClick={() => macSound.playTrash()} className="px-3 py-1.5 rounded-lg bg-slate-700 text-xs font-bold cursor-pointer">Trash</button>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'wifi' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">Wi-Fi & Network Configuration</h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Network Name:</span>
                      <span className="font-bold text-emerald-400">AppleTree-5G Ultra-Fast</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">IP Address:</span>
                      <span className="font-mono text-white">192.168.1.108</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400">Link Speed:</span>
                      <span className="font-bold text-white">950 Mbps (Gigabit Fiber)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'general' && (
                <div className="space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-white">Hardware & Storage Specifications</h3>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Processor:</span>
                      <span className="font-bold text-white">Apple M3 Max (16-Core)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory:</span>
                      <span className="font-bold text-white">64 GB Unified RAM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Compilers:</span>
                      <span className="font-bold text-emerald-400">OpenJDK 21 LTS + Python 3.12 Pre-installed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">TeraBox Cloud:</span>
                      <span className="font-bold text-sky-400">1024 GB Free Storage Attached</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. TERABOX WINDOW ── */}
      {windows.terabox.isOpen && !windows.terabox.isMinimized && (
        <div
          onClick={() => focusWindow('terabox')}
          style={{
            zIndex: windows.terabox.zIndex,
            left: windows.terabox.isMaximized ? 0 : windows.terabox.x,
            top: windows.terabox.isMaximized ? 26 : windows.terabox.y,
            width: windows.terabox.isMaximized ? '100vw' : windows.terabox.w,
            height: windows.terabox.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.terabox.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/98 border border-sky-400/30 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'terabox' ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'terabox')}
            className="h-11 px-4 bg-gradient-to-r from-sky-950/80 to-slate-900 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('terabox')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('terabox')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('terabox')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
              <div className="w-4 h-4"><MacTeraBoxIcon /></div>
              <span>TeraBox Cloud Storage — 1024 GB Ultra Free Storage</span>
            </div>

            <a 
              href="https://terabox.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[10px] text-sky-300 hover:text-white flex items-center gap-1 font-bold bg-sky-500/20 px-2 py-0.5 rounded border border-sky-400/30"
            >
              <span>TeraBox Web</span> <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/60">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-900/40 via-blue-900/20 to-slate-900 border border-sky-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Cloud Capacity Status</span>
                <h3 className="text-base font-black text-white mt-0.5">
                  {teraBoxUsedGB} GB <span className="text-xs font-normal text-slate-400">used of</span> {teraBoxTotalGB} GB (1 TB Free)
                </h3>
                <div className="w-64 h-2 rounded-full bg-slate-800 overflow-hidden mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" 
                    style={{ width: `${(teraBoxUsedGB / teraBoxTotalGB) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setIsUploadingTeraBox(true);
                  setUploadProgress(10);
                  macSound.playPop();
                  const iv = setInterval(() => {
                    setUploadProgress(p => {
                      if (p >= 90) {
                        clearInterval(iv);
                        setTimeout(() => {
                          setIsUploadingTeraBox(false);
                          setUploadProgress(0);
                          setTeraBoxFiles(cur => [{ id: `tb-${Date.now()}`, name: `Project_Archive_${Math.floor(Math.random()*900)}.zip`, size: '14.2 MB', modified: 'Just now', type: 'archive' }, ...cur]);
                        }, 300);
                        return 100;
                      }
                      return p + 30;
                    });
                  }, 200);
                }}
                disabled={isUploadingTeraBox}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingTeraBox ? `Uploading (${uploadProgress}%)...` : 'Upload to TeraBox'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/60">
              <div className="grid grid-cols-12 px-4 py-2.5 bg-slate-800/80 text-[11px] font-bold text-slate-400 border-b border-white/10 uppercase tracking-wider">
                <div className="col-span-7">File Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Date Modified</div>
              </div>
              <div className="divide-y divide-white/5">
                {teraBoxFiles.map(file => (
                  <div key={file.id} className="grid grid-cols-12 px-4 py-3 text-xs items-center hover:bg-white/5 transition">
                    <div className="col-span-7 font-semibold text-white truncate flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-400" />
                      <span>{file.name}</span>
                    </div>
                    <div className="col-span-2 text-slate-400 text-[11px]">{file.size}</div>
                    <div className="col-span-3 text-slate-400 text-[11px]">{file.modified}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. TERMINAL WINDOW ── */}
      {windows.terminal.isOpen && !windows.terminal.isMinimized && (
        <div
          onClick={() => focusWindow('terminal')}
          style={{
            zIndex: windows.terminal.zIndex,
            left: windows.terminal.isMaximized ? 0 : windows.terminal.x,
            top: windows.terminal.isMaximized ? 26 : windows.terminal.y,
            width: windows.terminal.isMaximized ? '100vw' : windows.terminal.w,
            height: windows.terminal.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.terminal.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-950/95 border border-white/20 shadow-2xl flex flex-col font-mono text-xs transition-all duration-150 ${activeAppId === 'terminal' ? 'ring-1 ring-white/30' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'terminal')}
            className="h-10 px-4 bg-slate-900 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('terminal')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('terminal')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('terminal')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="text-[11px] font-semibold text-slate-400">developer — zsh (JDK 21 + Python 3.12)</div>
            <div className="w-10" />
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-2 text-emerald-400">
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="leading-relaxed">
                {item.type === 'sys' && <p className="text-slate-400">{item.text}</p>}
                {item.type === 'input' && (
                  <p className="text-white">
                    <span className="text-emerald-400 font-bold">developer@appletree-mac</span>
                    <span className="text-blue-400"> ~/Desktop %</span> {item.cmd}
                  </p>
                )}
                {item.type === 'output' && <pre className="whitespace-pre-wrap text-emerald-300 font-mono text-[11px]">{item.text}</pre>}
              </div>
            ))}

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-1">
              <span className="text-emerald-400 font-bold shrink-0">developer@appletree-mac</span>
              <span className="text-blue-400 shrink-0">~/Desktop %</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-white font-mono"
              />
            </form>
            <div ref={terminalBottomRef} />
          </div>
        </div>
      )}

      {/* ── 7. KBC QUIZ WINDOW ── */}
      {windows.kbc.isOpen && !windows.kbc.isMinimized && (
        <div
          onClick={() => focusWindow('kbc')}
          style={{
            zIndex: windows.kbc.zIndex,
            left: windows.kbc.isMaximized ? 0 : windows.kbc.x,
            top: windows.kbc.isMaximized ? 26 : windows.kbc.y,
            width: windows.kbc.isMaximized ? '100vw' : windows.kbc.w,
            height: windows.kbc.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.kbc.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-950/98 border border-amber-500/30 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'kbc' ? 'ring-1 ring-amber-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'kbc')}
            className="h-11 px-4 bg-gradient-to-r from-amber-950/60 to-slate-900 border-b border-amber-500/20 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('kbc')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('kbc')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('kbc')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Kaun Banega Crorepati — Tech Contestant Arena</span>
            </div>
            <Link to="/kbc" className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-bold">
              <span>Fullscreen</span> <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-4 shadow-lg shadow-amber-500/20 animate-pulse">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-amber-400 mb-2">Kaun Banega Crorepati Competition</h2>
            <p className="text-xs text-slate-300 max-w-md mb-6 leading-relaxed">
              Real-time countdown timer, dynamic points addition and deduction, and live moving leaderboard!
            </p>
            <button
              onClick={() => navigate('/kbc')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Join Contestant Screen
            </button>
          </div>
        </div>
      )}

      {/* ── 8. NOTES WINDOW ── */}
      {windows.notes.isOpen && !windows.notes.isMinimized && (
        <div
          onClick={() => focusWindow('notes')}
          style={{
            zIndex: windows.notes.zIndex,
            left: windows.notes.isMaximized ? 0 : windows.notes.x,
            top: windows.notes.isMaximized ? 26 : windows.notes.y,
            width: windows.notes.isMaximized ? '100vw' : windows.notes.w,
            height: windows.notes.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.notes.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/98 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'notes' ? 'ring-1 ring-yellow-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'notes')}
            className="h-10 px-4 bg-slate-800/90 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('notes')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('notes')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('notes')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="text-xs font-semibold text-slate-300">Notes (macOS Dark Pro)</div>
            <div className="w-10" />
          </div>

          <div className="flex-1 p-4 bg-slate-950 flex flex-col">
            <textarea
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              className="flex-1 w-full bg-transparent text-slate-200 text-xs outline-none resize-none leading-relaxed font-sans"
              placeholder="Write your notes here..."
            />
          </div>
        </div>
      )}

      {/* ── 9. CALCULATOR WINDOW ── */}
      {windows.calculator.isOpen && !windows.calculator.isMinimized && (
        <div
          onClick={() => focusWindow('calculator')}
          style={{
            zIndex: windows.calculator.zIndex,
            left: windows.calculator.x,
            top: windows.calculator.y,
            width: windows.calculator.w,
            height: windows.calculator.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/95 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'calculator' ? 'ring-1 ring-white/30' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'calculator')}
            className="h-9 px-3 bg-slate-800/80 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <button onClick={() => closeWindow('calculator')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('calculator')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
            </div>
            <div className="text-[11px] font-semibold text-slate-400">Calculator</div>
            <div className="w-6" />
          </div>

          <div className="p-4 bg-slate-950/80 text-right">
            <span className="text-3xl font-light text-white tracking-tight">{calcDisplay}</span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900/90 text-sm font-semibold flex-1">
            <button onClick={() => { macSound.playClick(); setCalcDisplay('0'); setCalcPrev(null); setCalcOp(null); }} className="p-3 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white cursor-pointer">AC</button>
            <button onClick={() => { macSound.playClick(); setCalcDisplay(prev => String(-parseFloat(prev))); }} className="p-3 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white cursor-pointer">±</button>
            <button onClick={() => { macSound.playClick(); setCalcDisplay(prev => String(parseFloat(prev) / 100)); }} className="p-3 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white cursor-pointer">%</button>
            <button onClick={() => handleCalcOp('÷')} className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer">÷</button>

            {[7, 8, 9].map(n => (
              <button key={n} onClick={() => handleCalcNumber(n)} className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white cursor-pointer">{n}</button>
            ))}
            <button onClick={() => handleCalcOp('×')} className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer">×</button>

            {[4, 5, 6].map(n => (
              <button key={n} onClick={() => handleCalcNumber(n)} className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white cursor-pointer">{n}</button>
            ))}
            <button onClick={() => handleCalcOp('-')} className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer">−</button>

            {[1, 2, 3].map(n => (
              <button key={n} onClick={() => handleCalcNumber(n)} className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white cursor-pointer">{n}</button>
            ))}
            <button onClick={() => handleCalcOp('+')} className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer">+</button>

            <button onClick={() => handleCalcNumber(0)} className="col-span-2 p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-left pl-5 cursor-pointer">0</button>
            <button onClick={() => { macSound.playClick(); if (!calcDisplay.includes('.')) setCalcDisplay(p => p + '.'); }} className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white cursor-pointer">.</button>
            <button onClick={handleCalcEquals} className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer">=</button>
          </div>
        </div>
      )}

      {/* ── 10. ABOUT THIS MAC WINDOW ── */}
      {windows.aboutMac.isOpen && (
        <div
          onClick={() => focusWindow('aboutMac')}
          style={{
            zIndex: windows.aboutMac.zIndex,
            left: windows.aboutMac.x,
            top: windows.aboutMac.y,
            width: windows.aboutMac.w,
            height: windows.aboutMac.h
          }}
          className="absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/98 border border-white/20 shadow-2xl flex flex-col text-center"
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'aboutMac')}
            className="h-9 px-3 bg-slate-800/80 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <button onClick={() => closeWindow('aboutMac')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
            <span className="text-xs font-semibold text-slate-300">About This Mac</span>
            <div className="w-4" />
          </div>

          <div className="p-6 flex flex-col items-center justify-center flex-1 space-y-3">
            <div className="text-5xl font-light text-white drop-shadow"></div>
            <div>
              <h2 className="text-base font-extrabold text-white">AppleTree Mac Studio M3 Max</h2>
              <p className="text-xs text-slate-400">macOS Sequoia 15.2 (Pro Dark Edition)</p>
            </div>

            <div className="w-full space-y-1.5 text-xs text-slate-300 pt-2 border-t border-white/10 max-w-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Chip:</span>
                <span className="font-semibold text-white">Apple M3 Max (16-Core)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Compilers:</span>
                <span className="font-semibold text-emerald-400">OpenJDK 21 LTS + Python 3.12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cloud Storage:</span>
                <span className="font-semibold text-sky-400">TeraBox 1024 GB (Active Sync)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academy:</span>
                <span className="font-semibold text-amber-300">AppleTree Infotech</span>
              </div>
            </div>

            <button 
              onClick={() => closeWindow('aboutMac')}
              className="mt-2 px-5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ════════════════ AUTHENTIC REAL macOS SQUIRCLE DOCK ════════════════ */}
      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9999] px-3 py-2 rounded-2xl backdrop-blur-3xl bg-black/45 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-end gap-2.5 transition-all">
        {[
          { id: 'finder', title: 'Finder', icon: MacFinderIcon },
          { id: 'vscode', title: 'Visual Studio Code', icon: MacVSCodeIcon, badge: 'IDE' },
          { id: 'safari', title: 'Safari', icon: MacSafariIcon },
          { id: 'terabox', title: 'TeraBox Cloud', icon: MacTeraBoxIcon, badge: '1TB' },
          { id: 'terminal', title: 'Terminal', icon: MacTerminalIcon },
          { id: 'kbc', title: 'KBC Quiz', icon: MacKbcIcon, badge: 'LIVE' },
          { id: 'notes', title: 'Notes', icon: MacNotesIcon },
          { id: 'calculator', title: 'Calculator', icon: MacCalculatorIcon },
          { id: 'settings', title: 'System Settings', icon: MacSettingsIcon }
        ].map(app => {
          const IconComponent = app.icon;
          const isOpen = windows[app.id]?.isOpen;
          const isBouncing = bouncingApp === app.id;

          return (
            <div key={app.id} className="relative flex flex-col items-center group">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none px-2.5 py-1 rounded-md backdrop-blur-md bg-black/85 text-white text-[10px] font-semibold whitespace-nowrap shadow-md">
                {app.title}
              </div>

              <button
                onClick={() => {
                  if (isOpen && !windows[app.id].isMinimized && activeAppId === app.id) {
                    minimizeWindow(app.id);
                  } else {
                    openApp(app.id);
                  }
                }}
                className={`w-12 h-12 p-0.5 flex items-center justify-center transition-transform duration-200 hover:scale-125 hover:-translate-y-2 active:scale-95 cursor-pointer relative ${
                  isBouncing ? 'animate-bounce' : ''
                }`}
              >
                <IconComponent className="w-full h-full drop-shadow-xl" />
                {app.badge && (
                  <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-red-600 text-white text-[8px] font-black animate-pulse shadow-md">
                    {app.badge}
                  </span>
                )}
              </button>

              <div className={`w-1 h-1 rounded-full mt-1 transition-all ${isOpen ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]' : 'opacity-0'}`} />
            </div>
          );
        })}

        <div className="w-px h-10 bg-white/20 self-center mx-1" />

        <div className="relative flex flex-col items-center group">
          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none px-2.5 py-1 rounded-md backdrop-blur-md bg-black/85 text-white text-[10px] font-semibold whitespace-nowrap shadow-md">
            Trash
          </div>
          <button
            onClick={() => {
              macSound.playTrash();
              alert('Trash is clean and empty!');
            }}
            className="w-12 h-12 p-0.5 flex items-center justify-center transition-transform duration-200 hover:scale-125 hover:-translate-y-2 cursor-pointer"
          >
            <MacTrashIcon className="w-full h-full drop-shadow-xl" />
          </button>
          <div className="w-1 h-1 rounded-full mt-1 opacity-0" />
        </div>
      </footer>

      {/* ════════════════ LOCK SCREEN OVERLAY ════════════════ */}
      {isLocked && (
        <div className="fixed inset-0 z-[99999] backdrop-blur-3xl bg-black/75 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
          <div className="text-center space-y-4">
            <span className="text-5xl font-extralight tracking-tight drop-shadow-md">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <p className="text-sm font-medium text-slate-300">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>

            <div className="pt-8 flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#E53935] to-[#2E7D32] flex items-center justify-center text-2xl font-black shadow-xl ring-4 ring-white/20">
                AT
              </div>
              <p className="font-bold text-base">Guest Developer (macOS Dark Pro)</p>
              <button
                onClick={() => {
                  macSound.playPop();
                  setIsLocked(false);
                }}
                className="mt-2 px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                Click to Unlock Mac
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
