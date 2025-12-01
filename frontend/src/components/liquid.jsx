"use client";
import { useEffect, useRef } from "react";

export function LiquidEffectAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create script dynamically
    const script = document.createElement("script");
    script.type = "module";

    script.textContent = `
      import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';

      const canvas = document.getElementById('liquid-canvas');
      if (canvas) {
        const app = LiquidBackground(canvas);

        // Any image that exists publicly (replace with yours)
        app.loadImage('https://images.unsplash.com/photo-1529243856184-fd5465488984');

        app.liquidPlane.material.metalness = 0.75;
        app.liquidPlane.material.roughness = 0.25;
        app.liquidPlane.uniforms.displacementScale.value = 5;

        app.setRain(false);

        window.__liquidApp = app;
      }
    `;

    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (window.__liquidApp?.dispose) {
        window.__liquidApp.dispose();
      }
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 m-0 w-full h-full touch-none overflow-hidden"
      style={{ fontFamily: '"Montserrat", serif' }}
    >
      <canvas
        ref={canvasRef}
        id="liquid-canvas"
        className="fixed inset-0 w-full h-full"
      />
    </div>
  );
}

export default LiquidEffectAnimation;
