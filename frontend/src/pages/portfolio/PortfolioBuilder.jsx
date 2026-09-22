import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Download, Share2, Copy, RefreshCw, Eye, Edit3, 
  Upload, Camera, ArrowLeft, ArrowRight, CheckCircle2, 
  Layers, Palette, Quote, Briefcase, Mail, MapPin, Globe, 
  Terminal, ShieldCheck, Heart, ExternalLink, Sliders
} from 'lucide-react';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { useAuth } from '../../context/AuthContext.jsx';
import PortfolioSlicedImage from '../../components/portfolio/PortfolioSlicedImage.jsx';

export default function PortfolioBuilder() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const posterRef = useRef(null);
  const fileInputRef = useRef(null);

  // Active student identity
  const [student, setStudent] = useState(null);

  // Portfolio Editable State
  const [name, setName] = useState('Alex Morgan');
  const [role, setRole] = useState('SOFTWARE ARCHITECT');
  const [headlinePart1, setHeadlinePart1] = useState('Code');
  const [headlinePart2, setHeadlinePart2] = useState('With');
  const [headlinePart3, setHeadlinePart3] = useState('Purpose.');
  const [bio, setBio] = useState(
    'I engineer minimal, resilient and impactful systems that elevate products and inspire people.'
  );
  const [quote, setQuote] = useState('GOOD ARCHITECTURE IS STRATEGY MADE EXECUTABLE.');
  const [year, setYear] = useState('2026');
  const [visionTag, setVisionTag] = useState('CREATIVE VISION');
  const [brandTagline, setBrandTagline] = useState('THOUGHTFUL CODE • LASTING IMPACT');
  const [email, setEmail] = useState('alex.morgan@dev.io');
  const [location, setLocation] = useState('BASED IN NEW DELHI, INDIA');
  const [availability, setAvailability] = useState('AVAILABLE FOR FULL-TIME & CONTRACT');
  
  // Photo & Effect Controls
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85'
  );
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [theme, setTheme] = useState('terracotta'); // 'terracotta' | 'amber' | 'obsidian' | 'emerald'

  // Services / Skills (4 Capsules)
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'BACKEND ARCHITECTURE',
      desc: 'Scalable microservices, fault-tolerant pipelines and high-concurrency systems.'
    },
    {
      id: 2,
      title: 'CLOUD & DEVOPS',
      desc: 'Automated CI/CD workflows, Docker containerization and AWS infrastructure.'
    },
    {
      id: 3,
      title: 'DATA STRUCTURES & DSA',
      desc: 'Optimized algorithmic problem solving with clean, benchmarked complexity.'
    },
    {
      id: 4,
      title: 'FULL-STACK DELIVERY',
      desc: 'Interactive, hyper-responsive web interfaces paired with robust REST APIs.'
    }
  ]);

  // UI state
  const [previewTab, setPreviewTab] = useState('split'); // 'split' | 'edit' | 'preview'
  const [aiLoadingField, setAiLoadingField] = useState(null); // 'headline' | 'bio' | 'quote' | 'skills' | 'all'
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [savedSlug, setSavedSlug] = useState('');

  // 1. Initial Data Load from Student Session / Profile
  useEffect(() => {
    let activeEmail = null;
    if (authUser && authUser.email) {
      activeEmail = authUser.email;
      if (authUser.name) setName(authUser.name);
      if (authUser.photo) setPhotoUrl(authUser.photo);
      setEmail(authUser.email);
    } else {
      const saved = localStorage.getItem('arena_student') || localStorage.getItem('user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.email) {
            activeEmail = parsed.email;
            if (parsed.name) setName(parsed.name);
            if (parsed.photo) setPhotoUrl(parsed.photo);
            setEmail(parsed.email);
          }
        } catch (e) {}
      }
    }

    if (activeEmail) {
      // Check if student already has a saved portfolio
      fetch(`/api/portfolio/${encodeURIComponent(activeEmail)}`)
        .then(res => res.json())
        .then(res => {
          if (res.success && res.portfolio) {
            const p = res.portfolio;
            if (p.name) setName(p.name);
            if (p.role) setRole(p.role);
            if (p.headlinePart1) setHeadlinePart1(p.headlinePart1);
            if (p.headlinePart2) setHeadlinePart2(p.headlinePart2);
            if (p.headlinePart3) setHeadlinePart3(p.headlinePart3);
            if (p.bio) setBio(p.bio);
            if (p.quote) setQuote(p.quote);
            if (p.theme) setTheme(p.theme);
            if (p.photoUrl) setPhotoUrl(p.photoUrl);
            if (p.services && p.services.length) setServices(p.services);
            if (p.location) setLocation(p.location);
            if (p.availability) setAvailability(p.availability);
            if (p.slug) setSavedSlug(p.slug);
          }
        })
        .catch(() => {});
    }
  }, [authUser]);

  // Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoUrl(ev.target.result);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Photo updated with sliced effect!',
        showConfirmButton: false,
        timer: 1600
      });
    };
    reader.readAsDataURL(file);
  };

  // 2. AI Text Enhancement Trigger
  const handleAiEnhance = async (field) => {
    setAiLoadingField(field);
    try {
      let draftText = '';
      if (field === 'headline') draftText = `${headlinePart1} ${headlinePart2} ${headlinePart3}`;
      else if (field === 'bio') draftText = bio;
      else if (field === 'quote') draftText = quote;
      else if (field === 'skills') draftText = services.map(s => `${s.title}: ${s.desc}`).join(', ');

      const res = await fetch('/api/portfolio/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          text: draftText,
          name,
          role
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'AI enhancement failed');
      }

      if (field === 'headline') {
        const fullTitle = data.data.title || 'Code With Purpose.';
        const words = fullTitle.trim().split(' ');
        if (words.length >= 3) {
          setHeadlinePart1(words[0]);
          setHeadlinePart2(words.slice(1, -1).join(' '));
          setHeadlinePart3(words[words.length - 1]);
        } else if (words.length === 2) {
          setHeadlinePart1(words[0]);
          setHeadlinePart2('');
          setHeadlinePart3(words[1]);
        } else {
          setHeadlinePart1('Code');
          setHeadlinePart2('With');
          setHeadlinePart3('Purpose.');
        }
        if (data.data.subtitle) setBio(data.data.subtitle);
      } else if (field === 'bio') {
        if (data.data.bio) setBio(data.data.bio);
      } else if (field === 'quote') {
        if (data.data.quote) setQuote(data.data.quote.toUpperCase());
      } else if (field === 'skills') {
        if (Array.isArray(data.data.skills) && data.data.skills.length >= 4) {
          setServices(data.data.skills.slice(0, 4).map((s, idx) => ({
            id: idx + 1,
            title: s.title || `SKILL ${idx + 1}`,
            desc: s.description || s.desc || ''
          })));
        }
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `AI Enhanced ${field.toUpperCase()}!`,
        showConfirmButton: false,
        timer: 1800
      });

    } catch (err) {
      console.error('AI error:', err);
      Swal.fire({
        icon: 'error',
        title: 'AI Enhancement Note',
        text: err.message || 'Could not enhance text at this moment.'
      });
    } finally {
      setAiLoadingField(null);
    }
  };

  // 3. Save Portfolio to Server
  const handleSavePortfolio = async () => {
    setSaving(true);
    try {
      const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'student-portfolio';
      const payload = {
        name,
        role,
        headlinePart1,
        headlinePart2,
        headlinePart3,
        bio,
        quote,
        year,
        visionTag,
        brandTagline,
        email,
        location,
        availability,
        photoUrl,
        theme,
        services,
        slug: generatedSlug
      };

      const res = await fetch('/api/portfolio/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save portfolio');
      }

      setSavedSlug(data.slug || generatedSlug);
      Swal.fire({
        icon: 'success',
        title: 'Portfolio Saved!',
        html: `Your personal editorial portfolio is live and saved successfully.<br/><br/>
               <a href="/portfolio/${data.slug || generatedSlug}" target="_blank" class="text-amber-600 font-bold underline">
                 View Live Portfolio Link ↗
               </a>`,
        confirmButtonColor: '#eab308'
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save Error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // 4. Download HD Poster via html2canvas
  const handleDownloadPoster = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      Swal.fire({
        title: 'Rendering High-Resolution Poster...',
        html: 'Applying graphic sliced ribbons, typography and contrast.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const canvas = await html2canvas(posterRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme === 'terracotta' ? '#f6f0ea' : (theme === 'amber' ? '#fffdf7' : (theme === 'obsidian' ? '#0d0e14' : '#f0fdf4')),
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${name.replace(/\s+/g, '_')}_Editorial_Portfolio_2026.png`;
      link.href = dataUrl;
      link.click();

      Swal.fire({
        icon: 'success',
        title: 'HD Poster Downloaded!',
        text: 'Your high-resolution editorial portfolio has been saved to your device.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Download error:', err);
      Swal.fire({ icon: 'error', title: 'Export Failed', text: err.message });
    } finally {
      setDownloading(false);
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    const slug = savedSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'portfolio';
    const fullUrl = `${window.location.origin}/portfolio/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Portfolio link copied to clipboard!',
      showConfirmButton: false,
      timer: 1800
    });
  };

  // Theme Styling Presets
  const themeStyles = {
    terracotta: {
      bg: 'bg-[#f7f2ec]',
      textPrimary: 'text-[#1d1d20]',
      textAccent: 'text-[#c97a5b]',
      borderLine: 'border-[#dfd7cc]',
      capsuleBg: 'bg-[#ede5dc]/60',
      capsuleBorder: 'border-[#ded4c7]',
      capsuleIconBg: 'bg-[#c97a5b] text-white',
      badgeBg: 'bg-[#c97a5b]/10 text-[#c97a5b] border-[#c97a5b]/30'
    },
    amber: {
      bg: 'bg-[#fffdf8]',
      textPrimary: 'text-[#0f172a]',
      textAccent: 'text-[#d97706]',
      borderLine: 'border-[#fef08a]',
      capsuleBg: 'bg-[#fef9c3]/50',
      capsuleBorder: 'border-[#fde047]',
      capsuleIconBg: 'bg-[#eab308] text-black',
      badgeBg: 'bg-[#fef3c7] text-[#92400e] border-[#fcd34d]'
    },
    obsidian: {
      bg: 'bg-[#0e0f15]',
      textPrimary: 'text-[#f8fafc]',
      textAccent: 'text-[#fbbf24]',
      borderLine: 'border-[#27272a]',
      capsuleBg: 'bg-[#18181b]/80',
      capsuleBorder: 'border-[#3f3f46]',
      capsuleIconBg: 'bg-[#fbbf24] text-black',
      badgeBg: 'bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/30'
    },
    emerald: {
      bg: 'bg-[#f0fdf4]',
      textPrimary: 'text-[#064e3b]',
      textAccent: 'text-[#059669]',
      borderLine: 'border-[#bbf7d0]',
      capsuleBg: 'bg-[#dcfce7]/60',
      capsuleBorder: 'border-[#86efac]',
      capsuleIconBg: 'bg-[#059669] text-white',
      badgeBg: 'bg-[#d1fae5] text-[#065f46] border-[#6ee7b7]'
    }
  };

  const t = themeStyles[theme] || themeStyles.terracotta;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* ─── Top Control Toolbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Link
              to="/student/profile"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-yellow-400" />
              <span>Back to Profile</span>
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>AI Editorial Portfolio Generator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-mono font-bold">
                  2026 Edition
                </span>
              </h1>
            </div>
          </div>

          {/* View Toggles & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Split / Edit / Preview Toggle */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setPreviewTab('split')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  previewTab === 'split' ? 'bg-yellow-400 text-black font-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setPreviewTab('edit')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  previewTab === 'edit' ? 'bg-yellow-400 text-black font-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                Edit Only
              </button>
              <button
                onClick={() => setPreviewTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  previewTab === 'preview' ? 'bg-yellow-400 text-black font-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                Preview Poster
              </button>
            </div>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Copy shareable link"
            >
              <Copy className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Share Link</span>
            </button>

            {/* Download HD Poster Button */}
            <button
              onClick={handleDownloadPoster}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-black" />
              <span>{downloading ? 'Rendering...' : 'Download HD Poster'}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSavePortfolio}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>{saving ? 'Saving...' : 'Save Online'}</span>
            </button>

          </div>

        </div>
      </header>

      {/* ─── Main Content Workspace ──────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ═════════════════════════════════════════════════════════════════
             LEFT COLUMN: Customization & AI Enhancement Studio (5 Cols)
          ═════════════════════════════════════════════════════════════════ */}
          {(previewTab === 'split' || previewTab === 'edit') && (
            <div className={`${previewTab === 'split' ? 'lg:col-span-5' : 'lg:col-span-12 max-w-3xl mx-auto'} space-y-6`}>
              
              {/* Theme Selector Pill Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-yellow-400" />
                    Color Aesthetics Theme
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Select Preset</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setTheme('terracotta')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      theme === 'terracotta'
                        ? 'bg-[#c97a5b]/20 border-[#c97a5b] text-[#c97a5b] shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#c97a5b] border border-white/40" />
                    <span>Terracotta</span>
                  </button>

                  <button
                    onClick={() => setTheme('amber')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      theme === 'amber'
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-yellow-400 border border-white/40" />
                    <span>Warm Amber</span>
                  </button>

                  <button
                    onClick={() => setTheme('obsidian')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      theme === 'obsidian'
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#18181b] border border-amber-400" />
                    <span>Obsidian</span>
                  </button>

                  <button
                    onClick={() => setTheme('emerald')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      theme === 'emerald'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-500 border border-white/40" />
                    <span>Emerald</span>
                  </button>
                </div>
              </div>

              {/* Photo & Sliced Effect Settings */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-yellow-400" />
                    Portrait Photo & Sliced Effect
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 text-black text-xs font-black flex items-center gap-1 cursor-pointer transition"
                  >
                    <Upload className="w-3 h-3 text-black" />
                    <span>Upload Photo</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Photo Zoom & Pan Sliders */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Photo Zoom</span>
                    <span className="font-mono text-white">{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.6"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-yellow-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Editorial Headline with AI Enhance */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Editorial Headline (3 Lines)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiEnhance('headline')}
                    disabled={aiLoadingField === 'headline'}
                    className="px-3 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 text-black text-xs font-black flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-black" />
                    <span>{aiLoadingField === 'headline' ? 'Enhancing...' : 'AI Enhance'}</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={headlinePart1}
                    onChange={(e) => setHeadlinePart1(e.target.value)}
                    placeholder="Code"
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    value={headlinePart2}
                    onChange={(e) => setHeadlinePart2(e.target.value)}
                    placeholder="With"
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    value={headlinePart3}
                    onChange={(e) => setHeadlinePart3(e.target.value)}
                    placeholder="Purpose."
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Bio / Impact Summary with AI Enhance */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Bio & Value Summary
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiEnhance('bio')}
                    disabled={aiLoadingField === 'bio'}
                    className="px-3 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 text-black text-xs font-black flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-black" />
                    <span>{aiLoadingField === 'bio' ? 'Enhancing...' : 'AI Enhance'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Enter a short, confident summary of what you build..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-yellow-400 leading-relaxed"
                />
              </div>

              {/* Services / Skills Capsules with AI Enhance */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-yellow-400" />
                    4 Service & Skill Capsules
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiEnhance('skills')}
                    disabled={aiLoadingField === 'skills'}
                    className="px-3 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 text-black text-xs font-black flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-black" />
                    <span>{aiLoadingField === 'skills' ? 'Enhancing...' : 'AI Enhance'}</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {services.map((srv, idx) => (
                    <div key={srv.id} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[idx].title = e.target.value;
                          setServices(updated);
                        }}
                        placeholder={`Capsule ${idx + 1} Title`}
                        className="w-full px-2.5 py-1 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-bold text-yellow-300 outline-none focus:border-yellow-400 uppercase"
                      />
                      <input
                        type="text"
                        value={srv.desc}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[idx].desc = e.target.value;
                          setServices(updated);
                        }}
                        placeholder="Brief 1-sentence description"
                        className="w-full px-2.5 py-1 bg-slate-900/90 border border-slate-700 rounded-lg text-[11px] text-slate-200 outline-none focus:border-yellow-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Quote with AI Enhance */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Quote className="w-4 h-4 text-yellow-400" />
                    Philosophy / Engineering Quote
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiEnhance('quote')}
                    disabled={aiLoadingField === 'quote'}
                    className="px-3 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 border border-yellow-500 text-black text-xs font-black flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-black" />
                    <span>{aiLoadingField === 'quote' ? 'Enhancing...' : 'AI Enhance'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value.toUpperCase())}
                  placeholder="e.g. GOOD ARCHITECTURE IS STRATEGY MADE EXECUTABLE."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono uppercase outline-none focus:border-yellow-400"
                />
              </div>

              {/* Student Name & Footer Details */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Student Wordmark & Contact Details
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Brand Name / Wordmark</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-yellow-400 uppercase font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Target Role Category</span>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-yellow-400 uppercase font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Contact Email</span>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Location</span>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-yellow-400 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Availability Status</span>
                  <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-yellow-400 uppercase"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
             RIGHT COLUMN: Live High-End Editorial Poster Canvas (7 Cols)
          ═════════════════════════════════════════════════════════════════ */}
          {(previewTab === 'split' || previewTab === 'preview') && (
            <div className={`${previewTab === 'split' ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl mx-auto'} flex flex-col items-center`}>
              
              {/* Poster Frame / Canvas Container */}
              <div
                ref={posterRef}
                className={`w-full max-w-[720px] aspect-[1/1.46] ${t.bg} ${t.textPrimary} rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden transition-colors duration-500 select-none flex flex-col justify-between`}
                style={{
                  fontFamily: '"Cinzel", "Playfair Display", Georgia, serif'
                }}
              >
                {/* Subtle vintage texture overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.035]"
                  style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* ─── 1. TOP EDITORIAL BAR ───────────────────────────── */}
                <div className="flex items-start justify-between relative z-10">
                  {/* Left: Cross, Category & Vertical Line */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono font-bold opacity-60 flex items-center gap-1.5">
                      <span>+</span>
                    </div>
                    <div className="w-[1px] h-6 bg-current opacity-40" />
                    <div className="text-[11px] font-sans font-black uppercase tracking-[0.25em] opacity-80">
                      {role || 'GRAPHIC DESIGNER'}
                    </div>
                  </div>

                  {/* Right: Big Year & Vision Tag */}
                  <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-1.5 opacity-60 text-xs font-mono">
                      <span>• • •</span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black font-mono tracking-tighter leading-none">
                      {year}
                    </div>
                    <div className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] opacity-70">
                      {visionTag || 'CREATIVE VISION'}
                    </div>
                    <div className="w-[1px] h-6 bg-current opacity-40 ml-auto" />
                  </div>
                </div>

                {/* ─── 2. MAIN HERO & SLICED IMAGE ROW ────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto relative z-10">
                  
                  {/* Left Hero Column: Headline, Bio & Services (6 Cols) */}
                  <div className="md:col-span-6 space-y-6">
                    
                    {/* Editorial Display Headline */}
                    <div className="space-y-1">
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                        <span className="block">{headlinePart1}</span>
                        <span className={`block ${t.textAccent}`}>
                          {headlinePart2} {headlinePart3}
                        </span>
                      </h2>
                      <div className="w-10 h-[2px] bg-current opacity-40 mt-3" />
                    </div>

                    {/* Bio / Value Proposition */}
                    <p className="font-sans text-xs sm:text-sm font-medium leading-relaxed opacity-85 max-w-[280px]">
                      {bio}
                    </p>

                    {/* Services / Skills Capsules */}
                    <div className="space-y-3 pt-2">
                      <div className="text-[10px] font-sans font-black uppercase tracking-[0.25em] opacity-70 flex items-center gap-2">
                        <span>SERVICES</span>
                        <span className="w-4 h-[1px] bg-current opacity-40" />
                      </div>

                      <div className="space-y-2.5">
                        {services.map((srv, idx) => (
                          <div key={srv.id} className="flex items-start gap-3 group">
                            <div className="relative flex-shrink-0 mt-0.5">
                              <div className={`w-6 h-6 rounded-full ${t.capsuleIconBg} flex items-center justify-center text-[10px] font-mono font-bold shadow-sm`}>
                                {idx === 0 ? '✦' : (idx === 1 ? '▲' : (idx === 2 ? '◼' : '●'))}
                              </div>
                              {idx < services.length - 1 && (
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-current opacity-20" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-sans text-[11px] font-black uppercase tracking-wider">
                                {srv.title}
                              </div>
                              <div className="font-sans text-[10px] opacity-75 leading-tight line-clamp-1">
                                {srv.desc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Sliced Photo Stage + Quote Capsule (6 Cols) */}
                  <div className="md:col-span-6 relative flex flex-col items-center justify-center">
                    
                    {/* The Signature Sliced Photo Effect */}
                    <PortfolioSlicedImage
                      photoUrl={photoUrl}
                      theme={theme}
                      zoom={zoom}
                      panX={panX}
                      panY={panY}
                    />

                    {/* Right-aligned Quote Capsule */}
                    <div className="w-full flex justify-end mt-4">
                      <div className="text-right max-w-[180px] space-y-1">
                        <div className={`text-2xl font-serif leading-none ${t.textAccent}`}>
                          “
                        </div>
                        <div className="text-[10px] font-sans font-black uppercase tracking-wider leading-snug">
                          {quote}
                        </div>
                        <div className={`w-8 h-[2px] ml-auto mt-1 ${theme === 'terracotta' ? 'bg-[#c97a5b]' : 'bg-yellow-500'}`} />
                      </div>
                    </div>

                  </div>

                </div>

                {/* ─── 3. BRAND WORDMARK BAR ──────────────────────────── */}
                <div className={`pt-6 border-t ${t.borderLine} relative z-10 space-y-4`}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    {/* Huge Luxury Brand Wordmark */}
                    <div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.25em] uppercase">
                        {name || 'ZYLYRA'}
                      </div>
                      <div className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase opacity-70 mt-0.5">
                        {role || 'GRAPHIC DESIGNER'}
                      </div>
                    </div>

                    {/* Circular Impact Stamp */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full border border-current opacity-70 flex items-center justify-center">
                        <Sparkles className={`w-4 h-4 ${t.textAccent}`} />
                      </div>
                      <div className="text-left font-sans">
                        <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <span>LET'S CREATE SOMETHING AMAZING.</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                        <div className="text-[9px] opacity-60 tracking-wider font-mono">
                          {brandTagline || 'THOUGHTFUL CODE • LASTING IMPACT'}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ─── 4. DENSE FOOTER CONTACT BAR ──────────────────── */}
                  <div className={`pt-3 border-t ${t.borderLine} flex flex-wrap items-center justify-between gap-3 text-[10px] font-sans font-bold opacity-80`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${theme === 'terracotta' ? 'bg-[#c97a5b]' : 'bg-yellow-500'}`} />
                      <span className="font-mono">{email}</span>
                    </div>

                    <div className="hidden sm:inline opacity-40">|</div>

                    <div>
                      <span>{location}</span>
                    </div>

                    <div className="hidden sm:inline opacity-40">|</div>

                    <div>
                      <span>{availability}</span>
                    </div>

                    <div className="font-mono text-[9px] opacity-50 tracking-widest hidden md:inline">
                      ::: ::: :::
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Canvas Control Quick Links */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-400">
                <span>💡 Tip: Click "AI Enhance" next to any section to elevate your text with Gemini AI.</span>
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
