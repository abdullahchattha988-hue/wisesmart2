export const SITE = {
  name: "Wise Mart",
  tagline: "Come Hungry. Leave Happy.",
  established: 2010,
  email: "info@wisemart2.com",
  website: "wisemart2.com",
  phones: ["+1 (410) 883-3648", "+1 (410) 943-6270"],
};

export const LOCATIONS = [
  {
    slug: "sharptown",
    name: "Sharptown",
    state: "MD",
    full: "Sharptown, MD",
    phone: "+1 (410) 883-3648",
    phoneHref: "tel:+14108833648",
    specialty: "Pizza · Chicken · Family Combos",
    tagline: "Our flagship — home of signature pizza and famous fried chicken.",
    hours: "Mon–Sun · 10:00 AM – 10:00 PM",
    address: "Main Street, Sharptown, MD 21861",
    mapsQuery: "Sharptown, MD 21861",
    accent: "primary" as const,
  },
  {
    slug: "east-new-market",
    name: "East New Market",
    state: "MD",
    full: "East New Market, MD",
    phone: "+1 (410) 943-6270",
    phoneHref: "tel:+14109436270",
    specialty: "Subs · Burgers · Hearty Meals",
    tagline: "Hearty, satisfying meals for working appetites.",
    hours: "Mon–Sun · 10:00 AM – 10:00 PM",
    address: "Main Street, East New Market, MD 21631",
    mapsQuery: "East New Market, MD 21631",
    accent: "gold" as const,
  },
  {
    slug: "vienna",
    name: "Vienna",
    state: "MD",
    full: "Vienna, MD",
    phone: "+1 (410) 883-3648",
    phoneHref: "tel:+14108833648",
    specialty: "Salads · Breakfast · Light Meals",
    tagline: "Fresh, light, and wholesome — start your day right.",
    hours: "Mon–Sun · 7:00 AM – 9:00 PM",
    address: "Main Street, Vienna, MD 21869",
    mapsQuery: "Vienna, MD 21869",
    accent: "dark" as const,
  },
];

export type LocationSlug = (typeof LOCATIONS)[number]["slug"];

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/locations", label: "Locations" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;
