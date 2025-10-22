// // Baymaks Home Page — Fullscreen 3D + UI overlay
// // - Local GLB robot centered
// // - Eyes (Pupil_L / Pupil_R) follow mouse
// // - Optional body tilt (Body / Head nodes) like Baymax
// // - Orange background with vignette
// //
// // File placement: public/models/robot.glb
// // Deps: npm i three @react-three/fiber @react-three/drei @react-three/postprocessing

// import React, { useEffect, useRef, Suspense } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useGLTF, Environment, Html, OrbitControls, Bounds, Center } from "@react-three/drei";
// import * as THREE from "three";
// import { EffectComposer, Vignette } from "@react-three/postprocessing";

// const ORANGE = "#c45100";        // edge tone
// const ORANGE_CENTER = "#ff7a1a";  // center tone

// function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

// function RobotGLB({ url = "/models/bayma.glb", pointer, enableTilt = true }) {
//     const { scene } = useGLTF(url);
//     const bodyRef = useRef(null);
//     const headRef = useRef(null);
//     const pupilL = useRef(null);
//     const pupilR = useRef(null);

//     useEffect(() => {
//         if (!scene) return;
//         scene.traverse((o) => {
//             if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; }
//         });
//         bodyRef.current = scene.getObjectByName("Body") ?? null;
//         headRef.current = scene.getObjectByName("Head") ?? null;
//         pupilL.current = scene.getObjectByName("Pupil_L") ?? null;
//         pupilR.current = scene.getObjectByName("Pupil_R") ?? null;
//     }, [scene]);

//     const maxTilt = THREE.MathUtils.degToRad(8);
//     const eyeMaxOffset = 0.12; // adjust per eye scale

//     useFrame((_, dt) => {
//         const tX = clamp(pointer.current.x, -1, 1);
//         const tY = clamp(pointer.current.y, -1, 1);

//         // Optional subtle tilt
//         if (enableTilt && bodyRef.current) {
//             bodyRef.current.rotation.x = THREE.MathUtils.damp(bodyRef.current.rotation.x, tY * maxTilt, 6, dt);
//             bodyRef.current.rotation.y = THREE.MathUtils.damp(bodyRef.current.rotation.y, tX * maxTilt * 0.8, 6, dt);
//         }
//         if (enableTilt && headRef.current) {
//             headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, tX * 0.35, 6, dt);
//             headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, tY * 0.25, 6, dt);
//         }

//         // Pupils follow pointer
//         const angle = Math.atan2(tY, tX);
//         const mag = clamp(Math.hypot(tX, tY), 0, 1) * eyeMaxOffset;
//         const px = Math.cos(angle) * mag;
//         const py = Math.sin(angle) * mag;
//         if (pupilL.current) pupilL.current.position.set(px, py, pupilL.current.position.z);
//         if (pupilR.current) pupilR.current.position.set(px, py, pupilR.current.position.z);
//     });

//     return <primitive object={scene} position={[0, 0, 0]} />;
// }

// function Scene({ pointer }) {
//     return (
//         <Canvas shadows camera={{ position: [0, 1.9, 6], fov: 45 }}
//             style={{ width: "100vw", height: "100vh", display: "block" }}>
//             {/* Orange background + fog for depth */}
//             <color attach="background" args={[ORANGE_CENTER]} />
//             <fog attach="fog" args={[ORANGE_CENTER, 20, 120]} />

//             {/* Lighting */}
//             <hemisphereLight intensity={0.7} groundColor={new THREE.Color("#3b1f00")} />
//             <directionalLight castShadow position={[5, 10, 5]} intensity={1.1}
//                 shadow-mapSize-width={2048} shadow-mapSize-height={2048} />

//             {/* Soft ground shadow */}
//             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
//                 <planeGeometry args={[40, 40]} />
//                 <shadowMaterial transparent opacity={0.25} />
//             </mesh>

//             {/* Robot model (centered) */}
//             {/* <group position={[0, -0.2, 0]}>
//         <RobotGLB pointer={pointer} enableTilt />
//       </group> */}

//             <group position={[0, -5, 0]} scale={[1.2, 1.2, 1.2]}>
//                 <RobotGLB pointer={pointer} enableTilt />
//             </group>

