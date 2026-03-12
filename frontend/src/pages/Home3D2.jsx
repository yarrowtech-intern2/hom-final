
// // Home3D2.jsx srijon
// import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
// import * as THREE from "three";
// import { Canvas, useThree, extend } from "@react-three/fiber";
// import {
//   Environment,
//   OrbitControls,
//   Html,
//   ContactShadows,
//   useGLTF,
//   Preload,
//   AdaptiveDpr,
//   AdaptiveEvents,
//   PerformanceMonitor,
// } from "@react-three/drei";
// import { EffectComposer, Bloom, SSAO, Vignette } from "@react-three/postprocessing";
// import { DRACOLoader, MeshoptDecoder, GLTFLoader } from "three-stdlib";
// import { NormalPass } from "postprocessing";
// extend({ NormalPass });

// import DoorPortal from "../components/DoorPortal";
// import TutorialHint from "../components/TutorialHint";
// import { usePageTransition } from "../components/transition";
// // import FloatingAction from "../components/FloatingAction";

// import HomeOverlay from "../components/homeOverlay";
// import DecryptedText from "../components/decryptedText";



// /* ----------------------------- Config toggles ----------------------------- */
// const USE_HDR_BACKGROUND = true;
// const HDR_FILE = "/hdr/alps.hdr";

// /* ----------------------------- Mobile detector ---------------------------- */
// function useIsMobile(breakpoint = 768) {
//   const [isMobile, setIsMobile] = useState(() =>
//     typeof window !== "undefined" ? window.innerWidth < breakpoint : false
//   );
//   useEffect(() => {
//     const mq = window.matchMedia(`(max-width:${breakpoint - 1}px)`);
//     const onChange = () => setIsMobile(mq.matches);
//     onChange();
//     mq.addEventListener?.("change", onChange);
//     return () => mq.removeEventListener?.("change", onChange);
//   }, [breakpoint]);
//   return isMobile;
// }

// /* --------------------------------- Loader -------------------------------- */
// function Loader() {
//   return (
//     <Html center style={{ color: "#aaa", fontFamily: "Manrope, system-ui", fontSize: 18 }}>
//       Loading 3D website,Please wait…
//     </Html>
//   );
// }

// /* --------------------------------- Model --------------------------------- */
// function House({
//   onReady,
//   onPortalEnter,
//   scale = 1,
//   rotation = [0, Math.PI * 0.15, 0],
//   position = [0, -1, 0],
// }) {
//   const gltf = useGLTF(
//     // "/models/house10.glb",
//     // "/models/house-model.glb",
//     "/models/house3.glb",
//     (loader) => {
//       if (loader instanceof GLTFLoader) {
//         const draco = new DRACOLoader();
//         draco.setDecoderPath("/draco/");
//         loader.setDRACOLoader(draco);
//         if (MeshoptDecoder) loader.setMeshoptDecoder(MeshoptDecoder);
//       }
//     }
//   );

//   const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
//   const group = useRef();

//   useEffect(() => {
//     if (!group.current) return;
//     const box = new THREE.Box3().setFromObject(group.current);
//     const center = box.getCenter(new THREE.Vector3());
//     const size = box.getSize(new THREE.Vector3());
//     onReady?.({ center, size });
//   }, [onReady]);

//   const portalAnchors = useMemo(() => {
//     const pts = [];
//     scene.traverse((obj) => {
//       if (/^DoorPortal/i.test(obj.name)) pts.push(obj.position.clone());
//     });
//     return pts;
//   }, [scene]);

//   useEffect(() => {
//     scene.traverse((o) => {
//       if (o.isMesh) {
//         o.frustumCulled = true;
//         o.matrixAutoUpdate = false;
//         o.updateMatrix();
//         o.castShadow = false;
//         o.receiveShadow = false;
//       }
//     });
//   }, [scene]);

//   return (
//     <group ref={group} position={position} rotation={rotation} scale={scale}>
//       <primitive object={scene} />
//       {portalAnchors.length === 0 && <DoorPortal position={[4, 1, 27]} onEnter={onPortalEnter} />}
//       {portalAnchors.map((p, i) => (
//         <DoorPortal key={i} position={[p.x, p.y, p.z]} label="Enter" onEnter={onPortalEnter} />
//       ))}
//     </group>
//   );
// }
// // useGLTF.preload("/models/house10.glb");
// // useGLTF.preload("/models/house-model.glb");
// useGLTF.preload("/models/house3.glb");

