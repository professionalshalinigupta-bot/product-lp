"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = {
  name: string;
  src: string;
  alt: string;
  accent: string;
  dark: string;
  soft: string;
  panel: string;
  glow: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  selectedFlavor: string;
  onSelectFlavor: (flavor: string) => void;
};

export function ProductGallery({ images, selectedFlavor, onSelectFlavor }: ProductGalleryProps) {
  const active = Math.max(
    0,
    images.findIndex((image) => image.name === selectedFlavor)
  );
  const current = images[active];

  const move = (direction: number) => {
    const next = (active + direction + images.length) % images.length;
    onSelectFlavor(images[next].name);
  };

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft transition-colors duration-300"
        style={{
          background: `radial-gradient(circle at 50% 18%, #ffffff 0%, ${current.panel} 42%, ${current.soft} 100%)`
        }}
      >
        <div
          className="absolute -left-12 top-12 h-44 w-44 rounded-full blur-3xl"
          style={{ backgroundColor: current.glow, opacity: 0.45 }}
        />
        <div className="absolute inset-6 rounded-[1.5rem] border border-white/70 bg-white/28" />
        <Image src={current.src} alt={current.alt} fill priority className="object-contain p-7 drop-shadow-2xl" sizes="(min-width: 1024px) 48vw, 100vw" />
        <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/88 px-4 py-3 text-center shadow-lg backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: current.accent }}>
            Selected flavor
          </p>
          <p className="mt-1 text-2xl font-black" style={{ color: current.dark }}>
            {current.name}
          </p>
        </div>
        <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
          <button
            type="button"
            aria-label="Previous product image"
            className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-white/90 text-charcoal shadow-lg backdrop-blur transition hover:bg-white"
            onClick={() => move(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next product image"
            className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-white/90 text-charcoal shadow-lg backdrop-blur transition hover:bg-white"
            onClick={() => move(1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((image, index) => (
          <button
            type="button"
            key={image.src}
            aria-label={`Choose ${image.name} flavor`}
            onClick={() => onSelectFlavor(image.name)}
            className="focus-ring overflow-hidden rounded-2xl border-2 bg-white transition hover:-translate-y-0.5"
            style={{
              borderColor: active === index ? image.accent : "transparent",
              opacity: active === index ? 1 : 0.78
            }}
          >
            <div
              className="relative aspect-square"
              style={{ background: `radial-gradient(circle, #ffffff 0%, ${image.panel} 58%, ${image.soft} 100%)` }}
            >
              <Image src={image.src} alt={image.alt} fill className="object-contain p-3" sizes="160px" />
            </div>
            <div className="px-2 py-2 text-center text-xs font-black" style={{ color: image.dark }}>
              {image.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
