import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
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
  ExternalLink,
  CheckCircle2,
  Code2,
  Award,
  Wallet,
  Calendar,
  Layers,
  LogOut,
  CornerDownRight
} from 'lucide-react';

const ROLE_KNOWLEDGE_BASE = [
  {
    id: 'student',
    icon: GraduationCap,
    category: 'Student Portal',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    question: '🎓 How do I log in as a Student / Learner?',
    shortLabel: 'Student Portal',
    answer: `**Student / Learner Login & LMS Guide:**
1. Navigate to the **Login Page** (/login).
2. Enter your registered **Email Address** and **Password** set during admission.
3. You will be automatically routed to the **Student LMS Dashboard** (/dashboard/student).
4. From here you can access full video lectures, test algorithms in the in-browser compiler, take quizzes, and track course completion.`,
    actionText: 'Go to Student Login',
    actionLink: '/login',
    portalLink: '/dashboard/student',
    portalText: 'Open Student LMS',
    subQuestions: [
      {
        id: 'student-courses',
        label: '📚 How to access enrolled courses in LMS?',
        icon: BookOpen,
        answer: `**Accessing Enrolled LMS Courses:**
- Once logged in, open your **Student Dashboard** (/dashboard/student).
- Go to the **"My Enrolled Courses"** tab to view your active tracks (Java Full Stack, MERN, Python).
- Click on any course to resume video lessons, view course roadmaps, and download lecture notes.`,
        actionText: 'Open LMS Dashboard',
        actionLink: '/dashboard/student'
      },
      {
        id: 'student-compiler',
        label: '💻 How to practice Java & DSA in the Compiler?',
        icon: Code2,
        answer: `**DSA Practice & In-Browser Compiler:**
- Head over to the **Practice Hub** (/practice).
- Select from the **1000 DSA Challenge Bank** across arrays, trees, dynamic programming, and OOP.
- Write your code directly inside the JDoodle online compiler and click **"Get AI Suggestions"** for automated feedback.`,
        actionText: 'Open Practice Hub',
        actionLink: '/practice'
      },
      {
        id: 'student-cert',
        label: '📜 How to download & verify my Certificate?',
        icon: Award,
        answer: `**Certificate Generation & Verification:**
- Upon completing 100% of your course assignments, your completion certificate is issued by AppleTree Infotech.
- You can download your official PDF directly from the Student Dashboard.
- Anyone can verify its authenticity on the **Verification Page** (/verify-certificate) by entering the certificate number.`,
        actionText: 'Verify a Certificate',
        actionLink: '/verify-certificate'
      },
      {
        id: 'student-rank',
        label: '🏆 How do Quiz Scores & Leaderboards work?',
        icon: Sparkles,
        answer: `**Leaderboard & Streak Points:**
- Take the weekly Java & DSA mini quizzes in the **Practice Hub** (/practice).
- Correct answers increase your points and rank label (*Novice → Specialist → Grandmaster*).
- Top 3 leaderboard candidates receive direct interview opportunities with hiring partners!`,
        actionText: 'Take Weekly Quiz',
        actionLink: '/practice'
      }
    ]
  },
  {
    id: 'admin',
    icon: ShieldCheck,
    category: 'Admin Portal',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    question: '🛡️ How do Admins log in & manage operations?',
    shortLabel: 'Admin Portal',
    answer: `**Master Admin Panel Access:**
1. Visit the **Login Page** (/login).
2. Enter your verified **Admin Administrator credentials**.
3. You will land on the **Admin Dashboard** (/dashboard/admin).
4. Admins have complete control over new admission approvals, course creation, faculty management, pending student dues, WhatsApp alerts, and certificate issuance.`,
    actionText: 'Go to Admin Login',
    actionLink: '/login',
    portalLink: '/dashboard/admin',
    portalText: 'Admin Dashboard',
    subQuestions: [
      {
        id: 'admin-admissions',
        label: '📝 How to review & approve new admissions?',
        icon: Users,
        answer: `**Reviewing Admissions Applications:**
- Open **Admin Dashboard → Admissions & Reviews** tab.
- Filter applications by *Pending*, *Approved*, or *Rejected*.
- Review submitted candidate details, set an initial parent/student password, and click **Approve** to generate LMS access credentials.`,
        actionText: 'Admissions Desk',
        actionLink: '/dashboard/admin'
      },
      {
        id: 'admin-fees',
        label: '💳 How to manage student fee invoices & WhatsApp alerts?',
        icon: Wallet,
        answer: `**Student Fee Billing & Due Alerts:**
- Open **Admin Dashboard → Fees & Finance** tab.
- Click **"Create Student Fee Invoice"** to auto-assign monthly installment breakdowns by course.
- Use the **"Send WhatsApp Reminder"** button next to any pending student record to send payment links with 1-click.`,
        actionText: 'Fee Ledger',
        actionLink: '/dashboard/admin'
      },
      {
        id: 'admin-certs',
        label: '🎓 How to issue verified digital certificates?',
        icon: Award,
        answer: `**Issuing Official Certificates:**
- Go to the **Certificate Generator** tab in Admin Dashboard.
- Select from the dropdown of enrolled students to auto-fill their course and duration.
- Enter/generate the certificate serial number (e.g. *ATI-06-02-ST1002*) and issue a verified digital certificate.`,
        actionText: 'Certificate Desk',
        actionLink: '/dashboard/admin'
      }
    ]
  },
  {
    id: 'teacher',
    icon: BookOpen,
    category: 'Teacher Portal',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    question: '👨‍🏫 How do Teachers / Faculty log in?',
    shortLabel: 'Teacher Portal',
    answer: `**Teacher & Faculty Portal Access:**
1. Visit the **Login Page** (/login).
2. Enter the instructor credentials assigned by the administrator.
3. Access your **Teacher Dashboard** (/dashboard/teacher).
4. Instructors can mark daily batch attendance, review student code submissions, upload study materials, and post class announcements.`,
    actionText: 'Go to Teacher Login',
    actionLink: '/login',
    portalLink: '/dashboard/teacher',
    portalText: 'Teacher Dashboard',
    subQuestions: [
      {
        id: 'teacher-attendance',
        label: '📅 How to mark batch attendance?',
        icon: Calendar,
        answer: `**Marking Batch Attendance:**
- In the **Teacher Dashboard**, select your active batch (e.g. *Java Enterprise Morning*).
- Mark students as *Present*, *Absent*, or *Late* with 1-click and save the record.`,
        actionText: 'Teacher Portal',
        actionLink: '/dashboard/teacher'
      },
      {
        id: 'teacher-materials',
        label: '📂 How to upload study materials & slides?',
        icon: Layers,
        answer: `**Uploading Study Materials:**
- Open **Teacher Dashboard → Materials** tab.
- Attach PDF slides, problem sheets, or GitHub repo links for your batch students.`,
        actionText: 'Teacher Portal',
        actionLink: '/dashboard/teacher'
      }
    ]
  },
  {
    id: 'parent',
    icon: Users,
    category: 'Parent Portal',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    question: '👨‍👩‍👦 How do Parents log in & view child progress?',
    shortLabel: 'Parent Portal',
    answer: `**Parent Portal & Fee Tracking:**
1. Visit the **Login Page** (/login).
2. Log in using the Parent credentials sent via SMS/Email during admission.
3. Access the **Parent Portal** (/dashboard/parent).
4. Parents can view real-time attendance percentage, pending fee installment receipts, upcoming deadlines, and schedule parent-teacher meetings.`,
    actionText: 'Go to Parent Login',
    actionLink: '/login',
    portalLink: '/dashboard/parent',
    portalText: 'Parent Portal',
    subQuestions: [
      {
        id: 'parent-dues',
        label: '💳 How to check & pay pending installment fees?',
        icon: Wallet,
        answer: `**Fee Receipts & Installment Payments:**
- Inside the **Parent Portal**, view the **Fees Ledger**.
- See total course fee, amount paid, and upcoming installment due dates.
- Click **"Pay Online"** to settle payments securely via Razorpay (UPI, Card, Netbanking).`,
        actionText: 'Parent Portal',
        actionLink: '/dashboard/parent'
      },
      {
        id: 'parent-attendance',
        label: '📈 How to track attendance percentage & leaves?',
        icon: Calendar,
        answer: `**Tracking Student Attendance:**
- Check the **Attendance Progress Gauge** in the Parent Portal.
- View monthly attendance graphs and reason notes for any flagged absences.`,
        actionText: 'Parent Portal',
        actionLink: '/dashboard/parent'
      }
    ]
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
    portalText: 'Sign Up Now',
    subQuestions: [
      {
        id: 'admission-courses',
        label: '💡 What courses are currently open for admission?',
        icon: BookOpen,
        answer: `**Current Open Cohorts:**
- **Java Full Stack Developer** (Core Java, Spring Boot, Microservices, React, SQL)
- **MERN Stack Developer** (MongoDB, Express, React, Node.js, Next.js)
- **Python Developer & Data Science** (Python, Django, Pandas, ML algorithms)
- **Frontend Specialization** (HTML5, Tailwind CSS, JavaScript, React)`,
        actionText: 'Explore Course Details',
        actionLink: '/programs'
      },
      {
        id: 'admission-installments',
        label: '💵 Are monthly installment payment plans available?',
        icon: Wallet,
        answer: `**Flexible Payment Options:**
- Yes! You can pay in full or choose a **1-Month, 2-Month, or 3-Month installment plan**.
- Installment payments are tracked transparently in the student & parent dashboards.`,
        actionText: 'View Fee Structure',
        actionLink: '/fees'
      }
    ]
  },
  {
    id: 'reset',
    icon: Key,
    category: 'Account Help',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    question: '🔑 I forgot my password or cannot log in. What should I do?',
    shortLabel: 'Login Help',
    answer: `**Login Assistance & Password Recovery:**
1. Make sure you are using the correct registered email address.
2. If you don't have an account yet, click **"Sign Up"** to create a student account.
3. For immediate password reset assistance, contact our technical helpdesk directly at **+91 98765 43210** or email **support@programmingwallah.com**.`,
    actionText: 'Contact Support Helpdesk',
    actionLink: '/contact',
    subQuestions: [
      {
        id: 'help-contact',
        label: '📞 How to speak to an admissions advisor?',
        icon: Users,
        answer: `**Advisor Hotline:**
- Call us directly at **+91 98765 43210** (Mon - Sat: 9:00 AM to 7:00 PM).
- Or submit a callback request on our **Contact Page** (/contact).`,
        actionText: 'Contact Us',
        actionLink: '/contact'
      }
    ]
  }
];

