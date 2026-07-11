import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  FileText,
  Download,
  MessageSquare,
  Bookmark,
  Share2,
  Menu,
  X,
  Clock,
  Award,
  Star,
  Lock,
  LogIn
} from 'lucide-react';
import VideoPlayer from '../components/lms/VideoPlayer';
import ModuleList from '../components/lms/ModuleList';
import NoteSection from '../components/lms/NoteSection';
import ResourceCard from '../components/lms/ResourceCard';
import { useAuth } from '../context/AuthContext.jsx';

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);
  const [prevLesson, setPrevLesson] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  useEffect(() => {
    if (selectedLesson && modules.length > 0) {
      findAdjacentLessons();
    }
  }, [selectedLesson, modules]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      const headers = {};
      const storedToken = token || localStorage.getItem('token');
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

      const courseResponse = await fetch(`/api/lms/courses/${id}`, { headers });
      const courseData = await courseResponse.json();
      
      if (courseData.success) {
        const courseObj = courseData.data;
        setCourse(courseObj);
        setEnrollment(courseData.data.enrollment);

        const isFree = !Number(courseObj.price) || Number(courseObj.price) <= 0;
        const isAdmin = user && user.role === 'admin';
        const hasEnrollment = !!courseData.data.enrollment;

        // Fetch modules when: enrolled, admin, OR free course (open access)
        if (hasEnrollment || isAdmin || isFree) {
          // Auto-enroll silently for free courses so progress tracking works
          if (isFree && !hasEnrollment && user) {
            try {
              await fetch(`/api/lms/courses/${id}/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedToken}` }
              });
              // Re-fetch to get the new enrollment object
              const refreshRes = await fetch(`/api/lms/courses/${id}`, { headers });
              const refreshData = await refreshRes.json();
              if (refreshData.success) setEnrollment(refreshData.data.enrollment);
            } catch {
              // Swallow — enrollment isn't required to watch free content
            }
          }

          const modulesResponse = await fetch(`/api/lms/courses/${id}/modules`, { headers });
          const modulesData = await modulesResponse.json();
          
          if (modulesData.success) {
            setModules(modulesData.data);
            if (modulesData.data.length > 0 && 
                modulesData.data[0].lessons && 
                modulesData.data[0].lessons.length > 0) {
              setSelectedLesson(modulesData.data[0].lessons[0]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const findAdjacentLessons = () => {
    let found = false;
    let prev = null;
    let next = null;
    
    // Flatten all lessons from all modules
    const allLessons = [];
    modules.forEach(module => {
      if (module.lessons) {
        module.lessons.forEach(lesson => {
          allLessons.push({
            ...lesson,
            moduleId: module._id
          });
        });
      }
    });
    
    // Find current lesson index
    const currentIndex = allLessons.findIndex(lesson => lesson._id === selectedLesson._id);
    
    if (currentIndex > 0) {
      prev = allLessons[currentIndex - 1];
    }
    
    if (currentIndex < allLessons.length - 1) {
      next = allLessons[currentIndex + 1];
    }
    
    setPrevLesson(prev);
    setNextLesson(next);
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setShowNotes(false);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleProgressUpdate = async (progress) => {
    if (!enrollment || !selectedLesson) return;
    
    try {
      // Save progress every 30 seconds or when significant progress is made
      if (progress.currentTime % 30 < 1 || progress.percentage % 10 < 1) {
        const storedToken = token || localStorage.getItem('token');
        await fetch(`/api/lms/lessons/${selectedLesson._id}/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
          body: JSON.stringify({
            currentTime: progress.currentTime,
            duration: progress.duration,
            markCompleted: progress.percentage >= 90
          })
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleVideoEnd = async (endedLessonId) => {
    if (!nextLesson) return;
    
    try {
      const storedToken = token || localStorage.getItem('token');
      // Mark current lesson as completed
      await fetch(`/api/lms/lessons/${endedLessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        }
      });
      
      // Auto-play next lesson if enabled
      if (nextLesson) {
        setSelectedLesson(nextLesson);
        // Find next lesson for the newly selected lesson
        findAdjacentLessons();
      }
    } catch (error) {
      console.error('Error handling video end:', error);
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedLesson || !enrollment) return;
    
    try {
      const storedToken = token || localStorage.getItem('token');
      const response = await fetch(`/api/lms/lessons/${selectedLesson._id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify({
          markCompleted: true,
          currentTime: selectedLesson.videoDuration || 0,
          duration: selectedLesson.videoDuration || 0
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setEnrollment(prev => ({
          ...prev,
          completedLessons: [...(prev.completedLessons || []), selectedLesson._id]
        }));
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      const storedToken = token || localStorage.getItem('token');
      const res = await fetch(`/api/lms/courses/${id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        await fetchCourseData();
      } else {
        alert(data.message || 'Enrollment failed');
      }
    } catch (err) {
      console.error('Enroll error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  const handleDownloadResource = (resource) => {
    // Implement download logic
    console.log('Downloading resource:', resource);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading course content...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">Course not found</div>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Link to="/lms" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Free course — no gate, anyone can watch
  const isFree = !Number(course.price) || Number(course.price) <= 0;

  // Not enrolled AND paid course — show enrollment/login prompt
  if (!enrollment && !isFree && !(user && user.role === 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
          <p className="text-gray-600 mb-2">
            This is a paid course. Purchase it to unlock all video lessons.
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-6">₹{course.price}</p>
          {user ? (
            <Link
              to={`/lms/courses/${id}`}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Go to Course Page to Purchase
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Log In to Purchase
            </Link>
          )}
          <Link to={`/lms/courses/${id}`} className="block mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
            ← Back to Course Details
          </Link>
        </div>
      </div>
    );
  }

  const isLessonCompleted = enrollment?.completedLessons?.includes(selectedLesson?._id);
  const totalLessons = modules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
  const completedLessons = enrollment?.completedLessons?.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/lms/courses/${id}`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {course.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Progress: {progress}%</span>
                  <span className="mx-2">•</span>
                  <span>{completedLessons} of {totalLessons} lessons</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Modules List */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-80 bg-white shadow-xl lg:shadow-none
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300
          overflow-y-auto h-[calc(100vh-80px)]
        `}>
          <div className="p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Your Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Module List */}
            <ModuleList
              modules={modules}
              selectedLesson={selectedLesson}
              onLessonSelect={handleLessonSelect}
              enrollment={enrollment}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Video Player Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              {selectedLesson ? (
                <>
                  <VideoPlayer
                    videoUrl={selectedLesson.videoUrl}
                    title={selectedLesson.title}
                    onProgressUpdate={handleProgressUpdate}
                    onVideoEnd={handleVideoEnd}
                    lessonId={selectedLesson._id}
                    autoPlayNext={true}
                  />
                  
                  {/* Lesson Info and Actions */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div className="mb-4 lg:mb-0">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {selectedLesson.title}
                        </h2>
                        <p className="text-gray-600">
                          {selectedLesson.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setShowNotes(!showNotes)}
                          className={`px-4 py-2 rounded-lg font-semibold flex items-center ${
                            showNotes
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {showNotes ? 'Hide Notes' : 'Show Notes'}
                        </button>
                        
                        <button
                          onClick={handleMarkComplete}
                          className={`px-4 py-2 rounded-lg font-semibold flex items-center ${
                            isLessonCompleted
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {isLessonCompleted ? 'Completed' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                    
                    {/* Lesson Content */}
                    {selectedLesson.content && (
                      <div className="prose max-w-none mt-6">
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a lesson to start learning
                  </h3>
                  <p className="text-gray-600">
                    Choose a lesson from the sidebar to begin watching
                  </p>
                </div>
              )}
            </div>

            {/* Notes Section */}
            {showNotes && selectedLesson && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <NoteSection
                  lessonId={selectedLesson._id}
                  courseId={course._id}
                />
              </div>
            )}

            {/* Resources Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Course Resources
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResourceCard
                    icon={<FileText className="w-4 h-4" />}
                    title="Lesson Notes PDF"
                    type="PDF"
                    size="2.1 MB"
                  />
                  
                  <ResourceCard
                    icon={<FileText className="w-4 h-4" />}
                    title="Practice Worksheets"
                    type="PDF"
                    size="3.4 MB"
                  />
                  
                  <ResourceCard
                    icon={<FileText className="w-4 h-4" />}
                    title="Reference Guide"
                    type="PDF"
                    size="1.8 MB"
                  />
                  
                  <ResourceCard
                    icon={<Download className="w-4 h-4" />}
                    title="Activity Templates"
                    type="ZIP"
                    size="12.5 MB"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {prevLesson ? (
                <button
                  onClick={() => handleLessonSelect(prevLesson)}
                  className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous Lesson
                </button>
              ) : (
                <div></div>
              )}
              
              {nextLesson ? (
                <button
                  onClick={() => handleLessonSelect(nextLesson)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Lesson
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/lms/courses/${id}`)}
                  className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Back to Course Overview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;