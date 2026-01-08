




































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
//   SoftShadows,
// } from "@react-three/drei";
// import {
//   Physics,
//   RigidBody,
//   CapsuleCollider,
//   BallCollider,
//   CuboidCollider,
// } from "@react-three/rapier";
// import * as THREE from "three";
// import { useNavigate } from "react-router-dom";
// import RapierReady from "./RapierReady.jsx";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import { BlendFunction } from "postprocessing";


// /* ========= ✅ Environment Controller ========= */
// function EnvironmentController({ enabled }) {
//   const { scene } = useThree();

//   useEffect(() => {
//     if (!enabled) {
//       scene.environment = null;
//       scene.background = new THREE.Color("#0b0b12");
//     }
//   }, [enabled, scene]);

//   return enabled ? (
//     <Environment
//       files="/hdr/alps.hdr"
//       background
//       blur={0}          // ⭐ softer, GI-like reflections
//     />
//   ) : null;
// }

// /* ----------------------------- utils ----------------------------- */
// const asset = (p) => {
//   const base = (import.meta.env?.BASE_URL ?? "/").replace(/\/+$/, "");
//   const rel = String(p).replace(/^\/+/, "");
//   return `${base}/${rel}`;
// };

// // ✅ Safe ID generator (works on mobile too)
// const makeId = () => {
//   if (
//     typeof crypto !== "undefined" &&
//     typeof crypto.randomUUID === "function"
//   ) {
//     return crypto.randomUUID();
//   }
//   return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
//     desc: "Electronic Educare is an AI-powered learning management system designed to revolutionize digital education through intelligent automation and personalization. It offers an interactive platform for students, teachers, and institutions to manage courses, track progress, and enhance learning outcomes. Using artificial intelligence, it provides personalized study plans, performance analytics, and adaptive assessments to cater to each learner's needs. The system also supports live classes, assignments, and real-time feedback, making education more engaging, efficient, and accessible for all users.",
//   },
//   {
//     id: "p5",
//     title: "Yarrowtech",
//     img: asset("/gallery/shop.jpg"),
//     position: [9.8, 3.6, -3.9],
//     rotation: [0, Math.PI * 2, 0],
//     size: [3.2, 4],
//     desc: "YarrowTech is a modern technology service company specializing in building high-quality web applications, software solutions, and digital platforms. It offers end-to-end services including UI/UX design, web and mobile app development, and system integration tailored to client needs. With a focus on innovation, scalability, and performance, YarrowTech helps businesses establish a strong digital presence. The company's mission is to deliver reliable, cutting-edge solutions that drive growth and transform ideas into impactful digital experiences.",
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
// const SPEED = 8.4;
// const SPRINT = 3.8;
// const JUMP = 14.5;
// const PLAYER_HEIGHT = 3.35;
// const PLAYER_RADIUS = 0.35;

// /* =========================== Scene =============================== */
// function BalconyScene({ onSpawn }) {
//   const { scene } = useGLTF("/models/gallery4.compressed.glb");

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

//         const mat = o.material;
//         if (mat) {
//           // ⭐ PBR tuning for more realistic response
//           if ("metalness" in mat) mat.metalness = Math.min(mat.metalness ?? 0.1, 0.3);
//           if ("roughness" in mat) mat.roughness = Math.max(mat.roughness ?? 0.4, 0.25);
//           if ("envMapIntensity" in mat) mat.envMapIntensity = 1.3;

//           mat.needsUpdate = true;
//         }
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
// function Player({ spawn = [0, 1.2, 3], mobileInput, isTouchDevice, lookRef }) {
//   const { camera } = useThree();
//   const bodyRef = useRef();
//   const [, get] = useKeyboardControls();

//   const forward = useRef(new THREE.Vector3()).current;
//   const right = useRef(new THREE.Vector3()).current;
//   const dir = useRef(new THREE.Vector3()).current;

//   useEffect(() => {
//     camera.position.set(
//       spawn[0],
//       spawn[1] + PLAYER_HEIGHT / 2 - PLAYER_RADIUS,
//       spawn[2]
//     );

//     // init yaw/pitch for mobile from camera
//     if (isTouchDevice && lookRef?.current) {
//       lookRef.current.yaw = camera.rotation.y;
//       lookRef.current.pitch = camera.rotation.x;
//       lookRef.current.ready = true;
//     }
//   }, [camera, spawn, isTouchDevice, lookRef]);

//   useFrame(() => {
//     const rb = bodyRef.current;
//     if (!rb) return;

//     // 🔁 On mobile, apply yaw/pitch from lookRef to camera
//     if (isTouchDevice && lookRef?.current?.ready) {
//       const { yaw, pitch } = lookRef.current;
//       camera.rotation.set(pitch, yaw, 0);
//     }

//     const pressed = get();
//     const m = mobileInput || {};

//     const forwardPressed = pressed.forward || m.forward;
//     const backwardPressed = pressed.backward || m.backward;
//     const leftPressed = pressed.left || m.left;
//     const rightPressed = pressed.right || m.right;
//     const jumpPressed = pressed.jump || m.jump;
//     const sprintPressed = pressed.sprint || m.sprint;

//     const base = sprintPressed ? SPEED * SPRINT : SPEED;

//     // movement direction always from camera orientation
//     forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
//     forward.y = 0;
//     forward.normalize();

//     right.set(1, 0, 0).applyQuaternion(camera.quaternion);
//     right.y = 0;
//     right.normalize();

//     dir.set(0, 0, 0);
//     if (forwardPressed) dir.add(forward);
//     if (backwardPressed) dir.add(forward.clone().negate());
//     if (leftPressed) dir.add(right.clone().negate());
//     if (rightPressed) dir.add(right);

//     if (dir.lengthSq() > 0) dir.normalize().multiplyScalar(base);

//     const lv = rb.linvel();
//     rb.setLinvel({ x: dir.x, y: lv.y, z: dir.z }, true);

//     if (jumpPressed && Math.abs(lv.y) < 0.05) {
//       rb.applyImpulse({ x: 0, y: JUMP, z: 0 }, true);
//     }

//     const t = rb.translation();
//     camera.position.set(
//       t.x,
//       t.y + PLAYER_HEIGHT / 2 - PLAYER_RADIUS,
//       t.z
//     );
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
//       <CapsuleCollider
//         args={[PLAYER_HEIGHT / 2 - PLAYER_RADIUS, PLAYER_RADIUS]}
//       />
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

// function PaintingsManager({
//   config,
//   onOpen,
//   maxDistance = 8,
//   pointerLocked = false,
// }) {
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
//     const h = hits.find(
//       (x) => x.object?.userData?.isPainting && x.distance <= maxDistance
//     );
//     if (h?.object?.userData?.paintingMeta)
//       onOpen?.(h.object.userData.paintingMeta);
//   });

//   useEffect(() => {
//     const handleTryOpen = (e) => {
//       if (!pointerLocked) return;
//       if (e.type === "mousedown" && e.button !== 0) return;

