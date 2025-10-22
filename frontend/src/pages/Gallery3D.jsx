// // pages/Gallery3D.jsx
// import React, { Suspense, useMemo, useRef, useState, useEffect, useCallback } from "react";
// import * as THREE from "three";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   PointerLockControls,
//   Html,
//   Environment,
//   ContactShadows,
//   Text,
//   Preload,
//   AdaptiveDpr,
//   PerformanceMonitor,
// } from "@react-three/drei";
// import { EffectComposer, Vignette } from "@react-three/postprocessing";

// /* ---------- BASE-URL safe asset helper ---------- */
// function assetUrl(path) {
//   const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || "/";
//   return base + path.replace(/^\//, "");
// }

// /* -------------------- Corridor config -------------------- */
// const HALL_LEN = 40;
// const HALL_W = 6;
// const HALL_H = 3.2;
// const START_Z = -4;
// const END_Z = HALL_LEN - 2;

// /* ---------- Frames (edit freely) ---------- */
// const FRAMES = [
//   { side: "L", z: 4,  img: assetUrl("gallery/art.jpg"), title: "Morning Light" },
//   { side: "R", z: 8,  img: assetUrl("gallery/mgmt.jpg"), title: "A Quiet Street" },
//   { side: "L", z: 12, img: assetUrl("gallery/tour.jpg"), title: "Seaside" },
//   { side: "R", z: 16, img: assetUrl("gallery/restora.jpg"), title: "Forest Edge" },
//   { side: "L", z: 22, img: assetUrl("gallery/shop.jpg"), title: "Pink Sunset" },
//   { side: "R", z: 28, img: assetUrl("gallery/sport.jpg"), title: "City Night" },
// ];

// /* ---------- Safe texture loader (never crashes on 404) ---------- */
// function useSafeTexture(url) {
//   const [tex, setTex] = useState(null);
//   const [failed, setFailed] = useState(false);

//   useEffect(() => {
//     let alive = true;
//     if (!url) { setFailed(true); return; }
//     const loader = new THREE.TextureLoader();
//     loader.load(
//       url,
//       (t) => {
//         if (!alive) return;
//         t.colorSpace = THREE.SRGBColorSpace;
//         setTex(t);
//       },
//       undefined,
//       () => {
//         if (!alive) return;
//         setFailed(true);
//       }
//     );
//     return () => { alive = false; };
//   }, [url]);

//   return { tex, failed };
// }

// function Loader() {
//   return (
//     <Html center style={{ color: "#aaa", fontFamily: "Manrope, system-ui", fontSize: 18 }}>
//       Entering Gallery…
//     </Html>
//   );
// }

// /* -------------------- Scene geometry -------------------- */
// function Corridor() {
//   const floorMat = useMemo(
//     () => new THREE.MeshPhysicalMaterial({ color: "#444", roughness: 0.9, metalness: 0.0 }),
//     []
//   );
//   const wallMat = useMemo(
//     () => new THREE.MeshStandardMaterial({ color: "#f3f3f3", roughness: 0.95 }),
//     []
//   );
//   const ceilMat = useMemo(
//     () => new THREE.MeshStandardMaterial({ color: "#e7e7e7", roughness: 0.98 }),
//     []
//   );

//   return (
//     <group>
//       {/* Floor */}
//       <mesh position={[0, -0.01, HALL_LEN / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
//         <planeGeometry args={[HALL_W, HALL_LEN]} />
//         <primitive attach="material" object={floorMat} />
//       </mesh>

//       {/* Ceiling */}
//       <mesh position={[0, HALL_H, HALL_LEN / 2]} rotation={[Math.PI / 2, 0, 0]}>
//         <planeGeometry args={[HALL_W, HALL_LEN]} />
//         <primitive attach="material" object={ceilMat} />
//       </mesh>

//       {/* Left Wall */}
//       <mesh position={[-HALL_W / 2, HALL_H / 2, HALL_LEN / 2]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[HALL_H, HALL_LEN]} />
//         <primitive attach="material" object={wallMat} />
//       </mesh>

//       {/* Right Wall */}
//       <mesh position={[HALL_W / 2, HALL_H / 2, HALL_LEN / 2]} rotation={[0, -Math.PI / 2, 0]}>
//         <planeGeometry args={[HALL_H, HALL_LEN]} />
//         <primitive attach="material" object={wallMat} />
//       </mesh>
//     </group>
//   );
// }

