import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { LOCATIONS, SITE } from "@/data/site";
import bannerImg from "@/assets/banner-5.webp";
import imgSharptown from "@/assets/sharpown.webp";
import imgEastNew from "@/assets/east-new.webp";
import imgVienna from "@/assets/vienna.webp";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      {
        title: "Locations - Wise Mart | Sharptown - East New Market - Vienna, MD",
      },
      {
        name: "description",
        content:
          "Find your nearest Wise Mart. Three Maryland locations with hours, phone numbers, and directions.",
      },
      { property: "og:title", content: "Wise Mart Locations" },
      {
        property: "og:description",
        content: "Three Maryland kitchens. One promise.",
      },
    ],
  }),
  component: LocationsPage,
});

type SiteLocation = (typeof LOCATIONS)[number];
type DetailIcon = ComponentType<{ style?: CSSProperties; className?: string }>;

type LocationSeed = {
  slug: "sharptown" | "east-new-market" | "vienna";
  fallbackName: string;
  fallbackAddress: string;
  fallbackPhone: string;
  fallbackPhoneHref: string;
  fallbackHours: string;
  fallbackSpecialty: string;
  fallbackTagline: string;
  photo: string;
  accentAngle: string;
  spotlight: string;
};

type LocationCardData = {
  slug: LocationSeed["slug"];
  name: string;
  index: number;
  state: string;
  address: string;
  phone: string;
  phoneHref: string;
  hours: string;
  specialty: string;
  tagline: string;
  photo: string;
  mapsUrl: string;
  directionsUrl: string;
  accentAngle: string;
  spotlight: string;
};

const LOCATION_SEEDS: readonly LocationSeed[] = [
  {
    slug: "sharptown",
    fallbackName: "Sharptown",
    fallbackAddress: "806 Main St, Sharptown, MD 21861",
    fallbackPhone: "(410) 883-3648",
    fallbackPhoneHref: "tel:+14108833648",
    fallbackHours: "Sun-Thu 10 AM-10 PM / Fri-Sat 10 AM-11 PM",
    fallbackSpecialty: "Fresh Dough Pizza / Fried Chicken",
    fallbackTagline:
      "Our flagship kitchen - hand-stretched pizza and famous double-fried chicken, made fresh every day since 2010.",
    photo: imgSharptown,
    accentAngle: "135deg",
    spotlight: "Flagship kitchen",
  },
  {
    slug: "east-new-market",
    fallbackName: "East New Market",
    fallbackAddress: "5703 Mt Holly Rd, East New Market, MD 21631",
    fallbackPhone: "(410) 943-6270",
    fallbackPhoneHref: "tel:+14109436270",
    fallbackHours: "Sun-Thu 10 AM-10 PM / Fri-Sat 10 AM-11 PM",
    fallbackSpecialty: "Hot Subs / Combo Meals",
    fallbackTagline:
      "Hearty subs, hot sandwiches, and generous combo meals built for the whole crew.",
    photo: imgEastNew,
    accentAngle: "225deg",
    spotlight: "Big subs and combos",
  },
  {
    slug: "vienna",
    fallbackName: "Vienna",
    fallbackAddress: "307 Ocean Gateway, Vienna, MD 21869",
    fallbackPhone: "(410) 376-3299",
    fallbackPhoneHref: "tel:+14103763299",
    fallbackHours: "Sun-Thu 10 AM-10 PM / Fri-Sat 10 AM-11 PM",
    fallbackSpecialty: "Fresh Salads / Breakfast",
    fallbackTagline:
      "Fresh salads, breakfast plates, and lighter fare - served with the same Wise Mart care.",
    photo: imgVienna,
    accentAngle: "315deg",
    spotlight: "Breakfast and lighter fare",
  },
] as const;

function buildMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function buildDirectionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

const LOCATION_DATA: readonly LocationCardData[] = LOCATION_SEEDS.map((seed, index) => {
  const base = LOCATIONS.find((loc) => loc.slug === seed.slug) as SiteLocation | undefined;
  const address = base?.address ?? seed.fallbackAddress;

  return {
    slug: seed.slug,
    name: base?.name ?? seed.fallbackName,
    index: index + 1,
    state: "MD",
    address,
    phone: base?.phone ?? seed.fallbackPhone,
    phoneHref: base?.phoneHref ?? seed.fallbackPhoneHref,
    hours: base?.hours ?? seed.fallbackHours,
    specialty: base?.specialty ?? seed.fallbackSpecialty,
    tagline: base?.tagline ?? seed.fallbackTagline,
    photo: seed.photo,
    mapsUrl: buildMapsUrl(address),
    directionsUrl: buildDirectionsUrl(address),
    accentAngle: seed.accentAngle,
    spotlight: seed.spotlight,
  };
});

