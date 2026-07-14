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

  // Inline styles to force visibility regardless of light/dark CSS overrides
  const inputStyle = {
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    color: '#f1f5f9',
    borderColor: 'rgba(255,255,255,0.08)',
    caretColor: '#FF7043',
  };

  const inputFocusClass = "w-full pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all font-semibold text-sm";
  const inputFocusClassPr12 = "w-full pl-12 pr-12 py-3.5 rounded-2xl outline-none transition-all font-semibold text-sm";

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 overflow-x-hidden relative font-quicksand select-none"
      style={{ background: 'linear-gradient(145deg, #020617 0%, #111827 45%, #172554 100%)', color: '#f1f5f9' }}
    >
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute left-[8%] top-[15%] hidden md:block animate-bounce" style={{ animationDuration: '6s' }}>
        <div className="relative w-24 h-8 bg-white rounded-full shadow-[0_8px_16px_rgba(159,146,236,0.2),inset_0_4px_8px_white]">
          <div className="absolute -top-6 left-4 w-12 h-12 bg-white rounded-full shadow-[inset_0_4px_8px_white]"></div>
          <div className="absolute -top-4 left-10 w-10 h-10 bg-white rounded-full shadow-[inset_0_4px_8px_white]"></div>
        </div>
      </div>

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
          <Link to="/" className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl mb-4 hover:opacity-80 transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-xl">🧸</span>
            <span className="text-sm font-black tracking-widest" style={{ color: '#FF7043' }}>APPLETREE</span>
          </Link>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-2" style={{ color: '#ffffff' }}>
            {isRegister ? 'Join our Classroom' : 'Welcome Back!'}
          </h2>
          <p className="text-xs font-bold mt-2 uppercase tracking-widest" style={{ color: '#94a3b8' }}>
            {isRegister ? 'Create an account to start learning online' : 'Log in to access your course files'}
          </p>
        </div>

        {/* Input Form Card */}
        <div className="rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)' }}>
          
          {/* Top category tags */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandCoral via-brandSky to-brandMint" />

          {/* Validation Errors */}
          {(validationError || error) && (
            <div className="mb-6 p-4 rounded-2xl text-xs font-bold flex items-start space-x-2" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185' }}>
              <span>⚠️</span>
              <span>{validationError || error}</span>
            </div>
          )}

          {/* FORM WRAPPER */}
          {isRegister ? (
            // REGISTRATION FORM
            <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs font-bold">
              <div>
                <label className="block mb-2" style={{ color: '#94a3b8' }}>FULL NAME</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={inputFocusClass}
                    style={{ ...inputStyle }}
                    onFocus={(e) => e.target.style.borderColor = '#FF7043'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#94a3b8' }}>EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className={inputFocusClass}
                    style={{ ...inputStyle }}
                    onFocus={(e) => e.target.style.borderColor = '#FF7043'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#94a3b8' }}>PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className={inputFocusClassPr12}
                    style={{ ...inputStyle }}
                    onFocus={(e) => e.target.style.borderColor = '#FF7043'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 outline-none"
                    style={{ color: '#64748b' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#94a3b8' }}>CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={inputFocusClassPr12}
                    style={{ ...inputStyle }}
                    onFocus={(e) => e.target.style.borderColor = '#FF7043'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 font-extrabold tracking-wider rounded-2xl transition-all shadow-lg flex items-center justify-center space-x-2"
                style={{ backgroundColor: '#FF7043', color: '#ffffff' }}
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
                <label className="block mb-2" style={{ color: '#94a3b8' }}>EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@appletree.com"
                    className={inputFocusClass}
                    style={{ ...inputStyle }}
                    onFocus={(e) => e.target.style.borderColor = '#FF7043'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ color: '#94a3b8' }}>PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputFocusClassPr12}
                    style={{ ...inputStyle }}
                    onFocus={(e) => e.target.style.borderColor = '#FF7043'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 outline-none"
                    style={{ color: '#64748b' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 font-extrabold tracking-wider rounded-2xl transition-all shadow-lg flex items-center justify-center space-x-2"
                style={{ backgroundColor: '#FF7043', color: '#ffffff' }}
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
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full flex items-center justify-between text-[10px] font-black tracking-widest uppercase hover:underline"
                style={{ color: '#FF7043' }}
              >
                <span>Demo User Accounts</span>
                <span>{showCredentials ? '▲' : '▼'}</span>
              </button>
              {showCredentials && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] p-3 rounded-2xl" style={{ backgroundColor: 'rgba(2, 6, 23, 0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin@pranidha.edu', 'admin123')}
                    className="p-1.5 rounded-lg text-left transition-all hover:opacity-80"
                    style={{ border: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0' }}
                  >
                    🏢 Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('teacher@pranidha.edu', 'teacher123')}
                    className="p-1.5 rounded-lg text-left transition-all hover:opacity-80"
                    style={{ border: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0' }}
                  >
                    👩‍🏫 Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('parent@pranidha.edu', 'parent123')}
                    className="p-1.5 rounded-lg text-left transition-all hover:opacity-80"
                    style={{ border: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0' }}
                  >
                    🧸 Parent
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Toggle Page link */}
        <div className="text-center mt-6 text-xs font-bold" style={{ color: '#94a3b8' }}>
          {isRegister ? (
            <p>
              Already have a classroom account?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setValidationError('');
                }}
                style={{ color: '#FF7043' }}
                className="hover:underline"
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
                style={{ color: '#FF7043' }}
                className="hover:underline"
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
