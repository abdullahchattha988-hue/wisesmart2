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
  { icon: Sparkles, title: "Fresh Daily",   desc: "Dough, sauces, and produce prepared in-house every morning." },
  { icon: Clock,    title: "Fast Service",  desc: "In and out in minutes — no compromise on quality." },
  { icon: Star,     title: "Affordable",    desc: "Generous portions and prices that respect your wallet." },
  { icon: Pizza,    title: "Community",     desc: "Three locations. Three towns. One Maryland family." },
];

const FEATURED = [
  { icon: Pizza,     name: "Hand-Stretched Pizza",  price: "from $12.99", img: heroPizza   },
  { icon: Drumstick, name: "Famous Fried Chicken",  price: "from $6.99",  img: heroChicken },
  { icon: Sandwich,  name: "Hot Subs & Steaks",     price: "from $11.99", img: heroSub     },
  { icon: Salad,     name: "Fresh Salads",           price: "from $9.99",  img: heroSalad   },
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

function FloatBadge({ children, delay = 0, x = 0, y = 0 }: { children: React.ReactNode; delay?: number; x?: number; y?: number }) {
  return (
    <motion.div
      style={{ position: "absolute", x, y }}
      animate={{ y: [y, y - 12, y], rotate: [-1, 1, -1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <button className="wm-faq-btn" onClick={() => setOpen(!open)}>
        <span className="wm-faq-q">{q}</span>
        <motion.span
          className="wm-faq-icon"
          animate={{ rotate: open ? 45 : 0, scale: open ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Plus style={{ width: 16, height: 16 }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="wm-faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
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
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            borderRadius: "50%",
            background: i % 4 === 0 ? "#d97706" : "rgba(255,255,255,0.15)",
            left: `${5 + (i * 5.3) % 90}%`,
            top: `${10 + (i * 7.7) % 80}%`,
          }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
          transition={{ duration: 3 + (i % 4), delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────── page ─────────────────────────────── */

function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const statsRef  = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── globals ── */
        *, *::before, *::after { box-sizing: border-box; }
        .wm-page { font-family: 'DM Sans', sans-serif; background: #0a0908; color: #fff; }
        .wm-section { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
        @media(min-width:768px){ .wm-section { padding: 0 40px; } }

        /* ── typography helpers ── */
        .wm-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #d97706;
        }
        .wm-eyebrow::before, .wm-eyebrow::after {
          content: ''; display: inline-block;
          width: 28px; height: 1px; background: #d97706; opacity: 0.5;
        }
        .wm-display {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 700; line-height: 1.0; letter-spacing: -0.01em;
        }
        .wm-accent { color: #d97706; }
        .wm-section-title { font-size: clamp(36px, 4vw, 54px); margin-top: 14px; color: #fff; }
        .wm-section-sub   { font-size: 14px; color: rgba(255,255,255,0.38); margin-top: 10px; max-width: 520px; }

        /* ── HERO ── */
        .wm-hero {
          position: relative; min-height: 100vh;
          overflow: hidden; background: #0a0908;
          display: flex; flex-direction: column; justify-content: center;
        }
        .wm-hero__bg {
          position: absolute; inset: -10%;
          background-size: cover; background-position: center;
          will-change: transform;
        }
        .wm-hero__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            120deg,
            rgba(10,9,8,0.97) 0%,
            rgba(10,9,8,0.85) 45%,
            rgba(10,9,8,0.55) 70%,
            rgba(10,9,8,0.38) 100%
          );
        }
        .wm-hero__inner {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto;
          padding: 120px 28px 80px;
          display: grid; grid-template-columns: 1fr;
          gap: 48px; align-items: center;
        }
        @media(min-width:1024px){
          .wm-hero__inner { grid-template-columns: 1fr 1fr; padding: 140px 40px 100px; }
        }
        .wm-hero__title { font-size: clamp(52px, 7vw, 96px); margin-top: 20px; color: #fff; }
        .wm-hero__sub   { font-size: 16px; color: rgba(255,255,255,0.52); line-height: 1.75; margin-top: 20px; max-width: 460px; }
        .wm-hero__ctas  { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 36px; }

        .wm-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; background: #d97706; color: #fff;
          font-size: 14px; font-weight: 600; border-radius: 6px;
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.02em;
        }
        .wm-btn-primary:hover {
          background: #b45309; transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(217,119,6,0.35);
        }
        .wm-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; background: transparent;
          border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8);
          font-size: 14px; font-weight: 500; border-radius: 6px;
          text-decoration: none; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s;
        }
        .wm-btn-outline:hover {
          border-color: rgba(255,255,255,0.6); color: #fff;
          background: rgba(255,255,255,0.06); transform: translateY(-3px);
        }

        /* hero floating cards */
        .wm-hero__cards { display: none; }
        @media(min-width:1024px){
          .wm-hero__cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        }
        .wm-food-card {
          border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(10px);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .wm-food-card:hover {
          border-color: rgba(217,119,6,0.35);
          box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(217,119,6,0.15);
        }
        .wm-food-card img { width: 100%; height: 200px; object-fit: cover; display: block; transition: transform 0.7s ease; }
        .wm-food-card:hover img { transform: scale(1.08); }
        .wm-food-card__body { padding: 14px 16px; }
        .wm-food-card__name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); }
        .wm-food-card__price { font-size: 12px; color: #d97706; margin-top: 3px; }

        .wm-scroll-hint {
          position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
          z-index: 3; display: flex; flex-direction: column; align-items: center;
          gap: 6px; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); animation: scrollBounce 2.4s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%,100%{ transform: translateX(-50%) translateY(0); opacity: 0.3; }
          50%    { transform: translateX(-50%) translateY(7px); opacity: 0.7; }
        }

        /* ── STATS BAR ── */
        .wm-stats { background: #d97706; padding: 0; }
        .wm-stats__inner {
          max-width: 1280px; margin: 0 auto; padding: 0 28px;
          display: grid; grid-template-columns: repeat(2,1fr);
        }
        @media(min-width:768px){ .wm-stats__inner { grid-template-columns: repeat(4,1fr); padding: 0 40px; } }
        .wm-stat {
          padding: 28px 20px; text-align: center;
          border-right: 1px solid rgba(0,0,0,0.12);
          position: relative; overflow: hidden;
        }
        .wm-stat::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0); transition: background 0.3s;
        }
        .wm-stat:hover::after { background: rgba(255,255,255,0.06); }
        .wm-stat:last-child { border-right: none; }
        .wm-stat__num   { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 700; color: #fff; line-height: 1; }
        .wm-stat__label { font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.75); margin-top: 4px; letter-spacing: 0.08em; text-transform: uppercase; }

        /* fix 2-col stats: remove right border on 2nd item on mobile */
        @media(max-width:767px){
          .wm-stat:nth-child(2) { border-right: none; }
          .wm-stat__num { font-size: 32px; }
        }

        /* ── VALUES ── */
        .wm-values { padding: 100px 0; }
        .wm-values__grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1px; margin-top: 56px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden;
        }
        @media(min-width:1024px){ .wm-values__grid { grid-template-columns: repeat(4,1fr); } }
        .wm-value {
          padding: 40px 28px; background: #0f0e0d;
          transition: background 0.3s; position: relative; overflow: hidden;
        }
        .wm-value::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(217,119,6,0.08) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.4s;
        }
        .wm-value:hover { background: #161412; }
        .wm-value:hover::before { opacity: 1; }
        .wm-value__icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(217,119,6,0.12); color: #d97706;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.3s, transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
        }
        .wm-value:hover .wm-value__icon {
          background: #d97706; color: #fff;
          transform: scale(1.15) rotate(-8deg);
          box-shadow: 0 8px 24px rgba(217,119,6,0.4);
        }
        .wm-value__icon svg { width: 22px; height: 22px; }
        .wm-value__title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: #fff; margin-top: 22px; }
        .wm-value__desc  { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 8px; line-height: 1.65; }

        /* mobile values: single column */
        @media(max-width:479px){
          .wm-values { padding: 64px 0; }
          .wm-values__grid { grid-template-columns: 1fr; }
          .wm-value { padding: 28px 20px; }
        }
        @media(min-width:480px) and (max-width:1023px){
          .wm-values { padding: 72px 0; }
          .wm-value { padding: 32px 22px; }
        }

        /* ── LOCATIONS ── */
        .wm-locations { padding: 100px 0; background: #0f0e0d; }
        .wm-locations__grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 56px; }
        @media(min-width:768px){ .wm-locations__grid { grid-template-columns: repeat(3,1fr); } }
        .wm-loc-card {
          position: relative; border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08); background: #161412;
          padding: 32px; text-decoration: none;
          display: flex; flex-direction: column;
          transition: border-color 0.3s, box-shadow 0.35s;
        }
        .wm-loc-card:hover {
          border-color: rgba(217,119,6,0.4);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(217,119,6,0.12);
        }
        .wm-loc-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(217,119,6,0.07) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.35s;
        }
        .wm-loc-card:hover::before { opacity: 1; }
        .wm-loc-card__num     { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: rgba(255,255,255,0.2); }
        .wm-loc-card__name    { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: #fff; margin-top: 16px; line-height: 1; }
        .wm-loc-card__tagline { font-size: 13px; color: rgba(255,255,255,0.42); margin-top: 10px; line-height: 1.6; }
        .wm-loc-card__specialty { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #d97706; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.07); }
        .wm-loc-card__footer  { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; }
        .wm-loc-card__cta     { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #d97706; transition: gap 0.25s; }
        .wm-loc-card:hover .wm-loc-card__cta { gap: 12px; }
        .wm-loc-card__cta svg { width: 14px; height: 14px; }
        .wm-loc-card__phone   { font-size: 11px; color: rgba(255,255,255,0.28); text-decoration: none; display: flex; align-items: center; gap: 4px; transition: color 0.2s; }
        .wm-loc-card__phone:hover { color: rgba(255,255,255,0.55); }
        .wm-loc-card__phone svg { width: 11px; height: 11px; }

        /* mobile locations */
        @media(max-width:479px){
          .wm-locations { padding: 64px 0; }
          .wm-loc-card { padding: 24px 20px; }
          .wm-loc-card__name { font-size: 26px; }
        }
        @media(min-width:480px) and (max-width:767px){
          .wm-locations { padding: 72px 0; }
        }

        /* ── FEATURED ── */
        .wm-featured { padding: 100px 0; }
        .wm-featured__header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
        .wm-featured__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 48px; }
        @media(min-width:1024px){ .wm-featured__grid { grid-template-columns: repeat(4,1fr); } }
        .wm-feat-card {
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07); background: #0f0e0d;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .wm-feat-card:hover {
          border-color: rgba(217,119,6,0.3);
          box-shadow: 0 20px 50px rgba(0,0,0,0.45);
        }
        .wm-feat-card__img { position: relative; aspect-ratio: 4/3; overflow: hidden; }
        .wm-feat-card__img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.7s ease; }
        .wm-feat-card:hover .wm-feat-card__img img { transform: scale(1.1); }
        .wm-feat-card__badge {
          position: absolute; top: 12px; right: 12px;
          width: 42px; height: 42px; border-radius: 10px;
          background: rgba(217,119,6,0.88); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; color: #fff;
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
        }
        .wm-feat-card:hover .wm-feat-card__badge { transform: scale(1.15) rotate(-8deg); }
        .wm-feat-card__badge svg { width: 18px; height: 18px; }
        .wm-feat-card__body  { padding: 18px; }
        .wm-feat-card__name  { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.9); }
        .wm-feat-card__price { font-size: 12px; color: #d97706; margin-top: 4px; font-weight: 500; }

        /* mobile featured */
        @media(max-width:479px){
          .wm-featured { padding: 64px 0; }
          .wm-featured__grid { grid-template-columns: 1fr; gap: 14px; }
          .wm-featured__header { flex-direction: column; align-items: flex-start; gap: 8px; }
          .wm-feat-card__body { padding: 14px; }
          .wm-feat-card__name { font-size: 16px; }
        }
        @media(min-width:480px) and (max-width:1023px){
          .wm-featured { padding: 72px 0; }
        }

        /* ── STORY ── */
        .wm-story { padding: 100px 0; background: #0f0e0d; }
        .wm-story__inner { display: grid; grid-template-columns: 1fr; gap: 56px; align-items: center; }
        @media(min-width:1024px){ .wm-story__inner { grid-template-columns: 1fr 1fr; } }
        .wm-story__text  { font-size: 15px; color: rgba(255,255,255,0.48); line-height: 1.8; margin-top: 12px; }
        .wm-story__text + .wm-story__text { margin-top: 16px; }
        .wm-story__link  { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #d97706; text-decoration: none; margin-top: 28px; transition: gap 0.25s; }
        .wm-story__link:hover { gap: 14px; }
        .wm-story__link svg { width: 14px; height: 14px; }
        .wm-story__img-wrap {
          position: relative; border-radius: 20px; overflow: hidden;
          aspect-ratio: 4/3; border: 1px solid rgba(255,255,255,0.08);
          transition: box-shadow 0.4s;
        }
        .wm-story__img-wrap:hover { box-shadow: 0 32px 80px rgba(0,0,0,0.5); }
        .wm-story__img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease; }
        .wm-story__img-wrap:hover img { transform: scale(1.04); }
        .wm-story__img-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 24px 20px;
          background: linear-gradient(to top, rgba(10,9,8,0.92) 0%, transparent 100%);
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 600; color: #fff; line-height: 1.3;
        }

        /* mobile story */
        @media(max-width:479px){
          .wm-story { padding: 64px 0; }
          .wm-story__inner { gap: 36px; }
          .wm-story__img-caption { font-size: 16px; padding: 16px 16px 14px; }
        }
        @media(min-width:480px) and (max-width:1023px){
          .wm-story { padding: 72px 0; }
          .wm-story__inner { gap: 40px; }
        }

        /* ── TESTIMONIALS ── */
        .wm-testimonials { padding: 100px 0; }
        .wm-testimonials__grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 56px; }
        @media(min-width:768px){ .wm-testimonials__grid { grid-template-columns: repeat(3,1fr); } }
        .wm-review {
          padding: 28px; border-radius: 14px;
          background: #0f0e0d; border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .wm-review:hover {
          border-color: rgba(217,119,6,0.25);
          box-shadow: 0 16px 40px rgba(0,0,0,0.35);
        }
        .wm-review__stars { display: flex; gap: 3px; color: #d97706; }
        .wm-review__stars svg { width: 14px; height: 14px; fill: currentColor; }
        .wm-review__quote  { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.85); margin-top: 16px; line-height: 1.45; }
        .wm-review__author { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 16px; }

        /* mobile testimonials */
        @media(max-width:479px){
          .wm-testimonials { padding: 64px 0; }
          .wm-review { padding: 22px 18px; }
          .wm-review__quote { font-size: 16px; }
        }
        @media(min-width:480px) and (max-width:767px){
          .wm-testimonials { padding: 72px 0; }
          .wm-testimonials__grid { grid-template-columns: 1fr; }
        }

        /* ── FAQ ── */
        .wm-faq { padding: 100px 0; background: #0f0e0d; }
        .wm-faq__cols { display: grid; grid-template-columns: 1fr; gap: 0; margin-top: 56px; }
        @media(min-width:768px){ .wm-faq__cols { grid-template-columns: 1fr 1fr; gap: 0 40px; } }
        .wm-faq-item { border-bottom: 1px solid rgba(255,255,255,0.07); overflow: hidden; }
        .wm-faq-btn {
          width: 100%; background: none; border: none; cursor: pointer;
          padding: 22px 0; display: flex; align-items: center; justify-content: space-between;
          gap: 16px; text-align: left;
        }
        .wm-faq-q    { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.82); line-height: 1.5; }
        .wm-faq-icon {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
          background: rgba(217,119,6,0.12); color: #d97706;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s;
        }
        .wm-faq-btn:hover .wm-faq-icon { background: #d97706; color: #fff; }
        .wm-faq-a-inner { padding: 0 0 20px; font-size: 13px; color: rgba(255,255,255,0.42); line-height: 1.75; }

        /* mobile faq */
        @media(max-width:479px){
          .wm-faq { padding: 64px 0; }
          .wm-faq-q { font-size: 13px; }
          .wm-faq-btn { padding: 18px 0; }
        }
        @media(min-width:480px) and (max-width:767px){
          .wm-faq { padding: 72px 0; }
        }

        /* ── CTA BANNER ── */
        .wm-cta-banner { padding: 0 0 100px; }
        .wm-cta-banner__box {
          border-radius: 20px; overflow: hidden;
          background: #d97706; padding: 64px 48px;
          display: grid; grid-template-columns: 1fr; gap: 32px; align-items: center;
          position: relative;
        }
        @media(min-width:768px){ .wm-cta-banner__box { grid-template-columns: 1fr auto; padding: 64px 56px; } }
        .wm-cta-banner__box::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.4;
        }
        .wm-cta-banner__title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px,4vw,52px); font-weight: 700; color: #fff; line-height: 1.05; position: relative; }
        .wm-cta-banner__sub   { font-size: 15px; color: rgba(255,255,255,0.82); margin-top: 12px; position: relative; max-width: 440px; }
        .wm-cta-banner__btns  { display: flex; flex-wrap: wrap; gap: 12px; position: relative; }
        .wm-btn-dark  { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: #0a0908; color: #fff; font-size: 14px; font-weight: 600; border-radius: 6px; text-decoration: none; transition: background 0.2s, transform 0.2s; }
        .wm-btn-dark:hover  { background: #1a1612; transform: translateY(-2px); }
        .wm-btn-light { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: rgba(255,255,255,0.15); color: #fff; font-size: 14px; font-weight: 600; border-radius: 6px; text-decoration: none; border: 1px solid rgba(255,255,255,0.3); transition: background 0.2s, transform 0.2s; }
        .wm-btn-light:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); }

        /* mobile cta */
        @media(max-width:479px){
          .wm-cta-banner { padding: 0 0 64px; }
          .wm-cta-banner__box { padding: 36px 24px; border-radius: 16px; gap: 24px; }
          .wm-cta-banner__btns { flex-direction: column; }
          .wm-btn-dark, .wm-btn-light { justify-content: center; width: 100%; }
        }
        @media(min-width:480px) and (max-width:767px){
          .wm-cta-banner { padding: 0 0 80px; }
          .wm-cta-banner__box { padding: 44px 32px; }
        }

        /* ── shimmer animation ── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .wm-shimmer-text {
          background: linear-gradient(90deg, #d97706 0%, #fbbf24 40%, #d97706 60%, #b45309 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: shimmer 4s linear infinite;
        }

        /* ── GLOBAL MOBILE / TABLET POLISH ── */

        /* hero inner padding on small screens */
        @media(max-width:479px){
          .wm-hero__inner { padding: 100px 20px 60px; gap: 32px; }
          .wm-hero__sub   { font-size: 14px; }
          .wm-hero__ctas  { flex-direction: column; }
          .wm-btn-primary, .wm-btn-outline { justify-content: center; width: 100%; }
        }
        @media(min-width:480px) and (max-width:767px){
          .wm-hero__inner { padding: 110px 28px 72px; }
        }
        @media(min-width:768px) and (max-width:1023px){
          .wm-hero__inner { padding: 120px 40px 80px; }
        }

        /* section title on mobile */
        @media(max-width:479px){
          .wm-section-title { font-size: clamp(28px, 8vw, 38px); }
          .wm-section-sub   { font-size: 13px; }
        }

        /* eyebrow lines shorter on tiny screens */
        @media(max-width:360px){
          .wm-eyebrow::before, .wm-eyebrow::after { width: 16px; }
        }

        /* touch — disable tilt transforms on hover-less devices */
        @media(hover:none){
          .wm-btn-primary:hover, .wm-btn-outline:hover,
          .wm-btn-dark:hover, .wm-btn-light:hover { transform: none; }
        }
      `}</style>

      <div className="wm-page">

        {/* ════════════════ HERO ════════════════ */}
        <section className="wm-hero" ref={heroRef}>
          <motion.div
            className="wm-hero__bg"
            style={{ backgroundImage: `url(${heroSlide})`, y: bgY, opacity: bgOpacity, scale: bgScale }}
          />
          <div className="wm-hero__overlay" />
          <HeroParticles />

          <div className="wm-hero__inner">
            {/* LEFT */}
            <motion.div style={{ y: textY }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="wm-eyebrow">
                  <Sparkles style={{ width: 12, height: 12 }} />
                  Maryland Tradition Since {SITE.established}
                </span>
              </motion.div>

              <motion.h1
                className="wm-display wm-hero__title"
                initial={{ opacity: 0, y: 40, rotateX: 12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22,1,0.36,1] }}
                style={{ transformStyle: "preserve-3d", perspective: 800 }}
              >
                Come Hungry.<br />
                <span className="wm-shimmer-text">Leave Happy.</span>
              </motion.h1>

              <motion.p
                className="wm-hero__sub"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                Fresh food. Fast service. Three Maryland locations ready to serve you.
              </motion.p>

              <motion.div
                className="wm-hero__ctas"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link to="/order" className="wm-btn-primary">
                  Order Now <ArrowRight style={{ width: 15, height: 15 }} />
                </Link>
                <Link to="/locations" className="wm-btn-outline">
                  Explore Menus
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT — 3-D food cards */}
            <div className="wm-hero__cards">
              {[
                { img: heroPizza,   name: "Hand-Stretched Pizza",  price: "from $12.99", delay: 0.5  },
                { img: heroChicken, name: "Famous Fried Chicken",  price: "from $6.99",  delay: 0.65 },
                { img: heroSub,     name: "Hot Subs & Steaks",     price: "from $11.99", delay: 0.8  },
                { img: heroSalad,   name: "Fresh Salads",          price: "from $9.99",  delay: 0.95 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="wm-food-card"
                  initial={{ opacity: 0, y: 60, rotateX: 20, rotateY: i % 2 === 0 ? -8 : 8, scale: 0.88 }}
                  animate={{ opacity: 1, y: i % 2 === 0 ? 0 : 28, rotateX: 0, rotateY: 0, scale: 1 }}
                  transition={{ duration: 0.85, delay: item.delay, ease: [0.22,1,0.36,1] }}
                  whileHover={{
                    y: (i % 2 === 0 ? 0 : 28) - 8,
                    rotateY: i % 2 === 0 ? 4 : -4,
                    rotateX: -3, scale: 1.03,
                    transition: { duration: 0.3 },
                  }}
                  style={{ transformStyle: "preserve-3d", perspective: 900 }}
                >
                  <img src={item.img} alt={item.name} loading={i > 1 ? "lazy" : undefined} />
                  <div className="wm-food-card__body">
                    <div className="wm-food-card__name">{item.name}</div>
                    <div className="wm-food-card__price">{item.price}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="wm-scroll-hint">
            <span>scroll</span>
            <ChevronDown style={{ width: 16, height: 16 }} />
          </div>
        </section>

        {/* ════════════════ STATS BAR ════════════════ */}
        <motion.div
          ref={statsRef}
          className="wm-stats"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <div className="wm-stats__inner">
            {[
              { num: "3",    label: "Locations"     },
              { num: "15+",  label: "Years Serving"  },
              { num: "50+",  label: "Menu Items"    },
              { num: "★4.8", label: "Avg. Rating"   },
            ].map((s, i) => (
              <motion.div
                key={s.label} className="wm-stat"
                initial={{ opacity: 0, y: 14, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
                style={{ transformStyle: "preserve-3d" }}
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
            <div style={{ textAlign: "center" }}>
              <span className="wm-eyebrow">Why Wise Mart</span>
              <h2 className="wm-display wm-section-title" style={{ textAlign: "center" }}>Our Promise</h2>
            </div>
            <div className="wm-values__grid">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title} className="wm-value"
                  initial={{ opacity: 0, y: 32, rotateY: i % 2 === 0 ? -12 : 12 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  whileHover={{ z: 10 }}
                >
                  <div className="wm-value__icon"><v.icon /></div>
                  <div className="wm-value__title">{v.title}</div>
                  <div className="wm-value__desc">{v.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ LOCATIONS ════════════════ */}
        <section className="wm-locations">
          <div className="wm-section">
            <div style={{ textAlign: "center" }}>
              <span className="wm-eyebrow">Three Locations</span>
              <h2 className="wm-display wm-section-title" style={{ textAlign: "center" }}>Pick Your Wise Mart</h2>
              <p className="wm-section-sub" style={{ margin: "10px auto 0" }}>Each kitchen with its own personality — same Wise Mart promise.</p>
            </div>
            <div className="wm-locations__grid">
              {LOCATIONS.map((loc, i) => (
                <motion.div
                  key={loc.slug}
                  initial={{ opacity: 0, y: 50, rotateY: i === 1 ? 0 : i === 0 ? -14 : 14, rotateX: 6 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22,1,0.36,1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TiltCard strength={7}>
                    <Link to="/locations" className="wm-loc-card">
                      <div className="wm-loc-card__num">0{i + 1}</div>
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
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ FEATURED ════════════════ */}
        <section className="wm-featured">
          <div className="wm-section">
            <div className="wm-featured__header">
              <div>
                <span className="wm-eyebrow">Featured</span>
                <h2 className="wm-display wm-section-title">What we're known for</h2>
              </div>
              <Link to="/locations" className="wm-story__link" style={{ marginBottom: 8 }}>
                See full menus <ArrowRight />
              </Link>
            </div>
            <div className="wm-featured__grid">
              {FEATURED.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 40, scale: 0.88, rotateX: 14 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22,1,0.36,1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TiltCard className="wm-feat-card" strength={8}>
                    <div className="wm-feat-card__img">
                      <img src={f.img} alt={f.name} loading="lazy" />
                      <div className="wm-feat-card__badge"><f.icon /></div>
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
          <div className="wm-section">
            <div className="wm-story__inner">
              <motion.div
                initial={{ opacity: 0, x: -40, rotateY: 8 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="wm-eyebrow">Our Story</span>
                <h2 className="wm-display wm-section-title">More than a meal —<br />a Maryland tradition.</h2>
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
                initial={{ opacity: 0, x: 40, rotateY: -10, scale: 0.93 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22,1,0.36,1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
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
            <div style={{ textAlign: "center" }}>
              <span className="wm-eyebrow">Reviews</span>
              <h2 className="wm-display wm-section-title" style={{ textAlign: "center" }}>What our guests say</h2>
            </div>
            <div className="wm-testimonials__grid">
              {[
                { q: "Best fried chicken on the Eastern Shore. Hands down.",       a: "Marcus T. — Sharptown"     },
                { q: "The breakfast pizza is a game changer. We're regulars now.", a: "Sarah & Jim — Vienna"       },
                { q: "Cheesesteak subs that actually taste like home.",             a: "Dee R. — East New Market"  },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 36, rotateX: 10, scale: 0.93 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22,1,0.36,1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TiltCard className="wm-review" strength={6}>
                    <div className="wm-review__stars">
                      {Array.from({ length: 5 }).map((_, j) => <Star key={j} />)}
                    </div>
                    <div className="wm-review__quote">"{t.q}"</div>
                    <div className="wm-review__author">— {t.a}</div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ FAQ ════════════════ */}
        <section className="wm-faq">
          <div className="wm-section">
            <div style={{ textAlign: "center" }}>
              <span className="wm-eyebrow">FAQ</span>
              <h2 className="wm-display wm-section-title" style={{ textAlign: "center" }}>Quick Answers</h2>
              <p className="wm-section-sub" style={{ margin: "10px auto 0" }}>Quick answers to the things our guests ask most.</p>
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
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <Link to="/faq" className="wm-story__link" style={{ display: "inline-flex" }}>
                See all FAQs <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════ CTA BANNER ════════════════ */}
        <div className="wm-cta-banner" style={{ paddingTop: 60 }}>
          <div className="wm-section">
            <motion.div
              className="wm-cta-banner__box"
              initial={{ opacity: 0, y: 40, rotateX: 8, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
            >
              <div>
                <h3 className="wm-cta-banner__title">Ready to order?</h3>
                <p className="wm-cta-banner__sub">Pick your location, place your order, and we'll have it ready when you arrive.</p>
              </div>
              <div className="wm-cta-banner__btns">
                <Link to="/order"     className="wm-btn-dark">Order Now</Link>
                <Link to="/locations" className="wm-btn-light">Find a Location</Link>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </>
  );
}