import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ReserveTableLink } from "@/components/ReserveTableLink";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/Eyebrow";
import dining from "@/assets/Gemini_Generated_Image_nwgy8znwgy8znwgy.jpg";
import menuHeroMobile from "@/assets/hero_menu_image/menu-hero-mobile-04-kitchen-background.jpg";
import { cmsSrc } from "@/lib/cms-src";
import { useMenuCms } from "@/lib/menu-cms";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — The Off White" },
      { name: "description", content: "An illustrated menu of signature plates, with full detail on every dish." },
    ],
  }),
  component: MenuPage,
});

type Dish = {
  id: string;
  name: string;
  image: string;
};

const menuImages = import.meta.glob(
  "/src/assets/menu/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
) as Record<string, string>;

const FALLBACK_DISHES: Dish[] = Object.entries(menuImages).map(([path, image]) => {
  const fileName = path.split("/").pop() ?? "";

  const name = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    id: fileName,
    name,
    image,
  };
});

function HeroTitle({ headline }: { headline: string }) {
  const lines = headline
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) return <>{headline}</>;
  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

function MenuPage() {
  const { data, isPending } = useMenuCms();
  const [selected, setSelected] = useState<Dish | null>(null);

  const localByFile = useMemo(() => {
    const map = new Map<string, string>();
    for (const dish of FALLBACK_DISHES) map.set(dish.id, dish.image);
    return map;
  }, []);

  const dishes = useMemo(() => {
    const cmsDishes = data?.dishes;
    if (!cmsDishes?.length) return FALLBACK_DISHES;
    return cmsDishes
      .map((dish) => {
        const fileKey = dish.imageName || dish.id;
        const bundled = localByFile.get(fileKey) || localByFile.get(dish.id);
        const image = dish.imageUrl || bundled;
        if (!image) return null;
        return {
          id: dish.id,
          name: dish.name || FALLBACK_DISHES.find((d) => d.id === dish.id)?.name || dish.id,
          image,
        } satisfies Dish;
      })
      .filter((dish): dish is Dish => Boolean(dish));
  }, [data?.dishes, localByFile]);

  const heroEyebrow = data?.hero.eyebrow || "The Visual Menu";
  const heroHeadline = data?.hero.headline || "Made slowly,\nserved generously.";
  const heroDescription =
    data?.hero.description ||
    "Every plate, photographed and detailed. Tap any dish to read its full story.";
  const heroCrumb = data?.hero.breadcrumb || "Menu";
  const heroImage = cmsSrc(isPending, data?.hero.imageUrl, dining);
  const heroMobileImage = cmsSrc(isPending, data?.hero.mobileImageUrl, menuHeroMobile);

  const selectionEyebrow = data?.selection.eyebrow || "The Selection";
  const selectionHeadline = data?.selection.headline || "Choose your chapter";
  const selectionIntro = data?.selection.intro || "The heart of the table";

  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selected]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <PageHero
        eyebrow={heroEyebrow}
        title={<HeroTitle headline={heroHeadline} />}
        description={heroDescription}
        image={heroImage || dining}
        mobileImage={heroMobileImage || menuHeroMobile}
        crumb={heroCrumb}
        imageClassName="object-[62%_center]"
      />

      <section className="bg-[var(--cream)] pt-20 lg:pt-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <Reveal className="text-center">
            <Eyebrow>{selectionEyebrow}</Eyebrow>
            <h2 className="heading-section mt-4 text-[clamp(2rem,3.6vw,3rem)] text-[var(--ink)]">
              {selectionHeadline}
            </h2>
            <p className="mt-3 italic text-[var(--ink-muted)] font-serif">{selectionIntro}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--cream)] pt-12 pb-24 lg:pb-32">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <motion.div
            layout
            className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {dishes.map((d, i) => (
                <motion.button
                  layout
                  key={d.id}
                  onClick={() => setSelected(d)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  className="group text-left cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg bg-[var(--cream-warm)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_30px_60px_-25px_rgba(43,33,24,0.35)] group-hover:scale-[1.02]">
                    <img
                      src={d.image}
                      alt={d.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--ink)]/45 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                    >
                      <span className="border border-white/70 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
                        Order now
                      </span>
                    </div>
                  </div>
                  <div className="mt-5">
                    <h3 className="font-serif text-lg sm:text-xl text-[var(--ink)] leading-snug">{d.name}</h3>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="mt-16 text-center">
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ReserveTableLink className="btn-outline">Reserve a Table</ReserveTableLink>
              <a
                href="https://airmenus.in/theoffwhitebarandgrill/order"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Full Menu
              </a>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-md" />

            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative w-full max-w-5xl max-h-[92svh] overflow-hidden bg-[var(--cream)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.55)] rounded-sm"
            >
              {/* Gold filigree border */}
              <div className="pointer-events-none absolute inset-2 sm:inset-3 border border-[var(--gold)]/50" />
              <div className="pointer-events-none absolute inset-3 sm:inset-4 border border-[var(--gold)]/20" />

              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 grid place-items-center w-9 h-9 rounded-full bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--cocoa)] hover:text-white transition-colors shadow"
              >
                <X size={16} />
              </button>

              <div className="grid md:grid-cols-2 max-h-[92svh] overflow-y-auto">
                <div className="relative bg-[var(--cream-warm)] p-5 sm:p-7">
                  <div className="overflow-hidden rounded-md">
                    <motion.img
                      initial={{ scale: 1.06 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      src={selected.image}
                      alt={selected.name}
                      className="w-full h-[280px] sm:h-[420px] md:h-full md:max-h-[72svh] object-cover"
                    />
                  </div>
                </div>

                <div className="p-7 sm:p-10 lg:p-12 flex flex-col">
                  <Eyebrow>The Off White</Eyebrow>
                  <h3 className="mt-3 font-serif text-3xl sm:text-4xl text-[var(--ink)] leading-tight">
                    {selected.name}
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="h-px w-10 bg-[var(--gold)]" />
                  </div>

                  <div className="mt-7 space-y-5 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--cocoa)] font-semibold"></p>
                    </div>
                    <div className="h-px bg-[var(--border)]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--cocoa)] font-semibold"></p>
                    </div>
                    <div className="h-px bg-[var(--border)]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--cocoa)] font-semibold"></p>
                    </div>
                  </div>

                  <div className="mt-9">
                    <a
                      href="https://airmenus.in/theoffwhitebarandgrill/order"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setSelected(null)}
                      className="btn-primary"
                    >
                      Place order
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
