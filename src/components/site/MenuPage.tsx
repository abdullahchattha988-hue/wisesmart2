import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { Phone, MapPin, Clock, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { LOCATIONS, type LocationSlug } from "@/data/site";
import { MENU_SECTIONS, LOCATION_INTROS, type MenuSection, type PriceRow } from "@/data/menu";
import bannerImg from "@/assets/banner-3.webp";

/* ─── tilt hook ─── */
function useTilt(strength = 8) {
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]),  { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 300, damping: 30 });
  const scale   = useSpring(1, { stiffness: 300, damping: 25 });
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
    scale.set(1.02);
  }
  function onLeave() { x.set(0); y.set(0); scale.set(1); }
  return { rotateX, rotateY, scale, onMove, onLeave };
}

const colLabel: Record<string, string> = {
  name: "Item", small: 'Small (12")', large: 'Large (16")',
  half: "Half", whole: "Whole", price: "Price", desc: "Description",
};

function Row({ row, columns, index }: { row: PriceRow; columns: MenuSection["columns"]; index: number }) {
  const r = row as Record<string, string>;
  return (
    <motion.tr
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.38, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="wmp-row"
    >
      {columns.map((c) => {
        if (c === "name") return <td key={c} className="wmp-cell"><span className="wmp-item-name">{r.name}</span></td>;
        if (c === "desc") return <td key={c} className="wmp-cell"><span className="wmp-item-desc">{r.desc ?? ""}</span></td>;
        return <td key={c} className="wmp-cell"><span className="wmp-price">{r[c]}</span></td>;
      })}
    </motion.tr>
  );
}

