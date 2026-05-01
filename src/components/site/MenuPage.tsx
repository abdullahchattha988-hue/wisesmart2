import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { Phone, MapPin, Clock, ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef, useState, useEffect, useCallback } from "react";
import { LOCATIONS, type LocationSlug } from "@/data/site";
import { MENU_SECTIONS, LOCATION_INTROS, type MenuSection, type PriceRow } from "@/data/menu";
import bannerImg from "@/assets/banner-3.webp";

/* ─── tilt hook ─── */
function useTilt(strength = 6) {
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 320, damping: 32 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 320, damping: 32 });
  const scale   = useSpring(1, { stiffness: 320, damping: 28 });
  const onMove  = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
    scale.set(1.018);
  }, [x, y, scale]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); scale.set(1); }, [x, y, scale]);
  return { rotateX, rotateY, scale, onMove, onLeave };
}

const COL_LABELS: Record<string, string> = {
  name: "Item", small: 'Small (12")', large: 'Large (16")',
  half: "Half", whole: "Whole", price: "Price", desc: "Description",
};

/* ─── Row ─── */
function Row({ row, columns, index }: { row: PriceRow; columns: MenuSection["columns"]; index: number }) {
  const r = row as Record<string, string>;
  return (
    <motion.tr
      className="wmp-row"
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.35, delay: index * 0.025, ease: [0.22, 1, 0.36, 1] }}
    >
      {columns.map((c) => {
        if (c === "name") return (
          <td key={c} className="wmp-cell">
            <span className="wmp-item-name">{r.name}</span>
          </td>
        );
        if (c === "desc") return (
          <td key={c} className="wmp-cell">
            <span className="wmp-item-desc">{r.desc ?? ""}</span>
          </td>
        );
        return (
          <td key={c} className="wmp-cell">
            <span className="wmp-price">{r[c]}</span>
          </td>
        );
      })}
    </motion.tr>
  );
}

