import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle, Globe } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function Contact() {
  const { createSupportTicket, addAuditLog } = useContext(AppContext);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Parent',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in name, email, and message.');
      return;
    }
    // Create support ticket in Context database
    createSupportTicket({
      name: formData.name,
      role: formData.role,
      subject: formData.subject || 'General Inquiry',
      description: formData.message
    });
    addAuditLog(formData.name, formData.role, `Raised support helpdesk ticket: ${formData.subject}`);
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 text-slate-800 dark:text-slate-100 text-left">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold font-montserrat">Contact Us</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">Get in touch with our campuses. Raise a support ticket directly with our administration.</p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      {/* Info grids */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <ScrollReveal>
            <div className="glassmorphism p-6 rounded-2xl border border-white/40 shadow-xl space-y-4">
              <h3 className="font-extrabold text-lg text-indigo-950 dark:text-white">School Central Desk</h3>
              
              <div className="space-y-4 text-xs font-light text-slate-700 dark:text-slate-350">
                <div className="flex gap-3 items-start">
                  <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Head Office Address</p>
                    <p className="mt-0.5">3-89, Pedda Kottala St, Pedda Kottala, Kottala, Andhra Pradesh 518502</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Phone size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Call Desk Support</p>
                    <p className="mt-0.5">Admin Office: +91 98765-43210 (9:30 AM - 5:00 PM IST)</p>
                    <p>Admissions Hot: +91 98765-43211</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Mail size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Email Address Channels</p>
                    <p className="mt-0.5">General: office@srivani.edu</p>
                    <p>Admissions: admissions@srivani.edu</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Social Media Links */}
          <ScrollReveal>
            <div className="glassmorphism p-6 rounded-2xl border border-white/40 shadow-md">
              <h4 className="font-bold text-sm text-indigo-950 dark:text-white mb-3 flex items-center gap-1">
                <Globe size={16} className="text-blue-500" /> Digital Social Media
              </h4>
              <div className="flex gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer">Facebook</span>
                <span className="bg-sky-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer">Twitter</span>
                <span className="bg-pink-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer">Instagram</span>
                <span className="bg-red-650 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer">YouTube</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Contact Form / Ticket Submission */}
        <div className="lg:col-span-7">
          <ScrollReveal>
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 lg:p-8">
              {submitted ? (
                <div className="text-center py-8 space-y-4 max-w-sm mx-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-605 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">Ticket Submitted</h3>
                  <p className="text-xs text-slate-505 dark:text-slate-405 font-light leading-relaxed">
                    Your message has been converted to an active support ticket. Administrators can review, assign priorities, and response from their portal.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', role: 'Parent', email: '', subject: '', message: '' });
                    }}
                    className="bg-blue-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow"
                  >
                    Raise Another Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Helpdesk Submission</h3>
                  <p className="text-xs text-slate-404 font-light">Submit your query. Responses from admin appear in notifications logs once addressed.</p>
                  <div className="w-10 h-0.5 bg-blue-600 rounded"></div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-505">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-202 dark:border-slate-800 bg-white/70 dark:bg-slate-909/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Robert Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-550">I am a...</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-202 dark:border-slate-800 bg-white/70 dark:bg-slate-909/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Parent">Parent</option>
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Guest">General Public</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-550">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-202 dark:border-slate-800 bg-white/70 dark:bg-slate-909/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. mail@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-550">Inquiry Subject</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-202 dark:border-slate-800 bg-white/70 dark:bg-slate-909/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Transport Bus Route 44 delay"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-550">Your Message Description</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-202 dark:border-slate-800 bg-white/70 dark:bg-slate-909/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter details of your help request here..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition-transform hover:-translate-y-0.5 flex items-center gap-1"
                  >
                    Send Support Ticket <Send size={12} />
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Google Maps Mockup */}
      <ScrollReveal>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold font-montserrat text-slate-900 dark:text-white">Our Campus Map Location</h3>
          <div className="w-full h-80 rounded-3xl border border-slate-202/50 dark:border-slate-800/80 overflow-hidden shadow-lg relative bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
            {/* Visual premium map representation */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]"></div>
            <div className="absolute w-48 h-48 bg-blue-500/5 rounded-full blur-xl animate-float-slow"></div>
            <div className="absolute w-32 h-32 bg-indigo-500/5 rounded-full blur-lg animate-float-fast"></div>

            <div className="relative z-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
                <MapPin size={22} />
              </div>
              <h4 className="font-extrabold text-sm text-slate-909 dark:text-white">Sri Vani Vidyanikethan, Kottala Campus</h4>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                3-89, Pedda Kottala St, Pedda Kottala, Kottala, Andhra Pradesh 518502
              </p>
              <div className="pt-1">
                <a 
                  href="https://maps.app.goo.gl/XcJqnyS4ucd1yjxLA?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition-all"
                >
                  Open Google Maps Route
                </a>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