//       ray.setFromCamera(ndc, camera);
//       const root = groupRef.current?.children ?? [];
//       const hits = ray.intersectObjects(root, true);
//       const h = hits.find(
//         (x) => x.object?.userData?.isPainting && x.distance <= maxDistance
//       );
//       if (h?.object?.userData?.paintingMeta)
//         onOpen?.(h.object.userData.paintingMeta);
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
//       <CuboidCollider args={[halfX, thick, halfZ]} position={[0, -thick, 0]} />
//       <CuboidCollider
//         args={[halfX, thick, halfZ]}
//         position={[0, 2 * halfY + thick, 0]}
//       />
//       <CuboidCollider
//         args={[thick, halfY, halfZ]}
//         position={[-halfX - thick, halfY, 0]}
//       />
//       <CuboidCollider
//         args={[thick, halfY, halfZ]}
//         position={[halfX + thick, halfY, 0]}
//       />
//       <CuboidCollider
//         args={[halfX, halfY, thick]}
//         position={[0, halfY, -halfZ - thick]}
//       />
//       <CuboidCollider
//         args={[halfX, halfY, thick]}
//         position={[0, halfY, halfZ + thick]}
//       />
//     </RigidBody>
//   );
// }

// /* ===================== Ball + Shooter ======================= */
// const MAX_BALLS = 60;
// const BALL_RADIUS = 0.18;
// const BALL_POWER = 10;
// const BALL_SPAWN_OFFSET = 0.6;
// const BALL_TTL_MS = 20000;

// function Ball({ id, position, velocity, onExpire }) {
//   const ref = useRef();
//   const hasInitialized = useRef(false);

//   useEffect(() => {
//     const rb = ref.current;
//     if (!rb || hasInitialized.current) return;

//     hasInitialized.current = true;

//     // Interpret `velocity` as an impulse vector
//     const [ix, iy, iz] = velocity;
//     rb.applyImpulse({ x: ix, y: iy, z: iz }, true);

//     const timer = setTimeout(() => onExpire?.(id), BALL_TTL_MS);
//     return () => clearTimeout(timer);
//   }, [id, velocity, onExpire]);

//   return (
//     <RigidBody
//       ref={ref}
//       position={position}
//       colliders={false}           // don't auto-generate from mesh
//       restitution={0.35}
//       friction={0.6}
//       linearDamping={0.12}        // a bit more drag so they slow down
//       angularDamping={0.08}
//       canSleep={true}
//       ccd={true}
//       mass={0.25}
//       gravityScale={1}            // explicit, just for clarity
//     >
//       <mesh castShadow receiveShadow>
//         <sphereGeometry args={[BALL_RADIUS, 24, 24]} />
//         <meshStandardMaterial
//           roughness={0.35}
//           metalness={0.05}
//           color="#f5f5f5"
//         />
//       </mesh>
//       <BallCollider
//         args={[BALL_RADIUS]}
//         restitution={0.25}
//         friction={0.35}
//       />
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

//       // Get forward direction from camera
//       camera.getWorldDirection(dir);
//       dir.normalize();

//       // Spawn a bit in front of the camera
//       const spawn = new THREE.Vector3()
//         .copy(camera.position)
//         .add(dir.clone().multiplyScalar(BALL_SPAWN_OFFSET));

//       // Treat this as an impulse, not velocity
//       const impulse = dir.clone().multiplyScalar(BALL_POWER);

//       addBall({
//         id: makeId(),
//         position: [spawn.x, spawn.y, spawn.z],
//         velocity: [impulse.x, impulse.y, impulse.z], // now used as impulse
//       });
//     };

//     window.addEventListener("mousedown", onFire);
//     return () => window.removeEventListener("mousedown", onFire);
//   }, [camera, pointerLocked, addBall, dir]);

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

// /* ===================== Mobile Touch Look ======================= */
// function TouchLook({ enabled, lookRef }) {
//   const { gl } = useThree();
//   const dragging = useRef(false);
//   const last = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     if (!enabled) return;
//     if (!lookRef?.current) return;

//     const element = gl.domElement;
//     const sensitivity = 0.003;
//     const PI_2 = Math.PI / 2;

//     const onPointerDown = (e) => {
//       dragging.current = true;
//       last.current.x = e.clientX;
//       last.current.y = e.clientY;
//     };

//     const onPointerMove = (e) => {
//       if (!dragging.current) return;
//       if (!lookRef.current) return;

//       const dx = e.clientX - last.current.x;
//       const dy = e.clientY - last.current.y;
//       last.current.x = e.clientX;
//       last.current.y = e.clientY;

//       let { yaw, pitch } = lookRef.current;

//       yaw -= dx * sensitivity;   // left/right
//       pitch -= dy * sensitivity; // up/down

//       // clamp vertical look
//       pitch = Math.max(-PI_2 + 0.1, Math.min(PI_2 - 0.1, pitch));

//       lookRef.current.yaw = yaw;
//       lookRef.current.pitch = pitch;
//       lookRef.current.ready = true;
//     };

//     const onPointerUp = () => {
//       dragging.current = false;
//     };

//     element.addEventListener("pointerdown", onPointerDown);
//     window.addEventListener("pointermove", onPointerMove);
//     window.addEventListener("pointerup", onPointerUp);

//     return () => {
//       element.removeEventListener("pointerdown", onPointerDown);
//       window.removeEventListener("pointermove", onPointerMove);
//       window.removeEventListener("pointerup", onPointerUp);
//     };
//   }, [enabled, gl, lookRef]);

//   return null;
// }


// /* ===================== Mobile HUD ======================= */
// function HudButton({ label, ...events }) {
//   return (
//     <button
//       {...events}
//       style={{
//         width: 52,
//         height: 52,
//         borderRadius: 999,
//         border: "1px solid rgba(255,255,255,0.4)",
//         background: "rgba(0,0,0,0.55)",
//         color: "#fff",
//         fontSize: 22,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(8px)",
//         userSelect: "none",
//         WebkitUserSelect: "none",
//         touchAction: "none",
//       }}
//     >
//       {label}
//     </button>
//   );
// }

// function MobileHUD({ setInput }) {
//   if (!setInput) return null;

//   const update = (name, value) => {
//     setInput((prev) => ({ ...prev, [name]: value }));
//   };

//   const makeHandlers = (name) => {
//     const start = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       update(name, true);
//     };
//     const end = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       update(name, false);
//     };
//     return {
//       onTouchStart: start,
//       onTouchEnd: end,
//       onTouchCancel: end,
//       onMouseDown: start,
//       onMouseUp: end,
//       onMouseLeave: end,
//     };
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 90,
//         left: 0,
//         right: 0,
//         padding: "0 24px",
//         display: "flex",
//         justifyContent: "space-between",
//         pointerEvents: "none",
//         zIndex: 40,
//       }}
//     >
//       {/* Left – movement pad */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 1fr)",
//           gap: 8,
//           pointerEvents: "auto",
//         }}
//       >
//         <div />
//         <HudButton label="▲" {...makeHandlers("forward")} />
//         <div />
//         <HudButton label="◀" {...makeHandlers("left")} />
//         <HudButton label="▼" {...makeHandlers("backward")} />
//         <HudButton label="▶" {...makeHandlers("right")} />
//       </div>

