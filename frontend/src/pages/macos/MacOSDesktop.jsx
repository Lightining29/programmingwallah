import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wifi, Battery, Search, Sliders, X, Minus, Maximize2, 
  Terminal, Code2, Trophy, Compass, Folder, FileText, 
  Settings, Calculator, Trash2, ExternalLink, RefreshCw, 
  Volume2, Sun, Moon, Lock, Play, Copy, Check, Info, 
  GraduationCap, Briefcase, Phone, Sparkles, ChevronRight,
  Monitor, Cpu, HardDrive, ShieldCheck, ArrowLeft, Eye,
  Cloud, CloudRain, Upload, Download, Share2, Plus, 
  CornerDownLeft, Calendar as CalendarIcon, Clock, 
  Layers, AppWindow, ArrowRight, CornerDownRight, CheckCircle2,
  FolderPlus, FilePlus, Edit3
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
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
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
}
const macSound = new MacAudio();

// ── macOS Wallpaper Gallery ──
const WALLPAPERS = [
  {
    id: 'sequoia-dark',
    name: 'macOS Sequoia Night',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2850&q=80',
    type: 'nature'
  },
  {
    id: 'sonoma-horizon',
    name: 'macOS Sonoma Horizon',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2850&q=80',
    type: 'abstract'
  },
  {
    id: 'monterey-glow',
    name: 'macOS Monterey Dark',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=2850&q=80',
    type: 'abstract'
  },
  {
    id: 'cyber-nebula',
    name: 'Deep Space Nebula',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2850&q=80',
    type: 'galaxy'
  },
  {
    id: 'nordic-mountains',
    name: 'Alps Aurora Peak',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2850&q=80',
    type: 'nature'
  }
];

