import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import pdf from 'html-pdf-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Generate course completion certificate
// @route   GET /api/lms/courses/:id/certificate
// @access  Private
export const generateCertificate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // Check if enrolled and completed
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: id,
    status: 'completed'
  }).populate('course', 'title instructor');
  
  if (!enrollment) {
    return next(new ErrorResponse('Course not completed or not enrolled', 403));
  }
  
  const course = enrollment.course;
  const user = req.user;
  
  // Generate certificate HTML
  const certificateHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Certificate of Completion</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .certificate {
          width: 800px;
          height: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }
        .certificate-content {
          position: absolute;
          top: 50px;
          left: 50px;
          right: 50px;
          bottom: 50px;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header h1 {
          color: #333;
          font-size: 36px;
          margin: 0;
          font-weight: bold;
        }
        .header p {
          color: #666;
          font-size: 18px;
          margin: 10px 0 0 0;
        }
        .main-content {
          text-align: center;
          margin: 40px 0;
        }
        .main-content h2 {
          color: #333;
          font-size: 28px;
          margin: 20px 0;
          font-weight: normal;
        }
        .student-name {
          font-size: 42px;
          color: #667eea;
          font-weight: bold;
          margin: 20px 0;
          padding: 10px;
          border-bottom: 2px solid #667eea;
          display: inline-block;
        }
        .course-title {
          font-size: 24px;
          color: #333;
          margin: 20px 0;
        }
        .details {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .detail-item {
          text-align: center;
        }
        .detail-item h3 {
          color: #666;
          font-size: 16px;
          margin: 0 0 10px 0;
          font-weight: normal;
        }
        .detail-item p {
          color: #333;
          font-size: 18px;
          margin: 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          color: #666;
          font-size: 14px;
        }
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 120px;
          color: rgba(102, 126, 234, 0.1);
          font-weight: bold;
          z-index: 1;
          white-space: nowrap;
        }
        .signature {
          margin-top: 40px;
          text-align: center;
        }
        .signature-line {
          width: 300px;
          height: 1px;
          background: #333;
          margin: 20px auto;
        }
        .signature-name {
          font-size: 18px;
          color: #333;
          font-weight: bold;
        }
        .signature-title {
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="watermark">CERTIFICATE</div>
        <div class="certificate-content">
          <div class="header">
            <h1>CERTIFICATE OF COMPLETION</h1>
            <p>This is to certify that</p>
          </div>
          
          <div class="main-content">
            <div class="student-name">${req.user.name}</div>
            <p>has successfully completed the course</p>
            <div class="course-title">${course.title}</div>
          </div>
          
          <div class="details">
            <div class="detail-item">
              <h3>Date of Completion</h3>
              <p>${new Date(enrollment.completedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            
            <div class="detail-item">
              <h3>Certificate ID</h3>
              <p>${enrollment._id.toString().slice(-8).toUpperCase()}</p>
            </div>
            
            <div class="detail-item">
              <h3>Issued On</h3>
              <p>${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
          
          <div class="signature">
            <div class="signature-line"></div>
            <div class="signature-name">Pranidha International School</div>
            <div class="signature-title">Kindergarten Learning Platform</div>
          </div>
          
          <div class="footer">
            <p>This certificate verifies the successful completion of the course as part of our early learning program.</p>
            <p>Verify this certificate at: learning.pranidha.com/verify/${enrollment._id}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Generate PDF from HTML
  const options = {
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  };
  
  const file = { content: certificateHtml };
  
  try {
    const pdfBuffer = await pdf.generatePdf(file, options);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${course.title.replace(/\s+/g, '-').toLowerCase()}-${user.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`);
    
    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return next(new ErrorResponse('Failed to generate PDF certificate', 500));
  }
});

// @desc    Generate course syllabus PDF
// @route   GET /api/lms/courses/:id/syllabus
// @access  Public
export const generateSyllabus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  const course = await Course.findById(id)
    .populate('instructor', 'name qualifications');
  
  if (!course) {
    return next(new ErrorResponse('Course not found', 404));
  }
  
  const modules = await Module.find({ course: id, isPublished: true })
    .sort('order')
    .populate({
      path: 'lessons',
      match: { isPublished: true },
      options: { sort: { order: 1 } }
    });
  
  // Generate syllabus HTML
  const syllabusHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${course.title} - Syllabus</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 40px;
          background-color: #f5f5f5;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #667eea;
        }
        .header h1 {
          color: #333;
          font-size: 32px;
          margin: 0 0 10px 0;
        }
        .header .subtitle {
          color: #666;
          font-size: 18px;
          margin: 0;
        }
        .course-info {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .info-item {
          margin-bottom: 10px;
        }
        .info-item strong {
          color: #667eea;
        }
        .modules {
          margin-top: 40px;
        }
        .module {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
        }
        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
        }
        .module-title {
          font-size: 20px;
          color: #333;
          margin: 0;
        }
        .lessons {
          margin-left: 20px;
        }
        .lesson {
          margin-bottom: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 5px;
        }
        .lesson-title {
          font-size: 16px;
          color: #333;
          margin: 0 0 5px 0;
        }
        .lesson-duration {
          font-size: 14px;
          color: #666;
        }
        .learning-outcomes {
          margin-top: 40px;
          padding: 20px;
          background: #e8f4f8;
          border-radius: 8px;
        }
        .learning-outcomes h3 {
          color: #2196f3;
          margin-top: 0;
        }
        .outcome-list {
          margin-left: 20px;
        }
        .outcome-list li {
          margin-bottom: 8px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 14px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${course.title}</h1>
          <p class="subtitle">Course Syllabus</p>
        </div>
        
        <div class="course-info">
          <div class="info-item">
            <strong>Instructor:</strong> ${course.instructor?.name || 'TBA'}
          </div>
          <div class="info-item">
            <strong>Course Level:</strong> ${course.level}
          </div>
          <div class="info-item">
            <strong>Total Duration:</strong> ${course.totalDuration || 0} minutes
          </div>
          <div class="info-item">
            <strong>Total Lessons:</strong> ${course.totalLessons || 0}
          </div>
          <div class="info-item">
            <strong>Category:</strong> ${course.category.replace('-', ' ')}
          </div>
        </div>
        
        <div class="description">
          <h3>Course Description</h3>
          <p>${course.detailedDescription || course.description}</p>
        </div>
        
        <div class="modules">
          <h3>Course Modules</h3>
          ${modules.map((module, index) => `
            <div class="module">
              <div class="module-header">
                <h4 class="module-title">Module ${index + 1}: ${module.title}</h4>
                <span>${module.lessons?.length || 0} lessons</span>
              </div>
              <div class="lessons">
                ${module.lessons?.map((lesson, lessonIndex) => `
                  <div class="lesson">
                    <h5 class="lesson-title">Lesson ${lessonIndex + 1}: ${lesson.title}</h5>
                    <p class="lesson-duration">Duration: ${Math.round((lesson.videoDuration || 0) / 60)} minutes</p>
                    ${lesson.description ? `<p>${lesson.description}</p>` : ''}
                  </div>
                `).join('') || '<p>No lessons available in this module.</p>'}
              </div>
            </div>
          `).join('')}
        </div>
        
        ${course.learningOutcomes && course.learningOutcomes.length > 0 ? `
          <div class="learning-outcomes">
            <h3>Learning Outcomes</h3>
            <ul class="outcome-list">
              ${course.learningOutcomes.map(outcome => `<li>${outcome}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Pranidha International School Kindergarten Learning Platform</p>
          <p>© ${new Date().getFullYear()} - All rights reserved</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Generate PDF from HTML
  const options = {
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  };
  
  const file = { content: syllabusHtml };
  
  try {
    const pdfBuffer = await pdf.generatePdf(file, options);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="syllabus-${course.title.replace(/\s+/g, '-').toLowerCase()}.pdf"`);
    
    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return next(new ErrorResponse('Failed to generate PDF syllabus', 500));
  }
});

// @desc    Download course notes as PDF
// @route   GET /api/lms/courses/:id/notes-pdf
// @access  Private
export const downloadNotesPDF = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // Check if enrolled
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: id
  });
  
  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }
  
  // Get all notes for this course
  const Note = (await import('../models/Note.js')).default;
  const notes = await Note.find({
    user: req.user.id,
    course: id
  }).sort('-createdAt');
  
  // Generate notes HTML
  const notesHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>My Course Notes</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 40px;
          background-color: #f5f5f5;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #667eea;
        }
        .header h1 {
          color: #333;
          font-size: 32px;
          margin: 0 0 10px 0;
        }
        .note {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          page-break-inside: avoid;
        }
        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e9ecef;
        }
        .note-title {
          font-size: 18px;
          color: #333;
          margin: 0;
        }
        .note-meta {
          font-size: 14px;
          color: #666;
        }
        .note-content {
          font-size: 16px;
          line-height: 1.6;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 14px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>My Course Notes</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
        
        ${notes.length > 0 ? notes.map((note, index) => `
          <div class="note">
            <div class="note-header">
              <h3 class="note-title">Note ${index + 1}</h3>
              <div class="note-meta">
                ${note.timestamp > 0 ? `Video Time: ${Math.floor(note.timestamp / 60)}:${(note.timestamp % 60).toString().padStart(2, '0')}` : ''}
              </div>
            </div>
            <div class="note-content">
              ${note.content.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
          </div>
        `).join('') : `
          <div class="note">
            <p>No notes available for this course.</p>
          </div>
        `}
        
        <div class="footer">
          <p>Pranidha International School Kindergarten Learning Platform</p>
          <p>© ${new Date().getFullYear()} - All rights reserved</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Generate PDF from HTML
  const options = {
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  };
  
  const file = { content: notesHtml };
  
  try {
    const pdfBuffer = await pdf.generatePdf(file, options);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="course-notes-${id}.pdf"`);
    
    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return next(new ErrorResponse('Failed to generate PDF notes', 500));
  }
});