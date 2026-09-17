import jwt from 'jsonwebtoken';
import { getExamModels } from '../models/exam/index.js';
import mockStore from '../config/mockStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pranidha_secret_key_987654321';

// Protect student exam sessions
export const protectExamStudent = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (decoded.role !== 'student' && !decoded.studentId) {
        return res.status(403).json({ success: false, message: 'Access denied. Valid student credential required.' });
      }

      const { ExamStudent, ExamStudentAccess, Exam } = getExamModels();
      const student = await ExamStudent.findByPk(decoded.studentId);
      if (!student || student.status !== 'ACTIVE') {
        return res.status(401).json({ success: false, message: 'Student account is inactive or not found.' });
      }

      const access = await ExamStudentAccess.findByPk(decoded.accessId, {
        include: [{ model: Exam, as: 'exam' }]
      });

      if (!access || access.status !== 'ACTIVE') {
        return res.status(403).json({ success: false, message: 'Test access has expired or been revoked.' });
      }

      req.student = student;
      req.examAccess = access;
      req.currentExam = access.exam;
      req.tokenPayload = decoded;

      return next();
    } catch (err) {
      console.error('Exam auth error:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired examination session token.' });
    }
  }

  return res.status(401).json({ success: false, message: 'Authentication required. No session token provided.' });
};

// Protect admin examination management endpoints
export const protectExamAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Support existing admin auth format or decoded user role
      if (decoded.role === 'admin' || decoded.role === 'teacher' || decoded.role === 'super_admin') {
        req.adminUser = decoded;
        return next();
      }

      // Check user record from mockStore or MySQL
      const user = await mockStore.findById('users', decoded.id);
      if (user && (user.role === 'admin' || user.role === 'teacher')) {
        req.adminUser = user;
        return next();
      }

      return res.status(403).json({ success: false, message: 'Admin or instructor privileges required.' });
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired administrative authorization token.' });
    }
  }

  return res.status(401).json({ success: false, message: 'Admin authentication required.' });
};

export default {
  protectExamStudent,
  protectExamAdmin
};