// /* ---------------------------- Inner Scene node --------------------------- */
// function Scene({ isMobile }) {
//   const { camera, invalidate } = useThree();
//   const [autoRotate, setAutoRotate] = useState(true);
//   const controls = useRef();
//   const [perf, setPerf] = useState(1);
//   const [envReady, setEnvReady] = useState(false);
//   const { start } = usePageTransition();



//   const handleReady = ({ center, size }) => {
//     if (!controls.current) return;
//     // Fit camera to the model’s bounding box
//     const radius = Math.max(size.x, size.y, size.z) * 0.063;
//     const startDist = Math.max(radius * (isMobile ? 3.0 : 2.2), 6);
//     const dir = new THREE.Vector3(15, 0.3, -56).normalize(); // pleasant 3/4 view

//     const lookAt = center.clone();              // keep real center (don’t zero it)
//     const camPos = center.clone().add(dir.multiplyScalar(startDist));

//     camera.position.copy(camPos);
//     camera.near = Math.max(0.01, startDist / 100);
//     camera.far = startDist * 50;
//     camera.updateProjectionMatrix();

//     controls.current.target.copy(lookAt);
//     controls.current.minDistance = Math.max(radius * 0.9, 2.0);
//     controls.current.maxDistance = Math.max(radius * (isMobile ? 6 : 8), 12);
//     controls.current.update();

//     setEnvReady(true);
//     invalidate();
//   };





//   const effectsOn = perf >= 1;

//   return (
//     <>
//       {USE_HDR_BACKGROUND && <color attach="background" args={["#ffff"]} />}

//       {/* Softer lights on mobile */}
//       <hemisphereLight intensity={isMobile ? 0.015 : 0.02} groundColor="#222" />
//       <directionalLight
//         castShadow={!isMobile}
//         position={[10, 15, 10]}
//         intensity={isMobile ? 0.035 : 0.05}
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//         color="#cbcbcb"
//       />

//       <Suspense fallback={<Loader />}>
//         <House
//           onReady={handleReady}
//           onPortalEnter={(coords) => start("/gallery", coords)}
//           scale={isMobile ? 0.95 : 1}
//           rotation={isMobile ? [0, Math.PI * 0.12, 0] : [0, Math.PI * 0.15, 0]}
//           position={isMobile ? [0, -1.1, 0] : [0, -1, 0]}
//         />

//         {envReady &&
//           (USE_HDR_BACKGROUND ? (
//             <Environment files={HDR_FILE} background={false} />
//           ) : (
//             <Environment preset="city" background={false} />
//           ))}

//         {/* Slightly smaller + blurrier contact shadow on mobile */}
//         <ContactShadows
//           position={[0, -1.01, 0]}
//           opacity={isMobile ? 0.3 : 0.4}
//           scale={isMobile ? 12 : 16}
//           blur={isMobile ? 3.6 : 2.8}
//           far={4}
//         />

//         {/* Post-processing is lighter on mobile */}
//         <EffectComposer multisampling={0}>
//           {!isMobile && <primitive attach="passes" object={new NormalPass()} />}
//           {!isMobile && <SSAO samples={16} radius={0.25} intensity={1.2 * perf} />}
//           <Bloom mipmapBlur intensity={isMobile ? 0.35 : 0.6 * perf} luminanceThreshold={0.85} />
//           <Vignette eskil={false} offset={-0.2} darkness={isMobile ? 0.7 : 0.9} />
//         </EffectComposer>
//       </Suspense>

//       <PerformanceMonitor onDecline={() => setPerf(0.8)} onIncline={() => setPerf(1)} flipflops={2} />
//       <AdaptiveDpr pixelated />
//       <AdaptiveEvents />

