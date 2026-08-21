import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Hostinger MySQL Connection Configuration
const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
  database: process.env.DB_NAME || process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'pranidha_school',
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

let pool = null;
let isConnected = false;

export const getMySQLPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Initialize MySQL Tables and Schema on Hostinger
export const initMySQLTables = async () => {
  try {
    const currentPool = getMySQLPool();
    const connection = await currentPool.getConnection();
    isConnected = true;
    console.log(`\x1b[32m✔ Connected to Hostinger MySQL Database: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}\x1b[0m`);

    // Create persistent storage table for JSON/key-value synchronization
    await connection.query(`
      CREATE TABLE IF NOT EXISTS system_store (
        collection_name VARCHAR(100) PRIMARY KEY,
        data_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create relational users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'parent', 'teacher', 'user', 'student') DEFAULT 'user',
        profile_image VARCHAR(500) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create admissions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admissions (
        id VARCHAR(100) PRIMARY KEY,
        application_number VARCHAR(100) NOT NULL UNIQUE,
        student_name VARCHAR(255) NOT NULL,
        student_dob VARCHAR(50),
        student_gender VARCHAR(50),
        student_class VARCHAR(100),
        parent_father_name VARCHAR(255),
        parent_mother_name VARCHAR(255),
        parent_email VARCHAR(255) NOT NULL,
        parent_phone VARCHAR(50),
        parent_address TEXT,
        status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
        remarks TEXT,
        documents_json LONGTEXT,
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create admission_payments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admission_payments (
        id VARCHAR(100) PRIMARY KEY,
        payment_ref VARCHAR(100) NOT NULL UNIQUE,
        amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        method ENUM('cash', 'razorpay', 'upi') NOT NULL,
        status ENUM('pending', 'verified', 'failed') DEFAULT 'pending',
        razorpay_order_id VARCHAR(100) DEFAULT '',
        razorpay_payment_id VARCHAR(100) DEFAULT '',
        application_number VARCHAR(100) DEFAULT '',
        student_db_id VARCHAR(100) DEFAULT '',
        student_details_json LONGTEXT,
        parent_details_json LONGTEXT,
        verified_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        student_id VARCHAR(100) NOT NULL UNIQUE,
        date_of_birth DATE,
        gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
        class VARCHAR(100) NOT NULL,
        parent_id VARCHAR(100),
        teacher_id VARCHAR(100),
        photo VARCHAR(500) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create fees table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fees (
        id VARCHAR(100) PRIMARY KEY,
        student_id VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        term VARCHAR(100) NOT NULL,
        due_date DATE,
        status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
        payment_date DATE DEFAULT NULL,
        transaction_id VARCHAR(100) DEFAULT '',
        payment_method VARCHAR(100) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create receipts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        id VARCHAR(100) PRIMARY KEY,
        fee_id VARCHAR(100) NOT NULL,
        student_id VARCHAR(100) NOT NULL,
        receipt_number VARCHAR(100) NOT NULL UNIQUE,
        amount_paid DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        transaction_id VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create courses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) DEFAULT 0.00,
        duration VARCHAR(100) DEFAULT '',
        category VARCHAR(100) DEFAULT 'general',
        level VARCHAR(50) DEFAULT 'Beginner',
        is_active BOOLEAN DEFAULT TRUE,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    connection.release();
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`\x1b[33m⚠ MySQL connection notice:\x1b[0m ${error.message}`);
    console.warn(`\x1b[33m→ Operating in memory-safe synchronized store mode.\x1b[0m`);
    return false;
  }
};

// Check connection health
export const getMySQLStatus = () => {
  return {
    configured: Boolean(process.env.DB_NAME || process.env.MYSQL_DATABASE),
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    connected: isConnected
  };
};

export default {
  getMySQLPool,
  initMySQLTables,
  getMySQLStatus
};
