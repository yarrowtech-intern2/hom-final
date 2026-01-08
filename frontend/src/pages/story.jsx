


// // cld 
// import React, { Suspense, useMemo, useRef, useEffect } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import {
//   Environment,
//   ScrollControls,
//   Scroll,
//   useGLTF,
//   Preload,
//   useScroll,
//   Float,
//   Stars,
// } from "@react-three/drei";
// import * as THREE from "three";
// import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
// import { BlendFunction } from "postprocessing";
// import AnimatedGLTF from "../components/AnimatedGLTF.jsx";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";
// import "../styles/story.css";

// gsap.registerPlugin(ScrollTrigger);

// /* ----------------------------- Utils -------------------------------- */
// const clamp01 = (t) => Math.min(1, Math.max(0, t));
// const smoothstep = (t) => t * t * (3 - 2 * t);
// const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// /* ----------------------------- Camera Rig ---------------------------- */
// function CameraRig() {
//   const scroll = useScroll();

//   // Professional camera path with cinematic transitions
//   const curve = useMemo(
//     () =>
//       new THREE.CatmullRomCurve3(
//         [
//           new THREE.Vector3(0, 2, 15),      // Opening - Wide establishing shot
//           new THREE.Vector3(6, 1.8, 10),    // Sweep right
//           new THREE.Vector3(8, 1.5, 5),     // Continue arc
//           new THREE.Vector3(4, 1.2, 0),     // Center approach
//           new THREE.Vector3(-2, 1.5, -4),   // Cross to left
//           new THREE.Vector3(-5, 2, -8),     // Pull back left
//           new THREE.Vector3(0, 2.5, -12),   // Center dramatic
//           new THREE.Vector3(3, 3, -15),     // Ascend and push
//           new THREE.Vector3(0, 3.5, -18),   // Final elevated view
//         ],
//         false,
//         "catmullrom",
//         0.4 // Smoother tension
//       ),
//     []
//   );

//   const targetPos = useMemo(() => new THREE.Vector3(), []);
//   const lookPos = useMemo(() => new THREE.Vector3(), []);
//   const currentLook = useMemo(() => new THREE.Vector3(), []);

//   useFrame((state, delta) => {
//     const t = clamp01(scroll.offset);
//     const smoothT = easeInOutCubic(t);
    
//     // Get camera position and look-ahead point
//     curve.getPointAt(smoothT, targetPos);
//     curve.getPointAt(clamp01(smoothT + 0.008), lookPos);

//     // Subtle parallax based on mouse position
//     const parallaxStrength = THREE.MathUtils.lerp(0.5, 0.2, smoothT);
//     targetPos.x += state.pointer.x * parallaxStrength;
//     targetPos.y += state.pointer.y * (parallaxStrength * 0.5);

//     // Smooth camera movement with professional damping
//     state.camera.position.lerp(targetPos, 1 - Math.pow(0.0008, delta));
    
//     // Smooth look-at with slight lag for cinematic feel
//     currentLook.lerp(lookPos, 1 - Math.pow(0.001, delta));
//     state.camera.lookAt(currentLook);

//     // Dynamic FOV adjustment for depth perception
//     const targetFOV = THREE.MathUtils.lerp(50, 45, smoothT);
//     state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFOV, delta * 2);
//     state.camera.updateProjectionMatrix();
//   });

//   return null;
// }

// /* ------------------------------ 3D World ----------------------------- */
// function World() {
//   const scroll = useScroll();
//   const lightRef = useRef();
//   const groupRef = useRef();
//   const planetRef = useRef();
//   const ambientRef = useRef();
//   const rimLightRef = useRef();

//   // Parallax rotation based on mouse
//   useFrame((state, delta) => {
//     if (!groupRef.current) return;

//     const targetRotX = -state.pointer.y * 0.08;
//     const targetRotY = state.pointer.x * 0.12;

//     groupRef.current.rotation.x = THREE.MathUtils.damp(
//       groupRef.current.rotation.x,
//       targetRotX,
//       3,
//       delta
//     );
//     groupRef.current.rotation.y = THREE.MathUtils.damp(
//       groupRef.current.rotation.y,
//       targetRotY,
//       3,
//       delta
//     );
//   });

//   // Dynamic lighting based on scroll
//   useFrame((_, delta) => {
//     const t = scroll.offset;
    
//     if (lightRef.current) {
//       const intensity = THREE.MathUtils.lerp(1.2, 2.5, smoothstep(t));
//       lightRef.current.intensity = THREE.MathUtils.damp(
//         lightRef.current.intensity,
//         intensity,
//         4,
//         delta
//       );
//     }

//     if (ambientRef.current) {
//       const ambient = THREE.MathUtils.lerp(0.3, 0.6, t);
//       ambientRef.current.intensity = THREE.MathUtils.damp(
//         ambientRef.current.intensity,
//         ambient,
//         3,
//         delta
//       );
//     }

//     if (rimLightRef.current) {
//       const rim = THREE.MathUtils.lerp(0.8, 1.5, Math.sin(t * Math.PI));
//       rimLightRef.current.intensity = THREE.MathUtils.damp(
//         rimLightRef.current.intensity,
//         rim,
//         5,
//         delta
//       );
//     }
//   });

//   // Planet animation
//   useFrame((state, delta) => {
//     if (!planetRef.current) return;
    
//     const t = scroll.offset;
    
//     // Smooth orbital movement
//     const orbitRadius = 12;
//     const orbitSpeed = t * Math.PI * 2;
    
//     planetRef.current.position.x = Math.cos(orbitSpeed) * orbitRadius + 2;
//     planetRef.current.position.z = Math.sin(orbitSpeed) * orbitRadius;
//     planetRef.current.position.y = Math.sin(t * Math.PI) * 3 - 1;
    
//     // Gentle rotation
//     planetRef.current.rotation.y += delta * 0.3;
//     planetRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
//   });

//   return (
//     <>
//       {/* Atmospheric stars */}
//       <Stars
//         radius={100}
//         depth={50}
//         count={3000}
//         factor={4}
//         saturation={0.5}
//         fade
//         speed={0.5}
//       />

//       <group ref={groupRef}>
//         {/* Lighting setup */}
//         <ambientLight ref={ambientRef} intensity={0.3} color="#e8dcc0" />
        
//         <directionalLight
//           ref={lightRef}
//           position={[8, 10, 6]}
//           intensity={1.2}
//           color="#ffeaa7"
//           castShadow
//         />
        
