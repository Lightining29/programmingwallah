import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Lock, Eye, EyeOff, Mail, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Login() {
  const { login, register, user, error, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dual page toggle — defaults to register if ?register=true is in URL
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (user.role === 'admin') navigate('/dashboard/admin');
      else if (user.role === 'teacher') navigate('/dashboard/teacher');
      else if (user.role === 'parent') navigate('/dashboard/parent');
      else navigate('/lms/dashboard'); // Redirect online student users to their learning dashboard
    }
  }, [user, navigate]);

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
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
      else navigate('/lms/dashboard');
    } else {
      setValidationError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setValidationError('Please enter your email');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const res = await register(name, email, password, 'user');
    if (res.success) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      navigate('/lms/dashboard');
    } else {
      setValidationError(res.message || 'Registration failed. Email might already be in use.');
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

      {/* Main container card */}
      <div className="w-full max-w-[450px] relative z-10">
        
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mb-4 hover:bg-white/10 transition-all">
            <span className="text-xl">🧸</span>
            <span className="text-sm font-black tracking-widest text-[#FF7043]">APPLETREE</span>
          </Link>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-2">
            {isRegister ? 'Join our Classroom' : 'Welcome Back!'}
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
            {isRegister ? 'Create an account to start learning online' : 'Log in to access your course files'}
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-white border-opacity-5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Top category tags */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandCoral via-brandSky to-brandMint" />

          {/* Validation Errors */}
          {(validationError || error) && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-bold text-rose-400 flex items-start space-x-2">
              <span>⚠️</span>
              <span>{validationError || error}</span>
            </div>
          )}

          {/* FORM WRAPPER */}
          {isRegister ? (
            // REGISTRATION FORM
            <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs font-bold">
              <div>
                <label className="block text-slate-400 mb-2">FULL NAME</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/40 border border-white border-opacity-5 rounded-2xl text-white outline-none focus:border-[#FF7043] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-2">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/40 border border-white border-opacity-5 rounded-2xl text-white outline-none focus:border-[#FF7043] transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-2">PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-950/40 border border-white border-opacity-5 rounded-2xl text-white outline-none focus:border-[#FF7043] transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-[#FF7043] outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-2">CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-950/40 border border-white border-opacity-5 rounded-2xl text-white outline-none focus:border-[#FF7043] transition-all font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#FF7043] hover:bg-orange-600 text-white font-extrabold tracking-wider rounded-2xl transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>CREATING ACCOUNT...</span>
                  </>
                ) : (
                  <>
                    <span>REGISTER ONLINE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            // LOGIN FORM
            <form onSubmit={handleLoginSubmit} className="space-y-5 text-xs font-bold">
              <div>
                <label className="block text-slate-400 mb-2">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@appletree.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/40 border border-white border-opacity-5 rounded-2xl text-white outline-none focus:border-[#FF7043] transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-2">PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-950/40 border border-white border-opacity-5 rounded-2xl text-white outline-none focus:border-[#FF7043] transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-[#FF7043] outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#FF7043] hover:bg-orange-600 text-white font-extrabold tracking-wider rounded-2xl transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>LOGGING IN...</span>
                  </>
                ) : (
                  <>
                    <span>SECURE LOG IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Creds fill dropdown (Only for logins, hidden in registration) */}
          {!isRegister && (
            <div className="mt-6 border-t border-white border-opacity-5 pt-4">
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full flex items-center justify-between text-[10px] font-black tracking-widest text-[#FF7043] hover:underline uppercase"
              >
                <span>Demo User Accounts</span>
                <span>{showCredentials ? '▲' : '▼'}</span>
              </button>
              {showCredentials && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] bg-slate-950/30 p-3 rounded-2xl border border-white border-opacity-5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin@appletree.com', 'admin123')}
                    className="p-1.5 hover:bg-white/5 border border-white/5 rounded-lg text-left"
                  >
                    🏢 Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('teacher@appletree.com', 'teacher123')}
                    className="p-1.5 hover:bg-white/5 border border-white/5 rounded-lg text-left"
                  >
                    👩‍🏫 Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('parent@appletree.com', 'parent123')}
                    className="p-1.5 hover:bg-white/5 border border-white/5 rounded-lg text-left"
                  >
                    🧸 Parent
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Toggle Page link */}
        <div className="text-center mt-6 text-xs font-bold text-slate-400">
          {isRegister ? (
            <p>
              Already have a classroom account?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setValidationError('');
                }}
                className="text-[#FF7043] hover:underline"
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Looking to join online courses?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setValidationError('');
                }}
                className="text-[#FF7043] hover:underline"
              >
                Sign Up for Free
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
