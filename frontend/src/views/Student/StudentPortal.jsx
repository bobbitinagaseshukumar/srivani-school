import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { BookOpen, Calendar, Clipboard, Download, GraduationCap, LayoutDashboard, Award, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

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

export default function StudentPortal() {
  const { currentUser, students, teachers, homework, submitHomework, notes, marks, circulars, liveClasses, timetables, logoutUser, subjects, studentComplaints, submitStudentComplaint } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [complaintForm, setComplaintForm] = useState({ subject: '', description: '' });
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const getSubjectName = (code) => {
    if (!code) return '';
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'FREE PERIOD') return 'Free Period';
    const found = subjects ? subjects.find(s => s.code.toUpperCase() === cleanCode) : null;
    return found ? found.name : code;
  };

  const studentObj = students.find(s => s.id === currentUser.id);

  if (!studentObj) {
    return <div className="p-8 text-center">Student record not found in system state.</div>;
  }

  // Filter homework assigned to student's class
  const classHw = homework.filter(h => h.class === studentObj.class);
  
  // Filter notes assigned to student's class
  const classNotes = notes.filter(n => n.class === studentObj.class);

  // Student grades
  const studentMarks = marks.filter(m => m.studentId === studentObj.id);

  // Dynamic Timetable matching class from Super Admin
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timetable = daysOfWeek.map(d => {
    const matched = timetables ? timetables.find(t => t.class === studentObj.class && t.day === d) : null;
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
            {[
              { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'Marks', icon: Award, label: 'Academic Grades' },
              { id: 'Homework', icon: Clipboard, label: 'Homework Desk' },
              { id: 'Notes', icon: Download, label: 'Study Resources' },
              { id: 'Timetable', icon: Calendar, label: 'Class Timetable' },
              { id: 'Complaints', icon: ShieldAlert, label: 'Complaint Box' }
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
          Logout Student Panel
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
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
          </div>
        )}

        {/* Academic Grades Tab */}
        {activeTab === 'Marks' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat font-poppins">Your Examination Grades</h2>

            {/* Performance Graphs (SVG chart) */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850">
              <h4 className="font-extrabold text-sm mb-4">Subject-wise Score Analysis</h4>
              <div className="h-40 w-full flex items-end justify-between px-6 pt-4">
                {studentMarks.map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-20">
                    <div className="w-8 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md transition-all" style={{ height: `${m.marks * 1.2}px` }}></div>
                    <span className="text-[10px] text-slate-900 dark:text-white font-bold">{m.marks}%</span>
                    <span className="text-[9px] text-slate-400">{getSubjectName(m.subject)}</span>
                  </div>
                ))}
                {studentMarks.length === 0 && (
                  <div className="w-full text-center text-slate-450 text-xs font-light py-8">
                    No grade reports uploaded for this academic term yet.
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
                    {studentMarks.map((m) => (
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
          <div className="space-y-6">
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
                  <button
                    onClick={() => alert(`Beginning download stream for local file: ${item.file}`)}
                    className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shrink-0"
                  >
                    <Download size={18} />
                  </button>
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
                    ? Math.max(4, ...timetables.filter(t => t.class === studentObj.class).map(t => t.slots ? t.slots.length : 0)) 
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
                              return timetables && timetables.some(t => t.class === studentObj.class && t.day === d && t.slots && t.slots.some(slot => {
                                const parsed = parseSlot(slot);
                                return parsed.subject && parsed.subject !== 'FREE PERIOD' && parsed.subject !== '';
                              }));
                            }
                            return true;
                          })
                          .map(d => {
                            const matched = timetables ? timetables.find(t => t.class === studentObj.class && t.day === d) : null;
                            
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

        {activeTab === 'Complaints' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Student Complaint Box</h2>
            <p className="text-xs text-slate-500">Submit school-related grievances directly to the Super Admin.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!complaintForm.subject || !complaintForm.description) return;
                submitStudentComplaint({
                  studentId: studentObj.id,
                  subject: complaintForm.subject,
                  description: complaintForm.description
                });
                setComplaintForm({ subject: '', description: '' });
                setComplaintSubmitted(true);
                setTimeout(() => setComplaintSubmitted(false), 3000);
              }}
              className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-lg space-y-4 max-w-xl"
            >
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">Complaint Subject</label>
                <input
                  required
                  value={complaintForm.subject}
                  onChange={(e) => setComplaintForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs"
                  placeholder="Brief subject of your complaint"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">Complaint Description</label>
                <textarea
                  required
                  rows={4}
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs"
                  placeholder="Describe the issue in detail..."
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                Submit Complaint to Super Admin
              </button>
              {complaintSubmitted && (
                <p className="text-xs text-emerald-600 font-semibold">Complaint submitted successfully.</p>
              )}
            </form>

            <div className="space-y-3">
              <h3 className="font-bold text-sm">Your Complaint History</h3>
              {(studentComplaints || []).filter(c => c.studentId === studentObj.id || c.registerNo === studentObj.registerNo).length === 0 ? (
                <p className="text-xs text-slate-400">No complaints submitted yet.</p>
              ) : (
                (studentComplaints || []).filter(c => c.studentId === studentObj.id || c.registerNo === studentObj.registerNo).map(c => (
                  <div key={c.id} className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-bold text-slate-900 dark:text-white">{c.subject}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600' :
                        c.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-blue-500/10 text-blue-600'
                      }`}>{c.status}</span>
                    </div>
                    <p className="text-slate-500">{c.description}</p>
                    <p className="text-[9px] text-slate-400">Submitted: {c.submittedAt}</p>
                    {c.adminReply && (
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-2 text-[10px]">
                        <strong>Super Admin Reply:</strong> {c.adminReply}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
