import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { LayoutDashboard, Award, Clipboard, ShieldCheck, Mail, DollarSign, Navigation, MessageSquare, Calendar, Sparkles, CheckCircle } from 'lucide-react';

export default function ParentPortal() {
  const { 
    currentUser, students, homework, marks, circulars, 
    transportRoutes, supportTickets, createSupportTicket, 
    logoutUser 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedChildId, setSelectedChildId] = useState('S1001'); // Alice Johnson ID
  
  // Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'Dr. David Banner', text: 'Alice did exceptional work in the electrostatics laboratory experiment.', time: 'Yesterday' }
  ]);

  // Fee payment state
  const [feeStatus, setFeeStatus] = useState('Unpaid');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const childObj = students.find(s => s.id === selectedChildId);

  if (!childObj) {
    return <div className="p-8 text-center text-xs text-red-500">No child records linked to parent session.</div>;
  }

  // Filter metrics
  const childMarks = marks.filter(m => m.studentId === childObj.id);
  const childHw = homework.filter(h => h.class === childObj.class);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage) return;
    setChatHistory(prev => [...prev, { sender: 'Parent', text: chatMessage, time: 'Just now' }]);
    setChatMessage('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: 'Dr. David Banner', text: 'Thank you for your message. I will check Alice\'s workbook and respond shortly.', time: 'Just now' }]);
    }, 2000);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setFeeStatus('Paid');
      setShowPaymentModal(false);
      alert("Payment of $2,100 cleared successfully via secure Stripe Sandbox.");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-slate-800 dark:text-slate-100 text-left flex flex-col lg:flex-row gap-8">
      {/* Sidebar navigation */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="glassmorphism p-5 rounded-3xl border border-white/50 shadow-md space-y-4">
          <div className="space-y-2 pb-4 border-b border-slate-200/50 dark:border-slate-850">
            <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2.5 py-0.5 rounded-full uppercase">Parent Account</span>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 leading-tight">{currentUser.name}</h3>
            <p className="text-[10px] text-slate-400">Child: <strong>{childObj.name}</strong></p>
          </div>

          <nav className="flex flex-col gap-1.5 text-xs font-semibold">
            {[
              { id: 'Dashboard', icon: LayoutDashboard, label: 'Child Overview' },
              { id: 'Analytics', icon: Award, label: 'Performance Analytics' },
              { id: 'Chat', icon: MessageSquare, label: 'Message Faculty' },
              { id: 'Fees', icon: DollarSign, label: 'School Fees Billing' },
              { id: 'BusTracker', icon: Navigation, label: 'Live GPS Bus Tracker' }
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
          Logout Parent Panel
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* Child Overview Tab */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Child Progress Dashboard</h2>
            <div className="w-12 h-1 bg-blue-600 rounded"></div>

            {/* Metrics */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance Percentage</p>
                <h3 className="text-2xl font-extrabold mt-1">{childObj.attendancePct}%</h3>
                <p className="text-[10px] text-emerald-500 font-semibold mt-1">Status: Regular</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Midterm Average Grade</p>
                <h3 className="text-2xl font-extrabold mt-1">A+ (92.8%)</h3>
                <p className="text-[10px] text-blue-500 font-semibold mt-1">Class Rank: #3</p>
              </div>
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Fee Due</p>
                <h3 className="text-2xl font-extrabold mt-1">{feeStatus === 'Unpaid' ? '$2,100' : '$0.00'}</h3>
                <p className="text-[10px] text-red-500 font-semibold mt-1">
                  {feeStatus === 'Unpaid' ? 'Due by: June 30' : 'Settled (Stripe)'}
                </p>
              </div>
            </div>

            {/* Child Homework checklist */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850 space-y-3">
              <h3 className="font-extrabold text-sm">Child homework desk Tasks</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-light">
                {childHw.map(hw => {
                  const sub = hw.submissions.find(s => s.studentId === childObj.id);
                  return (
                    <div key={hw.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{hw.title}</p>
                        <p className="text-[10px] text-slate-400">Subject: {hw.subject} • Due: {hw.dueDate}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        sub ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {sub ? 'Submitted' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics Tab */}
        {activeTab === 'Analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Detailed Progress Analysis</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Strength & weakness areas card */}
              <div className="glassmorphism p-6 rounded-2xl border border-white/40 shadow-lg space-y-4">
                <h4 className="font-bold text-sm text-indigo-950 dark:text-white flex items-center gap-1">
                  <Sparkles size={16} className="text-amber-500" /> AI Diagnostic insights
                </h4>
                
                <div className="space-y-3 text-xs font-light">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">Strong Subjects</p>
                    <p className="text-slate-600 dark:text-slate-350">Mathematics & Computer Coding. Alice shows advanced conceptual reasoning and high task execution.</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                    <p className="font-bold text-amber-700 dark:text-amber-400">Improvement Suggestions</p>
                    <p className="text-slate-600 dark:text-slate-350">Physics numerical testing. Needs to dedicate study hours to electrostatics equation derivations.</p>
                  </div>
                </div>
              </div>

              {/* Monthly percentage trend list */}
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-850 space-y-4">
                <h4 className="font-extrabold text-sm">Monthly Growth Index</h4>
                <div className="space-y-3 text-xs font-light">
                  {[
                    { month: 'March Board Exam', avg: '88.5%', status: 'Improved' },
                    { month: 'April Board Exam', avg: '90.2%', status: 'Improved' },
                    { month: 'May Midterm board', avg: '92.8%', status: 'Constant' }
                  ].map((idxMonth, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2">
                      <span>{idxMonth.month}</span>
                      <div className="flex gap-2 items-center">
                        <span className="font-bold font-mono">{idxMonth.avg}</span>
                        <span className="bg-emerald-500/10 text-emerald-500 text-[9px] px-2 py-0.5 rounded font-bold">{idxMonth.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Parent communication Tab */}
        {activeTab === 'Chat' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Direct Faculty communication</h2>
            
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-800 flex flex-col h-96 justify-between">
              <div className="overflow-y-auto space-y-3 pr-2 flex-1">
                {chatHistory.map((ch, i) => (
                  <div key={i} className={`flex flex-col max-w-sm ${ch.sender === 'Parent' ? 'ml-auto items-end' : 'items-start'}`}>
                    <span className="text-[9px] text-slate-400 font-semibold">{ch.sender} ({ch.time})</span>
                    <p className={`p-2.5 rounded-2xl text-xs leading-relaxed mt-1 font-light ${
                      ch.sender === 'Parent' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-900 text-slate-750 dark:text-slate-300 rounded-tl-none'
                    }`}>
                      {ch.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-slate-100 dark:border-slate-850 pt-3 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask class teacher about child progress..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Fee Payment Billing Tab */}
        {activeTab === 'Fees' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Fee Billing & Payments</h2>
            
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-950 dark:text-white">Academic Term II Tuition Invoice</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Invoice ID: INV-2026-90412 | Date: June 10, 2026</p>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                  feeStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500 animate-pulse'
                }`}>{feeStatus}</span>
              </div>

              <div className="border-y border-slate-100 dark:border-slate-850 py-3 text-xs font-light text-slate-650 dark:text-slate-350 space-y-2">
                <div className="flex justify-between">
                  <span>Tuition & Enrollment Seat:</span>
                  <span className="font-bold">$1,800.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Science Laboratory Activities:</span>
                  <span className="font-bold">$300.00</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-2 font-bold text-slate-900 dark:text-white">
                  <span>Total Bill Amount:</span>
                  <span>$2,100.00</span>
                </div>
              </div>

              {feeStatus === 'Unpaid' && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-all"
                >
                  Pay Invoice online (Stripe Sandbox)
                </button>
              )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
                <form onSubmit={handleCheckoutSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-sm w-full border dark:border-slate-800 text-left space-y-4">
                  <h3 className="font-extrabold text-base tracking-tight font-montserrat">Stripe Card Checkout</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Card Holder Name</label>
                      <input 
                        type="text" required placeholder="Robert Johnson"
                        className="w-full px-3 py-2 border rounded-lg bg-white/70 dark:bg-slate-950 text-xs focus:ring-1"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Card Number</label>
                      <input 
                        type="text" required maxLength={19} placeholder="4242 •••• •••• ••••"
                        className="w-full px-3 py-2 border rounded-lg bg-white/70 dark:bg-slate-950 text-xs focus:ring-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Expiry Date</label>
                        <input 
                          type="text" required maxLength={5} placeholder="MM/YY"
                          className="w-full px-3 py-2 border rounded-lg bg-white/70 dark:bg-slate-950 text-xs focus:ring-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">CVC Code</label>
                        <input 
                          type="password" required maxLength={3} placeholder="•••"
                          className="w-full px-3 py-2 border rounded-lg bg-white/70 dark:bg-slate-950 text-xs focus:ring-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-750 dark:text-slate-300 font-bold text-xs py-2 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={paymentLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl shadow flex items-center justify-center gap-1"
                    >
                      {paymentLoading ? 'Clearing...' : 'Clear $2,100.00'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* GPS Transit tracker Tab */}
        {activeTab === 'BusTracker' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold font-montserrat">Live GPS Transit Tracking</h2>
            <p className="text-xs text-slate-400 font-light mt-1">Track the exact coordinates of the school shuttle bus route on the digital board map.</p>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Route status details */}
              <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-lg space-y-3">
                <h4 className="font-extrabold text-sm">Shuttle Status: Route 44</h4>
                
                <div className="space-y-2 text-xs font-light text-slate-650 dark:text-slate-350">
                  <p>Driver: <strong>{transportRoutes[0].driverName}</strong></p>
                  <p>Contact Phone: {transportRoutes[0].contact}</p>
                  <p>Vehicle Tag: {transportRoutes[0].vehicleNo}</p>
                  <div className="border-t border-slate-150/40 dark:border-slate-800 pt-2 text-[10px] space-y-1">
                    <span className="font-bold text-slate-400">Scheduled Stops:</span>
                    <p>1. Times Square (07:30 AM)</p>
                    <p>2. Central Park East (08:00 AM)</p>
                    <p>3. Grand Central Station (08:15 AM)</p>
                  </div>
                </div>
              </div>

              {/* Transit Map Mockup */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800/60 rounded-2xl p-5 shadow-lg border border-slate-200/50 dark:border-slate-800 flex flex-col justify-center items-center relative overflow-hidden h-72">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
                
                {/* Live updating coordinates */}
                <div className="relative z-10 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md animate-pulse">
                    <Navigation size={18} className="rotate-45" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Active coordinates:</h5>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                      Latitude: {transportRoutes[0].currentLoc.lat.toFixed(6)} N <br />
                      Longitude: {transportRoutes[0].currentLoc.lng.toFixed(6)} W
                    </p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded uppercase">Vehicle moving on route</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
