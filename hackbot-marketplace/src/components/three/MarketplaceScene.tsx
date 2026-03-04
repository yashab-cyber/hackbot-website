"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function OrbitingNodes({ count = 40 }) {
  const groupRef = useRef<THREE.Group>(null!);

  const nodeData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      radius: 2 + Math.random() * 3,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 3,
      size: 0.02 + Math.random() * 0.04,
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const d = nodeData[i];
      child.position.x = Math.cos(t * d.speed + d.offset) * d.radius;
      child.position.z = Math.sin(t * d.speed + d.offset) * d.radius;
      child.position.y = d.y + Math.sin(t * 0.5 + d.offset) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {nodeData.map((d, i) => (
        <mesh key={i}>
          <sphereGeometry args={[d.size, 8, 8]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function PluginCube() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0.06} wireframe />
    </mesh>
  );
}

function BackgroundParticles({ count = 800 }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00ff88"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

export default function MarketplaceScene() {
  return (
    <div className="absolute inset-0 three-canvas-container pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0a0e17", 4, 18]} />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} color="#00ff88" intensity={1} distance={8} />
        <PluginCube />
        <OrbitingNodes />
        <BackgroundParticles />
      </Canvas>
    </div>
  );
}
