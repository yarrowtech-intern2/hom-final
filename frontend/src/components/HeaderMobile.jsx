import React, { useCallback, useMemo } from "react";
import { usePageTransition } from "./transition";
import StaggeredMenu from "./StaggeredMenu";
import "./HeaderMobile.css";

export default function HeaderMobile({ onOpenContact }) {
  const { start } = usePageTransition();

  const menuItems = useMemo(
    () => [
      { label: "Home", ariaLabel: "Go to home page", link: "/" },
      { label: "About", ariaLabel: "Learn about us", link: "/about" },
      // {
      //   label: "Projects",
      //   ariaLabel: "View our project showcase",
      //   link: "/projects",
      // },
      {
        label: "Products",
        ariaLabel: "Jump to the projects section on the about page",
        link: "/about#projects",
      },
      {
        label: "Contact",
        ariaLabel: "Open contact form",
        link: "/contact",
        action: "contact",
      },
      {
        label: "Careers",
        ariaLabel: "Explore career opportunities",
        link: "/carrers",
      },
      // { label: "Admin", ariaLabel: "Open admin login", link: "/admin123" },
    ],
    []
  );

  const socialItems = useMemo(
    () => [
      { label: "Twitter", link: "https://twitter.com" },
      { label: "GitHub", link: "https://github.com" },
      { label: "LinkedIn", link: "https://linkedin.com" },
    ],
    []
  );

  const handleMenuItemClick = useCallback(
    ({ event, item }) => {
      if (item.action === "contact") {
        event.preventDefault();
        onOpenContact?.();
        return true;
      }

      if (!item.link || item.link.startsWith("http")) return true;

      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      start(item.link, {
        x,
        y,
        duration: 0.65,
        ease: "power4.inOut",
      });

      return true;
    },
    [onOpenContact, start]
  );

  return (
    <header className="header-overlay">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        menuButtonColor="#FEDEBE"
        openMenuButtonColor="#180802"
        foregroundColor="#180802"
        mutedColor="rgba(24, 8, 2, 0.72)"
        focusColor="#FEDEBE"
        changeMenuColorOnOpen
        colors={["#FF8303", "#FD5602"]}
        logoUrl=""
        accentColor="#FD5602"
        isFixed
        onItemClick={handleMenuItemClick}
      />
    </header>
  );
}
