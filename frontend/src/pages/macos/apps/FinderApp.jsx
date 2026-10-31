import React, { useState, useEffect } from 'react';
import { 
  Folder, FileText, Image, Music, Video, Plus, Trash2, 
  Search, ArrowLeft, ArrowRight, LayoutGrid, List, Columns,
  Upload, Download, Eye, Terminal, HardDrive, RefreshCw
} from 'lucide-react';
import vfs from '../services/vfs.js';
import macSound from '../services/sound.js';
import { MacMySQLIcon } from '../MacOSDesktop.jsx';

export default function FinderApp({ onOpenFile, onOpenTerminal, onOpenApp }) {
  const [currentPath, setCurrentPath] = useState('/Users/admin/Desktop');
  const [history, setHistory] = useState(['/Users/admin/Desktop']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'columns'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quickLookItem, setQuickLookItem] = useState(null);
  const [isRenaming, setIsRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const loadDirectory = async (path) => {
    try {
      const list = await vfs.list(path);
      setItems(list);
    } catch (err) {
      console.error('Finder load error:', err);
    }
  };

  useEffect(() => {
    loadDirectory(currentPath);
    const unsubscribe = vfs.subscribe(() => {
      loadDirectory(currentPath);
    });
    return unsubscribe;
  }, [currentPath]);

  const navigateTo = (newPath) => {
    macSound.playClick();
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newPath);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setCurrentPath(newPath);
    setSelectedItem(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      macSound.playClick();
      setHistoryIndex(prev => prev - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      macSound.playClick();
      setHistoryIndex(prev => prev + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const handleCreateFolder = async () => {
    macSound.playPop();
    const baseName = 'Untitled Folder';
    let folderName = baseName;
    let counter = 1;
    while (items.some(i => i.name === folderName)) {
      folderName = `${baseName} ${counter}`;
      counter++;
    }
    await vfs.mkdir(`${currentPath}/${folderName}`);
  };

  const handleCreateFile = async () => {
    macSound.playPop();
    const baseName = 'untitled.txt';
    let fileName = baseName;
    let counter = 1;
    while (items.some(i => i.name === fileName)) {
      fileName = `untitled_${counter}.txt`;
      counter++;
    }
    await vfs.writeFile(`${currentPath}/${fileName}`, 'Hello from macOS Sequoia!', 'text/plain');
  };

  const handleDelete = async (item) => {
    macSound.playTrash();
    if (currentPath === '/Users/admin/.Trash') {
      await vfs.delete(item.path, false);
    } else {
      await vfs.delete(item.path, true);
    }
    setSelectedItem(null);
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const content = uploadEvent.target.result;
        await vfs.writeFile(`${currentPath}/${file.name}`, content, file.type || 'text/plain');
        macSound.playPop();
      };
      reader.readAsText(file);
    });
  };

  const handleDownload = (item) => {
    if (item.type !== 'file') return;
    const blob = new Blob([item.content || ''], { type: item.mimeType || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes) => {
    if (!bytes) return '--';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getItemIcon = (item) => {
    if (item.appId === 'mysql-studio' || item.name.toLowerCase().includes('mysql')) {
      return <div className="w-10 h-10 p-0.5"><MacMySQLIcon /></div>;
    }
    if (item.type === 'folder') {
      return <Folder className="w-10 h-10 text-sky-400 fill-sky-400/20" />;
    }
    if (item.name.endsWith('.app')) {
      return <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-xl shadow">🚀</div>;
    }
    const ext = item.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(ext)) {
      return <Image className="w-10 h-10 text-emerald-400" />;
    }
    if (['mp3', 'wav', 'aac'].includes(ext)) {
      return <Music className="w-10 h-10 text-purple-400" />;
    }
    if (['mp4', 'mov', 'webm'].includes(ext)) {
      return <Video className="w-10 h-10 text-amber-400" />;
    }
    return <FileText className="w-10 h-10 text-slate-300" />;
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      navigateTo(item.path);
    } else if (item.appId || item.name.endsWith('.app')) {
      if (onOpenApp) {
        onOpenApp(item.appId || (item.name.toLowerCase().includes('mysql') ? 'mysql-studio' : 'vscode'));
      } else {
        onOpenFile(item);
      }
    } else {
      onOpenFile(item);
    }
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex-1 flex flex-col bg-slate-900/90 text-slate-100 overflow-hidden">
      {/* Finder Navigation Bar */}
      <div className="h-11 px-4 bg-slate-800/80 border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-slate-300" />
          </button>

          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2 font-mono">
            <span 
              onClick={() => navigateTo('/')}
              className="hover:text-white cursor-pointer"
            >
              Macintosh HD
            </span>
            {breadcrumbs.map((crumb, idx) => {
              const fullPath = '/' + breadcrumbs.slice(0, idx + 1).join('/');
              return (
                <React.Fragment key={fullPath}>
                  <span>/</span>
                  <span
                    onClick={() => navigateTo(fullPath)}
                    className={`hover:text-white cursor-pointer ${idx === breadcrumbs.length - 1 ? 'text-sky-300 font-bold' : ''}`}
                  >
                    {crumb}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* View Toggles & Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Selector */}
          <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('columns')}
              className={`p-1 rounded ${viewMode === 'columns' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Folder */}
          <button
            onClick={handleCreateFolder}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-slate-200 transition font-medium"
          >
            <Plus className="w-3 h-3 text-sky-400" /> Folder
          </button>

          {/* Add File */}
          <button
            onClick={handleCreateFile}
            className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-slate-200 transition font-medium"
          >
            <Plus className="w-3 h-3 text-emerald-400" /> File
          </button>

          {/* Upload File */}
          <label className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg text-slate-200 transition font-medium cursor-pointer">
            <Upload className="w-3 h-3 text-amber-400" /> Upload
            <input type="file" multiple onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search in folder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500 w-36"
            />
          </div>
        </div>
      </div>

      {/* Main Finder Body with Sidebar & File View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-48 bg-slate-950/60 border-r border-white/10 p-3 flex flex-col justify-between shrink-0 select-none text-xs">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 px-2 tracking-wider">Favorites</span>
              <div className="mt-1 space-y-0.5">
                {[
                  { name: 'Desktop', path: '/Users/admin/Desktop', icon: HardDrive },
                  { name: 'Documents', path: '/Users/admin/Documents', icon: FileText },
                  { name: 'Downloads', path: '/Users/admin/Downloads', icon: Download },
                  { name: 'Pictures', path: '/Users/admin/Pictures', icon: Image },
                  { name: 'Music', path: '/Users/admin/Music', icon: Music },
                  { name: 'Applications', path: '/Applications', icon: Folder }
                ].map(fav => (
                  <button
                    key={fav.path}
                    onClick={() => navigateTo(fav.path)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium transition cursor-pointer ${
                      currentPath === fav.path ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <fav.icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    <span className="truncate">{fav.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 px-2 tracking-wider">Locations</span>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => navigateTo('/')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium transition cursor-pointer ${
                    currentPath === '/' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>Macintosh HD</span>
                </button>
                <button
                  onClick={() => navigateTo('/Users/admin/.Trash')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left font-medium transition cursor-pointer ${
                    currentPath === '/Users/admin/.Trash' ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span>Trash</span>
                </button>
              </div>
            </div>
          </div>

          {currentPath === '/Users/admin/.Trash' && (
            <button
              onClick={() => { macSound.playTrash(); vfs.emptyTrash(); }}
              className="w-full py-1.5 bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Empty Trash
            </button>
          )}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-5 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Folder className="w-12 h-12 stroke-1 mb-2 opacity-50" />
              <p className="text-sm">Folder is empty</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.path}
                  onClick={() => setSelectedItem(item)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  className={`flex flex-col items-center p-3 rounded-xl cursor-pointer text-center group transition ${
                    selectedItem?.path === item.path ? 'bg-sky-600/40 border border-sky-400/50' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    {getItemIcon(item)}
                  </div>
                  <span className="mt-2 text-xs font-medium text-slate-200 truncate max-w-[100px]">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.type === 'folder' ? 'Folder' : formatSize(item.size)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold">
                    <th className="pb-2 pl-2">Name</th>
                    <th className="pb-2">Date Modified</th>
                    <th className="pb-2">Size</th>
                    <th className="pb-2">Kind</th>
                    <th className="pb-2 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredItems.map(item => (
                    <tr
                      key={item.path}
                      onClick={() => setSelectedItem(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      className={`hover:bg-white/10 cursor-pointer ${
                        selectedItem?.path === item.path ? 'bg-sky-600/30' : ''
                      }`}
                    >
                      <td className="py-2 pl-2 flex items-center gap-2 text-slate-200 font-medium">
                        {item.type === 'folder' ? <Folder className="w-4 h-4 text-sky-400" /> : <FileText className="w-4 h-4 text-slate-400" />}
                        <span>{item.name}</span>
                      </td>
                      <td className="py-2 text-slate-400">{new Date(item.updatedAt || Date.now()).toLocaleDateString()}</td>
                      <td className="py-2 text-slate-400">{item.type === 'folder' ? '--' : formatSize(item.size)}</td>
                      <td className="py-2 text-slate-400">{item.type === 'folder' ? 'Folder' : item.mimeType || 'Document'}</td>
                      <td className="py-2 text-right pr-2 space-x-2">
                        {item.type === 'file' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); setQuickLookItem(item); }}
                              title="Quick Look"
                              className="text-slate-400 hover:text-white"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDownload(item); }}
                              title="Download to PC"
                              className="text-slate-400 hover:text-sky-400"
                            >
                              <Download className="w-3.5 h-3.5 inline" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                          title="Delete"
                          className="text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Look Preview Modal */}
      {quickLookItem && (
        <div
          onClick={() => setQuickLookItem(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-slate-900 border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                {quickLookItem.name}
              </span>
              <button
                onClick={() => setQuickLookItem(null)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto mt-4 p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 whitespace-pre-wrap">
              {quickLookItem.content || '(File is empty or binary content)'}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => { onOpenFile(quickLookItem); setQuickLookItem(null); }}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
              >
                Open in Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
