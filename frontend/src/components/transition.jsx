// components/TransitionProvider.jsx
import React, { createContext, useCallback, useContext, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TransitionCtx = createContext({ start: (_to, _opts) => {} });
export const usePageTransition = () => useContext(TransitionCtx);

export default function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    const scrollPages = new Set([
      "/about",
      "/contact",
      "/projects",
      "/carrers",
      "/developer",
    ]);
    const isScrollPage = scrollPages.has(location.pathname);
    const root = document.getElementById("root");

    if (isScrollPage) {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";

      if (root) {
        root.style.height = "auto";
        root.style.minHeight = "100%";
        root.style.overflow = "visible";
      }
    } else {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      if (root) {
        root.style.height = "";
        root.style.minHeight = "";
        root.style.overflow = "";
      }
    }

    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";

      if (root) {
        root.style.height = "";
        root.style.minHeight = "";
        root.style.overflow = "";
      }
    };
  }, [location.pathname]);

  const start = useCallback((to) => {
    navigate(to);
  }, [navigate]);

  return (
    <TransitionCtx.Provider value={{ start }}>
      {children}
    </TransitionCtx.Provider>
  );
}
