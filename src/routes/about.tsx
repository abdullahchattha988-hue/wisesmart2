import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Sparkles, Zap, DollarSign, Heart, ArrowRight, Award, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";
import bannerImg from "@/assets/banner-2.webp";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Wise Mart — A Maryland Tradition Since 2010" },
      {
        name: "description",
        content:
          "Wise Mart has served Maryland communities since 2010 with fresh food, fast service, and family-style hospitality across three locations.",
      },
      { property: "og:title", content: "About Wise Mart — A Maryland Tradition Since 2010" },
      {
        property: "og:description",
        content: "Three locations. One promise: come hungry, leave happy.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Sparkles,
    title: "Fresh Daily",
    desc: "Dough mixed every morning. Produce delivered fresh. Real ingredients, zero shortcuts.",
  },
  {
    icon: Zap,
    title: "Fast Service",
    desc: "Hot meals to the counter in minutes — without ever rushing the kitchen.",
  },
  {
    icon: DollarSign,
    title: "Honest Pricing",
    desc: "Generous portions at prices that respect your wallet. Family meals that don't break the bank.",
  },
  {
    icon: Heart,
    title: "Community First",
    desc: "Local hires. Local sponsorships. We're a part of every town we serve.",
  },
];

const TIMELINE = [
  {
    year: "2010",
    title: "The First Wise Mart Opens",
    text: "Sharptown, MD. A small kitchen with one pizza oven and a chicken fryer — and a big idea.",
  },
  {
    year: "2014",
    title: "Famous Fried Chicken Recipe",
    text: "Our signature double-fry technique becomes a regional obsession.",
  },
  {
    year: "2017",
    title: "East New Market Joins",
    text: "We expand with hearty subs, burgers, and family-sized meals for a new community.",
  },
  {
    year: "2020",
    title: "Vienna Opens its Doors",
    text: "Fresh salads, breakfast plates, and lighter fare find a warm new home.",
  },
  {
    year: "Today",
    title: "Three Locations. One Family.",
    text: "Still mixing dough by hand. Still treating every guest like our very first.",
  },
];

// ── Fine Pointer ──────────────────────────────────────────────────────────────
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

// ── CountUp ───────────────────────────────────────────────────────────────────
function CountUp({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) { setValue(to); return; }
    let frame = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, prefersReducedMotion, to]);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return <span ref={ref}>{formatted}{suffix}</span>;
}

