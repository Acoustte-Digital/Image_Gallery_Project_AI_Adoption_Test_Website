"use client";

import Image from "next/image";
import { useEffect } from "react";
import { GalleryImage } from "@/types/gallery";

type ImageModalProps = {
  image: GalleryImage | null;
  onClose: () => void;
};

export function ImageModal({ image, onClose }: ImageModalProps) {
  useEffect(() => {
    if (!image) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [image, onClose]);

  if (!image) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={image.title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-white"
        >
          ✕
        </button>

        <div className="relative h-[60vh] w-full bg-slate-100">
          <Image src={image.imageUrl} alt={image.title} fill className="object-contain" sizes="100vw" />
        </div>

        <div className="space-y-2 p-4">
          <h3 className="text-lg font-semibold text-slate-900">{image.title}</h3>
          <p className="text-sm font-medium text-indigo-700">{image.category}</p>
          {image.description ? <p className="text-sm text-slate-600">{image.description}</p> : null}
        </div>
      </div>
    </div>
  );
}
