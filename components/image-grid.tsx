import Image from "next/image";
import { GalleryImage } from "@/types/gallery";

type ImageGridProps = {
  images: GalleryImage[];
  onPreview: (image: GalleryImage) => void;
};

export function ImageGrid({ images, onPreview }: ImageGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <button
          key={image.id}
          type="button"
          onClick={() => onPreview(image)}
          className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="relative h-56 w-full bg-slate-100">
            <Image
              src={image.imageUrl}
              alt={image.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="space-y-1 p-4">
            <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{image.title}</h3>
            <p className="text-sm font-medium text-indigo-700">{image.category}</p>
            {image.description ? <p className="line-clamp-2 text-sm text-slate-600">{image.description}</p> : null}
          </div>
        </button>
      ))}
    </div>
  );
}
