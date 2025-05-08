import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IframePanel({ isOpen, url, title, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '40vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px 0 0 16px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                color: '#333',
                fontFamily: 'Arial',
                fontWeight: '500',
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                e.target.style.color = '#ff69b4';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#666';
              }}
            >
              ×
            </button>
          </div>

          {/* Iframe Container */}
          <div style={{ flex: 1, position: 'relative' }}>
            <iframe
              src={url}
              title={title}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: 'white',
              }}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />

            {/* Fallback Message (shown if iframe fails to load) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                padding: '20px',
                display: 'none', // Initially hidden
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
              className="iframe-fallback"
            >
              <p>Unable to load content in iframe.</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#ff69b4',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  marginTop: '10px',
                }}
              >
                Open in New Tab
              </a>
            </div>
          </div>

          <style>
            {`
              @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }

              @keyframes slideOut {
                from { transform: translateX(0); }
                to { transform: translateX(100%); }
              }

              iframe:not([src]) + .iframe-fallback,
              iframe.failed + .iframe-fallback {
                display: block;
              }
            `}
          </style>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 