
// Home3D2.jsx srijon
import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree, extend } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Html,
  ContactShadows,
  useGLTF,
  Preload,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";
import { EffectComposer, Bloom, SSAO, Vignette } from "@react-three/postprocessing";
import { DRACOLoader, MeshoptDecoder, GLTFLoader } from "three-stdlib";
import { NormalPass } from "postprocessing";
extend({ NormalPass });

import DoorPortal from "../components/DoorPortal";
import TutorialHint from "../components/TutorialHint";
import { usePageTransition } from "../components/transition";
// import FloatingAction from "../components/FloatingAction";

import HomeOverlay from "../components/homeOverlay";
import DecryptedText from "../components/decryptedText";



/* ----------------------------- Config toggles ----------------------------- */
const USE_HDR_BACKGROUND = true;
const HDR_FILE = "/hdr/studio.hdr";

/* ----------------------------- Mobile detector ---------------------------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

/* --------------------------------- Loader -------------------------------- */
function Loader() {
  return (
    <Html center style={{ color: "#aaa", fontFamily: "Manrope, system-ui", fontSize: 18 }}>
      Loading 3D website,Please wait…
    </Html>
  );
}

/* --------------------------------- Model --------------------------------- */
function House({
  onReady,
  onPortalEnter,
  scale = 1,
  rotation = [0, Math.PI * 0.15, 0],
  position = [0, -1, 0],
}) {
  const gltf = useGLTF(
    "/models/house8.glb",
    (loader) => {
      if (loader instanceof GLTFLoader) {
        const draco = new DRACOLoader();
        draco.setDecoderPath("/draco/");
        loader.setDRACOLoader(draco);
        if (MeshoptDecoder) loader.setMeshoptDecoder(MeshoptDecoder);
      }
    }
  );

  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef();

  useEffect(() => {
    if (!group.current) return;
    const box = new THREE.Box3().setFromObject(group.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    onReady?.({ center, size });
  }, [onReady]);

  const portalAnchors = useMemo(() => {
    const pts = [];
    scene.traverse((obj) => {
      if (/^DoorPortal/i.test(obj.name)) pts.push(obj.position.clone());
    });
    return pts;
  }, [scene]);

  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.frustumCulled = true;
        o.matrixAutoUpdate = false;
        o.updateMatrix();
        o.castShadow = false;
        o.receiveShadow = false;
      }
    });
  }, [scene]);

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
      {portalAnchors.length === 0 && <DoorPortal position={[4, 1, 0.2]} onEnter={onPortalEnter} />}
      {portalAnchors.map((p, i) => (
        <DoorPortal key={i} position={[p.x, p.y, p.z]} label="Enter" onEnter={onPortalEnter} />
      ))}
    </group>
  );
}
useGLTF.preload("/models/house8.glb");

