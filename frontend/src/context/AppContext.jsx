import React, { createContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const initialSchools = [
  { id: 'school-1', name: 'SRI VANI VIDYANIKETHAN EM SCHOOL (Main Campus)', code: 'SVV-MAIN', address: '3-89, Pedda Kottala St, Pedda Kottala, Kottala, Andhra Pradesh 518502', studentsCount: 500, teachersCount: 50, status: 'Active' }
];

const initialAdmins = [];

const initialTeachers = [];

const initialStudents = [];

const initialParents = [];

const initialExams = [];

const initialAttendance = [];

const initialMarks = [];

const initialHomework = [];

const initialNotes = [];

const initialCirculars = [];

const initialLiveClasses = [];

const initialLibraryBooks = [];

const initialHostels = [];

const initialTransportRoutes = [];

const initialAuditLogs = [];

const initialSupportTickets = [];

const initialTestimonials = [];

const initialEnquiries = [];

const initialGalleryItems = [];

const initialSubjects = [
  { id: 'sub1', code: 'TELUGU',          name: 'Telugu',           department: 'Languages' },
  { id: 'sub2', code: 'HINDI',           name: 'Hindi',            department: 'Languages' },
  { id: 'sub3', code: 'ENGLISH',         name: 'English',          department: 'Languages' },
  { id: 'sub4', code: 'MATHEMATICS',     name: 'Mathematics',      department: 'Mathematics' },
  { id: 'sub5', code: 'GENERALSCIENCE',  name: 'General Science',  department: 'Science' },
  { id: 'sub6', code: 'PHYSICS',         name: 'Physics',          department: 'Science' },
  { id: 'sub7', code: 'CHEMISTRY',       name: 'Chemistry',        department: 'Science' },
  { id: 'sub8', code: 'BIOLOGY',         name: 'Biology',          department: 'Science' },
  { id: 'sub9', code: 'SOCIALSTUDIES',   name: 'Social Studies',   department: 'Social Studies' },
  { id: 'sub10', code: 'GENERALKNOWLEDGE', name: 'General Knowledge', department: 'General' },
  { id: 'sub11', code: 'COMPUTER',       name: 'Computer Science', department: 'Technology' },
  { id: 'sub12', code: 'DRAWING',        name: 'Drawing & Art',    department: 'Arts' },
  { id: 'sub13', code: 'YOGA',           name: 'Yoga & P.E.',      department: 'Physical Education' },
  { id: 'sub14', code: 'SANSKRIT',       name: 'Sanskrit',         department: 'Languages' },
  { id: 'sub15', code: 'EVS',            name: 'EVS',              department: 'Science' },
];

const initialAdmissionBanner = {
  active: true,
  year: '2026–2027',
  headline: 'ADMISSIONS OPEN FOR',
  subtitle: 'Register Online Today.',
  buttonLabel: 'Apply Now',
};

const initialAdmissions = [];

const initialFacilities = [];

const initialManagementCommittee = [
  { id: 'm1', name: 'K Dasaratha Rami Reddy', role: 'Principal & Director', qual: 'M.Ed / M.Sc, Educational Leadership', photo: '/principal.jpg' },
  { id: 'm2', name: 'Robert Vance', role: 'Chairman, Management Committee', qual: 'MBA (Harvard Business School)', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'm3', name: 'Dr. Evelyn Carter', role: 'Vice Principal', qual: 'Ph.D. in Child Psychology', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
];

const initialHomepageInfra = [
  { id: 'infra1', title: 'Smart Digital Classrooms', description: 'Interactive smart boards, projectors, and air-conditioned rooms for immersive learning experiences.', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80' },
  { id: 'infra2', title: 'Advanced Science Labs', description: 'Fully equipped Physics, Chemistry, and Biology laboratories with modern instruments and safety gear.', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80' },
  { id: 'infra3', title: 'Olympic-Grade Sports Complex', description: 'Basketball courts, cricket ground, athletics track, and indoor games facility for holistic student development.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80' },
  { id: 'infra4', title: 'Central Library & Resource Center', description: 'Over 10,050 books, digital research stations, and a serene reading hall open to all students.', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80' }
];

const initialHomepageStats = [
  { id: 'stat1', value: '500+', label: 'Students Enrolled', icon: '🎓' },
  { id: 'stat2', value: '50+', label: 'Expert Educators', icon: '👨‍🏫' },
  { id: 'stat3', value: '1', label: 'School Branch', icon: '🏫' },
  { id: 'stat4', value: '15+', label: 'Years of Excellence', icon: '🏆' }
];

const initialGradingProcess = {
  title: 'Resulting & Grading Process',
  description: 'At Sri Vani Vidyanikethan, we follow a comprehensive evaluation system that combines Continuous and Comprehensive Evaluation (CCE) with traditional examination patterns. Students are assessed through Unit Tests, Half-Yearly, and Annual Examinations along with project work, assignments, and lab practicals.'
};

const initialGradingScheme = [
  { grade: 'A+', range: '90–100', description: 'Outstanding', color: '#10b981' },
  { grade: 'A', range: '80–89', description: 'Excellent', color: '#22c55e' },
  { grade: 'B+', range: '70–79', description: 'Very Good', color: '#3b82f6' },
  { grade: 'B', range: '60–69', description: 'Good', color: '#6366f1' },
  { grade: 'C+', range: '50–59', description: 'Above Average', color: '#f59e0b' },
  { grade: 'C', range: '40–49', description: 'Average', color: '#f97316' },
  { grade: 'D', range: '35–39', description: 'Below Average', color: '#ef4444' },
  { grade: 'F', range: 'Below 35', description: 'Fail', color: '#dc2626' }
];

const initialDepartments = ['Languages', 'Mathematics', 'Science', 'Social Studies', 'General', 'Technology', 'Arts', 'Physical Education'];

const initialGalleryCategories = ['Annual Day', 'Sports', 'Special Events', 'Cultural Programs', 'Science Exhibition'];

const initialComplaints = [];

const initialLeaveRequests = [];

const initialStarredFormFields = {
  studentName: true,
  dob: true,
  grade: true,
  parentName: true,
  parentPhone: true,
  parentEmail: false,
  whatsappNumber: false,
  address: false
};

const initialWhatsappLogs = [];

const initialAcademicCalendar = [];

const initialAcademicPrograms = [];

const DATA_VERSION = '7';

const readStoredValue = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    // If the data version has changed, clear all school_ keys to reset stale data
    const storedVersion = window.localStorage.getItem('school_data_version');
    if (storedVersion !== DATA_VERSION) {
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith('school_')) keysToRemove.push(k);
      }
      keysToRemove.forEach(k => window.localStorage.removeItem(k));
      window.localStorage.setItem('school_data_version', DATA_VERSION);
      return fallback;
    }

    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return readStoredValue('school_current_user', { role: 'Guest', name: 'Public Guest' });
  });

  const [schools, setSchools] = useState(() => {
    return readStoredValue('school_schools', initialSchools);
  });

  const [teachers, setTeachers] = useState(() => {
    return readStoredValue('school_teachers', initialTeachers);
  });

  const [students, setStudents] = useState(() => {
    return readStoredValue('school_students', initialStudents);
  });

  const [parents, setParents] = useState(() => {
    return readStoredValue('school_parents', initialParents);
  });

  const [attendance, setAttendance] = useState(() => {
    return readStoredValue('school_attendance', initialAttendance);
  });

  const [marks, setMarks] = useState(() => {
    return readStoredValue('school_marks', initialMarks);
  });

  const [homework, setHomework] = useState(() => {
    return readStoredValue('school_homework', initialHomework);
  });

  const [notes, setNotes] = useState(() => {
    return readStoredValue('school_notes', initialNotes);
  });

  const [circulars, setCirculars] = useState(() => {
    return readStoredValue('school_circulars', initialCirculars);
  });

  const [liveClasses, setLiveClasses] = useState(() => {
    return readStoredValue('school_live_classes', initialLiveClasses);
  });

  const [libraryBooks, setLibraryBooks] = useState(() => {
    return readStoredValue('school_library_books', initialLibraryBooks);
  });

  const [hostels, setHostels] = useState(() => {
    return readStoredValue('school_hostels', initialHostels);
  });

  const [transportRoutes, setTransportRoutes] = useState(() => {
    return readStoredValue('school_transport_routes', initialTransportRoutes);
  });

  const [timetables, setTimetables] = useState(() => {
    return readStoredValue('school_timetables', []);
  });

  const [fees, setFees] = useState(() => {
    return readStoredValue('school_fees', []);
  });

  const [tickerItems, setTickerItems] = useState(() => {
    return readStoredValue('school_ticker_items', []);
  });

  const [schoolInfo, setSchoolInfo] = useState(() => {
    return readStoredValue('school_info', {
      name: 'SRI VANI VIDYANIKETHAN',
      tagline: 'EM SCHOOL',
      logo: '/logo.jpg',
      principalName: 'K Dasaratha Rami Reddy',
      principalDesignation: 'Principal, Sri Vani Vidyanikethan',
      principalPhoto: '/principal.jpg',
      principalMessage: 'At Sri Vani Vidyanikethan, we foster an environment of creativity, integrity, and analytical reasoning. We do not believe in rote memorization. Instead, we implement research-led curricula, integrated with the latest virtual tools. Our goal is to prepare students to face global challenges, with values grounded in kindness and civic responsibility.',
      principalQuote: 'We inspire young minds to push the limits of their creativity, shaping tomorrow\'s leaders, engineers, scientists, and humanitarians.',
      history: 'Founded in 2006, Gravity International began as an experimental science school. Over two decades, we expanded to include comprehensive secondary education, global exchange programs, and state-of-the-art AI-driven performance models.',
      vision: 'To be a leading global ecosystem of learning that cultivates scientific inquiries, creative expression, moral integrity, and social leadership among students.',
      mission: 'To deliver academic instruction using modern techniques, stimulate independent problem solving, provide rich co-curricular opportunities, and build empathetic, responsible world citizens.'
    });
  });

  const [managementCommittee, setManagementCommittee] = useState(() => {
    return readStoredValue('school_management_committee', initialManagementCommittee);
  });

  const [admins, setAdmins] = useState(() => {
    return readStoredValue('school_admins', initialAdmins);
  });

  const [exams, setExams] = useState(() => {
    return readStoredValue('school_exams', initialExams);
  });

  const [classes, setClasses] = useState(() => {
    return readStoredValue('school_classes', ['Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6', 'Class 5', 'Class 4', 'Class 3', 'Class 2', 'Class 1', 'UKG', 'LKG', 'Playclass']);
  });

  const [sections, setSections] = useState(() => {
    return readStoredValue('school_sections', ['A', 'B']);
  });


  const [auditLogs, setAuditLogs] = useState(() => {
    return readStoredValue('school_audit_logs', initialAuditLogs);
  });

  const [supportTickets, setSupportTickets] = useState(() => {
    return readStoredValue('school_support_tickets', initialSupportTickets);
  });

  const [galleryItems, setGalleryItems] = useState(() => {
    return readStoredValue('school_gallery_items', initialGalleryItems);
  });

  const [academicCalendar, setAcademicCalendar] = useState(() => {
    return readStoredValue('school_academic_calendar', initialAcademicCalendar);
  });

  const [academicPrograms, setAcademicPrograms] = useState(() => {
    return readStoredValue('school_academic_programs', initialAcademicPrograms);
  });

  const [testimonials, setTestimonials] = useState(() => {
    return readStoredValue('school_testimonials', initialTestimonials);
  });

  const [enquiries, setEnquiries] = useState(() => {
    return readStoredValue('school_enquiries', initialEnquiries);
  });

  const [subjects, setSubjects] = useState(() => {
    return readStoredValue('school_subjects', initialSubjects);
  });

  const [admissionBanner, setAdmissionBanner] = useState(() => {
    return readStoredValue('school_admission_banner', initialAdmissionBanner);
  });

  const [admissions, setAdmissions] = useState(() => readStoredValue('school_admissions', initialAdmissions));
  const [facilities, setFacilities] = useState(() => readStoredValue('school_facilities', initialFacilities));
  const [homepageInfra, setHomepageInfra] = useState(() => readStoredValue('school_homepage_infra', initialHomepageInfra));
  const [homepageStats, setHomepageStats] = useState(() => readStoredValue('school_homepage_stats', initialHomepageStats));
  const [gradingProcess, setGradingProcess] = useState(() => readStoredValue('school_grading_process', initialGradingProcess));
  const [gradingScheme, setGradingScheme] = useState(() => readStoredValue('school_grading_scheme', initialGradingScheme));
  const [departments, setDepartments] = useState(() => readStoredValue('school_departments', initialDepartments));
  const [galleryCategories, setGalleryCategories] = useState(() => readStoredValue('school_gallery_categories', initialGalleryCategories));
  const [complaints, setComplaints] = useState(() => readStoredValue('school_complaints', initialComplaints));
  const [whatsappLogs, setWhatsappLogs] = useState(() => readStoredValue('school_whatsapp_logs', initialWhatsappLogs));
  const [requiredDocuments, setRequiredDocuments] = useState(() => readStoredValue('school_required_documents', [
    'Birth Certificate (Original copy for verification)',
    'Previous School Report Cards (Last 2 academic terms)',
    'Transfer/School Leaving Certificate',
    'Vaccination and medical records',
    '3 recent passport-sized photos of the student',
    'Proof of Address (Utility bill/Rent agreement)'
  ]));

  const [leaveRequests, setLeaveRequests] = useState(() => readStoredValue('school_leave_requests', initialLeaveRequests));
  const [starredFormFields, setStarredFormFields] = useState(() => readStoredValue('school_starred_form_fields', initialStarredFormFields));
  const [attendanceCalcConfig, setAttendanceCalcConfig] = useState(() => readStoredValue('school_attendance_calc_config', {
    mode: 'session-based',
    minRequired: 75,
    leaveExcused: true
  }));

  const [notifications, setNotifications] = useState([]);

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('school_theme') || 'light';
  });

  const lastSyncedPayloadRef = useRef('');
  const lastUpdatedAtRef = useRef(null);
  const isUpdatingFromDBRef = useRef(true); // Start TRUE to block write-back until initial load completes
  const initialLoadDoneRef = useRef(false);

  const [superAdminPassword, setSuperAdminPassword] = useState(() => {
    return readStoredValue('school_super_admin_password', 'seshu@2409');
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Helper: build a canonical payload object from data (used in load, save, and poll)
  const buildPayload = (src) => ({
    schools: src.schools || [],
    teachers: src.teachers || [],
    students: src.students || [],
    parents: src.parents || [],
    admins: src.admins || [],
    attendance: src.attendance || [],
    marks: src.marks || [],
    homework: src.homework || [],
    notes: src.notes || [],
    circulars: src.circulars || [],
    liveClasses: src.liveClasses || [],
    libraryBooks: src.libraryBooks || [],
    hostels: src.hostels || [],
    transportRoutes: src.transportRoutes || [],
    timetables: src.timetables || [],
    fees: src.fees || [],
    tickerItems: src.tickerItems || [],
    schoolInfo: src.schoolInfo || {},
    managementCommittee: src.managementCommittee || [],
    exams: src.exams || [],
    classes: src.classes || [],
    sections: src.sections || [],
    auditLogs: src.auditLogs || [],
    supportTickets: src.supportTickets || [],
    galleryItems: src.galleryItems || [],
    academicCalendar: src.academicCalendar || [],
    academicPrograms: src.academicPrograms || [],
    testimonials: src.testimonials || [],
    enquiries: src.enquiries || [],
    subjects: src.subjects || [],
    admissionBanner: src.admissionBanner || {},
    admissions: src.admissions || [],
    facilities: src.facilities || [],
    homepageInfra: src.homepageInfra || [],
    homepageStats: src.homepageStats || [],
    gradingProcess: src.gradingProcess || {},
    gradingScheme: src.gradingScheme || [],
    departments: src.departments || [],
    galleryCategories: src.galleryCategories || [],
    complaints: src.complaints || [],
    whatsappLogs: src.whatsappLogs || [],
    requiredDocuments: src.requiredDocuments || [],
    leaveRequests: src.leaveRequests || [],
    starredFormFields: src.starredFormFields || {},
    attendanceCalcConfig: src.attendanceCalcConfig || { mode: 'session-based', minRequired: 75, leaveExcused: true },
    superAdminPassword: src.superAdminPassword || 'seshu@2409'
  });

  // Helper: apply data from DB to all React state setters
  const applyDBData = (data) => {
    // Always set — even if the DB value is an empty array, that IS the truth
    setSchools(data.schools || []);
    setTeachers(data.teachers || []);
    setStudents(data.students || []);
    setParents(data.parents || []);
    setAdmins(data.admins || []);
    setAttendance(data.attendance || []);
    setMarks(data.marks || []);
    setHomework(data.homework || []);
    setNotes(data.notes || []);
    setCirculars(data.circulars || []);
    setLiveClasses(data.liveClasses || []);
    setLibraryBooks(data.libraryBooks || []);
    setHostels(data.hostels || []);
    setTransportRoutes(data.transportRoutes || []);
    setTimetables(data.timetables || []);
    setFees(data.fees || []);
    setTickerItems(data.tickerItems || []);
    setSchoolInfo(data.schoolInfo || {});
    setManagementCommittee(data.managementCommittee || initialManagementCommittee);
    setExams(data.exams || []);
    setClasses(data.classes || []);
    setSections(data.sections || []);
    setAuditLogs(data.auditLogs || []);
    setSupportTickets(data.supportTickets || []);
    setGalleryItems(data.galleryItems || []);
    setAcademicCalendar(data.academicCalendar || []);
    setAcademicPrograms(data.academicPrograms || []);
    setTestimonials(data.testimonials || []);
    setEnquiries(data.enquiries || []);
    setSubjects(data.subjects || []);
    setAdmissionBanner(data.admissionBanner || {});
    setAdmissions(data.admissions || []);
    setFacilities(data.facilities || []);
    setHomepageInfra(data.homepageInfra || initialHomepageInfra);
    setHomepageStats(data.homepageStats || initialHomepageStats);
    setGradingProcess(data.gradingProcess || initialGradingProcess);
    setGradingScheme(data.gradingScheme || initialGradingScheme);
    setDepartments(data.departments || initialDepartments);
    setGalleryCategories(data.galleryCategories || initialGalleryCategories);
    setComplaints(data.complaints || []);
    setWhatsappLogs(data.whatsappLogs || []);
    setRequiredDocuments(data.requiredDocuments || []);
    setLeaveRequests(data.leaveRequests || []);
    setStarredFormFields(data.starredFormFields || initialStarredFormFields);
    setAttendanceCalcConfig(data.attendanceCalcConfig || { mode: 'session-based', minRequired: 75, leaveExcused: true });
    setSuperAdminPassword(data.superAdminPassword || 'seshu@2409');
  };

  // ═══ SYNC 1: Load state from MongoDB on first mount ═══
  useEffect(() => {
    const fetchState = async () => {
      // Keep the guard ON so the write-back effect does NOT fire during load
      isUpdatingFromDBRef.current = true;

      try {
        const res = await fetch(`${API_BASE_URL}/api/data`);
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data;

          lastUpdatedAtRef.current = data.updatedAt;

          const payload = buildPayload(data);
          lastSyncedPayloadRef.current = JSON.stringify(payload);

          applyDBData(data);
          console.log('✅ Loaded application state from MongoDB Atlas');
        } else {
          console.log('ℹ️ MongoDB Atlas state empty or first-time load. Using localStorage defaults.');
        }
      } catch (err) {
        console.error('❌ Failed to load state from MongoDB, using localStorage fallback:', err);
      } finally {
        setIsLoaded(true);
        initialLoadDoneRef.current = true;
        // Release the guard AFTER a delay so React has time to flush all setState calls
        // before the write-back effect runs
        setTimeout(() => {
          isUpdatingFromDBRef.current = false;
        }, 3000);
      }
    };
    fetchState();
  }, []);

  // ═══ SYNC 2: Write state changes to MongoDB (debounced) ═══
  useEffect(() => {
    if (!isLoaded) return;
    if (!initialLoadDoneRef.current) return;

    const syncState = async () => {
      // Double-check the guard — if we're in the middle of applying DB data, skip
      if (isUpdatingFromDBRef.current) return;

      const payload = buildPayload({
        schools,
        teachers,
        students,
        parents,
        admins,
        attendance,
        marks,
        homework,
        notes,
        circulars,
        liveClasses,
        libraryBooks,
        hostels,
        transportRoutes,
        timetables,
        fees,
        tickerItems,
        schoolInfo,
        managementCommittee,
        exams,
        classes,
        sections,
        auditLogs,
        supportTickets,
        galleryItems,
        academicCalendar,
        academicPrograms,
        testimonials,
        enquiries,
        subjects,
        admissionBanner,
        admissions,
        facilities,
        homepageInfra,
        homepageStats,
        gradingProcess,
        gradingScheme,
        departments,
        galleryCategories,
        complaints,
        whatsappLogs,
        requiredDocuments,
        leaveRequests,
        starredFormFields,
        attendanceCalcConfig,
        superAdminPassword
      });

      const payloadStr = JSON.stringify(payload);
      if (payloadStr === lastSyncedPayloadRef.current) {
        // No changes since last sync/load. Skip write to avoid loops!
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stateKey: 'main', ...payload })
        });
        const json = await res.json();
        if (json.success && json.data) {
          lastSyncedPayloadRef.current = payloadStr;
          lastUpdatedAtRef.current = json.data.updatedAt;
          console.log('✅ State saved to MongoDB Atlas');
        } else {
          console.error('❌ Failed to save state to MongoDB Atlas:', json.error);
        }
      } catch (err) {
        console.error('❌ Failed to sync state to MongoDB Atlas:', err);
      }
    };

    const timer = setTimeout(() => {
      syncState();
    }, 3000); // 3 second debounce to avoid write storms

    return () => clearTimeout(timer);
  }, [
    isLoaded,
    schools,
    teachers,
    students,
    parents,
    admins,
    attendance,
    marks,
    homework,
    notes,
    circulars,
    liveClasses,
    libraryBooks,
    hostels,
    // NOTE: transportRoutes intentionally excluded — the bus simulator changes it every 5s
    timetables,
    fees,
    tickerItems,
    schoolInfo,
    managementCommittee,
    exams,
    classes,
    sections,
    auditLogs,
    supportTickets,
    galleryItems,
    academicCalendar,
    academicPrograms,
    testimonials,
    enquiries,
    subjects,
    admissionBanner,
    admissions,
    facilities,
    homepageInfra,
    homepageStats,
    gradingProcess,
    gradingScheme,
    departments,
    galleryCategories,
    complaints,
    whatsappLogs,
    requiredDocuments,
    leaveRequests,
    starredFormFields,
    attendanceCalcConfig,
    superAdminPassword
  ]);

  // ═══ SYNC 3: Poll remote state updates from MongoDB Atlas every 6 seconds ═══
  useEffect(() => {
    if (!isLoaded) return;

    const pollState = async () => {
      if (isUpdatingFromDBRef.current) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/data`);
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data;

          if (data.updatedAt && data.updatedAt !== lastUpdatedAtRef.current) {
            console.log('🔄 Remote database changes detected, updating client states...');

            isUpdatingFromDBRef.current = true;
            lastUpdatedAtRef.current = data.updatedAt;

            const payload = buildPayload(data);
            lastSyncedPayloadRef.current = JSON.stringify(payload);

            applyDBData(data);

            setTimeout(() => {
              isUpdatingFromDBRef.current = false;
            }, 2000);
          }
        }
      } catch (err) {
        console.error('❌ Failed to poll state updates from MongoDB:', err);
      }
    };

    const interval = setInterval(pollState, 6000); // poll every 6 seconds
    return () => clearInterval(interval);
  }, [isLoaded]);

  // Recalculate attendance percentages on startup based on loaded attendance records
  useEffect(() => {
    if (students && attendance) {
      let updated = false;
      const newStudents = students.map(s => {
        const studentHistory = attendance.filter(h => h.studentId === s.id);
        if (studentHistory.length > 0) {
          const presents = studentHistory.filter(h => h.status === 'Present' || h.status === 'Half Day').length;
          const pct = parseFloat(((presents / studentHistory.length) * 100).toFixed(1));
          if (s.attendancePct !== pct) {
            updated = true;
            return { ...s, attendancePct: pct };
          }
        } else {
          if (s.attendancePct !== 0) {
            updated = true;
            return { ...s, attendancePct: 0 };
          }
        }
        return s;
      });
      if (updated) {
        setStudents(newStudents);
      }
    }
  }, [attendance, isLoaded]);

  // Auto-logout after 24 hours (1 day)
  useEffect(() => {
    if (isLoaded && currentUser && currentUser.role !== 'Guest' && currentUser.loginTimestamp) {
      const elapsed = Date.now() - currentUser.loginTimestamp;
      const oneDay = 24 * 60 * 60 * 1000;
      if (elapsed > oneDay) {
        console.log("Portal session has expired (exceeded 24 hours). Logging out.");
        logoutUser();
      }
    }
  }, [isLoaded, currentUser.loginTimestamp]);

  // Live account deactivation / deletion check
  useEffect(() => {
    if (!isLoaded || currentUser.role === 'Guest') return;

    let accountExists = true;

    if (currentUser.role === 'Student') {
      const match = students.find(s => s.id === currentUser.id);
      if (!match) accountExists = false; // permanently deleted
    } else if (currentUser.role === 'Teacher') {
      const match = teachers.find(t => t.id === currentUser.id);
      if (!match) accountExists = false; // deleted
    } else if (currentUser.role === 'Parent') {
      const match = parents.find(p => p.id === currentUser.id);
      if (!match) accountExists = false; // deleted
    } else if (currentUser.role === 'Admin') {
      const match = admins.find(a => a.id === currentUser.id);
      if (!match || match.status !== 'Active') accountExists = false; // deactivated or deleted
    }

    if (!accountExists) {
      console.log("Account has been removed or deactivated by administrator. Logging out.");
      logoutUser();
    }
  }, [students, teachers, parents, admins, currentUser.id, currentUser.role, isLoaded]);

  // Keep state synced to localStorage
  useEffect(() => {
    localStorage.setItem('school_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('school_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('school_admins', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem('school_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('school_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('school_sections', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('school_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('school_admission_banner', JSON.stringify(admissionBanner));
  }, [admissionBanner]);

  useEffect(() => {
    try {
      localStorage.setItem('school_teachers', JSON.stringify(teachers));
    } catch (e) {
      console.warn('LocalStorage quota exceeded for teachers. Photo data may be too large.', e);
    }
  }, [teachers]);

  useEffect(() => {
    try {
      localStorage.setItem('school_students', JSON.stringify(students));
    } catch (e) {
      console.warn('LocalStorage quota exceeded for students. Photo data may be too large.', e);
    }
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_parents', JSON.stringify(parents));
  }, [parents]);

  useEffect(() => {
    localStorage.setItem('school_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('school_marks', JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem('school_homework', JSON.stringify(homework));
  }, [homework]);

  useEffect(() => {
    localStorage.setItem('school_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('school_circulars', JSON.stringify(circulars));
  }, [circulars]);

  useEffect(() => {
    localStorage.setItem('school_live_classes', JSON.stringify(liveClasses));
  }, [liveClasses]);

  useEffect(() => {
    localStorage.setItem('school_library_books', JSON.stringify(libraryBooks));
  }, [libraryBooks]);

  useEffect(() => {
    localStorage.setItem('school_hostels', JSON.stringify(hostels));
  }, [hostels]);

  useEffect(() => {
    localStorage.setItem('school_transport_routes', JSON.stringify(transportRoutes));
  }, [transportRoutes]);

  useEffect(() => {
    localStorage.setItem('school_attendance_calc_config', JSON.stringify(attendanceCalcConfig));
  }, [attendanceCalcConfig]);

  useEffect(() => {
    localStorage.setItem('school_timetables', JSON.stringify(timetables));
  }, [timetables]);

  useEffect(() => {
    localStorage.setItem('school_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('school_ticker_items', JSON.stringify(tickerItems));
  }, [tickerItems]);

  useEffect(() => {
    localStorage.setItem('school_info', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem('school_management_committee', JSON.stringify(managementCommittee));
  }, [managementCommittee]);

  useEffect(() => {
    localStorage.setItem('school_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('school_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('school_gallery_items', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('school_academic_calendar', JSON.stringify(academicCalendar));
  }, [academicCalendar]);

  useEffect(() => {
    localStorage.setItem('school_academic_programs', JSON.stringify(academicPrograms));
  }, [academicPrograms]);

  useEffect(() => {
    localStorage.setItem('school_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('school_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('school_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => { localStorage.setItem('school_admissions', JSON.stringify(admissions)); }, [admissions]);
  useEffect(() => { localStorage.setItem('school_facilities', JSON.stringify(facilities)); }, [facilities]);
  useEffect(() => { localStorage.setItem('school_homepage_infra', JSON.stringify(homepageInfra)); }, [homepageInfra]);
  useEffect(() => { localStorage.setItem('school_homepage_stats', JSON.stringify(homepageStats)); }, [homepageStats]);
  useEffect(() => { localStorage.setItem('school_grading_process', JSON.stringify(gradingProcess)); }, [gradingProcess]);
  useEffect(() => { localStorage.setItem('school_grading_scheme', JSON.stringify(gradingScheme)); }, [gradingScheme]);
  useEffect(() => { localStorage.setItem('school_departments', JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem('school_gallery_categories', JSON.stringify(galleryCategories)); }, [galleryCategories]);
  useEffect(() => { localStorage.setItem('school_complaints', JSON.stringify(complaints)); }, [complaints]);
  useEffect(() => { localStorage.setItem('school_whatsapp_logs', JSON.stringify(whatsappLogs)); }, [whatsappLogs]);
  useEffect(() => { localStorage.setItem('school_required_documents', JSON.stringify(requiredDocuments)); }, [requiredDocuments]);
  useEffect(() => { localStorage.setItem('school_leave_requests', JSON.stringify(leaveRequests)); }, [leaveRequests]);
  useEffect(() => { localStorage.setItem('school_starred_form_fields', JSON.stringify(starredFormFields)); }, [starredFormFields]);
  useEffect(() => { localStorage.setItem('school_super_admin_password', JSON.stringify(superAdminPassword)); }, [superAdminPassword]);

  useEffect(() => {
    localStorage.setItem('school_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Simulating coordinates updating slightly every 5 seconds to simulate a live bus moving on the route map
  useEffect(() => {
    const interval = setInterval(() => {
      setTransportRoutes(prev => 
        prev.map(route => {
          const latShift = (Math.random() - 0.5) * 0.002;
          const lngShift = (Math.random() - 0.5) * 0.002;
          return {
            ...route,
            currentLoc: {
              lat: route.currentLoc.lat + latShift,
              lng: route.currentLoc.lng + lngShift
            }
          };
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const validateCredentials = (emailOrId, password, role) => {
    let name = '';
    let success = false;
    let userId = '';
    let resolvedRole = role;
    let email = '';

    const normalizedInput = emailOrId ? emailOrId.trim().toLowerCase() : '';

    // Direct override for Super Admin credentials to authenticate from any portal selection
    if (normalizedInput === 'nagaseshukumarbobbiti@gmail.com' && password === superAdminPassword) {
      name = 'Super Administrator';
      userId = 'SA001';
      success = true;
      resolvedRole = 'SuperAdmin';
      email = 'nagaseshukumarbobbiti@gmail.com';
    } else if (role === 'SuperAdmin') {
      if (normalizedInput === 'nagaseshukumarbobbiti@gmail.com' && password === superAdminPassword) {
        name = 'Super Administrator';
        userId = 'SA001';
        success = true;
        email = 'nagaseshukumarbobbiti@gmail.com';
      }
    } else if (role === 'Admin') {
      const match = admins.find(a => a.email && a.email.trim().toLowerCase() === normalizedInput && a.status === 'Active');
      const expectedPassword = (match && match.password) || 'admin123';
      if (match && password === expectedPassword) {
        name = match.name;
        userId = match.id;
        success = true;
        email = match.email;
      }
    } else if (role === 'Teacher') {
      const match = teachers.find(t => 
        (t.id && t.id.trim().toLowerCase() === normalizedInput) || 
        (t.email && t.email.trim().toLowerCase() === normalizedInput)
      );
      const expectedPassword = (match && match.password) || 'teacher123';
      if (match && password === expectedPassword) {
        name = match.name;
        userId = match.id;
        success = true;
        email = match.email || '';
      }
    } else if (role === 'Student') {
      const match = students.find(s => 
        (s.id && s.id.trim().toLowerCase() === normalizedInput) || 
        (s.registerNo && s.registerNo.trim().toLowerCase() === normalizedInput) || 
        (s.email && s.email.trim().toLowerCase() === normalizedInput)
      );
      const expectedPassword = (match && match.password) || 'student123';
      if (match && password === expectedPassword) {
        name = match.name;
        userId = match.id;
        success = true;
        email = match.email || '';
      }
    } else if (role === 'Parent') {
      const match = parents.find(p => 
        (p.id && p.id.trim().toLowerCase() === normalizedInput) || 
        (p.email && p.email.trim().toLowerCase() === normalizedInput)
      );
      const expectedPassword = (match && match.password) || 'parent123';
      if (match && password === expectedPassword) {
        name = match.name;
        userId = match.id;
        success = true;
        email = match.email || '';
      }
    }

    if (success) {
      return { success: true, user: { role: resolvedRole, name, id: userId, emailOrId: normalizedInput, email } };
    }
    return { success: false, message: 'Invalid credentials or matching record not found.' };
  };

  const loginWithUser = (userObj) => {
    const sessionUser = { ...userObj, loginTimestamp: Date.now() };
    setCurrentUser(sessionUser);
    addAuditLog(userObj.name, userObj.role, 'Successfully logged into portal');
    addNotification('Security Alert', `New login session established for ${userObj.name}`, 'Security');
    return { success: true };
  };

  const loginUser = (emailOrId, password, role) => {
    const res = validateCredentials(emailOrId, password, role);
    if (res.success) {
      return loginWithUser(res.user);
    }
    return res;
  };

  const updatePassword = (userId, role, newPassword) => {
    if (role === 'Student') {
      setStudents(prev => prev.map(s => s.id === userId ? { ...s, password: newPassword } : s));
      addAuditLog(currentUser.name || 'Student', 'Student', 'Updated login password');
      return { success: true };
    } else if (role === 'Teacher') {
      setTeachers(prev => prev.map(t => t.id === userId ? { ...t, password: newPassword } : t));
      addAuditLog(currentUser.name || 'Teacher', 'Teacher', 'Updated login password');
      return { success: true };
    } else if (role === 'Parent') {
      setParents(prev => prev.map(p => p.id === userId ? { ...p, password: newPassword } : p));
      addAuditLog(currentUser.name || 'Parent', 'Parent', 'Updated login password');
      return { success: true };
    } else if (role === 'Admin') {
      setAdmins(prev => prev.map(a => a.id === userId ? { ...a, password: newPassword } : a));
      addAuditLog(currentUser.name || 'Admin', 'Admin', 'Updated login password');
      return { success: true };
    } else if (role === 'SuperAdmin') {
      setSuperAdminPassword(newPassword);
      addAuditLog('Super Administrator', 'SuperAdmin', 'Updated Super Admin password');
      return { success: true };
    }
    return { success: false, message: 'Invalid role for password update.' };
  };

  const logoutUser = () => {
    addAuditLog(currentUser.name, currentUser.role, 'Logged out of portal');
    setCurrentUser({ role: 'Guest', name: 'Public Guest' });
  };

  const addAuditLog = (user, role, action) => {
    const newLog = {
      id: `al_${Date.now()}`,
      user,
      role,
      action,
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (title, message, type) => {
    const newNtf = {
      id: `ntf_${Date.now()}`,
      title,
      message,
      read: false,
      time: 'Just now',
      type
    };
    setNotifications(prev => [newNtf, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addStudent = (studentData) => {
    const cleanedReg = studentData.registerNo ? studentData.registerNo.trim() : '';
    const isDuplicate = students.some(s => s.registerNo && s.registerNo.trim().toUpperCase() === cleanedReg.toUpperCase());
    if (isDuplicate) {
      return { success: false, message: `Register Number "${studentData.registerNo}" already exists in database.` };
    }
    // Generate a collision-proof unique ID
    let nextNum = 1001;
    while (
      students.some(s => s.id === `S${nextNum}`) ||
      (marks || []).some(m => m.studentId === `S${nextNum}`) ||
      (leaveRequests || []).some(l => l.studentId === `S${nextNum}`) ||
      (complaints || []).some(c => c.studentId === `S${nextNum}`) ||
      (attendance || []).some(a => a.studentId === `S${nextNum}`)
    ) {
      nextNum++;
    }
    const newStudent = {
      ...studentData,
      registerNo: cleanedReg,
      email: studentData.email ? studentData.email.trim().toLowerCase() : '',
      id: `S${nextNum}`,
      attendancePct: 0,
      activeStatus: 'Active',
      schoolId: 'school-1'
    };
    setStudents(prev => [...prev, newStudent]);
    addAuditLog(currentUser.name, currentUser.role, `Created Student ${newStudent.name} (${newStudent.registerNo})`);
    addNotification('New Registration', `Student profile created for ${newStudent.name}`, 'Student');
    return { success: true, id: newStudent.id };
  };

  const editStudent = (id, updatedData) => {
    const cleanedData = { ...updatedData };
    if (cleanedData.registerNo) cleanedData.registerNo = cleanedData.registerNo.trim();
    if (cleanedData.email) cleanedData.email = cleanedData.email.trim().toLowerCase();
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...cleanedData } : s));
    addAuditLog(currentUser.name, currentUser.role, `Updated Student ID ${id}`);
  };

  const deleteStudent = (id) => {
    // Soft delete: mark as deleted but keep in system for marks-only access
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isDeleted: true, activeStatus: 'Deleted' } : s));
    // Clear personal data (leaves, complaints, attendance) but keep marks
    setLeaveRequests(prev => prev.filter(l => l.studentId !== id));
    setComplaints(prev => prev.filter(c => c.studentId !== id));
    setAttendance(prev => prev.filter(a => a.studentId !== id));
    addAuditLog(currentUser.name, currentUser.role, `Soft-deleted Student ID ${id} (marks preserved)`);
  };

  const permanentlyDeleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setLeaveRequests(prev => prev.filter(l => l.studentId !== id));
    setComplaints(prev => prev.filter(c => c.studentId !== id));
    setAttendance(prev => {
      const updated = prev.filter(a => a.studentId !== id);
      recalculateAllAttendance(updated, attendanceCalcConfig);
      return updated;
    });
    setMarks(prev => prev.filter(m => m.studentId !== id));
    addAuditLog(currentUser.name, currentUser.role, `Permanently Deleted Student ID ${id} and all associated records`);
  };

  const addParent = (parentData) => {
    const newParent = {
      ...parentData,
      email: parentData.email ? parentData.email.trim().toLowerCase() : '',
      id: `P${1001 + parents.length}`,
      schoolId: 'school-1'
    };
    setParents(prev => [...prev, newParent]);
    addAuditLog(currentUser.name, currentUser.role, `Created Parent ${newParent.name} (Linked to: ${newParent.childrenIds.join(', ')})`);
    addNotification('New Registration', `Parent profile created for ${newParent.name}`, 'Parent');
    return { success: true };
  };

  const editParent = (id, updatedData) => {
    const cleanedData = { ...updatedData };
    if (cleanedData.email) cleanedData.email = cleanedData.email.trim().toLowerCase();
    setParents(prev => prev.map(p => p.id === id ? { ...p, ...cleanedData } : p));
    addAuditLog(currentUser.name, currentUser.role, `Updated Parent ID ${id}`);
  };

  const deleteParent = (id) => {
    setParents(prev => prev.filter(p => p.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Removed Parent ID ${id}`);
  };

  const addTeacher = (teacherData) => {
    const cleanedId = teacherData.id ? teacherData.id.trim() : '';
    const isDuplicate = teachers.some(t => t.id && t.id.trim().toUpperCase() === cleanedId.toUpperCase());
    if (isDuplicate) {
      return { success: false, message: `Employee ID "${teacherData.id}" already exists in database.` };
    }
    const newTeacher = {
      ...teacherData,
      id: cleanedId,
      email: teacherData.email ? teacherData.email.trim().toLowerCase() : '',
      joiningDate: new Date().toISOString().split('T')[0],
      schoolId: 'school-1'
    };
    setTeachers(prev => [...prev, newTeacher]);
    addAuditLog(currentUser.name, currentUser.role, `Added Teacher ${newTeacher.name} (ID: ${newTeacher.id})`);
    return { success: true };
  };

  const editTeacher = (id, updatedData) => {
    const cleanedData = { ...updatedData };
    if (cleanedData.id) cleanedData.id = cleanedData.id.trim();
    if (cleanedData.email) cleanedData.email = cleanedData.email.trim().toLowerCase();
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...cleanedData } : t));
    addAuditLog(currentUser.name, currentUser.role, `Updated Teacher ID ${id}`);
  };

  const deleteTeacher = (id) => {
    const teacherToDelete = teachers.find(t => t.id === id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    if (teacherToDelete) {
      // Bidirectional sync: Also remove matching member from management committee
      setManagementCommittee(prev => prev.filter(m => m.name.toLowerCase() !== teacherToDelete.name.toLowerCase()));
    }
    addAuditLog(currentUser.name, currentUser.role, `Removed Teacher ID ${id}`);
  };

  const addAdmin = (adminData) => {
    const cleanedEmail = adminData.email ? adminData.email.trim().toLowerCase() : '';
    const isDuplicate = admins.some(a => a.email && a.email.trim().toLowerCase() === cleanedEmail);
    if (isDuplicate) {
      return { success: false, message: `Admin Email "${adminData.email}" already exists.` };
    }
    const maxNum = admins.reduce((max, a) => {
      const match = a.id ? a.id.match(/^ADM(\d+)$/) : null;
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const newAdmin = {
      ...adminData,
      email: cleanedEmail,
      id: `ADM${String(maxNum + 1).padStart(2, '0')}`,
      status: 'Active'
    };
    setAdmins(prev => [...prev, newAdmin]);
    addAuditLog(currentUser.name, currentUser.role, `Created Admin ${newAdmin.name} (${newAdmin.email})`);
    return { success: true };
  };

  const editAdmin = (id, updatedData) => {
    const cleanedData = { ...updatedData };
    if (cleanedData.email) {
      cleanedData.email = cleanedData.email.trim().toLowerCase();
    }
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, ...cleanedData } : a));
    addAuditLog(currentUser.name, currentUser.role, `Updated Admin ID ${id}`);
  };

  const deleteAdmin = (id) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted Admin ID ${id}`);
  };

  const createExam = (examData) => {
    const newExam = {
      id: `ex_${Date.now()}`,
      ...examData
    };
    setExams(prev => [...prev, newExam]);
    addAuditLog(currentUser.name, currentUser.role, `Created Exam: ${newExam.name}`);
    addNotification('Exam Created', `New Exam Scheduled: ${newExam.name} for ${newExam.class}`, 'Exam');
  };

  const deleteExam = (id) => {
    setExams(prev => prev.filter(e => e.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted Exam ID ${id}`);
  };

  const recalculateAllAttendance = (currentAttendance = attendance, config = attendanceCalcConfig) => {
    setStudents(prevStudents => prevStudents.map(student => {
      const studentHistory = currentAttendance.filter(h => h.studentId === student.id);
      if (studentHistory.length === 0) {
        return { ...student, attendancePct: 0 };
      }
      
      let presentCount = 0;
      let totalCount = 0;
      
      if (config.mode === 'session-based') {
        studentHistory.forEach(h => {
          if (h.status === 'Present') {
            presentCount += 1;
            totalCount += 1;
          } else if (h.status === 'Half Day') {
            presentCount += 0.5;
            totalCount += 1;
          } else if (h.status === 'Leave') {
            if (config.leaveExcused) {
              // Excused, not in denominator
            } else {
              totalCount += 1;
            }
          } else if (h.status === 'Absent') {
            totalCount += 1;
          }
        });
      } else {
        // mode === 'day-based'
        const dates = [...new Set(studentHistory.map(h => h.date))];
        dates.forEach(date => {
          const sessions = studentHistory.filter(h => h.date === date);
          const morning = sessions.find(s => s.session === 'Morning');
          const afternoon = sessions.find(s => s.session === 'Afternoon');
          
          let dayPoints = 0;
          let dayExcused = false;
          
          const getStatusWeight = (sess) => {
            if (!sess) return 1.0;
            if (sess.status === 'Present') return 1.0;
            if (sess.status === 'Half Day') return 0.5;
            if (sess.status === 'Leave') return config.leaveExcused ? 'excused' : 0.0;
            return 0.0;
          };
          
          const wM = morning ? getStatusWeight(morning) : null;
          const wA = afternoon ? getStatusWeight(afternoon) : null;
          
          if (wM === 'excused' && wA === 'excused') {
            dayExcused = true;
          } else if (wM === 'excused') {
            dayPoints = wA !== null ? wA : 1.0;
          } else if (wA === 'excused') {
            dayPoints = wM !== null ? wM : 1.0;
          } else {
            const mVal = wM !== null ? wM : 1.0;
            const aVal = wA !== null ? wA : 1.0;
            dayPoints = (mVal + aVal) / 2;
          }
          
          if (!dayExcused) {
            presentCount += dayPoints;
            totalCount += 1;
          }
        });
      }
      
      const pct = totalCount > 0 ? (presentCount / totalCount) * 100 : 100;
      const finalPct = Math.min(100, Math.max(0, pct));
      return { ...student, attendancePct: parseFloat(finalPct.toFixed(1)) };
    }));
  };

  const updateAttendanceCalcConfig = (newConfig) => {
    setAttendanceCalcConfig(newConfig);
    recalculateAllAttendance(attendance, newConfig);
    addAuditLog(currentUser.name, currentUser.role, 'Updated attendance calculation settings');
  };

  const markAttendance = (attendanceList) => {
    const listWithSession = attendanceList.map(rec => ({
      ...rec,
      session: rec.session || 'Morning'
    }));

    const currentAttendance = attendance || [];
    const updatedPrev = currentAttendance.map(oldRec => {
      const matchingNew = listWithSession.find(
        newRec => newRec.studentId === oldRec.studentId &&
                  newRec.date === oldRec.date &&
                  (newRec.session || 'Morning') === (oldRec.session || 'Morning')
      );
      return matchingNew ? { ...oldRec, ...matchingNew } : oldRec;
    });

    const trulyNew = listWithSession.filter(newRec => 
      !currentAttendance.some(oldRec => 
        oldRec.studentId === newRec.studentId && 
        oldRec.date === newRec.date && 
        (oldRec.session || 'Morning') === (newRec.session || 'Morning')
      )
    ).map((rec, idx) => ({
      id: `att_${Date.now()}_${idx}`,
      ...rec
    }));

    const finalAttendance = [...trulyNew, ...updatedPrev];
    setAttendance(finalAttendance);
    
    recalculateAllAttendance(finalAttendance, attendanceCalcConfig);

    listWithSession.forEach(rec => {
      const studentHistory = finalAttendance.filter(h => h.studentId === rec.studentId);
      const presents = studentHistory.filter(h => h.status === 'Present' || h.status === 'Half Day').length;
      const pct = studentHistory.length > 0 ? (presents / studentHistory.length) * 100 : 100;
      if (pct < (attendanceCalcConfig?.minRequired || 90) && rec.status !== 'Present') {
        const student = students.find(s => s.id === rec.studentId);
        if (student) {
          addNotification('Low Attendance Alert', `${student.name} attendance dropped to ${pct.toFixed(1)}%. Parent notified.`, 'AttendanceAlert');
        }
      }
    });

    addAuditLog(currentUser.name, currentUser.role, `Recorded attendance for ${attendanceList.length} students (${listWithSession[0]?.session || 'Morning'})`);
  };

  const deleteAttendanceRecord = (recordId) => {
    setAttendance(prev => {
      const updated = prev.filter(a => a.id !== recordId);
      recalculateAllAttendance(updated, attendanceCalcConfig);
      return updated;
    });
    addAuditLog(currentUser.name, currentUser.role, `Deleted attendance record ${recordId}`);
  };

  const uploadMarks = (marksList) => {
    const newMarks = marksList.map((m, idx) => ({
      id: `mrk_${Date.now()}_${idx}`,
      ...m
    }));
    setMarks(prev => [...prev, ...newMarks]);
    addAuditLog(currentUser.name, currentUser.role, `Uploaded test marks for ${marksList.length} students`);
    addNotification('Grades Published', `New marks have been published for examinations. Check report cards.`, 'Exam');
  };

  const createHomework = (hwData) => {
    const newHw = {
      id: `hw${1 + homework.length}`,
      submissions: [],
      ...hwData
    };
    setHomework(prev => [...prev, newHw]);
    addAuditLog(currentUser.name, currentUser.role, `Assigned Homework: ${newHw.title}`);
    addNotification('Homework Assigned', `New ${newHw.subject} Homework: ${newHw.title}`, 'Homework');
  };

  const submitHomework = (hwId, submissionData) => {
    setHomework(prev => prev.map(h => {
      if (h.id === hwId) {
        return {
          ...h,
          submissions: [
            ...h.submissions.filter(s => s.studentId !== submissionData.studentId),
            {
              ...submissionData,
              submittedAt: new Date().toLocaleString(),
              status: 'Submitted'
            }
          ]
        };
      }
      return h;
    }));
    addAuditLog(currentUser.name, currentUser.role, `Submitted assignment for homework ID ${hwId}`);
  };

  const evaluateHomework = (hwId, studentId, grade, feedback) => {
    setHomework(prev => prev.map(h => {
      if (h.id === hwId) {
        return {
          ...h,
          submissions: h.submissions.map(sub => 
            sub.studentId === studentId 
              ? { ...sub, status: 'Evaluated', grade, feedback } 
              : sub
          )
        };
      }
      return h;
    }));
    addAuditLog(currentUser.name, currentUser.role, `Graded Homework ID ${hwId} for Student ID ${studentId}`);
    addNotification('Assignment Graded', `Your homework submission for ${hwId} has been graded: ${grade}`, 'Homework');
  };

  const createNotes = (notesData) => {
    const newNote = {
      id: `n_${Date.now()}`,
      downloads: 0,
      ...notesData
    };
    setNotes(prev => [...prev, newNote]);
    addAuditLog(currentUser.name, currentUser.role, `Uploaded Study Notes: ${newNote.title}`);
    addNotification('Study Material Uploaded', `New Notes: ${newNote.title} for ${newNote.class}`, 'Notes');
  };

  const createCircular = (circData) => {
    const newCirc = {
      id: `c_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      postedBy: currentUser.name,
      ...circData
    };
    setCirculars(prev => [newCirc, ...prev]);
    addAuditLog(currentUser.name, currentUser.role, `Published Circular: ${newCirc.title}`);
    addNotification('Official Announcement', `New Notice: ${newCirc.title}`, 'Circular');
  };

  const deleteCircular = (id) => {
    setCirculars(prev => prev.filter(c => c.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted Circular ID ${id}`);
  };

  const deleteHomework = (id) => {
    setHomework(prev => prev.filter(h => h.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted Homework ID ${id}`);
  };

  const deleteNotes = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted Study Notes ID ${id}`);
  };

  const deleteLiveClass = (id) => {
    setLiveClasses(prev => prev.filter(lc => lc.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted Live Class ID ${id}`);
  };

  const createLiveClass = (classData) => {
    const newClass = {
      id: `lc_${Date.now()}`,
      teacherName: currentUser.name,
      status: 'Scheduled',
      ...classData
    };
    setLiveClasses(prev => [newClass, ...prev]);
    addAuditLog(currentUser.name, currentUser.role, `Scheduled Live Class for ${newClass.subject}`);
    addNotification('Live Class Scheduled', `${newClass.subject} class starts at ${newClass.startTime}`, 'LiveClass');
  };

  const createSupportTicket = (ticketData) => {
    const newTicket = {
      id: `tkt_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Open',
      response: '',
      ...ticketData
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    addNotification('Ticket Raised', `Support ticket #${newTicket.id} created successfully.`, 'Support');
  };

  const replySupportTicket = (id, responseText) => {
    setSupportTickets(prev => prev.map(t => 
      t.id === id 
        ? { ...t, response: responseText, status: 'Resolved' } 
        : t
    ));
    addNotification('Ticket Resolved', `Support Ticket #${id} has been resolved by Admin.`, 'Support');
  };

  const toggleSchoolStatus = (id) => {
    setSchools(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Suspended' : 'Active';
        addAuditLog(currentUser.name, currentUser.role, `Toggled status of school ${s.name} to ${nextStatus}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const saveTimetable = (className, sectionName, dayName, slotsArray) => {
    setTimetables(prev => {
      const filtered = prev.filter(t => !(t.class === className && (t.section || 'A') === sectionName && t.day === dayName));
      return [...filtered, { class: className, section: sectionName, day: dayName, slots: slotsArray }];
    });
    addAuditLog(currentUser.name, currentUser.role, `Updated Timetable for ${className} Section ${sectionName} on ${dayName}`);
  };

  const saveClassFee = (className, yearName, tuitionFeeVal, labFeeVal, busFeeVal, booksFeeVal) => {
    setFees(prev => {
      const filtered = prev.filter(f => !(f.class === className && f.year === yearName));
      return [...filtered, { 
        class: className, 
        year: yearName, 
        tuitionFee: parseFloat(tuitionFeeVal) || 0, 
        labFee: parseFloat(labFeeVal) || 0,
        busFee: parseFloat(busFeeVal) || 0,
        booksFee: parseFloat(booksFeeVal) || 0
      }];
    });
    addAuditLog(currentUser.name, currentUser.role, `Updated Fees structure for ${className} (${yearName})`);
  };

  const deleteClassFee = (className, yearName) => {
    setFees(prev => prev.filter(f => !(f.class === className && f.year === yearName)));
    addAuditLog(currentUser.name, currentUser.role, `Deleted Fees structure for ${className} (${yearName})`);
  };

  const addTickerItem = (item) => {
    const newItem = {
      id: `t_${Date.now()}`,
      time: 'Just now',
      ...item
    };
    setTickerItems(prev => [newItem, ...prev]);
    addAuditLog(currentUser.name, currentUser.role, `Added homepage ticker item: ${newItem.title}`);
  };

  const editTickerItem = (id, updated) => {
    setTickerItems(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
    addAuditLog(currentUser.name, currentUser.role, `Edited homepage ticker item ID: ${id}`);
  };

  const deleteTickerItem = (id) => {
    setTickerItems(prev => prev.filter(item => item.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted homepage ticker item ID: ${id}`);
  };

  const updateSchoolInfo = (updatedInfo) => {
    setSchoolInfo(prev => ({ ...prev, ...updatedInfo }));
    addAuditLog(currentUser.name, currentUser.role, 'Updated general school public configuration information');
  };

  const addCommitteeMember = (member) => {
    const newMember = {
      id: `cm_${Date.now()}`,
      ...member
    };
    setManagementCommittee(prev => [...prev, newMember]);
    addAuditLog(currentUser.name, currentUser.role, `Added management committee member: ${newMember.name}`);
  };

  const editCommitteeMember = (id, updated) => {
    setManagementCommittee(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
    addAuditLog(currentUser.name, currentUser.role, `Edited management committee member ID: ${id}`);
  };

  const deleteCommitteeMember = (id) => {
    const memberToDelete = managementCommittee.find(m => m.id === id);
    setManagementCommittee(prev => prev.filter(m => m.id !== id));
    if (memberToDelete) {
      // Bidirectional sync: Also remove matching teacher from teachers directory
      setTeachers(prev => prev.filter(t => t.name.toLowerCase() !== memberToDelete.name.toLowerCase()));
    }
    addAuditLog(currentUser.name, currentUser.role, `Deleted management committee member ID: ${id}`);
  };

  // ── Admission Management ──
  const submitAdmission = (data) => {
    const newAdmission = { id: `adm_${Date.now()}`, ...data, status: 'Pending', submittedAt: new Date().toLocaleString() };
    setAdmissions(prev => [newAdmission, ...prev]);
    addNotification('New Admission Application', `Online admission form received for ${data.studentName}`, 'Admission');
    addAuditLog('Public User', 'Guest', `Submitted admission form for ${data.studentName}`);
    return { success: true, id: newAdmission.id };
  };

  const approveAdmission = (id, updatedData = null) => {
    setAdmissions(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, ...(updatedData || {}), status: 'Approved', approvedAt: new Date().toLocaleString() };
      }
      return a;
    }));

    const baseAdmission = admissions.find(a => a.id === id);
    const admission = updatedData ? { ...baseAdmission, ...updatedData } : baseAdmission;

    if (admission) {
      const parentPhone = admission.whatsappNumber || admission.parentPhone || admission.phone || '';
      const whatsappMsg = { 
        id: `wa_${Date.now()}`, 
        phone: parentPhone, 
        message: `Dear ${admission.parentName}, your admission application for ${admission.studentName} to ${admission.grade || admission.gradeApplied} at Sri Vani Vidyanikethan has been APPROVED! Please visit the school with required documents to complete the enrollment. Welcome to our school family!`, 
        sentAt: new Date().toLocaleString(), 
        admissionId: id, 
        studentName: admission.studentName 
      };
      setWhatsappLogs(prev => [whatsappMsg, ...prev]);
      addNotification('Admission Approved', `Admission approved for ${admission.studentName}. WhatsApp notification sent to ${parentPhone}`, 'Admission');
      addAuditLog(currentUser.name, currentUser.role, `Approved admission for ${admission.studentName} & sent WhatsApp notification`);
    }
  };

  const rejectAdmission = (id, updatedData = null) => {
    setAdmissions(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, ...(updatedData || {}), status: 'Rejected', rejectedAt: new Date().toLocaleString() };
      }
      return a;
    }));

    const baseAdmission = admissions.find(a => a.id === id);
    const admission = updatedData ? { ...baseAdmission, ...updatedData } : baseAdmission;

    if (admission) {
      const parentPhone = admission.whatsappNumber || admission.parentPhone || admission.phone || '';
      const whatsappMsg = { 
        id: `wa_${Date.now()}`, 
        phone: parentPhone, 
        message: `Dear ${admission.parentName}, thank you for your interest in Sri Vani Vidyanikethan. We regret to inform you that your admission application for ${admission.studentName} has been declined. For any further queries, please contact the school administration office.`, 
        sentAt: new Date().toLocaleString(), 
        admissionId: id, 
        studentName: admission.studentName 
      };
      setWhatsappLogs(prev => [whatsappMsg, ...prev]);
      addNotification('Admission Rejected', `Admission declined for ${admission.studentName}. WhatsApp notification sent to ${parentPhone}`, 'Admission');
      addAuditLog(currentUser.name, currentUser.role, `Rejected admission for ${admission.studentName} & sent WhatsApp notification`);
    }
  };

  const updateAdmissionFields = (id, updatedData) => {
    setAdmissions(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
    addAuditLog(currentUser.name, currentUser.role, `Updated admission application details for ID: ${id}`);
  };

  const toggleAdmissionFieldStar = (id, fieldName) => {
    setAdmissions(prev => prev.map(a => {
      if (a.id === id) {
        const starred = { ...(a.starredFields || {}) };
        starred[fieldName] = !starred[fieldName];
        return { ...a, starredFields: starred };
      }
      return a;
    }));
  };

  const updateStarredFormFields = (fields) => {
    setStarredFormFields(fields);
    addAuditLog(currentUser.name, currentUser.role, `Updated online form highlights settings`);
  };

  const deleteAdmission = (id) => {
    setAdmissions(prev => prev.filter(a => a.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted admission application ID: ${id}`);
  };

  const deleteWhatsappLog = (id) => {
    setWhatsappLogs(prev => prev.filter(log => log.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted WhatsApp notification log ID: ${id}`);
  };

  const clearAllWhatsappLogs = () => {
    setWhatsappLogs([]);
    addAuditLog(currentUser.name, currentUser.role, `Cleared all WhatsApp notification logs`);
  };

  // ── Student Leave Management ──
  const submitLeaveRequest = (studentId, studentName, studentClass, studentSection, data) => {
    const newRequest = {
      id: `leave_${Date.now()}`,
      studentId,
      studentName,
      class: studentClass,
      section: studentSection,
      ...data,
      status: 'Pending',
      adminMessage: '',
      submittedAt: new Date().toLocaleString()
    };
    setLeaveRequests(prev => [newRequest, ...prev]);
    addNotification('New Leave Application', `Student ${studentName} applied for leave: ${data.leaveType}`, 'Leave');
    addAuditLog(studentName, 'Student', `Submitted leave request: ${data.leaveType} from ${data.startDate} to ${data.endDate}`);
  };

  const updateLeaveStatus = (id, status, adminMessage) => {
    const request = leaveRequests.find(r => r.id === id);
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status, adminMessage } : r));
    if (request) {
      addNotification('Leave Request Updated', `Leave request for ${request.studentName} has been ${status}`, 'Leave');
      addAuditLog(currentUser.name, currentUser.role, `Updated leave request status for ${request.studentName} to ${status}`);
    }
  };

  const deleteLeaveRequest = (id) => {
    setLeaveRequests(prev => prev.filter(r => r.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted leave request ID ${id}`);
  };

  // ── Facilities Management ──
  const addFacility = (f) => { const nf = { ...f, id: `fac_${Date.now()}` }; setFacilities(prev => [...prev, nf]); addAuditLog(currentUser.name, currentUser.role, `Added facility: ${nf.title}`); };
  const editFacility = (id, u) => { setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...u } : f)); addAuditLog(currentUser.name, currentUser.role, `Edited facility ID: ${id}`); };
  const deleteFacility = (id) => { setFacilities(prev => prev.filter(f => f.id !== id)); addAuditLog(currentUser.name, currentUser.role, `Deleted facility ID: ${id}`); };

  // ── Homepage Management ──
  const updateInfraItem = (id, u) => { setHomepageInfra(prev => prev.map(item => item.id === id ? { ...item, ...u } : item)); addAuditLog(currentUser.name, currentUser.role, `Updated homepage infra item: ${id}`); };
  const addInfraItem = (item) => { const newItem = { id: `infra_${Date.now()}`, ...item }; setHomepageInfra(prev => [...prev, newItem]); addAuditLog(currentUser.name, currentUser.role, `Added homepage infra item: ${newItem.title}`); };
  const deleteInfraItem = (id) => { setHomepageInfra(prev => prev.filter(item => item.id !== id)); addAuditLog(currentUser.name, currentUser.role, `Deleted homepage infra item: ${id}`); };
  const updateHomepageStat = (id, u) => { setHomepageStats(prev => prev.map(s => s.id === id ? { ...s, ...u } : s)); addAuditLog(currentUser.name, currentUser.role, `Updated homepage stat: ${id}`); };
  const addHomepageStat = (stat) => { const newStat = { id: `stat_${Date.now()}`, icon: '🏆', ...stat }; setHomepageStats(prev => [...prev, newStat]); addAuditLog(currentUser.name, currentUser.role, `Added homepage stat: ${newStat.label}`); };
  const deleteHomepageStat = (id) => { setHomepageStats(prev => prev.filter(s => s.id !== id)); addAuditLog(currentUser.name, currentUser.role, `Deleted homepage stat ID: ${id}`); };

  // ── Grading Management ──
  const updateGradingProcess = (title, description) => { setGradingProcess({ title, description }); addAuditLog(currentUser.name, currentUser.role, 'Updated grading process'); };
  const updateGradingScheme = (scheme) => { setGradingScheme(scheme); addAuditLog(currentUser.name, currentUser.role, 'Updated grading scheme'); };

  // ── Department Management ──
  const addDepartment = (name) => { setDepartments(prev => [...prev, name]); addAuditLog(currentUser.name, currentUser.role, `Added department: ${name}`); };
  const editDepartment = (oldName, newName) => { setDepartments(prev => prev.map(d => d === oldName ? newName : d)); setSubjects(prev => prev.map(s => s.department === oldName ? { ...s, department: newName } : s)); addAuditLog(currentUser.name, currentUser.role, `Renamed department: ${oldName} to ${newName}`); };
  const deleteDepartment = (name) => { setDepartments(prev => prev.filter(d => d !== name)); addAuditLog(currentUser.name, currentUser.role, `Deleted department: ${name}`); };

  // ── Gallery Category Management ──
  const addGalleryCategory = (name) => { setGalleryCategories(prev => [...prev, name]); addAuditLog(currentUser.name, currentUser.role, `Added gallery category: ${name}`); };
  const editGalleryCategory = (oldName, newName) => { setGalleryCategories(prev => prev.map(c => c === oldName ? newName : c)); setGalleryItems(prev => prev.map(g => g.category === oldName ? { ...g, category: newName } : g)); addAuditLog(currentUser.name, currentUser.role, `Renamed gallery category: ${oldName} to ${newName}`); };
  const deleteGalleryCategory = (name) => { setGalleryCategories(prev => prev.filter(c => c !== name)); addAuditLog(currentUser.name, currentUser.role, `Deleted gallery category: ${name}`); };

  // ── Complaint / Grievance Management ──
  const submitComplaint = (studentId, subject, description) => {
    const student = students.find(s => s.id === studentId);
    const nc = { id: `cmp_${Date.now()}`, studentId, studentName: student?.name || 'Unknown', studentClass: student?.class || '', studentSection: student?.section || '', registerNo: student?.registerNo || '', studentPhone: student?.phone || '', studentEmail: student?.email || '', subject, description, status: 'Pending', reply: '', submittedAt: new Date().toLocaleString(), updatedAt: '' };
    setComplaints(prev => [nc, ...prev]);
    addNotification('Student Complaint', `New complaint from ${student?.name}: ${subject}`, 'Complaint');
    addAuditLog(student?.name || 'Student', 'Student', `Filed complaint: ${subject}`);
    return { success: true };
  };

  const updateComplaintStatus = (id, status, reply) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, reply: reply || c.reply, updatedAt: new Date().toLocaleString() } : c));
    const complaint = complaints.find(c => c.id === id);
    addNotification('Complaint Updated', `Complaint from ${complaint?.studentName} marked as ${status}`, 'Complaint');
    addAuditLog(currentUser.name, currentUser.role, `Updated complaint ${id} status to ${status}`);
  };

  const deleteComplaint = (id) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted complaint ID ${id}`);
  };

  // ── Required Documents Management ──
  const updateRequiredDocuments = (docList) => { setRequiredDocuments(docList); addAuditLog(currentUser.name, currentUser.role, 'Updated required admission documents'); };

  return (
    <AppContext.Provider value={{
      isLoaded,
      currentUser,
      loginUser,
      validateCredentials,
      loginWithUser,
      logoutUser,
      updatePassword,
      schools,
      teachers,
      students,
      parents,
      admins,
      exams,
      classes,
      setClasses,
      sections,
      setSections,
      attendance,
      marks,
      homework,
      notes,
      circulars,
      liveClasses,
      timetables,
      saveTimetable,
      fees,
      saveClassFee,
      deleteClassFee,
      tickerItems,
      addTickerItem,
      editTickerItem,
      deleteTickerItem,
      schoolInfo,
      updateSchoolInfo,
      managementCommittee,
      addCommitteeMember,
      editCommitteeMember,
      deleteCommitteeMember,
      libraryBooks,
      hostels,
      transportRoutes,
      auditLogs,
      supportTickets,
      notifications,
      theme,
      setTheme,
      markNotificationRead,
      addStudent,
      editStudent,
      deleteStudent,
      permanentlyDeleteStudent,
      addTeacher,
      editTeacher,
      deleteTeacher,
      addParent,
      editParent,
      deleteParent,
      addAdmin,
      editAdmin,
      deleteAdmin,
      createExam,
      deleteExam,
      markAttendance,
      uploadMarks,
      createHomework,
      submitHomework,
      evaluateHomework,
      deleteHomework,
      createNotes,
      deleteNotes,
      createCircular,
      deleteCircular,
      createLiveClass,
      deleteLiveClass,
      createSupportTicket,
      replySupportTicket,
      toggleSchoolStatus,
      addAuditLog,
      addNotification,
      galleryItems,
      addGalleryItem: (item) => setGalleryItems(prev => [{ ...item, id: 'g' + Date.now() }, ...prev]),
      editGalleryItem: (id, updates) => setGalleryItems(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g)),
      deleteGalleryItem: (id) => setGalleryItems(prev => prev.filter(g => g.id !== id)),
      academicCalendar,
      addCalendarEvent: (ev) => setAcademicCalendar(prev => [...prev, { ...ev, id: 'cal' + Date.now() }]),
      editCalendarEvent: (id, updates) => setAcademicCalendar(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e)),
      deleteCalendarEvent: (id) => setAcademicCalendar(prev => prev.filter(e => e.id !== id)),
      academicPrograms,
      addAcademicProgram: (p) => setAcademicPrograms(prev => [...prev, { ...p, id: 'prog' + Date.now() }]),
      editAcademicProgram: (id, updates) => setAcademicPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p)),
      deleteAcademicProgram: (id) => setAcademicPrograms(prev => prev.filter(p => p.id !== id)),
      testimonials,
      addTestimonial: (t) => setTestimonials(prev => [...prev, { ...t, id: 'tmn' + Date.now(), active: true }]),
      editTestimonial: (id, updates) => setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)),
      deleteTestimonial: (id) => setTestimonials(prev => prev.filter(t => t.id !== id)),
      toggleTestimonial: (id) => setTestimonials(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t)),
      enquiries,
      submitEnquiry: (enq) => setEnquiries(prev => [{ ...enq, id: 'enq' + Date.now(), date: new Date().toLocaleDateString('en-IN'), status: 'New' }, ...prev]),
      markEnquiryContacted: (id) => setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'Contacted' } : e)),
      deleteEnquiry: (id) => setEnquiries(prev => prev.filter(e => e.id !== id)),
      subjects,
      addSubject: (s) => setSubjects(prev => [...prev, { ...s, id: 'sub' + Date.now() }]),
      editSubject: (id, updates) => setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s)),
      deleteSubject: (id) => setSubjects(prev => prev.filter(s => s.id !== id)),
      admissionBanner,
      updateAdmissionBanner: (updates) => setAdmissionBanner(prev => ({ ...prev, ...updates })),
      admissions, submitAdmission, approveAdmission, rejectAdmission,
      facilities, addFacility, editFacility, deleteFacility,
      homepageInfra, updateInfraItem, addInfraItem, deleteInfraItem,
      homepageStats, updateHomepageStat, addHomepageStat, deleteHomepageStat,
      gradingProcess, updateGradingProcess,
      gradingScheme, updateGradingScheme,
      departments, addDepartment, editDepartment, deleteDepartment,
      galleryCategories, addGalleryCategory, editGalleryCategory, deleteGalleryCategory,
      complaints, submitComplaint, updateComplaintStatus, deleteComplaint,
      whatsappLogs, deleteAdmission, deleteWhatsappLog, clearAllWhatsappLogs,
      requiredDocuments, updateRequiredDocuments,
      leaveRequests, submitLeaveRequest, updateLeaveStatus, deleteLeaveRequest,
      starredFormFields, updateStarredFormFields, updateAdmissionFields, toggleAdmissionFieldStar,
      attendanceCalcConfig, updateAttendanceCalcConfig, recalculateAllAttendance, deleteAttendanceRecord,
    }}>

      {children}
    </AppContext.Provider>
  );
};
