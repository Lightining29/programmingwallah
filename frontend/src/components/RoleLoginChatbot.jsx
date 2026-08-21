import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  FileText,
  Edit3,
  CheckCheck,
  Smartphone,
  BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Initial student database for interactive Admin modifications
const INITIAL_STUDENTS = [
  {
    id: 'std-1',
    name: 'Ishika Rani',
    email: 'ishika.rani@gmail.com',
    phone: '+91 98765 43210',
    parentPhone: '+91 98765 43211',
    course: 'Java & React Full Stack',
    totalFee: 12000,
    paidAmount: 8000,
    remainingAmount: 4000,
    status: 'PARTIAL',
    grade: 'A+ (Grandmaster)',
    attendance: '96%',
    month1Paid: true,
    month2Paid: true,
    month3Paid: false
  },
  {
    id: 'std-2',
    name: 'Aryan Mehta',
    email: 'aryan.mehta@gmail.com',
    phone: '+91 98123 45678',
    parentPhone: '+91 98123 45679',
    course: 'MERN Stack Web Dev',
    totalFee: 10000,
    paidAmount: 10000,
    remainingAmount: 0,
    status: 'PAID',
    grade: 'A (Master)',
    attendance: '92%',
    month1Paid: true,
    month2Paid: true,
    month3Paid: true
  },
  {
    id: 'std-3',
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@gmail.com',
    phone: '+91 99887 76655',
    parentPhone: '+91 99887 76656',
    course: 'Python & AI Specialist',
    totalFee: 11000,
    paidAmount: 3666,
    remainingAmount: 7334,
    status: 'PARTIAL',
    grade: 'A (Top Performer)',
    attendance: '98%',
    month1Paid: true,
    month2Paid: false,
    month3Paid: false
  },
  {
    id: 'std-4',
    name: 'Rohan Verma',
    email: 'rohan.verma@gmail.com',
    phone: '+91 91234 56780',
    parentPhone: '+91 91234 56781',
    course: 'Full Stack Super Combo',
    totalFee: 18000,
    paidAmount: 18000,
    remainingAmount: 0,
    status: 'PAID',
    grade: 'A+ (Top 1% Ranker)',
    attendance: '100%',
    month1Paid: true,
    month2Paid: true,
    month3Paid: true
  }
];

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
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Initial personalized greeting based on login state
  const getGreetingMessage = () => {
    if (user) {
      if (user.role === 'admin') {
        return {
          id: 'welcome-admin',
          sender: 'bot',
          text: `🛡️ **Welcome Administrator ${user.name}!**\n\nYou are logged in with **Admin privileges** (${user.email}).\n\nI can help you:\n• **Update Student Information (Fees, Courses, Grades, Phone)**\n• Audit student remaining & submitted balances\n• Issue month-wise official fee receipts\n• Inspect academy financial metrics\n\nSelect an action below or ask a question:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userDetected: true,
          mode: 'admin'
        };
      } else if (user.role === 'teacher') {
        return {
          id: 'welcome-teacher',
          sender: 'bot',
          text: `👨‍🏫 **Welcome Faculty Member ${user.name}!**\n\nYou are signed in as **Teacher / Instructor** (${user.email}).\n\nI can help you track batch attendance, grade student DSA submissions, post course materials, and inspect student progress. Choose an option below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userDetected: true,
          mode: 'teacher'
        };
      } else if (user.role === 'parent') {
        return {
          id: 'welcome-parent',
          sender: 'bot',
          text: `👨‍👩‍👦 **Welcome ${user.name}!**\n\nYou are logged in as **Parent** (${user.email}).\n\nView your child's attendance progress, check remaining fee installments, download month-by-month receipts, or schedule teacher meetings below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userDetected: true,
          mode: 'parent'
        };
      } else {
        // Student / User
        return {
          id: 'welcome-student',
          sender: 'bot',
          text: `👋 **Welcome back, ${user.name}!**\n\nYou are logged in as **Student** (${user.email}).\n\nI can give you your **Fee Receipts (Month 1, 2, or 3)**, calculate your **Remaining Fees & Monthly Installments**, explain **DSA & Geeks Tutorials**, or guide your enrolled curriculum. Click any question below:`,
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

  // ── 1. MONTH-SPECIFIC FEE RECEIPTS (Questions inside Questions) ──
  const handlePromptMonthReceipt = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '🧾 Download / View Fee Receipt',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Which month's fee receipt do you need?**\n\nPlease select the specific billing cycle or consolidated receipt below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMonthReceiptPrompt: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleGenerateSpecificMonthReceipt = (monthName, amount, status, periodDescription) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Generate ${monthName} Fee Receipt (₹${amount.toLocaleString('en-IN')})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Verified Official Tax Receipt for ${monthName}:**\n\n• **Billing Cycle**: ${periodDescription}\n• **Amount Surcharged**: ₹${amount.toLocaleString('en-IN')}\n• **Payment Method**: Online UPI / NetBanking Verified\n• **Status**: ${status}`,
        isReceipt: true,
        receiptData: {
          receiptNo: `REC-2024-${monthName.replace(/\s+/g, '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          studentName: user?.name || 'Ishika Rani',
          email: user?.email || 'student@programmingwallah.com',
          course: `Java Full Stack - ${monthName} Installment`,
          totalFee: amount,
          paidAmount: amount,
          remainingAmount: status === 'PAID' ? 0 : 4000,
          status: status,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showStudentSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    }, 350);
  };

  // ── 2. ADMIN: INTERACTIVELY UPDATE STUDENT INFORMATION IN CHATBOT ──
  const handleStartAdminStudentUpdate = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '✏️ Update Student Information (Admin Mode)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Admin Student Management & Record Updater:**\n\nSelect a student whose record you would like to edit:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdminStudentSelect: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleSelectStudentToUpdate = (student) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Selected Student: ${student.name} (${student.course})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Current Record for ${student.name}:**\n• **Course**: ${student.course}\n• **Fees**: ₹${student.paidAmount} Paid / ₹${student.remainingAmount} Due (${student.status})\n• **Performance**: ${student.grade}\n• **Phone**: ${student.phone}\n\n**What would you like to update for ${student.name}?**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdminFieldSelect: true,
        selectedStudent: student
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleExecuteAdminUpdate = (studentId, fieldType, newValue, updateSummary) => {
    // Update student in state
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        if (fieldType === 'fee_mark_paid') {
          return {
            ...s,
            paidAmount: s.totalFee,
            remainingAmount: 0,
            status: 'PAID',
            month1Paid: true,
            month2Paid: true,
            month3Paid: true
          };
        }
        if (fieldType === 'course') {
          return { ...s, course: newValue };
        }
        if (fieldType === 'grade') {
          return { ...s, grade: newValue };
        }
        if (fieldType === 'phone') {
          return { ...s, phone: newValue };
        }
      }
      return s;
    }));

    const updatedStudent = students.find(s => s.id === studentId);

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Update ${fieldType}: ${newValue || 'Marked as Full Paid'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `✅ **Student Record Successfully Updated!**\n\n${updateSummary}\n\n• **Student**: ${updatedStudent?.name}\n• **Current Status**: Active & Verified\n• **Sync**: Real-time database synchronized.`,
        actionText: 'View in Admin Dashboard',
        actionLink: '/dashboard/admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showAdminSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    }, 350);
  };

  // ── 3. DSA & GEEKSFORGEEKS KNOWLEDGE SUB-QUESTIONS ──
  const handlePromptDSATopic = () => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: '🧠 Geeks & DSA Knowledge Hub: Explore Algorithms',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**Geeks Knowledge Hub — Select a Topic:**\n\nChoose an algorithm or system design pattern to inspect diagrams, complexity, and code:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDSAPrompt: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleShowDSASolution = (topicName, complexity, summary, link) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: `Explain ${topicName}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `**${topicName}**\n\n${summary}\n\n⚡ **Time & Space Complexity**: \`${complexity}\`\n\n📊 *Full interactive visual diagrams, multi-language code (Java, C++, Python, JS), and company interview questions available in our Geeks Tutorial Portal:*`,
        actionText: 'Open Full Tutorial & Code',
        actionLink: '/tutorials',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showStudentSubQuestions: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 350);
  };

  // ── 4. COURSE PRICING & BUYING (GUEST & ALL ROLES) ──
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
        text: `**Your Fee Account Status (${user?.name || 'Ishika Rani'}):**\n\n• **Enrolled Track**: Java Full Stack Developer\n• **Total Course Price**: ₹12,000\n• ✅ **Fees Submitted (Paid)**: ₹8,000 (Installments 1 & 2)\n• ⏳ **Remaining Fees Due**: **₹4,000**\n• 📅 **Next Installment Due Date**: 15th of next month\n\nYou can settle your remaining installment online via UPI or card.`,
        actionText: 'Pay Remaining Fee',
        actionLink: '/dashboard/student',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showStudentSubQuestions: true
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
        handlePromptMonthReceipt();
        return;
      } else if (query.includes('update') || query.includes('edit') || query.includes('modify')) {
        handleStartAdminStudentUpdate();
        return;
      } else if (query.includes('price') || query.includes('cost') || query.includes('fee') || query.includes('buy')) {
        handleShowAllCourses();
        return;
      } else if (query.includes('combo') || query.includes('bundle') || query.includes('discount')) {
        handleShowComboCourses();
        return;
      } else if (query.includes('dsa') || query.includes('geek') || query.includes('algorithm') || query.includes('code')) {
        handlePromptDSATopic();
        return;
      } else {
        botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I've noted your question: *"**${userMsg.text}**"*\n\nHere are some helpful quick actions:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showStudentSubQuestions: true
        };
        setIsTyping(false);
        setMessages(prev => [...prev, botMsg]);
      }
    }, 350);
  };

  const handleResetChat = () => {
    setMessages([getGreetingMessage()]);
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none print:hidden">
      
      {/* ── CHAT FLOATING TRIGGER BUTTON ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#1c1d21] text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#1c1d21]" />
          </div>
          <div className="text-left font-quicksand">
            <span className="block text-xs font-black uppercase tracking-wider text-amber-300">AppleTree Assistant</span>
            <span className="block text-[10px] text-slate-300 font-medium">
              {user ? `Logged in: ${user.name} (${user.role})` : 'Fees, Tutorials & Role Login'}
            </span>
          </div>
        </button>
      )}

      {/* ── CHATBOT WINDOW DIALOG ── */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[460px] h-[640px] max-h-[88vh] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#1c1d21] text-white p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm font-quicksand text-white flex items-center gap-1.5">
                  <span>AppleTree Smart Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {user ? `Connected as ${user.name} (${user.role})` : 'Online • Role & Course Guide'}
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

                  {/* ── 1. NESTED SUB-QUESTION: SPECIFIC MONTH FEE RECEIPTS ── */}
                  {msg.isMonthReceiptPrompt && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Month Invoice:
                      </p>
                      <button
                        onClick={() => handleGenerateSpecificMonthReceipt('Month 1', 4000, 'PAID', 'Admission & Core OOPs')}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-900 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🧾 Month 1 Receipt (Admission - ₹4,000)</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">PAID</span>
                      </button>
                      <button
                        onClick={() => handleGenerateSpecificMonthReceipt('Month 2', 4000, 'PAID', 'Spring Boot & Database Frameworks')}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-900 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🧾 Month 2 Receipt (Mid-Term - ₹4,000)</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">PAID</span>
                      </button>
                      <button
                        onClick={() => handleGenerateSpecificMonthReceipt('Month 3', 4000, 'DUE', 'Capstone Project & ISO Certificate')}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-900 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🧾 Month 3 Receipt (Final Phase - ₹4,000)</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded-md">PENDING</span>
                      </button>
                      <button
                        onClick={() => handleGenerateSpecificMonthReceipt('Full Course Consolidated', 12000, 'PARTIAL', 'Complete 3-Month Program Invoice')}
                        className="w-full text-left p-2 rounded-xl bg-[#1c1d21] text-amber-300 hover:bg-black text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>📑 Full Consolidated Invoice (₹12,000)</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>
                  )}

                  {/* ── 2. NESTED SUB-QUESTION: ADMIN SELECT STUDENT TO UPDATE ── */}
                  {msg.isAdminStudentSelect && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Choose Student to Edit:
                      </p>
                      {students.map((std) => (
                        <button
                          key={std.id}
                          onClick={() => handleSelectStudentToUpdate(std)}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-900 flex items-center justify-between transition-all cursor-pointer"
                        >
                          <div>
                            <span className="block">{std.name}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{std.course} • {std.status}</span>
                          </div>
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ── 3. NESTED SUB-QUESTION: ADMIN SELECT FIELD TO UPDATE ── */}
                  {msg.isAdminFieldSelect && msg.selectedStudent && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Field to Update for {msg.selectedStudent.name}:
                      </p>
                      <button
                        onClick={() => handleExecuteAdminUpdate(
                          msg.selectedStudent.id, 
                          'fee_mark_paid', 
                          null, 
                          `Marked all pending fees as **PAID** (₹${msg.selectedStudent.totalFee} Total Settled). Month 1, 2, and 3 invoices marked cleared.`
                        )}
                        className="w-full text-left p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>💰 Mark Pending Fees as Fully Paid (₹0 Due)</span>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => handleExecuteAdminUpdate(
                          msg.selectedStudent.id, 
                          'course', 
                          'Full Stack Super Combo (Java + MERN + AI)', 
                          `Upgraded course track to **Full Stack Super Combo (Java + MERN + AI)**.`
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🎓 Upgrade Track: Super Combo Track</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                      <button
                        onClick={() => handleExecuteAdminUpdate(
                          msg.selectedStudent.id, 
                          'grade', 
                          'A+ (Grandmaster & Top 1%)', 
                          `Promoted student performance rating to **A+ Grandmaster (Top 1%)**.`
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🎖️ Upgrade Grade: A+ Grandmaster</span>
                        <Award className="w-3.5 h-3.5 text-purple-600" />
                      </button>
                      <button
                        onClick={() => handleExecuteAdminUpdate(
                          msg.selectedStudent.id, 
                          'phone', 
                          '+91 99999 88888', 
                          `Updated primary contact number to **+91 99999 88888**.`
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>📱 Update Contact Phone Number</span>
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    </div>
                  )}

                  {/* ── 4. NESTED SUB-QUESTION: DSA KNOWLEDGE & GEEKS CLONE TOPICS ── */}
                  {msg.isDSAPrompt && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Algorithm / System Design Topic:
                      </p>
                      <button
                        onClick={() => handleShowDSASolution(
                          'Binary Search Tree (BST)', 
                          'O(log N) average, O(N) worst-case', 
                          'A node-based hierarchical data structure where left subtree has keys < root, and right subtree has keys > root. Inorder traversal yields sorted order.',
                          '/tutorials'
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>🌲 Binary Search Tree: Insertion & Traversals</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                      <button
                        onClick={() => handleShowDSASolution(
                          'Sliding Window Technique', 
                          'O(N) Linear Time, O(1) Auxiliary Space', 
                          'Optimizes nested O(N^2) subarray and substring problems into single-pass O(N) by maintaining two pointers and sliding window boundaries.',
                          '/tutorials'
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>⚡ Sliding Window: Max Subarray & Substrings</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                      <button
                        onClick={() => handleShowDSASolution(
                          'System Design: Distributed Redis Caching', 
                          '0.5 ms Redis In-Memory vs 25 ms SQL Disk', 
                          'Cache-Aside lazy loading pattern shields relational databases from read bursts and achieves sub-millisecond API response latency.',
                          '/tutorials'
                        )}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span>💾 System Design: Redis Caching & Cache-Aside</span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    </div>
                  )}

                  {/* ── 5. DIGITAL FEE RECEIPT CARD ── */}
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
                          <span>Total Invoiced:</span>
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

                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl rounded-bl-none max-w-[120px] shadow-sm">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── PERSISTENT QUICK QUESTION CHIPS (Always Available) ── */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200/80 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-[11px] font-bold whitespace-nowrap">
              
              {/* Common Quick Chips */}
              <button
                onClick={handlePromptMonthReceipt}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>🧾 Fee Receipt (Select Month)</span>
              </button>

              <button
                onClick={handleStartAdminStudentUpdate}
                className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-700" />
                <span>✏️ Update Student Record</span>
              </button>

              <button
                onClick={handlePromptDSATopic}
                className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>🧠 Geeks & DSA Tutorials</span>
              </button>

              <button
                onClick={handleStudentRemainingFees}
                className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Wallet className="w-3.5 h-3.5 text-blue-700" />
                <span>💳 Remaining & Submitted Fees</span>
              </button>

              <button
                onClick={handleShowAllCourses}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
                <span>📚 All Courses & Prices</span>
              </button>

              <button
                onClick={handleShowComboCourses}
                className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Percent className="w-3.5 h-3.5 text-rose-700" />
                <span>🎁 Combo Bundles (40% OFF)</span>
              </button>

              <button
                onClick={handleShowHowToBuy}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-all cursor-pointer shrink-0"
              >
                🛒 How to Buy
              </button>

            </div>
          </div>

          {/* Footer Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about fee receipts, edit student, DSA algorithms..."
              className="flex-1 bg-slate-100 text-slate-900 px-3.5 py-2.5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-2xl bg-[#1c1d21] text-amber-400 hover:bg-black flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
