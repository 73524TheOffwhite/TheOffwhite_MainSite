import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Dishes } from "@/components/sections/Dishes";
import { Space } from "@/components/sections/Space";
import { MenuAndReserve } from "@/components/sections/MenuAndReserve";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramFeed } from "@/components/sections/InstagramFeed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "The Off White — Fine Dining Navelim Goa | Crafted Cocktails, Global Soul",
      },
      {
        name: "description",
        content:
          "Where architecture meets cuisine. Best restaurant Margao area — fine dining Navelim Goa at The Off White Bar & Grill, South Goa.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Story />
      <Dishes />
      <Space />
      <MenuAndReserve />
      <Testimonials />
      <InstagramFeed />
    </>
  );
}
