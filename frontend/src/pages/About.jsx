




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

















































import React, { Suspense, useMemo, useRef, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ScrollControls,
  Scroll,
  ContactShadows,
  Preload,
  useScroll,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

import AnimatedGLTF from "../components/AnimatedGLTF.jsx";

/* ============================= CONSTANTS ============================= */
const CANVAS_CONFIG = {
  shadows: true,
  dpr: [1, 2],
  gl: {
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    toneMapping: THREE.ACESFilmicToneMapping,
    outputColorSpace: THREE.SRGBColorSpace,
  },
  camera: {
    position: [0, 1.3, 12],
    fov: 50,
    near: 0.1,
    far: 120,
  },
};

const CAMERA_PATH = [
  new THREE.Vector3(0, 1.3, 12),
  new THREE.Vector3(4, 1.1, 6),
  new THREE.Vector3(0, 1.2, 0),
  new THREE.Vector3(-3, 1.4, -5),
  new THREE.Vector3(0, 2.0, -10),
];

const MODEL_CONFIGS = [
  { url: "/models/aboutPage/golden-atom10.glb", scale: 0.8, position: [5, 0, 3] },
  { url: "/models/aboutPage/planet10.glb", scale: 1.2, position: [10, 0, 8] },
];

const SCROLL_CONFIG = {
  pages: 6,
  damping: 0.18,
  style: { touchAction: "pan-y" },
};

const LIGHTING_CONFIG = {
  ambient: { intensity: 0.55 },
  directional: {
    position: [6, 8, 4],
    intensity: 1.15,
    castShadow: true,
    shadowMapSize: { width: 2048, height: 2048 },
  },
  contactShadows: {
    opacity: 0,
    scale: 22,
    blur: 2.8,
    far: 10,
    resolution: 1024,
    color: "#000000",
    frames: 1,
    position: [0, -0.001, 0],
  },
};

/* ============================= CAMERA RIG ============================ */
const CameraRig = memo(() => {
  const scroll = useScroll();
  const targetRef = useRef(new THREE.Vector3());
  const lookRef = useRef(new THREE.Vector3());

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(CAMERA_PATH, false, "catmullrom", 0.5),
    []
  );

  useFrame((state, delta) => {
    const scrollOffset = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    
    // Get current camera position
    curve.getPointAt(scrollOffset, targetRef.current);

    // Get look-ahead point for smooth camera orientation
    const aheadOffset = THREE.MathUtils.clamp(scrollOffset + 0.01, 0, 1);
    curve.getPointAt(aheadOffset, lookRef.current);

    // Smooth damping for natural movement
    const dampFactor = 1 - Math.pow(0.001, delta);
    state.camera.position.lerp(targetRef.current, dampFactor);
    state.camera.lookAt(lookRef.current);
  });

  return null;
});

CameraRig.displayName = "CameraRig";

/* ============================= 3D SCENE ============================== */
const Scene = memo(() => {
  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={LIGHTING_CONFIG.ambient.intensity} />
      <directionalLight
        position={LIGHTING_CONFIG.directional.position}
        intensity={LIGHTING_CONFIG.directional.intensity}
        castShadow={LIGHTING_CONFIG.directional.castShadow}
        shadow-mapSize-width={LIGHTING_CONFIG.directional.shadowMapSize.width}
        shadow-mapSize-height={LIGHTING_CONFIG.directional.shadowMapSize.height}
      />
      <Environment preset="studio" />

      {/* Ground Contact Shadows */}
      <ContactShadows
        opacity={LIGHTING_CONFIG.contactShadows.opacity}
        scale={LIGHTING_CONFIG.contactShadows.scale}
        blur={LIGHTING_CONFIG.contactShadows.blur}
        far={LIGHTING_CONFIG.contactShadows.far}
        resolution={LIGHTING_CONFIG.contactShadows.resolution}
        color={LIGHTING_CONFIG.contactShadows.color}
        frames={LIGHTING_CONFIG.contactShadows.frames}
        position={LIGHTING_CONFIG.contactShadows.position}
      />

      {/* 3D Models */}
      {MODEL_CONFIGS.map((config, index) => (
        <AnimatedGLTF
          key={`model-${index}`}
          url={config.url}
          scale={config.scale}
          position={config.position}
        />
      ))}
    </>
  );
});

Scene.displayName = "Scene";

