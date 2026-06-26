'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppleHelloEffectJapanese } from './AppleHelloEffectJapanese';
import { triggerPageReveal } from './PageTransition';

export default function PageLoader() {
  const [done, setDone] = useState(false);

  // Lock scroll while loader is visible
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, []);

  const handleDone = () => {
    document.documentElement.style.overflow = '';
    // Tell PageTransition to start revealing NOW
    triggerPageReveal();
    // Then fade out loader
    setDone(true);
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background gap-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >

          <div className="w-[min(580px,80vw)] text-primary">
            <AppleHelloEffectJapanese onAnimationComplete={handleDone} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}