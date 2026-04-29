import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useInView,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight, Pizza, Drumstick, Sandwich, Salad,
  Star, Phone, Clock, Sparkles, MapPin, ChevronDown, Plus, Minus,
  Award, Users, TrendingUp, Heart,
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
  { icon: Clock,    title: "Fast Service",  desc: "In and out in minutes — because your time matters as much as your appetite." },
  { icon: Award,    title: "Affordable",    desc: "Generous portions and prices that respect your wallet, every single visit." },
  { icon: Heart,    title: "Community",     desc: "Three locations. Three towns. One Maryland family since 2010." },
];

const FEATURED = [
  { icon: Pizza,     name: "Hand-Stretched Pizza",  price: "from $12.99", img: heroPizza,   tag: "Most Popular"  },
  { icon: Drumstick, name: "Famous Fried Chicken",  price: "from $6.99",  img: heroChicken, tag: "Fan Favorite"  },
  { icon: Sandwich,  name: "Hot Subs & Steaks",     price: "from $11.99", img: heroSub,     tag: "House Special" },
  { icon: Salad,     name: "Fresh Salads",           price: "from $9.99",  img: heroSalad,   tag: "Chef's Pick"   },
];

const STATS = [
  { num: "3",    suffix: "",  label: "Locations"    },
  { num: "15",   suffix: "+", label: "Years Serving" },
  { num: "50",   suffix: "+", label: "Menu Items"   },
  { num: "4.8",  suffix: "★", label: "Avg. Rating"  },
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

function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start * 10) / 10);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

/* ─────────────────────────────── components ─────────────────────────── */

