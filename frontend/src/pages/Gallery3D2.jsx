

// import React, { Suspense, useEffect, useRef, useState } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   KeyboardControls,
//   useKeyboardControls,
//   PointerLockControls,
//   Html,
//   Environment,
//   useGLTF,
//   ContactShadows,
//   useTexture,
//   useCursor,
// } from "@react-three/drei";
// import { Physics, RigidBody, CapsuleCollider, BallCollider, CuboidCollider } from "@react-three/rapier";
// import * as THREE from "three";
// import { useNavigate } from "react-router-dom";
// import RapierReady from "./RapierReady.jsx";

// /* ========= ✅ Environment Controller ========= */
// function EnvironmentController({ enabled }) {
//   const { scene } = useThree();

//   useEffect(() => {
//     if (!enabled) {
//       // Clear environment & reset background color when disabled
//       scene.environment = null;
//       scene.background = new THREE.Color("#0b0b12");
//     }
//   }, [enabled, scene]);

//   // Only mount <Environment /> when enabled
//   return enabled ? (
//     <Environment files="/hdr/jungle.hdr" background blur={0} />
//   ) : null;
// }

// /* ----------------------------- utils ----------------------------- */
// const asset = (p) => {
//   const base = (import.meta.env?.BASE_URL ?? "/").replace(/\/+$/, "");
//   const rel = String(p).replace(/^\/+/, "");
//   return `${base}/${rel}`;
// };

// /* ----------------------------- keymap ---------------------------- */
// const KEYMAP = [
//   { name: "forward", keys: ["KeyW", "ArrowUp"] },
//   { name: "backward", keys: ["KeyS", "ArrowDown"] },
//   { name: "left", keys: ["KeyA", "ArrowLeft"] },
//   { name: "right", keys: ["KeyD"] },
//   { name: "jump", keys: ["Space"] },
//   { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
//   { name: "interact", keys: ["KeyE", "Enter"] },
// ];


// // Icon paths from /public
// const HDRI_ON_ICON = "/icon/sun.svg";
// const HDRI_OFF_ICON = "/icon/moon.svg";


// /* ----------------------------- paintings ------------------------- */
// const PAINTINGS = [
//   {
//     id: "p1",
//     title: "Sportbit",
//     img: asset("/gallery/sport.jpg"),
//     position: [-9.9, 3.6, 3.9],
//     rotation: [0, Math.PI, 0],
//     size: [3.2, 4],
//     desc: "SportBit is an advanced AI-powered sports management system built to revolutionize how sports organizations operate. It offers an integrated platform for players, managers, clubs, and administrators to manage data, performance, and communication efficiently. Using artificial intelligence, SportBit provides predictive analytics, performance insights, and talent evaluation to help teams make smarter decisions. The system includes features like personalized dashboards, performance tracking, video analysis, and player profile management. It also simplifies administrative tasks such as scheduling, reporting, and communication. Designed with scalability in mind, SportBit caters to both amateur and professional levels of sports management. By combining technology and sports intelligence, it bridges the gap between athletic potential and data-driven performance optimization.",
//   },
//   {
//     id: "p2",
//     title: "F&B",
//     img: asset("/gallery/art.jpg"),
//     position: [-3.4, 3.6, 3.9],
//     rotation: [0, Math.PI, 0],
//     size: [3.2, 4],
//     desc: "The F&B Restaurant Management System is an intelligent platform designed to streamline restaurant operations through automation and centralized control. It enables efficient management of orders, billing, inventory, and staff while improving kitchen workflows and customer service. With features like digital menus, real-time order tracking, and sales analytics, it helps optimize performance and reduce operational errors. Suitable for cafés, restaurants, and large F&B chains, the system enhances efficiency, profitability, and customer satisfaction through data-driven insights and seamless coordination.",
//   },
//   {
//     id: "p3",
//     title: "Tour Guide",
//     img: asset("/gallery/mgmt.jpg"),
//     position: [3.2, 3.6, 3.9],
//     rotation: [0, Math.PI, 0],
//     size: [3.2, 4],
//     desc: "The AI Tour Guide Platform is an intelligent travel companion designed to enhance the touring experience through real-time, personalized guidance. It uses artificial intelligence to provide curated itineraries, location-based recommendations, and interactive voice or chat assistance. The platform helps travelers explore destinations efficiently by suggesting nearby attractions, dining options, and cultural insights. With smart navigation and multilingual support, the AI Tour Guide makes travel more convenient, engaging, and informative for users across the globe.",
//   },
//   {
//     id: "p4",
//     title: "EEC",
//     img: asset("/gallery/restora.jpg"),
//     position: [9.2, 3.6, 3.9],
//     rotation: [0, Math.PI, 0],
//     size: [3.2, 4],
//     desc: "Electronic Educare is an AI-powered learning management system designed to revolutionize digital education through intelligent automation and personalization. It offers an interactive platform for students, teachers, and institutions to manage courses, track progress, and enhance learning outcomes. Using artificial intelligence, it provides personalized study plans, performance analytics, and adaptive assessments to cater to each learner’s needs. The system also supports live classes, assignments, and real-time feedback, making education more engaging, efficient, and accessible for all users.",
//   },
//   {
//     id: "p5",
//     title: "Yarrowtech",
//     img: asset("/gallery/shop.jpg"),
//     position: [9.8, 3.6, -3.9],
//     rotation: [0, Math.PI * 2, 0],
//     size: [3.2, 4],
//     desc: "YarrowTech is a modern technology service company specializing in building high-quality web applications, software solutions, and digital platforms. It offers end-to-end services including UI/UX design, web and mobile app development, and system integration tailored to client needs. With a focus on innovation, scalability, and performance, YarrowTech helps businesses establish a strong digital presence. The company’s mission is to deliver reliable, cutting-edge solutions that drive growth and transform ideas into impactful digital experiences.",
//   },
//   {
//     id: "p6",
//     title: "ArtBlock",
//     img: asset("/gallery/tour.jpg"),
//     position: [3.2, 3.6, -3.9],
//     rotation: [0, Math.PI * 2, 0],
//     size: [3.2, 4],
//     desc: "ArtBlock is a creative service platform designed for artists to share, showcase, and discover artwork from around the world. It provides a vibrant digital space where creators can upload their art, connect with audiences, and collaborate with other artists. The platform supports various art forms — from digital illustrations to traditional paintings — promoting creativity and community engagement. With features like artist profiles, feedback systems, and curated galleries, ArtBlock empowers artists to gain visibility, inspiration, and opportunities in the global art ecosystem.",
//   },
//   {
//     id: "p7",
//     title: "Police & Fire management system",
//     img: asset("/gallery/sport.jpg"),
//     position: [-3.4, 3.6, -3.9],
//     rotation: [0, Math.PI * 2, 0],
//     size: [3.2, 4],
//     desc: "The Police and Fire Management System is an integrated digital platform designed to streamline emergency response and public safety operations. It enables efficient coordination between police, fire, and rescue departments through real-time communication and data sharing. The system manages incident reporting, resource allocation, and personnel tracking to ensure quick and effective responses. With features like live alerts, analytics, and case management, it enhances operational efficiency, accountability, and overall community safety.",
//   },
//   {
//     id: "p8",
//     title: "RMS",
//     img: asset("/gallery/mgmt.jpg"),
//     position: [-9.9, 3.6, -3.9],
//     rotation: [0, Math.PI * 2, 0],
//     size: [3.2, 4],
//     desc: "The Retail Management System (RMS) is a comprehensive solution designed to simplify and automate retail operations. It enables businesses to efficiently manage sales, inventory, billing, and customer relationships from a single platform. With built-in analytics and reporting tools, RMS helps retailers track performance, forecast demand, and make data-driven decisions. The system improves operational efficiency, reduces manual errors, and enhances the overall shopping experience for both customers and store managers",
//   },
// ];

