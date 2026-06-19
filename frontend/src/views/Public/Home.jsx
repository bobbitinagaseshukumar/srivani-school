import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Award, BookOpen, GraduationCap, Users, ShieldAlert, ChevronRight, MessageSquare, ArrowUpRight, Compass, Sparkles, Megaphone, Bell, Info } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function Home({ onNavigate }) {
  const { circulars, tickerItems, schoolInfo, testimonials, admissionBanner, homepageInfra, homepageStats } = useContext(AppContext);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const activeTestimonials = (testimonials || []).filter(t => t.active);
  const banner = admissionBanner || { active: true, year: '2026–2027', headline: 'ADMISSIONS OPEN FOR', subtitle: 'Register Online Today.', buttonLabel: 'Apply Now' };

  useEffect(() => {
    if (activeTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % activeTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTestimonials.length]);

  const iconMap = { '🎓': Users, '👨🏫': GraduationCap, '🏫': BookOpen, '🏆': Award };
  const stats = (homepageStats || []).map((s, idx) => ({
    label: s.label,
    count: s.value,
    icon: [Users, GraduationCap, Award, BookOpen][idx] || Award,
    color: ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-fuchsia-500 to-pink-600'][idx] || 'from-blue-500 to-indigo-600'
  }));

  const facilities = (homepageInfra || []).map(item => ({
    title: item.title,
    desc: item.description,
    img: item.image
  }));

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Admission Open Banner — controlled by Super Admin */}
      {banner.active && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-2.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-between gap-4 overflow-hidden relative">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .admission-marquee {
              display: inline-block;
              white-space: nowrap;
              animation: marquee 25s linear infinite;
            }
            .admission-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex-1 overflow-hidden relative flex items-center">
            <div className="admission-marquee flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('admissions')}>
              <Sparkles size={14} className="inline shrink-0 text-amber-300" />
              <span>✨ {banner.headline} {banner.year}! {banner.subtitle} — Apply online for the academic session. ✨</span>
              <Sparkles size={14} className="inline shrink-0 text-amber-300" />
              <span className="ml-8">✨ {banner.headline} {banner.year}! {banner.subtitle} — Register today to secure your seat. ✨</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('admissions')}
            className="shrink-0 bg-white text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-slate-100 transition-all shadow-md z-10 hover:scale-105"
          >
            {banner.buttonLabel}
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-animated-mesh text-white py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(59,130,246,0.25),transparent_55%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.18),transparent_55%)]"></div>
        {/* Floating 3D orbs */}
        <div className="absolute top-10 left-8 sm:left-16 w-20 h-20 sm:w-28 sm:h-28 bg-blue-500/12 rounded-full blur-2xl animate-float-slow pointer-events-none"></div>
        <div className="absolute bottom-10 right-8 sm:right-20 w-28 h-28 sm:w-40 sm:h-40 bg-purple-500/12 rounded-full blur-3xl animate-float-orbit pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-indigo-400/10 rounded-full blur-xl animate-float-alt pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 grid lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Compass size={13} /> Global Standard of Education
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-montserrat tracking-tight leading-tight">
              Building <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Future Leaders</span> &amp; Innovators
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-light leading-relaxed">
              Welcome to SRI VANI VIDYANIKETHAN EM SCHOOL — where academic rigour meets interactive learning. We nurture children from Playclass to Class 10.
            </p>
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 pt-1">
              <button 
                onClick={() => onNavigate('admissions')} 
                className="animate-pulse-glow bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full xs:w-auto"
              >
                Apply Admission <ArrowUpRight size={17} />
              </button>
              <button 
                onClick={() => onNavigate('about')} 
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-7 py-3.5 rounded-xl font-semibold transition-all w-full xs:w-auto text-center"
              >
                Explore School
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="card-3d relative z-10 overflow-hidden rounded-2xl border border-slate-700/50 shadow-2xl bg-slate-800/50 p-2">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80" 
                alt="Sri Vani Vidyanikethan Campus" 
                className="w-full h-56 sm:h-72 lg:h-80 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-5">
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Modern Academic Block</h3>
                  <p className="text-xs text-slate-300">Equipped with 3D models and digital learning systems.</p>
                </div>
              </div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10 animate-float-slow"></div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <ScrollReveal>
        <section className="py-14 sm:py-16 bg-slate-50 dark:bg-slate-900/40 relative z-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 stagger-children">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="glassmorphism p-4 sm:p-6 rounded-2xl shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left group animate-bounce-in card-3d"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={20} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-montserrat">{stat.count}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Principal message card */}
      <ScrollReveal>
        <section className="py-12 sm:py-20 max-w-7xl mx-auto px-5 sm:px-6">
          <div className="glassmorphism rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden grid lg:grid-cols-12 gap-6 sm:gap-8 items-center border border-white/40 dark:border-slate-800/40">
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group">
                <img 
                  src={schoolInfo?.principalPhoto || "/principal.jpg"} 
                  alt={`Principal ${schoolInfo?.principalName}`} 
                  className="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-full border-4 border-blue-500/30 shadow-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-25 -z-10 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <h4 className="font-extrabold text-base sm:text-lg mt-4 text-slate-900 dark:text-white text-center">{schoolInfo?.principalName || 'K Dasaratha Rami Reddy'}</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider text-center">{schoolInfo?.principalDesignation || 'Principal, Sri Vani Vidyanikethan'}</p>
            </div>

            <div className="lg:col-span-8 text-left space-y-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-montserrat text-indigo-950 dark:text-white">Welcome from the Principal</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
              <p className="text-slate-600 dark:text-slate-350 font-light leading-relaxed text-sm sm:text-base">
                {schoolInfo?.principalMessage}
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed italic text-sm sm:text-base">
                &quot;{schoolInfo?.principalQuote}&quot;
              </p>
              <button 
                onClick={() => onNavigate('about')} 
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-sm group"
              >
                Read Full Message <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Facilities Showcase */}
      <ScrollReveal>
        <section className="py-14 sm:py-20 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold font-montserrat bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">World Class Campus Infrastructure</h2>
              <p className="text-slate-400 font-light text-sm">Explore the premium facilities that provide our students with a nurturing atmosphere to learn and grow.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ perspective: '1000px' }}>
              {facilities.map((fac, idx) => (
                <div 
                  key={idx} 
                  className="card-3d bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:rotate-y-3 hover:rotate-x-3 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="overflow-hidden h-44 sm:h-48 relative">
                    <img 
                      src={fac.img} 
                      alt={fac.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-4 sm:p-5 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-slate-100 group-hover:text-blue-400 transition-colors">{fac.title}</h3>
                      <p className="text-xs text-slate-400 font-light mt-1.5 leading-relaxed">{fac.desc}</p>
                    </div>
                    <button 
                      onClick={() => onNavigate('facilities')} 
                      className="text-xs font-semibold text-blue-400 group-hover:text-blue-300 mt-3 flex items-center gap-1 hover:underline"
                    >
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>



      {/* Testimonials — managed by Super Admin */}
      <ScrollReveal>
        <section className="py-16 sm:py-20 max-w-5xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat">Words from Our Community</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-2 rounded"></div>
          </div>

          {activeTestimonials.length === 0 ? (
            <div className="glassmorphism rounded-2xl p-8 text-center text-slate-400 text-sm">
              No testimonials added yet.
            </div>
          ) : (
            <div className="relative" style={{ perspective: '1000px' }}>
              <div className="glassmorphism rounded-2xl p-6 sm:p-10 shadow-xl border border-white/50 text-center relative z-10 hover:rotate-x-3 hover:scale-[1.01] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto text-blue-600 mb-5">
                  <MessageSquare size={22} />
                </div>
                <p className="text-base sm:text-lg md:text-xl font-light text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{activeTestimonials[currentTestimonial % activeTestimonials.length].text}&rdquo;
                </p>
                <h4 className="font-bold text-slate-900 dark:text-white mt-6">{activeTestimonials[currentTestimonial % activeTestimonials.length].author}</h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{activeTestimonials[currentTestimonial % activeTestimonials.length].role}</p>
              </div>
              <div className="flex justify-center gap-2 mt-5">
                {activeTestimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${currentTestimonial % activeTestimonials.length === idx ? 'bg-blue-600 w-6' : 'bg-slate-300 dark:bg-slate-700 w-2.5'}`}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* School Circulars & Live News Ticker Section */}
      <ScrollReveal>
        <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-8 items-stretch">
          <style>{`
            @keyframes vertical-scroll {
              0% { transform: translateY(0); }
              100% { transform: translateY(-50%); }
            }
            .scroll-ticker-active {
              animation: vertical-scroll 24s linear infinite;
            }
            .scroll-ticker-active:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* Left Column: Official School Circulars */}
          <div className="md:col-span-7 flex flex-col justify-between text-left space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                <Megaphone size={12} /> Notice Board Broadcasts
              </div>
              <h2 className="text-3xl font-extrabold font-montserrat">Official School Circulars</h2>
              <p className="text-slate-400 text-xs mt-1">Official announcements published by administration and faculty desk.</p>
            </div>

            <div className="space-y-4 flex-1">
              {circulars && circulars.slice(0, 3).map((c) => (
                <div key={c.id} className="p-5 bg-white dark:bg-slate-800/40 rounded-2xl shadow border border-slate-200/50 dark:border-slate-800 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <Bell size={18} />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{c.title}</span>
                      <span className="bg-slate-100 dark:bg-slate-900 text-slate-500 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase">{c.targetGroup}</span>
                    </div>
                    <p className="text-slate-450 dark:text-slate-350 leading-relaxed font-light">{c.content}</p>
                    <div className="text-[9px] text-slate-400 font-mono flex items-center gap-2 pt-1">
                      <span>By: {c.postedBy}</span>
                      <span>•</span>
                      <span>Published: {c.date}</span>
                    </div>
                  </div>
                </div>
              ))}
              {(!circulars || circulars.length === 0) && (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border text-slate-400 text-xs italic">
                  No active circulars listed at this moment.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Scrolling News Ticker ("What's New") */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800/80 flex flex-col overflow-hidden relative min-h-[350px] text-left">
            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-indigo-950 to-transparent pointer-events-none z-10"></div>

            <div className="mb-4 z-20">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">Live Ticker Feed</span>
              <h3 className="text-lg font-bold font-montserrat mt-1">What's New in the School</h3>
              <p className="text-[10px] text-slate-400">Hover to pause • Real-time bulletins scrollboard</p>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <div className="scroll-ticker-active space-y-4 pt-4">
                {/* We double the ticker list to construct a seamless infinite loop */}
                {tickerItems && tickerItems.length > 0 ? (
                  /* Double the list for seamless infinite scroll — only when there are 3+ items so duplication isn't jarring */
                  (tickerItems.length >= 3 ? [...tickerItems, ...tickerItems] : tickerItems).map((news, idx) => (
                    <div key={`${news.id || idx}-${idx}`} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">{news.type}</span>
                        <span>{news.time}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100">{news.title}</h4>
                      <p className="text-[10px] text-slate-350 font-light leading-relaxed">{news.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No active bulletins configured.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Dynamic CTA Footer Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white py-16 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-montserrat">Ready to shape your child's future?</h2>
          <p className="text-slate-300 max-w-xl mx-auto font-light text-sm sm:text-base">
            Enrollments are now open. Walk through our campus virtually or speak to our academic consultants to discover standard paths.
          </p>
          <div className="flex justify-center gap-4 flex-wrap pt-2">
            <button 
              onClick={() => onNavigate('admissions')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Start Admission Form
            </button>
            <button 
              onClick={() => onNavigate('contact')} 
              className="bg-transparent hover:bg-white/10 text-white border border-white/30 font-bold px-8 py-3.5 rounded-xl transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
