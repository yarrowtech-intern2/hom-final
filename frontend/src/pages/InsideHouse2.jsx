// pages/InsideHouse.jsx
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, Text, useGLTF, Preload } from "@react-three/drei";
import { DRACOLoader, MeshoptDecoder, GLTFLoader } from "three-stdlib";

/* ---------------- Camera aims forward once (keeps your behavior) ---------------- */
function CameraRig({ target = [0, 1.2, -2] }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.up.set(0, 1, 0);
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  }, [camera, target]);
  return null;
}

/* ------------------------------ Balcony model ------------------------------ */
function Balcony({
  url = "/models/gallery.glb",
  position = [0, 0, -2],     // tweak as needed
  rotation = [0, 0, 0],
  scale = 1,
  onReady,
}) {
  // Load with DRACO + Meshopt (safe even if the file isn't compressed that way)
  const gltf = useGLTF(
    url,
    (loader) => {
      if (loader instanceof GLTFLoader) {
        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/");  // serve decoder files from /public/draco/*
        loader.setDRACOLoader(draco);
        if (MeshoptDecoder) loader.setMeshoptDecoder(MeshoptDecoder);
      }
    }
  );

  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef();

  // Optional: small static optimizations for performance
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.frustumCulled = true;
        o.matrixAutoUpdate = false;
        o.updateMatrix();
        // shadows are off by default; enable if you add shadow lights
        o.castShadow = false;
        o.receiveShadow = false;
      }
    });
  }, [scene]);

  // Report bounds (handy if you want to auto-fit later)
  useEffect(() => {
    if (!group.current) return;
    const box = new THREE.Box3().setFromObject(group.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    onReady?.({ center, size, box });
  }, [onReady]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}
// Preload using same loader config
useGLTF.preload("/models/gallery.glb", (loader) => {
  if (loader instanceof GLTFLoader) {
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    loader.setDRACOLoader(draco);
    if (MeshoptDecoder) loader.setMeshoptDecoder(MeshoptDecoder);
  }
});

export default function InsideHouse() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.6, 2.2], fov: 60, near: 0.01, far: 200 }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        physicallyCorrectLights: true,
      }}
      onCreated={({ gl }) => {
        THREE.Cache.enabled = true;
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }}
    >
      {/* Background & light (keep as before) */}
      <color attach="background" args={["#060606"]} />
      <ambientLight intensity={0.5} />

      {/* Keep your camera behavior the same (looks forward) */}
      <CameraRig target={[0, 1.2, -2]} />

      <Suspense fallback={<Html center>Loading…</Html>}>
        {/* Your balcony model */}
        <Balcony
          url="/models/gallery.glb"
          position={[0, 0, -2]}      // put the balcony in front
          rotation={[0, 0, 0]}
          scale={1}
          onReady={({ size }) => {
            // Example: if it's huge/tiny, you can adjust scale here
            // console.log("Balcony size:", size);
          }}
        />

        {/* Example label (optional) */}
        <Text position={[0, 1.2, -2.8]} fontSize={0.22} color="#fff" anchorX="center">
          Balcony
        </Text>

        <Preload all />
      </Suspense>
    </Canvas>
  );
}