// /* -------------------- Frame mesh (raycast target) -------------------- */
// const FrameMesh = React.forwardRef(function FrameMesh({ img, title, highlight }, ref) {
//   const { tex, failed } = useSafeTexture(img);
//   return (
//     <group ref={ref}>
//       <mesh>
//         <planeGeometry args={[1.2, 0.8]} />
//         {tex && !failed ? (
//           <meshPhysicalMaterial
//             map={tex}
//             roughness={0.9}
//             metalness={0.0}
//             clearcoat={0.05}
//             emissive={highlight ? "#ffffff" : "#000000"}
//             emissiveIntensity={highlight ? 0.15 : 0}
//           />
//         ) : (
//           <meshStandardMaterial color={highlight ? "#cfd6df" : "#d9dde3"} roughness={0.9} />
//         )}
//       </mesh>
//       <Text position={[0, -0.6, 0.01]} fontSize={0.08} color="#333" anchorX="center" anchorY="middle">
//         {title}
//       </Text>
//     </group>
//   );
// });

// /* -------------------- Frames layout + registration -------------------- */
// function Frames({ register, highlightedId }) {
//   return (
//     <group>
//       {FRAMES.map((f, i) => {
//         const x = f.side === "L" ? -HALL_W / 2 + 0.12 : HALL_W / 2 - 0.12;
//         const rotY = f.side === "L" ? Math.PI / 2 : -Math.PI / 2;
//         const setRef = (node) => {
//           if (node) {
//             const mesh = node.children[0]; // the <mesh> inside
//             register(i, mesh, f);
//           }
//         };
//         return (
//           <group key={i} position={[x, HALL_H * 0.55, f.z]} rotation={[0, rotY, 0]}>
//             <FrameMesh ref={setRef} img={f.img} title={f.title} highlight={highlightedId === i} />
//           </group>
//         );
//       })}
//     </group>
//   );
// }

// /* -------------------- Main interactive scene -------------------- */
// function GalleryScene() {
//   const { camera, invalidate } = useThree();
//   const [perf, setPerf] = useState(1);

//   // Movement state
//   const keys = useRef({});
//   const baseSpeed = useRef(2.0);   // m/s
//   const sprintMult = useRef(1.8);
//   const lockedRef = useRef(false);
//   const [isLocked, setIsLocked] = useState(false);

//   // Raycast & interaction
//   const raycaster = useRef(new THREE.Raycaster());
//   const frames = useRef([]); // [{ id, mesh, meta }]
//   const [highlight, setHighlight] = useState(null);
//   const [inspecting, setInspecting] = useState(null); // { id, meta }
//   const inspectTarget = useRef(new THREE.Vector3());

//   // Pointer lock controls ref
//   const plcRef = useRef();

//   // Register frames from children
//   const register = useCallback((id, mesh, meta) => {
//     const exists = frames.current.find((f) => f.id === id);
//     if (!exists) frames.current.push({ id, mesh, meta });
//   }, []);

//   // Keyboard handlers
//   useEffect(() => {
//     const down = (e) => {
//       keys.current[e.key.toLowerCase()] = true;
//       if (e.key === "Escape") setInspecting(null);
//     };
//     const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
//     window.addEventListener("keydown", down);
//     window.addEventListener("keyup", up);
//     return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
//   }, []);

//   const onLock = () => { lockedRef.current = true; setIsLocked(true); };
//   const onUnlock = () => { lockedRef.current = false; setIsLocked(false); };

//   useFrame((_, dt) => {
//     // Inspect mode: ease camera to target and look at it
//     if (inspecting) {
//       camera.position.lerp(inspectTarget.current, 1 - Math.pow(0.0001, dt));
//       camera.lookAt(inspectTarget.current.x, 1.55, inspectTarget.current.z + 0.2);
//       invalidate();
//       return;
//     }

//     // Movement
//     const speed = (keys.current["shift"] ? sprintMult.current : 1.0) * baseSpeed.current;
//     const forward = (keys.current["w"] || keys.current["arrowup"]) ? 1 : (keys.current["s"] || keys.current["arrowdown"]) ? -1 : 0;
//     const strafe = (keys.current["a"] || keys.current["arrowleft"]) ? -1 : (keys.current["d"] || keys.current["arrowright"]) ? 1 : 0;

//     // Build movement vector in camera space
//     const dir = new THREE.Vector3();
//     camera.getWorldDirection(dir); // forward
//     dir.y = 0; dir.normalize();
//     const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0,1,0)).normalize();

