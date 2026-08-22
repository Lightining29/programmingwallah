import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Menu, X, LogOut, LayoutDashboard, LogIn, UserPlus, BookOpen, Sparkles, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from './ConfirmModal.jsx';
import Logo from './Logo.jsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'COURSES', path: '/programs' },
    { name: 'TUTORIALS', path: '/tutorials' },
    { name: 'PRACTICE', path: '/practice' },
    { name: 'MUSIC', path: '/music' },
    { name: 'GAMES', path: '/games' },
    { name: 'LEARNING', path: '/lms' },
    { name: 'MEETINGS', path: '/meetings' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'CONTACT', path: '/contact' }
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'teacher') return '/dashboard/teacher';
    if (user.role === 'parent') return '/dashboard/parent';
    return '/dashboard/student'; // 'user' or 'student' role → student portal
  };

  return (
    <nav className={`sticky top-0 z-50 border-b px-4 py-3.5 backdrop-blur-2xl transition-colors duration-300 select-none print:hidden md:px-8 ${
      isDark
        ? 'border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.96))] shadow-[0_12px_35px_rgba(2,6,23,0.65),0_0_0_1px_rgba(148,163,184,0.08)]'
        : 'border-orange-100 bg-white/85 shadow-[0_12px_35px_rgba(15,23,42,0.08),0_0_0_1px_rgba(148,163,184,0.06)]'
    }`}>
      <div className="relative flex items-center justify-between mx-auto max-w-7xl">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
         
          <div>
            <span className="text-[15px] font-extrabold font-quicksand block leading-none">
              <span className="text-[#E53935]">Apple</span>
              <span className="text-[#2E7D32]">Tree</span>
            </span>
            <p className="mt-[2px] text-[15px] font-black tracking-tight text-black dark:text-white leading-none">INFOTECH</p>
          </div>
        </Link>

        {/* Desktop Links (Clean list with sliding active underline) */}
        <div className="items-center hidden space-x-5 lg:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`font-quicksand font-extrabold text-xs tracking-wider relative py-1 transition-colors duration-200 hover:text-brandCoral ${isActive ? 'text-brandCoral' : isDark ? 'text-slate-200' : 'text-slate-600'
                  }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-gradient-to-r from-brandCoral to-brandSky"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons + Theme Toggle */}
        <div className="items-center hidden space-x-3 lg:flex">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all cursor-pointer ${
              isDark
                ? 'border-white/15 bg-white/10 text-amber-300 hover:bg-white/20'
                : 'border-orange-200 bg-brandCream text-slate-600 hover:bg-orange-100/40'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                className={`flex items-center space-x-1.5 font-quicksand font-bold text-xs rounded-full border px-5 py-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                  isDark
                    ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100 shadow-[0_10px_24px_rgba(56,189,248,0.12)] hover:bg-cyan-400/20'
                    : 'border-brandSky/30 bg-brandSky/10 text-brandSky-dark shadow-sm hover:bg-brandSky/20'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>DASHBOARD</span>
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`flex items-center space-x-1.5 font-quicksand font-bold text-xs rounded-full border px-5 py-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                  isDark
                    ? 'border-rose-400/20 bg-rose-400/10 text-rose-100 shadow-[0_10px_24px_rgba(251,113,133,0.12)] hover:bg-rose-400/20'
                    : 'border-brandCoral/30 bg-brandCoral/10 text-brandCoral-dark shadow-sm hover:bg-brandCoral/20'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>LOGOUT</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`flex items-center space-x-1.5 font-quicksand font-bold text-xs rounded-full border px-5 py-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer text-center ${
                  isDark
                    ? 'border-indigo-400/20 bg-indigo-400/10 text-indigo-100 shadow-[0_10px_24px_rgba(129,140,248,0.12)] hover:bg-indigo-400/20'
                    : 'border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm hover:bg-indigo-100'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>LOGIN</span>
              </Link>
              <Link
                to="/login?register=true"
                className={`font-quicksand font-bold text-xs rounded-full border px-5 py-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center space-x-1.5 ${
                  isDark
                    ? 'border-amber-400/20 bg-amber-400/10 text-amber-100 shadow-[0_10px_24px_rgba(251,191,36,0.12)] hover:bg-amber-400/20'
                    : 'border-brandCoral/30 bg-brandCoral/10 text-brandCoral shadow-sm hover:bg-brandCoral/20'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>SIGN UP FREE</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`p-2 transition-all border rounded-full outline-none cursor-pointer lg:hidden ${isDark ? 'text-slate-100 hover:bg-white/10 border-white/10 bg-white/5' : 'text-slate-700 hover:bg-slate-100 border-orange-200 bg-white'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-Out Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm lg:hidden"
            />

            {/* Sidebar Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[310px] max-w-[88vw] bg-[#10141d]/98 border-l border-slate-850 shadow-[-15px_0_40px_rgba(0,0,0,0.5)] p-5 flex flex-col justify-between overflow-y-auto text-white lg:hidden"
            >
              <div className="space-y-5">
                {/* Header with Logo & Close */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-500 to-emerald-500 flex items-center justify-center text-white text-xs font-black">
                      A
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-tight text-white block leading-none">
                        <span className="text-[#ef4444]">Apple</span>
                        <span className="text-[#22c55e]">Tree</span>
                      </span>
                      <span className="text-[9px] font-extrabold text-slate-400 tracking-wider block">INFOTECH</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Theme Mode Toggle Pill */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between py-2 px-3.5 rounded-2xl bg-[#1a202c] border border-slate-700/60 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">Theme</span>
                </button>

                {/* Navigation Links */}
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase px-2 block mb-1">
                    Navigation
                  </span>
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between font-quicksand font-bold text-xs py-2.5 px-3.5 rounded-2xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <span>{link.name}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Access Actions */}
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
                {user ? (
                  <>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-500/25 transition-all shadow-sm"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>OPEN DASHBOARD</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold text-xs hover:bg-rose-500/20 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>SIGN OUT</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#1e2330] hover:bg-[#252b3b] border border-slate-700 text-white font-bold text-xs transition-all shadow-sm"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>LOGIN TO LMS</span>
                    </Link>
                    <Link
                      to="/login?register=true"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>GET STARTED FREE</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Confirm to Logout"
        message="Are you sure you want to log out of your Appletree account?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Log Out"
        type="logout"
      />
    </nav>
  );
}



