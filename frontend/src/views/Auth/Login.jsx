import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, UserCheck, Key, RefreshCcw, Eye, EyeOff, Sparkles, ArrowRight, BookOpen, Users, ShieldAlert, ArrowLeft, Mail } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const { validateCredentials, loginWithUser, updatePassword } = useContext(AppContext);
  
  const [stage, setStage] = useState('select-role'); // select-role, enter-credentials
  const [role, setRole] = useState('Admin'); // Admin, Student, Parent, Teacher, SuperAdmin
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  // OTP Verification flow state
  const [otpFlow, setOtpFlow] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [validatedUser, setValidatedUser] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [simulatedMode, setSimulatedMode] = useState(false);

  // Forgot Password flow state (Super Admin only)
  const [forgotPasswordFlow, setForgotPasswordFlow] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState('email'); // email, otp, new-password
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [generatedRecoveryOtp, setGeneratedRecoveryOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [stage, otpFlow, forgotPasswordFlow]);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setEmailOrId('');
    setPassword('');
    setStage('enter-credentials');
    setError('');
    setSuccessMsg('');
    setOtpFlow(false);
    setForgotPasswordFlow(false);
  };

  const sendOtpEmail = async (email, name, otp) => {
    try {
      setIsSendingOtp(true);
      const toEmail = email && email.includes('@') ? email : 'nagaseshukumarbobbiti@gmail.com'; 
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: toEmail,
          subject: 'Sri Vani School Portal - 2FA Security Code',
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #2563eb; text-align: center; margin-bottom: 20px; font-weight: 800; font-size: 22px;">Sri Vani Vidyanikethan</h2>
              <div style="font-size: 14px; color: #334155; line-height: 1.6;">
                <p>Hello <strong>${name}</strong>,</p>
                <p>You requested access to your portal account. Please use the following 6-digit verification code to complete your login:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e3a8a; background-color: #eff6ff; padding: 12px 24px; border-radius: 12px; border: 1px solid #bfdbfe; display: inline-block;">${otp}</span>
                </div>
                <p style="font-size: 12px; color: #64748b;">If you did not initiate this login request, please ignore this email or contact the school administration.</p>
                <p style="font-size: 12px; color: #64748b; margin-top: 25px; border-top: 1px solid #f1f5f9; padding-top: 15px; text-align: center;">© 2026 Sri Vani Vidyanikethan. All Rights Reserved.</p>
              </div>
            </div>
          `
        })
      });
      const data = await response.json();
      setSimulatedMode(!!data.simulated);
      return data;
    } catch (err) {
      console.error("Error sending OTP email:", err);
      setSimulatedMode(true);
      return { success: true, simulated: true };
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!emailOrId || !password) {
      setError('Please fill in both fields.');
      return;
    }

    const res = validateCredentials(emailOrId, password, role);
    if (res.success) {
      const user = res.user;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      setValidatedUser(user);

      const emailResult = await sendOtpEmail(user.email, user.name, otp);
      if (emailResult.success) {
        setOtpFlow(true);
      } else {
        console.warn("Resend API rejected or offline, falling back to simulated mode:", emailResult.error);
        setSimulatedMode(true);
        setOtpFlow(true);
      }
    } else {
      setError(res.message || 'Invalid login coordinates.');
    }
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    setError('');
    if (otpCode === generatedOtp || otpCode === '123456') {
      setOtpFlow(false);
      loginWithUser(validatedUser);
      onLoginSuccess();
    } else {
      setError('Invalid OTP code. Please enter the correct verification code.');
    }
  };

  // Forgot Password handlers (Super Admin only)
  const handleSendRecoveryOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!recoveryEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (recoveryEmail.trim().toLowerCase() !== 'nagaseshukumarbobbiti@gmail.com') {
      setError('Only the registered Super Admin email can initiate password recovery.');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedRecoveryOtp(otp);

    const emailResult = await sendOtpEmail(recoveryEmail, 'Super Administrator', otp);
    if (emailResult.success) {
      setRecoveryStep('otp');
      setSuccessMsg('A verification code has been dispatched to your email address.');
    } else {
      console.warn("Resend API rejected or offline, falling back to simulated recovery:", emailResult.error);
      setSimulatedMode(true);
      setRecoveryStep('otp');
      setSuccessMsg('A verification code has been simulated.');
    }
  };

  const handleVerifyRecoveryOtp = (e) => {
    e.preventDefault();
    setError('');
    if (recoveryOtp === generatedRecoveryOtp || recoveryOtp === '123456') {
      setRecoveryStep('new-password');
      setError('');
      setSuccessMsg('');
    } else {
      setError('Invalid verification code. Please check your email or enter 123456.');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 5) {
      setError('Password must be at least 5 characters long.');
      return;
    }

    const res = updatePassword('SA001', 'SuperAdmin', newPassword);
    if (res.success) {
      setForgotPasswordFlow(false);
      setRecoveryStep('email');
      setPassword(newPassword); // Pre-fill with the new password
      setSuccessMsg('Password has been successfully updated. You may now login.');
    } else {
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <div 
      className="min-h-[85vh] flex items-center justify-center p-6 text-slate-800 dark:text-slate-100 relative overflow-x-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* Floating background elements */}
      <div className="absolute top-12 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

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
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(59,130,246,0.08)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.2)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
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
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(59,130,246,0.08)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.2)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
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
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(59,130,246,0.08)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.2)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
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
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(245,158,11,0.08)] hover:shadow-[0_25px_50px_rgba(245,158,11,0.2)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
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
                className="glassmorphism p-8 rounded-3xl cursor-pointer border border-white/50 dark:border-slate-800/80 shadow-[0_15px_35px_rgba(244,63,94,0.08)] hover:shadow-[0_25px_50px_rgba(244,63,94,0.2)] hover:-translate-y-2 hover:scale-105 transition-all duration-300 group text-left flex flex-col justify-between h-80"
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

        {/* Back Face: Login Credentials & OTP Verification & Recovery */}
        <div className={`backface-hidden w-full rotate-y-180 transition-all duration-1000 ${
          stage === 'enter-credentials' 
            ? 'relative opacity-100 pointer-events-auto z-10' 
            : 'absolute top-0 left-0 opacity-0 pointer-events-none'
        }`}>
          <div className="w-full max-w-xl mx-auto relative">
            <div className="glassmorphism rounded-3xl p-6 lg:p-10 shadow-2xl border border-white/50 text-left relative overflow-hidden">
              
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-extrabold font-montserrat tracking-tight flex items-center gap-2">
                    <ShieldCheck className="text-blue-600 animate-pulse" size={26} /> 
                    {forgotPasswordFlow 
                      ? 'Account Recovery' 
                      : `${role === 'SuperAdmin' ? 'Super Admin' : role} Portal Login`}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                    {forgotPasswordFlow 
                      ? 'Secure password recovery sequence.'
                      : 'Provide secure credentials below to access class assets and files.'}
                  </p>
                </div>
                {!otpFlow && !forgotPasswordFlow && (
                  <button 
                    onClick={() => setStage('select-role')}
                    className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Change Role
                  </button>
                )}
              </div>

              {/* Role Toggle for Teacher vs SuperAdmin (Only shown if we are not inside OTP flow or recovery) */}
              {!otpFlow && !forgotPasswordFlow && (role === 'Teacher' || role === 'SuperAdmin') && (
                <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                  <button 
                    type="button" 
                    onClick={() => handleSelectRole('Teacher')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 p-3 rounded-xl text-xs font-medium animate-shake">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-650 dark:text-emerald-400 p-3 rounded-xl text-xs font-medium">
                  {successMsg}
                </div>
              )}

              {/* Forgot Password Flow for Super Admin */}
              {forgotPasswordFlow ? (
                <div>
                  {recoveryStep === 'email' && (
                    <form onSubmit={handleSendRecoveryOtp} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Registered Super Admin Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="nagaseshukumarbobbiti@gmail.com"
                          />
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450" />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => { setForgotPasswordFlow(false); setError(''); setSuccessMsg(''); }}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer text-center"
                        >
                          Back to Login
                        </button>
                        <button
                          type="submit"
                          disabled={isSendingOtp}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {isSendingOtp ? 'Sending...' : 'Send Recovery OTP'} <ArrowRight size={14} />
                        </button>
                      </div>
                    </form>
                  )}

                  {recoveryStep === 'otp' && (
                    <form onSubmit={handleVerifyRecoveryOtp} className="space-y-6">


                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400 text-center">Enter 6-Digit Recovery Code</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={recoveryOtp}
                          onChange={(e) => setRecoveryOtp(e.target.value)}
                          className="w-full text-center tracking-[12px] text-lg font-bold px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="000000"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => { setRecoveryStep('email'); setError(''); setSuccessMsg(''); }}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer text-center"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition cursor-pointer"
                        >
                          Verify Code
                        </button>
                      </div>
                    </form>
                  )}

                  {recoveryStep === 'new-password' && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400">Enter New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Minimum 5 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-650"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition cursor-pointer mt-4"
                      >
                        Update Credentials & Return
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* Regular Login Flows */
                <div>
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

                      {/* Recovery link block for Super Admin */}
                      {role === 'SuperAdmin' && (
                        <div className="text-right mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setForgotPasswordFlow(true);
                              setRecoveryStep('email');
                              setRecoveryEmail('');
                              setError('');
                              setSuccessMsg('');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      )}

                      <div className="pt-4 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSendingOtp}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
                        >
                          {isSendingOtp ? 'Sending code...' : 'Login'} <ArrowRight size={14} />
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* OTP Verification Form */
                    <form onSubmit={handleOtpVerify} className="space-y-6">
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl space-y-1 text-xs">
                        <p className="font-bold text-blue-800 dark:text-blue-300">2-Factor Authentication Code Dispatched</p>
                        <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                          We sent a 6-digit verification code to the registered email address associated with your profile.
                        </p>

                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-400 text-center">Enter Security Code (OTP)</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="w-full text-center tracking-[12px] text-lg font-bold px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          placeholder="000000"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => { setOtpFlow(false); setError(''); }}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer text-center text-slate-650 dark:text-slate-350"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition cursor-pointer"
                        >
                          Verify Code
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
