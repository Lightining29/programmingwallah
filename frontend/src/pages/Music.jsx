import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Heart, 
  Search, 
  Plus, 
  FolderPlus, 
  ListMusic, 
  Music as MusicIcon, 
  Radio, 
  Sparkles, 
  Share2, 
  ExternalLink, 
  Download, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Clock, 
  Trash2, 
  Check, 
  X, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Cloud, 
  HardDrive, 
  Compass, 
  Disc, 
  Headphones, 
  Layers, 
  ChevronRight, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEFAULT GOOGLE DRIVE & CODING FOCUS TRACKS REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────
// Google Drive audio streaming format helper:
// Any Google Drive file ID can be streamed via:
// https://docs.google.com/uc?export=download&id=DRIVE_FILE_ID or direct stream endpoint
export const getDriveStreamUrl = (driveIdOrUrl) => {
  if (!driveIdOrUrl) return '';
  // If it's already a direct http/https url with mp3, return it
  if (driveIdOrUrl.startsWith('http') && !driveIdOrUrl.includes('drive.google.com')) {
    return driveIdOrUrl;
  }
  // Extract ID from Drive URLs like:
  // https://drive.google.com/file/d/1A2B3C.../view?usp=sharing
  // https://drive.google.com/open?id=1A2B3C...
  let fileId = driveIdOrUrl;
  const match = driveIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveIdOrUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    fileId = match[1];
  }
  return `https://docs.google.com/uc?export=download&id=${fileId}`;
};

const DEFAULT_MUSIC_TRACKS = [
  {
    id: 'track-1',
    title: 'Midnight Coding Chill (Lo-Fi Beats)',
    artist: 'Lofi Girl & Chillhop Academy',
    album: 'Deep Focus & Late Night Algorithms',
    genre: 'Lo-Fi',
    duration: '03:42',
    driveId: '1LoFiCodingBeatsAutumn2024Night',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    coverArt: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    lyrics: 'Chill synth pads, steady vinyl crackle, and soothing basslines to achieve flow state in DSA coding.',
    isGoogleDrive: true,
    addedAt: '2024-09-01'
  },
  {
    id: 'track-2',
    title: 'Cyberpunk Neon Matrix (Synthwave Flow)',
    artist: 'DevSynthetics & Tokyo Grid',
    album: 'Full Stack Cyber City 2077',
    genre: 'Synthwave',
    duration: '04:15',
    driveId: '1SynthwaveNeonCyberpunkMatrixDrive',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=synthwave-80s-110045.mp3',
    coverArt: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    lyrics: 'High energy 80s analog synthesizers and driving drum machines for lightning fast problem solving.',
    isGoogleDrive: true,
    addedAt: '2024-09-02'
  },
  {
    id: 'track-3',
    title: 'Zen Garden Coffeehouse (Acoustic Piano)',
    artist: 'Acoustic Morning Duo',
    album: 'Peaceful Mind & Software Architecture',
    genre: 'Acoustic',
    duration: '02:58',
    driveId: '1ZenGardenCoffeehouseAcousticPiano',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77e30.mp3?filename=peaceful-piano-123438.mp3',
    coverArt: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    lyrics: 'Warm fingerstyle acoustic guitar and gentle morning piano notes to untangle complex logic.',
    isGoogleDrive: true,
    addedAt: '2024-09-03'
  },
  {
    id: 'track-4',
    title: 'Deep Space Ambient Voyager (Brainwave Gamma)',
    artist: 'Cosmic Ambient Soundscapes',
    album: 'Binary Stars & Infinite Loops',
    genre: 'Ambient',
    duration: '05:12',
    driveId: '1DeepSpaceAmbientVoyagerGammaWave',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    coverArt: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    lyrics: 'Deep drone textures and slow atmospheric resonance for hours of uninterrupted programming focus.',
    isGoogleDrive: true,
    addedAt: '2024-09-04'
  },
  {
    id: 'track-5',
    title: 'Electro Coding Pulse (Fast BPM Work)',
    artist: 'Binary Pulse Beats',
    album: 'Sprint Zero: High Velocity Production',
    genre: 'Electronic',
    duration: '03:22',
    driveId: '1ElectroCodingPulseFastBpmWork',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_8f4aa3e351.mp3?filename=electronic-future-beats-117997.mp3',
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    lyrics: 'Dynamic rhythmic electronic drums and pulsing basslines to power through tight project deadlines.',
    isGoogleDrive: true,
    addedAt: '2024-09-05'
  },
  {
    id: 'track-6',
    title: 'Rainy Night In Silicon Valley (Cozy Lo-Fi)',
    artist: 'Hacker Cafe Records',
    album: 'Terminal Windows & Warm Tea',
    genre: 'Lo-Fi',
    duration: '03:15',
    driveId: '1RainyNightSiliconValleyCozyLofi',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c976d9bf5b.mp3?filename=cozy-lofi-song-126297.mp3',
    coverArt: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    lyrics: 'Soft rain ambience mixed with mellow Fender Rhodes jazz chords for late night pair programming.',
    isGoogleDrive: true,
    addedAt: '2024-09-06'
  },
  {
    id: 'track-7',
    title: 'Tokyo Night Expressway (Future Funk & Chill)',
    artist: 'Shibuya Sound Lab',
    album: 'Neon Lights & Microservices',
    genre: 'Synthwave',
    duration: '03:50',
    driveId: '1TokyoNightExpresswayFutureFunk',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_49fe8e6538.mp3?filename=future-bass-15494.mp3',
    coverArt: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    lyrics: 'Groovy basslines, sampled city acoustics, and smooth future funk vibes.',
    isGoogleDrive: true,
    addedAt: '2024-09-07'
  },
  {
    id: 'track-8',
    title: 'Classical Focus Harmony (Mozart for Developers)',
    artist: 'Vienna Chamber Quartet',
    album: 'Algorithmic Symmetry & Polyphony',
    genre: 'Classical',
    duration: '04:30',
    driveId: '1ClassicalFocusHarmonyMozartDev',
    streamUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c36bfbdf8f.mp3?filename=classical-piano-ambient-109038.mp3',
    coverArt: 'https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80',
    lyrics: 'Refined classical string and piano interplay proven to enhance spatial-temporal reasoning and math acumen.',
    isGoogleDrive: true,
    addedAt: '2024-09-08'
  }
];

