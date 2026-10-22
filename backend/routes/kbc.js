import express from 'express';
import { getMySQLPool } from '../config/mysql.js';
import { generateKbcQuestionWithGemini } from '../utils/kbcAi.js';

const router = express.Router();

// ── Default Curated MERN & SQL Questions (16 Levels, 3 Questions Each = 48 Questions) ──
// ── 1,000+ Pure SQL Question Bank (16 Levels, 63 Questions per level = 1,008 Questions) ──
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlBankPath = path.resolve(__dirname, '../data/sqlQuestionBank1000.json');
export let SQL_QUESTION_BANK = [];
try {
  if (fs.existsSync(sqlBankPath)) {
    SQL_QUESTION_BANK = JSON.parse(fs.readFileSync(sqlBankPath, 'utf8'));
  }
} catch (e) {
  console.warn('Failed to load sqlQuestionBank1000.json:', e.message);
}

export const DEFAULT_SQL_QUESTIONS = {};
for (let lvl = 1; lvl <= 16; lvl++) {
  DEFAULT_SQL_QUESTIONS[lvl] = SQL_QUESTION_BANK.filter(q => q.level === lvl);
}

// Backward compatibility alias for any component expecting DEFAULT_MERN_SQL_QUESTIONS
export const DEFAULT_MERN_SQL_QUESTIONS = DEFAULT_SQL_QUESTIONS;

// ── In-Memory Fallback State (Active only if Hostinger MySQL is momentarily unreachable) ──
let memoryStore = {
  activeSelections: (() => {
    const s = {};
    for (let l = 1; l <= 16; l++) {
      const list = DEFAULT_SQL_QUESTIONS[l] || [];
      s[l] = list[0]?.id || `sql_l${l}_001`;
    }
    return s;
  })(),
  customQuestions: {},
  updatedAt: new Date().toISOString()
};

// ── Ensure Hostinger MySQL Table & Seed 1,000+ SQL Questions ──
let tableEnsured = false;
async function ensureKbcTable() {
  if (tableEnsured) return true;
  const pool = getMySQLPool();
  if (!pool) return false;

  try {
    // 1. Create table with Hostinger MySQL standard engine
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kbc_questions (
        id VARCHAR(100) PRIMARY KEY,
        level INT NOT NULL,
        topic VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        options_json LONGTEXT NOT NULL,
        correct INT NOT NULL,
        explanation TEXT,
        is_custom TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_kbc_level (level),
        INDEX idx_kbc_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Remove legacy MERN seeded questions (ids like 'q-%')
    try {
      await pool.query("DELETE FROM kbc_questions WHERE id LIKE 'q-%'");
    } catch (e) {}

    // 3. Check total question count in database
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM kbc_questions');
    const total = rows[0]?.total || 0;

    if (total < 500 && SQL_QUESTION_BANK.length > 0) {
      console.log(`Seeding ${SQL_QUESTION_BANK.length} pure SQL questions into Hostinger MySQL kbc_questions table...`);
      const batchSize = 50;
      for (let i = 0; i < SQL_QUESTION_BANK.length; i += batchSize) {
        const batch = SQL_QUESTION_BANK.slice(i, i + batchSize);
        const values = [];
        const placeholders = batch.map(q => {
          const isActive = q.id.endsWith('_001') ? 1 : 0;
          values.push(
            q.id,
            q.level,
            q.topic,
            q.question,
            JSON.stringify(q.options),
            q.correct,
            q.explanation || '',
            0,
            isActive
          );
          return '(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        }).join(', ');

        await pool.query(`
          INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active)
          VALUES ${placeholders}
          ON DUPLICATE KEY UPDATE 
            question = VALUES(question),
            options_json = VALUES(options_json),
            correct = VALUES(correct),
            explanation = VALUES(explanation),
            topic = VALUES(topic);
        `, values);
      }

      // Ensure exactly one active question per level
      for (let lvl = 1; lvl <= 16; lvl++) {
        const [activeRows] = await pool.query('SELECT id FROM kbc_questions WHERE level = ? AND is_active = 1', [lvl]);
        if (activeRows.length === 0) {
          await pool.query('UPDATE kbc_questions SET is_active = 1 WHERE level = ? ORDER BY id ASC LIMIT 1', [lvl]);
        } else if (activeRows.length > 1) {
          const keepId = activeRows[0].id;
          await pool.query('UPDATE kbc_questions SET is_active = 0 WHERE level = ? AND id != ?', [lvl, keepId]);
        }
      }
      console.log(`✔ Successfully seeded ${SQL_QUESTION_BANK.length} SQL questions into Hostinger MySQL!`);
    }

    tableEnsured = true;
    return true;
  } catch (err) {
    console.warn('Hostinger MySQL kbc_questions table initialization notice:', err.message);
    return false;
  }
}

// Initial check on module load
ensureKbcTable().catch(() => {});


// ── 1. PUBLIC: Get Active 16 KBC Exam Questions for Game ──
router.get('/questions', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      // Fetch 16 active questions
      const [activeRows] = await pool.query(`
        SELECT id, level, topic, question, options_json, correct, explanation 
        FROM kbc_questions 
        WHERE is_active = 1 
        ORDER BY level ASC
      `);

      // Fetch alternates for Flip-the-Question lifeline
      const [altRows] = await pool.query(`
        SELECT id, level, topic, question, options_json, correct, explanation 
        FROM kbc_questions 
        WHERE is_active = 0 
        ORDER BY level ASC, created_at ASC
      `);

      if (activeRows.length >= 16) {
        const activeQuestions = activeRows.map(row => ({
          level: row.level,
          id: row.id,
          topic: row.topic,
          question: row.question,
          options: typeof row.options_json === 'string' ? JSON.parse(row.options_json) : row.options_json,
          correct: row.correct,
          explanation: row.explanation
        }));

        const flipPool = {};
        altRows.forEach(row => {
          if (!flipPool[row.level]) {
            flipPool[row.level] = {
              level: row.level,
              id: row.id,
              topic: row.topic,
              question: row.question,
              options: typeof row.options_json === 'string' ? JSON.parse(row.options_json) : row.options_json,
              correct: row.correct,
              explanation: row.explanation
            };
          }
        });

        return res.json({
          success: true,
          questions: activeQuestions,
          flipPool,
          source: 'Hostinger MySQL Database'
        });
      }
    }
  } catch (err) {
    console.warn('MySQL /questions error, using fallback:', err.message);
  }

  // Fallback to in-memory MERN & SQL dataset
  const activeQuestions = [];
  const flipPool = {};
  for (let lvl = 1; lvl <= 16; lvl++) {
    const list = DEFAULT_MERN_SQL_QUESTIONS[lvl];
    const activeId = memoryStore.activeSelections[lvl];
    const customList = memoryStore.customQuestions[lvl] || [];
    const all = [...list, ...customList];
    const selected = all.find(q => q.id === activeId) || all[0];
    const alternate = all.find(q => q.id !== selected.id) || null;

    activeQuestions.push({
      level: lvl,
      id: selected.id,
      topic: selected.topic,
      question: selected.question,
      options: selected.options,
      correct: selected.correct,
      explanation: selected.explanation
    });
    flipPool[lvl] = alternate;
  }

  return res.json({
    success: true,
    questions: activeQuestions,
    flipPool,
    source: 'Memory Fallback'
  });
});