// /* ----------------------------- tuning ---------------------------- */
// const SPEED = 4.4;
// const SPRINT = 8.8;
// const JUMP = 14.5;
// const PLAYER_HEIGHT = 3.35;
// const PLAYER_RADIUS = 0.35;

// /* =========================== Scene =============================== */
// function BalconyScene({ onSpawn }) {
//   const { scene } = useGLTF("/models/gallery3.glb");

//   useEffect(() => {
//     const spawn =
//       scene.getObjectByName("SpawnPoint") ||
//       scene.getObjectByName("spawn") ||
//       scene.getObjectByName("Start");

//     if (spawn && onSpawn) {
//       const w = new THREE.Vector3();
//       spawn.getWorldPosition(w);
//       const halfHeight = PLAYER_HEIGHT / 2 - PLAYER_RADIUS;
//       const centerY = w.y + halfHeight + PLAYER_RADIUS;
//       onSpawn([w.x, centerY, w.z]);
//     } else if (onSpawn) {
//       onSpawn([0, PLAYER_HEIGHT / 2, 3]);
//     }

//     scene.traverse((o) => {
//       if (o.isLight) o.castShadow = true;
//       if (o.isMesh) {
//         o.castShadow = true;
//         o.receiveShadow = true;
//         if (o.material && "envMapIntensity" in o.material) o.material.envMapIntensity = 1.0;
//         if (o.material) o.material.needsUpdate = true;
//       }
//     });
//   }, [scene, onSpawn]);

//   return (
//     <RigidBody type="fixed" colliders="trimesh">
//       <primitive object={scene} />
//     </RigidBody>
//   );
// }

// /* ========================= Player ================================ */
// function Player({ spawn = [0, 1.2, 3] }) {
//   const { camera } = useThree();
//   const bodyRef = useRef();
//   const [, get] = useKeyboardControls();

//   const forward = useRef(new THREE.Vector3()).current;
//   const right = useRef(new THREE.Vector3()).current;
//   const dir = useRef(new THREE.Vector3()).current;

//   useEffect(() => {
//     camera.position.set(spawn[0], spawn[1] + (PLAYER_HEIGHT / 2) - PLAYER_RADIUS, spawn[2]);
//   }, [camera, spawn]);

//   useFrame(() => {
//     const rb = bodyRef.current;
//     if (!rb) return;

//     const pressed = get();
//     const base = pressed.sprint ? SPEED * SPRINT : SPEED;

//     forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
//     forward.y = 0;
//     forward.normalize();

//     right.set(1, 0, 0).applyQuaternion(camera.quaternion);
//     right.y = 0;
//     right.normalize();

//     dir.set(0, 0, 0);
//     if (pressed.forward) dir.add(forward);
//     if (pressed.backward) dir.add(forward.clone().negate());
//     if (pressed.left) dir.add(right.clone().negate());
//     if (pressed.right) dir.add(right);

//     if (dir.lengthSq() > 0) dir.normalize().multiplyScalar(base);

//     const lv = rb.linvel();
//     rb.setLinvel({ x: dir.x, y: lv.y, z: dir.z }, true);

//     if (pressed.jump && Math.abs(lv.y) < 0.05) {
//       rb.applyImpulse({ x: 0, y: JUMP, z: 0 }, true);
//     }

//     const t = rb.translation();
//     camera.position.set(t.x, t.y + (PLAYER_HEIGHT / 2) - PLAYER_RADIUS, t.z);
//   });

//   return (
//     <RigidBody
//       ref={bodyRef}
//       position={[...spawn]}
//       colliders={false}
//       enabledRotations={[false, false, false]}
//       mass={1}
//       friction={0.2}
//       restitution={0}
//       linearDamping={0.05}
//       canSleep={false}
//     >
//       <CapsuleCollider args={[PLAYER_HEIGHT / 2 - PLAYER_RADIUS, PLAYER_RADIUS]} />
//     </RigidBody>
//   );
// }

// /* ========================= Paintings ============================= */
// function Painting({ id, title, img, position, rotation, size, desc }) {
//   const tex = useTexture(img);
//   useEffect(() => {
//     if (!tex) return;
//     tex.colorSpace = THREE.SRGBColorSpace;
//     tex.anisotropy = 8;
//   }, [tex]);

//   const planeRef = useRef();
//   const [aimed, setAimed] = useState(false);
//   useCursor(aimed);

//   useEffect(() => {
//     if (planeRef.current) {
//       planeRef.current.userData.isPainting = true;
//       planeRef.current.userData.paintingMeta = { id, title, img, desc };
//     }
//   }, [id, title, img, desc]);

//   return (
//     <group position={position} rotation={rotation}>
//       <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
//         <boxGeometry args={[size[0] + 0.08, size[1] + 0.08, 0.06]} />
//         <meshStandardMaterial metalness={0} roughness={0} color="#00000008" />
//       </mesh>

//       <mesh
//         ref={planeRef}
//         castShadow={false}
//         receiveShadow={false}
//         position={[0, 0, 0.012]}
//         onPointerOver={() => setAimed(true)}
//         onPointerOut={() => setAimed(false)}
//       >
//         <planeGeometry args={size} />
//         <meshStandardMaterial
//           map={tex}
//           roughness={0.12}
//           metalness={0}
//           toneMapped
//           polygonOffset
//           polygonOffsetFactor={-1}
//           polygonOffsetUnits={-1}
//         />
//       </mesh>

//       {aimed && (
//         <mesh position={[0, 0, 0.01]} renderOrder={999}>
//           <planeGeometry args={[size[0] + 0.04, size[1] + 0.04]} />
//           <meshBasicMaterial
//             color="#ffffff"
//             transparent
//             opacity={0.14}
//             depthWrite={false}
//             depthTest={false}
//             blending={THREE.AdditiveBlending}
//             toneMapped={false}
//           />
//         </mesh>
//       )}

//       <Html
//         position={[0, -size[1] * 0.65, 0]}
//         center
//         style={{
//           padding: "8px 10px",
//           borderRadius: 10,
//           background: "rgba(255, 252, 255, 0.29)",
//           color: "#000",
//           fontSize: 13,
//           border: "1px solid rgba(255, 255, 255, 0.1)",
//           pointerEvents: "none",
//           whiteSpace: "nowrap",
//           fontWeight: "bold",
//         }}
//       >
//         {title} • Press <b>E</b> / Click
//       </Html>
//     </group>
//   );
// }

