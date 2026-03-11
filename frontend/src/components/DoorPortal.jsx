import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";

const RIPPLE_COUNT = 6;
const RIPPLE_LIFETIME = 2.2;

export default function DoorPortal({
  position = [0, 1.2, 0],
  label = "Enter",
  onEnter,
  radius = 0.85,
  hitScale = 2.3,
  baseColor = "#1b9cff",
  edgeColor = "#9edcff",
  alwaysOnTop = true,
}) {
  const groupRef = useRef();
  const rippleRefs = useRef([]);
  const hoverRef = useRef(false);
  const downPos = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  const depthTest = !alwaysOnTop;

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.26,
        depthWrite: false,
        depthTest,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [baseColor, depthTest]
  );

  const rimMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: edgeColor,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        depthTest,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [edgeColor, depthTest]
  );

  const haloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: edgeColor,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        depthTest,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [edgeColor, depthTest]
  );

  useEffect(() => {
    return () => {
      coreMaterial.dispose();
      rimMaterial.dispose();
      haloMaterial.dispose();
    };
  }, [coreMaterial, rimMaterial, haloMaterial]);

  useFrame((_, dt) => {
    timeRef.current += dt;
    const t = timeRef.current;

    if (groupRef.current) {
      const current = groupRef.current.scale.x;
      const target = hoverRef.current ? 1.08 : 1;
      const next = THREE.MathUtils.damp(current, target, 8, dt);
      groupRef.current.scale.setScalar(next);
    }

    haloMaterial.opacity = 0.5 + 0.18 * Math.sin(t * 2.5);

    rippleRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const shift = i * (RIPPLE_LIFETIME / RIPPLE_COUNT);
      const local = (t - shift + RIPPLE_LIFETIME * 10) % RIPPLE_LIFETIME;
      const p = local / RIPPLE_LIFETIME;

      const scale = THREE.MathUtils.lerp(0.95, 2.9, p);
      mesh.scale.setScalar(scale);
      mesh.material.opacity = (1 - p) * 0.5;
    });
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    downPos.current.x = e.pointer.x;
    downPos.current.y = e.pointer.y;
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    const dx = e.pointer.x - downPos.current.x;
    const dy = e.pointer.y - downPos.current.y;
    if (Math.hypot(dx, dy) < 0.01) {
      onEnter?.({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <group
      position={position}
      renderOrder={alwaysOnTop ? 9999 : 0}
      frustumCulled={false}
    >
      <Billboard>
        <mesh
          frustumCulled={false}
          onPointerOver={(e) => {
            e.stopPropagation();
            hoverRef.current = true;
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            hoverRef.current = false;
            document.body.style.cursor = "auto";
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <circleGeometry args={[radius * hitScale, 56]} />
          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>

        <group ref={groupRef}>
          <mesh frustumCulled={false} renderOrder={10000}>
            <circleGeometry args={[radius * 1.7, 72]} />
            <primitive object={haloMaterial} attach="material" />
          </mesh>

          <mesh frustumCulled={false} renderOrder={10001}>
            <circleGeometry args={[radius * 0.62, 72]} />
            <primitive object={coreMaterial} attach="material" />
          </mesh>

          <mesh frustumCulled={false} renderOrder={10002}>
            <ringGeometry args={[radius * 0.78, radius * 0.96, 96]} />
            <primitive object={rimMaterial} attach="material" />
          </mesh>

          {Array.from({ length: RIPPLE_COUNT }).map((_, i) => (
            <mesh
              key={i}
              frustumCulled={false}
              renderOrder={10003}
              ref={(el) => {
                rippleRefs.current[i] = el;
              }}
            >
              <ringGeometry args={[radius * 0.92, radius * 0.98, 96]} />
              <meshBasicMaterial
                color={edgeColor}
                transparent
                opacity={0.5}
                depthWrite={false}
                depthTest={depthTest}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}

          <Sparkles
            count={26}
            size={2.6}
            speed={0.45}
            noise={0.8}
            color={edgeColor}
            scale={[radius * 3, radius * 3, 0.1]}
          />

          <Text
            position={[0, 0, 0.02]}
            fontSize={radius * 0.42}
            color="#e7f5ff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor="#08325c"
          >
            {label}
          </Text>
        </group>
      </Billboard>
    </group>
  );
}
