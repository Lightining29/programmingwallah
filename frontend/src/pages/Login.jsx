import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  User, Lock, Eye, EyeOff, Mail, ArrowRight, Code2, Home,
  GraduationCap, Users, UserCheck, ShieldCheck, Sparkles, CheckCircle2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/* ── Hanging Lamp SVG with pull-string theme toggle ── */
function HangingLamp({ isDark, onToggle }) {
  const [swing, setSwing] = useState(0);
  const [pulled, setPulled] = useState(false);

  const pull = () => {
    setPulled(true);
    setSwing(16);
    onToggle();
    setTimeout(() => setSwing(-9),  200);
    setTimeout(() => setSwing(4),   370);
    setTimeout(() => setSwing(-2),  500);
    setTimeout(() => { setSwing(0); setPulled(false); }, 620);
  };

  const wire   = isDark ? '#78716c' : '#d97706';
  const cap    = isDark ? '#292524' : '#b45309';
  const shade  = isDark ? '#44403c' : '#fef3c7';
  const bulb   = isDark ? '#57534e' : '#fde68a';
  const str    = isDark ? '#a8a29e' : '#92400e';
  const glow   = isDark ? 'none'    : 'drop-shadow(0 0 10px #fbbf24)';

  return (
    <div className="flex flex-col items-center cursor-pointer select-none group" onClick={pull}
         title={isDark ? 'Turn on light' : 'Turn off light'}>
      <motion.div animate={{ rotate: swing }} transition={{ type:'spring', stiffness:280, damping:14 }}
                  style={{ transformOrigin:'top center' }} className="flex flex-col items-center">
        {/* Wire */}
        <svg width="3" height="32"><line x1="1.5" y1="0" x2="1.5" y2="32" stroke={wire} strokeWidth="2" strokeLinecap="round"/></svg>
        {/* Lamp */}
        <svg width="68" height="56" viewBox="0 0 68 56">
          {!isDark && <ellipse cx="34" cy="50" rx="28" ry="10" fill="rgba(251,191,36,0.4)" filter="url(#gblur)"/>}
          <defs><filter id="gblur"><feGaussianBlur stdDeviation="4"/></filter></defs>
          <rect x="22" y="6" width="24" height="7" rx="3" fill={cap}/>
          <polygon points="8,46 24,10 44,10 60,46" fill={shade} stroke={cap} strokeWidth="1.5" strokeLinejoin="round"/>
          <polygon points="20,42 28,14 40,14 50,42" fill="rgba(255,255,255,0.1)"/>
          <ellipse cx="34" cy="48" rx="6.5" ry="7" fill={bulb} style={{ filter: glow }}/>
          {!isDark && <ellipse cx="31" cy="44" rx="2.5" ry="3" fill="rgba(255,255,255,0.6)"/>}
        </svg>
      </motion.div>
      {/* String */}
      <motion.div animate={{ scaleY: pulled ? 0.82 : 1, y: pulled ? -3 : 0 }} transition={{ duration:0.14 }}
                  className="flex flex-col items-center">
        <svg width="2" height="26"><line x1="1" y1="0" x2="1" y2="20" stroke={str} strokeWidth="1.5" strokeDasharray="3 2"/></svg>
        <svg width="13" height="13"><circle cx="6.5" cy="6.5" r="5" fill="none" stroke={str} strokeWidth="2"/></svg>
      </motion.div>
      <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-60 group-hover:opacity-90 transition-opacity"
            style={{ color: str }}>
        {isDark ? 'Light on' : 'Light off'}
      </span>
    </div>
  );
}

/* ── Available Portals Configuration ── */
const PORTALS = [
  {
    id: 'student',
    name: 'Student LMS',
    icon: GraduationCap,
    role: 'user',
    email: 'student@pranidha.edu',
    password: 'student123',
    accentColor: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    description: 'Access coding courses, interactive practice & student dashboard',
    redirect: '/lms/dashboard',
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
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Track child progress, attendance, fee receipts & school notices',
    redirect: '/dashboard/parent',
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
    gradient: 'from-purple-500 to-indigo-600',
    description: 'Manage class schedules, student grading & parent communication',
    redirect: '/dashboard/teacher',
    badge: 'Teacher Portal'
  },
  {
    id: 'admin',
    name: 'Admin Portal',
    icon: ShieldCheck,
    role: 'admin',
    email: 'admin@pranidha.edu',
    password: 'admin123',
    accentColor: '#f43f5e',
    gradient: 'from-rose-500 to-red-600',
    description: 'Full institute management, user administration, fees & reports',
    redirect: '/dashboard/admin',
    badge: 'Admin Portal'
  }
];

