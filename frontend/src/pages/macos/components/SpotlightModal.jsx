import React, { useState, useEffect, useRef } from 'react';
import { Search, Folder, FileText, AppWindow, Settings, ArrowRight } from 'lucide-react';
import vfs from '../services/vfs.js';
import appRegistry, { APP_STORE_CATALOG } from '../services/appRegistry.js';
import macSound from '../services/sound.js';

export default function SpotlightModal({ isOpen, onClose, onOpenApp, onOpenFile }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      // Default top suggestions
      const defaultApps = [
        { type: 'app', id: 'mysql-studio', title: 'MySQL Studio', subtitle: 'Developer Tools • Database Suite', icon: '🐬' },
        { type: 'app', id: 'vscode', title: 'Visual Studio Code', subtitle: 'Developer Environment', icon: '💻' },
        { type: 'app', id: 'finder', title: 'Finder', subtitle: 'Macintosh HD', icon: '📂' },
        { type: 'app', id: 'safari', title: 'Safari', subtitle: 'Web Explorer', icon: '🧭' },
        { type: 'app', id: 'terminal', title: 'Terminal', subtitle: 'zsh POSIX Shell', icon: '⚡' },
        { type: 'app', id: 'appstore', title: 'App Store', subtitle: 'Software Catalogue', icon: '🛍️' }
      ];
      setResults(defaultApps);
      return;
    }

    const q = query.toLowerCase();
    const matches = [];

    // 1. Search Installed & System Apps
    const allApps = [
      { id: 'mysql-studio', title: 'MySQL Studio', subtitle: 'Developer Tools • MySQL 8.4 LTS', icon: '🐬', keywords: ['mysql', 'sql', 'database', 'workbench', 'studio', 'table', 'sakila'] },
      { id: 'vscode', title: 'Visual Studio Code', subtitle: 'Applications', icon: '💻' },
      { id: 'javamanager', title: 'Java Manager', subtitle: 'Developer Tools', icon: '☕' },
      { id: 'finder', title: 'Finder', subtitle: 'Applications', icon: '📂' },
      { id: 'safari', title: 'Safari', subtitle: 'Applications', icon: '🧭' },
      { id: 'terminal', title: 'Terminal', subtitle: 'Applications', icon: '⚡' },
      { id: 'appstore', title: 'App Store', subtitle: 'Applications', icon: '🛍️' },
      { id: 'settings', title: 'System Settings', subtitle: 'Preferences', icon: '⚙️' },
      { id: 'activitymonitor', title: 'Activity Monitor', subtitle: 'Utilities', icon: '📈' },
      { id: 'notes', title: 'Notes', subtitle: 'Productivity', icon: '📝' },
      { id: 'calculator', title: 'Calculator', subtitle: 'Utilities', icon: '🧮' },
      { id: 'terabox', title: 'TeraBox Cloud', subtitle: 'Cloud Storage', icon: '☁️' },
      { id: 'kbc', title: 'KBC Quiz Arena', subtitle: 'Education', icon: '🏆' }
    ];

    allApps.forEach(app => {
      if (app.title.toLowerCase().includes(q) || (app.keywords && app.keywords.some(k => k.includes(q)))) {
        matches.push({ type: 'app', ...app });
      }
    });

    // 2. Search Installed .webapp packages
    appRegistry.getInstalledApps().forEach(app => {
      if (app.name.toLowerCase().includes(q)) {
        matches.push({ type: 'webapp', id: app.id, title: app.name, subtitle: `${app.category} • v${app.version}`, icon: '📦' });
      }
    });

    // 3. Search VFS Files
    vfs.search(q).then(fileNodes => {
      fileNodes.forEach(f => {
        matches.push({
          type: 'file',
          id: f.path,
          path: f.path,
          title: f.name,
          subtitle: f.path,
          item: f,
          icon: f.type === 'folder' ? '📁' : '📄'
        });
      });
      setResults(matches.slice(0, 8));
      setSelectedIndex(0);
    });
  }, [query]);

  const handleSelect = (item) => {
    macSound.playPop();
    onClose();
    if (item.type === 'app' || item.type === 'webapp') {
      onOpenApp(item.id);
    } else if (item.type === 'file') {
      onOpenFile(item.item);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-28"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-slate-900/90 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden shadow-black/80"
      >
        {/* Spotlight Input Field */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search (apps, files, settings...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white text-base outline-none placeholder-slate-500 font-medium"
          />
        </div>

        {/* Results List */}
        <div className="p-2 space-y-0.5 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-xs">No results found for "{query}"</div>
          ) : (
            results.map((item, index) => (
              <div
                key={item.id + index}
                onClick={() => handleSelect(item)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition ${
                  index === selectedIndex ? 'bg-sky-600 text-white font-bold' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs truncate">{item.title}</div>
                    <div className={`text-[10px] truncate ${index === selectedIndex ? 'text-sky-100' : 'text-slate-400'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 opacity-60 ${index === selectedIndex ? 'opacity-100' : ''}`} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
