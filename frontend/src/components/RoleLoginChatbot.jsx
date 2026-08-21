import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Key, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const PREDEFINED_QUESTIONS = [
  {
    id: 'student',
    icon: GraduationCap,
    category: 'Student Portal',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    question: '🎓 How do I log in as a Student / Learner?',
    shortLabel: 'Student Login',
    answer: `**Student / Learner Login Guide:**
1. Navigate to the **Login Page** (/login).
2. Enter your registered **Email Address** & **Password** created during admission.
3. You will be automatically redirected to your **Student LMS Dashboard** (/dashboard/student).
4. Inside, you can access your enrolled courses (Java, MERN, Python), test DSA problems in the compiler, take quizzes, and download verified course certificates.`,
    actionText: 'Go to Student Login',
    actionLink: '/login',
    portalLink: '/dashboard/student',
    portalText: 'Open Student LMS'
  },
  {
    id: 'admin',
    icon: ShieldCheck,
    category: 'Admin Portal',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    question: '🛡️ How do Admins log in to the Admin Dashboard?',
    shortLabel: 'Admin Login',
    answer: `**Admin Portal Access:**
1. Go to the **Login Page** (/login).
2. Enter your verified **Admin credentials**.
3. You will be redirected to the **Master Admin Panel** (/dashboard/admin).
4. Admins can review & approve new admissions, manage courses & faculty, inspect pending student fees, trigger WhatsApp reminders, and issue digital certificates.`,
    actionText: 'Go to Admin Login',
    actionLink: '/login',
    portalLink: '/dashboard/admin',
    portalText: 'Go to Admin Panel'
  },
  {
    id: 'teacher',
    icon: BookOpen,
    category: 'Teacher Portal',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    question: '👨‍🏫 How do Teachers / Instructors log in?',
    shortLabel: 'Teacher Login',
    answer: `**Faculty & Teacher Portal Access:**
1. Visit the **Login Page** (/login).
2. Use the instructor email and password assigned by your institution administrator.
3. Access your **Teacher Dashboard** (/dashboard/teacher).
4. In the portal, you can monitor batch attendance, evaluate student DSA code submissions, upload study materials, and post class announcements.`,
    actionText: 'Go to Teacher Login',
    actionLink: '/login',
    portalLink: '/dashboard/teacher',
    portalText: 'Open Teacher Portal'
  },
  {
    id: 'parent',
    icon: Users,
    category: 'Parent Portal',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    question: '👨‍👩‍👦 How do Parents log in & track student fees?',
    shortLabel: 'Parent Login',
    answer: `**Parent Portal & Student Progress:**
1. Go to the **Login Page** (/login).
2. Log in using the Parent credentials sent to your registered phone/email during admission.
3. Access the **Parent Portal** (/dashboard/parent).
4. View real-time attendance percentage, pending fee installment receipts, scheduled parent-teacher meetings, and academic reports.`,
    actionText: 'Go to Parent Login',
    actionLink: '/login',
    portalLink: '/dashboard/parent',
    portalText: 'Open Parent Portal'
  },
  {
    id: 'signup',
    icon: Sparkles,
    category: 'New Admission',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    question: '📝 How do I register for a New Course Admission?',
    shortLabel: 'New Admission',
    answer: `**New Student Enrollment Process:**
1. Visit our **Courses Page** (/programs) or click **Sign Up** on the login page.
2. Select your desired track: **Java Full Stack**, **MERN Developer**, or **Python Data Science**.
3. Fill in your basic details and complete the initial registration payment.
4. Your account is activated instantly with 24/7 LMS access and mentor support!`,
    actionText: 'View All Courses',
    actionLink: '/programs',
    portalLink: '/login',
    portalText: 'Sign Up Now'
  },
  {
    id: 'reset',
    icon: Key,
    category: 'Account Help',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    question: '🔑 I forgot my password or cannot log in. What should I do?',
    shortLabel: 'Forgot Password',
    answer: `**Login Assistance & Password Recovery:**
1. Make sure you are using the correct registered email address.
2. If you have not created an account yet, click **"Sign Up"** to create a student account.
3. For immediate password reset assistance, contact our technical helpdesk directly at **+91 98765 43210** or email **support@programmingwallah.com**.`,
    actionText: 'Contact Support Helpdesk',
    actionLink: '/contact',
    portalLink: null,
    portalText: null
  }
];

