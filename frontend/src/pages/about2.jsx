import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./about2.css";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap
        .timeline()
        .to(".hero-title", {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
        })
        .to(
          ".hero-subtitle",
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          ".hero-cta",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // Horizontal scroll section
      const horizontalContainer = document.getElementById("horizontalScroll");
      const cards = gsap.utils.toArray(".horizontal-card");

      if (horizontalContainer && cards.length) {
        gsap.to(cards, {
          xPercent: -100 * (cards.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: ".horizontal-section",
            pin: true,
            scrub: 1,
            snap: cards.length > 1 ? 1 / (cards.length - 1) : 1,
            end: () => "+=" + horizontalContainer.offsetWidth,
          },
        });
      }

      // Cards section animation
      gsap.utils.toArray(".flex-card").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
          y: 100,
          opacity: 0,
          duration: 1,
        });
      });

      // Testimonials animation
      gsap.utils.toArray(".testimonial-card").forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
          y: 80,
          opacity: 0,
          rotation: 5,
          duration: 1,
        });
      });

      // Services animation
      gsap.utils.toArray(".service-item").forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
          x: i % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 1,
        });
      });

      // Title animations on scroll
      gsap
        .utils
        .toArray(".horizontal-title, .cards-title, .testimonials-title, .services-title")
        .forEach((title) => {
          gsap.from(title, {
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            },
            opacity: 0,
            x: -100,
            duration: 1,
          });
        });

      // Smooth scroll reveal for sections
      gsap.utils.toArray("section").forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          },
          opacity: 0,
          duration: 1,
        });
      });

      // Parallax effect for gradient orbs
      gsap.to(".orb-1", {
        y: 300,
        x: 200,
        scrollTrigger: { trigger: ".hero", scrub: 2 },
      });

      gsap.to(".orb-2", {
        y: -200,
        x: -150,
        scrollTrigger: { trigger: ".hero", scrub: 2 },
      });

      gsap.to(".orb-3", {
        scale: 1.5,
        scrollTrigger: { trigger: ".hero", scrub: 2 },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">DESIGN THE FUTURE</h1>
          <p className="hero-subtitle">
            We craft experiences that transcend expectations and redefine possibilities
          </p>
          <a href="#" className="hero-cta">
            Start Your Journey
          </a>
        </div>
      </section>

      {/* Horizontal Scroll Section */}
      <section className="horizontal-section">
        <h2 className="horizontal-title">OUR PROCESS</h2>

        <div className="horizontal-container" id="horizontalScroll">
          {[
            {
              no: "01",
              title: "Discovery",
              desc: "We dive deep into understanding your vision, goals, and challenges. Every great project starts with listening and learning from you.",
            },
            {
              no: "02",
              title: "Strategy",
              desc: "Crafting a roadmap that aligns with your objectives. We transform insights into actionable plans that drive results.",
            },
            {
              no: "03",
              title: "Design",
              desc: "Bringing ideas to life with stunning visuals and intuitive interfaces. Where creativity meets functionality.",
            },
            {
              no: "04",
              title: "Development",
              desc: "Building robust, scalable solutions with cutting-edge technology. Performance and quality in every line of code.",
            },
            {
              no: "05",
              title: "Launch",
              desc: "Taking your project live with precision and care. We ensure a smooth transition from development to deployment.",
            },
          ].map((c) => (
            <div className="horizontal-card" key={c.no}>
              <div className="card-number">{c.no}</div>
              <div>
                <h3 className="card-title">{c.title}</h3>
                <p className="card-description">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cards Section */}
      <section className="cards-section">
        <h2 className="cards-title">WHY CHOOSE US</h2>

        <div className="cards-grid">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              text: "We deliver exceptional results at unprecedented speed without compromising on quality or attention to detail.",
            },
            {
              icon: "🎨",
              title: "Creative Excellence",
              text: "Our team pushes boundaries and thinks outside the box to create truly unique and memorable experiences.",
            },
            {
              icon: "🚀",
              title: "Scalable Solutions",
              text: "Built to grow with your business. Our solutions adapt and scale as your needs evolve over time.",
            },
            {
              icon: "💎",
              title: "Premium Quality",
              text: "We maintain the highest standards in everything we do, from code quality to design aesthetics.",
            },
            {
              icon: "🔒",
              title: "Secure & Reliable",
              text: "Security is built into every layer. Your data and users are protected with industry-leading practices.",
            },
            {
              icon: "🤝",
              title: "Dedicated Support",
              text: "We're with you every step of the way. Our team provides ongoing support and guidance long after launch.",
            },
          ].map((c) => (
            <div className="flex-card" key={c.title}>
              <div className="flex-card-icon">{c.icon}</div>
              <h3 className="flex-card-title">{c.title}</h3>
              <p className="flex-card-text">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="testimonials-title">CLIENT STORIES</h2>

        <div className="testimonials-grid">
          {[
            {
              quote:
                '"Working with this team transformed our entire digital presence. The attention to detail and creative vision exceeded all expectations. Absolutely phenomenal work!"',
              name: "Sarah Mitchell",
              role: "CEO, TechVision Inc",
            },
            {
              quote:
                '"The results speak for themselves. Our conversion rates increased by 240% after the redesign. Their strategic approach and execution were flawless."',
              name: "Marcus Chen",
              role: "Founder, GrowthLabs",
            },
            {
              quote:
                '"From concept to launch, the process was seamless. They truly understood our vision and brought it to life in ways we never imagined possible."',
              name: "Emma Rodriguez",
              role: "Director, Creative Studios",
            },
          ].map((t) => (
            <div className="testimonial-card" key={t.name}>
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar" />
                <div className="author-info">
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2 className="services-title">WHAT WE DO</h2>
        <p className="services-subtitle">
          Comprehensive solutions tailored to your unique needs and business objectives
        </p>

        <div className="services-grid">
          {[
            {
              no: "— 01",
              title: "Brand Identity",
              desc: "Create a powerful and memorable brand presence that resonates with your target audience and sets you apart from competitors.",
            },
            {
              no: "— 02",
              title: "Web Development",
              desc: "Build high-performance websites and applications that deliver exceptional user experiences across all devices and platforms.",
            },
            {
              no: "— 03",
              title: "Digital Marketing",
              desc: "Drive growth with data-driven marketing strategies that connect with your audience and deliver measurable results.",
            },
            {
              no: "— 04",
              title: "Product Design",
              desc: "Design intuitive and beautiful products that users love. From concept to prototype, we craft experiences that work.",
            },
          ].map((s) => (
            <div className="service-item" key={s.title}>
              <div className="service-number">{s.no}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-description">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <h3>BRAND</h3>
            <p>
              Transforming visions into reality through innovative design and cutting-edge
              technology. Let's create something extraordinary together.
            </p>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Services</h4>
            <ul>
              <li><a href="#">Web Design</a></li>
              <li><a href="#">Development</a></li>
              <li><a href="#">Branding</a></li>
              <li><a href="#">Marketing</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Dribbble</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Brand. All rights reserved. Crafted with passion and precision.</p>
        </div>
      </footer>
    </div>
  );
}