//         <directionalLight
//           ref={rimLightRef}
//           position={[-6, 2, -8]}
//           intensity={0.8}
//           color="#74b9ff"
//         />

//         <spotLight
//           position={[0, 15, 0]}
//           angle={0.5}
//           penumbra={1}
//           intensity={0.5}
//           color="#dfe6e9"
//         />

//         <Environment preset="sunset" environmentIntensity={0.6} />

//         {/* Planet with floating animation */}
//         <Float
//           speed={1.5}
//           rotationIntensity={0.3}
//           floatIntensity={0.8}
//         >
//           <group ref={planetRef} position={[10, 0, 8]}>
//             <AnimatedGLTF url="/models/aboutPage/planet10.glb" scale={1.4} />
            
//             {/* Atmospheric glow */}
//             <mesh scale={1.6}>
//               <sphereGeometry args={[1, 32, 32]} />
//               <meshBasicMaterial
//                 color="#9d6800"
//                 transparent
//                 opacity={0.15}
//                 blending={THREE.AdditiveBlending}
//               />
//             </mesh>
//           </group>
//         </Float>

//         {/* Ambient particles */}
//         <mesh position={[0, 0, -5]}>
//           <sphereGeometry args={[30, 32, 32]} />
//           <meshBasicMaterial
//             color="#9d6800"
//             wireframe
//             transparent
//             opacity={0.03}
//           />
//         </mesh>
//       </group>
//     </>
//   );
// }

// /* ---------------------------- Progress Bar --------------------------- */
// function ProgressBar() {
//   const scroll = useScroll();
//   const barRef = useRef(null);
//   const glowRef = useRef(null);

//   useFrame(() => {
//     if (barRef.current) {
//       const progress = scroll.offset;
//       barRef.current.style.transform = `scaleX(${progress})`;
      
//       if (glowRef.current) {
//         glowRef.current.style.opacity = progress * 0.8;
//       }
//     }
//   });

//   return (
//     <div className="pointer-events-none fixed left-0 top-0 z-[60] h-1 w-screen bg-black/20">
//       <div
//         ref={glowRef}
//         className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent blur-xl"
//         style={{ opacity: 0 }}
//       />
//       <span
//         ref={barRef}
//         className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#9d6800] via-[#d4a574] to-[#ffd700] shadow-lg shadow-[#9d6800]/50"
//       />
//     </div>
//   );
// }

// /* ✅ PROJECT DATA */
// const PROJECTS = [
//   {
//     title: "Yarrowtech",
//     description:
//       "YarrowTech is a next-generation software development company dedicated to transforming ideas into intelligent, high-impact digital solutions. Our expertise spans custom software development, ERP systems, AI-driven applications, and full-stack web and mobile development—built to support the evolving needs of modern businesses.",
//     url: "https://yarrowtech.com",
//     cta: "Visit Website",
//   },
//   {
//     title: "Building",
//     description:
//       "This project involves building a secure, regulated crowdfunding platform for early-stage startups, designed to connect vetted founders with retail investors through a transparent and compliant digital marketplace. The platform enables startups to raise capital efficiently while allowing investors to discover, evaluate, and invest in curated opportunities with confidence. The system incorporates KYC/AML compliance, campaign management, ensuring trust, regulatory alignment, and long-term platform sustainability.",
//     url: "https://sportbit.app",
//     cta: "View Platform",
//   },
//   {
//     title: "Hire-Me",
//     description:
//       "Hire Me is a subscription-driven HR ecosystem that unites partner companies, their HR teams, and the employees they steward. We streamline workforce intake, tracking, and compliance for partner organisations while maintaining a secure, always-on environment administered by our in-house team. Built for scalability, data protection, and round-the-clock availability, Hire Me delivers a dependable bridge between modern employers and the talent they nurture.",
//     url: "https://fb.yarrowtech.com",
//     cta: "Explore Product",
//   },
//   {
//     title: "Art-Block",
//     description:
//       "ArtBlock is an innovative online social platform that empowers independent artists and creators to showcase, share, and monetize their work through a subscription-based model. It bridges the gap between creators and their audiences by offering tools for exclusive content sharing, tiered memberships, community engagement, and direct financial support. The platform integrates secure payment gateways, real-time notifications, and an analytics dashboard to track engagement and earnings.",
//     url: "https://myguide.yarrowtech.com",
//     cta: "See Solution",
//   },
//   {
//     title: "Green-bar",
//     description:
//       "Green-bar is a web-based platform designed for ordering fresh groceries and farm produce online. It allows users to browse products, place orders, and manage purchases easily. The system includes admin and seller modules for product, order, and inventory management. BuyFresh provides a smooth checkout experience with real-time order tracking.",
//     url: "https://electroniceducare.com",
//     cta: "View Product",
//   },
//   {
//     title: "Better-Pass",
//     description:
//       "The Better Pass is a social travel platform where tour companies and tourists can connect, post tours, and make bookings. Designed with an experience similar to Instagram or LinkedIn, the app supports four user roles: Tour Companies, Tourists/Travellers, Influencers, and Activity Instructors. Tour companies can share and promote their tour offerings, influencers can help amplify these tours, and activity instructors can showcase engaging nearby activities.",
//     url: "https://electroniceducare.com",
//     cta: "View Product",
//   },
// ];

// /* ---------------------------- Page View ------------------------------ */
// export default function StoryWorld() {
//   /* Professional magnetic buttons with ripple effects */
//   useEffect(() => {
//     const buttons = document.querySelectorAll(".story-btn");
//     const cleanups = [];

//     buttons.forEach((btn) => {
//       const magneticStrength = 35;
//       let isHovering = false;

//       const move = (e) => {
//         if (!isHovering) return;
//         const rect = btn.getBoundingClientRect();
//         const centerX = rect.left + rect.width / 2;
//         const centerY = rect.top + rect.height / 2;
//         const deltaX = (e.clientX - centerX) / magneticStrength;
//         const deltaY = (e.clientY - centerY) / magneticStrength;

//         gsap.to(btn, {
//           x: deltaX,
//           y: deltaY,
//           duration: 0.4,
//           ease: "power2.out",
//         });
//       };

//       const enter = () => {
//         isHovering = true;
//         gsap.to(btn, {
//           scale: 1.05,
//           duration: 0.3,
//           ease: "power2.out",
//         });
//       };

