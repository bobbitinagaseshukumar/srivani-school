import React, { useState } from 'react';
import { Award, BookOpen, GraduationCap, Users, ShieldAlert, ChevronRight, MessageSquare, ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function Home({ onNavigate }) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const stats = [
    { label: 'Enrolled Students', count: '5,000+', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Expert Educators', count: '300+', icon: GraduationCap, color: 'from-emerald-500 to-teal-600' },
    { label: 'National Awards', count: '50+', icon: Award, color: 'from-amber-500 to-orange-600' },
    { label: 'Years of Excellence', count: '20+', icon: BookOpen, color: 'from-fuchsia-500 to-pink-600' }
  ];

  const facilities = [
    { title: 'Smart Classrooms', desc: 'Interactive flat panels, high-definition audio, and full climate control for active learning.', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80' },
    { title: 'Futuristic STEM Labs', desc: 'Equipped with 3D printers, robotic kits, VR systems, and advanced chemicals lab benches.', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80' },
    { title: 'Digital Resource Library', desc: 'Over 50,000 physical volumes and unlimited access to scholarly journals and digital archives.', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80' },
    { title: 'Olympic-Grade Sports Arena', desc: 'Includes an indoor heated pool, running tracks, basketball courts, and professional training staff.', img: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop&q=80' }
  ];

  const testimonials = [
    { text: "Gravity School is more than just an academic institute; it's a launchpad for dreams. The custom AI feedback and individual attention helped me secure admissions at MIT.", author: "Alice Johnson", role: "Alumni (Class of 2024)" },
    { text: "As a parent, the portal gives me unparalleled peace of mind. I can track my child's daily progress, attendance, and message teachers instantly. Highly recommended!", author: "Robert Johnson", role: "Parent" },
    { text: "Teaching here is a joy. The modern smart classrooms and integrated digital homework systems save time, allowing us to focus entirely on interactive learning.", author: "Dr. David Banner", role: "Physics Faculty" }
  ];

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Admission Open Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center py-2.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 animate-pulse">
        <Sparkles size={16} />
        <span>ADMISSIONS OPEN FOR ACADEMIC YEAR 2026 - 2027! Register Online Today.</span>
        <button 
          onClick={() => onNavigate('admissions')} 
          className="ml-3 bg-white text-indigo-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-slate-100 transition-all shadow-md"
        >
          Apply Now
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent_50%)]"></div>
        {/* Floating elements styling */}
        <div className="absolute top-12 left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-16 right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-float-fast"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Compass size={14} /> Global Standard of Education
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-montserrat tracking-tight leading-tight">
              Building <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Future Leaders</span> & Innovators
            </h1>
            <p className="text-lg text-slate-300 max-w-xl font-light">
              Welcome to SRI VANI VIDYANIKETHAN EM SCHOOL, where academic rigour meets interactive learning. We nurture children from Playclass to Class 10 to grow, create, and excel.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => onNavigate('admissions')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2"
              >
                Apply Admission <ArrowUpRight size={18} />
              </button>
              <button 
                onClick={() => onNavigate('about')} 
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-slate-800/80"
              >
                Explore School
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative z-10 overflow-hidden rounded-2xl border border-slate-700/50 shadow-2xl bg-slate-800/50 p-2">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80" 
                alt="Gravity School Campus" 
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="font-bold text-lg">Modern Academic Block</h3>
                  <p className="text-xs text-slate-300">Equipped with 3D models and digital learning systems.</p>
                </div>
              </div>
            </div>
            {/* Background glowing frame */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10 animate-float-slow"></div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <ScrollReveal>
        <section className="py-16 bg-slate-50 dark:bg-slate-900/40 relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="glassmorphism p-6 rounded-2xl shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <h3 className="text-3xl font-extrabold font-montserrat">{stat.count}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Principal message card */}
      <ScrollReveal>
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="glassmorphism rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden grid lg:grid-cols-12 gap-8 items-center border border-white/40 dark:border-slate-800/40">
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group">
                <img 
                  src="/principal.jpg" 
                  alt="Principal K Dasaratha Rami Reddy" 
                  className="w-52 h-52 object-cover rounded-full border-4 border-blue-500/30 shadow-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-25 -z-10 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <h4 className="font-extrabold text-lg mt-4 text-slate-900 dark:text-white">K Dasaratha Rami Reddy</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Principal, Sri Vani Vidyanikethan</p>
            </div>

            <div className="lg:col-span-8 text-left space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-indigo-950 dark:text-white">Welcome from the Principal</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
              <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                At Sri Vani Vidyanikethan, we foster an environment of creativity, integrity, and analytical reasoning. We do not believe in rote memorization. Instead, we implement research-led curricula, integrated with the latest virtual tools. Our goal is to prepare students to face global challenges, with values grounded in kindness and civic responsibility.
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed italic">
                "We inspire young minds to push the limits of their creativity, shaping tomorrow's leaders, engineers, scientists, and humanitarians."
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
        <section className="py-20 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-montserrat bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">World Class Campus Infrastructure</h2>
              <p className="text-slate-400 font-light">Explore the premium facilities that provide our students with a nurturing atmosphere to learn and grow.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: '1000px' }}>
              {facilities.map((fac, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:rotate-y-3 hover:rotate-x-3 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="overflow-hidden h-48 relative">
                    <img 
                      src={fac.img} 
                      alt={fac.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-5 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-100 group-hover:text-blue-400 transition-colors">{fac.title}</h3>
                      <p className="text-xs text-slate-400 font-light mt-2 leading-relaxed">{fac.desc}</p>
                    </div>
                    <button 
                      onClick={() => onNavigate('facilities')} 
                      className="text-xs font-semibold text-blue-400 group-hover:text-blue-300 mt-4 flex items-center gap-1 hover:underline"
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

      {/* Testimonials */}
      <ScrollReveal>
        <section className="py-20 max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold font-montserrat">Words from Our Community</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-2 rounded"></div>
          </div>

          <div className="relative" style={{ perspective: '1000px' }}>
            <div className="glassmorphism rounded-2xl p-8 lg:p-12 shadow-xl border border-white/50 text-center relative z-10 hover:rotate-x-3 hover:scale-[1.01] transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto text-blue-600 mb-6">
                <MessageSquare size={24} />
              </div>
              <p className="text-lg md:text-xl font-light text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white mt-6">{testimonials[currentTestimonial].author}</h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{testimonials[currentTestimonial].role}</p>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${currentTestimonial === idx ? 'bg-blue-600 px-3' : 'bg-slate-300 dark:bg-slate-700'}`}
                ></button>
              ))}
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
