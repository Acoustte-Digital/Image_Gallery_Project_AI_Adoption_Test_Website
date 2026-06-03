"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchGalleryImages } from "@/lib/gallery-api";
import { GalleryImage } from "@/types/gallery";
import { CategoryFilters } from "@/components/category-filters";
import { EmptyState, ErrorState, LoadingState } from "@/components/gallery-states";
import { ImageGrid } from "@/components/image-grid";
import { ImageModal } from "@/components/image-modal";
import { SearchBar } from "@/components/search-bar";

export function ImageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchGalleryImages();
      setImages(data);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unexpected error while loading images.";
      setError(message);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(images.map((image) => image.category).filter(Boolean))].sort();
    return ["All", ...uniqueCategories];
  }, [images]);

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredImages = useMemo(
    () =>
      images.filter((image) => {
        const categoryMatch = selectedCategory === "All" || image.category === selectedCategory;
        if (!categoryMatch) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        const searchableContent = `${image.title} ${image.description ?? ""} ${image.category}`.toLowerCase();
        return searchableContent.includes(normalizedSearch);
      }),
    [images, normalizedSearch, selectedCategory],
  );

  return (
    <>
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Image Gallery</h1>
          <p className="text-sm text-slate-600">Browse, search and preview images from the connected API.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {isLoading ? <LoadingState /> : null}
        {!isLoading && error ? <ErrorState message={error} onRetry={() => void loadImages()} /> : null}
        {!isLoading && !error && filteredImages.length === 0 ? <EmptyState /> : null}
        {!isLoading && !error && filteredImages.length > 0 ? (
          <ImageGrid images={filteredImages} onPreview={setSelectedImage} />
        ) : null}
      </section>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
}
