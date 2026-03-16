


// // src/components/Header.jsx
// import React, { useEffect, useState } from "react";
// import HeaderDesktop from "./HeaderDesktop";
// import HeaderMobile from "./HeaderMobile";

// function useMediaQuery(query) {
//   const [matches, setMatches] = useState(() =>
//     typeof window !== "undefined" ? window.matchMedia(query).matches : false
//   );
//   useEffect(() => {
//     const mq = window.matchMedia(query);
//     const onChange = () => setMatches(mq.matches);
//     onChange();
//     mq.addEventListener?.("change", onChange);
//     return () => mq.removeEventListener?.("change", onChange);
//   }, [query]);
//   return matches;
// }

// export default function Header() {
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   return isMobile ? <HeaderMobile /> : <HeaderDesktop />;
// }
























import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
import ContactModal from "./ContactModal";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [query]);
  return matches;
}

export default function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();

  if (
    location.pathname === "/admin123" ||
    location.pathname === "/admin1234" ||
    location.pathname === "/developer"
  ) {
    return null;
  }

  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);

  return (
    <>
      {isMobile ? (
        <HeaderMobile onOpenContact={openContact} />
      ) : (
        <HeaderDesktop onOpenContact={openContact} />
      )}

      <ContactModal open={contactOpen} onClose={closeContact} />
    </>
  );
}
