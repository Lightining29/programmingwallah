import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  User, Lock, Eye, EyeOff, Mail, ArrowRight, Home,
  GraduationCap, Users, UserCheck, ShieldCheck, Flame, Zap, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

/* ── Available Portals Configuration ── */
const PORTALS = [
  {
    id: 'student',
    name: 'Student LMS',
    icon: GraduationCap,
    role: 'user',
    email: 'student@pranidha.edu',
    password: 'student123',
    accentColor: '#f43f5e',
    description: 'Access coding courses, live practice & student portal',
    badge: 'Student LMS'
  },
  {
    id: 'parent',
    name: 'Parent Portal',
    icon: Users,
    role: 'parent',
    email: 'parent@pranidha.edu',
    password: 'parent123',
    accentColor: '#10b981',
    description: 'Track child progress, attendance & fee records',
    badge: 'Parent Portal'
  },
  {
    id: 'teacher',
    name: 'Teacher Portal',
    icon: UserCheck,
    role: 'teacher',
    email: 'teacher@pranidha.edu',
    password: 'teacher123',
    accentColor: '#8b5cf6',
    description: 'Manage class schedules, student grading & notices',
    badge: 'Teacher Portal'
  },
  {
    id: 'admin',
    name: 'Admin Portal',
    icon: ShieldCheck,
    role: 'admin',
    email: 'admin@pranidha.edu',
    password: 'admin123',
    accentColor: '#06b6d4',
    description: 'Full institute management, admissions & reports',
    badge: 'Admin Portal'
  }
];