export default function RoleLoginChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 **Hello! Welcome to AppleTree Infotech Assistant.**\n\nI can help you navigate **Role-Based Logins** (Student, Admin, Teacher, Parent) and portal access. Click any question below to get started!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showQuestions: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSelectQuestion = (q) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: q.answer,
        actionText: q.actionText,
        actionLink: q.actionLink,
        portalText: q.portalText,
        portalLink: q.portalLink,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showQuestions: true // Crucial: Re-show predefined questions after each answer!
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 450);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim().toLowerCase();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      // Find closest matching predefined question
      let match = null;
      if (query.includes('student') || query.includes('learner') || query.includes('study') || query.includes('lms')) {
        match = PREDEFINED_QUESTIONS[0];
      } else if (query.includes('admin') || query.includes('master') || query.includes('manage') || query.includes('director')) {
        match = PREDEFINED_QUESTIONS[1];
      } else if (query.includes('teacher') || query.includes('faculty') || query.includes('instructor') || query.includes('sir')) {
        match = PREDEFINED_QUESTIONS[2];
      } else if (query.includes('parent') || query.includes('mother') || query.includes('father') || query.includes('guardian')) {
        match = PREDEFINED_QUESTIONS[3];
      } else if (query.includes('admission') || query.includes('register') || query.includes('sign up') || query.includes('signup') || query.includes('enroll') || query.includes('course')) {
        match = PREDEFINED_QUESTIONS[4];
      } else if (query.includes('password') || query.includes('forgot') || query.includes('reset') || query.includes('help') || query.includes('login') || query.includes('problem')) {
        match = PREDEFINED_QUESTIONS[5];
      }

      let botMsg;
      if (match) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: match.answer,
          actionText: match.actionText,
          actionLink: match.actionLink,
          portalText: match.portalText,
          portalLink: match.portalLink,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showQuestions: true
        };
      } else {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I'm here to assist with **Role-Based Logins** and portal access! Please select one of the common role login questions below, or visit our Help Center:`,
          actionText: 'Go to Login Page',
          actionLink: '/login',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showQuestions: true
        };
      }

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: "👋 **Hello! Welcome to AppleTree Infotech Assistant.**\n\nI can help you navigate **Role-Based Logins** (Student, Admin, Teacher, Parent) and portal access. Click any question below to get started!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showQuestions: true
      }
    ]);
  };

  const handleNavigate = (link) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      navigate(link);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ── 1. FLOATING CHATBOT TRIGGER BUTTON ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-[#1c1d21] hover:bg-black text-white px-4 py-3.5 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.3)] border border-amber-400/40 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            aria-label="Open Role Login Assistant"
          >
            {/* Animated glowing ping */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-slate-900" />
            </span>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <Bot className="w-4 h-4" />
            </div>

            <div className="text-left pr-1 hidden sm:block">
              <p className="text-[11px] font-black leading-tight text-white flex items-center gap-1">
                <span>Login Assistant</span>
                <span className="text-amber-400 text-[9px] font-bold uppercase tracking-wider bg-amber-400/10 px-1.5 py-0.2 rounded-full border border-amber-400/30">AI</span>
              </p>
              <p className="text-[9px] text-slate-400 font-medium">Role Login & Portal Help</p>
            </div>
          </button>
        )}
      </div>

      {/* ── 2. CHATBOT WINDOW MODAL ── */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] max-h-[85vh] h-[620px] bg-[#faf8f2] border border-white/90 shadow-[0_25px_60px_rgba(0,0,0,0.25)] rounded-[32px] overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-[#1c1d21] text-white p-4 sm:p-4.5 flex items-center justify-between border-b border-white/10 shadow-sm select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1c1d21] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white leading-tight">AppleTree Bot</h3>
                  <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider">
                    Role Helper
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Instant Q&A
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart Chat"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#faf8f2] via-[#fbf7eb] to-[#f7f3e6]">
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#1c1d21] text-white rounded-br-none border border-slate-800'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80'
                  }`}
                >
                  <div className="space-y-2 whitespace-pre-line font-medium">
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={idx} className="font-extrabold text-slate-900">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                          <p key={idx}>
                            {parts.map((p, i) => (i % 2 === 1 ? <strong key={i} className="text-slate-900 font-bold">{p}</strong> : p))}
                          </p>
                        );
                      }
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>

                  {/* 1-Click Action Buttons if available */}
                  {(msg.actionLink || msg.portalLink) && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                      {msg.actionLink && (
                        <button
                          onClick={() => handleNavigate(msg.actionLink)}
                          className="inline-flex items-center gap-1.5 bg-[#1c1d21] hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          <span>{msg.actionText || 'Continue'}</span>
                          <ArrowRight className="w-3 h-3 text-amber-400" />
                        </button>
                      )}
                      {msg.portalLink && (
                        <button
                          onClick={() => handleNavigate(msg.portalLink)}
                          className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          <span>{msg.portalText}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* ── CRUCIAL: Predefined Question Chips displayed after the Bot Answer ── */}
                {msg.sender === 'bot' && msg.showQuestions && (
                  <div className="w-full mt-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 pl-1">
                      <HelpCircle className="w-3 h-3 text-amber-500" />
                      <span>Select a Role / Question:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {PREDEFINED_QUESTIONS.map((q) => {
                        const IconComp = q.icon;
                        return (
                          <button
                            key={q.id}
                            onClick={() => handleSelectQuestion(q)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 text-left transition-all group shadow-xs cursor-pointer"
                          >
                            <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-amber-100 text-slate-700 group-hover:text-amber-800 flex items-center justify-center shrink-0">
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate">
                                {q.shortLabel}
                              </p>
                              <p className="text-[9px] text-slate-400 group-hover:text-slate-600 truncate">
                                {q.category}
                              </p>
                            </div>
                            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-amber-600 ml-auto shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs bg-white p-3 rounded-2xl w-fit border border-slate-200 shadow-xs">
                <Bot className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="font-bold text-[11px]">Assistant is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Footer Controls */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about student, admin, teacher login..."
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium outline-none focus:border-slate-800 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-2xl bg-[#1c1d21] hover:bg-black disabled:opacity-40 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0 shadow-sm"
              title="Send Message"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}