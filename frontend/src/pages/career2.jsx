// // CareerPage.jsx
// import React, { useEffect, useRef } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
// import * as THREE from "three";
// import { EffectComposer, Vignette } from "@react-three/postprocessing";
// import { Link } from "react-router-dom";
// import Waves from "../components/waves";               // ⬅️ your fixed Waves component
// import "./career2.css";
// import { usePageTransition } from "../components/transition";


// const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// function RobotGLB({ url = "/models/bayma10.glb", pointer, enableTilt = true }) {
//   const { scene } = useGLTF(url);
//   const bodyRef = useRef(null);
//   const headRef = useRef(null);
//   const pupilL = useRef(null);
//   const pupilR = useRef(null);

//   const baseL = useRef(new THREE.Vector3());
//   const baseR = useRef(new THREE.Vector3());
//   const inited = useRef(false);

//   useEffect(() => {
//     if (!scene) return;
//     scene.traverse((o) => {
//       if (o.isMesh) {
//         o.castShadow = true;
//         o.receiveShadow = true;
//         o.frustumCulled = false;
//       }
//     });

//     bodyRef.current = scene.getObjectByName("Body") ?? null;
//     headRef.current = scene.getObjectByName("Head") ?? null;
//     pupilL.current = scene.getObjectByName("Pupil_L") ?? null;
//     pupilR.current = scene.getObjectByName("Pupil_R") ?? null;

//     if (!inited.current && pupilL.current && pupilR.current) {
//       baseL.current.copy(pupilL.current.position);
//       baseR.current.copy(pupilR.current.position);
//       inited.current = true;
//     }
//   }, [scene]);

//   const maxTilt = THREE.MathUtils.degToRad(8);
//   const eyeRadius = 0.12;

//   useFrame((_, dt) => {
//     const tX = clamp(pointer.current.x, -1, 1);
//     const tY = clamp(pointer.current.y, -1, 1);

//     if (enableTilt && bodyRef.current) {
//       bodyRef.current.rotation.x = THREE.MathUtils.damp(
//         bodyRef.current.rotation.x,
//         tY * maxTilt,
//         6,
//         dt
//       );
//       bodyRef.current.rotation.y = THREE.MathUtils.damp(
//         bodyRef.current.rotation.y,
//         tX * maxTilt * 0.8,
//         6,
//         dt
//       );
//     }
//     if (enableTilt && headRef.current) {
//       headRef.current.rotation.y = THREE.MathUtils.damp(
//         headRef.current.rotation.y,
//         tX * 0.35,
//         6,
//         dt
//       );
//       headRef.current.rotation.x = THREE.MathUtils.damp(
//         headRef.current.rotation.x,
//         tY * 0.25,
//         6,
//         dt
//       );
//     }

//     const angle = Math.atan2(tY, tX);
//     const mag = Math.min(Math.hypot(tX, tY), 1) * eyeRadius;
//     const offX = Math.cos(angle) * mag;
//     const offY = Math.sin(angle) * mag;

//     if (pupilL.current) {
//       pupilL.current.position.set(
//         baseL.current.x + offX,
//         baseL.current.y + offY,
//         baseL.current.z
//       );
//     }
//     if (pupilR.current) {
//       pupilR.current.position.set(
//         baseR.current.x + offX,
//         baseR.current.y + offY,
//         baseR.current.z
//       );
//     }
//   });

//   return <primitive object={scene} />;
// }

// /** Runs inside the Canvas so hooks are valid; makes canvas fully transparent */
// function TransparentClear() {
//   const { gl } = useThree();
//   useEffect(() => {
//     gl.setClearColor(0x000000, 0);
//   }, [gl]);
//   return null;
// }

// function Scene({ pointer }) {
//   return (
//     <Canvas
//       shadows
//       gl={{ alpha: true, antialias: true }}                 // transparent canvas
//       camera={{ position: [0, 1.5, 5], fov: 45, near: 0.1, far: 500 }}
//       style={{ width: "100vw", height: "100vh", display: "block" }}
//     >
//       <TransparentClear />

