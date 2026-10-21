import React, { useState, useEffect } from 'react';
import { 
  Trophy, CheckCircle2, PlusCircle, RotateCcw, Sparkles, ExternalLink, 
  HelpCircle, Check, Database, Code2, Server, Globe, Cpu, Layers, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { KBC_PRIZE_LADDER, DEFAULT_MERN_SQL_QUESTIONS } from '../../data/kbcQuestions.js';

export default function AdminKbcManager() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [levelsData, setLevelsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [savingBatch, setSavingBatch] = useState(false);

  // New Custom Question Form State
  const [newTopic, setNewTopic] = useState('React');
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrect, setNewCorrect] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [setImmediatelyActive, setSetImmediatelyActive] = useState(true);

  // Load KBC Admin Data
  useEffect(() => {
    fetchAdminKbcData();
  }, []);

  const fetchAdminKbcData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kbc/admin/all');
      const data = await res.json();
      if (data.success && data.levels) {
        setLevelsData(data.levels);
      } else {
        // Fallback to local default data structure
        buildLocalFallbackData();
      }
    } catch (err) {
      console.warn('API error, using local fallback:', err);
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

  // Choose a question for the current level
  const handleSelectQuestion = async (questionId) => {
    try {
      const res = await fetch('/api/kbc/admin/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: selectedLevel,
          questionId,
          adminName: 'Admin'
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setLevelsData(prev => {
          const current = prev[selectedLevel];
          const newActive = current.pool.find(q => q.id === questionId);
          return {
            ...prev,
            [selectedLevel]: {
              ...current,
              activeQuestionId: questionId,
              activeQuestion: newActive
            }
          };
        });
        localStorage.setItem(`kbc_admin_active_lvl_${selectedLevel}`, questionId);
        Swal.fire({
          icon: 'success',
          title: 'Question Activated!',
          text: `Question activated for Level ${selectedLevel} (${KBC_PRIZE_LADDER[selectedLevel - 1].prize}).`,
          timer: 1600,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } else {
        Swal.fire('Error', data.message || 'Failed to update selection', 'error');
      }
    } catch (err) {
      // Local fallback
      setLevelsData(prev => {
        const current = prev[selectedLevel];
        const newActive = current.pool.find(q => q.id === questionId);
        return {
          ...prev,
          [selectedLevel]: {
            ...current,
            activeQuestionId: questionId,
            activeQuestion: newActive
          }
        };
      });
      localStorage.setItem(`kbc_admin_active_lvl_${selectedLevel}`, questionId);
      Swal.fire({
        icon: 'success',
        title: 'Question Selected (Saved Locally)',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };

  // Add a Custom MERN / SQL Question
  const handleAddCustomQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) {
      Swal.fire('Required', 'Please enter question text.', 'warning');
      return;
    }
    if (newOptions.some(o => !o.trim())) {
      Swal.fire('Required', 'Please enter all 4 options.', 'warning');
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
        Swal.fire('Success', `Custom question added to Level ${selectedLevel}!`, 'success');
      } else {
        Swal.fire('Error', data.message || 'Failed to add question', 'error');
      }
    } catch (err) {
      // Fallback local addition
      const customQ = {
        id: `custom-${selectedLevel}-${Date.now()}`,
        topic: newTopic,
        question: newQuestion.trim(),
        options: [...newOptions],
        correct: newCorrect,
        explanation: newExplanation.trim(),
        isCustom: true
      };

      setLevelsData(prev => {
        const current = prev[selectedLevel] || { pool: [] };
        const updatedPool = [...current.pool, customQ];
        return {
          ...prev,
          [selectedLevel]: {
            ...current,
            activeQuestionId: setImmediatelyActive ? customQ.id : current.activeQuestionId,
            activeQuestion: setImmediatelyActive ? customQ : current.activeQuestion,
            pool: updatedPool
          }
        };
      });
      setShowAddModal(false);
      resetForm();
      Swal.fire('Saved', 'Question added to local pool.', 'success');
    }
  };

  // Reset to Factory Default MERN & SQL questions
  const handleResetToDefault = async () => {
    const confirm = await Swal.fire({
      title: 'Reset KBC Questions?',
      text: 'This will restore all 16 levels to the default curated MERN & SQL master dataset.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reset',
      confirmButtonColor: '#e11d48'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch('/api/kbc/admin/reset', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          fetchAdminKbcData();
          Swal.fire('Reset Complete', 'Default MERN & SQL questions restored.', 'success');
        }
      } catch (err) {
        buildLocalFallbackData();
        Swal.fire('Reset', 'Restored to default questions locally.', 'success');
      }
    }
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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> KBC Exam Control Suite
              <span className="text-slate-500">•</span>
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Hostinger MySQL</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-3">
              Kaun Banega Crorepati — MERN & SQL Question Curators
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Admins have full authority to choose, swap, and create questions for each of the 16 KBC ladder levels (₹1,000 to ₹7 Crore). All questions focus strictly on <strong>MERN Stack (MongoDB, Express, React, Node.js) and SQL</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.open('/kbc', '_blank')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" /> Live KBC Preview
            </button>
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-medium text-xs transition cursor-pointer"
              title="Reset all levels to default MERN & SQL questions"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 16-Level Ladder Sidebar + Level Question Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 16-Level Ladder Selector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Level (1 - 16)</span>
            <span className="text-xs text-amber-400 font-bold">16 Questions Ladder</span>
          </div>

          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {KBC_PRIZE_LADDER.slice().reverse().map(step => {
              const isSelected = selectedLevel === step.level;
              const hasActive = levelsData[step.level]?.activeQuestion;
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
                        : step.isSafe
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.level}
                    </span>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span className={step.isSafe ? 'text-amber-300' : 'text-white'}>
                          {step.prize}
                        </span>
                        {step.isSafe && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                            PADAV
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {topic}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {hasActive && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Question & Available Pool for Selected Level (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Card for Selected Level */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs">
                  LEVEL {selectedLevel} OF 16
                </span>
                <span className="text-amber-400 font-bold text-lg">
                  {currentLevelInfo.prize}
                </span>
                {currentLevelInfo.isSafe && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Safe Padav (Milestone)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Choose which MERN / SQL question will be presented to contestants at this prize level.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add Custom Question
            </button>
          </div>

          {/* Active Question Box (Styled like KBC Hexagon preview) */}
          <div className="bg-gradient-to-b from-[#0d1430] to-[#080d22] border-2 border-amber-400/60 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-400/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Currently Active Question in Exam
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs font-bold">
                {activeQ?.topic || 'MERN & SQL'}
              </span>
            </div>

            {activeQ ? (
              <div className="space-y-4">
                {/* Question Text */}
                <div className="text-white font-semibold text-base md:text-lg leading-relaxed bg-black/40 border border-indigo-500/30 rounded-xl p-4">
                  {activeQ.question}
                </div>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {activeQ.options.map((opt, idx) => {
                    const isCorrect = idx === activeQ.correct;
                    const letter = String.fromCharCode(65 + idx);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                          isCorrect
                            ? 'bg-emerald-950/50 border-emerald-400 text-emerald-100 font-bold shadow-lg shadow-emerald-500/10'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-amber-400 border border-amber-400/20'
                        }`}>
                          {letter}
                        </span>
                        <span className="text-sm flex-1">{opt}</span>
                        {isCorrect && (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                            CORRECT
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {activeQ.explanation && (
                  <div className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800 rounded-lg p-3 mt-3">
                    <strong className="text-amber-300">Explanation: </strong> {activeQ.explanation}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                No active question selected for this level yet. Choose from the pool below.
              </div>
            )}
          </div>

          {/* Question Pool for this Level */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                Available Question Pool for Level {selectedLevel} ({currentLevelData.pool?.length || 0})
              </h3>
              <span className="text-xs text-slate-400">
                Click "Activate" to make that question the live test question.
              </span>
            </div>

            <div className="space-y-3">
              {(currentLevelData.pool || []).map((q, qIdx) => {
                const isActive = q.id === currentLevelData.activeQuestionId;
                return (
                  <div
                    key={q.id || qIdx}
                    className={`p-4 rounded-xl border transition ${
                      isActive
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                            {q.topic}
                          </span>
                          {q.isCustom && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                              Custom Question
                            </span>
                          )}
                          {isActive && (
                            <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> ACTIVE IN EXAM
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-200 font-medium">
                          {q.question}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-400 pt-1">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className={`truncate ${oi === q.correct ? 'text-emerald-400 font-bold' : ''}`}>
                              {String.fromCharCode(65 + oi)}: {opt}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
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
      </div>

      {/* Add Custom Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-400/40 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                Add Custom MERN / SQL Question (Level {selectedLevel})
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
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
                  <option value="MERN & SQL Architecture">MERN & SQL Architecture (Distributed, SAGA)</option>
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Explanation (Optional)</label>
                <textarea
                  value={newExplanation}
                  onChange={e => setNewExplanation(e.target.value)}
                  placeholder="Brief reason or concept explanation..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setImmediatelyActive}
                  onChange={e => setSetImmediatelyActive(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-xs text-amber-300 font-semibold">
                  Immediately activate this question as the active test question for Level {selectedLevel}
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-lg hover:from-amber-400 hover:to-yellow-400 cursor-pointer"
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
