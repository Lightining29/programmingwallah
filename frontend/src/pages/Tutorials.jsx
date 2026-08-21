import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Code2, 
  Cpu, 
  Database, 
  Layers, 
  Globe, 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Clock, 
  Award, 
  ChevronRight, 
  ChevronDown,
  ArrowRight,
  Zap,
  CheckCircle2,
  FileCode,
  Box,
  Binary,
  Workflow
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Comprehensive articles catalogue with diagrams, multi-language code, and multi-site references
const TUTORIAL_ARTICLES = [
  {
    id: 'binary-search-tree',
    title: 'Binary Search Tree (BST): Insertion, Deletion & Traversals',
    category: 'Data Structures',
    domain: 'dsa',
    difficulty: 'Medium',
    readTime: '12 min read',
    updated: 'Updated Sep 2024',
    companies: ['Google', 'Amazon', 'Microsoft', 'Adobe'],
    summary: 'A Binary Search Tree is a node-based binary tree data structure where each node has at most two child nodes. The left subtree contains only nodes with keys less than the node’s key, and the right subtree contains only nodes with keys greater.',
    diagramType: 'tree',
    diagramData: {
      root: '50',
      left: '30',
      right: '70',
      leftLeft: '20',
      leftRight: '40',
      rightLeft: '60',
      rightRight: '80'
    },
    complexity: {
      search: 'O(log N) avg / O(N) worst',
      insert: 'O(log N) avg / O(N) worst',
      delete: 'O(log N) avg / O(N) worst',
      space: 'O(N) memory storage'
    },
    codeSnippets: {
      java: `// Java Implementation of BST Insertion & Inorder Traversal
class Node {
    int key;
    Node left, right;

    public Node(int item) {
        key = item;
        left = right = null;
    }
}

class BinarySearchTree {
    Node root;

    // A recursive function to insert a new key in BST
    Node insertRec(Node root, int key) {
        if (root == null) {
            root = new Node(key);
            return root;
        }
        if (key < root.key)
            root.left = insertRec(root.left, key);
        else if (key > root.key)
            root.right = insertRec(root.right, key);

        return root;
    }

    void inorderRec(Node root) {
        if (root != null) {
            inorderRec(root.left);
            System.out.print(root.key + " ");
            inorderRec(root.right);
        }
    }
}`,
      cpp: `// C++ Implementation of BST Insertion
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {
    if (root == nullptr) return new Node(val);
    if (val < root->data)
        root->left = insert(root->left, val);
    else
        root->right = insert(root->right, val);
    return root;
}

void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->data << " ";
    inorder(root->right);
}`,
      python: `# Python 3 BST Implementation
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, key):
    if root is None:
        return Node(key)
    else:
        if root.val < key:
            root.right = insert(root.right, key)
        else:
            root.left = insert(root.left, key)
    return root

def inorder(root):
    if root:
        inorder(root.left)
        print(root.val, end=" ")
        inorder(root.right)`
    },
    keyTakeaways: [
      'Inorder traversal of a BST always produces sorted keys in ascending order.',
      'To prevent worst-case O(N) degenerate trees, Self-Balancing BSTs like AVL Trees or Red-Black Trees are utilized in production DB engines.',
      'Used under the hood in Java TreeMap/TreeSet and C++ std::map.'
    ],
    references: [
      { name: 'GeeksforGeeks - BST Complete Guide', url: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/' },
      { name: 'Oracle Java Documentation (TreeMap)', url: 'https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html' },
      { name: 'LeetCode Problem #701: Insert into BST', url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/' }
    ]
  },
  {
    id: 'react-fiber-architecture',
    title: 'React Fiber Architecture & Virtual DOM Reconciliation',
    category: 'Web Development',
    domain: 'web',
    difficulty: 'Advanced',
    readTime: '15 min read',
    updated: 'Updated Aug 2024',
    companies: ['Meta', 'Uber', 'Netflix', 'Stripe'],
    summary: 'React Fiber is the core reimplementation of React’s reconciliation algorithm. The goal of React Fiber is to increase its suitability for areas like animation, layout, and gestures by introducing incremental rendering: the ability to split rendering work into units and pause, abort, or reuse work.',
    diagramType: 'architecture',
    complexity: {
      time: 'O(N) Diffing heuristic via Keys',
      space: 'O(Depth) Fiber Call Stack',
      phases: 'Phase 1: Render (Async) • Phase 2: Commit (Sync)'
    },
    codeSnippets: {
      javascript: `// Conceptual Representation of a Fiber Node
function createFiberNode(tag, pendingProps, key, mode) {
  return {
    // Instance attributes
    tag: tag, // Component, HostRoot, HostComponent
    key: key,
    elementType: null,
    type: null,
    stateNode: null,

    // Fiber tree structure references
    return: null, // Parent fiber
    child: null,  // First child
    sibling: null,// Next sibling
    index: 0,

    // Work units & effects
    pendingProps: pendingProps,
    memoizedProps: null,
    memoizedState: null,
    flags: 0, // Placement, Update, Deletion
    subtreeFlags: 0,
    lanes: 0 // Priority lane scheduling
  };
}`,
      java: `// Fiber Work Unit Scheduler Simulator in Java
public class FiberWorkUnit {
    String componentTag;
    int priorityLane;
    boolean isYieldRequired;

    public void performUnitOfWork(FiberNode current) {
        // Begin phase: render children & compute diff
        FiberNode next = beginWork(current);
        if (next == null) {
            completeUnitOfWork(current);
        }
    }
}`
    },
    keyTakeaways: [
      'Fiber replaces the old synchronous recursive stack reconciler with an interruptible linked-list traversal.',
      'High priority updates (User inputs, typing) can preempt lower priority work (data fetching, list rendering).',
      'Powers React 18/19 Concurrent Mode, useTransition, and Server Components (RSC).'
    ],
    references: [
      { name: 'React Official Architecture Notes (GitHub)', url: 'https://github.com/acdlite/react-fiber-architecture' },
      { name: 'MDN Web Docs - Concurrency in JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop' },
      { name: 'GeeksforGeeks - React Virtual DOM vs Real DOM', url: 'https://www.geeksforgeeks.org/reactjs-virtual-dom/' }
    ]
  },
  {
    id: 'sliding-window-algorithm',
    title: 'Sliding Window Technique: Maximum Subarray & Substring Patterns',
    category: 'Algorithms',
    domain: 'dsa',
    difficulty: 'Easy / Medium',
    readTime: '9 min read',
    updated: 'Updated Sep 2024',
    companies: ['Amazon', 'Flipkart', 'Goldman Sachs', 'TCS Digital'],
    summary: 'The Sliding Window pattern is a computational technique used to drastically reduce the time complexity of nested array/string operations from O(N^2) or O(N^3) down to linear O(N) by maintaining a running window defined by two pointers.',
    diagramType: 'slidingWindow',
    complexity: {
      time: 'O(N) Linear Time Single Pass',
      space: 'O(K) or O(1) Auxiliary Space',
      pattern: 'Fixed Size Window vs Dynamic Variable Window'
    },
    codeSnippets: {
      java: `// Java: Maximum Sum Subarray of Size K
public class SlidingWindow {
    public static int maxSubArraySum(int[] arr, int k) {
        int n = arr.length;
        if (n < k) return -1;

        // Compute sum of first window of size k
        int windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }

        int maxSum = windowSum;
        // Slide window from left to right: add incoming, drop outgoing
        for (int i = k; i < n; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }

        return maxSum;
    }
}`,
      python: `# Python: Longest Substring Without Repeating Characters
def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
      cpp: `// C++: Maximum Sum of Subarray of Size K
#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

int maxSubArraySum(const vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;
    
    int current_sum = 0;
    for(int i = 0; i < k; ++i) current_sum += arr[i];
    
    int max_sum = current_sum;
    for(int i = k; i < n; ++i) {
        current_sum += arr[i] - arr[i - k];
        max_sum = max(max_sum, current_sum);
    }
    return max_sum;
}`
    },
    keyTakeaways: [
      'Eliminates repetitive recalculation by adding the new arriving element and subtracting the departing element.',
      'Essential for streaming data calculations, network packet buffer analysis, and financial time-series moving averages.',
      'Classic interview problems: Longest Substring Without Repeating Characters, Minimum Window Substring, Max Consecutive Ones III.'
    ],
    references: [
      { name: 'GeeksforGeeks - Window Sliding Technique', url: 'https://www.geeksforgeeks.org/window-sliding-technique/' },
      { name: 'LeetCode Problem #3: Longest Substring Without Repeating', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' }
    ]
  },
  {
    id: 'system-design-caching',
    title: 'System Design: Distributed Caching Strategies & Cache-Aside with Redis',
    category: 'System Design',
    domain: 'system',
    difficulty: 'Hard',
    readTime: '18 min read',
    updated: 'Updated Sep 2024',
    companies: ['Uber', 'Swiggy', 'Amazon AWS', 'Twitter / X'],
    summary: 'Caching is an indispensable architectural strategy in high-scale distributed systems. By storing frequently requested data in lightning-fast in-memory stores like Redis or Memcached, backends achieve sub-millisecond response latency and shield primary databases from read surges.',
    diagramType: 'cacheAside',
    complexity: {
      readLatency: '0.5 ms (Redis Memory) vs 25 ms (SQL Disk)',
      strategies: 'Cache-Aside (Lazy Loading), Write-Through, Write-Back, Refresh-Ahead',
      eviction: 'LRU (Least Recently Used), LFU, TTL Expiry'
    },
    codeSnippets: {
      java: `// Spring Boot Redis Cache-Aside Implementation
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public User getUserById(Long userId) {
        String cacheKey = "user:" + userId;
        
        // 1. Check in-memory Cache
        User cachedUser = (User) redisTemplate.opsForValue().get(cacheKey);
        if (cachedUser != null) {
            return cachedUser; // Cache Hit (0.5ms)
        }

        // 2. Cache Miss: Fetch from SQL Database
        User dbUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 3. Write to Cache with 30-minute TTL
        redisTemplate.opsForValue().set(cacheKey, dbUser, Duration.ofMinutes(30));
        return dbUser;
    }
}`,
      javascript: `// Node.js Express Redis Cache-Aside Pattern
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

async function getProduct(req, res) {
  const { id } = req.params;
  const cacheKey = \`product:\${id}\`;

  try {
    // 1. Check Redis Cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      return res.json({ source: 'cache', data: JSON.parse(cachedData) });
    }

    // 2. Fetch from Database
    const product = await db.products.findById(id);
    
    // 3. Store in Redis with TTL of 1 hour
    await client.setEx(cacheKey, 3600, JSON.stringify(product));
    return res.json({ source: 'db', data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`
    },
    keyTakeaways: [
      'Cache-Aside (Lazy Loading) only caches data that is actually requested, saving valuable memory footprint.',
      'Must handle Cache Stampede (Dogpile effect) and Cache Penetration with Bloom Filters and mutex locks.',
      'Always set TTLs (Time-To-Live) on cached items to avoid stale out-of-sync database reads.'
    ],
    references: [
      { name: 'Redis Official Documentation - Caching Patterns', url: 'https://redis.io/docs/manual/patterns/' },
      { name: 'GeeksforGeeks - System Design Caching Strategies', url: 'https://www.geeksforgeeks.org/caching-system-design-concept-for-beginners/' },
      { name: 'AWS Architecture Center - Database Caching with ElastiCache', url: 'https://aws.amazon.com/caching/' }
    ]
  }
];

export default function Tutorials() {
  const [selectedArticleId, setSelectedArticleId] = useState(TUTORIAL_ARTICLES[0].id);
  const [activeCodeTab, setActiveCodeTab] = useState('java');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const selectedArticle = TUTORIAL_ARTICLES.find(a => a.id === selectedArticleId) || TUTORIAL_ARTICLES[0];

  const filteredArticles = useMemo(() => {
    return TUTORIAL_ARTICLES.filter(art => {
      const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = activeFilter === 'all' || art.domain === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [searchQuery, activeFilter]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] text-slate-900 font-sans pb-24">
      
      {/* ── 1. GEEKS KNOWLEDGE HERO HEADER ── */}
      <section className="bg-[#1c1d21] text-white pt-12 pb-14 px-4 sm:px-8 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-400/10 via-emerald-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Geeks TechWiki & Coding Encyclopedia</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-quicksand text-white tracking-tight leading-tight">
                Master Algorithms, System Design & Full Stack Engineering
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 font-medium">
                High-yield technical tutorials, interactive memory diagrams, multi-language code snippets, and interview questions curated from industry standards.
              </p>
            </div>

            {/* Multi-website citation indicator */}
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md text-xs space-y-1.5 max-w-xs">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                🌐 Multi-Platform Knowledge Hub
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                Integrated insights from <strong>GeeksforGeeks</strong>, <strong>MDN Web Docs</strong>, <strong>Oracle Java Specs</strong>, and <strong>LeetCode Discuss</strong>.
              </p>
            </div>
          </div>

          {/* Search Bar & Category Filter Pills */}
          <div className="pt-2 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search DSA, Trees, Dynamic Programming, Redis Caching, React Fiber..."
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/15 rounded-2xl text-sm text-white placeholder:text-slate-400 outline-none focus:bg-white/15 focus:border-amber-400 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
              {[
                { id: 'all', label: 'All Articles' },
                { id: 'dsa', label: 'DSA & Algorithms' },
                { id: 'web', label: 'MERN & Full Stack' },
                { id: 'system', label: 'System Design & SQL' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN TUTORIAL LAYOUT (SIDEBAR + ARTICLE CONTENT) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Topics & Article Navigator */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>Curated Learning Topics</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {filteredArticles.length} Tutorials
                </span>
              </div>

              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {filteredArticles.map((art) => {
                  const isSelected = art.id === selectedArticle.id;
                  return (
                    <div
                      key={art.id}
                      onClick={() => {
                        setSelectedArticleId(art.id);
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1c1d21] text-white border-slate-900 shadow-md ring-2 ring-amber-400/40'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {art.category}
                        </span>
                        <span className={`text-[10px] font-bold ${
                          art.difficulty === 'Easy' ? 'text-emerald-500' : art.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                          {art.difficulty}
                        </span>
                      </div>

                      <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {art.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] mt-2 pt-2 border-t border-white/10 text-slate-400">
                        <span>{art.readTime}</span>
                        <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                          Read Tutorial <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Compiler Link Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white space-y-2 mt-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-200" />
                  <span className="text-xs font-black">Interactive 1000 DSA Compiler</span>
                </div>
                <p className="text-[11px] text-emerald-100">
                  Practice Java, Python, and C++ algorithms live with AI suggestions & weekly leaderboard ranking.
                </p>
                <Link
                  to="/practice"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-all shadow-sm"
                >
                  <span>Open Practice Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Full Rich Article Viewer */}
          <div className="lg:col-span-8 space-y-6">
            <article className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* Header Badges & Title */}
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                    selectedArticle.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' : selectedArticle.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedArticle.difficulty} Level
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedArticle.readTime}
                  </span>
                  <span className="text-xs text-slate-400">• {selectedArticle.updated}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-quicksand text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>

                {/* Company Tags */}
                {selectedArticle.companies?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[11px] font-bold text-slate-500">Asked in Interviews at:</span>
                    {selectedArticle.companies.map((comp, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                        {comp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary Description */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                <p>{selectedArticle.summary}</p>
              </div>

              {/* ── 3. INTERACTIVE VISUAL DIAGRAM / FLOWCHART CARD ── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-amber-500" />
                    <span>Visual Architecture & Data Structure Diagram:</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Interactive Topology
                  </span>
                </div>

                {/* Render Specific Diagram Based on Article Type */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-inner flex flex-col items-center justify-center">
                  
                  {selectedArticle.diagramType === 'tree' && (
                    <div className="space-y-4 text-center font-mono">
                      {/* Root Node */}
                      <div className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-sm shadow-md">
                        Root: 50
                      </div>

                      {/* Connectors */}
                      <div className="flex justify-center gap-24 text-slate-500 font-bold text-xs">
                        <span>↙ (keys &lt; 50)</span>
                        <span>(keys &gt; 50) ↘</span>
                      </div>

                      {/* Level 1 Nodes */}
                      <div className="flex justify-center gap-16">
                        <div className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow">
                          Node: 30
                        </div>
                        <div className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow">
                          Node: 70
                        </div>
                      </div>

                      {/* Level 2 Leaves */}
                      <div className="flex justify-center gap-6 pt-2">
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 text-[11px] border border-slate-700">20</div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 text-[11px] border border-slate-700">40</div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 text-[11px] border border-slate-700">60</div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 text-[11px] border border-slate-700">80</div>
                      </div>
                    </div>
                  )}

                  {selectedArticle.diagramType === 'slidingWindow' && (
                    <div className="space-y-4 text-center w-full max-w-md font-mono">
                      <div className="text-xs text-amber-300 font-bold">
                        Array: [ 2, 1, 5, 1, 3, 2 ], Window Size K = 3
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center border-2 border-yellow-200">
                          2
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center border-2 border-yellow-200">
                          1
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-amber-400 text-black font-black flex items-center justify-center border-2 border-yellow-200">
                          5
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center justify-center border border-slate-700">
                          1
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center justify-center border border-slate-700">
                          3
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Current Window Sum: (2 + 1 + 5) = <strong>8</strong> ➜ Next Step: Drop 2, Add 1 ➜ Sum: <strong>7</strong>
                      </p>
                    </div>
                  )}

                  {selectedArticle.diagramType === 'cacheAside' && (
                    <div className="space-y-4 text-center w-full max-w-lg font-mono text-xs">
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="p-3 bg-blue-600 rounded-xl font-bold">
                          Client / Backend
                        </div>
                        <div className="p-3 bg-rose-600 rounded-xl font-bold">
                          ⚡ Redis Cache (0.5ms)
                        </div>
                        <div className="p-3 bg-indigo-700 rounded-xl font-bold">
                          💾 Primary SQL DB (25ms)
                        </div>
                      </div>
                      <div className="text-[11px] text-amber-300 font-sans text-left space-y-1 bg-black/40 p-3 rounded-xl border border-white/10">
                        <p>1️⃣ <strong>Read Request</strong>: Check Redis memory cache first.</p>
                        <p>2️⃣ <strong>Cache Hit</strong>: Return data instantly in &lt;1 millisecond.</p>
                        <p>3️⃣ <strong>Cache Miss</strong>: Query SQL disk DB, then backfill Redis cache with TTL.</p>
                      </div>
                    </div>
                  )}

                  {selectedArticle.diagramType === 'architecture' && (
                    <div className="space-y-3 text-center w-full max-w-lg font-mono text-xs">
                      <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold">
                        React Fiber Root Scheduler (Lanes & Prioritization)
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <span className="text-amber-400 block font-bold mb-1">Phase 1: Render</span>
                          <span className="text-[10px] text-slate-400">Asynchronous, can be paused/aborted by scheduler</span>
                        </div>
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <span className="text-emerald-400 block font-bold mb-1">Phase 2: Commit</span>
                          <span className="text-[10px] text-slate-400">Synchronous DOM mutations & LifeCycle triggers</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* ── 4. COMPLEXITY ANALYSIS CARD ── */}
              {selectedArticle.complexity && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    ⚡ Complexity & Performance Benchmarks:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedArticle.complexity).map(([k, v]) => (
                      <div key={k} className="p-2 bg-white rounded-xl border border-slate-200 flex justify-between items-center font-medium">
                        <span className="text-slate-500 uppercase text-[10px] font-bold">{k}:</span>
                        <span className="font-bold text-slate-900 font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 5. MULTI-LANGUAGE CODE VIEWER (JAVA, C++, PYTHON, JS) ── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Implementation & Code Examples:
                    </span>
                  </div>

                  {/* Language Selector Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    {Object.keys(selectedArticle.codeSnippets).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveCodeTab(lang)}
                        className={`px-3 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                          activeCodeTab === lang
                            ? 'bg-[#1c1d21] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Window */}
                <div className="rounded-2xl overflow-hidden bg-[#1c1d21] border border-slate-800 text-slate-200 font-mono text-xs shadow-md">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span className="text-[11px] text-slate-400 font-bold uppercase ml-2">
                        {activeCodeTab} Solution
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(selectedArticle.codeSnippets[activeCodeTab] || '')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                      <Link
                        to="/practice"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black transition-all shadow-xs"
                      >
                        <Terminal className="w-3 h-3" />
                        <span>Run in Compiler</span>
                      </Link>
                    </div>
                  </div>

                  <div className="p-4 overflow-x-auto max-h-[420px] leading-relaxed">
                    <pre>
                      <code>{selectedArticle.codeSnippets[activeCodeTab] || Object.values(selectedArticle.codeSnippets)[0]}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* ── 6. KEY TAKEAWAYS & INTERVIEW CHEATSHEET ── */}
              {selectedArticle.keyTakeaways && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Takeaways & Interview Points:</span>
                  </span>
                  <div className="space-y-1.5">
                    {selectedArticle.keyTakeaways.map((point, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="font-medium leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 7. MULTI-WEBSITE REFERENCES & CITATIONS ── */}
              {selectedArticle.references && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                    🌐 Official Documentation & Multi-Website References:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedArticle.references.map((ref, i) => (
                      <a
                        key={i}
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:text-amber-700 transition-colors group shadow-2xs"
                      >
                        <span className="truncate pr-2">{ref.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </article>
          </div>

        </div>
      </div>

    </div>
  );
}