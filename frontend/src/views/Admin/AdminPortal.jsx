import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { sendEmail, buildStudentEnrollmentEmail, buildParentEnrollmentEmail } from '../../lib/emailService';
import { 
  Users, GraduationCap, Calendar, FileText, Settings, Plus, Trash2, 
  Search, Award, MessageSquare, AlertCircle, RefreshCw, Layers, BookOpen, Download, FileSpreadsheet,
  Edit2, Building2, X, UserPlus, User, ClipboardList, CheckSquare, Eye, EyeOff
} from 'lucide-react';

const compressImageForCropper = (file, callback) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const rawResult = e.target.result;
    if (!rawResult) { callback(null); return; }
    try {
      const img = new window.Image();
      img.onload = () => {
        try {
          const maxDim = 1000;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          callback(canvas.toDataURL('image/jpeg', 0.8));
        } catch {
          callback(rawResult);
        }
      };
      img.onerror = () => {
        callback(rawResult);
      };
      img.src = rawResult;
    } catch {
      callback(rawResult);
    }
  };
  reader.onerror = () => { callback(null); };
  reader.readAsDataURL(file);
};

const compressImageDirectly = (file, callback) => {
  if (!file || !file.type.startsWith('image/')) {
    console.warn('compressImageDirectly: Invalid file or not an image');
    return;
  }
  const reader = new FileReader();
  reader.onload = (readerEvent) => {
    const rawDataUrl = readerEvent.target.result;
    if (!rawDataUrl) {
      console.warn('compressImageDirectly: FileReader produced empty result');
      return;
    }
    try {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const targetSize = 200;
          let width = img.width;
          let height = img.height;
          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = width;
          let sourceHeight = height;

          if (width > height) {
            sourceWidth = height;
            sourceX = Math.round((width - height) / 2);
          } else if (height > width) {
            sourceHeight = width;
            sourceY = Math.round((height - width) / 2);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetSize, targetSize);
          const compressedUrl = canvas.toDataURL('image/jpeg', 0.6);
          if (compressedUrl && compressedUrl.length > 50) {
            callback(compressedUrl);
          } else {
            callback(rawDataUrl);
          }
        } catch (canvasErr) {
          console.warn('compressImageDirectly: Canvas error, using raw data URL', canvasErr);
          callback(rawDataUrl);
        }
      };
      img.onerror = () => {
        console.warn('compressImageDirectly: Image load failed, using raw data URL');
        callback(rawDataUrl);
      };
      // Set src AFTER defining onload/onerror to avoid race conditions
      img.src = rawDataUrl;
    } catch (outerErr) {
      console.warn('compressImageDirectly: Outer error, using raw data URL', outerErr);
      callback(rawDataUrl);
    }
  };
  reader.onerror = () => {
    console.warn('compressImageDirectly: FileReader error');
  };
  reader.readAsDataURL(file);
};

const cleanPhoneForWhatsapp = (phoneStr) => {
  if (!phoneStr) return '';
  const digitsOnly = phoneStr.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return `91${digitsOnly.slice(1)}`;
  }
  return digitsOnly;
};

