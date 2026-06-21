import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Calendar, Layers, Award, CircleHelp } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function Academics() {
  const { academicCalendar, academicPrograms, subjects, gradingProcess, gradingScheme } = useContext(AppContext);
  // Map code -> display name for subject labels
  const subjectName = (code) => {
    const found = (subjects || []).find(s => s.code === code);
    return found ? found.name : code;
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 space-y-14 text-slate-800 dark:text-slate-100 text-left">

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-montserrat">Academic Curriculum</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light text-sm">
          Sri Vani Vidyanikethan offers structured education from Playclass to Class 10 — nurturing every stage of a child's growth.
        </p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      {/* Program Levels */}
      <ScrollReveal>
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="text-blue-600 shrink-0" size={22} /> Program Levels &amp; Subjects
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(academicPrograms || []).map((course, idx) => (
              <div
                key={course.id || idx}
                className="glassmorphism p-5 sm:p-6 rounded-2xl shadow-lg border border-white/40 flex flex-col justify-between space-y-4 card-3d hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider bg-blue-500/10 px-2 py-1 rounded-md">
                    {course.focus}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg mt-3 mb-1.5">{course.grade}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">{course.desc}</p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">Core Subjects:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(course.subjects || []).map((sub, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 text-[10px] px-2 py-1 rounded-md font-medium"
                        >
                          {subjectName(sub)}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Calendar & Grading */}
      <div className="grid lg:grid-cols-2 gap-10">

        {/* Academic Calendar — from Super Admin */}
        <ScrollReveal>
          <div className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="text-blue-600 shrink-0" size={22} /> Academic Calendar 2026–27
            </h2>
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              {(academicCalendar || []).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No events scheduled yet.</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(academicCalendar || []).map((ev, i) => (
                    <div key={ev.id || i} className="p-3.5 sm:p-4 flex justify-between items-center text-xs hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors">
                      <div className="space-y-0.5 flex-1 min-w-0 pr-3">
                        <p className="font-bold text-slate-900 dark:text-white break-words whitespace-normal">{ev.title}</p>
                        <p className="text-[10px] text-slate-400">{ev.date}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase whitespace-nowrap ${
                        ev.type === 'Holiday'     ? 'bg-red-500/10 text-red-500' :
                        ev.type === 'Examination' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-blue-500/10 text-blue-500'
                      }`}>
                        {ev.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Grading Scheme */}
        <ScrollReveal>
          <div className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="text-blue-600 shrink-0" size={22} /> Result &amp; Grading Process
            </h2>
            <div className="glassmorphism p-5 sm:p-6 rounded-2xl shadow-lg border border-white/40 space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-indigo-950 dark:text-white">{(gradingProcess && gradingProcess.title) || 'Continuous Assessment Model'}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                  {(gradingProcess && gradingProcess.description) || 'Our grading incorporates standard examinations alongside practical research assignments, laboratory findings, presentations, and interactive class activities.'}
                </p>
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-850 pt-4 space-y-2">
                <h4 className="font-bold text-xs">Grading Scheme:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                  {(gradingScheme || [
                    { grade: 'A+', range: '90–100%', color: 'text-blue-600' },
                    { grade: 'A',  range: '80–89%',  color: 'text-emerald-600' },
                    { grade: 'B',  range: '70–79%',  color: 'text-amber-600' },
                    { grade: 'C/F',range: '< 70%',   color: 'text-red-500' },
                  ]).map((g, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-800 flex flex-col justify-center min-h-[56px]">
                      <p className={`font-extrabold text-sm ${g.color && !g.color.startsWith('#') ? g.color : ''}`} style={g.color && g.color.startsWith('#') ? { color: g.color } : {}}>{g.grade}</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">{g.range.includes('%') ? g.range : `${g.range}%`}</p>
                      {g.description && <p className="text-[7px] text-slate-500 dark:text-slate-450 italic mt-0.5 truncate" title={g.description}>{g.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/25 p-3.5 rounded-xl text-xs flex gap-2.5 items-start text-blue-800 dark:text-blue-300">
                <CircleHelp size={16} className="shrink-0 mt-0.5" />
                <p className="font-light leading-normal">
                  <strong>Did you know?</strong> Parents receive instant alerts as soon as report cards are validated and published by subject teachers.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
