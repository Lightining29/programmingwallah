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
  Workflow,
  Layout,
  Palette,
  FileText,
  HelpCircle,
  FolderTree,
  Filter,
  CheckCircle,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TOPIC-WISE TUTORIAL ARTICLES (HTML, CSS, JS, REACT, PYTHON, OOPS, DSA)
// ─────────────────────────────────────────────────────────────────────────────
const TUTORIAL_ARTICLES = [
  // ── 🌐 HTML & HTML5 ──
  {
    id: 'html5-semantic-dom',
    title: 'HTML5 Semantic Elements, Document Object Model (DOM) & Web Accessibility',
    category: 'HTML & HTML5',
    domain: 'html',
    difficulty: 'Beginner',
    readTime: '10 min read',
    updated: 'Updated 2024 Edition',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
    summary: 'HTML5 provides semantic markup tags that give meaning to web structure rather than just visual appearance. Understanding the hierarchical DOM Tree, SEO metadata, accessible form validation, and multimedia elements is fundamental to web engineering.',
    diagramType: 'htmlDomTree',
    complexity: {
      domParsing: 'O(N) Linear Tokenization & Tree Construction',
      rendering: 'DOM + CSSOM = Render Tree (Layout & Paint)',
      accessibility: 'ARIA Roles & Screen Reader Semantics',
      storage: 'localStorage (5MB) vs sessionStorage vs IndexedDB'
    },
    codeSnippets: {
      html: `<!-- Modern HTML5 Semantic Structure Template -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="AppleTree Infotech Interactive Learning Hub">
  <title>Semantic HTML5 Architecture</title>
</head>
<body>
  <!-- Header with Navigation Landmark -->
  <header role="banner" class="site-header">
    <nav role="navigation" aria-label="Main Navigation">
      <ul class="nav-list">
        <li><a href="#courses">Courses</a></li>
        <li><a href="#tutorials">Tutorials</a></li>
        <li><a href="#compiler">1000 DSA Hub</a></li>
      </ul>
    </nav>
  </header>

  <!-- Main Content Area -->
  <main id="main-content" role="main">
    <article class="tutorial-card">
      <header>
        <h1>Mastering HTML5 DOM Tree</h1>
        <p>Published: <time datetime="2024-09-01">September 1, 2024</time></p>
      </header>
      
      <section>
        <h2>Accessible User Enrollment Form</h2>
        <form action="/api/enroll" method="POST" novalidate>
          <div class="form-group">
            <label for="student-name">Full Name:</label>
            <input type="text" id="student-name" name="name" required minlength="3" placeholder="e.g. Ishika Rani" autocomplete="name">
          </div>

          <div class="form-group">
            <label for="student-email">Email Address:</label>
            <input type="email" id="student-email" name="email" required placeholder="student@example.com">
          </div>

          <button type="submit">Submit Registration</button>
        </form>
      </section>
    </article>
  </main>

  <footer role="contentinfo">
    <p>&copy; 2024 AppleTree Infotech Pvt. Ltd. All rights reserved.</p>
  </footer>
</body>
</html>`,
      javascript: `// JavaScript DOM Manipulation & Node Traversal
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const nameInput = document.getElementById('student-name');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!nameInput.value.trim()) {
      alert('Please enter a valid student name.');
      nameInput.focus();
      return;
    }

    // Dynamic DOM Element Creation & Insertion
    const badge = document.createElement('div');
    badge.className = 'status-badge success';
    badge.textContent = \`✅ Enrolled: \${nameInput.value}\`;
    document.querySelector('.tutorial-card').appendChild(badge);
  });
});`
    },
    keyTakeaways: [
      'Semantic tags (<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>) dramatically improve SEO and screen-reader accessibility.',
      'The browser creates the DOM (Document Object Model) by parsing raw HTML bytes into Characters -> Tokens -> Nodes -> DOM Tree.',
      'Always include responsive meta viewport tags and descriptive alt attributes for images.'
    ],
    references: [
      { name: 'MDN Web Docs - HTML5 Semantic Elements', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html' },
      { name: 'W3C Web Accessibility Guidelines (WCAG 2.1)', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/' },
      { name: 'WHATWG HTML Living Standard', url: 'https://html.spec.whatwg.org/' }
    ]
  },

  // ── 🎨 CSS & CSS3 ──
  {
    id: 'css-box-model-flexbox-grid',
    title: 'CSS3 Box Model, Modern Flexbox & 2D Grid Layout Engine',
    category: 'CSS & Modern Layouts',
    domain: 'css',
    difficulty: 'Beginner / Intermediate',
    readTime: '12 min read',
    updated: 'Updated 2024 Edition',
    companies: ['Apple', 'Uber', 'Airbnb', 'Stripe', 'Spotify'],
    summary: 'The CSS Box Model is the foundation of web layout: every element is a rectangular box made of Content, Padding, Border, and Margin. Modern CSS utilizes Flexbox for 1D alignments and CSS Grid for 2D multi-row, multi-column responsive systems.',
    diagramType: 'cssBoxModel',
    complexity: {
      boxSizing: 'border-box (width = content + padding + border)',
      flexbox: '1-Dimensional Axis (Main-Axis vs Cross-Axis)',
      cssGrid: '2-Dimensional Grid Tracks (Rows + Columns)',
      stackingContext: 'z-index, opacity, transform, filter'
    },
    codeSnippets: {
      css: `/* Universal Box Sizing & CSS Variables */
:root {
  --primary-color: #5B468C;
  --accent-amber: #f59e0b;
  --bg-slate: #0f172a;
  --radius-xl: 1rem;
}

*, *::before, *::after {
  box-sizing: border-box; /* Crucial: Prevents padding from breaking width */
  margin: 0;
  padding: 0;
}

/* 1. Modern Flexbox Center Alignment */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* 2. Responsive 2D CSS Grid Dashboard */
.grid-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

/* Interactive Card with CSS Transitions & Glassmorphism */
.tutorial-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tutorial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.15);
}`,
      html: `<div class="grid-dashboard">
  <div class="tutorial-card">
    <h3>Module 1: HTML5 & DOM</h3>
    <p>Semantic markup, forms, SEO, and accessibility architecture.</p>
  </div>
  <div class="tutorial-card">
    <h3>Module 2: CSS3 Grid & Flexbox</h3>
    <p>Responsive layouts, custom properties, and smooth keyframe animations.</p>
  </div>
</div>`
    },
    keyTakeaways: [
      'Always set `box-sizing: border-box` globally so padding and borders do not expand the declared element width.',
      'Use Flexbox when aligning items along a single row or single column.',
      'Use CSS Grid when building two-dimensional layouts with rows and columns simultaneously.',
      'CSS Custom Properties (Variables) allow dynamic theming and maintainability across large design systems.'
    ],
    references: [
      { name: 'MDN Web Docs - The CSS Box Model', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model' },
      { name: 'CSS Tricks - Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
      { name: 'CSS Tricks - Complete Guide to Grid', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' }
    ]
  },

  // ── ⚡ JAVASCRIPT (ES6+) ──
  {
    id: 'js-event-loop-closures',
    title: 'JavaScript Deep Dive: Event Loop, Microtask Queue, Closures & Async/Await',
    category: 'JavaScript (ES6+)',
    domain: 'javascript',
    difficulty: 'Intermediate',
    readTime: '14 min read',
    updated: 'Updated 2024 Edition',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Uber', 'Twitter / X'],
    summary: 'JavaScript is single-threaded, non-blocking, and asynchronous. Understand how the V8 Call Stack, Web APIs, Microtask Queue (Promises), and Macrotask Queue (setTimeout) collaborate via the Event Loop to deliver high-concurrency UI performance.',
    diagramType: 'jsEventLoop',
    complexity: {
      engine: 'V8 (Call Stack + Memory Heap + Garbage Collection)',
      microtasks: 'Promise.then, queueMicrotask, MutationObserver (High Priority)',
      macrotasks: 'setTimeout, setInterval, setImmediate, I/O events',
      closureSpace: 'Lexical Environment retained on heap'
    },
    codeSnippets: {
      javascript: `// 1. Event Loop Execution Order Demonstration
console.log('1. Synchronous Script Start');

setTimeout(() => {
  console.log('4. Macrotask Queue: setTimeout fired');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask Queue: Promise.then resolved');
});

console.log('2. Synchronous Script End');

// Output order: 1 -> 2 -> 3 (Microtask) -> 4 (Macrotask)

// 2. Powerful Closures & Factory Pattern
function createFeeTracker(studentName, initialFee) {
  let submittedFee = initialFee; // Private variable enclosed in Lexical Scope

  return {
    submitInstallment(amount) {
      submittedFee += amount;
      return \`\${studentName}: Total Paid = ₹\${submittedFee}\`;
    },
    getBalance(totalCourseFee) {
      return totalCourseFee - submittedFee;
    }
  };
}

const studentAccount = createFeeTracker('Ishika Rani', 8000);
console.log(studentAccount.submitInstallment(4000)); // "Ishika Rani: Total Paid = ₹12000"
console.log('Remaining Balance:', studentAccount.getBalance(12000)); // 0`,
      python: `# Python Equivalent using Closures
def create_fee_tracker(student_name, initial_fee):
    submitted_fee = initial_fee
    
    def submit_installment(amount):
        nonlocal submitted_fee
        submitted_fee += amount
        return f"{student_name}: Total Paid = ₹{submitted_fee}"
        
    return submit_installment

tracker = create_fee_tracker("Ishika Rani", 8000)
print(tracker(4000))`
    },
    keyTakeaways: [
      'Microtask Queue (Promises) always drains completely before the Event Loop picks the next Macrotask (setTimeout).',
      'A Closure occurs when an inner function remembers and accesses variables from its outer lexical scope even after the outer function has returned.',
      'Async/await is syntactic sugar over native Promises, compiling to non-blocking generator-like state machines.'
    ],
    references: [
      { name: 'MDN Web Docs - The JavaScript Event Loop', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop' },
      { name: 'TC39 ECMAScript Specifications', url: 'https://tc39.es/ecma262/' },
      { name: 'V8 Engine Architecture & Garbage Collection', url: 'https://v8.dev/' }
    ]
  },

  // ── ⚛️ REACT.JS ──
  {
    id: 'react-hooks-virtual-dom',
    title: 'React.js: Virtual DOM, Fiber Reconciliation Engine, Custom Hooks & State Flow',
    category: 'React.js Framework',
    domain: 'react',
    difficulty: 'Intermediate / Advanced',
    readTime: '15 min read',
    updated: 'Updated 2024 Edition',
    companies: ['Meta', 'Uber', 'Airbnb', 'Netflix', 'Shopify'],
    summary: 'React revolutionized frontend architecture by introducing a Virtual DOM and declarative UI. React Fiber enables concurrent rendering, prioritizing user inputs over background updates while Hooks like useMemo, useCallback, and Context provide state management.',
    diagramType: 'reactFiberVirtualDom',
    complexity: {
      diffing: 'O(N) Heuristic reconciliation via Unique Keys',
      reconciliation: 'Render Phase (Async, cancellable) -> Commit Phase (Sync)',
      hookState: 'Linked-list structure attached to Fiber Node',
      optimization: 'React.memo, useMemo (Cache Values), useCallback (Cache Fn)'
    },
    codeSnippets: {
      javascript: `// Modern React 18+ Component with Custom Hooks & State
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Custom Hook for Student Live Fees
function useStudentFees(studentEmail) {
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('appletree_student_fees') || '{}');
    const studentData = stored[studentEmail.toLowerCase()] || {
      totalFee: 12000,
      paidAmount: 8000,
      remainingAmount: 4000,
      status: 'PARTIAL'
    };
    setFees(studentData);
    setLoading(false);
  }, [studentEmail]);

  return { fees, loading };
}

// Student Tuition Summary Component
export function TuitionDashboard({ studentEmail }) {
  const { fees, loading } = useStudentFees(studentEmail);
  const [filterTerm, setFilterTerm] = useState('');

  // Memoize costly computed percentages
  const paymentPercentage = useMemo(() => {
    if (!fees || fees.totalFee === 0) return 0;
    return Math.round((fees.paidAmount / fees.totalFee) * 100);
  }, [fees]);

  // Memoize stable callback reference
  const handlePaymentAlert = useCallback(() => {
    alert(\`Outstanding fee balance: ₹\${fees?.remainingAmount}\`);
  }, [fees?.remainingAmount]);

  if (loading) return <div>Loading Fee Ledger...</div>;

  return (
    <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold font-quicksand">Student Fee Statement</h2>
      <div className="mt-4 p-4 bg-white/10 rounded-2xl">
        <p>Total Course Fee: <strong>₹{fees.totalFee}</strong></p>
        <p>Paid Amount: <strong className="text-emerald-400">₹{fees.paidAmount} ({paymentPercentage}%)</strong></p>
        <p>Remaining Due: <strong className="text-rose-400">₹{fees.remainingAmount}</strong></p>
      </div>
      <button onClick={handlePaymentAlert} className="mt-4 px-4 py-2 bg-amber-400 text-black font-bold rounded-xl">
        Check Due Status
      </button>
    </div>
  );
}`
    },
    keyTakeaways: [
      'React Fiber splits work into small chunks called Fibers, allowing the browser to remain responsive during heavy updates.',
      'Keys must be unique and stable among siblings so React can correctly track element additions, deletions, and moves.',
      'Rules of Hooks: Only call hooks at the top level of React functions (never inside loops, conditions, or nested functions).'
    ],
    references: [
      { name: 'React Official Documentation (react.dev)', url: 'https://react.dev/' },
      { name: 'React Fiber Architecture Specification', url: 'https://github.com/acdlite/react-fiber-architecture' },
      { name: 'Overreacted - Dan Abramov on React Mental Models', url: 'https://overreacted.io/' }
    ]
  },

  // ── 🐍 PYTHON & AI ──
  {
    id: 'python-oop-memory-ai',
    title: 'Python: Memory Management, Reference Counting, GIL, OOP & Generator Pipelines',
    category: 'Python & AI Engineering',
    domain: 'python',
    difficulty: 'Intermediate',
    readTime: '13 min read',
    updated: 'Updated 2024 Edition',
    companies: ['Google', 'OpenAI', 'Meta', 'Microsoft', 'NVIDIA'],
    summary: 'Python is a high-level interpreted programming language powering modern Artificial Intelligence, Machine Learning, and backend APIs. Learn CPython reference counting, garbage collection cycles, Global Interpreter Lock (GIL), magic dunder methods, and generator pipelines.',
    diagramType: 'pythonMemoryModel',
    complexity: {
      memory: 'Reference Counting + Generational Garbage Collector (Gen 0, 1, 2)',
      gil: 'Global Interpreter Lock ensures single-thread bytecode execution in CPython',
      generators: 'O(1) Memory Streaming via yield lazy evaluation',
      dataStructures: 'List O(1) amortized append, Dict O(1) hash lookup'
    },
    codeSnippets: {
      python: `# Python Object-Oriented Programming & Generator Pipeline
from typing import List, Generator

class StudentScholar:
    """Represents an enrolled student in AppleTree Infotech."""
    
    # Class variable
    ACADEMY_NAME = "AppleTree Infotech"

    def __init__(self, name: str, email: str, total_fee: float = 12000.0):
        self.name = name
        self.email = email
        self.total_fee = total_fee
        self._paid_amount = 0.0 # Encapsulated protected attribute

    @property
    def remaining_fee(self) -> float:
        """Dynamic getter for remaining dues."""
        return max(0.0, self.total_fee - self._paid_amount)

    def submit_fee(self, amount: float) -> str:
        self._paid_amount += amount
        return f"Payment of ₹{amount:,.2f} recorded for {self.name}."

    def __repr__(self) -> str:
        return f"<StudentScholar: {self.name} | Due: ₹{self.remaining_fee:,.2f}>"


# Generator Pipeline for Streaming Large DSA Datasets with O(1) Memory
def dsa_problem_stream(total_problems: int = 1000) -> Generator[dict, None, None]:
    for problem_id in range(1, total_problems + 1):
        yield {
            "id": problem_id,
            "title": f"DSA Problem #{problem_id}",
            "difficulty": "Easy" if problem_id % 3 == 0 else "Medium" if problem_id % 2 == 0 else "Hard"
        }

# Consuming the generator stream
stream = dsa_problem_stream(1000)
print(next(stream)) # {'id': 1, 'title': 'DSA Problem #1', 'difficulty': 'Hard'}
print(next(stream)) # {'id': 2, 'title': 'DSA Problem #2', 'difficulty': 'Medium'}`,
      java: `// Equivalent Java Class Representation
public class StudentScholar {
    private String name;
    private String email;
    private double totalFee;
    private double paidAmount;

    public StudentScholar(String name, String email, double totalFee) {
        this.name = name;
        this.email = email;
        this.totalFee = totalFee;
        this.paidAmount = 0.0;
    }

    public double getRemainingFee() {
        return Math.max(0.0, totalFee - paidAmount);
    }
}`
    },
    keyTakeaways: [
      'In Python, everything is an object. Variables are pointers (references) to objects stored on the heap.',
      'Generators (`yield`) process massive data streams item-by-item with constant O(1) memory overhead.',
      'Use list comprehensions, decorators, and type hinting (`typing`) for performant and clean Pythonic code.'
    ],
    references: [
      { name: 'Python Official Documentation (python.org)', url: 'https://docs.python.org/3/' },
      { name: 'CPython Internal Memory Management & Garbage Collection', url: 'https://docs.python.org/3/c-api/memory.html' },
      { name: 'Real Python - OOP and Design Patterns in Python', url: 'https://realpython.com/' }
    ]
  },

  // ── 🧩 OOPS (OBJECT ORIENTED PROGRAMMING) ──
  {
    id: 'oops-4-pillars-solid-design',
    title: 'OOPs Architecture: 4 Core Pillars, Class Hierarchies, SOLID Principles & Design Patterns',
    category: 'OOPs & System Architecture',
    domain: 'oops',
    difficulty: 'Intermediate',
    readTime: '16 min read',
    updated: 'Updated 2024 Edition',
    companies: ['Google', 'Oracle', 'Microsoft', 'Amazon', 'Adobe', 'Morgan Stanley'],
    summary: 'Object-Oriented Programming (OOP) models software around data and objects rather than logic and functions. Master the 4 Pillars (Encapsulation, Abstraction, Inheritance, Polymorphism) and the 5 SOLID engineering principles used by leading enterprise tech companies.',
    diagramType: 'oopsPillarsSolid',
    complexity: {
      pillars: 'Encapsulation • Abstraction • Inheritance • Polymorphism',
      solid: 'S: Single Responsibility | O: Open-Closed | L: Liskov | I: Interface Segregation | D: Dependency Inversion',
      patterns: 'Creational (Singleton, Factory) • Structural (Adapter, Facade) • Behavioral (Observer, Strategy)'
    },
    codeSnippets: {
      java: `// Comprehensive Java Example of 4 OOP Pillars & SOLID Principles

// 1. ABSTRACTION & INTERFACE SEGREGATION
interface PaymentGateway {
    boolean processPayment(double amount);
}

abstract class UserAccount {
    // 2. ENCAPSULATION: Private variables with public getter/setter
    private String id;
    private String name;
    private String email;

    public UserAccount(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public String getName() { return name; }
    public abstract String getRolePermissions(); // Abstract method
}

// 3. INHERITANCE: Student extends UserAccount
class StudentUser extends UserAccount {
    private String enrolledCourse;
    private double feeBalance;

    public StudentUser(String id, String name, String email, String course, double fee) {
        super(id, name, email);
        this.enrolledCourse = course;
        this.feeBalance = fee;
    }

    // 4. POLYMORPHISM: Dynamic Method Overriding
    @Override
    public String getRolePermissions() {
        return "Student Portal Access: View Materials, Submit DSA Solutions, Download Invoices.";
    }

    public void deductFee(double amount) {
        this.feeBalance = Math.max(0, this.feeBalance - amount);
    }
}

// DEPENDENCY INVERSION PRINCIPLE: High-level module depends on abstraction
class FeeCollectionService {
    private PaymentGateway gateway; // Loosely coupled

    public FeeCollectionService(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public boolean collectStudentFee(StudentUser student, double amount) {
        boolean success = gateway.processPayment(amount);
        if (success) {
            student.deductFee(amount);
            System.out.println("Payment verified for " + student.getName());
        }
        return success;
    }
}`,
      cpp: `// C++ Polymorphism & Abstract Classes Example
#include <iostream>
#include <string>
using namespace std;

class UserAccount {
protected:
    string name;
public:
    UserAccount(string n) : name(n) {}
    virtual void showRole() = 0; // Pure Virtual Function (Abstract)
    virtual ~UserAccount() {}
};

class Student : public UserAccount {
public:
    Student(string n) : UserAccount(n) {}
    void showRole() override {
        cout << name << " has Student Privileges: Access 1000 DSA Hub" << endl;
    }
};`,
      python: `# Python OOP Implementation of 4 Pillars
from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        pass

class RazorpayUPI(PaymentGateway):
    def process_payment(self, amount: float) -> bool:
        print(f"⚡ Razorpay Webhook: Verified ₹{amount:,.2f} UPI Transaction.")
        return True`
    },
    keyTakeaways: [
      'Encapsulation hides internal state and exposes safe access methods to protect object integrity.',
      'Polymorphism allows objects of different classes to be treated as objects of a common superclass.',
      'SOLID principles make enterprise codebases extensible, testable, maintainable, and refactor-friendly.'
    ],
    references: [
      { name: 'Oracle Java Documentation - Object-Oriented Concepts', url: 'https://docs.oracle.com/javase/tutorial/java/concepts/' },
      { name: 'Refactoring.Guru - Design Patterns & SOLID', url: 'https://refactoring.guru/design-patterns' },
      { name: 'Clean Architecture by Robert C. Martin (Uncle Bob)', url: 'https://blog.cleancoder.com/' }
    ]
  },

  // ── 🧠 1000 DSA PROBLEM SPOTLIGHTS ──
  {
    id: 'dsa-binary-search-tree',
    title: 'DSA #1: Binary Search Tree (BST) Insertion, Deletion & LCA Search',
    category: '1000 DSA Curated Problems',
    domain: 'dsa',
    difficulty: 'Medium',
    readTime: '12 min read',
    updated: 'Curated Interview Pattern',
    companies: ['Google', 'Amazon', 'Microsoft', 'Adobe'],
    summary: 'A Binary Search Tree is a node-based binary tree data structure where each node has at most two children. The left subtree contains keys < root, and the right subtree contains keys > root. Inorder traversal yields elements in sorted ascending order.',
    diagramType: 'tree',
    complexity: {
      search: 'O(log N) average / O(N) worst-case',
      insert: 'O(log N) average / O(N) worst-case',
      delete: 'O(log N) average / O(N) worst-case',
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
    if (val < root->data) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
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
    if key < root.val:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root`
    },
    keyTakeaways: [
      'Inorder traversal of a BST always produces sorted keys in ascending order.',
      'Self-Balancing BSTs (AVL, Red-Black Trees) prevent degenerate O(N) linked list trees.',
      'Powers Java TreeMap/TreeSet and C++ std::map under the hood.'
    ],
    references: [
      { name: 'LeetCode Problem #701: Insert into BST', url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/' },
      { name: 'Oracle Java Documentation (TreeMap)', url: 'https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html' }
    ]
  },

  {
    id: 'dsa-sliding-window-algorithm',
    title: 'DSA #2: Sliding Window Algorithm (Max Subarray & Dynamic Windows)',
    category: '1000 DSA Curated Problems',
    domain: 'dsa',
    difficulty: 'Easy / Medium',
    readTime: '10 min read',
    updated: 'Curated Interview Pattern',
    companies: ['Amazon', 'Flipkart', 'Goldman Sachs', 'TCS Digital'],
    summary: 'The Sliding Window pattern reduces nested array/string operations from O(N^2) down to linear O(N) time by maintaining running window boundaries using two pointers.',
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

        int windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i];

        int maxSum = windowSum;
        for (int i = k; i < n; i++) {
            windowSum += arr[i] - arr[i - k]; // Slide window: add incoming, drop outgoing
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }
}`,
      python: `# Python: Longest Substring Without Repeating Characters
def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    left = max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`
    },
    keyTakeaways: [
      'Eliminates recalculation by reusing the sum of overlapping subarray boundaries.',
      'Classic interview problems: Longest Substring Without Repeating Characters, Minimum Window Substring, Max Consecutive Ones.'
    ],
    references: [
      { name: 'LeetCode Problem #3: Longest Substring Without Repeating', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' }
    ]
  },

  {
    id: 'dsa-trapping-rain-water',
    title: 'DSA #3: Trapping Rain Water (Two Pointers & Monotonic Stack)',
    category: '1000 DSA Curated Problems',
    domain: 'dsa',
    difficulty: 'Hard',
    readTime: '15 min read',
    updated: 'Curated Interview Pattern',
    companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],
    summary: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    diagramType: 'trappingRainWater',
    complexity: {
      time: 'O(N) Single pass with two pointers',
      space: 'O(1) Constant auxiliary space',
      approaches: '1. Brute Force O(N^2) • 2. Dynamic Array O(N) Space • 3. Two Pointers O(1) Space'
    },
    codeSnippets: {
      java: `// Java Two Pointers Optimal Solution O(N) Time, O(1) Space
public class TrappingRainWater {
    public int trap(int[] height) {
        if (height == null || height.length == 0) return 0;
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int totalWater = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else totalWater += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else totalWater += rightMax - height[right];
                right--;
            }
        }
        return totalWater;
    }
}`,
      python: `# Python Two Pointers Trapping Rain Water
def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water`,
      cpp: `// C++ Trapping Rain Water
#include <vector>
#include <algorithm>
using namespace std;

int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int left_max = 0, right_max = 0, ans = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            height[left] >= left_max ? (left_max = height[left]) : ans += (left_max - height[left]);
            ++left;
        } else {
            height[right] >= right_max ? (right_max = height[right]) : ans += (right_max - height[right]);
            --right;
        }
    }
    return ans;
}`
    },
    keyTakeaways: [
      'Water trapped at any index is min(max_left, max_right) - height[i].',
      'The Two Pointer approach allows tracking boundaries from both ends with zero auxiliary memory arrays.'
    ],
    references: [
      { name: 'LeetCode Problem #42: Trapping Rain Water', url: 'https://leetcode.com/problems/trapping-rain-water/' }
    ]
  },

  {
    id: 'dsa-01-knapsack-dp',
    title: 'DSA #4: 0/1 Knapsack & Dynamic Programming Optimization',
    category: '1000 DSA Curated Problems',
    domain: 'dsa',
    difficulty: 'Medium / Hard',
    readTime: '14 min read',
    updated: 'Curated Interview Pattern',
    companies: ['Google', 'Amazon', 'Goldman Sachs', 'Uber'],
    summary: 'Given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value. Master 2D Matrix DP and 1D Memory Optimized Array approaches.',
    diagramType: 'dpKnapsackTable',
    complexity: {
      time: 'O(N * W) Pseudo-polynomial time',
      space: 'O(W) 1D Array Space Optimization',
      stateEquation: 'dp[w] = max(dp[w], val[i-1] + dp[w - wt[i-1]])'
    },
    codeSnippets: {
      java: `// Java 0/1 Knapsack (1D Space Optimized)
public class Knapsack {
    public static int knapSack(int W, int[] wt, int[] val, int n) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < n; i++) {
            for (int w = W; w >= wt[i]; w--) {
                dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);
            }
        }
        return dp[W];
    }
}`,
      python: `# Python 0/1 Knapsack 1D DP
def knapSack(W: int, wt: list, val: list, n: int) -> int:
    dp = [0] * (W + 1)
    for i in range(n):
        for w in range(W, wt[i] - 1, -1):
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]])
    return dp[W]`
    },
    keyTakeaways: [
      'Iterating the inner weight loop backwards in 1D DP prevents using the same item multiple times in 0/1 knapsack.',
      'Forms the foundation for Subset Sum, Partition Equal Subset Sum, and Target Sum problems.'
    ],
    references: [
      { name: 'LeetCode Problem #416: Partition Equal Subset Sum', url: 'https://leetcode.com/problems/partition-equal-subset-sum/' }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. 1000 CURATED DSA QUESTIONS DIRECTORY & TAXONOMY
// ─────────────────────────────────────────────────────────────────────────────
const DSA_QUESTION_BANK = [
  { id: 1, title: 'Two Sum (Hash Map Lookup)', topic: 'Arrays & Hashing', difficulty: 'Easy', companies: ['Google', 'Amazon', 'Meta'], time: 'O(N)', space: 'O(N)' },
  { id: 2, title: 'Longest Substring Without Repeating Characters', topic: 'Sliding Window', difficulty: 'Medium', companies: ['Amazon', 'Microsoft'], time: 'O(N)', space: 'O(min(N, M))' },
  { id: 3, title: 'Trapping Rain Water', topic: 'Two Pointers', difficulty: 'Hard', companies: ['Google', 'Meta', 'Amazon'], time: 'O(N)', space: 'O(1)' },
  { id: 4, title: 'Reverse a Linked List (Iterative & Recursive)', topic: 'Linked Lists', difficulty: 'Easy', companies: ['Microsoft', 'Adobe', 'Apple'], time: 'O(N)', space: 'O(1)' },
  { id: 5, title: 'Detect & Remove Loop in Linked List (Floyd Cycle)', topic: 'Linked Lists', difficulty: 'Medium', companies: ['Amazon', 'Qualcomm'], time: 'O(N)', space: 'O(1)' },
  { id: 6, title: 'Binary Tree Level Order Traversal (BFS Queue)', topic: 'Trees & BST', difficulty: 'Medium', companies: ['Meta', 'Uber', 'LinkedIn'], time: 'O(N)', space: 'O(N)' },
  { id: 7, title: 'Lowest Common Ancestor in Binary Tree', topic: 'Trees & BST', difficulty: 'Medium', companies: ['Meta', 'Amazon', 'Microsoft'], time: 'O(N)', space: 'O(H)' },
  { id: 8, title: '0/1 Knapsack Problem (DP State Compression)', topic: 'Dynamic Programming', difficulty: 'Medium', companies: ['Google', 'Goldman Sachs'], time: 'O(N*W)', space: 'O(W)' },
  { id: 9, title: 'Longest Common Subsequence (LCS Matrix)', topic: 'Dynamic Programming', difficulty: 'Medium', companies: ['Microsoft', 'Amazon'], time: 'O(N*M)', space: 'O(N*M)' },
  { id: 10, title: 'Word Ladder (Shortest Path in Word Graph BFS)', topic: 'Graphs & BFS/DFS', difficulty: 'Hard', companies: ['Amazon', 'Google'], time: 'O(M^2 * N)', space: 'O(M * N)' },
  { id: 11, title: 'Course Schedule (Topological Sort / Kahn Algorithm)', topic: 'Graphs & BFS/DFS', difficulty: 'Medium', companies: ['Twitter / X', 'Uber'], time: 'O(V + E)', space: 'O(V + E)' },
  { id: 12, title: 'LRU Cache Design (Hash Table + Doubly Linked List)', topic: 'System & Design', difficulty: 'Hard', companies: ['Google', 'Apple', 'Meta'], time: 'O(1) get/put', space: 'O(Capacity)' },
  { id: 13, title: 'Kth Largest Element in an Array (Min-Heap / QuickSelect)', topic: 'Heaps & Priority Queue', difficulty: 'Medium', companies: ['Meta', 'Amazon'], time: 'O(N log K)', space: 'O(K)' },
  { id: 14, title: 'Implement Trie (Prefix Tree with Search & StartsWith)', topic: 'Trie / Prefix Trees', difficulty: 'Medium', companies: ['Google', 'Microsoft'], time: 'O(WordLength)', space: 'O(Alphabet*N)' },
  { id: 15, title: 'Merge Intervals & Calendar Overlaps', topic: 'Intervals & Greedy', difficulty: 'Medium', companies: ['Meta', 'Google', 'Salesforce'], time: 'O(N log N)', space: 'O(N)' },
  { id: 16, title: 'Median of Two Sorted Arrays (Binary Search on Partition)', topic: 'Binary Search', difficulty: 'Hard', companies: ['Google', 'Microsoft', 'Amazon'], time: 'O(log(min(N, M)))', space: 'O(1)' },
  { id: 17, title: 'Subsets & Power Set (Backtracking & Bitmasking)', topic: 'Backtracking', difficulty: 'Medium', companies: ['Amazon', 'Meta'], time: 'O(N * 2^N)', space: 'O(N)' },
  { id: 18, title: 'N-Queens Problem (Backtracking with Safe Placement)', topic: 'Backtracking', difficulty: 'Hard', companies: ['Google', 'Microsoft'], time: 'O(N!)', space: 'O(N^2)' },
  { id: 19, title: 'Coin Change Problem (Fewest Coins DP)', topic: 'Dynamic Programming', difficulty: 'Medium', companies: ['Amazon', 'Adobe', 'Apple'], time: 'O(Amount * Coins)', space: 'O(Amount)' },
  { id: 20, title: 'Serialize and Deserialize Binary Tree', topic: 'Trees & BST', difficulty: 'Hard', companies: ['Meta', 'Amazon', 'Microsoft'], time: 'O(N)', space: 'O(N)' }
];

export default function Tutorials() {
  const [selectedArticleId, setSelectedArticleId] = useState(TUTORIAL_ARTICLES[0].id);
  const [activeCodeTab, setActiveCodeTab] = useState('java');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomainFilter, setActiveDomainFilter] = useState('all');
  const [selectedDsaQuestion, setSelectedDsaQuestion] = useState(null);

  const selectedArticle = TUTORIAL_ARTICLES.find(a => a.id === selectedArticleId) || TUTORIAL_ARTICLES[0];

  // Filter articles based on search query and category domain
  const filteredArticles = useMemo(() => {
    return TUTORIAL_ARTICLES.filter(art => {
      const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = activeDomainFilter === 'all' || art.domain === activeDomainFilter;
      return matchSearch && matchFilter;
    });
  }, [searchQuery, activeDomainFilter]);

  // Filter 1000 DSA questions bank
  const filteredDsaBank = useMemo(() => {
    return DSA_QUESTION_BANK.filter(q => {
      const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [searchQuery]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] text-slate-900 font-sans pb-24">
      
      {/* ── 1. TECH WIKI & INTERACTIVE TUTORIAL HERO HEADER ── */}
      <section className="bg-[#1c1d21] text-white pt-12 pb-14 px-4 sm:px-8 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-400/10 via-emerald-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AppleTree TechWiki & Tutorials Hub</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-quicksand text-white tracking-tight leading-tight">
                HTML, CSS, JS, React, Python, OOPs & 1000 DSA Problems
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 font-medium">
                Topic-wise conceptual theory, visual architecture diagrams, multi-language code solutions (Java, C++, Python, JavaScript), and 1000+ top company interview problems.
              </p>
            </div>

            {/* Platform Stats Badge */}
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md text-xs space-y-1.5 max-w-xs">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                🚀 Multi-Topic Engineering Encyclopedia
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                Featuring <strong>1000+ Curated DSA Solutions</strong>, <strong>HTML/CSS Layouts</strong>, <strong>JS Event Loop</strong>, <strong>React Virtual DOM</strong>, and <strong>OOPs Pillars</strong>.
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
                placeholder="Search HTML, CSS, JavaScript, React, Python, OOPs, 1000 DSA Problems..."
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/15 rounded-2xl text-sm text-white placeholder:text-slate-400 outline-none focus:bg-white/15 focus:border-amber-400 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'html', label: '🌐 HTML5' },
                { id: 'css', label: '🎨 CSS3' },
                { id: 'javascript', label: '⚡ JavaScript' },
                { id: 'react', label: '⚛️ React.js' },
                { id: 'python', label: '🐍 Python' },
                { id: 'oops', label: '🧩 OOPs & SOLID' },
                { id: 'dsa', label: '🧠 1000 DSA Hub' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDomainFilter(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeDomainFilter === tab.id
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
          
          {/* Left Sidebar: Topic Navigator & 1000 DSA Directory */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tutorials List */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>Curated Technical Guides</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {filteredArticles.length} Modules
                </span>
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
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
                          art.difficulty.includes('Easy') || art.difficulty.includes('Beginner')
                            ? 'text-emerald-500' 
                            : art.difficulty.includes('Medium') || art.difficulty.includes('Intermediate')
                            ? 'text-amber-500' 
                            : 'text-rose-500'
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
                          Read Full Guide <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Practice Hub Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white space-y-2 mt-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-200" />
                  <span className="text-xs font-black">Live In-Browser Code Practice</span>
                </div>
                <p className="text-[11px] text-emerald-100">
                  Run Java, Python, C++, and JS solutions in real-time with zero installation.
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

          {/* Right Column: Full Rich Article Viewer with Diagrams */}
          <div className="lg:col-span-8 space-y-8">
            <article className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* Header Badges & Title */}
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-black uppercase tracking-wider">
                    {selectedArticle.difficulty}
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
                    <span className="text-[11px] font-bold text-slate-500">Asked in Technical Interviews:</span>
                    {selectedArticle.companies.map((comp, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                        {comp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary Description */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                <p>{selectedArticle.summary}</p>
              </div>

              {/* ── 3. INTERACTIVE VISUAL UNDERSTANDING DIAGRAM ── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-amber-500" />
                    <span>Visual Understanding & Architecture Diagram:</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Conceptual Topology
                  </span>
                </div>

                {/* Render Specific Diagram Based on Article Type */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-inner flex flex-col items-center justify-center">
                  
                  {/* HTML DOM TREE DIAGRAM */}
                  {selectedArticle.diagramType === 'htmlDomTree' && (
                    <div className="space-y-4 text-center font-mono text-xs w-full max-w-xl">
                      <div className="inline-block px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md">
                        Document Node (Window.document)
                      </div>
                      <div className="text-slate-500 font-bold">↓ Root Element</div>
                      <div className="inline-block px-3.5 py-1 rounded-xl bg-blue-600 text-white font-bold">
                        &lt;html lang="en"&gt;
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl space-y-1 text-left">
                          <span className="text-cyan-400 font-bold block">&lt;head&gt; (Metadata)</span>
                          <p className="text-[10px] text-slate-400">• &lt;meta charset="UTF-8"&gt;</p>
                          <p className="text-[10px] text-slate-400">• &lt;title&gt;Page Title&lt;/title&gt;</p>
                          <p className="text-[10px] text-slate-400">• &lt;link rel="stylesheet"&gt;</p>
                        </div>
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl space-y-1 text-left">
                          <span className="text-emerald-400 font-bold block">&lt;body&gt; (Render Tree)</span>
                          <p className="text-[10px] text-slate-400">• &lt;header&gt; + &lt;nav&gt; (Landmark)</p>
                          <p className="text-[10px] text-slate-400">• &lt;main&gt; &lt;article&gt; &lt;section&gt;</p>
                          <p className="text-[10px] text-slate-400">• &lt;footer&gt; (Copyright)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CSS BOX MODEL DIAGRAM */}
                  {selectedArticle.diagramType === 'cssBoxModel' && (
                    <div className="w-full max-w-md text-center font-mono text-xs space-y-2">
                      <div className="p-4 rounded-3xl bg-amber-500/20 border-2 border-dashed border-amber-400 text-amber-300">
                        <span className="text-[10px] uppercase font-bold block mb-1">Margin (Outer White Space)</span>
                        
                        <div className="p-4 rounded-2xl bg-blue-500/30 border-2 border-blue-400 text-blue-200">
                          <span className="text-[10px] uppercase font-bold block mb-1">Border (Stroke Width)</span>
                          
                          <div className="p-4 rounded-xl bg-emerald-500/30 border-2 border-emerald-400 text-emerald-200">
                            <span className="text-[10px] uppercase font-bold block mb-1">Padding (Internal Gap)</span>
                            
                            <div className="p-3 rounded-lg bg-white text-slate-950 font-black shadow-md">
                              CONTENT (Text / Images / Children)
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">
                        <strong>box-sizing: border-box</strong> ensures Total Width = Content + Padding + Border
                      </p>
                    </div>
                  )}

                  {/* JS EVENT LOOP DIAGRAM */}
                  {selectedArticle.diagramType === 'jsEventLoop' && (
                    <div className="space-y-4 text-center w-full max-w-xl font-mono text-xs">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-blue-600/30 border border-blue-500 rounded-xl">
                          <span className="text-blue-300 font-bold block">1. Call Stack</span>
                          <span className="text-[10px] text-slate-400">Single Thread LIFO execution</span>
                        </div>
                        <div className="p-3 bg-purple-600/30 border border-purple-500 rounded-xl">
                          <span className="text-purple-300 font-bold block">2. Web APIs</span>
                          <span className="text-[10px] text-slate-400">DOM, Fetch, setTimeout timers</span>
                        </div>
                        <div className="p-3 bg-emerald-600/30 border border-emerald-500 rounded-xl">
                          <span className="text-emerald-300 font-bold block">3. Microtask Queue</span>
                          <span className="text-[10px] text-slate-400">Promises (Highest Priority)</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-[11px] text-amber-300 font-sans text-left space-y-1">
                        <p>🔄 <strong>Event Loop Cycle</strong>: When Call Stack is empty &rarr; Drain all Microtasks &rarr; Take 1 Macrotask from Queue &rarr; Repaint UI.</p>
                      </div>
                    </div>
                  )}

                  {/* REACT FIBER & VIRTUAL DOM */}
                  {selectedArticle.diagramType === 'reactFiberVirtualDom' && (
                    <div className="space-y-3 text-center w-full max-w-lg font-mono text-xs">
                      <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold">
                        React Virtual DOM Reconciliation (Fiber Tree Diffing)
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <span className="text-amber-400 block font-bold mb-1">Phase 1: Render (Async)</span>
                          <span className="text-[10px] text-slate-400">Computes VDOM diffs, can pause for urgent typing events</span>
                        </div>
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                          <span className="text-emerald-400 block font-bold mb-1">Phase 2: Commit (Sync)</span>
                          <span className="text-[10px] text-slate-400">Applies minimal mutations to real browser DOM</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PYTHON MEMORY MODEL */}
                  {selectedArticle.diagramType === 'pythonMemoryModel' && (
                    <div className="space-y-3 text-center w-full max-w-md font-mono text-xs">
                      <div className="p-3 bg-blue-700 rounded-xl font-bold">
                        CPython Memory Manager (PyObject Header)
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-amber-300 font-bold block">ob_refcnt</span>
                          <span className="text-[10px] text-slate-400">Reference count tracking</span>
                        </div>
                        <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
                          <span className="text-emerald-300 font-bold block">ob_type</span>
                          <span className="text-[10px] text-slate-400">Pointer to type descriptor</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans">
                        Automatic GC automatically frees heap memory when reference count drops to 0.
                      </p>
                    </div>
                  )}

                  {/* OOPS PILLARS & SOLID */}
                  {selectedArticle.diagramType === 'oopsPillarsSolid' && (
                    <div className="space-y-3 text-center w-full max-w-xl font-mono text-xs">
                      <div className="p-2.5 bg-purple-700 rounded-xl font-bold text-white">
                        4 Core Pillars of Object-Oriented Programming (OOPs)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                          <strong className="text-amber-300 block">1. Encapsulation</strong>
                          <span>Data Hiding & Getters/Setters</span>
                        </div>
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                          <strong className="text-blue-300 block">2. Abstraction</strong>
                          <span>Interfaces & Abstract Classes</span>
                        </div>
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                          <strong className="text-emerald-300 block">3. Inheritance</strong>
                          <span>Code Reuse (is-a relation)</span>
                        </div>
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                          <strong className="text-rose-300 block">4. Polymorphism</strong>
                          <span>Overloading & Overriding</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BINARY SEARCH TREE */}
                  {selectedArticle.diagramType === 'tree' && (
                    <div className="space-y-4 text-center font-mono">
                      <div className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-sm shadow-md">
                        Root: 50
                      </div>
                      <div className="flex justify-center gap-24 text-slate-500 font-bold text-xs">
                        <span>↙ (keys &lt; 50)</span>
                        <span>(keys &gt; 50) ↘</span>
                      </div>
                      <div className="flex justify-center gap-16">
                        <div className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow">
                          Node: 30
                        </div>
                        <div className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow">
                          Node: 70
                        </div>
                      </div>
                      <div className="flex justify-center gap-6 pt-2">
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 text-[11px] border border-slate-700">20</div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 text-[11px] border border-slate-700">40</div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 text-[11px] border border-slate-700">60</div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 text-[11px] border border-slate-700">80</div>
                      </div>
                    </div>
                  )}

                  {/* SLIDING WINDOW */}
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
                      <p className="text-[11px] text-slate-400 font-sans">
                        Window Sum: (2 + 1 + 5) = <strong>8</strong> ➜ Next Step: Drop 2, Add 1 ➜ Sum: <strong>7</strong>
                      </p>
                    </div>
                  )}

                  {/* TRAPPING RAIN WATER */}
                  {selectedArticle.diagramType === 'trappingRainWater' && (
                    <div className="space-y-3 text-center w-full max-w-md font-mono text-xs">
                      <div className="text-amber-300 font-bold">Elevation Map: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]</div>
                      <div className="flex items-end justify-center gap-1 h-24 p-2 bg-slate-950 rounded-xl">
                        <div className="w-6 bg-slate-600 h-0" />
                        <div className="w-6 bg-slate-600 h-8 text-[9px]">1</div>
                        <div className="w-6 bg-blue-500 h-8 text-[9px] text-white">💧</div>
                        <div className="w-6 bg-slate-600 h-16 text-[9px]">2</div>
                        <div className="w-6 bg-blue-500 h-8 text-[9px] text-white">💧</div>
                        <div className="w-6 bg-blue-500 h-16 text-[9px] text-white">💧</div>
                        <div className="w-6 bg-slate-600 h-8 text-[9px]">1</div>
                        <div className="w-6 bg-slate-600 h-24 text-[9px] bg-amber-500">3</div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans">
                        Two pointers track leftMax & rightMax boundaries to trap total <strong>6 units of water</strong>.
                      </p>
                    </div>
                  )}

                  {/* DP KNAPSACK TABLE */}
                  {selectedArticle.diagramType === 'dpKnapsackTable' && (
                    <div className="space-y-3 text-center w-full max-w-md font-mono text-xs">
                      <div className="text-amber-300 font-bold">1D Array DP State (Capacity W = 5)</div>
                      <div className="grid grid-cols-6 gap-1 text-[11px]">
                        <div className="p-2 bg-slate-800 rounded border border-slate-700">W:0 (0)</div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-700">W:1 (3)</div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-700">W:2 (4)</div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-700">W:3 (7)</div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-700">W:4 (8)</div>
                        <div className="p-2 bg-emerald-600 text-white rounded font-bold">W:5 (10)</div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans">
                        Max Profit achieved at capacity 5 is <strong>₹10</strong> with O(W) memory.
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* ── 4. COMPLEXITY BENCHMARKS CARD ── */}
              {selectedArticle.complexity && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    ⚡ Theoretical Complexity & Performance Notes:
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

              {/* ── 5. MULTI-LANGUAGE CODE VIEWER (JAVA, C++, PYTHON, JS, HTML/CSS) ── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Multi-Language Code Implementation:
                    </span>
                  </div>

                  {/* Language Selector Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    {Object.keys(selectedArticle.codeSnippets).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveCodeTab(lang)}
                        className={`px-3 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                          activeCodeTab === lang || (Object.keys(selectedArticle.codeSnippets).length === 1)
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
                        {selectedArticle.codeSnippets[activeCodeTab] ? activeCodeTab : Object.keys(selectedArticle.codeSnippets)[0]} Solution
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(selectedArticle.codeSnippets[activeCodeTab] || Object.values(selectedArticle.codeSnippets)[0])}
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
                        <span>Run in Practice Hub</span>
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

              {/* ── 6. KEY TAKEAWAYS & CHEATSHEET ── */}
              {selectedArticle.keyTakeaways && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Takeaways & Interview Cheat Sheet:</span>
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

              {/* ── 7. OFFICIAL DOCUMENTATION & CITATIONS ── */}
              {selectedArticle.references && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                    🌐 Official Documentation & Learning Specifications:
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

            {/* ── 8. 1000 DSA CURATED QUESTION BANK DIRECTORY ── */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black font-quicksand text-slate-900 flex items-center gap-2">
                    <span>🧠 1000 DSA Curated Question Bank</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {filteredDsaBank.length} Active Problems
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Search and practice top product company interview questions with time & space complexity ratings.
                  </p>
                </div>

                <Link
                  to="/practice"
                  className="px-3.5 py-2 rounded-xl bg-[#1c1d21] text-amber-300 hover:bg-black text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Full 1000 DSA Compiler</span>
                </Link>
              </div>

              {/* Grid of DSA Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDsaBank.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {q.topic}
                      </span>
                      <span className={`text-[10px] font-black uppercase ${
                        q.difficulty === 'Easy' ? 'text-emerald-600' : q.difficulty === 'Medium' ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                      {q.id}. {q.title}
                    </h4>

                    <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                      <span>Time: <strong className="text-slate-800">{q.time}</strong></span>
                      <span>Space: <strong className="text-slate-800">{q.space}</strong></span>
                    </div>

                    {/* Company Tags */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {q.companies.map((c, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-white text-[9px] text-slate-600 border border-slate-200 font-sans">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}