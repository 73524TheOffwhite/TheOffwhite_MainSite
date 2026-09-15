/** Local SEO structured data for Google (not shown on page). */
export const RESTAURANT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "The Off White Bar & Grill",
  alternateName: "The Off White",
  url: "https://theoffwhite.com",
  description:
    "Fine dining restaurant and events venue in Navelim, Margao, South Goa — crafted cocktails, Level 4 dining and Level 5 celebrations.",
  telephone: "+918767811778",
  email: "info@theoffwhite.com",
  servesCuisine: ["Global", "Mediterranean", "Indian", "Bar"],
  priceRange: "$$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Sitara Atrium, 4th Floor, Sitara Building, Colmorod, Navelim Highway, Sanscar Society",
    addressLocality: "Navelim, Margao",
    addressRegion: "Goa",
    postalCode: "403601",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 15.2619293,
    longitude: 73.9632973,
  },
  hasMap: "https://maps.app.goo.gl/jvHLryG1k2ZpDUfQ6",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "12:00",
      closes: "23:00",
    },
  ],
  sameAs: [
    "https://www.google.com/maps/place/The+Off+White+Bar+%26+Grill/@15.2619293,73.9632973,17z",
  ],
} as const;
