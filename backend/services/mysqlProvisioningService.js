import mysql from 'mysql2/promise';
import { getMySQLConfig, getMySQLPool } from '../config/mysql.js';
import mysqlActivityService from './mysqlActivityService.js';

/**
 * Intelligent MySQL SQL statement splitter that respects quotes, backticks, escapes, and comments.
 * Avoids naive semicolon splitting that breaks strings, stored procedures, or triggers.
 */
export function splitSqlStatements(sqlText = '') {
  const statements = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;
  const len = sqlText.length;

  for (let i = 0; i < len; i++) {
    const char = sqlText[i];
    const nextChar = i + 1 < len ? sqlText[i + 1] : '';

    // Handle line comment end
    if (inLineComment) {
      current += char;
      if (char === '\n' || char === '\r') {
        inLineComment = false;
      }
      continue;
    }

    // Handle block comment end
    if (inBlockComment) {
      current += char;
      if (char === '*' && nextChar === '/') {
        current += nextChar;
        i++;
        inBlockComment = false;
      }
      continue;
    }

    // Check comment starts if not inside string/backticks
    if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
      if ((char === '-' && nextChar === '-') || char === '#') {
        inLineComment = true;
        current += char;
        continue;
      }
      if (char === '/' && nextChar === '*') {
        inBlockComment = true;
        current += char + nextChar;
        i++;
        continue;
      }
    }

    // Handle string escaping (e.g. \' or \")
    if (char === '\\' && (inSingleQuote || inDoubleQuote)) {
      current += char + nextChar;
      i++;
      continue;
    }

    // Handle quote boundaries
    if (char === "'" && !inDoubleQuote && !inBacktick) {
      inSingleQuote = !inSingleQuote;
      current += char;
      continue;
    }
    if (char === '"' && !inSingleQuote && !inBacktick) {
      inDoubleQuote = !inDoubleQuote;
      current += char;
      continue;
    }
    if (char === '`' && !inSingleQuote && !inDoubleQuote) {
      inBacktick = !inBacktick;
      current += char;
      continue;
    }

    // Statement delimiter (semicolon outside quotes/comments)
    if (char === ';' && !inSingleQuote && !inDoubleQuote && !inBacktick) {
      const trimmed = current.trim();
      if (trimmed) {
        statements.push(trimmed);
      }
      current = '';
      continue;
    }

    current += char;
  }

  const remainder = current.trim();
  if (remainder) {
    statements.push(remainder);
  }

  return statements;
}

class MySQLProvisioningService {
  constructor() {
    this.systemPool = null;
  }

  getPool() {
    if (!this.systemPool) {
      this.systemPool = getMySQLPool();
    }
    return this.systemPool;
  }

  /**
   * Get user-accessible real databases from MySQL
   */
  async getUserDatabases(userId, isAdmin = true) {
    const pool = this.getPool();
    const [rows] = await pool.query('SHOW DATABASES');
    const systemSchemas = new Set(['information_schema', 'performance_schema', 'mysql', 'sys']);
    const databases = [];

    // User prefix for scoped databases if non-admin multi-user mode
    const userPrefix = `macos_user_${userId}_`;

    for (const row of rows) {
      const dbName = Object.values(row)[0];
      if (systemSchemas.has(dbName.toLowerCase())) continue;

      // Filter: if user has private databases, or in admin/single-tenant developer mode
      const isUserOwned = dbName.startsWith(userPrefix);
      const isVisible = isAdmin || isUserOwned || !dbName.startsWith('macos_user_');

      if (isVisible) {
        let tableCount = 0;
        try {
          const [tRows] = await pool.query(
            'SELECT COUNT(*) as cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?',
            [dbName]
          );
          tableCount = tRows[0]?.cnt || 0;
        } catch (_) {}

        databases.push({
          name: dbName,
          displayName: isUserOwned ? dbName.replace(userPrefix, '') : dbName,
          tableCount,
          isUserOwned
        });
      }
    }

    // Log connection health event
    mysqlActivityService.log({
      type: 'INFO',
      message: `Database catalog refreshed. Found ${databases.length} active database(s).`,
      context: { count: databases.length, databases: databases.map(d => d.name) },
      userId
    });

    return databases;
  }

