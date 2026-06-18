import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Shield, Eye, Flame, Award, Cpu, BookOpen, Compass, Mail, Phone, BadgeCheck } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

/* ── Subject display name map ── */
const SUBJECT_NAMES = {
  PHYSICS: 'Physics',
  MATHEMATICS: 'Mathematics',
  ENGLISH: 'English',
  TELUGU: 'Telugu',
  HINDI: 'Hindi',
  CHEMISTRY: 'Chemistry',
  BIOLOGY: 'Biology',
  SOCIALSTUDIES: 'Social Studies',
  GENERALKNOWLEDGE: 'General Knowledge',
  COMPUTER: 'Computer Science',
  COMPUTERSCIENCE: 'Computer Science',
  SCIENCE: 'Science',
  EVS: 'EVS',
  ART: 'Art & Craft',
  PE: 'Physical Education',
};
const subjectLabel = (s) => SUBJECT_NAMES[(s || '').toUpperCase().trim()] || s;

export default function About() {
  const { schoolInfo, managementCommittee, teachers } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 space-y-14 text-slate-800 dark:text-slate-100 text-left">

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-montserrat">About Our School</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light text-sm">
          Dedicated to excellence in learning since 2006 — Sri Vani Vidyanikethan, Nandyal.
        </p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      {/* History, Vision, Mission */}
      <ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, color: 'text-blue-600 bg-blue-500/10', title: 'Our History', content: schoolInfo?.history },
            { icon: Eye, color: 'text-emerald-600 bg-emerald-500/10', title: 'Our Vision', content: schoolInfo?.vision },
            { icon: Flame, color: 'text-purple-600 bg-purple-500/10', title: 'Our Mission', content: schoolInfo?.mission },
          ].map(({ icon: Icon, color, title, content }) => (
            <div key={title} className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/40">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">{content}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Infrastructure */}
      <ScrollReveal>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80"
            alt="Campus"
            className="w-full h-72 object-cover rounded-2xl shadow-2xl border border-slate-300/20"
          />
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-indigo-950 dark:text-white">Our Campus Infrastructure</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              Spanning a green campus, Sri Vani Vidyanikethan provides smart classrooms, a well-equipped science lab, 
              a digital library, and spacious sports grounds — all designed to give students the best environment to learn and grow.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {[
                [Cpu, 'Smart Classrooms'],
                [BookOpen, 'Digital Library'],
                [Award, 'Sports Grounds'],
                [Compass, 'Science Labs'],
              ].map(([Icon, label]) => (
                <div key={label} className="flex gap-2 items-center">
                  <Icon size={15} className="text-blue-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Achievements */}
      <ScrollReveal>
        <div className="bg-slate-900 text-white rounded-3xl p-7 sm:p-10 shadow-xl border border-slate-800">
          <div className="text-center mb-7">
            <h3 className="text-xl sm:text-2xl font-bold font-montserrat bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Key Milestones &amp; Awards
            </h3>
            <p className="text-xs text-slate-400 font-light mt-1">Recognitions our school holds with pride.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { val: '#1', title: 'Best School in Nandyal', desc: 'Ranked #1 for academic excellence and student welfare in the region.' },
              { val: 'Gold', title: 'Indian Talent Olympiad', desc: 'Students won Gold medals in Mathematics and Science Olympiads.' },
              { val: '100%', title: 'Board Pass Rate', desc: 'Consistent 100% pass results in SSC Board Examinations.' },
            ].map((a, i) => (
              <div key={i} className={`p-4 space-y-2 ${i === 1 ? 'border-y sm:border-y-0 sm:border-x border-slate-800' : ''}`}>
                <h4 className="text-blue-400 font-bold text-3xl">{a.val}</h4>
                <p className="text-sm font-bold">{a.title}</p>
                <p className="text-xs text-slate-400 font-light">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ── Our Faculty — auto-populated from Super Admin Teachers ── */}
      {teachers && teachers.length > 0 && (
        <ScrollReveal>
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold font-montserrat text-slate-900 dark:text-white">Our Faculty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1">
                Meet our dedicated educators — added and managed by the School Administrator.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {teachers.map((teacher) => {
                return (
                  <div
                    key={teacher.id}
                    className="glassmorphism p-5 rounded-2xl text-center shadow-md border border-white/50 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300 card-3d"
                  >
                    <img
                      src={teacher.photo}
                      alt={teacher.name}
                      className="w-20 h-20 object-cover rounded-full border-2 border-blue-500/30 mb-3 shadow"
                    />
                    {/* Teacher ID badge */}
                    <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full mb-1.5 flex items-center gap-1">
                      <BadgeCheck size={9} /> ID: {teacher.id}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{teacher.name}</h4>
                    {/* Subject — displayed with proper name */}
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                      {subjectLabel(teacher.subject)}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{teacher.designation || 'Teacher'}</p>
                    <p className="text-[10px] text-slate-400 font-light mt-0.5">{teacher.qualification}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{teacher.experience}</p>

                    <div className="w-full border-t border-slate-100 dark:border-slate-800 mt-3 pt-3 space-y-1 text-[10px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 justify-center">
                        <Mail size={9} className="shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      {teacher.phone && (
                        <div className="flex items-center gap-1.5 justify-center">
                          <Phone size={9} className="shrink-0" />
                          <span>{teacher.phone}</span>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Management Committee */}
      {managementCommittee && managementCommittee.length > 0 && (
        <ScrollReveal>
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold font-montserrat text-slate-900 dark:text-white text-center">
              Our Management Committee
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {managementCommittee.map((l, idx) => (
                <div key={l.id || idx} className="glassmorphism p-5 rounded-2xl text-center shadow-md border border-white/50 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                  <img
                    src={l.photo}
                    alt={l.name}
                    className="w-24 h-24 object-cover rounded-full border-2 border-blue-500/20 mb-3 shadow"
                  />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{l.name}</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{l.role}</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-light">{l.qual}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
