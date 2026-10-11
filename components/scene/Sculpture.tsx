"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Color, Group, InstancedMesh, Object3D } from "three";
import { storyProgress } from "@/lib/motion";
import type { SceneProps } from "./SceneBoundary";
const object = new Object3D();
function DataBlocks({
  active,
  onFailure,
}: {
  active: boolean;
  onFailure: () => void;
}) {
  const group = useRef<Group>(null),
    mesh = useRef<InstancedMesh>(null),
    angle = useRef(0),
    slow = useRef(0),
    quality = useRef(0);
  const { gl, invalidate, setDpr, size } = useThree();
  const count = size.width < 500 ? 48 : 96;
  useEffect(() => {
    const canvas = gl.domElement;
    const loss = (e: Event) => {
      e.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", loss);
    return () => canvas.removeEventListener("webglcontextlost", loss);
  }, [gl, onFailure]);
  useEffect(() => {
    if (!mesh.current) return;
    mesh.current.count = count;
    if (count === 48) setDpr(1);
    for (let i = 0; i < count; i++) {
      mesh.current.setColorAt(
        i,
        new Color(
          i % 19 === 0 ? "#f3c77b" : i % 3 === 0 ? "#b4fce3" : "#57c4a4",
        ),
      );
    }
    if (mesh.current.instanceColor)
      mesh.current.instanceColor.needsUpdate = true;
    invalidate();
  }, [invalidate, count, setDpr]);
  useFrame((state, delta) => {
    if (!mesh.current || !group.current) return;
    const dt = Math.min(delta, 0.05);
    if (active) {
      angle.current += dt * 0.035;
      if (delta > 0.034) slow.current++;
      else slow.current = Math.max(0, slow.current - 1);
      if (slow.current > 100) {
        if (quality.current === 0) {
          setDpr(1);
          quality.current = 1;
          slow.current = 0;
        } else {
          onFailure();
          return;
        }
      }
    }
    group.current.rotation.y = 0.5 + angle.current + state.pointer.x * 0.06;
    group.current.rotation.x = 0.3 - state.pointer.y * 0.06;
    for (let i = 0; i < 96; i++) {
      const col = i % 6,
        row = Math.floor(i / 6) % 4,
        layer = Math.floor(i / 24),
        p = storyProgress.current;
      const spread = 1 - p * 0.25;
      object.position.set(
        (col - 2.5) * 0.55 * spread,
        (row - 1.5) * 0.55 + Math.sin(col * 1.5 + layer) * 0.25 * (1 - p),
        (layer - 1.5) * 0.55 * spread,
      );
      object.rotation.set(0, 0, 0);
      object.scale.setScalar(i % 11 === 0 ? 0.29 : 0.4);
      object.updateMatrix();
      mesh.current.setMatrixAt(i, object.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, 96]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.3} metalness={0.28} />
      </instancedMesh>
      <RoundedBox
        args={[3.6, 0.035, 2.7]}
        radius={0.01}
        position={[0, -1.5, 0]}
      >
        <meshStandardMaterial color="#203e47" transparent opacity={0.75} />
      </RoundedBox>
    </group>
  );
}
export function Sculpture({ active, onFailure }: SceneProps) {
  const [ready, setReady] = useState(false);
  return (
    <div className={`webgl ${ready ? "ready" : ""}`}>
      <Canvas
        orthographic
        camera={{ position: [4, 3, 6], zoom: 85 }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: false, antialias: true, powerPreference: "low-power" }}
        onCreated={() => setReady(true)}
        fallback={<span />}
      >
        <color attach="background" args={["#0c1c27"]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 4]} intensity={3} />
        <directionalLight
          position={[-4, 2, -2]}
          color="#75e2c0"
          intensity={2}
        />
        <DataBlocks active={active} onFailure={onFailure} />
      </Canvas>
    </div>
  );
}
