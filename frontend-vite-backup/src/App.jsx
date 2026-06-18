import React, { useContext, useState } from 'react';
import { AppContext } from './context/AppContext';

// Import Public Pages
import Home from './pages/Public/Home';
import About from './pages/Public/About';
import Faculty from './pages/Public/Faculty';
import Academics from './pages/Public/Academics';
import Facilities from './pages/Public/Facilities';
import Gallery from './pages/Public/Gallery';
import Admissions from './pages/Public/Admissions';
import Contact from './pages/Public/Contact';

// Import Auth Page
import Login from './pages/Auth/Login';

// Import Portal Pages
import SuperAdminPortal from './pages/SuperAdmin/SuperAdminPortal';
import AdminPortal from './pages/Admin/AdminPortal';
import TeacherPortal from './pages/Teacher/TeacherPortal';
import StudentPortal from './pages/Student/StudentPortal';
import ParentPortal from './pages/Parent/ParentPortal';

// Icons
import { Sun, Moon, Lock, User, LayoutDashboard, Compass, Menu, X, Bell, Shield, BookOpen, GraduationCap, Users } from 'lucide-react';

export default function App() {
  const { currentUser, loginUser, logoutUser, theme, setTheme, notifications, markNotificationRead } = useContext(AppContext);
  const [currentTab, setCurrentTab] = useState('home'); // home, about, faculty, academics, facilities, gallery, admissions, contact, login, portal
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(true);

  // Quick switch handler to bypass login during demonstration
  const handleQuickSwitch = (role) => {
    if (role === 'Guest') {
      logoutUser();
      setCurrentTab('home');
    } else {
      let username = '';
      if (role === 'SuperAdmin') username = 'super@srivani.edu';
      else if (role === 'Admin') username = 'admin@srivani.edu';
      else if (role === 'Teacher') username = 'T101';
      else if (role === 'Student') username = 'S1001';
      else if (role === 'Parent') username = 'P1001';
      
      const pass = role === 'SuperAdmin' ? 'super123' : 
                   role === 'Admin' ? 'admin123' : 
                   role === 'Teacher' ? 'teacher123' : 
                   role === 'Student' ? 'student123' : 'parent123';

      loginUser(username, pass, role);
      setCurrentTab('portal');
    }
    setMobileMenuOpen(false);
    setShowNotifications(false);
  };

  const renderContent = () => {
    // If user explicitly requests 'portal' tab, route them appropriately
    if (currentTab === 'portal' && currentUser.role !== 'Guest') {
      switch (currentUser.role) {
        case 'SuperAdmin': return <SuperAdminPortal />;
        case 'Admin': return <AdminPortal />;
        case 'Teacher': return <TeacherPortal />;
        case 'Student': return <StudentPortal />;
        case 'Parent': return <ParentPortal />;
        default: return <Home onNavigate={setCurrentTab} />;
      }
    }

    switch (currentTab) {
      case 'home': return <Home onNavigate={setCurrentTab} />;
      case 'about': return <About />;
      case 'faculty': return <Faculty />;
      case 'academics': return <Academics />;
      case 'facilities': return <Facilities />;
      case 'gallery': return <Gallery />;
      case 'admissions': return <Admissions />;
      case 'contact': return <Contact />;
      case 'login': return <Login onLoginSuccess={() => setCurrentTab('portal')} />;
      default: return <Home onNavigate={setCurrentTab} />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-300">
      
      {/* Global Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <img 
              src="/logo.jpg" 
              alt="Sri Vani Vidyanikethan Logo" 
              className="w-9 h-9 rounded-xl object-cover shadow-md border border-slate-200/50 dark:border-slate-800/80 bg-white"
            />
            <div>
              <h1 className="text-sm font-extrabold font-montserrat tracking-tight leading-tight m-0 text-slate-950 dark:text-white">SRI VANI VIDYANIKETHAN</h1>
              <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase m-0 leading-none">EM SCHOOL</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-350">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Us' },
              { id: 'faculty', label: 'Faculty' },
              { id: 'academics', label: 'Academics' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'admissions', label: 'Admissions' },
              { id: 'contact', label: 'Contact' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  currentTab === link.id 
                    ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold' 
                    : 'hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Utilities Panel */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications Alert Dropdown */}
            {currentUser.role !== 'Guest' && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 relative transition-colors"
                >
                  <Bell size={16} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-xs text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold">Real-time alerts</p>
                      <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded">
                        {unreadNotifications.length} New
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-60 overflow-y-auto pr-1">
                      {notifications.map((ntf) => (
                        <div 
                          key={ntf.id} 
                          onClick={() => markNotificationRead(ntf.id)}
                          className={`py-2 cursor-pointer transition-colors ${!ntf.read ? 'bg-blue-500/5 px-1 rounded' : ''}`}
                        >
                          <p className="font-bold text-slate-900 dark:text-white flex justify-between">
                            <span>{ntf.title}</span>
                            <span className="text-[8px] text-slate-400 font-normal">{ntf.time}</span>
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{ntf.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Portal Action Button */}
            {currentUser.role === 'Guest' ? (
              <button
                onClick={() => setCurrentTab('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Lock size={12} /> Portal Login
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('portal')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <LayoutDashboard size={12} /> Portal Dashboard
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 flex flex-col text-xs font-bold">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Us' },
              { id: 'faculty', label: 'Faculty' },
              { id: 'academics', label: 'Academics' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'admissions', label: 'Admissions' },
              { id: 'contact', label: 'Contact' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => { setCurrentTab(link.id); setMobileMenuOpen(false); }}
                className="text-left w-full px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Core View Area */}
      <main className="flex-1 pb-24">
        {renderContent()}
      </main>

      {/* Persistent Demo Toolbar */}
      {showRoleSwitcher && (
        <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto bg-slate-900/90 dark:bg-slate-900/95 backdrop-blur-md text-white rounded-3xl border border-slate-700/80 shadow-2xl p-4 z-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <div className="text-left">
              <p className="font-extrabold font-montserrat">Quick Switch simulator</p>
              <p className="text-[9px] text-slate-400">Evaluate all 5 roles instantly with one-click access (Bypasses logins)</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button 
              onClick={() => handleQuickSwitch('Guest')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentUser.role === 'Guest' && currentTab !== 'login' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Public Web
            </button>
            <button 
              onClick={() => handleQuickSwitch('SuperAdmin')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentUser.role === 'SuperAdmin' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Super Admin
            </button>
            <button 
              onClick={() => handleQuickSwitch('Admin')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentUser.role === 'Admin' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Admin Portal
            </button>
            <button 
              onClick={() => handleQuickSwitch('Teacher')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentUser.role === 'Teacher' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Teacher Portal
            </button>
            <button 
              onClick={() => handleQuickSwitch('Student')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentUser.role === 'Student' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Student Portal
            </button>
            <button 
              onClick={() => handleQuickSwitch('Parent')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                currentUser.role === 'Parent' ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              Parent Portal
            </button>
          </div>

          <button 
            onClick={() => setShowRoleSwitcher(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg border border-slate-700/50"
          >
            Hide Panel
          </button>
        </div>
      )}

      {/* Global Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-left">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="Sri Vani Vidyanikethan Logo" 
                className="w-8 h-8 rounded-lg object-cover bg-white"
              />
              <h4 className="font-bold tracking-tight">SRI VANI VIDYANIKETHAN</h4>
            </div>
            <p className="text-slate-400 font-light leading-relaxed">
              Empowering children through interactive learning, core values, and analytical reasoning from Playclass to Class 10.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Academic Directory</h5>
            <ul className="space-y-2 text-slate-300 font-light">
              <li className="cursor-pointer hover:underline" onClick={() => setCurrentTab('academics')}>Schedules & Curriculum</li>
              <li className="cursor-pointer hover:underline" onClick={() => setCurrentTab('faculty')}>Meet Our Teachers</li>
              <li className="cursor-pointer hover:underline" onClick={() => setCurrentTab('facilities')}>Campus Infrastructures</li>
              <li className="cursor-pointer hover:underline" onClick={() => setCurrentTab('gallery')}>Recent Snapshots</li>
            </ul>
          </div>

          {/* Registrations */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Office & Admissions</h5>
            <ul className="space-y-2 text-slate-300 font-light">
              <li className="cursor-pointer hover:underline" onClick={() => setCurrentTab('admissions')}>Apply Registration</li>
              <li className="cursor-pointer hover:underline" onClick={() => setCurrentTab('contact')}>Helpdesk Support</li>
              <li className="cursor-pointer hover:underline" onClick={() => setCurrentTab('login')}>Portal Access</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Central Location</h5>
            <p className="text-slate-400 font-light leading-relaxed">
              3-89, Pedda Kottala St, Pedda Kottala, <br />
              Kottala, Andhra Pradesh 518502 <br />
              Email: office@srivani.edu | Tel: +91 98765-43210
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 font-light gap-2">
          <p>© 2026 SRI VANI VIDYANIKETHAN EM SCHOOL. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-white">Security Controls</span>
            <span className="cursor-pointer hover:text-white">Privacy Clause</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
