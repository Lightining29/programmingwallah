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
  ChevronLeft,
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
  Eye,
  RefreshCw,
  FolderCheck,
  FileSpreadsheet,
  ArrowUpDown,
  Filter,
  FileText,
  Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────────────────
// 1. GOOGLE DRIVE DIRECT STREAM HELPER (CORS 206 BYTES READY)
// ─────────────────────────────────────────────────────────────────────────────
export const GOOGLE_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/17dieyS9ijEngDyPJZf7hBIyWrBjPrn5j?usp=sharing";
export const GOOGLE_DRIVE_FOLDER_ID = "17dieyS9ijEngDyPJZf7hBIyWrBjPrn5j";

export const getDriveStreamUrl = (driveIdOrUrl) => {
  if (!driveIdOrUrl) return '';
  if (driveIdOrUrl.startsWith('http') && !driveIdOrUrl.includes('drive.google.com') && !driveIdOrUrl.includes('docs.google.com') && !driveIdOrUrl.includes('drive.usercontent.google.com')) {
    return driveIdOrUrl;
  }
  let fileId = driveIdOrUrl;
  const match = driveIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveIdOrUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    fileId = match[1];
  }
  // drive.usercontent.google.com provides direct audio/mpeg 200/206 streaming with CORS *
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;
};

