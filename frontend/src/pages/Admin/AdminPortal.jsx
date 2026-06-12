import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, GraduationCap, Calendar, FileText, Settings, Heart, Plus, Trash2, Edit, CheckSquare, Search, Award, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminPortal() {
  const { 
    students, addStudent, editStudent, deleteStudent,
    teachers, addTeacher, editTeacher, deleteTeacher,
    circulars, createCircular,
    supportTickets, replySupportTicket,
    auditLogs, logoutUser 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [studentSearch, setStudentSearch] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');

  // Form states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddCircular, setShowAddCircular] = useState(false);

  const [studentForm, setStudentForm] = useState({ name: '', dob: '', gender: '', class: 'Class 10', section: 'A', parentName: '', parentPhone: '', address: '' });
  const [teacherForm, setTeacherForm] = useState({ name: '', qualification: '', experience: '5 Years', subject: 'SANSKRIT', department: 'Mathematics', email: '', phone: '', designation: 'Senior Teacher', salary: 5000, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' });
  const [circularForm, setCircularForm] = useState({ title: '', content: '', targetGroup: 'All' });
  const [selectedStudentForID, setSelectedStudentForID] = useState(null);

  // Helpdesk ticket response state
  const [ticketReplyText, setTicketReplyText] = useState({});

  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.parentPhone) return;
    addStudent({
      ...studentForm,
      rollNo: String(100 + students.length + 1),
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    });
    setStudentForm({ name: '', dob: '', gender: '', class: 'Class 10', section: 'A', parentName: '', parentPhone: '', address: '' });
    setShowAddStudent(false);
  };

  const handleAddTeacherSubmit = (e) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.email) return;
    addTeacher(teacherForm);
    setTeacherForm({ name: '', qualification: '', experience: '5 Years', subject: 'Mathematics', department: 'Mathematics', email: '', phone: '', designation: 'Senior Teacher', salary: 5000, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' });
    setShowAddTeacher(false);
  };

  const handleAddCircularSubmit = (e) => {
    e.preventDefault();
    if (!circularForm.title || !circularForm.content) return;
    createCircular(circularForm);
    setCircularForm({ title: '', content: '', targetGroup: 'All' });
    setShowAddCircular(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-slate-800 dark:text-slate-100 text-left flex flex-col lg:flex-row gap-8">
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
              { id: 'Students', icon: Users, label: 'Manage Students' },
              { id: 'Teachers', icon: GraduationCap, label: 'Manage Teachers' },
              { id: 'Circulars', icon: FileText, label: 'Notice & Announcements' },
              { id: 'Helpdesk', icon: MessageSquare, label: 'Helpdesk Tickets' },
              { id: 'Settings', icon: Settings, label: 'System Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSelectedStudentForID(null); }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow' 
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
                <p className="text-[10px] text-blue-500 font-semibold mt-1">4 Specialized Departments</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average School Attendance</p>
                <h3 className="text-3xl font-extrabold font-montserrat mt-1">93.2%</h3>
                <p className="text-[10px] text-amber-500 font-semibold mt-1">Calculated this week</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Term Fees Collections</p>
                <h3 className="text-3xl font-extrabold font-montserrat mt-1">$48,200</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">82% Payments Settled</p>
              </div>
            </div>

            {/* Simulated Charts layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850">
                <h4 className="font-extrabold text-sm mb-4">Class-wise Performance Average</h4>
                {/* SVG Mock chart */}
                <div className="h-40 w-full flex items-end justify-between px-4">
                  {[
                    { grade: 'Class 5', pct: '78%' },
                    { grade: 'Class 9', pct: '92%' },
                    { grade: 'Class 10', pct: '84%' }
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

        {/* Student Management Tab */}
        {activeTab === 'Students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Student Directory</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Enroll, edit profiles, generate ID cards, and delete records.</p>
              </div>
              <button 
                onClick={() => setShowAddStudent(!showAddStudent)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus size={16} /> Enroll New Student
              </button>
            </div>

            {/* Add Student Form */}
            {showAddStudent && (
              <form onSubmit={handleAddStudentSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-2xl">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Enrollment Application</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    type="text" required placeholder="Student Full Name"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="date" required
                    value={studentForm.dob}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, dob: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <select
                    value={studentForm.class}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, class: e.target.value }))}
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
                    value={studentForm.section}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, section: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Parent Full Name"
                    value={studentForm.parentName}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, parentName: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="tel" required placeholder="Parent Phone Contact"
                    value={studentForm.parentPhone}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <input 
                  type="text" placeholder="Home Street Address"
                  value={studentForm.address}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Confirm Enrollment
                </button>
              </form>
            )}

            {/* Search Input */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search students by name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Student Table */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="p-4">Student</th>
                      <th className="p-4">Reg / Roll</th>
                      <th className="p-4">Class</th>
                      <th className="p-4">Parent details</th>
                      <th className="p-4">Avg Attendance</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                    {students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase())).map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={student.photo} alt={student.name} className="w-8 h-8 rounded-full object-cover border" />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{student.name}</p>
                              <p className="text-[9px] text-slate-400">{student.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[10px]">
                          <p>{student.registerNo}</p>
                          <p className="text-slate-400">Roll: #{student.rollNo}</p>
                        </td>
                        <td className="p-4 font-semibold">{student.class} - {student.section}</td>
                        <td className="p-4">
                          <p className="font-medium">{student.parentName}</p>
                          <p className="text-slate-400 text-[10px]">{student.parentPhone}</p>
                        </td>
                        <td className="p-4 font-mono">
                          <span className={`font-semibold ${student.attendancePct < 90 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                            {student.attendancePct}%
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => setSelectedStudentForID(student)}
                              className="bg-blue-500/10 hover:bg-blue-500/25 text-blue-600 text-[10px] font-bold px-2 py-1 rounded"
                            >
                              Generate ID Card
                            </button>
                            <button 
                              onClick={() => deleteStudent(student.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Generated ID Card Preview Modal */}
            {selectedStudentForID && (
              <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-indigo-500/30 text-center space-y-6 relative overflow-hidden">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
                  
                  <div className="flex justify-between items-center border-b border-indigo-500/20 pb-3">
                    <div>
                      <h4 className="font-extrabold text-xs tracking-wider font-montserrat">SRI VANI VIDYANIKETHAN</h4>
                      <p className="text-[8px] text-indigo-400 uppercase tracking-widest">Student Identity Card</p>
                    </div>
                    <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">Valid 2026-27</span>
                  </div>

                  <div className="space-y-3">
                    <img 
                      src={selectedStudentForID.photo} 
                      alt={selectedStudentForID.name} 
                      className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-indigo-500/40 shadow-md"
                    />
                    <div>
                      <h3 className="font-extrabold text-base tracking-wide">{selectedStudentForID.name}</h3>
                      <p className="text-[10px] text-indigo-300 font-semibold">{selectedStudentForID.class} - Section {selectedStudentForID.section}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-indigo-950/60 p-3 rounded-2xl border border-indigo-500/10 text-left text-[9px] font-mono">
                    <div>
                      <span className="text-indigo-400">REGISTER NO:</span>
                      <p className="font-bold">{selectedStudentForID.registerNo}</p>
                    </div>
                    <div>
                      <span className="text-indigo-400">ROLL NUMBER:</span>
                      <p className="font-bold">#{selectedStudentForID.rollNo}</p>
                    </div>
                    <div>
                      <span className="text-indigo-400">DOB:</span>
                      <p className="font-bold">{selectedStudentForID.dob}</p>
                    </div>
                    <div>
                      <span className="text-indigo-400">BLOOD GRP:</span>
                      <p className="font-bold">{selectedStudentForID.bloodGroup || 'O+'}</p>
                    </div>
                  </div>

                  {/* QR Code Graphic Placeholder */}
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white p-1 rounded-lg shadow flex items-center justify-center">
                      {/* Visual QR Simulator */}
                      <div className="w-14 h-14 border-4 border-slate-900 bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%)] bg-[size:6px_6px]"></div>
                    </div>
                    <p className="text-[8px] text-slate-400">Scan QR Code for Biometric Bi-pass</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Print layout dispatched to default Windows PDF spooler.")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl transition"
                    >
                      Print ID Card
                    </button>
                    <button 
                      onClick={() => setSelectedStudentForID(null)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 rounded-xl transition"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Teacher Management Tab */}
        {activeTab === 'Teachers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Faculty Management</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Add teachers, assign subjects/salary, and manage employee directories.</p>
              </div>
              <button 
                onClick={() => setShowAddTeacher(!showAddTeacher)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus size={16} /> Add New Teacher
              </button>
            </div>

            {/* Add Teacher Form */}
            {showAddTeacher && (
              <form onSubmit={handleAddTeacherSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-2xl">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Add Faculty Member</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    type="text" required placeholder="Teacher Full Name"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="text" placeholder="Designation (e.g. Senior Teacher)"
                    value={teacherForm.designation}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, designation: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <input 
                    type="text" required placeholder="Qualification (e.g. M.Sc. Math)"
                    value={teacherForm.qualification}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, qualification: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="text"
                    placeholder="Subject Assigned"
                    value={teacherForm.subject}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, subject: e.target.value }))}
                    list="subjects-list"
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                  <select
                    value={teacherForm.department}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, department: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <input 
                    type="email" required placeholder="Email Address"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="tel" placeholder="Contact Number"
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <input 
                    type="number" placeholder="Monthly Salary ($)"
                    value={teacherForm.salary}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                    className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Register Faculty Member
                </button>
              </form>
            )}

            {/* Search Input */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search teachers by name..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Teachers Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {teachers.filter(t => t.name.toLowerCase().includes(teacherSearch.toLowerCase())).map((teacher) => (
                <div key={teacher.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-lg flex gap-4">
                  <img src={teacher.photo} alt={teacher.name} className="w-16 h-16 rounded-xl object-cover shrink-0 border" />
                  <div className="space-y-1 text-xs font-light flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">{teacher.name}</h4>
                      <button 
                        onClick={() => deleteTeacher(teacher.id)}
                        className="text-red-500 hover:text-red-600 shrink-0 ml-2"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">{teacher.designation} (ID: {teacher.id})</p>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">{teacher.subject} • {teacher.qualification}</p>
                    <p className="text-[10px]">Email: {teacher.email}</p>
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-350">Monthly Salary: ${teacher.salary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Circulars/Notices Tab */}
        {activeTab === 'Circulars' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold font-montserrat">Notice Board Management</h2>
                <p className="text-xs text-slate-400 font-light mt-1">Post official announcements and circular notifications.</p>
              </div>
              <button 
                onClick={() => setShowAddCircular(!showAddCircular)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus size={16} /> Publish New Notice
              </button>
            </div>

            {/* Add Circular Form */}
            {showAddCircular && (
              <form onSubmit={handleAddCircularSubmit} className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-lg space-y-4 max-w-xl">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Notice parameters</h3>
                <input 
                  type="text" required placeholder="Notice Title"
                  value={circularForm.title}
                  onChange={(e) => setCircularForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <textarea 
                  rows={4} required placeholder="Post description content..."
                  value={circularForm.content}
                  onChange={(e) => setCircularForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                ></textarea>
                <select
                  value={circularForm.targetGroup}
                  onChange={(e) => setCircularForm(prev => ({ ...prev, targetGroup: e.target.value }))}
                  className="px-3.5 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                >
                  <option value="All">All Audiences</option>
                  <option value="Teachers">Teachers Only</option>
                  <option value="Students">Students Only</option>
                  <option value="Parents">Parents Only</option>
                </select>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Publish Notice Board
                </button>
              </form>
            )}

            {/* Notices List */}
            <div className="space-y-4">
              {circulars.map((notice) => (
                <div key={notice.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded uppercase">{notice.targetGroup} Target</span>
                    <span className="text-[10px] text-slate-400 font-mono">{notice.date}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{notice.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-light">{notice.content}</p>
                  <p className="text-[9px] text-slate-400 italic mt-2">Posted by: {notice.postedBy}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Helpdesk Tickets Tab */}
        {activeTab === 'Helpdesk' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Inquiry Helpdesk Support</h2>
            <p className="text-xs text-slate-400 font-light mt-1">Review parent and student portal complaints. Send responses directly.</p>
            
            <div className="space-y-4">
              {supportTickets.map((tkt) => (
                <div key={tkt.id} className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        tkt.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500 animate-pulse'
                      }`}>
                        {tkt.status}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">{tkt.subject}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{tkt.date}</span>
                  </div>

                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-light bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl">
                    "{tkt.description}"
                  </p>
                  
                  <p className="text-[10px] text-slate-400">
                    Initiator: <strong>{tkt.name}</strong> ({tkt.role})
                  </p>

                  {tkt.status === 'Resolved' ? (
                    <div className="border-t border-slate-100 dark:border-slate-850 pt-2 text-xs font-light text-slate-600 dark:text-slate-450 leading-relaxed">
                      <span className="font-bold text-emerald-650 dark:text-emerald-400">Admin Response:</span> {tkt.response}
                    </div>
                  ) : (
                    <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type reply response..."
                        value={ticketReplyText[tkt.id] || ''}
                        onChange={(e) => setTicketReplyText(prev => ({ ...prev, [tkt.id]: e.target.value }))}
                        className="flex-1 px-3 py-1.5 border rounded-lg bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const rep = ticketReplyText[tkt.id];
                          if (!rep) return;
                          replySupportTicket(tkt.id, rep);
                        }}
                        className="bg-blue-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg"
                      >
                        Reply Ticket
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {supportTickets.length === 0 && (
                <div className="text-center py-12 glassmorphism rounded-2xl text-slate-400 text-xs font-light">
                  No active support tickets recorded.
                </div>
              )}
            </div>
          </div>
        )}

        {/* System settings Tab */}
        {activeTab === 'Settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">System Settings & backups</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            <div className="glassmorphism p-5 rounded-2xl border border-white/50 shadow-md space-y-4">
              <h3 className="font-bold text-sm">Backup Disaster Recovery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                Our platform runs hourly automated backups of MongoDB collections to AWS S3. You can manually force an backup checkpoint here.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => alert("Manual database dump initialized. 12 collections archived in backup-2026-06-12.zip")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <RefreshCw size={14} /> Force System Backup
                </button>
                <button
                  onClick={() => alert("Restored checkpoint backup-2026-06-12.zip successfully in 120ms.")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Restore System Snapshot
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850 space-y-3">
              <h3 className="font-bold text-sm">Recent Audit Log Transactions</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-light max-h-60 overflow-y-auto pr-2">
                {auditLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="py-2.5 flex justify-between items-center text-[11px]">
                    <div>
                      <p className="font-semibold">{log.action}</p>
                      <p className="text-[9px] text-slate-400">User: {log.user} ({log.role})</p>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
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