//       const leave = () => {
//         isHovering = false;
//         gsap.to(btn, {
//           x: 0,
//           y: 0,
//           scale: 1,
//           duration: 0.5,
//           ease: "elastic.out(1, 0.5)",
//         });
//       };

//       // Scroll-triggered entrance animation
//       gsap.from(btn, {
//         opacity: 0,
//         y: 50,
//         duration: 1,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: btn,
//           start: "top 90%",
//           toggleActions: "play none none reverse",
//         },
//       });

//       // Ripple effect on click
//       const handleClick = (e) => {
//         e.preventDefault();
//         const url = btn.href;

//         const rect = btn.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         const ripple = document.createElement("span");
//         ripple.className = "btn-ripple";
//         ripple.style.left = `${x}px`;
//         ripple.style.top = `${y}px`;
//         btn.appendChild(ripple);

//         gsap.fromTo(
//           ripple,
//           { scale: 0, opacity: 1 },
//           {
//             scale: 10,
//             opacity: 0,
//             duration: 0.8,
//             ease: "power3.out",
//             onComplete: () => {
//               ripple.remove();
//               window.open(url, "_blank", "noopener,noreferrer");
//             },
//           }
//         );
//       };

//       btn.addEventListener("mousemove", move);
//       btn.addEventListener("mouseenter", enter);
//       btn.addEventListener("mouseleave", leave);
//       btn.addEventListener("click", handleClick);

//       cleanups.push(() => {
//         btn.removeEventListener("mousemove", move);
//         btn.removeEventListener("mouseenter", enter);
//         btn.removeEventListener("mouseleave", leave);
//         btn.removeEventListener("click", handleClick);
//       });
//     });

//     return () => cleanups.forEach((fn) => fn());
//   }, []);

//   /* Smooth section transitions */
//   useEffect(() => {
//     const sections = document.querySelectorAll(".project-section");
    
//     sections.forEach((section) => {
//       gsap.from(section.querySelector(".project-content"), {
//         opacity: 0,
//         y: 80,
//         duration: 1.2,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: section,
//           start: "top 70%",
//           toggleActions: "play none none reverse",
//         },
//       });
//     });
//   }, []);

//   return (
//     <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#1a1410] via-[#2d2416] to-[#1a1410]">
//       <Canvas
//         camera={{ position: [0, 2, 15], fov: 50, near: 0.1, far: 1000 }}
//         gl={{
//           alpha: true,
//           antialias: true,
//           powerPreference: "high-performance",
//           toneMapping: THREE.ACESFilmicToneMapping,
//           toneMappingExposure: 1.2,
//         }}
//         shadows
//       >
//         <Suspense fallback={null}>
//           <ScrollControls pages={7} damping={0.2} distance={1}>
//             <CameraRig />
//             <World />

//             <EffectComposer>
//               <Bloom
//                 intensity={0.8}
//                 luminanceThreshold={0.2}
//                 luminanceSmoothing={0.9}
//                 blendFunction={BlendFunction.ADD}
//               />
//               <Vignette
//                 darkness={0.4}
//                 offset={0.3}
//                 blendFunction={BlendFunction.NORMAL}
//               />
//               <ChromaticAberration
//                 offset={[0.0005, 0.0005]}
//                 blendFunction={BlendFunction.NORMAL}
//               />
//             </EffectComposer>

//             <Scroll html style={{ width: "100vw", pointerEvents: "auto" }}>
//               <ProgressBar />

//               <div className="pointer-events-auto w-screen">
//                 <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
//                   {PROJECTS.map((project, index) => (
//                     <section
//                       key={project.title}
//                       className="project-section flex min-h-screen w-full items-center justify-center py-20"
//                     >
//                       <div className="project-content flex flex-col items-center gap-8 text-center">
//                         {/* Project number indicator */}
//                         <div className="text-[#9d6800]/40 text-sm font-mono tracking-wider">
//                           {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
//                         </div>

//                         {/* Title with gradient */}
//                         <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-[#ffd700] via-[#d4a574] to-[#9d6800] bg-clip-text text-transparent drop-shadow-2xl">
//                           {project.title}
//                         </h2>

//                         {/* Description */}
//                         <p className="mx-auto max-w-[65ch] text-base md:text-lg lg:text-xl leading-relaxed text-[#e8dcc0]/90 font-light">
//                           {project.description}
//                         </p>

//                         {/* CTA Button */}
//                         <a
//                           href={project.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="story-btn group pointer-events-auto relative inline-flex items-center gap-4 mt-6 select-none rounded-full px-10 py-4 bg-gradient-to-r from-[#9d6800] to-[#d4a574] text-white font-semibold text-lg shadow-[0_10px_40px_rgba(157,104,0,0.4)] transition-all duration-300 hover:shadow-[0_15px_50px_rgba(157,104,0,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700] overflow-hidden"
//                         >
//                           <span className="absolute inset-0 bg-gradient-to-r from-[#ffd700] to-[#d4a574] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                           <span className="btn-text relative z-10">{project.cta}</span>
//                           <span className="btn-arrow relative z-10 transition-transform duration-300 group-hover:translate-x-1">
//                             →
//                           </span>
//                         </a>
//                       </div>
//                     </section>
//                   ))}

//                   {/* Return home section */}
//                   <section className="flex min-h-screen w-full items-center justify-center">
//                     <div className="text-center space-y-6">
//                       <p className="text-[#e8dcc0]/70 text-lg">
//                         Ready to start your journey?
//                       </p>
//                       <a
//                         className="pointer-events-auto inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#9d6800] bg-transparent px-8 py-4 text-base font-semibold text-[#ffd700] backdrop-blur-sm transition-all duration-300 hover:bg-[#9d6800] hover:text-white hover:border-[#ffd700] hover:shadow-[0_10px_30px_rgba(157,104,0,0.4)]"
//                         href="/"
//                       >
//                         <span>Return Home</span>
//                         <span className="text-xl">↩</span>
//                       </a>
//                     </div>
//                   </section>
//                 </div>
//               </div>
//             </Scroll>
//           </ScrollControls>

//           <Preload all />
//         </Suspense>
//       </Canvas>

//       {/* Atmospheric overlay */}
//       <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
//     </div>
//   );
// }

// /* Preload assets */
// useGLTF.preload("/models/aboutPage/planet10.glb");















































































// cgpt 

