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
import {
  ArrowRight,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
  Star,
  Users,
  Award,
} from "lucide-react";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { LOCATIONS, SITE } from "@/data/site";
import bannerImg from "@/assets/banner-5.webp";
import imgSharptown from "@/assets/sharpown.webp";
import imgEastNew from "@/assets/east-new.webp";
import imgVienna from "@/assets/vienna.webp";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      {
        title: "Locations - Wise Mart | Sharptown - East New Market - Vienna, MD",
      },
      {
        name: "description",
        content:
          "Find your nearest Wise Mart. Three Maryland locations with hours, phone numbers, and directions.",
      },
      { property: "og:title", content: "Wise Mart Locations" },
      {
        property: "og:description",
        content: "Three Maryland kitchens. One promise.",
      },
    ],
  }),
  component: LocationsPage,
});

type DetailIcon = ComponentType<{ style?: CSSProperties; className?: string }>;

type LocationSeed = {
  slug: "sharptown" | "east-new-market" | "vienna";
  fallbackName: string;
  fallbackAddress: string;
  fallbackPhone: string;
  fallbackPhoneHref: string;
  fallbackHours: string;
  fallbackSpecialty: string;
  fallbackTagline: string;
  photo: string;
  accentAngle: string;
};

type LocationCardData = {
  slug: LocationSeed["slug"];
  name: string;
  index: number;
  state: string;
  address: string;
  phone: string;
  phoneHref: string;
  hours: string;
  specialty: string;
  tagline: string;
  photo: string;
  mapsUrl: string;
  directionsUrl: string;
  accentAngle: string;
};

type LocationDataOverrides = Partial<
  Pick<
    LocationCardData,
    "name" | "address" | "phone" | "phoneHref" | "hours" | "specialty" | "tagline"
  >
>;

const LOCATION_SEEDS: readonly LocationSeed[] = [
  {
    slug: "sharptown",
    fallbackName: "Sharptown",
    fallbackAddress: "806 Main St, Sharptown, MD 21861",
    fallbackPhone: "(410) 883-3648",
    fallbackPhoneHref: "tel:+14108833648",
    fallbackHours: "Sun-Thu 10 AM-10 PM / Fri-Sat 10 AM-11 PM",
    fallbackSpecialty: "Fresh Dough Pizza / Fried Chicken",
    fallbackTagline:
      "Our flagship kitchen — hand-stretched pizza and famous double-fried chicken, made fresh every day since 2010.",
    photo: imgSharptown,
    accentAngle: "135deg",
  },
  {
    slug: "east-new-market",
    fallbackName: "East New Market",
    fallbackAddress: "5703 Mt Holly Rd, East New Market, MD 21631",
    fallbackPhone: "(410) 943-6270",
    fallbackPhoneHref: "tel:+14109436270",
    fallbackHours: "Sun-Thu 10 AM-10 PM / Fri-Sat 10 AM-11 PM",
    fallbackSpecialty: "Hot Subs / Combo Meals",
    fallbackTagline:
      "Hearty subs, hot sandwiches, and generous combo meals built for the whole crew.",
    photo: imgEastNew,
    accentAngle: "225deg",
  },
  {
    slug: "vienna",
    fallbackName: "Vienna",
    fallbackAddress: "307 Ocean Gateway, Vienna, MD 21869",
    fallbackPhone: "(410) 376-3299",
    fallbackPhoneHref: "tel:+14103763299",
    fallbackHours: "Sun-Thu 10 AM-10 PM / Fri-Sat 10 AM-11 PM",
    fallbackSpecialty: "Fresh Salads / Breakfast",
    fallbackTagline:
      "Fresh salads, breakfast plates, and lighter fare — served with the same Wise Mart care.",
    photo: imgVienna,
    accentAngle: "315deg",
  },
] as const;

function buildMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function buildDirectionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

const LOCATION_DATA: readonly LocationCardData[] = LOCATION_SEEDS.map((seed, index) => {
  const base = LOCATIONS.find((loc) => loc.slug === seed.slug) as LocationDataOverrides | undefined;
  const address = base?.address ?? seed.fallbackAddress;

  return {
    slug: seed.slug,
    name: base?.name ?? seed.fallbackName,
    index: index + 1,
    state: "MD",
    address,
    phone: base?.phone ?? seed.fallbackPhone,
    phoneHref: base?.phoneHref ?? seed.fallbackPhoneHref,
    hours: base?.hours ?? seed.fallbackHours,
    specialty: base?.specialty ?? seed.fallbackSpecialty,
    tagline: base?.tagline ?? seed.fallbackTagline,
    photo: seed.photo,
    mapsUrl: buildMapsUrl(address),
    directionsUrl: buildDirectionsUrl(address),
    accentAngle: seed.accentAngle,
  };
});

