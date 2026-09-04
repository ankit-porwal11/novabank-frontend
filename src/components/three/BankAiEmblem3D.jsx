import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function Emblem({ reduceMotion }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const ringRef = useRef(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    if (reduceMotion) {
      group.rotation.set(0.12, -0.28, 0);
      return;
    }

    const t = state.clock.elapsedTime;
    const hoverBoost = Math.min(1, Math.max(0, (state.pointer.x ** 2 + state.pointer.y ** 2) * 1.6));

    group.position.y = Math.sin(t * 0.9) * 0.045;
    group.rotation.y = -0.22 + state.pointer.x * (0.18 + hoverBoost * 0.22);
    group.rotation.x = 0.14 + state.pointer.y * (0.12 + hoverBoost * 0.16);

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.55;
      coreRef.current.rotation.x = 0.4 + Math.sin(t * 0.7) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.35;
      ringRef.current.rotation.x = Math.PI / 2.35;
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1.05, 0.16, 0.82]} radius={0.05} smoothness={3} position={[0, -0.62, 0]}>
        <meshStandardMaterial color="#1a2748" metalness={0.55} roughness={0.35} />
      </RoundedBox>
      <RoundedBox args={[0.78, 0.92, 0.58]} radius={0.07} smoothness={3} position={[0, -0.04, 0]}>
        <meshStandardMaterial color="#22315a" metalness={0.42} roughness={0.32} />
      </RoundedBox>
      {[-0.18, 0, 0.18].map((x) => (
        <mesh key={x} position={[x, -0.08, 0.3]}>
          <boxGeometry args={[0.08, 0.58, 0.04]} />
          <meshStandardMaterial color="#93c5fd" metalness={0.2} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.52, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.52, 0.28, 4]} />
        <meshStandardMaterial color="#2563eb" metalness={0.5} roughness={0.28} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0.68, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#0891b2"
          emissiveIntensity={0.45}
          metalness={0.3}
          roughness={0.22}
        />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.68, 0]}>
        <torusGeometry args={[0.3, 0.016, 8, 40]} />
        <meshStandardMaterial color="#67e8f9" metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Scene({ reduceMotion }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.4, 2.8, 3]} intensity={1.05} color="#f8fafc" />
      <pointLight position={[-1.6, 1.2, 1.4]} intensity={0.35} color="#67e8f9" />
      <Emblem reduceMotion={reduceMotion} />
    </>
  );
}

export default function BankAiEmblem3D({ reduceMotion = false }) {
  const coarse =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return (
    <Canvas
      dpr={coarse ? [1, 1] : [1, 1.5]}
      camera={{ position: [0, 0.12, 2.7], fov: 34 }}
      gl={{
        antialias: !coarse,
        alpha: true,
        powerPreference: coarse ? "low-power" : "high-performance",
      }}
      frameloop={reduceMotion ? "demand" : "always"}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0x000000), 0);
      }}
    >
      <Suspense fallback={null}>
        <Scene reduceMotion={reduceMotion} />
      </Suspense>
    </Canvas>
  );
}
