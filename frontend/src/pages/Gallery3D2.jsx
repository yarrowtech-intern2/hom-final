// // import React, { Suspense, useEffect, useRef, useState } from "react";
// // import { Canvas, useFrame, useThree } from "@react-three/fiber";
// // import {
// //   KeyboardControls,
// //   useKeyboardControls,
// //   PointerLockControls,
// //   Html,
// //   Environment,
// //   useGLTF,
// //   ContactShadows,
// // } from "@react-three/drei";
// // import { Physics, RigidBody, CapsuleCollider } from "@react-three/rapier";
// // import * as THREE from "three";
// // import { useNavigate } from "react-router-dom";

// // const KEYMAP = [
// //   { name: "forward", keys: ["KeyW", "ArrowUp"] },
// //   { name: "backward", keys: ["KeyS", "ArrowDown"] },
// //   { name: "left", keys: ["KeyA", "ArrowLeft"] },
// //   { name: "right", keys: ["KeyD"] },
// //   // { name: "right", keys: ["KeyD", "ArrowRight"] },
// //   { name: "jump", keys: ["Space"] },
// //   { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
// // ];


// // const SPEED = 3.4;
// // const SPRINT = 1.8;
// // const JUMP = 6.5;
// // const PLAYER_HEIGHT = 3.35;   // ✅ human-sized, avoids ceiling collisions
// // const PLAYER_RADIUS = 0.35;

// // /* -------------------- 3D Scene -------------------- */
// // /** Loads the GLB, emits a spawn when ready (uses Empty named SpawnPoint/spawn/Start). */
// // function BalconyScene({ onSpawn }) {
// //   const { scene } = useGLTF("/models/gallery2.glb");

// //   useEffect(() => {
// //     const spawn =
// //       scene.getObjectByName("SpawnPoint") ||
// //       scene.getObjectByName("spawn") ||
// //       scene.getObjectByName("Start");

// //     if (spawn && onSpawn) {
// //       const w = new THREE.Vector3();
// //       spawn.getWorldPosition(w);
// //       const halfHeight = PLAYER_HEIGHT / 2 - PLAYER_RADIUS;
// //       const centerY = w.y + halfHeight + PLAYER_RADIUS; // = w.y + PLAYER_HEIGHT/2
// //       onSpawn([w.x, centerY, w.z]);
// //     } else if (onSpawn) {
// //       onSpawn([0, PLAYER_HEIGHT / 2, 3]); // fallback
// //     }

// //     // shadows + reflections on all meshes/materials
// //     scene.traverse((o) => {
// //       if (o.isLight) {
// //         o.castShadow = true;
// //       }
// //       if (o.isMesh) {
// //         o.castShadow = true;
// //         o.receiveShadow = true;
// //         if (o.material) {
// //           // boost IBL reflections a bit; tune 0.6–1.5
// //           if ("envMapIntensity" in o.material) o.material.envMapIntensity = 1.0;
// //           o.material.needsUpdate = true;
// //         }
// //       }
// //     });



// //   }, [scene, onSpawn]);

// //   return (
// //     <RigidBody type="fixed" colliders="trimesh">
// //       <primitive object={scene} />
// //     </RigidBody>
// //   );
// // }

// // function Player({ spawn = [0, 1.2, 3] }) {
// //   const { camera } = useThree();
// //   const bodyRef = useRef();

// //   // ✅ Proper keyboard store usage:
// //   const [, get] = useKeyboardControls(); // [subscribe, get]

// //   const forward = useRef(new THREE.Vector3()).current;
// //   const right = useRef(new THREE.Vector3()).current;
// //   const dir = useRef(new THREE.Vector3()).current;

// //   // Put camera near the head from the start
// //   useEffect(() => {
// //     camera.position.set(spawn[0], spawn[1] + (PLAYER_HEIGHT / 2) - PLAYER_RADIUS, spawn[2]);
// //   }, [camera, spawn]);

// //   useFrame(() => {
// //     const rb = bodyRef.current;
// //     if (!rb) return;

// //     const pressed = get(); // ✅ read current keys each frame
// //     const base = pressed.sprint ? SPEED * SPRINT : SPEED;

// //     //  camera-oriented movement (yaw only)
// //     // forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
// //     // forward.y = 0;
// //     // forward.normalize();
// //     // right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).negate();

// //     // camera-oriented movement (yaw only) — robust & unambiguous
// //     forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
// //     forward.y = 0;
// //     forward.normalize();

// //     // RIGHT = +X rotated by camera yaw (no cross-products)
// //     right.set(1, 0, 0).applyQuaternion(camera.quaternion);
// //     right.y = 0;
// //     right.normalize();



// //     dir.set(0, 0, 0);
// //     if (pressed.forward) dir.add(forward);
// //     if (pressed.backward) dir.add(forward.clone().negate());
// //     if (pressed.left) dir.add(right.clone().negate());
// //     if (pressed.right) dir.add(right);

// //     if (dir.lengthSq() > 0) dir.normalize().multiplyScalar(base);

// //     const lv = rb.linvel();
// //     rb.setLinvel({ x: dir.x, y: lv.y, z: dir.z }, true);

// //     // jump (simple ground check)
// //     if (pressed.jump && Math.abs(lv.y) < 0.05) {
// //       rb.applyImpulse({ x: 0, y: JUMP, z: 0 }, true);
// //     }

// //     // camera at capsule head
// //     const t = rb.translation();
// //     camera.position.set(t.x, t.y + (PLAYER_HEIGHT / 2) - PLAYER_RADIUS, t.z);
// //   });

// //   return (
// //     <RigidBody
// //       ref={bodyRef}
// //       position={[...spawn]}            // spawn is the capsule center
// //       colliders={false}
// //       enabledRotations={[false, false, false]}
// //       mass={1}
// //       friction={0.2}                   // ✅ lower friction to avoid “sticking”
// //       restitution={0}
// //       linearDamping={0.05}             // ✅ smooth stop (optional)
// //       canSleep={false}
// //     >
// //       <CapsuleCollider args={[PLAYER_HEIGHT / 2 - PLAYER_RADIUS, PLAYER_RADIUS]} />
// //     </RigidBody>
// //   );
// // }

