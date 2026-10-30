import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wifi, Battery, Search, Sliders, X, Minus, Maximize2, 
  Terminal, Code2, Trophy, Compass, Folder, FileText, 
  Settings, Calculator, Trash2, ExternalLink, RefreshCw, 
  Volume2, Sun, Moon, Lock, Play, Copy, Check, Info, 
  GraduationCap, Briefcase, Phone, Sparkles, ChevronRight,
  Monitor, Cpu, HardDrive, ShieldCheck, ArrowLeft, Eye
} from 'lucide-react';

// ── Wallpapers Library ──
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

  // ── Clock State ──
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

  // ── Desktop Configuration & UI Controls ──
  const [currentWallpaper, setCurrentWallpaper] = useState(WALLPAPERS[0].url);
  const [isLocked, setIsLocked] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'apple', 'controlCenter', 'spotlight', etc.
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundVolume, setSoundVolume] = useState(85);
  const [screenBrightness, setScreenBrightness] = useState(95);

  // ── Window Management State ──
  const [highestZ, setHighestZ] = useState(10);
  const [activeAppId, setActiveAppId] = useState('finder');

  const [windows, setWindows] = useState({
    finder: {
      id: 'finder',
      title: 'Finder — AppleTree Vault',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      x: 80,
      y: 60,
      w: 820,
      h: 520
    },
    terminal: {
      id: 'terminal',
      title: 'Terminal — zsh (80x24)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 11,
      x: 140,
      y: 90,
      w: 720,
      h: 460
    },
    kbc: {
      id: 'kbc',
      title: 'KBC Master Arena — Live Quiz Competition',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 12,
      x: 100,
      y: 50,
      w: 880,
      h: 560
    },
    code: {
      id: 'code',
      title: 'Code Studio — Python & Web Playground',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 13,
      x: 160,
      y: 70,
      w: 860,
      h: 540
    },
    safari: {
      id: 'safari',
      title: 'Safari — AppleTree Infotech',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 14,
      x: 120,
      y: 60,
      w: 900,
      h: 560
    },
    notes: {
      id: 'notes',
      title: 'Notes',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 15,
      x: 220,
      y: 110,
      w: 640,
      h: 460
    },
    calculator: {
      id: 'calculator',
      title: 'Calculator',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 16,
      x: 320,
      y: 120,
      w: 300,
      h: 420
    },
    settings: {
      id: 'settings',
      title: 'System Settings',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 17,
      x: 190,
      y: 80,
      w: 760,
      h: 500
    },
    aboutMac: {
      id: 'aboutMac',
      title: 'About This Mac',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 25,
      x: 280,
      y: 140,
      w: 420,
      h: 360
    }
  });

  // Bring Window to Front
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
    setHighestZ(prev => {
      const nextZ = prev + 1;
      setWindows(curr => ({
        ...curr,
        [id]: { ...curr[id], isOpen: true, isMinimized: false, zIndex: nextZ }
      }));
      return nextZ;
    });
    setActiveAppId(id);
  };

  const closeWindow = (id) => {
    setWindows(curr => ({
      ...curr,
      [id]: { ...curr[id], isOpen: false, isMaximized: false }
    }));
  };

  const minimizeWindow = (id) => {
    setWindows(curr => ({
      ...curr,
      [id]: { ...curr[id], isMinimized: true }
    }));
  };

  const toggleMaximize = (id) => {
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
            y: Math.max(28, dragRef.current.winY + dy)
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

  // Keyboard shortcut: Cmd+Space or Ctrl+K for Spotlight
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.code === 'Space')) {
        e.preventDefault();
        setActiveMenu(prev => prev === 'spotlight' ? null : 'spotlight');
      }
      if (e.key === 'Escape') {
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Mini Apps Implementations ──

  // 1. Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState(null);
  const [calcOp, setCalcOp] = useState(null);
  const [calcClearOnNext, setCalcClearOnNext] = useState(false);

  const handleCalcNumber = (digit) => {
    if (calcClearOnNext || calcDisplay === '0') {
      setCalcDisplay(String(digit));
      setCalcClearOnNext(false);
    } else {
      setCalcDisplay(prev => prev + digit);
    }
  };

  const handleCalcOp = (op) => {
    setCalcPrev(parseFloat(calcDisplay));
    setCalcOp(op);
    setCalcClearOnNext(true);
  };

  const handleCalcEquals = () => {
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

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcPrev(null);
    setCalcOp(null);
  };

  // 2. Interactive Terminal State
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'sys', text: 'AppleTree macOS Sequoia [Version 15.2.0 (Build 24C101)]' },
    { type: 'sys', text: 'Type "help" to see available commands or "neofetch" for system info.' },
    { type: 'input', cmd: 'whoami', output: 'guest@appletree-mac-pro ~ %' },
    { type: 'output', text: 'Welcome to AppleTree Infotech Interactive Terminal!' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef(null);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    let response = '';
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      response = `Available Commands:
  • neofetch    - Display AppleTree Mac system architecture
  • ls          - List directories in student vault
  • cat <file>  - Read course catalogs & notes
  • kbc         - Launch Kaun Banega Crorepati quiz app
  • python      - Test Python compiler interactive shell
  • courses     - View flagship tech placement tracks
  • clear       - Clear terminal window
  • exit        - Close terminal`;
    } else if (lower === 'neofetch') {
      response = `
               OS: macOS Sequoia 15.2 (AppleTree Edition)
           Host: AppleTree Mac Studio (M3 Max 16-Core)
         Kernel: Darwin 24.2.0
       Uptime: 42 mins
       Packages: 1042 (homebrew)
         Shell: zsh 5.9
           Terminal: Apple_Terminal
               CPU: Apple M3 Max (16 cores, 4.05 GHz)
                      Memory: 18432MiB / 65536MiB
                      Placement Partner: AppleTree Infotech Ghaziabad`;
    } else if (lower === 'ls') {
      response = `📁 Courses/     📁 Python_AI/    📁 Java_FullStack/    📁 AWS_DevOps/
📁 KBC_Quizzes/ 📄 resume.pdf    📄 placement_report_2026.txt`;
    } else if (lower.startsWith('cat')) {
      response = `[AppleTree Course Curriculum 2026]
- 100% Guaranteed Placement Assistance in MNCs
- Live Project Development & Production Deployments
- Full Stack Java, AWS Cloud, MERN, Python Machine Learning`;
    } else if (lower === 'kbc') {
      openApp('kbc');
      response = 'Launching KBC Quiz Application in macOS window...';
    } else if (lower === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (lower === 'exit') {
      closeWindow('terminal');
      setTerminalInput('');
      return;
    } else if (lower.includes('python')) {
      openApp('code');
      response = 'Launching Python & Web Code Studio...';
    } else {
      response = `zsh: command not found: ${cmd}. Type "help" for a list of commands.`;
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

  // 3. Notes State
  const [notesContent, setNotesContent] = useState(
    `#  AppleTree Infotech Notes\n\n- Welcome to macOS Desktop Experience!\n- Practice coding in Code Studio\n- Challenge yourself in KBC Quiz\n- Review course roadmap in Finder\n\nAll notes are stored directly in your session.`
  );

  // 4. Code Studio State
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [codeContent, setCodeContent] = useState(
`# Welcome to AppleTree Code Studio on macOS!
def greet(name):
    return f"Hello, {name}! Welcome to AppleTree Infotech."

print(greet("Developer"))
print("Status: 100% Placement Ready 🚀")
`
  );
  const [codeOutput, setCodeOutput] = useState('');
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  const runCode = () => {
    setIsCodeRunning(true);
    setCodeOutput('Compiling and executing on AppleTree Cloud Runner...\n');
    setTimeout(() => {
      setIsCodeRunning(false);
      setCodeOutput('Hello, Developer! Welcome to AppleTree Infotech.\nStatus: 100% Placement Ready 🚀\n\n[Process completed with exit code 0]');
    }, 700);
  };

  // ── Finder File System Simulation ──
  const [finderFolder, setFinderFolder] = useState('courses');
  const courseFiles = [
    { name: 'Java Full Stack & Spring Boot.app', tag: 'Core', size: '120 Hours', icon: Code2, action: () => navigate('/programs') },
    { name: 'AWS Cloud & DevOps Engineering.app', tag: 'Cloud', size: '90 Hours', icon: Cpu, action: () => navigate('/careers/aws-cloud-engineer') },
    { name: 'Python AI & Machine Learning.app', tag: 'AI', size: '110 Hours', icon: Sparkles, action: () => navigate('/programs') },
    { name: 'React.js & MERN Stack.app', tag: 'Web', size: '80 Hours', icon: Monitor, action: () => navigate('/programs') },
    { name: 'KBC Interactive Quiz Arena.app', tag: 'Exam', size: 'Live', icon: Trophy, action: () => openApp('kbc') }
  ];

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
      }}
    >
      {/* ════════════════ TOP macOS MENU BAR ════════════════ */}
      <header 
        className="fixed top-0 left-0 right-0 h-7 z-[9999] px-3 flex items-center justify-between text-xs font-medium text-white/95 backdrop-blur-2xl bg-black/35 border-b border-white/10 shadow-sm transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Apple Logo & App Menus */}
        <div className="flex items-center gap-4">
          {/* Apple Logo  */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'apple' ? null : 'apple')}
              className="text-base font-semibold hover:opacity-75 transition-opacity px-1 flex items-center cursor-pointer"
              title="Apple Menu"
            >
              
            </button>

            {/* Apple Menu Dropdown */}
            {activeMenu === 'apple' && (
              <div className="absolute top-7 left-0 w-56 rounded-xl backdrop-blur-2xl bg-slate-950/85 border border-white/15 p-1.5 shadow-2xl z-50 text-slate-100 text-xs animate-in fade-in zoom-in-95 duration-100">
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
                  <Settings className="w-3.5 h-3.5 opacity-60" />
                </button>
                <button 
                  onClick={() => { openApp('finder'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>App Store (Course Vault)</span>
                  <GraduationCap className="w-3.5 h-3.5 opacity-60" />
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button 
                  onClick={() => { setIsLocked(true); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Lock Screen</span>
                  <Lock className="w-3.5 h-3.5 opacity-60" />
                </button>
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
          <span className="font-bold tracking-tight capitalize">
            {windows[activeAppId]?.title?.split('—')[0]?.trim() || 'Finder'}
          </span>

          {/* Contextual App Menu Items */}
          <div className="hidden sm:flex items-center gap-3 text-white/80 text-[11px]">
            <button 
              onClick={() => openApp('finder')} 
              className="hover:text-white transition cursor-pointer"
            >
              File
            </button>
            <button 
              onClick={() => openApp('notes')} 
              className="hover:text-white transition cursor-pointer"
            >
              Edit
            </button>
            <button 
              onClick={() => openApp('settings')} 
              className="hover:text-white transition cursor-pointer"
            >
              View
            </button>
            <button 
              onClick={() => openApp('terminal')} 
              className="hover:text-white transition cursor-pointer"
            >
              Window
            </button>
            <button 
              onClick={() => openApp('aboutMac')} 
              className="hover:text-white transition cursor-pointer"
            >
              Help
            </button>
          </div>
        </div>

        {/* Right Side: Battery, Wi-Fi, Spotlight, Control Center, Clock */}
        <div className="flex items-center gap-3">
          {/* Quick Exit Pill */}
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-bold text-amber-300 hover:text-white transition"
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
            className="hover:opacity-75 transition-opacity cursor-pointer"
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

            {/* Control Center Popup */}
            {activeMenu === 'controlCenter' && (
              <div className="absolute top-7 right-0 w-72 rounded-2xl backdrop-blur-2xl bg-slate-950/85 border border-white/15 p-3.5 shadow-2xl z-50 text-slate-100 text-xs animate-in fade-in duration-150 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold">Control Center</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">● Connected</span>
                </div>

                {/* Quick Toggles Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="font-bold text-[11px]">Wi-Fi</p>
                      <p className="text-[9px] text-white/60">AppleTree-5G</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition flex items-center gap-2 text-left cursor-pointer"
                  >
                    {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    <div>
                      <p className="font-bold text-[11px]">Dark Mode</p>
                      <p className="text-[9px] text-white/60">{isDarkMode ? 'On' : 'Off'}</p>
                    </div>
                  </button>
                </div>

                {/* Display Brightness Slider */}
                <div className="p-2.5 rounded-xl bg-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400" /> Display</span>
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

                {/* Sound Volume Slider */}
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

          {/* Live macOS Clock */}
          <span className="font-semibold text-white/95 tracking-wide text-[11px]">
            {formatMacDate(currentTime)}
          </span>
        </div>
      </header>

      {/* ════════════════ SPOTLIGHT SEARCH (Cmd+Space) ════════════════ */}
      {activeMenu === 'spotlight' && (
        <div 
          className="fixed inset-0 z-[99990] flex items-start justify-center pt-24 bg-black/40 backdrop-blur-md"
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
                placeholder="Spotlight Search: Type app, course, or command..."
                value={spotlightQuery}
                onChange={(e) => setSpotlightQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none text-white placeholder-white/40"
              />
              <span className="text-[10px] text-white/40 bg-white/10 px-2 py-0.5 rounded">esc</span>
            </div>

            {/* Quick App Suggestions */}
            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider px-2 py-1">Applications</div>
              {[
                { name: 'Finder (Course Vault)', id: 'finder', icon: Folder, desc: 'Browse learning tracks' },
                { name: 'KBC Quiz Arena', id: 'kbc', icon: Trophy, desc: 'Play live tech competition' },
                { name: 'Terminal', id: 'terminal', icon: Terminal, desc: 'Interactive zsh command line' },
                { name: 'Code Studio', id: 'code', icon: Code2, desc: 'Write and test Python & web code' },
                { name: 'Safari', id: 'safari', icon: Compass, desc: 'Browse AppleTree website' },
                { name: 'Notes', id: 'notes', icon: FileText, desc: 'Take persistent notes' },
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

      {/* ════════════════ DESKTOP ICONS GRID ════════════════ */}
      <div className="absolute top-10 right-4 flex flex-col gap-5 items-center z-10">
        {[
          { id: 'finder', title: 'Course Vault', icon: Folder, color: 'text-sky-400' },
          { id: 'kbc', title: 'KBC Quiz', icon: Trophy, color: 'text-amber-400' },
          { id: 'code', title: 'Code Studio', icon: Code2, color: 'text-emerald-400' },
          { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'text-purple-400' },
          { id: 'notes', title: 'My Notes', icon: FileText, color: 'text-yellow-300' },
          { id: 'settings', title: 'Settings', icon: Settings, color: 'text-slate-300' }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onDoubleClick={() => openApp(item.id)}
              onClick={() => openApp(item.id)}
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <div className="w-14 h-14 rounded-2xl backdrop-blur-xl bg-black/40 border border-white/20 p-2.5 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:bg-black/60 transition-all">
                <Icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <span className="mt-1 text-[11px] font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] px-1.5 py-0.5 rounded group-hover:bg-blue-600/60 transition">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* ════════════════ WINDOWS RENDERING ════════════════ */}

      {/* ── 1. FINDER / COURSE VAULT WINDOW ── */}
      {windows.finder.isOpen && !windows.finder.isMinimized && (
        <div
          onClick={() => focusWindow('finder')}
          style={{
            zIndex: windows.finder.zIndex,
            left: windows.finder.isMaximized ? 0 : windows.finder.x,
            top: windows.finder.isMaximized ? 28 : windows.finder.y,
            width: windows.finder.isMaximized ? '100vw' : windows.finder.w,
            height: windows.finder.isMaximized ? 'calc(100vh - 28px - 80px)' : windows.finder.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/95 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'finder' ? 'ring-1 ring-white/30' : 'opacity-95'}`}
        >
          {/* Mac Window Header Bar */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'finder')}
            className="h-11 px-4 bg-slate-800/80 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            {/* Traffic Light Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => closeWindow('finder')}
                className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-[8px] text-rose-950 font-black cursor-pointer group"
                title="Close"
              >
                <X className="w-2 h-2 opacity-0 group-hover:opacity-100" />
              </button>
              <button 
                onClick={() => minimizeWindow('finder')}
                className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-[8px] text-amber-950 font-black cursor-pointer group"
                title="Minimize"
              >
                <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100" />
              </button>
              <button 
                onClick={() => toggleMaximize('finder')}
                className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-[8px] text-emerald-950 font-black cursor-pointer group"
                title="Maximize"
              >
                <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100" />
              </button>
            </div>

            {/* Window Title */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Folder className="w-3.5 h-3.5 text-blue-400" />
              <span>AppleTree Course Vault — Finder</span>
            </div>

            <div className="w-12 text-right">
              <button 
                onClick={() => navigate('/programs')}
                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Full Web</span> <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Window Body: Sidebar + File List */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 bg-slate-950/60 border-r border-white/10 p-3 flex flex-col gap-1 text-xs shrink-0">
              <span className="text-[10px] font-black uppercase text-slate-400 px-2 py-1">Favorites</span>
              <button 
                onClick={() => setFinderFolder('courses')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium transition cursor-pointer ${finderFolder === 'courses' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Courses
              </button>
              <button 
                onClick={() => setFinderFolder('exams')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium transition cursor-pointer ${finderFolder === 'exams' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}
              >
                <Trophy className="w-3.5 h-3.5" /> KBC Tests
              </button>
              <button 
                onClick={() => setFinderFolder('placements')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium transition cursor-pointer ${finderFolder === 'placements' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}
              >
                <Briefcase className="w-3.5 h-3.5" /> Placements
              </button>
            </div>

            {/* Main Area */}
            <div className="flex-1 p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Folder className="w-4 h-4 text-sky-400" />
                  <span>Flagship Programs & Industry Applications</span>
                </h3>
                <span className="text-xs text-slate-400">{courseFiles.length} items</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courseFiles.map((file, idx) => {
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
            </div>
          </div>
        </div>
      )}

      {/* ── 2. TERMINAL WINDOW ── */}
      {windows.terminal.isOpen && !windows.terminal.isMinimized && (
        <div
          onClick={() => focusWindow('terminal')}
          style={{
            zIndex: windows.terminal.zIndex,
            left: windows.terminal.isMaximized ? 0 : windows.terminal.x,
            top: windows.terminal.isMaximized ? 28 : windows.terminal.y,
            width: windows.terminal.isMaximized ? '100vw' : windows.terminal.w,
            height: windows.terminal.isMaximized ? 'calc(100vh - 28px - 80px)' : windows.terminal.h
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
            <div className="text-[11px] font-semibold text-slate-400">guest — zsh — 80×24</div>
            <div className="w-10" />
          </div>

          {/* Terminal Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 text-emerald-400">
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="leading-relaxed">
                {item.type === 'sys' && <p className="text-slate-400">{item.text}</p>}
                {item.type === 'input' && (
                  <p className="text-white">
                    <span className="text-emerald-400 font-bold">guest@appletree-mac</span>
                    <span className="text-blue-400"> ~ %</span> {item.cmd}
                  </p>
                )}
                {item.type === 'output' && <pre className="whitespace-pre-wrap text-emerald-300 font-mono text-[11px]">{item.text}</pre>}
              </div>
            ))}

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-1">
              <span className="text-emerald-400 font-bold shrink-0">guest@appletree-mac</span>
              <span className="text-blue-400 shrink-0">~ %</span>
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

      {/* ── 3. KBC QUIZ ARENA WINDOW ── */}
      {windows.kbc.isOpen && !windows.kbc.isMinimized && (
        <div
          onClick={() => focusWindow('kbc')}
          style={{
            zIndex: windows.kbc.zIndex,
            left: windows.kbc.isMaximized ? 0 : windows.kbc.x,
            top: windows.kbc.isMaximized ? 28 : windows.kbc.y,
            width: windows.kbc.isMaximized ? '100vw' : windows.kbc.w,
            height: windows.kbc.isMaximized ? 'calc(100vh - 28px - 80px)' : windows.kbc.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-950/98 border border-amber-500/30 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'kbc' ? 'ring-1 ring-amber-400/50' : 'opacity-95'}`}
        >
          {/* Header */}
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
              <span>Kaun Banega Crorepati — Tech Contestant Hub</span>
            </div>
            <Link to="/kbc" className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-bold">
              <span>Fullscreen</span> <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Embedded Web Frame or Direct Hub */}
          <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-4 shadow-lg shadow-amber-500/20">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-amber-400 mb-2">AppleTree KBC Grand Competition</h2>
            <p className="text-xs text-slate-300 max-w-md mb-6 leading-relaxed">
              Play live multi-level KBC quiz competition with real-time countdown timer, dynamic points addition and deduction, and direct leaderboard rankings!
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/kbc')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" /> Join Live KBC Contestant
              </button>
              <button
                onClick={() => navigate('/dashboard/admin/kbc')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/10 cursor-pointer"
              >
                Host / Admin Monitor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. CODE STUDIO WINDOW ── */}
      {windows.code.isOpen && !windows.code.isMinimized && (
        <div
          onClick={() => focusWindow('code')}
          style={{
            zIndex: windows.code.zIndex,
            left: windows.code.isMaximized ? 0 : windows.code.x,
            top: windows.code.isMaximized ? 28 : windows.code.y,
            width: windows.code.isMaximized ? '100vw' : windows.code.w,
            height: windows.code.isMaximized ? 'calc(100vh - 28px - 80px)' : windows.code.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-950/98 border border-white/20 shadow-2xl flex flex-col font-mono transition-all duration-150 ${activeAppId === 'code' ? 'ring-1 ring-emerald-400/50' : 'opacity-95'}`}
        >
          {/* Header */}
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
              <span>AppleTree Code Studio (Python / Web Sandbox)</span>
            </div>
            <button
              onClick={runCode}
              disabled={isCodeRunning}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-sans flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" /> {isCodeRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>

          {/* Editor & Output Split */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Code Input */}
            <div className="flex-1 p-4 bg-slate-950/80 border-r border-white/10 flex flex-col">
              <div className="text-[11px] font-sans text-slate-400 mb-2 flex items-center justify-between">
                <span>main.py</span>
                <span>Python 3.12</span>
              </div>
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="flex-1 w-full bg-transparent text-emerald-300 font-mono text-xs outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Execution Console Output */}
            <div className="w-full md:w-80 p-4 bg-black/60 flex flex-col">
              <span className="text-[11px] font-sans text-slate-400 mb-2">Terminal Output</span>
              <pre className="flex-1 font-mono text-[11px] text-slate-200 whitespace-pre-wrap overflow-y-auto">
                {codeOutput || '// Click "Run Code" to compile...'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. SAFARI BROWSER WINDOW ── */}
      {windows.safari.isOpen && !windows.safari.isMinimized && (
        <div
          onClick={() => focusWindow('safari')}
          style={{
            zIndex: windows.safari.zIndex,
            left: windows.safari.isMaximized ? 0 : windows.safari.x,
            top: windows.safari.isMaximized ? 28 : windows.safari.y,
            width: windows.safari.isMaximized ? '100vw' : windows.safari.w,
            height: windows.safari.isMaximized ? 'calc(100vh - 28px - 80px)' : windows.safari.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/98 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'safari' ? 'ring-1 ring-white/30' : 'opacity-95'}`}
        >
          {/* Header with Safari URL bar */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'safari')}
            className="h-12 px-4 bg-slate-800/90 border-b border-white/10 flex items-center justify-between cursor-move shrink-0 gap-3"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('safari')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('safari')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('safari')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>

            {/* Fake Safari URL Pill */}
            <div className="flex-1 max-w-md mx-auto h-7 px-3 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center gap-2 text-xs text-slate-300">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="font-medium">programmingwala.com</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <Link to="/" title="Open in full browser window">
                <ExternalLink className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              </Link>
            </div>
          </div>

          {/* Safari Content View */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-950/60">
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <h1 className="text-2xl font-black text-white mb-2">
                  <span className="text-red-500">Apple</span><span className="text-emerald-500">Tree</span> Infotech
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
                  Premier Tech Learning & Placement Platform. Master Java Full Stack, AWS DevOps, Python AI, React & MERN with ISO-certified curriculum and guaranteed career support.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button onClick={() => navigate('/programs')} className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer">
                    Explore Courses
                  </button>
                  <button onClick={() => navigate('/careers')} className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer">
                    Career Tracks
                  </button>
                  <button onClick={() => navigate('/contact')} className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. NOTES WINDOW ── */}
      {windows.notes.isOpen && !windows.notes.isMinimized && (
        <div
          onClick={() => focusWindow('notes')}
          style={{
            zIndex: windows.notes.zIndex,
            left: windows.notes.isMaximized ? 0 : windows.notes.x,
            top: windows.notes.isMaximized ? 28 : windows.notes.y,
            width: windows.notes.isMaximized ? '100vw' : windows.notes.w,
            height: windows.notes.isMaximized ? 'calc(100vh - 28px - 80px)' : windows.notes.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/98 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'notes' ? 'ring-1 ring-yellow-400/50' : 'opacity-95'}`}
        >
          {/* Header */}
          <div 
            onMouseDown={(e) => handleMouseDownHeader(e, 'notes')}
            className="h-10 px-4 bg-slate-800/90 border-b border-white/10 flex items-center justify-between cursor-move shrink-0"
          >
            <div className="flex items-center gap-2">
              <button onClick={() => closeWindow('notes')} className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" />
              <button onClick={() => minimizeWindow('notes')} className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer" />
              <button onClick={() => toggleMaximize('notes')} className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer" />
            </div>
            <div className="text-xs font-semibold text-slate-300">Notes</div>
            <div className="w-10" />
          </div>

          {/* Notes Body */}
          <div className="flex-1 p-4 bg-slate-950 flex flex-col">
            <textarea
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              className="flex-1 w-full bg-transparent text-slate-200 text-xs outline-none resize-none leading-relaxed font-sans"
              placeholder="Start typing your notes..."
            />
          </div>
        </div>
      )}

      {/* ── 7. CALCULATOR WINDOW ── */}
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
          {/* Header */}
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

          {/* Display */}
          <div className="p-4 bg-slate-950/80 text-right">
            <span className="text-3xl font-light text-white tracking-tight">{calcDisplay}</span>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900/90 text-sm font-semibold flex-1">
            <button onClick={handleCalcClear} className="p-3 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white cursor-pointer">AC</button>
            <button onClick={() => setCalcDisplay(prev => String(-parseFloat(prev)))} className="p-3 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white cursor-pointer">±</button>
            <button onClick={() => setCalcDisplay(prev => String(parseFloat(prev) / 100))} className="p-3 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white cursor-pointer">%</button>
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
            <button onClick={() => !calcDisplay.includes('.') && setCalcDisplay(prev => prev + '.')} className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white cursor-pointer">.</button>
            <button onClick={handleCalcEquals} className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer">=</button>
          </div>
        </div>
      )}

      {/* ── 8. SYSTEM SETTINGS WINDOW ── */}
      {windows.settings.isOpen && !windows.settings.isMinimized && (
        <div
          onClick={() => focusWindow('settings')}
          style={{
            zIndex: windows.settings.zIndex,
            left: windows.settings.isMaximized ? 0 : windows.settings.x,
            top: windows.settings.isMaximized ? 28 : windows.settings.y,
            width: windows.settings.isMaximized ? '100vw' : windows.settings.w,
            height: windows.settings.isMaximized ? 'calc(100vh - 28px - 80px)' : windows.settings.h
          }}
          className={`absolute rounded-2xl overflow-hidden backdrop-blur-3xl bg-slate-900/98 border border-white/20 shadow-2xl flex flex-col transition-all duration-150 ${activeAppId === 'settings' ? 'ring-1 ring-white/30' : 'opacity-95'}`}
        >
          {/* Header */}
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

          {/* Wallpaper Select Gallery */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Desktop Wallpaper</h3>
              <p className="text-xs text-slate-400">Choose your favorite macOS official backdrop</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {WALLPAPERS.map(wp => (
                <div
                  key={wp.id}
                  onClick={() => setCurrentWallpaper(wp.url)}
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

      {/* ── 9. ABOUT THIS MAC WINDOW ── */}
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
              <p className="text-xs text-slate-400">macOS Sequoia 15.2</p>
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
                <span className="text-slate-400">Startup Disk:</span>
                <span className="font-semibold text-white">AppleTree Macintosh HD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academy:</span>
                <span className="font-semibold text-amber-300">AppleTree Infotech</span>
              </div>
            </div>

            <button 
              onClick={() => closeWindow('aboutMac')}
              className="mt-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
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
          { id: 'safari', title: 'Safari', icon: Compass, color: 'from-sky-400 to-blue-600' },
          { id: 'terminal', title: 'Terminal', icon: Terminal, color: 'from-slate-800 to-slate-950' },
          { id: 'code', title: 'Code Studio', icon: Code2, color: 'from-emerald-500 to-teal-600' },
          { id: 'kbc', title: 'KBC Quiz', icon: Trophy, color: 'from-amber-400 to-yellow-600', badge: 'LIVE' },
          { id: 'notes', title: 'Notes', icon: FileText, color: 'from-amber-300 to-yellow-500' },
          { id: 'calculator', title: 'Calculator', icon: Calculator, color: 'from-orange-400 to-amber-500' },
          { id: 'settings', title: 'System Settings', icon: Settings, color: 'from-slate-400 to-slate-600' }
        ].map(app => {
          const Icon = app.icon;
          const isOpen = windows[app.id]?.isOpen;

          return (
            <div key={app.id} className="relative flex flex-col items-center group">
              {/* Tooltip on hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none px-2.5 py-1 rounded-md backdrop-blur-md bg-black/75 text-white text-[10px] font-semibold whitespace-nowrap shadow-md">
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
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${app.color} p-2 flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-125 hover:-translate-y-2 active:scale-95 cursor-pointer relative`}
              >
                <Icon className="w-6 h-6 drop-shadow-sm" />
                {app.badge && (
                  <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-red-600 text-white text-[8px] font-black animate-pulse">
                    {app.badge}
                  </span>
                )}
              </button>

              {/* Running Dot Indicator under open app */}
              <div className={`w-1 h-1 rounded-full mt-1 transition-all ${isOpen ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'opacity-0'}`} />
            </div>
          );
        })}

        {/* Separator Line */}
        <div className="w-px h-10 bg-white/20 self-center mx-1" />

        {/* Trash */}
        <div className="relative flex flex-col items-center group">
          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none px-2.5 py-1 rounded-md backdrop-blur-md bg-black/75 text-white text-[10px] font-semibold whitespace-nowrap shadow-md">
            Trash
          </div>
          <button
            onClick={() => {
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
                onClick={() => setIsLocked(false)}
                className="mt-2 px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                Click to Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