// function PaintingsManager({ config, onOpen, maxDistance = 8, pointerLocked = false }) {
//   const groupRef = useRef();
//   const ray = useRef(new THREE.Raycaster()).current;
//   const { camera } = useThree();
//   const [, get] = useKeyboardControls();
//   const ndc = useRef(new THREE.Vector2(0, 0)).current;

//   useFrame(() => {
//     const pressed = get();
//     if (!pressed.interact) return;
//     if (!pointerLocked) return;

//     ray.setFromCamera(ndc, camera);
//     const root = groupRef.current?.children ?? [];
//     const hits = ray.intersectObjects(root, true);
//     const h = hits.find((x) => x.object?.userData?.isPainting && x.distance <= maxDistance);
//     if (h?.object?.userData?.paintingMeta) onOpen?.(h.object.userData.paintingMeta);
//   });

//   useEffect(() => {
//     const handleTryOpen = (e) => {
//       if (!pointerLocked) return;
//       if (e.type === "mousedown" && e.button !== 0) return;

//       ray.setFromCamera(ndc, camera);
//       const root = groupRef.current?.children ?? [];
//       const hits = ray.intersectObjects(root, true);
//       const h = hits.find((x) => x.object?.userData?.isPainting && x.distance <= maxDistance);
//       if (h?.object?.userData?.paintingMeta) onOpen?.(h.object.userData.paintingMeta);
//     };

//     window.addEventListener("mousedown", handleTryOpen);
//     window.addEventListener("pointerdown", handleTryOpen);
//     window.addEventListener("touchstart", handleTryOpen, { passive: true });

//     return () => {
//       window.removeEventListener("mousedown", handleTryOpen);
//       window.removeEventListener("pointerdown", handleTryOpen);
//       window.removeEventListener("touchstart", handleTryOpen);
//     };
//   }, [camera, ray, maxDistance, onOpen, pointerLocked, ndc]);

//   return (
//     <group ref={groupRef}>
//       {config.map((p) => (
//         <Painting key={p.id} {...p} />
//       ))}
//     </group>
//   );
// }

// function WorldBounds() {
//   const halfX = 12;
//   const halfY = 6;
//   const halfZ = 8;
//   const thick = 0.25;

//   return (
//     <RigidBody type="fixed">
//       {/* Floor */}
//       <CuboidCollider args={[halfX, thick, halfZ]} position={[0, -thick, 0]} />
//       {/* Ceiling */}
//       <CuboidCollider args={[halfX, thick, halfZ]} position={[0, 2 * halfY + thick, 0]} />
//       {/* Walls */}
//       <CuboidCollider args={[thick, halfY, halfZ]} position={[-halfX - thick, halfY, 0]} />
//       <CuboidCollider args={[thick, halfY, halfZ]} position={[halfX + thick, halfY, 0]} />
//       <CuboidCollider args={[halfX, halfY, thick]} position={[0, halfY, -halfZ - thick]} />
//       <CuboidCollider args={[halfX, halfY, thick]} position={[0, halfY, halfZ + thick]} />
//     </RigidBody>
//   );
// }

// /* ===================== NEW: Ball + Shooter ======================= */
// const MAX_BALLS = 60;
// const BALL_RADIUS = 0.18;
// const BALL_POWER = 50;
// const BALL_SPAWN_OFFSET = 0.6;
// const BALL_TTL_MS = 20000;

// function Ball({ id, position, velocity, onExpire }) {
//   const ref = useRef();

//   useEffect(() => {
//     const rb = ref.current;
//     if (!rb) return;
//     rb.setLinvel({ x: velocity[0], y: velocity[1], z: velocity[2] }, true);
//     const timer = setTimeout(() => onExpire?.(id), BALL_TTL_MS);
//     return () => clearTimeout(timer);
//   }, [id, velocity, onExpire]);

//   return (
//     <RigidBody
//       ref={ref}
//       position={position}
//       colliders={false}
//       restitution={0.45}
//       friction={0.6}
//       linearDamping={0.02}
//       angularDamping={0.01}
//       canSleep={true}
//       ccd={true}
//       mass={0.25}
//     >
//       <mesh castShadow receiveShadow>
//         <sphereGeometry args={[BALL_RADIUS, 24, 24]} />
//         <meshStandardMaterial roughness={0.35} metalness={0.05} color={"#f5f5f5"} />
//       </mesh>
//       <BallCollider args={[BALL_RADIUS]} restitution={0.25} friction={0.35} />
//     </RigidBody>
//   );
// }

// function Shooter({ pointerLocked, addBall }) {
//   const { camera } = useThree();
//   const dir = useRef(new THREE.Vector3()).current;

//   useEffect(() => {
//     const onFire = (e) => {
//       if (!pointerLocked) return;
//       if (e.type === "mousedown" && e.button !== 0) return;

//       camera.getWorldDirection(dir);
//       dir.normalize();

//       const spawn = new THREE.Vector3().copy(camera.position).add(dir.clone().multiplyScalar(BALL_SPAWN_OFFSET));
//       const vel = dir.clone().multiplyScalar(BALL_POWER);

//       addBall({
//         id: crypto.randomUUID(),
//         position: [spawn.x, spawn.y, spawn.z],
//         velocity: [vel.x, vel.y, vel.z],
//       });
//     };

//     window.addEventListener("mousedown", onFire);
//     return () => window.removeEventListener("mousedown", onFire);
//   }, [camera, pointerLocked, addBall]);

//   return null;
// }

// /* ================== Pointer lock bridge ========================== */
// function LockBridge({ plcRef, setLocked }) {
//   useEffect(() => {
//     const plc = plcRef.current;
//     if (!plc) return;
//     const onLock = () => setLocked(true);
//     const onUnlock = () => setLocked(false);
//     plc.addEventListener("lock", onLock);
//     plc.addEventListener("unlock", onUnlock);
//     return () => {
//       plc.removeEventListener("lock", onLock);
//       plc.removeEventListener("unlock", onUnlock);
//     };
//   }, [plcRef, setLocked]);
//   return null;
// }

// /* ============================ Page =============================== */
// export default function GalleryPage() {
//   const [locked, setLocked] = useState(false);
//   const [spawn, setSpawn] = useState(null);
//   const [active, setActive] = useState(null);
//   const plcRef = useRef();
//   const navigate = useNavigate();

//   const [envEnabled, setEnvEnabled] = useState(true);
//   const [balls, setBalls] = useState([]);

//   const addBall = (b) =>
//     setBalls((prev) => {
//       const next = [...prev, { ...b, createdAt: performance.now() }];
//       if (next.length > MAX_BALLS) next.splice(0, next.length - MAX_BALLS);
//       return next;
//     });

//   const removeBall = (id) => setBalls((prev) => prev.filter((x) => x.id !== id));