// // /* Bridge to listen to lock/unlock from inside Canvas and update state in parent */
// // function LockBridge({ plcRef, setLocked }) {
// //   useEffect(() => {
// //     const plc = plcRef.current;
// //     if (!plc) return;
// //     const onLock = () => setLocked(true);
// //     const onUnlock = () => setLocked(false);
// //     plc.addEventListener("lock", onLock);
// //     plc.addEventListener("unlock", onUnlock);
// //     return () => {
// //       plc.removeEventListener("lock", onLock);
// //       plc.removeEventListener("unlock", onUnlock);
// //     };
// //   }, [plcRef, setLocked]);
// //   return null;
// // }

// // /* -------------------- Page -------------------- */
// // export default function GalleryPage() {
// //   const [locked, setLocked] = useState(false);
// //   const [spawn, setSpawn] = useState(null);
// //   const plcRef = useRef();
// //   const navigate = useNavigate();

// //   return (
// //     <>
// //       {/* UI OUTSIDE CANVAS */}
// //       {/* <button
// //         onClick={() => navigate("/")}
// //         style={{
// //           position: "fixed", top: 16, left: 16, zIndex: 40,
// //           background: "rgba(0,0,0,0.55)", color: "#fff",
// //           padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)"
// //         }}
// //       >
// //         ⟵ Exit
// //       </button> */}

// //       {!locked && (
// //         <button
// //           onClick={() => plcRef.current?.lock()}
// //           style={{
// //             position: "fixed", inset: 0, margin: "auto",
// //             width: 280, height: 120, background: "rgba(0,0,0,0.6)",
// //             color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
// //             borderRadius: 106, fontSize: 16, backdropFilter: "blur(4px)", zIndex: 30
// //           }}
// //         >
// //           Click to enter • WASD / Shift / Space
// //         </button>
// //       )}

// //       {/* Crosshair */}
// //       <div
// //         style={{
// //           position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
// //           width: 12, height: 12, border: "2px solid rgba(255,255,255,0.8)", borderRadius: 9999,
// //           pointerEvents: "none", opacity: locked ? 1 : 0.35, zIndex: 20
// //         }}
// //       />

// //       <KeyboardControls map={KEYMAP}>
// //         <Canvas
// //           shadows
// //           gl={{ antialias: true, physicallyCorrectLights: true, outputColorSpace: THREE.SRGBColorSpace }}
// //           onCreated={({ gl, scene }) => {
// //             gl.setClearColor("#000");
// //             gl.toneMapping = THREE.ACESFilmicToneMapping;
// //             gl.toneMappingExposure = 1.0;
// //             gl.shadowMap.enabled = true;
// //              gl.shadowMap.type = THREE.PCFSoftShadowMap;
// //             scene.fog = new THREE.FogExp2("#0c0c12", 0.02);
// //           }}
// //           camera={{ fov: 68, near: 0.1, far: 200 }}
// //         >
// //           <ambientLight intensity={0.35} />
// //           <directionalLight
// //             position={[5, 8, 3]}
// //             intensity={1.1}
// //             castShadow
// //             shadow-bias={-0.0003}
// //             shadow-mapSize-width={2048}
// //             shadow-mapSize-height={2048}
// //           />
// //           <Environment
// //             files="/hdr/derelict_airfield_01_4k.hdr"
// //             background
// //             blur={0.2}
// //           />

// //           <Physics gravity={[0, -9.81, 0]}>
// //             <Suspense fallback={<Html center style={{ color: "#fff" }}>Loading…</Html>}>
// //               <BalconyScene onSpawn={setSpawn} />
// //             </Suspense>
// //             <ContactShadows
// //               position={[0, 0.01, 0]}
// //               opacity={0.5}
// //               scale={30}
// //               blur={2.5}
// //               far={20}
// //             />

// //             {spawn && <Player spawn={spawn} />}
// //           </Physics>

// //           <PointerLockControls ref={plcRef} />
// //           <LockBridge plcRef={plcRef} setLocked={setLocked} />
// //         </Canvas>
// //       </KeyboardControls>
// //     </>
// //   );
// // }

// // useGLTF.preload("/models/gallery2.glb");
























// perfect code .............................
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



// import { Physics, RigidBody, CapsuleCollider } from "@react-three/rapier";
// import * as THREE from "three";
// import { useNavigate } from "react-router-dom";
// import RapierReady from "./RapierReady.jsx";




// const asset = (p) => {
//   const base = (import.meta.env?.BASE_URL ?? '/').replace(/\/+$/, '');
//   const rel = String(p).replace(/^\/+/, '');
//   return `${base}/${rel}`;
// };

// const KEYMAP = [
//   { name: "forward", keys: ["KeyW", "ArrowUp"] },
//   { name: "backward", keys: ["KeyS", "ArrowDown"] },
//   { name: "left", keys: ["KeyA", "ArrowLeft"] },
//   { name: "right", keys: ["KeyD"] },
//   // { name: "right", keys: ["KeyD", "ArrowRight"] },
//   { name: "jump", keys: ["Space"] },
//   { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
//   { name: "interact", keys: ["KeyE", "Enter"] },
// ];

