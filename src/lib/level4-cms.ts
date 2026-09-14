import { useQuery } from "@tanstack/react-query";

export type Level4Cms = {
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    buttonLabel: string;
  };
  collage: Array<{ id: string; alt: string; imageUrl?: string }>;
  mood: {
    quoteLines: string[];
    button: { label: string; href: string };
  };
  story: {
    eyebrow: string;
    title: string;
    intro: string;
    paragraphs: string[];
    features: Array<{ id: string; label: string }>;
  };
  linger: {
    eyebrow: string;
    headline: string;
    body: string;
    moments: Array<{ id: string; label: string; alt: string; imageUrl?: string }>;
  };
  evening: {
    headline: string;
    body: string;
    tags: string[];
    cardEyebrow: string;
    cardBody: string;
    ctaLabel: string;
    signOff: string;
  };
};

type CmsMedia = { name?: string; path?: string; previewUrl?: string };

type Level4Sections = {
  heroExtras?: {
    buttonLabel?: string;
    collage?: Array<{ id: string; label?: string; alt: string; image?: CmsMedia }>;
  };
  mood?: {
    quoteLines?: string[];
    button?: { label: string; href: string };
  };
  story?: {
    eyebrow?: string;
    title?: string;
    intro?: string;
    paragraphs?: string[];
    features?: Array<{ id: string; label: string }>;
  };
  linger?: {
    eyebrow?: string;
    headline?: string;
    body?: string;
    moments?: Array<{ id: string; label: string; alt: string; image?: CmsMedia }>;
  };
  evening?: {
    headline?: string;
    body?: string;
    tags?: string[];
    cardEyebrow?: string;
    cardBody?: string;
    ctaLabel?: string;
    signOff?: string;
  };
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

function mediaUrl(pathOrUrl?: string | null) {
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

async function fetchLevel4Cms(): Promise<Level4Cms | null> {
  const rows = await supabaseFetch<
    Array<{
      hero_eyebrow: string | null;
      hero_title: string | null;
      hero_description: string | null;
      hero_image_path: string | null;
      sections: Level4Sections | null;
    }>
  >(
    "page_content?select=hero_eyebrow,hero_title,hero_description,hero_image_path,sections&slug=eq.level-4&limit=1",
  );

  const row = rows?.[0];
  if (!row) return null;
  const sections = row.sections ?? {};

  return {
    hero: {
      eyebrow: row.hero_eyebrow || "Level 4",
      headline: row.hero_title || "For conversations that deserve time.",
      body:
        row.hero_description ||
        "The kind of evening you'll remember next year. Not because of what you ate. Because of who you shared it with.",
      buttonLabel: sections.heroExtras?.buttonLabel || "Explore Level 4",
    },
    collage: (sections.heroExtras?.collage || []).map((slot) => ({
      id: slot.id,
      alt: slot.alt,
      imageUrl:
        slot.id === "dining" && row.hero_image_path
          ? mediaUrl(row.hero_image_path)
          : resolveMedia(slot.image),
    })),
    mood: {
      quoteLines: sections.mood?.quoteLines?.length
        ? sections.mood.quoteLines
        : ["The light changes.", "The mood changes.", "The evening unfolds."],
      button: sections.mood?.button || { label: "Discover More", href: "/contact#reserve" },
    },
    story: {
      eyebrow: sections.story?.eyebrow || "The Space · Level 4",
      title: sections.story?.title || "The Signature Fine Dining & Bar Experience",
      intro: sections.story?.intro || "",
      paragraphs: sections.story?.paragraphs || [],
      features: sections.story?.features || [],
    },
    linger: {
      eyebrow: sections.linger?.eyebrow || "Inside Level 4",
      headline: sections.linger?.headline || "Linger a little longer",
      body: sections.linger?.body || "Soft light, woven shadows, and rooms that invite you to stay.",
      moments: (sections.linger?.moments || []).map((moment) => ({
        id: moment.id,
        label: moment.label,
        alt: moment.alt,
        imageUrl: resolveMedia(moment.image),
      })),
    },
    evening: {
      headline: sections.evening?.headline || "The evening\nis waiting.",
      body:
        sections.evening?.body ||
        "Slow dinners. Soft light. Conversations that deserve time — and a table of their own.",
      tags: sections.evening?.tags?.length
        ? sections.evening.tags
        : ["Dinner", "Cocktails", "Conversation"],
      cardEyebrow: sections.evening?.cardEyebrow || "Reserve your evening",
      cardBody:
        sections.evening?.cardBody ||
        "Join us on Level 4 for an unhurried night — crafted plates, considered pours, and company that stays with you.",
      ctaLabel: sections.evening?.ctaLabel || "Reserve a Table",
      signOff: sections.evening?.signOff || "We look forward to hosting you.",
    },
  };
}

export function useLevel4Cms() {
  return useQuery({
    queryKey: ["page_content", "level-4"],
    queryFn: fetchLevel4Cms,
    staleTime: 60 * 1000,
  });
}
