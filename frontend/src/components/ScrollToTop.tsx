'use client';

import {useEffect, useState} from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollUp}
      className="to-top"
      style={{display: 'block'}}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
