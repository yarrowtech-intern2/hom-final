




// import React, { Suspense, useMemo, useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import {
//   Environment,
//   ScrollControls,
//   Scroll,
//   Html,
//   ContactShadows,
//   Preload,
//   useScroll,
//   useGLTF,
// } from "@react-three/drei";
// import * as THREE from "three";

// import AnimatedGLTF from "../components/AnimatedGLTF.jsx";

// /* ----------------------------- Loader UI ----------------------------- */
// function Loader() {
//   return (
//     <Html center>
//       <div className="pointer-events-none w-[280px] max-w-[70vw] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
//         <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
//           <div className="h-full w-1/3 animate-[loader_1.2s_linear_infinite] rounded-full bg-white/70" />
//         </div>
//         <p className="mt-3 text-center text-sm text-white/80">Loading experience…</p>

//         <style>{`
//           @keyframes loader {
//             0% { transform: translateX(-60%); }
//             50% { transform: translateX(120%); }
//             100% { transform: translateX(-60%); }
//           }
//         `}</style>
//       </div>
//     </Html>
//   );
// }

// /* ----------------------------- Camera Rig ---------------------------- */
// function CameraRig() {
//   const scroll = useScroll();

//   const curve = useMemo(
//     () =>
//       new THREE.CatmullRomCurve3(
//         [
//           new THREE.Vector3(0, 1.3, 12),
//           new THREE.Vector3(4, 1.1, 6),
//           new THREE.Vector3(0, 1.2, 0),
//           new THREE.Vector3(-3, 1.4, -5),
//           new THREE.Vector3(0, 2.0, -10),
//         ],
//         false,
//         "catmullrom",
//         0.5
//       ),
//     []
//   );

//   const target = useRef(new THREE.Vector3());
//   const look = useRef(new THREE.Vector3());

//   useFrame((state, delta) => {
//     const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
//     curve.getPointAt(t, target.current);

//     const ahead = THREE.MathUtils.clamp(t + 0.01, 0, 1);
//     curve.getPointAt(ahead, look.current);

//     const damp = 1 - Math.pow(0.001, delta);
//     state.camera.position.lerp(target.current, damp);
//     state.camera.lookAt(look.current);
//   });

//   return null;
// }

// /* ------------------------------ 3D Scene ----------------------------- */
// function Scene() {
//   return (
//     <>
//       <ambientLight intensity={0.55} />
//       <directionalLight
//         position={[6, 8, 4]}
//         intensity={1.15}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//       />
//       <Environment preset="studio" />

//       {/* keep your floor/shadow config exactly as-is */}
//       <ContactShadows
//         opacity={0}
//         scale={22}
//         blur={2.8}
//         far={10}
//         resolution={1024}
//         color="#000000"
//         frames={1}
//         position={[0, -0.001, 0]}
//       />

//       {/* keep your 3D models exactly as-is */}
//       <AnimatedGLTF url="/models/aboutPage/golden-atom10.glb" scale={0.8} position={[5, 0, 3]} />
//       <AnimatedGLTF url="/models/aboutPage/planet10.glb" scale={1.2} position={[10, 0, 8]} />
//     </>
//   );
// }

// /* ------------------------------ Overlay UI --------------------------- */
// function StoryOverlay() {
//   const Section = ({ kicker, title, subtitle, children, chips, cta }) => (
//     <section className="min-h-screen w-screen px-4">
//       <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 text-center">
//         {/* Kicker */}
//         {kicker ? (
//           <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/30 px-4 py-2 text-xs font-semibold tracking-wide text-black/70 backdrop-blur">
//             <span className="h-1.5 w-1.5 rounded-full bg-black/60" />
//             {kicker}
//           </div>
//         ) : null}

//         {/* Headline */}
//         {title ? (
//           <h1 className="text-balance text-4xl font-extrabold tracking-tight text-black md:text-6xl">
//             {title}
//           </h1>
//         ) : (
//           <h2 className="text-balance text-3xl font-extrabold tracking-tight text-black md:text-5xl">
//             {subtitle}
//           </h2>
//         )}

