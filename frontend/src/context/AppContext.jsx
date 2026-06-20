import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const initialSchools = [
  { id: 'school-1', name: 'SRI VANI VIDYANIKETHAN EM SCHOOL (Main Campus)', code: 'SVV-MAIN', address: '3-89, Pedda Kottala St, Pedda Kottala, Kottala, Andhra Pradesh 518502', studentsCount: 500, teachersCount: 50, status: 'Active' }
];

const initialAdmins = [
  { id: 'ADM01', name: 'Admin (Head Office)', email: 'admin@srivani.edu', password: 'admin123', status: 'Active' }
];

const initialTeachers = [
  { id: 'T101', name: 'Dr. David Banner', qualification: 'Ph.D. in Physics', experience: '12 Years', subject: 'PHYSICS', department: 'Science', email: 'dbanner@srivani.edu', phone: '+91 98765-43210', designation: 'Head of Department', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', salary: 6500, joiningDate: '2018-08-15', schoolId: 'school-1', password: 'teacher123' },
  { id: 'T102', name: 'Prof. Clara Oswald', qualification: 'M.A. in English Literature', experience: '8 Years', subject: 'ENGLISH', department: 'Humanities', email: 'coswald@srivani.edu', phone: '+91 98765-43211', designation: 'Senior Teacher', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', salary: 5200, joiningDate: '2020-09-01', schoolId: 'school-1', password: 'teacher123' },
  { id: 'T103', name: 'Mr. Frank Castle', qualification: 'M.Sc. in Mathematics', experience: '15 Years', subject: 'MATHEMATICS', department: 'Mathematics', email: 'fcastle@srivani.edu', phone: '+91 98765-43212', designation: 'Senior Instructor', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', salary: 6800, joiningDate: '2015-01-10', schoolId: 'school-1', password: 'teacher123' },
  { id: 'T104', name: 'Ms. Grace Hopper', qualification: 'Ph.D. in Computer Science', experience: '10 Years', subject: 'GENERALKNOWLEDGE', department: 'Information Technology', email: 'ghopper@srivani.edu', phone: '+91 98765-43213', designation: 'IT Director', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', salary: 7100, joiningDate: '2017-06-20', schoolId: 'school-1', password: 'teacher123' }
];

const initialStudents = [
  { id: 'S1001', registerNo: 'REG20261001', rollNo: '101', name: 'Alice Johnson', dob: '2010-04-12', gender: 'Female', bloodGroup: 'O+', aadhaarNo: '1234-5678-9012', address: 'Pedda Kottala, Kottala, AP', phone: '+91 98765-43220', email: 'alice.j@srivani.edu', class: 'Class 10', section: 'A', parentId: 'P1001', parentName: 'Robert Johnson', parentPhone: '+91 98765-43230', emergencyContact: '+91 98765-99999', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', attendancePct: 0, activeStatus: 'Active', schoolId: 'school-1', password: 'student123' },
  { id: 'S1002', registerNo: 'REG20261002', rollNo: '102', name: 'Bob Smith', dob: '2010-09-21', gender: 'Male', bloodGroup: 'A+', aadhaarNo: '9876-5432-1098', address: 'Pedda Kottala, Kottala, AP', phone: '+91 98765-43221', email: 'bob.s@srivani.edu', class: 'Class 10', section: 'A', parentId: 'P1002', parentName: 'Sarah Smith', parentPhone: '+91 98765-43231', emergencyContact: '+91 98765-88888', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', attendancePct: 0, activeStatus: 'Active', schoolId: 'school-1', password: 'student123' },
  { id: 'S1003', registerNo: 'REG20261003', rollNo: '103', name: 'Charlie Brown', dob: '2010-11-05', gender: 'Male', bloodGroup: 'B-', aadhaarNo: '4567-8901-2345', address: 'Pedda Kottala, Kottala, AP', phone: '+91 98765-43222', email: 'charlie.b@srivani.edu', class: 'Class 10', section: 'B', parentId: 'P1003', parentName: 'Lucy Brown', parentPhone: '+91 98765-43232', emergencyContact: '+91 98765-77777', photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80', attendancePct: 0, activeStatus: 'Active', schoolId: 'school-1', password: 'student123' },
  { id: 'S1004', registerNo: 'REG20261004', rollNo: '104', name: 'Diana Prince', dob: '2009-05-18', gender: 'Female', bloodGroup: 'AB+', aadhaarNo: '5678-9012-3456', address: 'Pedda Kottala, Kottala, AP', phone: '+91 98765-43223', email: 'diana.p@srivani.edu', class: 'Class 9', section: 'A', parentId: 'P1004', parentName: 'Steve Prince', parentPhone: '+91 98765-43233', emergencyContact: '+91 98765-66666', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', attendancePct: 0, activeStatus: 'Active', schoolId: 'school-1', password: 'student123' }
];

const initialParents = [
  { id: 'P1001', name: 'Robert Johnson', email: 'rjohnson@gmail.com', phone: '+1 555-0301', childrenIds: ['S1001'], schoolId: 'school-1', password: 'parent123' },
  { id: 'P1002', name: 'Sarah Smith', email: 'ssmith@gmail.com', phone: '+1 555-0302', childrenIds: ['S1002'], schoolId: 'school-1', password: 'parent123' },
  { id: 'P1003', name: 'Lucy Brown', email: 'lbrown@gmail.com', phone: '+1 555-0303', childrenIds: ['S1003'], schoolId: 'school-1', password: 'parent123' },
  { id: 'P1004', name: 'Steve Prince', email: 'sprince@gmail.com', phone: '+1 555-0304', childrenIds: ['S1004'], schoolId: 'school-1', password: 'parent123' }
];

const initialExams = [
  { id: 'ex1', name: 'Physics Unit Test 1', examType: 'Unit Test', class: 'Class 10', subject: 'PHYSICS', date: '2026-06-18' },
  { id: 'ex2', name: 'Mathematics Monthly Test', examType: 'Monthly Test', class: 'Class 10', subject: 'MATHEMATICS', date: '2026-06-20' }
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

const initialTestimonials = [
  { id: 'tmn1', text: 'Sri Vani Vidyanikethan has given my child an incredible foundation. The teachers are caring, the environment is excellent, and the results speak for themselves!', author: 'Lakshmi Devi', role: 'Parent, Class 5 Student', active: true },
  { id: 'tmn2', text: 'I studied here from Class 1 to 10. The school shaped my confidence, discipline, and love for learning. I am forever grateful!', author: 'Ravi Kumar', role: 'Alumni, Class of 2022', active: true },
  { id: 'tmn3', text: 'As a teacher here for 8 years, I can confidently say this school puts students first in every decision. A truly wonderful institution.', author: 'Smt. Anitha Reddy', role: 'Senior Faculty, Mathematics', active: true }
];

const initialEnquiries = [];

const initialGalleryItems = [
  { id: 'g1', title: 'Annual Day 2025 Performance', category: 'Annual Day', type: 'image', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80', date: '2025-12-15', description: 'Students performed a grand cultural show on Annual Day.' },
  { id: 'g2', title: 'Track & Field Athletics Meet', category: 'Sports', type: 'image', url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80', date: '2026-01-20', description: 'Inter-school athletics competition held at our sports ground.' },
  { id: 'g3', title: 'Mahatma Gandhi Jayanthi', category: 'Special Events', type: 'image', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80', date: '2025-10-02', description: 'Students paid tribute to the Father of the Nation.' },
  { id: 'g4', title: "Children's Day Celebration", category: 'Special Events', type: 'image', url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80', date: '2025-11-14', description: "Fun-filled activities and competitions for Children's Day." },
  { id: 'g5', title: 'Science Exhibition Projects', category: 'Science Exhibition', type: 'image', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80', date: '2026-02-10', description: 'Students showcased innovative science projects.' },
  { id: 'g6', title: 'Basketball Final Championship', category: 'Sports', type: 'image', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80', date: '2026-03-05', description: 'Exciting basketball final between top teams.' },
  { id: 'g7', title: 'Republic Day Flag Hoisting', category: 'Special Events', type: 'image', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80', date: '2026-01-26', description: 'Flag hoisting ceremony with March Past on Republic Day.' },
  { id: 'g8', title: 'Cultural Dance Performance', category: 'Cultural Programs', type: 'image', url: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&auto=format&fit=crop&q=80', date: '2025-12-20', description: 'Classical and folk dance performances by our talented students.' }
];

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

const initialFacilities = [
  { id: 'fac1', title: 'Smart Classrooms', description: 'Air-conditioned classrooms with interactive smart boards, projectors, and high-speed Wi-Fi for digital learning.', icon: '🖥️' },
  { id: 'fac2', title: 'Science Laboratories', description: 'Fully equipped Physics, Chemistry, and Biology labs with modern instruments for hands-on experiments.', icon: '🔬' },
  { id: 'fac3', title: 'Computer Lab', description: 'State-of-the-art computer lab with 40+ systems, coding curriculum, and internet access for research projects.', icon: '💻' },
  { id: 'fac4', title: 'Library & Reading Room', description: 'A vast collection of 10,000+ books, journals, and digital resources with a quiet reading area.', icon: '📚' },
  { id: 'fac5', title: 'Sports Complex', description: 'Olympic-grade facilities including basketball court, cricket ground, volleyball court, and indoor games room.', icon: '🏅' },
  { id: 'fac6', title: 'Transportation', description: 'Safe and GPS-tracked school buses covering all major routes in Nandyal and surrounding villages.', icon: '🚌' },
  { id: 'fac7', title: 'Auditorium', description: 'A 500-seat auditorium with professional sound system and lighting for events and assemblies.', icon: '🎭' },
  { id: 'fac8', title: 'Medical Room', description: 'On-campus first-aid and medical room with trained nurse for student health emergencies.', icon: '🏥' }
];

const initialHomepageInfra = [
  { id: 'infra1', title: 'Smart Digital Classrooms', description: 'Interactive smart boards, projectors, and air-conditioned rooms for immersive learning experiences.', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80' },
  { id: 'infra2', title: 'Advanced Science Labs', description: 'Fully equipped Physics, Chemistry, and Biology laboratories with modern instruments and safety gear.', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80' },
  { id: 'infra3', title: 'Olympic-Grade Sports Complex', description: 'Basketball courts, cricket ground, athletics track, and indoor games facility for holistic student development.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80' },
  { id: 'infra4', title: 'Central Library & Resource Center', description: 'Over 10,000 books, digital research stations, and a serene reading hall open to all students.', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80' }
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

const initialLeaveRequests = [
  { id: 'leave1', studentId: 'S1001', studentName: 'Alice Johnson', class: 'Class 10', section: 'A', leaveType: 'Sick Leave', startDate: '2026-06-25', endDate: '2026-06-26', reason: 'Severe fever and doctor advised rest.', status: 'Approved', adminMessage: 'Get well soon, Alice. Take care!', submittedAt: '2026-06-20, 10:15:00 AM' },
  { id: 'leave2', studentId: 'S1002', studentName: 'Bob Smith', class: 'Class 10', section: 'A', leaveType: 'Casual Leave', startDate: '2026-06-28', endDate: '2026-06-30', reason: 'Attending my sister\'s marriage in village.', status: 'Pending', adminMessage: '', submittedAt: '2026-06-20, 11:30:00 AM' }
];

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

const initialAcademicCalendar = [
  { id: 'cal1', date: 'Jun 12, 2026', title: 'School Reopening — Academic Year 2026-27', type: 'Academic' },
  { id: 'cal2', date: 'Jun 29, 2026', title: 'Unit Test I', type: 'Examination' },
  { id: 'cal3', date: 'Aug 15, 2026', title: 'Independence Day Celebration', type: 'Holiday' },
  { id: 'cal4', date: 'Sep 05, 2026', title: "Teachers' Day", type: 'Holiday' },
  { id: 'cal5', date: 'Oct 02, 2026', title: 'Gandhi Jayanthi (School Closed)', type: 'Holiday' },
  { id: 'cal6', date: 'Oct 12-18, 2026', title: 'Half-Yearly Examinations', type: 'Examination' },
  { id: 'cal7', date: 'Nov 01, 2026', title: 'Andhra Pradesh Formation Day', type: 'Holiday' },
  { id: 'cal8', date: 'Nov 14, 2026', "title": "Children's Day Celebrations", type: 'Academic' },
  { id: 'cal9', date: 'Dec 25, 2026', title: 'Christmas & Winter Break Begins', type: 'Holiday' },
  { id: 'cal10', date: 'Jan 01, 2027', title: 'New Year / School Reopens', type: 'Academic' },
  { id: 'cal11', date: 'Jan 26, 2027', title: 'Republic Day Celebration', type: 'Holiday' },
  { id: 'cal12', date: 'Feb 15-27, 2027', title: 'Annual Examinations', type: 'Examination' },
  { id: 'cal13', date: 'Mar 20, 2027', title: 'Annual Day & Prize Distribution', type: 'Academic' },
  { id: 'cal14', date: 'Apr 05, 2027', title: 'Results Declaration & Summer Vacation Begins', type: 'Academic' }
];

const initialAcademicPrograms = [
  {
    id: 'prog1',
    grade: 'Pre-Primary — Playclass',
    focus: 'Early Childhood Foundation',
    desc: 'Activity-based learning with songs, rhymes, and sensory play to develop motor skills, language, and curiosity in young children aged 2.5–3.5 years.',
    subjects: ['Rhymes & Stories', 'Colours & Shapes', 'Number Fun', 'Drawing & Craft', 'Physical Play', 'EVS Basics']
  },
  {
    id: 'prog2',
    grade: 'Pre-Primary — LKG',
    focus: 'Language & Number Readiness',
    desc: 'Introduction to alphabets, numbers, and simple words through games and structured play for children aged 3.5–4.5 years.',
    subjects: ['English Alphabets', 'Telugu Script Intro', 'Numbers 1-100', 'Drawing & Craft', 'General Awareness', 'Physical Education']
  },
  {
    id: 'prog3',
    grade: 'Pre-Primary — UKG',
    focus: 'School Readiness Programme',
    desc: 'Bridges pre-school to primary with reading readiness, writing practice, and basic arithmetic for children aged 4.5–5.5 years.',
    subjects: ['English Reading', 'Telugu', 'Mathematics', 'EVS', 'Art & Craft', 'Physical Education']
  },
  {
    id: 'prog4',
    grade: 'Primary — Classes 1 to 5',
    focus: 'Foundational Academic Learning',
    desc: 'Core subjects are taught with a focus on literacy, numeracy, and scientific curiosity. Integrated with value education and activity-based learning.',
    subjects: ['English', 'Telugu', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Art & Craft', 'Physical Education']
  },
  {
    id: 'prog5',
    grade: 'Upper Primary — Classes 6 to 8',
    focus: 'Exploratory & Analytical Learning',
    desc: 'Students explore deeper concepts in sciences, mathematics, and languages. Introduction to computer programming and critical thinking.',
    subjects: ['English Literature', 'Telugu', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Computer Science']
  },
  {
    id: 'prog6',
    grade: 'Secondary — Classes 9 & 10',
    focus: 'Board Examination Preparation',
    desc: 'Rigorous preparation for SSC Board Examinations with lab practicals, model papers, and subject-specialist coaching.',
    subjects: ['English', 'Telugu', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Computer Applications']
  }
];

const DATA_VERSION = '4';

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
    return readStoredValue('school_timetables', [
      { class: 'Class 10', day: 'Monday', slots: ['PHYSICS (09:30 AM - 10:15 AM)', 'MATHEMATICS (10:30 AM - 11:15 AM)', 'ENGLISH (11:30 AM - 12:15 PM)'] },
      { class: 'Class 10', day: 'Tuesday', slots: ['GENERALKNOWLEDGE (09:30 AM - 10:15 AM)', 'PHYSICS (10:30 AM - 11:15 AM)', 'MATHEMATICS (01:00 PM - 01:45 PM)'] },
      { class: 'Class 10', day: 'Wednesday', slots: ['MATHEMATICS (09:30 AM - 10:15 AM)', 'ENGLISH (10:30 AM - 11:15 AM)', 'PHYSICS (01:00 PM - 01:45 PM)'] },
      { class: 'Class 10', day: 'Thursday', slots: ['PHYSICS (09:30 AM - 10:15 AM)', 'GENERALKNOWLEDGE (10:30 AM - 11:15 AM)', 'MATHEMATICS (01:00 PM - 01:45 PM)'] },
      { class: 'Class 10', day: 'Friday', slots: ['ENGLISH (09:30 AM - 10:15 AM)', 'MATHEMATICS (10:30 AM - 11:15 AM)', 'GENERALKNOWLEDGE (01:00 PM - 01:45 PM)'] },
      { class: 'Class 9', day: 'Monday', slots: ['MATHEMATICS (09:30 AM - 10:15 AM)', 'ENGLISH (10:30 AM - 11:15 AM)', 'PHYSICS (01:00 PM - 01:45 PM)'] },
      { class: 'Class 9', day: 'Tuesday', slots: ['PHYSICS (09:30 AM - 10:15 AM)', 'GENERALKNOWLEDGE (10:30 AM - 11:15 AM)', 'MATHEMATICS (01:00 PM - 01:45 PM)'] },
      { class: 'Class 9', day: 'Wednesday', slots: ['GENERALKNOWLEDGE (09:30 AM - 10:15 AM)', 'PHYSICS (10:30 AM - 11:15 AM)', 'MATHEMATICS (01:00 PM - 01:45 PM)'] },
      { class: 'Class 9', day: 'Thursday', slots: ['MATHEMATICS (09:30 AM - 10:15 AM)', 'ENGLISH (10:30 AM - 11:15 AM)', 'PHYSICS (01:00 PM - 01:45 PM)'] },
      { class: 'Class 9', day: 'Friday', slots: ['ENGLISH (09:30 AM - 10:15 AM)', 'MATHEMATICS (10:30 AM - 11:15 AM)', 'GENERALKNOWLEDGE (01:00 PM - 01:45 PM)'] }
    ]);
  });

  const [fees, setFees] = useState(() => {
    return readStoredValue('school_fees', [
      { class: 'Class 10', year: '2026', tuitionFee: 1800, labFee: 300, busFee: 250, booksFee: 180 },
      { class: 'Class 9', year: '2026', tuitionFee: 1600, labFee: 250, busFee: 240, booksFee: 170 },
      { class: 'Class 8', year: '2026', tuitionFee: 1500, labFee: 200, busFee: 230, booksFee: 160 },
      { class: 'Class 7', year: '2026', tuitionFee: 1400, labFee: 150, busFee: 220, booksFee: 150 },
      { class: 'Class 6', year: '2026', tuitionFee: 1300, labFee: 100, busFee: 210, booksFee: 140 }
    ]);
  });

  const [tickerItems, setTickerItems] = useState(() => {
    return readStoredValue('school_ticker_items', [
      { id: 't1', title: "Standard Matrix Timetable Scheduler", desc: "Super Admins can now configure dynamic period hours up to 8 slots per class.", time: "Just Now", type: "Academic" },
      { id: 't2', title: "Dynamic State Synchronization", desc: "Edits to student profiles, class listings, and fee variables propagate instantly across all portals.", time: "5 mins ago", type: "System" },
      { id: 't3', title: "Olympic-Grade Sports Facilities active", desc: "Class allocations for indoor pool & training tracks are officially scheduled.", time: "1 hour ago", type: "Campus" },
      { id: 't4', title: "Circular: Aurora 2026 Cultural registrations", desc: "Singing, drama, debate and painting signups are open in the music room.", time: "Today", type: "Circular" },
      { id: 't5', title: "Interactive STEM Laboratory fully operational", desc: "3D printers and VR engineering blocks assigned for high school students.", time: "Yesterday", type: "Facilities" },
      { id: 't6', title: "Principal's Welcome Address updated", desc: "Dasaratha Rami Reddy welcomes parents and details new interactive guidelines.", time: "Yesterday", type: "Principal" }
    ]);
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
      { id: 'm1', name: 'K Dasaratha Rami Reddy', role: 'Principal & Director', qual: 'M.Ed / M.Sc, Educational Leadership', photo: '/principal.jpg' },
      { id: 'm2', name: 'Robert Vance', role: 'Chairman, Management Committee', qual: 'MBA (Harvard Business School)', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      { id: 'm3', name: 'Dr. Evelyn Carter', role: 'Vice Principal', qual: 'Ph.D. in Child Psychology', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
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

  const [notifications, setNotifications] = useState([
    { id: 'ntf1', title: 'New Homework assigned in Physics', message: 'Read electrostatics guide and submit Lab report.', read: false, time: '10 mins ago', type: 'Homework' },
    { id: 'ntf2', title: 'Midterm Marks Published', message: 'Physics, Math, and Coding midterm marks are available now.', read: false, time: '1 hour ago', type: 'Exam' },
    { id: 'ntf3', title: 'Alert: Bob Attendance Low', message: 'Bob attendance has fallen to 88%. Mandatory parents alert.', read: false, time: '2 hours ago', type: 'AttendanceAlert' }
  ]);

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('school_theme') || 'light';
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state from API on load
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('/api/data');
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

        const res = await fetch('/api/data', {
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

    if (role === 'SuperAdmin') {
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
