import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Zap, XCircle, Search, RefreshCw } from 'lucide-react';
import macSound from '../services/sound.js';

export default function ActivityMonitorApp({ activeWindows, onCloseWindow }) {
  const [activeTab, setActiveTab] = useState('cpu');
  const [cpuHistory, setCpuHistory] = useState(Array(30).fill(15));
  const [cpuUsage, setCpuUsage] = useState(14.8);
  const [selectedPid, setSelectedPid] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate realistic CPU jitter
      const nextCpu = Math.min(95, Math.max(8, (Math.random() * 25 + 10)));
      setCpuUsage(Number(nextCpu.toFixed(1)));
      setCpuHistory(prev => [...prev.slice(1), nextCpu]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const processes = [
    { pid: 101, name: 'Finder', cpu: '0.8', memory: '142 MB', threads: 14, id: 'finder' },
    { pid: 204, name: 'Visual Studio Code (Monaco)', cpu: (cpuUsage * 0.45).toFixed(1), memory: '420 MB', threads: 28, id: 'vscode' },
    { pid: 340, name: 'Safari Web Engine', cpu: (cpuUsage * 0.22).toFixed(1), memory: '280 MB', threads: 18, id: 'safari' },
    { pid: 412, name: 'Terminal (zsh)', cpu: '0.1', memory: '34 MB', threads: 4, id: 'terminal' },
    { pid: 512, name: 'App Store Engine', cpu: '0.4', memory: '88 MB', threads: 8, id: 'appstore' },
    { pid: 618, name: 'WindowServer & Compositor', cpu: (cpuUsage * 0.18).toFixed(1), memory: '190 MB', threads: 32, id: 'system' },
    { pid: 722, name: 'Activity Monitor', cpu: '1.2', memory: '52 MB', threads: 6, id: 'activitymonitor' }
  ];

  const handleForceQuit = (proc) => {
    macSound.playTrash();
    if (proc.id && onCloseWindow) {
      onCloseWindow(proc.id);
    }
  };

  const filteredProcs = processes.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col bg-slate-900/95 text-slate-100 overflow-hidden text-xs">
      {/* Toolbar Tabs */}
      <div className="h-11 px-4 bg-slate-800/80 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
          {[
            { id: 'cpu', label: 'CPU', icon: Cpu },
            { id: 'memory', label: 'Memory', icon: Activity },
            { id: 'disk', label: 'Disk', icon: HardDrive }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition ${
                activeTab === t.id ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Filter processes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none w-36"
            />
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-950/60 sticky top-0 border-b border-white/10 text-slate-400 font-bold">
            <tr>
              <th className="py-2 pl-4">Process Name</th>
              <th className="py-2">% CPU</th>
              <th className="py-2">Memory</th>
              <th className="py-2">Threads</th>
              <th className="py-2">PID</th>
              <th className="py-2 text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProcs.map(proc => (
              <tr
                key={proc.pid}
                onClick={() => setSelectedPid(proc.pid)}
                className={`hover:bg-white/10 cursor-pointer ${selectedPid === proc.pid ? 'bg-sky-600/30' : ''}`}
              >
                <td className="py-2.5 pl-4 font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {proc.name}
                </td>
                <td className="py-2.5 text-sky-400 font-mono">{proc.cpu}%</td>
                <td className="py-2.5 text-slate-300 font-mono">{proc.memory}</td>
                <td className="py-2.5 text-slate-400">{proc.threads}</td>
                <td className="py-2.5 text-slate-500 font-mono">{proc.pid}</td>
                <td className="py-2.5 text-right pr-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleForceQuit(proc); }}
                    title="Force Quit Process"
                    className="text-rose-400 hover:text-rose-300 font-bold bg-rose-500/10 hover:bg-rose-500/20 px-2 py-0.5 rounded text-[11px] transition"
                  >
                    Force Quit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live Graph & Diagnostics Footer */}
      <div className="h-32 bg-slate-950/90 border-t border-white/10 p-4 flex gap-6 shrink-0">
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300">CPU History (Apple M3 Max)</span>
            <span className="font-mono text-sky-400 font-bold">{cpuUsage}% Total</span>
          </div>
          {/* Mini Real-Time SVG Sparkline */}
          <div className="h-16 w-full bg-slate-900 rounded-lg p-2 flex items-end gap-1 border border-white/5">
            {cpuHistory.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-sky-600 to-sky-400 rounded-t transition-all duration-300"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>

        <div className="w-56 flex flex-col justify-center space-y-1 text-[11px] text-slate-400 border-l border-white/10 pl-6">
          <div className="flex justify-between">
            <span>System:</span>
            <span className="font-mono text-white">4.8%</span>
          </div>
          <div className="flex justify-between">
            <span>User:</span>
            <span className="font-mono text-white">{(cpuUsage - 4.8).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Idle:</span>
            <span className="font-mono text-emerald-400">{(100 - cpuUsage).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-white/10">
            <span>Memory Pressure:</span>
            <span className="font-bold text-emerald-400">Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
