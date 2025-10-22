





import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
// import Home3D from "./pages/Home3D";
import Home3D2 from "./pages/Home3D2";
import InsideHouse from "./pages/InsideHouse";
import Gallery3D from "./pages/Gallery3D2";
import TransitionProvider from "./components/transition";
import About from "./pages/About";
import Project from "./pages/story";
import Contact from "./pages/contact";
import Baymax from "./pages/baymax";
import Carrers from "./pages/carrers";
import JobPage from "./pages/jobPage";


export default function App() {
  return (
    <>
      <TransitionProvider>
        <Header />
        <Routes>
          {/* <Route path="/" element={<Home3D />} /> */}
          <Route path="/" element={<Home3D2 />} />
          <Route path="/inside" element={<InsideHouse />} />
          <Route path="/gallery" element={<Gallery3D />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          
          {/* <Route path="/projects" element={<Projects />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/baymax" element={<Baymax />} />
          <Route path="/carrers" element={<Carrers />} />
          <Route path="/jobs" element={<JobPage />} />
          
        </Routes>
      </TransitionProvider>
    </>
  );
}

