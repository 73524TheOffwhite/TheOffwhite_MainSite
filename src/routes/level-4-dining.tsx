import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { ReserveTableLink } from "@/components/ReserveTableLink";
import { level4Description } from "@/data/levels";
import { useLevel4Cms } from "@/lib/level4-cms";
import { cmsSrc } from "@/lib/cms-src";

import spaceLevel4Interior from "@/assets/space-level4-interior.jpg";
import spaceBrand from "@/assets/space-brand.jpg";
import kitchenBarLevel4 from "@/assets/kitchen-bar-level4.jpg";
import galleryL4Dining from "../offwhite images/ChatGPT Image Jun 19, 2026, 05_29_19 PM.jpg";
import galleryL4Lounge from "../offwhite images/ChatGPT Image Jun 19, 2026, 04_52_45 PM.jpg";
import galleryL4Bar from "../offwhite images/ChatGPT Image Jun 19, 2026, 04_49_41 PM.jpg";

export const Route = createFileRoute("/level-4-dining")({
  head: () => ({
    meta: [
      { title: "Level 4 — Fine Dining & Bar | The Off White" },
      {
        name: "description",
        content:
          "Level 4 at The Off White — slow dinners, crafted cocktails and conversations that deserve time.",
      },
      { property: "og:title", content: "Level 4 — Fine Dining & Bar" },
      {
        property: "og:description",
        content: "For conversations that deserve time.",
      },
    ],
  }),
  component: Level4Page,
});

const ease = [0.22, 1, 0.36, 1] as const;

function SunFlowerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
    >
      <circle cx="14" cy="14" r="4.5" />
      <line x1="14" y1="3" x2="14" y2="6" />
      <line x1="14" y1="22" x2="14" y2="25" />
      <line x1="3" y1="14" x2="6" y2="14" />
      <line x1="22" y1="14" x2="25" y2="14" />
      <line x1="6.2" y1="6.2" x2="8.4" y2="8.4" />
      <line x1="19.6" y1="19.6" x2="21.8" y2="21.8" />
      <line x1="21.8" y1="6.2" x2="19.6" y2="8.4" />
      <line x1="8.4" y1="19.6" x2="6.2" y2="21.8" />
    </svg>
  );
}

function CtaLink({
  label,
  onClick,
  to,
  hash,
}: {
  label: string;
  onClick?: () => void;
  to?: string;
  hash?: string;
}) {
  const className =
    "group inline-flex flex-col items-start gap-3 text-[9.5px] sm:text-[10px] uppercase tracking-[0.28em] font-semibold text-[var(--ink)] touch-manipulation";

  const inner = (
    <>
      <span className="block h-px w-10 bg-[var(--ink)]/25 transition-all duration-300 group-hover:w-14 group-hover:bg-[var(--gold)]" />
      <span className="inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-[var(--cocoa)]">
        {label}
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
        >
          →
        </span>
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} hash={hash} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

function ParallaxImage({
  src,
  alt,
  className = "",
  containerClassName = "",
}: {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden group ${containerClassName}`}>
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04] ${className}`}
        />
        ) : null}
      </motion.div>
    </div>
  );
}

function splitHref(href: string) {
  const [path, hash] = href.split("#");
  return { to: path || "/contact", hash };
}

