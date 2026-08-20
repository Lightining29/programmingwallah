import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Search, Printer, CheckCircle2, ArrowLeft, Building2, Calendar, User, Award, ExternalLink, Sparkles } from 'lucide-react';
import CertificateDocument from '../components/CertificateDocument.jsx';

export default function VerifyCertificate() {
  const { certNumber } = useParams();
  const navigate = useNavigate();
  const [inputNumber, setInputNumber] = useState(certNumber || '');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchCertificate = async (num) => {
    if (!num || !num.trim()) return;
    setLoading(true);
    setError('');
    setCertificate(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/public/verify-certificate/${encodeURIComponent(num.trim())}`);
      const data = await res.json();

      if (data.success && data.data) {
        setCertificate(data.data);
      } else {
        setError(data.message || 'No certificate found with this Certificate Number.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Unable to reach the verification server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certNumber) {
      setInputNumber(certNumber);
      fetchCertificate(certNumber);
    }
  }, [certNumber]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputNumber.trim()) return;
    navigate(`/verify-certificate/${encodeURIComponent(inputNumber.trim())}`, { replace: true });
    fetchCertificate(inputNumber.trim());
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:text-black">
      
      {/* Top Header / Navigation (hidden when printing) */}
      <div className="max-w-5xl mx-auto mb-8 print:hidden">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Credential Verification Portal</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apple Tree Infotech Verification System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Verify Internship Certificate
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Instantly authenticate student completion credentials, internship durations, and university-partnered certifications.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl">
            <div className="absolute left-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              placeholder="Enter Certificate Number (e.g. ATI-06-02-ST1002)"
              className="w-full pl-12 pr-32 py-4 bg-slate-900/90 border-2 border-slate-700 focus:border-brandSky rounded-2xl text-white placeholder-slate-500 text-sm font-mono tracking-wide outline-none transition shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !inputNumber.trim()}
              className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-sky-500/25 flex items-center gap-2"
            >
              {loading ? (
                <span>Checking...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Now</span>
                </>
              )}
            </button>
          </form>
          <p className="text-center text-xs text-slate-500 mt-2 font-mono">
            Sample ID: <button type="button" onClick={() => { setInputNumber('ATI-06-02-ST1002'); fetchCertificate('ATI-06-02-ST1002'); }} className="text-sky-400 hover:underline">ATI-06-02-ST1002</button>
          </p>
        </div>
      </div>

      {/* Verification Result Container */}
      <div className="max-w-5xl mx-auto">
        {loading && (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-300">Verifying credential on blockchain / database...</p>
            <p className="text-xs text-slate-500 mt-1">Checking serial number: {inputNumber}</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 text-center bg-red-950/30 border border-red-800/50 rounded-3xl backdrop-blur-sm max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-300">Certificate Not Verified</h3>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
            <p className="text-xs text-slate-500">
              Please ensure you have typed the exact Certificate Number printed on the top-left of the document.
            </p>
          </div>
        )}

        {certificate && !loading && (
          <div className="space-y-6">
            
            {/* Authenticity Verified Card Banner (hidden during printing) */}
            <div className="p-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-950">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                      Verified & Authentic
                    </span>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      {certificate.certificateNumber}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    Issued to {certificate.studentName}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {certificate.internshipName}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Detailed Metadata Grid (hidden during printing) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span>Candidate Name</span>
                </div>
                <div className="font-bold text-sm text-white">{certificate.studentName}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Internship Program</span>
                </div>
                <div className="font-bold text-sm text-white truncate" title={certificate.internshipName}>
                  {certificate.internshipName}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Duration</span>
                </div>
                <div className="font-bold text-xs text-white">
                  {certificate.startDate} to {certificate.endDate}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Issuing Authority</span>
                </div>
                <div className="font-bold text-xs text-white">
                  Apple Tree Infotech (ISO 9001:2015)
                </div>
              </div>
            </div>

            {/* Interactive Certificate View */}
            <div className="p-4 sm:p-8 bg-slate-900/50 border border-slate-800 rounded-3xl shadow-2xl overflow-x-auto flex justify-center print:border-none print:p-0 print:bg-white print:overflow-visible">
              <div className="w-full max-w-[960px]">
                <CertificateDocument certificate={certificate} />
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
