import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Zap, DollarSign, Heart, ArrowRight } from "lucide-react";
import { SITE } from "@/data/site";
import bannerImg from "@/assets/banner-2.webp";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Wise Mart — A Maryland Tradition Since 2010" },
      { name: "description", content: "Wise Mart has served Maryland communities since 2010 with fresh food, fast service, and family-style hospitality across three locations." },
      { property: "og:title", content: "About Wise Mart — A Maryland Tradition Since 2010" },
      { property: "og:description", content: "Three locations. One promise: come hungry, leave happy." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Sparkles, title: "Fresh Daily",      desc: "Dough mixed every morning. Produce delivered fresh. Real ingredients, zero shortcuts." },
  { icon: Zap,      title: "Fast Service",     desc: "Hot meals to the counter in minutes — without ever rushing the kitchen." },
  { icon: DollarSign, title: "Honest Pricing", desc: "Generous portions at prices that respect your wallet. Family meals that don't break the bank." },
  { icon: Heart,    title: "Community First",  desc: "Local hires. Local sponsorships. We're a part of every town we serve." },
];

const TIMELINE = [
  { year: "2010", title: "The First Wise Mart Opens",       text: "Sharptown, MD. A small kitchen with one pizza oven and a chicken fryer — and a big idea." },
  { year: "2014", title: "Famous Fried Chicken Recipe",     text: "Our signature double-fry technique becomes a regional obsession." },
  { year: "2017", title: "East New Market Joins",           text: "We expand with hearty subs, burgers, and family-sized meals for a new community." },
  { year: "2020", title: "Vienna Opens its Doors",          text: "Fresh salads, breakfast plates, and lighter fare find a warm new home." },
  { year: "Today", title: "Three Locations. One Family.",   text: "Still mixing dough by hand. Still treating every guest like our very first." },
];

const STATS = [
  { num: "3",    label: "Locations"    },
  { num: "15+",  label: "Years Serving" },
  { num: "50+",  label: "Menu Items"   },
  { num: "★4.8", label: "Avg. Rating"  },
];

