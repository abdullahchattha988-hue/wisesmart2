import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useInView,
  useMotionTemplate,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  ArrowRight, Pizza, Drumstick, Sandwich, Salad,
  Star, Phone, Clock, Sparkles, MapPin, ChevronDown, Plus,
  Award, Users, Leaf, Zap, Quote, ChevronRight,
} from "lucide-react";
import { LOCATIONS, SITE } from "@/data/site";
import heroPizza   from "@/assets/hero-pizza.jpg";
import heroChicken from "@/assets/hero-chicken.jpg";
import heroSub     from "@/assets/hero-sub.jpg";
import heroSalad   from "@/assets/hero-salad.jpg";
import heroSlide   from "@/assets/hero-slide.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wise Mart — Come Hungry. Leave Happy. | Maryland Restaurants Since 2010" },
      { name: "description", content: "Fresh pizza, famous fried chicken, hearty subs, and crisp salads. Three Maryland locations: Sharptown, East New Market, and Vienna." },
      { property: "og:title",       content: "Wise Mart — Come Hungry. Leave Happy." },
      { property: "og:description", content: "Three Maryland locations. Fresh food, fast service, since 2010." },
    ],
  }),
  component: HomePage,
});

/* ─────────────────────────────── data ─────────────────────────────── */

const VALUES = [
  { icon: Leaf,    title: "Farm Fresh Daily",    desc: "Every ingredient sourced with intention — dough, sauces, and produce prepared in-house each morning." },
  { icon: Zap,     title: "Lightning Service",   desc: "Speed and quality in perfect harmony. In and out in minutes without compromising taste." },
  { icon: Award,   title: "Unmatched Value",     desc: "Generous portions, honest prices. Because great food should never feel like a luxury." },
  { icon: Users,   title: "Community First",     desc: "Three locations. Three towns. One Maryland family built on great food and genuine hospitality." },
];

const FEATURED = [
  { icon: Pizza,     name: "Hand-Stretched Pizza",  price: "from $12.99", img: heroPizza,   tag: "Signature"  },
  { icon: Drumstick, name: "Famous Fried Chicken",  price: "from $6.99",  img: heroChicken, tag: "Best Seller" },
  { icon: Sandwich,  name: "Hot Subs & Steaks",     price: "from $11.99", img: heroSub,     tag: "Fan Favorite"},
  { icon: Salad,     name: "Fresh Salads",           price: "from $9.99",  img: heroSalad,   tag: "Daily Fresh" },
];

const FAQS = [
  { q: "Do you offer online ordering?",                   a: "Yes! You can place orders through our Order page for any of our three locations. We support pickup and, at select locations, delivery through third-party services." },
  { q: "What are your hours?",                            a: "Hours vary slightly by location. Generally we're open 10 AM – 10 PM Sunday through Thursday, and 10 AM – 11 PM Friday & Saturday. Check your nearest location page for exact times." },
  { q: "Do you cater events?",                            a: "Absolutely — catering is one of our specialties. We've covered everything from birthday parties to corporate lunches. Contact your nearest location to get a custom quote." },
  { q: "Are there vegetarian or vegan options?",          a: "Yes! Our fresh salad bar, veggie subs, and cheese-only pizza options are crowd favorites. We're expanding our plant-based offerings regularly — ask your server for today's specials." },
  { q: "Can I customize my order?",                       a: "Absolutely. From pizza toppings to sub dressings and salad add-ons, we love building your perfect meal. Just ask at the counter or leave a note when ordering online." },
  { q: "Do you have a loyalty or rewards program?",       a: "We're working on a formal loyalty program launching soon! In the meantime, follow us on social media for weekly deals and seasonal promotions." },
  { q: "Are your ingredients locally sourced?",           a: "We prioritize local Maryland farms and suppliers as much as possible. Our produce is delivered fresh several times a week, and our dairy comes from regional creameries." },
  { q: "Is there parking at all locations?",              a: "Yes, all three locations — Sharptown, East New Market, and Vienna — have free on-site parking with ample space." },
  { q: "Do you accommodate allergies?",                   a: "We take allergies seriously. Please inform our staff about any dietary restrictions when ordering. While we do our best to prevent cross-contamination, we are not a fully allergen-free kitchen." },
  { q: "How do I apply for a job at Wise Mart?",          a: "We're always looking for passionate people to join our team. Visit the Careers page or stop by any location and ask to speak with a manager. We'd love to meet you!" },
];

/* ─────────────────────────────── hooks ─────────────────────────────── */

function useTilt(strength = 8) {
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]),  { stiffness: 400, damping: 35 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 400, damping: 35 });
  const scale   = useSpring(1, { stiffness: 350, damping: 28 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
    scale.set(1.02);
  }
  function onLeave() { x.set(0); y.set(0); scale.set(1); }
  return { rotateX, rotateY, scale, onMove, onLeave };
}

/* ─────────────────────────────── components ─────────────────────────── */

