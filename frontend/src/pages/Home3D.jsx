import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
    Environment,
    OrbitControls,
    Html,
    ContactShadows,
    useGLTF,
    Preload,
    AdaptiveDpr,
    PerformanceMonitor,
} from "@react-three/drei";
import { EffectComposer, Bloom, SSAO, Vignette } from "@react-three/postprocessing";
import { NormalPass } from "postprocessing";
import { extend } from "@react-three/fiber";
import DoorPortal from "../components/DoorPortal";
import TutorialHint from "../components/TutorialHint";
import { usePageTransition } from "../components/transition.jsx";
// import ViewTutorialIndicator from "../components/viewIndicator.jsx";


extend({ NormalPass });
// import { CameraControls } from "@react-three/drei";

/* ----------------------------- Config toggles ----------------------------- */
// const [autoRotate, setAutoRotate] = useState(true);
// Enable HDRI as visible background for Blender Cycles look
const USE_HDR_BACKGROUND = true;
// Use a high-quality HDRI (change to your preferred file)
const HDR_FILE = "/hdr/rural-road.exr";

// Initial hero angle (direction from which the camera looks at the model center)
const HERO_DIR = new THREE.Vector3(46, -10, -94).normalize(); // default-1.5, 0.5, 1.2    front-left, slightly above
const HERO_DISTANCE_MULT = 2.0; // how far back from the model size we stand (increase to see more)
const MIN_DISTANCE_MULT = 0.9;
const MAX_DISTANCE_MULT = 6.0;

/* --------------------------------- Loader -------------------------------- */
function Loader() {
    return (
        <Html center style={{ color: "#aaaaaaff", fontFamily: "Manrope , system-ui", fontSize: 24 }}>
            HOUSE OF MUSA Loading…
        </Html>
    );
}

/* --------------------------------- Model --------------------------------- */
function House({ onReady, scale = 1, rotation = [0, Math.PI * 0.15, 0], position = [0, -1, 0] }) {
    const gltf = useGLTF("/models/house3.glb");
    const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
    const group = useRef();

    useEffect(() => {
        if (!group.current) return;
        // Compute bounds once the model is in the scene
        const box = new THREE.Box3().setFromObject(group.current);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        onReady?.({ center, size });
    }, [onReady]);

    // Find portal anchors by empties named "DoorPortal_*"
    const portalAnchors = useMemo(() => {
        const pts = [];
        scene.traverse((obj) => {
            if (/^DoorPortal/i.test(obj.name)) pts.push(obj.position.clone());
        });
        return pts;
    }, [scene]);

    return (
        <group ref={group} position={position} rotation={rotation} scale={scale}>
            <primitive object={scene} />

            
            {portalAnchors.length === 0 && <DoorPortal position={[4, 1, 0.2]} />}
            {portalAnchors.map((p, i) => (
                <DoorPortal key={i} position={[p.x, p.y, p.z]} label="Enter" />
            ))}
        </group>
    );
}
useGLTF.preload("/models/house3.glb");

/* ---------------------------- Inner Scene node --------------------------- */
function Scene() {
    const { camera, invalidate } = useThree();
    const [autoRotate, setAutoRotate] = useState(true);
    const controls = useRef();
    const [perf, setPerf] = useState(1);
    const { start } = usePageTransition();

    // Idle preload to make subsequent interactions instant
    // useEffect(() => {
    //     const id = requestIdleCallback?.(() => Preload.all()) ?? setTimeout(() => Preload.all(), 300);
    //     return () => (cancelIdleCallback?.(id), clearTimeout(id));
    // }, []);

    const handleReady = ({ center, size }) => {
        // Choose a distance based on the model's overall size
        const maxDim = Math.max(size.x, size.y, size.z);
        const heroDist = maxDim * HERO_DISTANCE_MULT;
        const offset = center.clone().multiplyScalar(-1);

        // Position camera at hero direction * distance, looking at center
        const heroPos = center.clone().add(HERO_DIR.clone().multiplyScalar(heroDist));
        camera.position.copy(heroPos);
        camera.near = Math.max(0.01, heroDist / 200);
        camera.far = heroDist * 50;
        camera.updateProjectionMatrix();

        // Point controls to the model center and set zoom limits around it
        if (controls.current) {
            controls.current.target.copy(center);
            controls.current.minDistance = 2;
            controls.current.maxDistance = 40;
            controls.current.update();
        }
        invalidate(); // draw once with the new pose
    };

    return (
        <>
            {/* HDRI background for Blender Cycles look */}
            {USE_HDR_BACKGROUND && <color attach="background" args={["#fff"]} />}
            {/* indicator  */}
            {/* ✅ Tutorial Indicator Overlay */}
            {/* <ViewTutorialIndicator /> */}

            {/* Realistic lighting setup */}
            <hemisphereLight intensity={0.02} groundColor="#222" />
            <directionalLight
                castShadow
                position={[10, 15, 10]}
                intensity={.05}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                color="#cbcbcb"
            />

            <Suspense fallback={<Loader />}>
                <House onReady={handleReady} />


                {/* HDRI environment as visible skybox */}
                {USE_HDR_BACKGROUND ? (
                    <Environment files={HDR_FILE} background={false} />
                ) : (
                    <Environment preset="city" background={false} />
                )}

                {/* Soft contact shadows for realism */}
                <ContactShadows position={[0, -1.01, 0]} opacity={0.4} scale={16} blur={2.8} far={4} />

                {/* Subtle post FX for Cycles-like pop */}
                <EffectComposer multisampling={0}>
                    <primitive attach="passes" object={new NormalPass()} />
                    <SSAO normalPass samples={16} radius={0.25} intensity={1.2 * perf} />
                    <Bloom mipmapBlur intensity={0.6 * perf} luminanceThreshold={0.85} />
                    <Vignette eskil={false} offset={-0.2} darkness={.9} />
                </EffectComposer>
            </Suspense>

            {/* Adaptive quality */}
            <PerformanceMonitor onDecline={() => setPerf(0.8)} onIncline={() => setPerf(1)} flipflops={2} />
            <AdaptiveDpr pixelated />

            {/* Controls: render only on interaction for speed */}
            {/* <OrbitControls
                ref={controls}
                enablePan={false}
                enableZoom
                enableRotate
                zoomSpeed={1.2}
                rotateSpeed={0.7}
                maxPolarAngle={Math.PI * 0.95}
                minDistance={2}
                maxDistance={18}
                onChange={invalidate}
                onStart={invalidate}
                onEnd={invalidate}
            /> */}

            <OrbitControls
                ref={controls}
                enablePan={false}
                enableZoom
                enableRotate
                autoRotate={autoRotate}
                autoRotateSpeed={0.7}
                zoomSpeed={1.2}
                rotateSpeed={0.7}
                maxPolarAngle={Math.PI * 0.95}
                minDistance={2}
                maxDistance={28}
                onChange={invalidate}
                onStart={() => setAutoRotate(false)}
                onEnd={invalidate}
            />



            {/* <CameraControls
                dollyToCursor
                smoothTime={0.15}
                minDistance={0.02}
                maxDistance={30}
            /> */}
        </>
    );
}

/* ---------------------------------- Page --------------------------------- */
export default function Home3D() {
    return (
        <>
        <Canvas
            frameloop="demand"
            dpr={[1, 1.5]}
            camera={{ position: [8, 5, 14], fov: 45, near: .01, far: 1300 }}
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
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                gl.physicallyCorrectLights = true;
            }}
        >
            <Scene />
            <Preload all />
            
        </Canvas>
        <TutorialHint />
        </>
        
    );
}
