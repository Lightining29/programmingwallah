import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { BrainCircuit, Code2, FileText, Trophy, UserCircle, Sparkles, Download } from 'lucide-react';

const quizQuestions = [
  {
    id: 1,
    prompt: 'Which data structure gives O(1) average-time lookup for a key-value pair?',
    options: ['Array', 'Hash Map', 'Linked List', 'Stack'],
    answer: 'Hash Map'
  },
  {
    id: 2,
    prompt: 'In Java, which keyword is used to create a class that can be extended?',
    options: ['final', 'static', 'abstract', 'class'],
    answer: 'class'
  },
  {
    id: 3,
    prompt: 'What is the best-case time complexity for binary search on a sorted array?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answer: 'O(1)'
  }
];

const leaderboard = [
  { name: 'Aarav', score: 98, rank: 'Platinum Developer', glow: 'from-amber-400 via-yellow-300 to-emerald-300' },
  { name: 'Sia', score: 91, rank: 'Gold Developer', glow: 'from-cyan-400 via-indigo-400 to-violet-400' },
  { name: 'Kunal', score: 84, rank: 'Silver Developer', glow: 'from-slate-300 via-slate-200 to-slate-100' },
  { name: 'Neha', score: 77, rank: 'Bronze Developer', glow: 'from-orange-300 via-amber-200 to-rose-200' }
];

const generateDsaQuestionBank = () => {
  const templates = [
    (index) => ({
      title: `Array Pairing ${index + 1}`,
      prompt: `Given an array of ${4 + (index % 5)} integers and target ${8 + (index % 11)}, write a Java function to count how many pairs sum to the target.`
    }),
    (index) => ({
      title: `Binary Search ${index + 1}`,
      prompt: `Given a sorted array of ${6 + (index % 7)} integers and target ${15 + (index % 13)}, write a Java function that returns the index of the target or -1.`
    }),
    (index) => ({
      title: `Palindrome Check ${index + 1}`,
      prompt: `Write a Java function to determine whether the string \"${'abccba'.slice(0, 3 + (index % 4))}${index % 2 ? 'a' : 'b'}\" is a palindrome.`
    }),
    (index) => ({
      title: `Fibonacci ${index + 1}`,
      prompt: `Write a Java function to return the ${index + 1}-th Fibonacci number using recursion or iteration.`
    }),
    (index) => ({
      title: `Balanced Brackets ${index + 1}`,
      prompt: `Given a string with ${index + 2} characters, write a Java function to check whether all parentheses are balanced.`
    }),
    (index) => ({
      title: `Maximum Subarray ${index + 1}`,
      prompt: `Given an integer array of ${5 + (index % 6)} values, write a Java function to return the maximum subarray sum.`
    }),
    (index) => ({
      title: `Tree Height ${index + 1}`,
      prompt: `Write a Java function to compute the height of a binary tree with ${index + 3} nodes using DFS or recursion.`
    }),
    (index) => ({
      title: `String Reverse ${index + 1}`,
      prompt: `Write a Java function to reverse the string \"${'coder'.slice(0, 3 + (index % 4))}${index % 3}\" and return the reversed version.`
    })
  ];

  return Array.from({ length: 1000 }, (_, index) => {
    const template = templates[index % templates.length];
    return {
      id: index + 1,
      ...template(index)
    };
  });
};

