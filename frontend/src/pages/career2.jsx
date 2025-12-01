// CareerPage.jsx
import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { Link } from "react-router-dom";
import Waves from "../components/waves";               // ⬅️ your fixed Waves component
import "./career2.css";
import { usePageTransition } from "../components/transition";


const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function RobotGLB({ url = "/models/bayma.glb", pointer, enableTilt = true }) {
  const { scene } = useGLTF(url);
  const bodyRef = useRef(null);
  const headRef = useRef(null);
  const pupilL = useRef(null);
  const pupilR = useRef(null);

  const baseL = useRef(new THREE.Vector3());
  const baseR = useRef(new THREE.Vector3());
  const inited = useRef(false);

  useEffect(() => {
    if (!scene) return;
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.frustumCulled = false;
      }
    });

    bodyRef.current = scene.getObjectByName("Body") ?? null;
    headRef.current = scene.getObjectByName("Head") ?? null;
    pupilL.current = scene.getObjectByName("Pupil_L") ?? null;
    pupilR.current = scene.getObjectByName("Pupil_R") ?? null;

    if (!inited.current && pupilL.current && pupilR.current) {
      baseL.current.copy(pupilL.current.position);
      baseR.current.copy(pupilR.current.position);
      inited.current = true;
    }
  }, [scene]);

  const maxTilt = THREE.MathUtils.degToRad(8);
  const eyeRadius = 0.12;

  useFrame((_, dt) => {
    const tX = clamp(pointer.current.x, -1, 1);
    const tY = clamp(pointer.current.y, -1, 1);

    if (enableTilt && bodyRef.current) {
      bodyRef.current.rotation.x = THREE.MathUtils.damp(
        bodyRef.current.rotation.x,
        tY * maxTilt,
        6,
        dt
      );
      bodyRef.current.rotation.y = THREE.MathUtils.damp(
        bodyRef.current.rotation.y,
        tX * maxTilt * 0.8,
        6,
        dt
      );
    }
    if (enableTilt && headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.damp(
        headRef.current.rotation.y,
        tX * 0.35,
        6,
        dt
      );
      headRef.current.rotation.x = THREE.MathUtils.damp(
        headRef.current.rotation.x,
        tY * 0.25,
        6,
        dt
      );
    }

    const angle = Math.atan2(tY, tX);
    const mag = Math.min(Math.hypot(tX, tY), 1) * eyeRadius;
    const offX = Math.cos(angle) * mag;
    const offY = Math.sin(angle) * mag;

    if (pupilL.current) {
      pupilL.current.position.set(
        baseL.current.x + offX,
        baseL.current.y + offY,
        baseL.current.z
      );
    }
    if (pupilR.current) {
      pupilR.current.position.set(
        baseR.current.x + offX,
        baseR.current.y + offY,
        baseR.current.z
      );
    }
  });

  return <primitive object={scene} />;
}

/** Runs inside the Canvas so hooks are valid; makes canvas fully transparent */
function TransparentClear() {
  const { gl } = useThree();
  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);
  return null;
}

function Scene({ pointer }) {
  return (
    <Canvas
      shadows
      gl={{ alpha: true, antialias: true }}                 // transparent canvas
      camera={{ position: [0, 1.5, 5], fov: 45, near: 0.1, far: 500 }}
      style={{ width: "100vw", height: "100vh", display: "block" }}
    >
      <TransparentClear />

      {/* Lighting */}
      <hemisphereLight intensity={0.7} groundColor={new THREE.Color("#3b1f00")} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={1.1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Soft ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>

      {/* Model */}
      <group position={[0, -4, -4]} scale={[1.2, 1.2, 1.2]}>
        <RobotGLB pointer={pointer} enableTilt />
      </group>

      {/* Subtle post effect */}
      <Environment preset="sunset" intensity={0.2} />
      <EffectComposer>
        <Vignette eskil={false} offset={0.35} darkness={0.65} />
      </EffectComposer>

      <OrbitControls enabled={false} />
    </Canvas>
  );
}

export default function BaymaksHome() {
  const pointer = useRef({ x: 0, y: 0 });
  const { start } = usePageTransition();

  const handleExplore = (e) => {
  e.preventDefault();
  const rect = e.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  start("/jobs", {
    x,
    y,
    duration: 0.65,
    ease: "power4.inOut",
  });
};

  const handlePointer = (e) => {
    const x = (e.clientX ?? (e.touches?.[0]?.clientX ?? 0)) / window.innerWidth;
    const y = (e.clientY ?? (e.touches?.[0]?.clientY ?? 0)) / window.innerHeight;
    pointer.current.x = clamp(x * 2 - 1, -1, 1);
    pointer.current.y = clamp(-(y * 2 - 1), -1, 1);
  };

  return (
    <div onMouseMove={handlePointer} onTouchMove={handlePointer} className="carrers-root"
     style={{ height: "100vh", width: "100vw" }}
    >
      {/* Waves background layer (behind everything) */}
      <div className="bg-waves">
        <Waves
          lineColor="#ffffff"
          backgroundColor="transparent"   /* let the glow/canvas tint the scene */
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      {/* Radial glow overlay (brand tint) */}
      <div className="carrers-glow" />

      {/* 3D Canvas */}
      <div className="carrers-canvas">
        <Scene pointer={pointer} />
      </div>

      {/* Overlays */}
      <div className="carrers-title">
        <span className="big">Carrers</span>
      </div>

      <section className="carrers-sec">
        <h1>We bring a wealth of Experience from wide range of Backgrounds</h1>
      </section>

      <section className="carrers-sec-cta">
        <div className="txt">
          <div id="cta-up">We are Hiring</div>
          <Link to="/jobs" className="carrers-btn" onClick={handleExplore}>Explore Now</Link>
        </div>
      </section>
    </div>
  );
}

useGLTF.preload("/models/bayma.glb");
