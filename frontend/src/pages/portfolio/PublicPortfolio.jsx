import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sparkles, Download, Share2, Copy, ArrowLeft, ArrowRight, 
  ExternalLink, Mail, MapPin, CheckCircle2, Award, Terminal
} from 'lucide-react';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import PortfolioSlicedImage from '../../components/portfolio/PortfolioSlicedImage.jsx';

export default function PublicPortfolio() {
  const { id } = useParams();
  const posterRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/portfolio/${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.portfolio) {
          setPortfolio(data.portfolio);
        } else {
          // Fallback demo data matching the reference poster
          setPortfolio({
            name: id.replace(/-/g, ' ').toUpperCase(),
            role: 'GRAPHIC DESIGNER & ARCHITECT',
            headlinePart1: 'Design',
            headlinePart2: 'With',
            headlinePart3: 'Purpose.',
            bio: 'I create minimal, meaningful and impactful systems that elevate brands and inspire people.',
            quote: 'GOOD DESIGN IS STRATEGY MADE VISIBLE.',
            year: '2026',
            visionTag: 'CREATIVE VISION',
            brandTagline: 'THOUGHTFUL CODE • LASTING IMPACT',
            email: `hello@${id}.dev`,
            location: 'BASED IN INDIA',
            availability: 'AVAILABLE FOR FREELANCE & FULL-TIME',
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85',
            theme: 'terracotta',
            services: [
              { id: 1, title: 'BRAND IDENTITY', desc: 'Build strong and memorable systems.' },
              { id: 2, title: 'PRINT & SYSTEM DESIGN', desc: 'Brochures, posters, and scalable architecture.' },
              { id: 3, title: 'SOCIAL & CLOUD', desc: 'Engaging content and cloud pipelines that connect.' },
              { id: 4, title: 'WEB & UI DESIGN', desc: 'Clean, modern and user-friendly designs.' }
            ]
          });
        }
      })
      .catch(() => {
        setPortfolio(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${(portfolio?.name || 'portfolio').replace(/\s+/g, '_')}_Editorial_Poster.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Portfolio link copied to clipboard!',
      showConfirmButton: false,
      timer: 1800
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-yellow-300">
            Loading Editorial Portfolio...
          </p>
        </div>
      </div>
    );
  }

  const p = portfolio;
  const theme = p?.theme || 'terracotta';

  // Theme palettes matching reference
  const themeStyles = {
    terracotta: {
      bg: 'bg-[#f7f2ec]',
      textPrimary: 'text-[#1d1d20]',
      textAccent: 'text-[#c97a5b]',
      borderLine: 'border-[#dfd7cc]',
      capsuleIconBg: 'bg-[#c97a5b] text-white'
    },
    amber: {
      bg: 'bg-[#fffdf8]',
      textPrimary: 'text-[#0f172a]',
      textAccent: 'text-[#d97706]',
      borderLine: 'border-[#fef08a]',
      capsuleIconBg: 'bg-[#eab308] text-black'
    },
    obsidian: {
      bg: 'bg-[#0e0f15]',
      textPrimary: 'text-[#f8fafc]',
      textAccent: 'text-[#fbbf24]',
      borderLine: 'border-[#27272a]',
      capsuleIconBg: 'bg-[#fbbf24] text-black'
    },
    emerald: {
      bg: 'bg-[#f0fdf4]',
      textPrimary: 'text-[#064e3b]',
      textAccent: 'text-[#059669]',
      borderLine: 'border-[#bbf7d0]',
      capsuleIconBg: 'bg-[#059669] text-white'
    }
  };

  const t = themeStyles[theme] || themeStyles.terracotta;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Top Navbar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4 text-yellow-400" />
          <span>Leaderboard</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            to="/student/portfolio"
            className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 text-black font-black text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Create Your Portfolio</span>
          </Link>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Share"
          >
            <Share2 className="w-4 h-4 text-yellow-400" />
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-yellow-400" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* ─── The Poster Canvas ────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto flex justify-center">
        <div
          ref={posterRef}
          className={`w-full aspect-[1/1.46] ${t.bg} ${t.textPrimary} rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden transition-colors duration-500 select-none flex flex-col justify-between`}
          style={{
            fontFamily: '"Cinzel", "Playfair Display", Georgia, serif'
          }}
        >
          {/* Subtle paper texture */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
              backgroundSize: '16px 16px'
            }}
          />

          {/* ─── 1. TOP EDITORIAL BAR ───────────────────────────── */}
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold opacity-60 flex items-center gap-1.5">
                <span>+</span>
              </div>
              <div className="w-[1px] h-6 bg-current opacity-40" />
              <div className="text-[11px] font-sans font-black uppercase tracking-[0.25em] opacity-80">
                {p?.role || 'GRAPHIC DESIGNER'}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-1.5 opacity-60 text-xs font-mono">
                <span>• • •</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tighter leading-none">
                {p?.year || '2026'}
              </div>
              <div className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] opacity-70">
                {p?.visionTag || 'CREATIVE VISION'}
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
                  <span className="block">{p?.headlinePart1 || 'Design'}</span>
                  <span className={`block ${t.textAccent}`}>
                    {p?.headlinePart2} {p?.headlinePart3 || 'Purpose.'}
                  </span>
                </h2>
                <div className="w-10 h-[2px] bg-current opacity-40 mt-3" />
              </div>

              {/* Bio / Value Proposition */}
              <p className="font-sans text-xs sm:text-sm font-medium leading-relaxed opacity-85 max-w-[280px]">
                {p?.bio}
              </p>

              {/* Services / Skills Capsules */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-sans font-black uppercase tracking-[0.25em] opacity-70 flex items-center gap-2">
                  <span>SERVICES</span>
                  <span className="w-4 h-[1px] bg-current opacity-40" />
                </div>

                <div className="space-y-2.5">
                  {(p?.services || []).map((srv, idx) => (
                    <div key={srv.id || idx} className="flex items-start gap-3 group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <div className={`w-6 h-6 rounded-full ${t.capsuleIconBg} flex items-center justify-center text-[10px] font-mono font-bold shadow-sm`}>
                          {idx === 0 ? '✦' : (idx === 1 ? '▲' : (idx === 2 ? '◼' : '●'))}
                        </div>
                        {idx < (p?.services || []).length - 1 && (
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
              
              <PortfolioSlicedImage
                photoUrl={p?.photoUrl}
                theme={theme}
                zoom={1}
                panX={0}
                panY={0}
              />

              {/* Right-aligned Quote Capsule */}
              <div className="w-full flex justify-end mt-4">
                <div className="text-right max-w-[180px] space-y-1">
                  <div className={`text-2xl font-serif leading-none ${t.textAccent}`}>
                    “
                  </div>
                  <div className="text-[10px] font-sans font-black uppercase tracking-wider leading-snug">
                    {p?.quote}
                  </div>
                  <div className={`w-8 h-[2px] ml-auto mt-1 ${theme === 'terracotta' ? 'bg-[#c97a5b]' : 'bg-yellow-500'}`} />
                </div>
              </div>

            </div>

          </div>

          {/* ─── 3. BRAND WORDMARK BAR ──────────────────────────── */}
          <div className={`pt-6 border-t ${t.borderLine} relative z-10 space-y-4`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.25em] uppercase">
                  {p?.name || 'ZYLYRA'}
                </div>
                <div className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase opacity-70 mt-0.5">
                  {p?.role || 'GRAPHIC DESIGNER'}
                </div>
              </div>

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
                    {p?.brandTagline || 'THOUGHTFUL CODE • LASTING IMPACT'}
                  </div>
                </div>
              </div>

            </div>

            {/* ─── 4. DENSE FOOTER CONTACT BAR ──────────────────── */}
            <div className={`pt-3 border-t ${t.borderLine} flex flex-wrap items-center justify-between gap-3 text-[10px] font-sans font-bold opacity-80`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${theme === 'terracotta' ? 'bg-[#c97a5b]' : 'bg-yellow-500'}`} />
                <span className="font-mono">{p?.email}</span>
              </div>

              <div className="hidden sm:inline opacity-40">|</div>

              <div>
                <span>{p?.location}</span>
              </div>

              <div className="hidden sm:inline opacity-40">|</div>

              <div>
                <span>{p?.availability}</span>
              </div>

              <div className="font-mono text-[9px] opacity-50 tracking-widest hidden md:inline">
                ::: ::: :::
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
