import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export default function InsideHouse() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 2.2], fov: 60 }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
    >
      <color attach="background" args={["#060606"]} />
      <ambientLight intensity={0.5} />
      <Suspense fallback={<Html center>Loading…</Html>}>
        {/* TODO: Place an interior scene or a second camera inside your house model */}
        <mesh position={[0, 1.2, -2]}>
          <textGeometry args={["Inside the House", { size: 0.2, height: 0.02 }]} />
          <meshStandardMaterial />
        </mesh>
      </Suspense>
    </Canvas>
  );
}
