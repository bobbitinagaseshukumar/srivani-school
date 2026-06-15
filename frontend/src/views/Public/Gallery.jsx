import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Image, Video, ZoomIn, X } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const CATEGORIES = ['All', 'Sports', 'Annual Day', 'Special Events', 'Cultural Programs', 'Science Exhibition', 'Classroom Activities', 'Independence Day', 'Republic Day', 'Teachers Day', 'Other'];

export default function Gallery() {
  const { galleryItems } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);

  // Derive categories that actually have content
  const usedCategories = ['All', ...new Set((galleryItems || []).map(i => i.category))];
  const displayCategories = CATEGORIES.filter(c => usedCategories.includes(c));

  const filteredItems = selectedCategory === 'All'
    ? (galleryItems || [])
    : (galleryItems || []).filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 space-y-8 text-slate-800 dark:text-slate-100 text-left relative">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-montserrat">School Gallery</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light text-sm">Explore photos and videos from Sports, Annual Day, Special Events, Festivals and more.</p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      {/* Stats row */}
      <ScrollReveal>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: 'Total Media', value: (galleryItems || []).length, color: 'text-blue-600' },
            { label: 'Photos', value: (galleryItems || []).filter(g => g.type === 'image').length, color: 'text-emerald-600' },
            { label: 'Videos', value: (galleryItems || []).filter(g => g.type === 'video').length, color: 'text-purple-600' },
          ].map((s, i) => (
            <div key={i} className="glassmorphism px-5 py-3 rounded-2xl text-center shadow border border-white/40">
              <p className={`font-extrabold text-xl ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Category Tabs */}
      <ScrollReveal>
        <div className="flex flex-wrap gap-2 justify-center border-b border-slate-200/60 dark:border-slate-800 pb-4 overflow-x-auto">
          {displayCategories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-24 text-slate-400">
          <Image size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-base font-semibold">No media found in this category.</p>
          <p className="text-xs mt-1">Check back soon — new photos and videos are added regularly.</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredItems.map((item, idx) => (
          <ScrollReveal key={item.id || idx} className="h-full">
            <div
              className="group bg-white dark:bg-slate-800/40 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800 relative cursor-pointer h-full card-3d hover:-translate-y-1 transition-all duration-300"
              onClick={() => setLightboxItem(item)}
            >
              <div className="h-44 sm:h-56 overflow-hidden relative">
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                    <video src={item.url} className="w-full h-full object-cover opacity-70" muted />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                        <Video size={22} className="text-blue-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn size={18} />
                  </div>
                </div>
                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1 ${item.type === 'video' ? 'bg-purple-600 text-white' : 'bg-blue-600/80 text-white'}`}>
                    {item.type === 'video' ? <Video size={9} /> : <Image size={9} />} {item.type}
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-white/90 dark:bg-slate-900/90 absolute bottom-0 inset-x-0 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{item.category}</span>
                <h4 className="font-semibold text-xs text-slate-800 dark:text-white truncate mt-0.5">{item.title}</h4>
                {item.date && <p className="text-[9px] text-slate-400 mt-0.5">{item.date}</p>}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 bg-slate-950/92 z-50 flex items-center justify-center p-4" onClick={() => setLightboxItem(null)}>
          <button
            className="absolute top-5 right-5 text-white hover:text-slate-300 bg-slate-800/60 p-2 rounded-full backdrop-blur-md z-10"
            onClick={() => setLightboxItem(null)}
          >
            <X size={24} />
          </button>
          <div
            className="max-w-4xl w-full max-h-[85vh] overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl relative bg-slate-900"
            onClick={e => e.stopPropagation()}
          >
            {lightboxItem.type === 'video' ? (
              <video
                src={lightboxItem.url}
                className="max-h-[70vh] w-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.title}
                className="max-h-[70vh] w-full object-contain mx-auto"
              />
            )}
            <div className="p-4 text-center text-white bg-slate-950/80">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{lightboxItem.category}</span>
              <h3 className="font-bold text-base mt-1">{lightboxItem.title}</h3>
              {lightboxItem.description && <p className="text-xs text-slate-400 mt-1">{lightboxItem.description}</p>}
              {lightboxItem.date && <p className="text-[10px] text-slate-500 mt-1">{lightboxItem.date}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
