import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Volume2, VolumeX, Clock, Users, PhoneCall, Video, HelpCircle, 
  RotateCcw, Award, LogOut, CheckCircle2, XCircle, Sparkles, 
  AlertTriangle, ArrowRight, Settings, Download, Printer, ShieldCheck,
  Laptop, Radio, Wifi, UserCheck, Flame, Maximize, Minimize,
  ArrowUp, ArrowDown, TrendingUp, Medal, BarChart3,
  User, Mail, Calendar, Smartphone, Building, GraduationCap, Camera, Lock, Check, ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { kbcAudio } from '../../utils/kbcAudio.js';
import SaatCroreWinnerModal from '../../components/kbc/SaatCroreWinnerModal.jsx';
import MovingLeaderboardModal from '../../components/kbc/MovingLeaderboardModal.jsx';
import KbcPointsLadder from '../../components/kbc/KbcPointsLadder.jsx';
import KbcLaserLogoReveal from '../../components/kbc/KbcLaserLogoReveal.jsx';
import KbcStageLasers from '../../components/kbc/KbcStageLasers.jsx';
import { 
  KBC_PRIZE_LADDER, 
  DEFAULT_MERN_SQL_QUESTIONS, 
  AMITABH_QUOTES, 
  EXPERT_FRIENDS,
  getDynamicPrizeLadder,
  getPrizeForLevel,
  getSafePoints
} from '../../data/kbcQuestions.js';

