import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LOCATIONS, SITE } from "@/data/site";
import logo from "@/assets/logo.png";

/* ─── tilt hook ─── */
function useTilt(strength = 8) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [strength, -strength]), { stiffness: 300, damping: 28 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-strength, strength]), { stiffness: 300, damping: 28 });
  const scale   = useSpring(1, { stiffness: 300, damping: 24 });
  const onMove  = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
    scale.set(1.03);
  };
  const onLeave = () => { mx.set(0); my.set(0); scale.set(1); };
  return { rotateX, rotateY, scale, onMove, onLeave };
}

/* ─── contact row ─── */
function ContactRow({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <motion.a
      href={href}
      className="wm-footer__contact-row"
      whileHover={{ x: 4, transition: { type: "spring", stiffness: 380, damping: 22 } }}
    >
      <span className="wm-footer__contact-icon">{icon}</span>
      <span>{text}</span>
    </motion.a>
  );
}

/* ─── location row ─── */
function LocRow({ loc }: { loc: typeof LOCATIONS[0] }) {
  const { rotateX, rotateY, scale, onMove, onLeave } = useTilt(5);
  return (
    <motion.div style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Link to="/locations" className="wm-footer__location">
          <motion.div
            className="wm-footer__location-pin"
            whileHover={{ rotate: -10, scale: 1.15 }}
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
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="wm-footer">
        <div className="wm-footer__accent-line" />

        <div className="wm-footer__inner">

          {/* ══ BRAND ══ */}
          <motion.div
            className="wm-footer__col wm-footer__col--brand"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/" aria-label="Wise Mart — Home" className="wm-footer__logo-link">
              <motion.img
                src={logo}
                alt="Wise Mart"
                className="wm-footer__logo"
                whileHover={{ scale: 1.08, rotate: -2 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              />
            </Link>

            <p className="wm-footer__tagline">
              Fresh, delicious food crafted with passion. Experience the best taste at Wise Mart.
            </p>

            <div className="wm-footer__social">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook,  label: "Facebook"  },
                { Icon: Twitter,   label: "Twitter"   },
              ].map(({ Icon, label }, i) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="wm-footer__social-link"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  whileHover={{
                    y: -4,
                    rotateZ: i % 2 === 0 ? -6 : 6,
                    scale: 1.2,
                    transition: { type: "spring", stiffness: 380, damping: 20 },
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ══ QUICK LINKS ══ */}
          <motion.div
            className="wm-footer__col"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="wm-footer__heading">Quick Links</div>
            <nav className="wm-footer__links">
              {[
                { to: "/",         label: "Home"      },
                { to: "/locations", label: "Locations" },
                { to: "/order",    label: "Order Now"  },
                { to: "/about",    label: "About"      },
                { to: "/faq",      label: "FAQ"        },
                { to: "/contact",  label: "Contact"    },
              ].map(({ to, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
                >
                  <Link to={to} className="wm-footer__link">
                    <motion.span
                      className="wm-footer__link-inner"
                      whileHover={{ x: 6 }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    >
                      <span className="wm-footer__link-dot" />
                      {label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* ══ LOCATIONS ══ */}
          <motion.div
            className="wm-footer__col"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="wm-footer__heading">Our Locations</div>
            <div className="wm-footer__locations">
              {LOCATIONS.map((loc, i) => (
                <motion.div
                  key={loc.slug}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                >
                  <LocRow loc={loc} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ══ CONTACT ══ */}
          <motion.div
            className="wm-footer__col"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="wm-footer__heading">Get In Touch</div>
            <div className="wm-footer__contact">

              <div className="wm-footer__contact-group">
                <div className="wm-footer__contact-label">Email</div>
                <ContactRow href={`mailto:${SITE.email}`} icon={<Mail />} text={SITE.email} />
              </div>

              <div className="wm-footer__contact-divider" />

              <div className="wm-footer__contact-group">
                <div className="wm-footer__contact-label">Phone</div>
                {SITE.phones.map((p) => (
                  <ContactRow key={p} href={`tel:${p.replace(/\D/g, "")}`} icon={<Phone />} text={p} />
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="wm-footer__bottom">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          >
            © {year} {SITE.name}. All rights reserved.
          </motion.span>
          <motion.div
            className="wm-footer__bottom-links"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a href="#" className="wm-footer__bottom-link">Privacy Policy</a>
            <span className="wm-footer__bottom-dot" />
            <a href="#" className="wm-footer__bottom-link">Terms of Service</a>
          </motion.div>
        </div>

      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .wm-footer {
          background: #0a0908;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        /* ambient amber glow */
        .wm-footer::before {
          content: '';
          position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 200px;
          background: radial-gradient(ellipse, rgba(217,119,6,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* top gradient line */
        .wm-footer__accent-line {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #d97706 30%, #fbbf24 55%, #d97706 75%, transparent 100%);
          opacity: 0.5;
        }

        .wm-footer__inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px 32px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 28px 48px;
          position: relative; z-index: 1;
        }
        @media (min-width: 640px) {
          .wm-footer__inner { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .wm-footer__inner {
            grid-template-columns: 2fr 1fr 1.4fr 1fr;
            padding: 72px 40px 56px;
          }
        }

        /* ── BRAND ── */
        .wm-footer__logo-link { display: inline-flex; text-decoration: none; }
        .wm-footer__logo {
          height: 48px; width: auto; object-fit: contain;
          filter: brightness(0) invert(1); display: block;
          transition: filter 0.35s ease;
        }
        .wm-footer__logo-link:hover .wm-footer__logo {
          filter: brightness(0) invert(1)
            drop-shadow(0 0 8px rgba(217,119,6,0.9))
            drop-shadow(0 0 22px rgba(217,119,6,0.45));
        }
        .wm-footer__tagline {
          margin-top: 18px; font-size: 13px; line-height: 1.75;
          color: rgba(255,255,255,0.35); max-width: 256px;
        }
        .wm-footer__social { display: flex; align-items: center; gap: 10px; margin-top: 24px; }
        .wm-footer__social-link {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4); text-decoration: none;
          transition: border-color 0.25s, color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .wm-footer__social-link svg { width: 15px; height: 15px; }
        .wm-footer__social-link:hover {
          border-color: #d97706; color: #d97706;
          background: rgba(217,119,6,0.1);
          box-shadow: 0 4px 18px rgba(217,119,6,0.22);
        }

        /* ── COLUMN HEADINGS ── */
        .wm-footer__heading {
          font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          margin-bottom: 22px; position: relative; padding-bottom: 12px;
        }
        .wm-footer__heading::after {
          content: '';
          position: absolute; bottom: 0; left: 0;
          width: 24px; height: 1px; background: #d97706; opacity: 0.55;
          transition: width 0.35s ease;
        }
        .wm-footer__col:hover .wm-footer__heading::after { width: 44px; }

        /* ── QUICK LINKS ── */
        .wm-footer__links { display: flex; flex-direction: column; gap: 4px; }
        .wm-footer__link  { text-decoration: none; display: block; }
        .wm-footer__link-inner {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 13.5px; color: rgba(255,255,255,0.46);
          padding: 5px 0; transition: color 0.18s;
        }
        .wm-footer__link:hover .wm-footer__link-inner { color: #fff; }
        .wm-footer__link-dot {
          display: inline-block; width: 4px; height: 4px; border-radius: 50%;
          background: #d97706; opacity: 0; flex-shrink: 0;
          transition: opacity 0.2s, transform 0.2s;
        }
        .wm-footer__link:hover .wm-footer__link-dot { opacity: 1; transform: scale(1.35); }

        /* ── LOCATIONS ── */
        .wm-footer__locations { display: flex; flex-direction: column; gap: 8px; }
        .wm-footer__location {
          display: flex; align-items: flex-start; gap: 10px;
          text-decoration: none;
          padding: 10px 12px; border-radius: 10px;
          border: 1px solid transparent;
          transition: border-color 0.25s, background 0.25s;
        }
        .wm-footer__location:hover {
          border-color: rgba(217,119,6,0.22);
          background: rgba(217,119,6,0.04);
        }
        .wm-footer__location-pin {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 7px;
          background: rgba(217,119,6,0.1); color: #d97706;
          flex-shrink: 0; margin-top: 1px;
          transition: background 0.2s;
        }
        .wm-footer__location:hover .wm-footer__location-pin { background: rgba(217,119,6,0.22); }
        .wm-footer__location-pin svg { width: 13px; height: 13px; }
        .wm-footer__location-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px; font-weight: 700;
          color: rgba(255,255,255,0.7); line-height: 1.3;
          transition: color 0.2s;
        }
        .wm-footer__location:hover .wm-footer__location-name { color: #fff; }
        .wm-footer__location-sub  { font-size: 11px; color: rgba(255,255,255,0.26); margin-top: 3px; }
        .wm-footer__location-arrow {
          width: 13px; height: 13px; color: rgba(217,119,6,0);
          flex-shrink: 0; margin-left: auto; margin-top: 3px;
          transition: color 0.2s, transform 0.25s;
        }
        .wm-footer__location:hover .wm-footer__location-arrow {
          color: #d97706; transform: translate(2px, -2px);
        }

        /* ── CONTACT ── */
        .wm-footer__contact       { display: flex; flex-direction: column; gap: 0; }
        .wm-footer__contact-group { display: flex; flex-direction: column; gap: 10px; }
        .wm-footer__contact-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.2);
        }
        .wm-footer__contact-divider {
          height: 1px; background: rgba(255,255,255,0.06); margin: 18px 0;
        }
        .wm-footer__contact-row {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: rgba(255,255,255,0.46);
          font-size: 13px; padding: 5px 0;
          transition: color 0.2s;
          position: relative;
        }
        .wm-footer__contact-row::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 1px; background: rgba(217,119,6,0.4);
          transition: width 0.3s ease;
        }
        .wm-footer__contact-row:hover { color: #fff; }
        .wm-footer__contact-row:hover::after { width: 100%; }
        .wm-footer__contact-icon {
          width: 14px; height: 14px; color: #d97706; flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
        }
        .wm-footer__contact-row:hover .wm-footer__contact-icon {
          transform: scale(1.25) rotate(-8deg);
        }

        /* ── BOTTOM BAR ── */
        .wm-footer__bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          max-width: 1280px; margin: 0 auto;
          padding: 20px 28px 28px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 12px; color: rgba(255,255,255,0.2);
          position: relative; z-index: 1;
        }
        @media (min-width: 768px) { .wm-footer__bottom { padding: 20px 40px 28px; } }
        .wm-footer__bottom-links { display: flex; align-items: center; gap: 10px; }
        .wm-footer__bottom-link  {
          font-size: 12px; color: rgba(255,255,255,0.2);
          text-decoration: none; transition: color 0.18s;
        }
        .wm-footer__bottom-link:hover { color: rgba(255,255,255,0.55); }
        .wm-footer__bottom-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(255,255,255,0.16); flex-shrink: 0;
        }
      `}</style>
    </>
  );
}