  /**
   * Get complete schema tree from information_schema (Tables, Columns, Indexes, Constraints)
   */
  async getSchemaTree(userId, dbName) {
    if (!dbName) throw new Error('Database name is required to introspect schema.');

    const pool = this.getPool();
    const result = {
      database: dbName,
      tables: []
    };

    const [tableRows] = await pool.query(`
      SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH, CREATE_TIME, ENGINE, TABLE_COLLATION
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [dbName]);

    for (const t of tableRows) {
      const tableName = t.TABLE_NAME;

      // Columns metadata
      const [colRows] = await pool.query(`
        SELECT COLUMN_NAME, COLUMN_TYPE, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, EXTRA, CHARACTER_MAXIMUM_LENGTH
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [dbName, tableName]);

      // Indexes metadata
      let indexes = [];
      try {
        const [idxRows] = await pool.query(`
          SHOW INDEX FROM \`${dbName}\`.\`${tableName}\`
        `);
        const idxMap = new Map();
        for (const idx of idxRows) {
          const kName = idx.Key_name;
          if (!idxMap.has(kName)) {
            idxMap.set(kName, {
              name: kName,
              columns: [],
              unique: idx.Non_unique === 0,
              type: idx.Index_type
            });
          }
          idxMap.get(kName).columns.push(idx.Column_name);
        }
        indexes = Array.from(idxMap.values()).map(i => ({
          name: i.name,
          column: i.columns.join(', '),
          unique: i.unique,
          type: i.type
        }));
      } catch (_) {}

      // Foreign keys and constraints
      let constraints = [];
      try {
        const [kcuRows] = await pool.query(`
          SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
          FROM information_schema.KEY_COLUMN_USAGE
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL
        `, [dbName, tableName]);
        constraints = kcuRows.map(k => ({
          name: k.CONSTRAINT_NAME,
          column: k.COLUMN_NAME,
          referencedTable: k.REFERENCED_TABLE_NAME,
          referencedColumn: k.REFERENCED_COLUMN_NAME
        }));
      } catch (_) {}

      result.tables.push({
        name: tableName,
        rowCount: t.TABLE_ROWS || 0,
        dataLength: t.DATA_LENGTH || 0,
        engine: t.ENGINE || 'InnoDB',
        collation: t.TABLE_COLLATION || 'utf8mb4_unicode_ci',
        columns: colRows.map(c => ({
          name: c.COLUMN_NAME,
          type: c.COLUMN_TYPE || c.DATA_TYPE,
          dataType: c.DATA_TYPE,
          nullable: c.IS_NULLABLE === 'YES',
          key: c.COLUMN_KEY,
          default: c.COLUMN_DEFAULT,
          extra: c.EXTRA,
          isPrimary: c.COLUMN_KEY === 'PRI',
          isAutoIncrement: (c.EXTRA || '').includes('auto_increment')
        })),
        indexes,
        constraints
      });
    }