// ── 2. ADMIN: Get All Available Questions Pool & Active Selections from Hostinger MySQL ──
router.get('/admin/all', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      const [allRows] = await pool.query(`
        SELECT id, level, topic, question, options_json, correct, explanation, is_custom, is_active, created_at 
        FROM kbc_questions 
        ORDER BY level ASC, is_active DESC, created_at ASC
      `);

      if (allRows && allRows.length > 0) {
        const levels = {};
        for (let lvl = 1; lvl <= 16; lvl++) {
          const poolForLevel = allRows
            .filter(r => r.level === lvl)
            .map(r => ({
              id: r.id,
              level: r.level,
              topic: r.topic,
              question: r.question,
              options: typeof r.options_json === 'string' ? JSON.parse(r.options_json) : r.options_json,
              correct: r.correct,
              explanation: r.explanation,
              isCustom: Boolean(r.is_custom),
              isActive: Boolean(r.is_active)
            }));

          const activeQ = poolForLevel.find(q => q.isActive) || poolForLevel[0];
          levels[lvl] = {
            level: lvl,
            activeQuestionId: activeQ ? activeQ.id : null,
            activeQuestion: activeQ,
            pool: poolForLevel
          };
        }

        return res.json({
          success: true,
          levels,
          source: 'Hostinger MySQL Database'
        });
      }
    }
  } catch (err) {
    console.warn('MySQL /admin/all error, using fallback:', err.message);
  }

  // Fallback
  const levels = {};
  for (let lvl = 1; lvl <= 16; lvl++) {
    const defaultPool = DEFAULT_MERN_SQL_QUESTIONS[lvl] || [];
    const customPool = memoryStore.customQuestions[lvl] || [];
    const allPool = [...defaultPool, ...customPool];
    const activeId = memoryStore.activeSelections[lvl] || (allPool[0] ? allPool[0].id : null);

    levels[lvl] = {
      level: lvl,
      activeQuestionId: activeId,
      activeQuestion: allPool.find(q => q.id === activeId) || allPool[0],
      pool: allPool
    };
  }

  res.json({
    success: true,
    levels,
    source: 'Memory Fallback'
  });
});

