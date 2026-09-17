import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hostinger MySQL Credentials (supports all common environment variable naming)
const dbHost = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
const dbUser = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASS || process.env.MYSQL_PASS || '';
const dbName = process.env.DB_NAME || process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'pranidha_school';
const dbPort = Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306);

let sequelizeInstance = null;
let activeDialect = 'mysql';
let isDbConnected = false;

// Create standard MySQL Sequelize instance
const createMySQLInstance = () => {
  return new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 10000
    },
    pool: {
      max: 10,
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

// Local SQLite fallback instance (used only if sqlite3 is available)
const createSqliteInstance = () => {
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

export const getSequelize = () => {
  if (sequelizeInstance) return sequelizeInstance;

  try {
    sequelizeInstance = createMySQLInstance();
    activeDialect = 'mysql';
  } catch (err) {
    console.warn('MySQL initialization notice:', err.message);
    try {
      sequelizeInstance = createSqliteInstance();
      activeDialect = 'sqlite';
    } catch (e) {
      // Fallback to basic instance
      sequelizeInstance = createMySQLInstance();
    }
  }

  return sequelizeInstance;
};

export const initSequelize = async () => {
  try {
    const seq = getSequelize();
    await seq.authenticate();
    isDbConnected = true;
    activeDialect = 'mysql';
    console.log(`\x1b[32m✔ Sequelize connected to Hostinger MySQL: ${dbName} @ ${dbHost}:${dbPort}\x1b[0m`);
    return seq;
  } catch (err) {
    console.warn(`\x1b[33mℹ Hostinger MySQL connection notice: ${err.message}\x1b[0m`);

    // Only attempt SQLite if local development requires it and sqlite3 is present
    try {
      const sqliteInstance = createSqliteInstance();
      await sqliteInstance.authenticate();
      sequelizeInstance = sqliteInstance;
      isDbConnected = true;
      activeDialect = 'sqlite';
      console.log('\x1b[32m✔ Sequelize activated local fallback storage.\x1b[0m');
      return sequelizeInstance;
    } catch (sqliteErr) {
      console.warn('\x1b[33mℹ Running in non-blocking MySQL mode. Server will remain active.\x1b[0m');
      return sequelizeInstance;
    }
  }
};

export const getSequelizeStatus = () => ({
  connected: isDbConnected,
  dialect: activeDialect,
  database: activeDialect === 'mysql' ? dbName : 'exam_local.sqlite',
  host: activeDialect === 'mysql' ? dbHost : 'localhost'
});

export default getSequelize;