/* ---------------------------- Inner Scene node --------------------------- */
function Scene({ isMobile }) {
  const { camera, invalidate } = useThree();
  const [autoRotate, setAutoRotate] = useState(true);
  const controls = useRef();
  const [perf, setPerf] = useState(1);
  const [envReady, setEnvReady] = useState(false);
  const { start } = usePageTransition();

  // const handleReady = ({ center }) => {
  //   if (controls.current) {
  //     controls.current.target.copy(center.set(0, 0, 0));
  //     controls.current.minDistance = isMobile ? 2 : 2;
  //     controls.current.maxDistance = isMobile ? 16 : 32;
  //     controls.current.update();
  //   }
  //   setEnvReady(true);
  //   invalidate();
  // };

  const handleReady = ({ center, size }) => {
    if (!controls.current) return;
    // Fit camera to the model’s bounding box
    const radius = Math.max(size.x, size.y, size.z) * 0.063;
    const startDist = Math.max(radius * (isMobile ? 3.0 : 2.2), 6);
    const dir = new THREE.Vector3(15, 0.3, -56).normalize(); // pleasant 3/4 view

    const lookAt = center.clone();              // keep real center (don’t zero it)
    const camPos = center.clone().add(dir.multiplyScalar(startDist));

    camera.position.copy(camPos);
    camera.near = Math.max(0.01, startDist / 100);
    camera.far = startDist * 50;
    camera.updateProjectionMatrix();

    controls.current.target.copy(lookAt);
    controls.current.minDistance = Math.max(radius * 0.9, 2.0);
    controls.current.maxDistance = Math.max(radius * (isMobile ? 6 : 8), 12);
    controls.current.update();

    setEnvReady(true);
    invalidate();
  };





  const effectsOn = perf >= 1;

  return (
    <>
      {USE_HDR_BACKGROUND && <color attach="background" args={["#fff"]} />}

      {/* Softer lights on mobile */}
      <hemisphereLight intensity={isMobile ? 0.015 : 0.02} groundColor="#222" />
      <directionalLight
        castShadow={!isMobile}
        position={[10, 15, 10]}
        intensity={isMobile ? 0.035 : 0.05}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#cbcbcb"
      />

      <Suspense fallback={<Loader />}>
        <House
          onReady={handleReady}
          onPortalEnter={(coords) => start("/gallery", coords)}
          scale={isMobile ? 0.95 : 1}
          rotation={isMobile ? [0, Math.PI * 0.12, 0] : [0, Math.PI * 0.15, 0]}
          position={isMobile ? [0, -1.1, 0] : [0, -1, 0]}
        />

        {envReady &&
          (USE_HDR_BACKGROUND ? (
            <Environment files={HDR_FILE} background={false} />
          ) : (
            <Environment preset="city" background={false} />
          ))}

        {/* Slightly smaller + blurrier contact shadow on mobile */}
        <ContactShadows
          position={[0, -1.01, 0]}
          opacity={isMobile ? 0.3 : 0.4}
          scale={isMobile ? 12 : 16}
          blur={isMobile ? 3.6 : 2.8}
          far={4}
        />

        {/* Post-processing is lighter on mobile */}
        <EffectComposer multisampling={0}>
          {!isMobile && <primitive attach="passes" object={new NormalPass()} />}
          {!isMobile && <SSAO samples={16} radius={0.25} intensity={1.2 * perf} />}
          <Bloom mipmapBlur intensity={isMobile ? 0.35 : 0.6 * perf} luminanceThreshold={0.85} />
          <Vignette eskil={false} offset={-0.2} darkness={isMobile ? 0.7 : 0.9} />
        </EffectComposer>
      </Suspense>

      <PerformanceMonitor onDecline={() => setPerf(0.8)} onIncline={() => setPerf(1)} flipflops={2} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <OrbitControls
        ref={controls}
        enablePan={!isMobile ? false : false}
        // enableZoom={!isMobile}
        enableZoom={true}
        enableRotate
        autoRotate={autoRotate}
        autoRotateSpeed={isMobile ? 0.5 : 0.7}
        zoomSpeed={1.2}
        rotateSpeed={isMobile ? 0.55 : 0.7}
        maxPolarAngle={Math.PI * 0.95}
        minDistance={2}
        maxDistance={isMobile ? 16 : 32}
        onChange={invalidate}
        onStart={() => setAutoRotate(false)}
        onEnd={invalidate}
      />
    </>
  );
}

/* ---------------------------------- Page --------------------------------- */
// export default function Home3D() {
//   const isMobile = useIsMobile(768);

//   return (
//     <>
//       <Canvas
//         frameloop="demand"
//         // Lower DPR & wider FOV on mobile for performance and framing
//         dpr={isMobile ? [1, 1.25] : [1, 1.5]}
//         camera={{
//           position: isMobile ? [7.5, 3, 9] : [28, 4, -40],
//           fov: isMobile ? 55 : 45,
//           near: 0.01,
//           far: 1700,
//         }}
//         gl={{
//           antialias: !isMobile, // disable AA on mobile for perf
//           powerPreference: "high-performance",
//           toneMapping: THREE.ACESFilmicToneMapping,
//           outputColorSpace: THREE.SRGBColorSpace,
//           physicallyCorrectLights: true,
//         }}
//         style={{
//           position: "fixed",
//           inset: 0,
//           width: "100vw",
//           height: "100vh",
//           touchAction: "none", // improves scroll/gesture behavior on mobile canvas
//         }}
//         onCreated={({ gl }) => {
//           THREE.Cache.enabled = true;
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
//           gl.physicallyCorrectLights = true;
//         }}
//       >
//         <Scene isMobile={isMobile} />
//         <Preload all />
//       </Canvas>