// ── Page ──────────────────────────────────────────────────────────────────────
function AboutPage() {
  const prefersReducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const interactiveMotion = finePointer && !prefersReducedMotion;

  const heroRef = useRef<HTMLElement>(null);

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

  // Cursor
  const pointerX = useMotionValue(-160);
  const pointerY = useMotionValue(-160);
  const cursorX = useSpring(pointerX, { stiffness: 500, damping: 40, mass: 0.25 });
  const cursorY = useSpring(pointerY, { stiffness: 500, damping: 40, mass: 0.25 });
  const cursorAura = useMotionTemplate`radial-gradient(440px circle at ${cursorX}px ${cursorY}px, rgba(235, 113, 38, 0.18) 0%, rgba(235, 113, 38, 0.09) 24%, transparent 62%)`;
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorHover, setCursorHover] = useState(false);

  useEffect(() => {
    if (!interactiveMotion) { setCursorVisible(false); setCursorHover(false); return; }
    const onPointerMove = (e: PointerEvent) => { pointerX.set(e.clientX); pointerY.set(e.clientY); setCursorVisible(true); };
    const onPointerOver = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      setCursorHover(Boolean(t.closest("a, button, [data-cursor='interactive']")));
    };
    const onPointerOut = (e: PointerEvent) => {
      const n = e.relatedTarget;
      if (n instanceof Element && n.closest("a, button, [data-cursor='interactive']")) return;
      setCursorHover(false);
    };
    const hide = () => setCursorVisible(false);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [interactiveMotion, pointerX, pointerY]);

  const establishedYear = Number((SITE as Partial<{ established: number | string }>).established ?? 2010) || 2010;
  const yearsServing = Math.max(1, new Date().getFullYear() - establishedYear);

  const MARQUEE_ITEMS = [
    "Fresh Daily",
    `Since ${establishedYear}`,
    "Three Maryland Locations",
    "Hand-Stretched Dough",
    "Double-Fried Chicken",
    "Community Rooted",
    "Open 7 Days",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

        :root {
          --wm-ink: #120d09;
          --wm-ink-soft: #1a130f;
          --wm-ink-raised: #221913;
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
        }

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: var(--wm-ink); }
        img { display: block; max-width: 100%; }

        /* ── Page Shell ── */
        .wm-about-page {
          position: relative;
          overflow-x: clip;
          color: var(--wm-text);
          background:
            radial-gradient(circle at 10% 0%, rgba(235, 113, 38, 0.1), transparent 28%),
            radial-gradient(circle at 92% 18%, rgba(242, 188, 89, 0.07), transparent 22%),
            linear-gradient(180deg, #120d09 0%, #15100c 46%, #120d09 100%);
          font-family: "Manrope", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .wm-page__glow { position: fixed; inset: 0; pointer-events: none; z-index: 3; }

        .wm-progress {
          position: fixed; top: 0; left: 0; right: 0; height: 3px;
          transform-origin: left center;
          background: linear-gradient(90deg, #ffcf80 0%, #eb7126 45%, #b54d0c 100%);
          z-index: 30;
        }

        /* ── Cursor ── */
        .wm-cursor-outer, .wm-cursor-inner {
          position: fixed; top: 0; left: 0;
          pointer-events: none; z-index: 31;
        }
        .wm-cursor-outer {
          width: 44px; height: 44px;
          margin-top: -22px; margin-left: -22px;
          border-radius: 999px;
          border: 1px solid rgba(255, 207, 128, 0.6);
          background: rgba(235, 113, 38, 0.08);
          transition: width .24s ease, height .24s ease, margin .24s ease, border-color .24s ease, background .24s ease;
        }
        .wm-cursor-outer.is-hover {
          width: 68px; height: 68px;
          margin-top: -34px; margin-left: -34px;
          border-color: rgba(255, 207, 128, 0.8);
          background: rgba(235, 113, 38, 0.16);
        }
        .wm-cursor-inner {
          width: 8px; height: 8px;
          margin-top: -4px; margin-left: -4px;
          border-radius: 999px; background: #ffcf80;
          box-shadow: 0 0 24px rgba(255, 207, 128, 0.55);
        }

        /* ── Layout ── */
        .wm-section { width: min(1320px, calc(100vw - 32px)); margin: 0 auto; }

        .wm-display {
          font-family: "Fraunces", Georgia, serif;
          font-weight: 600; letter-spacing: -0.03em; line-height: 0.98;
        }
        .wm-display em { font-style: italic; color: #ffd08d; }

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

        /* ── Buttons ── */
        .wm-button {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          min-height: 52px; padding: 0 24px; border-radius: 999px; border: none; cursor: pointer;
          font-family: "Manrope", sans-serif;
          font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase;
          text-decoration: none;
          transition: transform .24s ease, box-shadow .24s ease, background .24s ease, border-color .24s ease;
        }
        .wm-button svg { width: 14px; height: 14px; flex-shrink: 0; }
        .wm-button--primary {
          color: white;
          background: linear-gradient(135deg, #f18b3e 0%, #eb7126 48%, #c95a12 100%);
          box-shadow: var(--wm-shadow-amber);
        }
        .wm-button--primary:hover { transform: translateY(-2px); box-shadow: 0 26px 58px rgba(201,90,18,.4); }
        .wm-button--dark {
          color: rgba(250,244,237,.9); background: rgba(13,9,6,.82);
          border: 1px solid rgba(255,255,255,.08);
        }
        .wm-button--dark:hover { transform: translateY(-2px); background: rgba(18,13,9,.96); }
        .wm-button--ghost {
          color: var(--wm-text);
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(255,255,255,.04); backdrop-filter: blur(12px);
        }
        .wm-button--ghost:hover { transform: translateY(-2px); border-color: rgba(255,255,255,.28); background: rgba(255,255,255,.08); }
        .wm-button--small { min-height: 44px; padding: 0 18px; font-size: 11px; letter-spacing: .14em; }

        .wm-link {
          display: inline-flex; align-items: center; gap: 8px;
          color: #ffcf80; text-decoration: none;
          font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
          transition: gap .22s ease, color .22s ease;
        }
        .wm-link:hover { gap: 14px; color: white; }
        .wm-link svg { width: 14px; height: 14px; }

        /* ── Hero ── */
        .wm-hero {
          position: relative; min-height: 100svh;
          display: flex; align-items: stretch; overflow: hidden;
        }
        .wm-hero__bg {
          position: absolute; inset: -6%;
          background-position: center 60%; background-size: cover; will-change: transform;
        }
        .wm-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(110deg, rgba(9,6,4,.96) 0%, rgba(9,6,4,.84) 42%, rgba(9,6,4,.4) 74%, rgba(9,6,4,.14) 100%),
            linear-gradient(180deg, rgba(9,6,4,.35) 0%, rgba(9,6,4,.96) 100%);
        }
        .wm-hero__noise {
          position: absolute; inset: 0; pointer-events: none; opacity: .05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 170px 170px;
        }
        .wm-hero__beam {
          position: absolute; inset: auto -10% 8% auto;
          width: 45vw; height: 45vw; border-radius: 999px;
          background: radial-gradient(circle, rgba(242,188,89,.12) 0%, rgba(235,113,38,.08) 25%, transparent 70%);
          filter: blur(16px); pointer-events: none;
        }
        .wm-hero__orb {
          position: absolute; inset: 12% auto auto 8%;
          width: 260px; height: 260px; border-radius: 999px;
          background: radial-gradient(circle, rgba(235,113,38,.18) 0%, transparent 68%);
          filter: blur(28px); pointer-events: none;
        }
        .wm-hero__inner {
          position: relative; z-index: 2;
          display: grid; gap: 54px; grid-template-columns: 1fr;
          align-items: center; padding: 132px 0 96px;
        }
        .wm-hero__copy { max-width: 720px; }

        .wm-hero__badge {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 9px 16px 9px 10px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.06);
          backdrop-filter: blur(14px);
        }
        .wm-hero__badge-icon {
          width: 30px; height: 30px; border-radius: 999px;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #f4a756 0%, #eb7126 100%);
          box-shadow: 0 0 0 5px rgba(235,113,38,.12);
        }
        .wm-hero__badge-icon svg { width: 14px; height: 14px; color: white; }
        .wm-hero__badge-copy {
          font-size: 11px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase;
          color: var(--wm-text-soft);
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
        @keyframes wm-shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }

        .wm-hero__sub {
          margin: 24px 0 0; max-width: 580px;
          font-size: 16px; line-height: 1.85; color: var(--wm-text-soft);
        }
        .wm-hero__actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
        .wm-hero__signals {
          display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 14px; margin-top: 34px; max-width: 620px;
        }
        .wm-hero__signal {
          padding: 18px 18px 17px; border-radius: 22px;
          border: 1px solid var(--wm-border); background: rgba(255,255,255,.05); backdrop-filter: blur(14px);
        }
        .wm-hero__signal-top {
          display: flex; align-items: center; gap: 10px;
          color: #ffcf80; font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
        }
        .wm-hero__signal-top svg { width: 14px; height: 14px; }
        .wm-hero__signal-copy { margin-top: 10px; font-size: 13px; line-height: 1.7; color: var(--wm-text-soft); }

        /* Scroll cue */
        .wm-scroll-cue {
          position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          z-index: 2; color: var(--wm-text-faint); font-size: 10px; font-weight: 800;
          letter-spacing: .18em; text-transform: uppercase;
        }
        .wm-scroll-cue__track { width: 1px; height: 54px; background: rgba(255,255,255,.12); position: relative; overflow: hidden; }
        .wm-scroll-cue__track::after {
          content: ""; position: absolute; top: -100%; left: 0; width: 100%; height: 100%;
          background: linear-gradient(180deg, transparent, #ffcf80, transparent);
          animation: wm-scroll-drop 2.15s ease-in-out infinite;
        }
        @keyframes wm-scroll-drop {
          0% { top: -100%; opacity: 0; } 20% { opacity: 1; } 100% { top: 100%; opacity: 0; }
        }

        /* ── Marquee ── */
        .wm-marquee {
          position: relative; overflow: hidden; padding: 16px 0;
          background: linear-gradient(90deg, #f3b154 0%, #eb7126 36%, #c95a12 100%);
          border-top: 1px solid rgba(255,255,255,.08); border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .wm-marquee::before, .wm-marquee::after {
          content: ""; position: absolute; top: 0; bottom: 0; width: 70px; pointer-events: none; z-index: 1;
        }
        .wm-marquee::before { left: 0; background: linear-gradient(90deg, rgba(235,113,38,1), rgba(235,113,38,0)); }
        .wm-marquee::after  { right: 0; background: linear-gradient(270deg, rgba(201,90,18,1), rgba(201,90,18,0)); }
        .wm-marquee__track { display: flex; width: max-content; animation: wm-marquee-scroll 28s linear infinite; }
        .wm-marquee__item {
          display: inline-flex; align-items: center; gap: 18px; padding: 0 28px;
          font-size: 11px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase;
          color: rgba(255,255,255,.95); white-space: nowrap;
        }
        .wm-marquee__dot { width: 5px; height: 5px; border-radius: 999px; background: rgba(255,255,255,.58); flex-shrink: 0; }
        @keyframes wm-marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ── Stats Bar ── */
        .wm-stats { padding: 34px 0 0; }
        .wm-stats__panel {
          display: grid; gap: 1px; grid-template-columns: repeat(4, minmax(0,1fr));
          overflow: hidden; border-radius: 32px;
          border: 1px solid var(--wm-border-soft);
          background: rgba(255,255,255,.07); box-shadow: var(--wm-shadow-lg);
        }
        .wm-stat {
          position: relative; padding: 30px 24px;
          background: linear-gradient(180deg, rgba(255,255,255,.03) 0%, rgba(255,255,255,.01) 100%), rgba(19,13,9,.92);
          overflow: hidden;
        }
        .wm-stat::after {
          content: ""; position: absolute; left: 24px; right: 24px; bottom: 0; height: 2px;
          transform: scaleX(0); transform-origin: left center; transition: transform .28s ease;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
        }
        .wm-stat:hover::after { transform: scaleX(1); }
        .wm-stat__value { font-family: "Fraunces", Georgia, serif; font-size: clamp(36px,4vw,52px); font-weight: 700; color: white; line-height: 1; }
        .wm-stat__label { margin-top: 10px; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: var(--wm-text-faint); }

        /* ── Story Section ── */
        .wm-story { padding: 110px 0; position: relative; }
        .wm-story::before {
          content: ""; position: absolute; inset: 0; opacity: .04; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px);
          background-size: 86px 86px;
          mask-image: linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%);
        }
        .wm-story__layout {
          position: relative; display: grid; gap: 64px;
          grid-template-columns: minmax(0,1fr) minmax(0,.96fr); align-items: center;
        }
        .wm-story__lead {
          margin: 22px 0 0; padding-left: 18px;
          border-left: 2px solid var(--wm-amber);
          font-family: "Fraunces", Georgia, serif; font-size: 20px; font-style: italic;
          line-height: 1.7; color: rgba(250,244,237,.86);
        }
        .wm-story__body { margin-top: 18px; font-size: 15px; line-height: 1.85; color: var(--wm-text-soft); }
        .wm-story__body + .wm-story__body { margin-top: 14px; }
        .wm-story__actions { margin-top: 32px; }

        .wm-story__media { position: relative; min-height: 580px; }
        .wm-story__frame {
          position: absolute; inset: 0 0 70px 0; overflow: hidden;
          border-radius: 34px; border: 1px solid var(--wm-border); box-shadow: var(--wm-shadow-xl);
        }
        .wm-story__frame img { width: 100%; height: 100%; object-fit: cover; }
        .wm-story__frame::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(12,8,6,.06) 0%, rgba(12,8,6,.7) 100%);
        }
        .wm-story__frame-caption {
          position: absolute; left: 24px; right: 24px; bottom: 22px; z-index: 1;
          font-family: "Fraunces", Georgia, serif; font-size: 20px; font-style: italic;
          color: rgba(250,244,237,.92);
        }
        .wm-story__floating-stat {
          position: absolute; left: -18px; top: 28px;
          padding: 18px 20px; border-radius: 24px;
          border: 1px solid rgba(255,255,255,.14); background: rgba(18,13,9,.82);
          backdrop-filter: blur(14px); box-shadow: var(--wm-shadow-lg);
        }
        .wm-story__floating-value { font-family: "Fraunces", Georgia, serif; font-size: 40px; font-weight: 700; line-height: 1; color: white; }
        .wm-story__floating-label { margin-top: 8px; max-width: 14ch; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: var(--wm-text-faint); line-height: 1.45; }
        .wm-story__mini {
          position: absolute; right: -16px; bottom: 0;
          width: min(260px, 42%); overflow: hidden; border-radius: 28px;
          border: 1px solid rgba(255,255,255,.14); background: rgba(18,13,9,.92);
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-story__mini img { aspect-ratio: 4/3; width: 100%; object-fit: cover; }
        .wm-story__mini-copy { padding: 16px 18px 18px; }
        .wm-story__mini-eyebrow { font-size: 9px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #ffcf80; }
        .wm-story__mini-title { margin-top: 8px; font-size: 15px; font-weight: 700; line-height: 1.35; }

        /* ── Values ── */
        .wm-values { padding: 110px 0; position: relative; }
        .wm-values::before {
          content: ""; position: absolute; inset: 90px auto auto -120px;
          width: 340px; height: 340px; border-radius: 999px;
          background: radial-gradient(circle, rgba(235,113,38,.09), transparent 70%);
          filter: blur(24px); pointer-events: none;
        }
        .wm-values__grid {
          display: grid; gap: 18px; grid-template-columns: repeat(4, minmax(0,1fr)); margin-top: 56px;
        }
        .wm-value-card {
          position: relative; padding: 30px 28px; min-height: 260px;
          border-radius: 28px; border: 1px solid var(--wm-border);
          background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01)), rgba(23,16,12,.9);
          overflow: hidden;
          transition: transform .26s ease, border-color .26s ease, box-shadow .26s ease;
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-value-card:hover { transform: translateY(-4px); border-color: var(--wm-amber-border); box-shadow: 0 28px 68px rgba(0,0,0,.4); }
        .wm-value-card__number {
          position: absolute; top: 18px; right: 20px;
          font-family: "Fraunces", Georgia, serif; font-size: 64px; font-weight: 300;
          color: rgba(255,207,128,.08); line-height: 1;
        }
        .wm-value-card__icon {
          width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 18px; color: #ffd08d;
          background: rgba(235,113,38,.12); border: 1px solid rgba(235,113,38,.24);
          transition: background .28s ease, transform .36s cubic-bezier(.34,1.56,.64,1), box-shadow .28s ease;
        }
        .wm-value-card__icon svg { width: 22px; height: 22px; }
        .wm-value-card:hover .wm-value-card__icon {
          background: var(--wm-amber); color: #fff;
          transform: scale(1.15) rotate(-8deg); box-shadow: 0 8px 24px rgba(235,113,38,.4);
        }
        .wm-value-card__title { margin: 22px 0 0; font-size: 28px; line-height: 1.1; }
        .wm-value-card__copy { margin-top: 12px; font-size: 14px; line-height: 1.75; color: var(--wm-text-soft); }

        /* ── Timeline ── */
        .wm-timeline { padding: 110px 0; }
        .wm-tl-track { position: relative; margin-top: 64px; }
        .wm-tl-line {
          position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, transparent 0%, var(--wm-amber) 12%, var(--wm-amber) 88%, transparent 100%);
          transform: translateX(-50%);
        }
        .wm-tl-items { display: flex; flex-direction: column; gap: 0; }
        .wm-tl-item {
          position: relative; display: grid;
          grid-template-columns: 1fr 56px 1fr; align-items: start;
        }
        .wm-tl-left  { padding: 0 44px 52px 0; text-align: right; }
        .wm-tl-right { padding: 0 0 52px 44px; }
        .wm-tl-item:nth-child(even) .wm-tl-left  { order: 3; text-align: left;  padding: 0 0 52px 44px; }
        .wm-tl-item:nth-child(even) .wm-tl-center { order: 2; }
        .wm-tl-item:nth-child(even) .wm-tl-right { order: 1; text-align: right; padding: 0 44px 52px 0; }

        .wm-tl-center { display: flex; flex-direction: column; align-items: center; padding-top: 8px; }
        .wm-tl-dot {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #f4a756, #eb7126);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 8px rgba(235,113,38,.15), var(--wm-shadow-amber);
          flex-shrink: 0; position: relative; z-index: 1;
        }
        .wm-tl-dot-inner { width: 10px; height: 10px; border-radius: 50%; background: #fff; }

        .wm-tl-card {
          border-radius: 24px; border: 1px solid var(--wm-border);
          background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01)), rgba(23,16,12,.9);
          padding: 26px 28px; position: relative; overflow: hidden;
          transition: border-color .3s, box-shadow .35s, transform .28s ease;
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-tl-card::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(235,113,38,.07) 0%, transparent 65%);
          opacity: 0; transition: opacity .4s;
        }
        .wm-tl-card:hover { border-color: var(--wm-amber-border); box-shadow: 0 24px 64px rgba(0,0,0,.44); transform: translateY(-3px); }
        .wm-tl-card:hover::before { opacity: 1; }
        .wm-tl-year { font-size: 10px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #ffcf80; }
        .wm-tl-title { font-size: 26px; line-height: 1.1; margin-top: 8px; }
        .wm-tl-text { font-size: 14px; color: var(--wm-text-soft); margin-top: 10px; line-height: 1.75; }

        /* ── CTA ── */
        .wm-cta { padding: 34px 0 100px; }
        .wm-cta__panel {
          position: relative; overflow: hidden;
          display: grid; gap: 24px; align-items: center;
          grid-template-columns: minmax(0,1fr) auto;
          padding: 54px; border-radius: 36px;
          border: 1px solid rgba(255,255,255,.12);
          background-size: cover; background-position: center;
          box-shadow: var(--wm-shadow-xl);
        }
        .wm-cta__panel::before {
          content: ""; position: absolute; inset: 0;
          background:
            linear-gradient(110deg, rgba(16,11,8,.92) 0%, rgba(16,11,8,.74) 48%, rgba(16,11,8,.54) 100%),
            radial-gradient(circle at 18% 40%, rgba(235,113,38,.22), transparent 40%);
        }
        .wm-cta__panel > * { position: relative; z-index: 1; }
        .wm-cta__eyebrow { font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #ffcf80; }
        .wm-cta__title { margin: 14px 0 0; font-size: clamp(38px,4.4vw,64px); line-height: 1; }
        .wm-cta__copy { margin-top: 14px; max-width: 560px; font-size: 15px; line-height: 1.8; color: rgba(250,244,237,.78); }
        .wm-cta__actions { display: flex; flex-wrap: wrap; gap: 14px; }

        /* ── Focus ── */
        .wm-button:focus-visible, .wm-link:focus-visible { outline: 2px solid #ffcf80; outline-offset: 3px; }

        /* ── Responsive ── */
        @media (max-width: 1180px) {
          .wm-values__grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .wm-story__layout { grid-template-columns: 1fr; }
          .wm-story__media { min-height: 540px; }
        }
        @media (max-width: 960px) {
          .wm-stats__panel { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .wm-hero__signals { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .wm-cta__panel { grid-template-columns: 1fr; }
          .wm-tl-item { grid-template-columns: 36px 1fr; gap: 0; }
          .wm-tl-line { left: 18px; transform: none; }
          .wm-tl-left  { display: none !important; }
          .wm-tl-center { align-items: flex-start; padding-left: 0; }
          .wm-tl-right { padding: 0 0 40px 24px; text-align: left !important; order: 2 !important; }
          .wm-tl-item:nth-child(even) .wm-tl-center { order: 1 !important; }
        }
        @media (max-width: 720px) {
          .wm-story, .wm-values, .wm-timeline, .wm-cta { padding-top: 82px; padding-bottom: 82px; }
          .wm-hero__inner { padding: 122px 0 90px; }
          .wm-hero__title { font-size: clamp(52px, 14vw, 74px); }
          .wm-hero__sub { font-size: 15px; }
          .wm-hero__signals { grid-template-columns: 1fr; }
          .wm-stats__panel { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .wm-values__grid { grid-template-columns: 1fr; }
          .wm-story__media { min-height: 460px; }
          .wm-story__frame { inset: 0 0 52px; }
          .wm-story__mini { right: 0; width: min(240px, 62%); }
          .wm-story__floating-stat { left: 12px; top: 12px; }
          .wm-cta__panel { padding: 36px 26px; border-radius: 28px; }
          .wm-cta__actions, .wm-hero__actions { flex-direction: column; align-items: stretch; }
          .wm-button { width: 100%; }
          .wm-section { width: min(1320px, calc(100vw - 24px)); }
        }
        @media (hover: none) {
          .wm-button:hover, .wm-link:hover, .wm-value-card:hover, .wm-tl-card:hover { transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* Progress */}
      <motion.div className="wm-progress" style={{ scaleX: progress }} />

      {/* Cursor */}
      {interactiveMotion ? (
        <>
          <motion.div className="wm-page__glow" style={{ background: cursorAura }} animate={{ opacity: cursorVisible ? 1 : 0 }} transition={{ duration: 0.18 }} />
          <motion.div className={`wm-cursor-outer${cursorHover ? " is-hover" : ""}`} style={{ x: cursorX, y: cursorY }} animate={{ opacity: cursorVisible ? 1 : 0 }} transition={{ duration: 0.16 }} />
          <motion.div className="wm-cursor-inner" style={{ x: cursorX, y: cursorY }} animate={{ opacity: cursorVisible ? 1 : 0 }} transition={{ duration: 0.12 }} />
        </>
      ) : null}

      <div className="wm-about-page">

        {/* ══ HERO ══ */}
        <section className="wm-hero" ref={heroRef}>
          <motion.div
            className="wm-hero__bg"
            style={{ backgroundImage: `url(${bannerImg})`, y: heroY, scale: heroScale, opacity: heroOpacity }}
          />
          <div className="wm-hero__overlay" />
          <div className="wm-hero__noise" />
          <div className="wm-hero__beam" />
          <div className="wm-hero__orb" />

          <div className="wm-section wm-hero__inner">
            <motion.div className="wm-hero__copy" style={{ y: copyY }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <div className="wm-hero__badge">
                <span className="wm-hero__badge-icon"><Sparkles /></span>
                <span className="wm-hero__badge-copy">
                  <strong>Maryland Tradition</strong> since {SITE.established}
                </span>
              </div>

              <h1 className="wm-display wm-hero__title">
                {["A Maryland", "Tradition."].map((line, i) => (
                  <span key={line} className={`wm-hero__line${i === 1 ? " wm-hero__line--accent" : ""}`}>
                    <motion.span
                      initial={{ y: "110%", rotateX: 12 }}
                      animate={{ y: "0%", rotateX: 0 }}
                      transition={{ duration: 0.95, delay: 0.08 + i * 0.16, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p className="wm-hero__sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.42 }}>
                We started with one belief: people deserve food made with care, served fast, at a price that respects them. {yearsServing} years later, that belief still runs every kitchen.
              </motion.p>

              <motion.div className="wm-hero__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.64, delay: 0.55 }}>
                <Link to="/order" className="wm-button wm-button--primary">
                  Order Now <ArrowRight />
                </Link>
                <Link to="/locations" className="wm-button wm-button--ghost">
                  Find a Location
                </Link>
              </motion.div>

              <motion.div className="wm-hero__signals" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.64, delay: 0.72 }}>
                {[
                  { icon: Award,  label: `${yearsServing}+ years`,   copy: "Serving Maryland communities with the same care since day one." },
                  { icon: Users,  label: "3 MD locations",            copy: "Sharptown, East New Market, and Vienna — each with its own loyal crowd." },
                  { icon: Sparkles, label: "Fresh daily",             copy: "Dough, produce, and sauces prepped every morning without shortcuts." },
                ].map((item) => (
                  <div key={item.label} className="wm-hero__signal">
                    <div className="wm-hero__signal-top"><item.icon />{item.label}</div>
                    <div className="wm-hero__signal-copy">{item.copy}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          <div className="wm-scroll-cue" aria-hidden="true">
            <div className="wm-scroll-cue__track" />
            <span>Scroll</span>
          </div>
        </section>

        {/* ══ MARQUEE ══ */}
        <section className="wm-marquee" aria-label="Highlights">
          <div className="wm-marquee__track">
            {Array.from({ length: 2 }).map((_, pass) =>
              MARQUEE_ITEMS.map((item, index) => (
                <div key={`${pass}-${index}`} className="wm-marquee__item">
                  {item}<span className="wm-marquee__dot" />
                </div>
              )),
            )}
          </div>
        </section>

        {/* ══ STATS ══ */}
        <section className="wm-stats">
          <div className="wm-section">
            <div className="wm-stats__panel">
              {[
                { value: <CountUp to={3} />,              label: "Locations"     },
                { value: <CountUp to={yearsServing} suffix="+" />, label: "Years Serving" },
                { value: <CountUp to={50} suffix="+" />,  label: "Menu Items"    },
                { value: <CountUp to={4.8} decimals={1} />, label: "Avg. Rating" },
              ].map((stat, i) => (
                <motion.div key={stat.label} className="wm-stat"
                  initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="wm-stat__value">{stat.value}</div>
                  <div className="wm-stat__label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STORY ══ */}
        <section className="wm-story">
          <div className="wm-section">
            <div className="wm-story__layout">
              <motion.div
                initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="wm-eyebrow">
                  <span className="wm-eyebrow__line" />Our Story<span className="wm-eyebrow__line" />
                </span>
                <h2 className="wm-display wm-section-title" style={{ margin: "18px 0 0", fontSize: "clamp(42px,5vw,72px)" }}>
                  More than a meal —<br /><em>a Maryland routine.</em>
                </h2>
                <p className="wm-story__lead">
                  "Serve good food, fast, at a fair price, and treat every guest like family."
                </p>
                <p className="wm-story__body">
                  What began in a single Sharptown kitchen in {SITE.established} has grown into three distinct restaurants — each rooted in its own Maryland town, each with its own personality, all sharing one Wise Mart standard.
                </p>
                <p className="wm-story__body">
                  We make our pizza dough by hand every morning. We hand-bread every piece of chicken. We slice subs to order. None of this is fast or efficient — but it's the only way we know how to do right by the people who walk through our doors.
                </p>
                <p className="wm-story__body">
                  Whether it's a family meal in Sharptown, a hearty work-day sub in East New Market, or a fresh breakfast in Vienna, you'll taste the same thing on every plate: care.
                </p>
                <div className="wm-story__actions">
                  <Link to="/locations" className="wm-link">
                    Find Your Location <ArrowRight />
                  </Link>
                </div>
              </motion.div>

              <motion.div
                className="wm-story__media"
                initial={{ opacity: 0, x: 28, scale: 0.98 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.68, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="wm-story__frame">
                  <img src={bannerImg} alt="Wise Mart kitchen spread" loading="lazy" />
                  <div className="wm-story__frame-caption">Made by hand. Served with pride.</div>
                </div>
                <div className="wm-story__floating-stat">
                  <div className="wm-story__floating-value"><CountUp to={yearsServing} suffix="+" /></div>
                  <div className="wm-story__floating-label">years of Maryland favorites</div>
                </div>
                <div className="wm-story__mini">
                  <img src={bannerImg} alt="Wise Mart daily prep" loading="lazy" />
                  <div className="wm-story__mini-copy">
                    <div className="wm-story__mini-eyebrow">Every Morning</div>
                    <div className="wm-story__mini-title">Fresh prep that keeps every plate tasting alive.</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ VALUES ══ */}
        <section className="wm-values">
          <div className="wm-section">
            <motion.div
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center" }}
            >
              <span className="wm-eyebrow">
                <span className="wm-eyebrow__line" />Our Values<span className="wm-eyebrow__line" />
              </span>
              <h2 className="wm-display" style={{ margin: "18px 0 0", fontSize: "clamp(42px,5vw,72px)" }}>
                What guides <em>every plate.</em>
              </h2>
              <p style={{ marginTop: 16, maxWidth: 540, marginLeft: "auto", marginRight: "auto", fontSize: 15, lineHeight: 1.8, color: "var(--wm-text-soft)" }}>
                The principles we've carried since day one — and will carry forever.
              </p>
            </motion.div>

            <div className="wm-values__grid">
              {VALUES.map((v, i) => (
                <motion.div key={v.title} className="wm-value-card"
                  initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.56, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  data-cursor="interactive"
                >
                  <span className="wm-value-card__number">{String(i + 1).padStart(2, "0")}</span>
                  <span className="wm-value-card__icon"><v.icon /></span>
                  <h3 className="wm-display wm-value-card__title">{v.title}</h3>
                  <p className="wm-value-card__copy">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TIMELINE ══ */}
        <section className="wm-timeline">
          <div className="wm-section">
            <motion.div
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center" }}
            >
              <span className="wm-eyebrow">
                <span className="wm-eyebrow__line" />Our Journey<span className="wm-eyebrow__line" />
              </span>
              <h2 className="wm-display" style={{ margin: "18px 0 0", fontSize: "clamp(42px,5vw,72px)" }}>
                {yearsServing} years <em>in the making.</em>
              </h2>
              <p style={{ marginTop: 16, maxWidth: 480, marginLeft: "auto", marginRight: "auto", fontSize: 15, lineHeight: 1.8, color: "var(--wm-text-soft)" }}>
                Every milestone, one plate at a time.
              </p>
            </motion.div>

            <div className="wm-tl-track">
              <div className="wm-tl-line" />
              <div className="wm-tl-items">
                {TIMELINE.map((t, i) => (
                  <motion.div key={t.year} className="wm-tl-item"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="wm-tl-left">
                      {i % 2 === 0 ? (
                        <div className="wm-tl-card" style={{ textAlign: "left" }}>
                          <div className="wm-tl-year">{t.year}</div>
                          <div className="wm-display wm-tl-title">{t.title}</div>
                          <div className="wm-tl-text">{t.text}</div>
                        </div>
                      ) : null}
                    </div>
                    <div className="wm-tl-center">
                      <div className="wm-tl-dot"><div className="wm-tl-dot-inner" /></div>
                    </div>
                    <div className="wm-tl-right">
                      {i % 2 !== 0 ? (
                        <div className="wm-tl-card">
                          <div className="wm-tl-year">{t.year}</div>
                          <div className="wm-display wm-tl-title">{t.title}</div>
                          <div className="wm-tl-text">{t.text}</div>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="wm-cta">
          <div className="wm-section">
            <motion.div
              className="wm-cta__panel"
              style={{ backgroundImage: `url(${bannerImg})` }}
              initial={{ opacity: 0, y: 28, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <div className="wm-cta__eyebrow">Ready to taste the tradition?</div>
                <h2 className="wm-display wm-cta__title">Pick a location,<br /><em>come hungry.</em></h2>
                <p className="wm-cta__copy">
                  Explore the menu, place your order, and we will have something fresh waiting for you.
                </p>
              </div>
              <div className="wm-cta__actions">
                <Link to="/order" className="wm-button wm-button--primary">
                  Order Now <ArrowRight />
                </Link>
                <Link to="/locations" className="wm-button wm-button--dark">
                  Find a Location
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}