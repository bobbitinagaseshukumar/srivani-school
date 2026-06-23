import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { BookOpen, Calendar, Clipboard, Download, GraduationCap, LayoutDashboard, Award, ShieldAlert, Sparkles, RefreshCw, MessageSquare, FileText, CheckSquare, Eye, EyeOff } from 'lucide-react';
import { sendEmail, buildPasswordResetEmail } from '../../lib/emailService';

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
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
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
    { color: 'indigo', border: 'border-indigo-100 dark:border-indigo-900/50', bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-700 dark:text-indigo-350', tag: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300', accent: 'border-l-4 border-l-indigo-500' },
    { color: 'teal', border: 'border-teal-100 dark:border-teal-900/50', bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-350', tag: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300', accent: 'border-l-4 border-l-teal-500' },
    { color: 'rose', border: 'border-rose-100 dark:border-rose-900/50', bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-350', tag: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300', accent: 'border-l-4 border-l-rose-500' }
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

const getTeacherForSubject = (subjectName, teachersList) => {
  if (!teachersList) return 'No Teacher';
  const cleanSub = (subjectName || '').toUpperCase().trim();
  if (cleanSub === 'FREE PERIOD' || cleanSub === '') return '';
  const match = teachersList.find(t => (t.subject || '').toUpperCase().trim() === cleanSub);
  return match ? match.name : 'TBD';
};

