import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, RoundedBox, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/**
 * Hero V3 — cinematic, multi-layer banking scene for the landing page only.
 * Layers back-to-front: depth fog → volumetric light rays → ambient glow →
 * transaction particle field → data streams/packets → floating glass
 * account widgets → the main card. Every layer responds to mouse + scroll
 * at a different intensity (parallax), the whole rig drifts gently even at
 * rest (breathing scale + camera drift), and the main card carries real
 * PBR glass/metal materials with contact shadows underneath.
 *
 * Still restrained: no bloom/DOF post-processing, no saturated neon, no
 * particle "explosions" — premium banking, not crypto/gaming.
 */

function BrandCardTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 1024, 640);
    gradient.addColorStop(0, "#182347");
    gradient.addColorStop(0.55, "#1d2b52");
    gradient.addColorStop(1, "#12213a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 640);

    const sweep = ctx.createRadialGradient(920, 60, 20, 920, 60, 420);
    sweep.addColorStop(0, "rgba(6, 182, 212, 0.35)");
    sweep.addColorStop(1, "rgba(6, 182, 212, 0)");
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, 1024, 640);

    ctx.fillStyle = "rgba(248, 250, 252, 0.85)";
    ctx.beginPath();
    ctx.roundRect(90, 220, 110, 82, 12);
    ctx.fill();
    ctx.fillStyle = "#1d2b52";
    ctx.fillRect(105, 240, 80, 3);
    ctx.fillRect(105, 258, 80, 3);
    ctx.fillRect(105, 276, 80, 3);

    ctx.fillStyle = "rgba(248, 250, 252, 0.55)";
    ctx.font = "600 40px 'JetBrains Mono', monospace";
    ctx.letterSpacing = "6px";
    ctx.fillText("•••• •••• •••• 4821", 88, 420);

    ctx.fillStyle = "rgba(248, 250, 252, 0.95)";
    ctx.font = "700 46px 'Inter', sans-serif";
    ctx.letterSpacing = "0px";
    ctx.fillText("NovaBank", 88, 130);

    ctx.fillStyle = "rgba(248, 250, 252, 0.5)";
    ctx.font = "500 26px 'Inter', sans-serif";
    ctx.fillText("PREMIUM", 88, 540);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

/** Small canvas-texture generator for the glass widget faces (balance /
 * verified chips) — same zero-external-asset approach as the main card. */
function useWidgetTexture(label, value, accent) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(17, 24, 39, 0.001)"; // effectively transparent base
    ctx.fillRect(0, 0, 512, 320);

    ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
    ctx.font = "600 30px 'Inter', sans-serif";
    ctx.fillText(label, 36, 130);

    ctx.fillStyle = accent;
    ctx.font = "700 52px 'Inter', sans-serif";
    ctx.fillText(value, 36, 200);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [label, value, accent]);
}

