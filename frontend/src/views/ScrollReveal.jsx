import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, className = "" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -60px 0px' // Triggers slightly before element enters viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform perspective-1000 ${
        isVisible 
          ? 'opacity-100 rotate-x-0' 
          : 'opacity-0 -rotate-x-12'
      }`}
      style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
    >
      {children}
    </div>
  );
}
