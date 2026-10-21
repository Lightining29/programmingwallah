import React, { useState, useEffect } from 'react';
import { 
  Trophy, CheckCircle2, PlusCircle, RotateCcw, Sparkles, ExternalLink, 
  HelpCircle, Check, Database, Code2, Server, Globe, Cpu, Layers, AlertCircle,
  Radio, Play, Square, Lock, Eye, ArrowRight, ArrowLeft, Users, Laptop, 
  Copy, Trash2, ShieldCheck, Flame, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import { KBC_PRIZE_LADDER, DEFAULT_MERN_SQL_QUESTIONS } from '../../data/kbcQuestions.js';

export default function AdminKbcManager() {
  const [activeSubTab, setActiveSubTab] = useState('live'); // 'live' | 'questions' | 'teams'
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [levelsData, setLevelsData] = useState({});
  const [loading, setLoading] = useState(true);

  // Live Session Control State
  const [session, setSession] = useState({
    status: 'INACTIVE',
    show_in_navbar: false,
    current_level: 1,
    is_locked: false,
    locked_option: null,
    revealed_correct: null,
    active_team_id: null
  });

  // Participating Teams State
  const [teams, setTeams] = useState([]);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newAccessCode, setNewAccessCode] = useState('');

  // Question Management Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTopic, setNewTopic] = useState('React');
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrect, setNewCorrect] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [setImmediatelyActive, setSetImmediatelyActive] = useState(true);

  // Load KBC Admin Data & Poll Live Session
  useEffect(() => {
    fetchAdminKbcData();
    fetchSessionStatus();
    fetchTeams();

    const interval = setInterval(() => {
      fetchSessionStatus();
      fetchTeams();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessionStatus = async () => {
    try {
      const res = await fetch('/api/kbc/session/status');
      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
        if (data.session.current_level && activeSubTab === 'live') {
          setSelectedLevel(data.session.current_level);
        }
      }
    } catch (e) {}
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/kbc/teams');
      const data = await res.json();
      if (data.success && Array.isArray(data.teams)) {
        setTeams(data.teams);
      }
    } catch (e) {}
  };

  const fetchAdminKbcData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kbc/admin/all');
      const data = await res.json();
      if (data.success && data.levels) {
        setLevelsData(data.levels);
      } else {
        buildLocalFallbackData();
      }
    } catch (err) {
      buildLocalFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const buildLocalFallbackData = () => {
    const fallback = {};
    for (let lvl = 1; lvl <= 16; lvl++) {
      const pool = DEFAULT_MERN_SQL_QUESTIONS[lvl] || [];
      const savedActiveId = localStorage.getItem(`kbc_admin_active_lvl_${lvl}`) || (pool[0] ? pool[0].id : null);
      fallback[lvl] = {
        level: lvl,
        activeQuestionId: savedActiveId,
        activeQuestion: pool.find(q => q.id === savedActiveId) || pool[0],
        pool: pool
      };
    }
    setLevelsData(fallback);
  };

  // ── LIVE SESSION CONTROLLER ACTIONS ──

  // Start / Confirm Live Session (Enables Navbar option)
  const handleToggleLiveSession = async (shouldBeLive) => {
    try {
      const res = await fetch('/api/kbc/admin/session/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: shouldBeLive ? 'LIVE' : 'INACTIVE',
          show_in_navbar: shouldBeLive,
          level: selectedLevel
        })
      });
      const data = await res.json();
      if (data.success) {
        setSession(prev => ({
          ...prev,
          status: shouldBeLive ? 'LIVE' : 'INACTIVE',
          show_in_navbar: shouldBeLive
        }));
        Swal.fire({
          icon: shouldBeLive ? 'success' : 'info',
          title: shouldBeLive ? '🎉 KBC is Now LIVE!' : 'Session Paused',
          text: shouldBeLive 
            ? 'The KBC Hotseat option is now visible in the Website Navbar! Contestants can participate from their laptops.'
            : 'Session stopped. KBC option removed from Navbar.',
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (e) {
      Swal.fire('Error', 'Unable to toggle session state.', 'error');
    }
  };

  // Toggle Navbar Visibility directly
  const handleToggleNavbar = async () => {
    const nextVal = !session.show_in_navbar;
    try {
      await fetch('/api/kbc/admin/session/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: session.status,
          show_in_navbar: nextVal,
          level: session.current_level
        })
      });
      setSession(prev => ({ ...prev, show_in_navbar: nextVal }));
    } catch (e) {}
  };

  // Admin Live Screen Controls: Lock, Reveal, Next Level
  const handleUpdateLiveRound = async (payload) => {
    try {
      await fetch('/api/kbc/admin/session/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      fetchSessionStatus();
    } catch (e) {}
  };

  // Advance to Next Level on Admin Monitor
  const handleNextLevel = () => {
    if (selectedLevel >= 16) return;
    const nextLvl = selectedLevel + 1;
    setSelectedLevel(nextLvl);
    handleUpdateLiveRound({
      current_level: nextLvl,
      reset_round: true
    });
  };

  // Previous Level
  const handlePrevLevel = () => {
    if (selectedLevel <= 1) return;
    const prevLvl = selectedLevel - 1;
    setSelectedLevel(prevLvl);
    handleUpdateLiveRound({
      current_level: prevLvl,
      reset_round: true
    });
  };

  // Lock Question on Laptop screens
  const handleAdminLock = (optIdx) => {
    handleUpdateLiveRound({
      is_locked: 1,
      locked_option: optIdx
    });
  };

  // Reveal Correct Answer on Laptop screens
  const handleAdminReveal = (correctIdx) => {
    handleUpdateLiveRound({
      revealed_correct: correctIdx
    });
  };

  // ── TEAM MANAGEMENT ──

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newLeaderName.trim()) {
      Swal.fire('Required', 'Please enter both Team Name and Leader Name.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/kbc/admin/teams/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_name: newTeamName.trim(),
          leader_name: newLeaderName.trim(),
          access_code: newAccessCode.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddTeamModal(false);
        setNewTeamName('');
        setNewLeaderName('');
        setNewAccessCode('');
        fetchTeams();
        Swal.fire('Team Added!', `Access Code: ${data.team.access_code}`, 'success');
      } else {
        Swal.fire('Error', data.message || 'Failed to add team', 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Unable to add team', 'error');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    const confirm = await Swal.fire({
      title: 'Remove Team?',
      text: 'Are you sure you want to remove this team?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove',
      confirmButtonColor: '#ef4444'
    });
    if (confirm.isConfirmed) {
      await fetch('/api/kbc/admin/teams/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId })
      });
      fetchTeams();
    }
  };

  const handleSetHotseatTeam = (teamId) => {
    handleUpdateLiveRound({ active_team_id: teamId });
    Swal.fire({
      icon: 'success',
      title: 'Team on Hotseat!',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  // ── QUESTION SELECTION & CREATION ──

  const handleSelectQuestion = async (questionId) => {
    try {
      const res = await fetch('/api/kbc/admin/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: selectedLevel,
          questionId
        })
      });
      const data = await res.json();
      if (data.success) {
        if (selectedLevel === session.current_level) {
          await handleUpdateLiveRound({
            current_level: selectedLevel,
            current_question_id: questionId,
            reset_round: true
          });
        }
        fetchAdminKbcData();
        fetchSessionStatus();
        Swal.fire({
          icon: 'success',
          title: 'Question Activated in Hostinger MySQL!',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (err) {}
  };

  const handleAddCustomQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || newOptions.some(o => !o.trim())) {
      Swal.fire('Required', 'Please fill in question and all 4 options.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/kbc/admin/add-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: selectedLevel,
          topic: newTopic,
          question: newQuestion,
          options: newOptions,
          correct: newCorrect,
          explanation: newExplanation,
          setAsActive: setImmediatelyActive
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        resetForm();
        fetchAdminKbcData();
        fetchSessionStatus();
        Swal.fire('Success', `Question saved into Hostinger MySQL!`, 'success');
      }
    } catch (err) {}
  };

  const resetForm = () => {
    setNewQuestion('');
    setNewOptions(['', '', '', '']);
    setNewCorrect(0);
    setNewExplanation('');
    setSetImmediatelyActive(true);
  };

  const currentLevelInfo = KBC_PRIZE_LADDER[selectedLevel - 1] || KBC_PRIZE_LADDER[0];
  const currentLevelData = levelsData[selectedLevel] || { pool: [] };
  const activeQ = currentLevelData.activeQuestion;
  const isLiveNow = session.status === 'LIVE';

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* ── TOP CONTROL BANNER: MASTER LIVE CONFIRMATION ── */}
      <div className="bg-gradient-to-r from-[#170e33] via-[#0e1630] to-[#0a1122] border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> KBC Master Control Station
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold font-mono">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> Hostinger MySQL
              </span>
              {isLiveNow ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/30 border border-red-500 text-red-200 text-xs font-black animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  LIVE ON HOTSEAT
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
                  STANDBY MODE
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              Kaun Banega Crorepati — Live Host & Multi-Team Control Screen
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              When you confirm and start the session, the KBC option immediately activates in the website Navbar. Teams can log in from their own laptops, answer questions in real time, and face the 16-level MERN & SQL challenge!
            </p>
          </div>

          {/* Master Live Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            {isLiveNow ? (
              <button
                onClick={() => handleToggleLiveSession(false)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" /> Stop Live Session
              </button>
            ) : (
              <button
                onClick={() => handleToggleLiveSession(true)}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-2xl shadow-emerald-500/40 transition transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Confirm & Start KBC Live!
              </button>
            )}

            <button
              onClick={() => window.open('/kbc', '_blank')}
              className="px-4 py-3 rounded-2xl bg-indigo-600/60 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 border border-indigo-500/40 transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" /> Open Laptop View
            </button>
          </div>

        </div>

        {/* Navbar Live Visibility Toggle Pill */}
        <div className="mt-5 pt-4 border-t border-indigo-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={session.show_in_navbar}
              onChange={handleToggleNavbar}
              className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
            />
            <span className="font-bold">
              Show "KBC QUIZ" in Website Navbar (Current: <strong className={session.show_in_navbar ? 'text-emerald-400' : 'text-slate-500'}>{session.show_in_navbar ? 'VISIBLE' : 'HIDDEN'}</strong>)
            </span>
          </label>

          <span className="text-[11px] text-amber-300 font-mono">
            {teams.length} Team{teams.length !== 1 ? 's' : ''} Registered on Laptop Network
          </span>
        </div>
      </div>

      {/* ── SUB-TABS: Live Host Screen, Question Bank Curator, Participating Teams ── */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        {[
          { id: 'live', label: '🖥️ Admin Live Screen (Host Monitor)', count: null },
          { id: 'teams', label: '💻 Participating Laptop Teams', count: teams.length },
          { id: 'questions', label: '📚 16-Level Question Curators', count: 16 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ════════════ SUB-TAB 1: ADMIN LIVE SCREEN (HOST MONITOR) ════════════ */}
      {activeSubTab === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Host Screen (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Level & Controls Header */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-sm">
                  LEVEL {selectedLevel} OF 16
                </span>
                <span className="text-xl font-black text-amber-300">
                  {currentLevelInfo.prize}
                </span>
                {currentLevelInfo.isSafe && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Safe Padav
                  </span>
                )}
              </div>

              {/* Host Navigation Buttons & Quick Add */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md border border-indigo-400/30"
                  title={`Add a new custom question for Level ${selectedLevel}`}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>➕ Add Question (L{selectedLevel})</span>
                </button>
                <button
                  onClick={handlePrevLevel}
                  disabled={selectedLevel <= 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Prev Level
                </button>
                <button
                  onClick={handleNextLevel}
                  disabled={selectedLevel >= 16}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  Next Level <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── QUESTION DISPLAYED TO CONTESTANTS (Visible on Admin Screen) ── */}
            <div className="bg-gradient-to-b from-[#141d40] to-[#0a1027] border-2 border-amber-400/80 rounded-3xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-900/50 mb-4">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Live Question on Contestants' Screens
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-mono font-bold">
                  Topic: {activeQ?.topic || 'MERN & SQL'}
                </span>
              </div>

              {activeQ ? (
                <div className="space-y-4">
                  {/* Large Question Text */}
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed bg-black/40 border border-indigo-500/30 rounded-2xl p-5">
                    {activeQ.question}
                  </h3>

                  {/* 4 Options Grid (Correct answer highlighted clearly in green for Admin) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                    {activeQ.options.map((opt, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      const isCorrect = idx === activeQ.correct;
                      const isLocked = session.locked_option === idx;

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isCorrect
                              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100 font-bold shadow-lg shadow-emerald-500/10'
                              : isLocked
                              ? 'bg-amber-950/50 border-amber-400 text-amber-200 font-bold'
                              : 'bg-slate-900/80 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                              isCorrect
                                ? 'bg-emerald-500 text-slate-950 font-black'
                                : 'bg-slate-800 text-amber-400'
                            }`}>
                              {letter}
                            </span>
                            <span className="text-sm font-semibold">{opt}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isCorrect && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                                Correct Answer ✓
                              </span>
                            )}
                            {isLocked && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                                Locked 🔒
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Host Quick Actions Bar */}
                  <div className="pt-4 border-t border-indigo-900/50 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleAdminLock(activeQ.correct)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Lock className="w-3.5 h-3.5" /> Lock Option
                      </button>
                      <button
                        onClick={() => handleAdminReveal(activeQ.correct)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Eye className="w-3.5 h-3.5" /> Reveal Correct Answer
                      </button>
                    </div>

                    <button
                      onClick={() => handleUpdateLiveRound({ current_level: selectedLevel, reset_round: true })}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Question Round
                    </button>
                  </div>

                  {/* Explanation for Host */}
                  {activeQ.explanation && (
                    <div className="text-xs text-slate-300 bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 mt-2">
                      <strong className="text-amber-400">Host Concept Note: </strong>
                      {activeQ.explanation}
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No active question set for this level yet.
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar: 16-Step Money Ladder + Active Hotseat Team (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Participating Teams Live Answer Tracker */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  Teams Answering on Laptops
                </span>
                <span className="text-[10px] text-cyan-300 font-mono">
                  {teams.filter(t => t.submitted_option !== null).length} / {teams.length} Submitted
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {teams.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-3">No teams added yet. Go to "Participating Laptop Teams" tab to add.</p>
                ) : (
                  teams.map(t => {
                    const hasSubmitted = t.submitted_option !== null;
                    const letter = hasSubmitted ? String.fromCharCode(65 + t.submitted_option) : '—';
                    return (
                      <div
                        key={t.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          hasSubmitted
                            ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{t.team_name}</span>
                            <span className="text-[10px] text-slate-500 font-mono font-normal">({t.access_code})</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {t.leader_name}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-xs font-black ${
                            hasSubmitted ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                          }`}>
                            Ans: {letter}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Money Ladder Quick Jump */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <div className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2.5 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>16-Level Ladder</span>
                <span className="text-[10px] text-slate-400 font-normal">Click to jump</span>
              </div>

              <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                {KBC_PRIZE_LADDER.slice().reverse().map(step => {
                  const isCurrent = selectedLevel === step.level;
                  return (
                    <button
                      key={step.level}
                      onClick={() => {
                        setSelectedLevel(step.level);
                        handleUpdateLiveRound({ current_level: step.level, reset_round: true });
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                          : step.isSafe
                          ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                          : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>Level {step.level}: {step.prize}</span>
                      {step.isSafe && (
                        <span className={`text-[9px] px-1.5 rounded ${
                          isCurrent ? 'bg-slate-950 text-amber-400' : 'bg-amber-400/20 text-amber-300'
                        }`}>
                          PADAV
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ════════════ SUB-TAB 2: PARTICIPATING LAPTOP TEAMS ════════════ */}
      {activeSubTab === 'teams' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Laptop className="w-5 h-5 text-cyan-400" />
                Participating Contestant Teams ({teams.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Each team participates from their own laptop by entering their Team Access Code at <strong className="text-amber-400 font-mono">/kbc</strong>.
              </p>
            </div>

            <button
              onClick={() => setShowAddTeamModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <PlusCircle className="w-4 h-4" /> Add New Team
            </button>
          </div>

          {/* Teams Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Team Name</th>
                  <th className="px-4 py-3">Leader</th>
                  <th className="px-4 py-3">Laptop Access Code</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Current Answer</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No teams added yet. Click "+ Add New Team" to create teams.
                    </td>
                  </tr>
                ) : (
                  teams.map(t => {
                    const isHotseat = session.active_team_id === t.id;
                    const ansLetter = t.submitted_option !== null ? String.fromCharCode(65 + t.submitted_option) : null;

                    return (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-amber-400" />
                          <span>{t.team_name}</span>
                          {isHotseat && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40">
                              HOTSEAT
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-medium">{t.leader_name}</td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-500/30 font-mono text-indigo-300 font-bold inline-flex items-center gap-1.5">
                            {t.access_code}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'CONNECTED' 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {t.status === 'CONNECTED' ? 'ONLINE 💻' : 'REGISTERED'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {ansLetter ? (
                            <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-black text-xs">
                              Option {ansLetter}
                            </span>
                          ) : (
                            <span className="text-slate-600">Waiting...</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleSetHotseatTeam(t.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold transition cursor-pointer"
                          >
                            Hotseat
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(t.id)}
                            className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                            title="Remove team"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════ SUB-TAB 3: 16-LEVEL QUESTION CURATORS ════════════ */}
      {activeSubTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 16-Level Ladder Selector (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Level</span>
              <span className="text-xs text-amber-400 font-bold">16 Questions</span>
            </div>

            <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
              {KBC_PRIZE_LADDER.slice().reverse().map(step => {
                const isSelected = selectedLevel === step.level;
                const topic = levelsData[step.level]?.activeQuestion?.topic || 'MERN/SQL';

                return (
                  <button
                    key={step.level}
                    onClick={() => setSelectedLevel(step.level)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/10 border-amber-400 text-white shadow-md'
                        : step.isSafe
                        ? 'bg-slate-800/80 hover:bg-slate-800 border-amber-500/30 text-amber-200'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {step.level}
                      </span>
                      <div>
                        <div className="text-xs font-bold">
                          {step.prize} {step.isSafe && <span className="text-amber-400 text-[10px]">• PADAV</span>}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{topic}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Pool & Add Question (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs">
                  LEVEL {selectedLevel} POOL
                </span>
                <span className="text-amber-400 font-bold text-lg ml-2">
                  {currentLevelInfo.prize}
                </span>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" /> Add Custom Question
              </button>
            </div>

            {/* Questions Pool */}
            <div className="space-y-3">
              {(currentLevelData.pool || []).map((q, qIdx) => {
                const isActive = q.id === currentLevelData.activeQuestionId;
                return (
                  <div
                    key={q.id || qIdx}
                    className={`p-4 rounded-2xl border transition ${
                      isActive
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                            {q.topic}
                          </span>
                          {isActive && (
                            <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> ACTIVE IN EXAM
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-200 font-semibold">{q.question}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className={`truncate ${oi === q.correct ? 'text-emerald-400 font-bold' : ''}`}>
                              {String.fromCharCode(65 + oi)}: {opt}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isActive ? (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSelectQuestion(q.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold transition cursor-pointer"
                          >
                            Set as Active
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ── MODAL: ADD PARTICIPATING TEAM ── */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-cyan-400/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Laptop className="w-5 h-5 text-cyan-400" />
                Add Laptop Participating Team
              </h3>
              <button onClick={() => setShowAddTeamModal(false)} className="text-slate-400 hover:text-white text-base">✕</button>
            </div>

            <form onSubmit={handleAddTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  placeholder="e.g. Code Knights, MERN Ninjas"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Team Leader / Student Name</label>
                <input
                  type="text"
                  value={newLeaderName}
                  onChange={e => setNewLeaderName(e.target.value)}
                  placeholder="e.g. Aman Gupta"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Team Access Code (Optional)</label>
                <input
                  type="text"
                  value={newAccessCode}
                  onChange={e => setNewAccessCode(e.target.value)}
                  placeholder="Leave blank for auto-generated code"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Students will enter this code on their laptops at /kbc to join.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  Register Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD CUSTOM QUESTION ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-400/40 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                Add Custom MERN / SQL Question (Level {selectedLevel})
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-base">✕</button>
            </div>

            <form onSubmit={handleAddCustomQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Topic / Category</label>
                <select
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="React">React (Hooks, VDOM, Fiber, Concurrent)</option>
                  <option value="MongoDB">MongoDB (Aggregation, BSON, Sharding, Replica)</option>
                  <option value="Node.js">Node.js (Event Loop, V8, Streams, Worker Threads)</option>
                  <option value="Express">Express.js (Routing, Middleware, Security)</option>
                  <option value="SQL">SQL (PostgreSQL / MySQL, Joins, Indexes, ACID)</option>
                  <option value="MERN & SQL Architecture">MERN & SQL Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Question Text</label>
                <textarea
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="e.g. Which React Hook is used to memoize expensive function calculations?"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-300">4 Options & Mark Correct Answer</label>
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={e => {
                        const copy = [...newOptions];
                        copy[i] = e.target.value;
                        setNewOptions(copy);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer shrink-0">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newCorrect === i}
                        onChange={() => setNewCorrect(i)}
                      />
                      <span>Correct</span>
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Explanation</label>
                <textarea
                  value={newExplanation}
                  onChange={e => setNewExplanation(e.target.value)}
                  placeholder="Brief reason or concept explanation..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
