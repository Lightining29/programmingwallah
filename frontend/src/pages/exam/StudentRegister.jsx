import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const COLLEGE_LIST = [
  "Ajay Kumar Garg Engineering College (AKGEC, Ghaziabad)",
  "ABES Engineering College (ABES EC, Ghaziabad)",
  "ABES Institute of Technology (ABES IT, Ghaziabad)",
  "KIET Group of Institutions (KIET, Ghaziabad)",
  "Krishna Engineering College (KEC, Ghaziabad)",
  "IMS Engineering College (IMSEC, Ghaziabad)",
  "Raj Kumar Goel Institute of Technology (RKGIT, Ghaziabad)",
  "JSS Academy of Technical Education (JSSATE, Noida)",
  "Galgotias College of Engineering & Technology (GCET)",
  "Galgotias University (Greater Noida)",
  "G.L. Bajaj Institute of Technology & Management (GLBITM)",
  "Noida Institute of Engineering & Technology (NIET)",
  "Jaypee Institute of Information Technology (JIIT, Noida)",
  "Amity University (Noida)",
  "Bennett University (Greater Noida)",
  "Sharda University (Greater Noida)",
  "Shiv Nadar University (SNU, Greater Noida)",
  "Delhi Technological University (DTU, Delhi)",
  "Netaji Subhas University of Technology (NSUT, Delhi)",
  "Indraprastha Institute of Information Technology (IIIT Delhi)",
  "Guru Gobind Singh Indraprastha University (GGSIPU)",
  "Maharaja Agrasen Institute of Technology (MAIT, Delhi)",
  "Maharaja Surajmal Institute of Technology (MSIT, Delhi)",
  "Bharati Vidyapeeth's College of Engineering (BVCOE, Delhi)",
  "Jamia Millia Islamia (JMI, New Delhi)",
  "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
  "Chaudhary Charan Singh University (CCSU, Meerut)",
  "University of Delhi (DU)",
  "Indian Institute of Technology (IIT)",
  "National Institute of Technology (NIT)",
  "Indian Institute of Information Technology (IIIT)",
  "Other / College Not Listed"
];

export default function StudentRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [rollNo, setRollNo] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);

  useEffect(() => {
    fetchAssessmentInfo();
  }, [id]);

  const fetchAssessmentInfo = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`/api/assessment/public/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load assessment details.');
      setAssessment(data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Name and email are required!' });
      return;
    }

    setSubmitting(true);
    const finalCollege = selectedCollege === 'Other / College Not Listed'
      ? customCollege.trim()
      : selectedCollege.trim();

    try {
      const res = await fetch(`/api/assessment/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          college: finalCollege,
          rollNo: rollNo.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      setRegisteredSuccess({
        candidate: data.candidate,
        examUrl: data.examUrl || `/test/${id}?email=${encodeURIComponent(email.trim().toLowerCase())}`,
        message: data.message
      });

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Your registration has been confirmed. You can now proceed to the examination gate.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Registration Failed', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold text-slate-300">Loading Assessment Details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !assessment) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-white shadow-2xl">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Assessment Unavailable</h2>
          <p className="text-slate-400 text-sm mb-6">{fetchError || 'Assessment not found or currently inactive.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-sm transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Registration Complete Success View
  if (registeredSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-700 text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg shadow-emerald-500/20">
            ✓
          </div>
          <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            Enrolled Successfully
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Registration Confirmed!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
            Welcome, <strong className="text-slate-900 dark:text-white">{registeredSuccess.candidate?.name}</strong>! Your email has been registered for:
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-left mb-6 space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Assessment:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{assessment.title}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Registered Email:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{registeredSuccess.candidate?.email}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Duration:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{assessment.duration} Minutes</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Passing Score:</span>
              <span className="font-semibold text-emerald-600">{assessment.passingScore}%</span>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-left text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            <p className="font-bold mb-1 flex items-center gap-1.5 text-sm">
              <span>🔑</span> Exam Access Password Required
            </p>
            When entering the test gate, you will be prompted to enter your registered email and the <strong>Exam Password</strong> shared with you by your administrator or instructor.
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={registeredSuccess.examUrl}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all text-center block"
            >
              Proceed to Exam Gate →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📝</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-100">Student Examination Portal</div>
                <div className="text-sm font-semibold opacity-90">ProgrammingWala & AppleTree</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
              {assessment.duration} min
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Assessment Title & Metadata */}
          <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {assessment.title}
            </h1>
            {assessment.description && (
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
                {assessment.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/60 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
                ⏱️ Duration: <strong>{assessment.duration} mins</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                🎯 Pass Score: <strong>{assessment.passingScore}%</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300">
                ❓ Questions: <strong>{assessment.questionCount || 'Multi'}</strong>
              </span>
            </div>
          </div>

          {/* Form Description */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Candidate Registration</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fill in your details below to register. Your email will be your unique identification key for entering the exam.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">👤</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Manish Kumar"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex justify-between">
                <span>Email Address (Primary Key) <span className="text-rose-500">*</span></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-normal lowercase">used to enter exam</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">✉️</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. manish@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone & College Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Mobile / WhatsApp
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">📱</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  College / Institute
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">🏫</span>
                  <select
                    value={selectedCollege}
                    onChange={e => setSelectedCollege(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="">-- Select College / Institute --</option>
                    {COLLEGE_LIST.map((col) => (
                      <option key={col} value={col} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800">
                        {col}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</span>
                </div>

                {selectedCollege === 'Other / College Not Listed' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      value={customCollege}
                      onChange={e => setCustomCollege(e.target.value)}
                      placeholder="Please enter your College / Institute name"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900/60 border border-emerald-400 dark:border-emerald-600 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Roll Number / Student ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Roll Number / Student ID (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">🎓</span>
                <input
                  type="text"
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  placeholder="e.g. 210027010001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering Candidate...
                  </>
                ) : (
                  <>Submit Registration & Proceed 🚀</>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <Link to={`/test/${id}`} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                  Go directly to Exam Gate →
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