function TiltCard({ children, className, strength }: { children: React.ReactNode; className?: string; strength?: number }) {
  const { rotateX, rotateY, scale, onMove, onLeave } = useTilt(strength ?? 10);
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

function StatItem({ num, suffix, label, index }: { num: string; suffix: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const numericVal = parseFloat(num);
  const count = useCountUp(numericVal, inView, 1800);
  const displayVal = Number.isInteger(numericVal) ? Math.round(count) : count.toFixed(1);

  return (
    <motion.div
      ref={ref}
      className="wm-stat"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="wm-stat__num">
        {displayVal}{suffix}
      </div>
      <div className="wm-stat__label">{label}</div>
    </motion.div>
  );
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={`wm-faq-item${open ? " wm-faq-item--open" : ""}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <button className="wm-faq-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="wm-faq-q">{q}</span>
        <motion.span
          className="wm-faq-icon"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Plus style={{ width: 14, height: 14 }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="wm-faq-a-inner">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HeroParticles() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: i % 5 === 0 ? 4 : i % 3 === 0 ? 2 : 1.5,
            height: i % 5 === 0 ? 4 : i % 3 === 0 ? 2 : 1.5,
            borderRadius: "50%",
            background: i % 5 === 0 ? "rgba(217,119,6,0.7)" : i % 3 === 0 ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.12)",
            left: `${4 + (i * 4.1) % 92}%`,
            top: `${8 + (i * 6.7) % 84}%`,
          }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.9, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 3.5 + (i % 5) * 0.8, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="wm-divider">
      <div className="wm-divider__line" />
      <div className="wm-divider__dot" />
      <div className="wm-divider__line" />
    </div>
  );
}

/* ─────────────────────────────── page ─────────────────────────────── */

function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,600;1,600&display=swap');

        /* ── CSS variables ── */
        :root {
          --amber:     #E8920A;
          --amber-lt:  #F5A623;
          --amber-dk:  #C4780A;
          --amber-glow: rgba(232,146,10,0.22);
          --bg:        #080706;
          --bg-2:      #0D0C0A;
          --bg-3:      #111009;
          --bg-card:   #151310;
          --border:    rgba(255,255,255,0.07);
          --border-hover: rgba(232,146,10,0.35);
          --text:      #FFFFFF;
          --text-2:    rgba(255,255,255,0.65);
          --text-3:    rgba(255,255,255,0.38);
          --text-4:    rgba(255,255,255,0.18);
          --radius-sm: 8px;
          --radius-md: 14px;
          --radius-lg: 20px;
          --radius-xl: 28px;
          --shadow-card: 0 4px 24px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3);
          --shadow-hover: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,146,10,0.15);
          --shadow-amber: 0 12px 40px rgba(232,146,10,0.3);
          --transition: 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── reset & globals ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .wm-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .wm-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media(max-width:768px){ .wm-container { padding: 0 20px; } }

        /* ── scrollbar ── */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--amber-dk); border-radius: 99px; }

        /* ── typography tokens ── */
        .wm-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--amber);
        }
        .wm-eyebrow::before,
        .wm-eyebrow::after {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: currentColor;
          opacity: 0.5;
        }
        .wm-display {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.02em;
        }
        .wm-display-italic {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-weight: 800;
          font-style: italic;
          line-height: 1.0;
          letter-spacing: -0.01em;
        }
        .wm-section-title {
          font-size: clamp(38px, 4.5vw, 58px);
          margin-top: 12px;
          color: var(--text);
        }
        .wm-section-sub {
          font-size: 14px;
          font-weight: 400;
          color: var(--text-3);
          line-height: 1.7;
          margin-top: 12px;
          max-width: 480px;
        }
        .wm-accent { color: var(--amber); }

        /* ── shimmer animation ── */
        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        .wm-shimmer {
          background: linear-gradient(
            92deg,
            var(--amber-dk) 0%,
            var(--amber-lt) 30%,
            #FBBF24 50%,
            var(--amber-lt) 70%,
            var(--amber-dk) 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: shimmer 5s linear infinite;
        }

        /* ── buttons ── */
        .wm-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
          border: none;
          cursor: pointer;
          text-decoration: none;
          border-radius: var(--radius-sm);
          transition: var(--transition);
          white-space: nowrap;
        }
        .wm-btn svg { flex-shrink: 0; transition: transform var(--transition); }
        .wm-btn:hover svg { transform: translateX(3px); }

        .wm-btn--primary {
          padding: 13px 28px;
          background: var(--amber);
          color: #fff;
        }
        .wm-btn--primary:hover {
          background: var(--amber-dk);
          transform: translateY(-2px);
          box-shadow: var(--shadow-amber);
        }

        .wm-btn--ghost {
          padding: 13px 28px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.75);
          border: 1px solid var(--border);
        }
        .wm-btn--ghost:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
          color: #fff;
          transform: translateY(-2px);
        }

        .wm-btn--dark {
          padding: 13px 28px;
          background: rgba(0,0,0,0.35);
          color: #fff;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .wm-btn--dark:hover {
          background: rgba(0,0,0,0.55);
          transform: translateY(-2px);
        }

        .wm-btn--white-ghost {
          padding: 13px 28px;
          background: rgba(255,255,255,0.12);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
        }
        .wm-btn--white-ghost:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .wm-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--amber);
          text-decoration: none;
          transition: gap var(--transition);
        }
        .wm-link:hover { gap: 10px; }
        .wm-link svg { width: 13px; height: 13px; }

        /* ── divider ── */
        .wm-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 32px;
          max-width: 1240px;
          margin: 0 auto;
        }
        .wm-divider__line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }
        .wm-divider__dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--amber);
          opacity: 0.6;
        }

        /* ═══════════════════════════════════════
           HERO
        ═══════════════════════════════════════ */
        .wm-hero {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: var(--bg);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .wm-hero__bg {
          position: absolute;
          inset: -12%;
          background-size: cover;
          background-position: center;
          will-change: transform;
        }
        .wm-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            rgba(8,7,6,0.97) 0%,
            rgba(8,7,6,0.88) 42%,
            rgba(8,7,6,0.6) 68%,
            rgba(8,7,6,0.3) 100%
          );
        }
        /* subtle vignette */
        .wm-hero__overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 70% 50%, transparent 0%, rgba(8,7,6,0.35) 100%);
        }

        /* thin amber line at top */
        .wm-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--amber), transparent);
          z-index: 10;
        }

        .wm-hero__inner {
          position: relative;
          z-index: 2;
          max-width: 1240px;
          margin: 0 auto;
          padding: 130px 32px 90px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
          align-items: center;
        }
        @media(min-width:1080px) {
          .wm-hero__inner { grid-template-columns: 52% 1fr; padding: 150px 32px 110px; }
        }

        .wm-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px 6px 10px;
          background: rgba(232,146,10,0.1);
          border: 1px solid rgba(232,146,10,0.25);
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
          color: var(--amber);
          letter-spacing: 0.06em;
        }
        .wm-hero__badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--amber);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .wm-hero__title {
          font-size: clamp(54px, 7.5vw, 102px);
          margin-top: 22px;
          color: var(--text);
          line-height: 0.97;
        }
        .wm-hero__subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 2vw, 24px);
          font-style: italic;
          color: var(--text-3);
          margin-top: 6px;
        }
        .wm-hero__body {
          font-size: 15px;
          font-weight: 400;
          color: var(--text-3);
          line-height: 1.75;
          margin-top: 20px;
          max-width: 430px;
        }
        .wm-hero__ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 36px;
        }
        .wm-hero__trust {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 32px;
          padding-top: 28px;
          border-top: 1px solid var(--border);
        }
        .wm-hero__trust-stars {
          display: flex;
          gap: 2px;
          color: var(--amber);
        }
        .wm-hero__trust-stars svg { width: 13px; height: 13px; fill: currentColor; }
        .wm-hero__trust-text {
          font-size: 12px;
          color: var(--text-3);
        }
        .wm-hero__trust-text strong {
          color: var(--text-2);
          font-weight: 600;
        }
        .wm-hero__trust-sep {
          width: 1px; height: 24px;
          background: var(--border);
        }

        /* right column food cards */
        .wm-hero__cards {
          display: none;
        }
        @media(min-width:1080px) {
          .wm-hero__cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            position: relative;
          }
        }

        .wm-food-card {
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-card);
          border: 1px solid var(--border);
          transition: border-color var(--transition), box-shadow var(--transition);
        }
        .wm-food-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-hover);
        }
        .wm-food-card__img {
          position: relative;
          height: 170px;
          overflow: hidden;
        }
        .wm-food-card__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s ease;
        }
        .wm-food-card:hover .wm-food-card__img img { transform: scale(1.08); }
        .wm-food-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,7,6,0.7) 0%, transparent 55%);
        }
        .wm-food-card__body {
          padding: 12px 14px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .wm-food-card__name {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.82);
        }
        .wm-food-card__price {
          font-size: 11px;
          font-weight: 600;
          color: var(--amber);
          background: rgba(232,146,10,0.1);
          padding: 3px 8px;
          border-radius: 4px;
        }

        /* scroll hint */
        .wm-scroll-hint {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .wm-scroll-hint__text {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-4);
          font-weight: 600;
        }
        .wm-scroll-hint__line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--amber), transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%,100% { opacity: 0.3; transform: scaleY(1) translateY(0); }
          50% { opacity: 0.8; transform: scaleY(0.8) translateY(4px); }
        }

        /* ═══════════════════════════════════════
           STATS BAR
        ═══════════════════════════════════════ */
        .wm-stats {
          background: linear-gradient(90deg, var(--amber-dk) 0%, var(--amber) 50%, var(--amber-dk) 100%);
          position: relative;
          overflow: hidden;
        }
        .wm-stats::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='none' stroke='rgba(0,0,0,0.04)' stroke-width='1'/%3E%3C/svg%3E");
        }
        .wm-stats__inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: repeat(2,1fr);
          position: relative;
        }
        @media(min-width:640px){ .wm-stats__inner { grid-template-columns: repeat(4,1fr); } }

        .wm-stat {
          padding: 26px 20px;
          text-align: center;
          border-right: 1px solid rgba(0,0,0,0.1);
          position: relative;
        }
        .wm-stat:last-child { border-right: none; }
        @media(max-width:639px) {
          .wm-stat:nth-child(2) { border-right: none; }
          .wm-stat:nth-child(1), .wm-stat:nth-child(2) { border-bottom: 1px solid rgba(0,0,0,0.1); }
        }
        .wm-stat__num {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        @media(max-width:639px) { .wm-stat__num { font-size: 28px; } }
        .wm-stat__label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.72);
          margin-top: 5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ═══════════════════════════════════════
           VALUES
        ═══════════════════════════════════════ */
        .wm-values {
          padding: 96px 0;
          background: var(--bg);
        }
        .wm-values__header { text-align: center; }
        .wm-values__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          margin-top: 52px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        @media(min-width:1024px) {
          .wm-values__grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media(max-width:479px) {
          .wm-values__grid { grid-template-columns: 1fr; }
        }

        .wm-value {
          padding: 40px 32px;
          background: var(--bg-2);
          position: relative;
          overflow: hidden;
          transition: background var(--transition);
        }
        .wm-value::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--amber), transparent);
          transform: scaleX(0);
          transition: transform var(--transition);
        }
        .wm-value:hover { background: var(--bg-card); }
        .wm-value:hover::after { transform: scaleX(1); }

        .wm-value__number {
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-4);
          letter-spacing: 0.15em;
          margin-bottom: 20px;
        }
        .wm-value__icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(232,146,10,0.1);
          color: var(--amber);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
        }
        .wm-value:hover .wm-value__icon {
          background: var(--amber);
          color: #fff;
          transform: scale(1.1) rotate(-6deg);
          box-shadow: var(--shadow-amber);
        }
        .wm-value__icon svg { width: 20px; height: 20px; }
        .wm-value__title {
          font-family: 'Playfair Display', serif;
          font-size: 21px;
          font-weight: 700;
          color: var(--text);
          margin-top: 20px;
          line-height: 1.2;
        }
        .wm-value__desc {
          font-size: 13px;
          font-weight: 400;
          color: var(--text-3);
          margin-top: 10px;
          line-height: 1.7;
        }

        /* ═══════════════════════════════════════
           LOCATIONS
        ═══════════════════════════════════════ */
        .wm-locations {
          padding: 96px 0;
          background: var(--bg-2);
          position: relative;
        }
        .wm-locations::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }
        .wm-locations::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }
        .wm-locations__header { text-align: center; }
        .wm-locations__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          margin-top: 52px;
        }
        @media(min-width:768px) {
          .wm-locations__grid { grid-template-columns: repeat(3, 1fr); }
        }

        .wm-loc-card {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--bg-card);
          padding: 36px 30px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          min-height: 320px;
          transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
        }
        .wm-loc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(232,146,10,0.06) 0%, transparent 55%);
          opacity: 0;
          transition: opacity var(--transition);
        }
        .wm-loc-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-hover);
          transform: translateY(-4px);
        }
        .wm-loc-card:hover::before { opacity: 1; }

        .wm-loc-card__index {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--text-4);
          text-transform: uppercase;
        }
        .wm-loc-card__name {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 800;
          color: var(--text);
          margin-top: 14px;
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .wm-loc-card__tagline {
          font-size: 13px;
          color: var(--text-3);
          margin-top: 10px;
          line-height: 1.6;
          flex: 1;
        }
        .wm-loc-card__tag {
          display: inline-block;
          margin-top: 22px;
          padding: 4px 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--amber);
          border: 1px solid rgba(232,146,10,0.3);
          border-radius: 4px;
          background: rgba(232,146,10,0.07);
        }
        .wm-loc-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }
        .wm-loc-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--amber);
          letter-spacing: 0.02em;
          transition: gap var(--transition);
        }
        .wm-loc-card:hover .wm-loc-card__cta { gap: 10px; }
        .wm-loc-card__cta svg { width: 13px; height: 13px; }
        .wm-loc-card__phone {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-3);
          text-decoration: none;
          transition: color var(--transition);
        }
        .wm-loc-card__phone:hover { color: var(--text-2); }
        .wm-loc-card__phone svg { width: 11px; height: 11px; }

        /* ═══════════════════════════════════════
           FEATURED
        ═══════════════════════════════════════ */
        .wm-featured { padding: 96px 0; background: var(--bg); }
        .wm-featured__header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }
        @media(max-width:479px) {
          .wm-featured__header { flex-direction: column; align-items: flex-start; }
        }
        .wm-featured__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 48px;
        }
        @media(min-width:1024px) {
          .wm-featured__grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media(max-width:479px) {
          .wm-featured__grid { grid-template-columns: 1fr; }
        }

        .wm-feat-card {
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--bg-card);
          transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
        }
        .wm-feat-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-hover);
          transform: translateY(-3px);
        }
        .wm-feat-card__img {
          position: relative;
          aspect-ratio: 3/2;
          overflow: hidden;
        }
        .wm-feat-card__img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s ease;
        }
        .wm-feat-card:hover .wm-feat-card__img img { transform: scale(1.08); }
        .wm-feat-card__tag {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 4px 9px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(232,146,10,0.85);
          backdrop-filter: blur(6px);
          border-radius: 4px;
        }
        .wm-feat-card__icon-wrap {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 38px; height: 38px;
          border-radius: 9px;
          background: rgba(8,7,6,0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          transition: transform var(--transition), background var(--transition);
        }
        .wm-feat-card:hover .wm-feat-card__icon-wrap {
          background: var(--amber);
          transform: scale(1.1) rotate(-8deg);
        }
        .wm-feat-card__icon-wrap svg { width: 16px; height: 16px; }
        .wm-feat-card__body { padding: 16px; }
        .wm-feat-card__name {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 700;
          color: rgba(255,255,255,0.88);
          line-height: 1.25;
        }
        .wm-feat-card__price {
          font-size: 12px;
          font-weight: 600;
          color: var(--amber);
          margin-top: 6px;
        }

        /* ═══════════════════════════════════════
           STORY
        ═══════════════════════════════════════ */
        .wm-story {
          padding: 96px 0;
          background: var(--bg-2);
          position: relative;
        }
        .wm-story::before, .wm-story::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }
        .wm-story::before { top: 0; }
        .wm-story::after  { bottom: 0; }

        .wm-story__inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
          align-items: center;
        }
        @media(min-width:1024px) {
          .wm-story__inner { grid-template-columns: 1fr 1fr; }
        }
        .wm-story__body {
          font-size: 15px;
          font-weight: 400;
          color: var(--text-3);
          line-height: 1.8;
          margin-top: 18px;
        }
        .wm-story__body + .wm-story__body { margin-top: 14px; }
        .wm-story__img-wrap {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          aspect-ratio: 4/3;
          border: 1px solid var(--border);
        }
        .wm-story__img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s ease;
        }
        .wm-story__img-wrap:hover img { transform: scale(1.04); }
        .wm-story__caption {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 28px 24px 22px;
          background: linear-gradient(to top, rgba(8,7,6,0.92) 0%, transparent 100%);
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-style: italic;
          font-weight: 600;
          color: #fff;
          line-height: 1.35;
        }

        /* floating badge overlay */
        .wm-story__img-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 10px 16px;
          background: rgba(8,7,6,0.72);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.04em;
        }
        .wm-story__img-badge strong {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--amber);
          line-height: 1;
          margin-bottom: 2px;
        }

        /* ═══════════════════════════════════════
           TESTIMONIALS
        ═══════════════════════════════════════ */
        .wm-testimonials {
          padding: 96px 0;
          background: var(--bg);
        }
        .wm-testimonials__header { text-align: center; }
        .wm-testimonials__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 52px;
        }
        @media(min-width:768px) {
          .wm-testimonials__grid { grid-template-columns: repeat(3, 1fr); }
        }

        .wm-review {
          padding: 30px;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 1px solid var(--border);
          transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
          position: relative;
          overflow: hidden;
        }
        .wm-review::before {
          content: '"';
          position: absolute;
          top: -8px;
          right: 20px;
          font-family: 'Playfair Display', serif;
          font-size: 80px;
          color: var(--amber);
          opacity: 0.07;
          line-height: 1;
          pointer-events: none;
        }
        .wm-review:hover {
          border-color: rgba(232,146,10,0.2);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
          transform: translateY(-3px);
        }
        .wm-review__stars {
          display: flex;
          gap: 2px;
          color: var(--amber);
        }
        .wm-review__stars svg { width: 13px; height: 13px; fill: currentColor; }
        .wm-review__quote {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          margin-top: 16px;
          line-height: 1.5;
        }
        .wm-review__author {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-3);
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ═══════════════════════════════════════
           FAQ
        ═══════════════════════════════════════ */
        .wm-faq {
          padding: 96px 0;
          background: var(--bg-2);
          position: relative;
        }
        .wm-faq::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }
        .wm-faq__header { text-align: center; }
        .wm-faq__cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          margin-top: 52px;
        }
        @media(min-width:768px) {
          .wm-faq__cols { grid-template-columns: 1fr 1fr; gap: 0 48px; }
        }

        .wm-faq-item {
          border-bottom: 1px solid var(--border);
          overflow: hidden;
          transition: border-color var(--transition);
        }
        .wm-faq-item--open {
          border-color: rgba(232,146,10,0.2);
        }
        .wm-faq-btn {
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          text-align: left;
        }
        .wm-faq-q {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-2);
          line-height: 1.55;
          transition: color var(--transition);
        }
        .wm-faq-btn:hover .wm-faq-q { color: var(--text); }
        .wm-faq-item--open .wm-faq-q { color: var(--text); }

        .wm-faq-icon {
          flex-shrink: 0;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(232,146,10,0.1);
          color: var(--amber);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition);
        }
        .wm-faq-btn:hover .wm-faq-icon,
        .wm-faq-item--open .wm-faq-icon {
          background: var(--amber);
          color: #fff;
        }
        .wm-faq-a-inner {
          padding: 0 0 18px;
          font-size: 13px;
          font-weight: 400;
          color: var(--text-3);
          line-height: 1.75;
        }

        .wm-faq__footer {
          text-align: center;
          margin-top: 48px;
        }

        /* ═══════════════════════════════════════
           CTA BANNER
        ═══════════════════════════════════════ */
        .wm-cta {
          padding: 48px 0 96px;
          background: var(--bg);
        }
        .wm-cta__box {
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: linear-gradient(115deg, var(--amber-dk) 0%, var(--amber) 55%, var(--amber-lt) 100%);
          padding: 64px 52px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: center;
          position: relative;
        }
        @media(min-width:768px) {
          .wm-cta__box { grid-template-columns: 1fr auto; padding: 64px 60px; }
        }
        @media(max-width:479px) {
          .wm-cta__box { padding: 40px 28px; border-radius: var(--radius-lg); }
        }

        /* dot pattern overlay */
        .wm-cta__box::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        /* glow orb */
        .wm-cta__box::after {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          filter: blur(60px);
          pointer-events: none;
        }

        .wm-cta__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(34px, 4vw, 52px);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          position: relative;
        }
        .wm-cta__sub {
          font-size: 15px;
          color: rgba(255,255,255,0.8);
          margin-top: 10px;
          line-height: 1.65;
          position: relative;
          max-width: 420px;
        }
        .wm-cta__btns {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          position: relative;
        }
        @media(max-width:479px) {
          .wm-cta__btns { flex-direction: column; }
          .wm-btn--dark, .wm-btn--white-ghost { justify-content: center; }
        }

        /* ═══════════════════════════════════════
           MISC MOBILE POLISH
        ═══════════════════════════════════════ */
        @media(max-width:479px) {
          .wm-hero__inner { padding: 100px 20px 56px; }
          .wm-hero__ctas { flex-direction: column; }
          .wm-btn--primary, .wm-btn--ghost { justify-content: center; width: 100%; }
          .wm-values { padding: 64px 0; }
          .wm-locations { padding: 64px 0; }
          .wm-featured { padding: 64px 0; }
          .wm-story { padding: 64px 0; }
          .wm-testimonials { padding: 64px 0; }
          .wm-faq { padding: 64px 0; }
          .wm-cta { padding: 32px 0 64px; }
          .wm-loc-card { padding: 28px 22px; min-height: auto; }
          .wm-loc-card__name { font-size: 28px; }
        }

        @media(hover:none) {
          .wm-btn--primary:hover,
          .wm-btn--ghost:hover,
          .wm-btn--dark:hover,
          .wm-btn--white-ghost:hover { transform: none; }
          .wm-loc-card:hover,
          .wm-feat-card:hover,
          .wm-review:hover { transform: none; }
        }

        /* focus */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid var(--amber);
          outline-offset: 3px;
          border-radius: 4px;
        }
      `}</style>

      <div className="wm-page">

        {/* ════════════════ HERO ════════════════ */}
        <section className="wm-hero" ref={heroRef}>
          <motion.div
            className="wm-hero__bg"
            style={{
              backgroundImage: `url(${heroSlide})`,
              y: bgY,
              opacity: bgOpacity,
              scale: bgScale,
            }}
          />
          <div className="wm-hero__overlay" />
          <HeroParticles />

          <div className="wm-hero__inner">
            {/* LEFT ──────────────── */}
            <motion.div style={{ y: textY }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="wm-hero__badge">
                  <span className="wm-hero__badge-dot" />
                  Maryland Tradition Since {SITE.established}
                </div>
              </motion.div>

              <motion.h1
                className="wm-display wm-hero__title"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.22,1,0.36,1] }}
              >
                Come Hungry.<br />
                <span className="wm-display-italic wm-shimmer">Leave Happy.</span>
              </motion.h1>

              <motion.p
                className="wm-hero__subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Three locations. One Maryland family.
              </motion.p>

              <motion.p
                className="wm-hero__body"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38 }}
              >
                Fresh pizza, famous fried chicken, hearty subs, and crisp salads — prepared in-house every day across our three Maryland kitchens.
              </motion.p>

              <motion.div
                className="wm-hero__ctas"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.5 }}
              >
                <Link to="/order" className="wm-btn wm-btn--primary">
                  Order Now <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/locations" className="wm-btn wm-btn--ghost">
                  Explore Menus
                </Link>
              </motion.div>

              <motion.div
                className="wm-hero__trust"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.65 }}
              >
                <div className="wm-hero__trust-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <div className="wm-hero__trust-text">
                  <strong>4.8 / 5</strong> across 1,200+ reviews
                </div>
                <div className="wm-hero__trust-sep" />
                <div className="wm-hero__trust-text">
                  <strong>15+ years</strong> serving Maryland
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT — food cards ─── */}
            <div className="wm-hero__cards">
              {[
                { img: heroPizza,   name: "Hand-Stretched Pizza",  price: "from $12.99", delay: 0.55, offset: 0   },
                { img: heroChicken, name: "Famous Fried Chicken",  price: "from $6.99",  delay: 0.68, offset: 28  },
                { img: heroSub,     name: "Hot Subs & Steaks",     price: "from $11.99", delay: 0.81, offset: 0   },
                { img: heroSalad,   name: "Fresh Salads",          price: "from $9.99",  delay: 0.94, offset: 28  },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="wm-food-card"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: item.offset, scale: 1 }}
                  transition={{ duration: 0.8, delay: item.delay, ease: [0.22,1,0.36,1] }}
                  whileHover={{
                    y: item.offset - 6,
                    scale: 1.03,
                    transition: { duration: 0.25 },
                  }}
                >
                  <div className="wm-food-card__img">
                    <img src={item.img} alt={item.name} loading={i > 1 ? "lazy" : undefined} />
                    <div className="wm-food-card__overlay" />
                  </div>
                  <div className="wm-food-card__body">
                    <span className="wm-food-card__name">{item.name}</span>
                    <span className="wm-food-card__price">{item.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="wm-scroll-hint">
            <span className="wm-scroll-hint__text">scroll</span>
            <div className="wm-scroll-hint__line" />
          </div>
        </section>

        {/* ════════════════ STATS ════════════════ */}
        <motion.div
          className="wm-stats"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="wm-stats__inner">
            {STATS.map((s, i) => (
              <StatItem key={s.label} num={s.num} suffix={s.suffix} label={s.label} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ════════════════ VALUES ════════════════ */}
        <section className="wm-values">
          <div className="wm-container">
            <div className="wm-values__header">
              <span className="wm-eyebrow">Why Wise Mart</span>
              <h2 className="wm-display wm-section-title">Our Promise to You</h2>
              <p className="wm-section-sub" style={{ margin: "12px auto 0" }}>
                Every meal, every visit — the same commitment to quality, speed, and community.
              </p>
            </div>
            <div className="wm-values__grid">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  className="wm-value"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
                >
                  <div className="wm-value__number">0{i+1}</div>
                  <div className="wm-value__icon"><v.icon /></div>
                  <div className="wm-value__title">{v.title}</div>
                  <div className="wm-value__desc">{v.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ════════════════ LOCATIONS ════════════════ */}
        <section className="wm-locations">
          <div className="wm-container">
            <div className="wm-locations__header">
              <span className="wm-eyebrow">Three Locations</span>
              <h2 className="wm-display wm-section-title">Pick Your Wise Mart</h2>
              <p className="wm-section-sub" style={{ margin: "12px auto 0" }}>
                Each kitchen with its own character — same Wise Mart promise everywhere.
              </p>
            </div>
            <div className="wm-locations__grid">
              {LOCATIONS.map((loc, i) => (
                <motion.div
                  key={loc.slug}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22,1,0.36,1] }}
                >
                  <TiltCard strength={6}>
                    <Link to="/locations" className="wm-loc-card">
                      <div className="wm-loc-card__index">0{i + 1} — Maryland</div>
                      <div className="wm-loc-card__name">{loc.name}</div>
                      <div className="wm-loc-card__tagline">{loc.tagline}</div>
                      <div className="wm-loc-card__tag">{loc.specialty}</div>
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
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ════════════════ FEATURED ════════════════ */}
        <section className="wm-featured">
          <div className="wm-container">
            <div className="wm-featured__header">
              <div>
                <span className="wm-eyebrow">Our Menu</span>
                <h2 className="wm-display wm-section-title">What We're Known For</h2>
              </div>
              <Link to="/locations" className="wm-link" style={{ marginBottom: 8 }}>
                See all menus <ArrowRight />
              </Link>
            </div>
            <div className="wm-featured__grid">
              {FEATURED.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 36, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
                >
                  <TiltCard className="wm-feat-card" strength={7}>
                    <div className="wm-feat-card__img">
                      <img src={f.img} alt={f.name} loading="lazy" />
                      <div className="wm-feat-card__tag">{f.tag}</div>
                      <div className="wm-feat-card__icon-wrap"><f.icon /></div>
                    </div>
                    <div className="wm-feat-card__body">
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
          <div className="wm-container">
            <div className="wm-story__inner">
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
              >
                <span className="wm-eyebrow">Our Story</span>
                <h2 className="wm-display wm-section-title">
                  More than a meal —<br />
                  <span className="wm-display-italic wm-accent">a Maryland tradition.</span>
                </h2>
                <p className="wm-story__body">
                  Wise Mart opened its doors in {SITE.established} with one simple idea: serve good food, fast, at a fair price — and treat every guest like family.
                </p>
                <p className="wm-story__body">
                  Three locations later, that idea hasn't changed. From the pizza ovens in Sharptown to the breakfast counters in Vienna, every plate carries the same care.
                </p>
                <Link to="/about" className="wm-link" style={{ marginTop: 28, display: "inline-flex" }}>
                  Read our full story <ArrowRight />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 32, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22,1,0.36,1] }}
              >
                <div className="wm-story__img-wrap">
                  <img src={heroPizza} alt="Hand-stretched pizza at Wise Mart" loading="lazy" />
                  <div className="wm-story__img-badge">
                    <strong>2010</strong>
                    Est. in Maryland
                  </div>
                  <div className="wm-story__caption">Made by hand. Served with pride.</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════ TESTIMONIALS ════════════════ */}
        <section className="wm-testimonials">
          <div className="wm-container">
            <div className="wm-testimonials__header">
              <span className="wm-eyebrow">Guest Reviews</span>
              <h2 className="wm-display wm-section-title">What Our Guests Say</h2>
              <p className="wm-section-sub" style={{ margin: "12px auto 0" }}>
                Real words from real neighbors, regulars, and first-timers.
              </p>
            </div>
            <div className="wm-testimonials__grid">
              {[
                { quote: "Best fried chicken on the Eastern Shore. We've tried them all — nothing comes close.",           author: "Marcus T.",   location: "Sharptown"     },
                { quote: "The breakfast pizza is an absolute game changer. We make the drive from Salisbury every weekend.", author: "Sarah & Jim", location: "Vienna"         },
                { quote: "Cheesesteak subs that actually taste like home. Order one and you'll understand.",                author: "Dee R.",       location: "East New Market" },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22,1,0.36,1] }}
                >
                  <TiltCard className="wm-review" strength={5}>
                    <div className="wm-review__stars">
                      {Array.from({ length: 5 }).map((_, j) => <Star key={j} />)}
                    </div>
                    <div className="wm-review__quote">"{t.quote}"</div>
                    <div className="wm-review__author">{t.author} · {t.location}</div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ════════════════ FAQ ════════════════ */}
        <section className="wm-faq">
          <div className="wm-container">
            <div className="wm-faq__header">
              <span className="wm-eyebrow">FAQ</span>
              <h2 className="wm-display wm-section-title">Quick Answers</h2>
              <p className="wm-section-sub" style={{ margin: "12px auto 0" }}>
                Everything you need to know before your next visit.
              </p>
            </div>
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
            <div className="wm-faq__footer">
              <Link to="/faq" className="wm-link" style={{ display: "inline-flex" }}>
                See all FAQs <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════ CTA ════════════════ */}
        <div className="wm-cta">
          <div className="wm-container">
            <motion.div
              className="wm-cta__box"
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22,1,0.36,1] }}
              whileHover={{ scale: 1.01, transition: { duration: 0.25 } }}
            >
              <div>
                <h3 className="wm-cta__title">Ready to order?</h3>
                <p className="wm-cta__sub">
                  Pick your location, place your order, and we'll have it ready when you arrive.
                </p>
              </div>
              <div className="wm-cta__btns">
                <Link to="/order"     className="wm-btn wm-btn--dark">
                  Order Now <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
                <Link to="/locations" className="wm-btn wm-btn--white-ghost">
                  Find a Location
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </>
  );
}