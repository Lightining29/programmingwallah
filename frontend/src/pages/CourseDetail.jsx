import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlayCircle,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  Download,
  FileText,
  CheckCircle,
  Bookmark,
  Share2,
  Menu,
  X,
  Video,
  MessageSquare,
  BarChart,
  LogIn,
  CreditCard,
  ShieldCheck,
  Zap
} from 'lucide-react';
import VideoPlayer from '../components/lms/VideoPlayer';
import ModuleList from '../components/lms/ModuleList';
import InstructorCard from '../components/lms/InstructorCard';
import ResourceCard from '../components/lms/ResourceCard';
import { useAuth } from '../context/AuthContext.jsx';

// Load Razorpay script dynamically
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [paymentStep, setPaymentStep] = useState('idle'); // idle | creating | checkout | verifying | done
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const authToken = token || localStorage.getItem('token');
      const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};

      const courseResponse = await fetch(`/api/lms/courses/${id}`, { headers });
      const courseData = await courseResponse.json();
      
      if (courseData.success) {
        setCourse(courseData.data);
        setEnrollment(courseData.data.enrollment);
        
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
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const authToken = token || localStorage.getItem('token');

    // ── FREE COURSE ── direct enroll, no payment
    if (isFree) {
      setEnrolling(true);
      try {
        const res = await fetch(`/api/lms/courses/${id}/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        if (data.success) {
          setEnrollment(data.data);
          navigate(`/lms/learn/${id}`);
        } else {
          alert(data.message || 'Enrollment failed');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong. Please try again.');
      } finally {
        setEnrolling(false);
      }
      return;
    }

    // ── PAID COURSE ── Razorpay checkout
    setPaymentStep('creating');
    try {
      // Step 1 — check if Razorpay is enabled
      const configRes = await fetch('/api/razorpay/config');
      const config = await configRes.json();

      // Step 2 — create order on backend
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ courseId: id, courseTitle: course.title, amount: coursePrice })
      });
      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert(orderData.message || 'Could not initiate payment');
        setPaymentStep('idle');
        return;
      }

      // ── MOCK MODE (no Razorpay keys) ── simulate payment with a confirm dialog
      if (orderData.mode === 'mock' || !config.enabled) {
        setPaymentStep('checkout');
        const confirmed = window.confirm(
          `[Dev Mode — No Razorpay Keys]\n\nSimulate payment of ₹${coursePrice} for "${course.title}"?\n\nClick OK to complete enrollment.`
        );
        if (!confirmed) { setPaymentStep('idle'); return; }

        setPaymentStep('verifying');
        // Enroll directly since no real payment to verify
        const enrollRes = await fetch(`/api/lms/courses/${id}/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        });
        const enrollData = await enrollRes.json();
        if (enrollData.success) {
          setEnrollment(enrollData.data);
          setPaymentStep('done');
          navigate(`/lms/learn/${id}`);
        } else {
          alert(enrollData.message || 'Enrollment failed after payment');
          setPaymentStep('idle');
        }
        return;
      }

      // ── LIVE RAZORPAY ── load script and open checkout
      setPaymentStep('checkout');
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Failed to load Razorpay. Please check your connection.');
        setPaymentStep('idle');
        return;
      }

      const options = {
        key: config.keyId,
        amount: orderData.order.amount,          // already in paise from backend
        currency: orderData.order.currency || 'INR',
        name: 'Pranidha International School',
        description: course.title,
        order_id: orderData.order.id,
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: { color: '#2563eb' },
        modal: {
          ondismiss: () => { setPaymentStep('idle'); }
        },
        handler: async (response) => {
          // Step 3 — verify payment signature on backend
          setPaymentStep('verifying');
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentMeta: { courseTitle: course.title, studentName: user.name, email: user.email }
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              alert('Payment verification failed. Contact support.');
              setPaymentStep('idle');
              return;
            }

            // Step 4 — enroll after verified payment
            const enrollRes = await fetch(`/api/lms/courses/${id}/enroll`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
              body: JSON.stringify({ paymentId: response.razorpay_payment_id })
            });
            const enrollData = await enrollRes.json();
            if (enrollData.success) {
              setEnrollment(enrollData.data);
              setPaymentStep('done');
              navigate(`/lms/learn/${id}`);
            } else {
              // Already enrolled means payment went through — just navigate
              if (enrollData.message?.toLowerCase().includes('already enrolled')) {
                setPaymentStep('done');
                navigate(`/lms/learn/${id}`);
              } else {
                alert(enrollData.message || 'Enrollment failed after payment. Contact support.');
                setPaymentStep('idle');
              }
            }
          } catch (err) {
            console.error('Verify/enroll error:', err);
            alert('Something went wrong after payment. Contact support with your payment ID: ' + response.razorpay_payment_id);
            setPaymentStep('idle');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        alert('Payment failed: ' + (response.error?.description || 'Unknown error'));
        setPaymentStep('idle');
      });
      rzp.open();

    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment initiation failed. Please try again.');
      setPaymentStep('idle');
    }
  };

  const isProcessingPayment = paymentStep !== 'idle' && paymentStep !== 'done';

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedLesson) return;
    
    try {
      const response = await fetch(`/api/lms/lessons/${selectedLesson._id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          markCompleted: true,
          currentTime: 0,
          duration: selectedLesson.videoDuration || 0
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setEnrollment(prev => ({
          ...prev,
          completedLessons: [...(prev?.completedLessons || []), selectedLesson._id]
        }));
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Loading course details...</div>
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

  const isEnrolled = !!enrollment;
  // Normalise price — could arrive as string "0" from FormData-based course creation
  const coursePrice = Number(course.price) || 0;
  const courseDiscounted = Number(course.discountedPrice) || 0;
  const isFree = coursePrice <= 0;
  const displayPrice = courseDiscounted > 0 && courseDiscounted < coursePrice ? courseDiscounted : coursePrice;
  const totalLessons = modules.reduce((total, module) => 
    total + (module.lessons?.length || 0), 0
  );
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

      <div className="flex">
        {/* Sidebar - Modules List */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-80 bg-white shadow-xl lg:shadow-none
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300
          overflow-y-auto
        `}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress */}
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
              <div className="text-xs text-gray-500 mt-1">
                {completedLessons} of {totalLessons} lessons completed
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

          {/* Resources */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <div className="space-y-3">
              <ResourceCard
                icon={<FileText className="w-4 h-4" />}
                title="Course Syllabus"
                type="PDF"
                size="2.4 MB"
              />
              <ResourceCard
                icon={<Download className="w-4 h-4" />}
                title="Worksheets Pack"
                type="ZIP"
                size="15.2 MB"
              />
              <ResourceCard
                icon={<BookOpen className="w-4 h-4" />}
                title="Reference Materials"
                type="PDF"
                size="8.7 MB"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Course Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center text-sm mb-4">
                <Link to="/lms" className="hover:text-blue-200">Courses</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-blue-200">{course.category.replace('-', ' ')}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <img
                      src={course.instructor?.profileImage || '/api/placeholder/32/32'}
                      alt={course.instructor?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{course.instructor?.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  <span>{course.rating?.toFixed(1) || '0.0'} ({course.totalRatings || 0} ratings)</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{course.totalEnrollments || 0} students</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.totalDuration || 0} min total</span>
                </div>
                
                {course.isFeatured && (
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex overflow-x-auto">
                {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium text-sm capitalize border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="container mx-auto px-4 py-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Video Player */}
                <div className="lg:col-span-2">
                  {selectedLesson ? (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <VideoPlayer
                        videoUrl={selectedLesson.videoUrl}
                        title={selectedLesson.title}
                        onProgressUpdate={(progress) => {
                          // Handle progress updates
                        }}
                      />
                      
                      {/* Lesson Info */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                              {selectedLesson.title}
                            </h2>
                            <p className="text-gray-600">
                              {selectedLesson.description}
                            </p>
                          </div>
                          
                          {isEnrolled && (
                            <button
                              onClick={handleMarkComplete}
                              className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${
                                enrollment?.completedLessons?.includes(selectedLesson._id)
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {enrollment?.completedLessons?.includes(selectedLesson._id)
                                ? 'Completed'
                                : 'Mark Complete'}
                            </button>
                          )}
                        </div>
                        
                        {/* Lesson Content */}
                        <div className="prose max-w-none">
                          {selectedLesson.content && (
                            <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                      <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Select a lesson to start learning
                      </h3>
                      <p className="text-gray-600">
                        Choose a lesson from the sidebar to begin watching
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column - Course Info */}
                <div className="space-y-6">
                  {/* Enrollment Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    {isEnrolled ? (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-lg font-bold text-gray-900">
                            You're enrolled!
                          </div>
                          <div className="text-sm text-green-600 font-semibold">
                            {progress}% Complete
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Link
                            to={`/lms/learn/${id}`}
                            className="block w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-center transition-colors"
                          >
                            Continue Learning
                          </Link>
                          
                          <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save for Later
                          </button>
                          
                          <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Course
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-lg font-bold text-gray-900 mb-4">
                          {!isFree ? 'Enroll in this course' : 'Free Course'}
                        </div>
                        
                        <div className="space-y-3">
                          {!isFree ? (
                            <>
                              {/* Price display */}
                              <div className="flex items-end gap-3 mb-2">
                                <span className="text-3xl font-bold text-gray-900">
                                  ₹{displayPrice}
                                </span>
                                {courseDiscounted > 0 && courseDiscounted < coursePrice && (
                                  <span className="text-lg text-gray-400 line-through mb-0.5">₹{coursePrice}</span>
                                )}
                              </div>

                              {/* Payment step indicator */}
                              {isProcessingPayment && (
                                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                                  <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                                  <span>
                                    {paymentStep === 'creating' && 'Preparing payment...'}
                                    {paymentStep === 'checkout' && 'Opening checkout...'}
                                    {paymentStep === 'verifying' && 'Verifying payment...'}
                                  </span>
                                </div>
                              )}

                              {user ? (
                                <button
                                  onClick={handleEnroll}
                                  disabled={isProcessingPayment}
                                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                  {isProcessingPayment
                                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                                    : <><CreditCard className="w-4 h-4" />Buy Now — ₹{displayPrice}</>
                                  }
                                </button>
                              ) : (
                                <Link
                                  to="/login"
                                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                  <LogIn className="w-4 h-4" />Log In to Purchase
                                </Link>
                              )}

                              {/* Trust badges */}
                              <div className="flex items-center justify-center gap-4 pt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-green-500" />Secure checkout</span>
                                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-500" />Instant access</span>
                              </div>
                            </>
                          ) : (
                            /* FREE COURSE — no enroll step, go straight to learning */
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-3xl font-bold text-green-600">Free</span>
                                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">No sign-up required</span>
                              </div>
                              <p className="text-sm text-gray-500 mb-3">
                                All lessons are freely accessible. Just click Watch to start.
                              </p>
                              <Link
                                to={`/lms/learn/${id}`}
                                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                              >
                                <PlayCircle className="w-5 h-5" />
                                Watch Free Lessons
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Features */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">This course includes:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-600">
                        <Video className="w-4 h-4 mr-3 text-blue-600" />
                        {totalLessons} on-demand video lessons
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <Download className="w-4 h-4 mr-3 text-blue-600" />
                        Downloadable resources
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4 mr-3 text-blue-600" />
                        Q&A support
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-3 text-blue-600" />
                        Certificate of completion
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <BarChart className="w-4 h-4 mr-3 text-blue-600" />
                        Progress tracking
                      </li>
                    </ul>
                  </div>

                  {/* Instructor Card */}
                  {course.instructor && (
                    <InstructorCard instructor={course.instructor} />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                
                <div className="space-y-6">
                  {modules.map((module, moduleIndex) => (
                    <div key={module._id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Module {moduleIndex + 1}: {module.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {module.lessons?.length || 0} lessons • {module.lessons?.reduce((total, lesson) => total + (lesson.videoDuration || 0), 0) || 0} min
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-100">
                        {module.lessons?.map((lesson, lessonIndex) => (
                          <div key={lesson._id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <span className="text-sm font-semibold text-blue-600">
                                  {lessonIndex + 1}
                                </span>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {lesson.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {Math.round((lesson.videoDuration || 0) / 60)} min
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    {isEnrolled && enrollment?.completedLessons?.includes(lesson._id) && (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                    <PlayCircle className="w-5 h-5 text-blue-600" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && course.instructor && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="text-center">
                      <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6">
                        <img
                          src={course.instructor.profileImage || '/api/placeholder/192/192'}
                          alt={course.instructor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {course.instructor.name}
                      </h2>
                      
                      <div className="text-gray-600 mb-4">
                        {course.instructor.qualifications}
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">50+</div>
                          <div className="text-sm text-gray-600">Courses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">10K+</div>
                          <div className="text-sm text-gray-600">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">4.9</div>
                          <div className="text-sm text-gray-600">Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">About the Instructor</h3>
                    
                    <div className="prose max-w-none text-gray-600 mb-8">
                      {course.instructor.bio || (
                        <p>
                          Experienced educator with over 10 years of teaching experience 
                          in early childhood education. Specialized in creating engaging 
                          and interactive learning experiences for young children.
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Teaching Style</h4>
                        <p className="text-sm text-gray-600">
                          Interactive, engaging, and child-centered approach with 
                          emphasis on hands-on learning experiences.
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Expertise</h4>
                        <p className="text-sm text-gray-600">
                          Early childhood development, cognitive skills, social-emotional 
                          learning, and creative expression.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Rating Summary */}
                  <div className="lg:col-span-1">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {course.rating?.toFixed(1) || '0.0'}
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              star <= Math.round(course.rating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-gray-600">
                        Course Rating • {course.totalRatings || 0} reviews
                      </div>
                    </div>
                    
                    {/* Rating Breakdown */}
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center">
                          <div className="w-10 text-sm text-gray-600">{stars} star</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mx-3">
                            <div 
                              className="h-full bg-yellow-400"
                              style={{ width: '70%' }}
                            ></div>
                          </div>
                          <div className="w-10 text-sm text-gray-600">70%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reviews List */}
                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      {/* Sample Review */}
                      <div className="border-b border-gray-100 pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                            <div>
                              <div className="font-semibold text-gray-900">Parent Name</div>
                              <div className="text-sm text-gray-500">2 months ago</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="w-4 h-4 text-yellow-400 fill-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Excellent course for early learning
                        </h4>
                        
                        <p className="text-gray-600">
                          My child has shown remarkable improvement in cognitive skills 
                          after completing this course. The interactive lessons keep 
                          them engaged and the progress tracking helps me monitor 
                          their development.
                        </p>
                      </div>
                      
                      {/* Add more sample reviews as needed */}
                    </div>
                    
                    <div className="mt-8 text-center">
                      <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                        Load More Reviews
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;