//       <OrbitControls
//         ref={controls}
//         enablePan={!isMobile ? false : false}
//         // enableZoom={!isMobile}
//         enableZoom={true}
//         enableRotate
//         autoRotate={autoRotate}
//         autoRotateSpeed={isMobile ? 0.5 : 0.7}
//         zoomSpeed={1.2}
//         rotateSpeed={isMobile ? 0.55 : 0.7}
//         maxPolarAngle={Math.PI * 0.95}
//         minDistance={2}
//         maxDistance={isMobile ? 16 : 32}
//         onChange={invalidate}
//         onStart={() => setAutoRotate(false)}
//         onEnd={invalidate}
//       />
//     </>
//   );
// }









// export default function Home3D() {
//   const isMobile = useIsMobile(768);






//     useEffect(() => {
//     const prevBodyBg = document.body.style.background;
//     const prevBodyOverflow = document.body.style.overflow;

//     document.body.style.background = "#0b0b0c"; // dark background for home

//     // Only lock overflow on non-mobile so mobile can scroll
//     if (!isMobile) {
//       document.body.style.overflow = "auto";
//     } else {
//       // allow normal mobile scroll behavior
//       document.body.style.overflow = prevBodyOverflow || "auto";
//     }

//     return () => {
//       document.body.style.background = prevBodyBg;
//       document.body.style.overflow = prevBodyOverflow;
//     };
//   }, [isMobile]);






//   const baseOverlayStyle = {
//     position: "fixed",
//     color: "#ffffff",
//     zIndex: 20,
//     pointerEvents: "none",
//     fontFamily:
//       "Manrope, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
//   };

//   const leftOverlayStyle = {
//     ...baseOverlayStyle,
//     left: isMobile ? "1.25rem" : "3rem",
//     right: isMobile ? "1.25rem" : "auto",
//     bottom: isMobile ? "5.5rem" : "3rem",
//     maxWidth: isMobile ? "calc(100vw - 2.5rem)" : "260px",
//     lineHeight: 1.3,
//     textAlign: "left",
//   };

//   const rightOverlayStyle = {
//     ...baseOverlayStyle,
//     right: isMobile ? "1.25rem" : "3rem",
//     left: isMobile ? "1.25rem" : "auto",
//     bottom: isMobile ? "1.5rem" : "3rem",
//     maxWidth: isMobile ? "calc(100vw - 2.5rem)" : "360px",
//     lineHeight: 1.35,
//     textAlign: isMobile ? "left" : "right",
//   };

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
//           // touchAction: "none",
//           touchAction: isMobile ? "pan-y" : "none",
//         }}
//         onCreated={({ gl }) => {
//           THREE.Cache.enabled = true;
//           gl.setPixelRatio(
//             Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5)
//           );
//           gl.physicallyCorrectLights = true;
//         }}
//       >
//         <Scene isMobile={isMobile} />
//         <Preload all />
//       </Canvas>





//       {/* ------------------- LEFT OVERLAY ------------------- */}
// <div style={leftOverlayStyle}>
//   <div style={{ fontSize: isMobile ? "16px" : "22px", fontWeight: 600 }}>
//     <DecryptedText
//       text="Home of Ideas"
//       speed={45}
//       maxIterations={80}
//       sequential
//       revealDirection="start"
//       animateOn="view"
//     />
//   </div>

//   <div style={{ fontSize: isMobile ? "9px" : "10px", opacity: 0.85 }}>
//     <DecryptedText
//       text="generation and visualization fused into a unified digital architecture..."
//       speed={45}
//       maxIterations={120}
//       sequential
//       revealDirection="start"
//       animateOn="view"
//     />
//   </div>
// </div>







//       {/* ------------------- RIGHT OVERLAY -------------------  */}
// <div style={rightOverlayStyle}>
//   <div style={{ fontSize: isMobile ? "22px" : "30px", fontWeight: 600 }}>
//     <DecryptedText
//       text="House of musa"
//       speed={45}
//       maxIterations={80}
//       sequential
//       revealDirection="center"
//       animateOn="view"
//     />
//   </div>

//   <div style={{ fontSize: isMobile ? "10px" : "12px", opacity: 0.9 }}>
//     <DecryptedText
//       text="as a modular real-time rendering pipeline..."
//       speed={45}
//       maxIterations={140}
//       sequential
//       revealDirection="start"
//       animateOn="view"
//     />
//   </div>

