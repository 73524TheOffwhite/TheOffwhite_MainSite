import { createFileRoute } from "@tanstack/react-router";
import { ReservationsPage } from "@/components/ReservationsPage";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      {
        title:
          "Reservations — Fine Dining Navelim Goa | Events Venue South Goa",
      },
      {
        name: "description",
        content:
          "Reserve your table at The Off White Bar & Grill in Navelim, Margao. Book Level 4 fine dining or Level 5 events venue South Goa.",
      },
      {
        property: "og:title",
        content: "Reservations — The Off White | Navelim, Margao",
      },
      {
        property: "og:description",
        content:
          "Book fine dining or an events venue in South Goa — Level 4 and Level 5 at The Off White.",
      },
    ],
  }),
  component: ReservationsPage,
});
