import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  Award,
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
  ChevronRight,
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
      {
        title: "Wise Mart - Come Hungry. Leave Happy. | Maryland Restaurants Since 2010",
      },
      {
        name: "description",
        content:
          "Fresh pizza, famous fried chicken, hearty subs, and crisp salads. Three Maryland locations: Sharptown, East New Market, and Vienna.",
      },
      {
        property: "og:title",
        content: "Wise Mart - Come Hungry. Leave Happy.",
      },
      {
        property: "og:description",
        content: "Three Maryland locations. Fresh food, fast service, since 2010.",
      },
    ],
  }),
  component: HomePage,
});

type IconType = ComponentType<{ className?: string }>;

type ValueItem = {
  icon: IconType;
  title: string;
  desc: string;
};

type FeaturedItem = {
  icon: IconType;
  name: string;
  price: string;
  img: string;
  tag: string;
};

type FaqItem = {
  q: string;
  a: string;
};

const VALUES: ValueItem[] = [
  {
    icon: Leaf,
    title: "Farm Fresh Daily",
    desc: "Every ingredient is sourced with intention. Dough, sauces, and produce are prepared in-house each morning.",
  },
  {
    icon: Zap,
    title: "Lightning Service",
    desc: "Speed and quality in balance. Guests get in and out quickly without losing the flavor and care behind every order.",
  },
  {
    icon: Award,
    title: "Unmatched Value",
    desc: "Generous portions and honest prices because a great meal should feel satisfying, not complicated.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Three towns. Three kitchens. One Maryland family built on hospitality, consistency, and neighborhood pride.",
  },
];

const FEATURED: FeaturedItem[] = [
  {
    icon: Pizza,
    name: "Hand-Stretched Pizza",
    price: "from $12.99",
    img: heroPizza,
    tag: "Signature",
  },
  {
    icon: Drumstick,
    name: "Famous Fried Chicken",
    price: "from $6.99",
    img: heroChicken,
    tag: "Best Seller",
  },
  {
    icon: Sandwich,
    name: "Hot Subs & Steaks",
    price: "from $11.99",
    img: heroSub,
    tag: "Fan Favorite",
  },
  {
    icon: Salad,
    name: "Fresh Salads",
    price: "from $9.99",
    img: heroSalad,
    tag: "Daily Fresh",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "Do you offer online ordering?",
    a: "Yes. You can place orders for any of our three locations through the Order page. Pickup is available at every store, and select locations also support delivery through third-party services.",
  },
  {
    q: "What are your hours?",
    a: "Hours vary slightly by location. Most stores are open 10 AM to 10 PM Sunday through Thursday, and 10 AM to 11 PM Friday and Saturday.",
  },
  {
    q: "Do you cater events?",
    a: "Yes. Catering is one of our specialties, from office lunches to family gatherings. Reach out to your nearest location for a custom quote.",
  },
  {
    q: "Are there vegetarian options?",
    a: "Yes. Guests love our salads, veggie subs, and cheese pizza options. Ask in store for current specials and seasonal additions.",
  },
  {
    q: "Can I customize my order?",
    a: "Absolutely. From toppings and sauces to sides and dressings, we are happy to help you build the meal you want.",
  },
  {
    q: "Do you have a rewards program?",
    a: "A formal loyalty program is in the works. In the meantime, follow our social channels for weekly deals and seasonal offers.",
  },
  {
    q: "Are your ingredients locally sourced?",
    a: "Whenever possible, we prioritize Maryland farms and regional suppliers for produce, dairy, and other key ingredients.",
  },
  {
    q: "Is parking available?",
    a: "Yes. All three locations offer free on-site parking for guests.",
  },
  {
    q: "Do you accommodate allergies?",
    a: "We take dietary restrictions seriously. Please tell our team when ordering so we can guide you through the best options.",
  },
  {
    q: "How do I apply for a job at Wise Mart?",
    a: "Visit the Careers page or stop by any location and ask to speak with a manager. We are always looking for great people.",
  },
];

const REVIEWS = [
  {
    quote: "Best fried chicken on the Eastern Shore. Hands down.",
    author: "Marcus T.",
    location: "Sharptown",
  },
  {
    quote: "The breakfast pizza is a game changer. We are regulars now.",
    author: "Sarah & Jim",
    location: "Vienna",
  },
  {
    quote: "Cheesesteak subs that actually taste like Philly.",
    author: "Dee R.",
    location: "East New Market",
  },
];

const TICKER_ITEMS = [
  "Hand-Stretched Pizza",
  "Famous Fried Chicken",
  "Hot Subs & Steaks",
  "Fresh Salads",
  "3 Maryland Locations",
  "Open Daily",
  "Catering Available",
  `Est. ${SITE.established}`,
];

function reveal(reduceMotion: boolean | null, delay = 0, y = 24) {
  const shouldReduce = reduceMotion ?? false;
  
  if (shouldReduce) {
    return {
      initial: { opacity: 1, y: 0, scale: 1 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y, scale: 0.985 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.58, delay, ease: "easeInOut" as const },
  };
}

function useTilt(strength = 6) {
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 340,
    damping: 32,
  } as any);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 340,
    damping: 32,
  } as any);
  const scale = useSpring(1, { stiffness: 320, damping: 28 });

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    scale.set(1.018);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
    scale.set(1);
  }

  return {
    motionStyle: shouldReduceMotion
      ? undefined
      : {
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d" as const,
          perspective: 1200,
        },
    onMove,
    onLeave,
  };
}

