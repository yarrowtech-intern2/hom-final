import React, { Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ScrollControls,
  Scroll,
  Html,
  ContactShadows,
  useGLTF,
  Preload,
  useScroll,
} from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import AnimatedGLTF from "../components/AnimatedGLTF.jsx";
import "../styles/about.css";
import "./story.css";

/* ----------------------------- Loader UI ----------------------------- */
function Loader() {
  return (
    <Html center className="loader">
      <div className="loader-box">
        <div className="loader-bar" />
        <p className="loader-text">Loading scene…</p>
      </div>
    </Html>
  );
}

/* ----------------------------- Utils -------------------------------- */
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ----------------------------- Camera Rig ---------------------------- */
/* Scroll-driven camera, with light parallax on mouse */
function CameraRig() {
  const scroll = useScroll();
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 1.3, 12),
          new THREE.Vector3(4, 1.1, 6),
          new THREE.Vector3(0, 1.2, 0),
          new THREE.Vector3(-3, 1.4, -5),
          new THREE.Vector3(0, 2.0, -10),
          new THREE.Vector3(0.5, 2.2, -13),
        ],
        false,
        "catmullrom",
        0.55
      ),
    []
  );

  const target = new THREE.Vector3();
  const look = new THREE.Vector3();

  useFrame((state, delta) => {
    const t = clamp01(scroll.offset);
    curve.getPointAt(t, target);
    const ahead = clamp01(t + 0.006);
    curve.getPointAt(ahead, look);

    // mouse parallax
    const mx = state.pointer.x;
    const my = state.pointer.y;
    target.x += mx * 0.45;
    target.y += my * 0.2;

    state.camera.position.lerp(target, 1 - Math.pow(0.001, delta));
    state.camera.lookAt(look);
  });

  return null;
}