// import React, { Suspense, useEffect, useMemo, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import {
//   Environment,
//   ScrollControls,
//   Scroll,
//   useGLTF,
//   Preload,
//   useScroll,
// } from "@react-three/drei";
// import * as THREE from "three";
// import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
// import AnimatedGLTF from "../components/AnimatedGLTF.jsx";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// /* ----------------------------- Utils -------------------------------- */
// const clamp01 = (t) => Math.min(1, Math.max(0, t));
// const damp = THREE.MathUtils.damp;

// /* ----------------------- Narrative / Chapters ------------------------ */
// const PROJECTS = [
//   {
//     title: "Yarrowtech",
//     tagline: "Engineering intelligent digital products.",
//     description:
//       "YarrowTech is a next-generation software development company dedicated to transforming ideas into intelligent, high-impact digital solutions. Our expertise spans custom software development, ERP systems, AI-driven applications, and full-stack web & mobile development—built to support the evolving needs of modern businesses.",
//     url: "https://yarrowtech.com",
//     cta: "Visit Website",
//   },
//   {
//     title: "Building",
//     tagline: "Regulated crowdfunding, built for trust.",
//     description:
//       "A secure, regulated crowdfunding platform for early-stage startups—connecting vetted founders with retail investors through a transparent and compliant marketplace. Includes KYC/AML, campaign management, and a commission-based revenue model designed for scalable growth and long-term sustainability.",
//     url: "https://sportbit.app",
//     cta: "View Platform",
//   },
//   {
//     title: "Hire-Me",
//     tagline: "Subscription HR ecosystem for partners.",
//     description:
//       "Hire Me is a subscription-driven HR ecosystem for partner companies, HR teams, and employees—streamlining workforce intake, tracking, and compliance with a secure, always-on admin environment. Built for scale, data protection, and operational reliability.",
//     url: "https://fb.yarrowtech.com",
//     cta: "Explore Product",
//   },
//   {
//     title: "Art-Block",
//     tagline: "Creators monetize through community.",
//     description:
//       "A creator-first social platform for artists to showcase, share, and monetize work via subscriptions—tiered memberships, exclusive content, engagement tools, analytics, secure payments, real-time notifications, and admin moderation—built as a modular, scalable web app.",
//     url: "https://myguide.yarrowtech.com",
//     cta: "See Solution",
//   },
//   {
//     title: "Green-bar",
//     tagline: "Fresh groceries, smoother operations.",
//     description:
//       "A web platform for ordering fresh groceries and farm produce—browse products, place orders, and manage purchases. Includes admin and seller modules for inventory and order management with a smooth checkout and tracking flow.",
//     url: "https://electroniceducare.com",
//     cta: "View Product",
//   },
//   {
//     title: "Better-Pass",
//     tagline: "A social travel network for bookings.",
//     description:
//       "A social travel platform where tour companies and travelers connect, post tours, and book experiences. Supports Tour Companies, Travelers, Influencers, and Activity Instructors—designed like an Instagram/LinkedIn hybrid for modern travel discovery.",
//     url: "https://electroniceducare.com",
//     cta: "View Product",
//   },
// ];

// /* ----------------------------- Camera Rig ---------------------------- */
// /**
//  * Cinematic camera:
//  * - uses a smooth curve path
//  * - small pointer parallax
//  * - scroll-based FOV + micro-lean
//  */
// function CameraRig() {
//   const scroll = useScroll();

//   const curve = useMemo(
//     () =>
//       new THREE.CatmullRomCurve3(
//         [
//           new THREE.Vector3(0, 1.35, 13.5),
//           new THREE.Vector3(3.6, 1.1, 7.2),
//           new THREE.Vector3(0.6, 1.2, 1.2),
//           new THREE.Vector3(-3.2, 1.55, -4.8),
//           new THREE.Vector3(-0.2, 2.05, -10.8),
//           new THREE.Vector3(0.8, 2.25, -14.2),
//         ],
//         false,
//         "catmullrom",
//         0.6
//       ),
//     []
//   );

//   const pos = useMemo(() => new THREE.Vector3(), []);
//   const look = useMemo(() => new THREE.Vector3(), []);
//   const tmp = useMemo(() => new THREE.Vector3(), []);

//   useFrame((state, delta) => {
//     const t = clamp01(scroll.offset);

//     curve.getPointAt(t, pos);
//     curve.getPointAt(clamp01(t + 0.008), look);

//     // Pointer parallax (subtle, premium)
//     tmp.set(state.pointer.x * 0.65, state.pointer.y * 0.28, 0);
//     pos.add(tmp);

//     // Cinematic FOV breathing through scroll
//     const targetFov = 48 + (1 - Math.abs(0.5 - t) * 2) * 4; // peaks around middle
//     state.camera.fov = damp(state.camera.fov, targetFov, 3.5, delta);
//     state.camera.updateProjectionMatrix();

//     // Smooth camera settle
//     state.camera.position.lerp(pos, 1 - Math.pow(0.0015, delta));
//     state.camera.lookAt(look);
//   });

//   return null;
// }

// /* ------------------------------ 3D World ----------------------------- */
// /**
//  * 3D behavior:
//  * - planet: orbit drift + rotation + subtle “breath”
//  * - scene group: pointer tilt (damped)
//  * - light: scroll driven intensity shift (chapter reveal feel)
//  */
// function World() {
//   const scroll = useScroll();
//   const groupRef = useRef(null);
//   const planetRef = useRef(null);
//   const keyLight = useRef(null);

//   useFrame((state, delta) => {
//     const g = groupRef.current;
//     if (!g) return;

//     g.rotation.x = damp(g.rotation.x, -state.pointer.y * 0.12, 5, delta);
//     g.rotation.y = damp(g.rotation.y, state.pointer.x * 0.18, 5, delta);
//   });

//   useFrame((state, delta) => {
//     const planet = planetRef.current;
//     if (!planet) return;

//     const t = clamp01(scroll.offset);

//     // Slow orbit drift
//     const time = state.clock.elapsedTime;
//     const orbit = 0.65 + t * 0.75;

//     planet.position.x = damp(
//       planet.position.x,
//       7.8 * Math.cos(time * 0.18) * orbit,
//       2.5,
//       delta
//     );
//     planet.position.y = damp(
//       planet.position.y,
//       0.25 + Math.sin(time * 0.22) * 0.35,
//       2.5,
//       delta
//     );
//     planet.position.z = damp(
//       planet.position.z,
//       6.8 + Math.sin(time * 0.16) * 0.8 - t * 1.8,
//       2.5,
//       delta
//     );

