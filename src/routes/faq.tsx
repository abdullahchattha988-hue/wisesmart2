import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue, useMotionTemplate, useReducedMotion } from "framer-motion";
import { Sparkles, Plus, ArrowRight, MessageSquare, Phone, Mail, Search, ChevronRight, HelpCircle, BookOpen, Clock, Star } from "lucide-react";
import { FAQS } from "@/data/faqs";
import bannerImg from "@/assets/banner-1.webp";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Wise Mart | Hours, Ordering, Catering, Menus" },
      { name: "description", content: "Answers to common questions about Wise Mart hours, online ordering, catering, menu items, and our three Maryland locations." },
      { property: "og:title", content: "Wise Mart — Frequently Asked Questions" },
      { property: "og:description", content: "Hours, ordering, catering, menus — everything you might want to know." },
    ],
  }),
  component: FAQPage,
});

/* ── CATEGORIES ── */
const CATEGORIES = [
  { id: "all",      label: "All Questions",    count: 0 },
  { id: "ordering", label: "Ordering",          count: 0 },
  { id: "hours",    label: "Hours & Locations", count: 0 },
  { id: "menu",     label: "Menu & Diet",       count: 0 },
  { id: "catering", label: "Catering",          count: 0 },
  { id: "other",    label: "Other",             count: 0 },
];

type TaggedFAQ = { q: string; a: string; cat: string };

function tagFaqs(raw: { q: string; a: string }[]): TaggedFAQ[] {
  const rules: { pattern: RegExp; cat: string }[] = [
    { pattern: /order|pickup|delivery|online/i,                               cat: "ordering" },
    { pattern: /hour|park|location|open|close/i,                              cat: "hours"    },
    { pattern: /vegan|vegetarian|allerg|ingredient|local|source|diet|menu/i,  cat: "menu"     },
    { pattern: /cater|event|party|corporate/i,                                cat: "catering" },
    { pattern: /loyalty|reward|job|apply|career/i,                            cat: "other"    },
  ];
  return raw.map((item) => {
    const combined = item.q + " " + item.a;
    const match = rules.find((r) => r.pattern.test(combined));
    return { ...item, cat: match?.cat ?? "other" };
  });
}

/* ── pointer utility (same as index.tsx) ── */
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
    (media as any).addListener(sync);
    return () => (media as any).removeListener(sync);
  }, []);
  return finePointer;
}

