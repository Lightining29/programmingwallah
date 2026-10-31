import { getMySQLPool } from '../config/mysql.js';

async function run() {
  const pool = getMySQLPool();
  if (!pool) {
    console.error('No MySQL pool');
    process.exit(1);
  }

  console.log('Ensuring kbc_students table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kbc_students (
      id VARCHAR(100) PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      dob VARCHAR(50) NOT NULL,
      mobile VARCHAR(50) DEFAULT '',
      college VARCHAR(255) DEFAULT '',
      roll_no VARCHAR(100) DEFAULT '',
      profile_photo LONGTEXT,
      access_code VARCHAR(50) DEFAULT 'KBC-101',
      points INT DEFAULT 0,
      current_level INT DEFAULT 1,
      correct_count INT DEFAULT 0,
      wrong_count INT DEFAULT 0,
      total_response_time_ms BIGINT DEFAULT 0,
      last_submitted_at BIGINT DEFAULT NULL,
      status VARCHAR(50) DEFAULT 'REGISTERED',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_kbc_email (email),
      INDEX idx_kbc_access_code (access_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('Ensuring kbc_sessions table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kbc_sessions (
      id VARCHAR(50) PRIMARY KEY,
      status ENUM('INACTIVE', 'WAITING', 'LIVE', 'COMPLETED') DEFAULT 'INACTIVE',
      show_in_navbar TINYINT(1) DEFAULT 0,
      current_level INT DEFAULT 1,
      total_questions INT DEFAULT 16,
      current_question_id VARCHAR(100) DEFAULT NULL,
      is_locked TINYINT(1) DEFAULT 0,
      locked_option INT DEFAULT NULL,
      revealed_correct INT DEFAULT NULL,
      active_team_id VARCHAR(100) DEFAULT NULL,
      winner_team_id VARCHAR(100) DEFAULT NULL,
      winner_name VARCHAR(255) DEFAULT NULL,
      winner_points INT DEFAULT 0,
      winner_prize VARCHAR(100) DEFAULT NULL,
      show_winner TINYINT(1) DEFAULT 0,
      show_leaderboard TINYINT(1) DEFAULT 0,
      timer_duration INT DEFAULT 30,
      timer_started_at BIGINT DEFAULT NULL,
      timer_paused TINYINT(1) DEFAULT 0,
      timer_remaining INT DEFAULT 30,
      default_access_code VARCHAR(50) DEFAULT 'KBC-101',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Ensure default main_session exists
  const [sessRows] = await pool.query('SELECT * FROM kbc_sessions WHERE id = ?', ['main_session']);
  if (sessRows.length === 0) {
    await pool.query(`
      INSERT INTO kbc_sessions (id, status, show_in_navbar, current_level, total_questions, default_access_code)
      VALUES ('main_session', 'INACTIVE', 0, 1, 16, 'KBC-101')
    `);
  }

  console.log('Ensuring kbc_teams table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kbc_teams (
      id VARCHAR(100) PRIMARY KEY,
      team_name VARCHAR(255) NOT NULL,
      leader_name VARCHAR(255) NOT NULL,
      access_code VARCHAR(50) NOT NULL,
      current_level INT DEFAULT 1,
      score_amount INT DEFAULT 0,
      points INT DEFAULT 0,
      correct_count INT DEFAULT 0,
      wrong_count INT DEFAULT 0,
      safe_amount INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'REGISTERED',
      submitted_option INT DEFAULT NULL,
      submitted_at BIGINT DEFAULT NULL,
      lifelines_used_json TEXT DEFAULT NULL,
      laptop_info VARCHAR(255) DEFAULT '',
      email VARCHAR(255) DEFAULT NULL,
      dob VARCHAR(50) DEFAULT NULL,
      mobile VARCHAR(50) DEFAULT NULL,
      college VARCHAR(255) DEFAULT NULL,
      roll_no VARCHAR(100) DEFAULT NULL,
      profile_photo LONGTEXT DEFAULT NULL,
      total_response_time_ms BIGINT DEFAULT 0,
      last_submitted_at BIGINT DEFAULT NULL,
      last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_team_code (access_code),
      INDEX idx_team_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const teamCols = [
    ['email', 'VARCHAR(255) DEFAULT NULL'],
    ['dob', 'VARCHAR(50) DEFAULT NULL'],
    ['mobile', 'VARCHAR(50) DEFAULT NULL'],
    ['college', 'VARCHAR(255) DEFAULT NULL'],
    ['roll_no', 'VARCHAR(100) DEFAULT NULL'],
    ['profile_photo', 'LONGTEXT DEFAULT NULL'],
    ['total_response_time_ms', 'BIGINT DEFAULT 0'],
    ['last_submitted_at', 'BIGINT DEFAULT NULL'],
    ['submitted_at', 'BIGINT DEFAULT NULL']
  ];
  for (const [col, def] of teamCols) {
    try { await pool.query(`ALTER TABLE kbc_teams ADD COLUMN ${col} ${def}`); } catch(e) {}
  }
  try { await pool.query("ALTER TABLE kbc_sessions ADD COLUMN default_access_code VARCHAR(50) DEFAULT 'KBC-101'"); } catch(e) {}

  const [tCols] = await pool.query('DESCRIBE kbc_teams');
  console.log('kbc_teams fields:', tCols.map(c => c.Field));
  const [sCols] = await pool.query('DESCRIBE kbc_students');
  console.log('kbc_students fields:', sCols.map(c => c.Field));

  console.log('Database migration completed successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
