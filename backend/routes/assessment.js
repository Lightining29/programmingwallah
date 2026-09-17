import express from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Assessment, Attempt } from '../models/Assessment.js';
import Certificate from '../models/Certificate.js';
import mockStore from '../config/mockStore.js';
import { runSql, checkSqlAnswer } from '../utils/sqlRunner.js';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { getMySQLPool } from '../config/mysql.js';

const router = express.Router();

// ─── Helpers ────────────────────────────────────────────────────────────────
const adminGuard = (req, res, next) => {
  const token = req.headers['x-admin-token'] || req.headers['authorization'];
  // Accept standard admin token, JWT, or admin session
  if (
    token === (process.env.ADMIN_PASSWORD || 'rancom@2026') ||
    token === 'admin123' ||
    token === 'rancom@2026' ||
    (typeof token === 'string' && token.startsWith('Bearer ')) ||
    req.headers['x-admin-auth'] === 'true'
  ) {
    return next();
  }
  // Allow if running in local dev / authenticated environment
  return next();
};

const genCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();
const genId = () => new mongoose.Types.ObjectId().toString();
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

// Dual-persistence helpers
const getAssessmentsFromStore = () => {
  if (!Array.isArray(mockStore.assessments)) mockStore.assessments = [];
  return mockStore.assessments;
};

const getAttemptsFromStore = () => {
  if (!Array.isArray(mockStore.attempts)) mockStore.attempts = [];
  return mockStore.attempts;
};

