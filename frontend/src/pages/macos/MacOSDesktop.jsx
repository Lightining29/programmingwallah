import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
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
  PlaySquare, Wrench, FileCheck, Split, BookOpen, Mic,
  Bot, Send, Sparkle, Minimize2, ChevronDown, ChevronUp, Square, AlertTriangle
} from 'lucide-react';

import vfs from './services/vfs.js';
import appRegistry from './services/appRegistry.js';
import macSound from './services/sound.js';
import FinderApp from './apps/FinderApp.jsx';
import AppStoreApp from './apps/AppStoreApp.jsx';
import TerminalApp from './apps/TerminalApp.jsx';
import ActivityMonitorApp from './apps/ActivityMonitorApp.jsx';
import SpotlightModal from './components/SpotlightModal.jsx';
import LaunchpadModal from './components/LaunchpadModal.jsx';
import MissionControlModal from './components/MissionControlModal.jsx';
import WebAppRunner from './components/WebAppRunner.jsx';
import SafariBrowserApp from './apps/SafariBrowserApp.jsx';
import JavaRuntimeManagerApp from './apps/JavaRuntimeManagerApp.jsx';
import MySQLStudioApp from './apps/MySQLStudioApp.jsx';
import MacLockScreen from './components/MacLockScreen.jsx';
import SystemSettingsApp from './apps/SystemSettingsApp.jsx';
import GameCenterApp from './apps/GameCenterApp.jsx';
import GamePlayerWindow from './components/GamePlayerWindow.jsx';
import GlobalMenuBar from './components/GlobalMenuBar.jsx';
import { GAMES_CATALOG, getGameById } from './services/gameCatalog.js';
import { 
  registerJavaLanguageProvider, 
  updateJavaDiagnostics, 
  organizeImports 
} from './services/javaLanguageService.js';
import { 
  DesktopWidgetWrapper, WidgetGalleryModal, NotificationCenterDrawer, INITIAL_DESKTOP_WIDGETS 
} from './components/WidgetSystem.jsx';

// ── AUTHENTIC REAL macOS SQUIRCLE ICONS (Pixel-Perfect SVG Art) ──

export const MacGameCenterIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="gcBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#gcBg)" />
    <circle cx="36" cy="38" r="14" fill="#ffffff" opacity="0.85" />
    <circle cx="64" cy="38" r="14" fill="#ffffff" opacity="0.85" />
    <circle cx="36" cy="62" r="14" fill="#ffffff" opacity="0.85" />
    <circle cx="64" cy="62" r="14" fill="#ffffff" opacity="0.85" />
    <circle cx="50" cy="50" r="12" fill="#ffffff" />
  </svg>
);

export const MacMySQLIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="mysqlBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00758F" />
        <stop offset="100%" stopColor="#F29111" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#mysqlBg)" />
    <ellipse cx="50" cy="36" rx="26" ry="9" fill="#ffffff" opacity="0.9" />
    <path d="M24 36 V64 C24 69 36 73 50 73 C64 73 76 69 76 64 V36" fill="none" stroke="#ffffff" strokeWidth="4" />
    <path d="M24 50 C24 55 36 59 50 59 C64 59 76 55 76 50" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.7" />
  </svg>
);

export const MacJavaIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="javaBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#javaBg)" />
    <path d="M32 46 C32 46 42 42 56 42 C64 42 70 45 70 48 C70 56 50 60 50 60" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
    <path d="M38 56 C38 56 46 53 58 53 C64 53 68 55 68 57 C68 64 44 68 34 71" fill="none" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M48 24 C44 30 52 34 50 40" fill="none" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" />
    <path d="M56 20 C52 28 60 32 58 38" fill="none" stroke="#ffedd5" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

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

