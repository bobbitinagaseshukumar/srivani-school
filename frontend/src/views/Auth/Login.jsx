import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, UserCheck, Key, RefreshCcw, Eye, EyeOff, Sparkles, ArrowRight, BookOpen, Users, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const { loginUser } = useContext(AppContext);
  const [stage, setStage] = useState('select-role'); // select-role, enter-credentials
  const [role, setRole] = useState('Admin'); // Admin, Student, Parent, Teacher, SuperAdmin
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  // OTP Verification flow mock
  const [otpFlow, setOtpFlow] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper credentials updated to Sri Vani email domains
  const credentialsHelper = {
    Admin: { id: 'admin@srivani.edu', pass: 'admin123' },
    Student: { id: 'S1001', pass: 'student123', name: 'Alice Johnson (Class 10)' },
    Parent: { id: 'P1001', pass: 'parent123', name: 'Robert Johnson (Alice parent)' },
    Teacher: { id: 'T101', pass: 'teacher123', name: 'Dr. David Banner (Physics Faculty)' },
    SuperAdmin: { id: 'super@srivani.edu', pass: 'super123' }
  };

  const handleFillCredentials = () => {
    const helper = credentialsHelper[role];
    if (helper) {
      setEmailOrId(helper.id);
      setPassword(helper.pass);
    }
  };

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    const helper = credentialsHelper[selectedRole];
    if (helper) {
      setEmailOrId(helper.id);
      setPassword(helper.pass);
    } else {
      setEmailOrId('');
      setPassword('');
    }
    setStage('enter-credentials');
    setError('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrId || !password) {
      setError('Please fill in both fields.');
      return;
    }

    const res = loginUser(emailOrId, password, role);
    if (res.success) {
      setOtpFlow(true);
    } else {
      setError(res.message || 'Invalid login coordinates.');
    }
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otpCode === '123456' || otpCode === '1234') {
      setOtpFlow(false);
      onLoginSuccess();
    } else {
      setError('Invalid OTP code. Use 123456 as the mock authorization bypass.');
    }
  };

  return (
    <div 
      className="min-h-[85vh] flex items-center justify-center p-6 text-slate-800 dark:text-slate-100 relative overflow-x-hidden"
      style={{ perspective: '2000px' }}
    >
      
      {/* 3D Floating background elements */}
      <div className="absolute top-12 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float-slow -z-10"></div>
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-fast -z-10"></div>

      {/* 3D Flip Card Deck */}
      <div 
        className="w-full max-w-6xl preserve-3d transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transformStyle: 'preserve-3d',
          opacity: isMounted ? 1 : 0,
          transform: `translateY(${isMounted ? '0px' : '40px'}) rotateX(${isMounted ? '0deg' : '-8deg'}) ${stage === 'enter-credentials' ? 'rotateY(180deg)' : 'rotateY(0deg)'}`
        }}
      >
        
        {/* Front Face: Role Selection */}
        <div className={`backface-hidden w-full transition-all duration-1000 ${
          stage === 'select-role' 
            ? 'relative opacity-100 pointer-events-auto z-10' 
            : 'absolute top-0 left-0 opacity-0 pointer-events-none'
        }`}>
          {/* Stage 1: Role Selection Grid (As requested: asks Admin, Student, or Parent first with 3D cards) */}
          <div className="w-full max-w-6xl space-y-10 text-center relative">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="animate-spin" /> Secure Access Nodes
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-montserrat tracking-tight">
                Select Portal Directory
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-light">
                Choose your profile node to authenticate and access classes, attendance sheets, and academic records.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4" style={{ perspective: '1000px' }}>
              
              {/* Admin Portal Card */}
              <div 
                onClick={() => handleSelectRole('Admin')}
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(59,130,246,0.08)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.2)] hover:rotate-y-6 hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ShieldCheck size={30} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl font-montserrat text-slate-900 dark:text-white mt-2 group-hover:text-blue-500 transition-colors">Admin Portal</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-light leading-relaxed">
                      Manage student enrollments, faculty directories, publish notice board circulars, and review support ticket logs.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Enter Admin Portal <ArrowRight size={14} />
                </div>
              </div>

              {/* Student Portal Card */}
              <div 
                onClick={() => handleSelectRole('Student')}
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(59,130,246,0.08)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.2)] hover:rotate-y-0 hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen size={30} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl font-montserrat text-slate-900 dark:text-white mt-2 group-hover:text-emerald-500 transition-colors">Student Portal</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-light leading-relaxed">
                      Access class timetables, download chapter notes, submit homework assignments, and view performance graphs.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Enter Student Portal <ArrowRight size={14} />
                </div>
              </div>

              {/* Parent Portal Card */}
              <div 
                onClick={() => handleSelectRole('Parent')}
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(59,130,246,0.08)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.2)] hover:rotate-y--6 hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Users size={30} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl font-montserrat text-slate-900 dark:text-white mt-2 group-hover:text-purple-500 transition-colors">Parent Portal</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-light leading-relaxed">
                      Track attendance logs, review child grades and teacher feedback, track school bus location, and pay fees.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Enter Parent Portal <ArrowRight size={14} />
                </div>
              </div>

            </div>

            {/* Row 2: Teacher and Super Admin Portal Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto px-4 pt-4" style={{ perspective: '1000px' }}>
              
              {/* Teacher Portal Card */}
              <div 
                onClick={() => handleSelectRole('Teacher')}
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(245,158,11,0.08)] hover:shadow-[0_25px_50px_rgba(245,158,11,0.2)] hover:rotate-y-6 hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <UserCheck size={30} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl font-montserrat text-slate-900 dark:text-white mt-2 group-hover:text-amber-500 transition-colors">Teacher Portal</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-light leading-relaxed">
                      Access class registers, manage student attendances, log grades, configure assignments, and launch virtual classes.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Enter Teacher Portal <ArrowRight size={14} />
                </div>
              </div>

              {/* Super Admin Portal Card */}
              <div 
                onClick={() => handleSelectRole('SuperAdmin')}
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(244,63,94,0.08)] hover:shadow-[0_25px_50px_rgba(244,63,94,0.2)] hover:rotate-y--6 hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ShieldAlert size={30} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl font-montserrat text-slate-900 dark:text-white mt-2 group-hover:text-rose-500 transition-colors">Super Admin Portal</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-light leading-relaxed">
                      System settings, multi-school directory dashboards, audit logs, billing reports, and global configurations.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Enter Super Admin Portal <ArrowRight size={14} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Back Face: Login Credentials */}
        <div className={`backface-hidden w-full rotate-y-180 transition-all duration-1000 ${
          stage === 'enter-credentials' 
            ? 'relative opacity-100 pointer-events-auto z-10' 
            : 'absolute top-0 left-0 opacity-0 pointer-events-none'
        }`}>
          {/* Stage 2: Login form for selected role */}
          <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-center relative">
            
            {/* Credentials Helper Side Panel */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="glassmorphism p-6 rounded-3xl border border-white/50 shadow-xl space-y-4">
                <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  <Sparkles size={12} /> Test Credentials Helper
                </div>
                <h3 className="font-extrabold text-lg font-montserrat">Autofill Guide</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  We pre-populated verification IDs for easy review. Click below to load parameters instantly.
                </p>

                {credentialsHelper[role] ? (
                  <div 
                    onClick={handleFillCredentials}
                    className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 cursor-pointer hover:bg-blue-600/15 transition-all space-y-2"
                  >
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 flex justify-between">
                      <span>Load {role} Credentials</span>
                      <span className="text-[10px] font-mono">Autofill 🔑</span>
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-350 font-mono">
                      ID: <strong>{credentialsHelper[role].id}</strong> <br />
                      Password: <strong>{credentialsHelper[role].pass}</strong>
                    </p>
                    {credentialsHelper[role].name && (
                      <p className="text-[9px] text-slate-400 italic">Target: {credentialsHelper[role].name}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No credentials loaded for role: {role}</p>
                )}

                <button
                  onClick={() => setStage('select-role')}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Back to Role Selection
                </button>
              </div>
            </div>

            {/* Login Credentials Box */}
            <div className="lg:col-span-7">
              <div className="glassmorphism rounded-3xl p-6 lg:p-10 shadow-2xl border border-white/50 text-left relative overflow-hidden">
                
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-extrabold font-montserrat tracking-tight flex items-center gap-2">
                      <ShieldCheck className="text-blue-600" size={26} /> {role === 'SuperAdmin' ? 'Super Admin' : role} Portal Login
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                      Provide secure credentials below to access class assets and files.
                    </p>
                  </div>
                  <button 
                    onClick={() => setStage('select-role')}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Change Role
                  </button>
                </div>

                {/* Toggle for Teacher vs SuperAdmin */}
                {(role === 'Teacher' || role === 'SuperAdmin') && (
                  <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                    <button 
                      type="button" 
                      onClick={() => handleSelectRole('Teacher')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        role === 'Teacher' 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      Teacher Portal
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleSelectRole('SuperAdmin')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        role === 'SuperAdmin' 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      Super Admin Portal
                    </button>
                  </div>
                )}

                {error && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 p-3 rounded-xl text-xs font-medium">
                    {error}
                  </div>
                )}

                {!otpFlow ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Account Coordinates Input */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">
                        {role === 'Admin' || role === 'SuperAdmin' ? 'Admin Email Address' : 
                         role === 'Teacher' ? 'Faculty Employee ID' : 
                         role === 'Student' ? 'Student Register Number' : 'Parent Registration ID'}
                      </label>
                      <input
                        type="text"
                        required
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter your ${role === 'Admin' || role === 'SuperAdmin' ? 'email' : 'portal ID'}`}
                      />
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Portal Access Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-2 flex justify-between items-center gap-4">
                      <button
                        type="button"
                        onClick={handleFillCredentials}
                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <RefreshCcw size={12} /> Autofill Selected Credentials
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-1"
                      >
                        Verify Credentials <ArrowRight size={14} />
                      </button>
                    </div>
                  </form>
                ) : (
                  /* OTP Verification Mockup Card */
                  <form onSubmit={handleOtpVerify} className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl space-y-1 text-xs">
                      <p className="font-bold text-blue-800 dark:text-blue-300">2-Factor Authentication Code Sent</p>
                      <p className="text-slate-500 dark:text-slate-400 font-light">
                        We simulated a secure MFA verification. Enter the bypass code below.
                      </p>
                      <p className="mt-2 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        🔑 Mock code: Enter <strong>123456</strong> to proceed.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Enter Security Code (OTP)</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full text-center tracking-[12px] text-lg font-bold px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="000000"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => { setOtpFlow(false); setError(''); }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold py-2.5 rounded-xl transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition"
                      >
                        Verify Code
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
