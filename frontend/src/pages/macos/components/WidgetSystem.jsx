import React, { useState, useEffect } from 'react';
import { 
  Clock as ClockIcon, CloudSun, Calendar as CalIcon, CheckSquare, 
  FileText, BatteryCharging, Calculator as CalcIcon, Activity, 
  Timer, Compass, Plus, Trash2, X, Search, Check, RefreshCw, 
  Play, Pause, RotateCcw, Sparkles, AlertCircle, ChevronRight
} from 'lucide-react';
import macSound from '../services/sound.js';

// ── AVAILABLE WIDGET DEFINITIONS & MANIFEST ──
export const WIDGET_REGISTRY = [
  {
    type: 'clock',
    title: 'Clock',
    category: 'Utilities',
    icon: '🕒',
    desc: 'Live analog & digital system clock with UTC and local timezones.',
    supportedSizes: ['small', 'medium']
  },
  {
    type: 'weather',
    title: 'Weather',
    category: 'Utilities',
    icon: '🌤️',
    desc: 'Current weather condition, temperature, and 3-day forecast.',
    supportedSizes: ['small', 'medium']
  },
  {
    type: 'calendar',
    title: 'Calendar',
    category: 'Productivity',
    icon: '📅',
    desc: 'Monthly calendar view with today indicator and appointment reminders.',
    supportedSizes: ['small', 'medium', 'large']
  },
  {
    type: 'reminders',
    title: 'Reminders',
    category: 'Productivity',
    icon: '☑️',
    desc: 'Interactive task checklist with completion toggling and creation.',
    supportedSizes: ['small', 'medium']
  },
  {
    type: 'notes',
    title: 'Quick Notes',
    category: 'Productivity',
    icon: '📝',
    desc: 'Persistent desktop scratchpad note for fast code snippets or thoughts.',
    supportedSizes: ['small', 'medium', 'large']
  },
  {
    type: 'calculator',
    title: 'Calculator',
    category: 'Utilities',
    icon: '🧮',
    desc: 'Fully working arithmetic calculator directly on your desktop.',
    supportedSizes: ['small', 'medium']
  },
  {
    type: 'system',
    title: 'System Monitor',
    category: 'System',
    icon: '⚡',
    desc: 'Real-time CPU load, memory utilization, and storage metrics.',
    supportedSizes: ['small', 'medium']
  },
  {
    type: 'pomodoro',
    title: 'Pomodoro Focus',
    category: 'Productivity',
    icon: '⏱️',
    desc: '25-minute productivity timer with start, pause, and reset controls.',
    supportedSizes: ['small', 'medium']
  },
  {
    type: 'battery',
    title: 'Battery Status',
    category: 'System',
    icon: '🔋',
    desc: 'Live battery level and power source information.',
    supportedSizes: ['small']
  }
];

// ── DEFAULT WIDGETS PLACED ON DESKTOP ──
export const INITIAL_DESKTOP_WIDGETS = [
  { id: 'w-clock-1', type: 'clock', size: 'small', x: 24, y: 48 },
  { id: 'w-weather-1', type: 'weather', size: 'small', x: 24, y: 224 },
  { id: 'w-reminders-1', type: 'reminders', size: 'medium', x: 24, y: 400 },
  { id: 'w-pomodoro-1', type: 'pomodoro', size: 'small', x: 24, y: 580 }
];

// ════════════════ INDIVIDUAL INTERACTIVE WIDGET COMPONENTS ════════════════

// 1. Clock Widget
export function ClockWidget({ size = 'small' }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  const dayStr = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between text-white font-sans select-none">
      <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5 text-sky-400" /> Cupertino</span>
        <span className="text-[10px] text-sky-400">Local</span>
      </div>

      <div className="text-center my-auto">
        <div className="text-3xl font-extrabold tracking-tight font-mono text-white">
          {displayHours}:{minutes}
        </div>
        <div className="text-[11px] text-sky-300 font-semibold">{ampm} · {seconds}s</div>
      </div>

      <div className="text-[11px] text-slate-400 text-center font-medium border-t border-white/10 pt-1.5">
        {dayStr}
      </div>
    </div>
  );
}