// Cover Art Defaults for Multi-Track Generator
const COVERS = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRE-FETCHED MASTER TRACKS FROM GOOGLE DRIVE FOLDER (17dieyS9ijEngDyPJZf7hBIyWrBjPrn5j)
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_MUSIC_TRACKS = [
  {
    "id": "gdrive-track-1",
    "title": "3 Peg Sharry Mann - Full Video - Mista Baaz - Parmish Verma - Ravi Raj - Latest Punjabi Songs 2016",
    "artist": "Sharry Mann & Mista Baaz",
    "album": "Punjabi Blockbusters",
    "genre": "Punjabi",
    "duration": "03:30",
    "driveId": "1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1b4Ugq6_uM1FanwBwdj-z2b9TiSbAwXFf&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.3 MB",
    "isGoogleDrive": true,
    "plays": "100.0K",
    "vibe": "🔥 Party Beats",
    "bpm": "75 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-2",
    "title": "Abhi Toh Party Shuru Hui Hai - Full Video Song - Khoobsurat - Badshah - Sonam Kapoor - Aastha",
    "artist": "Badshah & Aastha Gill",
    "album": "Khoobsurat",
    "genre": "Party & Hip-Hop",
    "duration": "02:58",
    "driveId": "1xm3dYmhazwvs6twCIbJr6if_jN5F16NH",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1xm3dYmhazwvs6twCIbJr6if_jN5F16NH&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.9 MB",
    "isGoogleDrive": true,
    "plays": "117.0K",
    "vibe": "⚡ High Energy",
    "bpm": "80 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-3",
    "title": "Aigiri Nandini - Divine Durga Stotra - Mahishasura Mardini Bhajan",
    "artist": "Devotional Ensemble",
    "album": "Divine Chants & Peace",
    "genre": "Devotional",
    "duration": "09:20",
    "driveId": "1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1AamZM6nJBHBKG7pCa0hfd8V2py-rjt3x&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 13.9 MB",
    "isGoogleDrive": true,
    "plays": "134.0K",
    "vibe": "🕉️ Spiritual Peace",
    "bpm": "85 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-4",
    "title": "Bhagwan Hai Kahan Re Tu - FULL VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k)",
    "artist": "Sonu Nigam & Shaan",
    "album": "PK (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "04:10",
    "driveId": "1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1uF_Ss3XFWV5uRPhSiR0MGxgphdmeBoKI&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.2 MB",
    "isGoogleDrive": true,
    "plays": "151.0K",
    "vibe": "💖 Soulful Classic",
    "bpm": "90 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-5",
    "title": "Birthday Bash - FULL VIDEO SONG - Yo Yo Honey Singh - Dilliwaali Zaalim Girlfriend - Divyendu Sharma",
    "artist": "Yo Yo Honey Singh",
    "album": "Dilliwaali Zaalim Girlfriend",
    "genre": "Desi Hip-Hop",
    "duration": "03:12",
    "driveId": "1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1Z1CKL5LGq7rGgEm6vNXwZ6Akg86Nar0Q&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.8 MB",
    "isGoogleDrive": true,
    "plays": "168.0K",
    "vibe": "🎉 Dance Party",
    "bpm": "95 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-6",
    "title": "BOSS Title Song - Feat. Meet Bros Anjjan - Akshay Kumar - Honey Singh - Bollywood Movie 2013",
    "artist": "Yo Yo Honey Singh",
    "album": "Dilliwaali Zaalim Girlfriend",
    "genre": "Desi Hip-Hop",
    "duration": "03:12",
    "driveId": "1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1DI9IZJMSgVhICb-k8nNIlI9i1B_exjj2&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.5 MB",
    "isGoogleDrive": true,
    "plays": "185.0K",
    "vibe": "🎉 Dance Party",
    "bpm": "100 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-7",
    "title": "Chittiyaan Kalaiyaan - FULL VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor",
    "artist": "Meet Bros & Kanika Kapoor",
    "album": "Roy (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "03:05",
    "driveId": "1179yW97xoyx_P8t7JMUWYEaclgVCLb5i",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1179yW97xoyx_P8t7JMUWYEaclgVCLb5i&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.9 MB",
    "isGoogleDrive": true,
    "plays": "202.0K",
    "vibe": "✨ Pop Dance",
    "bpm": "105 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-8",
    "title": "Chittiyaan Kalaiyaan - VIDEO SONG - Roy - Meet Bros Anjjan, Kanika Kapoor - (256k)",
    "artist": "Meet Bros & Kanika Kapoor",
    "album": "Roy (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "03:05",
    "driveId": "1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1N_qyMSTrvb0itW3BFyCKbKiNJ_-DZ662&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.1 MB",
    "isGoogleDrive": true,
    "plays": "219.0K",
    "vibe": "✨ Pop Dance",
    "bpm": "110 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-9",
    "title": "De De Gehra Balvir Boparai - Full Song - De De Gera",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1N2Qm3Nmhp7EMljnVzTnB3e_3all714d5&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3 MB",
    "isGoogleDrive": true,
    "plays": "236.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "115 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-10",
    "title": "Dhinka Chika - Full Video Song - Ready Feat. Salman Khan, Asin",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1E2O5wVb1fM9IFBRDoyk0eoHM2SeWkkoD&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.9 MB",
    "isGoogleDrive": true,
    "plays": "253.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "120 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-11",
    "title": "Dil Tu Hi Bataa Krrish 3 - Full Video Song - Hrithik Roshan, Kangana Ranaut - Zubeen Garg",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1yu6xs4HTidplnk0AnHbLO0yrpP6-RMmI&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.5 MB",
    "isGoogleDrive": true,
    "plays": "270.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "125 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-12",
    "title": "Dilli waali Girlfriend - Yeh Jawaani Hai Deewani Video Song - Pritam - Ranbir Kapoor, Deepika Padukone(256k)",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1pMhqAmHqphCFW4T4Sz4LQoTsjUYkugq-&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.4 MB",
    "isGoogleDrive": true,
    "plays": "287.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-13",
    "title": "DJ - Video Song - Hey Bro - Sunidhi Chauhan, Feat. Ali Zafar - Ganesh Acharya",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1MU1MV67NpFI_it_kLnHme8ZLtM8zviFc&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.3 MB",
    "isGoogleDrive": true,
    "plays": "304.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "135 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-14",
    "title": "Ek Main Aur Ekk Tu - Full Song - Imran Khan - Kareena Kapoor",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1NTTHDz2EQYcxJpAx5KXhdAoXgNj5oort&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.6 MB",
    "isGoogleDrive": true,
    "plays": "321.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "75 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-15",
    "title": "Gallan Goodiyaan - Full VIDEO Song - Dil Dhadakne Do",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1aGt3RaL706BjeYA48QHn35DwzJ5Y18O0&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.2 MB",
    "isGoogleDrive": true,
    "plays": "338.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "80 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-16",
    "title": "JALTE DIYE - Full VIDEO song - PREM RATAN DHAN PAYO - Salman Khan, Sonam Kapoor",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1s94Wvj916uEMK0n7A5IHp11p6pBX5hzJ&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 5.2 MB",
    "isGoogleDrive": true,
    "plays": "355.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "85 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-17",
    "title": "Jiyein Kyun Dum Maaro Dum - Full Video Song - HD - Rana Daggubati, Bipasha Basu",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1Ax-Ejlllr-tfkHuQQtgZ6wzaQqZGl4bZ&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.6 MB",
    "isGoogleDrive": true,
    "plays": "372.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-18",
    "title": "Kabhi Jo Badal Barse - Song Video Jackpot - Arijit Singh - Sachiin J Joshi, Sunny Leone",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "13i07t1D2WgAo8w76WCiOiYeNhIx80rNL",
    "streamUrl": "https://drive.usercontent.google.com/download?id=13i07t1D2WgAo8w76WCiOiYeNhIx80rNL&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.2 MB",
    "isGoogleDrive": true,
    "plays": "389.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "95 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-19",
    "title": "Kabira Full Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1R0EuNfuhnmHm20tzzTRd2PgDHpHLxxZK&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.8 MB",
    "isGoogleDrive": true,
    "plays": "406.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "100 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-20",
    "title": "Kashmir Main Tu Kanyakumari - Chennai Express Full Video Song - Shahrukh Khan, Deepika Padukone",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1Z469ss9CLh67S4KNl9XyDRvw6zmXdbes&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.4 MB",
    "isGoogleDrive": true,
    "plays": "423.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "105 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-21",
    "title": "Khuda Bhi - FULL VIDEO Song - Sunny Leone - Mohit Chauhan - Ek Paheli Leela",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1NBgIW-cwTGEaR-B5jLZnsWfsE6hGUZio&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.9 MB",
    "isGoogleDrive": true,
    "plays": "440.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-22",
    "title": "Love is a Waste of Time - FULL VIDEO SONG - PK - Aamir Khan - Anushka Sharma - (256k)",
    "artist": "Sonu Nigam & Shaan",
    "album": "PK (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "04:10",
    "driveId": "1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1bGelRNaqXDEXNovM13ACZxnKV8Z5y7hg&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.9 MB",
    "isGoogleDrive": true,
    "plays": "107.0K",
    "vibe": "💖 Soulful Classic",
    "bpm": "115 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-23",
    "title": "Milne Hai Mujhse Aayi Aashiqui 2 - Full Video Song - Aditya Roy Kapur, Shraddha Kapoor",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1UYmaovc4ACUfOqFB5ZxGqGdwiDzJrQYf&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.4 MB",
    "isGoogleDrive": true,
    "plays": "124.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "120 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-24",
    "title": "Nanga Punga Dost - VIDEO Song - PK - Aamir Khan - Anushka Sharma - (256k)",
    "artist": "Sonu Nigam & Shaan",
    "album": "PK (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "04:10",
    "driveId": "15j3PmVTkP8w2rXCog6A9sndveOYMq1vh",
    "streamUrl": "https://drive.usercontent.google.com/download?id=15j3PmVTkP8w2rXCog6A9sndveOYMq1vh&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 1.7 MB",
    "isGoogleDrive": true,
    "plays": "141.0K",
    "vibe": "💖 Soulful Classic",
    "bpm": "125 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-25",
    "title": "One Bottle Down - Full Song with LYRICS - Yo Yo Honey Singh",
    "artist": "Yo Yo Honey Singh",
    "album": "Dilliwaali Zaalim Girlfriend",
    "genre": "Desi Hip-Hop",
    "duration": "03:12",
    "driveId": "1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1sBmnhrMgyyyO70eOpRN6UpicadaxAAh-&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3 MB",
    "isGoogleDrive": true,
    "plays": "158.0K",
    "vibe": "🎉 Dance Party",
    "bpm": "130 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-26",
    "title": "PREM RATAN DHAN PAYO - Title Song - Full VIDEO - Salman Khan, Sonam Kapoor - Palak Muchhal",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1vorBCRtVXuHjRq269h-p3RxzzvX-ivOT&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4 MB",
    "isGoogleDrive": true,
    "plays": "175.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "135 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-27",
    "title": "Saiyaan Superstar - VIDEO Song - Sunny Leone - Tulsi Kumar - Ek Paheli Leela(256k)",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1WXkEDHWnHVaqMU-pxq1TDRYI8-4KJWfj&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2 MB",
    "isGoogleDrive": true,
    "plays": "192.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "75 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-28",
    "title": "Sawan Aaya Hai - FULL VIDEO Song - Arijit Singh - Bipasha Basu - Imran Abbas Naqvi",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1ttzGRK4OOzup9s8TQXHAvZ6gVl4mxl4w&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3 MB",
    "isGoogleDrive": true,
    "plays": "209.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "80 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-29",
    "title": "Senorita Zindagi Na Milegi Dobara - Full HD Video Song - Farhan Akhtar, Hrithik Roshan, Abhay Deol(256k)",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1w1ghPiNFYKHO-3KApHtvlCzcvPiqXXU3&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.5 MB",
    "isGoogleDrive": true,
    "plays": "226.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "85 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-30",
    "title": "Sooraj Dooba Hain - FULL VIDEO SONG - Arijit singh Aditi Singh Sharma",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1mXTkha4wRDFMfE66FpzEj33ZuRp7hxrc&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.8 MB",
    "isGoogleDrive": true,
    "plays": "243.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "90 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-31",
    "title": "Subhanallah - Full Video Song - Yeh Jawaani Hai Deewani - Pritam - Ranbir Kapoor, Deepika Padukone",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1DvoJv3OhMdJKwoZp_pp6XO1K8DLG7ULs&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.1 MB",
    "isGoogleDrive": true,
    "plays": "260.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "95 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-32",
    "title": "Sun Raha Hai Na Tu Female Version - By Shreya Ghoshal Aashiqui 2 Full Video Song",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1ewVwYLGLQO7cFg_HyFhO01xIjF1l024m&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.5 MB",
    "isGoogleDrive": true,
    "plays": "277.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "100 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-33",
    "title": "Sunny Sunny Yaariyan - Full Video Song - Film Version - Divya Khosla Kumar Himansh Kohli, Rakul Preet",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2",
    "streamUrl": "https://drive.usercontent.google.com/download?id=16oFvi8rI62QGHBLUPV7RwvTZjEPlKjM2&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.2 MB",
    "isGoogleDrive": true,
    "plays": "294.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "105 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-34",
    "title": "Teri Meri Prem Kahani Bodyguard - Video Song - Feat. - Salman khan",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1OzWLLvvb2VZBp8w9sc6mlJqPraPFgooy&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.5 MB",
    "isGoogleDrive": true,
    "plays": "311.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "110 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-35",
    "title": "Tharki Chokro - FULL VIDEO Song - PK - Aamir Khan, Sanjay Dutt - (256k)",
    "artist": "Sonu Nigam & Shaan",
    "album": "PK (Soundtrack)",
    "genre": "Bollywood Hits",
    "duration": "04:10",
    "driveId": "19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2",
    "streamUrl": "https://drive.usercontent.google.com/download?id=19croPuLNBazhqQzFYD-8Ftsqd4iMzcL2&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.7 MB",
    "isGoogleDrive": true,
    "plays": "328.0K",
    "vibe": "💖 Soulful Classic",
    "bpm": "115 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-36",
    "title": "Tu Hai Ki Nahi - FULL VIDEO Song - Roy - Ankit Tiwari - Ranbir Kapoor, Jacqueline Fernandez, Tseries",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1kwyflxsLoWR1pL9nALBLqAWD6OuyKy0G&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.9 MB",
    "isGoogleDrive": true,
    "plays": "345.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "120 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-37",
    "title": "Tu Jo Mila - VIDEO Song - K.K. Pritam - Salman Khan, Nawazuddin, Harshaali - Bajrangi Bhaijaan",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1T_H6Qb8nKV1M612_oBs8VIis_HqzWS1x&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.3 MB",
    "isGoogleDrive": true,
    "plays": "362.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "125 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-38",
    "title": "Tum Hi Ho - Aashiqui 2 Full Song With Lyrics - Aditya Roy Kapur, Shraddha Kapoor",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1D4KErVEXmKvjXzl6S91lMMSBgGkzWe3r&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.1 MB",
    "isGoogleDrive": true,
    "plays": "379.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "130 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-39",
    "title": "Tum Hi Ho Aashiqui 2 - Full Video Song HD - Aditya Roy Kapur, Shraddha Kapoor - Music - Mithoon",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1KRTVYIezHhnGEZFBKCAncvHmyD93YRsk&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.7 MB",
    "isGoogleDrive": true,
    "plays": "396.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "135 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-40",
    "title": "Tumse Hi Tumse - Full Song - Anjaana Anjaani - Feat. Ranbir Kapoor, Priyanka Chopra",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW",
    "streamUrl": "https://drive.usercontent.google.com/download?id=17TV0L7qihSYHSoCk_TvcyfF9VCWhs-IW&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.1 MB",
    "isGoogleDrive": true,
    "plays": "413.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "75 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-41",
    "title": "Zindagi Ki Yahi Reet Hai - Lyrical Video - Mr. India - Kishore Kumar - Javed Akhtar - Anil Kapoor",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1W_DErr3XGZP5FqMCMx6KGe1D64Asa--1&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.7 MB",
    "isGoogleDrive": true,
    "plays": "430.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "80 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-42",
    "title": "Zindagi Kuch Toh Bata - Reprise - Song Pritam - Salman - Kareena - Bajrangi Bhaijaan - Jubin",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1Sj_LAlI7Ll0qB99LLukSPPr45tzfJQ3e&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 1.9 MB",
    "isGoogleDrive": true,
    "plays": "447.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "85 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-43",
    "title": "Zindagi Kuch Toh Bata - Reprise - Full AUDIO Song Pritam - Salman Khan, Kareena K - Bajrangi Bhaijaan",
    "artist": "Palak Muchhal",
    "album": "Prem Ratan Dhan Payo",
    "genre": "Bollywood Romance",
    "duration": "05:19",
    "driveId": "1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1jQ6PnMZ3np2qT_XLdWqp6zVhTmaL75kg&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4 MB",
    "isGoogleDrive": true,
    "plays": "114.0K",
    "vibe": "💖 Classic Melody",
    "bpm": "90 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-44",
    "title": "[LYRIC] Tarin – - Going Home [Han-Rom-Eng] [School 2017 OST Part.3]",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1fxFDZoSQbg8WhwPojrkAVD1sQB-0yEtA&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.2 MB",
    "isGoogleDrive": true,
    "plays": "131.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "95 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-45",
    "title": "【Live】Creepy Nuts - Bling-Bang-Bang-Born Live at 国立代々木競技場 第一体育館",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1XiVURN2kkkIcuvrafJ_bvwAHfB7i3C-n&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.6 MB",
    "isGoogleDrive": true,
    "plays": "148.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "100 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-46",
    "title": "【Live】Creepy Nuts - 合法的トビ方ノススメ",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1UlGDvV9CZ52d1JBEH6rV4pcUMt5IHdOm&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4 MB",
    "isGoogleDrive": true,
    "plays": "165.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "105 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-47",
    "title": "【MV】可愛くてごめん（cover）／高嶺のなでしこ【HoneyWorks】",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "12ehLlrZbpIJGBt_SjjjpRoFnwehryg93",
    "streamUrl": "https://drive.usercontent.google.com/download?id=12ehLlrZbpIJGBt_SjjjpRoFnwehryg93&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 3.3 MB",
    "isGoogleDrive": true,
    "plays": "182.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "110 BPM",
    "colorTheme": "from-emerald-500/20 via-teal-500/10 to-amber-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-48",
    "title": "@TonyKakkar - Tera Suit - Aly Goni - Jasmin Bhasin - Anshul Garg - Holi Song 2021",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1t5ZXFoZTp9SewxDk7dvXtUXmnIRgRL_e&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1520523839898-507121287c8b?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.4 MB",
    "isGoogleDrive": true,
    "plays": "199.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "115 BPM",
    "colorTheme": "from-blue-500/20 via-indigo-500/10 to-slate-900/40",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-49",
    "title": "#honey sing song #free fire(256k)",
    "artist": "Bollywood & Punjabi Hits",
    "album": "Google Drive Master Collection",
    "genre": "Bollywood",
    "duration": "03:45",
    "driveId": "1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1-ALQHd5dW46r2CTzG1X1wZvXZZI6hiov&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 2.8 MB",
    "isGoogleDrive": true,
    "plays": "216.0K",
    "vibe": "🎵 Melodic Flow",
    "bpm": "120 BPM",
    "colorTheme": "from-amber-500/20 via-orange-500/10 to-purple-900/30",
    "addedAt": "2024-09-01"
  },
  {
    "id": "gdrive-track-50",
    "title": "✓ DESI DESI - OFFICIAL VIDEO - Raju Punjabi, MD - KD DESIROCK , Vicky Kajla - New Haryanvi Songs",
    "artist": "Sharry Mann & Mista Baaz",
    "album": "Punjabi Blockbusters",
    "genre": "Punjabi",
    "duration": "03:30",
    "driveId": "1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR",
    "streamUrl": "https://drive.usercontent.google.com/download?id=1NZ_81bK2gj_7_QGpg7ffENydjRrRMOrR&export=download&authuser=0",
    "coverArt": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "lyrics": "Streamed live from Google Drive collection. Size: 4.8 MB",
    "isGoogleDrive": true,
    "plays": "233.0K",
    "vibe": "🔥 Party Beats",
    "bpm": "125 BPM",
    "colorTheme": "from-pink-500/20 via-cyan-500/10 to-indigo-900/30",
    "addedAt": "2024-09-01"
  }
];

