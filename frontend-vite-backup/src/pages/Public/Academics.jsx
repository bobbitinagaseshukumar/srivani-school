import React from 'react';
import { Calendar, Layers, BookOpen, Compass, Award, CircleHelp } from 'lucide-react';

export default function Academics() {
  const courses = [
    { grade: 'Primary School (Grades 1-5)', focus: 'Foundational Knowledge', desc: 'Focuses on basic literacy, numeracy, social science, environment, and physical development. Integrated with play-based modules.', subjects: ['English', 'Mathematics', 'General Science', 'Social Studies', 'Art & Craft', 'Physical Education'] },
    { grade: 'Middle School (Grades 6-8)', focus: 'Exploratory & Analytical Learning', desc: 'Introduces advanced analytical concepts in sciences, structured algebra, language structure, and computer programming basics.', subjects: ['English Literature', 'Mathematics (Pre-Algebra)', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Computer Science (Scratch/Python)'] },
    { grade: 'High School (Grades 9-10)', focus: 'Specialized & Secondary Board Prep', desc: 'Prepares students for secondary board examinations with robust conceptual scientific and mathematical labs.', subjects: ['Physics', 'Chemistry', 'Biology', 'Advanced Algebra', 'Social Sciences', 'Computer Science (Python/Web Intro)'] }
  ];

  const calendarEvents = [
    { date: 'Aug 17, 2026', title: 'Fall Semester Orientation', type: 'Academic' },
    { date: 'Sep 05, 2026', title: 'Labor Day (School Closed)', type: 'Holiday' },
    { date: 'Oct 12-16, 2026', title: 'Unit Test I Schedule', type: 'Examination' },
    { date: 'Nov 26-27, 2026', title: 'Thanksgiving Break', type: 'Holiday' },
    { date: 'Dec 14-18, 2026', title: 'Midterm Board Examinations', type: 'Examination' },
    { date: 'Jan 05, 2027', title: 'Spring Semester Begins', type: 'Academic' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 text-slate-800 dark:text-slate-100 text-left">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold font-montserrat">Academic Curriculum</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">Explore classes offered, academic schedules, exam timetables, and grading rules.</p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      {/* Curriculum Levels */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="text-blue-600" size={24} /> Program Levels & Subjects
        </h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <div key={idx} className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/40 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider bg-blue-500/10 px-2 py-1 rounded-md">{course.focus}</span>
                <h3 className="font-extrabold text-lg mt-3 mb-1.5">{course.grade}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">{course.desc}</p>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">Core Subjects:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {course.subjects.map((sub, i) => (
                    <span key={i} className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-1 rounded-md border border-slate-200/40 dark:border-slate-850">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar & Exam Schedule */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Academic Calendar */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} /> Academic Calendar
          </h2>
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {calendarEvents.map((ev, i) => (
                <div key={i} className="p-4 flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white">{ev.title}</p>
                    <p className="text-[10px] text-slate-400">{ev.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    ev.type === 'Holiday' ? 'bg-red-500/10 text-red-500' :
                    ev.type === 'Examination' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {ev.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Examination & Evaluation Process */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="text-blue-600" size={24} /> Result & Grading Process
          </h2>
          <div className="glassmorphism p-6 rounded-2xl shadow-lg border border-white/40 space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-indigo-950 dark:text-white">Continuous Assessment Model</h3>
              <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed font-light">
                Our grading incorporates standard examinations alongside practical research assignments, laboratory findings, presentations, and interactive class activities.
              </p>
            </div>

            <div className="border-t border-slate-200/50 dark:border-slate-850 pt-4 space-y-2">
              <h4 className="font-bold text-xs">Grading Scheme:</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-800">
                  <p className="font-extrabold text-blue-600 text-sm">A+</p>
                  <p className="text-[8px] text-slate-400">90% - 100%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-800">
                  <p className="font-extrabold text-emerald-600 text-sm">A</p>
                  <p className="text-[8px] text-slate-400">80% - 89%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-800">
                  <p className="font-extrabold text-amber-600 text-sm">B</p>
                  <p className="text-[8px] text-slate-400">70% - 79%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-800">
                  <p className="font-extrabold text-red-650 text-sm">C / F</p>
                  <p className="text-[8px] text-slate-400">&lt; 70%</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/25 p-3.5 rounded-xl text-xs flex gap-2.5 items-start text-blue-800 dark:text-blue-300">
              <CircleHelp size={18} className="shrink-0 mt-0.5" />
              <p className="font-light leading-normal">
                <strong>Did you know?</strong> Parents receive instant push alerts and emails as soon as report cards are validated and published by subject teachers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
