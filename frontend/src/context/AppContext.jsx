import React, { createContext, useState, useEffect } from 'react';

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

const initialHomepageInfra = [];

const initialHomepageStats = [];

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

const DATA_VERSION = '5';

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
    return readStoredValue('school_management_committee', [
      { id: 'm1', name: 'K Dasaratha Rami Reddy', role: 'Principal & Director', qual: 'M.Ed / M.Sc, Educational Leadership', photo: '/principal.jpg' }
    ]);
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

  const [notifications, setNotifications] = useState([]);

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('school_theme') || 'light';
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state from API on load
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/data`);
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data;
          if (data.schools) setSchools(data.schools);
          if (data.teachers) setTeachers(data.teachers);
          if (data.students) setStudents(data.students);
          if (data.parents) setParents(data.parents);
          if (data.admins) setAdmins(data.admins);
          if (data.attendance) setAttendance(data.attendance);
          if (data.marks) setMarks(data.marks);
          if (data.homework) setHomework(data.homework);
          if (data.notes) setNotes(data.notes);
          if (data.circulars) setCirculars(data.circulars);
          if (data.liveClasses) setLiveClasses(data.liveClasses);
          if (data.libraryBooks) setLibraryBooks(data.libraryBooks);
          if (data.hostels) setHostels(data.hostels);
          if (data.transportRoutes) setTransportRoutes(data.transportRoutes);
          if (data.timetables) setTimetables(data.timetables);
          if (data.fees) setFees(data.fees);
          if (data.tickerItems) setTickerItems(data.tickerItems);
          if (data.schoolInfo) setSchoolInfo(data.schoolInfo);
          if (data.managementCommittee) setManagementCommittee(data.managementCommittee);
          if (data.exams) setExams(data.exams);
          if (data.classes) setClasses(data.classes);
          if (data.sections) setSections(data.sections);
          if (data.auditLogs) setAuditLogs(data.auditLogs);
          if (data.supportTickets) setSupportTickets(data.supportTickets);
          if (data.galleryItems) setGalleryItems(data.galleryItems);
          if (data.academicCalendar) setAcademicCalendar(data.academicCalendar);
          if (data.academicPrograms) setAcademicPrograms(data.academicPrograms);
          if (data.testimonials) setTestimonials(data.testimonials);
          if (data.enquiries) setEnquiries(data.enquiries);
          if (data.subjects) setSubjects(data.subjects);
          if (data.admissionBanner) setAdmissionBanner(data.admissionBanner);
          if (data.admissions) setAdmissions(data.admissions);
          if (data.facilities) setFacilities(data.facilities);
          if (data.homepageInfra) setHomepageInfra(data.homepageInfra);
          if (data.homepageStats) setHomepageStats(data.homepageStats);
          if (data.gradingProcess) setGradingProcess(data.gradingProcess);
          if (data.gradingScheme) setGradingScheme(data.gradingScheme);
          if (data.departments) setDepartments(data.departments);
          if (data.galleryCategories) setGalleryCategories(data.galleryCategories);
          if (data.complaints) setComplaints(data.complaints);
          if (data.whatsappLogs) setWhatsappLogs(data.whatsappLogs);
          if (data.requiredDocuments) setRequiredDocuments(data.requiredDocuments);
          if (data.leaveRequests) setLeaveRequests(data.leaveRequests);
          if (data.starredFormFields) setStarredFormFields(data.starredFormFields);
          console.log('✅ Loaded application state from MongoDB Atlas');
        } else {
          console.log('ℹ️ MongoDB Atlas state empty or first-time load. Initializing state from localStorage.');
        }
      } catch (err) {
        console.error('❌ Failed to load state from MongoDB, using localStorage fallback:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchState();
  }, []);

  // Sync state to API (debounced)
  useEffect(() => {
    if (!isLoaded) return;

    const syncState = async () => {
      try {
        const payload = {
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
          starredFormFields
        };

        const res = await fetch(`${API_BASE_URL}/api/data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!json.success) {
          console.error('❌ Failed to save state to MongoDB Atlas:', json.error);
        }
      } catch (err) {
        console.error('❌ Failed to sync state to MongoDB Atlas:', err);
      }
    };

    const timer = setTimeout(() => {
      syncState();
    }, 2000); // 2 second debounce

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
    starredFormFields
  ]);

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
    localStorage.setItem('school_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
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

  const loginUser = (emailOrId, password, role) => {
    let name = '';
    let success = false;
    let userId = '';
    let resolvedRole = role;

    // Direct override for Super Admin credentials to authenticate from any portal selection
    if (emailOrId === 'nagaseshukumarbobbiti@gmail.com' && password === 'seshu@2409') {
      name = 'Super Administrator';
      userId = 'SA001';
      success = true;
      resolvedRole = 'SuperAdmin';
    } else if (role === 'SuperAdmin') {
      if (emailOrId === 'nagaseshukumarbobbiti@gmail.com' && password === 'seshu@2409') {
        name = 'Super Administrator';
        userId = 'SA001';
        success = true;
      }
    } else if (role === 'Admin') {
      const match = admins.find(a => a.email === emailOrId && a.status === 'Active');
      const expectedPassword = (match && match.password) || 'admin123';
      if (match && password === expectedPassword) {
        name = match.name;
        userId = match.id;
        success = true;
      }
    } else if (role === 'Teacher') {
      const match = teachers.find(t => t.id === emailOrId || t.email === emailOrId);
      const expectedPassword = (match && match.password) || 'teacher123';
      if (match && password === expectedPassword) {
        name = match.name;
        userId = match.id;
        success = true;
      }
    } else if (role === 'Student') {
      const match = students.find(s => s.id === emailOrId || s.registerNo === emailOrId || s.email === emailOrId);
      const expectedPassword = (match && match.password) || 'student123';
      if (match && password === expectedPassword) {
        name = match.name;
        userId = match.id;
        success = true;
      }
    } else if (role === 'Parent') {
      const match = parents.find(p => p.id === emailOrId || p.email === emailOrId);
      const expectedPassword = (match && match.password) || 'parent123';
      if (match && password === expectedPassword) {
        name = match.name;
        userId = match.id;
        success = true;
      }
    }

    if (success) {
      const userObj = { role: resolvedRole, name, id: userId, emailOrId };
      setCurrentUser(userObj);
      addAuditLog(name, resolvedRole, 'Successfully logged into portal');
      addNotification('Security Alert', `New login session established for ${name}`, 'Security');
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials or matching record not found.' };
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
    const isDuplicate = students.some(s => s.registerNo.trim().toUpperCase() === studentData.registerNo.trim().toUpperCase());
    if (isDuplicate) {
      return { success: false, message: `Register Number "${studentData.registerNo}" already exists in database.` };
    }
    const newStudent = {
      ...studentData,
      id: `S${1001 + students.length}`,
      attendancePct: 100.0,
      activeStatus: 'Active',
      schoolId: 'school-1'
    };
    setStudents(prev => [...prev, newStudent]);
    addAuditLog(currentUser.name, currentUser.role, `Created Student ${newStudent.name} (${newStudent.registerNo})`);
    addNotification('New Registration', `Student profile created for ${newStudent.name}`, 'Student');
    return { success: true, id: newStudent.id };
  };

  const editStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
    addAuditLog(currentUser.name, currentUser.role, `Updated Student ID ${id}`);
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted Student ID ${id}`);
  };

  const addParent = (parentData) => {
    const newParent = {
      ...parentData,
      id: `P${1001 + parents.length}`,
      schoolId: 'school-1'
    };
    setParents(prev => [...prev, newParent]);
    addAuditLog(currentUser.name, currentUser.role, `Created Parent ${newParent.name} (Linked to: ${newParent.childrenIds.join(', ')})`);
    addNotification('New Registration', `Parent profile created for ${newParent.name}`, 'Parent');
    return { success: true };
  };

  const editParent = (id, updatedData) => {
    setParents(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    addAuditLog(currentUser.name, currentUser.role, `Updated Parent ID ${id}`);
  };

  const deleteParent = (id) => {
    setParents(prev => prev.filter(p => p.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Removed Parent ID ${id}`);
  };

  const addTeacher = (teacherData) => {
    const isDuplicate = teachers.some(t => t.id.trim().toUpperCase() === teacherData.id.trim().toUpperCase());
    if (isDuplicate) {
      return { success: false, message: `Employee ID "${teacherData.id}" already exists in database.` };
    }
    const newTeacher = {
      ...teacherData,
      joiningDate: new Date().toISOString().split('T')[0],
      schoolId: 'school-1'
    };
    setTeachers(prev => [...prev, newTeacher]);
    addAuditLog(currentUser.name, currentUser.role, `Added Teacher ${newTeacher.name} (ID: ${newTeacher.id})`);
    return { success: true };
  };

  const editTeacher = (id, updatedData) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
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
    const isDuplicate = admins.some(a => a.email.trim().toLowerCase() === adminData.email.trim().toLowerCase());
    if (isDuplicate) {
      return { success: false, message: `Admin Email "${adminData.email}" already exists.` };
    }
    const newAdmin = {
      ...adminData,
      id: `ADM${String(admins.length + 1).padStart(2, '0')}`,
      status: 'Active'
    };
    setAdmins(prev => [...prev, newAdmin]);
    addAuditLog(currentUser.name, currentUser.role, `Created Admin ${newAdmin.name} (${newAdmin.email})`);
    return { success: true };
  };

  const editAdmin = (id, updatedData) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
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

  const markAttendance = (attendanceList) => {
    // attendanceList is array of { studentId, date, status, class, section }
    const newRecords = attendanceList.map((rec, idx) => ({
      id: `att_${Date.now()}_${idx}`,
      ...rec
    }));
    setAttendance(prev => [...newRecords, ...prev]);

    // Update students average attendance percentage
    attendanceList.forEach(rec => {
      const studentHistory = [...attendance, ...newRecords].filter(h => h.studentId === rec.studentId);
      const presents = studentHistory.filter(h => h.status === 'Present' || h.status === 'Half Day').length;
      const pct = studentHistory.length > 0 ? (presents / studentHistory.length) * 100 : 100;

      setStudents(prev => prev.map(s => s.id === rec.studentId ? { ...s, attendancePct: parseFloat(pct.toFixed(1)) } : s));

      // Trigger low attendance alert
      if (pct < 90 && rec.status !== 'Present') {
        const student = students.find(s => s.id === rec.studentId);
        if (student) {
          addNotification('Low Attendance Alert', `${student.name} attendance dropped to ${pct.toFixed(1)}%. Parent notified.`, 'AttendanceAlert');
        }
      }
    });

    addAuditLog(currentUser.name, currentUser.role, `Recorded attendance for ${attendanceList.length} students`);
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

  const saveTimetable = (className, dayName, slotsArray) => {
    setTimetables(prev => {
      const filtered = prev.filter(t => !(t.class === className && t.day === dayName));
      return [...filtered, { class: className, day: dayName, slots: slotsArray }];
    });
    addAuditLog(currentUser.name, currentUser.role, `Updated Timetable for ${className} on ${dayName}`);
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

  const approveAdmission = (id) => {
    const admission = admissions.find(a => a.id === id);
    setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved', approvedAt: new Date().toLocaleString() } : a));
    if (admission) {
      const whatsappMsg = { id: `wa_${Date.now()}`, phone: admission.whatsappNumber || admission.parentPhone, message: `Dear ${admission.parentName}, your admission application for ${admission.studentName} to ${admission.grade} at Sri Vani Vidyanikethan has been APPROVED! Please visit the school with required documents to complete the enrollment. Welcome to our school family!`, sentAt: new Date().toLocaleString(), admissionId: id, studentName: admission.studentName };
      setWhatsappLogs(prev => [whatsappMsg, ...prev]);
      addNotification('Admission Approved', `Admission approved for ${admission.studentName}. WhatsApp notification sent to ${whatsappMsg.phone}`, 'Admission');
      addAuditLog(currentUser.name, currentUser.role, `Approved admission for ${admission.studentName} & sent WhatsApp notification`);
    }
  };

  const rejectAdmission = (id) => {
    const admission = admissions.find(a => a.id === id);
    setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected', rejectedAt: new Date().toLocaleString() } : a));
    if (admission) addAuditLog(currentUser.name, currentUser.role, `Rejected admission for ${admission.studentName}`);
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

  // ── Facilities Management ──
  const addFacility = (f) => { const nf = { ...f, id: `fac_${Date.now()}` }; setFacilities(prev => [...prev, nf]); addAuditLog(currentUser.name, currentUser.role, `Added facility: ${nf.title}`); };
  const editFacility = (id, u) => { setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...u } : f)); addAuditLog(currentUser.name, currentUser.role, `Edited facility ID: ${id}`); };
  const deleteFacility = (id) => { setFacilities(prev => prev.filter(f => f.id !== id)); addAuditLog(currentUser.name, currentUser.role, `Deleted facility ID: ${id}`); };

  // ── Homepage Management ──
  const updateInfraItem = (id, u) => { setHomepageInfra(prev => prev.map(item => item.id === id ? { ...item, ...u } : item)); addAuditLog(currentUser.name, currentUser.role, `Updated homepage infra item: ${id}`); };
  const updateHomepageStat = (id, u) => { setHomepageStats(prev => prev.map(s => s.id === id ? { ...s, ...u } : s)); addAuditLog(currentUser.name, currentUser.role, `Updated homepage stat: ${id}`); };

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

  // ── Required Documents Management ──
  const updateRequiredDocuments = (docList) => { setRequiredDocuments(docList); addAuditLog(currentUser.name, currentUser.role, 'Updated required admission documents'); };

  return (
    <AppContext.Provider value={{
      isLoaded,
      currentUser,
      loginUser,
      logoutUser,
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
      createNotes,
      createCircular,
      createLiveClass,
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
      homepageInfra, updateInfraItem,
      homepageStats, updateHomepageStat,
      gradingProcess, updateGradingProcess,
      gradingScheme, updateGradingScheme,
      departments, addDepartment, editDepartment, deleteDepartment,
      galleryCategories, addGalleryCategory, editGalleryCategory, deleteGalleryCategory,
      complaints, submitComplaint, updateComplaintStatus,
      whatsappLogs,
      requiredDocuments, updateRequiredDocuments,
      leaveRequests, submitLeaveRequest, updateLeaveStatus,
      starredFormFields, updateStarredFormFields, updateAdmissionFields, toggleAdmissionFieldStar,
    }}>

      {children}
    </AppContext.Provider>
  );
};
