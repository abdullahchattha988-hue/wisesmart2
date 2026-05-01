import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { Phone, MapPin, Clock, ArrowRight, ExternalLink, Star, Award } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef, useState, useEffect, useCallback } from "react";
import { LOCATIONS, type LocationSlug } from "@/data/site";
import { MENU_SECTIONS, LOCATION_INTROS, type MenuSection, type PriceRow } from "@/data/menu";
import bannerImg from "@/assets/banner-3.webp";

/* ─── fine pointer hook (matches index) ─── */
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

/* ─── tilt hook (matches index) ─── */
function useTilt(enabled: boolean, strength = 6) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [strength, -strength]), { stiffness: 320, damping: 32 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-strength, strength]), { stiffness: 320, damping: 32 });
  const scale   = useSpring(1, { stiffness: 320, damping: 28 });
  const onMove  = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
    scale.set(1.015);
  }, [enabled, x, y, scale]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); scale.set(1); }, [x, y, scale]);
  return {
    rotateX: enabled ? rotateX : 0,
    rotateY: enabled ? rotateY : 0,
    scale:   enabled ? scale   : 1,
    onMove, onLeave,
  };
}

const COL_LABELS: Record<string, string> = {
  name:  "Item",
  small: 'Small (12")',
  large: 'Large (16")',
  half:  "Half",
  whole: "Whole",
  price: "Price",
  desc:  "Description",
};