//   // 🔑 Keyboard shortcut: H to toggle HDRI (works even when pointer-locked)
//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === "h" || e.key === "H") {
//         setEnvEnabled((v) => !v);
//         console.log("HDRI toggled via H, now:", !envEnabled);
//       }
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [envEnabled]);

//   useEffect(() => {
//     const tick = setInterval(() => {
//       const now = performance.now();
//       setBalls((prev) => prev.filter((b) => now - b.createdAt < BALL_TTL_MS));
//     }, 2000);
//     return () => clearInterval(tick);
//   }, []);

//   return (
//     <>
//       {!locked && (
//         <button
//           onClick={() => plcRef.current?.lock()}
//           style={{
//             position: "fixed",
//             inset: 0,
//             margin: "auto",
//             width: 280,
//             height: 120,
//             background: "rgba(0,0,0,0.6)",
//             color: "#fff",
//             border: "1px solid rgba(255,255,255,0.2)",
//             borderRadius: 106,
//             fontSize: 16,
//             backdropFilter: "blur(4px)",
//             zIndex: 30,
//           }}
//         >
//           Click to enter • WASD / Shift / Space • Click to shoot •  H for Day/Night
//         </button>
//       )}






//       <button
//   onClick={(e) => {
//     e.stopPropagation(); // don't let it bubble into canvas
//     setEnvEnabled((v) => !v);
//     console.log("HDRI enabled:", !envEnabled);
//   }}
//   style={{
//     position: "fixed",
//     bottom: 16,
//     right: 16,
//     width: 46,
//     height: 46,
//     borderRadius: "999px",
//     border: "1px solid rgba(255,255,255,0.4)",
//     background: "rgba(255, 255, 255, 0.24)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 6,
//     backdropFilter: "blur(8px)",
//     zIndex: 9999,
//     cursor: "pointer",
//     pointerEvents: "auto",
//   }}
//   aria-label={envEnabled ? "Turn HDRI off" : "Turn HDRI on"}
// >
//   <img
//     src={envEnabled ? HDRI_ON_ICON : HDRI_OFF_ICON}
//     alt={envEnabled ? "HDRI On" : "HDRI Off"}
//     style={{
//       width: "100%",
//       height: "100%",
//       objectFit: "contain",
//       pointerEvents: "none",
//       filter: "drop-shadow(0 0 4px rgba(0,0,0,0.6))",
//     }}
//   />
// </button>


//       {/* Crosshair */}
//       <div
//         style={{
//           position: "fixed",
//           left: "50%",
//           top: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 8,
//           height: 8,
//           border: "2px solid rgba(255,255,255,0.8)",
//           borderRadius: 9999,
//           backgroundColor: "rgba(255, 255, 255, 1)",
//           pointerEvents: "none",
//           opacity: locked ? 1 : 0.35,
//           zIndex: 20,
//         }}
//       />

//       {/* Painting viewer modal */}
//       {active && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 50,
//             display: "grid",
//             placeItems: "center",
//             background: "rgba(0, 0, 0, 0.63)",
//             transition: "background 160ms ease",
//           }}
//           onClick={() => setActive(null)}
//         >
//           <div
//             className="modalCard"
//             style={{
//               background: "#ffffff4c",
//               backdropFilter: "blur(104px)",
//               border: "1px solid rgba(255,255,255,0.15)",
//               borderRadius: 50,
//               padding: 16,
//               width: "min(56vw, 960px)",
//               maxHeight: "86vh",
//               overflow: "auto",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 10,
//               }}
//             >
//               <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{active.title}</h3>
//               <button
//                 onClick={() => setActive(null)}
//                 style={{
//                   background: "rgba(255,255,255,0.08)",
//                   color: "#fff",
//                   border: "1px solid rgba(255,255,255,0.15)",
//                   borderRadius: 10,
//                   padding: "6px 10px",
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//             <img
//               src={active.img}
//               alt={active.title}
//               style={{ width: "100%", height: "auto", borderRadius: 10, display: "block" }}
//             />
//             <div
//               style={{
//                 marginTop: 12,
//                 color: "#fff",
//                 lineHeight: 1.6,
//                 fontSize: 14,
//                 opacity: 0.95,
//               }}
//             >
//               {active.desc || "—"}
//             </div>
//           </div>
//         </div>
//       )}

//       <KeyboardControls map={KEYMAP}>
//         <Canvas
//           style={{
//             width: "100vw",
//             height: "100vh",
//             display: "block",
//             position: "relative",
//             zIndex: 1,
//           }}
//           gl={{
//             antialias: true,
//             alpha: true,
//             premultipliedAlpha: true,
//             physicallyCorrectLights: true,
//             outputColorSpace: THREE.SRGBColorSpace,
//           }}
//           onCreated={({ gl, scene }) => {
//             gl.setClearColor("#0b0b12", 1);
//             gl.toneMapping = THREE.ACESFilmicToneMapping;
//             gl.toneMappingExposure = 1.0;
//             gl.shadowMap.enabled = true;
//             gl.shadowMap.type = THREE.PCFSoftShadowMap;
//             scene.fog = new THREE.FogExp2("#0c0c12", 0.02);
//           }}
//           camera={{ fov: 68, near: 0.1, far: 200 }}
//         >
//           <ambientLight intensity={0.35} />
//           <directionalLight
//             position={[5, 8, 3]}
//             intensity={1.1}
//             castShadow
//             shadow-bias={-0.0003}
//             shadow-mapSize-width={2048}
//             shadow-mapSize-height={2048}
//           />

//           {/* ✅ HDRI controlled here */}
//           <EnvironmentController enabled={envEnabled} />

//           <RapierReady>
//             <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} substeps={2}>
//               <Suspense fallback={<Html center style={{ color: "#fff" }}>Loading…</Html>}>
//                 <BalconyScene onSpawn={setSpawn} />
//               </Suspense>

//               <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={30} blur={2.5} far={20} />

//               <PaintingsManager config={PAINTINGS} onOpen={setActive} maxDistance={8} pointerLocked={locked} />

//               {spawn && <Player spawn={spawn} />}

//               <Shooter pointerLocked={locked && !active} addBall={(b) => addBall(b)} />

//               {balls.map((b) => (
//                 <Ball key={b.id} id={b.id} position={b.position} velocity={b.velocity} onExpire={removeBall} />
//               ))}
//             </Physics>
//           </RapierReady>

//           <PointerLockControls ref={plcRef} />
//           <LockBridge plcRef={plcRef} setLocked={setLocked} />
//         </Canvas>
//       </KeyboardControls>
//     </>
//   );
// }

// useGLTF.preload("/models/gallery3.glb");













































import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  KeyboardControls,
  useKeyboardControls,
  PointerLockControls,
  Html,
  Environment,
  useGLTF,
  ContactShadows,
  useTexture,
  useCursor,
  SoftShadows,
} from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CapsuleCollider,
  BallCollider,
  CuboidCollider,
} from "@react-three/rapier";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import RapierReady from "./RapierReady.jsx";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";