//             {/* <Suspense fallback={<Html center>Loading…</Html>}>
//                 <Bounds fit observe clip margin={1.2}>
//                     <Center>
//                         <RobotGLB pointer={pointer} enableTilt />
//                     </Center>
//                 </Bounds>
//             </Suspense> */}


//             {/* Environment for subtle highlights */}
//             <Environment preset="sunset" intensity={0} />

//             {/* Vignette */}
//             <EffectComposer>
//                 <Vignette eskil={false} offset={0.35} darkness={0.65} />
//             </EffectComposer>

//             {/* Keep orbit disabled so robot stays centered like mock */}
//             <OrbitControls enabled={false} />

//             {/* Mobile hint */}
//             <Html position={[0, -2.4, 0]} center>
//                 <div style={{ color: "#2b2b2b", fontSize: 12, opacity: 0.5, userSelect: "none" }}>Move your mouse / finger</div>
//             </Html>
//         </Canvas>
//     );
// }

// export default function BaymaksHome() {
//     const pointer = useRef({ x: 0, y: 0 });

//     // Pointer normalization for desktop + touch
//     const handlePointer = (e) => {
//         const x = (e.clientX ?? (e.touches?.[0]?.clientX ?? 0)) / window.innerWidth;
//         const y = (e.clientY ?? (e.touches?.[0]?.clientY ?? 0)) / window.innerHeight;
//         pointer.current.x = clamp(x * 2 - 1, -1, 1);
//         pointer.current.y = clamp(-(y * 2 - 1), -1, 1);
//     };

//     return (
//         <div
//             onMouseMove={handlePointer}
//             onTouchMove={handlePointer}
//             style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", background: ORANGE }}
//         >
//             {/* Radial overlay to mimic the mock's center glow */}
//             <div style={{
//                 position: "absolute", inset: 0, pointerEvents: "none",
//                 background: `radial-gradient(60vw 60vw at 60% 40%, ${ORANGE_CENTER} 0%, ${ORANGE} 70%, #7a2f00 100%)`
//             }} />

//             {/* 3D Canvas */}
//             <div style={{ position: "absolute", inset: 0 }}>
//                 <Scene pointer={pointer} />
//             </div>

//             {/* UI Overlay (like screenshot) */}
//             {/* <header style={{ position: "absolute", top: 24, left: 32, right: 32, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
//         <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: 1 }}>BAYMAKS</div>
//         <nav style={{ display: "flex", gap: 36, fontSize: 22, fontWeight: 600 }}>
//           <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
//           <a href="#about" style={{ color: "#fff", textDecoration: "none" }}>About</a>
//           <a href="#projects" style={{ color: "#fff", textDecoration: "none" }}>Projects</a>
//           <a href="#contact" style={{ color: "#fff", textDecoration: "none" }}>Contact</a>
//         </nav>
//       </header> */}

//             {/* Big faint watermark */}
//             <div style={{ position: "absolute", top: 10, left: 24, fontSize: 160, fontWeight: 800, color: "rgba(255,255,255,0.06)", letterSpacing: 2, userSelect: "none" }}>BAYMAKS</div>

//             {/* Left content block(s) */}
//             <section style={{ position: "absolute", left: 32, bottom: 140, color: "#fff", maxWidth: 360 }}>
//                 <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, fontFamily:"Manrope" }}>Baymaks 1.0</h1>
//                 <h2 style={{ fontSize: 18, fontWeight: 600, margin: "8px 0 6px" }}>Hover bot</h2>
//                 <p style={{ fontSize:8, margin: 0, opacity: 0.9 }}>Multimodel AI bitrex</p>
//                 <p style={{ fontSize:8, margin: "8px 0 0", opacity: 0.8 }}>Just a placeholder text</p>
//             </section>

//             <section style={{ position: "absolute", left: 32, bottom: 40, color: "#fff", maxWidth: 360, opacity: 0.95 }}>
//                 <div style={{ lineHeight: 1.6, fontSize:8 }}>
//                     <div>Baymaks 1.0</div>
//                     <div>Hover bot</div>
//                     <div>Multimodel AI bitrex</div>
//                     <div>Lorem 400 placeholder text2k3</div>
//                 </div>
//             </section>
//         </div>
//     );
// }

