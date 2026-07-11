import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Briefcase, CheckCircle2, Code2, GraduationCap, Rocket, Sparkles, Users } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const [careerIndex, setCareerIndex] = useState(0);
  const { scrollY } = useScroll();
  const heroLift = useTransform(scrollY, [0, 260], [0, -16]);
  const heroFloat = useTransform(scrollY, [0, 300], [0, 10]);
  const codeProgress = useTransform(scrollY, [0, 400], [0, 100]);

  const codeSequence = useMemo(() => [
    'public class Appletree {',
    '  public static void main(String[] args) {',
    '    Java java = new Java();',
    '    Cpp cpp = new Cpp();',
    '    java.build(); cpp.solve();',
    '  }',
    '}',
  ], []);

  const courses = [
    {
      name: 'Java Development',
      description: 'Build a strong foundation in Java, OOP, collections, and backend logic with practical assignments focused on real-world application development.',
      points: ['OOP, exception handling, and collections', 'Backend logic with real coding labs', 'Interview-ready Java problem practice'],
      icon: Code2,
      badge: 'Beginner to Advanced'
    },
    {
      name: 'MERN Development',
      description: 'Learn MongoDB, Express, React, and Node.js to create polished full-stack applications from scratch with production-ready workflows.',
      points: ['Frontend + backend integration', 'REST APIs, auth, and database design', 'Portfolio projects for placement readiness'],
      icon: Rocket,
      badge: 'Full Stack Track'
    },
    {
      name: 'C++ Programming',
      description: 'Master problem solving, data structures, and competitive programming with expert-led training that prepares you for coding interviews.',
      points: ['Arrays, stacks, queues, and trees', 'Logic building with time optimization', 'Competitive coding and mock tests'],
      icon: GraduationCap,
      badge: 'Core Concepts'
    },
    {
      name: 'Frontend Development',
      description: 'Create modern user interfaces with HTML, CSS, JavaScript, React, and responsive design using practical project-based learning.',
      points: ['Responsive UI and animation basics', 'React components and state management', 'Portfolio-ready website projects'],
      icon: BookOpen,
      badge: 'UI / UX Focus'
    }
  ];

  const highlights = [
    { title: 'Expert Mentors', text: 'Learn from experienced trainers with real-world industry knowledge.', icon: Users },
    { title: 'Live Projects', text: 'Build practical apps and strengthen your portfolio with each module.', icon: Rocket },
    { title: 'Placement Support', text: 'Get resume help, mock interviews, and career coaching for your next role.', icon: Briefcase },
    { title: 'Flexible Batches', text: 'Choose weekday, weekend, or fast-track classes that fit your schedule.', icon: BookOpen }
  ];

  const careerSteps = ['Student', 'Coder', 'Developer', 'Engineer', 'Tech Lead'];
  const journeyCards = [
    { title: 'Foundation', text: 'Build logic, problem-solving, and coding confidence from day one.', badge: 'Stage 1' },
    { title: 'Build Projects', text: 'Turn concepts into apps, systems, and polished portfolio work.', badge: 'Stage 2' },
    { title: 'Launch Career', text: 'Prepare for placements, interviews, and real-world engineering roles.', badge: 'Stage 3' }
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCareerIndex((prev) => (prev + 1) % careerSteps.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [careerSteps.length]);

  return (
    <div className="home-page overflow-hidden text-slate-800 dark:text-white bg-[#FAF8F5] dark:bg-slate-955 transition-colors duration-300">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="home-hero relative px-4 py-16 overflow-hidden text-white md:px-8 md:py-24"
      >
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
            poster="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80"
          >
            <source src="https://cdn.coverr.co/videos/coverr-coding-on-laptop-1560359230/1080p.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,47,73,0.72),rgba(15,23,42,0.58),rgba(99,102,241,0.45))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_25%),radial-gradient(circle_at_right,_rgba(251,146,60,0.14),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.25, 0.35, 0.25] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[-8%] top-[-10%] h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[-8%] right-[-5%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold border rounded-full border-white/15 bg-white/10 backdrop-blur">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Future-ready Java & C++ academy</span>
            </div>
            <motion.div
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0 0 0)' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.12 }}
              className="overflow-hidden"
            >
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl"
              >
                Master Java & C++ with cinematic, high-impact coding training for tomorrow’s developers.
              </motion.h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="max-w-2xl text-lg text-slate-350"
            >
              Step into a futuristic cyber-learning studio where algorithms, data structures, OOP, competitive coding, and system design come to life through immersive mentorship.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                Start Coding Today <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/programs" className="px-6 py-3 font-semibold text-white transition border rounded-full border-white/20 hover:bg-white/10">
                Explore Academy
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap gap-6 text-sm text-slate-300"
            >
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Live debugging & compilation labs</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Competitive coding & system design practice</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="pt-2 text-sm font-medium uppercase tracking-[0.3em] text-slate-300"
            >
              Scroll to explore
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            style={{ y: heroLift }}
            className="relative rounded-[2rem] border border-orange-100 dark:border-cyan-400/20 bg-white/70 dark:bg-white/10 p-4 shadow-lg dark:shadow-[0_18px_60px_rgba(14,165,233,0.18)] backdrop-blur-xl"
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-16 h-16 rounded-full -top-5 -right-5 bg-cyan-400/25 blur-2xl"
            />
            <motion.div
              animate={{ y: [0, 6, 0], rotate: [0, -1, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-20 h-20 rounded-full -bottom-5 -left-5 bg-orange-400/20 blur-2xl"
            />
            <motion.div
              style={{ y: heroFloat }}
              className="relative overflow-hidden rounded-[1.4rem] border border-orange-100/60 dark:border-white/10 bg-white dark:bg-slate-950/80 p-2 shadow-2xl"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-[280px] w-full rounded-[1.1rem] object-cover md:h-[340px]"
                poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
              >
                <source src="https://cdn.coverr.co/videos/coverr-coding-on-laptop-1560359230/1080p.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 rounded-[1.1rem] border border-orange-100/40 dark:border-cyan-400/10" />
              <div className="absolute left-4 top-4 rounded-full border border-orange-200 bg-white/95 dark:border-cyan-400/30 dark:bg-slate-950/70 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-200 shadow-sm">Cinematic Demo</div>
              <div className="absolute p-3 text-sm border shadow-md bottom-4 left-4 right-4 rounded-2xl border-orange-100 dark:border-white/10 bg-white/95 dark:bg-slate-955/80 text-slate-800 dark:text-slate-100 backdrop-blur-md">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-200">
                  <span>Java • C++</span>
                  <span>4K HDR</span>
                </div>
                <div className="mt-1 text-base font-semibold text-slate-800 dark:text-white">Build the future with immersive coding visuals.</div>
              </div>
            </motion.div>
            <div className="mt-4 rounded-[1.2rem] border border-orange-100 dark:border-transparent bg-white/95 dark:bg-slate-955/70 p-4 shadow-sm dark:shadow-none">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-300">Featured Tracks</p>
              <div className="w-20 h-1 mt-2 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-orange-400" />
              <div className="mt-6 space-y-4">
                {courses.slice(0, 3).map((course) => {
                  const Icon = course.icon;
                  return (
                    <div key={course.name} className="rounded-2xl border border-orange-100 dark:border-cyan-400/10 bg-white dark:bg-slate-900/95 p-4 shadow-sm dark:shadow-[0_10px_30px_rgba(15,23,42,0.45)] transition hover:border-brandCoral/30 dark:hover:border-cyan-400/30 hover:bg-orange-50/10 dark:hover:bg-slate-800/95">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-brandCoral/10 text-brandCoral dark:bg-cyan-400/15 dark:text-cyan-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-white">{course.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{course.badge}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 mt-6 text-sm border shadow-inner rounded-2xl border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-100 shadow-emerald-400/5">
                <div className="font-semibold">Master Java & C++ • Build the Future</div>
                <div className="mt-1">Premium mentor sessions, live coding, and futuristic learning experiences.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 2: Text reveal and compiler progress */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 md:px-8"
      >
        <div className="mx-auto mb-10 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24, clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)' }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="min-w-0 rounded-[2rem] border border-orange-100 dark:border-cyan-400/15 bg-white dark:bg-slate-900/95 p-5 shadow-md shadow-orange-100/20 dark:shadow-[0_18px_45px_rgba(8,47,73,0.35)] sm:p-6"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-300 sm:text-sm">Text reveal</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-805 dark:text-white sm:text-3xl lg:text-4xl">From code to career, every lesson is revealed through cinematic storytelling.</h2>
            <p className="max-w-xl mt-4 text-sm text-slate-600 dark:text-slate-300 sm:text-base">Smooth transitions, layered gradients, and a subtle spotlight create a premium learning canvas for Java, C++, and MERN tracks.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="min-w-0 rounded-[2rem] border border-orange-100 dark:border-cyan-400/15 bg-white dark:bg-slate-900/95 p-5 shadow-md shadow-orange-100/20 dark:shadow-[0_18px_45px_rgba(8,47,73,0.35)] sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-200 sm:text-xs">
              <span>Scroll-driven compile</span>
              <span>{Math.round(codeProgress.get())}%</span>
            </div>
            <div className="h-2 mt-4 rounded-full bg-slate-100 dark:bg-slate-800">
              <motion.div style={{ width: codeProgress }} className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400" />
            </div>
            <pre className="mt-5 max-w-full overflow-x-auto rounded-2xl border border-orange-100 dark:border-cyan-400/10 bg-slate-50 dark:bg-slate-950/90 p-3 text-[11px] leading-relaxed text-slate-800 dark:text-cyan-100 shadow-inner sm:p-4 sm:text-sm">
              {codeSequence.map((line, index) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="font-mono break-words whitespace-pre-wrap"
                >
                  {line}
                </motion.div>
              ))}
            </pre>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Floating tech universe */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 md:px-8"
      >
        <div className="mx-auto mb-10 grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-orange-100 dark:border-cyan-400/15 bg-white dark:bg-slate-900/95 p-6 shadow-md shadow-orange-100/20 dark:shadow-[0_18px_45px_rgba(8,47,73,0.35)]"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-300">3D Floating Tech Universe</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-850 dark:text-white sm:text-4xl">A futuristic learning universe where every concept feels alive.</h2>
            <p className="max-w-xl mt-4 text-slate-600 dark:text-slate-300">The hero panel now blends depth, motion, and layered visuals so the academy feels immersive on desktop and smooth on mobile.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[2rem] border border-orange-100 dark:border-cyan-400/15 bg-white dark:bg-slate-900/95 p-6 shadow-md shadow-orange-100/20 dark:shadow-[0_18px_45px_rgba(8,47,73,0.35)]"
          >
            <div className="relative h-[260px] overflow-hidden rounded-[1.5rem] border border-orange-100 dark:border-cyan-400/10 bg-slate-50 dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),transparent_25%),linear-gradient(135deg,#020617,rgba(15,23,42,0.95),rgba(17,24,39,0.98))]">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-6 top-6 h-16 w-16 rounded-2xl border border-emerald-250 bg-emerald-500/10 text-emerald-600 dark:border-cyan-400/30 dark:bg-cyan-400/10 shadow-md dark:shadow-[0_18px_30px_rgba(56,189,248,0.18)] flex items-center justify-center font-bold"
              >
                JAVA
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-8 top-10 h-20 w-20 rounded-full border border-indigo-250 bg-indigo-500/10 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 shadow-md dark:shadow-[0_18px_36px_rgba(129,140,248,0.18)] flex items-center justify-center font-bold"
              >
                C++
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-8 left-1/2 h-24 w-24 -translate-x-1/2 rounded-[2rem] border border-rose-250 bg-rose-500/10 text-rose-600 dark:border-emerald-400/30 dark:bg-emerald-400/10 shadow-md dark:shadow-[0_18px_36px_rgba(16,185,129,0.18)] flex items-center justify-center font-bold"
              >
                MERN
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-x-0 bottom-0 p-4 mx-4 mb-4 text-sm border shadow-md rounded-2xl border-orange-100 dark:border-white/10 bg-white/95 dark:bg-slate-950/70 text-slate-800 dark:text-slate-100 backdrop-blur-md"
              >
                <div className="text-[11px] uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-200">Live Academy</div>
                <div className="mt-1 text-base font-semibold text-slate-800 dark:text-white">Java • C++ • MERN • Frontend</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Section 4: Journey chapters */}
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-orange-100 dark:border-cyan-400/10 bg-white dark:bg-slate-900/90 p-6 shadow-md shadow-orange-100/20 dark:shadow-[0_18px_45px_rgba(8,47,73,0.35)] md:p-8">
          <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-300">Horizontal Storytelling</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-850 dark:text-white sm:text-4xl">Your journey unfolds in three chapters.</h2>
            </div>
            <p className="max-w-xl text-slate-600 dark:text-slate-300">Swipe on mobile or scroll horizontally on larger screens to experience the full career narrative.</p>
          </div>
          <div className="pb-2 overflow-x-auto scroll-smooth">
            <div className="flex gap-6 min-w-max">
              {journeyCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="w-[88vw] max-w-[320px] snap-start rounded-[1.6rem] border border-orange-100 dark:border-cyan-400/10 bg-slate-50 dark:bg-slate-955/85 p-6 shadow-sm dark:shadow-[0_16px_40px_rgba(2,6,23,0.45)] sm:w-[320px] lg:w-[360px]"
                >
                  <div className="text-xs uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-200">{card.badge}</div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-800 dark:text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-305">{card.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Morphing Career Journey */}
        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-8 rounded-[2rem] border border-orange-100 dark:border-cyan-400/10 bg-white dark:bg-slate-900/95 p-4 shadow-md shadow-orange-100/20 dark:shadow-[0_18px_45px_rgba(8,47,73,0.35)] sm:p-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-300 sm:text-sm">Morphing Career Journey</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-850 dark:text-white sm:text-3xl lg:text-4xl">From a student to a future tech lead.</h2>
            <p className="max-w-xl mt-4 text-sm text-slate-600 dark:text-slate-300 sm:text-base">The label shifts smoothly through each milestone so the growth story feels alive and cinematic.</p>
          </div>
          <div className="rounded-[1.6rem] border border-orange-100 dark:border-cyan-400/10 bg-slate-50 dark:bg-slate-950/90 p-4 sm:p-6">
            <div className="text-[10px] uppercase tracking-[0.35em] text-brandCoral dark:text-cyan-200 sm:text-xs">Current Stage</div>
            <div className="mt-4 flex min-h-[72px] items-center text-3xl font-black text-slate-800 dark:text-white sm:min-h-[88px] sm:text-4xl lg:text-5xl xl:text-6xl">
              <AnimatePresence mode="wait">
                <motion.span
                  key={careerSteps[careerIndex]}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35 }}
                >
                  {careerSteps[careerIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap gap-2 mt-5 text-xs text-slate-600 dark:text-slate-205 sm:text-sm">
              {careerSteps.map((step, index) => (
                <span key={step} className={`rounded-full border px-3 py-1 font-semibold ${index === careerIndex ? 'border-brandCoral bg-brandCoral/10 text-brandCoral dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-100' : 'border-slate-200 bg-white text-slate-500 dark:border-slate-705 dark:bg-slate-900 dark:text-slate-300'}`}>
                  {step}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-400 sm:text-xs">
              <span>Student</span>
              <span className="text-brandCoral dark:text-cyan-300">↓</span>
              <span>Coder</span>
              <span className="text-brandCoral dark:text-cyan-300">↓</span>
              <span>Developer</span>
              <span className="text-brandCoral dark:text-cyan-300">↓</span>
              <span>Engineer</span>
              <span className="text-brandCoral dark:text-cyan-300">↓</span>
              <span>Tech Lead</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 6: Our Courses Grid */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brandCoral dark:text-cyan-300">Our Courses</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-850 dark:text-slate-100 sm:text-4xl">Choose a learning path that fits your career goals.</h2>
            <p className="max-w-2xl mt-4 text-slate-600 dark:text-slate-300">Each track combines deep concepts, real projects, and mentor guidance so you can learn faster and apply skills with confidence.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {courses.map((course, index) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-3xl border border-orange-100 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-6 shadow-md dark:shadow-[0_18px_40px_rgba(2,6,23,0.55)] transition duration-300 hover:-translate-y-1 hover:border-brandCoral/30 dark:hover:border-cyan-400/30 hover:bg-orange-50/5 dark:hover:bg-slate-800/95"
                >
                  <div className="inline-flex p-3 rounded-2xl bg-brandCoral/10 text-brandCoral dark:bg-cyan-400/10 dark:text-cyan-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-850 dark:text-white">{course.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{course.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-200">
                    {course.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brandCoral dark:text-emerald-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-605 dark:text-slate-200">
                    {course.badge}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Section 7: Why Appletree */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 border-y border-orange-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/90 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brandCoral dark:text-cyan-300">Why Appletree</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-855 dark:text-slate-100 sm:text-4xl">Training that balances strong concepts with practical growth.</h2>
            <p className="max-w-2xl mt-4 text-slate-600 dark:text-slate-300">From mentor support to project-based practice, every module is designed to help learners become confident, job-ready developers.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-2xl border border-orange-100 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-6 shadow-md dark:shadow-[0_14px_30px_rgba(2,6,23,0.45)] transition hover:border-brandCoral/30 dark:hover:border-cyan-400/30 hover:bg-orange-50/5 dark:hover:bg-slate-800/95"
                >
                  <div className="p-3 inline-flex rounded-full bg-brandCoral/10 text-brandCoral dark:bg-cyan-400/10 dark:text-cyan-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Section 8: Ready to begin banner */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 md:px-8"
      >
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 text-white shadow-xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Ready to begin</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Start your coding journey with Appletree today.</h2>
              <p className="mt-3 text-lg text-indigo-50">Join a learning community that makes complex topics simple, practical, and career-focused.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-indigo-700 transition bg-white rounded-full hover:bg-indigo-50">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
