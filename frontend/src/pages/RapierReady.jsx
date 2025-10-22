// RapierReady.jsx
import { Html } from "@react-three/drei";
import RAPIER from "@dimforge/rapier3d-compat";
import React, { useEffect, useState } from "react";

export default function RapierReady({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    RAPIER.init().then(() => alive && setReady(true));
    return () => { alive = false; };
  }, []);
  return ready ? children : <Html center style={{ color: "#fff" }}>Loading physics…</Html>;
}
