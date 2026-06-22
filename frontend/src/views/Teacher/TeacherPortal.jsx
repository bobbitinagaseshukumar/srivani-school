import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckSquare, Upload, Clipboard, BookOpen, Layers, Plus, Users, Award, Calendar, AlertCircle, FileText, Trash2 } from 'lucide-react';

const parseSlot = (slot) => {
  if (!slot) return { subject: 'FREE PERIOD', time: '09:30 AM - 10:15 AM' };
  if (typeof slot === 'object' && slot !== null) {
    return {
      subject: slot.subject || 'FREE PERIOD',
      time: slot.time || '09:30 AM - 10:15 AM'
    };
  }
  if (typeof slot === 'string') {
    const timeMatch = slot.match(/\(([^)]+)\)/);
    const time = timeMatch ? timeMatch[1] : '09:30 AM - 10:15 AM';
    const subject = slot.replace(/\([^)]+\)/, '').trim();
    return { subject, time };
  }
  return { subject: 'FREE PERIOD', time: '09:30 AM - 10:15 AM' };
};

const getSubjectStyle = (subject) => {
  const cleanSub = (subject || '').toUpperCase().trim();
  
  if (cleanSub.includes('FREE PERIOD') || cleanSub === '') {
    return {
      bg: 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800',
      text: 'text-slate-500 dark:text-slate-400',
      tag: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      accent: 'border-l-4 border-l-slate-400'
    };
  }

  // Predefined primary mappings for key subjects
  if (cleanSub.includes('PHYSICS')) {
    return {
      bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50',
      text: 'text-blue-700 dark:text-blue-350',
      tag: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
      accent: 'border-l-4 border-l-blue-500'
    };
  }
  if (cleanSub.includes('CHEMISTRY')) {
    return {
      bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/50',
      text: 'text-orange-700 dark:text-orange-350',
      tag: 'bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300',
      accent: 'border-l-4 border-l-orange-500'
    };
  }
  if (cleanSub.includes('BIOLOGY')) {
    return {
      bg: 'bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/50',
      text: 'text-green-700 dark:text-green-350',
      tag: 'bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-300',
      accent: 'border-l-4 border-l-green-500'
    };
  }
  if (cleanSub.includes('SCIENCE') || cleanSub.includes('EVS')) {
    return {
      bg: 'bg-teal-50 dark:bg-teal-950/30 border-teal-100 dark:border-teal-900/50',
      text: 'text-teal-700 dark:text-teal-350',
      tag: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-350',
      accent: 'border-l-4 border-l-teal-500'
    };
  }
  if (cleanSub.includes('MATH') || cleanSub.includes('ALGEBRA')) {
    return {
      bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50',
      text: 'text-purple-700 dark:text-purple-350',
      tag: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300',
      accent: 'border-l-4 border-l-purple-500'
    };
  }
  if (cleanSub.includes('ENGLISH')) {
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50',
      text: 'text-amber-700 dark:text-amber-350',
      tag: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300',
      accent: 'border-l-4 border-l-amber-500'
    };
  }
  if (cleanSub.includes('HINDI')) {
    return {
      bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50',
      text: 'text-rose-700 dark:text-rose-350',
      tag: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300',
      accent: 'border-l-4 border-l-rose-500'
    };
  }
  if (cleanSub.includes('TELUGU')) {
    return {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50',
      text: 'text-indigo-700 dark:text-indigo-350',
      tag: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300',
      accent: 'border-l-4 border-l-indigo-500'
    };
  }
  if (cleanSub.includes('SANSKRIT') || cleanSub.includes('SOCIAL') || cleanSub.includes('CIVICS') || cleanSub.includes('HISTORY') || cleanSub.includes('GEOGRAPHY')) {
    return {
      bg: 'bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900/50',
      text: 'text-violet-700 dark:text-violet-350',
      tag: 'bg-violet-100 dark:bg-violet-900/60 text-violet-800 dark:text-violet-300',
      accent: 'border-l-4 border-l-violet-500'
    };
  }
  if (cleanSub.includes('COMPUTER') || cleanSub.includes('IT') || cleanSub.includes('CODING')) {
    return {
      bg: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-100 dark:border-cyan-900/50',
      text: 'text-cyan-700 dark:text-cyan-350',
      tag: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300',
      accent: 'border-l-4 border-l-cyan-500'
    };
  }
  if (cleanSub.includes('GENERALKNOWLEDGE') || cleanSub.includes('GK')) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-950/50',
      text: 'text-emerald-700 dark:text-emerald-350',
      tag: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
      accent: 'border-l-4 border-l-emerald-500'
    };
  }
  if (cleanSub.includes('ART') || cleanSub.includes('MUSIC') || cleanSub.includes('DRAWING') || cleanSub.includes('CRAFT')) {
    return {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30 border-fuchsia-100 dark:border-fuchsia-900/50',
      text: 'text-fuchsia-700 dark:text-fuchsia-350',
      tag: 'bg-fuchsia-100 dark:bg-fuchsia-900/60 text-fuchsia-800 dark:text-fuchsia-300',
      accent: 'border-l-4 border-l-fuchsia-500'
    };
  }
  if (cleanSub.includes('SPORTS') || cleanSub.includes('PHYSICAL') || cleanSub.includes('PE') || cleanSub.includes('GAMES') || cleanSub.includes('PLAY')) {
    return {
      bg: 'bg-lime-50 dark:bg-lime-950/30 border-lime-100 dark:border-lime-900/50',
      text: 'text-lime-700 dark:text-lime-350',
      tag: 'bg-lime-100 dark:bg-lime-900/60 text-lime-800 dark:text-lime-300',
      accent: 'border-l-4 border-l-lime-500'
    };
  }

  // Hash-based dynamic fallback colors to guarantee colorful display for any class subjects
  const colors = [
    { color: 'blue', border: 'border-blue-100 dark:border-blue-900/50', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-350', tag: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300', accent: 'border-l-4 border-l-blue-500' },
    { color: 'purple', border: 'border-purple-100 dark:border-purple-900/50', bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-350', tag: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300', accent: 'border-l-4 border-l-purple-500' },
    { color: 'amber', border: 'border-amber-100 dark:border-amber-900/50', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-350', tag: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300', accent: 'border-l-4 border-l-amber-500' },
    { color: 'emerald', border: 'border-emerald-100 dark:border-emerald-900/50', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-350', tag: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300', accent: 'border-l-4 border-l-emerald-500' },
    { color: 'pink', border: 'border-pink-100 dark:border-pink-900/50', bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-700 dark:text-pink-350', tag: 'bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-300', accent: 'border-l-4 border-l-pink-500' },
    { color: 'indigo', border: 'border-indigo-100 dark:border-indigo-900/50', bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-700 dark:text-indigo-350', tag: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-350', accent: 'border-l-4 border-l-indigo-500' },
    { color: 'teal', border: 'border-teal-100 dark:border-teal-900/50', bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-350', tag: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-350', accent: 'border-l-4 border-l-teal-500' },
    { color: 'rose', border: 'border-rose-100 dark:border-rose-900/50', bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-350', tag: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-350', accent: 'border-l-4 border-l-rose-500' }
  ];

  let hash = 0;
  for (let i = 0; i < cleanSub.length; i++) {
    hash = cleanSub.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  const picked = colors[index];
  return {
    bg: `${picked.bg} ${picked.border}`,
    text: picked.text,
    tag: picked.tag,
    accent: picked.accent
  };
};

export default function TeacherPortal() {
  const { teachers, students, marks, homework, notes, liveClasses, circulars,
    attendance, notifications, markNotificationRead, currentUser, logoutUser, subjects, timetables,
    markAttendance, uploadMarks, createHomework, evaluateHomework, deleteHomework, createNotes, deleteNotes,
    createLiveClass, deleteLiveClass, createCircular, deleteCircular,
    leaveRequests, submitLeaveRequest } = useContext(AppContext);

  // Find the logged-in teacher's profile matching currentUser.id and retrieve their assigned subject.
  const currentTeacherProfile = teachers ? teachers.find(t => t.id === currentUser.id) : null;
  const teacherSubject = currentTeacherProfile ? currentTeacherProfile.subject : 'PHYSICS';
  const teacherName = currentTeacherProfile ? currentTeacherProfile.name : currentUser.name;

  const getSubjectName = (code) => {
    if (!code) return '';
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'FREE PERIOD') return 'Free Period';
    const found = subjects ? subjects.find(s => s.code.toUpperCase() === cleanCode) : null;
    return found ? found.name : code;
  };

  const [activeTab, setActiveTab] = useState('Dashboard');
  const contentRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceSession, setAttendanceSession] = useState('Morning');

  // Attendance grid tracking state (studentId -> status)
  const [attendanceSheet, setAttendanceSheet] = useState({});

  // Extract all periods for this teacher across all classes and days from AppContext
  const teacherPeriods = [];
  if (timetables) {
    timetables.forEach(t => {
      t.slots.forEach((slot, index) => {
        const parsed = parseSlot(slot);
        if (parsed.subject.toUpperCase() === teacherSubject.toUpperCase()) {
          teacherPeriods.push({
            id: `${t.class}_${t.day}_${index}`,
            class: t.class,
            day: t.day,
            time: parsed.time,
            subjectLabel: parsed.subject,
            periodNum: index + 1
          });
        }
      });
    });
  }

  // Marks upload forms
  const [examType, setExamType] = useState('mid 1');
  const [subjectSelected, setSubjectSelected] = useState(teacherSubject);
  const [marksSheet, setMarksSheet] = useState({}); // studentId -> marks
  const [remarksSheet, setRemarksSheet] = useState({}); // studentId -> remark

  // Homework creator state
  const [showAddHw, setShowAddHw] = useState(false);
  const [hwForm, setHwForm] = useState({ title: '', description: '', subject: teacherSubject, class: 'Class 10', section: 'A', dueDate: '' });

  // Notes upload creator state
  const [showAddNotes, setShowAddNotes] = useState(false);
  const [notesForm, setNotesForm] = useState({ title: '', description: '', subject: teacherSubject, class: 'Class 10', section: 'A', chapter: 'Chapter 5', type: 'PDF' });
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState('');
  const [videoLink, setVideoLink] = useState('');
  
  // Attendance Sub-tab and Search states
  const [attendanceSubTab, setAttendanceSubTab] = useState('mark');
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState('');
  const [attendanceSearchSection, setAttendanceSearchSection] = useState('A');
  const [attendanceSearchClass, setAttendanceSearchClass] = useState('Class 10');
  const [selectedStudentAttendance, setSelectedStudentAttendance] = useState(null);

  // Class circular state
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });

  // Live Class Creator state
  const [showAddLiveClass, setShowAddLiveClass] = useState(false);
  const [liveForm, setLiveForm] = useState({ subject: teacherSubject, title: '', startTime: '11:00 AM', duration: '45 Mins', meetingLink: 'https://meet.google.com/abc-defg-hij' });

  // Leave Application state
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [leaveReason, setLeaveReason] = useState('');

  // Keep state synchronized with teacher's assigned subject in case it resolves late or changes
  useEffect(() => {
    setSubjectSelected(teacherSubject);
    setHwForm(prev => ({ ...prev, subject: teacherSubject }));
    setNotesForm(prev => ({ ...prev, subject: teacherSubject, section: 'A' }));
    setLiveForm(prev => ({ ...prev, subject: teacherSubject }));
  }, [teacherSubject]);

  const activeStudents = students.filter(s => s.class === selectedClass && s.section === selectedSection);

  const handleInitializeAttendance = () => {
    const sheet = {};
    activeStudents.forEach(s => {
      const existing = (attendance || []).find(
        h => h.studentId === s.id && 
             h.date === attendanceDate && 
             (h.session || 'Morning') === (attendanceSession || 'Morning')
      );
      sheet[s.id] = existing ? existing.status : 'Present';
    });
    setAttendanceSheet(sheet);
  };

  // Auto-load attendance sheet when class, section, date, session, or students list loads
  useEffect(() => {
    handleInitializeAttendance();
  }, [selectedClass, selectedSection, attendanceDate, attendanceSession, students]);

  const handleSaveAttendance = () => {
    const logs = Object.keys(attendanceSheet).map(sId => ({
      studentId: sId,
      date: attendanceDate,
      status: attendanceSheet[sId],
      class: selectedClass,
      section: selectedSection,
      session: attendanceSession
    }));
    markAttendance(logs);
    alert(`Attendance marked for ${logs.length} students in ${selectedClass}-${selectedSection} for ${attendanceSession} session.`);
  };

  const handleSaveMarks = () => {
    const list = Object.keys(marksSheet).map(sId => {
      const studentObj = students.find(s => s.id === sId);
      return {
        studentId: sId,
        studentName: studentObj ? studentObj.name : 'Unknown',
        examType,
        subject: subjectSelected,
        marks: parseInt(marksSheet[sId]) || 0,
        maxMarks: 100,
        grade: calculateGrade(parseInt(marksSheet[sId]) || 0),
        remarks: remarksSheet[sId] || 'Good effort.'
      };
    });
    uploadMarks(list);
    alert(`Published ${list.length} grade sheets successfully.`);
    setMarksSheet({});
    setRemarksSheet({});
  };

  const calculateGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    return 'C';
  };

  const handleCreateHw = (e) => {
    e.preventDefault();
    if (!hwForm.title || !hwForm.dueDate) return;
    createHomework({
      ...hwForm,
      teacherId: currentUser.id,
      file: 'reference_docs.pdf'
    });
    setShowAddHw(false);
    setHwForm({ title: '', description: '', subject: teacherSubject, class: 'Class 10', section: 'A', dueDate: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15MB limit.");
      e.target.value = null;
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result);
    };
    reader.onerror = () => {
      alert("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const openPDF = (fileData, fName) => {
    if (!fileData) {
      alert("No file data attached to this note.");
      return;
    }
    try {
      const parts = fileData.split(',');
      const base64 = parts[1] || parts[0];
      const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
      const binaryStr = atob(base64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      
      const newTab = window.open(blobUrl, '_blank');
      if (!newTab) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Error opening file", err);
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`<iframe src="${fileData}" style="width:100%; height:100%; border:none;"></iframe>`);
      } else {
        alert("Failed to open file. Please disable popup blockers.");
      }
    }
  };

  const handleCreateNotes = (e) => {
    e.preventDefault();
    if (!notesForm.title || !notesForm.chapter) return;
    const payload = {
      ...notesForm,
      teacherId: currentUser.id,
    };
    if (notesForm.type === 'Video') {
      payload.file = videoLink || 'https://youtube.com/watch?v=mock';
    } else {
      payload.file = fileName || 'notes_material.pdf';
      payload.fileData = fileData;
    }
    createNotes(payload);
    setShowAddNotes(false);
    setNotesForm({ title: '', description: '', subject: teacherSubject, class: 'Class 10', section: 'A', chapter: 'Chapter 5', type: 'PDF' });
    setFileName('');
    setFileData('');
    setVideoLink('');
  };

  const handleCreateLiveClass = (e) => {
    e.preventDefault();
    if (!liveForm.title) return;
    createLiveClass({
      ...liveForm,
      class: 'Class 10',
      section: 'A'
    });
    setShowAddLiveClass(false);
    setLiveForm({ subject: teacherSubject, title: '', startTime: '11:00 AM', duration: '45 Mins', meetingLink: 'https://meet.google.com/abc-defg-hij' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-slate-800 dark:text-slate-100 text-left flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="glassmorphism p-5 rounded-3xl border border-white/50 shadow-md">
          <div className="text-center space-y-2 pb-4 border-b border-slate-200/50 dark:border-slate-800 mb-6">
            <img 
              src={currentTeacherProfile ? currentTeacherProfile.photo : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
              alt={teacherName} 
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-blue-500/20 shadow-md"
            />
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">{teacherName}</h3>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{currentTeacherProfile ? currentTeacherProfile.qualification : ''}</p>
              <p className="text-[9px] text-slate-400 font-semibold uppercase">{getSubjectName(currentTeacherProfile ? currentTeacherProfile.subject : 'PHYSICS')} Faculty</p>
              <p className="text-[9px] text-slate-400 font-mono">ID: {currentUser.id}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5 text-xs font-semibold">
            {[
              { id: 'Dashboard', icon: Layers, label: 'Today Summary' },
              { id: 'Attendance', icon: CheckSquare, label: 'Mark Attendance' },
              { id: 'Marks', icon: Award, label: 'Upload Marks' },
              { id: 'Homework', icon: Clipboard, label: 'Homework Desk' },
              { id: 'Notes', icon: BookOpen, label: 'Study Notes' },
              { id: 'LiveClasses', icon: Calendar, label: 'Live Virtual Classes' },
              { id: 'Circulars', icon: FileText, label: 'Class Announcements' },
              { id: 'Leaves', icon: FileText, label: 'Leave Letters' }
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
          Logout Faculty Panel
        </button>
      </div>

      {/* Main Content Area */}
      <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
        
        {/* Dashboard Tab */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Teacher Dashboard</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            {/* Quick widgets */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Students</h4>
                <h3 className="text-2xl font-extrabold mt-1">{activeStudents.length} Pupils</h3>
                <p className="text-[10px] text-blue-500 font-semibold mt-1">{selectedClass} (Section {selectedSection})</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Homeworks Tracked</h4>
                <h3 className="text-2xl font-extrabold mt-1">{homework.filter(h => h.teacherId === currentUser.id).length} Assignments</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">{getSubjectName(teacherSubject)}</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scheduled Live Sessions</h4>
                <h3 className="text-2xl font-extrabold mt-1">{liveClasses.filter(lc => lc.subject === teacherSubject).length} Sessions</h3>
                <p className="text-[10px] text-indigo-500 font-semibold mt-1">{getSubjectName(teacherSubject)}</p>
              </div>
            </div>

            {/* Today schedule */}
            <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-850 space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Your Personal Weekly Period Schedule</h3>
                <p className="text-[10px] text-slate-400">Class periods where you are registered as the active course educator</p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-light">
                {teacherPeriods.map((period) => {
                  const style = getSubjectStyle(period.subjectLabel);
                  return (
                    <div key={period.id} className={`p-4 rounded-2xl border ${style.bg} ${style.accent} flex flex-col justify-between transition-all duration-200 hover:scale-[1.03] hover:shadow-md`}>
                      <div>
                        <span className={`inline-block text-[9px] font-extrabold tracking-tight px-2 py-0.5 rounded-full mb-2 ${style.tag}`}>
                          {getSubjectName(period.subjectLabel)}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">{period.class}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Period {period.periodNum}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                        <span>{period.day}</span>
                        <span>{period.time}</span>
                      </div>
                    </div>
                  );
                })}
                {teacherPeriods.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/40 rounded-2xl text-slate-400 text-xs italic sm:col-span-3">
                    No teaching periods scheduled on the timetable.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Attendance Module Tab */}
        {activeTab === 'Attendance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-2xl font-extrabold font-montserrat">Class Attendance Management</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setAttendanceSubTab('mark')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    attendanceSubTab === 'mark'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  Mark Attendance
                </button>
                <button
                  onClick={() => {
                    setAttendanceSubTab('history');
                    setSelectedStudentAttendance(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    attendanceSubTab === 'history'
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  Search & History
                </button>
              </div>
            </div>

            {attendanceSubTab === 'mark' ? (
              <div className="space-y-6">
                {/* Filter selectors */}
                <div className="glassmorphism p-4 rounded-xl border border-white/40 shadow-md flex flex-wrap gap-4 items-center">
                  <div className="flex gap-2">
                    <select 
                      value={selectedClass} 
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
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
                      value={selectedSection} 
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                    </select>
                  </div>

                  <input 
                    type="date" 
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />

                  <select 
                    value={attendanceSession} 
                    onChange={(e) => setAttendanceSession(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Morning">Morning Session</option>
                    <option value="Afternoon">Afternoon Session</option>
                  </select>

                  <button
                    onClick={handleInitializeAttendance}
                    className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg ml-auto cursor-pointer"
                  >
                    Load Attendance Sheet
                  </button>
                </div>

                {/* Attendance Sheet Grid */}
                {Object.keys(attendanceSheet).length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              <th className="p-4">Student Name</th>
                              <th className="p-4">Roll/Reg No</th>
                              <th className="p-4 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                            {activeStudents.map((stud) => (
                              <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                <td className="p-4 font-bold text-slate-900 dark:text-white">{stud.name}</td>
                                <td className="p-4 font-mono">{stud.registerNo}</td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center gap-3">
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`status-${stud.id}`}
                                        checked={attendanceSheet[stud.id] === 'Present'}
                                        onChange={() => setAttendanceSheet(prev => ({ ...prev, [stud.id]: 'Present' }))}
                                        className="text-emerald-500 focus:ring-emerald-400 h-3 w-3"
                                      />
                                      <span className="text-[10px] font-bold text-emerald-600">Present</span>
                                    </label>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`status-${stud.id}`}
                                        checked={attendanceSheet[stud.id] === 'Absent'}
                                        onChange={() => setAttendanceSheet(prev => ({ ...prev, [stud.id]: 'Absent' }))}
                                        className="text-red-500 focus:ring-red-400 h-3 w-3"
                                      />
                                      <span className="text-[10px] font-bold text-red-500">Absent</span>
                                    </label>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`status-${stud.id}`}
                                        checked={attendanceSheet[stud.id] === 'Leave'}
                                        onChange={() => setAttendanceSheet(prev => ({ ...prev, [stud.id]: 'Leave' }))}
                                        className="text-amber-500 focus:ring-amber-400 h-3 w-3"
                                      />
                                      <span className="text-[10px] font-bold text-amber-600">Leave</span>
                                    </label>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`status-${stud.id}`}
                                        checked={attendanceSheet[stud.id] === 'Half Day'}
                                        onChange={() => setAttendanceSheet(prev => ({ ...prev, [stud.id]: 'Half Day' }))}
                                        className="text-blue-500 focus:ring-blue-400 h-3 w-3"
                                      />
                                      <span className="text-[10px] font-bold text-blue-500">Half Day</span>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveAttendance}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow cursor-pointer"
                    >
                      Save Class Attendance Log
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Search Attendance History</h3>
                
                {/* Search Bar / Filters */}
                <div className="glassmorphism p-4 rounded-xl border border-white/40 shadow-md flex flex-wrap gap-4 items-center">
                  <div className="flex gap-2">
                    <select 
                      value={attendanceSearchClass} 
                      onChange={(e) => setAttendanceSearchClass(e.target.value)}
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
                      value={attendanceSearchSection} 
                      onChange={(e) => setAttendanceSearchSection(e.target.value)}
                      className="px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                    </select>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search by student name or register number..."
                    value={attendanceSearchQuery}
                    onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                    className="px-3.5 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 flex-1 min-w-[200px]"
                  />
                </div>

                {selectedStudentAttendance ? (
                  <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-lg space-y-4 text-left">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{selectedStudentAttendance.name}</h4>
                        <p className="text-[10px] text-slate-400 font-light">Reg No: {selectedStudentAttendance.registerNo} | Class: {selectedStudentAttendance.class} - Sec {selectedStudentAttendance.section}</p>
                      </div>
                      <button
                        onClick={() => setSelectedStudentAttendance(null)}
                        className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Back to List
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-500/5 dark:bg-blue-950/10 rounded-xl border border-blue-500/10 text-center">
                        <p className="text-[10px] text-slate-450 uppercase font-bold">Overall Percentage</p>
                        <p className="text-3xl font-black text-blue-600 mt-1">{selectedStudentAttendance.attendancePct || 0}%</p>
                      </div>
                      <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/10 rounded-xl border border-emerald-500/10 text-center">
                        <p className="text-[10px] text-slate-450 uppercase font-bold">Status</p>
                        <p className="text-xl font-bold text-emerald-600 mt-2">
                          {(selectedStudentAttendance.attendancePct || 0) >= 75 ? "Good Standing" : "Low Attendance Alert"}
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
                          {attendance.filter(a => a.studentId === selectedStudentAttendance.id).map(log => (
                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                              <td className="p-3 font-semibold">{log.date}</td>
                              <td className="p-3">{log.session}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  log.status === 'Present' ? 'bg-emerald-500/10 text-emerald-600' :
                                  log.status === 'Absent' ? 'bg-red-500/10 text-red-650' :
                                  log.status === 'Half Day' ? 'bg-blue-500/10 text-blue-600' :
                                  'bg-amber-500/10 text-amber-600'
                                }`}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {attendance.filter(a => a.studentId === selectedStudentAttendance.id).length === 0 && (
                            <tr>
                              <td colSpan="3" className="p-6 text-center text-slate-400 italic">No attendance records found for this student.</td>
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
                            s.class === attendanceSearchClass && 
                            s.section === attendanceSearchSection && 
                            (s.name.toLowerCase().includes(attendanceSearchQuery.toLowerCase()) || 
                             s.registerNo.toLowerCase().includes(attendanceSearchQuery.toLowerCase()))
                          ).map((stud) => (
                            <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                              <td className="p-4 font-bold text-slate-900 dark:text-white">{stud.name}</td>
                              <td className="p-4 font-mono">{stud.registerNo}</td>
                              <td className="p-4">{stud.class} - {stud.section}</td>
                              <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{stud.attendancePct || 0}%</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => setSelectedStudentAttendance(stud)}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                >
                                  View Detailed Log
                                </button>
                              </td>
                            </tr>
                          ))}
                          {students.filter(s => 
                            s.class === attendanceSearchClass && 
                            s.section === attendanceSearchSection && 
                            (s.name.toLowerCase().includes(attendanceSearchQuery.toLowerCase()) || 
                             s.registerNo.toLowerCase().includes(attendanceSearchQuery.toLowerCase()))
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
          </div>
        )}

        {/* Marks Upload Tab */}
        {activeTab === 'Marks' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Upload Examination Marks</h2>
            
            {/* Parameters Selection */}
            <div className="glassmorphism p-4 rounded-xl border border-white/40 shadow-md flex flex-wrap gap-4 items-center">
              <input 
                type="text"
                placeholder="Exam Name (e.g. assignment1, mid 1)"
                value={examType} 
                onChange={(e) => setExamType(e.target.value)}
                className="px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 w-56 font-bold"
              />

              <input 
                type="text"
                placeholder="Subject"
                value={getSubjectName(subjectSelected)} 
                readOnly
                className="px-3 py-1.5 border rounded-lg bg-slate-150 dark:bg-slate-900/50 text-xs w-56 font-bold cursor-not-allowed"
              />

              <button
                onClick={() => {
                  const marksMap = {};
                  const remarksMap = {};
                  activeStudents.forEach(s => {
                    marksMap[s.id] = '';
                    remarksMap[s.id] = '';
                  });
                  setMarksSheet(marksMap);
                  setRemarksSheet(remarksMap);
                }}
                className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg ml-auto"
              >
                Load Grade Sheet
              </button>
            </div>

            {/* Marks Input Grid */}
            {Object.keys(marksSheet).length > 0 && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px] text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                          <th className="p-4">Student Name</th>
                          <th className="p-4">Marks Obtained (Max 100)</th>
                          <th className="p-4">Teacher's Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150/40 dark:divide-slate-850 font-light">
                        {activeStudents.map((stud) => (
                          <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="p-4 font-bold text-slate-900 dark:text-white">{stud.name}</td>
                            <td className="p-4">
                              <input 
                                type="number" max={100} min={0}
                                value={marksSheet[stud.id] || ''}
                                onChange={(e) => setMarksSheet(prev => ({ ...prev, [stud.id]: e.target.value }))}
                                className="w-20 px-2 py-1 border rounded bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="p-4">
                              <input 
                                type="text"
                                value={remarksSheet[stud.id] || ''}
                                onChange={(e) => setRemarksSheet(prev => ({ ...prev, [stud.id]: e.target.value }))}
                                className="w-full max-w-sm px-2 py-1 border rounded bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  onClick={handleSaveMarks}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Save and Publish Grades
                </button>
              </div>
            )}
          </div>
        )}

        {/* Homework desk Tab */}
        {activeTab === 'Homework' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Homework Desk</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Assign class tasks, review student submissions, and grade work.</p>
              </div>
              <button
                onClick={() => setShowAddHw(!showAddHw)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus size={16} /> Assign Homework
              </button>
            </div>

            {showAddHw && (
              <form onSubmit={handleCreateHw} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-montserrat">New Assignment Card</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    type="text" required placeholder="Homework Title"
                    value={hwForm.title}
                    onChange={(e) => setHwForm(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="date" required
                    value={hwForm.dueDate}
                    onChange={(e) => setHwForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <textarea 
                  rows={3} required placeholder="Homework task description..."
                  value={hwForm.description}
                  onChange={(e) => setHwForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                ></textarea>
                <div className="grid sm:grid-cols-3 gap-4">
                  <input 
                    type="text"
                    placeholder="Subject Name"
                    value={getSubjectName(teacherSubject)}
                    readOnly
                    className="px-3.5 py-2 border rounded-xl bg-slate-150 dark:bg-slate-900/50 text-xs font-bold cursor-not-allowed"
                  />
                  <select
                    value={hwForm.class}
                    onChange={(e) => setHwForm(prev => ({ ...prev, class: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
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
                    value={hwForm.section}
                    onChange={(e) => setHwForm(prev => ({ ...prev, section: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Publish Homework Card
                </button>
              </form>
            )}

            {/* Homework List & Submissions */}
            <div className="space-y-6">
              {homework.map((hw) => (
                <div key={hw.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded uppercase">{getSubjectName(hw.subject)} • {hw.class}</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">{hw.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-red-500 font-semibold">Due: {hw.dueDate}</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete homework "${hw.title}"?`)) {
                            deleteHomework(hw.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                        title="Delete Homework"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-light">{hw.description}</p>
                  
                  {/* Submissions Section */}
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-3">
                    <h5 className="font-bold text-[10px] uppercase text-slate-400 tracking-wider mb-2">Student Submissions ({hw.submissions.length})</h5>
                    <div className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-light">
                      {hw.submissions.map(sub => (
                        <div key={sub.studentId} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{sub.studentName} ({sub.studentId})</p>
                            <p className="text-[9px] text-slate-400">Uploaded: {sub.submittedAt} • File: {sub.file}</p>
                          </div>
                          
                          {sub.status === 'Evaluated' ? (
                            <div className="text-right">
                              <span className="bg-emerald-500/10 text-emerald-500 font-bold text-[10px] px-2 py-0.5 rounded">Graded: {sub.grade}</span>
                              <p className="text-[10px] text-slate-400 italic mt-0.5">"{sub.feedback}"</p>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <select 
                                id={`grade_${hw.id}_${sub.studentId}`}
                                className="px-2 py-1 border rounded bg-white/70 dark:bg-slate-900/50 text-[10px] focus:ring-1"
                              >
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                              </select>
                              <input 
                                type="text" 
                                id={`fb_${hw.id}_${sub.studentId}`}
                                placeholder="Feedback comment..." 
                                className="px-2 py-1 border rounded bg-white/70 dark:bg-slate-900/50 text-[10px] w-36"
                              />
                              <button
                                onClick={() => {
                                  const gr = document.getElementById(`grade_${hw.id}_${sub.studentId}`).value;
                                  const fb = document.getElementById(`fb_${hw.id}_${sub.studentId}`).value || 'Good work!';
                                  evaluateHomework(hw.id, sub.studentId, gr, fb);
                                }}
                                className="bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded"
                              >
                                Submit Grade
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {hw.submissions.length === 0 && (
                        <p className="text-slate-400 text-[10px] py-1">No submissions received yet for this task.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Classes Tab */}
        {activeTab === 'LiveClasses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Live Virtual Classes</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Schedule Google Meet/Zoom classrooms for remote lecturing.</p>
              </div>
              <button
                onClick={() => setShowAddLiveClass(!showAddLiveClass)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus size={16} /> Schedule Live Class
              </button>
            </div>

            {showAddLiveClass && (
              <form onSubmit={handleCreateLiveClass} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Schedule remote lecture</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <input 
                    type="text" required placeholder="Lecture Topic / Title"
                    value={liveForm.title}
                    onChange={(e) => setLiveForm(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="text" required placeholder="Subject"
                    value={getSubjectName(teacherSubject)}
                    readOnly
                    className="px-3.5 py-2 border rounded-xl bg-slate-150 dark:bg-slate-900/50 text-xs font-bold cursor-not-allowed"
                  />
                  <input 
                    type="text" required placeholder="Start Time (e.g. 10:30 AM)"
                    value={liveForm.startTime}
                    onChange={(e) => setLiveForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Duration (e.g. 45 Mins)"
                    value={liveForm.duration}
                    onChange={(e) => setLiveForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="url" required placeholder="Meeting API Link (Zoom/Meet)"
                    value={liveForm.meetingLink}
                    onChange={(e) => setLiveForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Generate Meeting Link
                </button>
              </form>
            )}

            {/* Live Classes Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {liveClasses.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">{getSubjectName(item.subject)} • {item.class}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          item.status === 'Live' ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-slate-100 text-slate-500 dark:bg-slate-900'
                        }`}>{item.status}</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete live class "${item.title}"?`)) {
                              deleteLiveClass(item.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                          title="Delete Live Class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">{item.title}</h4>
                    <p className="text-[10px] text-slate-450 mt-1">Time: {item.startTime} ({item.duration})</p>
                  </div>
                  <a 
                    href={item.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="bg-indigo-600 text-white font-bold text-xs text-center py-2 rounded-xl"
                  >
                    Launch Live Stream Portal
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Notes Tab */}
        {activeTab === 'Notes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Study Notes & Resources Desk</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Upload study notes, slides, documents, or video links for student download.</p>
              </div>
              <button
                onClick={() => setShowAddNotes(!showAddNotes)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus size={16} /> Upload Notes
              </button>
            </div>

            {showAddNotes && (
              <form onSubmit={handleCreateNotes} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Upload New Study Material</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    type="text" required placeholder="Notes Title"
                    value={notesForm.title}
                    onChange={(e) => setNotesForm(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="text" required placeholder="Chapter (e.g. Chapter 1)"
                    value={notesForm.chapter}
                    onChange={(e) => setNotesForm(prev => ({ ...prev, chapter: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <textarea 
                  rows={3} required placeholder="Material description..."
                  value={notesForm.description}
                  onChange={(e) => setNotesForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                ></textarea>
                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Subject</label>
                    <input 
                      type="text"
                      value={getSubjectName(teacherSubject)}
                      readOnly
                      className="w-full px-3.5 py-2 border rounded-xl bg-slate-150 dark:bg-slate-900/50 text-xs font-bold cursor-not-allowed"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Class</label>
                    <select
                      value={notesForm.class}
                      onChange={(e) => setNotesForm(prev => ({ ...prev, class: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
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
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Section</label>
                    <select
                      value={notesForm.section || 'All'}
                      onChange={(e) => setNotesForm(prev => ({ ...prev, section: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="All">All Sections</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Material Type</label>
                    <select
                      value={notesForm.type}
                      onChange={(e) => setNotesForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="PPT">PPT Presentation</option>
                      <option value="DOCX">Word Document</option>
                      <option value="Video">Video Link / Tutorial</option>
                      <option value="Image">Image / Diagram</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1 mt-2">
                  {notesForm.type !== 'Video' ? (
                    <>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Select File (PDF/Doc/Image, Max 15MB)</label>
                      <input 
                        type="file" 
                        required
                        accept={
                          notesForm.type === 'PDF' ? 'application/pdf' :
                          notesForm.type === 'Image' ? 'image/*' :
                          '*'
                        }
                        onChange={handleFileChange}
                        className="w-full px-3 py-1.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                      />
                      {fileName && <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Selected: {fileName}</p>}
                    </>
                  ) : (
                    <>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Video Link (e.g. YouTube URL)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="https://youtube.com/watch?v=..."
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </>
                  )}
                </div>

                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  Upload Material
                </button>
              </form>
            )}

            {/* Notes List */}
            <div className="grid sm:grid-cols-2 gap-6">
              {notes.map((note) => (
                <div key={note.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4 font-poppins">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded">{getSubjectName(note.subject)} • {note.class} - Sec {note.section || 'All'}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">{note.type}</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete notes "${note.title}"?`)) {
                              deleteNotes(note.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                          title="Delete Study Notes"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">{note.title}</h4>
                    <p className="text-[10px] text-slate-450 mt-1">{note.chapter}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-355 leading-relaxed font-light mt-2">{note.description}</p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between items-center text-[10px] text-slate-400">
                    <span>File: {note.file || 'notes_material.pdf'}</span>
                    <div className="flex items-center gap-2">
                      {note.fileData && (
                        <button
                          onClick={() => openPDF(note.fileData, note.file)}
                          className="bg-indigo-500/10 hover:bg-indigo-650 text-indigo-650 hover:text-white px-2 py-1 rounded transition-colors text-[9px] font-bold cursor-pointer"
                        >
                          Open PDF / View
                        </button>
                      )}
                      <span>Downloads: {note.downloads || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="sm:col-span-2 text-center py-8 text-slate-400 text-xs">
                  No notes uploaded yet. Start by clicking "Upload Notes".
                </div>
              )}
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'Circulars' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Class Announcements</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Post notices that appear directly on student and parent portal dashboards.</p>
              </div>
              <button
                onClick={() => setShowAddNotice(!showAddNotice)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus size={16} /> Publish Announcement
              </button>
            </div>

            {showAddNotice && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!noticeForm.title || !noticeForm.content) return;
                  createCircular({
                    title: noticeForm.title,
                    content: noticeForm.content,
                    targetGroup: 'Parents' // Simulating parent alert
                  });
                  setShowAddNotice(false);
                  setNoticeForm({ title: '', content: '' });
                }} 
                className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl"
              >
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Class Announcement</h3>
                <input 
                  type="text" required placeholder="Announcement Title"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <textarea 
                  rows={3} required placeholder="Announcement content..."
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                ></textarea>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Publish and Notify Parents
                </button>
              </form>
            )}

            <div className="space-y-4">
              {circulars.map((notice) => (
                <div key={notice.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded uppercase">{notice.targetGroup}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">{notice.date}</span>
                      {notice.postedBy === currentUser.name && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete notice "${notice.title}"?`)) {
                              deleteCircular(notice.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{notice.title}</h4>
                  <p className="text-xs text-slate-655 dark:text-slate-355 leading-relaxed font-light">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leave Letters Tab */}
        {activeTab === 'Leaves' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Leave Management System</h2>
            <p className="text-xs text-slate-400 font-light mt-1">Submit formal leave applications for super admin review. Once processed, status updates will reflect below.</p>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Form to Apply for Leave */}
              <div className="lg:col-span-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!leaveStartDate || !leaveEndDate || !leaveReason.trim()) {
                      alert('Please fill all fields.');
                      return;
                    }
                    const teacherObj = currentTeacherProfile || currentUser;
                    submitLeaveRequest(
                      teacherObj.id || 'teacher_unknown',
                      teacherObj.name || 'Teacher',
                      'Teacher',
                      '',
                      {
                        leaveType,
                        startDate: leaveStartDate,
                        endDate: leaveEndDate,
                        reason: leaveReason
                      }
                    );
                    setLeaveStartDate('');
                    setLeaveEndDate('');
                    setLeaveReason('');
                    alert('Leave request submitted successfully. The administration has been notified.');
                  }}
                  className="glassmorphism p-6 rounded-2xl border border-white/50 shadow-lg space-y-4 text-left"
                >
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Apply for Leave</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Leave Type</label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Medical Leave">Medical Leave</option>
                      <option value="Family Event">Family Event</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Start Date</label>
                      <input
                        type="date" required
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">End Date</label>
                      <input
                        type="date" required
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Detailed Reason</label>
                    <textarea
                      required placeholder="Provide a professional explanation for your absence..."
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      rows={3}
                      className="w-full p-3 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow cursor-pointer transition-all"
                  >
                    Submit Leave Letter
                  </button>
                </form>
              </div>

              {/* Leave Requests Log */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400 text-left">Your Leave History Log</h3>
                
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 animate-fade-in">
                  {((leaveRequests || []).filter(l => l.studentId === (currentTeacherProfile || currentUser).id)).length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border text-slate-400 text-xs italic">
                      You have not submitted any leave applications yet.
                    </div>
                  ) : (
                    (leaveRequests || []).filter(l => l.studentId === (currentTeacherProfile || currentUser).id).map((leave) => (
                      <div
                        key={leave.id}
                        className={`p-4 bg-white dark:bg-slate-800/60 border shadow-sm space-y-2 text-left transition-all rounded-2xl ${
                          leave.status === 'Approved' ? 'border-l-4 border-l-emerald-500' :
                          leave.status === 'Rejected' ? 'border-l-4 border-l-red-500' :
                          'border-l-4 border-l-amber-500'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-950 dark:text-slate-100 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                              {leave.leaveType}
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">Submitted: {leave.submittedAt}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                            leave.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                            'bg-amber-500/10 text-amber-600'
                          }`}>
                            {leave.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-700 dark:text-slate-350 font-light space-y-1">
                          <p>
                            <strong>Dates:</strong> {leave.startDate} to {leave.endDate}
                          </p>
                          <p>
                            <strong>Reason:</strong> "{leave.reason}"
                          </p>
                          {leave.adminMessage && (
                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                              <strong>Admin Response:</strong> "{leave.adminMessage}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <datalist id="subjects-list">
        {(subjects && subjects.length > 0 ? subjects : [
          { code: 'SANSKRIT', name: 'Sanskrit' }, { code: 'ENGLISH', name: 'English' },
          { code: 'TELUGU', name: 'Telugu' }, { code: 'HINDI', name: 'Hindi' },
          { code: 'GENERALSCIENCE', name: 'General Science' }, { code: 'DRAWING', name: 'Drawing & Art' },
          { code: 'MATHEMATICS', name: 'Mathematics' }, { code: 'YOGA', name: 'Yoga & P.E.' },
          { code: 'PHYSICS', name: 'Physics' }, { code: 'CHEMISTRY', name: 'Chemistry' },
          { code: 'GENERALKNOWLEDGE', name: 'General Knowledge' },
        ]).map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
      </datalist>
    </div>
  );
}