//       {/* Right – jump */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 10,
//           pointerEvents: "auto",
//           alignItems: "flex-end",
//         }}
//       >
//         <HudButton label="⤒" {...makeHandlers("jump")} />
//       </div>
//     </div>
//   );
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

//   // 📱 detect touch devices
//   const [isTouchDevice, setIsTouchDevice] = useState(false);
//   const [mobileInput, setMobileInput] = useState({
//     forward: false,
//     backward: false,
//     left: false,
//     right: false,
//     jump: false,
//     sprint: false,
//   });

//   // ✅ shared look state for mobile (yaw/pitch)
//   const lookRef = useRef({
//     yaw: 0,
//     pitch: 0,
//     ready: false,
//   });

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const isCoarsePointer =
//       "ontouchstart" in window ||
//       navigator.maxTouchPoints > 0 ||
//       window.matchMedia("(pointer: coarse)").matches;

//     const isSmallScreen = window.innerWidth < 768;

//     setIsTouchDevice(isCoarsePointer || isSmallScreen);
//   }, []);

//   const addBall = (b) =>
//     setBalls((prev) => {
//       const next = [...prev, { ...b, createdAt: performance.now() }];
//       if (next.length > MAX_BALLS) next.splice(0, next.length - MAX_BALLS);
//       return next;
//     });

//   const removeBall = (id) =>
//     setBalls((prev) => prev.filter((x) => x.id !== id));

//   // H key toggles environment
//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === "h" || e.key === "H") {
//         setEnvEnabled((v) => !v);
//       }
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, []);

//   // clear old balls
//   useEffect(() => {
//     const tick = setInterval(() => {
//       const now = performance.now();
//       setBalls((prev) => prev.filter((b) => now - b.createdAt < BALL_TTL_MS));
//     }, 2000);
//     return () => clearInterval(tick);
//   }, []);

//   return (
//     <>
//       {/* Desktop pointer-lock gate */}
//       {!isTouchDevice && !locked && (
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
//           Click to enter • WASD / Shift / Space • Click to shoot • H for
//           Day/Night
//         </button>
//       )}

//       {/* Small helper text for mobile */}
//       {isTouchDevice && (
//         <div
//           style={{
//             position: "fixed",
//             top: 12,
//             left: "50%",
//             transform: "translateX(-50%)",
//             padding: "6px 12px",
//             borderRadius: 999,
//             background: "rgba(0,0,0,0.6)",
//             color: "#fff",
//             fontSize: 11,
//             zIndex: 35,
//             backdropFilter: "blur(6px)",
//           }}
//         >
//           Drag to look around • use buttons below to move
//         </div>
//       )}

//       {/* HDRI toggle button */}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           setEnvEnabled((v) => !v);
//         }}
//         style={{
//           position: "fixed",
//           bottom: 16,
//           right: 16,
//           width: 46,
//           height: 46,
//           borderRadius: "999px",
//           border: "1px solid rgba(255,255,255,0.4)",
//           background: "rgba(255, 255, 255, 0.24)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 6,
//           backdropFilter: "blur(8px)",
//           zIndex: 9999,
//           cursor: "pointer",
//           pointerEvents: "auto",
//         }}
//         aria-label={envEnabled ? "Turn HDRI off" : "Turn HDRI on"}
//       >
//         <img
//           src={envEnabled ? HDRI_ON_ICON : HDRI_OFF_ICON}
//           alt={envEnabled ? "HDRI On" : "HDRI Off"}
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "contain",
//             pointerEvents: "none",
//             filter: "drop-shadow(0 0 4px rgba(0,0,0,0.6))",
//           }}
//         />
//       </button>

//       {/* Crosshair – desktop only */}
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
//           opacity: !isTouchDevice && locked ? 1 : 0,
//           zIndex: 20,
//         }}
//       />

//       {/* 🕹 Mobile HUD joystick */}
//       {isTouchDevice && <MobileHUD setInput={setMobileInput} />}

//       {/* Painting modal */}
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
//             <div style={{ padding: "16px 24px" }}>
//               <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
//                 {active.title}
//               </h2>
//               <img
//                 src={active.img}
//                 alt={active.title}
//                 style={{
//                   width: "100%",
//                   borderRadius: 24,
//                   marginBottom: 16,
//                 }}
//               />
//               <p style={{ fontSize: 15, lineHeight: 1.7, color: "#333" }}>
//                 {active.desc}
//               </p>
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
//             touchAction: "none",
//           }}
//           // gl={{
//           //   antialias: true,
//           //   alpha: true,
//           //   premultipliedAlpha: true,
//           //   physicallyCorrectLights: true,
//           //   outputColorSpace: THREE.SRGBColorSpace,
//           // }}
//           onCreated={({ gl, scene }) => {
//             gl.setClearColor("#050509", 1);
//             gl.toneMapping = THREE.ACESFilmicToneMapping;
//             gl.toneMappingExposure = 1.2;
//             gl.outputColorSpace = THREE.SRGBColorSpace;

//             gl.physicallyCorrectLights = true;
//             if ("useLegacyLights" in gl) gl.useLegacyLights = false;


//             gl.shadowMap.enabled = true;
//             gl.shadowMap.type = THREE.PCFSoftShadowMap;
//             scene.fog = new THREE.FogExp2("#0c0c12", 0.012);
//           }}
//           camera={{ fov: 68, near: 0.1, far: 200 }}
//         >
//           <SoftShadows size={25} samples={24} focus={0.7} />
//           <ambientLight intensity={0.18} color="#d9e1ff" />
//           <directionalLight
//             position={[6, 10, 4]}
//             intensity={2.2}
//             color="#ffffff"
//             castShadow
//             shadow-mapSize-width={2048}
//             shadow-mapSize-height={2048}
//             shadow-bias={-0.0002}
//             shadow-normalBias={0.02}
//           />
//           <directionalLight
//             position={[-6, 4, -4]}
//             intensity={0.8}
//             color="#89a4ff"
//           />
//           <directionalLight
//             position={[0, 5, -8]}
//             intensity={0.6}
//             color="#ffddb0"
//           />

//           <EnvironmentController enabled={envEnabled} />

//           <RapierReady>
//             <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} substeps={2}>
//               <Suspense
//                 fallback={
//                   <Html center style={{ color: "#fff" }}>
//                     Loading…
//                   </Html>
//                 }
//               >
//                 <BalconyScene onSpawn={setSpawn} />
//               </Suspense>

//               <ContactShadows
//                 position={[0, 0.01, 0]}
//                 opacity={0.55}
//                 scale={40}
//                 blur={3.1}
//                 far={22}
//                 resolution={1024}
//               />