/* ── FAQ ITEM ── */
function FAQItem({ item, index }: { item: TaggedFAQ; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-btn-${index}`;

  return (
    <motion.div
      className="wf-faq-item"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        id={buttonId}
        type="button"
        className={`wf-faq-button${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="wf-faq-question">{item.q}</span>
        <motion.span
          className="wf-faq-icon"
          animate={{
            rotate: open ? 45 : 0,
            backgroundColor: open ? "rgba(235,113,38,0.2)" : "rgba(235,113,38,0.08)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          <Plus />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="wf-faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="wf-faq-answer__inner">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── PAGE ── */
function FAQPage() {
  const [activecat, setActivecat] = useState("all");
  const [query, setQuery]         = useState("");

  const prefersReducedMotion = useReducedMotion();
  const finePointer          = useFinePointer();
  const interactiveMotion    = finePointer && !prefersReducedMotion;

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY      = useTransform(heroProgress, [0, 1], interactiveMotion ? ["0%", "18%"] : ["0%", "0%"]);
  const bgScale  = useTransform(heroProgress, [0, 1], interactiveMotion ? [1, 1.08]  : [1, 1]);
  const bgOpacity = useTransform(heroProgress, [0, 0.9], [1, 0.05]);

  /* page scroll progress bar */
  const { scrollYProgress: pageProgress } = useScroll();
  const progressSpring = useSpring(pageProgress, { stiffness: 180, damping: 26 });

  /* ambient cursor glow */
  const pointerX = useMotionValue(-160);
  const pointerY = useMotionValue(-160);
  const cursorX  = useSpring(pointerX, { stiffness: 500, damping: 40, mass: 0.25 });
  const cursorY  = useSpring(pointerY, { stiffness: 500, damping: 40, mass: 0.25 });
  const cursorAura = useMotionTemplate`radial-gradient(440px circle at ${cursorX}px ${cursorY}px, rgba(235,113,38,0.18) 0%, rgba(235,113,38,0.09) 24%, transparent 62%)`;
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorHover,   setCursorHover]   = useState(false);

  useEffect(() => {
    if (!interactiveMotion) { setCursorVisible(false); setCursorHover(false); return; }
    const onMove = (e: PointerEvent) => { pointerX.set(e.clientX); pointerY.set(e.clientY); setCursorVisible(true); };
    const onOver = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      setCursorHover(Boolean(t.closest("a, button, [data-cursor='interactive']")));
    };
    const onOut   = () => setCursorHover(false);
    const onHide  = () => setCursorVisible(false);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout",  onOut);
    document.documentElement.addEventListener("mouseleave", onHide);
    window.addEventListener("blur", onHide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout",  onOut);
      document.documentElement.removeEventListener("mouseleave", onHide);
      window.removeEventListener("blur", onHide);
    };
  }, [interactiveMotion, pointerX, pointerY]);

  const tagged = tagFaqs(FAQS);

  /* category counts */
  const catsWithCount = CATEGORIES.map((cat) => ({
    ...cat,
    count: cat.id === "all" ? tagged.length : tagged.filter((f) => f.cat === cat.id).length,
  }));

  const filtered = tagged.filter((item) => {
    const matchCat = activecat === "all" || item.cat === activecat;
    const matchQ   = query.trim() === "" ||
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const left  = filtered.filter((_, i) => i % 2 === 0);
  const right = filtered.filter((_, i) => i % 2 !== 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

        :root {
          --wm-ink: #120d09;
          --wm-ink-soft: #1a130f;
          --wm-ink-raised: #221913;
          --wm-text: rgba(250,244,237,0.96);
          --wm-text-soft: rgba(250,244,237,0.72);
          --wm-text-faint: rgba(250,244,237,0.48);
          --wm-amber: #eb7126;
          --wm-amber-deep: #c95a12;
          --wm-amber-soft: rgba(235,113,38,0.14);
          --wm-amber-border: rgba(235,113,38,0.3);
          --wm-gold: #f2bc59;
          --wm-gold-light: #ffcf80;
          --wm-border: rgba(250,244,237,0.12);
          --wm-border-soft: rgba(250,244,237,0.08);
          --wm-shadow-lg: 0 26px 70px rgba(0,0,0,0.36);
          --wm-shadow-xl: 0 40px 110px rgba(0,0,0,0.48);
          --wm-shadow-amber: 0 20px 48px rgba(201,90,18,0.28);
          --wm-radius-md: 20px;
          --wm-radius-lg: 28px;
          --wm-radius-xl: 38px;
        }

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: var(--wm-ink); }
        img  { display: block; max-width: 100%; }

        /* ── PAGE SHELL ── */
        .wf-page {
          position: relative;
          overflow-x: clip;
          color: var(--wm-text);
          background:
            radial-gradient(circle at 8% 0%, rgba(235,113,38,0.1), transparent 28%),
            radial-gradient(circle at 94% 16%, rgba(242,188,89,0.07), transparent 22%),
            linear-gradient(180deg, #120d09 0%, #15100c 46%, #120d09 100%);
          font-family: "Manrope", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── PROGRESS BAR ── */
        .wf-progress {
          position: fixed; top: 0; left: 0; right: 0; height: 3px;
          transform-origin: left center;
          background: linear-gradient(90deg, #ffcf80 0%, #eb7126 45%, #b54d0c 100%);
          z-index: 30;
        }

        /* ── CURSOR ── */
        .wf-page__glow { position: fixed; inset: 0; pointer-events: none; z-index: 3; }
        .wf-cursor-outer, .wf-cursor-inner {
          position: fixed; top: 0; left: 0; pointer-events: none; z-index: 31;
        }
        .wf-cursor-outer {
          width: 44px; height: 44px; margin-top: -22px; margin-left: -22px;
          border-radius: 999px; border: 1px solid rgba(255,207,128,0.6);
          background: rgba(235,113,38,0.08);
          transition: width 0.24s ease, height 0.24s ease, margin 0.24s ease, border-color 0.24s ease, background 0.24s ease;
        }
        .wf-cursor-outer.is-hover {
          width: 68px; height: 68px; margin-top: -34px; margin-left: -34px;
          border-color: rgba(255,207,128,0.8); background: rgba(235,113,38,0.16);
        }
        .wf-cursor-inner {
          width: 8px; height: 8px; margin-top: -4px; margin-left: -4px;
          border-radius: 999px; background: #ffcf80;
          box-shadow: 0 0 24px rgba(255,207,128,0.55);
        }

        /* ── LAYOUT HELPERS ── */
        .wf-section {
          width: min(1320px, calc(100vw - 32px));
          margin: 0 auto;
        }
        .wf-display {
          font-family: "Fraunces", Georgia, serif;
          font-weight: 600; letter-spacing: -0.03em; line-height: 0.98;
        }
        .wf-display em { font-style: italic; color: #ffd08d; }
        .wf-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.24em;
          text-transform: uppercase; color: #ffcf80;
        }
        .wf-eyebrow__line {
          width: 30px; height: 1px;
          background: linear-gradient(90deg, rgba(255,207,128,0.95), transparent);
          display: inline-block;
        }

        /* ── BUTTONS ── */
        .wf-button {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 10px; min-height: 52px; padding: 0 24px; border-radius: 999px;
          font-size: 12px; font-weight: 800; letter-spacing: 0.16em;
          text-transform: uppercase; text-decoration: none;
          transition: transform 0.24s ease, box-shadow 0.24s ease, background 0.24s ease, border-color 0.24s ease;
        }
        .wf-button svg { width: 14px; height: 14px; flex-shrink: 0; }
        .wf-button--primary {
          color: white;
          background: linear-gradient(135deg, #f18b3e 0%, #eb7126 48%, #c95a12 100%);
          box-shadow: var(--wm-shadow-amber);
        }
        .wf-button--primary:hover { transform: translateY(-2px); box-shadow: 0 26px 58px rgba(201,90,18,0.4); }
        .wf-button--ghost {
          color: var(--wm-text); border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.04); backdrop-filter: blur(12px);
        }
        .wf-button--ghost:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.26); background: rgba(255,255,255,0.08); }
        .wf-button--dark {
          color: rgba(250,244,237,0.9); background: rgba(13,9,6,0.82);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .wf-button--dark:hover { transform: translateY(-2px); background: rgba(18,13,9,0.96); }
        .wf-button--small { min-height: 44px; padding: 0 18px; font-size: 11px; letter-spacing: 0.14em; }
        .wf-link {
          display: inline-flex; align-items: center; gap: 8px;
          color: #ffcf80; text-decoration: none; font-size: 12px;
          font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
          transition: gap 0.22s ease, color 0.22s ease;
        }
        .wf-link:hover { gap: 14px; color: white; }
        .wf-link svg { width: 14px; height: 14px; }

        /* ── HERO BANNER ── */
        .wf-hero {
          position: relative; min-height: 100svh;
          display: flex; align-items: flex-end; overflow: hidden;
        }
        .wf-hero__bg {
          position: absolute; inset: -6%;
          background-position: center 30%; background-size: cover; will-change: transform;
        }
        .wf-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(110deg, rgba(9,6,4,0.96) 0%, rgba(9,6,4,0.84) 38%, rgba(9,6,4,0.48) 68%, rgba(9,6,4,0.14) 100%),
            linear-gradient(180deg, rgba(9,6,4,0.28) 0%, rgba(9,6,4,0.96) 100%);
        }
        .wf-hero__noise {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 170px 170px;
        }
        .wf-hero__beam {
          position: absolute; inset: auto -10% 5% auto;
          width: 44vw; height: 44vw; border-radius: 999px;
          background: radial-gradient(circle, rgba(242,188,89,0.12) 0%, rgba(235,113,38,0.07) 24%, transparent 68%);
          filter: blur(18px); pointer-events: none;
        }
        .wf-hero__orb {
          position: absolute; inset: 10% auto auto 6%;
          width: 240px; height: 240px; border-radius: 999px;
          background: radial-gradient(circle, rgba(235,113,38,0.16) 0%, transparent 68%);
          filter: blur(28px); pointer-events: none;
        }
        .wf-hero__inner {
          position: relative; z-index: 2; width: 100%;
          max-width: 1320px; margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 48px) clamp(64px, 8vw, 96px);
          display: grid; grid-template-columns: 1fr 420px; gap: 60px; align-items: flex-end;
        }
        @media(max-width:1100px){ .wf-hero__inner { grid-template-columns: 1fr; } }
        @media(max-width:640px){ .wf-hero__inner { padding-bottom: 56px; } }

        .wf-hero__badge {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 9px 16px 9px 10px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06); backdrop-filter: blur(14px);
          margin-bottom: 28px;
        }
        .wf-hero__badge-icon {
          width: 30px; height: 30px; border-radius: 999px;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #f4a756 0%, #eb7126 100%);
          box-shadow: 0 0 0 5px rgba(235,113,38,0.12);
        }
        .wf-hero__badge-icon svg { width: 14px; height: 14px; color: white; }
        .wf-hero__badge-copy {
          font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--wm-text-soft);
        }
        .wf-hero__badge-copy strong { color: white; }

        .wf-hero__title {
          font-family: "Fraunces", Georgia, serif;
          font-weight: 600; letter-spacing: -0.03em; line-height: 0.96;
          font-size: clamp(62px, 10vw, 118px); margin: 0 0 28px;
        }
        .wf-hero__line { display: block; overflow: hidden; }
        .wf-hero__line span { display: block; }
        .wf-hero__line--accent span {
          background: linear-gradient(90deg, #ffe3b1 0%, #f4a756 22%, #eb7126 55%, #ffcf80 100%);
          background-clip: text; -webkit-background-clip: text; color: transparent;
          animation: wf-shimmer 7s linear infinite; background-size: 220% auto;
        }
        @keyframes wf-shimmer { 0%{ background-position: 0% center; } 100%{ background-position: 200% center; } }

        .wf-hero__sub {
          max-width: 540px; font-size: 16px; line-height: 1.85;
          color: var(--wm-text-soft); margin: 0 0 32px;
        }
        .wf-hero__actions { display: flex; flex-wrap: wrap; gap: 14px; }

        /* hero right: stat card panel */
        .wf-hero__panel {
          display: flex; flex-direction: column; gap: 16px; padding-bottom: 6px;
        }
        @media(max-width:1100px){ .wf-hero__panel { display: none; } }

        .wf-hero__stat-card {
          padding: 22px 24px; border-radius: 26px;
          border: 1px solid var(--wm-border);
          background: rgba(255,255,255,0.05); backdrop-filter: blur(14px);
          box-shadow: var(--wm-shadow-lg);
        }
        .wf-hero__stat-top {
          display: flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 800; letter-spacing: 0.16em;
          text-transform: uppercase; color: #ffcf80;
        }
        .wf-hero__stat-top svg { width: 14px; height: 14px; }
        .wf-hero__stat-copy {
          margin-top: 10px; font-size: 13px; line-height: 1.7; color: var(--wm-text-soft);
        }

        .wf-scroll-cue {
          position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 2;
          color: var(--wm-text-faint); font-size: 10px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
        }
        .wf-scroll-cue__track {
          width: 1px; height: 54px; background: rgba(255,255,255,0.12);
          position: relative; overflow: hidden;
        }
        .wf-scroll-cue__track::after {
          content: ""; position: absolute; top: -100%; left: 0; width: 100%; height: 100%;
          background: linear-gradient(180deg, transparent, #ffcf80, transparent);
          animation: wf-scroll-drop 2.15s ease-in-out infinite;
        }
        @keyframes wf-scroll-drop {
          0%  { top: -100%; opacity: 0; }
          20% { opacity: 1; }
          100%{ top: 100%; opacity: 0; }
        }

        /* ── SEARCH + FILTERS ── */
        .wf-controls {
          padding: 64px 0 0;
        }
        .wf-controls__inner {
          display: flex; flex-direction: column; gap: 28px;
        }
        .wf-search-wrap { position: relative; max-width: 600px; }
        .wf-search-icon {
          position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.3); pointer-events: none; width: 16px; height: 16px;
        }
        .wf-search-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--wm-border);
          border-radius: 999px;
          color: var(--wm-text);
          font-family: "Manrope", sans-serif;
          font-size: 14px; font-weight: 500;
          padding: 16px 24px 16px 50px;
          outline: none;
          backdrop-filter: blur(12px);
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .wf-search-input::placeholder { color: rgba(255,255,255,0.28); }
        .wf-search-input:focus {
          border-color: var(--wm-amber);
          box-shadow: 0 0 0 3px rgba(235,113,38,0.18);
          background: rgba(255,255,255,0.06);
        }

        .wf-filters { display: flex; flex-wrap: wrap; gap: 10px; }
        .wf-filter {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 999px;
          font-family: "Manrope", sans-serif;
          font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
          border: 1px solid var(--wm-border);
          background: rgba(255,255,255,0.03);
          color: var(--wm-text-soft); cursor: pointer;
          transition: all 0.22s;
        }
        .wf-filter:hover { border-color: var(--wm-amber-border); color: #ffcf80; background: rgba(235,113,38,0.06); }
        .wf-filter.is-active {
          background: linear-gradient(135deg, #f18b3e 0%, #eb7126 48%, #c95a12 100%);
          border-color: transparent; color: white;
          box-shadow: var(--wm-shadow-amber);
        }
        .wf-filter__count {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 20px; height: 20px; padding: 0 6px;
          border-radius: 999px; font-size: 10px; font-weight: 800;
          background: rgba(255,255,255,0.14); color: inherit;
        }
        .wf-filter.is-active .wf-filter__count { background: rgba(255,255,255,0.22); }

        /* ── MAIN CONTENT LAYOUT ── */
        .wf-main { padding: 48px 0 80px; }
        .wf-count-row {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          margin-bottom: 36px; flex-wrap: wrap;
        }
        .wf-count {
          font-size: 11px; font-weight: 800; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--wm-text-faint);
        }
        .wf-count span { color: #ffcf80; }

        .wf-cols {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0 40px; align-items: start;
        }
        @media(max-width:860px){ .wf-cols { grid-template-columns: 1fr; } }

        /* ── FAQ ITEM (matches index.tsx exactly) ── */
        .wf-faq-item { border-bottom: 1px solid var(--wm-border-soft); }
        .wf-faq-button {
          width: 100%; padding: 22px 0;
          display: flex; align-items: center; justify-content: space-between;
          gap: 18px; border: 0; background: transparent;
          color: inherit; text-align: left; cursor: pointer;
        }
        .wf-faq-question {
          font-size: 15px; line-height: 1.55; color: var(--wm-text-soft);
          transition: color 0.22s ease;
        }
        .wf-faq-button.is-open .wf-faq-question,
        .wf-faq-button:hover .wf-faq-question { color: white; }
        .wf-faq-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 999px; color: #ffcf80;
          border: 1px solid rgba(235,113,38,0.24);
        }
        .wf-faq-icon svg { width: 14px; height: 14px; }
        .wf-faq-answer { overflow: hidden; }
        .wf-faq-answer__inner {
          padding: 0 0 22px;
          font-size: 14px; line-height: 1.8; color: var(--wm-text-soft);
        }

        /* ── EMPTY STATE ── */
        .wf-empty {
          grid-column: 1 / -1; text-align: center; padding: 80px 0;
        }
        .wf-empty__icon {
          width: 64px; height: 64px; border-radius: 20px; margin: 0 auto 24px;
          background: rgba(235,113,38,0.1); border: 1px solid var(--wm-amber-border);
          display: flex; align-items: center; justify-content: center; color: #ffcf80;
        }
        .wf-empty__icon svg { width: 26px; height: 26px; }
        .wf-empty__title {
          font-family: "Fraunces", Georgia, serif;
          font-size: 34px; font-weight: 600; color: rgba(250,244,237,0.6); margin-bottom: 10px;
        }
        .wf-empty__copy { font-size: 14px; color: var(--wm-text-faint); }

        /* ── CONTACT SECTION ── */
        .wf-contact {
          padding: 110px 0;
          background:
            radial-gradient(circle at 84% 14%, rgba(235,113,38,0.1), transparent 18%),
            rgba(255,255,255,0.015);
        }
        .wf-contact__intro { text-align: center; margin-bottom: 56px; }
        .wf-contact__title {
          font-size: clamp(38px, 5vw, 64px);
          margin: 18px 0 0;
        }
        .wf-contact__sub {
          margin-top: 16px; font-size: 15px; line-height: 1.8;
          color: var(--wm-text-soft); max-width: 560px; margin-left: auto; margin-right: auto;
        }
        .wf-contact__grid {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;
        }
        @media(max-width:860px){ .wf-contact__grid { grid-template-columns: 1fr; } }

        .wf-contact-card {
          position: relative; overflow: hidden;
          padding: 30px 28px; border-radius: 30px;
          border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%),
            rgba(19,13,9,0.9);
          box-shadow: var(--wm-shadow-lg);
          display: flex; flex-direction: column; gap: 0;
          text-decoration: none;
          transition: transform 0.26s ease, border-color 0.26s ease, box-shadow 0.26s ease;
        }
        .wf-contact-card:hover {
          transform: translateY(-4px);
          border-color: var(--wm-amber-border);
          box-shadow: 0 28px 68px rgba(0,0,0,0.4);
        }
        .wf-contact-card__glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at top right, rgba(235,113,38,0.14), transparent 42%);
          opacity: 0; transition: opacity 0.26s ease; pointer-events: none;
        }
        .wf-contact-card:hover .wf-contact-card__glow { opacity: 1; }

        .wf-contact-card__icon {
          width: 56px; height: 56px; border-radius: 18px; margin-bottom: 22px;
          display: inline-flex; align-items: center; justify-content: center;
          color: #ffd08d;
          background: rgba(235,113,38,0.12);
          border: 1px solid rgba(235,113,38,0.24);
          transition: background 0.3s, transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
        }
        .wf-contact-card__icon svg { width: 22px; height: 22px; }
        .wf-contact-card:hover .wf-contact-card__icon {
          background: var(--wm-amber); color: white;
          transform: scale(1.1) rotate(-8deg);
          box-shadow: var(--wm-shadow-amber);
        }
        .wf-contact-card__kicker {
          font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
          text-transform: uppercase; color: #ffcf80; margin-bottom: 10px;
        }
        .wf-contact-card__title {
          font-family: "Fraunces", Georgia, serif;
          font-size: 28px; font-weight: 600; line-height: 1.08; color: white;
          margin-bottom: 14px;
        }
        .wf-contact-card__copy {
          font-size: 14px; line-height: 1.75; color: var(--wm-text-soft); margin-bottom: 24px; flex: 1;
        }
        .wf-contact-card__rail {
          width: 38px; height: 2px; margin-bottom: 20px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
        }
        .wf-contact-card__action {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
          color: #ffcf80; transition: gap 0.22s;
        }
        .wf-contact-card:hover .wf-contact-card__action { gap: 12px; }
        .wf-contact-card__action svg { width: 13px; height: 13px; }

        /* ── CTA PANEL (matches index.tsx wm-cta) ── */
        .wf-cta { padding: 34px 0 110px; }
        .wf-cta__panel {
          position: relative; overflow: hidden;
          display: grid; gap: 24px; align-items: center;
          grid-template-columns: minmax(0,1fr) auto;
          padding: 54px; border-radius: 36px;
          border: 1px solid rgba(255,255,255,0.12);
          background-size: cover; background-position: center;
          box-shadow: var(--wm-shadow-xl);
        }
        @media(max-width:800px){ .wf-cta__panel { grid-template-columns: 1fr; padding: 36px 28px; border-radius: 28px; } }
        .wf-cta__panel::before {
          content: ""; position: absolute; inset: 0;
          background:
            linear-gradient(110deg, rgba(16,11,8,0.93) 0%, rgba(16,11,8,0.76) 48%, rgba(16,11,8,0.54) 100%),
            radial-gradient(circle at 18% 40%, rgba(235,113,38,0.22), transparent 40%);
        }
        .wf-cta__panel > * { position: relative; z-index: 1; }
        .wf-cta__eyebrow {
          font-size: 11px; font-weight: 800; letter-spacing: 0.18em;
          text-transform: uppercase; color: #ffcf80;
        }
        .wf-cta__title { margin: 14px 0 0; font-size: clamp(34px, 4vw, 58px); line-height: 1; }
        .wf-cta__copy {
          margin-top: 14px; max-width: 540px; font-size: 15px;
          line-height: 1.8; color: rgba(250,244,237,0.78);
        }
        .wf-cta__actions { display: flex; flex-wrap: wrap; gap: 14px; }
        @media(max-width:640px){ .wf-cta__actions { flex-direction: column; } }

        /* ── RESPONSIVE ── */
        @media(max-width:720px){
          .wf-contact { padding: 82px 0; }
          .wf-cta { padding-bottom: 82px; }
          .wf-main { padding-bottom: 60px; }
        }
        @media(hover: none){
          .wf-button:hover, .wf-contact-card:hover { transform: none; }
        }
        @media(prefers-reduced-motion: reduce){
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ── PROGRESS BAR ── */}
      <motion.div className="wf-progress" style={{ scaleX: progressSpring }} />

      {/* ── CURSOR (desktop only) ── */}
      {interactiveMotion && (
        <>
          <motion.div
            className="wf-page__glow"
            style={{ background: cursorAura }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.div
            className={`wf-cursor-outer${cursorHover ? " is-hover" : ""}`}
            style={{ x: cursorX, y: cursorY }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.16 }}
          />
          <motion.div
            className="wf-cursor-inner"
            style={{ x: cursorX, y: cursorY }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.12 }}
          />
        </>
      )}

      <div className="wf-page">

        {/* ════════════════ HERO ════════════════ */}
        <section className="wf-hero" ref={heroRef}>
          <motion.div
            className="wf-hero__bg"
            style={{ backgroundImage: `url(${bannerImg})`, y: bgY, scale: bgScale, opacity: bgOpacity }}
          />
          <div className="wf-hero__overlay" />
          <div className="wf-hero__noise" />
          <div className="wf-hero__beam" />
          <div className="wf-hero__orb" />

          <div className="wf-hero__inner">
            {/* LEFT copy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wf-hero__badge">
                <span className="wf-hero__badge-icon"><Sparkles /></span>
                <span className="wf-hero__badge-copy">
                  <strong>Help Center</strong> — Wise Mart
                </span>
              </div>

              <h1 className="wf-hero__title">
                {["Got Questions?", "We've Got Answers."].map((line, i) => (
                  <span key={line} className={`wf-hero__line${i === 1 ? " wf-hero__line--accent" : ""}`}>
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

              <motion.p
                className="wf-hero__sub"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.42 }}
              >
                Quick answers to ordering, hours, catering, menus, and everything else our Maryland guests ask most.
              </motion.p>

              <motion.div
                className="wf-hero__actions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.56 }}
              >
                <Link to="/contact" className="wf-button wf-button--primary">
                  Contact Us <ArrowRight />
                </Link>
                <Link to="/order" className="wf-button wf-button--ghost">
                  Order Now
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT stat cards — hidden on mobile */}
            <motion.div
              className="wf-hero__panel"
              initial={{ opacity: 0, x: 28, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.82, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {[
                { icon: BookOpen,   label: `${tagged.length} questions answered`,    copy: "Every common question about Wise Mart, answered in plain language." },
                { icon: Clock,      label: "Typically respond within 1 day",         copy: "Can't find what you need? Send a message and the team will get back to you fast." },
                { icon: Star,       label: "4.8 average rating across locations",     copy: "Three Maryland kitchens. Consistent food, friendly service, and fair prices." },
              ].map((item) => (
                <div key={item.label} className="wf-hero__stat-card">
                  <div className="wf-hero__stat-top">
                    <item.icon /> {item.label}
                  </div>
                  <div className="wf-hero__stat-copy">{item.copy}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="wf-scroll-cue">
            <div className="wf-scroll-cue__track" />
            <span>Scroll</span>
          </div>
        </section>

        {/* ════════════════ SEARCH + FILTERS ════════════════ */}
        <section className="wf-controls">
          <div className="wf-section">
            <motion.div
              className="wf-controls__inner"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="wf-search-wrap">
                <Search className="wf-search-icon" />
                <input
                  className="wf-search-input"
                  type="text"
                  placeholder="Search questions…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="wf-filters">
                {catsWithCount.map((cat) => (
                  <button
                    key={cat.id}
                    className={`wf-filter${activecat === cat.id ? " is-active" : ""}`}
                    onClick={() => setActivecat(cat.id)}
                  >
                    {cat.label}
                    <span className="wf-filter__count">{cat.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════ FAQ GRID ════════════════ */}
        <section className="wf-main">
          <div className="wf-section">
            <div className="wf-count-row">
              <div className="wf-count">
                Showing <span>{filtered.length}</span> of <span>{tagged.length}</span> questions
              </div>
              {query && (
                <button
                  className="wf-link"
                  onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  Clear search
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <motion.div
                className="wf-empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="wf-empty__icon"><HelpCircle /></div>
                <div className="wf-empty__title">No questions found</div>
                <p className="wf-empty__copy">Try a different search term or category — or reach out on the Contact page.</p>
              </motion.div>
            ) : (
              <div className="wf-cols">
                <div>
                  <AnimatePresence>
                    {left.map((item, i) => (
                      <FAQItem key={item.q} item={item} index={i * 2} />
                    ))}
                  </AnimatePresence>
                </div>
                <div>
                  <AnimatePresence>
                    {right.map((item, i) => (
                      <FAQItem key={item.q} item={item} index={i * 2 + 1} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ════════════════ CONTACT SECTION ════════════════ */}
        <section className="wf-contact">
          <div className="wf-section">
            <div className="wf-contact__intro">
              <span className="wf-eyebrow">
                <span className="wf-eyebrow__line" />
                Still Need Help?
                <span className="wf-eyebrow__line" />
              </span>
              <h2 className={`wf-display wf-contact__title`}>
                We're always <em>here for you.</em>
              </h2>
              <p className="wf-contact__sub">
                Can't find what you need? Reach us any of these ways — we typically respond within one business day.
              </p>
            </div>

            <div className="wf-contact__grid">
              {[
                {
                  icon: MessageSquare,
                  kicker:  "Contact Form",
                  title:   "Send a Message",
                  copy:    "Use our contact form for general inquiries, catering requests, or feedback. We'll get back to you fast.",
                  cta:     "Go to Contact",
                  href:    "/contact",
                  isLink:  true,
                },
                {
                  icon: Phone,
                  kicker:  "Call Direct",
                  title:   "Give Us a Call",
                  copy:    "For urgent orders or same-day catering, call your nearest location directly. Our team picks up fast.",
                  cta:     "(410) 883-3648",
                  href:    "tel:+14108833648",
                  isLink:  false,
                },
                {
                  icon: Mail,
                  kicker:  "Email",
                  title:   "Email Us",
                  copy:    "Drop us a line at info@wisemart2.com for anything that doesn't need an immediate reply.",
                  cta:     "info@wisemart2.com",
                  href:    "mailto:info@wisemart2.com",
                  isLink:  false,
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.56, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {card.isLink ? (
                    <Link to={card.href as any} className="wf-contact-card" data-cursor="interactive">
                      <div className="wf-contact-card__glow" />
                      <div className="wf-contact-card__icon"><card.icon /></div>
                      <div className="wf-contact-card__kicker">{card.kicker}</div>
                      <div className="wf-contact-card__title">{card.title}</div>
                      <div className="wf-contact-card__copy">{card.copy}</div>
                      <div className="wf-contact-card__rail" />
                      <div className="wf-contact-card__action">
                        {card.cta} <ArrowRight />
                      </div>
                    </Link>
                  ) : (
                    <a href={card.href} className="wf-contact-card" data-cursor="interactive">
                      <div className="wf-contact-card__glow" />
                      <div className="wf-contact-card__icon"><card.icon /></div>
                      <div className="wf-contact-card__kicker">{card.kicker}</div>
                      <div className="wf-contact-card__title">{card.title}</div>
                      <div className="wf-contact-card__copy">{card.copy}</div>
                      <div className="wf-contact-card__rail" />
                      <div className="wf-contact-card__action">
                        {card.cta} <ChevronRight />
                      </div>
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ CTA ════════════════ */}
        <section className="wf-cta">
          <div className="wf-section">
            <motion.div
              className="wf-cta__panel"
              style={{ backgroundImage: `url(${bannerImg})` }}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <div className="wf-cta__eyebrow">Ready When You Are</div>
                <h2 className="wf-display wf-cta__title">
                  Pick a location, place the order, and show up hungry.
                </h2>
                <p className="wf-cta__copy">
                  Choose your nearest Wise Mart, build the order, and we'll have the comfort food part covered.
                </p>
              </div>
              <div className="wf-cta__actions">
                <Link to="/order"     className="wf-button wf-button--primary">
                  Order Now <ArrowRight />
                </Link>
                <Link to="/locations" className="wf-button wf-button--dark">
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