// ── 2B. ADMIN: Paginated / Filterable Question Bank (1,000+ SQL Questions) ──
router.get('/admin/bank', async (req, res) => {
  const { level, search, topic, page = 1, limit = 30 } = req.query;
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 30));
  const offset = (p - 1) * l;
  const lvl = level ? parseInt(level, 10) : null;
  const searchTerm = (search || '').trim();
  const topicFilter = (topic || '').trim();

  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      let whereClauses = [];
      let queryParams = [];

      if (lvl && lvl >= 1 && lvl <= 16) {
        whereClauses.push('level = ?');
        queryParams.push(lvl);
      }
      if (topicFilter) {
        whereClauses.push('topic = ?');
        queryParams.push(topicFilter);
      }
      if (searchTerm) {
        whereClauses.push('(question LIKE ? OR topic LIKE ? OR id LIKE ?)');
        const s = `%${searchTerm}%`;
        queryParams.push(s, s, s);
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      // Total count
      const [countRows] = await pool.query(
        `SELECT COUNT(*) AS total FROM kbc_questions ${whereSql}`,
        queryParams
      );
      const total = countRows[0]?.total || 0;

      // Fetch paginated rows
      const [rows] = await pool.query(
        `SELECT id, level, topic, question, options_json, correct, explanation, is_custom, is_active, created_at 
         FROM kbc_questions 
         ${whereSql} 
         ORDER BY level ASC, is_active DESC, id ASC 
         LIMIT ? OFFSET ?`,
        [...queryParams, l, offset]
      );

      // Distinct topics
      const [topicRows] = await pool.query(
        'SELECT DISTINCT topic FROM kbc_questions ORDER BY topic ASC'
      );
      const topics = topicRows.map(r => r.topic);

      const questions = rows.map(r => ({
        id: r.id,
        level: r.level,
        topic: r.topic,
        question: r.question,
        options: typeof r.options_json === 'string' ? JSON.parse(r.options_json) : r.options_json,
        correct: r.correct,
        explanation: r.explanation,
        isCustom: Boolean(r.is_custom),
        isActive: Boolean(r.is_active),
        createdAt: r.created_at
      }));

      return res.json({
        success: true,
        questions,
        total,
        page: p,
        limit: l,
        totalPages: Math.ceil(total / l),
        topics,
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/bank query error, using in-memory bank:', err.message);
  }

  // In-Memory Fallback
  let filtered = [...SQL_QUESTION_BANK];
  if (lvl && lvl >= 1 && lvl <= 16) {
    filtered = filtered.filter(q => q.level === lvl);
  }
  if (topicFilter) {
    filtered = filtered.filter(q => q.topic.toLowerCase() === topicFilter.toLowerCase());
  }
  if (searchTerm) {
    const s = searchTerm.toLowerCase();
    filtered = filtered.filter(q => 
      q.question.toLowerCase().includes(s) || 
      q.topic.toLowerCase().includes(s) ||
      q.id.toLowerCase().includes(s)
    );
  }

  const total = filtered.length;
  const paged = filtered.slice(offset, offset + l).map(q => {
    const isActive = memoryStore.activeSelections[q.level] === q.id;
    return {
      ...q,
      isCustom: false,
      isActive
    };
  });

  const topics = [...new Set(SQL_QUESTION_BANK.map(q => q.topic))].sort();

  return res.json({
    success: true,
    questions: paged,
    total,
    page: p,
    limit: l,
    totalPages: Math.ceil(total / l),
    topics,
    database: 'Memory Fallback'
  });
});

// ── 3. ADMIN: Select which question is active for a level in Hostinger MySQL ──
router.post('/admin/select', async (req, res) => {
  const { level, questionId } = req.body;
  const lvl = parseInt(level, 10);

  if (!lvl || lvl < 1 || lvl > 16 || !questionId) {
    return res.status(400).json({ success: false, message: 'Valid level (1-16) and questionId are required.' });
  }

  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      // Deactivate current active question for this level
      await pool.query('UPDATE kbc_questions SET is_active = 0 WHERE level = ?', [lvl]);

      // Activate the selected question
      const [updateResult] = await pool.query(
        'UPDATE kbc_questions SET is_active = 1 WHERE level = ? AND id = ?',
        [lvl, String(questionId)]
      );

      if (updateResult.affectedRows > 0) {
        return res.json({
          success: true,
          message: `Level ${lvl} question updated in Hostinger MySQL.`,
          activeQuestionId: String(questionId),
          database: 'Hostinger MySQL'
        });
      }
    }
  } catch (err) {
    console.warn('MySQL /admin/select query error:', err.message);
  }

  // Fallback update
  memoryStore.activeSelections[lvl] = String(questionId);
  return res.json({
    success: true,
    message: `Level ${lvl} question updated.`,
    activeQuestionId: String(questionId),
    database: 'Memory Fallback'
  });
});

