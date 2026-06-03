import { GalleryImage } from "@/types/gallery";

type RawImage = Record<string, unknown>;

type ApiResponse = RawImage[] | { images?: RawImage[]; data?: RawImage[]; items?: RawImage[] };

const getString = (value: unknown) => (typeof value === "string" ? value : "");

const normalizeImage = (item: RawImage, index: number): GalleryImage | null => {
  const imageUrl =
    getString(item.imageUrl) ||
    getString(item.url) ||
    getString(item.image) ||
    getString(item.image_url) ||
    getString(item.thumbnailUrl);

  if (!imageUrl) {
    return null;
  }

  const id = getString(item.id) || getString(item._id) || `${imageUrl}-${index}`;

  return {
    id,
    title: getString(item.title) || getString(item.name) || `Image ${index + 1}`,
    imageUrl,
    category: getString(item.category) || "Uncategorized",
    description: getString(item.description) || undefined,
  };
};

const normalizePayload = (payload: ApiResponse): GalleryImage[] => {
  const rawImages =
    Array.isArray(payload)
      ? payload
      : Array.isArray(payload.images)
        ? payload.images
        : Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload.items)
            ? payload.items
            : [];

  return rawImages
    .map((item, index) => normalizeImage(item, index))
    .filter((item): item is GalleryImage => item !== null);
};

const removeTrailingSlash = (value: string) => value.replace(/\/$/, "");

const resolveEndpoints = (): string[] => {
  const specificEndpoint = process.env.NEXT_PUBLIC_IMAGES_ENDPOINT?.trim();
  if (specificEndpoint) {
    return [specificEndpoint];
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (baseUrl) {
    const safeBaseUrl = removeTrailingSlash(baseUrl);
    return [`${safeBaseUrl}/api/images`, `${safeBaseUrl}/images`];
  }

  return ["/api/images", "/images"];
};

export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  const endpoints = resolveEndpoints();
  let lastError = "Unable to fetch images.";

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });

      if (!response.ok) {
        lastError = `Request failed (${response.status}) for ${endpoint}`;
        continue;
      }

      const payload = (await response.json()) as ApiResponse;
      return normalizePayload(payload);
    } catch {
      lastError = `Unable to connect to ${endpoint}`;
    }
  }

  throw new Error(lastError);
};
