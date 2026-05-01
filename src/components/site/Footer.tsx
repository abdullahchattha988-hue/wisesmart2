import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { type MouseEvent, type ReactNode } from "react";
import { LOCATIONS, SITE } from "@/data/site";
import logo from "@/assets/logo.png";

type LocationItem = (typeof LOCATIONS)[number];

const EMAIL = "info@wisemart2.com";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/locations", label: "Locations" },
  { to: "/order", label: "Order Now" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "#",
    label: "Instagram",
    icon: Instagram,
    external: false,
  },
  {
    href: "https://www.facebook.com/wisemart2",
    label: "Facebook",
    icon: Facebook,
    external: true,
  },
  {
    href: `mailto:${EMAIL}`,
    label: "Email",
    icon: Mail,
    external: false,
  },
] as const;

function reveal(reduceMotion: boolean, delay = 0, y = 24) {
  if (reduceMotion) {
    return {
      initial: { opacity: 1, y: 0 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };
}

function useTilt(strength = 8) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(my, [-0.5, 0.5], [strength, -strength]),
    { stiffness: 300, damping: 28 },
  );
  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-strength, strength]),
    { stiffness: 300, damping: 28 },
  );
  const scale = useSpring(1, { stiffness: 300, damping: 24 });

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
    scale.set(1.03);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    scale.set(1);
  };

  return {
    shouldReduceMotion,
    rotateX,
    rotateY,
    scale,
    onMove,
    onLeave,
  };
}

function ContactRow({
  href,
  icon,
  text,
}: {
  href: string;
  icon: ReactNode;
  text: string;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.a
      href={href}
      className="wm-footer__contact-row"
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              x: 4,
              transition: { type: "spring", stiffness: 380, damping: 22 },
            }
      }
    >
      <span className="wm-footer__contact-icon">{icon}</span>
      <span>{text}</span>
    </motion.a>
  );
}

