import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Lock, Eye, EyeOff, Heart, ChevronDown, ChevronUp, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Login() {
  const { login, user, error, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (user.role === 'admin') navigate('/dashboard/admin');
      else if (user.role === 'teacher') navigate('/dashboard/teacher');
      else if (user.role === 'parent') navigate('/dashboard/parent');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    const res = await login(email, password);
    if (res.success) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (res.user.role === 'admin') navigate('/dashboard/admin');
      else if (res.user.role === 'teacher') navigate('/dashboard/teacher');
      else if (res.user.role === 'parent') navigate('/dashboard/parent');
    }
  };

  const handleQuickFill = (fillEmail, fillPassword) => {
    setEmail(fillEmail);
    setPassword(fillPassword);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 bg-[linear-gradient(145deg,#020617_0%,#111827_45%,#172554_100%)] overflow-x-hidden relative font-quicksand select-none text-white">
      
      {/* BACKGROUND DECORATIONS (Clay style clouds & plants) */}
      {/* Cloud Left */}
      <div className="absolute left-[8%] top-[15%] hidden md:block animate-bounce" style={{ animationDuration: '6s' }}>
        <div className="relative w-24 h-8 bg-white rounded-full shadow-[0_8px_16px_rgba(159,146,236,0.2),inset_0_4px_8px_white]">
          <div className="absolute -top-6 left-4 w-12 h-12 bg-white rounded-full shadow-[inset_0_4px_8px_white]"></div>
          <div className="absolute -top-4 left-10 w-10 h-10 bg-white rounded-full shadow-[inset_0_4px_8px_white]"></div>
        </div>
      </div>

      {/* Cloud Right */}
      <div className="absolute right-[8%] top-[30%] hidden md:block animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }}>
        <div className="relative w-28 h-9 bg-white rounded-full shadow-[0_8px_16px_rgba(159,146,236,0.2),inset_0_4px_8px_white]">
          <div className="absolute -top-6 left-6 w-14 h-14 bg-white rounded-full shadow-[inset_0_4px_8px_white]"></div>
          <div className="absolute -top-4 left-14 w-10 h-10 bg-white rounded-full shadow-[inset_0_4px_8px_white]"></div>
        </div>
      </div>

      {/* Left Potted Plant (SVG/CSS shapes) */}
      <div className="absolute left-[10%] bottom-[12%] hidden xl:flex flex-col items-center select-none pointer-events-none">
        <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_12px_15px_rgba(0,0,0,0.06)]">
          <path d="M60 200 V110" stroke="#8BC34A" strokeWidth="8" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M60 110 C50 80 50 40 60 20 C70 40 70 80 60 110 Z" fill="#8BC34A" />
          <path d="M60 145 C35 135 15 115 10 95 C25 95 50 115 60 145 Z" fill="#9CCC65" />
          <path d="M60 155 C85 145 105 125 110 105 C95 105 70 125 60 155 Z" fill="#7CB342" />
          <path d="M60 178 C40 168 25 155 20 140 C35 140 50 155 60 178 Z" fill="#9CCC65" />
        </svg>
        <div className="w-24 h-18 bg-[#D7A283] rounded-b-[2rem] rounded-t-md shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.12),inset_6px_6px_12px_rgba(255,255,255,0.4),0_12px_16px_rgba(91,70,140,0.12)]"></div>
      </div>

      {/* Right Potted Flower (SVG/CSS shapes) */}
      <div className="absolute right-[10%] bottom-[12%] hidden xl:flex flex-col items-center select-none pointer-events-none">
        <svg width="100" height="180" viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_12px_15px_rgba(0,0,0,0.06)]">
          <path d="M50 180 V95" stroke="#8BC34A" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 135 C35 130 30 120 25 115 C35 115 45 125 50 135 Z" fill="#7CB342" />
          {/* Daisy Petals */}
          <circle cx="50" cy="55" r="14" fill="#F48FB1" />
          <circle cx="50" cy="79" r="14" fill="#F48FB1" />
          <circle cx="38" cy="67" r="14" fill="#F48FB1" />
          <circle cx="62" cy="67" r="14" fill="#F48FB1" />
          <circle cx="41" cy="58" r="14" fill="#F48FB1" />
          <circle cx="59" cy="76" r="14" fill="#F48FB1" />
          <circle cx="41" cy="76" r="14" fill="#F48FB1" />
          <circle cx="59" cy="58" r="14" fill="#F48FB1" />
          {/* Flower Center */}
          <circle cx="50" cy="67" r="12" fill="#FFE082" />
        </svg>
        <div className="w-22 h-16 bg-[#F8BBD0] rounded-b-[1.75rem] rounded-t-md shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.1),inset_5px_5px_10px_rgba(255,255,255,0.4),0_10px_14px_rgba(91,70,140,0.1)]"></div>
      </div>


      {/* MAIN PHONE FRAME CONTAINER */}
      <div className="w-full max-w-[420px] bg-slate-900/90 border border-cyan-400/15 rounded-[3.5rem] p-6 pt-8 pb-7 flex flex-col items-center relative z-10 shadow-[0_30px_60px_-15px_rgba(8,47,73,0.35)] backdrop-blur-xl">
        
        {/* Pink Clay Heart */}
        <div className="w-10 h-10 flex items-center justify-center bg-cyan-400/10 text-cyan-200 rounded-full shadow-[0_8px_18px_rgba(56,189,248,0.18)] mb-4 border border-cyan-400/20">
          <Heart className="w-5 h-5 fill-current" />
        </div>

        {/* Title */}
        <div className="relative text-center">
          <span className="absolute text-lg font-bold text-yellow-400 select-none -left-6 top-1 animate-pulse">✨</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-quicksand">
            Welcome Back
          </h2>
          <span className="absolute text-lg font-bold text-yellow-400 select-none -right-6 top-1 animate-pulse">✨</span>
        </div>
<p className="mt-1 mb-2 text-xs font-semibold text-slate-300">Login to continue your journey</p>

        {/* Peeking Mascot Overlay */}
        <div className="relative z-10 w-48 h-48 transition-transform duration-300 pointer-events-none -mb-14 hover:scale-105">
          <img
            src="/clay_mascot.png"
            alt="Cute Teddy Bear Mascot"
            className="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(91,70,140,0.18)]"
          />
        </div>

        {/* INNER FORM CARD (Overlap by Mascot) */}
        <div className="w-full bg-slate-950/90 rounded-[2.5rem] p-6 pt-16 pb-6 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.65)] border border-cyan-400/10 relative z-0 flex flex-col space-y-4">
          
          {/* Error display */}
          {(error || validationError) && (
            <div className="bg-rose-500/10 border border-rose-400/30 text-rose-100 text-[10px] font-bold p-3 rounded-2xl shadow-inner text-center animate-pulse">
              {error || validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-300 tracking-wider uppercase pl-2">Email or Username</label>
              <div className="flex items-center bg-slate-900/90 border border-slate-700 focus-within:border-cyan-400/40 rounded-2xl p-1.5 transition-all duration-200 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08)]">
                <div className="w-9 h-9 rounded-full bg-cyan-400/10 text-cyan-200 flex items-center justify-center shadow-[inset_1.5px_1.5px_2px_rgba(255,255,255,0.04)] shrink-0">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Student@gmail.com"
                  className="flex-1 px-3 py-2 text-xs font-semibold bg-transparent outline-none text-slate-100 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-300 tracking-wider uppercase pl-2">Password</label>
              <div className="flex items-center bg-slate-900/90 border border-slate-700 focus-within:border-cyan-400/40 rounded-2xl p-1.5 transition-all duration-200 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08)]">
                <div className="w-9 h-9 rounded-full bg-cyan-400/10 text-cyan-200 flex items-center justify-center shadow-[inset_1.5px_1.5px_2px_rgba(255,255,255,0.04)] shrink-0">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 px-3 py-2 text-xs font-semibold bg-transparent outline-none text-slate-100 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 transition-colors outline-none text-slate-300 hover:text-cyan-200 shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] font-bold text-cyan-200 hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-quicksand font-bold text-sm shadow-[0_10px_18px_rgba(56,189,248,0.18)] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 select-none cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          {/* Social separator */}
          <div className="flex items-center justify-center">
            <div className="h-[2px] bg-[#FAF9F5] flex-1"></div>
            <span className="text-[10px] font-bold text-slate-300 px-3">or continue with</span>
            <div className="h-[2px] bg-[#FAF9F5] flex-1"></div>
          </div>

          {/* Social Login circles */}
          <div className="flex justify-center space-x-4">
            <div className="w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center shadow-[0_6px_12px_rgba(2,6,23,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
            </div>
            <div className="w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center shadow-[0_6px_12px_rgba(2,6,23,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <svg className="w-5 h-5 fill-slate-100" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.62.72-1.16 1.87-1.02 2.98 1.12.09 2.26-.56 2.97-1.42z" />
              </svg>
            </div>
            <div className="w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center shadow-[0_6px_12px_rgba(2,6,23,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer">
              <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-300 font-semibold mt-2">
            Don't have an account? <span className="cursor-pointer text-cyan-200 hover:underline">Sign Up</span>
          </p>
        </div>

      </div>


      {/* QUICK TESTING CREDENTIALS SLIDEOUT PANEL */}
      <div className="w-full max-w-[420px] mt-6 relative z-10">
        <div className="bg-slate-900/90 border border-cyan-400/10 rounded-3xl p-4 shadow-[0_10px_25px_-5px_rgba(8,47,73,0.30)] backdrop-blur-xl">
          
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="flex items-center justify-between w-full transition-colors outline-none cursor-pointer text-slate-100 hover:text-cyan-100"
          >
            <div className="flex items-center space-x-2 text-xs font-bold">
              <Info className="w-4 h-4 text-cyan-300" />
              <span>Quick Testing Credentials</span>
            </div>
            {showCredentials ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <p className="text-[10px] text-slate-300 mt-1 leading-relaxed pl-6">
            Click any account below to instantly fill in details for fast testing.
          </p>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              showCredentials ? 'max-h-[350px] opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 gap-2.5 pl-2">
              
              {/* Admin */}
              <button
                type="button"
                onClick={() => handleQuickFill('admin@pranidha.edu', 'admin123')}
                className="w-full text-left bg-slate-800/90 hover:bg-slate-700/90 active:scale-[0.99] border border-slate-700 p-2.5 rounded-2xl shadow-[0_4px_10px_rgba(2,6,23,0.25)] transition-all flex items-start justify-between cursor-pointer"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-100">1. School Admin Portal</span>
                  <span className="text-[10px] text-slate-300 block">Email: admin@pranidha.edu</span>
                  <span className="text-[10px] text-slate-300 block">Password: admin123</span>
                </div>
                <span className="bg-cyan-400/10 text-cyan-100 text-[9px] font-bold px-2 py-1 rounded-lg border border-cyan-400/20">Fill</span>
              </button>

              {/* Parent */}
              <button
                type="button"
                onClick={() => handleQuickFill('parent@pranidha.edu', 'parent123')}
                className="w-full text-left bg-slate-800/90 hover:bg-slate-700/90 active:scale-[0.99] border border-slate-700 p-2.5 rounded-2xl shadow-[0_4px_10px_rgba(2,6,23,0.25)] transition-all flex items-start justify-between cursor-pointer"
              >
                <div>
                  <span className="block text-xs font-bold text-amber-100">2. Parent Portal Hub</span>
                  <span className="text-[10px] text-slate-300 block">Email: parent@pranidha.edu</span>
                  <span className="text-[10px] text-slate-300 block">Password: parent123</span>
                </div>
                <span className="bg-amber-400/10 text-amber-100 text-[9px] font-bold px-2 py-1 rounded-lg border border-amber-400/20">Fill</span>
              </button>

              {/* Teacher */}
              <button
                type="button"
                onClick={() => handleQuickFill('teacher@pranidha.edu', 'teacher123')}
                className="w-full text-left bg-slate-800/90 hover:bg-slate-700/90 active:scale-[0.99] border border-slate-700 p-2.5 rounded-2xl shadow-[0_4px_10px_rgba(2,6,23,0.25)] transition-all flex items-start justify-between cursor-pointer"
              >
                <div>
                  <span className="block text-xs font-bold text-sky-100">3. Teacher Portal Hub</span>
                  <span className="text-[10px] text-slate-300 block">Email: teacher@pranidha.edu</span>
                  <span className="text-[10px] text-slate-300 block">Password: teacher123</span>
                </div>
                <span className="bg-sky-400/10 text-sky-100 text-[9px] font-bold px-2 py-1 rounded-lg border border-sky-400/20">Fill</span>
              </button>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

