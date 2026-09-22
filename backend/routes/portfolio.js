import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMySQLPool } from '../config/mysql.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const PORTFOLIOS_FILE = path.join(DATA_DIR, 'portfolios.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to load portfolios
function loadPortfoliosFromDisk() {
  try {
    if (fs.existsSync(PORTFOLIOS_FILE)) {
      const data = fs.readFileSync(PORTFOLIOS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading portfolios.json:', e.message);
  }
  return {};
}

// Helper to save portfolios
function savePortfoliosToDisk(data) {
  try {
    fs.writeFileSync(PORTFOLIOS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving portfolios.json:', e.message);
  }
}

// Ensure database table exists if MySQL is available
async function ensurePortfolioTable() {
  const pool = getMySQLPool();
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_portfolios (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255),
        student_name VARCHAR(255),
        slug VARCHAR(100),
        data_json LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } catch (err) {
    console.warn('MySQL student_portfolios table check:', err.message);
  }
}
ensurePortfolioTable().catch(() => {});

/* ─────────────────────────────────────────────────────────────────────────────
   1. AI TEXT ENHANCEMENT WITH GEMINI (with smart fallbacks)
   POST /api/portfolio/ai-enhance
───────────────────────────────────────────────────────────────────────────── */
router.post('/ai-enhance', async (req, res) => {
  try {
    const { field, text, name, role, focus } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || process.env.VITE_GEMINI_API_KEY;

    // Build prompt based on field requested
    let systemInstruction = '';
    let userPrompt = '';

    if (field === 'headline') {
      systemInstruction = 'You are an elite creative director and editorial copywriter. Generate a high-impact, two-part editorial headline (Title + Subtitle) for a portfolio poster. The first part must be 2-4 punchy words (e.g., "Design With Purpose.", "Code With Vision.", "Architecting The Future."). The second part must be a single elegant subtitle phrase. Return ONLY valid JSON with keys "title" and "subtitle".';
      userPrompt = `Student Name: ${name || 'Student'}\nTarget Role: ${role || 'Full Stack Engineer'}\nDraft: "${text || focus || 'creative developer'}"`;
    } else if (field === 'project') {
      systemInstruction = 'You are a senior tech lead and portfolio curator. Polish the student\'s project description into an articulate, impressive showcase summary (30-50 words) highlighting technical execution, architecture, and impact. Return ONLY valid JSON with keys "title" (cleaned 2-4 word project title), "category" (e.g., "Full Stack", "AI / ML", "Mobile App", "Cloud SaaS"), "subtitle" (e.g., "Scalable Distributed System"), and "description".';
      userPrompt = `Project Draft: "${text}"\nRole: ${role || 'Developer'}`;
    } else if (field === 'experience') {
      systemInstruction = 'You are an executive resume writer and career coach. Polish the work/internship experience description into 2-3 high-impact, bullet-style action sentences focusing on achievements, performance metrics, and tech stack impact. Return ONLY valid JSON with key "description".';
      userPrompt = `Experience Draft: "${text}"\nRole/Title: ${role || 'Software Engineer'}`;
    } else if (field === 'quote') {
      systemInstruction = 'You are an inspirational tech and design philosopher. Create a memorable, powerful one-sentence personal philosophy or engineering quote (maximum 12 words) that sounds confident and iconic (like "GOOD DESIGN IS STRATEGY MADE VISIBLE" or "CLEAN ARCHITECTURE IS SILENT EXCELLENCE"). Return ONLY valid JSON with key "quote".';
      userPrompt = `Student Role: ${role || 'Developer'}\nStudent Draft / Theme: "${text || 'passion for code and design'}"`;
    } else if (field === 'skills') {
      systemInstruction = 'You are a senior tech recruiter and portfolio curator. Transform the student\'s raw skills list into 4 distinct, high-impact service/skill capsules. Each capsule must have a short uppercase title (2-3 words, e.g., "BACKEND ARCHITECTURE", "SYSTEM DESIGN", "CLOUD DEPLOYMENT", "ALGORITHM OPTIMIZATION") and a single concise benefit sentence (e.g. "Scalable microservices with fault-tolerant delivery."). Return ONLY valid JSON with key "skills" as an array of 4 objects { "title": string, "description": string }.';
      userPrompt = `Skills Draft: "${text || 'Java, Spring Boot, React, Node.js, SQL, AWS, Algorithms'}"\nRole: ${role || 'Full Stack Developer'}`;
    } else {
      // Default: bio / summary
      systemInstruction = 'You are an elite editorial writer. Rewrite the provided draft bio into a modern, minimalist, impactful personal summary (25 to 45 words maximum) for a high-end portfolio poster. It must sound confident, articulate, and inspiring. Return ONLY valid JSON with key "bio".';
      userPrompt = `Student Name: ${name || 'Student'}\nRole: ${role || 'Software Engineer'}\nRaw Bio: "${text || 'I love coding and building practical web apps.'}"`;
    }

    let aiResult = null;

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nTask:\n${userPrompt}` }]
              }
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 500
            }
          })
        });

        const data = await response.json();
        if (response.ok) {
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanedText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
          aiResult = JSON.parse(cleanedText);
        }
      } catch (aiErr) {
        console.warn('Gemini API call failed, utilizing intelligent fallback:', aiErr.message);
      }
    }

    // Heuristic fallbacks if AI is unavailable or fails JSON parse
    if (!aiResult) {
      if (field === 'headline') {
        const titlePresets = [
          { title: 'Design With Purpose.', subtitle: 'Crafting scalable systems that inspire people and elevate products.' },
          { title: 'Code With Vision.', subtitle: 'Architecting resilient cloud solutions from foundation to deployment.' },
          { title: 'Build For Impact.', subtitle: 'Transforming complex algorithmic challenges into seamless human experiences.' },
          { title: 'Engineering Excellence.', subtitle: 'Focused on high-concurrency microservices, clean code, and intuitive design.' }
        ];
        aiResult = titlePresets[Math.floor(Math.random() * titlePresets.length)];
      } else if (field === 'quote') {
        const quotePresets = [
          'GOOD ARCHITECTURE IS STRATEGY MADE EXECUTABLE.',
          'CLEAN CODE IS NOT AN OPTION; IT IS A REPUTATION.',
          'SIMPLICITY IS THE PREREQUISITE FOR RELIABILITY.',
          'THE BEST SYSTEMS SOLVE COMPLEX PROBLEMS WITH QUIET ELEGANCE.'
        ];
        aiResult = { quote: quotePresets[Math.floor(Math.random() * quotePresets.length)] };
      } else if (field === 'skills') {
        aiResult = {
          skills: [
            { title: 'CORE ARCHITECTURE', description: 'Enterprise backend services, scalable data structures, and algorithms.' },
            { title: 'FULL-STACK DELIVERY', description: 'Modern, responsive user interfaces paired with robust REST APIs.' },
            { title: 'CLOUD & DEVOPS', description: 'Automated CI/CD pipelines, containerization, and cloud deployment.' },
            { title: 'SYSTEM DESIGN', description: 'High-availability architecture, caching strategies, and database optimization.' }
          ]
        };
      } else {
        aiResult = {
          bio: 'I engineer robust, meaningful digital products and scalable systems that solve real-world problems with precision, elegance, and unwavering dedication.'
        };
      }
    }

    return res.json({
      success: true,
      data: aiResult
    });

  } catch (err) {
    console.error('Portfolio AI Enhance error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   2. SAVE PORTFOLIO
   POST /api/portfolio/save
───────────────────────────────────────────────────────────────────────────── */
router.post('/save', async (req, res) => {
  try {
    const portfolioData = req.body;
    if (!portfolioData) {
      return res.status(400).json({ success: false, error: 'Portfolio data is required' });
    }

    const id = portfolioData.id || `portfolio-${Date.now()}`;
    const email = portfolioData.email || '';
    const studentName = portfolioData.name || 'Student Candidate';
    const slug = portfolioData.slug || studentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || id;

    const payload = {
      ...portfolioData,
      id,
      slug,
      updatedAt: new Date().toISOString()
    };

    // 1. Save to disk cache
    const diskMap = loadPortfoliosFromDisk();
    diskMap[id] = payload;
    if (slug) diskMap[slug] = payload;
    savePortfoliosToDisk(diskMap);

    // 2. Save to MySQL if connected
    const pool = getMySQLPool();
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO student_portfolios (id, email, student_name, slug, data_json)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             email = VALUES(email),
             student_name = VALUES(student_name),
             slug = VALUES(slug),
             data_json = VALUES(data_json)`,
          [id, email, studentName, slug, JSON.stringify(payload)]
        );
      } catch (dbErr) {
        console.warn('Could not save portfolio to MySQL, cached locally:', dbErr.message);
      }
    }

    return res.json({
      success: true,
      id,
      slug,
      portfolio: payload
    });

  } catch (err) {
    console.error('Save portfolio error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   3. GET PORTFOLIO BY ID / SLUG
   GET /api/portfolio/:id
───────────────────────────────────────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Identifier required' });
    }

    // 1. Check MySQL
    const pool = getMySQLPool();
    if (pool) {
      try {
        const [rows] = await pool.query(
          `SELECT data_json FROM student_portfolios WHERE id = ? OR slug = ? OR email = ? LIMIT 1`,
          [id, id, id]
        );
        if (rows && rows.length > 0 && rows[0].data_json) {
          const parsed = JSON.parse(rows[0].data_json);
          return res.json({ success: true, portfolio: parsed });
        }
      } catch (dbErr) {
        console.warn('MySQL portfolio lookup fallback:', dbErr.message);
      }
    }

    // 2. Check Disk Cache
    const diskMap = loadPortfoliosFromDisk();
    const found = diskMap[id] || Object.values(diskMap).find(p => p.slug === id || p.email === id);
    if (found) {
      return res.json({ success: true, portfolio: found });
    }

    return res.status(404).json({ success: false, error: 'Portfolio not found' });

  } catch (err) {
    console.error('Get portfolio error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
