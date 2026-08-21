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
    if (selectedPortalId === 'student')      navigate('/lms/dashboard');
    else if (selectedPortalId === 'parent')  navigate('/dashboard/parent');
    else if (selectedPortalId === 'teacher') navigate('/dashboard/teacher');
    else if (selectedPortalId === 'admin')   navigate('/dashboard/admin');
    else {
      if (user.role === 'admin')        navigate('/dashboard/admin');
      else if (user.role === 'teacher') navigate('/dashboard/teacher');
      else if (user.role === 'parent')  navigate('/dashboard/parent');
      else navigate('/lms/dashboard');
    }
  }, [user, navigate, selectedPortalId]);

  const handleSelectPortal = (portal) => {
    setSelectedPortalId(portal.id);
    setEmail(portal.email);
    setPassword(portal.password);
    setValErr('');
  };

  const handleQuickLogin = async (portal) => {
    setValErr('');
    setSelectedPortalId(portal.id);
    setEmail(portal.email);
    setPassword(portal.password);
    const res = await login(portal.email, portal.password);
    if (res.success) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (portal.id === 'student')      navigate('/lms/dashboard');
      else if (portal.id === 'parent')  navigate('/dashboard/parent');
      else if (portal.id === 'teacher') navigate('/dashboard/teacher');
      else if (portal.id === 'admin')   navigate('/dashboard/admin');
      else navigate('/lms/dashboard');
    } else {
      setValErr(res.message || `Quick login to ${portal.name} failed.`);
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
      setValErr(res.message || '1-Click Sign up failed.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setValErr('');
    const loginEmail = email.trim() || selectedPortal.email;
    const loginPass = password || selectedPortal.password;
    const res = await login(loginEmail, loginPass);
    if (res.success) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (selectedPortalId === 'student')      navigate('/lms/dashboard');
      else if (selectedPortalId === 'parent')  navigate('/dashboard/parent');
      else if (selectedPortalId === 'teacher') navigate('/dashboard/teacher');
      else if (selectedPortalId === 'admin')   navigate('/dashboard/admin');
      else {
        if (res.user.role === 'admin')        navigate('/dashboard/admin');
        else if (res.user.role === 'teacher') navigate('/dashboard/teacher');
        else if (res.user.role === 'parent')  navigate('/dashboard/parent');
        else navigate('/lms/dashboard');
      }
    } else {
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

  /* ── Wooden Shiny Luxury Theme Colors ── */
  const pageBg   = isDark 
    ? 'radial-gradient(ellipse at 50% 20%, #2e170e 0%, #150a05 55%, #080302 100%)'
    : 'radial-gradient(ellipse at 50% 20%, #452215 0%, #231008 55%, #0f0502 100%)';

  const cardBg   = 'linear-gradient(145deg, #2a130a 0%, #3d1c0f 30%, #4d2313 60%, #240f07 100%)';
  const cardBdr  = 'rgba(217, 119, 6, 0.45)';
  const labelClr = '#fed7aa';
  const inputBg  = 'rgba(18, 8, 4, 0.82)';
  const inputClr = '#fff7ed';
  const inputBdr = 'rgba(217, 119, 6, 0.35)';
  const textClr  = '#ffedd5';
  const mutedClr = '#fdba74';
  const accentA  = '#ea580c';
  const accentB  = '#c2410c';

  const inp = {
    backgroundColor: inputBg,
    color: inputClr,
    border: `1.5px solid ${inputBdr}`,
    caretColor: '#f59e0b',
    transition: 'all .25s ease',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10 px-4 transition-colors duration-500 font-quicksand relative"
         style={{ background: pageBg }}>

      {/* ── Home button ── */}
      <Link to="/"
        className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95 z-20 border border-amber-400/40 text-white"
        style={{
          background: 'linear-gradient(135deg, #ea580c, #9a3412)',
          boxShadow: '0 4px 14px rgba(234, 88, 12, 0.5), inset 0 1px 1px rgba(255,255,255,0.4)'
        }}>
        <Home className="w-3.5 h-3.5"/> Back to Home
      </Link>

      {/* ── Main Container Card: Wooden Shiny Finish ── */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col md:flex-row relative z-10"
           style={{
             border: `2px solid ${cardBdr}`,
             background: cardBg,
             boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 45px rgba(217, 119, 6, 0.2), inset 0 1px 2px rgba(255,255,255,0.25)'
           }}>

        {/* Shiny Gloss Luster Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0"
             style={{
               background: 'linear-gradient(115deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 30%, transparent 60%, rgba(245, 158, 11, 0.08) 100%)'
             }} />

        {/* ════ LEFT PANEL: Polished Shiny Cherry & Mahogany ════ */}
        <div className="relative hidden md:flex flex-col items-center justify-between py-10 px-8 md:w-[38%] overflow-hidden z-10 border-r border-amber-500/20"
             style={{
               background: 'linear-gradient(160deg, #7c2d12 0%, #9a3412 35%, #5c1e0b 70%, #361005 100%)',
               boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.5)'
             }}>

          {/* Shiny reflection highlights */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full"
                 style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)' }}/>
            <div className="absolute -bottom-24 -right-12 w-80 h-80 rounded-full"
                 style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)' }}/>
            <svg viewBox="0 0 200 450" className="absolute inset-0 w-full h-full opacity-20">
              <polygon points="-40,450 130,0 170,0 30,450" fill="white"/>
              <polygon points="50,450 220,0 260,0 90,450" fill="#fde047"/>
            </svg>
          </div>

          {/* Logo */}
          <Link to="/" className="relative z-10 flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-amber-300/40 shadow-inner"
                 style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(0,0,0,0.2))' }}>
              <Code2 className="w-5 h-5 text-amber-100"/>
            </div>
            <span className="text-amber-100 font-black text-lg tracking-widest drop-shadow-md">APPLETREE</span>
          </Link>

          {/* Mode Switcher (Login / Register) */}
          <div className="relative z-10 flex flex-col items-center gap-4 w-full my-6">
            <div className="flex rounded-2xl overflow-hidden p-1 border border-amber-300/30 shadow-inner"
                 style={{ background: 'rgba(0,0,0,0.35)' }}>
              {['LOGIN','SIGN UP'].map((t,i) => (
                <button key={t} onClick={() => { setIsRegister(i===1); setValErr(''); }}
                  className="px-6 py-2.5 text-sm font-black tracking-wider rounded-xl transition-all cursor-pointer"
                  style={(!isRegister && i===0)||(isRegister && i===1)
                    ? {
                        background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                        color: '#7c2d12',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.8)'
                      }
                    : { background: 'transparent', color: 'rgba(255,247,237,0.8)' }}>
                  {t}
                </button>
              ))}
            </div>

            <p className="text-amber-100 text-xs font-bold text-center max-w-[220px] leading-relaxed drop-shadow-sm">
              {isRegister ? 'Join thousands of students learning to code' : 'Access your specialized school & learning portals'}
            </p>

            {/* Quick Demo Access Summary */}
            <div className="w-full rounded-2xl p-3.5 border border-amber-400/30 text-white space-y-2 mt-2 shadow-lg"
                 style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-amber-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse"/> Available Portals
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                <div className="bg-white/10 border border-amber-300/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400"/> LMS Portal
                </div>
                <div className="bg-white/10 border border-amber-300/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400"/> Parent
                </div>
                <div className="bg-white/10 border border-amber-300/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400"/> Teacher
                </div>
                <div className="bg-white/10 border border-amber-300/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400"/> Admin
                </div>
              </div>
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {TECH_BADGES.map(({ label }) => (
                <span key={label}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,247,237,0.95), rgba(254,215,170,0.9))',
                    color: '#7c2d12',
                    border: '1.5px solid rgba(251,191,36,0.6)'
                  }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-2 gap-2 w-full">
            {[['500+','Students'],['95%','Placement'],['4.9★','Rating'],['4 Portals','Active']].map(([v,l]) => (
              <div key={l} className="rounded-xl p-2.5 text-center border border-amber-400/20"
                   style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
                <p className="text-amber-100 font-black text-sm leading-none drop-shadow">{v}</p>
                <p className="text-amber-300/80 text-[9px] font-bold uppercase tracking-wider mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ════ RIGHT PANEL: Warm Shiny Timber Inlay ════ */}
        <div className="flex-1 flex flex-col relative py-8 px-6 md:px-10 overflow-hidden z-10"
             style={{ background: 'transparent' }}>

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
                          ? 'scale-[1.03] shadow-lg' 
                          : 'opacity-75 hover:opacity-100 hover:scale-[1.01]'
                      }`}
                      style={{
                        background: isSelected 
                          ? 'linear-gradient(145deg, #3d1c0f, #220e06)' 
                          : 'linear-gradient(145deg, rgba(30,14,7,0.7), rgba(15,7,3,0.85))',
                        borderColor: isSelected ? '#f59e0b' : 'rgba(217, 119, 6, 0.3)',
                        boxShadow: isSelected 
                          ? '0 6px 18px rgba(245, 158, 11, 0.35), inset 0 1px 1px rgba(255,255,255,0.3)' 
                          : 'inset 0 1px 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white mb-1.5 transition-transform border border-amber-300/30"
                        style={{
                          background: isSelected 
                            ? `linear-gradient(135deg, ${portal.accentColor}, #d97706)` 
                            : 'rgba(255,255,255,0.1)',
                          boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.3)' : 'none'
                        }}
                      >
                        <Icon className="w-4 h-4 text-amber-100"/>
                      </div>
                      <span className="text-xs font-bold text-center text-amber-100 drop-shadow-sm">
                        {portal.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400"/>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Portal Highlight Banner */}
              <div 
                className="mt-3 p-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all shadow-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(40,18,10,0.85) 0%, rgba(25,11,6,0.95) 100%)',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)'
                }}
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 border border-amber-400/40 shadow"
                    style={{ background: `linear-gradient(135deg, ${selectedPortal.accentColor}, #b45309)` }}
                  >
                    <selectedPortal.icon className="w-5 h-5 text-amber-100"/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-100">{selectedPortal.name}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white border border-amber-300/30"
                            style={{ backgroundColor: selectedPortal.accentColor }}>
                        {selectedPortal.badge}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium leading-tight mt-0.5 text-amber-200/80">
                      {selectedPortal.description}
                    </p>
                  </div>
                </div>

                {/* 1-Click Instant Login Button */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin(selectedPortal)}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer border border-amber-300/50"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.5), inset 0 1px 1px rgba(255,255,255,0.5)'
                  }}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-100 fill-amber-100 animate-pulse"/>
                  <span>1-Click Login</span>
                </button>
              </div>
            </div>
          )}

          {/* 1-Click Student Sign Up Banner on Register Tab */}
          {isRegister && (
            <div className="mb-4 p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-md"
                 style={{
                   background: 'linear-gradient(135deg, rgba(40,18,10,0.85), rgba(25,11,6,0.95))',
                   borderColor: 'rgba(245, 158, 11, 0.4)'
                 }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm border border-amber-300/30">
                  <Sparkles className="w-4 h-4 text-amber-200"/>
                </div>
                <div>
                  <p className="text-xs font-black text-amber-100">Need Instant Access?</p>
                  <p className="text-[11px] text-amber-200/80 leading-tight">Create & launch your student account with 1 click</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickStudentSignUp}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-xl text-white font-extrabold text-xs shadow-md flex items-center gap-1 shrink-0 cursor-pointer transition-all border border-amber-300/40"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)'
                }}
              >
                <Zap className="w-3.5 h-3.5 text-white fill-white"/>
                <span>1-Click Signup</span>
              </button>
            </div>
          )}

          {/* Error Banner */}
          {(valErr || error) && (
            <div className="mb-4 p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2 shadow-inner"
                 style={{ background:'rgba(225,29,72,0.18)', border:'1.5px solid rgba(244,63,94,0.4)', color:'#fda4af' }}>
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
                      onFocus={e=>e.target.style.borderColor='#f59e0b'}
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
                    placeholder="you@example.com"
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm font-semibold"
                    style={inp}
                    onFocus={e=>e.target.style.borderColor='#f59e0b'}
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
                    onFocus={e=>e.target.style.borderColor='#f59e0b'}
                    onBlur={e=>e.target.style.borderColor=inputBdr}/>
                  <button type="button" onClick={()=>setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color:mutedClr }}>
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
                      onFocus={e=>e.target.style.borderColor='#f59e0b'}
                      onBlur={e=>e.target.style.borderColor=inputBdr}/>
                  </div>
                </div>
              )}

              {!isRegister && (
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer" style={{ color:mutedClr }}>
                    <input type="checkbox" className="accent-amber-500 w-3.5 h-3.5"/> Remember me
                  </label>
                  <button type="button" className="hover:underline font-bold text-amber-400">
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit button: Shiny Polished Lacquer CTA */}
              <button type="submit" disabled={loading}
                className="w-full py-3 font-extrabold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-white mt-1 cursor-pointer border border-amber-300/40"
                style={{
                  background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #9a3412 100%)',
                  boxShadow: '0 8px 24px rgba(234, 88, 12, 0.45), inset 0 1px 2px rgba(255,255,255,0.4)',
                  opacity: loading ? 0.75 : 1
                }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      <span>{isRegister ? 'CREATING ACCOUNT...' : `LOGGING INTO ${selectedPortal.name.toUpperCase()}...`}</span></>
                  : <><span>{isRegister ? 'CREATE ACCOUNT' : `LOGIN TO ${selectedPortal.name.toUpperCase()}`}</span><ArrowRight className="w-4 h-4"/></>
                }
              </button>
            </motion.form>
          </AnimatePresence>

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
