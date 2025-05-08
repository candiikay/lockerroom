import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function DreamyGridBackground() {
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[10, 10, 10]}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        args={[{
          uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color("#a18cd1") }, // pastel purple
            color2: { value: new THREE.Color("#fbc2eb") }, // pastel pink
            glow: { value: 0.45 }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float glow;
            varying vec2 vUv;
            void main() {
              float wave = sin(40.0 * vUv.x + time) * 0.2 + sin(40.0 * vUv.y + time * 1.2) * 0.2;
              float grid = abs(wave);
              float lines = smoothstep(0.18, 0.22, grid);
              float fade = smoothstep(0.0, 0.5, vUv.y);
              float t = 0.5 + 0.5 * sin(time + vUv.y * 3.0);
              vec3 grad = mix(color1, color2, t);
              vec3 base = mix(vec3(0.08,0.08,0.12), grad, lines * glow);
              gl_FragColor = vec4(base, fade * (0.7 + lines * 0.5));
            }
          `,
          side: THREE.BackSide,
          transparent: true,
        }]}
      />
    </mesh>
  );
}

export default DreamyGridBackground; 