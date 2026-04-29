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
  { icon: Sparkles, title: "Fresh Daily",   desc: "Dough, sauces, and produce prepared in-house every morning without exception." },
  { icon: Clock,    title: "Fast Service",  desc: "In and out in minutes — precision and quality working in perfect harmony." },
  { icon: Star,     title: "Exceptional Value", desc: "Generous portions and prices that honor your time and your wallet." },
  { icon: Pizza,    title: "Community",     desc: "Three locations. Three towns. One Maryland family bound by great food." },
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

function useMagneticHover(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [x, y, strength]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  return { x: springX, y: springY, onMove, onLeave };
}

function useTilt(strength = 8) {
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]),  { stiffness: 400, damping: 35 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 400, damping: 35 });
  const scale   = useSpring(1, { stiffness: 350, damping: 28 });
  const glowX   = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glowY   = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
    scale.set(1.02);
  }
  function onLeave() { x.set(0); y.set(0); scale.set(1); }
  return { rotateX, rotateY, scale, glowX, glowY, onMove, onLeave };
}

/* ─────────────────────────────── components ─────────────────────────── */

function TiltCard({ children, className, strength }: { children: React.ReactNode; className?: string; strength?: number }) {
  const { rotateX, rotateY, scale, glowX, glowY, onMove, onLeave } = useTilt(strength ?? 8);
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
      transition={{ duration: 0.5, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className={`wm-faq-btn${open ? " wm-faq-btn--open" : ""}`} onClick={() => setOpen(!open)}>
        <span className="wm-faq-q">{q}</span>
        <motion.span
          className="wm-faq-icon"
          animate={{ rotate: open ? 45 : 0, background: open ? "#c2600a" : "rgba(194,96,10,0.12)" }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
        >
          <Plus style={{ width: 14, height: 14 }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="wm-faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="wm-faq-a-inner">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NoiseTexture() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.028, pointerEvents: "none", zIndex: 1 }}>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

function HeroParticles() {
  const particles = Array.from({ length: 22 }).map((_, i) => ({
    size:  i % 4 === 0 ? 3.5 : i % 3 === 0 ? 2.5 : 1.8,
    color: i % 5 === 0 ? "#c2600a" : i % 7 === 0 ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.08)",
    left:  `${4 + (i * 4.31) % 92}%`,
    top:   `${8 + (i * 6.97) % 84}%`,
    dur:   3.2 + (i % 5) * 0.7,
    delay: i * 0.38,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: p.color,
            left: p.left, top: p.top,
            boxShadow: i % 5 === 0 ? `0 0 6px ${p.color}` : "none",
          }}
          animate={{ y: [0, -38, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function DiagonalRule() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.022 }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="diag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="40" x2="40" y2="0" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────── page ─────────────────────────────── */

function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const lineWidth = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { setCursorPos({ x: e.clientX, y: e.clientY }); setCursorVisible(true); };
    const onLeave = () => setCursorVisible(false);
    window.addEventListener("mousemove", onMove);
    document.body.addEventListener("mouseleave", onLeave);
    return () => { window.removeEventListener("mousemove", onMove); document.body.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        /* ── reset / base ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --amber:       #c2600a;
          --amber-light: #e8862a;
          --amber-pale:  rgba(194,96,10,0.12);
          --amber-glow:  rgba(194,96,10,0.28);
          --white:       #ffffff;
          --off-white:   #f5f0eb;
          --ink:         #080706;
          --ink-1:       #0e0c0b;
          --ink-2:       #141210;
          --ink-3:       #1c1916;
          --ink-4:       #231f1c;
          --muted-40:    rgba(245,240,235,0.4);
          --muted-28:    rgba(245,240,235,0.28);
          --muted-16:    rgba(245,240,235,0.16);
          --muted-08:    rgba(245,240,235,0.08);
          --muted-05:    rgba(245,240,235,0.05);
          --border:      rgba(245,240,235,0.08);
          --border-mid:  rgba(245,240,235,0.14);
          --radius-sm:   8px;
          --radius-md:   14px;
          --radius-lg:   20px;
          --radius-xl:   28px;
        }

        html { scroll-behavior: smooth; }

        .wm-page {
          font-family: 'Outfit', sans-serif;
          background: var(--ink);
          color: var(--off-white);
          overflow-x: hidden;
        }

        /* custom scrollbar */
        .wm-page::-webkit-scrollbar { width: 4px; }
        .wm-page::-webkit-scrollbar-track { background: var(--ink); }
        .wm-page::-webkit-scrollbar-thumb { background: var(--amber); border-radius: 2px; }

        /* ── cursor ── */
        .wm-cursor {
          position: fixed;
          top: 0; left: 0;
          width: 20px; height: 20px;
          border: 1.5px solid var(--amber);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transition: opacity 0.2s;
        }

        /* ── layout ── */
        .wm-section { max-width: 1320px; margin: 0 auto; padding: 0 32px; }
        @media(min-width:768px){ .wm-section { padding: 0 48px; } }
        @media(min-width:1280px){ .wm-section { padding: 0 64px; } }

        /* ── eyebrow ── */
        .wm-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 9.5px; font-weight: 600; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--amber);
          font-family: 'Outfit', sans-serif;
        }
        .wm-eyebrow .wm-eyebrow-line {
          display: block; width: 32px; height: 1px;
          background: linear-gradient(90deg, var(--amber), transparent);
          flex-shrink: 0;
        }

        /* ── display type ── */
        .wm-display {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          line-height: 1.0;
          letter-spacing: -0.015em;
          color: var(--off-white);
        }
        .wm-display em {
          font-style: italic;
          color: var(--amber);
        }
        .wm-section-title { font-size: clamp(38px, 4.2vw, 60px); margin-top: 16px; }
        .wm-section-sub   { font-size: 14px; color: var(--muted-40); margin-top: 12px; line-height: 1.7; max-width: 500px; font-weight: 300; }

        /* ── horizontal rule ── */
        .wm-rule { height: 1px; background: var(--border); }
        .wm-rule-amber { height: 1px; background: linear-gradient(90deg, var(--amber), transparent); }

        /* ════════════════ HERO ════════════════ */
        .wm-hero {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          background: var(--ink);
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .wm-hero__bg {
          position: absolute; inset: -8%;
          background-size: cover; background-position: center;
          will-change: transform;
        }
        .wm-hero__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to right,
            rgba(8,7,6,0.97) 0%,
            rgba(8,7,6,0.88) 40%,
            rgba(8,7,6,0.60) 68%,
            rgba(8,7,6,0.30) 100%
          );
        }
        .wm-hero__overlay-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 35%;
          background: linear-gradient(to top, rgba(8,7,6,1) 0%, transparent 100%);
          pointer-events: none; z-index: 2;
        }

        .wm-hero__inner {
          position: relative; z-index: 3;
          max-width: 1320px; margin: 0 auto;
          padding: 140px 32px 88px;
          display: grid; grid-template-columns: 1fr;
          gap: 56px; align-items: end;
        }
        @media(min-width:768px){ .wm-hero__inner { padding: 150px 48px 100px; } }
        @media(min-width:1024px){
          .wm-hero__inner {
            grid-template-columns: 55fr 45fr;
            padding: 160px 64px 110px;
            align-items: end;
          }
        }

        .wm-hero__pretitle {
          display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
        }
        .wm-hero__pretitle-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--amber);
          box-shadow: 0 0 12px var(--amber);
          animation: pulseDot 2.5s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.6); opacity: 0.5; }
        }

        .wm-hero__title {
          font-size: clamp(56px, 7.5vw, 108px);
          margin-top: 0;
          color: var(--off-white);
          position: relative;
        }
        .wm-hero__title-line { display: block; overflow: hidden; }
        .wm-hero__title-inner { display: block; }

        .wm-shimmer-text {
          background: linear-gradient(92deg, #c2600a 0%, #f5a623 30%, #fbbf24 50%, #e8862a 70%, #c2600a 100%);
          background-size: 280% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 5s linear infinite;
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .wm-hero__sub {
          font-size: 15px; color: var(--muted-28); line-height: 1.8;
          margin-top: 24px; max-width: 440px; font-weight: 300; letter-spacing: 0.01em;
        }

        .wm-hero__ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 40px; }

        .wm-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 34px; background: var(--amber); color: #fff;
          font-size: 13px; font-weight: 600; border-radius: var(--radius-sm);
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
          letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Outfit', sans-serif;
          position: relative; overflow: hidden;
        }
        .wm-btn-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .wm-btn-primary:hover { background: #a84e06; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(194,96,10,0.40); }
        .wm-btn-primary:hover::after { opacity: 1; }

        .wm-btn-outline {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 34px; background: transparent;
          border: 1px solid var(--border-mid); color: var(--muted-40);
          font-size: 13px; font-weight: 500; border-radius: var(--radius-sm);
          text-decoration: none; cursor: pointer;
          transition: border-color 0.25s, color 0.25s, background 0.25s, transform 0.25s;
          letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Outfit', sans-serif;
        }
        .wm-btn-outline:hover {
          border-color: var(--muted-40); color: var(--off-white);
          background: var(--muted-05); transform: translateY(-3px);
        }

        /* hero right: food card stack */
        .wm-hero__right { display: none; }
        @media(min-width:1024px){ .wm-hero__right { display: block; position: relative; height: 540px; } }

        .wm-food-card {
          position: absolute;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--ink-3);
          backdrop-filter: blur(12px);
          transition: border-color 0.35s, box-shadow 0.35s;
          cursor: default;
        }
        .wm-food-card:hover {
          border-color: rgba(194,96,10,0.4);
          box-shadow: 0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(194,96,10,0.12);
        }
        .wm-food-card img { width: 100%; height: 180px; object-fit: cover; display: block; transition: transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .wm-food-card:hover img { transform: scale(1.07); }
        .wm-food-card__body { padding: 14px 16px 16px; }
        .wm-food-card__tag { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--amber); margin-bottom: 5px; }
        .wm-food-card__name { font-size: 13.5px; font-weight: 600; color: rgba(245,240,235,0.9); line-height: 1.3; }
        .wm-food-card__price { font-size: 12px; color: var(--muted-28); margin-top: 3px; font-weight: 300; }

        /* card positions */
        .wm-food-card--0 { width: 200px; top:  0px; left:  20px; z-index: 4; transform: rotate(-3deg); }
        .wm-food-card--1 { width: 210px; top:  40px; left: 200px; z-index: 5; transform: rotate(1.5deg); }
        .wm-food-card--2 { width: 196px; top: 260px; left:  30px; z-index: 3; transform: rotate(2.5deg); }
        .wm-food-card--3 { width: 208px; top: 240px; left: 210px; z-index: 6; transform: rotate(-1.5deg); }

        /* scroll hint */
        .wm-scroll-hint {
          position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
          z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 8px;
          font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted-16);
        }
        .wm-scroll-hint__track {
          width: 1px; height: 48px; background: var(--border);
          position: relative; overflow: hidden;
        }
        .wm-scroll-hint__track::after {
          content: ''; position: absolute; top: -100%; left: 0;
          width: 100%; height: 100%; background: var(--amber);
          animation: scrollLine 2s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%   { top: -100%; opacity: 1; }
          80%  { top:  100%; opacity: 0.4; }
          100% { top:  100%; opacity: 0; }
        }

        /* ════════════════ STATS BAR ════════════════ */
        .wm-stats {
          position: relative;
          background: var(--amber);
          overflow: hidden;
        }
        .wm-stats::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 12px,
            rgba(0,0,0,0.03) 12px,
            rgba(0,0,0,0.03) 13px
          );
        }
        .wm-stats__inner {
          position: relative;
          max-width: 1320px; margin: 0 auto; padding: 0 48px;
          display: grid; grid-template-columns: repeat(4,1fr);
        }
        @media(max-width:767px){
          .wm-stats__inner { grid-template-columns: repeat(2,1fr); padding: 0 24px; }
        }
        .wm-stat {
          padding: 32px 24px; text-align: center;
          border-right: 1px solid rgba(0,0,0,0.1);
          position: relative;
          transition: background 0.25s;
        }
        .wm-stat:last-child { border-right: none; }
        .wm-stat:hover { background: rgba(0,0,0,0.06); }
        @media(max-width:767px){
          .wm-stat:nth-child(2) { border-right: none; }
        }
        .wm-stat__num   { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 900; color: #fff; line-height: 1; }
        .wm-stat__label { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.78); margin-top: 6px; letter-spacing: 0.14em; text-transform: uppercase; }
        @media(max-width:767px){ .wm-stat__num { font-size: 34px; } }

        /* ════════════════ VALUES ════════════════ */
        .wm-values { padding: 110px 0; position: relative; }
        .wm-values__header { text-align: center; }
        .wm-values__grid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 1px;
          margin-top: 64px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        @media(min-width:1024px){ .wm-values__grid { grid-template-columns: repeat(4,1fr); } }

        .wm-value {
          padding: 44px 32px; background: var(--ink-1);
          position: relative; overflow: hidden;
          transition: background 0.35s;
        }
        .wm-value::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 20% 10%, rgba(194,96,10,0.1) 0%, transparent 65%);
          opacity: 0; transition: opacity 0.45s;
        }
        .wm-value:hover { background: var(--ink-2); }
        .wm-value:hover::before { opacity: 1; }

        .wm-value__number {
          font-family: 'Playfair Display', serif;
          font-size: 64px; font-weight: 900;
          color: var(--amber-pale);
          line-height: 1;
          position: absolute; top: 20px; right: 20px;
          transition: color 0.35s;
        }
        .wm-value:hover .wm-value__number { color: rgba(194,96,10,0.18); }

        .wm-value__icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: var(--amber-pale); color: var(--amber);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.3s, transform 0.5s cubic-bezier(.34,1.56,.64,1), box-shadow 0.35s;
        }
        .wm-value:hover .wm-value__icon {
          background: var(--amber); color: #fff;
          transform: scale(1.12) rotate(-7deg);
          box-shadow: 0 12px 32px rgba(194,96,10,0.45);
        }
        .wm-value__icon svg { width: 22px; height: 22px; }
        .wm-value__title {
          font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700;
          color: var(--off-white); margin-top: 24px; line-height: 1.15;
        }
        .wm-value__desc  { font-size: 13px; color: var(--muted-28); margin-top: 10px; line-height: 1.7; font-weight: 300; }
        .wm-value__accent { display: block; width: 28px; height: 2px; background: var(--amber); margin-top: 20px; opacity: 0; transform: scaleX(0); transform-origin: left; transition: opacity 0.3s, transform 0.4s cubic-bezier(0.22,1,0.36,1); }
        .wm-value:hover .wm-value__accent { opacity: 1; transform: scaleX(1); }

        @media(max-width:479px){
          .wm-values { padding: 72px 0; }
          .wm-values__grid { grid-template-columns: 1fr; }
          .wm-value { padding: 32px 24px; }
          .wm-value__number { font-size: 48px; }
        }

        /* ════════════════ LOCATIONS ════════════════ */
        .wm-locations { padding: 110px 0; background: var(--ink-1); position: relative; }
        .wm-locations::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-mid), transparent);
        }
        .wm-locations__grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 64px; }
        @media(min-width:768px){ .wm-locations__grid { grid-template-columns: repeat(3,1fr); } }

        .wm-loc-card {
          position: relative; border-radius: var(--radius-xl); overflow: hidden;
          border: 1px solid var(--border); background: var(--ink-2);
          padding: 36px 32px; text-decoration: none;
          display: flex; flex-direction: column; min-height: 320px;
          transition: border-color 0.35s, box-shadow 0.4s, transform 0.4s;
        }
        .wm-loc-card:hover {
          border-color: rgba(194,96,10,0.45);
          box-shadow: 0 28px 72px rgba(0,0,0,0.5), 0 0 0 1px rgba(194,96,10,0.12);
          transform: translateY(-4px);
        }
        .wm-loc-card__glow {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(194,96,10,0.09) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.4s;
        }
        .wm-loc-card:hover .wm-loc-card__glow { opacity: 1; }

        .wm-loc-card__num {
          font-family: 'Playfair Display', serif; font-size: 11px; font-weight: 400;
          letter-spacing: 0.2em; color: var(--muted-16); position: relative;
        }
        .wm-loc-card__name {
          font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700;
          color: var(--off-white); margin-top: 16px; line-height: 1.0; position: relative;
        }
        .wm-loc-card__tagline {
          font-size: 13px; color: var(--muted-28); margin-top: 12px; line-height: 1.65;
          font-weight: 300; position: relative;
        }
        .wm-loc-card__specialty {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--amber); margin-top: auto; padding-top: 24px;
          border-top: 1px solid var(--border); position: relative;
        }
        .wm-loc-card__footer {
          display: flex; align-items: center; justify-content: space-between; margin-top: 18px;
          position: relative;
        }
        .wm-loc-card__cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; color: var(--amber);
          letter-spacing: 0.06em; text-transform: uppercase; transition: gap 0.28s;
        }
        .wm-loc-card:hover .wm-loc-card__cta { gap: 14px; }
        .wm-loc-card__cta svg { width: 13px; height: 13px; }
        .wm-loc-card__phone {
          font-size: 11px; color: var(--muted-16); text-decoration: none;
          display: flex; align-items: center; gap: 5px; transition: color 0.2s;
        }
        .wm-loc-card__phone:hover { color: var(--muted-40); }
        .wm-loc-card__phone svg { width: 10px; height: 10px; }

        @media(max-width:479px){
          .wm-locations { padding: 72px 0; }
          .wm-loc-card { padding: 28px 22px; min-height: 280px; }
          .wm-loc-card__name { font-size: 28px; }
        }

        /* ════════════════ FEATURED ════════════════ */
        .wm-featured { padding: 110px 0; position: relative; }
        .wm-featured__header {
          display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;
        }
        .wm-featured__grid {
          display: grid; grid-template-columns: repeat(2,1fr);
          gap: 18px; margin-top: 56px;
        }
        @media(min-width:1024px){ .wm-featured__grid { grid-template-columns: repeat(4,1fr); } }

        .wm-feat-card {
          border-radius: var(--radius-lg); overflow: hidden;
          border: 1px solid var(--border); background: var(--ink-1);
          transition: border-color 0.3s, box-shadow 0.35s;
        }
        .wm-feat-card:hover {
          border-color: rgba(194,96,10,0.35);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
        .wm-feat-card__img { position: relative; aspect-ratio: 4/3; overflow: hidden; }
        .wm-feat-card__img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .wm-feat-card:hover .wm-feat-card__img img { transform: scale(1.1); }

        .wm-feat-card__badge {
          position: absolute; top: 12px; right: 12px;
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(194,96,10,0.9); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; color: #fff;
          transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
        }
        .wm-feat-card:hover .wm-feat-card__badge {
          transform: scale(1.14) rotate(-9deg);
          box-shadow: 0 8px 24px rgba(194,96,10,0.5);
        }
        .wm-feat-card__badge svg { width: 18px; height: 18px; }

        .wm-feat-card__img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,7,6,0.6) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.3s;
        }
        .wm-feat-card:hover .wm-feat-card__img-overlay { opacity: 1; }

        .wm-feat-card__body { padding: 20px; }
        .wm-feat-card__tag  { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--amber); margin-bottom: 6px; }
        .wm-feat-card__name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: rgba(245,240,235,0.9); line-height: 1.25; }
        .wm-feat-card__price { font-size: 12px; color: var(--muted-28); margin-top: 5px; font-weight: 300; }

        @media(max-width:479px){
          .wm-featured { padding: 72px 0; }
          .wm-featured__grid { grid-template-columns: 1fr; gap: 14px; }
          .wm-featured__header { flex-direction: column; align-items: flex-start; gap: 10px; }
        }

        /* ════════════════ STORY ════════════════ */
        .wm-story { padding: 110px 0; background: var(--ink-1); position: relative; }
        .wm-story::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-mid), transparent);
        }
        .wm-story__inner {
          display: grid; grid-template-columns: 1fr; gap: 64px; align-items: center;
        }
        @media(min-width:1024px){ .wm-story__inner { grid-template-columns: 1fr 1fr; } }

        .wm-story__text {
          font-size: 15px; color: var(--muted-28); line-height: 1.85;
          margin-top: 16px; font-weight: 300;
        }
        .wm-story__link {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11.5px; font-weight: 700; color: var(--amber);
          text-decoration: none; margin-top: 32px;
          letter-spacing: 0.1em; text-transform: uppercase;
          transition: gap 0.28s;
        }
        .wm-story__link:hover { gap: 18px; }
        .wm-story__link svg { width: 14px; height: 14px; }

        .wm-story__img-wrap {
          position: relative; border-radius: var(--radius-xl); overflow: hidden;
          aspect-ratio: 4/3; border: 1px solid var(--border);
          transition: box-shadow 0.45s;
        }
        .wm-story__img-wrap:hover { box-shadow: 0 40px 96px rgba(0,0,0,0.55); }
        .wm-story__img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .wm-story__img-wrap:hover img { transform: scale(1.05); }
        .wm-story__img-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 32px 28px 24px;
          background: linear-gradient(to top, rgba(8,7,6,0.95) 0%, rgba(8,7,6,0.4) 60%, transparent 100%);
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 600; font-style: italic;
          color: var(--muted-40); line-height: 1.4;
        }

        .wm-story__decoration {
          position: absolute;
          top: -24px; right: -24px;
          width: 120px; height: 120px;
          border-radius: 50%;
          border: 1px solid var(--border);
          pointer-events: none;
        }
        .wm-story__decoration::after {
          content: '';
          position: absolute;
          top: 14px; right: 14px; bottom: 14px; left: 14px;
          border-radius: 50%;
          border: 1px solid rgba(194,96,10,0.2);
        }

        @media(max-width:479px){
          .wm-story { padding: 72px 0; }
          .wm-story__inner { gap: 40px; }
          .wm-story__img-caption { font-size: 15px; }
        }

        /* ════════════════ TESTIMONIALS ════════════════ */
        .wm-testimonials { padding: 110px 0; }
        .wm-testimonials__grid {
          display: grid; grid-template-columns: 1fr; gap: 18px; margin-top: 64px;
        }
        @media(min-width:768px){ .wm-testimonials__grid { grid-template-columns: repeat(3,1fr); } }

        .wm-review {
          padding: 32px 28px; border-radius: var(--radius-lg);
          background: var(--ink-1); border: 1px solid var(--border);
          position: relative; overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.35s, transform 0.35s;
        }
        .wm-review:hover {
          border-color: rgba(194,96,10,0.3);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          transform: translateY(-3px);
        }
        .wm-review::before {
          content: "“";
          position: absolute; top: -12px; right: 20px;
          font-family: 'Playfair Display', serif; font-size: 100px;
          color: rgba(194,96,10,0.07); line-height: 1; pointer-events: none;
          user-select: none;
        }

        .wm-review__stars { display: flex; gap: 3px; color: var(--amber); }
        .wm-review__stars svg { width: 14px; height: 14px; fill: currentColor; }
        .wm-review__quote {
          font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 600;
          font-style: italic; color: rgba(245,240,235,0.88); margin-top: 18px; line-height: 1.5;
        }
        .wm-review__divider { width: 24px; height: 1.5px; background: var(--amber); margin: 18px 0; opacity: 0.6; }
        .wm-review__author { font-size: 11px; color: var(--muted-28); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; }

        @media(max-width:479px){
          .wm-testimonials { padding: 72px 0; }
          .wm-review { padding: 24px 20px; }
          .wm-review__quote { font-size: 15px; }
        }

        /* ════════════════ FAQ ════════════════ */
        .wm-faq { padding: 110px 0; background: var(--ink-1); position: relative; }
        .wm-faq::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-mid), transparent);
        }
        .wm-faq__cols {
          display: grid; grid-template-columns: 1fr; gap: 0; margin-top: 64px;
        }
        @media(min-width:768px){ .wm-faq__cols { grid-template-columns: 1fr 1fr; gap: 0 56px; } }

        .wm-faq-item { border-bottom: 1px solid var(--border); }
        .wm-faq-btn {
          width: 100%; background: none; border: none; cursor: pointer;
          padding: 24px 0; display: flex; align-items: center; justify-content: space-between;
          gap: 18px; text-align: left;
        }
        .wm-faq-btn--open .wm-faq-q { color: var(--off-white); }
        .wm-faq-q {
          font-size: 14px; font-weight: 500; color: var(--muted-40);
          line-height: 1.5; transition: color 0.2s; font-family: 'Outfit', sans-serif;
        }
        .wm-faq-icon {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
          background: var(--amber-pale); color: var(--amber);
          display: flex; align-items: center; justify-content: center;
        }
        .wm-faq-a-inner {
          padding: 0 0 22px;
          font-size: 13.5px; color: var(--muted-28); line-height: 1.8; font-weight: 300;
        }

        @media(max-width:479px){
          .wm-faq { padding: 72px 0; }
          .wm-faq-q { font-size: 13px; }
          .wm-faq-btn { padding: 20px 0; }
        }

        /* ════════════════ CTA BANNER ════════════════ */
        .wm-cta-banner { padding: 40px 0 120px; }

        .wm-cta-banner__box {
          border-radius: var(--radius-xl); overflow: hidden;
          background: var(--amber);
          padding: 72px 56px;
          display: grid; grid-template-columns: 1fr; gap: 36px; align-items: center;
          position: relative;
        }
        @media(min-width:768px){
          .wm-cta-banner__box { grid-template-columns: 1fr auto; padding: 72px 68px; gap: 48px; }
        }

        .wm-cta-banner__box::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(0,0,0,0.08) 0%, transparent 50%);
        }
        .wm-cta-banner__box::after {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .wm-cta-banner__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px,4.2vw,58px); font-weight: 900; color: #fff;
          line-height: 1.05; position: relative; z-index: 1;
        }
        .wm-cta-banner__sub {
          font-size: 15px; color: rgba(255,255,255,0.8); margin-top: 14px;
          position: relative; z-index: 1; max-width: 420px; font-weight: 300; line-height: 1.7;
        }
        .wm-cta-banner__btns { display: flex; flex-wrap: wrap; gap: 12px; position: relative; z-index: 1; }
        .wm-btn-dark {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 15px 30px; background: var(--ink); color: var(--off-white);
          font-size: 12.5px; font-weight: 600; border-radius: var(--radius-sm);
          text-decoration: none;
          letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Outfit', sans-serif;
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .wm-btn-dark:hover { background: var(--ink-3); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.35); }
        .wm-btn-light {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 15px 30px; background: rgba(255,255,255,0.15); color: #fff;
          font-size: 12.5px; font-weight: 600; border-radius: var(--radius-sm);
          text-decoration: none; border: 1.5px solid rgba(255,255,255,0.35);
          letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Outfit', sans-serif;
          transition: background 0.25s, transform 0.25s;
        }
        .wm-btn-light:hover { background: rgba(255,255,255,0.28); transform: translateY(-3px); }

        @media(max-width:479px){
          .wm-cta-banner { padding: 40px 0 80px; }
          .wm-cta-banner__box { padding: 40px 26px; border-radius: var(--radius-lg); }
          .wm-cta-banner__btns { flex-direction: column; }
          .wm-btn-dark, .wm-btn-light { justify-content: center; }
        }

        /* ── touch devices ── */
        @media(hover:none){
          .wm-btn-primary:hover, .wm-btn-outline:hover,
          .wm-btn-dark:hover, .wm-btn-light:hover,
          .wm-loc-card:hover, .wm-review:hover { transform: none; }
        }
      `}</style>

      {/* Custom cursor — desktop only */}
      <motion.div
        className="wm-cursor"
        style={{ translateX: cursorPos.x - 10, translateY: cursorPos.y - 10 }}
        animate={{ opacity: cursorVisible ? 1 : 0, scale: 1 }}
        transition={{ duration: 0 }}
      />

      <div className="wm-page">

        {/* ════════════════ HERO ════════════════ */}
        <section className="wm-hero" ref={heroRef}>
          <motion.div
            className="wm-hero__bg"
            style={{ backgroundImage: `url(${heroSlide})`, y: bgY, opacity: bgOpacity, scale: bgScale }}
          />
          <div className="wm-hero__overlay" />
          <div className="wm-hero__overlay-bottom" />
          <HeroParticles />
          <NoiseTexture />

          <div className="wm-hero__inner">
            {/* LEFT */}
            <motion.div style={{ y: textY }}>
              <motion.div
                className="wm-hero__pretitle"
                initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="wm-hero__pretitle-dot" />
                <span className="wm-eyebrow" style={{ color: "rgba(245,240,235,0.36)" }}>
                  Maryland Tradition — {SITE.established}
                </span>
              </motion.div>

              <div className="wm-hero__title wm-display">
                {["Come Hungry.", "Leave Happy."].map((line, li) => (
                  <div key={li} className="wm-hero__title-line">
                    <motion.span
                      className={`wm-hero__title-inner${li === 1 ? " wm-shimmer-text" : ""}`}
                      initial={{ y: "110%", rotateX: 18 }}
                      animate={{ y: "0%", rotateX: 0 }}
                      transition={{ duration: 0.9, delay: 0.12 + li * 0.18, ease: [0.22, 1, 0.36, 1] }}
                      style={{ display: "block", transformOrigin: "bottom" }}
                    >
                      {line}
                    </motion.span>
                  </div>
                ))}
              </div>

              <motion.p
                className="wm-hero__sub"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.52 }}
              >
                Fresh food. Fast service. Three Maryland locations ready to serve you
                — because every meal should be worth the trip.
              </motion.p>

              <motion.div
                className="wm-hero__ctas"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.68 }}
              >
                <Link to="/order" className="wm-btn-primary">
                  Order Now <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/locations" className="wm-btn-outline">
                  Explore Menus
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT — floating card stack */}
            <div className="wm-hero__right">
              {[
                { img: heroPizza,   name: "Hand-Stretched Pizza",  price: "from $12.99", tag: "Signature",   i: 0 },
                { img: heroChicken, name: "Famous Fried Chicken",  price: "from $6.99",  tag: "Best Seller", i: 1 },
                { img: heroSub,     name: "Hot Subs & Steaks",     price: "from $11.99", tag: "Fan Favorite",i: 2 },
                { img: heroSalad,   name: "Fresh Salads",          price: "from $9.99",  tag: "Daily Fresh", i: 3 },
              ].map((item) => (
                <motion.div
                  key={item.i}
                  className={`wm-food-card wm-food-card--${item.i}`}
                  initial={{ opacity: 0, y: 60, scale: 0.82 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.88, delay: 0.5 + item.i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -10, scale: 1.04, zIndex: 20, transition: { duration: 0.3 } }}
                >
                  <img src={item.img} alt={item.name} loading={item.i > 1 ? "lazy" : undefined} />
                  <div className="wm-food-card__body">
                    <div className="wm-food-card__tag">{item.tag}</div>
                    <div className="wm-food-card__name">{item.name}</div>
                    <div className="wm-food-card__price">{item.price}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="wm-scroll-hint">
            <div className="wm-scroll-hint__track" />
            <span>scroll</span>
          </div>
        </section>

        {/* ════════════════ STATS BAR ════════════════ */}
        <motion.div
          className="wm-stats"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <div className="wm-stats__inner">
            {[
              { num: "3",    label: "Locations"      },
              { num: "15+",  label: "Years Serving"  },
              { num: "50+",  label: "Menu Items"     },
              { num: "★4.8", label: "Avg. Rating"    },
            ].map((s, i) => (
              <motion.div
                key={s.label} className="wm-stat"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="wm-stat__num">{s.num}</div>
                <div className="wm-stat__label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════════════════ VALUES ════════════════ */}
        <section className="wm-values">
          <div className="wm-section">
            <motion.div
              className="wm-values__header"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Why Wise Mart <span className="wm-eyebrow-line" /></span>
              <h2 className="wm-display wm-section-title">Our Promise</h2>
              <p className="wm-section-sub" style={{ margin: "12px auto 0" }}>Four commitments we make to every guest, every visit.</p>
            </motion.div>
            <div className="wm-values__grid">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title} className="wm-value"
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wm-value__number">{String(i + 1).padStart(2, "0")}</div>
                  <div className="wm-value__icon"><v.icon /></div>
                  <div className="wm-value__title">{v.title}</div>
                  <div className="wm-value__desc">{v.desc}</div>
                  <span className="wm-value__accent" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ LOCATIONS ════════════════ */}
        <section className="wm-locations">
          <div className="wm-section">
            <motion.div
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Three Locations <span className="wm-eyebrow-line" /></span>
              <h2 className="wm-display wm-section-title">Pick Your Wise Mart</h2>
              <p className="wm-section-sub" style={{ margin: "12px auto 0" }}>Each kitchen carries its own personality — same Wise Mart promise.</p>
            </motion.div>
            <div className="wm-locations__grid">
              {LOCATIONS.map((loc, i) => (
                <motion.div
                  key={loc.slug}
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to="/locations" className="wm-loc-card">
                    <div className="wm-loc-card__glow" />
                    <div className="wm-loc-card__num">0{i + 1} — Maryland</div>
                    <div className="wm-loc-card__name">{loc.name}</div>
                    <div className="wm-loc-card__tagline">{loc.tagline}</div>
                    <div className="wm-loc-card__specialty">{loc.specialty}</div>
                    <div className="wm-loc-card__footer">
                      <span className="wm-loc-card__cta">
                        View Menu <ArrowRight />
                      </span>
                      <a
                        href={loc.phoneHref}
                        onClick={(e) => e.stopPropagation()}
                        className="wm-loc-card__phone"
                      >
                        <Phone />{loc.phone}
                      </a>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ FEATURED ════════════════ */}
        <section className="wm-featured">
          <div className="wm-section">
            <motion.div
              className="wm-featured__header"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Featured</span>
                <h2 className="wm-display wm-section-title">What we're known for</h2>
              </div>
              <Link to="/locations" className="wm-story__link" style={{ marginBottom: 8, flexShrink: 0 }}>
                Full Menus <ArrowRight />
              </Link>
            </motion.div>
            <div className="wm-featured__grid">
              {FEATURED.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard className="wm-feat-card" strength={7}>
                    <div className="wm-feat-card__img">
                      <img src={f.img} alt={f.name} loading="lazy" />
                      <div className="wm-feat-card__badge"><f.icon /></div>
                      <div className="wm-feat-card__img-overlay" />
                    </div>
                    <div className="wm-feat-card__body">
                      <div className="wm-feat-card__tag">{f.tag}</div>
                      <div className="wm-feat-card__name">{f.name}</div>
                      <div className="wm-feat-card__price">{f.price}</div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ STORY ════════════════ */}
        <section className="wm-story">
          <div className="wm-section">
            <div className="wm-story__inner">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Our Story</span>
                <h2 className="wm-display wm-section-title">More than a meal —<br /><em>a Maryland tradition.</em></h2>
                <p className="wm-story__text">
                  Wise Mart opened its doors in {SITE.established} with one simple idea: serve good food, fast, at a fair price — and treat every guest like family.
                </p>
                <p className="wm-story__text">
                  Three locations later, that idea hasn't changed. From the pizza ovens in Sharptown to the breakfast counters in Vienna, every plate carries the same care.
                </p>
                <Link to="/about" className="wm-story__link">
                  Read our full story <ArrowRight />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "relative" }}
              >
                <div className="wm-story__decoration" />
                <div className="wm-story__img-wrap">
                  <img src={heroPizza} alt="Hand-stretched pizza" loading="lazy" />
                  <div className="wm-story__img-caption">Made by hand. Served with pride.</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════ TESTIMONIALS ════════════════ */}
        <section className="wm-testimonials">
          <div className="wm-section">
            <motion.div
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> Reviews <span className="wm-eyebrow-line" /></span>
              <h2 className="wm-display wm-section-title">What our guests say</h2>
            </motion.div>
            <div className="wm-testimonials__grid">
              {[
                { q: "Best fried chicken on the Eastern Shore. Hands down.",       a: "Marcus T.", loc: "Sharptown"      },
                { q: "The breakfast pizza is a game changer. We're regulars now.", a: "Sarah & Jim", loc: "Vienna"        },
                { q: "Cheesesteak subs that actually taste like home.",             a: "Dee R.", loc: "East New Market" },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 36, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard className="wm-review" strength={5}>
                    <div className="wm-review__stars">
                      {Array.from({ length: 5 }).map((_, j) => <Star key={j} />)}
                    </div>
                    <div className="wm-review__quote">"{t.q}"</div>
                    <div className="wm-review__divider" />
                    <div className="wm-review__author">{t.a} — {t.loc}</div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ FAQ ════════════════ */}
        <section className="wm-faq">
          <div className="wm-section">
            <motion.div
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="wm-eyebrow"><span className="wm-eyebrow-line" /> FAQ <span className="wm-eyebrow-line" /></span>
              <h2 className="wm-display wm-section-title">Quick Answers</h2>
              <p className="wm-section-sub" style={{ margin: "12px auto 0" }}>Quick answers to the things our guests ask most.</p>
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
              style={{ textAlign: "center", marginTop: 52 }}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/faq" className="wm-story__link" style={{ display: "inline-flex" }}>
                See all FAQs <ArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ════════════════ CTA BANNER ════════════════ */}
        <div className="wm-cta-banner">
          <div className="wm-section">
            <motion.div
              className="wm-cta-banner__box"
              initial={{ opacity: 0, y: 48, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.008, transition: { duration: 0.35 } }}
            >
              <div>
                <h3 className="wm-cta-banner__title">Ready to order?</h3>
                <p className="wm-cta-banner__sub">
                  Pick your location, place your order, and we'll have it ready when you arrive.
                </p>
              </div>
              <div className="wm-cta-banner__btns">
                <Link to="/order"     className="wm-btn-dark">Order Now <ArrowRight style={{ width: 14, height: 14 }} /></Link>
                <Link to="/locations" className="wm-btn-light">Find a Location</Link>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </>
  );
}