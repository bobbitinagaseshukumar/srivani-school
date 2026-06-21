import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  ShieldCheck, Plus, ToggleLeft, ToggleRight, Building, CheckCircle2, 
  DollarSign, Activity, Settings, UserCheck, Trash2, Edit, X, 
  FileSpreadsheet, Lock, User, Key, Mail, Phone, MapPin, Sparkles, AlertCircle, Calendar, Clipboard,
  Image, Video, Upload, ZoomIn, FolderOpen, Filter, MessageSquare, Home, Menu, ChevronDown, Eye, EyeOff
} from 'lucide-react';

const presetTimings = [
  '09:30 AM - 10:15 AM',
  '10:30 AM - 11:15 AM',
  '11:30 AM - 12:15 PM',
  '01:00 PM - 01:45 PM',
  '02:00 PM - 02:45 PM',
  '03:00 PM - 03:45 PM',
  '03:45 PM - 04:30 PM',
  '04:30 PM - 05:15 PM'
];

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
  if (cleanSub.includes('PHYSICS')) {
    return {
      bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50',
      text: 'text-blue-700 dark:text-blue-350',
      tag: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
      accent: 'border-l-4 border-l-blue-500'
    };
  }
  if (cleanSub.includes('MATH')) {
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
  if (cleanSub.includes('GENERALKNOWLEDGE') || cleanSub.includes('GK') || cleanSub.includes('COMPUTER')) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
      text: 'text-emerald-700 dark:text-emerald-350',
      tag: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
      accent: 'border-l-4 border-l-emerald-500'
    };
  }
  return {
    bg: 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800',
    text: 'text-slate-500 dark:text-slate-400',
    tag: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    accent: 'border-l-4 border-l-slate-400'
  };
};

