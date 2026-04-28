import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { Phone, MapPin, Clock, ArrowRight, Navigation, Sparkles, ChevronDown } from "lucide-react";
import { LOCATIONS } from "@/data/site";
import bannerImg from "@/assets/banner-5.webp";

// Real store photos — one per location
import imgSharptown   from "@/assets/sharpown.webp";
import imgEastNew     from "@/assets/east-new.webp";
import imgVienna      from "@/assets/vienna.webp";

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

/* ─────────────────── real location data ─────────────────── */
const LOCATION_DATA = [
  {
    slug:        "sharptown",
    name:        "Sharptown",
    state:       "MD",
    address:     "806 Main St, Sharptown, MD 21861",
    phone:       "(410) 883-3648",
    phoneHref:   "tel:+14108833648",
    hours:       "Sun–Thu 10 AM–10 PM · Fri–Sat 10 AM–11 PM",
    specialty:   "Fresh Dough Pizza · Fried Chicken",
    tagline:     "Our flagship kitchen — hand-stretched pizza and famous double-fried chicken since 2010.",
    photo:       imgSharptown,
    mapsUrl:     "https://www.google.com/maps/search/?api=1&query=806+Main+St+Sharptown+MD+21861",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=806+Main+St+Sharptown+MD+21861",
  },
  {
    slug:        "east-new-market",
    name:        "East New Market",
    state:       "MD",
    address:     "5703 Mt Holly Rd, East New Market, MD 21631",
    phone:       "(410) 943-6270",
    phoneHref:   "tel:+14109436270",
    hours:       "Sun–Thu 10 AM–10 PM · Fri–Sat 10 AM–11 PM",
    specialty:   "Hot Subs · Combo Meals",
    tagline:     "Hearty subs, hot sandwiches, and generous combo meals for the whole crew.",
    photo:       imgEastNew,
    mapsUrl:     "https://www.google.com/maps/search/?api=1&query=5703+Mt+Holly+Rd+East+New+Market+MD+21631",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=5703+Mt+Holly+Rd+East+New+Market+MD+21631",
  },
  {
    slug:        "vienna",
    name:        "Vienna",
    state:       "MD",
    address:     "307 Ocean Gateway, Vienna, MD 21869",
    phone:       "(410) 376-3299",
    phoneHref:   "tel:+14103763299",
    hours:       "Sun–Thu 10 AM–10 PM · Fri–Sat 10 AM–11 PM",
    specialty:   "Fresh Salads · Breakfast",
    tagline:     "Fresh salads, breakfast plates, and lighter fare served with the same Wise Mart care.",
    photo:       imgVienna,
    mapsUrl:     "https://www.google.com/maps/search/?api=1&query=307+Ocean+Gateway+Vienna+MD+21869",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=307+Ocean+Gateway+Vienna+MD+21869",
  },
];

/* ─────────────────── tilt hook ─────────────────── */
function useTilt(strength = 10) {
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]),  { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 300, damping: 30 });
  const scale   = useSpring(1, { stiffness: 300, damping: 25 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
    scale.set(1.025);
  }
  function onLeave() { x.set(0); y.set(0); scale.set(1); }
  return { rotateX, rotateY, scale, onMove, onLeave };
}