//   <div style={{ fontSize: isMobile ? "9px" : "10px", opacity: 0.7, marginTop: 8 }}>
//     <DecryptedText
//       text="Generation and editing into a unified architecture..."
//       speed={45}
//       maxIterations={120}
//       sequential
//       revealDirection="start"
//       animateOn="view"
//     />
//   </div>
// </div>

//       <TutorialHint />
//     </>
//   );
// }


























































// Home3D2.jsx srijon
import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree, extend } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
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
const HDR_FILE = "/hdr/alps.hdr";
const HOME_DAWN_GRADIENT =
  "radial-gradient(120% 78% at 50% 76%, rgba(255, 174, 74, 0.42) 0%, rgba(255, 174, 74, 0) 58%), linear-gradient(180deg, #fff3df 0%, #ffd69a 34%, #f0a041 66%, #b56708 100%)";

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

function detectLowSpecDevice() {
  if (typeof window === "undefined") return false;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  return Boolean(reducedMotion || cores <= 4 || memory <= 4);
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
    // "/models/house10.glb",
    // "/models/house-model.glb",
    "/models/house3.glb",
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
      {portalAnchors.length === 0 && <DoorPortal position={[4, 1, 27]} onEnter={onPortalEnter} />}
      {portalAnchors.map((p, i) => (
        <DoorPortal key={i} position={[p.x, p.y, p.z]} label="Enter" onEnter={onPortalEnter} />
      ))}
    </group>
  );
}
// useGLTF.preload("/models/house10.glb");
// useGLTF.preload("/models/house-model.glb");
useGLTF.preload("/models/house3.glb");

/* ---------------------------- Inner Scene node --------------------------- */
function Scene({ isMobile, lowSpec }) {
  const { camera, invalidate } = useThree();
  const [autoRotate, setAutoRotate] = useState(true);
  const controls = useRef();
  const [perf, setPerf] = useState(1);
  const [envReady, setEnvReady] = useState(false);
  const { start } = usePageTransition();
  const normalPass = useMemo(() => new NormalPass(), []);

  const boundsRef = useRef({ minY: -1 });

  const clampToGround = () => {
    const c = controls.current;
    if (!c) return;

    const GROUND_Y = boundsRef.current.minY + 0.05; // small margin above ground

    // 1) Prevent target from going below ground
    if (c.target.y < GROUND_Y) {
      const dy = GROUND_Y - c.target.y;

      // Move target up AND move camera up by same amount
      // so the view doesn't "snap" weirdly
      c.target.y += dy;
      c.object.position.y += dy;
      c.update();
    }

    // 2) Extra safety: if camera is still under ground, lift it
    if (c.object.position.y < GROUND_Y) {
      c.object.position.y = GROUND_Y;
      c.update();
    }
  };



  const handleReady = ({ center, size }) => {
    if (!controls.current) return;

    // Compute model "ground" (bottom of bounding box)
    const bottomY = center.y - size.y / 2;
    boundsRef.current.minY = bottomY;

    const radius = Math.max(size.x, size.y, size.z) * 0.063;
    const startDist = Math.max(radius * (isMobile ? 3.0 : 2.2), 6);
    const dir = new THREE.Vector3(15, 0.3, -56).normalize();

    const lookAt = center.clone();
    const camPos = center.clone().add(dir.multiplyScalar(startDist));

    camera.position.copy(camPos);
    camera.near = Math.max(0.01, startDist / 100);
    camera.far = startDist * 50;
    camera.updateProjectionMatrix();

    controls.current.target.copy(lookAt);

    // ✅ IMPORTANT: stop orbit from going under the model
    controls.current.minPolarAngle = 0.05;
    controls.current.maxPolarAngle = Math.PI / 2 - 0.05; // <= 90° (no underside)

    controls.current.minDistance = Math.max(radius * 0.9, 2.0);
    controls.current.maxDistance = Math.max(radius * (isMobile ? 6 : 8), 12);

    controls.current.update();

    // Ensure we start above ground too
    clampToGround();
    setEnvReady(true);

    invalidate();
  };





  const lowQuality = lowSpec || perf < 0.9;
  const enablePostFx = !lowQuality;

  return (
    <>
      {/* Keep environment lighting from HDR, but let the DOM dawn gradient be visible */}

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

      <Suspense fallback={null}>
        <House
          onReady={handleReady}
          onPortalEnter={(coords) => start("/gallery", coords)}
          scale={isMobile ? 0.95 : 1}
          rotation={isMobile ? [0, Math.PI * 0.12, 0] : [0, Math.PI * 0.15, 0]}
          position={isMobile ? [0, -1.1, 0] : [0, -1, 0]}
        />

        {envReady &&
          (lowSpec ? (
            <Environment preset="city" background={false} />
          ) : USE_HDR_BACKGROUND ? (
            <Environment files={HDR_FILE} background={false} />
          ) : (
            <Environment preset="city" background={false} />
          ))}

        {/* Slightly smaller + blurrier contact shadow on mobile */}
        <ContactShadows
          position={[0, -1.01, 0]}
          opacity={lowQuality ? 0.22 : isMobile ? 0.3 : 0.4}
          scale={lowQuality ? 10 : isMobile ? 12 : 16}
          blur={lowQuality ? 3.9 : isMobile ? 3.6 : 2.8}
          resolution={lowQuality ? 256 : 512}
          far={4}
        />

        {/* Post-processing is lighter on mobile */}
        {enablePostFx && (
          <EffectComposer multisampling={0}>
            {!isMobile && <primitive attach="passes" object={normalPass} />}
            {!isMobile && <SSAO samples={12} radius={0.22} intensity={1.05 * perf} />}
            <Bloom mipmapBlur intensity={isMobile ? 0.28 : 0.52 * perf} luminanceThreshold={0.88} />
            <Vignette eskil={false} offset={-0.18} darkness={isMobile ? 0.64 : 0.82} />
          </EffectComposer>
        )}
      </Suspense>

      <PerformanceMonitor
        onDecline={() => setPerf((p) => Math.max(0.78, p - 0.08))}
        onIncline={() => setPerf((p) => Math.min(1, p + 0.06))}
        flipflops={2}
      />
      <AdaptiveDpr pixelated={lowQuality} />
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
        onChange={() => {
          clampToGround();
          invalidate();
        }}
        onStart={() => setAutoRotate(false)}
        onEnd={invalidate}
      />
    </>
  );
}









