import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Volume2, VolumeX, Clock, Users, PhoneCall, HelpCircle, 
  RotateCcw, Award, LogOut, CheckCircle2, XCircle, Sparkles, 
  AlertTriangle, ArrowRight, Settings, Download, Printer, ShieldCheck,
  Laptop, Radio, Wifi, UserCheck, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { kbcAudio } from '../../utils/kbcAudio.js';
import { 
  KBC_PRIZE_LADDER, 
  DEFAULT_MERN_SQL_QUESTIONS, 
  AMITABH_QUOTES, 
  EXPERT_FRIENDS 
} from '../../data/kbcQuestions.js';

export default function KbcExam() {
  const navigate = useNavigate();

  // ── Participation Mode: 'SOLO' (practice hotseat) vs 'TEAM' (Admin-controlled live laptop) ──
  const [playMode, setPlayMode] = useState(() => {
    return localStorage.getItem('kbc_team') ? 'TEAM' : 'SOLO';
  });

  // Team Laptop Session State
  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem('kbc_team');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [teamAccessCodeInput, setTeamAccessCodeInput] = useState('');
  const [teamJoinLoading, setTeamJoinLoading] = useState(false);
  const [teamJoinError, setTeamJoinError] = useState('');
  const [teamAnswerSubmitted, setTeamAnswerSubmitted] = useState(false);

  // Admin Live Session Polled State
  const [adminSession, setAdminSession] = useState({
    status: 'INACTIVE', // 'INACTIVE' | 'WAITING' | 'LIVE' | 'COMPLETED'
    show_in_navbar: false,
    current_level: 1,
    current_question_id: null,
    is_locked: false,
    locked_option: null,
    revealed_correct: null,
    current_question: null
  });

  // Questions State
  const [questions, setQuestions] = useState([]);
  const [flipPool, setFlipPool] = useState({});
  const [currentLevel, setCurrentLevel] = useState(1); // 1 to 16
  const [loading, setLoading] = useState(true);

  // Player / Game State (Solo Mode)
  const [playerName, setPlayerName] = useState(() => {
    try {
      const stored = localStorage.getItem('exam_student') || localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        return u.name || u.fullName || 'Hotseat Contestant';
      }
    } catch (e) {}
    return 'Hotseat Contestant';
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(0);
  const [earnedPrizeLabel, setEarnedPrizeLabel] = useState('₹0');
  const [safeWonAmount, setSafeWonAmount] = useState(0);
  const [safeWonPrizeLabel, setSafeWonPrizeLabel] = useState('₹0');
  const [quitGame, setQuitGame] = useState(false);

  // Lifelines State
  const [lifelines, setLifelines] = useState({
    fifty: true,
    poll: true,
    friend: true,
    flip: true
  });
  const [eliminatedOptions, setEliminatedOptions] = useState([]); // indices eliminated by 50:50
  const [activeModal, setActiveModal] = useState(null); // 'poll' | 'friend' | 'quit' | 'cheque'
  const [pollData, setPollData] = useState(null);
  const [expertAdvice, setExpertAdvice] = useState(null);

  // Selection & Lock State
  const [selectedOption, setSelectedOption] = useState(null); // 0, 1, 2, 3
  const [isLocked, setIsLocked] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null); // 'evaluating' | 'correct' | 'wrong'
  const [revealedCorrect, setRevealedCorrect] = useState(null);

  // Timer State (Tik-Tiki Ji)
  const [timeLeft, setTimeLeft] = useState(45);
  const timerRef = useRef(null);

  // Host Dialogue
  const [hostQuote, setHostQuote] = useState(AMITABH_QUOTES.welcome[0]);
  const [isMuted, setIsMuted] = useState(false);

  // ── Poll Live Session Status from Hostinger MySQL (Every 2.5s) ──
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/kbc/session/status');
        const data = await res.json();
        if (isMounted && data.success && data.session) {
          setAdminSession(data.session);

          // If playing in team mode, synchronize level & host states
          if (team) {
            const sess = data.session;
            if (sess.current_level && sess.current_level !== currentLevel) {
              setCurrentLevel(sess.current_level);
              setSelectedOption(null);
              setIsLocked(false);
              setAnswerStatus(null);
              setRevealedCorrect(null);
              setTeamAnswerSubmitted(false);
            }

            if (sess.is_locked) {
              setIsLocked(true);
              if (sess.locked_option !== null && sess.locked_option !== undefined) {
                setSelectedOption(sess.locked_option);
              }
              setAnswerStatus('evaluating');
            }

            if (sess.revealed_correct !== null && sess.revealed_correct !== undefined) {
              setRevealedCorrect(sess.revealed_correct);
              const isCorrect = selectedOption === sess.revealed_correct;
              setAnswerStatus(isCorrect ? 'correct' : 'wrong');
              if (isCorrect) {
                kbcAudio.playCorrect();
              } else if (selectedOption !== null) {
                kbcAudio.playWrong();
              }
            }
          }
        }
      } catch (e) {}
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [team, currentLevel, selectedOption]);

  // Load Questions (from Hostinger MySQL API, with robust local fallback)
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kbc/questions');
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length >= 16) {
        setQuestions(data.questions);
        setFlipPool(data.flipPool || {});
      } else {
        loadFallbackQuestions();
      }
    } catch (e) {
      console.warn('Using local fallback MERN & SQL questions:', e);
      loadFallbackQuestions();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackQuestions = () => {
    const list = [];
    const pool = {};
    for (let lvl = 1; lvl <= 16; lvl++) {
      const savedActiveId = localStorage.getItem(`kbc_admin_active_lvl_${lvl}`);
      const levelQuestions = DEFAULT_MERN_SQL_QUESTIONS[lvl] || [];
      const selected = levelQuestions.find(q => q.id === savedActiveId) || levelQuestions[0];
      const alternate = levelQuestions.find(q => q.id !== selected.id) || null;

      list.push({
        level: lvl,
        id: selected.id,
        topic: selected.topic,
        question: selected.question,
        options: selected.options,
        correct: selected.correct,
        explanation: selected.explanation
      });
      pool[lvl] = alternate;
    }
    setQuestions(list);
    setFlipPool(pool);
  };

  // ── Team Login from Contestant Laptop ──
  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setTeamJoinError('');
    if (!teamAccessCodeInput.trim()) {
      setTeamJoinError('Please enter your Team Access Code.');
      return;
    }

    setTeamJoinLoading(true);
    try {
      const laptopInfo = `${navigator.platform || 'Laptop'} (${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'})`;
      const res = await fetch('/api/kbc/team/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_code: teamAccessCodeInput.trim().toUpperCase(),
          laptop_info: laptopInfo
        })
      });
      const data = await res.json();
      if (data.success && data.team) {
        setTeam(data.team);
        localStorage.setItem('kbc_team', JSON.stringify(data.team));
        setPlayMode('TEAM');
        kbcAudio.init();
        kbcAudio.playLifeline();
      } else {
        setTeamJoinError(data.message || 'Invalid Team Access Code.');
      }
    } catch (err) {
      setTeamJoinError('Unable to connect to live game server. Please try again.');
    } finally {
      setTeamJoinLoading(false);
    }
  };

  const handleDisconnectTeam = () => {
    localStorage.removeItem('kbc_team');
    setTeam(null);
    setPlayMode('SOLO');
    setTeamAnswerSubmitted(false);
  };

  // ── Submit Laptop Option to Admin Monitor ──
  const handleSubmitTeamOption = async (idx) => {
    if (!team || isLocked) return;
    setSelectedOption(idx);
    kbcAudio.playSelect();

    try {
      const res = await fetch('/api/kbc/team/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: team.id,
          option_index: idx
        })
      });
      const data = await res.json();
      if (data.success) {
        setTeamAnswerSubmitted(true);
        const letter = String.fromCharCode(65 + idx);
        setHostQuote(`Team ${team.team_name} ne Option ${letter} chuna hai! Admin monitor par aapka uttar darj ho chuka hai.`);
      }
    } catch (e) {}
  };

  // Timer Effect
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon || isLocked) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // No timer for Q11 to Q16 (Real KBC Rule)
    if (currentLevel > 10) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const maxTime = currentLevel <= 5 ? 45 : 60;
    setTimeLeft(maxTime);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev <= 10) {
          kbcAudio.playTick(true);
        } else {
          kbcAudio.playTick(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, currentLevel, isLocked, gameOver, gameWon]);

  // Handle Timeout (Tik-Tiki Ji ends time)
  const handleTimeOut = () => {
    kbcAudio.playWrong();
    setAnswerStatus('wrong');
    setHostQuote(AMITABH_QUOTES.timeOut);
    finishGame(false, true);
  };

  // Current Question Object (Live Host broadcast in Team mode or Level Question in Solo)
  const currentQ = (team && adminSession.current_question) 
    ? adminSession.current_question 
    : (questions[currentLevel - 1] || null);
  const currentPrize = KBC_PRIZE_LADDER[currentLevel - 1] || KBC_PRIZE_LADDER[0];

  // Start the Game
  const handleStartGame = () => {
    kbcAudio.init();
    kbcAudio.playLifeline();
    setGameStarted(true);
    setHostQuote(AMITABH_QUOTES.questionIntro(currentLevel, currentPrize.prize));
    kbcAudio.startDrone();
  };

  // Option Click
  const handleOptionClick = (idx) => {
    if (isLocked || eliminatedOptions.includes(idx)) return;
    kbcAudio.playSelect();
    setSelectedOption(idx);
    const letter = String.fromCharCode(65 + idx);
    const optionText = currentQ?.options?.[idx] || '';
    setHostQuote(AMITABH_QUOTES.optionSelected(letter, optionText));
    if (team) {
      handleSubmitTeamOption(idx);
    }
  };

  // Confirm Lock Option ("Computer Ji, option [X] ko lock kiya jaye!")
  const handleLockOption = () => {
    if (selectedOption === null || isLocked) return;
    setIsLocked(true);
    setAnswerStatus('evaluating');
    kbcAudio.playLock();
    const letter = String.fromCharCode(65 + selectedOption);
    setHostQuote(AMITABH_QUOTES.lockConfirmed(letter));

    if (team) {
      handleSubmitTeamOption(selectedOption);
      return;
    }

    // Dramatic Suspense Beat (2.2 seconds suspense) in Solo Mode
    setTimeout(() => {
      evaluateAnswer();
    }, 2200);
  };

  // Evaluate Locked Answer
  const evaluateAnswer = () => {
    const isCorrect = selectedOption === currentQ.correct;
    setRevealedCorrect(currentQ.correct);

    if (isCorrect) {
      // Correct!
      kbcAudio.playCorrect();
      setAnswerStatus('correct');
      const winAmount = currentPrize.amount;
      const winLabel = currentPrize.prize;
      setEarnedAmount(winAmount);
      setEarnedPrizeLabel(winLabel);

      // Check if it's a Padav (Safe Milestone)
      if (currentPrize.isSafe) {
        setSafeWonAmount(winAmount);
        setSafeWonPrizeLabel(winLabel);
      }

      // 7 Crore Jackpot check!
      if (currentLevel === 16) {
        handleJackpotWin();
        return;
      }

      // Host Quote & Wait for Next Question
      if (currentPrize.isSafe) {
        setHostQuote(AMITABH_QUOTES.padavCleared(winLabel));
        triggerConfetti(0.4);
      } else {
        const randomQuote = AMITABH_QUOTES.correctAnswer[Math.floor(Math.random() * AMITABH_QUOTES.correctAnswer.length)];
        setHostQuote(randomQuote);
      }

      // Automatically transition to next question after 3.2 seconds
      setTimeout(() => {
        advanceToNextLevel();
      }, 3200);

    } else {
      // Wrong Answer!
      kbcAudio.playWrong();
      setAnswerStatus('wrong');
      const correctLetter = String.fromCharCode(65 + currentQ.correct);
      setHostQuote(AMITABH_QUOTES.wrongAnswer(correctLetter));
      finishGame(false, false);
    }
  };

  // Advance to Next Level
  const advanceToNextLevel = () => {
    const nextLvl = currentLevel + 1;
    setCurrentLevel(nextLvl);
    setSelectedOption(null);
    setIsLocked(false);
    setAnswerStatus(null);
    setRevealedCorrect(null);
    setEliminatedOptions([]);
    const nextPrize = KBC_PRIZE_LADDER[nextLvl - 1];
    setHostQuote(AMITABH_QUOTES.questionIntro(nextLvl, nextPrize.prize));
  };

  // Jackpot Win (₹7 Crore!)
  const handleJackpotWin = () => {
    kbcAudio.playFanfare();
    setGameWon(true);
    setGameOver(true);
    setHostQuote(AMITABH_QUOTES.crorepati);
    triggerGrandConfetti();
    setTimeout(() => {
      setActiveModal('cheque');
    }, 2500);
  };

  // Finish Game (Loss or Quit)
  const finishGame = (isQuit = false, isTimeOut = false) => {
    kbcAudio.stopDrone();
    setGameOver(true);
    if (isQuit) {
      setQuitGame(true);
      kbcAudio.playQuit();
      setHostQuote(AMITABH_QUOTES.quitSuccess(earnedPrizeLabel));
    }
    setTimeout(() => {
      setActiveModal('cheque');
    }, 2500);
  };

  // ── LIFELINES IMPLEMENTATION ──

  // 1. 50:50 Lifeline
  const useFiftyFifty = () => {
    if (!lifelines.fifty || isLocked || !currentQ) return;
    kbcAudio.playLifeline();
    setLifelines(prev => ({ ...prev, fifty: false }));
    setHostQuote(AMITABH_QUOTES.lifelines.fifty);

    // Keep correct answer, pick 1 wrong answer to keep, eliminate remaining 2
    const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== currentQ.correct);
    // Shuffle wrong indices
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
    const toEliminate = shuffledWrong.slice(0, 2);
    setEliminatedOptions(toEliminate);

    if (toEliminate.includes(selectedOption)) {
      setSelectedOption(null);
    }
  };

  // 2. Audience Poll Lifeline
  const useAudiencePoll = () => {
    if (!lifelines.poll || isLocked || !currentQ) return;
    kbcAudio.playLifeline();
    setLifelines(prev => ({ ...prev, poll: false }));
    setHostQuote(AMITABH_QUOTES.lifelines.poll);

    // Generate realistic audience votes favoring correct answer based on level
    const correctIdx = currentQ.correct;
    let correctWeight = Math.max(45, 85 - currentLevel * 2.5); // High probability for easy, lower for hard
    let remaining = 100 - correctWeight;
    
    // Distribute remaining among other 3
    const others = [0, 1, 2, 3].filter(i => i !== correctIdx);
    const r1 = Math.floor(Math.random() * (remaining * 0.5));
    const r2 = Math.floor(Math.random() * (remaining - r1));
    const r3 = remaining - r1 - r2;

    const poll = {};
    poll[correctIdx] = correctWeight;
    poll[others[0]] = r1;
    poll[others[1]] = r2;
    poll[others[2]] = r3;

    setPollData(poll);
    setActiveModal('poll');
  };

  // 3. Phone-a-Friend / Video Call Lifeline
  const usePhoneAFriend = () => {
    if (!lifelines.friend || isLocked || !currentQ) return;
    kbcAudio.playLifeline();
    setLifelines(prev => ({ ...prev, friend: false }));
    setHostQuote(AMITABH_QUOTES.lifelines.friend);

    const expert = EXPERT_FRIENDS[Math.floor(Math.random() * EXPERT_FRIENDS.length)];
    const correctLetter = String.fromCharCode(65 + currentQ.correct);
    const isConfident = currentLevel <= 11;
    const adviceText = expert.advice(correctLetter, isConfident);

    setExpertAdvice({
      ...expert,
      adviceText
    });
    setActiveModal('friend');
  };

  // 4. Flip the Question Lifeline
  const useFlipQuestion = () => {
    if (!lifelines.flip || isLocked || !currentQ) return;
    const replacement = flipPool[currentLevel];
    if (!replacement) {
      alert('No alternate question available for this level.');
      return;
    }

    kbcAudio.playLifeline();
    setLifelines(prev => ({ ...prev, flip: false }));
    setHostQuote(AMITABH_QUOTES.lifelines.flip);

    // Swap in the replacement question
    setQuestions(prev => {
      const copy = [...prev];
      copy[currentLevel - 1] = {
        level: currentLevel,
        id: replacement.id,
        topic: replacement.topic,
        question: replacement.question,
        options: replacement.options,
        correct: replacement.correct,
        explanation: replacement.explanation
      };
      return copy;
    });

    setSelectedOption(null);
    setEliminatedOptions([]);
    setIsLocked(false);
    setAnswerStatus(null);
    setRevealedCorrect(null);
  };

  // Sound Mute Toggle
  const toggleSound = () => {
    const muted = kbcAudio.toggleMute();
    setIsMuted(muted);
  };

  // Confetti Animations
  const triggerConfetti = (ratio = 0.5) => {
    try {
      confetti({
        particleCount: Math.floor(100 * ratio),
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const triggerGrandConfetti = () => {
    try {
      const duration = 4000;
      const end = Date.now() + duration;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
      }, 250);
    } catch (e) {}
  };

  // Reset / Play Again
  const handlePlayAgain = () => {
    kbcAudio.stopDrone();
    setCurrentLevel(1);
    setGameStarted(false);
    setGameOver(false);
    setGameWon(false);
    setEarnedAmount(0);
    setEarnedPrizeLabel('₹0');
    setSafeWonAmount(0);
    setSafeWonPrizeLabel('₹0');
    setQuitGame(false);
    setSelectedOption(null);
    setIsLocked(false);
    setAnswerStatus(null);
    setRevealedCorrect(null);
    setEliminatedOptions([]);
    setActiveModal(null);
    setLifelines({ fifty: true, poll: true, friend: true, flip: true });
    fetchQuestions();
  };

  // Calculate final money to take home
  const finalChequeAmount = quitGame 
    ? earnedPrizeLabel 
    : gameWon 
    ? '₹7 Crore' 
    : (safeWonPrizeLabel !== '₹0' ? safeWonPrizeLabel : '₹0');

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-between relative overflow-hidden select-none font-sans">
      
      {/* ── Background Deep Studio Ambience ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,38,100,0.45)_0%,rgba(2,6,23,0.95)_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.3)_0%,rgba(2,6,23,0.9)_100%)] pointer-events-none" />
      {/* Circular studio stage floor effect */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[850px] h-[360px] rounded-[100%] bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* ── Top Header Bar: Logo, Lifelines, Timer, Controls ── */}
      <header className="relative z-20 border-b border-indigo-900/50 bg-black/40 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Hotseat Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black flex items-center justify-center text-lg shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
                ₹
              </span>
              <div>
                <span className="text-xs font-black tracking-widest text-amber-400 block uppercase">
                  Kaun Banega Crorepati
                </span>
                <span className="text-[11px] font-bold text-slate-400 tracking-tight block">
                  MERN & SQL Grand Exam Hotseat
                </span>
              </div>
            </Link>

            {/* Team Laptop Connected Pill */}
            {team && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/90 border border-amber-400/60 text-xs shadow-md">
                <Laptop className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300">Team: <strong className="text-amber-300">{team.team_name}</strong></span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 font-mono font-bold">{team.access_code}</span>
                <button
                  onClick={handleDisconnectTeam}
                  className="text-red-400 hover:text-red-300 text-[10px] font-bold ml-1 hover:underline cursor-pointer"
                  title="Disconnect Laptop"
                >
                  Exit
                </button>
              </div>
            )}

            {/* Live Broadcast Indicator */}
            {adminSession.status === 'LIVE' && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/60 text-red-300 text-[10px] font-black uppercase tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                Live Broadcast
              </span>
            )}
          </div>

          {/* 4 Lifelines (Real KBC Icons - Active in Solo or Live Game) */}
          {(gameStarted || (team && adminSession.status === 'LIVE')) && !gameOver && (
            <div className="flex items-center gap-2 md:gap-3">
              {/* 50:50 */}
              <button
                onClick={useFiftyFifty}
                disabled={!lifelines.fifty || isLocked}
                title="50:50 Lifeline (Eliminate 2 wrong answers)"
                className={`relative px-3 py-1.5 rounded-full border text-xs font-black tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                  lifelines.fifty && !isLocked
                    ? 'bg-indigo-950/80 border-amber-400/80 text-amber-300 hover:bg-amber-500/20 shadow-md shadow-amber-500/10 hover:scale-105'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed line-through'
                }`}
              >
                <span>50:50</span>
              </button>

              {/* Audience Poll */}
              <button
                onClick={useAudiencePoll}
                disabled={!lifelines.poll || isLocked}
                title="Audience Poll (Janmat Sangrah)"
                className={`relative px-3 py-1.5 rounded-full border text-xs font-black tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                  lifelines.poll && !isLocked
                    ? 'bg-indigo-950/80 border-amber-400/80 text-amber-300 hover:bg-amber-500/20 shadow-md shadow-amber-500/10 hover:scale-105'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Poll</span>
              </button>

              {/* Phone-A-Friend */}
              <button
                onClick={usePhoneAFriend}
                disabled={!lifelines.friend || isLocked}
                title="Ask Tech Expert / Phone-a-Friend"
                className={`relative px-3 py-1.5 rounded-full border text-xs font-black tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                  lifelines.friend && !isLocked
                    ? 'bg-indigo-950/80 border-amber-400/80 text-amber-300 hover:bg-amber-500/20 shadow-md shadow-amber-500/10 hover:scale-105'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Expert</span>
              </button>

              {/* Flip the Question */}
              <button
                onClick={useFlipQuestion}
                disabled={!lifelines.flip || isLocked}
                title="Flip Question (Switch Question)"
                className={`relative px-3 py-1.5 rounded-full border text-xs font-black tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                  lifelines.flip && !isLocked
                    ? 'bg-indigo-950/80 border-amber-400/80 text-amber-300 hover:bg-amber-500/20 shadow-md shadow-amber-500/10 hover:scale-105'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flip</span>
              </button>
            </div>
          )}

          {/* Right Controls: Audio Mute, Admin Link, Quit */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <Link
              to="/dashboard/admin/tests"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 text-xs font-semibold flex items-center gap-1 transition"
              title="Admin Question Suite"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </Link>

            {gameStarted && !gameOver && !team && (
              <button
                onClick={() => setActiveModal('quit')}
                disabled={isLocked}
                className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold transition cursor-pointer"
              >
                Quit / Chhodna
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Arena: Host, Question, Options, and Money Ladder ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col justify-between">
        
        {/* CASE 1: Connected Team Waiting for Admin to start Live Broadcast */}
        {team && adminSession.status !== 'LIVE' ? (
          <div className="my-auto max-w-2xl mx-auto text-center space-y-6 bg-gradient-to-b from-[#0b132e]/95 to-[#060a1d]/95 border-2 border-amber-400/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
            
            {/* Host Avatar with Live Broadcast Pulse */}
            <div className="relative inline-block mx-auto">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-xl shadow-amber-500/30">
                <img
                  src="/kbc-host.jpg"
                  alt="Amitabh Bachchan KBC Host"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Host
              </span>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/50 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live Hotseat Broadcast Lounge
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100">
                Swagat Hai, {team.team_name}!
              </h2>
              <p className="text-amber-400/90 font-bold text-xs uppercase tracking-widest">
                Team Leader: {team.leader_name} • Access Code: <span className="font-mono text-white bg-slate-900 px-2 py-0.5 rounded">{team.access_code}</span>
              </p>
            </div>

            {/* Standby Status Card */}
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
                <span className="text-xs text-slate-400 font-bold">Broadcast Status:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Standby / Waiting for Admin Host
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Round in Queue:</span>
                <span className="text-amber-300 font-black">
                  Level {adminSession.current_level || 1} ({KBC_PRIZE_LADDER[(adminSession.current_level || 1) - 1]?.prize})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Your Connected Device:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {navigator.platform || 'Laptop'} (Live Synced)
                </span>
              </div>

              <p className="text-xs text-slate-300 pt-2 leading-relaxed italic border-t border-indigo-900/40">
                "Kripya screen par bane rahein. Jaise hi Admin apne screen se 'Confirm & Start KBC Live' par click karenge, prashna aapke laptop par seedha prakat ho jayega!"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setPlayMode('SOLO');
                  handleStartGame();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-400/40 text-amber-300 font-bold text-xs cursor-pointer transition"
              >
                Practice in Solo Hotseat Mode
              </button>
              <button
                onClick={handleDisconnectTeam}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs cursor-pointer transition"
              >
                Disconnect Team
              </button>
            </div>
          </div>
        ) : !gameStarted && !team ? (
          /* CASE 2: Welcome Gate (Join as Team OR Play Solo) */
          <div className="my-auto max-w-3xl mx-auto space-y-6">
            
            {/* Header / Amitabh Quote */}
            <div className="text-center space-y-3 bg-gradient-to-b from-[#0b132e]/95 to-[#060a1d]/95 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="relative inline-block mx-auto">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-xl shadow-amber-500/30">
                  <img
                    src="/kbc-host.jpg"
                    alt="Amitabh Bachchan KBC Host"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Host
                </span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100">
                  KAUN BANEGA CROREPATI
                </h1>
                <p className="text-amber-400/90 font-bold text-xs tracking-widest uppercase">
                  MERN Stack & SQL Grand Examination Hotseat
                </p>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto pt-1 leading-relaxed">
                  Participate live with your laptop in the Admin-controlled classroom competition, or take the solo 16-level hotseat challenge for ₹7 Crore!
                </p>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="grid grid-cols-2 gap-3 pt-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setPlayMode('TEAM')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    playMode === 'TEAM'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                  <span>Join Team via Laptop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlayMode('SOLO')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    playMode === 'SOLO'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Solo Hotseat Mode</span>
                </button>
              </div>

              {/* FORM: Team Access Code Entry */}
              {playMode === 'TEAM' ? (
                <form onSubmit={handleJoinTeam} className="pt-4 max-w-md mx-auto space-y-4 text-left">
                  <div className="bg-slate-950/80 border border-amber-400/40 rounded-2xl p-5 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
                        Enter Team Access Code
                      </label>
                      <input
                        type="text"
                        value={teamAccessCodeInput}
                        onChange={e => setTeamAccessCodeInput(e.target.value)}
                        placeholder="e.g. KBC-101"
                        className="w-full bg-slate-900 border border-amber-400/50 rounded-xl px-4 py-3 text-white font-mono font-black text-center text-lg tracking-widest uppercase focus:outline-none focus:border-amber-300"
                        autoFocus
                      />
                      <span className="text-[11px] text-slate-400 block mt-1.5">
                        Ask your Exam Admin or Teacher for your Team Access Code.
                      </span>
                    </div>

                    {teamJoinError && (
                      <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{teamJoinError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={teamJoinLoading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition transform hover:scale-[1.02] cursor-pointer"
                    >
                      {teamJoinLoading ? 'Connecting Laptop...' : 'Connect to Live Hotseat →'}
                    </button>
                  </div>
                </form>
              ) : (
                /* FORM: Solo Hotseat Launch */
                <div className="pt-4 max-w-md mx-auto space-y-4 text-left">
                  <div className="bg-slate-950/80 border border-amber-400/40 rounded-2xl p-5 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
                        Contestant Name
                      </label>
                      <input
                        type="text"
                        value={playerName}
                        onChange={e => setPlayerName(e.target.value)}
                        className="w-full bg-slate-900 border border-amber-400/50 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-amber-300"
                        placeholder="Enter your name"
                      />
                    </div>

                    {/* Milestones Preview */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Padav 1</span>
                        <span className="text-amber-300 font-bold">₹10,000</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Padav 2</span>
                        <span className="text-amber-300 font-bold">₹3,20,000</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-amber-500/40">
                        <span className="text-amber-400 text-[10px] block font-bold">Jackpot</span>
                        <span className="text-yellow-400 font-black">₹7 Crore</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartGame}
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition transform hover:scale-[1.02] cursor-pointer"
                    >
                      {loading ? 'Preparing Hotseat...' : 'Aaiye Khelte Hain KBC! →'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* CASE 3: Live KBC Arena (Active in Solo OR when Team is LIVE) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
            
            {/* Left 9 Columns: Host speech, Timer, Hexagonal Question, and Hexagonal 4 Options */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Host Quote Bubble & Timer Row */}
              <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-slate-950/50 border border-indigo-900/40 rounded-2xl p-4 backdrop-blur-sm">
                
                {/* Host Avatar & Speech Bubble */}
                <div className="flex items-center gap-3.5 flex-1">
                  <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 shrink-0 shadow-md">
                    <img
                      src="/kbc-host.jpg"
                      alt="Host"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                      Amitabh Bachchan (Host)
                    </span>
                    <p className="text-xs md:text-sm text-slate-200 font-medium italic">
                      "{hostQuote}"
                    </p>
                  </div>
                </div>

                {/* Tik-Tiki Ji (Timer) */}
                {currentLevel <= 10 ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-amber-400/30 shrink-0">
                    <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-400 animate-spin' : 'text-amber-400'}`} />
                    <span className="text-xs text-slate-400 font-bold uppercase">Tik-Tiki Ji:</span>
                    <span className={`text-xl font-black font-mono ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                      {timeLeft}s
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>No Time Limit (Shanti se sochiye)</span>
                  </div>
                )}
              </div>

              {/* ── THE ICONIC HEXAGONAL QUESTION BAR (Matching reference image) ── */}
              <div className="relative w-full py-2">
                {/* Horizontal golden connector lines */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent -translate-y-1/2 pointer-events-none" />

                <div 
                  className="relative mx-auto w-full max-w-4xl px-8 py-5 text-center transition-all"
                  style={{
                    background: 'linear-gradient(180deg, #1d1847 0%, #0d0b27 100%)',
                    border: '2px solid #d4af37',
                    boxShadow: '0 0 25px rgba(212, 175, 55, 0.25), inset 0 0 15px rgba(100, 60, 200, 0.3)',
                    clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)'
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                      Question {currentLevel} for {currentPrize.prize}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono">
                      {currentQ?.topic}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-relaxed px-4">
                    {currentQ?.question}
                  </h2>
                </div>
              </div>

              {/* ── 4 HEXAGONAL OPTIONS (2x2 Grid with exact shape & gold borders) ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto pt-2">
                {currentQ?.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === idx;
                  const isEliminated = eliminatedOptions.includes(idx);
                  const isCorrect = revealedCorrect === idx;
                  const isWrongSelected = answerStatus === 'wrong' && isSelected;

                  // Dynamic appearance based on state
                  let bgGradient = 'linear-gradient(180deg, #17133b 0%, #0c0a22 100%)';
                  let borderColor = '#9370db';
                  let textColor = 'text-white';
                  let glowShadow = '0 0 10px rgba(147, 112, 219, 0.2)';

                  if (isEliminated) {
                    return (
                      <div 
                        key={idx} 
                        className="opacity-15 pointer-events-none py-3.5 px-6"
                        style={{
                          background: '#090817',
                          border: '1px solid #332d56',
                          clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)'
                        }}
                      >
                        <span className="text-amber-500/40 font-black mr-2">{letter}:</span>
                        <span className="text-slate-600">———</span>
                      </div>
                    );
                  }

                  if (isWrongSelected) {
                    bgGradient = 'linear-gradient(180deg, #7f1d1d 0%, #450a0a 100%)';
                    borderColor = '#ef4444';
                    glowShadow = '0 0 25px rgba(239, 68, 68, 0.6)';
                  } else if (isCorrect) {
                    bgGradient = 'linear-gradient(180deg, #065f46 0%, #022c22 100%)';
                    borderColor = '#10b981';
                    glowShadow = '0 0 30px rgba(16, 185, 129, 0.7)';
                  } else if (isSelected) {
                    if (answerStatus === 'evaluating') {
                      bgGradient = 'linear-gradient(180deg, #b45309 0%, #78350f 100%)';
                      borderColor = '#f59e0b';
                      glowShadow = '0 0 25px rgba(245, 158, 11, 0.7)';
                    } else {
                      bgGradient = 'linear-gradient(180deg, #d97706 0%, #92400e 100%)';
                      borderColor = '#fbbf24';
                      glowShadow = '0 0 20px rgba(251, 191, 36, 0.5)';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={isLocked}
                      className={`group relative text-left py-4 px-7 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] ${
                        isSelected && answerStatus === 'evaluating' ? 'animate-pulse' : ''
                      }`}
                      style={{
                        background: bgGradient,
                        border: `2px solid ${borderColor}`,
                        boxShadow: glowShadow,
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-amber-400 font-black text-sm md:text-base tracking-wider shrink-0">
                          {letter}:
                        </span>
                        <span className={`text-sm md:text-base font-bold flex-1 ${textColor}`}>
                          {opt}
                        </span>
                        {isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {isWrongSelected && (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ── "Lock Kiya Jaaye?" Confirmation Bar ── */}
              {selectedOption !== null && !isLocked && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-3 animate-fade-in">
                  <div className="text-xs text-amber-300 font-bold flex items-center gap-2">
                    {team && teamAnswerSubmitted && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                    Option {String.fromCharCode(65 + selectedOption)} chuna gaya hai {team ? '(Laptop se Admin monitor par live)' : ''}.
                  </div>
                  <button
                    onClick={handleLockOption}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm tracking-wider uppercase shadow-lg shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer"
                  >
                    {team ? 'Confirm Team Choice 🔒' : 'Lock Kiya Jaaye! (Lock Answer) 🔒'}
                  </button>
                </div>
              )}

              {/* Correct answer explanation box after evaluation */}
              {revealedCorrect !== null && currentQ?.explanation && (
                <div className="max-w-4xl mx-auto bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 text-xs text-slate-300">
                  <strong className="text-amber-300">💡 Technical Explanation: </strong>
                  {currentQ.explanation}
                </div>
              )}

            </div>

            {/* Right 3 Columns: 16-Step Money Ladder (Dhanrashi Tree) */}
            <div className="lg:col-span-3 bg-slate-950/80 border border-indigo-900/40 rounded-2xl p-3.5 backdrop-blur-md shadow-xl h-fit">
              <div className="text-center pb-2 border-b border-indigo-900/40 mb-2">
                <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center justify-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" /> Prize Ladder
                </span>
              </div>

              <div className="space-y-1">
                {KBC_PRIZE_LADDER.slice().reverse().map(step => {
                  const isCurrent = currentLevel === step.level;
                  const isPassed = currentLevel > step.level;

                  return (
                    <div
                      key={step.level}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-[1.02]'
                          : isPassed
                          ? 'text-emerald-400 bg-emerald-950/20'
                          : step.isSafe
                          ? 'text-amber-300 bg-amber-500/10'
                          : 'text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-right font-mono text-[11px] opacity-75">
                          {step.level}
                        </span>
                        <span>{step.prize}</span>
                      </div>
                      <div>
                        {step.isSafe && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                            isCurrent ? 'bg-slate-950 text-amber-400' : 'bg-amber-400/20 text-amber-300'
                          }`}>
                            PADAV
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ── MODALS: Audience Poll, Expert Video Call, Quit Confirmation, Winner Cheque ── */}

      {/* 1. Audience Poll Modal */}
      {activeModal === 'poll' && pollData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b132e] border-2 border-amber-400/60 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <Users className="w-6 h-6" />
              <h3 className="text-lg font-black uppercase tracking-wider">Janmat Sangrah (Audience Poll)</h3>
            </div>
            <p className="text-xs text-slate-300">
              Studio audience has cast their votes for Question {currentLevel}:
            </p>

            <div className="grid grid-cols-4 gap-3 items-end h-48 pt-6 pb-2 px-4 bg-slate-950/60 border border-indigo-900/50 rounded-2xl">
              {[0, 1, 2, 3].map(optIdx => {
                const letter = String.fromCharCode(65 + optIdx);
                const percent = pollData[optIdx] || 0;
                return (
                  <div key={optIdx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-xs font-bold text-amber-300">{percent}%</span>
                    <div 
                      className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 via-amber-500 to-yellow-300 transition-all duration-1000"
                      style={{ height: `${Math.max(percent * 1.5, 8)}px` }}
                    />
                    <span className="text-xs font-black text-white">{letter}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer"
            >
              Shukriya Audience! Wapas Khel Par Chalein
            </button>
          </div>
        </div>
      )}

      {/* 2. Phone-a-Friend / Expert Video Call Modal */}
      {activeModal === 'friend' && expertAdvice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0b132e] border-2 border-amber-400/60 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            
            {/* Video Call Header */}
            <div className="flex items-center justify-between pb-3 border-b border-indigo-900/50">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                Live Tech Expert Video Call
              </div>
              <span className="text-xs text-slate-400 font-mono">00:30</span>
            </div>

            {/* Video Simulation Box */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-indigo-500/40 p-6 text-center space-y-3">
              <div className="text-5xl">{expertAdvice.avatar}</div>
              <div>
                <h4 className="text-base font-bold text-white">{expertAdvice.name}</h4>
                <p className="text-xs text-amber-400 font-mono">{expertAdvice.title}</p>
              </div>

              <div className="bg-slate-900/90 border border-amber-400/30 rounded-xl p-3.5 text-xs text-slate-200 text-left italic leading-relaxed">
                "{expertAdvice.adviceText}"
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm cursor-pointer"
            >
              Call Disconnect Karein Aur Lock Karein
            </button>
          </div>
        </div>
      )}

      {/* 3. Quit Confirmation Modal */}
      {activeModal === 'quit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0b132e] border-2 border-amber-400/60 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-lg font-black text-white uppercase tracking-wider">
              Khel Chhodna Chahte Hain?
            </h3>
            <p className="text-xs text-slate-300">
              Agar aap abhi khel chhodte hain, toh aap jeet kar jayenge <strong className="text-amber-400 text-sm">{earnedPrizeLabel}</strong> bina kisi jokhim ke!
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Nahi, Khel Jari Rakhein
              </button>
              <button
                onClick={() => {
                  setActiveModal(null);
                  finishGame(true, false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-xs hover:from-red-400 hover:to-rose-500 cursor-pointer"
              >
                Haan, Dhanrashi Lekar Quit Karein
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Grand KBC Cheque Presentation Modal */}
      {activeModal === 'cheque' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-950 border-2 border-amber-400/80 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fade-in my-auto">
            
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> Official KBC Cheque Presentation
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100">
                {gameWon ? '7 CRORE MAHA CROREPATI!' : 'SHANDAR PRADARSHAN!'}
              </h2>
            </div>

            {/* ── THE OFFICIAL KBC CHEQUE ── */}
            <div className="relative bg-gradient-to-r from-[#faf5ea] via-[#fffbf0] to-[#f5eedb] text-slate-900 border-4 border-[#b8860b] rounded-2xl p-6 sm:p-8 shadow-2xl text-left font-serif overflow-hidden">
              {/* Cheque Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none text-6xl font-black">
                KAUN BANEGA CROREPATI
              </div>

              {/* Top Row: Bank Name & Cheque Date */}
              <div className="flex items-start justify-between border-b-2 border-amber-900/30 pb-3 mb-4">
                <div>
                  <h4 className="text-lg font-black tracking-wider text-amber-950 uppercase font-sans">
                    Bank of Kaun Banega Crorepati
                  </h4>
                  <p className="text-[10px] text-amber-800 font-sans tracking-wide">
                    MERN & SQL Grand Assessment Hotseat Branch
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 block font-sans">DATE:</span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Payee Row */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-3 border-b border-dashed border-amber-900/40 pb-1">
                  <span className="text-xs font-bold text-slate-700 tracking-wider font-sans shrink-0">PAY:</span>
                  <span className="text-base sm:text-lg font-black text-slate-950 font-sans tracking-wide flex-1">
                    {playerName}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 border-b border-dashed border-amber-900/40 pb-1">
                  <span className="text-xs font-bold text-slate-700 tracking-wider font-sans shrink-0">RUPEES:</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 italic flex-1">
                    {finalChequeAmount} Only
                  </span>
                </div>
              </div>

              {/* Amount Box & Signature */}
              <div className="flex items-end justify-between mt-6 pt-3">
                <div className="border-2 border-amber-900/80 bg-white px-5 py-2.5 rounded-lg shadow-inner">
                  <span className="text-xs text-slate-500 font-sans block leading-none">AMOUNT:</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-900 font-mono">
                    {finalChequeAmount}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-base sm:text-lg text-slate-800 font-bold border-b border-slate-700 pb-0.5">
                    Amitabh Bachchan
                  </div>
                  <span className="text-[10px] text-slate-600 font-sans uppercase tracking-wider block pt-0.5">
                    Authorized Signatory (Host)
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Cheque
              </button>
              <button
                onClick={handlePlayAgain}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Play Again
              </button>
              <Link
                to="/test/dashboard"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2"
              >
                Test Dashboard →
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="relative z-10 py-2 text-center text-[11px] text-slate-500 border-t border-slate-900 bg-black/30">
        AppleTree Infotech & Pranidha • Kaun Banega Crorepati MERN & SQL Grand Exam Simulator
      </footer>

    </div>
  );
}
