import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import { Vector3 } from 'three';

function FloatingBall({ initialPosition, delay = 0 }) {
  const ballRef = useRef();
  const time = useRef(delay);
  
  // Memoize animation parameters
  const params = useMemo(() => ({
    floatSpeed: 0.4,
    rotateSpeed: 0.2,
    floatHeight: 0.3,
    floatRadius: 0.4,
  }), []);

  // Memoize initial position vector
  const initPos = useMemo(() => new Vector3(...initialPosition), [initialPosition]);
  
  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;
    
    // Smooth, organic floating motion
    const y = Math.sin(t * params.floatSpeed) * params.floatHeight;
    const x = Math.cos(t * params.floatSpeed * 0.5) * params.floatRadius;
    
    ballRef.current.position.x = initPos.x + x;
    ballRef.current.position.y = initPos.y + y;
    
    // Gentle rotation
    ballRef.current.rotation.y = t * params.rotateSpeed;
    ballRef.current.rotation.x = Math.sin(t * params.rotateSpeed * 0.5) * 0.2;
  });

  return (
    <group ref={ballRef} position={initialPosition}>
      <Sphere args={[0.4, 32, 32]}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.2}
          roughness={0.4}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.2}
          attenuationColor="#ff9ecd"
          attenuationDistance={0.5}
          opacity={0.9}
          transparent
        />
      </Sphere>
    </group>
  );
}

export default function FloatingSoccerBalls() {
  // Strategic ball placement for depth and composition
  const ballPositions = useMemo(() => [
    [-4, 1.5, -8],  // Left back
    [4, 2, -7],     // Right back
    [-2, 3, -6],    // Upper left
    [2, 2.5, -5],   // Upper right
    [0, 1, -4],     // Center front
  ], []);

  return (
    <group>
      {ballPositions.map((pos, index) => (
        <FloatingBall 
          key={index}
          initialPosition={pos}
          delay={index * 0.5} // Stagger animations
        />
      ))}
      
      {/* Dedicated lighting for balls */}
      <pointLight 
        position={[0, 2, -6]} 
        intensity={0.8} 
        color="#ffd6e6" 
        distance={10}
        decay={2}
      />
    </group>
  );
} 