import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function StaggeredMenu({
  position = "right",
  colors = ["#B19EEF", "#5227FF"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = "/logo/logo-white.png",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  changeMenuColorOnOpen = true,
  accentColor = "#5227FF",
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  onItemClick,
}) {
  const [open, setOpen] = useState(false);
  const [textLines, setTextLines] = useState(["Menu", "Close"]);
  const openRef = useRef(false);
  const busyRef = useRef(false);

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);

  const textInnerRef = useRef(null);
  const toggleBtnRef = useRef(null);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const itemEntranceTweenRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll(".sm-prelayer"));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    });

    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(
      panel.querySelectorAll(".sm-panel-itemLabel")
    );
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "xPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) {
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart
        );
      }

      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            },
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;

    const tl = buildOpenTimeline();
    if (!tl) {
      busyRef.current = false;
      return;
    }

    tl.eventCallback("onComplete", () => {
      busyRef.current = false;
    });
    tl.play(0);
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll(".sm-panel-itemLabel")
        );
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
        );
        if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });

        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = Array.from(
          panel.querySelectorAll(".sm-socials-link")
        );
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;

      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
        return;
      }

      gsap.set(btn, { color: menuButtonColor });
    },
    [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]
  );

  React.useEffect(() => {
    if (!toggleBtnRef.current) return;
    if (changeMenuColorOnOpen) {
      const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
      gsap.set(toggleBtnRef.current, { color: targetColor });
      return;
    }
    gsap.set(toggleBtnRef.current, { color: menuButtonColor });
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;

    const seq = [currentLabel];
    let last = currentLabel;

    for (let i = 0; i < cycles; i += 1) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }

    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;

    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
  }, [animateColor, animateIcon, animateText, onMenuClose, playClose]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [
    animateColor,
    animateIcon,
    animateText,
    onMenuClose,
    onMenuOpen,
    playClose,
    playOpen,
  ]);

  const handleItemSelect = useCallback(
    (event, item, index) => {
      if (!onItemClick) {
        closeMenu();
        return;
      }

      const result = onItemClick({
        event,
        item,
        index,
        closeMenu,
      });

      if (result !== false) closeMenu();
    },
    [closeMenu, onItemClick]
  );

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return undefined;

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeOnClickAway, closeMenu, open]);

  React.useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, closeMenu]);

  React.useEffect(
    () => () => {
      openTlRef.current?.kill();
      closeTweenRef.current?.kill();
      spinTweenRef.current?.kill();
      textCycleAnimRef.current?.kill();
      colorTweenRef.current?.kill();
      itemEntranceTweenRef.current?.kill();
    },
    []
  );

  return (
    <div
      className={`sm-scope ${isFixed ? "fixed top-0 left-0 w-screen h-screen overflow-hidden" : "w-full h-full"}`}
    >
      <div
        className={`${className ? `${className} ` : ""}staggered-menu-wrapper`}
        style={accentColor ? { "--sm-accent": accentColor } : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        <div
          ref={preLayersRef}
          className="sm-prelayers"
          aria-hidden="true"
        >
          {(colors && colors.length ? colors.slice(0, 4) : ["#1e1e22", "#35353c"])
            .filter((_, idx, arr) => arr.length < 3 || idx !== Math.floor(arr.length / 2))
            .map((color, i) => (
              <div
                key={`${color}-${i}`}
                className="sm-prelayer"
                style={{ background: color }}
              />
            ))}
        </div>

        <header
          className={`staggered-menu-header${logoUrl ? "" : " sm-no-logo"}`}
          aria-label="Main navigation header"
        >
          {logoUrl ? (
            <div className="sm-logo" aria-label="Logo">
              <img
                src={logoUrl}
                alt="Logo"
                className="sm-logo-img"
                draggable={false}
                width={110}
                height={24}
              />
            </div>
          ) : null}

          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span
              className="sm-toggle-textWrap"
              aria-hidden="true"
            >
              <span ref={textInnerRef} className="sm-toggle-textInner">
                {textLines.map((line, i) => (
                  <span className="sm-toggle-line" key={`${line}-${i}`}>
                    {line}
                  </span>
                ))}
              </span>
            </span>

            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel"
          style={{ WebkitBackdropFilter: "blur(12px)" }}
          aria-hidden={!open}
        >
          <div className="sm-panel-inner">
            <ul
              className="sm-panel-list"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items.length ? (
                items.map((item, idx) => (
                  <li className="sm-panel-itemWrap" key={`${item.label}-${idx}`}>
                    <a
                      className="sm-panel-item"
                      href={item.link}
                      aria-label={item.ariaLabel}
                      data-index={idx + 1}
                      onClick={(event) => handleItemSelect(event, item, idx)}
                    >
                      <span className="sm-panel-itemLabel">{item.label}</span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="sm-panel-itemWrap" aria-hidden="true">
                  <span className="sm-panel-item">
                    <span className="sm-panel-itemLabel">No items</span>
                  </span>
                </li>
              )}
            </ul>

            {displaySocials && socialItems.length > 0 && (
              <div className="sm-socials" aria-label="Social links">
                <h3 className="sm-socials-title">Socials</h3>
                <ul className="sm-socials-list" role="list">
                  {socialItems.map((social, i) => (
                    <li key={`${social.label}-${i}`} className="sm-socials-item">
                      <a
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link"
                        onClick={closeMenu}
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
.sm-scope { z-index: 40; pointer-events: none; }
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1rem 0.9rem 0; background: transparent; pointer-events: none; z-index: 20; }
.sm-scope .staggered-menu-header.sm-no-logo { justify-content: flex-end; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-logo-img { display: block; height: 54px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.35rem; background: transparent; border: none; cursor: pointer; color: #ffffff; font-weight: 600; line-height: 1; overflow: visible; text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.8rem; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.45em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
.sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: 100%; max-width: 100vw; height: 100%; background: var(--sm-accent, #9d6800); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; padding: 7.5rem 1.2rem 1.5rem; overflow-y: auto; z-index: 10; pointer-events: auto; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: 100%; pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: #ffffff; }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
.sm-scope .sm-socials-link:focus-visible { outline: 2px solid #ffffff; outline-offset: 3px; }
.sm-scope .sm-socials-link { font-size: 1rem; font-weight: 500; color: #ffffff; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-socials-link:hover { color: #ffffff; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.65rem; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-panel-item { position: relative; color: #ffffff; font-weight: 700; font-size: clamp(2.1rem, 12vw, 3.3rem); cursor: pointer; line-height: 1; letter-spacing: -0.04em; text-transform: uppercase; transition: color 0.25s ease; display: inline-block; text-decoration: none; padding-right: 1.5em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: #ffffff; }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.2em; right: 3.1em; font-size: 0.9rem; font-weight: 500; color: #ffffff; letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
@media (min-width: 769px) {
  .sm-scope .staggered-menu-header { display: none; }
  .sm-scope .staggered-menu-panel { display: none; }
  .sm-scope .sm-prelayers { display: none; }
}
      `}</style>
    </div>
  );
}
