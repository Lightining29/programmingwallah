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
  AlertCircle,
  Flame,
  Coffee,
  CloudRain,
  Wind,
  Zap,
  Moon,
  Timer,
  Activity,
  SlidersHorizontal,
  Keyboard,
  Waves,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────────────────
// 1. GOOGLE DRIVE AUDIO STREAMING HELPER
// ─────────────────────────────────────────────────────────────────────────────
export const getDriveStreamUrl = (driveIdOrUrl) => {
  if (!driveIdOrUrl) return '';
  if (driveIdOrUrl.startsWith('http') && !driveIdOrUrl.includes('drive.google.com')) {
    return driveIdOrUrl;
  }
  let fileId = driveIdOrUrl;
  const match = driveIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveIdOrUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    fileId = match[1];
  }
  return `https://docs.google.com/uc?export=download&id=${fileId}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. CURATED TRACK REPOSITORY WITH RICH METADATA & SOUNDSCAPES
// ─────────────────────────────────────────────────────────────────────────────
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
    plays: '142.8K',
    vibe: '🌙 Deep Night',
    bpm: '82 BPM',
    colorTheme: 'from-amber-500/20 via-orange-500/10 to-purple-900/30',
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
    plays: '210.4K',
    vibe: '⚡ High Energy',
    bpm: '128 BPM',
    colorTheme: 'from-pink-500/20 via-cyan-500/10 to-indigo-900/30',
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
    plays: '98.2K',
    vibe: '☕ Morning Calm',
    bpm: '75 BPM',
    colorTheme: 'from-emerald-500/20 via-teal-500/10 to-amber-900/30',
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
    plays: '315.6K',
    vibe: '🌌 Infinite Focus',
    bpm: '60 BPM',
    colorTheme: 'from-blue-500/20 via-indigo-500/10 to-slate-900/40',
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
    plays: '185.1K',
    vibe: '🚀 Sprint Boost',
    bpm: '135 BPM',
    colorTheme: 'from-violet-500/20 via-fuchsia-500/10 to-black/40',
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
    plays: '264.9K',
    vibe: '🌧️ Cozy Rainy',
    bpm: '78 BPM',
    colorTheme: 'from-cyan-500/20 via-sky-500/10 to-indigo-950/40',
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
    plays: '112.5K',
    vibe: '🌆 City Drive',
    bpm: '110 BPM',
    colorTheme: 'from-rose-500/20 via-purple-500/10 to-slate-900/40',
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
    plays: '177.3K',
    vibe: '🎻 Mind Expansion',
    bpm: '70 BPM',
    colorTheme: 'from-amber-400/20 via-yellow-600/10 to-stone-900/40',
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

// Ambient Background Layer Soundtracks
const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Gentle Rain', icon: CloudRain, url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6595bf6a.mp3?filename=rain-and-thunder-nature-sounds-7803.mp3' },
  { id: 'cafe', name: 'Dev Cafe', icon: Coffee, url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_10793666dc.mp3?filename=coffee-shop-ambience-7798.mp3' },
  { id: 'fire', name: 'Campfire', icon: Flame, url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_5145b5c9b7.mp3?filename=bonfire-crackling-109040.mp3' }
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
      try { return JSON.parse(saved); } catch (e) { return ['track-1', 'track-2', 'track-6']; }
    }
    return ['track-1', 'track-2', 'track-6'];
  });

  // ── Playback Engine State ──
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [isBuffering, setIsBuffering] = useState(false);
  const [isFullscreenVisualizer, setIsFullscreenVisualizer] = useState(false);
  const [audioPreset, setAudioPreset] = useState('Lo-Fi Warmth');

  // ── Navigation & Active View Tabs ──
  const [activeView, setActiveView] = useState('all'); // 'all' | 'favorites' | 'playlist' | 'drive' | 'ambience'
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // ── Ambience Layer Mixer State ──
  const [ambientVolumes, setAmbientVolumes] = useState({ rain: 0, cafe: 0, fire: 0 });
  const ambientAudioRefs = useRef({});

  // ── Sleep / Pomodoro Timer State ──
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState(null);

  // ── Modals State ──
  const [isImportDriveModalOpen, setIsImportDriveModalOpen] = useState(false);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);
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

  // Initialize and Sync Main Audio
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const streamSrc = currentTrack.driveId ? getDriveStreamUrl(currentTrack.driveId) : currentTrack.streamUrl;
      
      if (audioRef.current.src !== streamSrc && streamSrc) {
        audioRef.current.src = streamSrc;
        audioRef.current.load();
        if (isPlaying) {
          setIsBuffering(true);
          audioRef.current.play()
            .then(() => setIsBuffering(false))
            .catch(err => {
              console.warn('Fallback stream activated:', err);
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

  // Ambience Layer Volumes
  useEffect(() => {
    AMBIENT_SOUNDS.forEach(snd => {
      const el = ambientAudioRefs.current[snd.id];
      if (el) {
        const vol = (ambientVolumes[snd.id] || 0) / 100;
        el.volume = vol;
        if (vol > 0 && el.paused) {
          el.play().catch(() => {});
        } else if (vol === 0 && !el.paused) {
          el.pause();
        }
      }
    });
  }, [ambientVolumes]);

  // Sleep / Pomodoro Timer Countdown
  useEffect(() => {
    if (!sleepTimerSecondsLeft) return;
    const interval = setInterval(() => {
      setSleepTimerSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerSecondsLeft]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        setIsMuted(prev => !prev);
      } else if (e.code === 'KeyL') {
        if (currentTrack) toggleFavorite(currentTrack.id);
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        handleNextTrack();
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        handlePrevTrack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTrack]);

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
          console.warn('Audio play interrupt:', e);
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
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
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
      plays: '1',
      vibe: '☁️ Cloud Synced',
      bpm: '90 BPM',
      colorTheme: 'from-blue-500/20 via-indigo-500/10 to-slate-900/30',
      addedAt: new Date().toISOString().split('T')[0]
    };

    setTracks(prev => [newTrack, ...prev]);
    setImportStatusMsg({ type: 'success', text: `✅ Successfully imported "${newTrack.title}" from Google Drive!` });
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

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

  // Set Sleep Timer
  const handleSetSleepTimer = (mins) => {
    if (sleepTimerMinutes === mins) {
      setSleepTimerMinutes(null);
      setSleepTimerSecondsLeft(null);
    } else {
      setSleepTimerMinutes(mins);
      setSleepTimerSecondsLeft(mins * 60);
      confetti({ particleCount: 20, spread: 35, origin: { y: 0.5 } });
    }
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
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-36 select-none relative overflow-x-hidden">
      
      {/* Dynamic Animated Ambient Aurora Background */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-all duration-1000 bg-gradient-to-tr ${currentTrack?.colorTheme || 'from-indigo-900/20 via-purple-900/10 to-black'} blur-3xl opacity-70`}
      />
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-600/10 blur-[140px] pointer-events-none animate-pulse [animation-delay:2s]" />

      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Hidden Ambience Audio Elements */}
      {AMBIENT_SOUNDS.map(snd => (
        <audio
          key={snd.id}
          ref={el => ambientAudioRefs.current[snd.id] = el}
          src={snd.url}
          loop
          preload="none"
        />
      ))}

      {/* ── 1. MODERN TOP GLASS HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/85 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        
        {/* Brand & Live Sound Badge */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/25 text-white font-black transform group-hover:scale-105 transition-all">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0d1017] rounded-full animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold font-quicksand text-base sm:text-lg text-white tracking-tight">
                AppleTree Music Studio
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Cloud className="w-2.5 h-2.5" />
                <span>Google Drive Stream</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-2">
              <span>Next-Gen Audio Experience</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-amber-400/90 font-mono">Hi-Fi 320kbps</span>
            </p>
          </div>
        </div>

        {/* Center Real-Time Search Bar */}
        <div className="flex items-center gap-2.5 flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by track name, artist, genre, vibe or Drive ID..."
              className="w-full pl-10 pr-9 py-2.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/15 focus:border-amber-400/80 rounded-2xl text-xs text-white placeholder:text-slate-400 outline-none transition-all shadow-inner backdrop-blur-md"
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

          {/* Quick Import Google Drive Song Button */}
          <button
            onClick={() => setIsImportDriveModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
            <span className="hidden sm:inline">+ Import Drive Audio</span>
            <span className="sm:hidden">+ Drive</span>
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => setIsKeyboardHelpOpen(true)}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-amber-300 border border-white/10 transition-colors cursor-pointer hidden md:flex items-center justify-center"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* ── 2. MAIN BENTO GRID LAYOUT: SIDEBAR + INTERACTIVE STUDIO ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* ── LEFT SIDEBAR NAVIGATION & AMBIENCE MIXER ── */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Main Discover Hub */}
          <div className="bg-[#10141d]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-1">
              Studio Navigation
            </span>

            <button
              onClick={() => { setActiveView('all'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'all' 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-lg font-black' 
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
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${activeView === 'favorites' ? 'fill-white' : 'text-rose-400'}`} />
              <span>Favourites & Liked</span>
              <span className="ml-auto text-[10px] opacity-75">{favoriteTrackIds.length}</span>
            </button>

            <button
              onClick={() => { setActiveView('drive'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'drive' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4 text-blue-300" />
              <span>Google Drive Songs</span>
              <span className="ml-auto text-[10px] opacity-75">
                {tracks.filter(t => t.isGoogleDrive || t.driveId).length}
              </span>
            </button>

            <button
              onClick={() => { setActiveView('ambience'); setSelectedPlaylistId(null); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'ambience' 
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-lg font-black' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Waves className="w-4 h-4 text-teal-400" />
              <span>Soundscape Mixer</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-mono">
                FX
              </span>
            </button>
          </div>

          {/* User Playlists Hub */}
          <div className="bg-[#10141d]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5 text-amber-400" />
                <span>Playlists ({playlists.length})</span>
              </span>
              <button
                onClick={() => setIsCreatePlaylistModalOpen(true)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-amber-300 transition-colors cursor-pointer"
                title="Create New Playlist"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-none">
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
                      <img src={pl.coverArt} alt={pl.name} className="w-8 h-8 rounded-xl object-cover shrink-0 border border-white/10" />
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

          {/* Pomodoro & Sleep Timer for Developers */}
          <div className="bg-[#10141d]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-rose-400" />
                <span>Study / Sleep Timer</span>
              </span>
              {sleepTimerSecondsLeft && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold animate-pulse">
                  {formatTime(sleepTimerSecondsLeft)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-bold">
              {[15, 25, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleSetSleepTimer(mins)}
                  className={`py-2 rounded-xl border transition-all cursor-pointer ${
                    sleepTimerMinutes === mins 
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md font-black' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              {sleepTimerSecondsLeft ? '🎵 Music will automatically pause when timer ends' : 'Select a study sprint or sleep timer'}
            </p>
          </div>

          {/* Audio Equalizer & Preset Simulator */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#10141d] to-[#0d1017] border border-white/10 text-center space-y-3 shadow-2xl">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Activity className="w-3.5 h-3.5" />
                <span>EQ Engine ({audioPreset})</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-mono">ACTIVE</span>
            </div>

            {/* Visual Equalizer Reactive Bars */}
            <div className="flex items-end justify-center gap-1.5 h-12 pt-1 bg-black/40 rounded-2xl p-2 border border-white/5">
              {[40, 85, 95, 60, 90, 50, 95, 75, 45, 80, 70, 95, 35, 85, 60].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full bg-gradient-to-t from-amber-400 via-rose-500 to-indigo-500 transition-all ${
                    isPlaying ? 'animate-pulse' : 'opacity-30'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (volume / 100)) % 100)}%` : '20%',
                    animationDuration: `${0.35 + (i % 5) * 0.15}s`
                  }}
                />
              ))}
            </div>

            {/* EQ Presets Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] font-bold">
              {['Lo-Fi Warmth', 'Bass Boost', 'Spatial 3D', 'Vocal Clear'].map(preset => (
                <button
                  key={preset}
                  onClick={() => setAudioPreset(preset)}
                  className={`px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                    audioPreset === preset 
                      ? 'bg-amber-400 text-slate-950 font-black' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* ── 3. HERO SPOTLIGHT BANNER WITH 3D SPINNING VINYL TURNTABLE ── */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171b26] via-[#1a1f2e] to-[#121622] p-6 sm:p-8 text-white shadow-2xl border border-white/15">
            <div className="absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              
              {/* 3D Vinyl Record with Tonearm & Grooves */}
              <div className="relative group shrink-0">
                
                {/* Turntable Vinyl Disc */}
                <div className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#111] border-4 border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all ${
                  isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                }`}>
                  {/* Concentric Vinyl Grooves */}
                  <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-5 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
                  
                  {/* Center Album Art Label */}
                  <img
                    src={currentTrack?.coverArt || DEFAULT_MUSIC_TRACKS[0].coverArt}
                    alt="Album Cover"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-2xl border-2 border-amber-400/60"
                  />
                  {/* Center Spindle Hole */}
                  <div className="absolute w-4 h-4 rounded-full bg-[#0d1017] border border-white/20 shadow-inner" />
                </div>

                {/* Tonearm Stylus Simulation */}
                <div className={`absolute top-0 right-0 w-16 h-28 pointer-events-none transition-transform duration-700 origin-top-right ${
                  isPlaying ? 'rotate-12' : '-rotate-12 opacity-60'
                }`}>
                  <div className="w-1.5 h-20 bg-gradient-to-b from-slate-400 to-amber-300 rounded-full shadow-lg ml-auto mr-4" />
                  <div className="w-4 h-3 bg-amber-400 rounded-sm shadow ml-auto mr-3 -mt-1" />
                </div>
              </div>

              {/* Spotlight Metadata & Actions */}
              <div className="space-y-3.5 text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                    {currentTrack?.vibe || '🎵 NOW PLAYING'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-slate-300 font-mono">
                    {currentTrack?.bpm || '80 BPM'}
                  </span>
                  {currentTrack?.isGoogleDrive && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-[10px] font-bold flex items-center gap-1">
                      <Cloud className="w-3 h-3" />
                      <span>Google Drive Stream</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-4xl font-black font-quicksand text-white tracking-tight leading-tight">
                  {currentTrack?.title}
                </h2>
                
                <p className="text-sm text-slate-300 font-medium">
                  {currentTrack?.artist} • <span className="text-slate-400">{currentTrack?.album}</span>
                </p>

                {currentTrack?.lyrics && (
                  <p className="text-xs text-amber-200/90 italic bg-white/5 border border-white/10 rounded-2xl p-3 max-w-xl backdrop-blur-sm">
                    "{currentTrack.lyrics}"
                  </p>
                )}

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <button
                    onClick={() => handlePlayTrack(currentTrack)}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transform hover:scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                    <span>{isPlaying ? 'Pause Track' : 'Play Spotlight'}</span>
                  </button>

                  <button
                    onClick={(e) => toggleFavorite(currentTrack.id, e)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      favoriteTrackIds.includes(currentTrack.id)
                        ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30'
                        : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                    }`}
                    title="Add to Favorites"
                  >
                    <Heart className={`w-4 h-4 ${favoriteTrackIds.includes(currentTrack.id) ? 'fill-white' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsFullscreenVisualizer(true)}
                    className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
                    title="Fullscreen Visualizer"
                  >
                    <Maximize2 className="w-4 h-4 text-amber-300" />
                    <span>Visualizer</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── 4. MOOD & GENRE FILTER PILLS ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 shrink-0 pr-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Genres:</span>
            </span>
            {['All', 'Lo-Fi', 'Synthwave', 'Ambient', 'Acoustic', 'Electronic', 'Classical'].map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-2xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                    : 'bg-[#10141d] hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* ── 5. SOUNDSCAPE AMBIENCE MIXER VIEW (IF ACTIVE) ── */}
          {activeView === 'ambience' && (
            <div className="p-6 rounded-3xl bg-[#10141d] border border-white/10 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black font-quicksand text-white flex items-center gap-2">
                    <Waves className="w-5 h-5 text-teal-400" />
                    <span>Background Soundscape Mixer</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Blend gentle ambient background sounds underneath your music to maximize coding concentration.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {AMBIENT_SOUNDS.map(snd => {
                  const Icon = snd.icon;
                  const currentVol = ambientVolumes[snd.id] || 0;
                  return (
                    <div key={snd.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-teal-300" />
                          <span className="text-xs font-bold text-white">{snd.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">{currentVol}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={currentVol}
                        onChange={(e) => setAmbientVolumes(prev => ({ ...prev, [snd.id]: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 6. ACTIVE VIEW HEADER & ACTIONS ── */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-lg font-black font-quicksand text-white flex items-center gap-2">
                {activeView === 'all' && <span>🎵 All Tracks Explorer</span>}
                {activeView === 'favorites' && <span>💖 Your Liked Songs & Favorites</span>}
                {activeView === 'drive' && <span>☁️ Google Drive Music Vault</span>}
                {activeView === 'playlist' && <span>📜 Playlist: {selectedPlaylist?.name}</span>}
                {activeView === 'ambience' && <span>🎧 Soundscape Active Library</span>}
                <span className="text-xs font-normal text-slate-400">({filteredTracks.length} tracks)</span>
              </h3>
              {activeView === 'playlist' && selectedPlaylist?.description && (
                <p className="text-xs text-slate-400 mt-0.5">{selectedPlaylist.description}</p>
              )}
            </div>

            {filteredTracks.length > 0 && (
              <button
                onClick={() => handlePlayTrack(filteredTracks[0])}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play All</span>
              </button>
            )}
          </div>

          {/* ── 7. INTERACTIVE TRACK CARDS / ROWS ── */}
          {filteredTracks.length === 0 ? (
            <div className="text-center py-16 bg-[#10141d]/80 rounded-3xl border border-white/10 p-6 space-y-3">
              <Disc className="w-12 h-12 text-slate-500 mx-auto animate-spin" />
              <h4 className="text-sm font-bold text-white">No tracks match your current filters</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for a different keyword or import a brand new song using your Google Drive share link!
              </p>
              <button
                onClick={() => setIsImportDriveModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Cloud className="w-4 h-4" />
                <span>Import Google Drive Audio</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredTracks.map((track, idx) => {
                const isCurrentPlaying = currentTrack?.id === track.id;
                const isLiked = favoriteTrackIds.includes(track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => handlePlayTrack(track)}
                    className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl transition-all cursor-pointer group border ${
                      isCurrentPlaying
                        ? 'bg-amber-400/15 border-amber-400/60 text-amber-300 shadow-xl shadow-amber-500/10'
                        : 'bg-[#10141d]/80 hover:bg-white/10 border-white/5 text-slate-300'
                    }`}
                  >
                    {/* Track Index & Quick Play */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
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

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrentPlaying) togglePlay();
                          else handlePlayTrack(track);
                        }}
                        className="w-7 h-7 rounded-xl bg-amber-400 text-black hidden group-hover:flex items-center justify-center shadow cursor-pointer"
                      >
                        {isCurrentPlaying && isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
                      </button>

                      {/* Thumbnail Cover */}
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="w-12 h-12 rounded-2xl object-cover shadow-md shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                      />

                      {/* Title & Artist */}
                      <div className="truncate min-w-0 pr-2">
                        <h4 className={`text-xs font-bold truncate ${isCurrentPlaying ? 'text-amber-300 font-black' : 'text-white'}`}>
                          {track.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                          <span>{track.artist}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-600" />
                          <span className="opacity-75">{track.album}</span>
                        </p>
                      </div>
                    </div>

                    {/* Vibe & Google Drive Cloud Tag */}
                    <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400">
                      {track.vibe && (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">
                          {track.vibe}
                        </span>
                      )}
                      {track.isGoogleDrive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[9px] font-bold flex items-center gap-1">
                          <Cloud className="w-2.5 h-2.5" />
                          <span>Drive</span>
                        </span>
                      )}
                    </div>

                    {/* Actions: Add to Playlist, Like, Duration */}
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      
                      {/* Add to Playlist Selector */}
                      <div className="relative group/pl">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Add to Playlist"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        <div className="absolute right-0 top-full mt-1 hidden group-hover/pl:block w-48 p-2 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                          <span className="text-[9px] font-black uppercase text-slate-400 px-2 py-1 block border-b border-white/10 mb-1">
                            Add to Playlist:
                          </span>
                          {playlists.map(pl => (
                            <button
                              key={pl.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddTrackToPlaylist(pl.id, track.id);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] hover:bg-white/10 text-slate-200 flex items-center justify-between cursor-pointer"
                            >
                              <span className="truncate">{pl.name}</span>
                              {pl.trackIds.includes(track.id) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(track.id, e)}
                        className={`p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${
                          isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                        }`}
                        title={isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                      </button>

                      {/* Duration */}
                      <span className="text-[11px] font-mono text-slate-400 w-10 text-right font-medium">
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

      {/* ── 8. PERSISTENT SLEEK BOTTOM PLAYER BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1017]/95 backdrop-blur-2xl border-t border-white/15 px-4 sm:px-8 py-3 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Track Info (Left) - STRICT SIZE TO PREVENT IMAGE OVERFLOW */}
          <div className="flex items-center gap-3 w-full md:w-1/4 shrink-0">
            <div className="relative group shrink-0 w-12 h-12">
              <img
                src={currentTrack?.coverArt}
                alt="Track Thumbnail"
                className="w-12 h-12 max-w-[48px] max-h-[48px] rounded-xl object-cover shadow-lg border border-white/20 shrink-0"
              />
              {isPlaying && (
                <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Activity className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
              )}
            </div>

            <div className="truncate min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                {currentTrack?.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {currentTrack?.artist}
              </p>
            </div>

            <button
              onClick={(e) => toggleFavorite(currentTrack?.id, e)}
              className={`p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0 ${
                favoriteTrackIds.includes(currentTrack?.id) ? 'text-rose-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${favoriteTrackIds.includes(currentTrack?.id) ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Playback Controls & Scrubber Slider (Center) */}
          <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
            <div className="flex items-center gap-4">
              
              {/* Shuffle */}
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isShuffle ? 'text-amber-400 font-bold bg-amber-400/10' : 'text-slate-400 hover:text-white'
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
                className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transition-transform hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-75"
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
                  repeatMode !== 'off' ? 'text-amber-400 font-bold bg-amber-400/10' : 'text-slate-400 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Scrubber Progress Slider */}
            <div className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="w-8 text-right font-medium">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
              <span className="w-8 font-medium">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control & Visualizer Toggle (Right) */}
          <div className="flex items-center justify-end gap-3 w-full md:w-1/4 shrink-0">
            
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
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

            {/* Expand Visualizer Modal */}
            <button
              onClick={() => setIsFullscreenVisualizer(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer hover:scale-105"
              title="Expand Visualizer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* ── 9. GOOGLE DRIVE MUSIC IMPORTER MODAL ── */}
      {isImportDriveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121622] w-full max-w-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-quicksand">Import Music from Google Drive</h3>
                  <p className="text-[11px] text-slate-400">Stream personal MP3s & studio tracks directly</p>
                </div>
              </div>
              <button
                onClick={() => setIsImportDriveModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportGoogleDriveTrack} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Google Drive Shareable Link or File ID: *
                </label>
                <input
                  type="text"
                  value={newDriveUrl}
                  onChange={(e) => setNewDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:border-amber-400 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  💡 Note: Make sure the file access in Google Drive is set to <strong>"Anyone with the link can view"</strong>.
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
                <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  importStatusMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {importStatusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{importStatusMsg.text}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportDriveModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-black shadow-xl shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105"
                >
                  + Add & Stream from Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 10. CREATE PLAYLIST MODAL ── */}
      {isCreatePlaylistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121622] w-full max-w-md rounded-3xl border border-white/20 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
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

            <form onSubmit={handleCreatePlaylist} className="space-y-3.5">
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

      {/* ── 11. KEYBOARD SHORTCUTS MODAL ── */}
      {isKeyboardHelpOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121622] w-full max-w-sm rounded-3xl border border-white/20 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white">
                <Keyboard className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black font-quicksand">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setIsKeyboardHelpOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-300">Play / Pause</span>
                <kbd className="px-2 py-1 rounded-md bg-white/10 text-amber-300 font-mono font-bold">Space</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-300">Mute / Unmute</span>
                <kbd className="px-2 py-1 rounded-md bg-white/10 text-amber-300 font-mono font-bold">M</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-300">Like / Favorite Track</span>
                <kbd className="px-2 py-1 rounded-md bg-white/10 text-rose-300 font-mono font-bold">L</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-300">Next Track</span>
                <kbd className="px-2 py-1 rounded-md bg-white/10 text-amber-300 font-mono font-bold">Shift + →</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="text-slate-300">Previous Track</span>
                <kbd className="px-2 py-1 rounded-md bg-white/10 text-amber-300 font-mono font-bold">Shift + ←</kbd>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsKeyboardHelpOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 12. FULLSCREEN IMMERSIVE VISUALIZER MODAL ── */}
      {isFullscreenVisualizer && (
        <div className="fixed inset-0 z-50 bg-[#06080d] flex flex-col items-center justify-between p-6 sm:p-12 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="w-full flex items-center justify-between max-w-4xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider">
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
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 blur-3xl opacity-60 ${
                isPlaying ? 'animate-pulse' : 'opacity-20'
              }`} />
              <img
                src={currentTrack?.coverArt}
                alt={currentTrack?.title}
                className={`relative w-full h-full rounded-full object-cover shadow-2xl border-4 border-white/20 ${
                  isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black font-quicksand text-white">
                {currentTrack?.title}
              </h2>
              <p className="text-sm text-slate-300">
                {currentTrack?.artist} • {currentTrack?.album}
              </p>
              {currentTrack?.lyrics && (
                <p className="text-xs text-amber-300/90 italic pt-2 max-w-sm mx-auto">
                  "{currentTrack.lyrics}"
                </p>
              )}
            </div>

            {/* Fullscreen Waveform Equalizer */}
            <div className="flex items-end justify-center gap-2 h-16 pt-4">
              {[30, 60, 90, 45, 80, 100, 65, 85, 40, 75, 95, 50, 70, 90, 35].map((val, idx) => (
                <div
                  key={idx}
                  className="w-2.5 rounded-full bg-gradient-to-t from-amber-400 via-rose-500 to-indigo-400 transition-all"
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