/** Elongated additive-blend plane simulating a soft volumetric light shaft. */
function useRayTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0)");
    gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.35)");
    gradient.addColorStop(1, "rgba(6, 182, 212, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 512);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

/** Soft radial glow sprite behind everything — the "ambient volumetric glow". */
function useGlowTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, "rgba(37, 99, 235, 0.5)");
    gradient.addColorStop(0.5, "rgba(37, 99, 235, 0.14)");
    gradient.addColorStop(1, "rgba(37, 99, 235, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

function AmbientGlow({ reduceMotion }) {
  const texture = useGlowTexture();
  const ref = useRef(null);

  useFrame((state) => {
    if (reduceMotion || !ref.current) return;
    // Breathing — slow scale/opacity pulse so the scene feels alive at rest.
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.35) * 0.06;
    ref.current.scale.setScalar(7 * breathe);
    ref.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
  });

  return (
    <sprite ref={ref} position={[0.4, 0, -3.2]} scale={7}>
      <spriteMaterial map={texture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

function LightRays({ reduceMotion }) {
  const texture = useRayTexture();
  const groupRef = useRef(null);

  const rays = useMemo(
    () => [
      { x: 1.4, z: -2.4, rot: 0.35, scale: [1.1, 5.5, 1] },
      { x: 2.3, z: -2.8, rot: 0.5, scale: [0.8, 4.6, 1] },
      { x: -2.6, z: -2.6, rot: -0.4, scale: [0.9, 5, 1] },
    ],
    []
  );

  useFrame((state) => {
    if (reduceMotion || !groupRef.current) return;
    groupRef.current.children.forEach((mesh, i) => {
      mesh.material.opacity = 0.16 + Math.sin(state.clock.elapsedTime * 0.25 + i * 1.4) * 0.08;
      mesh.position.y = Math.sin(state.clock.elapsedTime * 0.15 + i) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <mesh key={i} position={[ray.x, 0, ray.z]} rotation={[0, 0, ray.rot]} scale={ray.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Small floating glass account widgets — mid-ground layer, its own parallax. */
function GlassWidget({ position, rotation, label, value, accent, reduceMotion, floatSpeed }) {
  const texture = useWidgetTexture(label, value, accent);
  const groupRef = useRef(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (reduceMotion || !groupRef.current) return;
    const targetX = pointer.y * 0.08;
    const targetY = pointer.x * 0.08;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03;
  });

  return (
    <Float speed={reduceMotion ? 0 : floatSpeed} rotationIntensity={0.15} floatIntensity={0.9}>
      <group ref={groupRef} position={position} rotation={rotation}>
        <RoundedBox args={[1.5, 0.94, 0.04]} radius={0.09} smoothness={4}>
          <meshPhysicalMaterial
            color="#111827"
            transparent
            opacity={0.55}
            roughness={0.15}
            metalness={0.1}
            transmission={0.4}
            thickness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.023]}>
          <planeGeometry args={[1.4, 0.85]} />
          <meshBasicMaterial map={texture} transparent />
        </mesh>
      </group>
    </Float>
  );
}

function BankCard({ reduceMotion, scrollProgress }) {
  const meshRef = useRef(null);
  const texture = BrandCardTexture();
  const { pointer } = useThree();

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!reduceMotion) {
      mesh.rotation.y += delta * 0.18;
      const scrollTilt = (scrollProgress?.current || 0) * 0.35;
      const targetX = pointer.y * 0.22 + scrollTilt;
      const targetZ = -pointer.x * 0.14;
      mesh.rotation.x += (targetX - mesh.rotation.x) * 0.04;
      mesh.rotation.z += (targetZ - mesh.rotation.z) * 0.04;

      const targetY = -(scrollProgress?.current || 0) * 0.6;
      mesh.position.y += (targetY - mesh.position.y) * 0.05;

      // Breathing — subtle idle scale pulse, independent of hover/scroll.
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.012;
      mesh.scale.setScalar(breathe);
    }
  });

  return (
    <Float
      speed={reduceMotion ? 0 : 1.1}
      rotationIntensity={reduceMotion ? 0 : 0.22}
      floatIntensity={reduceMotion ? 0 : 0.7}
    >
      <group ref={meshRef} rotation={[0.18, -0.42, 0.05]}>
        <RoundedBox args={[3.2, 2, 0.09]} radius={0.14} smoothness={6}>
          <meshPhysicalMaterial
            map={texture}
            roughness={0.28}
            metalness={0.6}
            clearcoat={0.85}
            clearcoatRoughness={0.18}
            reflectivity={0.55}
            envMapIntensity={1.1}
          />
        </RoundedBox>
      </group>
    </Float>
  );
}

function TransactionParticles({ count = 140, reduceMotion }) {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (reduceMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#5eb3c9" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function DataStreams({ reduceMotion }) {
  const groupRef = useRef(null);

  const lines = useMemo(() => {
    return new Array(5).fill(null).map((_, i) => {
      const y = -1.6 + i * 0.8;
      const points = [];
      for (let x = -5; x <= 5; x += 0.5) {
        points.push(new THREE.Vector3(x, y + Math.sin(x * 0.6 + i) * 0.12, -1.8));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  useFrame((state) => {
    if (reduceMotion || !groupRef.current) return;
    groupRef.current.children.forEach((line, i) => {
      line.material.opacity = 0.12 + Math.abs(Math.sin(state.clock.elapsedTime * 0.4 + i)) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((geometry, i) => (
        <line key={i} geometry={geometry}>
          <lineBasicMaterial color="#2563eb" transparent opacity={0.18} />
        </line>
      ))}
    </group>
  );
}

function TransactionPackets({ reduceMotion, count = 6 }) {
  const groupRef = useRef(null);

  const packets = useMemo(
    () =>
      new Array(count).fill(null).map((_, i) => ({
        lane: i % 5,
        offset: Math.random(),
        speed: 0.12 + Math.random() * 0.08,
      })),
    [count]
  );

  useFrame((state) => {
    if (reduceMotion || !groupRef.current) return;
    groupRef.current.children.forEach((mesh, i) => {
      const p = packets[i];
      const t = (state.clock.elapsedTime * p.speed + p.offset) % 1;
      const x = -5 + t * 10;
      const y = -1.6 + p.lane * 0.8 + Math.sin(x * 0.6 + p.lane) * 0.12;
      mesh.position.set(x, y, -1.75);
      mesh.material.opacity = Math.sin(t * Math.PI) * 0.85;
    });
  });

  return (
    <group ref={groupRef}>
      {packets.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshBasicMaterial color={p.lane % 2 === 0 ? "#5eb3c9" : "#7fa8f5"} transparent />
        </mesh>
      ))}
    </group>
  );
}

/** Animates the two directional lights so reflections drift subtly — the
 * "dynamic lighting" layer. Kept slow and low-amplitude: premium, not disco. */
function DynamicLights({ reduceMotion }) {
  const keyLightRef = useRef(null);
  const rimLightRef = useRef(null);

  useFrame((state) => {
    if (reduceMotion) return;
    const t = state.clock.elapsedTime;
    if (keyLightRef.current) {
      keyLightRef.current.position.x = 4 + Math.sin(t * 0.2) * 0.6;
      keyLightRef.current.position.y = 5 + Math.cos(t * 0.15) * 0.4;
      keyLightRef.current.intensity = 1.05 + Math.sin(t * 0.3) * 0.1;
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 0.22 + Math.sin(t * 0.4 + 1) * 0.06;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight ref={keyLightRef} position={[4, 5, 3]} intensity={1.1} color="#f8fafc" />
      <directionalLight ref={rimLightRef} position={[-4, -2, -3]} intensity={0.25} color="#06b6d4" />
      <pointLight position={[0, 2, 2]} intensity={0.3} color="#93c5fd" />
    </>
  );
}

/** Slow idle camera drift — the rig never sits perfectly still, even with
 * no pointer input. Small amplitude so it never fights the mouse-parallax
 * tilt applied to the card/widgets themselves. */
function CameraDrift({ reduceMotion }) {
  const { camera } = useThree();
  useFrame((state) => {
    if (reduceMotion) return;
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.18;
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.09) * 0.12;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ reduceMotion, scrollProgress }) {
  return (
    <>
      <fog attach="fog" args={["#0b1020", 6, 13]} />
      <DynamicLights reduceMotion={reduceMotion} />
      <CameraDrift reduceMotion={reduceMotion} />

      <AmbientGlow reduceMotion={reduceMotion} />
      <LightRays reduceMotion={reduceMotion} />
      <TransactionParticles reduceMotion={reduceMotion} />
      <DataStreams reduceMotion={reduceMotion} />
      <TransactionPackets reduceMotion={reduceMotion} />

      <GlassWidget
        position={[-2.55, 1.15, 0.4]}
        rotation={[0.1, 0.3, -0.08]}
        label="Balance"
        value="$18,420"
        accent="#93c5fd"
        reduceMotion={reduceMotion}
        floatSpeed={0.9}
      />
      <GlassWidget
        position={[2.5, -1.05, 0.6]}
        rotation={[-0.08, -0.28, 0.06]}
        label="Status"
        value="Verified"
        accent="#5eeecb"
        reduceMotion={reduceMotion}
        floatSpeed={1.3}
      />

      <BankCard reduceMotion={reduceMotion} scrollProgress={scrollProgress} />

      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.45}
        scale={9}
        blur={2.6}
        far={2.5}
        color="#000814"
      />

      <Environment preset="city" environmentIntensity={0.4} />
    </>
  );
}

export default function HeroCard3D({ reduceMotion = false, scrollProgress }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene reduceMotion={reduceMotion} scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}