//         {/* Chips */}
//         {chips?.length ? (
//           <div className="flex flex-wrap items-center justify-center gap-2">
//             {chips.map((c) => (
//               <span
//                 key={c}
//                 className="rounded-full border border-black/10 bg-white/25 px-3 py-1 text-xs font-semibold text-black/70 backdrop-blur"
//               >
//                 {c}
//               </span>
//             ))}
//           </div>
//         ) : null}

//         {/* Body */}
//         <p className="mx-auto max-w-[78ch] text-pretty text-base leading-7 text-black/75 md:text-lg md:leading-8">
//           {children}
//         </p>

//         {/* CTA */}
//         {cta ? (
//           <div className="pointer-events-auto mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
//             <a
//               href="/contact"
//               className="inline-flex items-center justify-center rounded-2xl border border-black/15 bg-black/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-black"
//             >
//               Talk to Our Experts
//             </a>
//             <a
//               href="/products"
//               className="inline-flex items-center justify-center rounded-2xl border border-black/15 bg-white/40 px-6 py-3 text-sm font-semibold text-black backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/55"
//             >
//               Explore Solutions
//             </a>
//           </div>
//         ) : null}
//       </div>
//     </section>
//   );

//   const CardGrid = ({ items }) => (
//     <div className="mx-auto mt-2 grid w-full max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2">
//       {items.map((it) => (
//         <div
//           key={it.title}
//           className="rounded-2xl border border-black/10 bg-white/35 p-4 text-left backdrop-blur"
//         >
//           <div className="text-sm font-extrabold text-black">{it.title}</div>
//           <div className="mt-1 text-sm leading-6 text-black/70">{it.desc}</div>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="pointer-events-none w-screen">
//       {/* 1) Intro */}
//       <Section
//         kicker="ABOUT HOUSE OF MUSA"
//         title="Engineering Intelligent Digital Ecosystems"
//         chips={["ERP Systems", "ML Systems", "Web Applications", "Enterprise Dashboards"]}
//       >
//         <b>HOUSE OF MUSA</b> is an IT company that designs and builds <b>enterprise-grade software</b> —
//         from modular <b>ERP platforms</b> to powerful <b>machine learning systems</b> and high-performance{" "}
//         <b>web applications</b>. We help organizations streamline operations, automate workflows, and
//         make smarter decisions with data.
//       </Section>

//       {/* 2) Who We Are */}
//       <Section
//         kicker="WHO WE ARE"
//         subtitle="Product-focused engineers, architects & data builders"
//         chips={["Security-first", "Scalable by design", "Clean UI + strong backend", "Long-term partnership"]}
//       >
//         We are a team of engineers, product designers, and data specialists focused on solving
//         real operational problems. Our work blends <b>modern UI</b>, <b>robust backend systems</b>, and{" "}
//         <b>AI-powered intelligence</b> to deliver solutions that are reliable, maintainable, and built
//         for scale.
//       </Section>

//       {/* 3) What We Do */}
//       <Section
//         kicker="WHAT WE DO"
//         subtitle="Three core pillars that power our solutions"
//         chips={["ERP Platforms", "Machine Learning", "Custom Web Apps"]}
//       >
//         We build systems that connect people, processes, and data. Whether you’re replacing legacy
//         tools or launching a new platform, HOUSE OF MUSA delivers end-to-end execution — discovery,
//         design, development, deployment, and ongoing support.
//         <CardGrid
//           items={[
//             {
//               title: "ERP Systems",
//               desc: "HR, Finance, Inventory, Procurement, Vendor Management, Role-based Admin Panels, and real-time analytics.",
//             },
//             {
//               title: "ML Systems",
//               desc: "Predictive insights, anomaly detection, recommendations, forecasting, and decision intelligence for operations.",
//             },
//             {
//               title: "Web Applications",
//               desc: "SaaS products, portals, dashboards, and high-performance web experiences built to scale.",
//             },
//             {
//               title: "Integrations & Automation",
//               desc: "API-first integrations, workflow automation, notifications, reporting pipelines, and data sync.",
//             },
//           ]}
//         />
//       </Section>

//       {/* 4) Vision + Mission */}
//       <Section
//         kicker="VISION & MISSION"
//         subtitle="Build ethical, scalable technology that moves industries forward"
//         chips={["Modular", "User-centric", "Secure", "Performance-driven"]}
//       >
//         <b>Vision:</b> To become a global technology powerhouse building intelligent systems that empower
//         the next generation of enterprises. <br />
//         <br />
//         <b>Mission:</b> Deliver secure, scalable, and maintainable products that simplify operations,
//         automate complexity, and unlock data-driven decisions through AI/ML.
//       </Section>

