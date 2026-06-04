import { GalleryImage } from "@/types/gallery";

type RawImage = Record<string, unknown>;

type ApiResponse =
  | RawImage[]
  | {
      success?: boolean;
      message?: string;
      data?: RawImage[];
      images?: RawImage[];
      items?: RawImage[];
    };

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const getString = (value: unknown) => (typeof value === "string" ? value : "");

const normalizeImage = (item: RawImage, index: number): GalleryImage | null => {
  const imageUrl =
    getString(item.imageUrl) ||
    getString(item.url) ||
    getString(item.image) ||
    getString(item.image_url) ||
    getString(item.thumbnailUrl);

  if (!imageUrl) return null;

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
  const rawImages = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.images)
        ? payload.images
        : Array.isArray(payload.items)
          ? payload.items
          : [];

  return rawImages
    .map((item, index) => normalizeImage(item, index))
    .filter((item): item is GalleryImage => item !== null);
};

const removeTrailingSlash = (value: string) => value.replace(/\/$/, "");

const getImagesEndpoint = () => {
  const baseUrl = removeTrailingSlash(API_BASE_URL.trim());

  if (baseUrl.endsWith("/api")) {
    return `${baseUrl}/images`;
  }

  return `${baseUrl}/api/images`;
};

export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  const endpoint = getImagesEndpoint();

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status}) for ${endpoint}`);
    }

    const payload = (await response.json()) as ApiResponse;
    return normalizePayload(payload);
  } catch {
    throw new Error(`Unable to connect to ${endpoint}`);
  }
};