/* ─── Row ─── */
function Row({ row, columns, index }: { row: PriceRow; columns: MenuSection["columns"]; index: number }) {
  const r = row as Record<string, string>;
  return (
    <motion.tr
      className="wmp-row"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.34, delay: index * 0.022, ease: [0.22, 1, 0.36, 1] }}
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
function SectionCard({
  section,
  index,
  tiltEnabled,
}: {
  section: MenuSection;
  index: number;
  tiltEnabled: boolean;
}) {
  const { rotateX, rotateY, scale, onMove, onLeave } = useTilt(tiltEnabled, 3);
  return (
    <motion.section
      id={section.id}
      className="wmp-section-block scroll-mt-28"
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.62, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
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
        data-cursor="interactive"
        style={{ rotateX, rotateY, scale, transformPerspective: 1400, transformStyle: "preserve-3d" }}
        onMouseMove={tiltEnabled ? onMove : undefined}
        onMouseLeave={tiltEnabled ? onLeave : undefined}
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
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            width:      i % 3 === 0 ? 3 : 1.8,
            height:     i % 3 === 0 ? 3 : 1.8,
            background: i % 4 === 0 ? "#eb7126" : "rgba(250,244,237,0.09)",
            left: `${5 + (i * 5.9) % 90}%`,
            top:  `${10 + (i * 7.3) % 80}%`,
            boxShadow: i % 4 === 0 ? "0 0 6px rgba(235,113,38,0.6)" : "none",
          }}
          animate={{ y: [0, -28, 0], opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
          transition={{ duration: 3.2 + (i % 4) * 0.6, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
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

  const finePointer        = useFinePointer();
  const interactiveMotion  = finePointer;

  const bgY       = useTransform(scrollYProgress, [0, 1], interactiveMotion ? ["0%", "18%"]  : ["0%", "0%"]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], interactiveMotion ? [1, 1.08]      : [1, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.05]);
  const textY     = useTransform(scrollYProgress, [0, 1], interactiveMotion ? ["0%", "12%"]  : ["0%", "0%"]);

  /* cursor */
  const pointerX = useMotionValue(-160);
  const pointerY = useMotionValue(-160);
  const cursorX  = useSpring(pointerX, { stiffness: 500, damping: 40, mass: 0.25 });
  const cursorY  = useSpring(pointerY, { stiffness: 500, damping: 40, mass: 0.25 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorHover,   setCursorHover]   = useState(false);

  useEffect(() => {
    if (!interactiveMotion) { setCursorVisible(false); setCursorHover(false); return; }
    const onPointerMove = (e: PointerEvent) => { pointerX.set(e.clientX); pointerY.set(e.clientY); setCursorVisible(true); };
    const onPointerOver = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      setCursorHover(Boolean(t.closest("a, button, [data-cursor='interactive']")));
    };
    const onPointerOut  = (e: PointerEvent) => {
      const next = e.relatedTarget;
      if (next instanceof Element && next.closest("a, button, [data-cursor='interactive']")) return;
      setCursorHover(false);
    };
    const hide = () => setCursorVisible(false);
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerover",  onPointerOver);
    document.addEventListener("pointerout",   onPointerOut);
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover",  onPointerOver);
      document.removeEventListener("pointerout",   onPointerOut);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [interactiveMotion, pointerX, pointerY]);

  const [activeId, setActiveId] = useState(MENU_SECTIONS[0]?.id ?? "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-28% 0px -60% 0px" },
    );
    MENU_SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

        :root {
          --wm-ink: #120d09;
          --wm-ink-soft: #1a130f;
          --wm-ink-raised: #221913;
          --wm-ink-panel: rgba(24,17,12,0.76);
          --wm-paper: #f7efe3;
          --wm-paper-soft: #fbf6ef;
          --wm-text: rgba(250,244,237,0.96);
          --wm-text-soft: rgba(250,244,237,0.72);
          --wm-text-faint: rgba(250,244,237,0.48);
          --wm-amber: #eb7126;
          --wm-amber-deep: #c95a12;
          --wm-amber-soft: rgba(235,113,38,0.14);
          --wm-amber-border: rgba(235,113,38,0.3);
          --wm-gold: #f2bc59;
          --wm-border: rgba(250,244,237,0.12);
          --wm-border-soft: rgba(250,244,237,0.08);
          --wm-shadow-lg: 0 26px 70px rgba(0,0,0,0.36);
          --wm-shadow-xl: 0 40px 110px rgba(0,0,0,0.48);
          --wm-shadow-amber: 0 20px 48px rgba(201,90,18,0.28);
          --wm-radius-sm: 14px;
          --wm-radius-md: 20px;
          --wm-radius-lg: 28px;
          --wm-radius-xl: 38px;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        img  { display: block; max-width: 100%; }

        .wmp-page {
          position: relative;
          overflow-x: clip;
          font-family: "Manrope", sans-serif;
          background:
            radial-gradient(circle at 10% 0%,  rgba(235,113,38,0.10), transparent 28%),
            radial-gradient(circle at 92% 18%, rgba(242,188,89,0.07), transparent 22%),
            linear-gradient(180deg, #120d09 0%, #15100c 46%, #120d09 100%);
          color: var(--wm-text);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ── cursor ── */
        .wmp-cursor-outer, .wmp-cursor-inner {
          position: fixed; top: 0; left: 0;
          pointer-events: none; z-index: 50;
        }
        .wmp-cursor-outer {
          width: 44px; height: 44px;
          margin-top: -22px; margin-left: -22px;
          border-radius: 999px;
          border: 1px solid rgba(255,207,128,0.6);
          background: rgba(235,113,38,0.08);
          transition: width .24s ease, height .24s ease, margin .24s ease,
                      border-color .24s ease, background .24s ease;
        }
        .wmp-cursor-outer.is-hover {
          width: 68px; height: 68px;
          margin-top: -34px; margin-left: -34px;
          border-color: rgba(255,207,128,0.8);
          background: rgba(235,113,38,0.16);
        }
        .wmp-cursor-inner {
          width: 8px; height: 8px;
          margin-top: -4px; margin-left: -4px;
          border-radius: 999px;
          background: #ffcf80;
          box-shadow: 0 0 24px rgba(255,207,128,0.55);
        }

        /* ════════════ HERO ════════════ */
        .wmp-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          background: var(--wm-ink);
        }
        .wmp-hero__bg {
          position: absolute; inset: -8%;
          background-size: cover; background-position: center 30%;
          will-change: transform;
        }
        .wmp-hero__overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(110deg,
              rgba(9,6,4,0.94)  0%,
              rgba(9,6,4,0.82)  42%,
              rgba(9,6,4,0.38)  74%,
              rgba(9,6,4,0.12) 100%
            ),
            linear-gradient(180deg, rgba(9,6,4,0.35) 0%, rgba(9,6,4,0.94) 100%);
        }
        .wmp-hero__noise {
          position: absolute; inset: 0;
          pointer-events: none; opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 170px 170px;
        }
        .wmp-hero__beam {
          position: absolute; inset: auto -10% 8% auto;
          width: 45vw; height: 45vw; border-radius: 999px;
          background: radial-gradient(circle, rgba(242,188,89,0.12) 0%, rgba(235,113,38,0.08) 25%, transparent 70%);
          filter: blur(16px); pointer-events: none;
        }
        .wmp-hero__orb {
          position: absolute; inset: 12% auto auto 8%;
          width: 260px; height: 260px; border-radius: 999px;
          background: radial-gradient(circle, rgba(235,113,38,0.18) 0%, transparent 68%);
          filter: blur(28px); pointer-events: none;
        }

        .wmp-hero__inner {
          position: relative; z-index: 2;
          width: min(1320px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 140px 0 100px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: flex-end;
        }
        @media(max-width:960px){
          .wmp-hero__inner {
            grid-template-columns: 1fr;
            padding: 130px 0 88px;
          }
        }

        /* eyebrow */
        .wmp-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.24em;
          text-transform: uppercase; color: #ffcf80;
          text-decoration: none;
          transition: opacity 0.22s;
        }
        .wmp-eyebrow:hover { opacity: 0.72; }
        .wmp-eyebrow__line {
          display: inline-block; width: 30px; height: 1px;
          background: linear-gradient(90deg, rgba(255,207,128,0.95), transparent);
          flex-shrink: 0;
        }

        .wmp-hero__title {
          font-family: "Fraunces", Georgia, serif;
          font-size: clamp(54px, 7.8vw, 100px);
          font-weight: 600; line-height: 0.96;
          letter-spacing: -0.03em; color: var(--wm-text);
          margin-top: 24px;
        }
        .wmp-shimmer {
          background: linear-gradient(90deg,
            #ffe3b1 0%, #f4a756 22%, #eb7126 55%, #ffcf80 100%
          );
          background-size: 220% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wmpShimmer 7s linear infinite;
        }
        @keyframes wmpShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .wmp-hero__sub {
          font-size: 15px; color: var(--wm-text-soft);
          line-height: 1.85; margin-top: 20px;
          max-width: 480px; font-weight: 400;
        }
        .wmp-hero__actions {
          display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px;
        }

        /* info card */
        .wmp-hero__card {
          background: rgba(18,13,9,0.76);
          border: 1px solid var(--wm-border);
          border-radius: var(--wm-radius-lg);
          padding: 32px;
          backdrop-filter: blur(22px) saturate(1.2);
          display: flex; flex-direction: column; gap: 18px;
          box-shadow: var(--wm-shadow-lg);
          transition: border-color 0.34s, box-shadow 0.34s;
        }
        @media(max-width:960px){ .wmp-hero__card { display: none; } }
        .wmp-hero__card:hover {
          border-color: var(--wm-amber-border);
          box-shadow: var(--wm-shadow-xl);
        }

        .wmp-loc-badge {
          display: inline-flex; align-items: center; gap: 10px;
        }
        .wmp-loc-num {
          font-size: 10px; font-weight: 800; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--wm-text-faint);
        }
        .wmp-specialty-tag {
          display: inline-block;
          background: var(--wm-amber-soft); color: #ffcf80;
          font-size: 9px; font-weight: 800; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 5px 13px;
          border-radius: 999px; border: 1px solid var(--wm-amber-border);
        }

        .wmp-card-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--wm-border-soft), transparent);
        }

        .wmp-hero__card-row {
          display: flex; align-items: flex-start; gap: 11px;
          font-size: 13px; color: var(--wm-text-soft); line-height: 1.6;
        }
        .wmp-hero__card-icon { color: #ffcf80; flex-shrink: 0; margin-top: 1px; }
        .wmp-hero__card-icon svg { width: 14px; height: 14px; }
        .wmp-hero__card-row a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .wmp-hero__card-row a:hover { color: white; }

        .wmp-jump-label {
          font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--wm-text-faint); margin-bottom: 10px;
        }
        .wmp-jump-pills { display: flex; flex-wrap: wrap; gap: 7px; }
        .wmp-jump-pill {
          font-size: 11px; font-weight: 700;
          padding: 6px 14px; border-radius: 999px;
          border: 1px solid var(--wm-border);
          color: var(--wm-text-soft); text-decoration: none;
          transition: border-color 0.22s, color 0.22s, background 0.22s;
        }
        .wmp-jump-pill:hover {
          border-color: var(--wm-amber-border);
          color: #ffcf80;
          background: var(--wm-amber-soft);
        }

        /* scroll cue */
        .wmp-scroll-cue {
          position: absolute; bottom: 28px; left: 50%;
          transform: translateX(-50%); z-index: 3;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--wm-text-faint);
        }
        .wmp-scroll-cue__track {
          width: 1px; height: 54px;
          background: rgba(255,255,255,0.12); position: relative; overflow: hidden;
        }
        .wmp-scroll-cue__track::after {
          content: '';
          position: absolute; top: -100%; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(180deg, transparent, #ffcf80, transparent);
          animation: wmpScrollDrop 2.15s ease-in-out infinite;
        }
        @keyframes wmpScrollDrop {
          0%   { top: -100%; opacity: 0; }
          20%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* ════════════ STICKY NAV ════════════ */
        .wmp-nav {
          position: sticky; top: 0; z-index: 40;
          background: rgba(18,13,9,0.90);
          backdrop-filter: blur(20px) saturate(1.5);
          border-bottom: 1px solid var(--wm-border-soft);
        }
        .wmp-nav__inner {
          width: min(1320px, calc(100vw - 32px));
          margin: 0 auto;
          display: flex; gap: 0; overflow-x: auto; scrollbar-width: none;
          align-items: stretch;
        }
        .wmp-nav__inner::-webkit-scrollbar { display: none; }

        .wmp-nav-pill {
          position: relative;
          white-space: nowrap; padding: 15px 18px;
          font-family: "Manrope", sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
          color: var(--wm-text-faint);
          border: none; background: transparent; cursor: pointer;
          flex-shrink: 0; text-decoration: none;
          display: inline-flex; align-items: center;
          transition: color 0.22s;
        }
        .wmp-nav-pill::after {
          content: '';
          position: absolute; bottom: 0; left: 18px; right: 18px;
          height: 2px; border-radius: 2px 2px 0 0;
          background: linear-gradient(90deg, #ffcf80, #eb7126);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
        }
        .wmp-nav-pill:hover { color: var(--wm-text-soft); }
        .wmp-nav-pill.active { color: #ffcf80; font-weight: 700; }
        .wmp-nav-pill.active::after { transform: scaleX(1); }

        /* ════════════ MENU SECTIONS ════════════ */
        .wmp-sections {
          width: min(1320px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 72px 0 96px;
          display: flex; flex-direction: column; gap: 64px;
        }
        @media(max-width:640px){ .wmp-sections { padding: 48px 0 72px; gap: 48px; } }

        .wmp-sec-hdr {
          display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
        }
        .wmp-sec-hdr__num {
          font-family: "Fraunces", Georgia, serif;
          font-size: 52px; font-weight: 300; font-style: italic;
          color: rgba(255,207,128,0.10); line-height: 1;
          flex-shrink: 0; letter-spacing: -0.03em;
        }
        .wmp-sec-hdr__text { flex-shrink: 0; }
        .wmp-sec-title {
          font-family: "Fraunces", Georgia, serif;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 600; color: var(--wm-text); line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .wmp-sec-intro {
          font-size: 13px; color: var(--wm-text-faint);
          margin-top: 5px; line-height: 1.65;
        }
        .wmp-sec-hdr__line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(255,207,128,0.2) 0%, transparent 100%);
          min-width: 20px;
        }

        /* table card */
        .wmp-table-card {
          border-radius: var(--wm-radius-lg); overflow: hidden;
          border: 1px solid var(--wm-border);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)),
            rgba(19,13,9,0.9);
          box-shadow: var(--wm-shadow-lg);
          transition: border-color 0.34s, box-shadow 0.38s;
        }
        .wmp-table-card:hover {
          border-color: var(--wm-amber-border);
          box-shadow: var(--wm-shadow-xl);
        }
        .wmp-table-wrap { overflow-x: auto; }
        .wmp-table { width: 100%; border-collapse: collapse; }

        .wmp-thead-row {
          background: rgba(235,113,38,0.07);
          border-bottom: 1px solid rgba(235,113,38,0.14);
        }
        .wmp-th {
          padding: 14px 22px;
          text-align: left;
          font-family: "Manrope", sans-serif;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--wm-text-faint);
        }

        .wmp-row {
          border-bottom: 1px solid var(--wm-border-soft);
          transition: background 0.18s;
        }
        .wmp-row:last-child { border-bottom: none; }
        .wmp-row:hover { background: rgba(255,255,255,0.025); }

        .wmp-cell { padding: 15px 22px; vertical-align: top; }

        .wmp-item-name {
          font-family: "Fraunces", Georgia, serif;
          font-size: 18px; font-weight: 600;
          color: rgba(250,244,237,0.92); line-height: 1.25;
          letter-spacing: -0.02em;
        }
        .wmp-item-desc {
          font-size: 12.5px; color: var(--wm-text-faint);
          line-height: 1.65;
        }
        .wmp-price {
          font-family: "Manrope", sans-serif;
          font-size: 13px; font-weight: 800;
          color: #ffcf80; white-space: nowrap;
          letter-spacing: 0.04em;
        }

        .wmp-footnote {
          border-top: 1px solid var(--wm-border-soft);
          background: rgba(235,113,38,0.04);
          padding: 13px 22px;
          font-size: 12px; color: var(--wm-text-faint);
          line-height: 1.65;
        }

        /* ════════════ BUTTONS ════════════ */
        .wmp-button {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 10px; min-height: 52px; padding: 0 24px;
          border-radius: 999px;
          font-family: "Manrope", sans-serif;
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.16em; text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.24s ease, box-shadow 0.24s ease,
                      background 0.24s ease, border-color 0.24s ease;
        }
        .wmp-button svg { width: 14px; height: 14px; flex-shrink: 0; }
        .wmp-button--primary {
          color: white;
          background: linear-gradient(135deg, #f18b3e 0%, #eb7126 48%, #c95a12 100%);
          box-shadow: var(--wm-shadow-amber);
        }
        .wmp-button--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 58px rgba(201,90,18,0.4);
        }
        .wmp-button--ghost {
          color: var(--wm-text);
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
        }
        .wmp-button--ghost:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.26);
          background: rgba(255,255,255,0.08);
        }
        .wmp-button--dark {
          color: var(--wm-paper);
          background: rgba(13,9,6,0.82);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .wmp-button--dark:hover {
          transform: translateY(-2px);
          background: rgba(18,13,9,0.96);
        }
        .wmp-button--small {
          min-height: 44px; padding: 0 18px;
          font-size: 11px; letter-spacing: 0.14em;
        }

        /* ════════════ CTA FOOTER ════════════ */
        .wmp-cta {
          width: min(1320px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 0 0 112px;
        }
        @media(max-width:640px){ .wmp-cta { padding: 0 0 80px; } }

        .wmp-cta-panel {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0,1fr) auto;
          gap: 28px; align-items: center;
          padding: 60px;
          border-radius: var(--wm-radius-xl);
          border: 1px solid rgba(255,255,255,0.12);
          background-size: cover; background-position: center;
          box-shadow: var(--wm-shadow-xl);
        }
        @media(max-width:720px){
          .wmp-cta-panel {
            grid-template-columns: 1fr;
            padding: 40px 30px;
            border-radius: var(--wm-radius-lg);
          }
        }
        .wmp-cta-panel::before {
          content: '';
          position: absolute; inset: 0;
          background:
            linear-gradient(110deg,
              rgba(16,11,8,0.92) 0%,
              rgba(16,11,8,0.74) 48%,
              rgba(16,11,8,0.54) 100%
            ),
            radial-gradient(circle at 18% 40%, rgba(235,113,38,0.22), transparent 40%);
        }
        .wmp-cta-panel > * { position: relative; z-index: 1; }

        .wmp-cta-eyebrow {
          font-size: 11px; font-weight: 800; letter-spacing: 0.18em;
          text-transform: uppercase; color: #ffcf80;
        }
        .wmp-cta-title {
          font-family: "Fraunces", Georgia, serif;
          font-size: clamp(34px, 4vw, 56px);
          font-weight: 600; color: white; line-height: 1.0;
          letter-spacing: -0.03em; margin-top: 12px;
        }
        .wmp-cta-sub {
          font-size: 14.5px; color: rgba(250,244,237,0.78);
          margin-top: 10px; font-weight: 400; line-height: 1.75;
        }
        .wmp-cta-btns {
          display: flex; flex-wrap: wrap; gap: 12px;
        }
        @media(max-width:720px){ .wmp-cta-btns { flex-direction: column; } }

        @media(prefers-reduced-motion: reduce) {
          .wmp-shimmer, .wmp-scroll-cue__track::after { animation: none; }
          html { scroll-behavior: auto; }
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        @media(hover: none) {
          .wmp-button:hover { transform: none; }
          .wmp-table-card:hover { border-color: var(--wm-border); box-shadow: var(--wm-shadow-lg); }
        }
      `}</style>

      {/* Cursor */}
      {interactiveMotion && (
        <>
          <motion.div
            className={`wmp-cursor-outer${cursorHover ? " is-hover" : ""}`}
            style={{ x: cursorX, y: cursorY }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.16 }}
          />
          <motion.div
            className="wmp-cursor-inner"
            style={{ x: cursorX, y: cursorY }}
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.12 }}
          />
        </>
      )}

      <div className="wmp-page">

        {/* ════════ HERO ════════ */}
        <section className="wmp-hero" ref={heroRef}>
          <motion.div
            className="wmp-hero__bg"
            style={{ backgroundImage: `url(${bannerImg})`, y: bgY, scale: bgScale, opacity: bgOpacity }}
          />
          <div className="wmp-hero__overlay" />
          <div className="wmp-hero__noise" />
          <div className="wmp-hero__beam" />
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
                  <span className="wmp-eyebrow__line" />
                  <MapPin style={{ width: 11, height: 11 }} />
                  {loc.name}, Maryland
                  <span className="wmp-eyebrow__line" />
                </Link>
              </motion.div>

              <motion.h1
                className="wmp-hero__title"
                initial={{ opacity: 0, y: 38, rotateX: 10 }}
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
                <a href={loc.phoneHref} className="wmp-button wmp-button--primary">
                  <Phone style={{ width: 14, height: 14 }} /> {loc.phone}
                </a>
                <Link to="/order" className="wmp-button wmp-button--ghost">
                  Order Online <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT — info card */}
            <motion.div
              initial={{ opacity: 0, y: 52, rotateX: 16, rotateY: -10, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
              transition={{ duration: 0.92, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
              whileHover={interactiveMotion ? { rotateY: 3, rotateX: -2, scale: 1.02, transition: { duration: 0.32 } } : {}}
              style={{ transformStyle: "preserve-3d", perspective: 900 }}
            >
              <div className="wmp-hero__card" data-cursor="interactive">
                <div className="wmp-loc-badge">
                  <span className="wmp-loc-num">Location 0{locIndex + 1}</span>
                  <span className="wmp-specialty-tag">{loc.specialty}</span>
                </div>

                <div className="wmp-card-divider" />

                <div className="wmp-hero__card-row">
                  <span className="wmp-hero__card-icon"><MapPin style={{ width: 14, height: 14 }} /></span>
                  <span>{loc.address}</span>
                </div>
                <div className="wmp-hero__card-row">
                  <span className="wmp-hero__card-icon"><Clock style={{ width: 14, height: 14 }} /></span>
                  <span>{loc.hours}</span>
                </div>
                <div className="wmp-hero__card-row">
                  <span className="wmp-hero__card-icon"><Phone style={{ width: 14, height: 14 }} /></span>
                  <a href={loc.phoneHref}>{loc.phone}</a>
                </div>

                <div className="wmp-card-divider" />

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

          <div className="wmp-scroll-cue" aria-hidden="true">
            <div className="wmp-scroll-cue__track" />
            <span>Scroll</span>
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
            <SectionCard
              key={section.id}
              section={section}
              index={i}
              tiltEnabled={interactiveMotion}
            />
          ))}
        </div>

        {/* ════════ CTA FOOTER ════════ */}
        <div className="wmp-cta">
          <motion.div
            className="wmp-cta-panel"
            style={{ backgroundImage: `url(${bannerImg})` }}
            initial={{ opacity: 0, y: 44, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={interactiveMotion ? { scale: 1.008, transition: { duration: 0.36 } } : {}}
          >
            <div>
              <div className="wmp-cta-eyebrow">Ready When You Are</div>
              <h3 className="wmp-cta-title">Hungry yet?</h3>
              <p className="wmp-cta-sub">
                Call {loc.name} directly or place your order online — we'll have it ready when you arrive.
              </p>
            </div>
            <div className="wmp-cta-btns">
              <a href={loc.phoneHref} className="wmp-button wmp-button--dark">
                <Phone style={{ width: 14, height: 14 }} /> {loc.phone}
              </a>
              <Link to="/order" className="wmp-button wmp-button--primary">
                Order Online <ExternalLink style={{ width: 13, height: 13 }} />
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}