function SectionCard({ section, index }: { section: MenuSection; index: number }) {
  const { rotateX, rotateY, scale, onMove, onLeave } = useTilt(4);
  return (
    <motion.section
      id={section.id}
      className="wmp-section scroll-mt-36"
      initial={{ opacity: 0, y: 48, rotateX: 6, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="wmp-sec-hdr">
        <div className="wmp-sec-hdr__left">
          <span className="wmp-sec-hdr__num">0{index + 1}</span>
          <div>
            <h2 className="wmp-sec-title">{section.title}</h2>
            {section.intro && <p className="wmp-sec-intro">{section.intro}</p>}
          </div>
        </div>
        <div className="wmp-sec-hdr__line" />
      </div>
      <motion.div
        className="wmp-table-card"
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", perspective: 1200 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="wmp-table-wrap">
          <table className="wmp-table">
            <thead>
              <tr className="wmp-thead-row">
                {section.columns.map((c) => <th key={c} className="wmp-th">{colLabel[c]}</th>)}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((r, i) => <Row key={i} row={r} columns={section.columns} index={i} />)}
            </tbody>
          </table>
        </div>
        {section.footnote && <div className="wmp-footnote">{section.footnote}</div>}
      </motion.div>
    </motion.section>
  );
}

function HeroParticles() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
            borderRadius: "50%",
            background: i % 4 === 0 ? "#d97706" : "rgba(255,255,255,0.12)",
            left: `${5 + (i * 5.9) % 90}%`,
            top: `${10 + (i * 7.3) % 80}%`,
          }}
          animate={{ y: [0, -26, 0], opacity: [0, 0.75, 0], scale: [0, 1, 0] }}
          transition={{ duration: 3 + (i % 4), delay: i * 0.42, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function MenuPage({ slug }: { slug: LocationSlug }) {
  const loc      = LOCATIONS.find((l) => l.slug === slug)!;
  const intro    = LOCATION_INTROS[slug];
  const locIndex = LOCATIONS.findIndex((l) => l.slug === slug);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.88], [1, 0]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY     = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  const [activeId, setActiveId] = useState(MENU_SECTIONS[0]?.id ?? "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    MENU_SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');
        .wmp-page { font-family: 'DM Sans', sans-serif; background: #0a0908; color: #fff; }
        *, *::before, *::after { box-sizing: border-box; }

        /* ── HERO ── */
        .wmp-hero {
          position: relative; min-height: 100vh; background: #0a0908;
          overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end;
        }
        .wmp-hero__bg {
          position: absolute; inset: -10%;
          background-size: cover; background-position: center 30%;
          will-change: transform;
        }
        .wmp-hero__ov1 {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,9,8,0.28) 0%, rgba(10,9,8,0.60) 38%, rgba(10,9,8,0.96) 78%, rgba(10,9,8,1) 100%);
        }
        .wmp-hero__ov2 {
          position: absolute; inset: 0;
          background: linear-gradient(95deg, rgba(10,9,8,0.94) 0%, rgba(10,9,8,0.58) 46%, transparent 70%);
        }
        .wmp-hero__inner {
          position: relative; z-index: 2; max-width: 1280px; margin: 0 auto;
          padding: 0 40px 80px; width: 100%;
          display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: flex-end;
        }
        @media(max-width:900px){ .wmp-hero__inner { grid-template-columns: 1fr; padding: 0 24px 64px; } }

        .wmp-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #d97706; text-decoration: none; transition: opacity .2s;
        }
        .wmp-eyebrow:hover { opacity: 0.72; }
        .wmp-eyebrow::before, .wmp-eyebrow::after {
          content: ''; display: inline-block; width: 24px; height: 1px; background: #d97706; opacity: 0.5;
        }
        .wmp-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 7.5vw, 96px); font-weight: 700;
          line-height: 1.0; letter-spacing: -0.01em; color: #fff; margin-top: 20px;
        }
        .wmp-shimmer {
          background: linear-gradient(90deg, #d97706 0%, #fbbf24 40%, #d97706 60%, #b45309 100%);
          background-size: 200% auto; -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; animation: wmp-shimmer 4s linear infinite;
        }
        @keyframes wmp-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

        .wmp-hero__sub { font-size: 15px; color: rgba(255,255,255,0.46); line-height: 1.8; margin-top: 20px; max-width: 460px; }
        .wmp-hero__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px; }

        .wmp-btn-primary {
          display: inline-flex; align-items: center; gap: 7px; padding: 13px 24px;
          background: #d97706; color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; border-radius: 8px; text-decoration: none;
          transition: background .2s, transform .2s, box-shadow .2s;
        }
        .wmp-btn-primary:hover { background: #b45309; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(217,119,6,.35); }

        .wmp-btn-outline {
          display: inline-flex; align-items: center; gap: 7px; padding: 13px 22px;
          background: transparent; border: 1px solid rgba(255,255,255,0.16); color: rgba(255,255,255,0.72);
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          border-radius: 8px; text-decoration: none;
          transition: border-color .2s, color .2s, background .2s, transform .2s;
        }
        .wmp-btn-outline:hover { border-color: rgba(255,255,255,.5); color: #fff; background: rgba(255,255,255,.05); transform: translateY(-2px); }

        /* hero card */
        .wmp-hero__card {
          background: rgba(10,9,8,0.55); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px; padding: 30px; backdrop-filter: blur(18px);
          display: flex; flex-direction: column; gap: 16px;
          transition: border-color .3s, box-shadow .3s;
        }
        @media(max-width:900px){ .wmp-hero__card { display: none; } }
        .wmp-hero__card:hover { border-color: rgba(217,119,6,.32); box-shadow: 0 24px 64px rgba(0,0,0,.5); }
        .wmp-hero__card-row { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; color: rgba(255,255,255,0.62); line-height: 1.55; }
        .wmp-hero__card-icon { color: #d97706; flex-shrink: 0; margin-top: 1px; }
        .wmp-hero__badge {
          display: inline-block; background: rgba(217,119,6,0.15); color: #d97706;
          font-size: 10px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; padding: 5px 14px; border-radius: 50px;
          border: 1px solid rgba(217,119,6,.28);
        }
        .wmp-loc-num {
          font-size: 10px; font-weight: 700; letter-spacing: .2em;
          text-transform: uppercase; color: rgba(255,255,255,.22); margin-bottom: 6px;
        }

        .wmp-scroll-hint {
          position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); z-index: 3;
          display: flex; flex-direction: column; align-items: center;
          gap: 5px; font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
          color: rgba(255,255,255,.26); animation: wmp-bounce 2.4s ease-in-out infinite;
        }
        @keyframes wmp-bounce {
          0%,100%{ transform: translateX(-50%) translateY(0); opacity: .26; }
          50%    { transform: translateX(-50%) translateY(7px); opacity: .58; }
        }

        /* ── STICKY NAV ── */
        .wmp-nav {
          position: sticky; top: 0; z-index: 40;
          background: rgba(10,9,8,0.92); backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .wmp-nav__inner {
          max-width: 1280px; margin: 0 auto; padding: 0 40px;
          display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none;
        }
        .wmp-nav__inner::-webkit-scrollbar { display: none; }
        @media(max-width:640px){ .wmp-nav__inner { padding: 0 16px; } }
        .wmp-nav-pill {
          white-space: nowrap; padding: 14px 18px; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: .03em;
          color: rgba(255,255,255,.4); border: none; background: transparent;
          cursor: pointer; position: relative; transition: color .2s; flex-shrink: 0;
          text-decoration: none; display: inline-block;
        }
        .wmp-nav-pill::after {
          content: ''; position: absolute; bottom: 0; left: 18px; right: 18px;
          height: 2px; background: #d97706; border-radius: 2px 2px 0 0;
          transform: scaleX(0); transition: transform .25s;
        }
        .wmp-nav-pill:hover { color: rgba(255,255,255,.78); }
        .wmp-nav-pill.active { color: #d97706; }
        .wmp-nav-pill.active::after { transform: scaleX(1); }

        /* ── SECTIONS ── */
        .wmp-sections { max-width: 1280px; margin: 0 auto; padding: 60px 40px 80px; display: flex; flex-direction: column; gap: 56px; }
        @media(max-width:640px){ .wmp-sections { padding: 40px 24px 60px; gap: 40px; } }

        .wmp-sec-hdr { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .wmp-sec-hdr__left { display: flex; align-items: flex-start; gap: 14px; }
        .wmp-sec-hdr__num { font-family: 'Cormorant Garamond', serif; font-size: 44px; font-weight: 700; color: rgba(217,119,6,.16); line-height: 1; flex-shrink: 0; margin-top: -4px; }
        .wmp-sec-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(22px,3vw,32px); font-weight: 700; color: #fff; line-height: 1.1; }
        .wmp-sec-intro { font-size: 13px; color: rgba(255,255,255,.36); margin-top: 5px; line-height: 1.6; }
        .wmp-sec-hdr__line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(217,119,6,.3) 0%, transparent 100%); }

        .wmp-table-card {
          border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08); background: #0f0e0d;
          transition: border-color .35s, box-shadow .35s;
        }
        .wmp-table-card:hover { border-color: rgba(217,119,6,.28); box-shadow: 0 24px 60px rgba(0,0,0,.5); }
        .wmp-table-wrap { overflow-x: auto; }
        .wmp-table { width: 100%; border-collapse: collapse; }
        .wmp-thead-row { background: rgba(217,119,6,.07); border-bottom: 1px solid rgba(217,119,6,.14); }
        .wmp-th { padding: 14px 20px; text-align: left; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: rgba(255,255,255,.33); }
        .wmp-row { border-bottom: 1px solid rgba(255,255,255,.05); transition: background .2s; }
        .wmp-row:last-child { border-bottom: none; }
        .wmp-row:hover { background: rgba(255,255,255,.03); }
        .wmp-cell { padding: 14px 20px; vertical-align: top; }
        .wmp-item-name { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 700; color: rgba(255,255,255,.88); }
        .wmp-item-desc { font-size: 12px; color: rgba(255,255,255,.36); line-height: 1.55; }
        .wmp-price { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #d97706; white-space: nowrap; }
        .wmp-footnote { border-top: 1px solid rgba(255,255,255,.07); background: rgba(217,119,6,.04); padding: 12px 20px; font-size: 12px; color: rgba(255,255,255,.28); line-height: 1.6; }

        /* ── CTA ── */
        .wmp-cta { max-width: 1280px; margin: 0 auto; padding: 0 40px 100px; }
        @media(max-width:640px){ .wmp-cta { padding: 0 24px 72px; } }
        .wmp-cta-box {
          border-radius: 20px; overflow: hidden; background: #d97706;
          padding: 64px 52px; display: grid; grid-template-columns: 1fr auto;
          gap: 32px; align-items: center; position: relative;
        }
        @media(max-width:700px){ .wmp-cta-box { grid-template-columns: 1fr; padding: 44px 32px; } }
        .wmp-cta-box::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); opacity: .4;
        }
        .wmp-cta-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(34px,4vw,52px); font-weight: 700; color: #fff; line-height: 1.05; position: relative; }
        .wmp-cta-sub { font-size: 15px; color: rgba(255,255,255,.82); margin-top: 10px; position: relative; }
        .wmp-cta-btns { display: flex; flex-wrap: wrap; gap: 12px; position: relative; }
        .wmp-btn-dark { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: #0a0908; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none; transition: background .2s, transform .2s; }
        .wmp-btn-dark:hover { background: #1a1612; transform: translateY(-2px); }
        .wmp-btn-light { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: rgba(255,255,255,0.15); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none; border: 1px solid rgba(255,255,255,0.3); transition: background .2s, transform .2s; }
        .wmp-btn-light:hover { background: rgba(255,255,255,.25); transform: translateY(-2px); }
      `}</style>

      <div className="wmp-page">

        {/* ════════ HERO WITH BANNER ════════ */}
        <section className="wmp-hero" ref={heroRef}>

          {/* Parallax banner-3.webp background */}
          <motion.div
            className="wmp-hero__bg"
            style={{
              backgroundImage: `url(${bannerImg})`,
              y: bgY,
              opacity: bgOpacity,
              scale: bgScale,
            }}
          />
          <div className="wmp-hero__ov1" />
          <div className="wmp-hero__ov2" />
          <HeroParticles />

          <div className="wmp-hero__inner">

            {/* ── LEFT ── */}
            <motion.div style={{ y: textY }}>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <Link to="/locations" className="wmp-eyebrow">
                  <MapPin style={{ width: 11, height: 11 }} />
                  {loc.name}, MD
                </Link>
              </motion.div>

              <motion.h1
                className="wmp-hero__title"
                initial={{ opacity: 0, y: 44, rotateX: 12 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d", perspective: 800 }}
              >
                {loc.name}<br />
                <span className="wmp-shimmer">Menu.</span>
              </motion.h1>

              <motion.p
                className="wmp-hero__sub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                {intro}
              </motion.p>

              <motion.div
                className="wmp-hero__actions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.52 }}
              >
                <a href={loc.phoneHref} className="wmp-btn-primary">
                  <Phone style={{ width: 14, height: 14 }} /> {loc.phone}
                </a>
                <Link to="/order" className="wmp-btn-outline">
                  Order Online <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
              </motion.div>
            </motion.div>

            {/* ── RIGHT: 3D info card ── */}
            <motion.div
              initial={{ opacity: 0, y: 64, rotateX: 20, rotateY: -12, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ rotateY: 4, rotateX: -3, scale: 1.03, transition: { duration: 0.3 } }}
              style={{ transformStyle: "preserve-3d", perspective: 900 }}
            >
              <div className="wmp-hero__card">
                <div>
                  <div className="wmp-loc-num">Location 0{locIndex + 1}</div>
                  <span className="wmp-hero__badge">{loc.specialty}</span>
                </div>
                <div className="wmp-hero__card-row">
                  <MapPin className="wmp-hero__card-icon" style={{ width: 15, height: 15 }} />
                  <span>{loc.address}</span>
                </div>
                <div className="wmp-hero__card-row">
                  <Clock className="wmp-hero__card-icon" style={{ width: 15, height: 15 }} />
                  <span>{loc.hours}</span>
                </div>
                <div className="wmp-hero__card-row">
                  <Phone className="wmp-hero__card-icon" style={{ width: 15, height: 15 }} />
                  <a href={loc.phoneHref} style={{ color: "inherit", textDecoration: "none" }}>{loc.phone}</a>
                </div>
                <div style={{ paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,.25)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>
                    Jump to section
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {MENU_SECTIONS.slice(0, 6).map((s) => (
                      <a
                        key={s.id} href={`#${s.id}`}
                        style={{ fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 50, border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.48)", textDecoration: "none", transition: "all .2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,119,6,.55)"; (e.currentTarget as HTMLElement).style.color = "#d97706"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.48)"; }}
                      >
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          <div className="wmp-scroll-hint">
            <span>scroll</span>
            <ChevronDown style={{ width: 14, height: 14 }} />
          </div>
        </section>

        {/* ════════ STICKY NAV ════════ */}
        <nav className="wmp-nav">
          <div className="wmp-nav__inner">
            {MENU_SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={`wmp-nav-pill${activeId === s.id ? " active" : ""}`}>
                {s.title}
              </a>
            ))}
          </div>
        </nav>

        {/* ════════ MENU SECTIONS ════════ */}
        <div className="wmp-sections">
          {MENU_SECTIONS.map((section, i) => (
            <SectionCard key={section.id} section={section} index={i} />
          ))}
        </div>

        {/* ════════ CTA FOOTER ════════ */}
        <div className="wmp-cta">
          <motion.div
            className="wmp-cta-box"
            initial={{ opacity: 0, y: 40, rotateX: 8, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <div>
              <h3 className="wmp-cta-title">Hungry yet?</h3>
              <p className="wmp-cta-sub">Call {loc.name} or place your order online — we'll have it ready.</p>
            </div>
            <div className="wmp-cta-btns">
              <a href={loc.phoneHref} className="wmp-btn-dark">
                <Phone style={{ width: 15, height: 15 }} /> Call {loc.phone}
              </a>
              <Link to="/order" className="wmp-btn-light">Order Online</Link>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}