// ── 4. ADMIN: Add a New Custom MERN or SQL Question into Hostinger MySQL ──
router.post('/admin/add-custom', async (req, res) => {
  const { level, topic, question, options, correct, explanation, setAsActive } = req.body;
  const lvl = parseInt(level, 10);

  if (!lvl || lvl < 1 || lvl > 16) {
    return res.status(400).json({ success: false, message: 'Level must be between 1 and 16.' });
  }
  if (!question || !question.trim()) {
    return res.status(400).json({ success: false, message: 'Question text is required.' });
  }
  if (!Array.isArray(options) || options.length !== 4 || options.some(o => !o || !o.trim())) {
    return res.status(400).json({ success: false, message: 'Exactly 4 non-empty options are required.' });
  }
  const correctIdx = parseInt(correct, 10);
  if (isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3) {
    return res.status(400).json({ success: false, message: 'Correct option index must be 0, 1, 2, or 3.' });
  }

  const newId = `custom-${lvl}-${Date.now()}`;
  const shouldActivate = Boolean(setAsActive);

  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      if (shouldActivate) {
        await pool.query('UPDATE kbc_questions SET is_active = 0 WHERE level = ?', [lvl]);
      }

      await pool.query(`
        INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
      `, [
        newId,
        lvl,
        topic || 'MERN & SQL',
        question.trim(),
        JSON.stringify(options.map(o => o.trim())),
        correctIdx,
        (explanation || '').trim(),
        shouldActivate ? 1 : 0
      ]);

      return res.json({
        success: true,
        message: `Custom question added to Level ${lvl} in Hostinger MySQL!`,
        question: {
          id: newId,
          level: lvl,
          topic: topic || 'MERN & SQL',
          question: question.trim(),
          options,
          correct: correctIdx,
          explanation: (explanation || '').trim(),
          isCustom: true
        },
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/add-custom query error:', err.message);
  }

  // Fallback
  const fallbackQ = {
    id: newId,
    level: lvl,
    topic: topic || 'MERN & SQL',
    question: question.trim(),
    options: options.map(o => o.trim()),
    correct: correctIdx,
    explanation: (explanation || '').trim(),
    isCustom: true
  };
  if (!memoryStore.customQuestions[lvl]) memoryStore.customQuestions[lvl] = [];
  memoryStore.customQuestions[lvl].push(fallbackQ);
  if (shouldActivate) memoryStore.activeSelections[lvl] = newId;

  return res.json({
    success: true,
    message: `Custom question added to Level ${lvl}.`,
    question: fallbackQ,
    database: 'Memory Fallback'
  });
});

// ── 4B. ADMIN: Fast AI Question Generation with Gemini (Hostinger MySQL) ──
router.post('/admin/ai-generate', async (req, res) => {
  const { level, topicOrPhrase, setAsActive, count } = req.body;
  const lvl = parseInt(level, 10);

  if (!lvl || lvl < 1 || lvl > 16) {
    return res.status(400).json({ success: false, message: 'Level must be between 1 and 16.' });
  }

  const promptText = (topicOrPhrase || '').trim();
  if (!promptText) {
    return res.status(400).json({ success: false, message: 'Please provide a topic or phrase (e.g. "sql inner join questions").' });
  }

  const shouldActivate = setAsActive !== undefined ? Boolean(setAsActive) : true;
  const numQuestions = Math.min(20, Math.max(1, parseInt(count, 10) || 1));

  try {
    const aiResult = await generateKbcQuestionWithGemini({
      level: lvl,
      topicOrPhrase: promptText,
      count: numQuestions
    });

    const questionsList = Array.isArray(aiResult) ? aiResult : [aiResult];
    const pool = getMySQLPool();
    const insertedQuestions = [];

    try {
      await ensureKbcTable();

      if (pool) {
        if (shouldActivate && questionsList.length > 0) {
          await pool.query('UPDATE kbc_questions SET is_active = 0 WHERE level = ?', [lvl]);
        }

        for (let i = 0; i < questionsList.length; i++) {
          const aiQ = questionsList[i];
          const newId = `ai-${lvl}-${Date.now()}-${i + 1}`;
          const isThisActive = shouldActivate && i === 0;

          await pool.query(`
            INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
          `, [
            newId,
            lvl,
            aiQ.topic || 'MERN & SQL',
            aiQ.question,
            JSON.stringify(aiQ.options),
            aiQ.correct,
            aiQ.explanation,
            isThisActive ? 1 : 0
          ]);

          insertedQuestions.push({
            id: newId,
            level: lvl,
            topic: aiQ.topic,
            question: aiQ.question,
            options: aiQ.options,
            correct: aiQ.correct,
            explanation: aiQ.explanation,
            isCustom: true,
            isActive: isThisActive
          });
        }

        // If this level is active in current session and shouldActivate is true, update the live session to the first question
        if (shouldActivate && insertedQuestions.length > 0) {
          const firstId = insertedQuestions[0].id;
          const [sessRows] = await pool.query('SELECT current_level, status FROM kbc_sessions WHERE id = "main_session"');
          if (sessRows.length > 0 && sessRows[0].current_level === lvl) {
            await pool.query(`
              UPDATE kbc_sessions
              SET current_question_id = ?, is_locked = 0, locked_option = NULL, revealed_correct = NULL
              WHERE id = 'main_session'
            `, [firstId]);
            await pool.query('UPDATE kbc_teams SET submitted_option = NULL');
          }
        }

        return res.json({
          success: true,
          count: insertedQuestions.length,
          message: `✨ ${insertedQuestions.length} AI question${insertedQuestions.length > 1 ? 's' : ''} generated by Gemini and saved to Level ${lvl} in Hostinger MySQL!`,
          questions: insertedQuestions,
          question: insertedQuestions[0],
          database: 'Hostinger MySQL'
        });
      }
    } catch (dbErr) {
      console.warn('MySQL save error for AI questions:', dbErr.message);
    }

    // In-memory fallback
    if (!memoryStore.customQuestions[lvl]) memoryStore.customQuestions[lvl] = [];
    const fallbackList = [];
    for (let i = 0; i < questionsList.length; i++) {
      const aiQ = questionsList[i];
      const newId = `ai-${lvl}-${Date.now()}-${i + 1}`;
      const isThisActive = shouldActivate && i === 0;
      const fbQ = {
        id: newId,
        level: lvl,
        topic: aiQ.topic,
        question: aiQ.question,
        options: aiQ.options,
        correct: aiQ.correct,
        explanation: aiQ.explanation,
        isCustom: true,
        isActive: isThisActive
      };
      memoryStore.customQuestions[lvl].push(fbQ);
      fallbackList.push(fbQ);
      if (isThisActive) {
        memoryStore.activeSelections[lvl] = newId;
        if (memorySession.current_level === lvl) {
          memorySession.current_question_id = newId;
          memorySession.is_locked = false;
          memorySession.locked_option = null;
          memorySession.revealed_correct = null;
        }
      }
    }

    return res.json({
      success: true,
      count: fallbackList.length,
      message: `✨ ${fallbackList.length} AI question${fallbackList.length > 1 ? 's' : ''} generated by Gemini for Level ${lvl}!`,
      questions: fallbackList,
      question: fallbackList[0],
      database: 'Memory Fallback'
    });
  } catch (aiErr) {
    console.error('Error generating AI question:', aiErr.message);
    return res.status(500).json({
      success: false,
      message: `AI Generation failed: ${aiErr.message}`
    });
  }
});

// ── 4C. ADMIN: Delete Question from Hostinger MySQL ──
router.post('/admin/question/delete', async (req, res) => {
  const { questionId, level } = req.body;
  const lvl = parseInt(level, 10);

  if (!questionId) {
    return res.status(400).json({ success: false, message: 'Question ID is required.' });
  }

  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      // Check if the question exists and if it was currently active
      const [rows] = await pool.query('SELECT * FROM kbc_questions WHERE id = ?', [questionId]);
      const wasActive = rows.length > 0 && Boolean(rows[0].is_active);
      const questionLevel = rows.length > 0 ? rows[0].level : (lvl || 1);

      // Delete the question from MySQL
      await pool.query('DELETE FROM kbc_questions WHERE id = ?', [questionId]);

      // If it was the active question, activate another question for that level
      if (wasActive) {
        const [remaining] = await pool.query(
          'SELECT id FROM kbc_questions WHERE level = ? ORDER BY is_custom ASC, id ASC LIMIT 1',
          [questionLevel]
        );
        if (remaining.length > 0) {
          const nextActiveId = remaining[0].id;
          await pool.query('UPDATE kbc_questions SET is_active = 1 WHERE id = ?', [nextActiveId]);

          // Update live session if this level is currently on-screen
          const [sessRows] = await pool.query('SELECT current_level, current_question_id FROM kbc_sessions WHERE id = "main_session"');
          if (sessRows.length > 0 && (sessRows[0].current_level === questionLevel || sessRows[0].current_question_id === questionId)) {
            await pool.query('UPDATE kbc_sessions SET current_question_id = ? WHERE id = "main_session"', [nextActiveId]);
          }
        }
      }

      return res.json({
        success: true,
        message: 'Question deleted successfully from Hostinger MySQL.',
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/question/delete query error:', err.message);
  }

  // Memory fallback
  if (lvl && memoryStore.customQuestions[lvl]) {
    memoryStore.customQuestions[lvl] = memoryStore.customQuestions[lvl].filter(q => q.id !== questionId);
  }
  if (lvl && memoryStore.activeSelections[lvl] === questionId) {
    const defaultPool = DEFAULT_MERN_SQL_QUESTIONS[lvl] || [];
    memoryStore.activeSelections[lvl] = defaultPool[0]?.id || null;
  }

  return res.json({
    success: true,
    message: 'Question deleted successfully.',
    database: 'Memory Fallback'
  });
});

// ── 5. ADMIN: Reset to Factory Default 1,000 SQL Question Bank in Hostinger MySQL ──
router.post('/admin/reset', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      // Remove any custom questions
      await pool.query('DELETE FROM kbc_questions WHERE is_custom = 1');
      // Set all to inactive
      await pool.query('UPDATE kbc_questions SET is_active = 0');

      // Set the first question of each level to active
      for (let lvl = 1; lvl <= 16; lvl++) {
        const firstDef = DEFAULT_SQL_QUESTIONS[lvl]?.[0] || { id: `sql_l${lvl}_001` };
        await pool.query('UPDATE kbc_questions SET is_active = 1 WHERE level = ? AND id = ?', [lvl, firstDef.id]);
      }

      return res.json({
        success: true,
        message: 'KBC questions reset to 1,000 pure SQL master bank in Hostinger MySQL!',
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/reset query error:', err.message);
  }

  // Fallback reset
  memoryStore.customQuestions = {};
  for (let l = 1; l <= 16; l++) {
    memoryStore.activeSelections[l] = DEFAULT_SQL_QUESTIONS[l]?.[0]?.id || `sql_l${l}_001`;
  }
  return res.json({
    success: true,
    message: 'KBC questions reset to default 1,000 pure SQL master bank.',
    database: 'Memory Fallback'
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// ── LIVE SESSION CONTROLLER & MULTI-TEAM MANAGEMENT (Hostinger MySQL) ──
// ════════════════════════════════════════════════════════════════════════════════

// In-Memory fallback for session & teams when MySQL is unavailable
let memorySession = {
  id: 'main_session',
  status: 'INACTIVE', // 'INACTIVE' | 'WAITING' | 'LIVE' | 'COMPLETED'
  show_in_navbar: false,
  current_level: 1,
  current_question_id: null,
  is_locked: false,
  locked_option: null,
  revealed_correct: null,
  active_team_id: null,
  updated_at: new Date().toISOString()
};

let memoryTeams = [
  {
    id: 'team-1',
    team_name: 'Team ByteMasters',
    leader_name: 'Rahul Sharma',
    access_code: 'KBC-101',
    current_level: 1,
    score_amount: 0,
    status: 'REGISTERED',
    submitted_option: null,
    laptop_info: 'Chrome on Windows'
  },
  {
    id: 'team-2',
    team_name: 'SQL Titans',
    leader_name: 'Priya Patel',
    access_code: 'KBC-102',
    current_level: 1,
    score_amount: 0,
    status: 'REGISTERED',
    submitted_option: null,
    laptop_info: 'Safari on macOS'
  }
];

// Helper to ensure tables and initialize main session in Hostinger MySQL
async function ensureKbcSessionsAndTeams() {
  const pool = getMySQLPool();
  if (!pool) return false;

  try {
    // 1. Ensure kbc_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kbc_sessions (
        id VARCHAR(50) PRIMARY KEY,
        status ENUM('INACTIVE', 'WAITING', 'LIVE', 'COMPLETED') DEFAULT 'INACTIVE',
        show_in_navbar TINYINT(1) DEFAULT 0,
        current_level INT DEFAULT 1,
        current_question_id VARCHAR(100) DEFAULT NULL,
        is_locked TINYINT(1) DEFAULT 0,
        locked_option INT DEFAULT NULL,
        revealed_correct INT DEFAULT NULL,
        active_team_id VARCHAR(100) DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure session record exists
    const [sessRows] = await pool.query('SELECT * FROM kbc_sessions WHERE id = ?', ['main_session']);
    if (sessRows.length === 0) {
      await pool.query(`
        INSERT INTO kbc_sessions (id, status, show_in_navbar, current_level)
        VALUES ('main_session', 'INACTIVE', 0, 1)
      `);
    }

    // 2. Ensure kbc_teams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kbc_teams (
        id VARCHAR(100) PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL,
        leader_name VARCHAR(255) NOT NULL,
        access_code VARCHAR(50) NOT NULL UNIQUE,
        current_level INT DEFAULT 1,
        score_amount INT DEFAULT 0,
        safe_amount INT DEFAULT 0,
        status ENUM('REGISTERED', 'CONNECTED', 'HOTSEAT', 'ELIMINATED', 'WON') DEFAULT 'REGISTERED',
        submitted_option INT DEFAULT NULL,
        lifelines_used_json TEXT DEFAULT NULL,
        laptop_info VARCHAR(255) DEFAULT '',
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_team_code (access_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure starter teams if none exist
    const [teamRows] = await pool.query('SELECT COUNT(*) as cnt FROM kbc_teams');
    if ((teamRows[0]?.cnt || 0) === 0) {
      for (const t of memoryTeams) {
        await pool.query(`
          INSERT INTO kbc_teams (id, team_name, leader_name, access_code, current_level, score_amount, status, laptop_info)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [t.id, t.team_name, t.leader_name, t.access_code, t.current_level, t.score_amount, t.status, t.laptop_info]);
      }
    }

    return true;
  } catch (err) {
    console.warn('MySQL session/teams setup warning:', err.message);
    return false;
  }
}

// ── 6. PUBLIC: Get Live Session Status (used by Navbar & Contestant Laptops) ──
router.get('/session/status', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      const [rows] = await pool.query('SELECT * FROM kbc_sessions WHERE id = ?', ['main_session']);
      if (rows.length > 0) {
        const s = rows[0];
        
        // Fetch current active question details
        let currentQuestion = null;
        let query = 'SELECT * FROM kbc_questions WHERE level = ? AND is_active = 1 LIMIT 1';
        let params = [s.current_level || 1];

        if (s.current_question_id) {
          query = 'SELECT * FROM kbc_questions WHERE id = ? LIMIT 1';
          params = [s.current_question_id];
        }

        let [qRows] = await pool.query(query, params);
        if (qRows.length === 0) {
          const [fallbackRows] = await pool.query('SELECT * FROM kbc_questions WHERE level = ? LIMIT 1', [s.current_level || 1]);
          qRows = fallbackRows;
        }

        if (qRows.length > 0) {
          const q = qRows[0];
          currentQuestion = {
            id: q.id,
            level: q.level,
            topic: q.topic,
            question: q.question,
            options: typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json,
            correct: q.correct,
            explanation: q.explanation
          };
        }

        return res.json({
          success: true,
          session: {
            id: s.id,
            status: s.status,
            show_in_navbar: Boolean(s.show_in_navbar),
            current_level: s.current_level || 1,
            current_question_id: s.current_question_id,
            is_locked: Boolean(s.is_locked),
            locked_option: s.locked_option,
            revealed_correct: s.revealed_correct,
            active_team_id: s.active_team_id,
            current_question: currentQuestion
          },
          database: 'Hostinger MySQL'
        });
      }
    }
  } catch (err) {
    console.warn('MySQL /session/status error:', err.message);
  }

  // Fallback in-memory
  const qList = DEFAULT_MERN_SQL_QUESTIONS[memorySession.current_level] || DEFAULT_MERN_SQL_QUESTIONS[1];
  return res.json({
    success: true,
    session: {
      ...memorySession,
      current_question: qList[0]
    },
    database: 'Memory Fallback'
  });
});

// ── 7. ADMIN: Confirm & Toggle KBC Session Live / Navbar Status (With Reset from Starting) ──
router.post('/admin/session/toggle', async (req, res) => {
  const { status, show_in_navbar, level, restart_from_start } = req.body;
  const pool = getMySQLPool();

  try {
    await ensureKbcSessionsAndTeams();

    const newStatus = status || 'LIVE';
    const showNav = show_in_navbar !== undefined ? (show_in_navbar ? 1 : 0) : 1;
    const shouldRestart = Boolean(restart_from_start) || newStatus === 'LIVE';
    const currentLvl = shouldRestart ? 1 : (level ? parseInt(level, 10) : 1);

    if (pool) {
      if (shouldRestart) {
        // Reset whole KBC from starting (Level 1, all rounds, locks, and revealed states cleared)
        await pool.query(`
          UPDATE kbc_sessions 
          SET status = ?, show_in_navbar = ?, current_level = 1, current_question_id = NULL,
              is_locked = 0, locked_option = NULL, revealed_correct = NULL
          WHERE id = 'main_session'
        `, [newStatus, showNav]);

        // Reset all teams back to Level 1, 0 prize won, ready for round 1
        await pool.query(`
          UPDATE kbc_teams 
          SET current_level = 1, score_amount = 0, safe_amount = 0, submitted_option = NULL,
              status = 'CONNECTED', lifelines_used_json = NULL
        `);
      } else {
        await pool.query(`
          UPDATE kbc_sessions 
          SET status = ?, show_in_navbar = ?, current_level = ?
          WHERE id = 'main_session'
        `, [newStatus, showNav, currentLvl]);
      }

      return res.json({
        success: true,
        message: shouldRestart
          ? `KBC started from beginning (Level 1)! Session: ${newStatus}. Navbar visibility: ${showNav ? 'VISIBLE' : 'HIDDEN'}`
          : `KBC session updated to ${newStatus}. Navbar visibility: ${showNav ? 'VISIBLE' : 'HIDDEN'}`,
        session: {
          status: newStatus,
          show_in_navbar: Boolean(showNav),
          current_level: currentLvl,
          is_locked: false,
          locked_option: null,
          revealed_correct: null
        },
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/session/toggle query error:', err.message);
  }

  // Fallback
  memorySession.status = status || 'LIVE';
  memorySession.show_in_navbar = show_in_navbar !== undefined ? Boolean(show_in_navbar) : true;
  if (restart_from_start || status === 'LIVE') {
    memorySession.current_level = 1;
    memorySession.current_question_id = null;
    memorySession.is_locked = false;
    memorySession.locked_option = null;
    memorySession.revealed_correct = null;
    memoryTeams.forEach(t => {
      t.current_level = 1;
      t.score_amount = 0;
      t.submitted_option = null;
    });
  } else if (level) {
    memorySession.current_level = parseInt(level, 10);
  }

  return res.json({
    success: true,
    message: `Session state toggled.`,
    session: memorySession,
    database: 'Memory Fallback'
  });
});

// ── 8. ADMIN: Live Host Control Actions (Advance Level, Lock, Reveal, Change Question) ──
router.post('/admin/session/update', async (req, res) => {
  const { 
    current_level, 
    current_question_id, 
    is_locked, 
    locked_option, 
    revealed_correct, 
    active_team_id,
    reset_round
  } = req.body;

  const pool = getMySQLPool();
  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      if (reset_round) {
        // Reset locked and revealed state for new question
        await pool.query(`
          UPDATE kbc_sessions 
          SET is_locked = 0, locked_option = NULL, revealed_correct = NULL, current_level = ?, current_question_id = ?
          WHERE id = 'main_session'
        `, [current_level || 1, current_question_id || null]);

        // Also clear teams submitted options for the new round
        await pool.query('UPDATE kbc_teams SET submitted_option = NULL');
      } else {
        const updates = [];
        const params = [];

        if (current_level !== undefined) {
          updates.push('current_level = ?');
          params.push(parseInt(current_level, 10));
        }
        if (current_question_id !== undefined) {
          updates.push('current_question_id = ?');
          params.push(current_question_id);
        }
        if (is_locked !== undefined) {
          updates.push('is_locked = ?');
          params.push(is_locked ? 1 : 0);
        }
        if (locked_option !== undefined) {
          updates.push('locked_option = ?');
          params.push(locked_option);
        }
        if (revealed_correct !== undefined) {
          updates.push('revealed_correct = ?');
          params.push(revealed_correct);
        }
        if (active_team_id !== undefined) {
          updates.push('active_team_id = ?');
          params.push(active_team_id);
        }

        if (updates.length > 0) {
          params.push('main_session');
          await pool.query(`UPDATE kbc_sessions SET ${updates.join(', ')} WHERE id = ?`, params);
        }
      }

      return res.json({ success: true, message: 'Live game session updated.', database: 'Hostinger MySQL' });
    }
  } catch (err) {
    console.warn('MySQL /admin/session/update query error:', err.message);
  }

  // Fallback
  if (reset_round) {
    memorySession.is_locked = false;
    memorySession.locked_option = null;
    memorySession.revealed_correct = null;
    memorySession.current_level = current_level || 1;
    memoryTeams.forEach(t => { t.submitted_option = null; });
  } else {
    if (current_level !== undefined) memorySession.current_level = current_level;
    if (is_locked !== undefined) memorySession.is_locked = is_locked;
    if (locked_option !== undefined) memorySession.locked_option = locked_option;
    if (revealed_correct !== undefined) memorySession.revealed_correct = revealed_correct;
    if (active_team_id !== undefined) memorySession.active_team_id = active_team_id;
  }

  return res.json({ success: true, message: 'Session updated in fallback.', database: 'Memory Fallback' });
});

// ── 9. ADMIN & TEAMS: Get All Registered Teams & Live Laptop Status ──
router.get('/teams', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      const [rows] = await pool.query(`
        SELECT id, team_name, leader_name, access_code, current_level, score_amount, safe_amount, status, submitted_option, laptop_info, last_active_at, created_at 
        FROM kbc_teams 
        ORDER BY score_amount DESC, created_at ASC
      `);

      return res.json({
        success: true,
        teams: rows,
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /teams query error:', err.message);
  }

  return res.json({
    success: true,
    teams: memoryTeams,
    database: 'Memory Fallback'
  });
});

// ── 10. ADMIN: Register / Add New Participating Team ──
router.post('/admin/teams/add', async (req, res) => {
  const { team_name, leader_name, access_code } = req.body;
  if (!team_name || !team_name.trim() || !leader_name || !leader_name.trim()) {
    return res.status(400).json({ success: false, message: 'Team Name and Leader Name are required.' });
  }

  const generatedCode = (access_code && access_code.trim()) 
    ? access_code.trim().toUpperCase() 
    : `KBC-${Math.floor(100 + Math.random() * 900)}`;

  const teamId = `team-${Date.now()}`;
  const pool = getMySQLPool();

  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      await pool.query(`
        INSERT INTO kbc_teams (id, team_name, leader_name, access_code, current_level, score_amount, status)
        VALUES (?, ?, ?, ?, 1, 0, 'REGISTERED')
      `, [teamId, team_name.trim(), leader_name.trim(), generatedCode]);

      return res.json({
        success: true,
        message: `Team "${team_name}" registered successfully with access code: ${generatedCode}`,
        team: {
          id: teamId,
          team_name: team_name.trim(),
          leader_name: leader_name.trim(),
          access_code: generatedCode,
          status: 'REGISTERED'
        },
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/teams/add query error:', err.message);
  }

  // Fallback
  const newTeam = {
    id: teamId,
    team_name: team_name.trim(),
    leader_name: leader_name.trim(),
    access_code: generatedCode,
    current_level: 1,
    score_amount: 0,
    status: 'REGISTERED',
    submitted_option: null,
    laptop_info: ''
  };
  memoryTeams.push(newTeam);

  return res.json({
    success: true,
    message: `Team "${team_name}" registered!`,
    team: newTeam,
    database: 'Memory Fallback'
  });
});

// ── 11. ADMIN: Delete Team ──
router.post('/admin/teams/delete', async (req, res) => {
  const { teamId } = req.body;
  if (!teamId) return res.status(400).json({ success: false, message: 'teamId is required.' });

  const pool = getMySQLPool();
  try {
    if (pool) {
      await pool.query('DELETE FROM kbc_teams WHERE id = ?', [teamId]);
      return res.json({ success: true, message: 'Team deleted.' });
    }
  } catch (err) {}

  memoryTeams = memoryTeams.filter(t => t.id !== teamId);
  return res.json({ success: true, message: 'Team deleted from fallback.' });
});

// ── 12. TEAMS: Laptop Join Gate with Access Code ──
router.post('/team/join', async (req, res) => {
  const code = String(req.body.access_code || '').trim().toUpperCase();
  const laptopInfo = String(req.body.laptop_info || '').trim() || 'Contestant Laptop';

  if (!code) {
    return res.status(400).json({ success: false, message: 'Please enter your Team Access Code.' });
  }

  const pool = getMySQLPool();
  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      const [rows] = await pool.query('SELECT * FROM kbc_teams WHERE access_code = ?', [code]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Invalid Access Code. Please ask the Admin for your team code.' });
      }

      const team = rows[0];
      await pool.query(`
        UPDATE kbc_teams 
        SET status = 'CONNECTED', laptop_info = ?, last_active_at = NOW() 
        WHERE id = ?
      `, [laptopInfo, team.id]);

      // Also get session
      const [sessRows] = await pool.query('SELECT * FROM kbc_sessions WHERE id = ?', ['main_session']);

      return res.json({
        success: true,
        message: `Welcome, ${team.team_name}!`,
        team: {
          id: team.id,
          team_name: team.team_name,
          leader_name: team.leader_name,
          access_code: team.access_code,
          score_amount: team.score_amount,
          current_level: team.current_level
        },
        session: sessRows[0] || memorySession
      });
    }
  } catch (err) {
    console.warn('MySQL /team/join error:', err.message);
  }

  // Fallback
  const team = memoryTeams.find(t => t.access_code === code);
  if (team) {
    team.status = 'CONNECTED';
    team.laptop_info = laptopInfo;
    return res.json({
      success: true,
      message: `Welcome, ${team.team_name}!`,
      team,
      session: memorySession
    });
  }

  return res.status(404).json({ success: false, message: 'Invalid Access Code.' });
});

// ── 13. TEAMS: Submit Laptop Answer for the Active Live Question ──
router.post('/team/submit-answer', async (req, res) => {
  const { team_id, option_index } = req.body;
  if (!team_id || option_index === undefined) {
    return res.status(400).json({ success: false, message: 'team_id and option_index required.' });
  }

  const opt = parseInt(option_index, 10);
  const pool = getMySQLPool();

  try {
    if (pool) {
      await pool.query(`
        UPDATE kbc_teams 
        SET submitted_option = ?, last_active_at = NOW() 
        WHERE id = ?
      `, [opt, team_id]);

      return res.json({ success: true, message: `Option ${String.fromCharCode(65 + opt)} locked from your laptop!` });
    }
  } catch (err) {}

  // Fallback
  const team = memoryTeams.find(t => t.id === team_id);
  if (team) {
    team.submitted_option = opt;
    return res.json({ success: true, message: `Option ${String.fromCharCode(65 + opt)} locked!` });
  }

  return res.status(404).json({ success: false, message: 'Team not found.' });
});

export default router;
