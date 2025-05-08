import React, { useState, useRef, useEffect } from 'react';
import { Html, Billboard } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { FaTshirt, FaChalkboardTeacher, FaWineBottle, FaCouch, FaMusic, FaUsers, FaCalendar, FaBeer, FaNewspaper } from 'react-icons/fa';

const getIconForLabel = (label) => {
  switch (label) {
    case "Design Your Kit":
      return <FaTshirt />;
    case "Drink Unwell":
      return <FaBeer />;
    case "See Who's Playing":
      return <FaUsers />;
    case "Check Out The Gist":
      return <FaNewspaper />;
    case "Create Your Vibe":
      return <FaMusic />;
    default:
      return null;
  }
};

export default function Hotspot({ 
  position, 
  label, 
  onClick,
  onFocus,
  isActive = false,
  id,
  isPanelOpen = false
}) {
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const { camera } = useThree();
  const hotspotRef = useRef();
  const worldPos = useRef(new Vector3());

  // Update scale and opacity based on camera distance
  useFrame(() => {
    if (hotspotRef.current) {
      // Get world position
      worldPos.current.set(position[0], position[1], position[2]);
      
      // Calculate distance to camera
      const distance = camera.position.distanceTo(worldPos.current);
      
      // Calculate dynamic scale (inverse of distance with limits)
      const newScale = Math.max(0.9, Math.min(1.2, 5 / distance));
      setScale(newScale);

      // Calculate opacity based on panel state and distance
      const panelOpacity = isPanelOpen ? 0.3 : 1;
      const distanceOpacity = Math.max(0.8, Math.min(1, 8 / distance));
      setOpacity(distanceOpacity * panelOpacity);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onFocus) {
      onFocus(id);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <group position={position}>
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <Html
          ref={hotspotRef}
          center
          occlude
          zIndexRange={[100, 0]}
          style={{
            zIndex: 9999,
            transition: 'opacity 0.3s ease',
            opacity: isActive ? 0 : opacity,
            pointerEvents: isActive ? 'none' : 'auto',
            transform: `scale(${scale})`,
            willChange: 'transform, opacity',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transformOrigin: 'center center',
            }}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Label - Only shown on hover */}
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                background: 'rgba(0,0,0,0.85)',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                fontFamily: 'Arial',
                fontSize: '11px',
                fontWeight: '500',
                opacity: hovered ? Math.min(1, opacity * 1.5) : 0,
                transform: `translateY(${hovered ? '0' : '4px'}) scale(${1/scale})`,
                transition: 'all 0.2s ease',
                pointerEvents: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {label}
            </div>

            {/* Hotspot Button */}
            <button
              style={{
                background: isActive ? 'rgba(255,105,180,0.9)' : 
                         hovered ? 'rgba(255,255,255,0.95)' : 
                         'rgba(255,255,255,0.75)',
                color: hovered ? '#ff69b4' : '#666',
                border: 'none',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transform: `scale(${hovered ? 1.1 : 1})`,
                transition: 'all 0.2s ease',
                transformOrigin: 'center center',
              }}
            >
              {React.cloneElement(getIconForLabel(label), {
                size: 12,
                style: { 
                  transition: 'all 0.2s ease',
                  opacity: hovered ? 1 : 0.8,
                  transform: `scale(${1/scale})`,
                }
              })}
            </button>
          </div>
        </Html>
      </Billboard>
    </group>
  );
} 