//     // Rotation & “breathing” scale
//     planet.rotation.y += delta * 0.18;
//     const s = 1.1 + Math.sin(time * 0.7) * 0.025;
//     planet.scale.setScalar(damp(planet.scale.x, s, 3.5, delta));
//   });

//   useFrame((_, delta) => {
//     if (!keyLight.current) return;

//     // Chapter boost around middle chapters
//     const midBoost = scroll.range(2 / 6, 2 / 6); // from page 2 -> 4
//     const target = 1.0 + midBoost * 1.0;

//     keyLight.current.intensity = damp(keyLight.current.intensity, target, 3, delta);
//   });

//   return (
//     <group ref={groupRef}>
//       <ambientLight intensity={0.35} />
//       <directionalLight ref={keyLight} position={[7, 9, 5]} intensity={1.0} />
//       <Environment preset="sunset" />

//       <group ref={planetRef}>
//         <AnimatedGLTF url="/models/aboutPage/planet10.glb" scale={1.1} />
//       </group>
//     </group>
//   );
// }

// /* ---------------------------- Progress Bar --------------------------- */
// function ProgressBar() {
//   const scroll = useScroll();
//   const barRef = useRef(null);

//   useFrame(() => {
//     if (barRef.current) barRef.current.style.transform = `scaleX(${scroll.offset})`;
//   });

//   return (
//     <div className="pointer-events-none fixed left-0 top-0 z-[80] h-[3px] w-screen bg-black/10">
//       <span
//         ref={barRef}
//         className="block h-full w-full origin-left scale-x-0 bg-[#f2d38a]"
//       />
//     </div>
//   );
// }

// /* ----------------------- Section / Story Block ----------------------- */
// function StorySection({ title, tagline, description, url, cta }) {
//   return (
//     <section className="story-section flex min-h-screen w-full flex-col items-center justify-center px-4 text-center">
//       <div className="max-w-4xl">
//         <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#f2d38a]/90">
//           {tagline}
//         </p>

//         <h2 className="text-3xl font-extrabold tracking-tight text-[#f7f1df] md:text-6xl">
//           {title}
//         </h2>

//         <p className="mx-auto mt-6 max-w-[78ch] text-base font-medium leading-7 text-[#f7f1df]/85 md:text-lg md:leading-8">
//           {description}
//         </p>

//         <div className="mt-10 flex items-center justify-center">
//           <a
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="
//               story-btn pointer-events-auto relative inline-flex items-center gap-3
//               select-none rounded-2xl px-7 py-3.5
//               bg-white/10 backdrop-blur-xl
//               text-[#f7f1df] font-semibold
//               border border-white/15
//               shadow-[0_12px_40px_rgba(0,0,0,0.25)]
//               transition-all duration-200 ease-out
//               hover:-translate-y-0.5 hover:bg-white/12 hover:border-white/25
//               active:translate-y-0 active:scale-[0.99]
//               focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d38a]/60
//               overflow-hidden
//             "
//           >
//             <span className="btn-text">{cta ?? "View Project"}</span>
//             <span className="btn-arrow">→</span>
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ----------------------------- Page View ------------------------------ */
// export default function StoryWorld() {
//   // Magnetic + Ripple + Entrance animations (cleaned up, safe, no leaks)
//   useEffect(() => {
//     const buttons = Array.from(document.querySelectorAll(".story-btn"));
//     const cleanups = [];

//     buttons.forEach((btn) => {
//       const strength = 36;

//       const move = (e) => {
//         const r = btn.getBoundingClientRect();
//         const x = e.clientX - r.left - r.width / 2;
//         const y = e.clientY - r.top - r.height / 2;

//         gsap.to(btn, {
//           x: x / strength,
//           y: y / strength,
//           duration: 0.25,
//           ease: "power3.out",
//         });
//       };

//       const reset = () =>
//         gsap.to(btn, {
//           x: 0,
//           y: 0,
//           duration: 0.35,
//           ease: "power3.out",
//         });

//       btn.addEventListener("mousemove", move);
//       btn.addEventListener("mouseleave", reset);

//       // Entrance per section (not per button only)
//       const section = btn.closest(".story-section");
//       if (section) {
//         gsap.fromTo(
//           section,
//           { opacity: 0, y: 24, filter: "blur(6px)" },
//           {
//             opacity: 1,
//             y: 0,
//             filter: "blur(0px)",
//             duration: 0.9,
//             ease: "power3.out",
//             scrollTrigger: {
//               trigger: section,
//               start: "top 72%",
//               toggleActions: "play none none reverse",
//             },
//           }
//         );
//       }

//       const click = (e) => {
//         // keep navigation, but add ripple and open safely
//         e.preventDefault();
//         const url = btn.getAttribute("href");
//         if (!url) return;

//         const old = btn.querySelector(".btn-ripple");
//         if (old) old.remove();

//         const ripple = document.createElement("span");
//         ripple.className = "btn-ripple";
//         btn.appendChild(ripple);

//         gsap.fromTo(
//           ripple,
//           { scale: 0, opacity: 0.55 },
//           {
//             scale: 9,
//             opacity: 0,
//             duration: 0.55,
//             ease: "power3.out",
//             onComplete: () => window.open(url, "_blank", "noopener,noreferrer"),
//           }
//         );
//       };

//       btn.addEventListener("click", click);

//       cleanups.push(() => {
//         btn.removeEventListener("mousemove", move);
//         btn.removeEventListener("mouseleave", reset);
//         btn.removeEventListener("click", click);
//       });
//     });

//     return () => cleanups.forEach((fn) => fn());
//   }, []);

//   return (
//     <div className="relative h-screen w-full overflow-hidden bg-[#07060b]">
//       {/* Premium background layer */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#f2d38a]/12 blur-3xl" />
//         <div className="absolute bottom-[-140px] left-[-140px] h-[520px] w-[520px] rounded-full bg-white/6 blur-3xl" />
//         <div className="absolute right-[-180px] top-1/3 h-[540px] w-[540px] rounded-full bg-white/5 blur-3xl" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
//       </div>

//       {/* Subtle grain (optional) */}
//       <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')]"></div>

//       <Canvas
//         camera={{ position: [0, 1.35, 13.5], fov: 48 }}
//         gl={{ alpha: true, antialias: true }}
//         dpr={[1, 2]}
//       >
//         <Suspense fallback={null}>
//           <ScrollControls pages={PROJECTS.length + 1} damping={0.14}>
//             <CameraRig />
//             <World />

