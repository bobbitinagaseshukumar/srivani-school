import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, Plus, ToggleLeft, ToggleRight, Building, CheckCircle2, DollarSign, Activity, Settings, UserCheck } from 'lucide-react';

export default function SuperAdminPortal() {
  const { schools, toggleSchoolStatus, auditLogs, logoutUser } = useContext(AppContext);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [activeTab, setActiveTab] = useState('Schools');

  const [newSchool, setNewSchool] = useState({ name: '', code: '', address: '', studentsCount: 0, teachersCount: 0 });

  const systemMetrics = [
    { label: 'Active Clusters', value: '3 Nodes Online', icon: Activity, color: 'text-emerald-500' },
    { label: 'Database Replication', value: '100% Synced', icon: CheckCircle2, color: 'text-blue-500' },
    { label: 'Platform Revenue (Monthly)', value: '$12,450', icon: DollarSign, color: 'text-amber-500' },
    { label: 'SaaS Customer Base', value: '3 Registered Campuses', icon: Building, color: 'text-purple-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 text-slate-800 dark:text-slate-100 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold font-montserrat flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={32} /> Super Admin Control Network
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">Global Multi-School Database Operations & SaaS Subscription Billing Center.</p>
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
            <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center ${met.color} shrink-0`}>
              <met.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{met.label}</p>
              <h3 className="font-extrabold text-base mt-0.5 text-slate-900 dark:text-white">{met.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200/50 dark:border-slate-800 pb-3 mb-6">
        {['Schools', 'Billing Plans', 'Audit Logs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-blue-600 text-white shadow' 
                : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Area */}
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
                  type="text" 
                  placeholder="School Name"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <input 
                  type="text" 
                  placeholder="School Code"
                  value={newSchool.code}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, code: e.target.value }))}
                  className="px-3 py-2 border rounded-xl bg-white/70 dark:bg-slate-900/50 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <input 
                type="text" 
                placeholder="Full Address"
                value={newSchool.address}
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

          {/* School Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((sch) => (
              <div 
                key={sch.id} 
                className="bg-white dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2.5 py-0.5 rounded-full">{sch.code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      sch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {sch.status}
                    </span>
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

                <div className="border-t border-slate-100 dark:border-slate-850 pt-3 mt-4 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">Tenant Management:</span>
                  <button 
                    onClick={() => toggleSchoolStatus(sch.id)}
                    className="text-xs font-bold flex items-center gap-1 text-blue-600 dark:text-blue-400"
                  >
                    {sch.status === 'Active' ? (
                      <span className="flex items-center gap-1 text-red-500"><ToggleRight size={22} /> Suspend Tenant</span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-500"><ToggleLeft size={22} /> Activate Tenant</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Billing Plans' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg font-montserrat">Active SaaS Subscription Packages</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="glassmorphism p-6 rounded-2xl border border-white/40 shadow-lg space-y-4">
              <div>
                <span className="text-[9px] bg-slate-100 dark:bg-slate-900 font-bold px-2 py-0.5 rounded uppercase">Basic School</span>
                <h4 className="font-extrabold text-xl mt-2">$299<span className="text-xs text-slate-400">/month</span></h4>
                <p className="text-[10px] text-slate-500 mt-1">Up to 200 students, standard dashboard portals, manual backup.</p>
              </div>
              <ul className="text-[10px] space-y-1.5 text-slate-500 border-t pt-3 font-light">
                <li className="flex gap-1 items-center">✅ Full portals layout</li>
                <li className="flex gap-1 items-center">✅ Basic report card generator</li>
                <li className="flex gap-1 items-center">❌ AI predictive metrics</li>
                <li className="flex gap-1 items-center">❌ Face recognition modules</li>
              </ul>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-blue-500/30 space-y-4 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-blue-600 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Most Popular</div>
              <div>
                <span className="text-[9px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded uppercase">Academy Premium</span>
                <h4 className="font-extrabold text-xl mt-2">$499<span className="text-xs text-slate-400">/month</span></h4>
                <p className="text-[10px] text-slate-400 mt-1 font-light">Up to 1,000 students, auto-backups, GPS transit tracking, and QR ID cards.</p>
              </div>
              <ul className="text-[10px] space-y-1.5 text-slate-400 border-t border-slate-800 pt-3 font-light">
                <li className="flex gap-1 items-center">✅ Includes GPS Transit alerts</li>
                <li className="flex gap-1 items-center">✅ QR Code Generator</li>
                <li className="flex gap-1 items-center">✅ Automated database cron</li>
                <li className="flex gap-1 items-center">❌ Face recognition attendance</li>
              </ul>
            </div>

            <div className="glassmorphism p-6 rounded-2xl border border-white/40 shadow-lg space-y-4">
              <div>
                <span className="text-[9px] bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded uppercase">Enterprise Max</span>
                <h4 className="font-extrabold text-xl mt-2">$899<span className="text-xs text-slate-400">/month</span></h4>
                <p className="text-[10px] text-slate-500 mt-1">Unlimited capacity. AI Performance Forecast, Live classes, Face Recognition modules.</p>
              </div>
              <ul className="text-[10px] space-y-1.5 text-slate-500 border-t pt-3 font-light">
                <li className="flex gap-1 items-center">✅ Full AI Predictions dashboard</li>
                <li className="flex gap-1 items-center">✅ Face recognition biometric</li>
                <li className="flex gap-1 items-center">✅ Live Class Zoom integrations</li>
                <li className="flex gap-1 items-center">✅ 24/7 dedicated system agent</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Audit Logs' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg font-montserrat">Global System Audit Logs</h3>
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
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
  );
}
