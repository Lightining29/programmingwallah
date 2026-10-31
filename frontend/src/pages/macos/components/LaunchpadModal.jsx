import React, { useState } from 'react';
import { Search } from 'lucide-react';
import appRegistry from '../services/appRegistry.js';
import macSound from '../services/sound.js';
import { MacMySQLIcon } from '../MacOSDesktop.jsx';

export default function LaunchpadModal({ isOpen, onClose, onLaunchApp }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const systemApps = [
    { id: 'finder', name: 'Finder', iconText: '📂', gradient: 'from-blue-500 to-sky-400' },
    { id: 'mysql-studio', name: 'MySQL Studio', iconText: '🐬', isMySQL: true, gradient: 'from-teal-600 to-amber-600' },
    { id: 'safari', name: 'Safari', iconText: '🧭', gradient: 'from-sky-500 to-blue-600' },
    { id: 'vscode', name: 'VS Code', iconText: '💻', gradient: 'from-blue-600 to-indigo-700' },
    { id: 'javamanager', name: 'Java Manager', iconText: '☕', gradient: 'from-amber-600 to-orange-700' },
    { id: 'terminal', name: 'Terminal', iconText: '⚡', gradient: 'from-slate-800 to-black' },
    { id: 'appstore', name: 'App Store', iconText: '🛍️', gradient: 'from-sky-400 to-blue-600' },
    { id: 'activitymonitor', name: 'Activity Monitor', iconText: '📈', gradient: 'from-emerald-500 to-teal-700' },
    { id: 'notes', name: 'Notes', iconText: '📝', gradient: 'from-amber-400 to-amber-600' },
    { id: 'calculator', name: 'Calculator', iconText: '🧮', gradient: 'from-orange-500 to-amber-600' },
    { id: 'settings', name: 'Settings', iconText: '⚙️', gradient: 'from-slate-500 to-slate-700' },
    { id: 'terabox', name: 'TeraBox Cloud', iconText: '☁️', gradient: 'from-cyan-500 to-blue-600' },
    { id: 'kbc', name: 'KBC Quiz', iconText: '🏆', gradient: 'from-purple-600 to-pink-600' }
  ];

  const installedPackages = appRegistry.getInstalledApps().map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    iconText: pkg.iconType === 'markdown' ? '📝' : pkg.iconType === 'game' ? '🎮' : pkg.iconType === 'paint' ? '🎨' : pkg.iconType === 'timer' ? '⏱️' : '📦',
    gradient: pkg.iconColor || 'from-indigo-500 to-purple-600',
    isPackage: true
  }));

  const allApps = [...systemApps, ...installedPackages].filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLaunch = (appId) => {
    macSound.playPop();
    onClose();
    onLaunchApp(appId);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-3xl flex flex-col items-center justify-between p-8 select-none animate-in fade-in duration-200"
    >
      {/* Search Bar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm relative mt-4"
      >
        <Search className="w-4 h-4 text-white/50 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search Launchpad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="w-full bg-white/10 border border-white/20 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/40 outline-none backdrop-blur-md focus:border-white/50 text-center"
        />
      </div>

      {/* App Grid */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-8 p-4 justify-items-center"
      >
        {allApps.map(app => (
          <div
            key={app.id}
            onClick={() => handleLaunch(app.id)}
            className="flex flex-col items-center group cursor-pointer transition transform hover:scale-110 active:scale-95"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-3xl shadow-2xl border border-white/20 group-hover:shadow-sky-500/30 group-hover:ring-2 group-hover:ring-white/40 transition overflow-hidden p-1`}>
              {app.isMySQL ? <MacMySQLIcon className="w-12 h-12" /> : app.iconText}
            </div>
            <span className="mt-2 text-xs font-semibold text-white drop-shadow-md text-center truncate max-w-[85px]">
              {app.name}
            </span>
            {app.isPackage && (
              <span className="text-[9px] text-sky-300 font-mono">.webapp</span>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-white shadow-md" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