// const PAINTINGS = [
//   {
//     id: "p1",
//     title: "Sportbit",
//     // img: "https://picsum.photos/800/1200?random=11",
//     img: asset('/gallery/sport.jpg'),
//     position: [-9.9, 3.6, 3.9],
//     rotation: [0, Math.PI, 0],
//     size: [3.2, 4],
//     desc: "Real-time sports analytics and club management.",
//   },
//   {
//     id: "p2",
//     title: "Monochrome City",
//     // img: "https://picsum.photos/1200/800?random=12",
//     img: asset('/gallery/art.jpg'),
//     // position: [-1.8, 1.5, 4.0],
//     position: [-3.4, 3.6, 3.9],
//     // rotation: [0, Math.PI * 0.5, 0],
//     rotation: [0, Math.PI, 0],
//     // size: [1.2, 0.9],
//     size: [3.2, 4],
//     desc: "Real-time sports analytics and club management.",
//   },
//   {
//     id: "p3",
//     title: "Monochrome City",
//     // img: "https://picsum.photos/1200/800?random=12",
//     img: asset('/gallery/mgmt.jpg'),
//     // position: [-1.8, 1.5, 4.0],
//     position: [3.2, 3.6, 3.9],
//     // rotation: [0, Math.PI * 0.5, 0],
//     rotation: [0, Math.PI, 0],
//     // size: [1.2, 0.9],
//     size: [3.2, 4],
//     desc: "Real-time sports analytics and club management.",
//   },
//   {
//     id: "p4",
//     title: "Monochrome City",
//     // img: "https://picsum.photos/1200/800?random=12",
//     img: asset('/gallery/restora.jpg'),
//     // position: [-1.8, 1.5, 4.0],
//     position: [9.2, 3.6, 3.9],
//     // rotation: [0, Math.PI * 0.5, 0],
//     rotation: [0, Math.PI, 0],
//     // size: [1.2, 0.9],
//     size: [3.2, 4],
//     desc: "Real-time sports analytics and club management.",
//   },
//   {
//     id: "p5",
//     title: "Monochrome City",
//     // img: "https://picsum.photos/1200/800?random=12",
//     img: asset('/gallery/shop.jpg'),
//     // position: [-1.8, 1.5, 4.0],
//     position: [9.8, 3.6, -3.9],
//     // rotation: [0, Math.PI * 0.5, 0],
//     rotation: [0, Math.PI * 2, 0],
//     // size: [1.2, 0.9],
//     size: [3.2, 4],
//     desc: "Real-time sports analytics and club management.",
//   },
//   {
//     id: "p6",
//     title: "Monochrome City",
//     // img: "https://picsum.photos/1200/800?random=12",
//     img: asset('/gallery/tour.jpg'),
//     // position: [-1.8, 1.5, 4.0],
//     position: [3.2, 3.6, -3.9],
//     // rotation: [0, Math.PI * 0.5, 0],
//     rotation: [0, Math.PI * 2, 0],
//     // size: [1.2, 0.9],
//     size: [3.2, 4],
//     desc: "Real-time sports analytics and club management.",
//   },
//   {
//     id: "p7",
//     title: "Monochrome City",
//     // img: "https://picsum.photos/1200/800?random=12",
//     img: asset('/gallery/sport.jpg'),
//     // position: [-1.8, 1.5, 4.0],
//     position: [-3.4, 3.6, -3.9],
//     // rotation: [0, Math.PI * 0.5, 0],
//     rotation: [0, Math.PI * 2, 0],
//     // size: [1.2, 0.9],
//     size: [3.2, 4],
//     desc: "Real-time sports analytics and club management.",
//   },
//   {
//     id: "p8",
//     title: "Monochrome City",
//     // img: "https://picsum.photos/1200/800?random=12",
//     img: asset('/gallery/sport.jpg'),
//     // position: [-1.8, 1.5, 4.0],
//     position: [-9.9, 3.6, -3.9],
//     // rotation: [0, Math.PI * 0.5, 0],
//     rotation: [0, Math.PI * 2, 0],
//     // size: [1.2, 0.9],
//     size: [3.2, 4],
//     desc: "Real-time sports analytics and club management.",
//   },
// ];


// const SPEED = 4.4;
// const SPRINT = 8.8;
// const JUMP = 14.5;
// const PLAYER_HEIGHT = 3.35;   // ✅ human-sized, avoids ceiling collisions
// const PLAYER_RADIUS = 0.35;

// /* -------------------- 3D Scene -------------------- */
// /** Loads the GLB, emits a spawn when ready (uses Empty named SpawnPoint/spawn/Start). */
// function BalconyScene({ onSpawn }) {
//   const { scene } = useGLTF("/models/gallery2.glb");

//   useEffect(() => {
//     const spawn =
//       scene.getObjectByName("SpawnPoint") ||
//       scene.getObjectByName("spawn") ||
//       scene.getObjectByName("Start");

//     if (spawn && onSpawn) {
//       const w = new THREE.Vector3();
//       spawn.getWorldPosition(w);
//       const halfHeight = PLAYER_HEIGHT / 2 - PLAYER_RADIUS;
//       const centerY = w.y + halfHeight + PLAYER_RADIUS; // = w.y + PLAYER_HEIGHT/2
//       onSpawn([w.x, centerY, w.z]);
//     } else if (onSpawn) {
//       onSpawn([0, PLAYER_HEIGHT / 2, 3]); // fallback
//     }

//     // shadows + reflections on all meshes/materials
//     scene.traverse((o) => {
//       if (o.isLight) {
//         o.castShadow = true;
//       }
//       if (o.isMesh) {
//         o.castShadow = true;
//         o.receiveShadow = true;
//         if (o.material) {
//           // boost IBL reflections a bit; tune 0.6–1.5
//           if ("envMapIntensity" in o.material) o.material.envMapIntensity = 1.0;
//           o.material.needsUpdate = true;
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

// function Player({ spawn = [0, 1.2, 3] }) {
//   const { camera } = useThree();
//   const bodyRef = useRef();

//   // ✅ Proper keyboard store usage:
//   const [, get] = useKeyboardControls(); // [subscribe, get]

//   const forward = useRef(new THREE.Vector3()).current;
//   const right = useRef(new THREE.Vector3()).current;
//   const dir = useRef(new THREE.Vector3()).current;

//   // Put camera near the head from the start
//   useEffect(() => {
//     camera.position.set(spawn[0], spawn[1] + (PLAYER_HEIGHT / 2) - PLAYER_RADIUS, spawn[2]);
//   }, [camera, spawn]);

//   useFrame(() => {
//     const rb = bodyRef.current;
//     if (!rb) return;

//     const pressed = get(); // ✅ read current keys each frame
//     const base = pressed.sprint ? SPEED * SPRINT : SPEED;

//     //  camera-oriented movement (yaw only)
//     // forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
//     // forward.y = 0;
//     // forward.normalize();
//     // right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).negate();

//     // camera-oriented movement (yaw only) — robust & unambiguous
//     forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
//     forward.y = 0;
//     forward.normalize();

//     // RIGHT = +X rotated by camera yaw (no cross-products)
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

//     // jump (simple ground check)
//     if (pressed.jump && Math.abs(lv.y) < 0.05) {
//       rb.applyImpulse({ x: 0, y: JUMP, z: 0 }, true);
//     }

//     // camera at capsule head
//     const t = rb.translation();
//     camera.position.set(t.x, t.y + (PLAYER_HEIGHT / 2) - PLAYER_RADIUS, t.z);
//   });

//   return (
//     <RigidBody
//       ref={bodyRef}
//       position={[...spawn]}            // spawn is the capsule center
//       colliders={false}
//       enabledRotations={[false, false, false]}
//       mass={1}
//       friction={0.2}                   // ✅ lower friction to avoid “sticking”
//       restitution={0}
//       linearDamping={0.05}             // ✅ smooth stop (optional)
//       canSleep={false}
//     >
//       <CapsuleCollider args={[PLAYER_HEIGHT / 2 - PLAYER_RADIUS, PLAYER_RADIUS]} />
//     </RigidBody>
//   );
// }



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

