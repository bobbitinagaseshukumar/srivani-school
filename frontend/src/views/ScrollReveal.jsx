import React, { useEffect, useRef, useState } from 'react';

// Module level counter to assign alternating animations to reveal instances
let revealCounter = 0;

export default function ScrollReveal({ children, className = "" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [revealIndex] = useState(() => revealCounter++);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -40px 0px' 
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

  const isEven = revealIndex % 2 === 0;

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform preserve-3d ${
        isVisible 
          ? (isEven ? 'reveal-even-visible' : 'reveal-odd-visible') 
          : (isEven ? 'reveal-even-hidden' : 'reveal-odd-hidden')
      }`}
      style={{ backfaceVisibility: 'hidden' }}
    >
      {children}
    </div>
  );
}