function Level4Page() {
  const { data: cms, isPending } = useLevel4Cms();
  const scrollToDiscover = useCallback(() => {
    const target =
      document.getElementById("discover") ?? document.getElementById("discover-mobile");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const eyebrow = cms?.hero.eyebrow || "Level 4";
  const headline = cms?.hero.headline || "For conversations that deserve time.";
  const body =
    cms?.hero.body ||
    "The kind of evening you'll remember next year. Not because of what you ate. Because of who you shared it with.";
  const heroButton = cms?.hero.buttonLabel || "Explore Level 4";

  const dining = cms?.collage.find((s) => s.id === "dining");
  const brand = cms?.collage.find((s) => s.id === "brand");
  const bar = cms?.collage.find((s) => s.id === "bar");
  const diningSrc = cmsSrc(isPending, dining?.imageUrl, spaceLevel4Interior);
  const brandSrc = cmsSrc(isPending, brand?.imageUrl, spaceBrand);
  const barSrc = cmsSrc(isPending, bar?.imageUrl, kitchenBarLevel4);
  const diningAlt =
    dining?.alt || "Level 4 dining room with woven pendants, stone walls and neon sign";
  const brandAlt = brand?.alt || "Arched niches with sculptures and warm ambient lighting";
  const barAlt = bar?.alt || "Level 4 bar with bamboo slats and curved bottle display";

  const quoteLines = cms?.mood.quoteLines?.length
    ? cms.mood.quoteLines
    : ["The light changes.", "The mood changes.", "The evening unfolds."];
  const moodButton = cms?.mood.button || { label: "Discover More", href: "/contact#reserve" };
  const moodLink = splitHref(moodButton.href);

  return (
    <div className="overflow-x-hidden bg-[#F5F1E9]">
      <section className="pt-28 sm:pt-32 pb-0 lg:min-h-[calc(100svh-5rem)]">
        <div className="mx-auto max-w-[1440px]">
          {/* Desktop asymmetrical grid */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)_minmax(0,0.72fr)] lg:min-h-[calc(100svh-8rem)]">
            {/* Top left — hero copy */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease }}
              className="col-span-5 row-span-1 bg-[#F5F1E9] flex flex-col justify-center px-12 xl:px-16 2xl:px-20 py-16"
            >
              <p className="text-[10px] uppercase tracking-[0.34em] font-medium text-[var(--gold)]">
                {eyebrow}
              </p>

              <h1
                className="mt-6 heading-hero text-[var(--ink)] leading-[1.1] max-w-[340px]"
                style={{ fontSize: "clamp(2.4rem, 3.2vw, 3.5rem)" }}
              >
                {headline}
              </h1>

              <div className="mt-8 flex gap-8 items-stretch max-w-[360px]">
                <div className="w-px shrink-0 bg-[var(--ink)]/15 self-stretch min-h-[72px]" />
                <p className="text-[13px] sm:text-[13.5px] text-[var(--ink-muted)] leading-[1.95] pt-0.5">
                  {body}
                </p>
              </div>

              <div className="mt-10">
                <CtaLink label={heroButton} onClick={scrollToDiscover} />
              </div>
            </motion.div>

            {/* Top right — dining */}
            <motion.div
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.12, ease }}
              className="col-span-7 row-span-1 min-h-[420px]"
            >
              <ParallaxImage
                src={diningSrc}
                alt={diningAlt}
                containerClassName="h-full min-h-[420px]"
              />
            </motion.div>

            {/* Bottom left — decor niches */}
            <Reveal className="col-span-4 row-span-1 min-h-[300px]">
              <ParallaxImage
                src={brandSrc}
                alt={brandAlt}
                containerClassName="h-full min-h-[300px]"
              />
            </Reveal>

            {/* Bottom center — mood copy */}
            <Reveal
              delay={0.1}
              className="col-span-3 row-span-1 bg-[#F5F1E9] flex flex-col justify-center px-8 xl:px-10 py-10"
            >
              <div id="discover" className="scroll-mt-32">
                <div className="text-[var(--gold)] mb-6">
                  <SunFlowerIcon />
                </div>
                <p
                  className="font-serif text-[var(--ink)] leading-[1.35]"
                  style={{ fontSize: "clamp(1.35rem, 1.8vw, 1.75rem)" }}
                >
                  {quoteLines.map((line, i) => (
                    <span key={`${line}-${i}`}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </p>
                <div className="mt-8">
                  <CtaLink label={moodButton.label} to={moodLink.to} hash={moodLink.hash} />
                </div>
              </div>
            </Reveal>

            {/* Bottom right — bar */}
            <Reveal delay={0.15} className="col-span-5 row-span-1 min-h-[300px]">
              <ParallaxImage
                src={barSrc}
                alt={barAlt}
                containerClassName="h-full min-h-[300px]"
              />
            </Reveal>
          </div>

          {/* Mobile / tablet stacked layout */}
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="px-6 sm:px-8 py-10 sm:py-12 bg-[#F5F1E9]"
            >
              <p className="text-[10px] uppercase tracking-[0.34em] font-medium text-[var(--gold)]">
                {eyebrow}
              </p>
              <h1 className="mt-5 heading-hero text-[var(--ink)] text-[clamp(2rem,7vw,2.75rem)] leading-[1.12] max-w-[400px]">
                {headline}
              </h1>
              <div className="mt-7 flex gap-6 items-stretch">
                <div className="w-px shrink-0 bg-[var(--ink)]/15" />
                <p className="text-[13.5px] text-[var(--ink-muted)] leading-[1.92]">
                  {body}
                </p>
              </div>
              <div className="mt-8">
                <CtaLink label={heroButton} onClick={scrollToDiscover} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease }}
              className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden group"
            >
              <img
                src={diningSrc}
                alt={dining?.alt || "Level 4 dining room"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.3s] group-hover:scale-[1.03]"
                loading="eager"
              />
            </motion.div>

            <Reveal>
              <div className="relative aspect-square sm:aspect-[5/4] overflow-hidden group">
                <img
                  src={brandSrc}
                  alt={brand?.alt || "Decorative arched niches"}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.3s] group-hover:scale-[1.03]"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div id="discover-mobile" className="scroll-mt-32 px-6 sm:px-8 py-12 bg-[#F5F1E9]">
                <div className="text-[var(--gold)] mb-5">
                  <SunFlowerIcon />
                </div>
                <p className="font-serif text-[var(--ink)] text-[clamp(1.4rem,5vw,1.85rem)] leading-[1.35]">
                  {quoteLines.map((line, i) => (
                    <span key={`${line}-${i}`}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </p>
                <div className="mt-8">
                  <CtaLink label={moodButton.label} to={moodLink.to} hash={moodLink.hash} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative aspect-[4/3] overflow-hidden group">
                <img
                  src={barSrc}
                  alt={bar?.alt || "Level 4 bar"}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.3s] group-hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Level4Story />
      <Level4LingerStrip />
      <Level4EveningClose />
    </div>
  );
}

function Level4Story() {
  const { data: cms } = useLevel4Cms();
  const eyebrow = cms?.story.eyebrow || level4Description.eyebrow;
  const title = cms?.story.title || level4Description.title;
  const intro = cms?.story.intro || level4Description.intro;
  const paragraphs =
    cms?.story.paragraphs?.length ? cms.story.paragraphs : level4Description.paragraphs;
  const features = cms?.story.features?.length
    ? cms.story.features.map((f) => f.label)
    : level4Description.features;

  return (
    <section className="bg-[#F5F1E9] px-6 sm:px-8 lg:px-12 pt-20 pb-14 lg:pt-28 lg:pb-16">
      <div className="mx-auto max-w-[1080px]">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.34em] font-medium text-[var(--gold)]">
            {eyebrow}
          </p>
          <h2
            className="mt-5 font-serif text-[var(--ink)] leading-[1.18]"
            style={{ fontSize: "clamp(1.7rem, 3vw, 2.6rem)" }}
          >
            {title}
          </h2>
          <p className="mt-7 text-[15px] sm:text-base text-[var(--ink-muted)] leading-[1.95] max-w-[760px]">
            {intro}
          </p>
        </Reveal>

        <div className="mt-10 space-y-6 max-w-[760px]">
          {paragraphs.map((para, i) => (
            <Reveal key={i} delay={0.05 + i * 0.04}>
              <p className="text-[14.5px] sm:text-[15px] text-[var(--ink-muted)] leading-[1.95]">
                {para}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap gap-3">
            {features.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/15 bg-white/40 px-4 py-2 text-[10.5px] uppercase tracking-[0.2em] font-medium text-[var(--ink)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                {f}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const lingerMoments = [
  {
    label: "The Dining Room",
    src: galleryL4Dining,
    alt: "Candlelit Level 4 dining table with woven pendants",
  },
  {
    label: "The Lounge",
    src: galleryL4Lounge,
    alt: "Level 4 lounge corner with rattan chair and pendant light",
  },
  {
    label: "The Bar",
    src: galleryL4Bar,
    alt: "Level 4 bar with bamboo cladding and warm bottle display",
  },
] as const;

function WavyLine({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="72"
      height="12"
      viewBox="0 0 72 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M0 6 Q9 1 18 6 T36 6 T54 6 T72 6" />
    </svg>
  );
}

/* Soft arched moments — gallery Level 4 photos */
function Level4LingerStrip() {
  return (
    <section className="relative bg-[#F5F1E9] pt-6 pb-20 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-10">
        <Reveal>
          <div className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-[var(--gold)]">
                Inside Level 4
              </p>
              <h3 className="heading-section mt-4 text-[clamp(1.7rem,3.2vw,2.45rem)] leading-[1.18] text-[var(--ink)]">
                Linger a little longer
              </h3>
            </div>
            <div className="mt-5 max-w-sm lg:mt-0 lg:pb-1 lg:text-right">
              <p className="text-[13.5px] leading-[1.85] text-[var(--ink-muted)]">
                Soft light, woven shadows, and rooms that invite you to stay.
              </p>
              <div className="mt-4 flex justify-center text-[var(--gold)]/70 lg:justify-end">
                <WavyLine />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-3 items-end gap-3 sm:gap-5 lg:gap-7">
          {lingerMoments.map((m, i) => {
            const heightClass =
              i === 1
                ? "aspect-[2/3.15] sm:aspect-[2/3.35]"
                : i === 0
                  ? "aspect-[2/2.7] sm:aspect-[2/2.85]"
                  : "aspect-[2/2.55] sm:aspect-[2/2.7]";

            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                className="flex flex-col items-center gap-3.5"
              >
                <Link
                  to="/gallery"
                  search={{ cat: "Level 4" }}
                  aria-label={`View Level 4 gallery — ${m.label}`}
                  className={`group relative block w-full cursor-pointer overflow-hidden arch-top ${heightClass}`}
                >
                  <img
                    src={m.src}
                    alt={m.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 hidden translate-y-1 flex-col items-center px-2 pb-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:flex sm:pb-5">
                    <span className="mb-2 h-px w-6 bg-[var(--gold)]" />
                    <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white sm:text-[9px]">
                      {m.label}
                    </p>
                  </div>
                </Link>
                <p className="text-[8.5px] uppercase tracking-[0.2em] text-[var(--ink-muted)] sm:hidden">
                  {m.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cream arch melting into the evening close */}
      <div className="pointer-events-none absolute -bottom-px left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: "clamp(48px, 6vw, 80px)" }}
        >
          <path
            d="M0,0 L1440,0 L1440,28 Q1080,80 720,52 Q360,18 0,64 Z"
            fill="#F5F1E9"
          />
        </svg>
      </div>
    </section>
  );
}

/* Cinematic close — quieter twin to Level 5 golden hour */
function Level4EveningClose() {
  const { data: cms, isPending } = useLevel4Cms();
  const bar = cms?.collage.find((s) => s.id === "bar");
  const dining = cms?.collage.find((s) => s.id === "dining");
  const backgroundSrc = cmsSrc(
    isPending,
    bar?.imageUrl || dining?.imageUrl,
    kitchenBarLevel4,
  );
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative min-h-[560px] overflow-hidden lg:min-h-[640px]">
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        {backgroundSrc ? (
          <img
            src={backgroundSrc}
            alt={bar?.alt || dining?.alt || "Evening light across Level 4"}
            className="h-full w-full scale-105 object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/48" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/25" />
      </motion.div>

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-24 sm:py-28 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-32">
        <Reveal>
          <div className="mb-5 text-[var(--gold)]">
            <SunFlowerIcon />
          </div>
          <h2 className="heading-section text-[clamp(2.1rem,4.6vw,3.7rem)] font-normal leading-[1.06] text-white">
            The evening
            <br />
            is waiting.
          </h2>
          <p className="mt-6 max-w-[340px] text-[13.5px] leading-[1.95] text-white/72">
            Slow dinners. Soft light. Conversations that deserve time — and a table of their own.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[9.5px] font-semibold uppercase tracking-[0.24em] text-white/55">
            <li>Dinner</li>
            <li className="text-[var(--gold)]/80">·</li>
            <li>Cocktails</li>
            <li className="text-[var(--gold)]/80">·</li>
            <li>Conversation</li>
          </ul>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="rounded-2xl bg-[#F5F1E9] px-7 py-9 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.45)] sm:px-9 sm:py-10">
            <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[var(--ink-muted)]">
              Reserve your evening
            </p>
            <div className="mt-5 h-px w-10 bg-[var(--gold)]" />
            <p className="mt-5 max-w-sm text-[13.5px] leading-[1.9] text-[var(--ink-muted)]">
              Join us on Level 4 for an unhurried night — crafted plates, considered pours, and
              company that stays with you.
            </p>
            <ReserveTableLink className="btn-outline mt-8 w-full sm:w-auto">
              Reserve a Table
            </ReserveTableLink>
            <p
              className="mt-6 text-[1.25rem] text-[var(--cocoa)]"
              style={{ fontFamily: "Allura, cursive" }}
            >
              We look forward to hosting you.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
