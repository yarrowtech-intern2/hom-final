// src/pages/Story3DPage.jsx
// A 3D storytelling page with scroll-driven interactions, Lenis smooth scrolling,
// GSAP transitions, and mobile responsiveness. Drop your .glb/.gltf into /public/models
// and update the MODEL_URL below.

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Environment, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// --- CONFIG ---
const MODEL_URL = "/models/aboutPage/planet.glb"; // ← replace with your filename in /public/models
const BG = "#030712"; // slate-950-ish

// --- Utility: clamp, lerp ---
const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
const damp = THREE.MathUtils.damp;

// --- Smooth Loader for 3D ---
function Loading() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="px-4 py-2 rounded-xl bg-white/90 text-gray-900 text-sm font-medium shadow">
        Loading 3D… {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

// --- Model Wrapper ---
function Model({ progressRef }) {
  const group = useRef();
  const { scene } = useGLTF(MODEL_URL);

  // Optimize: set scene properties (shadows, cast/receive) once
  useMemo(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material.envMapIntensity = 0.9;
          obj.material.roughness = 0.5;
          obj.material.metalness = 0.1;
        }
      }
    });
  }, [scene]);

  // Animation driven by scroll progress (0 → 1)
  useFrame((state, dt) => {
    const p = clamp(progressRef.current ?? 0, 0, 1);

    // Keyframed path (you can tweak these to match your narrative)
    // Camera flies in, circles, then settles
    const cam = state.camera;
    const target = new THREE.Vector3();

    // Camera path
    const radius = THREE.MathUtils.lerp(6, 2.6, p);
    const angle = THREE.MathUtils.lerp(0, Math.PI * 1.75, p);
    const height = THREE.MathUtils.lerp(2.5, 1.4, p);
    const tx = Math.cos(angle) * radius;
    const tz = Math.sin(angle) * radius;

    cam.position.x = damp(cam.position.x, tx, 5, dt);
    cam.position.y = damp(cam.position.y, height, 5, dt);
    cam.position.z = damp(cam.position.z, tz, 5, dt);

    // Look at the model center
    target.set(0, 0.8, 0);
    cam.lookAt(target);

    // Model subtle motion
    if (group.current) {
      group.current.rotation.y = damp(group.current.rotation.y, angle * 0.35, 4, dt);
      group.current.position.y = damp(group.current.position.y, Math.sin(p * Math.PI) * 0.2, 4, dt);
      const scale = THREE.MathUtils.lerp(0.9, 1.15, Math.sin(p * Math.PI));
      group.current.scale.setScalar(damp(group.current.scale.x, scale, 6, dt));
    }
  });

  return <primitive ref={group} object={scene} position={[0, 0, 0]} />;
}

// --- Scene Composition ---
function Scene({ progressRef }) {
  return (
    <>
      {/* Lights */}
      <hemisphereLight intensity={0.7} groundColor={new THREE.Color("#0b1220")} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.2}
        castShadow
        shadow-camera-far={50}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Ground shadow catcher (subtle) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>

      {/* Environment */}
      <Environment preset="city" />

      {/* Your model */}
      <Suspense fallback={<Loading />}>
        <Model progressRef={progressRef} />
      </Suspense>

      {/* Optional: allow orbiting in debug/dev; disable on prod if desired */}
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
    </>
  );
}

// --- Hook: Lenis + GSAP ScrollTrigger sync ---
function useLenisGsap(progressRef) {
  const rootRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Init Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    // Tie Lenis to rAF
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", () => ScrollTrigger.update());

    // Create a master ScrollTrigger driving 3D progress
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // DOM entrance animations
      tl.from(".story-hero h1", { y: 40, autoAlpha: 0, duration: 0.8 })
        .from(".story-hero p", { y: 20, autoAlpha: 0, duration: 0.6 }, "<0.2")
        .from(".story-hero .cta", { y: 20, autoAlpha: 0, duration: 0.6 }, "<0.1");

      // Scroll-driven progress
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress; // 0 → 1
        },
      });

      // Section reveals
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      ScrollTrigger.clearScrollMemory && ScrollTrigger.clearScrollMemory();
    };
  }, [progressRef]);

  return rootRef;
}