//       {/* 5) Industries */}
//       <Section
//         kicker="INDUSTRIES WE SERVE"
//         subtitle="Built for real workflows across domains"
//         chips={["Retail", "Manufacturing", "Education", "Healthcare", "Finance", "Institutions"]}
//       >
//         Our systems adapt to industry-specific workflows while staying modular and extensible.
//         We design solutions that fit your process today — and scale for what you become tomorrow.
//       </Section>

//       {/* 6) Final CTA + Contact */}
//       <Section
//         kicker="LET’S BUILD TOGETHER"
//         subtitle="Ready to launch an intelligent system for your business?"
//         cta
//       >
//         Start with a discovery call — we’ll understand your workflows, map your requirements, and
//         propose the right architecture (ERP / ML / Web) with a clear delivery plan.
//         <div className="mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-black/10 bg-white/35 p-5 text-left backdrop-blur">
//           <div className="text-sm font-extrabold text-black">Contact</div>
//           <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-black/75 sm:grid-cols-2">
//             <div>
//               <span className="font-semibold text-black">Phone:</span> +91 XXXXX XXXXX
//             </div>
//             <div>
//               <span className="font-semibold text-black">Email:</span> hello@houseofmusa.com
//             </div>
//             <div className="sm:col-span-2">
//               <span className="font-semibold text-black">Address:</span> (Add your office location here)
//             </div>
//           </div>
//           <p className="mt-3 text-xs text-black/55">
//             Tip: Replace placeholders with your real contact info.
//           </p>
//         </div>
//       </Section>
//     </div>
//   );
// }

// /* ------------------------------- Page -------------------------------- */
// export default function StoryWorld() {
//   return (
//     <div className="relative h-[100dvh] w-full overflow-hidden bg-[#9d6800]">
//       <Canvas
//         className="absolute inset-0"
//         shadows
//         dpr={[1, 2]}
//         gl={{
//           antialias: true,
//           alpha: true,
//           powerPreference: "high-performance",
//           toneMapping: THREE.ACESFilmicToneMapping,
//           outputColorSpace: THREE.SRGBColorSpace,
//         }}
//         camera={{ position: [0, 1.3, 12], fov: 50, near: 0.1, far: 120 }}
//         onCreated={({ gl }) => gl.setClearAlpha(0)}
//       >
//         <Suspense fallback={<Loader />}>
//           {/* ✅ We keep pages=6 to match your previous layout */}
//           <ScrollControls pages={6} damping={0.18}>
//             <CameraRig />
//             <Scene />

//             <Scroll html>
//               <StoryOverlay />
//             </Scroll>
//           </ScrollControls>

//           <Preload all />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }

// /* ----------------------------- Preload GLBs -------------------------- */
// useGLTF.preload("/models/aboutPage/planet10.glb");
// useGLTF.preload("/models/aboutPage/golden-atom10.glb");

















































import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ScrollControls,
  Scroll,
  Html,
  ContactShadows,
  Preload,
  useScroll,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

import AnimatedGLTF from "../components/AnimatedGLTF.jsx";

/* ----------------------------- Loader UI ----------------------------- */
function Loader() {
  return (
    <Html center>
      <div className="pointer-events-none w-[280px] max-w-[70vw] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/3 animate-[loader_1.2s_linear_infinite] rounded-full bg-white/70" />
        </div>
        <p className="mt-3 text-center text-sm text-white/80">Loading experience…</p>

        <style>{`
          @keyframes loader {
            0% { transform: translateX(-60%); }
            50% { transform: translateX(120%); }
            100% { transform: translateX(-60%); }
          }
        `}</style>
      </div>
    </Html>
  );
}

