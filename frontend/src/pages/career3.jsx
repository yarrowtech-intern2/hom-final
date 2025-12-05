// CareerPage.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import Waves from "../components/waves"; // ⬅️ your fixed Waves component
import "./career3.css";
import { usePageTransition } from "../components/transition";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function SplineScene() {
    return (
        <Spline
            // 👉 Replace this with your actual Spline URL
            // e.g. "https://prod.spline.design/xxxxxx/scene.splinecode"
            scene="https://prod.spline.design/qEpCKgtobPDyEqvo/scene.splinecode"
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
}

export default function BaymaksHome() {
    const pointer = useRef({ x: 0, y: 0 }); // kept in case you want to reuse later
    const { start } = usePageTransition();

    const handleExplore = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        start("/jobs", {
            x,
            y,
            duration: 0.65,
            ease: "power4.inOut",
        });
    };

    const handlePointer = (e) => {
        const x =
            (e.clientX ?? (e.touches?.[0]?.clientX ?? 0)) / window.innerWidth;
        const y =
            (e.clientY ?? (e.touches?.[0]?.clientY ?? 0)) / window.innerHeight;
        pointer.current.x = clamp(x * 2 - 1, -1, 1);
        pointer.current.y = clamp(-(y * 2 - 1), -1, 1);
        // pointer is currently unused by Spline, but we keep structure the same
    };

    return (
        <div
            onMouseMove={handlePointer}
            onTouchMove={handlePointer}
            className="carrers-root"
            style={{ height: "100vh", width: "100vw" }}
        >
            {/* Waves background layer (behind everything) */}
            <div className="bg-waves">
                <Waves
                    lineColor="#ffffff"
                    backgroundColor="transparent"
                    waveSpeedX={0.02}
                    waveSpeedY={0.01}
                    waveAmpX={40}
                    waveAmpY={20}
                    friction={0.9}
                    tension={0.01}
                    maxCursorMove={120}
                    xGap={12}
                    yGap={36}
                />
            </div>

            {/* Radial glow overlay (brand tint) */}
            <div className="carrers-glow" />

            {/* 3D Spline Canvas (replaces R3F Canvas+Robot) */}
            <div className="carrers-canvas">
                <div className="carrers-spline-wrap">
                    <SplineScene />
                </div>
            </div>


            {/* Overlays */}
            <div className="carrers-title">
                <span className="big">Carrers</span>
            </div>

            <section className="carrers-sec">
                <h1>We bring a wealth of Experience from wide range of Backgrounds</h1>
            </section>

            <section className="carrers-sec-cta">
                <div className="txt">
                    <div id="cta-up">We are Hiring</div>
                    <Link to="/jobs" className="carrers-btn" onClick={handleExplore}>
                        Explore Now
                    </Link>
                </div>
            </section>

            {/* place this near the end of your returned JSX so it sits on top */}
<div
  className="spline-badge-overlay"
  aria-hidden="true"
/>



        </div>
    );
}
