import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckSquare, Upload, Clipboard, BookOpen, Layers, Plus, Users, Award, Calendar, AlertCircle, FileText } from 'lucide-react';

export default function TeacherPortal() {
  const { 
    currentUser, students, attendance, markAttendance,
    marks, uploadMarks,
    homework, createHomework, evaluateHomework,
    notes, createNotes,
    circulars, createCircular,
    liveClasses, createLiveClass,
    logoutUser 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Attendance grid tracking state (studentId -> status)
  const [attendanceSheet, setAttendanceSheet] = useState({});

  // Marks upload forms
  const [examType, setExamType] = useState('mid 1');
  const [subjectSelected, setSubjectSelected] = useState('PHYSICS');
  const [marksSheet, setMarksSheet] = useState({}); // studentId -> marks
  const [remarksSheet, setRemarksSheet] = useState({}); // studentId -> remark

  // Homework creator state
  const [showAddHw, setShowAddHw] = useState(false);
  const [hwForm, setHwForm] = useState({ title: '', description: '', subject: 'PHYSICS', class: 'Class 10', section: 'A', dueDate: '' });

  // Notes upload creator state
  const [showAddNotes, setShowAddNotes] = useState(false);
  const [notesForm, setNotesForm] = useState({ title: '', description: '', subject: 'PHYSICS', class: 'Class 10', chapter: 'Chapter 5', type: 'PDF' });

  // Class circular state
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });

  // Live Class Creator state
  const [showAddLiveClass, setShowAddLiveClass] = useState(false);
  const [liveForm, setLiveForm] = useState({ subject: 'PHYSICS', title: '', startTime: '11:00 AM', duration: '45 Mins', meetingLink: 'https://meet.google.com/abc-defg-hij' });

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
    setHwForm({ title: '', description: '', subject: 'PHYSICS', class: 'Class 10', section: 'A', dueDate: '' });
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
    setLiveForm({ subject: 'PHYSICS', title: '', startTime: '11:00 AM', duration: '45 Mins', meetingLink: 'https://meet.google.com/abc-defg-hij' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-slate-800 dark:text-slate-100 text-left flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="glassmorphism p-5 rounded-3xl border border-white/50 shadow-md">
          <div className="space-y-1 mb-6">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Faculty Desk</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 font-mono">ID: {currentUser.id}</p>
          </div>

          <nav className="flex flex-col gap-1.5 text-xs font-semibold">
            {[
              { id: 'Dashboard', icon: Layers, label: 'Today Summary' },
              { id: 'Attendance', icon: CheckSquare, label: 'Mark Attendance' },
              { id: 'Marks', icon: Award, label: 'Upload Marks' },
              { id: 'Homework', icon: Clipboard, label: 'Homework Desk' },
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
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850 space-y-4">
              <h3 className="font-extrabold text-sm">Today's Class Schedule</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs font-light">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white">Physics Lab Lecture</p>
                  <p className="text-[10px] text-slate-400">Class 10-A | 09:30 AM - 10:15 AM</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white">Mathematics Homework Review</p>
                  <p className="text-[10px] text-slate-400">Class 10-B | 11:30 AM - 12:15 PM</p>
                </div>
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
                placeholder="Subject (e.g. SANSKRIT, PHYSICS)"
                value={subjectSelected} 
                onChange={(e) => setSubjectSelected(e.target.value)}
                list="subjects-list"
                className="px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 w-56 font-bold"
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
                    value={hwForm.subject}
                    onChange={(e) => setHwForm(prev => ({ ...prev, subject: e.target.value }))}
                    list="subjects-list"
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
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
                      <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded uppercase">{hw.subject} • {hw.class}</span>
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
                    type="text" required placeholder="Subject (e.g. PHYSICS)"
                    value={liveForm.subject}
                    onChange={(e) => setLiveForm(prev => ({ ...prev, subject: e.target.value }))}
                    list="subjects-list"
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
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
                      <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">{item.subject} • {item.class}</span>
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
        <option value="SANSKRIT" />
        <option value="ENGLISH" />
        <option value="TELUGU" />
        <option value="HINDI" />
        <option value="GENERAL SCIENCE" />
        <option value="DRAWING" />
        <option value="MATHEMATICS" />
        <option value="YOGA TRAINING" />
        <option value="PHYSICS" />
        <option value="CHEMISTRY" />
        <option value="GENERALKNOWLEDGE" />
      </datalist>
    </div>
  );
}