// --- Main Page ---
export default function Story3DPage() {
  const progressRef = useRef(0);
  const rootRef = useLenisGsap(progressRef);

 return (
  <div
    ref={rootRef}
    className="min-h-[200vh] text-white relative"
    style={{ backgroundColor: BG }}   // ✅ dynamic bg safely
  >
    {/* Sticky 3D Canvas Layer */}
    <div className="pointer-events-none sticky top-0 h-screen w-full z-10">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [6, 2.5, 6], fov: 50, near: 0.1, far: 100 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(BG);
          scene.fog = new THREE.Fog(BG, 10, 28);
        }}
      >
        <Scene progressRef={progressRef} />
      </Canvas>
    </div>

    {/* Content Layers */}
    <section className="story-hero relative z-20 h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
        Immersive 3D Storytelling
      </h1>
      <p className="mt-4 max-w-xl text-sm sm:text-base md:text-lg text-white/80">
        Scroll to explore. The model responds to your journey—pan, orbit, and transform across chapters.
      </p>
      <div className="cta mt-6 flex gap-3">
        <a
          href="#chapter-1"
          className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition"
        >
          Begin
        </a>
        <a
          href="#about"
          className="px-5 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 transition"
        >
          About
        </a>
      </div>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center text-xs text-white/60">
        <span className="animate-bounce">Swipe / Scroll ↓</span>
      </div>
    </section>

      <section id="chapter-1" className="relative z-20 min-h-[120vh] px-6 py-24 md:py-32 flex items-center">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="reveal">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Chapter 1 — The Arrival</h2>
            <p className="mt-4 text-white/80">
              Introduce your world. While this section is in view, the camera arcs around the model and closes in.
            </p>
            <ul className="mt-6 space-y-2 text-white/70 text-sm md:text-base">
              <li>• Define the protagonist (your 3D model)</li>
              <li>• Set the environment and mood</li>
              <li>• Highlight key features as callouts</li>
            </ul>
          </div>
          <div className="reveal">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="font-semibold mb-2">Tip</h3>
              <p className="text-sm text-white/80">
                Replace <code className="px-1.5 py-0.5 rounded bg-black/40">MODEL_URL</code> with your GLB/GLTF path. You can also
                animate individual parts by finding them with <code>scene.getObjectByName()</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="chapter-2" className="relative z-20 min-h-[120vh] px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto reveal">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Chapter 2 — The Transformation</h2>
          <p className="mt-4 text-white/80 max-w-3xl">
            As users scroll deeper, the model gently scales and breathes. Sync GSAP timelines to toggle UI elements
            and callouts at precise points in the story.
          </p>

          {/* Example callouts row */}
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Reactive Motion", "Cinematic Camera", "Fog & Lights"].map((t) => (
              <div key={t} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h4 className="font-semibold">{t}</h4>
                <p className="text-sm text-white/75 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi mauris.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative z-20 min-h-[100vh] px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto reveal">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">How this works</h2>
          <ol className="mt-4 space-y-3 text-white/80 list-decimal list-inside">
            <li><span className="font-semibold">Lenis</span> adds buttery-smooth scrolling and drives the RAF.</li>
            <li><span className="font-semibold">GSAP + ScrollTrigger</span> orchestrate DOM transitions and set a global progress.</li>
            <li><span className="font-semibold">React Three Fiber</span> reads that progress each frame to move the camera and model.</li>
          </ol>
          <div className="mt-8 text-sm text-white/60">
            Mobile friendly by default — the Canvas is sticky and the content stacks vertically with generous tap targets.
          </div>
        </div>
      </section>

      <footer className="relative z-20 px-6 py-10 border-t border-white/10 text-white/60 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Your Brand</span>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="underline underline-offset-4">
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}

/**
 * QUICK SETUP
 * 1) Install deps:
 *    npm i three @react-three/fiber @react-three/drei gsap @studio-freight/lenis
 * 2) Place your model at public/models/<file>.glb and update MODEL_URL.
 * 3) Add route:
 *    import Story3DPage from "./pages/Story3DPage";
 *    <Route path="/story" element={<Story3DPage />} />
 * 4) Tailwind is assumed to be set up already (as per Vite + Tailwind template).
 *
 * NOTES
 * - For part-level animations, inside Model() use scene.getObjectByName('PartName') and animate in useFrame.
 * - You can pin sections, add progress-sliced keyframes, or swap models by watching progressRef.current.
 * - If you prefer ScrollControls from drei, you can replace Lenis/GSAP with <ScrollControls> and use useScroll().
 */

// Preload model (optional cache warm-up)
useGLTF.preload(MODEL_URL);
