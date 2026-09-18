import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, Send, CheckCircle2, XCircle, Terminal, 
  RotateCcw, Sparkles, User, Trophy, ShieldCheck, ChevronRight,
  Code2, AlertCircle, Check, Copy
} from 'lucide-react';
import Swal from 'sweetalert2';
import ArenaAuthModal from './ArenaAuthModal.jsx';

export default function ArenaProblem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  // Active Tab on Left Pane
  const [activeLeftTab, setActiveLeftTab] = useState('problem'); // 'problem' or 'submissions'

  // Test Execution State
  const [activeTestTab, setActiveTestTab] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [submitResults, setSubmitResults] = useState(null);

  // Student Auth State
  const [student, setStudent] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Load student
    const savedStudent = localStorage.getItem('arena_student');
    if (savedStudent) {
      try {
        setStudent(JSON.parse(savedStudent));
      } catch (e) {}
    }

    fetchProblemDetails();
  }, [id]);

  const fetchProblemDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/arena/problems/${id}`);
      const data = await res.json();
      if (data.success && data.problem) {
        setProblem(data.problem);
        // Set default starter code
        if (data.problem.starters) {
          if (data.problem.topic?.includes('SQL') && data.problem.starters.sql) {
            setLanguage('sql');
            setCode(data.problem.starters.sql);
          } else if (data.problem.starters.javascript) {
            setLanguage('javascript');
            setCode(data.problem.starters.javascript);
          } else if (data.problem.starters.java) {
            setLanguage('java');
            setCode(data.problem.starters.java);
          }
        }
      }
    } catch (err) {
      console.error('Fetch problem error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Language switch
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (problem?.starters && problem.starters[newLang]) {
      setCode(problem.starters[newLang]);
    }
  };

  // Run Code against Sample Test Cases
  const handleRunCode = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setRunResults(null);
    setSubmitResults(null);

    try {
      const res = await fetch('/api/arena/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: id,
          code,
          language
        })
      });

      const data = await res.json();
      setRunResults(data);
      setActiveTestTab(0);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Execution Error', text: err.message });
    } finally {
      setRunning(false);
    }
  };

  // Submit Code against All Test Cases
  const handleSubmitCode = async () => {
    const token = localStorage.getItem('arena_token');
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    setSubmitting(true);
    setSubmitResults(null);
    setRunResults(null);

    try {
      const res = await fetch('/api/arena/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: id,
          code,
          language
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');

      setSubmitResults(data);

      if (data.allPassed) {
        // Update local student solved list & score
        if (student) {
          const updated = {
            ...student,
            score: data.newTotalScore,
            solvedProblems: [...new Set([...(student.solvedProblems || []), id])]
          };
          setStudent(updated);
          localStorage.setItem('arena_student', JSON.stringify(updated));
        }

        Swal.fire({
          icon: 'success',
          title: '🎉 Accepted!',
          html: `<p>All test cases passed successfully!</p><p style="color:#10b981;font-weight:bold;margin-top:8px;">+${data.awardedPoints} XP Earned</p>`,
          confirmButtonColor: '#4f46e5'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Wrong Answer',
          text: 'Some test cases did not pass. Check the test case output below.',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Submission Error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">Loading IDE Workspace...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-200 max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-black text-slate-900">Challenge Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">This problem does not exist or has been archived.</p>
          <Link to="/arena" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
            Back to Arena Hub
          </Link>
        </div>
      </div>
    );
  }

  const isSolved = student?.solvedProblems?.includes(problem.id);
  const activeCases = submitResults?.testResults || runResults?.results || problem.sampleTestCases || [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col select-none">
      
      {/* ─── Top IDE Navigation Bar ──────────────────────────────────── */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between flex-shrink-0 z-20">
        
        {/* Left: Back Link & Problem Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/arena"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            title="Back to Arena"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 truncate">
            <span className="font-extrabold text-sm text-white truncate">
              {problem.title}
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800'
              }`}
            >
              {problem.difficulty}
            </span>
            {isSolved && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ✓ Solved
              </span>
            )}
          </div>
        </div>

        {/* Center/Right: Action Buttons & Student Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:border-slate-600"
          >
            {problem.topic?.includes('SQL') ? (
              <option value="sql">SQL (Alasql)</option>
            ) : null}
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="java">Java 17/21</option>
            <option value="python">Python 3</option>
          </select>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={running || submitting}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Code Button */}
          <button
            onClick={handleSubmitCode}
            disabled={running || submitting}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Testing All...' : 'Submit'}</span>
          </button>

          {/* Student Status Badge */}
          {student ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-indigo-400 bg-slate-800">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-indigo-300">
                    {student.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 transition cursor-pointer"
            >
              Sign In
            </button>
          )}

        </div>

      </header>

      {/* ─── Two-Column Split Workspace ───────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* ─── Left Column: Problem Description & Test Cases ───────────── */}
        <div className="w-full md:w-1/2 h-[45vh] md:h-auto overflow-y-auto border-r border-slate-800 bg-slate-900/90 p-6 space-y-6">
          
          {/* Problem Header */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">{problem.title}</h2>
              <span className="text-xs font-bold text-amber-400">{problem.points} XP</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Topic: {problem.topic}</div>
          </div>

          {/* Description */}
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
            {problem.description}
          </div>

          {/* Input / Output Format */}
          {problem.inputFormat && (
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Input Format</div>
              <p className="text-xs text-slate-300 font-mono whitespace-pre-line">{problem.inputFormat}</p>
            </div>
          )}

          {problem.outputFormat && (
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Output Format</div>
              <p className="text-xs text-slate-300 font-mono whitespace-pre-line">{problem.outputFormat}</p>
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && problem.constraints.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constraints</div>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400 font-mono">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Test Cases */}
          <div className="space-y-4 pt-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sample Test Cases</div>
            {problem.sampleTestCases?.map((tc, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-indigo-400">Sample Case #{idx + 1}</div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Input:</span>
                  <pre className="text-xs text-slate-200 font-mono bg-slate-900 p-2 rounded-lg mt-1 overflow-x-auto">
                    {tc.input}
                  </pre>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Output:</span>
                  <pre className="text-xs text-emerald-400 font-mono bg-slate-900 p-2 rounded-lg mt-1 overflow-x-auto">
                    {tc.output}
                  </pre>
                </div>
                {tc.explanation && (
                  <p className="text-[11px] text-slate-400 italic">
                    Explanation: {tc.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* ─── Right Column: Code Editor & Execution Console ───────────── */}
        <div className="w-full md:w-1/2 flex flex-col h-[55vh] md:h-auto overflow-hidden bg-slate-950">
          
          {/* Editor Header */}
          <div className="h-9 px-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Solution.{language === 'java' ? 'java' : language === 'python' ? 'py' : language === 'sql' ? 'sql' : 'js'}</span>
            <button
              onClick={() => {
                if (problem.starters?.[language]) setCode(problem.starters[language]);
              }}
              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Template</span>
            </button>
          </div>

          {/* Code Textarea Area */}
          <div className="flex-1 relative flex">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="w-full h-full p-4 bg-slate-950 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed resize-none outline-none focus:ring-0 border-none select-text"
              placeholder="// Type your solution here..."
              style={{ tabSize: 2 }}
            />
          </div>

          {/* ─── Bottom Console / Test Results Drawer ──────────────────── */}
          <div className="h-56 bg-slate-900 border-t border-slate-800 flex flex-col">
            
            {/* Drawer Header Tabs */}
            <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-300">Test Cases</span>
                
                {/* Status indicator */}
                {submitResults ? (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${submitResults.allPassed ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                    {submitResults.allPassed ? 'All Passed' : 'Wrong Answer'}
                  </span>
                ) : runResults ? (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${runResults.allPassed ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                    {runResults.allPassed ? 'Sample Passed' : 'Sample Failed'}
                  </span>
                ) : null}
              </div>

              {/* Case Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {activeCases.map((tc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestTab(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeTestTab === idx
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span>Case {idx + 1}</span>
                    {tc.passed === true && <span className="text-emerald-400 text-[10px]">✓</span>}
                    {tc.passed === false && <span className="text-rose-400 text-[10px]">✗</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Case Details Body */}
            <div className="flex-1 p-4 overflow-y-auto text-xs font-mono space-y-3">
              {activeCases[activeTestTab] ? (
                <div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Input:</span>
                      <pre className="p-2 rounded bg-slate-950 text-slate-300 mt-1 overflow-x-auto text-[11px]">
                        {activeCases[activeTestTab].input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Expected Output:</span>
                      <pre className="p-2 rounded bg-slate-950 text-emerald-400 mt-1 overflow-x-auto text-[11px]">
                        {activeCases[activeTestTab].expected || activeCases[activeTestTab].output}
                      </pre>
                    </div>
                  </div>

                  {activeCases[activeTestTab].actual !== undefined && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Your Output:</span>
                      <pre className={`p-2 rounded bg-slate-950 mt-1 overflow-x-auto text-[11px] ${activeCases[activeTestTab].passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {activeCases[activeTestTab].actual}
                      </pre>
                    </div>
                  )}

                  {activeCases[activeTestTab].error && (
                    <div className="p-2 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px]">
                      ⚠️ Error: {activeCases[activeTestTab].error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 text-center py-6">
                  Click <strong>Run Code</strong> or <strong>Submit</strong> to evaluate your solution.
                </div>
              )}
            </div>

          </div>

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
