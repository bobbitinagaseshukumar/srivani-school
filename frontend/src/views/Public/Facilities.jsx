import React, { useContext } from 'react';
import { Compass, Book, Monitor, Cpu, Award, Navigation, Home } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import ScrollReveal from '../ScrollReveal';

const iconMap = { Book, Monitor, Cpu, Award, Navigation, Home, Compass };

export default function Facilities() {
  const { campusFacilities } = useContext(AppContext);
  const facilities = (campusFacilities || []).map((fac) => ({
    ...fac,
    icon: iconMap[fac.icon] || Compass
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 text-slate-800 dark:text-slate-100 text-left">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold font-montserrat">Campus Facilities</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">Take a look inside the facilities that provide our students with a nurturing ecosystem.</p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac, idx) => (
          <ScrollReveal key={fac.id || idx} className="h-full">
            <div 
              className="glassmorphism rounded-2xl p-6 shadow-xl border border-white/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
                  <fac.icon size={24} />
                </div>
                <h3 className="font-extrabold text-lg text-indigo-950 dark:text-white mb-1">{fac.title}</h3>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mb-3">Capacity: {fac.cap}</p>
                <p className="text-xs text-slate-655 dark:text-slate-400 font-light leading-relaxed mb-4">{fac.desc}</p>
              </div>
              
              <div className="border-t border-slate-150/40 dark:border-slate-800 pt-3">
                <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-2">Key Highlights:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(fac.features || []).map((feat, i) => (
                    <span key={i} className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded border border-slate-200/50 dark:border-slate-800">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
