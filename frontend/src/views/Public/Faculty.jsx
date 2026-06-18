import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, Filter, BookOpen, Star, Mail, Phone, Award } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function Faculty() {
  const { teachers, subjects } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [expFilter, setExpFilter] = useState('');

  // Extract unique departments for filter dropdown
  const uniqueDepts = [...new Set(teachers.map(t => t.department))];
  // Use context subjects for subject filter — shows names, filters by code
  const subjectOptions = subjects && subjects.length > 0
    ? subjects
    : teachers.map(t => ({ code: t.subject, name: t.subject }));

  // Filtering logic
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.id.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter ? t.subject === subjectFilter : true;
    const matchesDept = deptFilter ? t.department === deptFilter : true;
    
    // Experience matching (extract number from string e.g., '12 Years')
    let expYears = parseInt(t.experience) || 0;
    let matchesExp = true;
    if (expFilter === '0-5') matchesExp = expYears <= 5;
    else if (expFilter === '6-10') matchesExp = expYears > 5 && expYears <= 10;
    else if (expFilter === '11+') matchesExp = expYears > 10;

    return matchesSearch && matchesSubject && matchesDept && matchesExp;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 text-slate-800 dark:text-slate-100 text-left">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold font-montserrat">Meet Our Educators</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">Learn more about our internationally acclaimed faculty driving educational innovations.</p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      {/* Search and Filter Panel */}
      <ScrollReveal>
        <div className="glassmorphism p-5 rounded-2xl shadow-md border border-white/50 space-y-4">
          <div className="grid md:grid-cols-12 gap-4">
            {/* Search bar */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by faculty name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subject Filter */}
            <div className="md:col-span-3">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <option value="">All Subjects</option>
                {subjectOptions.map((sub) => (
                  <option key={sub.id || sub.code} value={sub.code}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {uniqueDepts.map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div className="md:col-span-2">
              <select
                value={expFilter}
                onChange={(e) => setExpFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Experience</option>
                <option value="0-5">0 - 5 Years</option>
                <option value="6-10">6 - 10 Years</option>
                <option value="11+">11+ Years</option>
              </select>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Teachers Grid */}
      {filteredTeachers.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <ScrollReveal key={teacher.id} className="h-full">
              <div 
                className="bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group h-full justify-between"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={teacher.photo} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow-md">
                    {teacher.designation}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">{teacher.name}</h3>
                    <p className="text-[11px] text-slate-400">Employee ID: {teacher.id}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{teacher.subject} Teacher ({teacher.department} Dept)</p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3 text-[11px] text-slate-655 dark:text-slate-300 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={12} className="text-blue-500" />
                      <span><strong>Qual:</strong> {teacher.qualification}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star size={12} className="text-blue-500" />
                      <span><strong>Experience:</strong> {teacher.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-blue-500" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-blue-500" />
                      <span>{teacher.phone}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] text-slate-505 dark:text-slate-400 leading-normal">
                    <span className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-202 mb-0.5">
                      <Award size={10} className="text-amber-500" /> Key Accomplishments:
                    </span>
                    Outstanding educator award winner. Authored multiple national publications.
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glassmorphism rounded-2xl">
          <p className="text-slate-400 text-sm">No educators found matching your criteria. Try adjusting filters.</p>
        </div>
      )}
    </div>
  );
}
