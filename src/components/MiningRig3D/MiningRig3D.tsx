'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import styles from './MiningRig3D.module.css';

/* ─────────────────────────────────────────────────────────── */
/*  GPU Card — one row of GPUs in the rack                     */
/* ─────────────────────────────────────────────────────────── */
function GPUCard({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.6 + Math.sin(t * 2 + position[1] * 3) * 0.4;
    }
  });

  return (
    <group position={position}>
      {/* GPU PCB board */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.8, 0.08, 0.7]} />
        <meshStandardMaterial color="#0a0e1a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* GPU chip */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#1a1f35" metalness={1} roughness={0.1} />
      </mesh>
      {/* Cooling fins */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0]}>
          <boxGeometry args={[0.3, 0.12, 0.65]} />
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {/* Emissive glow strip */}
      <mesh ref={glowRef} position={[0, 0.05, -0.38]}>
        <boxGeometry args={[1.6, 0.04, 0.02]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
      {/* VRAM chips */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.07, 0.2]}>
          <boxGeometry args={[0.25, 0.05, 0.18]} />
          <meshStandardMaterial color="#0d1224" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Cooling Fan                                                 */
/* ─────────────────────────────────────────────────────────── */
function CoolingFan({ position, speed = 1 }: { position: [number, number, number]; speed?: number }) {
  const fanRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (fanRef.current) {
      fanRef.current.rotation.z = clock.getElapsedTime() * speed * 8;
    }
  });

  return (
    <group position={position}>
      {/* Fan housing */}
      <mesh>
        <torusGeometry args={[0.22, 0.04, 8, 24]} />
        <meshStandardMaterial color="#0f1425" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Fan blades */}
      <group ref={fanRef}>
        {[0, 90, 180, 270].map((deg, i) => (
          <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]}>
            <boxGeometry args={[0.18, 0.06, 0.03]} />
            <meshStandardMaterial color="#1a2040" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {/* Fan center hub */}
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 12]} />
          <meshStandardMaterial color="#00D2FF" emissive="#00D2FF" emissiveIntensity={1} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Full Mining Rig Rack                                        */
/* ─────────────────────────────────────────────────────────── */
function MiningRigModel() {
  const groupRef = useRef<THREE.Group>(null!);
  const ledStripRef = useRef<THREE.Mesh>(null!);

  const gpuColors = ['#00D2FF', '#6C5CE7', '#00E676', '#00D2FF', '#6C5CE7', '#00D2FF'];
  const gpuRows = 6;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle continuous rotation
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.3 + t * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
    if (ledStripRef.current) {
      (ledStripRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + Math.sin(t * 1.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Rack Chassis Frame ── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 3.8, 1.0]} />
        <meshStandardMaterial
          color="#080c1a"
          metalness={0.95}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Front panel detail panel */}
      <mesh position={[0, 0, 0.51]}>
        <boxGeometry args={[2.35, 3.75, 0.02]} />
        <meshStandardMaterial color="#0a0f20" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* ── GPU Rows ── */}
      {Array.from({ length: gpuRows }).map((_, i) => (
        <GPUCard
          key={i}
          position={[0, -1.4 + i * 0.58, 0.48]}
          color={gpuColors[i % gpuColors.length]}
        />
      ))}

      {/* ── Cooling Fans (right side panel) ── */}
      <group position={[1.25, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.08, 3.8, 1.0]} />
          <meshStandardMaterial color="#0a0e1a" metalness={0.95} roughness={0.2} />
        </mesh>
        {[-1.2, -0.4, 0.4, 1.2].map((y, i) => (
          <CoolingFan key={i} position={[0.05, y, 0]} speed={0.8 + i * 0.15} />
        ))}
      </group>

      {/* ── Left panel ── */}
      <mesh position={[-1.25, 0, 0]}>
        <boxGeometry args={[0.08, 3.8, 1.0]} />
        <meshStandardMaterial color="#0a0e1a" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* ── Top panel with vents ── */}
      <mesh position={[0, 1.96, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.0]} />
        <meshStandardMaterial color="#0d1128" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* ── Bottom panel ── */}
      <mesh position={[0, -1.96, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.0]} />
        <meshStandardMaterial color="#0d1128" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* ── Rack mounting rails ── */}
      {[-1.1, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.5]}>
          <boxGeometry args={[0.06, 3.8, 0.04]} />
          <meshStandardMaterial color="#1a2040" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* ── LED accent strip (top) ── */}
      <mesh ref={ledStripRef} position={[0, 1.85, 0.52]}>
        <boxGeometry args={[2.0, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#00D2FF"
          emissive="#00D2FF"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* ── LED accent strip (bottom) ── */}
      <mesh position={[0, -1.85, 0.52]}>
        <boxGeometry args={[2.0, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#6C5CE7"
          emissive="#6C5CE7"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* ── Cable management (back) ── */}
      {[-0.7, 0, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0, -0.52]}>
          <cylinderGeometry args={[0.03, 0.03, 3.5, 8]} />
          <meshStandardMaterial
            color={i === 1 ? '#6C5CE7' : '#00D2FF'}
            emissive={i === 1 ? '#6C5CE7' : '#00D2FF'}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* ── Status indicator LEDs ── */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.95, -1.6 + i * 0.46, 0.52]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#00E676' : i % 3 === 1 ? '#00D2FF' : '#6C5CE7'}
            emissive={i % 3 === 0 ? '#00E676' : i % 3 === 1 ? '#00D2FF' : '#6C5CE7'}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* ── Power supply unit ── */}
      <mesh position={[0.7, -1.6, -0.1]}>
        <boxGeometry args={[0.8, 0.55, 0.7]} />
        <meshStandardMaterial color="#080c18" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, -1.6, 0.12]}>
        <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
        <meshStandardMaterial color="#0f1528" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Scene — lights, environment, sparkles                       */
