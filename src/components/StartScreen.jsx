import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Optional: Faint noise SVG background
const NoiseBackground = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 0.07,
    background: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
  }} />
);

export default function StartScreen({ onStart }) {
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleEnter = () => {
    setLoading(true);
    setTimeout(() => {
      setShow(false);
      onStart();
    }, 400); // Short delay for button animation
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000',
            color: '#f5f5f5',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Sora", "Outfit", "Space Grotesk", system-ui, sans-serif',
            overflow: 'hidden',
          }}
        >
          <NoiseBackground />
          {/* Brand in top left */}
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

          {/* Main content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 520,
            margin: '0 auto',
            padding: '2.5rem 1.5rem 2rem 1.5rem',
            background: 'rgba(0,0,0,0.92)',
            borderRadius: 24,
            boxShadow: '0 2px 32px rgba(0,0,0,0.12)',
            border: '1px solid #222',
          }}>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              whileHover={{
                borderWidth: 3,
                x: 2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={handleEnter}
              style={{
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: '1.18rem',
                padding: '1.1rem 2.8rem',
                borderRadius: 100,
                border: '2px solid #fff',
                background: '#000',
                color: '#fff',
                cursor: 'pointer',
                outline: 'none',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: 'none',
                marginTop: 0,
                marginBottom: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
                borderWidth: loading ? 3 : 2,
                opacity: loading ? 0.7 : 1,
              }}
            >
              Let's Gear Up
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ opacity: 1, x: 8 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'inline-block',
                  fontSize: '1.3em',
                  marginLeft: 2,
                  color: 'inherit',
                  opacity: 0.7,
                }}
              >
                →
              </motion.span>
            </motion.button>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              style={{
                color: '#999',
                fontSize: '1.05rem',
                fontWeight: 400,
                margin: 0,
                marginTop: '2.2rem',
                textAlign: 'center',
                letterSpacing: '0.01em',
                maxWidth: 420,
              }}
            >
              This isn't just a locker room. It's your fan universe.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 