/* ── Course tech badges ── */
const TECH_BADGES = [
  { label: 'Java',  bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  { label: 'C++',   bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  { label: 'MERN',  bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  { label: 'React', bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' },
];

/* ── Main component ── */
export default function Login() {
  const { login, register, user, error, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [selectedPortalId, setSelectedPortalId] = useState('student');
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [valErr, setValErr]         = useState('');
  const [showPw, setShowPw]         = useState(false);

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

  const handleQuickDemoLogin = async (portal) => {
    setSelectedPortalId(portal.id);
    setEmail(portal.email);
    setPassword(portal.password);
    setValErr('');
    
    const res = await login(portal.email, portal.password);
    if (res.success) {
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
      if (res.user.role === 'admin')        navigate('/dashboard/admin');
      else if (res.user.role === 'teacher') navigate('/dashboard/teacher');
      else if (res.user.role === 'parent')  navigate('/dashboard/parent');
      else navigate('/lms/dashboard');
    } else {
      // Fallback for student demo account registration if not existing
      if (portal.role === 'user') {
        const regRes = await register('Demo Student', portal.email, portal.password, 'user');
        if (regRes.success) {
          confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
          navigate('/lms/dashboard');
          return;
        }
      }
      setValErr(res.message || `Failed to log into ${portal.name}. Check your credentials.`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setValErr('');
    const res = await login(email, password);
    if (res.success) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (res.user.role === 'admin')        navigate('/dashboard/admin');
      else if (res.user.role === 'teacher') navigate('/dashboard/teacher');
      else if (res.user.role === 'parent')  navigate('/dashboard/parent');
      else navigate('/lms/dashboard');
    } else {
      // Auto-register fallback for demo student account if not present
      if (selectedPortalId === 'student' || email.trim().toLowerCase() === 'student@pranidha.edu') {
        const regRes = await register('Demo Student', email, password, 'user');
        if (regRes.success) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          navigate('/lms/dashboard');
          return;
        }
      }
      setValErr(res.message || 'Login failed. Check your credentials.');
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

  /* ── Colors ── */
  const pageBg   = isDark ? '#0f172a'              : '#f1f5f9';
  const cardBg   = isDark ? 'rgba(15,23,42,0.97)'  : '#ffffff';
  const cardBdr  = isDark ? 'rgba(255,255,255,0.07)': 'rgba(0,0,0,0.08)';
  const labelClr = isDark ? '#94a3b8'              : '#475569';
  const inputBg  = isDark ? 'rgba(2,6,23,0.55)'   : '#f8fafc';
  const inputClr = isDark ? '#f1f5f9'              : '#0f172a';
  const inputBdr = isDark ? 'rgba(255,255,255,0.1)': '#e2e8f0';
  const textClr  = isDark ? '#f1f5f9'              : '#0f172a';
  const mutedClr = isDark ? '#64748b'              : '#94a3b8';
  const accentA  = '#FF7043';
  const accentB  = '#f43f5e';

  const inp = {
    backgroundColor: inputBg, color: inputClr,
    border: `1.5px solid ${inputBdr}`, caretColor: accentA, transition: 'border-color .2s',
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10 px-4 transition-colors duration-500 font-quicksand relative"
         style={{ background: pageBg }}>

      {/* ── Home button ── */}
      <Link to="/"
        className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 z-20"
        style={{ background: `linear-gradient(135deg,${accentA},${accentB})`, color:'#fff', boxShadow:`0 4px 14px rgba(255,112,67,0.4)` }}>
        <Home className="w-3.5 h-3.5"/> Back to Home
      </Link>

      {/* ── Main Container Card ── */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
           style={{ border:`1px solid ${cardBdr}`, background: cardBg }}>

        {/* ════ LEFT PANEL ════ */}
        <div className="relative hidden md:flex flex-col items-center justify-between py-10 px-8 md:w-[38%] overflow-hidden"
             style={{ background:`linear-gradient(150deg,${accentA} 0%,${accentB} 100%)` }}>

          {/* Geometric decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full" style={{ background:'rgba(255,255,255,0.15)' }}/>
            <div className="absolute -bottom-24 -right-12 w-80 h-80 rounded-full" style={{ background:'rgba(255,255,255,0.10)' }}/>
            <svg viewBox="0 0 200 450" className="absolute inset-0 w-full h-full opacity-15">
              <polygon points="-40,450 130,0 170,0 30,450" fill="white"/>
              <polygon points="50,450 220,0 260,0 90,450" fill="white"/>
            </svg>
          </div>

          {/* Logo */}
          <Link to="/" className="relative z-10 flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background:'rgba(255,255,255,0.25)' }}>
              <Code2 className="w-5 h-5 text-white"/>
            </div>
            <span className="text-white font-black text-lg tracking-widest">APPLETREE</span>
          </Link>

          {/* Mode Switcher (Login / Register) */}
          <div className="relative z-10 flex flex-col items-center gap-4 w-full my-6">
            <div className="flex rounded-2xl overflow-hidden p-1" style={{ background:'rgba(255,255,255,0.2)' }}>
              {['LOGIN','SIGN UP'].map((t,i) => (
                <button key={t} onClick={() => { setIsRegister(i===1); setValErr(''); }}
                  className="px-6 py-2.5 text-sm font-black tracking-wider rounded-xl transition-all"
                  style={(!isRegister && i===0)||(isRegister && i===1)
                    ? { background:'#fff', color:'#111827', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }
                    : { background:'transparent', color:'rgba(255,255,255,0.85)' }}>
                  {t}
                </button>
              ))}
            </div>

            <p className="text-white/85 text-xs font-bold text-center max-w-[220px] leading-relaxed">
              {isRegister ? 'Join thousands of students learning to code' : 'Access your specialized school & learning portals'}
            </p>

            {/* Quick Demo Access Summary */}
            <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-white space-y-2 mt-2">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-white/80 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse"/> Available Portals
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                <div className="bg-white/15 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300"/> LMS Portal
                </div>
                <div className="bg-white/15 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-300"/> Parent
                </div>
                <div className="bg-white/15 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-300"/> Teacher
                </div>
                <div className="bg-white/15 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-300"/> Admin
                </div>
              </div>
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {TECH_BADGES.map(({ label }) => (
                <span key={label}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                  style={{ background:'rgba(255,255,255,0.92)', color:'#1e293b', border:'1.5px solid rgba(255,255,255,0.6)' }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-2 gap-2 w-full">
            {[['500+','Students'],['95%','Placement'],['4.9★','Rating'],['4 Portals','Active']].map(([v,l]) => (
              <div key={l} className="rounded-xl p-2.5 text-center" style={{ background:'rgba(255,255,255,0.18)' }}>
                <p className="text-white font-black text-sm leading-none">{v}</p>
                <p className="text-white/70 text-[9px] font-semibold uppercase tracking-wider mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="flex-1 flex flex-col relative py-8 px-6 md:px-10 overflow-hidden"
             style={{ background: cardBg }}>

          {/* Lamp — top right */}
          <div className="absolute top-0 right-5 z-20">
            <HangingLamp isDark={isDark} onToggle={toggleTheme}/>
          </div>

          {/* Mobile logo + home */}
          <div className="flex md:hidden items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background:`linear-gradient(135deg,${accentA},${accentB})` }}>
                <Code2 className="w-4 h-4 text-white"/>
              </div>
              <span className="font-black text-base tracking-wider" style={{ color: accentA }}>APPLETREE</span>
            </div>
            <Link to="/" className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background:`linear-gradient(135deg,${accentA},${accentB})`, color:'#fff' }}>
              <Home className="w-3 h-3"/> Home
            </Link>
          </div>

          {/* Header */}
          <div className="mb-4 pr-14">
            <AnimatePresence mode="wait">
              <motion.div key={isRegister?'r':'l'}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-8 }} transition={{ duration:0.22 }}>
                <h2 className="text-2xl md:text-3xl font-black" style={{ color: textClr }}>
                  {isRegister ? 'Create Account' : 'Welcome Back!'}
                </h2>
                <p className="mt-1 text-xs font-semibold" style={{ color: mutedClr }}>
                  {isRegister ? 'Sign up for a Student LMS account to start learning' : 'Select your portal or log in below to access your dashboard'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ════ PORTAL SELECTOR TABS ════ */}
          {!isRegister && (
            <div className="mb-5">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider mb-2" style={{ color: labelClr }}>
                Select Portal to Access
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PORTALS.map((portal) => {
                  const Icon = portal.icon;
                  const isSelected = selectedPortalId === portal.id;
                  return (
                    <button
                      key={portal.id}
                      type="button"
                      onClick={() => handleSelectPortal(portal)}
                      className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'shadow-md scale-[1.02]' 
                          : 'opacity-70 hover:opacity-100 hover:scale-[1.01]'
                      }`}
                      style={{
                        backgroundColor: isSelected 
                          ? (isDark ? 'rgba(30,41,59,0.9)' : '#ffffff') 
                          : (isDark ? 'rgba(15,23,42,0.4)' : '#f8fafc'),
                        borderColor: isSelected ? portal.accentColor : inputBdr,
                        boxShadow: isSelected ? `0 4px 14px ${portal.accentColor}33` : 'none'
                      }}
                    >
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white mb-1.5 transition-transform"
                        style={{ background: `linear-gradient(135deg, ${portal.accentColor}, ${portal.accentColor}cc)` }}
                      >
                        <Icon className="w-4 h-4"/>
                      </div>
                      <span className="text-xs font-bold text-center" style={{ color: textClr }}>
                        {portal.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: portal.accentColor }}/>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Portal Highlight & One-Click Demo Banner */}
              <div 
                className="mt-3 p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                style={{
                  backgroundColor: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(248,250,252,0.9)',
                  borderColor: `${selectedPortal.accentColor}40`
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${selectedPortal.accentColor}, ${accentB})` }}
                  >
                    <selectedPortal.icon className="w-5 h-5"/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black" style={{ color: textClr }}>{selectedPortal.name}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: selectedPortal.accentColor }}>
                        {selectedPortal.badge}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium leading-tight mt-0.5" style={{ color: mutedClr }}>
                      {selectedPortal.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedPortal)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-1.5 shrink-0 transition-all hover:scale-105 active:scale-95 shadow-sm"
                  style={{ 
                    background: `linear-gradient(135deg, ${selectedPortal.accentColor}, ${accentB})`,
                    boxShadow: `0 4px 12px ${selectedPortal.accentColor}40` 
                  }}
                >
                  <Zap className="w-3.5 h-3.5 fill-current"/>
                  <span>1-Click Demo Login</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {(valErr || error) && (
            <div className="mb-4 p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2"
                 style={{ background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.25)', color:'#fb7185' }}>
              <span>⚠️</span><span>{valErr || error}</span>
            </div>
          )}

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form key={isRegister?'rf':'lf'}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }} transition={{ duration:0.25 }}
              onSubmit={isRegister ? handleRegister : handleLogin}
              autoComplete="off"
              className="space-y-3.5 text-xs font-bold">

              {isRegister && (
                <div>
                  <label className="block mb-1.5 uppercase tracking-wider" style={{ color:labelClr }}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:mutedClr }}/>
                    <input type="text" required value={name} onChange={e=>setName(e.target.value)}
                      placeholder="Your full name"
                      autoComplete="off"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm font-semibold"
                      style={inp}
                      onFocus={e=>e.target.style.borderColor=accentA}
                      onBlur={e=>e.target.style.borderColor=inputBdr}/>
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-1.5 uppercase tracking-wider" style={{ color:labelClr }}>
                  Email Address {!isRegister && `(${selectedPortal.name})`}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:mutedClr }}/>
                  <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder={selectedPortal ? selectedPortal.email : "you@example.com"}
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm font-semibold"
                    style={inp}
                    onFocus={e=>e.target.style.borderColor=accentA}
                    onBlur={e=>e.target.style.borderColor=inputBdr}/>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider" style={{ color:labelClr }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:mutedClr }}/>
                  <input type={showPw?'text':'password'} required value={password} onChange={e=>setPassword(e.target.value)}
                    placeholder={isRegister ? 'At least 6 characters' : '••••••••'}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl outline-none text-sm font-semibold"
                    style={inp}
                    onFocus={e=>e.target.style.borderColor=accentA}
                    onBlur={e=>e.target.style.borderColor=inputBdr}/>
                  <button type="button" onClick={()=>setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color:mutedClr }}>
                    {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block mb-1.5 uppercase tracking-wider" style={{ color:labelClr }}>Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:mutedClr }}/>
                    <input type={showPw?'text':'password'} required value={confirm} onChange={e=>setConfirm(e.target.value)}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm font-semibold"
                      style={inp}
                      onFocus={e=>e.target.style.borderColor=accentA}
                      onBlur={e=>e.target.style.borderColor=inputBdr}/>
                  </div>
                </div>
              )}

              {!isRegister && (
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer" style={{ color:mutedClr }}>
                    <input type="checkbox" className="accent-orange-500 w-3.5 h-3.5"/> Remember me
                  </label>
                  <button type="button" className="hover:underline font-bold" style={{ color:accentA }}>
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button type="submit" disabled={loading}
                className="w-full py-3 font-extrabold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-white mt-1"
                style={{ background:`linear-gradient(135deg,${selectedPortal.accentColor || accentA},${accentB})`,
                         boxShadow:`0 8px 24px rgba(255,112,67,0.35)`,
                         opacity: loading ? 0.75 : 1 }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      <span>{isRegister?'CREATING ACCOUNT...':`LOGGING INTO ${selectedPortal.name.toUpperCase()}...`}</span></>
                  : <><span>{isRegister?'CREATE ACCOUNT':`LOGIN TO ${selectedPortal.name.toUpperCase()}`}</span><ArrowRight className="w-4 h-4"/></>
                }
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Quick Demo Login Grid for all portals */}
          {!isRegister && (
            <div className="mt-5 pt-4 border-t" style={{ borderColor: cardBdr }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: mutedClr }}>
                  ⚡ Quick Demo Access to All Portals
                </span>
                <span className="text-[10px] font-semibold" style={{ color: mutedClr }}>
                  Click to auto-login
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PORTALS.map((portal) => {
                  const Icon = portal.icon;
                  return (
                    <button
                      key={`quick-${portal.id}`}
                      type="button"
                      onClick={() => handleQuickDemoLogin(portal)}
                      className="flex items-center gap-2 p-2 rounded-xl border text-left transition-all hover:scale-[1.03] active:scale-95 group"
                      style={{
                        backgroundColor: isDark ? 'rgba(30,41,59,0.4)' : '#f8fafc',
                        borderColor: inputBdr
                      }}
                    >
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform"
                        style={{ backgroundColor: portal.accentColor }}
                      >
                        <Icon className="w-3.5 h-3.5"/>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-extrabold leading-tight truncate" style={{ color: textClr }}>
                          {portal.name}
                        </p>
                        <p className="text-[9px] font-semibold opacity-70 truncate" style={{ color: mutedClr }}>
                          {portal.role.toUpperCase()}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Switch login/register */}
          <p className="mt-4 text-center text-xs font-semibold" style={{ color:mutedClr }}>
            {isRegister ? 'Already have an account? ' : 'New to Appletree? '}
            <button onClick={()=>{ setIsRegister(!isRegister); setValErr(''); }}
              className="font-black hover:underline" style={{ color:accentA }}>
              {isRegister ? 'Log In to Portals' : 'Sign Up Free (Student)'}
            </button>
          </p>

          {/* Mobile — tech badges */}
          <div className="flex md:hidden flex-wrap gap-2 justify-center mt-4">
            {TECH_BADGES.map(({ label, bg, text, border }) => (
              <span key={label} className="text-[11px] font-bold px-3 py-1 rounded-full"
                style={{ background:bg, color:text, border:`1.5px solid ${border}` }}>
                {label}
              </span>
            ))}
          </div>

        </div>{/* end right panel */}
      </div>{/* end card */}
    </div>
  );
}