//       {/* Keep your floating UI; it will naturally stack over the canvas */}
//       {/* <FloatingAction to="/baymax" ariaLabel="Open contact" /> */}
//       <HomeOverlay />
//       <TutorialHint />
//     </>
//   );
// }















// export default function Home3D() {
//   const isMobile = useIsMobile(768);

//   return (
//     <>
//       <Canvas
//         frameloop="demand"
//         dpr={isMobile ? [1, 1.25] : [1, 1.5]}
//         camera={{
//           position: isMobile ? [7.5, 3, 9] : [28, 4, -40],
//           fov: isMobile ? 55 : 45,
//           near: 0.01,
//           far: 1700,
//         }}
//         gl={{
//           antialias: !isMobile,
//           powerPreference: "high-performance",
//           toneMapping: THREE.ACESFilmicToneMapping,
//           outputColorSpace: THREE.SRGBColorSpace,
//           physicallyCorrectLights: true,
//         }}
//         style={{
//           position: "fixed",
//           inset: 0,
//           width: "100vw",
//           height: "100vh",
//           touchAction: "none",
//         }}
//         onCreated={({ gl }) => {
//           THREE.Cache.enabled = true;
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
//           gl.physicallyCorrectLights = true;
//         }}
//       >
//         <Scene isMobile={isMobile} />
//         <Preload all />
//       </Canvas>

//       {/* ✅ BOTTOM-LEFT OVERLAY */}
//       <div
//         style={{
//           position: "fixed",
//           left: "3rem",
//           bottom: "3rem",
//           color: "#ffffff",
//           zIndex: 20,
//           pointerEvents: "none",
//           maxWidth: "260px",
//           fontFamily: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
//           lineHeight: 1.3,
//         }}
//       >
//         {/* Label */}
//         <div style={{ fontSize: "22px", fontWeight: 600, marginBottom: 4 }}>
//           <DecryptedText
//             text="Home of Ideas"
//             speed={45}
//             maxIterations={80}
//             sequential
//             revealDirection="start"
//             animateOn="view"
//           />
//         </div>

//         {/* Description */}
//         <div style={{ fontSize: "10px", opacity: 0.85 }}>
//           <DecryptedText
//             text="generation and visualization fused into a unified digital architecture, blending creative design with immersive 3D environments that adapt to every experience."
//             speed={45}
//             maxIterations={120}
//             sequential
//             revealDirection="start"
//             animateOn="view"
//           />
//         </div>
//       </div>

//       {/* ✅ BOTTOM-RIGHT OVERLAY */}
//       <div
//         style={{
//           position: "fixed",
//           right: "3rem",
//           bottom: "3rem",
//           color: "#ffffff",
//           zIndex: 20,
//           pointerEvents: "none",
//           maxWidth: "360px",
//           fontFamily: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
//           lineHeight: 1.35,
//           textAlign: "right",
//         }}
//       >
//         {/* Title */}
//         <div style={{ fontSize: "30px", fontWeight: 600, marginBottom: 6 }}>
//           <DecryptedText
//             text="House of musa"
//             speed={45}
//             maxIterations={80}
//             sequential
//             revealDirection="center"
//             animateOn="view"
//           />
//         </div>

//         {/* Main paragraph */}
//         <div style={{ fontSize: "12px", opacity: 0.9, marginLeft: "auto" }}>
//           <DecryptedText
//             // text="As a new generation image creation model, seedream 4.0 integrattes image generation and editing into a unified architecture with multimodel reasoning."
//             text="as a modular real-time rendering pipeline, the engine handles scene optimization, mesh decimation, "
//             speed={45}
//             maxIterations={140}
//             sequential
//             revealDirection="start"
//             animateOn="view"
//           />
//         </div>

