import React, { Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Preload } from "@react-three/drei";
import * as THREE from "three";
import AnimatedGLTF from "../components/AnimatedGLTF.jsx";

/**
 * AboutBg (Background-only)
 * - Keeps About page background vibe (3D models + environment)
 * - DOES NOT hijack page scrolling (no ScrollControls)
 * - Renders children as normal DOM so your Careers page scrolls perfectly
 */

const Scene = memo(() => {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 8, 4]} intensity={1.15} castShadow />

      <Environment preset="studio" />

      <ContactShadows
        opacity={0}
        scale={22}
        blur={2.8}
        far={10}
        resolution={1024}
        position={[0, -0.001, 0]}
      />

      {/* About background models */}
      <AnimatedGLTF url="/models/aboutPage/golden-atom10.glb" scale={0.8} position={[5, 0, 3]} />
      <AnimatedGLTF url="/models/aboutPage/planet10.glb" scale={1.2} position={[10, 0, 8]} />
    </>
  );
});

Scene.displayName = "Scene";

export default function AboutBg({ children }) {
  return (
    <div
      className="aboutbg-root"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        overflowY: "auto", // ✅ allow scroll
        background: "#9d6800",
      }}
    >
      {/* Background canvas */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          camera={{ position: [0, 1.3, 12], fov: 50, near: 0.1, far: 120 }}
          onCreated={({ gl }) => gl.setClearAlpha(0)}
        >
          <Suspense fallback={null}>
            <Scene />
            <Preload all />
          </Suspense>
        </Canvas>

        {/* Soft overlay so content stays readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(900px 500px at 20% 10%, rgba(255,255,255,0.22), transparent 60%)," +
              "radial-gradient(700px 450px at 70% 20%, rgba(0,0,0,0.14), transparent 65%)," +
              "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.10))",
          }}
        />
      </div>

      {/* Page content (normal DOM) */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
