"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function CyberGrid() {
  const gridRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = -Math.PI / 3 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      gridRef.current.position.y = -2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    const size = 20;
    const divisions = 30;
    const step = size / divisions;

    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      const pos = i * step;
      const opacity = 1 - Math.abs(i / (divisions / 2)) * 0.6;

      // horizontal
      lines.push(
        <line key={`h${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-size / 2, 0, pos, size / 2, 0, pos])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ff88" transparent opacity={opacity * 0.15} />
        </line>
      );
      // vertical
      lines.push(
        <line key={`v${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([pos, 0, -size / 2, pos, 0, size / 2])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ff88" transparent opacity={opacity * 0.15} />
        </line>
      );
    }
    return lines;
  }, []);

  return <group ref={gridRef}>{gridLines}</group>;
}

function FloatingParticles({ count = 2000 }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00ff88"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.1;
      wireRef.current.rotation.z = t * 0.08;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.08}
          wireframe
        />
      </mesh>
      {/* Outer wireframe */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[2, 2]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.04}
          wireframe
        />
      </mesh>
      {/* Inner glow */}
      <pointLight color="#00ff88" intensity={2} distance={10} />
    </group>
  );
}

function DataStreams() {
  const groupRef = useRef<THREE.Group>(null!);
  const streamCount = 8;

  const streamData = useMemo(() => {
    return Array.from({ length: streamCount }, (_, i) => {
      const angle = (i / streamCount) * Math.PI * 2;
      const radius = 4 + Math.random() * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        speed: 0.5 + Math.random() * 1.5,
        height: 3 + Math.random() * 4,
        delay: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const data = streamData[i];
      const t = state.clock.elapsedTime * data.speed + data.delay;
      child.position.y = ((t % data.height) - data.height / 2);
      (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
        color: "#00ff88",
        transparent: true,
        opacity: 0.3 * (1 - Math.abs(child.position.y) / (data.height / 2)),
      });
    });
  });

  return (
    <group ref={groupRef}>
      {streamData.map((data, i) => (
        <mesh key={i} position={[data.x, 0, data.z]}>
          <boxGeometry args={[0.02, 0.3, 0.02]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 three-canvas-container">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0a0e17", 5, 25]} />
        <ambientLight intensity={0.1} />
        <GlowingSphere />
        <FloatingParticles />
        <CyberGrid />
        <DataStreams />
      </Canvas>
    </div>
  );
}