//         {/* Tiny line below */}
//         <div style={{ fontSize: "10px", opacity: 0.7, marginLeft: "auto", marginTop: 8 }}>
//           <DecryptedText
//             text="Generation and editing into a unified architecture with flexible multimodel reasoning and up to 4K output."
//             speed={45}
//             maxIterations={120}
//             sequential
//             revealDirection="start"
//             animateOn="view"
//           />
//         </div>
//       </div>

//       {/* existing hint */}
//       <TutorialHint />
//     </>
//   );
// }












export default function Home3D() {
  const isMobile = useIsMobile(768);

  const baseOverlayStyle = {
    position: "fixed",
    color: "#ffffff",
    zIndex: 20,
    pointerEvents: "none",
    fontFamily:
      "Manrope, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const leftOverlayStyle = {
    ...baseOverlayStyle,
    left: isMobile ? "1.25rem" : "3rem",
    right: isMobile ? "1.25rem" : "auto",
    bottom: isMobile ? "5.5rem" : "3rem",
    maxWidth: isMobile ? "calc(100vw - 2.5rem)" : "260px",
    lineHeight: 1.3,
    textAlign: "left",
  };

  const rightOverlayStyle = {
    ...baseOverlayStyle,
    right: isMobile ? "1.25rem" : "3rem",
    left: isMobile ? "1.25rem" : "auto",
    bottom: isMobile ? "1.5rem" : "3rem",
    maxWidth: isMobile ? "calc(100vw - 2.5rem)" : "360px",
    lineHeight: 1.35,
    textAlign: isMobile ? "left" : "right",
  };

  return (
    <>
      <Canvas
        frameloop="demand"
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        camera={{
          position: isMobile ? [7.5, 3, 9] : [28, 4, -40],
          fov: isMobile ? 55 : 45,
          near: 0.01,
          far: 1700,
        }}
        gl={{
          antialias: !isMobile,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          physicallyCorrectLights: true,
        }}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          touchAction: "none",
        }}
        onCreated={({ gl }) => {
          THREE.Cache.enabled = true;
          gl.setPixelRatio(
            Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5)
          );
          gl.physicallyCorrectLights = true;
        }}
      >
        <Scene isMobile={isMobile} />
        <Preload all />
      </Canvas>

  



      /* ------------------- LEFT OVERLAY ------------------- */
<div style={leftOverlayStyle}>
  <div style={{ fontSize: isMobile ? "16px" : "22px", fontWeight: 600 }}>
    <DecryptedText
      text="Home of Ideas"
      speed={45}
      maxIterations={80}
      sequential
      revealDirection="start"
      animateOn="view"
    />
  </div>

  <div style={{ fontSize: isMobile ? "9px" : "10px", opacity: 0.85 }}>
    <DecryptedText
      text="generation and visualization fused into a unified digital architecture..."
      speed={45}
      maxIterations={120}
      sequential
      revealDirection="start"
      animateOn="view"
    />
  </div>
</div>







      /* ------------------- RIGHT OVERLAY ------------------- */
<div style={rightOverlayStyle}>
  <div style={{ fontSize: isMobile ? "22px" : "30px", fontWeight: 600 }}>
    <DecryptedText
      text="House of musa"
      speed={45}
      maxIterations={80}
      sequential
      revealDirection="center"
      animateOn="view"
    />
  </div>

  <div style={{ fontSize: isMobile ? "10px" : "12px", opacity: 0.9 }}>
    <DecryptedText
      text="as a modular real-time rendering pipeline..."
      speed={45}
      maxIterations={140}
      sequential
      revealDirection="start"
      animateOn="view"
    />
  </div>

  <div style={{ fontSize: isMobile ? "9px" : "10px", opacity: 0.7, marginTop: 8 }}>
    <DecryptedText
      text="Generation and editing into a unified architecture..."
      speed={45}
      maxIterations={120}
      sequential
      revealDirection="start"
      animateOn="view"
    />
  </div>
</div>

      <TutorialHint />
    </>
  );
}
