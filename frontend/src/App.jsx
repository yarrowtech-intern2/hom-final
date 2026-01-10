

import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home3D2 from "./pages/Home3D2";
// import InsideHouse from "./pages/InsideHouse";
import Gallery3D from "./pages/Gallery3D2";
import TransitionProvider from "./components/transition";
import About from "./pages/About";
// import About2 from "./pages/about2";
import Project from "./pages/story";
// import Contact from "./pages/contact";
// import Baymax from "./pages/baymax";
import Carrers from "./pages/carrers";
// import JobPage from "./pages/jobPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Projects from "./pages/projects";

// import NeonPage from "./pages/neonDemo";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <TransitionProvider>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home3D2 />} />
        {/* <Route path="/inside" element={<InsideHouse />} /> */}
        <Route path="/gallery" element={<Gallery3D />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/about2" element={<About2 />} /> */}
        <Route path="/project" element={<Project />} />
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/baymax" element={<Baymax />} /> */}
        <Route path="/carrers" element={<Carrers />} />
        {/* <Route path="/jobs" element={<JobPage />} /> */}

        <Route path="/admin123" element={<AdminLogin />} />
        <Route path="/admin1234" element={<AdminDashboard />} />


        
        {/* <Route path="/projects" element={<Projects />} /> */}

        {/* <Route path="/neon" element={<NeonPage/>} /> */}
      </Routes>
    </TransitionProvider>
  );
}



















// for optimisation 
// src/App.jsx
// import React, { Suspense, lazy } from "react";
// import { Routes, Route } from "react-router-dom";

// import Header from "./components/Header";
// import TransitionProvider from "./components/transition";

// // 🔹 Lazy-loaded pages
// const Home3D2 = lazy(() => import("./pages/Home3D2"));
// const InsideHouse = lazy(() => import("./pages/InsideHouse"));
// const Gallery3D = lazy(() => import("./pages/Gallery3D2"));
// const About = lazy(() => import("./pages/About"));
// const Project = lazy(() => import("./pages/story"));
// const Contact = lazy(() => import("./pages/Contact"));
// const Baymax = lazy(() => import("./pages/baymax"));
// const Carrers = lazy(() => import("./pages/career2"));
// const JobPage = lazy(() => import("./pages/jobPage"));

// // 🔹 Simple full-page fallback while chunks load
// function RouteFallback() {
//   return (
//     <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
//         <p className="text-sm tracking-wide uppercase text-white/70">
//           Loading experience…
//         </p>
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <TransitionProvider>
//       <Header />
//       <Suspense fallback={<RouteFallback />}>
//         <Routes>
//           <Route path="/" element={<Home3D2 />} />
//           <Route path="/inside" element={<InsideHouse />} />
//           <Route path="/gallery" element={<Gallery3D />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/project" element={<Project />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/baymax" element={<Baymax />} />
//           <Route path="/carrers" element={<Carrers />} />
//           <Route path="/jobs" element={<JobPage />} />
//         </Routes>
//       </Suspense>
//     </TransitionProvider>
//   );
// }