//       {/* Lighting */}
//       <hemisphereLight intensity={0.7} groundColor={new THREE.Color("#3b1f00")} />
//       <directionalLight
//         castShadow
//         position={[5, 10, 5]}
//         intensity={1.1}
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />

//       {/* Soft ground shadow */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
//         <planeGeometry args={[40, 40]} />
//         <shadowMaterial transparent opacity={0.25} />
//       </mesh>

//       {/* Model */}
//       <group position={[0, -4, -4]} scale={[1.2, 1.2, 1.2]}>
//         <RobotGLB pointer={pointer} enableTilt />
//       </group>

//       {/* Subtle post effect */}
//       <Environment preset="studio" intensity={0.6} rotation={[0, Math.PI / 4, 0]} />
//       <EffectComposer>
//         <Vignette eskil={false} offset={0.35} darkness={0.65} />
//       </EffectComposer>

//       <OrbitControls enabled={false} />
//     </Canvas>
//   );
// }

// export default function BaymaksHome() {
//   const pointer = useRef({ x: 0, y: 0 });
//   const { start } = usePageTransition();

//   const handleExplore = (e) => {
//   e.preventDefault();
//   const rect = e.currentTarget.getBoundingClientRect();
//   const x = rect.left + rect.width / 2;
//   const y = rect.top + rect.height / 2;

//   start("/jobs", {
//     x,
//     y,
//     duration: 0.65,
//     ease: "power4.inOut",
//   });
// };

//   const handlePointer = (e) => {
//     const x = (e.clientX ?? (e.touches?.[0]?.clientX ?? 0)) / window.innerWidth;
//     const y = (e.clientY ?? (e.touches?.[0]?.clientY ?? 0)) / window.innerHeight;
//     pointer.current.x = clamp(x * 2 - 1, -1, 1);
//     pointer.current.y = clamp(-(y * 2 - 1), -1, 1);
//   };

//   return (
//     <div onMouseMove={handlePointer} onTouchMove={handlePointer} className="carrers-root"
//      style={{ height: "100vh", width: "100vw" }}
//     >
//       {/* Waves background layer (behind everything) */}
//       <div className="bg-waves">
//         <Waves
//           lineColor="#ffffff"
//           backgroundColor="transparent"   /* let the glow/canvas tint the scene */
//           waveSpeedX={0.02}
//           waveSpeedY={0.01}
//           waveAmpX={40}
//           waveAmpY={20}
//           friction={0.9}
//           tension={0.01}
//           maxCursorMove={120}
//           xGap={12}
//           yGap={36}
//         />
//       </div>

//       {/* Radial glow overlay (brand tint) */}
//       <div className="carrers-glow" />

//       {/* 3D Canvas */}
//       <div className="carrers-canvas">
//         <Scene pointer={pointer} />
//       </div>

//       {/* Overlays */}
//       <div className="carrers-title">
//         <span className="big">Carrers</span>
//       </div>

//       <section className="carrers-sec">
//         <h1>We bring a wealth of Experience from wide range of Backgrounds</h1>
//       </section>

//       <section className="carrers-sec-cta">
//         <div className="txt">
//           <div id="cta-up">We are Hiring</div>
//           <Link to="/jobs" className="carrers-btn" onClick={handleExplore}>Explore Now</Link>
//         </div>
//       </section>
//     </div>
//   );
// }

// useGLTF.preload("/models/bayma10.glb");





































