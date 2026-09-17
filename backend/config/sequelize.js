import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to reload environment from multiple possible locations (root .env and backend/.env)
export const reloadEnv = () => {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
  dotenv.config({ path: path.join(__dirname, '../.env') });
  dotenv.config();
};

reloadEnv();

// Hostinger MySQL Configuration Resolver
export const getMySQLConfig = (override = {}) => {
  reloadEnv();
  return {
    host: override.host || process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
    user: override.user || process.env.DB_USER || process.env.MYSQL_USER || 'root',
    password: override.password !== undefined 
      ? override.password 
      : (process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASS || process.env.MYSQL_PASS || ''),
    database: override.database || process.env.DB_NAME || process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'pranidha_school',
    port: Number(override.port || process.env.DB_PORT || process.env.MYSQL_PORT || 3306)
  };
};

let sequelizeInstance = null;
let activeDialect = 'mysql';
let isDbConnected = false;
let activeDbName = 'pranidha_school';
let activeDbHost = 'localhost';

// Create standard Hostinger MySQL Sequelize instance
export const createMySQLInstance = (overrideConfig = {}) => {
  const cfg = getMySQLConfig(overrideConfig);
  activeDbName = cfg.database;
  activeDbHost = cfg.host;

  return new Sequelize(cfg.database, cfg.user, cfg.password, {
    host: cfg.host,
    port: cfg.port,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 10000
    },
    pool: {
      max: 15,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  });
};

