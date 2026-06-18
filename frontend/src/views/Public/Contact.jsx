import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle, Globe, MessageSquare } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

export default function Contact() {
  const { submitEnquiry, schoolInfo } = useContext(AppContext);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', role: 'Parent', phone: '', email: '', subject: '', message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Please fill in Name, Phone Number, and Message.');
      return;
    }
    submitEnquiry({
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      email: formData.email,
      subject: formData.subject || 'General Inquiry',
      message: formData.message
    });
    setSubmitted(true);
  };

  const addr = schoolInfo?.address || '3-89, Pedda Kottala St, Kottala, Andhra Pradesh 518502';
  const phone = schoolInfo?.phone || '+91 98765-43210';
  const email = schoolInfo?.email || 'office@srivani.edu';

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 space-y-14 text-slate-800 dark:text-slate-100 text-left">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-montserrat">Contact Us</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light text-sm">
          Reach out to Sri Vani Vidyanikethan. Send your enquiry and our admin team will contact you directly.
        </p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">

        {/* Info Column */}
        <div className="lg:col-span-5 space-y-5">
          <ScrollReveal>
            <div className="glassmorphism p-6 rounded-2xl border border-white/40 shadow-xl space-y-5">
              <h3 className="font-extrabold text-lg text-indigo-950 dark:text-white">School Contact Info</h3>
              <div className="space-y-4 text-xs font-light text-slate-700 dark:text-slate-300">
                <div className="flex gap-3 items-start">
                  <MapPin size={17} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Address</p>
                    <p className="mt-0.5">{addr}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Phone size={17} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Phone</p>
                    <a href={`tel:${phone.replace(/\s/g,'')}`} className="mt-0.5 block text-blue-600 dark:text-blue-400 font-semibold hover:underline">{phone}</a>
                    <p className="text-[10px] text-slate-400 mt-0.5">Mon–Sat, 9:00 AM – 5:00 PM IST</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Mail size={17} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Email</p>
                    <p className="mt-0.5">{email}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="glassmorphism p-5 rounded-2xl border border-white/40 shadow-md">
              <h4 className="font-bold text-sm text-indigo-950 dark:text-white mb-3 flex items-center gap-1.5">
                <Globe size={15} className="text-blue-500" /> Follow Us
              </h4>
              <div className="flex flex-wrap gap-2">
                {[['Facebook','bg-blue-600'],['Instagram','bg-pink-600'],['YouTube','bg-red-600'],['Twitter/X','bg-slate-800']].map(([name, bg]) => (
                  <span key={name} className={`${bg} text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer`}>{name}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Enquiry Form */}
        <div className="lg:col-span-7">
          <ScrollReveal>
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 lg:p-8">
              {submitted ? (
                <div className="text-center py-10 space-y-4 max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle size={34} />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">Enquiry Submitted!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    Thank you! Our admin team has received your message and will contact you on your phone number shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', role: 'Parent', phone: '', email: '', subject: '', message: '' }); }}
                    className="bg-blue-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <MessageSquare size={18} className="text-blue-600" /> Send Us an Enquiry
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1">Fill in your details and we'll call you back directly.</p>
                    <div className="w-10 h-0.5 bg-blue-600 rounded mt-3"></div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">Your Full Name *</label>
                      <input type="text" required value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Ramesh Kumar" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">I am a...</label>
                      <select value={formData.role}
                        onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Parent">Parent</option>
                        <option value="Student">Student</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Guest">General Public</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* ★ PHONE — primary contact for Super Admin to call back */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">
                        📞 Phone Number * <span className="text-blue-500 normal-case font-normal">(We'll call you)</span>
                      </label>
                      <input type="tel" required value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 dark:border-blue-600 bg-white/80 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                        placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">Email (optional)</label>
                      <input type="email" value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. name@email.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">Subject</label>
                    <input type="text" value={formData.subject}
                      onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Admission inquiry for Class 1" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-500">Your Message *</label>
                    <textarea rows={4} required value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us how we can help you...">
                    </textarea>
                  </div>

                  <button type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-8 py-3 rounded-xl shadow transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Submit Enquiry <Send size={13} />
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Map */}
      <ScrollReveal>
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold font-montserrat text-slate-900 dark:text-white">Our Campus Location</h3>
          <div className="w-full h-64 sm:h-80 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden shadow-lg relative bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="relative z-10 text-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
                <MapPin size={22} />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Sri Vani Vidyanikethan, Kottala</h4>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto">{addr}</p>
              <a href="https://maps.app.goo.gl/XcJqnyS4ucd1yjxLA" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition-all">
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
