import React, { Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ScrollControls,
  Scroll,
  Html,
  ContactShadows,
  useGLTF,
  Float,
  Preload,
  useScroll,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";
import "../styles/about.css";
import AnimatedGLTF from "../components/AnimatedGLTF.jsx";

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
















function CameraRig() {
  const scroll = useScroll();
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 1.3, 12),
        new THREE.Vector3(4, 1.1, 6),
        new THREE.Vector3(0, 1.2, 0),
        new THREE.Vector3(-3, 1.4, -5),
        new THREE.Vector3(0, 2.0, -10),
      ],
      false,
      "catmullrom",
      0.5
    );
  }, []);

  const target = new THREE.Vector3();
  const look = new THREE.Vector3();

  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    curve.getPointAt(t, target);
    const ahead = THREE.MathUtils.clamp(t + 0.005, 0, 1);
    curve.getPointAt(ahead, look);

    // Smooth camera movement (lerp)
    state.camera.position.lerp(target, 1 - Math.pow(0.001, delta));
    state.camera.lookAt(look);
  });

  return null;
}

/* ------------------------------ Main Scene --------------------------- */
function Scene() {
  return (
    <>
      {/* lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset="sunset" />

      {/* Ground contact softness */}
      <ContactShadows
        opacity={0}
        scale={20}
        blur={2.8}
        far={10}
        resolution={1024}
        color="#000000"
        frames={1}
        position={[0, -0.001, 0]}
      />

      {/* --------- DROP YOUR MODELS HERE --------- */}

      {/* <GLTFModel url="/models/aboutPage/buble.glb" scale={1.2} position={[0, 0, 0]} />
      <GLTFModel url="/models/aboutPage/golden-atom.glb" scale={0.8} position={[3.5, 0, -2]} /> */}
      {/* <GLTFModel url="/models/aboutPage/monkey.glb" scale={1.0} position={[-2.5, 0, -6]} /> */}

      {/* animated  */}
      {/* <AnimatedGLTF url="/models/aboutPage/buble.glb" scale={1.2} position={[0, 0, 0]} /> */}
      <AnimatedGLTF url="/models/aboutPage/golden-atom.glb" scale={0.8} position={[5, 0, 3]} />
      <AnimatedGLTF url="/models/aboutPage/planet.glb" scale={1.2} position={[10, 0, 8]} />

      {/* default */}
      {/* <AnimatedGLTF url="/models/aboutPage/golden-atom.glb" scale={0.8} position={[3.5, 0, -2]} />
      <AnimatedGLTF url="/models/aboutPage/buble.glb" scale={1.2} position={[0, 0, 0]} /> */}


      {/* Pretty placeholders so it looks good before you add models */}
      {/* <Placeholder color="#7ad0ff" position={[0, 0.8, 0]} />
      <Placeholder color="#f9b4ff" position={[3.6, 0.8, -2]} />
      <Placeholder color="#a0ffcf" position={[-2.8, 0.8, -6]} /> */}
    </>
  );
}

/* ---------------------------- The Page View -------------------------- */
export default function StoryWorld() {
  return (
    <div className="story-container">
      {/* <Canvas
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        camera={{ position: [0, 1.3, 12], fov: 50, near: 0.1, far: 100 }}
      > */}

      {/* <color attach="background" args={["#0d0f13"]} /> */}


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
        camera={{ position: [0, 1.3, 12], fov: 50, near: 0.1, far: 100 }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >



        <Suspense fallback={<Loader />}>
          {/* 4 pages => 4 full-screen scroll sections */}
          <ScrollControls pages={6} damping={0.18}>
            <CameraRig />
            <Scene />
            <Preload all />
            {/* Overlay HTML */}
            <Scroll html>


 


              <div className="story-overlay">
                <section className="story-section">
                  <h1 className="story-title">House of MUSA — Prologue</h1>
                  <p className="story-p">
                    House of MUSA is a visionary technology company focused on building AI-powered websites,
                    software, and ERP systems that empower industries to evolve intelligently.
                    We blend creativity, data, and innovation to design solutions that simplify complexity
                    and redefine digital transformation.
                  </p>
                </section>

                <section className="story-section">
                  <h2 className="story-subtitle">Awakening</h2>
                  <p className="story-p">
                    Born from a passion for innovation, House of MUSA began its journey to harness
                    the power of artificial intelligence for real-world impact. From education to
                    sports, business, and travel — our products bring intelligent automation to every domain.
                  </p>
                </section>

                <section className="story-section">
                  <h2 className="story-subtitle">Passage</h2>
                  <p className="story-p">
                    As we advanced, our vision expanded — creating platforms like
                    <b> Electronic Educare</b>, <b>SportBit</b>, <b>F&B</b>, and <b>Tour Guide</b>.
                    Each product represents a step forward in our mission to connect intelligence
                    with purpose, empowering users and transforming industries through technology.
                  </p>
                </section>

                <section className="story-section">
                  <h2 className="story-subtitle">Convergence</h2>
                  <p className="story-p">
                    Today, House of MUSA stands as a hub of creativity and innovation — where ideas,
                    design, and AI converge to create meaningful digital experiences.
                    Our story continues as we build the future, one intelligent system at a time.
                  </p>
                  <a className="story-cta" href="/">Return Home</a>
                </section>


                <section className="story-section">
                  <h2 className="story-subtitle">Developers</h2>
                  <p className="story-p">
                    Developer 1: <br/>
                    Developer 2:<br/>
                    Developer 3:<br/>
                    Developer 4:<br/>
                    Developer 5:<br/>
                  </p>
                  <a className="story-cta" href="/">Return Home</a>
                </section>

                <section className="story-section">
                  <h2 className="story-subtitle">Address</h2>
                  <p className="story-p">
                    Phone: +880 1711-123456<br/>
                    Email:  sportbit@gmail.com<br/>
                    Address: Lighthouse,Lindsay Street, Esplanade, Kolkata-7000001<br/>
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

// Optional: Preload your models for snappier transitions
useGLTF.preload("/models/aboutPage/planet.glb");
useGLTF.preload("/models/aboutPage/golden-atom.glb");
// useGLTF.preload("/models/aboutPage/monkey.glb");