// ─── Fine Pointer Hook ────────────────────────────────────────────────────────
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

// ─── Tilt Hook ────────────────────────────────────────────────────────────────
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

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (!enabled) return;
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

// ─── TiltCard Component ───────────────────────────────────────────────────────
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

// ─── CountUp ──────────────────────────────────────────────────────────────────
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
    if (!inView) return;
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
      if (progress < 1) frame = window.requestAnimationFrame(tick);
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

// ─── SectionIntro ─────────────────────────────────────────────────────────────
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

// ─── DetailRow ────────────────────────────────────────────────────────────────
function DetailRow({
  icon: Icon,
  children,
  href,
}: {
  icon: DetailIcon;
  children: ReactNode;
  href?: string;
}) {
  const content = href ? (
    <a href={href} className="wm-detail-link">
      {children}
    </a>
  ) : (
    <span>{children}</span>
  );

  return (
    <li className="wm-detail-row">
      <Icon style={{ width: 14, height: 14 }} />
      {content}
    </li>
  );
}

// ─── LocationCard ─────────────────────────────────────────────────────────────
function LocationCard({ loc, index }: { loc: LocationCardData; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const interactiveMotion = finePointer && !prefersReducedMotion;
  const flip = index % 2 !== 0;

  return (
    <motion.div
      role="listitem"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 56, scale: 0.95 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard
        className={`wm-loc-card${flip ? " wm-loc-card--flip" : ""}`}
        enabled={interactiveMotion}
        strength={4}
        interactive
      >
        <article
          id={`loc-${loc.slug}`}
          aria-label={`Wise Mart ${loc.name} location`}
          style={{ display: "contents" }}
        >
          {/* Accent edge */}
          <div
            className="wm-loc-card__edge"
            style={{
              background: `linear-gradient(${loc.accentAngle}, rgba(235,113,38,0.9) 0%, rgba(242,188,89,0.5) 42%, transparent 88%)`,
            }}
          />

          {/* Photo */}
          <div className="wm-loc-card__photo">
            <img
              src={loc.photo}
              alt={`Wise Mart ${loc.name}`}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
            <div className="wm-loc-card__photo-scrim" />

            <a
              href={loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wm-loc-card__pin"
              aria-label={`View ${loc.name} on Google Maps`}
            >
              <MapPin style={{ width: 18, height: 18 }} />
            </a>

            <span className="wm-loc-card__watermark" aria-hidden="true">
              0{loc.index}
            </span>

            <div className="wm-loc-card__ribbon">
              <span>{loc.specialty}</span>
            </div>
          </div>

          {/* Info */}
          <div className="wm-loc-card__info">
            <div className="wm-loc-card__meta">
              <span className="wm-loc-card__kicker">Location 0{loc.index} / Maryland</span>
              <span className="wm-loc-card__state-badge">{loc.state}</span>
            </div>

            <h2 className="wm-display wm-loc-card__name">{loc.name}</h2>
            <div className="wm-loc-card__rule" />
            <p className="wm-loc-card__tagline">{loc.tagline}</p>

            <ul className="wm-detail-list" aria-label="Location details">
              <DetailRow icon={MapPin}>{loc.address}</DetailRow>
              <DetailRow icon={Clock}>{loc.hours}</DetailRow>
              <DetailRow icon={Phone} href={loc.phoneHref}>
                {loc.phone}
              </DetailRow>
            </ul>

            <div className="wm-loc-card__actions">
              <a href={loc.phoneHref} className="wm-button wm-button--primary wm-button--small">
                <Phone style={{ width: 13, height: 13 }} />
                Call Now
              </a>

              <a
                href={loc.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wm-button wm-button--ghost wm-button--small"
              >
                <Navigation style={{ width: 13, height: 13 }} />
                Directions
                <ExternalLink style={{ width: 11, height: 11, opacity: 0.55 }} />
              </a>

              <Link
                to="/menu/$location"
                params={{ location: loc.slug }}
                className="wm-link"
              >
                View Menu
                <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function LocationsPage() {
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

  const establishedYear =
    Number((SITE as Partial<{ established: number | string }>).established ?? 2010) || 2010;
  const yearsServing = Math.max(1, new Date().getFullYear() - establishedYear);

  const tickerItems = [
    "Sharptown, MD",
    "East New Market, MD",
    "Vienna, MD",
    "Fresh Daily",
    "Open 7 Days",
    `Since ${establishedYear}`,
    "Dine-In / Takeout / Delivery",
  ];

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

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: var(--wm-ink); }
        img { display: block; max-width: 100%; }

        /* ── Page Shell ─────────────────────────────────── */
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

        /* ── Custom Cursor ──────────────────────────────── */
        .wm-cursor-outer,
        .wm-cursor-inner {
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 31;
        }
        .wm-cursor-outer {
          width: 44px; height: 44px;
          margin-top: -22px; margin-left: -22px;
          border-radius: 999px;
          border: 1px solid rgba(255, 207, 128, 0.6);
          background: rgba(235, 113, 38, 0.08);
          transition: width 0.24s ease, height 0.24s ease, margin 0.24s ease,
            border-color 0.24s ease, background 0.24s ease;
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
          border-radius: 999px;
          background: #ffcf80;
          box-shadow: 0 0 24px rgba(255, 207, 128, 0.55);
        }

        /* ── Layout ─────────────────────────────────────── */
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

        /* ── Eyebrow / Intro ────────────────────────────── */
        .wm-intro { position: relative; }
        .wm-intro--center { text-align: center; }

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
          width: 30px; height: 1px;
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
        .wm-intro--center .wm-intro__action { justify-content: center; }

        /* ── Buttons ────────────────────────────────────── */
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
          border: none;
          cursor: pointer;
          transition:
            transform 0.24s ease,
            box-shadow 0.24s ease,
            background 0.24s ease,
            border-color 0.24s ease,
            color 0.24s ease;
        }
        .wm-button svg,
        .wm-link svg,
        .wm-loc-detail-link svg {
          width: 14px; height: 14px;
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
        .wm-button--amber-outline {
          color: #ffcf80;
          border: 1px solid rgba(235, 113, 38, 0.36);
          background: rgba(235, 113, 38, 0.08);
        }
        .wm-button--amber-outline:hover {
          transform: translateY(-2px);
          border-color: var(--wm-amber);
          background: rgba(235, 113, 38, 0.16);
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
        .wm-link:hover { gap: 14px; color: white; }

        /* ── Hero ───────────────────────────────────────── */
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
          background-position: center 60%;
          background-size: cover;
          will-change: transform;
        }
        .wm-hero__overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(110deg, rgba(9, 6, 4, 0.96) 0%, rgba(9, 6, 4, 0.84) 42%, rgba(9, 6, 4, 0.4) 74%, rgba(9, 6, 4, 0.14) 100%),
            linear-gradient(180deg, rgba(9, 6, 4, 0.35) 0%, rgba(9, 6, 4, 0.96) 100%);
        }
        .wm-hero__noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 170px 170px;
        }
        .wm-hero__beam {
          position: absolute;
          inset: auto -10% 8% auto;
          width: 45vw; height: 45vw;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(242, 188, 89, 0.12) 0%, rgba(235, 113, 38, 0.08) 25%, transparent 70%);
          filter: blur(16px);
          pointer-events: none;
        }
        .wm-hero__orb {
          position: absolute;
          inset: 12% auto auto 8%;
          width: 260px; height: 260px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(235, 113, 38, 0.18) 0%, transparent 68%);
          filter: blur(28px);
          pointer-events: none;
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
        .wm-hero__copy { max-width: 670px; }

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
          width: 30px; height: 30px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f4a756 0%, #eb7126 100%);
          box-shadow: 0 0 0 5px rgba(235, 113, 38, 0.12);
        }
        .wm-hero__badge-icon svg { width: 14px; height: 14px; color: white; }
        .wm-hero__badge-copy {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--wm-text-soft);
        }
        .wm-hero__badge-copy strong { color: white; }

        .wm-hero__title {
          margin: 28px 0 0;
          font-size: clamp(62px, 9vw, 118px);
        }
        .wm-hero__line {
          display: block;
          overflow: hidden;
        }
        .wm-hero__line span { display: block; }
        .wm-hero__line--accent span {
          background: linear-gradient(90deg, #ffe3b1 0%, #f4a756 22%, #eb7126 55%, #ffcf80 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: wm-shimmer 7s linear infinite;
          background-size: 220% auto;
        }
        @keyframes wm-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
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
        .wm-hero__signal-top svg { width: 14px; height: 14px; }
        .wm-hero__signal-copy {
          margin-top: 10px;
          font-size: 13px;
          line-height: 1.7;
          color: var(--wm-text-soft);
        }

        /* Scroll Cue */
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
          width: 1px; height: 54px;
          background: rgba(255, 255, 255, 0.12);
          position: relative;
          overflow: hidden;
        }
        .wm-scroll-cue__track::after {
          content: "";
          position: absolute;
          top: -100%; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(180deg, transparent, #ffcf80, transparent);
          animation: wm-scroll-drop 2.15s ease-in-out infinite;
        }
        @keyframes wm-scroll-drop {
          0% { top: -100%; opacity: 0; }
          20% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* ── Marquee ────────────────────────────────────── */
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
          top: 0; bottom: 0;
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
          width: 5px; height: 5px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.58);
          flex-shrink: 0;
        }
        @keyframes wm-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ── Stats Bar ──────────────────────────────────── */
        .wm-stats { padding: 34px 0 0; }
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
          left: 24px; right: 24px; bottom: 0;
          height: 2px;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.28s ease;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
        }
        .wm-stat:hover::after { transform: scaleX(1); }
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

        /* ── Jump Nav ───────────────────────────────────── */
        .wm-jumpnav { padding: 56px 0 0; }
        .wm-jumpnav__inner {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }
        .wm-jumpnav__link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1px solid rgba(250, 244, 237, 0.12);
          background: rgba(250, 244, 237, 0.04);
          color: var(--wm-text-soft);
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: border-color 0.22s ease, color 0.22s ease, background 0.22s ease, transform 0.22s ease;
        }
        .wm-jumpnav__link:hover {
          transform: translateY(-2px);
          border-color: var(--wm-amber-border);
          color: var(--wm-text);
          background: var(--wm-amber-soft);
        }
        .wm-jumpnav__dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--wm-amber);
          flex-shrink: 0;
        }

        /* ── Location Cards ─────────────────────────────── */
        .wm-locations-section { padding: 64px 0 100px; }

        .wm-loc-card {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          overflow: hidden;
          border-radius: var(--wm-radius-xl);
          border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.018) 0%, transparent 14%),
            rgba(19, 13, 9, 0.9);
          box-shadow: var(--wm-shadow-lg);
          transition: border-color 0.4s ease, box-shadow 0.45s ease;
        }
        .wm-loc-card:hover {
          border-color: var(--wm-amber-border);
          box-shadow: var(--wm-shadow-xl), 0 0 0 1px rgba(235, 113, 38, 0.08);
        }
        .wm-loc-card--flip { direction: rtl; }
        .wm-loc-card--flip > * { direction: ltr; }

        .wm-loc-card__edge {
          position: absolute;
          inset: 0 auto 0 0;
          width: 2px;
          z-index: 2;
          opacity: 0.85;
          pointer-events: none;
        }
        .wm-loc-card--flip .wm-loc-card__edge { inset: 0 0 0 auto; }

        /* Photo */
        .wm-loc-card__photo {
          position: relative;
          z-index: 1;
          min-height: 420px;
          overflow: hidden;
          background: #161412;
        }
        .wm-loc-card__photo img {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center;
          filter: saturate(0.78) brightness(0.86);
          transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease;
        }
        .wm-loc-card:hover .wm-loc-card__photo img {
          transform: scale(1.06);
          filter: saturate(1) brightness(0.94);
        }
        .wm-loc-card__photo-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(to bottom, transparent 52%, rgba(12, 8, 6, 0.72) 100%);
        }
        .wm-loc-card__pin {
          position: absolute;
          top: 18px; left: 18px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px; height: 46px;
          border-radius: 50%;
          background: var(--wm-amber);
          color: #fff;
          text-decoration: none;
          box-shadow: var(--wm-shadow-amber);
          transition: background 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          animation: wm-pin-float 2.4s ease-in-out infinite;
        }
        .wm-loc-card__pin:hover {
          animation: none;
          background: var(--wm-amber-deep);
          box-shadow: 0 12px 36px rgba(235, 113, 38, 0.62);
          transform: scale(1.12);
        }
        @keyframes wm-pin-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px) scale(1.06); }
        }
        .wm-loc-card__watermark {
          position: absolute;
          right: 14px; bottom: -14px;
          z-index: 2;
          color: rgba(255, 255, 255, 0.06);
          font-family: "Fraunces", Georgia, serif;
          font-size: 108px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.04em;
          user-select: none;
          pointer-events: none;
        }
        .wm-loc-card__ribbon {
          position: absolute;
          left: 18px; bottom: 18px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid var(--wm-amber-border);
          background: rgba(12, 8, 6, 0.72);
          backdrop-filter: blur(10px);
        }
        .wm-loc-card__ribbon span {
          color: #ffcf80;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        /* Info */
        .wm-loc-card__info {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 44px 48px;
        }
        .wm-loc-card__meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 4px;
        }
        .wm-loc-card__kicker {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--wm-text-faint);
        }
        .wm-loc-card__state-badge {
          padding: 2px 8px;
          border-radius: 50px;
          border: 1px solid var(--wm-border);
          color: rgba(250, 244, 237, 0.22);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .wm-loc-card__name {
          margin-top: 10px;
          font-size: clamp(36px, 4vw, 52px);
        }
        .wm-loc-card__rule {
          width: 38px; height: 2px;
          margin: 20px 0;
          border-radius: 2px;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .wm-loc-card:hover .wm-loc-card__rule { width: 58px; }
        .wm-loc-card__tagline {
          max-width: 380px;
          color: var(--wm-text-soft);
          font-size: 14px;
          font-weight: 400;
          line-height: 1.8;
        }

        /* Detail list */
        .wm-detail-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 22px 0 0;
          padding: 0;
          list-style: none;
        }
        .wm-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          color: var(--wm-text-soft);
          font-size: 12.5px;
          line-height: 1.55;
        }
        .wm-detail-row svg {
          flex-shrink: 0;
          margin-top: 1px;
          color: #ffcf80;
        }
        .wm-detail-link {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .wm-detail-link:hover { color: rgba(250, 244, 237, 0.9); }

        .wm-loc-card__actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-top: 28px;
        }

        /* ── CTA Section ────────────────────────────────── */
        .wm-cta { padding: 34px 0 100px; }
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
        .wm-cta__panel > * { position: relative; z-index: 1; }
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

        /* ── Focus / A11y ───────────────────────────────── */
        .wm-button:focus-visible,
        .wm-link:focus-visible,
        .wm-loc-card__pin:focus-visible,
        .wm-detail-link:focus-visible,
        .wm-jumpnav__link:focus-visible {
          outline: 2px solid #ffcf80;
          outline-offset: 3px;
        }

        /* ── Responsive ─────────────────────────────────── */
        @media (min-width: 1040px) {
          .wm-hero__inner {
            grid-template-columns: minmax(0, 1fr);
            padding-top: 150px;
          }
        }
        @media (max-width: 960px) {
          .wm-stats__panel { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .wm-hero__signals { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .wm-cta__panel { grid-template-columns: 1fr; }
        }
        @media (max-width: 880px) {
          .wm-loc-card {
            grid-template-columns: 1fr;
          }
          .wm-loc-card--flip { direction: ltr; }
          .wm-loc-card--flip > * { direction: ltr; }
          .wm-loc-card__photo { min-height: 300px; }
        }
        @media (max-width: 720px) {
          .wm-locations-section { padding: 48px 0 80px; }
          .wm-hero__inner { padding: 122px 0 90px; }
          .wm-hero__title { font-size: clamp(52px, 14vw, 74px); }
          .wm-hero__sub { font-size: 15px; }
          .wm-hero__signals { grid-template-columns: 1fr; }
          .wm-stats__panel { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .wm-loc-card__info { padding: 28px 24px; }
          .wm-cta__panel { padding: 36px 26px; border-radius: 28px; }
          .wm-cta__actions, .wm-hero__actions { flex-direction: column; align-items: stretch; }
          .wm-button { width: 100%; }
          .wm-section { width: min(1320px, calc(100vw - 24px)); }
        }
        @media (hover: none) {
          .wm-button:hover,
          .wm-link:hover,
          .wm-jumpnav__link:hover { transform: none; }
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

      {/* ── Progress Bar ── */}
      <motion.div className="wm-progress" style={{ scaleX: progress }} />

      {/* ── Custom Cursor ── */}
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
        {/* ── Hero ── */}
        <section className="wm-hero" ref={heroRef}>
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
                  <strong>Three Maryland Kitchens</strong> — find yours
                </span>
              </div>

              <h1 className="wm-display wm-hero__title">
                {["Three Kitchens.", "One Promise."].map((line, i) => (
                  <span key={line} className={`wm-hero__line${i === 1 ? " wm-hero__line--accent" : ""}`}>
                    <motion.span
                      initial={{ y: "110%", rotateX: 12 }}
                      animate={{ y: "0%", rotateX: 0 }}
                      transition={{
                        duration: 0.95,
                        delay: 0.08 + i * 0.16,
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
                Each kitchen carries its own specialty — all built on the same Wise Mart
                standard of fresh prep, warm hospitality, and food worth coming back for.
              </motion.p>

              <motion.div
                className="wm-hero__actions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.55 }}
              >
                <a href="#locations" className="wm-button wm-button--primary">
                  Explore Locations
                  <ArrowRight />
                </a>
                <Link to="/order" className="wm-button wm-button--ghost">
                  Order Now
                </Link>
              </motion.div>

              <motion.div
                className="wm-hero__signals"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.64, delay: 0.72 }}
              >
                {[
                  {
                    icon: Star,
                    label: "4.8 avg rating",
                    copy: "A local go-to for comfort food that earns repeat visits across three towns.",
                  },
                  {
                    icon: MapPin,
                    label: `${LOCATION_DATA.length} MD locations`,
                    copy: "Sharptown, East New Market, and Vienna — each with its own loyal crowd.",
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
          </div>

          <div className="wm-scroll-cue" aria-hidden="true">
            <div className="wm-scroll-cue__track" />
            <span>Scroll</span>
          </div>
        </section>

        {/* ── Marquee ── */}
        <section className="wm-marquee" aria-label="Highlights">
          <div className="wm-marquee__track">
            {Array.from({ length: 2 }).map((_, pass) =>
              tickerItems.map((item, index) => (
                <div key={`${pass}-${index}`} className="wm-marquee__item">
                  {item}
                  <span className="wm-marquee__dot" />
                </div>
              )),
            )}
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section className="wm-stats">
          <div className="wm-section">
            <div className="wm-stats__panel">
              {[
                { value: <CountUp to={LOCATION_DATA.length} />, label: "Locations" },
                { value: <CountUp to={yearsServing} suffix="+" />, label: "Years Serving" },
                { value: <CountUp to={50} suffix="+" />, label: "Menu Items" },
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

        {/* ── Section Intro ── */}
        <motion.div
          id="locations"
          className="wm-section"
          style={{ paddingTop: 88 }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionIntro
            eyebrow="Our Locations"
            title={
              <>
                Pick Your
                <br />
                <em>Wise Mart.</em>
              </>
            }
            body="Three Maryland kitchens, each with its own personality and the same Wise Mart promise throughout."
            align="center"
          />
        </motion.div>

        {/* ── Jump Nav ── */}
        <div className="wm-section wm-jumpnav">
          <div className="wm-jumpnav__inner">
            {LOCATION_DATA.map((loc) => (
              <a key={loc.slug} href={`#loc-${loc.slug}`} className="wm-jumpnav__link">
                <span className="wm-jumpnav__dot" />
                {loc.name}
              </a>
            ))}
          </div>
        </div>

        {/* ── Location Cards ── */}
        <div className="wm-section wm-locations-section" role="list">
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {LOCATION_DATA.map((loc, index) => (
              <LocationCard key={loc.slug} loc={loc} index={index} />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
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
                <div className="wm-cta__eyebrow">Ready When You Are</div>
                <h2 className="wm-display wm-cta__title">
                  Pick a location, place the order, and show up hungry.
                </h2>
                <p className="wm-cta__copy">
                  Choose your nearest Wise Mart, build the order, and we will have the comfort food part covered.
                </p>
              </div>
              <div className="wm-cta__actions">
                <Link to="/order" className="wm-button wm-button--primary">
                  Order Now
                  <ArrowRight />
                </Link>
                <a href="#locations" className="wm-button wm-button--dark">
                  See All Locations
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}