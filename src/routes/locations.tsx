import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef, useCallback, useEffect, useState } from "react";
import { Phone, MapPin, Clock, ArrowRight, Navigation, Sparkles, ExternalLink, Star } from "lucide-react";
import { LOCATIONS } from "@/data/site";
import bannerImg from "@/assets/banner-5.webp";

import imgSharptown from "@/assets/sharpown.webp";
import imgEastNew   from "@/assets/east-new.webp";
import imgVienna    from "@/assets/vienna.webp";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — Wise Mart | Sharptown · East New Market · Vienna, MD" },
      { name: "description", content: "Find your nearest Wise Mart. Three Maryland locations with hours, phone numbers, and directions." },
      { property: "og:title",       content: "Wise Mart Locations" },
      { property: "og:description", content: "Three Maryland kitchens. One promise." },
    ],
  }),
  component: LocationsPage,
});

/* ─── location data ─── */
const LOCATION_DATA = [
  {
    slug:         "sharptown",
    name:         "Sharptown",
    index:        1,
    state:        "MD",
    address:      "806 Main St, Sharptown, MD 21861",
    phone:        "(410) 883-3648",
    phoneHref:    "tel:+14108833648",
    hours:        "Sun–Thu 10 AM–10 PM · Fri–Sat 10 AM–11 PM",
    specialty:    "Fresh Dough Pizza · Fried Chicken",
    tagline:      "Our flagship kitchen — hand-stretched pizza and famous double-fried chicken, made fresh every day since 2010.",
    photo:        imgSharptown,
    mapsUrl:      "https://www.google.com/maps/search/?api=1&query=806+Main+St+Sharptown+MD+21861",
    directionsUrl:"https://www.google.com/maps/dir/?api=1&destination=806+Main+St+Sharptown+MD+21861",
    accentAngle:  "135deg",
  },
  {
    slug:         "east-new-market",
    name:         "East New Market",
    index:        2,
    state:        "MD",
    address:      "5703 Mt Holly Rd, East New Market, MD 21631",
    phone:        "(410) 943-6270",
    phoneHref:    "tel:+14109436270",
    hours:        "Sun–Thu 10 AM–10 PM · Fri–Sat 10 AM–11 PM",
    specialty:    "Hot Subs · Combo Meals",
    tagline:      "Hearty subs, hot sandwiches, and generous combo meals built for the whole crew.",
    photo:        imgEastNew,
    mapsUrl:      "https://www.google.com/maps/search/?api=1&query=5703+Mt+Holly+Rd+East+New+Market+MD+21631",
    directionsUrl:"https://www.google.com/maps/dir/?api=1&destination=5703+Mt+Holly+Rd+East+New+Market+MD+21631",
    accentAngle:  "225deg",
  },
  {
    slug:         "vienna",
    name:         "Vienna",
    index:        3,
    state:        "MD",
    address:      "307 Ocean Gateway, Vienna, MD 21869",
    phone:        "(410) 376-3299",
    phoneHref:    "tel:+14103763299",
    hours:        "Sun–Thu 10 AM–10 PM · Fri–Sat 10 AM–11 PM",
    specialty:    "Fresh Salads · Breakfast",
    tagline:      "Fresh salads, breakfast plates, and lighter fare — served with the same Wise Mart care.",
    photo:        imgVienna,
    mapsUrl:      "https://www.google.com/maps/search/?api=1&query=307+Ocean+Gateway+Vienna+MD+21869",
    directionsUrl:"https://www.google.com/maps/dir/?api=1&destination=307+Ocean+Gateway+Vienna+MD+21869",
    accentAngle:  "315deg",
  },
] as const;

/* ─── tilt hook ─── */
function useTilt(strength = 6) {
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 320, damping: 32 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 320, damping: 32 });
  const scale   = useSpring(1, { stiffness: 320, damping: 28 });
  const onMove  = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
    scale.set(1.018);
  }, [x, y, scale]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); scale.set(1); }, [x, y, scale]);
  return { rotateX, rotateY, scale, onMove, onLeave };
}