// Local SQLite fallback instance (used only if sqlite3 is available and MySQL is offline)
export const createSqliteInstance = () => {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const sqlitePath = path.join(dataDir, 'exam_local.sqlite');

  return new Sequelize({
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
};

// Test Hostinger MySQL credentials without disrupting current active connection
export const testMySQLConnection = async (config = {}) => {
  const cfg = getMySQLConfig(config);
  const testSeq = new Sequelize(cfg.database, cfg.user, cfg.password, {
    host: cfg.host,
    port: cfg.port,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 7000
    }
  });

  try {
    await testSeq.authenticate();
    await testSeq.close();
    return { success: true, message: `Successfully connected to Hostinger MySQL (${cfg.database} @ ${cfg.host}:${cfg.port})` };
  } catch (err) {
    try { await testSeq.close(); } catch (_) {}
    return { success: false, message: err.message };
  }
};

// Migrate data from local SQLite to Hostinger MySQL
export const migrateDataFromSqliteToMySQL = async (targetSeq) => {
  const dataDir = path.join(__dirname, '../data');
  const sqlitePath = path.join(dataDir, 'exam_local.sqlite');
  if (!fs.existsSync(sqlitePath)) {
    return { migrated: false, message: 'No local SQLite store found to migrate.' };
  }

  try {
    const sqliteSeq = new Sequelize({
      dialect: 'sqlite',
      storage: sqlitePath,
      logging: false
    });
    await sqliteSeq.authenticate();

    const [tables] = await sqliteSeq.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    const tableNames = tables.map(t => t.name);

    const order = [
      'colleges',
      'exam_courses',
      'exam_batches',
      'exams',
      'questions',
      'question_options',
      'exam_questions',
      'examstudent',
      'exam_student_access',
      'exam_attempts',
      'student_answers'
    ];

    let totalMigrated = 0;

    for (const tbl of order) {
      if (!tableNames.includes(tbl)) continue;
      try {
        const [rows] = await sqliteSeq.query(`SELECT * FROM ${tbl};`);
        if (rows && rows.length > 0) {
          for (const row of rows) {
            try {
              const keys = Object.keys(row);
              const escapedKeys = keys.map(k => `\`${k}\``).join(', ');
              const placeholders = keys.map(() => '?').join(', ');
              const values = Object.values(row);

              await targetSeq.query(
                `INSERT IGNORE INTO \`${tbl}\` (${escapedKeys}) VALUES (${placeholders});`,
                { replacements: values }
              );
              totalMigrated++;
            } catch (rowErr) {
              // Ignore duplicate or constraint conflicts
            }
          }
        }
      } catch (tblErr) {
        console.warn(`Data migration notice for table ${tbl}:`, tblErr.message);
      }
    }

    await sqliteSeq.close();
    console.log(`\x1b[32m✔ Migrated ${totalMigrated} records from local SQLite store into Hostinger MySQL!\x1b[0m`);
    return { migrated: true, totalMigrated };
  } catch (err) {
    console.warn('SQLite to MySQL migration notice:', err.message);
    return { migrated: false, error: err.message };
  }
};

export const getSequelize = () => {
  if (sequelizeInstance) return sequelizeInstance;

  // Default to reliable local storage until MySQL is explicitly authenticated
  try {
    sequelizeInstance = createSqliteInstance();
    activeDialect = 'sqlite';
    isDbConnected = true;
    activeDbName = 'exam_local.sqlite';
    activeDbHost = 'localhost';
  } catch (e) {
    sequelizeInstance = createMySQLInstance();
    activeDialect = 'mysql';
  }

  return sequelizeInstance;
};

// Primary Initialization
export const initSequelize = async () => {
  const cfg = getMySQLConfig();
  
  // 1. Attempt Hostinger MySQL First
  try {
    const seq = createMySQLInstance();
    await seq.authenticate();

    // If previously on sqlite, close it
    if (sequelizeInstance && activeDialect === 'sqlite') {
      try { await sequelizeInstance.close(); } catch (_) {}
    }

    sequelizeInstance = seq;
    isDbConnected = true;
    activeDialect = 'mysql';
    activeDbName = cfg.database;
    activeDbHost = cfg.host;
    console.log(`\x1b[32m✔ Sequelize connected to Hostinger MySQL: ${cfg.database} @ ${cfg.host}:${cfg.port}\x1b[0m`);

    // Auto-migrate any existing records from local SQLite to Hostinger MySQL
    await migrateDataFromSqliteToMySQL(seq);

    return seq;
  } catch (err) {
    console.warn(`\x1b[33mℹ Hostinger MySQL connection notice: ${err.message}\x1b[0m`);

    // 2. Resilient Fallback to Local Storage
    try {
      if (!sequelizeInstance || activeDialect !== 'sqlite') {
        const sqliteInstance = createSqliteInstance();
        await sqliteInstance.authenticate();
        sequelizeInstance = sqliteInstance;
      }
      isDbConnected = true;
      activeDialect = 'sqlite';
      activeDbName = 'exam_local.sqlite';
      activeDbHost = 'localhost';
      console.log('\x1b[32m✔ Sequelize activated local fallback storage.\x1b[0m');
      return sequelizeInstance;
    } catch (sqliteErr) {
      console.warn('\x1b[33mℹ Running in non-blocking mode. Server will remain active.\x1b[0m');
      return sequelizeInstance;
    }
  }
};

// Force dynamic reconnection to Hostinger MySQL (e.g. from admin panel or environment update)
export const switchSequelizeToMySQL = async (customConfig = {}) => {
  const cfg = getMySQLConfig(customConfig);
  const newMySQLInstance = createMySQLInstance(customConfig);

  await newMySQLInstance.authenticate();

  // Close existing connection if open
  try {
    if (sequelizeInstance && typeof sequelizeInstance.close === 'function') {
      await sequelizeInstance.close();
    }
  } catch (_) {}

  sequelizeInstance = newMySQLInstance;
  isDbConnected = true;
  activeDialect = 'mysql';
  activeDbName = cfg.database;
  activeDbHost = cfg.host;

  // Auto-migrate local data into new MySQL instance
  await migrateDataFromSqliteToMySQL(newMySQLInstance);

  return sequelizeInstance;
};

export const getSequelizeStatus = () => {
  const cfg = getMySQLConfig();
  return {
    connected: isDbConnected,
    dialect: activeDialect,
    database: activeDialect === 'mysql' ? (activeDbName || cfg.database) : 'exam_local.sqlite',
    host: activeDialect === 'mysql' ? (activeDbHost || cfg.host) : 'localhost',
    port: cfg.port,
    user: activeDialect === 'mysql' ? cfg.user : 'local',
    isMySQLConfigured: Boolean(process.env.DB_NAME || process.env.MYSQL_DATABASE)
  };
};

export default getSequelize;