const INITIAL_PLAYLISTS = [
  {
    id: 'pl-coding-flow',
    name: '🎧 Deep Coding Flow',
    description: 'Zero distractions, steady BPM, and high clarity beats for algorithmic sprints.',
    coverArt: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    trackIds: ['track-1', 'track-2', 'track-5', 'track-7']
  },
  {
    id: 'pl-google-drive-cloud',
    name: '☁️ Google Drive Synced Vault',
    description: 'Custom imported songs fetched directly from personal and academy Google Drive storage.',
    coverArt: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    trackIds: ['track-1', 'track-2', 'track-3', 'track-4', 'track-6']
  },
  {
    id: 'pl-night-study',
    name: '🌙 Late Night Problem Solving',
    description: 'Ambient and acoustic melodies to keep you relaxed during 2 AM debugging sessions.',
    coverArt: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    trackIds: ['track-3', 'track-4', 'track-6', 'track-8']
  }
];

export default function Music() {
  // ── State Storage ──
  const [tracks, setTracks] = useState(() => {
    const saved = localStorage.getItem('appletree_music_tracks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_MUSIC_TRACKS; }
    }
    return DEFAULT_MUSIC_TRACKS;
  });

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('appletree_music_playlists');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_PLAYLISTS; }
    }
    return INITIAL_PLAYLISTS;
  });

  const [favoriteTrackIds, setFavoriteTrackIds] = useState(() => {
    const saved = localStorage.getItem('appletree_favorite_songs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return ['track-1', 'track-2']; }
    }
    return ['track-1', 'track-2'];
  });

  // ── Playback Engine State ──
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFullscreenVisualizer, setIsFullscreenVisualizer] = useState(false);

  // ── Navigation & Views ──
  const [activeView, setActiveView] = useState('all'); // 'all' | 'favorites' | 'playlist' | 'drive'
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // ── Modals State ──
  const [isImportDriveModalOpen, setIsImportDriveModalOpen] = useState(false);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  const [newDriveUrl, setNewDriveUrl] = useState('');
  const [newDriveTitle, setNewDriveTitle] = useState('');
  const [newDriveArtist, setNewDriveArtist] = useState('');
  const [newDriveGenre, setNewDriveGenre] = useState('Lo-Fi');
  const [newDriveCover, setNewDriveCover] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState(null);

  // ── Audio Ref ──
  const audioRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('appletree_music_tracks', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem('appletree_music_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('appletree_favorite_songs', JSON.stringify(favoriteTrackIds));
  }, [favoriteTrackIds]);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Initialize Audio Source
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const streamSrc = currentTrack.driveId ? getDriveStreamUrl(currentTrack.driveId) : currentTrack.streamUrl;
      
      // If src changed, update and reload
      if (audioRef.current.src !== streamSrc && streamSrc) {
        audioRef.current.src = streamSrc;
        audioRef.current.load();
        if (isPlaying) {
          setIsBuffering(true);
          audioRef.current.play()
            .then(() => setIsBuffering(false))
            .catch(err => {
              console.warn('Playback fallback triggered:', err);
              // Fallback to secondary streamUrl if Google Drive rate limits or blocks
              if (currentTrack.streamUrl && audioRef.current.src !== currentTrack.streamUrl) {
                audioRef.current.src = currentTrack.streamUrl;
                audioRef.current.play().catch(() => {});
              }
              setIsBuffering(false);
            });
        }
      }
    }
  }, [currentTrackIndex, currentTrack]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsBuffering(false);
    };
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, tracks, isShuffle]);

  // Volume Controller
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsBuffering(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(e => {
          console.warn('Audio play request interrupted:', e);
          setIsBuffering(false);
        });
    }
  };

  const handlePlayTrack = (track) => {
    const idx = tracks.findIndex(t => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.driveId ? getDriveStreamUrl(track.driveId) : track.streamUrl;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleNextTrack = () => {
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (currentTime > 4) {
      if (audioRef.current) audioRef.current.currentTime = 0;
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const targetVal = parseFloat(e.target.value);
    setCurrentTime(targetVal);
    if (audioRef.current) {
      audioRef.current.currentTime = targetVal;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle Favorite
  const toggleFavorite = (trackId, e) => {
    e?.stopPropagation();
    setFavoriteTrackIds(prev => {
      const isFav = prev.includes(trackId);
      if (!isFav) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
        return [...prev, trackId];
      }
      return prev.filter(id => id !== trackId);
    });
  };

  // Add Track to Playlist
  const handleAddTrackToPlaylist = (playlistId, trackId) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.trackIds.includes(trackId)) {
          return { ...pl, trackIds: [...pl.trackIds, trackId] };
        }
      }
      return pl;
    }));
    confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 } });
  };

  // Remove Track from Playlist
  const handleRemoveTrackFromPlaylist = (playlistId, trackId, e) => {
    e?.stopPropagation();
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        return { ...pl, trackIds: pl.trackIds.filter(id => id !== trackId) };
      }
      return pl;
    }));
  };

  // Create Playlist
  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPl = {
      id: `pl-${Date.now()}`,
      name: newPlaylistName.trim(),
      description: newPlaylistDesc.trim() || 'Custom user created playlist.',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      trackIds: []
    };

    setPlaylists(prev => [...prev, newPl]);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setIsCreatePlaylistModalOpen(false);
    setSelectedPlaylistId(newPl.id);
    setActiveView('playlist');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Delete Playlist
  const handleDeletePlaylist = (playlistId, e) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(prev => prev.filter(pl => pl.id !== playlistId));
      if (selectedPlaylistId === playlistId) {
        setActiveView('all');
        setSelectedPlaylistId(null);
      }
    }
  };

  // Import Google Drive Track Handler
  const handleImportGoogleDriveTrack = (e) => {
    e.preventDefault();
    if (!newDriveUrl.trim() || !newDriveTitle.trim()) {
      setImportStatusMsg({ type: 'error', text: 'Please enter a valid Google Drive URL / ID and Song Title.' });
      return;
    }

    const driveDirectStream = getDriveStreamUrl(newDriveUrl.trim());
    const newTrack = {
      id: `drive-track-${Date.now()}`,
      title: newDriveTitle.trim(),
      artist: newDriveArtist.trim() || 'Google Drive Audio',
      album: 'Imported Cloud Drive Library',
      genre: newDriveGenre || 'Lo-Fi',
      duration: '03:30',
      driveId: newDriveUrl.trim(),
      streamUrl: driveDirectStream,
      coverArt: newDriveCover.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      lyrics: 'Imported from verified Google Drive stream.',
      isGoogleDrive: true,
      addedAt: new Date().toISOString().split('T')[0]
    };

    setTracks(prev => [newTrack, ...prev]);
    setImportStatusMsg({ type: 'success', text: `✅ Successfully imported "${newTrack.title}" from Google Drive!` });
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    // Auto Play Imported Song
    setTimeout(() => {
      handlePlayTrack(newTrack);
      setIsImportDriveModalOpen(false);
      setNewDriveUrl('');
      setNewDriveTitle('');
      setNewDriveArtist('');
      setNewDriveCover('');
      setImportStatusMsg(null);
    }, 1200);
  };

  // Filtered Tracks Pipeline
  const filteredTracks = useMemo(() => {
    let list = tracks;

    if (activeView === 'favorites') {
      list = tracks.filter(t => favoriteTrackIds.includes(t.id));
    } else if (activeView === 'drive') {
      list = tracks.filter(t => t.isGoogleDrive || t.driveId);
    } else if (activeView === 'playlist' && selectedPlaylistId) {
      const targetPl = playlists.find(p => p.id === selectedPlaylistId);
      if (targetPl) {
        list = tracks.filter(t => targetPl.trackIds.includes(t.id));
      }
    }

    if (selectedGenre !== 'All') {
      list = list.filter(t => t.genre.toLowerCase() === selectedGenre.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q) ||
        (t.driveId && t.driveId.toLowerCase().includes(q))
      );
    }

    return list;
  }, [tracks, activeView, selectedPlaylistId, selectedGenre, searchQuery, favoriteTrackIds, playlists]);

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-100 font-sans pb-32 select-none relative overflow-x-hidden">
      
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* ── 1. TOP HEADER & SEARCH BAR ── */}
      <header className="sticky top-0 z-40 bg-[#12141a]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-black">
            <Headphones className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold font-quicksand text-base sm:text-lg text-white flex items-center gap-2">
              <span>AppleTree Music Studio</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                Google Drive Sync
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Full Music System • Lo-Fi Beats, Coding Soundscapes & Cloud Playlists
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by song, artist, genre, or Google Drive ID..."
              className="w-full pl-10 pr-9 py-2 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/15 focus:border-amber-400 rounded-2xl text-xs text-white placeholder:text-slate-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Import Drive Song Button */}
          <button
            onClick={() => setIsImportDriveModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-600/20 cursor-pointer transition-all"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">+ Import Drive Song</span>
            <span className="sm:hidden">+ Drive</span>
          </button>
        </div>
      </header>

      {/* ── 2. MAIN LAYOUT: SIDEBAR + CONTENT HUB ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Main Navigation Hub */}
          <div className="bg-[#161922] p-4 rounded-3xl border border-white/10 shadow-xl space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-1">
              Library & Discover
            </span>

            <button
              onClick={() => { setActiveView('all'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'all' 
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Songs</span>
              <span className="ml-auto text-[10px] opacity-75">{tracks.length}</span>
            </button>

            <button
              onClick={() => { setActiveView('favorites'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'favorites' 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${activeView === 'favorites' ? 'fill-white' : 'text-rose-400'}`} />
              <span>Favourite & Liked Songs</span>
              <span className="ml-auto text-[10px] opacity-75">{favoriteTrackIds.length}</span>
            </button>

            <button
              onClick={() => { setActiveView('drive'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'drive' 
                  ? 'bg-blue-600 text-white shadow-md font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4 text-blue-400" />
              <span>Google Drive Songs</span>
              <span className="ml-auto text-[10px] opacity-75">
                {tracks.filter(t => t.isGoogleDrive || t.driveId).length}
              </span>
            </button>
          </div>

          {/* User Playlists Hub */}
          <div className="bg-[#161922] p-4 rounded-3xl border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Playlists ({playlists.length})
              </span>
              <button
                onClick={() => setIsCreatePlaylistModalOpen(true)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-amber-300 transition-colors cursor-pointer"
                title="Create New Playlist"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {playlists.map((pl) => {
                const isSelected = activeView === 'playlist' && selectedPlaylistId === pl.id;
                return (
                  <div
                    key={pl.id}
                    onClick={() => {
                      setSelectedPlaylistId(pl.id);
                      setActiveView('playlist');
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group ${
                      isSelected 
                        ? 'bg-white/15 text-amber-300 border border-amber-400/40 shadow-sm' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img src={pl.coverArt} alt={pl.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                      <div className="truncate">
                        <span className="block truncate text-xs">{pl.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{pl.trackIds.length} tracks</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeletePlaylist(pl.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity cursor-pointer"
                      title="Delete Playlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equalizer Frequency Box */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-[#12141a] border border-white/10 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Audio Equalizer</span>
            </div>
            {/* Visual Equalizer Bars */}
            <div className="flex items-end justify-center gap-1.5 h-12 pt-2">
              {[40, 75, 95, 60, 85, 50, 90, 70, 45, 80, 65, 95, 30].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full bg-gradient-to-t from-amber-500 to-rose-500 transition-all ${
                    isPlaying ? 'animate-pulse' : 'opacity-40'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (volume / 100)) % 100)}%` : '20%',
                    animationDuration: `${0.4 + (i % 4) * 0.2}s`
                  }}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-400">
              {isPlaying ? `Streaming: ${currentTrack?.title}` : 'Audio Engine Idle'}
            </p>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* ── 3. HERO SPOTLIGHT BANNER ── */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-900 p-6 sm:p-8 text-white shadow-2xl border border-white/10">
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <img
                src={currentTrack?.coverArt || DEFAULT_MUSIC_TRACKS[0].coverArt}
                alt="Album Cover"
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover shadow-2xl border-2 border-white/20 shrink-0 transform hover:scale-105 transition-transform"
              />

              <div className="space-y-3 text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
                    {currentTrack?.genre || 'Lo-Fi Focus'}
                  </span>
                  {currentTrack?.isGoogleDrive && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-[10px] font-bold flex items-center gap-1">
                      <Cloud className="w-3 h-3" />
                      <span>Google Drive Stream</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-quicksand text-white tracking-tight leading-tight">
                  {currentTrack?.title}
                </h2>
                <p className="text-sm text-slate-200 font-medium">
                  {currentTrack?.artist} • <span className="opacity-75">{currentTrack?.album}</span>
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <button
                    onClick={() => handlePlayTrack(currentTrack)}
                    className="px-6 py-3 rounded-2xl bg-white text-slate-950 font-black text-xs hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                    <span>{isPlaying ? 'Pause Now' : 'Play Spotlight'}</span>
                  </button>

                  <button
                    onClick={(e) => toggleFavorite(currentTrack.id, e)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      favoriteTrackIds.includes(currentTrack.id)
                        ? 'bg-rose-500 border-rose-400 text-white'
                        : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favoriteTrackIds.includes(currentTrack.id) ? 'fill-white' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsFullscreenVisualizer(true)}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
                    title="Fullscreen Visualizer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. GENRE FILTERS ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
            {['All', 'Lo-Fi', 'Synthwave', 'Ambient', 'Acoustic', 'Electronic', 'Classical'].map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-2xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-[#161922] hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* ── 5. ACTIVE VIEW TITLE & ACTIONS ── */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-lg font-black font-quicksand text-white flex items-center gap-2">
                {activeView === 'all' && <span>🎵 All Tracks Explorer</span>}
                {activeView === 'favorites' && <span>💖 Your Liked Songs & Favorites</span>}
                {activeView === 'drive' && <span>☁️ Google Drive Music Vault</span>}
                {activeView === 'playlist' && <span>📜 Playlist: {selectedPlaylist?.name}</span>}
                <span className="text-xs font-normal text-slate-400">({filteredTracks.length} songs)</span>
              </h3>
              {activeView === 'playlist' && selectedPlaylist?.description && (
                <p className="text-xs text-slate-400 mt-0.5">{selectedPlaylist.description}</p>
              )}
            </div>

            {/* Play All Button */}
            {filteredTracks.length > 0 && (
              <button
                onClick={() => handlePlayTrack(filteredTracks[0])}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-amber-300" />
                <span>Play All</span>
              </button>
            )}
          </div>

          {/* ── 6. SONGS LIST TABLE / CARDS ── */}
          {filteredTracks.length === 0 ? (
            <div className="text-center py-16 bg-[#161922] rounded-3xl border border-white/10 p-6 space-y-3">
              <Disc className="w-12 h-12 text-slate-500 mx-auto animate-spin" />
              <h4 className="text-sm font-bold text-white">No songs found in this view</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try clearing search terms or import custom MP3 audio files directly from Google Drive!
              </p>
              <button
                onClick={() => setIsImportDriveModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Cloud className="w-4 h-4" />
                <span>Import Google Drive Audio</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTracks.map((track, idx) => {
                const isCurrentPlaying = currentTrack?.id === track.id;
                const isLiked = favoriteTrackIds.includes(track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayTrack(track)}
                    className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl transition-all cursor-pointer group border ${
                      isCurrentPlaying
                        ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 shadow-md'
                        : 'bg-[#161922] hover:bg-white/5 border-white/5 text-slate-300'
                    }`}
                  >
                    {/* Index & Play Indicator */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-7 text-center text-xs font-mono font-bold text-slate-500 group-hover:hidden">
                        {isCurrentPlaying && isPlaying ? (
                          <div className="flex items-end justify-center gap-0.5 h-4">
                            <span className="w-1 h-3 bg-amber-400 animate-bounce" />
                            <span className="w-1 h-4 bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1 h-2 bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                          </div>
                        ) : (
                          idx + 1
                        )}
                      </div>

                      {/* Play Button on Hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrentPlaying) togglePlay();
                          else handlePlayTrack(track);
                        }}
                        className="w-7 h-7 rounded-lg bg-amber-400 text-black hidden group-hover:flex items-center justify-center shadow cursor-pointer"
                      >
                        {isCurrentPlaying && isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
                      </button>

                      {/* Thumbnail Cover */}
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="w-11 h-11 rounded-xl object-cover shadow-sm shrink-0 border border-white/10"
                      />

                      {/* Title & Artist */}
                      <div className="truncate min-w-0 pr-2">
                        <h4 className={`text-xs font-bold truncate ${isCurrentPlaying ? 'text-amber-300 font-black' : 'text-white'}`}>
                          {track.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {track.artist} • <span className="opacity-75">{track.album}</span>
                        </p>
                      </div>
                    </div>

                    {/* Genre & Google Drive Tag */}
                    <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px]">
                        {track.genre}
                      </span>
                      {track.isGoogleDrive && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px] font-bold flex items-center gap-1">
                          <Cloud className="w-2.5 h-2.5" />
                          <span>Drive</span>
                        </span>
                      )}
                    </div>

                    {/* Actions: Add to Playlist, Like, Duration */}
                    <div className="flex items-center gap-2.5 shrink-0 text-xs">
                      {/* Add to Playlist Selector */}
                      <div className="relative group/pl">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Add to Playlist"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        {/* Playlist Dropdown */}
                        <div className="absolute right-0 top-full mt-1 hidden group-hover/pl:block w-44 p-1.5 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl z-30">
                          <span className="text-[9px] font-black uppercase text-slate-400 px-2 py-1 block border-b border-white/10">
                            Add to Playlist:
                          </span>
                          {playlists.map(pl => (
                            <button
                              key={pl.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddTrackToPlaylist(pl.id, track.id);
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-xl text-[11px] hover:bg-white/10 text-slate-200 flex items-center justify-between cursor-pointer"
                            >
                              <span className="truncate">{pl.name}</span>
                              {pl.trackIds.includes(track.id) && <Check className="w-3 h-3 text-emerald-400" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(track.id, e)}
                        className={`p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${
                          isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                        }`}
                        title={isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                      </button>

                      {/* Duration */}
                      <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                        {track.duration}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </main>

      </div>

      {/* ── 7. PERSISTENT BOTTOM FLOATING MUSIC CONTROLLER ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#12141a]/95 backdrop-blur-2xl border-t border-white/15 px-4 sm:px-8 py-3 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Track Info (Left) */}
          <div className="flex items-center gap-3 w-full md:w-1/4">
            <img
              src={currentTrack?.coverArt}
              alt="Track Thumbnail"
              className="w-12 h-12 rounded-xl object-cover shadow border border-white/15 shrink-0"
            />
            <div className="truncate min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                {currentTrack?.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                {currentTrack?.artist}
              </p>
            </div>
            <button
              onClick={(e) => toggleFavorite(currentTrack?.id, e)}
              className={`p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${
                favoriteTrackIds.includes(currentTrack?.id) ? 'text-rose-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoriteTrackIds.includes(currentTrack?.id) ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Center Playback Controls & Progress Bar */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
            <div className="flex items-center gap-4">
              {/* Shuffle */}
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isShuffle ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Shuffle Mode"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              {/* Prev */}
              <button
                onClick={handlePrevTrack}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              {/* Play / Pause Primary */}
              <button
                onClick={togglePlay}
                disabled={isBuffering}
                className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer disabled:opacity-75"
              >
                {isBuffering ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 fill-black" />
                ) : (
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={handleNextTrack}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              {/* Repeat Mode */}
              <button
                onClick={() => {
                  if (repeatMode === 'off') setRepeatMode('all');
                  else if (repeatMode === 'all') setRepeatMode('one');
                  else setRepeatMode('off');
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  repeatMode !== 'off' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Scrubber Progress Slider */}
            <div className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="w-8 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
              <span className="w-8">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Volume & Visualizer Toggles */}
          <div className="flex items-center justify-end gap-3 w-full md:w-1/4">
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : volume < 50 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Fullscreen Visualizer Modal Button */}
            <button
              onClick={() => setIsFullscreenVisualizer(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Expand Visualizer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* ── 8. GOOGLE DRIVE MUSIC IMPORTER MODAL ── */}
      {isImportDriveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161922] w-full max-w-lg rounded-3xl border border-white/15 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white">
                <Cloud className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black font-quicksand">Import Music from Google Drive</h3>
              </div>
              <button
                onClick={() => setIsImportDriveModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportGoogleDriveTrack} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Google Drive Shareable Link / File ID: *
                </label>
                <input
                  type="text"
                  value={newDriveUrl}
                  onChange={(e) => setNewDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                  required
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  💡 Tip: Make sure the file sharing in Google Drive is set to <strong>"Anyone with the link can view"</strong>.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Song Title: *</label>
                  <input
                    type="text"
                    value={newDriveTitle}
                    onChange={(e) => setNewDriveTitle(e.target.value)}
                    placeholder="e.g. Algorithmic Symphony"
                    required
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Artist / Producer:</label>
                  <input
                    type="text"
                    value={newDriveArtist}
                    onChange={(e) => setNewDriveArtist(e.target.value)}
                    placeholder="e.g. DevLoFi & Code"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Genre Category:</label>
                  <select
                    value={newDriveGenre}
                    onChange={(e) => setNewDriveGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 rounded-2xl text-xs text-white focus:border-amber-400 outline-none"
                  >
                    <option value="Lo-Fi">Lo-Fi Coding Chill</option>
                    <option value="Synthwave">Synthwave Cyberpunk</option>
                    <option value="Ambient">Deep Space Ambient</option>
                    <option value="Acoustic">Acoustic Piano</option>
                    <option value="Electronic">Electronic Pulse</option>
                    <option value="Classical">Classical Harmony</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cover Art URL (Optional):</label>
                  <input
                    type="url"
                    value={newDriveCover}
                    onChange={(e) => setNewDriveCover(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {importStatusMsg && (
                <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  importStatusMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {importStatusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{importStatusMsg.text}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportDriveModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                >
                  + Add & Stream from Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 9. CREATE PLAYLIST MODAL ── */}
      {isCreatePlaylistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161922] w-full max-w-md rounded-3xl border border-white/15 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white">
                <FolderPlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black font-quicksand">Create New Playlist</h3>
              </div>
              <button
                onClick={() => setIsCreatePlaylistModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Playlist Name: *</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g. 1000 DSA Speedrun Beats"
                  required
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description:</label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  rows={3}
                  placeholder="Write a short summary for your playlist..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePlaylistModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg cursor-pointer transition-all"
                >
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 10. FULLSCREEN VISUALIZER MODAL ── */}
      {isFullscreenVisualizer && (
        <div className="fixed inset-0 z-50 bg-[#0a0c10] flex flex-col items-center justify-between p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="w-full flex items-center justify-between max-w-4xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                Immersive Coding Visualizer
              </span>
            </div>
            <button
              onClick={() => setIsFullscreenVisualizer(false)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Center Graphic */}
          <div className="text-center space-y-6 max-w-md my-auto">
            <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 blur-2xl opacity-60 ${
                isPlaying ? 'animate-pulse' : 'opacity-20'
              }`} />
              <img
                src={currentTrack?.coverArt}
                alt={currentTrack?.title}
                className={`relative w-full h-full rounded-3xl object-cover shadow-2xl border-4 border-white/20 ${
                  isPlaying ? 'rotate-1' : ''
                }`}
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black font-quicksand text-white">
                {currentTrack?.title}
              </h2>
              <p className="text-sm text-slate-300">
                {currentTrack?.artist} • {currentTrack?.album}
              </p>
              {currentTrack?.lyrics && (
                <p className="text-xs text-amber-300/80 italic pt-2">
                  "{currentTrack.lyrics}"
                </p>
              )}
            </div>

            {/* Fullscreen Waveform Equalizer */}
            <div className="flex items-end justify-center gap-2 h-16 pt-4">
              {[30, 60, 90, 45, 80, 100, 65, 85, 40, 75, 95, 50, 70, 90, 35].map((val, idx) => (
                <div
                  key={idx}
                  className="w-2 rounded-full bg-gradient-to-t from-amber-400 via-rose-500 to-indigo-400 transition-all"
                  style={{
                    height: isPlaying ? `${Math.max(20, (val * (volume / 100)) % 100)}%` : '15%',
                    animation: isPlaying ? 'bounce 0.6s infinite alternate' : 'none',
                    animationDelay: `${idx * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Footer Controls in Fullscreen */}
          <div className="w-full max-w-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex items-center justify-center gap-6 pt-2">
              <button onClick={handlePrevTrack} className="text-white hover:text-amber-300 p-2 cursor-pointer">
                <SkipBack className="w-6 h-6 fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
              </button>
              <button onClick={handleNextTrack} className="text-white hover:text-amber-300 p-2 cursor-pointer">
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