//     const move = new THREE.Vector3();
//     move.addScaledVector(dir, forward * speed * dt);
//     move.addScaledVector(right, strafe * speed * dt);

//     // Apply & clamp inside corridor
//     const next = camera.position.clone().add(move);
//     next.y = 1.6;
//     next.x = THREE.MathUtils.clamp(next.x, -HALL_W/2 + 0.6, HALL_W/2 - 0.6);
//     next.z = THREE.MathUtils.clamp(next.z, START_Z, END_Z);
//     camera.position.copy(next);

//     // Raycast straight ahead for interaction (2.2m reach)
//     raycaster.current.set(camera.position, camera.getWorldDirection(new THREE.Vector3()));
//     const intersects = raycaster.current.intersectObjects(frames.current.map(f => f.mesh), true);
//     const hit = intersects.find(hit => hit.distance <= 2.2);
//     const currentId = hit ? frames.current.find(f => f.mesh === hit.object)?.id : null;

//     if (currentId !== highlight) setHighlight(currentId ?? null);

//     // Press E to inspect
//     if (highlight != null && (keys.current["e"] || keys.current["enter"])) {
//       keys.current["e"] = false;
//       keys.current["enter"] = false;
//       const f = frames.current.find((fr) => fr.id === highlight);
//       if (f) {
//         const wp = new THREE.Vector3();
//         f.mesh.getWorldPosition(wp);
//         inspectTarget.current.set(wp.x, 1.55, f.meta.z - 0.35);
//         setInspecting({ id: f.id, meta: f.meta });
//       }
//     }

//     invalidate();
//   });

//   const aimed = highlight != null;

//   return (
//     <>
//       {/* Lights */}
//       <color attach="background" args={["#0d0f12"]} />
//       <hemisphereLight intensity={0.25} groundColor="#101010" />
//       <directionalLight position={[2, 3, 1]} intensity={0.4} color="#ffffff" />

//       <Suspense fallback={<Loader />}>
//         <Environment preset="apartment" background={false} />
//         <Corridor />
//         <Frames register={register} highlightedId={highlight} />
//         <ContactShadows position={[0, -0.01, HALL_LEN / 2]} opacity={0.25} scale={HALL_W + 4} blur={2.4} far={8} />
//         <EffectComposer multisampling={0}>
//           <Vignette eskil={false} offset={-0.12} darkness={0.85} />
//         </EffectComposer>

//         {/* Pointer lock controls */}
//         <PointerLockControls ref={plcRef} onLock={onLock} onUnlock={onUnlock} />
//       </Suspense>

//       <PerformanceMonitor onDecline={() => setPerf(0.8)} onIncline={() => setPerf(1)} />
//       <AdaptiveDpr pixelated />

//       {/* Crosshair (Html overlay) */}
//       <Html fullscreen style={{ pointerEvents: "none" }}>
//         <div style={{
//           position: "absolute", left: "50%", top: "50%", width: 8, height: 8,
//           transform: "translate(-50%, -50%)",
//           borderRadius: "50%", background: aimed ? "#6cf" : "#ccc",
//           opacity: isLocked && !inspecting ? 0.9 : 0, transition: "opacity 200ms",
//           zIndex: 5,
//         }} />
//       </Html>

//       {/* Lock overlay (Html overlay) */}
//       {!isLocked && !inspecting && (
//         <Html fullscreen>
//           <div
//             onClick={() => plcRef.current?.lock()}
//             style={{
//               position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
//               background: "rgba(0,0,0,0.45)", color: "#fff", zIndex: 10, cursor: "pointer",
//               fontFamily: "Inter, system-ui", userSelect: "none"
//             }}
//             title="Click to enter Look mode"
//           >
//             <div style={{ textAlign: "center" }}>
//               <div style={{ fontSize: 22, marginBottom: 8 }}>Click to enter</div>
//               <div style={{ opacity: 0.9, lineHeight: 1.6 }}>
//                 <b>Look</b>: mouse &nbsp;|&nbsp; <b>Move</b>: WASD / Arrows &nbsp;|&nbsp; <b>Sprint</b>: Shift <br/>
//                 <b>Interact</b>: aim (reticle) then press <b>E</b> &nbsp;|&nbsp; <b>Exit</b>: Esc
//               </div>
//             </div>
//           </div>
//         </Html>
//       )}

