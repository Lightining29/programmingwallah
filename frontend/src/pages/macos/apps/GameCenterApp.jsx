import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Search, 
  Flame, 
  Trophy, 
  Heart, 
  Sparkles, 
  Star, 
  Play, 
  Pin, 
  Clock, 
  Check, 
  Grid, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  ChevronRight
} from 'lucide-react';
import { GAMES_CATALOG, GAME_CATEGORIES } from '../services/gameCatalog.js';
import macSound from '../services/sound.js';

export default function GameCenterApp({ 
  onLaunchGame, 
  installedDockGames = [], 
  onToggleDockGame,
  currentUser 
}) {
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'library' | 'leaderboards'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gameStats, setGameStats] = useState({});
  const [favorites, setFavorites] = useState({});

  // Fetch user game stats & favorites from backend
  useEffect(() => {
    fetch('/api/macos/desktop/games')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.games)) {
          const statsMap = {};
          const favMap = {};
          data.games.forEach(g => {
            statsMap[g.gameId] = g;
            if (g.isFavorite) favMap[g.gameId] = true;
          });
          setGameStats(statsMap);
          setFavorites(favMap);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleFavorite = async (gameId, e) => {
    e.stopPropagation();
    macSound.playPop();
    const isFav = !favorites[gameId];
    setFavorites(prev => ({ ...prev, [gameId]: isFav }));

    try {
      await fetch(`/api/macos/desktop/games/${gameId}/favorite`, { method: 'POST' });
    } catch {}
  };

  const filteredGames = GAMES_CATALOG.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const featuredGames = GAMES_CATALOG.filter(g => g.featured);
  const arcadeGames = GAMES_CATALOG.filter(g => g.category === 'arcade' || g.category === 'classic');
  const puzzleGames = GAMES_CATALOG.filter(g => g.category === 'puzzle' || g.category === 'strategy');

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white select-none overflow-hidden font-sans">
      {/* ── Top Discovery Header ── */}
      <header className="h-14 px-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>Game Center</span>
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                Playhop Edition
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">Play instant in-desktop games with zero external redirects</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'discover' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'library' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Library ({installedDockGames.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboards')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leaderboards' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboards</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-64 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 100+ arcade, puzzles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>
      </header>

      {/* ── Categories Bar ── */}
      <div className="px-6 py-2.5 bg-slate-900/50 border-b border-white/5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
        {GAME_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
              selectedCategory === cat.id
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30 font-bold'
                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'discover' && (
          <>
            {/* Featured Hero Banner */}
            {!searchQuery && selectedCategory === 'all' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredGames.slice(0, 3).map(game => (
                  <div
                    key={game.id}
                    className={`relative rounded-3xl p-5 overflow-hidden bg-gradient-to-br ${game.iconGradient} shadow-2xl flex flex-col justify-between h-48 border border-white/20 group hover:scale-[1.01] transition-all`}
                  >
                    <div className="flex items-start justify-between z-10">
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-black/40 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
                          {game.badge || 'FEATURED'}
                        </span>
                        <h2 className="text-xl font-black text-white mt-2 drop-shadow-md">{game.title}</h2>
                        <p className="text-xs text-white/80 line-clamp-2 max-w-xs mt-1 drop-shadow-sm">{game.description}</p>
                      </div>
                      <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">{game.iconEmoji}</span>
                    </div>

                    <div className="flex items-center justify-between z-10 pt-2 border-t border-white/20">
                      <div className="flex items-center gap-2 text-xs font-bold text-white drop-shadow">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {game.rating}</span>
                        <span>•</span>
                        <span>{game.plays} plays</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleDockGame(game.id)}
                          className={`p-2 rounded-xl backdrop-blur-md transition cursor-pointer text-xs font-bold ${
                            installedDockGames.includes(game.id)
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'bg-black/40 hover:bg-black/60 text-white'
                          }`}
                          title={installedDockGames.includes(game.id) ? 'In Dock' : 'Add to Dock'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onLaunchGame(game)}
                          className="px-4 py-2 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-amber-300 transition shadow-lg cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Trending Games Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>Trending on macOS</span>
                </h3>
                <span className="text-xs text-slate-400 font-semibold">{filteredGames.length} games available</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredGames.map(game => {
                  const isDocked = installedDockGames.includes(game.id);
                  const isFav = Boolean(favorites[game.id]);
                  const stats = gameStats[game.id];

                  return (
                    <div
                      key={game.id}
                      onClick={() => onLaunchGame(game)}
                      className="group relative rounded-2xl bg-slate-900 border border-white/10 hover:border-blue-500/50 p-3 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-950/40 transition-all cursor-pointer hover:-translate-y-1"
                    >
                      <div>
                        {/* Game Thumbnail Cover */}
                        <div className={`w-full aspect-square rounded-xl bg-gradient-to-tr ${game.iconGradient} flex items-center justify-center text-4xl shadow-md relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                          <span>{game.iconEmoji}</span>
                          
                          {/* Favorite button */}
                          <button
                            onClick={(e) => handleToggleFavorite(game.id, e)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition cursor-pointer"
                            title="Favorite"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                          </button>

                          {/* Category Badge */}
                          <span className="absolute bottom-1.5 left-1.5 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md bg-black/50 text-white backdrop-blur-md">
                            {game.categoryName}
                          </span>
                        </div>

                        {/* Title and tags */}
                        <div className="mt-2.5">
                          <h4 className="font-extrabold text-xs text-white truncate group-hover:text-blue-400 transition-colors">
                            {game.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                              <Star className="w-3 h-3 fill-current" /> {game.rating}
                            </span>
                            <span>•</span>
                            <span>{game.plays}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleDockGame(game.id);
                          }}
                          className={`p-1.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                            isDocked
                              ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                          title={isDocked ? 'Remove from Dock' : 'Add to Dock'}
                        >
                          <Pin className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onLaunchGame(game)}
                          className="flex-1 py-1 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold transition cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-blue-900/30"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Play</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* ── My Library & Installed ── */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white">My Installed Games & Favorites</h2>
              <p className="text-xs text-slate-400">Games pinned to your personal macOS Dock and stored in your home directory</p>
            </div>

            {installedDockGames.length === 0 ? (
              <div className="text-center py-16 space-y-3 bg-white/5 rounded-3xl border border-white/10 p-8">
                <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="font-bold text-sm text-slate-200">No Games Pinned in Dock Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Browse the Game Center and click the "Pin to Dock" icon on any game to instantly add it to your macOS desktop Dock.
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
                >
                  Discover Games
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {installedDockGames.map(gameId => {
                  const game = GAMES_CATALOG.find(g => g.id === gameId);
                  if (!game) return null;
                  const stats = gameStats[gameId];

                  return (
                    <div
                      key={game.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between gap-4 shadow-lg hover:border-blue-500/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.iconGradient} flex items-center justify-center text-3xl shadow-md`}>
                          <span>{game.iconEmoji}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{game.title}</h4>
                          <p className="text-xs text-slate-400">{game.categoryName} • {game.developer}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-400 font-bold">
                            <Trophy className="w-3 h-3 text-amber-400" />
                            <span>High Score: {stats?.highScore || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleDockGame(game.id)}
                          className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 transition cursor-pointer text-xs"
                          title="Remove from Dock"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => onLaunchGame(game)}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition cursor-pointer flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Play</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Leaderboards & Achievements ── */}
        {activeTab === 'leaderboards' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/50 via-slate-900 to-indigo-950/50 border border-purple-500/30 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-3xl shadow-lg">
                  🎮
                </div>
                <div>
                  <span className="text-[10px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full font-bold uppercase">
                    Player Profile
                  </span>
                  <h2 className="text-xl font-black text-white mt-1">
                    {currentUser?.displayName || currentUser?.username || 'AppleTree Pro Gamer'}
                  </h2>
                  <p className="text-xs text-slate-400">macOS Gaming ID: #{currentUser?.id || 'usr_01'}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Games Played</span>
                  <span className="text-xl font-black text-emerald-400">
                    {Object.values(gameStats).reduce((acc, s) => acc + (s.playCount || 0), 0)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Dock Installed</span>
                  <span className="text-xl font-black text-blue-400">{installedDockGames.length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Personal Best Records</span>
              </h3>

              <div className="space-y-2">
                {GAMES_CATALOG.map((game, idx) => {
                  const stats = gameStats[game.id];
                  const score = stats?.highScore || 0;

                  return (
                    <div
                      key={game.id}
                      className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-bold text-xs text-slate-500">#{idx + 1}</span>
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${game.iconGradient} flex items-center justify-center text-lg shadow`}>
                          <span>{game.iconEmoji}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">{game.title}</h4>
                          <span className="text-[10px] text-slate-400">{game.categoryName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block">High Score</span>
                          <span className="font-black text-sm text-amber-400">{score}</span>
                        </div>
                        <button
                          onClick={() => onLaunchGame(game)}
                          className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
