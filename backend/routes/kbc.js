import express from 'express';
import { getMySQLPool } from '../config/mysql.js';

const router = express.Router();

// ── Default Curated MERN & SQL Questions (16 Levels, 3 Questions Each = 48 Questions) ──
export const DEFAULT_MERN_SQL_QUESTIONS = {
  1: [
    {
      id: "q-1-1",
      topic: "React",
      question: "In React, what file extension is standard for files containing JavaScript and JSX syntax together?",
      options: [".jsx", ".xml", ".html", ".rjs"],
      correct: 0,
      explanation: ".jsx (JavaScript XML) is standard for React components allowing HTML-like markup inside JS."
    },
    {
      id: "q-1-2",
      topic: "SQL",
      question: "What does the acronym 'SQL' stand for in relational database management?",
      options: ["Sequential Query List", "Structured Query Language", "Simple Question Language", "Server Query Logic"],
      correct: 1,
      explanation: "SQL stands for Structured Query Language, the ANSI standard language for relational databases."
    },
    {
      id: "q-1-3",
      topic: "Node.js",
      question: "Which command-line package manager is bundled and installed by default alongside Node.js?",
      options: ["pip", "composer", "npm", "gem"],
      correct: 2,
      explanation: "npm (Node Package Manager) is automatically installed whenever you install Node.js."
    }
  ],
  2: [
    {
      id: "q-2-1",
      topic: "MongoDB",
      question: "In MongoDB, what binary representation format are documents natively stored in on disk?",
      options: ["XML", "BSON (Binary JSON)", "CSV", "YAML"],
      correct: 1,
      explanation: "MongoDB stores documents in BSON format, which extends JSON with data types like Date and ObjectId."
    },
    {
      id: "q-2-2",
      topic: "SQL",
      question: "Which SQL clause is used to filter records that satisfy a specific condition?",
      options: ["FILTER BY", "WHERE", "LIMIT", "MATCH"],
      correct: 1,
      explanation: "The WHERE clause is used in SELECT, UPDATE, and DELETE queries to filter records."
    },
    {
      id: "q-2-3",
      topic: "Express",
      question: "Which HTTP verb is conventionally used in REST APIs to submit payload data to create a new resource?",
      options: ["GET", "DELETE", "POST", "OPTIONS"],
      correct: 2,
      explanation: "POST is the standard HTTP method used to send data to create new entities on the server."
    }
  ],
  3: [
    {
      id: "q-3-1",
      topic: "React",
      question: "Which React Hook is primarily used to declare and update local reactive state in functional components?",
      options: ["useEffect", "useState", "useContext", "useReducer"],
      correct: 1,
      explanation: "useState returns a stateful value and a dispatch function to update it across component re-renders."
    },
    {
      id: "q-3-2",
      topic: "SQL",
      question: "Which SQL clause is used to filter aggregated group records produced by the 'GROUP BY' statement?",
      options: ["WHERE", "HAVING", "ORDER BY", "LIKE"],
      correct: 1,
      explanation: "HAVING filters groups created by GROUP BY, whereas WHERE filters individual rows before grouping."
    },
    {
      id: "q-3-3",
      topic: "Node.js",
      question: "In Node.js CommonJS module syntax, which global function is used to load and import an external module?",
      options: ["include()", "require()", "importFrom()", "fetch()"],
      correct: 1,
      explanation: "require() is the synchronous CommonJS loader in Node.js for modules and JSON files."
    }
  ],
  4: [
    {
      id: "q-4-1",
      topic: "React",
      question: "In React, what special attribute is required when rendering an array of elements to give them a stable identity?",
      options: ["id", "key", "ref", "index"],
      correct: 1,
      explanation: "Keys help React identify which items have changed, been added, or been removed in lists."
    },
    {
      id: "q-4-2",
      topic: "SQL",
      question: "Which SQL JOIN returns all rows from the left table, and the matched rows from the right table (with NULLs if no match)?",
      options: ["INNER JOIN", "LEFT JOIN (LEFT OUTER JOIN)", "RIGHT JOIN", "CROSS JOIN"],
      correct: 1,
      explanation: "LEFT JOIN retains all left table rows regardless of whether a matching record exists in the right table."
    },
    {
      id: "q-4-3",
      topic: "Express",
      question: "In Express.js, what is the third parameter passed to a standard middleware function `(req, res, next)`?",
      options: ["error", "next", "done", "callback"],
      correct: 1,
      explanation: "'next' is the callback function invoked to pass execution control to the next middleware in the stack."
    }
  ],
  5: [ // Padav 1 (₹10,000 Milestone)
    {
      id: "q-5-1",
      topic: "Express",
      question: "In Express.js, how many arguments must an error-handling middleware function define to be recognized by Express?",
      options: ["2 (req, res)", "3 (req, res, next)", "4 (err, req, res, next)", "1 (err)"],
      correct: 2,
      explanation: "Express inspects fn.length; an error-handling middleware must explicitly take 4 arguments: (err, req, res, next)."
    },
    {
      id: "q-5-2",
      topic: "SQL",
      question: "In relational databases, which constraint uniquely identifies each record in a table and strictly forbids NULL values?",
      options: ["FOREIGN KEY", "PRIMARY KEY", "CHECK", "DEFAULT"],
      correct: 1,
      explanation: "A PRIMARY KEY uniquely identifies every record in a table and cannot contain NULL values."
    },
    {
      id: "q-5-3",
      topic: "MongoDB",
      question: "In MongoDB, what is the default primary key field automatically generated for every document upon insertion?",
      options: ["doc_id", "_id", "uuid", "key"],
      correct: 1,
      explanation: "MongoDB uses the '_id' field as the primary key with an automatically generated 12-byte ObjectId."
    }
  ],
  6: [
    {
      id: "q-6-1",
      topic: "React",
      question: "Which React Hook is specifically designed to memoize the computed result of an expensive calculation?",
      options: ["useCallback", "useMemo", "useRef", "useId"],
      correct: 1,
      explanation: "useMemo caches the result of a calculation between renders until its specified dependencies change."
    },
    {
      id: "q-6-2",
      topic: "SQL",
      question: "Which SQL operator is used to test whether a subquery returns one or more records, returning a boolean true/false?",
      options: ["EXISTS", "CONTAINS", "HAS", "ANYOF"],
      correct: 0,
      explanation: "The EXISTS operator tests for the existence of rows in a subquery and short-circuits as soon as a match is found."
    },
    {
      id: "q-6-3",
      topic: "MongoDB",
      question: "In Mongoose, which method allows populating referenced documents from another collection like a virtual relational join?",
      options: [".join()", ".populate()", ".merge()", ".lookupDirect()"],
      correct: 1,
      explanation: "Mongoose's .populate() replaces specified path IDs with full documents fetched from referenced collections."
    }
  ],
  7: [
    {
      id: "q-7-1",
      topic: "Node.js",
      question: "Which Node.js core module provides an abstract interface for streaming chunks of data efficiently without high RAM overhead?",
      options: ["stream", "http", "os", "cluster"],
      correct: 0,
      explanation: "The 'stream' module in Node.js handles continuous chunk-by-chunk data processing with backpressure handling."
    },
    {
      id: "q-7-2",
      topic: "SQL",
      question: "Which SQL window function assigns a unique, continuous sequential integer to each row within a partition without ties?",
      options: ["COUNT()", "ROW_NUMBER()", "NTILE()", "RANK_DENSE()"],
      correct: 1,
      explanation: "ROW_NUMBER() assigns a unique number to each row within a window partition starting from 1."
    },
    {
      id: "q-7-3",
      topic: "MongoDB",
      question: "In MongoDB aggregation pipelines, which stage operator groups documents by an expression and computes accumulator results?",
      options: ["$project", "$group", "$match", "$unwind"],
      correct: 1,
      explanation: "$group separates documents by a specified _id expression and applies accumulator expressions like $sum or $avg."
    }
  ],
  8: [
    {
      id: "q-8-1",
      topic: "SQL",
      question: "In ACID transaction isolation levels, which level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads?",
      options: ["READ UNCOMMITTED", "READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE"],
      correct: 2,
      explanation: "REPEATABLE READ ensures that any data read cannot change during the transaction, but new rows inserted by others (phantoms) can appear."
    },
    {
      id: "q-8-2",
      topic: "React",
      question: "In React 18, which Hook lets you defer updating a non-urgent part of the UI to keep high-frequency inputs responsive?",
      options: ["useTransition", "useDeferredValue", "useSyncExternalStore", "useInsertionEffect"],
      correct: 1,
      explanation: "useDeferredValue defers re-rendering a value until higher-priority user inputs (like typing) have completed."
    },
    {
      id: "q-8-3",
      topic: "Express",
      question: "Which widely used Node.js security middleware automatically sets HTTP response security headers (HSTS, CSP, X-Frame-Options)?",
      options: ["cors", "helmet", "morgan", "cookie-parser"],
      correct: 1,
      explanation: "Helmet helps secure Express applications by setting 15 different HTTP response headers."
    }
  ],
  9: [
    {
      id: "q-9-1",
      topic: "MongoDB",
      question: "In MongoDB, what type of index enables high-performance geo-spatial proximity queries on spherical Earth surfaces?",
      options: ["text index", "2dsphere index", "hashed index", "wildcard index"],
      correct: 1,
      explanation: "2dsphere indexes support queries that calculate geometries on an earth-like sphere using GeoJSON objects."
    },
    {
      id: "q-9-2",
      topic: "SQL",
      question: "Which SQL command inspects the query optimizer's execution plan to reveal whether index scans or full table scans occur?",
      options: ["INSPECT", "EXPLAIN (or EXPLAIN ANALYZE)", "PROFILE", "DEBUG QUERY"],
      correct: 1,
      explanation: "EXPLAIN displays the execution plan detailing table scans, index lookups, join algorithms, and estimated costs."
    },
    {
      id: "q-9-3",
      topic: "Node.js",
      question: "Which phase of the Node.js event loop executes callbacks scheduled by `setImmediate()`?",
      options: ["Timers phase", "Poll phase", "Check phase", "Close callbacks phase"],
      correct: 2,
      explanation: "The Check phase of the libuv event loop is dedicated to executing callbacks scheduled via setImmediate()."
    }
  ],
  10: [ // Padav 2 (₹3,20,000 Milestone)
    {
      id: "q-10-1",
      topic: "SQL",
      question: "Under the 'Leftmost Prefix' rule for a composite index `INDEX(a, b, c)`, which WHERE clause CANNOT use this index?",
      options: ["WHERE a = 5", "WHERE a = 5 AND b = 10", "WHERE b = 10 AND c = 20", "WHERE a = 5 AND b > 2 AND c = 1"],
      correct: 2,
      explanation: "Without filtering on the leading column 'a', the B-Tree index ordering cannot be searched directly; a full scan is required."
    },
    {
      id: "q-10-2",
      topic: "React",
      question: "What is the name of React's internal architecture that breaks rendering work into incremental units of work that can be scheduled?",
      options: ["React Virtualizer", "React Fiber", "Shadow DOM Engine", "Flux Dispatcher"],
      correct: 1,
      explanation: "React Fiber is the complete rewrite of React's core reconciler enabling concurrent rendering and priority-based scheduling."
    },
    {
      id: "q-10-3",
      topic: "Node.js",
      question: "Which Node.js core module allows multi-threaded JavaScript execution sharing memory buffers via SharedArrayBuffer?",
      options: ["child_process", "worker_threads", "cluster", "dgram"],
      correct: 1,
      explanation: "The 'worker_threads' module provides real threads running isolated V8 instances that can share memory via SharedArrayBuffer."
    }
  ],
  11: [
    {
      id: "q-11-1",
      topic: "SQL",
      question: "In relational databases, which SQL clause acquires an exclusive row-level lock on selected rows to prevent concurrent race conditions until commit?",
      options: ["SELECT ... FOR UPDATE", "SELECT ... WITH LOCK", "LOCK TABLE ROW EXCLUSIVE", "SELECT ... HOLD EXCLUSIVE"],
      correct: 0,
      explanation: "SELECT ... FOR UPDATE locks the scanned rows against concurrent updates or deletions until the active transaction completes."
    },
    {
      id: "q-11-2",
      topic: "MongoDB",
      question: "In a MongoDB sharded cluster, which component acts as the intelligent query router, forwarding requests to the appropriate shard?",
      options: ["configsvr", "mongos", "mongod", "replica-master"],
      correct: 1,
      explanation: "'mongos' is the routing service for MongoDB sharded clusters, determining which shard holds the relevant chunks."
    },
    {
      id: "q-11-3",
      topic: "Security",
      question: "When storing JWT (JSON Web Tokens) in browser applications, which storage location provides the strongest protection against XSS token theft?",
      options: ["localStorage", "sessionStorage", "HttpOnly Secure Cookie", "window global variable"],
      correct: 2,
      explanation: "An HttpOnly Secure SameSite cookie cannot be read by malicious client-side JavaScript, mitigating XSS extraction."
    }
  ],
  12: [
    {
      id: "q-12-1",
      topic: "Node.js",
      question: "In the Google V8 engine powering Node.js, which generational garbage collector performs frequent scavenging of young objects?",
      options: ["Major GC (Mark-Sweep-Compact)", "Minor GC (Scavenger / Cheney's algorithm)", "Incremental Marker", "Concurrent Compactor"],
      correct: 1,
      explanation: "Minor GC uses Cheney's copying algorithm to rapidly scavenge surviving objects from the nursery into old generation."
    },
    {
      id: "q-12-2",
      topic: "SQL",
      question: "Which database normal form requires that a relation is in 3NF and every functional dependency X -> Y requires X to be a superkey?",
      options: ["1NF", "2NF", "Boyce-Codd Normal Form (BCNF)", "4NF"],
      correct: 2,
      explanation: "BCNF is a stricter version of 3NF where every determinant in a non-trivial functional dependency must be a superkey."
    },
    {
      id: "q-12-3",
      topic: "React",
      question: "In React Server Components (RSC), which of the following statements is TRUE regarding Server Components?",
      options: [
        "They have direct access to browser window APIs",
        "They cannot use client React hooks like useState or useEffect",
        "They increase client JavaScript bundle size",
        "They re-render on client button clicks directly without server interaction"
      ],
      correct: 1,
      explanation: "Server Components execute strictly on the server and do not ship JavaScript to the client, so client hooks like useState are invalid."
    }
  ],
  13: [
    {
      id: "q-13-1",
      topic: "MongoDB",
      question: "In MongoDB replica sets, which write concern guarantees a write is committed to a majority of voting members AND flushed to disk journal?",
      options: ["{ w: 1, j: false }", "{ w: 'majority', j: true }", "{ w: 0, j: false }", "{ w: 2, j: 'memory' }"],
      correct: 1,
      explanation: "{ w: 'majority', j: true } guarantees durably committed writes that survive both replica failure and power loss."
    },
    {
      id: "q-13-2",
      topic: "SQL",
      question: "Which SQL construct utilizes the `WITH RECURSIVE` syntax to query hierarchical, parent-child, or graph structures like tree nodes?",
      options: ["Recursive Common Table Expression (CTE)", "Dynamic Cursor Loop", "Nested Pivot Table", "Analytic Cross-Tab"],
      correct: 0,
      explanation: "A recursive CTE references itself to iteratively traverse parent-child relationships, bill of materials, and tree nodes."
    },
    {
      id: "q-13-3",
      topic: "Node.js",
      question: "Which environment variable in Node.js configures the number of background threads in the libuv threadpool for async file and crypto I/O?",
      options: ["NODE_WORKER_THREADS", "UV_THREADPOOL_SIZE", "LIBUV_MAX_POOL", "NODE_CLUSTER_SIZE"],
      correct: 1,
      explanation: "UV_THREADPOOL_SIZE (default 4, max 1024) controls libuv's threadpool size for blocking system calls."
    }
  ],
  14: [
    {
      id: "q-14-1",
      topic: "SQL",
      question: "In database engines (like MySQL InnoDB and PostgreSQL), what write-ahead log mechanism guarantees ACID durability by logging page modifications before flushing dirty pages?",
      options: ["Doublewrite Buffer", "Redo Log (WAL - Write-Ahead Logging)", "Undo Log", "Change Buffer"],
      correct: 1,
      explanation: "WAL / Redo Logs record committed changes sequentially on disk before dirty buffer pool pages are asynchronously flushed."
    },
    {
      id: "q-14-2",
      topic: "React",
      question: "In React 18 Concurrent Mode, what specific concurrency bug does `useSyncExternalStore` prevent when reading from non-React stores?",
      options: ["Memory leaks in closures", "Visual Tearing (inconsistent state read across sliced renders)", "CORS header mismatch", "Event listener deadlocks"],
      correct: 1,
      explanation: "Visual Tearing occurs when concurrent rendering interrupts a component and an external store changes midway through a render pass."
    },
    {
      id: "q-14-3",
      topic: "MongoDB",
      question: "In MongoDB's WiredTiger storage engine, what concurrency control architecture allows document-level mutations without table-level locks?",
      options: ["Multi-Version Concurrency Control (MVCC)", "Single-threaded read-write queues", "Read-Copy-Update (RCU)", "Spinlock page fencing"],
      correct: 0,
      explanation: "WiredTiger utilizes MVCC; readers receive a point-in-time snapshot while writers modify memory without blocking concurrent reads."
    }
  ],
  15: [ // 1 Crore Milestone
    {
      id: "q-15-1",
      topic: "SQL",
      question: "In relational query optimizers, which join algorithm builds an in-memory hash table on the smaller relation and probes it with rows from the larger relation in O(M + N) time?",
      options: ["Nested Loop Join", "Hash Join", "Sort-Merge Join", "Cartesian Index Scan"],
      correct: 1,
      explanation: "Hash Join builds an in-memory hash table on the build relation and scans the probe relation once, ideal for unsorted, non-indexed joins."
    },
    {
      id: "q-15-2",
      topic: "Node.js / V8",
      question: "In Google V8, what optimization mechanism caches object property offsets based on structural shapes to emit direct machine code property lookups?",
      options: ["Hidden Classes (Maps) & Inline Caches (IC)", "Bytecode Interpretation Loop", "Trace-Based JIT Deoptimization", "Call Stack Unrolling"],
      correct: 0,
      explanation: "V8 assigns identical hidden classes (Shapes/Maps) to objects with identical fields; Inline Caches (ICs) eliminate hash lookup overhead."
    },
    {
      id: "q-15-3",
      topic: "MongoDB",
      question: "In MongoDB, what internal capped collection records an ordered log of all write operations that drive replica set synchronization and Change Streams?",
      options: ["oplog.rs (Operations Log)", "system.profile collection", "WiredTiger checkpoint table", "journal write log"],
      correct: 0,
      explanation: "The capped collection 'local.oplog.rs' records idempotent transformation operations replicated by secondary nodes."
    }
  ],
  16: [ // 7 Crore Jackpot!
    {
      id: "q-16-1",
      topic: "MERN & SQL Architecture",
      question: "In microservices architectures spanning disparate databases (e.g. MongoDB + PostgreSQL), which architectural pattern coordinates distributed business transactions via compensating steps instead of blocking 2PC?",
      options: [
        "The SAGA Pattern (Choreographed or Orchestrated)",
        "Paxos Distributed Mutex Fencing",
        "Optimistic Read-Only Shadow Locking",
        "Centralized XA-Compliant Monolith Proxy"
      ],
      correct: 0,
      explanation: "The SAGA pattern breaks a distributed transaction into a series of local transactions with explicit compensating rollback steps."
    },
    {
      id: "q-16-2",
      topic: "SQL Internals",
      question: "In modern database storage engines (e.g. RocksDB, ScyllaDB), what structural advantage does a Log-Structured Merge (LSM) Tree offer over a traditional B+ Tree for high-frequency write workloads?",
      options: [
        "Converts random disk writes into sequential append-only writes in memory (MemTable) followed by background SSTable compaction",
        "Guarantees zero latency on point-read lookups without memory caching",
        "Completely eliminates the need for WAL or journaling",
        "Stores the entire database directly in CPU L1 cache"
      ],
      correct: 0,
      explanation: "LSM trees batch updates in memory (MemTable) and flush append-only sequential SSTables, eliminating expensive random I/O writes."
    },
    {
      id: "q-16-3",
      topic: "React Architecture",
      question: "In modern full-stack React architectures (React 19 Server Actions), what mechanism coordinates server mutations, purges specific CDN/data caches, and streams updated component trees back without full navigation?",
      options: [
        "Progressive Server-Side Mutation & Revalidation (revalidatePath / revalidateTag)",
        "WebSocket Socket.io Heartbeat sync",
        "Full DOM diff re-injection",
        "Direct IndexedDB local mirror syncing"
      ],
      correct: 0,
      explanation: "Server Actions execute on the server, invoke revalidation tags/paths, and return fresh server component payload diffs in a single round-trip."
    }
  ]
};