//   // Mark for raycast filtering
//   useEffect(() => {
//     if (planeRef.current) {
//       planeRef.current.userData.isPainting = true;
//       planeRef.current.userData.paintingMeta = { id, title, img, desc };
//     }
//   }, [id, title, img, desc]);

//   return (
//     <group position={position} rotation={rotation}>
//       {/* simple frame */}
//       <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
//         <boxGeometry args={[size[0] + 0.08, size[1] + 0.08, 0.06]} />
//         {/* <meshStandardMaterial metalness={0.55} roughness={0.35} color="#3a3a3a" /> */}
//         <meshStandardMaterial metalness={0} roughness={0} color="#00000008" />
//       </mesh>

//       {/* art plane */}
//       <mesh
//         ref={planeRef}
//         // castShadow
//         // receiveShadow
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
//         />   {/* default: roughness={0.6} metalness={0.08} */}
//       </mesh>

//       {/* soft glow when aimed */}
//       {/* {aimed && (
//         <mesh position={[0, 0, 0.01]}>
//           <planeGeometry args={[size[0] + 0.04, size[1] + 0.04]} />
//           <meshBasicMaterial color="#ffffff29" transparent opacity={0.10} depthWrite={false}
//           blending={THREE.AdditiveBlending} /> 
//         </mesh>
//       )} */}

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

//       {/* hint */}
//       <Html
//         position={[0, -size[1] * 0.65, 0]}
//         center
//         style={{
//           padding: "6px 10px",
//           borderRadius: 10,
//           background: "rgba(0, 0, 0, 0.11)",
//           color: "#fff",
//           fontSize: 8,
//           border: "1px solid rgba(255, 255, 255, 0.1)",
//           pointerEvents: "none",
//           whiteSpace: "nowrap",
//         }}
//       >
//         {title} • Press <b>E</b> / Click
//       </Html>
//     </group>
//   );
// }

// // Manages raycast from the crosshair + open on E / click
// function PaintingsManager({ config, onOpen, maxDistance = 8, pointerLocked = false }) {
//   const groupRef = useRef();
//   const ray = useRef(new THREE.Raycaster()).current;
//   const { camera } = useThree();
//   const [, get] = useKeyboardControls();

//   // Center of screen NDC
//   const ndc = useRef(new THREE.Vector2(0, 0)).current;

//   // Per-frame: handle E/Enter interaction from the center
//   useFrame(() => {
//     const pressed = get();
//     if (!pressed.interact) return;

//     // If you want interaction only in FPS mode, keep this:
//     if (!pointerLocked) return;

//     // Fresh raycast from center
//     ray.setFromCamera(ndc, camera);
//     const root = groupRef.current?.children ?? [];
//     const hits = ray.intersectObjects(root, true);
//     const h = hits.find((x) => x.object?.userData?.isPainting && x.distance <= maxDistance);
//     if (h?.object?.userData?.paintingMeta) onOpen?.(h.object.userData.paintingMeta);
//   });

//   // Robust CLICK/TAP handler (works across browsers + pointer lock)
//   useEffect(() => {
//     const handleTryOpen = (e) => {
//       // Optional: require FPS mode; remove this if you want clicks even when unlocked
//       if (!pointerLocked) return;

//       // Left mouse only when it is a mouse event
//       if (e.type === "mousedown" && e.button !== 0) return;

//       // Raycast from screen center (crosshair)
//       ray.setFromCamera(ndc, camera);
//       const root = groupRef.current?.children ?? [];
//       const hits = ray.intersectObjects(root, true);
//       const h = hits.find((x) => x.object?.userData?.isPainting && x.distance <= maxDistance);
//       if (h?.object?.userData?.paintingMeta) onOpen?.(h.object.userData.paintingMeta);
//     };

//     // Listen on window to avoid canvas-specific quirks under pointer lock
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







// /* Bridge to listen to lock/unlock from inside Canvas and update state in parent */
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

// /* -------------------- Page -------------------- */
// export default function GalleryPage() {
//   const [locked, setLocked] = useState(false);
//   const [spawn, setSpawn] = useState(null);
//   const [active, setActive] = useState(null);
//   const plcRef = useRef();
//   const navigate = useNavigate();


//   return (
//     <>
//       {/* UI OUTSIDE CANVAS */}
//       {/* <button
//         onClick={() => navigate("/")}
//         style={{
//           position: "fixed", top: 16, left: 16, zIndex: 40,
//           background: "rgba(0,0,0,0.55)", color: "#fff",
//           padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)"
//         }}
//       >
//         ⟵ Exit
//       </button> */}

//       {!locked && (
//         <button
//           onClick={() => plcRef.current?.lock()}
//           style={{
//             position: "fixed", inset: 0, margin: "auto",
//             width: 280, height: 120, background: "rgba(0,0,0,0.6)",
//             color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
//             borderRadius: 106, fontSize: 16, backdropFilter: "blur(4px)", zIndex: 30
//           }}
//         >
//           Click to enter • WASD / Shift / Space
//         </button>
//       )}

//       {/* Crosshair */}
//       <div
//         style={{
//           position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
//           width: 8, height: 8, border: "2px solid rgba(255,255,255,0.8)", borderRadius: 9999,
//           backgroundColor: "rgba(255, 255, 255, 1)",
//           pointerEvents: "none", opacity: locked ? 1 : 0.35, zIndex: 20
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
//             // backdropFilter: "blur(4px)",
//             // background: "transparent",
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
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
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
//             {/* Description block */}
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
//         {/* <Canvas
//           shadows
//           gl={{ antialias: true, physicallyCorrectLights: true, outputColorSpace: THREE.SRGBColorSpace }}
//           onCreated={({ gl, scene }) => {
//             gl.setClearColor("#000");
//             gl.toneMapping = THREE.ACESFilmicToneMapping;
//             gl.toneMappingExposure = 1.0;
//             gl.shadowMap.enabled = true;
//             gl.shadowMap.type = THREE.PCFSoftShadowMap;
//             scene.fog = new THREE.FogExp2("#0c0c12", 0.02);
//           }}
//           camera={{ fov: 68, near: 0.1, far: 200 }}
//         > */}