// // Preload model
// useGLTF.preload("/models/bayma.glb");


















// Baymaks Home Page — Fullscreen 3D + UI overlay
// - Local GLB robot centered
// - Eyes (Pupil_L / Pupil_R) follow mouse (X & Y)
// - Optional body tilt (Body / Head nodes) like Baymax
// - Orange background with vignette
//
// File placement: public/models/bayma.glb
// Deps: npm i three @react-three/fiber @react-three/drei @react-three/postprocessing

import React, { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    useGLTF,
    Environment,
    Html,
    OrbitControls,
    Bounds,
    Center,
} from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Vignette } from "@react-three/postprocessing";

const ORANGE = "#c45100";        // edge tone
const ORANGE_CENTER = "#ff7a1a"; // center tone
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function RobotGLB({ url = "/models/bayma.glb", pointer, enableTilt = true }) {
    const { scene } = useGLTF(url);

    const bodyRef = useRef(null);
    const headRef = useRef(null);
    const pupilL = useRef(null);
    const pupilR = useRef(null);

    // cache each pupil's original local position (its “center”)
    const baseL = useRef(new THREE.Vector3());
    const baseR = useRef(new THREE.Vector3());
    const inited = useRef(false);

    useEffect(() => {
        if (!scene) return;

        scene.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
                o.frustumCulled = false;
            }
        });

        bodyRef.current = scene.getObjectByName("Body") ?? null;
        headRef.current = scene.getObjectByName("Head") ?? null;
        pupilL.current = scene.getObjectByName("Pupil_L") ?? null;
        pupilR.current = scene.getObjectByName("Pupil_R") ?? null;

        // store starting local positions once
        if (!inited.current && pupilL.current && pupilR.current) {
            baseL.current.copy(pupilL.current.position);
            baseR.current.copy(pupilR.current.position);
            inited.current = true;
        }
    }, [scene]);

    const maxTilt = THREE.MathUtils.degToRad(8);
    const eyeRadius = 0.12; // pupil travel radius in meters

    useFrame((_, dt) => {
        const tX = clamp(pointer.current.x, -1, 1);
        const tY = clamp(pointer.current.y, -1, 1);

        // Optional subtle tilt
        if (enableTilt && bodyRef.current) {
            bodyRef.current.rotation.x = THREE.MathUtils.damp(
                bodyRef.current.rotation.x,
                tY * maxTilt,
                6,
                dt
            );
            bodyRef.current.rotation.y = THREE.MathUtils.damp(
                bodyRef.current.rotation.y,
                tX * maxTilt * 0.8,
                6,
                dt
            );
        }
        if (enableTilt && headRef.current) {
            headRef.current.rotation.y = THREE.MathUtils.damp(
                headRef.current.rotation.y,
                tX * 0.35,
                6,
                dt
            );
            headRef.current.rotation.x = THREE.MathUtils.damp(
                headRef.current.rotation.x,
                tY * 0.25,
                6,
                dt
            );
        }

        // Pupils follow pointer in a circular limit from their own base positions
        const angle = Math.atan2(tY, tX);
        const mag = Math.min(Math.hypot(tX, tY), 1) * eyeRadius;
        const offX = Math.cos(angle) * mag;
        const offY = Math.sin(angle) * mag;

        if (pupilL.current) {
            pupilL.current.position.set(
                baseL.current.x + offX,
                baseL.current.y + offY,
                baseL.current.z
            );
        }
        if (pupilR.current) {
            pupilR.current.position.set(
                baseR.current.x + offX,
                baseR.current.y + offY,
                baseR.current.z
            );
        }
    });

    return <primitive object={scene} />;
}

