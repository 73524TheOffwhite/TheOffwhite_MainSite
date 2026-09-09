import { useEffect, useId, useState } from "react";
import { Instagram } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/Eyebrow";

const PROFILE_URL = "https://www.instagram.com/offwhitegoa?utm_source=qr";
const ELFSIGHT_SCRIPT = "https://elfsightcdn.com/platform.js";
const WIDGET_ID = "381e755c-b01b-4de5-ad42-0ece4b460473";
const ELFSIGHT_APP_CLASS = `elfsight-app-${WIDGET_ID}`;
const STYLE_ID = "offwhite-elfsight-ig-theme-v7";
const PATCH_FLAG = "__offwhiteElfsightBootPatchV7";
const MAX_POSTS = 8;

type IgPost = { src: string; href: string };

/**
 * Elfsight uses carouselColumnsMode:"auto" which picks 1 column on narrow screens
 * regardless of carouselColumnsMobile. Force manual 4×2 to match desktop.
 */
function patchBootSettings(settings: Record<string, unknown>) {
  settings.carouselColumnsMode = "manual";
  settings.gridColumnsMode = "manual";
  settings.carouselColumnsMobile = 4;
  settings.carouselRowsOnMobile = 2;
  settings.carouselColumnsTablet = 4;
  settings.carouselColumnsDesktopSmall = 4;
  settings.carouselColumnsDesktopMedium = 4;
  settings.carouselColumnsDesktopLarge = 4;
  settings.gridColumnsMobile = 4;
  settings.gridRowsOnMobile = 2;
  settings.gridColumnsTablet = 4;
  settings.gridColumnsDesktopSmall = 4;
  settings.gridColumnsDesktopMedium = 4;
  settings.gridColumnsDesktopLarge = 4;
  settings.gridRows = 2;
  settings.carouselRows = 2;
  settings.carouselSwipeMobileEnable = false;
  settings.carouselArrowsOnMobileEnable = false;
  settings.carouselArrowsEnable = false;
  settings.carouselPagination = false;
  settings.displayHeader = false;
  settings.sliderArrowsOnMobileEnable = false;
  settings.sliderSwipeMobileEnable = false;
}

function patchBootJson(raw: string): string {
  try {
    const json = JSON.parse(raw);
    const settings = json?.data?.widgets?.[WIDGET_ID]?.data?.settings;
    if (settings && typeof settings === "object") {
      patchBootSettings(settings);
      return JSON.stringify(json);
    }
  } catch {
    /* keep original */
  }
  return raw;
}

function installBootPatch() {
  const w = window as Window & { [PATCH_FLAG]?: boolean };
  if (w[PATCH_FLAG]) return;
  w[PATCH_FLAG] = true;

  const patchedText = new WeakMap<XMLHttpRequest, string>();
  const rtDesc = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "responseText");
  const respDesc = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, "response");

  if (rtDesc?.get) {
    Object.defineProperty(XMLHttpRequest.prototype, "responseText", {
      configurable: true,
      enumerable: rtDesc.enumerable,
      get(this: XMLHttpRequest) {
        const xhr = this as XMLHttpRequest & { __owBoot?: boolean };
        if (xhr.__owBoot) {
          if (!patchedText.has(xhr)) {
            patchedText.set(xhr, patchBootJson(rtDesc.get!.call(xhr) as string));
          }
          return patchedText.get(xhr) as string;
        }
        return rtDesc.get!.call(xhr);
      },
    });
  }

  if (respDesc?.get) {
    Object.defineProperty(XMLHttpRequest.prototype, "response", {
      configurable: true,
      enumerable: respDesc.enumerable,
      get(this: XMLHttpRequest) {
        const xhr = this as XMLHttpRequest & { __owBoot?: boolean };
        if (!xhr.__owBoot) return respDesc.get!.call(xhr);
        if (xhr.responseType === "json") {
          try {
            return JSON.parse(patchBootJson(rtDesc!.get!.call(xhr) as string));
          } catch {
            return respDesc.get!.call(xhr);
          }
        }
        if (!xhr.responseType || xhr.responseType === "text" || xhr.responseType === "") {
          if (!patchedText.has(xhr)) {
            patchedText.set(xhr, patchBootJson(rtDesc!.get!.call(xhr) as string));
          }
          return patchedText.get(xhr) as string;
        }
        return respDesc.get!.call(xhr);
      },
    });
  }

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    ...rest: unknown[]
  ) {
    (this as XMLHttpRequest & { __owBoot?: boolean }).__owBoot = String(url).includes(
      "core.service.elfsight.com/p/boot",
    );
    return originalOpen.apply(this, [method, url, ...rest] as Parameters<typeof originalOpen>);
  };

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const res = await originalFetch(...args);
    try {
      const input = args[0];
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      if (!url.includes("core.service.elfsight.com/p/boot")) return res;
      const text = await res.clone().text();
      const patched = patchBootJson(text);
      if (patched === text) return res;
      return new Response(patched, {
        status: res.status,
        statusText: res.statusText,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return res;
    }
  };
}

