import { useQuery } from "@tanstack/react-query";

export type CmsMedia = { name?: string; path?: string; previewUrl?: string };

export type MenuCms = {
  hero: {
    imageUrl?: string;
    mobileImageUrl?: string;
    eyebrow: string;
    headline: string;
    description: string;
    breadcrumb: string;
  };
  selection: {
    eyebrow: string;
    headline: string;
    intro: string;
  };
  dishes: Array<{
    id: string;
    name: string;
    imageName?: string;
    imageUrl?: string;
  }>;
};

type MenuSections = {
  heroExtras?: {
    breadcrumb?: string;
    mobileImage?: CmsMedia;
  };
  selection?: MenuCms["selection"];
  dishes?: Array<{
    id: string;
    name: string;
    image?: CmsMedia;
  }>;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const MEDIA_BUCKET = "media";

async function supabaseFetch<T>(path: string): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!response.ok) return null;
  return (await response.json()) as T;
}

export function mediaUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return undefined;
  if (
    pathOrUrl.startsWith("http://") ||
    pathOrUrl.startsWith("https://") ||
    pathOrUrl.startsWith("blob:") ||
    pathOrUrl.startsWith("data:")
  ) {
    return pathOrUrl;
  }
  if (!SUPABASE_URL) return undefined;
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${pathOrUrl}`;
}

function resolveMedia(media?: CmsMedia | null) {
  return mediaUrl(media?.path || media?.previewUrl);
}

export async function fetchMenuCms(): Promise<MenuCms | null> {
  const rows = await supabaseFetch<
    Array<{
      hero_eyebrow: string | null;
      hero_title: string | null;
      hero_description: string | null;
      hero_image_path: string | null;
      sections: MenuSections | null;
    }>
  >(
    "page_content?select=hero_eyebrow,hero_title,hero_description,hero_image_path,sections&slug=eq.menu&limit=1",
  );

  const row = rows?.[0];
  if (!row) return null;
  const sections = row.sections ?? {};

  return {
    hero: {
      imageUrl: mediaUrl(row.hero_image_path),
      mobileImageUrl: resolveMedia(sections.heroExtras?.mobileImage),
      eyebrow: row.hero_eyebrow || "",
      headline: row.hero_title || "",
      description: row.hero_description || "",
      breadcrumb: sections.heroExtras?.breadcrumb || "Menu",
    },
    selection: {
      eyebrow: sections.selection?.eyebrow || "",
      headline: sections.selection?.headline || "",
      intro: sections.selection?.intro || "",
    },
    dishes: (sections.dishes || []).map((dish) => ({
      id: dish.id,
      name: dish.name,
      imageName: dish.image?.name || dish.id,
      imageUrl: resolveMedia(dish.image),
    })),
  };
}

export function useMenuCms() {
  return useQuery({
    queryKey: ["page_content", "menu"],
    queryFn: fetchMenuCms,
    staleTime: 60 * 1000,
  });
}
