import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Box3 } from 'three';
import gsap from 'gsap';

export default function CameraController({ 
  activeView = 'default',
  orbitControls,
  onTransitionComplete,
  defaultPosition = [0, 0.5, 5.5],
  defaultTarget = [0, -0.5, 0],
  defaultFov = 55,
  sceneRef
}) {
  const { camera } = useThree();
  const currentPosition = useRef(new Vector3());
  const currentTarget = useRef(new Vector3());
  const isTransitioning = useRef(false);
  
  // Predefined camera views for each hotspot, using props for default
  const cameraViews = {
    locker: {
      position: [-3, 0.5, 1],
      target: [-2.1, 0.2, -0.8],
      fov: 50
    },
    refrigerator: {
      position: [3, 0.2, 1],
      target: [2.0, -0.3, -0.8],
      fov: 50
    },
    whiteboard: {
      position: [0.5, 1.2, -0.5],
      target: [0.5, 0.5, -1.4],
      fov: 50
    },
    beanbag: {
      position: [1, 0.2, 4.5],
      target: [0.3, -0.2, 2.5],
      fov: 50
    },
    boombox: {
      position: [0.5, -0.4, 0.5],
      target: [0.2, -0.8, -1.4],
      fov: 50
    },
    default: {
      position: defaultPosition,
      target: defaultTarget,
      fov: 50
    }
  };

  useEffect(() => {
    let view = cameraViews[activeView];
    let dynamicTarget = null;
    let dynamicPosition = null;
    let dynamicFov = view.fov;
    // Try to use object center for camera target and position
    if (sceneRef && sceneRef.current && activeView !== 'default') {
      const object = sceneRef.current.getObjectByName(activeView);
      if (object) {
        const bbox = new Box3().setFromObject(object);
        const center = bbox.getCenter(new Vector3());
        const size = bbox.getSize(new Vector3());
        const distance = Math.max(size.length() * 0.8, 2.5);
        dynamicTarget = [center.x, center.y, center.z];
        dynamicPosition = [center.x, center.y, center.z + distance];
      }
    }
    // Store current camera position and target
    currentPosition.current.copy(camera.position);
    if (orbitControls.current) {
      currentTarget.current.copy(orbitControls.current.target);
      orbitControls.current.enabled = false;
      orbitControls.current.enableDamping = true;
      orbitControls.current.dampingFactor = 0.05;
    }
    isTransitioning.current = true;
    const timeline = gsap.timeline({
      onComplete: () => {
        isTransitioning.current = false;
        if (activeView === 'default' && orbitControls.current) {
          orbitControls.current.enabled = true;
        }
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }
    });
    // Animate camera position
    timeline.to(camera.position, {
      duration: 1.5,
      x: dynamicPosition ? dynamicPosition[0] : view.position[0],
      y: dynamicPosition ? dynamicPosition[1] : view.position[1],
      z: dynamicPosition ? dynamicPosition[2] : view.position[2],
      ease: "power3.inOut"
    });
    // Animate orbit controls target
    if (orbitControls.current) {
      timeline.to(orbitControls.current.target, {
        duration: 1.5,
        x: dynamicTarget ? dynamicTarget[0] : view.target[0],
        y: dynamicTarget ? dynamicTarget[1] : view.target[1],
        z: dynamicTarget ? dynamicTarget[2] : view.target[2],
        ease: "power3.inOut"
      }, 0);
    }
    // Animate FOV
    timeline.to(camera, {
      duration: 1.3,
      fov: dynamicFov,
      ease: "power2.inOut",
      onUpdate: () => camera.updateProjectionMatrix()
    }, 0.1);
    return () => {
      timeline.kill();
    };
  }, [activeView, camera, orbitControls, onTransitionComplete, defaultPosition, defaultTarget, defaultFov, sceneRef]);
  
  // Ensure smooth camera movement during transition
  useFrame(() => {
    if (isTransitioning.current && orbitControls.current) {
      camera.lookAt(orbitControls.current.target);
      if (orbitControls.current.enableDamping) {
        orbitControls.current.update();
      }
    }
  });
  
  return null;
} 