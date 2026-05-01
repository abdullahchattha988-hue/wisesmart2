import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  ChevronRight,
  Clock,
  Drumstick,
  Leaf,
  MapPin,
  Phone,
  Pizza,
  Plus,
  Salad,
  Sandwich,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { LOCATIONS, SITE } from "@/data/site";
import heroPizza from "@/assets/hero-pizza.jpg";
import heroChicken from "@/assets/hero-chicken.jpg";
import heroSub from "@/assets/hero-sub.jpg";
import heroSalad from "@/assets/hero-salad.jpg";
import heroSlide from "@/assets/hero-slide.webp";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Wise Mart | Come Hungry. Leave Happy. | Maryland Restaurants Since ${SITE.established}` },
      {
        name: "description",
        content:
          "Fresh pizza, famous fried chicken, hearty subs, and crisp salads. Three Maryland locations serving fast, satisfying comfort food since 2010.",
      },
      { property: "og:title", content: "Wise Mart | Come Hungry. Leave Happy." },
      {
        property: "og:description",
        content:
          "Fast comfort food with real personality. Three Maryland locations serving pizza, fried chicken, subs, salads, and breakfast favorites.",
      },
      { name: "theme-color", content: "#120d09" },
    ],
  }),
  component: HomePage,
});
const VALUES = [
  {
    icon: Leaf,
    title: "Prepared Fresh Daily",
    desc: "Dough, produce, sauces, and salad prep are handled with care every morning so the food tastes alive, not prepackaged.",
  },
  {
    icon: Zap,
    title: "Fast Without Feeling Rushed",
    desc: "The service is quick because the system is sharp, not because the standards are low. You get speed and a meal worth stopping for.",
  },
  {
    icon: Award,
    title: "Neighborhood-Favorite Value",
    desc: "Big flavor, generous portions, and pricing that still feels grounded. Wise Mart is built for regulars, not one-time splurges.",
  },
  {
    icon: Users,
    title: "Rooted in Community",
    desc: "Three Maryland towns, one shared approach: warm hospitality, dependable food, and the kind of place families keep coming back to.",
  },
];
const FEATURED = [
  {
    icon: Pizza,
    name: "Hand-Stretched Pizza",
    price: "from $12.99",
    img: heroPizza,
    tag: "Signature",
    note: "Bold sauce, bubbling cheese, and the kind of crust that actually earns the word hand-made.",
  },
  {
    icon: Drumstick,
    name: "Famous Fried Chicken",
    price: "from $6.99",
    img: heroChicken,
    tag: "Best Seller",
    note: "Golden outside, juicy inside, and one of the biggest reasons locals keep making the drive.",
  },
  {
    icon: Sandwich,
    name: "Hot Subs and Steaks",
    price: "from $11.99",
    img: heroSub,
    tag: "Fan Favorite",
    note: "Loaded, satisfying, and built for lunch breaks, road trips, and late-night cravings alike.",
  },
  {
    icon: Salad,
    name: "Fresh Salads",
    price: "from $9.99",
    img: heroSalad,
    tag: "Daily Fresh",
    note: "Crisp greens, bright toppings, and enough substance to feel like a real meal, not an afterthought.",
  },
];
const TESTIMONIALS = [
  {
    quote: "Best fried chicken on the Eastern Shore. Hands down.",
    author: "Marcus T.",
    location: "Sharptown",
  },
  {
    quote: "The breakfast pizza is a game changer. We are regulars now.",
    author: "Sarah and Jim",
    location: "Vienna",
  },
  {
    quote: "Cheesesteak subs that actually taste like Philly.",
    author: "Dee R.",
    location: "East New Market",
  },
];
const FAQS = [
  {
    q: "Do you offer online ordering?",
    a: "Yes. Guests can place pickup orders through the Order page for any Wise Mart location, and select locations also support delivery through third-party platforms.",
  },
  {
    q: "What are your hours?",
    a: "Hours can vary by location, but most Wise Mart kitchens run from 10 AM to 10 PM Sunday through Thursday, then 10 AM to 11 PM on Friday and Saturday.",
  },
  {
    q: "Do you cater events?",
    a: "Absolutely. Wise Mart caters everything from family parties to workplace lunches. Reach out to your nearest location and the team can build a custom order around your event.",
  },
  {
    q: "Are there vegetarian options?",
    a: "Yes. Fresh salads, veggie-friendly subs, and cheese pizza are regular favorites, and plant-forward choices continue to expand seasonally.",
  },
  {
    q: "Can I customize my order?",
    a: "Definitely. Toppings, dressings, add-ons, and other modifiers are all part of the experience. If you can picture it, the team will usually make it happen.",
  },
  {
    q: "Do you have a rewards program?",
    a: "A formal loyalty program is in progress. For now, the best way to catch specials and seasonal promotions is through Wise Mart's social channels and in-store offers.",
  },
  {
    q: "Are your ingredients locally sourced?",
    a: "Wise Mart prioritizes regional suppliers whenever practical, especially for produce and dairy. The goal is always fresh ingredients with dependable quality.",
  },
  {
    q: "Is parking available?",
    a: "Yes. All three locations offer free on-site parking, so grabbing a quick order or picking up catering stays easy.",
  },
  {
    q: "Do you accommodate allergies?",
    a: "The team takes dietary concerns seriously. Guests should mention allergies when ordering so the kitchen can guide them as carefully as possible.",
  },
  {
    q: "How do I apply for a job at Wise Mart?",
    a: "Visit the Careers page or stop by any location and ask for a manager. Wise Mart is always interested in dependable people who care about hospitality.",
  },
];
const MARQUEE_ITEMS = [
  "Hand-Stretched Pizza",
  "Famous Fried Chicken",
  "Hot Subs and Steaks",
  "Fresh Salads",
  "Breakfast Favorites",
  "Catering Trays",
  "Pickup and Delivery",
  "Three Maryland Locations",
];
const STORY_POINTS = [
  "House-prepped dough and sauces every morning.",
  "Fast counter service without sacrificing flavor.",
  "Breakfast, lunch, dinner, and late-day comfort food.",
];
type Location = (typeof LOCATIONS)[number];
function useFinePointer() {
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
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
function useTilt(enabled: boolean, strength = 8) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 320,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 320,
    damping: 28,
  });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });
  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!enabled) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left) / bounds.width - 0.5);
    y.set((event.clientY - bounds.top) / bounds.height - 0.5);
    scale.set(1.015);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
    scale.set(1);
  }
  return {
    rotateX: enabled ? rotateX : 0,
    rotateY: enabled ? rotateY : 0,
    scale: enabled ? scale : 1,
    onMove,
    onLeave,
  };
}
function TiltCard({
  children,
  className,
  enabled,
  strength = 8,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  enabled: boolean;
  strength?: number;
  interactive?: boolean;
}) {
  const { rotateX, rotateY, scale, onMove, onLeave } = useTilt(enabled, strength);
  return (
    <motion.div
      className={className}
      data-cursor={interactive ? "interactive" : undefined}
      onMouseMove={enabled ? onMove : undefined}
      onMouseLeave={enabled ? onLeave : undefined}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}
function SectionIntro({
  eyebrow,
  title,
  body,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
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
      {action ? <div className="wm-intro__action">{action}</div> : null}
    </div>
  );
}
function CountUp({
  to,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) {
      return;
    }
    if (prefersReducedMotion) {
      setValue(to);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, prefersReducedMotion, to]);
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonId = `${panelId}-button`;
  return (
    <motion.div
      className="wm-faq-item"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        id={buttonId}
        type="button"
        className={`wm-faq-button${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="wm-faq-question">{q}</span>
        <motion.span
          className="wm-faq-icon"
          animate={{
            rotate: open ? 45 : 0,
            backgroundColor: open ? "rgba(235, 113, 38, 0.2)" : "rgba(235, 113, 38, 0.08)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          <Plus />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="wm-faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="wm-faq-answer__inner">{a}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
function LocationCard({ location, index }: { location: Location; index: number }) {
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
      <div className="wm-location-card__rail" />
      <div className="wm-location-card__actions">
        <Link to="/locations" className="wm-button wm-button--primary wm-button--small">
          Explore Location <ArrowRight />
        </Link>
        <a href={location.phoneHref} className="wm-location-card__phone">
          <Phone />
          {location.phone}
        </a>
      </div>
    </motion.article>
  );
}
function FeaturedCard({
  item,
  index,
  tiltEnabled,
}: {
  item: (typeof FEATURED)[number];
  index: number;
  tiltEnabled: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.58, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="wm-feature-card" enabled={tiltEnabled} strength={6} interactive>
        <div className="wm-feature-card__media">
          <img src={item.img} alt={item.name} loading="lazy" />
          <div className="wm-feature-card__scrim" />
          <span className="wm-feature-card__badge">
            <item.icon />
          </span>
        </div>
        <div className="wm-feature-card__body">
          <div className="wm-feature-card__eyebrow-row">
            <span className="wm-feature-card__tag">{item.tag}</span>
            <span className="wm-feature-card__index">0{index + 1}</span>
          </div>
          <h3 className="wm-display wm-feature-card__title">{item.name}</h3>
          <p className="wm-feature-card__copy">{item.note}</p>
          <div className="wm-feature-card__footer">
            <span className="wm-feature-card__price">{item.price}</span>
            <Link to="/order" className="wm-link">
              Order This <ChevronRight />
            </Link>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
function ReviewCard({
  quote,
  author,
  location,
  index,
  tiltEnabled,
}: {
  quote: string;
  author: string;
  location: string;
  index: number;
  tiltEnabled: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.56, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="wm-review-card" enabled={tiltEnabled} strength={5} interactive>
        <span className="wm-review-card__quote-mark">"</span>
        <div className="wm-review-card__stars">
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <Star key={starIndex} />
          ))}
        </div>
        <p className="wm-review-card__quote">"{quote}"</p>
        <div className="wm-review-card__rail" />
        <div className="wm-review-card__author">{author}</div>
        <div className="wm-review-card__location">
          <MapPin />
          {location}
        </div>
      </TiltCard>
    </motion.div>
  );
}
function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const established = Number(SITE.established);
  const yearsServing = Math.max(new Date().getFullYear() - established, 1);
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
      if (!(target instanceof Element)) {
        return;
      }
      setCursorHover(Boolean(target.closest("a, button, [data-cursor='interactive']")));
    };
    const onPointerOut = (event: PointerEvent) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Element && nextTarget.closest("a, button, [data-cursor='interactive']")) {
        return;
      }
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
          --wm-ink-panel: rgba(24, 17, 12, 0.76);
          --wm-ink-panel-strong: rgba(18, 13, 9, 0.9);
          --wm-paper: #f7efe3;
          --wm-paper-soft: #fbf6ef;
          --wm-paper-muted: #e8dccd;
          --wm-text: rgba(250, 244, 237, 0.96);
          --wm-text-soft: rgba(250, 244, 237, 0.72);
          --wm-text-faint: rgba(250, 244, 237, 0.48);
          --wm-ink-text: #271d16;
          --wm-ink-text-soft: rgba(39, 29, 22, 0.72);
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
        * {
          box-sizing: border-box;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          margin: 0;
          background: var(--wm-ink);
        }
        img {
          display: block;
          max-width: 100%;
        }
        .wm-page {
          position: relative;
          overflow-x: clip;
          color: var(--wm-text);
          background:
            radial-gradient(circle at 10% 0%, rgba(235, 113, 38, 0.1), transparent 28%),
            radial-gradient(circle at 92% 18%, rgba(242, 188, 89, 0.07), transparent 22%),
            linear-gradient(180deg, #120d09 0%, #15100c 46%, #120d09 100%);
          font-family: "Manrope", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .wm-page__glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }
        .wm-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          transform-origin: left center;
          background: linear-gradient(90deg, #ffcf80 0%, #eb7126 45%, #b54d0c 100%);
          z-index: 30;
        }
        .wm-cursor-outer,
        .wm-cursor-inner {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 31;
        }
        .wm-cursor-outer {
          width: 44px;
          height: 44px;
          margin-top: -22px;
          margin-left: -22px;
          border-radius: 999px;
          border: 1px solid rgba(255, 207, 128, 0.6);
          background: rgba(235, 113, 38, 0.08);
          transition:
            width 0.24s ease,
            height 0.24s ease,
            margin 0.24s ease,
            border-color 0.24s ease,
            background 0.24s ease;
        }
        .wm-cursor-outer.is-hover {
          width: 68px;
          height: 68px;
          margin-top: -34px;
          margin-left: -34px;
          border-color: rgba(255, 207, 128, 0.8);
          background: rgba(235, 113, 38, 0.16);
        }
        .wm-cursor-inner {
          width: 8px;
          height: 8px;
          margin-top: -4px;
          margin-left: -4px;
          border-radius: 999px;
          background: #ffcf80;
          box-shadow: 0 0 24px rgba(255, 207, 128, 0.55);
        }
        .wm-section {
          width: min(1320px, calc(100vw - 32px));
          margin: 0 auto;
        }
        .wm-display {
          font-family: "Fraunces", Georgia, serif;
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 0.98;
        }
        .wm-display em {
          font-style: italic;
          color: #ffd08d;
        }
        .wm-intro {
          position: relative;
        }
        .wm-intro--center {
          text-align: center;
        }
        .wm-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #ffcf80;
        }
        .wm-eyebrow__line {
          width: 30px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 207, 128, 0.95), transparent);
          display: inline-block;
        }
        .wm-section-title {
          margin: 18px 0 0;
          font-size: clamp(42px, 5vw, 76px);
        }
        .wm-section-sub {
          margin-top: 16px;
          max-width: 650px;
          font-size: 15px;
          line-height: 1.8;
          color: var(--wm-text-soft);
        }
        .wm-intro--center .wm-section-sub {
          margin-left: auto;
          margin-right: auto;
        }
        .wm-intro__action {
          margin-top: 22px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .wm-intro--center .wm-intro__action {
          justify-content: center;
        }
        .wm-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 52px;
          padding: 0 24px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            background 0.24s ease,
            border-color 0.24s ease,
            color 0.24s ease;
        }
        .wm-button svg,
        .wm-link svg,
        .wm-location-card__phone svg,
        .wm-review-card__location svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        .wm-button--primary {
          color: white;
          background: linear-gradient(135deg, #f18b3e 0%, #eb7126 48%, #c95a12 100%);
          box-shadow: var(--wm-shadow-amber);
        }
        .wm-button--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 58px rgba(201, 90, 18, 0.4);
        }
        .wm-button--ghost {
          color: var(--wm-text);
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(12px);
        }
        .wm-button--ghost:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.26);
          background: rgba(255, 255, 255, 0.08);
        }
        .wm-button--dark {
          color: var(--wm-paper);
          background: rgba(13, 9, 6, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .wm-button--dark:hover {
          transform: translateY(-2px);
          background: rgba(18, 13, 9, 0.96);
        }
        .wm-button--small {
          min-height: 44px;
          padding: 0 18px;
          font-size: 11px;
          letter-spacing: 0.14em;
        }
        .wm-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ffcf80;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: gap 0.22s ease, color 0.22s ease;
        }
        .wm-link:hover {
          gap: 14px;
          color: white;
        }
        .wm-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--wm-border);
          color: var(--wm-text-soft);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
        }
        .wm-chip svg {
          width: 13px;
          height: 13px;
          color: #ffcf80;
        }
        .wm-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: stretch;
          overflow: hidden;
        }
        .wm-hero__bg {
          position: absolute;
          inset: -6%;
          background-position: center;
          background-size: cover;
          will-change: transform;
        }
        .wm-hero__overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(110deg, rgba(9, 6, 4, 0.94) 0%, rgba(9, 6, 4, 0.82) 42%, rgba(9, 6, 4, 0.38) 74%, rgba(9, 6, 4, 0.12) 100%),
            linear-gradient(180deg, rgba(9, 6, 4, 0.35) 0%, rgba(9, 6, 4, 0.94) 100%);
        }
        .wm-hero__noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 170px 170px;
        }
        .wm-hero__beam,
        .wm-hero__orb {
          position: absolute;
          pointer-events: none;
        }
        .wm-hero__beam {
          inset: auto -10% 8% auto;
          width: 45vw;
          height: 45vw;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(242, 188, 89, 0.12) 0%, rgba(235, 113, 38, 0.08) 25%, transparent 70%);
          filter: blur(16px);
        }
        .wm-hero__orb {
          inset: 12% auto auto 8%;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(235, 113, 38, 0.18) 0%, transparent 68%);
          filter: blur(28px);
        }
        .wm-hero__inner {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 54px;
          grid-template-columns: 1fr;
          align-items: center;
          padding: 132px 0 96px;
        }
        .wm-hero__copy {
          max-width: 670px;
        }
        .wm-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 9px 16px 9px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(14px);
        }
        .wm-hero__badge-icon {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f4a756 0%, #eb7126 100%);
          box-shadow: 0 0 0 5px rgba(235, 113, 38, 0.12);
        }
        .wm-hero__badge-icon svg {
          width: 14px;
          height: 14px;
          color: white;
        }
        .wm-hero__badge-copy {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--wm-text-soft);
        }
        .wm-hero__badge-copy strong {
          color: white;
        }
        .wm-hero__title {
          margin: 28px 0 0;
          font-size: clamp(62px, 9vw, 118px);
        }
        .wm-hero__line {
          display: block;
          overflow: hidden;
        }
        .wm-hero__line span {
          display: block;
        }
        .wm-hero__line--accent span {
          background: linear-gradient(90deg, #ffe3b1 0%, #f4a756 22%, #eb7126 55%, #ffcf80 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: wm-shimmer 7s linear infinite;
          background-size: 220% auto;
        }
        @keyframes wm-shimmer {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .wm-hero__sub {
          margin: 24px 0 0;
          max-width: 560px;
          font-size: 16px;
          line-height: 1.85;
          color: var(--wm-text-soft);
        }
        .wm-hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 34px;
        }
        .wm-hero__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }
        .wm-hero__signals {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 34px;
          max-width: 620px;
        }
        .wm-hero__signal {
          padding: 18px 18px 17px;
          border-radius: 22px;
          border: 1px solid var(--wm-border);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(14px);
        }
        .wm-hero__signal-top {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffcf80;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .wm-hero__signal-copy {
          margin-top: 10px;
          font-size: 13px;
          line-height: 1.7;
          color: var(--wm-text-soft);
        }
        .wm-showcase {
          position: relative;
          display: grid;
          gap: 16px;
          align-self: stretch;
        }
        .wm-showcase__hero {
          position: relative;
          min-height: 420px;
          overflow: hidden;
          border-radius: var(--wm-radius-xl);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: var(--wm-shadow-xl);
          background: rgba(255, 255, 255, 0.04);
        }
        .wm-showcase__hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wm-showcase__hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(10, 7, 5, 0.1) 0%, rgba(10, 7, 5, 0.16) 34%, rgba(10, 7, 5, 0.9) 100%);
        }
        .wm-showcase__hero-copy {
          position: absolute;
          inset: auto 26px 24px 26px;
          z-index: 1;
        }
        .wm-showcase__label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.14);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffe1aa;
          backdrop-filter: blur(12px);
        }
        .wm-showcase__title {
          margin: 18px 0 0;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.02;
        }
        .wm-showcase__copy {
          margin: 12px 0 0;
          max-width: 420px;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(250, 244, 237, 0.78);
        }
        .wm-showcase__cta {
          margin-top: 20px;
        }
        .wm-showcase__stamp {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 1;
          min-width: 108px;
          padding: 12px 14px;
          border-radius: 24px;
          background: rgba(16, 11, 8, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          text-align: center;
          backdrop-filter: blur(12px);
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-showcase__stamp small {
          display: block;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--wm-text-faint);
        }
        .wm-showcase__stamp strong {
          display: block;
          margin-top: 4px;
          font-family: "Fraunces", Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          color: white;
          line-height: 1;
        }
        .wm-showcase__grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .wm-showcase__mini {
          position: relative;
          overflow: hidden;
          min-height: 180px;
          border-radius: 26px;
          border: 1px solid var(--wm-border);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-showcase__mini img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wm-showcase__mini::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(12, 8, 6, 0.1) 0%, rgba(12, 8, 6, 0.7) 100%);
        }
        .wm-showcase__mini-copy {
          position: absolute;
          inset: auto 16px 16px;
          z-index: 1;
        }
        .wm-showcase__mini-tag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffe1aa;
        }
        .wm-showcase__mini-name {
          margin-top: 6px;
          font-size: 15px;
          font-weight: 700;
          color: white;
          line-height: 1.3;
        }
        .wm-showcase__mini-price {
          margin-top: 5px;
          font-size: 12px;
          color: rgba(250, 244, 237, 0.74);
        }
        .wm-scroll-cue {
          position: absolute;
          left: 50%;
          bottom: 28px;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          z-index: 2;
          color: var(--wm-text-faint);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .wm-scroll-cue__track {
          width: 1px;
          height: 54px;
          background: rgba(255, 255, 255, 0.12);
          position: relative;
          overflow: hidden;
        }
        .wm-scroll-cue__track::after {
          content: "";
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, transparent, #ffcf80, transparent);
          animation: wm-scroll-drop 2.15s ease-in-out infinite;
        }
        @keyframes wm-scroll-drop {
          0% {
            top: -100%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .wm-marquee {
          position: relative;
          overflow: hidden;
          padding: 16px 0;
          background: linear-gradient(90deg, #f3b154 0%, #eb7126 36%, #c95a12 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .wm-marquee::before,
        .wm-marquee::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 70px;
          pointer-events: none;
          z-index: 1;
        }
        .wm-marquee::before {
          left: 0;
          background: linear-gradient(90deg, rgba(235, 113, 38, 1), rgba(235, 113, 38, 0));
        }
        .wm-marquee::after {
          right: 0;
          background: linear-gradient(270deg, rgba(201, 90, 18, 1), rgba(201, 90, 18, 0));
        }
        .wm-marquee__track {
          display: flex;
          width: max-content;
          animation: wm-marquee-scroll 28s linear infinite;
        }
        .wm-marquee__item {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          padding: 0 28px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.95);
          white-space: nowrap;
        }
        .wm-marquee__dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.58);
          flex-shrink: 0;
        }
        @keyframes wm-marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .wm-stats {
          padding: 34px 0 0;
        }
        .wm-stats__panel {
          display: grid;
          gap: 1px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          overflow: hidden;
          border-radius: 32px;
          border: 1px solid var(--wm-border-soft);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-stat {
          position: relative;
          padding: 30px 24px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%),
            rgba(19, 13, 9, 0.92);
          overflow: hidden;
        }
        .wm-stat::after {
          content: "";
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 0;
          height: 2px;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.28s ease;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
        }
        .wm-stat:hover::after {
          transform: scaleX(1);
        }
        .wm-stat__value {
          font-family: "Fraunces", Georgia, serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 700;
          color: white;
          line-height: 1;
        }
        .wm-stat__label {
          margin-top: 10px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--wm-text-faint);
        }
        .wm-values,
        .wm-locations,
        .wm-featured,
        .wm-story,
        .wm-testimonials,
        .wm-faq,
        .wm-cta {
          padding: 110px 0;
        }
        .wm-values {
          position: relative;
        }
        .wm-values::before {
          content: "";
          position: absolute;
          inset: 90px auto auto -120px;
          width: 340px;
          height: 340px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(235, 113, 38, 0.09), transparent 70%);
          filter: blur(24px);
          pointer-events: none;
        }
        .wm-values__grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 56px;
        }
        .wm-value-card {
          position: relative;
          padding: 30px 28px;
          min-height: 260px;
          border-radius: 28px;
          border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
            rgba(23, 16, 12, 0.9);
          overflow: hidden;
          transition: transform 0.26s ease, border-color 0.26s ease, box-shadow 0.26s ease;
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-value-card:hover {
          transform: translateY(-4px);
          border-color: var(--wm-amber-border);
          box-shadow: 0 28px 68px rgba(0, 0, 0, 0.4);
        }
        .wm-value-card__number {
          position: absolute;
          top: 18px;
          right: 20px;
          font-family: "Fraunces", Georgia, serif;
          font-size: 64px;
          font-weight: 300;
          color: rgba(255, 207, 128, 0.08);
          line-height: 1;
        }
        .wm-value-card__icon {
          width: 56px;
          height: 56px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          color: #ffd08d;
          background: rgba(235, 113, 38, 0.12);
          border: 1px solid rgba(235, 113, 38, 0.24);
        }
        .wm-value-card__icon svg {
          width: 22px;
          height: 22px;
        }
        .wm-value-card__title {
          margin: 22px 0 0;
          font-size: 28px;
          line-height: 1.1;
        }
        .wm-value-card__copy {
          margin-top: 12px;
          font-size: 14px;
          line-height: 1.75;
          color: var(--wm-text-soft);
        }
        .wm-locations {
          background:
            radial-gradient(circle at 90% 10%, rgba(235, 113, 38, 0.12), transparent 18%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.015) 0%, rgba(255, 255, 255, 0.01) 100%);
        }
        .wm-locations__grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 56px;
        }
        .wm-location-card {
          position: relative;
          padding: 30px;
          min-height: 320px;
          display: flex;
          flex-direction: column;
          border-radius: 30px;
          border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.015) 100%),
            rgba(18, 13, 9, 0.86);
          overflow: hidden;
          box-shadow: var(--wm-shadow-lg);
          transition: transform 0.26s ease, border-color 0.26s ease, box-shadow 0.26s ease;
        }
        .wm-location-card:hover {
          transform: translateY(-4px);
          border-color: var(--wm-amber-border);
          box-shadow: 0 28px 76px rgba(0, 0, 0, 0.42);
        }
        .wm-location-card__glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(235, 113, 38, 0.14), transparent 42%);
          opacity: 0;
          transition: opacity 0.26s ease;
          pointer-events: none;
        }
        .wm-location-card:hover .wm-location-card__glow {
          opacity: 1;
        }
        .wm-location-card__head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }
        .wm-location-card__kicker,
        .wm-location-card__specialty {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .wm-location-card__kicker {
          color: var(--wm-text-faint);
        }
        .wm-location-card__specialty {
          color: #ffcf80;
        }
        .wm-location-card__title {
          margin: 24px 0 0;
          font-size: 38px;
          line-height: 1.02;
        }
        .wm-location-card__copy {
          margin-top: 14px;
          max-width: 28ch;
          font-size: 14px;
          line-height: 1.8;
          color: var(--wm-text-soft);
        }
        .wm-location-card__rail {
          margin-top: 24px;
          width: 54px;
          height: 2px;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
          border-radius: 999px;
        }
        .wm-location-card__actions {
          margin-top: auto;
          padding-top: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }
        .wm-location-card__phone {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--wm-text-soft);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .wm-location-card__phone:hover {
          color: white;
        }
        .wm-featured__top {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .wm-featured__grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 56px;
        }
        .wm-feature-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01)),
            rgba(19, 13, 9, 0.9);
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-feature-card__media {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }
        .wm-feature-card__media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wm-feature-card:hover .wm-feature-card__media img {
          transform: scale(1.08);
        }
        .wm-feature-card__scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(12, 8, 6, 0.08) 0%, rgba(12, 8, 6, 0.75) 100%);
        }
        .wm-feature-card__badge {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 1;
          width: 46px;
          height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(235, 113, 38, 0.88);
          color: white;
          box-shadow: var(--wm-shadow-amber);
        }
        .wm-feature-card__body {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 22px 22px 24px;
        }
        .wm-feature-card__eyebrow-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .wm-feature-card__tag,
        .wm-feature-card__index {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .wm-feature-card__tag {
          color: #ffcf80;
        }
        .wm-feature-card__index {
          color: var(--wm-text-faint);
        }
        .wm-feature-card__title {
          margin: 16px 0 0;
          font-size: 28px;
          line-height: 1.08;
        }
        .wm-feature-card__copy {
          margin-top: 12px;
          font-size: 14px;
          line-height: 1.78;
          color: var(--wm-text-soft);
        }
        .wm-feature-card__footer {
          margin-top: auto;
          padding-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-top: 1px solid var(--wm-border-soft);
        }
        .wm-feature-card__price {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.62);
        }
        .wm-story {
          position: relative;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.015) 0%, rgba(255, 255, 255, 0.01) 100%);
        }
        .wm-story::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.04;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px);
          background-size: 86px 86px;
          mask-image: linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%);
        }
        .wm-story__layout {
          position: relative;
          display: grid;
          gap: 56px;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.96fr);
          align-items: center;
        }
        .wm-story__lead {
          margin: 22px 0 0;
          padding-left: 18px;
          border-left: 2px solid var(--wm-amber);
          font-family: "Fraunces", Georgia, serif;
          font-size: 20px;
          font-style: italic;
          line-height: 1.7;
          color: rgba(250, 244, 237, 0.86);
        }
        .wm-story__body {
          margin-top: 18px;
          font-size: 15px;
          line-height: 1.85;
          color: var(--wm-text-soft);
        }
        .wm-story__points {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }
        .wm-story__point {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: var(--wm-text-soft);
          font-size: 14px;
          line-height: 1.65;
        }
        .wm-story__point svg {
          width: 16px;
          height: 16px;
          color: #ffcf80;
          margin-top: 3px;
          flex-shrink: 0;
        }
        .wm-story__actions {
          margin-top: 28px;
        }
        .wm-story__media {
          position: relative;
          min-height: 580px;
        }
        .wm-story__frame {
          position: absolute;
          inset: 0 0 70px 0;
          overflow: hidden;
          border-radius: 34px;
          border: 1px solid var(--wm-border);
          box-shadow: var(--wm-shadow-xl);
        }
        .wm-story__frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wm-story__frame::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(12, 8, 6, 0.06) 0%, rgba(12, 8, 6, 0.7) 100%);
        }
        .wm-story__caption {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 22px;
          z-index: 1;
          font-family: "Fraunces", Georgia, serif;
          font-size: 20px;
          font-style: italic;
          color: rgba(250, 244, 237, 0.92);
        }
        .wm-story__mini {
          position: absolute;
          right: -16px;
          bottom: 0;
          width: min(260px, 42%);
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(18, 13, 9, 0.92);
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-story__mini img {
          aspect-ratio: 4 / 3;
          width: 100%;
          object-fit: cover;
        }
        .wm-story__mini-copy {
          padding: 16px 18px 18px;
        }
        .wm-story__mini-eyebrow {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffcf80;
        }
        .wm-story__mini-title {
          margin-top: 8px;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.35;
        }
        .wm-story__floating-stat {
          position: absolute;
          left: -18px;
          top: 28px;
          padding: 18px 20px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(18, 13, 9, 0.82);
          backdrop-filter: blur(14px);
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-story__floating-value {
          font-family: "Fraunces", Georgia, serif;
          font-size: 40px;
          font-weight: 700;
          line-height: 1;
          color: white;
        }
        .wm-story__floating-label {
          margin-top: 8px;
          max-width: 14ch;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--wm-text-faint);
          line-height: 1.45;
        }
        .wm-testimonials__grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 56px;
        }
        .wm-review-card {
          position: relative;
          min-height: 100%;
          padding: 28px 26px 30px;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
            rgba(19, 13, 9, 0.9);
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-review-card__quote-mark {
          position: absolute;
          top: -12px;
          right: 18px;
          font-family: "Fraunces", Georgia, serif;
          font-size: 118px;
          color: rgba(255, 207, 128, 0.08);
          line-height: 1;
          pointer-events: none;
        }
        .wm-review-card__stars {
          display: flex;
          gap: 4px;
          color: var(--wm-gold);
        }
        .wm-review-card__stars svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
        }
        .wm-review-card__quote {
          position: relative;
          margin: 18px 0 0;
          font-family: "Fraunces", Georgia, serif;
          font-size: 22px;
          line-height: 1.55;
          color: rgba(250, 244, 237, 0.92);
        }
        .wm-review-card__rail {
          width: 38px;
          height: 2px;
          margin: 20px 0 16px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
        }
        .wm-review-card__author {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.84);
        }
        .wm-review-card__location {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--wm-text-faint);
        }
        .wm-faq {
          background:
            radial-gradient(circle at 84% 14%, rgba(235, 113, 38, 0.1), transparent 18%),
            rgba(255, 255, 255, 0.015);
        }
        .wm-faq__cols {
          display: grid;
          gap: 24px 36px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 56px;
        }
        .wm-help-card {
          margin-bottom: 18px;
          padding: 22px 22px 24px;
          border-radius: 26px;
          border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
            rgba(18, 13, 9, 0.86);
          box-shadow: var(--wm-shadow-lg);
        }
        .wm-help-card__eyebrow {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #ffcf80;
        }
        .wm-help-card__title {
          margin: 10px 0 0;
          font-size: 26px;
          line-height: 1.1;
        }
        .wm-help-card__copy {
          margin-top: 12px;
          font-size: 14px;
          line-height: 1.75;
          color: var(--wm-text-soft);
        }
        .wm-help-card__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 18px;
        }
        .wm-faq-item {
          border-bottom: 1px solid var(--wm-border-soft);
        }
        .wm-faq-button {
          width: 100%;
          padding: 22px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
        }
        .wm-faq-question {
          font-size: 15px;
          line-height: 1.55;
          color: var(--wm-text-soft);
          transition: color 0.22s ease;
        }
        .wm-faq-button.is-open .wm-faq-question,
        .wm-faq-button:hover .wm-faq-question {
          color: white;
        }
        .wm-faq-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #ffcf80;
          border: 1px solid rgba(235, 113, 38, 0.24);
        }
        .wm-faq-icon svg {
          width: 14px;
          height: 14px;
        }
        .wm-faq-answer {
          overflow: hidden;
        }
        .wm-faq-answer__inner {
          padding: 0 0 20px;
          font-size: 14px;
          line-height: 1.8;
          color: var(--wm-text-soft);
        }
        .wm-cta {
          padding-top: 34px;
        }
        .wm-cta__panel {
          position: relative;
          overflow: hidden;
          display: grid;
          gap: 24px;
          align-items: center;
          grid-template-columns: minmax(0, 1fr) auto;
          padding: 54px;
          border-radius: 36px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background-size: cover;
          background-position: center;
          box-shadow: var(--wm-shadow-xl);
        }
        .wm-cta__panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(110deg, rgba(16, 11, 8, 0.92) 0%, rgba(16, 11, 8, 0.74) 48%, rgba(16, 11, 8, 0.54) 100%),
            radial-gradient(circle at 18% 40%, rgba(235, 113, 38, 0.22), transparent 40%);
        }
        .wm-cta__panel > * {
          position: relative;
          z-index: 1;
        }
        .wm-cta__eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffcf80;
        }
        .wm-cta__title {
          margin: 14px 0 0;
          font-size: clamp(38px, 4.4vw, 64px);
          line-height: 1;
        }
        .wm-cta__copy {
          margin-top: 14px;
          max-width: 560px;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(250, 244, 237, 0.78);
        }
        .wm-cta__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }
        @media (min-width: 1040px) {
          .wm-hero__inner {
            grid-template-columns: minmax(0, 1.02fr) minmax(430px, 0.98fr);
            padding-top: 150px;
          }
        }
        @media (max-width: 1180px) {
          .wm-values__grid,
          .wm-featured__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .wm-locations__grid,
          .wm-testimonials__grid,
          .wm-story__layout {
            grid-template-columns: 1fr;
          }
          .wm-story__media {
            min-height: 540px;
          }
        }
        @media (max-width: 960px) {
          .wm-stats__panel,
          .wm-hero__signals,
          .wm-faq__cols {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .wm-cta__panel {
            grid-template-columns: 1fr;
          }
          .wm-showcase__grid {
            grid-template-columns: 1fr;
          }
          .wm-showcase__mini {
            min-height: 150px;
          }
        }
        @media (max-width: 720px) {
          .wm-values,
          .wm-locations,
          .wm-featured,
          .wm-story,
          .wm-testimonials,
          .wm-faq,
          .wm-cta {
            padding: 82px 0;
          }
          .wm-section {
            width: min(1320px, calc(100vw - 24px));
          }
          .wm-hero__inner {
            padding: 122px 0 90px;
          }
          .wm-hero__title {
            font-size: clamp(52px, 14vw, 74px);
          }
          .wm-hero__sub {
            font-size: 15px;
          }
          .wm-showcase__hero {
            min-height: 360px;
          }
          .wm-stats__panel,
          .wm-values__grid,
          .wm-locations__grid,
          .wm-featured__grid,
          .wm-testimonials__grid,
          .wm-faq__cols {
            grid-template-columns: 1fr;
          }
          .wm-story__media {
            min-height: 460px;
          }
          .wm-story__frame {
            inset: 0 0 52px;
          }
          .wm-story__mini {
            right: 0;
            width: min(240px, 62%);
          }
          .wm-story__floating-stat {
            left: 12px;
            top: 12px;
          }
          .wm-cta__panel {
            padding: 36px 26px;
            border-radius: 28px;
          }
          .wm-cta__actions,
          .wm-help-card__actions,
          .wm-hero__actions {
            flex-direction: column;
            align-items: stretch;
          }
          .wm-button,
          .wm-button--small {
            width: 100%;
          }
        }
        @media (hover: none) {
          .wm-button:hover,
          .wm-link:hover,
          .wm-value-card:hover,
          .wm-location-card:hover {
            transform: none;
          }
          .wm-feature-card:hover .wm-feature-card__media img {
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
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
        <section ref={heroRef} className="wm-hero">
          <motion.div
            className="wm-hero__bg"
            style={{
              backgroundImage: `url(${heroSlide})`,
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
                  <strong>Maryland Favorite</strong> since {SITE.established}
                </span>
              </div>
              <h1 className="wm-display wm-hero__title">
                {["Come Hungry.", "Leave Happy."].map((line, index) => (
                  <span key={line} className={`wm-hero__line${index === 1 ? " wm-hero__line--accent" : ""}`}>
                    <motion.span
                      initial={{ y: "110%", rotateX: 12 }}
                      animate={{ y: "0%", rotateX: 0 }}
                      transition={{
                        duration: 0.95,
                        delay: 0.08 + index * 0.16,
                        ease: [0.22, 1, 0.36, 1],
                      }}
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
                Fresh pizza, famous fried chicken, stacked subs, crisp salads, and breakfast favorites served fast
                with the kind of warmth that turns first-timers into regulars.
              </motion.p>
              <motion.div
                className="wm-hero__actions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.55 }}
              >
                <Link to="/order" className="wm-button wm-button--primary">
                  Order Now <ArrowRight />
                </Link>
                <Link to="/locations" className="wm-button wm-button--ghost">
                  Find Your Location
                </Link>
              </motion.div>
              <motion.div
                className="wm-hero__chips"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.7 }}
              >
                <span className="wm-chip">
                  <Leaf />
                  Fresh prep every morning
                </span>
                <span className="wm-chip">
                  <Clock />
                  Breakfast through dinner
                </span>
                <span className="wm-chip">
                  <Users />
                  Family favorite since {SITE.established}
                </span>
              </motion.div>
              <motion.div
                className="wm-hero__signals"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.82 }}
              >
                {[
                  {
                    icon: Star,
                    label: "4.8 average rating",
                    copy: "A local go-to for comfort food that actually earns repeat visits.",
                  },
                  {
                    icon: MapPin,
                    label: "3 Maryland locations",
                    copy: "Sharptown, East New Market, and Vienna, each with its own loyal crowd.",
                  },
                  {
                    icon: Award,
                    label: `${yearsServing}+ years serving`,
                    copy: "The same promise since day one: good food, fast, at a fair price.",
                  },
                ].map((item) => (
                  <div key={item.label} className="wm-hero__signal">
                    <div className="wm-hero__signal-top">
                      <item.icon />
                      {item.label}
                    </div>
                    <div className="wm-hero__signal-copy">{item.copy}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              className="wm-showcase"
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.86, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="wm-showcase__hero" enabled={interactiveMotion} strength={4} interactive>
                <img src={heroChicken} alt="Wise Mart fried chicken and comfort food spread" />
                <div className="wm-showcase__hero-copy">
                  <span className="wm-showcase__label">Crowd Favorite</span>
                  <h2 className="wm-display wm-showcase__title">Fast comfort food with real personality.</h2>
                  <p className="wm-showcase__copy">
                    Pizza, fried chicken, subs, salads, and breakfast done with speed, flavor, and none of the chain-store blandness.
                  </p>
                  <div className="wm-showcase__cta">
                    <Link to="/order" className="wm-link">
                      Start Your Order <ArrowRight />
                    </Link>
                  </div>
                </div>
                <div className="wm-showcase__stamp">
                  <small>Serving Since</small>
                  <strong>{SITE.established}</strong>
                </div>
              </TiltCard>
              <div className="wm-showcase__grid">
                {FEATURED.slice(0, 3).map((item) => (
                  <TiltCard
                    key={item.name}
                    className="wm-showcase__mini"
                    enabled={interactiveMotion}
                    strength={5}
                    interactive
                  >
                    <img src={item.img} alt={item.name} loading="lazy" />
                    <div className="wm-showcase__mini-copy">
                      <div className="wm-showcase__mini-tag">{item.tag}</div>
                      <div className="wm-showcase__mini-name">{item.name}</div>
                      <div className="wm-showcase__mini-price">{item.price}</div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="wm-scroll-cue">
            <div className="wm-scroll-cue__track" />
            <span>Scroll</span>
          </div>
        </section>
        <section className="wm-marquee" aria-label="Highlights">
          <div className="wm-marquee__track">
            {Array.from({ length: 2 }).map((_, pass) =>
              MARQUEE_ITEMS.map((item, index) => (
                <div key={`${pass}-${index}`} className="wm-marquee__item">
                  {item}
                  <span className="wm-marquee__dot" />
                </div>
              )),
            )}
          </div>
        </section>
        <section className="wm-stats">
          <div className="wm-section">
            <div className="wm-stats__panel">
              {[
                { value: <CountUp to={3} />, label: "Locations" },
                { value: <CountUp to={yearsServing} suffix="+" />, label: "Years Serving" },
                { value: <CountUp to={50} suffix="+" />, label: "Menu Favorites" },
                { value: <CountUp to={4.8} decimals={1} />, label: "Average Rating" },
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
        <section className="wm-values">
          <div className="wm-section">
            <SectionIntro
              eyebrow="Why Wise Mart"
              title={
                <>
                  Comfort food that feels <br />
                  <em>deliberate, not generic.</em>
                </>
              }
              body="Fresh prep, fast service, generous portions, and small-town hospitality have shaped every order since 2010."
              align="center"
            />
            <div className="wm-values__grid">
              {VALUES.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="wm-value-card"
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.56, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="wm-value-card__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="wm-value-card__icon">
                    <value.icon />
                  </span>
                  <h3 className="wm-display wm-value-card__title">{value.title}</h3>
                  <p className="wm-value-card__copy">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="wm-locations">
          <div className="wm-section">
            <SectionIntro
              eyebrow="Three Locations"
              title={
                <>
                  Pick the Wise Mart <br />
                  <em>closest to your appetite.</em>
                </>
              }
              body="Each location keeps the same food-first attitude, but every town brings its own personality to the counter."
              align="center"
            />
            <div className="wm-locations__grid">
              {LOCATIONS.map((location, index) => (
                <LocationCard key={location.slug} location={location} index={index} />
              ))}
            </div>
          </div>
        </section>
        <section className="wm-featured">
          <div className="wm-section">
            <div className="wm-featured__top">
              <SectionIntro
                eyebrow="Featured Menu"
                title={
                  <>
                    The food people <br />
                    <em>talk about first.</em>
                  </>
                }
                body="From pizza nights and chicken runs to loaded subs and fresh salads, these are the menu staples guests come back for most."
              />
              <Link to="/locations" className="wm-link">
                Browse Full Menus <ArrowRight />
              </Link>
            </div>
            <div className="wm-featured__grid">
              {FEATURED.map((item, index) => (
                <FeaturedCard key={item.name} item={item} index={index} tiltEnabled={interactiveMotion} />
              ))}
            </div>
          </div>
        </section>
        <section className="wm-story">
          <div className="wm-section">
            <div className="wm-story__layout">
              <motion.div
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
              >
                <SectionIntro
                  eyebrow="Our Story"
                  title={
                    <>
                      More than a quick stop. <br />
                      <em>A Maryland routine.</em>
                    </>
                  }
                  body="Wise Mart started with a simple belief: if the food is honest and the service is warm, people remember it."
                />
                <p className="wm-story__lead">
                  "Serve good food, fast, at a fair price, and treat every guest like family."
                </p>
                <p className="wm-story__body">
                  That idea has guided Wise Mart since {SITE.established}. From Sharptown pizza nights to Vienna breakfast runs and East New Market sub cravings, the experience stays grounded in consistency, hospitality, and food worth repeating.
                </p>
                <div className="wm-story__points">
                  {STORY_POINTS.map((point) => (
                    <div key={point} className="wm-story__point">
                      <Sparkles />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                <div className="wm-story__actions">
                  <Link to="/about" className="wm-link">
                    Read Our Full Story <ArrowRight />
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="wm-story__media"
                initial={{ opacity: 0, x: 28, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.68, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="wm-story__frame">
                  <img src={heroPizza} alt="Wise Mart pizza prepared by hand" loading="lazy" />
                  <div className="wm-story__caption">Made by hand. Served with pride.</div>
                </div>
                <div className="wm-story__floating-stat">
                  <div className="wm-story__floating-value">
                    <CountUp to={yearsServing} suffix="+" />
                  </div>
                  <div className="wm-story__floating-label">years of neighborhood favorites</div>
                </div>
                <div className="wm-story__mini">
                  <img src={heroSalad} alt="Fresh daily-prepped salad at Wise Mart" loading="lazy" />
                  <div className="wm-story__mini-copy">
                    <div className="wm-story__mini-eyebrow">Daily Fresh</div>
                    <div className="wm-story__mini-title">Prep that keeps the fast food feeling genuinely fresh.</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="wm-testimonials">
          <div className="wm-section">
            <SectionIntro
              eyebrow="Guest Reviews"
              title={
                <>
                  The regulars tell the story <br />
                  <em>better than we can.</em>
                </>
              }
              body="From breakfast regulars to late-night pizza runs, the best proof is the people who keep coming back."
              align="center"
            />
            <div className="wm-testimonials__grid">
              {TESTIMONIALS.map((testimonial, index) => (
                <ReviewCard
                  key={testimonial.author}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  location={testimonial.location}
                  index={index}
                  tiltEnabled={interactiveMotion}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="wm-faq">
          <div className="wm-section">
            <SectionIntro
              eyebrow="Quick Answers"
              title={
                <>
                  Questions guests ask <br />
                  <em>all the time.</em>
                </>
              }
              body="Ordering, hours, catering, dietary questions, and the details most guests want before they visit."
              align="center"
            />
            <div className="wm-faq__cols">
              <div>
                {FAQS.slice(0, 5).map((item, index) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} index={index} />
                ))}
              </div>
              <div>
                <motion.div
                  className="wm-help-card"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wm-help-card__eyebrow">Need Something Else?</div>
                  <h3 className="wm-display wm-help-card__title">Menu details, pickup times, and location info are one tap away.</h3>
                  <p className="wm-help-card__copy">
                    See menus, call the shop, or head straight into your order. However you like to decide, the next step is close.
                  </p>
                  <div className="wm-help-card__actions">
                    <Link to="/locations" className="wm-button wm-button--ghost wm-button--small">
                      See Locations
                    </Link>
                    <Link to="/order" className="wm-button wm-button--primary wm-button--small">
                      Start Order
                    </Link>
                  </div>
                </motion.div>
                {FAQS.slice(5).map((item, index) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} index={index + 5} />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="wm-cta">
          <div className="wm-section">
            <motion.div
              className="wm-cta__panel"
              style={{
                backgroundImage: `url(${heroSlide})`,
              }}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <div className="wm-cta__eyebrow">Ready When You Are</div>
                <h2 className="wm-display wm-cta__title">Pick a location, place the order, and show up hungry.</h2>
                <p className="wm-cta__copy">
                  Choose your nearest Wise Mart, build the order, and we will have the comfort food part covered.
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