import React, { useState } from 'react';
import { Image, Video, Compass, Heart, ZoomIn, X } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  const categories = ['All', 'Annual Day', 'Sports', 'Cultural Programs', 'Classroom Activities', 'Science Exhibitions'];

  const items = [
    { title: 'Physics Fair experimentation', category: 'Science Exhibitions', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80' },
    { title: 'Interactive Coding Seminar', category: 'Classroom Activities', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80' },
    { title: 'Graduation Ceremony 2025', category: 'Annual Day', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80' },
    { title: 'Track and Field Athletics', category: 'Sports', img: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80' },
    { title: 'Music and Choral Orchestra', category: 'Cultural Programs', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80' },
    { title: 'Robotics Workshop Competition', category: 'Science Exhibitions', img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80' },
    { title: 'Chemistry Lab Work', category: 'Classroom Activities', img: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&auto=format&fit=crop&q=80' },
    { title: 'Basketball Inter-school Final', category: 'Sports', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80' }
  ];

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 text-slate-800 dark:text-slate-100 text-left relative">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold font-montserrat">School Gallery</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">Explore snapshot archives of events, festivals, sports, and laboratory activities.</p>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-slate-200/60 dark:border-slate-800 pb-4">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <div 
            key={idx} 
            className="group bg-white dark:bg-slate-800/40 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800 relative cursor-pointer"
            onClick={() => setLightboxImg(item)}
          >
            <div className="h-56 overflow-hidden relative">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <ZoomIn size={18} />
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/90 dark:bg-slate-900/90 absolute bottom-0 inset-x-0 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800 transform translate-y-1 group-hover:translate-y-0 transition-transform">
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{item.category}</span>
              <h4 className="font-semibold text-xs text-slate-800 dark:text-white truncate mt-0.5">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4">
          <button 
            className="absolute top-6 right-6 text-white hover:text-slate-300 bg-slate-800/50 p-2 rounded-full backdrop-blur-md"
            onClick={() => setLightboxImg(null)}
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl relative bg-slate-900">
            <img 
              src={lightboxImg.img} 
              alt={lightboxImg.title} 
              className="max-h-[70vh] w-auto object-contain mx-auto"
            />
            <div className="p-4 text-center text-white bg-slate-950/80">
              <span className="text-[10px] font-bold text-blue-400 uppercase">{lightboxImg.category}</span>
              <h3 className="font-bold text-base mt-1">{lightboxImg.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