//       {/* Inspect overlay (Html overlay) */}
//       {inspecting && (
//         <Html fullscreen>
//           <div
//             style={{
//               position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center",
//               background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55))",
//               color: "#fff", zIndex: 10, fontFamily: "Inter, system-ui", padding: "24px"
//             }}
//           >
//             <div style={{ textAlign: "center" }}>
//               <div style={{ fontSize: 18, marginBottom: 6 }}>{inspecting.meta.title}</div>
//               <div style={{ opacity: 0.9, fontSize: 13 }}>Press <b>Esc</b> to close</div>
//             </div>
//           </div>
//         </Html>
//       )}
//     </>
//   );
// }

// export default function Gallery3D() {
//   return (
//     <Canvas
//       frameloop="demand"
//       dpr={[1, 1.25]}
//       camera={{ position: [0, 1.6, START_Z], fov: 60, near: 0.01, far: 200 }}
//       gl={{
//         antialias: true,
//         powerPreference: "high-performance",
//         toneMapping: THREE.ACESFilmicToneMapping,
//         outputColorSpace: THREE.SRGBColorSpace,
//         physicallyCorrectLights: true,
//       }}
//       style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
//       onCreated={({ gl }) => {
//         THREE.Cache.enabled = true;
//         gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
//       }}
//     >
//       <GalleryScene />
//       <Preload all />
//     </Canvas>
//   );
// }






// pages/Gallery3D.jsx
import React, { Suspense, useMemo, useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  PointerLockControls,
  Html,
  Environment,
  ContactShadows,
  Text,
  Preload,
  AdaptiveDpr,
  PerformanceMonitor,
} from "@react-three/drei";
import { EffectComposer, Vignette } from "@react-three/postprocessing";

/* ---------- BASE-URL safe asset helper ---------- */
function assetUrl(path) {
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || "/";
  return base + path.replace(/^\//, "");
}

/* -------------------- Corridor config -------------------- */
const HALL_LEN = 40;
const HALL_W = 6;
const HALL_H = 3.2;
const START_Z = -2;  //default -4;
const END_Z = HALL_LEN - 2;

/* -------------------- Frame sizing & interaction -------------------- */
// Bigger frames 👇
const FRAME_W = 3.0;          // was 1.2
const FRAME_H = 2.25;         // was 0.8
const TITLE_OFFSET = -(FRAME_H / 4 + 0.25);
const INTERACT_REACH = 2.8;   // was 2.2
const INSPECT_OFFSET = 0.6;   // was 0.35

/* ---------- Frames (edit freely) ---------- */
const FRAMES = [
  { side: "L", z: 4,  img: assetUrl("gallery/art.jpg"),     title: "Morning Light" },
  { side: "R", z: 8,  img: assetUrl("gallery/mgmt.jpg"),    title: "A Quiet Street" },
  { side: "L", z: 12, img: assetUrl("gallery/tour.jpg"),    title: "Seaside" },
  { side: "R", z: 16, img: assetUrl("gallery/restora.jpg"), title: "Forest Edge" },
  { side: "L", z: 22, img: assetUrl("gallery/shop.jpg"),    title: "Pink Sunset" },
  { side: "R", z: 28, img: assetUrl("gallery/sport.jpg"),   title: "City Night" },
];

/* ---------- Safe texture loader (never crashes on 404) ---------- */
function useSafeTexture(url) {
  const [tex, setTex] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!url) { setFailed(true); return; }
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (t) => {
        if (!alive) return;
        t.colorSpace = THREE.SRGBColorSpace;
        setTex(t);
      },
      undefined,
      () => {
        if (!alive) return;
        setFailed(true);
      }
    );
    return () => { alive = false; };
  }, [url]);

  return { tex, failed };
}

function Loader() {
  return (
    <Html center style={{ color: "#aaa", fontFamily: "Manrope, system-ui", fontSize: 18 }}>
      Entering Gallery…
    </Html>
  );
}

/* -------------------- Scene geometry -------------------- */
function Corridor() {
  const floorMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#444", roughness: 0.9, metalness: 0.0 }),
    []
  );
  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f3f3f3", roughness: 0.95 }),
    []
  );
  const ceilMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e7e7e7", roughness: 0.98 }),
    []
  );

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.01, HALL_LEN / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[HALL_W, HALL_LEN]} />
        <primitive attach="material" object={floorMat} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, HALL_H, HALL_LEN / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HALL_W, HALL_LEN]} />
        <primitive attach="material" object={ceilMat} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-HALL_W / 2, HALL_H / 2, HALL_LEN / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[HALL_H, HALL_LEN]} />
        <primitive attach="material" object={wallMat} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[HALL_W / 2, HALL_H / 2, HALL_LEN / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[HALL_H, HALL_LEN]} />
        <primitive attach="material" object={wallMat} />
      </mesh>
    </group>
  );
}