/* ─── animated counter ─── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step  = Math.ceil(to / 38);
    const timer = setInterval(() => {
      v += step;
      if (v >= to) { setVal(to); clearInterval(timer); }
      else setVal(v);
    }, 36);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── detail row ─── */
function DetailRow({ icon: Icon, children, href }: {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  children: React.ReactNode;
  href?: string;
}) {
  const content = href
    ? <a href={href} className="wml-detail-link">{children}</a>
    : <span>{children}</span>;
  return (
    <li className="wml-detail-row">
      <Icon style={{ width: 14, height: 14 }} />
      {content}
    </li>
  );
}

/* ─── particles ─── */
function HeroParticles() {
  return (
    <div aria-hidden="true" style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:1 }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position:"absolute", borderRadius:"50%",
            width:  i % 3 === 0 ? 3 : 1.8,
            height: i % 3 === 0 ? 3 : 1.8,
            background: i % 4 === 0 ? "#c8590a" : "rgba(240,235,228,0.09)",
            left: `${5 + (i * 5.3) % 90}%`,
            top:  `${10 + (i * 7.7) % 80}%`,
            boxShadow: i % 4 === 0 ? "0 0 6px rgba(200,89,10,0.6)" : "none",
          }}
          animate={{ y:[0,-28,0], opacity:[0,0.8,0], scale:[0,1,0] }}
          transition={{ duration: 3.2+(i%4)*0.6, delay: i*0.4, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── location card ─── */
function LocationCard({ loc, index }: { loc: typeof LOCATION_DATA[number]; index: number }) {
  const { rotateX, rotateY, scale, onMove, onLeave } = useTilt(4);
  const flip = index % 2 !== 0;

  return (
    <motion.div
      className="wml-card-wrap"
      initial={{ opacity: 0, y: 56, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.article
        className={`wml-card${flip ? " wml-card--flip" : ""}`}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", perspective: 1100 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        aria-label={`Wise Mart ${loc.name} location`}
      >
        {/* glow on hover */}
        <div
          className="wml-card__glow"
          style={{ background: `radial-gradient(ellipse 70% 60% at ${flip ? "100%" : "0%"} 50%, rgba(200,89,10,0.09) 0%, transparent 65%)` }}
        />

        {/* ── PHOTO ── */}
        <div className="wml-photo">
          <img
            src={loc.photo}
            alt={`Wise Mart ${loc.name}`}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          <div className="wml-photo__scrim" />

          {/* maps pin */}
          <a
            href={loc.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="wml-photo__pin"
            aria-label={`View ${loc.name} on Google Maps`}
          >
            <MapPin style={{ width: 18, height: 18 }} />
          </a>

          {/* location index watermark */}
          <span className="wml-photo__watermark" aria-hidden="true">
            0{loc.index}
          </span>

          {/* specialty ribbon at photo bottom */}
          <div className="wml-photo__ribbon">
            <span>{loc.specialty}</span>
          </div>
        </div>

        {/* ── INFO ── */}
        <div className="wml-info">
          {/* top meta */}
          <div className="wml-info__meta">
            <span className="wml-info__num">Location 0{loc.index}</span>
            <span className="wml-info__state">{loc.state}</span>
          </div>

          {/* name */}
          <h2 className="wml-info__name">{loc.name}</h2>

          {/* amber rule */}
          <div className="wml-info__rule" />

          {/* tagline */}
          <p className="wml-info__tagline">{loc.tagline}</p>

          {/* details */}
          <ul className="wml-detail-list" aria-label="Location details">
            <DetailRow icon={MapPin}>{loc.address}</DetailRow>
            <DetailRow icon={Clock}>{loc.hours}</DetailRow>
            <DetailRow icon={Phone} href={loc.phoneHref}>{loc.phone}</DetailRow>
          </ul>

          {/* actions */}
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

/* ─── page ─── */
function LocationsPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.88], [1, 0]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .wml-page {
          font-family: 'DM Sans', sans-serif;
          background: #070605;
          color: #f0ebe4;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ══════════ HERO ══════════ */
        .wml-hero {
          position: relative; min-height: 100svh; overflow: hidden;
          background: #070605;
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .wml-hero__bg {
          position: absolute; inset: -8%;
          background-size: cover; background-position: center 60%;
          will-change: transform;
        }
        .wml-hero__ov {
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg,
              rgba(7,6,5,0.20) 0%,
              rgba(7,6,5,0.52) 38%,
              rgba(7,6,5,0.94) 76%,
              rgba(7,6,5,1.00) 100%
            ),
            linear-gradient(100deg,
              rgba(7,6,5,0.94) 0%,
              rgba(7,6,5,0.60) 42%,
              transparent 66%
            );
        }
        .wml-hero__amber-wash {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 55% at 8% 88%, rgba(200,89,10,0.11) 0%, transparent 58%);
        }
        .wml-hero__grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }
        .wml-hero__orb {
          position: absolute; bottom: -60px; left: -40px;
          width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, rgba(200,89,10,0.12) 0%, transparent 68%);
          filter: blur(70px); pointer-events: none;
        }

        .wml-hero__inner {
          position: relative; z-index: 2;
          max-width: 1360px; margin: 0 auto;
          padding: 0 44px 92px; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 52px; align-items: flex-end;
        }
        @media(max-width:960px) { .wml-hero__inner { grid-template-columns: 1fr; padding: 0 28px 72px; } }

        /* eyebrow */
        .wml-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.26em;
          text-transform: uppercase; color: #c8590a;
        }
        .wml-eyebrow-line {
          display: inline-block; width: 24px; height: 1px;
          background: #c8590a; opacity: 0.55; flex-shrink: 0;
        }

        .wml-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(54px, 8vw, 100px);
          font-weight: 700; line-height: 0.96;
          letter-spacing: -0.015em; color: #f0ebe4; margin-top: 22px;
        }
        .wml-shimmer {
          background: linear-gradient(92deg,
            #c8590a 0%, #e8812a 22%, #f5b040 40%,
            #fbc95a 50%, #e8812a 65%, #c8590a 100%
          );
          background-size: 280% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wmlShimmer 5s linear infinite;
        }
        @keyframes wmlShimmer {
          0%   { background-position: -140% center; }
          100% { background-position:  140% center; }
        }

        .wml-hero__sub {
          font-size: 15px; color: rgba(240,235,228,0.44); line-height: 1.85;
          margin-top: 22px; max-width: 440px; font-weight: 300;
        }
        .wml-hero__ctas { display: flex; flex-wrap: wrap; gap: 11px; margin-top: 34px; }

        /* trust strip */
        .wml-hero__trust {
          display: flex; align-items: center; gap: 16px;
          margin-top: 36px; padding-top: 32px;
          border-top: 1px solid rgba(240,235,228,0.08);
        }
        .wml-trust-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: rgba(240,235,228,0.36); font-weight: 400;
        }
        .wml-trust-item svg { width: 12px; height: 12px; color: #c8590a; flex-shrink: 0; }
        .wml-trust-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(240,235,228,0.15); flex-shrink: 0; }

        /* hero right: stat cards */
        .wml-hero__stats {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-self: flex-end;
        }
        @media(max-width:960px) { .wml-hero__stats { display: none; } }

        .wml-stat-card {
          background: rgba(240,235,228,0.04);
          border: 1px solid rgba(240,235,228,0.09);
          backdrop-filter: blur(14px);
          border-radius: 16px; padding: 24px 22px;
          transition: border-color 0.35s, box-shadow 0.38s;
          position: relative; overflow: hidden;
        }
        .wml-stat-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 0% 0%, rgba(200,89,10,0.08) 0%, transparent 65%);
          opacity: 0; transition: opacity 0.4s;
        }
        .wml-stat-card:hover { border-color: rgba(200,89,10,0.35); box-shadow: 0 18px 44px rgba(0,0,0,0.45); }
        .wml-stat-card:hover::before { opacity: 1; }

        .wml-stat-card__num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 44px; font-weight: 700; color: #c8590a;
          line-height: 1; letter-spacing: -0.02em; position: relative;
        }
        .wml-stat-card__label {
          font-size: 9.5px; font-weight: 600; color: rgba(240,235,228,0.38);
          letter-spacing: 0.16em; text-transform: uppercase;
          margin-top: 7px; position: relative;
        }
        .wml-stat-card__accent {
          display: block; width: 16px; height: 1.5px;
          background: rgba(200,89,10,0.5); margin-top: 10px;
        }

        /* scroll cue */
        .wml-scroll-cue {
          position: absolute; bottom: 28px; left: 50%;
          transform: translateX(-50%); z-index: 3;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
          color: rgba(240,235,228,0.22);
        }
        .wml-scroll-cue__track {
          width: 1px; height: 44px;
          background: rgba(240,235,228,0.10); position: relative; overflow: hidden;
        }
        .wml-scroll-cue__track::after {
          content: '';
          position: absolute; top: -100%; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom, transparent, #c8590a, transparent);
          animation: scrollDrop 2.1s ease-in-out infinite;
        }
        @keyframes scrollDrop {
          0%   { top: -100%; opacity: 0; }
          25%  { opacity: 1; }
          75%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }

        /* ══════════ TICKER ══════════ */
        .wml-ticker {
          background: #c8590a; overflow: hidden; padding: 13px 0;
          border-top: 1px solid rgba(255,255,255,0.08); position: relative;
        }
        .wml-ticker::before, .wml-ticker::after {
          content: ''; position: absolute; top: 0; bottom: 0;
          width: 72px; z-index: 2; pointer-events: none;
        }
        .wml-ticker::before { left:  0; background: linear-gradient(to right,  #c8590a, transparent); }
        .wml-ticker::after  { right: 0; background: linear-gradient(to left, #c8590a, transparent); }
        .wml-ticker__track {
          display: flex; gap: 0;
          animation: tickerScroll 24s linear infinite;
          width: max-content;
        }
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .wml-ticker__item {
          display: flex; align-items: center; gap: 16px;
          padding: 0 28px; font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.9); white-space: nowrap; flex-shrink: 0;
        }
        .wml-ticker__dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(255,255,255,0.45); flex-shrink: 0;
        }

        /* ══════════ STATS BAR ══════════ */
        .wml-statsbar { background: #0c0a08; border-bottom: 1px solid rgba(240,235,228,0.07); }
        .wml-statsbar__inner {
          max-width: 1360px; margin: 0 auto; padding: 0 72px;
          display: grid; grid-template-columns: repeat(4,1fr);
        }
        @media(max-width:640px){ .wml-statsbar__inner { grid-template-columns: repeat(2,1fr); padding: 0 28px; } }

        .wml-sstat {
          padding: 36px 24px; text-align: center;
          border-right: 1px solid rgba(240,235,228,0.07);
          position: relative; overflow: hidden; transition: background 0.28s;
        }
        .wml-sstat::after {
          content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 0; height: 2px; background: #c8590a;
          transition: width 0.42s cubic-bezier(0.22,1,0.36,1);
        }
        .wml-sstat:hover::after { width: 55%; }
        .wml-sstat:hover { background: rgba(240,235,228,0.02); }
        .wml-sstat:last-child { border-right: none; }
        @media(max-width:640px){ .wml-sstat:nth-child(2) { border-right: none; } }

        .wml-sstat__num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px; font-weight: 700; color: #f0ebe4;
          line-height: 1; letter-spacing: -0.02em;
        }
        .wml-sstat__label {
          font-size: 9.5px; font-weight: 600; color: rgba(240,235,228,0.32);
          margin-top: 6px; letter-spacing: 0.18em; text-transform: uppercase;
        }
        .wml-sstat__rule {
          display: block; width: 16px; height: 1.5px;
          background: rgba(200,89,10,0.55); margin: 10px auto 0;
        }

        /* ══════════ SECTION INTRO ══════════ */
        .wml-intro {
          text-align: center; padding: 88px 44px 0; position: relative;
        }
        @media(max-width:640px){ .wml-intro { padding: 64px 28px 0; } }

        .wml-intro__eye {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.26em;
          text-transform: uppercase; color: #c8590a;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .wml-intro__eye-line {
          display: inline-block; width: 24px; height: 1px;
          background: #c8590a; opacity: 0.55;
        }
        .wml-intro__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 5.2vw, 64px); font-weight: 700;
          color: #f0ebe4; margin-top: 16px; line-height: 1.0; letter-spacing: -0.01em;
        }
        .wml-intro__title em { font-style: italic; color: rgba(200,89,10,0.8); }
        .wml-intro__sub {
          font-size: 14px; color: rgba(240,235,228,0.38); margin-top: 14px;
          max-width: 460px; margin-left: auto; margin-right: auto;
          line-height: 1.75; font-weight: 300;
        }

        /* ══════════ CARDS GRID ══════════ */
        .wml-cards {
          max-width: 1360px; margin: 0 auto;
          padding: 64px 44px 100px;
          display: flex; flex-direction: column; gap: 36px;
        }
        @media(max-width:640px){ .wml-cards { padding: 48px 24px 80px; gap: 28px; } }

        .wml-card-wrap { /* motion wrapper */ }

        .wml-card {
          display: grid; grid-template-columns: 1fr 1fr;
          border-radius: 22px; overflow: hidden;
          border: 1px solid rgba(240,235,228,0.08);
          background: #0c0a08;
          position: relative;
          transition: border-color 0.4s, box-shadow 0.45s;
        }
        .wml-card:hover {
          border-color: rgba(200,89,10,0.32);
          box-shadow: 0 32px 88px rgba(0,0,0,0.55), 0 0 0 1px rgba(200,89,10,0.08);
        }
        .wml-card--flip { direction: rtl; }
        .wml-card--flip > * { direction: ltr; }
        @media(max-width:880px){
          .wml-card { grid-template-columns: 1fr; }
          .wml-card--flip { direction: ltr; }
          .wml-card--flip > * { direction: ltr; }
        }

        /* hover glow */
        .wml-card__glow {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          opacity: 0; transition: opacity 0.45s;
        }
        .wml-card:hover .wml-card__glow { opacity: 1; }

        /* ── photo pane ── */
        .wml-photo {
          position: relative; min-height: 360px;
          background: #161412; overflow: hidden; z-index: 1;
        }
        @media(max-width:880px){ .wml-photo { min-height: 260px; } }

        .wml-photo img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          filter: saturate(0.72) brightness(0.86);
          transition: transform 0.75s cubic-bezier(0.16,1,0.3,1), filter 0.45s;
        }
        .wml-card:hover .wml-photo img {
          transform: scale(1.06);
          filter: saturate(1.0) brightness(0.94);
        }
        .wml-photo__scrim {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to bottom, transparent 55%, rgba(7,6,5,0.6) 100%);
        }

        /* pin badge */
        .wml-photo__pin {
          position: absolute; top: 18px; left: 18px; z-index: 2;
          width: 46px; height: 46px; border-radius: 50%;
          background: #c8590a; color: #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 28px rgba(200,89,10,0.48);
          text-decoration: none;
          transition: background 0.25s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
          animation: pinFloat 2.4s ease-in-out infinite;
        }
        .wml-photo__pin:hover {
          background: #a84e08;
          box-shadow: 0 12px 36px rgba(200,89,10,0.62);
          animation: none;
          transform: scale(1.12);
        }
        @keyframes pinFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-6px) scale(1.06); }
        }

        /* watermark number */
        .wml-photo__watermark {
          position: absolute; bottom: -14px; right: 14px; z-index: 2;
          font-family: 'Cormorant Garamond', serif;
          font-size: 108px; font-weight: 700; line-height: 1;
          color: rgba(255,255,255,0.06); pointer-events: none; user-select: none;
          letter-spacing: -0.04em;
        }

        /* specialty ribbon */
        .wml-photo__ribbon {
          position: absolute; bottom: 18px; left: 18px; z-index: 2;
          display: inline-flex; align-items: center;
          background: rgba(7,6,5,0.72); backdrop-filter: blur(10px);
          border: 1px solid rgba(200,89,10,0.28);
          border-radius: 50px; padding: 6px 14px;
        }
        .wml-photo__ribbon span {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: #c8590a;
        }

        /* ── info pane ── */
        .wml-info {
          padding: 44px 48px; z-index: 1; position: relative;
          display: flex; flex-direction: column; justify-content: center;
        }
        @media(max-width:640px){ .wml-info { padding: 30px 26px; } }

        .wml-info__meta {
          display: flex; align-items: center; gap: 12px; margin-bottom: 4px;
        }
        .wml-info__num {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(240,235,228,0.20);
        }
        .wml-info__state {
          font-size: 9px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(240,235,228,0.18);
          padding: 2px 8px; border-radius: 50px;
          border: 1px solid rgba(240,235,228,0.1);
        }

        .wml-info__name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(34px, 4vw, 50px); font-weight: 700;
          color: #f0ebe4; line-height: 1.0; letter-spacing: -0.01em;
          margin-top: 10px;
        }

        .wml-info__rule {
          width: 32px; height: 2px;
          background: linear-gradient(90deg, #c8590a, transparent);
          border-radius: 2px; margin: 20px 0;
          transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .wml-card:hover .wml-info__rule { width: 52px; }

        .wml-info__tagline {
          font-size: 13.5px; color: rgba(240,235,228,0.42);
          line-height: 1.75; font-weight: 300; max-width: 380px;
        }

        /* detail list */
        .wml-detail-list {
          list-style: none; padding: 0; margin: 22px 0 0;
          display: flex; flex-direction: column; gap: 12px;
        }
        .wml-detail-row {
          display: flex; align-items: flex-start; gap: 11px;
          font-size: 12.5px; color: rgba(240,235,228,0.56); line-height: 1.55;
        }
        .wml-detail-row svg { color: #c8590a; flex-shrink: 0; margin-top: 1px; }
        .wml-detail-link {
          color: inherit; text-decoration: none;
          transition: color 0.2s;
        }
        .wml-detail-link:hover { color: rgba(240,235,228,0.88); }

        /* action buttons */
        .wml-info__actions {
          display: flex; flex-wrap: wrap; gap: 9px; margin-top: 28px;
        }

        .wml-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 22px; background: #c8590a; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none; position: relative; overflow: hidden;
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .wml-btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .wml-btn-primary:hover { background: #a84e08; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,89,10,0.40); }
        .wml-btn-primary:hover::before { opacity: 1; }

        .wml-btn-outline {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 20px; background: transparent;
          border: 1px solid rgba(240,235,228,0.14);
          color: rgba(240,235,228,0.60);
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          transition: border-color 0.22s, color 0.22s, background 0.22s, transform 0.22s;
        }
        .wml-btn-outline:hover {
          border-color: rgba(240,235,228,0.40); color: #f0ebe4;
          background: rgba(240,235,228,0.05); transform: translateY(-2px);
        }

        .wml-btn-amber {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 20px; background: transparent;
          border: 1px solid rgba(200,89,10,0.30); color: #c8590a;
          font-family: 'DM Sans', sans-serif; font-size: 12px;
          font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          transition: border-color 0.22s, background 0.22s, transform 0.22s;
        }
        .wml-btn-amber:hover {
          border-color: #c8590a;
          background: rgba(200,89,10,0.08);
          transform: translateY(-2px);
        }

        /* ══════════ CTA SECTION ══════════ */
        .wml-cta-wrap { padding: 0 44px 112px; max-width: 1360px; margin: 0 auto; }
        @media(max-width:640px){ .wml-cta-wrap { padding: 0 24px 80px; } }

        .wml-cta-box {
          border-radius: 26px; overflow: hidden;
          background: #c8590a;
          padding: 76px 68px;
          display: grid; grid-template-columns: 1fr auto;
          gap: 40px; align-items: center; position: relative;
        }
        @media(max-width:720px){ .wml-cta-box { grid-template-columns: 1fr; padding: 48px 36px; gap: 32px; } }

        .wml-cta-box::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 55% 75% at 16% 50%, rgba(255,255,255,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 40% 55% at 84% 20%, rgba(0,0,0,0.10) 0%, transparent 55%);
        }
        .wml-cta-box__hatch {
          position: absolute; inset: 0; opacity: 0.035;
          background-image: repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%);
          background-size: 12px 12px;
        }
        .wml-cta-box__circle {
          position: absolute; top: -56px; right: -56px;
          width: 260px; height: 260px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.11); pointer-events: none;
        }
        .wml-cta-box__circle::after {
          content: ''; position: absolute; inset: 24px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.07);
        }

        .wml-cta-box__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4.4vw, 58px); font-weight: 700;
          color: #fff; line-height: 1.0; position: relative; z-index: 1;
          letter-spacing: -0.01em;
        }
        .wml-cta-box__sub {
          font-size: 15px; color: rgba(255,255,255,0.78); margin-top: 12px;
          position: relative; z-index: 1; max-width: 400px;
          font-weight: 300; line-height: 1.72;
        }
        .wml-cta-box__btns {
          display: flex; flex-wrap: wrap; gap: 12px; position: relative; z-index: 1;
        }

        .wml-btn-dark {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 30px; background: #070605; color: #f0ebe4;
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
        }
        .wml-btn-dark:hover { background: #1a1612; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.4); }

        .wml-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 30px; background: rgba(255,255,255,0.13); color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          border: 1.5px solid rgba(255,255,255,0.30);
          transition: background 0.22s, transform 0.22s;
        }
        .wml-btn-ghost:hover { background: rgba(255,255,255,0.22); transform: translateY(-2px); }

        /* shared hero CTAs */
        .wml-hero-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: #c8590a; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .wml-hero-btn-primary:hover { background: #a84e08; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,89,10,0.40); }

        .wml-hero-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: transparent;
          border: 1px solid rgba(240,235,228,0.16); color: rgba(240,235,228,0.65);
          font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          transition: border-color 0.22s, color 0.22s, background 0.22s, transform 0.22s;
        }
        .wml-hero-btn-outline:hover {
          border-color: rgba(240,235,228,0.44); color: #f0ebe4;
          background: rgba(240,235,228,0.05); transform: translateY(-2px);
        }

        @media(prefers-reduced-motion: reduce) {
          .wml-shimmer, .wml-scroll-cue__track::after,
          .wml-ticker__track, .wml-photo__pin { animation: none; }
        }
        @media(hover: none) {
          .wml-btn-primary:hover, .wml-btn-outline:hover, .wml-btn-amber:hover,
          .wml-btn-dark:hover, .wml-btn-ghost:hover,
          .wml-hero-btn-primary:hover, .wml-hero-btn-outline:hover { transform: none; }
        }
      `}</style>

      <div className="wml-page">

        {/* ════════ HERO ════════ */}
        <section className="wml-hero" ref={heroRef}>
          <motion.div
            className="wml-hero__bg"
            style={{ backgroundImage: `url(${bannerImg})`, y: bgY, opacity: bgOpacity, scale: bgScale }}
          />
          <div className="wml-hero__ov" />
          <div className="wml-hero__amber-wash" />
          <div className="wml-hero__grain" />
          <div className="wml-hero__orb" />
          <HeroParticles />

          <div className="wml-hero__inner">

            {/* LEFT */}
            <motion.div style={{ y: textY }}>
              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
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
                initial={{ opacity: 0, y: 44, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.95, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d", perspective: 900 }}
              >
                Three Maryland<br />
                <span className="wml-shimmer">Kitchens.</span>
              </motion.h1>

              <motion.p
                className="wml-hero__sub"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.34 }}
              >
                Each kitchen carries its own specialty — all built on the same Wise Mart standard. Pick yours.
              </motion.p>

              <motion.div
                className="wml-hero__ctas"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <a href="#locations" className="wml-hero-btn-primary">
                  Explore Locations <ArrowRight style={{ width: 14, height: 14 }} />
                </a>
                <Link to="/order" className="wml-hero-btn-outline">
                  Order Now
                </Link>
              </motion.div>

              {/* trust strip */}
              <motion.div
                className="wml-hero__trust"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.72 }}
              >
                {[
                  { icon: Star,   label: "4.8 avg rating" },
                  { icon: MapPin, label: "3 locations"     },
                  { icon: Clock,  label: "Open daily"      },
                ].map((t, i) => (
                  <>
                    {i > 0 && <div key={`sep-${i}`} className="wml-trust-sep" />}
                    <div key={t.label} className="wml-trust-item">
                      <t.icon style={{ width: 12, height: 12 }} />
                      {t.label}
                    </div>
                  </>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — stat cards */}
            <div className="wml-hero__stats" aria-hidden="true">
              {[
                { num: "3",   suffix: "",  label: "Locations",     delay: 0.52 },
                { num: "15",  suffix: "+", label: "Years Serving",  delay: 0.66 },
                { num: "50",  suffix: "+", label: "Menu Items",     delay: 0.80 },
                { num: "★",   suffix: "4.8",label: "Avg. Rating",  delay: 0.94 },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="wml-stat-card"
                  initial={{ opacity: 0, y: 56, rotateX: 16, rotateY: i % 2 === 0 ? -8 : 8, scale: 0.88 }}
                  animate={{ opacity: 1, y: i % 2 === 0 ? 0 : 22, rotateX: 0, rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.88, delay: s.delay, ease: [0.22,1,0.36,1] }}
                  whileHover={{ y: (i % 2 === 0 ? 0 : 22) - 7, rotateY: i%2===0 ? 3:-3, rotateX:-2, scale:1.04, transition:{duration:0.3} }}
                  style={{ transformStyle:"preserve-3d", perspective:900 }}
                >
                  <div className="wml-stat-card__num">{s.num === "★" ? `★ ${s.suffix}` : `${s.num}${s.suffix}`}</div>
                  <div className="wml-stat-card__label">{s.label}</div>
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

        {/* ════════ TICKER ════════ */}
        <div className="wml-ticker" aria-hidden="true">
          <div className="wml-ticker__track">
            {Array.from({ length: 2 }).map((_, pass) =>
              ["Sharptown, MD", "East New Market, MD", "Vienna, MD", "Fresh Daily", "Open 7 Days", "Est. 2010", "Dine-In · Takeout · Delivery"].map((item, i) => (
                <div key={`${pass}-${i}`} className="wml-ticker__item">
                  {item}<span className="wml-ticker__dot" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ════════ STATS BAR ════════ */}
        <div className="wml-statsbar">
          <div className="wml-statsbar__inner">
            {[
              { to: 3,  suffix: "",   label: "Locations"     },
              { to: 15, suffix: "+",  label: "Years Serving" },
              { to: 50, suffix: "+",  label: "Menu Items"    },
              { to: 48, suffix: "/50",label: "Avg. Rating"   },
            ].map((s, i) => (
              <motion.div
                key={s.label} className="wml-sstat"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22,1,0.36,1] }}
              >
                <div className="wml-sstat__num">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="wml-sstat__label">{s.label}</div>
                <span className="wml-sstat__rule" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ════════ SECTION INTRO ════════ */}
        <motion.div
          id="locations"
          className="wml-intro"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
        >
          <span className="wml-intro__eye">
            <span className="wml-intro__eye-line" />
            Our Locations
            <span className="wml-intro__eye-line" />
          </span>
          <h2 className="wml-intro__title">
            Pick Your<br /><em>Wise Mart</em>
          </h2>
          <p className="wml-intro__sub">
            Three Maryland kitchens, each with its own personality — same promise throughout.
          </p>
        </motion.div>

        {/* ════════ LOCATION CARDS ════════ */}
        <div className="wml-cards" role="list">
          {LOCATION_DATA.map((loc, i) => (
            <LocationCard key={loc.slug} loc={loc} index={i} />
          ))}
        </div>

        {/* ════════ CTA BANNER ════════ */}
        <div className="wml-cta-wrap">
          <motion.div
            className="wml-cta-box"
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}
            whileHover={{ scale: 1.007, transition: { duration: 0.36 } }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="wml-cta-box__hatch" />
            <div className="wml-cta-box__circle" />
            <div style={{ position:"relative", zIndex:1 }}>
              <h3 className="wml-cta-box__title">Ready to order?</h3>
              <p className="wml-cta-box__sub">
                Pick your location, place your order, and we'll have it ready when you arrive.
              </p>
            </div>
            <div className="wml-cta-box__btns">
              <Link to="/order"     className="wml-btn-dark">
                Order Now <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
              <Link to="/locations" className="wml-btn-ghost">Find a Location</Link>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}