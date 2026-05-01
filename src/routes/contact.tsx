import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  Users,
  Award,
} from "lucide-react";
import { z } from "zod";
import { LOCATIONS, SITE } from "@/data/site";
import bannerImg from "@/assets/banner-4.webp";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Wise Mart — Get in Touch" },
      {
        name: "description",
        content:
          "Contact Wise Mart by phone, email, or message. Three Maryland locations ready to serve you.",
      },
      { property: "og:title", content: "Contact Wise Mart" },
      {
        property: "og:description",
        content: "Phone, email, and locations for all three Wise Mart kitchens.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(1, "Please select a subject"),
  message: z.string().trim().min(1, "Message required").max(1000),
});

/* ── fine pointer hook (same as index.tsx) ── */
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

/* ── CONTACT PAGE ── */
function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [charCount, setCharCount] = useState(0);

  const prefersReducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const interactiveMotion = finePointer && !prefersReducedMotion;

  /* scroll progress bar */
  const { scrollYProgress: pageProgress } = useScroll();
  const progress = useSpring(pageProgress, { stiffness: 180, damping: 26 });

  /* hero parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], interactiveMotion ? ["0%", "18%"] : ["0%", "0%"]);
  const heroScale = useTransform(heroProgress, [0, 1], interactiveMotion ? [1, 1.08] : [1, 1]);
  const heroOpacity = useTransform(heroProgress, [0, 0.9], [1, 0.05]);
  const copyY = useTransform(heroProgress, [0, 1], interactiveMotion ? ["0%", "10%"] : ["0%", "0%"]);

  /* custom cursor */
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
    const onPointerMove = (e: PointerEvent) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
      setCursorVisible(true);
    };
    const onPointerOver = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      setCursorHover(Boolean(t.closest("a, button, [data-cursor='interactive']")));
    };
    const onPointerOut = (e: PointerEvent) => {
      const next = e.relatedTarget;
      if (next instanceof Element && next.closest("a, button, [data-cursor='interactive']")) return;
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');
        :root {
          --wm-ink: #120d09;
          --wm-ink-soft: #1a130f;
          --wm-ink-raised: #221913;
          --wm-ink-panel: rgba(24, 17, 12, 0.76);
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

        /* ── SHARED LAYOUT ── */
        .wm-page {
          position: relative; overflow-x: clip;
          color: var(--wm-text);
          background:
            radial-gradient(circle at 10% 0%, rgba(235, 113, 38, 0.10), transparent 28%),
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
          transition: width .24s ease, height .24s ease, margin .24s ease, border-color .24s ease, background .24s ease;
        }
        .wm-cursor-outer.is-hover {
          width: 68px; height: 68px; margin-top: -34px; margin-left: -34px;
          border-color: rgba(255, 207, 128, 0.8); background: rgba(235, 113, 38, 0.16);
        }
        .wm-cursor-inner {
          width: 8px; height: 8px; margin-top: -4px; margin-left: -4px;
          border-radius: 999px; background: #ffcf80;
          box-shadow: 0 0 24px rgba(255, 207, 128, 0.55);
        }
        .wm-section {
          width: min(1320px, calc(100vw - 32px)); margin: 0 auto;
        }
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
        .wm-button {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 10px; min-height: 52px; padding: 0 24px; border-radius: 999px;
          font-size: 12px; font-weight: 800; letter-spacing: 0.16em;
          text-transform: uppercase; text-decoration: none;
          transition: transform .24s ease, box-shadow .24s ease, background .24s ease, border-color .24s ease, color .24s ease;
        }
        .wm-button svg { width: 14px; height: 14px; flex-shrink: 0; }
        .wm-button--primary {
          color: white;
          background: linear-gradient(135deg, #f18b3e 0%, #eb7126 48%, #c95a12 100%);
          box-shadow: var(--wm-shadow-amber);
        }
        .wm-button--primary:hover { transform: translateY(-2px); box-shadow: 0 26px 58px rgba(201,90,18,0.4); }
        .wm-button--ghost {
          color: var(--wm-text); border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.04); backdrop-filter: blur(12px);
        }
        .wm-button--ghost:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.26); background: rgba(255,255,255,0.08); }
        .wm-button--small { min-height: 44px; padding: 0 18px; font-size: 11px; letter-spacing: 0.14em; }
        .wm-link {
          display: inline-flex; align-items: center; gap: 8px; color: #ffcf80;
          text-decoration: none; font-size: 12px; font-weight: 800;
          letter-spacing: 0.14em; text-transform: uppercase;
          transition: gap .22s ease, color .22s ease;
        }
        .wm-link:hover { gap: 14px; color: white; }
        .wm-link svg { width: 14px; height: 14px; }

        /* ── HERO ── */
        .wm-contact-hero {
          position: relative; min-height: 100svh;
          display: flex; align-items: stretch; overflow: hidden;
        }
        .wm-contact-hero__bg {
          position: absolute; inset: -6%;
          background-position: center top; background-size: cover;
          will-change: transform;
        }
        .wm-contact-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(110deg, rgba(9,6,4,0.96) 0%, rgba(9,6,4,0.84) 40%, rgba(9,6,4,0.42) 72%, rgba(9,6,4,0.18) 100%),
            linear-gradient(180deg, rgba(9,6,4,0.32) 0%, rgba(9,6,4,0.96) 100%);
        }
        .wm-contact-hero__noise {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 170px 170px;
        }
        .wm-contact-hero__beam {
          position: absolute; inset: auto -10% 8% auto;
          width: 45vw; height: 45vw; border-radius: 999px;
          background: radial-gradient(circle, rgba(242,188,89,0.12) 0%, rgba(235,113,38,0.08) 25%, transparent 70%);
          filter: blur(16px); pointer-events: none;
        }
        .wm-contact-hero__orb {
          position: absolute; inset: 12% auto auto 8%;
          width: 260px; height: 260px; border-radius: 999px;
          background: radial-gradient(circle, rgba(235,113,38,0.18) 0%, transparent 68%);
          filter: blur(28px); pointer-events: none;
        }
        .wm-contact-hero__inner {
          position: relative; z-index: 2;
          display: grid; gap: 54px; grid-template-columns: 1fr;
          align-items: center; padding: 150px 0 96px;
        }
        .wm-contact-hero__copy { max-width: 680px; }

        /* hero badge (same as index) */
        .wm-hero__badge {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 9px 16px 9px 10px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06); backdrop-filter: blur(14px);
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

        .wm-contact-hero__title {
          margin: 28px 0 0;
          font-size: clamp(62px, 9vw, 114px);
        }
        .wm-contact-hero__line {
          display: block; overflow: hidden;
        }
        .wm-contact-hero__line span { display: block; }
        .wm-contact-hero__line--accent span {
          background: linear-gradient(90deg, #ffe3b1 0%, #f4a756 22%, #eb7126 55%, #ffcf80 100%);
          background-clip: text; -webkit-background-clip: text; color: transparent;
          animation: wm-shimmer 7s linear infinite; background-size: 220% auto;
        }
        @keyframes wm-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .wm-contact-hero__sub {
          margin: 24px 0 0; max-width: 540px;
          font-size: 16px; line-height: 1.85; color: var(--wm-text-soft);
        }
        .wm-contact-hero__actions {
          display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px;
        }

        /* hero signals */
        .wm-contact-hero__signals {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px; margin-top: 34px; max-width: 620px;
        }
        .wm-contact-hero__signal {
          padding: 18px 18px 17px; border-radius: 22px;
          border: 1px solid var(--wm-border);
          background: rgba(255,255,255,0.05); backdrop-filter: blur(14px);
        }
        .wm-contact-hero__signal-top {
          display: flex; align-items: center; gap: 10px;
          color: #ffcf80; font-size: 12px; font-weight: 800;
          letter-spacing: 0.14em; text-transform: uppercase;
        }
        .wm-contact-hero__signal-top svg { width: 14px; height: 14px; }
        .wm-contact-hero__signal-copy {
          margin-top: 10px; font-size: 13px; line-height: 1.7; color: var(--wm-text-soft);
        }

        /* scroll cue */
        .wm-scroll-cue {
          position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          z-index: 2; color: var(--wm-text-faint);
          font-size: 10px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase;
        }
        .wm-scroll-cue__track {
          width: 1px; height: 54px;
          background: rgba(255,255,255,0.12); position: relative; overflow: hidden;
        }
        .wm-scroll-cue__track::after {
          content: ''; position: absolute; top: -100%; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(180deg, transparent, #ffcf80, transparent);
          animation: wm-scroll-drop 2.15s ease-in-out infinite;
        }
        @keyframes wm-scroll-drop {
          0% { top: -100%; opacity: 0; }
          20% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* ── MARQUEE ── */
        .wm-marquee {
          position: relative; overflow: hidden; padding: 16px 0;
          background: linear-gradient(90deg, #f3b154 0%, #eb7126 36%, #c95a12 100%);
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .wm-marquee::before, .wm-marquee::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 70px;
          pointer-events: none; z-index: 1;
        }
        .wm-marquee::before { left: 0; background: linear-gradient(90deg, rgba(235,113,38,1), rgba(235,113,38,0)); }
        .wm-marquee::after { right: 0; background: linear-gradient(270deg, rgba(201,90,18,1), rgba(201,90,18,0)); }
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
        .wm-marquee__dot { width: 5px; height: 5px; border-radius: 999px; background: rgba(255,255,255,0.58); flex-shrink: 0; }
        @keyframes wm-marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ── MAIN GRID ── */
        .wm-contact-main {
          padding: 100px 0 110px;
        }
        .wm-contact-grid {
          display: grid; grid-template-columns: 1fr 1.42fr;
          gap: 40px; align-items: start; margin-top: 60px;
        }

        /* ── INFO COLUMN ── */
        .wm-info-col { display: flex; flex-direction: column; gap: 18px; }

        /* reach card */
        .wm-reach-card {
          position: relative; overflow: hidden;
          padding: 30px; border-radius: var(--wm-radius-lg);
          border: 1px solid var(--wm-border);
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), rgba(19,13,9,0.9);
          box-shadow: var(--wm-shadow-lg);
          transition: transform .26s ease, border-color .26s ease, box-shadow .26s ease;
        }
        .wm-reach-card:hover { transform: translateY(-4px); border-color: var(--wm-amber-border); box-shadow: 0 28px 68px rgba(0,0,0,0.4); }
        .wm-reach-card__glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at top right, rgba(235,113,38,0.14), transparent 42%);
          opacity: 0; transition: opacity .26s ease; pointer-events: none;
        }
        .wm-reach-card:hover .wm-reach-card__glow { opacity: 1; }

        .wm-card-kicker {
          font-size: 10px; font-weight: 800; letter-spacing: 0.2em;
          text-transform: uppercase; color: #ffcf80; margin-bottom: 20px;
        }
        .wm-contact-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 18px; }
        .wm-contact-list li { display: flex; align-items: flex-start; gap: 14px; }
        .wm-ci {
          width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
          background: rgba(235,113,38,0.12); border: 1px solid rgba(235,113,38,0.22);
          display: flex; align-items: center; justify-content: center;
          transition: background .25s, transform .35s cubic-bezier(.34,1.56,.64,1);
        }
        .wm-reach-card:hover .wm-ci { background: var(--wm-amber); transform: scale(1.1) rotate(-5deg); }
        .wm-ci svg { width: 17px; height: 17px; color: #ffd08d; transition: color .25s; }
        .wm-reach-card:hover .wm-ci svg { color: #fff; }
        .wm-ct { font-size: 14px; font-weight: 700; color: var(--wm-text); text-decoration: none; transition: color .2s; }
        .wm-ct:hover { color: #ffcf80; }
        .wm-cs { font-size: 11px; color: var(--wm-text-faint); margin-top: 3px; }

        /* hours panel */
        .wm-hours-panel {
          padding: 24px 26px; border-radius: var(--wm-radius-md);
          background: rgba(235,113,38,0.08); border: 1px solid rgba(235,113,38,0.2);
          display: flex; align-items: center; gap: 16px;
        }
        .wm-hours-icon {
          width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0;
          background: rgba(235,113,38,0.15); border: 1px solid rgba(235,113,38,0.24);
          display: flex; align-items: center; justify-content: center;
        }
        .wm-hours-icon svg { width: 18px; height: 18px; color: #ffcf80; }
        .wm-hours-title { font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--wm-text); }
        .wm-hours-body { font-size: 13px; color: var(--wm-text-soft); margin-top: 5px; line-height: 1.65; }

        /* location mini-cards in info col */
        .wm-loc-mini {
          position: relative; overflow: hidden;
          padding: 24px 26px; border-radius: 28px;
          border: 1px solid var(--wm-border);
          background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01)), rgba(18,13,9,0.88);
          box-shadow: var(--wm-shadow-lg);
          transition: transform .26s ease, border-color .26s ease, box-shadow .26s ease;
        }
        .wm-loc-mini:hover { transform: translateY(-4px); border-color: var(--wm-amber-border); box-shadow: 0 28px 76px rgba(0,0,0,0.42); }
        .wm-loc-mini__glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at top right, rgba(235,113,38,0.14), transparent 42%);
          opacity: 0; transition: opacity .26s ease; pointer-events: none;
        }
        .wm-loc-mini:hover .wm-loc-mini__glow { opacity: 1; }
        .wm-loc-mini__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .wm-loc-mini__num { font-size: 10px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--wm-text-faint); }
        .wm-loc-mini__badge {
          font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
          color: #ffcf80; background: rgba(235,113,38,0.12); border-radius: 8px;
          padding: 4px 9px; white-space: nowrap; flex-shrink: 0;
          border: 1px solid rgba(235,113,38,0.2);
        }
        .wm-loc-mini__name {
          font-family: "Fraunces", Georgia, serif;
          font-size: 28px; font-weight: 700; color: var(--wm-text);
          margin-top: 12px; line-height: 1;
        }
        .wm-loc-mini__addr { font-size: 12px; color: var(--wm-text-faint); margin-top: 7px; line-height: 1.6; }
        .wm-loc-mini__phone {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
          color: #ffcf80; text-decoration: none; margin-top: 16px;
          transition: gap .22s, color .22s;
        }
        .wm-loc-mini__phone:hover { gap: 11px; color: white; }
        .wm-loc-mini__phone svg { width: 13px; height: 13px; }

        /* ── FORM COLUMN ── */
        .wm-form-card {
          position: relative; overflow: hidden;
          padding: 48px 44px; border-radius: var(--wm-radius-xl);
          border: 1px solid var(--wm-border);
          background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01)), rgba(19,13,9,0.92);
          box-shadow: var(--wm-shadow-xl);
        }
        .wm-form-card::before {
          content: ''; position: absolute; top: -80px; right: -80px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(235,113,38,0.11) 0%, transparent 70%);
          pointer-events: none;
        }
        .wm-form-card::after {
          content: ''; position: absolute; bottom: -60px; left: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(242,188,89,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .wm-form-title {
          font-family: "Fraunces", Georgia, serif;
          font-size: 44px; font-weight: 700; color: var(--wm-text); line-height: 1.02;
        }
        .wm-form-sub {
          margin-top: 10px; font-size: 14px;
          color: var(--wm-text-soft); line-height: 1.75; max-width: 480px;
        }
        .wm-form-divider {
          width: 48px; height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
          margin: 22px 0 32px;
        }
        .wm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .wm-field { display: flex; flex-direction: column; gap: 7px; }
        .wm-field.full { grid-column: 1 / -1; }
        .wm-field label {
          font-size: 10px; font-weight: 800; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--wm-text-faint);
        }
        .wm-field input, .wm-field textarea, .wm-field select {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; color: var(--wm-text);
          font-family: "Manrope", sans-serif; font-size: 14px;
          padding: 14px 17px; transition: border-color .25s, box-shadow .25s;
          outline: none; width: 100%; resize: none;
        }
        .wm-field input::placeholder, .wm-field textarea::placeholder { color: rgba(250,244,237,0.22); }
        .wm-field input:focus, .wm-field textarea:focus, .wm-field select:focus {
          border-color: #eb7126; box-shadow: 0 0 0 3px rgba(235,113,38,0.16);
          background: rgba(235,113,38,0.05);
        }
        .wm-field select {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23ffcf80' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px;
        }
        .wm-field select option { background: #1a130f; color: var(--wm-text); }
        .wm-field textarea { min-height: 130px; }
        .wm-char-count { font-size: 10px; color: var(--wm-text-faint); text-align: right; margin-top: 4px; }
        .wm-err { font-size: 11px; color: #ef4444; margin-top: 3px; }

        .wm-form-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 30px; flex-wrap: wrap; gap: 18px;
        }
        .wm-submit {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 34px; border: none; border-radius: 999px; cursor: pointer;
          font-family: "Manrope", sans-serif; font-size: 12px; font-weight: 800;
          letter-spacing: 0.16em; text-transform: uppercase; color: white;
          background: linear-gradient(135deg, #f18b3e 0%, #eb7126 48%, #c95a12 100%);
          box-shadow: var(--wm-shadow-amber);
          transition: transform .24s ease, box-shadow .24s ease;
        }
        .wm-submit:hover { transform: translateY(-2px); box-shadow: 0 26px 58px rgba(201,90,18,0.4); }
        .wm-submit:active { transform: translateY(0); }
        .wm-submit svg { width: 15px; height: 15px; }
        .wm-privacy {
          font-size: 11px; color: var(--wm-text-faint);
          line-height: 1.6; max-width: 220px;
        }

        /* success state */
        .wm-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; min-height: 500px;
          padding: 40px 0;
        }
        .wm-success-ring {
          width: 96px; height: 96px; border-radius: 50%;
          background: linear-gradient(135deg, #f4a756 0%, #eb7126 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 16px 48px rgba(235,113,38,0.42);
          animation: wm-pop-in .6s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes wm-pop-in { from { transform: scale(0) rotate(-180deg); } to { transform: scale(1) rotate(0); } }
        .wm-success h3 {
          font-family: "Fraunces", Georgia, serif;
          font-size: 44px; font-weight: 700; color: var(--wm-text); margin-top: 26px;
        }
        .wm-success p { font-size: 15px; color: var(--wm-text-soft); margin-top: 12px; max-width: 340px; line-height: 1.75; }
        .wm-reset {
          background: none; border: none; color: #ffcf80;
          font-family: "Manrope", sans-serif; font-size: 13px; font-weight: 700;
          cursor: pointer; margin-top: 22px; text-decoration: underline;
          transition: color .2s;
        }
        .wm-reset:hover { color: white; }

        /* ── LOCATIONS STRIP ── */
        .wm-locations-strip {
          padding: 100px 0;
          background:
            radial-gradient(circle at 90% 10%, rgba(235, 113, 38, 0.12), transparent 18%),
            linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.01) 100%);
        }
        .wm-locations-strip__hdr {
          margin-bottom: 56px;
        }
        .wm-locations-strip__title {
          font-family: "Fraunces", Georgia, serif;
          font-size: clamp(42px, 5vw, 72px); font-weight: 600;
          letter-spacing: -0.03em; line-height: 0.98;
          margin: 18px 0 0; color: var(--wm-text);
        }
        .wm-locations-strip__title em { font-style: italic; color: #ffd08d; }
        .wm-locations-strip__sub {
          margin-top: 16px; max-width: 560px;
          font-size: 15px; line-height: 1.8; color: var(--wm-text-soft);
        }
        .wm-strip-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        .wm-strip-card {
          position: relative; overflow: hidden;
          padding: 30px; min-height: 300px; display: flex; flex-direction: column;
          border-radius: 30px; border: 1px solid var(--wm-border);
          background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)), rgba(18,13,9,0.86);
          box-shadow: var(--wm-shadow-lg);
          transition: transform .26s ease, border-color .26s ease, box-shadow .26s ease;
        }
        .wm-strip-card:hover { transform: translateY(-4px); border-color: var(--wm-amber-border); box-shadow: 0 28px 76px rgba(0,0,0,0.42); }
        .wm-strip-card__glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at top right, rgba(235,113,38,0.14), transparent 42%);
          opacity: 0; transition: opacity .26s ease; pointer-events: none;
        }
        .wm-strip-card:hover .wm-strip-card__glow { opacity: 1; }
        .wm-strip-card__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
        .wm-strip-card__kicker { font-size: 10px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--wm-text-faint); }
        .wm-strip-card__specialty { font-size: 10px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #ffcf80; }
        .wm-strip-card__name {
          font-family: "Fraunces", Georgia, serif;
          font-size: 36px; font-weight: 700; color: var(--wm-text);
          margin-top: 22px; line-height: 1.02;
        }
        .wm-strip-card__addr { font-size: 13px; color: var(--wm-text-soft); margin-top: 12px; line-height: 1.65; }
        .wm-strip-card__rail {
          width: 48px; height: 2px; border-radius: 999px;
          background: linear-gradient(90deg, #ffcf80, #eb7126); margin-top: 22px;
        }
        .wm-strip-card__actions {
          margin-top: auto; padding-top: 26px;
          display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
        }
        .wm-strip-card__phone {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--wm-text-soft); font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none;
          transition: color .22s;
        }
        .wm-strip-card__phone:hover { color: white; }
        .wm-strip-card__phone svg { width: 13px; height: 13px; }

        /* ── RESPONSIVE ── */
        @media (min-width: 1040px) {
          .wm-contact-hero__inner {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 1100px) {
          .wm-contact-grid { grid-template-columns: 1fr; }
          .wm-strip-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .wm-contact-main { padding: 72px 0 80px; }
          .wm-locations-strip { padding: 72px 0; }
          .wm-form-card { padding: 30px 22px; }
          .wm-form-grid { grid-template-columns: 1fr; }
          .wm-contact-hero__title { font-size: clamp(52px, 14vw, 72px); }
          .wm-strip-grid { grid-template-columns: 1fr; }
          .wm-contact-hero__signals { grid-template-columns: 1fr; }
          .wm-contact-hero__actions { flex-direction: column; align-items: stretch; }
          .wm-button { width: 100%; }
          .wm-section { width: min(1320px, calc(100vw - 24px)); }
        }
        @media (hover: none) {
          .wm-reach-card:hover,
          .wm-loc-mini:hover,
          .wm-strip-card:hover { transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ── progress bar ── */}
      <motion.div className="wm-progress" style={{ scaleX: progress }} />

      {/* ── custom cursor ── */}
      {interactiveMotion && (
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
      )}

      <div className="wm-page">

        {/* ════════════ HERO ════════════ */}
        <section ref={heroRef} className="wm-contact-hero">
          <motion.div
            className="wm-contact-hero__bg"
            style={{
              backgroundImage: `url(${bannerImg})`,
              y: heroY,
              scale: heroScale,
              opacity: heroOpacity,
            }}
          />
          <div className="wm-contact-hero__overlay" />
          <div className="wm-contact-hero__noise" />
          <div className="wm-contact-hero__beam" />
          <div className="wm-contact-hero__orb" />

          <div className="wm-section wm-contact-hero__inner">
            <motion.div
              className="wm-contact-hero__copy"
              style={{ y: copyY }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* badge */}
              <div className="wm-hero__badge">
                <span className="wm-hero__badge-icon"><Sparkles /></span>
                <span className="wm-hero__badge-copy">
                  <strong>Three Locations</strong> — we're always close
                </span>
              </div>

              {/* title */}
              <h1 className="wm-display wm-contact-hero__title">
                {["Let's", "Talk."].map((word, i) => (
                  <span key={word} className={`wm-contact-hero__line${i === 1 ? " wm-contact-hero__line--accent" : ""}`}>
                    <motion.span
                      initial={{ y: "110%", rotateX: 12 }}
                      animate={{ y: "0%", rotateX: 0 }}
                      transition={{
                        duration: 0.95,
                        delay: 0.08 + i * 0.16,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                className="wm-contact-hero__sub"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42 }}
              >
                Questions, catering, feedback — we love hearing from our Maryland family. Reach us any way you like.
              </motion.p>

              <motion.div
                className="wm-contact-hero__actions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.55 }}
              >
                <a
                  href={`tel:${SITE.phones?.[0]?.replace(/\D/g, "")}`}
                  className="wm-button wm-button--primary"
                >
                  <Phone size={14} /> Call Us Now
                </a>
                <a href={`mailto:${SITE.email}`} className="wm-button wm-button--ghost">
                  <Mail size={14} /> Send Email
                </a>
              </motion.div>

              <motion.div
                className="wm-contact-hero__signals"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.72 }}
              >
                {[
                  { icon: MessageSquare, label: "Quick Response", copy: "We reply within one business day — usually sooner." },
                  { icon: Clock, label: "Open Daily", copy: "Sun–Thu 10 AM–10 PM · Fri–Sat 10 AM–11 PM" },
                  { icon: MapPin, label: "3 Locations", copy: "Sharptown, Vienna, and East New Market, MD." },
                ].map((s) => (
                  <div key={s.label} className="wm-contact-hero__signal">
                    <div className="wm-contact-hero__signal-top">
                      <s.icon /> {s.label}
                    </div>
                    <div className="wm-contact-hero__signal-copy">{s.copy}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          <div className="wm-scroll-cue">
            <div className="wm-scroll-cue__track" />
            <span>Scroll</span>
          </div>
        </section>

        {/* ════════════ MARQUEE ════════════ */}
        <section className="wm-marquee" aria-label="Contact highlights">
          <div className="wm-marquee__track">
            {Array.from({ length: 2 }).map((_, pass) =>
              ["Phone", "Email", "Catering Inquiries", "Three Locations", "Fast Response", "Family Owned", "Maryland Kitchens", "Open Daily"].map(
                (item, i) => (
                  <div key={`${pass}-${i}`} className="wm-marquee__item">
                    {item}
                    <span className="wm-marquee__dot" />
                  </div>
                )
              )
            )}
          </div>
        </section>

        {/* ════════════ MAIN CONTENT ════════════ */}
        <section className="wm-contact-main">
          <div className="wm-section">

            {/* section intro */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="wm-eyebrow">
                <span className="wm-eyebrow__line" />
                Get In Touch
                <span className="wm-eyebrow__line" />
              </span>
              <h2 className="wm-display" style={{ fontSize: "clamp(42px,5vw,72px)", margin: "18px 0 0", color: "var(--wm-text)" }}>
                We'd love to <em>hear from you.</em>
              </h2>
              <p style={{ marginTop: 16, maxWidth: 560, fontSize: 15, lineHeight: 1.8, color: "var(--wm-text-soft)" }}>
                Use the form, call your nearest kitchen, or shoot us an email — however you prefer to reach out, we're ready.
              </p>
            </motion.div>

            {/* two-column grid */}
            <div className="wm-contact-grid">

              {/* ── LEFT: info column ── */}
              <motion.div
                className="wm-info-col"
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* reach card */}
                <div className="wm-reach-card" data-cursor="interactive">
                  <div className="wm-reach-card__glow" />
                  <div className="wm-card-kicker">Reach Us Directly</div>
                  <ul className="wm-contact-list">
                    {SITE.phones?.map((p: string, i: number) => (
                      <li key={p}>
                        <div className="wm-ci"><Phone size={17} /></div>
                        <div>
                          <a href={`tel:${p.replace(/\D/g, "")}`} className="wm-ct">{p}</a>
                          <div className="wm-cs">{LOCATIONS[i]?.name ?? "General Line"}</div>
                        </div>
                      </li>
                    ))}
                    <li>
                      <div className="wm-ci"><Mail size={17} /></div>
                      <div>
                        <a href={`mailto:${SITE.email}`} className="wm-ct">{SITE.email}</a>
                        <div className="wm-cs">General inquiries &amp; catering</div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* hours */}
                <div className="wm-hours-panel">
                  <div className="wm-hours-icon"><Clock size={18} /></div>
                  <div>
                    <div className="wm-hours-title">Kitchen Hours</div>
                    <div className="wm-hours-body">
                      Sun – Thu &nbsp;&nbsp;10 AM – 10 PM<br />
                      Fri – Sat &nbsp;&nbsp;&nbsp;&nbsp;10 AM – 11 PM
                    </div>
                  </div>
                </div>

                {/* location mini-cards */}
                {LOCATIONS.map((l: typeof LOCATIONS[number], i: number) => (
                  <motion.div
                    key={l.slug}
                    className="wm-loc-mini"
                    data-cursor="interactive"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.52, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="wm-loc-mini__glow" />
                    <div className="wm-loc-mini__head">
                      <div className="wm-loc-mini__num">0{i + 1} / Maryland</div>
                      <div className="wm-loc-mini__badge">{l.specialty.split(" · ")[0]}</div>
                    </div>
                    <div className="wm-loc-mini__name">{l.name}</div>
                    <div className="wm-loc-mini__addr">{l.address}</div>
                    <a href={l.phoneHref} className="wm-loc-mini__phone">
                      <Phone size={13} /> {l.phone} <ArrowRight size={13} />
                    </a>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── RIGHT: form ── */}
              <motion.div
                className="wm-form-card"
                initial={{ opacity: 0, x: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.68, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="wm-success"
                    >
                      <div className="wm-success-ring">
                        <Check size={44} strokeWidth={2.5} color="#fff" />
                      </div>
                      <h3>Message Sent!</h3>
                      <p>Thanks for reaching out. We'll get back to you within one business day.</p>
                      <button className="wm-reset" onClick={() => setSubmitted(false)}>
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.18 } }}
                    >
                      <div className="wm-form-title">Send us a message</div>
                      <div className="wm-form-sub">
                        We typically respond within one business day. For urgent orders, call your nearest location directly.
                      </div>
                      <div className="wm-form-divider" />

                      <div className="wm-form-grid">
                        <div className="wm-field">
                          <label htmlFor="name">Full Name</label>
                          <input id="name" name="name" type="text" placeholder="John Smith" maxLength={100} />
                          {errors.name && <span className="wm-err">{errors.name}</span>}
                        </div>

                        <div className="wm-field">
                          <label htmlFor="email">Email Address</label>
                          <input id="email" name="email" type="email" placeholder="john@example.com" maxLength={255} />
                          {errors.email && <span className="wm-err">{errors.email}</span>}
                        </div>

                        <div className="wm-field">
                          <label htmlFor="phone">Phone (optional)</label>
                          <input id="phone" name="phone" type="tel" placeholder="(410) 555-0000" maxLength={40} />
                        </div>

                        <div className="wm-field">
                          <label htmlFor="subject">Subject</label>
                          <select id="subject" name="subject" defaultValue="">
                            <option value="" disabled>Select a topic…</option>
                            <option value="general">General Inquiry</option>
                            <option value="catering">Catering &amp; Events</option>
                            <option value="order">Order Issue</option>
                            <option value="feedback">Feedback</option>
                            <option value="careers">Careers</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.subject && <span className="wm-err">{errors.subject}</span>}
                        </div>

                        <div className="wm-field full">
                          <label htmlFor="message">Message</label>
                          <textarea
                            id="message"
                            name="message"
                            maxLength={1000}
                            placeholder="Tell us how we can help…"
                            onChange={(e) => setCharCount(e.target.value.length)}
                          />
                          <div className="wm-char-count">{charCount} / 1000</div>
                          {errors.message && <span className="wm-err">{errors.message}</span>}
                        </div>
                      </div>

                      <div className="wm-form-footer">
                        <button type="submit" className="wm-submit">
                          <Send size={15} /> Send Message
                        </button>
                        <p className="wm-privacy">
                          Your info is never shared. We'll only use it to respond to your message.
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ════════════ LOCATIONS STRIP ════════════ */}
        <section className="wm-locations-strip">
          <div className="wm-section">
            <div className="wm-locations-strip__hdr">
              <span className="wm-eyebrow">
                <span className="wm-eyebrow__line" />
                Find Us
                <span className="wm-eyebrow__line" />
              </span>
              <h2 className="wm-display wm-locations-strip__title">
                Three Maryland <em>kitchens.</em>
              </h2>
              <p className="wm-locations-strip__sub">
                Each location keeps the same food-first attitude, but every town brings its own personality to the counter.
              </p>
            </div>

            <div className="wm-strip-grid">
              {LOCATIONS.map((l: typeof LOCATIONS[number], i: number) => (
                <motion.div
                  key={l.slug}
                  className="wm-strip-card"
                  data-cursor="interactive"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wm-strip-card__glow" />
                  <div className="wm-strip-card__head">
                    <span className="wm-strip-card__kicker">0{i + 1} / Maryland</span>
                    <span className="wm-strip-card__specialty">{l.specialty.split(" · ")[0]}</span>
                  </div>
                  <div className="wm-strip-card__name">{l.name}</div>
                  <div className="wm-strip-card__addr">{l.address}</div>
                  <div className="wm-strip-card__rail" />
                  <div className="wm-strip-card__actions">
                    <a href={l.phoneHref} className="wm-button wm-button--primary wm-button--small">
                      <Phone size={13} /> Call Now
                    </a>
                    <a href={l.phoneHref} className="wm-strip-card__phone">
                      {l.phone} <ChevronRight size={13} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}