export default function MacOSDesktop() {
  const navigate = useNavigate();

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
      { id: 'terabox', name: 'TeraBox Cloud', type: 'system', icon: 'cloud', targetApp: 'terabox' },
      { id: 'projects', name: 'My Projects', type: 'folder', items: [
        { id: 'p1', name: 'python_practice.py', type: 'file', content: 'print("AppleTree Python Course")' },
        { id: 'p2', name: 'spring_boot_notes.txt', type: 'file', content: 'REST APIs, Microservices, Security' }
      ] },
      { id: 'kbc-icon', name: 'KBC Quiz', type: 'system', icon: 'kbc', targetApp: 'kbc' },
      { id: 'code-icon', name: 'Code Studio', type: 'system', icon: 'code', targetApp: 'code' },
      { id: 'terminal-icon', name: 'Terminal', type: 'system', icon: 'terminal', targetApp: 'terminal' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('appletree_macos_desktop_items', JSON.stringify(desktopItems));
  }, [desktopItems]);

  // ── TeraBox Cloud Storage State ──
  const [teraBoxFiles, setTeraBoxFiles] = useState([
    { id: 'tb-1', name: 'FullStack_Java_Roadmap_2026.pdf', size: '2.4 MB', modified: 'Oct 29, 2026', type: 'pdf', downloads: 142 },
    { id: 'tb-2', name: 'AWS_DevOps_Projects_Bundle.zip', size: '154.2 MB', modified: 'Oct 30, 2026', type: 'archive', downloads: 89 },
    { id: 'tb-3', name: 'Python_AI_Datasets_Collection.tar.gz', size: '320.5 MB', modified: 'Oct 28, 2026', type: 'archive', downloads: 215 },
    { id: 'tb-4', name: 'MERN_Enterprise_Ecommerce_Code.zip', size: '48.9 MB', modified: 'Oct 27, 2026', type: 'archive', downloads: 97 },
    { id: 'tb-5', name: 'Placement_Preparation_QnA.docx', size: '1.8 MB', modified: 'Oct 26, 2026', type: 'doc', downloads: 410 }
  ]);
  const [teraBoxUsedGB, setTeraBoxUsedGB] = useState(527.8);
  const [teraBoxTotalGB] = useState(1024);
  const [teraBoxShareLink, setTeraBoxShareLink] = useState('https://terabox.com/s/1appletree-infotech-vault');
  const [isUploadingTeraBox, setIsUploadingTeraBox] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ── Desktop Context Menu & Selection ──
  const [contextMenu, setContextMenu] = useState(null); // { x, y, targetId }
  const [renamingItemId, setRenamingItemId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // ── Desktop Configuration & UI Controls ──
  const [currentWallpaper, setCurrentWallpaper] = useState(WALLPAPERS[0].url);
  const [isLocked, setIsLocked] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'apple', 'controlCenter', 'spotlight', 'calendar', 'topFile', etc.
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundVolume, setSoundVolume] = useState(85);
  const [screenBrightness, setScreenBrightness] = useState(95);

  // ── Bouncing App in Dock on launch ──
  const [bouncingApp, setBouncingApp] = useState(null);

  // ── Window Management State ──
  const [highestZ, setHighestZ] = useState(20);
  const [activeAppId, setActiveAppId] = useState('finder');

  const [windows, setWindows] = useState({
    finder: {
      id: 'finder',
      title: 'Finder — AppleTree Vault',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      x: 60,
      y: 50,
      w: 860,
      h: 530,
      folderPath: 'root'
    },
    terabox: {
      id: 'terabox',
      title: 'TeraBox Cloud Drive (1024 GB Free Storage)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 11,
      x: 100,
      y: 60,
      w: 840,
      h: 540
    },
    terminal: {
      id: 'terminal',
      title: 'Terminal — zsh (80x24)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 12,
      x: 140,
      y: 90,
      w: 740,
      h: 470
    },
    safari: {
      id: 'safari',
      title: 'Safari — AppleTree Web Explorer',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 13,
      x: 110,
      y: 50,
      w: 920,
      h: 580,
      url: 'https://programmingwala.com/programs',
      tabTitle: 'Courses & Programs'
    },
    kbc: {
      id: 'kbc',
      title: 'KBC Quiz Arena — Live Competition',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 14,
      x: 90,
      y: 45,
      w: 900,
      h: 580
    },
    code: {
      id: 'code',
      title: 'Code Studio — Python & Web Sandbox',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 15,
      x: 150,
      y: 70,
      w: 880,
      h: 550
    },
    notes: {
      id: 'notes',
      title: 'Notes',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 16,
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
      zIndex: 17,
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
      zIndex: 18,
      x: 190,
      y: 80,
      w: 780,
      h: 520
    },
    aboutMac: {
      id: 'aboutMac',
      title: 'About This Mac',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 25,
      x: 290,
      y: 130,
      w: 440,
      h: 380
    }
  });

  // Focus and Bring Window to Front
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
    if (e.target.closest('button')) return; // Ignore traffic lights clicks
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

  // ── Folder & Desktop Operations (Creating, Renaming, Deleting) ──
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

  const createNewTextFile = (fileName = 'untitled.txt') => {
    macSound.playPop();
    const newFile = {
      id: `file-${Date.now()}`,
      name: fileName,
      type: 'file',
      content: ''
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

  // ── Desktop Right-Click Context Menu ──
  const handleDesktopContextMenu = (e) => {
    e.preventDefault();
    macSound.playClick();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 260),
      targetId: null
    });
  };

  // ── Keyboard Shortcuts (⌘+Space, ⌘+Shift+N, Escape) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.code === 'Space')) {
        e.preventDefault();
        setActiveMenu(prev => prev === 'spotlight' ? null : 'spotlight');
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNewFolder();
      }
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setContextMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [desktopItems]);

  // ── Interactive Terminal with Filesystem Commands ──
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'sys', text: ' AppleTree macOS Sequoia [Version 15.2.0 (Build 24C101)]' },
    { type: 'sys', text: 'Type "help" to view full command suite or "mkdir <name>" to create desktop folders.' },
    { type: 'input', cmd: 'neofetch', output: '' },
    { type: 'output', text: `
                 OS: macOS Sequoia 15.2 (AppleTree Edition)
             Host: AppleTree Mac Studio (M3 Max 16-Core)
           Kernel: Darwin 24.2.0
         Uptime: 1 hour, 15 mins
         Shell: zsh 5.9 (x86_64-apple-darwin24.0)
           CPU: Apple M3 Max (16 Cores, 4.05 GHz)
             Memory: 24576MiB / 65536MiB
                 TeraBox: 527.8 GB / 1024 GB (Active Sync)` }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalPath, setTerminalPath] = useState('~/Desktop');
  const terminalBottomRef = useRef(null);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    let response = '';
    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim();

    if (mainCmd === 'help') {
      response = `macOS AppleTree Terminal Utilities:
  • mkdir <folder>   - Create a new folder directly on Desktop / Finder
  • touch <file>     - Create a new file on Desktop
  • rm <name>        - Delete folder or file
  • ls               - List files & folders in current path
  • pwd              - Print current working directory
  • cat <file>       - Read file content
  • terabox          - Launch TeraBox Cloud Storage (1024 GB)
  • kbc              - Launch Kaun Banega Crorepati quiz app
  • safari [url]     - Open Safari browser with optional link
  • python [file]    - Launch Python & Web Code Studio
  • neofetch         - Display AppleTree Mac system architecture
  • clear            - Clear terminal history
  • exit             - Close terminal`;
    } else if (mainCmd === 'mkdir') {
      if (!arg) {
        response = 'usage: mkdir <directory_name>';
      } else {
        createNewFolder(arg);
        response = `Folder "${arg}" created on Desktop!`;
      }
    } else if (mainCmd === 'touch') {
      if (!arg) {
        response = 'usage: touch <file_name>';
      } else {
        createNewTextFile(arg);
        response = `File "${arg}" created on Desktop!`;
      }
    } else if (mainCmd === 'rm') {
      if (!arg) {
        response = 'usage: rm <file_or_folder_name>';
      } else {
        const found = desktopItems.find(i => i.name.toLowerCase() === arg.toLowerCase());
        if (found) {
          deleteDesktopItem(found.id);
          response = `Removed "${found.name}" from Desktop.`;
        } else {
          response = `rm: ${arg}: No such file or directory`;
        }
      }
    } else if (mainCmd === 'ls') {
      const names = desktopItems.map(i => i.type === 'folder' ? `${i.name}/` : i.name).join('   ');
      response = names || '(empty directory)';
    } else if (mainCmd === 'pwd') {
      response = `/Users/developer/${terminalPath.replace('~/', '')}`;
    } else if (mainCmd === 'terabox') {
      openApp('terabox');
      response = 'Opening TeraBox Cloud Drive...';
    } else if (mainCmd === 'kbc') {
      openApp('kbc');
      response = 'Launching KBC Master Arena in macOS window...';
    } else if (mainCmd === 'safari') {
      openApp('safari');
      if (arg) {
        setWindows(c => ({
          ...c,
          safari: { ...c.safari, url: arg.startsWith('http') ? arg : `https://${arg}`, tabTitle: arg }
        }));
      }
      response = `Opening Safari Browser (${arg || 'AppleTree Programs'})...`;
    } else if (mainCmd === 'python' || mainCmd === 'code') {
      openApp('code');
      response = 'Launching Python Code Studio Playground...';
    } else if (mainCmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (mainCmd === 'exit') {
      closeWindow('terminal');
      setTerminalInput('');
      return;
    } else if (mainCmd === 'neofetch') {
      response = `
                 OS: macOS Sequoia 15.2 (AppleTree Edition)
             Host: AppleTree Mac Studio (M3 Max 16-Core)
           Kernel: Darwin 24.2.0
         Uptime: 1 hour, 15 mins
         Shell: zsh 5.9 (x86_64-apple-darwin24.0)
           CPU: Apple M3 Max (16 Cores, 4.05 GHz)
             Memory: 24576MiB / 65536MiB
                 TeraBox: 527.8 GB / 1024 GB (Active Sync)`;
    } else if (mainCmd === 'date') {
      response = new Date().toString();
    } else if (mainCmd === 'whoami') {
      response = 'developer@appletree-mac-pro';
    } else {
      response = `zsh: command not found: ${cmd}. Type "help" to see all commands.`;
    }

    setTerminalHistory(prev => [
      ...prev,
      { type: 'input', cmd },
      { type: 'output', text: response }
    ]);
    setTerminalInput('');
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // ── TeraBox Cloud Storage Upload Simulation ──
  const handleSimulateTeraBoxUpload = () => {
    setIsUploadingTeraBox(true);
    setUploadProgress(10);
    macSound.playPop();

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingTeraBox(false);
            setUploadProgress(0);
            macSound.playPop();
            const newFile = {
              id: `tb-${Date.now()}`,
              name: `Uploaded_Project_${Math.floor(Math.random() * 900 + 100)}.zip`,
              size: `${(Math.random() * 40 + 5).toFixed(1)} MB`,
              modified: 'Just now',
              type: 'archive',
              downloads: 1
            };
            setTeraBoxFiles(cur => [newFile, ...cur]);
            setTeraBoxUsedGB(g => parseFloat((g + 0.1).toFixed(1)));
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  // ── Calculator State ──
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState(null);
  const [calcOp, setCalcOp] = useState(null);
  const [calcClearOnNext, setCalcClearOnNext] = useState(false);

  const handleCalcNumber = (digit) => {
    macSound.playClick();
    if (calcClearOnNext || calcDisplay === '0') {
      setCalcDisplay(String(digit));
      setCalcClearOnNext(false);
    } else {
      setCalcDisplay(prev => prev + digit);
    }
  };

  const handleCalcOp = (op) => {
    macSound.playClick();
    setCalcPrev(parseFloat(calcDisplay));
    setCalcOp(op);
    setCalcClearOnNext(true);
  };

  const handleCalcEquals = () => {
    macSound.playPop();
    if (calcOp === null || calcPrev === null) return;
    const current = parseFloat(calcDisplay);
    let result = 0;
    if (calcOp === '+') result = calcPrev + current;
    if (calcOp === '-') result = calcPrev - current;
    if (calcOp === '×') result = calcPrev * current;
    if (calcOp === '÷') result = current !== 0 ? calcPrev / current : 'Error';
    setCalcDisplay(String(result));
    setCalcOp(null);
    setCalcPrev(null);
    setCalcClearOnNext(true);
  };

  // ── Notes State ──
  const [notesContent, setNotesContent] = useState(() => {
    return localStorage.getItem('appletree_macos_notes') || 
`#  AppleTree Infotech — Student Notes

Welcome to the full macOS Operating System Experience!
• Create real folders on Desktop and inside Finder
• Run zsh commands in Terminal (mkdir, ls, rm, neofetch, python)
• TeraBox Cloud Storage connected with 1024 GB free cloud vault
• Safari Browser with multi-tabs and bookmarks
• Everything runs seamlessly without page refreshes!`;
  });

  useEffect(() => {
    localStorage.setItem('appletree_macos_notes', notesContent);
  }, [notesContent]);

  // ── Code Studio State ──
  const [codeContent, setCodeContent] = useState(
`# AppleTree Infotech Code Studio — Python 3.12
def generate_placement_roadmap():
    skills = ["Java Full Stack", "AWS DevOps", "Python AI", "MERN Stack"]
    print("🚀 Flagship Industry Programs:")
    for idx, skill in enumerate(skills, start=1):
        print(f"  {idx}. {skill} — 100% Placement Support")

generate_placement_roadmap()
`
  );
  const [codeOutput, setCodeOutput] = useState('');
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  const runCode = () => {
    macSound.playPop();
    setIsCodeRunning(true);
    setCodeOutput('Compiling in AppleTree Sandbox Runner...\n');
    setTimeout(() => {
      setIsCodeRunning(false);
      setCodeOutput(
`🚀 Flagship Industry Programs:
  1. Java Full Stack — 100% Placement Support
  2. AWS DevOps — 100% Placement Support
  3. Python AI — 100% Placement Support
  4. MERN Stack — 100% Placement Support

[Process completed with exit code 0]`
      );
    }, 600);
  };

  // ── Safari Browser Navigation & Tabs ──
  const [safariTabs, setSafariTabs] = useState([
    { id: 'tab-1', title: 'Courses & Programs', url: 'https://programmingwala.com/programs' },
    { id: 'tab-2', title: 'Tech Careers', url: 'https://programmingwala.com/careers' },
    { id: 'tab-3', title: 'TeraBox Web Vault', url: 'https://terabox.com' }
  ]);
  const [activeSafariTabId, setActiveSafariTabId] = useState('tab-1');
  const [safariInputUrl, setSafariInputUrl] = useState('https://programmingwala.com/programs');

  const handleSafariNavigate = (e) => {
    if (e) e.preventDefault();
    macSound.playClick();
    const finalUrl = safariInputUrl.startsWith('http') ? safariInputUrl : `https://${safariInputUrl}`;
    setSafariTabs(tabs => tabs.map(t => t.id === activeSafariTabId ? { ...t, url: finalUrl, title: finalUrl.replace('https://', '') } : t));
  };

  // ── Selected Desktop Folder Preview inside Finder ──
  const [selectedFolderInFinder, setSelectedFolderInFinder] = useState(null);

  const openFolderInFinder = (folderItem) => {
    setSelectedFolderInFinder(folderItem);
    openApp('finder');
  };

  return (
    <div 
      className={`fixed inset-0 w-screen h-screen overflow-hidden select-none font-sans ${isDarkMode ? 'dark text-white' : 'text-slate-900'}`}
      style={{
        backgroundImage: `url(${currentWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: `brightness(${screenBrightness}%)`
      }}
      onClick={() => {
        if (activeMenu) setActiveMenu(null);
        if (contextMenu) setContextMenu(null);
        if (renamingItemId) handleFinishRename();
      }}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* ════════════════ TOP macOS MENU BAR ════════════════ */}
      <header 
        className="fixed top-0 left-0 right-0 h-6.5 z-[9999] px-3 flex items-center justify-between text-xs font-medium text-white/95 backdrop-blur-2xl bg-black/40 border-b border-white/10 shadow-sm transition-all"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {/* Left Side: Apple Logo & App Dropdown Menus */}
        <div className="flex items-center gap-3">
          {/*  Apple Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'apple' ? null : 'apple')}
              className="text-base font-semibold hover:opacity-75 transition-opacity px-1.5 flex items-center cursor-pointer"
              title="Apple Menu"
            >
              
            </button>

            {activeMenu === 'apple' && (
              <div className="absolute top-7 left-0 w-60 rounded-xl backdrop-blur-2xl bg-slate-950/90 border border-white/15 p-1.5 shadow-2xl z-50 text-slate-100 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button 
                  onClick={() => { openApp('aboutMac'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>About This Mac</span>
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
                  onClick={() => { openApp('terabox'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer text-sky-300 hover:text-white"
                >
                  <span className="flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5" /> TeraBox Cloud Drive</span>
                  <span className="text-[10px] bg-sky-500/30 px-1 rounded text-sky-200">1 TB</span>
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={() => { createNewFolder(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>New Desktop Folder</span>
                  <span className="text-[10px] text-white/40">⇧⌘N</span>
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

          {/* Current Active App Name */}
          <span className="font-extrabold tracking-tight capitalize text-white">
            {windows[activeAppId]?.title?.split('—')[0]?.split('(')[0]?.trim() || 'Finder'}
          </span>

          {/* Native Dropdown Menus: File, Edit, View, Go, Window, Help */}
          <div className="hidden sm:flex items-center gap-3 text-white/80 text-[11px]">
            {/* File Menu */}
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'fileMenu' ? null : 'fileMenu')} 
                className="hover:text-white transition cursor-pointer"
              >
                File
              </button>
              {activeMenu === 'fileMenu' && (
                <div className="absolute top-6 left-0 w-52 rounded-xl backdrop-blur-2xl bg-slate-950/90 border border-white/15 p-1.5 shadow-2xl z-50 text-slate-100 text-xs animate-in fade-in duration-100">
                  <button onClick={() => { createNewFolder(); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center justify-between">
                    <span>New Folder</span>
                    <span className="text-[10px] text-white/40">⇧⌘N</span>
                  </button>
                  <button onClick={() => { createNewTextFile(); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center justify-between">
                    <span>New Text Document</span>
                  </button>
                  <button onClick={() => { openApp('finder'); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center justify-between">
                    <span>New Finder Window</span>
                    <span className="text-[10px] text-white/40">⌘N</span>
                  </button>
                  <div className="h-px bg-white/10 my-1" />
                  <button onClick={() => { closeWindow(activeAppId); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-600 flex items-center justify-between">
                    <span>Close Active Window</span>
                    <span className="text-[10px] text-white/40">⌘W</span>
                  </button>
                </div>
              )}
            </div>

            {/* Edit Menu */}
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'editMenu' ? null : 'editMenu')} 
                className="hover:text-white transition cursor-pointer"
              >
                Edit
              </button>
              {activeMenu === 'editMenu' && (
                <div className="absolute top-6 left-0 w-44 rounded-xl backdrop-blur-2xl bg-slate-950/90 border border-white/15 p-1.5 shadow-2xl z-50 text-slate-100 text-xs">
                  <button onClick={() => { openApp('notes'); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center justify-between">
                    <span>Open Notes</span>
                  </button>
                  <button onClick={() => { setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center justify-between">
                    <span>Copy</span>
                    <span className="text-[10px] text-white/40">⌘C</span>
                  </button>
                  <button onClick={() => { setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center justify-between">
                    <span>Paste</span>
                    <span className="text-[10px] text-white/40">⌘V</span>
                  </button>
                </div>
              )}
            </div>

            {/* View Menu */}
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'viewMenu' ? null : 'viewMenu')} 
                className="hover:text-white transition cursor-pointer"
              >
                View
              </button>
              {activeMenu === 'viewMenu' && (
                <div className="absolute top-6 left-0 w-48 rounded-xl backdrop-blur-2xl bg-slate-950/90 border border-white/15 p-1.5 shadow-2xl z-50 text-slate-100 text-xs">
                  <button onClick={() => { setIsDarkMode(!isDarkMode); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center justify-between">
                    <span>Toggle Dark Mode</span>
                    <span>{isDarkMode ? '🌙' : '☀️'}</span>
                  </button>
                  <button onClick={() => { openApp('settings'); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center justify-between">
                    <span>Change Wallpapers...</span>
                  </button>
                </div>
              )}
            </div>

            {/* Go Menu */}
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === 'goMenu' ? null : 'goMenu')} 
                className="hover:text-white transition cursor-pointer"
              >
                Go
              </button>
              {activeMenu === 'goMenu' && (
                <div className="absolute top-6 left-0 w-52 rounded-xl backdrop-blur-2xl bg-slate-950/90 border border-white/15 p-1.5 shadow-2xl z-50 text-slate-100 text-xs">
                  <button onClick={() => { openApp('terabox'); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                    <Cloud className="w-3.5 h-3.5 text-sky-400" /> TeraBox Cloud Drive
                  </button>
                  <button onClick={() => { openApp('finder'); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5 text-blue-400" /> Course Vault
                  </button>
                  <button onClick={() => { openApp('terminal'); setActiveMenu(null); }} className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-600 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-purple-400" /> Terminal (~/Desktop)
                  </button>
                </div>
              )}
            </div>

            {/* Help */}
            <button onClick={() => openApp('aboutMac')} className="hover:text-white transition cursor-pointer">
              Help
            </button>
          </div>
        </div>

        {/* Right Side: Battery, Wi-Fi, Spotlight, Control Center, Clock, Calendar */}
        <div className="flex items-center gap-3">
          {/* Quick Exit to Web */}
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-bold text-amber-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Exit macOS</span>
          </Link>

          {/* Battery */}
          <div className="flex items-center gap-1 opacity-90 text-[11px]">
            <span>100%</span>
            <Battery className="w-4 h-4 text-emerald-400 rotate-90" />
          </div>

          {/* Wi-Fi */}
          <Wifi className="w-3.5 h-3.5 text-white/90" />

          {/* Spotlight Search Toggle */}
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

            {/* Control Center Flyout */}
            {activeMenu === 'controlCenter' && (
              <div className="absolute top-7 right-0 w-72 rounded-2xl backdrop-blur-3xl bg-slate-950/90 border border-white/15 p-3.5 shadow-2xl z-50 text-slate-100 text-xs animate-in fade-in duration-150 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-blue-400" /> Control Center</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">● Active</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="font-bold text-[11px]">Wi-Fi</p>
                      <p className="text-[9px] text-white/60">AppleTree-HighSpeed</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsDarkMode(!isDarkMode); macSound.playClick(); }}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition flex items-center gap-2 text-left cursor-pointer"
                  >
                    {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    <div>
                      <p className="font-bold text-[11px]">Dark Mode</p>
                      <p className="text-[9px] text-white/60">{isDarkMode ? 'On' : 'Off'}</p>
                    </div>
                  </button>
                </div>

                {/* TeraBox Cloud Quick Status */}
                <div 
                  onClick={() => { openApp('terabox'); setActiveMenu(null); }}
                  className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-400/30 hover:bg-sky-500/25 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    <div>
                      <p className="font-bold text-[11px] text-sky-200">TeraBox Cloud Drive</p>
                      <p className="text-[9px] text-sky-300/80">{teraBoxUsedGB} GB of 1024 GB used</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-sky-400 text-slate-950 font-black">OPEN</span>
                </div>

                {/* Display Brightness */}
                <div className="p-2.5 rounded-xl bg-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400" /> Display</span>
                    <span>{screenBrightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="100"
                    value={screenBrightness}
                    onChange={(e) => setScreenBrightness(e.target.value)}
                    className="w-full accent-blue-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Sound Volume */}
                <div className="p-2.5 rounded-xl bg-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-blue-400" /> Sound</span>
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

          {/* Calendar & Clock Button */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'calendar' ? null : 'calendar')}
              className="font-semibold text-white/95 tracking-wide text-[11px] hover:opacity-80 transition cursor-pointer"
            >
              {formatMacDate(currentTime)}
            </button>

            {/* Calendar Notification Center Dropdown */}
            {activeMenu === 'calendar' && (
              <div className="absolute top-7 right-0 w-64 rounded-2xl backdrop-blur-3xl bg-slate-950/90 border border-white/15 p-4 shadow-2xl z-50 text-slate-100 text-xs animate-in fade-in duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-amber-300">{currentTime.toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="py-3 text-center">
                  <div className="text-3xl font-extralight text-white mb-1">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-1">
                  <p className="font-bold text-emerald-400">● Today's Schedule</p>
                  <p className="text-slate-300">Java Full Stack & AWS DevOps Workshop</p>
                  <p className="text-[9px] text-slate-500">AppleTree Infotech RDC Center</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ════════════════ SPOTLIGHT SEARCH (Cmd+Space / Ctrl+K) ════════════════ */}
      {activeMenu === 'spotlight' && (
        <div 
          className="fixed inset-0 z-[99990] flex items-start justify-center pt-24 bg-black/45 backdrop-blur-md"
          onClick={() => setActiveMenu(null)}
        >
          <div 
            className="w-full max-w-lg rounded-2xl backdrop-blur-3xl bg-slate-900/90 border border-white/20 shadow-2xl p-3 text-white animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
              <Search className="w-5 h-5 text-blue-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Spotlight Search: Launch apps, TeraBox, courses, files..."
                value={spotlightQuery}
                onChange={(e) => setSpotlightQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none text-white placeholder-white/40"
              />
              <span className="text-[10px] text-white/40 bg-white/10 px-2 py-0.5 rounded">esc</span>
            </div>

            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              {[
                { name: 'TeraBox Cloud Storage (1024 GB)', id: 'terabox', icon: Cloud, desc: 'Sync and manage cloud files' },
                { name: 'Finder (Course Vault)', id: 'finder', icon: Folder, desc: 'Browse learning tracks & certificates' },
                { name: 'Safari Browser', id: 'safari', icon: Compass, desc: 'Browse web & AppleTree programs' },
                { name: 'KBC Quiz Arena', id: 'kbc', icon: Trophy, desc: 'Play live tech competition' },
                { name: 'Terminal', id: 'terminal', icon: Terminal, desc: 'Interactive zsh command line with mkdir/ls' },
                { name: 'Code Studio', id: 'code', icon: Code2, desc: 'Write and test Python code' },
                { name: 'Notes', id: 'notes', icon: FileText, desc: 'Persistent student notes' },
                { name: 'Calculator', id: 'calculator', icon: Calculator, desc: 'Apple standard calculator' },
                { name: 'System Settings', id: 'settings', icon: Settings, desc: 'Change wallpaper & appearance' }
              ]
                .filter(a => a.name.toLowerCase().includes(spotlightQuery.toLowerCase()) || a.desc.toLowerCase().includes(spotlightQuery.toLowerCase()))
                .map(app => {
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => { openApp(app.id); setActiveMenu(null); }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-600 transition text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-blue-300 group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{app.name}</p>
                          <p className="text-[10px] text-white/60 group-hover:text-white/80">{app.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white" />
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ DESKTOP ICONS GRID (Folders & Apps) ════════════════ */}
      <div className="absolute top-10 right-4 flex flex-col gap-4 items-center z-10 max-h-[calc(100vh-100px)] flex-wrap">
        {desktopItems.map(item => {
          let IconComponent = Folder;
          let iconColor = 'text-sky-400';
          if (item.type === 'system') {
            if (item.icon === 'cloud') { IconComponent = Cloud; iconColor = 'text-sky-300'; }
            else if (item.icon === 'kbc') { IconComponent = Trophy; iconColor = 'text-amber-400'; }
            else if (item.icon === 'code') { IconComponent = Code2; iconColor = 'text-emerald-400'; }
            else if (item.icon === 'terminal') { IconComponent = Terminal; iconColor = 'text-purple-400'; }
          } else if (item.type === 'file') {
            IconComponent = FileText;
            iconColor = 'text-slate-300';
          }

          const isRenaming = renamingItemId === item.id;

          return (
            <div
              key={item.id}
              onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
                macSound.playClick();
                setContextMenu({ x: e.clientX, y: e.clientY, targetId: item.id, item });
              }}
              onDoubleClick={() => {
                macSound.playPop();
                if (item.targetApp) {
                  openApp(item.targetApp);
                } else if (item.type === 'folder') {
                  openFolderInFinder(item);
                } else if (item.type === 'file') {
                  openApp('notes');
                  if (item.content) setNotesContent(item.content);
                }
              }}
              className="flex flex-col items-center group cursor-pointer focus:outline-none w-20 text-center"
            >
              <div className="w-14 h-14 rounded-2xl backdrop-blur-xl bg-black/45 border border-white/20 p-2.5 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:bg-black/65 transition-all">
                <IconComponent className={`w-8 h-8 ${iconColor}`} />
              </div>

              {isRenaming ? (
                <input
                  type="text"
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleFinishRename}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleFinishRename(); }}
                  className="mt-1 w-full bg-blue-600/90 text-white text-[11px] font-semibold text-center rounded px-1 outline-none border border-blue-400"
                />
              ) : (
                <span className="mt-1 text-[11px] font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] px-1.5 py-0.5 rounded group-hover:bg-blue-600/70 transition line-clamp-2 max-w-full">
                  {item.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ════════════════ DESKTOP RIGHT-CLICK CONTEXT MENU ════════════════ */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-[99998] w-52 rounded-xl backdrop-blur-2xl bg-slate-950/90 border border-white/20 shadow-2xl p-1.5 text-xs text-slate-100 animate-in fade-in duration-75 space-y-0.5"
        >
          {contextMenu.targetId ? (
            <>
              <button
                onClick={() => {
                  macSound.playPop();
                  const it = contextMenu.item;
                  if (it?.targetApp) openApp(it.targetApp);
                  else if (it?.type === 'folder') openFolderInFinder(it);
                  else openApp('notes');
                  setContextMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between font-semibold"
              >
                <span>Open</span>
              </button>
              <button
                onClick={() => handleStartRename(contextMenu.item)}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span>Rename...</span>
                <Edit3 className="w-3 h-3 opacity-60" />
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => deleteDesktopItem(contextMenu.targetId)}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white flex items-center justify-between text-rose-300 font-bold"
              >
                <span>Move to Trash</span>
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => createNewFolder()}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between font-semibold"
              >
                <span className="flex items-center gap-2"><FolderPlus className="w-3.5 h-3.5 text-sky-400" /> New Folder</span>
                <span className="text-[10px] text-white/40">⇧⌘N</span>
              </button>
              <button
                onClick={() => createNewTextFile()}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><FilePlus className="w-3.5 h-3.5 text-slate-300" /> New Document</span>
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => { openApp('terabox'); setContextMenu(null); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center gap-2 text-sky-300"
              >
                <Cloud className="w-3.5 h-3.5" /> TeraBox Cloud Vault
              </button>
              <button
                onClick={() => { openApp('terminal'); setContextMenu(null); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5 text-purple-400" /> Open in Terminal
              </button>
              <button
                onClick={() => { openApp('settings'); setContextMenu(null); }}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5 text-slate-300" /> Change Wallpaper...
              </button>
            </>
          )}
        </div>
      )}

      {/* ════════════════ WINDOWS RENDERING ════════════════ */}

      {/* ── 1. TERABOX CLOUD DRIVE WINDOW ── */}
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
          {/* Header */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'terabox')}
            className="h-11 px-4 bg-gradient-to-r from-sky-950/80 to-slate-900 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('terabox')} className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 cursor-pointer" title="Close" />
              <button onClick={() => minimizeWindow('terabox')} className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 cursor-pointer" title="Minimize" />
              <button onClick={() => toggleMaximize('terabox')} className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer" title="Maximize" />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
              <Cloud className="w-4 h-4 text-sky-400" />
              <span>TeraBox Cloud Storage — 1024 GB Ultra Free Storage</span>
            </div>

            <a 
              href={teraBoxShareLink}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-sky-300 hover:text-white flex items-center gap-1 font-bold bg-sky-500/20 px-2 py-0.5 rounded border border-sky-400/30"
            >
              <span>TeraBox Web</span> <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Body: Cloud Quota Card + File Explorer */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/60">
            {/* Storage Progress Card */}
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

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateTeraBoxUpload}
                  disabled={isUploadingTeraBox}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingTeraBox ? `Uploading (${uploadProgress}%)...` : 'Upload to TeraBox'}</span>
                </button>
                <a
                  href="https://terabox.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Connect TeraBox
                </a>
              </div>
            </div>

            {/* Upload Progress Bar if active */}
            {isUploadingTeraBox && (
              <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-400/40 animate-pulse">
                <div className="flex justify-between text-xs text-sky-200 mb-1">
                  <span>Uploading project archive to TeraBox cloud...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Cloud Files Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/60">
              <div className="grid grid-cols-12 px-4 py-2.5 bg-slate-800/80 text-[11px] font-bold text-slate-400 border-b border-white/10 uppercase tracking-wider">
                <div className="col-span-6">File Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Date Modified</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-white/5">
                {teraBoxFiles.map(file => (
                  <div key={file.id} className="grid grid-cols-12 px-4 py-3 text-xs items-center hover:bg-white/5 transition group">
                    <div className="col-span-6 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                        {file.type === 'pdf' ? <FileText className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
                      </div>
                      <span className="font-semibold text-white group-hover:text-sky-300 transition truncate">{file.name}</span>
                    </div>
                    <div className="col-span-2 text-slate-400 text-[11px]">{file.size}</div>
                    <div className="col-span-2 text-slate-400 text-[11px]">{file.modified}</div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          macSound.playPop();
                          alert(`Downloading ${file.name} from TeraBox Cloud...`);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                        title="Download File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          macSound.playPop();
                          navigator.clipboard.writeText(`${teraBoxShareLink}/${file.id}`);
                          alert(`TeraBox share link copied to clipboard!`);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                        title="Copy TeraBox Share Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. FINDER WINDOW (Course Vault & Folder Explorer) ── */}
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
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/95 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'finder' ? 'ring-1 ring-white/30' : 'opacity-95'}`}
        >
          {/* Header */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'finder')}
            className="h-11 px-4 bg-slate-800/80 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('finder')} className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 cursor-pointer" />
              <button onClick={() => minimizeWindow('finder')} className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 cursor-pointer" />
              <button onClick={() => toggleMaximize('finder')} className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 cursor-pointer" />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Folder className="w-3.5 h-3.5 text-blue-400" />
              <span>{selectedFolderInFinder ? selectedFolderInFinder.name : 'AppleTree Course Vault — Finder'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => createNewFolder()}
                className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white font-bold flex items-center gap-1 cursor-pointer"
                title="Create New Folder"
              >
                <Plus className="w-2.5 h-2.5" /> Folder
              </button>
            </div>
          </div>

          {/* Body: Sidebar + Main Area */}
          <div className="flex-1 flex overflow-hidden">
            <div className="w-48 bg-slate-950/60 border-r border-white/10 p-3 flex flex-col gap-1 text-xs shrink-0">
              <span className="text-[10px] font-black uppercase text-slate-400 px-2 py-1">Favorites</span>
              <button 
                onClick={() => setSelectedFolderInFinder(null)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium transition cursor-pointer ${!selectedFolderInFinder ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Programs & Tracks
              </button>
              <button 
                onClick={() => openApp('terabox')}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium text-sky-300 hover:bg-sky-500/20 transition cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" /> TeraBox Cloud
              </button>
              <button 
                onClick={() => openApp('terminal')}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-300 hover:bg-white/10 transition cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" /> Terminal (~/)
              </button>
              <button 
                onClick={() => openApp('kbc')}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5" /> KBC Quiz Arena
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              {selectedFolderInFinder ? (
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Folder className="w-5 h-5 text-sky-400" />
                      <h3 className="text-sm font-bold text-white">{selectedFolderInFinder.name}</h3>
                    </div>
                    <button onClick={() => setSelectedFolderInFinder(null)} className="text-xs text-blue-400 hover:underline">
                      Back to All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(selectedFolderInFinder.items || []).map((subItem, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-300" />
                        <div>
                          <p className="text-xs font-semibold text-white">{subItem.name}</p>
                          <p className="text-[10px] text-slate-400">{subItem.type}</p>
                        </div>
                      </div>
                    ))}
                    {(!selectedFolderInFinder.items || selectedFolderInFinder.items.length === 0) && (
                      <p className="text-xs text-slate-400 col-span-2 py-8 text-center">Folder is currently empty. Create files using Terminal or New Document!</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Java Full Stack & Spring Boot.app', tag: 'Core', size: '120 Hours', icon: Code2, action: () => { openApp('safari'); setSafariInputUrl('https://programmingwala.com/programs'); } },
                    { name: 'AWS Cloud & DevOps Engineering.app', tag: 'Cloud', size: '90 Hours', icon: Cpu, action: () => { openApp('safari'); setSafariInputUrl('https://programmingwala.com/careers/aws-cloud-engineer'); } },
                    { name: 'Python AI & Machine Learning.app', tag: 'AI', size: '110 Hours', icon: Sparkles, action: () => openApp('code') },
                    { name: 'TeraBox 1024 GB Cloud Storage.app', tag: 'Drive', size: '1 TB Vault', icon: Cloud, action: () => openApp('terabox') },
                    { name: 'KBC Interactive Quiz Arena.app', tag: 'Exam', size: 'Live Competition', icon: Trophy, action: () => openApp('kbc') }
                  ].map((file, idx) => {
                    const Icon = file.icon;
                    return (
                      <div
                        key={idx}
                        onClick={file.action}
                        className="p-3.5 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-400/40 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-blue-300 transition">{file.name}</p>
                            <p className="text-[10px] text-slate-400">{file.size} · Certified Track</p>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-bold group-hover:bg-blue-500 group-hover:text-white">
                          Open
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. SAFARI BROWSER WINDOW (No Page Refreshes) ── */}
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
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/98 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'safari' ? 'ring-1 ring-white/30' : 'opacity-95'}`}
        >
          {/* Safari Header & Tab Bar */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'safari')}
            className="bg-slate-800/90 border-b border-white/10 cursor-move shrink-0"
          >
            {/* Top Row: Traffic Lights + URL Bar */}
            <div className="h-11 px-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button onClick={() => closeWindow('safari')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
                <button onClick={() => minimizeWindow('safari')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
                <button onClick={() => toggleMaximize('safari')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
              </div>

              {/* URL Address Bar */}
              <form onSubmit={handleSafariNavigate} className="flex-1 max-w-lg mx-auto h-7 px-3 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2 text-xs text-slate-300">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={safariInputUrl}
                  onChange={(e) => setSafariInputUrl(e.target.value)}
                  className="w-full bg-transparent outline-none text-white text-xs"
                />
              </form>

              <div className="flex items-center gap-2 text-slate-400">
                <RefreshCw onClick={handleSafariNavigate} className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                <button onClick={() => window.open(safariInputUrl, '_blank')} title="Open in real browser tab">
                  <ExternalLink className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                </button>
              </div>
            </div>

            {/* Safari Tabs Bar */}
            <div className="flex items-center gap-1 px-3 pb-1.5 overflow-x-auto text-xs">
              {safariTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    macSound.playClick();
                    setActiveSafariTabId(tab.id);
                    setSafariInputUrl(tab.url);
                  }}
                  className={`px-3 py-1 rounded-lg flex items-center gap-2 text-[11px] font-semibold transition cursor-pointer ${
                    activeSafariTabId === tab.id ? 'bg-slate-900 text-white border border-white/10 shadow-sm' : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <Compass className="w-3 h-3 text-sky-400" />
                  <span className="truncate max-w-[120px]">{tab.title}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  macSound.playPop();
                  const newTab = { id: `tab-${Date.now()}`, title: 'New Tab', url: 'https://programmingwala.com' };
                  setSafariTabs(cur => [...cur, newTab]);
                  setActiveSafariTabId(newTab.id);
                  setSafariInputUrl(newTab.url);
                }}
                className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-xs"
                title="New Tab"
              >
                +
              </button>
            </div>
          </div>

          {/* Bookmarks Bar */}
          <div className="h-7 px-4 bg-slate-900/80 border-b border-white/5 flex items-center gap-4 text-[11px] text-slate-400 overflow-x-auto">
            <button onClick={() => { setSafariInputUrl('https://programmingwala.com'); handleSafariNavigate(); }} className="hover:text-white flex items-center gap-1 cursor-pointer">
              🍎 AppleTree Home
            </button>
            <button onClick={() => { setSafariInputUrl('https://programmingwala.com/programs'); handleSafariNavigate(); }} className="hover:text-white flex items-center gap-1 cursor-pointer">
              🎓 All Courses
            </button>
            <button onClick={() => { setSafariInputUrl('https://programmingwala.com/careers'); handleSafariNavigate(); }} className="hover:text-white flex items-center gap-1 cursor-pointer">
              💼 Career Tracks
            </button>
            <button onClick={() => { setSafariInputUrl('https://terabox.com'); handleSafariNavigate(); }} className="hover:text-sky-300 text-sky-400 flex items-center gap-1 cursor-pointer">
              ☁️ TeraBox Cloud
            </button>
          </div>

          {/* Safari Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-950/70">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <h1 className="text-2xl font-black text-white mb-2">
                  <span className="text-red-500">Apple</span><span className="text-emerald-500">Tree</span> Infotech Web Explorer
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
                  Master Java Full Stack, AWS DevOps, Python AI, React & MERN with guaranteed career placement support in Ghaziabad, Noida & Delhi NCR.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button onClick={() => openApp('kbc')} className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer">
                    🏆 Launch KBC Arena
                  </button>
                  <button onClick={() => openApp('terabox')} className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black cursor-pointer">
                    ☁️ Open TeraBox Cloud
                  </button>
                  <button onClick={() => openApp('code')} className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer">
                    ⚡ Code Studio
                  </button>
                </div>
              </div>

              {/* In-Browser Course Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white text-xs mb-1">Full Stack Java & Spring Boot</h4>
                  <p className="text-[10px] text-slate-400">Microservices, Hibernate, Kafka & Enterprise Architecture</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white text-xs mb-1">AWS DevOps Cloud Architect</h4>
                  <p className="text-[10px] text-slate-400">Docker, Kubernetes, Terraform, CI/CD Pipeline & Linux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. TERMINAL WINDOW ── */}
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
          {/* Header */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'terminal')}
            className="h-10 px-4 bg-slate-900 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('terminal')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('terminal')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('terminal')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="text-[11px] font-semibold text-slate-400">developer — zsh — 80×24</div>
            <div className="w-10" />
          </div>

          {/* Terminal Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 text-emerald-400">
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="leading-relaxed">
                {item.type === 'sys' && <p className="text-slate-400">{item.text}</p>}
                {item.type === 'input' && (
                  <p className="text-white">
                    <span className="text-emerald-400 font-bold">developer@appletree-mac</span>
                    <span className="text-blue-400"> {terminalPath} %</span> {item.cmd}
                  </p>
                )}
                {item.type === 'output' && <pre className="whitespace-pre-wrap text-emerald-300 font-mono text-[11px]">{item.text}</pre>}
              </div>
            ))}

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-1">
              <span className="text-emerald-400 font-bold shrink-0">developer@appletree-mac</span>
              <span className="text-blue-400 shrink-0">{terminalPath} %</span>
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

      {/* ── 5. KBC MASTER QUIZ WINDOW ── */}
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
              Real-time countdown timer, dynamic points addition and subtraction, and live moving leaderboard!
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/kbc')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" /> Join Contestant Screen
              </button>
              <button
                onClick={() => navigate('/dashboard/admin/kbc')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/10 cursor-pointer"
              >
                Host Monitor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. CODE STUDIO WINDOW ── */}
      {windows.code.isOpen && !windows.code.isMinimized && (
        <div
          onClick={() => focusWindow('code')}
          style={{
            zIndex: windows.code.zIndex,
            left: windows.code.isMaximized ? 0 : windows.code.x,
            top: windows.code.isMaximized ? 26 : windows.code.y,
            width: windows.code.isMaximized ? '100vw' : windows.code.w,
            height: windows.code.isMaximized ? 'calc(100vh - 26px - 80px)' : windows.code.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-950/98 border border-white/20 shadow-2xl flex flex-col font-mono transition-all duration-150 ${activeAppId === 'code' ? 'ring-1 ring-emerald-400/50' : 'opacity-95'}`}
        >
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'code')}
            className="h-11 px-4 bg-slate-900 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('code')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('code')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('code')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 font-sans">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>AppleTree Code Studio (Python 3.12 Sandbox)</span>
            </div>
            <button
              onClick={runCode}
              disabled={isCodeRunning}
              className="px-3.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-sans flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" /> {isCodeRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 p-4 bg-slate-950/80 border-r border-white/10 flex flex-col">
              <div className="text-[11px] font-sans text-slate-400 mb-2 flex items-center justify-between">
                <span>main.py</span>
                <span>Python 3.12 Ready</span>
              </div>
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="flex-1 w-full bg-transparent text-emerald-300 font-mono text-xs outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
            <div className="w-full md:w-80 p-4 bg-black/60 flex flex-col">
              <span className="text-[11px] font-sans text-slate-400 mb-2">Terminal Output</span>
              <pre className="flex-1 font-mono text-[11px] text-slate-200 whitespace-pre-wrap overflow-y-auto">
                {codeOutput || '// Click "Run Code" to compile...'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. NOTES WINDOW ── */}
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
            <div className="text-xs font-semibold text-slate-300">Notes (Auto-Saved)</div>
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

      {/* ── 8. CALCULATOR WINDOW ── */}
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

      {/* ── 9. SYSTEM SETTINGS WINDOW ── */}
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
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/98 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'settings' ? 'ring-1 ring-white/30' : 'opacity-95'}`}
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
            <div className="text-xs font-semibold text-slate-300">System Settings — Desktop & Wallpaper</div>
            <div className="w-10" />
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Desktop Wallpaper Gallery</h3>
              <p className="text-xs text-slate-400">Select authentic macOS wallpapers (Sequoia, Sonoma, Monterey, Deep Space)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-semibold text-white drop-shadow">{wp.name}</span>
                  </div>
                </div>
              ))}
            </div>
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
              <p className="text-xs text-slate-400">macOS Sequoia 15.2 (Build 24C101)</p>
            </div>

            <div className="w-full space-y-1.5 text-xs text-slate-300 pt-2 border-t border-white/10 max-w-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Chip:</span>
                <span className="font-semibold text-white">Apple M3 Max (16-Core)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Memory:</span>
                <span className="font-semibold text-white">64 GB Unified Memory</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cloud Storage:</span>
                <span className="font-semibold text-sky-400">TeraBox 1024 GB (Active Sync)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Institution:</span>
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

      {/* ════════════════ AUTHENTIC macOS FROSTED DOCK ════════════════ */}
      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9999] px-3 py-2 rounded-2xl backdrop-blur-3xl bg-white/20 dark:bg-black/40 border border-white/20 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-end gap-2.5 transition-all">
        {[
          { id: 'finder', title: 'Finder', icon: Folder, color: 'from-blue-500 to-sky-400' },
          { id: 'terabox', title: 'TeraBox Cloud', icon: Cloud, color: 'from-sky-400 to-blue-600', badge: '1TB' },
          { id: 'safari', title: 'Safari', icon: Compass, color: 'from-sky-400 to-blue-500' },
          { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'from-slate-800 to-slate-950' },
          { id: 'code', title: 'Code Studio', icon: Code2, color: 'from-emerald-500 to-teal-600' },
          { id: 'kbc', title: 'KBC Quiz', icon: Trophy, color: 'from-amber-400 to-yellow-600', badge: 'LIVE' },
          { id: 'notes', title: 'Notes', icon: FileText, color: 'from-amber-300 to-yellow-500' },
          { id: 'calculator', title: 'Calculator', icon: Calculator, color: 'from-orange-400 to-amber-500' },
          { id: 'settings', title: 'System Settings', icon: Settings, color: 'from-slate-400 to-slate-600' }
        ].map(app => {
          const Icon = app.icon;
          const isOpen = windows[app.id]?.isOpen;
          const isBouncing = bouncingApp === app.id;

          return (
            <div key={app.id} className="relative flex flex-col items-center group">
              {/* Tooltip on hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none px-2.5 py-1 rounded-md backdrop-blur-md bg-black/80 text-white text-[10px] font-semibold whitespace-nowrap shadow-md">
                {app.title}
              </div>

              {/* App Icon Button */}
              <button
                onClick={() => {
                  if (isOpen && !windows[app.id].isMinimized && activeAppId === app.id) {
                    minimizeWindow(app.id);
                  } else {
                    openApp(app.id);
                  }
                }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${app.color} p-2 flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-125 hover:-translate-y-2 active:scale-95 cursor-pointer relative ${
                  isBouncing ? 'animate-bounce' : ''
                }`}
              >
                <Icon className="w-6 h-6 drop-shadow-sm" />
                {app.badge && (
                  <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-red-600 text-white text-[8px] font-black animate-pulse">
                    {app.badge}
                  </span>
                )}
              </button>

              {/* Running Indicator Dot under open app */}
              <div className={`w-1 h-1 rounded-full mt-1 transition-all ${isOpen ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]' : 'opacity-0'}`} />
            </div>
          );
        })}

        {/* Separator Line */}
        <div className="w-px h-10 bg-white/20 self-center mx-1" />

        {/* Trash */}
        <div className="relative flex flex-col items-center group">
          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none px-2.5 py-1 rounded-md backdrop-blur-md bg-black/80 text-white text-[10px] font-semibold whitespace-nowrap shadow-md">
            Trash
          </div>
          <button
            onClick={() => {
              macSound.playTrash();
              alert('Trash is clean and empty!');
            }}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-600 to-slate-800 p-2 flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-125 hover:-translate-y-2 cursor-pointer"
          >
            <Trash2 className="w-6 h-6 text-slate-300" />
          </button>
          <div className="w-1 h-1 rounded-full mt-1 opacity-0" />
        </div>
      </footer>

      {/* ════════════════ LOCK SCREEN OVERLAY ════════════════ */}
      {isLocked && (
        <div className="fixed inset-0 z-[99999] backdrop-blur-3xl bg-black/60 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
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
              <p className="font-bold text-base">Guest Developer</p>
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
