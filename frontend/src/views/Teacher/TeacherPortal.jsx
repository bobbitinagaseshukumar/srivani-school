import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckSquare, Upload, Clipboard, BookOpen, Layers, Plus, Users, Award, Calendar, AlertCircle, FileText } from 'lucide-react';

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

export default function TeacherPortal() {
  const { teachers, students, marks, homework, createHomework, notes, createNotes, liveClasses, createLiveClass,
    markAttendance, timetables, circulars, notifications, markNotificationRead, currentUser, logoutUser, subjects, classes, sections } = useContext(AppContext);

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
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Attendance grid tracking state (studentId -> status)
  const [attendanceSheet, setAttendanceSheet] = useState({});

  // Extract all periods for this teacher across all classes and days from AppContext
  const teacherPeriods = [];
  if (timetables) {
    timetables.forEach(t => {
      if (!t.slots) return;
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
  const [notesForm, setNotesForm] = useState({ title: '', description: '', subject: teacherSubject, class: 'Class 10', chapter: 'Chapter 5', type: 'PDF' });

  // Class circular state
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });

  // Live Class Creator state
  const [showAddLiveClass, setShowAddLiveClass] = useState(false);
  const [liveForm, setLiveForm] = useState({ subject: teacherSubject, title: '', startTime: '11:00 AM', duration: '45 Mins', meetingLink: 'https://meet.google.com/abc-defg-hij' });

  // Keep state synchronized with teacher's assigned subject in case it resolves late or changes
  useEffect(() => {
    setSubjectSelected(teacherSubject);
    setHwForm(prev => ({ ...prev, subject: teacherSubject }));
    setNotesForm(prev => ({ ...prev, subject: teacherSubject }));
    setLiveForm(prev => ({ ...prev, subject: teacherSubject }));
  }, [teacherSubject]);

  const activeStudents = students.filter(s => s.class === selectedClass && s.section === selectedSection);

  const handleInitializeAttendance = () => {
    const sheet = {};
    activeStudents.forEach(s => {
      sheet[s.id] = 'Present';
    });
    setAttendanceSheet(sheet);
  };

  const handleSaveAttendance = () => {
    const logs = Object.keys(attendanceSheet).map(sId => ({
      studentId: sId,
      date: attendanceDate,
      status: attendanceSheet[sId],
      class: selectedClass,
      section: selectedSection
    }));
    markAttendance(logs);
    alert(`Attendance marked for ${logs.length} students in ${selectedClass}-${selectedSection}.`);
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

  const handleCreateNotes = (e) => {
    e.preventDefault();
    if (!notesForm.title || !notesForm.chapter) return;
    createNotes({
      ...notesForm,
      teacherId: currentUser.id,
      file: notesForm.type === 'Video' ? 'https://youtube.com/watch?v=mock' : 'study_material.' + notesForm.type.toLowerCase()
    });
    setShowAddNotes(false);
    setNotesForm({ title: '', description: '', subject: teacherSubject, class: 'Class 10', chapter: 'Chapter 5', type: 'PDF' });
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
              { id: 'Circulars', icon: FileText, label: 'Class Announcements' }
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
      <div className="flex-1 space-y-6">
        
        {/* Dashboard Tab */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Teacher Dashboard</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            {/* Quick widgets */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Students</h4>
                <h3 className="text-2xl font-extrabold mt-1">{students.length} Pupils</h3>
                <p className="text-[10px] text-blue-500 font-semibold mt-1">Class 10 (Sections A & B)</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Homeworks Tracked</h4>
                <h3 className="text-2xl font-extrabold mt-1">{homework.length} Assignments</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">Physics & Mathematics</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scheduled Live Sessions</h4>
                <h3 className="text-2xl font-extrabold mt-1">{liveClasses.length} Today</h3>
                <p className="text-[10px] text-indigo-500 font-semibold mt-1">Simulated Zoom link enabled</p>
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
            <h2 className="text-2xl font-extrabold font-montserrat">Mark Student Attendance</h2>
            
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
                className="px-3 py-1 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
              />

              <button
                onClick={handleInitializeAttendance}
                className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg ml-auto"
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
                        <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                          <th className="p-4">Student Name</th>
                          <th className="p-4 text-center">Present</th>
                          <th className="p-4 text-center">Absent</th>
                          <th className="p-4 text-center">Leave</th>
                          <th className="p-4 text-center">Half Day</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150/40 dark:divide-slate-850 font-light">
                        {activeStudents.map((stud) => (
                          <tr key={stud.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="p-4 font-bold text-slate-900 dark:text-white">{stud.name} ({stud.id})</td>
                            <td className="p-4 text-center">
                              <input 
                                type="radio" name={`att_${stud.id}`} 
                                checked={attendanceSheet[stud.id] === 'Present'}
                                onChange={() => setAttendanceSheet(prev => ({ ...prev, [stud.id]: 'Present' }))}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                              />
                            </td>
                            <td className="p-4 text-center">
                              <input 
                                type="radio" name={`att_${stud.id}`}
                                checked={attendanceSheet[stud.id] === 'Absent'}
                                onChange={() => setAttendanceSheet(prev => ({ ...prev, [stud.id]: 'Absent' }))}
                                className="w-4 h-4 text-red-600 focus:ring-red-500"
                              />
                            </td>
                            <td className="p-4 text-center">
                              <input 
                                type="radio" name={`att_${stud.id}`}
                                checked={attendanceSheet[stud.id] === 'Leave'}
                                onChange={() => setAttendanceSheet(prev => ({ ...prev, [stud.id]: 'Leave' }))}
                                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                              />
                            </td>
                            <td className="p-4 text-center">
                              <input 
                                type="radio" name={`att_${stud.id}`}
                                checked={attendanceSheet[stud.id] === 'Half Day'}
                                onChange={() => setAttendanceSheet(prev => ({ ...prev, [stud.id]: 'Half Day' }))}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  onClick={handleSaveAttendance}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Save Class Attendance Log
                </button>
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
                    marksMap[s.id] = '90';
                    remarksMap[s.id] = 'Excellent progress.';
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
                    <table className="w-full text-xs text-left">
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
                    <span className="text-[10px] text-red-500 font-semibold">Due: {hw.dueDate}</span>
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
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'Live' ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-slate-100 text-slate-500 dark:bg-slate-900'
                      }`}>{item.status}</span>
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
                  <div className="sm:col-span-2">
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
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
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
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded">{getSubjectName(note.subject)} • {note.class}</span>
                      <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">{note.type}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">{note.title}</h4>
                    <p className="text-[10px] text-slate-450 mt-1">{note.chapter}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-light mt-2">{note.description}</p>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between items-center text-[10px] text-slate-400">
                    <span>File: {note.file || 'notes_material.pdf'}</span>
                    <span>Downloads: {note.downloads || 0}</span>
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
                    <span className="text-[10px] text-slate-400 font-mono">{notice.date}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{notice.title}</h4>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-light">{notice.content}</p>
                </div>
              ))}
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