export default function KbcExam() {
  const navigate = useNavigate();

  // ── Participation Mode: Team mode by default so all contestants register & sync with Admin ──
  const [playMode, setPlayMode] = useState(() => {
    const saved = localStorage.getItem('kbc_play_mode');
    if (saved === 'SOLO') return 'SOLO';
    return 'TEAM';
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
  // Candidate Registration State (Matching Image 1: Candidate Registration)
  const [registeredStudent, setRegisteredStudent] = useState(() => {
    try {
      const saved = localStorage.getItem('kbc_registered_student');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [authStep, setAuthStep] = useState(() => {
    if (localStorage.getItem('kbc_team')) return 'WAITING';
    if (localStorage.getItem('kbc_registered_student')) return 'GATE';
    return 'REGISTER';
  });

  const [authMode, setAuthMode] = useState('REGISTER'); // 'REGISTER' | 'LOGIN'
  const [loginForm, setLoginForm] = useState({
    email: '',
    dob: ''
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    dob: '',
    mobile: '',
    course: '',
    customCourse: '',
    profilePhoto: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const photoInputRef = useRef(null);

  const [teamAccessCodeInput, setTeamAccessCodeInput] = useState(() => {
    try {
      const s = localStorage.getItem('kbc_registered_student');
      if (s) {
        const parsed = JSON.parse(s);
        return parsed.access_code || 'KBC-101';
      }
    } catch(e) {}
    return 'KBC-101';
  });
  const [teamJoinLoading, setTeamJoinLoading] = useState(false);
  const [teamJoinError, setTeamJoinError] = useState('');
  const [teamAnswerSubmitted, setTeamAnswerSubmitted] = useState(false);
  const [winnerData, setWinnerData] = useState(null);
  const lastWinnerShownRef = useRef(false);
  const [showBroadcastLeaderboard, setShowBroadcastLeaderboard] = useState(false);
  const userDismissedLeaderboardRef = useRef(false);
  const previousTeamsRef = useRef({});

  // Laser Effects & Fullscreen State
  const [showLaserIntro, setShowLaserIntro] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [laserUpwardTrigger, setLaserUpwardTrigger] = useState(false);
  const [isCelebratingCorrect, setIsCelebratingCorrect] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);

  // Sync fullscreen state
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const enterFullScreen = () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } catch (err) {}
  };

  const exitFullScreen = () => {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } catch (err) {}
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  };

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

  // Questions State: initialized immediately with fallback so arena always renders instantly
  const [questions, setQuestions] = useState(() => {
    const list = [];
    for (let lvl = 1; lvl <= 16; lvl++) {
      const levelQuestions = DEFAULT_MERN_SQL_QUESTIONS[lvl] || [];
      const selected = levelQuestions[0] || {
        id: `q${lvl}`,
        topic: 'Programming & Logic',
        question: `Question for Level ${lvl}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: 0,
        explanation: 'KBC Hotseat Question'
      };
      list.push({
        level: lvl,
        id: selected.id,
        topic: selected.topic,
        question: selected.question,
        options: selected.options,
        correct: selected.correct,
        explanation: selected.explanation
      });
    }
    return list;
  });
  const [flipPool, setFlipPool] = useState({});
  const [currentLevel, setCurrentLevel] = useState(1); // 1 to 16
  const [loading, setLoading] = useState(false);

  // ── Universal Candidate Profile Resolution helper ──
  const resolveStoredCandidateProfile = () => {
    try {
      const reg = localStorage.getItem('kbc_registered_student');
      if (reg) {
        const s = JSON.parse(reg);
        const name = s.full_name || s.name || s.fullName;
        if (name && name.trim()) {
          return {
            name: name.trim(),
            fullName: name.trim(),
            email: s.email || '',
            dob: s.dob || '',
            mobile: s.mobile || '',
            course: s.course || s.college || 'Full Stack Coder',
            profile_photo: s.profile_photo || null,
            access_code: s.access_code || 'KBC-101',
            points: Number(s.points) || 0,
            isLoggedIn: true
          };
        }
      }
      const t = localStorage.getItem('kbc_team');
      if (t) {
        const teamObj = JSON.parse(t);
        const name = teamObj.leader_name || teamObj.full_name || teamObj.team_name;
        if (name && name.trim() && !name.toLowerCase().startsWith('laptop-') && !name.toLowerCase().startsWith('team-')) {
          return {
            name: name.trim(),
            fullName: name.trim(),
            email: teamObj.email || '',
            dob: teamObj.dob || '',
            mobile: teamObj.mobile || '',
            course: teamObj.course || teamObj.college || 'Full Stack Coder',
            profile_photo: teamObj.profile_photo || null,
            access_code: teamObj.access_code || 'KBC-101',
            points: Number(teamObj.points) || 0,
            isLoggedIn: true
          };
        }
      }
      const st = localStorage.getItem('exam_student');
      if (st) {
        const s = JSON.parse(st);
        const name = s.name || s.fullName || s.studentName;
        if (name && name.trim()) {
          return {
            name: name.trim(),
            fullName: name.trim(),
            email: s.email || '',
            dob: '',
            mobile: '',
            course: s.course || s.college || 'Full Stack Coder',
            profile_photo: s.profile_photo || null,
            access_code: 'KBC-101',
            points: 0,
            isLoggedIn: true
          };
        }
      }
      const u = localStorage.getItem('user');
      if (u) {
        const userObj = JSON.parse(u);
        const name = userObj.name || userObj.fullName;
        if (name && name.trim()) {
          return {
            name: name.trim(),
            fullName: name.trim(),
            email: userObj.email || '',
            dob: '',
            mobile: '',
            course: userObj.course || 'Full Stack Coder',
            profile_photo: userObj.profile_photo || null,
            access_code: 'KBC-101',
            points: 0,
            isLoggedIn: true
          };
        }
      }
    } catch (e) {}

    return {
      name: 'Hotseat Contestant',
      fullName: 'Hotseat Contestant',
      email: '',
      dob: '',
      mobile: '',
      course: 'Full Stack Coder',
      profile_photo: null,
      access_code: 'KBC-101',
      points: 0,
      isLoggedIn: false
    };
  };

  // Active memoized candidate profile
  const candidateProfile = useMemo(() => {
    if (registeredStudent && (registeredStudent.full_name || registeredStudent.name)) {
      const name = (registeredStudent.full_name || registeredStudent.name).trim();
      return {
        name,
        fullName: name,
        email: registeredStudent.email || '',
        dob: registeredStudent.dob || '',
        mobile: registeredStudent.mobile || '',
        course: registeredStudent.course || registeredStudent.college || 'Full Stack Coder',
        profile_photo: registeredStudent.profile_photo || null,
        access_code: registeredStudent.access_code || 'KBC-101',
        points: Number(registeredStudent.points) || 0,
        isLoggedIn: true
      };
    }
    if (team && (team.leader_name || team.full_name || team.team_name)) {
      const name = (team.leader_name || team.full_name || team.team_name).trim();
      return {
        name,
        fullName: name,
        email: team.email || '',
        dob: team.dob || '',
        mobile: team.mobile || '',
        course: team.course || team.college || 'Full Stack Coder',
        profile_photo: team.profile_photo || null,
        access_code: team.access_code || 'KBC-101',
        points: Number(team.points) || 0,
        isLoggedIn: true
      };
    }
    return resolveStoredCandidateProfile();
  }, [registeredStudent, team]);

  // Player / Game State (Solo Mode)
  const [playerName, setPlayerName] = useState(() => candidateProfile.name);

  // ── Live Players Leaderboard (Calculated after every question) ──
  const [livePlayers, setLivePlayers] = useState(() => [
    { id: 'player-rohan', name: 'Rohan Sharma', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '⚡', accuracy: 0.85 },
    { id: 'player-priya', name: 'Priya Patel', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '🌟', accuracy: 0.80 },
    { id: 'player-aman', name: 'Aman Verma', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '🔥', accuracy: 0.75 },
    { id: 'player-user', name: candidateProfile.name, isUser: true, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '👤', accuracy: 1.0, profile_photo: candidateProfile.profile_photo, course: candidateProfile.course },
    { id: 'player-neha', name: 'Neha Gupta', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '🎯', accuracy: 0.70 },
    { id: 'player-vikram', name: 'Vikram Singh', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '🚀', accuracy: 0.65 },
    { id: 'player-ananya', name: 'Ananya Roy', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '💎', accuracy: 0.60 }
  ]);

  // Synchronize contestant's actual profile name into user player card
  useEffect(() => {
    if (candidateProfile.name) {
      setPlayerName(candidateProfile.name);
      setLivePlayers(prev => prev.map(p => p.isUser ? { 
        ...p, 
        name: candidateProfile.name,
        profile_photo: candidateProfile.profile_photo,
        course: candidateProfile.course
      } : p));
    }
  }, [candidateProfile]);

  // Helper for safe points cutoff
  const getSafePoints = (lvl, totalQ) => {
    let safeLvl = 0;
    if (totalQ > 16) {
      safeLvl = Math.floor((lvl - 1) / 5) * 5;
    } else {
      if (lvl > 15) safeLvl = 15;
      else if (lvl > 10) safeLvl = 10;
      else if (lvl > 5) safeLvl = 5;
      else safeLvl = 0;
    }
    return (safeLvl * (safeLvl + 1) / 2) * 100;
  };

  // Calculate live points after every question and smoothly re-rank
  const calculateRoundPoints = (userCorrect, speedBonus = 0) => {
    const totalQ = adminSession?.total_questions || questions?.length || 50;
    const basePoints = currentLevel * 100;
    const userEarned = userCorrect ? (basePoints + speedBonus) : 0;
    const cutoffPoints = getSafePoints(currentLevel, totalQ);

    setLivePlayers(prevPlayers => {
      const updated = prevPlayers.map(p => {
        if (p.isUser) {
          if (userCorrect) {
            return {
              ...p,
              points: p.points + userEarned,
              currentLevel: Math.min(currentLevel + 1, totalQ),
              correctCount: p.correctCount + 1,
              lastPointsGained: userEarned,
              lastStatus: 'correct',
              status: 'HOTSEAT'
            };
          } else {
            // User gives wrong answer: loses 100 points and place in leaderboard drops down!
            const lostPoints = Math.max(0, (p.points || 0) - 100);
            return {
              ...p,
              points: lostPoints,
              currentLevel: Math.max(1, p.currentLevel - 1),
              wrongCount: p.wrongCount + 1,
              lastPointsGained: -100,
              lastStatus: 'wrong',
              status: 'CONNECTED'
            };
          }
        } else {
          // Competitive classmates simulation:
          const levelDifficulty = Math.max(0.35, p.accuracy - (currentLevel * 0.02));
          const compCorrect = Math.random() < levelDifficulty;
          if (compCorrect) {
            const compSpeed = Math.floor(Math.random() * 20) * 2;
            const compEarned = basePoints + compSpeed;
            return {
              ...p,
              points: p.points + compEarned,
              currentLevel: Math.min(currentLevel + 1, totalQ),
              correctCount: p.correctCount + 1,
              lastPointsGained: compEarned,
              lastStatus: 'correct',
              status: 'HOTSEAT'
            };
          } else {
            // Classmate gives wrong answer: loses 100 points and place drops down!
            const lostPoints = Math.max(0, (p.points || 0) - 100);
            return {
              ...p,
              points: lostPoints,
              currentLevel: Math.max(1, p.currentLevel - 1),
              wrongCount: (p.wrongCount || 0) + 1,
              lastPointsGained: -100,
              lastStatus: 'wrong',
              status: 'CONNECTED'
            };
          }
        }
      });

      // Sort purely by points descending so every right/wrong answer immediately organizes rank
      return [...updated].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.correctCount - a.correctCount;
      });
    });
  };

  const resetLivePlayers = () => {
    setLivePlayers([
      { id: 'player-rohan', name: 'Rohan Sharma', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '⚡', accuracy: 0.85 },
      { id: 'player-priya', name: 'Priya Patel', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '🌟', accuracy: 0.80 },
      { id: 'player-aman', name: 'Aman Verma', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '🔥', accuracy: 0.75 },
      { id: 'player-user', name: playerName || 'Hotseat Contestant', isUser: true, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '👤', accuracy: 1.0 },
      { id: 'player-neha', name: 'Neha Gupta', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '🎯', accuracy: 0.70 },
      { id: 'player-vikram', name: 'Vikram Singh', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '🚀', accuracy: 0.65 },
      { id: 'player-ananya', name: 'Ananya Roy', isUser: false, points: 0, currentLevel: 1, correctCount: 0, wrongCount: 0, lastPointsGained: 0, lastStatus: null, avatar: '💎', accuracy: 0.60 }
    ]);
  };

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
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef(null);

  // Host Dialogue
  const [hostQuote, setHostQuote] = useState(AMITABH_QUOTES.welcome[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [showMobileLeaderboard, setShowMobileLeaderboard] = useState(false);

  // Helper to format live participant names with proper capitalization
  const formatDisplayName = (teamName, leaderName, code) => {
    const tName = (teamName || '').trim();
    const lName = (leaderName || '').trim();
    if (tName && lName && tName.toLowerCase() !== lName.toLowerCase()) {
      const leaderCap = lName.charAt(0).toUpperCase() + lName.slice(1);
      return `${leaderCap} (${tName})`;
    }
    const raw = tName || lName || `Contestant ${code || ''}`;
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  // Synchronize live leaderboard based on participation mode (TEAM vs SOLO)
  const displayPlayers = useMemo(() => {
    // ── CASE 1: TEAM MODE (Connected with Laptop Access Code to Admin Live Game) ──
    if (team) {
      if (Array.isArray(adminSession?.top_teams) && adminSession.top_teams.length > 0) {
        // Keep all session teams (CONNECTED, HOTSEAT, OUT, ELIMINATED, REGISTERED)
        const sourceList = adminSession.top_teams;

        const teams = sourceList.map((t) => {
          const isUser = Boolean(
            (team && (t.id === team.id || (team.email && t.email && t.email.toLowerCase() === team.email.toLowerCase()))) ||
            (candidateProfile?.email && t.email && t.email.toLowerCase() === candidateProfile.email.toLowerCase()) ||
            (candidateProfile?.name && t.team_name && t.team_name.toLowerCase() === candidateProfile.name.toLowerCase() && t.id === team?.id)
          );
          const displayName = isUser 
            ? candidateProfile.name 
            : formatDisplayName(t.team_name, t.leader_name, t.access_code);
          const pts = isUser ? (team.points !== undefined ? Number(team.points) : Number(t.points) || 0) : Number(t.points) || 0;
          const correctCount = isUser ? (team.correct_count !== undefined ? Number(team.correct_count) : Number(t.correct_count) || 0) : Number(t.correct_count) || 0;
          const status = isUser ? (team.status || t.status || 'CONNECTED') : (t.status || 'CONNECTED');
          const photo = isUser 
            ? (candidateProfile.profile_photo || team.profile_photo || registeredStudent?.profile_photo || t.profile_photo || null)
            : (t.profile_photo || null);

          return {
            id: `team-${t.id || t.access_code}`,
            name: displayName,
            isUser,
            points: pts,
            currentLevel: t.current_level || 1,
            correctCount,
            wrongCount: t.wrong_count || 0,
            lastPointsGained: isUser && answerStatus === 'correct' ? currentLevel * 100 : 0,
            lastStatus: isUser ? answerStatus : (status === 'HOTSEAT' ? 'correct' : null),
            avatar: '🏆',
            status,
            submittedOption: t.submitted_option,
            profile_photo: photo,
            course: isUser ? (candidateProfile.course || team.course || registeredStudent?.course || '') : (t.course || t.college || '')
          };
        });

        // If current team is not in top_teams list, include team card
        const userExists = teams.some(t => t.isUser);
        if (!userExists) {
          teams.push({
            id: `team-user-${team.id || 'current'}`,
            name: candidateProfile.name || formatDisplayName(team.team_name, team.leader_name, team.access_code),
            isUser: true,
            points: Number(team.points) || 0,
            currentLevel: currentLevel,
            correctCount: Number(team.correct_count) || 0,
            wrongCount: Number(team.wrong_count) || 0,
            lastPointsGained: answerStatus === 'correct' ? currentLevel * 100 : 0,
            lastStatus: answerStatus,
            avatar: '👤',
            status: team.status || 'CONNECTED',
            submittedOption: selectedOption,
            profile_photo: candidateProfile.profile_photo || team.profile_photo || registeredStudent?.profile_photo || null,
            course: candidateProfile.course || team.course || registeredStudent?.course || team.college || ''
          });
        }

        const sorted = teams.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          // Tie-breaker rule: choose that student who selected answer first!
          const timeA = Number(a.total_response_time_ms ?? a.totalResponseTime ?? a.response_time_ms ?? 9999999);
          const timeB = Number(b.total_response_time_ms ?? b.totalResponseTime ?? b.response_time_ms ?? 9999999);
          if (timeA !== timeB) return timeA - timeB;
          const subA = Number(a.submitted_at ?? a.last_submitted_at ?? 0);
          const subB = Number(b.submitted_at ?? b.last_submitted_at ?? 0);
          if (subA !== subB) return subA - subB;
          return (b.correctCount || 0) - (a.correctCount || 0);
        });

        return sorted.map((p, idx) => {
          const rank = idx + 1;
          const prev = previousTeamsRef.current[p.id];
          const prevRank = prev?.rank;
          const rankDelta = (prevRank !== undefined) ? (prevRank - rank) : 0;
          return {
            ...p,
            rank,
            rankDelta
          };
        });
      }

      // Single connected laptop team
      return [{
        id: `team-user-${team.id}`,
        name: candidateProfile.name || formatDisplayName(team.team_name, team.leader_name, team.access_code),
        isUser: true,
        points: Number(team.points) || 0,
        currentLevel: currentLevel,
        correctCount: Number(team.correct_count) || 0,
        wrongCount: Number(team.wrong_count) || 0,
        lastPointsGained: answerStatus === 'correct' ? currentLevel * 100 : 0,
        lastStatus: answerStatus,
        avatar: '👤',
        status: team.status || 'CONNECTED',
        rank: 1,
        rankDelta: 0,
        profile_photo: candidateProfile.profile_photo || team.profile_photo || registeredStudent?.profile_photo || null,
        course: candidateProfile.course || team.course || registeredStudent?.course || team.college || ''
      }];
    }

    // ── CASE 2: SOLO MODE (Practice Hotseat against dynamic classmates simulation) ──
    const sortedSolo = [...livePlayers].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      // Tie-breaker rule: student who selected answer first
      const timeA = Number(a.totalResponseTime ?? a.response_time_ms ?? 9999999);
      const timeB = Number(b.totalResponseTime ?? b.response_time_ms ?? 9999999);
      if (timeA !== timeB) return timeA - timeB;
      return (b.correctCount || 0) - (a.correctCount || 0);
    });

    return sortedSolo.map((p, idx) => {
      const rank = idx + 1;
      const prev = previousTeamsRef.current[p.id];
      const prevRank = prev?.rank;
      const rankDelta = (prevRank !== undefined) ? (prevRank - rank) : 0;
      return {
        ...p,
        rank,
        rankDelta
      };
    });
  }, [playMode, team, adminSession?.top_teams, livePlayers, answerStatus, currentLevel, playerName, selectedOption, candidateProfile]);

  const currentUserIndex = displayPlayers.findIndex(p => p.isUser);
  const currentUserRank = currentUserIndex >= 0 ? currentUserIndex + 1 : 1;
  const currentUserPlayer = currentUserIndex >= 0 ? displayPlayers[currentUserIndex] : null;
  const totalQuestions = adminSession?.total_questions || questions?.length || 50;
  const userPoints = currentUserPlayer ? currentUserPlayer.points : (team ? (Number(team.points) || 0) : 0);
  const isUserOut = gameOver || (currentUserPlayer?.status === 'OUT') || (team && team.status === 'OUT');
  const safePadavLevel = Math.max(0, Math.floor(getSafePoints(currentLevel, totalQuestions) / 100));
  const safePadavPoints = safePadavLevel * 100;
  const safePadavPrize = safeWonPrizeLabel !== '₹0' ? safeWonPrizeLabel : (safePadavLevel > 0 ? (getPrizeForLevel(safePadavLevel, totalQuestions)?.prize || '₹0') : '₹0');

  // Track previous question and session state to detect arrival & answer reveal
  const lastQuestionTrackRef = useRef({
    level: null,
    qId: null,
    isLive: false,
    lastRevealed: null,
    wasLocked: false
  });

  // ── Poll Live Session Status from Hostinger MySQL (Every 1.5s) ──
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const teamParam = team?.id 
          ? `?team_id=${encodeURIComponent(team.id)}` 
          : (candidateProfile?.email ? `?team_id=${encodeURIComponent(candidateProfile.email)}` : '');
        const res = await fetch(`/api/kbc/session/status${teamParam}`);
        const data = await res.json();
        if (isMounted && data.success && data.session) {
          const sess = data.session;
          setAdminSession(sess);

          // ── CHECK IF ADMIN HAS ANNOUNCED TOP SCORER (SAAT CRORE MEME) ──
          if (sess.show_winner && sess.winner) {
            if (!lastWinnerShownRef.current) {
              lastWinnerShownRef.current = true;
              setWinnerData(sess.winner);
              setActiveModal('saat_crore_winner');
              kbcAudio.playHighPoints();
            }
          } else if (!sess.show_winner) {
            lastWinnerShownRef.current = false;
          }

          // ── CHECK IF ADMIN HAS BROADCASTED MOVING LEADERBOARD ON EVERYONE'S SCREEN ──
          if (sess.show_leaderboard) {
            if (!userDismissedLeaderboardRef.current) {
              setShowBroadcastLeaderboard(true);
            }
          } else {
            userDismissedLeaderboardRef.current = false;
            setShowBroadcastLeaderboard(false);
          }

          // ── Synchronize THIS SPECIFIC CONTESTANT'S individual team points and submission state ──
          if (team) {
            // Find this specific contestant's personal team record (data.my_team or matching EXACT id/email)
            const myTeamData = data.my_team || (Array.isArray(sess.top_teams) 
              ? sess.top_teams.find(t => t.id === team.id || (team.email && t.email && t.email.toLowerCase() === team.email.toLowerCase())) 
              : null);

            if (myTeamData) {
              setTeam(prev => ({
                ...prev,
                points: Number(myTeamData.points) || 0,
                correct_count: Number(myTeamData.correct_count) || 0,
                wrong_count: Number(myTeamData.wrong_count) || 0,
                score_amount: Number(myTeamData.score_amount) || 0,
                current_level: myTeamData.current_level || prev?.current_level,
                status: myTeamData.status || prev?.status,
                submitted_option: myTeamData.submitted_option
              }));

              // ONLY lock option if THIS PARTICULAR PLAYER submitted their option
              if (myTeamData.submitted_option !== null && myTeamData.submitted_option !== undefined) {
                setSelectedOption(Number(myTeamData.submitted_option));
                setIsLocked(true);
                setTeamAnswerSubmitted(true);
                if (sess.revealed_correct === null) {
                  setAnswerStatus('locked');
                }
              }
            }
          }

          const isNowLive = sess.status === 'LIVE';
          const levelChanged = sess.current_level && sess.current_level !== lastQuestionTrackRef.current.level;
          const qChanged = sess.current_question?.id && sess.current_question.id !== lastQuestionTrackRef.current.qId;
          const justWentLive = isNowLive && !lastQuestionTrackRef.current.isLive;
          const roundReset = isNowLive && (sess.revealed_correct === null && lastQuestionTrackRef.current.lastRevealed !== null);
          const adminUnlocked = isNowLive && (!sess.is_locked && lastQuestionTrackRef.current.wasLocked);
          const timerReset = isNowLive && sess.timer_started_at && sess.timer_started_at !== lastQuestionTrackRef.current.timerStartedAt;

          // When a new question arrives on contestant laptop (Admin started or advanced round or reset round)
          if (isNowLive && (levelChanged || qChanged || justWentLive || roundReset || timerReset)) {
            const newLvl = sess.current_level || 1;
            const maxCountdown = getLevelCountdown(newLvl);
            setCurrentLevel(newLvl);
            setSelectedOption(null); // ALWAYS reset selected option to null for new question!
            setIsLocked(false);      // ALWAYS unlock for new question!
            setAnswerStatus(null);
            setTeamAnswerSubmitted(false);
            setEliminatedOptions([]);
            setIsWrongAnswer(false); // Reset wrong answer red beams back to normal blue
            setIsTimeUp(false);
            setTimeLeft(maxCountdown); // Immediately set initial countdown on arrival!
            activeQuestionKeyRef.current = `${newLvl}_${sess.current_question?.id || 'q'}`;

              // Automatically dismiss the middle-screen leaderboard when next question comes
              setShowBroadcastLeaderboard(false);
              userDismissedLeaderboardRef.current = false;

              // Trigger upward laser sweep animation & sound
              setLaserUpwardTrigger(prev => !prev);
              kbcAudio.playLaserSweep();

              // If restarting whole KBC from beginning (Level 1), reset earned prize
              if (newLvl === 1 && (justWentLive || roundReset)) {
                setEarnedAmount(0);
                setEarnedPrizeLabel('₹0');
                setSafeWonAmount(0);
                setSafeWonPrizeLabel('₹0');
              }

              // Play Question Arrival Audio on contestant laptop!
              kbcAudio.playQuestionArrival();

              const prizeLabel = getPrizeForLevel(newLvl, totalQuestions)?.prize || '₹1,000';
              setHostQuote(AMITABH_QUOTES.questionIntro(newLvl, prizeLabel));

              lastQuestionTrackRef.current.level = newLvl;
              lastQuestionTrackRef.current.qId = sess.current_question?.id || null;
              lastQuestionTrackRef.current.lastRevealed = null;
              lastQuestionTrackRef.current.wasLocked = Boolean(sess.is_locked);
              lastQuestionTrackRef.current.timerStartedAt = sess.timer_started_at;
            }

            lastQuestionTrackRef.current.isLive = isNowLive;
            lastQuestionTrackRef.current.wasLocked = Boolean(sess.is_locked);
            lastQuestionTrackRef.current.timerStartedAt = sess.timer_started_at;

            if (!isNowLive) {
              kbcAudio.stopClock();
              kbcAudio.stopLockSuspense();
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
            } else {
              // Admin locks the session question / time is up
              if (sess.is_locked && !isLocked) {
                setIsLocked(true);
                // Do NOT overwrite this student's selectedOption with sess.locked_option!
                // Each of the 1,000 contestants keeps their own individual option selection.
                setAnswerStatus(prevStatus => prevStatus === 'locked' ? 'locked' : (selectedOption !== null ? 'locked' : 'evaluating'));
                kbcAudio.startLockSuspense();
              }

              // Server-synchronized Tik-Tiki Ji countdown clock for contestant laptop:
              if (!sess.is_locked && sess.revealed_correct === null && !isTimeUp) {
                if (sess.timer_paused) {
                  const rem = sess.timer_remaining !== undefined && sess.timer_remaining !== null ? Number(sess.timer_remaining) : 0;
                  setTimeLeft(rem);
                } else if (sess.timer_started_at) {
                  const serverNow = data.server_now || Date.now();
                  const elapsed = Math.max(0, Math.floor((serverNow - Number(sess.timer_started_at)) / 1000));
                  const dur = Number(sess.timer_duration) || getLevelCountdown(sess.current_level || currentLevel);
                  if (elapsed < dur) {
                    const rem = dur - elapsed;
                    setTimeLeft(prev => (Math.abs(prev - rem) > 2 ? rem : prev));
                  }
                }
              }

              // Admin reveals the correct answer
              if (sess.revealed_correct !== null && sess.revealed_correct !== undefined) {
                if (lastQuestionTrackRef.current.lastRevealed !== sess.revealed_correct) {
                  lastQuestionTrackRef.current.lastRevealed = sess.revealed_correct;
                  setRevealedCorrect(sess.revealed_correct);
                  kbcAudio.stopLockSuspense();

                  // Explicit wrong answer from Admin or mismatch with contestant option
                  const isWrongExplicit = sess.revealed_correct === 99;
                  const isCorrect = !isWrongExplicit && selectedOption !== null && Number(selectedOption) === Number(sess.revealed_correct);
                  setAnswerStatus(isCorrect ? 'correct' : 'wrong');
                  calculateRoundPoints(isCorrect, 0);

                  if (isCorrect) {
                    setIsWrongAnswer(false);
                    // Trigger stage light flicker, zig-zag and bouncing animation
                    setIsCelebratingCorrect(true);
                    setTimeout(() => setIsCelebratingCorrect(false), 4200);

                    const currentLvl = sess.current_level || currentLevel;
                    const winInfo = getPrizeForLevel(currentLvl, totalQuestions);
                    const winAmount = winInfo?.amount || 0;
                    const winLabel = winInfo?.prize || '₹0';
                    setEarnedAmount(winAmount);
                    setEarnedPrizeLabel(winLabel);

                    // High points check: Level 10+ (₹3,20,000+), Level 15 (₹1 Crore), Level 16 (₹7 Crore Jackpot)
                    const isHighPoints = currentLvl >= 10 || winAmount >= 320000;
                    if (isHighPoints) {
                      // Play authentic "SAAT CRORE!!" audio clip on contestant laptop!
                      kbcAudio.playHighPoints();
                      triggerGrandConfetti();
                    } else {
                      kbcAudio.playCorrect();
                      triggerConfetti(0.5);
                    }
                  } else {
                    // Turn lasers high-power bright red and point downward, holding until next question arrives
                    setIsWrongAnswer(true);
                    setIsCelebratingCorrect(false);
                    // Play uploaded wrong answer audio on contestant laptop!
                    kbcAudio.playWrong();
                    // Place in point leaderboard drops down!
                    setCurrentLevel(prev => Math.max(1, prev - 1));
                    const correctLetter = sess.revealed_correct >= 0 && sess.revealed_correct <= 3 
                      ? String.fromCharCode(65 + sess.revealed_correct) 
                      : '';
                    setHostQuote(correctLetter ? AMITABH_QUOTES.wrongAnswer(correctLetter) : 'Galat uttar! Khel samapt.');
                  }
                }
              } else if (sess.revealed_correct === null) {
                // Clear tracking when round is reset so reveals trigger reliably every time
                lastQuestionTrackRef.current.lastRevealed = null;
              }
            }
          }
        } catch (e) {}
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
      kbcAudio.stopClock();
      kbcAudio.stopLockSuspense();
      kbcAudio.stopDrone();
    };
  }, [team, currentLevel, selectedOption, isLocked]);

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

  // ── Candidate Profile Photo Upload & Compression ──
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setRegError('Photo size exceeds 8MB. Please select a smaller JPG/PNG image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // High quality square avatar resizing for database efficiency & crisp display
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        const targetDim = Math.min(size, 400); // 400x400 max
        canvas.width = targetDim;
        canvas.height = targetDim;
        const ctx = canvas.getContext('2d');
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        ctx.drawImage(img, startX, startY, size, size, 0, 0, targetDim, targetDim);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.88);
        setPhotoPreview(compressedBase64);
        setRegForm(prev => ({ ...prev, profilePhoto: compressedBase64 }));
        setRegError('');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // ── Candidate Registration Submission to Hostinger Database ──
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    if (!regForm.profilePhoto) {
      setRegError('Student Profile Photo is mandatory (required for leaderboard podium & certificate).');
      return;
    }
    if (!regForm.fullName.trim()) {
      setRegError('Please enter your Full Name.');
      return;
    }
    if (!regForm.email.trim()) {
      setRegError('Please enter your Email Address.');
      return;
    }
    if (!regForm.dob.trim()) {
      setRegError('Please select your Date of Birth (DOB).');
      return;
    }
    const cleanMobile = regForm.mobile.trim().replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setRegError('Please enter a valid 10-digit Mobile / WhatsApp Number (mandatory).');
      return;
    }

    const courseSelected = regForm.course === 'Other' ? (regForm.customCourse || '').trim() : regForm.course;
    if (!courseSelected) {
      setRegError('Please select or specify your Course Name (mandatory).');
      return;
    }

    setRegLoading(true);
    try {
      const res = await fetch('/api/kbc/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: regForm.fullName.trim(),
          email: regForm.email.trim(),
          dob: regForm.dob.trim(),
          mobile: regForm.mobile.trim(),
          course: courseSelected,
          profile_photo: regForm.profilePhoto
        })
      });

      const data = await res.json();
      setRegLoading(false);

      if (data.success && data.student) {
        localStorage.setItem('kbc_registered_student', JSON.stringify(data.student));
        try {
          const studentProfile = {
            id: data.student.id,
            name: data.student.full_name,
            fullName: data.student.full_name,
            email: data.student.email,
            course: data.student.course,
            profile_photo: data.student.profile_photo
          };
          localStorage.setItem('exam_student', JSON.stringify(studentProfile));
        } catch (e) {}
        setRegisteredStudent(data.student);
        setPlayerName(data.student.full_name);
        setTeamAccessCodeInput(data.access_code || 'KBC-101');
        setAuthStep('GATE');
        kbcAudio.playSelect();
      } else if (data.alreadyRegistered) {
        setRegError(data.message || 'This email is already registered! Please login using your registered Email and Date of Birth.');
        setLoginForm(prev => ({ ...prev, email: regForm.email.trim() }));
      } else {
        setRegError(data.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setRegLoading(false);
      setRegError('Network error connecting to Hostinger database: ' + err.message);
    }
  };

  // ── Candidate Login with Email & Date of Birth (DOB) ──
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');

    if (!loginForm.email.trim()) {
      setLoginError('Please enter your registered Email Address.');
      return;
    }
    if (!loginForm.dob.trim()) {
      setLoginError('Please select your registered Date of Birth (DOB).');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch('/api/kbc/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email.trim(),
          dob: loginForm.dob.trim()
        })
      });

      const data = await res.json();
      setLoginLoading(false);

      if (data.success && data.student) {
        localStorage.setItem('kbc_registered_student', JSON.stringify(data.student));
        try {
          const studentProfile = {
            id: data.student.id,
            name: data.student.full_name,
            fullName: data.student.full_name,
            email: data.student.email,
            course: data.student.course,
            profile_photo: data.student.profile_photo
          };
          localStorage.setItem('exam_student', JSON.stringify(studentProfile));
        } catch (e) {}
        setRegisteredStudent(data.student);
        setPlayerName(data.student.full_name);
        setTeamAccessCodeInput(data.access_code || 'KBC-101');
        if (data.team) {
          localStorage.setItem('kbc_team', JSON.stringify(data.team));
          setTeam(data.team);
          setPlayMode('TEAM');
          setAuthStep('WAITING');
        } else {
          setAuthStep('GATE');
        }
        kbcAudio.playSelect();
      } else {
        setLoginError(data.message || 'Login failed. Please verify your Email and Date of Birth.');
      }
    } catch (err) {
      setLoginLoading(false);
      setLoginError('Network error connecting to Hostinger database: ' + err.message);
    }
  };

  // ── Switch / Logout Candidate Account ──
  const handleCandidateSwitch = () => {
    try {
      localStorage.removeItem('kbc_registered_student');
      localStorage.removeItem('kbc_team');
    } catch (e) {}
    setRegisteredStudent(null);
    setTeam(null);
    setPlayerName('Hotseat Contestant');
    setAuthStep('REGISTER');
    setAuthMode('LOGIN');
    setPlayMode('TEAM');
  };

  // ── Team Login / Exam Gate Entry with Access Code / Password ──
  const handleJoinTeam = async (e) => {
    if (e) e.preventDefault();
    setTeamJoinError('');
    const code = (teamAccessCodeInput || '').trim().toUpperCase();
    if (!code) {
      setTeamJoinError('Please enter your Team Access Code or Exam Password (e.g. KBC-101).');
      return;
    }

    setTeamJoinLoading(true);
    try {
      const laptopInfo = `${navigator.platform || 'Laptop'} (${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'})`;
      const res = await fetch('/api/kbc/team/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_code: code,
          email: registeredStudent?.email || candidateProfile?.email || '',
          full_name: registeredStudent?.full_name || candidateProfile?.name || playerName,
          profile_photo: registeredStudent?.profile_photo || candidateProfile?.profile_photo || null,
          laptop_info: laptopInfo
        })
      });
      const data = await res.json();
      if (data.success && data.team) {
        setTeam(data.team);
        localStorage.setItem('kbc_team', JSON.stringify(data.team));
        setPlayMode('TEAM');
        setAuthStep('WAITING');
        kbcAudio.init();
        kbcAudio.playLifeline();
        enterFullScreen();
        setShowLaserIntro(true);
      } else {
        setTeamJoinError(data.message || `Invalid Access Code / Password "${code}". Ask Admin for Exam Password.`);
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
    setTeamAnswerSubmitted(false);
    setAuthStep('GATE');
  };

  // ── Submit Laptop Option to Admin Monitor (Tracks submission time for tie-breaker) ──
  const handleSubmitTeamOption = async (idx) => {
    if (!team || timeLeft <= 0 || isTimeUp) return;
    setSelectedOption(idx);
    setIsLocked(true);
    setTeamAnswerSubmitted(true);
    setAnswerStatus('locked');
    kbcAudio.stopClock();
    kbcAudio.startLockSuspense();

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
        setHostQuote(`Team ${team.team_name} ne Option ${letter} lock kar diya hai! Admin monitor par aapka uttar darj ho chuka hai.`);
      }
    } catch (e) {}
  };

  // Current Question Object (Live Host broadcast in Team mode or Level Question in Solo)
  // Guarantees question and all 4 options NEVER disappear even at Level 17+ or beyond test sets
  const currentQ = (team && adminSession.current_question) 
    ? adminSession.current_question 
    : (questions[currentLevel - 1] || (questions.length > 0 ? questions[(currentLevel - 1) % questions.length] : null) || {
        id: `q_active_${currentLevel}`,
        level: currentLevel,
        topic: 'OOP & PROGRAMMING CONCEPTS',
        question: 'Which object-oriented concept focuses on hiding internal implementation details and exposing only essential interface?',
        options: [
          'Abstraction',
          'Compilation',
          'Iteration',
          'Inheritance'
        ],
        correct: 0,
        explanation: 'Abstraction hides internal implementation details and shows only necessary features to the outside world.'
      });
  const currentPrize = getPrizeForLevel(currentLevel, totalQuestions);

  // Helper to determine countdown seconds based on level (Tik-Tiki Ji)
  const getLevelCountdown = (lvl) => {
    if (lvl <= 5) return 30; // Level 1 to 5: 30 seconds
    if (lvl <= 10) return 45; // Level 6 to 10: 45 seconds
    return 60; // Level 11+: 60 seconds (Tik-Tiki active level to level)
  };

  // Handle Timeout (Tik-Tiki Ji ends time) - Player cannot choose answer, play suspense MP3 until Admin reveals!
  const handleTimeOut = () => {
    kbcAudio.stopClock();
    setIsLocked(true);
    setIsTimeUp(true);
    setIsCelebratingCorrect(false);
    setHostQuote(AMITABH_QUOTES.timeOut);

    // If an option was selected, lock it
    if (selectedOption !== null) {
      setAnswerStatus('locked');
      if (team) {
        handleSubmitTeamOption(selectedOption);
      }
    } else {
      setAnswerStatus('time_up');
    }

    // Play only the suspense MP3 until Admin reveals answer - DO NOT reveal wrong or correct automatically!
    kbcAudio.startLockSuspense();
  };

  const handleTimeOutRef = useRef(handleTimeOut);
  useEffect(() => {
    handleTimeOutRef.current = handleTimeOut;
  });

  // Determine if a round is actively playing and timer should tick
  const isClockActive = (playMode === 'TEAM' && team)
    ? (adminSession?.status === 'LIVE' && !isLocked && revealedCorrect === null && !gameOver && !adminSession?.timer_paused && !isTimeUp)
    : (gameStarted && !isLocked && revealedCorrect === null && !gameOver && !isTimeUp);

  const isRoundActive = isClockActive;

  const currentQId = (playMode === 'TEAM' && team)
    ? (adminSession?.current_question?.id || adminSession?.current_level || currentLevel)
    : currentLevel;

  const activeQuestionKeyRef = useRef(null);

  // 1. Reset and initialize countdown seconds when a new question arrives/starts
  // Crucial: do NOT guard with `if (!isRoundActive) return;` because if isTimeUp was true,
  // it would deadlock and never reset for the new question!
  const activeQuestionKey = (playMode === 'TEAM' && team)
    ? `${adminSession?.current_level || currentLevel}_${adminSession?.current_question?.id || currentLevel}`
    : `${currentLevel}_solo`;

  useEffect(() => {
    if (activeQuestionKeyRef.current !== activeQuestionKey) {
      activeQuestionKeyRef.current = activeQuestionKey;
      const initialSeconds = getLevelCountdown(currentLevel);
      setTimeLeft(initialSeconds);
      setIsTimeUp(false);
      if (isClockActive) {
        kbcAudio.startClock();
      } else {
        kbcAudio.stopClock();
      }
    }
  }, [activeQuestionKey, currentLevel, isClockActive]);

  // 2. Reliable 1-second countdown interval while round is actively playing
  useEffect(() => {
    if (!isClockActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      kbcAudio.stopClock();
      return;
    }

    // Round is active: ensure authentic KBC clock ticking audio is playing
    kbcAudio.startClock();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          kbcAudio.stopClock();
          setIsTimeUp(true);
          if (handleTimeOutRef.current) {
            handleTimeOutRef.current();
          }
          return 0;
        }
        const nextVal = prev - 1;
        kbcAudio.onTimerTick(nextVal, nextVal <= 10);
        return nextVal;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      kbcAudio.stopClock();
    };
  }, [isClockActive]);

  // 3. Reactively handle when countdown hits 0 (Player cannot choose answer)
  useEffect(() => {
    if (timeLeft <= 0 && !isTimeUp && !isLocked && revealedCorrect === null) {
      setIsTimeUp(true);
      if (handleTimeOutRef.current) {
        handleTimeOutRef.current();
      }
    }
  }, [timeLeft, isTimeUp, isLocked, revealedCorrect]);

  // Start the Game
  const handleStartGame = () => {
    kbcAudio.init();
    setIsWrongAnswer(false);
    setIsCelebratingCorrect(false);
    setLaserUpwardTrigger(prev => !prev);
    kbcAudio.playLaserSweep();
    kbcAudio.playQuestionArrival();
    setGameStarted(true);
    setPlayMode('SOLO');
    setSelectedOption(null);
    setIsLocked(false);
    setIsTimeUp(false);
    setAnswerStatus(null);
    setRevealedCorrect(null);
    setEliminatedOptions([]);
    setCurrentLevel(1);
    const initialSec = getLevelCountdown(1);
    setTimeLeft(initialSec);
    activeQuestionKeyRef.current = `1_lvl1`;
    kbcAudio.startClock();
    setHostQuote(AMITABH_QUOTES.questionIntro(1, KBC_PRIZE_LADDER[0]?.prize || '₹1,000'));
  };

  // Option Disabled condition: when locked, time is up (0 sec), or answer revealed
  const isOptionDisabled = isLocked || isTimeUp || timeLeft <= 0 || (revealedCorrect !== null);

  // Option Click
  const handleOptionClick = (idx) => {
    if (isOptionDisabled || eliminatedOptions.includes(idx)) return;
    kbcAudio.playSelect();
    setSelectedOption(idx);
    const letter = String.fromCharCode(65 + idx);
    const optionText = currentQ?.options?.[idx] || '';
    setHostQuote(AMITABH_QUOTES.optionSelected(letter, optionText));
  };

  // Confirm Lock Option ("Computer Ji, option [X] ko lock kiya jaye!")
  const handleLockOption = () => {
    if (selectedOption === null || isLocked || (revealedCorrect !== null)) return;
    setIsLocked(true);
    setAnswerStatus('locked');
    setTeamAnswerSubmitted(true);
    kbcAudio.stopClock();
    // Play and loop ONLY the uploaded suspense MP3 until admin reveals answer
    kbcAudio.startLockSuspense();
    const letter = String.fromCharCode(65 + selectedOption);
    setHostQuote(`Option ${letter} lock kar diya gaya hai! Kripya Admin ke uttar anavaran (reveal) ki pratiksha karein...`);

    if (team) {
      handleSubmitTeamOption(selectedOption);
    }
  };

  // Evaluate Locked Answer
  const evaluateAnswer = () => {
    const isCorrect = selectedOption === currentQ.correct;
    setRevealedCorrect(currentQ.correct);

    const speedBonus = Math.max(0, timeLeft * 2);
    calculateRoundPoints(isCorrect, speedBonus);

    if (isCorrect) {
      setIsWrongAnswer(false);
      setAnswerStatus('correct');
      // Trigger stage light flicker, zig-zag and bouncing animation
      setIsCelebratingCorrect(true);
      setTimeout(() => setIsCelebratingCorrect(false), 4200);

      const winAmount = currentPrize.amount;
      const winLabel = currentPrize.prize;
      setEarnedAmount(winAmount);
      setEarnedPrizeLabel(winLabel);

      const isHighPoints = currentLevel >= 10 || winAmount >= 320000;
      if (isHighPoints) {
        kbcAudio.playHighPoints();
        triggerGrandConfetti();
      } else {
        kbcAudio.playCorrect();
      }

      // Check if it's a Padav (Safe Milestone)
      if (currentPrize.isSafe) {
        setSafeWonAmount(winAmount);
        setSafeWonPrizeLabel(winLabel);
      }

      // Jackpot / End of Test Set check!
      const totalSessionQ = adminSession?.total_questions || (questions?.length || 10);
      if (currentLevel >= totalSessionQ) {
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
      // Wrong Answer! Turn lasers high-power bright red and point downward, holding until next question arrives
      setIsWrongAnswer(true);
      setIsCelebratingCorrect(false);
      kbcAudio.playWrong();
      setAnswerStatus('wrong');
      const correctLetter = String.fromCharCode(65 + currentQ.correct);
      setHostQuote(AMITABH_QUOTES.wrongAnswer(correctLetter));
      // Drop current level down so place in leaderboard goes down!
      setCurrentLevel(prev => Math.max(1, prev - 1));
      finishGame(false, false);
    }
  };

  // Advance to Next Level
  const advanceToNextLevel = () => {
    const nextLvl = currentLevel + 1;
    setCurrentLevel(nextLvl);
    setSelectedOption(null);
    setIsLocked(false);
    setIsTimeUp(false);
    setAnswerStatus(null);
    setRevealedCorrect(null);
    setEliminatedOptions([]);
    setIsWrongAnswer(false);
    setShowBroadcastLeaderboard(false);
    userDismissedLeaderboardRef.current = false;
    setLivePlayers(prev => prev.map(p => ({ ...p, lastPointsGained: 0, lastStatus: null })));
    const nextPrize = getPrizeForLevel(nextLvl, totalQuestions);
    setHostQuote(AMITABH_QUOTES.questionIntro(nextLvl, nextPrize.prize));
    setLaserUpwardTrigger(prev => !prev);
    kbcAudio.playLaserSweep();
    kbcAudio.playQuestionArrival();
    const nextSec = getLevelCountdown(nextLvl);
    setTimeLeft(nextSec);
    activeQuestionKeyRef.current = null;
    kbcAudio.startClock();
  };

  // Jackpot Win (₹7 Crore!)
  const handleJackpotWin = () => {
    kbcAudio.playHighPoints();
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
    if (!lifelines.fifty || isOptionDisabled || !currentQ) return;
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
    if (!lifelines.poll || isOptionDisabled || !currentQ) return;
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
    if (!lifelines.friend || isOptionDisabled || !currentQ) return;
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
    if (!lifelines.flip || isOptionDisabled || !currentQ) return;
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
    kbcAudio.stopClock();
    setIsWrongAnswer(false);
    setIsCelebratingCorrect(false);
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
    setIsTimeUp(false);
    setAnswerStatus(null);
    setRevealedCorrect(null);
    setEliminatedOptions([]);
    setActiveModal(null);
    setLifelines({ fifty: true, poll: true, friend: true, flip: true });
    activeQuestionKeyRef.current = null;
    setTimeLeft(getLevelCountdown(1));
    resetLivePlayers();
    fetchQuestions();
  };

  // Calculate final money to take home
  const finalChequeAmount = quitGame 
    ? earnedPrizeLabel 
    : gameWon 
    ? '₹7 Crore' 
    : (safeWonPrizeLabel !== '₹0' ? safeWonPrizeLabel : '₹0');

  return (
    <div className="kbc-dark-root min-h-screen text-white flex flex-col justify-between relative overflow-y-auto select-none font-sans bg-[#020617]">
      
      {/* ── Atmospheric Stage Lasers & Correct Answer Celebration Lights ── */}
      <KbcStageLasers
        triggerUpwardSweep={laserUpwardTrigger}
        isCelebratingCorrect={isCelebratingCorrect}
        isWrongAnswer={isWrongAnswer}
        isLocked={isLocked}
        hoveredOption={hoveredOption}
        selectedOption={selectedOption}
        isTimeUrgent={timeLeft <= 10 && timeLeft > 0}
      />

      {/* ── Fullscreen Cinematic Laser Logo Reveal Intro ── */}
      {showLaserIntro && (
        <KbcLaserLogoReveal onComplete={() => setShowLaserIntro(false)} />
      )}

      {/* ── Top Header Bar: Logo, Team Pill, Controls (Compact & Clean) ── */}
      <header className={`relative z-20 border-b transition-colors duration-700 bg-black/60 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 shrink-0 ${
        isWrongAnswer ? 'border-red-600/70 shadow-[0_4px_30px_rgba(239,68,68,0.25)]' : 'border-indigo-900/50'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Hotseat Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl p-1 bg-slate-900 border border-amber-400/60 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition flex items-center justify-center overflow-hidden">
                <img
                  src="/appletree_logo.png"
                  alt="AppleTree Infotech Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = '/logo.png'; }}
                />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black tracking-widest text-amber-400 block uppercase">
                  Kaun Banega Coder
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 tracking-tight block">
                  AppleTree Infotech • MERN & SQL Grand Exam
                </span>
              </div>
            </Link>

            {/* Universal Candidate Status Pill (Always Visible on Mobile & Desktop) */}
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-slate-950/95 via-[#0b1433]/95 to-slate-950/95 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-xs backdrop-blur-md">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-300 shrink-0 shadow-sm flex items-center justify-center">
                {candidateProfile.profile_photo ? (
                  <img src={candidateProfile.profile_photo} alt={candidateProfile.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-300 font-black text-[10px] sm:text-xs">
                    {candidateProfile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col text-left min-w-0 max-w-[90px] xs:max-w-[120px] sm:max-w-[170px] md:max-w-[210px]">
                <span className="text-[10.5px] sm:text-xs font-black text-white truncate leading-tight drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
                  {candidateProfile.name}
                </span>
                <span className="text-[8px] sm:text-[9px] text-cyan-300 font-bold truncate leading-none">
                  {candidateProfile.course || 'Hotseat Candidate'}
                </span>
              </div>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black border border-amber-400/40 font-mono text-[10px] sm:text-[11px] items-center gap-1 shrink-0">
                ⭐ {(userPoints || 0).toLocaleString()} pts
              </span>
              <button
                type="button"
                onClick={() => {
                  setPlayMode('TEAM');
                  setAuthStep('REGISTER');
                  setAuthMode('LOGIN');
                }}
                className="text-[9px] sm:text-[10px] font-bold text-cyan-400 hover:text-cyan-200 underline ml-0.5 cursor-pointer shrink-0"
                title="Switch Candidate Profile / Login"
              >
                Switch
              </button>
            </div>

            {/* Live Broadcast Indicator */}
            {adminSession.status === 'LIVE' && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/60 text-red-300 text-[10px] font-black uppercase tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                Live Broadcast
              </span>
            )}
          </div>

          {/* Right Controls: Mode Toggle, Fullscreen & Audio Mute */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (playMode === 'TEAM') {
                  setPlayMode('SOLO');
                } else {
                  setPlayMode('TEAM');
                  if (!team) setAuthStep('GATE');
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 hover:text-white border border-slate-800 text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer"
              title={playMode === 'TEAM' ? "Switch to Solo Hotseat" : "Connect Team Laptop"}
            >
              <Laptop className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{playMode === 'TEAM' ? 'Team Mode' : 'Solo Hotseat'}</span>
            </button>
            <button
              onClick={toggleFullScreen}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
              title={isFullScreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
            >
              {isFullScreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={toggleSound}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Arena: Host, Question, Options, and Money Ladder ── */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto p-1 sm:p-2 flex flex-col justify-between min-h-0 overflow-y-auto">
        
        {/* CASE 1: Connected Team Waiting for Admin to start Live Broadcast */}
        {playMode === 'TEAM' && team && adminSession.status !== 'LIVE' ? (
          <div className="my-auto max-w-2xl mx-auto text-center space-y-6 bg-gradient-to-b from-[#0b132e]/95 to-[#060a1d]/95 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
            
            {/* Host & Student Profile Avatars */}
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              {/* Host AppleTree Logo */}
              <div className="relative inline-block text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-2 bg-slate-900 border-2 border-amber-400/80 shadow-xl shadow-amber-500/30 overflow-hidden mx-auto flex items-center justify-center">
                  <img
                    src="/appletree_logo.png"
                    alt="AppleTree Infotech Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = '/logo.png'; }}
                  />
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                  AppleTree
                </span>
              </div>

              {/* Contestant / Student Registered Avatar */}
              <div className="relative inline-block text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 shadow-xl shadow-emerald-500/30 overflow-hidden mx-auto flex items-center justify-center">
                  {candidateProfile.profile_photo ? (
                    <img
                      src={candidateProfile.profile_photo}
                      alt="Student Contestant"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-emerald-300 font-black text-2xl">
                      {candidateProfile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow whitespace-nowrap">
                  Candidate
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/50 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live Hotseat Broadcast Lounge
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100">
                Swagat Hai, {candidateProfile.name}!
              </h2>
              <div className="text-amber-400/90 font-bold text-xs uppercase tracking-widest flex flex-wrap items-center justify-center gap-2">
                <span>Course: <strong className="text-white">{candidateProfile.course || 'Full Stack Coder'}</strong></span>
                <span>•</span>
                <span className="font-mono text-yellow-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">⭐ {team?.points || candidateProfile.points || 0} pts</span>
                <span>•</span>
                <span>Code: <span className="font-mono text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{team?.access_code || candidateProfile.access_code}</span></span>
              </div>
            </div>

            {/* Standby Status Card */}
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
                <span className="text-xs text-slate-400 font-bold">Broadcast Status:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Standby / Waiting for Admin Host to Start Quiz
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Round in Queue:</span>
                <span className="text-amber-300 font-black">
                  Level {adminSession.current_level || 1} ({getPrizeForLevel(adminSession.current_level || 1, totalQuestions)?.prize})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Your Connected Device:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {navigator.platform || 'Laptop'} (Live Synced with Admin)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Registered Email:</span>
                <span className="text-slate-200 font-mono">
                  {candidateProfile.email || team?.email || 'N/A'}
                </span>
              </div>

              <p className="text-xs text-slate-300 pt-2 leading-relaxed italic border-t border-indigo-900/40">
                "Kripya screen par bane rahein. Jaise hi Admin apne screen se 'Confirm & Start KBC Live' par click karenge, prashna aapke laptop par seedha prakat ho jayega!"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDisconnectTeam}
                className="px-5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs cursor-pointer transition flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect Team / Change Code</span>
              </button>
            </div>
          </div>
        ) : (playMode === 'TEAM' && !team && authStep === 'REGISTER') ? (
          /* CASE 2A: Candidate Registration & Login (Cyber Neon Glass Theme) */
          <div className="my-auto max-w-2xl w-full mx-auto animate-fade-in py-4">
            <div className="bg-slate-950/95 text-white border-2 border-cyan-400/80 rounded-[28px] p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.35)] backdrop-blur-xl space-y-5">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/60 pb-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {authMode === 'REGISTER' ? 'Candidate Registration' : 'Candidate Login'}
                  </h1>
                  <p className="text-xs sm:text-sm text-cyan-200/80 font-medium pt-0.5 leading-relaxed">
                    {authMode === 'REGISTER' 
                      ? 'Fill in your details and course below. Email is permanent & unique.' 
                      : 'Log in with your registered Email Address and Date of Birth (DOB).'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPlayMode('SOLO')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <span>Play Solo Hotseat →</span>
                </button>
              </div>

              {/* Currently Active / Logged-in Candidate Banner */}
              {candidateProfile.isLoggedIn && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#0a1b2a]/90 to-slate-900/90 border-2 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3.5">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-md shrink-0 flex items-center justify-center">
                      {candidateProfile.profile_photo ? (
                        <img src={candidateProfile.profile_photo} alt={candidateProfile.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-emerald-300 font-black text-base">
                          {candidateProfile.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50">
                          Active Candidate Session ✓
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white truncate drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">
                        {candidateProfile.name}
                      </h2>
                      <p className="text-xs text-slate-300 truncate">
                        {candidateProfile.email} • <span className="text-emerald-300 font-bold">{candidateProfile.course}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setPlayMode('SOLO')}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
                    >
                      Enter Hotseat Arena ➔
                    </button>
                    <button
                      type="button"
                      onClick={handleCandidateSwitch}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 text-xs font-bold transition cursor-pointer"
                      title="Log out and sign in with a different account"
                    >
                      Switch
                    </button>
                  </div>
                </div>
              )}

              {/* Mode Toggle: Register vs Login */}
              <div className="flex rounded-2xl bg-slate-900/90 p-1.5 border border-indigo-900/60">
                <button
                  type="button"
                  onClick={() => { setAuthMode('REGISTER'); setRegError(''); setLoginError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                    authMode === 'REGISTER' 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm border border-cyan-400/60' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 text-cyan-300" />
                  <span>New Candidate Registration</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('LOGIN'); setRegError(''); setLoginError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                    authMode === 'LOGIN' 
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-sm border border-amber-400/60' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Candidate Login (Email + DOB)</span>
                </button>
              </div>

              {authMode === 'LOGIN' ? (
                /* ── CANDIDATE LOGIN FORM (Email + DOB) ── */
                <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                      REGISTERED EMAIL ADDRESS <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="e.g. manish@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        DATE OF BIRTH (DOB) <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-400">login password</span>
                    </div>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={loginForm.dob}
                        onChange={e => setLoginForm(p => ({ ...p, dob: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-bold flex items-center justify-between gap-2 shadow-inner">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base tracking-wider shadow-lg shadow-amber-500/30 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loginLoading ? 'Authenticating with Hostinger DB...' : 'Log In to Exam 🔐'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('REGISTER'); setLoginError(''); }}
                      className="text-xs sm:text-sm font-bold text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                    >
                      New student? <span className="text-cyan-400 underline font-bold">Register Candidate Profile 📝 →</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* ── CANDIDATE REGISTRATION FORM ── */
                <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-1">
                  
                  {/* 1. Student Profile Photo Box */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        <span>📸 STUDENT PROFILE PHOTO</span>
                        <span className="text-red-400">*</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                        shown on leaderboard & certificate
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Avatar Preview Box */}
                      <div className="relative shrink-0">
                        {photoPreview ? (
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-cyan-400/60 bg-slate-950/60 flex flex-col items-center justify-center p-2 text-center text-cyan-300">
                            <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 mb-1 border border-cyan-500/40">
                              <User className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-bold text-cyan-300">Required</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 text-center sm:text-left flex-1">
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 transition transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer mx-auto sm:mx-0"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Upload Profile Photo *</span>
                        </button>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Upload a clear face portrait (JPG, PNG). Candidates who pass with top scores will be placed on the <strong className="text-amber-300 font-semibold">Leaderboard 1st, 2nd, and 3rd Podium!</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                      FULL NAME <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regForm.fullName}
                        onChange={e => setRegForm(p => ({ ...p, fullName: e.target.value }))}
                        placeholder="e.g. Manish Kumar"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
                      />
                    </div>
                  </div>

                  {/* 3. Two Columns: Email Address & Date of Birth */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                          EMAIL ADDRESS <span className="text-red-400">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-400">primary key (unique)</span>
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={regForm.email}
                          onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="e.g. manish@example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                          DATE OF BIRTH (DOB) <span className="text-red-400">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-400">for exam entry</span>
                      </div>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="date"
                          required
                          value={regForm.dob}
                          onChange={e => setRegForm(p => ({ ...p, dob: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Two Columns: Mobile / WhatsApp & Course Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5">
                        MOBILE / WHATSAPP NUMBER <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={regForm.mobile}
                          onChange={e => setRegForm(p => ({ ...p, mobile: e.target.value }))}
                          placeholder="10-digit mobile (e.g. 98XXXXXXXX)"
                          maxLength={15}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                          COURSE NAME <span className="text-red-400">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-400">specialization</span>
                      </div>
                      <div className="relative">
                        <GraduationCap className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          required
                          value={regForm.course}
                          onChange={e => setRegForm(p => ({ ...p, course: e.target.value }))}
                          className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-slate-900 text-slate-300">-- Select Course / Specialization ▼</option>
                          <option value="Full Stack Web Development (MERN)" className="bg-slate-900 text-white">Full Stack Web Development (MERN)</option>
                          <option value="Java Full Stack & Data Structures (DSA)" className="bg-slate-900 text-white">Java Full Stack & Data Structures (DSA)</option>
                          <option value="Python & AI / Data Science" className="bg-slate-900 text-white">Python & AI / Data Science</option>
                          <option value="B.Tech Computer Science (CSE)" className="bg-slate-900 text-white">B.Tech Computer Science (CSE)</option>
                          <option value="BCA (Bachelor of Computer Applications)" className="bg-slate-900 text-white">BCA (Bachelor of Computer Applications)</option>
                          <option value="MCA (Master of Computer Applications)" className="bg-slate-900 text-white">MCA (Master of Computer Applications)</option>
                          <option value="Diploma / Polytechnic in CS/IT" className="bg-slate-900 text-white">Diploma / Polytechnic in CS/IT</option>
                          <option value="Other" className="bg-slate-900 text-white">Other Course / Specialization</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Sub-input if Other course is chosen */}
                  {regForm.course === 'Other' && (
                    <div>
                      <input
                        type="text"
                        required
                        value={regForm.customCourse}
                        onChange={e => setRegForm(p => ({ ...p, customCourse: e.target.value }))}
                        placeholder="Enter your exact Course Name (e.g. B.Sc IT, Data Engineering)"
                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
                      />
                    </div>
                  )}

                  {regError && (
                    <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-bold space-y-2 shadow-inner">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{regError}</span>
                      </div>
                      {regError.includes('already registered') && (
                        <button
                          type="button"
                          onClick={() => {
                            setLoginForm(prev => ({ ...prev, email: regForm.email.trim() }));
                            setAuthMode('LOGIN');
                            setRegError('');
                          }}
                          className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Click Here to Log In with Date of Birth →</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-700 hover:from-cyan-500 hover:to-teal-400 text-white font-black text-sm sm:text-base tracking-wider shadow-lg shadow-cyan-600/30 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    {regLoading ? 'Saving to Hostinger Database...' : 'Submit Registration & Proceed 🚀'}
                  </button>

                  {/* Footer Switch to Login / Gate */}
                  <div className="text-center pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('LOGIN'); setRegError(''); }}
                      className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-200 transition cursor-pointer underline"
                    >
                      Already registered? Log in with Email & DOB →
                    </button>
                    <span className="hidden sm:inline text-slate-500">•</span>
                    <button
                      type="button"
                      onClick={() => setAuthStep('GATE')}
                      className="text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      Go to Exam Gate →
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (playMode === 'TEAM' && !team && authStep === 'GATE') ? (
          /* CASE 2B: Exam Gate (Join Team via Laptop / Default Password) */
          <div className="my-auto max-w-xl w-full mx-auto space-y-6 animate-fade-in py-4">
            
            {/* Header / AppleTree Infotech Logo */}
            <div className="text-center space-y-3 bg-gradient-to-b from-[#0b132e]/95 to-[#060a1d]/95 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="relative inline-block mx-auto">
                <div className="w-20 h-20 rounded-2xl p-2 bg-slate-900 border-2 border-amber-400/80 shadow-xl shadow-amber-500/30 flex items-center justify-center overflow-hidden">
                  <img
                    src="/appletree_logo.png"
                    alt="AppleTree Infotech Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = '/logo.png'; }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Host
                </span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100">
                  KAUN BANEGA CODER
                </h1>
                <p className="text-amber-400/90 font-bold text-xs tracking-widest uppercase">
                  MERN Stack & SQL Grand Examination Hotseat
                </p>
                <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto pt-1 leading-relaxed">
                  Participate live with your laptop in the Admin-controlled classroom competition! Face the 16-level championship questions in real-time.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setPlayMode('SOLO')}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
                  >
                    Enter Hotseat Arena Directly ➔
                  </button>
                </div>
              </div>

              {/* FORM: Team Access Code / Default Password Entry */}
              <form onSubmit={handleJoinTeam} className="pt-2 max-w-md mx-auto space-y-4 text-left">
                <div className="bg-slate-950/90 text-white rounded-2xl p-6 space-y-4 shadow-2xl border-2 border-cyan-400/80">
                  <div className="flex items-center gap-2 pb-2 border-b border-indigo-900/60 text-amber-400 text-xs font-black uppercase tracking-wider">
                    <Laptop className="w-4 h-4 text-amber-400" />
                    <span>JOIN TEAM VIA LAPTOP</span>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 mb-1.5 uppercase tracking-wider">
                      ENTER TEAM ACCESS CODE
                    </label>
                    <input
                      type="text"
                      value={teamAccessCodeInput}
                      onChange={e => setTeamAccessCodeInput(e.target.value)}
                      placeholder="E.G.  KBC-101"
                      className="w-full bg-slate-900 border-2 border-cyan-400/60 focus:border-amber-400 rounded-xl px-4 py-3.5 text-yellow-300 font-mono font-black text-center text-xl sm:text-2xl tracking-widest uppercase focus:outline-none shadow-inner"
                      autoFocus
                    />
                    <span className="text-[11px] text-slate-400 block mt-2 text-center font-medium">
                      Ask your Exam Admin / Host for your Team Access Code.
                    </span>
                  </div>

                  {candidateProfile.isLoggedIn && (
                    <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0d1633]/90 to-slate-900/90 border border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-sm shrink-0 flex items-center justify-center">
                          {candidateProfile.profile_photo ? (
                            <img 
                              src={candidateProfile.profile_photo} 
                              alt="Student Avatar" 
                              className="w-full h-full object-cover rounded-full" 
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-300 font-black text-sm">
                              {candidateProfile.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="text-xs min-w-0 text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-400">
                              LOGGED IN CANDIDATE
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                              Verified ✓
                            </span>
                          </div>
                          <div className="font-black text-white text-sm truncate">{candidateProfile.name}</div>
                          <div className="text-[11px] text-cyan-200/90 truncate">{candidateProfile.email} • {candidateProfile.course}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCandidateSwitch}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline shrink-0 cursor-pointer px-2 py-1"
                      >
                        Switch
                      </button>
                    </div>
                  )}

                  {teamJoinError && (
                    <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{teamJoinError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={teamJoinLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition transform hover:scale-[1.01] cursor-pointer"
                  >
                    {teamJoinLoading ? 'Connecting Laptop...' : 'CONNECT TO LIVE HOTSEAT →'}
                  </button>

                  <div className="text-center pt-2 border-t border-slate-800 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStep('REGISTER');
                        setAuthMode('LOGIN');
                      }}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-200 transition cursor-pointer underline"
                    >
                      Login with Email & DOB 🔐
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStep('REGISTER');
                        setAuthMode('REGISTER');
                      }}
                      className="text-xs font-bold text-amber-400 hover:text-amber-200 transition cursor-pointer underline"
                    >
                      Register New Candidate 📝
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        ) : (
          /* CASE 3: Live KBC Arena (Broadcast Studio Experience - 100% Transparent, Multi-Color Lighting) */
          <div 
            data-kbc="true"
            className="kbc-dark-root relative w-full max-w-7xl mx-auto flex flex-col justify-between h-full min-h-0 px-1 sm:px-2 overflow-hidden select-none !bg-transparent"
            style={{ backgroundColor: 'transparent' }}
          >
            {/* Mobile Header Quick Points Pill & Point Ladder Drawer Toggle */}
            <div className="lg:hidden flex items-center justify-between p-2 rounded-xl bg-[#0c102a]/90 border border-amber-400/40 backdrop-blur-md shadow-lg shrink-0 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-300 shrink-0 flex items-center justify-center">
                  {candidateProfile.profile_photo ? (
                    <img src={candidateProfile.profile_photo} alt={candidateProfile.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-300 font-bold text-[10px]">
                      {candidateProfile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-white truncate block leading-tight">
                    {candidateProfile.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-amber-300 font-bold">
                      ⭐ {(userPoints || 0).toLocaleString()} pts
                    </span>
                    <span className="text-slate-400">• Q{currentLevel}/{totalQuestions}</span>
                    {isUserOut ? (
                      <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
                        OUT
                      </span>
                    ) : (
                      <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                        Safe: {safePadavPoints}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileLeaderboard(prev => !prev)}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
              >
                <Trophy className="w-3.5 h-3.5" />
                {showMobileLeaderboard ? 'Hide' : 'Ladder'}
              </button>
            </div>

            {/* 2-Column Responsive Layout: Left Area (Lifelines, Timer, Question, Options, Status) + Right (200px KBC Point Leaderboard / Ladder) */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center lg:items-start justify-center w-full max-w-7xl mx-auto flex-1 min-h-0 overflow-hidden py-0.5 relative">
              
              {/* Left Column: Lifelines Truss, Radar Timer, Hex Question, 4 Options, Compact Status Bar */}
              <div className="flex-1 w-full max-w-4xl flex flex-col justify-between h-full min-h-0 space-y-1 sm:space-y-1.5 overflow-hidden">
              
              {/* ── Circular Overhead Lifeline Rig (Authentic 3D Glassy Spheres in Overhead Truss) ── */}
              <div className="flex items-center justify-center pt-0.5 pb-0.5 relative z-20 shrink-0">
                <div className="flex items-center justify-center gap-3 sm:gap-5 px-5 sm:px-8 py-1 rounded-full bg-gradient-to-r from-slate-950/90 via-[#0b1432]/90 to-slate-950/90 border border-cyan-400/50 shadow-[0_0_22px_rgba(6,182,212,0.35),inset_0_0_12px_rgba(6,182,212,0.2)] backdrop-blur-md">
                  {/* 50:50 Sphere Pod */}
                  <button
                    type="button"
                    onClick={useFiftyFifty}
                    disabled={!lifelines.fifty || isOptionDisabled}
                    title="50:50 Lifeline (Eliminate 2 wrong answers)"
                    className={`group flex flex-col items-center justify-center transition-all cursor-pointer ${
                      !lifelines.fifty ? 'opacity-30 line-through cursor-not-allowed scale-95' : 'hover:scale-115 active:scale-95'
                    }`}
                  >
                    <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-cyan-400/90 bg-gradient-to-b from-[#1e3a6e]/95 via-[#0f1f42]/95 to-[#050c1f] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.6),inset_0_0_12px_rgba(56,189,248,0.35)] relative overflow-hidden group-hover:border-yellow-300 group-hover:shadow-[0_0_26px_rgba(251,191,36,0.9)] transition-all">
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-t-full" />
                      <span className="font-sans font-black text-xs sm:text-sm text-white drop-shadow-[0_0_8px_#38bdf8]">50:50</span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-cyan-300 mt-0.5 drop-shadow-[0_0_4px_#06b6d4]">50:50</span>
                  </button>

                  {/* Audience Poll Sphere Pod */}
                  <button
                    type="button"
                    onClick={useAudiencePoll}
                    disabled={!lifelines.poll || isOptionDisabled}
                    title="Audience Poll (Janmat Sangrah 3D Hologram)"
                    className={`group flex flex-col items-center justify-center transition-all cursor-pointer ${
                      !lifelines.poll ? 'opacity-30 line-through cursor-not-allowed scale-95' : 'hover:scale-115 active:scale-95'
                    }`}
                  >
                    <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-cyan-400/90 bg-gradient-to-b from-[#1e3a6e]/95 via-[#0f1f42]/95 to-[#050c1f] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.6),inset_0_0_12px_rgba(56,189,248,0.35)] relative overflow-hidden group-hover:border-yellow-300 group-hover:shadow-[0_0_26px_rgba(251,191,36,0.9)] transition-all">
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-t-full" />
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 group-hover:text-yellow-300 drop-shadow-[0_0_8px_#38bdf8]" />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-cyan-300 mt-0.5 drop-shadow-[0_0_4px_#06b6d4]">AUDIENCE POLL</span>
                  </button>

                  {/* Video Call Sphere Pod */}
                  <button
                    type="button"
                    onClick={usePhoneAFriend}
                    disabled={!lifelines.friend || isOptionDisabled}
                    title="Video Call / Ask Tech Expert"
                    className={`group flex flex-col items-center justify-center transition-all cursor-pointer ${
                      !lifelines.friend ? 'opacity-30 line-through cursor-not-allowed scale-95' : 'hover:scale-115 active:scale-95'
                    }`}
                  >
                    <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-cyan-400/90 bg-gradient-to-b from-[#1e3a6e]/95 via-[#0f1f42]/95 to-[#050c1f] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.6),inset_0_0_12px_rgba(56,189,248,0.35)] relative overflow-hidden group-hover:border-yellow-300 group-hover:shadow-[0_0_26px_rgba(251,191,36,0.9)] transition-all">
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-t-full" />
                      <Video className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 group-hover:text-yellow-300 drop-shadow-[0_0_8px_#38bdf8]" />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-cyan-300 mt-0.5 drop-shadow-[0_0_4px_#06b6d4]">VIDEO CALL</span>
                  </button>

                  {/* Double Dip / Flip Question Pod */}
                  <button
                    type="button"
                    onClick={useFlipQuestion}
                    disabled={!lifelines.flip || isOptionDisabled}
                    title="Flip Question / Double Dip"
                    className={`group flex flex-col items-center justify-center transition-all cursor-pointer ${
                      !lifelines.flip ? 'opacity-30 line-through cursor-not-allowed scale-95' : 'hover:scale-115 active:scale-95'
                    }`}
                  >
                    <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-cyan-400/90 bg-gradient-to-b from-[#1e3a6e]/95 via-[#0f1f42]/95 to-[#050c1f] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.6),inset_0_0_12px_rgba(56,189,248,0.35)] relative overflow-hidden group-hover:border-yellow-300 group-hover:shadow-[0_0_26px_rgba(251,191,36,0.9)] transition-all">
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-t-full" />
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 group-hover:text-yellow-300 drop-shadow-[0_0_8px_#38bdf8]" />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-cyan-300 mt-0.5 drop-shadow-[0_0_4px_#06b6d4]">DOUBLE DIP</span>
                  </button>
                </div>
              </div>

              {/* ── Active Hotseat Candidate Holographic Badge in Arena ── */}
              <div className="w-full max-w-2xl mx-auto px-1 shrink-0 z-20">
                <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-1.5 rounded-2xl bg-gradient-to-r from-slate-950/90 via-[#0a1432]/90 to-slate-950/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3),inset_0_0_10px_rgba(6,182,212,0.15)] backdrop-blur-md">
                  
                  {/* Left: Avatar + Candidate Full Name + Course */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)] flex items-center justify-center">
                        {candidateProfile.profile_photo ? (
                          <img src={candidateProfile.profile_photo} alt={candidateProfile.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-300 font-black text-xs sm:text-sm">
                            {candidateProfile.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-sm" title="Active Contestant" />
                    </div>

                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          HOTSEAT CANDIDATE
                        </span>
                        {candidateProfile.course && (
                          <span className="text-[8.5px] px-2 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 font-bold truncate max-w-[120px] sm:max-w-[180px]">
                            {candidateProfile.course}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xs sm:text-sm md:text-base font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] truncate tracking-tight">
                        {candidateProfile.name}
                      </h2>
                    </div>
                  </div>

                  {/* Right: Live Points & Safe Padav */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[8.5px] text-slate-300 uppercase tracking-wider block font-bold">Current Score</span>
                      <span className="text-xs sm:text-sm font-black font-mono text-amber-300 flex items-center gap-1 justify-end drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]">
                        ⭐ {(userPoints || 0).toLocaleString()} <span className="text-[9px] text-amber-400 font-sans">pts</span>
                      </span>
                    </div>
                    <div className="h-6 w-[1px] bg-indigo-900/80 hidden xs:block" />
                    <div className="text-right hidden sm:block">
                      <span className="text-[8.5px] text-slate-300 uppercase tracking-wider block font-bold">Safe Padav</span>
                      <span className="text-xs sm:text-sm font-black font-mono text-emerald-400">
                        {safePadavPrize}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Center Concentric Holographic Countdown Timer (Matching TV Reference "24") ── */}
              <div className="flex items-center justify-center pt-0.5 pb-0.5 relative z-20 shrink-0">
                {currentLevel <= totalQuestions ? (
                  <div className="relative flex items-center justify-center">
                    {/* Glowing outer halo */}
                    <div className={`absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
                      timeLeft <= 0
                        ? 'bg-red-600/75 animate-pulse'
                        : timeLeft <= 10 
                          ? 'bg-red-500/70 animate-pulse scale-110' 
                          : timeLeft <= 15
                            ? 'bg-amber-500/50'
                            : 'bg-cyan-500/35'
                    }`} />

                    {/* Outer Rotating Decorative Dashed Ring */}
                    <div className={`absolute w-22 h-22 sm:w-24 sm:h-24 rounded-full border-2 border-dashed pointer-events-none transition-colors duration-500 ${
                      timeLeft <= 10 ? 'border-red-500/70 animate-spin [animation-duration:8s]' : 'border-cyan-400/50 animate-spin [animation-duration:20s]'
                    }`} />

                    {/* Circular Timer Body */}
                    <div 
                      className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full border-[3px] flex flex-col items-center justify-center shadow-2xl transition-all duration-300 select-none overflow-hidden cursor-pointer ${
                        timeLeft <= 0
                          ? 'border-red-600 bg-gradient-to-b from-red-950 via-black to-red-950 text-red-300 shadow-[0_0_25px_#dc2626]'
                          : timeLeft <= 10 
                            ? 'border-red-500 bg-gradient-to-b from-red-950/95 via-red-900/90 to-black/95 text-white shadow-[0_0_30px_#ef4444] animate-pulse' 
                            : timeLeft <= 15
                              ? 'border-amber-400 bg-gradient-to-b from-[#2a1705]/95 via-[#180e03]/95 to-black/95 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.6)]'
                              : 'border-cyan-400 bg-gradient-to-b from-[#0c244e]/95 via-[#06142a]/95 to-[#020612]/95 text-cyan-200 shadow-[0_0_28px_rgba(6,182,212,0.65)] hover:scale-105'
                      }`}
                      onClick={() => {
                        kbcAudio.init();
                        if (isRoundActive && timeLeft > 0) {
                          kbcAudio.startClock();
                        } else if (!gameStarted) {
                          handleStartGame();
                        }
                      }}
                      title={timeLeft <= 0 ? "Samay Samapt (Time Up)" : "Tik-Tiki Ji Countdown Timer (Click to Play Clock Sound)"}
                    >
                      {/* Inner gold accent ring matching TV reference */}
                      <div className="absolute inset-1.5 rounded-full border border-amber-400/40 pointer-events-none" />

                      {/* Glass top reflection */}
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-full" />

                      {/* Rotating Radar Sweep Hand */}
                      <div className="absolute inset-0 rounded-full border-r-2 border-cyan-400/40 animate-spin [animation-duration:3s] pointer-events-none" />

                      {/* SVG Circular Countdown Progress Arc */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="42%"
                          stroke="rgba(255, 255, 255, 0.12)"
                          strokeWidth="3.5"
                          fill="none"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="42%"
                          stroke={timeLeft <= 0 ? '#ef4444' : timeLeft <= 10 ? '#ef4444' : timeLeft <= 15 ? '#f59e0b' : '#00e5ff'}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          fill="none"
                          strokeDasharray={240}
                          strokeDashoffset={240 - (Math.max(0, Math.min(100, (timeLeft / (getLevelCountdown(currentLevel) || 30)) * 100)) / 100) * 240}
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>

                      <span className={`text-[7.5px] font-black uppercase tracking-widest font-sans -mb-0.5 z-10 ${
                        timeLeft <= 10 ? 'text-red-400' : timeLeft <= 15 ? 'text-amber-400' : 'text-cyan-300'
                      }`}>
                        {timeLeft <= 0 ? 'SAMAY' : 'TIK-TIKI'}
                      </span>
                      <span className={`text-2xl sm:text-3xl font-black font-mono leading-none tracking-tight z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] ${
                        timeLeft <= 0 ? 'text-red-400' : timeLeft <= 10 ? 'text-white' : timeLeft <= 15 ? 'text-amber-300' : 'text-white'
                      }`}>
                        {timeLeft <= 0 ? '0' : timeLeft < 10 ? `0:0${timeLeft}` : `0:${timeLeft}`}
                      </span>
                      <span className={`text-[6.5px] font-black tracking-wider uppercase z-10 ${
                        timeLeft <= 0 ? 'text-red-400' : 'text-cyan-400/80'
                      }`}>
                        {timeLeft <= 0 ? 'EXPIRED' : 'SEC'}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Level 11 to 16: No Timer Circular Badge */
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-emerald-400/60 bg-gradient-to-b from-emerald-950/90 to-[#060a1d]/95 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/25 text-emerald-300">
                      <span className="text-xl font-black">∞</span>
                      <span className="text-[7.5px] font-black uppercase tracking-wider text-emerald-400 -mt-0.5">
                        NO LIMIT
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── THE ICONIC 3D SCULPTED BROADCAST QUESTION CONSOLE ── */}
              <div className="relative w-full py-0.5 shrink-0">
                {/* Horizontal high-intensity cyan/gold cyber-rail extending across arena */}
                <div className={`absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 pointer-events-none transition-all duration-700 ${
                  isWrongAnswer
                    ? 'bg-gradient-to-r from-transparent via-red-500 via-rose-300 to-transparent shadow-[0_0_20px_#ef4444]'
                    : 'bg-gradient-to-r from-transparent via-amber-300/40 via-cyan-400 to-transparent shadow-[0_0_20px_#00f2fe]'
                }`} />

                {/* Left & Right Neon Pointer Flashes */}
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-400 blur-sm pointer-events-none" />
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-400 blur-sm pointer-events-none" />

                <div className="relative mx-auto w-full max-w-4xl min-h-[76px] sm:min-h-[86px] flex flex-col items-center justify-center text-center px-10 sm:px-16 py-3 sm:py-4 transition-all duration-700 select-none">
                  {/* SVG 3D Beveled Broadcast Chassis */}
                  <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_12px_30px_rgba(0,0,0,0.9)]" 
                    viewBox="0 0 900 110" 
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="qGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a"/>
                        <stop offset="25%" stopColor="#d4af37"/>
                        <stop offset="50%" stopColor="#f59e0b"/>
                        <stop offset="75%" stopColor="#fbbf24"/>
                        <stop offset="100%" stopColor="#92400e"/>
                      </linearGradient>
                      <linearGradient id="qRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fca5a5"/>
                        <stop offset="50%" stopColor="#ef4444"/>
                        <stop offset="100%" stopColor="#7f1d1d"/>
                      </linearGradient>
                      <linearGradient id="qBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1a2254"/>
                        <stop offset="50%" stopColor="#0f1435"/>
                        <stop offset="100%" stopColor="#080a1c"/>
                      </linearGradient>
                    </defs>

                    {/* Outer Hexagon with 3D Beveled Contour */}
                    <polygon 
                      points="32,3 868,3 897,55 868,107 32,107 3,55" 
                      fill="url(#qBodyGrad)" 
                      stroke={isWrongAnswer ? 'url(#qRedGrad)' : 'url(#qGoldGrad)'} 
                      strokeWidth="3.2"
                    />

                    {/* Inner Glowing Cyan/Gold Neon Trace Line */}
                    <polygon 
                      points="38,8 862,8 889,55 862,102 38,102 11,55" 
                      fill="none" 
                      stroke={isWrongAnswer ? '#f87171' : '#00f2fe'} 
                      strokeWidth="1.4"
                      strokeDasharray={isWrongAnswer ? 'none' : '6 3'}
                      opacity="0.85"
                    />

                    {/* Top Edge Specular Reflection */}
                    <line x1="45" y1="5" x2="855" y2="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  </svg>

                  {/* Top Glass Gloss Sheen */}
                  <div className="absolute inset-x-8 sm:inset-x-12 top-1 h-[45%] bg-gradient-to-b from-white/18 via-white/5 to-transparent pointer-events-none rounded-t-xl" />

                  {/* Floating 3D Pill Badge: QUESTION [X] • [PRIZE] */}
                  <div className="relative z-10 flex items-center justify-center gap-2 mb-1">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-950/90 via-slate-950/90 to-amber-950/90 border border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-amber-300">
                        QUESTION {currentLevel} • {currentPrize.prize}
                      </span>
                    </div>
                    {currentQ?.topic && (
                      <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 font-mono font-bold shadow-sm">
                        {currentQ?.topic}
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-white leading-snug px-4 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] line-clamp-3 uppercase tracking-wide">
                    {currentQ?.question}
                  </h2>
                </div>
              </div>

              {/* ── 4 SCULPTED 3D HEXAGONAL OPTION PODS (With Metallic Letter Emblem & Continuous Cyber-Rails) ── */}
              <div className="relative max-w-4xl mx-auto w-full space-y-2 shrink-0 pt-0.5">
                {(() => {
                  const renderOptionItem = (idx) => {
                    if (!currentQ || !currentQ.options || currentQ.options[idx] === undefined) return null;
                    const opt = currentQ.options[idx];
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = selectedOption === idx;
                    const isEliminated = eliminatedOptions.includes(idx);
                    const isCorrect = revealedCorrect === idx;
                    const isWrongSelected = answerStatus === 'wrong' && isSelected;
                    const isHovered = hoveredOption === idx && !isOptionDisabled;

                    if (isEliminated) {
                      return (
                        <div 
                          key={idx} 
                          className="relative opacity-25 pointer-events-none py-2 px-6 min-h-[46px] sm:min-h-[50px] flex items-center justify-between overflow-hidden rounded-xl"
                          style={{
                            background: '#090817',
                            border: '1.5px dashed #ef4444'
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded border border-red-500/40 bg-red-950/50 flex items-center justify-center font-mono text-xs font-black text-red-500">
                              {letter}
                            </div>
                            <span className="text-slate-600 line-through text-xs font-bold tracking-wider">————————</span>
                          </div>
                          <span className="text-[9px] text-red-400 font-black tracking-wider uppercase bg-red-950 px-2 py-0.5 rounded border border-red-800">50:50</span>
                        </div>
                      );
                    }

                    // Dynamic interactive colors & gradients
                    let strokeColor = '#38bdf8';
                    let innerStrokeColor = '#00f2fe';
                    let strokeWidth = '2.2';
                    let filterDrop = 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))';
                    let textColor = 'text-white';

                    // Determine fill gradient & borders
                    let fillId = `optFillDef_${idx}`;
                    let isSpecialState = false;

                    if (isWrongSelected) {
                      isSpecialState = true;
                      fillId = `optFillWrong_${idx}`;
                      strokeColor = '#f87171';
                      innerStrokeColor = '#fca5a5';
                      strokeWidth = '2.8';
                      filterDrop = 'drop-shadow(0 0 24px rgba(239, 68, 68, 0.95))';
                      textColor = 'text-white';
                    } else if (isCorrect) {
                      isSpecialState = true;
                      fillId = `optFillCorrect_${idx}`;
                      strokeColor = '#34d399';
                      innerStrokeColor = '#6ee7b7';
                      strokeWidth = '2.8';
                      filterDrop = 'drop-shadow(0 0 24px rgba(16, 185, 129, 0.95))';
                      textColor = 'text-white';
                    } else if (isSelected) {
                      // Exact locked golden/amber gradient matching TV broadcast
                      isSpecialState = true;
                      fillId = `optFillLocked_${idx}`;
                      strokeColor = '#fef08a';
                      innerStrokeColor = '#fef9c3';
                      strokeWidth = '2.8';
                      filterDrop = 'drop-shadow(0 0 28px rgba(245, 158, 11, 0.95))';
                      textColor = 'text-slate-950';
                    } else if (isHovered && !isLocked) {
                      fillId = `optFillHover_${idx}`;
                      strokeColor = '#67e8f9';
                      innerStrokeColor = '#a5f3fc';
                      strokeWidth = '2.5';
                      filterDrop = 'drop-shadow(0 0 20px rgba(103, 232, 249, 0.75))';
                    } else if (isLocked && revealedCorrect === null) {
                      strokeColor = '#0284c7';
                      innerStrokeColor = '#38bdf8';
                      textColor = 'text-white';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        onMouseEnter={() => setHoveredOption(idx)}
                        onMouseLeave={() => setHoveredOption(null)}
                        disabled={isOptionDisabled}
                        className={`group relative text-left py-2 px-4 sm:px-6 min-h-[46px] sm:min-h-[50px] transition-all overflow-hidden flex items-center justify-between select-none ${
                          isOptionDisabled
                            ? (isSelected && isLocked) 
                              ? 'cursor-default ring-2 ring-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)] z-20' 
                              : 'cursor-default pointer-events-none'
                            : 'cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]'
                        } ${
                          isSelected && (answerStatus === 'evaluating' || answerStatus === 'locked') ? 'animate-pulse' : ''
                        }`}
                        style={{ filter: filterDrop, color: isSelected ? '#0f172a' : '#ffffff' }}
                      >
                        {/* SVG 3D Sculpted Beveled Hexagon Chassis */}
                        <svg 
                          className="absolute inset-0 w-full h-full pointer-events-none" 
                          viewBox="0 0 440 56" 
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id={`optFillDef_${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#141c48"/>
                              <stop offset="60%" stopColor="#0c1230"/>
                              <stop offset="100%" stopColor="#06091b"/>
                            </linearGradient>
                            <linearGradient id={`optFillHover_${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#1d2b6b"/>
                              <stop offset="60%" stopColor="#121b44"/>
                              <stop offset="100%" stopColor="#090e25"/>
                            </linearGradient>
                            <linearGradient id={`optFillLocked_${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#fef08a"/>
                              <stop offset="28%" stopColor="#f59e0b"/>
                              <stop offset="72%" stopColor="#d97706"/>
                              <stop offset="100%" stopColor="#78350f"/>
                            </linearGradient>
                            <linearGradient id={`optFillCorrect_${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#6ee7b7"/>
                              <stop offset="30%" stopColor="#10b981"/>
                              <stop offset="70%" stopColor="#047857"/>
                              <stop offset="100%" stopColor="#064e3b"/>
                            </linearGradient>
                            <linearGradient id={`optFillWrong_${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#fca5a5"/>
                              <stop offset="30%" stopColor="#ef4444"/>
                              <stop offset="70%" stopColor="#b91c1c"/>
                              <stop offset="100%" stopColor="#7f1d1d"/>
                            </linearGradient>
                          </defs>

                          {/* Outer Hexagon with 3D Bevel */}
                          <polygon 
                            points="18,2 422,2 438,28 422,54 18,54 2,28" 
                            fill={`url(#${fillId})`} 
                            stroke={strokeColor} 
                            strokeWidth={strokeWidth}
                          />

                          {/* Inner Accent Groove */}
                          <polygon 
                            points="22,6 418,6 431,28 418,50 22,50 9,28" 
                            fill="none" 
                            stroke={innerStrokeColor} 
                            strokeWidth="1"
                            opacity={isSpecialState ? "0.9" : "0.55"}
                          />

                          {/* Top Specular Gloss Highlight */}
                          <line x1="24" y1="4" x2="416" y2="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                        </svg>

                        {/* Top Curved Glass Reflection */}
                        <div className="absolute inset-x-6 top-0.5 h-[40%] bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none rounded-t-lg" />

                        {/* Content Container */}
                        <div className="flex items-center gap-2.5 sm:gap-3.5 relative z-10 w-full min-w-0 px-2 sm:px-3">
                          
                          {/* 3D Metallic Letter Emblem Plate (A, B, C, D) */}
                          <div className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg flex items-center justify-center shrink-0 shadow-md transition-all ${
                            isSelected 
                              ? 'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 border-2 border-yellow-200 text-slate-950 font-black shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                              : isCorrect
                                ? 'bg-gradient-to-b from-emerald-400 to-emerald-800 border-2 border-emerald-300 text-white font-black shadow-[0_0_12px_rgba(16,185,129,0.9)]'
                                : isWrongSelected
                                  ? 'bg-gradient-to-b from-red-500 to-red-900 border-2 border-red-300 text-white font-black shadow-[0_0_12px_rgba(239,68,68,0.9)]'
                                  : 'bg-gradient-to-b from-slate-900 via-[#111936] to-slate-950 border border-amber-400/80 text-amber-300 font-black shadow-[0_0_10px_rgba(245,158,11,0.5)] group-hover:border-yellow-300'
                          }`}>
                            <span 
                              className={`font-mono text-xs sm:text-sm tracking-tight font-black ${
                                isSelected ? 'text-slate-950 font-black' : 'text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                              }`}
                              style={{ color: isSelected ? '#0f172a' : '#fde047' }}
                            >
                              {letter}
                            </span>
                          </div>

                          {/* Option Text: Pure Crisp White Guaranteed */}
                          <span 
                            className={`text-xs sm:text-sm md:text-[14.5px] font-extrabold flex-1 uppercase tracking-wider truncate drop-shadow-[0_2px_5px_rgba(0,0,0,1)] ${
                              isSelected ? '!text-slate-950 !drop-shadow-none' : '!text-white'
                            }`}
                            style={{
                              color: isSelected ? '#0f172a' : '#ffffff',
                              WebkitTextFillColor: isSelected ? '#0f172a' : '#ffffff',
                              textShadow: isSelected ? 'none' : '0 2px 4px rgba(0,0,0,0.95)'
                            }}
                          >
                            {opt}
                          </span>

                          {/* Option Status Badges */}
                          {isSelected && isLocked && revealedCorrect === null && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-950/80 text-amber-300 border border-amber-400 font-mono font-black text-[9px] uppercase tracking-wider shadow-[0_0_14px_rgba(245,158,11,0.9)] shrink-0 animate-pulse">
                              <Lock className="w-3 h-3 text-amber-300" />
                              <span>LOCKED</span>
                            </span>
                          )}
                          {isCorrect && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-950/90 text-emerald-200 border border-emerald-400 font-mono font-black text-[9px] uppercase tracking-wider shadow-[0_0_14px_rgba(16,185,129,0.9)] shrink-0 animate-bounce">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                              <span>SAHI</span>
                            </span>
                          )}
                          {isWrongSelected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-950/90 text-red-200 border border-red-400 font-mono font-black text-[9px] uppercase tracking-wider shadow-[0_0_14px_rgba(239,68,68,0.9)] shrink-0">
                              <XCircle className="w-3.5 h-3.5 text-red-300" />
                              <span>GALAT</span>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  };

                  return (
                    <>
                      {/* ROW 1: Options A & B with Continuous Cyber-Rail 1 */}
                      <div className="relative w-full">
                        {/* Horizontal illuminated laser rail behind Row 1 extending to edges */}
                        <div className="absolute top-1/2 left-0 right-0 h-[2.5px] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400 via-white to-transparent pointer-events-none shadow-[0_0_16px_#00f2fe]" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5 relative z-10">
                          {renderOptionItem(0)}
                          {renderOptionItem(1)}
                        </div>
                      </div>

                      {/* ROW 2: Options C & D with Continuous Cyber-Rail 2 */}
                      <div className="relative w-full">
                        {/* Horizontal illuminated laser rail behind Row 2 extending to edges */}
                        <div className="absolute top-1/2 left-0 right-0 h-[2.5px] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400 via-white to-transparent pointer-events-none shadow-[0_0_16px_#00f2fe]" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5 relative z-10">
                          {renderOptionItem(2)}
                          {renderOptionItem(3)}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* ── COMPACT SINGLE-SCREEN STATUS RIBBONS (High-Contrast Dark Neon Glass) ── */}
              
              {/* 1. "Confirm Team Choice" Bar (Shown only before locking) */}
              {!isLocked && selectedOption !== null && !isOptionDisabled && (
                <div 
                  className="flex items-center justify-between px-4 py-1.5 rounded-full shadow-2xl max-w-4xl mx-auto shrink-0 animate-fade-in w-full select-none"
                  style={{
                    background: 'linear-gradient(90deg, rgba(8, 14, 38, 0.98) 0%, rgba(15, 23, 55, 0.98) 100%)',
                    border: '2px solid rgba(245, 158, 11, 0.85)',
                    boxShadow: '0 0 25px rgba(245, 158, 11, 0.45), inset 0 0 15px rgba(251, 191, 36, 0.15)'
                  }}
                >
                  <div className="text-xs text-amber-300 font-extrabold flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="truncate">Option {String.fromCharCode(65 + selectedOption)} chuna gaya hai {team ? '(Laptop se Admin monitor par live).' : ''}</span>
                  </div>
                  <button
                    onClick={handleLockOption}
                    disabled={isOptionDisabled}
                    className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-500/40 transition transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-950" />
                    <span>CONFIRM TEAM CHOICE 🔒</span>
                  </button>
                </div>
              )}

              {/* 2. Tension / Suspense MP3 Playing Banner (Until Admin Reveals) */}
              {isLocked && revealedCorrect === null && (
                <div 
                  className="flex items-center justify-between px-4 py-1.5 rounded-xl shadow-2xl max-w-4xl mx-auto shrink-0 animate-pulse w-full select-none"
                  style={{
                    background: 'linear-gradient(90deg, rgba(30, 15, 5, 0.98) 0%, rgba(45, 20, 10, 0.98) 50%, rgba(20, 10, 40, 0.98) 100%)',
                    border: '2px solid rgba(245, 158, 11, 0.85)',
                    boxShadow: '0 0 30px rgba(245, 158, 11, 0.5), inset 0 0 15px rgba(251, 191, 36, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-2 text-amber-300 font-black text-xs sm:text-sm uppercase tracking-wider truncate">
                    <Lock className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                    <span>Option {selectedOption !== null ? String.fromCharCode(65 + selectedOption) : ''} Lock Ho Chuka Hai 🔒</span>
                    <span className="hidden sm:inline text-[11px] text-amber-200/80 font-normal font-sans lowercase">
                      ({playMode === 'TEAM' ? 'suspense music live...' : 'pratiksha karein...'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-amber-500/60 text-amber-300 text-[10px] font-black tracking-wide shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>Waiting for Admin</span>
                    </div>
                    {playMode === 'SOLO' && (
                      <button
                        onClick={evaluateAnswer}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow cursor-pointer hover:scale-105 transition"
                      >
                        Sahi Uttar Batayein! 🎬
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Time Out / Samay Samapt Banner (If not yet locked) */}
              {(isTimeUp || timeLeft <= 0) && !isLocked && revealedCorrect === null && (
                <div 
                  className="flex items-center justify-center gap-2 py-1 px-4 rounded-xl shadow-lg text-center animate-pulse max-w-4xl mx-auto shrink-0 w-full"
                  style={{
                    background: 'linear-gradient(90deg, rgba(69, 10, 10, 0.95) 0%, rgba(127, 29, 29, 0.95) 100%)',
                    border: '2px solid rgba(239, 68, 68, 0.8)',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.45)'
                  }}
                >
                  <Clock className="w-4 h-4 text-red-300 shrink-0" />
                  <span className="text-xs font-black text-red-100 tracking-wider uppercase">
                    ⏰ Samay Samapt (Time Up) — Answers Closed for this Round
                  </span>
                </div>
              )}

              </div>

              {/* Right Column: Authentic KBC Point Leaderboard / Ladder strictly 200px */}
              <div className="hidden lg:flex w-[200px] shrink-0 flex-col items-center justify-start sticky top-14">
                <KbcPointsLadder
                  currentLevel={currentLevel}
                  totalQuestions={totalQuestions}
                  userPoints={userPoints}
                  isOut={isUserOut}
                  isWrongAnswer={isWrongAnswer}
                  safePoints={safePadavPoints}
                  safePrize={safePadavPrize}
                  candidateName={candidateProfile.name}
                  candidatePhoto={candidateProfile.profile_photo}
                />
              </div>

            </div>

            {/* Mobile Slide-Up Modal Drawer for KBC Point Ladder */}
            <AnimatePresence>
              {showMobileLeaderboard && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md p-3">
                  <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-[#0a0d24] border-2 border-amber-400/60 rounded-3xl p-3 sm:p-4 max-h-[85vh] overflow-y-auto space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-indigo-900/50">
                      <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-400" /> KBC Point Leaderboard
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowMobileLeaderboard(false)}
                        className="text-xs px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
                      >
                        Close ✕
                      </button>
                    </div>
                    <KbcPointsLadder
                      currentLevel={currentLevel}
                      totalQuestions={totalQuestions}
                      userPoints={userPoints}
                      isOut={isUserOut}
                      isWrongAnswer={isWrongAnswer}
                      safePoints={safePadavPoints}
                      safePrize={safePadavPrize}
                      candidateName={candidateProfile.name}
                      candidatePhoto={candidateProfile.profile_photo}
                    />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}

      </main>

      {/* ── MODALS: Audience Poll, Expert Video Call, Quit Confirmation, Winner Cheque ── */}

      {/* 1. Audience Poll Modal (Authentic 3D Holographic Stage - Matching Image 2) */}
      {activeModal === 'poll' && pollData && (() => {
        const pollArray = [0, 1, 2, 3].map(i => Number(pollData?.[i] ?? 0));
        const maxPercent = Math.max(...pollArray);
        const topOptIdx = pollArray.indexOf(maxPercent);
        const topLetter = String.fromCharCode(65 + (topOptIdx >= 0 ? topOptIdx : 0));

        return (
          <div 
            className="fixed inset-0 z-50 flex flex-col justify-between p-3 sm:p-6 bg-slate-950/95 overflow-hidden backdrop-blur-xl animate-in fade-in duration-300 select-none"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(2, 6, 23, 0.72) 0%, rgba(2, 6, 23, 0.88) 100%), url('/kbc-concepts/kbc_audience_poll_stage_bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Top Bar: QUIZ CHAMPIONSHIP (Left) & AUDIENCE POLL (Right) */}
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto z-10 pt-1">
              <div className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-slate-950/80 border-2 border-cyan-400 text-cyan-300 font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                QUIZ CHAMPIONSHIP
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-slate-950/80 border-2 border-cyan-400 text-cyan-300 font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                  AUDIENCE POLL
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border-2 border-cyan-400 text-cyan-300 hover:text-white transition cursor-pointer shadow-md"
                  title="Close Audience Poll"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Right Side HUD Pill: AUDIENCE POLL - LIFELINE ACTIVE */}
            <div className="w-full max-w-6xl mx-auto flex justify-end z-10 -my-1">
              <div className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/90 border-2 border-cyan-400 text-cyan-300 font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                AUDIENCE POLL - LIFELINE ACTIVE
              </div>
            </div>

            {/* ── CENTER STAGE: 3D HOLOGRAPHIC CUBE DISPLAY ── */}
            <div className="relative w-full max-w-xl mx-auto my-auto z-10">
              
              {/* Floor Neon Emitter Ring Projection */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-80 h-16 rounded-full border-2 border-cyan-400/60 shadow-[0_0_30px_#00f2fe] pointer-events-none" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-12 rounded-full border border-purple-400/40 pointer-events-none" />

              {/* The 3D Transparent Hologram Kiosk Box */}
              <div className="relative rounded-3xl p-5 sm:p-7 border-2 border-cyan-400/80 shadow-[0_0_60px_rgba(6,182,212,0.45)] backdrop-blur-md bg-slate-950/75 overflow-hidden text-center space-y-4">
                
                {/* Holographic Header Recommendation */}
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-bold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin [animation-duration:6s]" />
                  <span>Audience Consensus: <strong>Option [{topLetter}]</strong> leads with <strong>{maxPercent}%</strong> votes</span>
                </div>

                {/* 4 Vertical 3D Pillars Inside Hologram */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4 items-end h-56 sm:h-64 pt-6 pb-2 px-3 bg-slate-950/80 rounded-2xl border border-indigo-950/80 relative">
                  
                  {/* Grid floor glow */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none rounded-b-2xl" />

                  {[0, 1, 2, 3].map(optIdx => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const percent = pollArray[optIdx] ?? 0;
                    const isTop = optIdx === topOptIdx && percent > 0;

                    return (
                      <div key={optIdx} className="flex flex-col items-center gap-1.5 h-full justify-end relative z-10 group">
                        
                        {/* Large Letter on Top (Matching Image 2: e.g. B in large gold) */}
                        <span className={`font-sans font-black text-2xl sm:text-3xl leading-none transition-transform duration-300 group-hover:scale-110 ${
                          isTop 
                            ? 'text-amber-300 drop-shadow-[0_0_15px_#f59e0b]' 
                            : 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                        }`}>
                          {letter}
                        </span>

                        {/* Percentage Below Letter (Matching Image 2: e.g. 74% in gold) */}
                        <span className={`font-mono font-black text-sm sm:text-lg mb-1 leading-none ${
                          isTop 
                            ? 'text-yellow-300 drop-shadow-[0_0_12px_#fbbf24]' 
                            : 'text-cyan-300 drop-shadow-[0_0_6px_#38bdf8]'
                        }`}>
                          {percent}%
                        </span>

                        {/* 3D Vertical Neon Column */}
                        <div className="w-full max-w-[58px] relative flex flex-col justify-end items-center">
                          {/* 3D Top Cap */}
                          <div 
                            className={`w-full h-2.5 rounded-full transition-all duration-700 ${
                              isTop 
                                ? 'bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,1)]' 
                                : 'bg-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.9)]'
                            }`}
                          />
                          {/* Main Glowing 3D Column Body */}
                          <div 
                            className={`w-full rounded-t-lg transition-all duration-1000 relative overflow-hidden ${
                              isTop
                                ? 'bg-gradient-to-t from-amber-700 via-amber-500 to-yellow-300 shadow-[0_0_35px_rgba(245,158,11,0.9)] border-x border-t border-yellow-200'
                                : 'bg-gradient-to-t from-indigo-900 via-blue-600 to-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.5)] border-x border-t border-cyan-400/60'
                            }`}
                            style={{ height: `${Math.max(percent * 1.8, 16)}px` }}
                          >
                            {/* Glass Reflection Highlight */}
                            <div className="absolute inset-y-0 left-1 w-1 bg-white/40 blur-[0.5px] rounded-full pointer-events-none" />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Bottom Platform Podium Tray (Matching Image 2: A: (12%) B: (74%) C: (8%) D: (6%)) */}
                <div className="py-2.5 px-3 sm:px-4 rounded-xl bg-slate-950/95 border-2 border-cyan-400/80 flex items-center justify-around text-xs sm:text-sm font-mono font-black shadow-inner">
                  {[0, 1, 2, 3].map(idx => (
                    <span 
                      key={idx} 
                      className={idx === topOptIdx ? "text-amber-300 drop-shadow-[0_0_10px_#f59e0b] scale-105" : "text-cyan-300"}
                    >
                      {String.fromCharCode(65 + idx)}: ({pollArray[idx]}%)
                    </span>
                  ))}
                </div>

              </div>
            </div>

            {/* Bottom Bar: QUESTION [X] (Left) & RESULTS Button (Center) */}
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto z-10 pb-1">
              <div className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-slate-950/80 border-2 border-cyan-400 text-cyan-300 font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                QUESTION {currentLevel}
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 sm:px-12 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(6,182,212,0.8)] cursor-pointer hover:scale-105 transition"
              >
                RESULTS (CONTINUE ➔)
              </button>
            </div>

          </div>
        );
      })()}

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
                <Trophy className="w-3.5 h-3.5" /> Official Kaun Banega Coder Cheque
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100">
                {gameWon ? '7 CRORE MAHA CODER!' : 'SHANDAR PRADARSHAN!'}
              </h2>
            </div>

            {/* ── THE OFFICIAL KBC CHEQUE ── */}
            <div className="relative bg-gradient-to-r from-[#faf5ea] via-[#fffbf0] to-[#f5eedb] text-slate-900 border-4 border-[#b8860b] rounded-2xl p-6 sm:p-8 shadow-2xl text-left font-serif overflow-hidden">
              {/* Cheque Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none text-6xl font-black">
                KAUN BANEGA CODER
              </div>

              {/* Top Row: Bank Name & Cheque Date */}
              <div className="flex items-start justify-between border-b-2 border-amber-900/30 pb-3 mb-4">
                <div>
                  <h4 className="text-lg font-black tracking-wider text-amber-950 uppercase font-sans">
                    Bank of Kaun Banega Coder
                  </h4>
                  <p className="text-[10px] text-amber-800 font-sans tracking-wide">
                    AppleTree Infotech • MERN & SQL Grand Assessment Hotseat Branch
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
                    AppleTree Infotech
                  </div>
                  <span className="text-[10px] text-slate-600 font-sans uppercase tracking-wider block pt-0.5">
                    Authorized Signatory (AppleTree)
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

      {/* ── SAAT CRORE TOP SCORER MEME MODAL ── */}
      {activeModal === 'saat_crore_winner' && winnerData && (
        <SaatCroreWinnerModal
          winner={winnerData}
          onClose={() => setActiveModal(null)}
          isCurrentPlayer={Boolean(team && (team.id === winnerData.id || (team.email && winnerData.email && team.email.toLowerCase() === winnerData.email.toLowerCase())))}
        />
      )}

      {/* ── BROADCAST MOVING LEADERBOARD MODAL (Triggered by Admin across all screens) ── */}
      {showBroadcastLeaderboard && (
        <MovingLeaderboardModal
          players={displayPlayers}
          onClose={() => {
            userDismissedLeaderboardRef.current = true;
            setShowBroadcastLeaderboard(false);
          }}
          currentUserTeam={team}
          currentLevel={currentLevel}
        />
      )}

      {/* ── Footer ── */}
      <footer className="relative z-10 py-2 text-center text-[11px] text-slate-400 border-t border-slate-900 bg-black/40">
        AppleTree Infotech • Kaun Banega Coder (KBC) Programming Arena
      </footer>

    </div>
  );
}