export default function RoleLoginChatbot() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentActiveRole, setCurrentActiveRole] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const getGreetingMessage = () => {
    if (user) {
      const userRoleName = user.role ? user.role.toUpperCase() : 'STUDENT';
      return {
        id: 'welcome-user',
        sender: 'bot',
        text: `👋 **Welcome back, ${user.name || 'User'}!**\n\nYou are currently signed in as **${userRoleName}** (${user.email}).\n\nI can help you navigate your dashboard, answer role questions, or guide you through learning & management tools. Choose an option below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userDetected: true,
        showMainQuestions: true
      };
    }
    return {
      id: 'welcome-guest',
      sender: 'bot',
      text: "👋 **Hello! Welcome to AppleTree Infotech Assistant.**\n\nI automatically detect roles and guide you through **Role-Based Logins** (Student, Admin, Teacher, Parent) and portal tools. Select a role below to get started!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userDetected: false,
      showMainQuestions: true
    };
  };

  useEffect(() => {
    setMessages([getGreetingMessage()]);
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Handle clicking a Main Role Topic
  const handleSelectRole = (roleObj) => {
    setCurrentActiveRole(roleObj);
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: roleObj.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: roleObj.answer,
        actionText: roleObj.actionText,
        actionLink: roleObj.actionLink,
        portalText: roleObj.portalText,
        portalLink: roleObj.portalLink,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        roleContext: roleObj,
        subQuestions: roleObj.subQuestions || [],
        showSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  // Handle clicking a Sub-Question
  const handleSelectSubQuestion = (subQ, parentRole) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: subQ.label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: subQ.answer,
        actionText: subQ.actionText,
        actionLink: subQ.actionLink,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        roleContext: parentRole,
        subQuestions: parentRole?.subQuestions || [],
        showSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  // Return to All Roles View
  const handleBackToAllRoles = () => {
    setCurrentActiveRole(null);
    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Select any role category below to explore login guides and sub-questions:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showMainQuestions: true
    };
    setMessages(prev => [...prev, botMsg]);
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
      // Find matching role knowledge
      let matchRole = null;
      let matchSubQ = null;

      if (query.includes('compiler') || query.includes('practice') || query.includes('dsa') || query.includes('code')) {
        matchRole = ROLE_KNOWLEDGE_BASE[0];
        matchSubQ = matchRole.subQuestions?.find(sq => sq.id === 'student-compiler');
      } else if (query.includes('cert') || query.includes('verify')) {
        matchRole = ROLE_KNOWLEDGE_BASE[0];
        matchSubQ = matchRole.subQuestions?.find(sq => sq.id === 'student-cert');
      } else if (query.includes('student') || query.includes('learner') || query.includes('lms')) {
        matchRole = ROLE_KNOWLEDGE_BASE[0];
      } else if (query.includes('admin') || query.includes('manage') || query.includes('approve')) {
        matchRole = ROLE_KNOWLEDGE_BASE[1];
      } else if (query.includes('teacher') || query.includes('faculty') || query.includes('instructor')) {
        matchRole = ROLE_KNOWLEDGE_BASE[2];
      } else if (query.includes('parent') || query.includes('child') || query.includes('guardian')) {
        matchRole = ROLE_KNOWLEDGE_BASE[3];
      } else if (query.includes('fee') || query.includes('installment') || query.includes('due') || query.includes('pay')) {
        matchRole = ROLE_KNOWLEDGE_BASE[1];
        matchSubQ = matchRole.subQuestions?.find(sq => sq.id === 'admin-fees');
      } else if (query.includes('admission') || query.includes('register') || query.includes('enroll')) {
        matchRole = ROLE_KNOWLEDGE_BASE[4];
      } else if (query.includes('password') || query.includes('reset') || query.includes('forgot') || query.includes('help')) {
        matchRole = ROLE_KNOWLEDGE_BASE[5];
      }

      let botMsg;
      if (matchSubQ && matchRole) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: matchSubQ.answer,
          actionText: matchSubQ.actionText,
          actionLink: matchSubQ.actionLink,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleContext: matchRole,
          subQuestions: matchRole.subQuestions || [],
          showSubQuestions: true
        };
      } else if (matchRole) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: matchRole.answer,
          actionText: matchRole.actionText,
          actionLink: matchRole.actionLink,
          portalText: matchRole.portalText,
          portalLink: matchRole.portalLink,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleContext: matchRole,
          subQuestions: matchRole.subQuestions || [],
          showSubQuestions: true
        };
      } else {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I'm ready to assist with **Role-Based Logins** & portal tools! Please select a category or sub-question below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showMainQuestions: true
        };
      }

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 450);
  };

  const handleResetChat = () => {
    setCurrentActiveRole(null);
    setMessages([getGreetingMessage()]);
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
            className="group relative flex items-center gap-2.5 bg-[#1c1d21] hover:bg-black text-white px-4 py-3.5 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.35)] border border-amber-400/50 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            aria-label="Open Role Login Assistant"
          >
            {/* Live Indicator Ping */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${user ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-slate-900 ${user ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <Bot className="w-4 h-4" />
            </div>

            <div className="text-left pr-1 hidden sm:block">
              <p className="text-[11px] font-black leading-tight text-white flex items-center gap-1">
                <span>{user ? user.name?.split(' ')[0] : 'Role Assistant'}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${
                  user ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' : 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                }`}>
                  {user ? (user.role || 'User') : 'AI'}
                </span>
              </p>
              <p className="text-[9px] text-slate-400 font-medium truncate max-w-[130px]">
                {user ? `Logged In • Auto-Detect` : 'Role Login & Portal Q&A'}
              </p>
            </div>
          </button>
        )}
      </div>

      {/* ── 2. CHATBOT WINDOW MODAL ── */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[85vh] h-[640px] bg-[#faf8f2] border border-white/90 shadow-[0_25px_60px_rgba(0,0,0,0.3)] rounded-[32px] overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-[#1c1d21] text-white p-4 flex items-center justify-between border-b border-white/10 shadow-sm select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#1c1d21] rounded-full ${user ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white leading-tight">AppleTree Bot</h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    user ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                  }`}>
                    {user ? `${user.role?.toUpperCase() || 'USER'}` : 'ROLE HELPER'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-semibold flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {user ? `Active User: ${user.name}` : 'Online • Role & Sub-Questions Q&A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart Conversation"
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

          {/* User Status Bar if Logged In */}
          {user && (
            <div className="bg-gradient-to-r from-emerald-950 to-[#1c1d21] text-emerald-200 px-4 py-2 border-b border-emerald-500/20 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Detected: <strong className="text-white">{user.name}</strong> ({user.role})</span>
              </div>
              <button
                onClick={() => {
                  if (user.role === 'admin') handleNavigate('/dashboard/admin');
                  else if (user.role === 'teacher') handleNavigate('/dashboard/teacher');
                  else if (user.role === 'parent') handleNavigate('/dashboard/parent');
                  else handleNavigate('/dashboard/student');
                }}
                className="text-[10px] font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider underline cursor-pointer shrink-0 ml-2"
              >
                My Portal →
              </button>
            </div>
          )}

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

                {/* ── SUB-QUESTIONS ACCORDION (If Available) ── */}
                {msg.sender === 'bot' && msg.showSubQuestions && msg.subQuestions?.length > 0 && (
                  <div className="w-full mt-3 space-y-2">
                    <div className="flex items-center justify-between pl-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3 text-amber-600" />
                        <span>Related Sub-Questions ({msg.roleContext?.shortLabel}):</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {msg.subQuestions.map((subQ) => {
                        const SubIcon = subQ.icon || ChevronRight;
                        return (
                          <button
                            key={subQ.id}
                            onClick={() => handleSelectSubQuestion(subQ, msg.roleContext)}
                            className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 text-left transition-all group shadow-2xs cursor-pointer"
                          >
                            <div className="w-5 h-5 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
                              <SubIcon className="w-3 h-3" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-950 flex-1 leading-tight">
                              {subQ.label}
                            </span>
                            <ChevronRight className="w-3 h-3 text-amber-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Back to All Roles Button */}
                    <button
                      onClick={handleBackToAllRoles}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      <span>↩️ View All Role Categories</span>
                    </button>
                  </div>
                )}

                {/* ── MAIN ROLE CATEGORIES ── */}
                {msg.sender === 'bot' && msg.showMainQuestions && (
                  <div className="w-full mt-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 pl-1">
                      <HelpCircle className="w-3 h-3 text-amber-500" />
                      <span>Select a Role Category:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {ROLE_KNOWLEDGE_BASE.map((q) => {
                        const IconComp = q.icon;
                        const isMyRole = user && (user.role === q.id || (user.role === 'user' && q.id === 'student'));
                        return (
                          <button
                            key={q.id}
                            onClick={() => handleSelectRole(q)}
                            className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all group shadow-xs cursor-pointer border ${
                              isMyRole 
                                ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-400/40' 
                                : 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-300'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              isMyRole ? 'bg-emerald-200 text-emerald-900 font-bold' : 'bg-slate-100 group-hover:bg-amber-100 text-slate-700 group-hover:text-amber-800'
                            }`}>
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate flex items-center gap-1">
                                <span>{q.shortLabel}</span>
                                {isMyRole && (
                                  <span className="text-[8px] bg-emerald-600 text-white px-1 py-0.2 rounded-sm font-extrabold">YOU</span>
                                )}
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
                <span className="font-bold text-[11px]">Assistant is preparing response...</span>
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
              placeholder="Ask about LMS, compiler, fees, permissions..."
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