function TiltCard({ children, className, strength }: { children: React.ReactNode; className?: string; strength?: number }) {
  const { rotateX, rotateY, scale, onMove, onLeave } = useTilt(strength ?? 8);
  return (
    <motion.div
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", perspective: 1200 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="wm-faq-item"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className={wm-faq-btn${open ? " wm-faq-btn--open" : ""}} onClick={() => setOpen(!open)}>
        <span className="wm-faq-q">{q}</span>
        <motion.span
          className="wm-faq-icon"
          animate={{ rotate: open ? 45 : 0, background: open ? "var(--amber)" : "var(--amber-pale)" }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
        >
          <Plus style={{ width: 13, height: 13 }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="wm-faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="wm-faq-a-inner">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 35);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────────────────────── page ─────────────────────────────── */

function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const [cursorPos, setCursorPos]       = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorHover, setCursorHover]   = useState(false);

  useEffect(() => {
    const onMove  = (e: MouseEvent) => { setCursorPos({ x: e.clientX, y: e.clientY }); setCursorVisible(true); };
    const onLeave = () => setCursorVisible(false);
    window.addEventListener("mousemove", onMove);
    document.body.addEventListener("mouseleave", onLeave);

    const hoverEls = () => document.querySelectorAll("a, button, [data-cursor]");
    const enterHover = () => setCursorHover(true);
    const leaveHover = () => setCursorHover(false);

    const attach = () => {
      hoverEls().forEach(el => {
        el.addEventListener("mouseenter", enterHover);
        el.addEventListener("mouseleave", leaveHover);
      });
    };
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <style>{
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --amber:        #c8590a;
          --amber-mid:    #d96b18;
          --amber-light:  #f0872e;
          --amber-pale:   rgba(200,89,10,0.10);
          --amber-glow:   rgba(200,89,10,0.22);
          --amber-border: rgba(200,89,10,0.28);
          --gold:         #e8a030;
          --gold-pale:    rgba(232,160,48,0.12);

          --white:        #ffffff;
          --cream:        #faf6f1;
          --off-white:    #f0ebe4;

          --ink:          #070605;
          --ink-1:        #0c0a09;
          --ink-2:        #111009;
          --ink-3:        #181510;
          --ink-4:        #1e1a14;
          --ink-5:        #252018;

          --text-primary: rgba(240,235,228,0.95);
          --text-secondary: rgba(240,235,228,0.52);
          --text-muted:   rgba(240,235,228,0.28);
          --text-faint:   rgba(240,235,228,0.14);

          --border:       rgba(240,235,228,0.07);
          --border-mid:   rgba(240,235,228,0.12);
          --border-warm:  rgba(240,235,228,0.18);

          --r-xs: 6px;
          --r-sm: 10px;
          --r-md: 16px;
          --r-lg: 22px;
          --r-xl: 30px;
          --r-2xl: 40px;

          --shadow-sm:  0 2px 12px rgba(0,0,0,0.35);
          --shadow-md:  0 8px 32px rgba(0,0,0,0.45);
          --shadow-lg:  0 20px 60px rgba(0,0,0,0.55);
          --shadow-xl:  0 40px 100px rgba(0,0,0,0.65);
          --shadow-amber: 0 16px 48px rgba(200,89,10,0.35);
          --shadow-amber-lg: 0 24px 64px rgba(200,89,10,0.42);
        }

        html { scroll-behavior: smooth; }

        .wm-page {
          font-family: 'DM Sans', sans-serif;
          background: var(--ink);
          color: var(--text-primary);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .wm-page::-webkit-scrollbar { width: 3px; }
        .wm-page::-webkit-scrollbar-track { background: var(--ink); }
        .wm-page::-webkit-scrollbar-thumb { background: var(--amber); border-radius: 2px; }

        /* ── custom cursor ── */
        .wm-cursor-outer {
          position: fixed; top: 0; left: 0;
          width: 36px; height: 36px;
          border: 1px solid var(--amber);
          border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transition: width 0.3s, height 0.3s, border-color 0.3s, background 0.3s, opacity 0.25s;
          transform-origin: center;
          mix-blend-mode: normal;
        }
        .wm-cursor-outer.is-hover {
          width: 56px; height: 56px;
          background: var(--amber-pale);
          border-color: var(--amber-mid);
        }
        .wm-cursor-inner {
          position: fixed; top: 0; left: 0;
          width: 5px; height: 5px;
          background: var(--amber);
          border-radius: 50%;
          pointer-events: none; z-index: 10000;
          transition: opacity 0.25s;
        }

        /* ── layout ── */
        .wm-section { max-width: 1360px; margin: 0 auto; padding: 0 32px; }
        @media(min-width:768px)  { .wm-section { padding: 0 52px; } }
        @media(min-width:1280px) { .wm-section { padding: 0 72px; } }

        /* ── eyebrow ── */
        .wm-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 9px; font-weight: 600; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--amber);
          font-family: 'DM Sans', sans-serif;
        }
        .wm-eyebrow-line {
          display: block; width: 28px; height: 1px;
          background: linear-gradient(90deg, var(--amber), transparent);
          flex-shrink: 0;
        }

        /* ── display type ── */
        .wm-display {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }
        .wm-display em { font-style: italic; color: var(--amber-light); }
        .wm-section-title { font-size: clamp(40px, 4.4vw, 64px); margin-top: 16px; }
        .wm-section-sub {
          font-size: 14px; color: var(--text-secondary); margin-top: 14px;
          line-height: 1.75; max-width: 460px; font-weight: 300;
        }

        /* ── divider ── */
        .wm-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--border-mid) 30%, var(--border-mid) 70%, transparent 100%);
        }

        /* ════════════════════════════════════════
           HERO
        ════════════════════════════════════════ */
        .wm-hero {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          background: var(--ink);
          display: flex; flex-direction: column; justify-content: flex-end;
        }

        .wm-hero__bg {
          position: absolute; inset: -6%;
          background-size: cover; background-position: center;
          will-change: transform;
        }

        /* layered gradient overlay — warm cinematic feel */
        .wm-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(105deg,
              rgba(7,6,5,0.97) 0%,
              rgba(7,6,5,0.88) 38%,
              rgba(7,6,5,0.55) 66%,
              rgba(7,6,5,0.22) 100%
            ),
            linear-gradient(to top,
              rgba(7,6,5,1.0) 0%,
              rgba(7,6,5,0.0) 45%
            );
        }

        /* subtle amber vignette at bottom-left */
        .wm-hero__amber-wash {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 10% 85%, rgba(200,89,10,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        /* grain overlay */
        .wm-hero__grain {
          position: absolute; inset: 0;
          opacity: 0.032; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        /* floating orb lights */
        .wm-hero__orb {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 1;
          filter: blur(80px);
        }
        .wm-hero__orb--1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(200,89,10,0.14) 0%, transparent 70%);
          bottom: -100px; left: -80px;
        }
        .wm-hero__orb--2 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(232,160,48,0.07) 0%, transparent 70%);
          top: 20%; right: 5%;
        }

        /* animated scan line */
        .wm-hero__scanline {
          position: absolute; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--amber-glow) 30%, var(--amber) 50%, var(--amber-glow) 70%, transparent 100%);
          opacity: 0;
          pointer-events: none; z-index: 2;
          animation: scanlineAnim 7s ease-in-out infinite 1.5s;
        }
        @keyframes scanlineAnim {
          0%   { top: 0%;   opacity: 0; }
          5%   { opacity: 0.7; }
          95%  { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }

        /* floating particles */
        .wm-particles {
          position: absolute; inset: 0; overflow: hidden;
          pointer-events: none; z-index: 2;
        }
        .wm-particle {
          position: absolute; border-radius: 50%;
        }

        .wm-hero__inner {
          position: relative; z-index: 3;
          max-width: 1360px; margin: 0 auto;
          padding: 140px 32px 96px;
          display: grid; grid-template-columns: 1fr;
          gap: 60px; align-items: end;
        }
        @media(min-width:768px)  { .wm-hero__inner { padding: 150px 52px 108px; } }
        @media(min-width:1024px) {
          .wm-hero__inner {
            grid-template-columns: 54fr 46fr;
            padding: 168px 72px 120px;
            align-items: end;
          }
        }

        /* pedigree badge */
        .wm-hero__badge {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 9px 18px 9px 9px;
          background: rgba(240,235,228,0.05);
          border: 1px solid var(--border-mid);
          border-radius: 100px;
          backdrop-filter: blur(8px);
          margin-bottom: 32px;
        }
        .wm-hero__badge-dot {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--amber);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 4px var(--amber-pale);
          animation: badgePulse 3s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 4px var(--amber-pale); }
          50%     { box-shadow: 0 0 0 8px rgba(200,89,10,0.08); }
        }
        .wm-hero__badge-dot svg { width: 13px; height: 13px; color: #fff; }
        .wm-hero__badge-text {
          font-size: 10px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--text-secondary);
        }
        .wm-hero__badge-text strong { color: var(--text-primary); font-weight: 600; }

        .wm-hero__title {
          font-size: clamp(58px, 7.8vw, 112px);
          margin-top: 0;
          position: relative;
        }
        .wm-hero__title-line { display: block; overflow: hidden; }
        .wm-hero__title-inner { display: block; }

        /* liquid shimmer — amber spectrum */
        .wm-shimmer {
          background: linear-gradient(92deg,
            #c8590a 0%, #e8812a 20%, #f5b040 38%,
            #fbc95a 50%, #e8812a 65%, #d06820 82%, #c8590a 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: liquidShimmer 5.5s linear infinite;
        }
        @keyframes liquidShimmer {
          0%   { background-position: -150% center; }
          100% { background-position:  150% center; }
        }

        .wm-hero__sub {
          font-size: 15px; color: var(--text-secondary); line-height: 1.85;
          margin-top: 26px; max-width: 420px; font-weight: 300;
        }

        .wm-hero__ctas {
          display: flex; flex-wrap: wrap; gap: 12px; margin-top: 44px;
          align-items: center;
        }

        /* trust signals */
        .wm-hero__trust {
          display: flex; align-items: center; gap: 16px;
          margin-top: 40px; padding-top: 36px;
          border-top: 1px solid var(--border);
        }
        .wm-hero__trust-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 11px; color: var(--text-muted); font-weight: 400;
          letter-spacing: 0.04em;
        }
        .wm-hero__trust-item svg { width: 12px; height: 12px; color: var(--amber); flex-shrink: 0; }
        .wm-hero__trust-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border-warm); flex-shrink: 0; }

        /* ── hero right card stack ── */
        .wm-hero__right { display: none; }
        @media(min-width:1024px){ .wm-hero__right { display: block; position: relative; height: 560px; } }

        .wm-food-card {
          position: absolute;
          border-radius: var(--r-lg);
          overflow: hidden;
          border: 1px solid var(--border-mid);
          background: rgba(14,11,9,0.82);
          backdrop-filter: blur(20px) saturate(1.2);
          transition: border-color 0.4s, box-shadow 0.4s;
          cursor: default;
          box-shadow: var(--shadow-md);
        }
        .wm-food-card:hover {
          border-color: var(--amber-border);
          box-shadow: var(--shadow-lg), 0 0 0 1px rgba(200,89,10,0.10);
        }
        .wm-food-card__img { position: relative; overflow: hidden; }
        .wm-food-card__img img {
          width: 100%; height: 170px; object-fit: cover; display: block;
          transition: transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .wm-food-card:hover .wm-food-card__img img { transform: scale(1.08); }
        .wm-food-card__img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(7,6,5,0.55) 0%, transparent 55%);
        }
        .wm-food-card__body { padding: 14px 16px 16px; }
        .wm-food-card__tag {
          font-size: 8.5px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--amber); margin-bottom: 4px;
        }
        .wm-food-card__name { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.3; }
        .wm-food-card__price { font-size: 11.5px; color: var(--text-muted); margin-top: 3px; font-weight: 300; }

        /* stacked card positions — refined angles */
        .wm-food-card--0 { width: 198px; top:  0px;  left:  10px;  z-index: 4; transform: rotate(-2.8deg); }
        .wm-food-card--1 { width: 208px; top:  30px;  left: 195px;  z-index: 5; transform: rotate(1.8deg);  }
        .wm-food-card--2 { width: 194px; top: 268px; left:  18px;  z-index: 3; transform: rotate(2.2deg);  }
        .wm-food-card--3 { width: 206px; top: 252px; left: 205px;  z-index: 6; transform: rotate(-1.2deg); }

        /* connector lines between cards */
        .wm-hero__card-line {
          position: absolute; pointer-events: none; z-index: 2;
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 1px; height: 130px;
          background: linear-gradient(to bottom, transparent, var(--border-mid), transparent);
        }

        /* scroll cue */
        .wm-scroll-cue {
          position: absolute; bottom: 36px; left: 50%;
          transform: translateX(-50%);
          z-index: 5; display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          font-size: 8.5px; letter-spacing: 0.26em;
          text-transform: uppercase; color: var(--text-faint);
        }
        .wm-scroll-cue__track {
          width: 1px; height: 52px;
          background: var(--border); position: relative; overflow: hidden;
        }
        .wm-scroll-cue__track::after {
          content: ''; position: absolute; top: -100%; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(to bottom, transparent, var(--amber), transparent);
          animation: scrollDrop 2.2s ease-in-out infinite;
        }
        @keyframes scrollDrop {
          0%   { top: -100%; opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }

        /* ════════════════════════════════════════
           MARQUEE TICKER
        ════════════════════════════════════════ */
        .wm-ticker {
          background: var(--amber);
          overflow: hidden;
          padding: 14px 0;
          position: relative;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .wm-ticker::before, .wm-ticker::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 80px;
          z-index: 2; pointer-events: none;
        }
        .wm-ticker::before { left: 0;  background: linear-gradient(to right,  var(--amber), transparent); }
        .wm-ticker::after  { right: 0; background: linear-gradient(to left, var(--amber), transparent); }
        .wm-ticker__track {
          display: flex; gap: 0;
          animation: tickerScroll 28s linear infinite;
          width: max-content;
        }
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .wm-ticker__item {
          display: flex; align-items: center; gap: 18px;
          padding: 0 32px;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.92); white-space: nowrap;
          flex-shrink: 0;
        }
        .wm-ticker__item span {
          display: inline-block; width: 4px; height: 4px;
          border-radius: 50%; background: rgba(255,255,255,0.5); flex-shrink: 0;
        }

        /* ════════════════════════════════════════
           STATS BAR
        ════════════════════════════════════════ */
        .wm-stats-bar {
          background: var(--ink-1);
          border-bottom: 1px solid var(--border);
        }
        .wm-stats-bar__inner {
          max-width: 1360px; margin: 0 auto;
          padding: 0 72px;
          display: grid; grid-template-columns: repeat(4,1fr);
        }
        @media(max-width:767px){
          .wm-stats-bar__inner { grid-template-columns: repeat(2,1fr); padding: 0 32px; }
        }

        .wm-stat-item {
          padding: 36px 28px; text-align: center;
          border-right: 1px solid var(--border);
          position: relative; overflow: hidden;
          transition: background 0.3s;
        }
        .wm-stat-item::before {
          content: '';
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 0; height: 2px;
          background: var(--amber);
          transition: width 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .wm-stat-item:hover::before { width: 60%; }
        .wm-stat-item:last-child  { border-right: none; }
        .wm-stat-item:hover { background: var(--ink-2); }
        @media(max-width:767px){ .wm-stat-item:nth-child(2) { border-right: none; } }

        .wm-stat-item__num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px; font-weight: 700;
          color: var(--text-primary); line-height: 1;
          letter-spacing: -0.02em;
        }
        .wm-stat-item__label {
          font-size: 9.5px; font-weight: 500; color: var(--text-muted);
          margin-top: 7px; letter-spacing: 0.18em; text-transform: uppercase;
        }
        .wm-stat-item__accent {
          display: block; width: 18px; height: 1.5px;
          background: var(--amber); margin: 10px auto 0; opacity: 0.7;
        }
        @media(max-width:767px){ .wm-stat-item__num { font-size: 38px; } }

        /* ════════════════════════════════════════
           VALUES
        ════════════════════════════════════════ */
        .wm-values { padding: 120px 0; position: relative; overflow: hidden; }

        /* background geometric accent */
        .wm-values__bg {
          position: absolute; top: -120px; right: -80px;
          width: 480px; height: 480px; border-radius: 50%;
          background: radial-gradient(circle, rgba(200,89,10,0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        .wm-values__header { text-align: center; position: relative; }
        .wm-values__grid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 1px;
          margin-top: 64px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: var(--r-2xl);
          overflow: hidden;
        }
        @media(min-width:1024px){ .wm-values__grid { grid-template-columns: repeat(4,1fr); } }

        .wm-value {
          padding: 48px 36px; background: var(--ink-1);
          position: relative; overflow: hidden;
          transition: background 0.4s;
        }
        .wm-value::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 0% 0%, rgba(200,89,10,0.10) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.5s;
        }
        .wm-value::after {
          content: '';
          position: absolute; left: 0; bottom: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--amber) 0%, transparent 100%);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .wm-value:hover { background: var(--ink-2); }
        .wm-value:hover::before { opacity: 1; }
        .wm-value:hover::after  { transform: scaleX(1); }

        .wm-value__index {
          font-family: 'Cormorant Garamond', serif;
          font-size: 72px; font-weight: 300; font-style: italic;
          color: rgba(200,89,10,0.07);
          line-height: 1;
          position: absolute; top: 16px; right: 20px;
          transition: color 0.4s;
          letter-spacing: -0.03em;
        }
        .wm-value:hover .wm-value__index { color: rgba(200,89,10,0.13); }

        .wm-value__icon-wrap {
          width: 56px; height: 56px; border-radius: 15px;
          background: var(--amber-pale);
          border: 1px solid var(--amber-border);
          color: var(--amber);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.35s, transform 0.5s cubic-bezier(.34,1.56,.64,1), box-shadow 0.35s, border-color 0.35s;
        }
        .wm-value:hover .wm-value__icon-wrap {
          background: var(--amber); color: #fff;
          transform: scale(1.1) rotate(-9deg);
          box-shadow: var(--shadow-amber);
          border-color: transparent;
        }
        .wm-value__icon-wrap svg { width: 22px; height: 22px; }

        .wm-value__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 700;
          color: var(--text-primary); margin-top: 24px; line-height: 1.15;
        }
        .wm-value__desc {
          font-size: 13px; color: var(--text-muted); margin-top: 10px;
          line-height: 1.78; font-weight: 300;
        }

        @media(max-width:479px){
          .wm-values { padding: 80px 0; }
          .wm-values__grid { grid-template-columns: 1fr; }
          .wm-value { padding: 36px 26px; }
        }

        /* ════════════════════════════════════════
           LOCATIONS
        ════════════════════════════════════════ */
        .wm-locations { padding: 120px 0; background: var(--ink-1); position: relative; }
        .wm-locations__grid {
          display: grid; grid-template-columns: 1fr;
          gap: 20px; margin-top: 64px;
        }
        @media(min-width:768px){ .wm-locations__grid { grid-template-columns: repeat(3,1fr); } }

        .wm-loc-card {
          position: relative; border-radius: var(--r-xl); overflow: hidden;
          border: 1px solid var(--border); background: var(--ink-2);
          padding: 40px 34px; text-decoration: none;
          display: flex; flex-direction: column; min-height: 340px;
          transition: border-color 0.4s, box-shadow 0.45s, transform 0.4s;
        }
        .wm-loc-card:hover {
          border-color: var(--amber-border);
          box-shadow: var(--shadow-lg), 0 0 0 1px rgba(200,89,10,0.08);
          transform: translateY(-5px);
        }

        /* glow gradient on hover */
        .wm-loc-card__glow {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(200,89,10,0.08) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.45s; pointer-events: none;
        }
        .wm-loc-card:hover .wm-loc-card__glow { opacity: 1; }

        /* decorative corner */
        .wm-loc-card__corner {
          position: absolute; top: 0; right: 0;
          width: 80px; height: 80px; pointer-events: none;
          overflow: hidden;
        }
        .wm-loc-card__corner::before {
          content: '';
          position: absolute; top: -1px; right: -1px;
          width: 80px; height: 80px;
          background: linear-gradient(225deg, rgba(200,89,10,0.12) 0%, transparent 60%);
          border-bottom-left-radius: 80px;
          opacity: 0; transition: opacity 0.45s;
        }
        .wm-loc-card:hover .wm-loc-card__corner::before { opacity: 1; }

        .wm-loc-card__num {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.24em; color: var(--text-faint);
          text-transform: uppercase; position: relative;
        }
        .wm-loc-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px; font-weight: 700;
          color: var(--text-primary); margin-top: 16px;
          line-height: 1.0; position: relative;
        }
        .wm-loc-card__tagline {
          font-size: 13px; color: var(--text-muted); margin-top: 12px;
          line-height: 1.7; font-weight: 300; position: relative;
        }
        .wm-loc-card__sep {
          width: 28px; height: 1.5px;
          background: linear-gradient(90deg, var(--amber), transparent);
          margin: 20px 0; position: relative;
          transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .wm-loc-card:hover .wm-loc-card__sep { width: 48px; }
        .wm-loc-card__specialty {
          font-size: 9px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--amber);
          margin-top: auto; position: relative;
        }
        .wm-loc-card__footer {
          display: flex; align-items: center;
          justify-content: space-between; margin-top: 20px;
          padding-top: 18px; border-top: 1px solid var(--border);
          position: relative;
        }
        .wm-loc-card__cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 600; color: var(--amber);
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: gap 0.3s;
        }
        .wm-loc-card:hover .wm-loc-card__cta { gap: 14px; }
        .wm-loc-card__cta svg { width: 12px; height: 12px; }
        .wm-loc-card__phone {
          font-size: 10.5px; color: var(--text-faint);
          text-decoration: none;
          display: flex; align-items: center; gap: 5px;
          transition: color 0.25s;
        }
        .wm-loc-card__phone:hover { color: var(--text-secondary); }
        .wm-loc-card__phone svg  { width: 10px; height: 10px; }

        @media(max-width:479px){
          .wm-locations { padding: 80px 0; }
          .wm-loc-card  { padding: 28px 24px; min-height: 300px; }
          .wm-loc-card__name { font-size: 30px; }
        }

        /* ════════════════════════════════════════
           FEATURED
        ════════════════════════════════════════ */
        .wm-featured { padding: 120px 0; position: relative; }

        .wm-featured__header {
          display: flex; align-items: flex-end;
          justify-content: space-between; gap: 24px;
        }

        .wm-featured__grid {
          display: grid; grid-template-columns: repeat(2,1fr);
          gap: 20px; margin-top: 56px;
        }
        @media(min-width:1024px){ .wm-featured__grid { grid-template-columns: repeat(4,1fr); } }

        .wm-feat-card {
          border-radius: var(--r-lg); overflow: hidden;
          border: 1px solid var(--border); background: var(--ink-1);
          transition: border-color 0.35s, box-shadow 0.4s, transform 0.35s;
        }
        .wm-feat-card:hover {
          border-color: var(--amber-border);
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        .wm-feat-card__img { position: relative; aspect-ratio: 3/2; overflow: hidden; }
        .wm-feat-card__img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .wm-feat-card:hover .wm-feat-card__img img { transform: scale(1.1); }

        .wm-feat-card__badge {
          position: absolute; top: 12px; right: 12px;
          width: 42px; height: 42px; border-radius: 11px;
          background: rgba(200,89,10,0.88); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; color: #fff;
          border: 1px solid rgba(255,255,255,0.12);
          transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
        }
        .wm-feat-card:hover .wm-feat-card__badge {
          transform: scale(1.12) rotate(-10deg);
          box-shadow: var(--shadow-amber);
        }
        .wm-feat-card__badge svg { width: 17px; height: 17px; }

        .wm-feat-card__img-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(7,6,5,0.7) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.35s;
        }
        .wm-feat-card:hover .wm-feat-card__img-scrim { opacity: 1; }

        .wm-feat-card__body { padding: 20px 22px 22px; }
        .wm-feat-card__tag  {
          font-size: 8.5px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--amber); margin-bottom: 7px;
        }
        .wm-feat-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 700;
          color: var(--text-primary); line-height: 1.2;
        }
        .wm-feat-card__price {
          font-size: 12px; color: var(--text-muted); margin-top: 5px; font-weight: 300;
        }
        .wm-feat-card__action {
          display: flex; align-items: center; gap: 6px;
          font-size: 10.5px; font-weight: 600; color: var(--amber);
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-top: 14px; padding-top: 14px;
          border-top: 1px solid var(--border);
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .wm-feat-card__action svg { width: 11px; height: 11px; }
        .wm-feat-card:hover .wm-feat-card__action { opacity: 1; transform: translateY(0); }

        @media(max-width:479px){
          .wm-featured { padding: 80px 0; }
          .wm-featured__grid { grid-template-columns: 1fr; gap: 16px; }
          .wm-featured__header { flex-direction: column; align-items: flex-start; }
        }

        /* ════════════════════════════════════════
           STORY
        ════════════════════════════════════════ */
        .wm-story { padding: 120px 0; background: var(--ink-1); position: relative; overflow: hidden; }

        /* decorative grid lines */
        .wm-story__grid-deco {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.025;
          background-image:
            linear-gradient(var(--off-white) 1px, transparent 1px),
            linear-gradient(90deg, var(--off-white) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .wm-story__inner {
          display: grid; grid-template-columns: 1fr; gap: 72px; align-items: center;
          position: relative;
        }
        @media(min-width:1024px){ .wm-story__inner { grid-template-columns: 1fr 1fr; } }

        .wm-story__text {
          font-size: 15px; color: var(--text-secondary); line-height: 1.9;
          margin-top: 20px; font-weight: 300;
        }
        .wm-story__lead {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px; font-weight: 400; font-style: italic;
          color: var(--text-secondary); line-height: 1.65;
          margin-top: 16px;
          padding-left: 18px;
          border-left: 2px solid var(--amber);
        }
        .wm-story__link {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 700; color: var(--amber);
          text-decoration: none; margin-top: 36px;
          letter-spacing: 0.12em; text-transform: uppercase;
          transition: gap 0.3s;
        }
        .wm-story__link:hover { gap: 20px; }
        .wm-story__link svg { width: 13px; height: 13px; }

        /* image frame */
        .wm-story__frame {
          position: relative;
        }
        .wm-story__frame-deco {
          position: absolute;
          top: -20px; right: -20px;
          width: 100%; height: 100%;
          border: 1px solid var(--border-mid);
          border-radius: var(--r-xl);
          pointer-events: none; z-index: 0;
        }
        .wm-story__img-wrap {
          position: relative; border-radius: var(--r-xl); overflow: hidden;
          aspect-ratio: 5/4; border: 1px solid var(--border-mid);
          z-index: 1;
          transition: box-shadow 0.5s;
        }
        .wm-story__img-wrap:hover { box-shadow: var(--shadow-xl); }
        .wm-story__img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 1s cubic-bezier(0.16,1,0.3,1);
        }
        .wm-story__img-wrap:hover img { transform: scale(1.04); }
        .wm-story__img-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 40px 28px 26px;
          background: linear-gradient(to top, rgba(7,6,5,0.95) 0%, rgba(7,6,5,0.5) 60%, transparent 100%);
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 400; font-style: italic;
          color: var(--text-secondary); line-height: 1.5;
        }

        /* floating year badge */
        .wm-story__year-badge {
          position: absolute; bottom: -18px; right: 28px; z-index: 2;
          padding: 12px 22px;
          background: var(--amber); color: #fff;
          border-radius: var(--r-sm);
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 700; line-height: 1;
          box-shadow: var(--shadow-amber);
        }
        .wm-story__year-badge small {
          display: block; font-family: 'DM Sans', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; opacity: 0.85; margin-bottom: 2px;
        }

        @media(max-width:479px){
          .wm-story { padding: 80px 0; }
          .wm-story__inner { gap: 48px; }
          .wm-story__frame-deco { display: none; }
        }

        /* ════════════════════════════════════════
           TESTIMONIALS
        ════════════════════════════════════════ */
        .wm-testimonials { padding: 120px 0; }
        .wm-testimonials__grid {
          display: grid; grid-template-columns: 1fr;
          gap: 20px; margin-top: 64px;
        }
        @media(min-width:768px){ .wm-testimonials__grid { grid-template-columns: repeat(3,1fr); } }

        .wm-review {
          padding: 36px 30px; border-radius: var(--r-lg);
          background: var(--ink-1); border: 1px solid var(--border);
          position: relative; overflow: hidden;
          transition: border-color 0.35s, box-shadow 0.4s, transform 0.35s;
          display: flex; flex-direction: column;
        }
        .wm-review:hover {
          border-color: var(--amber-border);
          box-shadow: var(--shadow-md), 0 0 0 1px rgba(200,89,10,0.07);
          transform: translateY(-4px);
        }

        /* large quote mark */
        .wm-review__bg-quote {
          position: absolute; top: -8px; right: 16px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 120px; font-weight: 900;
          color: rgba(200,89,10,0.055); line-height: 1;
          pointer-events: none; user-select: none;
          letter-spacing: -0.05em;
        }

        .wm-review__stars { display: flex; gap: 3px; color: var(--gold); }
        .wm-review__stars svg { width: 13px; height: 13px; fill: currentColor; }

        .wm-review__quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 600; font-style: italic;
          color: rgba(240,235,228,0.88); margin-top: 16px;
          line-height: 1.55; flex: 1; position: relative;
        }

        .wm-review__sep {
          width: 20px; height: 1.5px;
          background: var(--amber); margin: 18px 0; opacity: 0.65;
        }
        .wm-review__author {
          font-size: 10.5px; color: var(--text-muted);
          font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .wm-review__location {
          font-size: 9.5px; color: var(--text-faint); letter-spacing: 0.12em;
          text-transform: uppercase; margin-top: 3px; font-weight: 400;
        }

        @media(max-width:479px){
          .wm-testimonials { padding: 80px 0; }
          .wm-review { padding: 26px 22px; }
        }

        /* ════════════════════════════════════════
           FAQ
        ════════════════════════════════════════ */
        .wm-faq { padding: 120px 0; background: var(--ink-1); position: relative; }
        .wm-faq__cols {
          display: grid; grid-template-columns: 1fr;
          gap: 0; margin-top: 64px;
        }
        @media(min-width:768px){ .wm-faq__cols { grid-template-columns: 1fr 1fr; gap: 0 64px; } }

        .wm-faq-item { border-bottom: 1px solid var(--border); }
        .wm-faq-btn {
          width: 100%; background: none; border: none; cursor: pointer;
          padding: 22px 0; display: flex; align-items: center;
          justify-content: space-between; gap: 18px; text-align: left;
        }
        .wm-faq-btn--open .wm-faq-q { color: var(--text-primary); }
        .wm-faq-q {
          font-size: 14px; font-weight: 400; color: var(--text-secondary);
          line-height: 1.55; transition: color 0.22s; font-family: 'DM Sans', sans-serif;
        }
        .wm-faq-icon {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
          background: var(--amber-pale); color: var(--amber);
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--amber-border);
        }
        .wm-faq-a-inner {
          padding: 0 0 20px;
          font-size: 13.5px; color: var(--text-muted);
          line-height: 1.82; font-weight: 300;
        }

        @media(max-width:479px){
          .wm-faq { padding: 80px 0; }
          .wm-faq-q { font-size: 13px; }
        }

        /* ════════════════════════════════════════
           CTA BANNER
        ════════════════════════════════════════ */
        .wm-cta-section { padding: 48px 0 128px; }

        .wm-cta-box {
          border-radius: var(--r-2xl); overflow: hidden;
          background: var(--amber);
          padding: 80px 64px;
          display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center;
          position: relative;
        }
        @media(min-width:768px){
          .wm-cta-box { grid-template-columns: 1fr auto; padding: 80px 80px; gap: 56px; }
        }

        /* layered bg treatments */
        .wm-cta-box::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 15% 50%, rgba(255,255,255,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 85% 20%, rgba(0,0,0,0.10) 0%, transparent 55%);
        }
        /* subtle cross-hatch */
        .wm-cta-box__pattern {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: repeating-linear-gradient(
            45deg,
            #000 0, #000 1px, transparent 0, transparent 50%
          );
          background-size: 12px 12px;
        }
        /* top-right circle decoration */
        .wm-cta-box__circle {
          position: absolute; top: -60px; right: -60px;
          width: 280px; height: 280px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          pointer-events: none;
        }
        .wm-cta-box__circle::after {
          content: '';
          position: absolute; inset: 24px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.08);
        }

        .wm-cta-box__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 4.5vw, 62px); font-weight: 900; color: #fff;
          line-height: 1.0; position: relative; z-index: 1;
          letter-spacing: -0.01em;
        }
        .wm-cta-box__sub {
          font-size: 15px; color: rgba(255,255,255,0.78); margin-top: 14px;
          position: relative; z-index: 1; max-width: 400px;
          font-weight: 300; line-height: 1.75;
        }
        .wm-cta-box__btns {
          display: flex; flex-wrap: wrap; gap: 12px;
          position: relative; z-index: 1;
        }

        /* ── buttons ── */
        .wm-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; background: var(--amber); color: #fff;
          font-size: 12px; font-weight: 600; border-radius: var(--r-sm);
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.28s, transform 0.28s, box-shadow 0.28s;
          letter-spacing: 0.08em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }
        .wm-btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.28s;
        }
        .wm-btn-primary:hover {
          background: #a84e08;
          transform: translateY(-3px);
          box-shadow: var(--shadow-amber-lg);
        }
        .wm-btn-primary:hover::before { opacity: 1; }

        .wm-btn-outline {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; background: transparent;
          border: 1px solid var(--border-warm); color: var(--text-secondary);
          font-size: 12px; font-weight: 500; border-radius: var(--r-sm);
          text-decoration: none; cursor: pointer;
          transition: border-color 0.28s, color 0.28s, background 0.28s, transform 0.28s;
          letter-spacing: 0.08em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
        }
        .wm-btn-outline:hover {
          border-color: var(--text-secondary); color: var(--text-primary);
          background: var(--amber-pale); transform: translateY(-3px);
        }

        .wm-btn-dark {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 16px 32px; background: var(--ink); color: var(--off-white);
          font-size: 12px; font-weight: 600; border-radius: var(--r-sm);
          text-decoration: none;
          letter-spacing: 0.08em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.28s, transform 0.28s, box-shadow 0.28s;
        }
        .wm-btn-dark:hover { background: var(--ink-4); transform: translateY(-3px); box-shadow: var(--shadow-md); }

        .wm-btn-ghost {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 16px 32px; background: rgba(255,255,255,0.13); color: #fff;
          font-size: 12px; font-weight: 600; border-radius: var(--r-sm);
          text-decoration: none; border: 1.5px solid rgba(255,255,255,0.32);
          letter-spacing: 0.08em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.28s, transform 0.28s;
        }
        .wm-btn-ghost:hover { background: rgba(255,255,255,0.24); transform: translateY(-3px); }

        .wm-text-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; color: var(--amber);
          text-decoration: none;
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: gap 0.3s;
        }
        .wm-text-link:hover { gap: 16px; }
        .wm-text-link svg { width: 12px; height: 12px; }

        @media(max-width:479px){
          .wm-cta-section { padding: 40px 0 88px; }
          .wm-cta-box { padding: 44px 28px; border-radius: var(--r-xl); gap: 32px; }
          .wm-cta-box__btns { flex-direction: column; }
          .wm-btn-dark, .wm-btn-ghost { justify-content: center; }
        }

        @media(hover:none){
          .wm-btn-primary:hover, .wm-btn-outline:hover,
          .wm-btn-dark:hover, .wm-btn-ghost:hover,
          .wm-loc-card:hover, .wm-review:hover,
          .wm-feat-card:hover { transform: none; }
        }
      }</style>

      {/* Custom cursor */}
      <motion.div
        className={wm-cursor-outer${cursorHover ? " is-hover" : ""}}
        style={{
          translateX: cursorPos.x - (cursorHover ? 28 : 18),
          translateY: cursorPos.y - (cursorHover ? 28 : 18),
        }}
        animate={{ opacity: cursorVisible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="wm-cursor-inner"
        style={{ translateX: cursorPos.x - 2.5, translateY: cursorPos.y - 2.5 }}
        animate={{ opacity: cursorVisible ? 1 : 0 }}
        transition={{ duration: 0 }}
      />

      <div className="wm-page">

        {/* ══════════ HERO ══════════ */}
        <section className="wm-hero" ref={heroRef}>
          <motion.div
            className="wm-hero__bg"
            style={{ backgroundImage: url(${heroSlide}), y: bgY, opacity: bgOpacity, scale: bgScale }}
          />
          <div className="wm-hero__overlay" />
          <div className="wm-hero__amber-wash" />
          <div className="wm-hero__grain" />
          <div className="wm-hero__orb wm-hero__orb--1" />
          <div className="wm-hero__orb wm-hero__orb--2" />
          <div className="wm-hero__scanline" />

          {/* Floating particles */}
          <div className="wm-particles">
            {Array.from({ length: 18 }).map((_, i) => {
              const size  = i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5;
              const color = i % 5 === 0 ? "#c8590a" : i % 7 === 0 ? "rgba(232,160,48,0.4)" : "rgba(240,235,228,0.07)";
              return (
                <motion.div
                  key={i}
                  className="wm-particle"
                  style={{
                    width: size, height: size, background: color,
                    left: ${5 + (i * 4.8) % 90}%,
                    top:  ${10 + (i * 7.3) % 80}%,
                    boxShadow: i % 5 === 0 ? 0 0 8px ${color} : "none",
                  }}
                  animate={{ y: [0, -44, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{
                    duration: 3.5 + (i % 5) * 0.65,
                    delay: i * 0.42,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>

          <div className="wm-hero__inner">
            {/* LEFT copy */}
            <motion.div style={{ y: textY }}>
              {/* pedigree badge */}
              <motion.div
                className="wm-hero__badge"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
              >
                <div className="wm-hero__badge-dot">
                  <Sparkles style={{ width: 13, height: 13 }} />
                </div>
                <span className="wm-hero__badge-text">
                  <strong>Maryland's Favorite</strong> — Est. {SITE.established}
                </span>
              </motion.div>

              <div className="wm-hero__title wm-display">
                {["Come Hungry.", "Leave Happy."].map((line, li) => (
                  <div key={li} className="wm-hero__title-line">
                    <motion.span
                      className={wm-hero__title-inner${li === 1 ? " wm-shimmer" : ""}}
                      initial={{ y: "108%", rotateX: 14 }}
                      animate={{ y: "0%", rotateX: 0 }}
                      transition={{
                        duration: 1.0,
                        delay: 0.1 + li * 0.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ display: "block", transformOrigin: "bottom" }}
                    >
                      {line}
                    </motion.span>
                  </div>
                ))}
              </div>

              <motion.p
                className="wm-hero__sub"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                Fresh ingredients. Bold flavors. Three Maryland locations ready to serve you
                — because every meal should be worth the trip.
              </motion.p>

              <motion.div
                className="wm-hero__ctas"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Link to="/order" className="wm-btn-primary">
                  Order Now <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/locations" className="wm-btn-outline">
                  View Menus
                </Link>
              </motion.div>

              {/* trust signals */}
              <motion.div
                className="wm-hero__trust"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                {[
                  { icon: Star, text: "4.8 avg rating" },
                  { icon: MapPin, text: "3 locations" },
                  { icon: Clock, text: "Open daily" },
                ].map((item, i) => (
                  <>
                    {i > 0 && <div key={dot-${i}} className="wm-hero__trust-dot" />}
                    <div key={item.text} className="wm-hero__trust-item">
                      <item.icon />
                      {item.text}
                    </div>
                  </>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — floating card stack */}
            <div className="wm-hero__right">
              {[
                { img: heroPizza,   name: "Hand-Stretched Pizza",  price: "from $12.99", tag: "Signature",    i: 0 },
                { img: heroChicken, name: "Famous Fried Chicken",  price: "from $6.99",  tag: "Best Seller",  i: 1 },
                { img: heroSub,     name: "Hot Subs & Steaks",     price: "from $11.99", tag: "Fan Favorite", i: 2 },
                { img: heroSalad,   name: "Fresh Salads",          price: "from $9.99",  tag: "Daily Fresh",  i: 3 },
              ].map((item) => (
                <motion.div
                  key={item.i}
                  className={wm-food-card wm-food-card--${item.i}}
                  initial={{ opacity: 0, y: 56, scale: 0.84 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.92, delay: 0.48 + item.i * 0.15, ease: [0.22,1,0.36,1] }}
                  whileHover={{ y: -12, scale: 1.05, zIndex: 20, transition: { duration: 0.32 } }}
                >
                  <div className="wm-food-card__img">
                    <img src={item.img} alt={item.name} loading={item.i > 1 ? "lazy" : undefined} />
                    <div className="wm-food-card__img-overlay" />
                  </div>
                  <div className="wm-food-card__body">
                    <div className="wm-food-card__tag">{item.tag}</div>
                    <div className="wm-food-card__name">{item.name}</div>
                    <div className="wm-food-card__price">{item.price}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="wm-scroll-cue">
            <div className="wm-scroll-cue__track" />
            <span>scroll</span>
          </div>
        </section>

        {/* ══════════ TICKER ══════════ */}
        <div className="wm-ticker">
          <div className="wm-ticker__track">
            {Array.from({ length: 2 }).map((_, pass) =>
              ["Hand-Stretched Pizza", "Famous Fried Chicken", "Hot Subs & Steaks", "Fresh Salads", "3 Maryland Locations", "Open Daily", "Catering Available", "Est. 2010"].map((item, i) => (
                <div key={${pass}-${i}} className="wm-ticker__item">
                  {item}<span />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ══════════ STATS BAR ══════════ */}
        <div className="wm-stats-bar">
          <div className="wm-stats-bar__inner">
            {[
              { num: 3,   suffix: "",   label: "Locations"     },
              { num: 15,  suffix: "+",  label: "Years Serving" },
              { num: 50,  suffix: "+",  label: "Menu Items"    },
              { num: 4.8, suffix: "★",  label: "Avg. Rating"   },
            ].map((s, i) => (
              <motion.div
                key={s.label} className="wm-stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
              >
                <div className="wm-stat-item__num">
                  {s.suffix === "★"
                    ? <><CountUp to={48} />/50</>
                    : <><CountUp to={typeof s.num === "number" ? s.num : 0} />{s.suffix}</>
                  }
                </div>
                <div className="wm-stat-item__label">{s.label}</div>
                <span className="wm-stat-item__accent" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════════ VALUES ══════════ */}
        <section className="wm-values">
          <div className="wm-values__bg" />
          <div className="wm-section">
            <motion.div
              className="wm-values__header"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
            >
              <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Why Wise Mart <span className="wm-eyebrow-line" /></span>
              <h2 className="wm-display wm-section-title">Our Promise<br /><em>to Every Guest</em></h2>
              <p className="wm-section-sub" style={{ margin: "16px auto 0" }}>Four commitments that have guided every plate we serve since 2010.</p>
            </motion.div>
            <div className="wm-values__grid">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  className="wm-value"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
                >
                  <div className="wm-value__index">{String(i + 1).padStart(2, "0")}</div>
                  <div className="wm-value__icon-wrap"><v.icon /></div>
                  <div className="wm-value__title">{v.title}</div>
                  <div className="wm-value__desc">{v.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ LOCATIONS ══════════ */}
        <section className="wm-locations">
          <div className="wm-section">
            <motion.div
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
            >
              <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Three Locations <span className="wm-eyebrow-line" /></span>
              <h2 className="wm-display wm-section-title">Pick Your<br /><em>Wise Mart</em></h2>
              <p className="wm-section-sub" style={{ margin: "16px auto 0" }}>Each kitchen carries its own personality — same Wise Mart promise throughout.</p>
            </motion.div>
            <div className="wm-locations__grid">
              {LOCATIONS.map((loc, i) => (
                <motion.div
                  key={loc.slug}
                  initial={{ opacity: 0, y: 52 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.68, delay: i * 0.13, ease: [0.22,1,0.36,1] }}
                >
                  <Link to="/locations" className="wm-loc-card">
                    <div className="wm-loc-card__glow" />
                    <div className="wm-loc-card__corner" />
                    <div className="wm-loc-card__num">0{i + 1} — Maryland</div>
                    <div className="wm-loc-card__name">{loc.name}</div>
                    <div className="wm-loc-card__tagline">{loc.tagline}</div>
                    <div className="wm-loc-card__sep" />
                    <div className="wm-loc-card__specialty">{loc.specialty}</div>
                    <div className="wm-loc-card__footer">
                      <span className="wm-loc-card__cta">
                        View Menu <ArrowRight style={{ width: 12, height: 12 }} />
                      </span>
                      <a
                        href={loc.phoneHref}
                        onClick={(e) => e.stopPropagation()}
                        className="wm-loc-card__phone"
                      >
                        <Phone style={{ width: 10, height: 10 }} />{loc.phone}
                      </a>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FEATURED ══════════ */}
        <section className="wm-featured">
          <div className="wm-section">
            <motion.div
              className="wm-featured__header"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
            >
              <div>
                <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Featured</span>
                <h2 className="wm-display wm-section-title">What We're<br /><em>Known For</em></h2>
              </div>
              <Link to="/locations" className="wm-text-link" style={{ marginBottom: 8, flexShrink: 0 }}>
                Full Menus <ArrowRight />
              </Link>
            </motion.div>
            <div className="wm-featured__grid">
              {FEATURED.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 44, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
                >
                  <TiltCard className="wm-feat-card" strength={6}>
                    <div className="wm-feat-card__img">
                      <img src={f.img} alt={f.name} loading="lazy" />
                      <div className="wm-feat-card__badge"><f.icon /></div>
                      <div className="wm-feat-card__img-scrim" />
                    </div>
                    <div className="wm-feat-card__body">
                      <div className="wm-feat-card__tag">{f.tag}</div>
                      <div className="wm-feat-card__name">{f.name}</div>
                      <div className="wm-feat-card__price">{f.price}</div>
                      <div className="wm-feat-card__action">
                        Order Now <ChevronRight style={{ width: 11, height: 11 }} />
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ STORY ══════════ */}
        <section className="wm-story">
          <div className="wm-story__grid-deco" />
          <div className="wm-section">
            <div className="wm-story__inner">
              <motion.div
                initial={{ opacity: 0, x: -44 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.78, ease: [0.22,1,0.36,1] }}
              >
                <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Our Story</span>
                <h2 className="wm-display wm-section-title">More than a meal —<br /><em>a Maryland tradition.</em></h2>
                <p className="wm-story__lead">
                  "Serve good food, fast, at a fair price — and treat every guest like family."
                </p>
                <p className="wm-story__text">
                  Wise Mart opened its doors in {SITE.established} with that single conviction. Three locations and fifteen years later, nothing has changed — except the faces of the neighbors we've come to know.
                </p>
                <p className="wm-story__text">
                  From the pizza ovens in Sharptown to the breakfast counters in Vienna, every plate carries the same care, the same ingredients, the same pride.
                </p>
                <Link to="/about" className="wm-text-link" style={{ marginTop: 36, display: "inline-flex" }}>
                  Read our full story <ArrowRight />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 44, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.78, delay: 0.1, ease: [0.22,1,0.36,1] }}
              >
                <div className="wm-story__frame">
                  <div className="wm-story__frame-deco" />
                  <div className="wm-story__img-wrap">
                    <img src={heroPizza} alt="Hand-stretched pizza" loading="lazy" />
                    <div className="wm-story__img-caption">Made by hand. Served with pride.</div>
                  </div>
                  <div className="wm-story__year-badge">
                    <small>Est.</small>
                    {SITE.established}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════ TESTIMONIALS ══════════ */}
        <section className="wm-testimonials">
          <div className="wm-section">
            <motion.div
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
            >
              <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Reviews <span className="wm-eyebrow-line" /></span>
              <h2 className="wm-display wm-section-title">What Our<br /><em>Guests Say</em></h2>
            </motion.div>
            <div className="wm-testimonials__grid">
              {[
                { q: "Best fried chicken on the Eastern Shore. Hands down.",       author: "Marcus T.",     loc: "Sharptown"       },
                { q: "The breakfast pizza is a game changer. We're regulars now.", author: "Sarah & Jim",   loc: "Vienna"          },
                { q: "Cheesesteak subs that actually taste like Philly.",          author: "Dee R.",        loc: "East New Market" },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.62, delay: i * 0.12, ease: [0.22,1,0.36,1] }}
                >
                  <TiltCard className="wm-review" strength={5}>
                    <div className="wm-review__bg-quote">"</div>
                    <div className="wm-review__stars">
                      {Array.from({ length: 5 }).map((_, j) => <Star key={j} />)}
                    </div>
                    <div className="wm-review__quote">"{t.q}"</div>
                    <div className="wm-review__sep" />
                    <div className="wm-review__author">{t.author}</div>
                    <div className="wm-review__location"><MapPin style={{ width: 9, height: 9, display: "inline", marginRight: 4 }} />{t.loc}</div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FAQ ══════════ */}
        <section className="wm-faq">
          <div className="wm-section">
            <motion.div
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
            >
              <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> FAQ <span className="wm-eyebrow-line" /></span>
              <h2 className="wm-display wm-section-title">Quick<br /><em>Answers</em></h2>
              <p className="wm-section-sub" style={{ margin: "16px auto 0" }}>Everything our guests ask most — answered simply.</p>
            </motion.div>
            <div className="wm-faq__cols">
              <div>
                {FAQS.slice(0, 5).map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a} index={i} />
                ))}
              </div>
              <div>
                {FAQS.slice(5).map((item, i) => (
                  <FAQItem key={i + 5} q={item.q} a={item.a} index={i + 5} />
                ))}
              </div>
            </div>
            <motion.div
              style={{ textAlign: "center", marginTop: 56 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/faq" className="wm-text-link" style={{ display: "inline-flex" }}>
                See all FAQs <ArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══════════ CTA BANNER ══════════ */}
        <div className="wm-cta-section">
          <div className="wm-section">
            <motion.div
              className="wm-cta-box"
              initial={{ opacity: 0, y: 52, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.78, ease: [0.22,1,0.36,1] }}
              whileHover={{ scale: 1.007, transition: { duration: 0.38 } }}
            >
              <div className="wm-cta-box__pattern" />
              <div className="wm-cta-box__circle" />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 className="wm-cta-box__title">Ready to order?</h3>
                <p className="wm-cta-box__sub">
                  Pick your location, place your order, and we'll have it ready when you arrive.
                </p>
              </div>
              <div className="wm-cta-box__btns">
                <Link to="/order"     className="wm-btn-dark">
                  Order Now <ArrowRight style={{ width: 13, height: 13 }} />
                </Link>
                <Link to="/locations" className="wm-btn-ghost">Find a Location</Link>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </>
  );
}