/* ========= ✅ Environment Controller ========= */
function EnvironmentController({ enabled }) {
  const { scene } = useThree();

  useEffect(() => {
    if (!enabled) {
      scene.environment = null;
      scene.background = new THREE.Color("#0b0b12");
    }
  }, [enabled, scene]);

  return enabled ? (
    <Environment
      files="/hdr/alps.hdr"
      background
      blur={0}          // ⭐ softer, GI-like reflections
    />
  ) : null;
}

/* ----------------------------- utils ----------------------------- */
const asset = (p) => {
  const base = (import.meta.env?.BASE_URL ?? "/").replace(/\/+$/, "");
  const rel = String(p).replace(/^\/+/, "");
  return `${base}/${rel}`;
};

// ✅ Safe ID generator (works on mobile too)
const makeId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

/* ----------------------------- keymap ---------------------------- */
const KEYMAP = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
  { name: "interact", keys: ["KeyE", "Enter"] },
];

const HDRI_ON_ICON = "/icon/sun.svg";
const HDRI_OFF_ICON = "/icon/moon.svg";

/* ----------------------------- paintings ------------------------- */
const PAINTINGS = [
  {
    id: "p1",
    title: "Sportbit",
    img: asset("/gallery/sport.jpg"),
    position: [-9.9, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    desc: "SportBit is an advanced AI-powered sports management system built to revolutionize how sports organizations operate. It offers an integrated platform for players, managers, clubs, and administrators to manage data, performance, and communication efficiently. Using artificial intelligence, SportBit provides predictive analytics, performance insights, and talent evaluation to help teams make smarter decisions. The system includes features like personalized dashboards, performance tracking, video analysis, and player profile management. It also simplifies administrative tasks such as scheduling, reporting, and communication. Designed with scalability in mind, SportBit caters to both amateur and professional levels of sports management. By combining technology and sports intelligence, it bridges the gap between athletic potential and data-driven performance optimization.",
  },
  {
    id: "p2",
    title: "F&B",
    img: asset("/gallery/art.jpg"),
    position: [-3.4, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    desc: "The F&B Restaurant Management System is an intelligent platform designed to streamline restaurant operations through automation and centralized control. It enables efficient management of orders, billing, inventory, and staff while improving kitchen workflows and customer service. With features like digital menus, real-time order tracking, and sales analytics, it helps optimize performance and reduce operational errors. Suitable for cafés, restaurants, and large F&B chains, the system enhances efficiency, profitability, and customer satisfaction through data-driven insights and seamless coordination.",
  },
  {
    id: "p3",
    title: "Tour Guide",
    img: asset("/gallery/mgmt.jpg"),
    position: [3.2, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    desc: "The AI Tour Guide Platform is an intelligent travel companion designed to enhance the touring experience through real-time, personalized guidance. It uses artificial intelligence to provide curated itineraries, location-based recommendations, and interactive voice or chat assistance. The platform helps travelers explore destinations efficiently by suggesting nearby attractions, dining options, and cultural insights. With smart navigation and multilingual support, the AI Tour Guide makes travel more convenient, engaging, and informative for users across the globe.",
  },
  {
    id: "p4",
    title: "EEC",
    img: asset("/gallery/restora.jpg"),
    position: [9.2, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    desc: "Electronic Educare is an AI-powered learning management system designed to revolutionize digital education through intelligent automation and personalization. It offers an interactive platform for students, teachers, and institutions to manage courses, track progress, and enhance learning outcomes. Using artificial intelligence, it provides personalized study plans, performance analytics, and adaptive assessments to cater to each learner's needs. The system also supports live classes, assignments, and real-time feedback, making education more engaging, efficient, and accessible for all users.",
  },
  {
    id: "p5",
    title: "Yarrowtech",
    img: asset("/gallery/shop.jpg"),
    position: [9.8, 3.6, -3.9],
    rotation: [0, Math.PI * 2, 0],
    size: [3.2, 4],
    desc: "YarrowTech is a modern technology service company specializing in building high-quality web applications, software solutions, and digital platforms. It offers end-to-end services including UI/UX design, web and mobile app development, and system integration tailored to client needs. With a focus on innovation, scalability, and performance, YarrowTech helps businesses establish a strong digital presence. The company's mission is to deliver reliable, cutting-edge solutions that drive growth and transform ideas into impactful digital experiences.",
  },
  {
    id: "p6",
    title: "ArtBlock",
    img: asset("/gallery/tour.jpg"),
    position: [3.2, 3.6, -3.9],
    rotation: [0, Math.PI * 2, 0],
    size: [3.2, 4],
    desc: "ArtBlock is a creative service platform designed for artists to share, showcase, and discover artwork from around the world. It provides a vibrant digital space where creators can upload their art, connect with audiences, and collaborate with other artists. The platform supports various art forms — from digital illustrations to traditional paintings — promoting creativity and community engagement. With features like artist profiles, feedback systems, and curated galleries, ArtBlock empowers artists to gain visibility, inspiration, and opportunities in the global art ecosystem.",
  },
  {
    id: "p7",
    title: "Police & Fire management system",
    img: asset("/gallery/sport.jpg"),
    position: [-3.4, 3.6, -3.9],
    rotation: [0, Math.PI * 2, 0],
    size: [3.2, 4],
    desc: "The Police and Fire Management System is an integrated digital platform designed to streamline emergency response and public safety operations. It enables efficient coordination between police, fire, and rescue departments through real-time communication and data sharing. The system manages incident reporting, resource allocation, and personnel tracking to ensure quick and effective responses. With features like live alerts, analytics, and case management, it enhances operational efficiency, accountability, and overall community safety.",
  },
  {
    id: "p8",
    title: "RMS",
    img: asset("/gallery/mgmt.jpg"),
    position: [-9.9, 3.6, -3.9],
    rotation: [0, Math.PI * 2, 0],
    size: [3.2, 4],
    desc: "The Retail Management System (RMS) is a comprehensive solution designed to simplify and automate retail operations. It enables businesses to efficiently manage sales, inventory, billing, and customer relationships from a single platform. With built-in analytics and reporting tools, RMS helps retailers track performance, forecast demand, and make data-driven decisions. The system improves operational efficiency, reduces manual errors, and enhances the overall shopping experience for both customers and store managers",
  },
];

/* ----------------------------- tuning ---------------------------- */
const SPEED = 8.4;
const SPRINT = 3.8;
const JUMP = 14.5;
const PLAYER_HEIGHT = 3.35;
const PLAYER_RADIUS = 0.35;

/* =========================== Scene =============================== */
function BalconyScene({ onSpawn }) {
  const { scene } = useGLTF("/models/gallery10.glb");

  useEffect(() => {
    const spawn =
      scene.getObjectByName("SpawnPoint") ||
      scene.getObjectByName("spawn") ||
      scene.getObjectByName("Start");

    if (spawn && onSpawn) {
      const w = new THREE.Vector3();
      spawn.getWorldPosition(w);
      const halfHeight = PLAYER_HEIGHT / 2 - PLAYER_RADIUS;
      const centerY = w.y + halfHeight + PLAYER_RADIUS;
      onSpawn([w.x, centerY, w.z]);
    } else if (onSpawn) {
      onSpawn([0, PLAYER_HEIGHT / 2, 3]);
    }

    scene.traverse((o) => {
      if (o.isLight) o.castShadow = true;

      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;

        const mat = o.material;
        if (mat) {
          // ⭐ PBR tuning for more realistic response
          if ("metalness" in mat) mat.metalness = Math.min(mat.metalness ?? 0.1, 0.3);
          if ("roughness" in mat) mat.roughness = Math.max(mat.roughness ?? 0.4, 0.25);
          if ("envMapIntensity" in mat) mat.envMapIntensity = 1.3;

          mat.needsUpdate = true;
        }
      }
    });

  }, [scene, onSpawn]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} />
    </RigidBody>
  );
}

/* ========================= Player ================================ */
function Player({ spawn = [0, 1.2, 3], mobileInput, isTouchDevice, lookRef }) {
  const { camera } = useThree();
  const bodyRef = useRef();
  const [, get] = useKeyboardControls();

  const forward = useRef(new THREE.Vector3()).current;
  const right = useRef(new THREE.Vector3()).current;
  const dir = useRef(new THREE.Vector3()).current;

  useEffect(() => {
    camera.position.set(
      spawn[0],
      spawn[1] + PLAYER_HEIGHT / 2 - PLAYER_RADIUS,
      spawn[2]
    );

    // init yaw/pitch for mobile from camera
    if (isTouchDevice && lookRef?.current) {
      lookRef.current.yaw = camera.rotation.y;
      lookRef.current.pitch = camera.rotation.x;
      lookRef.current.ready = true;
    }
  }, [camera, spawn, isTouchDevice, lookRef]);

  useFrame(() => {
    const rb = bodyRef.current;
    if (!rb) return;

    // 🔁 On mobile, apply yaw/pitch from lookRef to camera
    if (isTouchDevice && lookRef?.current?.ready) {
      const { yaw, pitch } = lookRef.current;
      camera.rotation.set(pitch, yaw, 0);
    }

    const pressed = get();
    const m = mobileInput || {};

    const forwardPressed = pressed.forward || m.forward;
    const backwardPressed = pressed.backward || m.backward;
    const leftPressed = pressed.left || m.left;
    const rightPressed = pressed.right || m.right;
    const jumpPressed = pressed.jump || m.jump;
    const sprintPressed = pressed.sprint || m.sprint;

    const base = sprintPressed ? SPEED * SPRINT : SPEED;

    // movement direction always from camera orientation
    forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    dir.set(0, 0, 0);
    if (forwardPressed) dir.add(forward);
    if (backwardPressed) dir.add(forward.clone().negate());
    if (leftPressed) dir.add(right.clone().negate());
    if (rightPressed) dir.add(right);

    if (dir.lengthSq() > 0) dir.normalize().multiplyScalar(base);

    const lv = rb.linvel();
    rb.setLinvel({ x: dir.x, y: lv.y, z: dir.z }, true);

    if (jumpPressed && Math.abs(lv.y) < 0.05) {
      rb.applyImpulse({ x: 0, y: JUMP, z: 0 }, true);
    }

    const t = rb.translation();
    camera.position.set(
      t.x,
      t.y + PLAYER_HEIGHT / 2 - PLAYER_RADIUS,
      t.z
    );
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={[...spawn]}
      colliders={false}
      enabledRotations={[false, false, false]}
      mass={1}
      friction={0.2}
      restitution={0}
      linearDamping={0.05}
      canSleep={false}
    >
      <CapsuleCollider
        args={[PLAYER_HEIGHT / 2 - PLAYER_RADIUS, PLAYER_RADIUS]}
      />
    </RigidBody>
  );
}

/* ========================= Paintings ============================= */
function Painting({ id, title, img, position, rotation, size, desc }) {
  const tex = useTexture(img);
  useEffect(() => {
    if (!tex) return;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  }, [tex]);

  const planeRef = useRef();
  const [aimed, setAimed] = useState(false);
  useCursor(aimed);

  useEffect(() => {
    if (planeRef.current) {
      planeRef.current.userData.isPainting = true;
      planeRef.current.userData.paintingMeta = { id, title, img, desc };
    }
  }, [id, title, img, desc]);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
        <boxGeometry args={[size[0] + 0.08, size[1] + 0.08, 0.06]} />
        <meshStandardMaterial metalness={0} roughness={0} color="#00000008" />
      </mesh>

      <mesh
        ref={planeRef}
        castShadow={false}
        receiveShadow={false}
        position={[0, 0, 0.012]}
        onPointerOver={() => setAimed(true)}
        onPointerOut={() => setAimed(false)}
      >
        <planeGeometry args={size} />
        <meshStandardMaterial
          map={tex}
          roughness={0.12}
          metalness={0}
          toneMapped
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {aimed && (
        <mesh position={[0, 0, 0.01]} renderOrder={999}>
          <planeGeometry args={[size[0] + 0.04, size[1] + 0.04]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.14}
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}

      <Html
        position={[0, -size[1] * 0.65, 0]}
        center
        style={{
          padding: "8px 10px",
          borderRadius: 10,
          background: "rgba(255, 252, 255, 0.29)",
          color: "#000",
          fontSize: 13,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          fontWeight: "bold",
        }}
      >
        {title} • Press <b>E</b> / Click
      </Html>
    </group>
  );
}

function PaintingsManager({
  config,
  onOpen,
  maxDistance = 8,
  pointerLocked = false,
}) {
  const groupRef = useRef();
  const ray = useRef(new THREE.Raycaster()).current;
  const { camera } = useThree();
  const [, get] = useKeyboardControls();
  const ndc = useRef(new THREE.Vector2(0, 0)).current;

  useFrame(() => {
    const pressed = get();
    if (!pressed.interact) return;
    if (!pointerLocked) return;

    ray.setFromCamera(ndc, camera);
    const root = groupRef.current?.children ?? [];
    const hits = ray.intersectObjects(root, true);
    const h = hits.find(
      (x) => x.object?.userData?.isPainting && x.distance <= maxDistance
    );
    if (h?.object?.userData?.paintingMeta)
      onOpen?.(h.object.userData.paintingMeta);
  });

  useEffect(() => {
    const handleTryOpen = (e) => {
      if (!pointerLocked) return;
      if (e.type === "mousedown" && e.button !== 0) return;

      ray.setFromCamera(ndc, camera);
      const root = groupRef.current?.children ?? [];
      const hits = ray.intersectObjects(root, true);
      const h = hits.find(
        (x) => x.object?.userData?.isPainting && x.distance <= maxDistance
      );
      if (h?.object?.userData?.paintingMeta)
        onOpen?.(h.object.userData.paintingMeta);
    };

    window.addEventListener("mousedown", handleTryOpen);
    window.addEventListener("pointerdown", handleTryOpen);
    window.addEventListener("touchstart", handleTryOpen, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleTryOpen);
      window.removeEventListener("pointerdown", handleTryOpen);
      window.removeEventListener("touchstart", handleTryOpen);
    };
  }, [camera, ray, maxDistance, onOpen, pointerLocked, ndc]);

  return (
    <group ref={groupRef}>
      {config.map((p) => (
        <Painting key={p.id} {...p} />
      ))}
    </group>
  );
}

function WorldBounds() {
  const halfX = 12;
  const halfY = 6;
  const halfZ = 8;
  const thick = 0.25;

  return (
    <RigidBody type="fixed">
      <CuboidCollider args={[halfX, thick, halfZ]} position={[0, -thick, 0]} />
      <CuboidCollider
        args={[halfX, thick, halfZ]}
        position={[0, 2 * halfY + thick, 0]}
      />
      <CuboidCollider
        args={[thick, halfY, halfZ]}
        position={[-halfX - thick, halfY, 0]}
      />
      <CuboidCollider
        args={[thick, halfY, halfZ]}
        position={[halfX + thick, halfY, 0]}
      />
      <CuboidCollider
        args={[halfX, halfY, thick]}
        position={[0, halfY, -halfZ - thick]}
      />
      <CuboidCollider
        args={[halfX, halfY, thick]}
        position={[0, halfY, halfZ + thick]}
      />
    </RigidBody>
  );
}

/* ===================== Ball + Shooter ======================= */
const MAX_BALLS = 60;
const BALL_RADIUS = 0.18;
const BALL_POWER = 10;
const BALL_SPAWN_OFFSET = 0.6;
const BALL_TTL_MS = 20000;

function Ball({ id, position, velocity, onExpire }) {
  const ref = useRef();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const rb = ref.current;
    if (!rb || hasInitialized.current) return;

    hasInitialized.current = true;

    // Interpret `velocity` as an impulse vector
    const [ix, iy, iz] = velocity;
    rb.applyImpulse({ x: ix, y: iy, z: iz }, true);

    const timer = setTimeout(() => onExpire?.(id), BALL_TTL_MS);
    return () => clearTimeout(timer);
  }, [id, velocity, onExpire]);

  return (
    <RigidBody
      ref={ref}
      position={position}
      colliders={false}           // don't auto-generate from mesh
      restitution={0.35}
      friction={0.6}
      linearDamping={0.12}        // a bit more drag so they slow down
      angularDamping={0.08}
      canSleep={true}
      ccd={true}
      mass={0.25}
      gravityScale={1}            // explicit, just for clarity
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[BALL_RADIUS, 24, 24]} />
        <meshStandardMaterial
          roughness={0.35}
          metalness={0.05}
          color="#f5f5f5"
        />
      </mesh>
      <BallCollider
        args={[BALL_RADIUS]}
        restitution={0.25}
        friction={0.35}
      />
    </RigidBody>
  );
}


