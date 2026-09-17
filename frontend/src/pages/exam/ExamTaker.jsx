import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Code2,
  Check,
  X,
  Maximize2,
  Minimize2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function ExamTaker() {
  const { examId } = useParams();
  const navigate = useNavigate();

  // Core Exam State
  const [attemptId, setAttemptId] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: { selectedOptionId, textAnswer, codeAnswer } }
  const [reviewMarked, setReviewMarked] = useState(new Set()); // Set of questionIds
  const [visited, setVisited] = useState(new Set([0]));

  // Server-synchronized Timer State
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState(false);

  // Anti-Cheat Proctoring State
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [cheatWarningMsg, setCheatWarningMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const token = localStorage.getItem('exam_token');
  const timerRef = useRef(null);

  // 1. Initialize Exam on Mount
  useEffect(() => {
    if (!token) {
      navigate('/test/login');
      return;
    }

    const startExamSession = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/test/exam/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ exam_id: examId })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          alert(data.message || 'Unable to start examination.');
          navigate('/test/dashboard');
          return;
        }

        setAttemptId(data.attemptId);
        setExam(data.exam);
        setQuestions(data.questions || []);
        setRemainingSeconds(data.remainingSeconds);
        setTabSwitchCount(data.tabSwitchCount || 0);

        // Preload existing answers if resuming session
        if (data.existingAnswers && Array.isArray(data.existingAnswers)) {
          const answerMap = {};
          const reviewSet = new Set();
          data.existingAnswers.forEach(ans => {
            answerMap[ans.question_id] = {
              selectedOptionId: ans.selected_option_id,
              textAnswer: ans.answer_text || '',
              codeAnswer: ans.code_answer || ''
            };
            if (ans.is_marked_for_review) {
              reviewSet.add(ans.question_id);
            }
          });
          setAnswers(answerMap);
          setReviewMarked(reviewSet);
        }

        // Try requesting fullscreen
        try {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } catch (e) {}

      } catch (err) {
        console.error('Failed to initialize exam session:', err);
        alert('Communication error. Redirecting to dashboard.');
        navigate('/test/dashboard');
      } finally {
        setLoading(false);
      }
    };

    startExamSession();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examId, token, navigate]);

  // 2. Countdown Timer Loop
  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit(true, 'TIME_EXPIRED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [remainingSeconds]);

  // 3. Anti-Cheating Event Handler
  const reportCheatEvent = useCallback(async (eventType, details) => {
    if (!attemptId || !token) return;

    try {
      const res = await fetch('/api/test/exam/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          attempt_id: attemptId,
          event_type: eventType,
          details
        })
      });

      const data = await res.json();
      if (data.success) {
        const newCount = data.tabSwitchCount || (tabSwitchCount + 1);
        setTabSwitchCount(newCount);

        setCheatWarningMsg(
          `Security Notice: Window focus lost or tab switched! This event has been recorded on the server. (Warning count: ${newCount} of 3).`
        );
        setShowCheatWarning(true);

        if (newCount >= 3) {
          setTimeout(() => {
            handleFinalSubmit(true, 'EXCESSIVE_TAB_SWITCHING');
          }, 3500);
        }
      }
    } catch (err) {
      console.error('Error logging proctor event:', err);
    }
  }, [attemptId, token, tabSwitchCount]);

  // 4. Visibility & Blur Event Listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportCheatEvent('TAB_SWITCH', 'User switched browser tab or minimized window');
      }
    };

    const handleWindowBlur = () => {
      reportCheatEvent('WINDOW_BLUR', 'Browser window lost focus');
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        reportCheatEvent('FULLSCREEN_EXIT', 'User exited fullscreen mode');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [reportCheatEvent]);

  // Save current answer to backend
  const saveCurrentAnswerToBackend = async (qId, answerObj) => {
    if (!attemptId || !token || !qId) return;

    setSavingAnswer(true);
    try {
      await fetch('/api/test/exam/save-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          attempt_id: attemptId,
          question_id: qId,
          selected_option_id: answerObj?.selectedOptionId || null,
          answer_text: answerObj?.textAnswer || '',
          code_answer: answerObj?.codeAnswer || '',
          is_marked_for_review: reviewMarked.has(qId)
        })
      });
    } catch (err) {
      console.error('Auto-save answer error:', err);
    } finally {
      setSavingAnswer(false);
    }
  };

  // Answer modification handlers
  const handleSelectOption = (optionId) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const newAns = {
      ...(answers[currentQ.id] || {}),
      selectedOptionId: optionId
    };

    setAnswers(prev => ({ ...prev, [currentQ.id]: newAns }));
    saveCurrentAnswerToBackend(currentQ.id, newAns);
  };

  const handleTextAnswerChange = (text) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const newAns = {
      ...(answers[currentQ.id] || {}),
      textAnswer: text
    };
    setAnswers(prev => ({ ...prev, [currentQ.id]: newAns }));
  };

  const handleCodeAnswerChange = (code) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const newAns = {
      ...(answers[currentQ.id] || {}),
      codeAnswer: code
    };
    setAnswers(prev => ({ ...prev, [currentQ.id]: newAns }));
  };

  const handleClearResponse = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const cleared = { selectedOptionId: null, textAnswer: '', codeAnswer: '' };
    setAnswers(prev => ({ ...prev, [currentQ.id]: cleared }));
    saveCurrentAnswerToBackend(currentQ.id, cleared);
  };

  const toggleReviewMark = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setReviewMarked(prev => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      // Save current before moving
      const currentQ = questions[currentIndex];
      if (currentQ && answers[currentQ.id]) {
        saveCurrentAnswerToBackend(currentQ.id, answers[currentQ.id]);
      }

      setCurrentIndex(index);
      setVisited(prev => new Set(prev).add(index));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  // Submit Exam
  const handleFinalSubmit = async (isAuto = false, reason = null) => {
    if (!attemptId || !token) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/test/exam/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          attempt_id: attemptId,
          auto_submitted: isAuto,
          submission_reason: reason
        })
      });

      const data = await res.json();
      if (data.success) {
        // Exit fullscreen if active
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        navigate(`/test/result/${attemptId}`);
      } else {
        alert(data.message || 'Error completing submission.');
      }
    } catch (err) {
      console.error('Final submission error:', err);
      alert('Error submitting examination. Please contact administrator.');
    } finally {
      setSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds < 0) return '--:--';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold">Connecting to Examination Server...</h2>
        <p className="text-xs text-slate-400 mt-1">Synchronizing security protocols and question bank.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {};
  const currentAnswer = answers[currentQ.id] || {};
  const isMarked = reviewMarked.has(currentQ.id);

  // Calculate palette status helper
  const getQuestionStatus = (index) => {
    const q = questions[index];
    if (!q) return 'NOT_VISITED';
    const ans = answers[q.id];
    const hasAnswer = ans && (ans.selectedOptionId !== null && ans.selectedOptionId !== undefined || ans.textAnswer?.trim() || ans.codeAnswer?.trim());
    const marked = reviewMarked.has(q.id);

    if (marked && hasAnswer) return 'ANSWERED_AND_MARKED';
    if (marked) return 'MARKED_FOR_REVIEW';
    if (hasAnswer) return 'ANSWERED';
    if (visited.has(index)) return 'NOT_ANSWERED';
    return 'NOT_VISITED';
  };

  // Palette counts
  let answeredCount = 0;
  let markedCount = 0;
  questions.forEach((q, idx) => {
    const st = getQuestionStatus(idx);
    if (st === 'ANSWERED' || st === 'ANSWERED_AND_MARKED') answeredCount++;
    if (st === 'MARKED_FOR_REVIEW' || st === 'ANSWERED_AND_MARKED') markedCount++;
  });
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none font-sans overflow-x-hidden">
      {/* Top Test Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            PW
          </div>
          <div>
            <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {exam?.title || exam?.name || 'Online Examination'}
            </h1>
            <span className="text-[11px] text-slate-400 font-mono">
              Q {currentIndex + 1} of {questions.length} • {currentQ.subject || exam?.subject || 'Technical'}
            </span>
          </div>
        </div>

        {/* Center: Server Timer */}
        <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base ${
          remainingSeconds < 300
            ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
            : 'bg-slate-800/80 border-slate-700 text-indigo-300'
        }`}>
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>{formatTime(remainingSeconds)}</span>
        </div>

        {/* Right: Fullscreen & Status */}
        <div className="flex items-center space-x-3">
          {tabSwitchCount > 0 && (
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-rose-400 bg-rose-950/60 border border-rose-800 px-2.5 py-1 rounded-lg">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Warnings: {tabSwitchCount}/3</span>
            </div>
          )}

          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Body Grid: Left Question Area + Right Question Palette */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative min-h-[580px] justify-between">
          <div>
            {/* Question Top Info: Badge, Marks */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-base">Question {currentIndex + 1}</span>
                <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                  {currentQ.type || currentQ.question_type || 'MCQ'}
                </span>
                {currentQ.difficulty && (
                  <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                    {currentQ.difficulty}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <span className="text-emerald-400 font-semibold">+{currentQ.marks || 1} mark</span>
                {exam?.negative_marking && currentQ.negative_marks > 0 && (
                  <span className="text-rose-400 font-semibold">-{currentQ.negative_marks} neg</span>
                )}
                {savingAnswer && (
                  <span className="text-[11px] text-slate-400 italic">saving...</span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base text-slate-100 font-medium leading-relaxed mb-6 whitespace-pre-line">
              {currentQ.question_text || currentQ.statement}
            </div>

            {/* Code Snippet Box (For CODE_ERROR questions or questions with code) */}
            {(currentQ.code || currentQ.code_snippet) && (
              <div className="mb-6 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner font-mono text-xs">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span>{currentQ.programming_language || 'Source Code Snippet'}</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Inspect for Defects</span>
                </div>
                <pre className="p-4 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                  <code>{currentQ.code || currentQ.code_snippet}</code>
                </pre>
              </div>
            )}

            {/* Answer Input Area By Type */}
            {/* 1. MCQ Options */}
            {(currentQ.type === 'MCQ' || currentQ.question_type === 'MCQ') && (
              <div className="space-y-3 mb-6">
                {(currentQ.options || []).map((opt, idx) => {
                  const isSelected = currentAnswer.selectedOptionId === opt.id;
                  const keyLetter = opt.option_key || String.fromCharCode(65 + idx);

                  return (
                    <div
                      key={opt.id || idx}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-center p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'bg-indigo-950/70 border-indigo-500 text-white ring-1 ring-indigo-500 shadow-md'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs mr-3.5 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {keyLetter}
                      </div>
                      <span className="text-sm font-medium flex-1 leading-snug">{opt.option_text}</span>
                      {isSelected && <Check className="w-5 h-5 text-indigo-400 ml-2 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. True / False */}
            {(currentQ.type === 'TRUE_FALSE' || currentQ.question_type === 'TRUE_FALSE') && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {(currentQ.options && currentQ.options.length > 0 ? currentQ.options : [
                  { id: 'true_opt', option_text: 'True' },
                  { id: 'false_opt', option_text: 'False' }
                ]).map((opt) => {
                  const isSelected = currentAnswer.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`py-4 px-6 rounded-2xl border font-bold text-sm text-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {opt.option_text}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 3. Descriptive / Q&A */}
            {(currentQ.type === 'DESCRIPTIVE' || currentQ.question_type === 'DESCRIPTIVE') && (
              <div className="mb-6 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Type your detailed solution / explanation:
                </label>
                <textarea
                  rows={6}
                  value={currentAnswer.textAnswer || ''}
                  onChange={(e) => handleTextAnswerChange(e.target.value)}
                  onBlur={() => saveCurrentAnswerToBackend(currentQ.id, currentAnswer)}
                  placeholder="Provide your comprehensive academic answer here..."
                  className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans leading-relaxed"
                />
                <div className="flex justify-between text-[11px] text-slate-500 px-1">
                  <span>Characters: {(currentAnswer.textAnswer || '').length}</span>
                  <span>Auto-saved on blur or next</span>
                </div>
              </div>
            )}

            {/* 4. Code Error Question */}
            {(currentQ.type === 'CODE_ERROR' || currentQ.question_type === 'CODE_ERROR') && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    1. Explain the error / bug in the code above: <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={currentAnswer.textAnswer || ''}
                    onChange={(e) => handleTextAnswerChange(e.target.value)}
                    onBlur={() => saveCurrentAnswerToBackend(currentQ.id, currentAnswer)}
                    placeholder="Describe line number, defect type (compile error, logical bug, runtime exception), and rationale..."
                    className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    2. Corrected Code Snippet (Optional / Bonus):
                  </label>
                  <textarea
                    rows={4}
                    value={currentAnswer.codeAnswer || ''}
                    onChange={(e) => handleCodeAnswerChange(e.target.value)}
                    onBlur={() => saveCurrentAnswerToBackend(currentQ.id, currentAnswer)}
                    placeholder="// Write the fixed code snippet here..."
                    className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleReviewMark}
                className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  isMarked
                    ? 'bg-purple-950 text-purple-300 border-purple-600'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 mr-1.5" />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>

              <button
                type="button"
                onClick={handleClearResponse}
                className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Clear</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(true)}
                  className="inline-flex items-center px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Submit Exam</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Palette (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
          {/* Palette Legend */}
          <div className="mb-4 pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">Question Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></span>
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-purple-600"></span>
                <span>Review ({markedCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded border-2 border-indigo-400"></span>
                <span>Current</span>
              </div>
            </div>
          </div>

          {/* Palette Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1 mb-6">
            {questions.map((q, idx) => {
              const status = getQuestionStatus(idx);
              const isCurrent = currentIndex === idx;

              let bgClass = 'bg-slate-800/80 text-slate-300 border-slate-700';
              if (status === 'ANSWERED') bgClass = 'bg-emerald-600 text-white border-emerald-500 font-semibold';
              else if (status === 'MARKED_FOR_REVIEW') bgClass = 'bg-purple-600 text-white border-purple-500 font-semibold';
              else if (status === 'ANSWERED_AND_MARKED') bgClass = 'bg-purple-700 text-emerald-300 border-emerald-400 font-bold';
              else if (status === 'NOT_ANSWERED') bgClass = 'bg-slate-800 text-rose-300 border-rose-900/60';

              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => goToQuestion(idx)}
                  className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-all ${bgClass} ${
                    isCurrent ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 scale-105 shadow-md' : 'hover:opacity-90'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Big Finish & Submit Button */}
          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Finish & Submit Examination</span>
          </button>
        </div>
      </div>

      {/* Anti-Cheat Alert Modal */}
      {showCheatWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-rose-950 border-2 border-rose-600 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-rose-900 text-rose-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-rose-300 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Proctoring Violation Warning</h3>
            <p className="text-xs text-rose-200 mb-6 leading-relaxed">
              {cheatWarningMsg}
            </p>
            <button
              onClick={() => {
                setShowCheatWarning(false);
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-colors"
            >
              I Understand - Return to Examination
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Submit Examination?</h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Once submitted, your answers will be finalized and evaluated by the server.
            </p>

            {/* Summary badges */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs mb-6">
              <div className="text-left p-1">
                <span className="text-slate-500 block text-[10px]">Answered:</span>
                <span className="text-emerald-400 font-bold text-base">{answeredCount}</span>
              </div>
              <div className="text-left p-1">
                <span className="text-slate-500 block text-[10px]">Unanswered:</span>
                <span className="text-rose-400 font-bold text-base">{unansweredCount}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Back to Test
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFinalSubmit(false, 'CANDIDATE_CONFIRMED')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
              >
                {submitting ? (
                  <span>Evaluating...</span>
                ) : (
                  <span>Confirm Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