//               <PaintingsManager
//                 config={PAINTINGS}
//                 onOpen={setActive}
//                 maxDistance={8}
//                 pointerLocked={locked && !isTouchDevice}
//               />

//               {spawn && (
//                 <Player
//                   spawn={spawn}
//                   mobileInput={isTouchDevice ? mobileInput : null}
//                   isTouchDevice={isTouchDevice}
//                   lookRef={lookRef}
//                 />
//               )}


//               {/* Shooting only on desktop when locked & no modal */}
//               <Shooter
//                 pointerLocked={!isTouchDevice && locked && !active}
//                 addBall={addBall}
//               />

//               {balls.map((b) => (
//                 <Ball
//                   key={b.id}
//                   id={b.id}
//                   position={b.position}
//                   velocity={b.velocity}
//                   onExpire={removeBall}
//                 />
//               ))}
//             </Physics>
//           </RapierReady>

//           {/* Desktop: pointer lock */}
//           {!isTouchDevice && <PointerLockControls ref={plcRef} />}
//           {!isTouchDevice && (
//             <LockBridge plcRef={plcRef} setLocked={setLocked} />
//           )}

//           {/* Mobile: drag-to-look */}
//           {isTouchDevice && <TouchLook enabled={true} lookRef={lookRef} />}
//           <EffectComposer>
//   <Bloom
//     intensity={0.4}
//     mipmapBlur
//     luminanceThreshold={0.9}
//     luminanceSmoothing={0.3}
//     blendFunction={BlendFunction.SCREEN}
//   />
// </EffectComposer>


//         </Canvas>
//       </KeyboardControls>
//     </>
//   );
// }

// useGLTF.preload("/models/gallery4.compressed.glb");




















// -------------------------------------------------------------------------------------------------




































// cld optimised 

import React, { Suspense, useEffect, useRef, useState, useCallback, useMemo } from "react";
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
import { EffectComposer, Bloom, SSAO, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/* ========================================================================
   CONSTANTS & CONFIGURATION
   ======================================================================== */

// Player physics constants
const PLAYER_CONFIG = {
  speed: 8.4,
  sprintMultiplier: 3.8,
  jumpForce: 14.5,
  height: 3.35,
  radius: 0.35,
  mass: 1,
  friction: 0.2,
  linearDamping: 0.05,
};

// Ball shooting constants
const BALL_CONFIG = {
  maxCount: 60,
  radius: 0.18,
  shootPower: 10,
  spawnOffset: 0.6,
  lifetimeMs: 20000,
  mass: 0.25,
  restitution: 0.35,
  friction: 0.6,
  linearDamping: 0.12,
  angularDamping: 0.08,
};

// Interaction constants
const INTERACTION_CONFIG = {
  paintingMaxDistance: 8,
  crosshairSize: 8,
};

// Keyboard mapping
const KEYMAP = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
  { name: "interact", keys: ["KeyE", "Enter"] },
];