function useTilt(strength = 6) {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [strength, -strength]),
    { stiffness: 320, damping: 32 },
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-strength, strength]),
    { stiffness: 320, damping: 32 },
  );
  const scale = useSpring(1, { stiffness: 320, damping: 28 });

  const onMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (shouldReduceMotion) return;

      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - rect.left) / rect.width - 0.5);
      y.set((event.clientY - rect.top) / rect.height - 0.5);
      scale.set(1.018);
    },
    [scale, shouldReduceMotion, x, y],
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [scale, x, y]);

  return { shouldReduceMotion, rotateX, rotateY, scale, onMove, onLeave };
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.75 });
  const [value, setValue] = useState(shouldReduceMotion ? to : 0);

  useEffect(() => {
    if (shouldReduceMotion || !inView) return;

    let current = 0;
    const step = Math.max(1, Math.ceil(to / 38));
    const timer = window.setInterval(() => {
      current += step;
      if (current >= to) {
        setValue(to);
        window.clearInterval(timer);
        return;
      }
      setValue(current);
    }, 36);

    return () => window.clearInterval(timer);
  }, [inView, shouldReduceMotion, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function DetailRow({
  icon: Icon,
  children,
  href,
}: {
  icon: DetailIcon;
  children: ReactNode;
  href?: string;
}) {
  const content = href ? (
    <a href={href} className="wml-detail-link">
      {children}
    </a>
  ) : (
    <span>{children}</span>
  );

  return (
    <li className="wml-detail-row">
      <Icon style={{ width: 14, height: 14 }} />
      {content}
    </li>
  );
}

function HeroParticles() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div className="wml-particles" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, index) => (
        <motion.div
          key={index}
          className="wml-particle"
          style={{
            width: index % 3 === 0 ? 3 : 1.8,
            height: index % 3 === 0 ? 3 : 1.8,
            background: index % 4 === 0 ? "#c8590a" : "rgba(240,235,228,0.09)",
            left: `${5 + ((index * 5.3) % 90)}%`,
            top: `${10 + ((index * 7.7) % 80)}%`,
            boxShadow: index % 4 === 0 ? "0 0 6px rgba(200,89,10,0.6)" : "none",
          }}
          animate={{ y: [0, -28, 0], opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 3.2 + (index % 4) * 0.6,
            delay: index * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function LocationCard({ loc, index }: { loc: LocationCardData; index: number }) {
  const { shouldReduceMotion, rotateX, rotateY, scale, onMove, onLeave } = useTilt(4);
  const flip = index % 2 !== 0;

  return (
    <motion.div
      className="wml-card-wrap"
      role="listitem"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 56, scale: 0.95 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.article
        id={`loc-${loc.slug}`}
        className={`wml-card${flip ? " wml-card--flip" : ""}`}
        style={
          shouldReduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                scale,
                transformStyle: "preserve-3d",
                perspective: 1100,
              }
        }
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        aria-label={`Wise Mart ${loc.name} location`}
      >
        <div
          className="wml-card__edge"
          style={{
            background: `linear-gradient(${loc.accentAngle}, rgba(200,89,10,0.85) 0%, rgba(232,160,48,0.45) 42%, transparent 88%)`,
          }}
        />

        <div
          className="wml-card__glow"
          style={{
            background: `radial-gradient(ellipse 70% 60% at ${flip ? "100%" : "0%"} 50%, rgba(200,89,10,0.09) 0%, transparent 65%)`,
          }}
        />

        <div className="wml-photo">
          <img
            src={loc.photo}
            alt={`Wise Mart ${loc.name}`}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          <div className="wml-photo__scrim" />

          <a
            href={loc.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="wml-photo__pin"
            aria-label={`View ${loc.name} on Google Maps`}
          >
            <MapPin style={{ width: 18, height: 18 }} />
          </a>

          <span className="wml-photo__watermark" aria-hidden="true">
            0{loc.index}
          </span>

          <div className="wml-photo__ribbon">
            <span>{loc.specialty}</span>
          </div>
        </div>

        <div className="wml-info">
          <div className="wml-info__meta">
            <span className="wml-info__num">Location 0{loc.index}</span>
            <span className="wml-info__state">{loc.state}</span>
          </div>

          <h2 className="wml-info__name">{loc.name}</h2>

          <div className="wml-info__rule" />

          <p className="wml-info__tagline">{loc.tagline}</p>

          <div className="wml-info__spotlight">{loc.spotlight}</div>

          <ul className="wml-detail-list" aria-label="Location details">
            <DetailRow icon={MapPin}>{loc.address}</DetailRow>
            <DetailRow icon={Clock}>{loc.hours}</DetailRow>
            <DetailRow icon={Phone} href={loc.phoneHref}>
              {loc.phone}
            </DetailRow>
          </ul>

          <div className="wml-info__actions">
            <a href={loc.phoneHref} className="wml-btn-primary">
              <Phone style={{ width: 13, height: 13 }} />
              Call Now
            </a>

            <a
              href={loc.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wml-btn-outline"
            >
              <Navigation style={{ width: 13, height: 13 }} />
              Directions
              <ExternalLink style={{ width: 11, height: 11, opacity: 0.55 }} />
            </a>

            <Link
              to="/menu/$location"
              params={{ location: loc.slug }}
              className="wml-btn-amber"
            >
              View Menu
              <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

function LocationsPage() {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "20%"],
  );
  const bgOpacity = useTransform(scrollYProgress, [0, 0.88], [1, 0]);
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1, 1.08],
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "28%"],
  );

  const establishedYear = Number(SITE.established ?? 2010) || 2010;
  const yearsServing = Math.max(1, new Date().getFullYear() - establishedYear);

  const heroStats = [
    { value: String(LOCATION_DATA.length), label: "Locations" },
    { value: `${yearsServing}+`, label: "Years Serving" },
    { value: "50+", label: "Menu Items" },
    { value: "4.8", label: "Average Rating" },
  ] as const;

  const tickerItems = [
    "Sharptown, MD",
    "East New Market, MD",
    "Vienna, MD",
    "Fresh Daily",
    "Open 7 Days",
    `Since ${establishedYear}`,
    "Dine-In / Takeout / Delivery",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .wml-page,
        .wml-page *,
        .wml-page *::before,
        .wml-page *::after {
          box-sizing: border-box;
        }

        .wml-page {
          --wml-amber: #c8590a;
          --wml-amber-bright: #f0b14b;
          --wml-amber-pale: rgba(200,89,10,0.1);
          --wml-amber-border: rgba(200,89,10,0.3);
          --wml-ink: #070605;
          --wml-ink-soft: #0c0a08;
          --wml-panel: #0f0d0b;
          --wml-panel-soft: rgba(240,235,228,0.04);
          --wml-border: rgba(240,235,228,0.08);
          --wml-border-strong: rgba(240,235,228,0.14);
          --wml-text: #f0ebe4;
          --wml-text-soft: rgba(240,235,228,0.68);
          --wml-text-muted: rgba(240,235,228,0.44);
          --wml-text-faint: rgba(240,235,228,0.26);
          --wml-shadow-lg: 0 32px 88px rgba(0,0,0,0.55);
          --wml-shadow-amber: 0 10px 28px rgba(200,89,10,0.4);

          font-family: "DM Sans", sans-serif;
          color: var(--wml-text);
          background:
            radial-gradient(circle at top left, rgba(200,89,10,0.08), transparent 28%),
            var(--wml-ink);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .wml-hero {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background: var(--wml-ink);
        }

        .wml-hero__bg {
          position: absolute;
          inset: -8%;
          background-size: cover;
          background-position: center 60%;
          will-change: transform;
        }

        .wml-hero__ov {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(7,6,5,0.18) 0%, rgba(7,6,5,0.52) 38%, rgba(7,6,5,0.94) 76%, rgba(7,6,5,1) 100%),
            linear-gradient(100deg, rgba(7,6,5,0.95) 0%, rgba(7,6,5,0.62) 42%, transparent 66%);
        }

        .wml-hero__amber-wash {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 70% 55% at 8% 88%, rgba(200,89,10,0.11) 0%, transparent 58%);
        }

        .wml-hero__grain {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }

        .wml-hero__orb {
          position: absolute;
          bottom: -60px;
          left: -40px;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,89,10,0.12) 0%, transparent 68%);
          filter: blur(70px);
          pointer-events: none;
        }

        .wml-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .wml-particle {
          position: absolute;
          border-radius: 50%;
        }

        .wml-hero__inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 44px 92px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.9fr);
          gap: 52px;
          align-items: flex-end;
        }

        @media (max-width: 960px) {
          .wml-hero__inner {
            grid-template-columns: 1fr;
            padding: 0 28px 72px;
          }
        }

        .wml-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--wml-amber);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
        }

        .wml-eyebrow-line {
          display: inline-block;
          width: 24px;
          height: 1px;
          background: currentColor;
          opacity: 0.55;
          flex-shrink: 0;
        }

        .wml-hero__title {
          margin-top: 22px;
          color: var(--wml-text);
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(54px, 8vw, 100px);
          font-weight: 700;
          line-height: 0.96;
          letter-spacing: -0.015em;
        }

        .wml-shimmer {
          background: linear-gradient(92deg, #c8590a 0%, #e8812a 22%, #f5b040 40%, #fbc95a 50%, #e8812a 65%, #c8590a 100%);
          background-size: 280% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wmlShimmer 5s linear infinite;
        }

        @keyframes wmlShimmer {
          0% {
            background-position: -140% center;
          }

          100% {
            background-position: 140% center;
          }
        }

        .wml-hero__sub {
          max-width: 440px;
          margin-top: 22px;
          color: var(--wml-text-muted);
          font-size: 15px;
          font-weight: 300;
          line-height: 1.85;
        }

        .wml-hero__ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 34px;
        }

        .wml-hero__trust {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          margin-top: 36px;
          padding-top: 32px;
          border-top: 1px solid var(--wml-border);
          list-style: none;
        }

        .wml-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--wml-text-soft);
          font-size: 11px;
          font-weight: 400;
        }

        .wml-trust-item svg {
          width: 12px;
          height: 12px;
          color: var(--wml-amber);
          flex-shrink: 0;
        }

        .wml-trust-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(240,235,228,0.15);
          flex-shrink: 0;
        }

        .wml-hero__stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          align-self: flex-end;
        }

        @media (max-width: 960px) {
          .wml-hero__stats {
            display: none;
          }
        }

        .wml-stat-card {
          position: relative;
          overflow: hidden;
          padding: 24px 22px;
          border-radius: 16px;
          background: rgba(240,235,228,0.04);
          border: 1px solid rgba(240,235,228,0.09);
          backdrop-filter: blur(14px);
          transition: border-color 0.35s ease, box-shadow 0.38s ease;
        }

        .wml-stat-card::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0;
          background: radial-gradient(ellipse at 0% 0%, rgba(200,89,10,0.08) 0%, transparent 65%);
          transition: opacity 0.4s ease;
        }

        .wml-stat-card:hover {
          border-color: rgba(200,89,10,0.35);
          box-shadow: 0 18px 44px rgba(0,0,0,0.45);
        }

        .wml-stat-card:hover::before {
          opacity: 1;
        }

        .wml-stat-card__num {
          position: relative;
          color: var(--wml-amber);
          font-family: "Cormorant Garamond", serif;
          font-size: 44px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .wml-stat-card__label {
          position: relative;
          margin-top: 7px;
          color: var(--wml-text-soft);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .wml-stat-card__accent {
          display: block;
          width: 16px;
          height: 1.5px;
          margin-top: 10px;
          background: rgba(200,89,10,0.5);
        }

        .wml-scroll-cue {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(240,235,228,0.22);
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .wml-scroll-cue__track {
          position: relative;
          overflow: hidden;
          width: 1px;
          height: 44px;
          background: rgba(240,235,228,0.1);
        }

        .wml-scroll-cue__track::after {
          content: "";
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent, var(--wml-amber), transparent);
          animation: scrollDrop 2.1s ease-in-out infinite;
        }

        @keyframes scrollDrop {
          0% {
            top: -100%;
            opacity: 0;
          }

          25% {
            opacity: 1;
          }

          75% {
            opacity: 0.6;
          }

          100% {
            top: 100%;
            opacity: 0;
          }
        }

        .wml-ticker {
          position: relative;
          overflow: hidden;
          padding: 13px 0;
          background: var(--wml-amber);
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .wml-ticker::before,
        .wml-ticker::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 72px;
          z-index: 2;
          pointer-events: none;
        }

        .wml-ticker::before {
          left: 0;
          background: linear-gradient(to right, var(--wml-amber), transparent);
        }

        .wml-ticker::after {
          right: 0;
          background: linear-gradient(to left, var(--wml-amber), transparent);
        }

        .wml-ticker__track {
          display: flex;
          gap: 0;
          width: max-content;
          animation: tickerScroll 24s linear infinite;
        }

        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        .wml-ticker__item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 28px;
          color: rgba(255,255,255,0.9);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .wml-ticker__dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.45);
          flex-shrink: 0;
        }

        .wml-statsbar {
          background: var(--wml-ink-soft);
          border-bottom: 1px solid var(--wml-border);
        }

        .wml-statsbar__inner {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 72px;
        }

        @media (max-width: 640px) {
          .wml-statsbar__inner {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 0 28px;
          }
        }

        .wml-sstat {
          position: relative;
          overflow: hidden;
          padding: 36px 24px;
          text-align: center;
          border-right: 1px solid var(--wml-border);
          transition: background 0.28s ease;
        }

        .wml-sstat::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--wml-amber);
          transform: translateX(-50%);
          transition: width 0.42s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .wml-sstat:hover::after {
          width: 55%;
        }

        .wml-sstat:hover {
          background: rgba(240,235,228,0.02);
        }

        .wml-sstat:last-child {
          border-right: none;
        }

        @media (max-width: 640px) {
          .wml-sstat:nth-child(2) {
            border-right: none;
          }
        }

        .wml-sstat__num {
          color: var(--wml-text);
          font-family: "Cormorant Garamond", serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .wml-sstat__label {
          margin-top: 6px;
          color: var(--wml-text-soft);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .wml-sstat__rule {
          display: block;
          width: 16px;
          height: 1.5px;
          margin: 10px auto 0;
          background: rgba(200,89,10,0.55);
        }

        .wml-intro {
          position: relative;
          text-align: center;
          padding: 88px 44px 0;
        }

        @media (max-width: 640px) {
          .wml-intro {
            padding: 64px 28px 0;
          }
        }

        .wml-intro__eye {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--wml-amber);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
        }

        .wml-intro__eye-line {
          display: inline-block;
          width: 24px;
          height: 1px;
          background: currentColor;
          opacity: 0.55;
        }

        .wml-intro__title {
          margin-top: 16px;
          color: var(--wml-text);
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(38px, 5.2vw, 64px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .wml-intro__title em {
          color: rgba(200,89,10,0.82);
          font-style: italic;
        }

        .wml-intro__sub {
          max-width: 460px;
          margin: 14px auto 0;
          color: var(--wml-text-muted);
          font-size: 14px;
          font-weight: 300;
          line-height: 1.75;
        }

        .wml-jumpnav {
          max-width: 1360px;
          margin: 0 auto;
          padding: 30px 44px 0;
        }

        @media (max-width: 640px) {
          .wml-jumpnav {
            padding: 22px 24px 0;
          }
        }

        .wml-jumpnav__inner {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .wml-jumpnav__link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid rgba(240,235,228,0.12);
          background: rgba(240,235,228,0.03);
          color: var(--wml-text-soft);
          text-decoration: none;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition:
            border-color 0.22s ease,
            color 0.22s ease,
            background 0.22s ease,
            transform 0.22s ease;
        }

        .wml-jumpnav__link:hover {
          transform: translateY(-2px);
          border-color: rgba(200,89,10,0.36);
          color: var(--wml-text);
          background: rgba(200,89,10,0.08);
        }

        .wml-jumpnav__dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--wml-amber);
          flex-shrink: 0;
        }

        .wml-cards {
          display: flex;
          flex-direction: column;
          gap: 36px;
          max-width: 1360px;
          margin: 0 auto;
          padding: 64px 44px 100px;
        }

        @media (max-width: 640px) {
          .wml-cards {
            gap: 28px;
            padding: 48px 24px 80px;
          }
        }

        .wml-card {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid var(--wml-border);
          background: linear-gradient(180deg, rgba(255,255,255,0.018) 0%, transparent 14%), var(--wml-panel);
          transition:
            border-color 0.4s ease,
            box-shadow 0.45s ease;
        }

        .wml-card:hover {
          border-color: rgba(200,89,10,0.32);
          box-shadow: var(--wml-shadow-lg), 0 0 0 1px rgba(200,89,10,0.08);
        }

        .wml-card--flip {
          direction: rtl;
        }

        .wml-card--flip > * {
          direction: ltr;
        }

        @media (max-width: 880px) {
          .wml-card {
            grid-template-columns: 1fr;
          }

          .wml-card--flip {
            direction: ltr;
          }

          .wml-card--flip > * {
            direction: ltr;
          }
        }

        .wml-card__edge {
          position: absolute;
          inset: 0 auto 0 0;
          width: 2px;
          z-index: 2;
          opacity: 0.8;
          pointer-events: none;
        }

        .wml-card--flip .wml-card__edge {
          inset: 0 0 0 auto;
        }

        .wml-card__glow {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.45s ease;
        }

        .wml-card:hover .wml-card__glow {
          opacity: 1;
        }

        .wml-photo {
          position: relative;
          z-index: 1;
          min-height: 380px;
          overflow: hidden;
          background: #161412;
        }

        @media (max-width: 880px) {
          .wml-photo {
            min-height: 280px;
          }
        }

        .wml-photo img {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: saturate(0.72) brightness(0.86);
          transition:
            transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
            filter 0.45s ease;
        }

        .wml-card:hover .wml-photo img {
          transform: scale(1.06);
          filter: saturate(1) brightness(0.94);
        }

        .wml-photo__scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(to bottom, transparent 55%, rgba(7,6,5,0.6) 100%);
        }

        .wml-photo__pin {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: var(--wml-amber);
          color: #fff;
          text-decoration: none;
          box-shadow: 0 8px 28px rgba(200,89,10,0.48);
          transition:
            background 0.25s ease,
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.25s ease;
          animation: pinFloat 2.4s ease-in-out infinite;
        }

        .wml-photo__pin:hover {
          animation: none;
          background: #a84e08;
          box-shadow: 0 12px 36px rgba(200,89,10,0.62);
          transform: scale(1.12);
        }

        @keyframes pinFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px) scale(1.06);
          }
        }

        .wml-photo__watermark {
          position: absolute;
          right: 14px;
          bottom: -14px;
          z-index: 2;
          color: rgba(255,255,255,0.06);
          font-family: "Cormorant Garamond", serif;
          font-size: 108px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.04em;
          user-select: none;
          pointer-events: none;
        }

        .wml-photo__ribbon {
          position: absolute;
          left: 18px;
          bottom: 18px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid rgba(200,89,10,0.28);
          background: rgba(7,6,5,0.72);
          backdrop-filter: blur(10px);
        }

        .wml-photo__ribbon span {
          color: var(--wml-amber);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .wml-info {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 44px 48px;
        }

        @media (max-width: 640px) {
          .wml-info {
            padding: 30px 26px;
          }
        }

        .wml-info__meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 4px;
        }

        .wml-info__num {
          color: rgba(240,235,228,0.22);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .wml-info__state {
          padding: 2px 8px;
          border-radius: 50px;
          border: 1px solid rgba(240,235,228,0.1);
          color: rgba(240,235,228,0.2);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .wml-info__name {
          margin-top: 10px;
          color: var(--wml-text);
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(34px, 4vw, 50px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .wml-info__rule {
          width: 32px;
          height: 2px;
          margin: 20px 0;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--wml-amber), transparent);
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .wml-card:hover .wml-info__rule {
          width: 52px;
        }

        .wml-info__tagline {
          max-width: 380px;
          color: var(--wml-text-muted);
          font-size: 13.5px;
          font-weight: 300;
          line-height: 1.75;
        }

        .wml-info__spotlight {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          min-height: 30px;
          margin-top: 18px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(200,89,10,0.22);
          background: rgba(200,89,10,0.08);
          color: var(--wml-amber);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .wml-detail-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 22px 0 0;
          padding: 0;
          list-style: none;
        }

        .wml-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          color: var(--wml-text-soft);
          font-size: 12.5px;
          line-height: 1.55;
        }

        .wml-detail-row svg {
          flex-shrink: 0;
          margin-top: 1px;
          color: var(--wml-amber);
        }

        .wml-detail-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .wml-detail-link:hover {
          color: rgba(240,235,228,0.88);
        }

        .wml-info__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 28px;
        }

        .wml-btn-primary,
        .wml-btn-outline,
        .wml-btn-amber,
        .wml-btn-dark,
        .wml-btn-ghost,
        .wml-hero-btn-primary,
        .wml-hero-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          text-decoration: none;
          border-radius: 8px;
          transition:
            background 0.25s ease,
            border-color 0.22s ease,
            color 0.22s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .wml-btn-primary,
        .wml-btn-outline,
        .wml-btn-amber {
          padding: 11px 20px;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .wml-btn-primary {
          position: relative;
          overflow: hidden;
          padding-inline: 22px;
          background: var(--wml-amber);
          color: #fff;
          font-weight: 600;
        }

        .wml-btn-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 60%);
          transition: opacity 0.25s ease;
        }

        .wml-btn-primary:hover {
          background: #a84e08;
          transform: translateY(-2px);
          box-shadow: var(--wml-shadow-amber);
        }

        .wml-btn-primary:hover::before {
          opacity: 1;
        }

        .wml-btn-outline {
          border: 1px solid rgba(240,235,228,0.14);
          background: transparent;
          color: rgba(240,235,228,0.6);
          font-weight: 500;
        }

        .wml-btn-outline:hover {
          transform: translateY(-2px);
          border-color: rgba(240,235,228,0.4);
          background: rgba(240,235,228,0.05);
          color: var(--wml-text);
        }

        .wml-btn-amber {
          border: 1px solid rgba(200,89,10,0.3);
          background: transparent;
          color: var(--wml-amber);
          font-weight: 600;
        }

        .wml-btn-amber:hover {
          transform: translateY(-2px);
          border-color: var(--wml-amber);
          background: rgba(200,89,10,0.08);
        }

        .wml-cta-wrap {
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 44px 112px;
        }

        @media (max-width: 640px) {
          .wml-cta-wrap {
            padding: 0 24px 80px;
          }
        }

        .wml-cta-box {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 40px;
          align-items: center;
          padding: 76px 68px;
          border-radius: 26px;
          background: var(--wml-amber);
        }

        @media (max-width: 720px) {
          .wml-cta-box {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 48px 36px;
          }
        }

        .wml-cta-box::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 75% at 16% 50%, rgba(255,255,255,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 40% 55% at 84% 20%, rgba(0,0,0,0.1) 0%, transparent 55%);
        }

        .wml-cta-box__hatch {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image: repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%);
          background-size: 12px 12px;
        }

        .wml-cta-box__circle {
          position: absolute;
          top: -56px;
          right: -56px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.11);
          pointer-events: none;
        }

        .wml-cta-box__circle::after {
          content: "";
          position: absolute;
          inset: 24px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .wml-cta-box__title {
          position: relative;
          z-index: 1;
          color: #fff;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(36px, 4.4vw, 58px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .wml-cta-box__sub {
          position: relative;
          z-index: 1;
          max-width: 400px;
          margin-top: 12px;
          color: rgba(255,255,255,0.78);
          font-size: 15px;
          font-weight: 300;
          line-height: 1.72;
        }

        .wml-cta-box__btns {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .wml-btn-dark,
        .wml-btn-ghost,
        .wml-hero-btn-primary,
        .wml-hero-btn-outline {
          padding: 14px 28px;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .wml-btn-dark {
          background: var(--wml-ink);
          color: var(--wml-text);
        }

        .wml-btn-dark:hover {
          background: #1a1612;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.4);
        }

        .wml-btn-ghost {
          border: 1.5px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.13);
          color: #fff;
        }

        .wml-btn-ghost:hover {
          background: rgba(255,255,255,0.22);
          transform: translateY(-2px);
        }

        .wml-hero-btn-primary {
          background: var(--wml-amber);
          color: #fff;
        }

        .wml-hero-btn-primary:hover {
          background: #a84e08;
          transform: translateY(-2px);
          box-shadow: var(--wml-shadow-amber);
        }

        .wml-hero-btn-outline {
          border: 1px solid rgba(240,235,228,0.16);
          background: transparent;
          color: rgba(240,235,228,0.65);
          font-weight: 500;
        }

        .wml-hero-btn-outline:hover {
          transform: translateY(-2px);
          border-color: rgba(240,235,228,0.44);
          background: rgba(240,235,228,0.05);
          color: var(--wml-text);
        }

        .wml-btn-primary:focus-visible,
        .wml-btn-outline:focus-visible,
        .wml-btn-amber:focus-visible,
        .wml-btn-dark:focus-visible,
        .wml-btn-ghost:focus-visible,
        .wml-hero-btn-primary:focus-visible,
        .wml-hero-btn-outline:focus-visible,
        .wml-photo__pin:focus-visible,
        .wml-detail-link:focus-visible,
        .wml-jumpnav__link:focus-visible {
          outline: 2px solid var(--wml-amber-bright);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .wml-shimmer,
          .wml-scroll-cue__track::after,
          .wml-ticker__track,
          .wml-photo__pin {
            animation: none !important;
          }
        }

        @media (hover: none) {
          .wml-btn-primary:hover,
          .wml-btn-outline:hover,
          .wml-btn-amber:hover,
          .wml-btn-dark:hover,
          .wml-btn-ghost:hover,
          .wml-hero-btn-primary:hover,
          .wml-hero-btn-outline:hover,
          .wml-jumpnav__link:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="wml-page">
        <section className="wml-hero" ref={heroRef}>
          <motion.div
            className="wml-hero__bg"
            style={{
              backgroundImage: `url(${bannerImg})`,
              y: bgY,
              opacity: bgOpacity,
              scale: bgScale,
            }}
          />
          <div className="wml-hero__ov" />
          <div className="wml-hero__amber-wash" />
          <div className="wml-hero__grain" />
          <div className="wml-hero__orb" />
          <HeroParticles />

          <div className="wml-hero__inner">
            <motion.div style={shouldReduceMotion ? undefined : { y: textY }}>
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="wml-eyebrow">
                  <span className="wml-eyebrow-line" />
                  <Sparkles style={{ width: 10, height: 10 }} />
                  Find Us
                  <span className="wml-eyebrow-line" />
                </span>
              </motion.div>

              <motion.h1
                className="wml-hero__title"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 44, rotateX: 10 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.95, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                style={shouldReduceMotion ? undefined : { transformStyle: "preserve-3d", perspective: 900 }}
              >
                Three Maryland
                <br />
                <span className="wml-shimmer">Kitchens.</span>
              </motion.h1>

              <motion.p
                className="wml-hero__sub"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.34 }}
              >
                Each kitchen carries its own specialty, all built on the same Wise Mart
                standard. Pick yours.
              </motion.p>

              <motion.div
                className="wml-hero__ctas"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <a href="#locations" className="wml-hero-btn-primary">
                  Explore Locations
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </a>
                <Link to="/order" className="wml-hero-btn-outline">
                  Order Now
                </Link>
              </motion.div>

              <motion.div
                className="wml-hero__trust"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.72 }}
                aria-label="Location highlights"
              >
                {[
                  { icon: Star, label: "4.8 avg rating" },
                  { icon: MapPin, label: `${LOCATION_DATA.length} locations` },
                  { icon: Clock, label: "Open daily" },
                ].map((item, index) => (
                  <Fragment key={item.label}>
                    {index > 0 ? <div className="wml-trust-sep" aria-hidden="true" /> : null}
                    <div className="wml-trust-item">
                      <item.icon style={{ width: 12, height: 12 }} />
                      {item.label}
                    </div>
                  </Fragment>
                ))}
              </motion.div>
            </motion.div>

            <div className="wml-hero__stats" aria-hidden="true">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="wml-stat-card"
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 56,
                          rotateX: 16,
                          rotateY: index % 2 === 0 ? -8 : 8,
                          scale: 0.88,
                        }
                  }
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          opacity: 1,
                          y: index % 2 === 0 ? 0 : 22,
                          rotateX: 0,
                          rotateY: 0,
                          scale: 1,
                        }
                  }
                  transition={{
                    duration: 0.88,
                    delay: 0.52 + index * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: (index % 2 === 0 ? 0 : 22) - 7,
                          rotateY: index % 2 === 0 ? 3 : -3,
                          rotateX: -2,
                          scale: 1.04,
                          transition: { duration: 0.3 },
                        }
                  }
                  style={shouldReduceMotion ? undefined : { transformStyle: "preserve-3d", perspective: 900 }}
                >
                  <div className="wml-stat-card__num">{stat.value}</div>
                  <div className="wml-stat-card__label">{stat.label}</div>
                  <span className="wml-stat-card__accent" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="wml-scroll-cue" aria-hidden="true">
            <div className="wml-scroll-cue__track" />
            <span>scroll</span>
          </div>
        </section>

        <div className="wml-ticker" aria-hidden="true">
          <div className="wml-ticker__track">
            {Array.from({ length: 2 }).map((_, pass) =>
              tickerItems.map((item, index) => (
                <div key={`${pass}-${index}`} className="wml-ticker__item">
                  {item}
                  <span className="wml-ticker__dot" />
                </div>
              )),
            )}
          </div>
        </div>

        <div className="wml-statsbar">
          <div className="wml-statsbar__inner">
            {[
              { to: LOCATION_DATA.length, suffix: "", label: "Locations" },
              { to: yearsServing, suffix: "+", label: "Years Serving" },
              { to: 50, suffix: "+", label: "Menu Items" },
              { to: 48, suffix: "/50", label: "Avg. Rating" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="wml-sstat"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="wml-sstat__num">
                  <Counter to={stat.to} suffix={stat.suffix} />
                </div>
                <div className="wml-sstat__label">{stat.label}</div>
                <span className="wml-sstat__rule" />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          id="locations"
          className="wml-intro"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="wml-intro__eye">
            <span className="wml-intro__eye-line" />
            Our Locations
            <span className="wml-intro__eye-line" />
          </span>
          <h2 className="wml-intro__title">
            Pick Your
            <br />
            <em>Wise Mart</em>
          </h2>
          <p className="wml-intro__sub">
            Three Maryland kitchens, each with its own personality and the same Wise Mart
            promise throughout.
          </p>
        </motion.div>

        <div className="wml-jumpnav">
          <div className="wml-jumpnav__inner">
            {LOCATION_DATA.map((loc) => (
              <a key={loc.slug} href={`#loc-${loc.slug}`} className="wml-jumpnav__link">
                <span className="wml-jumpnav__dot" />
                {loc.name}
              </a>
            ))}
          </div>
        </div>

        <div className="wml-cards" role="list">
          {LOCATION_DATA.map((loc, index) => (
            <LocationCard key={loc.slug} loc={loc} index={index} />
          ))}
        </div>

        <div className="wml-cta-wrap">
          <motion.div
            className="wml-cta-box"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 48, scale: 0.96 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { scale: 1.007, transition: { duration: 0.36 } }
            }
            style={shouldReduceMotion ? undefined : { transformStyle: "preserve-3d" }}
          >
            <div className="wml-cta-box__hatch" />
            <div className="wml-cta-box__circle" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 className="wml-cta-box__title">Ready to order?</h3>
              <p className="wml-cta-box__sub">
                Pick your location, place your order, and we will have it ready when you
                arrive.
              </p>
            </div>
            <div className="wml-cta-box__btns">
              <Link to="/order" className="wml-btn-dark">
                Order Now
                <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
              <a href="#locations" className="wml-btn-ghost">
                See All Locations
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