export default function Login() {
  const { login, register, loginWithGoogle, user, error, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [selectedPortalId, setSelectedPortalId] = useState('student');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('student@pranidha.edu');
  const [password, setPassword] = useState('student123');
  const [confirm, setConfirm]   = useState('');
  const [valErr, setValErr]     = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const selectedPortal = PORTALS.find(p => p.id === selectedPortalId) || PORTALS[0];

  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin')        navigate('/dashboard/admin');
    else if (user.role === 'teacher') navigate('/dashboard/teacher');
    else if (user.role === 'parent')  navigate('/dashboard/parent');
    else navigate('/lms/dashboard');
  }, [user, navigate]);

  const handleSelectPortal = (portal) => {
    setSelectedPortalId(portal.id);
    setEmail(portal.email);
    setPassword(portal.password);
    setValErr('');
  };

  const handleQuickLogin = async (portal) => {
    setValErr('');
    const res = await login(portal.email, portal.password);
    if (res.success) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (portal.id === 'student')      navigate('/lms/dashboard');
      else if (portal.id === 'parent')  navigate('/dashboard/parent');
      else if (portal.id === 'teacher') navigate('/dashboard/teacher');
      else if (portal.id === 'admin')   navigate('/dashboard/admin');
      else navigate('/lms/dashboard');
    } else {
      setValErr(res.message || `Login to ${portal.name} failed.`);
    }
  };

  const handleGoogleSignIn = async () => {
    setValErr('');
    const targetEmail = email && email.includes('@') ? email : `student_${Date.now().toString().slice(-4)}@gmail.com`;
    const targetName = name || (targetEmail ? targetEmail.split('@')[0] : 'Google Student');

    const res = await loginWithGoogle({
      email: targetEmail,
      name: targetName,
      avatar: '/clay_mascot.png',
      role: selectedPortal.role || 'user'
    });

    if (res.success) {
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
      if (selectedPortalId === 'admin') navigate('/dashboard/admin');
      else if (selectedPortalId === 'teacher') navigate('/dashboard/teacher');
      else if (selectedPortalId === 'parent') navigate('/dashboard/parent');
      else navigate('/lms/dashboard');
    } else {
      setValErr(res.message || 'Google login failed.');
    }
  };

  const handleQuickStudentSignUp = async () => {
    setValErr('');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const quickName = `Student ${randomSuffix}`;
    const quickEmail = `student_${Date.now().toString().slice(-6)}@pranidha.edu`;
    const quickPass = 'student123';

    setName(quickName);
    setEmail(quickEmail);
    setPassword(quickPass);
    setConfirm(quickPass);

    const res = await register(quickName, quickEmail, quickPass, 'user');
    if (res.success) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      navigate('/lms/dashboard');
    } else {
      setValErr(res.message || 'Sign up failed.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setValErr('');
    const res = await login(email, password);
    if (res.success) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      setValErr(res.message || 'Login failed.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setValErr('');
    if (!name.trim())          { setValErr('Enter your full name'); return; }
    if (password.length < 6)   { setValErr('Password must be ≥ 6 chars'); return; }
    if (password !== confirm)  { setValErr('Passwords do not match'); return; }
    const res = await register(name, email, password, 'user');
    if (res.success) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      navigate('/lms/dashboard');
    } else setValErr(res.message || 'Registration failed.');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#07080c] font-sans antialiased text-white relative overflow-hidden">

      {/* ── Top Left Floating Home Button ── */}
      <Link 
        to="/"
        className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white/90 bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md transition-all shadow-lg hover:scale-105"
      >
        <Home className="w-3.5 h-3.5 text-pink-400" /> Back to Home
      </Link>

      {/* ══════════════════════════════════════════════════════════════════
          LEFT HERO PANEL: Cinematic Moonlit Landscape & AI Branding
         ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 overflow-hidden select-none">
        
        {/* Background Image with Ambient Night Artwork */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85')`,
            backgroundPosition: 'center 40%'
          }}
        />

        {/* Cinematic Vignette & Lighting Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-[#07080c]" />
        
        {/* Full Moon Glow Flare Simulation */}
        <div 
          className="absolute top-10 left-36 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(200,230,255,0.08) 45%, transparent 70%)',
            filter: 'blur(20px)'
          }}
        />

        {/* ── Top Brand Badge: Programming Wallah & Appletree Infotech ── */}
        <div className="relative z-10 flex items-center gap-3.5 pt-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-pink-500/30 to-rose-600/30 border border-pink-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.35)] overflow-hidden p-1.5">
            <img 
              src="/appletree_logo.png" 
              alt="Appletree Logo" 
              className="w-full h-full object-contain drop-shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.png';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">Programming Wallah</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">AI</span>
            </div>
            <p className="text-[11px] font-extrabold tracking-widest text-[#f43f5e] uppercase">
              APPLETREE INFOTECH
            </p>
          </div>
        </div>

        {/* ── Bottom Content: Status Badge & Hero Typography ── */}
        <div className="relative z-10 space-y-4 pb-4 max-w-lg">
          
          {/* Active Opportunities Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-semibold text-white/90 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>10,480+ Live Opportunities Active</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
            Find Your Dream Job <br />
            <span className="bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              Powered by AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-md">
            Master full-stack technologies with Programming Wallah & Appletree Infotech. Match with verified tech employers, and launch your dream career.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT FORM PANEL: Sleek Dark Modern Interface
         ══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 z-20 relative">

        <div className="w-full max-w-[440px] space-y-6">

          {/* Header Title */}
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {isRegister ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {isRegister 
                ? 'Start learning and building your career with Appletree AI' 
                : 'Select your portal or enter your credentials to continue'}
            </p>
          </div>

          {/* Portal Selector Tabs (Student LMS, Parent, Teacher, Admin) */}
          {!isRegister && (
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                Select Portal Access
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PORTALS.map((portal) => {
                  const Icon = portal.icon;
                  const isSelected = selectedPortalId === portal.id;
                  return (
                    <button
                      key={portal.id}
                      type="button"
                      onClick={() => handleSelectPortal(portal)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected 
                          ? 'bg-[#121722] border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.35)] scale-[1.02]' 
                          : 'bg-[#0b0e14] border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className={`text-[11px] font-bold truncate w-full ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {portal.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {(valErr || error) && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{valErr || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">

            {/* Name Input (Register mode only) */}
            {isRegister && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-cyan-400/80" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0c1017] border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>
            )}

            {/* Email Address Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 text-cyan-400/80" />
              </div>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0c1017] border border-cyan-500/50 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type={showPw ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0c1017] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-11 text-sm text-white placeholder-slate-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password (Register mode only) */}
            {isRegister && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  placeholder="Confirm Password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full bg-[#0c1017] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>
            )}

            {/* Options Row: Remember Me & Forgot Password */}
            {!isRegister && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0c1017] border-slate-700 text-pink-500 focus:ring-0 accent-pink-500"
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-[#f43f5e] hover:text-pink-400 font-semibold transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Primary Action Button: Pink Pill CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-bold text-sm text-white tracking-wide transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mt-2"
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                boxShadow: '0 4px 22px rgba(244, 63, 94, 0.45)'
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isRegister ? 'Create Free Account' : 'Continue with Email'}</span>
              )}
            </button>

            {/* Secondary Action: Google One-Click Login */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 rounded-full font-bold text-sm text-white bg-[#141822] hover:bg-[#1a202c] border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 shadow-sm"
            >
              {/* Google colorful G logo icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.98 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Toggle Login / Sign Up */}
          <div className="text-center pt-2 text-xs text-slate-400">
            <span>{isRegister ? 'Already have an account? ' : "Don't have an account? "}</span>
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setValErr(''); }}
              className="text-[#f43f5e] hover:text-pink-400 font-bold ml-1 transition-colors cursor-pointer"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

        </div>

        {/* ── Floating Mascot Badge in Bottom Right Corner ── */}
        <div className="absolute bottom-6 right-6 hidden sm:flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#141824] border border-slate-700/80 shadow-[0_0_15px_rgba(244,63,94,0.25)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <img 
              src="/clay_mascot.png" 
              alt="Mascot" 
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.png';
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