// Gallery content configuration
const PAINTINGS = [
  {
    id: "p1",
    title: "SportBit",
    img: "/gallery/sport.jpg",
    position: [-9.9, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    category: "AI Platform",
    desc: "SportBit is an advanced AI-powered sports management system built to revolutionize how sports organizations operate. It offers an integrated platform for players, managers, clubs, and administrators to manage data, performance, and communication efficiently. Using artificial intelligence, SportBit provides predictive analytics, performance insights, and talent evaluation to help teams make smarter decisions.",
  },
  {
    id: "p2",
    title: "F&B Management",
    img: "/gallery/art.jpg",
    position: [-3.4, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    category: "Restaurant Tech",
    desc: "The F&B Restaurant Management System is an intelligent platform designed to streamline restaurant operations through automation and centralized control. It enables efficient management of orders, billing, inventory, and staff while improving kitchen workflows and customer service.",
  },
  {
    id: "p3",
    title: "AI Tour Guide",
    img: "/gallery/mgmt.jpg",
    position: [3.2, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    category: "Travel Tech",
    desc: "The AI Tour Guide Platform is an intelligent travel companion designed to enhance the touring experience through real-time, personalized guidance. It uses artificial intelligence to provide curated itineraries, location-based recommendations, and interactive voice or chat assistance.",
  },
  {
    id: "p4",
    title: "Electronic Educare",
    img: "/gallery/restora.jpg",
    position: [9.2, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    category: "EdTech",
    desc: "Electronic Educare is an AI-powered learning management system designed to revolutionize digital education through intelligent automation and personalization. It offers an interactive platform for students, teachers, and institutions to manage courses, track progress, and enhance learning outcomes.",
  },
  {
    id: "p5",
    title: "YarrowTech",
    img: "/gallery/shop.jpg",
    position: [9.8, 3.6, -3.9],
    rotation: [0, 0, 0],
    size: [3.2, 4],
    category: "Tech Services",
    desc: "YarrowTech is a modern technology service company specializing in building high-quality web applications, software solutions, and digital platforms. It offers end-to-end services including UI/UX design, web and mobile app development, and system integration tailored to client needs.",
  },
  {
    id: "p6",
    title: "ArtBlock",
    img: "/gallery/tour.jpg",
    position: [3.2, 3.6, -3.9],
    rotation: [0, 0, 0],
    size: [3.2, 4],
    category: "Creative Platform",
    desc: "ArtBlock is a creative service platform designed for artists to share, showcase, and discover artwork from around the world. It provides a vibrant digital space where creators can upload their art, connect with audiences, and collaborate with other artists.",
  },
  {
    id: "p7",
    title: "Emergency Response System",
    img: "/gallery/sport.jpg",
    position: [-3.4, 3.6, -3.9],
    rotation: [0, 0, 0],
    size: [3.2, 4],
    category: "Public Safety",
    desc: "The Police and Fire Management System is an integrated digital platform designed to streamline emergency response and public safety operations. It enables efficient coordination between police, fire, and rescue departments through real-time communication and data sharing.",
  },
  {
    id: "p8",
    title: "Retail Management System",
    img: "/gallery/mgmt.jpg",
    position: [-9.9, 3.6, -3.9],
    rotation: [0, 0, 0],
    size: [3.2, 4],
    category: "Retail Tech",
    desc: "The Retail Management System (RMS) is a comprehensive solution designed to simplify and automate retail operations. It enables businesses to efficiently manage sales, inventory, billing, and customer relationships from a single platform.",
  },
];

/* ========================================================================
   UTILITY FUNCTIONS
   ======================================================================== */

/**
 * Safe asset path resolver that works with various base URLs
 */
const resolveAssetPath = (path) => {
  const base = (import.meta.env?.BASE_URL ?? "/").replace(/\/+$/, "");
  const relativePath = String(path).replace(/^\/+/, "");
  return `${base}/${relativePath}`;
};

/**
 * Generate unique IDs safely across all devices
 */
const generateUniqueId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Detect touch-capable devices
 */
const detectTouchDevice = () => {
  if (typeof window === "undefined") return false;
  
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  
  return hasTouch || isSmallScreen || isCoarsePointer;
};

/* ========================================================================
   ENVIRONMENT & LIGHTING
   ======================================================================== */

/**
 * Dynamic environment controller with smooth transitions
 */
function EnvironmentController({ enabled }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    if (!enabled) {
      scene.environment = null;
      scene.background = new THREE.Color("#0a0a12");
    }
  }, [enabled, scene]);

  return enabled ? (
    <Environment
      files="/hdr/alps.hdr"
      background
      blur={0}
      environmentIntensity={1.2}
    />
  ) : null;
}

/**
 * Advanced lighting setup with multiple light sources
 */
function LightingRig() {
  return (
    <>
      {/* Ambient base lighting */}
      <ambientLight intensity={0.2} color="#d9e5ff" />
      
      {/* Main directional light - key light */}
      <directionalLight
        position={[6, 10, 4]}
        intensity={2.4}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />
      
      {/* Fill light - cool tone */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={0.9}
        color="#89a4ff"
      />
      
      {/* Back light - warm accent */}
      <directionalLight
        position={[0, 5, -8]}
        intensity={0.7}
        color="#ffddb0"
      />
      
      {/* Rim light for depth */}
      <directionalLight
        position={[0, 2, 6]}
        intensity={0.4}
        color="#ffffff"
      />
    </>
  );
}

/* ========================================================================
   3D SCENE & ENVIRONMENT
   ======================================================================== */

/**
 * Main gallery scene loader with optimized materials
 */
function GalleryScene({ onSpawnPointFound }) {
  const { scene } = useGLTF("/models/gallery4.compressed.glb");

  useEffect(() => {
    // Find spawn point
    const spawnPoint =
      scene.getObjectByName("SpawnPoint") ||
      scene.getObjectByName("spawn") ||
      scene.getObjectByName("Start");

    if (spawnPoint && onSpawnPointFound) {
      const worldPos = new THREE.Vector3();
      spawnPoint.getWorldPosition(worldPos);
      
      const halfHeight = PLAYER_CONFIG.height / 2 - PLAYER_CONFIG.radius;
      const centerY = worldPos.y + halfHeight + PLAYER_CONFIG.radius;
      
      onSpawnPointFound([worldPos.x, centerY, worldPos.z]);
    } else if (onSpawnPointFound) {
      onSpawnPointFound([0, PLAYER_CONFIG.height / 2, 3]);
    }

    // Optimize scene materials and lighting
    scene.traverse((object) => {
      if (object.isLight) {
        object.castShadow = true;
      }

      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        const material = object.material;
        if (material) {
          // PBR material optimization
          if ("metalness" in material) {
            material.metalness = Math.min(material.metalness ?? 0.1, 0.3);
          }
          if ("roughness" in material) {
            material.roughness = Math.max(material.roughness ?? 0.4, 0.25);
          }
          if ("envMapIntensity" in material) {
            material.envMapIntensity = 1.4;
          }

          material.needsUpdate = true;
        }
      }
    });
  }, [scene, onSpawnPointFound]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} />
    </RigidBody>
  );
}

/**
 * Invisible boundary walls to prevent falling off
 */
function SceneBoundaries() {
  const halfX = 12;
  const halfY = 6;
  const halfZ = 8;
  const thickness = 0.25;

  return (
    <RigidBody type="fixed">
      {/* Floor */}
      <CuboidCollider args={[halfX, thickness, halfZ]} position={[0, -thickness, 0]} />
      
      {/* Ceiling */}
      <CuboidCollider args={[halfX, thickness, halfZ]} position={[0, 2 * halfY + thickness, 0]} />
      
      {/* Walls */}
      <CuboidCollider args={[thickness, halfY, halfZ]} position={[-halfX - thickness, halfY, 0]} />
      <CuboidCollider args={[thickness, halfY, halfZ]} position={[halfX + thickness, halfY, 0]} />
      <CuboidCollider args={[halfX, halfY, thickness]} position={[0, halfY, -halfZ - thickness]} />
      <CuboidCollider args={[halfX, halfY, thickness]} position={[0, halfY, halfZ + thickness]} />
    </RigidBody>
  );
}

/* ========================================================================
   PLAYER CONTROLLER
   ======================================================================== */

/**
 * First-person player controller with physics-based movement
 */
function PlayerController({ spawnPoint = [0, 1.2, 3], mobileInputState, isMobile, lookStateRef }) {
  const { camera } = useThree();
  const rigidBodyRef = useRef();
  const [, getKeys] = useKeyboardControls();

  // Reusable vectors to avoid garbage collection
  const forwardVector = useMemo(() => new THREE.Vector3(), []);
  const rightVector = useMemo(() => new THREE.Vector3(), []);
  const movementVector = useMemo(() => new THREE.Vector3(), []);

  // Initialize camera position
  useEffect(() => {
    camera.position.set(
      spawnPoint[0],
      spawnPoint[1] + PLAYER_CONFIG.height / 2 - PLAYER_CONFIG.radius,
      spawnPoint[2]
    );

    // Initialize mobile look controls
    if (isMobile && lookStateRef?.current) {
      lookStateRef.current.yaw = camera.rotation.y;
      lookStateRef.current.pitch = camera.rotation.x;
      lookStateRef.current.ready = true;
    }
  }, [camera, spawnPoint, isMobile, lookStateRef]);

  // Movement physics loop
  useFrame(() => {
    const rigidBody = rigidBodyRef.current;
    if (!rigidBody) return;

    // Apply mobile look rotation
    if (isMobile && lookStateRef?.current?.ready) {
      const { yaw, pitch } = lookStateRef.current;
      camera.rotation.set(pitch, yaw, 0);
    }

    // Get input state
    const keys = getKeys();
    const mobileInput = mobileInputState || {};

    const isMovingForward = keys.forward || mobileInput.forward;
    const isMovingBackward = keys.backward || mobileInput.backward;
    const isMovingLeft = keys.left || mobileInput.left;
    const isMovingRight = keys.right || mobileInput.right;
    const isJumping = keys.jump || mobileInput.jump;
    const isSprinting = keys.sprint || mobileInput.sprint;

    // Calculate movement speed
    const movementSpeed = isSprinting 
      ? PLAYER_CONFIG.speed * PLAYER_CONFIG.sprintMultiplier 
      : PLAYER_CONFIG.speed;

    // Calculate movement direction from camera orientation
    forwardVector.set(0, 0, -1).applyQuaternion(camera.quaternion);
    forwardVector.y = 0;
    forwardVector.normalize();

    rightVector.set(1, 0, 0).applyQuaternion(camera.quaternion);
    rightVector.y = 0;
    rightVector.normalize();

    // Combine movement inputs
    movementVector.set(0, 0, 0);
    if (isMovingForward) movementVector.add(forwardVector);
    if (isMovingBackward) movementVector.add(forwardVector.clone().negate());
    if (isMovingLeft) movementVector.add(rightVector.clone().negate());
    if (isMovingRight) movementVector.add(rightVector);

    // Normalize and apply speed
    if (movementVector.lengthSq() > 0) {
      movementVector.normalize().multiplyScalar(movementSpeed);
    }

    // Apply movement to rigid body
    const currentVelocity = rigidBody.linvel();
    rigidBody.setLinvel(
      { x: movementVector.x, y: currentVelocity.y, z: movementVector.z },
      true
    );

    // Handle jumping (only when grounded)
    if (isJumping && Math.abs(currentVelocity.y) < 0.05) {
      rigidBody.applyImpulse({ x: 0, y: PLAYER_CONFIG.jumpForce, z: 0 }, true);
    }

    // Sync camera position with rigid body
    const position = rigidBody.translation();
    camera.position.set(
      position.x,
      position.y + PLAYER_CONFIG.height / 2 - PLAYER_CONFIG.radius,
      position.z
    );
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[...spawnPoint]}
      colliders={false}
      enabledRotations={[false, false, false]}
      mass={PLAYER_CONFIG.mass}
      friction={PLAYER_CONFIG.friction}
      restitution={0}
      linearDamping={PLAYER_CONFIG.linearDamping}
      canSleep={false}
    >
      <CapsuleCollider
        args={[
          PLAYER_CONFIG.height / 2 - PLAYER_CONFIG.radius,
          PLAYER_CONFIG.radius
        ]}
      />
    </RigidBody>
  );
}

/* ========================================================================
   PAINTING SYSTEM
   ======================================================================== */

/**
 * Individual painting component with hover effects
 */
function Painting({ id, title, img, position, rotation, size, category, desc }) {
  const texture = useTexture(img);
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  
  useCursor(isHovered);

  // Configure texture
  useEffect(() => {
    if (!texture) return;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
  }, [texture]);

  // Store metadata for raycasting
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.isPainting = true;
      meshRef.current.userData.paintingData = { id, title, img, category, desc };
    }
  }, [id, title, img, category, desc]);

  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
        <boxGeometry args={[size[0] + 0.1, size[1] + 0.1, 0.08]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Canvas */}
      <mesh
        ref={meshRef}
        castShadow={false}
        receiveShadow={false}
        position={[0, 0, 0.015]}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <planeGeometry args={size} />
        <meshStandardMaterial
          map={texture}
          roughness={0.15}
          metalness={0}
          toneMapped={true}
        />
      </mesh>

      {/* Hover glow effect */}
      {isHovered && (
        <mesh position={[0, 0, 0.02]} renderOrder={999}>
          <planeGeometry args={[size[0] + 0.06, size[1] + 0.06]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.18}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Interactive label */}
      <Html
        position={[0, -size[1] * 0.65, 0]}
        center
        distanceFactor={6}
        style={{
          padding: "10px 16px",
          borderRadius: 12,
          background: "rgba(10, 10, 20, 0.85)",
          backdropFilter: "blur(12px)",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 600,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
          letterSpacing: "0.3px",
        }}
      >
        <span style={{ opacity: 0.7 }}>{category}</span>
        {" · "}
        {title}
        {" · "}
        <span style={{ opacity: 0.8 }}>Press E or Click</span>
      </Html>
    </group>
  );
}

