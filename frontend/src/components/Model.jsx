import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

/**
 * Export your model from Blender as GLB and place it in:
 *   /public/models/house.glb
 */
const Model = (props) => {
  const gltf = useGLTF("/models/house.glb");

  // Optional: compute bounds/scale if needed
  // For now, allow manual control via props (scale/position/rotation)
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  return <primitive object={cloned} {...props} />;
};

useGLTF.preload("/models/house.glb");

export default Model;