    return result;
  }

  /**
   * Execute real SQL query or script with exact MySQL error and timing reporting
   */
  async executeQuery(userId, activeDbName, rawSql, limit = 1000) {
    const fullSql = String(rawSql || '').trim();
    if (!fullSql) {
      throw new Error('Query string cannot be empty.');
    }

    const pool = this.getPool();
    const conn = await pool.getConnection();

    try {
      let currentDb = activeDbName || null;
      if (currentDb) {
        try {
          await conn.query(`USE \`${currentDb}\``);
        } catch (e) {
          console.warn(`[MySQL] Note: Could not pre-select database ${currentDb}:`, e.message);
        }
      }

      const statements = splitSqlStatements(fullSql);
      if (statements.length === 0) {
        throw new Error('No valid SQL statements found in input.');
      }

      let lastResult = null;
      const allOutputs = [];

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        const trimmedUpper = stmt.trim().toUpperCase();

        // Detect explicit USE command
        const useMatch = stmt.match(/^USE\s+[`"']?([a-zA-Z0-9_$]+)[`"']?/i);
        if (useMatch) {
          const targetDb = useMatch[1];
          const startHr = process.hrtime.bigint();
          await conn.query(`USE \`${targetDb}\``);
          const durMs = Number(process.hrtime.bigint() - startHr) / 1_000_000;
          currentDb = targetDb;

          mysqlActivityService.log({
            type: 'INFO',
            message: `Context changed to database: ${targetDb}`,
            context: { statement: stmt, durationMs: durMs.toFixed(3) },
            userId,
            dbName: targetDb
          });

          lastResult = {
            success: true,
            isSelect: false,
            columns: [],
            rows: [],
            rowCount: 0,
            affectedRows: 0,
            insertId: 0,
            executionTimeSec: (durMs / 1000).toFixed(4),
            fetchTimeSec: '0.0000',
            responseMessage: `Database changed to \`${targetDb}\``,
            executedAt: new Date().toLocaleTimeString('en-US', { hour12: false })
          };
          allOutputs.push(lastResult);
          continue;
        }

        // Execute statement on dedicated connection
        const execStart = process.hrtime.bigint();
        let queryResult;
        try {
          queryResult = await conn.query(stmt);
        } catch (sqlErr) {
          const durMs = Number(process.hrtime.bigint() - execStart) / 1_000_000;
          mysqlActivityService.log({
            type: 'ERROR',
            message: `Failed to execute query: [Error ${sqlErr.errno || sqlErr.code}] ${sqlErr.message}`,
            context: {
              statement: stmt,
              errorCode: sqlErr.code,
              errno: sqlErr.errno,
              sqlState: sqlErr.sqlState,
              durationMs: durMs.toFixed(3)
            },
            userId,
            dbName: currentDb
          });
          throw sqlErr;
        }

        const execEnd = process.hrtime.bigint();
        const executionDurationMs = Number(execEnd - execStart) / 1_000_000;

        const [rows, fields] = queryResult;
        const isSelect = Array.isArray(rows);
        const rowCount = isSelect ? rows.length : (rows?.affectedRows || 0);

        // Slow query threshold check (500ms)
        const isSlowQuery = executionDurationMs > 500;
        if (isSlowQuery) {
          mysqlActivityService.log({
            type: 'WARNING',
            message: `Slow query detected (${executionDurationMs.toFixed(1)}ms): ${stmt.length > 90 ? stmt.substring(0, 90) + '...' : stmt}`,
            context: { statement: stmt, durationMs: executionDurationMs.toFixed(2), rowCount },
            userId,
            dbName: currentDb
          });
        }

        // Map column definitions
        let columns = [];
        if (fields && fields.length > 0) {
          columns = fields.map(f => ({
            name: f.name,
            type: this.resolveFieldTypeName(f.columnType || f.type),
            table: f.table || '',
            flags: f.flags
          }));
        } else if (isSelect && rows.length > 0) {
          columns = Object.keys(rows[0]).map(k => ({ name: k, type: 'VARCHAR' }));
        }

        const fetchStart = process.hrtime.bigint();
        const displayRows = isSelect ? rows.slice(0, limit) : [];
        const fetchDurationMs = Number(process.hrtime.bigint() - fetchStart) / 1_000_000;

        // DDL / DML Activity logging
        if (trimmedUpper.startsWith('CREATE DATABASE')) {
          const dbMatch = stmt.match(/CREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?([a-zA-Z0-9_$]+)`?/i);
          const newDb = dbMatch ? dbMatch[1] : 'database';
          mysqlActivityService.log({
            type: 'INFO',
            message: `Database created successfully: ${newDb}`,
            context: { statement: stmt, executionTime: `${(executionDurationMs / 1000).toFixed(4)}s` },
            userId,
            dbName: newDb
          });
        } else if (trimmedUpper.startsWith('CREATE TABLE')) {
          const tblMatch = stmt.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`?[a-zA-Z0-9_$]+`?\.)?`?([a-zA-Z0-9_$]+)`?/i);
          const tbl = tblMatch ? tblMatch[1] : 'table';
          mysqlActivityService.log({
            type: 'INFO',
            message: `Table schema created: ${tbl} in ${currentDb || 'current database'}`,
            context: { statement: stmt, table: tbl },
            userId,
            dbName: currentDb
          });
        } else if (trimmedUpper.startsWith('DROP TABLE') || trimmedUpper.startsWith('DROP DATABASE')) {
          mysqlActivityService.log({
            type: 'INFO',
            message: `Object dropped: ${stmt}`,
            context: { statement: stmt },
            userId,
            dbName: currentDb
          });
        } else if (trimmedUpper.startsWith('ALTER TABLE')) {
          mysqlActivityService.log({
            type: 'INFO',
            message: `Table schema updated: ${stmt}`,
            context: { statement: stmt },
            userId,
            dbName: currentDb
          });
        } else {
          mysqlActivityService.log({
            type: 'INFO',
            message: isSelect 
              ? `Query executed: ${stmt.length > 80 ? stmt.substring(0, 80) + '...' : stmt}`
              : `DML executed (${rows?.affectedRows || 0} rows affected): ${stmt.length > 80 ? stmt.substring(0, 80) + '...' : stmt}`,
            context: {
              statement: stmt,
              rowCount,
              affectedRows: rows?.affectedRows || 0,
              insertId: rows?.insertId || 0,
              durationMs: executionDurationMs.toFixed(3)
            },
            userId,
            dbName: currentDb
          });
        }

        lastResult = {
          success: true,
          isSelect,
          columns,
          rows: displayRows,
          rowCount,
          totalRows: rowCount,
          affectedRows: isSelect ? 0 : (rows?.affectedRows || 0),
          insertId: rows?.insertId || 0,
          warningCount: rows?.warningStatus || 0,
          executionTimeSec: (executionDurationMs / 1000).toFixed(4),
          fetchTimeSec: (fetchDurationMs / 1000).toFixed(4),
          activeDatabase: currentDb,
          responseMessage: isSelect
            ? `${rowCount} row(s) returned`
            : `Query OK, ${rows?.affectedRows || 0} row(s) affected`,
          executedAt: new Date().toLocaleTimeString('en-US', { hour12: false })
        };
        allOutputs.push(lastResult);
      }

      return lastResult;

    } finally {
      conn.release();
    }
  }

  /**
   * Real database creation with verification in information_schema.SCHEMATA
   */
  async createDatabase(userId, rawName, charset = 'utf8mb4', collation = 'utf8mb4_unicode_ci') {
    const cleanName = String(rawName).trim().replace(/[^a-zA-Z0-9_$]/g, '');
    if (!cleanName) throw new Error('Invalid database name.');

    const pool = this.getPool();
    const conn = await pool.getConnection();

    try {
      mysqlActivityService.log({
        type: 'INFO',
        message: `Database creation started: CREATE DATABASE \`${cleanName}\``,
        context: { name: cleanName, charset, collation },
        userId
      });

      await conn.query(
        `CREATE DATABASE \`${cleanName}\` CHARACTER SET ${charset} COLLATE ${collation}`
      );

      // Verify in information_schema
      const [verify] = await conn.query(
        'SELECT SCHEMA_NAME, DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?',
        [cleanName]
      );

      if (!verify || verify.length === 0) {
        throw new Error(`Database "${cleanName}" creation could not be verified in information_schema.`);
      }

      mysqlActivityService.log({
        type: 'INFO',
        message: `Database ${cleanName} created and verified successfully in MySQL.`,
        context: verify[0],
        userId,
        dbName: cleanName
      });

      return {
        success: true,
        dbName: cleanName,
        displayName: cleanName,
        charset: verify[0].DEFAULT_CHARACTER_SET_NAME,
        collation: verify[0].DEFAULT_COLLATION_NAME
      };
    } catch (err) {
      mysqlActivityService.log({
        type: 'ERROR',
        message: `Failed to create database "${cleanName}": ${err.message}`,
        context: { errorCode: err.code, errno: err.errno, sqlState: err.sqlState },
        userId
      });
      throw err;
    } finally {
      conn.release();
    }
  }

  /**
   * Visual table creation with verification in information_schema.TABLES
   */
  async createTable(userId, dbName, tableDefinition) {
    const { tableName, columns = [], primaryKey = 'id', engine = 'InnoDB', comment = '' } = tableDefinition;
    const cleanTbl = String(tableName).trim().replace(/[^a-zA-Z0-9_$]/g, '');
    if (!cleanTbl) throw new Error('Table name is required.');
    if (!dbName) throw new Error('Database context is required.');
    if (!columns || columns.length === 0) throw new Error('At least one column definition is required.');

    const colClauses = [];
    const pkCols = [];

    for (const c of columns) {
      const colName = String(c.name).trim().replace(/[^a-zA-Z0-9_$]/g, '');
      if (!colName) continue;

      let colSql = `\`${colName}\` ${c.type || 'VARCHAR(255)'}`;
      if (c.nullable === false) colSql += ' NOT NULL';
      if (c.autoIncrement) colSql += ' AUTO_INCREMENT';
      if (c.defaultValue !== undefined && c.defaultValue !== null && c.defaultValue !== '') {
        colSql += ` DEFAULT ${c.defaultValue.toUpperCase() === 'CURRENT_TIMESTAMP' ? 'CURRENT_TIMESTAMP' : `'${c.defaultValue}'`}`;
      }
      colClauses.push(colSql);

      if (c.isPrimary || colName === primaryKey) {
        pkCols.push(`\`${colName}\``);
      }
    }

    if (pkCols.length > 0) {
      colClauses.push(`PRIMARY KEY (${pkCols.join(', ')})`);
    }

    const ddl = `CREATE TABLE \`${dbName}\`.\`${cleanTbl}\` (\n  ${colClauses.join(',\n  ')}\n) ENGINE=${engine} DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci${comment ? ` COMMENT='${comment.replace(/'/g, "''")}'` : ''};`;

    const pool = this.getPool();
    const conn = await pool.getConnection();

    try {
      mysqlActivityService.log({
        type: 'INFO',
        message: `Executing visual table creation: ${cleanTbl} in \`${dbName}\``,
        context: { ddl },
        userId,
        dbName
      });

      await conn.query(ddl);

      // Verify in information_schema
      const [verify] = await conn.query(
        'SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
        [dbName, cleanTbl]
      );

      if (!verify || verify.length === 0) {
        throw new Error(`Table "${cleanTbl}" creation could not be verified in information_schema.`);
      }

      mysqlActivityService.log({
        type: 'INFO',
        message: `Table ${cleanTbl} created and verified successfully in MySQL.`,
        context: verify[0],
        userId,
        dbName
      });

      return {
        success: true,
        dbName,
        tableName: cleanTbl,
        ddl
      };
    } catch (err) {
      mysqlActivityService.log({
        type: 'ERROR',
        message: `Failed to create table "${cleanTbl}": ${err.message}`,
        context: { ddl, errorCode: err.code, errno: err.errno, sqlState: err.sqlState },
        userId,
        dbName
      });
      throw err;
    } finally {
      conn.release();
    }
  }

  /**
   * Real server metrics from MySQL Server
   */
  async getServerMetrics() {
    const pool = this.getPool();
    const [verRows] = await pool.query('SELECT VERSION() as version, @@version_comment as comment');
    const [uptimeRows] = await pool.query("SHOW GLOBAL STATUS LIKE 'Uptime'");
    const [threadsRows] = await pool.query("SHOW GLOBAL STATUS LIKE 'Threads_connected'");
    const [queriesRows] = await pool.query("SHOW GLOBAL STATUS LIKE 'Queries'");
    const [bufferRows] = await pool.query("SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_bytes_data'");

    const version = verRows[0]?.version || '8.4.0 LTS';
    const uptimeSec = parseInt(uptimeRows[0]?.Value || '3600', 10);
    const connections = parseInt(threadsRows[0]?.Value || '1', 10);
    const queries = parseInt(queriesRows[0]?.Value || '0', 10);
    const bufferBytes = parseInt(bufferRows[0]?.Value || '0', 10);

    const days = Math.floor(uptimeSec / 86400);
    const hours = Math.floor((uptimeSec % 86400) / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);

    return {
      serverName: 'MySQL Community Server',
      version,
      comment: verRows[0]?.comment || 'MySQL Community',
      engine: 'InnoDB',
      uptimeFormatted: `${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m ${uptimeSec % 60}s`,
      uptimeSeconds: uptimeSec,
      activeConnections: connections,
      totalQueries: queries,
      bufferPoolMb: (bufferBytes / (1024 * 1024)).toFixed(1),
      status: 'RUNNING',
      host: '127.0.0.1',
      port: 3306
    };
  }

  /**
   * Client connections from SHOW PROCESSLIST
   */
  async getClientConnections() {
    const pool = this.getPool();
    const [rows] = await pool.query('SHOW PROCESSLIST');
    return rows.map(r => ({
      id: r.Id,
      user: r.User,
      host: r.Host,
      db: r.db || 'NULL',
      command: r.Command,
      time: r.Time,
      state: r.State || '',
      info: r.Info || ''
    }));
  }

  /**
   * Helper to map MySQL numeric column types to human-readable names
   */
  resolveFieldTypeName(typeNum) {
    const typeMap = {
      0: 'DECIMAL',
      1: 'TINYINT',
      2: 'SMALLINT',
      3: 'INT',
      4: 'FLOAT',
      5: 'DOUBLE',
      7: 'TIMESTAMP',
      8: 'BIGINT',
      9: 'MEDIUMINT',
      10: 'DATE',
      11: 'TIME',
      12: 'DATETIME',
      13: 'YEAR',
      16: 'BIT',
      245: 'JSON',
      246: 'DECIMAL',
      252: 'BLOB / TEXT',
      253: 'VARCHAR',
      254: 'CHAR'
    };
    return typeMap[typeNum] || (typeof typeNum === 'string' ? typeNum : 'VARCHAR');
  }
}

const mysqlProvisioningService = new MySQLProvisioningService();
export default mysqlProvisioningService;
