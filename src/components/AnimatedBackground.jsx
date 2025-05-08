import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';

export default function AnimatedBackground() {
  const materialRef = useRef();
  
  // Memoize shader to prevent recreating every frame
  const shaderData = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColorTop: { value: [0.98, 0.87, 0.95] },    // Soft warm pink
      uColorBottom: { value: [0.92, 0.85, 0.98] }, // Soft cool lavender
      uColorAccent: { value: [0.95, 0.82, 0.92] }, // Mid-tone accent
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorTop;
      uniform vec3 uColorBottom;
      uniform vec3 uColorAccent;
      varying vec2 vUv;
      varying vec3 vPosition;

      // Improved noise function for better randomization
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      // Smooth noise for organic patterns
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        // Gradient base
        vec3 color = mix(uColorBottom, uColorTop, pow(vUv.y, 0.5));
        
        // Subtle flowing waves
        float t = uTime * 0.15;
        vec2 movement = vec2(
          sin(t * 0.5) * 0.5,
          cos(t * 0.3) * 0.5
        );
        
        // Layer multiple noise patterns
        float pattern = 0.0;
        pattern += smoothNoise((vUv + movement) * 3.0) * 0.5;
        pattern += smoothNoise((vUv - movement * 0.8) * 5.0) * 0.25;
        
        // Subtle color variation
        vec3 colorVariation = mix(color, uColorAccent, pattern * 0.2);
        
        // Soft vignette
        float vignette = smoothstep(1.5, 0.5, length(vUv - 0.5));
        colorVariation *= 0.95 + vignette * 0.05;
        
        // Gentle pulsing
        float pulse = sin(uTime * 0.2) * 0.015 + 0.985;
        colorVariation *= pulse;

        gl_FragColor = vec4(colorVariation, 1.0);
      }
    `
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <Plane 
      args={[40, 30]} 
      position={[0, 0, -12]}
      rotation={[0, 0, 0]}
    >
      <shaderMaterial
        ref={materialRef}
        uniforms={shaderData.uniforms}
        vertexShader={shaderData.vertexShader}
        fragmentShader={shaderData.fragmentShader}
        transparent
        depthWrite={false}
      />
    </Plane>
  );
} 