/** Hide Elfsight chrome; keep feed for harvesting posts. */
const ELFSIGHT_THEME_CSS = `
  .es-header-container,
  .es-header-main-container,
  .es-carousel-arrow-control-container,
  .es-carousel-arrow-control,
  .swiper-pagination,
  .swiper-button-next,
  .swiper-button-prev,
  a[href*="elfsight.com"],
  [class*="WidgetTitle"],
  [class*="FreeLink"],
  [class*="eapps-widget-toolbar"],
  [class*="LoadMore"],
  [class*="Badge"],
  [class*="es-link-to-elfsight"],
  [class*="LinkToElfsight"],
  .es-card-1-hover-overlay,
  .es-card-toolbar-container,
  .es-card-text-container {
    display: none !important;
    pointer-events: none !important;
    opacity: 0 !important;
  }

  .es-widget-background-container,
  .es-widget-background-wrapper,
  .es-background-container,
  .es-background-base,
  .es-background-overlay,
  .es-widget-background-content {
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }
`;

function harvestPosts(shadow: ShadowRoot): IgPost[] {
  const posts: IgPost[] = [];
  const seen = new Set<string>();

  shadow.querySelectorAll<HTMLElement>(".es-card-container, [class*='InstagramCardContainer__Card']").forEach((card) => {
    const img = card.querySelector<HTMLImageElement>("img");
    const src = img?.currentSrc || img?.src || img?.getAttribute("data-src") || "";
    if (!src || seen.has(src)) return;
    seen.add(src);
    const link =
      card.closest("a")?.href ||
      card.querySelector("a")?.href ||
      PROFILE_URL;
    posts.push({ src, href: link });
  });

  return posts.slice(0, MAX_POSTS);
}

function forceSwiperToFour(shadow: ShadowRoot) {
  const swiperEl = shadow.querySelector(".swiper") as
    | (HTMLElement & {
        swiper?: {
          params: Record<string, unknown>;
          allowTouchMove: boolean;
          slides?: unknown[];
          update: () => void;
          slideTo: (i: number, speed?: number) => void;
          slideNext: (speed?: number) => void;
        };
      })
    | null;
  const sw = swiperEl?.swiper;
  if (!sw) return;

  sw.params.slidesPerView = 4;
  sw.params.slidesPerGroup = 1;
  sw.params.spaceBetween = 3;
  sw.params.allowTouchMove = false;
  sw.params.breakpoints = {
    0: { slidesPerView: 4, spaceBetween: 3 },
    320: { slidesPerView: 4, spaceBetween: 3 },
  };
  sw.params.grid = { rows: 2, fill: "row" };
  sw.allowTouchMove = false;
  try {
    sw.update();
  } catch {
    /* ignore */
  }

  // Nudge carousel to lazy-load remaining slides
  try {
    const total = Array.isArray(sw.slides) ? sw.slides.length : 8;
    for (let i = 0; i < Math.min(total, 8); i += 1) {
      sw.slideTo(i, 0);
    }
    sw.slideTo(0, 0);
  } catch {
    /* ignore */
  }
}

function injectTheme(shadow: ShadowRoot) {
  shadow.querySelectorAll('[id^="offwhite-elfsight-ig-theme"]').forEach((node) => {
    if (node.id !== STYLE_ID) node.remove();
  });
  let style = shadow.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    shadow.appendChild(style);
  }
  if (style.textContent !== ELFSIGHT_THEME_CSS) style.textContent = ELFSIGHT_THEME_CSS;
}

function hideElfsightBadges() {
  document
    .querySelectorAll<HTMLElement>(
      'a[href*="elfsight.com"], [class*="eapps-widget-toolbar"], [class*="ea-vertical"]',
    )
    .forEach((el) => {
      if (
        /elfsight|instagram feed widget/i.test(el.textContent || "") ||
        el.querySelector("a[href*='elfsight']")
      ) {
        el.style.setProperty("display", "none", "important");
      }
    });
}