const INITIAL_PLAYLISTS = [
  {
    id: 'pl-gdrive-all',
    name: '☁️ Google Drive Master Vault (All Songs)',
    description: 'Complete cloud library fetched automatically from your Google Drive folder.',
    coverArt: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    trackIds: DEFAULT_MUSIC_TRACKS.map(t => t.id)
  },
  {
    id: 'pl-bollywood-top',
    name: '💖 Bollywood & Romance Melodies',
    description: 'Soulful classics, Arijit, Palak Muchhal, and Bollywood blockbusters.',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    trackIds: DEFAULT_MUSIC_TRACKS.filter(t => t.genre?.includes('Bollywood') || t.vibe?.includes('Romance')).slice(0, 20).map(t => t.id)
  },
  {
    id: 'pl-party-punjabi',
    name: '⚡ High-Energy Party & Punjabi Hits',
    description: 'Yo Yo Honey Singh, Badshah, Sharry Mann and high BPM pump songs.',
    coverArt: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    trackIds: DEFAULT_MUSIC_TRACKS.filter(t => t.genre?.includes('Party') || t.genre?.includes('Punjabi') || t.genre?.includes('Hip-Hop')).slice(0, 20).map(t => t.id)
  },
  {
    id: 'pl-spiritual-focus',
    name: '🕉️ Divine Chants & Peaceful Focus',
    description: 'Durga Stotram, peaceful devotional tracks and ambient flow for study.',
    coverArt: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    trackIds: DEFAULT_MUSIC_TRACKS.filter(t => t.genre?.includes('Devotional') || t.vibe?.includes('Peace')).map(t => t.id)
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
    const saved = localStorage.getItem('appletree_music_tracks_v4');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (Array.isArray(parsed) && parsed.length >= 40) return parsed;
      } catch (e) { return DEFAULT_MUSIC_TRACKS; }
    }
    return DEFAULT_MUSIC_TRACKS;
  });

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('appletree_music_playlists_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_PLAYLISTS; }
    }
    return INITIAL_PLAYLISTS;
  });

  const [favoriteTrackIds, setFavoriteTrackIds] = useState(() => {
    const saved = localStorage.getItem('appletree_favorite_songs_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return [DEFAULT_MUSIC_TRACKS[0]?.id, DEFAULT_MUSIC_TRACKS[1]?.id]; }
    }
    return [DEFAULT_MUSIC_TRACKS[0]?.id, DEFAULT_MUSIC_TRACKS[1]?.id];
  });

  // ── Playback Engine State ──
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);
  const [isFullscreenVisualizer, setIsFullscreenVisualizer] = useState(false);
  const [audioPreset, setAudioPreset] = useState('Lo-Fi Warmth');

  // ── Navigation & Active View Tabs ──
  const [activeView, setActiveView] = useState('all'); // 'all' | 'favorites' | 'playlist' | 'drive' | 'ambience'
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  
  // ── Search & Filter State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'title_asc' | 'title_desc' | 'artist' | 'plays'

  // ── Pagination State for 1000+ Songs ──
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);

  // ── Ambience Layer Mixer State ──
  const [ambientVolumes, setAmbientVolumes] = useState({ rain: 0, cafe: 0, fire: 0 });
  const ambientAudioRefs = useRef({});

  // ── Sleep / Pomodoro Timer State ──
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null);
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState(null);

  // ── Modals State ──
  const [isImportDriveModalOpen, setIsImportDriveModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);
  
  // Single Import Form
  const [newDriveUrl, setNewDriveUrl] = useState('');
  const [newDriveTitle, setNewDriveTitle] = useState('');
  const [newDriveArtist, setNewDriveArtist] = useState('');
  const [newDriveGenre, setNewDriveGenre] = useState('Bollywood');
  const [newDriveCover, setNewDriveCover] = useState('');
  
  // Bulk Import Form
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkStatusMsg, setBulkStatusMsg] = useState(null);

  // Playlist Form
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState(null);

  // ── Audio Ref ──
  const audioRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('appletree_music_tracks_v4', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem('appletree_music_playlists_v4', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('appletree_favorite_songs_v4', JSON.stringify(favoriteTrackIds));
  }, [favoriteTrackIds]);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Initialize and Sync Main Audio with direct CORS endpoint
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const streamSrc = getDriveStreamUrl(currentTrack.driveId || currentTrack.streamUrl);
      
      setPlaybackError(null);
      if (audioRef.current.src !== streamSrc && streamSrc) {
        audioRef.current.src = streamSrc;
        audioRef.current.load();
        if (isPlaying) {
          setIsBuffering(true);
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsBuffering(false);
                setIsPlaying(true);
              })
              .catch(err => {
                console.warn('Playback error / waiting user gesture:', err);
                setIsBuffering(false);
              });
          }
        }
      }
    }
  }, [currentTrackIndex, currentTrack]);

  // Reset pagination when search / filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, activeView, selectedPlaylistId, sortBy]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsBuffering(false);
      setPlaybackError(null);
    };
    const handleCanPlay = () => {
      setIsBuffering(false);
      setPlaybackError(null);
    };
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setPlaybackError(null);
    };
    const handleError = (e) => {
      console.warn('Audio tag error event:', e);
      setIsBuffering(false);
      setPlaybackError('Stream buffering... Tap play to retry');
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
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
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
      setIsBuffering(false);
    } else {
      setIsBuffering(true);
      setPlaybackError(null);
      const streamSrc = getDriveStreamUrl(currentTrack.driveId || currentTrack.streamUrl);
      if (audioRef.current.src !== streamSrc) {
        audioRef.current.src = streamSrc;
      }
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch(e => {
            console.warn('Audio play interrupt:', e);
            setIsBuffering(false);
          });
      }
    }
  };

  const handlePlayTrack = (track) => {
    const idx = tracks.findIndex(t => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      setIsPlaying(true);
      setIsBuffering(true);
      setPlaybackError(null);
      if (audioRef.current) {
        const streamSrc = getDriveStreamUrl(track.driveId || track.streamUrl);
        audioRef.current.src = streamSrc;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsBuffering(false))
            .catch(e => {
              console.warn('Play error:', e);
              setIsBuffering(false);
            });
        }
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

  // Reset to Google Drive Folder Default Tracks
  const handleResetToDriveFolder = () => {
    setTracks(DEFAULT_MUSIC_TRACKS);
    localStorage.setItem('appletree_music_tracks_v4', JSON.stringify(DEFAULT_MUSIC_TRACKS));
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
  };

  // Single Google Drive Song Importer
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
      album: 'Google Drive Cloud Vault',
      genre: newDriveGenre || 'Bollywood',
      duration: '03:30',
      driveId: newDriveUrl.trim(),
      streamUrl: driveDirectStream,
      coverArt: newDriveCover.trim() || COVERS[Math.floor(Math.random() * COVERS.length)],
      lyrics: 'Imported from Google Drive collection.',
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

  // Bulk Import for 1000 Songs (Accepts CSV, URLs list, file names or JSON)
  const handleBulkImportSongs = (e) => {
    e.preventDefault();
    if (!bulkInputText.trim()) return;

    try {
      let importedCount = 0;
      let newBatch = [];

      // Check if user pasted JSON array
      if (bulkInputText.trim().startsWith('[') && bulkInputText.trim().endsWith(']')) {
        const parsed = JSON.parse(bulkInputText.trim());
        if (Array.isArray(parsed)) {
          newBatch = parsed.map((item, idx) => ({
            id: item.id || `bulk-drive-${Date.now()}-${idx}`,
            title: item.title || item.name || `Drive Song ${idx + 1}`,
            artist: item.artist || 'Google Drive Artist',
            album: item.album || 'Google Drive 1000 Vault',
            genre: item.genre || 'Bollywood',
            duration: item.duration || '03:45',
            driveId: item.driveId || item.id || '',
            streamUrl: item.streamUrl || getDriveStreamUrl(item.driveId || item.id || item.url),
            coverArt: item.coverArt || COVERS[idx % COVERS.length],
            lyrics: item.lyrics || 'Google Drive Cloud Library Track',
            isGoogleDrive: true,
            plays: '100',
            vibe: '🎵 Cloud Beat',
            bpm: '95 BPM',
            colorTheme: 'from-purple-500/20 via-pink-500/10 to-slate-900/40',
            addedAt: new Date().toISOString().split('T')[0]
          }));
          importedCount = newBatch.length;
        }
      } else {
        // Parse lines (URLs or Name,ID,Artist format)
        const lines = bulkInputText.split('\n').map(l => l.trim()).filter(Boolean);
        lines.forEach((line, idx) => {
          let title = '';
          let driveId = '';
          let artist = 'Google Drive Master Library';

          if (line.includes(',')) {
            const parts = line.split(',');
            title = parts[0].trim();
            driveId = parts[1]?.trim() || '';
            artist = parts[2]?.trim() || 'Google Drive Artist';
          } else if (line.includes('drive.google.com') || line.length > 20) {
            driveId = line;
            title = `Drive Track ${tracks.length + idx + 1}`;
          } else {
            title = line;
          }

          if (title || driveId) {
            newBatch.push({
              id: `bulk-drive-${Date.now()}-${idx}`,
              title: title.replace(/\.[a-zA-Z0-9]+$/, '').replace(/_/g, ' '),
              artist: artist,
              album: 'Google Drive 1000 Vault',
              genre: 'Bollywood',
              duration: '03:30',
              driveId: driveId,
              streamUrl: getDriveStreamUrl(driveId),
              coverArt: COVERS[idx % COVERS.length],
              lyrics: 'Imported from 1000 Google Drive Library',
              isGoogleDrive: true,
              plays: '50',
              vibe: '🔥 Cloud Flow',
              bpm: '90 BPM',
              colorTheme: 'from-amber-500/20 via-orange-500/10 to-indigo-900/30',
              addedAt: new Date().toISOString().split('T')[0]
            });
            importedCount++;
          }
        });
      }

      if (importedCount > 0) {
        setTracks(prev => [...newBatch, ...prev]);
        setBulkStatusMsg({ type: 'success', text: `🎉 Successfully imported ${importedCount} songs into your Google Drive Library!` });
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        setTimeout(() => {
          setIsBulkImportModalOpen(false);
          setBulkInputText('');
          setBulkStatusMsg(null);
        }, 1500);
      } else {
        setBulkStatusMsg({ type: 'error', text: 'No valid songs found in the pasted text.' });
      }
    } catch (err) {
      setBulkStatusMsg({ type: 'error', text: `Import error: ${err.message}` });
    }
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

  // Filtered & Sorted Tracks Pipeline
  const filteredAndSortedTracks = useMemo(() => {
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
      list = list.filter(t => t.genre?.toLowerCase().includes(selectedGenre.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => 
        t.title?.toLowerCase().includes(q) ||
        t.artist?.toLowerCase().includes(q) ||
        t.album?.toLowerCase().includes(q) ||
        t.genre?.toLowerCase().includes(q) ||
        (t.driveId && t.driveId.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortBy === 'title_asc') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title_desc') {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'artist') {
      list = [...list].sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (sortBy === 'plays') {
      list = [...list].sort((a, b) => parseFloat(b.plays || 0) - parseFloat(a.plays || 0));
    }

    return list;
  }, [tracks, activeView, selectedPlaylistId, selectedGenre, searchQuery, favoriteTrackIds, playlists, sortBy]);

  // Paginated Slices for 1000+ Songs Optimization
  const totalPages = Math.ceil(filteredAndSortedTracks.length / itemsPerPage) || 1;
  const paginatedTracks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTracks.slice(start, start + itemsPerPage);
  }, [filteredAndSortedTracks, currentPage, itemsPerPage]);

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-36 select-none relative overflow-x-hidden">
      
      {/* Dynamic Animated Ambient Aurora Background */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-all duration-1000 bg-gradient-to-tr ${currentTrack?.colorTheme || 'from-indigo-900/20 via-purple-900/10 to-black'} blur-3xl opacity-70`}
      />
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-600/10 blur-[140px] pointer-events-none animate-pulse [animation-delay:2s]" />

      {/* Hidden Native Audio Element with crossOrigin */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

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

      {/* ── 1. MODERN TOP GLASS HEADER WITH POWERFUL SEARCH BAR ── */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        
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
              <a 
                href={GOOGLE_DRIVE_FOLDER_URL} 
                target="_blank" 
                rel="noreferrer"
                className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm hover:scale-105 transition-transform"
                title="View Connected Google Drive Folder"
              >
                <FolderCheck className="w-2.5 h-2.5" />
                <span>{tracks.length} Songs Loaded</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-2">
              <span>Auto-Fetched from Google Drive Folder</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-amber-400/90 font-mono">Direct 206 HTTP Stream</span>
            </p>
          </div>
        </div>

        {/* ── HIGH PERFORMANCE LIVE SEARCH BAR ── */}
        <div className="flex items-center gap-2.5 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, singer (Arijit, Badshah, Sharry Mann...), album, or Drive ID..."
              className="w-full pl-10 pr-20 py-2.5 bg-white/5 hover:bg-white/10 focus:bg-white/15 border border-white/15 focus:border-amber-400 rounded-2xl text-xs text-white placeholder:text-slate-400 outline-none transition-all shadow-inner backdrop-blur-md"
            />
            
            {/* Search Clear & Match Count Badge */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                    {filteredAndSortedTracks.length} found
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bulk Import 1000 Songs Button */}
          <button
            onClick={() => setIsBulkImportModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-teal-600/25 cursor-pointer transition-all hover:scale-105"
            title="Bulk Import 1000 Google Drive Songs (List, Links, CSV)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Bulk 1000</span>
          </button>

          {/* Quick Import Single Song */}
          <button
            onClick={() => setIsImportDriveModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs flex items-center gap-1.5 shrink-0 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">+ Import</span>
          </button>

          {/* Reset/Refresh Folder Sync */}
          <button
            onClick={handleResetToDriveFolder}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-emerald-400 border border-white/10 transition-colors cursor-pointer"
            title="Re-sync Master Songs from Drive Folder"
          >
            <RefreshCw className="w-4 h-4" />
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
              <span>All Drive Songs</span>
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
              <span>Drive Cloud Vault</span>
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
                      <span>Drive ID: {currentTrack?.driveId?.substring(0, 10)}...</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-quicksand text-white tracking-tight leading-tight">
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

                {playbackError && (
                  <p className="text-xs text-amber-300 font-bold bg-amber-500/20 border border-amber-400/30 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{playbackError}</span>
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

          {/* ── 4. MOOD & GENRE FILTER PILLS & SORTING TOOLBAR ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#10141d]/80 p-3 rounded-2xl border border-white/10">
            
            {/* Genre filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold flex-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 shrink-0 pr-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Filter:</span>
              </span>
              {['All', 'Bollywood', 'Punjabi', 'Party', 'Devotional', 'Lo-Fi', 'Hip-Hop'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer text-xs ${
                    selectedGenre === genre
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Sort & Pagination Size Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer"
                >
                  <option value="default" className="bg-slate-900">Default Order</option>
                  <option value="title_asc" className="bg-slate-900">Title (A-Z)</option>
                  <option value="title_desc" className="bg-slate-900">Title (Z-A)</option>
                  <option value="artist" className="bg-slate-900">Singer / Artist</option>
                  <option value="plays" className="bg-slate-900">Most Played</option>
                </select>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {filteredAndSortedTracks.length} Tracks
              </span>
            </div>

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
                {activeView === 'all' && <span>🎵 All Google Drive Songs</span>}
                {activeView === 'favorites' && <span>💖 Your Liked Songs & Favorites</span>}
                {activeView === 'drive' && <span>☁️ Google Drive Master Vault</span>}
                {activeView === 'playlist' && <span>📜 Playlist: {selectedPlaylist?.name}</span>}
                {activeView === 'ambience' && <span>🎧 Soundscape Active Library</span>}
                <span className="text-xs font-normal text-slate-400">
                  (Showing {paginatedTracks.length} of {filteredAndSortedTracks.length} tracks)
                </span>
              </h3>
              {activeView === 'playlist' && selectedPlaylist?.description && (
                <p className="text-xs text-slate-400 mt-0.5">{selectedPlaylist.description}</p>
              )}
            </div>

            {filteredAndSortedTracks.length > 0 && (
              <button
                onClick={() => handlePlayTrack(filteredAndSortedTracks[0])}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play All</span>
              </button>
            )}
          </div>

          {/* ── 7. INTERACTIVE TRACK CARDS / ROWS ── */}
          {filteredAndSortedTracks.length === 0 ? (
            <div className="text-center py-16 bg-[#10141d]/80 rounded-3xl border border-white/10 p-6 space-y-3">
              <Disc className="w-12 h-12 text-slate-500 mx-auto animate-spin" />
              <h4 className="text-sm font-bold text-white">No tracks match your current search "{searchQuery}"</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for a different song name, artist, or re-sync all tracks from your Google Drive folder!
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Clear Search
                </button>
                <button
                  onClick={handleResetToDriveFolder}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-sync Default Tracks</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {paginatedTracks.map((track, idx) => {
                const isCurrentPlaying = currentTrack?.id === track.id;
                const isLiked = favoriteTrackIds.includes(track.id);
                const actualIndex = (currentPage - 1) * itemsPerPage + idx + 1;

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
                          actualIndex
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

          {/* ── 8. PAGINATION BAR (FOR 1000 SONGS HIGH PERFORMANCE) ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-slate-400 font-mono">
                Page {currentPage} of {totalPages} ({filteredAndSortedTracks.length} total tracks)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ── 9. PERSISTENT SLEEK BOTTOM PLAYER BAR ── */}
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
                className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
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

      {/* ── 10. BULK IMPORT 1000 SONGS MODAL ── */}
      {isBulkImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121622] w-full max-w-2xl rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-quicksand">Bulk Import 1000 Google Drive Songs</h3>
                  <p className="text-[11px] text-slate-400">Paste your entire track list, Google Drive share links, or CSV lines</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkImportModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkImportSongs} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Paste Multiple Drive Links, File Names, or CSV / JSON:
                </label>
                <textarea
                  value={bulkInputText}
                  onChange={(e) => setBulkInputText(e.target.value)}
                  rows={8}
                  placeholder={`Paste your 1000 songs in any format:\n\nFormat 1 (Links):\nhttps://drive.google.com/file/d/1A2B3C.../view?usp=sharing\nhttps://drive.google.com/file/d/1X2Y3Z.../view?usp=sharing\n\nFormat 2 (CSV Title, DriveID, Artist):\nTum Hi Ho, 1A2B3C..., Arijit Singh\nChanna Mereya, 1X2Y3Z..., Arijit Singh\n\nFormat 3 (JSON array of songs):\n[{"title":"My Song","driveId":"1A2B3C..."}]`}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-xs font-mono text-white placeholder:text-slate-500 focus:border-emerald-400 outline-none resize-y"
                />
              </div>

              {bulkStatusMsg && (
                <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  bulkStatusMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {bulkStatusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{bulkStatusMsg.text}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  ⚡ All imported songs will be saved in your browser storage and will be searchable immediately.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkImportModalOpen(false)}
                    className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-xl shadow-teal-600/30 cursor-pointer transition-all hover:scale-105"
                  >
                    + Import All Songs
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 11. SINGLE GOOGLE DRIVE MUSIC IMPORTER MODAL ── */}
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
                    <option value="Bollywood">Bollywood Hits</option>
                    <option value="Punjabi">Punjabi Party</option>
                    <option value="Devotional">Devotional & Chants</option>
                    <option value="Lo-Fi">Lo-Fi Coding Chill</option>
                    <option value="Synthwave">Synthwave Cyberpunk</option>
                    <option value="Ambient">Deep Space Ambient</option>
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

      {/* ── 12. CREATE PLAYLIST MODAL ── */}
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
                  placeholder="e.g. My Favorite Drive Jams"
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

      {/* ── 13. FULLSCREEN IMMERSIVE VISUALIZER MODAL ── */}
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
