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
// import FloatingAction from "../components/FloatingAction"; 

// /* ----------------------------- Config toggles ----------------------------- */
// const USE_HDR_BACKGROUND = true;
// const HDR_FILE = "/hdr/studio.hdr";

// // Initial hero angle (direction camera looks at model center)
// const HERO_DIR = new THREE.Vector3(46, -10, -94).normalize();
// const HERO_DISTANCE_MULT = 2.0;
// const MIN_DISTANCE_MULT = 0.9;
// const MAX_DISTANCE_MULT = 8.0;


// /* --------------------------------- Loader -------------------------------- */
// function Loader() {
//   return (
//     <Html center style={{ color: "#aaa", fontFamily: "Manrope, system-ui", fontSize: 18 }}>
//       HOUSE OF MUSA Loading…
//     </Html>
//   );
// }

// /* --------------------------------- Model --------------------------------- */
// function House({ onReady, onPortalEnter, scale = 1, rotation = [0, Math.PI * 0.15, 0], position = [0, -1, 0] }) {
//   const gltf = useGLTF(
//     "/models/house5.glb",
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

//   // Optimize static meshes
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
//       {portalAnchors.length === 0 && 
//           <DoorPortal position={[4, 1, 0.2]} onEnter={onPortalEnter} />}
//       {portalAnchors.map((p, i) => (
//         <DoorPortal key={i} position={[p.x, p.y, p.z]} label="Enter" onEnter={onPortalEnter} />
//       ))}
//     </group>
//   );
// }
// useGLTF.preload("/models/house5.glb");

// /* ---------------------------- Inner Scene node --------------------------- */
// function Scene() {
//   const { camera, invalidate } = useThree();
//   const [autoRotate, setAutoRotate] = useState(true);
//   const controls = useRef();
//   const [perf, setPerf] = useState(1);
//   const [envReady, setEnvReady] = useState(false);
//   const { start } = usePageTransition();

//   const handleReady = ({ center, size }) => {
//     // const maxDim = Math.max(size.x, size.y, size.z);
//     // const heroDist = maxDim * HERO_DISTANCE_MULT;
//     // const heroPos = center.clone().add(HERO_DIR.clone().multiplyScalar(heroDist));

//     // camera.position.copy(heroPos);
//     // camera.near = Math.max(0.01, heroDist / 200);
//     // camera.far = heroDist * 50;
//     // camera.updateProjectionMatrix();

//     if (controls.current) {
//       // controls.current.target.copy(center);
//       controls.current.target.set(0, 0, 0);
//       controls.current.minDistance = 2;   
//       controls.current.maxDistance = 50;  
//       controls.current.update();
//     }

//     setEnvReady(true);
//     invalidate();
//   };

//   const effectsOn = perf >= 1;

//   return (
//     <>

//       {USE_HDR_BACKGROUND && <color attach="background" args={["#fff"]} />}
//       <hemisphereLight intensity={0.02} groundColor="#222" />
//       <directionalLight
//         castShadow
//         position={[10, 15, 10]}
//         intensity={0.05}
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//         color="#cbcbcb"
//       />

//       <Suspense fallback={<Loader />}>
//         <House
//           onReady={handleReady} 
//           // onPortalEnter={() => start("/gallery")}
//           onPortalEnter={(coords) => start("/gallery", coords)}
//            />

//         {envReady &&
//           (USE_HDR_BACKGROUND ? (
//             <Environment files={HDR_FILE} background={false} />
//           ) : (
//             <Environment preset="city" background={false} />
//           ))}

//         <ContactShadows position={[0, -1.01, 0]} opacity={0.4} scale={16} blur={2.8} far={4} />

//         <EffectComposer multisampling={0}>
//           <primitive attach="passes" object={new NormalPass()} />
//           <SSAO normalPass samples={16} radius={0.25} intensity={1.2 * perf} />
//           <Bloom mipmapBlur intensity={0.6 * perf} luminanceThreshold={0.85} />
//           <Vignette eskil={false} offset={-0.2} darkness={0.9} />
//         </EffectComposer>
//       </Suspense>

//       <PerformanceMonitor onDecline={() => setPerf(0.8)} onIncline={() => setPerf(1)} flipflops={2} />
//       <AdaptiveDpr pixelated />
//       <AdaptiveEvents />

//       <OrbitControls
//         ref={controls}
//         enablePan={false}
//         enableZoom
//         enableRotate
//         autoRotate={autoRotate}
//         autoRotateSpeed={0.7}   // keep your value
//         zoomSpeed={1.2}
//         rotateSpeed={0.7}
//         maxPolarAngle={Math.PI * 0.95}
//         minDistance={2}         // keep your values
//         maxDistance={32}
//         onChange={invalidate}
//         onStart={() => setAutoRotate(false)}
//         onEnd={invalidate}
//       />


      
//     </>
//   );
// }

// /* ---------------------------------- Page --------------------------------- */
// export default function Home3D() {
//   return (
//     <>
//       <Canvas
//         frameloop="demand"
//         dpr={[1, 1.5]}  // same as your previous
//         camera={{ position: [28, 4, -40], fov: 45, near: 0.01, far: 1700 }}  //default{8,5,14}
//         gl={{
//           antialias: true,
//           powerPreference: "high-performance",
//           toneMapping: THREE.ACESFilmicToneMapping,
//           outputColorSpace: THREE.SRGBColorSpace,
//           physicallyCorrectLights: true,
//         }}
//         style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
//         onCreated={({ gl }) => {
//           THREE.Cache.enabled = true;
//           gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//           gl.physicallyCorrectLights = true;
//         }}
//       >
//         <Scene />
//         <Preload all />

        
//       </Canvas>
//       <FloatingAction to="/baymax" ariaLabel="Open contact" />

//       <TutorialHint />
//     </>
//   );
// }
























// Home3D2.jsx
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
      HOUSE OF MUSA Loading…
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
  const { invalidate } = useThree();
  const [autoRotate, setAutoRotate] = useState(true);
  const controls = useRef();
  const [perf, setPerf] = useState(1);
  const [envReady, setEnvReady] = useState(false);
  const { start } = usePageTransition();

  const handleReady = ({ center }) => {
    if (controls.current) {
      controls.current.target.copy(center.set(0, 0, 0));
      controls.current.minDistance = isMobile ? 2 : 2;
      controls.current.maxDistance = isMobile ? 16 : 32;
      controls.current.update();
    }
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
        enableZoom={!isMobile}           // lock zoom on mobile to keep UX clean
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
export default function Home3D() {
  const isMobile = useIsMobile(768);

  return (
    <>
      <Canvas
        frameloop="demand"
        // Lower DPR & wider FOV on mobile for performance and framing
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        camera={{
          position: isMobile ? [7.5, 3, 9] : [28, 4, -40],
          fov: isMobile ? 55 : 45,
          near: 0.01,
          far: 1700,
        }}
        gl={{
          antialias: !isMobile, // disable AA on mobile for perf
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
          touchAction: "none", // improves scroll/gesture behavior on mobile canvas
        }}
        onCreated={({ gl }) => {
          THREE.Cache.enabled = true;
          gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
          gl.physicallyCorrectLights = true;
        }}
      >
        <Scene isMobile={isMobile} />
        <Preload all />
      </Canvas>

      {/* Keep your floating UI; it will naturally stack over the canvas */}
      {/* <FloatingAction to="/baymax" ariaLabel="Open contact" /> */}
      <TutorialHint />
    </>
  );
}














