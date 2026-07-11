import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Wallet, QrCode, CheckCircle, Loader, Copy, ShieldCheck, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Admission payment modal: choose Cash or UPI.
 * - Cash: instantly collected → student auto-saved by the backend.
 * - UPI: shows a QR + deep link, then auto-polls the status so the student is
 *        saved automatically once payment is verified ("automatically fetch
 *        that payment done and student save").
 *
 * Props:
 *  - admissionData: { studentDetails, parentDetails, amount }
 *  - onClose()
 *  - onSuccess({ applicationNumber, studentId, receipt })
 */
export default function AdmissionPaymentModal({ admissionData, onClose, onSuccess }) {
  const [method, setMethod] = useState('');        // 'cash' | 'upi'
  const [stage, setStage] = useState('choose');    // choose | upiPending | verifying | success | error
  const [payment, setPayment] = useState(null);
  const [upiDeepLink, setUpiDeepLink] = useState('');
  const [upiQr, setUpiQr] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [rzpKey, setRzpKey] = useState(null);
  const [rzpReady, setRzpReady] = useState(false);
  const pollRef = useRef(null);

  const token = localStorage.getItem('token');

  const [customAmount, setCustomAmount] = useState(admissionData?.amount !== undefined ? String(admissionData.amount) : '0');
  const finalAmount = Number(customAmount) || 0;

  const studentName = admissionData?.studentDetails?.name || 'student';
  const photoFile = admissionData?.photo || null;

  // Build a multipart body so the uploaded photo travels with the payment.
  const buildPaymentFormData = (method) => {
    const fd = new FormData();
    fd.append('studentDetails', JSON.stringify(admissionData.studentDetails));
    fd.append('parentDetails', JSON.stringify(admissionData.parentDetails));
    fd.append('amount', String(finalAmount));
    fd.append('method', method);
    if (photoFile) fd.append('photo', photoFile);
    return fd;
  };
  const fireSuccess = useCallback((result) => {
    setStage('success');
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    // Give the confetti a beat, then bubble up to the parent.
    setTimeout(() => onSuccess?.(result), 900);
  }, [onSuccess]);

  // Auto-poll a UPI payment so the student is saved automatically once verified.
  const startPolling = useCallback((paymentId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/admission-payment/status/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data?.status === 'verified') {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setPayment(data.data);
          fireSuccess({
            applicationNumber: data.data.applicationNumber,
            studentId: data.data.studentDbId,
            receipt: null
          });
        }
      } catch (err) {
        console.error('Payment status poll failed:', err);
      }
    }, 3000);
  }, [token, fireSuccess]);

  // Load Razorpay config & script on mount
  useEffect(() => {
    fetch('/api/razorpay/config')
      .then((r) => r.json())
      .then((d) => { if (d.success) setRzpKey(d.keyId); })
      .catch(() => {});

    if (!document.getElementById('razorpay-checkout-script')) {
      const s = document.createElement('script');
      s.id = 'razorpay-checkout-script';
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => setRzpReady(true);
      document.body.appendChild(s);
    } else {
      setRzpReady(true);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // ---- CASH: collect instantly, student auto-saved by backend ----
  const handleCash = async () => {
    if (finalAmount <= 0) {
      alert('Please enter a valid admission fee amount greater than 0.');
      return;
    }
    setStage('verifying');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admission-payment/create', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: buildPaymentFormData('cash')
      });
      const data = await res.json();
      if (data.success) {
        setPayment(data.data);
        fireSuccess({ applicationNumber: data.applicationNumber, studentId: data.studentId, receipt: data.receipt });
      } else {
        setStage('error');
        setErrorMsg(data.message || 'Cash collection failed.');
      }
    } catch (err) {
      console.error(err);
      setStage('error');
      setErrorMsg('Network error. Could not record cash payment.');
    }
  };

  // ---- UPI: create a payment attempt, render QR, then poll ----
  const handleUpi = async () => {
    if (finalAmount <= 0) {
      alert('Please enter a valid admission fee amount greater than 0.');
      return;
    }
    setStage('verifying');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admission-payment/create', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: buildPaymentFormData('upi')
      });
      const data = await res.json();
      if (data.success) {
        const paymentRecord = data.data;
        setPayment(paymentRecord);
        setUpiDeepLink(data.upiDeepLink || '');
        setUpiQr(data.upiQrDataUrl || '');

        if (rzpKey && window.Razorpay) {
          // Create Razorpay Order
          const orderRes = await fetch('/api/razorpay/create-admission-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              admissionPaymentId: paymentRecord._id,
              amount: finalAmount
            })
          });
          const orderData = await orderRes.json();
          if (orderData.success && orderData.order) {
            const options = {
              key: rzpKey,
              amount: orderData.order.amount,
              currency: 'INR',
              name: 'Pranidha International School',
              description: `Admission Fee - ${studentName}`,
              order_id: orderData.order.id,
              prefill: {
                name: studentName,
                email: admissionData.parentDetails.email,
                contact: admissionData.parentDetails.phone
              },
              theme: { color: '#FF7043' },
              handler: async (response) => {
                startPolling(paymentRecord._id);
              },
              modal: {
                ondismiss: () => {
                  startPolling(paymentRecord._id);
                }
              }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
          }
        }
        
        setStage('upiPending');
        // Begin auto-detecting payment completion.
        startPolling(paymentRecord._id);
      } else {
        setStage('error');
        setErrorMsg(data.message || 'Could not start UPI payment.');
      }
    } catch (err) {
      console.error(err);
      setStage('error');
      setErrorMsg(err.message || 'Network error. Could not start UPI payment.');
    }
  };



  // ---- Simulate Razorpay Webhook Call (Mock Mode) ----
  const handleSimulateWebhook = async () => {
    if (!payment) return;
    setStage('verifying');
    setErrorMsg('');
    try {
      const res = await fetch('/api/razorpay/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'payment.captured',
          payload: {
            payment: {
              entity: {
                id: `pay_mock_${Math.random().toString(36).substr(2, 9)}`,
                method: 'upi',
                notes: {
                  type: 'admission',
                  admissionPaymentId: payment._id
                }
              }
            }
          }
        })
      });
      if (res.ok) {
        // Trigger status check immediately to transition state
        const statusRes = await fetch(`/api/admission-payment/status/${payment._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const statusData = await statusRes.json();
        if (statusData.success && statusData.data?.status === 'verified') {
          if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
          setPayment(statusData.data);
          fireSuccess({
            applicationNumber: statusData.data.applicationNumber,
            studentId: statusData.data.studentDbId,
            receipt: null
          });
        } else {
          setStage('upiPending');
        }
      } else {
        setStage('upiPending');
        setErrorMsg('Failed to trigger simulated webhook.');
      }
    } catch (err) {
      console.error(err);
      setStage('upiPending');
      setErrorMsg('Network error trying to simulate webhook.');
    }
  };

  const copyLink = () => {
    if (upiDeepLink) navigator.clipboard?.writeText(upiDeepLink);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border-[6px] border-white rounded-[2.5rem] w-full max-w-md p-6 shadow-2xl relative text-slate-800 max-h-[92vh] overflow-y-auto">

        <button
          onClick={() => { if (pollRef.current) clearInterval(pollRef.current); onClose?.(); }}
          className="absolute flex items-center justify-center w-8 h-8 font-bold transition-colors rounded-full top-4 right-4 bg-slate-50 hover:bg-slate-100 text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pb-3 space-y-1 text-center border-b-2 border-slate-100">
          <div className="w-12 h-12 rounded-full bg-brandMint/10 text-brandMint flex items-center justify-center mx-auto shadow-[inset_1px_1px_2px_white] mb-1">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-extrabold tracking-widest text-brandCoral bg-brandCoral/10 px-2.5 py-0.5 rounded-full uppercase">Admission Payment</span>
          <h4 className="font-quicksand font-bold text-slate-800 text-base mt-1">{studentName}</h4>
          <p className="text-[11px] text-slate-500">Amount to collect</p>
          {stage === 'choose' ? (
            <div className="flex items-center justify-center gap-1 max-w-[200px] mx-auto mt-1 border-2 border-slate-150 focus-within:border-brandCoral rounded-2xl px-3 py-1 bg-slate-50">
              <span className="text-lg font-bold text-slate-550 font-mono">₹</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full text-center text-xl font-extrabold text-brandCoral bg-transparent outline-none"
                placeholder="0"
              />
            </div>
          ) : (
            <p className="text-3xl font-extrabold text-brandCoral font-quicksand">₹{finalAmount.toLocaleString('en-IN')}</p>
          )}
        </div>

        {/* CHOOSE METHOD */}
        {stage === 'choose' && (
          <div className="py-5 space-y-3">
            <p className="text-xs font-semibold text-center text-slate-500">Select a payment method to confirm the admission.</p>
            <button
              onClick={() => setMethod('cash')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${method === 'cash' ? 'border-brandMint bg-brandMint/5' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="w-10 h-10 rounded-full bg-brandMint/10 text-brandMint flex items-center justify-center"><Banknote className="w-5 h-5" /></div>
              <div className="text-left">
                <p className="font-quicksand font-bold text-sm text-slate-800">Cash</p>
                <p className="text-[10px] text-slate-500">Collect at the admission desk. Student saved instantly.</p>
              </div>
            </button>

            <button
              onClick={() => setMethod('upi')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${method === 'upi' ? 'border-brandSky bg-brandSky/5' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <div className="w-10 h-10 rounded-full bg-brandSky/10 text-brandSky flex items-center justify-center"><QrCode className="w-5 h-5" /></div>
              <div className="text-left">
                <p className="font-quicksand font-bold text-sm text-slate-800">UPI</p>
                <p className="text-[10px] text-slate-500">Scan QR & pay. Student saved automatically once verified.</p>
              </div>
            </button>

            <button
              disabled={!method}
              onClick={method === 'cash' ? handleCash : handleUpi}
              className={`w-full py-3 rounded-2xl font-quicksand font-bold text-xs transition-all ${method ? 'bg-brandCoral hover:bg-brandCoral-dark text-white shadow' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              {method === 'cash' ? 'COLLECT CASH & CONFIRM' : method === 'upi' ? 'GENERATE UPI QR' : 'CHOOSE A METHOD'}
            </button>
          </div>
        )}

        {/* UPI PENDING: QR + auto-poll */}
        {stage === 'upiPending' && (
          <div className="py-5 space-y-4">
            <div className="flex flex-col items-center gap-2">
              {upiQr ? (
                <img src={upiQr} alt="UPI QR" className="w-48 h-48 border border-slate-100 rounded-2xl bg-white p-1" />
              ) : (
                <div className="flex items-center justify-center w-48 h-48 border border-dashed rounded-2xl border-slate-200"><Loader className="w-6 h-6 animate-spin text-slate-400" /></div>
              )}
              <p className="text-[11px] font-semibold text-slate-500">Scan with any UPI app to pay <span className="text-brandCoral font-bold">₹{finalAmount.toLocaleString('en-IN')}</span></p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-50 rounded-full px-3 py-1">
                <span className="max-w-[180px] truncate">{upiDeepLink}</span>
                <button onClick={copyLink} className="text-slate-500 hover:text-brandCoral"><Copy className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-brandSky">
              <Loader className="w-3.5 h-3.5 animate-spin" />
              <span>Auto-detecting payment… waiting for confirmation</span>
            </div>

            {/* Simulation trigger (Mock mode fallback) */}
            {!rzpKey && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sandbox Controls</p>
                <button
                  onClick={handleSimulateWebhook}
                  className="w-full py-2.5 rounded-xl bg-brandCoral hover:bg-brandCoral-dark text-white font-quicksand font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" /> SIMULATE WEBHOOK SUCCESS (MOCK RAZORPAY)
                </button>
              </div>
            )}
          </div>
        )}

        {/* VERIFYING / CASH PROCESSING */}
        {stage === 'verifying' && (
          <div className="py-10 text-center">
            <Loader className="w-8 h-8 mx-auto animate-spin text-brandCoral" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Processing payment & registering student…</p>
          </div>
        )}

        {/* SUCCESS */}
        {stage === 'success' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-brandMint/10 text-brandMint flex items-center justify-center mx-auto shadow-[inset_1px_1px_2px_white]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-quicksand font-bold text-slate-800">Admission Confirmed!</h4>
            <p className="text-xs text-slate-500">Payment received and the student has been saved automatically.</p>
            {payment?.applicationNumber && (
              <div className="bg-brandCream border border-orange-100 rounded-xl p-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Application No.</span>
                <p className="font-mono text-lg font-bold text-brandCoral">{payment.applicationNumber}</p>
              </div>
            )}
          </div>
        )}

        {/* ERROR */}
        {stage === 'error' && (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-red-600">{errorMsg}</p>
            <button onClick={() => setStage('choose')} className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-quicksand font-bold text-xs">BACK</button>
          </div>
        )}

      </div>
    </div>
  );
}
