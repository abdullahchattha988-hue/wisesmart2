import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Pizza,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { LOCATIONS, SITE } from "@/data/site";
import bannerImg from "@/assets/banner-3.webp";
import heroPizza from "@/assets/hero-pizza.jpg";
import heroChicken from "@/assets/hero-chicken.jpg";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order Online — Wise Mart | Maryland Restaurants" },
      {
        name: "description",
        content:
          "Order fresh pizza, famous fried chicken, subs, and salads from Wise Mart. Three Maryland locations — pickup or delivery.",
      },
      { property: "og:title", content: "Order Online — Wise Mart" },
      {
        property: "og:description",
        content: "Pick your location and order from Wise Mart. Fresh food, fast service.",
      },
    ],
  }),
  component: OrderPage,
});

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick a Location",
    desc: "Choose your nearest Wise Mart — Sharptown, East New Market, or Vienna.",
  },
  {
    step: "02",
    title: "Build Your Order",
    desc: "Browse the full menu and customize every item exactly the way you like.",
  },
  {
    step: "03",
    title: "Pick Up or Delivery",
    desc: "Swing by when it's ready, or let us bring it straight to your door.",
  },
];

const PLATFORMS = [
  { name: "DoorDash", color: "#FF3008", desc: "Fast delivery to your door" },
  { name: "Uber Eats", color: "#06C167", desc: "Track your order in real time" },
  { name: "Grubhub", color: "#F63440", desc: "Easy reorder from history" },
];

type Location = (typeof LOCATIONS)[number];

function useFinePointer() {
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(media.matches);
    sync();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    }
    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);
  return finePointer;
}

function SectionIntro({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`wm-intro wm-intro--${align}`}>
      <span className="wm-eyebrow">
        <span className="wm-eyebrow__line" />
        {eyebrow}
        <span className="wm-eyebrow__line" />
      </span>
      <h2 className="wm-display wm-section-title">{title}</h2>
      {body ? <div className="wm-section-sub">{body}</div> : null}
    </div>
  );
}

function LocationOrderCard({ location, index }: { location: Location; index: number }) {
  return (
    <motion.article
      className="wm-location-card"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="interactive"
    >
      <div className="wm-location-card__glow" />
      <div className="wm-location-card__head">
        <span className="wm-location-card__kicker">0{index + 1} / Maryland</span>
        <span className="wm-location-card__specialty">{location.specialty}</span>
      </div>
      <h3 className="wm-display wm-location-card__title">{location.name}</h3>
      <p className="wm-location-card__copy">{location.tagline}</p>
      <div className="wm-location-card__addr">
        <MapPin size={12} />
        {location.address}
      </div>
      <div className="wm-location-card__rail" />
      <div className="wm-location-card__actions">
        <Link to="/locations" className="wm-button wm-button--primary wm-button--small">
          <ShoppingBag size={13} /> Order from {location.name}
        </Link>
        <a href={location.phoneHref} className="wm-location-card__phone">
          <Phone />
          {location.phone}
        </a>
      </div>
    </motion.article>
  );
}

