import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, RotateCw, X, Plus, Shield, Star, 
  ExternalLink, Search, Clock, Download, Globe, Bookmark, 
  Share2, Lock, AlertTriangle, CheckCircle2, ChevronRight,
  Compass, Copy, Trash2, SlidersHorizontal, Eye, Folder
} from 'lucide-react';
import macSound from '../services/sound.js';

// Pre-configured Favorites for Safari Start Page
const DEFAULT_FAVORITES = [
  { id: 'fav-1', title: 'Wikipedia', url: 'https://en.wikipedia.org', icon: '🌐', category: 'Reference' },
  { id: 'fav-2', title: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🦆', category: 'Search' },
  { id: 'fav-3', title: 'Hacker News', url: 'https://news.ycombinator.com', icon: '📰', category: 'News' },
  { id: 'fav-4', title: 'GitHub', url: 'https://github.com', icon: '🐙', category: 'Development' },
  { id: 'fav-5', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📚', category: 'Development' },
  { id: 'fav-6', title: 'Python Docs', url: 'https://docs.python.org/3/', icon: '🐍', category: 'Programming' },
  { id: 'fav-7', title: 'W3Schools', url: 'https://www.w3schools.com', icon: '💻', category: 'Learning' },
  { id: 'fav-8', title: 'AppleTree', url: 'https://programmingwala.com', icon: '🍎', category: 'Portal' }
];

export default function SafariBrowserApp({ onClose, onMinimize, onMaximize, isMaximized }) {
  // Tab Management State
  const [tabs, setTabs] = useState([
    {
      id: 'tab-1',
      url: 'safari://start',
      displayUrl: '',
      title: 'Start Page',
      isLoading: false,
      isBlocked: false,
      history: ['safari://start'],
      historyIndex: 0
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');

  // Input & UI State
  const [addressInput, setAddressInput] = useState('');
  const [searchEngine, setSearchEngine] = useState('google'); // 'google', 'duckduckgo', 'bing'
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('safari_bookmarks');
      return saved ? JSON.parse(saved) : DEFAULT_FAVORITES.slice(0, 5);
    } catch {
      return DEFAULT_FAVORITES.slice(0, 5);
    }
  });
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('safari_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [downloads, setDownloads] = useState([
    { id: 'dl-1', name: 'python-3.12-macos.pkg', size: '10.5 MB', progress: 100, completed: true, date: 'Today' }
  ]);
  
  // Panels & Menus
  const [activeDrawer, setActiveDrawer] = useState(null); // 'history', 'downloads', 'bookmarks'
  const [tabContextMenu, setTabContextMenu] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const iframeRef = useRef(null);

  // Sync address bar input when active tab changes
  useEffect(() => {
    if (activeTab) {
      setAddressInput(activeTab.url === 'safari://start' ? '' : activeTab.url);
    }
  }, [activeTabId, activeTab?.url]);

  // Save bookmarks and history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('safari_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('safari_history', JSON.stringify(historyList));
    } catch {}
  }, [historyList]);

  // ── URL Normalization & Search Detection ──
  const normalizeInput = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return 'safari://start';
    if (trimmed.startsWith('safari://')) return trimmed;

    // Check if input looks like a valid URL
    const hasSpace = /\s/.test(trimmed);
    const hasDot = /\.[a-z]{2,}/i.test(trimmed);
    const isIp = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(trimmed);
    const hasProtocol = /^https?:\/\//i.test(trimmed);

    if (!hasSpace && (hasDot || isIp || hasProtocol)) {
      if (hasProtocol) return trimmed;
      return `https://${trimmed}`;
    }

    // Default to search engine query
    if (searchEngine === 'duckduckgo') {
      return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
    } else if (searchEngine === 'bing') {
      return `https://www.bing.com/search?q=${encodeURIComponent(trimmed)}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}&igu=1`;
  };

  // ── Navigate to a Destination ──
  const navigateTo = (destinationUrl) => {
    const targetUrl = normalizeInput(destinationUrl);
    macSound.playPop();

    // Start animated loading progress bar
    setLoadProgress(15);
    const pTimer = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 90) {
          clearInterval(pTimer);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    // Record in history if not start page
    if (targetUrl !== 'safari://start') {
      const historyEntry = {
        id: `hist-${Date.now()}`,
        url: targetUrl,
        title: targetUrl.replace(/^https?:\/\//, '').split('/')[0],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
      };
      setHistoryList(prev => [historyEntry, ...prev.filter(h => h.url !== targetUrl).slice(0, 49)]);
    }

    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        const newHist = [...t.history.slice(0, t.historyIndex + 1), targetUrl];
        return {
          ...t,
          url: targetUrl,
          displayUrl: targetUrl === 'safari://start' ? '' : targetUrl,
          title: targetUrl === 'safari://start' ? 'Start Page' : targetUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
          isLoading: true,
          isBlocked: false,
          history: newHist,
          historyIndex: newHist.length - 1
        };
      }
      return t;
    }));

    setTimeout(() => {
      clearInterval(pTimer);
      setLoadProgress(100);
      setTimeout(() => setLoadProgress(0), 300);
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, isLoading: false } : t));
    }, 500);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    navigateTo(addressInput);
  };

  // ── Back, Forward, Reload ──
  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      macSound.playClick();
      const prevIndex = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[prevIndex];
      setTabs(prev => prev.map(t => {
        if (t.id === activeTabId) {
          return {
            ...t,
            url: prevUrl,
            displayUrl: prevUrl === 'safari://start' ? '' : prevUrl,
            title: prevUrl === 'safari://start' ? 'Start Page' : prevUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
            historyIndex: prevIndex
          };
        }
        return t;
      }));
    }
  };

  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      macSound.playClick();
      const nextIndex = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[nextIndex];
      setTabs(prev => prev.map(t => {
        if (t.id === activeTabId) {
          return {
            ...t,
            url: nextUrl,
            displayUrl: nextUrl === 'safari://start' ? '' : nextUrl,
            title: nextUrl === 'safari://start' ? 'Start Page' : nextUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
            historyIndex: nextIndex
          };
        }
        return t;
      }));
    }
  };

  const handleReload = () => {
    macSound.playPop();
    const current = activeTab.url;
    setLoadProgress(30);
    setTimeout(() => setLoadProgress(100), 400);
    setTimeout(() => setLoadProgress(0), 700);
  };

  // ── Tab Management ──
  const handleCreateTab = (initialUrl = 'safari://start') => {
    macSound.playPop();
    const newTabId = `tab-${Date.now()}`;
    const newTab = {
      id: newTabId,
      url: initialUrl,
      displayUrl: initialUrl === 'safari://start' ? '' : initialUrl,
      title: initialUrl === 'safari://start' ? 'Start Page' : 'New Tab',
      isLoading: false,
      isBlocked: false,
      history: [initialUrl],
      historyIndex: 0
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    macSound.playPop();
    if (tabs.length === 1) {
      // Keep at least one tab open
      setTabs([{
        id: `tab-${Date.now()}`,
        url: 'safari://start',
        displayUrl: '',
        title: 'Start Page',
        isLoading: false,
        isBlocked: false,
        history: ['safari://start'],
        historyIndex: 0
      }]);
      return;
    }
    const remaining = tabs.filter(t => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  const handleDuplicateTab = (tabId) => {
    const target = tabs.find(t => t.id === tabId);
    if (target) {
      handleCreateTab(target.url);
    }
    setTabContextMenu(null);
  };

  const toggleBookmark = () => {
    macSound.playPop();
    const isBookmarked = bookmarks.some(b => b.url === activeTab.url);
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTab.url));
    } else {
      const newBm = {
        id: `bm-${Date.now()}`,
        title: activeTab.title || 'Bookmark',
        url: activeTab.url,
        icon: '⭐',
        category: 'Personal'
      };
      setBookmarks(prev => [...prev, newBm]);
    }
  };

  const isCurrentBookmarked = bookmarks.some(b => b.url === activeTab.url);

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] text-slate-100 font-sans overflow-hidden select-none">
      {/* ── TOP BROWSER TITLE & TRAFFIC LIGHT BAR ── */}
      <div className="h-10 px-4 bg-[#26282e] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 cursor-pointer" title="Close Safari" />
          <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 cursor-pointer" title="Minimize Safari" />
          <button onClick={onMaximize} className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 cursor-pointer" title="Zoom Safari" />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Compass className="w-4 h-4 text-sky-400" />
          <span>Safari — {activeTab.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveDrawer(activeDrawer === 'history' ? null : 'history')}
            className={`p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition ${activeDrawer === 'history' ? 'bg-white/10 text-sky-400' : ''}`}
            title="Browsing History"
          >
            <Clock className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setActiveDrawer(activeDrawer === 'downloads' ? null : 'downloads')}
            className={`p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition relative ${activeDrawer === 'downloads' ? 'bg-white/10 text-sky-400' : ''}`}
            title="Download Manager"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>
        </div>
      </div>

      {/* ── SAFARI TAB BAR ── */}
      <div className="h-8 px-2 bg-[#1c1d22] border-b border-black/40 flex items-center justify-between gap-1 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {tabs.map(tab => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTabContextMenu({ x: e.clientX, y: e.clientY, tabId: tab.id });
                }}
                className={`group h-7 px-3 rounded-lg flex items-center gap-2 text-xs font-medium cursor-pointer transition select-none max-w-[200px] truncate ${
                  isActive ? 'bg-[#2b2d35] text-white shadow-sm border border-white/10' : 'bg-transparent text-slate-400 hover:bg-white/5'
                }`}
              >
                <Globe className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="truncate flex-1">{tab.title}</span>
                <button
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/20 rounded p-0.5 text-slate-300 transition"
                  title="Close tab"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
          <button
            onClick={() => handleCreateTab()}
            className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition"
            title="New Tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── ADDRESS TOOLBAR & NAVIGATION CONTROLS ── */}
      <div className="h-10 px-3 bg-[#26282e] border-b border-black/40 flex items-center justify-between gap-3 shrink-0 relative">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 text-slate-300">
          <button
            onClick={handleGoBack}
            disabled={activeTab.historyIndex <= 0}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleGoForward}
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition"
            title="Reload Page"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address and Search Field */}
        <form onSubmit={handleAddressSubmit} className="flex-1 max-w-2xl relative">
          <div className="h-7 px-3 rounded-full bg-black/40 border border-white/15 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 flex items-center gap-2 transition">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Search or enter website name (e.g. wikipedia.org)..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-400 font-mono truncate"
            />
            {addressInput && (
              <button 
                type="button" 
                onClick={() => setAddressInput('')} 
                className="hover:text-white text-slate-400 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              onClick={toggleBookmark}
              className={`p-0.5 cursor-pointer transition ${isCurrentBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-400 hover:text-white'}`}
              title="Bookmark this page"
            >
              <Star className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-slate-300">
          <button 
            onClick={() => {
              if (activeTab.url && activeTab.url !== 'safari://start') {
                window.open(activeTab.url, '_blank');
              }
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition"
            title="Open Current URL in Host Browser Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Loading Bar */}
        {loadProgress > 0 && (
          <div 
            style={{ width: `${loadProgress}%` }}
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-200"
          />
        )}
      </div>

      {/* ── BOOKMARKS TOOLBAR ── */}
      <div className="h-6 px-3 bg-[#1e2026] border-b border-black/40 flex items-center gap-3 text-[11px] text-slate-400 overflow-x-auto shrink-0 select-none">
        <span className="text-[10px] uppercase font-bold text-slate-500">Bookmarks:</span>
        {bookmarks.map(bm => (
          <button
            key={bm.id}
            onClick={() => navigateTo(bm.url)}
            className="hover:text-white hover:bg-white/10 px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>{bm.icon || '🔖'}</span>
            <span>{bm.title}</span>
          </button>
        ))}
      </div>

      {/* ── BROWSER VIEWPORT & TAB CONTENTS ── */}
      <div className="flex-1 relative overflow-hidden bg-[#121316]">
        {/* START PAGE (DEFAULT NEW TAB) */}
        {activeTab.url === 'safari://start' ? (
          <div className="w-full h-full p-8 overflow-y-auto space-y-8 max-w-4xl mx-auto">
            {/* Center Logo & Search */}
            <div className="text-center pt-6 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-2xl">
                <Compass className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Safari</h1>
              <p className="text-xs text-slate-400">Fast, private, and secure web browsing in AppleTree macOS</p>

              {/* Big Start Page Search Box */}
              <form onSubmit={handleAddressSubmit} className="max-w-xl mx-auto pt-2">
                <div className="h-10 px-4 rounded-2xl bg-white/10 border border-white/20 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 flex items-center gap-3 shadow-lg">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="Search with Google, DuckDuckGo or enter URL..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-400"
                  />
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span 
                      onClick={() => setSearchEngine('google')} 
                      className={`cursor-pointer px-1.5 py-0.5 rounded ${searchEngine === 'google' ? 'bg-sky-500 text-white font-bold' : 'hover:text-white'}`}
                    >
                      Google
                    </span>
                    <span 
                      onClick={() => setSearchEngine('duckduckgo')} 
                      className={`cursor-pointer px-1.5 py-0.5 rounded ${searchEngine === 'duckduckgo' ? 'bg-sky-500 text-white font-bold' : 'hover:text-white'}`}
                    >
                      DDG
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Favorites Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Favorites</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DEFAULT_FAVORITES.map(fav => (
                  <div
                    key={fav.id}
                    onClick={() => navigateTo(fav.url)}
                    className="group p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/50 transition cursor-pointer flex items-center gap-3 shadow-sm hover:scale-[1.02] active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition">
                      {fav.icon}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white group-hover:text-sky-300 truncate">{fav.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{fav.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Report Widget */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Intelligent Tracking Prevention</h4>
                  <p className="text-[11px] text-slate-300">23 Trackers Prevented from Profiling You in this Session</p>
                </div>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">100% Protected</span>
            </div>
          </div>
        ) : (
          /* EMBEDDED WEB VIEW OR CLEAN SECURITY FALLBACK */
          <div className="w-full h-full flex flex-col relative bg-white">
            {/* Live Sandboxed Iframe */}
            <iframe
              ref={iframeRef}
              title={activeTab.title}
              src={activeTab.url}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="w-full flex-1 border-none bg-white"
              onError={() => {
                setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, isBlocked: true } : t));
              }}
            />

            {/* Smart Detection & External Tab Launcher Floating Bar */}
            <div className="absolute top-3 right-4 z-20 flex items-center gap-2 p-1.5 rounded-xl backdrop-blur-xl bg-slate-950/85 border border-white/20 shadow-xl text-xs text-white">
              <span className="text-[11px] text-slate-300 px-1 truncate max-w-[200px]">{activeTab.url}</span>
              <button
                onClick={() => window.open(activeTab.url, '_blank')}
                className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Host Tab</span>
              </button>
            </div>
          </div>
        )}

        {/* ── SLIDE-OUT HISTORY DRAWER ── */}
        {activeDrawer === 'history' && (
          <div className="absolute top-0 right-0 w-80 h-full backdrop-blur-3xl bg-slate-950/95 border-l border-white/15 p-4 z-30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                Browsing History ({historyList.length})
              </h3>
              <button onClick={() => setActiveDrawer(null)} className="p-1 hover:text-white text-slate-400 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-1">
              {historyList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No browsing history yet</div>
              ) : (
                historyList.map(h => (
                  <div
                    key={h.id}
                    onClick={() => { navigateTo(h.url); setActiveDrawer(null); }}
                    className="p-2 rounded-xl hover:bg-white/10 transition cursor-pointer space-y-0.5"
                  >
                    <div className="text-xs font-bold text-white truncate">{h.title}</div>
                    <div className="text-[10px] text-sky-400 truncate">{h.url}</div>
                    <div className="text-[9px] text-slate-500">{h.timestamp} · {h.date}</div>
                  </div>
                ))
              )}
            </div>

            {historyList.length > 0 && (
              <button
                onClick={() => setHistoryList([])}
                className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All History
              </button>
            )}
          </div>
        )}

        {/* ── SLIDE-OUT DOWNLOADS DRAWER ── */}
        {activeDrawer === 'downloads' && (
          <div className="absolute top-0 right-0 w-80 h-full backdrop-blur-3xl bg-slate-950/95 border-l border-white/15 p-4 z-30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                Downloads
              </h3>
              <button onClick={() => setActiveDrawer(null)} className="p-1 hover:text-white text-slate-400 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-2">
              {downloads.map(dl => (
                <div key={dl.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{dl.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">100%</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-full" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{dl.size}</span>
                    <span className="text-sky-400 cursor-pointer hover:underline">Show in Finder</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── TAB CONTEXT MENU ── */}
      {tabContextMenu && (
        <div
          style={{ top: tabContextMenu.y, left: tabContextMenu.x }}
          className="fixed z-[99999] w-48 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-white/20 p-1.5 shadow-2xl text-xs text-slate-200 select-none animate-in fade-in"
          onClick={() => setTabContextMenu(null)}
        >
          <button
            onClick={() => handleCloseTab({ stopPropagation: () => {} }, tabContextMenu.tabId)}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-600 hover:text-white flex items-center justify-between cursor-pointer text-rose-400 font-semibold"
          >
            <span>Close Tab</span>
            <span className="text-[10px] opacity-60">⌘W</span>
          </button>
          <button
            onClick={() => handleDuplicateTab(tabContextMenu.tabId)}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
          >
            <span>Duplicate Tab</span>
          </button>
          <button
            onClick={() => {
              setTabs(prev => prev.filter(t => t.id === tabContextMenu.tabId));
              setActiveTabId(tabContextMenu.tabId);
              setTabContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-between cursor-pointer"
          >
            <span>Close Other Tabs</span>
          </button>
        </div>
      )}
    </div>
  );
}
