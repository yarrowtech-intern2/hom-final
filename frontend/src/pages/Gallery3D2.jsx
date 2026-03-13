

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  KeyboardControls,
  useKeyboardControls,
  PointerLockControls,
  Html,
  Environment,
  useGLTF,
  ContactShadows,
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
import RapierReady from "./RapierReady.jsx";

// posters 
import Yarrowtech from "../assets/posters/yt.png";
import Building from "../assets/posters/building.png";
import HireMe from "../assets/posters/hireme.png";
import ArtBlock from "../assets/posters/artblock.png";
import GreenBar from "../assets/posters/greenbar.png";
import BetterPass from "../assets/posters/betterpass.png";


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

function WebGLStatusBridge({ onContextLost, onContextRestored }) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return undefined;

    const handleContextLost = (event) => {
      event.preventDefault();
      onContextLost?.();
    };

    const handleContextRestored = () => {
      onContextRestored?.();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored, false);
    };
  }, [gl, onContextLost, onContextRestored]);

  return null;
}

/* ----------------------------- utils ----------------------------- */
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

function detectLowSpecDevice() {
  if (typeof window === "undefined") return false;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  return Boolean(reducedMotion || cores <= 4 || memory <= 4);
}

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

const paintingTextureCache = new Map();
const paintingTexturePromiseCache = new Map();

function loadPaintingTexture(src, anisotropy = 4) {
  const cached = paintingTextureCache.get(src);
  if (cached) {
    const safeAnisotropy = Math.max(1, anisotropy);
    if (cached.anisotropy !== safeAnisotropy) {
      cached.anisotropy = safeAnisotropy;
      cached.needsUpdate = true;
    }
    return Promise.resolve(cached);
  }

  const pending = paintingTexturePromiseCache.get(src);
  if (pending) return pending;

  const loader = new THREE.TextureLoader();
  const promise = new Promise((resolve, reject) => {
    loader.load(
      src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.max(1, anisotropy);
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;
        paintingTextureCache.set(src, tex);
        paintingTexturePromiseCache.delete(src);
        resolve(tex);
      },
      undefined,
      (err) => {
        paintingTexturePromiseCache.delete(src);
        reject(err);
      }
    );
  });

  paintingTexturePromiseCache.set(src, promise);
  return promise;
}