/**
 * CareerPage.jsx
 * 
 * Main careers page featuring an interactive 3D robot model
 * with eye-tracking and tilt effects based on mouse/touch position.
 * 
 * @module CareerPage
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import JobApplyModal from "../components/applyModal";
import "./career2.css";

// ==================== Constants ====================

const ROBOT_CONFIG = {
  MODEL_PATH: "/models/bayma10.glb",
  SCALE: 1.2,
  POSITION: [0, -4, -4],
  MAX_TILT_DEGREES: 8,
  HEAD_ROTATION_FACTOR: { x: 0.25, y: 0.35 },
  BODY_ROTATION_FACTOR: { x: 1, y: 0.8 },
  EYE_RADIUS: 0.12,
  DAMPING_FACTOR: 6,
};

const SCENE_CONFIG = {
  CAMERA: {
    position: [0, 1.5, 5],
    fov: 45,
    near: 0.1,
    far: 500,
  },
  LIGHTING: {
    HEMISPHERE: {
      intensity: 0.7,
      groundColor: "#3b1f00",
    },
    DIRECTIONAL: {
      intensity: 1.1,
      position: [5, 10, 5],
      shadowMapSize: 2048,
    },
  },
  ENVIRONMENT: {
    preset: "warehouse",
    intensity: 0.4,
    rotation: [0, Math.PI / 4, 0],
  },
  VIGNETTE: {
    offset: 0.35,
    darkness: 0.65,
  },
};

const POINTER_CONSTRAINTS = {
  MIN: -1,
  MAX: 1,
};

// ==================== Utility Functions ====================

/**
 * Clamps a value between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Normalizes screen coordinates to -1 to 1 range
 * @param {number} x - Screen X coordinate
 * @param {number} y - Screen Y coordinate
 * @returns {{x: number, y: number}} Normalized coordinates
 */
const normalizePointerPosition = (x, y) => ({
  x: clamp((x / window.innerWidth) * 2 - 1, POINTER_CONSTRAINTS.MIN, POINTER_CONSTRAINTS.MAX),
  y: clamp(-((y / window.innerHeight) * 2 - 1), POINTER_CONSTRAINTS.MIN, POINTER_CONSTRAINTS.MAX),
});

// ==================== Three.js Components ====================

/**
 * Sets the Three.js canvas background to transparent
 * @component
 */
function TransparentBackground() {
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return null;
}

/**
 * Interactive 3D robot model with eye-tracking and tilt effects
 * @component
 * @param {Object} props
 * @param {string} props.url - Path to the GLTF model
 * @param {React.MutableRefObject} props.pointer - Reference to pointer position
 * @param {boolean} props.enableTilt - Whether to enable tilt effects
 */
function InteractiveRobot({ url = ROBOT_CONFIG.MODEL_PATH, pointer, enableTilt = true }) {
  const { scene } = useGLTF(url);

  // Refs for robot parts
  const bodyRef = useRef(null);
  const headRef = useRef(null);
  const pupilLeftRef = useRef(null);
  const pupilRightRef = useRef(null);

  // Base positions for pupils (initialized once)
  const basePupilPositions = useRef({
    left: new THREE.Vector3(),
    right: new THREE.Vector3(),
    initialized: false,
  });

  const maxTiltRadians = useMemo(
    () => THREE.MathUtils.degToRad(ROBOT_CONFIG.MAX_TILT_DEGREES),
    []
  );

  // Initialize scene and references
  useEffect(() => {
    if (!scene) return;

    // Enable shadows on all meshes
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.frustumCulled = false;
      }
    });

    // Cache references to robot parts
    bodyRef.current = scene.getObjectByName("Body");
    headRef.current = scene.getObjectByName("Head");
    pupilLeftRef.current = scene.getObjectByName("Pupil_L");
    pupilRightRef.current = scene.getObjectByName("Pupil_R");

    // Store initial pupil positions
    if (
      !basePupilPositions.current.initialized &&
      pupilLeftRef.current &&
      pupilRightRef.current
    ) {
      basePupilPositions.current.left.copy(pupilLeftRef.current.position);
      basePupilPositions.current.right.copy(pupilRightRef.current.position);
      basePupilPositions.current.initialized = true;
    }
  }, [scene]);

  // Animation frame loop
  useFrame((_, deltaTime) => {
    const targetX = clamp(pointer.current.x, POINTER_CONSTRAINTS.MIN, POINTER_CONSTRAINTS.MAX);
    const targetY = clamp(pointer.current.y, POINTER_CONSTRAINTS.MIN, POINTER_CONSTRAINTS.MAX);

    // Apply tilt to body
    if (enableTilt && bodyRef.current) {
      bodyRef.current.rotation.x = THREE.MathUtils.damp(
        bodyRef.current.rotation.x,
        targetY * maxTiltRadians * ROBOT_CONFIG.BODY_ROTATION_FACTOR.x,
        ROBOT_CONFIG.DAMPING_FACTOR,
        deltaTime
      );
      bodyRef.current.rotation.y = THREE.MathUtils.damp(
        bodyRef.current.rotation.y,
        targetX * maxTiltRadians * ROBOT_CONFIG.BODY_ROTATION_FACTOR.y,
        ROBOT_CONFIG.DAMPING_FACTOR,
        deltaTime
      );
    }

    // Apply rotation to head
    if (enableTilt && headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.damp(
        headRef.current.rotation.y,
        targetX * ROBOT_CONFIG.HEAD_ROTATION_FACTOR.y,
        ROBOT_CONFIG.DAMPING_FACTOR,
        deltaTime
      );
      headRef.current.rotation.x = THREE.MathUtils.damp(
        headRef.current.rotation.x,
        targetY * ROBOT_CONFIG.HEAD_ROTATION_FACTOR.x,
        ROBOT_CONFIG.DAMPING_FACTOR,
        deltaTime
      );
    }

    // Calculate eye movement
    const angle = Math.atan2(targetY, targetX);
    const magnitude = Math.min(Math.hypot(targetX, targetY), 1) * ROBOT_CONFIG.EYE_RADIUS;
    const offsetX = Math.cos(angle) * magnitude;
    const offsetY = Math.sin(angle) * magnitude;

    // Update pupil positions
    if (pupilLeftRef.current && basePupilPositions.current.initialized) {
      pupilLeftRef.current.position.set(
        basePupilPositions.current.left.x + offsetX,
        basePupilPositions.current.left.y + offsetY,
        basePupilPositions.current.left.z
      );
    }

    if (pupilRightRef.current && basePupilPositions.current.initialized) {
      pupilRightRef.current.position.set(
        basePupilPositions.current.right.x + offsetX,
        basePupilPositions.current.right.y + offsetY,
        basePupilPositions.current.right.z
      );
    }
  });

  return <primitive object={scene} />;
}