export default function Home3D() {
  const isMobile = useIsMobile(768);
  const lowSpec = useMemo(() => detectLowSpecDevice(), []);
  const maxDpr = lowSpec ? 1 : isMobile ? 1.25 : 1.5;
  const dpr = lowSpec ? [1, 1] : isMobile ? [1, 1.25] : [1, 1.5];






  useEffect(() => {
    const prevBodyBg = document.body.style.background;
    const prevHtmlBg = document.documentElement.style.background;
    const prevBodyOverflow = document.body.style.overflow;

    document.body.style.background = HOME_DAWN_GRADIENT;
    document.documentElement.style.background = HOME_DAWN_GRADIENT;

    // Only lock overflow on non-mobile so mobile can scroll
    if (!isMobile) {
      document.body.style.overflow = "auto";
    } else {
      // allow normal mobile scroll behavior
      document.body.style.overflow = prevBodyOverflow || "auto";
    }

    return () => {
      document.body.style.background = prevBodyBg;
      document.documentElement.style.background = prevHtmlBg;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isMobile]);






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
        dpr={dpr}
        camera={{
          position: isMobile ? [7.5, 3, 9] : [28, 4, -40],
          fov: isMobile ? 55 : 45,
          near: 0.01,
          far: 1700,
        }}
        gl={{
          antialias: !isMobile && !lowSpec,
          alpha: true,
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
          // touchAction: "none",
          touchAction: isMobile ? "pan-y" : "none",
        }}
        onCreated={({ gl }) => {
          THREE.Cache.enabled = true;
          gl.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
          gl.physicallyCorrectLights = true;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Scene isMobile={isMobile} lowSpec={lowSpec} />
        <Preload all />
      </Canvas>





      {/* ------------------- LEFT OVERLAY ------------------- */}
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







      {/* ------------------- RIGHT OVERLAY -------------------  */}
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
