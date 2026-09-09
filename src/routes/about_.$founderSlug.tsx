import { useEffect, type CSSProperties } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  founderProfiles,
  founderSlug,
  getFounderBySlug,
  getFounderNeighbors,
} from "@/data/founder-story";
import { Eyebrow } from "@/components/Eyebrow";
import { ReserveTableLink } from "@/components/ReserveTableLink";

export const Route = createFileRoute("/about_/$founderSlug")({
  loader: ({ params }) => {
    const profile = getFounderBySlug(params.founderSlug);
    if (!profile) throw notFound();
    const neighbors = getFounderNeighbors(params.founderSlug);
    return { profile, neighbors };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.profile.name ?? "Founder";
    const role = loaderData?.profile.role ?? "";
    return {
      meta: [
        { title: `${name} — The Off White` },
        {
          name: "description",
          content: role
            ? `${name}, ${role} at The Off White Bar & Grill in Navelim, South Goa.`
            : `Meet ${name} of The Off White Bar & Grill.`,
        },
        { property: "og:title", content: `${name} — The Off White` },
        {
          property: "og:description",
          content: role
            ? `${name}, ${role} at The Off White Bar & Grill.`
            : `Meet ${name} of The Off White Bar & Grill.`,
        },
      ],
    };
  },
  component: FounderDetailPage,
});

const ease = [0.22, 1, 0.36, 1] as const;

function FounderDetailPage() {
  const { profile, neighbors } = Route.useLoaderData();
  const index = neighbors.index;
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [profile.name]);

  return (
    <div className="bg-[var(--cream)]">
      <section className="relative overflow-hidden border-b border-[var(--border)]/60 bg-[var(--cream-warm)]">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(184,138,82,0.12),transparent_70%)]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(184,138,82,0.1),transparent_70%)]" />

        <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-28 lg:px-10 lg:pb-24 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--cocoa)] transition-colors hover:text-[var(--gold)]"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-500 group-hover:-translate-x-1"
                aria-hidden
              />
              Back to Our Story
            </Link>
          </motion.div>

          <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.08 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-md bg-[var(--cream)] shadow-[0_28px_80px_-48px_rgba(43,33,24,0.55)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {profile.imageUrl ? (
                    <motion.img
                      key={profile.imageUrl}
                      src={profile.imageUrl}
                      alt={profile.name}
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.4, ease }}
                      className="founder-card-photo absolute inset-0 h-full w-full object-cover"
                      style={
                        {
                          "--founder-mobile-pos": profile.mobileObjectPosition ?? "center 12%",
                          "--founder-desktop-pos": profile.desktopObjectPosition ?? "center top",
                        } as CSSProperties
                      }
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--cream)]">
                      <span className="font-serif text-6xl tracking-[0.08em] text-[var(--gold)]/40">
                        {initials}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>

            <div className="lg:pt-4">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease, delay: 0.18 }}
              >
                <Eyebrow>The People Behind The Off White</Eyebrow>
              </motion.div>

              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease, delay: 0.26 }}
                className="mt-6 block font-serif italic text-[2rem] leading-none text-[var(--gold)] sm:text-[2.35rem]"
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease, delay: 0.34 }}
                className="mt-3 h-px w-14 origin-left bg-[var(--gold)]/60"
              />

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease, delay: 0.38 }}
                className="heading-section mt-5 text-[clamp(2.4rem,4.8vw,4rem)] leading-[1.08] text-[var(--ink)]"
              >
                {profile.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.48 }}
                className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--cocoa)]"
              >
                {profile.role}
              </motion.p>

              <div className="mt-10 space-y-6">
                {profile.paragraphs.map((paragraph, i) => (
                  <motion.p
                    key={`${profile.name}-${i}`}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.75, ease, delay: Math.min(i * 0.06, 0.3) }}
                    className="text-[15px] leading-[1.95] text-[var(--ink-muted)] sm:text-[16px] sm:leading-[1.95]"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-14 lg:px-10 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col gap-6 border-t border-[var(--border)]/70 pt-10 sm:flex-row sm:items-stretch sm:justify-between"
        >
          {neighbors.prev ? (
            <Link
              to="/about/$founderSlug"
              params={{ founderSlug: founderSlug(neighbors.prev.name) }}
              className="group flex min-w-0 flex-1 flex-col gap-2 rounded-md border border-transparent px-1 py-2 transition-colors hover:border-[var(--border)]/80 hover:bg-[var(--cream-warm)]/80 sm:px-4"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">
                <ArrowLeft size={13} className="transition-transform duration-500 group-hover:-translate-x-1" />
                Previous
              </span>
              <span className="heading-section text-[clamp(1.35rem,2.4vw,1.85rem)] text-[var(--ink)] transition-colors group-hover:text-[var(--cocoa)]">
                {neighbors.prev.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--cocoa)]">
                {neighbors.prev.role}
              </span>
            </Link>
          ) : (
            <div className="hidden flex-1 sm:block" />
          )}

          {neighbors.next ? (
            <Link
              to="/about/$founderSlug"
              params={{ founderSlug: founderSlug(neighbors.next.name) }}
              className="group flex min-w-0 flex-1 flex-col gap-2 rounded-md border border-transparent px-1 py-2 text-right transition-colors hover:border-[var(--border)]/80 hover:bg-[var(--cream-warm)]/80 sm:items-end sm:px-4"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">
                Next
                <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
              <span className="heading-section text-[clamp(1.35rem,2.4vw,1.85rem)] text-[var(--ink)] transition-colors group-hover:text-[var(--cocoa)]">
                {neighbors.next.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--cocoa)]">
                {neighbors.next.role}
              </span>
            </Link>
          ) : (
            <div className="hidden flex-1 sm:block" />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/" className="btn-outline">
            Back Home
          </Link>
          <ReserveTableLink className="btn-outline">Reserve a Table</ReserveTableLink>
        </motion.div>

        <p className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          {index + 1} of {founderProfiles.length}
        </p>
      </section>
    </div>
  );
}