InteractiveRobot.propTypes = {
  url: PropTypes.string,
  pointer: PropTypes.shape({
    current: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  }).isRequired,
  enableTilt: PropTypes.bool,
};

/**
 * Three.js scene component containing the robot and environment
 * @component
 * @param {Object} props
 * @param {React.MutableRefObject} props.pointer - Reference to pointer position
 */
function RobotScene({ pointer }) {
  const groundColor = useMemo(
    () => new THREE.Color(SCENE_CONFIG.LIGHTING.HEMISPHERE.groundColor),
    []
  );

  return (
    <Canvas
      shadows
      gl={{ alpha: true, antialias: true }}
      camera={SCENE_CONFIG.CAMERA}
      style={{ width: "100vw", height: "100vh", display: "block" }}
    >
      <TransparentBackground />

      {/* Lighting */}
      <hemisphereLight
        intensity={SCENE_CONFIG.LIGHTING.HEMISPHERE.intensity}
        groundColor={groundColor}
      />
      <directionalLight
        castShadow
        position={SCENE_CONFIG.LIGHTING.DIRECTIONAL.position}
        intensity={SCENE_CONFIG.LIGHTING.DIRECTIONAL.intensity}
        shadow-mapSize-width={SCENE_CONFIG.LIGHTING.DIRECTIONAL.shadowMapSize}
        shadow-mapSize-height={SCENE_CONFIG.LIGHTING.DIRECTIONAL.shadowMapSize}
      />

      {/* Shadow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>

      {/* Robot model */}
      <group
        position={ROBOT_CONFIG.POSITION}
        scale={[ROBOT_CONFIG.SCALE, ROBOT_CONFIG.SCALE, ROBOT_CONFIG.SCALE]}
      >
        <InteractiveRobot pointer={pointer} enableTilt />
      </group>

      {/* Environment and post-processing */}
      <Environment
        preset={SCENE_CONFIG.ENVIRONMENT.preset}
        intensity={SCENE_CONFIG.ENVIRONMENT.intensity}
        rotation={SCENE_CONFIG.ENVIRONMENT.rotation}
      />
      <EffectComposer>
        <Vignette
          eskil={false}
          offset={SCENE_CONFIG.VIGNETTE.offset}
          darkness={SCENE_CONFIG.VIGNETTE.darkness}
        />
      </EffectComposer>

      <OrbitControls enabled={false} />
    </Canvas>
  );
}