/* ─────────────────────────────────────────────────────────── */
function Scene({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const sceneRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!sceneRef.current) return;

    // Smooth scroll-driven transformations
    const target = {
      x: -scrollProgress * 2.5,
      y: scrollProgress * 0.3,
      scale: 1 - scrollProgress * 0.55,
    };

    sceneRef.current.position.x += (target.x - sceneRef.current.position.x) * 0.06;
    sceneRef.current.position.y += (target.y - sceneRef.current.position.y) * 0.06;
    const s = sceneRef.current.scale.x + (target.scale - sceneRef.current.scale.x) * 0.06;
    sceneRef.current.scale.setScalar(Math.max(s, 0.1));
  });

  return (
    <group ref={sceneRef}>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 5]} intensity={1.2} color="#6C5CE7" />
      <pointLight position={[5, 0, 3]} intensity={0.8} color="#00D2FF" />
      <pointLight position={[-4, 2, 4]} intensity={0.5} color="#6C5CE7" />
      <spotLight
        position={[0, 8, 6]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />

      {/* The Rig */}
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.3}>
        <MiningRigModel />
      </Float>

      {/* Ambient sparkles (particles) */}
      <Sparkles
        count={60}
        scale={[6, 6, 4]}
        size={1.5}
        speed={0.3}
        color="#00D2FF"
        opacity={0.6}
      />
      <Sparkles
        count={30}
        scale={[5, 5, 3]}
        size={1.0}
        speed={0.2}
        color="#6C5CE7"
        opacity={0.5}
      />

      {/* Ground glow plane */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color="#6C5CE7"
          emissive="#6C5CE7"
          emissiveIntensity={0.05}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main Export — scroll-aware wrapper                          */
/* ─────────────────────────────────────────────────────────── */
export default function MiningRig3D({ mode = 'hero' }: { mode?: 'hero' | 'background' }) {
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

  // On mobile, skip the 3D canvas entirely
  if (isMobile) return null;

  const isBackground = scrollProgress > 0.05;
  const canvasOpacity = mode === 'background'
    ? Math.max(0.15, 0.8 - scrollProgress * 0.6)
    : 1;

  return (
    <div
      className={`${styles.canvasWrapper} ${isBackground ? styles.fixedBackground : styles.heroCanvas}`}
      style={{ opacity: canvasOpacity }}
      aria-hidden="true"
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
