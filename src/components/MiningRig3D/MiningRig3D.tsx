'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, Environment, Float, Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import styles from './MiningRig3D.module.css';

/* ─────────────────────────────────────────────────────────── */
/*  GLB Model Loader                                            */
/* ─────────────────────────────────────────────────────────── */
function RigModel() {
  const { scene } = useGLTF('/mining_rig.glb');
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle continuous rotation to make it look alive
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.3 + t * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={0.51} />
      </Center>
    </group>
  );
}

// Preload the model so it loads faster
useGLTF.preload('/mining_rig.glb');

/* ─────────────────────────────────────────────────────────── */
/*  Scene — smoothly lerps position from right → center        */
/* ─────────────────────────────────────────────────────────── */
function Scene({ scrollProgress }: { scrollProgress: number }) {
  const sceneRef = useRef<THREE.Group>(null!);
  // Store current animated values for smooth lerping
  const animatedPos = useRef({ x: 3, y: 0 });

  useFrame(() => {
    if (!sceneRef.current) return;

    // scrollProgress: 0 = at top (hero), 1 = scrolled one full viewport
    // Lerp from right-side (x=3) to center (x=0) as user scrolls
    const targetX = 3 * (1 - scrollProgress); // 3 → 0
    const targetY = 0;

    // Smooth lerp (0.04 = buttery smooth, no jumps)
    animatedPos.current.x += (targetX - animatedPos.current.x) * 0.04;
    animatedPos.current.y += (targetY - animatedPos.current.y) * 0.04;

    sceneRef.current.position.x = animatedPos.current.x;
    sceneRef.current.position.y = animatedPos.current.y;
  });

  return (
    <group ref={sceneRef} position={[3, 0, 0]}>
      {/* Environment map provides real reflections for metallic surfaces */}
      <Environment preset="city" />

      {/* Lighting */}
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 5, 5]} intensity={2.5} color="#6C5CE7" />
      <pointLight position={[-5, -5, 5]} intensity={2.5} color="#00D2FF" />
      <spotLight
        position={[0, 8, 6]}
        angle={0.4}
        penumbra={1}
        intensity={3}
        color="#ffffff"
      />

      {/* ── Subtle Background Elements ── */}

      {/* Wireframe Icosahedron — large, slow-spinning, very transparent */}
      <Float speed={0.5} rotationIntensity={0.3} floatIntensity={0.2}>
        <mesh position={[-3, 1.5, -6]} rotation={[0.5, 0.3, 0]}>
          <icosahedronGeometry args={[2.5, 1]} />
          <meshStandardMaterial
            color="#6C5CE7"
            emissive="#6C5CE7"
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.12}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Wireframe Icosahedron — smaller, opposite side */}
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.3}>
        <mesh position={[3.5, -1.5, -7]} rotation={[0.2, -0.5, 0.3]}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={0.3}
            wireframe
            transparent
            opacity={0.1}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Outer orbit ring — very thin, gentle glow */}
      <Float speed={0.6} rotationIntensity={0.8} floatIntensity={0.1}>
        <mesh position={[0, 0, -5]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[4.5, 0.008, 16, 120]} />
          <meshStandardMaterial
            color="#6C5CE7"
            emissive="#6C5CE7"
            emissiveIntensity={1}
            transparent
            opacity={0.25}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Inner orbit ring — crossing the outer */}
      <Float speed={0.4} rotationIntensity={0.6} floatIntensity={0.1}>
        <mesh position={[0, 0, -5]} rotation={[-Math.PI / 5, Math.PI / 6, 0]}>
          <torusGeometry args={[3.8, 0.006, 16, 120]} />
          <meshStandardMaterial
            color="#00D2FF"
            emissive="#00D2FF"
            emissiveIntensity={0.8}
            transparent
            opacity={0.2}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Soft ground-glow plane */}
      <mesh position={[0, -3, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          color="#6C5CE7"
          emissive="#6C5CE7"
          emissiveIntensity={0.03}
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* ── Main Rig Model ── */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
        <RigModel />
      </Float>

      {/* Ambient sparkles — purple */}
      <Sparkles
        count={30}
        scale={[10, 10, 5]}
        size={1.5}
        speed={0.15}
        color="#6C5CE7"
        opacity={0.35}
      />
      {/* Ambient sparkles — cyan */}
      <Sparkles
        count={25}
        scale={[10, 10, 5]}
        size={1}
        speed={0.2}
        color="#00D2FF"
        opacity={0.3}
      />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main Export — single fixed full-screen canvas               */
/* ─────────────────────────────────────────────────────────── */
export default function MiningRig3D() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      rafRef.current = requestAnimationFrame(() => {
        const heroHeight = window.innerHeight;
        const progress = Math.min(window.scrollY / heroHeight, 1);
        setScrollProgress(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // On mobile, skip the 3D canvas entirely to save performance
  if (isMobile) return null;

  // Smoothly fade opacity: 1 at top → 0.8 when fully scrolled
  const canvasOpacity = 1 - scrollProgress * 0.2;

  return (
    <div
      className={styles.canvasWrapper}
      style={{ opacity: canvasOpacity }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