const getTeacherForSubject = (subjectName, teachersList) => {
  if (!teachersList) return 'No Teacher';
  const cleanSub = (subjectName || '').toUpperCase().trim();
  if (cleanSub === 'FREE PERIOD' || cleanSub === '') return '';
  const match = teachersList.find(t => (t.subject || '').toUpperCase().trim() === cleanSub);
  return match ? match.name : 'TBD';
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

export default function SuperAdminPortal() {
  const { 
    schools, toggleSchoolStatus,
    teachers, students, parents, admins, fees, saveClassFee, deleteClassFee,
    circulars, deleteCircular,
    tickerItems, addTickerItem, editTickerItem, deleteTickerItem,
    schoolInfo, updateSchoolInfo, managementCommittee, addCommitteeMember, editCommitteeMember, deleteCommitteeMember,
    auditLogs, supportTickets, timetables, saveTimetable,
    addTeacher, editTeacher, deleteTeacher,
    addAdmin, editAdmin, deleteAdmin,
    addStudent, editStudent, deleteStudent,
    addParent, editParent, deleteParent,
    addAuditLog, logoutUser,
    galleryItems, addGalleryItem, editGalleryItem, deleteGalleryItem,
    academicCalendar, addCalendarEvent, editCalendarEvent, deleteCalendarEvent,
    academicPrograms, addAcademicProgram, editAcademicProgram, deleteAcademicProgram,
    testimonials, addTestimonial, editTestimonial, deleteTestimonial, toggleTestimonial,
    enquiries, markEnquiryContacted, deleteEnquiry,
    subjects, addSubject, editSubject, deleteSubject,
    admissionBanner, updateAdmissionBanner,
    admissions, submitAdmission, approveAdmission, rejectAdmission,
    facilities, addFacility, editFacility, deleteFacility,
    homepageInfra, updateInfraItem, addInfraItem, deleteInfraItem,
    homepageStats, updateHomepageStat, addHomepageStat, deleteHomepageStat,
    gradingProcess, updateGradingProcess,
    gradingScheme, updateGradingScheme,
    departments, addDepartment, editDepartment, deleteDepartment,
    galleryCategories, addGalleryCategory, editGalleryCategory, deleteGalleryCategory,
    complaints, updateComplaintStatus,
    whatsappLogs,
    requiredDocuments, updateRequiredDocuments,
    leaveRequests, updateLeaveStatus, starredFormFields, updateStarredFormFields, updateAdmissionFields, toggleAdmissionFieldStar
  } = useContext(AppContext);



  const [activeTab, setActiveTab] = useState('Schools');
  
  // School Tenant form
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: '', code: '', address: '', studentsCount: 0, teachersCount: 0 });

  // Admin states
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminEditId, setAdminEditId] = useState(null);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });

  // Teacher states
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [teacherEditId, setTeacherEditId] = useState(null);
  const [teacherForm, setTeacherForm] = useState({ id: '', name: '', subject: 'PHYSICS', qualification: '', phone: '', email: '', password: '', department: 'Science', experience: '5 Years', designation: 'Senior Teacher', salary: 5000, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' });

  // Student states
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentEditId, setStudentEditId] = useState(null);
  const [studentForm, setStudentForm] = useState({ name: '', registerNo: '', phone: '', address: '', class: 'Class 10', section: 'A', email: '', password: '', dob: '2010-01-01', gender: 'Male', bloodGroup: 'O+', aadhaarNo: '1234-5678-9012', parentName: '', parentPhone: '', emergencyContact: '', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' });
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('All');
  const [duplicateError, setDuplicateError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showParentPassword, setShowParentPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const toggleRevealPassword = (id) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Admissions tab states
  const [whatsappToast, setWhatsappToast] = useState(null);
  const [newDocName, setNewDocName] = useState('');
  const [showPendingAdmissions, setShowPendingAdmissions] = useState(false);
  const [showModuleMenu, setShowModuleMenu] = useState(false);

  // Facilities tab states
  const [showFacilityForm, setShowFacilityForm] = useState(false);
  const [facilityEditId, setFacilityEditId] = useState(null);
  const [facilityForm, setFacilityForm] = useState({ title: '', description: '', icon: '🏫' });

  // Complaints tab states
  const [complaintReplyId, setComplaintReplyId] = useState(null);
  const [complaintReplyText, setComplaintReplyText] = useState('');

  const [adminFeedbackMsg, setAdminFeedbackMsg] = useState({});
  const [leaveFilter, setLeaveFilter] = useState('Pending');
  const [admissionFilter, setAdmissionFilter] = useState('Pending');
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const contentRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Department manager states
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [deptEditId, setDeptEditId] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: '' });

  // Grading manager states
  const [editingGradingProcess, setEditingGradingProcess] = useState(false);

  // Homepage manager states
  const [editingInfraId, setEditingInfraId] = useState(null);
  const [infraEditForm, setInfraEditForm] = useState({ title: '', description: '', image: '' });
  const [showInfraAddForm, setShowInfraAddForm] = useState(false);
  const [infraAddForm, setInfraAddForm] = useState({ title: '', description: '', image: '' });
  const [editingStatId, setEditingStatId] = useState(null);
  const [statEditForm, setStatEditForm] = useState({ label: '', value: '', icon: '' });
  const [showStatAddForm, setShowStatAddForm] = useState(false);
  const [statAddForm, setStatAddForm] = useState({ label: '', value: '', icon: '🏆' });

  // Gallery category manager states
  const [showGalCatForm, setShowGalCatForm] = useState(false);
  const [galCatEditId, setGalCatEditId] = useState(null);
  const [galCatForm, setGalCatForm] = useState({ name: '' });

  // Bulk Excel importer state
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkImportResult, setBulkImportResult] = useState('');

  // Parent states
  const [showParentForm, setShowParentForm] = useState(false);
  const [parentEditId, setParentEditId] = useState(null);
  const [parentForm, setParentForm] = useState({ name: '', phone: '', email: '', password: '', childrenIds: [] });
  const [parentSearch, setParentSearch] = useState('');
  const [parentClassFilter, setParentClassFilter] = useState('All');

  // Timetables states
  const [timetableClass, setTimetableClass] = useState('Class 10');
  const [timetableDay, setTimetableDay] = useState('Monday');
  const [periodsCount, setPeriodsCount] = useState(4);
  const [period1Sub, setPeriod1Sub] = useState('PHYSICS');
  const [period1Time, setPeriod1Time] = useState('09:30 AM - 10:15 AM');
  const [period2Sub, setPeriod2Sub] = useState('MATHEMATICS');
  const [period2Time, setPeriod2Time] = useState('10:30 AM - 11:15 AM');
  const [period3Sub, setPeriod3Sub] = useState('ENGLISH');
  const [period3Time, setPeriod3Time] = useState('11:30 AM - 12:15 PM');
  const [period4Sub, setPeriod4Sub] = useState('GENERALKNOWLEDGE');
  const [period4Time, setPeriod4Time] = useState('01:00 PM - 01:45 PM');
  const [period5Sub, setPeriod5Sub] = useState('FREE PERIOD');
  const [period5Time, setPeriod5Time] = useState('02:00 PM - 02:45 PM');
  const [period6Sub, setPeriod6Sub] = useState('FREE PERIOD');
  const [period6Time, setPeriod6Time] = useState('03:00 PM - 03:45 PM');
  const [period7Sub, setPeriod7Sub] = useState('FREE PERIOD');
  const [period7Time, setPeriod7Time] = useState('03:45 PM - 04:30 PM');
  const [period8Sub, setPeriod8Sub] = useState('FREE PERIOD');
  const [period8Time, setPeriod8Time] = useState('04:30 PM - 05:15 PM');

  // Fees states
  const [feeClass, setFeeClass] = useState('Class 10');
  const [feeYear, setFeeYear] = useState('2026');
  const [tuitionFee, setTuitionFee] = useState(1800);
  const [labFee, setLabFee] = useState(300);
  const [busFee, setBusFee] = useState(250);
  const [booksFee, setBooksFee] = useState(180);

  // News Ticker states
  const [showTickerForm, setShowTickerForm] = useState(false);
  const [tickerEditId, setTickerEditId] = useState(null);
  const [tickerForm, setTickerForm] = useState({ title: '', desc: '', type: 'Academic' });

  // School settings states
  const [editSchoolForm, setEditSchoolForm] = useState({ ...schoolInfo });
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberEditId, setMemberEditId] = useState(null);
  const [memberForm, setMemberForm] = useState({ name: '', role: '', qual: '', photo: '' });

  useEffect(() => {
    if (schoolInfo) {
      setEditSchoolForm({ ...schoolInfo });
    }
  }, [schoolInfo]);

  // Handle timetable auto loading
  useEffect(() => {
    const matched = timetables ? timetables.find(t => t.class === timetableClass && t.day === timetableDay) : null;
    
    // Set default values for all 8 periods
    const defaultSubs = (timetableDay === 'Saturday' || timetableDay === 'Sunday')
      ? ['FREE PERIOD', 'FREE PERIOD', 'FREE PERIOD', 'FREE PERIOD', 'FREE PERIOD', 'FREE PERIOD', 'FREE PERIOD', 'FREE PERIOD']
      : ['PHYSICS', 'MATHEMATICS', 'ENGLISH', 'GENERALKNOWLEDGE', 'FREE PERIOD', 'FREE PERIOD', 'FREE PERIOD', 'FREE PERIOD'];
    const defaultTimes = [
      '09:30 AM - 10:15 AM',
      '10:30 AM - 11:15 AM',
      '11:30 AM - 12:15 PM',
      '01:00 PM - 01:45 PM',
      '02:00 PM - 02:45 PM',
      '03:00 PM - 03:45 PM',
      '03:45 PM - 04:30 PM',
      '04:30 PM - 05:15 PM'
    ];
    
    const setPeriodState = (num, sub, time) => {
      if (num === 1) { setPeriod1Sub(sub); setPeriod1Time(time); }
      if (num === 2) { setPeriod2Sub(sub); setPeriod2Time(time); }
      if (num === 3) { setPeriod3Sub(sub); setPeriod3Time(time); }
      if (num === 4) { setPeriod4Sub(sub); setPeriod4Time(time); }
      if (num === 5) { setPeriod5Sub(sub); setPeriod5Time(time); }
      if (num === 6) { setPeriod6Sub(sub); setPeriod6Time(time); }
      if (num === 7) { setPeriod7Sub(sub); setPeriod7Time(time); }
      if (num === 8) { setPeriod8Sub(sub); setPeriod8Time(time); }
    };

    if (matched && matched.slots && matched.slots.length > 0) {
      setPeriodsCount(matched.slots.length);
      for (let i = 1; i <= 8; i++) {
        if (matched.slots[i - 1]) {
          const slot = matched.slots[i - 1];
          const parsed = parseSlot(slot);
          setPeriodState(i, parsed.subject, parsed.time);
        } else {
          setPeriodState(i, 'FREE PERIOD', defaultTimes[i - 1]);
        }
      }
    } else {
      setPeriodsCount(4);
      for (let i = 1; i <= 8; i++) {
        setPeriodState(i, defaultSubs[i - 1] || 'FREE PERIOD', defaultTimes[i - 1]);
      }
    }
  }, [timetableClass, timetableDay, timetables]);

  // Handle fee auto loading
  useEffect(() => {
    const matched = fees ? fees.find(f => f.class === feeClass && f.year === feeYear) : null;
    if (matched) {
      setTuitionFee(matched.tuitionFee);
      setLabFee(matched.labFee);
      setBusFee(matched.busFee !== undefined ? matched.busFee : 250);
      setBooksFee(matched.booksFee !== undefined ? matched.booksFee : 180);
    } else {
      setTuitionFee(1800);
      setLabFee(300);
      setBusFee(250);
      setBooksFee(180);
    }
  }, [feeClass, feeYear, fees]);

  const handleTimetableSubmit = (e) => {
    e.preventDefault();
    const slots = [];
    if (periodsCount >= 1) slots.push(`${period1Sub} (${period1Time})`);
    if (periodsCount >= 2) slots.push(`${period2Sub} (${period2Time})`);
    if (periodsCount >= 3) slots.push(`${period3Sub} (${period3Time})`);
    if (periodsCount >= 4) slots.push(`${period4Sub} (${period4Time})`);
    if (periodsCount >= 5) slots.push(`${period5Sub} (${period5Time})`);
    if (periodsCount >= 6) slots.push(`${period6Sub} (${period6Time})`);
    if (periodsCount >= 7) slots.push(`${period7Sub} (${period7Time})`);
    if (periodsCount >= 8) slots.push(`${period8Sub} (${period8Time})`);
    
    saveTimetable(timetableClass, timetableDay, slots);
    alert(`Timetable saved with ${periodsCount} periods for ${timetableClass} on ${timetableDay}.`);
  };

  const handleFeeSubmit = (e) => {
    e.preventDefault();
    saveClassFee(feeClass, feeYear, tuitionFee, labFee, busFee, booksFee);
    alert(`Fee parameters updated for ${feeClass} (${feeYear}).`);
  };

  const handleTickerSubmit = (e) => {
    e.preventDefault();
    if (!tickerForm.title || !tickerForm.desc) {
      alert('Please fill out both Title and Description.');
      return;
    }
    if (tickerEditId) {
      editTickerItem(tickerEditId, tickerForm);
      alert('Ticker bulletin updated successfully.');
    } else {
      addTickerItem(tickerForm);
      alert('Ticker bulletin added successfully.');
    }
    setTickerForm({ title: '', desc: '', type: 'Academic' });
    setTickerEditId(null);
    setShowTickerForm(false);
  };

  const handleSchoolInfoSubmit = (e) => {
    e.preventDefault();
    updateSchoolInfo(editSchoolForm);
    alert('Public school information details updated successfully.');
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.role) {
      alert('Please fill out Name and Role fields.');
      return;
    }
    if (memberEditId) {
      editCommitteeMember(memberEditId, memberForm);
      alert('Committee member details updated successfully.');
    } else {
      addCommitteeMember(memberForm);
      alert('Committee member added successfully.');
    }
    setMemberForm({ name: '', role: '', qual: '', photo: '' });
    setMemberEditId(null);
    setShowMemberForm(false);
  };

  // School metrics
  const systemMetrics = [
    { label: 'Total Students', value: `${(students || []).length} Enrolled`, icon: User, color: 'text-emerald-500' },
    { label: 'Total Teachers', value: `${(teachers || []).length} Faculty`, icon: UserCheck, color: 'text-blue-500' },
    { label: 'Database Replication', value: '100% Synced', icon: CheckCircle2, color: 'text-purple-500' }
  ];

  // Helper selectors — driven by Super Admin subjects
  const subjectsList = (subjects || []).map(s => s.code);
  const classesList = ['Playclass', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

  // Admin submit
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.email || !adminForm.password) return;

    if (adminEditId) {
      editAdmin(adminEditId, adminForm);
      alert('Admin updated successfully.');
    } else {
      const res = addAdmin(adminForm);
      if (!res.success) {
        alert(res.message);
        return;
      }
      alert('Admin created successfully.');
    }
    setAdminForm({ name: '', email: '', password: '' });
    setAdminEditId(null);
    setShowAdminForm(false);
  };

  // Teacher submit
  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.id || !teacherForm.email || !teacherForm.password) {
      alert('Please fill out all required fields.');
      return;
    }

    if (teacherEditId) {
      editTeacher(teacherEditId, teacherForm);
      alert('Teacher updated successfully.');
    } else {
      const res = addTeacher(teacherForm);
      if (res && res.success === false) {
        alert(res.message);
        return;
      }
      alert('Teacher created successfully.');
    }
    setTeacherForm({ id: '', name: '', subject: 'PHYSICS', qualification: '', phone: '', email: '', password: '', department: 'Science', experience: '5 Years', designation: 'Senior Teacher', salary: 5000, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' });
    setTeacherEditId(null);
    setShowTeacherForm(false);
  };

  // Student submit
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setDuplicateError('');
    if (!studentForm.name || !studentForm.registerNo || !studentForm.phone || !studentForm.password) {
      alert('Please fill out all required fields.');
      return;
    }

    if (studentEditId) {
      editStudent(studentEditId, studentForm);
      alert('Student profile updated.');
      setShowStudentForm(false);
      setStudentEditId(null);
    } else {
      const res = addStudent(studentForm);
      if (res.success) {
        alert('Student registered successfully.');
        setStudentForm({ name: '', registerNo: '', phone: '', address: '', class: 'Class 10', section: 'A', email: '', password: '', dob: '2010-01-01', gender: 'Male', bloodGroup: 'O+', aadhaarNo: '1234-5678-9012', parentName: '', parentPhone: '', emergencyContact: '', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' });
        setShowStudentForm(false);
      } else {
        setDuplicateError(res.message);
      }
    }
  };

  // Excel/CSV import parser
  const handleBulkImport = () => {
    setBulkImportResult('');
    if (!bulkCsvText.trim()) return;

    const lines = bulkCsvText.split('\n');
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    lines.forEach((line, index) => {
      if (!line.trim()) return;
      
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 8) {
        failCount++;
        errors.push(`Row ${index + 1}: Missing fields. Expected 8 fields (Name, RegisterNo, Mobile, Address, Class, Section, Email, Password).`);
        return;
      }

      const [name, registerNo, phone, address, studentClass, section, email, password] = parts;
      
      const tempStudent = {
        name,
        registerNo,
        phone,
        address,
        class: studentClass,
        section,
        email,
        password,
        dob: '2010-01-01',
        gender: 'Male',
        bloodGroup: 'O+',
        aadhaarNo: 'N/A',
        parentName: '',
        parentPhone: phone,
        emergencyContact: phone,
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      };

      const res = addStudent(tempStudent);
      if (res.success) {
        successCount++;
      } else {
        failCount++;
        errors.push(`Row ${index + 1} ("${name}"): ${res.message}`);
      }
    });

    setBulkImportResult(`Import Complete! Successfully registered: ${successCount} accounts. Skipped/Failed: ${failCount} accounts.`);
    if (errors.length > 0) {
      setBulkImportResult(prev => `${prev}\n\nErrors detail:\n` + errors.join('\n'));
    }
    setBulkCsvText('');
  };

  // Parent submit
  const handleParentSubmit = (e) => {
    e.preventDefault();
    if (!parentForm.name || !parentForm.email || !parentForm.password || parentForm.childrenIds.length === 0) {
      alert('Please fill out all required fields and select at least one linked child student.');
      return;
    }

    if (parentEditId) {
      editParent(parentEditId, parentForm);
      alert('Parent updated successfully.');
    } else {
      const res = addParent(parentForm);
      if (res && res.success === false) {
        alert(res.message);
        return;
      }
      alert('Parent registered successfully.');
    }

    setParentForm({ name: '', phone: '', email: '', password: '', childrenIds: [] });
    setParentEditId(null);
    setShowParentForm(false);
  };

  // Link children handler
  const handleToggleLinkChild = (studentId) => {
    setParentForm(prev => {
      const ids = prev.childrenIds.includes(studentId)
        ? prev.childrenIds.filter(id => id !== studentId)
        : [...prev.childrenIds, studentId];
      return { ...prev, childrenIds: ids };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-slate-800 dark:text-slate-100 text-left font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-montserrat flex items-center gap-2">
            <ShieldCheck className="text-blue-600 animate-pulse" size={32} /> Super Admin Control Network
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
            Centralized User Administration Panel. Creates all logins, restricts student self-enrollment, and manages system nodes.
          </p>
        </div>
        <button 
          onClick={logoutUser} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition-all shrink-0"
        >
          Logout Session
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemMetrics.map((met, idx) => (
          <div key={idx} className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md flex gap-4 items-center">
            <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-blue-500 shrink-0`}>
              <met.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{met.label}</p>
              <h3 className="font-extrabold text-base mt-0.5 text-slate-900 dark:text-white">{met.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Collapsible Module Navigation Tab Bar for responsiveness & cleaner look */}
      <div className="relative mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowModuleMenu(!showModuleMenu)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-between gap-3 border border-blue-500/20"
          >
            <span className="flex items-center gap-2">
              <Menu size={16} />
              Portal Directory Menu (Active Module: <span className="underline decoration-wavy decoration-white/50">{activeTab}</span>)
            </span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${showModuleMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Quick Indicator Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {enquiries.filter(e => e.status === 'New').length > 0 && (
              <span 
                onClick={() => { setActiveTab('Enquiries'); setShowModuleMenu(false); }}
                className="cursor-pointer bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full animate-bounce shadow flex items-center gap-1"
              >
                ✉️ {enquiries.filter(e => e.status === 'New').length} Enquiries
              </span>
            )}
            {admissions.filter(a => a.status === 'Pending').length > 0 && (
              <span 
                onClick={() => { setActiveTab('Admissions'); setShowModuleMenu(false); }}
                className="cursor-pointer bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded-full animate-pulse shadow flex items-center gap-1"
              >
                ⏳ {admissions.filter(a => a.status === 'Pending').length} Admissions
              </span>
            )}
          </div>
        </div>

        {showModuleMenu && (
          <>
            {/* Click outside backdrop overlay to dismiss menu */}
            <div className="fixed inset-0 z-30" onClick={() => setShowModuleMenu(false)} />
            
            <div className="absolute left-0 right-0 mt-2 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-2xl z-40 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 animate-fadeIn max-h-[380px] overflow-y-auto">
              {['Schools','Admissions','Admins','Teachers','Students','Parents','Timetables','Fee Manager','News Ticker','Gallery Manager','Academics','Subjects','Enquiries','Testimonials','Facilities','Homepage','Leaves','Complaints','School Settings','Committee Members','Audit Logs'].map((tab) => {
                const hasPendingAdmissions = tab === 'Admissions' && admissions.filter(a => a.status === 'Pending').length > 0;
                const hasNewEnquiries = tab === 'Enquiries' && enquiries.filter(e => e.status === 'New').length > 0;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setShowModuleMenu(false);
                    }}
                    className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border ${
                      activeTab === tab 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-800'
                    }`}
                  >
                    <span>{tab}</span>
                    <div className="flex items-center gap-1">
                      {hasNewEnquiries && (
                        <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{enquiries.filter(e => e.status === 'New').length}</span>
                      )}
                      {hasPendingAdmissions && (
                        <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse">{admissions.filter(a => a.status === 'Pending').length}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div ref={contentRef} className="space-y-8 min-h-[400px]">

      {/* Schools Tenant View */}
      {activeTab === 'Schools' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg font-montserrat">Registered School Tenants</h3>
            <button 
              onClick={() => setShowAddSchool(!showAddSchool)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow"
            >
              <Plus size={14} /> Add School Tenant
            </button>
          </div>

          {showAddSchool && (
            <div className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Add New School Node</h4>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="School Name" value={newSchool.name}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="text" placeholder="School Code" value={newSchool.code}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, code: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <input 
                type="text" placeholder="Full Address" value={newSchool.address}
                onChange={(e) => setNewSchool(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
              />
              <button 
                onClick={() => {
                  alert("Tenant Creation requires live database sync in MERN cluster.");
                  setShowAddSchool(false);
                }}
                className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Deploy School Instance
              </button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((sch) => (
              <div key={sch.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2.5 py-0.5 rounded-full">{sch.code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      sch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>{sch.status}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">{sch.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{sch.address}</p>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-850 pt-3 mt-4 text-[11px]">
                    <div>
                      <span className="text-slate-400">Students base:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{sch.studentsCount}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Teachers base:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{sch.teachersCount}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850 pt-3 mt-4 flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Tenant Management:</span>
                  <button 
                    onClick={() => toggleSchoolStatus(sch.id)}
                    className="text-xs font-bold flex items-center gap-1 text-blue-600 dark:text-blue-400"
                  >
                    {sch.status === 'Active' ? (
                      <span className="flex items-center gap-1 text-red-550"><ToggleRight size={22} /> Suspend</span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-500"><ToggleLeft size={22} /> Activate</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───── ADMISSIONS TAB ───── */}
      {activeTab === 'Admissions' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg font-montserrat">Admission Applications Panel</h3>

          {/* WhatsApp Toast */}
          {whatsappToast && (
            <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <span className="text-lg">📱</span> WhatsApp notification sent to {whatsappToast}!
            </div>
          )}

          {/* Dynamic Form Star Highlights Config */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 text-left">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">★ Public Form Highlights Configuration</h4>
            <p className="text-[10px] text-slate-400">Select which input fields on the public Online Application Form show a gold star highlight mark.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
              {Object.keys(starredFormFields || {}).map((field) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                  <input
                    type="checkbox"
                    checked={starredFormFields[field]}
                    onChange={(e) => {
                      updateStarredFormFields({
                        ...starredFormFields,
                        [field]: e.target.checked
                      });
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Table of Applications */}
            <div className="lg:col-span-8 space-y-4 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 dark:bg-slate-900/40 p-3 sm:p-2 rounded-xl gap-2">
                <span className="font-bold text-xs uppercase text-slate-500 tracking-wider">Application Records</span>
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {['Pending', 'Approved', 'Rejected'].map(s => (
                    <button
                      key={s}
                      onClick={() => setAdmissionFilter(s)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex-1 sm:flex-initial text-center ${
                        admissionFilter === s 
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-white dark:bg-slate-800 text-slate-500 border hover:bg-slate-100'
                      }`}
                    >
                      {s} ({admissions.filter(a => a.status === s).length})
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Grade</th>
                        <th className="p-4">Parent Details</th>
                        <th className="p-4">Contact</th>
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
                            <p className="text-[10px] text-slate-400 font-mono">DOB: {adm.dob}</p>
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
                              className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/15 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold border border-blue-200/50 dark:border-blue-800/80 cursor-pointer"
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
            </div>

            {/* Right Column: Detailed Application Star/Edit */}
            <div className="lg:col-span-4">
              {selectedAdmission && editingAdmission ? (
                <div className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 text-left animate-fade-in">
                  <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-slate-800 pb-2.5">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Review Applicant</h4>
                      <span className="text-[9px] text-slate-400 font-mono">ID: {selectedAdmission.id}</span>
                    </div>
                    <button 
                      onClick={() => { setSelectedAdmission(null); setEditingAdmission(null); }}
                      className="text-slate-400 hover:text-slate-650 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg transition"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    updateAdmissionFields(editingAdmission.id, editingAdmission);
                    setSelectedAdmission({ ...editingAdmission });
                    alert('Applicant data and highlights updated successfully.');
                  }} className="space-y-3.5 text-xs">
                    {/* Field studentName */}
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
                          className={`p-1 rounded text-[9px] ${
                            editingAdmission.starredFields?.studentName 
                              ? 'text-amber-500 bg-amber-500/10' 
                              : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-900/50'
                          }`}
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

                    {/* Field dob */}
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
                          className={`p-1 rounded text-[9px] ${
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

                    {/* Field grade */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-slate-500 uppercase text-[9px] flex items-center gap-1">
                          Grade
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
                          className={`p-1 rounded text-[9px] ${
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

                    {/* Field parentName */}
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
                          className={`p-1 rounded text-[9px] ${
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

                    {/* Field parentPhone */}
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
                          className={`p-1 rounded text-[9px] ${
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
                          className={`p-1 rounded text-[9px] ${
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

                    {/* Field parentEmail */}
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
                          className={`p-1 rounded text-[9px] ${
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

                    {/* Field address */}
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
                          className={`p-1 rounded text-[9px] ${
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

                    <div className="pt-2 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-center shadow-md cursor-pointer transition"
                      >
                        Save Changes
                      </button>
                      {(selectedAdmission.status === 'Pending' || selectedAdmission.status === 'Rejected') && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              // Save current form edits first, then approve using edited values
                              updateAdmissionFields(editingAdmission.id, editingAdmission);
                              approveAdmission(editingAdmission.id, editingAdmission);
                              setSelectedAdmission(null);
                              setEditingAdmission(null);
                              setWhatsappToast(editingAdmission.parentName);
                              setTimeout(() => setWhatsappToast(null), 3000);

                              const parentPhone = editingAdmission.whatsappNumber || editingAdmission.parentPhone || editingAdmission.phone || '';
                              const cleanedPhone = cleanPhoneForWhatsapp(parentPhone);
                              const messageText = `Dear ${editingAdmission.parentName}, your admission application for ${editingAdmission.studentName} to ${editingAdmission.grade || editingAdmission.gradeApplied} at Sri Vani Vidyanikethan has been APPROVED! Please visit the school with required documents to complete the enrollment. Welcome to our school family!`;
                              const waUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(messageText)}`;
                              window.open(waUrl, '_blank');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-2 rounded-xl text-center shadow-md cursor-pointer transition text-[10px]"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              rejectAdmission(selectedAdmission.id);
                              setSelectedAdmission(null);
                              setEditingAdmission(null);
                            }}
                            className="bg-red-500 hover:bg-red-655 text-white font-bold px-2 py-2 rounded-xl text-center shadow-md cursor-pointer transition text-[10px]"
                          >
                            Reject
                          </button>
                        </>
                      )}
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

          {/* WhatsApp Notification Logs */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">📱 WhatsApp Notification Logs</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(whatsappLogs || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No WhatsApp notifications sent yet.</p>
              ) : (
                (whatsappLogs || []).map((log, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border text-xs">
                    <span className="text-emerald-500 text-lg">📱</span>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white">{log.studentName || log.recipientName || log.to}</p>
                      <p className="text-[10px] text-slate-400">{log.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{log.sentAt || log.timestamp || log.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Required Documents Manager */}
          <div className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">📄 Required Documents for Admission</h4>
            <div className="flex gap-2">
              <input
                type="text" placeholder="Add new document name..."
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  if (!newDocName.trim()) return;
                  updateRequiredDocuments([...(requiredDocuments || []), newDocName.trim()]);
                  setNewDocName('');
                }}
                className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              ><Plus size={14} /></button>
            </div>
            <div className="space-y-2">
              {(requiredDocuments || []).map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white">{doc}</span>
                  <button
                    onClick={() => updateRequiredDocuments((requiredDocuments || []).filter((_, i) => i !== idx))}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  ><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Accounts Tab */}
      {activeTab === 'Admins' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg font-montserrat">School Administrator Accounts</h3>
            <button 
              onClick={() => { setShowAdminForm(!showAdminForm); setAdminEditId(null); setAdminForm({ name: '', email: '', password: '' }); }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              {showAdminForm ? <X size={14} /> : <Plus size={14} />} {showAdminForm ? 'Close panel' : 'Create Admin Account'}
            </button>
          </div>

          {showAdminForm && (
            <form onSubmit={handleAdminSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Lock size={12} /> {adminEditId ? 'Edit Admin Credentials' : 'New Admin Registry'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" required placeholder="Administrator Name" value={adminForm.name}
                  onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="email" required placeholder="Login Email" value={adminForm.email}
                  onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="relative flex items-center w-full">
                <input 
                  type={showAdminPassword ? "text" : "password"} 
                  required 
                  placeholder="Portal Access Password" 
                  value={adminForm.password}
                  onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-3 pr-10 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  {showAdminPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2 rounded-xl">
                {adminEditId ? 'Update Credentials' : 'Confirm Registration'}
              </button>
            </form>
          )}

          <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Admin name</th>
                    <th className="p-4">Login Email</th>
                    <th className="p-4">Password</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                  {admins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User size={14} className="text-blue-500" /> {adm.name}
                      </td>
                      <td className="p-4 font-mono">{adm.email}</td>
                      <td className="p-4 font-mono text-slate-450">
                        <div className="flex items-center gap-1.5">
                          <span>{revealedPasswords[adm.id] ? adm.password : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPassword(adm.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                            title={revealedPasswords[adm.id] ? "Hide password" : "Show password"}
                          >
                            {revealedPasswords[adm.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => editAdmin(adm.id, { status: adm.status === 'Active' ? 'Disabled' : 'Active' })}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            adm.status === 'Active' ? 'bg-emerald-500/10 text-emerald-555' : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {adm.status}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setAdminEditId(adm.id);
                            setAdminForm({ name: adm.name, email: adm.email, password: adm.password });
                            setShowAdminForm(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition"
                        >
                          <Edit size={14} />
                        </button>
                        {adm.id !== 'ADM01' && (
                          <button 
                            onClick={() => deleteAdmin(adm.id)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Directory Tab */}
      {activeTab === 'Teachers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-lg font-montserrat">Faculty & Teacher Registrations</h3>
            <button 
              onClick={() => { setShowTeacherForm(!showTeacherForm); setTeacherEditId(null); setTeacherForm({ id: '', name: '', subject: 'PHYSICS', qualification: '', phone: '', email: '', password: '', department: 'Science', experience: '5 Years', designation: 'Senior Teacher', salary: 5000, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }); }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              {showTeacherForm ? <X size={14} /> : <Plus size={14} />} {showTeacherForm ? 'Close panel' : 'Register New Faculty'}
            </button>
          </div>

          {showTeacherForm && (
            <form onSubmit={handleTeacherSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-2xl">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <UserCheck size={12} /> {teacherEditId ? 'Edit Faculty Account' : 'New Teacher Account Registry'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" required placeholder="Teacher Name" value={teacherForm.name}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="text" required placeholder="Employee ID (e.g. T105)" value={teacherForm.id}
                  disabled={teacherEditId !== null}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, id: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <select 
                  value={teacherForm.subject}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                >
                  {(subjects || []).map(sub => (
                    <option key={sub.id} value={sub.code}>{sub.name} ({sub.department})</option>
                  ))}
                </select>
                <input 
                  type="text" required placeholder="Qualifications (M.Sc, B.Ed)" value={teacherForm.qualification}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, qualification: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="tel" required placeholder="Mobile Contact" value={teacherForm.phone}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input 
                  type="text" required placeholder="Designation (e.g. Senior Teacher)" value={teacherForm.designation}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, designation: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="text" required placeholder="Experience (e.g. 5 Years)" value={teacherForm.experience}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, experience: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="number" required placeholder="Salary (Monthly)" value={teacherForm.salary}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="email" required placeholder="Email Address" value={teacherForm.email}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <div className="relative flex items-center w-full">
                  <input 
                    type={showTeacherPassword ? "text" : "password"} 
                    required 
                    placeholder="Assign Password" 
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-3 pr-10 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-650 cursor-pointer"
                  >
                    {showTeacherPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Teacher Profile Photo</label>
                <div className="grid sm:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center overflow-hidden shrink-0">
                      {teacherForm.photo ? (
                        <img src={teacherForm.photo} alt="Teacher Preview" className="w-full h-full object-cover" />
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
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setTeacherForm(prev => ({ ...prev, photo: ev.target.result }));
                          };
                          reader.readAsDataURL(file);
                        }} 
                      />
                    </label>
                  </div>
                  <input 
                    type="text" 
                    placeholder="— or paste photo link URL —" 
                    value={teacherForm.photo} 
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, photo: e.target.value }))} 
                    className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
              </div>
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                {teacherEditId ? 'Update Faculty Details' : 'Register Faculty Login'}
              </button>
            </form>
          )}

          <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Teacher Name</th>
                    <th className="p-4">Employee ID</th>
                    <th className="p-4">Subject / Dept</th>
                    <th className="p-4">Designation</th>
                    <th className="p-4">Exp</th>
                    <th className="p-4">Salary</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Assigned Password</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                  {teachers.map((teach) => (
                    <tr key={teach.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <img src={teach.photo} alt="" className="w-7 h-7 rounded-full object-cover border" />
                        <div>
                          <p className="font-bold">{teach.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono">{teach.email}</p>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{teach.id}</td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{teach.subject}</span>
                        <p className="text-[9px] text-slate-400">{teach.department}</p>
                      </td>
                      <td className="p-4 font-medium">{teach.designation || 'Teacher'}</td>
                      <td className="p-4 text-slate-500">{teach.experience || '5 Years'}</td>
                      <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">${teach.salary || 5000}</td>
                      <td className="p-4">{teach.phone}</td>
                      <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                        <div className="flex items-center gap-1.5">
                          <span>{revealedPasswords[teach.id] ? (teach.password || 'teacher123') : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPassword(teach.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                            title={revealedPasswords[teach.id] ? "Hide password" : "Show password"}
                          >
                            {revealedPasswords[teach.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setTeacherEditId(teach.id);
                            setTeacherForm({ ...teach });
                            setShowTeacherForm(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => deleteTeacher(teach.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition"
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

      {/* Student Enrollment Tab */}
      {activeTab === 'Students' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-lg font-montserrat">Student Enrollment Network</h3>
              <p className="text-[10px] text-slate-400">Strictly no student self-registrations allowed. Create manually or copy-paste rows from spreadsheets.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowBulkImport(!showBulkImport)}
                className="bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <FileSpreadsheet size={14} /> {showBulkImport ? 'Hide excel tool' : 'Paste spreadsheet data'}
              </button>
              <button 
                onClick={() => { setShowStudentForm(!showStudentForm); setStudentEditId(null); setDuplicateError(''); }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                {showStudentForm ? <X size={14} /> : <Plus size={14} />} {showStudentForm ? 'Close form' : 'Enroll Student'}
              </button>
            </div>
          </div>

          {duplicateError && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-650 dark:text-red-400 font-semibold text-xs flex gap-2 items-center">
              <AlertCircle size={16} /> {duplicateError}
            </div>
          )}

          {/* Bulk Paste Importer */}
          {showBulkImport && (
            <div className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileSpreadsheet size={14} className="text-emerald-500" /> Excel / CSV Bulk Parser
              </h4>
              <p className="text-[10px] text-slate-500 leading-normal font-light">
                Paste raw rows. Fields order MUST match exactly: <br />
                <strong>Student Name, RegisterNumber, MobileNumber, StreetAddress, Class, Section, Email, Password</strong> <br />
                Example: <br />
                <span className="font-mono bg-slate-150 dark:bg-slate-900 px-2 py-0.5 rounded text-[9px] text-blue-600 dark:text-blue-400">
                  Ganesh Kumar, REG20261005, 9876543299, Pedda Kottala AP, Class 10, A, ganesh.k@srivani.edu, pass123
                </span>
              </p>
              <textarea 
                value={bulkCsvText}
                onChange={(e) => setBulkCsvText(e.target.value)}
                placeholder="Paste lines here..."
                rows={5}
                className="w-full p-3 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-[10px] font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button 
                onClick={handleBulkImport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Import Bulk Accounts
              </button>
              {bulkImportResult && (
                <pre className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl text-[10px] font-mono text-left max-h-40 overflow-y-auto border whitespace-pre-wrap">
                  {bulkImportResult}
                </pre>
              )}
            </div>
          )}

          {/* Manual registration form */}
          {showStudentForm && (
            <form onSubmit={handleStudentSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-2xl">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-blue-500" /> {studentEditId ? 'Edit Student Profile' : 'New Student Enrollment Entry'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" required placeholder="Student Full Name" value={studentForm.name}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="text" required placeholder="Unique Register Number (e.g. REG20261005)" value={studentForm.registerNo}
                  disabled={studentEditId !== null}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, registerNo: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input 
                  type="tel" required placeholder="Mobile Number" value={studentForm.phone}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <select 
                  value={studentForm.class}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, class: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                >
                  {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select 
                  value={studentForm.section}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, section: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="email" required placeholder="Student Email Address" value={studentForm.email}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <div className="relative flex items-center w-full">
                  <input 
                    type={showStudentPassword ? "text" : "password"} 
                    required 
                    placeholder="Assign Student Password" 
                    value={studentForm.password}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-3 pr-10 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-650 cursor-pointer"
                  >
                    {showStudentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <input 
                type="text" required placeholder="Address details" value={studentForm.address}
                onChange={(e) => setStudentForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
              />
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Student Profile Photo</label>
                <div className="grid sm:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center overflow-hidden shrink-0">
                      {studentForm.photo ? (
                        <img src={studentForm.photo} alt="Student Preview" className="w-full h-full object-cover" />
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
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setStudentForm(prev => ({ ...prev, photo: ev.target.result }));
                          };
                          reader.readAsDataURL(file);
                        }} 
                      />
                    </label>
                  </div>
                  <input 
                    type="text" 
                    placeholder="— or paste photo link URL —" 
                    value={studentForm.photo} 
                    onChange={(e) => setStudentForm(prev => ({ ...prev, photo: e.target.value }))} 
                    className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>

              </div>
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                {studentEditId ? 'Update Student Profile' : 'Enroll Student'}
              </button>
            </form>
          )}

          {/* Directory Search & Class Filter */}
          <div className="flex flex-wrap gap-3 items-center">
            <input 
              type="text" placeholder="Search student register or name..." value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="px-4 py-2 max-w-xs border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <select
              value={studentClassFilter}
              onChange={(e) => setStudentClassFilter(e.target.value)}
              className="px-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Classes</option>
              {classesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Student list */}
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Name</th>
                    <th className="p-4">Register Number</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Class/Sec</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Assigned Password</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                  {students.filter(s => {
                    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.registerNo.toLowerCase().includes(studentSearch.toLowerCase());
                    const matchesClass = studentClassFilter === 'All' ? true : s.class === studentClassFilter;
                    return matchesSearch && matchesClass;
                  }).map((stud) => (
                    <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <img src={stud.photo} alt="" className="w-7 h-7 rounded-full object-cover border" />
                        {stud.name}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{stud.registerNo}</td>
                      <td className="p-4">{stud.phone}</td>
                      <td className="p-4 text-slate-500 max-w-[120px] truncate">{stud.address}</td>
                      <td className="p-4 font-bold text-slate-650 dark:text-slate-355">{stud.class} - {stud.section}</td>
                      <td className="p-4 font-mono">{stud.email}</td>
                      <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                        <div className="flex items-center gap-1.5">
                          <span>{revealedPasswords[stud.id] ? (stud.password || 'student123') : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPassword(stud.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                            title={revealedPasswords[stud.id] ? "Hide password" : "Show password"}
                          >
                            {revealedPasswords[stud.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setStudentEditId(stud.id);
                            setStudentForm({ ...stud });
                            setShowStudentForm(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => deleteStudent(stud.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition"
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

      {/* Parents Directory Tab */}
      {activeTab === 'Parents' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-lg font-montserrat">Parents registry database</h3>
              <p className="text-[10px] text-slate-400">Add parent logins, assign credentials, and map relationship links to registered students.</p>
            </div>
            <button 
              onClick={() => { setShowParentForm(!showParentForm); setParentEditId(null); setParentForm({ name: '', phone: '', email: '', password: '', childrenIds: [] }); }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              {showParentForm ? <X size={14} /> : <Plus size={14} />} {showParentForm ? 'Close form' : 'Register Parent Account'}
            </button>
          </div>

          {showParentForm && (
            <form onSubmit={handleParentSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-2xl">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-blue-500" /> {parentEditId ? 'Edit Parent Profile' : 'New Parent Login Registration'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" required placeholder="Parent Name" value={parentForm.name}
                  onChange={(e) => setParentForm(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="tel" placeholder="Mobile phone" value={parentForm.phone}
                  onChange={(e) => setParentForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="email" required placeholder="Email Address" value={parentForm.email}
                  onChange={(e) => setParentForm(prev => ({ ...prev, email: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <div className="relative flex items-center w-full">
                  <input 
                    type={showParentPassword ? "text" : "password"} 
                    required 
                    placeholder="Set Password" 
                    value={parentForm.password}
                    onChange={(e) => setParentForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-3 pr-10 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowParentPassword(!showParentPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-650 cursor-pointer"
                  >
                    {showParentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Linked Children Selection Grid */}
              <div className="space-y-2 border-t border-slate-200/50 dark:border-slate-800 pt-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Link relationship with Students (Select one or more):</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border">
                  {students.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => handleToggleLinkChild(s.id)}
                      className={`p-2 rounded-lg text-[10px] font-bold border cursor-pointer select-none transition-all ${
                        parentForm.childrenIds.includes(s.id)
                          ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {s.name} ({s.registerNo})
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                {parentEditId ? 'Update Parent Profile' : 'Confirm Registration'}
              </button>
            </form>
          )}

          <div className="flex flex-wrap gap-3 items-center">
            <input 
              type="text" placeholder="Search Parent accounts by name..." value={parentSearch}
              onChange={(e) => setParentSearch(e.target.value)}
              className="px-4 py-2 max-w-xs border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <select
              value={parentClassFilter}
              onChange={(e) => setParentClassFilter(e.target.value)}
              className="px-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold"
            >
              <option value="All">All Classes</option>
              {classesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Parent Name</th>
                    <th className="p-4">Mobile</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Assigned Password</th>
                    <th className="p-4">Linked Pupils</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                  {parents.filter(p => {
                    const matchesSearch = p.name.toLowerCase().includes(parentSearch.toLowerCase());
                    const matchesClass = parentClassFilter === 'All' ? true : (p.childrenIds || []).some(cId => {
                      const kid = students.find(s => s.id === cId);
                      return kid && kid.class === parentClassFilter;
                    });
                    return matchesSearch && matchesClass;
                  }).map((par) => (
                    <tr key={par.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User size={14} className="text-purple-500" /> {par.name}
                      </td>
                      <td className="p-4">{par.phone}</td>
                      <td className="p-4 font-mono">{par.email}</td>
                      <td className="p-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                        <div className="flex items-center gap-1.5">
                          <span>{revealedPasswords[par.id] ? (par.password || 'parent123') : '••••••••'}</span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPassword(par.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                            title={revealedPasswords[par.id] ? "Hide password" : "Show password"}
                          >
                            {revealedPasswords[par.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {par.childrenIds.map(cId => {
                            const kidObj = students.find(s => s.id === cId);
                            return (
                              <span key={cId} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[9px]">
                                {kidObj ? `${kidObj.name} (${kidObj.registerNo})` : cId}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setParentEditId(par.id);
                            setParentForm({ ...par });
                            setShowParentForm(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => deleteParent(par.id)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition"
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

      {/* Timetables Tab */}
      {activeTab === 'Timetables' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg font-montserrat">School Timetable Scheduler</h3>
          
          <div className="grid md:grid-cols-12 gap-8">
            {/* Edit Timetable Form */}
            <div className="md:col-span-5">
              <form onSubmit={handleTimetableSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 text-left">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Set Class Period Slots</h4>
                
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Select Grade / Class</label>
                  <select 
                    value={timetableClass} 
                    onChange={(e) => setTimetableClass(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs"
                  >
                    {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Select Day of Week</label>
                  <select 
                    value={timetableDay} 
                    onChange={(e) => setTimetableDay(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Number of Active Periods</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => setPeriodsCount(prev => Math.max(1, prev - 1))}
                      className="px-3 py-2 bg-red-500 hover:bg-red-605 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 shadow-sm sm:shrink-0 w-full sm:w-auto cursor-pointer"
                      title="Decrease periods count"
                    >
                      ➖ Remove Period
                    </button>
                    <div className="text-center py-2 px-3 border rounded-xl bg-slate-100 dark:bg-slate-900/50 text-xs font-extrabold text-slate-900 dark:text-white flex-1 min-w-0">
                      {periodsCount} Periods Configured
                    </div>
                    <button
                      type="button"
                      onClick={() => setPeriodsCount(prev => Math.min(8, prev + 1))}
                      className="px-3 py-2 bg-emerald-500 hover:bg-emerald-655 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 shadow-sm sm:shrink-0 w-full sm:w-auto cursor-pointer"
                      title="Increase periods count"
                    >
                      ➕ Add Period
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 italic">
                    Configuring periods between 1 and 8 columns dynamically updates student timetable grids.
                  </p>
                </div>
                
                <div className="space-y-4 pt-2">
                  <h5 className="text-[10px] font-bold uppercase text-slate-400">Class Hours Slots Configuration</h5>
                  
                  {/* Period 1 */}
                  {periodsCount >= 1 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-850 pb-1 mb-1">
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">Period 1</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Subject</label>
                          <select 
                            value={period1Sub} 
                            onChange={(e) => setPeriod1Sub(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            <option value="FREE PERIOD">FREE PERIOD</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Preset Time</label>
                          <select 
                            value={presetTimings.includes(period1Time) ? period1Time : 'Custom'} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Custom') {
                                setPeriod1Time('');
                              } else {
                                setPeriod1Time(val);
                              }
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {presetTimings.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="Custom">Custom Time...</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Period 1 Time Range</label>
                        <input 
                          type="text" required
                          placeholder="e.g. 09:30 AM - 10:15 AM"
                          value={period1Time} 
                          onChange={(e) => setPeriod1Time(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Period 2 */}
                  {periodsCount >= 2 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-850 pb-1 mb-1">
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">Period 2</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Subject</label>
                          <select 
                            value={period2Sub} 
                            onChange={(e) => setPeriod2Sub(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            <option value="FREE PERIOD">FREE PERIOD</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Preset Time</label>
                          <select 
                            value={presetTimings.includes(period2Time) ? period2Time : 'Custom'} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Custom') {
                                setPeriod2Time('');
                              } else {
                                setPeriod2Time(val);
                              }
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {presetTimings.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="Custom">Custom Time...</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Period 2 Time Range</label>
                        <input 
                          type="text" required
                          placeholder="e.g. 10:30 AM - 11:15 AM"
                          value={period2Time} 
                          onChange={(e) => setPeriod2Time(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Period 3 */}
                  {periodsCount >= 3 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-850 pb-1 mb-1">
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">Period 3</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Subject</label>
                          <select 
                            value={period3Sub} 
                            onChange={(e) => setPeriod3Sub(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            <option value="FREE PERIOD">FREE PERIOD</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Preset Time</label>
                          <select 
                            value={presetTimings.includes(period3Time) ? period3Time : 'Custom'} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Custom') {
                                setPeriod3Time('');
                              } else {
                                setPeriod3Time(val);
                              }
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {presetTimings.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="Custom">Custom Time...</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Period 3 Time Range</label>
                        <input 
                          type="text" required
                          placeholder="e.g. 11:30 AM - 12:15 PM"
                          value={period3Time} 
                          onChange={(e) => setPeriod3Time(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Period 4 */}
                  {periodsCount >= 4 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-850 pb-1 mb-1">
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">Period 4</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Subject</label>
                          <select 
                            value={period4Sub} 
                            onChange={(e) => setPeriod4Sub(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            <option value="FREE PERIOD">FREE PERIOD</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Preset Time</label>
                          <select 
                            value={presetTimings.includes(period4Time) ? period4Time : 'Custom'} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Custom') {
                                setPeriod4Time('');
                              } else {
                                setPeriod4Time(val);
                              }
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {presetTimings.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="Custom">Custom Time...</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Period 4 Time Range</label>
                        <input 
                          type="text" required
                          placeholder="e.g. 01:00 PM - 01:45 PM"
                          value={period4Time} 
                          onChange={(e) => setPeriod4Time(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Period 5 */}
                  {periodsCount >= 5 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-850 pb-1 mb-1">
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">Period 5</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Subject</label>
                          <select 
                            value={period5Sub} 
                            onChange={(e) => setPeriod5Sub(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            <option value="FREE PERIOD">FREE PERIOD</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Preset Time</label>
                          <select 
                            value={presetTimings.includes(period5Time) ? period5Time : 'Custom'} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Custom') {
                                setPeriod5Time('');
                              } else {
                                setPeriod5Time(val);
                              }
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {presetTimings.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="Custom">Custom Time...</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Period 5 Time Range</label>
                        <input 
                          type="text" required
                          placeholder="e.g. 02:00 PM - 02:45 PM"
                          value={period5Time} 
                          onChange={(e) => setPeriod5Time(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Period 6 */}
                  {periodsCount >= 6 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-850 pb-1 mb-1">
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">Period 6</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Subject</label>
                          <select 
                            value={period6Sub} 
                            onChange={(e) => setPeriod6Sub(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            <option value="FREE PERIOD">FREE PERIOD</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Preset Time</label>
                          <select 
                            value={presetTimings.includes(period6Time) ? period6Time : 'Custom'} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Custom') {
                                setPeriod6Time('');
                              } else {
                                setPeriod6Time(val);
                              }
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {presetTimings.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="Custom">Custom Time...</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Period 6 Time Range</label>
                        <input 
                          type="text" required
                          placeholder="e.g. 03:00 PM - 03:45 PM"
                          value={period6Time} 
                          onChange={(e) => setPeriod6Time(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Period 7 */}
                  {periodsCount >= 7 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-850 pb-1 mb-1">
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">Period 7</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Subject</label>
                          <select 
                            value={period7Sub} 
                            onChange={(e) => setPeriod7Sub(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            <option value="FREE PERIOD">FREE PERIOD</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Preset Time</label>
                          <select 
                            value={presetTimings.includes(period7Time) ? period7Time : 'Custom'} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Custom') {
                                setPeriod7Time('');
                              } else {
                                setPeriod7Time(val);
                              }
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {presetTimings.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="Custom">Custom Time...</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Period 7 Time Range</label>
                        <input 
                          type="text" required
                          placeholder="e.g. 03:45 PM - 04:30 PM"
                          value={period7Time} 
                          onChange={(e) => setPeriod7Time(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Period 8 */}
                  {periodsCount >= 8 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-850 pb-1 mb-1">
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase">Period 8</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Subject</label>
                          <select 
                            value={period8Sub} 
                            onChange={(e) => setPeriod8Sub(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {subjectsList.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            <option value="FREE PERIOD">FREE PERIOD</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold block mb-1">Preset Time</label>
                          <select 
                            value={presetTimings.includes(period8Time) ? period8Time : 'Custom'} 
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Custom') {
                                setPeriod8Time('');
                              } else {
                                setPeriod8Time(val);
                              }
                            }}
                            className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-white"
                          >
                            {presetTimings.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="Custom">Custom Time...</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Period 8 Time Range</label>
                        <input 
                          type="text" required
                          placeholder="e.g. 04:30 PM - 05:15 PM"
                          value={period8Time} 
                          onChange={(e) => setPeriod8Time(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow">
                  Save Schedule Slots
                </button>
              </form>
            </div>

            {/* Schedule Matrix Grid */}
            <div className="md:col-span-7 min-w-0">
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden text-left">
                <div className="p-4 border-b border-slate-200 dark:border-slate-850 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">Interactive Class Timetable Grid</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Real-time dynamic matrix preview for the selected grade level</p>
                  </div>
                  <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">{timetableClass} Preview</span>
                </div>
                
                <div className="p-4 overflow-x-auto">
                  {(() => {
                    const maxPeriods = timetables 
                      ? Math.max(4, ...timetables.filter(t => t.class === timetableClass).map(t => t.slots ? t.slots.length : 0)) 
                      : 4;
                    return (
                      <table className="w-full min-w-[600px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[8px]">
                            <th className="py-2 px-1 text-left w-20">Day</th>
                            {Array.from({ length: maxPeriods }).map((_, pIdx) => (
                              <th key={pIdx} className="py-2 px-1 text-center">Period {pIdx + 1}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                            .filter(d => {
                              if (d === 'Saturday' || d === 'Sunday') {
                                return timetables && timetables.some(t => t.class === timetableClass && t.day === d && t.slots && t.slots.some(slot => {
                                  const parsed = parseSlot(slot);
                                  return parsed.subject && parsed.subject !== 'FREE PERIOD' && parsed.subject !== '';
                                }));
                              }
                              return true;
                            })
                            .map(d => {
                            const matched = timetables ? timetables.find(t => t.class === timetableClass && t.day === d) : null;
                            
                            return (
                              <tr key={d} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                <td className="py-3 px-1 font-bold text-slate-900 dark:text-white align-middle w-20">
                                  <span className="inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-[9px] border border-slate-200/50 dark:border-slate-800 w-full text-center">
                                    {d}
                                  </span>
                                </td>
                                {Array.from({ length: maxPeriods }).map((_, periodIdx) => {
                                  const slotRaw = matched && matched.slots && matched.slots[periodIdx] ? matched.slots[periodIdx] : null;
                                  const parsed = parseSlot(slotRaw);
                                  const style = getSubjectStyle(parsed.subject);
                                  const teacherName = getTeacherForSubject(parsed.subject, teachers);
                                  
                                  return (
                                    <td key={periodIdx} className="py-2 px-1 text-center align-middle">
                                      <div className={`p-1.5 rounded-xl border ${style.bg} ${style.accent} flex flex-col items-center justify-center space-y-1 transition duration-200 hover:scale-[1.02] hover:shadow-sm`}>
                                        <span className={`text-[9px] font-extrabold tracking-tight px-1.5 py-0.5 rounded-full ${style.tag}`}>
                                          {parsed.subject}
                                        </span>
                                        <span className="text-[8px] font-mono text-slate-500 font-medium">
                                          {parsed.time}
                                        </span>
                                        {parsed.subject !== 'FREE PERIOD' && (
                                          <span className="text-[8px] text-slate-500 dark:text-slate-400 font-semibold italic bg-white/40 dark:bg-black/10 px-1 rounded leading-tight">
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
          </div>
        </div>
      )}

      {/* Fee Manager Tab */}
      {activeTab === 'Fee Manager' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg font-montserrat">Yearly Tuition Fee Configurator</h3>
          
          <div className="grid md:grid-cols-12 gap-8">
            {/* Edit Fee Form */}
            <div className="md:col-span-5">
              <form onSubmit={handleFeeSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 text-left">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Class Fee Parameters</h4>
                
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Target Class</label>
                  <select 
                    value={feeClass} 
                    onChange={(e) => setFeeClass(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs"
                  >
                    {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Academic Year</label>
                  <input 
                    type="text" required placeholder="e.g. 2026"
                    value={feeYear} 
                    onChange={(e) => setFeeYear(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Annual Tuition Fee (₹)</label>
                    <input 
                      type="number" required min={0} 
                      value={tuitionFee} 
                      onChange={(e) => setTuitionFee(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Laboratory Fee (₹)</label>
                    <input 
                      type="number" required min={0} 
                      value={labFee} 
                      onChange={(e) => setLabFee(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Bus Fee (₹)</label>
                    <input 
                      type="number" required min={0} 
                      value={busFee} 
                      onChange={(e) => setBusFee(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Books Fee (₹)</label>
                    <input 
                      type="number" required min={0} 
                      value={booksFee} 
                      onChange={(e) => setBooksFee(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow">
                  Save Fee Parameters
                </button>
              </form>
            </div>

            {/* Fee List */}
            <div className="md:col-span-7 min-w-0">
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-850 overflow-hidden text-left">
                <div className="p-4 border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Tuition schedule database</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-450 font-bold uppercase tracking-wider text-[9px]">
                        <th className="p-4">Class / Grade</th>
                        <th className="p-4">Academic Year</th>
                        <th className="p-4">Tuition Fee</th>
                        <th className="p-4">Lab Fee</th>
                        <th className="p-4">Bus Fee</th>
                        <th className="p-4">Books Fee</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                      {fees && fees.map((f, idx) => {
                        const busFVal = f.busFee !== undefined ? f.busFee : 250;
                        const booksFVal = f.booksFee !== undefined ? f.booksFee : 180;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="p-4 font-bold text-slate-900 dark:text-white">{f.class}</td>
                            <td className="p-4 font-mono">{f.year}</td>
                            <td className="p-4 font-bold font-mono text-emerald-600 dark:text-emerald-400">₹{f.tuitionFee}</td>
                            <td className="p-4 font-bold font-mono text-blue-600 dark:text-blue-400">₹{f.labFee}</td>
                            <td className="p-4 font-bold font-mono text-indigo-600 dark:text-indigo-400">₹{busFVal}</td>
                            <td className="p-4 font-bold font-mono text-amber-600 dark:text-amber-400">₹{booksFVal}</td>
                            <td className="p-4 font-extrabold font-mono text-slate-900 dark:text-white">
                              ₹{f.tuitionFee + f.labFee + busFVal + booksFVal}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to remove the fee structure for ${f.class} (${f.year})?`)) {
                                    deleteClassFee(f.class, f.year);
                                  }
                                }}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                title="Remove Fee Structure"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Ticker management tab */}
      {activeTab === 'News Ticker' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-lg font-montserrat">Homepage News Ticker Board</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                Configure live announcements and bulletins scrolling dynamically on the homepage ticker marquee feed.
              </p>
            </div>
            <button
              onClick={() => {
                setShowTickerForm(!showTickerForm);
                setTickerEditId(null);
                setTickerForm({ title: '', desc: '', type: 'Academic' });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Plus size={16} /> {showTickerForm ? 'Hide Form' : 'Publish Ticker Bulletin'}
            </button>
          </div>

          {showTickerForm && (
            <form onSubmit={handleTickerSubmit} className="glassmorphism p-6 rounded-3xl border border-white/50 shadow-md space-y-4 max-w-xl text-left">
              <h4 className="font-extrabold text-sm text-indigo-950 dark:text-white">
                {tickerEditId ? 'Edit Ticker Bulletin' : 'Create Live Bulletin'}
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Bulletin Header Title</label>
                  <input
                    type="text" required placeholder="e.g. Standard Matrix Timetable Scheduler"
                    value={tickerForm.title}
                    onChange={(e) => setTickerForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Category / Tag</label>
                    <select
                      value={tickerForm.type}
                      onChange={(e) => setTickerForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      {['Academic', 'System', 'Campus', 'Circular', 'Facilities', 'Principal', 'Urgent'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Detailed Message Content</label>
                  <textarea
                    required rows={3} placeholder="Brief description of the update showing on the marquee feed..."
                    value={tickerForm.desc}
                    onChange={(e) => setTickerForm(prev => ({ ...prev, desc: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow">
                  {tickerEditId ? 'Update Bulletin' : 'Publish Bulletin'}
                </button>
                {tickerEditId && (
                  <button
                    type="button"
                    onClick={() => {
                      setTickerEditId(null);
                      setTickerForm({ title: '', desc: '', type: 'Academic' });
                      setShowTickerForm(false);
                    }}
                    className="bg-slate-200 dark:bg-slate-800 text-slate-750 dark:text-slate-350 font-bold text-xs px-5 py-2.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Bulletin Title</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Tag</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                  {tickerItems && tickerItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{item.title}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 max-w-sm truncate">{item.desc}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[9px] uppercase">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{item.time}</td>
                      <td className="p-4 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => {
                            setTickerEditId(item.id);
                            setTickerForm({ title: item.title, desc: item.desc, type: item.type });
                            setShowTickerForm(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition"
                          title="Edit Ticker Item"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteTickerItem(item.id)}
                          className="p-1.5 text-red-650 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition"
                          title="Delete Ticker Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!tickerItems || tickerItems.length === 0) && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                        No ticker bulletin items are configured. The home page scrolling feed will be empty.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Notices / Circulars Board Section */}
          <div className="space-y-4 border-t pt-6 text-left">
            <div>
              <h3 className="font-extrabold text-lg font-montserrat">Official Notice Board Circulars</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                Review and delete circulars posted to the school notice board (e.g. notices for staff, students, parents, etc.)
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {circulars && circulars.map((circ) => (
                <div key={circ.id} className="bg-white dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded uppercase">Target: {circ.targetGroup}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 font-mono">{circ.date}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete notice: "${circ.title}"?`)) {
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
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-2 leading-snug">{circ.title}</h4>
                    <p className="text-[11px] text-slate-550 dark:text-slate-350 leading-relaxed font-light mt-1">{circ.content}</p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-2 text-[9px] text-slate-400 flex justify-between items-center">
                    <span>By: <strong className="text-slate-500">{circ.postedBy}</strong></span>
                  </div>
                </div>
              ))}
              {(!circulars || circulars.length === 0) && (
                <div className="col-span-2 p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border text-slate-400 text-xs italic">
                  No active circulars on notice board.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* School Settings management tab */}
      {activeTab === 'School Settings' && (
        <div className="space-y-8 text-left">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <h3 className="font-extrabold text-lg font-montserrat">Global Public School Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                Configure general public parameters: School logo, name, tagline, Principal welcome message, history, vision, and mission statement.
              </p>
            </div>
          </div>

          {/* ── ADMISSION BANNER CONTROL ── */}
          <div className="glassmorphism p-6 rounded-2xl border border-white/50 shadow-md space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  🎯 Admission Open Banner
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Controls the colourful banner at the very top of the Home page.</p>
              </div>
              {/* Toggle ON/OFF */}
              <button
                onClick={() => updateAdmissionBanner({ active: !admissionBanner.active })}
                className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border-2 transition-colors ${
                  admissionBanner?.active ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-300 dark:bg-slate-700 border-slate-300 dark:border-slate-700'
                }`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  admissionBanner?.active ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Headline Text</label>
                <input
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ADMISSIONS OPEN FOR"
                  value={admissionBanner?.headline || ''}
                  onChange={e => updateAdmissionBanner({ headline: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Academic Year</label>
                <input
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2026–2027"
                  value={admissionBanner?.year || ''}
                  onChange={e => updateAdmissionBanner({ year: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Subtitle Message</label>
                <input
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Register Online Today."
                  value={admissionBanner?.subtitle || ''}
                  onChange={e => updateAdmissionBanner({ subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Button Label</label>
                <input
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Apply Now"
                  value={admissionBanner?.buttonLabel || ''}
                  onChange={e => updateAdmissionBanner({ buttonLabel: e.target.value })}
                />
              </div>
            </div>

            {/* Live preview */}
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <p className="text-[9px] font-bold text-slate-400 uppercase px-3 pt-2">Preview</p>
              {admissionBanner?.active ? (
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2">
                  <span>✨ {admissionBanner.headline} {admissionBanner.year}! {admissionBanner.subtitle}</span>
                  <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold">{admissionBanner.buttonLabel}</span>
                </div>
              ) : (
                <div className="bg-slate-100 dark:bg-slate-900 text-slate-400 text-center py-2 text-xs italic">
                  Banner is currently hidden on Home page.
                </div>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* School General Info Form */}
            <form onSubmit={handleSchoolInfoSubmit} className="glassmorphism p-6 rounded-3xl border border-white/50 shadow-md space-y-4">
              <h4 className="font-bold text-sm text-indigo-950 dark:text-white uppercase">General Parameters</h4>
              <div className="w-12 h-0.5 bg-blue-600 rounded"></div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">School Name</label>
                  <input
                    type="text" required
                    value={editSchoolForm.name}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Tagline</label>
                  <input
                    type="text" required
                    value={editSchoolForm.tagline}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Logo Photo URL</label>
                  <input
                    type="text" required
                    value={editSchoolForm.logo}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, logo: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Principal Name</label>
                  <input
                    type="text" required
                    value={editSchoolForm.principalName}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, principalName: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Principal Designation</label>
                  <input
                    type="text" required
                    value={editSchoolForm.principalDesignation}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, principalDesignation: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Principal Photo URL</label>
                  <input
                    type="text" required
                    value={editSchoolForm.principalPhoto}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, principalPhoto: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Principal Welcome address Message</label>
                <textarea
                  required rows={3}
                  value={editSchoolForm.principalMessage}
                  onChange={(e) => setEditSchoolForm(prev => ({ ...prev, principalMessage: e.target.value }))}
                  className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Principal Welcome address Quote</label>
                <input
                  type="text" required
                  value={editSchoolForm.principalQuote}
                  onChange={(e) => setEditSchoolForm(prev => ({ ...prev, principalQuote: e.target.value }))}
                  className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">About Page Details</h5>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">History Statement</label>
                  <textarea
                    required rows={3}
                    value={editSchoolForm.history}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, history: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Vision Statement</label>
                  <textarea
                    required rows={2}
                    value={editSchoolForm.vision}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, vision: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Mission Statement</label>
                  <textarea
                    required rows={2}
                    value={editSchoolForm.mission}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, mission: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">Homepage Hero & Campus Highlights Media</h5>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Hero Banner Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Building Future Leaders & Innovators"
                      value={editSchoolForm.heroTitle || ''}
                      onChange={(e) => setEditSchoolForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Hero Banner Subtitle</label>
                    <input
                      type="text"
                      placeholder="Welcome to Sri Vani Vidyanikethan..."
                      value={editSchoolForm.heroSubtitle || ''}
                      onChange={(e) => setEditSchoolForm(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Campus/Student Highlight Photo URL</label>
                  <input
                    type="text"
                    value={editSchoolForm.campusPhoto || ''}
                    onChange={(e) => setEditSchoolForm(prev => ({ ...prev, campusPhoto: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  {editSchoolForm.campusPhoto && (
                    <div className="mt-2 relative rounded-xl overflow-hidden border w-full max-w-sm h-36">
                      <img src={editSchoolForm.campusPhoto} alt="Campus Highlights Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Campus Photo Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Modern Academic Block"
                      value={editSchoolForm.campusPhotoTitle || ''}
                      onChange={(e) => setEditSchoolForm(prev => ({ ...prev, campusPhotoTitle: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Campus Photo Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Equipped with 3D models..."
                      value={editSchoolForm.campusPhotoDesc || ''}
                      onChange={(e) => setEditSchoolForm(prev => ({ ...prev, campusPhotoDesc: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow">
                Save School Configuration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ───── COMMITTEE MEMBERS TAB ───── */}
      {activeTab === 'Committee Members' && (
        <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/55 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-lg font-montserrat text-slate-900 dark:text-white">School Management Committee</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                Add, update, and remove members of the School Management Committee displayed on the public About page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowMemberForm(!showMemberForm);
                setMemberEditId(null);
                setMemberForm({ name: '', role: '', qual: '', photo: '' });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow animate-pulse"
            >
              {showMemberForm ? 'Close form' : 'Add Committee Member'}
            </button>
          </div>

          {showMemberForm && (
            <form onSubmit={handleMemberSubmit} className="glassmorphism p-6 rounded-3xl border border-white/55 shadow-lg space-y-4 max-w-xl">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-450">
                {memberEditId ? 'Edit Committee Member Details' : 'Register New Committee Member'}
              </h4>
              <div className="w-12 h-0.5 bg-blue-600 rounded"></div>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Name</label>
                  <input
                    type="text" required placeholder="Full Name"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Role / Designation</label>
                  <input
                    type="text" required placeholder="e.g. Chairman / Principal"
                    value={memberForm.role}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Qualification</label>
                  <input
                    type="text" required placeholder="e.g. M.B.A / Ph.D"
                    value={memberForm.qual}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, qual: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Photo URL</label>
                  <input
                    type="text" required placeholder="Paste image link URL"
                    value={memberForm.photo}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, photo: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl">
                    {memberEditId ? 'Save Changes' : 'Register Member'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMemberForm(false);
                      setMemberEditId(null);
                    }}
                    className="bg-slate-200 dark:bg-slate-800 text-slate-750 dark:text-slate-300 font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {managementCommittee && managementCommittee.map((member) => (
              <div key={member.id} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-md flex justify-between items-center hover:scale-[1.01] transition-transform duration-200">
                <div className="flex gap-3 items-center">
                  <img src={member.photo} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/20 shadow-sm" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{member.name}</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{member.role}</p>
                    <p className="text-[10px] text-slate-450 mt-1 font-light">{member.qual}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0 ml-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMemberEditId(member.id);
                      setMemberForm({ ...member });
                      setShowMemberForm(true);
                    }}
                    className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg border border-slate-200/40 dark:border-slate-800 transition"
                    title="Edit Member"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete committee member "${member.name}"?`)) {
                        deleteCommitteeMember(member.id);
                        alert('Committee member deleted successfully.');
                      }
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg border border-slate-200/40 dark:border-slate-800 transition"
                    title="Delete Member"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {(!managementCommittee || managementCommittee.length === 0) && (
              <div className="col-span-2 p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border text-slate-400 text-xs italic font-light">
                No committee members registered yet.
              </div>
            )}
          </div>
        </div>
      )}


      {/* ───── GALLERY MANAGER TAB ───── */}
      {activeTab === 'Gallery Manager' && (
        <GalleryManagerPanel
          galleryItems={galleryItems}
          addGalleryItem={addGalleryItem}
          editGalleryItem={editGalleryItem}
          deleteGalleryItem={deleteGalleryItem}
          galleryCategories={galleryCategories}
          addGalleryCategory={addGalleryCategory}
          editGalleryCategory={editGalleryCategory}
          deleteGalleryCategory={deleteGalleryCategory}
        />
      )}

      {/* ───── ACADEMICS TAB ───── */}
      {activeTab === 'Academics' && (
        <AcademicsManagerPanel
          academicCalendar={academicCalendar}
          addCalendarEvent={addCalendarEvent}
          editCalendarEvent={editCalendarEvent}
          deleteCalendarEvent={deleteCalendarEvent}
          academicPrograms={academicPrograms}
          addAcademicProgram={addAcademicProgram}
          editAcademicProgram={editAcademicProgram}
          deleteAcademicProgram={deleteAcademicProgram}
          subjects={subjects}
          gradingProcess={gradingProcess}
          updateGradingProcess={updateGradingProcess}
          gradingScheme={gradingScheme}
          updateGradingScheme={updateGradingScheme}
        />
      )}

      {/* ───── SUBJECTS TAB ───── */}
      {activeTab === 'Subjects' && (
        <SubjectsManagerPanel
          subjects={subjects}
          addSubject={addSubject}
          editSubject={editSubject}
          deleteSubject={deleteSubject}
          departments={departments}
          addDepartment={addDepartment}
          editDepartment={editDepartment}
          deleteDepartment={deleteDepartment}
        />
      )}

      {/* ───── ENQUIRIES TAB ───── */}
      {activeTab === 'Enquiries' && (
        <EnquiriesPanel enquiries={enquiries} markEnquiryContacted={markEnquiryContacted} deleteEnquiry={deleteEnquiry} />
      )}

      {/* ───── TESTIMONIALS TAB ───── */}
      {activeTab === 'Testimonials' && (
        <TestimonialsPanel
          testimonials={testimonials}
          addTestimonial={addTestimonial}
          editTestimonial={editTestimonial}
          deleteTestimonial={deleteTestimonial}
          toggleTestimonial={toggleTestimonial}
        />
      )}

      {/* ───── LEAVES TAB ───── */}
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
          <p className="text-xs text-slate-400 font-light mt-1">Global monitor and review panel for student leave applications.</p>
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
                      <td className="p-4 font-medium text-slate-650 dark:text-slate-355">{leave.startDate} to {leave.endDate}</td>
                      <td className="p-4 text-slate-550 dark:text-slate-405 italic">"{leave.reason}"</td>
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
                          <p className="text-slate-650 dark:text-slate-300 italic font-mono">"{leave.adminMessage || 'No feedback message.'}"</p>
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

      {/* Audit Logs tab */}
      {activeTab === 'Audit Logs' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg font-montserrat">Global System Audit Logs</h3>
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">User Initiator</th>
                    <th className="p-4">Authorization Role</th>
                    <th className="p-4">Action Event</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{log.user}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                          log.role === 'Admin' ? 'bg-blue-500/10 text-blue-500' :
                          log.role === 'Teacher' ? 'bg-amber-500/10 text-amber-500' :
                          log.role === 'SuperAdmin' ? 'bg-purple-500/10 text-purple-500' :
                          'bg-slate-500/10 text-slate-500'
                        }`}>
                          {log.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-350">{log.action}</td>
                      <td className="p-4 text-right text-slate-400 font-mono text-[10px]">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ───── FACILITIES TAB ───── */}
      {activeTab === 'Facilities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-lg font-montserrat">Campus Facilities Manager</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                Configure campus facilities page items, capacities, features and icons.
              </p>
            </div>
            <button 
              onClick={() => {
                setShowFacilityForm(!showFacilityForm);
                setFacilityEditId(null);
                setFacilityForm({ title: '', description: '', icon: '🏫', capacity: '100 Students', features: '' });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              {showFacilityForm ? <X size={14} /> : <Plus size={14} />} {showFacilityForm ? 'Close form' : 'Add Facility'}
            </button>
          </div>

          {showFacilityForm && (
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!facilityForm.title || !facilityForm.description) return;
              const featuresArray = typeof facilityForm.features === 'string' 
                ? facilityForm.features.split(',').map(f => f.trim()).filter(Boolean) 
                : facilityForm.features;
              const data = { ...facilityForm, features: featuresArray };
              if (facilityEditId) {
                editFacility(facilityEditId, data);
                alert('Facility updated successfully.');
              } else {
                addFacility(data);
                alert('Facility added successfully.');
              }
              setShowFacilityForm(false);
              setFacilityEditId(null);
              setFacilityForm({ title: '', description: '', icon: '🏫', capacity: '100 Students', features: '' });
            }} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                {facilityEditId ? 'Edit Facility details' : 'Register New Facility'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" required placeholder="Facility Title" value={facilityForm.title}
                  onChange={(e) => setFacilityForm(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="text" placeholder="Icon Emoji (e.g. 📚)" value={facilityForm.icon}
                  onChange={(e) => setFacilityForm(prev => ({ ...prev, icon: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Capacity (e.g. 150 Students)" value={facilityForm.capacity}
                  onChange={(e) => setFacilityForm(prev => ({ ...prev, capacity: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="text" placeholder="Key Highlights (comma-separated)" value={Array.isArray(facilityForm.features) ? facilityForm.features.join(', ') : facilityForm.features}
                  onChange={(e) => setFacilityForm(prev => ({ ...prev, features: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <textarea 
                required placeholder="Facility Description" value={facilityForm.description}
                onChange={(e) => setFacilityForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
              />
              <button type="submit" className="bg-emerald-600 text-white font-bold text-xs px-5 py-2 rounded-xl">
                {facilityEditId ? 'Save Facility' : 'Confirm Registry'}
              </button>
            </form>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(facilities || []).map((fac) => (
              <div key={fac.id} className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform duration-300">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{fac.icon}</span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{fac.title}</h4>
                    </div>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => {
                          setFacilityEditId(fac.id);
                          setFacilityForm({ 
                            title: fac.title, 
                            description: fac.description, 
                            icon: fac.icon, 
                            capacity: fac.capacity || '', 
                            features: Array.isArray(fac.features) ? fac.features.join(', ') : (fac.features || '') 
                          });
                          setShowFacilityForm(true);
                        }} 
                        className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Delete this facility?')) deleteFacility(fac.id);
                        }} 
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Capacity: {fac.capacity}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal font-light">{fac.description}</p>
                </div>
                {fac.features && fac.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 border-t pt-3">
                    {fac.features.map((feat, idx) => (
                      <span key={idx} className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded border border-slate-200/50 dark:border-slate-800">
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───── HOMEPAGE MANAGER TAB ───── */}
      {activeTab === 'Homepage' && (
        <div className="space-y-6 text-left max-w-4xl mx-auto animate-fade-in">
          {/* Infrastructure Cards section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-lg font-montserrat">World Class Campus Infrastructure</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Modify the main infrastructure section highlights on the landing homepage.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowInfraAddForm(!showInfraAddForm);
                  setInfraAddForm({ title: '', description: '', image: '' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow"
              >
                {showInfraAddForm ? <X size={12} /> : <Plus size={12} />} {showInfraAddForm ? 'Close form' : 'Add Highlight'}
              </button>
            </div>

            {showInfraAddForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!infraAddForm.title || !infraAddForm.description) return;
                  addInfraItem(infraAddForm);
                  alert('Homepage infrastructure highlight added successfully.');
                  setShowInfraAddForm(false);
                  setInfraAddForm({ title: '', description: '', image: '' });
                }}
                className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl text-left"
              >
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-450">Add New Infrastructure Highlight</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Title</label>
                    <input
                      type="text" required placeholder="e.g. Smart Digital Classrooms"
                      value={infraAddForm.title}
                      onChange={(e) => setInfraAddForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Image URL</label>
                    <input
                      type="text" required placeholder="Image link URL"
                      value={infraAddForm.image}
                      onChange={(e) => setInfraAddForm(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Description</label>
                    <textarea
                      required placeholder="Interactive smart boards..."
                      value={infraAddForm.description}
                      onChange={(e) => setInfraAddForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl">
                    Add Highlight
                  </button>
                </div>
              </form>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              {(homepageInfra || []).map((infra) => (
                <div key={infra.id} className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md space-y-4">
                  {editingInfraId === infra.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Title</label>
                        <input
                          type="text"
                          value={infraEditForm.title}
                          onChange={(e) => setInfraEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Image URL</label>
                        <input
                          type="text"
                          value={infraEditForm.image}
                          onChange={(e) => setInfraEditForm(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Description</label>
                        <textarea
                          value={infraEditForm.description}
                          onChange={(e) => setInfraEditForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            updateInfraItem(infra.id, infraEditForm);
                            setEditingInfraId(null);
                            alert('Homepage infrastructure card updated successfully.');
                          }}
                          className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingInfraId(null)}
                          className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold px-4 py-2 rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <img src={infra.image} alt={infra.title} className="w-24 h-24 object-cover rounded-xl border shrink-0 bg-slate-100" />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{infra.title}</h4>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingInfraId(infra.id);
                                setInfraEditForm({ title: infra.title, description: infra.description, image: infra.image });
                              }}
                              className="p-1 text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded"
                              title="Edit Highlight"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${infra.title}"?`)) {
                                  deleteInfraItem(infra.id);
                                  alert('Highlight deleted successfully.');
                                }
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                              title="Delete Highlight"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">{infra.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Statistics section */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-lg font-montserrat">Homepage Counter Statistics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">Add, edit and manage counter statistic numbers displayed on the homepage network (e.g. 500+ Students, 50+ Educators, etc.)</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowStatAddForm(!showStatAddForm);
                  setStatAddForm({ label: '', value: '', icon: '🏆' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow"
              >
                {showStatAddForm ? <X size={12} /> : <Plus size={12} />} {showStatAddForm ? 'Close form' : 'Add Stat'}
              </button>
            </div>

            {showStatAddForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!statAddForm.value || !statAddForm.label) return;
                  addHomepageStat(statAddForm);
                  alert('Homepage counter statistic added successfully.');
                  setShowStatAddForm(false);
                  setStatAddForm({ value: '', label: '', icon: '🏆' });
                }}
                className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl text-left"
              >
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-450">Add New Counter Statistic</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Value (e.g. 500+)</label>
                      <input
                        type="text" required placeholder="e.g. 500+"
                        value={statAddForm.value}
                        onChange={(e) => setStatAddForm(prev => ({ ...prev, value: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Icon Emoji (e.g. 🎓)</label>
                      <input
                        type="text" required placeholder="e.g. 🎓"
                        value={statAddForm.icon}
                        onChange={(e) => setStatAddForm(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Label Text</label>
                    <input
                      type="text" required placeholder="e.g. Students Enrolled"
                      value={statAddForm.label}
                      onChange={(e) => setStatAddForm(prev => ({ ...prev, label: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl">
                    Add Stat
                  </button>
                </div>
              </form>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(homepageStats || []).map((stat) => (
                <div key={stat.id} className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                  {editingStatId === stat.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Value</label>
                          <input
                            type="text"
                            value={statEditForm.value}
                            onChange={(e) => setStatEditForm(prev => ({ ...prev, value: e.target.value }))}
                            className="w-full px-3 py-1.5 border rounded-xl bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Icon Emoji</label>
                          <input
                            type="text"
                            value={statEditForm.icon || ''}
                            onChange={(e) => setStatEditForm(prev => ({ ...prev, icon: e.target.value }))}
                            className="w-full px-3 py-1.5 border rounded-xl bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Label Text</label>
                        <input
                          type="text"
                          value={statEditForm.label}
                          onChange={(e) => setStatEditForm(prev => ({ ...prev, label: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            updateHomepageStat(stat.id, statEditForm);
                            setEditingStatId(null);
                            alert('Homepage stats parameter updated successfully.');
                          }}
                          className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingStatId(null)}
                          className="bg-slate-200 dark:bg-slate-800 text-xs font-bold px-4 py-1.5 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{stat.icon || '🏆'}</span>
                          <h4 className="text-2xl font-black text-blue-600 dark:text-blue-400">{stat.value}</h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">{stat.label}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingStatId(stat.id);
                            setStatEditForm({ label: stat.label, value: stat.value, icon: stat.icon || '🏆' });
                          }}
                          className="p-1 text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded"
                          title="Edit Stat"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete stat "${stat.label}"?`)) {
                              deleteHomepageStat(stat.id);
                              alert('Stat deleted successfully.');
                            }
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                          title="Delete Stat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───── COMPLAINTS TAB ───── */}
      {activeTab === 'Complaints' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-extrabold text-lg font-montserrat">Student Complaints & Grievance Desk</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
              Review and reply to complaints logged by students from their portals. Update status values to track resolutions.
            </p>
          </div>

          <div className="space-y-4">
            {(complaints || []).map((comp) => (
              <div key={comp.id} className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">Ticket #{comp.id}</span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">{comp.subject}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">
                      Submitted by: <strong>{comp.studentName}</strong> ({comp.class} - Sec {comp.section} | Reg No: {comp.studentRegisterNo}) | {comp.submittedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      comp.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                      comp.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-amber-500/10 text-amber-600'
                    }`}>
                      {comp.status}
                    </span>
                    <select
                      value={comp.status}
                      onChange={(e) => updateComplaintStatus(comp.id, e.target.value, comp.reply || '')}
                      className="px-2 py-1 border rounded-lg bg-white dark:bg-slate-950 text-[10px] focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-light bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {comp.description}
                </p>

                {complaintReplyId === comp.id ? (
                  <div className="space-y-2">
                    <textarea
                      placeholder="Type response reply details to the student..."
                      value={complaintReplyText}
                      onChange={(e) => setComplaintReplyText(e.target.value)}
                      rows={2}
                      className="w-full p-3 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          updateComplaintStatus(comp.id, comp.status, complaintReplyText);
                          setComplaintReplyId(null);
                          setComplaintReplyText('');
                          alert('Reply submitted successfully.');
                        }}
                        className="bg-emerald-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-lg"
                      >
                        Submit Reply
                      </button>
                      <button
                        onClick={() => {
                          setComplaintReplyId(null);
                          setComplaintReplyText('');
                        }}
                        className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold px-4 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : comp.reply ? (
                  <div className="p-3 bg-blue-500/5 dark:bg-blue-950/10 rounded-xl border border-blue-500/10 text-xs">
                    <p className="font-bold text-blue-600 dark:text-blue-400">Your Response:</p>
                    <p className="text-slate-600 dark:text-slate-350 mt-1 font-light">{comp.reply}</p>
                    <button
                      onClick={() => {
                        setComplaintReplyId(comp.id);
                        setComplaintReplyText(comp.reply);
                      }}
                      className="text-[9px] text-blue-600 hover:underline mt-2 font-bold"
                    >
                      Edit response
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setComplaintReplyId(comp.id);
                      setComplaintReplyText('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xl shadow"
                  >
                    Write Response Reply
                  </button>
                )}
              </div>
            ))}
            {(!complaints || complaints.length === 0) && (
              <div className="text-center py-12 text-slate-400 text-sm glassmorphism rounded-2xl">
                No student complaints filed.
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Audit Logs tab */}

    </div>
  );
}

/* ============================================================
   GALLERY MANAGER PANEL — standalone component
   ============================================================ */
const GALLERY_CATEGORIES = ['Sports', 'Annual Day', 'Special Events', 'Cultural Programs', 'Science Exhibition', 'Classroom Activities', 'Independence Day', 'Republic Day', 'Teachers Day', 'Other'];

function GalleryManagerPanel({ galleryItems, addGalleryItem, editGalleryItem, deleteGalleryItem, galleryCategories, addGalleryCategory, editGalleryCategory, deleteGalleryCategory }) {
  const fileInputRef = useRef(null);
  const [filterCat, setFilterCat] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Category CRUD states
  const [editingCatName, setEditingCatName] = useState(null);
  const [catFormName, setCatFormName] = useState('');

  const categories = galleryCategories || GALLERY_CATEGORIES;

  const [form, setForm] = useState({
    title: '', category: categories[0] || 'Sports', description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'image', url: ''
  });

  const filtered = filterCat === 'All' ? galleryItems : galleryItems.filter(g => g.category === filterCat);

  const resetForm = () => {
    setForm({ title: '', category: categories[0] || 'Sports', description: '', date: new Date().toISOString().split('T')[0], type: 'image', url: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    setForm(f => ({ ...f, type: isVideo ? 'video' : 'image' }));
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, url: ev.target.result }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.title || !form.url) return;
    if (editId) {
      editGalleryItem(editId, form);
    } else {
      addGalleryItem({ ...form, id: 'g' + Date.now() });
    }
    resetForm();
  };

  const startEdit = (item) => {
    setForm({ title: item.title, category: item.category, description: item.description || '', date: item.date, type: item.type, url: item.url });
    setEditId(item.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-lg font-montserrat">Gallery Manager</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Upload photos &amp; videos for Sports, Annual Day, Special Events and more.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md animate-pulse-glow"
        >
          <Upload size={14} /> Upload Media
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Media', value: galleryItems.length, color: 'bg-blue-500/10 text-blue-600' },
          { label: 'Photos', value: galleryItems.filter(g => g.type === 'image').length, color: 'bg-emerald-500/10 text-emerald-600' },
          { label: 'Videos', value: galleryItems.filter(g => g.type === 'video').length, color: 'bg-purple-500/10 text-purple-600' },
          { label: 'Categories', value: [...new Set(galleryItems.map(g => g.category))].length, color: 'bg-amber-500/10 text-amber-600' }
        ].map((s, i) => (
          <div key={i} className={`${s.color} rounded-xl p-3 text-center`}>
            <p className="font-extrabold text-xl">{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {['All', ...categories].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterCat === cat ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Upload / Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm">{editId ? 'Edit Media Item' : 'Upload New Media'}</h4>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>

          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-blue-400/50 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
            {uploading ? (
              <p className="text-blue-500 text-xs font-semibold animate-pulse">Processing file...</p>
            ) : form.url ? (
              <div className="space-y-2">
                {form.type === 'image' ? (
                  <img src={form.url} alt="preview" className="h-32 mx-auto object-cover rounded-lg shadow" />
                ) : (
                  <video src={form.url} className="h-32 mx-auto rounded-lg shadow" controls />
                )}
                <p className="text-[10px] text-slate-500">Click to change file</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center gap-3 text-slate-400">
                  <Image size={28} /><Video size={28} />
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Click to upload Photo or Video</p>
                <p className="text-[10px] text-slate-400">Supports JPG, PNG, GIF, MP4, MOV, WebM</p>
              </div>
            )}
          </div>

          {/* Or paste URL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">— or paste image/video URL —</label>
            <input
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/photo.jpg"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value, type: e.target.value.match(/\.(mp4|mov|webm|avi)$/i) ? 'video' : 'image' }))}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title *</label>
              <input
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Annual Day Dance Performance"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category *</label>
              <select
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Event Date</label>
              <input
                type="date"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
              <input
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief caption..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!form.title || !form.url}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              {editId ? 'Save Changes' : 'Add to Gallery'}
            </button>
            <button onClick={resetForm} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <FolderOpen size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">No media in this category yet.</p>
          <p className="text-xs mt-1">Click &quot;Upload Media&quot; to add photos or videos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800 hover:-translate-y-1 transition-all duration-300">
              {/* Thumbnail */}
              <div className="h-40 relative overflow-hidden cursor-pointer" onClick={() => setLightbox(item)}>
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                    <video src={item.url} className="w-full h-full object-cover opacity-70" muted />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Video size={18} className="text-blue-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setLightbox(item); }} className="w-8 h-8 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow">
                    <ZoomIn size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); startEdit(item); }} className="w-8 h-8 rounded-full bg-white/90 text-amber-600 flex items-center justify-center shadow">
                    <Edit size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteGalleryItem(item.id); }} className="w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow">
                    <Trash2 size={14} />
                  </button>
                </div>
                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1 ${item.type === 'video' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {item.type === 'video' ? <Video size={9} /> : <Image size={9} />} {item.type}
                  </span>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{item.category}</span>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white mt-0.5 truncate">{item.title}</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Categories Management Section */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-lg p-6 space-y-4 mt-8">
        <div>
          <h4 className="font-extrabold text-sm font-montserrat">Manage Gallery Categories</h4>
          <p className="text-xs text-slate-500">Add, edit or delete categories used to organize the gallery.</p>
        </div>
        
        {/* Add Category Form */}
        <div className="flex gap-2">
          <input
            className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New Category Name (e.g., Science Fair)"
            value={catFormName}
            onChange={e => setCatFormName(e.target.value)}
          />
          <button
            onClick={() => {
              if (!catFormName.trim()) return;
              addGalleryCategory(catFormName.trim());
              setCatFormName('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
          >
            Add Category
          </button>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-xl">
              {editingCatName === cat ? (
                <div className="flex gap-1.5 w-full">
                  <input
                    className="flex-1 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-slate-900 focus:outline-none"
                    defaultValue={cat}
                    id={`edit-cat-input-${idx}`}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(`edit-cat-input-${idx}`);
                      if (input && input.value.trim() && input.value.trim() !== cat) {
                        editGalleryCategory(cat, input.value.trim());
                      }
                      setEditingCatName(null);
                    }}
                    className="bg-emerald-600 text-white px-2.5 py-1 rounded text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCatName(null)}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cat}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingCatName(cat)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600 rounded transition-all"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => deleteGalleryCategory(cat)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-red-500 rounded transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white bg-slate-800/60 p-2 rounded-full hover:bg-slate-700 backdrop-blur-md z-10" onClick={() => setLightbox(null)}>
            <X size={22} />
          </button>
          <div className="max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800" onClick={e => e.stopPropagation()}>
            {lightbox.type === 'video' ? (
              <video src={lightbox.url} className="w-full max-h-[70vh] object-contain" controls autoPlay />
            ) : (
              <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[70vh] object-contain" />
            )}
            <div className="p-4 text-center">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{lightbox.category}</span>
              <h3 className="font-bold text-white text-base mt-1">{lightbox.title}</h3>
              {lightbox.description && <p className="text-xs text-slate-400 mt-1">{lightbox.description}</p>}
              <p className="text-[10px] text-slate-500 mt-1">{lightbox.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   ACADEMICS MANAGER PANEL
   ================================================================ */
const CAL_TYPES = ['Academic', 'Examination', 'Holiday'];

function AcademicsManagerPanel({
  academicCalendar, addCalendarEvent, editCalendarEvent, deleteCalendarEvent,
  academicPrograms, addAcademicProgram, editAcademicProgram, deleteAcademicProgram,
  subjects,
  gradingProcess, updateGradingProcess,
  gradingScheme, updateGradingScheme
}) {
  const [section, setSection] = React.useState('calendar');
  const [showCalForm, setShowCalForm] = React.useState(false);
  const [calEditId, setCalEditId] = React.useState(null);
  const [calForm, setCalForm] = React.useState({ date: '', title: '', type: 'Academic' });
  const resetCalForm = () => { setCalForm({ date: '', title: '', type: 'Academic' }); setCalEditId(null); setShowCalForm(false); };
  const submitCalEvent = () => {
    if (!calForm.date || !calForm.title) return;
    calEditId ? editCalendarEvent(calEditId, calForm) : addCalendarEvent(calForm);
    resetCalForm();
  };
  const startEditCal = (ev) => { setCalForm({ date: ev.date, title: ev.title, type: ev.type }); setCalEditId(ev.id); setShowCalForm(true); };

  const [showProgForm, setShowProgForm] = React.useState(false);
  const [progEditId, setProgEditId] = React.useState(null);
  const [progForm, setProgForm] = React.useState({ grade: '', focus: '', desc: '', subjects: [] });
  const resetProgForm = () => { setProgForm({ grade: '', focus: '', desc: '', subjects: [] }); setProgEditId(null); setShowProgForm(false); };
  const toggleProgSubject = (code) => {
    setProgForm(f => ({
      ...f,
      subjects: f.subjects.includes(code)
        ? f.subjects.filter(s => s !== code)
        : [...f.subjects, code]
    }));
  };
  const submitProgram = () => {
    if (!progForm.grade) return;
    progEditId ? editAcademicProgram(progEditId, progForm) : addAcademicProgram(progForm);
    resetProgForm();
  };
  const startEditProg = (p) => {
    setProgForm({ grade: p.grade, focus: p.focus || '', desc: p.desc || '', subjects: p.subjects || [] });
    setProgEditId(p.id); setShowProgForm(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-extrabold text-lg font-montserrat">Academics Manager</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage the Academic Calendar and Program Levels shown on the public Academics page.</p>
      </div>
      <div className="flex gap-2">
        {[
          ['calendar', '📅 Academic Calendar'],
          ['programs', '🎒 Program Levels'],
          ['grading', '📊 Grading Scheme & Process']
        ].map(([key, label]) => (
          <button key={key} onClick={() => setSection(key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${section === key ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {section === 'calendar' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold">{(academicCalendar||[]).length} events scheduled</p>
            <button onClick={() => { resetCalForm(); setShowCalForm(true); }} className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold">
              <Plus size={13} /> Add Event
            </button>
          </div>
          {showCalForm && (
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-xl p-5 space-y-4">
              <div className="flex justify-between"><h4 className="font-bold text-sm">{calEditId ? 'Edit Event' : 'Add Event'}</h4><button onClick={resetCalForm}><X size={15} /></button></div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Date *</label>
                  <input className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Aug 15, 2026" value={calForm.date} onChange={e => setCalForm(f => ({ ...f, date: e.target.value }))} /></div>
                <div className="space-y-1 sm:col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Title *</label>
                  <input className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Independence Day" value={calForm.title} onChange={e => setCalForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Type</label>
                  <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" value={calForm.type} onChange={e => setCalForm(f => ({ ...f, type: e.target.value }))}>
                    {CAL_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="flex gap-3">
                <button onClick={submitCalEvent} disabled={!calForm.date || !calForm.title} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold">{calEditId ? 'Save' : 'Add Event'}</button>
                <button onClick={resetCalForm} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900">Cancel</button>
              </div>
            </div>
          )}
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/50 dark:border-slate-700 overflow-hidden shadow-lg">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {(academicCalendar||[]).map(ev => (
                <div key={ev.id} className="p-3.5 flex items-center gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase w-20 text-center ${ev.type==='Holiday'?'bg-red-500/10 text-red-500':ev.type==='Examination'?'bg-amber-500/10 text-amber-500':'bg-blue-500/10 text-blue-500'}`}>{ev.type}</span>
                  <div className="flex-1 min-w-0"><p className="font-bold text-xs text-slate-900 dark:text-white truncate">{ev.title}</p><p className="text-[10px] text-slate-400">{ev.date}</p></div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => startEditCal(ev)} className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center"><Edit size={12} /></button>
                    <button onClick={() => deleteCalendarEvent(ev.id)} className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'programs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold">{(academicPrograms||[]).length} program levels</p>
            <button onClick={() => { resetProgForm(); setShowProgForm(true); }} className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold">
              <Plus size={13} /> Add Level
            </button>
          </div>
          {showProgForm && (
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-xl p-5 space-y-4">
              <div className="flex justify-between"><h4 className="font-bold text-sm">{progEditId ? 'Edit Level' : 'Add Level'}</h4><button onClick={resetProgForm}><X size={15} /></button></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Level Name *</label>
                  <input className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Pre-Primary � Playclass" value={progForm.grade} onChange={e => setProgForm(f => ({ ...f, grade: e.target.value }))} /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Focus / Tagline</label>
                  <input className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Early Childhood Foundation" value={progForm.focus} onChange={e => setProgForm(f => ({ ...f, focus: e.target.value }))} /></div>
                <div className="sm:col-span-2 space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                  <textarea className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} placeholder="Brief description..." value={progForm.desc} onChange={e => setProgForm(f => ({ ...f, desc: e.target.value }))} /></div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Core Subjects — tick from Subjects list</label>
                  {(subjects || []).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No subjects defined yet. Go to the Subjects tab to add subjects first.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                      {(subjects || []).map(sub => {
                        const checked = (progForm.subjects || []).includes(sub.code);
                        return (
                          <label key={sub.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-xs ${
                            checked
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-blue-300'
                          }`}>
                            <input
                              type="checkbox"
                              className="accent-blue-600 shrink-0"
                              checked={checked}
                              onChange={() => toggleProgSubject(sub.code)}
                            />
                            <span className="leading-tight">{sub.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {(progForm.subjects || []).length > 0 && (
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                      ✓ {progForm.subjects.length} subject{progForm.subjects.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={submitProgram} disabled={!progForm.grade} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold">{progEditId ? 'Save' : 'Add Level'}</button>
                <button onClick={resetProgForm} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900">Cancel</button>
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            {(academicPrograms||[]).map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-lg p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded">{p.focus}</span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">{p.grade}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{p.desc}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => startEditProg(p)} className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center"><Edit size={12} /></button>
                    <button onClick={() => deleteAcademicProgram(p.id)} className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center"><Trash2 size={12} /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100 dark:divide-slate-800">
                  {(p.subjects||[]).map((s, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'grading' && (
        <div className="space-y-6">
          {/* Grading Process Form */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-lg p-6 space-y-4">
            <div>
              <h4 className="font-extrabold text-sm font-montserrat">Continuous Assessment & Grading Process</h4>
              <p className="text-xs text-slate-500">Edit the assessment model title and description displayed on the Academics page.</p>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Assessment Title</label>
                <input
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Continuous Assessment Model"
                  defaultValue={gradingProcess?.title || ''}
                  id="grading-process-title-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Assessment Description</label>
                <textarea
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Describe the continuous assessment model..."
                  defaultValue={gradingProcess?.description || ''}
                  id="grading-process-desc-input"
                />
              </div>
              <button
                onClick={() => {
                  const titleVal = document.getElementById('grading-process-title-input')?.value || '';
                  const descVal = document.getElementById('grading-process-desc-input')?.value || '';
                  updateGradingProcess({ title: titleVal, description: descVal });
                  alert('Grading process updated successfully!');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Save Process Info
              </button>
            </div>
          </div>

          {/* Grading Scheme Table Editor */}
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-lg p-6 space-y-4">
            <div>
              <h4 className="font-extrabold text-sm font-montserrat">Grading Scheme & Scale</h4>
              <p className="text-xs text-slate-500">Add, edit, or delete grades, percentage ranges, and descriptions in the grading table.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                    <th className="py-2.5">Grade</th>
                    <th className="py-2.5">Marks Range (%)</th>
                    <th className="py-2.5">Description / Remarks</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(gradingScheme || []).map((row, idx) => (
                    <tr key={row.id || idx}>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        <input
                          className="w-16 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs bg-white dark:bg-slate-900"
                          value={row.grade}
                          onChange={(e) => {
                            const newScheme = [...gradingScheme];
                            newScheme[idx] = { ...newScheme[idx], grade: e.target.value };
                            updateGradingScheme(newScheme);
                          }}
                        />
                      </td>
                      <td className="py-3">
                        <input
                          className="w-24 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs bg-white dark:bg-slate-900"
                          value={row.range}
                          onChange={(e) => {
                            const newScheme = [...gradingScheme];
                            newScheme[idx] = { ...newScheme[idx], range: e.target.value };
                            updateGradingScheme(newScheme);
                          }}
                        />
                      </td>
                      <td className="py-3">
                        <input
                          className="w-full border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs bg-white dark:bg-slate-900"
                          value={row.description}
                          onChange={(e) => {
                            const newScheme = [...gradingScheme];
                            newScheme[idx] = { ...newScheme[idx], description: e.target.value };
                            updateGradingScheme(newScheme);
                          }}
                        />
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            const newScheme = gradingScheme.filter((_, i) => i !== idx);
                            updateGradingScheme(newScheme);
                          }}
                          className="text-red-500 hover:text-red-750 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  const newScheme = [...(gradingScheme || []), { id: Date.now().toString(), grade: 'New', range: '0-0', description: 'New Grade' }];
                  updateGradingScheme(newScheme);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus size={13} /> Add Grade Row
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   ENQUIRIES PANEL
   ================================================================ */
function EnquiriesPanel({ enquiries, markEnquiryContacted, deleteEnquiry }) {
  const newCount = (enquiries||[]).filter(e => e.status === 'New').length;
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-extrabold text-lg font-montserrat">Parent & Visitor Enquiries</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Messages submitted through the Contact page. Call them back on the phone number shown.</p>
        </div>
        {newCount > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 font-bold text-xs px-3 py-1.5 rounded-xl">
            {newCount} New {newCount === 1 ? 'Enquiry' : 'Enquiries'}
          </span>
        )}
      </div>

      {(enquiries||[]).length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-sm font-semibold">No enquiries yet.</p>
          <p className="text-xs mt-1">When parents or visitors submit the contact form, their messages will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(enquiries||[]).map(enq => (
            <div key={enq.id} className={`bg-white dark:bg-slate-800/60 rounded-2xl border shadow-lg p-4 sm:p-5 space-y-3 ${enq.status === 'New' ? 'border-blue-300 dark:border-blue-600' : 'border-slate-200/50 dark:border-slate-700'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                    {enq.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{enq.name}</p>
                    <p className="text-[10px] text-slate-400">{enq.role} &bull; {enq.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${enq.status === 'New' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                    {enq.status}
                  </span>
                </div>
              </div>

              {/* Phone — prominently displayed for quick callback */}
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Call Back Number</p>
                  <p className="font-extrabold text-sm text-emerald-800 dark:text-emerald-200 truncate">{enq.phone || 'Not provided'}</p>
                </div>
                {enq.phone && (
                  <a href={`tel:${enq.phone.replace(/\s/g,'')}`}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all">
                    📞 Call Now
                  </a>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                {enq.email && <p className="text-slate-500"><span className="font-bold text-slate-700 dark:text-slate-200">Email: </span>{enq.email}</p>}
                {enq.subject && <p className="text-slate-500"><span className="font-bold text-slate-700 dark:text-slate-200">Subject: </span>{enq.subject}</p>}
                <p className="text-slate-500"><span className="font-bold text-slate-700 dark:text-slate-200">Message: </span>{enq.message}</p>
              </div>

              <div className="flex gap-2 pt-1">
                {enq.status === 'New' && (
                  <button onClick={() => markEnquiryContacted(enq.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-all">
                    ✓ Mark as Contacted
                  </button>
                )}
                <button onClick={() => deleteEnquiry(enq.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   TESTIMONIALS PANEL
   ================================================================ */
function TestimonialsPanel({ testimonials, addTestimonial, editTestimonial, deleteTestimonial, toggleTestimonial }) {
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [form, setForm] = React.useState({ text: '', author: '', role: '' });

  const reset = () => { setForm({ text: '', author: '', role: '' }); setEditId(null); setShowForm(false); };
  const submit = () => {
    if (!form.text || !form.author) return;
    editId ? editTestimonial(editId, form) : addTestimonial(form);
    reset();
  };
  const startEdit = (t) => { setForm({ text: t.text, author: t.author, role: t.role }); setEditId(t.id); setShowForm(true); };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-extrabold text-lg font-montserrat">Testimonials Manager</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">These are shown in the "Words from Our Community" section on the home page.</p>
        </div>
        <button onClick={() => { reset(); setShowForm(true); }}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all">
          <Plus size={13} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h4>
            <button onClick={reset} className="text-slate-400 hover:text-slate-600"><X size={15} /></button>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Testimonial Text *</label>
              <textarea className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3} placeholder="Enter the testimonial quote..." value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Person's Name *</label>
                <input className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Lakshmi Devi" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Role / Relation</label>
                <input className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Parent, Class 4 Student" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={submit} disabled={!form.text || !form.author}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold">
              {editId ? 'Save Changes' : 'Add to Home Page'}
            </button>
            <button onClick={reset} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(testimonials||[]).length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No testimonials yet. Add one above.</div>
        )}
        {(testimonials||[]).map(t => (
          <div key={t.id} className={`bg-white dark:bg-slate-800/60 rounded-2xl border shadow-lg p-4 space-y-2 ${t.active ? 'border-blue-200 dark:border-blue-700' : 'border-slate-200/50 dark:border-slate-700 opacity-60'}`}>
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <p className="font-bold text-xs text-slate-900 dark:text-white mt-2">{t.author}</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400">{t.role}</p>
              </div>
              <div className="flex gap-1.5 shrink-0 flex-col items-end">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${t.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                  {t.active ? 'Visible' : 'Hidden'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => toggleTestimonial(t.id)} title={t.active ? 'Hide' : 'Show'}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${t.active ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                    {t.active ? '🙈' : '👁'}
                  </button>
                  <button onClick={() => startEdit(t)} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 flex items-center justify-center">
                    <Edit size={11} />
                  </button>
                  <button onClick={() => deleteTestimonial(t.id)} className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
/* ================================================================
   SUBJECTS MANAGER PANEL
   ================================================================ */
function SubjectsManagerPanel({ subjects, addSubject, editSubject, deleteSubject, departments, addDepartment, editDepartment, deleteDepartment }) {
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', code: '', department: '' });

  // For department editor
  const [editingDeptName, setEditingDeptName] = React.useState(null);
  const [deptFormName, setDeptFormName] = React.useState('');

  const DEPARTMENTS = departments || ['Languages', 'Mathematics', 'Science', 'Social Studies', 'Technology', 'Arts', 'Physical Education', 'General'];

  const reset = () => { setForm({ name: '', code: '', department: DEPARTMENTS[0] || 'Science' }); setEditId(null); setShowForm(false); };
  const submit = () => {
    if (!form.name || !form.code) return;
    const data = { ...form, code: form.code.toUpperCase().replace(/\s+/g, '') };
    editId ? editSubject(editId, data) : addSubject(data);
    reset();
  };
  const startEdit = (s) => { setForm({ name: s.name, code: s.code, department: s.department }); setEditId(s.id); setShowForm(true); };

  // Group by department
  const grouped = (subjects || []).reduce((acc, s) => {
    const d = s.department || 'General';
    if (!acc[d]) acc[d] = [];
    acc[d].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-lg font-montserrat">Subjects Manager</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            These subjects appear in: Teacher assignment dropdown, Faculty page filter, Teacher portal marks entry, and Timetable builder.
          </p>
        </div>
        <button onClick={() => { reset(); setShowForm(true); }}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0">
          <Plus size={13} /> Add Subject
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/50 dark:border-slate-700 shadow-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm">{editId ? 'Edit Subject' : 'Add New Subject'}</h4>
            <button onClick={reset} className="text-slate-400 hover:text-slate-600"><X size={15} /></button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Subject Name *</label>
              <input className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Telugu" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Subject Code *</label>
              <input className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="e.g. TELUGU" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
              <p className="text-[9px] text-slate-400">Uppercase, no spaces. Used internally.</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Department</label>
              <select className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={submit} disabled={!form.name || !form.code}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold">
              {editId ? 'Save Changes' : 'Add Subject'}
            </button>
            <button onClick={reset} className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200">Cancel</button>
          </div>
        </div>
      )}

      {/* Summary bar */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(grouped).map(dept => (
          <span key={dept} className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
            {dept} ({grouped[dept].length})
          </span>
        ))}
      </div>

      {/* Subjects grouped by department */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([dept, subs]) => (
          <div key={dept}>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></span>
              {dept}
              <span className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></span>
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subs.map(s => (
                <div key={s.id} className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700 shadow p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-[10px] shrink-0">
                    {s.code?.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{s.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono">{s.code}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => startEdit(s)} className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-all">
                      <Edit size={11} />
                    </button>
                    <button onClick={() => deleteSubject(s.id)} className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {(subjects || []).length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm glassmorphism rounded-2xl">
            No subjects added yet. Click "Add Subject" to get started.
          </div>
        )}
      </div>

      {/* Department Management Sub-Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6 space-y-4">
        <div>
          <h4 className="font-extrabold text-sm font-montserrat">Departments Manager</h4>
          <p className="text-xs text-slate-500 mt-0.5">Manage departments that categorize school subjects and faculty groups.</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text" placeholder={editingDeptName ? "Rename department..." : "Add new department..."}
            value={deptFormName}
            onChange={(e) => setDeptFormName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              if (!deptFormName.trim()) return;
              if (editingDeptName) {
                editDepartment(editingDeptName, deptFormName.trim());
                setEditingDeptName(null);
              } else {
                addDepartment(deptFormName.trim());
              }
              setDeptFormName('');
            }}
            className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            {editingDeptName ? 'Save' : <Plus size={14} />}
          </button>
          {editingDeptName && (
            <button
              onClick={() => {
                setEditingDeptName(null);
                setDeptFormName('');
              }}
              className="bg-slate-150 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {(departments || []).map((dept, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-900 dark:text-white truncate pr-2">{dept}</span>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setEditingDeptName(dept);
                    setDeptFormName(dept);
                  }}
                  className="p-1 text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                >
                  <Edit size={11} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete department "${dept}"? This will not delete subjects associated with it.`)) {
                      deleteDepartment(dept);
                    }
                  }}
                  className="p-1 text-red-505 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}