//         <Canvas
//           // shadows
//           gl={{
//             antialias: true,
//             alpha: true,
//             premultipliedAlpha: true,
//             physicallyCorrectLights: true,
//             outputColorSpace: THREE.SRGBColorSpace
//           }}
//           onCreated={({ gl, scene }) => {
//             // gl.setClearColor("#000000");
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
//           <Environment
//             files="/hdr/jungle.hdr"
//             background
//             blur={0}
//           />
//         <RapierReady>
//           <Physics gravity={[0, -9.81, 0]}>
//             <Suspense fallback={<Html center style={{ color: "#fff" }}>Loading…</Html>}>
//               <BalconyScene onSpawn={setSpawn} />
//             </Suspense>
//             <ContactShadows
//               position={[0, 0.01, 0]}
//               opacity={0.5}
//               scale={30}
//               blur={2.5}
//               far={20}
//             />
//             <PaintingsManager config={PAINTINGS} onOpen={setActive} maxDistance={8} pointerLocked={locked} />

//             {spawn && <Player spawn={spawn} />}
//           </Physics>
//           </RapierReady>

//           <PointerLockControls ref={plcRef} />
//           <LockBridge plcRef={plcRef} setLocked={setLocked} />
//         </Canvas>
//       </KeyboardControls>
//     </>
//   );
// }

// useGLTF.preload("/models/gallery2.glb");

























// LIGHT UPDATE.............................................
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
// import { Physics, RigidBody, CapsuleCollider } from "@react-three/rapier";
// import * as THREE from "three";
// import { useNavigate } from "react-router-dom";
// import RapierReady from "./RapierReady.jsx";

// /* ✅ Post-processing */
// import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

// const asset = (p) => {
//   const base = (import.meta.env?.BASE_URL ?? "/").replace(/\/+$/, "");
//   const rel = String(p).replace(/^\/+/, "");
//   return `${base}/${rel}`;
// };

// const KEYMAP = [
//   { name: "forward", keys: ["KeyW", "ArrowUp"] },
//   { name: "backward", keys: ["KeyS", "ArrowDown"] },
//   { name: "left", keys: ["KeyA", "ArrowLeft"] },
//   { name: "right", keys: ["KeyD"] },
//   { name: "jump", keys: ["Space"] },
//   { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
//   { name: "interact", keys: ["KeyE", "Enter"] },
// ];

// const PAINTINGS = [
//   { id: "p1", title: "Sportbit", img: asset("/gallery/sport.jpg"), position: [-9.9, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p2", title: "Monochrome City", img: asset("/gallery/art.jpg"), position: [-3.4, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p3", title: "Monochrome City", img: asset("/gallery/mgmt.jpg"), position: [3.2, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p4", title: "Monochrome City", img: asset("/gallery/restora.jpg"), position: [9.2, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p5", title: "Monochrome City", img: asset("/gallery/shop.jpg"), position: [9.8, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p6", title: "Monochrome City", img: asset("/gallery/tour.jpg"), position: [3.2, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p7", title: "Monochrome City", img: asset("/gallery/sport.jpg"), position: [-3.4, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p8", title: "Monochrome City", img: asset("/gallery/sport.jpg"), position: [-9.9, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
// ];

// const SPEED = 4.4;
// const SPRINT = 8.8;
// const JUMP = 14.5;
// const PLAYER_HEIGHT = 3.35;
// const PLAYER_RADIUS = 0.35;

// /* -------------------- 3D Scene -------------------- */
// function BalconyScene({ onSpawn }) {
//   const { scene } = useGLTF("/models/gallery2.glb");

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

//     // Keep mesh shading sensible; allow IBL to work
//     scene.traverse((o) => {
//       if (o.isLight) o.castShadow = true;
//       if (o.isMesh) {
//         o.castShadow = true;
//         o.receiveShadow = true;
//         if (o.material) {
//           if ("envMapIntensity" in o.material) o.material.envMapIntensity = 1.0;
//           // a tiny bit shinier so speculars pop under the spot light
//           if (o.material.roughness !== undefined) {
//             o.material.roughness = Math.min(o.material.roughness, 0.55);
//           }
//           o.material.needsUpdate = true;
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
//       {/* frame */}
//       <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
//         <boxGeometry args={[size[0] + 0.08, size[1] + 0.08, 0.06]} />
//         <meshStandardMaterial metalness={0.1} roughness={0.2} color="#2b2b2b" />
//       </mesh>

//       {/* art */}
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

//       {/* hover glow (unchanged UI cue) */}
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
//           padding: "6px 10px",
//           borderRadius: 10,
//           background: "rgba(0, 0, 0, 0.11)",
//           color: "#fff",
//           fontSize: 8,
//           border: "1px solid rgba(255, 255, 255, 0.1)",
//           pointerEvents: "none",
//           whiteSpace: "nowrap",
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
//     if (!pressed.interact || !pointerLocked) return;
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

// /* Bridge: lock state */
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

// /* -------------------- Page -------------------- */
// export default function GalleryPage() {
//   const [locked, setLocked] = useState(false);
//   const [spawn, setSpawn] = useState(null);
//   const [active, setActive] = useState(null);
//   const plcRef = useRef();
//   const navigate = useNavigate();

//   return (
//     <>
//       {!locked && (
//         <button
//           onClick={() => plcRef.current?.lock()}
//           style={{
//             position: "fixed", inset: 0, margin: "auto",
//             width: 280, height: 120, background: "rgba(0,0,0,0.6)",
//             color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
//             borderRadius: 106, fontSize: 16, backdropFilter: "blur(4px)", zIndex: 30
//           }}
//         >
//           Click to enter • WASD / Shift / Space
//         </button>
//       )}

//       {/* Crosshair */}
//       <div
//         style={{
//           position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
//           width: 8, height: 8, border: "2px solid rgba(255,255,255,0.8)", borderRadius: 9999,
//           backgroundColor: "rgba(255, 255, 255, 1)", pointerEvents: "none", opacity: locked ? 1 : 0.35, zIndex: 20
//         }}
//       />

//       {active && (
//         <div
//           style={{
//             position: "fixed", inset: 0, zIndex: 50, display: "grid", placeItems: "center",
//             background: "rgba(0, 0, 0, 0.63)", transition: "background 160ms ease",
//           }}
//           onClick={() => setActive(null)}
//         >
//           <div
//             className="modalCard"
//             style={{
//               background: "#ffffff4c", backdropFilter: "blur(104px)",
//               border: "1px solid rgba(255,255,255,0.15)", borderRadius: 50,
//               padding: 16, width: "min(56vw, 960px)", maxHeight: "86vh", overflow: "auto",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
//               <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{active.title}</h3>
//               <button
//                 onClick={() => setActive(null)}
//                 style={{
//                   background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
//                   borderRadius: 10, padding: "6px 10px",
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//             <img src={active.img} alt={active.title} style={{ width: "100%", height: "auto", borderRadius: 10, display: "block" }} />
//             <div style={{ marginTop: 12, color: "#fff", lineHeight: 1.6, fontSize: 14, opacity: 0.95 }}>
//               {active.desc || "—"}
//             </div>
//           </div>
//         </div>
//       )}

