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
  CornerDownRight,
  Printer,
  CreditCard,
  ShoppingBag,
  Percent,
  Check,
  Search,
  FileText
} from 'lucide-react';

// Standard course catalogue
const AVAILABLE_COURSES = [
  {
    id: 'java-fullstack',
    title: 'Java Full Stack Developer Masterclass',
    price: 12000,
    monthlyInstallment: 4000,
    duration: '3 Months (Live + Lab)',
    highlights: ['Core Java & OOPs', 'Spring Boot & Microservices', 'React.js & Tailwind CSS', 'SQL & Docker Deployment'],
    badge: 'Bestseller'
  },
  {
    id: 'mern-stack',
    title: 'MERN Stack Web Dev Pro',
    price: 10000,
    monthlyInstallment: 3333,
    duration: '3 Months (Hands-on)',
    highlights: ['MongoDB & Mongoose', 'Express.js REST APIs', 'React 18 & Next.js', 'Node.js Backend & JWT Auth'],
    badge: 'Popular'
  },
  {
    id: 'python-datascience',
    title: 'Python & AI / Data Science Specialist',
    price: 11000,
    monthlyInstallment: 3666,
    duration: '3 Months (Projects)',
    highlights: ['Python 3 & Pandas', 'NumPy & Data Visualization', 'Machine Learning Models', 'FastAPI & AI Integration'],
    badge: 'Hot Career'
  },
  {
    id: 'frontend-spec',
    title: 'Frontend & UI/UX Specialist',
    price: 7500,
    monthlyInstallment: 3750,
    duration: '2 Months (Fast Track)',
    highlights: ['HTML5 & Modern CSS3', 'Tailwind CSS & Animations', 'JavaScript ES6+ & TypeScript', 'React UI Components'],
    badge: 'Quick Launch'
  }
];

