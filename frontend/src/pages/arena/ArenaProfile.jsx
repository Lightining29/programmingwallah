import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Calendar, Trophy, Zap, Flame, ShieldCheck, 
  ArrowLeft, ArrowRight, Code2, Terminal, CheckCircle2, 
  XCircle, Clock, Award, Sparkles, ExternalLink, LogOut, 
  Edit3, Camera, Save, RefreshCw, Layers, Check, ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function ArenaProfile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [problems, setProblems] = useState([]);
  const [leaderboardRank, setLeaderboardRank] = useState(null);

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const savedStudent = localStorage.getItem('arena_student');
      let currentStudent = null;
      if (savedStudent) {
        try {
          currentStudent = JSON.parse(savedStudent);
          setStudent(currentStudent);
          setEditName(currentStudent.name || '');
          setEditDob(currentStudent.dob || '');
          setEditPhoto(currentStudent.photo || '');
        } catch (e) {}
      }

      // If no student found in localStorage, redirect to login with student LMS selected
      if (!currentStudent || !currentStudent.email) {
        navigate('/login?portal=student');
        return;
      }

      // Fetch fresh profile from server
      const token = localStorage.getItem('arena_token');
      const res = await fetch(`/api/arena/profile?email=${encodeURIComponent(currentStudent.email)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success && data.student) {
        setStudent(data.student);
        localStorage.setItem('arena_student', JSON.stringify(data.student));
        setEditName(data.student.name || '');
        setEditDob(data.student.dob || '');
        setEditPhoto(data.student.photo || '');
      }

      // Fetch all problems to calculate accurate stats
      const probRes = await fetch('/api/arena/problems');
      const probData = await probRes.json();
      if (probData.success) {
        setProblems(probData.problems || []);
      }

      // Fetch student submissions
      const subRes = await fetch(`/api/arena/submissions?email=${encodeURIComponent(currentStudent.email)}`);
      const subData = await subRes.json();
      if (subData.success) {
        setSubmissions(subData.submissions || []);
      }

      // Fetch leaderboard to get user's global rank
      const leadRes = await fetch('/api/arena/leaderboard');
      const leadData = await leadRes.json();
      if (leadData.success && leadData.leaderboard) {
        const foundIdx = leadData.leaderboard.findIndex(
          u => String(u.email).toLowerCase() === String(currentStudent.email).toLowerCase()
        );
        if (foundIdx !== -1) {
          setLeaderboardRank(foundIdx + 1);
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Image compressor for avatar uploads
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (re) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let w = img.width, h = img.height;
        if (w > h) {
          if (w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim; }
        } else {
          if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setEditPhoto(dataUrl);
      };
      img.src = re.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      Swal.fire({ icon: 'error', title: 'Name required', text: 'Please enter your full name.' });
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('arena_token');
      const res = await fetch('/api/arena/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          email: student.email,
          name: editName.trim(),
          dob: editDob.trim(),
          photo: editPhoto
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      setStudent(data.student);
      localStorage.setItem('arena_student', JSON.stringify(data.student));
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your student coder details have been saved.',
        timer: 2000,
        showConfirmButton: false,
        background: '#0d1117',
        color: '#f0f6fc'
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Update Error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('arena_token');
    localStorage.removeItem('arena_student');
    navigate('/login?portal=student');
  };

  if (loading) {
    return (
      <div className="arena-dark-root min-h-screen bg-[#0a0e17] flex items-center justify-center text-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">Loading Student Profile...</p>
        </div>
      </div>
    );
  }

  // Calculate difficulty stats
  const totalProblems = problems.length || 6;
  const solvedList = student?.solvedProblems || [];
  const solvedCount = solvedList.length;

  const easyTotal = problems.filter(p => p.difficulty === 'Easy').length || 3;
  const easySolved = problems.filter(p => p.difficulty === 'Easy' && solvedList.includes(p.id)).length;

  const medTotal = problems.filter(p => p.difficulty === 'Medium').length || 2;
  const medSolved = problems.filter(p => p.difficulty === 'Medium' && solvedList.includes(p.id)).length;

  const hardTotal = problems.filter(p => p.difficulty === 'Hard').length || 1;
  const hardSolved = problems.filter(p => p.difficulty === 'Hard' && solvedList.includes(p.id)).length;

  return (
    <div className="arena-dark-root min-h-screen bg-[#0a0e17] text-slate-100 font-sans pb-24 selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* ─── Top Ambient Glow ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* ─── Top Navigation Bar ─────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <Link
            to="/arena"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-slate-300 hover:text-white text-xs font-bold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Coding Arena</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/leaderboard"
              className="px-3.5 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-amber-400 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leaderboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* ─── Profile Hero Banner ────────────────────────────────────── */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            
            {/* Avatar with glow & photo upload trigger */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-emerald-500/60 bg-[#161b22] shadow-[0_0_25px_rgba(16,185,129,0.25)] flex items-center justify-center">
                {student?.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-black text-emerald-400 bg-emerald-950/40">
                    {student?.name?.slice(0, 2).toUpperCase() || 'ST'}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-500 text-black shadow-lg hover:scale-105 transition cursor-pointer"
                title="Edit Profile"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Student Coder
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold inline-flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  3-Day Streak
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {student?.name || 'Student'}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{student?.email}</span>
                </div>
                {student?.dob && (
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>DOB: {student.dob}</span>
                  </div>
                )}
                {student?.createdAt && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Joined: {new Date(student.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Link
                  to="/arena"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Open Coding Arena</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-slate-300 hover:text-white text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ─── Metric Cards Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>Total Solved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{solvedCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">out of {totalProblems} available</div>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>Total XP</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{student?.score || 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">ranking points earned</div>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>Global Rank</span>
              <Trophy className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              {leaderboardRank ? `#${leaderboardRank}` : '--'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">across all registered coders</div>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>Submissions</span>
              <Terminal className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">{submissions.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">total code attempts</div>
          </div>

        </div>

        {/* ─── Detailed Stats & LeetCode Meters ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LeetCode Difficulty Breakdown (1 col) */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Difficulty Progress</span>
            </h3>

            {/* Easy Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#00b8a3]">Easy</span>
                <span className="text-slate-400 font-mono">{easySolved} / {easyTotal}</span>
              </div>
              <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00b8a3]" 
                  style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#ffa116]">Medium</span>
                <span className="text-slate-400 font-mono">{medSolved} / {medTotal}</span>
              </div>
              <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ffa116]" 
                  style={{ width: `${medTotal > 0 ? (medSolved / medTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#ff375f]">Hard</span>
                <span className="text-slate-400 font-mono">{hardSolved} / {hardTotal}</span>
              </div>
              <div className="w-full h-2 bg-[#21262d] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ff375f]" 
                  style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] text-[11px] text-slate-400 leading-relaxed">
              💡 <strong>Pro Tip:</strong> Solving harder problems awards significantly more XP points and boosts your global standing on the leaderboard!
            </div>
          </div>

          {/* Submissions Activity History (2 cols) */}
          <div className="lg:col-span-2 bg-[#0d1117] border border-[#30363d] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Recent Submissions Activity</span>
              </h3>
              <Link to="/arena" className="text-xs text-emerald-400 hover:underline font-bold">
                Solve More
              </Link>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Code2 className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
                <p className="text-xs font-medium">No code submissions recorded yet.</p>
                <Link
                  to="/arena"
                  className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs mt-2"
                >
                  Start Solving in Arena
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-between text-xs hover:border-[#484f58] transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {sub.status === 'Accepted' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                      <div className="truncate">
                        <Link
                          to={`/arena/problem/${sub.problemId}`}
                          className="font-bold text-white hover:text-emerald-400 transition truncate block"
                        >
                          {sub.problemTitle || sub.problemId}
                        </Link>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Date(sub.submittedAt).toLocaleTimeString()} • {new Date(sub.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-slate-300">
                        {sub.language}
                      </span>
                      <span className={`font-black text-xs ${
                        sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ─── Edit Profile Modal ────────────────────────────────────────── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0d1117] rounded-3xl shadow-2xl border border-[#30363d] overflow-hidden text-slate-100 p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <h3 className="text-base font-black text-white">Edit Student Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Photo selector */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-emerald-500/50 bg-[#0d1117] flex items-center justify-center flex-shrink-0">
                  {editPhoto ? (
                    <img src={editPhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-200">Profile Picture</div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 px-3 py-1 rounded-lg bg-[#21262d] border border-[#30363d] hover:border-emerald-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-emerald-400" />
                    <span>Upload New Photo</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Date of Birth (DOB)</label>
                <input
                  type="date"
                  required
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-[#21262d] text-slate-300 text-xs font-bold hover:bg-[#30363d] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs hover:from-emerald-400 hover:to-teal-400 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