export const MacAppStoreIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="appStoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#appStoreGrad)" />
    <path d="M50 20 L28 62 H38 L43 52 H57 L62 62 H72 Z M47 42 L50 34 L53 42 Z" fill="#ffffff" />
    <path d="M22 68 H78 M35 74 H65" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const MacActivityMonitorIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="actMonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#actMonGrad)" stroke="#38bdf8" strokeWidth="2" />
    <polyline points="15,50 35,50 45,25 55,75 65,45 75,55 85,50" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MacLaunchpadIcon = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="launchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#launchGrad)" />
    <circle cx="34" cy="34" r="8" fill="#38bdf8" />
    <circle cx="66" cy="34" r="8" fill="#f43f5e" />
    <circle cx="34" cy="66" r="8" fill="#eab308" />
    <circle cx="66" cy="66" r="8" fill="#22c55e" />
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

  const handleDesktopCanvasClick = (e) => {
    setContextMenu(null);
    setActiveMenu(null);
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

  // ── Persistent IndexedDB Virtual File System Integration ──
  const [desktopItems, setDesktopItems] = useState([]);

  const reloadDesktopItems = async () => {
    try {
      const files = await vfs.list('/Users/admin/Desktop');
      setDesktopItems(files);
    } catch (e) {
      console.error('Failed to load desktop items from VFS:', e);
    }
  };

  useEffect(() => {
    vfs.readyPromise.then(() => reloadDesktopItems());
    const unsub = vfs.subscribe(() => reloadDesktopItems());
    return unsub;
  }, []);

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

  // ── Desktop Controls, Selection & Spaces ──
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);
  const activeMenuRef = useRef(null);
  const [renamingItemId, setRenamingItemId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [currentWallpaper, setCurrentWallpaper] = useState(WALLPAPERS[0].url);
  const [isLocked, setIsLocked] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: 'usr_01net',
    username: '01net',
    displayName: '01net',
    avatarUrl: 'bulb',
    role: 'admin'
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [soundVolume, setSoundVolume] = useState(85);
  const [screenBrightness, setScreenBrightness] = useState(100);
  const [dockSize, setDockSize] = useState(52);
  const [bouncingApp, setBouncingApp] = useState(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState('displays');
  const [isSiriOpen, setIsSiriOpen] = useState(false);
  const [siriPrompt, setSiriPrompt] = useState('');
  const [siriResponse, setSiriResponse] = useState('');

  // ── macOS System Preferences & Settings Store (Live + Database Persisted) ──
  const [dockPosition, setDockPosition] = useState('bottom');
  const [dockMagnification, setDockMagnification] = useState(true);
  const [dockAutoHide, setDockAutoHide] = useState(false);
  const [accentColor, setAccentColor] = useState('#007aff');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [installedDockGames, setInstalledDockGames] = useState(['game-2048', 'game-hextris']);
  const [systemSettings, setSystemSettings] = useState({});

  // ── macOS System States (Sleep, Restart, Shutdown) ──
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartProgress, setRestartProgress] = useState(0);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isPoweredOff, setIsPoweredOff] = useState(false);

  // Load persistent desktop state from database API
  useEffect(() => {
    fetch('/api/macos/desktop/state')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.desktop) {
          const d = data.desktop;
          if (d.wallpaper_url) setCurrentWallpaper(d.wallpaper_url);
          if (d.screen_brightness !== undefined && d.screen_brightness !== null) setScreenBrightness(d.screen_brightness);
          if (d.sound_volume !== undefined && d.sound_volume !== null) setSoundVolume(d.sound_volume);
          if (d.dock_size) setDockSize(d.dock_size);
          if (d.dock_position) setDockPosition(d.dock_position);
          if (d.dock_magnification !== undefined) setDockMagnification(Boolean(d.dock_magnification));
          if (d.dock_autohide !== undefined) setDockAutoHide(Boolean(d.dock_autohide));
          if (d.accent_color) setAccentColor(d.accent_color);
          if (d.dark_mode !== undefined) setIsDarkMode(Boolean(d.dark_mode));
          if (d.is_muted !== undefined) setIsMuted(Boolean(d.is_muted));
          if (Array.isArray(d.installed_dock_apps) && d.installed_dock_apps.length > 0) {
            setInstalledDockGames(d.installed_dock_apps);
          }
          setSystemSettings(d.settings || {});
        }
      })
      .catch(() => {});
  }, []);

  const updateSystemSetting = async (key, value) => {
    if (key === 'wallpaper_url' || key === 'wallpaper') setCurrentWallpaper(value);
    if (key === 'screen_brightness') setScreenBrightness(value);
    if (key === 'sound_volume') setSoundVolume(value);
    if (key === 'is_muted') setIsMuted(value);
    if (key === 'dock_size') setDockSize(value);
    if (key === 'dock_position') setDockPosition(value);
    if (key === 'dock_magnification') setDockMagnification(value);
    if (key === 'dock_autohide') setDockAutoHide(value);
    if (key === 'accent_color') setAccentColor(value);
    if (key === 'theme') {
      setIsDarkMode(value === 'dark' || (value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches));
    }
    if (key === 'dark_mode') setIsDarkMode(Boolean(value));

    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));

    try {
      await fetch('/api/macos/desktop/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
    } catch {}
  };

  const triggerSleep = () => {
    macSound.playClick();
    setIsSleepMode(true);
  };

  const triggerRestart = () => {
    macSound.playClick();
    setIsRestarting(true);
    setRestartProgress(0);
    const interval = setInterval(() => {
      setRestartProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRestarting(false);
            macSound.playTink();
          }, 300);
          return 100;
        }
        return p + 20;
      });
    }, 400);
  };

  const triggerShutdown = () => {
    macSound.playClick();
    setIsShuttingDown(true);
  };

  // ── Desktop Widgets & Notification Center State ──
  const [isWidgetGalleryOpen, setIsWidgetGalleryOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isEditingWidgets, setIsEditingWidgets] = useState(false);
  const [desktopWidgets, setDesktopWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('mac_desktop_widgets');
      return saved ? JSON.parse(saved) : INITIAL_DESKTOP_WIDGETS;
    } catch {
      return INITIAL_DESKTOP_WIDGETS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mac_desktop_widgets', JSON.stringify(desktopWidgets));
    } catch {}
  }, [desktopWidgets]);

  // ── Global Click Outside Dismissal Pipeline ──
  useEffect(() => {
    const handleGlobalPointerDown = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
      if (activeMenuRef.current && !activeMenuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };

    const handleGlobalEsc = (e) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
        setActiveMenu(null);
        setIsNotificationCenterOpen(false);
        setIsWidgetGalleryOpen(false);
        setIsEditingWidgets(false);
      }
    };

    window.addEventListener('pointerdown', handleGlobalPointerDown);
    window.addEventListener('keydown', handleGlobalEsc);
    return () => {
      window.removeEventListener('pointerdown', handleGlobalPointerDown);
      window.removeEventListener('keydown', handleGlobalEsc);
    };
  }, []);

  // ── Modals & Spaces State ──
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isMissionControlOpen, setIsMissionControlOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([
    { id: 'ws-1', name: 'Desktop 1' },
    { id: 'ws-2', name: 'Desktop 2' }
  ]);
  const [activeWorkspace, setActiveWorkspace] = useState('ws-1');

  // ── Window Management State ──
  const [highestZ, setHighestZ] = useState(30);
  const [activeAppId, setActiveAppId] = useState('vscode');

  const [windows, setWindows] = useState({
    'mysql-studio': {
      id: 'mysql-studio',
      title: 'MySQL Studio — LAN/printberry (MySQL 8.4 LTS)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 20,
      x: 90,
      y: 45,
      w: 960,
      h: 620
    },
    mysqlstudio: {
      id: 'mysqlstudio',
      title: 'MySQL Studio — LAN/printberry (MySQL 8.4 LTS)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 20,
      x: 90,
      y: 45,
      w: 960,
      h: 620
    },
    javamanager: {
      id: 'javamanager',
      title: 'Java Runtime Manager',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 22,
      x: 120,
      y: 60,
      w: 880,
      h: 560
    },
    vscode: {
      id: 'vscode',
      title: 'Visual Studio Code — main.py',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 25,
      x: 70,
      y: 40,
      w: 980,
      h: 620
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
    appstore: {
      id: 'appstore',
      title: 'App Store',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 13,
      x: 100,
      y: 55,
      w: 940,
      h: 580
    },
    activitymonitor: {
      id: 'activitymonitor',
      title: 'Activity Monitor',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 14,
      x: 150,
      y: 70,
      w: 800,
      h: 500
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
      title: 'Terminal — zsh (POSIX VFS)',
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
    gamecenter: {
      id: 'gamecenter',
      title: 'Game Center — Playhop Edition',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 22,
      x: 100,
      y: 50,
      w: 960,
      h: 620
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

  const openApp = (rawId) => {
    if (rawId?.startsWith('game-')) {
      launchGame(rawId.replace('game-', ''));
      return;
    }
    const id = (rawId === 'mysqlstudio' || rawId === 'mysql_studio') ? 'mysql-studio' : rawId;
    macSound.playPop();
    setBouncingApp(id);
    setTimeout(() => setBouncingApp(null), 1200);

    const pkg = appRegistry.getApp(id);
    const title = pkg ? pkg.name : (windows[id]?.title || (id === 'mysql-studio' ? 'MySQL Studio — LAN/printberry (MySQL 8.4 LTS)' : id));

    setHighestZ(prev => {
      const nextZ = prev + 1;
      setWindows(curr => {
        const existing = curr[id] || {
          id,
          title,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
          x: 110 + ((nextZ * 25) % 240),
          y: 50 + ((nextZ * 20) % 180),
          w: pkg?.window?.w || 820,
          h: pkg?.window?.h || 540,
          isPackage: Boolean(pkg),
          packageData: pkg
        };
        return {
          ...curr,
          [id]: { ...existing, isOpen: true, isMinimized: false, zIndex: nextZ }
        };
      });
      return nextZ;
    });
    setActiveAppId(id);
    setActiveMenu(null);
  };

  const launchGame = (gameOrId) => {
    const game = typeof gameOrId === 'string' ? (getGameById(gameOrId) || getGameById(gameOrId.replace('game-', ''))) : gameOrId;
    if (!game) return;
    const windowId = `game-${game.id}`;
    macSound.playPop();
    setBouncingApp(windowId);
    setTimeout(() => setBouncingApp(null), 1000);

    setHighestZ(prev => {
      const nextZ = prev + 1;
      setWindows(curr => ({
        ...curr,
        [windowId]: {
          id: windowId,
          title: game.title,
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
          x: Math.max(30, Math.floor((window.innerWidth - (game.window?.w || 500)) / 2)),
          y: Math.max(35, Math.floor((window.innerHeight - (game.window?.h || 620)) / 2)),
          w: game.window?.w || 500,
          h: game.window?.h || 620,
          isGame: true,
          gameData: game
        }
      }));
      return nextZ;
    });
    setActiveAppId(windowId);
    setActiveMenu(null);
  };

  const toggleDockGame = async (gameId) => {
    macSound.playPop();
    const cleanId = gameId.startsWith('game-') ? gameId : `game-${gameId}`;
    const rawId = gameId.replace('game-', '');
    const isCurrentlyDocked = installedDockGames.includes(rawId) || installedDockGames.includes(cleanId);
    const updated = isCurrentlyDocked 
      ? installedDockGames.filter(id => id !== rawId && id !== cleanId)
      : [...installedDockGames, rawId];
    
    setInstalledDockGames(updated);

    try {
      await fetch(`/api/macos/desktop/games/${rawId}/dock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ installed: !isCurrentlyDocked })
      });
    } catch (err) {}
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

  // ── Global Desktop Keyboard Shortcuts (⌘+Space, ⌘+W, ⌘+M) ──
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'w' || e.key === 'W') && !e.shiftKey) {
        if (activeAppId && windows[activeAppId]?.isOpen && !e.target.closest('input') && !e.target.closest('textarea')) {
          e.preventDefault();
          closeWindow(activeAppId);
        }
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'm' || e.key === 'M')) {
        if (activeAppId && windows[activeAppId]?.isOpen && !e.target.closest('input') && !e.target.closest('textarea')) {
          e.preventDefault();
          minimizeWindow(activeAppId);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeAppId, windows]);

  // ── Folder & File Operations (Direct VFS Connection) ──
  const createNewFolder = async (folderName = 'untitled folder') => {
    macSound.playPop();
    const existing = desktopItems.filter(i => i.name.startsWith(folderName));
    const finalName = existing.length > 0 ? `${folderName} ${existing.length + 1}` : folderName;
    await vfs.mkdir(`/Users/admin/Desktop/${finalName}`);
    setContextMenu(null);
  };

  const createNewTextFile = async (fileName = 'untitled.py') => {
    macSound.playPop();
    const existing = desktopItems.filter(i => i.name.startsWith(fileName.split('.')[0]));
    const finalName = existing.length > 0 ? `untitled_${existing.length + 1}.py` : fileName;
    await vfs.writeFile(`/Users/admin/Desktop/${finalName}`, '#!/usr/bin/env python3\nprint("Hello from macOS Sequoia!")\n', 'text/x-python');
    setContextMenu(null);
  };

  const deleteDesktopItem = async (pathOrId) => {
    macSound.playTrash();
    const item = desktopItems.find(i => i.path === pathOrId || i.id === pathOrId);
    if (item && item.path) {
      await vfs.delete(item.path, true);
    }
    setContextMenu(null);
  };

  const handleStartRename = (item) => {
    setRenamingItemId(item.path || item.id);
    setRenameValue(item.name);
    setContextMenu(null);
  };

  const handleFinishRename = async () => {
    if (renamingItemId && renameValue.trim()) {
      try {
        await vfs.rename(renamingItemId, renameValue.trim());
      } catch (err) {
        console.error('Rename failed:', err);
      }
    }
    setRenamingItemId(null);
  };

  const handleOpenFileInEditor = async (fileNode) => {
    macSound.playPop();
    openApp('vscode');
    const existingTab = vsCodeFiles.find(f => f.path === fileNode.path || f.name === fileNode.name);
    if (existingTab) {
      setActiveVsCodeFileId(existingTab.id);
    } else {
      let content = fileNode.content;
      if (content === undefined) {
        try { content = await vfs.readFile(fileNode.path); } catch (e) { content = ''; }
      }
      const ext = fileNode.name.split('.').pop().toLowerCase();
      const lang = ext === 'py' ? 'python' : ext === 'java' ? 'java' : ext === 'js' ? 'javascript' : ext === 'json' ? 'json' : ext === 'html' ? 'html' : ext === 'css' ? 'css' : 'markdown';
      const newTab = {
        id: `file-${Date.now()}`,
        name: fileNode.name,
        path: fileNode.path,
        language: lang,
        content: content || ''
      };
      setVsCodeFiles(prev => [...prev, newTab]);
      setActiveVsCodeFileId(newTab.id);
    }
  };

  // ── Centralized Context Menu Trigger with Viewport Bounds Clamping ──
  const openContextMenu = (e, type, targetId = null, data = null) => {
    e.preventDefault();
    e.stopPropagation();
    macSound.playClick();
    const menuWidth = 230;
    const menuHeight = 290;
    const x = Math.min(e.clientX, window.innerWidth - menuWidth - 12);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight - 12);
    setContextMenu({
      x: Math.max(12, x),
      y: Math.max(28, y),
      type,
      targetId,
      data
    });
  };

  const handleDesktopContextMenu = (e) => {
    openContextMenu(e, 'desktop');
  };

  // ═══════════════════════════════════════════════════════════════
  // ── VISUAL STUDIO CODE ADVANCED STATE (MONACO + AI + EXTENSIONS) ──
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
    print("\n✓ Status: 100% Industry Certified & Placement Ready!")

if __name__ == "__main__":
    master_tech_career()
`
    },
    {
      id: 'f-widget',
      name: 'isWidget.ts',
      folder: 'src',
      lang: 'typescript',
      content:
`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IWidget {
    readonly id: string;
    render(): HTMLElement;
    layout?(width: number, height: number): void;
    dispose(): void;
}

export function isWidget(thing: any): thing is IWidget {
    return Boolean(thing && typeof thing === 'object' && typeof thing.render === 'function');
}
`
    },
    {
      id: 'f-contrib',
      name: 'CONTRIBUTING.md',
      folder: 'root',
      lang: 'markdown',
      content:
`# Contributing to AppleTree Monaco & VS Code Engine

Thank you for helping build our next-generation macOS developer workstation.

## Runtimes
- **Python 3.12.10** Native Isolated Sandbox
- **Java 27 (OpenJDK)** Native Compiler & JVM
- **Node.js 20.18 LTS** Enterprise V8 Runtime
`
    },
    {
      id: 'f-menu',
      name: 'contextmenu.ts',
      folder: 'src',
      lang: 'typescript',
      content:
`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'vs/base/browser/dom';
import 'vs/base/browser/ui/widget';

export class ContextMenuManager {
    private static instance: ContextMenuManager;
    private isOpen: boolean = false;

    public static getInstance(): ContextMenuManager {
        if (!ContextMenuManager.instance) {
            ContextMenuManager.instance = new ContextMenuManager();
        }
        return ContextMenuManager.instance;
    }

    public open(x: number, y: number): void {
        this.isOpen = true;
    }

    public close(): void {
        this.isOpen = false;
    }
}
`
    },
    {
      id: 'f-pkg',
      name: 'package.json',
      folder: 'root',
      lang: 'json',
      content:
`{
  "name": "appletree-vscode-engine",
  "version": "1.19.0",
  "distro": "610ca6990cab94b59284327a3741a81",
  "author": {
    "name": "Microsoft Corporation"
  },
  "main": "./out/main",
  "private": true,
  "scripts": {
    "test": "mocha",
    "preinstall": "node build/npm/preinstall",
    "postinstall": "node build/npm/postinstall",
    "compile": "gulp compile --max_old_space_size=4096",
    "watch": "gulp watch --max_old_space_size=4096",
    "monaco-editor-test": "mocha --only-monaco",
    "precommit": "node build/gulpfile.hygiene",
    "gulp": "gulp --max_old_space_size=4096",
    "7z": "7z",
    "update-grammars": "node build/npm/update-grammars",
    "smoketest": "cd test/smoke && mocha"
  }
}`
    },
    {
      id: 'f-java',
      name: 'App.java',
      folder: 'src',
      lang: 'java',
      content:
`public class App {
    public static void main(String[] args) {
        System.out.println("Hello from my macOS IDE!");
        System.out.println("Java is working correctly.");
    }
}`
    },
    {
      id: 'f-js',
      name: 'server.js',
      folder: 'src',
      lang: 'javascript',
      content:
`// Node.js 20.18.0 LTS Enterprise Backend
const http = require('http');

const PORT = 5000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'online',
    academy: 'AppleTree Infotech',
    engine: 'Node.js 20 LTS',
    uptime: process.uptime()
  }));
});

console.log(\`⚡ Server listening on http://localhost:\${PORT}\`);
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
  <title>AppleTree Live Portal</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="dark-body">
  <div class="card">
    <div class="logo"> AppleTree Infotech</div>
    <h1>Professional IT Training & Career Growth</h1>
    <p>Guaranteed 100% Placement Support in Delhi NCR & Top MNCs</p>
    <div class="tags">
      <span class="tag">Java 27 LTS</span>
      <span class="tag">Python 3.12</span>
      <span class="tag">AWS DevOps</span>
      <span class="tag">MERN Stack</span>
    </div>
    <button class="cta-btn" onclick="alert('Welcome to AppleTree Tech Career!')">Explore Courses</button>
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
`/* AppleTree Dark Pro CSS */
.dark-body {
  margin: 0;
  padding: 30px;
  background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #030712 100%);
  color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 32px;
  max-width: 480px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}
.logo {
  font-size: 13px;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}
h1 {
  font-size: 22px;
  margin: 0 0 10px;
  background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
p {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.5;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin: 18px 0;
}
.tag {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}
.cta-btn {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
  transition: transform 0.15s;
}
.cta-btn:hover {
  transform: scale(1.04);
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
  - **OpenJDK 27 LTS**
  - **Python 3.12.10**
  - **Node.js 20.18.0 LTS**
- Run any file using the green ▶ Run button or in the integrated terminal!
- Use **Live Browser Preview** to see HTML & CSS updates live!
- Use **Copilot AI** for project-wide coding, refactoring, and bug fixes!
`
    }
  ]);

  const [activeVsCodeFileId, setActiveVsCodeFileId] = useState('f-py');
  const [vsCodeTabs, setVsCodeTabs] = useState(['f-widget', 'f-contrib', 'f-menu', 'f-pkg', 'f-py']);
  const [vsCodeTerminalOutput, setVsCodeTerminalOutput] = useState([
    '32 PM          1133 LICENSE.txt',
    '51 AM        607796 npm-debug.log',
    '46 AM         42422 OSSREADME.json',
    '14 PM          3699 package.json',
    '49 PM           683 product.json',
    '18 PM          3732 README.md',
    '14 PM        103675 ThirdPartyNotices.txt',
    '14 PM           729 tsfmt.json',
    '14 PM         11050 tslint.json',
    '14 PM        203283 yarn.lock',
    '',
    'developer@appletree-mac-pro ~/workspace % python3 main.py',
    '🚀 Initializing AppleTree Python & AI Sandbox...',
    'System: macOS Sequoia 15.2 | Python 3.12.10',
    '  [1] Java Full Stack Developer -> Target: ₹8-18 LPA',
    '  [2] AWS DevOps Cloud Architect -> Target: ₹10-22 LPA',
    '  [3] Python AI & ML Specialist -> Target: ₹12-25 LPA',
    '  [4] React & MERN Stack Lead -> Target: ₹8-16 LPA',
    '',
    '✓ Status: 100% Industry Certified & Placement Ready!'
  ]);
  const [vsCodeTerminalInput, setVsCodeTerminalInput] = useState('');
  const [vsCodeBottomTab, setVsCodeBottomTab] = useState('terminal'); // terminal, output, problems, debug
  const [vsCodeBottomPanelHeight, setVsCodeBottomPanelHeight] = useState(230);
  const [isVsCodeBottomMinimized, setIsVsCodeBottomMinimized] = useState(false);
  const [isVsCodeBottomMaximized, setIsVsCodeBottomMaximized] = useState(false);
  const [vsCodeProblems, setVsCodeProblems] = useState([]);
  const [vsCodeOutputLog, setVsCodeOutputLog] = useState([
    '[AppleTree Compiler Engine: OpenJDK 27 LTS & Python 3.12.8 & Node.js 20.18 Active]'
  ]);
  const [isDraggingVsCodeBottom, setIsDraggingVsCodeBottom] = useState(false);
  const [isVsCodeRunning, setIsVsCodeRunning] = useState(false);
  const [activeExecutionId, setActiveExecutionId] = useState(null);
  const [detectedRuntimes, setDetectedRuntimes] = useState(null);

  // Fetch real execution runtime diagnostics on mount
  useEffect(() => {
    fetch('/api/ide/diagnostics')
      .then(res => res.json())
      .then(data => {
        setDetectedRuntimes(data);
      })
      .catch(() => {});
  }, []);

  const [vsCodeActiveSidebar, setVsCodeActiveSidebar] = useState('explorer'); // 'explorer', 'search', 'git', 'extensions', 'copilot'
  const [vsCodeExtSearch, setVsCodeExtSearch] = useState('');
  const [vsCodeFileSearch, setVsCodeFileSearch] = useState('');
  const [newFileInputName, setNewFileInputName] = useState('');
  const [isCreatingNewFile, setIsCreatingNewFile] = useState(false);
  const [gitCommitMsg, setGitCommitMsg] = useState('');
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteSearch, setCommandPaletteSearch] = useState('');

  // ── AI Copilot Project-Aware Chat State ──
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Coding Assistant. I have indexed your entire workspace (6 files: main.py, App.java, server.js, index.html, styles.css, README.md). How can I assist you with code generation, debugging, or optimization today?'
    }
  ]);

  // ── VS Code Extensions List (Marketplace) ──
  const [vsCodeExtensions, setVsCodeExtensions] = useState([
    { id: 'ext-py', name: 'Python', publisher: 'Microsoft', version: 'v2026.4', downloads: '124M', desc: 'IntelliSense, Linting, Debugging & Code Formatting (Python 3.12 ready)', installed: true, icon: '🐍' },
    { id: 'ext-java', name: 'Extension Pack for Java', publisher: 'Microsoft', version: 'v1.31', downloads: '48M', desc: 'Java language support, Debugger & Maven projects (OpenJDK 21 LTS ready)', installed: true, icon: '☕' },
    { id: 'ext-pylance', name: 'Pylance', publisher: 'Microsoft', version: 'v2026.2', downloads: '88M', desc: 'Performant Python type analysis and auto-imports', installed: true, icon: '⚡' },
    { id: 'ext-prettier', name: 'Prettier - Code Formatter', publisher: 'Prettier', version: 'v10.4', downloads: '42M', desc: 'Opinionated code formatter for JS, CSS, HTML', installed: true, icon: '✨' },
    { id: 'ext-tailwind', name: 'Tailwind CSS IntelliSense', publisher: 'Tailwind Labs', version: 'v0.12', downloads: '18M', desc: 'Intelligent Tailwind CSS class suggestions', installed: true, icon: '🎨' },
    { id: 'ext-copilot', name: 'GitHub Copilot', publisher: 'GitHub', version: 'v1.178', downloads: '25M', desc: 'Your AI pair programmer directly in VS Code', installed: true, icon: '🤖' },
    { id: 'ext-gitlens', name: 'GitLens — Git supercharged', publisher: 'GitKraken', version: 'v14.8', downloads: '32M', desc: 'Supercharge Git inside VS Code', installed: true, icon: '🌿' },
    { id: 'ext-springboot', name: 'Spring Boot Tools', publisher: 'VMware', version: 'v1.54', downloads: '14M', desc: 'Spring Boot application support for Java microservices', installed: true, icon: '🍃' },
    { id: 'ext-docker', name: 'Docker', publisher: 'Microsoft', version: 'v1.29', downloads: '38M', desc: 'Manage containers, images and registries', installed: false, icon: '🐳' },
    { id: 'ext-eslint', name: 'ESLint', publisher: 'Microsoft', version: 'v2.4', downloads: '36M', desc: 'Integrates ESLint into VS Code', installed: false, icon: '🔍' },
    { id: 'ext-icons', name: 'Material Icon Theme', publisher: 'Philipp Kief', version: 'v5.1', downloads: '28M', desc: 'Material Design Icons for VS Code', installed: true, icon: '📁' }
  ]);

  const activeVsCodeFile = vsCodeFiles.find(f => f.id === activeVsCodeFileId) || vsCodeFiles[0];

  // ── Keyboard Shortcuts (⌘+Shift+P, ⌘+Space, Esc) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
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
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // ── Drag-to-Resize VS Code Bottom Panel ──
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingVsCodeBottom) return;
      const newHeight = window.innerHeight - e.clientY - 60;
      setVsCodeBottomPanelHeight(Math.max(100, Math.min(newHeight, 650)));
    };
    const handleMouseUp = () => {
      if (isDraggingVsCodeBottom) setIsDraggingVsCodeBottom(false);
    };
    if (isDraggingVsCodeBottom) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingVsCodeBottom]);

  // ── Genuine Code Execution Engine (Synchronized with Monaco Model) ──
  const handleRunVsCodeCode = async () => {
    if (isVsCodeRunning) return; // Prevent duplicate concurrent runs
    macSound.playPop();
    setIsVsCodeRunning(true);
    setIsVsCodeBottomMinimized(false);
    setVsCodeBottomTab('terminal');

    const execId = `exec-${Date.now()}`;
    setActiveExecutionId(execId);

    const activeFile = vsCodeFiles.find(f => f.id === activeVsCodeFileId) || vsCodeFiles[0];
    const cmdRun = activeFile.lang === 'java' 
      ? `javac ${activeFile.name} && java ${activeFile.name.replace('.java', '')}`
      : activeFile.lang === 'javascript'
      ? `node ${activeFile.name}`
      : `python3 ${activeFile.name}`;

    setVsCodeTerminalOutput(prev => [
      ...prev,
      `developer@appletree-mac-pro ~/workspace % ${cmdRun}`,
      `⚡ Executing ${activeFile.name} in isolated native runtime...`
    ]);

    setVsCodeOutputLog(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Executing: ${cmdRun}`,
      `[Workspace snapshot initialized for ${activeFile.name}]`
    ]);

    try {
      const response = await fetch('/api/ide/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeFile.lang,
          code: activeFile.content,
          fileName: activeFile.name,
          files: vsCodeFiles,
          executionId: execId
        })
      });

      const data = await response.json();
      setIsVsCodeRunning(false);
      setActiveExecutionId(null);
      macSound.playPop();

      if (data.stdout) {
        const outLines = data.stdout.trim().split(/\r?\n/);
        setVsCodeTerminalOutput(prev => [...prev, ...outLines]);
      }

      if (data.stderr) {
        const errLines = data.stderr.trim().split(/\r?\n/);
        setVsCodeTerminalOutput(prev => [
          ...prev, 
          ...errLines.map(l => `[stderr] ${l}`)
        ]);

        // Parse compiler / runtime error diagnostics for the Problems tab
        const extractedProblems = [];
        for (const line of errLines) {
          const javaMatch = line.match(/^(.*?):(\d+):\s*(error|warning):\s*(.*)$/);
          if (javaMatch) {
            extractedProblems.push({
              file: javaMatch[1],
              line: parseInt(javaMatch[2], 10),
              severity: javaMatch[3],
              message: javaMatch[4]
            });
            continue;
          }
          const pyMatch = line.match(/File "(.*?)", line (\d+)/);
          if (pyMatch) {
            extractedProblems.push({
              file: pyMatch[1],
              line: parseInt(pyMatch[2], 10),
              severity: 'error',
              message: line
            });
          }
        }
        if (extractedProblems.length > 0) {
          setVsCodeProblems(extractedProblems);
        }
      } else {
        setVsCodeProblems([]);
      }

      setVsCodeTerminalOutput(prev => [
        ...prev,
        `[Process completed with exit code ${data.exitCode} in ${data.durationMs}ms]`
      ]);

      setVsCodeOutputLog(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Finished with exitCode ${data.exitCode} (${data.durationMs}ms)`
      ]);

    } catch (err) {
      setIsVsCodeRunning(false);
      setActiveExecutionId(null);
      setVsCodeTerminalOutput(prev => [
        ...prev,
        `[stderr] Execution failed: ${err.message}`,
        '[Process terminated with error code 1]'
      ]);
    }
  };

  const handleStopVsCodeExecution = async () => {
    macSound.playPop();
    try {
      await fetch('/api/ide/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executionId: activeExecutionId })
      });
      setVsCodeTerminalOutput(prev => [
        ...prev,
        '[Process terminated by user (SIGKILL)]'
      ]);
    } catch {}
    setIsVsCodeRunning(false);
    setActiveExecutionId(null);
  };

  // ── Genuine Interactive Terminal Command Input (With Scanner & Shell Routing) ──
  const handleVsCodeTerminalSubmit = async (e) => {
    e.preventDefault();
    const cmd = vsCodeTerminalInput.trim();
    if (!cmd) return;
    setVsCodeTerminalInput('');

    // If an execution is running and waiting for input (e.g. Scanner)
    if (isVsCodeRunning && activeExecutionId) {
      setVsCodeTerminalOutput(prev => [...prev, cmd]);
      try {
        await fetch('/api/ide/input', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            executionId: activeExecutionId,
            input: cmd
          })
        });
      } catch {}
      return;
    }

    if (cmd.toLowerCase() === 'clear' || cmd.toLowerCase() === 'cls') {
      setVsCodeTerminalOutput([]);
      return;
    }

    setVsCodeTerminalOutput(prev => [
      ...prev,
      `developer@appletree-mac-pro ~/workspace % ${cmd}`
    ]);

    try {
      const response = await fetch('/api/ide/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: cmd,
          files: vsCodeFiles
        })
      });
      const data = await response.json();
      if (data.stdout) {
        const outLines = data.stdout.trim().split(/\r?\n/);
        setVsCodeTerminalOutput(prev => [...prev, ...outLines]);
      }
      if (data.stderr) {
        const errLines = data.stderr.trim().split(/\r?\n/);
        setVsCodeTerminalOutput(prev => [...prev, ...errLines.map(l => `[stderr] ${l}`)]);
      }
      if (!data.stdout && !data.stderr) {
        setVsCodeTerminalOutput(prev => [...prev, `[Command completed with exit code ${data.exitCode}]`]);
      }
    } catch (err) {
      setVsCodeTerminalOutput(prev => [...prev, `[stderr] Command failed: ${err.message}`]);
    }
  };

  // ── Monaco Theme & Colorizer Definition ──
  const handleMonacoWillMount = (monaco) => {
    monaco.editor.defineTheme('vs-pitch-black', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7f848e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'e06c75', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'c678dd', fontStyle: 'bold' },
        { token: 'identifier', foreground: '61afef' },
        { token: 'string', foreground: '98c379' },
        { token: 'string.escape', foreground: '56b6c2' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'type', foreground: 'e5c07b' },
        { token: 'function', foreground: '61afef', fontStyle: 'bold' },
        { token: 'variable', foreground: 'e06c75' },
        { token: 'variable.parameter', foreground: 'abb2bf' },
        { token: 'operator', foreground: '56b6c2' },
        { token: 'delimiter', foreground: 'abb2bf' },
        { token: 'tag', foreground: 'e06c75' },
        { token: 'attribute.name', foreground: 'd19a66' },
        { token: 'attribute.value', foreground: '98c379' }
      ],
      colors: {
        'editor.background': '#000000', // Pitch Black Background
        'editor.foreground': '#abb2bf',
        'editorLineNumber.foreground': '#4b5263',
        'editorLineNumber.activeForeground': '#61afef',
        'editor.lineHighlightBackground': '#111217',
        'editorCursor.foreground': '#528bff',
        'editorWhitespace.foreground': '#282c34',
        'editorIndentGuide.background': '#1e222b',
        'editorIndentGuide.activeBackground': '#61afef',
        'editorBracketHighlight.foreground1': '#ffd700',
        'editorBracketHighlight.foreground2': '#da70d6',
        'editorBracketHighlight.foreground3': '#61afef',
        'editorBracketHighlight.foreground4': '#98c379',
        'editorBracketHighlight.foreground5': '#e06c75',
        'editorBracketHighlight.foreground6': '#d19a66'
      }
    });

    // Register genuine Java language provider (IntelliSense, Auto-Imports, Code Actions)
    registerJavaLanguageProvider(monaco);
  };

  const vsCodeEditorRef = useRef(null);
  const vsCodeMonacoRef = useRef(null);

  const handleMonacoDidMount = (editor, monaco) => {
    vsCodeEditorRef.current = editor;
    vsCodeMonacoRef.current = monaco;

    // Run initial Java diagnostics if active file is Java
    const model = editor.getModel();
    if (model && activeVsCodeFile.lang === 'java') {
      const markers = updateJavaDiagnostics(monaco, model);
      if (markers.length > 0) {
        setVsCodeProblems(markers.map(m => ({
          file: activeVsCodeFile.name,
          line: m.startLineNumber,
          severity: 'error',
          message: m.message
        })));
      }
    }

    // Bind Ctrl+Shift+O / Cmd+Shift+O to Organize Imports
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyO, () => {
      const currentCode = editor.getValue();
      const organized = organizeImports(currentCode);
      editor.setValue(organized);
      setVsCodeFiles(prev => prev.map(f => f.id === activeVsCodeFileId ? { ...f, content: organized } : f));
      macSound.playPop();
    });
  };

  // ── AI Copilot Whole Project Prompt Handler ──
  const handleSendAiPrompt = async (promptText) => {
    const query = promptText || aiChatInput;
    if (!query.trim()) return;

    macSound.playPop();
    const userMsg = { role: 'user', text: query };
    setAiChatMessages(prev => [...prev, userMsg]);
    setAiChatInput('');
    setIsAiThinking(true);

    try {
      const activeFile = vsCodeFiles.find(f => f.id === activeVsCodeFileId) || vsCodeFiles[0];
      const action = query.toLowerCase().includes('fix') ? 'fix' 
                   : query.toLowerCase().includes('test') ? 'tests' 
                   : 'explain';
      
      const response = await fetch('/api/ide/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          action,
          code: activeFile.content,
          fileName: activeFile.name,
          language: activeFile.lang,
          error: vsCodeTerminalOutput.filter(l => l.includes('[stderr]') || l.includes('Error')).join('\n')
        })
      });

      const data = await response.json();
      setIsAiThinking(false);
      macSound.playPop();

      setAiChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: data.reply || 'AI Assistant successfully analyzed the project.' }
      ]);

      if (data.proposedPatch) {
        setVsCodeFiles(prev => prev.map(f => f.id === activeFile.id ? { ...f, content: data.proposedPatch } : f));
      }
    } catch (err) {
      setIsAiThinking(false);
      setAiChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: `AI Service note: ${err.message}. Ready for next prompt.` }
      ]);
    }
  };

  // ── Live Browser HTML/CSS/JS Document Generator ──
  const getLivePreviewDoc = () => {
    const htmlFile = vsCodeFiles.find(f => f.name.endsWith('.html'))?.content || '<h1>Live Preview</h1>';
    const cssFile = vsCodeFiles.find(f => f.name.endsWith('.css'))?.content || '';
    const jsFile = vsCodeFiles.find(f => f.name.endsWith('.js'))?.content || '';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${cssFile}</style>
        </head>
        <body>
          ${htmlFile.includes('<body>') ? htmlFile.replace(/<!DOCTYPE html>|<\/?html>|<\/?head>[\s\S]*?<\/head>|<\/?body>/gi, '') : htmlFile}
          <script>
            try {
              ${jsFile}
            } catch(e) {
              console.error(e);
            }
          </script>
        </body>
      </html>
    `;
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

  if (isLocked) {
    return (
      <MacLockScreen
        onUnlock={(user, desktopState) => {
          if (user) setCurrentUser(user);
          if (desktopState?.wallpaper) setCurrentWallpaper(desktopState.wallpaper);
          setIsLocked(false);
        }}
        currentUser={currentUser}
        wallpaperUrl={currentWallpaper}
      />
    );
  }

  return (
    <div 
      onClick={handleDesktopCanvasClick}
      className="macos-dark-root fixed inset-0 w-screen h-screen overflow-hidden select-none bg-black text-white font-sans transition-all duration-300"
      onContextMenu={handleDesktopContextMenu}
      style={{
        filter: `brightness(${screenBrightness}%)`,
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%), url('${currentWallpaper}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* ════════════════ TOP GLOBAL macOS MENU BAR ════════════════ */}
      <GlobalMenuBar
        activeAppId={activeAppId}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        activeMenuRef={activeMenuRef}
        currentUser={currentUser}
        windows={windows}
        openApp={openApp}
        closeWindow={closeWindow}
        toggleMaximize={toggleMaximize}
        minimizeWindow={minimizeWindow}
        focusWindow={focusWindow}
        toggleFullscreenMode={toggleFullscreenMode}
        isFullscreen={isFullscreen}
        setIsLocked={setIsLocked}
        screenBrightness={screenBrightness}
        setScreenBrightness={setScreenBrightness}
        soundVolume={soundVolume}
        setSoundVolume={setSoundVolume}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setIsNotificationCenterOpen={setIsNotificationCenterOpen}
        setIsLaunchpadOpen={setIsLaunchpadOpen}
        setIsMissionControlOpen={setIsMissionControlOpen}
        setIsSpotlightOpen={setIsSpotlightOpen}
        setIsSiriOpen={setIsSiriOpen}
        launchGame={launchGame}
        navigate={navigate}
        currentTime={currentTime}
        formatMacDate={formatMacDate}
        onTriggerSleep={triggerSleep}
        onTriggerRestart={triggerRestart}
        onTriggerShutdown={triggerShutdown}
        onVsCodeRunCode={handleRunVsCodeCode}
        onVsCodeNewFile={() => { setIsCreatingNewFile(true); openApp('vscode'); }}
        onVsCodeTogglePreview={() => { setIsLivePreviewOpen(prev => !prev); openApp('vscode'); }}
        onMySQLNewQuery={() => { openApp('mysql-studio'); }}
        onMySQLRunQuery={() => { openApp('mysql-studio'); }}
        onSafariNewTab={handleOpenSafariNewTab}
      />

      {/* ── SLEEP MODE OVERLAY ── */}
      {isSleepMode && (
        <div
          onClick={() => setIsSleepMode(false)}
          className="fixed inset-0 z-[9999999] bg-black/95 flex flex-col items-center justify-center cursor-pointer animate-in fade-in duration-700"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-4xl animate-pulse">
            
          </div>
          <p className="text-xs text-white/50 mt-4 tracking-widest font-mono uppercase">
            Click anywhere or press any key to wake Mac
          </p>
        </div>
      )}

      {/* ── RESTARTING PROGRESS OVERLAY ── */}
      {isRestarting && (
        <div className="fixed inset-0 z-[9999999] bg-black flex flex-col items-center justify-center select-none animate-in fade-in duration-300">
          <div className="text-6xl text-white mb-8"></div>
          <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50">
            <div 
              style={{ width: `${restartProgress}%` }}
              className="h-full bg-white rounded-full transition-all duration-300"
            />
          </div>
          <span className="text-[11px] text-zinc-500 font-mono mt-3">Restarting macOS Sequoia...</span>
        </div>
      )}

      {/* ── SHUTDOWN CONFIRMATION MODAL ── */}
      {isShuttingDown && (
        <div className="fixed inset-0 z-[9999999] bg-black/60 backdrop-blur-md flex items-center justify-center">
          <div className="w-80 rounded-2xl bg-[#1e1e1e] border border-white/20 p-5 shadow-2xl text-center space-y-4 text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-2xl"></div>
            <div>
              <h3 className="font-bold text-sm text-white">Shut Down Computer?</h3>
              <p className="text-xs text-slate-400 mt-1">Are you sure you want to shut down your Mac now?</p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setIsShuttingDown(false)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsShuttingDown(false);
                  setIsPoweredOff(true);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition cursor-pointer shadow-lg shadow-rose-900/40"
              >
                Shut Down
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── POWERED OFF STATE ── */}
      {isPoweredOff && (
        <div 
          onClick={() => setIsPoweredOff(false)}
          className="fixed inset-0 z-[9999999] bg-black flex flex-col items-center justify-center cursor-pointer select-none text-center p-6"
        >
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-3xl text-zinc-600 mb-4">
            ⏻
          </div>
          <p className="text-xs text-zinc-500 font-mono">Your Mac is powered off.</p>
          <p className="text-[10px] text-zinc-600 mt-1 font-mono">Click anywhere to power back on.</p>
        </div>
      )}

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
                  <p className="font-semibold text-white">Visual Studio Code (Monaco Editor)</p>
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

      {/* ════════════════ VS CODE COMMAND PALETTE (Ctrl+Shift+P / ⌘+Shift+P) ════════════════ */}
      {isCommandPaletteOpen && (
        <div 
          className="fixed inset-0 z-[99998] flex items-start justify-center pt-16 bg-black/60 backdrop-blur-md"
          onClick={() => setIsCommandPaletteOpen(false)}
        >
          <div 
            className="w-full max-w-xl rounded-xl backdrop-blur-3xl bg-[#1e1e1e] border border-white/20 shadow-2xl p-2 text-white animate-in zoom-in-95 duration-100 font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#252526] rounded-lg border border-[#333333]">
              <Search className="w-4 h-4 text-sky-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search files by name (append : to go to line or @ to go to symbol)"
                value={commandPaletteSearch}
                onChange={e => setCommandPaletteSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400 bg-white/10 px-1.5 py-0.5 rounded font-mono">ESC</span>
            </div>

            <div className="p-1 mt-2 space-y-0.5 text-xs">
              {[
                { label: 'Go to File', shortcut: '⌘P', action: () => { setVsCodeActiveSidebar('explorer'); openApp('vscode'); } },
                { label: 'Show and Run Commands >', shortcut: '⇧⌘P', action: () => {} },
                { label: 'Open Quick Chat', shortcut: '⌘I', action: () => { setVsCodeActiveSidebar('copilot'); openApp('vscode'); } },
                { label: 'Go to Symbol in Editor @', shortcut: '⇧⌘O', action: () => {} },
                { label: 'Start Debugging debug', shortcut: 'F5', action: () => { handleRunVsCodeCode(); } },
                { label: 'Run Task task', shortcut: '⇧⌘B', action: () => { handleRunVsCodeCode(); } },
                { label: 'Search for Text (Experimental) %', shortcut: '⇧⌘F', action: () => { setVsCodeActiveSidebar('search'); openApp('vscode'); } },
                { label: 'Toggle Live Browser Preview', shortcut: '◫', action: () => { setIsLivePreviewOpen(p => !p); openApp('vscode'); } },
                { label: 'Format Document (Prettier)', shortcut: '⇧⌥F', action: () => macSound.playPop() },
                { label: 'Toggle Integrated Terminal', shortcut: '⌃`', action: () => setVsCodeBottomTab(t => t === 'terminal' ? null : 'terminal') },
                { label: 'Extensions: Open Marketplace', shortcut: '⇧⌘X', action: () => { setVsCodeActiveSidebar('extensions'); openApp('vscode'); } },
                { label: 'More ?', shortcut: '?', action: () => {} }
              ]
                .filter(c => !commandPaletteSearch || c.label.toLowerCase().includes(commandPaletteSearch.toLowerCase()))
                .map((cmd, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      cmd.action();
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-[#007acc] text-[#cccccc] hover:text-white cursor-pointer transition select-none"
                  >
                    <span className="font-medium text-xs">{cmd.label}</span>
                    <span className="text-[10px] font-mono opacity-60">{cmd.shortcut}</span>
                  </div>
                ))}
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

      {/* ════════════════ DESKTOP WIDGETS (SONOMA / SEQUOIA STYLE) ════════════════ */}
      <aside className="absolute top-12 left-6 z-10 flex flex-col gap-4 pointer-events-auto select-none">
        {desktopWidgets.map(widget => (
          <DesktopWidgetWrapper
            key={widget.id}
            widget={widget}
            isEditing={isEditingWidgets}
            onRemove={(id) => {
              macSound.playTrash();
              setDesktopWidgets(prev => prev.filter(w => w.id !== id));
            }}
          />
        ))}

        {isEditingWidgets && (
          <button
            onClick={() => setIsWidgetGalleryOpen(true)}
            className="w-40 h-12 rounded-2xl border-2 border-dashed border-sky-400/60 hover:border-sky-400 hover:bg-sky-500/10 text-sky-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-lg backdrop-blur-md bg-black/40"
          >
            <Plus className="w-4 h-4" /> Add Widget...
          </button>
        )}
      </aside>

      {/* ════════════════ DESKTOP ICONS GRID (VFS INTEGRATED) ════════════════ */}
      <main className="absolute top-10 right-4 flex flex-col gap-5 items-end z-10 pointer-events-auto select-none">
        {desktopItems.map(item => {
          const itemKey = item.path || item.id;
          return (
            <div
              key={itemKey}
              onDoubleClick={() => {
                if (item.appId) openApp(item.appId);
                else if (item.targetApp) openApp(item.targetApp);
                else if (item.name?.toLowerCase().includes('mysql')) openApp('mysql-studio');
                else if (item.name?.toLowerCase().includes('java')) openApp('javamanager');
                else if (item.type === 'folder') openApp('finder');
                else if (item.type === 'file') handleOpenFileInEditor(item);
              }}
              onContextMenu={(e) => openContextMenu(e, 'item', itemKey, item)}
              className="group flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/15 border border-transparent hover:border-white/20 transition-all duration-150 cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center drop-shadow-2xl">
                {item.icon === 'vscode' ? <MacVSCodeIcon /> :
                 item.icon === 'safari' ? <MacSafariIcon /> :
                 (item.icon === 'mysql' || item.appId === 'mysql-studio' || item.name?.toLowerCase().includes('mysql')) ? <MacMySQLIcon /> :
                 (item.icon === 'java' || item.appId === 'javamanager' || item.name?.toLowerCase().includes('java')) ? <MacJavaIcon /> :
                 item.icon === 'terabox' ? <MacTeraBoxIcon /> :
                 item.icon === 'terminal' ? <MacTerminalIcon /> :
                 item.icon === 'kbc' ? <MacKbcIcon /> :
                 item.type === 'folder' ? <MacFolderIcon /> :
                 <FileText className="w-10 h-10 text-sky-400" />}
              </div>

              {renamingItemId === itemKey ? (
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

      {/* ════════════════ CENTRALIZED CONTEXT MENU MANAGER ════════════════ */}
      {contextMenu && (
        <div 
          ref={contextMenuRef}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-[99995] w-60 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-white/20 p-1.5 shadow-2xl text-slate-200 text-xs select-none animate-in fade-in duration-100"
          onClick={() => setContextMenu(null)}
        >
          {contextMenu.type === 'item' ? (
            <>
              <button 
                onClick={() => {
                  const item = desktopItems.find(i => (i.path || i.id) === contextMenu.targetId);
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
                  const itm = desktopItems.find(i => (i.path || i.id) === contextMenu.targetId);
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
          ) : contextMenu.type === 'dock' ? (
            <>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 mb-1">
                {contextMenu.data?.title || 'Application'}
              </div>
              <button 
                onClick={() => openApp(contextMenu.targetId)}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer font-semibold"
              >
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              {windows[contextMenu.targetId]?.isOpen && (
                <>
                  <button 
                    onClick={() => minimizeWindow(contextMenu.targetId)}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
                  >
                    <span>{windows[contextMenu.targetId].isMinimized ? 'Restore Window' : 'Minimize Window'}</span>
                  </button>
                  <button 
                    onClick={() => closeWindow(contextMenu.targetId)}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white flex items-center justify-between cursor-pointer text-rose-300 font-semibold"
                  >
                    <span>Quit</span>
                    <span className="text-[10px] text-white/40">⌘Q</span>
                  </button>
                </>
              )}
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
                onClick={() => {
                  setIsEditingWidgets(true);
                  setIsWidgetGalleryOpen(true);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-fuchsia-300 font-medium"
              >
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Edit Widgets...</span>
                <span className="text-[10px] bg-fuchsia-500/20 px-1 rounded text-fuchsia-300">Sonoma</span>
              </button>
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

      {/* ── 1. VISUAL STUDIO CODE (MONACO ENGINE + LIVE PREVIEW + WHOLE PROJECT AI) ── */}
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
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-[#0c0e14]/98 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col transition-all duration-150 ${activeAppId === 'vscode' ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          {/* VS Code Title Bar */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'vscode')}
            className="h-10 px-4 bg-[#181a20] border-b border-black/40 flex items-center justify-between cursor-move shrink-0 select-none"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('vscode')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer hover:opacity-80" />
              <button onClick={() => minimizeWindow('vscode')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer hover:opacity-80" />
              <button onClick={() => toggleMaximize('vscode')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer hover:opacity-80" />
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#cccccc] font-sans">
              <div className="w-3.5 h-3.5"><MacVSCodeIcon /></div>
              <span>{activeVsCodeFile.name} — AppleTree Workspace [Monaco Pro Engine]</span>
            </div>

            {/* Run & Quick Action Buttons in Header */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLivePreviewOpen(prev => !prev)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                  isLivePreviewOpen ? 'bg-sky-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
                title="Toggle Live Web Browser Preview"
              >
                <Globe className="w-3 h-3" />
                <span>Live Preview</span>
              </button>

              {isVsCodeRunning ? (
                <button
                  onClick={handleStopVsCodeExecution}
                  className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer animate-pulse"
                  title="Stop Running Process (SIGKILL)"
                >
                  <Square className="w-3 h-3 fill-white" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={handleRunVsCodeCode}
                  className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                  title={`Run ${activeVsCodeFile.name} with ${activeVsCodeFile.lang === 'java' ? 'OpenJDK 27/21' : 'Python 3.12'}`}
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{`Run ${activeVsCodeFile.lang === 'java' ? 'Java' : activeVsCodeFile.lang === 'python' ? 'Python' : 'Code'}`}</span>
                </button>
              )}
            </div>
          </div>

          {/* VS Code Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Activity Bar (Icons) */}
            <div className="w-12 bg-[#12141a] flex flex-col items-center py-2.5 gap-4 shrink-0 text-[#858585] select-none border-r border-white/5">
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
                onClick={() => setVsCodeActiveSidebar(vsCodeActiveSidebar === 'copilot' ? null : 'copilot')}
                className={`p-2 rounded hover:text-fuchsia-400 transition cursor-pointer relative ${vsCodeActiveSidebar === 'copilot' ? 'text-fuchsia-400 border-l-2 border-fuchsia-500 pl-1.5' : 'text-fuchsia-400/80'}`}
                title="GitHub Copilot & Gemini AI (Project-Aware)"
              >
                <Bot className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 px-1 rounded-full bg-fuchsia-600 text-white text-[8px] font-black">AI</span>
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
                onClick={() => setIsCommandPaletteOpen(true)}
                className="p-2 rounded hover:text-white transition cursor-pointer"
                title="Command Palette (⇧⌘P)"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar View (Explorer / Extensions / Git / Search / Copilot) */}
            {vsCodeActiveSidebar && (
              <div className="w-60 bg-[#000000] border-r border-[#262626] flex flex-col shrink-0 overflow-hidden font-sans">
                {vsCodeActiveSidebar === 'explorer' && (
                  <>
                    <div className="h-9 px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#999999] border-b border-[#222222] bg-[#000000]">
                      <span>Explorer: WORKSPACE</span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setIsCreatingNewFile(true)}
                          className="hover:text-white p-0.5 rounded cursor-pointer text-[#888888]"
                          title="New File..."
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => macSound.playPop()}
                          className="hover:text-white p-0.5 rounded cursor-pointer text-[#888888]"
                          title="Refresh"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {isCreatingNewFile && (
                      <form onSubmit={handleCreateNewVsCodeFile} className="p-2 bg-[#0c0e14] border-b border-[#333333]">
                        <input
                          type="text"
                          autoFocus
                          placeholder="filename.py or filename.java"
                          value={newFileInputName}
                          onChange={(e) => setNewFileInputName(e.target.value)}
                          onBlur={() => { if (!newFileInputName) setIsCreatingNewFile(false); }}
                          className="w-full bg-black/80 border border-[#007acc] rounded px-2 py-1 text-xs text-white outline-none font-mono"
                        />
                      </form>
                    )}

                    <div className="p-2 space-y-1 overflow-y-auto flex-1 font-mono text-xs bg-[#000000]">
                      <div className="text-[10px] text-slate-400 font-sans font-bold px-1.5 uppercase flex items-center gap-1">
                        <span>▼</span> <span>src</span>
                      </div>
                      {vsCodeFiles.map(file => {
                        const isSelected = activeVsCodeFileId === file.id;
                        const ext = file.name.split('.').pop().toLowerCase();
                        let icon = '📄';
                        let fileColor = '#ffffff';
                        let iconColor = '#94a3b8';

                        if (ext === 'java') {
                          icon = '☕';
                          iconColor = '#fbbf24';
                          fileColor = '#fef3c7';
                        } else if (ext === 'py') {
                          icon = '🐍';
                          iconColor = '#34d399';
                          fileColor = '#d1fae5';
                        } else if (ext === 'ts' || ext === 'tsx') {
                          icon = '🔷';
                          iconColor = '#38bdf8';
                          fileColor = '#e0f2fe';
                        } else if (ext === 'js' || ext === 'jsx') {
                          icon = '⚡';
                          iconColor = '#facc15';
                          fileColor = '#fef9c3';
                        } else if (ext === 'html') {
                          icon = '🌐';
                          iconColor = '#fb923c';
                          fileColor = '#ffedd5';
                        } else if (ext === 'css') {
                          icon = '🎨';
                          iconColor = '#f472b6';
                          fileColor = '#fce7f3';
                        } else if (ext === 'json') {
                          icon = '📋';
                          iconColor = '#fde047';
                          fileColor = '#fef08a';
                        } else if (ext === 'md') {
                          icon = '📝';
                          iconColor = '#c084fc';
                          fileColor = '#f3e8ff';
                        }

                        return (
                          <div
                            key={file.id}
                            onClick={() => handleOpenVsCodeTab(file.id)}
                            style={{
                              backgroundColor: isSelected ? '#1e2433' : '#000000',
                              borderLeft: isSelected ? '2px solid #007acc' : '2px solid transparent',
                              color: isSelected ? '#ffffff' : fileColor
                            }}
                            className="group px-2.5 py-1.5 rounded flex items-center justify-between cursor-pointer transition select-none hover:!bg-[#151821]"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span style={{ color: iconColor }} className="text-sm">{icon}</span>
                              <span className={`truncate ${isSelected ? 'font-bold text-white' : 'font-medium'}`}>{file.name}</span>
                            </span>
                            <button
                              onClick={(e) => handleDeleteVsCodeFile(e, file.id)}
                              className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 transition"
                              title="Delete file"
                            >
                              <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-400" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {vsCodeActiveSidebar === 'copilot' && (
                  <div className="flex-1 flex flex-col overflow-hidden bg-[#10121a]">
                    <div className="h-9 px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-fuchsia-300 border-b border-white/5">
                      <span className="flex items-center gap-1.5"><Bot className="w-3.5 h-3.5 text-fuchsia-400" /> Copilot AI</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-fuchsia-500/20 text-fuchsia-300 font-mono">Gemini Pro</span>
                    </div>

                    <div className="px-3 py-2 bg-black/30 border-b border-white/5 text-[10px] text-slate-400">
                      <span>📁 Whole Project Aware: 6 files indexed</span>
                    </div>

                    {/* Quick Action Chips */}
                    <div className="p-2 flex flex-wrap gap-1 border-b border-white/5 bg-[#14161f]">
                      <button 
                        onClick={() => handleSendAiPrompt('Explain the active code in ' + activeVsCodeFile.name)}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-sky-300 cursor-pointer"
                      >
                        ⚡ Explain Code
                      </button>
                      <button 
                        onClick={() => handleSendAiPrompt('Find and fix any bugs in ' + activeVsCodeFile.name)}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-emerald-300 cursor-pointer"
                      >
                        🐞 Fix Bugs
                      </button>
                      <button 
                        onClick={() => handleSendAiPrompt('Generate a unit test suite for ' + activeVsCodeFile.name)}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-amber-300 cursor-pointer"
                      >
                        🚀 Unit Test
                      </button>
                    </div>

                    {/* Chat Messages Log */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs leading-relaxed">
                      {aiChatMessages.map((msg, i) => (
                        <div key={i} className={`p-2.5 rounded-xl ${msg.role === 'user' ? 'bg-blue-600/30 text-white border border-blue-500/30 ml-4' : 'bg-black/40 text-slate-200 border border-white/5 mr-2'}`}>
                          <div className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-60">
                            {msg.role === 'user' ? 'You' : 'Copilot AI'}
                          </div>
                          <pre className="whitespace-pre-wrap font-sans text-xs">{msg.text}</pre>
                        </div>
                      ))}
                      {isAiThinking && (
                        <div className="p-2 text-xs text-fuchsia-300 flex items-center gap-2 animate-pulse">
                          <Sparkles className="w-3.5 h-3.5 animate-spin" /> Analyzing project files...
                        </div>
                      )}
                    </div>

                    {/* Input form */}
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSendAiPrompt(); }} 
                      className="p-2 bg-[#0c0e14] border-t border-white/10 flex gap-1.5"
                    >
                      <input
                        type="text"
                        placeholder="Ask Copilot about any file..."
                        value={aiChatInput}
                        onChange={e => setAiChatInput(e.target.value)}
                        className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                      />
                      <button type="submit" className="p-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white cursor-pointer">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}

                {vsCodeActiveSidebar === 'extensions' && (
                  <>
                    <div className="h-9 px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] border-b border-white/5">
                      <span>Extensions: Marketplace</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">100% Free</span>
                    </div>

                    <div className="p-2 border-b border-white/5">
                      <input
                        type="text"
                        placeholder="Search Extensions..."
                        value={vsCodeExtSearch}
                        onChange={(e) => setVsCodeExtSearch(e.target.value)}
                        className="w-full bg-[#0c0e14] border border-[#333333] rounded px-2 py-1 text-xs text-white placeholder-slate-500 outline-none"
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
                        className="w-full bg-[#0c0e14] border border-white/10 rounded p-1.5 text-xs text-white outline-none"
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
                      className="w-full bg-[#0c0e14] border border-white/10 rounded p-1.5 text-xs text-white outline-none"
                    />
                    <div className="text-[11px] text-slate-400">
                      {vsCodeFileSearch ? `Matches found in ${vsCodeFiles.filter(f => f.content.toLowerCase().includes(vsCodeFileSearch.toLowerCase())).length} files` : 'Type to search workspace'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Editor Workspace & Split Preview & Terminal */}
            <div className="flex-1 flex flex-col bg-black overflow-hidden">
              {/* Tab Bar */}
              <div className="h-9 bg-[#111217] flex items-center justify-between overflow-x-auto shrink-0 border-b border-black">
                <div className="flex items-center h-full">
                  {vsCodeTabs.map(tabId => {
                    const file = vsCodeFiles.find(f => f.id === tabId);
                    if (!file) return null;
                    const isActive = activeVsCodeFileId === tabId;

                    return (
                      <div
                        key={tabId}
                        onClick={() => setActiveVsCodeFileId(tabId)}
                        className={`h-full px-3.5 flex items-center gap-2 border-r border-black/80 text-xs font-mono cursor-pointer transition select-none ${
                          isActive ? 'bg-black text-white border-t-2 border-t-[#007acc]' : 'bg-[#181a20] text-[#969696] hover:bg-[#1f222a]'
                        }`}
                      >
                        <span>{file.name.endsWith('.java') ? '☕' : file.name.endsWith('.py') ? '🐍' : file.name.endsWith('.ts') ? '🔷' : file.name.endsWith('.json') ? '📋' : file.name.endsWith('.html') ? '🌐' : file.name.endsWith('.css') ? '🎨' : '📄'}</span>
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

                <div className="flex items-center gap-2 px-3 text-slate-400">
                  <button 
                    onClick={() => setIsLivePreviewOpen(prev => !prev)}
                    className={`p-1.5 rounded hover:bg-white/10 hover:text-white cursor-pointer ${isLivePreviewOpen ? 'text-sky-400' : ''}`}
                    title="Toggle Live Browser Preview"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className="p-1.5 rounded hover:bg-white/10 hover:text-white cursor-pointer"
                    title="Command Palette"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Breadcrumb Path Bar (Matching Image 3) */}
              <div className="h-6 px-4 bg-black border-b border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-[#888888] overflow-hidden truncate">
                <span>workspace</span>
                <span>›</span>
                <span>src</span>
                {(() => {
                  if (activeVsCodeFile.lang === 'java') {
                    const pkgMatch = activeVsCodeFile.content?.match(/package\s+([a-zA-Z0-9_.]+)\s*;/);
                    const pkgParts = pkgMatch ? pkgMatch[1].split('.') : [];
                    const classMatch = activeVsCodeFile.content?.match(/(?:public\s+)?class\s+([A-Za-z0-9_$]+)/);
                    const cls = classMatch ? classMatch[1] : activeVsCodeFile.name.replace('.java', '');
                    return (
                      <>
                        {pkgParts.map(p => (
                          <React.Fragment key={p}>
                            <span>›</span>
                            <span>{p}</span>
                          </React.Fragment>
                        ))}
                        <span>›</span>
                        <span className="text-white font-semibold">{activeVsCodeFile.name}</span>
                        <span>›</span>
                        <span className="text-amber-400 font-medium">{cls}</span>
                        <span>›</span>
                        <span className="text-blue-400">main(String[])</span>
                      </>
                    );
                  }
                  return (
                    <>
                      <span>›</span>
                      <span className="text-white font-semibold">{activeVsCodeFile.name}</span>
                    </>
                  );
                })()}
                <span className="ml-auto text-[10px] text-emerald-400 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{activeVsCodeFile.lang === 'java' ? 'Java Language Server: Running' : 'Copilot Ready'}</span>
                </span>
              </div>

              {/* Code Editor Surface with Optional Split Live Preview */}
              <div className="flex-1 flex overflow-hidden bg-black">
                {/* Genuine Microsoft Monaco Editor Engine */}
                <div className={`h-full overflow-hidden transition-all duration-150 bg-black ${isLivePreviewOpen ? 'w-1/2 border-r border-white/10' : 'w-full'}`}>
                  <Editor
                    height="100%"
                    language={
                      activeVsCodeFile.lang === 'python' ? 'python' :
                      activeVsCodeFile.lang === 'java' ? 'java' :
                      activeVsCodeFile.lang === 'html' ? 'html' :
                      activeVsCodeFile.lang === 'css' ? 'css' :
                      activeVsCodeFile.lang === 'markdown' ? 'markdown' :
                      'javascript'
                    }
                    theme="vs-pitch-black"
                    beforeMount={handleMonacoWillMount}
                    onMount={handleMonacoDidMount}
                    value={activeVsCodeFile.content}
                    onChange={(val) => {
                      const newContent = val || '';
                      setVsCodeFiles(prev => prev.map(f => f.id === activeVsCodeFileId ? { ...f, content: newContent } : f));
                      
                      // Live diagnostics squiggles on type
                      if (activeVsCodeFile.lang === 'java' && vsCodeMonacoRef.current && vsCodeEditorRef.current) {
                        const markers = updateJavaDiagnostics(vsCodeMonacoRef.current, vsCodeEditorRef.current.getModel());
                        if (markers.length > 0) {
                          setVsCodeProblems(markers.map(m => ({
                            file: activeVsCodeFile.name,
                            line: m.startLineNumber,
                            severity: 'error',
                            message: m.message
                          })));
                        } else {
                          setVsCodeProblems([]);
                        }
                      }
                    }}
                    options={{
                      fontSize: 13,
                      fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Menlo, Consolas, monospace",
                      fontLigatures: true,
                      minimap: { enabled: true, side: 'right' },
                      bracketPairColorization: { enabled: true },
                      scrollBeyondLastLine: false,
                      lineNumbers: 'on',
                      renderLineHighlight: 'all',
                      suggestOnTriggerCharacters: true,
                      quickSuggestions: { other: true, comments: true, strings: true },
                      tabSize: 4,
                      automaticLayout: true,
                      wordWrap: 'on',
                      folding: true,
                      autoClosingBrackets: 'always',
                      autoClosingQuotes: 'always',
                      formatOnPaste: true,
                      formatOnType: true,
                      cursorBlinking: 'smooth',
                      smoothScrolling: true,
                      padding: { top: 8, bottom: 8 }
                    }}
                  />
                </div>

                {/* Live Browser Preview Panel */}
                {isLivePreviewOpen && (
                  <div className="w-1/2 h-full flex flex-col bg-[#14161f] overflow-hidden">
                    <div className="h-8 px-3 bg-[#1e2029] border-b border-white/10 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-white">Live Browser Preview</span>
                      </div>
                      <div className="flex-1 max-w-xs px-2 py-0.5 rounded bg-black/40 text-[10px] text-slate-300 font-mono truncate text-center">
                        http://localhost:3000/
                      </div>
                      <button 
                        onClick={() => macSound.playPop()}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                        title="Reload preview"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex-1 bg-white">
                      <iframe
                        title="Live Browser Preview"
                        srcDoc={getLivePreviewDoc()}
                        className="w-full h-full border-none"
                        sandbox="allow-scripts"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Panel (Resizable, Minimizable, Multi-Tab) */}
              {vsCodeBottomTab && (
                <div 
                  style={{
                    height: isVsCodeBottomMinimized ? '28px' : isVsCodeBottomMaximized ? '100%' : `${vsCodeBottomPanelHeight}px`,
                    transition: isDraggingVsCodeBottom ? 'none' : 'height 0.15s ease'
                  }}
                  className={`bg-[#0a0c10] border-t border-[#252526] flex flex-col shrink-0 font-sans relative ${isVsCodeBottomMaximized ? 'absolute inset-0 z-30' : ''}`}
                >
                  {/* Resizer Handle at Top Edge */}
                  {!isVsCodeBottomMinimized && !isVsCodeBottomMaximized && (
                    <div 
                      onMouseDown={(e) => { e.preventDefault(); setIsDraggingVsCodeBottom(true); }}
                      className="absolute -top-1 left-0 right-0 h-2 cursor-row-resize z-20 hover:bg-[#007acc]/60 transition-colors"
                      title="Drag to resize panel (double-click to reset)"
                      onDoubleClick={() => setVsCodeBottomPanelHeight(230)}
                    />
                  )}

                  {/* Panel Header Bar */}
                  <div 
                    onDoubleClick={() => setIsVsCodeBottomMaximized(prev => !prev)}
                    className="h-7 px-3 bg-[#12141a] border-b border-[#252526] flex items-center justify-between text-[11px] font-semibold text-[#cccccc] select-none shrink-0"
                  >
                    {/* Left Tabs */}
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => { setVsCodeBottomTab('problems'); setIsVsCodeBottomMinimized(false); }}
                        className={`hover:text-white cursor-pointer flex items-center gap-1.5 transition ${vsCodeBottomTab === 'problems' && !isVsCodeBottomMinimized ? 'text-white border-b-2 border-[#007acc] pb-0.5' : 'text-[#888888]'}`}
                      >
                        <span>PROBLEMS</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${vsCodeProblems.length > 0 ? 'bg-rose-500 text-white font-bold' : 'bg-white/10 text-slate-400'}`}>
                          {vsCodeProblems.length}
                        </span>
                      </button>
                      <button 
                        onClick={() => { setVsCodeBottomTab('output'); setIsVsCodeBottomMinimized(false); }}
                        className={`hover:text-white cursor-pointer transition ${vsCodeBottomTab === 'output' && !isVsCodeBottomMinimized ? 'text-white border-b-2 border-[#007acc] pb-0.5' : 'text-[#888888]'}`}
                      >
                        OUTPUT
                      </button>
                      <button 
                        onClick={() => { setVsCodeBottomTab('debug'); setIsVsCodeBottomMinimized(false); }}
                        className={`hover:text-white cursor-pointer transition ${vsCodeBottomTab === 'debug' && !isVsCodeBottomMinimized ? 'text-white border-b-2 border-[#007acc] pb-0.5' : 'text-[#888888]'}`}
                      >
                        DEBUG CONSOLE
                      </button>
                      <button 
                        onClick={() => { setVsCodeBottomTab('terminal'); setIsVsCodeBottomMinimized(false); }}
                        className={`hover:text-white cursor-pointer transition ${vsCodeBottomTab === 'terminal' && !isVsCodeBottomMinimized ? 'text-white border-b-2 border-[#007acc] pb-0.5' : 'text-[#888888]'}`}
                      >
                        TERMINAL
                      </button>
                    </div>

                    {/* Right Control Icons */}
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="hidden sm:flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono border border-white/5">
                        <span>1: powershell</span>
                      </div>
                      <button 
                        onClick={() => setVsCodeTerminalOutput(prev => [...prev, '--- Terminal Session Active ---'])}
                        className="p-1 hover:text-white hover:bg-white/10 rounded cursor-pointer transition"
                        title="New Terminal"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setVsCodeTerminalOutput([])}
                        className="p-1 hover:text-white hover:bg-white/10 rounded cursor-pointer transition"
                        title="Clear Terminal Output"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setIsVsCodeBottomMinimized(prev => !prev)}
                        className="p-1 hover:text-white hover:bg-white/10 rounded cursor-pointer transition"
                        title={isVsCodeBottomMinimized ? "Restore Panel" : "Minimize Panel"}
                      >
                        {isVsCodeBottomMinimized ? <ChevronUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <button 
                        onClick={() => { setIsVsCodeBottomMaximized(prev => !prev); setIsVsCodeBottomMinimized(false); }}
                        className="p-1 hover:text-white hover:bg-white/10 rounded cursor-pointer transition"
                        title={isVsCodeBottomMaximized ? "Restore Size" : "Maximize Panel"}
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setIsVsCodeBottomMinimized(true)}
                        className="p-1 hover:text-white hover:bg-white/10 rounded cursor-pointer transition"
                        title="Close Panel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Panel Content (Hidden if Minimized) */}
                  {!isVsCodeBottomMinimized && (
                    <div className="flex-1 p-3 font-mono text-[11px] text-[#cccccc] overflow-y-auto space-y-1">
                      {vsCodeBottomTab === 'terminal' && (
                        <>
                          {vsCodeTerminalOutput.map((line, idx) => (
                            <div 
                              key={idx} 
                              className={
                                line.startsWith('developer@') ? 'text-emerald-400 font-bold' :
                                line.startsWith('[stderr]') ? 'text-rose-400 font-mono font-semibold' :
                                line.includes('completed with exit code 0') ? 'text-emerald-300 font-bold' :
                                line.includes('exit code') ? 'text-amber-400 font-bold' :
                                line.includes('OpenJDK') || line.includes('Python') ? 'text-yellow-400' :
                                'text-[#d4d4d4]'
                              }
                            >
                              {line}
                            </div>
                          ))}

                          <form onSubmit={handleVsCodeTerminalSubmit} className="flex items-center gap-1.5 pt-1">
                            <span className="text-emerald-400 font-bold shrink-0">developer@appletree-mac-pro ~/workspace %</span>
                            <input
                              type="text"
                              value={vsCodeTerminalInput}
                              onChange={(e) => setVsCodeTerminalInput(e.target.value)}
                              className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                              placeholder="type python, javac, node, ls, git..."
                            />
                          </form>
                        </>
                      )}

                      {vsCodeBottomTab === 'problems' && (
                        <div className="space-y-2">
                          {vsCodeProblems.length === 0 ? (
                            <div className="text-slate-400 italic py-2 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              No problems have been detected in the workspace.
                            </div>
                          ) : (
                            vsCodeProblems.map((prob, idx) => (
                              <div key={idx} className="p-2.5 rounded bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                  <span className="font-bold text-white">{prob.file}:{prob.line}</span>
                                  <span className="text-rose-300 font-mono">{prob.message}</span>
                                </div>
                                <button 
                                  onClick={() => handleSendAiPrompt(`Explain and fix this compiler error in ${prob.file}: ${prob.message}`)}
                                  className="px-2 py-1 rounded bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-[10px] font-sans font-bold flex items-center gap-1 cursor-pointer transition"
                                >
                                  <Sparkles className="w-3 h-3" /> Fix with AI
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {vsCodeBottomTab === 'output' && (
                        <div className="space-y-1 text-slate-300">
                          {vsCodeOutputLog.map((log, idx) => (
                            <div key={idx} className="text-sky-300/90">{log}</div>
                          ))}
                        </div>
                      )}

                      {vsCodeBottomTab === 'debug' && (
                        <div className="text-slate-400 italic">
                          [Debug Console connected. No breakpoint halts active.]
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Blue Status Bar (Matching Image 3) */}
              <div className="h-5 bg-[#007acc] text-white px-3 flex items-center justify-between text-[10px] font-sans font-medium select-none shrink-0">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><GitBranch className="w-2.5 h-2.5" /> main*</span>
                  <button 
                    onClick={() => { setVsCodeBottomTab('problems'); setIsVsCodeBottomMinimized(false); }}
                    className="flex items-center gap-1 hover:text-white transition cursor-pointer font-bold"
                  >
                    <AlertCircle className="w-2.5 h-2.5" />
                    <span>⊗ {vsCodeProblems.length} ⚠️ 0</span>
                  </button>
                  {activeVsCodeFile.lang === 'java' && (
                    <>
                      <span className="text-white/80">Java Language Server: Running</span>
                      <span className="text-emerald-300">IntelliSense: Active</span>
                      <span className="text-sky-200">Auto Import: Ready</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span>Ln 1, Col 1</span>
                  <span>Spaces: 4</span>
                  <span>UTF-8</span>
                  <span>LF</span>
                  <span className="font-bold flex items-center gap-1">
                    {activeVsCodeFile.lang === 'java' 
                      ? (
                        <button 
                          onClick={() => openApp('javamanager')} 
                          className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1 font-bold"
                          title="Click to open Java Runtime Manager"
                        >
                          ☕ JavaSE-27 ({detectedRuntimes?.java?.isCompilationReady ? 'OpenJDK 27' : 'JDK Config Required'})
                        </button>
                      ) 
                      : activeVsCodeFile.lang === 'python' ? `🐍 ${detectedRuntimes?.python?.version || 'Python 3.12'}` : '🟢 Node.js 20.18'}
                  </span>
                  <span>Prettier ✓</span>
                  <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5 text-fuchsia-300" /> Copilot Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. REAL SAFARI BROWSER (PRO BROWSER ENGINE) ── */}
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
          <SafariBrowserApp 
            onClose={() => closeWindow('safari')}
            onMinimize={() => minimizeWindow('safari')}
            onMaximize={() => toggleMaximize('safari')}
            isMaximized={windows.safari.isMaximized}
          />
        </div>
      )}

      {/* ── 3. FINDER (FULL POSIX VFS & MULTI-VIEW) ── */}
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
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'finder')}
            className="h-10 px-4 bg-slate-800/80 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
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
            <div className="w-12" />
          </div>

          <FinderApp 
            onOpenFile={(file) => handleOpenFileInEditor(file)}
            onOpenTerminal={() => openApp('terminal')}
            onOpenApp={(appId) => openApp(appId)}
          />
        </div>
      )}

      {/* ── APP STORE (DYNAMIC .WEBAPP ENGINE & CATALOG) ── */}
      {windows.appstore?.isOpen && !windows.appstore.isMinimized && (
        <div
          onClick={() => focusWindow('appstore')}
          style={{
            zIndex: windows.appstore.zIndex,
            left: windows.appstore.isMaximized ? 0 : windows.appstore.x,
            top: windows.appstore.isMaximized ? 26 : windows.appstore.y,
            width: windows.appstore.isMaximized ? '100vw' : windows.appstore.w,
            height: windows.appstore.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.appstore.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/95 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'appstore' ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'appstore')}
            className="h-10 px-4 bg-slate-800/80 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('appstore')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('appstore')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('appstore')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <MacAppStoreIcon className="w-4 h-4" />
              <span>App Store</span>
            </div>
            <div className="w-12" />
          </div>

          <AppStoreApp onLaunchApp={(appId) => openApp(appId)} />
        </div>
      )}

      {/* ── ACTIVITY MONITOR (REAL-TIME CPU/MEM & FORCE QUIT) ── */}
      {windows.activitymonitor?.isOpen && !windows.activitymonitor.isMinimized && (
        <div
          onClick={() => focusWindow('activitymonitor')}
          style={{
            zIndex: windows.activitymonitor.zIndex,
            left: windows.activitymonitor.isMaximized ? 0 : windows.activitymonitor.x,
            top: windows.activitymonitor.isMaximized ? 26 : windows.activitymonitor.y,
            width: windows.activitymonitor.isMaximized ? '100vw' : windows.activitymonitor.w,
            height: windows.activitymonitor.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.activitymonitor.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/95 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'activitymonitor' ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'activitymonitor')}
            className="h-10 px-4 bg-slate-800/80 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('activitymonitor')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('activitymonitor')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('activitymonitor')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <MacActivityMonitorIcon className="w-4 h-4" />
              <span>Activity Monitor</span>
            </div>
            <div className="w-12" />
          </div>

          <ActivityMonitorApp 
            activeWindows={windows}
            onCloseWindow={(winId) => closeWindow(winId)}
          />
        </div>
      )}

      {/* ── DYNAMIC INSTALLED .WEBAPP PACKAGES ── */}
      {Object.values(windows).filter(w => w.isPackage && w.isOpen && !w.isMinimized).map(win => (
        <div
          key={win.id}
          onClick={() => focusWindow(win.id)}
          style={{
            zIndex: win.zIndex,
            left: win.isMaximized ? 0 : win.x,
            top: win.isMaximized ? 26 : win.y,
            width: win.isMaximized ? '100vw' : win.w,
            height: win.isMaximized ? 'calc(100vh - 26px - 80px)' : win.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/98 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === win.id ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, win.id)}
            className="h-10 px-4 bg-slate-800/90 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow(win.id)} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow(win.id)} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize(win.id)} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="text-sm">📦</span>
              <span>{win.title}</span>
              <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-mono">.webapp</span>
            </div>
            <div className="w-12" />
          </div>

          <WebAppRunner appPackage={win.packageData || appRegistry.getApp(win.id)} />
        </div>
      ))}

      {/* ── 4. SYSTEM SETTINGS (COMPREHENSIVE MAC OS SETTINGS APP) ── */}
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
            className="h-10 px-4 bg-[#252526] border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('settings')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('settings')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('settings')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="text-xs font-semibold text-slate-300">System Settings — macOS Sequoia</div>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-hidden">
            <SystemSettingsApp
              currentSettings={{
                ...systemSettings,
                dark_mode: isDarkMode,
                theme: isDarkMode ? 'dark' : 'light',
                wallpaper_url: currentWallpaper,
                screen_brightness: screenBrightness,
                sound_volume: soundVolume,
                is_muted: isMuted,
                dock_size: dockSize,
                dock_position: dockPosition,
                dock_magnification: dockMagnification,
                dock_autohide: dockAutoHide,
                accent_color: accentColor
              }}
              onUpdateSetting={updateSystemSetting}
              currentUser={currentUser}
              onClose={() => closeWindow('settings')}
            />
          </div>
        </div>
      )}

      {/* ── 4B. GAME CENTER (PLAYHOP IN-DESKTOP DISCOVERY & ARCADE) ── */}
      {windows.gamecenter?.isOpen && !windows.gamecenter?.isMinimized && (
        <div
          onClick={() => focusWindow('gamecenter')}
          style={{
            zIndex: windows.gamecenter.zIndex,
            left: windows.gamecenter.isMaximized ? 0 : windows.gamecenter.x,
            top: windows.gamecenter.isMaximized ? 26 : windows.gamecenter.y,
            width: windows.gamecenter.isMaximized ? '100vw' : windows.gamecenter.w,
            height: windows.gamecenter.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.gamecenter.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/95 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'gamecenter' ? 'ring-1 ring-purple-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'gamecenter')}
            className="h-10 px-4 bg-slate-800/90 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('gamecenter')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('gamecenter')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('gamecenter')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="text-xs font-semibold text-slate-300">Game Center — Playhop Edition</div>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-hidden">
            <GameCenterApp
              onLaunchGame={launchGame}
              installedDockGames={installedDockGames}
              onToggleDockGame={toggleDockGame}
              currentUser={currentUser}
            />
          </div>
        </div>
      )}

      {/* ── 4C. NATIVE IN-DESKTOP RUNNING GAMES ── */}
      {Object.values(windows).filter(w => w.isGame && w.isOpen && !w.isMinimized).map(win => (
        <div
          key={win.id}
          onClick={() => focusWindow(win.id)}
          style={{
            zIndex: win.zIndex,
            left: win.isMaximized ? 0 : win.x,
            top: win.isMaximized ? 26 : win.y,
            width: win.isMaximized ? '100vw' : win.w,
            height: win.isMaximized ? 'calc(100vh - 26px)' : win.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-950 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === win.id ? 'ring-1 ring-sky-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, win.id)}
            className="h-8 px-3 bg-slate-900 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow(win.id)} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow(win.id)} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize(win.id)} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate max-w-xs">{win.title}</div>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-hidden">
            <GamePlayerWindow
              game={win.gameData}
              onClose={() => closeWindow(win.id)}
              onToggleDock={() => toggleDockGame(win.gameData?.id)}
              isDocked={installedDockGames.includes(win.gameData?.id)}
              currentUser={currentUser}
            />
          </div>
        </div>
      ))}

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

      {/* ── 6. TERMINAL WINDOW (REAL POSIX VFS & OS COMMANDS) ── */}
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
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-950/98 border border-white/20 shadow-2xl flex flex-col font-mono text-xs transition-all duration-150 ${activeAppId === 'terminal' ? 'ring-1 ring-emerald-400/50' : 'opacity-95'}`}
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
            <div className="text-[11px] font-semibold text-slate-300 font-sans flex items-center gap-2">
              <MacTerminalIcon className="w-3.5 h-3.5" />
              <span>Terminal — zsh (POSIX VFS)</span>
            </div>
            <div className="w-10" />
          </div>

          <TerminalApp 
            onOpenApp={(appId) => openApp(appId)}
            onOpenFile={(file) => handleOpenFileInEditor(file)}
          />
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

      {/* ════════════════ MYSQL STUDIO / WORKBENCH WINDOW ════════════════ */}
      {((windows['mysql-studio']?.isOpen && !windows['mysql-studio'].isMinimized) || (windows.mysqlstudio?.isOpen && !windows.mysqlstudio.isMinimized)) && (() => {
        const win = windows['mysql-studio']?.isOpen ? windows['mysql-studio'] : windows.mysqlstudio;
        const winId = windows['mysql-studio']?.isOpen ? 'mysql-studio' : 'mysqlstudio';
        return (
          <div
            onClick={() => focusWindow(winId)}
            style={{
              zIndex: win.zIndex,
              left: win.isMaximized ? 0 : win.x,
              top: win.isMaximized ? 26 : win.y,
              width: win.isMaximized ? '100vw' : win.w,
              height: win.isMaximized ? 'calc(100vh - 26px - 80px)' : win.h
            }}
            className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-[#f1f3f6] border border-white/30 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === winId ? 'ring-1 ring-blue-500/50' : 'opacity-95'}`}
          >
            {/* Header Chrome */}
            <div
              onMouseDown={(e) => handleMouseDownHeader(e, winId)}
              className="h-9 px-3.5 bg-[#e2e8f0] border-b border-[#cbd5e1] flex items-center justify-between cursor-move select-none"
            >
              <div className="flex items-center gap-2">
                <button onClick={() => { closeWindow('mysql-studio'); closeWindow('mysqlstudio'); }} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-90 transition border border-black/20" />
                <button onClick={() => { minimizeWindow('mysql-studio'); minimizeWindow('mysqlstudio'); }} className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-90 transition border border-black/20" />
                <button onClick={() => { toggleMaximize('mysql-studio'); toggleMaximize('mysqlstudio'); }} className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-90 transition border border-black/20" />
              </div>
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>🐬</span>
                <span>MySQL Studio — LAN/printberry (MySQL 8.4 LTS)</span>
              </span>
              <div className="w-14" />
            </div>
            <MySQLStudioApp onClose={() => { closeWindow('mysql-studio'); closeWindow('mysqlstudio'); }} />
          </div>
        );
      })()}

      {/* ════════════════ JAVA RUNTIME MANAGER WINDOW ════════════════ */}
      {windows.javamanager?.isOpen && !windows.javamanager.isMinimized && (
        <div
          onClick={() => focusWindow('javamanager')}
          style={{
            zIndex: windows.javamanager.zIndex,
            left: windows.javamanager.isMaximized ? 0 : windows.javamanager.x,
            top: windows.javamanager.isMaximized ? 26 : windows.javamanager.y,
            width: windows.javamanager.isMaximized ? '100vw' : windows.javamanager.w,
            height: windows.javamanager.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.javamanager.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-[#1e1e1e] border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'javamanager' ? 'ring-1 ring-amber-400/50' : 'opacity-95'}`}
        >
          {/* Header Chrome */}
          <div
            onMouseDown={(e) => handleMouseDownHeader(e, 'javamanager')}
            className="h-9 px-3.5 bg-[#252526] border-b border-white/10 flex items-center justify-between cursor-move select-none"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('javamanager')} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-90 transition border border-black/20" />
              <button onClick={() => minimizeWindow('javamanager')} className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-90 transition border border-black/20" />
              <button onClick={() => toggleMaximize('javamanager')} className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-90 transition border border-black/20" />
            </div>
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>☕</span>
              <span>Java Runtime Manager</span>
            </span>
            <div className="w-14" />
          </div>
          <JavaRuntimeManagerApp onClose={() => closeWindow('javamanager')} />
        </div>
      )}

      {/* ════════════════ AUTHENTIC REAL macOS SQUIRCLE DOCK ════════════════ */}
      <footer 
        style={{
          transform: dockAutoHide ? (
            dockPosition === 'left' ? 'translateX(-85%)' :
            dockPosition === 'right' ? 'translateX(85%)' :
            'translate(-50%, 85%)'
          ) : (
            dockPosition === 'bottom' ? 'translateX(-50%)' : undefined
          )
        }}
        className={`fixed z-[9999] px-2.5 py-1.5 rounded-2xl backdrop-blur-3xl bg-black/45 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex gap-2 transition-all duration-300 hover:translate-x-0 hover:translate-y-0 ${
          dockPosition === 'left'
            ? 'left-3 top-1/2 -translate-y-1/2 flex-col items-center'
            : dockPosition === 'right'
            ? 'right-3 top-1/2 -translate-y-1/2 flex-col items-center'
            : 'bottom-2.5 left-1/2 items-end'
        }`}
      >
        {[
          { id: 'finder', title: 'Finder', icon: MacFinderIcon },
          { id: 'launchpad', title: 'Launchpad', icon: MacLaunchpadIcon, isAction: true, onClick: () => setIsLaunchpadOpen(true) },
          { id: 'appstore', title: 'App Store', icon: MacAppStoreIcon, badge: 'STORE' },
          { id: 'gamecenter', title: 'Game Center', icon: MacGameCenterIcon, badge: 'GAMES' },
          { id: 'safari', title: 'Safari', icon: MacSafariIcon },
          { id: 'vscode', title: 'Visual Studio Code', icon: MacVSCodeIcon, badge: 'IDE' },
          { id: 'mysql-studio', title: 'MySQL Studio', icon: MacMySQLIcon, badge: '8.4' },
          { id: 'javamanager', title: 'Java Manager', icon: MacJavaIcon, badge: 'JDK' },
          { id: 'terminal', title: 'Terminal', icon: MacTerminalIcon },
          { id: 'activitymonitor', title: 'Activity Monitor', icon: MacActivityMonitorIcon },
          { id: 'terabox', title: 'TeraBox Cloud', icon: MacTeraBoxIcon, badge: '1TB' },
          { id: 'kbc', title: 'KBC Quiz', icon: MacKbcIcon, badge: 'LIVE' },
          { id: 'notes', title: 'Notes', icon: MacNotesIcon },
          { id: 'calculator', title: 'Calculator', icon: MacCalculatorIcon },
          { id: 'settings', title: 'System Settings', icon: MacSettingsIcon },

          // DYNAMIC INSTALLED / PINNED GAMES FROM GAME CENTER
          ...installedDockGames.map(gameId => {
            const rawId = gameId.replace('game-', '');
            const g = getGameById(rawId);
            if (!g) return null;
            const winId = `game-${g.id}`;
            const isOpen = windows[winId]?.isOpen;
            return {
              id: winId,
              title: g.title,
              isCustomGame: true,
              gameData: g,
              isOpen,
              onClick: () => launchGame(g)
            };
          }).filter(Boolean)
        ].map(app => {
          const IconComponent = app.icon;
          const isOpen = app.isCustomGame 
            ? app.isOpen 
            : (windows[app.id]?.isOpen || (app.id === 'mysql-studio' && (windows['mysql-studio']?.isOpen || windows.mysqlstudio?.isOpen)));
          const isBouncing = bouncingApp === app.id;

          return (
            <div key={app.id} className="relative flex flex-col items-center group">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none px-2.5 py-1 rounded-md backdrop-blur-md bg-black/85 text-white text-[10px] font-semibold whitespace-nowrap shadow-md z-50">
                {app.title}
              </div>

              <button
                onClick={() => {
                  if (app.onClick) {
                    macSound.playPop();
                    app.onClick();
                  } else if (isOpen && !windows[app.id]?.isMinimized && activeAppId === app.id) {
                    minimizeWindow(app.id);
                  } else {
                    openApp(app.id);
                  }
                }}
                onContextMenu={(e) => openContextMenu(e, 'dock', app.id, app)}
                style={{ width: `${dockSize}px`, height: `${dockSize}px` }}
                className={`p-0.5 flex items-center justify-center transition-transform duration-200 cursor-pointer relative ${
                  dockMagnification ? 'hover:scale-125 hover:-translate-y-2' : 'hover:scale-105'
                } active:scale-95 ${isBouncing ? 'animate-bounce' : ''}`}
              >
                {app.isCustomGame ? (
                  <div className={`w-full h-full rounded-2xl bg-gradient-to-tr ${app.gameData.iconGradient} flex items-center justify-center text-xl shadow-lg border border-white/20`}>
                    <span>{app.gameData.iconEmoji}</span>
                  </div>
                ) : (
                  <IconComponent className="w-full h-full drop-shadow-xl" />
                )}
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
            Trash (Clean)
          </div>
          <button
            onClick={() => {
              macSound.playTrash();
              vfs.emptyTrash();
              alert('Trash has been emptied.');
            }}
            style={{ width: `${dockSize}px`, height: `${dockSize}px` }}
            className={`p-0.5 flex items-center justify-center transition-transform duration-200 ${
              dockMagnification ? 'hover:scale-125 hover:-translate-y-2' : 'hover:scale-105'
            } cursor-pointer`}
          >
            <MacTrashIcon className="w-full h-full drop-shadow-xl" />
          </button>
          <div className="w-1 h-1 rounded-full mt-1 opacity-0" />
        </div>
      </footer>

      {/* ── SPOTLIGHT SEARCH MODAL (⌘+Space) ── */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onOpenApp={(id) => openApp(id)}
        onOpenFile={(file) => handleOpenFileInEditor(file)}
      />

      {/* ── LAUNCHPAD FULL-SCREEN MODAL ── */}
      <LaunchpadModal
        isOpen={isLaunchpadOpen}
        onClose={() => setIsLaunchpadOpen(false)}
        onLaunchApp={(id) => openApp(id)}
      />

      {/* ── MISSION CONTROL & VIRTUAL SPACES MODAL ── */}
      <MissionControlModal
        isOpen={isMissionControlOpen}
        onClose={() => setIsMissionControlOpen(false)}
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={(wsId) => setActiveWorkspace(wsId)}
        onAddWorkspace={() => {
          setWorkspaces(prev => [...prev, { id: `ws-${Date.now()}`, name: `Desktop ${prev.length + 1}` }]);
        }}
        windows={windows}
        onFocusWindow={(winId) => focusWindow(winId)}
      />

      {/* ── DESKTOP WIDGET GALLERY MODAL (macOS Sonoma / Sequoia) ── */}
      <WidgetGalleryModal
        isOpen={isWidgetGalleryOpen}
        onClose={() => setIsWidgetGalleryOpen(false)}
        onAddWidget={(type, size) => setDesktopWidgets(prev => [...prev, { id: 'w-' + Date.now(), type, size }])}
      />

      {/* ── NOTIFICATION CENTER & TODAY VIEW DRAWER ── */}
      <NotificationCenterDrawer
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onOpenWidgetGallery={() => setIsWidgetGalleryOpen(true)}
      />

      </div>
  );
}
