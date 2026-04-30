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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .wmp-page {
          font-family: 'DM Sans', sans-serif;
          background: #070605;
          color: #f0ebe4;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ════════════ HERO ════════════ */
        .wmp-hero {
          position: relative; min-height: 100svh;
          background: #070605; overflow: hidden;
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .wmp-hero__bg {
          position: absolute; inset: -8%;
          background-size: cover; background-position: center 30%;
          will-change: transform;
        }
        /* cinematic gradient stack */
        .wmp-hero__ov {
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg,
              rgba(7,6,5,0.22) 0%,
              rgba(7,6,5,0.55) 40%,
              rgba(7,6,5,0.94) 76%,
              rgba(7,6,5,1.00) 100%
            ),
            linear-gradient(100deg,
              rgba(7,6,5,0.96) 0%,
              rgba(7,6,5,0.62) 44%,
              transparent 68%
            );
        }
        /* amber warmth at bottom-left */
        .wmp-hero__amber {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 55% at 8% 88%, rgba(200,89,10,0.11) 0%, transparent 58%);
        }
        /* grain */
        .wmp-hero__grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px 160px;
        }
        /* ambient orb */
        .wmp-hero__orb {
          position: absolute; bottom: -80px; left: -60px;
          width: 440px; height: 440px; border-radius: 50%;
          background: radial-gradient(circle, rgba(200,89,10,0.13) 0%, transparent 68%);
          filter: blur(72px); pointer-events: none;
        }

        .wmp-hero__inner {
          position: relative; z-index: 2;
          max-width: 1360px; margin: 0 auto;
          padding: 0 44px 88px; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 52px; align-items: flex-end;
        }
        @media(max-width:960px){
          .wmp-hero__inner { grid-template-columns: 1fr; padding: 0 28px 72px; }
        }

        /* eyebrow */
        .wmp-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.26em;
          text-transform: uppercase; color: #c8590a;
          text-decoration: none;
          transition: opacity 0.22s;
        }
        .wmp-eyebrow:hover { opacity: 0.72; }
        .wmp-eyebrow-line {
          display: inline-block; width: 22px; height: 1px;
          background: #c8590a; opacity: 0.55; flex-shrink: 0;
        }

        .wmp-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(54px, 7.8vw, 100px);
          font-weight: 700; line-height: 0.96;
          letter-spacing: -0.015em; color: #f0ebe4;
          margin-top: 22px;
        }
        .wmp-shimmer {
          background: linear-gradient(92deg,
            #c8590a 0%, #e8812a 22%, #f5b040 40%,
            #fbc95a 50%, #e8812a 65%, #c8590a 100%
          );
          background-size: 280% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wmpShimmer 5s linear infinite;
        }
        @keyframes wmpShimmer {
          0%   { background-position: -140% center; }
          100% { background-position:  140% center; }
        }

        .wmp-hero__sub {
          font-size: 14.5px; color: rgba(240,235,228,0.44);
          line-height: 1.85; margin-top: 22px; max-width: 440px;
          font-weight: 300;
        }
        .wmp-hero__actions {
          display: flex; flex-wrap: wrap; gap: 10px; margin-top: 32px;
        }

        /* hero info card */
        .wmp-hero__card {
          background: rgba(7,6,5,0.52);
          border: 1px solid rgba(240,235,228,0.10);
          border-radius: 20px; padding: 32px;
          backdrop-filter: blur(22px) saturate(1.2);
          display: flex; flex-direction: column; gap: 18px;
          transition: border-color 0.38s, box-shadow 0.38s;
        }
        @media(max-width:960px){ .wmp-hero__card { display: none; } }
        .wmp-hero__card:hover {
          border-color: rgba(200,89,10,0.32);
          box-shadow: 0 28px 72px rgba(0,0,0,0.55);
        }

        .wmp-loc-badge {
          display: inline-flex; align-items: center; gap: 8px;
        }
        .wmp-loc-num {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(240,235,228,0.2);
        }
        .wmp-specialty-tag {
          display: inline-block;
          background: rgba(200,89,10,0.12); color: #c8590a;
          font-size: 9px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 5px 13px;
          border-radius: 50px; border: 1px solid rgba(200,89,10,0.26);
        }

        .wmp-hero__card-row {
          display: flex; align-items: flex-start; gap: 11px;
          font-size: 13px; color: rgba(240,235,228,0.58); line-height: 1.6;
        }
        .wmp-hero__card-icon {
          color: #c8590a; flex-shrink: 0; margin-top: 1px;
        }
        .wmp-hero__card-row a {
          color: inherit; text-decoration: none; transition: color 0.2s;
        }
        .wmp-hero__card-row a:hover { color: rgba(240,235,228,0.88); }

        .wmp-card-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(240,235,228,0.08), transparent);
        }

        .wmp-jump-label {
          font-size: 9px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(240,235,228,0.22);
          margin-bottom: 10px;
        }
        .wmp-jump-pills { display: flex; flex-wrap: wrap; gap: 6px; }
        .wmp-jump-pill {
          font-size: 10.5px; font-weight: 600;
          padding: 5px 12px; border-radius: 50px;
          border: 1px solid rgba(240,235,228,0.10);
          color: rgba(240,235,228,0.42); text-decoration: none;
          transition: border-color 0.22s, color 0.22s, background 0.22s;
        }
        .wmp-jump-pill:hover {
          border-color: rgba(200,89,10,0.5);
          color: #c8590a;
          background: rgba(200,89,10,0.07);
        }

        /* scroll cue */
        .wmp-scroll-cue {
          position: absolute; bottom: 28px; left: 50%;
          transform: translateX(-50%); z-index: 3;
          display: flex; flex-direction: column;
          align-items: center; gap: 7px;
          font-size: 9px; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(240,235,228,0.22);
        }
        .wmp-scroll-cue__track {
          width: 1px; height: 44px;
          background: rgba(240,235,228,0.10); position: relative; overflow: hidden;
        }
        .wmp-scroll-cue__track::after {
          content: '';
          position: absolute; top: -100%; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(to bottom, transparent, #c8590a, transparent);
          animation: scrollDrop 2.1s ease-in-out infinite;
        }
        @keyframes scrollDrop {
          0%   { top: -100%; opacity: 0; }
          25%  { opacity: 1; }
          75%  { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }

        /* ════════════ STICKY NAV ════════════ */
        .wmp-nav {
          position: sticky; top: 0; z-index: 40;
          background: rgba(7,6,5,0.90);
          backdrop-filter: blur(20px) saturate(1.5);
          border-bottom: 1px solid rgba(240,235,228,0.07);
        }
        .wmp-nav__inner {
          max-width: 1360px; margin: 0 auto;
          padding: 0 44px;
          display: flex; gap: 0; overflow-x: auto; scrollbar-width: none;
          align-items: stretch;
        }
        .wmp-nav__inner::-webkit-scrollbar { display: none; }
        @media(max-width:640px){ .wmp-nav__inner { padding: 0 20px; } }

        .wmp-nav-pill {
          position: relative;
          white-space: nowrap; padding: 15px 17px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px; font-weight: 500; letter-spacing: 0.04em;
          color: rgba(240,235,228,0.38);
          border: none; background: transparent; cursor: pointer;
          flex-shrink: 0; text-decoration: none; display: inline-flex;
          align-items: center;
          transition: color 0.22s;
        }
        .wmp-nav-pill::after {
          content: '';
          position: absolute; bottom: 0; left: 17px; right: 17px;
          height: 2px; border-radius: 2px 2px 0 0;
          background: #c8590a;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
        }
        .wmp-nav-pill:hover { color: rgba(240,235,228,0.72); }
        .wmp-nav-pill.active { color: #c8590a; font-weight: 600; }
        .wmp-nav-pill.active::after { transform: scaleX(1); }

        /* ════════════ MENU SECTIONS ════════════ */
        .wmp-sections {
          max-width: 1360px; margin: 0 auto;
          padding: 64px 44px 88px;
          display: flex; flex-direction: column; gap: 60px;
        }
        @media(max-width:640px){ .wmp-sections { padding: 44px 24px 64px; gap: 44px; } }

        /* section header */
        .wmp-sec-hdr {
          display: flex; align-items: center; gap: 16px; margin-bottom: 22px;
        }
        .wmp-sec-hdr__num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px; font-weight: 300; font-style: italic;
          color: rgba(200,89,10,0.13); line-height: 1;
          flex-shrink: 0; letter-spacing: -0.03em;
        }
        .wmp-sec-hdr__text { flex-shrink: 0; }
        .wmp-sec-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 700; color: #f0ebe4; line-height: 1.1;
        }
        .wmp-sec-intro {
          font-size: 13px; color: rgba(240,235,228,0.34);
          margin-top: 5px; line-height: 1.65; font-weight: 300;
        }
        .wmp-sec-hdr__line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(200,89,10,0.25) 0%, transparent 100%);
          min-width: 20px;
        }

        /* table card */
        .wmp-table-card {
          border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(240,235,228,0.07);
          background: #0c0a08;
          transition: border-color 0.38s, box-shadow 0.42s;
        }
        .wmp-table-card:hover {
          border-color: rgba(200,89,10,0.26);
          box-shadow: 0 24px 64px rgba(0,0,0,0.52);
        }
        .wmp-table-wrap { overflow-x: auto; }
        .wmp-table { width: 100%; border-collapse: collapse; }

        /* thead */
        .wmp-thead-row {
          background: rgba(200,89,10,0.06);
          border-bottom: 1px solid rgba(200,89,10,0.12);
        }
        .wmp-th {
          padding: 14px 22px;
          text-align: left;
          font-family: 'DM Sans', sans-serif;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(240,235,228,0.28);
        }

        /* rows */
        .wmp-row {
          border-bottom: 1px solid rgba(240,235,228,0.04);
          transition: background 0.18s;
        }
        .wmp-row:last-child { border-bottom: none; }
        .wmp-row:hover { background: rgba(240,235,228,0.025); }

        .wmp-cell { padding: 15px 22px; vertical-align: top; }

        .wmp-item-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17.5px; font-weight: 700;
          color: rgba(240,235,228,0.90); line-height: 1.25;
        }
        .wmp-item-desc {
          font-size: 12px; color: rgba(240,235,228,0.34);
          line-height: 1.6; font-weight: 300;
        }
        .wmp-price {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          color: #c8590a; white-space: nowrap;
        }

        .wmp-footnote {
          border-top: 1px solid rgba(240,235,228,0.06);
          background: rgba(200,89,10,0.035);
          padding: 13px 22px;
          font-size: 11.5px; color: rgba(240,235,228,0.26);
          line-height: 1.65;
        }

        /* ════════════ BUTTONS ════════════ */
        .wmp-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; background: #c8590a; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 12.5px;
          font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
          position: relative; overflow: hidden;
        }
        .wmp-btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .wmp-btn-primary:hover {
          background: #a84e08; transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(200,89,10,0.40);
        }
        .wmp-btn-primary:hover::before { opacity: 1; }

        .wmp-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 24px; background: transparent;
          border: 1px solid rgba(240,235,228,0.15);
          color: rgba(240,235,228,0.65);
          font-family: 'DM Sans', sans-serif; font-size: 12.5px;
          font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          transition: border-color 0.22s, color 0.22s, background 0.22s, transform 0.22s;
        }
        .wmp-btn-outline:hover {
          border-color: rgba(240,235,228,0.42); color: #f0ebe4;
          background: rgba(240,235,228,0.05); transform: translateY(-2px);
        }

        /* ════════════ CTA FOOTER ════════════ */
        .wmp-cta { max-width: 1360px; margin: 0 auto; padding: 0 44px 108px; }
        @media(max-width:640px){ .wmp-cta { padding: 0 24px 80px; } }

        .wmp-cta-box {
          border-radius: 24px; overflow: hidden;
          background: #c8590a;
          padding: 72px 60px;
          display: grid; grid-template-columns: 1fr auto;
          gap: 36px; align-items: center; position: relative;
        }
        @media(max-width:720px){ .wmp-cta-box { grid-template-columns: 1fr; padding: 48px 34px; } }

        .wmp-cta-box::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 55% 75% at 18% 50%, rgba(255,255,255,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 40% 55% at 82% 20%, rgba(0,0,0,0.10) 0%, transparent 55%);
        }
        .wmp-cta-box__pattern {
          position: absolute; inset: 0; opacity: 0.035;
          background-image: repeating-linear-gradient(
            45deg, #000 0, #000 1px, transparent 0, transparent 50%
          );
          background-size: 12px 12px;
        }
        .wmp-cta-box__circle {
          position: absolute; top: -50px; right: -50px;
          width: 240px; height: 240px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12); pointer-events: none;
        }
        .wmp-cta-box__circle::after {
          content: ''; position: absolute; inset: 22px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.07);
        }

        .wmp-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4.2vw, 56px);
          font-weight: 700; color: #fff; line-height: 1.0;
          position: relative; z-index: 1; letter-spacing: -0.01em;
        }
        .wmp-cta-sub {
          font-size: 14.5px; color: rgba(255,255,255,0.78);
          margin-top: 10px; position: relative; z-index: 1;
          font-weight: 300; line-height: 1.72;
        }
        .wmp-cta-btns { display: flex; flex-wrap: wrap; gap: 12px; position: relative; z-index: 1; }

        .wmp-btn-dark {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: #070605; color: #f0ebe4;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
        }
        .wmp-btn-dark:hover { background: #1a1612; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.4); }

        .wmp-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: rgba(255,255,255,0.13); color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 8px; text-decoration: none;
          border: 1.5px solid rgba(255,255,255,0.30);
          transition: background 0.22s, transform 0.22s;
        }
        .wmp-btn-ghost:hover { background: rgba(255,255,255,0.23); transform: translateY(-2px); }

        @media(prefers-reduced-motion: reduce) {
          .wmp-shimmer, .wmp-scroll-cue__track::after { animation: none; }
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