/* ------------------------------ 3D World ----------------------------- */
function World() {
  const scroll = useScroll();
  const lightRef = useRef();
  const groupRef = useRef(); // mouse tilt group

  // mouse-tilt the entire stage slightly
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const tX = -state.pointer.y * 0.1;
    const tY = state.pointer.x * 0.15;
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      tX,
      4,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      tY,
      4,
      delta
    );
  });

  // light color/energy shift per chapter
  useFrame((_, delta) => {
    if (!lightRef.current) return;
    const ch1 = scroll.range(0 / 6, 1 / 6);
    const ch2 = scroll.range(1 / 6, 1 / 6);
    const ch3 = scroll.range(2 / 6, 1 / 6);
    const ch4 = scroll.range(3 / 6, 1 / 6);
    const ch5 = scroll.range(4 / 6, 1 / 6);
    const energy =
      0.8 +
      0.5 * easeOut(ch1) +
      0.4 * easeOut(ch3) +
      0.6 * easeOut(ch5); // pulse on a few chapters
    lightRef.current.intensity = THREE.MathUtils.damp(
      lightRef.current.intensity,
      energy,
      3,
      delta
    );
    // subtle hue shift
    const hue =
      0.6 * easeOut(ch2) + 0.0 * easeOut(ch3) + 0.9 * easeOut(ch4) + 0.2 * easeOut(ch5);
    lightRef.current.color.setHSL(0.6 * hue, 0.6, 0.6);
  });

  /* --- Per-actor scroll choreography (ranges in 6 pages) --- */
  const atomRef = useRef();
  const planetRef = useRef();
  const orbRef = useRef();

  useFrame((_, delta) => {
    const r1 = scroll.range(0 / 6, 1 / 6); // chapter 1
    const r2 = scroll.range(1 / 6, 1 / 6); // chapter 2
    const r3 = scroll.range(2 / 6, 1 / 6); // chapter 3
    const r4 = scroll.range(3 / 6, 1 / 6); // chapter 4
    const r5 = scroll.range(4 / 6, 1 / 6); // chapter 5
    const r6 = scroll.range(5 / 6, 1 / 6); // chapter 6

    // Golden Atom: enter from left, scale up, then orbit
    if (atomRef.current) {
      const enter = easeOut(r1);
      const hold = r2;
      const exit = r3;
      atomRef.current.position.x = THREE.MathUtils.damp(
        atomRef.current.position.x,
        THREE.MathUtils.lerp(-5, 0, enter) + THREE.MathUtils.lerp(0, 1.2, hold),
        6,
        delta
      );
      atomRef.current.position.z = THREE.MathUtils.damp(
        atomRef.current.position.z,
        THREE.MathUtils.lerp(5, 0, enter),
        6,
        delta
      );
      const s =
        THREE.MathUtils.lerp(0.6, 1, enter) *
        THREE.MathUtils.lerp(1, 1.15, hold) *
        THREE.MathUtils.lerp(1, 0.8, exit);
      atomRef.current.scale.setScalar(THREE.MathUtils.damp(atomRef.current.scale.x, s, 4, delta));
      atomRef.current.rotation.y += delta * (0.2 + hold * 0.8);
    }

    // Planet: descend from above, then “breath” with scroll
    if (planetRef.current) {
      const enter = easeInOut(r2);
      const feature = r3;
      planetRef.current.position.y = THREE.MathUtils.damp(
        planetRef.current.position.y,
        THREE.MathUtils.lerp(3, 0, enter),
        6,
        delta
      );
      planetRef.current.position.x = THREE.MathUtils.damp(
        planetRef.current.position.x,
        THREE.MathUtils.lerp(1, 0, enter),
        6,
        delta
      );
      const pulse = 1 + Math.sin(feature * Math.PI * 2) * 0.05;
      const s = THREE.MathUtils.lerp(0.8, 1.1, enter) * pulse;
      planetRef.current.scale.setScalar(
        THREE.MathUtils.damp(planetRef.current.scale.x, s, 5, delta)
      );
      planetRef.current.rotation.y += delta * (0.35 + feature * 0.4);
    }

    // Orb: exits towards depth as finale
    if (orbRef.current) {
      const show = easeInOut(r4);
      const outro = easeOut(r6);
      orbRef.current.position.z = THREE.MathUtils.damp(
        orbRef.current.position.z,
        THREE.MathUtils.lerp(6, -2, show) + THREE.MathUtils.lerp(0, -4, outro),
        4,
        delta
      );
      orbRef.current.rotation.x += delta * 0.25;
      orbRef.current.rotation.y -= delta * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lights / env */}
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={lightRef}
        position={[6, 8, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment preset="sunset" />

      <ContactShadows opacity={0.15} scale={24} blur={3} far={12} resolution={1024} />

      {/* 3D Actors (animated GLBs) */}
      {/* <group ref={atomRef} position={[5, 0, 3]}>
        <AnimatedGLTF url="/models/aboutPage/golden-atom.glb" scale={0.9} />
      </group> */}

      <group ref={planetRef} position={[10, 0, 8]}>
        <AnimatedGLTF url="/models/aboutPage/planet.glb" scale={1.2} />
      </group>

      {/* A small “orb” for transitions (can be any GLB) */}
      <group ref={orbRef} position={[-2, 0.6, 6]}>
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[0.8, 2]} />
          <meshPhysicalMaterial
            transmission={0.9}
            roughness={0.1}
            thickness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.05}
            ior={1.45}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------- HUD: Progress + Jump ---------------------- */
function ProgressBar() {
  const scroll = useScroll();
  const ref = useRef(null);
  useFrame(() => {
    if (ref.current) ref.current.style.transform = `scaleX(${scroll.offset})`;
  });
  return (
    <div className="prog">
      <span className="prog__bar" ref={ref} />
    </div>
  );
}

function JumpNav() {
  const scroll = useScroll();
  const go = (i) => {
    const el = scroll.el; // ScrollControls container
    const h = el.clientHeight;
    el.scrollTo({ top: i * h, behavior: "smooth" });
  };
  return (
    <div className="jumpnav">
      {["Prologue", "Awakening", "Passage", "Discovery", "Bridge", "Finale"].map(
        (label, i) => (
          <button key={label} className="chip" onClick={() => go(i)}>
            {label}
          </button>
        )
      )}
    </div>
  );
}

/* ---------------------------- The Page View -------------------------- */
export default function StoryWorld() {
  return (
    <div className="story-container">
      <Canvas
        frameloop="always"
        shadows
        style={{ background: "transparent" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 1.3, 12], fov: 50, near: 0.1, far: 200 }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <Suspense fallback={<Loader />}>
          {/* 6 pages now for more story beats */}
          <ScrollControls pages={6} damping={0.16}>
            <CameraRig />

            {/* 3D stage that reacts to scroll & mouse */}
            <World />

            {/* Subtle post FX */}
            <EffectComposer disableNormalPass>
              <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.25} luminanceSmoothing={0.2} />
              <Vignette eskil={false} offset={0.1} darkness={0.3} />
            </EffectComposer>

            <Preload all />

            {/* Overlay HTML */}
            <Scroll html>
              <ProgressBar />
              {/* <JumpNav /> */}


              <div className="story-overlay">
                <section className="story-section">
                  <h1 className="story-title">House of Musa — Prologue</h1>
                  <p className="story-p">
                    Scroll to begin the journey. The camera glides while artifacts respond to your
                    movement and cursor.
                  </p>
                </section>

                <section className="story-section">
                  <h2 className="story-subtitle">Project 1 — Electronic Educare</h2>
                  <p className="story-p">
                    Electronic Educare is an AI-powered Learning Management System designed to personalize education through intelligent content recommendations, automated assessments, and adaptive learning paths. It enables students to learn at their own pace while helping teachers track performance efficiently. The platform integrates smart analytics to enhance engagement and improve overall learning outcomes.
                  </p>
                </section>

                <section className="story-section">
                  <h2 className="story-subtitle">Project 2 — Sportbit</h2>
                  <p className="story-p">
                    SportBit is an AI-driven sports management platform that streamlines player, club, and manager operations in one unified system. It provides performance analytics, fitness tracking, and intelligent insights to enhance player development and team strategy. With role-based dashboards and automated data management, SportBit simplifies decision-making for coaches, managers, and athletes alike.
                  </p>
                </section>

                <section className="story-section">
                  <h2 className="story-subtitle">Project 3 — F&B</h2>
                  <p className="story-p">
                   F&B is an AI-powered restaurant management system designed to optimize daily operations, from order processing to inventory control. It uses intelligent forecasting to manage demand, reduce waste, and improve customer satisfaction. With smart analytics and automated reporting, F&B helps restaurant owners make data-driven decisions for smoother, more profitable operations.
                  </p>
                </section>

                <section className="story-section">
                  <h2 className="story-subtitle">Project 4 — Tour Guide</h2>
                  <p className="story-p">
                    Tour Guide is an intelligent tour management system that simplifies travel planning and coordination for agencies and travelers. It offers features like itinerary creation, booking management, and real-time tracking. With automated scheduling and smart recommendations, Tour Guide enhances the travel experience while improving efficiency for tour operators.
                  </p>
                </section>

                <section className="story-section">
                  <h2 className="story-subtitle">Yarrowtech</h2>
                  <p className="story-p">
                    Yarrowtech is a forward-thinking technology company committed to creating intelligent, AI-powered solutions that redefine how people learn, work, and connect. As the driving force behind products like Electronic Educare, SportBit, F&B, and Tour Guide, we specialize in blending innovation with practicality. Our mission is to harness the power of artificial intelligence to simplify complex challenges, empower industries, and shape a smarter, more efficient digital future.
                  </p>
                  <a className="story-cta" href="/">Return Home</a>
                </section>
              </div>

              
            </Scroll>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

/* Preload your models */
useGLTF.preload("/models/aboutPage/planet.glb");
// useGLTF.preload("/models/aboutPage/golden-atom.glb");
