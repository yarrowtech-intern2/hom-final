import React from "react";
import DecryptedText from "./decryptedText"; // adjust path

export default function HomeOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[9999]">

      {/* BOTTOM LEFT */}
      <div className="absolute bottom-10 left-10 text-white space-y-1">
        <div className="text-[22px] font-semibold">
          <DecryptedText
            text="HOm-"
            animateOn="view"
            sequential
            speed={40}
          />
        </div>

        <div className="max-w-xs text-[11px] text-white/80 leading-snug">
          <DecryptedText
            text="generation and editing into a unified architecture with flexible multimodel reasoning and up to 4K output"
            animateOn="view"
            sequential
            speed={40}
          />
        </div>
      </div>

      {/* BOTTOM RIGHT */}
      <div className="absolute bottom-10 right-10 text-white text-right space-y-1">
        <div className="text-[30px] font-semibold leading-snug">
          <DecryptedText
            text="Title tupi"
            animateOn="view"
            sequential
            speed={40}
          />
        </div>

        <div className="max-w-sm ml-auto text-[12px] text-white/85 leading-snug">
          <DecryptedText
            text="As a new generation image creation model, seedream 4.0 integrattes image generation and editing into a unified architecture with multimodel reasoning."
            animateOn="view"
            sequential
            speed={40}
          />
        </div>

        <div className="max-w-sm ml-auto text-[10px] text-white/60 leading-snug">
          <DecryptedText
            text="Generation and editing into a unified architecture with flexible multimodel reasoning and up to 4K output."
            animateOn="view"
            sequential
            speed={40}
          />
        </div>
      </div>

    </div>
  );
}
