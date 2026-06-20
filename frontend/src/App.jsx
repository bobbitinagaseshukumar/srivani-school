import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from './context/AppContext';

// Import Public Pages
import Home from './views/Public/Home';
import About from './views/Public/About';
import Faculty from './views/Public/Faculty';
import Academics from './views/Public/Academics';
import Facilities from './views/Public/Facilities';
import Gallery from './views/Public/Gallery';
import Admissions from './views/Public/Admissions';
import Contact from './views/Public/Contact';

// Import Auth Page
import Login from './views/Auth/Login';

// Import Portal Pages
import SuperAdminPortal from './views/SuperAdmin/SuperAdminPortal';
import AdminPortal from './views/Admin/AdminPortal';
import TeacherPortal from './views/Teacher/TeacherPortal';
import StudentPortal from './views/Student/StudentPortal';
import ParentPortal from './views/Parent/ParentPortal';

// Icons
import { Sun, Moon, Lock, User, LayoutDashboard, Compass, Menu, X, Bell, Shield, BookOpen, GraduationCap, Users, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const { currentUser, loginUser, logoutUser, theme, setTheme, notifications, markNotificationRead, schoolInfo } = useContext(AppContext);
  const [currentTab, setCurrentTab] = useState('home'); // home, about, faculty, academics, facilities, gallery, admissions, contact, login, portal
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // Active immediately on first render
  const [isIntroFading, setIsIntroFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Muted by default for browser compliance
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const introTimeoutRef = useRef(null);

  const handleCloseIntro = () => {
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    setIsIntroFading(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 1000); // Smooth 1-second transition to settle back
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(err => console.log("Play failed", err));
        setIsPlaying(true);
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle video playback and autoplay unmuted fallback on showIntro
  useEffect(() => {
    let interactionListener = null;

    if (showIntro && videoRef.current) {
      // Safety fallback: auto-close splash screen after 20 seconds
      introTimeoutRef.current = setTimeout(() => {
        handleCloseIntro();
      }, 20000);

      const playVideo = async () => {
        const video = videoRef.current;
        if (!video) return;

        // Auto-play video muted immediately (always allowed by all browsers)
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
          setIsPlaying(true);
          console.log("Autoplay started muted.");
        } catch (error) {
          console.error("Autoplay failed completely:", error);
          handleCloseIntro();
          return;
        }

        // Set up listener to automatically unmute upon first user interaction
        interactionListener = () => {
          if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
            videoRef.current.play().catch(e => console.log("Play failed on interaction:", e));
          }
          cleanupListeners();
        };

        window.addEventListener('click', interactionListener, { passive: true });
        window.addEventListener('touchstart', interactionListener, { passive: true });
        window.addEventListener('scroll', interactionListener, { passive: true });
        window.addEventListener('mousedown', interactionListener, { passive: true });
        window.addEventListener('keydown', interactionListener, { passive: true });
      };

      const cleanupListeners = () => {
        if (interactionListener) {
          window.removeEventListener('click', interactionListener);
          window.removeEventListener('touchstart', interactionListener);
          window.removeEventListener('scroll', interactionListener);
          window.removeEventListener('mousedown', interactionListener);
          window.removeEventListener('keydown', interactionListener);
          interactionListener = null;
        }
      };

      playVideo();

      return () => {
        cleanupListeners();
      };
    }
  }, [showIntro]);

  // Synchronize routing state with browser history / URL hash
  useEffect(() => {
    const getTabFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['home', 'about', 'faculty', 'academics', 'facilities', 'gallery', 'admissions', 'contact', 'login', 'portal'];
      return validTabs.includes(hash) ? hash : 'home';
    };

    // On mount, read initial tab from hash
    const initialTab = getTabFromHash();
    setCurrentTab(initialTab);

    // If the hash is empty, set it to the initial tab
    if (!window.location.hash) {
      window.history.replaceState({ tab: initialTab }, '', `#${initialTab}`);
    }

    const handlePopState = (event) => {
      const tab = event.state?.tab || getTabFromHash();
      setCurrentTab(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync state changes to browser history
  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash !== currentTab) {
      window.history.pushState({ tab: currentTab }, '', `#${currentTab}`);
    }
  }, [currentTab]);

  // Reset scroll position to top when transitioning between tabs or switching roles
  useEffect(() => {
    const handleScroll = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };
    
    // Execute immediately
    handleScroll();
    
    // Execute after short delays to override any asynchronous layout rendering jumps
    const t1 = setTimeout(handleScroll, 20);
    const t2 = setTimeout(handleScroll, 100);
    const t3 = setTimeout(handleScroll, 250);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentTab, currentUser.role]);

  // Redirect to home if user logs out (role becomes Guest) and they are on the portal tab
  useEffect(() => {
    if (currentUser.role === 'Guest' && currentTab === 'portal') {
      setCurrentTab('home');
    }
  }, [currentUser.role, currentTab]);

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
    if (!mounted) {
      return <Home onNavigate={setCurrentTab} />;
    }
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
  const isPortalOrLogin = currentTab === 'login' || currentTab === 'portal';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between font-sans transition-colors duration-300">
      
      {/* Global Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <img 
              src={schoolInfo?.logo || "/logo.jpg"} 
              alt="School Logo" 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shadow-md border border-slate-200/50 dark:border-slate-800/80 bg-white"
            />
            <div>
              <h1 className="text-[10px] sm:text-xs md:text-sm font-extrabold font-montserrat tracking-tight leading-tight m-0 text-slate-950 dark:text-white uppercase">{schoolInfo?.name || 'SRI VANI VIDYANIKETHAN'}</h1>
              <p className="text-[7px] sm:text-[8px] md:text-[9px] text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase m-0 leading-none">{schoolInfo?.tagline || 'EM SCHOOL'}</p>
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Alert Dropdown */}
            {mounted && currentUser.role !== 'Guest' && (
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
            {!mounted || currentUser.role === 'Guest' ? (
              <button
                onClick={() => setCurrentTab('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-2 sm:px-4 sm:py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Lock size={12} /> <span className="hidden sm:inline">Portal Login</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('portal')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-2 sm:px-4 sm:py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <LayoutDashboard size={12} /> <span className="hidden sm:inline">Portal Dashboard</span>
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
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
              {!mounted || currentUser.role === 'Guest' ? (
                <button
                  onClick={() => { setCurrentTab('login'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 font-bold flex items-center gap-1.5"
                >
                  <Lock size={12} /> Portal Login
                </button>
              ) : (
                <button
                  onClick={() => { setCurrentTab('portal'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 font-bold flex items-center gap-1.5"
                >
                  <LayoutDashboard size={12} /> Portal Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Core View Area */}
      <main className={isPortalOrLogin ? 'flex-1 min-w-0' : 'flex-1 min-w-0 pb-24'}>
        {renderContent()}
      </main>

      {/* Persistent Demo Toolbar — hidden on login and portal pages */}
      {showRoleSwitcher && !isPortalOrLogin && (
        <div className="fixed bottom-0 sm:bottom-4 inset-x-0 sm:inset-x-4 max-w-4xl sm:mx-auto bg-slate-900/95 backdrop-blur-md text-white sm:rounded-3xl rounded-t-3xl border border-slate-700/80 shadow-2xl px-3 py-3 sm:p-4 z-50 text-xs" style={{paddingBottom: 'max(12px, env(safe-area-inset-bottom))'}}>
          <div className="flex items-center justify-between mb-2 sm:mb-0 sm:hidden">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="font-extrabold font-montserrat text-[11px]">Quick Switch</p>
            </div>
            <button
              onClick={() => setShowRoleSwitcher(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg border border-slate-700/50 text-[10px]"
            >
              Hide
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div className="text-left">
                <p className="font-extrabold font-montserrat">Quick Switch simulator</p>
                <p className="text-[9px] text-slate-400">Evaluate all 5 roles instantly (Bypasses logins)</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[['Guest','Public Web'],['SuperAdmin','Super Admin'],['Admin','Admin'],['Teacher','Teacher'],['Student','Student'],['Parent','Parent']].map(([role, label]) => (
                <button
                  key={role}
                  onClick={() => handleQuickSwitch(role)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all text-[10px] sm:text-xs ${
                    (currentUser.role === role && !(role === 'Guest' && currentTab === 'login'))
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRoleSwitcher(false)}
              className="hidden sm:block text-slate-400 hover:text-white p-1 rounded-lg border border-slate-700/50 shrink-0"
            >
              Hide Panel
            </button>
          </div>
        </div>
      )}



      {/* Global Footer — hidden on login and portal pages */}
      {!isPortalOrLogin && (
      <footer className="bg-slate-900 text-white py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
          
          {/* Brand Col */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="Sri Vani Vidyanikethan Logo" 
                className="w-8 h-8 rounded-lg object-cover bg-white"
              />
              <h4 className="font-bold tracking-tight">{schoolInfo?.name || 'SRI VANI VIDYANIKETHAN'}</h4>
            </div>
            <p className="text-slate-400 font-light leading-relaxed">
              Empowering children through interactive learning, core values, and analytical reasoning.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-350 transition-colors border border-slate-700/50 shadow-md"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={14} className="text-amber-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="text-blue-450" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
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
              <li className="cursor-pointer hover:underline" onClick={() => setCurrentTab(currentUser.role === 'Guest' ? 'login' : 'portal')}>Portal Access</li>
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
          <p>© 2026 {schoolInfo?.name || 'SRI VANI VIDYANIKETHAN'} {schoolInfo?.tagline || 'EM SCHOOL'}. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-white">Security Controls</span>
            <span className="cursor-pointer hover:text-white">Privacy Clause</span>
          </div>
        </div>
      </footer>
      )}

      {/* Cinematic Splash Screen Video Intro */}
      {showIntro && (
        <div 
          className={`fixed inset-0 z-[9999] bg-[#000000] overflow-hidden transition-opacity duration-1000 ease-in-out ${
            isIntroFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Dynamic Fullscreen Video Object-Cover to fill phone/laptop ratios */}
          <video 
            ref={videoRef}
            className="w-full h-full object-contain md:object-cover scale-[1.01]"
            src="/srivani_school_logo.mp4"
            playsInline
            muted={isMuted}
            onEnded={handleCloseIntro}
            onError={handleCloseIntro}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Custom Premium Cinematic Controls (Bottom of screen) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-white/20">
            {/* Play/Pause Toggle */}
            <button
              onClick={handleTogglePlay}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all focus:outline-none flex items-center justify-center cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-white/20"></div>

            {/* Mute/Unmute Toggle */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all focus:outline-none flex items-center justify-center cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-white/20"></div>

            {/* Skip Option */}
            <button
              onClick={handleCloseIntro}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/20 transition-all border border-blue-400/20 flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              Skip ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
