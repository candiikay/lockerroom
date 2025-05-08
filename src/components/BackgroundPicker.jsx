import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Html } from '@react-three/drei';

// Background shader variations
const backgroundTypes = {
  stadiumLights: {
    name: "Classic Stadium Lights",
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: [0.1, 0.12, 0.2] },
      uColor2: { value: [0.8, 0.85, 1.0] },
    },
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv = vUv;
        
        // Stadium light glow
        float t = uTime * 0.2;
        float lights = 0.0;
        for(float i = 0.0; i < 6.0; i++) {
          vec2 lightPos = vec2(
            0.2 + i * 0.15,
            0.8 + sin(t + i) * 0.02
          );
          float dist = length(uv - lightPos);
          lights += 0.05 / (dist * 10.0);
        }
        
        vec3 color = mix(uColor1, uColor2, lights);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  pinkNebula: {
    name: "Pink Nebula",
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: [0.8, 0.2, 0.5] },
      uColor2: { value: [0.4, 0.2, 0.8] },
    },
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;

      float fbm(vec2 p) {
        float value = 0.0;
        float amp = 0.5;
        float freq = 1.0;
        for(int i = 0; i < 6; i++) {
          value += amp * noise(p * freq);
          freq *= 2.0;
          amp *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;
        float t = uTime * 0.1;
        
        // Nebula effect
        float nebula = fbm(uv + t * 0.1);
        nebula += fbm(uv * 2.0 - t * 0.15) * 0.5;
        
        vec3 color = mix(uColor1, uColor2, nebula);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  turfField: {
    name: "Turf Field",
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: [0.2, 0.5, 0.2] },
      uColor2: { value: [0.3, 0.6, 0.3] },
    },
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        float t = uTime * 0.5;
        
        // Grass wave effect
        float wave = sin(uv.x * 20.0 + t) * 0.5 + 0.5;
        wave *= sin(uv.y * 15.0 - t * 0.7) * 0.5 + 0.5;
        
        vec3 color = mix(uColor1, uColor2, wave);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  championshipParade: {
    name: "Championship Parade",
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: [1.0, 0.8, 0.2] },
      uColor2: { value: [0.9, 0.3, 0.5] },
    },
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        float t = uTime * 0.3;
        
        // Falling streamers effect
        float streamers = 0.0;
        for(float i = 0.0; i < 10.0; i++) {
          float x = fract(uv.x * 3.0 + i * 0.1 + t * (0.1 + i * 0.05));
          float y = fract(uv.y + t * (0.2 + i * 0.1));
          streamers += smoothstep(0.02, 0.0, length(vec2(x, y) - vec2(0.5)));
        }
        
        vec3 color = mix(uColor1, uColor2, streamers);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  fanWall: {
    name: "Fan Wall",
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: [0.2, 0.4, 0.8] },
      uColor2: { value: [0.8, 0.2, 0.4] },
    },
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        float t = uTime * 0.2;
        
        // Scrolling grid effect
        float grid = step(0.98, sin(uv.x * 20.0)) + step(0.98, sin(uv.y * 20.0));
        float scroll = fract(uv.y - t);
        
        vec3 color = mix(uColor1, uColor2, grid * scroll);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export default function BackgroundPicker({ onBackgroundChange }) {
  const [currentBackground, setCurrentBackground] = useState('stadiumLights');
  const materialRef = useRef();
  
  // Memoize the current background data
  const backgroundData = useMemo(() => backgroundTypes[currentBackground], [currentBackground]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const handleBackgroundChange = (type) => {
    setCurrentBackground(type);
    if (onBackgroundChange) {
      onBackgroundChange(type);
    }
  };

  return (
    <>
      <Plane args={[50, 30]} position={[0, 0, -15]}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={backgroundData.fragmentShader}
          uniforms={backgroundData.uniforms}
        />
      </Plane>

      <Html position={[-2, 2, 0]}>
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '8px',
          color: 'white',
          fontFamily: 'Arial',
        }}>
          <select
            value={currentBackground}
            onChange={(e) => handleBackgroundChange(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              background: '#222',
              color: 'white',
              border: '1px solid #444',
            }}
          >
            {Object.entries(backgroundTypes).map(([key, bg]) => (
              <option key={key} value={key}>
                {bg.name}
              </option>
            ))}
          </select>
        </div>
      </Html>
    </>
  );
} 