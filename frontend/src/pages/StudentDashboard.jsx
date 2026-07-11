import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    streakDays: 0,
    averageScore: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);

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
        
        const totalCourses = coursesData.data.length;
        const completedCourses = coursesData.data.filter(c => c.status === 'completed').length;
        const totalHours = coursesData.data.reduce((sum, c) => sum + (c.course?.totalDuration || 0), 0) / 60;
        
        setStats(prev => ({ ...prev, totalCourses, completedCourses, totalHours: Math.round(totalHours) }));
      }
      
      // Fetch continue watching
      const continueResponse = await fetch('/api/lms/continue-watching', { headers });
      const continueData = await continueResponse.json();
      if (continueData.success) setContinueWatching(continueData.data);
      
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
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Learning Dashboard</h2>
          <p className="text-gray-500 mb-6">Log in to track your enrolled courses and progress.</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
            <LogIn className="w-5 h-5 mr-2" /> Log In
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Not enrolled yet? <Link to="/lms" className="text-blue-600 font-medium hover:underline">Browse Courses</Link>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Learning Dashboard</h1>
              <p className="text-blue-200">
                Track your progress and continue your learning journey
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="font-bold text-lg">👶</span>
                </div>
                <div>
                  <div className="font-semibold">{user?.name || 'Learner'}</div>
                  <div className="text-sm text-blue-200">{user?.role === 'admin' ? 'Administrator' : 'Early Learner'}</div>
                </div>
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
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalCourses}
                </div>
                <div className="text-sm text-gray-600">Enrolled Courses</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600 font-medium">
              +2 this month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completedCourses}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600 font-medium">
              {Math.round((stats.completedCourses / stats.totalCourses) * 100) || 0}% completion rate
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalHours}
                </div>
                <div className="text-sm text-gray-600">Learning Hours</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600 font-medium">
              +5h this week
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.streakDays}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600 font-medium">
              Keep it up! 🔥
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Continue Watching */}
          <div className="lg:col-span-2">
            {/* Continue Watching */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Continue Watching
                </h2>
                <Link
                  to="/lms"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {continueWatching.length > 0 ? (
                <div className="space-y-4">
                  {continueWatching.slice(0, 3).map((item) => (
                    <Link
                      key={item._id}
                      to={`/lms/learn/${item.course._id}`}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mr-4 group-hover:bg-blue-50 transition-colors">
                        <PlayCircle className="w-8 h-8 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.lesson?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.course?.title}
                        </p>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Progress: {item.percentage || 0}%</span>
                          <span className="mx-2">•</span>
                          <span>Last watched: {new Date(item.lastWatchedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(item.percentage || 0)}`}
                            style={{ width: `${item.percentage || 0}%` }}
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
                  <p className="text-gray-600 mb-4">
                    Start learning by enrolling in a course
                  </p>
                  <Link
                    to="/lms"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Your Courses
              </h2>
              
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                          <img
                            src={enrollment.course?.imageUrl || '/api/placeholder/64/64'}
                            alt={enrollment.course?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {enrollment.course?.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              enrollment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {enrollment.status === 'completed' ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                <span>{enrollment.course?.totalLessons || 0} lessons</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{enrollment.course?.totalDuration || 0} min</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-700">
                                {enrollment.progress || 0}%
                              </span>
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${getProgressColor(enrollment.progress || 0)}`}
                                  style={{ width: `${enrollment.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <Link
                              to={`/lms/learn/${enrollment.course?._id}`}
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Continue Learning
                            </Link>
                            <Link
                              to={`/lms/courses/${enrollment.course?._id}`}
                              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              View Details
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
                  <p className="text-gray-600 mb-4">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Link
                    to="/lms"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="space-y-8">
            {/* Learning Goals */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Learning Goals
              </h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Complete 5 courses this month
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress: 2/5</span>
                    <span className="font-medium text-blue-600">40%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/5"></div>
                  </div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Maintain 7-day learning streak
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current streak: 7 days</span>
                    <span className="font-medium text-green-600">🔥</span>
                  </div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Achieve 90% average score
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current average: 85%</span>
                    <span className="font-medium text-purple-600">85%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-85/100"></div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                <Target className="w-4 h-4 inline mr-2" />
                Set New Goal
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      activity.type === 'lesson_completed'
                        ? 'bg-green-100'
                        : activity.type === 'note_added'
                        ? 'bg-blue-100'
                        : 'bg-purple-100'
                    }`}>
                      {activity.type === 'lesson_completed' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {activity.type === 'note_added' && (
                        <FileText className="w-5 h-5 text-blue-600" />
                      )}
                      {activity.type === 'course_enrolled' && (
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {activity.course}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-2 text-blue-600 hover:text-blue-700 font-medium">
                View All Activity
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Link
                  to="/lms"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PlayCircle className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium">Browse New Courses</span>
                </Link>
                
                <Link
                  to="/lms/dashboard/certificates"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Award className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium">View Certificates</span>
                </Link>
                
                <Link
                  to="/lms/dashboard/resources"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="font-medium">Download Resources</span>
                </Link>
                
                <Link
                  to="/lms/dashboard/progress"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="font-medium">View Progress Report</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;