/**
 * Manages all paintings and interaction raycasting
 */
function PaintingGallery({
  paintings,
  onPaintingSelected,
  maxInteractionDistance = INTERACTION_CONFIG.paintingMaxDistance,
  isPointerLocked = false,
}) {
  const groupRef = useRef();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const screenCenter = useMemo(() => new THREE.Vector2(0, 0), []);
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();

  // Handle keyboard interaction
  useFrame(() => {
    const keys = getKeys();
    if (!keys.interact || !isPointerLocked) return;

    raycaster.setFromCamera(screenCenter, camera);
    const intersections = raycaster.intersectObjects(groupRef.current?.children ?? [], true);
    
    const validHit = intersections.find(
      (hit) => hit.object?.userData?.isPainting && hit.distance <= maxInteractionDistance
    );

    if (validHit?.object?.userData?.paintingData) {
      onPaintingSelected?.(validHit.object.userData.paintingData);
    }
  });

  // Handle mouse/touch interaction
  useEffect(() => {
    const handleInteraction = (event) => {
      if (!isPointerLocked) return;
      if (event.type === "mousedown" && event.button !== 0) return;

      raycaster.setFromCamera(screenCenter, camera);
      const intersections = raycaster.intersectObjects(groupRef.current?.children ?? [], true);
      
      const validHit = intersections.find(
        (hit) => hit.object?.userData?.isPainting && hit.distance <= maxInteractionDistance
      );

      if (validHit?.object?.userData?.paintingData) {
        onPaintingSelected?.(validHit.object.userData.paintingData);
      }
    };

    window.addEventListener("mousedown", handleInteraction);
    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleInteraction);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [camera, raycaster, maxInteractionDistance, onPaintingSelected, isPointerLocked, screenCenter]);

  return (
    <group ref={groupRef}>
      {paintings.map((painting) => (
        <Painting key={painting.id} {...painting} />
      ))}
    </group>
  );
}

/* ========================================================================
   BALL SHOOTING SYSTEM
   ======================================================================== */

/**
 * Individual physics ball
 */
function PhysicsBall({ id, position, impulse, onExpired }) {
  const rigidBodyRef = useRef();
  const hasAppliedImpulse = useRef(false);

  useEffect(() => {
    const rigidBody = rigidBodyRef.current;
    if (!rigidBody || hasAppliedImpulse.current) return;

    hasAppliedImpulse.current = true;
    rigidBody.applyImpulse(
      { x: impulse[0], y: impulse[1], z: impulse[2] },
      true
    );

    const expirationTimer = setTimeout(() => {
      onExpired?.(id);
    }, BALL_CONFIG.lifetimeMs);

    return () => clearTimeout(expirationTimer);
  }, [id, impulse, onExpired]);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders={false}
      restitution={BALL_CONFIG.restitution}
      friction={BALL_CONFIG.friction}
      linearDamping={BALL_CONFIG.linearDamping}
      angularDamping={BALL_CONFIG.angularDamping}
      canSleep={true}
      ccd={true}
      mass={BALL_CONFIG.mass}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[BALL_CONFIG.radius, 32, 32]} />
        <meshStandardMaterial
          color="#f8f8f8"
          roughness={0.3}
          metalness={0.1}
          envMapIntensity={1.2}
        />
      </mesh>
      <BallCollider
        args={[BALL_CONFIG.radius]}
        restitution={BALL_CONFIG.restitution}
        friction={BALL_CONFIG.friction}
      />
    </RigidBody>
  );
}

/**
 * Ball shooting mechanism
 */