/* -------------------- Frame mesh (raycast target) -------------------- */
const FrameMesh = React.forwardRef(function FrameMesh({ img, title, highlight }, ref) {
  const { tex, failed } = useSafeTexture(img);
  return (
    <group ref={ref}>
      <mesh>
        {/* Bigger images */}
        <planeGeometry args={[FRAME_W, FRAME_H]} />
        {tex && !failed ? (
          <meshPhysicalMaterial
            map={tex}
            roughness={0.9}
            metalness={0.0}
            clearcoat={0.05}
            emissive={highlight ? "#ffffff" : "#000000"}
            emissiveIntensity={highlight ? 0.15 : 0}
          />
        ) : (
          <meshStandardMaterial color={highlight ? "#cfd6df" : "#d9dde3"} roughness={0.9} />
        )}
      </mesh>
      {/* Drop the title a bit lower to match new size */}
      <Text position={[0, TITLE_OFFSET, 0.01]} fontSize={0.1} color="#333" anchorX="center" anchorY="middle">
        {title}
      </Text>
    </group>
  );
});

/* -------------------- Frames layout + registration -------------------- */
function Frames({ register, highlightedId }) {
  return (
    <group>
      {FRAMES.map((f, i) => {
        const x = f.side === "L" ? -HALL_W / 2 + 0.14 : HALL_W / 2 - 0.14; // tiny nudge from wall
        const rotY = f.side === "L" ? Math.PI / 2 : -Math.PI / 2;
        const setRef = (node) => {
          if (node) {
            const mesh = node.children[0]; // the <mesh> inside
            register(i, mesh, f);
          }
        };
        return (
          <group key={i} position={[x, HALL_H * 0.55, f.z]} rotation={[0, rotY, 0]}>
            <FrameMesh ref={setRef} img={f.img} title={f.title} highlight={highlightedId === i} />
          </group>
        );
      })}
    </group>
  );
}

