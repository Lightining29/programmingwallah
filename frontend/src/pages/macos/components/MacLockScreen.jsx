import React, { useState, useEffect } from 'react';
import { 
  Wifi, ArrowRight, Lock, User, Sparkles, Key, AlertCircle, 
  Eye, EyeOff, Power, RefreshCw, HelpCircle, Check, X 
} from 'lucide-react';
import macSound from '../services/sound.js';

export default function MacLockScreen({ 
  onUnlock, 
  currentUser, 
  wallpaperUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80' 
}) {
  const [time, setTime] = useState(new Date());
  const [users, setUsers] = useState([
    {
      id: 'usr_01net',
      username: '01net',
      displayName: '01net',
      avatarUrl: 'bulb',
      role: 'admin'
    },
    {
      id: 'usr_mirko',
      username: 'mirko',
      displayName: 'Mirko Roccia',
      avatarUrl: 'guitar',
      role: 'user'
    },
    {
      id: 'usr_developer',
      username: 'developer',
      displayName: 'AppleTree Developer',
      avatarUrl: 'code',
      role: 'admin'
    }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Rate limit countdown timer
  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const interval = setInterval(() => {
      setRateLimitSeconds(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitSeconds]);

  // Fetch accounts from backend
  useEffect(() => {
    fetch('/api/macos/auth/users')
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
          if (currentUser) {
            const match = data.users.find(u => u.username === currentUser.username);
            setSelectedUser(match || data.users[0]);
          } else {
            setSelectedUser(data.users[0]);
          }
        }
      })
      .catch(() => {
        if (currentUser) {
          setSelectedUser(currentUser);
        } else {
          setSelectedUser(users[0]);
        }
      });
  }, [currentUser]);

  const handleSelectAccount = (user) => {
    macSound.playPop();
    setSelectedUser(user);
    setPassword('');
    setErrorMessage('');
    setShowPassword(false);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!selectedUser || isSubmitting || rateLimitSeconds > 0) return;

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/macos/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: selectedUser.username,
          password: password.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        macSound.playPop();
        onUnlock(data.user, data.desktop);
      } else {
        macSound.playTink?.() || macSound.playClick?.();
        if (data.rateLimited && data.secondsLeft) {
          setRateLimitSeconds(data.secondsLeft);
        }
        setErrorMessage(data.message || 'Incorrect password. Please try again.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
      }
    } catch (err) {
      setErrorMessage('Authentication server unreachable. Please verify network connection.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShutdownSimulation = () => {
    setIsShuttingDown(true);
    macSound.playTrash?.();
    setTimeout(() => {
      window.location.href = '/';
    }, 2400);
  };

  // Format date: e.g. "Friday, October 30" or localized
  const formattedDay = time.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = `${formattedDay}, ${time.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  if (isShuttingDown) {
    return (
      <div className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center text-white select-none transition-all duration-700">
        <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-wide text-white/80">Shutting down macOS...</span>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[999999] flex flex-col justify-between items-center text-white select-none overflow-hidden bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${wallpaperUrl})` }}
    >
      {/* Background Dimmer / Glass Vignette */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] pointer-events-none" />

      {/* ── Top Status Bar ── */}
      <div className="relative z-10 w-full h-8 px-6 flex items-center justify-between text-xs font-medium text-white/90 drop-shadow">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wide"> macOS Sonoma 15.2</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-semibold tracking-wide">US English</span>
          <Wifi className="w-3.5 h-3.5 opacity-90" />
        </div>
      </div>

      {/* ── Center Clock (macOS Sonoma Style) ── */}
      <div className="relative z-10 flex flex-col items-center mt-6 sm:mt-10 text-center">
        <div className="text-base sm:text-lg font-medium text-white/90 tracking-wide drop-shadow-md">
          {formattedDate}
        </div>
        <div className="text-7xl sm:text-8xl md:text-9xl font-extralight tracking-tight text-white drop-shadow-lg select-none">
          {formattedTime}
        </div>
      </div>

      {/* ── Bottom Section: User Accounts or Password Input ── */}
      <div className="relative z-10 mb-12 sm:mb-16 flex flex-col items-center w-full max-w-sm px-4">
        {!selectedUser ? (
          /* Multi-User Account Avatar List */
          <div className="flex flex-col items-center space-y-3 w-full animate-in fade-in duration-200">
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => handleSelectAccount(u)}
                className="group w-full max-w-xs flex items-center gap-3.5 px-4 py-2.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-xl border border-white/20 transition-all duration-200 hover:scale-102 active:scale-95 shadow-xl cursor-pointer"
              >
                {/* Account Avatar */}
                <div className="relative w-11 h-11 rounded-full flex items-center justify-center text-xl shadow-md border border-white/30 overflow-hidden shrink-0">
                  {u.avatarUrl === 'bulb' ? (
                    <div className="w-full h-full bg-gradient-to-tr from-amber-400 to-orange-300 flex items-center justify-center text-amber-950 font-bold">
                      💡
                    </div>
                  ) : u.avatarUrl === 'guitar' ? (
                    <div className="w-full h-full bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white">
                      🎸
                    </div>
                  ) : u.avatarUrl === 'code' ? (
                    <div className="w-full h-full bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-white">
                      💻
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                      {u.displayName?.substring(0, 2).toUpperCase() || 'US'}
                    </div>
                  )}
                </div>

                <div className="text-left flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white drop-shadow leading-tight truncate">
                    {u.displayName || u.username}
                  </div>
                  <div className="text-[10px] text-white/60">
                    {u.role === 'admin' ? 'Administrator' : 'Standard User'}
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition" />
              </button>
            ))}

            <p className="text-[11px] text-white/60 pt-2 drop-shadow">
              Select an account to log into macOS
            </p>
          </div>
        ) : (
          /* Password Input Screen for Selected Account */
          <div className="flex flex-col items-center space-y-4 w-full animate-in fade-in zoom-in-95 duration-200">
            {/* Large User Avatar */}
            <div className="relative w-20 h-20 rounded-full shadow-2xl border-2 border-white/40 flex items-center justify-center text-4xl overflow-hidden">
              {selectedUser.avatarUrl === 'bulb' ? (
                <div className="w-full h-full bg-gradient-to-tr from-amber-400 to-orange-300 flex items-center justify-center text-amber-950">
                  💡
                </div>
              ) : selectedUser.avatarUrl === 'guitar' ? (
                <div className="w-full h-full bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white">
                  🎸
                </div>
              ) : selectedUser.avatarUrl === 'code' ? (
                <div className="w-full h-full bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-white text-3xl">
                  💻
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-2xl">
                  {selectedUser.displayName?.substring(0, 2).toUpperCase() || 'US'}
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white drop-shadow">
                {selectedUser.displayName || selectedUser.username}
              </h3>
              <p className="text-xs text-white/70">
                {selectedUser.role === 'admin' ? 'Administrator' : 'Standard User'}
              </p>
            </div>

            {/* Password Form with Shake Animation */}
            <form 
              onSubmit={handleLogin}
              className={`w-full max-w-xs flex flex-col items-center space-y-2.5 ${isShaking ? 'animate-bounce' : ''}`}
            >
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={rateLimitSeconds > 0 ? `Locked (${rateLimitSeconds}s)` : "Enter Password"}
                  disabled={rateLimitSeconds > 0 || isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full h-10 px-4 pr-16 rounded-full bg-black/40 backdrop-blur-2xl border border-white/30 text-white placeholder-white/50 text-xs outline-none focus:border-white/70 focus:ring-2 focus:ring-white/30 transition shadow-lg disabled:opacity-50"
                />
                
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-9 top-2.5 text-white/60 hover:text-white transition p-0.5 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>

                {/* Unlock Arrow Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || rateLimitSeconds > 0}
                  className="absolute right-1.5 top-1.5 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 border border-white/30 flex items-center justify-center transition active:scale-95 cursor-pointer disabled:opacity-30"
                  title="Unlock"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              </div>

              {errorMessage && (
                <div className="text-[11px] text-rose-300 font-medium drop-shadow flex items-center gap-1.5 px-3 py-1 bg-black/50 rounded-full border border-rose-500/30">
                  <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="text-white/70 hover:text-white transition drop-shadow hover:underline cursor-pointer"
                >
                  Switch User
                </button>
                <span className="text-white/30">•</span>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-white/70 hover:text-white transition drop-shadow hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Bottom Controls: Shutdown Simulation ── */}
        <div className="mt-8 flex items-center justify-center gap-6 text-white/70 text-xs">
          <button
            onClick={handleShutdownSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Shut Down Mac"
          >
            <Power className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[11px]">Shut Down</span>
          </button>
        </div>
      </div>

      {/* ── Forgot Password Dialog ── */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-[9999999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-white/20 p-5 shadow-2xl text-slate-100 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-sm font-bold flex items-center gap-2 text-amber-300">
                <Key className="w-4 h-4" /> Password Hint
              </span>
              <button 
                onClick={() => setShowForgotPassword(false)} 
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Default built-in accounts on this macOS workstation (<strong className="text-amber-300">01net</strong>, <strong className="text-amber-300">mirko</strong>, <strong className="text-amber-300">developer</strong>) are configured with the master development password:
            </p>
            <div className="p-2.5 rounded-xl bg-black/60 border border-amber-400/40 text-center font-mono text-sm font-bold text-amber-300 tracking-wider">
              password123
            </div>
            <button
              onClick={() => {
                setPassword('password123');
                setShowForgotPassword(false);
              }}
              className="w-full py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl text-xs font-bold text-white transition cursor-pointer"
            >
              Autofill and Return to Lock Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