/* ----------------------------- Camera Rig ---------------------------- */
function CameraRig() {
  const scroll = useScroll();

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 1.3, 12),
          new THREE.Vector3(4, 1.1, 6),
          new THREE.Vector3(0, 1.2, 0),
          new THREE.Vector3(-3, 1.4, -5),
          new THREE.Vector3(0, 2.0, -10),
        ],
        false,
        "catmullrom",
        0.5
      ),
    []
  );

  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    curve.getPointAt(t, target.current);

    const ahead = THREE.MathUtils.clamp(t + 0.01, 0, 1);
    curve.getPointAt(ahead, look.current);

    const damp = 1 - Math.pow(0.001, delta);
    state.camera.position.lerp(target.current, damp);
    state.camera.lookAt(look.current);
  });

  return null;
}

/* ------------------------------ 3D Scene ----------------------------- */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset="studio" />

      <ContactShadows
        opacity={0}
        scale={22}
        blur={2.8}
        far={10}
        resolution={1024}
        color="#000000"
        frames={1}
        position={[0, -0.001, 0]}
      />

      {/* keep your 3D models exactly as-is */}
      <AnimatedGLTF url="/models/aboutPage/golden-atom10.glb" scale={0.8} position={[5, 0, 3]} />
      <AnimatedGLTF url="/models/aboutPage/planet10.glb" scale={1.2} position={[10, 0, 8]} />
    </>
  );
}

