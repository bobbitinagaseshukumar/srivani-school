import React from 'react';
import { Shield, Eye, Flame, Award, Cpu, BookOpen, Compass } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function About() {
  const leadership = [
    { name: 'K Dasaratha Rami Reddy', role: 'Principal & Director', qual: 'M.Ed / M.Sc, Educational Leadership', photo: '/principal.jpg' },
    { name: 'Robert Vance', role: 'Chairman, Management Committee', qual: 'MBA (Harvard Business School)', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Dr. Evelyn Carter', role: 'Vice Principal', qual: 'Ph.D. in Child Psychology', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 text-slate-800 dark:text-slate-100 text-left">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold font-montserrat">About Our School</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">Dedicated to excellence in learning and research-led educational foundations since 2006.</p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      {/* History, Vision, Mission */}
      <ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/40">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Our History</h3>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-light">
              Founded in 2006, Gravity International began as a experimental science school. Over two decades, we expanded to include comprehensive secondary education, global exchange programs, and state-of-the-art AI-driven performance models.
            </p>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
              <Eye size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Our Vision</h3>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-light">
              To be a leading global ecosystem of learning that cultivates scientific inquiries, creative expression, moral integrity, and social leadership among students.
            </p>
          </div>

          <div className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/40">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-4">
              <Flame size={20} />
            </div>
            <h3 className="font-bold text-lg mb-2">Our Mission</h3>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-light">
              To deliver academic instruction using modern techniques, stimulate independent problem solving, provide rich co-curricular opportunities, and build empathetic, responsible world citizens.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Infrastructure Details */}
      <ScrollReveal>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80" 
              alt="Infrastructure" 
              className="w-full h-80 object-cover rounded-2xl shadow-2xl border border-slate-300/20"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-montserrat text-indigo-950 dark:text-white">Our Premium Campus Infrastructure</h2>
            <p className="text-sm text-slate-655 dark:text-slate-300 font-light leading-relaxed">
              Spanning over a 15-acre green landscape, the Gravity School campus represents architectural beauty integrated with technological utilities. From air-conditioned smart classrooms and secure biometric gates to high-speed optical fiber networks, every aspect of our campus supports a secure learning atmosphere.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex gap-2 items-center">
                <Cpu size={16} className="text-blue-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Interactive VR Labs</span>
              </div>
              <div className="flex gap-2 items-center">
                <BookOpen size={16} className="text-blue-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">50K+ Book Digital Library</span>
              </div>
              <div className="flex gap-2 items-center">
                <Award size={16} className="text-blue-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">National standard Arenas</span>
              </div>
              <div className="flex gap-2 items-center">
                <Compass size={16} className="text-blue-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">AI Analytics Portal</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Achievements and awards */}
      <ScrollReveal>
        <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-800">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold font-montserrat bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Key Milestones & Awards</h3>
            <p className="text-xs text-slate-400 font-light mt-1">Some of the global and national certifications our school holds.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 space-y-2">
              <h4 className="text-blue-400 font-bold text-3xl">#1</h4>
              <p className="text-sm font-bold">Best STEM School</p>
              <p className="text-xs text-slate-400 font-light">Ranked #1 for smart classroom integrations in the tri-state area.</p>
            </div>
            <div className="p-4 space-y-2 border-y sm:border-y-0 sm:border-x border-slate-800">
              <h4 className="text-blue-400 font-bold text-3xl">ISO</h4>
              <p className="text-sm font-bold">9001:2015 Certified</p>
              <p className="text-xs text-slate-400 font-light">Certified for excellence in safety, sanitation, and curriculum compliance.</p>
            </div>
            <div className="p-4 space-y-2">
              <h4 className="text-blue-400 font-bold text-3xl">100%</h4>
              <p className="text-sm font-bold">University Success</p>
              <p className="text-xs text-slate-400 font-light">Of our graduates proceed directly to major global universities.</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Management team */}
      <ScrollReveal>
        <div className="space-y-6">
          <h3 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-white text-center">Our Management Committee</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {leadership.map((l, idx) => (
              <div key={idx} className="glassmorphism p-5 rounded-2xl text-center shadow-md border border-white/50 flex flex-col items-center">
                <img 
                  src={l.photo} 
                  alt={l.name} 
                  className="w-24 h-24 object-cover rounded-full border-2 border-blue-500/20 mb-3"
                />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{l.name}</h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{l.role}</p>
                <p className="text-[10px] text-slate-500 mt-2 font-light">{l.qual}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
