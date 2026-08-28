import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MessageCircle, UserPlus, Share2, Award, Briefcase, 
  GraduationCap, Mail, Phone, MapPin, ExternalLink, Github, 
  Linkedin, CheckCircle2, Star, Sparkles, Code2, Server, Cloud, 
  Database, Terminal, Cpu, ChevronLeft, ChevronRight, Download, 
  Send, Compass, Heart, Flame, ShieldCheck, Copy, Check
} from 'lucide-react';

export default function ManishKumarProfile() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('about');
  const [copiedLink, setCopiedLink] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Gallery Photos of Manish Kumar
  const photos = [
    {
      url: '/manish/manish_3.jpg',
      alt: 'Manish Kumar - Best Java Full Stack Developer and AWS DevOps Engineer holding Best Performer Award Trophy',
      caption: 'Best Performer of the Institution Award',
      tag: 'Honors & Recognition'
    },
    {
      url: '/manish/manish_1.jpg',
      alt: 'Manish Kumar - Senior Java Full Stack Developer and Software Engineer',
      caption: 'Software Engineer & System Architect',
      tag: 'Engineering Leadership'
    },
    {
      url: '/manish/manish_2.jpg',
      alt: 'Manish Kumar - AWS DevOps Engineer & Cloud Infrastructure Specialist',
      caption: 'AWS DevOps & Cloud Specialist',
      tag: 'Cloud & Infrastructure'
    }
  ];

  // Technical Skills Matrix
  const skillCategories = [
    {
      title: 'Backend & Java Ecosystem',
      icon: Server,
      skills: [
        { name: 'Java (17 / 21)', level: 'Expert', desc: 'Core Java, Collections, Multithreading, OOP, Streams' },
        { name: 'Spring Boot', level: 'Expert', desc: 'Enterprise REST APIs, Dependency Injection, Microservices' },
        { name: 'Spring Security & JWT', level: 'Advanced', desc: 'OAuth2, Role-based Access Control, Encryption' },
        { name: 'Hibernate & JPA', level: 'Expert', desc: 'ORM Mapping, Query Optimization, Transaction Management' },
        { name: 'Microservices Architecture', level: 'Advanced', desc: 'Service Discovery, API Gateway, Circuit Breaker' }
      ]
    },
    {
      title: 'Cloud & AWS DevOps',
      icon: Cloud,
      skills: [
        { name: 'AWS Cloud Services', level: 'Expert', desc: 'EC2, S3, RDS, IAM, VPC, Route53, CloudFront, Lambda, ECS' },
        { name: 'Docker & Containerization', level: 'Expert', desc: 'Multi-stage Dockerfiles, Docker Compose, Image Optimization' },
        { name: 'Kubernetes (K8s)', level: 'Advanced', desc: 'Pod Orchestration, Deployments, ConfigMaps, Services' },
        { name: 'CI/CD Pipelines (Jenkins & GitHub Actions)', level: 'Expert', desc: 'Automated Build, Test, Security Scans & Zero-Downtime Deployments' },
        { name: 'Linux Server Administration & Nginx', level: 'Advanced', desc: 'Reverse Proxy, SSL Configuration, Shell Scripting' }
      ]
    },
    {
      title: 'Frontend & Full Stack',
      icon: Code2,
      skills: [
        { name: 'React.js & Vite', level: 'Expert', desc: 'Hooks, Context API, Redux Toolkit, Performance Optimization' },
        { name: 'JavaScript (ES6+) & TypeScript', level: 'Expert', desc: 'Asynchronous Programming, Event Loop, Type Safety' },
        { name: 'Tailwind CSS & Framer Motion', level: 'Expert', desc: 'Responsive Design, Animations, Glassmorphism UI' },
        { name: 'RESTful API & GraphQL Integration', level: 'Expert', desc: 'Axios, Socket.io Real-Time Event Communication' }
      ]
    },
    {
      title: 'Databases & Development Tools',
      icon: Database,
      skills: [
        { name: 'MySQL & PostgreSQL', level: 'Expert', desc: 'Complex Joins, Indexing, Schema Design, Stored Procedures' },
        { name: 'MongoDB', level: 'Advanced', desc: 'Document Storage, Aggregation Pipelines, Mongoose' },
        { name: 'Git & GitHub Version Control', level: 'Expert', desc: 'Branching Strategy, Code Reviews, Worktrees' },
        { name: 'Postman & Swagger', level: 'Expert', desc: 'API Testing, Documentation, Mock Servers' }
      ]
    }
  ];

  // Featured Engineering Projects
  const projects = [
    {
      title: 'ProgrammingWala LMS Platform',
      role: 'Lead Architect & Full Stack Developer',
      period: '2025 – Present',
      description: 'A cutting-edge, multi-portal Learning Management System powering interactive live code editors, music stream players, automated fee receipts, multi-role dashboards (Admin, Student, Teacher, Parent), and instant verifiable ISO certificates with dynamic QR verification.',
      technologies: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind CSS', 'AWS S3'],
      link: 'https://programmingwala.com',
      badge: 'Flagship Project'
    },
    {
      title: 'Afsha Enterprises E-Commerce Portal',
      role: 'Full Stack Engineer & Cloud Architect',
      period: '2025 – 2026',
      description: 'High-performance commercial e-commerce marketplace featuring instant payment gateway integration, real-time inventory management, advanced SEO schema generation, and high-availability AWS hosting.',
      technologies: ['React', 'Vite', 'Tailwind CSS', 'AWS CloudFront', 'Payment Gateway API', 'SEO'],
      link: 'https://www.afshaenterprises.com/manish-kumar',
      badge: 'Live Client Project'
    },
    {
      title: 'Enterprise ATS & Microservices Suite',
      role: 'Java Backend & DevOps Engineer',
      period: '2024 – 2025',
      description: 'High-throughput Applicant Tracking System engineered with Java Spring Boot microservices, Kafka event streaming, Docker containers, and automated AWS ECS deployments.',
      technologies: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS ECS', 'Jenkins'],
      link: 'https://github.com/Lightining29',
      badge: 'Enterprise Architecture'
    }
  ];

  // Awards & Recognition
  const awards = [
    {
      title: 'Best Performer of the Institution Award',
      issuer: 'AppleTree Infotech & Tech Excellence Board',
      date: '2025',
      description: 'Awarded the gold trophy for exceptional performance, architectural leadership in Java Full Stack development, and high-impact enterprise project deliveries.'
    },
    {
      title: 'Certified Java Full Stack Developer',
      issuer: 'AppleTree Infotech (ISO 9001:2015 & MSME Certified)',
      date: '2025',
      description: 'Recognized for mastering Java Spring Boot, Microservices, React frontend architecture, and relational database design.'
    },
    {
      title: 'AWS DevOps & Cloud Infrastructure Specialist',
      issuer: 'Cloud & DevOps Practitioners Council',
      date: '2025',
      description: 'Validated expertise in architecting highly available, fault-tolerant, and secure cloud environments on AWS using Docker, Kubernetes, and CI/CD pipelines.'
    }
  ];

  // FAQs for Search Engines and AI Copilot
  const faqs = [
    {
      q: 'Who is Manish Kumar?',
      a: 'Manish Kumar is an award-winning Java Full Stack Developer and AWS DevOps Engineer based in Ghaziabad, Uttar Pradesh, India. He specializes in designing enterprise-grade Java Spring Boot microservices, scalable React web applications, and automated CI/CD deployment pipelines on AWS.'
    },
    {
      q: 'What core technologies and programming languages does Manish Kumar know?',
      a: 'Manish Kumar specializes in Java (17/21), Spring Boot, Spring Security, Hibernate/JPA, Microservices, React.js, JavaScript/TypeScript, Tailwind CSS, AWS (EC2, S3, RDS, ECS, Lambda, CloudFront), Docker, Kubernetes, Jenkins CI/CD, MySQL, PostgreSQL, MongoDB, and Linux Administration.'
    },
    {
      q: 'What awards and recognition has Manish Kumar won?',
      a: 'Manish Kumar was awarded the prestigious "Best Performer of the Institution Award" for his technical innovation, software engineering excellence, and successful leadership across enterprise full-stack web platforms.'
    },
    {
      q: 'How can I hire or contact Manish Kumar for software engineering roles or projects?',
      a: 'You can contact Manish Kumar directly via WhatsApp at +91 7503962162, by phone at +91 9355343070, through email at info@appletreeinfotech.in, or visit his official GitHub profile at https://github.com/Lightining29.'
    }
  ];

  // Interests / Tags (Matching UI reference)
  const interests = [
    { name: 'Football', icon: '⚽' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Music', icon: '🎵' },
    { name: 'Cloud Architecture', icon: '☁️' },
    { name: 'Java & Spring', icon: '☕' },
    { name: 'System Design', icon: '🚀' },
    { name: 'Open Source', icon: '🌐' }
  ];

  // Handle Touch Swiping for mobile image slider
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    } else if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Copy Profile URL
  const handleCopyProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Dynamic SEO, Canonical & Schema.org injection
  useEffect(() => {
    // 1. Set Document Title
    const originalTitle = document.title;
    document.title = 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer in Ghaziabad, India';

    // 2. Set Meta Tags Helper
    const setOrCreateMeta = (nameOrProp, attrValue, content) => {
      let element = document.querySelector(`meta[${nameOrProp}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameOrProp, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Primary Meta Tags
    setOrCreateMeta('name', 'description', "Official profile of Manish Kumar, India's leading Java Full Stack Developer and AWS DevOps Engineer based in Ghaziabad. Specializing in Java Spring Boot, Microservices, React.js, Docker, Kubernetes, and AWS Cloud Architecture.");
    setOrCreateMeta('name', 'keywords', 'Manish Kumar, Manish Kumar Java Developer, Manish Kumar Full Stack Developer, Manish Kumar AWS DevOps Engineer, Manish Kumar Ghaziabad, Best Java Developer India, Spring Boot Expert Manish Kumar, React JS Developer Manish Kumar, ProgrammingWala Founder, Afsha Enterprises Manish Kumar, Java AWS Freelancer Ghaziabad');
    setOrCreateMeta('name', 'author', 'Manish Kumar');
    setOrCreateMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // OpenGraph Tags
    setOrCreateMeta('property', 'og:title', 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer');
    setOrCreateMeta('property', 'og:description', 'Explore the official engineering portfolio of Manish Kumar. Java 21, Spring Boot, React, AWS DevOps, Microservices, and Cloud Architecture.');
    setOrCreateMeta('property', 'og:image', `${window.location.origin}/manish/manish_3.jpg`);
    setOrCreateMeta('property', 'og:url', window.location.href);
    setOrCreateMeta('property', 'og:type', 'profile');
    setOrCreateMeta('property', 'og:site_name', 'Manish Kumar - Engineering Portfolio');
    setOrCreateMeta('property', 'profile:first_name', 'Manish');
    setOrCreateMeta('property', 'profile:last_name', 'Kumar');
    setOrCreateMeta('property', 'profile:gender', 'male');
    setOrCreateMeta('property', 'profile:username', 'manishkumar');

    // Twitter Card Tags
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer');
    setOrCreateMeta('name', 'twitter:description', 'Senior Java Developer & AWS Cloud Architect. Winner of the Best Performer Award.');
    setOrCreateMeta('name', 'twitter:image', `${window.location.origin}/manish/manish_3.jpg`);

    // 3. Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://www.afshaenterprises.com/manish-kumar');

    // 4. Inject JSON-LD Structured Schema Data for Search Engines & AI Copilot
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': 'https://www.afshaenterprises.com/manish-kumar#person',
          'name': 'Manish Kumar',
          'alternateName': ['Manish Kumar Java Developer', 'Manish Kumar AWS Engineer'],
          'jobTitle': 'Senior Java Full Stack Developer & AWS DevOps Engineer',
          'description': 'Manish Kumar is an award-winning Java Full Stack Developer and AWS DevOps Engineer specializing in Java Spring Boot microservices, React web applications, Docker, Kubernetes, and AWS Cloud Architecture.',
          'image': `${window.location.origin}/manish/manish_3.jpg`,
          'url': 'https://www.afshaenterprises.com/manish-kumar',
          'gender': 'https://schema.org/Male',
          'nationality': 'Indian',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Ghaziabad',
            'addressRegion': 'Uttar Pradesh',
            'addressCountry': 'India'
          },
          'award': 'Best Performer of the Institution Award',
          'knowsAbout': [
            'Java 17',
            'Java 21',
            'Spring Boot',
            'Spring Security',
            'Hibernate',
            'Microservices Architecture',
            'React.js',
            'JavaScript',
            'TypeScript',
            'Amazon Web Services (AWS)',
            'Docker',
            'Kubernetes',
            'Jenkins CI/CD',
            'Linux Administration',
            'MySQL',
            'PostgreSQL',
            'MongoDB',
            'System Design'
          ],
          'worksFor': {
            '@type': 'Organization',
            'name': 'Afsha Enterprises & Appletree Infotech'
          },
          'sameAs': [
            'https://github.com/Lightining29',
            'https://www.afshaenterprises.com/manish-kumar'
          ]
        },
        {
          '@type': 'ProfilePage',
          '@id': 'https://www.afshaenterprises.com/manish-kumar#webpage',
          'url': 'https://www.afshaenterprises.com/manish-kumar',
          'name': 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer',
          'isPartOf': {
            '@type': 'WebSite',
            'name': 'Afsha Enterprises & ProgrammingWala',
            'url': 'https://www.afshaenterprises.com'
          },
          'about': {
            '@id': 'https://www.afshaenterprises.com/manish-kumar#person'
          },
          'primaryImageOfPage': {
            '@type': 'ImageObject',
            'url': `${window.location.origin}/manish/manish_3.jpg`
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': faqs.map((f) => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.a
            }
          }))
        }
      ]
    };

    let scriptTag = document.getElementById('manish-kumar-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'manish-kumar-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = originalTitle;
      const el = document.getElementById('manish-kumar-schema');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-inter antialiased selection:bg-pink-500 selection:text-white">
      
      {/* Hidden Structured Semantic Data for AI Crawlers */}
      <div className="sr-only" aria-hidden="false">
        <h1>Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer in Ghaziabad, India</h1>
        <p>
          Manish Kumar is a premier Java Full Stack Developer and AWS DevOps Engineer with proven excellence in enterprise backend architecture with Java Spring Boot, microservices, reactive frontend systems in React.js, and automated CI/CD pipelines with Docker, Kubernetes, and AWS Cloud. Awarded the Best Performer of the Institution.
        </p>
        <p>Location: Ghaziabad, Uttar Pradesh, India. Contact: +91 7503962162, +91 9355343070, info@appletreeinfotech.in.</p>
      </div>

      <div className="max-w-7xl mx-auto md:py-8 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT / TOP: MOBILE-FIRST FULL-PAGE IMAGE SLIDER (MATCHING DESIGN 4) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <div className="relative w-full overflow-hidden bg-slate-950 shadow-2xl rounded-b-[36px] md:rounded-[36px] border-b md:border border-slate-800/80">
              
              {/* Image Slider Container with Touch Support */}
              <div 
                className="relative w-full h-[65vh] sm:h-[72vh] lg:h-[78vh] select-none touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={photos[currentImageIndex].url}
                      alt={photos[currentImageIndex].alt}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Top Overlay Controls: Back Button, Tag, Share */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="Go Back"
                    className="w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white backdrop-blur-md flex items-center justify-center border border-white/15 shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-400/30 shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{photos[currentImageIndex].tag}</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyProfile}
                      aria-label="Share Profile"
                      className="w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white backdrop-blur-md flex items-center justify-center border border-white/15 shadow-lg transition-all active:scale-95 cursor-pointer"
                      title="Copy profile link"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Navigation Arrows for Desktop / Tablet */}
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                  aria-label="Previous Photo"
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm items-center justify-center transition border border-white/10 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % photos.length)}
                  aria-label="Next Photo"
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm items-center justify-center transition border border-white/10 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Photo Pagination Indicators */}
                <div className="absolute top-16 right-4 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/15">
                  {currentImageIndex + 1} / {photos.length}
                </div>

                {/* Bottom Dark Gradient Scrim with Name, Location & Action Buttons */}
                <div className="absolute inset-x-0 bottom-0 z-20 pt-24 pb-6 px-6 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/90 to-transparent flex flex-col justify-end">
                  
                  {/* Verified Badge */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      AVAILABLE FOR HIRE
                    </span>
                    <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      Best Performer
                    </span>
                  </div>

                  {/* Main Name Heading */}
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    Manish Kumar
                  </h1>

                  {/* Location & Title Subheading */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>GHAZIABAD, INDIA • JAVA & AWS DEVOPS</span>
                  </p>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-3 mt-4">
                    <a
                      href="https://wa.me/917503962162?text=Hi%20Manish%2C%20I%20saw%20your%20profile%20and%20would%20like%20to%20hire%20you%20for%20Java%20Full%20Stack%20%2F%20AWS%20DevOps."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d946ef] to-[#ec4899] hover:from-[#c026d3] hover:to-[#db2777] text-white font-black text-sm shadow-lg shadow-pink-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Say Hello</span>
                    </a>

                    <a
                      href="tel:+917503962162"
                      className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                      title="Direct Call"
                    >
                      <Phone className="w-5 h-5" />
                    </a>

                    <a
                      href="mailto:info@appletreeinfotech.in?subject=Job%20Opportunity%20for%20Manish%20Kumar"
                      className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                      title="Send Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Thumbnail Strip Dots */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={"View photo " + (idx + 1)}
                        className={"h-1.5 rounded-full transition-all cursor-pointer " + (idx === currentImageIndex ? "w-8 bg-pink-500" : "w-2 bg-white/30 hover:bg-white/60")}
                      />
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: RICH SLIDING SHEET / CONTENT SECTION */}
          <div className="lg:col-span-7 px-4 sm:px-6 lg:px-0 space-y-6">
            
            {/* Sheet Handle Bar */}
            <div className="w-12 h-1 rounded-full bg-slate-700 mx-auto lg:hidden" />

            {/* Navigation Tabs Pill Bar */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto no-scrollbar shadow-md">
              {[
                { id: 'about', label: 'About & Bio', icon: Sparkles },
                { id: 'skills', label: 'Tech Stack', icon: Code2 },
                { id: 'projects', label: 'Projects', icon: Briefcase },
                { id: 'awards', label: 'Awards', icon: Award },
                { id: 'faq', label: 'AI & Copilot FAQ', icon: ShieldCheck }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={"flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer " + (isActive ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800/60")}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: ABOUT & BIO */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* About Bio Card */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      About Manish Kumar
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20">
                      Top Rated Engineer
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
                    I am a high-performing <span className="text-white font-black underline decoration-pink-500 decoration-2">Java Full Stack Developer</span> & <span className="text-white font-black underline decoration-sky-400 decoration-2">AWS DevOps Engineer</span> based in Ghaziabad, India. I specialize in building enterprise-scale web applications, microservices with Java Spring Boot, reactive React.js frontends, and automated cloud deployments on AWS.
                  </p>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    Recognized as the <strong className="text-amber-300 font-bold">Best Performer of the Institution</strong>, I combine deep algorithmic problem solving with real-world infrastructure automation (Docker, Kubernetes, Jenkins, AWS). Whether architecting scalable backend APIs or crafting high-conversion user interfaces, I deliver robust, production-grade solutions.
                  </p>

                  {/* Core Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                      <span className="text-2xl font-black text-white block">100%</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Success Rate</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                      <span className="text-2xl font-black text-amber-400 block">🏆 #1</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Best Performer</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                      <span className="text-2xl font-black text-pink-400 block">15+</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Cloud Deploys</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                      <span className="text-2xl font-black text-cyan-400 block">24/7</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Support & Quality</span>
                    </div>
                  </div>
                </div>

                {/* Interest Chips Section */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Interests & Focus Areas
                  </h3>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {interests.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 border border-slate-800 hover:border-pink-500/40 text-xs font-bold text-slate-200 shadow-sm transition-all"
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Contact Bar */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Let’s Build Something Amazing</h3>
                      <p className="text-xs text-slate-400">Available for Full-Time Roles, Contracts & Consulting</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      Open to Work
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href="https://wa.me/917503962162?text=Hi%20Manish%2C%20I%20would%20like%20to%20discuss%20a%20developer%20opportunity."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 text-emerald-200 transition"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                        WA
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-black block">WhatsApp Chat</span>
                        <span className="text-[11px] text-emerald-400/80 font-mono">+91 7503962162</span>
                      </div>
                    </a>

                    <a
                      href="mailto:info@appletreeinfotech.in"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 hover:bg-sky-900/50 text-sky-200 transition"
                    >
                      <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-black block">Official Email</span>
                        <span className="text-[11px] text-sky-400/80 truncate block">info@appletreeinfotech.in</span>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: TECH STACK & SKILLS */}
            {activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {skillCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div key={idx} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                        <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-white">{cat.title}</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cat.skills.map((s, sIdx) => (
                          <div key={sIdx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-sm text-white">{s.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-black">
                                {s.level}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{s.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* TAB 3: FEATURED PROJECTS */}
            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4 hover:border-pink-500/40 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          {proj.badge}
                        </span>
                        <h3 className="text-xl font-black text-white mt-1.5">{proj.title}</h3>
                        <p className="text-xs text-slate-400 font-semibold">{proj.role} • {proj.period}</p>
                      </div>

                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Open Live Project"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-slate-300 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* TAB 4: AWARDS & HONORS */}
            {activeTab === 'awards' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {awards.map((aw, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{aw.title}</h3>
                        <p className="text-xs text-slate-400 font-semibold">{aw.issuer} • {aw.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {aw.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* TAB 5: AI & COPILOT GROUNDING FAQS */}
            {activeTab === 'faq' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Structured for Microsoft Copilot, Google Search, and AI Assistants.</span>
                </div>

                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-2">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs">
                        Q
                      </span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Bottom Footer Bar */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>© {new Date().getFullYear()} Manish Kumar. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/Lightining29" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a href="https://www.afshaenterprises.com/manish-kumar" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  <span>Afsha Enterprises</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