//             <EffectComposer>
//               <Bloom intensity={0.65} />
//               <Vignette darkness={0.42} />
//             </EffectComposer>

//             {/* HTML story */}
//             <Scroll html style={{ width: "100vw", pointerEvents: "auto" }}>
//               <ProgressBar />

//               <div className="pointer-events-auto w-screen">
//                 <div className="mx-auto w-full max-w-6xl px-4">
//                   {/* Intro */}
//                   <section className="story-section flex min-h-screen w-full flex-col items-center justify-center text-center">
//                     <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#f2d38a]/90">
//                       ...
//                     </p>
//                     <h1 className="text-4xl font-extrabold tracking-tight text-[#f7f1df] md:text-7xl">
//                       We build products that feel inevitable.
//                     </h1>
//                     <p className="mx-auto mt-6 max-w-[78ch] text-base font-medium leading-7 text-[#f7f1df]/80 md:text-lg md:leading-8">
//                       Scroll through the chapters. Each project is a milestone—designed with
//                       clarity, engineered with care, and presented with intention.
//                     </p>
//                     <div className="mt-10 flex items-center justify-center">
//                       <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[#f7f1df]/85 backdrop-blur">
//                         Scroll to begin ↓
//                       </div>
//                     </div>
//                   </section>

//                   {/* Chapters */}
//                   {PROJECTS.map((p) => (
//                     <StorySection key={p.title} {...p} />
//                   ))}

//                   {/* Outro */}
//                   <section className="story-section flex min-h-screen w-full items-center justify-center">
//                     <div className="text-center">
//                       <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f2d38a]/90">
//                         End of story
//                       </p>
//                       <h3 className="mt-3 text-3xl font-extrabold text-[#f7f1df] md:text-5xl">
//                         Let’s build the next chapter.
//                       </h3>

//                       <div className="mt-10 flex items-center justify-center gap-3">
//                         <a
//                           className="
//                             pointer-events-auto inline-flex items-center justify-center rounded-xl
//                             border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold
//                             text-[#f7f1df] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/12
//                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d38a]/60
//                           "
//                           href="/"
//                         >
//                           Return Home
//                         </a>
//                       </div>
//                     </div>
//                   </section>
//                 </div>
//               </div>
//             </Scroll>
//           </ScrollControls>

//           <Preload all />
//         </Suspense>
//       </Canvas>

//       {/* Local CSS for ripple (kept inline-safe) */}
//       <style>{`
//         .btn-ripple{
//           position:absolute;
//           left:50%;
//           top:50%;
//           width:18px;
//           height:18px;
//           border-radius:999px;
//           transform:translate(-50%,-50%);
//           background:rgba(242,211,138,0.55);
//           filter:blur(0px);
//           pointer-events:none;
//         }
//       `}</style>
//     </div>
//   );
// }

// /* Preload */
// useGLTF.preload("/models/aboutPage/planet10.glb");







































































// comprerssed 
// StoryWorld.jsx (optimized)
import React, { Suspense, useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ScrollControls,
  Scroll,
  useScroll,
  Float,
  Stars,
  Preload,
  PerformanceMonitor,
} from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import AnimatedGLTF from "../components/AnimatedGLTF.jsx";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "../styles/story.css";

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------- Utils -------------------------------- */
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const smoothstep = (t) => t * t * (3 - 2 * t);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ----------------------------- Camera Rig ---------------------------- */
function CameraRig() {
  const scroll = useScroll();

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 2, 15),
          new THREE.Vector3(6, 1.8, 10),
          new THREE.Vector3(8, 1.5, 5),
          new THREE.Vector3(4, 1.2, 0),
          new THREE.Vector3(-2, 1.5, -4),
          new THREE.Vector3(-5, 2, -8),
          new THREE.Vector3(0, 2.5, -12),
          new THREE.Vector3(3, 3, -15),
          new THREE.Vector3(0, 3.5, -18),
        ],
        false,
        "catmullrom",
        0.4
      ),
    []
  );

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const lookPos = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const t = clamp01(scroll.offset);
    const smoothT = easeInOutCubic(t);

    curve.getPointAt(smoothT, targetPos);
    curve.getPointAt(clamp01(smoothT + 0.008), lookPos);

    const parallaxStrength = THREE.MathUtils.lerp(0.5, 0.2, smoothT);
    targetPos.x += state.pointer.x * parallaxStrength;
    targetPos.y += state.pointer.y * (parallaxStrength * 0.5);

    // damped lerp
    state.camera.position.lerp(targetPos, 1 - Math.pow(0.0008, delta));
    currentLook.lerp(lookPos, 1 - Math.pow(0.001, delta));
    state.camera.lookAt(currentLook);

    // reduce camera updates cost slightly (still smooth)
    const targetFOV = THREE.MathUtils.lerp(50, 45, smoothT);
    if (Math.abs(state.camera.fov - targetFOV) > 0.02) {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFOV, delta * 2);
      state.camera.updateProjectionMatrix();
    }
  });

  return null;
}