function OrderPage() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const interactiveMotion = finePointer && !prefersReducedMotion;

  const { scrollYProgress: pageProgress } = useScroll();
  const progress = useSpring(pageProgress, { stiffness: 180, damping: 26 });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], interactiveMotion ? ["0%", "18%"] : ["0%", "0%"]);
  const heroScale = useTransform(heroProgress, [0, 1], interactiveMotion ? [1, 1.08] : [1, 1]);
  const heroOpacity = useTransform(heroProgress, [0, 0.9], [1, 0.05]);
  const copyY = useTransform(heroProgress, [0, 1], interactiveMotion ? ["0%", "12%"] : ["0%", "0%"]);

  const pointerX = useMotionValue(-160);
  const pointerY = useMotionValue(-160);
  const cursorX = useSpring(pointerX, { stiffness: 500, damping: 40, mass: 0.25 });
  const cursorY = useSpring(pointerY, { stiffness: 500, damping: 40, mass: 0.25 });
  const cursorAura = useMotionTemplate`radial-gradient(440px circle at ${cursorX}px ${cursorY}px, rgba(235, 113, 38, 0.18) 0%, rgba(235, 113, 38, 0.09) 24%, transparent 62%)`;

  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorHover, setCursorHover] = useState(false);

  useEffect(() => {
    if (!interactiveMotion) {
      setCursorVisible(false);
      setCursorHover(false);
      return;
    }
    const onPointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setCursorVisible(true);
    };
    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      setCursorHover(Boolean(target.closest("a, button, [data-cursor='interactive']")));
    };
    const onPointerOut = (event: PointerEvent) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Element && nextTarget.closest("a, button, [data-cursor='interactive']")) return;
      setCursorHover(false);
    };
    const onHideCursor = () => setCursorVisible(false);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.documentElement.addEventListener("mouseleave", onHideCursor);
    window.addEventListener("blur", onHideCursor);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.documentElement.removeEventListener("mouseleave", onHideCursor);
      window.removeEventListener("blur", onHideCursor);
    };
  }, [interactiveMotion, pointerX, pointerY]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');
        :root {
          --wm-ink: #120d09;
          --wm-ink-soft: #1a130f;
          --wm-ink-raised: #221913;
          --wm-paper: #f7efe3;
          --wm-text: rgba(250, 244, 237, 0.96);
          --wm-text-soft: rgba(250, 244, 237, 0.72);
          --wm-text-faint: rgba(250, 244, 237, 0.48);
          --wm-amber: #eb7126;
          --wm-amber-deep: #c95a12;
          --wm-amber-soft: rgba(235, 113, 38, 0.14);
          --wm-amber-border: rgba(235, 113, 38, 0.3);
          --wm-gold: #f2bc59;
          --wm-border: rgba(250, 244, 237, 0.12);
          --wm-border-soft: rgba(250, 244, 237, 0.08);
          --wm-shadow-lg: 0 26px 70px rgba(0, 0, 0, 0.36);
          --wm-shadow-xl: 0 40px 110px rgba(0, 0, 0, 0.48);
          --wm-shadow-amber: 0 20px 48px rgba(201, 90, 18, 0.28);
          --wm-radius-sm: 14px;
          --wm-radius-md: 20px;
          --wm-radius-lg: 28px;
          --wm-radius-xl: 38px;
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: var(--wm-ink); }
        img { display: block; max-width: 100%; }

        .wm-page {
          position: relative; overflow-x: clip;
          color: var(--wm-text);
          background:
            radial-gradient(circle at 10% 0%, rgba(235, 113, 38, 0.1), transparent 28%),
            radial-gradient(circle at 92% 18%, rgba(242, 188, 89, 0.07), transparent 22%),
            linear-gradient(180deg, #120d09 0%, #15100c 46%, #120d09 100%);
          font-family: "Manrope", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .wm-page__glow { position: fixed; inset: 0; pointer-events: none; z-index: 3; }
        .wm-progress {
          position: fixed; top: 0; left: 0; right: 0; height: 3px;
          transform-origin: left center;
          background: linear-gradient(90deg, #ffcf80 0%, #eb7126 45%, #b54d0c 100%);
          z-index: 30;
        }
        .wm-cursor-outer, .wm-cursor-inner {
          position: fixed; top: 0; left: 0; pointer-events: none; z-index: 31;
        }
        .wm-cursor-outer {
          width: 44px; height: 44px; margin-top: -22px; margin-left: -22px;
          border-radius: 999px; border: 1px solid rgba(255, 207, 128, 0.6);
          background: rgba(235, 113, 38, 0.08);
          transition: width 0.24s ease, height 0.24s ease, margin 0.24s ease, border-color 0.24s ease, background 0.24s ease;
        }
        .wm-cursor-outer.is-hover {
          width: 68px; height: 68px; margin-top: -34px; margin-left: -34px;
          border-color: rgba(255, 207, 128, 0.8); background: rgba(235, 113, 38, 0.16);
        }
        .wm-cursor-inner {
          width: 8px; height: 8px; margin-top: -4px; margin-left: -4px;
          border-radius: 999px; background: #ffcf80; box-shadow: 0 0 24px rgba(255, 207, 128, 0.55);
        }
        .wm-section { width: min(1320px, calc(100vw - 32px)); margin: 0 auto; }
        .wm-display { font-family: "Fraunces", Georgia, serif; font-weight: 600; letter-spacing: -0.03em; line-height: 0.98; }
        .wm-display em { font-style: italic; color: #ffd08d; }

        .wm-intro { position: relative; }
        .wm-intro--center { text-align: center; }
        .wm-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.24em;
          text-transform: uppercase; color: #ffcf80;
        }
        .wm-eyebrow__line {
          width: 30px; height: 1px;
          background: linear-gradient(90deg, rgba(255, 207, 128, 0.95), transparent);
          display: inline-block;
        }
        .wm-section-title { margin: 18px 0 0; font-size: clamp(42px, 5vw, 76px); }
        .wm-section-sub {
          margin-top: 16px; max-width: 650px;
          font-size: 15px; line-height: 1.8; color: var(--wm-text-soft);
        }
        .wm-intro--center .wm-section-sub { margin-left: auto; margin-right: auto; }

        .wm-button {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          min-height: 52px; padding: 0 24px; border-radius: 999px;
          font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease, border-color 0.24s ease, color 0.24s ease;
        }
        .wm-button svg, .wm-link svg, .wm-location-card__phone svg, .wm-location-card__addr svg {
          width: 14px; height: 14px; flex-shrink: 0;
        }
        .wm-button--primary {
          color: white;
          background: linear-gradient(135deg, #f18b3e 0%, #eb7126 48%, #c95a12 100%);
          box-shadow: var(--wm-shadow-amber);
        }
        .wm-button--primary:hover { transform: translateY(-2px); box-shadow: 0 26px 58px rgba(201, 90, 18, 0.4); }
        .wm-button--ghost {
          color: var(--wm-text); border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(12px);
        }
        .wm-button--ghost:hover { transform: translateY(-2px); border-color: rgba(255, 255, 255, 0.26); background: rgba(255, 255, 255, 0.08); }
        .wm-button--dark {
          color: var(--wm-paper); background: rgba(13, 9, 6, 0.82); border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .wm-button--dark:hover { transform: translateY(-2px); background: rgba(18, 13, 9, 0.96); }
        .wm-button--small { min-height: 44px; padding: 0 18px; font-size: 11px; letter-spacing: 0.14em; }
        .wm-link {
          display: inline-flex; align-items: center; gap: 8px;
          color: #ffcf80; text-decoration: none;
          font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
          transition: gap 0.22s ease, color 0.22s ease;
        }
        .wm-link:hover { gap: 14px; color: white; }

        /* ── HERO ── */
        .wm-hero {
          position: relative; min-height: 100svh;
          display: flex; align-items: stretch; overflow: hidden;
        }
        .wm-hero__bg {
          position: absolute; inset: -6%;
          background-position: center; background-size: cover; will-change: transform;
        }
        .wm-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(110deg, rgba(9,6,4,0.94) 0%, rgba(9,6,4,0.82) 42%, rgba(9,6,4,0.38) 74%, rgba(9,6,4,0.12) 100%),
            linear-gradient(180deg, rgba(9,6,4,0.35) 0%, rgba(9,6,4,0.94) 100%);
        }
        .wm-hero__noise {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 170px 170px;
        }
        .wm-hero__beam {
          position: absolute; pointer-events: none;
          inset: auto -10% 8% auto; width: 45vw; height: 45vw;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(242,188,89,0.12) 0%, rgba(235,113,38,0.08) 25%, transparent 70%);
          filter: blur(16px);
        }
        .wm-hero__orb {
          position: absolute; pointer-events: none;
          inset: 12% auto auto 8%; width: 260px; height: 260px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(235,113,38,0.18) 0%, transparent 68%);
          filter: blur(28px);
        }
        .wm-hero__inner {
          position: relative; z-index: 2;
          display: grid; gap: 54px; grid-template-columns: 1fr;
          align-items: center; padding: 132px 0 96px;
        }
        @media(min-width:1040px){ .wm-hero__inner { grid-template-columns: minmax(0, 1.02fr) minmax(430px, 0.98fr); padding-top: 150px; } }

        .wm-hero__copy { max-width: 670px; }
        .wm-hero__badge {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 9px 16px 9px 10px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06);
          backdrop-filter: blur(14px);
        }
        .wm-hero__badge-icon {
          width: 30px; height: 30px; border-radius: 999px;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #f4a756 0%, #eb7126 100%);
          box-shadow: 0 0 0 5px rgba(235,113,38,0.12);
        }
        .wm-hero__badge-icon svg { width: 14px; height: 14px; color: white; }
        .wm-hero__badge-copy {
          font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--wm-text-soft);
        }
        .wm-hero__badge-copy strong { color: white; }
        .wm-hero__title { margin: 28px 0 0; font-size: clamp(62px, 9vw, 118px); }
        .wm-hero__line { display: block; overflow: hidden; }
        .wm-hero__line span { display: block; }
        .wm-hero__line--accent span {
          background: linear-gradient(90deg, #ffe3b1 0%, #f4a756 22%, #eb7126 55%, #ffcf80 100%);
          background-clip: text; -webkit-background-clip: text; color: transparent;
          animation: wm-shimmer 7s linear infinite; background-size: 220% auto;
        }
        @keyframes wm-shimmer {
          0%{ background-position: 0% center; }
          100%{ background-position: 200% center; }
        }
        .wm-hero__sub {
          margin: 24px 0 0; max-width: 560px;
          font-size: 16px; line-height: 1.85; color: var(--wm-text-soft);
        }
        .wm-hero__actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
        .wm-hero__chips { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }

        .wm-chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 14px; border-radius: 999px;
          background: rgba(255,255,255,0.06); border: 1px solid var(--wm-border);
          color: var(--wm-text-soft); font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; backdrop-filter: blur(12px);
        }
        .wm-chip svg { width: 13px; height: 13px; color: #ffcf80; }

        /* Hero right side — showcase */
        .wm-showcase {
          position: relative; display: grid; gap: 16px; align-self: stretch;
        }
        .wm-showcase__hero {
          position: relative; min-height: 420px; overflow: hidden;
          border-radius: var(--wm-radius-xl); border: 1px solid rgba(255,255,255,0.14);
          box-shadow: var(--wm-shadow-xl); background: rgba(255,255,255,0.04);
        }
        .wm-showcase__hero img { width: 100%; height: 100%; object-fit: cover; }
        .wm-showcase__hero::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,7,5,0.1) 0%, rgba(10,7,5,0.16) 34%, rgba(10,7,5,0.9) 100%);
        }
        .wm-showcase__hero-copy {
          position: absolute; inset: auto 26px 24px 26px; z-index: 1;
        }
        .wm-showcase__label {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 999px;
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.14);
          font-size: 10px; font-weight: 800; letter-spacing: 0.16em;
          text-transform: uppercase; color: #ffe1aa; backdrop-filter: blur(12px);
        }
        .wm-showcase__title { margin: 18px 0 0; font-size: clamp(32px,4vw,48px); line-height: 1.02; }
        .wm-showcase__copy {
          margin: 12px 0 0; max-width: 420px;
          font-size: 14px; line-height: 1.8; color: rgba(250,244,237,0.78);
        }
        .wm-showcase__cta { margin-top: 20px; }
        .wm-showcase__stamp {
          position: absolute; top: 20px; right: 20px; z-index: 1;
          min-width: 108px; padding: 12px 14px; border-radius: 24px;
          background: rgba(16,11,8,0.7); border: 1px solid rgba(255,255,255,0.12);
          text-align: center; backdrop-filter: blur(12px); box-shadow: var(--wm-shadow-lg);
        }
        .wm-showcase__stamp small {
          display: block; font-size: 9px; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--wm-text-faint);
        }
        .wm-showcase__stamp strong {
          display: block; margin-top: 4px;
          font-family: "Fraunces", Georgia, serif;
          font-size: 28px; font-weight: 700; color: white; line-height: 1;
        }
        .wm-showcase__grid {
          display: grid; gap: 14px; grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .wm-showcase__mini {
          position: relative; overflow: hidden; min-height: 180px;
          border-radius: 26px; border: 1px solid var(--wm-border);
          background: rgba(255,255,255,0.05); box-shadow: var(--wm-shadow-lg);
        }
        .wm-showcase__mini img { width: 100%; height: 100%; object-fit: cover; }
        .wm-showcase__mini::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(12,8,6,0.1) 0%, rgba(12,8,6,0.7) 100%);
        }
        .wm-showcase__mini-copy { position: absolute; inset: auto 16px 16px; z-index: 1; }
        .wm-showcase__mini-tag { font-size: 9px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #ffe1aa; }
        .wm-showcase__mini-name { margin-top: 6px; font-size: 15px; font-weight: 700; color: white; line-height: 1.3; }
        .wm-showcase__mini-price { margin-top: 5px; font-size: 12px; color: rgba(250,244,237,0.74); }

        .wm-scroll-cue {
          position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 2;
          color: var(--wm-text-faint); font-size: 10px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
        }
        .wm-scroll-cue__track {
          width: 1px; height: 54px; background: rgba(255,255,255,0.12);
          position: relative; overflow: hidden;
        }
        .wm-scroll-cue__track::after {
          content: ""; position: absolute; top: -100%; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(180deg, transparent, #ffcf80, transparent);
          animation: wm-scroll-drop 2.15s ease-in-out infinite;
        }
        @keyframes wm-scroll-drop {
          0%{ top: -100%; opacity: 0; }
          20%{ opacity: 1; }
          100%{ top: 100%; opacity: 0; }
        }

        /* ── MARQUEE ── */
        .wm-marquee {
          position: relative; overflow: hidden; padding: 16px 0;
          background: linear-gradient(90deg, #f3b154 0%, #eb7126 36%, #c95a12 100%);
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .wm-marquee::before, .wm-marquee::after {
          content: ""; position: absolute; top: 0; bottom: 0; width: 70px;
          pointer-events: none; z-index: 1;
        }
        .wm-marquee::before { left: 0; background: linear-gradient(90deg, rgba(235,113,38,1), rgba(235,113,38,0)); }
        .wm-marquee::after  { right: 0; background: linear-gradient(270deg, rgba(201,90,18,1), rgba(201,90,18,0)); }
        .wm-marquee__track {
          display: flex; width: max-content;
          animation: wm-marquee-scroll 28s linear infinite;
        }
        .wm-marquee__item {
          display: inline-flex; align-items: center; gap: 18px;
          padding: 0 28px; font-size: 11px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.95); white-space: nowrap;
        }
        .wm-marquee__dot {
          width: 5px; height: 5px; border-radius: 999px;
          background: rgba(255,255,255,0.58); flex-shrink: 0;
        }
        @keyframes wm-marquee-scroll {
          from{ transform: translateX(0); }
          to{ transform: translateX(-50%); }
        }

        /* ── STATS ── */
        .wm-stats { padding: 34px 0 0; }
        .wm-stats__panel {
          display: grid; gap: 1px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          overflow: hidden; border-radius: 32px;
          border: 1px solid var(--wm-border-soft);
          background: rgba(255,255,255,0.07); box-shadow: var(--wm-shadow-lg);
        }
        .wm-stat {
          position: relative; padding: 30px 24px;
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%), rgba(19,13,9,0.92);
          overflow: hidden;
        }
        .wm-stat::after {
          content: ""; position: absolute; left: 24px; right: 24px; bottom: 0;
          height: 2px; transform: scaleX(0); transform-origin: left center;
          transition: transform 0.28s ease;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
        }
        .wm-stat:hover::after { transform: scaleX(1); }
        .wm-stat__value {
          font-family: "Fraunces", Georgia, serif;
          font-size: clamp(36px, 4vw, 52px); font-weight: 700; color: white; line-height: 1;
        }
        .wm-stat__label {
          margin-top: 10px; font-size: 11px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase; color: var(--wm-text-faint);
        }

        /* ── ORDER SECTION ── */
        .wm-order { padding: 110px 0; }
        .wm-locations__grid {
          display: grid; gap: 20px;
          grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 56px;
        }

        /* ── LOCATION CARD ── */
        .wm-location-card {
          position: relative; padding: 30px; min-height: 340px;
          display: flex; flex-direction: column;
          border-radius: 30px; border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%),
            rgba(18,13,9,0.86);
          overflow: hidden; box-shadow: var(--wm-shadow-lg);
          transition: transform 0.26s ease, border-color 0.26s ease, box-shadow 0.26s ease;
        }
        .wm-location-card:hover {
          transform: translateY(-4px);
          border-color: var(--wm-amber-border);
          box-shadow: 0 28px 76px rgba(0,0,0,0.42);
        }
        .wm-location-card__glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at top right, rgba(235,113,38,0.14), transparent 42%);
          opacity: 0; transition: opacity 0.26s ease; pointer-events: none;
        }
        .wm-location-card:hover .wm-location-card__glow { opacity: 1; }
        .wm-location-card__head {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;
        }
        .wm-location-card__kicker, .wm-location-card__specialty {
          font-size: 10px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase;
        }
        .wm-location-card__kicker { color: var(--wm-text-faint); }
        .wm-location-card__specialty { color: #ffcf80; }
        .wm-location-card__title { margin: 24px 0 0; font-size: 38px; line-height: 1.02; }
        .wm-location-card__copy {
          margin-top: 14px; max-width: 28ch;
          font-size: 14px; line-height: 1.8; color: var(--wm-text-soft);
        }
        .wm-location-card__addr {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px; font-size: 12px; color: var(--wm-text-faint);
          line-height: 1.5;
        }
        .wm-location-card__rail {
          margin-top: 20px; width: 54px; height: 2px;
          background: linear-gradient(90deg, #ffcf80, #eb7126); border-radius: 999px;
        }
        .wm-location-card__actions {
          margin-top: auto; padding-top: 28px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 14px; flex-wrap: wrap;
        }
        .wm-location-card__phone {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--wm-text-soft); font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none;
        }
        .wm-location-card__phone:hover { color: white; }

        /* ── HOW IT WORKS ── */
        .wm-how {
          padding: 110px 0;
          background:
            radial-gradient(circle at 84% 14%, rgba(235,113,38,0.1), transparent 18%),
            rgba(255,255,255,0.015);
        }
        .wm-how__grid {
          display: grid; gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 56px;
        }
        .wm-how__step {
          position: relative; padding: 36px 30px; min-height: 260px;
          border-radius: 28px; border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)),
            rgba(23,16,12,0.9);
          overflow: hidden; transition: transform 0.26s ease, border-color 0.26s ease, box-shadow 0.26s ease;
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-how__step:hover {
          transform: translateY(-4px);
          border-color: var(--wm-amber-border);
          box-shadow: 0 28px 68px rgba(0,0,0,0.4);
        }
        .wm-how__step::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 25% 25%, rgba(217,119,6,0.09) 0%, transparent 65%);
          opacity: 0; transition: opacity 0.4s;
        }
        .wm-how__step:hover::before { opacity: 1; }
        .wm-how__step-num {
          font-family: "Fraunces", Georgia, serif; font-size: 64px; font-weight: 300;
          color: rgba(217,119,6,0.18); line-height: 1;
        }
        .wm-how__step-title { margin: 22px 0 0; font-size: 28px; line-height: 1.08; }
        .wm-how__step-desc {
          margin-top: 12px; font-size: 14px; line-height: 1.75; color: var(--wm-text-soft);
        }
        .wm-how__step-arrow { margin-top: 20px; color: #eb7126; }

        /* ── DELIVERY ── */
        .wm-delivery { padding: 110px 0; }
        .wm-delivery__grid {
          display: grid; gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 56px;
        }
        .wm-platform {
          position: relative; padding: 28px; border-radius: 28px;
          border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)),
            rgba(19,13,9,0.9);
          display: flex; align-items: center; gap: 18px;
          transition: transform 0.26s ease, border-color 0.26s ease, box-shadow 0.26s ease;
          box-shadow: var(--wm-shadow-lg); text-decoration: none; overflow: hidden;
        }
        .wm-platform::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 20% 50%, rgba(217,119,6,0.06) 0%, transparent 65%);
          opacity: 0; transition: opacity 0.4s;
        }
        .wm-platform:hover {
          transform: translateY(-4px);
          border-color: var(--wm-amber-border);
          box-shadow: 0 28px 68px rgba(0,0,0,0.4);
        }
        .wm-platform:hover::before { opacity: 1; }
        .wm-platform__dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
        .wm-platform__name {
          font-family: "Fraunces", Georgia, serif; font-size: 28px; font-weight: 600; color: white; line-height: 1.1;
        }
        .wm-platform__desc { font-size: 13px; color: var(--wm-text-soft); margin-top: 4px; }
        .wm-platform__arrow { margin-left: auto; color: #eb7126; flex-shrink: 0; }

        /* ── CATERING ── */
        .wm-catering { padding: 110px 0; }
        .wm-catering__layout {
          display: grid; gap: 56px;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.96fr); align-items: center;
        }
        .wm-catering__frame {
          position: relative; overflow: hidden;
          border-radius: 34px; border: 1px solid var(--wm-border);
          box-shadow: var(--wm-shadow-xl);
          aspect-ratio: 16 / 10;
        }
        .wm-catering__frame img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease; }
        .wm-catering__frame:hover img { transform: scale(1.04); }
        .wm-catering__frame::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(12,8,6,0.06) 0%, rgba(12,8,6,0.7) 100%);
        }
        .wm-catering__caption {
          position: absolute; left: 24px; right: 24px; bottom: 22px; z-index: 1;
          font-family: "Fraunces", Georgia, serif; font-size: 20px; font-style: italic;
          color: rgba(250,244,237,0.92);
        }
        .wm-catering__body-lead {
          margin: 22px 0 0; padding-left: 18px;
          border-left: 2px solid var(--wm-amber);
          font-family: "Fraunces", Georgia, serif;
          font-size: 20px; font-style: italic; line-height: 1.7;
          color: rgba(250,244,237,0.86);
        }
        .wm-catering__body-text {
          margin-top: 18px; font-size: 15px; line-height: 1.85; color: var(--wm-text-soft);
        }
        .wm-catering__action { margin-top: 28px; }

        /* ── CTA ── */
        .wm-cta { padding: 34px 0 80px; }
        .wm-cta__panel {
          position: relative; overflow: hidden;
          display: grid; gap: 24px; align-items: center;
          grid-template-columns: minmax(0, 1fr) auto;
          padding: 54px; border-radius: 36px;
          border: 1px solid rgba(255,255,255,0.12);
          background-size: cover; background-position: center;
          box-shadow: var(--wm-shadow-xl);
        }
        .wm-cta__panel::before {
          content: ""; position: absolute; inset: 0;
          background:
            linear-gradient(110deg, rgba(16,11,8,0.92) 0%, rgba(16,11,8,0.74) 48%, rgba(16,11,8,0.54) 100%),
            radial-gradient(circle at 18% 40%, rgba(235,113,38,0.22), transparent 40%);
        }
        .wm-cta__panel > * { position: relative; z-index: 1; }
        .wm-cta__eyebrow {
          font-size: 11px; font-weight: 800; letter-spacing: 0.18em;
          text-transform: uppercase; color: #ffcf80;
        }
        .wm-cta__title { margin: 14px 0 0; font-size: clamp(38px, 4.4vw, 64px); line-height: 1; }
        .wm-cta__copy {
          margin-top: 14px; max-width: 560px;
          font-size: 15px; line-height: 1.8; color: rgba(250,244,237,0.78);
        }
        .wm-cta__actions { display: flex; flex-wrap: wrap; gap: 14px; }

        /* ── RESPONSIVE ── */
        @media(max-width:1180px) {
          .wm-catering__layout { grid-template-columns: 1fr; }
        }
        @media(max-width:960px) {
          .wm-stats__panel { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .wm-cta__panel { grid-template-columns: 1fr; }
        }
        @media(max-width:720px) {
          .wm-order, .wm-how, .wm-delivery, .wm-catering, .wm-cta { padding: 82px 0; }
          .wm-section { width: min(1320px, calc(100vw - 24px)); }
          .wm-hero__inner { padding: 122px 0 90px; }
          .wm-hero__title { font-size: clamp(52px, 14vw, 74px); }
          .wm-hero__sub { font-size: 15px; }
          .wm-showcase__hero { min-height: 360px; }
          .wm-showcase__grid { grid-template-columns: 1fr; }
          .wm-showcase__mini { min-height: 150px; }
          .wm-stats__panel,
          .wm-locations__grid,
          .wm-how__grid,
          .wm-delivery__grid { grid-template-columns: 1fr; }
          .wm-cta__panel { padding: 36px 26px; border-radius: 28px; }
          .wm-cta__actions, .wm-hero__actions { flex-direction: column; align-items: stretch; }
          .wm-button, .wm-button--small { width: 100%; }
        }
        @media(hover: none) {
          .wm-button:hover, .wm-link:hover, .wm-location-card:hover, .wm-how__step:hover, .wm-platform:hover { transform: none; }
        }
        @media(prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <motion.div className="wm-progress" style={{ scaleX: progress }} />

      {interactiveMotion ? (
        <>
          <motion.div
            className="wm-page__glow"
            style={{ background: cursorAura }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.div
            className={`wm-cursor-outer${cursorHover ? " is-hover" : ""}`}
            style={{ x: cursorX, y: cursorY }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.16 }}
          />
          <motion.div
            className="wm-cursor-inner"
            style={{ x: cursorX, y: cursorY }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.12 }}
          />
        </>
      ) : null}

      <div className="wm-page">

        {/* ════════════ HERO ════════════ */}
        <section ref={heroRef} className="wm-hero">
          <motion.div
            className="wm-hero__bg"
            style={{
              backgroundImage: `url(${bannerImg})`,
              y: heroY,
              scale: heroScale,
              opacity: heroOpacity,
            }}
          />
          <div className="wm-hero__overlay" />
          <div className="wm-hero__noise" />
          <div className="wm-hero__beam" />
          <div className="wm-hero__orb" />

          <div className="wm-section wm-hero__inner">
            <motion.div
              className="wm-hero__copy"
              style={{ y: copyY }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wm-hero__badge">
                <span className="wm-hero__badge-icon">
                  <Sparkles />
                </span>
                <span className="wm-hero__badge-copy">
                  <strong>Order Online</strong> — Pickup or Delivery
                </span>
              </div>

              <h1 className="wm-display wm-hero__title">
                {["Fresh Food.", "Your Way."].map((line, index) => (
                  <span key={line} className={`wm-hero__line${index === 1 ? " wm-hero__line--accent" : ""}`}>
                    <motion.span
                      initial={{ y: "110%", rotateX: 12 }}
                      animate={{ y: "0%", rotateX: 0 }}
                      transition={{ duration: 0.95, delay: 0.08 + index * 0.16, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                className="wm-hero__sub"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42 }}
              >
                Pick your location, build your order, and we'll have something hot and fresh waiting for you. Three Maryland kitchens, one promise.
              </motion.p>

              <motion.div
                className="wm-hero__actions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.55 }}
              >
                <a href="#order-now" className="wm-button wm-button--primary">
                  <ShoppingBag size={15} /> Order Now
                </a>
                <Link to="/locations" className="wm-button wm-button--ghost">
                  View Menus <ArrowRight size={15} />
                </Link>
              </motion.div>

              <motion.div
                className="wm-hero__chips"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.7 }}
              >
                <span className="wm-chip"><Clock />Ready in ~15 min</span>
                <span className="wm-chip"><Truck />Pickup or delivery</span>
                <span className="wm-chip"><Star />★ 4.8 avg. rating</span>
              </motion.div>
            </motion.div>

            {/* Right side showcase */}
            <motion.div
              className="wm-showcase"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.86, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wm-showcase__hero">
                <img src={bannerImg} alt="Wise Mart food spread ready for pickup" />
                <div className="wm-showcase__hero-copy">
                  <span className="wm-showcase__label"><ShoppingBag size={10} /> Three Kitchens</span>
                  <h2 className="wm-display wm-showcase__title">Hot, fresh, and ready when you are.</h2>
                  <p className="wm-showcase__copy">
                    Maryland comfort food done right — pizza, fried chicken, subs, salads, breakfast, and more.
                  </p>
                  <div className="wm-showcase__cta">
                    <a href="#order-now" className="wm-link">
                      Pick Your Location <ArrowRight />
                    </a>
                  </div>
                </div>
                <div className="wm-showcase__stamp">
                  <small>Est.</small>
                  <strong>{SITE.established}</strong>
                </div>
              </div>
              <div className="wm-showcase__grid">
                {[
                  { img: heroPizza, tag: "Signature", name: "Hand-Stretched Pizza", price: "from $12.99" },
                  { img: heroChicken, tag: "Best Seller", name: "Famous Fried Chicken", price: "from $6.99" },
                  { img: bannerImg, tag: "Fan Favorite", name: "Hot Subs & Steaks", price: "from $11.99" },
                ].map((item) => (
                  <div key={item.name} className="wm-showcase__mini">
                    <img src={item.img} alt={item.name} loading="lazy" />
                    <div className="wm-showcase__mini-copy">
                      <div className="wm-showcase__mini-tag">{item.tag}</div>
                      <div className="wm-showcase__mini-name">{item.name}</div>
                      <div className="wm-showcase__mini-price">{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="wm-scroll-cue">
            <div className="wm-scroll-cue__track" />
            <span>Scroll</span>
          </div>
        </section>

        {/* ════════════ MARQUEE ════════════ */}
        <section className="wm-marquee" aria-label="Highlights">
          <div className="wm-marquee__track">
            {Array.from({ length: 2 }).map((_, pass) =>
              ["Hand-Stretched Pizza", "Famous Fried Chicken", "Hot Subs & Steaks", "Fresh Salads", "Pickup Ready", "Delivery Available", "Three MD Locations", "Order Online Now"].map(
                (item, index) => (
                  <div key={`${pass}-${index}`} className="wm-marquee__item">
                    {item}
                    <span className="wm-marquee__dot" />
                  </div>
                ),
              ),
            )}
          </div>
        </section>

        {/* ════════════ STATS ════════════ */}
        <section className="wm-stats">
          <div className="wm-section">
            <div className="wm-stats__panel">
              {[
                { value: "3",    label: "Locations"     },
                { value: "15+",  label: "Years Serving" },
                { value: "~15",  label: "Min Ready Time"},
                { value: "★4.8", label: "Avg. Rating"   },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="wm-stat"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wm-stat__value">{stat.value}</div>
                  <div className="wm-stat__label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ ORDER NOW ════════════ */}
        <section className="wm-order" id="order-now">
          <div className="wm-section">
            <SectionIntro
              eyebrow="Choose Your Kitchen"
              title={<>Pick a location<br /><em>&amp; start your order.</em></>}
              body="Each location has its own full menu. Select yours to get started — pickup or delivery available."
              align="center"
            />
            <div className="wm-locations__grid">
              {LOCATIONS.map((loc, i) => (
                <LocationOrderCard key={loc.slug} location={loc} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ HOW IT WORKS ════════════ */}
        <section className="wm-how">
          <div className="wm-section">
            <SectionIntro
              eyebrow="Simple Process"
              title={<>How ordering<br /><em>works.</em></>}
              body="Three steps, a few minutes, and something great waiting for you."
              align="center"
            />
            <div className="wm-how__grid">
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="wm-how__step"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wm-how__step-num">{step.step}</div>
                  <h3 className="wm-display wm-how__step-title">{step.title}</h3>
                  <p className="wm-how__step-desc">{step.desc}</p>
                  <div className="wm-how__step-arrow"><ChevronRight size={18} /></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ DELIVERY PLATFORMS ════════════ */}
        <section className="wm-delivery">
          <div className="wm-section">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <SectionIntro
                eyebrow="Delivery Options"
                title={<>Order through your<br /><em>favorite app.</em></>}
                body="We're live on all major delivery platforms. Find your Wise Mart location inside each app."
              />
              <Link to="/order" className="wm-link" style={{ flexShrink: 0, paddingBottom: 4 }}>
                All Locations <ArrowRight />
              </Link>
            </div>
            <div className="wm-delivery__grid">
              {PLATFORMS.map((p, i) => (
                <motion.div
                  key={p.name}
                  className="wm-platform"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="wm-platform__dot" style={{ background: p.color }} />
                  <div>
                    <div className="wm-platform__name">{p.name}</div>
                    <div className="wm-platform__desc">{p.desc}</div>
                  </div>
                  <div className="wm-platform__arrow"><ArrowRight size={16} /></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ CATERING ════════════ */}
        <section className="wm-catering">
          <div className="wm-section">
            <div className="wm-catering__layout">
              <motion.div
                className="wm-catering__frame"
                initial={{ opacity: 0, x: -40, scale: 0.94 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={bannerImg} alt="Wise Mart catering spread" loading="lazy" />
                <div className="wm-catering__caption">Feeding a crowd? We've got you.</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <SectionIntro
                  eyebrow="Catering"
                  title={<>Big events deserve<br /><em>great food.</em></>}
                />
                <p className="wm-catering__body-lead">
                  "Custom menus, generous portions, the same Wise Mart quality you know."
                </p>
                <p className="wm-catering__body-text">
                  From birthday parties to corporate lunches, we've fed every size crowd. Contact your nearest location to talk through a custom quote — we'll handle the rest.
                </p>
                <div className="wm-catering__action">
                  <Link to="/contact" className="wm-link">
                    Request a Catering Quote <ArrowRight />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════ CTA ════════════ */}
        <section className="wm-cta">
          <div className="wm-section">
            <motion.div
              className="wm-cta__panel"
              style={{ backgroundImage: `url(${bannerImg})` }}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <div className="wm-cta__eyebrow">Still Have Questions?</div>
                <h2 className="wm-display wm-cta__title">Check our FAQ or reach out directly.</h2>
                <p className="wm-cta__copy">
                  We're happy to help with any order, menu question, or catering request. One tap away.
                </p>
              </div>
              <div className="wm-cta__actions">
                <Link to="/contact" className="wm-button wm-button--primary">Contact Us</Link>
                <Link to="/faq"     className="wm-button wm-button--dark">View FAQ</Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}