function TiltCard({ children, className, strength }: { children: React.ReactNode; className?: string; strength?: number }) {
  const { rotateX, rotateY, scale, onMove, onLeave } = useTilt(strength ?? 8);
  return (
    <motion.div
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────── particles ─────────────────── */
function BannerParticles() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            borderRadius: "50%",
            background: i % 4 === 0 ? "#d97706" : "rgba(255,255,255,0.12)",
            left: `${5 + (i * 5.3) % 90}%`,
            top: `${10 + (i * 7.7) % 80}%`,
          }}
          animate={{ y: [0, -28, 0], opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
          transition={{ duration: 3 + (i % 4), delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function DetailRow({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <li className="wml-detail-row">
      <Icon className="wml-detail-icon" />
      <span>{children}</span>
    </li>
  );
}

/* ─────────────────── page ─────────────────── */
function LocationsPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');

        .wml-page { font-family: 'DM Sans', sans-serif; background: #0a0908; color: #fff; }
        *, *::before, *::after { box-sizing: border-box; }

        /* ── HERO ── */
        .wml-hero {
          position: relative; min-height: 100vh; overflow: hidden;
          background: #0a0908; display: flex; flex-direction: column; justify-content: flex-end;
        }
        .wml-hero__bg {
          position: absolute; inset: -10%;
          background-size: cover; background-position: center 60%; will-change: transform;
        }
        .wml-hero__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,9,8,0.25) 0%, rgba(10,9,8,0.55) 35%, rgba(10,9,8,0.92) 75%, rgba(10,9,8,1.0) 100%);
        }
        .wml-hero__overlay2 {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(10,9,8,0.85) 0%, transparent 60%);
        }
        .wml-hero__inner {
          position: relative; z-index: 2; max-width: 1280px; margin: 0 auto;
          padding: 0 40px 80px; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: flex-end;
        }
        @media(max-width:900px){ .wml-hero__inner { grid-template-columns: 1fr; padding: 0 24px 64px; } }

        .wml-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #d97706;
        }
        .wml-eyebrow::before, .wml-eyebrow::after {
          content: ''; display: inline-block; width: 28px; height: 1px; background: #d97706; opacity: 0.5;
        }
        .wml-hero__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(52px, 8vw, 96px); font-weight: 700;
          line-height: 1.0; letter-spacing: -0.01em; color: #fff; margin-top: 20px;
        }
        .wml-shimmer {
          background: linear-gradient(90deg, #d97706 0%, #fbbf24 40%, #d97706 60%, #b45309 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; animation: wml-shimmer 4s linear infinite;
        }
        @keyframes wml-shimmer { 0%{ background-position:-200% center; } 100%{ background-position:200% center; } }
        .wml-hero__sub { font-size: 16px; color: rgba(255,255,255,0.48); line-height: 1.75; margin-top: 20px; max-width: 460px; }
        .wml-hero__ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }

        .wml-hero__stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-self: flex-end; }
        @media(max-width:900px){ .wml-hero__stats { display: none; } }
        .wml-stat-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(12px); border-radius: 14px; padding: 22px 20px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .wml-stat-card:hover { border-color: rgba(217,119,6,0.4); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .wml-stat-card__num { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 700; color: #d97706; line-height: 1; }
        .wml-stat-card__label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.45); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 6px; }

        .wml-scroll-hint {
          position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 3;
          display: flex; flex-direction: column; align-items: center;
          gap: 5px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.28); animation: wml-bounce 2.4s ease-in-out infinite;
        }
        @keyframes wml-bounce {
          0%,100%{ transform: translateX(-50%) translateY(0); opacity: 0.28; }
          50%    { transform: translateX(-50%) translateY(7px); opacity: 0.65; }
        }

        /* ── STATS BAR ── */
        .wml-statsbar { background: #d97706; }
        .wml-statsbar__inner {
          max-width: 1280px; margin: 0 auto; padding: 0 40px;
          display: grid; grid-template-columns: repeat(4,1fr);
        }
        @media(max-width:640px){ .wml-statsbar__inner { grid-template-columns: repeat(2,1fr); padding: 0 24px; } }
        .wml-sstat { padding: 26px 20px; text-align: center; border-right: 1px solid rgba(0,0,0,0.12); position: relative; overflow: hidden; }
        .wml-sstat:last-child { border-right: none; }
        .wml-sstat::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,0); transition:background .3s; }
        .wml-sstat:hover::after { background: rgba(255,255,255,0.07); }
        .wml-sstat__num   { font-family:'Cormorant Garamond',serif; font-size:38px; font-weight:700; color:#fff; line-height:1; }
        .wml-sstat__label { font-size:10px; font-weight:600; color:rgba(255,255,255,0.78); margin-top:4px; letter-spacing:.1em; text-transform:uppercase; }

        /* ── SECTION HEADER ── */
        .wml-sec-hdr { text-align:center; padding: 80px 40px 0; }
        @media(max-width:640px){ .wml-sec-hdr { padding: 60px 24px 0; } }
        .wml-sec-hdr__eye { font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#d97706; }
        .wml-sec-hdr__title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,60px); font-weight:700; color:#fff; margin-top:12px; line-height:1.0; }
        .wml-sec-hdr__sub { font-size:14px; color:rgba(255,255,255,0.38); margin-top:10px; max-width:480px; margin-left:auto; margin-right:auto; }

        /* ── LOCATION CARDS ── */
        .wml-locs { max-width:1280px; margin:0 auto; padding: 56px 40px 100px; display:flex; flex-direction:column; gap:32px; }
        @media(max-width:640px){ .wml-locs { padding: 40px 24px 80px; gap:24px; } }

        .wml-card {
          display: grid; grid-template-columns: 1fr 1fr;
          border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08); background: #0f0e0d;
          transition: border-color .35s, box-shadow .35s; position: relative;
        }
        .wml-card::before {
          content:''; position:absolute; inset:0;
          background: radial-gradient(circle at 0% 50%, rgba(217,119,6,0.06) 0%, transparent 55%);
          opacity:0; transition:opacity .4s; pointer-events:none; z-index:0;
        }
        .wml-card:hover { border-color: rgba(217,119,6,0.38); box-shadow: 0 28px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(217,119,6,0.12); }
        .wml-card:hover::before { opacity:1; }
        @media(max-width:860px){ .wml-card { grid-template-columns:1fr; } }

        .wml-card--flip { direction: rtl; }
        .wml-card--flip > * { direction: ltr; }
        @media(max-width:860px){ .wml-card--flip { direction:ltr; } }

        /* ── PHOTO PANE (replaces map) ── */
        .wml-card__photo {
          position: relative; min-height: 340px; background: #161412;
          overflow: hidden; flex-shrink: 0;
        }
        .wml-card__photo img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          transition: transform 0.7s ease, filter 0.4s;
          filter: saturate(0.75) brightness(0.88);
        }
        .wml-card:hover .wml-card__photo img {
          transform: scale(1.05);
          filter: saturate(1) brightness(0.95);
        }

        /* Gradient overlay on photo bottom for legibility */
        .wml-card__photo::after {
          content: ''; position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(10,9,8,0.55) 100%
          );
          pointer-events: none;
        }

        /* Pin badge — links to Google Maps */
        .wml-card__pin {
          position: absolute; top: 16px; left: 16px; z-index: 2;
          width: 44px; height: 44px; border-radius: 50%;
          background: #d97706;
          display: flex; align-items: center; justify-content: center;
          color: #fff; box-shadow: 0 8px 24px rgba(217,119,6,0.45);
          animation: wml-pin-bounce 2.2s ease-in-out infinite;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .wml-card__pin:hover {
          background: #b45309;
          box-shadow: 0 12px 32px rgba(217,119,6,0.6);
          animation: none;
          transform: scale(1.12);
        }
        @keyframes wml-pin-bounce {
          0%,100%{ transform:translateY(0) scale(1); }
          50%    { transform:translateY(-6px) scale(1.08); }
        }

        /* Location number watermark */
        .wml-card__watermark {
          position: absolute; bottom: -10px; right: 12px; z-index: 2;
          font-family: 'Cormorant Garamond', serif;
          font-size: 100px; font-weight: 700; line-height: 1;
          color: rgba(255,255,255,0.07); pointer-events: none; user-select: none;
        }

        /* ── INFO PANE ── */
        .wml-card__info {
          padding: 40px 44px; position: relative; z-index: 1;
          display: flex; flex-direction: column; justify-content: center;
        }
        @media(max-width:640px){ .wml-card__info { padding: 28px 24px; } }

        .wml-card__num { font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,0.2); }
        .wml-card__badge {
          display:inline-block; background:rgba(217,119,6,0.15); color:#d97706;
          font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          padding:4px 12px; border-radius:50px; margin-top:16px; border:1px solid rgba(217,119,6,0.25);
        }
        .wml-card__name {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(32px,4vw,46px); font-weight:700;
          color:#fff; margin-top:12px; line-height:1.0;
        }
        .wml-card__tagline { font-size:14px; color:rgba(255,255,255,0.4); margin-top:8px; line-height:1.65; }
        .wml-card__divider { width:36px; height:2px; background:#d97706; border-radius:2px; margin:24px 0; }

        .wml-card__details { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:12px; }
        .wml-detail-row { display:flex; align-items:flex-start; gap:12px; font-size:13px; color:rgba(255,255,255,0.65); line-height:1.55; }
        .wml-detail-icon { width:15px; height:15px; color:#d97706; flex-shrink:0; margin-top:1px; }

        .wml-card__actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:28px; }

        .wml-btn-primary {
          display:inline-flex; align-items:center; gap:7px; padding:11px 22px;
          background:#d97706; color:#fff; font-family:'DM Sans',sans-serif;
          font-size:13px; font-weight:600; border-radius:8px; text-decoration:none;
          transition:background .2s, transform .2s, box-shadow .2s;
        }
        .wml-btn-primary:hover { background:#b45309; transform:translateY(-2px); box-shadow:0 10px 28px rgba(217,119,6,.35); }
        .wml-btn-primary svg { width:14px; height:14px; }

        .wml-btn-outline {
          display:inline-flex; align-items:center; gap:7px; padding:11px 20px;
          background:transparent; border:1px solid rgba(255,255,255,0.15);
          color:rgba(255,255,255,0.72); font-family:'DM Sans',sans-serif;
          font-size:13px; font-weight:500; border-radius:8px; text-decoration:none;
          transition:border-color .2s, color .2s, background .2s, transform .2s;
        }
        .wml-btn-outline:hover { border-color:rgba(255,255,255,.55); color:#fff; background:rgba(255,255,255,.06); transform:translateY(-2px); }
        .wml-btn-outline svg { width:14px; height:14px; }

        .wml-btn-menu {
          display:inline-flex; align-items:center; gap:7px; padding:11px 20px;
          background:transparent; border:1px solid rgba(217,119,6,0.3); color:#d97706;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
          border-radius:8px; text-decoration:none;
          transition:border-color .2s, background .2s, transform .2s;
        }
        .wml-btn-menu:hover { border-color:#d97706; background:rgba(217,119,6,.08); transform:translateY(-2px); }
        .wml-btn-menu svg { width:14px; height:14px; }

        /* ── CTA BANNER ── */
        .wml-cta { padding:0 40px 100px; max-width:1280px; margin:0 auto; }
        @media(max-width:640px){ .wml-cta { padding:0 24px 72px; } }
        .wml-cta-box {
          border-radius:20px; overflow:hidden; background:#d97706;
          padding:60px 52px; display:grid; grid-template-columns:1fr auto;
          gap:32px; align-items:center; position:relative;
        }
        @media(max-width:700px){ .wml-cta-box { grid-template-columns:1fr; padding:40px 32px; } }
        .wml-cta-box::before {
          content:''; position:absolute; inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity:.4;
        }
        .wml-cta-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,4vw,52px); font-weight:700; color:#fff; line-height:1.05; position:relative; }
        .wml-cta-sub { font-size:15px; color:rgba(255,255,255,0.82); margin-top:10px; position:relative; max-width:420px; }
        .wml-cta-btns { display:flex; flex-wrap:wrap; gap:12px; position:relative; }
        .wml-btn-dark  { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; background:#0a0908; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; border-radius:8px; text-decoration:none; transition:background .2s, transform .2s; }
        .wml-btn-dark:hover  { background:#1a1612; transform:translateY(-2px); }
        .wml-btn-light { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; background:rgba(255,255,255,0.15); color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; border-radius:8px; text-decoration:none; border:1px solid rgba(255,255,255,0.3); transition:background .2s, transform .2s; }
        .wml-btn-light:hover { background:rgba(255,255,255,0.25); transform:translateY(-2px); }
      `}</style>

      <div className="wml-page">

        {/* ════════ HERO BANNER ════════ */}
        <section className="wml-hero" ref={heroRef}>
          <motion.div
            className="wml-hero__bg"
            style={{ backgroundImage: `url(${bannerImg})`, y: bgY, opacity: bgOpacity, scale: bgScale }}
          />
          <div className="wml-hero__overlay" />
          <div className="wml-hero__overlay2" />
          <BannerParticles />

          <div className="wml-hero__inner">
            {/* LEFT */}
            <motion.div style={{ y: textY }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="wml-eyebrow">
                  <Sparkles style={{ width: 11, height: 11 }} />
                  Find Us
                </span>
              </motion.div>

              <motion.h1
                className="wml-hero__title"
                initial={{ opacity: 0, y: 44, rotateX: 12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d", perspective: 800 }}
              >
                Three Maryland<br />
                <span className="wml-shimmer">Kitchens.</span>
              </motion.h1>

              <motion.p
                className="wml-hero__sub"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                Each with its own specialties — all serving the same Wise Mart standard. Pick your kitchen.
              </motion.p>

              <motion.div
                className="wml-hero__ctas"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.52 }}
              >
                <a href="#locations" className="wml-btn-primary">
                  Explore Locations <ArrowRight style={{ width: 15, height: 15 }} />
                </a>
                <Link to="/order" className="wml-btn-outline">
                  Order Now
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT — floating stat cards */}
            <div className="wml-hero__stats">
              {[
                { num: "3",    label: "Locations",    delay: 0.5  },
                { num: "15+",  label: "Years Serving", delay: 0.65 },
                { num: "50+",  label: "Menu Items",   delay: 0.8  },
                { num: "★4.8", label: "Avg. Rating",  delay: 0.95 },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="wml-stat-card"
                  initial={{ opacity: 0, y: 60, rotateX: 20, rotateY: i % 2 === 0 ? -10 : 10, scale: 0.85 }}
                  animate={{ opacity: 1, y: i % 2 === 0 ? 0 : 24, rotateX: 0, rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.85, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: (i % 2 === 0 ? 0 : 24) - 6, rotateY: i % 2 === 0 ? 4 : -4, rotateX: -3, scale: 1.04, transition: { duration: 0.3 } }}
                  style={{ transformStyle: "preserve-3d", perspective: 900 }}
                >
                  <div className="wml-stat-card__num">{s.num}</div>
                  <div className="wml-stat-card__label">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="wml-scroll-hint">
            <span>scroll</span>
            <ChevronDown style={{ width: 15, height: 15 }} />
          </div>
        </section>

        {/* ════════ STATS BAR ════════ */}
        <motion.div
          className="wml-statsbar"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <div className="wml-statsbar__inner">
            {[
              { num: "3",    label: "Locations"     },
              { num: "15+",  label: "Years Serving"  },
              { num: "50+",  label: "Menu Items"    },
              { num: "★4.8", label: "Avg. Rating"   },
            ].map((s, i) => (
              <motion.div
                key={s.label} className="wml-sstat"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="wml-sstat__num">{s.num}</div>
                <div className="wml-sstat__label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════════ SECTION HEADER ════════ */}
        <motion.div
          className="wml-sec-hdr"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          id="locations"
        >
          <div className="wml-sec-hdr__eye">Our Locations</div>
          <h2 className="wml-sec-hdr__title">Pick Your Wise Mart</h2>
          <p className="wml-sec-hdr__sub">Three Maryland kitchens with their own personality — same Wise Mart promise.</p>
        </motion.div>

        {/* ════════ LOCATION CARDS ════════ */}
        <div className="wml-locs">
          {LOCATION_DATA.map((loc, i) => (
            <motion.div
              key={loc.slug}
              initial={{ opacity: 0, y: 60, rotateX: 8, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <TiltCard strength={5}>
                <div className={`wml-card${i % 2 !== 0 ? " wml-card--flip" : ""}`}>

                  {/* ── PHOTO PANE ── */}
                  <div className="wml-card__photo">
                    <img src={loc.photo} alt={`Wise Mart ${loc.name}`} loading={i === 0 ? undefined : "lazy"} />

                    {/* Pin icon links to Google Maps */}
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wml-card__pin"
                      title={`View ${loc.name} on Google Maps`}
                    >
                      <MapPin style={{ width: 20, height: 20 }} />
                    </a>

                    <div className="wml-card__watermark">0{i + 1}</div>
                  </div>

                  {/* ── INFO PANE ── */}
                  <div className="wml-card__info">
                    <div className="wml-card__num">Location 0{i + 1}</div>
                    <div className="wml-card__badge">{loc.specialty}</div>

                    <h2 className="wml-card__name">
                      {loc.name}
                      <br />
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.6em", fontWeight: 600 }}>
                        {loc.state}
                      </span>
                    </h2>
                    <p className="wml-card__tagline">{loc.tagline}</p>

                    <div className="wml-card__divider" />

                    <ul className="wml-card__details">
                      <DetailRow icon={MapPin}>{loc.address}</DetailRow>
                      <DetailRow icon={Clock}>{loc.hours}</DetailRow>
                      <DetailRow icon={Phone}>
                        <a href={loc.phoneHref} style={{ color: "inherit", textDecoration: "none" }}>
                          {loc.phone}
                        </a>
                      </DetailRow>
                    </ul>

                    <div className="wml-card__actions">
                      <motion.a
                        href={loc.phoneHref}
                        className="wml-btn-primary"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Phone style={{ width: 14, height: 14 }} /> Call Now
                      </motion.a>

                      <motion.a
                        href={loc.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wml-btn-outline"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Navigation style={{ width: 14, height: 14 }} /> Directions
                      </motion.a>

                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        <Link
                          to="/menu/$location"
                          params={{ location: loc.slug }}
                          className="wml-btn-menu"
                        >
                          View Menu <ArrowRight style={{ width: 14, height: 14 }} />
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* ════════ CTA BANNER ════════ */}
        <div className="wml-cta">
          <motion.div
            className="wml-cta-box"
            initial={{ opacity: 0, y: 40, rotateX: 8, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <div>
              <h3 className="wml-cta-title">Ready to order?</h3>
              <p className="wml-cta-sub">Pick your location, place your order, and we'll have it ready when you arrive.</p>
            </div>
            <div className="wml-cta-btns">
              <Link to="/order"     className="wml-btn-dark">Order Now</Link>
              <Link to="/locations" className="wml-btn-light">Find a Location</Link>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}