import React, { useEffect } from "react";
import ytPoster from "../assets/posters/yt.png";
import buildingPoster from "../assets/posters/building.png";
import hiremePoster from "../assets/posters/hireme.png";
import artblockPoster from "../assets/posters/artblock.png";
import greenbarPoster from "../assets/posters/greenbar.png";
import betterpassPoster from "../assets/posters/betterpass.png";
import "./projectsShowcase.css";

const PROJECTS = [
  {
    title: "Yarrowtech",
    tagline: "Software and ERP Ecosystem",
    description:
      "YarrowTech is a next-generation software company focused on intelligent, high-impact digital products. The platform portfolio spans custom software development, ERP systems, AI-powered applications, and full-stack web/mobile execution for modern businesses.",
    url: "https://yarrowtech.com",
    cta: "Visit Website",
    tags: ["ERP Systems", "AI Apps", "Full-Stack", "Enterprise"],
    poster: ytPoster,
  },
  {
    title: "Building",
    tagline: "Regulated Crowdfunding Platform",
    description:
      "A secure digital marketplace that connects vetted early-stage founders with retail investors. The product is designed around trust and compliance, with campaign workflows, KYC/AML coverage, and scalable marketplace operations.",
    url: "https://sportbit.app",
    cta: "View Platform",
    tags: ["Crowdfunding", "KYC/AML", "Compliance", "Marketplace"],
    poster: buildingPoster,
  },
  {
    title: "Hire-Me",
    tagline: "Subscription HR Infrastructure",
    description:
      "Hire Me is a subscription-first HR ecosystem that supports partner companies, HR teams, and employees through streamlined intake, workforce tracking, and compliance workflows in a secure always-on environment.",
    url: "https://fb.yarrowtech.com",
    cta: "Explore Product",
    tags: ["HR Tech", "SaaS", "Workforce", "Compliance"],
    poster: hiremePoster,
  },
  {
    title: "Art-Block",
    tagline: "Creator Commerce Network",
    description:
      "ArtBlock enables artists and creators to showcase, share, and monetize work via subscriptions. It includes membership tiers, direct audience engagement, secure payments, real-time notifications, and engagement analytics.",
    url: "https://myguide.yarrowtech.com",
    cta: "See Solution",
    tags: ["Creator Platform", "Subscriptions", "Payments", "Analytics"],
    poster: artblockPoster,
  },
  {
    title: "Green-bar",
    tagline: "Fresh Grocery Ordering System",
    description:
      "A commerce platform for fresh groceries and farm produce with customer ordering, seller/admin controls, inventory handling, and real-time order tracking for a smooth checkout-to-delivery flow.",
    url: "https://electroniceducare.com",
    cta: "View Product",
    tags: ["E-Commerce", "Inventory", "Order Tracking", "Admin Panel"],
    poster: greenbarPoster,
  },
  {
    title: "Better-Pass",
    tagline: "Social Travel Marketplace",
    description:
      "A social travel product where tour companies, travelers, influencers, and activity instructors connect, publish tours, and complete bookings. The experience combines discovery, networking, and conversion in one platform.",
    url: "https://electroniceducare.com",
    cta: "View Product",
    tags: ["Travel Social", "Bookings", "Multi-Role", "Community"],
    poster: betterpassPoster,
  },
];

const STRIP_WORDS = [
  "Digital Products",
  "Platform Engineering",
  "Interaction Design",
  "Enterprise Systems",
  "Applied AI",
  "Brand Experience",
];

export default function ProjectsShowcase() {
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyBg = document.body.style.background;
    const prevHtmlBg = document.documentElement.style.background;

    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.background = "#f7f2e7";
    document.documentElement.style.background = "#f7f2e7";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.background = prevBodyBg;
      document.documentElement.style.background = prevHtmlBg;
    };
  }, []);

  return (
    <main className="projects-showcase-page">
      <section className="projects-hero">
        <p className="projects-kicker">We are House of Musa</p>

        <div className="projects-title-stack" aria-label="Project showcase heading">
          <h1 className="projects-title-row">
            <span>DIGITAL</span>
            <span className="outline">PRODUCTS</span>
          </h1>
          <h1 className="projects-title-row">
            <span className="outline">BUILT FOR</span>
            <span>SCALE</span>
          </h1>
        </div>

        <div className="projects-hero-bottom">
          <p className="projects-intro">
            A digital agency passionate about creating immersive visual experiences. We build badass websites and dynamic applications for ambitious brands.
          </p>
          <div className="scroll-indicator">
            <span className="arrow-down">↓</span> EXPLORE
          </div>
        </div>
      </section>

      <section className="projects-strip" aria-label="Capabilities strip">
        <div className="projects-strip-track">
          {[...STRIP_WORDS, ...STRIP_WORDS, ...STRIP_WORDS, ...STRIP_WORDS].map((word, idx) => (
            <span key={`${word}-${idx}`}>{word} • </span>
          ))}
        </div>
      </section>

      <section className="projects-list-container">
        <div className="projects-list-header">
          <h2>Selected Works</h2>
          <p>Explore a collection of high-quality, innovative digital products crafted to elevate businesses.</p>
        </div>

        <div className="projects-list" aria-label="Projects">
          {PROJECTS.map((project, index) => (
            <article className="project-work-card" key={project.title}>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-work-media-link">
                <div className="project-work-media">
                  <img src={project.poster} alt={`${project.title} poster`} loading="lazy" />
                  <div className="project-work-overlay">
                    <span>VIEW PROJECT ↗</span>
                  </div>
                </div>
              </a>

              <div className="project-work-content">
                <div className="project-work-header">
                  <h2>{project.title}</h2>
                  <span className="project-work-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                
                <p className="project-work-tagline">{project.tagline}</p>
                
                <div className="project-work-tags">
                  {project.tags.map((tag) => (
                    <span key={`${project.title}-${tag}`}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
