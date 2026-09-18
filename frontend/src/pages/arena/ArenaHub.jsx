import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Terminal, Code2, Trophy, Search, Filter, CheckCircle2, 
  Circle, Star, Sparkles, User, LogOut, ArrowRight, 
  ChevronRight, Award, Flame, Database, ShieldCheck, 
  Layers, ExternalLink, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ArenaAuthModal from './ArenaAuthModal.jsx';

export default function ArenaHub() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'solved', 'unsolved'
  const [searchTerm, setSearchTerm] = useState('');

  // Current logged in arena student
  const [student, setStudent] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Topics
  const topics = [
    { id: 'all', name: 'All Topics' },
    { id: 'Arrays', name: 'Arrays & Hashing' },
    { id: 'Strings', name: 'Strings' },
    { id: 'Stack', name: 'Data Structures' },
    { id: 'Algorithms', name: 'Algorithms' },
    { id: 'Core Java', name: 'Core Java' },
    { id: 'SQL', name: 'SQL & Databases' }
  ];

  useEffect(() => {
    // Load student from localStorage
    const savedStudent = localStorage.getItem('arena_student');
    if (savedStudent) {
      try {
        setStudent(JSON.parse(savedStudent));
      } catch (e) {}
    }
    fetchProblems();
  }, [selectedTopic, selectedDifficulty]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      let url = '/api/arena/problems?';
      if (selectedTopic !== 'all') url += `topic=${encodeURIComponent(selectedTopic)}&`;
      if (selectedDifficulty !== 'all') url += `difficulty=${encodeURIComponent(selectedDifficulty)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProblems(data.problems || []);
      }
    } catch (err) {
      console.error('Fetch problems error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('arena_token');
    localStorage.removeItem('arena_student');
    setStudent(null);
  };

  // Filter problems by status and search
  const filteredProblems = problems.filter((p) => {
    const isSolved = student?.solvedProblems?.includes(p.id);

    if (selectedStatus === 'solved' && !isSolved) return false;
    if (selectedStatus === 'unsolved' && isSolved) return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      p.title.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q) ||
      p.difficulty.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ─── Ambient Glow ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full bg-gradient-to-b from-indigo-100/50 via-sky-50/40 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        {/* ─── Top Banner & Student Status ──────────────────────────────── */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left Title & Tagline */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-3">
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              <span>ProgrammingWala Coding Arena</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              HackerRank-Style Challenges
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              Solve real-world algorithmic problems, test your code against automated test cases, and earn XP to climb the leaderboard!
            </p>
          </div>

          {/* Right: Student Profile or Sign In Button */}
          <div className="flex-shrink-0">
            {student ? (
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-300 bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  {student.photo ? (
                    <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-sm text-indigo-700 bg-indigo-100">
                      {student.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{student.name}</span>
                    <span className="px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black">
                      {student.score || 0} XP
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {student.solvedProblems?.length || 0} Challenges Solved
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-[10px] text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 mt-1 cursor-pointer transition"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <User className="w-4 h-4" />
                <span>Student Sign In / Register</span>
              </button>
            )}
          </div>

        </div>

        {/* ─── Topic Filters & Search ──────────────────────────────────── */}
        <div className="space-y-4 mb-6">
          
          {/* Search and Dropdowns Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search challenge or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap sm:flex-nowrap">
              {/* Difficulty */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm outline-none cursor-pointer"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>

              <button
                onClick={fetchProblems}
                disabled={loading}
                className="p-2 rounded-2xl bg-white border border-slate-200/90 text-slate-600 hover:text-indigo-600 shadow-sm transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Topic Pills Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTopic === t.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

        </div>

        {/* ─── Challenges List ─────────────────────────────────────────── */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-500">Loading Coding Arena challenges...</p>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Terminal className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No challenges found</h3>
              <p className="text-xs text-slate-400 mt-1">Try switching topic or search criteria.</p>
            </div>
          ) : (
            filteredProblems.map((problem) => {
              const isSolved = student?.solvedProblems?.includes(problem.id);

              return (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Status Icon + Title + Meta */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {isSolved ? (
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                          <Code2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/arena/problem/${problem.id}`}
                          className="text-base font-black text-slate-900 hover:text-indigo-600 transition truncate cursor-pointer"
                        >
                          {problem.title}
                        </Link>

                        {/* Difficulty Badge */}
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            problem.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : problem.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {problem.difficulty}
                        </span>

                        {isSolved && (
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Solved
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{problem.topic}</span>
                        <span>•</span>
                        <span>Success Rate: <strong className="text-slate-600">{problem.successRate}</strong></span>
                        <span>•</span>
                        <span className="font-bold text-amber-600">{problem.points} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Solve Challenge Button */}
                  <div className="flex-shrink-0">
                    <Link
                      to={`/arena/problem/${problem.id}`}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSolved
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      }`}
                    >
                      <span>{isSolved ? 'Solve Again' : 'Solve Challenge'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </motion.div>
              );
            })
          )}
        </div>

      </div>

      {/* Auth Modal */}
      <ArenaAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(newStudent) => setStudent(newStudent)}
      />

    </div>
  );
}