// ── In-Memory Fallback State (Active only if Hostinger MySQL is momentarily unreachable during local development) ──
let memoryStore = {
  activeSelections: (() => {
    const s = {};
    for (let l = 1; l <= 16; l++) s[l] = DEFAULT_MERN_SQL_QUESTIONS[l][0].id;
    return s;
  })(),
  customQuestions: {},
  updatedAt: new Date().toISOString()
};

// ── Ensure Hostinger MySQL Table & Seed Default Questions ──
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

    // 2. Check if questions exist
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM kbc_questions');
    const total = rows[0]?.total || 0;

    if (total === 0) {
      console.log('Seeding initial 48 MERN & SQL questions into Hostinger MySQL kbc_questions table...');
      for (let lvl = 1; lvl <= 16; lvl++) {
        const list = DEFAULT_MERN_SQL_QUESTIONS[lvl] || [];
        for (let i = 0; i < list.length; i++) {
          const q = list[i];
          const isActive = i === 0 ? 1 : 0; // First question of each level is active by default
          await pool.query(`
            INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
            ON DUPLICATE KEY UPDATE question = VALUES(question);
          `, [q.id, lvl, q.topic, q.question, JSON.stringify(q.options), q.correct, q.explanation, isActive]);
        }
      }
      console.log('✔ Seeded 48 MERN & SQL questions into Hostinger MySQL successfully.');
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

// ── 5. ADMIN: Reset to Factory Default MERN & SQL Set in Hostinger MySQL ──
router.post('/admin/reset', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      // Remove any custom questions
      await pool.query('DELETE FROM kbc_questions WHERE is_custom = 1');
      // Set all to inactive
      await pool.query('UPDATE kbc_questions SET is_active = 0');

      // Set the first default question of each level to active
      for (let lvl = 1; lvl <= 16; lvl++) {
        const firstDef = DEFAULT_MERN_SQL_QUESTIONS[lvl][0];
        await pool.query('UPDATE kbc_questions SET is_active = 1 WHERE level = ? AND id = ?', [lvl, firstDef.id]);
      }

      return res.json({
        success: true,
        message: 'KBC questions reset to default MERN & SQL master set in Hostinger MySQL!',
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/reset query error:', err.message);
  }

  // Fallback reset
  memoryStore.customQuestions = {};
  for (let l = 1; l <= 16; l++) {
    memoryStore.activeSelections[l] = DEFAULT_MERN_SQL_QUESTIONS[l][0].id;
  }
  return res.json({
    success: true,
    message: 'KBC questions reset to default MERN & SQL master set.',
    database: 'Memory Fallback'
  });
});

export default router;