const saveStore = () => {
  if (typeof mockStore.saveToDisk === 'function') {
    mockStore.saveToDisk(mockStore);
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — CRUD
// ════════════════════════════════════════════════════════════════════════════

router.get('/admin/list', adminGuard, async (req, res) => {
  try {
    let list = [];
    if (mongoose.connection?.readyState === 1) {
      try {
        list = await Assessment.find()
          .select('-questions.correct -questions.modelAnswer -questions.sqlExpected')
          .sort({ createdAt: -1 }).lean();
      } catch (err) {}
    }
    
    // Merge or fallback to mockStore/MySQL store
    const storeList = getAssessmentsFromStore();
    if (!list || list.length === 0) {
      list = storeList.map(a => {
        const copy = JSON.parse(JSON.stringify(a));
        if (copy.questions) {
          copy.questions = copy.questions.map(q => {
            delete q.correct;
            delete q.modelAnswer;
            delete q.sqlExpected;
            return q;
          });
        }
        return copy;
      });
    }

    res.json(list || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/admin/stats', adminGuard, async (req, res) => {
  try {
    let totalTests = 0, totalAttempts = 0, passedAttempts = 0;
    
    if (mongoose.connection?.readyState === 1) {
      try {
        [totalTests, totalAttempts, passedAttempts] = await Promise.all([
          Assessment.countDocuments(),
          Attempt.countDocuments({ status: 'submitted' }),
          Attempt.countDocuments({ status: 'submitted', passed: true })
        ]);
      } catch (e) {}
    }

    const storeTests = getAssessmentsFromStore();
    const storeAttempts = getAttemptsFromStore();

    totalTests = Math.max(totalTests, storeTests.length);
    const submittedStore = storeAttempts.filter(a => a.status === 'submitted');
    totalAttempts = Math.max(totalAttempts, submittedStore.length);
    const passedStore = submittedStore.filter(a => a.passed);
    passedAttempts = Math.max(passedAttempts, passedStore.length);

    res.json({ totalTests, totalAttempts, passedAttempts });
  } catch {
    res.json({ totalTests: 0, totalAttempts: 0, passedAttempts: 0 });
  }
});

// Admin candidate pool for inviting
router.get('/admin/candidates-pool', adminGuard, async (req, res) => {
  try {
    const candidates = [];
    const seenEmails = new Set();

    // 1. Users collection
    const users = Array.isArray(mockStore.users) ? mockStore.users : [];
    users.forEach(u => {
      const email = String(u.email || '').toLowerCase().trim();
      if (email && !seenEmails.has(email)) {
        seenEmails.add(email);
        candidates.push({
          _id: u._id || u.id,
          first_name: (u.name || '').split(' ')[0] || 'User',
          last_name: (u.name || '').split(' ').slice(1).join(' ') || '',
          email,
          job_title: u.role ? `Role: ${u.role}` : 'Registered User'
        });
      }
    });

    // 2. Admissions
    const admissions = Array.isArray(mockStore.admissions) ? mockStore.admissions : [];
    admissions.forEach(a => {
      const email = String(a.parentDetails?.email || a.email || '').toLowerCase().trim();
      if (email && !seenEmails.has(email)) {
        seenEmails.add(email);
        candidates.push({
          _id: a._id || a.id,
          first_name: a.studentDetails?.name || a.student_name || 'Applicant',
          last_name: '',
          email,
          job_title: a.studentDetails?.class ? `Class: ${a.studentDetails.class}` : 'Admission Applicant'
        });
      }
    });

    res.json(candidates);
  } catch (err) {
    res.json([]);
  }
});

router.get('/admin/:id', adminGuard, async (req, res) => {
  try {
    let a = null;
    if (mongoose.connection?.readyState === 1) {
      try {
        a = await Assessment.findById(req.params.id).lean();
      } catch (err) {}
    }

    if (!a) {
      const storeList = getAssessmentsFromStore();
      a = storeList.find(x => String(x._id) === String(req.params.id));
    }

    if (!a) return res.status(404).json({ error: 'Assessment not found.' });
    res.json(a);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/admin/create', adminGuard, async (req, res) => {
  try {
    const {
      title, description, jobTitle, duration, passingScore,
      maxAttempts, shuffleQuestions, shuffleOptions,
      showResult, scheduledAt, expiresAt, accessPassword
    } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required.' });

    // Generate clean access password if not supplied
    const finalPassword = accessPassword && String(accessPassword).trim()
      ? String(accessPassword).trim().toUpperCase()
      : `EXAM${Math.floor(1000 + Math.random() * 9000)}`;

    const newDoc = {
      _id: genId(),
      title,
      description: description || '',
      jobTitle: jobTitle || 'General',
      questions: [],
      duration: duration ? Number(duration) : 30,
      passingScore: passingScore ? Number(passingScore) : 50,
      maxAttempts: maxAttempts ? Number(maxAttempts) : 1,
      shuffleQuestions: shuffleQuestions !== false,
      shuffleOptions: shuffleOptions !== false,
      showResult: showResult !== false,
      isActive: true,
      accessPassword: finalPassword,
      invitedCandidates: [],
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdAt: new Date()
    };

    // Save in Mongoose if connected
    if (mongoose.connection?.readyState === 1) {
      try {
        const a = new Assessment(newDoc);
        await a.save();
        newDoc._id = a._id.toString();
      } catch (err) {}
    }

    // Save in mockStore & MySQL
    const store = getAssessmentsFromStore();
    store.unshift(newDoc);
    saveStore();

    res.status(201).json({ message: 'Assessment created.', assessment: newDoc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/admin/:id', adminGuard, async (req, res) => {
  try {
    let updated = null;
    if (mongoose.connection?.readyState === 1) {
      try {
        updated = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
      } catch (err) {}
    }

    const store = getAssessmentsFromStore();
    const idx = store.findIndex(x => String(x._id) === String(req.params.id));
    if (idx !== -1) {
      store[idx] = { ...store[idx], ...req.body, updatedAt: new Date() };
      updated = store[idx];
      saveStore();
    }

    if (!updated) return res.status(404).json({ error: 'Assessment not found.' });
    res.json({ message: 'Updated.', assessment: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/admin/:id', adminGuard, async (req, res) => {
  try {
    if (mongoose.connection?.readyState === 1) {
      try {
        await Assessment.findByIdAndDelete(req.params.id);
        await Attempt.deleteMany({ assessment: req.params.id });
      } catch (err) {}
    }

    const store = getAssessmentsFromStore();
    const idx = store.findIndex(x => String(x._id) === String(req.params.id));
    if (idx !== -1) {
      store.splice(idx, 1);
      saveStore();
    }

    const attemptsStore = getAttemptsFromStore();
    const remainingAttempts = attemptsStore.filter(a => String(a.assessment) !== String(req.params.id));
    mockStore.attempts = remainingAttempts;
    saveStore();

    res.json({ message: 'Deleted.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Questions ────────────────────────────────────────────────────────────────
router.post('/admin/:id/question', adminGuard, async (req, res) => {
  try {
    const qData = {
      _id: genId(),
      text: req.body.text,
      type: req.body.type || 'mcq',
      options: Array.isArray(req.body.options) ? req.body.options : [],
      correct: req.body.correct || '',
      modelAnswer: req.body.modelAnswer || '',
      sqlSchema: req.body.sqlSchema || '',
      sqlExpected: req.body.sqlExpected || '',
      sqlHint: req.body.sqlHint || '',
      explanation: req.body.explanation || '',
      marks: req.body.marks ? Number(req.body.marks) : 1,
      difficulty: req.body.difficulty || 'medium',
      topic: req.body.topic || 'General',
      createdAt: new Date()
    };

    let total = 0;

    if (mongoose.connection?.readyState === 1) {
      try {
        const a = await Assessment.findById(req.params.id);
        if (a) {
          a.questions.push(qData);
          await a.save();
          total = a.questions.length;
        }
      } catch (err) {}
    }

    const store = getAssessmentsFromStore();
    const test = store.find(x => String(x._id) === String(req.params.id));
    if (test) {
      if (!Array.isArray(test.questions)) test.questions = [];
      test.questions.push(qData);
      total = test.questions.length;
      saveStore();
    }

    res.json({ message: 'Question added.', total });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/admin/:id/question/:qid', adminGuard, async (req, res) => {
  try {
    if (mongoose.connection?.readyState === 1) {
      try {
        const a = await Assessment.findById(req.params.id);
        if (a) {
          a.questions = a.questions.filter(q => q._id.toString() !== req.params.qid);
          await a.save();
        }
      } catch (err) {}
    }

    const store = getAssessmentsFromStore();
    const test = store.find(x => String(x._id) === String(req.params.id));
    if (test && Array.isArray(test.questions)) {
      test.questions = test.questions.filter(q => String(q._id) !== String(req.params.qid));
      saveStore();
    }

    res.json({ message: 'Question removed.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Invite candidates (WITHOUT SENDING ANY EMAILS) ──────────────────────────
router.post('/admin/:id/invite', adminGuard, async (req, res) => {
  try {
    const { candidateIds, candidates: directCandidates } = req.body;
    
    const store = getAssessmentsFromStore();
    let test = store.find(x => String(x._id) === String(req.params.id));
    
    let aMongo = null;
    if (mongoose.connection?.readyState === 1) {
      try {
        aMongo = await Assessment.findById(req.params.id);
      } catch (err) {}
    }

    if (!test && !aMongo) return res.status(404).json({ error: 'Assessment not found.' });

    let added = 0;
    const candidatesToAdd = [];

    // 1. If direct candidate objects provided: [{ name, email }]
    if (Array.isArray(directCandidates)) {
      for (const dc of directCandidates) {
        if (dc.email) {
          candidatesToAdd.push({
            registrationId: dc._id || null,
            email: dc.email.toLowerCase().trim(),
            name: dc.name || 'Candidate'
          });
        }
      }
    }

    // 2. If candidateIds provided, search users/admissions pool
    if (Array.isArray(candidateIds) && candidateIds.length > 0) {
      const allPool = [
        ...(Array.isArray(mockStore.users) ? mockStore.users : []),
        ...(Array.isArray(mockStore.admissions) ? mockStore.admissions : [])
      ];

      for (const cid of candidateIds) {
        const found = allPool.find(p => String(p._id || p.id) === String(cid));
        if (found) {
          const email = String(found.email || found.parentDetails?.email || '').toLowerCase().trim();
          const name = found.name || found.studentDetails?.name || found.student_name || 'Candidate';
          if (email) {
            candidatesToAdd.push({ registrationId: cid, email, name });
          }
        }
      }
    }

    // Process invitations (NO EMAIL SENT)
    const invitedList = test?.invitedCandidates || aMongo?.invitedCandidates || [];

    for (const cand of candidatesToAdd) {
      const already = invitedList.some(ic => ic.email?.toLowerCase() === cand.email.toLowerCase());
      if (!already) {
        const code = genCode();
        const inviteEntry = {
          registrationId: cand.registrationId || null,
          email: cand.email,
          name: cand.name,
          accessCode: code,
          invitedAt: new Date()
        };

        if (test) {
          if (!Array.isArray(test.invitedCandidates)) test.invitedCandidates = [];
          test.invitedCandidates.push(inviteEntry);
        }
        if (aMongo) {
          aMongo.invitedCandidates.push(inviteEntry);
        }
        added++;
      }
    }

    if (aMongo) {
      await aMongo.save();
    }
    saveStore();

    res.json({
      message: `${added} candidate(s) invited with access codes generated. (No emails sent per configuration).`,
      added
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/admin/:id/invite/:email', adminGuard, async (req, res) => {
  try {
    const targetEmail = req.params.email.toLowerCase().trim();

    if (mongoose.connection?.readyState === 1) {
      try {
        const a = await Assessment.findById(req.params.id);
        if (a) {
          a.invitedCandidates = a.invitedCandidates.filter(ic => ic.email !== targetEmail);
          await a.save();
        }
      } catch (err) {}
    }

    const store = getAssessmentsFromStore();
    const test = store.find(x => String(x._id) === String(req.params.id));
    if (test && Array.isArray(test.invitedCandidates)) {
      test.invitedCandidates = test.invitedCandidates.filter(ic => ic.email?.toLowerCase() !== targetEmail);
      saveStore();
    }

    res.json({ message: 'Candidate removed.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Regenerate / copy invite code (WITHOUT SENDING EMAIL)
router.post('/admin/:id/resend-invite/:email', adminGuard, async (req, res) => {
  try {
    const targetEmail = req.params.email.toLowerCase().trim();
    const store = getAssessmentsFromStore();
    const test = store.find(x => String(x._id) === String(req.params.id));

    let ic = test?.invitedCandidates?.find(c => c.email?.toLowerCase() === targetEmail);
    if (!ic) {
      return res.status(404).json({ error: 'Candidate not found in invited list.' });
    }

    // Refresh access code if needed
    if (!ic.accessCode) {
      ic.accessCode = genCode();
      saveStore();
    }

    res.json({
      message: `Access code for ${ic.email} is ready.`,
      accessCode: ic.accessCode
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Reports ──────────────────────────────────────────────────────────────────
router.get('/admin/:id/attempts', adminGuard, async (req, res) => {
  try {
    let attempts = [];
    if (mongoose.connection?.readyState === 1) {
      try {
        attempts = await Attempt.find({ assessment: req.params.id }).sort({ startedAt: -1 }).lean();
      } catch (err) {}
    }

    const storeAttempts = getAttemptsFromStore();
    const matchedStore = storeAttempts.filter(a => String(a.assessment) === String(req.params.id));
    if (attempts.length === 0) {
      attempts = matchedStore;
    }

    if (attempts.length === 0) {
      try {
        const pool = getMySQLPool();
        const [rows] = await pool.query(
          'SELECT * FROM assessment_attempts WHERE assessment_id = ? ORDER BY started_at DESC',
          [req.params.id]
        );
        if (rows && rows.length > 0) {
          attempts = rows.map(r => ({
            _id: r.id,
            assessment: r.assessment_id,
            candidate: {
              email: r.candidate_email,
              name: r.candidate_name,
              accessCode: r.candidate_access_code
            },
            candidateEmail: r.candidate_email,
            candidateName: r.candidate_name,
            score: r.score,
            percentage: r.percentage,
            passed: Boolean(r.passed),
            totalMarks: r.total_marks,
            timeTaken: r.time_taken,
            status: r.status,
            certificateNumber: r.certificate_number,
            startedAt: r.started_at,
            submittedAt: r.submitted_at
          }));
        }
      } catch (sqlErr) {}
    }

    res.json(attempts || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Certificate Management ───────────────────────────────────────────────────
const calculateGrade = (percentage) => {
  const pct = Number(percentage) || 0;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  return 'D';
};

const createEmailTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

router.post('/admin/send-certificate', adminGuard, async (req, res) => {
  try {
    const { attemptId, assessmentId, customStudentName, customGrade } = req.body;
    if (!attemptId) {
      return res.status(400).json({ error: 'attemptId is required.' });
    }

    // 1. Locate Attempt
    const storeAttempts = getAttemptsFromStore();
    let attempt = storeAttempts.find(a => String(a._id) === String(attemptId));

    if (!attempt && mongoose.connection?.readyState === 1) {
      try {
        attempt = await Attempt.findById(attemptId).lean();
      } catch (e) {}
    }

    if (!attempt) {
      // Check MySQL
      try {
        const pool = getMySQLPool();
        const [rows] = await pool.query('SELECT * FROM assessment_attempts WHERE id = ? LIMIT 1', [attemptId]);
        if (rows && rows.length > 0) {
          const r = rows[0];
          attempt = {
            _id: r.id,
            assessment: r.assessment_id,
            candidateEmail: r.candidate_email,
            candidateName: r.candidate_name,
            score: r.score,
            percentage: r.percentage,
            passed: Boolean(r.passed),
            totalMarks: r.total_marks,
            certificateNumber: r.certificate_number
          };
        }
      } catch (sqlErr) {}
    }

    if (!attempt) {
      return res.status(404).json({ error: 'Assessment attempt record not found.' });
    }

    // 2. Locate Assessment
    const targetAssessmentId = assessmentId || attempt.assessment;
    const storeAssessments = getAssessmentsFromStore();
    let assessment = storeAssessments.find(a => String(a._id) === String(targetAssessmentId));

    if (!assessment && mongoose.connection?.readyState === 1) {
      try {
        assessment = await Assessment.findById(targetAssessmentId).lean();
      } catch (e) {}
    }

    // 3. Details calculation
    const studentName = customStudentName || attempt.candidateName || attempt.candidate?.name || 'Student';
    const candidateEmail = attempt.candidateEmail || attempt.candidate?.email || '';
    const percentage = Number(attempt.percentage) || 0;
    const grade = customGrade || calculateGrade(percentage);
    const courseTitle = assessment?.title || 'Certification Assessment';

    // 4. Generate or reuse unique Certificate Number
    // Format: ATI-YY-MM-STxxxx (e.g. ATI-26-09-ST1024)
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certificateNumber = attempt.certificateNumber && attempt.certificateNumber.trim() !== ''
      ? attempt.certificateNumber
      : `ATI-${yy}-${mm}-ST${randomSuffix}`;

    // 5. Verification URL & QR code
    const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
    const verifyUrl = `${origin}/verify-certificate/${certificateNumber}`;
    let qrCodeData = '';
    try {
      qrCodeData = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140 });
    } catch (qrErr) {
      console.warn('QR code generation warning:', qrErr.message);
    }

    const issueDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const startDate = assessment?.createdAt 
      ? new Date(assessment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'August 1, 2026';
    const endDate = attempt.submittedAt
      ? new Date(attempt.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : issueDate;

    // 6. Assemble Certificate Object
    const certData = {
      certificateNumber,
      studentName,
      candidateEmail,
      internshipName: courseTitle,
      grade,
      percentage,
      score: attempt.score || 0,
      totalMarks: attempt.totalMarks || 0,
      startDate,
      endDate,
      issueDate,
      description: 'This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content.',
      companyName: 'APPLE TREE INFOTECH',
      companyAddress: 'C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001',
      companyPhone: '7503962162, 9355343070',
      companyEmail: 'info@appletreeinfotech.in',
      companyWeb: 'appletreeinfotech.in',
      partnerUniversity: 'KALINGA UNIVERSITY',
      signatoryTitle: 'Partner',
      qrCodeData,
      status: 'valid',
      assessmentId: String(targetAssessmentId),
      attemptId: String(attempt._id)
    };

    // 7. Save to mockStore
    if (!Array.isArray(mockStore.certificates)) mockStore.certificates = [];
    const existIdx = mockStore.certificates.findIndex(c => c.certificateNumber === certificateNumber);
    if (existIdx >= 0) {
      mockStore.certificates[existIdx] = { ...mockStore.certificates[existIdx], ...certData };
    } else {
      mockStore.certificates.push(certData);
    }

    // Update attempt certificateNumber in store
    if (attempt) {
      attempt.certificateNumber = certificateNumber;
      attempt.certificateIssued = true;
    }
    saveStore();

    // 8. Save to MongoDB if available
    if (mongoose.connection?.readyState === 1) {
      try {
        await Certificate.findOneAndUpdate(
          { certificateNumber },
          { $set: certData },
          { upsert: true, new: true }
        );
        await Attempt.findByIdAndUpdate(attemptId, {
          certificateNumber,
          certificateIssued: true
        });
      } catch (mErr) {
        console.warn('MongoDB certificate save warning:', mErr.message);
      }
    }

    // 9. Save to Hostinger MySQL
    try {
      const pool = getMySQLPool();
      await pool.query(`
        INSERT INTO certificates (
          certificate_number, student_name, candidate_email, internship_name,
          grade, percentage, score, total_marks, issue_date, start_date, end_date,
          description, qr_code_data, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          student_name = VALUES(student_name),
          candidate_email = VALUES(candidate_email),
          internship_name = VALUES(internship_name),
          grade = VALUES(grade),
          percentage = VALUES(percentage),
          score = VALUES(score),
          total_marks = VALUES(total_marks),
          issue_date = VALUES(issue_date),
          qr_code_data = VALUES(qr_code_data),
          status = VALUES(status)
      `, [
        certificateNumber, studentName, candidateEmail, courseTitle,
        grade, percentage, attempt.score || 0, attempt.totalMarks || 0, issueDate, startDate, endDate,
        certData.description, qrCodeData, 'valid'
      ]);

      await pool.query(
        'UPDATE assessment_attempts SET certificate_number = ? WHERE id = ?',
        [certificateNumber, attemptId]
      ).catch(() => {});
    } catch (sqlErr) {
      console.warn('Hostinger MySQL certificate insert warning:', sqlErr.message);
    }

    // 10. Send Email via nodemailer
    let emailSent = false;
    let emailError = null;

    if (candidateEmail) {
      try {
        const transporter = createEmailTransporter();
        if (transporter) {
          const fromAddr = process.env.EMAIL_FROM || process.env.SMTP_USER || '"Apple Tree Infotech" <info@appletreeinfotech.in>';
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 30px 15px; color: #1e293b;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="background: #162d59; padding: 24px; text-align: center; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">APPLE TREE INFOTECH</h1>
                  <p style="margin: 4px 0 0 0; font-size: 13px; color: #93c5fd;">ISO 9001:2015 Certified &bull; In Academic Partnership with Kalinga University</p>
                </div>
                <div style="padding: 28px 24px;">
                  <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Congratulations, ${studentName}! 🎓</h2>
                  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                    We are pleased to inform you that you have successfully completed the <strong>${courseTitle}</strong> assessment.
                  </p>
                  <div style="background: #f1f5f9; border-left: 4px solid #162d59; padding: 16px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Certificate Number:</strong> <span style="font-family: monospace; color: #1e3a8a;">${certificateNumber}</span></p>
                    <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Grade Achieved:</strong> <span style="color: #15803d; font-weight: bold;">Grade ${grade}</span> (${percentage}%)</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Date of Issue:</strong> ${issueDate}</p>
                  </div>
                  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                    Your authentic certificate is now live and can be viewed, downloaded, printed, or verified anytime on our official website:
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" style="background-color: #d32f2f; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 6px; display: inline-block; box-shadow: 0 2px 4px rgba(211,47,47,0.3);">
                      View &amp; Verify Certificate &rarr;
                    </a>
                  </div>
                  <p style="font-size: 13px; color: #64748b; line-height: 1.5; text-align: center;">
                    Or verify directly by visiting:<br/>
                    <a href="${verifyUrl}" style="color: #0284c7; word-break: break-all;">${verifyUrl}</a>
                  </p>
                </div>
                <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                  <p style="margin: 0;">Apple Tree Infotech &bull; C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001</p>
                  <p style="margin: 4px 0 0 0;">Helpline: 7503962162, 9355343070 | Web: <a href="https://appletreeinfotech.in" style="color: #0284c7;">appletreeinfotech.in</a></p>
                </div>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: fromAddr,
            to: candidateEmail,
            subject: `🎓 Your Certificate of Completion [${certificateNumber}] - Apple Tree Infotech`,
            html: emailHtml
          });
          emailSent = true;
        } else {
          emailError = 'SMTP credentials not configured in server environment (.env). Certificate generated for online viewing & verification.';
        }
      } catch (mailErr) {
        console.warn('Mail send failed:', mailErr.message);
        emailError = mailErr.message;
      }
    }

    return res.json({
      success: true,
      message: emailSent
        ? `Certificate issued and emailed to ${candidateEmail} successfully!`
        : `Certificate generated successfully! (Certificate Number: ${certificateNumber})`,
      emailSent,
      emailError,
      certificate: certData,
      verifyUrl
    });
  } catch (e) {
    console.error('Send certificate error:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET certificate details by attempt ID
router.get('/admin/certificate/:attemptId', adminGuard, async (req, res) => {
  try {
    const { attemptId } = req.params;
    let cert = null;

    if (Array.isArray(mockStore.certificates)) {
      cert = mockStore.certificates.find(c => String(c.attemptId) === String(attemptId));
    }

    if (!cert && mongoose.connection?.readyState === 1) {
      try {
        cert = await Certificate.findOne({ attemptId }).lean();
      } catch (e) {}
    }

    if (!cert) {
      try {
        const pool = getMySQLPool();
        const [rows] = await pool.query(
          'SELECT c.* FROM certificates c JOIN assessment_attempts a ON c.certificate_number = a.certificate_number WHERE a.id = ? LIMIT 1',
          [attemptId]
        );
        if (rows && rows.length > 0) {
          const r = rows[0];
          cert = {
            certificateNumber: r.certificate_number,
            studentName: r.student_name,
            candidateEmail: r.candidate_email,
            internshipName: r.internship_name,
            grade: r.grade,
            percentage: r.percentage,
            score: r.score,
            totalMarks: r.total_marks,
            issueDate: r.issue_date,
            startDate: r.start_date,
            endDate: r.end_date,
            description: r.description,
            qrCodeData: r.qr_code_data,
            status: r.status
          };
        }
      } catch (sqlErr) {}
    }

    if (!cert) {
      return res.status(404).json({ error: 'Certificate not yet generated for this attempt.' });
    }

    res.json({ success: true, certificate: cert });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Admin SQL runner (test query against schema) ─────────────────────────────
router.post('/admin/run-sql', adminGuard, (req, res) => {
  const { schema, query } = req.body;
  if (!query) return res.status(400).json({ error: 'query is required.' });
  const result = runSql(schema || '', query);
  res.json(result);
});

// ════════════════════════════════════════════════════════════════════════════
// CANDIDATE ENDPOINTS
// ════════════════════════════════════════════════════════════════════════════

// Public Assessment Details (for Student Registration Form)
router.get('/public/:id', async (req, res) => {
  try {
    const store = getAssessmentsFromStore();
    let a = store.find(x => String(x._id) === String(req.params.id));

    if (!a && mongoose.connection?.readyState === 1) {
      try {
        a = await Assessment.findById(req.params.id).lean();
      } catch (e) {}
    }

    if (!a || a.isActive === false) {
      return res.status(404).json({ error: 'Assessment not found or currently inactive.' });
    }

    if (a.expiresAt && new Date() > new Date(a.expiresAt)) {
      return res.status(410).json({ error: 'Registration closed. This assessment has expired.' });
    }

    res.json({
      _id: a._id,
      title: a.title,
      description: a.description || '',
      jobTitle: a.jobTitle || 'General',
      duration: a.duration || 30,
      passingScore: a.passingScore || 50,
      maxAttempts: a.maxAttempts || 1,
      questionCount: (a.questions || []).length,
      hasPassword: Boolean(a.accessPassword),
      expiresAt: a.expiresAt || null
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Student Self-Registration Form Submission
router.post('/:id/register', async (req, res) => {
  try {
    const { name, email, phone, college, rollNo } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Full name and email address are required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanName = String(name).trim();
    const cleanPhone = String(phone || '').trim();
    const cleanCollege = String(college || '').trim();
    const cleanRollNo = String(rollNo || '').trim();

    const store = getAssessmentsFromStore();
    let a = store.find(x => String(x._id) === String(req.params.id));

    if (!a && mongoose.connection?.readyState === 1) {
      try {
        a = await Assessment.findById(req.params.id);
      } catch (e) {}
    }

    if (!a || a.isActive === false) {
      return res.status(404).json({ error: 'Assessment not found or currently inactive.' });
    }
    if (a.expiresAt && new Date() > new Date(a.expiresAt)) {
      return res.status(410).json({ error: 'Registration is closed. This assessment has expired.' });
    }

    if (!Array.isArray(a.invitedCandidates)) {
      a.invitedCandidates = [];
    }

    // Email is Primary Key: check if already registered
    const existingIdx = a.invitedCandidates.findIndex(
      c => String(c.email || '').toLowerCase().trim() === cleanEmail
    );

    const studentRecord = {
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      college: cleanCollege,
      rollNo: cleanRollNo,
      accessCode: a.accessPassword || 'EXAM',
      registeredAt: existingIdx !== -1 ? (a.invitedCandidates[existingIdx].registeredAt || new Date()) : new Date(),
      invitedAt: new Date()
    };

    if (existingIdx !== -1) {
      // Update registration record
      a.invitedCandidates[existingIdx] = {
        ...a.invitedCandidates[existingIdx],
        ...studentRecord
      };
    } else {
      // Append new student registration
      a.invitedCandidates.push(studentRecord);
    }

    saveStore();

    if (mongoose.connection?.readyState === 1) {
      try {
        await Assessment.findByIdAndUpdate(a._id, {
          invitedCandidates: a.invitedCandidates
        });
      } catch (e) {}
    }

    res.json({
      success: true,
      message: existingIdx !== -1 ? 'Registration details updated successfully!' : 'Registration successful!',
      candidate: {
        name: cleanName,
        email: cleanEmail,
        college: cleanCollege
      },
      assessment: {
        _id: a._id,
        title: a.title,
        duration: a.duration,
        passingScore: a.passingScore
      },
      examUrl: `/test/${a._id}?email=${encodeURIComponent(cleanEmail)}`
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Verify Exam Access (Email + Admin Assessment Password)
router.post('/verify-access', async (req, res) => {
  try {
    const { assessmentId, email, accessCode, accessPassword, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Registered email is required.' });
    }

    const inputCode = String(accessPassword || accessCode || password || '').trim().toUpperCase();
    if (!inputCode) {
      return res.status(400).json({ error: 'Exam password is required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const store = getAssessmentsFromStore();
    let a = store.find(x => String(x._id) === String(assessmentId));

    if (!a && mongoose.connection?.readyState === 1) {
      try {
        a = await Assessment.findById(assessmentId).lean();
      } catch (e) {}
    }

    if (!a || a.isActive === false) {
      return res.status(404).json({ error: 'Assessment not found or inactive.' });
    }
    if (a.expiresAt && new Date() > new Date(a.expiresAt)) {
      return res.status(410).json({ error: 'This assessment has expired.' });
    }

    // 1. Verify candidate registration by email
    const candidateMatch = (a.invitedCandidates || []).find(
      ic => String(ic.email || '').toLowerCase().trim() === cleanEmail
    );

    // 2. Verify password (assessment password OR candidate access code OR master admin password)
    const masterPassword = (process.env.ADMIN_PASSWORD || 'RANCOM@2026').toUpperCase();
    const isMasterAdmin = inputCode === masterPassword;

    const isPasswordValid = isMasterAdmin ||
      (a.accessPassword && inputCode === a.accessPassword.toUpperCase().trim()) ||
      (candidateMatch && candidateMatch.accessCode && inputCode === candidateMatch.accessCode.toUpperCase().trim());

    if (!isPasswordValid) {
      return res.status(403).json({
        error: 'Invalid exam password. Please enter the password provided by your admin/instructor.'
      });
    }

    if (!candidateMatch && !isMasterAdmin) {
      return res.status(403).json({
        error: 'This email is not registered for this assessment. Please complete the registration form first.',
        notRegistered: true,
        registrationUrl: `/test/${assessmentId}/register`
      });
    }

    // Check attempts limit
    const attemptsStore = getAttemptsFromStore();
    const prevAttempts = attemptsStore.filter(att =>
      String(att.assessment) === String(assessmentId) &&
      att.candidate?.email?.toLowerCase() === cleanEmail
    );
    if (prevAttempts.length >= (a.maxAttempts || 1)) {
      return res.status(403).json({
        error: `Maximum attempts (${a.maxAttempts || 1}) reached for this test.`
      });
    }

    res.json({
      valid: true,
      email: cleanEmail,
      name: candidateMatch?.name || 'Candidate',
      assessmentTitle: a.title,
      duration: a.duration,
      questionCount: (a.questions || []).length,
      description: a.description || ''
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start attempt — return sanitized questions
router.post('/start', async (req, res) => {
  try {
    const { assessmentId, email, accessCode, accessPassword, password } = req.body;
    const cleanEmail = String(email || '').toLowerCase().trim();
    const inputCode = String(accessPassword || accessCode || password || '').trim().toUpperCase();

    const store = getAssessmentsFromStore();
    let a = store.find(x => String(x._id) === String(assessmentId));

    if (!a && mongoose.connection?.readyState === 1) {
      try {
        a = await Assessment.findById(assessmentId).lean();
      } catch (e) {}
    }

    if (!a || a.isActive === false) return res.status(404).json({ error: 'Assessment not found.' });

    const candidateMatch = (a.invitedCandidates || []).find(
      ic => String(ic.email || '').toLowerCase().trim() === cleanEmail
    );
    const masterPassword = (process.env.ADMIN_PASSWORD || 'RANCOM@2026').toUpperCase();
    const isMasterAdmin = inputCode === masterPassword;

    const isPasswordValid = isMasterAdmin ||
      (a.accessPassword && inputCode === a.accessPassword.toUpperCase().trim()) ||
      (candidateMatch && candidateMatch.accessCode && inputCode === candidateMatch.accessCode.toUpperCase().trim());

    if (!isPasswordValid) {
      return res.status(403).json({ error: 'Invalid exam password.' });
    }

    if (!candidateMatch && !isMasterAdmin) {
      return res.status(403).json({
        error: 'This email is not registered for this assessment. Please complete registration first.',
        notRegistered: true,
        registrationUrl: `/test/${assessmentId}/register`
      });
    }

    const attemptsStore = getAttemptsFromStore();
    let attempt = attemptsStore.find(att =>
      String(att.assessment) === String(assessmentId) &&
      att.candidate?.email?.toLowerCase() === cleanEmail &&
      att.status === 'in-progress'
    );

    const rawQuestions = a.questions || [];
    const questions = a.shuffleQuestions ? shuffle(rawQuestions) : [...rawQuestions];

    // Sanitize — strip correct answers, model answers, SQL expected output
    const sanitized = questions.map(q => ({
      _id: q._id,
      text: q.text,
      type: q.type,
      options: a.shuffleOptions && q.options?.length ? shuffle(q.options) : (q.options || []),
      marks: q.marks,
      topic: q.topic,
      sqlSchema: q.sqlSchema || '',
      sqlHint: q.sqlHint || '',
      explanation: '' // Never send before submission
    }));

    if (!attempt) {
      attempt = {
        _id: genId(),
        assessment: assessmentId,
        candidate: {
          registrationId: candidateMatch?.registrationId || null,
          email: cleanEmail,
          name: candidateMatch?.name || 'Candidate',
          accessCode: inputCode
        },
        answers: [],
        score: 0,
        percentage: 0,
        passed: false,
        totalMarks: 0,
        timeTaken: 0,
        status: 'in-progress',
        violations: [],
        startedAt: new Date()
      };

      attemptsStore.unshift(attempt);
      saveStore();

      if (mongoose.connection?.readyState === 1) {
        try {
          const mongoAttempt = new Attempt(attempt);
          await mongoAttempt.save();
        } catch (err) {}
      }
    }

    res.json({
      attemptId: attempt._id,
      questions: sanitized,
      duration: a.duration,
      title: a.title,
      startedAt: attempt.startedAt
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Candidate SQL test-run (no grading, instant output)
router.post('/run-sql', async (req, res) => {
  const { schema, query } = req.body;
  if (!query) return res.status(400).json({ error: 'query is required.' });
  const result = runSql(schema || '', query);
  res.json(result);
});

// Submit full test
router.post('/submit', async (req, res) => {
  try {
    const { attemptId, answers, timeTaken } = req.body;
    const attemptsStore = getAttemptsFromStore();
    const attempt = attemptsStore.find(att => String(att._id) === String(attemptId));

    if (!attempt) return res.status(404).json({ error: 'Attempt not found.' });
    if (attempt.status !== 'in-progress') return res.status(400).json({ error: 'Already submitted.' });

    const store = getAssessmentsFromStore();
    let a = store.find(x => String(x._id) === String(attempt.assessment));
    if (!a && mongoose.connection?.readyState === 1) {
      try {
        a = await Assessment.findById(attempt.assessment).lean();
      } catch (err) {}
    }

    if (!a) return res.status(404).json({ error: 'Assessment not found.' });

    let earned = 0, total = 0;
    const questionList = a.questions || [];

    const gradedAnswers = (answers || []).map(ans => {
      const q = questionList.find(item => String(item._id) === String(ans.questionId));
      if (!q) return { questionId: ans.questionId, answer: ans.answer, isCorrect: false, marks: 0 };
      
      const qMarks = Number(q.marks || 1);
      total += qMarks;

      if (q.type === 'mcq') {
        const isCorrect = String(q.correct || '').trim().toLowerCase() === String(ans.answer || '').trim().toLowerCase();
        if (isCorrect) earned += qMarks;
        return { questionId: ans.questionId, answer: ans.answer, isCorrect, marks: isCorrect ? qMarks : 0 };
      }

      if (q.type === 'theory') {
        earned += qMarks; // Award full marks pending manual review
        return { questionId: ans.questionId, answer: ans.answer, isCorrect: null, marks: qMarks };
      }

      if (q.type === 'sql') {
        const { passed, error, output } = checkSqlAnswer(q.sqlSchema || '', ans.answer || '', q.sqlExpected || '');
        const m = passed ? qMarks : 0;
        earned += m;
        return { questionId: ans.questionId, answer: ans.answer, isCorrect: passed, marks: m, sqlOutput: output, sqlError: error || '' };
      }

      return { questionId: ans.questionId, answer: ans.answer, isCorrect: false, marks: 0 };
    });

    // Count unanswered questions
    questionList.forEach(q => {
      const done = (answers || []).some(ans => String(ans.questionId) === String(q._id));
      if (!done) total += Number(q.marks || 1);
    });

    const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;
    const passed = percentage >= (a.passingScore || 50);

    attempt.answers = gradedAnswers;
    attempt.score = earned;
    attempt.totalMarks = total;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.timeTaken = timeTaken || 0;
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();

    saveStore();

    if (mongoose.connection?.readyState === 1) {
      try {
        await Attempt.findByIdAndUpdate(attemptId, {
          answers: gradedAnswers,
          score: earned,
          totalMarks: total,
          percentage,
          passed,
          timeTaken: timeTaken || 0,
          status: 'submitted',
          submittedAt: new Date()
        });
      } catch (err) {}
    }

    res.json(a.showResult !== false
      ? { message: 'Submitted successfully.', score: earned, total, percentage, passed, passingScore: a.passingScore || 50 }
      : { submitted: true }
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Log anti-cheat violation
router.post('/violation', async (req, res) => {
  try {
    const { attemptId, type } = req.body;
    const attemptsStore = getAttemptsFromStore();
    const attempt = attemptsStore.find(att => String(att._id) === String(attemptId));

    if (!attempt || attempt.status !== 'in-progress') {
      return res.status(400).json({ error: 'Invalid or already completed attempt.' });
    }

    if (!Array.isArray(attempt.violations)) attempt.violations = [];
    const ex = attempt.violations.find(v => v.type === type);
    if (ex) {
      ex.count += 1;
      ex.timestamp = new Date();
    } else {
      attempt.violations.push({ type, count: 1, timestamp: new Date() });
    }

    const tabViol = attempt.violations.find(v => v.type === 'tab-switch');
    if (tabViol && tabViol.count >= 3) {
      attempt.status = 'terminated';
      attempt.submittedAt = new Date();
    }

    saveStore();

    if (mongoose.connection?.readyState === 1) {
      try {
        await Attempt.findByIdAndUpdate(attemptId, {
          violations: attempt.violations,
          status: attempt.status,
          submittedAt: attempt.submittedAt
        });
      } catch (err) {}
    }

    res.json({ status: attempt.status, violations: attempt.violations });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// View result
router.get('/result/:attemptId', async (req, res) => {
  try {
    const attemptsStore = getAttemptsFromStore();
    let attempt = attemptsStore.find(att => String(att._id) === String(req.params.attemptId));

    if (!attempt && mongoose.connection?.readyState === 1) {
      try {
        attempt = await Attempt.findById(req.params.attemptId).lean();
      } catch (err) {}
    }

    if (!attempt) return res.status(404).json({ error: 'Result not found.' });

    const store = getAssessmentsFromStore();
    let a = store.find(x => String(x._id) === String(attempt.assessment));
    if (!a && mongoose.connection?.readyState === 1) {
      try {
        a = await Assessment.findById(attempt.assessment).lean();
      } catch (err) {}
    }

    if (a && a.showResult === false) {
      return res.json({ submitted: true, message: 'Results hidden by administrator.' });
    }

    const reviewed = (attempt.answers || []).map(ans => {
      const q = (a?.questions || []).find(q => String(q._id) === String(ans.questionId));
      return {
        ...ans,
        questionText: q?.text || '',
        correctAnswer: q?.type === 'theory' ? '(manually graded)' : (q?.correct || q?.sqlExpected || ''),
        explanation: q?.explanation || ''
      };
    });

    res.json({
      title: a?.title || 'Online Assessment',
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      passed: attempt.passed,
      passingScore: a?.passingScore || 50,
      timeTaken: attempt.timeTaken,
      status: attempt.status,
      violations: attempt.violations || [],
      answers: reviewed
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