function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── PAGE BASE ── */
        .wm-about { font-family: 'DM Sans', sans-serif; background: #0a0908; color: #fff; }

        /* ── BANNER ── */
        .wm-about-banner {
          position: relative; min-height: 560px;
          display: flex; align-items: flex-end; overflow: hidden;
        }
        .wm-about-banner__bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transform: scale(1.06); transition: transform 14s ease;
          will-change: transform;
        }
        .wm-about-banner:hover .wm-about-banner__bg { transform: scale(1.0); }
        .wm-about-banner__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(10,9,8,0.18) 0%,
            rgba(10,9,8,0.52) 38%,
            rgba(10,9,8,0.97) 100%
          );
        }
        .wm-about-banner__overlay2 {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(10,9,8,0.8) 0%, transparent 65%);
        }
        .wm-about-banner__inner {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto;
          padding: 0 40px 64px; width: 100%;
        }
        @media(max-width:640px){ .wm-about-banner__inner { padding: 0 24px 48px; } }

        .wm-about-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #d97706; margin-bottom: 20px;
        }
        .wm-about-eyebrow::before, .wm-about-eyebrow::after {
          content: ''; display: inline-block;
          width: 32px; height: 1px; background: #d97706; opacity: 0.5;
        }
        .wm-about-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(48px, 7.5vw, 92px); font-weight: 700;
          line-height: 1.0; letter-spacing: -0.01em; color: #fff;
        }
        .wm-about-title-accent {
          background: linear-gradient(90deg, #d97706 0%, #fbbf24 45%, #d97706 70%, #b45309 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wma-shimmer 4s linear infinite;
        }
        @keyframes wma-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .wm-about-sub {
          font-size: 16px; color: rgba(255,255,255,0.5);
          margin-top: 16px; line-height: 1.75; max-width: 520px;
        }
        @media(max-width:640px){ .wm-about-sub { font-size: 14px; max-width: 100%; } }

        /* particles */
        .wma-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .wma-particle {
          position: absolute; border-radius: 50%;
          animation: wma-float linear infinite; opacity: 0;
        }
        @keyframes wma-float {
          0%   { transform: translateY(100%) scale(0); opacity: 0; }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-120%) scale(1.4); opacity: 0; }
        }

        /* ── STATS BAR ── */
        .wma-stats { background: #d97706; }
        .wma-stats-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 40px;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        @media(max-width:768px){ .wma-stats-inner { padding: 0 24px; } }
        @media(max-width:640px){ .wma-stats-inner { grid-template-columns: repeat(2,1fr); padding: 0 24px; } }
        .wma-stat {
          padding: 28px 20px; text-align: center;
          border-right: 1px solid rgba(0,0,0,0.12); position: relative; overflow: hidden;
        }
        @media(max-width:640px){
          .wma-stat { padding: 20px 12px; }
          .wma-stat:nth-child(2) { border-right: none; }
          .wma-stat:nth-child(3) { border-top: 1px solid rgba(0,0,0,0.12); }
          .wma-stat:nth-child(4) { border-top: 1px solid rgba(0,0,0,0.12); border-right: none; }
        }
        .wma-stat:last-child { border-right: none; }
        .wma-stat::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0); transition: background 0.3s;
        }
        .wma-stat:hover::after { background: rgba(255,255,255,0.07); }
        .wma-stat__num   { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 700; color: #fff; line-height: 1; }
        .wma-stat__label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.78); margin-top: 4px; letter-spacing: 0.1em; text-transform: uppercase; }
        @media(max-width:640px){
          .wma-stat__num { font-size: 32px; }
          .wma-stat__label { font-size: 9px; }
        }

        /* ── STORY SECTION ── */
        .wma-story { max-width: 1280px; margin: 0 auto; padding: 80px 40px; }
        @media(max-width:768px){ .wma-story { padding: 60px 32px; } }
        @media(max-width:640px){ .wma-story { padding: 56px 24px; } }
        .wma-story-inner {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        @media(max-width:900px){ .wma-story-inner { grid-template-columns: 1fr; gap: 40px; } }

        .wma-story-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #d97706; margin-bottom: 16px;
        }
        .wma-story-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(34px, 4vw, 52px); font-weight: 700;
          color: #fff; line-height: 1.05;
        }
        .wma-story-body {
          font-size: 14px; color: rgba(255,255,255,0.48);
          line-height: 1.85; margin-top: 20px;
        }
        .wma-story-body + .wma-story-body { margin-top: 14px; }
        .wma-story-divider { width: 36px; height: 2px; background: #d97706; border-radius: 2px; margin: 24px 0; }

        .wma-story-img {
          border-radius: 20px; overflow: hidden; aspect-ratio: 4/3;
          border: 1px solid rgba(255,255,255,0.08);
          position: relative; transition: box-shadow 0.4s;
        }
        @media(max-width:640px){ .wma-story-img { border-radius: 14px; } }
        .wma-story-img:hover { box-shadow: 0 32px 80px rgba(0,0,0,0.5); }
        .wma-story-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.8s ease; }
        .wma-story-img:hover img { transform: scale(1.04); }
        .wma-story-img-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 24px 20px;
          background: linear-gradient(to top, rgba(10,9,8,0.9) 0%, transparent 100%);
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px; font-weight: 600; color: #fff; line-height: 1.3;
        }
        @media(max-width:640px){ .wma-story-img-caption { font-size: 16px; padding: 16px 16px 14px; } }

        /* ── VALUES ── */
        .wma-values { background: #0f0e0d; padding: 80px 0; }
        @media(max-width:768px){ .wma-values { padding: 60px 0; } }
        @media(max-width:640px){ .wma-values { padding: 48px 0; } }
        .wma-values-inner { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
        @media(max-width:768px){ .wma-values-inner { padding: 0 32px; } }
        @media(max-width:640px){ .wma-values-inner { padding: 0 24px; } }
        .wma-section-header { text-align: center; margin-bottom: 48px; }
        @media(max-width:640px){ .wma-section-header { margin-bottom: 32px; } }
        .wma-section-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #d97706;
        }
        .wma-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(34px, 4vw, 52px); font-weight: 700;
          color: #fff; margin-top: 12px; line-height: 1.05;
        }
        .wma-section-sub { font-size: 14px; color: rgba(255,255,255,0.38); margin-top: 10px; }
        @media(max-width:640px){ .wma-section-sub { font-size: 13px; } }

        .wma-values-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden;
        }
        @media(max-width:900px){ .wma-values-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:480px){ .wma-values-grid { grid-template-columns: 1fr; } }

        .wma-value {
          padding: 40px 28px; background: #0f0e0d;
          transition: background 0.3s; position: relative; overflow: hidden;
        }
        @media(max-width:768px){ .wma-value { padding: 32px 22px; } }
        @media(max-width:640px){ .wma-value { padding: 28px 20px; } }
        .wma-value::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(217,119,6,0.09) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.4s;
        }
        .wma-value:hover { background: #161412; }
        .wma-value:hover::before { opacity: 1; }
        .wma-value-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(217,119,6,0.12); color: #d97706;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.3s, transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
        }
        .wma-value-icon svg { width: 22px; height: 22px; }
        .wma-value:hover .wma-value-icon {
          background: #d97706; color: #fff;
          transform: scale(1.15) rotate(-8deg);
          box-shadow: 0 8px 24px rgba(217,119,6,0.4);
        }
        .wma-value-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 700; color: #fff; margin-top: 22px;
        }
        @media(max-width:640px){ .wma-value-title { font-size: 20px; margin-top: 16px; } }
        .wma-value-desc { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 8px; line-height: 1.65; }

        /* ── TIMELINE ── */
        .wma-timeline { max-width: 1280px; margin: 0 auto; padding: 80px 40px; }
        @media(max-width:768px){ .wma-timeline { padding: 60px 32px; } }
        @media(max-width:640px){ .wma-timeline { padding: 60px 24px; } }

        .wma-tl-track { position: relative; margin-top: 56px; }
        @media(max-width:640px){ .wma-tl-track { margin-top: 40px; } }
        .wma-tl-line {
          position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, transparent 0%, #d97706 15%, #d97706 85%, transparent 100%);
          transform: translateX(-50%);
        }
        @media(max-width:700px){
          .wma-tl-line { left: 18px; }
        }

        .wma-tl-items { display: flex; flex-direction: column; gap: 0; }

        .wma-tl-item { position: relative; display: grid; grid-template-columns: 1fr 56px 1fr; align-items: start; }
        @media(max-width:700px){
          .wma-tl-item { grid-template-columns: 36px 1fr; gap: 0; }
        }

        .wma-tl-left  { padding: 0 40px 48px 0; text-align: right; }
        .wma-tl-right { padding: 0 0 48px 40px; }
        @media(max-width:768px){
          .wma-tl-left  { padding: 0 24px 40px 0; }
          .wma-tl-right { padding: 0 0 40px 24px; }
        }
        @media(max-width:700px){
          .wma-tl-left  { display: none; }
          .wma-tl-right { padding: 0 0 40px 20px; }
        }

        /* alternate: even items flip */
        .wma-tl-item:nth-child(even) .wma-tl-left  { order: 3; text-align: left;  padding: 0 0 48px 40px; }
        .wma-tl-item:nth-child(even) .wma-tl-center { order: 2; }
        .wma-tl-item:nth-child(even) .wma-tl-right { order: 1; text-align: right; padding: 0 40px 48px 0; }
        @media(max-width:768px){
          .wma-tl-item:nth-child(even) .wma-tl-left  { padding: 0 0 40px 24px; }
          .wma-tl-item:nth-child(even) .wma-tl-right { padding: 0 24px 40px 0; }
        }
        @media(max-width:700px){
          .wma-tl-item:nth-child(even) .wma-tl-left  { display: none; }
          .wma-tl-item:nth-child(even) .wma-tl-center { order: 1; }
          .wma-tl-item:nth-child(even) .wma-tl-right { order: 2; text-align: left; padding: 0 0 40px 20px; }
        }

        .wma-tl-center {
          display: flex; flex-direction: column; align-items: center; padding-top: 6px;
        }
        @media(max-width:700px){
          .wma-tl-center { align-items: flex-start; padding-left: 9px; }
        }
        .wma-tl-dot {
          width: 36px; height: 36px; border-radius: 50%;
          background: #d97706; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 6px rgba(217,119,6,0.15);
          flex-shrink: 0; position: relative; z-index: 1;
        }
        @media(max-width:700px){
          .wma-tl-dot { width: 28px; height: 28px; }
        }
        .wma-tl-dot-inner { width: 10px; height: 10px; border-radius: 50%; background: #fff; }
        @media(max-width:700px){ .wma-tl-dot-inner { width: 8px; height: 8px; } }

        .wma-tl-card {
          border-radius: 14px; border: 1px solid rgba(255,255,255,0.08);
          background: #161412; padding: 24px 26px;
          transition: border-color 0.3s, box-shadow 0.35s; position: relative; overflow: hidden;
        }
        @media(max-width:768px){ .wma-tl-card { padding: 20px 20px; border-radius: 12px; } }
        @media(max-width:640px){ .wma-tl-card { padding: 16px 16px; border-radius: 10px; } }
        .wma-tl-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(217,119,6,0.07) 0%, transparent 65%);
          opacity: 0; transition: opacity 0.4s;
        }
        .wma-tl-card:hover { border-color: rgba(217,119,6,0.35); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .wma-tl-card:hover::before { opacity: 1; }

        .wma-tl-year {
          font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: #d97706;
        }
        .wma-tl-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 700; color: #fff; margin-top: 6px; line-height: 1.15;
        }
        @media(max-width:768px){ .wma-tl-title { font-size: 19px; } }
        @media(max-width:640px){ .wma-tl-title { font-size: 17px; } }
        .wma-tl-text { font-size: 13px; color: rgba(255,255,255,0.42); margin-top: 8px; line-height: 1.65; }
        @media(max-width:640px){ .wma-tl-text { font-size: 12px; } }

        /* ── CTA BANNER ── */
        .wma-cta { padding: 0 40px 80px; max-width: 1280px; margin: 0 auto; }
        @media(max-width:768px){ .wma-cta { padding: 0 32px 64px; } }
        @media(max-width:640px){ .wma-cta { padding: 0 24px 60px; } }
        .wma-cta-box {
          border-radius: 20px; overflow: hidden; background: #d97706;
          padding: 60px 52px; display: grid; grid-template-columns: 1fr auto;
          gap: 32px; align-items: center; position: relative;
        }
        @media(max-width:900px){ .wma-cta-box { padding: 48px 40px; gap: 28px; } }
        @media(max-width:700px){ .wma-cta-box { grid-template-columns: 1fr; padding: 40px 32px; gap: 24px; } }
        @media(max-width:480px){ .wma-cta-box { padding: 32px 24px; border-radius: 16px; } }
        .wma-cta-box::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.4;
        }
        .wma-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 50px); font-weight: 700; color: #fff; line-height: 1.05; position: relative;
        }
        .wma-cta-sub { font-size: 15px; color: rgba(255,255,255,0.82); margin-top: 10px; position: relative; max-width: 420px; }
        @media(max-width:640px){ .wma-cta-sub { font-size: 14px; max-width: 100%; } }
        .wma-cta-btns { display: flex; flex-wrap: wrap; gap: 12px; position: relative; }
        @media(max-width:700px){ .wma-cta-btns { width: 100%; } }
        @media(max-width:480px){ .wma-cta-btns { flex-direction: column; gap: 10px; } }
        .wma-btn-dark {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: #0a0908; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          border-radius: 8px; text-decoration: none; transition: background 0.2s, transform 0.2s;
        }
        @media(max-width:480px){ .wma-btn-dark { justify-content: center; width: 100%; padding: 14px 20px; } }
        .wma-btn-dark:hover { background: #1a1612; transform: translateY(-2px); }
        .wma-btn-light {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; background: rgba(255,255,255,0.15); color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          border-radius: 8px; text-decoration: none; border: 1px solid rgba(255,255,255,0.3);
          transition: background 0.2s, transform 0.2s;
        }
        @media(max-width:480px){ .wma-btn-light { justify-content: center; width: 100%; padding: 14px 20px; } }
        .wma-btn-light:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); }

        /* ── BANNER HEIGHT MOBILE ── */
        @media(max-width:480px){
          .wm-about-banner { min-height: 420px; }
        }
      `}</style>

      <div className="wm-about">

        {/* ════════════ BANNER ════════════ */}
        <section className="wm-about-banner">
          <div
            className="wm-about-banner__bg"
            style={{ backgroundImage: `url(${bannerImg})` }}
          />
          <div className="wm-about-banner__overlay" />
          <div className="wm-about-banner__overlay2" />

          {/* Particles */}
          <div className="wma-particles">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="wma-particle"
                style={{
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                  background: i % 4 === 0 ? "#d97706" : "rgba(255,255,255,0.12)",
                  left: `${5 + (i * 6.1) % 90}%`,
                  top: `${10 + (i * 7.7) % 80}%`,
                  animationDuration: `${3 + (i % 4)}s`,
                  animationDelay: `${i * 0.45}s`,
                }}
              />
            ))}
          </div>

          <div className="wm-about-banner__inner">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="wm-about-eyebrow">
                <Sparkles size={11} />
                About Wise Mart
              </div>
            </motion.div>

            <motion.h1
              className="wm-about-title"
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              A Maryland Tradition<br />
              <span className="wm-about-title-accent">Since {SITE.established}.</span>
            </motion.h1>

            <motion.p
              className="wm-about-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              We started with one belief: people deserve food made with care, served fast,
              at a price that respects them. Fifteen years later, that belief still runs every kitchen.
            </motion.p>
          </div>
        </section>

        {/* ════════════ STATS BAR ════════════ */}
        <motion.div
          className="wma-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="wma-stats-inner">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="wma-stat"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="wma-stat__num">{s.num}</div>
                <div className="wma-stat__label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════════════ STORY ════════════ */}
        <div className="wma-story">
          <div className="wma-story-inner">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wma-story-eyebrow">Our Story</div>
              <h2 className="wma-story-title">
                More than a meal —<br />a Maryland tradition.
              </h2>
              <div className="wma-story-divider" />
              <p className="wma-story-body">
                What began in a single Sharptown kitchen in {SITE.established} has grown into three distinct
                restaurants — each rooted in its own Maryland town, each with its own personality,
                all sharing one Wise Mart standard.
              </p>
              <p className="wma-story-body">
                We make our pizza dough by hand every morning. We hand-bread every piece of chicken.
                We slice subs to order. None of this is fast or efficient — but it's the only way
                we know how to do right by the people who walk through our doors.
              </p>
              <p className="wma-story-body">
                Whether it's a family meal in Sharptown, a hearty work-day sub in East New Market,
                or a fresh breakfast in Vienna, you'll taste the same thing on every plate: care.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.93 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="wma-story-img">
                <img src={bannerImg} alt="Wise Mart kitchen spread" loading="lazy" />
                <div className="wma-story-img-caption">Made by hand. Served with pride.</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ════════════ VALUES ════════════ */}
        <section className="wma-values">
          <div className="wma-values-inner">
            <div className="wma-section-header">
              <div className="wma-section-eyebrow">Our Values</div>
              <h2 className="wma-section-title">What guides every plate.</h2>
              <p className="wma-section-sub">The principles we've carried since day one — and will carry forever.</p>
            </div>
            <div className="wma-values-grid">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  className="wma-value"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wma-value-icon"><v.icon /></div>
                  <div className="wma-value-title">{v.title}</div>
                  <div className="wma-value-desc">{v.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ TIMELINE ════════════ */}
        <section className="wma-timeline">
          <div className="wma-section-header">
            <div className="wma-section-eyebrow">Our Journey</div>
            <h2 className="wma-section-title">15 years in the making.</h2>
            <p className="wma-section-sub">Every milestone, one plate at a time.</p>
          </div>

          <div className="wma-tl-track">
            <div className="wma-tl-line" />
            <div className="wma-tl-items">
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={t.year}
                  className="wma-tl-item"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Left slot (visible on desktop, alternates) */}
                  <div className="wma-tl-left">
                    {i % 2 === 0 ? (
                      <div className="wma-tl-card" style={{ textAlign: "left" }}>
                        <div className="wma-tl-year">{t.year}</div>
                        <div className="wma-tl-title">{t.title}</div>
                        <div className="wma-tl-text">{t.text}</div>
                      </div>
                    ) : null}
                  </div>

                  {/* Center dot */}
                  <div className="wma-tl-center">
                    <div className="wma-tl-dot">
                      <div className="wma-tl-dot-inner" />
                    </div>
                  </div>

                  {/* Right slot */}
                  <div className="wma-tl-right">
                    {i % 2 !== 0 ? (
                      <div className="wma-tl-card">
                        <div className="wma-tl-year">{t.year}</div>
                        <div className="wma-tl-title">{t.title}</div>
                        <div className="wma-tl-text">{t.text}</div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ CTA BANNER ════════════ */}
        <div className="wma-cta">
          <motion.div
            className="wma-cta-box"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <div>
              <h3 className="wma-cta-title">Ready to taste the tradition?</h3>
              <p className="wma-cta-sub">
                Pick your location, explore the menu, and we'll have something fresh waiting for you.
              </p>
            </div>
            <div className="wma-cta-btns">
              <Link to="/order"     className="wma-btn-dark">
                Order Now <ArrowRight size={15} />
              </Link>
              <Link to="/locations" className="wma-btn-light">
                Find a Location
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}