function Shooter({ pointerLocked, addBall }) {
  const { camera } = useThree();
  const dir = useRef(new THREE.Vector3()).current;

  useEffect(() => {
    const onFire = (e) => {
      if (!pointerLocked) return;
      if (e.type === "mousedown" && e.button !== 0) return;

      // Get forward direction from camera
      camera.getWorldDirection(dir);
      dir.normalize();

      // Spawn a bit in front of the camera
      const spawn = new THREE.Vector3()
        .copy(camera.position)
        .add(dir.clone().multiplyScalar(BALL_SPAWN_OFFSET));

      // Treat this as an impulse, not velocity
      const impulse = dir.clone().multiplyScalar(BALL_POWER);

      addBall({
        id: makeId(),
        position: [spawn.x, spawn.y, spawn.z],
        velocity: [impulse.x, impulse.y, impulse.z], // now used as impulse
      });
    };

    window.addEventListener("mousedown", onFire);
    return () => window.removeEventListener("mousedown", onFire);
  }, [camera, pointerLocked, addBall, dir]);

  return null;
}


/* ================== Pointer lock bridge ========================== */
function LockBridge({ plcRef, setLocked }) {
  useEffect(() => {
    const plc = plcRef.current;
    if (!plc) return;
    const onLock = () => setLocked(true);
    const onUnlock = () => setLocked(false);
    plc.addEventListener("lock", onLock);
    plc.addEventListener("unlock", onUnlock);
    return () => {
      plc.removeEventListener("lock", onLock);
      plc.removeEventListener("unlock", onUnlock);
    };
  }, [plcRef, setLocked]);
  return null;
}

