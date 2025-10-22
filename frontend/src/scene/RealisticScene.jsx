// RealisticScene.jsx
import React, { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  MeshReflectorMaterial,
  useGLTF,
} from "@react-three/drei";
// Optional (install @react-three/postprocessing): SSAO/Bloom/Vignette
import { EffectComposer, SSAO, Bloom, Vignette } from "@react-three/postprocessing";

function RendererTuning() {
  const { gl, scene } = useThree();
  useEffect(() => {
    // Color management
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;

    // Soft shadows
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;

    // Ensure meshes can cast/receive shadows and fix texture color spaces
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;

        // Albedo/emissive maps should be sRGB; others stay linear
        const m = o.material;
        if (m) {
          ["map", "emissiveMap"].forEach((k) => {
            if (m[k]) m[k].colorSpace = THREE.SRGBColorSpace;
          });
          // AO needs uv2
          if (m.aoMap && o.geometry && !o.geometry.attributes.uv2 && o.geometry.attributes.uv) {
            o.geometry.setAttribute("uv2", o.geometry.attributes.uv.clone());
          }
        }
      }
    });
  }, [gl, scene]);
  return null;
}

function KeyLight() {
  // Directional key light with good shadow quality
  return (
    <directionalLight
      castShadow
      intensity={2}
      position={[6, 10, 6]}
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-12}
      shadow-camera-right={12}
      shadow-camera-top={12}
      shadow-camera-bottom={-12}
      shadow-normalBias={0.02}
    />
  );
}

// function Ground() {
//   return (
//     <mesh rotation-x={-Math.PI / 2} receiveShadow>
//       <planeGeometry args={[100, 100]} />
//       {/* Glossy/blurred reflector floor for realistic grounding */}
//       <MeshReflectorMaterial
//         resolution={1024}
//         blur={[600, 80]}
//         mixBlur={1}
//         mixStrength={30}
//         mirror={0.3}
//         roughness={0.9}
//         metalness={0.0}
//         depthScale={1.2}
//         minDepthThreshold={0.4}
//         maxDepthThreshold={1.4}
//       />
//     </mesh>
//   );
// }

function Model({ url = "/models/yourModel.glb" }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function RealisticScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [3, 2, 6], fov: 45, near: 0.1, far: 200 }}
    >
      <color attach="background" args={["#0b0b0c"]} />

      <RendererTuning />
      <ambientLight intensity={0.2} />
      <KeyLight />

      {/* High-quality IBL; swap to your .hdr/.exr via files="" when ready */}
      <Environment preset="warehouse" background={false} ground={{ height: 10, radius: 80, scale: 100 }} />

      <Model url="/models/yourModel.glb" />
      <Ground />

      {/* Soft grounding + fake GI feel */}
      <ContactShadows
        opacity={0.6}
        blur={2.5}
        distance={8}
        resolution={1024}
        frames={1}
        color="#000000"
      />

      {/* Tasteful post FX */}
      <EffectComposer multisampling={4}>
        <SSAO intensity={20} radius={0.2} bias={0.02} />
        <Bloom intensity={0.25} mipmapBlur />
        <Vignette eskil offset={0.12} darkness={0.6} />
      </EffectComposer>

      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
