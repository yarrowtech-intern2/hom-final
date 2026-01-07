

// src/components/ui/image-gallery.jsx
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ImageGallery() {
  const [_active, _setActive] = useState(null);

  const images = [
    "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1729086046027-09979ade13fd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* ✅ Background applied here */}
      <section className="w-full min-h-screen bg-[#9d6800] flex flex-col items-center justify-start py-16">
        <div className="max-w-3xl text-center px-4 text-white">
          <h1 className="text-3xl font-semibold">Our Latest Creations</h1>
          <p className="text-sm text-white/80 mt-2">
            A visual collection of our most recent works – each piece crafted
            with intention, emotion, and style.
          </p>
        </div>

        <div className="flex items-center gap-2 h-[400px] w-full max-w-5xl mt-10 px-4">
          {images.map((src, idx) => (
            <div
              key={idx}
              className={cn(
                "relative group flex-grow transition-all w-56 rounded-xl overflow-hidden h-[400px] duration-500 hover:w-full shadow-lg"
              )}
            >
              <img
                className="h-full w-full object-cover object-center"
                src={src}
                alt={`image-${idx}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
