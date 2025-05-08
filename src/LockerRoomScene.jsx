import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Html,
  PerspectiveCamera,
  useTexture,
  Sparkles,
  Cloud
} from "@react-three/drei";
import * as THREE from 'three';
import Hotspot from "./components/Hotspot";
import CameraController from "./components/CameraController";
import IframePanel from "./components/IframePanel";
import { audioController } from "./components/AudioController";
import DreamyGridBackground from './DreamyGridBackground';
import confetti from 'canvas-confetti';
import MusicPlayerPanel from './components/MusicPlayerPanel';
import { useLockerStore } from './store/lockerStore';

// Custom shader for background effect
const BackgroundShader = {
  uniforms: {
    time: { value: 0 },
    color1: { value: new THREE.Color("#1B0536") },
    color2: { value: new THREE.Color("#360B68") }
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
    varying vec2 vUv;

    //
    // Description : Array and textureless GLSL 2D/3D/4D simplex 
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : stegu
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //               https://github.com/stegu/webgl-noise
    // 

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v) { 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

      // Permutations
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      float n = snoise(vec3(vUv * 3.0, time * 0.2));
      vec3 color = mix(color1, color2, vUv.y + n * 0.3);
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// --- Animated Grid Shader ---
const GridShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color("#ff00ff") },
    glow: { value: 0.25 }
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
    uniform vec3 color;
    uniform float glow;
    varying vec2 vUv;
    void main() {
      float grid = abs(sin(40.0 * vUv.x + time * 0.7)) * 0.2 + abs(sin(40.0 * vUv.y + time * 0.7)) * 0.2;
      float lines = smoothstep(0.18, 0.22, grid);
      float fade = smoothstep(0.0, 0.5, vUv.y);
      vec3 base = mix(vec3(0.05,0.05,0.08), color, lines * glow);
      gl_FragColor = vec4(base, fade * (0.7 + lines * 0.5));
    }
  `
};

function LockerRoomModel({ sceneRef }) {
  const { scene } = useGLTF("/lockerroom.glb");
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1.5;
          child.material.roughness = 0.4;
          child.material.metalness = 0.6;
        }
      }
    });
    if (sceneRef) sceneRef.current = scene;
  }, [scene, sceneRef]);

  return <primitive object={scene} />;
}

// Interactive zones component
function InteractiveZones({ onHotspotFocus, activeHotspot, onHotspotClick, isPanelOpen }) {
  return (
    <>
      {/* Locker */}
      <Hotspot 
        id="locker"
        position={[-2.1, 0.0, -0.8]}
        label="Design Your Kit"
        onClick={() => onHotspotClick('Design Your Kit', 'https://app.4th-kit.com/angel-city-4th-kit')}
        onFocus={onHotspotFocus}
        isActive={activeHotspot === 'locker'}
        isPanelOpen={isPanelOpen}
      />

      {/* Refrigerator */}
      <Hotspot 
        id="refrigerator"
        position={[2.0, -0.9, -0.8]}
        label="Drink Unwell"
        onClick={() => onHotspotClick('Drink Unwell', 'https://www.drinkunwell.com')}
        onFocus={onHotspotFocus}
        isActive={activeHotspot === 'refrigerator'}
        isPanelOpen={isPanelOpen}
      />

      {/* Whiteboard */}
      <Hotspot 
        id="whiteboard"
        position={[0.5, 0.1, -1.4]}
        label="See Who's Playing"
        onClick={() => onHotspotClick("See Who's Playing", 'https://www.nwslsoccer.com/schedule')}
        onFocus={onHotspotFocus}
        isActive={activeHotspot === 'whiteboard'}
        isPanelOpen={isPanelOpen}
      />

      {/* Beanbag */}
      <Hotspot 
        id="beanbag"
        position={[1.0, -0.6, 2.5]}
        label="Check Out The Gist"
        onClick={() => onHotspotClick('Check Out The Gist', 'https://www.thegistsports.com')}
        onFocus={onHotspotFocus}
        isActive={activeHotspot === 'beanbag'}
        isPanelOpen={isPanelOpen}
      />

      {/* Boombox */}
      <Hotspot 
        id="boombox"
        position={[0.2, -0.6, 0.2]}
        label="Create Your Vibe"
        onClick={() => onHotspotClick('Create Your Vibe')}
        onFocus={onHotspotFocus}
        isActive={activeHotspot === 'boombox'}
        isPanelOpen={isPanelOpen}
      />
    </>
  );
}

function DomeRoom() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[4, 64, 64]} />
      <meshStandardMaterial
        color={"#181824"}
        side={THREE.BackSide}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

function Scene({ onHotspotClick, isPanelOpen, activeHotspot, setActiveHotspot, isTransitioning, setIsTransitioning }) {
  const orbitControlsRef = useRef();
  const sceneRef = useRef();

  useEffect(() => {
    console.log('SCENE DEBUG', { activeHotspot, isTransitioning });
  }, [activeHotspot, isTransitioning]);

  const handleHotspotFocus = (hotspotId) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setActiveHotspot(hotspotId);
    }
  };

  const handleBackClick = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setActiveHotspot('default');
    }
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = activeHotspot === 'default';
    }
    console.log('Transition complete for', activeHotspot);
  };

  return (
    <>
      <DreamyGridBackground />
      <DomeRoom />
      <PerspectiveCamera 
        makeDefault 
        position={[0, 1.0, 2.5]} 
        fov={75}
        near={0.1}
        far={100}
      >
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        {/* Rim light for sci-fi effect */}
        <pointLight position={[0, 3, 0]} intensity={0.7} color="#ff00ff" distance={10} decay={2} />
      </PerspectiveCamera>

      <CameraController
        activeView={activeHotspot}
        orbitControls={orbitControlsRef}
        onTransitionComplete={handleTransitionComplete}
        defaultPosition={[0, 0.2, 13]}
        defaultTarget={[0, 0.2, 0]}
        defaultFov={50}
        sceneRef={sceneRef}
      />
      
      <Environment preset="warehouse" intensity={0.8} />
      
      <group position={[0, 0, 0]}>
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.0} 
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.5} 
          castShadow
        />
        <LockerRoomModel sceneRef={sceneRef} />
        <InteractiveZones 
          onHotspotFocus={handleHotspotFocus}
          onHotspotClick={onHotspotClick}
          activeHotspot={activeHotspot}
          isPanelOpen={isPanelOpen}
        />
      </group>

      <OrbitControls
        ref={orbitControlsRef}
        enablePan={false}
        enableZoom={false}
        enableRotate={activeHotspot === 'default'}
        minAzimuthAngle={-0.5}
        maxAzimuthAngle={0.5}
        minPolarAngle={Math.PI / 2.2}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={2}
        maxDistance={14}
        target={[0, 0.2, 0]}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.8}
        zoomSpeed={0.8}
      />
    </>
  );
}

const triviaQuestions = [
  {
    question: "Which team won the first NWSL Championship?",
    options: ["Portland Thorns FC", "North Carolina Courage", "Chicago Red Stars", "OL Reign"],
    answer: 0
  },
  {
    question: "What year was the NWSL founded?",
    options: ["2010", "2013", "2016", "2018"],
    answer: 1
  },
  {
    question: "Which player is known as 'The Great One' in NWSL?",
    options: ["Megan Rapinoe", "Sam Kerr", "Christine Sinclair", "Alex Morgan"],
    answer: 2
  }
];

export default function LockerRoomScene() {
  const [iframePanelOpen, setIframePanelOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [iframeTitle, setIframeTitle] = useState('');
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);
  const [ambientMuted, setAmbientMuted] = useState(false);
  const [hydration, setHydration] = useState(0); // 0: Thirsty, 1: Good, 2: Hydrated!
  const [showBubbles, setShowBubbles] = useState(false);
  const [bubbleCooldown, setBubbleCooldown] = useState(false);
  const [triviaOpen, setTriviaOpen] = useState(false);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaFeedback, setTriviaFeedback] = useState("");
  const [triviaDone, setTriviaDone] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState('default');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const points = useLockerStore(state => state.points);
  const allComplete = useLockerStore(state => state.allComplete);

  useEffect(() => {
    return () => audioController.cleanup();
  }, []);

  // Bubble animation timer
  useEffect(() => {
    if (showBubbles) {
      const timeout = setTimeout(() => setShowBubbles(false), 1200);
      return () => clearTimeout(timeout);
    }
  }, [showBubbles]);

  // Cooldown timer
  useEffect(() => {
    if (bubbleCooldown) {
      const timeout = setTimeout(() => setBubbleCooldown(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [bubbleCooldown]);

  // Feedback helper
  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 1200);
  };

  const handleHotspotClick = (title, url) => {
    const lockerStore = useLockerStore.getState();
    if (title === 'Create Your Vibe') {
      lockerStore.addPoints(10);
      lockerStore.setJerseyOpened();
      lockerStore.checkAllComplete();
      showFeedback('+10 Kit Ready!');
      setMusicPanelOpen(true);
      return;
    }
    if (title === 'Drink Unwell') {
      if (!bubbleCooldown) {
        setShowBubbles(true);
        setBubbleCooldown(true);
        setHydration(h => {
          const newHydration = (h + 1) % 3;
          lockerStore.setHydration(newHydration);
          lockerStore.addPoints(2);
          lockerStore.checkAllComplete();
          showFeedback('+2 Hydrated!');
          return newHydration;
        });
      }
      return;
    }
    if (title === 'See Who\'s Playing') {
      lockerStore.addPoints(5);
      lockerStore.setScheduleViewed();
      lockerStore.checkAllComplete();
      showFeedback('+5 Matchday Prepped!');
      setIframeTitle(title);
      setIframeUrl(url);
      setIframePanelOpen(true);
      return;
    }
    if (title === 'Check Out The Gist') {
      setTriviaOpen(true);
      setTriviaIndex(0);
      setTriviaFeedback("");
      setTriviaDone(false);
      return;
    }
    if (url) {
      setIframeTitle(title);
      setIframeUrl(url);
      setIframePanelOpen(true);
    }
  };

  // Confetti trigger function
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      {/* Modern floating button stack, lower left */}
      <div
        style={{
          position: 'fixed',
          left: 24,
          bottom: 28,
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: 'rgba(255,255,255,0.38)',
          boxShadow: '0 6px 32px 0 rgba(0,0,0,0.13)',
          borderRadius: 16,
          padding: '14px 14px 14px 18px',
          backdropFilter: 'blur(18px)',
          alignItems: 'flex-start',
          minWidth: 210,
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        {/* Compact points and badge row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: allComplete ? 2 : 0,
        }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#222', letterSpacing: 0.2 }}>
            <span role="img" aria-label="points">🏆</span> Points: {points}
          </span>
          {allComplete && (
            <span style={{ color: '#00c853', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>
              Ready for Game Day! 🎉
            </span>
          )}
        </div>
        {/* Hydration pill button */}
        <div style={{
          background: hydration === 2 ? 'linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)' : hydration === 1 ? 'linear-gradient(90deg,#f7971e 0%,#ffd200 100%)' : 'linear-gradient(90deg,#f857a6 0%,#ff5858 100%)',
          borderRadius: 999,
          boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
          padding: '7px 22px',
          fontWeight: 700,
          fontSize: 15,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minWidth: 120,
          marginBottom: 0,
          marginTop: 2,
          transition: 'box-shadow 0.18s',
        }}>
          <span style={{ fontSize: 20 }}>
            {hydration === 2 ? '💧' : hydration === 1 ? '🥤' : '😅'}
          </span>
          {hydration === 2 ? 'Hydrated!' : hydration === 1 ? 'Good' : 'Thirsty'}
        </div>
        {/* Celebrate button */}
        <button
          style={{
            width: 170,
            height: 38,
            fontSize: 15,
            background: 'linear-gradient(90deg,#ff69b4 60%,#ffd6e0 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            fontWeight: 700,
            letterSpacing: 0.2,
            marginBottom: 0,
            marginTop: 2,
            transition: 'all 0.18s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={triggerConfetti}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.04)';
            e.target.style.boxShadow = '0 2px 12px rgba(255,105,180,0.18)';
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 1px 6px rgba(0,0,0,0.08)';
          }}
        >
          <span style={{ fontSize: 18, marginRight: 7 }}>🎉</span> Celebrate!
        </button>
        {/* Audio button */}
        <button
          style={{
            width: 170,
            height: 38,
            fontSize: 15,
            background: ambientMuted ? '#f5f5f5' : 'linear-gradient(90deg,#b388ff 60%,#e0d6ff 100%)',
            color: ambientMuted ? '#888' : '#222',
            border: 'none',
            borderRadius: 999,
            boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            fontWeight: 700,
            letterSpacing: 0.2,
            marginBottom: 0,
            marginTop: 2,
            transition: 'all 0.18s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setAmbientMuted(m => !m)}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.04)';
            e.target.style.boxShadow = '0 2px 12px rgba(179,136,255,0.13)';
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 1px 6px rgba(0,0,0,0.08)';
          }}
        >
          <span style={{ fontSize: 18, marginRight: 7 }}>{ambientMuted ? '🔇' : '🔊'}</span> {ambientMuted ? 'Audio Off' : 'Audio On'}
        </button>
        {/* Reset View button */}
        {activeHotspot !== 'default' && !isTransitioning && (
          <button
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setActiveHotspot('default');
              }
            }}
            style={{
              width: 170,
              height: 38,
              fontSize: 15,
              background: 'linear-gradient(90deg,#00bcd4 60%,#b2ebf2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              fontWeight: 700,
              letterSpacing: 0.2,
              marginBottom: 0,
              marginTop: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'scale(1.04)';
              e.target.style.boxShadow = '0 2px 12px rgba(0,188,212,0.13)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 1px 6px rgba(0,0,0,0.08)';
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Reset View
          </button>
        )}
      </div>
      {/* Background music audio element (restored) */}
      <audio
        autoPlay
        loop
        preload="auto"
        muted={ambientMuted}
        id="ambient-audio"
        style={{ display: 'none' }}
      >
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <Canvas
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        shadows
        gl={{ 
          antialias: true,
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 0.5, 14], fov: 50 }}
      >
        <Suspense fallback={null}>
          <Scene 
            onHotspotClick={handleHotspotClick} 
            isPanelOpen={iframePanelOpen}
            activeHotspot={activeHotspot}
            setActiveHotspot={setActiveHotspot}
            isTransitioning={isTransitioning}
            setIsTransitioning={setIsTransitioning}
          />
        </Suspense>
      </Canvas>

      <IframePanel
        isOpen={iframePanelOpen}
        url={iframeUrl}
        title={iframeTitle}
        onClose={() => setIframePanelOpen(false)}
      />

      <MusicPlayerPanel open={musicPanelOpen} onClose={() => setMusicPanelOpen(false)} />

      {/* Bubble animation overlay */}
      {showBubbles && (
        <div style={{
          position: 'absolute',
          left: 180,
          top: 120,
          zIndex: 9999,
          pointerEvents: 'none',
        }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: 20 + Math.random() * 40,
              top: 40 + Math.random() * 20,
              width: 16 + Math.random() * 10,
              height: 16 + Math.random() * 10,
              borderRadius: '50%',
              background: 'rgba(0,200,255,0.18)',
              border: '1.5px solid #00bcd4',
              animation: `bubbleUp 1.1s cubic-bezier(.4,1.6,.6,1) forwards`,
              animationDelay: `${i * 0.08}s`,
              opacity: 0.8,
            }} />
          ))}
          <style>{`
            @keyframes bubbleUp {
              0% { transform: translateY(0) scale(1); opacity: 0.8; }
              60% { opacity: 1; }
              100% { transform: translateY(-60px) scale(1.2); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Trivia overlay */}
      {triviaOpen && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          padding: 32,
          zIndex: 10000,
          minWidth: 320,
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'inherit',
        }}>
          {!triviaDone ? (
            <>
              {console.log('TRIVIA DEBUG', { triviaIndex, question: triviaQuestions[triviaIndex] })}
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>NWSL Trivia</div>
              <div style={{ fontSize: 17, marginBottom: 18, textAlign: 'center', fontWeight: 700, color: '#111', textShadow: '0 1px 6px rgba(0,0,0,0.10)' }}>{triviaQuestions[triviaIndex]?.question}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                {triviaQuestions[triviaIndex]?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i === triviaQuestions[triviaIndex].answer) {
                        useLockerStore.getState().addPoints(5);
                        useLockerStore.getState().setTriviaScore(triviaIndex + 1);
                        useLockerStore.getState().checkAllComplete();
                        showFeedback('+5 You know your league!');
                        setTimeout(() => {
                          if (triviaIndex === triviaQuestions.length - 1) {
                            setTriviaDone(true);
                          } else {
                            setTriviaIndex(idx => idx + 1);
                            setTriviaFeedback("");
                          }
                        }, 900);
                      } else {
                        setTriviaFeedback('Try again!');
                        setTimeout(() => setTriviaFeedback(""), 900);
                      }
                    }}
                    style={{
                      background: '#fff',
                      color: '#222',
                      border: '1.5px solid #eee',
                      borderRadius: 8,
                      padding: '8px 14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 15,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div style={{ minHeight: 24, color: triviaFeedback === 'Correct!' ? '#00c853' : '#e53935', fontWeight: 600 }}>{triviaFeedback}</div>
              <button onClick={() => setTriviaOpen(false)} style={{ marginTop: 18, background: 'none', color: '#ff69b4', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Close</button>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#00c853' }}>Fan Recharged! 🎉</div>
              <div style={{ fontSize: 16, marginBottom: 18, textAlign: 'center' }}>You finished the quiz. Thanks for being an NWSL fan!</div>
              <button onClick={() => setTriviaOpen(false)} style={{ marginTop: 8, background: 'none', color: '#ff69b4', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Close</button>
            </>
          )}
        </div>
      )}

      {/* Floating feedback popup */}
      {feedback && (
        <div style={{
          position: 'fixed',
          left: 60,
          bottom: 220,
          zIndex: 100002,
          background: 'linear-gradient(90deg,#fffde4 60%,#f7d9e3 100%)',
          color: '#222',
          fontWeight: 800,
          fontSize: 20,
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          padding: '10px 22px',
          pointerEvents: 'none',
          animation: 'popfade 1.2s cubic-bezier(.4,1.6,.6,1) forwards',
        }}>
          {feedback}
          <style>{`
            @keyframes popfade {
              0% { opacity: 0; transform: translateY(20px) scale(0.9); }
              20% { opacity: 1; transform: translateY(-10px) scale(1.1); }
              80% { opacity: 1; }
              100% { opacity: 0; transform: translateY(-40px) scale(0.95); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
