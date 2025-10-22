







// // src/components/PortalIndicator.jsx
// import React, { useState } from "react";
// import { Billboard, Float, Html, useCursor } from "@react-three/drei";
// import { useNavigate } from "react-router-dom";
// import "./DoorPortal.css";


// export default function PortalIndicator({ position = [0, 0, 0], label = "Enter" }) {
//   const [hovered, setHovered] = useState(false);
//   const navigate = useNavigate();
//   useCursor(hovered);

//   return (
//     <group position={position}>
//       <Billboard>
//         <Float speed={1.5} floatIntensity={1} rotationIntensity={0.5}>
//           {/* Ripple Effect */}
//           <Html center>
//             <div
//               className={`portal-ripple ${hovered ? "hovered" : ""}`}
//               onPointerOver={() => setHovered(true)}
//               onPointerOut={() => setHovered(false)}
//               onClick={() => navigate("/inside")}
//             >
//               <span className="portal-label">{label}</span>
//             </div>
//           </Html>
//         </Float>
//       </Billboard>
//     </group>
//   );
// }






// // components/DoorPortal.jsx
// import React, { useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Text } from "@react-three/drei";
// import * as THREE from "three";

// export default function DoorPortal({
//   position = [0, 1.2, 0],
//   label = "Enter",
//   onEnter,
// }) {
//   const frameRef = useRef();
//   const hover = useRef(false);
//   const downPos = useRef({ x: 0, y: 0 });

//   // Gentle pulse on hover
//   useFrame((_, dt) => {
//     if (!frameRef.current) return;
//     const s = frameRef.current.scale.x;
//     const target = hover.current ? 1.12 : 1.0;
//     const next = THREE.MathUtils.damp(s, target, 6, dt);
//     frameRef.current.scale.setScalar(next);
//   });

//   const handlePointerDown = (e) => {
//     // Save screen position to detect drag distance
//     downPos.current.x = e.pointer.x;
//     downPos.current.y = e.pointer.y;
//   };

//   const handlePointerUp = (e) => {
//     // Treat it as a click if pointer didn’t move much
//     const dx = e.pointer.x - downPos.current.x;
//     const dy = e.pointer.y - downPos.current.y;
//     const dist = Math.hypot(dx, dy);
//     if (dist < 0.01) {
//       e.stopPropagation();
//       onEnter?.();
//     }
//   };

//   return (
//     <group position={position}>
//       {/* BIG invisible hitbox slightly thick → easier raycast, even if wall is close */}
//       <mesh
//         onPointerOver={(e) => { e.stopPropagation(); hover.current = true; document.body.style.cursor = "pointer"; }}
//         onPointerOut={() => { hover.current = false; document.body.style.cursor = "auto"; }}
//         onPointerDown={handlePointerDown}
//         onPointerUp={handlePointerUp}
//       >
//         {/* Wider/taller than the visible frame; some thickness to peek past doorframe */}
//         <boxGeometry args={[1.6, 2.8, 0.4]} />
//         <meshBasicMaterial transparent opacity={0} depthWrite={false} />
//       </mesh>

//       {/* Visible glowing frame (does not need to be clickable itself) */}
//       <mesh ref={frameRef} position={[0, 0, 0.02]}>
//         <boxGeometry args={[1.2, 2.4, 0.08]} />
//         <meshStandardMaterial
//           color="#0d1b2a"
//           emissive="#29a3ff"
//           emissiveIntensity={1.6}
//           metalness={0.1}
//           roughness={0.6}
//         />
//       </mesh>

//       <Text
//         position={[0, 1.55, 0.21]}
//         fontSize={0.16}
//         color="#cce7ff"
//         anchorX="center"
//         anchorY="middle"
//         outlineWidth={0.004}
//         outlineColor="#0b2b40"
//       >
//         {label}
//       </Text>
//     </group>
//   );
// }







