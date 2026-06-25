'use client';

import { useEffect, useState } from 'react';

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : 'blur(8px)',
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.7s ease, filter 0.7s ease, transform 0.7s ease',
      }}
    >
      {children}
    </div>
  );
}