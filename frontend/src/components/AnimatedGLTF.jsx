import React, { useEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AnimatedGLTF({
  url,
  speed = 1,
  loop = THREE.LoopRepeat,
  autoRotateIfNoClips = true,
  autoMorphIfNoClips = true,
  ...props
}) {
  const { scene, animations } = useGLTF(url);
  const { actions, names, mixer } = useAnimations(animations, scene);

  const morphTargets = useMemo(() => {
    const list = [];
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = o.receiveShadow = true;
        if (o.morphTargetInfluences && o.morphTargetInfluences.length) list.push(o);
      }
    });
    return list;
  }, [scene]);

  useEffect(() => {
    if (!animations || animations.length === 0) {
      console.warn(`[GLTF] ${url}: no animation clips in file`);
      return;
    }
    names.forEach((n) => {
      const a = actions[n];
      if (!a) return;
      a.reset().setLoop(loop, Infinity).play();
      a.timeScale = speed;
    });
    return () => names.forEach((n) => actions[n]?.stop());
  }, [url, animations, actions, names, loop, speed]);

  useFrame((_, delta) => { if (mixer) mixer.update(delta); });

  useFrame(({ clock }, delta) => {
    if (animations && animations.length > 0) return;
    const t = clock.getElapsedTime();
    if (autoMorphIfNoClips && morphTargets.length) {
      const v = 0.5 + 0.5 * Math.sin(t * 1.2);
      morphTargets.forEach((m) => (m.morphTargetInfluences[0] = v));
    } else if (autoRotateIfNoClips) {
      scene.rotation.y += delta * 0.4;
    }
  });

  return <primitive object={scene} {...props} />;
}
