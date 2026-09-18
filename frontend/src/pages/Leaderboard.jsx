import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, Medal, Award, Search, Filter, RefreshCw, 
  ExternalLink, GraduationCap, CheckCircle2, Star, Sparkles,
  ChevronRight, ArrowUpRight, Flame, ShieldCheck, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [podium, setPodium] = useState({ first: null, second: null, third: null });
  const [rankwise, setRankwise] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({ totalPassed: 0, topScore: 0, avgScore: 0, uniqueColleges: 0 });

  // Filters
  const [selectedAssessment, setSelectedAssessment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedAssessment]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const url = selectedAssessment === 'all'
        ? '/api/assessment/leaderboard'
        : `/api/assessment/leaderboard?assessmentId=${encodeURIComponent(selectedAssessment)}`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to load leaderboard data');

      setLeaderboard(data.leaderboard || []);
      setPodium(data.podium || { first: null, second: null, third: null });
      setRankwise(data.rankwise || []);
      setAssessments(data.assessments || []);
      setStats(data.stats || { totalPassed: 0, topScore: 0, avgScore: 0, uniqueColleges: 0 });
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered rankwise list based on search term
  const filteredRankwise = rankwise.filter(student => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      (student.candidateName || '').toLowerCase().includes(q) ||
      (student.college || '').toLowerCase().includes(q) ||
      (student.assessmentTitle || '').toLowerCase().includes(q) ||
      (student.rollNo || '').toLowerCase().includes(q)
    );
  });

  const getInitials = (name) => {
    if (!name) return 'PW';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Background Ambience & Spotlights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute top-[10%] right-[15%] w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[160px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        
        {/* ─── Hero Header ──────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-amber-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Official Hall of Fame & Rankings
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4"
          >
            ProgrammingWala{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Celebrating verified high scorers and certified engineering candidates who aced our technical examination challenges.
          </motion.p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-semibold mb-0.5 flex items-center justify-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                Certified Rankers
              </div>
              <div className="text-2xl font-black text-white">{stats.totalPassed}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-semibold mb-0.5 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Highest Score
              </div>
              <div className="text-2xl font-black text-amber-400">
                {stats.topScore ? `${stats.topScore}%` : '—'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-semibold mb-0.5 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Average Score
              </div>
              <div className="text-2xl font-black text-indigo-400">
                {stats.avgScore ? `${stats.avgScore}%` : '—'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-semibold mb-0.5 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Colleges
              </div>
              <div className="text-2xl font-black text-cyan-300">
                {stats.uniqueColleges || '—'}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Filter & Search Bar ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-10 shadow-xl backdrop-blur-md">
          {/* Assessment Filter Dropdown */}
          <div className="w-full md:w-auto flex-1 flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full md:max-w-md bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
            >
              {assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate or college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none focus:ring-2 focus:ring-amber-400/50"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="w-full md:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* ─── Loading State ──────────────────────────────────────────────── */}
        {loading && (
          <div className="py-24 text-center">
            <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-semibold text-sm">Calculating rankings & podium positions...</p>
          </div>
        )}

        {/* ─── Error State ────────────────────────────────────────────────── */}
        {!loading && error && (
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-6 text-center text-rose-200 max-w-lg mx-auto my-12">
            <p className="font-bold mb-2">⚠️ Error loading leaderboard</p>
            <p className="text-xs text-rose-300/80 mb-4">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ─── Empty State ────────────────────────────────────────────────── */}
        {!loading && !error && leaderboard.length === 0 && (
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto my-8 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg shadow-amber-500/10">
              🏆
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Podium is Waiting for Champions!</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              No students have completed or passed this assessment yet. Register for an assessment, achieve the passing marks, and claim the <strong>Rank #1 Crown</strong> on the stage!
            </p>
            <Link
              to="/dashboard/admin/tests"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Explore Assessments & Register</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ─── MAIN FRAME: THE 3D PODIUM STAGE ───────────────────────────── */}
        {!loading && !error && leaderboard.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> Hall of Fame Stage
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Top 3 Highest Scorers
              </h2>
            </div>

            {/* The Stage Container */}
            <div className="relative pt-12 pb-8 px-4 sm:px-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
              
              {/* Glowing Stage Spotlights */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-amber-400/20 to-transparent blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-1/4 w-60 h-32 bg-gradient-to-b from-slate-300/15 to-transparent blur-2xl pointer-events-none" />
              <div className="absolute top-0 right-1/4 w-60 h-32 bg-gradient-to-b from-amber-700/15 to-transparent blur-2xl pointer-events-none" />

              {/* Podium Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end max-w-4xl mx-auto">
                
                {/* ───────────────────────────────────────────────────────── */}
                {/* 🥈 2ND PLACE (SILVER) — Left Column */}
                {/* ───────────────────────────────────────────────────────── */}
                <div className="order-2 md:order-1 flex flex-col items-center">
                  {podium.second ? (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-full flex flex-col items-center text-center"
                    >
                      {/* Avatar with Silver Frame */}
                      <div className="relative mb-3 group">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-400 shadow-xl shadow-slate-400/20">
                          {podium.second.photo ? (
                            <img
                              src={podium.second.photo}
                              alt={podium.second.candidateName}
                              className="w-full h-full rounded-full object-cover bg-slate-800"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 text-xl">
                              {getInitials(podium.second.candidateName)}
                            </div>
                          )}
                        </div>
                        {/* Silver Medal Badge */}
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 text-slate-900 rounded-full font-black text-xs shadow-md border border-white flex items-center gap-1 whitespace-nowrap">
                          <span>🥈</span> 2nd Place
                        </div>
                      </div>

                      {/* Details */}
                      <h3 className="font-extrabold text-white text-base sm:text-lg mt-2 truncate max-w-[220px]">
                        {podium.second.candidateName}
                      </h3>
                      <p className="text-xs text-slate-400 truncate max-w-[200px] mb-1">
                        {podium.second.college || 'Engineering Student'}
                      </p>
                      
                      {/* Score Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-bold mb-3 shadow-sm">
                        <span className="text-slate-300">{podium.second.score}/{podium.second.totalMarks} Marks</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-emerald-400">{podium.second.percentage}%</span>
                      </div>

                      {/* Silver Podium Pillar */}
                      <div className="w-full h-32 sm:h-40 rounded-t-2xl bg-gradient-to-b from-slate-400/30 via-slate-500/20 to-slate-800/60 border-t-2 border-x-2 border-slate-400/50 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                        <div className="text-4xl sm:text-5xl font-black text-slate-300/40 select-none">
                          #2
                        </div>
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                          Silver
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-full text-center text-slate-500 text-xs py-8">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mx-auto mb-2 text-2xl">
                        🥈
                      </div>
                      Position #2 Open
                    </div>
                  )}
                </div>

                {/* ───────────────────────────────────────────────────────── */}
                {/* 👑 1ST PLACE (GOLD - CHAMPION) — Center Elevated Column */}
                {/* ───────────────────────────────────────────────────────── */}
                <div className="order-1 md:order-2 flex flex-col items-center">
                  {podium.first ? (
                    <motion.div
                      initial={{ opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="w-full flex flex-col items-center text-center -mt-6 md:-mt-10"
                    >
                      {/* Crown Floating Animation */}
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        className="text-4xl sm:text-5xl mb-1 filter drop-shadow-[0_4px_12px_rgba(234,179,8,0.5)]"
                      >
                        👑
                      </motion.div>

                      {/* Avatar with Gold Radiant Frame */}
                      <div className="relative mb-3 group">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-2xl shadow-amber-500/50 ring-4 ring-amber-400/30">
                          {podium.first.photo ? (
                            <img
                              src={podium.first.photo}
                              alt={podium.first.candidateName}
                              className="w-full h-full rounded-full object-cover bg-slate-900 border-2 border-amber-300"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-amber-400 text-2xl sm:text-3xl border-2 border-amber-300">
                              {getInitials(podium.first.candidateName)}
                            </div>
                          )}
                        </div>

                        {/* Gold Champion Badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 rounded-full font-black text-xs sm:text-sm shadow-xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                          <span>🥇</span> 1st Place Champion
                        </div>
                      </div>

                      {/* Details */}
                      <h3 className="font-black text-white text-lg sm:text-2xl mt-3 truncate max-w-[260px]">
                        {podium.first.candidateName}
                      </h3>
                      <p className="text-xs sm:text-sm text-amber-200/90 font-medium truncate max-w-[240px] mb-1.5">
                        {podium.first.college || 'Top Achiever'}
                      </p>

                      {/* Score Highlight Pill */}
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black mb-3 shadow-lg shadow-amber-500/20">
                        <span>{podium.first.score} / {podium.first.totalMarks} Marks</span>
                        <span className="text-amber-500">•</span>
                        <span className="text-emerald-400 font-extrabold text-sm">{podium.first.percentage}%</span>
                      </div>

                      {/* Gold Elevated Podium Pillar */}
                      <div className="w-full h-44 sm:h-56 rounded-t-3xl bg-gradient-to-b from-amber-400/40 via-yellow-500/20 to-slate-900/90 border-t-4 border-x-2 border-amber-400 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-amber-400/10 pointer-events-none" />
                        <div className="text-5xl sm:text-7xl font-black text-amber-400/50 select-none">
                          #1
                        </div>
                        <span className="text-xs font-black text-amber-300 uppercase tracking-widest mt-1">
                          GOLD CHAMPION
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-full text-center text-slate-500 text-xs py-8">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center mx-auto mb-2 text-3xl">
                        👑
                      </div>
                      Position #1 Open
                    </div>
                  )}
                </div>

                {/* ───────────────────────────────────────────────────────── */}
                {/* 🥉 3RD PLACE (BRONZE) — Right Column */}
                {/* ───────────────────────────────────────────────────────── */}
                <div className="order-3 md:order-3 flex flex-col items-center">
                  {podium.third ? (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="w-full flex flex-col items-center text-center"
                    >
                      {/* Avatar with Bronze Frame */}
                      <div className="relative mb-3 group">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-800 shadow-xl shadow-amber-800/20">
                          {podium.third.photo ? (
                            <img
                              src={podium.third.photo}
                              alt={podium.third.candidateName}
                              className="w-full h-full rounded-full object-cover bg-slate-800"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-200 text-xl">
                              {getInitials(podium.third.candidateName)}
                            </div>
                          )}
                        </div>
                        {/* Bronze Medal Badge */}
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 text-amber-100 rounded-full font-black text-xs shadow-md border border-amber-500/50 flex items-center gap-1 whitespace-nowrap">
                          <span>🥉</span> 3rd Place
                        </div>
                      </div>

                      {/* Details */}
                      <h3 className="font-extrabold text-white text-base sm:text-lg mt-2 truncate max-w-[220px]">
                        {podium.third.candidateName}
                      </h3>
                      <p className="text-xs text-slate-400 truncate max-w-[200px] mb-1">
                        {podium.third.college || 'Engineering Student'}
                      </p>

                      {/* Score Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-bold mb-3 shadow-sm">
                        <span className="text-slate-300">{podium.third.score}/{podium.third.totalMarks} Marks</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-emerald-400">{podium.third.percentage}%</span>
                      </div>

                      {/* Bronze Podium Pillar */}
                      <div className="w-full h-28 sm:h-36 rounded-t-2xl bg-gradient-to-b from-amber-800/30 via-amber-900/20 to-slate-800/60 border-t-2 border-x-2 border-amber-700/50 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                        <div className="text-4xl sm:text-5xl font-black text-amber-700/40 select-none">
                          #3
                        </div>
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mt-1">
                          Bronze
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-full text-center text-slate-500 text-xs py-8">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mx-auto mb-2 text-2xl">
                        🥉
                      </div>
                      Position #3 Open
                    </div>
                  )}
                </div>

              </div>

              {/* Stage Floor Reflection */}
              <div className="h-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-full border-t border-slate-700/60 mt-0 max-w-4xl mx-auto shadow-inner" />
            </div>
          </div>
        )}

        {/* ─── RANKWISE LISTING (Position 4 and Below) ───────────────────── */}
        {!loading && !error && leaderboard.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>📊</span> Rankwise Performers (Position 4+)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete list of all qualified and certified candidates sorted by exam score and percentage.
                </p>
              </div>

              <div className="text-xs text-slate-400">
                Showing <strong>{filteredRankwise.length}</strong> candidates
              </div>
            </div>

            {filteredRankwise.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-sm">
                {rankwise.length === 0 
                  ? "All current qualifiers are proudly featured on the Top 3 Podium above! More rankers will appear here as more students take the exam."
                  : "No rankers match your search criteria. Try a different search."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRankwise.map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                  >
                    {/* Left: Rank + Photo + Student Details */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Rank Badge */}
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-black text-sm flex-shrink-0">
                        #{student.rank}
                      </div>

                      {/* Photo Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center shadow">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.candidateName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm bg-slate-800">
                              {getInitials(student.candidateName)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Name & College */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-sm sm:text-base truncate">
                            {student.candidateName}
                          </h4>
                          {student.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                              {student.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 truncate">
                          <span className="truncate">{student.college}</span>
                          {student.rollNo && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-slate-500 truncate">{student.rollNo}</span>
                            </>
                          )}
                        </div>
                        <div className="text-[11px] text-indigo-400 font-medium mt-0.5 truncate">
                          📝 {student.assessmentTitle}
                        </div>
                      </div>
                    </div>

                    {/* Right: Score, Percentage, Status Badge */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="text-left sm:text-right">
                        <div className="text-sm font-extrabold text-white">
                          {student.score} <span className="text-slate-400 font-normal text-xs">/ {student.totalMarks} Marks</span>
                        </div>
                        <div className="text-xs text-emerald-400 font-bold">
                          {student.percentage}% Score
                        </div>
                      </div>

                      {/* Status pill */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-bold whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Passed</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Call to Action Footer Card ─────────────────────────────────── */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-900/60 p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Want to see your name & photo on this stage?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Take an official ProgrammingWala examination, test your Core Java, Full Stack, and DSA skills, and receive an industry-recognized certificate with a verified rank.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/dashboard/admin/tests"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Take Technical Assessment</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/verify-certificate"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Verify a Certificate</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}