// 2. Weather Widget
export function WeatherWidget({ size = 'small' }) {
  const [weather] = useState({
    city: 'New Delhi / NCR',
    temp: '26°C',
    condition: 'Sunny & Clear',
    high: '29°',
    low: '19°',
    humidity: '42%'
  });

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between text-white font-sans select-none">
      <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
        <span className="flex items-center gap-1.5"><CloudSun className="w-4 h-4 text-amber-400" /> {weather.city}</span>
        <span className="text-[10px] text-slate-400">Live</span>
      </div>

      <div className="my-auto">
        <div className="text-3xl font-black text-white">{weather.temp}</div>
        <div className="text-xs text-slate-300 font-semibold">{weather.condition}</div>
      </div>

      <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-1.5">
        <span>H: {weather.high} L: {weather.low}</span>
        <span>💧 {weather.humidity}</span>
      </div>
    </div>
  );
}

// 3. Reminders Widget
export function RemindersWidget({ size = 'medium' }) {
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem('mac_widget_reminders');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: 'Review Spring Boot & Java 27 microservices', done: true },
        { id: 2, text: 'Run Python 3.12 AI script in VS Code', done: false },
        { id: 3, text: 'Test Safari web embedding fallbacks', done: false }
      ];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('mac_widget_reminders', JSON.stringify(reminders));
    } catch {}
  }, [reminders]);

  const toggleReminder = (id) => {
    macSound.playClick();
    setReminders(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  const addReminder = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    macSound.playPop();
    setReminders(prev => [...prev, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  };

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between text-white font-sans select-none overflow-hidden">
      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 border-b border-white/10 pb-1.5">
        <span className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5" /> Reminders</span>
        <span className="text-[10px] font-mono text-slate-400">
          {reminders.filter(r => r.done).length}/{reminders.length}
        </span>
      </div>

      <div className="flex-1 my-2 overflow-y-auto space-y-1.5 pr-1">
        {reminders.map(r => (
          <div 
            key={r.id} 
            onClick={() => toggleReminder(r.id)}
            className="flex items-center gap-2 cursor-pointer group text-xs text-slate-300 hover:text-white transition"
          >
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition ${
              r.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/30 group-hover:border-white'
            }`}>
              {r.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span className={`truncate text-xs ${r.done ? 'line-through text-slate-500' : ''}`}>{r.text}</span>
          </div>
        ))}
      </div>

      <form onSubmit={addReminder} className="pt-1 border-t border-white/10 flex gap-1">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="New reminder..."
          className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-0.5 text-[10px] text-white outline-none"
        />
        <button type="submit" className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white cursor-pointer">
          Add
        </button>
      </form>
    </div>
  );
}

// 4. Calculator Widget
export function CalculatorWidget() {
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState(null);
  const [calcOp, setCalcOp] = useState(null);

  const handleNum = (num) => {
    macSound.playClick();
    setCalcDisplay(prev => prev === '0' ? String(num) : prev + num);
  };

  const handleOp = (op) => {
    macSound.playClick();
    setCalcPrev(parseFloat(calcDisplay));
    setCalcOp(op);
    setCalcDisplay('0');
  };

  const handleEquals = () => {
    macSound.playPop();
    const cur = parseFloat(calcDisplay);
    if (calcPrev !== null && calcOp) {
      let res = 0;
      if (calcOp === '+') res = calcPrev + cur;
      if (calcOp === '-') res = calcPrev - cur;
      if (calcOp === '×') res = calcPrev * cur;
      if (calcOp === '÷') res = cur === 0 ? 'Error' : calcPrev / cur;
      setCalcDisplay(String(res));
      setCalcPrev(null);
      setCalcOp(null);
    }
  };

  const handleClear = () => {
    macSound.playClick();
    setCalcDisplay('0');
    setCalcPrev(null);
    setCalcOp(null);
  };

  return (
    <div className="w-full h-full p-2.5 flex flex-col justify-between font-sans select-none bg-black/60 rounded-2xl">
      <div className="h-8 px-2 bg-black/50 rounded-lg flex items-center justify-end font-mono text-base font-bold text-white overflow-hidden">
        {calcDisplay}
      </div>

      <div className="grid grid-cols-4 gap-1 text-xs font-bold pt-1">
        <button onClick={handleClear} className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-rose-300">C</button>
        <button onClick={() => handleOp('÷')} className="p-1 rounded bg-amber-600 hover:bg-amber-500 text-white">÷</button>
        <button onClick={() => handleOp('×')} className="p-1 rounded bg-amber-600 hover:bg-amber-500 text-white">×</button>
        <button onClick={() => handleOp('-')} className="p-1 rounded bg-amber-600 hover:bg-amber-500 text-white">-</button>

        <button onClick={() => handleNum(7)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">7</button>
        <button onClick={() => handleNum(8)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">8</button>
        <button onClick={() => handleNum(9)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">9</button>
        <button onClick={() => handleOp('+')} className="p-1 rounded bg-amber-600 hover:bg-amber-500 text-white">+</button>

        <button onClick={() => handleNum(4)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">4</button>
        <button onClick={() => handleNum(5)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">5</button>
        <button onClick={() => handleNum(6)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">6</button>
        <button onClick={handleEquals} className="row-span-2 p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black">=</button>

        <button onClick={() => handleNum(1)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">1</button>
        <button onClick={() => handleNum(2)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">2</button>
        <button onClick={() => handleNum(3)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">3</button>
      </div>
    </div>
  );
}

// 5. Pomodoro Focus Timer Widget
export function PomodoroWidget() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      macSound.playPop();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggle = () => {
    macSound.playClick();
    setIsActive(prev => !prev);
  };

  const reset = () => {
    macSound.playClick();
    setIsActive(false);
    setSecondsLeft(25 * 60);
  };

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div className="w-full h-full p-3.5 flex flex-col justify-between text-white font-sans select-none">
      <div className="flex items-center justify-between text-[11px] font-bold text-rose-400">
        <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> Pomodoro</span>
        <span className="text-[10px] text-slate-400">25 Min</span>
      </div>

      <div className="text-center my-auto">
        <div className="text-3xl font-black font-mono tracking-tight text-white">{mins}:{secs}</div>
        <div className="text-[10px] text-rose-300 font-semibold">{isActive ? 'Focus Session Active' : 'Ready'}</div>
      </div>

      <div className="flex items-center justify-center gap-2 pt-1 border-t border-white/10">
        <button 
          onClick={toggle}
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
            isActive ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
        >
          {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </button>
        <button 
          onClick={reset}
          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// 6. System Monitor Widget
export function SystemMonitorWidget() {
  return (
    <div className="w-full h-full p-3 flex flex-col justify-between text-white font-sans select-none">
      <div className="flex items-center justify-between text-[11px] font-bold text-sky-400">
        <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> Activity Monitor</span>
        <span className="text-[10px] text-emerald-400">Normal</span>
      </div>

      <div className="space-y-2 my-auto">
        <div>
          <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
            <span>Apple Silicon M3</span>
            <span className="font-mono text-emerald-400">12%</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full w-[12%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
            <span>Memory (16 GB)</span>
            <span className="font-mono text-sky-400">4.8 GB</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-sky-400 rounded-full w-[30%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
            <span>Macintosh HD</span>
            <span className="font-mono text-amber-400">512 GB</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full w-[22%]" />
          </div>
        </div>
      </div>

      <div className="text-[9px] text-slate-400 text-center border-t border-white/10 pt-1">
        macOS Sequoia 15.2 (24C101)
      </div>
    </div>
  );
}

// 7. Quick Notes Widget
export function NotesWidget() {
  const [note, setNote] = useState(() => {
    return localStorage.getItem('mac_widget_quicknote') || ' Quick Notes\n\n- Java 27 OpenJDK Active\n- Python 3.12 Sandboxed\n- All systems nominal.';
  });

  const handleChange = (e) => {
    setNote(e.target.value);
    try {
      localStorage.setItem('mac_widget_quicknote', e.target.value);
    } catch {}
  };

  return (
    <div className="w-full h-full p-3 flex flex-col justify-between font-sans select-none bg-amber-950/30 rounded-2xl border border-amber-500/20">
      <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 pb-1 border-b border-amber-500/20">
        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Quick Notes</span>
        <span className="text-[9px] text-amber-300/60 font-mono">Auto-saved</span>
      </div>

      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Type quick notes here..."
        className="flex-1 w-full bg-transparent border-none outline-none resize-none text-xs text-amber-100 font-sans leading-relaxed py-1.5"
      />
    </div>
  );
}

// ════════════════ DESKTOP WIDGET WRAPPER WITH EDIT CONTROLS ════════════════
export function DesktopWidgetWrapper({ widget, isEditing, onRemove }) {
  // Sizing dimensions
  const sizeClasses = 
    widget.size === 'medium' ? 'w-80 h-36' :
    widget.size === 'large' ? 'w-80 h-80' :
    'w-40 h-36'; // small (default)

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'clock': return <ClockWidget size={widget.size} />;
      case 'weather': return <WeatherWidget size={widget.size} />;
      case 'reminders': return <RemindersWidget size={widget.size} />;
      case 'calculator': return <CalculatorWidget size={widget.size} />;
      case 'pomodoro': return <PomodoroWidget size={widget.size} />;
      case 'system': return <SystemMonitorWidget size={widget.size} />;
      case 'notes': return <NotesWidget size={widget.size} />;
      default: return <ClockWidget />;
    }
  };

  return (
    <div 
      className={`relative rounded-3xl backdrop-blur-2xl bg-black/45 border border-white/15 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-200 hover:border-white/30 group ${sizeClasses}`}
    >
      {/* Delete / Remove badge when in Edit Mode */}
      {isEditing && (
        <button
          onClick={() => onRemove(widget.id)}
          className="absolute -top-1.5 -left-1.5 z-30 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg cursor-pointer transition transform hover:scale-110"
          title="Remove widget"
        >
          <X className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      )}

      {renderWidgetContent()}
    </div>
  );
}

// ════════════════ WIDGET GALLERY MODAL ════════════════
export function WidgetGalleryModal({ isOpen, onClose, onAddWidget }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('small');

  if (!isOpen) return null;

  const categories = ['All', 'Productivity', 'Utilities', 'System'];

  const filtered = WIDGET_REGISTRY.filter(w => {
    const matchCat = selectedCategory === 'All' || w.category === selectedCategory;
    const matchSearch = !search || w.title.toLowerCase().includes(search.toLowerCase()) || w.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-[99998] backdrop-blur-md bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl rounded-3xl backdrop-blur-3xl bg-slate-950/95 border border-white/20 shadow-2xl flex flex-col overflow-hidden text-white font-sans max-h-[80vh]">
        {/* Header */}
        <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Widget Gallery</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between bg-black/30">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search widgets..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-slate-400 outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-center gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                  selectedCategory === cat ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(w => (
            <div
              key={w.type}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-400/40 transition flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl p-2 rounded-xl bg-black/40 shadow-inner">{w.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-300">{w.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-white/5">{w.category}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{w.desc}</p>
                </div>
              </div>

              {/* Size Selection & Add Button */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1 text-[10px]">
                  {w.supportedSizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2 py-0.5 rounded capitalize cursor-pointer transition ${
                        selectedSize === sz ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    macSound.playPop();
                    onAddWidget(w.type, selectedSize);
                    onClose();
                  }}
                  className="px-3 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Widget</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════ NOTIFICATION CENTER (TODAY VIEW DRAWER) ════════════════
export function NotificationCenterDrawer({ isOpen, onClose, onOpenWidgetGallery }) {
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', app: 'Safari', time: '10m ago', title: 'Download Complete', desc: 'python-3.12-macos.pkg was saved to Downloads.' },
    { id: 'notif-2', app: 'VS Code', time: '25m ago', title: 'Compiler Ready', desc: 'OpenJDK 27 LTS and Python 3.12 initialized.' },
    { id: 'notif-3', app: 'System', time: '1h ago', title: 'Battery Fully Charged', desc: '100% capacity available on Apple Silicon.' }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-7 right-0 bottom-20 w-84 backdrop-blur-3xl bg-slate-950/85 border-l border-white/15 p-4 z-[99990] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notification Center</h3>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button 
              onClick={() => { macSound.playTrash(); setNotifications([]); }}
              className="text-[10px] text-rose-400 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:text-white text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today View Mini-Widgets & Notifications */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
        {/* Today Section */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today</span>
          <div className="h-32 rounded-2xl overflow-hidden bg-black/40 border border-white/10">
            <WeatherWidget size="small" />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Notifications</span>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 italic">No new notifications</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 relative group">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="font-bold text-sky-400">{n.app}</span>
                  <span>{n.time}</span>
                </div>
                <h5 className="text-xs font-bold text-white">{n.title}</h5>
                <p className="text-[11px] text-slate-300 leading-snug">{n.desc}</p>
                <button
                  onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
                  className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Widgets Footer Button */}
      <div className="pt-2 border-t border-white/10 shrink-0">
        <button
          onClick={() => {
            onClose();
            onOpenWidgetGallery();
          }}
          className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Edit Widgets...</span>
        </button>
      </div>
    </div>
  );
}
