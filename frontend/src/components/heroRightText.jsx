import React, { useEffect, useState } from "react";
import DecryptedText from "./decryptedText";

export default function HeroRightText() {
  const [loopKey, setLoopKey] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLoopKey(k => k + 1), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute bottom-10 right-10 text-right select-none space-y-2 sm:space-y-3">
      <h2 className="text-white/45 font-light text-[4vw] sm:text-[2.8vw] md:text-[2vw] lg:text-[.9vw] leading-tight tracking-wide uppercase">
        The Art of<br /><span className="font-medium text-white/75">Modern Couture</span>
      </h2>
      <div key={loopKey} className="text-white/40 text-[9px] sm:text-[10px] md:text-[11px] lg:text-[10px] leading-relaxed max-w-[200px] sm:max-w-[240px] md:max-w-[260px] ml-auto">
        <DecryptedText
          text="Nilotpala reimagines modern couture through the dialogue of art and intelligence — where every silhouette is sculpted with precision, emotion, and purpose. A seamless fusion of human craftsmanship and digital creation that celebrates individuality and timeless design."
          speed={2}
          maxIterations={150}
          sequential
          revealDirection="start"
          animateOn="view"
          className="revealed"
          encryptedClassName="opacity-50"
        />
      </div>
    </div>
  );
}
