import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * Stylized "food" objects — built from primitives so we never have to load
 * external GLTF assets (keeps the bundle light and works in Worker SSR).
 */

function PizzaSlice({ color = "#E8B948" }: { color?: string }) {
  // wedge made from a cylinder cut to 1/8
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(1, 1, 0.12, 32, 1, false, 0, Math.PI / 4);
    return g;
  }, []);
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* crust */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.07, 8, 32, Math.PI / 4]} />
        <meshStandardMaterial color="#8a5a2b" roughness={0.9} />
      </mesh>
      {/* pepperoni dots */}
      {[
        [0.25, 0.06, 0.1],
        [0.45, 0.06, 0.25],
        [0.6, 0.06, 0.1],
        [0.35, 0.06, 0.35],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#C8391A" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function ChickenDrumstick() {
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color="#a85a1f" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.7, 16]} />
        <meshStandardMaterial color="#f4ead0" roughness={0.4} />
      </mesh>
    </group>
  );
}

function SubSandwich() {
  return (
    <group rotation={[0, 0, 0.2]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.42, 1.5, 8, 16]} />
        <meshStandardMaterial color="#d9a44a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.05, 0]} scale={[1, 0.3, 1]}>
        <capsuleGeometry args={[0.42, 1.4, 8, 16]} />
        <meshStandardMaterial color="#7fb368" roughness={0.7} />
      </mesh>
    </group>
  );
}

function SaladBowl() {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.85, 0.55, 0.5, 32]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.7, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5fa84a" roughness={0.85} />
      </mesh>
      {/* tomato */}
      <mesh position={[0.25, 0.5, 0.1]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color="#C8391A" roughness={0.6} />
      </mesh>
      <mesh position={[-0.2, 0.5, 0.2]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color="#C9922A" roughness={0.7} />
      </mesh>
    </group>
  );
}

const PIECES = [PizzaSlice, ChickenDrumstick, SubSandwich, SaladBowl] as const;

function FloatingPiece({
  Component,
  position,
  scale = 1,
  speed = 1,
}: {
  Component: (typeof PIECES)[number];
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4 * speed) * 0.2;
  });
  return (
    <Float speed={1.2 * speed} rotationIntensity={0.3} floatIntensity={1.2}>
      <group ref={ref} position={position} scale={scale}>
        <Component />
      </group>
    </Float>
  );
}

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const x = (state.pointer.x * 0.4);
    const y = (state.pointer.y * 0.3);
    ref.current.position.x += (x - ref.current.position.x) * 0.05;
    ref.current.position.y += (y - ref.current.position.y) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

export type FloatingFoodSceneProps = {
  className?: string;
  density?: "low" | "med" | "high";
};

export function FloatingFoodScene({ className, density = "med" }: FloatingFoodSceneProps) {
  const items = useMemo(() => {
    const counts = { low: 4, med: 7, high: 10 }[density];
    const arr: { C: (typeof PIECES)[number]; pos: [number, number, number]; scale: number; speed: number }[] = [];
    for (let i = 0; i < counts; i++) {
      arr.push({
        C: PIECES[i % PIECES.length],
        pos: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4 - 1,
        ],
        scale: 0.7 + Math.random() * 0.7,
        speed: 0.6 + Math.random() * 0.8,
      });
    }
    return arr;
  }, [density]);

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.1} castShadow />
          <directionalLight position={[-3, -2, -3]} intensity={0.4} color="#C9922A" />
          <ParallaxRig>
            {items.map((it, i) => (
              <FloatingPiece
                key={i}
                Component={it.C}
                position={it.pos}
                scale={it.scale}
                speed={it.speed}
              />
            ))}
          </ParallaxRig>
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default FloatingFoodScene;