function Scene({ pointer }) {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 1.5, 5], fov: 45, near: 0.1, far: 500 }}
            style={{ width: "100vw", height: "100vh", display: "block" }}
        >
            {/* Orange background + fog for depth */}
            <color attach="background" args={[ORANGE_CENTER]} />
            <fog attach="fog" args={[ORANGE_CENTER, 20, 120]} />

            {/* Lighting */}
            <hemisphereLight
                intensity={0.7}
                groundColor={new THREE.Color("#3b1f00")}
            />
            <directionalLight
                castShadow
                position={[5, 10, 5]}
                intensity={1.1}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            {/* Soft ground shadow */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -1.6, 0]}
                receiveShadow
            >
                <planeGeometry args={[40, 40]} />
                <shadowMaterial transparent opacity={0.25} />
            </mesh>

            {/* Auto-center / auto-fit the model, regardless of export scale/offset */}


            <group position={[0, -4, -4]} scale={[1.2, 1.2, 1.2]}>
                <RobotGLB pointer={pointer} enableTilt />
            </group>



            {/* <Suspense fallback={<Html center>Loading…</Html>}>
        <Bounds fit observe clip margin={1.2}>
          <Center>
            <RobotGLB pointer={pointer} enableTilt />
          </Center>
        </Bounds>
      </Suspense> */}

            {/* Environment highlights */}
            <Environment preset="sunset" intensity={0.2} />

            {/* Vignette */}
            <EffectComposer>
                <Vignette eskil={false} offset={0.35} darkness={0.65} />
            </EffectComposer>

            {/* Keep orbit disabled to match the mock */}
            <OrbitControls enabled={false} />

            {/* Mobile hint */}
            {/* <Html position={[0, -2.4, 0]} center>
        <div
          style={{
            color: "#2b2b2b",
            fontSize: 12,
            opacity: 0.5,
            userSelect: "none",
          }}
        >
          Move your mouse / finger
        </div>
      </Html> */}
        </Canvas>
    );
}

export default function BaymaksHome() {
    const pointer = useRef({ x: 0, y: 0 });

    // Pointer normalization for desktop + touch
    const handlePointer = (e) => {
        const x =
            (e.clientX ?? (e.touches?.[0]?.clientX ?? 0)) / window.innerWidth;
        const y =
            (e.clientY ?? (e.touches?.[0]?.clientY ?? 0)) / window.innerHeight;
        pointer.current.x = clamp(x * 2 - 1, -1, 1);
        pointer.current.y = clamp(-(y * 2 - 1), -1, 1);
    };

    return (
        <div
            onMouseMove={handlePointer}
            onTouchMove={handlePointer}
            style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                position: "relative",
                background: ORANGE,
            }}
        >
            {/* Radial overlay to mimic the mock's center glow */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: `radial-gradient(60vw 60vw at 60% 40%, ${ORANGE_CENTER} 0%, ${ORANGE} 70%, #7a2f00 100%)`,
                }}
            />

            {/* 3D Canvas */}
            <div style={{ position: "absolute", inset: 0 }}>
                <Scene pointer={pointer} />
            </div>

            {/* Big faint watermark */}
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    left: 24,
                    fontSize: 160,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.06)",
                    letterSpacing: 2,
                    userSelect: "none",
                    fontFamily: "Manrope",
                }}
            >
                BAYMA
            </div>

            {/* Left content blocks */}
            <section
                style={{
                    position: "absolute",
                    left: 32,
                    bottom: 140,
                    color: "#fff",
                    maxWidth: 360,
                }}
            >
                <h1
                    style={{
                        fontSize: 28,
                        fontWeight: 800,
                        margin: 0,
                        fontFamily: "Manrope",
                    }}
                >
                    Bayma 1.0
                </h1>
                <h2 style={{ fontSize: 18, fontWeight: 600, margin: "8px 0 6px" }}>
                    Hover bot
                </h2>
                <p style={{ fontSize: 8, margin: 0, opacity: 0.9 }}>
                    Multimodel AI bitrex
                </p>
                <p style={{ fontSize: 8, margin: "8px 0 0", opacity: 0.8 }}>
                    Just a placeholder text
                </p>
            </section>

            <section
                style={{
                    position: "absolute",
                    left: 32,
                    bottom: 40,
                    color: "#fff",
                    maxWidth: 360,
                    opacity: 0.95,
                }}
            >
                <div style={{ lineHeight: 1.6, fontSize: 8 }}>
                    <div>Bayma 1.0</div>
                    <div>Hover bot</div>
                    <div>Multimodel AI bitrex</div>
                    <div>Lorem 400 placeholder text2k3</div>
                </div>
            </section>
        </div>
    );
}

// Preload model
useGLTF.preload("/models/bayma.glb");
