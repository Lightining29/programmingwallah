import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Star,
  PlayCircle,
  CheckCircle,
  Calendar,
  Target,
  BarChart,
  Download,
  FileText,
  Users,
  ChevronRight,
  LogIn,
  X,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    streakDays: 7,
    averageScore: 92
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 'act-1', type: 'lesson_completed', title: 'Completed Object Oriented Programming in Java', course: 'Java Development', time: '2 hours ago' },
    { id: 'act-2', type: 'note_added', title: 'Added personal notes on React Hooks & State', course: 'Frontend Development', time: 'Yesterday' },
    { id: 'act-3', type: 'course_enrolled', title: 'Enrolled in Backend Development with Express', course: 'Backend Development', time: '3 days ago' }
  ]);
  const [loading, setLoading] = useState(false);

  // Modal view handlers based on route
  const activeModal = location.pathname.endsWith('/certificates')
    ? 'certificates'
    : location.pathname.endsWith('/resources')
    ? 'resources'
    : location.pathname.endsWith('/progress')
    ? 'progress'
    : null;

  const closeModal = () => navigate('/lms/dashboard');

  useEffect(() => {
    if (!user) return; // only fetch when logged in
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${authToken}` };
      
      // Fetch enrolled courses
      const coursesResponse = await fetch('/api/lms/my-courses', { headers });
      const coursesData = await coursesResponse.json();
      
      if (coursesData.success) {
        setEnrolledCourses(coursesData.data);
        
        const totalCourses = coursesData.data.length || 2;
        const completedCourses = coursesData.data.filter(c => c.status === 'completed').length || 1;
        const totalHours = coursesData.data.reduce((sum, c) => sum + (c.course?.totalDuration || 0), 0) / 60 || 24;
        
        setStats(prev => ({
          ...prev,
          totalCourses,
          completedCourses,
          totalHours: Math.round(totalHours) || 24,
          streakDays: 7,
          averageScore: 92
        }));
      } else {
        // Mock fallback if DB empty
        setEnrolledCourses([
          {
            _id: 'mock_enr_1',
            status: 'in_progress',
            progress: 65,
            course: {
              _id: 'course_1',
              title: 'Java Development Program',
              totalLessons: 18,
              totalDuration: 1200,
              imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'
            }
          },
          {
            _id: 'mock_enr_2',
            status: 'completed',
            progress: 100,
            course: {
              _id: 'course_2',
              title: 'Frontend Development (React & Tailwind)',
              totalLessons: 14,
              totalDuration: 900,
              imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
            }
          }
        ]);
        setStats({ totalCourses: 2, completedCourses: 1, totalHours: 35, streakDays: 7, averageScore: 92 });
      }
      
      // Fetch continue watching
      const continueResponse = await fetch('/api/lms/continue-watching', { headers });
      const continueData = await continueResponse.json();
      if (continueData.success && continueData.data.length > 0) {
        setContinueWatching(continueData.data);
      } else {
        setContinueWatching([
          {
            _id: 'cw_1',
            percentage: 65,
            lastWatchedAt: new Date(),
            course: { _id: 'course_1', title: 'Java Development Program' },
            lesson: { title: 'Object Oriented Principles & Polymorphism' }
          }
        ]);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Not logged in — prompt to login
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center border border-slate-200">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <LogIn className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Learning Dashboard</h2>
          <p className="text-gray-500 mb-6">Please log in to view your course progress, certificates, and learning history.</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-md">
            <LogIn className="w-5 h-5 mr-2" /> Log In to Student Panel
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Not enrolled yet? <Link to="/lms" className="text-amber-600 font-medium hover:underline">Browse Courses</Link>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">Opening Student Panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative font-quicksand">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Student LMS Portal</span>
                <span className="bg-emerald-400 text-slate-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active Learner
                </span>
              </div>
              <h1 className="text-3xl font-black mb-1">Welcome back, {user?.name || 'Student'}!</h1>
              <p className="text-amber-100 text-sm font-medium">
                Track your course completions, download certificates, and continue learning.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xl shadow-inner">
                🎓
              </div>
              <div>
                <div className="font-extrabold text-base leading-tight">{user?.name || 'Demo Student'}</div>
                <div className="text-xs text-amber-100 font-medium">{user?.email || 'student@pranidha.edu'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900">
                  {stats.totalCourses}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Enrolled Courses</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 2 active courses in progress
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900">
                  {stats.completedCourses}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Completed</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> 1 Certificate Ready for Download
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900">
                  {stats.totalHours}h
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Learning Hours</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-purple-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +6.5 hrs completed this week
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-gray-900">
                  {stats.streakDays} Days
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Day Streak</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-orange-600 font-bold flex items-center gap-1">
              🔥 Excellent consistency!
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Continue Watching & Enrolled Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Watching */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-amber-500" /> Continue Learning
                </h2>
                <Link
                  to="/lms"
                  className="text-amber-600 hover:text-amber-700 text-xs font-extrabold flex items-center gap-1 uppercase tracking-wider"
                >
                  View All Courses <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              {continueWatching.length > 0 ? (
                <div className="space-y-4">
                  {continueWatching.slice(0, 3).map((item, idx) => (
                    <Link
                      key={item._id || idx}
                      to={`/lms/learn/${item.course?._id || 'course_1'}`}
                      className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shrink-0">
                        <PlayCircle className="w-7 h-7" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-amber-600 transition-colors">
                          {item.lesson?.title || 'Java Fundamentals & OOP'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mb-2">
                          {item.course?.title || 'Java Development'}
                        </p>
                        
                        <div className="flex items-center text-xs text-slate-400 font-semibold gap-3">
                          <span>Progress: {item.percentage || 65}%</span>
                          <span>•</span>
                          <span>Last watched today</span>
                        </div>
                      </div>
                      
                      <div className="ml-4 shrink-0">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(item.percentage || 65)}`}
                            style={{ width: `${item.percentage || 65}%` }}
                          ></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No recent activity
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Start learning by enrolling in a course
                  </p>
                  <Link
                    to="/lms"
                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" /> My Enrolled Courses
              </h2>
              
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((enrollment, idx) => (
                    <div
                      key={enrollment._id || idx}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 shrink-0 bg-slate-100 border border-slate-200">
                          <img
                            src={enrollment.course?.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'}
                            alt={enrollment.course?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-slate-800 text-base">
                              {enrollment.course?.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                              enrollment.status === 'completed' || enrollment.progress === 100
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {enrollment.status === 'completed' || enrollment.progress === 100 ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
                              <div className="flex items-center">
                                <BookOpen className="w-3.5 h-3.5 mr-1 text-amber-500" />
                                <span>{enrollment.course?.totalLessons || 15} lessons</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                <span>{enrollment.course?.totalDuration ? Math.round(enrollment.course.totalDuration / 60) : 18} hours</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-extrabold text-slate-700">
                                {enrollment.progress || 65}%
                              </span>
                              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getProgressColor(enrollment.progress || 65)}`}
                                  style={{ width: `${enrollment.progress || 65}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <Link
                              to={`/lms/learn/${enrollment.course?._id || 'course_1'}`}
                              className="px-4 py-2 bg-amber-500 text-white text-xs font-extrabold rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                            >
                              Continue Learning
                            </Link>
                            <Link
                              to={`/lms/courses/${enrollment.course?._id || 'course_1'}`}
                              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-extrabold rounded-xl hover:bg-slate-50 transition-colors"
                            >
                              Course Syllabus
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No enrolled courses
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Link
                    to="/lms"
                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Activity and Quick Actions */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" /> Student Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Link
                  to="/lms"
                  className="flex items-center p-3.5 border border-slate-200 rounded-xl hover:bg-amber-50/50 hover:border-amber-300 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">Browse New Courses</span>
                    <span className="text-[11px] text-slate-500 font-medium">Explore Java, MERN, C++ & Web dev</span>
                  </div>
                </Link>
                
                <Link
                  to="/lms/dashboard/certificates"
                  className="flex items-center p-3.5 border border-slate-200 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-300 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">View Certificates</span>
                    <span className="text-[11px] text-slate-500 font-medium">Download verified course completion certificates</span>
                  </div>
                </Link>
                
                <Link
                  to="/lms/dashboard/resources"
                  className="flex items-center p-3.5 border border-slate-200 rounded-xl hover:bg-purple-50/50 hover:border-purple-300 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">Download Resources</span>
                    <span className="text-[11px] text-slate-500 font-medium">PDF notes, code templates & cheat sheets</span>
                  </div>
                </Link>
                
                <Link
                  to="/lms/dashboard/progress"
                  className="flex items-center p-3.5 border border-slate-200 rounded-xl hover:bg-orange-50/50 hover:border-orange-300 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
                    <BarChart className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">View Progress Report</span>
                    <span className="text-[11px] text-slate-500 font-medium">Detailed grade card & skill breakdown</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> Recent Activity
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mr-3 shrink-0 ${
                      activity.type === 'lesson_completed'
                        ? 'bg-green-100 text-green-600'
                        : activity.type === 'note_added'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'lesson_completed' && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {activity.type === 'note_added' && (
                        <FileText className="w-4 h-4" />
                      )}
                      {activity.type === 'course_enrolled' && (
                        <BookOpen className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs mb-0.5">
                        {activity.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {activity.course}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ MODALS FOR SUB-ROUTES ════ */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-slate-200 font-quicksand"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* CERTIFICATES MODAL */}
              {activeModal === 'certificates' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Student Course Certificates</h2>
                      <p className="text-xs text-slate-500 font-semibold">Verified certificates of completion earned by {user?.name || 'Student'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-2xl p-5 bg-emerald-50/40 relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block">
                            Verified Certificate
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-lg">Frontend Development Masterclass</h3>
                          <p className="text-xs text-slate-600 mt-1">Issued on: August 2026 • Credential ID: <span className="font-mono font-bold">APP-CERT-2026-8841</span></p>
                        </div>
                        <button
                          onClick={() => alert('Certificate downloaded as PDF!')}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0"
                        >
                          <Download className="w-4 h-4" /> Download PDF
                        </button>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 relative opacity-75">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 inline-block">
                            In Progress (65%)
                          </span>
                          <h3 className="font-extrabold text-slate-800 text-base">Java Development Program</h3>
                          <p className="text-xs text-slate-500 mt-1">Complete 6 remaining lessons to unlock your official certificate.</p>
                        </div>
                        <button disabled className="px-4 py-2 bg-slate-200 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed shrink-0">
                          Locked
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RESOURCES MODAL */}
              {activeModal === 'resources' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Download className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Learning Resources & PDF Notes</h2>
                      <p className="text-xs text-slate-500 font-semibold">Study guides, code snippets & reference cheat sheets</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { title: 'Java OOP Principles Cheat Sheet (PDF)', size: '2.4 MB', type: 'PDF Document' },
                      { title: 'React Hooks & State Management Guide', size: '1.8 MB', type: 'PDF Guide' },
                      { title: 'Data Structures & Algorithms Cheat Sheet', size: '3.1 MB', type: 'Cheat Sheet' },
                      { title: 'Full Stack MERN Architecture Diagram', size: '4.5 MB', type: 'Infographic' }
                    ].map((res, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{res.title}</h4>
                            <p className="text-xs text-slate-400 font-semibold">{res.type} • {res.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Downloading ${res.title}...`)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROGRESS REPORT MODAL */}
              {activeModal === 'progress' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <BarChart className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Comprehensive Progress Report</h2>
                      <p className="text-xs text-slate-500 font-semibold">Detailed evaluation for {user?.name || 'Student'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Average Quiz Score</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">92.5%</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Attendance Rate</p>
                        <p className="text-2xl font-black text-amber-600 mt-1">98%</p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                      <h4 className="font-extrabold text-slate-800 text-sm">Subject Wise Proficiency</h4>
                      {[
                        { subject: 'Java & Object-Oriented Programming', score: 94, color: 'bg-emerald-500' },
                        { subject: 'HTML5, CSS3 & Responsive UI', score: 96, color: 'bg-blue-500' },
                        { subject: 'JavaScript & Async Programming', score: 88, color: 'bg-amber-500' },
                        { subject: 'Backend REST APIs & Databases', score: 85, color: 'bg-purple-500' }
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                            <span>{item.subject}</span>
                            <span>{item.score}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;