function BallShooter({ isActive, onBallCreated }) {
  const { camera } = useThree();
  const directionVector = useMemo(() => new THREE.Vector3(), []);

  const shootBall = useCallback(() => {
    if (!isActive) return;

    camera.getWorldDirection(directionVector);
    directionVector.normalize();

    const spawnPosition = new THREE.Vector3()
      .copy(camera.position)
      .add(directionVector.clone().multiplyScalar(BALL_CONFIG.spawnOffset));

    const impulseVector = directionVector.clone().multiplyScalar(BALL_CONFIG.shootPower);

    onBallCreated?.({
      id: generateUniqueId(),
      position: [spawnPosition.x, spawnPosition.y, spawnPosition.z],
      impulse: [impulseVector.x, impulseVector.y, impulseVector.z],
    });
  }, [camera, directionVector, isActive, onBallCreated]);

  useEffect(() => {
    const handleShoot = (event) => {
      if (event.type === "mousedown" && event.button !== 0) return;
      shootBall();
    };

    window.addEventListener("mousedown", handleShoot);
    return () => window.removeEventListener("mousedown", handleShoot);
  }, [shootBall]);

  return null;
}

/* ========================================================================
   MOBILE CONTROLS
   ======================================================================== */

/**
 * Touch-based look controls for mobile
 */
function MobileLookControls({ enabled, lookStateRef }) {
  const { gl } = useThree();
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || !lookStateRef?.current) return;

    const canvas = gl.domElement;
    const sensitivity = 0.003;
    const halfPi = Math.PI / 2;

    const handlePointerDown = (event) => {
      isDragging.current = true;
      lastPosition.current.x = event.clientX;
      lastPosition.current.y = event.clientY;
    };

    const handlePointerMove = (event) => {
      if (!isDragging.current || !lookStateRef.current) return;

      const deltaX = event.clientX - lastPosition.current.x;
      const deltaY = event.clientY - lastPosition.current.y;
      
      lastPosition.current.x = event.clientX;
      lastPosition.current.y = event.clientY;

      let { yaw, pitch } = lookStateRef.current;

      yaw -= deltaX * sensitivity;
      pitch -= deltaY * sensitivity;
      pitch = Math.max(-halfPi + 0.1, Math.min(halfPi - 0.1, pitch));

      lookStateRef.current.yaw = yaw;
      lookStateRef.current.pitch = pitch;
      lookStateRef.current.ready = true;
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [enabled, gl, lookStateRef]);

  return null;
}

/**
 * Mobile control button component
 */
