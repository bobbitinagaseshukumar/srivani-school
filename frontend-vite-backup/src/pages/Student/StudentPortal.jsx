import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { BookOpen, Calendar, Clipboard, Download, GraduationCap, LayoutDashboard, Award, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export default function StudentPortal() {
  const { currentUser, students, homework, submitHomework, notes, marks, circulars, liveClasses, logoutUser } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Dashboard');

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

  // Timetable
  const timetable = [
    { day: 'Monday', slots: ['Physics (09:30 AM)', 'Mathematics (10:30 AM)', 'English (01:00 PM)'] },
    { day: 'Tuesday', slots: ['Computer Science (09:30 AM)', 'Physics Lab (10:30 AM)', 'Mathematics (01:00 PM)'] },
    { day: 'Wednesday', slots: ['Mathematics (09:30 AM)', 'English (10:30 AM)', 'Library Hour (01:00 PM)'] },
    { day: 'Thursday', slots: ['Physics (09:30 AM)', 'Computer Science (10:30 AM)', 'Art & Craft (01:00 PM)'] },
    { day: 'Friday', slots: ['English (09:30 AM)', 'Mathematics (10:30 AM)', 'Weekly Assessment (01:00 PM)'] }
  ];

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
              { id: 'Timetable', icon: Calendar, label: 'Class Timetable' }
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
                    <span className="text-[9px] text-slate-400">{m.subject}</span>
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
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{m.subject}</td>
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
                        <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">{hw.subject}</span>
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
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded">{item.subject} • {item.chapter}</span>
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
            <h2 className="text-2xl font-extrabold font-montserrat">Weekly Academic Timetable</h2>
            
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {timetable.map((t, idx) => (
                  <div key={idx} className="p-4 grid sm:grid-cols-4 gap-4 text-xs items-center">
                    <div className="font-bold text-slate-900 dark:text-white">{t.day}</div>
                    <div className="sm:col-span-3 flex flex-wrap gap-2">
                      {t.slots.map((s, i) => (
                        <span key={i} className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[10px] px-3 py-1.5 rounded-lg border border-slate-200/40 dark:border-slate-800 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
