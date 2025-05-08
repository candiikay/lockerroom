import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    const start = Date.now();
    const duration = 1800; // ms
    function animate() {
      const elapsed = Date.now() - start;
      const percent = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(percent);
      if (percent < 100) {
        frame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => onComplete && onComplete(), 350);
      }
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#000',
          color: '#f5f5f5',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Sora", "Outfit", "Space Grotesk", system-ui, sans-serif',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 32,
          left: 40,
          fontSize: '1.1rem',
          color: '#999',
          letterSpacing: '0.12em',
          fontWeight: 600,
          textTransform: 'uppercase',
          opacity: 0.85,
          userSelect: 'none',
        }}>
          4TH KIT
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          style={{
            fontWeight: 700,
            fontSize: '2.1rem',
            letterSpacing: '0.04em',
            color: '#fff',
            margin: 0,
            marginBottom: '2.2rem',
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          Loading your locker…
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '0.08em',
            marginBottom: '1.2rem',
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'center',
          }}
        >
          {progress}%
        </motion.div>
        <div style={{
          width: 220,
          height: 7,
          background: '#181818',
          borderRadius: 5,
          overflow: 'hidden',
          margin: '0 auto',
          marginBottom: 0,
          border: '1px solid #222',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
            style={{
              height: '100%',
              background: '#fff',
              borderRadius: 5,
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 