import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ArrowRight, FileText, CheckCircle2, DollarSign, HelpCircle } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function Admissions() {
  const { addNotification, addAuditLog, fees, submitAdmission, requiredDocuments, starredFormFields } = useContext(AppContext);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: '',
    grade: 'Class 10',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    prevSchool: '',
    whatsappNumber: ''
  });

  const renderStar = (fieldName) => {
    if (starredFormFields && starredFormFields[fieldName]) {
      return <span className="text-amber-500 ml-1" title="Highlighted field">★</span>;
    }
    return null;
  };

  const steps = [
    { title: 'Online Registration', desc: 'Fill the online application form with parent and student details.' },
    { title: 'Document Verification', desc: 'Upload or present academic records, birth certificate, and ID.' },
    { title: 'Interactive Assessment', desc: 'Student participates in a brief cognitive and creative diagnostic.' },
    { title: 'Fee Payment', desc: 'Secure the enrollment seat by paying the term admission fee.' }
  ];

  const requirements = requiredDocuments || [
    'Birth Certificate (Original copy for verification)',
    'Previous School Report Cards (Last 2 academic terms)',
    'Transfer/School Leaving Certificate',
    'Vaccination and medical records',
    '3 recent passport-sized photos of the student',
    'Proof of Address (Utility bill/Rent agreement)'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.parentEmail || !formData.parentPhone) {
      alert('Please fill in student name, email, and phone contact.');
      return;
    }
    // Submit via context helper (handles notification, audit log, and storage)
    submitAdmission(formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 text-slate-800 dark:text-slate-100 text-left">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold font-montserrat">Online Admissions</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">Enroll your child in our programs. Read guidelines, checklists, and submit the form.</p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      {/* Admission Process Steps */}
      <ScrollReveal>
        <div className="space-y-6">
          <h3 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-white">Our Admission Process</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div key={i} className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md relative">
                <div className="absolute top-4 right-4 text-3xl font-extrabold text-blue-600/10 font-mono">0{i+1}</div>
                <h4 className="font-bold text-sm mb-1.5 text-indigo-950 dark:text-white pr-8">{st.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Required Docs & Fees */}
      <ScrollReveal>
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Required Documents */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glassmorphism p-6 rounded-2xl border border-white/40 shadow-lg space-y-4">
              <h3 className="font-bold text-lg text-indigo-950 dark:text-white flex items-center gap-1.5">
                <FileText className="text-blue-600" size={20} /> Required Documents
              </h3>
              <ul className="space-y-2 text-xs font-light text-slate-655 dark:text-slate-355">
                {requirements.map((req, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fee Structure Table */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6 space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-extrabold text-xs shrink-0">₹</span> Annual Fee Structure (Academic Term)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                      <th className="py-2.5">Class / Grade</th>
                      <th className="py-2.5">Academic Year</th>
                      <th className="py-2.5">Tuition Fee</th>
                      <th className="py-2.5">Lab Fee</th>
                      <th className="py-2.5">Bus Fee</th>
                      <th className="py-2.5">Books Fee</th>
                      <th className="py-2.5 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-light">
                    {fees && fees.map((f, i) => {
                      const busFVal = f.busFee !== undefined ? f.busFee : 250;
                      const booksFVal = f.booksFee !== undefined ? f.booksFee : 180;
                      return (
                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="py-3 font-semibold text-slate-900 dark:text-white">{f.class}</td>
                          <td className="py-3 font-mono">{f.year}</td>
                          <td className="py-3 font-mono text-emerald-650 dark:text-emerald-400">₹{f.tuitionFee}</td>
                          <td className="py-3 font-mono text-blue-650 dark:text-blue-400">₹{f.labFee}</td>
                          <td className="py-3 font-mono text-indigo-650 dark:text-indigo-400">₹{busFVal}</td>
                          <td className="py-3 font-mono text-amber-650 dark:text-amber-400">₹{booksFVal}</td>
                          <td className="py-3 font-mono font-bold text-right text-slate-900 dark:text-white">
                            ₹{f.tuitionFee + f.labFee + busFVal + booksFVal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Online Application Form */}
      <ScrollReveal>
        <div className="glassmorphism p-6 lg:p-10 rounded-3xl border border-white/50 shadow-2xl relative overflow-hidden">
          {submitted ? (
            <div className="text-center py-10 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">Application Received!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                Thank you for submitting the registration. Our admissions desk has recorded the details. An email orienting verification steps will be dispatched to <strong>{formData.parentEmail}</strong> shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ studentName: '', dob: '', gender: '', grade: 'Class 10', parentName: '', parentEmail: '', parentPhone: '', address: '', prevSchool: '', whatsappNumber: '' });
                }}
                className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-extrabold font-montserrat text-indigo-950 dark:text-white">Online Application Form</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Submit basic student criteria. Admissions desk monitors applications in the admin dashboard panel.</p>
              <div className="w-16 h-0.5 bg-blue-600 rounded"></div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Student Full Name{renderStar('studentName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Date of Birth{renderStar('dob')}</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Target Admission Grade{renderStar('grade')}</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Playclass">Playclass</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Parent / Guardian Name{renderStar('parentName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Parent Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Parent Email Address{renderStar('parentEmail')}</label>
                  <input
                    type="email"
                    required
                    value={formData.parentEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. parent@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Parent Phone Number{renderStar('parentPhone')}</label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 555-xxxx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">WhatsApp Number{renderStar('whatsappNumber')}</label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="WhatsApp number (optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Residential Address{renderStar('address')}</label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Street address, City, Zip Code"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                Submit Registration Form <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