export default function Practice() {
  const [answers, setAnswers] = useState({ 1: '', 2: '', 3: '' });
  const [developerName, setDeveloperName] = useState('Developer');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Greater Noida West, India');
  const [skills, setSkills] = useState('Java, DSA, React, Node.js');
  const [tools, setTools] = useState('GitHub, VS Code, Figma');
  const [frameworks, setFrameworks] = useState('React, Tailwind, Express');
  const [projects, setProjects] = useState('Online compiler, quiz platform, resume builder');
  const [role, setRole] = useState('Java + DSA Learner');
  const [focus, setFocus] = useState('Build clean solutions and ship real projects.');
  const [avatarTone, setAvatarTone] = useState('midnight');
  const [resumeReady, setResumeReady] = useState(false);
  const [aiResume, setAiResume] = useState(null);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [aiMessage, setAiMessage] = useState('Use the AI polish button for a more professional resume tone.');
  const dsaQuestionBank = useMemo(() => generateDsaQuestionBank(), []);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [solutionDraft, setSolutionDraft] = useState(`public class Solution {
  public static int solve(int[] nums, int target) {
    // Write your Java solution here
    return 0;
  }
}`);
  const [feedback, setFeedback] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('Paste your Java solution and ask AI for targeted DSA guidance.');

  const score = useMemo(() => {
    return quizQuestions.reduce((total, item) => total + (answers[item.id] === item.answer ? 1 : 0), 0);
  }, [answers]);

  const rankLabel = score >= 3 ? 'Platinum Developer' : score === 2 ? 'Gold Developer' : score === 1 ? 'Silver Developer' : 'Bronze Developer';

  const avatarStyles = {
    midnight: 'from-slate-950 via-indigo-900 to-slate-800 text-cyan-100',
    sunrise: 'from-amber-500 via-rose-400 to-fuchsia-500 text-white',
    aurora: 'from-emerald-500 via-cyan-400 to-indigo-500 text-slate-950'
  };

  const normalizeList = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    return String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const mergeResumeSkills = (resumeSkills = skills, resumeTools = tools, resumeFrameworks = frameworks) => {
    return [...new Set([
      ...normalizeList(resumeSkills),
      ...normalizeList(resumeTools),
      ...normalizeList(resumeFrameworks)
    ])];
  };

  const handleAiPolish = async () => {
    setIsPolishing(true);
    setAiMessage('Polishing your resume with Gemini AI...');

    try {
      const response = await fetch('/api/public/resume/ai-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: developerName, role, focus, skills, projects, phone, address, tools, frameworks })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'AI polishing failed.');
      }

      setAiResume(result.data);
      setDeveloperName(developerName || 'Developer');
      setRole(result.data.headline || role);
      setFocus(result.data.summary || focus);
      setSkills((result.data.skills || mergeResumeSkills()).join(', '));
      setTools((result.data.tools || normalizeList(tools)).join(', '));
      setFrameworks((result.data.frameworks || normalizeList(frameworks)).join(', '));
      setProjects((result.data.projects || normalizeList(projects)).join(' • '));
      setResumeReady(false);
      setAiMessage('AI-enhanced resume tone is ready. Your PDF will now use the polished content and cleaner formatting.');
    } catch (error) {
      setAiMessage(error.message || 'AI polishing is unavailable right now.');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleAiFeedback = async () => {
    setIsChecking(true);
    setFeedbackMessage('AI mentor is reviewing your DSA attempt...');

    try {
      const response = await fetch('/api/public/dsa-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `${dsaQuestionBank[selectedQuestion].title} — ${dsaQuestionBank[selectedQuestion].prompt}`,
          code: solutionDraft
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'AI feedback failed.');
      }

      setFeedback(result.data);
      setFeedbackMessage('AI feedback is ready. Review the suggestions and iterate on your solution.');
    } catch (error) {
      setFeedbackMessage(error.message || 'AI feedback is unavailable right now.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleGenerateResume = () => {
    setIsGeneratingPdf(true);
    setAiMessage('Preparing a polished PDF resume with a cleaner layout...');

    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 36;
      const headline = aiResume?.headline || role || 'Java + DSA Learner';
      const summaryText = aiResume?.summary || focus || 'Build clean solutions and ship real projects.';
      const skillList = mergeResumeSkills(aiResume?.skills || skills, aiResume?.tools || tools, aiResume?.frameworks || frameworks);
      const projectList = normalizeList(aiResume?.projects || projects);
      const highlights = aiResume?.highlights || [
        'Strong problem-solving mindset',
        'Modern frontend and backend development experience',
        'Ready for internships, interviews, and real-world engineering roles'
      ];

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 110, 'F');
      doc.setDrawColor(56, 189, 248);
      doc.setLineWidth(1);
      doc.line(margin, 118, pageWidth - margin, 118);

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text(developerName || 'Developer Name', margin, 42);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(headline, margin, 66);
      doc.setTextColor(191, 219, 254);
      doc.text(`Phone: ${phone || 'Not provided'}   •   Address: ${address || 'Not provided'}`, margin, 88);

      doc.setFillColor(236, 244, 255);
      doc.roundedRect(margin, 132, pageWidth - margin * 2, 70, 10, 10, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Professional Summary', margin + 12, 154);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const summaryLines = doc.splitTextToSize(summaryText, pageWidth - margin * 2 - 24);
      doc.text(summaryLines, margin + 12, 172);

      let y = 224;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Core Skills', margin, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      skillList.forEach((item) => {
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 50;
        }
        doc.text(`• ${item}`, margin + 6, y);
        y += 18;
      });

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Projects & Achievements', margin, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      projectList.forEach((item) => {
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 50;
        }
        doc.text(`• ${item}`, margin + 6, y);
        y += 18;
      });

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Highlights', margin, y);
      y += 18;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      highlights.forEach((item) => {
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 50;
        }
        doc.text(`• ${item}`, margin + 6, y);
        y += 18;
      });

      const pdfBlobUrl = doc.output('bloburl');
      const fileName = `${(developerName || 'developer').trim().replace(/\s+/g, '-').toLowerCase()}-resume.pdf`;

      window.open(pdfBlobUrl, '_blank', 'noopener,noreferrer');

      const downloadLink = document.createElement('a');
      downloadLink.href = pdfBlobUrl;
      downloadLink.download = fileName;
      downloadLink.click();

      setResumeReady(true);
      setAiMessage('Resume PDF generated with a polished, professional layout.');
    } catch (error) {
      setAiMessage(error.message || 'Resume generation is unavailable right now.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleResumeSubmit = (event) => {
    event.preventDefault();
    handleGenerateResume();
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 text-slate-100 md:px-8">
      <section className="rounded-[32px] border border-cyan-400/10 bg-[linear-gradient(135deg,#020617_0%,#111827_45%,#172554_100%)] p-6 shadow-[0_30px_70px_rgba(15,23,42,0.55)] md:p-8">
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200">Developer Practice Hub</p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">Quiz • Leaderboards • Java DSA Practice • Resume Builder</h1>
            <p className="max-w-2xl text-sm text-slate-300 md:text-base">Train on Java and DSA, solve quizzes, compare yourself on the leaderboard, compile code directly in the browser, and build your developer profile.</p>
          </div>
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100 shadow-[0_18px_30px_rgba(56,189,248,0.12)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200">Current Rank</p>
            <p className="mt-1 text-2xl font-black text-white">{rankLabel}</p>
            <p className="text-xs text-cyan-50">Quiz score: {score} / {quizQuestions.length}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[30px] border border-white/10 bg-slate-900/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.4)]">
          <div className="mb-4 flex items-center gap-3">
            <BrainCircuit className="h-5 w-5 text-cyan-200" />
            <div>
              <h2 className="text-xl font-black text-white">Java & DSA Mini Quiz</h2>
              <p className="text-xs text-slate-300">Answer the questions and watch your rank update in real time.</p>
            </div>
          </div>
          <div className="space-y-4">
            {quizQuestions.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{item.id}. {item.prompt}</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {item.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: option }))}
                      className={`rounded-2xl border px-3 py-2 text-left text-sm transition-all ${answers[item.id] === option ? 'border-cyan-400 bg-cyan-400/12 text-cyan-100' : 'border-white/10 bg-slate-950/70 text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-400/8'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-slate-900/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.4)]">
          <div className="mb-4 flex items-center gap-3">
            <Trophy className="h-5 w-5 text-amber-300" />
            <div>
              <h2 className="text-xl font-black text-white">Weekly Leaderboard</h2>
              <p className="text-xs text-slate-300">Top developer ranks for practice streaks and quiz performance.</p>
            </div>
          </div>
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div key={entry.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${entry.glow} text-sm font-black text-slate-950`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{entry.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-100">{entry.rank}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">{entry.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[30px] border border-white/10 bg-slate-900/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.4)]">
          <div className="mb-4 flex items-center gap-3">
            <Code2 className="h-5 w-5 text-emerald-300" />
            <div>
              <h2 className="text-xl font-black text-white">1000 DSA Challenge Bank</h2>
              <p className="text-xs text-slate-300">Solve a generated DSA question in the compiler, then ask the AI mentor for suggestions if your logic is off.</p>
            </div>
          </div>

          <div className="mb-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-xs text-emerald-50">
            <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-200">Question bank</p>
            <p className="mt-1 font-semibold">{dsaQuestionBank.length} curated DSA problems are ready. Pick any challenge and use the compiler below to test your solution.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedQuestion((prev) => (prev === 0 ? dsaQuestionBank.length - 1 : prev - 1))}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-left text-sm text-slate-100 hover:border-cyan-400/40"
            >
              ← Previous challenge
            </button>
            <button
              type="button"
              onClick={() => setSelectedQuestion((prev) => (prev + 1) % dsaQuestionBank.length)}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-left text-sm text-slate-100 hover:border-cyan-400/40"
            >
              Next challenge →
            </button>
          </div>

          <div className="mt-4 rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-4 text-sm text-slate-100">
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200">Current challenge</p>
            <h3 className="mt-2 text-lg font-black text-white">{dsaQuestionBank[selectedQuestion]?.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{dsaQuestionBank[selectedQuestion]?.prompt}</p>
            <p className="mt-3 text-xs text-cyan-100">Challenge #{selectedQuestion + 1} of {dsaQuestionBank.length}</p>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-cyan-400/20 bg-black/70">
            <iframe
              title="Online Java Compiler"
              src="https://www.jdoodle.com/iembed/v0/"
              className="h-[420px] w-full border-0"
              allow="clipboard-write"
              loading="lazy"
            />
          </div>

          <div className="mt-4 rounded-3xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm text-violet-50">
            <p className="text-[10px] uppercase tracking-[0.35em] text-violet-200">AI DSA mentor</p>
            <textarea
              value={solutionDraft}
              onChange={(e) => setSolutionDraft(e.target.value)}
              rows={8}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0"
              placeholder="Paste your Java code here and ask for feedback."
            />
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAiFeedback}
                disabled={isChecking}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-slate-950 shadow-[0_18px_30px_rgba(56,189,248,0.18)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isChecking ? 'Analyzing...' : 'Get AI Suggestions'}
              </button>
              <button
                type="button"
                onClick={() => setSolutionDraft(`public class Solution {
  public static int solve(int[] nums, int target) {
    // Write your Java solution here
    return 0;
  }
}`)}
                className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-slate-100"
              >
                Reset template
              </button>
            </div>
            <p className="mt-3 text-xs text-cyan-100">{feedbackMessage}</p>
            {feedback && (
              <div className="mt-4 rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-4 text-xs text-slate-100">
                <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200">Feedback report</p>
                <p className="mt-2 font-black text-white">Verdict: {feedback.verdict}</p>
                <p className="text-cyan-100">Confidence: {feedback.confidence}</p>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-slate-200">
                  {feedback.suggestions.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-violet-200">Next steps</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-200">
                  {feedback.nextSteps.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-slate-900/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.4)]">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-5 w-5 text-violet-300" />
            <div>
              <h2 className="text-xl font-black text-white">Resume Builder</h2>
              <p className="text-xs text-slate-300">Generate a crisp developer resume preview in one place.</p>
            </div>
          </div>
          <form onSubmit={handleResumeSubmit} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <input value={developerName} onChange={(e) => setDeveloperName(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0" placeholder="Your name" />
              <input value={role} onChange={(e) => setRole(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0" placeholder="Role / Goal" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0" placeholder="Phone number" />
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0" placeholder="Address" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows={2} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0" placeholder="Skills (comma separated)" />
              <textarea value={tools} onChange={(e) => setTools(e.target.value)} rows={2} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0" placeholder="Tools (GitHub, Figma, Postman)" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <textarea value={frameworks} onChange={(e) => setFrameworks(e.target.value)} rows={2} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0" placeholder="Frameworks (React, Tailwind, Node.js)" />
              <textarea value={projects} onChange={(e) => setProjects(e.target.value)} rows={3} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0" placeholder="Projects (optional)" />
            </div>
            <textarea value={focus} onChange={(e) => setFocus(e.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white outline-none ring-0" placeholder="Write your developer summary" />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAiPolish}
                disabled={isPolishing}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-100 shadow-[0_16px_30px_rgba(56,189,248,0.12)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPolishing ? 'Polishing...' : 'AI Polish Resume'}
              </button>
              <button
                type="submit"
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-slate-950 shadow-[0_16px_30px_rgba(192,132,252,0.25)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-3.5 w-3.5" />
                {isGeneratingPdf ? 'Preparing PDF...' : 'Generate Resume PDF'}
              </button>
            </div>
            <p className="text-xs text-cyan-100">{aiMessage}</p>
            {resumeReady && <p className="text-xs text-emerald-200">Resume PDF generated successfully. It opens for viewing and downloads automatically.</p>}
            <div className="rounded-3xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm text-violet-100">
              <p className="text-[10px] uppercase tracking-[0.35em] text-violet-200">AI Professional Resume Preview</p>
              <h3 className="mt-2 text-xl font-black text-white">{developerName || 'Your Name'}</h3>
              <p className="text-xs text-violet-100">{aiResume?.headline || role || 'Java + DSA Developer'}</p>
              <p className="mt-1 text-xs text-violet-100">Phone: {phone || 'Not provided'} · Address: {address || 'Not provided'}</p>
              <p className="mt-3 text-sm text-violet-50">{aiResume?.summary || focus}</p>
              <p className="mt-3 text-sm text-violet-50 font-semibold">Skills: {mergeResumeSkills(aiResume?.skills || skills, aiResume?.tools || tools, aiResume?.frameworks || frameworks).join(', ') || 'No skills listed.'}</p>
              <p className="mt-2 text-sm text-violet-50 font-semibold">Tools: {normalizeList(aiResume?.tools || tools).join(', ') || 'No tools listed.'}</p>
              <p className="mt-2 text-sm text-violet-50 font-semibold">Frameworks: {normalizeList(aiResume?.frameworks || frameworks).join(', ') || 'No frameworks listed.'}</p>
              <p className="mt-2 text-sm text-violet-50 font-semibold">Projects: {normalizeList(aiResume?.projects || projects).join(' • ') || 'No project details provided.'}</p>
              <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-violet-50">
                {(aiResume?.highlights || ['Strong problem-solving mindset', 'Modern frontend/backend development experience', 'Ready for internships and interviews']).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </form>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[30px] border border-white/10 bg-slate-900/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.4)]">
          <div className="mb-4 flex items-center gap-3">
            <UserCircle className="h-5 w-5 text-amber-300" />
            <div>
              <h2 className="text-xl font-black text-white">Developer Avatar & Custom Profile</h2>
              <p className="text-xs text-slate-300">Pick your vibe, update your profile card, and show your rank.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
              <div className={`flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${avatarStyles[avatarTone]} text-3xl font-black shadow-[0_18px_30px_rgba(56,189,248,0.12)]`}>
                {developerName.slice(0, 2).toUpperCase() || 'DV'}
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-200">
                <p className="font-semibold text-white">{developerName || 'Developer'}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-100">{rankLabel}</p>
                <p className="text-xs text-slate-300">Focus: {focus || 'Keep iterating and learning.'}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <label className="block text-xs uppercase tracking-[0.25em] text-slate-300">Avatar tone</label>
              <div className="grid gap-2 md:grid-cols-3">
                {Object.keys(avatarStyles).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setAvatarTone(tone)}
                    className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold capitalize transition-all ${avatarTone === tone ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100' : 'border-white/10 bg-slate-950/70 text-slate-200 hover:border-cyan-400/40'}`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
              <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs text-amber-100">
                <p className="font-black text-white">Profile tips</p>
                <ul className="mt-2 space-y-1 list-disc pl-4 text-amber-50">
                  <li>Use your rank badge in interviews and project presentations.</li>
                  <li>Keep your notes, profile, and resume in one place.</li>
                  <li>Update your avatar tone whenever you refresh your developer identity.</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[30px] border border-white/10 bg-slate-900/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.4)]">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-cyan-200" />
            <div>
              <h2 className="text-xl font-black text-white">Practice Highlights</h2>
              <p className="text-xs text-slate-300">A small growth dashboard for your coding and learning streak.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              ['Quiz Accuracy', `${score}/${quizQuestions.length}`],
              ['Current Rank', rankLabel],
              ['Resume Ready', 'Yes'],
              ['Compiler Access', 'Live'],
            ].map(([name, value]) => (
              <div key={name} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                <span>{name}</span>
                <span className="font-black text-white">{value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