//       <KeyboardControls map={KEYMAP}>
//         <Canvas
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
//             gl.toneMappingExposure = 0.2; // ⬅ small lift so peaks cross bloom threshold
//             gl.shadowMap.enabled = true;
//             gl.shadowMap.type = THREE.PCFSoftShadowMap;
//             scene.fog = new THREE.FogExp2("#0c0c12", 0.02);
//           }}
//           camera={{ fov: 68, near: 0.1, far: 200 }}
//         >
//           {/* Base lights */}
//           <ambientLight intensity={0.35} />
//           <directionalLight
//             position={[5, 8, 3]}
//             intensity={1.15}
//             castShadow
//             shadow-bias={-0.0003}
//             shadow-mapSize-width={2048}
//             shadow-mapSize-height={2048}
//           />

//           {/* ✅ IBL lights the scene but NOT the background to preserve contrast */}
//           <Environment
//             files="/hdr/jungle.hdr"
//             background={false}
//             environmentIntensity={1.0}
//             blur={0}
//           />

//           {/* ⭐ Accent lights to create hot spots for bloom */}
//           <pointLight position={[0, 4, 0]} intensity={0.18} distance={14} decay={2} />
//           <spotLight
//             position={[0, 6.2, 5.0]}
//             target-position={[0, 3.5, 3.6]}
//             intensity={.3}
//             angle={0.35}
//             penumbra={0.6}
//             castShadow
//           />

//           <RapierReady>
//             <Physics gravity={[0, -9.81, 0]}>
//               <Suspense fallback={<Html center style={{ color: "#fff" }}>Loading…</Html>}>
//                 <BalconyScene onSpawn={setSpawn} />
//               </Suspense>

//               <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={30} blur={2.5} far={20} />

//               <PaintingsManager config={PAINTINGS} onOpen={setActive} maxDistance={8} pointerLocked={locked} />
//               {spawn && <Player spawn={spawn} />}
//             </Physics>
//           </RapierReady>

//           {/* ✅ Post FX identical to your “good bloom” page, but stronger threshold */}
//           <EffectComposer disableNormalPass>
//             <Bloom
//               mipmapBlur
//               intensity={0.4}
//               luminanceThreshold={0.38}   // lower threshold so highlights bloom
//               luminanceSmoothing={0.22}
//             />
//             <Vignette eskil={false} offset={0.08} darkness={0.28} />
//           </EffectComposer>

//           <PointerLockControls ref={plcRef} />
//           <LockBridge plcRef={plcRef} setLocked={setLocked} />
//         </Canvas>
//       </KeyboardControls>
//     </>
//   );
// }

// useGLTF.preload("/models/gallery2.glb");

















