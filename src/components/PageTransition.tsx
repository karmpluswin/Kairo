'use client';

import { useState, useEffect } from 'react';

// Global signal — PageLoader calls this when it finishes
let _onReveal: (() => void) | null = null;
export function triggerPageReveal() {
  _onReveal?.();
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Register callback — loader will call triggerPageReveal() when done
    _onReveal = () => {
      // Small buffer after loader fade starts
      setTimeout(() => setVisible(true), 100);
    };
    return () => { _onReveal = null; };
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : 'blur(14px)',
        transform: visible ? 'translateY(0px)' : 'translateY(18px)',
        transition: visible
          ? 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)'
          : 'none',
        willChange: 'opacity, filter, transform',
      }}
    >
      {children}
    </div>
  );
}