export default function AdminPortal() {
  const { 
    students,
    teachers,
    parents,
    circulars, createCircular, deleteCircular,
    exams, createExam, deleteExam,
    classes, setClasses,
    sections, setSections,
    subjects, addSubject,
    supportTickets, replySupportTicket,
    logoutUser,
    facilities, addFacility, editFacility, deleteFacility,
    addStudent, addParent,
    leaveRequests, updateLeaveStatus,
    admissions, updateAdmissionFields, starredFormFields, toggleAdmissionFieldStar, approveAdmission, rejectAdmission,
    galleryItems,
    attendance, gradingScheme, updateGradingScheme
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [adminFeedbackMsg, setAdminFeedbackMsg] = useState({});
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [leaveFilter, setLeaveFilter] = useState('Pending');
  const [admissionFilter, setAdmissionFilter] = useState('Pending');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showEnrollPassword, setShowEnrollPassword] = useState(false);
  const [enrollShakeKey, setEnrollShakeKey] = useState(0);
  const [enrollError, setEnrollError] = useState('');

  // Attendance search states
  const [adminAttendanceSearchClass, setAdminAttendanceSearchClass] = useState('Class 10');
  const [adminAttendanceSearchSection, setAdminAttendanceSearchSection] = useState('A');
  const [adminAttendanceSearchQuery, setAdminAttendanceSearchQuery] = useState('');
  const [adminSelectedStudentAttendance, setAdminSelectedStudentAttendance] = useState(null);

  const contentRef = React.useRef(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('All');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [parentSearch, setParentSearch] = useState('');
  const [parentClassFilter, setParentClassFilter] = useState('All');

  // Circular form
  const [showAddCircular, setShowAddCircular] = useState(false);
  const [circularForm, setCircularForm] = useState({ title: '', content: '', targetGroup: 'All' });

  // Class & Section creator states
  const [newClassVal, setNewClassVal] = useState('');
  const [newSectionVal, setNewSectionVal] = useState('');

  // Subject creator state
  const [newSubjectVal, setNewSubjectVal] = useState('');

  // Exam creator state
  const [showAddExam, setShowAddExam] = useState(false);
  const [examForm, setExamForm] = useState({ name: '', examType: 'Unit Test', class: 'Class 10', section: 'All', subject: 'PHYSICS', date: '' });

  // Reports state
  const [reportType, setReportType] = useState('Attendance');
  const [reportClass, setReportClass] = useState('Class 10');
  const [generatedReport, setGeneratedReport] = useState(null);

  // Helpdesk ticket response state
  const [ticketReplyText, setTicketReplyText] = useState({});

  // Student Enrollment form state
  const [showEnrollStudent, setShowEnrollStudent] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    name: '', registerNo: '', class: 'Class 10', section: 'A', password: '',
    phone: '', email: '', address: '',
    parentName: '', parentPhone: '', parentEmail: '',
    photo: ''
  });

  // Facility form state
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [facilityForm, setFacilityForm] = useState({ title: '', description: '', icon: '🏫' });
  const [editingFacilityId, setEditingFacilityId] = useState(null);
  const [editFacilityForm, setEditFacilityForm] = useState({ title: '', description: '', icon: '' });

  // Class-wise student filter state
  const [classFilter, setClassFilter] = useState('All');

  const handleAddCircularSubmit = (e) => {
    e.preventDefault();
    if (!circularForm.title || !circularForm.content) return;
    createCircular(circularForm);
    setCircularForm({ title: '', content: '', targetGroup: 'All' });
    setShowAddCircular(false);
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassVal.trim()) return;
    if (classes.includes(newClassVal.trim())) {
      alert("Class already exists.");
      return;
    }
    setClasses([...classes, newClassVal.trim()]);
    setNewClassVal('');
    alert("New Class added successfully.");
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSectionVal.trim()) return;
    if (sections.includes(newSectionVal.trim())) {
      alert("Section already exists.");
      return;
    }
    setSections([...sections, newSectionVal.trim()]);
    setNewSectionVal('');
    alert("New Section added successfully.");
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjectVal.trim()) return;
    const cleanSub = newSubjectVal.trim();
    const subCode = cleanSub.toUpperCase().replace(/\s+/g, '');
    if ((subjects || []).some(s => s.code === subCode || s.name.toLowerCase() === cleanSub.toLowerCase())) {
      alert("Subject already exists.");
      return;
    }
    addSubject({ name: cleanSub, code: subCode, department: 'General' });
    setNewSubjectVal('');
    alert("New Subject added successfully.");
  };

  const handleAddExamSubmit = (e) => {
    e.preventDefault();
    if (!examForm.name || !examForm.date) {
      alert("Please specify exam name and scheduling date.");
      return;
    }
    createExam(examForm);
    setExamForm({ name: '', examType: 'Unit Test', class: 'Class 10', section: 'All', subject: 'PHYSICS', date: '' });
    setShowAddExam(false);
    alert("Exam scheduled and published to student desks.");
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    
    // Simulate reports content based on state data
    if (reportType === 'Attendance') {
      const records = students.filter(s => s.class === reportClass);
      setGeneratedReport({
        title: `Attendance Summary Report - ${reportClass}`,
        timestamp: new Date().toLocaleString(),
        headers: ['Student Name', 'Register No', 'Current Attendance %', 'Status'],
        rows: records.map(r => [r.name, r.registerNo, `${r.attendancePct}%`, r.activeStatus])
      });
    } else if (reportType === 'Grades') {
      const classStuds = students.filter(s => s.class === reportClass);
      setGeneratedReport({
        title: `Academic Grade Performance Index - ${reportClass}`,
        timestamp: new Date().toLocaleString(),
        headers: ['Student Name', 'Register No', 'Phys Pct', 'Math Pct', 'Avg Grade'],
        rows: classStuds.map(r => [r.name, r.registerNo, '88%', '95%', 'A+'])
      });
    } else {
      setGeneratedReport({
        title: `Support Ticket Response Audit Log`,
        timestamp: new Date().toLocaleString(),
        headers: ['Issuer', 'Role', 'Subject', 'Status'],
        rows: supportTickets.map(t => [t.name, t.role, t.subject, t.status])
      });
    }
  };

  const handleReplyTicket = (id) => {
    const text = ticketReplyText[id];
    if (!text || !text.trim()) return;
    replySupportTicket(id, text);
    setTicketReplyText(prev => ({ ...prev, [id]: '' }));
    alert("Response dispatched to support ticket.");
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    setEnrollError('');

    if (!enrollForm.name || !enrollForm.registerNo || !enrollForm.password) {
      setEnrollError('Please fill in Student Name, Register Number, and Password.');
      setEnrollShakeKey(prev => prev + 1);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (enrollForm.email && !emailRegex.test(enrollForm.email)) {
      setEnrollError('Student Email format is invalid.');
      setEnrollShakeKey(prev => prev + 1);
      return;
    }

    if (enrollForm.parentEmail && !emailRegex.test(enrollForm.parentEmail)) {
      setEnrollError('Parent Email format is invalid.');
      setEnrollShakeKey(prev => prev + 1);
      return;
    }

    // Create student account - registerNo is used as Login ID
    const studentResult = addStudent({
      registerNo: enrollForm.registerNo,
      rollNo: '',
      name: enrollForm.name,
      dob: '',
      gender: '',
      bloodGroup: '',
      aadhaarNo: '',
      address: enrollForm.address,
      phone: enrollForm.phone,
      email: enrollForm.email,
      class: enrollForm.class,
      section: enrollForm.section,
      parentName: enrollForm.parentName,
      parentPhone: enrollForm.parentPhone,
      emergencyContact: enrollForm.parentPhone,
      photo: enrollForm.photo || '',
      password: enrollForm.password
    });

    if (!studentResult.success) {
      setEnrollError(studentResult.message);
      setEnrollShakeKey(prev => prev + 1);
      return;
    }

    // Auto-create parent portal account with SAME password (no photo upload required)
    const newStudentId = studentResult.id;
    addParent({
      name: enrollForm.parentName,
      email: enrollForm.parentEmail,
      phone: enrollForm.parentPhone,
      childrenIds: [newStudentId],
      password: enrollForm.password
    });

    // Send Welcome / OTP Email to Student and Parent
    const studentOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const parentOtp = Math.floor(100000 + Math.random() * 900000).toString();

    if (enrollForm.email) {
      sendEmail(
        enrollForm.email,
        `Welcome to Sri Vani Vidyanikethan — Enrollment Confirmation`,
        buildStudentEnrollmentEmail({
          studentName: enrollForm.name,
          studentId: newStudentId,
          registerNo: enrollForm.registerNo,
          className: `${enrollForm.class} - ${enrollForm.section}`,
          password: enrollForm.password
        })
      ).catch(err => console.error('Error sending welcome email to student:', err));
    }

    if (enrollForm.parentEmail) {
      sendEmail(
        enrollForm.parentEmail,
        'Sri Vani Vidyanikethan — Parent Account Confirmation',
        buildParentEnrollmentEmail({
          parentName: enrollForm.parentName,
          studentName: enrollForm.name,
          parentEmail: enrollForm.parentEmail,
          password: enrollForm.password
        })
      ).catch(err => console.error('Error sending welcome email to parent:', err));
    }

    setEnrollForm({
      name: '', registerNo: '', class: 'Class 10', section: 'A', password: '',
      phone: '', email: '', address: '',
      parentName: '', parentPhone: '', parentEmail: '',
      photo: ''
    });

    setShowEnrollStudent(false);
    alert('Student enrolled, parent portal account created, and credentials OTP sent successfully!');
  };

  const handleAddFacility = (e) => {
    e.preventDefault();
    if (!facilityForm.title.trim()) return;
    addFacility(facilityForm);
    setFacilityForm({ title: '', description: '', icon: '🏫' });
    setShowAddFacility(false);
    alert('Facility added successfully.');
  };

  const handleStartEditFacility = (fac) => {
    setEditingFacilityId(fac.id);
    setEditFacilityForm({ title: fac.title, description: fac.description, icon: fac.icon });
  };

  const handleSaveEditFacility = (id) => {
    editFacility(id, editFacilityForm);
    setEditingFacilityId(null);
  };

  const allClassOptions = ['All', 'Playclass', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-slate-800 dark:text-slate-100 text-left flex flex-col lg:flex-row gap-8 font-sans">
      
      {/* Sidebar Nav */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="glassmorphism p-5 rounded-3xl border border-white/50 shadow-md">
          <div className="space-y-1 mb-6">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Admin Control</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">SRI VANI VIDYANIKETHAN</p>
          </div>

          <nav className="flex flex-col gap-1.5 text-xs font-semibold">
            {[
              { id: 'Dashboard', icon: Users, label: 'Dashboard Overview' },
              { id: 'EnrollStudent', icon: UserPlus, label: 'Enroll Student' },
              { id: 'Admissions', icon: FileSpreadsheet, label: 'Online Admissions' },
              { id: 'Students', icon: Users, label: 'View Students' },
              { id: 'ClassWise', icon: Layers, label: 'Class-wise Students' },
              { id: 'Teachers', icon: GraduationCap, label: 'View Teachers' },
              { id: 'Parents', icon: Users, label: 'View Parents' },
              { id: 'Classes', icon: Layers, label: 'Classes & Sections' },
              { id: 'Subjects', icon: BookOpen, label: 'Subjects Directory' },
              { id: 'Exams', icon: Award, label: 'Create Exams' },
              { id: 'Facilities', icon: Building2, label: 'Campus Facilities' },
              { id: 'Leaves', icon: ClipboardList, label: 'Leave Requests' },
              { id: 'Circulars', icon: FileText, label: 'Notice Board' },
              { id: 'Reports', icon: FileSpreadsheet, label: 'Generate Reports' },
              { id: 'Helpdesk', icon: MessageSquare, label: 'Helpdesk Tickets' },
              { id: 'AttendanceLog', icon: CheckSquare, label: 'Attendance History' },
              { id: 'GradingScheme', icon: Award, label: 'Grading Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'EnrollStudent') {
                    setEnrollForm({
                      name: '', registerNo: '', class: 'Class 10', section: 'A', password: '',
                      phone: '', email: '', address: '',
                      parentName: '', parentPhone: '', parentEmail: '',
                      photo: ''
                    });
                  }
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow font-bold' 
                    : 'text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-900/30'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={logoutUser} 
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-all"
        >
          Logout Admin Session
        </button>
      </div>

      {/* Main Content Area */}
      <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
        
        {/* Dashboard Tab */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Administrative Overview</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            {/* Quick Metrics */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Active Students</p>
                <h3 className="text-3xl font-extrabold font-montserrat mt-1">{students.length}</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">100% Active Directory</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Faculty</p>
                <h3 className="text-3xl font-extrabold font-montserrat mt-1">{teachers.length}</h3>
                <p className="text-[10px] text-blue-500 font-semibold mt-1">{(subjects || []).length} Departments</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Parents</p>
                <h3 className="text-3xl font-extrabold font-montserrat mt-1">{parents.length}</h3>
                <p className="text-[10px] text-purple-500 font-semibold mt-1">Guardian Link Active</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Classes</p>
                <h3 className="text-3xl font-extrabold font-montserrat mt-1">{classes.length}</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">Syllabus Defined</p>
              </div>
            </div>

            {/* Simulated Charts layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850">
                <h4 className="font-extrabold text-sm mb-4">Class-wise Attendance Averages</h4>
                <div className="h-40 w-full flex items-end justify-between px-4">
                  {[
                    { grade: 'Class 8', pct: '88%' },
                    { grade: 'Class 9', pct: '98%' },
                    { grade: 'Class 10', pct: '94%' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-16">
                      <div className="w-10 bg-blue-600 rounded-t-lg transition-all duration-500" style={{ height: `${parseInt(item.pct)}px` }}></div>
                      <span className="text-[9px] text-slate-400">{item.grade} ({item.pct})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending support request list */}
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850 space-y-3">
                <h4 className="font-extrabold text-sm">Open Helpdesk Notifications</h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-light">
                  {supportTickets.filter(t => t.status === 'Open').slice(0, 3).map(ticket => (
                    <div key={ticket.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{ticket.subject}</p>
                        <p className="text-[9px] text-slate-400">Initiator: {ticket.name} ({ticket.role})</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('Helpdesk')}
                        className="bg-blue-500/10 text-blue-600 font-bold text-[9px] px-2.5 py-1 rounded"
                      >
                        Address Ticket
                      </button>
                    </div>
                  ))}
                  {supportTickets.filter(t => t.status === 'Open').length === 0 && (
                    <p className="text-slate-400 py-4 text-center">No open helpdesk tickets. All operations running smooth.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enroll Student Tab */}
        {activeTab === 'EnrollStudent' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Enroll New Student</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Create student account and automatically generate parent portal access.</p>
              </div>
            </div>

            <form onSubmit={handleEnrollStudent} className="glassmorphism p-6 rounded-2xl border border-white/50 shadow-lg space-y-5 max-w-2xl">
              {enrollError && (
                <div key={enrollShakeKey} className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold animate-shake">
                  {enrollError}
                </div>
              )}

              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Student Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" required placeholder="Student Full Name" value={enrollForm.name} onChange={(e) => setEnrollForm(prev => ({ ...prev, name: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                <input type="text" required placeholder="Register Number (Login ID)" value={enrollForm.registerNo} onChange={(e) => setEnrollForm(prev => ({ ...prev, registerNo: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <select value={enrollForm.class} onChange={(e) => setEnrollForm(prev => ({ ...prev, class: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500">
                  {['Playclass', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={enrollForm.section} onChange={(e) => setEnrollForm(prev => ({ ...prev, section: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500">
                  {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
                <div className="relative flex items-center w-full">
                  <input 
                    type={showEnrollPassword ? "text" : "password"} 
                    required 
                    placeholder="Password (created by Admin)" 
                    value={enrollForm.password} 
                    onChange={(e) => setEnrollForm(prev => ({ ...prev, password: e.target.value }))} 
                    className="w-full pl-3.5 pr-10 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowEnrollPassword(!showEnrollPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showEnrollPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <input type="text" placeholder="Mobile" value={enrollForm.phone} onChange={(e) => setEnrollForm(prev => ({ ...prev, phone: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={enrollForm.email} 
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, email: e.target.value }))} 
                  className={`px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 transition-all ${
                    enrollForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollForm.email)
                      ? 'border-red-500/70 focus:ring-red-500/30 text-red-655 dark:text-red-400' 
                      : 'border-slate-200 focus:ring-blue-500 dark:border-slate-800'
                  }`} 
                />
                <input type="text" placeholder="Address" value={enrollForm.address} onChange={(e) => setEnrollForm(prev => ({ ...prev, address: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Student Profile Photo</label>
                <div className="grid sm:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center overflow-hidden shrink-0">
                      {enrollForm.photo ? (
                        <img src={enrollForm.photo} alt="Student Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-slate-400" />
                      )}
                    </div>
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800 text-[11px] font-bold text-slate-655 dark:text-slate-300 transition-all">
                      Choose Photo File
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          compressImageDirectly(file, (croppedData) => {
                            setEnrollForm(prev => ({ ...prev, photo: croppedData }));
                          });
                          e.target.value = '';
                        }} 
                      />
                    </label>
                  </div>
                  <div className="relative w-full">
                    <input 
                      type="text" 
                      placeholder="— or paste photo link URL —" 
                      value={enrollForm.photo && enrollForm.photo.startsWith('data:') ? '✅ Photo uploaded (cropped)' : enrollForm.photo} 
                      onChange={(e) => setEnrollForm(prev => ({ ...prev, photo: e.target.value }))} 
                      readOnly={enrollForm.photo && enrollForm.photo.startsWith('data:')} 
                      className="w-full pr-16 px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                    />
                    {enrollForm.photo && (
                      <button 
                        type="button" 
                        onClick={() => setEnrollForm(prev => ({ ...prev, photo: '' }))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 text-[10px] font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Gallery Image Picker */}
                {galleryItems && galleryItems.filter(item => item.type === 'image').length > 0 && (
                  <div className="mt-2 border rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30">
                    <span className="text-[9px] text-slate-400 font-bold block mb-2">— or select from Gallery folder —</span>
                    <div className="grid grid-cols-6 gap-2 max-h-24 overflow-y-auto pr-1">
                      {galleryItems.filter(item => item.type === 'image').map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setEnrollForm(prev => ({ ...prev, photo: item.url }))}
                          className={`relative aspect-square rounded-lg overflow-hidden border hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 transition-all shrink-0 cursor-pointer ${enrollForm.photo === item.url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-200 dark:border-slate-800'}`}
                          title={item.title}
                        >
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 pt-2">Parent Information</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <input type="text" placeholder="Parent Name" value={enrollForm.parentName} onChange={(e) => setEnrollForm(prev => ({ ...prev, parentName: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                <input type="text" placeholder="Parent Mobile" value={enrollForm.parentPhone} onChange={(e) => setEnrollForm(prev => ({ ...prev, parentPhone: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                <input 
                  type="email" 
                  placeholder="Parent Email" 
                  value={enrollForm.parentEmail} 
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, parentEmail: e.target.value }))} 
                  className={`px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 transition-all ${
                    enrollForm.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollForm.parentEmail)
                      ? 'border-red-500/70 focus:ring-red-500/30 text-red-655 dark:text-red-400' 
                      : 'border-slate-200 focus:ring-blue-500 dark:border-slate-800'
                  }`} 
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200/50 dark:border-blue-900/50 text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                <strong>Note:</strong> The Student Login ID will be the Registration Number. A parent portal account will be automatically created using the same password. No photo upload is required for parent enrollment.
              </div>

              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow flex items-center gap-1.5">
                <UserPlus size={14} /> Enroll Student & Create Parent Account
              </button>
            </form>
          </div>
        )}

        {/* View Students Tab (Read-Only) */}
        {activeTab === 'Students' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold font-montserrat">Student Directory (Read Only)</h2>
              <p className="text-xs text-slate-400 font-light mt-1">Authorized database view. Student account creation is restricted to Super Admin only.</p>
            </div>

            {/* Search & Class Filter */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative max-w-sm w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search students by name or register no..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <select
                value={studentClassFilter}
                onChange={(e) => setStudentClassFilter(e.target.value)}
                className="px-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold"
              >
                <option value="All">All Classes</option>
                {['Playclass', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Student Table */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">Student</th>
                      <th className="p-4">Register Number</th>
                      <th className="p-4">Class</th>
                      <th className="p-4">Section</th>
                      <th className="p-4">Contact Parent</th>
                      <th className="p-4">Emergency</th>
                      <th className="p-4">Email ID</th>
                      <th className="p-4">Aadhaar ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150/40 dark:divide-slate-850 font-light">
                    {students.filter(s => {
                      const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.registerNo.toLowerCase().includes(studentSearch.toLowerCase());
                      const matchesClass = studentClassFilter === 'All' ? true : s.class === studentClassFilter;
                      return matchesSearch && matchesClass;
                    }).map((stud) => (
                      <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <img src={stud.photo} alt={stud.name} className="w-7 h-7 object-cover rounded-full border shadow-sm" />
                          {stud.name}
                        </td>
                        <td className="p-4 font-mono font-bold text-blue-650 dark:text-blue-400">{stud.registerNo}</td>
                        <td className="p-4 font-semibold">{stud.class}</td>
                        <td className="p-4 font-bold">{stud.section}</td>
                        <td className="p-4">
                          <p className="font-bold">{stud.parentName}</p>
                          <p className="text-[10px] text-slate-400">{stud.parentPhone}</p>
                        </td>
                        <td className="p-4 font-mono">{stud.emergencyContact}</td>
                        <td className="p-4 font-mono">{stud.email}</td>
                        <td className="p-4 font-mono text-slate-400">{stud.aadhaarNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Class-wise Student List Tab */}
        {activeTab === 'ClassWise' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Class-wise Student Directory</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Filter and view students by class from Playclass to Class 10.</p>
              </div>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold"
              >
                {allClassOptions.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>)}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">Student</th>
                      <th className="p-4">Register No</th>
                      <th className="p-4">Class</th>
                      <th className="p-4">Section</th>
                      <th className="p-4">Parent</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150/40 dark:divide-slate-850 font-light">
                    {students.filter(s => classFilter === 'All' || s.class === classFilter).map((stud) => (
                      <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <img src={stud.photo} alt={stud.name} className="w-7 h-7 object-cover rounded-full border shadow-sm" />
                          {stud.name}
                        </td>
                        <td className="p-4 font-mono font-bold text-blue-650 dark:text-blue-400">{stud.registerNo}</td>
                        <td className="p-4 font-semibold">{stud.class}</td>
                        <td className="p-4 font-bold">{stud.section}</td>
                        <td className="p-4">
                          <p className="font-bold">{stud.parentName}</p>
                          <p className="text-[10px] text-slate-400">{stud.parentPhone}</p>
                        </td>
                        <td className="p-4 font-mono">{stud.phone}</td>
                        <td className="p-4 font-bold">{stud.attendancePct}%</td>
                      </tr>
                    ))}
                    {students.filter(s => classFilter === 'All' || s.class === classFilter).length === 0 && (
                      <tr><td colSpan={7} className="p-8 text-center text-slate-400 text-xs">No students found in {classFilter}.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-slate-200/50 dark:border-slate-800 text-[10px] text-slate-400 font-semibold">
                Showing {students.filter(s => classFilter === 'All' || s.class === classFilter).length} student(s)
              </div>
            </div>
          </div>
        )}

        {/* View Teachers Tab (Read-Only) */}
        {activeTab === 'Teachers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold font-montserrat">Teacher Directory (Read Only)</h2>
              <p className="text-xs text-slate-400 font-light mt-1">Authorized faculty registry. Teacher account creation is restricted to Super Admin only.</p>
            </div>

            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search teachers by name..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">Teacher Name</th>
                      <th className="p-4">Employee ID</th>
                      <th className="p-4">Subject Specialty</th>
                      <th className="p-4">Qualification</th>
                      <th className="p-4">Mobile No</th>
                      <th className="p-4">Email ID</th>
                      <th className="p-4">Experience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150/40 dark:divide-slate-850 font-light">
                    {teachers.filter(t => t.name.toLowerCase().includes(teacherSearch.toLowerCase())).map((teach) => (
                      <tr key={teach.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <img src={teach.photo} alt={teach.name} className="w-7 h-7 object-cover rounded-full border shadow-sm" />
                          {teach.name}
                        </td>
                        <td className="p-4 font-mono font-bold text-blue-650 dark:text-blue-400">{teach.id}</td>
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{teach.subject}</td>
                        <td className="p-4">{teach.qualification}</td>
                        <td className="p-4">{teach.phone}</td>
                        <td className="p-4 font-mono">{teach.email}</td>
                        <td className="p-4">{teach.experience}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View Parents Tab (Read-Only) */}
        {activeTab === 'Parents' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold font-montserrat">Parents Directory (Read Only)</h2>
              <p className="text-xs text-slate-400 font-light mt-1">Guardian relationship indexes. Parent account creation is restricted to Super Admin only.</p>
            </div>

            {/* Search & Class Filter */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative max-w-sm w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search parents by name..."
                  value={parentSearch}
                  onChange={(e) => setParentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <select
                value={parentClassFilter}
                onChange={(e) => setParentClassFilter(e.target.value)}
                className="px-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold"
              >
                <option value="All">All Classes</option>
                {['Playclass', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">Parent Name</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Email ID</th>
                      <th className="p-4">Linked Student Pupils</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150/40 dark:divide-slate-850 font-light">
                    {parents.filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(parentSearch.toLowerCase());
                      const matchesClass = parentClassFilter === 'All' ? true : (p.childrenIds || []).some(cId => {
                        const kid = students.find(s => s.id === cId);
                        return kid && kid.class === parentClassFilter;
                      });
                      return matchesSearch && matchesClass;
                    }).map((par) => (
                      <tr key={par.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                          {par.name}
                        </td>
                        <td className="p-4">{par.phone}</td>
                        <td className="p-4 font-mono">{par.email}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {par.childrenIds.map(cId => {
                              const kid = students.find(s => s.id === cId);
                              return (
                                <span key={cId} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[9px]">
                                  {kid ? `${kid.name} (${kid.registerNo})` : cId}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Classes & Sections Management Tab */}
        {activeTab === 'Classes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Classes & Sections Management</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Classes card */}
              <div className="glassmorphism p-6 rounded-2xl border border-white/50 shadow-md space-y-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers size={16} /> Classes Directory
                </h3>
                
                <form onSubmit={handleAddClass} className="flex gap-2">
                  <input 
                    type="text" required placeholder="Add Class (e.g. Class 11)"
                    value={newClassVal}
                    onChange={(e) => setNewClassVal(e.target.value)}
                    className="flex-1 px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button type="submit" className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Plus size={14} /> Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border bg-slate-550/5 rounded-xl">
                  {classes.map(c => (
                    <span key={c} className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sections Card */}
              <div className="glassmorphism p-6 rounded-2xl border border-white/50 shadow-md space-y-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers size={16} /> Active Sections
                </h3>
                
                <form onSubmit={handleAddSection} className="flex gap-2">
                  <input 
                    type="text" required placeholder="Add Section (e.g. C)"
                    value={newSectionVal}
                    onChange={(e) => setNewSectionVal(e.target.value)}
                    className="flex-1 px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button type="submit" className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Plus size={14} /> Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 p-2 border bg-slate-550/5 rounded-xl">
                  {sections.map(s => (
                    <span key={s} className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">
                      Section {s}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Subjects tab */}
        {activeTab === 'Subjects' && (
          <div className="glassmorphism p-6 rounded-2xl border border-white/50 shadow-md space-y-6 max-w-xl">
            <h2 className="text-2xl font-extrabold font-montserrat flex items-center gap-1.5">
              <BookOpen size={24} className="text-blue-500" /> Subjects Curriculum Directory
            </h2>
            
            <form onSubmit={handleAddSubject} className="flex gap-2">
              <input 
                type="text" required placeholder="Add Course Subject (e.g. Chemistry)"
                value={newSubjectVal}
                onChange={(e) => setNewSubjectVal(e.target.value)}
                className="flex-1 px-3.5 py-2 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-1">
                <Plus size={14} /> Add Course
              </button>
            </form>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Academic Curriculum:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 border rounded-xl max-h-60 overflow-y-auto">
                {(subjects || []).map(sub => (
                  <div key={sub.id || sub.code} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border text-xs font-bold flex flex-wrap items-center justify-between gap-1.5 shadow-sm overflow-hidden break-words whitespace-normal text-left">
                    <span className="break-all">{sub.name} ({sub.code})</span>
                    <span className="text-[8px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded shrink-0">{sub.department || 'General'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Exams Tab */}
        {activeTab === 'Exams' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold font-montserrat">Schedule Academic Examinations</h2>
              <button 
                onClick={() => setShowAddExam(!showAddExam)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                {showAddExam ? <X size={14} /> : <Plus size={14} />} {showAddExam ? 'Close Schedule Form' : 'Schedule New Exam'}
              </button>
            </div>

            {showAddExam && (
              <form onSubmit={handleAddExamSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Exam Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" required placeholder="Exam Title (e.g. Physics Midterm)"
                    value={examForm.name}
                    onChange={(e) => setExamForm(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <select
                    value={examForm.examType}
                    onChange={(e) => setExamForm(prev => ({ ...prev, examType: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Unit Test">Unit Test</option>
                    <option value="Monthly Test">Monthly Test</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half Yearly">Half Yearly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <select
                    value={examForm.class}
                    onChange={(e) => setExamForm(prev => ({ ...prev, class: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={examForm.section}
                    onChange={(e) => setExamForm(prev => ({ ...prev, section: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="All">All Sections</option>
                    {sections.map(sec => <option key={sec} value={sec}>Section {sec}</option>)}
                  </select>
                  <select
                    value={examForm.subject}
                    onChange={(e) => setExamForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    {(subjects || []).map(s => <option key={s.id || s.code} value={s.code}>{s.name}</option>)}
                  </select>
                  <input 
                    type="date" required
                    value={examForm.date}
                    onChange={(e) => setExamForm(prev => ({ ...prev, date: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                  Publish Exam Schedule
                </button>
              </form>
            )}

            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Exam Name</th>
                      <th className="p-4">Exam Type</th>
                      <th className="p-4">Target Class / Section</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Exam Date</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                    {exams.map((ex) => (
                      <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{ex.name}</td>
                        <td className="p-4 font-semibold text-blue-600 dark:text-blue-400">{ex.examType}</td>
                        <td className="p-4 font-bold">{ex.class} {ex.section !== 'All' ? `(Sec ${ex.section})` : '(All)'}</td>
                        <td className="p-4 font-semibold text-emerald-500">{ex.subject}</td>
                        <td className="p-4 font-mono font-bold text-slate-500">{ex.date}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => deleteExam(ex.id)}
                            className="p-1 text-red-500 hover:bg-red-55 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Campus Facilities Management Tab */}
        {activeTab === 'Facilities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Campus Facilities Management</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Manage campus infrastructure and facility listings.</p>
              </div>
              <button
                onClick={() => setShowAddFacility(!showAddFacility)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                {showAddFacility ? <X size={14} /> : <Plus size={14} />} {showAddFacility ? 'Close' : 'Add Facility'}
              </button>
            </div>

            {showAddFacility && (
              <form onSubmit={handleAddFacility} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">New Facility</h3>
                <div className="grid grid-cols-6 gap-4">
                  <input type="text" placeholder="Icon Emoji" value={facilityForm.icon} onChange={(e) => setFacilityForm(prev => ({ ...prev, icon: e.target.value }))} className="col-span-1 px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-lg text-center focus:ring-1 focus:ring-blue-500" />
                  <input type="text" required placeholder="Facility Title" value={facilityForm.title} onChange={(e) => setFacilityForm(prev => ({ ...prev, title: e.target.value }))} className="col-span-5 px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500" />
                </div>
                <textarea required placeholder="Facility description..." value={facilityForm.description} onChange={(e) => setFacilityForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full p-3.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">Add Facility</button>
              </form>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              {facilities.map((fac) => (
                <div key={fac.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
                  {editingFacilityId === fac.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-6 gap-2">
                        <input type="text" value={editFacilityForm.icon} onChange={(e) => setEditFacilityForm(prev => ({ ...prev, icon: e.target.value }))} className="col-span-1 px-2 py-1 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-lg text-center" />
                        <input type="text" value={editFacilityForm.title} onChange={(e) => setEditFacilityForm(prev => ({ ...prev, title: e.target.value }))} className="col-span-5 px-2 py-1 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs" />
                      </div>
                      <textarea value={editFacilityForm.description} onChange={(e) => setEditFacilityForm(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full p-2 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs" />
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveEditFacility(fac.id)} className="bg-emerald-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg">Save</button>
                        <button onClick={() => setEditingFacilityId(null)} className="bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] px-3 py-1 rounded-lg">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{fac.icon}</span>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{fac.title}</h4>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => handleStartEditFacility(fac)} className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded"><Edit2 size={13} /></button>
                          <button onClick={() => { if (window.confirm('Delete this facility?')) deleteFacility(fac.id); }} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"><Trash2 size={13} /></button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-550 dark:text-slate-350 leading-relaxed font-light">{fac.description}</p>
                    </>
                  )}
                </div>
              ))}
              {facilities.length === 0 && (
                <div className="sm:col-span-2 text-center py-8 text-slate-400 text-xs">No facilities added yet.</div>
              )}
            </div>
          </div>
        )}

        {/* Online Admissions Tab */}
        {activeTab === 'Admissions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold font-montserrat">Online Admissions Desk</h2>
              <div className="flex gap-2">
                {['Pending', 'Approved', 'Rejected'].map(s => (
                  <button
                    key={s}
                    onClick={() => setAdmissionFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      admissionFilter === s 
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {s} ({admissions.filter(a => a.status === s).length})
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400 font-light mt-1">Review student applications submitted online, highlight key details, and update application information.</p>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Table of Applications */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Grade</th>
                        <th className="p-4">Parent Name</th>
                        <th className="p-4">Contact info</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                      {admissions.filter(a => a.status === admissionFilter).map((adm) => (
                        <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="p-4">
                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                              {adm.studentName}
                              {Object.values(adm.starredFields || {}).some(Boolean) && <span className="text-amber-500 font-bold">★</span>}
                            </p>
                            <p className="text-[10px] text-slate-400">DOB: {adm.dob}</p>
                          </td>
                          <td className="p-4 font-semibold">{adm.grade || adm.gradeApplied}</td>
                          <td className="p-4 font-medium">{adm.parentName}</td>
                          <td className="p-4 font-mono text-[10px] space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>📞 {adm.parentPhone || adm.phone}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rawPhone = adm.whatsappNumber || adm.parentPhone || adm.phone || '';
                                  const cleaned = cleanPhoneForWhatsapp(rawPhone);
                                  const text = `Dear ${adm.parentName}, regarding your admission application for ${adm.studentName} to ${adm.grade || adm.gradeApplied} at Sri Vani Vidyanikethan...`;
                                  window.open(`https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                className="px-1.5 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-bold transition flex items-center gap-0.5 cursor-pointer"
                                title="Chat on WhatsApp"
                              >
                                📱 WhatsApp
                              </button>
                            </div>
                            <p>✉️ {adm.parentEmail || adm.email}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              adm.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                              adm.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                              'bg-amber-500/10 text-amber-600'
                            }`}>{adm.status}</span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedAdmission(adm);
                                setEditingAdmission({ ...adm });
                              }}
                              className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/15 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold transition-all border border-blue-200/50 dark:border-blue-800/80 cursor-pointer"
                            >
                              Review &amp; Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                      {admissions.filter(a => a.status === admissionFilter).length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">No applications found with status: {admissionFilter}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Review & Edit Panel (Sticky/Detailed) */}
              <div className="lg:col-span-4">
                {selectedAdmission && editingAdmission ? (
                  <div className="glassmorphism p-6 rounded-2xl border border-white/50 shadow-lg space-y-6 text-left animate-fade-in">
                    <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Review Candidate</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {selectedAdmission.id}</p>
                      </div>
                      <button 
                        onClick={() => { setSelectedAdmission(null); setEditingAdmission(null); }}
                        className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-1 rounded-lg transition"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      updateAdmissionFields(editingAdmission.id, editingAdmission);
                      setSelectedAdmission({ ...editingAdmission });
                      alert('Applicant details updated successfully.');
                    }} className="space-y-4 text-xs">
                      {/* Field Student Name */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                            Student Name
                            {editingAdmission.starredFields?.studentName && <span className="text-amber-500 font-bold">★</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              toggleAdmissionFieldStar(editingAdmission.id, 'studentName');
                              setEditingAdmission(prev => ({
                                ...prev,
                                starredFields: {
                                  ...(prev.starredFields || {}),
                                  studentName: !prev.starredFields?.studentName
                                }
                              }));
                            }}
                            className={`p-1 rounded transition text-[10px] ${
                              editingAdmission.starredFields?.studentName 
                                ? 'text-amber-500 bg-amber-500/10' 
                                : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-900/50'
                            }`}
                            title="Highlight Field"
                          >
                            ★
                          </button>
                        </div>
                        <input
                          type="text" required
                          value={editingAdmission.studentName}
                          onChange={(e) => setEditingAdmission(prev => ({ ...prev, studentName: e.target.value }))}
                          className="w-full px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Field DOB */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                            Date of Birth
                            {editingAdmission.starredFields?.dob && <span className="text-amber-500 font-bold">★</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              toggleAdmissionFieldStar(editingAdmission.id, 'dob');
                              setEditingAdmission(prev => ({
                                ...prev,
                                starredFields: {
                                  ...(prev.starredFields || {}),
                                  dob: !prev.starredFields?.dob
                                }
                              }));
                            }}
                            className={`p-1 rounded transition text-[10px] ${
                              editingAdmission.starredFields?.dob 
                                ? 'text-amber-500 bg-amber-500/10' 
                                : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-900/50'
                            }`}
                          >
                            ★
                          </button>
                        </div>
                        <input
                          type="date" required
                          value={editingAdmission.dob}
                          onChange={(e) => setEditingAdmission(prev => ({ ...prev, dob: e.target.value }))}
                          className="w-full px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Field Grade */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                            Target Grade
                            {editingAdmission.starredFields?.grade && <span className="text-amber-500 font-bold">★</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              toggleAdmissionFieldStar(editingAdmission.id, 'grade');
                              setEditingAdmission(prev => ({
                                ...prev,
                                starredFields: {
                                  ...(prev.starredFields || {}),
                                  grade: !prev.starredFields?.grade
                                }
                              }));
                            }}
                            className={`p-1 rounded transition text-[10px] ${
                              editingAdmission.starredFields?.grade 
                                ? 'text-amber-500 bg-amber-500/10' 
                                : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-900/50'
                            }`}
                          >
                            ★
                          </button>
                        </div>
                        <select
                          value={editingAdmission.grade || editingAdmission.gradeApplied}
                          onChange={(e) => setEditingAdmission(prev => ({ ...prev, grade: e.target.value, gradeApplied: e.target.value }))}
                          className="w-full px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                        >
                          {['Playclass', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      {/* Field Parent Name */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                            Parent Name
                            {editingAdmission.starredFields?.parentName && <span className="text-amber-500 font-bold">★</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              toggleAdmissionFieldStar(editingAdmission.id, 'parentName');
                              setEditingAdmission(prev => ({
                                ...prev,
                                starredFields: {
                                  ...(prev.starredFields || {}),
                                  parentName: !prev.starredFields?.parentName
                                }
                              }));
                            }}
                            className={`p-1 rounded transition text-[10px] ${
                              editingAdmission.starredFields?.parentName 
                                ? 'text-amber-500 bg-amber-500/10' 
                                : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-900/50'
                            }`}
                          >
                            ★
                          </button>
                        </div>
                        <input
                          type="text" required
                          value={editingAdmission.parentName}
                          onChange={(e) => setEditingAdmission(prev => ({ ...prev, parentName: e.target.value }))}
                          className="w-full px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Field Parent Phone */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                            Parent Phone
                            {editingAdmission.starredFields?.parentPhone && <span className="text-amber-500 font-bold">★</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              toggleAdmissionFieldStar(editingAdmission.id, 'parentPhone');
                              setEditingAdmission(prev => ({
                                ...prev,
                                starredFields: {
                                  ...(prev.starredFields || {}),
                                  parentPhone: !prev.starredFields?.parentPhone
                                }
                              }));
                            }}
                            className={`p-1 rounded transition text-[10px] ${
                              editingAdmission.starredFields?.parentPhone 
                                ? 'text-amber-500 bg-amber-500/10' 
                                : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-900/50'
                            }`}
                          >
                            ★
                          </button>
                        </div>
                        <input
                          type="text" required
                          value={editingAdmission.parentPhone || editingAdmission.phone}
                          onChange={(e) => setEditingAdmission(prev => ({ ...prev, parentPhone: e.target.value, phone: e.target.value }))}
                          className="w-full px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Field WhatsApp Number */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                            WhatsApp Number
                            {editingAdmission.starredFields?.whatsappNumber && <span className="text-amber-500 font-bold">★</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              toggleAdmissionFieldStar(editingAdmission.id, 'whatsappNumber');
                              setEditingAdmission(prev => ({
                                ...prev,
                                starredFields: {
                                  ...(prev.starredFields || {}),
                                  whatsappNumber: !prev.starredFields?.whatsappNumber
                                }
                              }));
                            }}
                            className={`p-1 rounded transition text-[10px] ${
                              editingAdmission.starredFields?.whatsappNumber 
                                ? 'text-amber-500 bg-amber-500/10' 
                                : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-900/50'
                            }`}
                          >
                            ★
                          </button>
                        </div>
                        <input
                          type="text"
                          value={editingAdmission.whatsappNumber || ''}
                          onChange={(e) => setEditingAdmission(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                          className="w-full px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                          placeholder="e.g. 9876543210 (if blank, Parent Phone is used)"
                        />
                      </div>

                      {/* Field Parent Email */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                            Parent Email
                            {editingAdmission.starredFields?.parentEmail && <span className="text-amber-500 font-bold">★</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              toggleAdmissionFieldStar(editingAdmission.id, 'parentEmail');
                              setEditingAdmission(prev => ({
                                ...prev,
                                starredFields: {
                                  ...(prev.starredFields || {}),
                                  parentEmail: !prev.starredFields?.parentEmail
                                }
                              }));
                            }}
                            className={`p-1 rounded transition text-[10px] ${
                              editingAdmission.starredFields?.parentEmail 
                                ? 'text-amber-500 bg-amber-500/10' 
                                : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-900/50'
                            }`}
                          >
                            ★
                          </button>
                        </div>
                        <input
                          type="email" required
                          value={editingAdmission.parentEmail || editingAdmission.email}
                          onChange={(e) => setEditingAdmission(prev => ({ ...prev, parentEmail: e.target.value, email: e.target.value }))}
                          className="w-full px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Field Address */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                            Address
                            {editingAdmission.starredFields?.address && <span className="text-amber-500 font-bold">★</span>}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              toggleAdmissionFieldStar(editingAdmission.id, 'address');
                              setEditingAdmission(prev => ({
                                ...prev,
                                starredFields: {
                                  ...(prev.starredFields || {}),
                                  address: !prev.starredFields?.address
                                }
                              }));
                            }}
                            className={`p-1 rounded transition text-[10px] ${
                              editingAdmission.starredFields?.address 
                                ? 'text-amber-500 bg-amber-500/10' 
                                : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-900/50'
                            }`}
                          >
                            ★
                          </button>
                        </div>
                        <textarea
                          rows={2} required
                          value={editingAdmission.address}
                          onChange={(e) => setEditingAdmission(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-center shadow-md cursor-pointer transition text-xs whitespace-nowrap"
                        >
                          Save Changes
                        </button>
                            <button
                              type="button"
                              onClick={() => {
                                // Save current form edits first, then approve using edited values
                                updateAdmissionFields(editingAdmission.id, editingAdmission);
                                approveAdmission(editingAdmission.id, editingAdmission);
                                setSelectedAdmission(null);
                                setEditingAdmission(null);
                                alert('Admission application APPROVED!');
                                
                                const parentPhone = editingAdmission.whatsappNumber || editingAdmission.parentPhone || editingAdmission.phone || '';
                                const cleanedPhone = cleanPhoneForWhatsapp(parentPhone);
                                const messageText = `Dear ${editingAdmission.parentName}, your admission application for ${editingAdmission.studentName} to ${editingAdmission.grade || editingAdmission.gradeApplied} at Sri Vani Vidyanikethan has been APPROVED! Please visit the school with required documents to complete the enrollment. Welcome to our school family!`;
                                const waUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(messageText)}`;
                                window.open(waUrl, '_blank');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-center shadow-md cursor-pointer transition text-xs whitespace-nowrap"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                // Save current form edits first, then reject using edited values
                                updateAdmissionFields(editingAdmission.id, editingAdmission);
                                rejectAdmission(editingAdmission.id, editingAdmission);
                                setSelectedAdmission(null);
                                setEditingAdmission(null);
                                alert('Admission application REJECTED.');

                                const parentPhone = editingAdmission.whatsappNumber || editingAdmission.parentPhone || editingAdmission.phone || '';
                                const cleanedPhone = cleanPhoneForWhatsapp(parentPhone);
                                const messageText = `Dear ${editingAdmission.parentName}, thank you for your interest in Sri Vani Vidyanikethan. We regret to inform you that your admission application for ${editingAdmission.studentName} has been declined. For any further queries, please contact the school administration office.`;
                                const waUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(messageText)}`;
                                window.open(waUrl, '_blank');
                              }}
                              className="bg-red-500 hover:bg-red-650 text-white font-bold px-4 py-2 rounded-xl text-center shadow-md cursor-pointer transition text-xs whitespace-nowrap"
                            >
                              Reject
                            </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-8 text-center glassmorphism rounded-2xl border text-slate-400 italic text-xs font-light">
                    Select an application row to view details, toggle field-level highlight stars, or update candidate information.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leave Requests Tab */}
        {activeTab === 'Leaves' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold font-montserrat">Student Leave Applications</h2>
              <div className="flex gap-2">
                {['Pending', 'Approved', 'Rejected'].map(s => (
                  <button
                    key={s}
                    onClick={() => setLeaveFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      leaveFilter === s 
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {s} ({leaveRequests.filter(l => l.status === s).length})
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400 font-light mt-1">Review leave applications submitted by students, approve or reject them, and provide feedback messages.</p>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Class &amp; Sec</th>
                      <th className="p-4">Leave Type</th>
                      <th className="p-4">Dates</th>
                      <th className="p-4">Reason</th>
                      <th className="p-4">Admin message / Response</th>
                      {leaveFilter === 'Pending' && <th className="p-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                    {leaveRequests.filter(l => l.status === leaveFilter).map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{leave.studentName}</td>
                        <td className="p-4 font-semibold">{leave.class} - {leave.section}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-650 dark:text-slate-350">{leave.startDate} to {leave.endDate}</td>
                        <td className="p-4 text-slate-550 dark:text-slate-400 italic">"{leave.reason}"</td>
                        <td className="p-4">
                          {leave.status === 'Pending' ? (
                            <input
                              type="text"
                              placeholder="Write a message (e.g. Get well soon)..."
                              value={adminFeedbackMsg[leave.id] || ''}
                              onChange={(e) => setAdminFeedbackMsg({ ...adminFeedbackMsg, [leave.id]: e.target.value })}
                              className="px-2 py-1.5 w-full border rounded-lg bg-white/70 dark:bg-slate-900/50 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="text-slate-600 dark:text-slate-300 italic font-mono">"{leave.adminMessage || 'No feedback message.'}"</p>
                          )}
                        </td>
                        {leave.status === 'Pending' && (
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => {
                                const msg = adminFeedbackMsg[leave.id] || 'Approved.';
                                updateLeaveStatus(leave.id, 'Approved', msg);
                                alert('Leave application approved.');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => {
                                const msg = adminFeedbackMsg[leave.id] || 'Rejected.';
                                updateLeaveStatus(leave.id, 'Rejected', msg);
                                alert('Leave application rejected.');
                              }}
                              className="px-2.5 py-1 bg-red-500 hover:bg-red-650 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              ✗ Reject
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {leaveRequests.filter(l => l.status === leaveFilter).length === 0 && (
                      <tr><td colSpan={leaveFilter === 'Pending' ? 7 : 6} className="p-8 text-center text-slate-400 italic">No leave applications found with status: {leaveFilter}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Circulars Notice board */}
        {activeTab === 'Circulars' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-extrabold font-montserrat">School Notice & Circulars</h2>
              <button 
                onClick={() => setShowAddCircular(!showAddCircular)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                {showAddCircular ? <X size={14} /> : <Plus size={14} />} {showAddCircular ? 'Close Notice panel' : 'Publish Notice Circular'}
              </button>
            </div>

            {showAddCircular && (
              <form onSubmit={handleAddCircularSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">New Notice Publication</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" required placeholder="Notice Title"
                    value={circularForm.title}
                    onChange={(e) => setCircularForm(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <select
                    value={circularForm.targetGroup}
                    onChange={(e) => setCircularForm(prev => ({ ...prev, targetGroup: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="All">Everyone (Public)</option>
                    <option value="Teachers">Faculty Staff Only</option>
                    <option value="Parents">Parents Only</option>
                  </select>
                </div>
                <textarea 
                  required placeholder="Type circular content message details..."
                  value={circularForm.content}
                  onChange={(e) => setCircularForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full p-3.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                  Broadcast Notice
                </button>
              </form>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {circulars.map((circ) => (
                <div key={circ.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded uppercase">Target: {circ.targetGroup}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-mono">{circ.date}</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete this notice: "${circ.title}"?`)) {
                            deleteCircular(circ.id);
                          }
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{circ.title}</h3>
                  <p className="text-xs text-slate-550 dark:text-slate-350 leading-relaxed font-light">{circ.content}</p>
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-2 text-[9px] text-slate-400">
                    Broadcaster: <strong className="text-slate-500">{circ.postedBy}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Reports Tab */}
        {activeTab === 'Reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Generate Summary & Analytical Reports</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            <form onSubmit={handleGenerateReport} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => { setReportType(e.target.value); setGeneratedReport(null); }}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Attendance">Attendance Report</option>
                  <option value="Grades">Academic Performance Grades</option>
                  <option value="Support">Support Ticket Logs</option>
                </select>
              </div>

              {reportType !== 'Support' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Class Group</label>
                  <select
                    value={reportClass}
                    onChange={(e) => { setReportClass(e.target.value); setGeneratedReport(null); }}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5">
                <RefreshCw size={14} /> Compile Report
              </button>
            </form>

            {generatedReport && (
              <div className="bg-white dark:bg-slate-800/60 border rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex justify-between items-start border-b pb-3 border-slate-200/55 dark:border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{generatedReport.title}</h3>
                    <p className="text-[9px] text-slate-400">Generated on: {generatedReport.timestamp}</p>
                  </div>
                  <button 
                    onClick={() => alert("Simulating mock PDF file transmission download.")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    <Download size={12} /> Export Document
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                        {generatedReport.headers.map((h, idx) => (
                          <th key={idx} className="p-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y font-light">
                      {generatedReport.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Helpdesk tickets response */}
        {activeTab === 'Helpdesk' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Helpdesk & Support Support</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white dark:bg-slate-800/60 border rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">Ticket #{ticket.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>{ticket.status}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{ticket.subject}</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Submitted by: {ticket.name} ({ticket.role}) | {ticket.date}</p>
                  </div>
                  <p className="text-xs text-slate-550 dark:text-slate-355 leading-relaxed font-light">{ticket.description}</p>
                  
                  {ticket.response ? (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/55 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">Response from Head Office:</p>
                      <p className="text-slate-550 dark:text-slate-355 mt-1 font-light">{ticket.response}</p>
                    </div>
                  ) : (
                    <div className="pt-2 flex gap-2">
                      <input 
                        type="text" placeholder="Type support response action details..."
                        value={ticketReplyText[ticket.id] || ''}
                        onChange={(e) => setTicketReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                        className="flex-1 px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <button 
                        onClick={() => handleReplyTicket(ticket.id)}
                        className="bg-emerald-600 text-white font-bold text-xs px-4 py-1.5 rounded-xl"
                      >
                        Submit Response
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attendance History tab */}
        {activeTab === 'AttendanceLog' && (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-extrabold font-montserrat">School Attendance Logs</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>
            
            {/* Search Bar / Filters */}
            <div className="glassmorphism p-4 rounded-xl border border-white/40 shadow-md flex flex-wrap gap-4 items-center">
              <div className="flex gap-2">
                <select 
                  value={adminAttendanceSearchClass} 
                  onChange={(e) => setAdminAttendanceSearchClass(e.target.value)}
                  className="px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                >
                  <option value="Playclass">Playclass</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
                <select 
                  value={adminAttendanceSearchSection} 
                  onChange={(e) => setAdminAttendanceSearchSection(e.target.value)}
                  className="px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>
              
              <input
                type="text"
                placeholder="Search by student name or register number..."
                value={adminAttendanceSearchQuery}
                onChange={(e) => setAdminAttendanceSearchQuery(e.target.value)}
                className="px-3.5 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 flex-1 min-w-[200px]"
              />
            </div>

            {adminSelectedStudentAttendance ? (
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-lg space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{adminSelectedStudentAttendance.name}</h4>
                    <p className="text-[10px] text-slate-400 font-light">Reg No: {adminSelectedStudentAttendance.registerNo} | Class: {adminSelectedStudentAttendance.class} - Sec {adminSelectedStudentAttendance.section}</p>
                  </div>
                  <button
                    onClick={() => setAdminSelectedStudentAttendance(null)}
                    className="bg-slate-200 dark:bg-slate-850 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Back to List
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/5 dark:bg-blue-950/10 rounded-xl border border-blue-500/10 text-center">
                    <p className="text-[10px] text-slate-450 uppercase font-bold">Overall Percentage</p>
                    <p className="text-3xl font-black text-blue-600 mt-1">{adminSelectedStudentAttendance.attendancePct || 0}%</p>
                  </div>
                  <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/10 rounded-xl border border-emerald-500/10 text-center">
                    <p className="text-[10px] text-slate-450 uppercase font-bold">Status</p>
                    <p className="text-xl font-bold text-emerald-600 mt-2">
                      {(adminSelectedStudentAttendance.attendancePct || 0) >= 75 ? "Good Standing" : "Low Attendance Alert"}
                    </p>
                  </div>
                </div>

                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 mt-4">Session-by-Session Logs</h5>
                <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-450 uppercase font-bold text-[9px]">
                        <th className="p-3">Date</th>
                        <th className="p-3">Session</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                      {attendance.filter(a => a.studentId === adminSelectedStudentAttendance.id).map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="p-3 font-semibold">{log.date}</td>
                          <td className="p-3">{log.session}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.status === 'Present' ? 'bg-emerald-500/10 text-emerald-600' :
                              log.status === 'Absent' ? 'bg-red-500/10 text-red-655' :
                              log.status === 'Half Day' ? 'bg-blue-500/10 text-blue-600' :
                              'bg-amber-500/10 text-amber-600'
                            }`}>{log.status}</span>
                          </td>
                        </tr>
                      ))}
                      {attendance.filter(a => a.studentId === adminSelectedStudentAttendance.id).length === 0 && (
                        <tr>
                          <td colSpan="3" className="p-6 text-center text-slate-400 italic">No attendance records found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Register Number</th>
                        <th className="p-4">Class & Section</th>
                        <th className="p-4">Average Attendance %</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                      {students.filter(s => 
                        s.class === adminAttendanceSearchClass && 
                        s.section === adminAttendanceSearchSection && 
                        (s.name.toLowerCase().includes(adminAttendanceSearchQuery.toLowerCase()) || 
                         s.registerNo.toLowerCase().includes(adminAttendanceSearchQuery.toLowerCase()))
                      ).map((stud) => (
                        <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{stud.name}</td>
                          <td className="p-4 font-mono">{stud.registerNo}</td>
                          <td className="p-4">{stud.class} - {stud.section}</td>
                          <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{stud.attendancePct || 0}%</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setAdminSelectedStudentAttendance(stud)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              View Detailed Log
                            </button>
                          </td>
                        </tr>
                      ))}
                      {students.filter(s => 
                        s.class === adminAttendanceSearchClass && 
                        s.section === adminAttendanceSearchSection && 
                        (s.name.toLowerCase().includes(adminAttendanceSearchQuery.toLowerCase()) || 
                         s.registerNo.toLowerCase().includes(adminAttendanceSearchQuery.toLowerCase()))
                      ).length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-slate-400 italic">No matching students found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grading Scheme tab */}
        {activeTab === 'GradingScheme' && (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-extrabold font-montserrat">Academic Grading Scheme Settings</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>
            
            <div className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-md space-y-4">
              <p className="text-xs text-slate-500 font-light">Customize grade letters, marks percentage ranges, and remarks. These mappings will be used globally for assignments, exams, and student report cards.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Grade Label</th>
                      <th className="p-3">Percentage Range (e.g. 91-100)</th>
                      <th className="p-3">Description / Remarks</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-light">
                    {(gradingScheme || []).map((row, idx) => (
                      <tr key={row.id || idx} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <input 
                            type="text" 
                            value={row.grade} 
                            onChange={(e) => {
                              const newScheme = [...gradingScheme];
                              newScheme[idx].grade = e.target.value;
                              updateGradingScheme(newScheme);
                            }}
                            className="px-2 py-1 w-20 border rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-xs"
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            type="text" 
                            value={row.range} 
                            onChange={(e) => {
                              const newScheme = [...gradingScheme];
                              newScheme[idx].range = e.target.value;
                              updateGradingScheme(newScheme);
                            }}
                            className="px-2 py-1 w-28 border rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold"
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            type="text" 
                            value={row.description} 
                            onChange={(e) => {
                              const newScheme = [...gradingScheme];
                              newScheme[idx].description = e.target.value;
                              updateGradingScheme(newScheme);
                            }}
                            className="px-2 py-1 w-full border rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-light"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              const newScheme = gradingScheme.filter((_, i) => i !== idx);
                              updateGradingScheme(newScheme);
                            }}
                            className="text-red-500 hover:text-red-750 font-bold text-xs cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const newScheme = [...(gradingScheme || []), { id: Date.now().toString(), grade: 'New', range: '0-0', description: 'New Grade Description' }];
                    updateGradingScheme(newScheme);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow cursor-pointer"
                >
                  + Add New Grade Level
                </button>
              </div>
            </div>
          </div>
        )}

        {cropImageSrc && (
          <ImageCropperModal
            src={cropImageSrc}
            onCrop={(croppedData) => {
              setEnrollForm(prev => ({ ...prev, photo: croppedData }));
              setCropImageSrc(null);
            }}
            onCancel={() => {
              setCropImageSrc(null);
            }}
          />
        )}
      </div>

    </div>
  );
}

// Reusable custom canvas-based image cropper
function ImageCropperModal({ src, shape = 'circle', onCrop, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [cropShape, setCropShape] = useState(shape);
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(0);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      imageRef.current = img;
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setImageLoaded(c => c + 1);
    };
    img.src = src;
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');

    const ratio = Math.max(200 / img.width, 200 / img.height);
    const imgWidth = img.width * ratio;
    const imgHeight = img.height * ratio;

    ctx.clearRect(0, 0, 300, 300);
    ctx.save();
    ctx.translate(150 + offsetX, 150 + offsetY);
    ctx.scale(zoom, zoom);
    ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    ctx.restore();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.beginPath();
    ctx.rect(0, 0, 300, 300);
    if (cropShape === 'circle') {
      ctx.arc(150, 150, 100, 0, 2 * Math.PI, true);
    } else {
      ctx.moveTo(50, 50);
      ctx.lineTo(50, 250);
      ctx.lineTo(250, 250);
      ctx.lineTo(250, 50);
      ctx.closePath();
    }
    ctx.fill();

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (cropShape === 'circle') {
      ctx.arc(150, 150, 100, 0, 2 * Math.PI);
    } else {
      ctx.rect(50, 50, 200, 200);
    }
    ctx.stroke();
  }, [zoom, offsetX, offsetY, cropShape, src, imageLoaded]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - offsetX, y: e.clientY - offsetY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setOffsetX(e.clientX - dragStart.current.x);
    setOffsetY(e.clientY - dragStart.current.y);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      dragStart.current = { x: e.touches[0].clientX - offsetX, y: e.touches[0].clientY - offsetY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    setOffsetX(e.touches[0].clientX - dragStart.current.x);
    setOffsetY(e.touches[0].clientY - dragStart.current.y);
  };

  const handleExport = () => {
    const img = imageRef.current;
    if (!img) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 200;
    exportCanvas.height = 200;
    const ectx = exportCanvas.getContext('2d');

    const ratio = Math.max(200 / img.width, 200 / img.height);
    const imgWidth = img.width * ratio;
    const imgHeight = img.height * ratio;

    ectx.save();
    ectx.translate(100 + offsetX, 100 + offsetY);
    ectx.scale(zoom, zoom);
    ectx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    ectx.restore();

    const croppedDataUrl = exportCanvas.toDataURL('image/jpeg', 0.75);
    onCrop(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center p-6 text-center">
        <h3 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white mb-0.5">Crop Profile Picture</h3>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4 font-medium">Drag to position • Use slider to zoom</p>

        <div 
          className="relative w-[300px] h-[300px] bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden cursor-move border border-slate-200 dark:border-slate-800 shadow-inner mb-4"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <canvas 
            ref={canvasRef} 
            width={300} 
            height={300} 
            className="block"
          />
        </div>

        <div className="w-full flex items-center gap-3 mb-4 px-2">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">A</span>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="0.05"
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
          />
          <span className="text-xs font-bold text-slate-400 dark:text-slate-600">A+</span>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setCropShape('circle')}
            type="button"
            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${cropShape === 'circle' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}
          >
            Circle Crop
          </button>
          <button
            onClick={() => setCropShape('square')}
            type="button"
            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${cropShape === 'square' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}
          >
            Square Crop
          </button>
        </div>

        <div className="w-full flex gap-3 text-left">
          <button 
            onClick={onCancel}
            type="button"
            className="flex-1 px-4 py-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 text-center transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleExport}
            type="button"
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