/* ─── Section Card ─── */
function SectionCard({ section, index }: { section: MenuSection; index: number }) {
  const { rotateX, rotateY, scale, onMove, onLeave } = useTilt(4);
  return (
    <motion.section
      id={section.id}
      className="wmp-section scroll-mt-28"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.65, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* section header */}
      <div className="wmp-sec-hdr">
        <span className="wmp-sec-hdr__num">{String(index + 1).padStart(2, "0")}</span>
        <div className="wmp-sec-hdr__text">
          <h2 className="wmp-sec-title">{section.title}</h2>
          {section.intro && <p className="wmp-sec-intro">{section.intro}</p>}
        </div>
        <div className="wmp-sec-hdr__line" />
      </div>

      {/* tilt card */}
      <motion.div
        className="wmp-table-card"
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", perspective: 1200 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="wmp-table-wrap">
          <table className="wmp-table" role="table">
            <thead>
              <tr className="wmp-thead-row">
                {section.columns.map((c) => (
                  <th key={c} className="wmp-th" scope="col">{COL_LABELS[c]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((r, i) => (
                <Row key={i} row={r} columns={section.columns} index={i} />
              ))}
            </tbody>
          </table>
        </div>
        {section.footnote && (
          <div className="wmp-footnote">{section.footnote}</div>
        )}
      </motion.div>
    </motion.section>
  );
}

/* ─── Hero Particles ─── */
function HeroParticles() {
  return (
    <div aria-hidden="true" style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:1 }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute", borderRadius: "50%",
            width:  i % 3 === 0 ? 3 : 1.8,
            height: i % 3 === 0 ? 3 : 1.8,
            background: i % 4 === 0 ? "#c8590a" : "rgba(240,235,228,0.09)",
            left: `${5 + (i * 5.9) % 90}%`,
            top:  `${10 + (i * 7.3) % 80}%`,
            boxShadow: i % 4 === 0 ? "0 0 6px rgba(200,89,10,0.6)" : "none",
          }}
          animate={{ y:[0,-28,0], opacity:[0,0.8,0], scale:[0,1,0] }}
          transition={{ duration: 3.2+(i%4)*0.6, delay: i*0.4, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Main Page ─── */
export function MenuPage({ slug }: { slug: LocationSlug }) {
  const loc      = LOCATIONS.find((l) => l.slug === slug)!;
  const intro    = LOCATION_INTROS[slug];
  const locIndex = LOCATIONS.findIndex((l) => l.slug === slug);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);

  const [activeId, setActiveId] = useState(MENU_SECTIONS[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-28% 0px -60% 0px" },
    );
    MENU_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
      font-weight: 700;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .wmp-footnote {
    padding: 0.9rem 1.35rem;
    border-top: 1px solid rgba(242, 235, 227, 0.07);
    background: rgba(200, 89, 10, 0.035);
    color: var(--wmp-ink-faint);
    font-size: 0.76rem;
    line-height: 1.65;
  }

  .wmp-cta-wrap {
    padding: 1rem 0 5rem;
  }

  .wmp-cta {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    padding: clamp(2rem, 5vw, 4.2rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    flex-wrap: wrap;
    background:
      radial-gradient(circle at 12% 20%, rgba(255, 255, 255, 0.14), transparent 46%),
      var(--wmp-accent);
    color: white;
  }

  .wmp-cta-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.035;
    background-image: repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%);
    background-size: 12px 12px;
  }

  .wmp-cta-ring {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .wmp-cta-ring::after {
    content: "";
    position: absolute;
    inset: 24px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .wmp-cta-copy,
  .wmp-cta-actions {
    position: relative;
    z-index: 1;
  }

  .wmp-cta-title {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.7rem);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .wmp-cta-text {
    margin: 0.7rem 0 0;
    max-width: 42rem;
    color: rgba(255, 255, 255, 0.84);
    font-size: 0.97rem;
    line-height: 1.75;
  }

  @media (max-width: 980px) {
    .wmp-hero-inner {
      grid-template-columns: 1fr;
      padding-bottom: 4.75rem;
    }

    .wmp-hero-card-wrap {
      align-self: auto;
    }
  }

  @media (max-width: 720px) {
    .wmp-shell {
      width: min(1280px, calc(100% - 1.4rem));
    }

    .wmp-hero-title {
      font-size: clamp(2.9rem, 14vw, 4.5rem);
    }

    .wmp-hero-subtitle {
      font-size: 0.94rem;
    }

    .wmp-section-header {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .wmp-section-rule {
      width: 100%;
      flex-basis: 100%;
    }

    .wmp-th,
    .wmp-cell,
    .wmp-footnote {
      padding-left: 0.95rem;
      padding-right: 0.95rem;
    }

    .wmp-nav-link {
      padding-left: 0.8rem;
      padding-right: 0.8rem;
    }

    .wmp-nav-link::after {
      left: 0.8rem;
      right: 0.8rem;
    }

    .wmp-sections {
      padding-top: 2.8rem;
      gap: 2.4rem;
    }

    .wmp-cta-wrap {
      padding-bottom: 4rem;
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
      `}</style>

      <div className="wmp-page">

        {/* ════════ HERO ════════ */}
        <section className="wmp-hero" ref={heroRef}>
          <motion.div
            className="wmp-hero__bg"
            style={{ backgroundImage: `url(${bannerImg})`, y: bgY, opacity: bgOpacity, scale: bgScale }}
          />
          <div className="wmp-hero__ov" />
          <div className="wmp-hero__amber" />
          <div className="wmp-hero__grain" />
          <div className="wmp-hero__orb" />
          <HeroParticles />

          <div className="wmp-hero__inner">

            {/* LEFT */}
            <motion.div style={{ y: textY }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to="/locations" className="wmp-eyebrow">
                  <span className="wmp-eyebrow-line" />
                  <MapPin style={{ width: 10, height: 10 }} />
                  {loc.name}, MD
                  <span className="wmp-eyebrow-line" />
                </Link>
              </motion.div>

              <motion.h1
                className="wmp-hero__title"
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d", perspective: 900 }}
              >
                {loc.name}<br />
                <span className="wmp-shimmer">Menu.</span>
              </motion.h1>

              <motion.p
                className="wmp-hero__sub"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.34 }}
              >
                {intro}
              </motion.p>

              <motion.div
                className="wmp-hero__actions"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <a href={loc.phoneHref} className="wmp-btn-primary">
                  <Phone style={{ width: 13, height: 13 }} /> {loc.phone}
                </a>
                <Link to="/order" className="wmp-btn-outline">
                  Order Online <ArrowRight style={{ width: 13, height: 13 }} />
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT — info card */}
            <motion.div
              initial={{ opacity: 0, y: 56, rotateX: 18, rotateY: -10, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
              transition={{ duration: 0.92, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ rotateY: 3.5, rotateX: -2.5, scale: 1.025, transition: { duration: 0.32 } }}
              style={{ transformStyle: "preserve-3d", perspective: 900 }}
            >
              <div className="wmp-hero__card">
                {/* badge row */}
                <div className="wmp-loc-badge">
                  <span className="wmp-loc-num">Location 0{locIndex + 1}</span>
                  <span className="wmp-specialty-tag">{loc.specialty}</span>
                </div>

                <div className="wmp-card-divider" />

                {/* info rows */}
                <div className="wmp-hero__card-row">
                  <MapPin className="wmp-hero__card-icon" style={{ width: 14, height: 14 }} />
                  <span>{loc.address}</span>
                </div>
                <div className="wmp-hero__card-row">
                  <Clock className="wmp-hero__card-icon" style={{ width: 14, height: 14 }} />
                  <span>{loc.hours}</span>
                </div>
                <div className="wmp-hero__card-row">
                  <Phone className="wmp-hero__card-icon" style={{ width: 14, height: 14 }} />
                  <a href={loc.phoneHref}>{loc.phone}</a>
                </div>

                <div className="wmp-card-divider" />

                {/* jump links */}
                <div>
                  <div className="wmp-jump-label">Jump to section</div>
                  <div className="wmp-jump-pills">
                    {MENU_SECTIONS.slice(0, 6).map((s) => (
                      <a key={s.id} href={`#${s.id}`} className="wmp-jump-pill">
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* scroll cue */}
          <div className="wmp-scroll-cue" aria-hidden="true">
            <div className="wmp-scroll-cue__track" />
            <span>scroll</span>
          </div>
        </section>

        {/* ════════ STICKY SECTION NAV ════════ */}
        <nav className="wmp-nav" aria-label="Menu sections">
          <div className="wmp-nav__inner">
            {MENU_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`wmp-nav-pill${activeId === s.id ? " active" : ""}`}
                aria-current={activeId === s.id ? "location" : undefined}
              >
                {s.title}
              </a>
            ))}
          </div>
        </nav>

        {/* ════════ MENU SECTIONS ════════ */}
        <div className="wmp-sections" role="main">
          {MENU_SECTIONS.map((section, i) => (
            <SectionCard key={section.id} section={section} index={i} />
          ))}
        </div>

        {/* ════════ CTA FOOTER ════════ */}
        <div className="wmp-cta">
          <motion.div
            className="wmp-cta-box"
            initial={{ opacity: 0, y: 44, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.008, transition: { duration: 0.36 } }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="wmp-cta-box__pattern" />
            <div className="wmp-cta-box__circle" />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 className="wmp-cta-title">Hungry yet?</h3>
              <p className="wmp-cta-sub">
                Call {loc.name} or place your order online — we'll have it ready when you arrive.
              </p>
            </div>
            <div className="wmp-cta-btns">
              <a href={loc.phoneHref} className="wmp-btn-dark">
                <Phone style={{ width: 14, height: 14 }} /> {loc.phone}
              </a>
              <Link to="/order" className="wmp-btn-ghost">
                Order Online <ExternalLink style={{ width: 13, height: 13 }} />
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}