/* ============================= SECTION COMPONENT ===================== */
const Section = memo(
  ({ kicker, title, subtitle, children, chips, cta, sectionClassName = "" }) => (
    <section
      className={`min-h-[76svh] w-screen px-4 py-10 sm:min-h-[82svh] sm:py-14 ${sectionClassName}`}
    >
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-5 text-center">
      {/* Kicker Badge */}
      {kicker && (
        <div
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/30 px-4 py-2 text-xs font-semibold tracking-wide text-black/70 backdrop-blur"
          aria-label={`Section: ${kicker}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-black/60" aria-hidden="true" />
          {kicker}
        </div>
      )}

      {/* Headline */}
      {title ? (
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-7xl">
          {title}
        </h1>
      ) : subtitle ? (
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-black sm:text-4xl md:text-6xl">
          {subtitle}
        </h2>
      ) : null}

      {/* Feature Chips */}
      {chips?.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2" role="list">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-black/10 bg-white/25 px-3 py-1 text-xs font-semibold text-black/70 backdrop-blur"
              role="listitem"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {/* Body Content */}
      {children && (
        <div className="mx-auto max-w-[78ch] text-pretty text-[15px] leading-7 text-black/75 sm:text-base md:text-lg md:leading-8">
          {children}
        </div>
      )}

      {/* Call to Action */}
      {cta && (
        <div className="pointer-events-auto mt-2 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          {/* CTA buttons can be added here */}
        </div>
      )}
    </div>
    </section>
  )
);

Section.displayName = "Section";

Section.propTypes = {
  kicker: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  chips: PropTypes.arrayOf(PropTypes.string),
  cta: PropTypes.bool,
  sectionClassName: PropTypes.string,
};

/* ============================= CARD GRID ============================= */
const CardGrid = memo(({ items }) => (
  <div className="mx-auto mt-2 grid w-full max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2">
    {items.map((item) => (
      <article
        key={item.title}
        className="rounded-2xl border border-black/10 bg-white/35 p-4 text-left backdrop-blur"
      >
        <h3 className="text-sm font-extrabold text-black">{item.title}</h3>
        <p className="mt-1 text-sm leading-6 text-black/70">{item.desc}</p>
      </article>
    ))}
  </div>
));

CardGrid.displayName = "CardGrid";

CardGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
    })
  ).isRequired,
};

/* ============================= CONTENT DATA ========================== */
const CONTENT_SECTIONS = {
  hero: {
    kicker: "ABOUT HOUSE OF MUSA",
    title: "Engineering Intelligent Digital Ecosystems",
    chips: ["ERP Systems", "ML Systems", "Web Applications", "Enterprise Dashboards"],
    content: (
      <>
        <strong>HOUSE OF MUSA</strong> is an IT company that designs and builds{" "}
        <strong>enterprise-grade software</strong> — from modular{" "}
        <strong>ERP platforms</strong> to powerful{" "}
        <strong>machine learning systems</strong> and high-performance{" "}
        <strong>web applications</strong>. We help organizations streamline
        operations, automate workflows, and make smarter decisions with data.
      </>
    ),
  },
  about: {
    kicker: "WHO WE ARE",
    subtitle: "Product-focused engineers, architects & data builders",
    chips: [
      "Security-first",
      "Scalable by design",
      "Clean UI + strong backend",
      "Long-term partnership",
    ],
    content: (
      <>
        We are a team of engineers, product designers, and data specialists
        focused on solving real operational problems. Our work blends{" "}
        <strong>modern UI</strong>, <strong>robust backend systems</strong>, and{" "}
        <strong>AI-powered intelligence</strong> to deliver solutions that are
        reliable, maintainable, and built for scale.
      </>
    ),
  },
  services: {
    kicker: "WHAT WE DO",
    subtitle: "Three core pillars that power our solutions",
    chips: ["ERP Platforms", "Machine Learning", "Custom Web Apps"],
    content: (
      <>
        We build systems that connect people, processes, and data. Whether
        you're replacing legacy tools or launching a new platform, HOUSE OF
        MUSA delivers end-to-end execution — discovery, design, development,
        deployment, and ongoing support.
      </>
    ),
    cards: [
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
    ],
  },
  vision: {
    kicker: "VISION & MISSION",
    subtitle: "Build ethical, scalable technology that moves industries forward",
    chips: ["Modular", "User-centric", "Secure", "Performance-driven"],
    content: (
      <>
        <strong>Vision:</strong> To become a global technology powerhouse
        building intelligent systems that empower the next generation of
        enterprises.
        <br />
        <br />
        <strong>Mission:</strong> Deliver secure, scalable, and maintainable
        products that simplify operations, automate complexity, and unlock
        data-driven decisions through AI/ML.
      </>
    ),
  },
  industries: {
    kicker: "INDUSTRIES WE SERVE",
    subtitle: "Built for real workflows across domains",
    chips: ["Retail", "Manufacturing", "Education", "Healthcare", "Finance", "Institutions"],
    content: (
      <>
        Our systems adapt to industry-specific workflows while staying modular
        and extensible. We design solutions that fit your process today — and
        scale for what you become tomorrow.
      </>
    ),
  },
  contact: {
    kicker: "LET'S BUILD TOGETHER",
    subtitle: "Ready to launch an intelligent system for your business?",
    cta: true,
    content: (
      <>
        Start with a discovery call — we'll understand your workflows, map your
        requirements, and propose the right architecture (ERP / ML / Web) with a
        clear delivery plan.
      </>
    ),
  },
};

const CONTACT_INFO = {
  phone: "+91 9836362249",
  email: "houseofmusacareer@houseofmusa.com",
  address:
    "Lighhouse, Humayun Pl, Esplanade, Dharmatala, Taltala, Kolkata- 700087, West Bengal, India",
};

/* ============================= STORY OVERLAY ========================= */
const StoryOverlay = memo(() => {
  return (
    <div className="w-screen pointer-events-auto">
      {/* Hero Section */}
      <Section
        kicker={CONTENT_SECTIONS.hero.kicker}
        title={CONTENT_SECTIONS.hero.title}
        chips={CONTENT_SECTIONS.hero.chips}
        sectionClassName="pt-28 sm:pt-20"
      >
        {CONTENT_SECTIONS.hero.content}
      </Section>

      {/* About Section */}
      <Section
        kicker={CONTENT_SECTIONS.about.kicker}
        subtitle={CONTENT_SECTIONS.about.subtitle}
        chips={CONTENT_SECTIONS.about.chips}
      >
        {CONTENT_SECTIONS.about.content}
      </Section>

      {/* Services Section */}
      <Section
        kicker={CONTENT_SECTIONS.services.kicker}
        subtitle={CONTENT_SECTIONS.services.subtitle}
        chips={CONTENT_SECTIONS.services.chips}
      >
        {CONTENT_SECTIONS.services.content}
        <CardGrid items={CONTENT_SECTIONS.services.cards} />
      </Section>

      {/* Vision & Mission Section */}
      <Section
        kicker={CONTENT_SECTIONS.vision.kicker}
        subtitle={CONTENT_SECTIONS.vision.subtitle}
        chips={CONTENT_SECTIONS.vision.chips}
      >
        {CONTENT_SECTIONS.vision.content}
      </Section>

      {/* Industries Section */}
      <Section
        kicker={CONTENT_SECTIONS.industries.kicker}
        subtitle={CONTENT_SECTIONS.industries.subtitle}
        chips={CONTENT_SECTIONS.industries.chips}
      >
        {CONTENT_SECTIONS.industries.content}
      </Section>

      {/* Contact Section */}
      <div className="pb-4">
        <Section
          kicker={CONTENT_SECTIONS.contact.kicker}
          subtitle={CONTENT_SECTIONS.contact.subtitle}
          cta={CONTENT_SECTIONS.contact.cta}
        >
          {CONTENT_SECTIONS.contact.content}
          <address className="mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-black/10 bg-white/35 p-5 text-left backdrop-blur not-italic">
            <div className="text-sm font-extrabold text-black">Contact</div>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-black/75 sm:grid-cols-2">
              <div>
                <span className="font-semibold text-black">Phone:</span>{" "}
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="hover:text-black transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div>
                <span className="font-semibold text-black">Email:</span>{" "}
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-black transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold text-black">Address:</span>{" "}
                {CONTACT_INFO.address}
              </div>
            </div>
          </address>
        </Section>
      </div>
    </div>
  );
});

StoryOverlay.displayName = "StoryOverlay";

/* ============================= ERROR BOUNDARY ======================== */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("StoryWorld Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#9d6800] p-4">
          <div className="max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white">
              Unable to load experience
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

/* ============================= MAIN COMPONENT ======================== */
export default function StoryWorld() {
  return (
    <ErrorBoundary>
      <div className="relative h-[100svh] w-full overflow-hidden bg-[#9d6800]">
        <Canvas
          className="absolute inset-0 pointer-events-none"
          shadows={CANVAS_CONFIG.shadows}
          dpr={CANVAS_CONFIG.dpr}
          gl={CANVAS_CONFIG.gl}
          camera={CANVAS_CONFIG.camera}
          onCreated={({ gl }) => {
            gl.setClearAlpha(0);
            gl.physicallyCorrectLights = true;
          }}
        >
          <Suspense fallback={null}>
            <ScrollControls
              pages={SCROLL_CONFIG.pages}
              damping={SCROLL_CONFIG.damping}
              style={SCROLL_CONFIG.style}
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
    </ErrorBoundary>
  );
}

/* ============================= MODEL PRELOADING ====================== */
MODEL_CONFIGS.forEach((config) => {
  useGLTF.preload(config.url);
});