function MobileButton({ label, ...handlers }) {
  return (
    <button
      {...handlers}
      style={{
        width: 58,
        height: 58,
        borderRadius: "50%",
        border: "2px solid rgba(255, 255, 255, 0.5)",
        background: "rgba(10, 10, 20, 0.7)",
        backdropFilter: "blur(12px)",
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

/**
 * Mobile virtual controls overlay
 */
function MobileControlsOverlay({ onInputChange }) {
  if (!onInputChange) return null;

  const updateInput = useCallback((inputName, value) => {
    onInputChange((current) => ({ ...current, [inputName]: value }));
  }, [onInputChange]);

  const createButtonHandlers = useCallback((inputName) => {
    const handleStart = (event) => {
      event.preventDefault();
      event.stopPropagation();
      updateInput(inputName, true);
    };
    
    const handleEnd = (event) => {
      event.preventDefault();
      event.stopPropagation();
      updateInput(inputName, false);
    };

    return {
      onTouchStart: handleStart,
      onTouchEnd: handleEnd,
      onTouchCancel: handleEnd,
      onMouseDown: handleStart,
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
    };
  }, [updateInput]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        left: 0,
        right: 0,
        padding: "0 32px",
        display: "flex",
        justifyContent: "space-between",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {/* Movement pad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          pointerEvents: "auto",
        }}
      >
        <div />
        <MobileButton label="↑" {...createButtonHandlers("forward")} />
        <div />
        <MobileButton label="←" {...createButtonHandlers("left")} />
        <MobileButton label="↓" {...createButtonHandlers("backward")} />
        <MobileButton label="→" {...createButtonHandlers("right")} />
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          pointerEvents: "auto",
          alignItems: "flex-end",
        }}
      >
        <MobileButton label="↟" {...createButtonHandlers("jump")} />
      </div>
    </div>
  );
}

/* ========================================================================
   UI COMPONENTS
   ======================================================================== */

/**
 * Painting detail modal
 */
function PaintingModal({ painting, onClose }) {
  if (!painting) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        padding: "20px",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-card {
          animation: slideUp 0.3s ease-out;
        }
        .modal-card img {
          transition: transform 0.3s ease;
        }
        .modal-card:hover img {
          transform: scale(1.02);
        }
      `}</style>
      
      <div
        className="modal-card"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 250, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          borderRadius: 32,
          padding: 32,
          width: "min(90vw, 900px)",
          maxHeight: "85vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 14px",
              background: "rgba(100, 100, 255, 0.15)",
              color: "#4040ff",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {painting.category}
          </span>
        </div>
        
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 24,
            color: "#1a1a2e",
            letterSpacing: "-0.5px",
          }}
        >
          {painting.title}
        </h2>
        
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          }}
        >
          <img
            src={painting.img}
            alt={painting.title}
            style={{
              width: "100%",
              display: "block",
            }}
          />
        </div>
        
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "#2a2a3e",
            marginBottom: 24,
          }}
        >
          {painting.desc}
        </p>
        
        <button
          onClick={onClose}
          style={{
            padding: "14px 32px",
            background: "linear-gradient(135deg, #4040ff 0%, #6060ff 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(64, 64, 255, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(64, 64, 255, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(64, 64, 255, 0.3)";
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/**
 * Environment toggle button
 */
function EnvironmentToggle({ enabled, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: "50%",
        border: "2px solid rgba(255, 255, 255, 0.5)",
        background: "rgba(10, 10, 20, 0.7)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 150,
        transition: "all 0.2s ease",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.4)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.3)";
      }}
      aria-label={enabled ? "Switch to night mode" : "Switch to day mode"}
    >
      <span style={{ fontSize: 28 }}>
        {enabled ? "☀️" : "🌙"}
      </span>
    </button>
  );
}

/**
 * Pointer lock gate for desktop
 */
function PointerLockGate({ onLockRequested }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: 48,
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: 24,
            letterSpacing: "-1px",
          }}
        >
          Interactive Gallery
        </h1>
        
        <p
          style={{
            fontSize: 18,
            color: "rgba(255, 255, 255, 0.8)",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          Explore our portfolio in an immersive 3D environment
        </p>
        
        <button
          onClick={onLockRequested}
          style={{
            padding: "18px 48px",
            background: "linear-gradient(135deg, #4040ff 0%, #6060ff 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: 16,
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(64, 64, 255, 0.4)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(64, 64, 255, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(64, 64, 255, 0.4)";
          }}
        >
          Enter Gallery
        </button>
        
        <div
          style={{
            marginTop: 32,
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <p style={{ marginBottom: 8 }}>
            <strong>Controls:</strong> WASD to move • Shift to sprint • Space to jump
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Interact:</strong> Click or press E on paintings
          </p>
          <p>
            <strong>Toggle lighting:</strong> Press H • Click to shoot balls
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile instructions overlay
 */
function MobileInstructions() {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 20px",
        borderRadius: 24,
        background: "rgba(10, 10, 20, 0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "#ffffff",
        fontSize: 13,
        fontWeight: 600,
        zIndex: 90,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      Drag to look • Use controls below to move
    </div>
  );
}

/**
 * Crosshair component
 */
function Crosshair({ visible }) {
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: INTERACTION_CONFIG.crosshairSize,
        height: INTERACTION_CONFIG.crosshairSize,
        border: "2px solid rgba(255, 255, 255, 0.9)",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
        zIndex: 50,
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
      }}
    />
  );
}

/* ========================================================================
   MAIN COMPONENT
   ======================================================================== */

export default function ProfessionalGallery() {
  const navigate = useNavigate();
  const pointerLockControlsRef = useRef();

  // State management
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [spawnPoint, setSpawnPoint] = useState(null);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [isEnvironmentEnabled, setIsEnvironmentEnabled] = useState(true);
  const [physicsBalls, setPhysicsBalls] = useState([]);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mobileInputState, setMobileInputState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  });

  // Mobile look state
  const mobileLookStateRef = useRef({
    yaw: 0,
    pitch: 0,
    ready: false,
  });

  // Detect mobile on mount
  useEffect(() => {
    setIsMobileDevice(detectTouchDevice());
  }, []);

  // Ball management
  const addBall = useCallback((ballData) => {
    setPhysicsBalls((current) => {
      const updated = [...current, { ...ballData, createdAt: performance.now() }];
      if (updated.length > BALL_CONFIG.maxCount) {
        updated.splice(0, updated.length - BALL_CONFIG.maxCount);
      }
      return updated;
    });
  }, []);

  const removeBall = useCallback((ballId) => {
    setPhysicsBalls((current) => current.filter((ball) => ball.id !== ballId));
  }, []);

  // Clean up expired balls periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = performance.now();
      setPhysicsBalls((current) =>
        current.filter((ball) => now - ball.createdAt < BALL_CONFIG.lifetimeMs)
      );
    }, 2000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Environment toggle keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "h" || event.key === "H") {
        setIsEnvironmentEnabled((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Pointer lock handlers
  useEffect(() => {
    const controls = pointerLockControlsRef.current;
    if (!controls) return;

    const handleLock = () => setIsPointerLocked(true);
    const handleUnlock = () => setIsPointerLocked(false);

    controls.addEventListener("lock", handleLock);
    controls.addEventListener("unlock", handleUnlock);

    return () => {
      controls.removeEventListener("lock", handleLock);
      controls.removeEventListener("unlock", handleUnlock);
    };
  }, []);

  return (
    <>
      {/* Desktop: Pointer lock gate */}
      {!isMobileDevice && !isPointerLocked && (
        <PointerLockGate
          onLockRequested={() => pointerLockControlsRef.current?.lock()}
        />
      )}

      {/* Mobile: Instructions */}
      {isMobileDevice && <MobileInstructions />}

      {/* Environment toggle */}
      <EnvironmentToggle
        enabled={isEnvironmentEnabled}
        onChange={() => setIsEnvironmentEnabled((current) => !current)}
      />

      {/* Crosshair */}
      <Crosshair visible={!isMobileDevice && isPointerLocked} />

      {/* Mobile controls */}
      {isMobileDevice && (
        <MobileControlsOverlay onInputChange={setMobileInputState} />
      )}

      {/* Painting detail modal */}
      <PaintingModal
        painting={selectedPainting}
        onClose={() => setSelectedPainting(null)}
      />

      {/* 3D Canvas */}
      <KeyboardControls map={KEYMAP}>
        <Canvas
          style={{
            width: "100vw",
            height: "100vh",
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            touchAction: "none",
          }}
          onCreated={({ gl, scene }) => {
            // Renderer configuration
            gl.setClearColor("#0a0a12", 1);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.3;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.physicallyCorrectLights = true;
            
            if ("useLegacyLights" in gl) {
              gl.useLegacyLights = false;
            }

            // Shadow configuration
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;

            // Atmospheric fog
            scene.fog = new THREE.FogExp2("#0c0c16", 0.011);
          }}
          camera={{
            fov: 70,
            near: 0.1,
            far: 200,
            position: [0, 2, 5],
          }}
        >
          {/* Soft shadows */}
          <SoftShadows size={30} samples={32} focus={0.8} />

          {/* Lighting */}
          <LightingRig />

          {/* Environment */}
          <EnvironmentController enabled={isEnvironmentEnabled} />

          {/* Physics World */}
          <RapierReady>
            <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} substeps={2}>
              <Suspense
                fallback={
                  <Html center>
                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      Loading gallery...
                    </div>
                  </Html>
                }
              >
                {/* Gallery scene */}
                <GalleryScene onSpawnPointFound={setSpawnPoint} />

                {/* Contact shadows */}
                <ContactShadows
                  position={[0, 0.01, 0]}
                  opacity={0.6}
                  scale={45}
                  blur={3.5}
                  far={24}
                  resolution={1024}
                />

                {/* Paintings */}
                <PaintingGallery
                  paintings={PAINTINGS}
                  onPaintingSelected={setSelectedPainting}
                  isPointerLocked={isPointerLocked && !isMobileDevice}
                />

                {/* Player */}
                {spawnPoint && (
                  <PlayerController
                    spawnPoint={spawnPoint}
                    mobileInputState={isMobileDevice ? mobileInputState : null}
                    isMobile={isMobileDevice}
                    lookStateRef={mobileLookStateRef}
                  />
                )}

                {/* Scene boundaries */}
                <SceneBoundaries />

                {/* Ball shooter (desktop only) */}
                <BallShooter
                  isActive={!isMobileDevice && isPointerLocked && !selectedPainting}
                  onBallCreated={addBall}
                />

                {/* Physics balls */}
                {physicsBalls.map((ball) => (
                  <PhysicsBall
                    key={ball.id}
                    id={ball.id}
                    position={ball.position}
                    impulse={ball.impulse}
                    onExpired={removeBall}
                  />
                ))}
              </Suspense>
            </Physics>
          </RapierReady>

          {/* Desktop: Pointer lock controls */}
          {!isMobileDevice && <PointerLockControls ref={pointerLockControlsRef} />}

          {/* Mobile: Touch look controls */}
          {isMobileDevice && (
            <MobileLookControls enabled={true} lookStateRef={mobileLookStateRef} />
          )}

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom
              intensity={0.5}
              mipmapBlur
              luminanceThreshold={0.85}
              luminanceSmoothing={0.4}
              blendFunction={BlendFunction.SCREEN}
            />
            <Vignette
              offset={0.3}
              darkness={0.5}
              eskil={false}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Canvas>
      </KeyboardControls>
    </>
  );
}

// Preload 3D model
useGLTF.preload("/models/gallery4.compressed.glb");