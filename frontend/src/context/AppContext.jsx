import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialSchools = [
  { id: 'school-1', name: 'SRI VANI VIDYANIKETHAN EM SCHOOL (Main Campus)', code: 'SVV-MAIN', address: '3-89, Pedda Kottala St, Pedda Kottala, Kottala, Andhra Pradesh 518502', studentsCount: 950, teachersCount: 55, status: 'Active' },
  { id: 'school-2', name: 'SRI VANI VIDYANIKETHAN EM SCHOOL (City Branch)', code: 'SVV-CITY', address: 'Main Bazar, Vijayawada, AP, India', studentsCount: 680, teachersCount: 40, status: 'Active' }
];

const initialTeachers = [
  { id: 'T101', name: 'Dr. David Banner', qualification: 'Ph.D. in Physics', experience: '12 Years', subject: 'PHYSICS', department: 'Science', email: 'dbanner@srivani.edu', phone: '+91 98765-43210', designation: 'Head of Department', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', salary: 6500, joiningDate: '2018-08-15', schoolId: 'school-1' },
  { id: 'T102', name: 'Prof. Clara Oswald', qualification: 'M.A. in English Literature', experience: '8 Years', subject: 'ENGLISH', department: 'Humanities', email: 'coswald@srivani.edu', phone: '+91 98765-43211', designation: 'Senior Teacher', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', salary: 5200, joiningDate: '2020-09-01', schoolId: 'school-1' },
  { id: 'T103', name: 'Mr. Frank Castle', qualification: 'M.Sc. in Mathematics', experience: '15 Years', subject: 'MATHEMATICS', department: 'Mathematics', email: 'fcastle@srivani.edu', phone: '+91 98765-43212', designation: 'Senior Instructor', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', salary: 6800, joiningDate: '2015-01-10', schoolId: 'school-1' },
  { id: 'T104', name: 'Ms. Grace Hopper', qualification: 'Ph.D. in Computer Science', experience: '10 Years', subject: 'GENERALKNOWLEDGE', department: 'Information Technology', email: 'ghopper@srivani.edu', phone: '+91 98765-43213', designation: 'IT Director', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', salary: 7100, joiningDate: '2017-06-20', schoolId: 'school-1' }
];

const initialStudents = [
  { id: 'S1001', registerNo: 'REG20261001', rollNo: '101', name: 'Alice Johnson', dob: '2010-04-12', gender: 'Female', bloodGroup: 'O+', aadhaarNo: '1234-5678-9012', address: 'Pedda Kottala, Kottala, AP', phone: '+91 98765-43220', email: 'alice.j@srivani.edu', class: 'Class 10', section: 'A', parentId: 'P1001', parentName: 'Robert Johnson', parentPhone: '+91 98765-43230', emergencyContact: '+91 98765-99999', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', attendancePct: 94.5, activeStatus: 'Active', schoolId: 'school-1' },
  { id: 'S1002', registerNo: 'REG20261002', rollNo: '102', name: 'Bob Smith', dob: '2010-09-21', gender: 'Male', bloodGroup: 'A+', aadhaarNo: '9876-5432-1098', address: 'Pedda Kottala, Kottala, AP', phone: '+91 98765-43221', email: 'bob.s@srivani.edu', class: 'Class 10', section: 'A', parentId: 'P1002', parentName: 'Sarah Smith', parentPhone: '+91 98765-43231', emergencyContact: '+91 98765-88888', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', attendancePct: 88.0, activeStatus: 'Active', schoolId: 'school-1' },
  { id: 'S1003', registerNo: 'REG20261003', rollNo: '103', name: 'Charlie Brown', dob: '2010-11-05', gender: 'Male', bloodGroup: 'B-', aadhaarNo: '4567-8901-2345', address: 'Pedda Kottala, Kottala, AP', phone: '+91 98765-43222', email: 'charlie.b@srivani.edu', class: 'Class 10', section: 'B', parentId: 'P1003', parentName: 'Lucy Brown', parentPhone: '+91 98765-43232', emergencyContact: '+91 98765-77777', photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80', attendancePct: 92.2, activeStatus: 'Active', schoolId: 'school-1' },
  { id: 'S1004', registerNo: 'REG20261004', rollNo: '104', name: 'Diana Prince', dob: '2009-05-18', gender: 'Female', bloodGroup: 'AB+', aadhaarNo: '5678-9012-3456', address: 'Pedda Kottala, Kottala, AP', phone: '+91 98765-43223', email: 'diana.p@srivani.edu', class: 'Class 9', section: 'A', parentId: 'P1004', parentName: 'Steve Prince', parentPhone: '+91 98765-43233', emergencyContact: '+91 98765-66666', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', attendancePct: 98.1, activeStatus: 'Active', schoolId: 'school-1' }
];

const initialParents = [
  { id: 'P1001', name: 'Robert Johnson', email: 'rjohnson@gmail.com', phone: '+1 555-0301', childrenIds: ['S1001'], schoolId: 'school-1' },
  { id: 'P1002', name: 'Sarah Smith', email: 'ssmith@gmail.com', phone: '+1 555-0302', childrenIds: ['S1002'], schoolId: 'school-1' },
  { id: 'P1003', name: 'Lucy Brown', email: 'lbrown@gmail.com', phone: '+1 555-0303', childrenIds: ['S1003'], schoolId: 'school-1' },
  { id: 'P1004', name: 'Steve Prince', email: 'sprince@gmail.com', phone: '+1 555-0304', childrenIds: ['S1004'], schoolId: 'school-1' }
];

const initialAttendance = [
  // Student S1001 (Alice)
  { id: 'a1', studentId: 'S1001', date: '2026-06-08', status: 'Present', class: 'Class 10', section: 'A' },
  { id: 'a2', studentId: 'S1001', date: '2026-06-09', status: 'Present', class: 'Class 10', section: 'A' },
  { id: 'a3', studentId: 'S1001', date: '2026-06-10', status: 'Present', class: 'Class 10', section: 'A' },
  { id: 'a4', studentId: 'S1001', date: '2026-06-11', status: 'Present', class: 'Class 10', section: 'A' },
  { id: 'a5', studentId: 'S1001', date: '2026-06-12', status: 'Present', class: 'Class 10', section: 'A' },
  // Student S1002 (Bob)
  { id: 'a6', studentId: 'S1002', date: '2026-06-08', status: 'Present', class: 'Class 10', section: 'A' },
  { id: 'a7', studentId: 'S1002', date: '2026-06-09', status: 'Absent', class: 'Class 10', section: 'A' },
  { id: 'a8', studentId: 'S1002', date: '2026-06-10', status: 'Leave', class: 'Class 10', section: 'A' },
  { id: 'a9', studentId: 'S1002', date: '2026-06-11', status: 'Present', class: 'Class 10', section: 'A' },
  { id: 'a10', studentId: 'S1002', date: '2026-06-12', status: 'Half Day', class: 'Class 10', section: 'A' }
];

const initialMarks = [
  // Alice S1001
  { id: 'm1', studentId: 'S1001', studentName: 'Alice Johnson', examType: 'Midterm Exam', subject: 'PHYSICS', marks: 88, maxMarks: 100, grade: 'A', remarks: 'Excellent performance, strong in conceptual understanding.' },
  { id: 'm2', studentId: 'S1001', studentName: 'Alice Johnson', examType: 'Midterm Exam', subject: 'MATHEMATICS', marks: 95, maxMarks: 100, grade: 'A+', remarks: 'Top scores, logical thinking is outstanding.' },
  { id: 'm3', studentId: 'S1001', studentName: 'Alice Johnson', examType: 'Midterm Exam', subject: 'ENGLISH', marks: 90, maxMarks: 100, grade: 'A', remarks: 'Creative writer, active participant.' },
  { id: 'm4', studentId: 'S1001', studentName: 'Alice Johnson', examType: 'Midterm Exam', subject: 'GENERALKNOWLEDGE', marks: 98, maxMarks: 100, grade: 'A+', remarks: 'Phenomenal coding assignments.' },
  // Bob S1002
  { id: 'm5', studentId: 'S1002', studentName: 'Bob Smith', examType: 'Midterm Exam', subject: 'PHYSICS', marks: 72, maxMarks: 100, grade: 'B', remarks: 'Needs to focus more on numerical problems.' },
  { id: 'm6', studentId: 'S1002', studentName: 'Bob Smith', examType: 'Midterm Exam', subject: 'MATHEMATICS', marks: 68, maxMarks: 100, grade: 'C+', remarks: 'Needs regular practice in algebra.' },
  { id: 'm7', studentId: 'S1002', studentName: 'Bob Smith', examType: 'Midterm Exam', subject: 'ENGLISH', marks: 78, maxMarks: 100, grade: 'B+', remarks: 'Good verbal skills, needs to write structured answers.' },
  { id: 'm8', studentId: 'S1002', studentName: 'Bob Smith', examType: 'Midterm Exam', subject: 'GENERALKNOWLEDGE', marks: 85, maxMarks: 100, grade: 'A', remarks: 'Good grasp of web concepts.' }
];

const initialHomework = [
  { id: 'hw1', title: 'Electrostatics Laboratory Report', description: 'Write down a comprehensive laboratory report about the electric force experiments carried out on Tuesday.', subject: 'PHYSICS', class: 'Class 10', section: 'A', teacherId: 'T101', dueDate: '2026-06-16', file: 'electrostatics_guide.pdf', submissions: [
    { studentId: 'S1001', studentName: 'Alice Johnson', submittedAt: '2026-06-12 11:30 AM', file: 'alice_electrostatics.pdf', status: 'Evaluated', grade: 'A+', feedback: 'Exceptional details in graphics!' }
  ] },
  { id: 'hw2', title: 'Quadratic Equations Practice Set', description: 'Solve practice problems 1 to 20 on page 114 of the textbook. Show intermediate steps.', subject: 'MATHEMATICS', class: 'Class 10', section: 'A', teacherId: 'T103', dueDate: '2026-06-18', file: 'quadratic_set.pdf', submissions: [] }
];

const initialNotes = [
  { id: 'n1', title: 'Quantum Physics Intro Notes', description: 'Quick review guide to particle-wave duality and basic quantum levels.', subject: 'PHYSICS', class: 'Class 10', chapter: 'Chapter 4', teacherId: 'T101', type: 'PDF', file: 'quantum_intro.pdf', downloads: 28 },
  { id: 'n2', title: 'Shakespeare Hamlet Analysis', description: 'Character mappings, key quotes, and motif analysis slides.', subject: 'ENGLISH', class: 'Class 10', chapter: 'Chapter 2', teacherId: 'T102', type: 'PPT', file: 'hamlet_slides.pptx', downloads: 14 }
];

const initialCirculars = [
  { id: 'c1', title: 'Annual Cultural Festival registrations open', content: 'We are pleased to announce that registration for the annual cultural festival "Aurora 2026" is now open. Events include Solo Singing, Group Dance, Drama, Debate, and Painting. Please contact the music/arts room for registration. Deadline is June 20th.', targetGroup: 'All', date: '2026-06-10', postedBy: 'Admin' },
  { id: 'c2', title: 'Upcoming Parent-Teacher Meet (Class 10)', content: 'The parent-teacher meeting for Class 10 is scheduled for this Friday from 2:00 PM to 5:00 PM. Parents can discuss midterm test performance and student conduct with subject teachers. Attendance is mandatory.', targetGroup: 'Parents', date: '2026-06-12', postedBy: 'T101' }
];

const initialLiveClasses = [
  { id: 'lc1', subject: 'PHYSICS', title: 'Understanding Waves & Sound Waves', class: 'Class 10', section: 'A', teacherName: 'Dr. David Banner', startTime: '10:00 AM', duration: '45 Mins', meetingLink: 'https://meet.google.com/abc-defg-hij', status: 'Live' },
  { id: 'lc2', subject: 'MATHEMATICS', title: 'Probability Theory and Bayes Theorem', class: 'Class 10', section: 'A', teacherName: 'Mr. Frank Castle', startTime: '01:30 PM', duration: '60 Mins', meetingLink: 'https://meet.google.com/xyz-qprs-tuv', status: 'Scheduled' }
];

const initialLibraryBooks = [
  { id: 'b1', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', rackNo: 'A-3', copies: 5, available: 3 },
  { id: 'b2', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', rackNo: 'D-5', copies: 3, available: 3 },
  { id: 'b3', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Literature', rackNo: 'L-2', copies: 6, available: 4 }
];

const initialHostels = [
  { id: 'h1', roomNo: 'Block A - 101', type: 'AC - Triple Sharing', capacity: 3, occupied: 2, fee: '1,200/Month', students: ['Alice Johnson', 'Clara Smith'] },
  { id: 'h2', roomNo: 'Block B - 204', type: 'Non-AC - Double Sharing', capacity: 2, occupied: 1, fee: '800/Month', students: ['Bob Smith'] }
];

const initialTransportRoutes = [
  { id: 'tr1', routeName: 'Route 44 - Manhattan Express', driverName: 'John Doe', contact: '+1 555-9001', vehicleNo: 'NY-BUS-2026', stops: ['Times Sq', 'Central Park', 'Grand Central'], currentLoc: { lat: 40.7580, lng: -73.9855 } }
];

const initialAuditLogs = [
  { id: 'al1', user: 'Admin (System)', role: 'Admin', action: 'Initialized school database profiles', timestamp: '2026-06-12 10:00 AM' },
  { id: 'al2', user: 'Dr. David Banner', role: 'Teacher', action: 'Uploaded Physics Midterm Grades', timestamp: '2026-06-12 11:15 AM' }
];

const initialSupportTickets = [
  { id: 'tkt1', name: 'Robert Johnson', role: 'Parent', subject: 'Portal Login Issue on Mobile', description: 'The parent login dashboard is slow to load graphics when using Chrome on iOS.', status: 'Open', response: '', date: '2026-06-12' }
];

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('school_current_user');
    return saved ? JSON.parse(saved) : { role: 'Guest', name: 'Public Guest' };
  });

  const [schools, setSchools] = useState(() => {
    const saved = localStorage.getItem('school_schools');
    return saved ? JSON.parse(saved) : initialSchools;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('school_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [parents, setParents] = useState(() => {
    const saved = localStorage.getItem('school_parents');
    return saved ? JSON.parse(saved) : initialParents;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('school_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [marks, setMarks] = useState(() => {
    const saved = localStorage.getItem('school_marks');
    return saved ? JSON.parse(saved) : initialMarks;
  });

  const [homework, setHomework] = useState(() => {
    const saved = localStorage.getItem('school_homework');
    return saved ? JSON.parse(saved) : initialHomework;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('school_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [circulars, setCirculars] = useState(() => {
    const saved = localStorage.getItem('school_circulars');
    return saved ? JSON.parse(saved) : initialCirculars;
  });

  const [liveClasses, setLiveClasses] = useState(() => {
    const saved = localStorage.getItem('school_live_classes');
    return saved ? JSON.parse(saved) : initialLiveClasses;
  });

  const [libraryBooks, setLibraryBooks] = useState(() => {
    const saved = localStorage.getItem('school_library_books');
    return saved ? JSON.parse(saved) : initialLibraryBooks;
  });

  const [hostels, setHostels] = useState(() => {
    const saved = localStorage.getItem('school_hostels');
    return saved ? JSON.parse(saved) : initialHostels;
  });

  const [transportRoutes, setTransportRoutes] = useState(() => {
    const saved = localStorage.getItem('school_transport_routes');
    return saved ? JSON.parse(saved) : initialTransportRoutes;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('school_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [supportTickets, setSupportTickets] = useState(() => {
    const saved = localStorage.getItem('school_support_tickets');
    return saved ? JSON.parse(saved) : initialSupportTickets;
  });

  const [notifications, setNotifications] = useState([
    { id: 'ntf1', title: 'New Homework assigned in Physics', message: 'Read electrostatics guide and submit Lab report.', read: false, time: '10 mins ago', type: 'Homework' },
    { id: 'ntf2', title: 'Midterm Marks Published', message: 'Physics, Math, and Coding midterm marks are available now.', read: false, time: '1 hour ago', type: 'Exam' },
    { id: 'ntf3', title: 'Alert: Bob Attendance Low', message: 'Bob attendance has fallen to 88%. Mandatory parents alert.', read: false, time: '2 hours ago', type: 'AttendanceAlert' }
  ]);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('school_theme');
    return saved ? saved : 'light';
  });

  // Keep state synced to localStorage
  useEffect(() => {
    localStorage.setItem('school_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('school_schools', JSON.stringify(schools));
  }, [schools]);

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
    localStorage.setItem('school_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('school_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

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
    // Basic verification simulation
    let name = '';
    let success = false;
    let userId = '';

    if (role === 'SuperAdmin') {
      if (emailOrId === 'super@srivani.edu' && password === 'super123') {
        name = 'Super Administrator';
        userId = 'SA001';
        success = true;
      }
    } else if (role === 'Admin') {
      if (emailOrId === 'admin@srivani.edu' && password === 'admin123') {
        name = 'Admin (Head Office)';
        userId = 'ADM01';
        success = true;
      }
    } else if (role === 'Teacher') {
      const match = teachers.find(t => t.id === emailOrId);
      if (match && password === 'teacher123') {
        name = match.name;
        userId = match.id;
        success = true;
      }
    } else if (role === 'Student') {
      const match = students.find(s => s.id === emailOrId || s.registerNo === emailOrId);
      if (match && password === 'student123') {
        name = match.name;
        userId = match.id;
        success = true;
      }
    } else if (role === 'Parent') {
      const match = parents.find(p => p.id === emailOrId);
      if (match && password === 'parent123') {
        name = match.name;
        userId = match.id;
        success = true;
      }
    }

    if (success) {
      const userObj = { role, name, id: userId, emailOrId };
      setCurrentUser(userObj);
      addAuditLog(name, role, 'Successfully logged into portal');
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
    const newStudent = {
      ...studentData,
      id: `S${1001 + students.length}`,
      registerNo: `REG2026${1001 + students.length}`,
      attendancePct: 100.0,
      activeStatus: 'Active',
      schoolId: 'school-1'
    };
    setStudents(prev => [...prev, newStudent]);
    addAuditLog(currentUser.name, currentUser.role, `Created Student ${newStudent.name} (${newStudent.registerNo})`);
    addNotification('New Registration', `Student profile created for ${newStudent.name}`, 'Student');
  };

  const editStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
    addAuditLog(currentUser.name, currentUser.role, `Updated Student ID ${id}`);
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Deleted Student ID ${id}`);
  };

  const addTeacher = (teacherData) => {
    const newTeacher = {
      ...teacherData,
      id: `T${101 + teachers.length}`,
      joiningDate: new Date().toISOString().split('T')[0],
      schoolId: 'school-1'
    };
    setTeachers(prev => [...prev, newTeacher]);
    addAuditLog(currentUser.name, currentUser.role, `Added Teacher ${newTeacher.name} (ID: ${newTeacher.id})`);
  };

  const editTeacher = (id, updatedData) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    addAuditLog(currentUser.name, currentUser.role, `Updated Teacher ID ${id}`);
  };

  const deleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    addAuditLog(currentUser.name, currentUser.role, `Removed Teacher ID ${id}`);
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

  return (
    <AppContext.Provider value={{
      currentUser,
      loginUser,
      logoutUser,
      schools,
      teachers,
      students,
      parents,
      attendance,
      marks,
      homework,
      notes,
      circulars,
      liveClasses,
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
      markAttendance,
      uploadMarks,
      createHomework,
      submitHomework,
      evaluateHomework,
      createCircular,
      createLiveClass,
      createSupportTicket,
      replySupportTicket,
      toggleSchoolStatus,
      addAuditLog,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};