/* ----------------------------- paintings ------------------------- */
const PAINTINGS = [
  {
    id: "p1",
    title: "Yarrowtech",
    img: Yarrowtech,
    position: [-9.9, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    desc: "YarrowTech are a next-generation software development company dedicated to transforming ideas into intelligent, high-impact digital solutions. Our expertise spans custom software development, ERP systems, AI-driven applications, and full-stack web and mobile development—built to support the evolving needs of modern businesses.",
  },
  {
    id: "p2",
    title: "Building",
    img: Building,
    position: [-3.4, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    desc: "  This project involves building a secure, regulated crowdfunding platform for early-stage startups, designed to connect vetted founders with retail investors through a transparent and compliant digital marketplace. The platform enables startups to raise capital efficiently while allowing investors to discover, evaluate, and invest in curated opportunities with confidence.<br> The system incorporates KYC/AML compliance, campaign management, ensuring trust, regulatory alignment, and long-term platform sustainability. Revenue is generated through a commission-based model on successfully funded campaigns, supporting scalable growth and recurring income.<br> With a phased rollout approach, the platform is built for high performance, security, and scalability, targeting strong user adoption, efficient fundraising outcomes, and leadership in the regulated crowdfunding space."
  },
  {
    id: "p3",
    title: "Hire Me",
    img: HireMe,
    position: [3.2, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    desc: "Hire Me is a subscription-driven HR ecosystem that unites partner companies,their HR teams, and the employees they steward. We streamline workforce intake, tracking, and compliance for partner organisations while maintaining a secure, always-on environment administered by our in-house team. HR managers gain an intuitive portal to register, verify, and support their employees; admins oversee partnerships and platform integrity; employees enjoy stability through transparent monitoring; and guests can explore the platform’s value at a glance. <br> Built for scalability, data protection, and round-the-clock Availability, Hire Me delivers a dependable bridge between modern employers and the talent they nurture.",
  },
  {
    id: "p4",
    title: "Art Block",
    img: ArtBlock,
    position: [9.2, 3.6, 3.9],
    rotation: [0, Math.PI, 0],
    size: [3.2, 4],
    desc: "ArtBlock is an innovative online social platform that empowers independent artists and creators to showcase, share, and monetize their work through a subscription-based model. It bridges the gap between creators and their audiences by offering tools for exclusive content sharing, tiered memberships, community engagement, and direct financial support. Artists can upload diverse content — such as videos, podcasts, or AR/VR experiences — and manage their supporters through personalized dashboards. Patrons (supporters) can subscribe to different membership tiers to access exclusive content, interact with creators, and support their favorite artists directly.<br> The platform integrates secure payment gateways, real-time notifications, and an analytics dashboard to track engagement and earnings. Admins oversee content moderation, user management, and system analytics through an admin dashboard. <br> Technically, ArtBlock is designed as a modular, scalable, and secure web application, featuring responsive design, API-driven architecture, and cloud-based infrastructure. Its mission is to foster artistic independence and sustainable creator income, building a thriving digital ecosystem where creativity and community flourish together. ",
  },
  {
    id: "p5",
    title: "Green Bar",
    img: GreenBar,
    position: [9.8, 3.6, -3.9],
    rotation: [0, Math.PI * 2, 0],
    size: [3.2, 4],
    desc: "BuyFresh is a web-based platform designed for ordering fresh groceries and farm produce online. It allows users to browse products, place orders, and manage purchases easily. The system includes admin and seller modules for product, order, and inventory management. BuyFresh provides a smooth checkout experience with real-time order tracking."
  },
  {
    id: "p6",
    title: "BetterPass",
    img: BetterPass,
    position: [3.2, 3.6, -3.9],
    rotation: [0, Math.PI * 2, 0],
    size: [3.2, 4],
    desc: "The Better Pass is a social travel platform where tour companies and tourists can connect, post tours, and make bookings. Designed with an experience similar to Instagram or LinkedIn, the app supports four user roles: Tour Companies, Tourists/Travellers, Influencers, and Activity Instructors. Tour companies can share and promote their tour offerings, influencers can help amplify these tours, and activity instructors can showcase engaging nearby activities. Tourists can browse, book, and participate in both tours and activities — all with the goal of enhancing and enriching their travel experience.",
  },
  {
    id: "p7",
    title: "Yarrowtech",
    img: Yarrowtech,
    position: [-3.4, 3.6, -3.9],
    rotation: [0, Math.PI * 2, 0],
    size: [3.2, 4],
    desc: "YarrowTech are a next-generation software development company dedicated to transforming ideas into intelligent, high-impact digital solutions. Our expertise spans custom software development, ERP systems, AI-driven applications, and full-stack web and mobile development—built to support the evolving needs of modern businesses.",
  },
  {
    id: "p8",
    title: "Building",
    img: Building,
    position: [-9.9, 3.6, -3.9],
    rotation: [0, Math.PI * 2, 0],
    size: [3.2, 4],
    desc: " This project involves building a secure, regulated crowdfunding platform for early-stage startups, designed to connect vetted founders with retail investors through a transparent and compliant digital marketplace. The platform enables startups to raise capital efficiently while allowing investors to discover, evaluate, and invest in curated opportunities with confidence.<br> The system incorporates KYC/AML compliance, campaign management, ensuring trust, regulatory alignment, and long-term platform sustainability. Revenue is generated through a commission-based model on successfully funded campaigns, supporting scalable growth and recurring income.<br> With a phased rollout approach, the platform is built for high performance, security, and scalability, targeting strong user adoption, efficient fundraising outcomes, and leadership in the regulated crowdfunding space.",
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
  const { scene } = useGLTF("/models/gallery-updated-compressed.glb");

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
    const mobileSpeedFactor = isTouchDevice ? 0.72 : 1;

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

    if (dir.lengthSq() > 0)
      dir.normalize().multiplyScalar(base * mobileSpeedFactor);

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
function Painting({
  id,
  title,
  img,
  position,
  rotation,
  size,
  desc,
  shouldLoadTexture = false,
  textureAnisotropy = 4,
}) {
  const [tex, setTex] = useState(() => paintingTextureCache.get(img) ?? null);

  const planeRef = useRef();
  const [aimed, setAimed] = useState(false);
  useCursor(aimed);

  useEffect(() => {
    if (!shouldLoadTexture || tex) return;
    let cancelled = false;

    loadPaintingTexture(img, textureAnisotropy)
      .then((loadedTex) => {
        if (cancelled) return;
        setTex(loadedTex);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [img, shouldLoadTexture, tex, textureAnisotropy]);

  useEffect(() => {
    if (!tex) return;
    const safeAnisotropy = Math.max(1, textureAnisotropy);
    if (tex.anisotropy !== safeAnisotropy) {
      tex.anisotropy = safeAnisotropy;
      tex.needsUpdate = true;
    }
  }, [tex, textureAnisotropy]);

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
        <meshStandardMaterial
          metalness={0}
          roughness={0}
          color="#000000"
          transparent
          opacity={0.08}
        />
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
          map={tex || null}
          color={tex ? "#ffffff" : "#d6d6d6"}
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
  seedPosition = null,
  textureLoadDistance = 10,
  textureAnisotropy = 4,
  interactRef = null,
}) {
  const groupRef = useRef();
  const ray = useRef(new THREE.Raycaster()).current;
  const { camera } = useThree();
  const [, get] = useKeyboardControls();
  const ndc = useRef(new THREE.Vector2(0, 0)).current;
  const [loadedTextureIds, setLoadedTextureIds] = useState(() => new Set());
  const textureUpdateClockRef = useRef(0);

  const markTexturesForLoading = useCallback((ids) => {
    if (!ids?.length) return;
    setLoadedTextureIds((prev) => {
      let changed = false;
      let next = prev;
      for (const id of ids) {
        if (!prev.has(id)) {
          if (!changed) {
            next = new Set(prev);
            changed = true;
          }
          next.add(id);
        }
      }
      return changed ? next : prev;
    });
  }, []);

  useEffect(() => {
    const base = seedPosition ?? [0, PLAYER_HEIGHT / 2, 3];
    const [sx, sy, sz] = base;
    const nearest = [...config]
      .sort((a, b) => {
        const da =
          (a.position[0] - sx) ** 2 +
          (a.position[1] - sy) ** 2 +
          (a.position[2] - sz) ** 2;
        const db =
          (b.position[0] - sx) ** 2 +
          (b.position[1] - sy) ** 2 +
          (b.position[2] - sz) ** 2;
        return da - db;
      })
      .slice(0, 3)
      .map((p) => p.id);

    markTexturesForLoading(nearest);
  }, [config, markTexturesForLoading, seedPosition]);

  useFrame(() => {
    textureUpdateClockRef.current += 1;
    if (textureUpdateClockRef.current >= 14) {
      textureUpdateClockRef.current = 0;
      const maxDistanceSq = textureLoadDistance * textureLoadDistance;
      const visibleIds = [];
      const cx = camera.position.x;
      const cy = camera.position.y;
      const cz = camera.position.z;

      for (const p of config) {
        const dx = p.position[0] - cx;
        const dy = p.position[1] - cy;
        const dz = p.position[2] - cz;
        if (dx * dx + dy * dy + dz * dz <= maxDistanceSq) visibleIds.push(p.id);
      }
      markTexturesForLoading(visibleIds);
    }

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

  // Expose a fire-from-center function for mobile VIEW button
  useEffect(() => {
    if (!interactRef) return;
    interactRef.current = () => {
      ray.setFromCamera(ndc, camera);
      const root = groupRef.current?.children ?? [];
      const hits = ray.intersectObjects(root, true);
      const h = hits.find(
        (x) => x.object?.userData?.isPainting && x.distance <= maxDistance
      );
      if (h?.object?.userData?.paintingMeta) onOpen?.(h.object.userData.paintingMeta);
    };
  });

  return (
    <group ref={groupRef}>
      {config.map((p) => (
        <Painting
          key={p.id}
          {...p}
          shouldLoadTexture={loadedTextureIds.has(p.id)}
          textureAnisotropy={textureAnisotropy}
        />
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

function Ball({ id, position, velocity, onExpire, segments = 20, castShadow = true }) {
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
      <mesh castShadow={castShadow} receiveShadow={castShadow}>
        <sphereGeometry args={[BALL_RADIUS, segments, segments]} />
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
  const activePointerIdRef = useRef(null);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    if (!lookRef?.current) return;

    const element = gl.domElement;
    const sensitivity = 0.0022;
    const PI_2 = Math.PI / 2;
    const lookZoneRatio = 0.42;

    const isMobileControlTarget = (target) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest('[data-mobile-control="true"]');
    };

    const onPointerDown = (e) => {
      if (activePointerIdRef.current !== null) return;
      if (isMobileControlTarget(e.target)) return;
      if (e.clientX < window.innerWidth * lookZoneRatio) return;

      activePointerIdRef.current = e.pointerId;
      last.current.x = e.clientX;
      last.current.y = e.clientY;
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (activePointerIdRef.current !== e.pointerId) return;
      if (!lookRef.current) return;

      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current.x = e.clientX;
      last.current.y = e.clientY;

      let { yaw, pitch } = lookRef.current;

      yaw -= dx * sensitivity;
      pitch -= dy * sensitivity;

      pitch = Math.max(-PI_2 + 0.1, Math.min(PI_2 - 0.1, pitch));

      lookRef.current.yaw = yaw;
      lookRef.current.pitch = pitch;
      lookRef.current.ready = true;
      e.preventDefault();
    };

    const onPointerUp = (e) => {
      if (activePointerIdRef.current !== e.pointerId) return;
      activePointerIdRef.current = null;
    };

    element.addEventListener("pointerdown", onPointerDown, { passive: false });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      activePointerIdRef.current = null;
    };
  }, [enabled, gl, lookRef]);

  return null;
}

/* ===================== Mobile HUD ======================= */
function MobileHUD({ setInput, onInteract }) {
  if (!setInput) return null;

  const joystickRef = useRef(null);
  const joystickPointerIdRef = useRef(null);
  const [thumbPos, setThumbPos] = useState({ x: 0, y: 0 });

  const JOYSTICK_RADIUS = 38;
  const DEADZONE = 0.22;

  const setMovementFromVector = useCallback(
    (nx, ny) => {
      const magnitude = Math.hypot(nx, ny);
      const moving = magnitude > DEADZONE;

      setInput((prev) => ({
        ...prev,
        forward: moving && ny < -0.22,
        backward: moving && ny > 0.22,
        left: moving && nx < -0.22,
        right: moving && nx > 0.22,
        sprint: moving && magnitude > 0.9,
      }));
    },
    [setInput]
  );

  const resetMovement = useCallback(() => {
    setThumbPos({ x: 0, y: 0 });
    setInput((prev) => ({
      ...prev,
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
    }));
  }, [setInput]);

  const onStickDown = useCallback((e) => {
    if (joystickPointerIdRef.current !== null) return;
    joystickPointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }, []);

  const onStickMove = useCallback(
    (e) => {
      if (joystickPointerIdRef.current !== e.pointerId) return;
      const baseRect = joystickRef.current?.getBoundingClientRect();
      if (!baseRect) return;

      const cx = baseRect.left + baseRect.width / 2;
      const cy = baseRect.top + baseRect.height / 2;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;

      const len = Math.hypot(dx, dy);
      if (len > JOYSTICK_RADIUS) {
        dx = (dx / len) * JOYSTICK_RADIUS;
        dy = (dy / len) * JOYSTICK_RADIUS;
      }

      setThumbPos({ x: dx, y: dy });
      setMovementFromVector(dx / JOYSTICK_RADIUS, dy / JOYSTICK_RADIUS);
      e.preventDefault();
    },
    [setMovementFromVector]
  );

  const onStickUp = useCallback(
    (e) => {
      if (joystickPointerIdRef.current !== e.pointerId) return;
      joystickPointerIdRef.current = null;
      resetMovement();
      e.preventDefault();
    },
    [resetMovement]
  );

  const onJumpStart = useCallback(
    (e) => {
      e.preventDefault();
      setInput((prev) => ({ ...prev, jump: true }));
    },
    [setInput]
  );

  const onJumpEnd = useCallback(
    (e) => {
      e.preventDefault();
      setInput((prev) => ({ ...prev, jump: false }));
    },
    [setInput]
  );

  useEffect(() => {
    return () => resetMovement();
  }, [resetMovement]);

  return (
    <div
      data-mobile-control="true"
      style={{
        position: "fixed",
        bottom: 84,
        left: 0,
        right: 0,
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        pointerEvents: "none",
        zIndex: 40,
      }}
    >
      <div
        ref={joystickRef}
        data-mobile-control="true"
        onPointerDown={onStickDown}
        onPointerMove={onStickMove}
        onPointerUp={onStickUp}
        onPointerCancel={onStickUp}
        style={{
          width: 108,
          height: 108,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.32)",
          background: "rgba(0,0,0,0.42)",
          pointerEvents: "auto",
          touchAction: "none",
          backdropFilter: "blur(8px)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.16)",
            transform: `translate(calc(-50% + ${thumbPos.x}px), calc(-50% + ${thumbPos.y}px))`,
            transition:
              joystickPointerIdRef.current === null ? "transform 80ms ease-out" : "none",
          }}
        />
      </div>

      <div
        data-mobile-control="true"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          pointerEvents: "auto",
          alignItems: "flex-end",
        }}
      >
        {/* VIEW / interact button */}
        <button
          data-mobile-control="true"
          onPointerDown={(e) => { e.preventDefault(); onInteract?.(); }}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "1px solid rgba(253,86,2,0.7)",
            background: "rgba(253,86,2,0.22)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            touchAction: "none",
            backdropFilter: "blur(10px)",
          }}
        >
          VIEW
        </button>
        <button
          data-mobile-control="true"
          onPointerDown={onJumpStart}
          onPointerUp={onJumpEnd}
          onPointerCancel={onJumpEnd}
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.35)",
            background: "rgba(0,0,0,0.52)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.06em",
            touchAction: "none",
            backdropFilter: "blur(10px)",
          }}
        >
          JUMP
        </button>
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
  const [isLowSpec, setIsLowSpec] = useState(() => detectLowSpecDevice());
  const [canvasKey, setCanvasKey] = useState(0);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const [envEnabled, setEnvEnabled] = useState(() => !detectLowSpecDevice());
  const [balls, setBalls] = useState([]);

  // 📱 detect touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [mobileInput, setMobileInput] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  });

  // ✅ shared look state for mobile (yaw/pitch)
  const lookRef = useRef({ yaw: 0, pitch: 0, ready: false });

  // mobile interact (VIEW button → center raycast)
  const mobileInteractRef = useRef(null);

  // auto-hide mobile hint after 4 s
  const [showMobileHint, setShowMobileHint] = useState(true);
  useEffect(() => {
    if (!isTouchDevice) return;
    const t = setTimeout(() => setShowMobileHint(false), 4000);
    return () => clearTimeout(t);
  }, [isTouchDevice]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isCoarsePointer =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    const isSmallScreen = window.innerWidth < 768;

    setIsTouchDevice(isCoarsePointer || isSmallScreen);
    setIsLowSpec((prev) => prev || isSmallScreen || detectLowSpecDevice());
  }, []);

  useEffect(() => {
    const prevBodyBg = document.body.style.background;
    const prevHtmlBg = document.documentElement.style.background;

    const galleryBackdrop =
      "radial-gradient(circle at 50% 12%, rgba(254, 222, 190, 0.12), transparent 22%), linear-gradient(180deg, #120703 0%, #190a04 48%, #0c0502 100%)";

    document.body.style.background = galleryBackdrop;
    document.documentElement.style.background = galleryBackdrop;

    return () => {
      document.body.style.background = prevBodyBg;
      document.documentElement.style.background = prevHtmlBg;
    };
  }, []);

  useEffect(() => {
    if (isLowSpec) setEnvEnabled(false);
  }, [isLowSpec]);

  useEffect(() => {
    if (!isTouchDevice) return;
    const key = "gallery-mobile-warning-shown";
    const alreadyShown = sessionStorage.getItem(key) === "1";
    if (!alreadyShown) setShowMobileWarning(true);
  }, [isTouchDevice]);

  const maxBallsAllowed = isLowSpec ? 18 : isTouchDevice ? 28 : MAX_BALLS;
  const canvasDpr = isLowSpec ? [0.85, 1] : isTouchDevice ? [0.9, 1.2] : [1, 1.35];
  const shadowMapSize = isLowSpec ? 1024 : 2048;
  const useHighFx = !isLowSpec;
  const physicsTimeStep = isLowSpec ? 1 / 50 : 1 / 60;
  const physicsSubsteps = isLowSpec ? 1 : 2;
  const textureAnisotropy = isLowSpec ? 2 : isTouchDevice ? 4 : 8;
  const textureLoadDistance = isLowSpec ? 8 : 10.5;
  const ballSegments = isLowSpec ? 12 : isTouchDevice ? 14 : 20;
  const ballCastShadow = !isLowSpec;
  const glOptions = useMemo(
    () => ({
      antialias: !isLowSpec,
      alpha: true,
      powerPreference: "high-performance",
    }),
    [isLowSpec]
  );

  const handleWebGLLost = useCallback(() => {
    setLocked(false);
    setActive(null);
    setWebglUnavailable(true);
  }, []);

  const handleWebGLRestored = useCallback(() => {
    setWebglUnavailable(false);
  }, []);

  const retryWebGL = useCallback(() => {
    setWebglUnavailable(false);
    setLocked(false);
    setActive(null);
    setSpawn(null);
    setBalls([]);
    setCanvasKey((current) => current + 1);
  }, []);

  const addBall = (b) =>
    setBalls((prev) => {
      const next = [...prev, { ...b, createdAt: performance.now() }];
      if (next.length > maxBallsAllowed) {
        next.splice(0, next.length - maxBallsAllowed);
      }
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
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(rgba(254, 222, 190, 0.08) 0.8px, transparent 0.8px), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.05' numOctaves='4' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='1'/></svg>\")",
          backgroundSize: "22px 22px, 180px 180px",
          opacity: 0.14,
          mixBlendMode: "soft-light",
        }}
      />

      {/* ── Desktop pointer-lock entry ── */}
      {!isTouchDevice && !locked && !webglUnavailable && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 30,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.52)", backdropFilter: "blur(6px)",
        }}>
          <div style={{
            width: "min(90vw, 420px)",
            background: "rgba(10,10,14,0.92)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20,
            padding: "32px 28px 24px",
            color: "#fff",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column", gap: 20,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                House of Musa — Gallery
              </p>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
                Enter the Gallery
              </h2>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                Walk through our interactive 3D space and explore the projects up close.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["WASD / ↑↓←→", "Move"],
                ["Shift", "Sprint"],
                ["Space", "Jump"],
                ["Click / E", "View painting"],
                ["H", "Day / Night"],
                ["Click", "Shoot ball"],
              ].map(([key, label]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ padding: "3px 8px", background: "rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    {key}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => plcRef.current?.lock()}
              style={{
                padding: "13px 0", borderRadius: 12,
                background: "#FD5602", border: "none",
                color: "#fff", fontSize: 14, fontWeight: 700,
                letterSpacing: "0.06em", cursor: "pointer",
              }}
            >
              Click to Enter
            </button>
          </div>
        </div>
      )}

      {webglUnavailable && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(10px)",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "min(92vw, 420px)",
              background: "rgba(10,10,14,0.94)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: "28px 24px 22px",
              color: "#fff",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              display: "grid",
              gap: 14,
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)" }}>
              House of Musa — Gallery
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
              3D scene needs to reload
            </h2>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.58)" }}>
              The browser lost the WebGL context, so the gallery renderer stopped. Reload the 3D scene to continue.
            </p>
            <button
              onClick={retryWebGL}
              style={{
                padding: "12px 0",
                borderRadius: 12,
                background: "#FD5602",
                border: "none",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
            >
              Reload Gallery
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile hint (auto-hides) ── */}
      {isTouchDevice && showMobileHint && !showMobileWarning && (
        <div
          data-mobile-control="true"
          style={{
            position: "fixed", top: 16, left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px", borderRadius: 999,
            background: "rgba(0,0,0,0.7)", color: "#fff",
            fontSize: 11, letterSpacing: "0.06em",
            zIndex: 35, backdropFilter: "blur(8px)",
            whiteSpace: "nowrap",
            transition: "opacity 0.4s ease",
            opacity: showMobileHint ? 1 : 0,
          }}
        >
          Drag right side to look · Joystick to move · VIEW to inspect
        </div>
      )}

      {/* ── Mobile welcome warning ── */}
      {isTouchDevice && showMobileWarning && (
        <div
          data-mobile-control="true"
          style={{
            position: "fixed", inset: 0, zIndex: 70,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)",
            padding: 20,
          }}
        >
          <div style={{
            width: "min(92vw, 400px)",
            background: "rgba(10,10,14,0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20, padding: "28px 22px 20px",
            color: "#fff", boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)" }}>
                House of Musa — Gallery
              </p>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Best on Desktop</h2>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
                The 3D gallery is designed for desktop. You can still explore on mobile — use the joystick to move, drag the right side to look, and tap VIEW to open paintings.
              </p>
            </div>
            <button
              data-mobile-control="true"
              onClick={() => {
                sessionStorage.setItem("gallery-mobile-warning-shown", "1");
                setShowMobileWarning(false);
              }}
              style={{
                padding: "12px 0", borderRadius: 12,
                background: "#FD5602", border: "none",
                color: "#fff", fontSize: 14, fontWeight: 700,
                letterSpacing: "0.06em", cursor: "pointer",
              }}
            >
              Enter Gallery
            </button>
          </div>
        </div>
      )}

      {/* ── HDRI toggle ── */}
      <button
        onClick={(e) => { e.stopPropagation(); setEnvEnabled((v) => !v); }}
        style={{
          position: "fixed", bottom: 20, right: 20,
          width: 46, height: 46, borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(0,0,0,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 8, backdropFilter: "blur(10px)",
          zIndex: 9999, cursor: "pointer",
        }}
        aria-label={envEnabled ? "Turn HDRI off" : "Turn HDRI on"}
      >
        <img
          src={envEnabled ? HDRI_ON_ICON : HDRI_OFF_ICON}
          alt={envEnabled ? "HDRI On" : "HDRI Off"}
          style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
        />
      </button>

      {/* ── Crosshair (desktop locked) ── */}
      {!isTouchDevice && locked && (
        <div style={{
          position: "fixed", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: 6, height: 6,
          borderRadius: 999,
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 0 0 1.5px rgba(0,0,0,0.6)",
          pointerEvents: "none", zIndex: 20,
        }} />
      )}

      {/* ── Mobile HUD ── */}
      {isTouchDevice && !active && !showMobileWarning && (
        <MobileHUD
          setInput={setMobileInput}
          onInteract={() => mobileInteractRef.current?.()}
        />
      )}

      {/* ── Painting modal ── */}
      {active && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(18px)",
            padding: "16px",
          }}
          onClick={() => setActive(null)}
        >
          <div
            style={{
              position: "relative",
              width: "min(92vw, 880px)",
              maxHeight: "88vh",
              background: "rgba(10,10,14,0.96)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActive(null)}
              style={{
                position: "absolute", top: 14, right: 14, zIndex: 10,
                width: 36, height: 36, borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff", fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(6px)",
              }}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Body — image + text side by side on wide, stacked on narrow */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              flex: 1,
            }}>
              {/* Image banner */}
              <div style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "28px 24px 20px",
                flexShrink: 0,
              }}>
                <img
                  src={active.img}
                  alt={active.title}
                  style={{
                    maxWidth: "min(340px, 72vw)",
                    maxHeight: "26vh",
                    borderRadius: 14,
                    objectFit: "contain",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                  }}
                />
              </div>

              {/* Text */}
              <div style={{ padding: "24px 28px 28px", color: "#fff" }}>
                <p style={{
                  margin: "0 0 6px",
                  fontSize: 10, letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#FD5602",
                }}>
                  Project
                </p>
                <h2 style={{
                  margin: "0 0 16px",
                  fontSize: "clamp(20px, 3vw, 28px)",
                  fontWeight: 700, lineHeight: 1.15, color: "#fff",
                }}>
                  {active.title}
                </h2>
                <div
                  style={{ fontSize: 14, lineHeight: 1.78, color: "rgba(255,255,255,0.72)" }}
                  dangerouslySetInnerHTML={{ __html: active.desc }}
                />
                <p style={{
                  margin: "20px 0 0",
                  fontSize: 11, color: "rgba(255,255,255,0.28)",
                  textAlign: "center", letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {isTouchDevice ? "Tap outside to close" : "Press ESC or click outside to close"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <KeyboardControls map={KEYMAP}>
        <Canvas
          key={canvasKey}
          dpr={canvasDpr}
          gl={glOptions}
          style={{
            width: "100vw",
            height: "100vh",
            display: "block",
            position: "relative",
            zIndex: 1,
            background: "transparent",
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
            gl.toneMappingExposure = isLowSpec ? 1.05 : 1.2;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.setPixelRatio(Math.min(window.devicePixelRatio, canvasDpr[1]));

            gl.physicallyCorrectLights = true;
            if ("useLegacyLights" in gl) gl.useLegacyLights = false;


            gl.shadowMap.enabled = true;
            gl.shadowMap.type = isLowSpec
              ? THREE.BasicShadowMap
              : THREE.PCFSoftShadowMap;
            scene.fog = new THREE.FogExp2("#0c0c12", 0.012);
          }}
          camera={{ fov: 68, near: 0.1, far: 200 }}
        >
          <WebGLStatusBridge
            onContextLost={handleWebGLLost}
            onContextRestored={handleWebGLRestored}
          />
          {useHighFx && <SoftShadows size={25} samples={24} focus={0.7} />}
          <ambientLight intensity={0.18} color="#d9e1ff" />
          <directionalLight
            position={[6, 10, 4]}
            intensity={isLowSpec ? 1.45 : 2.2}
            color="#ffffff"
            castShadow={!isLowSpec}
            shadow-mapSize-width={shadowMapSize}
            shadow-mapSize-height={shadowMapSize}
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
            <Physics
              gravity={[0, -9.81, 0]}
              timeStep={physicsTimeStep}
              substeps={physicsSubsteps}
            >
              <Suspense
                fallback={null}
              >
                <BalconyScene onSpawn={setSpawn} />
              </Suspense>

              <ContactShadows
                position={[0, 0.01, 0]}
                opacity={isLowSpec ? 0.28 : 0.55}
                scale={40}
                blur={isLowSpec ? 3.6 : 3.1}
                far={22}
                resolution={isLowSpec ? 512 : 1024}
              />


              <PaintingsManager
                config={PAINTINGS}
                onOpen={setActive}
                maxDistance={8}
                pointerLocked={locked && !isTouchDevice}
                seedPosition={spawn}
                textureLoadDistance={textureLoadDistance}
                textureAnisotropy={textureAnisotropy}
                interactRef={mobileInteractRef}
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
                  segments={ballSegments}
                  castShadow={ballCastShadow}
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
          {isTouchDevice && (
            <TouchLook
              enabled={!active && !showMobileWarning}
              lookRef={lookRef}
            />
          )}
        </Canvas>
      </KeyboardControls>
    </>
  );
}

useGLTF.preload("/models/gallery-updated-compressed.glb");

























