RobotScene.propTypes = {
  pointer: PropTypes.shape({
    current: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  }).isRequired,
};

// ==================== Main Component ====================

/**
 * Career page component with interactive 3D robot and job application modal
 * @component
 * @returns {JSX.Element}
 */
export default function CareerPage() {
  const pointerRef = useRef({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  // Vacant job roles (could be fetched from API)
  const vacantRoles = useMemo(
    () => [
      "Frontend Developer (React + Tailwind)",
      "Full Stack Developer (MERN)",
      "Backend Developer (Node.js + MongoDB)",
      "UI/UX Designer (Figma)",
    ],
    []
  );

  /**
   * Handles pointer movement (mouse or touch)
   * Updates the pointer reference for robot interaction
   */
  const handlePointerMove = useCallback((event) => {
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    const y = event.clientY ?? event.touches?.[0]?.clientY ?? 0;

    const normalized = normalizePointerPosition(x, y);
    pointerRef.current = normalized;
  }, []);

  /**
   * Opens the job application modal
   * @param {React.MouseEvent} event - Click event
   */
  const handleApplyClick = useCallback((event) => {
    event.preventDefault();
    setIsModalOpen(true);
  }, []);

  /**
   * Handles job application submission
   * @param {Object} data - Application form data
   * @param {string} data.role - Selected role
   * @param {string} data.fullName - Applicant's full name
   * @param {string} data.email - Applicant's email
   * @param {string} data.phone - Applicant's phone number
   * @param {File} data.resumeFile - Resume file
   * @param {string} data.coverNote - Cover letter
   */
  const handleApplicationSubmit = useCallback(async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("role", data.role);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone || "");
      formData.append("coverNote", data.coverNote || "");

      if (data.resumeFile) {
        formData.append("resume", data.resumeFile);
      }

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(
          "POST",
          `${import.meta.env.VITE_API_URL}/api/job-applications/apply`
        );

        // ✅ Upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          const raw = xhr.responseText;
          console.log("JOB APPLY STATUS:", xhr.status);
          console.log("JOB APPLY RESPONSE:", raw);

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
            return;
          }

          // Try JSON error, else fallback to raw text
          try {
            const err = JSON.parse(raw);
            reject(new Error(err.error || err.message || "Submission failed"));
          } catch {
            reject(new Error(raw || `Submission failed (HTTP ${xhr.status})`));
          }
        };


        xhr.onerror = () => reject(new Error("Network error"));

        xhr.send(formData);
      });

      toast.success("Application submitted successfully 🚀");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  }, [isSubmitting]);

  return (
    <div
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      className="carrers-root"
      style={{ height: "100vh", width: "100vw" }}
    >
      {/* Background glow effect */}
      <div className="carrers-glow" aria-hidden="true" />

      {/* 3D Canvas */}
      <div className="carrers-canvas" aria-hidden="true">
        <RobotScene pointer={pointerRef} />
      </div>

      {/* Page title */}
      <header className="carrers-title">
        <h1 className="big">Careers</h1>
      </header>

      {/* Content sections */}
      <main>
        <section className="carrers-sec">
          <h2>We bring a wealth of Experience from wide range of Backgrounds</h2>
        </section>

        <section className="carrers-sec-cta">
          <div className="txt">
            <div id="cta-up" role="heading" aria-level="3">
              We are Hiring
            </div>
            <Link
              to="/jobs"
              className="carrers-btn"
              onClick={handleApplyClick}
              aria-label="Open job application form"
            >
              Apply Now
            </Link>
          </div>
        </section>
      </main>

      {/* Job application modal */}
      <JobApplyModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vacantRoles={vacantRoles}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
}

// Preload the 3D model for better performance
useGLTF.preload(ROBOT_CONFIG.MODEL_PATH);