/* -------------------- Main interactive scene -------------------- */
function GalleryScene() {
  const { camera, invalidate } = useThree();
  const [perf, setPerf] = useState(1);

  // Movement state
  const keys = useRef({});
  const baseSpeed = useRef(2.0);   // m/s
  const sprintMult = useRef(1.8);
  const lockedRef = useRef(false);
  const [isLocked, setIsLocked] = useState(false);

  // Raycast & interaction
  const raycaster = useRef(new THREE.Raycaster());
  const frames = useRef([]); // [{ id, mesh, meta }]
  const [highlight, setHighlight] = useState(null);
  const [inspecting, setInspecting] = useState(null); // { id, meta }
  const inspectTarget = useRef(new THREE.Vector3());

  const plcRef = useRef();

  const register = useCallback((id, mesh, meta) => {
    const exists = frames.current.find((f) => f.id === id);
    if (!exists) frames.current.push({ id, mesh, meta });
  }, []);

  useEffect(() => {
    const down = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === "Escape") setInspecting(null);
    };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const onLock = () => { lockedRef.current = true; setIsLocked(true); };
  const onUnlock = () => { lockedRef.current = false; setIsLocked(false); };

  useFrame((_, dt) => {
    // Inspect mode: ease camera to target and look at it
    if (inspecting) {
      camera.position.lerp(inspectTarget.current, 1 - Math.pow(0.0001, dt));
      camera.lookAt(inspectTarget.current.x, 1.55, inspectTarget.current.z + 0.2);
      invalidate();
      return;
    }

    // Movement
    const speed = (keys.current["shift"] ? sprintMult.current : 1.0) * baseSpeed.current;
    const forward = (keys.current["w"] || keys.current["arrowup"]) ? 1 : (keys.current["s"] || keys.current["arrowdown"]) ? -1 : 0;
    const strafe = (keys.current["a"] || keys.current["arrowleft"]) ? -1 : (keys.current["d"] || keys.current["arrowright"]) ? 1 : 0;

    // Build movement vector in camera space
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir); // forward
    dir.y = 0; dir.normalize();
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0,1,0)).normalize();

    const move = new THREE.Vector3();
    move.addScaledVector(dir, forward * speed * dt);
    move.addScaledVector(right, strafe * speed * dt);

    // Apply & clamp inside corridor
    const next = camera.position.clone().add(move);
    next.y = 1.6;
    next.x = THREE.MathUtils.clamp(next.x, -HALL_W/2 + 0.6, HALL_W/2 - 0.6);
    next.z = THREE.MathUtils.clamp(next.z, START_Z, END_Z);
    camera.position.copy(next);

    // Raycast straight ahead for interaction
    raycaster.current.set(camera.position, camera.getWorldDirection(new THREE.Vector3()));
    const intersects = raycaster.current.intersectObjects(frames.current.map(f => f.mesh), true);
    const hit = intersects.find(hit => hit.distance <= INTERACT_REACH);
    const currentId = hit ? frames.current.find(f => f.mesh === hit.object)?.id : null;

    if (currentId !== highlight) setHighlight(currentId ?? null);

    // Press E to inspect
    if (highlight != null && (keys.current["e"] || keys.current["enter"])) {
      keys.current["e"] = false;
      keys.current["enter"] = false;
      const f = frames.current.find((fr) => fr.id === highlight);
      if (f) {
        const wp = new THREE.Vector3();
        f.mesh.getWorldPosition(wp);
        // Stop a bit farther from larger frame
        inspectTarget.current.set(wp.x, 1.55, f.meta.z - INSPECT_OFFSET);
        setInspecting({ id: f.id, meta: f.meta });
      }
    }

    invalidate();
  });

  const aimed = highlight != null;

  return (
    <>
      {/* Lights */}
      <color attach="background" args={["#0d0f12"]} />
      <hemisphereLight intensity={0.25} groundColor="#101010" />
      <directionalLight position={[2, 3, 1]} intensity={0.4} color="#ffffff" />

      <Suspense fallback={<Loader />}>
        <Environment preset="apartment" background={false} />
        <Corridor />
        <Frames register={register} highlightedId={highlight} />
        <ContactShadows position={[0, -0.01, HALL_LEN / 2]} opacity={0.25} scale={HALL_W + 4} blur={2.4} far={8} />
        <EffectComposer multisampling={0}>
          <Vignette eskil={false} offset={-0.12} darkness={0.85} />
        </EffectComposer>

        {/* Pointer lock controls */}
        <PointerLockControls ref={plcRef} onLock={onLock} onUnlock={onUnlock} />
      </Suspense>

      <PerformanceMonitor onDecline={() => setPerf(0.8)} onIncline={() => setPerf(1)} />
      <AdaptiveDpr pixelated />

      {/* Crosshair (Html overlay) */}
      <Html fullscreen style={{ pointerEvents: "none" }}>
        <div style={{
          position: "absolute", left: "50%", top: "50%", width: 8, height: 8,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%", background: aimed ? "#6cf" : "#ccc",
          opacity: isLocked && !inspecting ? 0.9 : 0, transition: "opacity 200ms",
          zIndex: 5,
        }} />
      </Html>

      {/* Lock overlay (Html overlay) */}
      {!isLocked && !inspecting && (
        <Html fullscreen>
          <div
            onClick={() => plcRef.current?.lock()}
            style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.45)", color: "#fff", zIndex: 10, cursor: "pointer",
              fontFamily: "Inter, system-ui", userSelect: "none"
            }}
            title="Click to enter Look mode"
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>Click to enter</div>
              <div style={{ opacity: 0.9, lineHeight: 1.6 }}>
                <b>Look</b>: mouse &nbsp;|&nbsp; <b>Move</b>: WASD / Arrows &nbsp;|&nbsp; <b>Sprint</b>: Shift <br/>
                <b>Interact</b>: aim (reticle) then press <b>E</b> &nbsp;|&nbsp; <b>Exit</b>: Esc
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Inspect overlay (Html overlay) */}
      {inspecting && (
        <Html fullscreen>
          <div
            style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center",
              background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55))",
              color: "#fff", zIndex: 10, fontFamily: "Inter, system-ui", padding: "24px"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{inspecting.meta.title}</div>
              <div style={{ opacity: 0.9, fontSize: 13 }}>Press <b>Esc</b> to close</div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

export default function Gallery3D() {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      camera={{ position: [0, 1.6, START_Z], fov: 60, near: 0.01, far: 200 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        physicallyCorrectLights: true,
      }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}
      onCreated={({ gl }) => {
        THREE.Cache.enabled = true;
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      }}
    >
      <GalleryScene />
      <Preload all />
    </Canvas>
  );
}

