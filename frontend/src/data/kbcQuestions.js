// Kaun Banega Crorepati (KBC) Authentic 16-Level Question Bank - MERN Stack & SQL
// Level 1 (₹1,000) to Level 16 (₹7 Crore Jackpot)
// Admin can choose/swap any question per level, or add custom questions!

export const KBC_PRIZE_LADDER = [
  { level: 1,  prize: '₹1,000',       amount: 1000,     isSafe: false, label: '1,000' },
  { level: 2,  prize: '₹2,000',       amount: 2000,     isSafe: false, label: '2,000' },
  { level: 3,  prize: '₹3,000',       amount: 3000,     isSafe: false, label: '3,000' },
  { level: 4,  prize: '₹5,000',       amount: 5000,     isSafe: false, label: '5,000' },
  { level: 5,  prize: '₹10,000',      amount: 10000,    isSafe: true,  label: '10,000 (Padav 1)' },
  { level: 6,  prize: '₹20,000',      amount: 20000,    isSafe: false, label: '20,000' },
  { level: 7,  prize: '₹40,000',      amount: 40000,    isSafe: false, label: '40,000' },
  { level: 8,  prize: '₹80,000',      amount: 80000,    isSafe: false, label: '80,000' },
  { level: 9,  prize: '₹1,60,000',    amount: 160000,   isSafe: false, label: '1,60,000' },
  { level: 10, prize: '₹3,20,000',    amount: 320000,   isSafe: true,  label: '3,20,000 (Padav 2)' },
  { level: 11, prize: '₹6,40,000',    amount: 640000,   isSafe: false, label: '6,40,000' },
  { level: 12, prize: '₹12,50,000',   amount: 1250000,  isSafe: false, label: '12,50,000' },
  { level: 13, prize: '₹25,00,000',   amount: 2500000,  isSafe: false, label: '25,00,000' },
  { level: 14, prize: '₹50,00,000',   amount: 5000000,  isSafe: false, label: '50,00,000' },
  { level: 15, prize: '₹1 Crore',     amount: 10000000, isSafe: true,  label: '1,00,00,000 (1 Crore)' },
  { level: 16, prize: '₹7 Crore',     amount: 70000000, isSafe: true,  label: '7,00,00,000 (7 Crore Jackpot)' },
];

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

// Amitabh Bachchan authentic dialogues & voiceover prompts for KBC MERN & SQL Edition
export const AMITABH_QUOTES = {
  welcome: [
    "Deviyo aur sajjano! Swagat hai aapka Kaun Banega Crorepati — MERN Stack & SQL Grand Edition mein!",
    "Namaskar! Full Stack aur Database ke is mahamukable mein aapka hardik swagat hai!",
    "Hot seat par swagat hai! Yahan MongoDB, Express, React, Node.js aur SQL ke prashn aapko 7 Crore ki unchayion par le jayenge!"
  ],
  questionIntro: (level, prize) => `Prashn sankhya ${level}, yeh raha aapki screen par ${prize} ke liye!`,
  optionSelected: (optLabel, optText) => `Aapne chuna hai Option ${optLabel}: "${optText}". Kya ise lock kiya jaaye?`,
  lockConfirmed: (optLabel) => `Computer Ji! Option ${optLabel} ko lock kiya jaaye!`,
  correctAnswer: [
    "Adbhut! Bilkul sahi uttar!",
    "Shandar! Aapka Full-Stack aur SQL concepts be-misaal hain!",
    "Sahi uttar! Aur isi ke saath aap badh gaye hain agle padav ki or!"
  ],
  padavCleared: (prize) => `Badhai ho! Aapne safalta-poorvak paar kar liya hai apna padav aur ab aapki guaranteed dhanrashi hai ${prize}!`,
  wrongAnswer: (correctOption) => `Afsos! Ye galat uttar hai... Sahi jawab tha Option ${correctOption}. Khel yahin samapt hota hai.`,
  timeOut: "Samay samapt! Tik-tiki ji ne ghanti baja di hai. Khel yahin par rukta hai.",
  quitConfirm: "Kya aap sach mein khel chhodkar apni jeeti hui dhanrashi lekar jana chahte hain?",
  quitSuccess: (prize) => `Bohot hi samajhdari bhara nirnay! Aap jeet chuke hain ${prize}! Badhai ho!`,
  crorepati: "7 CRORE!! Deviyo aur sajjano, itihaas rach diya hai! Aap ban chuke hain MAHA CROREPATI!!",
  lifelines: {
    fifty: "Computer Ji, 2 galat uttar mita diye jayein!",
    poll: "Deviyo aur sajjano, audience poll ka samay aa gaya hai. Kripya apna mat dein!",
    friend: "Aaiye video call milate hain hamare Tech Expert friend se!",
    flip: "Computer Ji, is prashn ko badal kar ek naya MERN/SQL prashn pesh kiya jaaye!"
  }
};

// Simulated Expert Tech Mentors for "Phone-A-Friend / Video Call"
export const EXPERT_FRIENDS = [
  {
    name: "Manish Kumar",
    title: "Chief Tech Instructor & MERN Architect",
    avatar: "👨‍🏫",
    advice: (correctLetter, isConfident) => 
      isConfident 
        ? `Namaskar Amitabh Ji! Main 95% confident hoon ki iska sahi uttar Option ${correctLetter} hi hai. Concepts clear hain, lock kar sakte hain!`
        : `Namaskar Bachchan Sahab! Prashn thoda tricky hai, par MERN aur SQL architecture ke hisab se Option ${correctLetter} hi sahi answer hai (~85%).`
  },
  {
    name: "Sneha Reddy",
    title: "Senior Full Stack Engineer & DBA",
    avatar: "👩‍💻",
    advice: (correctLetter, isConfident) =>
      isConfident
        ? `Hello Sir! Production mein hum is pattern ko frequently use karte hain. Option ${correctLetter} is 100% correct!`
        : `Hello Amitabh Ji! Internal execution logic dekhein toh Option ${correctLetter} is the most solid answer.`
  }
];