function FloatingParticles() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div className="wm-particles" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, index) => {
        const size = index % 4 === 0 ? 3 : index % 3 === 0 ? 2 : 1.5;
        const color =
          index % 5 === 0
            ? "#c8590a"
            : index % 7 === 0
              ? "rgba(232,160,48,0.4)"
              : "rgba(240,235,228,0.08)";

        return (
          <motion.span
            key={index}
            className="wm-particle"
            style={{
              width: size,
              height: size,
              background: color,
              left: `${6 + ((index * 5.4) % 86)}%`,
              top: `${10 + ((index * 7.2) % 78)}%`,
              boxShadow: index % 5 === 0 ? `0 0 8px ${color}` : "none",
            }}
            animate={{ y: [0, -36, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 3.2 + (index % 5) * 0.55,
              delay: index * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  titleTop,
  titleBottom,
  subtitle,
  centered = false,
}: {
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "wm-header wm-header--center" : "wm-header"}>
      <span className="wm-eyebrow">
        <span className="wm-eyebrow-line" />
        {eyebrow}
        {centered ? <span className="wm-eyebrow-line" /> : null}
      </span>
      <h2 className="wm-display wm-section-title">
        {titleTop}
        <br />
        <em>{titleBottom}</em>
      </h2>
      {subtitle ? <p className="wm-section-sub">{subtitle}</p> : null}
    </div>
  );
}

function TiltCard({
  children,
  className,
  strength,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const { motionStyle, onMove, onLeave } = useTilt(strength ?? 6);

  return (
    <motion.div
      className={className}
      style={motionStyle}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

function FAQItem({ item, index }: { item: FaqItem; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const buttonId = useId();
  const panelId = `${buttonId}-panel`;

  return (
    <motion.article className="wm-faq-item" {...reveal(shouldReduceMotion, index * 0.04, 16)}>
      <button
        id={buttonId}
        type="button"
        className={`wm-faq-btn${open ? " wm-faq-btn--open" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="wm-faq-q">{item.q}</span>
        <motion.span
          className="wm-faq-icon"
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 28 }}
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
            className="wm-faq-a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="wm-faq-a-inner">{item.a}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.65 });
  const [count, setCount] = useState(shouldReduceMotion ? to : 0);

  useEffect(() => {
    if (shouldReduceMotion || !inView) return;

    let current = 0;
    const step = Math.max(1, Math.ceil(to / 40));
    const timer = window.setInterval(() => {
      current += step;
      if (current >= to) {
        setCount(to);
        window.clearInterval(timer);
        return;
      }
      setCount(current);
    }, 30);

    return () => window.clearInterval(timer);
  }, [inView, shouldReduceMotion, to]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "18%"],
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["0%", "24%"],
  );
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1, 1.06],
  );

  return (
    <>
      <style>{STYLES}</style>
      <main className="wm-page">
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
          <div className="wm-hero__amber-wash" />
          <div className="wm-hero__grain" />
          <div className="wm-hero__orb wm-hero__orb--1" />
          <div className="wm-hero__orb wm-hero__orb--2" />
          <div className="wm-hero__scanline" />
          <FloatingParticles />

          <div className="wm-shell wm-hero__inner">
            <motion.div style={shouldReduceMotion ? undefined : { y: textY }}>
              <motion.div
                className="wm-hero__badge"
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              >
                <div className="wm-hero__badge-dot">
                  <Sparkles />
                </div>
                <span className="wm-hero__badge-text">
                  <strong>Maryland Favorite</strong> Since {SITE.established}
                </span>
              </motion.div>

              <div className="wm-hero__title wm-display">
                {["Come Hungry.", "Leave Happy."].map((line, index) => (
                  <div key={line} className="wm-hero__title-line">
                    <motion.span
                      className={`wm-hero__title-inner${index === 1 ? " wm-shimmer" : ""}`}
                      initial={shouldReduceMotion ? { y: "0%", rotateX: 0 } : { y: "108%", rotateX: 12 }}
                      animate={{ y: "0%", rotateX: 0 }}
                      transition={{
                        duration: 0.95,
                        delay: 0.1 + index * 0.16,
                        ease: "easeInOut",
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
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.42 }}
              >
                Fresh ingredients. Bold flavors. Three Maryland locations ready to serve
                you because every meal should be worth the trip.
              </motion.p>

              <motion.div
                className="wm-hero__ctas"
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.56 }}
              >
                <Link to="/order" className="wm-btn-primary">
                  Order Now
                  <ArrowRight />
                </Link>
                <Link to="/locations" className="wm-btn-outline">
                  View Menus
                </Link>
              </motion.div>

              <motion.ul
                className="wm-hero__trust"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.7 }}
                aria-label="Trust indicators"
              >
                <li className="wm-hero__trust-item">
                  <Star />
                  4.8 avg rating
                </li>
                <li className="wm-hero__trust-item">
                  <MapPin />
                  3 locations
                </li>
                <li className="wm-hero__trust-item">
                  <Clock />
                  Open daily
                </li>
              </motion.ul>
            </motion.div>

            <motion.aside
              className="wm-hero__right"
              initial={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.34, ease: "easeInOut" }}
              aria-label="Featured menu highlights"
            >
              {FEATURED.map((item, index) => (
                <motion.div
                  key={item.name}
                  className={`wm-food-card wm-food-card--${index}`}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -10,
                          scale: 1.03,
                          zIndex: 20,
                          transition: { duration: 0.25 },
                        }
                  }
                >
                  <div className="wm-food-card__img">
                    <img src={item.img} alt={item.name} loading={index > 1 ? "lazy" : undefined} />
                    <div className="wm-food-card__img-overlay" />
                  </div>
                  <div className="wm-food-card__body">
                    <div className="wm-food-card__tag">{item.tag}</div>
                    <div className="wm-food-card__name">{item.name}</div>
                    <div className="wm-food-card__price">{item.price}</div>
                  </div>
                </motion.div>
              ))}
            </motion.aside>
          </div>

          <div className="wm-scroll-cue" aria-hidden="true">
            <div className="wm-scroll-cue__track" />
            <span>Scroll</span>
          </div>
        </section>

        <section className="wm-ticker" aria-label="Highlights">
          <div className="wm-ticker__track">
            {Array.from({ length: 2 }).map((_, pass) =>
              TICKER_ITEMS.map((item, index) => (
                <div key={`${pass}-${index}`} className="wm-ticker__item">
                  {item}
                  <span />
                </div>
              )),
            )}
          </div>
        </section>

        <section className="wm-stats-bar" aria-label="Business highlights">
          <div className="wm-stats-bar__inner">
            {[
              { num: 3, suffix: "", label: "Locations" },
              { num: 15, suffix: "+", label: "Years Serving" },
              { num: 50, suffix: "+", label: "Menu Items" },
              { num: 48, suffix: "/50", label: "Guest Rating" },
            ].map((item, index) => (
              <motion.article
                key={item.label}
                className="wm-stat-item"
                {...reveal(shouldReduceMotion, index * 0.08, 18)}
              >
                <div className="wm-stat-item__num">
                  <CountUp to={item.num} suffix={item.suffix} />
                </div>
                <div className="wm-stat-item__label">{item.label}</div>
                <span className="wm-stat-item__accent" />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="wm-values">
          <div className="wm-values__bg" />
          <div className="wm-shell">
            <motion.div {...reveal(shouldReduceMotion)} className="wm-values__header">
              <SectionHeader
                eyebrow="Why Wise Mart"
                titleTop="Our Promise"
                titleBottom="to Every Guest"
                subtitle="Four commitments that have guided every plate we serve since 2010."
                centered
              />
            </motion.div>
            <div className="wm-values__grid">
              {VALUES.map((value, index) => (
                <motion.article
                  key={value.title}
                  className="wm-value"
                  {...reveal(shouldReduceMotion, index * 0.08, 28)}
                >
                  <div className="wm-value__index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="wm-value__icon-wrap">
                    <value.icon />
                  </div>
                  <div className="wm-value__title">{value.title}</div>
                  <div className="wm-value__desc">{value.desc}</div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="wm-locations">
          <div className="wm-shell">
            <motion.div {...reveal(shouldReduceMotion)} className="wm-header wm-header--center">
              <SectionHeader
                eyebrow="Three Locations"
                titleTop="Pick Your"
                titleBottom="Wise Mart"
                subtitle="Each kitchen carries its own personality with the same Wise Mart standards throughout."
                centered
              />
            </motion.div>

            <div className="wm-locations__grid">
              {LOCATIONS.map((location, index) => (
                <motion.article
                  key={location.slug}
                  className="wm-loc-card"
                  {...reveal(shouldReduceMotion, index * 0.1, 34)}
                >
                  <div className="wm-loc-card__glow" />
                  <div className="wm-loc-card__corner" />
                  <div className="wm-loc-card__num">0{index + 1} Maryland</div>
                  <div className="wm-loc-card__name">{location.name}</div>
                  <div className="wm-loc-card__tagline">{location.tagline}</div>
                  <div className="wm-loc-card__sep" />
                  <div className="wm-loc-card__specialty">{location.specialty}</div>
                  <div className="wm-loc-card__footer">
                    <Link to="/locations" className="wm-loc-card__cta">
                      View Menu
                      <ArrowRight />
                    </Link>
                    <a href={location.phoneHref} className="wm-loc-card__phone">
                      <Phone />
                      {location.phone}
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="wm-featured">
          <div className="wm-shell">
            <motion.div
              className="wm-featured__header"
              {...reveal(shouldReduceMotion)}
            >
              <div>
                <SectionHeader
                  eyebrow="Featured"
                  titleTop="What We're"
                  titleBottom="Known For"
                />
              </div>
              <Link to="/locations" className="wm-text-link">
                Full Menus
                <ArrowRight />
              </Link>
            </motion.div>

            <div className="wm-featured__grid">
              {FEATURED.map((item, index) => (
                <motion.div
                  key={item.name}
                  {...reveal(shouldReduceMotion, index * 0.08, 30)}
                >
                  <TiltCard className="wm-feat-card" strength={5}>
                    <div className="wm-feat-card__img">
                      <img src={item.img} alt={item.name} loading="lazy" />
                      <div className="wm-feat-card__badge">
                        <item.icon />
                      </div>
                      <div className="wm-feat-card__img-scrim" />
                    </div>
                    <div className="wm-feat-card__body">
                      <div className="wm-feat-card__tag">{item.tag}</div>
                      <div className="wm-feat-card__name">{item.name}</div>
                      <div className="wm-feat-card__price">{item.price}</div>
                      <div className="wm-feat-card__action">
                        Order Now
                        <ChevronRight />
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="wm-story">
          <div className="wm-story__grid-deco" />
          <div className="wm-shell">
            <div className="wm-story__inner">
              <motion.div {...reveal(shouldReduceMotion, 0, 34)}>
                <SectionHeader
                  eyebrow="Our Story"
                  titleTop="More than a meal"
                  titleBottom="a Maryland tradition."
                />
                <p className="wm-story__lead">
                  "Serve good food, fast, at a fair price and treat every guest like family."
                </p>
                <p className="wm-story__text">
                  Wise Mart opened its doors in {SITE.established} with that single
                  conviction. Three locations and many years later, the standard is still
                  the same.
                </p>
                <p className="wm-story__text">
                  From the pizza ovens in Sharptown to the breakfast counters in Vienna,
                  every plate carries the same care, the same ingredients, and the same
                  pride.
                </p>
                <Link to="/about" className="wm-text-link wm-story__link">
                  Read our full story
                  <ArrowRight />
                </Link>
              </motion.div>

              <motion.div {...reveal(shouldReduceMotion, 0.08, 34)}>
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

        <section className="wm-testimonials">
          <div className="wm-shell">
            <motion.div {...reveal(shouldReduceMotion)} className="wm-header wm-header--center">
              <SectionHeader
                eyebrow="Reviews"
                titleTop="What Our"
                titleBottom="Guests Say"
                centered
              />
            </motion.div>

            <div className="wm-testimonials__grid">
              {REVIEWS.map((review, index) => (
                <motion.div
                  key={review.author}
                  {...reveal(shouldReduceMotion, index * 0.08, 28)}
                >
                  <TiltCard className="wm-review" strength={4}>
                    <div className="wm-review__bg-quote">"</div>
                    <div className="wm-review__stars" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={`${review.author}-${starIndex}`} />
                      ))}
                    </div>
                    <div className="wm-review__quote">"{review.quote}"</div>
                    <div className="wm-review__sep" />
                    <div className="wm-review__author">{review.author}</div>
                    <div className="wm-review__location">
                      <MapPin />
                      {review.location}
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="wm-faq">
          <div className="wm-shell">
            <motion.div {...reveal(shouldReduceMotion)} className="wm-header wm-header--center">
              <SectionHeader
                eyebrow="FAQ"
                titleTop="Quick"
                titleBottom="Answers"
                subtitle="Everything our guests ask most, answered simply."
                centered
              />
            </motion.div>

            <div className="wm-faq__cols">
              <div>
                {FAQS.slice(0, 5).map((item, index) => (
                  <FAQItem key={item.q} item={item} index={index} />
                ))}
              </div>
              <div>
                {FAQS.slice(5).map((item, index) => (
                  <FAQItem key={item.q} item={item} index={index + 5} />
                ))}
              </div>
            </div>

            <motion.div
              className="wm-cta-box"
              initial={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.18 }}
            >
              <Link to="/faq" className="wm-text-link">
                See all FAQs
                <ArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="wm-cta-section">
          <div className="wm-shell">
            <motion.div
              className="wm-cta-box"
              {...reveal(shouldReduceMotion, 0, 36)}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { scale: 1.006, transition: { duration: 0.3 } }
              }
            >
              <div className="wm-cta-box__pattern" />
              <div className="wm-cta-box__circle" />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 className="wm-cta-box__title">Ready to order?</h3>
                <p className="wm-cta-box__sub">
                  Pick your location, place your order, and we will have it ready when you
                  arrive.
                </p>
              </div>
              <div className="wm-cta-box__btns">
                <Link to="/order" className="wm-btn-dark">
                  Order Now
                  <ArrowRight />
                </Link>
                <Link to="/locations" className="wm-btn-ghost">
                  Find a Location
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --amber: #c8590a;
    --amber-mid: #d96b18;
    --amber-light: #f1a248;
    --amber-pale: rgba(200, 89, 10, 0.1);
    --amber-border: rgba(200, 89, 10, 0.28);
    --amber-glow: rgba(200, 89, 10, 0.22);
    --gold: #e8a030;

    --white: #ffffff;
    --off-white: #f0ebe4;
    --ink: #070605;
    --ink-1: #0c0a09;
    --ink-2: #111009;
    --ink-3: #181510;
    --ink-4: #1e1a14;

    --text-primary: rgba(240, 235, 228, 0.95);
    --text-secondary: rgba(240, 235, 228, 0.7);
    --text-muted: rgba(240, 235, 228, 0.5);
    --text-faint: rgba(240, 235, 228, 0.24);

    --border: rgba(240, 235, 228, 0.08);
    --border-mid: rgba(240, 235, 228, 0.12);
    --border-warm: rgba(240, 235, 228, 0.18);

    --r-sm: 10px;
    --r-md: 16px;
    --r-lg: 22px;
    --r-xl: 30px;
    --r-2xl: 40px;

    --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.32);
    --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.42);
    --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.52);
    --shadow-xl: 0 36px 90px rgba(0, 0, 0, 0.62);
    --shadow-amber: 0 16px 42px rgba(200, 89, 10, 0.34);
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
  }

  .wm-page {
    background:
      radial-gradient(circle at top left, rgba(200, 89, 10, 0.08), transparent 28%),
      var(--ink);
    color: var(--text-primary);
    font-family: "DM Sans", "Segoe UI", sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .wm-shell {
    width: min(1360px, calc(100% - 2rem));
    margin: 0 auto;
  }

  .wm-header--center {
    text-align: center;
  }

  .wm-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    color: var(--amber);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .wm-eyebrow-line {
    display: inline-block;
    width: 28px;
    height: 1px;
    background: linear-gradient(90deg, var(--amber), transparent);
    flex-shrink: 0;
  }

  .wm-display {
    font-family: "Cormorant Garamond", Georgia, serif;
    font-weight: 700;
    line-height: 0.96;
    letter-spacing: -0.015em;
    color: var(--text-primary);
  }

  .wm-display em {
    color: var(--amber-light);
    font-style: italic;
  }

  .wm-section-title {
    margin: 1rem 0 0;
    font-size: clamp(2.5rem, 5vw, 4.2rem);
  }

  .wm-section-sub {
    margin: 1rem auto 0;
    max-width: 40rem;
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.8;
    font-weight: 300;
  }

  .wm-hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: end;
    overflow: hidden;
    background: var(--ink);
  }

  .wm-hero__bg {
    position: absolute;
    inset: -6%;
    background-size: cover;
    background-position: center;
    will-change: transform;
  }

  .wm-hero__overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(105deg, rgba(7, 6, 5, 0.97) 0%, rgba(7, 6, 5, 0.88) 38%, rgba(7, 6, 5, 0.55) 66%, rgba(7, 6, 5, 0.22) 100%),
      linear-gradient(to top, rgba(7, 6, 5, 1) 0%, rgba(7, 6, 5, 0) 45%);
  }

  .wm-hero__amber-wash {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 10% 85%, rgba(200, 89, 10, 0.12), transparent 60%);
    pointer-events: none;
  }

  .wm-hero__grain {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  .wm-hero__orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
  }

  .wm-hero__orb--1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(200, 89, 10, 0.14) 0%, transparent 70%);
    left: -80px;
    bottom: -100px;
  }

  .wm-hero__orb--2 {
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, rgba(232, 160, 48, 0.07) 0%, transparent 70%);
    top: 20%;
    right: 5%;
  }

  .wm-hero__scanline {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    opacity: 0;
    pointer-events: none;
    background: linear-gradient(90deg, transparent 0%, var(--amber-glow) 30%, var(--amber) 50%, var(--amber-glow) 70%, transparent 100%);
    animation: wm-scanline 7s ease-in-out infinite 1.5s;
  }

  @keyframes wm-scanline {
    0% { top: 0%; opacity: 0; }
    5% { opacity: 0.7; }
    95% { opacity: 0.5; }
    100% { top: 100%; opacity: 0; }
  }

  .wm-particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 2;
  }

  .wm-particle {
    position: absolute;
    border-radius: 999px;
  }

  .wm-hero__inner {
    position: relative;
    z-index: 3;
    width: 100%;
    padding: 9rem 0 6rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 3.5rem;
    align-items: end;
  }

  .wm-hero__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 2rem;
    padding: 0.55rem 1rem 0.55rem 0.55rem;
    border: 1px solid var(--border-mid);
    border-radius: 999px;
    background: rgba(240, 235, 228, 0.05);
    backdrop-filter: blur(8px);
  }

  .wm-hero__badge-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--amber);
    color: white;
    box-shadow: 0 0 0 4px var(--amber-pale);
  }

  .wm-hero__badge-dot svg {
    width: 13px;
    height: 13px;
  }

  .wm-hero__badge-text {
    color: var(--text-secondary);
    font-size: 0.65rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .wm-hero__badge-text strong {
    color: var(--text-primary);
  }

  .wm-hero__title {
    margin: 0;
    font-size: clamp(3.6rem, 8vw, 7rem);
  }

  .wm-hero__title-line {
    display: block;
    overflow: hidden;
  }

  .wm-hero__title-inner {
    display: block;
  }

  .wm-shimmer {
    background: linear-gradient(92deg, #c8590a 0%, #e8812a 20%, #f5b040 38%, #fbc95a 50%, #e8812a 65%, #d06820 82%, #c8590a 100%);
    background-size: 300% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: wm-shimmer 5.5s linear infinite;
  }

  @keyframes wm-shimmer {
    0% { background-position: -150% center; }
    100% { background-position: 150% center; }
  }

  .wm-hero__sub {
    margin-top: 1.5rem;
    max-width: 28rem;
    color: var(--text-secondary);
    font-size: 0.98rem;
    line-height: 1.9;
    font-weight: 300;
  }

  .wm-hero__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
    align-items: center;
  }

  .wm-hero__trust {
    margin: 2.1rem 0 0;
    padding: 2rem 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    list-style: none;
    border-top: 1px solid var(--border);
  }

  .wm-hero__trust-item {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--text-muted);
    font-size: 0.72rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .wm-hero__trust-item svg {
    width: 12px;
    height: 12px;
    color: var(--amber);
    flex-shrink: 0;
  }

  .wm-hero__right {
    display: none;
    position: relative;
    height: 560px;
  }

  .wm-food-card {
    position: absolute;
    overflow: hidden;
    border-radius: var(--r-lg);
    border: 1px solid var(--border-mid);
    background: rgba(14, 11, 9, 0.82);
    backdrop-filter: blur(20px) saturate(1.2);
    box-shadow: var(--shadow-md);
    transition: border-color 0.35s, box-shadow 0.35s;
  }

  .wm-food-card:hover {
    border-color: var(--amber-border);
    box-shadow: var(--shadow-lg), 0 0 0 1px rgba(200, 89, 10, 0.1);
  }

  .wm-food-card__img {
    position: relative;
    overflow: hidden;
  }

  .wm-food-card__img img {
    width: 100%;
    height: 170px;
    object-fit: cover;
    display: block;
    transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .wm-food-card:hover .wm-food-card__img img {
    transform: scale(1.08);
  }

  .wm-food-card__img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(7, 6, 5, 0.55), transparent 55%);
  }

  .wm-food-card__body {
    padding: 0.9rem 1rem 1rem;
  }

  .wm-food-card__tag {
    color: var(--amber);
    font-size: 0.53rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .wm-food-card__name {
    margin-top: 0.2rem;
    color: var(--text-primary);
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.35;
  }

  .wm-food-card__price {
    margin-top: 0.2rem;
    color: var(--text-muted);
    font-size: 0.72rem;
  }

  .wm-food-card--0 {
    width: 198px;
    top: 0;
    left: 10px;
    z-index: 4;
    transform: rotate(-2.8deg);
  }

  .wm-food-card--1 {
    width: 208px;
    top: 30px;
    left: 195px;
    z-index: 5;
    transform: rotate(1.8deg);
  }

  .wm-food-card--2 {
    width: 194px;
    top: 268px;
    left: 18px;
    z-index: 3;
    transform: rotate(2.2deg);
  }

  .wm-food-card--3 {
    width: 206px;
    top: 252px;
    left: 205px;
    z-index: 6;
    transform: rotate(-1.2deg);
  }

  .wm-scroll-cue {
    position: absolute;
    left: 50%;
    bottom: 2rem;
    transform: translateX(-50%);
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.55rem;
    color: var(--text-faint);
    font-size: 0.58rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .wm-scroll-cue__track {
    width: 1px;
    height: 52px;
    background: var(--border);
    position: relative;
    overflow: hidden;
  }

  .wm-scroll-cue__track::after {
    content: "";
    position: absolute;
    left: 0;
    top: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent, var(--amber), transparent);
    animation: wm-scroll-drop 2.2s ease-in-out infinite;
  }

  @keyframes wm-scroll-drop {
    0% { top: -100%; opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 0.6; }
    100% { top: 100%; opacity: 0; }
  }

  .wm-ticker {
    position: relative;
    overflow: hidden;
    padding: 0.85rem 0;
    background: var(--amber);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .wm-ticker::before,
  .wm-ticker::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 80px;
    z-index: 2;
    pointer-events: none;
  }

  .wm-ticker::before {
    left: 0;
    background: linear-gradient(to right, var(--amber), transparent);
  }

  .wm-ticker::after {
    right: 0;
    background: linear-gradient(to left, var(--amber), transparent);
  }

  .wm-ticker__track {
    display: flex;
    width: max-content;
    animation: wm-ticker 28s linear infinite;
  }

  @keyframes wm-ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .wm-ticker__item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 2rem;
    color: rgba(255, 255, 255, 0.92);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .wm-ticker__item span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.55);
    flex-shrink: 0;
  }

  .wm-stats-bar {
    background: var(--ink-1);
    border-bottom: 1px solid var(--border);
  }

  .wm-stats-bar__inner {
    width: min(1360px, calc(100% - 2rem));
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .wm-stat-item {
    position: relative;
    overflow: hidden;
    padding: 2.2rem 1.2rem;
    text-align: center;
    border-right: 1px solid var(--border);
    background: transparent;
    transition: background 0.25s ease;
  }

  .wm-stat-item:last-child {
    border-right: 0;
  }

  .wm-stat-item::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 0;
    height: 2px;
    background: var(--amber);
    transform: translateX(-50%);
    transition: width 0.36s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .wm-stat-item:hover {
    background: var(--ink-2);
  }

  .wm-stat-item:hover::before {
    width: 60%;
  }

  .wm-stat-item__num {
    color: var(--text-primary);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(2.4rem, 5vw, 3rem);
    line-height: 1;
  }

  .wm-stat-item__label {
    margin-top: 0.45rem;
    color: var(--text-muted);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .wm-stat-item__accent {
    display: block;
    width: 18px;
    height: 1.5px;
    margin: 0.65rem auto 0;
    background: var(--amber);
    opacity: 0.7;
  }

  .wm-values,
  .wm-featured,
  .wm-testimonials {
    padding: 7rem 0;
  }

  .wm-values {
    position: relative;
    overflow: hidden;
  }

  .wm-values__bg {
    position: absolute;
    top: -120px;
    right: -80px;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200, 89, 10, 0.05), transparent 65%);
    pointer-events: none;
  }

  .wm-values__header {
    text-align: center;
  }

  .wm-values__grid {
    margin-top: 4rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    border: 1px solid var(--border);
    border-radius: var(--r-2xl);
    overflow: hidden;
    background: var(--border);
  }

  .wm-value {
    position: relative;
    overflow: hidden;
    padding: 3rem 2.3rem;
    background: var(--ink-1);
    transition: background 0.35s ease;
  }

  .wm-value::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 0% 0%, rgba(200, 89, 10, 0.1), transparent 60%);
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .wm-value::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--amber), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .wm-value:hover {
    background: var(--ink-2);
  }

  .wm-value:hover::before {
    opacity: 1;
  }

  .wm-value:hover::after {
    transform: scaleX(1);
  }

  .wm-value__index {
    position: absolute;
    top: 16px;
    right: 20px;
    color: rgba(200, 89, 10, 0.08);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 4.5rem;
    font-style: italic;
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .wm-value__icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 15px;
    border: 1px solid var(--amber-border);
    background: var(--amber-pale);
    color: var(--amber);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.32s ease, transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .wm-value:hover .wm-value__icon-wrap {
    background: var(--amber);
    color: white;
    transform: scale(1.08) rotate(-8deg);
  }

  .wm-value__icon-wrap svg {
    width: 22px;
    height: 22px;
  }

  .wm-value__title {
    margin-top: 1.4rem;
    color: var(--text-primary);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.7rem;
    line-height: 1.15;
  }

  .wm-value__desc {
    margin-top: 0.7rem;
    color: var(--text-muted);
    font-size: 0.84rem;
    line-height: 1.8;
    font-weight: 300;
  }

  .wm-locations,
  .wm-story,
  .wm-faq {
    padding: 7rem 0;
    background: var(--ink-1);
  }

  .wm-locations__grid,
  .wm-testimonials__grid {
    margin-top: 4rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .wm-loc-card {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 340px;
    padding: 2.4rem 2rem;
    border-radius: var(--r-xl);
    border: 1px solid var(--border);
    background: var(--ink-2);
    transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
  }

  .wm-loc-card:hover {
    transform: translateY(-5px);
    border-color: var(--amber-border);
    box-shadow: var(--shadow-lg), 0 0 0 1px rgba(200, 89, 10, 0.08);
  }

  .wm-loc-card__glow {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    background: linear-gradient(135deg, rgba(200, 89, 10, 0.08), transparent 55%);
    transition: opacity 0.35s ease;
  }

  .wm-loc-card:hover .wm-loc-card__glow {
    opacity: 1;
  }

  .wm-loc-card__corner {
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    pointer-events: none;
  }

  .wm-loc-card__corner::before {
    content: "";
    position: absolute;
    top: -1px;
    right: -1px;
    width: 80px;
    height: 80px;
    border-bottom-left-radius: 80px;
    background: linear-gradient(225deg, rgba(200, 89, 10, 0.12), transparent 60%);
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .wm-loc-card:hover .wm-loc-card__corner::before {
    opacity: 1;
  }

  .wm-loc-card__num {
    color: var(--text-faint);
    font-size: 0.62rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .wm-loc-card__name {
    margin-top: 1rem;
    color: var(--text-primary);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 2.25rem;
    line-height: 1;
  }

  .wm-loc-card__tagline {
    margin-top: 0.75rem;
    color: var(--text-muted);
    font-size: 0.84rem;
    line-height: 1.7;
    font-weight: 300;
  }

  .wm-loc-card__sep {
    width: 28px;
    height: 1.5px;
    margin: 1.2rem 0;
    background: linear-gradient(90deg, var(--amber), transparent);
    transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .wm-loc-card:hover .wm-loc-card__sep {
    width: 48px;
  }

  .wm-loc-card__specialty {
    margin-top: auto;
    color: var(--amber);
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .wm-loc-card__footer {
    margin-top: 1.2rem;
    padding-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .wm-loc-card__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--amber);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
  }

  .wm-loc-card__cta svg {
    width: 12px;
    height: 12px;
  }

  .wm-loc-card__phone {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--text-faint);
    font-size: 0.72rem;
    text-decoration: none;
  }

  .wm-loc-card__phone svg {
    width: 10px;
    height: 10px;
  }

  .wm-featured__header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .wm-featured__grid {
    margin-top: 3.5rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .wm-feat-card {
    overflow: hidden;
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    background: var(--ink-1);
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  }

  .wm-feat-card:hover {
    transform: translateY(-4px);
    border-color: var(--amber-border);
    box-shadow: var(--shadow-lg);
  }

  .wm-feat-card__img {
    position: relative;
    aspect-ratio: 3 / 2;
    overflow: hidden;
  }

  .wm-feat-card__img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .wm-feat-card:hover .wm-feat-card__img img {
    transform: scale(1.08);
  }

  .wm-feat-card__badge {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 42px;
    height: 42px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(200, 89, 10, 0.88);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.12);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .wm-feat-card:hover .wm-feat-card__badge {
    transform: scale(1.12) rotate(-10deg);
  }

  .wm-feat-card__badge svg {
    width: 17px;
    height: 17px;
  }

  .wm-feat-card__img-scrim {
    position: absolute;
    inset: 0;
    opacity: 0;
    background: linear-gradient(to top, rgba(7, 6, 5, 0.7), transparent 55%);
    transition: opacity 0.3s ease;
  }

  .wm-feat-card:hover .wm-feat-card__img-scrim {
    opacity: 1;
  }

  .wm-feat-card__body {
    padding: 1.2rem 1.25rem 1.3rem;
  }

  .wm-feat-card__tag {
    color: var(--amber);
    font-size: 0.53rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .wm-feat-card__name {
    margin-top: 0.4rem;
    color: var(--text-primary);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.3rem;
    line-height: 1.2;
  }

  .wm-feat-card__price {
    margin-top: 0.35rem;
    color: var(--text-muted);
    font-size: 0.78rem;
  }

  .wm-feat-card__action {
    margin-top: 0.9rem;
    padding-top: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    border-top: 1px solid var(--border);
    color: var(--amber);
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .wm-feat-card__action svg {
    width: 11px;
    height: 11px;
  }

  .wm-feat-card:hover .wm-feat-card__action {
    opacity: 1;
    transform: translateY(0);
  }

  .wm-story {
    position: relative;
    overflow: hidden;
  }

  .wm-story__grid-deco {
    position: absolute;
    inset: 0;
    opacity: 0.025;
    pointer-events: none;
    background-image:
      linear-gradient(var(--off-white) 1px, transparent 1px),
      linear-gradient(90deg, var(--off-white) 1px, transparent 1px);
    background-size: 80px 80px;
  }

  .wm-story__inner {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    align-items: center;
  }

  .wm-story__lead {
    margin-top: 1rem;
    padding-left: 1rem;
    border-left: 2px solid var(--amber);
    color: var(--text-secondary);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.2rem;
    font-style: italic;
    line-height: 1.65;
  }

  .wm-story__text {
    margin-top: 1rem;
    color: var(--text-secondary);
    font-size: 0.96rem;
    line-height: 1.9;
    font-weight: 300;
  }

  .wm-story__link {
    margin-top: 2rem;
  }

  .wm-story__frame {
    position: relative;
  }

  .wm-story__frame-deco {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100%;
    height: 100%;
    border: 1px solid var(--border-mid);
    border-radius: var(--r-xl);
    z-index: 0;
  }

  .wm-story__img-wrap {
    position: relative;
    z-index: 1;
    overflow: hidden;
    border-radius: var(--r-xl);
    border: 1px solid var(--border-mid);
    aspect-ratio: 5 / 4;
    transition: box-shadow 0.4s ease;
  }

  .wm-story__img-wrap:hover {
    box-shadow: var(--shadow-xl);
  }

  .wm-story__img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .wm-story__img-wrap:hover img {
    transform: scale(1.04);
  }

  .wm-story__img-caption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 2.5rem 1.7rem 1.5rem;
    background: linear-gradient(to top, rgba(7, 6, 5, 0.95), rgba(7, 6, 5, 0.5) 60%, transparent 100%);
    color: var(--text-secondary);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.1rem;
    font-style: italic;
    line-height: 1.5;
  }

  .wm-story__year-badge {
    position: absolute;
    right: 28px;
    bottom: -18px;
    z-index: 2;
    padding: 0.75rem 1.3rem;
    border-radius: var(--r-sm);
    background: var(--amber);
    color: white;
    box-shadow: var(--shadow-amber);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.75rem;
    line-height: 1;
  }

  .wm-story__year-badge small {
    display: block;
    margin-bottom: 0.15rem;
    font-family: "DM Sans", "Segoe UI", sans-serif;
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    opacity: 0.9;
  }

  .wm-review {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 2rem 1.7rem;
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    background: var(--ink-1);
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  }

  .wm-review:hover {
    transform: translateY(-4px);
    border-color: var(--amber-border);
    box-shadow: var(--shadow-md), 0 0 0 1px rgba(200, 89, 10, 0.07);
  }

  .wm-review__bg-quote {
    position: absolute;
    top: -8px;
    right: 16px;
    color: rgba(200, 89, 10, 0.06);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 120px;
    font-weight: 900;
    line-height: 1;
    user-select: none;
    pointer-events: none;
  }

  .wm-review__stars {
    display: flex;
    gap: 0.2rem;
    color: var(--gold);
  }

  .wm-review__stars svg {
    width: 13px;
    height: 13px;
    fill: currentColor;
  }

  .wm-review__quote {
    position: relative;
    margin-top: 1rem;
    color: rgba(240, 235, 228, 0.9);
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.2rem;
    font-style: italic;
    line-height: 1.55;
    flex: 1;
  }

  .wm-review__sep {
    width: 20px;
    height: 1.5px;
    margin: 1rem 0;
    background: var(--amber);
    opacity: 0.65;
  }

  .wm-review__author {
    color: var(--text-muted);
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .wm-review__location {
    margin-top: 0.2rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-faint);
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .wm-review__location svg {
    width: 9px;
    height: 9px;
  }

  .wm-faq__cols {
    margin-top: 4rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0 4rem;
  }

  .wm-faq-item {
    border-bottom: 1px solid var(--border);
  }

  .wm-faq-btn {
    width: 100%;
    padding: 1.35rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: none;
    border: 0;
    cursor: pointer;
    color: inherit;
    text-align: left;
  }

  .wm-faq-q {
    color: var(--text-secondary);
    font-size: 0.92rem;
    line-height: 1.55;
    transition: color 0.22s ease;
  }

  .wm-faq-btn--open .wm-faq-q {
    color: var(--text-primary);
  }

  .wm-faq-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--amber-border);
    background: var(--amber-pale);
    color: var(--amber);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .wm-faq-icon svg {
    width: 13px;
    height: 13px;
  }

  .wm-faq-a-inner {
    padding: 0 0 1.15rem;
    color: var(--text-muted);
    font-size: 0.84rem;
    line-height: 1.85;
    font-weight: 300;
  }

  .wm-cta-section {
    padding: 3rem 0 7rem;
  }

  .wm-cta-box {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;
    padding: 5rem 4rem;
    border-radius: var(--r-2xl);
    background: var(--amber);
  }

  .wm-cta-box::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 15% 50%, rgba(255, 255, 255, 0.09), transparent 60%),
      radial-gradient(ellipse 40% 60% at 85% 20%, rgba(0, 0, 0, 0.1), transparent 55%);
  }

  .wm-cta-box__pattern {
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image: repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%);
    background-size: 12px 12px;
  }

  .wm-cta-box__circle {
    position: absolute;
    top: -60px;
    right: -60px;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
    pointer-events: none;
  }

  .wm-cta-box__circle::after {
    content: "";
    position: absolute;
    inset: 24px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .wm-cta-box__title {
    position: relative;
    z-index: 1;
    color: white;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.01em;
  }

  .wm-cta-box__sub {
    position: relative;
    z-index: 1;
    margin-top: 0.8rem;
    max-width: 25rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    line-height: 1.8;
    font-weight: 300;
  }

  .wm-cta-box__btns {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .wm-btn-primary,
  .wm-btn-outline,
  .wm-btn-dark,
  .wm-btn-ghost,
  .wm-text-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease, box-shadow 0.22s ease;
  }

  .wm-btn-primary,
  .wm-btn-outline,
  .wm-btn-dark,
  .wm-btn-ghost {
    min-height: 46px;
    padding: 0.95rem 1.5rem;
    border-radius: var(--r-sm);
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .wm-btn-primary svg,
  .wm-btn-dark svg,
  .wm-text-link svg {
    width: 13px;
    height: 13px;
  }

  .wm-btn-primary {
    position: relative;
    overflow: hidden;
    border: 0;
    background: var(--amber);
    color: white;
    box-shadow: var(--shadow-amber);
  }

  .wm-btn-primary::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 55%);
    transition: opacity 0.22s ease;
  }

  .wm-btn-primary:hover {
    transform: translateY(-3px);
    background: #a84e08;
  }

  .wm-btn-primary:hover::before {
    opacity: 1;
  }

  .wm-btn-outline {
    border: 1px solid var(--border-warm);
    background: transparent;
    color: var(--text-secondary);
  }

  .wm-btn-outline:hover {
    transform: translateY(-3px);
    border-color: var(--text-secondary);
    background: var(--amber-pale);
    color: var(--text-primary);
  }

  .wm-btn-dark {
    background: var(--ink);
    color: var(--off-white);
  }

  .wm-btn-dark:hover {
    transform: translateY(-3px);
    background: var(--ink-4);
    box-shadow: var(--shadow-md);
  }

  .wm-btn-ghost {
    border: 1.5px solid rgba(255, 255, 255, 0.32);
    background: rgba(255, 255, 255, 0.13);
    color: white;
  }

  .wm-btn-ghost:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.24);
  }

  .wm-text-link {
    color: var(--amber);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .wm-text-link:hover {
    transform: translateY(-1px);
  }

  .wm-btn-primary:focus-visible,
  .wm-btn-outline:focus-visible,
  .wm-btn-dark:focus-visible,
  .wm-btn-ghost:focus-visible,
  .wm-text-link:focus-visible,
  .wm-loc-card__phone:focus-visible,
  .wm-loc-card__cta:focus-visible,
  .wm-faq-btn:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 3px;
  }

  @media (min-width: 768px) {
    .wm-locations__grid,
    .wm-testimonials__grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .wm-faq__cols {
      grid-template-columns: 1fr 1fr;
    }

    .wm-cta-box {
      grid-template-columns: 1fr auto;
      gap: 3rem;
      padding: 5rem;
    }
  }

  @media (min-width: 1024px) {
    .wm-hero__inner {
      grid-template-columns: 54fr 46fr;
      gap: 4rem;
      padding-top: 10.5rem;
      padding-bottom: 7rem;
    }

    .wm-hero__right {
      display: block;
    }

    .wm-values__grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .wm-featured__grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .wm-story__inner {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 767px) {
    .wm-stats-bar__inner {
      grid-template-columns: repeat(2, 1fr);
    }

    .wm-stat-item:nth-child(2) {
      border-right: 0;
    }

    .wm-values__grid,
    .wm-featured__grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 479px) {
    .wm-shell {
      width: min(1360px, calc(100% - 1.4rem));
    }

    .wm-values,
    .wm-featured,
    .wm-testimonials,
    .wm-locations,
    .wm-story,
    .wm-faq {
      padding: 5rem 0;
    }

    .wm-value,
    .wm-loc-card,
    .wm-review {
      padding-left: 1.4rem;
      padding-right: 1.4rem;
    }

    .wm-cta-section {
      padding-bottom: 5.5rem;
    }

    .wm-cta-box {
      padding: 2.75rem 1.6rem;
      border-radius: var(--r-xl);
    }
  }

  @media (hover: none) {
    .wm-btn-primary:hover,
    .wm-btn-outline:hover,
    .wm-btn-dark:hover,
    .wm-btn-ghost:hover,
    .wm-loc-card:hover,
    .wm-review:hover,
    .wm-feat-card:hover {
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
      animation: none !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