// testing update for ball simulaton 
import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
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
} from "@react-three/drei";
import { Physics, RigidBody, CapsuleCollider, BallCollider, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import RapierReady from "./RapierReady.jsx";

/* ----------------------------- utils ----------------------------- */
const asset = (p) => {
  const base = (import.meta.env?.BASE_URL ?? "/").replace(/\/+$/, "");
  const rel = String(p).replace(/^\/+/, "");
  return `${base}/${rel}`;
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

/* ----------------------------- paintings ------------------------- */
const PAINTINGS = [
  { id: "p1", title: "Sportbit", img: asset("/gallery/sport.jpg"), position: [-9.9, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "SportBit is an advanced AI-powered sports management system built to revolutionize how sports organizations operate. It offers an integrated platform for players, managers, clubs, and administrators to manage data, performance, and communication efficiently. Using artificial intelligence, SportBit provides predictive analytics, performance insights, and talent evaluation to help teams make smarter decisions. The system includes features like personalized dashboards, performance tracking, video analysis, and player profile management. It also simplifies administrative tasks such as scheduling, reporting, and communication. Designed with scalability in mind, SportBit caters to both amateur and professional levels of sports management. By combining technology and sports intelligence, it bridges the gap between athletic potential and data-driven performance optimization." },

  { id: "p2", title: "F&B", img: asset("/gallery/art.jpg"), position: [-3.4, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "The F&B Restaurant Management System is an intelligent platform designed to streamline restaurant operations through automation and centralized control. It enables efficient management of orders, billing, inventory, and staff while improving kitchen workflows and customer service. With features like digital menus, real-time order tracking, and sales analytics, it helps optimize performance and reduce operational errors. Suitable for cafés, restaurants, and large F&B chains, the system enhances efficiency, profitability, and customer satisfaction through data-driven insights and seamless coordination." },


  { id: "p3", title: "Tour Guide", img: asset("/gallery/mgmt.jpg"), position: [3.2, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "The AI Tour Guide Platform is an intelligent travel companion designed to enhance the touring experience through real-time, personalized guidance. It uses artificial intelligence to provide curated itineraries, location-based recommendations, and interactive voice or chat assistance. The platform helps travelers explore destinations efficiently by suggesting nearby attractions, dining options, and cultural insights. With smart navigation and multilingual support, the AI Tour Guide makes travel more convenient, engaging, and informative for users across the globe." },


  { id: "p4", title: "EEC", img: asset("/gallery/restora.jpg"), position: [9.2, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "Electronic Educare is an AI-powered learning management system designed to revolutionize digital education through intelligent automation and personalization. It offers an interactive platform for students, teachers, and institutions to manage courses, track progress, and enhance learning outcomes. Using artificial intelligence, it provides personalized study plans, performance analytics, and adaptive assessments to cater to each learner’s needs. The system also supports live classes, assignments, and real-time feedback, making education more engaging, efficient, and accessible for all users." },


  { id: "p5", title: "Yarrowtech", img: asset("/gallery/shop.jpg"), position: [9.8, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "YarrowTech is a modern technology service company specializing in building high-quality web applications, software solutions, and digital platforms. It offers end-to-end services including UI/UX design, web and mobile app development, and system integration tailored to client needs. With a focus on innovation, scalability, and performance, YarrowTech helps businesses establish a strong digital presence. The company’s mission is to deliver reliable, cutting-edge solutions that drive growth and transform ideas into impactful digital experiences." },


  { id: "p6", title: "ArtBlock", img: asset("/gallery/tour.jpg"), position: [3.2, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "ArtBlock is a creative service platform designed for artists to share, showcase, and discover artwork from around the world. It provides a vibrant digital space where creators can upload their art, connect with audiences, and collaborate with other artists. The platform supports various art forms — from digital illustrations to traditional paintings — promoting creativity and community engagement. With features like artist profiles, feedback systems, and curated galleries, ArtBlock empowers artists to gain visibility, inspiration, and opportunities in the global art ecosystem." },


  { id: "p7", title: "Police & Fire management system", img: asset("/gallery/sport.jpg"), position: [-3.4, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "The Police and Fire Management System is an integrated digital platform designed to streamline emergency response and public safety operations. It enables efficient coordination between police, fire, and rescue departments through real-time communication and data sharing. The system manages incident reporting, resource allocation, and personnel tracking to ensure quick and effective responses. With features like live alerts, analytics, and case management, it enhances operational efficiency, accountability, and overall community safety." },


  { id: "p8", title: "RMS", img: asset("/gallery/mgmt.jpg"), position: [-9.9, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "The Retail Management System (RMS) is a comprehensive solution designed to simplify and automate retail operations. It enables businesses to efficiently manage sales, inventory, billing, and customer relationships from a single platform. With built-in analytics and reporting tools, RMS helps retailers track performance, forecast demand, and make data-driven decisions. The system improves operational efficiency, reduces manual errors, and enhances the overall shopping experience for both customers and store managers" },
];



// const PAINTINGS = [
//   { id: "p1", title: "Sportbit", position: [-9.9, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "SportBit is an AI-powered sports management system designed to streamline operations for players, clubs, managers, and administrators. It provides intelligent performance analytics, player management, and automated insights to enhance decision-making. With features like dashboards, profile management, and real-time data tracking, SportBit modernizes how sports organizations manage talent and performance." },

//   { id: "p2", title: "F&B",  position: [-3.4, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p3", title: "Tour Guide",  position: [3.2, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p4", title: "Electronic Educare",  position: [9.2, 3.6, 3.9], rotation: [0, Math.PI, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p5", title: "yarrpwtech",  position: [9.8, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p6", title: "Artblock",  position: [3.2, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p7", title: "Avant Garde",  position: [-3.4, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
//   { id: "p8", title: "Retail management system",  position: [-9.9, 3.6, -3.9], rotation: [0, Math.PI * 2, 0], size: [3.2, 4], desc: "Real-time sports analytics and club management." },
// ];

/* ----------------------------- tuning ---------------------------- */
const SPEED = 4.4;
const SPRINT = 8.8;
const JUMP = 14.5;
const PLAYER_HEIGHT = 3.35;
const PLAYER_RADIUS = 0.35;

/* =========================== Scene =============================== */
function BalconyScene({ onSpawn }) {
  const { scene } = useGLTF("/models/gallery2.glb");

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
        if (o.material && "envMapIntensity" in o.material) o.material.envMapIntensity = 1.0;
        if (o.material) o.material.needsUpdate = true;
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
function Player({ spawn = [0, 1.2, 3] }) {
  const { camera } = useThree();
  const bodyRef = useRef();
  const [, get] = useKeyboardControls();

  const forward = useRef(new THREE.Vector3()).current;
  const right = useRef(new THREE.Vector3()).current;
  const dir = useRef(new THREE.Vector3()).current;

  useEffect(() => {
    camera.position.set(spawn[0], spawn[1] + (PLAYER_HEIGHT / 2) - PLAYER_RADIUS, spawn[2]);
  }, [camera, spawn]);

  useFrame(() => {
    const rb = bodyRef.current;
    if (!rb) return;

    const pressed = get();
    const base = pressed.sprint ? SPEED * SPRINT : SPEED;

    forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    dir.set(0, 0, 0);
    if (pressed.forward) dir.add(forward);
    if (pressed.backward) dir.add(forward.clone().negate());
    if (pressed.left) dir.add(right.clone().negate());
    if (pressed.right) dir.add(right);

    if (dir.lengthSq() > 0) dir.normalize().multiplyScalar(base);

    const lv = rb.linvel();
    rb.setLinvel({ x: dir.x, y: lv.y, z: dir.z }, true);

    if (pressed.jump && Math.abs(lv.y) < 0.05) {
      rb.applyImpulse({ x: 0, y: JUMP, z: 0 }, true);
    }

    const t = rb.translation();
    camera.position.set(t.x, t.y + (PLAYER_HEIGHT / 2) - PLAYER_RADIUS, t.z);
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
      <CapsuleCollider args={[PLAYER_HEIGHT / 2 - PLAYER_RADIUS, PLAYER_RADIUS]} />
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
          padding: "6px 10px",
          borderRadius: 10,
          background: "rgba(0, 0, 0, 0.11)",
          color: "#fff",
          fontSize: 8,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {title} • Press <b>E</b> / Click
      </Html>
    </group>
  );
}

function PaintingsManager({ config, onOpen, maxDistance = 8, pointerLocked = false }) {
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
    const h = hits.find((x) => x.object?.userData?.isPainting && x.distance <= maxDistance);
    if (h?.object?.userData?.paintingMeta) onOpen?.(h.object.userData.paintingMeta);
  });

  useEffect(() => {
    const handleTryOpen = (e) => {
      if (!pointerLocked) return;
      if (e.type === "mousedown" && e.button !== 0) return;

      ray.setFromCamera(ndc, camera);
      const root = groupRef.current?.children ?? [];
      const hits = ray.intersectObjects(root, true);
      const h = hits.find((x) => x.object?.userData?.isPainting && x.distance <= maxDistance);
      if (h?.object?.userData?.paintingMeta) onOpen?.(h.object.userData.paintingMeta);
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
  // tweak to fit your gallery dimensions (in meters)
  const halfX = 12;   // room half-width
  const halfY = 6;    // room half-height
  const halfZ = 8;    // room half-depth
  const thick = 0.25; // wall thickness

  return (
    <RigidBody type="fixed">
      {/* Floor */}
      <CuboidCollider args={[halfX, thick, halfZ]} position={[0, -thick, 0]} />
      {/* Ceiling */}
      <CuboidCollider args={[halfX, thick, halfZ]} position={[0, 2 * halfY + thick, 0]} />
      {/* Walls */}
      <CuboidCollider args={[thick, halfY, halfZ]} position={[-halfX - thick, halfY, 0]} />
      <CuboidCollider args={[thick, halfY, halfZ]} position={[ halfX + thick, halfY, 0]} />
      <CuboidCollider args={[halfX, halfY, thick]} position={[0, halfY, -halfZ - thick]} />
      <CuboidCollider args={[halfX, halfY, thick]} position={[0, halfY,  halfZ + thick]} />
    </RigidBody>
  );
}


/* ===================== NEW: Ball + Shooter ======================= */
const MAX_BALLS = 60;
const BALL_RADIUS = 0.18;       // small ping-pong-ish
const BALL_POWER = 50;          // impulse strength (tweak)
const BALL_SPAWN_OFFSET = 0.6;  // meters in front of camera
const BALL_TTL_MS = 20000;      // auto-despawn in 20s

function Ball({ id, position, velocity, onExpire }) {
  const ref = useRef();

  // apply initial velocity/impulse on mount
  useEffect(() => {
    const rb = ref.current;
    if (!rb) return;
    // set initial linear velocity so it’s deterministic & stable
    rb.setLinvel({ x: velocity[0], y: velocity[1], z: velocity[2] }, true);
    const timer = setTimeout(() => onExpire?.(id), BALL_TTL_MS);
    return () => clearTimeout(timer);
  }, [id, velocity, onExpire]);

  return (
    <RigidBody
      ref={ref}
      position={position}
      colliders={false}
      restitution={0.45}      // a bit bouncy
      friction={0.6}
      linearDamping={0.02}
      angularDamping={0.01}
      canSleep={true}
      ccd={true}              // continuous collision detection for fast shots
      mass={0.25}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[BALL_RADIUS, 24, 24]} />
        <meshStandardMaterial roughness={0.35} metalness={0.05} color={"#f5f5f5"} />
      </mesh>
      {/* precise collider to match the mesh */}
      {/* <mesh visible={false}>
        <sphereGeometry args={[BALL_RADIUS]} />
      </mesh> */}
      <BallCollider args={[BALL_RADIUS]}
      restitution={0.25}  
      friction={0.35} 
      />
    </RigidBody>
  );
}

// headless controller that spawns balls on click while pointer-locked
function Shooter({ pointerLocked, addBall }) {
  const { camera } = useThree();
  const dir = useRef(new THREE.Vector3()).current;

  useEffect(() => {
    const onFire = (e) => {
      if (!pointerLocked) return;
      // left mouse only (ignore right/middle)
      if (e.type === "mousedown" && e.button !== 0) return;

      // direction from camera
      camera.getWorldDirection(dir);
      dir.normalize();

      // spawn slightly in front of camera
      const spawn = new THREE.Vector3().copy(camera.position).add(dir.clone().multiplyScalar(BALL_SPAWN_OFFSET));
      // initial velocity along view direction
      const vel = dir.clone().multiplyScalar(BALL_POWER);

      addBall({
        id: crypto.randomUUID(),
        position: [spawn.x, spawn.y, spawn.z],
        velocity: [vel.x, vel.y, vel.z],
      });
    };

    window.addEventListener("mousedown", onFire);
    return () => window.removeEventListener("mousedown", onFire);
  }, [camera, pointerLocked, addBall]);

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

/* ============================ Page =============================== */
export default function GalleryPage() {
  const [locked, setLocked] = useState(false);
  const [spawn, setSpawn] = useState(null);
  const [active, setActive] = useState(null);
  const plcRef = useRef();
  const navigate = useNavigate();
 

  // NEW: bullets state (we keep a small window for performance)
  const [balls, setBalls] = useState([]);





  
  

 


  const addBall = (b) =>
    setBalls((prev) => {
      const next = [...prev, { ...b, createdAt: performance.now() }];
      // cap total count
      if (next.length > MAX_BALLS) next.splice(0, next.length - MAX_BALLS);
      return next;
    });
  const removeBall = (id) => setBalls((prev) => prev.filter((x) => x.id !== id));

  // background cleanup in case of TTL
  useEffect(() => {
    const tick = setInterval(() => {
      const now = performance.now();
      setBalls((prev) => prev.filter((b) => now - b.createdAt < BALL_TTL_MS));
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  return (
    <>
      {!locked && (
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
          Click to enter • WASD / Shift / Space • Click to shoot
        </button>
      )}

      {/* Crosshair */}
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
          opacity: locked ? 1 : 0.35,
          zIndex: 20,
        }}
      />

      {/* Painting viewer modal */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{active.title}</h3>
              <button
                onClick={() => setActive(null)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 10,
                  padding: "6px 10px",
                }}
              >
                Close
              </button>
            </div>
            <img src={active.img} alt={active.title} style={{ width: "100%", height: "auto", borderRadius: 10, display: "block" }} />
            <div style={{ marginTop: 12, color: "#fff", lineHeight: 1.6, fontSize: 14, opacity: 0.95 }}>
              {active.desc || "—"}
            </div>
          </div>
        </div>
      )}

      <KeyboardControls map={KEYMAP}>
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: true,
            physicallyCorrectLights: true,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor("#0b0b12", 1);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.fog = new THREE.FogExp2("#0c0c12", 0.02);
          }}
          camera={{ fov: 68, near: 0.1, far: 200 }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight
            position={[5, 8, 3]}
            intensity={1.1}
            castShadow
            shadow-bias={-0.0003}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Environment files="/hdr/jungle.hdr" background blur={0} />

          <RapierReady>
            {/* <Physics gravity={[0, -9.81, 0]}> */}
            <Physics gravity={[0, -9.81, 0]} timeStep={1/60} substeps={2}>
              <Suspense fallback={<Html center style={{ color: "#fff" }}>Loading…</Html>}>
                <BalconyScene onSpawn={setSpawn} />
              </Suspense>
              

              <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={30} blur={2.5} far={20} />

              {/* Paintings (kept as-is) */}
              <PaintingsManager config={PAINTINGS} onOpen={setActive} maxDistance={8} pointerLocked={locked} />

              {/* Player */}
              {spawn && <Player spawn={spawn} />}

              {/* NEW: Shooter controller */}
              <Shooter
                pointerLocked={locked && !active}
                addBall={(b) => addBall(b)}
              />

              {/* NEW: Render balls */}
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

          <PointerLockControls ref={plcRef} />
          <LockBridge plcRef={plcRef} setLocked={setLocked} />
        </Canvas>
      </KeyboardControls>
    </>
  );
}

useGLTF.preload("/models/gallery2.glb");