// Special combo courses
const COMBO_COURSES = [
  {
    id: 'fullstack-combo',
    title: '🚀 Full Stack Super Combo (Java + MERN + 1000 DSA)',
    price: 18000,
    originalPrice: 22000,
    discount: '35% OFF',
    duration: '5 Months (Comprehensive)',
    description: 'Master both Enterprise Java (Spring Boot) and modern MERN Web Development, with full DSA preparation for top tech product companies.',
    badge: 'Best Value'
  },
  {
    id: 'ai-fullstack-bundle',
    title: '🤖 AI + Full Stack Career Bundle (Python AI + React + Java)',
    price: 21000,
    originalPrice: 27000,
    discount: '40% OFF',
    duration: '6 Months (Complete Master)',
    description: 'Combines full stack web development with Python GenAI, Machine Learning, and Cloud deployments for high-paying AI Engineer roles.',
    badge: 'Ultimate Bundle'
  },
  {
    id: 'placement-guaranteed',
    title: '💼 100% Placement Track (All Courses + 1-on-1 Mock Interviews)',
    price: 24999,
    originalPrice: 35000,
    discount: 'Direct Referral',
    duration: '6 Months + Placement',
    description: 'All courses included with dedicated mentor guidance, resume ATS optimization, mock interviews, and guaranteed corporate interviews.',
    badge: 'Job Guarantee'
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

  // Initial personalized greeting based on login state
  const getGreetingMessage = () => {
    if (user) {
      const userRole = user.role ? user.role.toUpperCase() : 'STUDENT';
      if (user.role === 'admin') {
        return {
          id: 'welcome-admin',
          sender: 'bot',
          text: `🛡️ **Welcome Administrator ${user.name}!**\n\nYou are logged in with **Admin privileges** (${user.email}).\n\nI can help you check any student's submitted vs remaining fees, issue fee receipts, review pending admissions, and manage courses. Select an action below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userDetected: true,
          mode: 'admin'
        };
      } else if (user.role === 'teacher') {
        return {
          id: 'welcome-teacher',
          sender: 'bot',
          text: `👨‍🏫 **Welcome Faculty Member ${user.name}!**\n\nYou are signed in as **Teacher / Instructor** (${user.email}).\n\nI can help you track batch attendance, grade student DSA submissions, and post course materials. Choose an option below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userDetected: true,
          mode: 'teacher'
        };
      } else if (user.role === 'parent') {
        return {
          id: 'welcome-parent',
          sender: 'bot',
          text: `👨‍👩‍👦 **Welcome ${user.name}!**\n\nYou are logged in as **Parent** (${user.email}).\n\nView your child's attendance progress, check remaining fee installments, download receipts, or schedule teacher meetings below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userDetected: true,
          mode: 'parent'
        };
      } else {
        // Student / User
        return {
          id: 'welcome-student',
          sender: 'bot',
          text: `👋 **Welcome back, ${user.name}!**\n\nYou are logged in as **Student** (${user.email}).\n\nI can give you your **Fee Receipt**, calculate your **Remaining Fees & Monthly Installments**, or guide you through your enrolled courses. Click any question below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userDetected: true,
          mode: 'student'
        };
      }
    }

    // Guest / One-Time Viewer
    return {
      id: 'welcome-guest',
      sender: 'bot',
      text: `👋 **Hello! Welcome to AppleTree Infotech.**\n\nI can help you explore **Courses & Live Prices**, learn **How to Buy Courses**, check **Combo Discount Bundles**, or access **Role-Based Logins** (Student, Admin, Teacher, Parent). Click any option below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userDetected: false,
      mode: 'guest'
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

  // ── 1. GUEST ACTIONS: Course Prices, How to Buy, Combos ──
  const handleShowHowToBuy = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '🛒 How do I buy a course & get instant access?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**How to Buy Courses at AppleTree Infotech:**\n\n1. **Select Your Track**: Browse our courses (Java, MERN, Python, Frontend, or Combo).\n2. **Choose Payment Option**: Pay in full or select easy **Monthly Installments (₹3,333/month)**.\n3. **Instant LMS Activation**: Complete checkout via UPI, Google Pay, Card, or Netbanking. Your Student LMS account is activated in under 60 seconds!\n4. **Includes**: 24/7 in-browser compiler, live mentor sessions, interview prep, and verified ISO certificate.`,
        actionText: 'Browse Courses & Buy Now',
        actionLink: '/programs',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showGuestSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  const handleShowAllCourses = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '📚 Show all present courses and prices',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Current Available Courses & Live Fees:**\n\n` + 
          AVAILABLE_COURSES.map(c => `• **${c.title}** (${c.duration})\n  💰 **₹${c.price.toLocaleString('en-IN')}** total (or ₹${c.monthlyInstallment.toLocaleString('en-IN')}/month)\n  ⚡ *Highlights*: ${c.highlights.join(' • ')}`).join('\n\n'),
        actionText: 'Enroll in a Course',
        actionLink: '/programs',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showGuestSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  const handleShowComboCourses = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '🎁 Show combo courses and discount bundles',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Special Combo Courses & Discount Bundles:**\n\n` +
          COMBO_COURSES.map(c => `⭐ **${c.title}**\n  💰 **Offer Price: ₹${c.price.toLocaleString('en-IN')}** ~~(Regular: ₹${c.originalPrice.toLocaleString('en-IN')} - ${c.discount})~~\n  ⏱️ Duration: ${c.duration}\n  📝 ${c.description}`).join('\n\n'),
        actionText: 'Claim Combo Offer',
        actionLink: '/programs',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showGuestSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  // ── 2. STUDENT ACTIONS: Fee Receipts, Remaining Fees, Monthly Payments ──
  const handleStudentFeeReceipt = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '🧾 Generate / Download my Fee Receipt',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Official Digital Fee Receipt Generated:**\n\nHere is your verified fee invoice receipt for your enrolled program:`,
        isReceipt: true,
        receiptData: {
          receiptNo: `REC-2024-${Math.floor(1000 + Math.random() * 9000)}`,
          studentName: user?.name || 'Enrolled Student',
          email: user?.email || 'student@programmingwallah.com',
          course: 'Java & React Full Stack Developer',
          totalFee: 12000,
          paidAmount: 8000,
          remainingAmount: 4000,
          status: 'PARTIAL',
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showStudentSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const handleStudentRemainingFees = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '💳 How much fees is remaining / submitted for my course?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Your Fee Account Status (${user?.name || 'Student'}):**\n\n• **Enrolled Track**: Java Full Stack Developer\n• **Total Course Price**: ₹12,000\n• ✅ **Fees Submitted (Paid)**: ₹8,000 (Installments 1 & 2)\n• ⏳ **Remaining Fees Due**: **₹4,000**\n• 📅 **Next Installment Due Date**: 15th of next month\n\nYou can settle your remaining installment online via UPI or card.`,
        actionText: 'Pay Remaining Fee',
        actionLink: '/dashboard/student',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showStudentSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  const handleStudentMonthlyPlan = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '📅 How do monthly installment payments work?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Monthly Installment Breakdown:**\n\n• **Month 1 (Admission)**: ₹4,000 *(Paid at enrollment)*\n• **Month 2 (Mid-Term)**: ₹4,000 *(Paid on Day 30)*\n• **Month 3 (Final Phase)**: ₹4,000 *(Paid on Day 60)*\n\n*Note: Zero interest or hidden charges. Official GST tax invoice issued upon every installment payment.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showStudentSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  // ── 3. ADMIN ACTIONS: Student Fee Inquiries (Submitted vs Remaining) ──
  const handleAdminStudentFeeStatus = (studentName, course, total, paid, remaining, status) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `💰 Check fee details for ${studentName}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Student Financial Audit: ${studentName}**\n\n• **Course Program**: ${course}\n• **Total Course Fee**: ₹${total.toLocaleString('en-IN')}\n• ✅ **Fees Submitted (Paid)**: **₹${paid.toLocaleString('en-IN')}**\n• ⏳ **Remaining Fees Due**: **₹${remaining.toLocaleString('en-IN')}**\n• **Status**: ${status}\n• **Due Date**: Due in 3 days\n\nAdmin can send a 1-click WhatsApp reminder or issue an official receipt below:`,
        isReceipt: true,
        receiptData: {
          receiptNo: `ATI-ADMIN-${Math.floor(1000 + Math.random() * 9000)}`,
          studentName: studentName,
          email: `${studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          course: course,
          totalFee: total,
          paidAmount: paid,
          remainingAmount: remaining,
          status: status,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        },
        actionText: 'Open Fee Billing Desk',
        actionLink: '/dashboard/admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showAdminSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const handleAdminOverallFeeSummary = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '📊 Show overall Academy Fee Collection Summary',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Academy Financial Overview (Ghaziabad Campus):**\n\n• **Total Invoiced**: ₹4,85,000\n• 🟢 **Total Collected (Paid)**: ₹3,92,000 (81% Collection Rate)\n• 🔴 **Total Outstanding Dues**: ₹93,000 (Across 7 active batches)\n• **Next Billing Cycle**: 1st of next month`,
        actionText: 'View Admin Invoices Ledger',
        actionLink: '/dashboard/admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showAdminSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  // Text message submission handler
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
      let botMsg;

      if (query.includes('receipt') || query.includes('invoice') || query.includes('bill')) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `**Digital Fee Invoice & Receipt Generated:**`,
          isReceipt: true,
          receiptData: {
            receiptNo: `REC-2024-${Math.floor(1000 + Math.random() * 9000)}`,
            studentName: user?.name || 'Ishika Rani',
            email: user?.email || 'student@programmingwallah.com',
            course: 'Java & React Full Stack Developer',
            totalFee: 12000,
            paidAmount: 8000,
            remainingAmount: 4000,
            status: 'PARTIAL',
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showStudentSubQuestions: true
        };
      } else if (query.includes('remaining') || query.includes('due') || query.includes('submitted') || query.includes('pending fee')) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `**Student Fee Status Report:**\n\n• **Course**: Java & React Full Stack\n• **Total Course Fee**: ₹12,000\n• ✅ **Fees Submitted (Paid)**: ₹8,000\n• ⏳ **Remaining Fees Due**: **₹4,000**\n• **Status**: Active Installment (Due on 15th)`,
          actionText: 'View Fees in Portal',
          actionLink: user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/student',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showStudentSubQuestions: true
        };
      } else if (query.includes('combo') || query.includes('bundle') || query.includes('discount')) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `**Special Combo Courses & Discount Bundles:**\n\n` +
            COMBO_COURSES.map(c => `⭐ **${c.title}**\n  💰 **₹${c.price.toLocaleString('en-IN')}** ~~(Regular: ₹${c.originalPrice.toLocaleString('en-IN')} - ${c.discount})~~\n  ⏱️ Duration: ${c.duration}\n  📝 ${c.description}`).join('\n\n'),
          actionText: 'Claim Combo Offer',
          actionLink: '/programs',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showGuestSubQuestions: true
        };
      } else if (query.includes('price') || query.includes('course') || query.includes('cost') || query.includes('fee')) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `**Available Courses & Live Fee Pricing:**\n\n` + 
            AVAILABLE_COURSES.map(c => `• **${c.title}** (${c.duration})\n  💰 **₹${c.price.toLocaleString('en-IN')}** total (or ₹${c.monthlyInstallment.toLocaleString('en-IN')}/month)`).join('\n\n'),
          actionText: 'Explore Course Details',
          actionLink: '/programs',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showGuestSubQuestions: true
        };
      } else if (query.includes('buy') || query.includes('how to buy') || query.includes('enroll') || query.includes('admission')) {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `**How to Buy & Enroll Online:**\n\n1. Go to **Courses Page** (/programs).\n2. Select your course or Combo Bundle.\n3. Choose 1-time payment or 3-Month Installments.\n4. Complete payment via UPI/Card for **Instant LMS Activation**!`,
          actionText: 'Enroll Now',
          actionLink: '/programs',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showGuestSubQuestions: true
        };
      } else {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I'm here to assist with **Course Prices**, **How to Buy**, **Combo Offers**, **Student Fee Receipts**, and **Remaining Fees**. Please pick an option below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showGuestSubQuestions: !user,
          showStudentSubQuestions: user && user.role !== 'admin',
          showAdminSubQuestions: user && user.role === 'admin'
        };
      }

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const handleResetChat = () => {
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

  const handlePrintReceipt = (receipt) => {
    window.print();
  };

  return (
    <>
      {/* ── 1. FLOATING TRIGGER BUTTON ── */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-[#1c1d21] hover:bg-black text-white px-4 py-3.5 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.35)] border border-amber-400/50 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            aria-label="Open Course & Fee Assistant"
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
                <span>{user ? user.name?.split(' ')[0] : 'Courses & Fees Bot'}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${
                  user ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' : 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                }`}>
                  {user ? (user.role || 'User') : 'AI'}
                </span>
              </p>
              <p className="text-[9px] text-slate-400 font-medium truncate max-w-[140px]">
                {user ? `${user.role?.toUpperCase()} • Fees & Receipts` : 'Buy Courses • Prices & Combos'}
              </p>
            </div>
          </button>
        )}
      </div>

      {/* ── 2. CHATBOT WINDOW MODAL ── */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[430px] max-h-[85vh] h-[650px] bg-[#faf8f2] border border-white/90 shadow-[0_25px_60px_rgba(0,0,0,0.3)] rounded-[32px] overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          
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
                  <h3 className="font-extrabold text-sm text-white leading-tight">AppleTree Assistant</h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    user ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                  }`}>
                    {user ? `${user.role?.toUpperCase() || 'USER'}` : 'COURSES & FEES'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-semibold flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {user ? `Signed in: ${user.name}` : 'Ghaziabad Hub • Instant Q&A & Receipts'}
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
                Open Portal →
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
                  className={`max-w-[92%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
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

                  {/* ── DIGITAL FEE RECEIPT CARD (If generated) ── */}
                  {msg.isReceipt && msg.receiptData && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-slate-900 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                        <div>
                          <p className="font-black text-xs text-[#5B468C] tracking-tight">AppleTree Infotech Pvt. Ltd.</p>
                          <p className="text-[9px] text-slate-500">Ghaziabad Hub • Official Fee Receipt</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-black border border-emerald-200">
                          {msg.receiptData.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-slate-400 block font-bold">RECEIPT NO:</span>
                          <span className="font-mono font-bold text-slate-800">{msg.receiptData.receiptNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">DATE:</span>
                          <span className="font-bold text-slate-800">{msg.receiptData.date}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block font-bold">STUDENT:</span>
                          <span className="font-bold text-slate-900 text-xs">{msg.receiptData.studentName}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block font-bold">PROGRAM:</span>
                          <span className="font-semibold text-slate-800">{msg.receiptData.course}</span>
                        </div>
                      </div>

                      <div className="border-t border-amber-200/80 pt-2 space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-600">
                          <span>Total Course Fee:</span>
                          <span className="font-bold">₹{msg.receiptData.totalFee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Fees Submitted (Paid):</span>
                          <span>₹{msg.receiptData.paidAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-rose-600 font-black border-t border-dashed border-amber-300 pt-1">
                          <span>Remaining Balance Due:</span>
                          <span>₹{msg.receiptData.remainingAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => window.print()}
                          className="flex-1 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <Printer className="w-3 h-3 text-slate-600" />
                          <span>Print / PDF</span>
                        </button>
                        {msg.receiptData.remainingAmount > 0 && (
                          <button
                            onClick={() => handleNavigate(user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/student')}
                            className="flex-1 py-1.5 rounded-xl bg-[#1c1d21] hover:bg-black text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <CreditCard className="w-3 h-3 text-amber-400" />
                            <span>Pay Balance</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 1-Click Action Button */}
                  {msg.actionLink && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleNavigate(msg.actionLink)}
                        className="inline-flex items-center gap-1.5 bg-[#1c1d21] hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
                      >
                        <span>{msg.actionText || 'Continue'}</span>
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </button>
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* ── 1. GUEST / FIRST-TIME VIEWER QUESTION CHIPS ── */}
                {msg.sender === 'bot' && (msg.mode === 'guest' || msg.showGuestSubQuestions) && (
                  <div className="w-full mt-3 space-y-2">
                    <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 pl-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Explore Courses & Enrollment:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <button
                        onClick={handleShowHowToBuy}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 text-left transition-all group shadow-xs cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate">How to Buy Courses</p>
                          <p className="text-[9px] text-slate-400 group-hover:text-slate-600 truncate">Enrollment & Activation</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-amber-600 ml-auto shrink-0" />
                      </button>

                      <button
                        onClick={handleShowAllCourses}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 text-left transition-all group shadow-xs cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate">All Present Courses</p>
                          <p className="text-[9px] text-slate-400 group-hover:text-slate-600 truncate">Live Prices & Monthly EMI</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-amber-600 ml-auto shrink-0" />
                      </button>

                      <button
                        onClick={handleShowComboCourses}
                        className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/90 hover:bg-amber-100/90 border border-amber-200 text-left transition-all group shadow-xs cursor-pointer sm:col-span-2"
                      >
                        <div className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                          <Percent className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-amber-950 truncate flex items-center gap-1.5">
                            <span>Combo Courses & Discount Bundles</span>
                            <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-black">UP TO 40% OFF</span>
                          </p>
                          <p className="text-[9px] text-amber-800/80 truncate">Full Stack Super Combo, AI Bundles & Placement Track</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-amber-600 ml-auto shrink-0" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── 2. STUDENT / USER QUESTION CHIPS ── */}
                {msg.sender === 'bot' && (msg.mode === 'student' || msg.showStudentSubQuestions) && (
                  <div className="w-full mt-3 space-y-2">
                    <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 pl-1">
                      <Wallet className="w-3 h-3 text-emerald-500" />
                      <span>Student Fee & Learning Services:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <button
                        onClick={handleStudentFeeReceipt}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 text-left transition-all group shadow-xs cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate">Get Fee Receipt</p>
                          <p className="text-[9px] text-slate-400 group-hover:text-slate-600 truncate">Print / Download Invoice</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 ml-auto shrink-0" />
                      </button>

                      <button
                        onClick={handleStudentRemainingFees}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 text-left transition-all group shadow-xs cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                          <Wallet className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate">Remaining Fees</p>
                          <p className="text-[9px] text-slate-400 group-hover:text-slate-600 truncate">Submitted vs Due Balance</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 ml-auto shrink-0" />
                      </button>

                      <button
                        onClick={handleStudentMonthlyPlan}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 text-left transition-all group shadow-xs cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate">Monthly Installments</p>
                          <p className="text-[9px] text-slate-400 group-hover:text-slate-600 truncate">Payment Schedule</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 ml-auto shrink-0" />
                      </button>

                      <button
                        onClick={() => handleNavigate('/dashboard/student')}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 text-left transition-all group shadow-xs cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate">My Enrolled Courses</p>
                          <p className="text-[9px] text-slate-400 group-hover:text-slate-600 truncate">Open LMS Dashboard</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 ml-auto shrink-0" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── 3. ADMIN QUESTION CHIPS: Check Student Fees & Institutional Overview ── */}
                {msg.sender === 'bot' && (msg.mode === 'admin' || msg.showAdminSubQuestions) && (
                  <div className="w-full mt-3 space-y-2">
                    <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 pl-1">
                      <ShieldCheck className="w-3 h-3 text-amber-500" />
                      <span>Admin Fee Audit & Student Lookup:</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleAdminStudentFeeStatus('Ishika Rani', 'Java & React Full Stack', 12000, 8000, 4000, 'PARTIAL')}
                          className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 text-left transition-all group shadow-xs cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-bold text-[10px]">
                            IR
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate">Ishika Rani</p>
                            <p className="text-[9px] text-slate-500 truncate">Paid: ₹8,000 • Due: ₹4,000</p>
                          </div>
                          <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-amber-600 ml-auto shrink-0" />
                        </button>

                        <button
                          onClick={() => handleAdminStudentFeeStatus('Aryan Mehta', 'MERN Stack Web Dev', 10000, 10000, 0, 'PAID')}
                          className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 text-left transition-all group shadow-xs cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 font-bold text-[10px]">
                            AM
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-800 group-hover:text-slate-950 truncate">Aryan Mehta</p>
                            <p className="text-[9px] text-emerald-600 font-bold truncate">Fully Paid: ₹10,000</p>
                          </div>
                          <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-amber-600 ml-auto shrink-0" />
                        </button>
                      </div>

                      <button
                        onClick={handleAdminOverallFeeSummary}
                        className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-[#1c1d21] text-white hover:bg-black transition-all group shadow-xs cursor-pointer text-left"
                      >
                        <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                          <Wallet className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-[11px] font-bold text-white truncate">Academy Overall Fee Summary</p>
                          <p className="text-[9px] text-slate-400 truncate">Total Invoiced, Total Collected & Outstanding</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </button>
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
              placeholder="Ask about fee receipts, prices, remaining dues..."
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