/* ------------------------------ Overlay UI --------------------------- */
function StoryOverlay() {
  const Section = ({ kicker, title, subtitle, children, chips, cta }) => (
    // ✅ use svh for mobile stability + padding so content can expand
    <section className="min-h-[100svh] w-screen px-4 py-14 sm:py-20">
      {/* ✅ DON’T force inner container to min-h-screen on mobile (prevents overflow clipping) */}
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center sm:min-h-[100svh] sm:justify-center">
        {/* Kicker */}
        {kicker ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/30 px-4 py-2 text-xs font-semibold tracking-wide text-black/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-black/60" />
            {kicker}
          </div>
        ) : null}

        {/* Headline */}
        {title ? (
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-black sm:text-4xl md:text-6xl">
            {title}
          </h1>
        ) : (
          <h2 className="text-balance text-2xl font-extrabold tracking-tight text-black sm:text-3xl md:text-5xl">
            {subtitle}
          </h2>
        )}

        {/* Chips */}
        {chips?.length ? (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-black/10 bg-white/25 px-3 py-1 text-xs font-semibold text-black/70 backdrop-blur"
              >
                {c}
              </span>
            ))}
          </div>
        ) : null}

        {/* Body */}
        <p className="mx-auto max-w-[78ch] text-pretty text-[15px] leading-7 text-black/75 sm:text-base md:text-lg md:leading-8">
          {children}
        </p>

        {/* CTA */}
        {cta ? (
          <div className="pointer-events-auto mt-2 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <a
              href="/contact"
              className="w-full max-w-xs inline-flex items-center justify-center rounded-2xl border border-black/15 bg-black/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-black sm:w-auto"
            >
              Talk to Our Experts
            </a>
            {/* <a
              href="/products"
              className="w-full max-w-xs inline-flex items-center justify-center rounded-2xl border border-black/15 bg-white/40 px-6 py-3 text-sm font-semibold text-black backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/55 sm:w-auto"
            >
              Explore Solutions
            </a> */}
          </div>
        ) : null}
      </div>
    </section>
  );

  const CardGrid = ({ items }) => (
    <div className="mx-auto mt-2 grid w-full max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.title}
          className="rounded-2xl border border-black/10 bg-white/35 p-4 text-left backdrop-blur"
        >
          <div className="text-sm font-extrabold text-black">{it.title}</div>
          <div className="mt-1 text-sm leading-6 text-black/70">{it.desc}</div>
        </div>
      ))}
    </div>
  );

  return (
    // ✅ allow touch scroll + clickable links
    <div className="w-screen pointer-events-auto">
      <Section
        kicker="ABOUT HOUSE OF MUSA"
        title="Engineering Intelligent Digital Ecosystems"
        chips={["ERP Systems", "ML Systems", "Web Applications", "Enterprise Dashboards"]}
      >
        <b>HOUSE OF MUSA</b> is an IT company that designs and builds <b>enterprise-grade software</b> —
        from modular <b>ERP platforms</b> to powerful <b>machine learning systems</b> and high-performance{" "}
        <b>web applications</b>. We help organizations streamline operations, automate workflows, and
        make smarter decisions with data.
      </Section>

      <Section
        kicker="WHO WE ARE"
        subtitle="Product-focused engineers, architects & data builders"
        chips={["Security-first", "Scalable by design", "Clean UI + strong backend", "Long-term partnership"]}
      >
        We are a team of engineers, product designers, and data specialists focused on solving
        real operational problems. Our work blends <b>modern UI</b>, <b>robust backend systems</b>, and{" "}
        <b>AI-powered intelligence</b> to deliver solutions that are reliable, maintainable, and built
        for scale.
      </Section>

      <Section
        kicker="WHAT WE DO"
        subtitle="Three core pillars that power our solutions"
        chips={["ERP Platforms", "Machine Learning", "Custom Web Apps"]}
      >
        We build systems that connect people, processes, and data. Whether you’re replacing legacy
        tools or launching a new platform, HOUSE OF MUSA delivers end-to-end execution — discovery,
        design, development, deployment, and ongoing support.
        <CardGrid
          items={[
            {
              title: "ERP Systems",
              desc: "HR, Finance, Inventory, Procurement, Vendor Management, Role-based Admin Panels, and real-time analytics.",
            },
            {
              title: "ML Systems",
              desc: "Predictive insights, anomaly detection, recommendations, forecasting, and decision intelligence for operations.",
            },
            {
              title: "Web Applications",
              desc: "SaaS products, portals, dashboards, and high-performance web experiences built to scale.",
            },
            {
              title: "Integrations & Automation",
              desc: "API-first integrations, workflow automation, notifications, reporting pipelines, and data sync.",
            },
          ]}
        />
      </Section>

      <Section
        kicker="VISION & MISSION"
        subtitle="Build ethical, scalable technology that moves industries forward"
        chips={["Modular", "User-centric", "Secure", "Performance-driven"]}
      >
        <b>Vision:</b> To become a global technology powerhouse building intelligent systems that empower
        the next generation of enterprises. <br />
        <br />
        <b>Mission:</b> Deliver secure, scalable, and maintainable products that simplify operations,
        automate complexity, and unlock data-driven decisions through AI/ML.
      </Section>

      <Section
        kicker="INDUSTRIES WE SERVE"
        subtitle="Built for real workflows across domains"
        chips={["Retail", "Manufacturing", "Education", "Healthcare", "Finance", "Institutions"]}
      >
        Our systems adapt to industry-specific workflows while staying modular and extensible.
        We design solutions that fit your process today — and scale for what you become tomorrow.
      </Section>

      {/* ✅ last section needs extra bottom space on mobile (safe area) */}
      <div className="pb-16">
        <Section
          kicker="LET’S BUILD TOGETHER"
          subtitle="Ready to launch an intelligent system for your business?"
          cta
        >
          Start with a discovery call — we’ll understand your workflows, map your requirements, and
          propose the right architecture (ERP / ML / Web) with a clear delivery plan.
          <div className="mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-black/10 bg-white/35 p-5 text-left backdrop-blur">
            <div className="text-sm font-extrabold text-black">Contact</div>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-black/75 sm:grid-cols-2">
              <div>
                <span className="font-semibold text-black">Phone:</span> +91 XXXXX XXXXX
              </div>
              <div>
                <span className="font-semibold text-black">Email:</span> hello@houseofmusa.com
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold text-black">Address:</span> (Add your office location here)
              </div>
            </div>
            <p className="mt-3 text-xs text-black/55">
              Tip: Replace placeholders with your real contact info.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ------------------------------- Page -------------------------------- */
export default function StoryWorld() {
  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-[#9d6800]">
      <Canvas
        // ✅ important: don’t let the canvas steal touch scroll on mobile
        className="absolute inset-0 pointer-events-none"
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 1.3, 12], fov: 50, near: 0.1, far: 120 }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <Suspense fallback={<Loader />}>
          {/* ✅ pages slightly bigger so final section never “cuts” on mobile */}
          <ScrollControls
            pages={7}
            damping={0.18}
            style={{ touchAction: "pan-y" }}
          >
            <CameraRig />
            <Scene />

            <Scroll html>
              <StoryOverlay />
            </Scroll>
          </ScrollControls>

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ----------------------------- Preload GLBs -------------------------- */
useGLTF.preload("/models/aboutPage/planet10.glb");
useGLTF.preload("/models/aboutPage/golden-atom10.glb");