/* ===================== Mobile Touch Look ======================= */
function TouchLook({ enabled, lookRef }) {
  const { gl } = useThree();
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    if (!lookRef?.current) return;

    const element = gl.domElement;
    const sensitivity = 0.003;
    const PI_2 = Math.PI / 2;

    const onPointerDown = (e) => {
      dragging.current = true;
      last.current.x = e.clientX;
      last.current.y = e.clientY;
    };

    const onPointerMove = (e) => {
      if (!dragging.current) return;
      if (!lookRef.current) return;

      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current.x = e.clientX;
      last.current.y = e.clientY;

      let { yaw, pitch } = lookRef.current;

      yaw -= dx * sensitivity;   // left/right
      pitch -= dy * sensitivity; // up/down

      // clamp vertical look
      pitch = Math.max(-PI_2 + 0.1, Math.min(PI_2 - 0.1, pitch));

      lookRef.current.yaw = yaw;
      lookRef.current.pitch = pitch;
      lookRef.current.ready = true;
    };

    const onPointerUp = () => {
      dragging.current = false;
    };

    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [enabled, gl, lookRef]);

  return null;
}


/* ===================== Mobile HUD ======================= */
function HudButton({ label, ...events }) {
  return (
    <button
      {...events}
      style={{
        width: 52,
        height: 52,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.4)",
        background: "rgba(0,0,0,0.55)",
        color: "#fff",
        fontSize: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
    >
      {label}
    </button>
  );
}

function MobileHUD({ setInput }) {
  if (!setInput) return null;

  const update = (name, value) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const makeHandlers = (name) => {
    const start = (e) => {
      e.preventDefault();
      e.stopPropagation();
      update(name, true);
    };
    const end = (e) => {
      e.preventDefault();
      e.stopPropagation();
      update(name, false);
    };
    return {
      onTouchStart: start,
      onTouchEnd: end,
      onTouchCancel: end,
      onMouseDown: start,
      onMouseUp: end,
      onMouseLeave: end,
    };
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        left: 0,
        right: 0,
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      {/* Left – movement pad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          pointerEvents: "auto",
        }}
      >
        <div />
        <HudButton label="▲" {...makeHandlers("forward")} />
        <div />
        <HudButton label="◀" {...makeHandlers("left")} />
        <HudButton label="▼" {...makeHandlers("backward")} />
        <HudButton label="▶" {...makeHandlers("right")} />
      </div>

      {/* Right – jump */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: "auto",
          alignItems: "flex-end",
        }}
      >
        <HudButton label="⤒" {...makeHandlers("jump")} />
      </div>
    </div>
  );
}