function LocRow({ loc }: { loc: LocationItem }) {
  const { shouldReduceMotion, rotateX, rotateY, scale, onMove, onLeave } = useTilt(5);

  return (
    <motion.div style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        style={shouldReduceMotion ? undefined : { rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Link
          to="/menu/$location"
          params={{ location: loc.slug }}
          className="wm-footer__location"
        >
          <motion.div
            className="wm-footer__location-pin"
            whileHover={
              shouldReduceMotion
                ? undefined
                : { rotate: -10, scale: 1.15 }
            }
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <MapPin />
          </motion.div>
          <div>
            <div className="wm-footer__location-name">{loc.name}</div>
            <div className="wm-footer__location-sub">{loc.specialty}</div>
          </div>
          <ArrowUpRight className="wm-footer__location-arrow" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function Footer() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="wm-footer">
        <div className="wm-footer__accent-line" />
        <div className="wm-footer__mesh" aria-hidden="true" />

        <div className="wm-footer__inner">
          <motion.div
            className="wm-footer__col wm-footer__col--brand"
            {...reveal(shouldReduceMotion, 0)}
          >
            <Link to="/" aria-label="Wise Mart home" className="wm-footer__logo-link">
              <motion.img
                src={logo}
                alt="Wise Mart"
                className="wm-footer__logo"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { scale: 1.08, rotate: -2 }
                }
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              />
            </Link>

            <p className="wm-footer__tagline">
              Fresh food, warm service, and Maryland comfort made to order. Wise Mart has
              been serving hungry guests since {SITE.established}.
            </p>

            <div className="wm-footer__social">
              {SOCIAL_LINKS.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    aria-label={item.label}
                    className="wm-footer__social-link"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.28 + index * 0.08 }}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: -4,
                            rotateZ: index % 2 === 0 ? -6 : 6,
                            scale: 1.18,
                            transition: { type: "spring", stiffness: 380, damping: 20 },
                          }
                    }
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                  >
                    <Icon />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="wm-footer__col"
            {...reveal(shouldReduceMotion, 0.08)}
          >
            <div className="wm-footer__heading">Quick Links</div>
            <nav className="wm-footer__links">
              {QUICK_LINKS.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.15 + index * 0.06 }}
                >
                  <Link to={link.to} className="wm-footer__link">
                    <motion.span
                      className="wm-footer__link-inner"
                      whileHover={
                        shouldReduceMotion
                          ? undefined
                          : {
                              x: 6,
                              transition: { type: "spring", stiffness: 380, damping: 22 },
                            }
                      }
                    >
                      <span className="wm-footer__link-dot" />
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          <motion.div
            className="wm-footer__col"
            {...reveal(shouldReduceMotion, 0.16)}
          >
            <div className="wm-footer__heading">Our Locations</div>
            <div className="wm-footer__locations">
              {LOCATIONS.map((loc, index) => (
                <motion.div
                  key={loc.slug}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <LocRow loc={loc} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="wm-footer__col"
            {...reveal(shouldReduceMotion, 0.24)}
          >
            <div className="wm-footer__heading">Get In Touch</div>
            <div className="wm-footer__contact">
              <div className="wm-footer__contact-group">
                <div className="wm-footer__contact-label">Email</div>
                <ContactRow
                  href={`mailto:${EMAIL}`}
                  icon={<Mail />}
                  text={EMAIL}
                />
              </div>

              <div className="wm-footer__contact-divider" />

              <div className="wm-footer__contact-group">
                <div className="wm-footer__contact-label">Phone</div>
                {SITE.phones.map((phone) => (
                  <ContactRow
                    key={phone}
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    icon={<Phone />}
                    text={phone}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="wm-footer__bottom">
          <motion.span
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            © {year} {SITE.name}. All rights reserved.
          </motion.span>

          <motion.div
            className="wm-footer__bottom-links"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="wm-footer__bottom-meta">Serving Maryland since {SITE.established}</span>
            <span className="wm-footer__bottom-dot" />
            <a href="#" className="wm-footer__bottom-link">Privacy Policy</a>
            <span className="wm-footer__bottom-dot" />
            <a href="#" className="wm-footer__bottom-link">Terms of Service</a>
          </motion.div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .wm-footer {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top left, rgba(217,119,6,0.08), transparent 26%),
            linear-gradient(180deg, #0c0a08 0%, #090807 100%);
          border-top: 1px solid rgba(255,255,255,0.06);
          font-family: "DM Sans", sans-serif;
        }

        .wm-footer::before {
          content: "";
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 200px;
          background: radial-gradient(ellipse, rgba(217,119,6,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .wm-footer__mesh {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: linear-gradient(180deg, rgba(0,0,0,0.5), transparent 80%);
        }

        .wm-footer__accent-line {
          height: 2px;
          opacity: 0.5;
          background: linear-gradient(90deg, transparent 0%, #d97706 30%, #fbbf24 55%, #d97706 75%, transparent 100%);
        }

        .wm-footer__inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px 32px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 28px 48px;
        }

        @media (min-width: 640px) {
          .wm-footer__inner {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .wm-footer__inner {
            grid-template-columns: 2fr 1fr 1.4fr 1fr;
            padding: 72px 40px 56px;
          }
        }

        .wm-footer__col {
          position: relative;
        }

        .wm-footer__logo-link {
          display: inline-flex;
          text-decoration: none;
        }

        .wm-footer__logo {
          display: block;
          width: auto;
          height: 48px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transition: filter 0.35s ease;
        }

        .wm-footer__logo-link:hover .wm-footer__logo {
          filter:
            brightness(0) invert(1)
            drop-shadow(0 0 8px rgba(217,119,6,0.9))
            drop-shadow(0 0 22px rgba(217,119,6,0.45));
        }

        .wm-footer__tagline {
          max-width: 280px;
          margin-top: 18px;
          color: rgba(255,255,255,0.38);
          font-size: 13px;
          line-height: 1.8;
        }

        .wm-footer__social {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
        }

        .wm-footer__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition:
            border-color 0.25s ease,
            color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
        }

        .wm-footer__social-link svg {
          width: 15px;
          height: 15px;
        }

        .wm-footer__social-link:hover {
          border-color: #d97706;
          color: #d97706;
          background: rgba(217,119,6,0.1);
          box-shadow: 0 4px 18px rgba(217,119,6,0.22);
        }

        .wm-footer__heading {
          position: relative;
          padding-bottom: 12px;
          margin-bottom: 22px;
          color: rgba(255,255,255,0.25);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .wm-footer__heading::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 24px;
          height: 1px;
          background: #d97706;
          opacity: 0.55;
          transition: width 0.35s ease;
        }

        .wm-footer__col:hover .wm-footer__heading::after {
          width: 44px;
        }

        .wm-footer__links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .wm-footer__link {
          display: block;
          text-decoration: none;
        }

        .wm-footer__link-inner {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 0;
          color: rgba(255,255,255,0.46);
          font-size: 13.5px;
          transition: color 0.18s ease;
        }

        .wm-footer__link:hover .wm-footer__link-inner {
          color: #fff;
        }

        .wm-footer__link-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d97706;
          opacity: 0;
          flex-shrink: 0;
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        }

        .wm-footer__link:hover .wm-footer__link-dot {
          opacity: 1;
          transform: scale(1.35);
        }

        .wm-footer__locations {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .wm-footer__location {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          text-decoration: none;
          transition:
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .wm-footer__location:hover {
          border-color: rgba(217,119,6,0.22);
          background: rgba(217,119,6,0.04);
        }

        .wm-footer__location-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          margin-top: 1px;
          flex-shrink: 0;
          border-radius: 7px;
          background: rgba(217,119,6,0.1);
          color: #d97706;
          transition: background 0.2s ease;
        }

        .wm-footer__location:hover .wm-footer__location-pin {
          background: rgba(217,119,6,0.22);
        }

        .wm-footer__location-pin svg {
          width: 13px;
          height: 13px;
        }

        .wm-footer__location-name {
          color: rgba(255,255,255,0.7);
          font-family: "Cormorant Garamond", serif;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
          transition: color 0.2s ease;
        }

        .wm-footer__location:hover .wm-footer__location-name {
          color: #fff;
        }

        .wm-footer__location-sub {
          margin-top: 3px;
          color: rgba(255,255,255,0.26);
          font-size: 11px;
        }

        .wm-footer__location-arrow {
          width: 13px;
          height: 13px;
          margin-top: 3px;
          margin-left: auto;
          flex-shrink: 0;
          color: rgba(217,119,6,0);
          transition:
            color 0.2s ease,
            transform 0.25s ease;
        }

        .wm-footer__location:hover .wm-footer__location-arrow {
          color: #d97706;
          transform: translate(2px, -2px);
        }

        .wm-footer__contact {
          display: flex;
          flex-direction: column;
        }

        .wm-footer__contact-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .wm-footer__contact-label {
          color: rgba(255,255,255,0.2);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .wm-footer__contact-divider {
          height: 1px;
          margin: 18px 0;
          background: rgba(255,255,255,0.06);
        }

        .wm-footer__contact-row {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 0;
          color: rgba(255,255,255,0.46);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .wm-footer__contact-row::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 1px;
          background: rgba(217,119,6,0.4);
          transition: width 0.3s ease;
        }

        .wm-footer__contact-row:hover {
          color: #fff;
        }

        .wm-footer__contact-row:hover::after {
          width: 100%;
        }

        .wm-footer__contact-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          color: #d97706;
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
        }

        .wm-footer__contact-row:hover .wm-footer__contact-icon {
          transform: scale(1.25) rotate(-8deg);
        }

        .wm-footer__bottom {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 28px 28px;
          border-top: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.2);
          font-size: 12px;
        }

        @media (min-width: 768px) {
          .wm-footer__bottom {
            padding: 20px 40px 28px;
          }
        }

        .wm-footer__bottom-links {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .wm-footer__bottom-meta,
        .wm-footer__bottom-link {
          color: rgba(255,255,255,0.2);
          font-size: 12px;
        }

        .wm-footer__bottom-link {
          text-decoration: none;
          transition: color 0.18s ease;
        }

        .wm-footer__bottom-link:hover {
          color: rgba(255,255,255,0.55);
        }

        .wm-footer__bottom-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          flex-shrink: 0;
          background: rgba(255,255,255,0.16);
        }

        .wm-footer__logo-link:focus-visible,
        .wm-footer__social-link:focus-visible,
        .wm-footer__link:focus-visible,
        .wm-footer__location:focus-visible,
        .wm-footer__contact-row:focus-visible,
        .wm-footer__bottom-link:focus-visible {
          outline: 2px solid #d97706;
          outline-offset: 3px;
        }

        @media (max-width: 767px) {
          .wm-footer__bottom {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wm-footer *,
          .wm-footer *::before,
          .wm-footer *::after {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}