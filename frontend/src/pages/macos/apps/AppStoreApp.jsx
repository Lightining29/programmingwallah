import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Download, Check, Trash2, Search, Play, 
  ExternalLink, Upload, Star, ShieldCheck, Box, RefreshCw 
} from 'lucide-react';
import appRegistry, { APP_STORE_CATALOG } from '../services/appRegistry.js';
import macSound from '../services/sound.js';

export default function AppStoreApp({ onLaunchApp }) {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [installedApps, setInstalledApps] = useState([]);
  const [installingId, setInstallingId] = useState(null);
  const [installProgress, setInstallProgress] = useState(0);
  const [selectedApp, setSelectedApp] = useState(null);

  const refreshInstalled = () => {
    setInstalledApps(appRegistry.getInstalledApps());
  };

  useEffect(() => {
    refreshInstalled();
    const unsub = appRegistry.subscribe(refreshInstalled);
    return unsub;
  }, []);

  const handleInstall = (app) => {
    if (appRegistry.isInstalled(app.id)) {
      onLaunchApp(app.id);
      return;
    }

    macSound.playPop();
    setInstallingId(app.id);
    setInstallProgress(10);

    const step1 = setTimeout(() => setInstallProgress(45), 250);
    const step2 = setTimeout(() => setInstallProgress(85), 550);
    const step3 = setTimeout(async () => {
      setInstallProgress(100);
      await appRegistry.installApp(app);
      setInstallingId(null);
      setInstallProgress(0);
      refreshInstalled();
    }, 850);
  };

  const handleUninstall = async (appId) => {
    macSound.playTrash();
    await appRegistry.uninstallApp(appId);
    refreshInstalled();
  };

  const handleImportWebapp = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const pkg = JSON.parse(evt.target.result);
        if (!pkg.id || !pkg.name) {
          alert('Invalid .webapp manifest: Missing required "id" or "name" fields.');
          return;
        }
        await appRegistry.installApp(pkg);
        refreshInstalled();
        alert(`Successfully installed ${pkg.name}!`);
      } catch (err) {
        alert('Failed to parse .webapp package: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const filteredCatalog = APP_STORE_CATALOG.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        app.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'discover') return matchSearch;
    if (activeTab === 'installed') return matchSearch && appRegistry.isInstalled(app.id);
    return matchSearch && app.category.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="flex-1 flex bg-slate-900/95 text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-56 bg-slate-950/70 border-r border-white/10 p-4 flex flex-col justify-between shrink-0 select-none text-xs">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 pb-2 border-b border-white/10">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-500 to-sky-400 flex items-center justify-center font-black text-white text-xs shadow-md">
              A
            </span>
            <span className="font-bold text-white text-sm">App Store</span>
          </div>

          <div className="space-y-1">
            {[
              { id: 'discover', label: 'Discover', icon: Sparkles },
              { id: 'productivity', label: 'Productivity', icon: Box },
              { id: 'games', label: 'Arcade & Games', icon: Play },
              { id: 'design', label: 'Design & Creative', icon: Star },
              { id: 'utilities', label: 'Utilities & Tools', icon: ShieldCheck },
              { id: 'installed', label: `Installed (${installedApps.length})`, icon: Check }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { macSound.playClick(); setActiveTab(tab.id); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition cursor-pointer ${
                  activeTab === tab.id ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-900/40' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4 opacity-80" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Developer Package Import Tool */}
        <div className="pt-4 border-t border-white/10">
          <label className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-sky-300 rounded-xl font-bold cursor-pointer transition text-center">
            <Upload className="w-3.5 h-3.5" />
            <span>Import .webapp</span>
            <input type="file" accept=".json,.webapp" onChange={handleImportWebapp} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Store View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Search */}
        <div className="h-12 px-6 border-b border-white/10 flex items-center justify-between bg-slate-900/40 shrink-0">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search apps, games, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
            />
          </div>
          <span className="text-[11px] text-slate-400 font-medium">macOS App Store Pro v15.2</span>
        </div>

        {/* Catalog Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Featured Hero Banner on Discover */}
          {activeTab === 'discover' && !searchQuery && (
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-sky-900/80 border border-white/20 p-8 shadow-2xl flex items-center justify-between">
              <div className="max-w-md space-y-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-sky-300">Featured Application</span>
                <h2 className="text-2xl font-black text-white">Markdown Studio Pro</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time split editing, GitHub Flavored Markdown, live MathJax equations, and instant HTML export directly inside macOS.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleInstall(APP_STORE_CATALOG[0])}
                    className="bg-white text-slate-900 font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-200 transition shadow-lg"
                  >
                    {appRegistry.isInstalled(APP_STORE_CATALOG[0].id) ? 'Open App' : 'Get App — Free'}
                  </button>
                </div>
              </div>
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-4xl shadow-2xl">
                📝
              </div>
            </div>
          )}

          {/* App Cards Grid */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 capitalize">
              {activeTab === 'discover' ? 'Popular Applications' : activeTab}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCatalog.map(app => {
                const isInstalled = appRegistry.isInstalled(app.id);
                const isDownloading = installingId === app.id;

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800/90 border border-white/10 hover:border-white/20 transition cursor-pointer flex gap-4 items-center group"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${app.iconColor} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                      {app.iconType === 'markdown' ? '📝' : app.iconType === 'game' ? '🎮' : app.iconType === 'paint' ? '🎨' : app.iconType === 'timer' ? '⏱️' : '{ }'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white truncate">{app.name}</h4>
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">{app.version}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{app.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                        <span className="flex items-center text-amber-400">★ {app.rating}</span>
                        <span>{app.category}</span>
                        <span>{app.size}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isDownloading ? (
                        <div className="w-20 text-center">
                          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-sky-400 h-full transition-all duration-300" style={{ width: `${installProgress}%` }} />
                          </div>
                          <span className="text-[9px] text-sky-400 mt-1 block">Installing...</span>
                        </div>
                      ) : isInstalled ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); onLaunchApp(app.id); }}
                            className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded-full text-xs transition flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-white" /> Open
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUninstall(app.id); }}
                            title="Uninstall"
                            className="p-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleInstall(app); }}
                          className="bg-white/10 hover:bg-white text-sky-400 hover:text-slate-900 font-bold px-4 py-1.5 rounded-full text-xs transition flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Get
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* App Details Modal */}
      {selectedApp && (
        <div
          onClick={() => setSelectedApp(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedApp.iconColor} flex items-center justify-center text-3xl shadow-xl`}>
                  {selectedApp.iconType === 'markdown' ? '📝' : selectedApp.iconType === 'game' ? '🎮' : selectedApp.iconType === 'paint' ? '🎨' : selectedApp.iconType === 'timer' ? '⏱️' : '{ }'}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{selectedApp.name}</h3>
                  <p className="text-xs text-sky-400 font-medium">{selectedApp.developer}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Version {selectedApp.version} • {selectedApp.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ×
              </button>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/10 text-xs text-slate-300 leading-relaxed">
              {selectedApp.description}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Rating</span>
                <span className="font-bold text-amber-400">★ {selectedApp.rating}</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Size</span>
                <span className="font-bold text-white">{selectedApp.size}</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Sandbox</span>
                <span className="font-bold text-emerald-400">Verified</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
              <button
                onClick={() => { handleInstall(selectedApp); setSelectedApp(null); }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
              >
                {appRegistry.isInstalled(selectedApp.id) ? 'Launch Application' : 'Install Package (.webapp)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