import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export default function DoorPortal({
  position = [0, 1.2, 0],
  label = "Enter",
  onEnter,
  // size & look
  radius = 0.9,            // ring radius (visible)
  thickness = 0.18,        // ring thickness
  hitScale = 2.2,          // invisible hit area size multiplier
  rippleSpeed = 3.2,       // ripple animation speed
  baseColor = "#1b91ffff",   // inner color
  edgeColor = "#cee4ffff",   // outer color
  alwaysOnTop = true,     // if true: depthTest off so it renders above everything
}) {
  const ringRef = useRef();
  const matRef = useRef();
  const haloMatRef = useRef();
  const hover = useRef(false);
  const downPos = useRef({ x: 0, y: 0 });

  // --- Ring shader (ripples + angular streaks + glow) ---
  const ringMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: !alwaysOnTop ? true : false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uRadius: { value: radius },
        uThickness: { value: thickness },
        uSpeed: { value: rippleSpeed },
        uColorA: { value: new THREE.Color(baseColor) },
        uColorB: { value: new THREE.Color(edgeColor) },
        uHuePhase: { value: Math.random() * Math.PI * 2.0 },
      },
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        varying vec2 vUv;
        uniform float uTime;
        uniform float uRadius;
        uniform float uThickness;
        uniform float uSpeed;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uHuePhase;

        // Convert HSV to RGB (for subtle hue breathing)
        vec3 hsv2rgb(vec3 c) {
          vec3 p = abs(fract(c.xxx + vec3(0., 2./3., 1./3.)) * 6. - 3.);
          return c.z * mix(vec3(1.), clamp(p - 1., 0., 1.), c.y);
        }

        float ringMask(float r, float radius, float thickness, float edge) {
          float inner = smoothstep(radius, radius - edge, r);
          float outer = 1.0 - smoothstep(radius + thickness, radius + thickness - edge, r);
          return clamp(inner * outer, 0.0, 1.0);
        }

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          float a = (atan(p.y, p.x) + 3.14159265) / (2.0 * 3.14159265); // [0,1)

          float edge = 0.012;
          float ring = ringMask(r, uRadius, uThickness, edge);

          // radial ripples moving outward
          float freq = 12.0;
          float t = uTime * uSpeed;
          float ph = fract(r * freq - t);
          float rippleBand = smoothstep(0.0, 0.03, ph) * (1.0 - smoothstep(0.03, 0.06, ph));
          float rippleFalloff = smoothstep(1.0, 0.0, r);
          float ripples = rippleBand * rippleFalloff;

          // angular streaks rotating around the ring
          float streakCount = 10.0;
          float angPhase = fract(a * streakCount - t * 0.25);
          float streak = smoothstep(0.0, 0.05, angPhase) * (1.0 - smoothstep(0.05, 0.12, angPhase));
          // make streaks strongest near the ring body
          streak *= exp(-30.0 * abs(r - (uRadius + uThickness * 0.5)));

          // persistent glow centered on ring
          float glow = exp(-15.0 * abs(r - (uRadius + uThickness * 0.5)));

          // base gradient color + slight hue breath
          float hueShift = 0.03 * sin(uHuePhase + uTime * 0.7);
          vec3 grad = mix(uColorA, uColorB, clamp(r, 0.0, 1.0));
          // apply gentle hue shift in HSV
          float H = hueShift + 0.55; // bluish
          float S = 0.7;
          float V = 1.0;
          grad = mix(grad, hsv2rgb(vec3(fract(H), S, V)), 0.25);

          float alpha = clamp(ring + ripples * 0.9 + streak * 0.9 + glow * 0.8, 0.0, 1.0);
          gl_FragColor = vec4(grad * alpha, alpha);
        }
      `,
    });
  }, [radius, thickness, rippleSpeed, baseColor, edgeColor, alwaysOnTop]);

  // --- Outer halo shader (soft pulsing aura) ---
  const haloMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: !alwaysOnTop ? true : false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(edgeColor) },
        uStrength: { value: 0.8 },
      },
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uStrength;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          // big soft radial gradient
          float pulse = 0.65 + 0.35 * sin(uTime * 2.2);
          float falloff = smoothstep(1.0, 0.0, r);
          float alpha = pow(falloff, 2.0) * uStrength * pulse;
          gl_FragColor = vec4(uColor * alpha, alpha);
        }
      `,
    });
  }, [edgeColor, alwaysOnTop]);

  // Animate time + hover scale
  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
    if (haloMatRef.current) haloMatRef.current.uniforms.uTime.value += dt;
    if (ringRef.current) {
      const s = ringRef.current.scale.x;
      const target = hover.current ? 1.15 : 1.0;
      const next = THREE.MathUtils.damp(s, target, 6, dt);
      ringRef.current.scale.setScalar(next);
    }
  });

  const handlePointerDown = (e) => {
    downPos.current.x = e.pointer.x;
    downPos.current.y = e.pointer.y;
  };

  const handlePointerUp = (e) => {
    const dx = e.pointer.x - downPos.current.x;
    const dy = e.pointer.y - downPos.current.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.01) {
      e.stopPropagation();
      // onEnter?.();
      onEnter?.({ x: e.clientX, y: e.clientY });
    }
  };

  const hitSize = radius * hitScale * 2;

  return (
    <group position={position} renderOrder={999}>
      {/* Always face camera so rotation never blocks the view */}
      <Billboard>
        {/* Invisible, large hitbox for easy clicking */}
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); hover.current = true; document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { hover.current = false; document.body.style.cursor = "auto"; }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <planeGeometry args={[hitSize, hitSize]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Visible ring group */}
        <group ref={ringRef}>
          {/* Outer halo (bigger plane) */}
          <mesh renderOrder={1000}>
            <planeGeometry args={[radius * 3.2, radius * 3.2, 1, 1]} />
            <primitive object={haloMat} ref={haloMatRef} attach="material" />
          </mesh>

          {/* Core ring with ripples & streaks */}
          <mesh renderOrder={1001}>
            <planeGeometry args={[radius * 2.6, radius * 2.6, 64, 64]} />
            <primitive object={ringMat} ref={matRef} attach="material" />
          </mesh>

          {/* Sparkly particles around the ring */}
          <Sparkles
            count={32}
            size={3.5}
            speed={0.6}
            color={edgeColor}
            noise={1}
            scale={[radius * 2.2, radius * 2.2, 1]}
            opacity={0.9}
          />

          {/* Label */}
          <Text
            position={[0, radius + 0.45, 0.001]}
            fontSize={0.8}
            color="#000000ff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.008}
            outlineColor="#0b2b40"
          >
            {label}
          </Text>
        </group>
      </Billboard>
    </group>
  );
}