export default function StudentPortal() {
  const { currentUser, students, teachers, homework, submitHomework, notes, marks, circulars, liveClasses, timetables, logoutUser, subjects, submitComplaint, complaints, exams, leaveRequests, submitLeaveRequest, attendance, updatePassword } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [leaveReason, setLeaveReason] = useState('');
  const [selectedExamFilter, setSelectedExamFilter] = useState('All');

  // Security settings state
  const [securityNewPassword, setSecurityNewPassword] = useState('');
  const [securityShowPassword, setSecurityShowPassword] = useState(false);
  const [securityEnteredOtp, setSecurityEnteredOtp] = useState('');
  const [securityGeneratedOtp, setSecurityGeneratedOtp] = useState('');
  const [securityOtpSent, setSecurityOtpSent] = useState(false);
  const [securityIsSending, setSecurityIsSending] = useState(false);
  const [securitySimulated, setSecuritySimulated] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityShakeKey, setSecurityShakeKey] = useState(0);
  const [securityOtpGeneratedAt, setSecurityOtpGeneratedAt] = useState(null);

  const triggerSecurityError = (msg) => {
    setSecurityError(msg);
    setSecurityShakeKey(prev => prev + 1);
  };

  // Resend OTP cooldown for security settings
  const [securityResendCooldown, setSecurityResendCooldown] = useState(0);
  const securityResendTimerRef = useRef(null);

  const startSecurityCooldown = (seconds = 30) => {
    setSecurityResendCooldown(seconds);
    if (securityResendTimerRef.current) clearInterval(securityResendTimerRef.current);
    securityResendTimerRef.current = setInterval(() => {
      setSecurityResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(securityResendTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const contentRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const getSubjectName = (code) => {
    if (!code) return '';
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'FREE PERIOD') return 'Free Period';
    const found = subjects ? subjects.find(s => s.code.toUpperCase() === cleanCode) : null;
    return found ? found.name : code;
  };

  const handleRequestPasswordChangeOtp = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    if (!securityNewPassword || securityNewPassword.length < 5) {
      triggerSecurityError('New password must be at least 5 characters long.');
      return;
    }

    try {
      setSecurityIsSending(true);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setSecurityGeneratedOtp(otp);
      setSecurityOtpGeneratedAt(Date.now());

      const targetEmail = studentObj.email && studentObj.email.includes('@') ? studentObj.email : 'nagaseshukumarbobbiti@gmail.com';

      const resData = await sendEmail(
        targetEmail,
        'Sri Vani Portal - Change Password Verification Code',
        buildPasswordResetEmail({ name: studentObj.name, otp })
      );

      setSecuritySimulated(!!resData.simulated);
      setSecurityOtpSent(true);
      setSecuritySuccess('A verification code has been dispatched to your email.');
      startSecurityCooldown(30);
    } catch (err) {
      console.error(err);
      setSecuritySimulated(true);
      setSecurityOtpSent(true);
      setSecuritySuccess('A verification code was simulated.');
      startSecurityCooldown(30);
    } finally {
      setSecurityIsSending(false);
    }
  };

  const handleVerifyPasswordChangeOtp = (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    // Check if security OTP has expired (3 minutes limit)
    const isExpired = securityOtpGeneratedAt && (Date.now() - securityOtpGeneratedAt > 3 * 60 * 1000);
    if (isExpired && securityEnteredOtp !== '123456') {
      triggerSecurityError('Verification code has expired. It was only valid for 3 minutes. Please request a new one.');
      return;
    }

    if (securityEnteredOtp === securityGeneratedOtp || securityEnteredOtp === '123456') {
      const updateRes = updatePassword(studentObj.id, 'Student', securityNewPassword);
      if (updateRes.success) {
        setSecuritySuccess('Your password has been successfully updated.');
        setSecurityNewPassword('');
        setSecurityEnteredOtp('');
        setSecurityOtpSent(false);
      } else {
        triggerSecurityError('Failed to update password. Please try again.');
      }
    } else {
      triggerSecurityError('Invalid verification code. Please check your email or enter 123456.');
    }
  };

  const studentObj = students.find(s => s.id === currentUser.id);

  if (!studentObj) {
    return <div className="p-8 text-center">Student record not found in system state.</div>;
  }

  const isDeletedStudent = studentObj.isDeleted === true;

  // If deleted student, force to Marks tab
  useEffect(() => {
    if (isDeletedStudent && activeTab !== 'Marks') {
      setActiveTab('Marks');
    }
  }, [isDeletedStudent, activeTab]);

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

  // Filter homework assigned to student's class
  const classHw = homework.filter(h => h.class === studentObj.class);
  
  // Filter notes assigned to student's class and section
  const classNotes = notes.filter(n => 
    n.class === studentObj.class && 
    (!n.section || n.section === 'All' || n.section === studentObj.section)
  );

  // Student grades
  const studentMarks = marks.filter(m => m.studentId === studentObj.id);
  const examNames = ['All', ...new Set(studentMarks.map(m => m.examType).filter(Boolean))];
  const filteredMarks = selectedExamFilter === 'All' ? studentMarks : studentMarks.filter(m => m.examType === selectedExamFilter);

  // Filter exams assigned to student's class and section
  const studentExams = (exams || []).filter(ex => 
    ex.class === studentObj.class && (ex.section === 'All' || ex.section === studentObj.section)
  );

  // Dynamic Timetable matching class and section from Super Admin
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timetable = daysOfWeek.map(d => {
    const matched = timetables ? timetables.find(t => t.class === studentObj.class && (t.section || 'A') === (studentObj.section || 'A') && t.day === d) : null;
    return {
      day: d,
      slots: matched && matched.slots ? matched.slots : ['No period scheduled', 'No period scheduled', 'No period scheduled']
    };
  });

  const handleUploadHwFile = (hwId) => {
    // Simulate uploading assignment file
    submitHomework(hwId, {
      studentId: studentObj.id,
      studentName: studentObj.name,
      file: `${studentObj.name.toLowerCase().replace(' ', '_')}_sub.pdf`
    });
    alert("Assignment submitted successfully. Teacher desk notified.");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-slate-800 dark:text-slate-100 text-left flex flex-col lg:flex-row gap-8">
      {/* Sidebar navigation */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="glassmorphism p-5 rounded-3xl border border-white/50 shadow-md space-y-4">
          <div className="text-center space-y-2 pb-4 border-b border-slate-200/50 dark:border-slate-800">
            <img 
              src={studentObj.photo} 
              alt={studentObj.name} 
              className="w-20 h-20 object-cover rounded-full mx-auto border-2 border-blue-500/30 shadow-md"
            />
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">{studentObj.name}</h3>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">{studentObj.class} - {studentObj.section}</p>
              <p className="text-[9px] text-slate-400 font-mono">Reg: {studentObj.registerNo}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5 text-xs font-semibold">
            {(isDeletedStudent ? [
              { id: 'Marks', icon: Award, label: 'Academic Grades' }
            ] : [
              { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'Marks', icon: Award, label: 'Academic Grades' },
              { id: 'Homework', icon: Clipboard, label: 'Homework Desk' },
              { id: 'Notes', icon: Download, label: 'Study Resources' },
              { id: 'Timetable', icon: Calendar, label: 'Class Timetable' },
              { id: 'Attendance', icon: CheckSquare, label: 'Attendance History' },
              { id: 'Leaves', icon: FileText, label: 'Leave Letters' },
              { id: 'Complaints', icon: MessageSquare, label: 'Complaint Box' },
              { id: 'Security', icon: Key, label: 'Security Settings' }
            ]).map((item) => (
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
          Logout Student Panel
        </button>
      </div>

      {/* Main Content Area */}
      <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
        
        {/* Dashboard Tab */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Student Dashboard</h2>
            
            {/* Quick Metrics */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Attendance</p>
                <h3 className="text-2xl font-extrabold mt-1">{studentObj.attendancePct}%</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">Excellent Attendance Status</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Assignments</p>
                <h3 className="text-2xl font-extrabold mt-1">
                  {classHw.filter(h => !h.submissions.some(s => s.studentId === studentObj.id)).length} Tasks
                </h3>
                <p className="text-[10px] text-blue-500 font-semibold mt-1">Check homework desk</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scheduled Live Classes</p>
                <h3 className="text-2xl font-extrabold mt-1">{liveClasses.length} Scheduled</h3>
                <p className="text-[10px] text-indigo-500 font-semibold mt-1">Join virtual class today</p>
              </div>
            </div>

            {/* Notification alert / announcements */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850 space-y-3">
              <h3 className="font-extrabold text-sm">Recent Notice Announcements</h3>
              <div className="divide-y divide-slate-150/45 dark:divide-slate-850 text-xs font-light">
                {circulars.slice(0, 3).map(notice => (
                  <div key={notice.id} className="py-2.5 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>Posted by: {notice.postedBy}</span>
                      <span>{notice.date}</span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">{notice.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-light">{notice.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Examinations Schedule */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850 space-y-3">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-montserrat">
                <Award size={18} /> Upcoming Examination Schedule
              </h3>
              <div className="overflow-x-auto">
                {studentExams.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No upcoming examinations scheduled for your class/section.</p>
                ) : (
                  <table className="w-full text-xs text-left min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                        <th className="py-2">Exam Title</th>
                        <th className="py-2">Type</th>
                        <th className="py-2">Subject</th>
                        <th className="py-2">Date</th>
                        <th className="py-2 text-right">Target Group</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                      {studentExams.map((ex) => (
                        <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="py-3 font-bold text-slate-900 dark:text-white">{ex.name}</td>
                          <td className="py-3 text-blue-600 dark:text-blue-400 font-semibold">{ex.examType}</td>
                          <td className="py-3 font-semibold text-emerald-500">{getSubjectName(ex.subject)}</td>
                          <td className="py-3 font-mono font-bold text-slate-500">{ex.date}</td>
                          <td className="py-3 text-right">
                            <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-[8px] font-bold">
                              {ex.class} {ex.section !== 'All' ? `(Sec ${ex.section})` : '(All)'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Academic Grades Tab */}
        {activeTab === 'Marks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Your Examination Grades</h2>
                {isDeletedStudent && (
                  <div className="mt-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300 font-semibold">
                    ⚠️ Your account has been deactivated. You can only view your marks.
                  </div>
                )}
              </div>
              <select
                value={selectedExamFilter}
                onChange={(e) => setSelectedExamFilter(e.target.value)}
                className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none min-w-[180px]"
              >
                {examNames.map(name => (
                  <option key={name} value={name}>{name === 'All' ? '📋 All Exams' : name}</option>
                ))}
              </select>
            </div>

            {/* Performance Graphs (SVG chart) */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850">
              <h4 className="font-extrabold text-sm mb-4">Subject-wise Score Analysis {selectedExamFilter !== 'All' && <span className="text-blue-500 font-normal">— {selectedExamFilter}</span>}</h4>
              <div className="h-40 w-full flex items-end justify-between px-6 pt-4">
                {filteredMarks.map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-20">
                    <div className="w-8 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md transition-all" style={{ height: `${m.marks * 1.2}px` }}></div>
                    <span className="text-[10px] text-slate-900 dark:text-white font-bold">{m.marks}%</span>
                    <span className="text-[9px] text-slate-400">{getSubjectName(m.subject)}</span>
                  </div>
                ))}
                {filteredMarks.length === 0 && (
                  <div className="w-full text-center text-slate-450 text-xs font-light py-8">
                    {selectedExamFilter === 'All' ? 'No grade reports uploaded for this academic term yet.' : `No results found for "${selectedExamFilter}".`}
                  </div>
                )}
              </div>
            </div>

            {/* Marks Table */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">Subject</th>
                      <th className="p-4">Exam Type</th>
                      <th className="p-4">Marks</th>
                      <th className="p-4">Grade</th>
                      <th className="p-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                    {filteredMarks.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{getSubjectName(m.subject)}</td>
                        <td className="p-4">{m.examType}</td>
                        <td className="p-4 font-mono font-bold">{m.marks} / {m.maxMarks}</td>
                        <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{m.grade}</td>
                        <td className="p-4 text-slate-550 dark:text-slate-400 italic">"{m.remarks}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Homework Desk Tab */}
        {activeTab === 'Homework' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Assigned Class Homework</h2>
            
            <div className="space-y-4">
              {classHw.map((hw) => {
                const sub = hw.submissions.find(s => s.studentId === studentObj.id);
                return (
                  <div key={hw.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">{getSubjectName(hw.subject)}</span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">{hw.title}</h4>
                      </div>
                      <span className="text-[10px] text-red-500 font-semibold font-mono">Due: {hw.dueDate}</span>
                    </div>

                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-light">{hw.description}</p>
                    
                    <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">Submission File: <span className="font-semibold font-mono">{hw.file}</span></span>
                      
                      {sub ? (
                        <div className="text-right">
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded ${
                            sub.status === 'Evaluated' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-550'
                          }`}>{sub.status}</span>
                          {sub.status === 'Evaluated' && (
                            <p className="text-[9px] text-slate-400 mt-1 font-bold">Grade: {sub.grade} | "{sub.feedback}"</p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUploadHwFile(hw.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg shadow"
                        >
                          Submit Assignment Mock
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {classHw.length === 0 && (
                <div className="text-center py-12 glassmorphism rounded-2xl text-slate-400 text-xs font-light">
                  No homework assignments active for your class.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Study Materials Tab */}
        {activeTab === 'Notes' && (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-extrabold font-montserrat">Notes & Study Resources</h2>
            <p className="text-xs text-slate-400 font-light mt-1">Download chapters, test preparation papers, and reference documents.</p>

            <div className="grid sm:grid-cols-2 gap-6">
              {classNotes.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/55 dark:border-slate-800 rounded-2xl p-5 shadow-md flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded">{getSubjectName(item.subject)} • {item.chapter}</span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-light leading-relaxed">{item.description}</p>
                  </div>
                  {item.fileData ? (
                    <button
                      onClick={() => openPDF(item.fileData, item.file)}
                      className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-650 flex items-center justify-center hover:bg-indigo-650 hover:text-white transition-all shrink-0 cursor-pointer"
                      title="Open PDF / Document"
                    >
                      <Download size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`Beginning download stream for local file: ${item.file}`)}
                      className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shrink-0 cursor-pointer"
                    >
                      <Download size={18} />
                    </button>
                  )}
                </div>
              ))}
              {classNotes.length === 0 && (
                <div className="text-center py-12 glassmorphism rounded-2xl text-slate-400 text-xs font-light col-span-2">
                  No study resources listed for your grade yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendance History Tab */}
        {activeTab === 'Attendance' && (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-extrabold font-montserrat">Your Attendance History</h2>
            <p className="text-xs text-slate-400 font-light mt-1">Review your overall attendance stats and session-by-session records.</p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Attendance</p>
                <h3 className="text-2xl font-extrabold mt-1">{studentObj.attendancePct || 0}%</h3>
                <p className="text-[10px] text-blue-500 font-semibold mt-1">
                  {(studentObj.attendancePct || 0) >= 75 ? "Good Standing Status" : "Low Attendance Warning"}
                </p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Recorded Sessions</p>
                <h3 className="text-2xl font-extrabold mt-1">
                  {attendance.filter(a => a.studentId === studentObj.id).length} Sessions
                </h3>
                <p className="text-[10px] text-indigo-500 font-semibold mt-1 font-light">Morning and Afternoon combined</p>
              </div>
            </div>

            <div className="glassmorphism p-6 rounded-2xl border border-white/50 text-center text-slate-450 dark:text-slate-400 text-xs font-light">
              ℹ️ Detailed day-by-day logs are managed under Super Admin administrative controls.
            </div>
          </div>
        )}

        {/* Timetable Tab */}
        {activeTab === 'Timetable' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Weekly Academic Timetable</h2>
                <p className="text-[10px] text-slate-450 mt-0.5">Real-time schedule for your class room and registered courses</p>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-3 py-1.5 rounded-full border border-blue-500/20">{studentObj.class} Section {studentObj.section}</span>
            </div>
            
            <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                {(() => {
                  const maxPeriods = timetables 
                    ? Math.max(4, ...timetables.filter(t => t.class === studentObj.class && (t.section || 'A') === (studentObj.section || 'A')).map(t => t.slots ? t.slots.length : 0)) 
                    : 4;
                  return (
                    <table className="w-full min-w-[650px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-450 font-bold uppercase tracking-wider text-[9px]">
                          <th className="py-3 px-2 text-left w-24">Day</th>
                          {Array.from({ length: maxPeriods }).map((_, pIdx) => (
                            <th key={pIdx} className="py-3 px-2 text-center">Period {pIdx + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                          .filter(d => {
                            if (d === 'Saturday' || d === 'Sunday') {
                              return timetables && timetables.some(t => t.class === studentObj.class && (t.section || 'A') === (studentObj.section || 'A') && t.day === d && t.slots && t.slots.some(slot => {
                                const parsed = parseSlot(slot);
                                return parsed.subject && parsed.subject !== 'FREE PERIOD' && parsed.subject !== '';
                              }));
                            }
                            return true;
                          })
                          .map(d => {
                            const matched = timetables ? timetables.find(t => t.class === studentObj.class && (t.section || 'A') === (studentObj.section || 'A') && t.day === d) : null;
                            
                            return (
                              <tr key={d} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                                <td className="py-4 px-2 font-bold text-slate-900 dark:text-white align-middle w-24">
                                  <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-[10px] border border-slate-200/50 dark:border-slate-800 w-full text-center">
                                    {d}
                                  </span>
                                </td>
                                {Array.from({ length: maxPeriods }).map((_, periodIdx) => {
                                  const slotRaw = matched && matched.slots && matched.slots[periodIdx] ? matched.slots[periodIdx] : null;
                                  const parsed = parseSlot(slotRaw);
                                  const style = getSubjectStyle(parsed.subject);
                                  const teacherName = getTeacherForSubject(parsed.subject, teachers);
                                  
                                  return (
                                    <td key={periodIdx} className="py-4 px-2 text-center align-middle">
                                      <div className={`p-2.5 rounded-2xl border ${style.bg} ${style.accent} flex flex-col items-center justify-center space-y-1 transition duration-200 hover:scale-[1.03] hover:shadow-md`}>
                                        <span className={`text-[10px] font-extrabold tracking-tight px-2.5 py-0.5 rounded-full ${style.tag}`}>
                                          {getSubjectName(parsed.subject)}
                                        </span>
                                        <span className="text-[9px] font-mono text-slate-500 font-medium">
                                          {parsed.time}
                                        </span>
                                        {parsed.subject !== 'FREE PERIOD' && (
                                          <span className="text-[8px] text-slate-500 dark:text-slate-400 font-semibold italic bg-white/40 dark:bg-black/10 px-1.5 py-0.5 rounded leading-tight">
                                            {teacherName}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Leave Letters Tab */}
        {activeTab === 'Leaves' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Leave Management System</h2>
            <p className="text-xs text-slate-400 font-light mt-1">Submit formal leave applications for admin review. Once processed, status updates will reflect below.</p>
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
                    submitLeaveRequest(studentObj.id, studentObj.name, studentObj.class, studentObj.section, {
                      leaveType,
                      startDate: leaveStartDate,
                      endDate: leaveEndDate,
                      reason: leaveReason
                    });
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
                  {((leaveRequests || []).filter(l => l.studentId === studentObj.id)).length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border text-slate-400 text-xs italic">
                      You have not submitted any leave applications yet.
                    </div>
                  ) : (
                    (leaveRequests || []).filter(l => l.studentId === studentObj.id).map((leave) => (
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
                        </div>

                        {leave.adminMessage && (
                          <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/40 dark:border-slate-850 text-[11px] mt-2">
                            <span className="font-bold text-slate-500 block uppercase text-[9px] mb-1">Admin Response:</span>
                            <p className="text-slate-650 dark:text-slate-300 italic">"{leave.adminMessage}"</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Box / Grievance Form Tab */}
        {activeTab === 'Complaints' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Complaint Box / Grievance Form</h2>
            <p className="text-xs text-slate-400 font-light mt-1">Submit complaints or grievances. Your submissions will be reviewed by Super Admin.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!complaintSubject.trim() || !complaintDescription.trim()) {
                  alert('Please fill both Subject and Description.');
                  return;
                }
                submitComplaint(studentObj.id, complaintSubject, complaintDescription);
                setComplaintSubject('');
                setComplaintDescription('');
                alert('Complaint submitted successfully. You will be notified when it is reviewed.');
              }}
              className="glassmorphism p-6 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl"
            >
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">New Complaint</h3>
              <input
                type="text" required placeholder="Subject of your complaint"
                value={complaintSubject}
                onChange={(e) => setComplaintSubject(e.target.value)}
                className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <textarea
                required placeholder="Describe your complaint or grievance in detail..."
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
                rows={4}
                className="w-full p-3.5 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow">
                Submit Complaint
              </button>
            </form>

            {/* Display submitted complaints */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm">Your Submitted Complaints</h3>
              {complaints && complaints.filter(c => c.studentId === studentObj.id).length > 0 ? (
                complaints.filter(c => c.studentId === studentObj.id).map((c) => (
                  <div key={c.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{c.subject}</h4>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                        c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                        c.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-red-500/10 text-red-500'
                      }`}>{c.status}</span>
                    </div>
                    <p className="text-xs text-slate-550 dark:text-slate-350 leading-relaxed font-light">{c.description}</p>
                    <p className="text-[9px] text-slate-400">Submitted: {c.submittedAt}</p>
                    {c.reply && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/55 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">Reply from Super Admin:</p>
                        <p className="text-slate-550 dark:text-slate-350 mt-1 font-light">{c.reply}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 glassmorphism rounded-2xl text-slate-400 text-xs font-light">
                  No complaints submitted yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Settings Tab */}
        {activeTab === 'Security' && (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-extrabold font-montserrat">Security Settings</h2>
            <p className="text-xs text-slate-400 font-light mt-1">Manage your login credentials. Changing your password requires verifying an OTP code sent to your registered email address.</p>

            <div className="glassmorphism p-6 rounded-2xl border border-white/50 shadow-lg space-y-6 max-w-xl">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Update Password</h3>
              
              {securityError && (
                <div key={securityShakeKey} className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 p-3 rounded-xl text-xs font-medium animate-shake">
                  {securityError}
                </div>
              )}
              {securitySuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 dark:text-emerald-400 p-3 rounded-xl text-xs font-medium">
                  {securitySuccess}
                </div>
              )}

              {!securityOtpSent ? (
                <form onSubmit={handleRequestPasswordChangeOtp} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">New Password</label>
                    <div className="relative">
                      <input
                        type={securityShowPassword ? 'text' : 'password'}
                        required
                        value={securityNewPassword}
                        onChange={(e) => setSecurityNewPassword(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setSecurityShowPassword(!securityShowPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                      >
                        {securityShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={securityIsSending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition"
                  >
                    {securityIsSending ? 'Requesting OTP...' : 'Send OTP to Verify'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyPasswordChangeOtp} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Enter OTP Security Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={securityEnteredOtp}
                      onChange={(e) => setSecurityEnteredOtp(e.target.value)}
                      className="w-full text-center tracking-[12px] text-lg font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      placeholder="000000"
                    />
                  </div>

                  {/* Resend OTP Button */}
                  <div className="text-center">
                    <button
                      type="button"
                      disabled={securityResendCooldown > 0 || securityIsSending}
                      onClick={async () => {
                        try {
                          setSecurityIsSending(true);
                          const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                          setSecurityGeneratedOtp(newOtp);
                          setSecurityOtpGeneratedAt(Date.now());
                          setSecurityEnteredOtp('');
                          const targetEmail = studentObj.email && studentObj.email.includes('@') ? studentObj.email : 'nagaseshukumarbobbiti@gmail.com';
                          await sendEmail(targetEmail, 'Sri Vani Portal - Change Password Verification Code', buildPasswordResetEmail({ name: studentObj.name, otp: newOtp }));
                          startSecurityCooldown(30);
                          setSecuritySuccess('A new verification code has been sent.');
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setSecurityIsSending(false);
                        }
                      }}
                      className={`text-xs font-bold transition cursor-pointer ${
                        securityResendCooldown > 0 || securityIsSending
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-700 hover:underline'
                      }`}
                    >
                      {securityIsSending ? 'Sending...' : securityResendCooldown > 0 ? `Resend Code in ${securityResendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setSecurityOtpSent(false); setSecurityError(''); setSecuritySuccess(''); setSecurityResendCooldown(0); }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer text-center text-slate-650 dark:text-slate-350"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition"
                    >
                      Verify & Save Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
