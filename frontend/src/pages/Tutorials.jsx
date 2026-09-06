import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Search, Code2, Cpu, Database, Layers, Globe, 
  Terminal, Sparkles, Copy, Check, ExternalLink, Bookmark, 
  Share2, Clock, Award, ChevronRight, ChevronDown, ArrowRight, 
  Zap, CheckCircle2, FileCode, Box, Binary, Workflow, Layout, 
  Palette, FileText, HelpCircle, FolderTree, Filter, CheckCircle, 
  Tag, ShieldCheck, Server, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TOPIC-WISE TUTORIAL ARTICLES (JAVA, OOPS, COLLECTIONS, HTML, CSS, JS, REACT, PYTHON, DSA)
// ─────────────────────────────────────────────────────────────────────────────
const TUTORIAL_ARTICLES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ☕ JAVA CORE, JVM ARCHITECTURE & EXECUTION LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'java-jvm-architecture-memory',
    title: 'Java Architecture: JVM Internal Memory Model, ClassLoader & Bytecode Execution',
    category: 'Java Core & JVM',
    domain: 'java',
    difficulty: 'Intermediate / Advanced',
    readTime: '15 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Oracle', 'Google', 'Amazon', 'Microsoft', 'Goldman Sachs', 'AppleTree Infotech'],
    summary: 'Master how Java achieves Write Once, Run Anywhere (WORA). Understand the step-by-step lifecycle from .java source code compilation to .class bytecode execution inside the Java Virtual Machine (JVM), including ClassLoader subsystems, JVM Memory Areas (Heap, Stack, Metaspace, PC Register), JIT Compiler, and Garbage Collection (G1GC & ZGC).',
    diagramType: 'jvmArchitecture',
    complexity: {
      compilation: 'javac (Source Code .java -> Bytecode .class)',
      memoryAreas: 'Heap (Shared) • Metaspace/Method Area (Shared) • Stack (Per-thread) • PC Register • Native Stack',
      execution: 'Interpreter (Line-by-line) + JIT Compiler (HotSpot C1/C2 Native Compilation)',
      gcMechanisms: 'Generational GC: Young Gen (Eden, S0, S1) -> Old Gen (Tenured) -> Garbage Collection'
    },
    codeSnippets: {
      java: `// Demonstration of Java Memory Allocation: Stack vs Heap & Garbage Collection
package com.programmingwala.jvm;

public class JVMMemoryLifecycleDemo {
    // 1. METASPACE / METHOD AREA: Static variables & Class metadata stored here
    private static final String PLATFORM_NAME = "ProgrammingWala";
    private static int totalInstances = 0;

    // 2. HEAP MEMORY: Instance variables stored inside heap object allocation
    private int studentId;
    private String studentName;
    private int[] examScores;

    public JVMMemoryLifecycleDemo(int id, String name, int[] scores) {
        this.studentId = id;
        this.studentName = name; // String literal pooled or Heap object
        this.examScores = scores;
        totalInstances++;
    }

    // 3. STACK FRAME: Each method invocation creates its own Stack Frame
    public double calculateAverageScore() {
        // Local variables (primitive & references) live in the Thread's Call Stack
        double sum = 0.0; // Local primitive: stored directly on stack frame
        for (int score : this.examScores) {
            sum += score;
        }
        return sum / this.examScores.length; // Pops off stack upon method return
    }

    public static void main(String[] args) {
        // Local reference 'student1' lives on Stack; points to Student object on Heap
        int[] sampleScores = {95, 98, 92, 100};
        JVMMemoryLifecycleDemo student1 = new JVMMemoryLifecycleDemo(101, "Aarav Sharma", sampleScores);

        double avg = student1.calculateAverageScore();
        System.out.println("🎓 Student: " + student1.studentName + " | Avg: " + avg);
        System.out.println("📦 Total Active JVM Heap Objects: " + totalInstances);

        // Making object eligible for Garbage Collection (GC)
        student1 = null; // Unreachable object in Young Generation Eden space
        System.gc();     // Hint to JVM Garbage Collector to reclaim heap memory
    }
}`,
      cpp: `// Equivalent Memory Comparison in C++ (Manual Stack vs Heap Management)
#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Student {
public:
    int id;
    string name;
    vector<int> scores;

    Student(int i, string n, vector<int> s) : id(i), name(n), scores(s) {}
    
    double getAverage() {
        double sum = 0;
        for (int s : scores) sum += s;
        return sum / scores.size();
    }
};

int main() {
    // Stack allocation (Automatic deallocation when out of scope)
    Student s1(101, "Aarav Sharma", {95, 98, 92, 100});
    cout << "Average: " << s1.getAverage() << endl;

    // Heap allocation (Requires manual 'delete' to prevent memory leak)
    Student* s2 = new Student(102, "Rohan Verma", {88, 90, 85});
    delete s2; // Freeing heap memory manually
    return 0;
}`,
      python: `# Python Memory Management: Reference Counting & Cyclic GC
import sys

class Student:
    def __init__(self, student_id: int, name: str, scores: list):
        self.student_id = student_id
        self.name = name
        self.scores = scores

    def get_average(self) -> float:
        return sum(self.scores) / len(self.scores)

student = Student(101, "Aarav Sharma", [95, 98, 92, 100])
print(f"Ref Count: {sys.getrefcount(student) - 1}")
print(f"Average: {student.get_average()}")`
    },
    keyTakeaways: [
      'Bytecode (.class) is platform-independent intermediate machine code executed by the platform-specific JVM.',
      'Stack memory is fast, thread-safe, and automatically popped when functions return; Heap memory is shared across threads and managed by Garbage Collection.',
      'JIT (Just-In-Time) compiler compiles frequently executed hot bytecode into native machine instructions to achieve C++ level runtime speed.'
    ],
    references: [
      { name: 'Oracle Java SE 21 Specification - JVM Architecture', url: 'https://docs.oracle.com/javase/specs/jvms/se21/html/' },
      { name: 'Baeldung - Guide to Java Memory Management', url: 'https://www.baeldung.com/java-memory-management-interview-questions' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧩 JAVA OOPS DEEP DIVE: 4 PILLARS & SOLID DESIGN PRINCIPLES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'java-oops-four-pillars-solid',
    title: 'Java Object-Oriented Programming (OOPs): The 4 Pillars, Polymorphism & SOLID Principles',
    category: 'Java OOPs & SOLID',
    domain: 'java',
    difficulty: 'Intermediate',
    readTime: '18 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Google', 'Amazon', 'Oracle', 'Microsoft', 'Adobe', 'AppleTree Infotech'],
    summary: 'Comprehensive mastery of Object-Oriented Programming in Java. Learn Encapsulation (data hiding, access modifiers), Inheritance (single, multilevel, hierarchical, super keyword), Polymorphism (compile-time overloading vs runtime dynamic method dispatch overriding), Abstraction (abstract classes vs interfaces, default methods), and the 5 SOLID engineering design principles.',
    diagramType: 'oopsPillarsSolid',
    complexity: {
      pillars: '1. Encapsulation • 2. Abstraction • 3. Inheritance • 4. Polymorphism',
      binding: 'Static Binding (Overloading, private/final/static methods) vs Dynamic Binding (Overriding via Virtual Table)',
      solid: 'S: Single Responsibility | O: Open-Closed | L: Liskov Substitution | I: Interface Segregation | D: Dependency Inversion',
      interfaceEvolution: 'Java 8 default/static methods • Java 9 private interface methods'
    },
    codeSnippets: {
      java: `// ============================================================================
// COMPREHENSIVE JAVA OOPS: 4 PILLARS + SOLID ARCHITECTURE
// ============================================================================
package com.programmingwala.oops;

import java.util.UUID;

// 1. ABSTRACTION & INTERFACE SEGREGATION PRINCIPLE (ISP)
interface PaymentProcessor {
    boolean processPayment(double amount);
}

interface Refundable {
    boolean processRefund(String transactionId, double amount);
}

// 2. ENCAPSULATION: Base Abstract Class protecting internal state
abstract class Account {
    // Private attributes: Data hiding
    private final String accountId;
    private String holderName;
    private double balance;

    public Account(String holderName, double initialBalance) {
        this.accountId = UUID.randomUUID().toString();
        this.holderName = holderName;
        this.balance = Math.max(0.0, initialBalance);
    }

    // Public Getters & Setters with validation
    public String getAccountId() { return accountId; }
    public String getHolderName() { return holderName; }
    public double getBalance() { return balance; }

    protected void setBalance(double balance) {
        this.balance = balance;
    }

    // Abstract method: Enforces abstraction & polymorphic behavior
    public abstract String getAccountRole();

    public void deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
            System.out.println("💰 Deposited ₹" + amount + " | New Balance: ₹" + this.balance);
        }
    }
}

// 3. INHERITANCE: StudentAccount inherits fields & methods from Account
class StudentAccount extends Account {
    private String enrolledCourse;
    private double feeDue;

    public StudentAccount(String name, double balance, String course, double feeDue) {
        super(name, balance); // Invokes superclass constructor
        this.enrolledCourse = course;
        this.feeDue = feeDue;
    }

    // 4. POLYMORPHISM: Dynamic Runtime Method Overriding
    @Override
    public String getAccountRole() {
        return "Student Account: Enrolled in " + this.enrolledCourse + " [Fee Due: ₹" + this.feeDue + "]";
    }

    // Overloaded Method (Compile-time Polymorphism)
    public void payFee(double amount) {
        this.payFee(amount, "Razorpay UPI");
    }

    public void payFee(double amount, String paymentMode) {
        this.feeDue = Math.max(0, this.feeDue - amount);
        System.out.println("✅ Paid ₹" + amount + " via " + paymentMode + ". Remaining Fee Due: ₹" + this.feeDue);
    }
}

// 5. DEPENDENCY INVERSION PRINCIPLE (DIP): High-level module depends on abstraction
class AdmissionFeeService {
    private final PaymentProcessor paymentProcessor; // Loosely coupled interface

    public AdmissionFeeService(PaymentProcessor processor) {
        this.paymentProcessor = processor;
    }

    public boolean enrollStudent(StudentAccount student, double feeAmount) {
        System.out.println("🔄 Processing enrollment for: " + student.getHolderName());
        boolean success = this.paymentProcessor.processPayment(feeAmount);
        if (success) {
            student.payFee(feeAmount, "Online Gateway");
            System.out.println("🎉 Enrollment Verified: " + student.getAccountRole());
        }
        return success;
    }
}

// Open-Closed Principle (OCP): New gateway added without modifying AdmissionFeeService
class RazorpayProcessor implements PaymentProcessor, Refundable {
    @Override
    public boolean processPayment(double amount) {
        System.out.println("⚡ Razorpay Webhook: Verified ₹" + amount + " 256-bit Encrypted Transaction.");
        return true;
    }

    @Override
    public boolean processRefund(String txnId, double amount) {
        System.out.println("🔄 Razorpay Refund of ₹" + amount + " issued for Txn: " + txnId);
        return true;
    }
}

public class OOPsMasteryDemo {
    public static void main(String[] args) {
        PaymentProcessor gateway = new RazorpayProcessor();
        AdmissionFeeService admissionService = new AdmissionFeeService(gateway);

        // Polymorphic reference: Account ref pointing to StudentAccount instance
        StudentAccount student = new StudentAccount("Priya Sharma", 5000.0, "Java Full Stack & AWS", 15000.0);
        
        admissionService.enrollStudent(student, 5000.0);
    }
}`,
      cpp: `// C++ Object-Oriented Hierarchy & Virtual Functions
#include <iostream>
#include <string>
#include <memory>
using namespace std;

class Account {
private:
    string accountId;
    string holderName;
protected:
    double balance;
public:
    Account(string name, double bal) : holderName(name), balance(bal) {}
    virtual ~Account() {} // Virtual destructor for safe polymorphic deletion
    
    virtual string getRole() const = 0; // Pure virtual function (Abstract)
    
    void deposit(double amt) {
        balance += amt;
        cout << "Deposited: " << amt << " | Balance: " << balance << endl;
    }
};

class StudentAccount : public Account {
private:
    string course;
public:
    StudentAccount(string name, double bal, string c) : Account(name, bal), course(c) {}
    
    string getRole() const override {
        return "Student Account enrolled in " + course;
    }
};`,
      python: `# Python OOP Implementation: Abstract Base Classes & Polymorphism
from abc import ABC, abstractmethod

class Account(ABC):
    def __init__(self, holder_name: str, balance: float):
        self._holder_name = holder_name  # Protected attribute
        self.__balance = max(0.0, balance) # Private attribute (Name mangling)

    @property
    def balance(self) -> float:
        return self.__balance

    @abstractmethod
    def get_role(self) -> str:
        pass

class StudentAccount(Account):
    def __init__(self, holder_name: str, balance: float, course: str):
        super().__init__(holder_name, balance)
        self.course = course

    def get_role(self) -> str:
        return f"Student: {self._holder_name} in {self.course}"`
    },
    keyTakeaways: [
      'Encapsulation bundles data with methods and restricts direct field access using private modifiers and validated getters/setters.',
      'Polymorphism is powered by Java Dynamic Method Dispatch (vtable lookup at runtime) allowing a superclass reference to invoke overridden subclass logic.',
      'SOLID principles guarantee code is decoupled, unit-testable, and extensible without breaking existing production contracts.'
    ],
    references: [
      { name: 'Oracle Java Documentation - Object-Oriented Programming', url: 'https://docs.oracle.com/javase/tutorial/java/concepts/' },
      { name: 'Refactoring.Guru - Design Patterns & SOLID Principles', url: 'https://refactoring.guru/design-patterns' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 📚 JAVA COLLECTION FRAMEWORK: HIERARCHY, MAPS, SETS & LISTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'java-collections-framework-deep-dive',
    title: 'Java Collection Framework: List, Set, Map, Queue & Internal HashMap Architecture',
    category: 'Java Collections Framework',
    domain: 'java',
    difficulty: 'Advanced',
    readTime: '22 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Google', 'Amazon', 'Microsoft', 'Uber', 'Morgan Stanley', 'AppleTree Infotech'],
    summary: 'Exhaustive architectural breakdown of the Java Collection Framework. Master the Collection interface hierarchy, List implementations (ArrayList vs LinkedList vs CopyOnWriteArrayList), Set implementations (HashSet vs LinkedHashSet vs TreeSet), Queue & Deque (PriorityQueue, ArrayDeque), and Map architecture (HashMap internal bucket indexing, collision resolution with Singly Linked List and Red-Black Trees at threshold 8, ConcurrentHashMap bucket stripping, and TreeMap).',
    diagramType: 'javaCollectionsHierarchy',
    complexity: {
      arrayList: 'O(1) random get(i) • O(1) amortized add • O(N) insert/delete (array shift)',
      linkedList: 'O(1) insert/delete at head/tail • O(N) positional search • Doubly-linked node overhead',
      hashMap: 'O(1) average get/put • O(log N) worst-case bucket collision (Treeify threshold >= 8) • Initial capacity 16, load factor 0.75',
      treeSetTreeMap: 'O(log N) search/insert/delete • Self-balancing Red-Black Tree maintaining natural/Comparator sorted order',
      concurrentHashMap: 'Thread-safe lock-free reads • Synchronized bucket-head locking on writes (CAS operations)'
    },
    codeSnippets: {
      java: `// ============================================================================
// JAVA COLLECTION FRAMEWORK: COMPLETE ARCHITECTURAL DEMO
// ============================================================================
package com.programmingwala.collections;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

// Custom Key class demonstrating the hashCode() and equals() Contract
class StudentKey implements Comparable<StudentKey> {
    private final int rollNumber;
    private final String branch;

    public StudentKey(int rollNumber, String branch) {
        this.rollNumber = rollNumber;
        this.branch = branch;
    }

    public int getRollNumber() { return rollNumber; }

    // CRITICAL FOR HASHMAP / HASHSET: Consistent Hash Generation
    @Override
    public int hashCode() {
        return Objects.hash(rollNumber, branch);
    }

    // CRITICAL FOR HASHMAP / HASHSET: Collision Resolution Check
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        StudentKey other = (StudentKey) obj;
        return this.rollNumber == other.rollNumber && Objects.equals(this.branch, other.branch);
    }

    // For TreeMap / TreeSet sorted order
    @Override
    public int compareTo(StudentKey other) {
        return Integer.compare(this.rollNumber, other.rollNumber);
    }

    @Override
    public String toString() {
        return "[" + branch + "-#" + rollNumber + "]";
    }
}

public class CollectionsMasteryDemo {
    public static void main(String[] args) {
        System.out.println("══════════════════════════════════════════════════");
        System.out.println("1. LIST INTERFACE: ArrayList vs LinkedList");
        System.out.println("══════════════════════════════════════════════════");
        // ArrayList: Dynamic contiguous array, fast indexing O(1)
        List<String> arrayList = new ArrayList<>(10);
        arrayList.add("Java 21 LTS");
        arrayList.add("Spring Boot 3");
        arrayList.add("AWS DevOps");
        System.out.println("ArrayList (Indexed O(1)): " + arrayList.get(0));

        // LinkedList: Doubly-linked nodes, fast insertion/deletion at endpoints O(1)
        LinkedList<String> dequeList = new LinkedList<>();
        dequeList.addFirst("Header Task");
        dequeList.addLast("Tail Task");
        System.out.println("LinkedList Endpoints: First=" + dequeList.getFirst() + " | Last=" + dequeList.getLast());

        System.out.println("\n══════════════════════════════════════════════════");
        System.out.println("2. SET INTERFACE: HashSet vs LinkedHashSet vs TreeSet");
        System.out.println("══════════════════════════════════════════════════");
        // HashSet: Unordered, backed by HashMap<E, PRESENT>
        Set<String> hashSet = new HashSet<>(Arrays.asList("React", "Java", "Docker", "Java"));
        System.out.println("HashSet (Unique, Unordered): " + hashSet);

        // TreeSet: Sorted naturally via Red-Black Tree O(log N)
        Set<Integer> treeSet = new TreeSet<>(Arrays.asList(95, 45, 80, 20, 100));
        System.out.println("TreeSet (Sorted Order): " + treeSet);

        System.out.println("\n══════════════════════════════════════════════════");
        System.out.println("3. MAP INTERFACE: HashMap & Internal Hash Bucketing");
        System.out.println("══════════════════════════════════════════════════");
        Map<StudentKey, String> studentMap = new HashMap<>(16, 0.75f);
        
        StudentKey k1 = new StudentKey(101, "CS");
        StudentKey k2 = new StudentKey(102, "IT");
        StudentKey k3 = new StudentKey(101, "CS"); // Duplicate logical key

        studentMap.put(k1, "Manish Kumar (Full Stack Lead)");
        studentMap.put(k2, "Ishika Rani (React Specialist)");
        studentMap.put(k3, "Manish Kumar (Updated Record)"); // Overwrites k1 because equals() & hashCode() match!

        System.out.println("HashMap size (Handles duplicates correctly): " + studentMap.size());
        System.out.println("Fetched Key k3: " + studentMap.get(k3));

        System.out.println("\n══════════════════════════════════════════════════");
        System.out.println("4. CONCURRENTHASHMAP: High-Throughput Thread Safety");
        System.out.println("══════════════════════════════════════════════════");
        ConcurrentHashMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
        concurrentMap.put("ActiveConnections", 450);
        concurrentMap.computeIfPresent("ActiveConnections", (k, v) -> v + 1);
        System.out.println("ConcurrentHashMap (Lock-free reads + CAS writes): " + concurrentMap);
    }
}`,
      cpp: `// C++ STL Equivalents: vector, list, unordered_map, map
#include <iostream>
#include <vector>
#include <unordered_map>
#include <map>
#include <set>
using namespace std;

int main() {
    // std::vector = Java ArrayList
    vector<string> vec = {"Java", "Spring Boot", "AWS"};
    
    // std::unordered_map = Java HashMap (Hash table O(1))
    unordered_map<int, string> hashMap;
    hashMap[101] = "Manish Kumar";
    
    // std::map = Java TreeMap (Red-Black Tree O(log N))
    map<int, string> treeMap;
    treeMap[105] = "Z";
    treeMap[101] = "A";
    
    // std::set = Java TreeSet
    set<int> sortedSet = {50, 10, 30};
    for (int n : sortedSet) cout << n << " ";
    return 0;
}`,
      python: `# Python Equivalents: list, set, dict (HashMap), PriorityQueue (heapq)
import heapq

# List (ArrayList)
tech_list = ["Java 21", "Spring Boot", "AWS DevOps"]

# Set (HashSet)
unique_skills = set(["React", "Java", "Docker", "Java"])

# Dict (HashMap with O(1) hash table lookup)
student_map = {101: "Manish Kumar", 102: "Ishika Rani"}

# Priority Queue (Min-Heap)
min_heap = []
heapq.heappush(min_heap, (95, "Student A"))
heapq.heappush(min_heap, (70, "Student B"))
print(f"Top Priority: {heapq.heappop(min_heap)}")`
    },
    keyTakeaways: [
      'If you override equals(), you MUST override hashCode() so two logically equal objects produce the identical hash bucket index.',
      'Java 8 HashMap replaces bucket linked lists with self-balancing Red-Black Trees (TreeNodes) once a bucket has >= 8 elements and capacity >= 64, cutting worst-case lookup from O(N) to O(log N).',
      'ArrayList increases capacity by 50% (oldCapacity + (oldCapacity >> 1)) when full; LinkedList uses more memory per element due to node pointers.'
    ],
    references: [
      { name: 'Oracle Java SE Documentation - Collection Framework', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/doc-files/coll-index.html' },
      { name: 'Baeldung - Internal Working of HashMap in Java', url: 'https://www.baeldung.com/java-hashmap-advanced' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ⚡ JAVA MULTITHREADING, CONCURRENCY & STREAMS API
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'java-multithreading-streams-api',
    title: 'Java Concurrency & Streams API: Thread Lifecycle, Synchronization & Functional Streams',
    category: 'Java Concurrency & Streams',
    domain: 'java',
    difficulty: 'Advanced',
    readTime: '20 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Google', 'Netflix', 'Amazon', 'Meta', 'Uber', 'AppleTree Infotech'],
    summary: 'Master multi-threaded concurrent programming and functional data processing in Java. Understand Thread states (NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED), race conditions, synchronized blocks, ReentrantLock, volatile variables, ExecutorService thread pools, and Java 8+ Streams API (filter, map, flatMap, reduce, parallelStreams).',
    diagramType: 'threadLifecycle',
    complexity: {
      threadStates: 'NEW -> RUNNABLE -> BLOCKED / WAITING / TIMED_WAITING -> TERMINATED',
      synchronization: 'Intrinsic Lock (synchronized) vs Explicit Lock (ReentrantLock with tryLock & fair policy)',
      memoryVisibility: 'volatile keyword guarantees cache coherence (flushes L1/L2 cache to main RAM) without atomic locks',
      streamsPipeline: 'Source -> Intermediate Operations (Lazy: filter, map, sorted) -> Terminal Operation (Eager: collect, reduce, forEach)'
    },
    codeSnippets: {
      java: `// ============================================================================
// JAVA CONCURRENCY, THREAD POOLS & STREAMS API PIPELINE
// ============================================================================
package com.programmingwala.concurrency;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

class CourseEnrollmentTask implements Runnable {
    private final String studentName;
    private final AtomicInteger activeEnrollments; // Thread-safe atomic counter

    public CourseEnrollmentTask(String name, AtomicInteger counter) {
        this.studentName = name;
        this.activeEnrollments = counter;
    }

    @Override
    public void run() {
        try {
            System.out.println("⏳ [" + Thread.currentThread().getName() + "] Enrolling " + studentName);
            Thread.sleep(100); // Simulates network I/O or DB query
            int count = activeEnrollments.incrementAndGet();
            System.out.println("✅ [" + Thread.currentThread().getName() + "] Enrolled " + studentName + " | Total Active: " + count);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}

public class ConcurrencyAndStreamsDemo {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        System.out.println("── 1. EXECUTOR SERVICE & THREAD POOL ──");
        ExecutorService threadPool = Executors.newFixedThreadPool(3);
        AtomicInteger enrollmentCount = new AtomicInteger(0);

        List<String> students = Arrays.asList("Aarav", "Priya", "Manish", "Ishika", "Rohan", "Neha");
        for (String s : students) {
            threadPool.submit(new CourseEnrollmentTask(s, enrollmentCount));
        }

        threadPool.shutdown();
        threadPool.awaitTermination(5, TimeUnit.SECONDS);

        System.out.println("\n── 2. JAVA 8+ STREAMS API PIPELINES ──");
        List<Double> coursePrices = Arrays.asList(3500.0, 4500.0, 2000.0, 6000.0, 1500.0, 5000.0);

        // Filter premium courses >= 3500, apply 10% student scholarship, sort descending
        List<Double> discountedPrices = coursePrices.stream()
            .filter(price -> price >= 3500.0)           // Intermediate lazy op
            .map(price -> price * 0.90)                 // 10% discount
            .sorted(Comparator.reverseOrder())          // Sorted descending
            .collect(Collectors.toList());              // Terminal eager op

        System.out.println("Premium Discounted Fees: " + discountedPrices);

        // Reduce operation: Total revenue calculation
        double totalRevenue = coursePrices.stream()
            .reduce(0.0, Double::sum);
        System.out.println("Total Pipeline Revenue: ₹" + totalRevenue);
    }
}`,
      cpp: `// C++ std::thread, std::mutex, and std::async
#include <iostream>
#include <vector>
#include <thread>
#include <mutex>
#include <future>
using namespace std;

mutex mtx;
int counter = 0;

void enrollStudent(string name) {
    lock_guard<mutex> lock(mtx); // RAII Mutex Lock
    counter++;
    cout << "Enrolled " << name << " | Counter: " << counter << endl;
}

int main() {
    thread t1(enrollStudent, "Aarav");
    thread t2(enrollStudent, "Priya");
    t1.join();
    t2.join();
    return 0;
}`,
      python: `# Python Asyncio & Concurrent Futures
import asyncio

async def enroll_student(name: str):
    print(f"Enrolling {name}...")
    await asyncio.sleep(0.1)
    print(f"Verified {name}!")

async def main():
    students = ["Aarav", "Priya", "Manish", "Ishika"]
    await asyncio.gather(*(enroll_student(s) for s in students))

asyncio.run(main())`
    },
    keyTakeaways: [
      'Never start raw threads manually in enterprise production; use ExecutorService thread pools to reuse worker threads and avoid OS context-switching overhead.',
      'Streams API intermediate operations are lazy and do not execute until a terminal operation (like collect, count, reduce) is invoked.',
      'Atomic variables (AtomicInteger, AtomicLong) leverage hardware CPU compare-and-swap (CAS) instructions to achieve thread safety without expensive lock contention.'
    ],
    references: [
      { name: 'Java Concurrency in Practice by Brian Goetz', url: 'https://jcip.net/' },
      { name: 'Oracle Java 21 Streams API Guide', url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🌐 HTML & HTML5 SEMANTIC ELEMENTS, DOM TREE & ACCESSIBILITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'html5-semantic-dom-accessibility',
    title: 'HTML5 Semantic Architecture: Document Object Model (DOM), Forms & Accessibility (a11y)',
    category: 'HTML & HTML5',
    domain: 'html',
    difficulty: 'Beginner / Intermediate',
    readTime: '14 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix', 'AppleTree Infotech'],
    summary: 'Master modern semantic HTML5 architecture. Understand the hierarchical Document Object Model (DOM) Tree lifecycle, semantic landmark tags (<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>, <figure>, <mark>, <time>), accessible form validation attributes, ARIA roles, and browser rendering engine pipeline.',
    diagramType: 'htmlDomTree',
    complexity: {
      domParsing: 'O(N) Linear Tokenization & DOM Node Tree Construction',
      rendering: 'HTML Parser -> DOM Tree + CSSOM -> Render Tree -> Layout (Reflow) -> Paint -> Composite',
      accessibility: 'ARIA Landmarks (role="banner", "main", "navigation") & Screen Reader Semantics',
      storageAPIs: 'localStorage (5MB), sessionStorage (Tab lifetime), IndexedDB (Transactional NoSQL)'
    },
    codeSnippets: {
      html: `<!-- Modern Accessible HTML5 Semantic Layout Template -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ProgrammingWala Interactive Learning Hub in RDC Ghaziabad">
  <title>Accessible Semantic HTML5 Layout</title>
</head>
<body>
  <!-- Header Landmark with Semantic Navigation -->
  <header role="banner" class="site-header">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <nav role="navigation" aria-label="Main Navigation">
      <ul class="nav-list">
        <li><a href="/courses">Courses</a></li>
        <li><a href="/tutorials">Tutorials Hub</a></li>
        <li><a href="/practice">1000 DSA Practice</a></li>
      </ul>
    </nav>
  </header>

  <!-- Main Landmark: Primary Page Content -->
  <main id="main-content" role="main">
    <article class="tutorial-card">
      <header>
        <h1>Mastering HTML5 DOM Architecture</h1>
        <p>Published: <time datetime="2026-09-01">September 1, 2026</time></p>
      </header>
      
      <section aria-labelledby="form-heading">
        <h2 id="form-heading">Student Admissions Enrollment Form</h2>
        <form action="/api/enroll" method="POST" novalidate>
          <div class="form-group">
            <label for="student-name">Full Name <span aria-hidden="true">*</span>:</label>
            <input type="text" id="student-name" name="name" required minlength="3" placeholder="e.g. Ishika Rani" autocomplete="name">
          </div>

          <div class="form-group">
            <label for="student-email">Email Address <span aria-hidden="true">*</span>:</label>
            <input type="email" id="student-email" name="email" required placeholder="name@example.com" autocomplete="email">
          </div>

          <div class="form-group">
            <label for="course-select">Select Specialization:</label>
            <select id="course-select" name="course" required>
              <option value="">-- Choose Career Track --</option>
              <option value="java-fullstack">Java Full Stack & AWS DevOps</option>
              <option value="python-ai">Python AI & Machine Learning</option>
              <option value="mern-stack">MERN Full Stack Web Development</option>
            </select>
          </div>

          <button type="submit" class="submit-btn">Enroll with 100% Placement Support</button>
        </form>
      </section>

      <aside aria-label="Campus Information" class="sidebar-note">
        <h3>📍 RDC Ghaziabad Campus</h3>
        <p>Classes held at C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad.</p>
      </aside>
    </article>
  </main>

  <!-- Footer Landmark -->
  <footer role="contentinfo" class="site-footer">
    <p>&copy; 2026 ProgrammingWala &amp; AppleTree Infotech. All rights reserved.</p>
  </footer>
</body>
</html>`,
      javascript: `// JavaScript DOM Manipulation & Form Validation
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const nameInput = document.getElementById('student-name');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!nameInput.value || nameInput.value.length < 3) {
      alert('⚠️ Please enter a valid name with at least 3 characters.');
      nameInput.focus();
      return;
    }
    console.log('✅ Form Submitted via FormData API:', new FormData(form));
  });
})`
    },
    keyTakeaways: [
      'Semantic tags (<header>, <main>, <nav>, <article>, <section>, <footer>) improve SEO ranking and enable assistive technologies (screen readers) to parse page landmarks.',
      'The browser engine parses HTML into a DOM Tree and CSS into a CSSOM Tree, combining both into a Render Tree before calculating geometry (Layout/Reflow) and rasterizing pixels (Paint).',
      'Always supply accessible alt attributes on <img> tags and explicit <label for="id"> associations on all interactive form inputs.'
    ],
    references: [
      { name: 'MDN Web Docs - HTML: HyperText Markup Language', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
      { name: 'W3C Web Accessibility Initiative (WAI-ARIA)', url: 'https://www.w3.org/WAI/standards-guidelines/aria/' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🎨 CSS & CSS3: BOX MODEL, FLEXBOX, GRID & SPECIFICITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'css3-box-model-flexbox-grid',
    title: 'CSS3 Layout Architecture: Box Model, Flexbox Axes, CSS Grid & Specificity Hierarchy',
    category: 'CSS & Modern CSS3',
    domain: 'css',
    difficulty: 'Beginner / Intermediate',
    readTime: '16 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Meta', 'Apple', 'Google', 'Airbnb', 'Stripe', 'AppleTree Infotech'],
    summary: 'Master modern CSS layout engineering. Understand the CSS Box Model (Content, Padding, Border, Margin, box-sizing: border-box), Flexbox Axis Alignment (main-axis vs cross-axis, justify-content, align-items, flex-wrap), 2D CSS Grid systems (grid-template-columns, minmax, auto-fit), CSS Specificity Calculations, Custom Variables (var(--theme)), Glassmorphism, and responsive design.',
    diagramType: 'cssBoxModel',
    complexity: {
      boxModel: 'Content -> Padding -> Border -> Margin (box-sizing: border-box incorporates padding & border inside total width)',
      flexbox: '1D Axis: Main Axis (flex-direction: row/column) • Cross Axis (align-items, align-content)',
      cssGrid: '2D Layout: Columns + Rows (repeat(auto-fit, minmax(280px, 1fr)) for fluid responsive layouts)',
      specificity: '!important (10,000) -> Inline (1,000) -> ID #id (100) -> Class .class/[attr]/:pseudo (10) -> Element tag (1)'
    },
    codeSnippets: {
      css: `/* ============================================================================
   MODERN RESPONSIVE CSS3 STYLESHEET WITH VARIABLES, FLEXBOX & GRID
   ============================================================================ */

/* 1. CSS Custom Properties (Theme Variables) */
:root {
  --primary-brand: #ec4899;
  --secondary-brand: #8b5cf6;
  --bg-canvas: #f8fafc;
  --surface-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-subtle: #e2e8f0;
  --shadow-elevated: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

/* 2. Global Universal Box Model Reset */
*, *::before, *::after {
  box-sizing: border-box; /* Crucial: Prevents padding from breaking layout width */
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-canvas);
  color: var(--text-main);
  line-height: 1.6;
}

/* 3. 2D Responsive CSS Grid Layout */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 4. Glassmorphism Card with Flexbox Layout */
.course-card {
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-elevated);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(236, 72, 153, 0.15);
}

/* 5. Flexbox Header Navigation Bar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px); /* Glass effect */
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
}

/* 6. Responsive Media Query */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
  .course-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}`
    },
    keyTakeaways: [
      'Always set box-sizing: border-box globally so that padding and border widths do not expand element dimensions beyond declared width/height.',
      'Use Flexbox for 1-dimensional layouts (rows or columns) and CSS Grid for 2-dimensional layouts (simultaneous rows & columns).',
      'CSS Specificity score determines which rule wins when multiple selectors target the same element (Inline 1000 > ID 100 > Class 10 > Tag 1).'
    ],
    references: [
      { name: 'CSS-Tricks - A Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
      { name: 'CSS-Tricks - A Complete Guide to Grid', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ⚡ JAVASCRIPT EVENT LOOP & ASYNCHRONOUS ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'js-event-loop-async',
    title: 'JavaScript Concurrency: V8 Event Loop, Call Stack, Microtasks & Web APIs',
    category: 'JavaScript & ES6+',
    domain: 'javascript',
    difficulty: 'Intermediate',
    readTime: '15 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Google', 'Meta', 'Netflix', 'Uber', 'Amazon'],
    summary: 'Master how JavaScript executes asynchronous non-blocking code on a single thread. Understand V8 Call Stack, Web APIs, Microtask Queue (Promises, queueMicrotask), Macrotask Queue (setTimeout, setInterval), and the Event Loop tick evaluation order.',
    diagramType: 'jsEventLoop',
    complexity: {
      callStack: 'LIFO Execution of synchronous frame contexts',
      microtasks: 'Highest priority queue drained completely before next render cycle',
      macrotasks: 'One task processed per event loop tick after microtasks finish'
    },
    codeSnippets: {
      javascript: `// Visualizing JavaScript Event Loop Execution Order
console.log('1. Synchronous Code Start');

setTimeout(() => {
  console.log('4. Macrotask: setTimeout 0ms');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask: Promise Resolution (Highest Priority)');
});

console.log('2. Synchronous Code End');

// Expected Output:
// 1. Synchronous Code Start
// 2. Synchronous Code End
// 3. Microtask: Promise Resolution (Highest Priority)
// 4. Macrotask: setTimeout 0ms`
    },
    keyTakeaways: [
      'Microtasks (Promises) always preempt and drain completely before the Event Loop picks up the next Macrotask (setTimeout).',
      'Long-running synchronous loops freeze the Call Stack, blocking UI renders and user input events.'
    ],
    references: [
      { name: 'Jake Archibald - In The Loop (JSConf)', url: 'https://jakearchibald.com/' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ⚛️ REACT.JS VIRTUAL DOM & FIBER ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'react-fiber-virtual-dom',
    title: 'React.js Architecture: Virtual DOM, Fiber Reconciliation & Custom Hooks',
    category: 'React.js & Frontend',
    domain: 'react',
    difficulty: 'Intermediate / Advanced',
    readTime: '16 min read',
    updated: 'Updated 2026 Edition',
    companies: ['Meta', 'Airbnb', 'Microsoft', 'Netflix', 'Uber'],
    summary: 'Master how React 18 efficiently renders UI components using Virtual DOM diffing, Fiber linked-list node reconciliation, concurrent scheduling, and state management custom hooks.',
    diagramType: 'reactFiberVirtualDom',
    complexity: {
      renderPhase: 'Asynchronous VDOM tree calculation & diffing (can be paused)',
      commitPhase: 'Synchronous minimal mutation to real browser DOM'
    },
    codeSnippets: {
      javascript: `import React, { useState, useMemo, useEffect } from 'react';

// Custom Hook for Debouncing API Search Queries
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup on unmount/re-render
  }, [value, delay]);

  return debouncedValue;
}`
    },
    keyTakeaways: [
      'Fiber allows React to break rendering work into incremental units, yielding to high-priority user input.',
      'Always memoize expensive computed values with useMemo and function references with useCallback.'
    ],
    references: [
      { name: 'React Official Documentation', url: 'https://react.dev' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 🧠 1000 DSA PROBLEM SPOTLIGHTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'dsa-binary-search-tree',
    title: 'DSA Spotlight: Binary Search Tree (BST) Insertion, Deletion & LCA Search',
    category: '1000 DSA Curated Problems',
    domain: 'dsa',
    difficulty: 'Medium',
    readTime: '12 min read',
    updated: 'Curated Interview Pattern',
    companies: ['Google', 'Amazon', 'Microsoft', 'Adobe'],
    summary: 'A Binary Search Tree is a node-based binary tree data structure where each node has at most two children. The left subtree contains keys < root, and the right subtree contains keys > root. Inorder traversal yields elements in sorted ascending order.',
    diagramType: 'tree',
    complexity: {
      search: 'O(log N) average / O(N) worst-case (skewed tree)',
      insert: 'O(log N) average / O(N) worst-case',
      delete: 'O(log N) average / O(N) worst-case',
      space: 'O(N) memory storage'
    },
    codeSnippets: {
      java: `class Node {
    int key;
    Node left, right;
    public Node(int item) { key = item; }
}

class BinarySearchTree {
    Node root;

    Node insertRec(Node root, int key) {
        if (root == null) return new Node(key);
        if (key < root.key) root.left = insertRec(root.left, key);
        else if (key > root.key) root.right = insertRec(root.right, key);
        return root;
    }
}`
    },
    keyTakeaways: [
      'Inorder traversal of a BST always yields sorted ascending numbers.',
      'Self-balancing BSTs (AVL, Red-Black Trees) guarantee O(log N) time for search, insert, and delete.'
    ],
    references: [
      { name: 'LeetCode Problem #98: Validate Binary Search Tree', url: 'https://leetcode.com/problems/validate-binary-search-tree/' }
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ProgrammingWala Engineering Encyclopedia</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-quicksand text-white tracking-tight leading-tight">
                Java Core, OOPs, Collections, HTML5, CSS3 &amp; 1000 DSA Hub
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 font-medium">
                Comprehensive step-by-step conceptual guides, interactive architectural flowcharts, multi-language code implementations (Java, C++, Python, JavaScript), and enterprise interview preparation.
              </p>
            </div>

            {/* Platform Stats Badge */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md text-xs space-y-1.5 max-w-xs">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                🚀 Complete Developer Curriculum
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                Covering <strong>JVM Memory &amp; Bytecode</strong>, <strong>Java OOPs Pillars</strong>, <strong>Collection Framework</strong>, <strong>HTML5 DOM Tree</strong>, and <strong>CSS3 Grid/Flexbox</strong>.
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
                placeholder="Search Java, JVM, OOPs, Collections, HTML, CSS, JavaScript, React, 1000 DSA..."
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/15 rounded-2xl text-sm text-white placeholder:text-slate-400 outline-none focus:bg-white/15 focus:border-pink-400 transition-all font-medium"
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
                { id: 'all', label: 'All Modules' },
                { id: 'java', label: '☕ Java Core & JVM' },
                { id: 'html', label: '🌐 HTML & HTML5' },
                { id: 'css', label: '🎨 CSS & CSS3' },
                { id: 'javascript', label: '⚡ JavaScript' },
                { id: 'react', label: '⚛️ React.js' },
                { id: 'dsa', label: '🧠 1000 DSA Hub' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDomainFilter(tab.id)}
                  className={"px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer " + (
                    activeDomainFilter === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  )}
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
          
          {/* Left Sidebar: Topic Navigator */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-pink-500" />
                  <span>Technical Learning Modules</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {filteredArticles.length} Tutorials
                </span>
              </div>

              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                {filteredArticles.map((art) => {
                  const isSelected = art.id === selectedArticle.id;
                  return (
                    <div
                      key={art.id}
                      onClick={() => {
                        setSelectedArticleId(art.id);
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      }}
                      className={"p-3.5 rounded-2xl border transition-all cursor-pointer " + (
                        isSelected
                          ? 'bg-[#1c1d21] text-white border-slate-900 shadow-md ring-2 ring-pink-500/40'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-100'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={"text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md " + (
                          isSelected ? 'bg-pink-500 text-white' : 'bg-slate-200 text-slate-700'
                        )}>
                          {art.category}
                        </span>
                        <span className={"text-[10px] font-bold " + (
                          art.difficulty.includes('Easy') || art.difficulty.includes('Beginner')
                            ? 'text-emerald-500' 
                            : 'text-amber-500'
                        )}>
                          {art.difficulty}
                        </span>
                      </div>
                      <h4 className={"text-xs font-extrabold line-clamp-2 leading-snug " + (isSelected ? 'text-white' : 'text-slate-900')}>
                        {art.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{art.readTime}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Link to RDC Campus */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-white border border-pink-200 shadow-sm space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 block">
                Classroom Labs in RDC Ghaziabad
              </span>
              <h4 className="text-sm font-black text-slate-900">Want Hands-On Lab Practice?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Join offline practical coding batches in Java, AWS DevOps, and Web Development at our RDC Raj Nagar campus.
              </p>
              <Link
                to="/courses-in-ghaziabad"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 pt-1"
              >
                <span>Explore RDC Courses &amp; Google Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Right Content Area: Detailed Article & Flowdiagrams */}
          <div className="lg:col-span-8 space-y-8">
            <article className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* Article Header */}
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-black uppercase tracking-wider">
                    {selectedArticle.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {selectedArticle.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedArticle.readTime}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {selectedArticle.summary}
                </p>

                {/* Target Companies */}
                {selectedArticle.companies && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400">Asked At:</span>
                    {selectedArticle.companies.map(c => (
                      <span key={c} className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ── 3. INTERACTIVE VISUAL ARCHITECTURE FLOWDIAGRAM ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-pink-500" />
                    <span>Architecture Flowchart &amp; Execution Diagram</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Interactive Concept Diagram</span>
                </div>

                <div className="p-6 rounded-3xl bg-[#0f172a] text-white border border-slate-800 shadow-inner overflow-x-auto flex items-center justify-center min-h-[220px]">
                  
                  {/* DIAGRAM 1: JVM ARCHITECTURE & EXECUTION FLOW */}
                  {selectedArticle.diagramType === 'jvmArchitecture' && (
                    <div className="space-y-4 text-center w-full max-w-2xl font-mono text-xs">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 bg-blue-900/60 border border-blue-500/50 rounded-xl">
                          <span className="text-blue-300 font-bold block">1. .java Source</span>
                          <span className="text-[10px] text-slate-300">Human Readable Code</span>
                        </div>
                        <div className="p-2.5 bg-purple-900/60 border border-purple-500/50 rounded-xl">
                          <span className="text-purple-300 font-bold block">2. javac Compiler</span>
                          <span className="text-[10px] text-slate-300">Generates .class Bytecode</span>
                        </div>
                        <div className="p-2.5 bg-emerald-900/60 border border-emerald-500/50 rounded-xl">
                          <span className="text-emerald-300 font-bold block">3. ClassLoader</span>
                          <span className="text-[10px] text-slate-300">Loading, Linking, Init</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-700 rounded-2xl space-y-2">
                        <span className="text-[11px] font-black text-amber-300 uppercase block">
                          JVM Run-Time Data Areas (Memory Allocation)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                            <strong className="text-amber-300 block">Heap Memory</strong>
                            <span>Objects &amp; Instance Variables (Shared)</span>
                          </div>
                          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                            <strong className="text-cyan-300 block">Call Stack</strong>
                            <span>Method Frames &amp; Primitives (Per-Thread)</span>
                          </div>
                          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                            <strong className="text-rose-300 block">Metaspace</strong>
                            <span>Class Metadata &amp; Statics</span>
                          </div>
                          <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                            <strong className="text-emerald-300 block">PC Register</strong>
                            <span>Current Bytecode Instruction Address</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 font-sans text-left">
                        ⚡ <strong>Execution Engine</strong>: Interpreter runs line-by-line &rarr; HotSpot JIT (C1/C2) compiles hot loops to native CPU machine code &rarr; Garbage Collector reclaims dead Heap objects.
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 2: JAVA COLLECTION FRAMEWORK HIERARCHY */}
                  {selectedArticle.diagramType === 'javaCollectionsHierarchy' && (
                    <div className="space-y-4 text-center w-full max-w-2xl font-mono text-xs">
                      <div className="p-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl font-black text-white">
                        Iterable &lt;T&gt; &rarr; Collection &lt;E&gt; Interface
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-3 bg-slate-800 border border-blue-500/40 rounded-xl space-y-1">
                          <strong className="text-blue-300 block text-xs">List &lt;E&gt; (Ordered, Index-based)</strong>
                          <div className="text-[10px] text-slate-300 space-y-0.5">
                            <div>• ArrayList (Fast O(1) Indexing)</div>
                            <div>• LinkedList (Fast Insert/Delete)</div>
                            <div>• Vector / Stack (Legacy)</div>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-800 border border-purple-500/40 rounded-xl space-y-1">
                          <strong className="text-purple-300 block text-xs">Set &lt;E&gt; (Unique Elements)</strong>
                          <div className="text-[10px] text-slate-300 space-y-0.5">
                            <div>• HashSet (Hashing, Unordered)</div>
                            <div>• LinkedHashSet (Insertion Order)</div>
                            <div>• TreeSet (Red-Black Tree O(logN))</div>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-800 border border-emerald-500/40 rounded-xl space-y-1">
                          <strong className="text-emerald-300 block text-xs">Queue &lt;E&gt; / Deque &lt;E&gt;</strong>
                          <div className="text-[10px] text-slate-300 space-y-0.5">
                            <div>• PriorityQueue (Min/Max Heap)</div>
                            <div>• ArrayDeque (Fast LIFO/FIFO)</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900 border border-amber-500/40 rounded-xl">
                        <strong className="text-amber-300 block text-xs mb-1">Map &lt;K, V&gt; (Key-Value Key-Set Mapping)</strong>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-300">
                          <div className="p-1.5 bg-slate-800 rounded">HashMap (O(1) Hash Table)</div>
                          <div className="p-1.5 bg-slate-800 rounded">LinkedHashMap (Insertion Order)</div>
                          <div className="p-1.5 bg-slate-800 rounded">TreeMap (Sorted Red-Black)</div>
                          <div className="p-1.5 bg-slate-800 rounded">ConcurrentHashMap (CAS Locking)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 3: OOPS 4 PILLARS & SOLID */}
                  {selectedArticle.diagramType === 'oopsPillarsSolid' && (
                    <div className="space-y-3 text-center w-full max-w-xl font-mono text-xs">
                      <div className="p-2.5 bg-purple-700 rounded-xl font-bold text-white">
                        4 Core Pillars of Object-Oriented Programming (OOPs)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                          <strong className="text-amber-300 block">1. Encapsulation</strong>
                          <span>Data Hiding &amp; Accessors</span>
                        </div>
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                          <strong className="text-blue-300 block">2. Abstraction</strong>
                          <span>Interfaces &amp; Contracts</span>
                        </div>
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                          <strong className="text-emerald-300 block">3. Inheritance</strong>
                          <span>Code Reuse &amp; Extensibility</span>
                        </div>
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                          <strong className="text-rose-300 block">4. Polymorphism</strong>
                          <span>Overloading &amp; Dynamic Dispatch</span>
                        </div>
                      </div>
                      <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-amber-200">
                        SOLID: Single Responsibility • Open-Closed • Liskov Substitution • Interface Segregation • Dependency Inversion
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 4: THREAD LIFECYCLE & CONCURRENCY */}
                  {selectedArticle.diagramType === 'threadLifecycle' && (
                    <div className="space-y-3 text-center w-full max-w-lg font-mono text-xs">
                      <div className="p-2.5 bg-blue-700 rounded-xl font-bold">
                        Java Thread State Machine (java.lang.Thread.State)
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded">
                          <span className="text-emerald-300 font-bold block">1. NEW</span>
                          <span>Thread created (new Thread())</span>
                        </div>
                        <div className="p-2 bg-emerald-900/60 border border-emerald-500 rounded">
                          <span className="text-emerald-200 font-bold block">2. RUNNABLE</span>
                          <span>Executing in CPU scheduler</span>
                        </div>
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded">
                          <span className="text-rose-300 font-bold block">3. TERMINATED</span>
                          <span>run() method completed</span>
                        </div>
                      </div>
                      <div className="p-2 bg-amber-950/50 border border-amber-500/40 rounded text-[10px] text-amber-200">
                        ⏸️ Non-Runnable Waiting States: <strong>BLOCKED</strong> (Waiting for Monitor Lock) • <strong>WAITING</strong> (wait() / join()) • <strong>TIMED_WAITING</strong> (sleep(ms) / parkNanos())
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 5: HTML DOM TREE */}
                  {selectedArticle.diagramType === 'htmlDomTree' && (
                    <div className="space-y-3 text-center w-full max-w-md font-mono text-xs">
                      <div className="p-2 bg-blue-600 rounded-lg font-bold">Document Root</div>
                      <div className="p-2 bg-purple-600 rounded-lg font-bold">&lt;html lang="en"&gt;</div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded">
                          <strong className="text-amber-300 block">&lt;head&gt;</strong>
                          <span>meta, title, link</span>
                        </div>
                        <div className="p-2 bg-slate-800 border border-slate-700 rounded">
                          <strong className="text-emerald-300 block">&lt;body&gt;</strong>
                          <span>header, main, footer</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 6: CSS BOX MODEL */}
                  {selectedArticle.diagramType === 'cssBoxModel' && (
                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-sm text-center font-mono text-xs space-y-2">
                      <div className="p-3 bg-amber-600/30 border border-amber-500 rounded-xl">
                        <span className="text-amber-300 block font-bold text-[10px]">MARGIN (Outer Spacing)</span>
                        <div className="p-3 bg-purple-600/30 border border-purple-500 rounded-xl my-1">
                          <span className="text-purple-300 block font-bold text-[10px]">BORDER (Stroke Boundary)</span>
                          <div className="p-3 bg-emerald-600/30 border border-emerald-500 rounded-xl my-1">
                            <span className="text-emerald-300 block font-bold text-[10px]">PADDING (Inner Clearance)</span>
                            <div className="p-2 bg-blue-600 text-white rounded font-bold text-[10px]">
                              CONTENT (Text / Media)
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300 font-sans">
                        box-sizing: border-box includes Padding &amp; Border inside width.
                      </p>
                    </div>
                  )}

                  {/* DIAGRAM 7: JS EVENT LOOP */}
                  {selectedArticle.diagramType === 'jsEventLoop' && (
                    <div className="space-y-3 text-center w-full max-w-lg font-mono text-xs">
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div className="p-2.5 bg-blue-900/60 border border-blue-500 rounded-lg">
                          <strong className="text-blue-300 block">1. Call Stack</strong>
                          <span>Single-Thread LIFO</span>
                        </div>
                        <div className="p-2.5 bg-purple-900/60 border border-purple-500 rounded-lg">
                          <strong className="text-purple-300 block">2. Web APIs</strong>
                          <span>DOM, Fetch, Timers</span>
                        </div>
                        <div className="p-2.5 bg-emerald-900/60 border border-emerald-500 rounded-lg">
                          <strong className="text-emerald-300 block">3. Microtasks</strong>
                          <span>Promise.then (Priority)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DIAGRAM 8: BINARY SEARCH TREE */}
                  {selectedArticle.diagramType === 'tree' && (
                    <div className="space-y-3 text-center font-mono">
                      <div className="inline-block px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-xs shadow-md">
                        Root: 50
                      </div>
                      <div className="flex justify-center gap-16">
                        <div className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">Node: 30</div>
                        <div className="px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs">Node: 70</div>
                      </div>
                      <div className="flex justify-center gap-4 text-[10px]">
                        <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-emerald-400">20</div>
                        <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-emerald-400">40</div>
                        <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-400">60</div>
                        <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-400">80</div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* ── 4. COMPLEXITY BENCHMARKS & ARCHITECTURAL SUMMARY ── */}
              {selectedArticle.complexity && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                    ⚡ Key Architectural Specifications &amp; Complexity Notes:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedArticle.complexity).map(([k, v]) => (
                      <div key={k} className="p-2.5 bg-white rounded-xl border border-slate-200 flex justify-between items-start font-medium gap-2">
                        <span className="text-slate-500 uppercase text-[10px] font-bold shrink-0">{k}:</span>
                        <span className="font-bold text-slate-900 text-right text-[11px] font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 5. MULTI-LANGUAGE CODE WORKBENCH & IMPLEMENTATION ── */}
              {selectedArticle.codeSnippets && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-pink-500" />
                      <span>Production-Ready Code Implementation</span>
                    </span>

                    {/* Language Switcher Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                      {Object.keys(selectedArticle.codeSnippets).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setActiveCodeTab(lang)}
                          className={"px-3 py-1 rounded-lg uppercase transition-all cursor-pointer " + (
                            activeCodeTab === lang
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          )}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Editor Frame */}
                  <div className="relative rounded-2xl bg-[#0d1117] text-slate-200 border border-slate-800 overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        <span className="ml-2 text-[11px] uppercase font-bold text-slate-300">
                          {activeCodeTab} Source Code
                        </span>
                      </span>

                      <button
                        onClick={() => handleCopyCode(selectedArticle.codeSnippets[activeCodeTab] || Object.values(selectedArticle.codeSnippets)[0])}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                        <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto max-h-[500px] text-slate-200">
                      <code>{selectedArticle.codeSnippets[activeCodeTab] || Object.values(selectedArticle.codeSnippets)[0]}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* ── 6. KEY TAKEAWAYS & INTERVIEW CHEAT SHEET ── */}
              {selectedArticle.keyTakeaways && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 block flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Key Takeaways &amp; Interview Tips</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {selectedArticle.keyTakeaways.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </article>

            {/* ── 7. 1000 CURATED DSA INTERVIEW QUESTIONS SECTION ── */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 block">
                    Enterprise Technical Prep
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Curated FAANG &amp; Product Company Questions
                  </h3>
                </div>
                <Link
                  to="/practice"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1.5 shadow-md"
                >
                  <span>Open Live Compiler</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DSA_QUESTION_BANK.slice(0, 10).map((q) => (
                  <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2 hover:border-pink-300 transition">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-900 line-clamp-1">
                        #{q.id} {q.title}
                      </span>
                      <span className={"text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 " + (
                        q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                        q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
                      )}>
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{q.topic}</span>
                      <span className="font-bold text-slate-700">Time: {q.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>
      </div>

    </div>
  );
}
