import { useEffect, useId } from "react";
import { Instagram } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/Eyebrow";

const PROFILE_URL = "https://www.instagram.com/offwhitegoa?utm_source=qr";
const ELFSIGHT_SCRIPT = "https://elfsightcdn.com/platform.js";
const ELFSIGHT_APP_CLASS = "elfsight-app-381e755c-b01b-4de5-ad42-0ece4b460473";
const STYLE_ID = "offwhite-elfsight-ig-theme-v1";
const MAX_POSTS = 6;

/** Match Instagram grid: tight 2px gutters, sharp edges, 4:5 portrait tiles. */
const ELFSIGHT_THEME_CSS = `
  .es-widget-background-container,
  .es-widget-background-wrapper,
  .es-background-container,
  .es-background-base,
  .es-background-overlay,
  .es-widget-background-content {
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .es-widget-background-content,
  .es-widget-background-content > *,
  [class*="Layout__LayoutContainer"] {
    padding: 0 !important;
    margin: 0 !important;
    max-width: none !important;
    width: 100% !important;
  }

  .es-grid-layout,
  [class*="Grid__StyledGridLayout"],
  [class*="Grid__GridContainer"] {
    display: grid !important;
    width: 100% !important;
    max-width: none !important;
    gap: 2px !important;
    column-gap: 2px !important;
    row-gap: 2px !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  @media (min-width: 640px) {
    .es-grid-layout,
    [class*="Grid__StyledGridLayout"],
    [class*="Grid__GridContainer"] {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 2px !important;
      column-gap: 2px !important;
      row-gap: 2px !important;
    }
  }

  .es-card-container,
  .es-card-1-container,
  [class*="InstagramCardContainer__Card"] {
    border-radius: 0 !important;
    overflow: hidden !important;
    box-shadow: none !important;
    background: #000 !important;
    aspect-ratio: 4 / 5 !important;
    position: relative !important;
  }

  .es-card-media-container,
  .es-card-media,
  [class*="MediaContainer__Container"],
  [class*="MediaContainer__Inner"],
  [class*="MediaImage__Container"] {
    border-radius: 0 !important;
    overflow: hidden !important;
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    inset: 0 !important;
  }

  .es-card-media img,
  [class*="MediaImage"] img,
  .es-card-media-container img,
  .es-card-1-container img {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: cover !important;
    object-position: center center !important;
    border-radius: 0 !important;
    transform: none !important;
  }

  a[href*="elfsight.com"],
  [class*="WidgetTitle"],
  [class*="es-header"],
  [class*="FreeLink"],
  [class*="eapps-widget-toolbar"],
  [class*="LoadMore"],
  [class*="load-more"],
  [class*="Pagination"],
  [class*="es-pagination"],
  [class*="es-link-to-elfsight"],
  [class*="LinkToElfsight"],
  [class*="Badge"] {
    display: none !important;
  }
`;

function cardHasMedia(card: Element): boolean {
  const img = card.querySelector("img");
  if (img) {
    const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
    if (src) return true;
  }
  if (card.querySelector("video")) return true;
  const media = card.querySelector<HTMLElement>(
    ".es-card-media, [class*='MediaImage'], [class*='es-card-media-container']",
  );
  if (media) {
    const bg = getComputedStyle(media).backgroundImage;
    if (bg && bg !== "none") return true;
  }
  return false;
}

function pruneElfsightCards(shadow: ShadowRoot) {
  const grid =
    shadow.querySelector(".es-grid-layout") ||
    shadow.querySelector('[class*="Grid__StyledGridLayout"]') ||
    shadow.querySelector('[class*="Grid__GridContainer"]');
  if (!grid) return;

  const cards = [...grid.children] as HTMLElement[];
  let shown = 0;
  for (const card of cards) {
    const ok = cardHasMedia(card);
    if (ok && shown < MAX_POSTS) {
      card.style.removeProperty("display");
      shown += 1;
    } else {
      card.style.setProperty("display", "none", "important");
    }
  }
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

function useElfsightInstagram() {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${ELFSIGHT_SCRIPT}"]`,
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = ELFSIGHT_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }

    const syncWidget = () => {
      hideElfsightBadges();
      const roots = document.querySelectorAll<HTMLElement>(".es-embed-root");
      roots.forEach((root) => {
        const shadow = root.shadowRoot;
        if (!shadow) return;
        shadow.querySelectorAll('[id^="offwhite-elfsight-ig-theme"]').forEach((node) => {
          if (node.id !== STYLE_ID) node.remove();
        });
        let style = shadow.getElementById(STYLE_ID) as HTMLStyleElement | null;
        if (!style) {
          style = document.createElement("style");
          style.id = STYLE_ID;
          shadow.appendChild(style);
        }
        if (style.textContent !== ELFSIGHT_THEME_CSS) {
          style.textContent = ELFSIGHT_THEME_CSS;
        }
        pruneElfsightCards(shadow);
      });
    };

    syncWidget();
    const observer = new MutationObserver(() => syncWidget());
    observer.observe(document.body, { childList: true, subtree: true });

    const timer = window.setInterval(syncWidget, 400);
    const stop = window.setTimeout(() => window.clearInterval(timer), 20000);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(stop);
    };
  }, []);
}

export function InstagramFeed() {
  const titleId = useId();
  useElfsightInstagram();

  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      aria-labelledby={titleId}
      style={{ background: "linear-gradient(170deg, #1a1612 0%, #2a2318 40%, #1a1612 100%)" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(193,154,107,0.08)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(ellipse,rgba(193,154,107,0.06)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal className="mb-16 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-4">
            <span className="block h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]/60" />
            <Instagram size={20} className="text-[var(--gold)]/80" />
            <span className="block h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]/60" />
          </div>

          <Eyebrow className="!text-[var(--gold)] !mb-0 !tracking-[0.35em]">Follow Our Journey</Eyebrow>

          <h2
            id={titleId}
            className="mt-4 font-serif text-[clamp(2.4rem,4.5vw,3.8rem)] font-light tracking-wide text-white/95"
          >
            @offwhitegoa
          </h2>

          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/50 lg:text-[0.95rem]">
            A glimpse of the room, the table, and the evenings —
            curated moments from our world.
          </p>

          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3 backdrop-blur-sm transition-all duration-400 hover:border-[var(--gold)]/40 hover:bg-white/10"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-[2px]">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[#1a1612] text-xs font-bold text-white">
                OW
              </span>
            </span>
            <span className="flex flex-col items-start">
              <span className="text-sm font-semibold tracking-wide text-white/90 transition-colors group-hover:text-[var(--gold)]">
                offwhitegoa
              </span>
              <span className="text-[0.7rem] text-white/40">The Off White Bar & Grill</span>
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="elfsight-feed w-full min-h-[280px] overflow-hidden [&_.elfsight-app-381e755c-b01b-4de5-ad42-0ece4b460473]:!w-full">
            <div className={ELFSIGHT_APP_CLASS} data-elfsight-app-lazy />
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mt-14 text-center">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-10 py-4 text-sm font-semibold tracking-[0.2em] text-white uppercase transition-all duration-400 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(193,154,107,0.2)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] opacity-90 transition-opacity duration-400 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2.5">
              <Instagram size={18} aria-hidden />
              Follow on Instagram
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
