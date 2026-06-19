import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Users, GraduationCap, Calendar, FileText, Settings, Plus, Trash2, 
  Search, Award, MessageSquare, AlertCircle, RefreshCw, Layers, BookOpen, Download, FileSpreadsheet,
  Edit2, Building2, X, UserPlus 
} from 'lucide-react';

export default function AdminPortal() {
  const { 
    students,
    teachers,
    parents,
    circulars, createCircular,
    exams, createExam, deleteExam,
    classes, setClasses,
    sections, setSections,
    subjects, setSubjects,
    supportTickets, replySupportTicket,
    logoutUser,
    facilities, addFacility, editFacility, deleteFacility,
    addStudent, addParent
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('Dashboard');
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
  const [examForm, setExamForm] = useState({ name: '', examType: 'Unit Test', class: 'Class 10', subject: 'PHYSICS', date: '' });

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
    const cleanSub = newSubjectVal.trim().toUpperCase();
    if (subjects.includes(cleanSub)) {
      alert("Subject already exists.");
      return;
    }
    setSubjects([...subjects, cleanSub]);
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
    setExamForm({ name: '', examType: 'Unit Test', class: 'Class 10', subject: 'PHYSICS', date: '' });
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

  const handleEnrollStudent = (e) => {
    e.preventDefault();
    if (!enrollForm.name || !enrollForm.registerNo || !enrollForm.password) {
      alert('Please fill Student Name, Register Number, and Password.');
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
      photo: enrollForm.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      password: enrollForm.password
    });
    if (!studentResult.success) {
      alert(studentResult.message);
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
    setEnrollForm({
      name: '', registerNo: '', class: 'Class 10', section: 'A', password: '',
      phone: '', email: '', address: '',
      parentName: '', parentPhone: '', parentEmail: '',
      photo: ''
    });
    setShowEnrollStudent(false);
    alert('Student enrolled and parent portal account created successfully!');
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
              { id: 'Students', icon: Users, label: 'View Students' },
              { id: 'ClassWise', icon: Layers, label: 'Class-wise Students' },
              { id: 'Teachers', icon: GraduationCap, label: 'View Teachers' },
              { id: 'Parents', icon: Users, label: 'View Parents' },
              { id: 'Classes', icon: Layers, label: 'Classes & Sections' },
              { id: 'Subjects', icon: BookOpen, label: 'Subjects Directory' },
              { id: 'Exams', icon: Award, label: 'Create Exams' },
              { id: 'Facilities', icon: Building2, label: 'Campus Facilities' },
              { id: 'Circulars', icon: FileText, label: 'Notice Board' },
              { id: 'Reports', icon: FileSpreadsheet, label: 'Generate Reports' },
              { id: 'Helpdesk', icon: MessageSquare, label: 'Helpdesk Tickets' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
      <div className="flex-1 space-y-6">
        
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
                <p className="text-[10px] text-blue-500 font-semibold mt-1">{subjects.length} Departments</p>
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
                <input type="password" required placeholder="Password (created by Admin)" value={enrollForm.password} onChange={(e) => setEnrollForm(prev => ({ ...prev, password: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <input type="text" placeholder="Mobile" value={enrollForm.phone} onChange={(e) => setEnrollForm(prev => ({ ...prev, phone: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                <input type="email" placeholder="Email" value={enrollForm.email} onChange={(e) => setEnrollForm(prev => ({ ...prev, email: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
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
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800 text-[11px] font-bold text-slate-650 dark:text-slate-300 transition-all">
                      Choose Photo File
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setEnrollForm(prev => ({ ...prev, photo: ev.target.result }));
                          };
                          reader.readAsDataURL(file);
                        }} 
                      />
                    </label>
                  </div>
                  <input 
                    type="text" 
                    placeholder="— or paste photo link URL —" 
                    value={enrollForm.photo} 
                    onChange={(e) => setEnrollForm(prev => ({ ...prev, photo: e.target.value }))} 
                    className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
              </div>

              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 pt-2">Parent Information</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <input type="text" placeholder="Parent Name" value={enrollForm.parentName} onChange={(e) => setEnrollForm(prev => ({ ...prev, parentName: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                <input type="text" placeholder="Parent Mobile" value={enrollForm.parentPhone} onChange={(e) => setEnrollForm(prev => ({ ...prev, parentPhone: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                <input type="email" placeholder="Parent Email" value={enrollForm.parentEmail} onChange={(e) => setEnrollForm(prev => ({ ...prev, parentEmail: e.target.value }))} className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" />
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
                <table className="w-full text-xs text-left">
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
                <table className="w-full text-xs text-left">
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
                <table className="w-full text-xs text-left">
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
                <table className="w-full text-xs text-left">
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
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 border rounded-xl max-h-60 overflow-y-auto">
                {subjects.map(sub => (
                  <div key={sub} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border text-xs font-bold flex items-center justify-between shadow-sm">
                    <span>{sub}</span>
                    <span className="text-[8px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">Core Subject</span>
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
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={examForm.class}
                    onChange={(e) => setExamForm(prev => ({ ...prev, class: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={examForm.subject}
                    onChange={(e) => setExamForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
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
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Exam Name</th>
                      <th className="p-4">Exam Type</th>
                      <th className="p-4">Target Class</th>
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
                        <td className="p-4 font-bold">{ex.class}</td>
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
                    <span className="text-[9px] text-slate-400 font-mono">{circ.date}</span>
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
                  <table className="w-full text-xs text-left">
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
                  <p className="text-xs text-slate-550 dark:text-slate-350 leading-relaxed font-light">{ticket.description}</p>
                  
                  {ticket.response ? (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/55 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">Response from Head Office:</p>
                      <p className="text-slate-550 dark:text-slate-350 mt-1 font-light">{ticket.response}</p>
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

      </div>

    </div>
  );
}