/* ------------------------------ 3D World ----------------------------- */
function World({ quality = "high" }) {
  const scroll = useScroll();
  const lightRef = useRef();
  const groupRef = useRef();
  const planetRef = useRef();
  const ambientRef = useRef();
  const rimLightRef = useRef();

  // Quality knobs
  const starCount = quality === "low" ? 900 : quality === "mid" ? 1600 : 2200;
  const starFactor = quality === "low" ? 2 : quality === "mid" ? 3 : 4;

  useFrame((state, delta) => {
    const t = scroll.offset;

    // group parallax rotation
    if (groupRef.current) {
      const targetRotX = -state.pointer.y * 0.08;
      const targetRotY = state.pointer.x * 0.12;

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        3,
        delta
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        3,
        delta
      );
    }

    // lighting
    if (lightRef.current) {
      const intensity = THREE.MathUtils.lerp(1.1, quality === "low" ? 1.7 : 2.3, smoothstep(t));
      lightRef.current.intensity = THREE.MathUtils.damp(lightRef.current.intensity, intensity, 4, delta);
    }
    if (ambientRef.current) {
      const ambient = THREE.MathUtils.lerp(0.25, quality === "low" ? 0.45 : 0.6, t);
      ambientRef.current.intensity = THREE.MathUtils.damp(ambientRef.current.intensity, ambient, 3, delta);
    }
    if (rimLightRef.current) {
      const rim = THREE.MathUtils.lerp(0.7, quality === "low" ? 1.0 : 1.4, Math.sin(t * Math.PI));
      rimLightRef.current.intensity = THREE.MathUtils.damp(rimLightRef.current.intensity, rim, 5, delta);
    }

    // planet orbit
    if (planetRef.current) {
      const orbitRadius = 12;
      const orbitSpeed = t * Math.PI * 2;

      planetRef.current.position.x = Math.cos(orbitSpeed) * orbitRadius + 2;
      planetRef.current.position.z = Math.sin(orbitSpeed) * orbitRadius;
      planetRef.current.position.y = Math.sin(t * Math.PI) * 3 - 1;

      planetRef.current.rotation.y += delta * 0.3;
      planetRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={starCount}
        factor={starFactor}
        saturation={0.5}
        fade
        speed={quality === "low" ? 0.25 : 0.45}
      />

      <group ref={groupRef}>
        <ambientLight ref={ambientRef} intensity={0.3} color="#e8dcc0" />

        <directionalLight
          ref={lightRef}
          position={[8, 10, 6]}
          intensity={1.2}
          color="#ffeaa7"
        />

        <directionalLight
          ref={rimLightRef}
          position={[-6, 2, -8]}
          intensity={0.8}
          color="#74b9ff"
        />

        {quality !== "low" && (
          <spotLight position={[0, 15, 0]} angle={0.5} penumbra={1} intensity={0.4} color="#dfe6e9" />
        )}

        <Environment preset="sunset" environmentIntensity={quality === "low" ? 0.4 : 0.6} />

        <Float speed={1.3} rotationIntensity={0.28} floatIntensity={0.7}>
          <group ref={planetRef} position={[10, 0, 8]}>
            <AnimatedGLTF url="/models/aboutPage/planet10.glb" scale={1.4} />

            {/* cheaper geometry */}
            <mesh scale={1.6}>
              <sphereGeometry args={[1, quality === "low" ? 16 : 24, quality === "low" ? 16 : 24]} />
              <meshBasicMaterial
                color="#9d6800"
                transparent
                opacity={quality === "low" ? 0.1 : 0.15}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        </Float>

        {/* ambient wire sphere: reduce segments */}
        <mesh position={[0, 0, -5]}>
          <sphereGeometry args={[30, quality === "low" ? 16 : 24, quality === "low" ? 16 : 24]} />
          <meshBasicMaterial color="#9d6800" wireframe transparent opacity={0.03} />
        </mesh>
      </group>
    </>
  );
}

/* ---------------------------- Progress Bar --------------------------- */
function ProgressBar() {
  const scroll = useScroll();
  const barRef = useRef(null);
  const glowRef = useRef(null);

  // simple style update; cheap enough
  useFrame(() => {
    const progress = scroll.offset;
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    if (glowRef.current) glowRef.current.style.opacity = String(progress * 0.8);
  });

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[60] h-1 w-screen bg-black/20">
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent blur-xl"
        style={{ opacity: 0 }}
      />
      <span
        ref={barRef}
        className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#9d6800] via-[#d4a574] to-[#ffd700] shadow-lg shadow-[#9d6800]/50"
      />
    </div>
  );
}

/* ✅ PROJECT DATA */
const PROJECTS = [
  {
    title: "Yarrowtech",
    description:
      "YarrowTech is a next-generation software development company dedicated to transforming ideas into intelligent, high-impact digital solutions. Our expertise spans custom software development, ERP systems, AI-driven applications, and full-stack web and mobile development—built to support the evolving needs of modern businesses.",
    url: "https://yarrowtech.com",
    cta: "Visit Website",
  },
  {
    title: "Building",
    description:
      "This project involves building a secure, regulated crowdfunding platform for early-stage startups, designed to connect vetted founders with retail investors through a transparent and compliant digital marketplace. The platform enables startups to raise capital efficiently while allowing investors to discover, evaluate, and invest in curated opportunities with confidence. The system incorporates KYC/AML compliance, campaign management, ensuring trust, regulatory alignment, and long-term platform sustainability.",
    url: "https://sportbit.app",
    cta: "View Platform",
  },
  {
    title: "Hire-Me",
    description:
      "Hire Me is a subscription-driven HR ecosystem that unites partner companies, their HR teams, and the employees they steward. We streamline workforce intake, tracking, and compliance for partner organisations while maintaining a secure, always-on environment administered by our in-house team. Built for scalability, data protection, and round-the-clock availability, Hire Me delivers a dependable bridge between modern employers and the talent they nurture.",
    url: "https://fb.yarrowtech.com",
    cta: "Explore Product",
  },
  {
    title: "Art-Block",
    description:
      "ArtBlock is an innovative online social platform that empowers independent artists and creators to showcase, share, and monetize their work through a subscription-based model. It bridges the gap between creators and their audiences by offering tools for exclusive content sharing, tiered memberships, community engagement, and direct financial support. The platform integrates secure payment gateways, real-time notifications, and an analytics dashboard to track engagement and earnings.",
    url: "https://myguide.yarrowtech.com",
    cta: "See Solution",
  },
  {
    title: "Green-bar",
    description:
      "Green-bar is a web-based platform designed for ordering fresh groceries and farm produce online. It allows users to browse products, place orders, and manage purchases easily. The system includes admin and seller modules for product, order, and inventory management. BuyFresh provides a smooth checkout experience with real-time order tracking.",
    url: "https://electroniceducare.com",
    cta: "View Product",
  },
  {
    title: "Better-Pass",
    description:
      "The Better Pass is a social travel platform where tour companies and tourists can connect, post tours, and make bookings. Designed with an experience similar to Instagram or LinkedIn, the app supports four user roles: Tour Companies, Tourists/Travellers, Influencers, and Activity Instructors. Tour companies can share and promote their tour offerings, influencers can help amplify these tours, and activity instructors can showcase engaging nearby activities.",
    url: "https://electroniceducare.com",
    cta: "View Product",
  },
];

/* ---------------------------- Quality Controller --------------------------- */
function QualityController({ onQuality }) {
  // If FPS drops -> downgrade quality. If stable -> upgrade slowly.
  const stableRef = useRef(0);

  return (
    <PerformanceMonitor
      onDecline={() => {
        stableRef.current = 0;
        onQuality((q) => (q === "high" ? "mid" : "low"));
      }}
      onIncline={() => {
        stableRef.current += 1;
        // only upgrade after some stable intervals
        if (stableRef.current > 3) {
          onQuality((q) => (q === "low" ? "mid" : "high"));
          stableRef.current = 0;
        }
      }}
    />
  );
}

