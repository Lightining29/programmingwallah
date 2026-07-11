import bcrypt from 'bcryptjs';

// Seed initial password hash helpers (plain-text passwords are: admin123, parent123, teacher123)
const salt = bcrypt.genSaltSync(10);
const adminHash = bcrypt.hashSync('admin123', salt);
const parentHash = bcrypt.hashSync('parent123', salt);
const teacherHash = bcrypt.hashSync('teacher123', salt);

const mockStore = {
  isMock: false, // Will be set to true by db.js if MongoDB is offline

  users: [
    {
      _id: 'usr_admin_1',
      name: 'School Administrator',
      email: 'admin@pranidha.edu',
      password: adminHash,
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      createdAt: new Date()
    },
    {
      _id: 'usr_parent_1',
      name: 'Sarah Jenkins',
      email: 'parent@pranidha.edu',
      password: parentHash,
      role: 'parent',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      createdAt: new Date()
    },
    {
      _id: 'usr_teacher_1',
      name: 'Miss Emily Stone',
      email: 'teacher@pranidha.edu',
      password: teacherHash,
      role: 'teacher',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      createdAt: new Date()
    }
  ],

  parents: [
    {
      _id: 'prnt_1',
      userId: 'usr_parent_1',
      name: 'Sarah Jenkins',
      email: 'parent@pranidha.edu',
      phone: '+1 (555) 019-2834',
      address: '742 Evergreen Terrace, Springfield',
      occupation: 'Pediatrician',
      children: ['std_1'],
      createdAt: new Date()
    }
  ],

  teachers: [
    {
      _id: 'tchr_1',
      userId: 'usr_teacher_1',
      name: 'Miss Emily Stone',
      email: 'teacher@pranidha.edu',
      phone: '+1 (555) 014-9988',
      specialization: 'Early Childhood Education',
      qualifications: 'M.Ed. in Child Development',
      classesAssigned: ['Preschool', 'Nursery', 'Junior KG'],
      createdAt: new Date()
    }
  ],

  students: [
    {
      _id: 'std_1',
      name: 'Tommy Jenkins',
      studentId: 'STD-2026-0001',
      dateOfBirth: '2022-04-12',
      gender: 'Male',
      class: 'Preschool',
      parentId: 'prnt_1',
      teacherId: 'tchr_1',
      attendance: [
        { date: '2026-06-08', status: 'present' },
        { date: '2026-06-09', status: 'present' },
        { date: '2026-06-10', status: 'absent' },
        { date: '2026-06-11', status: 'present' }
      ],
      progressReports: [
        { term: 'Term 1', cognitive: 85, social: 90, creative: 78, motorSkills: 88, notes: 'Tommy is highly curious and loves building blocks.' }
      ],
      activities: [
        { date: '2026-06-11', time: '10:30 AM', title: 'Art & Craft', description: 'Painted a beautiful flower layout.', category: 'art' },
        { date: '2026-06-11', time: '12:00 PM', title: 'Healthy Lunch', description: 'Finished all vegetables and fruit.', category: 'food' },
        { date: '2026-06-11', time: '01:30 PM', title: 'Nap Time', description: 'Slept peacefully for 1 hour.', category: 'nap' }
      ],
      createdAt: new Date()
    },
    {
      _id: 'std_2',
      name: 'Lily Watson',
      studentId: 'STD-2026-0002',
      dateOfBirth: '2021-08-22',
      gender: 'Female',
      class: 'Nursery',
      parentId: 'prnt_2', // Will default map
      teacherId: 'tchr_1',
      attendance: [
        { date: '2026-06-08', status: 'present' },
        { date: '2026-06-09', status: 'present' },
        { date: '2026-06-10', status: 'present' },
        { date: '2026-06-11', status: 'present' }
      ],
      progressReports: [
        { term: 'Term 1', cognitive: 95, social: 88, creative: 92, motorSkills: 85, notes: 'Lily is excellent at drawing and helps other children.' }
      ],
      activities: [
        { date: '2026-06-11', time: '10:00 AM', title: 'Playground Games', description: 'Played tag and slides with peers.', category: 'play' }
      ],
      createdAt: new Date()
    }
  ],

  admissions: [
    {
      _id: 'adm_1001',
      applicationNumber: 'PRN-2026-1001',
      studentDetails: { name: 'Aiden Smith', dateOfBirth: '2022-09-15', gender: 'Male', class: 'Pre-Nursery' },
      parentDetails: { fatherName: 'John Smith', motherName: 'Jane Smith', email: 'smith@example.com', phone: '+1 (555) 012-3456', address: '123 Main St, Springfield' },
      documents: { birthCertificate: 'mock_birth_cert.pdf', photo: 'mock_photo.jpg' },
      status: 'pending',
      remarks: 'Awaiting birth certificate verification.',
      submissionDate: new Date()
    },
    {
      _id: 'adm_1002',
      applicationNumber: 'PRN-2026-1002',
      studentDetails: { name: 'Sophia Grace', dateOfBirth: '2021-11-05', gender: 'Female', class: 'Junior KG' },
      parentDetails: { fatherName: 'Robert Grace', motherName: 'Emma Grace', email: 'grace@example.com', phone: '+1 (555) 098-7654', address: '456 Elm St, Springfield' },
      documents: { birthCertificate: 'mock_birth_cert2.pdf', photo: 'mock_photo2.jpg' },
      status: 'approved',
      remarks: 'All documents verified. Admission offered.',
      submissionDate: new Date(Date.now() - 86400000 * 2)
    }
  ],

  announcements: [
    {
      _id: 'ann_1',
      title: 'Summer Vacation Circular 2026',
      content: 'The school will remain closed for summer break starting from June 15th to July 20th. Classes will resume on July 21st with normal timings. Have a safe and happy summer!',
      category: 'circular',
      targetAudience: 'all',
      date: new Date('2026-06-10T10:00:00Z'),
      attachmentUrl: '/assets/documents/summer_vacation_circular.pdf'
    },
    {
      _id: 'ann_2',
      title: 'Parent Teacher Meeting (PTM)',
      content: 'Our monthly Parent Teacher Meeting is scheduled for Saturday, June 13th, from 9:00 AM to 12:30 PM. Please follow the slot timings sent by your respective class teachers.',
      category: 'event',
      targetAudience: 'parents',
      date: new Date('2026-06-11T08:30:00Z')
    },
    {
      _id: 'ann_3',
      title: 'Heavy Rain Warning - School Delayed',
      content: 'Due to warnings of heavy rain and waterlogging tomorrow, school start time is delayed by 2 hours. School buses will pick up children 2 hours later than standard timings.',
      category: 'emergency',
      targetAudience: 'all',
      date: new Date()
    }
  ],

  events: [
    {
      _id: 'ev_1',
      title: 'PTM Meet',
      description: 'Discuss Term 1 children progress and development milestones.',
      startDate: '2026-06-13T09:00:00Z',
      endDate: '2026-06-13T13:00:00Z',
      type: 'ptm'
    },
    {
      _id: 'ev_2',
      title: 'Summer Camp Kickoff',
      description: 'Interactive sports, painting, and music camp for nursery & KG children.',
      startDate: '2026-06-20T08:00:00Z',
      endDate: '2026-06-25T14:00:00Z',
      type: 'celebration'
    },
    {
      _id: 'ev_3',
      title: 'Independence Day Holiday',
      description: 'National holiday celebration and school closed.',
      startDate: '2026-07-04T00:00:00Z',
      endDate: '2026-07-04T23:59:59Z',
      type: 'holiday'
    },
    {
      _id: 'ev_4',
      title: 'Term-1 Examinations',
      description: 'Informal evaluation through educational quizzes and games.',
      startDate: '2026-07-15T09:00:00Z',
      endDate: '2026-07-18T12:00:00Z',
      type: 'exam'
    }
  ],

  gallery: [
    {
      _id: 'gal_1',
      title: 'Annual Day Celebrations',
      description: 'Kids wearing adorable costumes for the theatrical play.',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800',
      category: 'events',
      date: new Date('2026-04-10')
    },
    {
      _id: 'gal_2',
      title: 'Outdoor Fun in the Sandbox',
      description: 'Building sandcastles and learning cooperation.',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800',
      category: 'sports',
      date: new Date('2026-05-18')
    },
    {
      _id: 'gal_3',
      title: 'Little Painters at Work',
      description: 'Expressing creativity in our modern activity rooms.',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800',
      category: 'classroom',
      date: new Date('2026-06-02')
    },
    {
      _id: 'gal_4',
      title: 'Computer Lab Explorers',
      description: 'Children learning basics of computer parts and educational games.',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      category: 'classroom',
      date: new Date('2026-06-05')
    }
  ],

  fees: [
    {
      _id: 'fee_1',
      studentId: 'std_1',
      amount: 12500,
      term: 'Term 1 (April - June)',
      dueDate: new Date('2026-05-30'),
      status: 'paid',
      paymentDate: new Date('2026-05-28'),
      transactionId: 'TXN-987216439',
      paymentMethod: 'Credit Card'
    },
    {
      _id: 'fee_2',
      studentId: 'std_1',
      amount: 12500,
      term: 'Term 2 (July - Sept)',
      dueDate: new Date('2026-08-30'),
      status: 'pending'
    }
  ],

  receipts: [
    {
      _id: 'rec_1',
      feeId: 'fee_1',
      studentId: 'std_1',
      receiptNumber: 'REC-1718102400000',
      amountPaid: 12500,
      paymentMethod: 'Credit Card',
      paymentDate: new Date('2026-05-28'),
      transactionId: 'TXN-987216439'
    }
  ],

  feeStructures: [
    {
      _id: 'str_1',
      class: 'Nursery',
      academicYear: '2026-2027',
      admissionFee: 5000,
      tuitionFee: 1500,
      computerFee: 200,
      developmentFee: 2000,
      activityFee: 150,
      smartClassFee: 100,
      transportFee: 0,
      examinationFee: 500,
      annualCharges: 3000,
      libraryFee: 100,
      customFees: [],
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'str_2',
      class: 'LKG',
      academicYear: '2026-2027',
      admissionFee: 5000,
      tuitionFee: 1800,
      computerFee: 250,
      developmentFee: 2000,
      activityFee: 150,
      smartClassFee: 150,
      transportFee: 0,
      examinationFee: 500,
      annualCharges: 3000,
      libraryFee: 100,
      customFees: [],
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'str_3',
      class: 'UKG',
      academicYear: '2026-2027',
      admissionFee: 5000,
      tuitionFee: 2000,
      computerFee: 300,
      developmentFee: 2000,
      activityFee: 200,
      smartClassFee: 200,
      transportFee: 0,
      examinationFee: 600,
      annualCharges: 3500,
      libraryFee: 100,
      customFees: [],
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'str_4',
      class: 'Class 1',
      academicYear: '2026-2027',
      admissionFee: 7500,
      tuitionFee: 2500,
      computerFee: 350,
      developmentFee: 3000,
      activityFee: 250,
      smartClassFee: 250,
      transportFee: 800,
      examinationFee: 750,
      annualCharges: 4000,
      libraryFee: 150,
      customFees: [{ name: 'Science Lab Fee', amount: 200, period: 'Monthly' }],
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'str_5',
      class: 'Class 5',
      academicYear: '2026-2027',
      admissionFee: 10000,
      tuitionFee: 3500,
      computerFee: 400,
      developmentFee: 4000,
      activityFee: 300,
      smartClassFee: 300,
      transportFee: 800,
      examinationFee: 1000,
      annualCharges: 5000,
      libraryFee: 200,
      customFees: [{ name: 'Science Lab Fee', amount: 300, period: 'Monthly' }],
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: 'str_6',
      class: 'Class 10',
      academicYear: '2026-2027',
      admissionFee: 15000,
      tuitionFee: 5000,
      computerFee: 500,
      developmentFee: 5000,
      activityFee: 400,
      smartClassFee: 500,
      transportFee: 1000,
      examinationFee: 1500,
      annualCharges: 7500,
      libraryFee: 300,
      customFees: [
        { name: 'Science Lab Fee', amount: 400, period: 'Monthly' },
        { name: 'Board Exam Preparation', amount: 2000, period: 'Annual' }
      ],
      isActive: true,
      createdAt: new Date()
    }
  ],

  fineRules: [
    {
      _id: 'fnr_1',
      minDays: 1,
      maxDays: 10,
      fineAmount: 50,
      createdAt: new Date()
    },
    {
      _id: 'fnr_2',
      minDays: 11,
      maxDays: 20,
      fineAmount: 100,
      createdAt: new Date()
    },
    {
      _id: 'fnr_3',
      minDays: 21,
      maxDays: 30,
      fineAmount: 200,
      createdAt: new Date()
    }
  ],

  messages: [
    {
      _id: 'msg_1',
      senderId: 'usr_parent_1',
      receiverId: 'usr_teacher_1',
      content: 'Hello Miss Emily, I noticed Tommy had a bit of sniffles today. Please keep an eye on him during outdoor play.',
      timestamp: new Date(Date.now() - 3600000 * 3),
      isRead: true
    },
    {
      _id: 'msg_2',
      senderId: 'usr_teacher_1',
      receiverId: 'usr_parent_1',
      content: 'Sure Sarah, thank you for letting me know. I will make sure he stays inside the heated play area and stays hydrated.',
      timestamp: new Date(Date.now() - 3600000 * 2),
      isRead: true
    },
    {
      _id: 'msg_3',
      senderId: 'usr_parent_1',
      receiverId: 'usr_teacher_1',
      content: 'Perfect, thank you so much! Let me know if his energy seems low.',
      timestamp: new Date(Date.now() - 3600000 * 1),
      isRead: false
    }
  ],

  queries: [
    {
      _id: 'qr_1',
      name: 'Michael Davis',
      email: 'michael@example.com',
      phone: '+1 (555) 018-4933',
      subject: 'Admission Inquiry for KG-1',
      message: 'Hello, I want to know about the admission dates and the bus transport availability for the Springfield area. Thanks!',
      status: 'unread',
      createdAt: new Date()
    }
  ],

  libraryNotes: [],

  coursePayments: [],

  meetings: [
    {
      _id: 'mtg_1',
      title: 'Term 1 Parent–Teacher Meeting',
      description: 'Group PTM to discuss Term 1 progress, milestones, and next steps for the cohort.',
      startTime: new Date(Date.now() + 86400000 * 2 + 32400000),
      durationMinutes: 60,
      hostId: 'usr_teacher_1',
      hostName: 'Miss Emily Stone',
      hostRole: 'teacher',
      joinUrl: 'https://meet.google.com/app-tree1',
      conferenceId: '',
      targetAudience: 'parents',
      classFilter: '',
      status: 'scheduled',
      createdAt: new Date()
    },
    {
      _id: 'mtg_2',
      title: 'Faculty Sync — Curriculum Review',
      description: 'Monthly staff sync covering lesson plans, assessments, and upcoming events.',
      startTime: new Date(Date.now() + 86400000 * 1 + 28800000),
      durationMinutes: 45,
      hostId: 'usr_admin_1',
      hostName: 'School Administrator',
      hostRole: 'admin',
      joinUrl: 'https://meet.google.com/app-tree2',
      conferenceId: '',
      targetAudience: 'teachers',
      classFilter: '',
      status: 'scheduled',
      createdAt: new Date()
    }
  ],

  jobs: [
    {
      _id: 'job_1',
      title: 'Senior Teacher - English',
      description: 'We are seeking an experienced English teacher for our Primary section with expertise in modern teaching methodologies.',
      department: 'teaching',
      position: 'senior',
      salary: 50000,
      qualifications: 'B.Ed with English specialization, M.A. in English preferred',
      experience: '5+ years',
      responsibilities: 'Teaching English to primary students, curriculum development, student assessment, parent communication',
      benefits: 'Health insurance, professional development allowance, paid leave',
      location: 'On-site',
      applicationDeadline: new Date('2026-07-31'),
      status: 'open',
      createdAt: new Date()
    },
    {
      _id: 'job_2',
      title: 'Mathematics Teacher - Junior KG',
      description: 'Seeking a passionate Mathematics educator to teach early numeracy and mathematical concepts to young learners.',
      department: 'teaching',
      position: 'junior',
      salary: 35000,
      qualifications: 'B.Ed with Mathematics specialization',
      experience: '2+ years',
      responsibilities: 'Teaching mathematics concepts, classroom management, assessment and reporting',
      benefits: 'Competitive salary, flexible working hours',
      location: 'On-site',
      applicationDeadline: new Date('2026-08-15'),
      status: 'open',
      createdAt: new Date()
    }
  ],

  courses: [
    {
      _id: 'course_1',
      title: 'Java Development',
      description: 'It includes the basics of java programming language and its applications. The curriculum covers fundamental concepts such as variables, data types, control structures, object-oriented programming, and basic algorithms. Students will engage in hands-on coding exercises and projects to build a strong foundation in java development.',
      duration: '1 month - 6 months',
      price: 4999,
      milestones: [
        'Understanding of java syntax and basic programming concepts',
        'Ability to write simple java programs and solve basic coding problems',
        'Familiarity with object-oriented programming principles',
        'Completion of a small java project demonstrating learned skills'
      ],
      schedule: [
        { time: '05:00 PM', activity: 'Java Programming Class' },
        { time: '06:00 PM', activity: 'Java Programming Class' }
      ],
      category: 'development',
      color: 'brandMint',
      order: 1,
      imageUrl: '',
      isActive: true,
      isPublished: true,
      totalLessons: 0,
      totalModules: 0,
      totalEnrollments: 0,
      createdAt: new Date()
    },
    {
      _id: 'course_2',
      title: 'Frontend Development',
      description: 'This program focuses on the development of user interfaces and user experiences for web applications. The curriculum includes HTML, CSS, JavaScript, and popular frontend frameworks such as React or Angular. Students will learn how to create responsive and visually appealing websites, as well as how to optimize performance and accessibility.',
      duration: '1 month - 6 months',
      price: 5499,
      milestones: [
        'Proficiency in HTML, CSS, and JavaScript',
        'Ability to create responsive web designs',
        'Experience with frontend frameworks like React or Angular',
        'Completion of a frontend project showcasing learned skills'
      ],
      schedule: [
        { time: '05:00 PM', activity: 'Frontend Development Class' },
        { time: '06:00 PM', activity: 'Frontend Development Class' }
      ],
      category: 'development',
      color: 'brandSky',
      order: 2,
      imageUrl: '',
      isActive: true,
      isPublished: true,
      totalLessons: 0,
      totalModules: 0,
      totalEnrollments: 0,
      createdAt: new Date()
    },
    {
      _id: 'course_3',
      title: 'Backend Development',
      description: 'This program covers the server-side development of web applications. The curriculum includes programming languages such as Python, Node.js, or Java, as well as frameworks like Django or Express. Students will learn how to build APIs, manage databases, and implement authentication and security measures.',
      duration: '1 month - 6 months',
      price: 6499,
      milestones: [
        'Proficiency in a backend programming language (Python, Node.js, or Java)',
        'Experience with backend frameworks (Django, Express, etc.)',
        'Ability to create and manage databases',
        'Completion of a backend project demonstrating learned skills'
      ],
      schedule: [
        { time: '05:00 PM', activity: 'Backend Development Class' },
        { time: '06:00 PM', activity: 'Backend Development Class' }
      ],
      category: 'development',
      color: 'brandCoral',
      order: 3,
      imageUrl: '',
      isActive: true,
      isPublished: true,
      totalLessons: 0,
      totalModules: 0,
      totalEnrollments: 0,
      createdAt: new Date()
    }
  ],

  modules: [],
  lessons: [],
  enrollments: [],
  videoProgress: [],
  notes: [],

  // In-memory helper methods
  async find(collectionName, filter = {}) {
    const list = this[collectionName] || [];
    return list.filter(item => {
      for (let key in filter) {
        if (filter[key] !== undefined && item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
  },

  async findOne(collectionName, filter = {}) {
    const list = await this.find(collectionName, filter);
    return list[0] || null;
  },

  async findById(collectionName, id) {
    const list = this[collectionName] || [];
    return list.find(item => item._id === id) || null;
  },

  async create(collectionName, data) {
    if (!this[collectionName]) this[collectionName] = [];
    const id = collectionName.slice(0, 3) + '_' + Math.random().toString(36).substr(2, 9);
    const newRecord = { _id: id, ...data, createdAt: new Date() };
    this[collectionName].push(newRecord);
    return newRecord;
  },

  async findByIdAndUpdate(collectionName, id, updates) {
    const item = await this.findById(collectionName, id);
    if (!item) return null;
    Object.assign(item, updates);
    return item;
  },

  async findByIdAndDelete(collectionName, id) {
    const idx = (this[collectionName] || []).findIndex(item => item._id === id);
    if (idx === -1) return null;
    const deleted = this[collectionName].splice(idx, 1);
    return deleted[0];
  }
};

export default mockStore;