/* ============================ Page =============================== */
export default function GalleryPage() {
  const [locked, setLocked] = useState(false);
  const [spawn, setSpawn] = useState(null);
  const [active, setActive] = useState(null);
  const plcRef = useRef();
  const navigate = useNavigate();

  const [envEnabled, setEnvEnabled] = useState(true);
  const [balls, setBalls] = useState([]);

  // 📱 detect touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mobileInput, setMobileInput] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  });

  // ✅ shared look state for mobile (yaw/pitch)
  const lookRef = useRef({
    yaw: 0,
    pitch: 0,
    ready: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isCoarsePointer =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    const isSmallScreen = window.innerWidth < 768;

    setIsTouchDevice(isCoarsePointer || isSmallScreen);
  }, []);

  const addBall = (b) =>
    setBalls((prev) => {
      const next = [...prev, { ...b, createdAt: performance.now() }];
      if (next.length > MAX_BALLS) next.splice(0, next.length - MAX_BALLS);
      return next;
    });

  const removeBall = (id) =>
    setBalls((prev) => prev.filter((x) => x.id !== id));

  // H key toggles environment
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "h" || e.key === "H") {
        setEnvEnabled((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // clear old balls
  useEffect(() => {
    const tick = setInterval(() => {
      const now = performance.now();
      setBalls((prev) => prev.filter((b) => now - b.createdAt < BALL_TTL_MS));
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  return (
    <>
      {/* Desktop pointer-lock gate */}
      {!isTouchDevice && !locked && (
        <button
          onClick={() => plcRef.current?.lock()}
          style={{
            position: "fixed",
            inset: 0,
            margin: "auto",
            width: 280,
            height: 120,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 106,
            fontSize: 16,
            backdropFilter: "blur(4px)",
            zIndex: 30,
          }}
        >
          Click to enter • WASD / Shift / Space • Click to shoot • H for
          Day/Night
        </button>
      )}

      {/* Small helper text for mobile */}
      {isTouchDevice && (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            fontSize: 11,
            zIndex: 35,
            backdropFilter: "blur(6px)",
          }}
        >
          Drag to look around • use buttons below to move
        </div>
      )}

      {/* HDRI toggle button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEnvEnabled((v) => !v);
        }}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          width: 46,
          height: 46,
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.4)",
          background: "rgba(255, 255, 255, 0.24)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
          backdropFilter: "blur(8px)",
          zIndex: 9999,
          cursor: "pointer",
          pointerEvents: "auto",
        }}
        aria-label={envEnabled ? "Turn HDRI off" : "Turn HDRI on"}
      >
        <img
          src={envEnabled ? HDRI_ON_ICON : HDRI_OFF_ICON}
          alt={envEnabled ? "HDRI On" : "HDRI Off"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            filter: "drop-shadow(0 0 4px rgba(0,0,0,0.6))",
          }}
        />
      </button>

      {/* Crosshair – desktop only */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 8,
          height: 8,
          border: "2px solid rgba(255,255,255,0.8)",
          borderRadius: 9999,
          backgroundColor: "rgba(255, 255, 255, 1)",
          pointerEvents: "none",
          opacity: !isTouchDevice && locked ? 1 : 0,
          zIndex: 20,
        }}
      />

      {/* 🕹 Mobile HUD joystick */}
      {isTouchDevice && <MobileHUD setInput={setMobileInput} />}

      {/* Painting modal */}
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "grid",
            placeItems: "center",
            background: "rgba(0, 0, 0, 0.63)",
            transition: "background 160ms ease",
          }}
          onClick={() => setActive(null)}
        >
          <div
            className="modalCard"
            style={{
              background: "#ffffff4c",
              backdropFilter: "blur(104px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 50,
              padding: 16,
              width: "min(56vw, 960px)",
              maxHeight: "86vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "16px 24px" }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
                {active.title}
              </h2>
              <img
                src={active.img}
                alt={active.title}
                style={{
                  width: "100%",
                  borderRadius: 24,
                  marginBottom: 16,
                }}
              />
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#333" }}>
                {active.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      <KeyboardControls map={KEYMAP}>
        <Canvas
          style={{
            width: "100vw",
            height: "100vh",
            display: "block",
            position: "relative",
            zIndex: 1,
            touchAction: "none",
          }}
          // gl={{
          //   antialias: true,
          //   alpha: true,
          //   premultipliedAlpha: true,
          //   physicallyCorrectLights: true,
          //   outputColorSpace: THREE.SRGBColorSpace,
          // }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor("#050509", 1);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.2;
            gl.outputColorSpace = THREE.SRGBColorSpace;

            gl.physicallyCorrectLights = true;
            if ("useLegacyLights" in gl) gl.useLegacyLights = false;


            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.fog = new THREE.FogExp2("#0c0c12", 0.012);
          }}
          camera={{ fov: 68, near: 0.1, far: 200 }}
        >
          <SoftShadows size={25} samples={24} focus={0.7} />
          <ambientLight intensity={0.18} color="#d9e1ff" />
          <directionalLight
            position={[6, 10, 4]}
            intensity={2.2}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0002}
            shadow-normalBias={0.02}
          />
          <directionalLight
            position={[-6, 4, -4]}
            intensity={0.8}
            color="#89a4ff"
          />
          <directionalLight
            position={[0, 5, -8]}
            intensity={0.6}
            color="#ffddb0"
          />

          <EnvironmentController enabled={envEnabled} />

          <RapierReady>
            <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} substeps={2}>
              <Suspense
                fallback={
                  <Html center style={{ color: "#fff" }}>
                    Loading…
                  </Html>
                }
              >
                <BalconyScene onSpawn={setSpawn} />
              </Suspense>

              <ContactShadows
                position={[0, 0.01, 0]}
                opacity={0.55}
                scale={40}
                blur={3.1}
                far={22}
                resolution={1024}
              />


              <PaintingsManager
                config={PAINTINGS}
                onOpen={setActive}
                maxDistance={8}
                pointerLocked={locked && !isTouchDevice}
              />

              {spawn && (
                <Player
                  spawn={spawn}
                  mobileInput={isTouchDevice ? mobileInput : null}
                  isTouchDevice={isTouchDevice}
                  lookRef={lookRef}
                />
              )}


              {/* Shooting only on desktop when locked & no modal */}
              <Shooter
                pointerLocked={!isTouchDevice && locked && !active}
                addBall={addBall}
              />

              {balls.map((b) => (
                <Ball
                  key={b.id}
                  id={b.id}
                  position={b.position}
                  velocity={b.velocity}
                  onExpire={removeBall}
                />
              ))}
            </Physics>
          </RapierReady>

          {/* Desktop: pointer lock */}
          {!isTouchDevice && <PointerLockControls ref={plcRef} />}
          {!isTouchDevice && (
            <LockBridge plcRef={plcRef} setLocked={setLocked} />
          )}

          {/* Mobile: drag-to-look */}
          {isTouchDevice && <TouchLook enabled={true} lookRef={lookRef} />}
          <EffectComposer>
  <Bloom
    intensity={0.4}
    mipmapBlur
    luminanceThreshold={0.9}
    luminanceSmoothing={0.3}
    blendFunction={BlendFunction.SCREEN}
  />
</EffectComposer>


        </Canvas>
      </KeyboardControls>
    </>
  );
}

useGLTF.preload("/models/gallery10.glb");