function useElfsightInstagram(onPosts: (posts: IgPost[]) => void) {
  useEffect(() => {
    installBootPatch();

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${ELFSIGHT_SCRIPT}"]`,
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = ELFSIGHT_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    } else if (!(window as Window & { __owIgRemounted?: boolean }).__owIgRemounted) {
      (window as Window & { __owIgRemounted?: boolean }).__owIgRemounted = true;
      const holder = document.querySelector(".elfsight-feed");
      if (holder) {
        holder.innerHTML = "";
        const div = document.createElement("div");
        div.className = ELFSIGHT_APP_CLASS;
        holder.appendChild(div);
      }
      const eapps = (
        window as Window & {
          eapps?: { platform?: { resetWidget?: (id: string) => void; requireWidget?: (id: string) => void } };
        }
      ).eapps;
      try {
        eapps?.platform?.resetWidget?.(WIDGET_ID);
      } catch {
        /* ignore */
      }
      try {
        eapps?.platform?.requireWidget?.(WIDGET_ID);
      } catch {
        /* ignore */
      }
    }

    let best = 0;
    const sync = () => {
      hideElfsightBadges();
      document.querySelectorAll<HTMLElement>(".es-embed-root").forEach((root) => {
        const shadow = root.shadowRoot;
        if (!shadow) return;
        injectTheme(shadow);
        forceSwiperToFour(shadow);
        const posts = harvestPosts(shadow);
        if (posts.length > best) {
          best = posts.length;
          onPosts(posts);
        }
      });
    };

    sync();
    const observer = new MutationObserver(() => sync());
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = window.setInterval(sync, 500);
    const stop = window.setTimeout(() => window.clearInterval(timer), 45000);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(stop);
    };
  }, [onPosts]);
}

export function InstagramFeed() {
  const titleId = useId();
  const [posts, setPosts] = useState<IgPost[]>([]);
  useElfsightInstagram(setPosts);

  return (
    <section
      className="relative overflow-hidden bg-[var(--cream)] py-24 lg:py-32"
      aria-labelledby={titleId}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(184,138,82,0.1)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(ellipse,rgba(184,138,82,0.08)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal className="mb-16 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-4">
            <span className="block h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]/60" />
            <Instagram size={20} className="text-[var(--cocoa)]" />
            <span className="block h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]/60" />
          </div>

          <Eyebrow className="!mb-0 !tracking-[0.35em]">Follow Our Journey</Eyebrow>

          <h2
            id={titleId}
            className="mt-4 heading-section text-[clamp(2.4rem,4.5vw,3.8rem)] text-[var(--ink)]"
          >
            @offwhitegoa
          </h2>

          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--ink-muted)] lg:text-[0.95rem]">
            A glimpse of the room, the table, and the evenings —
            curated moments from our world.
          </p>

          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--cream-warm)] px-6 py-3 transition-all duration-400 hover:border-[var(--cocoa)]/40 hover:bg-[#EFE3D1]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-[2px]">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[var(--cream)] text-xs font-bold text-[var(--ink)]">
                OW
              </span>
            </span>
            <span className="flex flex-col items-start">
              <span className="text-sm font-semibold tracking-wide text-[var(--ink)] transition-colors group-hover:text-[var(--cocoa)]">
                offwhitegoa
              </span>
              <span className="text-[0.7rem] text-[var(--ink-muted)]">The Off White Bar & Grill</span>
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          {/* Stable 4×2 grid — same on mobile and desktop */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-4 gap-[3px] overflow-hidden rounded-2xl">
              {posts.map((post) => (
                <a
                  key={post.src}
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-[4/5] overflow-hidden bg-[var(--cream-warm)]"
                >
                  <img
                    src={post.src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-[3px] overflow-hidden rounded-2xl">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-[var(--cream-warm)]" />
              ))}
            </div>
          )}

          {/* Off-screen Elfsight source at desktop width so it loads the full 4×2 feed */}
          <div
            className="elfsight-feed pointer-events-none fixed top-0 left-[-10000px] h-[900px] w-[1280px] overflow-hidden opacity-0"
            aria-hidden
          >
            <div className={ELFSIGHT_APP_CLASS} data-elfsight-app-lazy />
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mt-14 text-center">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <Instagram size={16} aria-hidden className="mr-2" />
            Follow on Instagram
          </a>
        </Reveal>
      </div>
    </section>
  );
}