/* ---------------------------- Page View ------------------------------ */
export default function StoryWorld() {
  const [quality, setQuality] = useState("high");

  /* ✅ FIX: magnetic buttons without creating tweens per mousemove */
  useEffect(() => {
    const buttons = document.querySelectorAll(".story-btn");
    const cleanups = [];

    buttons.forEach((btn) => {
      const magneticStrength = 35;
      let isHovering = false;

      // fast setters (no new tweens per event)
      const quickX = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power2.out" });
      const quickY = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power2.out" });

      // throttle mousemove by RAF
      let raf = 0;
      let lastEvent = null;

      const move = (e) => {
        if (!isHovering) return;
        lastEvent = e;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const ev = lastEvent;
          if (!ev) return;

          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const deltaX = (ev.clientX - centerX) / magneticStrength;
          const deltaY = (ev.clientY - centerY) / magneticStrength;

          quickX(deltaX);
          quickY(deltaY);
        });
      };

      const enter = () => {
        isHovering = true;
        gsap.to(btn, { scale: 1.05, duration: 0.25, ease: "power2.out" });
      };

      const leave = () => {
        isHovering = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        lastEvent = null;

        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
        });
      };

      // Scroll-triggered entrance animation
      gsap.from(btn, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: btn,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      // Ripple click (kept)
      const handleClick = (e) => {
        e.preventDefault();
        const url = btn.href;

        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.className = "btn-ripple";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        btn.appendChild(ripple);

        gsap.fromTo(
          ripple,
          { scale: 0, opacity: 1 },
          {
            scale: 10,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            onComplete: () => {
              ripple.remove();
              window.open(url, "_blank", "noopener,noreferrer");
            },
          }
        );
      };

      btn.addEventListener("mousemove", move, { passive: true });
      btn.addEventListener("mouseenter", enter, { passive: true });
      btn.addEventListener("mouseleave", leave, { passive: true });
      btn.addEventListener("click", handleClick);

      cleanups.push(() => {
        btn.removeEventListener("mousemove", move);
        btn.removeEventListener("mouseenter", enter);
        btn.removeEventListener("mouseleave", leave);
        btn.removeEventListener("click", handleClick);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  /* Smooth section transitions */
  useEffect(() => {
    const sections = document.querySelectorAll(".project-section");
    sections.forEach((section) => {
      const content = section.querySelector(".project-content");
      if (!content) return;

      gsap.from(content, {
        opacity: 0,
        y: 80,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  const enableFX = quality !== "low"; // postprocessing is expensive

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#1a1410] via-[#2d2416] to-[#1a1410]">
      <Canvas
        camera={{ position: [0, 2, 15], fov: 50, near: 0.1, far: 1000 }}
        dpr={quality === "low" ? [1, 1] : quality === "mid" ? [1, 1.35] : [1, 1.75]}
        gl={{
          alpha: true,
          antialias: quality === "high",
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        // shadows are costly + not needed here
        shadows={false}
      >
        <Suspense fallback={null}>
          <QualityController onQuality={setQuality} />

          <ScrollControls pages={7} damping={0.18} distance={1}>
            <CameraRig />
            <World quality={quality} />

            {enableFX && (
              <EffectComposer multisampling={quality === "high" ? 2 : 0}>
                <Bloom
                  intensity={quality === "high" ? 0.75 : 0.55}
                  luminanceThreshold={0.25}
                  luminanceSmoothing={0.85}
                  blendFunction={BlendFunction.ADD}
                />
                <Vignette darkness={0.4} offset={0.3} blendFunction={BlendFunction.NORMAL} />
                {quality === "high" && (
                  <ChromaticAberration offset={[0.00045, 0.00045]} blendFunction={BlendFunction.NORMAL} />
                )}
              </EffectComposer>
            )}

            <Scroll html style={{ width: "100vw", pointerEvents: "auto" }}>
              <ProgressBar />

              <div className="pointer-events-auto w-screen">
                <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
                  {PROJECTS.map((project, index) => (
                    <section
                      key={project.title}
                      className="project-section flex min-h-screen w-full items-center justify-center py-20"
                    >
                      <div className="project-content flex flex-col items-center gap-8 text-center">
                        <div className="text-[#9d6800]/40 text-sm font-mono tracking-wider">
                          {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                        </div>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-[#ffd700] via-[#d4a574] to-[#9d6800] bg-clip-text text-transparent drop-shadow-2xl">
                          {project.title}
                        </h2>

                        <p className="mx-auto max-w-[65ch] text-base md:text-lg lg:text-xl leading-relaxed text-[#e8dcc0]/90 font-light">
                          {project.description}
                        </p>

                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="story-btn group pointer-events-auto relative inline-flex items-center gap-4 mt-6 select-none rounded-full px-10 py-4 bg-gradient-to-r from-[#9d6800] to-[#d4a574] text-white font-semibold text-lg shadow-[0_10px_40px_rgba(157,104,0,0.4)] transition-all duration-300 hover:shadow-[0_15px_50px_rgba(157,104,0,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700] overflow-hidden"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-[#ffd700] to-[#d4a574] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="btn-text relative z-10">{project.cta}</span>
                          <span className="btn-arrow relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </a>
                      </div>
                    </section>
                  ))}

                  <section className="flex min-h-screen w-full items-center justify-center">
                    <div className="text-center space-y-6">
                      <p className="text-[#e8dcc0]/70 text-lg">Ready to start your journey?</p>
                      <a
                        className="pointer-events-auto inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#9d6800] bg-transparent px-8 py-4 text-base font-semibold text-[#ffd700] backdrop-blur-sm transition-all duration-300 hover:bg-[#9d6800] hover:text-white hover:border-[#ffd700] hover:shadow-[0_10px_30px_rgba(157,104,0,0.4)]"
                        href="/"
                      >
                        <span>Return Home</span>
                        <span className="text-xl">↩</span>
                      </a>
                    </div>
                  </section>
                </div>
              </div>
            </Scroll>
          </ScrollControls>

          <Preload all />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
    </div>
  );
}

/* Preload assets */
import { useGLTF } from "@react-three/drei";
useGLTF.preload("/models/aboutPage/planet10.glb");
