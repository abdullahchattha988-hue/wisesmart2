import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Send, Check, Clock, Sparkles, ArrowRight } from "lucide-react";
import { z } from "zod";
import { LOCATIONS, SITE } from "@/data/site";
import bannerImg from "@/assets/banner-4.webp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Wise Mart — Get in Touch" },
      { name: "description", content: "Contact Wise Mart by phone, email, or message. Three Maryland locations ready to serve you." },
      { property: "og:title", content: "Contact Wise Mart" },
      { property: "og:description", content: "Phone, email, and locations for all three Wise Mart kitchens." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(1, "Please select a subject"),
  message: z.string().trim().min(1, "Message required").max(1000),
});

/* ── CONTACT PAGE ── */
function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [charCount, setCharCount] = useState(0);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── BANNER ── */
        .wm-contact-banner {
          position: relative; min-height: 520px;
          display: flex; align-items: flex-end; overflow: hidden;
        }
        .wm-contact-banner__bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center top;
          transform: scale(1.06); transition: transform 14s ease;
          will-change: transform;
        }
        .wm-contact-banner:hover .wm-contact-banner__bg { transform: scale(1.0); }
        .wm-contact-banner__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(10,9,8,0.25) 0%,
            rgba(10,9,8,0.55) 35%,
            rgba(10,9,8,0.96) 100%
          );
        }
        .wm-contact-banner__overlay2 {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(10,9,8,0.75) 0%, transparent 65%);
        }
        .wm-contact-banner__inner {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto;
          padding: 0 40px 64px; width: 100%;
        }
        .wm-contact-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #d97706; margin-bottom: 20px;
        }
        .wm-contact-eyebrow::before, .wm-contact-eyebrow::after {
          content: ''; display: inline-block;
          width: 32px; height: 1px; background: #d97706; opacity: 0.5;
        }
        .wm-contact-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(54px, 8vw, 96px); font-weight: 700;
          line-height: 1.0; letter-spacing: -0.01em; color: #fff;
        }
        .wm-contact-title-accent {
          background: linear-gradient(90deg, #d97706 0%, #fbbf24 45%, #d97706 70%, #b45309 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wm-shimmer 4s linear infinite;
        }
        @keyframes wm-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .wm-contact-sub {
          font-size: 16px; color: rgba(255,255,255,0.5);
          margin-top: 14px; line-height: 1.7; max-width: 460px;
        }

        /* particles */
        .wm-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .wm-particle {
          position: absolute; border-radius: 50%;
          animation: wm-float linear infinite; opacity: 0;
        }
        @keyframes wm-float {
          0%   { transform: translateY(100%) scale(0); opacity: 0; }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-120%) scale(1.5); opacity: 0; }
        }

        /* ── MAIN GRID ── */
        .wm-contact-main {
          max-width: 1280px; margin: 0 auto;
          padding: 60px 40px 80px;
          display: grid; grid-template-columns: 1fr 1.35fr; gap: 40px;
        }
        @media(max-width: 900px) {
          .wm-contact-main { grid-template-columns: 1fr; padding: 40px 24px 60px; }
        }

        /* ── INFO COLUMN ── */
        .wm-info { display: flex; flex-direction: column; gap: 20px; }

        .wm-reach-card, .wm-loc-card {
          border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);
          background: #161412; padding: 28px;
          transition: border-color 0.3s, box-shadow 0.35s;
          position: relative; overflow: hidden;
        }
        .wm-reach-card::before, .wm-loc-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(217,119,6,0.08) 0%, transparent 65%);
          opacity: 0; transition: opacity 0.4s;
        }
        .wm-reach-card:hover, .wm-loc-card:hover {
          border-color: rgba(217,119,6,0.4);
          box-shadow: 0 20px 60px rgba(0,0,0,0.45);
        }
        .wm-reach-card:hover::before, .wm-loc-card:hover::before { opacity: 1; }

        .wm-card-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #d97706; margin-bottom: 18px;
        }

        .wm-contact-list { list-style: none; display: flex; flex-direction: column; gap: 16px; }
        .wm-contact-list li { display: flex; align-items: center; gap: 14px; }

        .wm-ci {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(217,119,6,0.12);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: background 0.3s, transform 0.35s cubic-bezier(.34,1.56,.64,1);
        }
        .wm-reach-card:hover .wm-ci { background: #d97706; transform: scale(1.12) rotate(-6deg); }
        .wm-ci svg { width: 16px; height: 16px; color: #d97706; transition: color 0.3s; }
        .wm-reach-card:hover .wm-ci svg { color: #fff; }

        .wm-ct { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.88); text-decoration: none; transition: color 0.2s; }
        .wm-ct:hover { color: #d97706; }
        .wm-cs { font-size: 11px; color: rgba(255,255,255,0.28); margin-top: 2px; }

        /* hours */
        .wm-hours {
          border-radius: 12px; background: rgba(217,119,6,0.08);
          border: 1px solid rgba(217,119,6,0.2); padding: 18px 22px;
          display: flex; align-items: center; gap: 14px;
        }
        .wm-hours-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(217,119,6,0.15); display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        .wm-hours-icon svg { width: 17px; height: 17px; color: #d97706; }
        .wm-hours-title { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.88); letter-spacing: 0.04em; }
        .wm-hours-times { font-size: 11px; color: rgba(255,255,255,0.42); margin-top: 3px; line-height: 1.65; }

        /* loc cards */
        .wm-loc-card { padding: 22px 24px; }
        .wm-loc-hdr { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .wm-loc-num { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; color: rgba(255,255,255,0.22); }
        .wm-loc-badge {
          font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: #d97706; background: rgba(217,119,6,0.12); border-radius: 6px;
          padding: 4px 8px; white-space: nowrap; flex-shrink: 0;
        }
        .wm-loc-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 700; color: #fff; margin-top: 10px; line-height: 1;
        }
        .wm-loc-addr { font-size: 12px; color: rgba(255,255,255,0.42); margin-top: 6px; line-height: 1.55; }
        .wm-loc-phone {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; color: #d97706;
          text-decoration: none; margin-top: 14px; transition: gap 0.25s;
        }
        .wm-loc-phone:hover { gap: 10px; }
        .wm-loc-phone svg { width: 12px; height: 12px; }

        /* ── FORM ── */
        .wm-form-wrap {
          border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);
          background: #161412; padding: 44px 42px;
          position: relative; overflow: hidden;
        }
        @media(max-width: 560px) { .wm-form-wrap { padding: 28px 20px; } }
        .wm-form-wrap::before {
          content: ''; position: absolute; top: -80px; right: -80px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .wm-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px; font-weight: 700; color: #fff; line-height: 1.05;
        }
        .wm-form-sub { font-size: 13px; color: rgba(255,255,255,0.42); margin-top: 8px; line-height: 1.6; }
        .wm-form-divider { width: 40px; height: 2px; background: #d97706; border-radius: 2px; margin: 20px 0 28px; }

        .wm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media(max-width: 600px) { .wm-form-grid { grid-template-columns: 1fr; } }
        .wm-field { display: flex; flex-direction: column; gap: 7px; }
        .wm-field.full { grid-column: 1 / -1; }

        .wm-field label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(255,255,255,0.45);
        }
        .wm-field input, .wm-field textarea, .wm-field select {
          background: #1a1714; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          padding: 13px 16px; transition: border-color 0.25s, box-shadow 0.25s;
          outline: none; width: 100%; resize: none;
        }
        .wm-field input::placeholder, .wm-field textarea::placeholder { color: rgba(255,255,255,0.2); }
        .wm-field input:focus, .wm-field textarea:focus, .wm-field select:focus {
          border-color: #d97706; box-shadow: 0 0 0 3px rgba(217,119,6,0.15);
        }
        .wm-field select {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23d97706' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px;
        }
        .wm-field select option { background: #1a1714; color: #fff; }
        .wm-field textarea { min-height: 120px; }

        .wm-char-count { font-size: 10px; color: rgba(255,255,255,0.25); text-align: right; margin-top: 4px; }
        .wm-err { font-size: 11px; color: #ef4444; margin-top: 3px; }

        .wm-form-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 28px; flex-wrap: wrap; gap: 16px;
        }
        .wm-submit {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 14px 32px; background: #d97706; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          letter-spacing: 0.02em; border: none; border-radius: 8px; cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .wm-submit:hover {
          background: #b45309; transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(217,119,6,0.35);
        }
        .wm-submit:active { transform: translateY(0); }
        .wm-privacy {
          font-size: 11px; color: rgba(255,255,255,0.25);
          line-height: 1.55; max-width: 220px;
        }

        /* success */
        .wm-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; min-height: 460px;
          animation: wm-fadeIn 0.5s ease;
        }
        @keyframes wm-fadeIn { from { opacity:0; transform:scale(.95) } to { opacity:1; transform:scale(1) } }
        .wm-success-ring {
          width: 90px; height: 90px; border-radius: 50%;
          background: linear-gradient(135deg, #d97706, #fbbf24);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 16px 40px rgba(217,119,6,0.4);
          animation: wm-popIn 0.6s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes wm-popIn { from { transform:scale(0) rotate(-180deg) } to { transform:scale(1) rotate(0) } }
        .wm-success h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px; font-weight: 700; color: #fff; margin-top: 24px;
        }
        .wm-success p { font-size: 14px; color: rgba(255,255,255,0.42); margin-top: 10px; max-width: 320px; line-height: 1.65; }
        .wm-reset { background: none; border: none; color: #d97706; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 20px; text-decoration: underline; font-family: 'DM Sans', sans-serif; }

        /* ── LOCATIONS STRIP ── */
        .wm-strip { background: #0f0e0d; border-top: 1px solid rgba(255,255,255,0.07); padding: 60px 0; }
        .wm-strip-inner { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
        .wm-strip-hdr { margin-bottom: 36px; }
        .wm-strip-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px; font-weight: 700; color: #fff; margin-top: 10px;
        }
        .wm-strip-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media(max-width: 700px) { .wm-strip-grid { grid-template-columns: 1fr; } }

        .wm-strip-card {
          border-radius: 14px; border: 1px solid rgba(255,255,255,0.08);
          background: #161412; padding: 26px; transition: border-color 0.3s, box-shadow 0.3s;
          position: relative; overflow: hidden;
        }
        .wm-strip-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(217,119,6,0.07) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.35s;
        }
        .wm-strip-card:hover { border-color: rgba(217,119,6,0.4); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .wm-strip-card:hover::before { opacity: 1; }

        .wm-strip-num { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; color: rgba(255,255,255,0.2); }
        .wm-strip-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px; font-weight: 700; color: #fff; margin-top: 10px;
        }
        .wm-strip-tag {
          font-size: 9px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #d97706; margin-top: 6px;
        }
        .wm-strip-addr { font-size: 12px; color: rgba(255,255,255,0.38); margin-top: 10px; line-height: 1.55; }
        .wm-strip-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; color: #d97706;
          text-decoration: none; margin-top: 16px; transition: gap 0.25s;
        }
        .wm-strip-link:hover { gap: 10px; }
        .wm-strip-link svg { width: 13px; height: 13px; }
      `}</style>

      <div style={{ background: "#0a0908", minHeight: "100vh" }}>

        {/* ════════════ BANNER ════════════ */}
        <section className="wm-contact-banner">
          <div
            className="wm-contact-banner__bg"
            style={{ backgroundImage: `url(${bannerImg})` }}
          />
          <div className="wm-contact-banner__overlay" />
          <div className="wm-contact-banner__overlay2" />

          {/* Particles */}
          <div className="wm-particles">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="wm-particle"
                style={{
                  width: i % 3 === 0 ? 3 : 2,
                  height: i % 3 === 0 ? 3 : 2,
                  background: i % 4 === 0 ? "#d97706" : "rgba(255,255,255,0.12)",
                  left: `${5 + (i * 5.8) % 90}%`,
                  top: `${10 + (i * 7.3) % 80}%`,
                  animationDuration: `${3 + (i % 4)}s`,
                  animationDelay: `${i * 0.45}s`,
                }}
              />
            ))}
          </div>

          <div className="wm-contact-banner__inner">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="wm-contact-eyebrow">
                <Sparkles size={11} />
                Get In Touch
              </div>
            </motion.div>

            <motion.h1
              className="wm-contact-title"
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Let's <span className="wm-contact-title-accent">Talk.</span>
            </motion.h1>

            <motion.p
              className="wm-contact-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Questions, catering, feedback — we love hearing from our Maryland family.
            </motion.p>
          </div>
        </section>

        {/* ════════════ MAIN GRID ════════════ */}
        <div className="wm-contact-main">

          {/* ── INFO COLUMN ── */}
          <motion.div
            className="wm-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Reach card */}
            <div className="wm-reach-card">
              <div className="wm-card-label">Reach Us Directly</div>
              <ul className="wm-contact-list">
                {SITE.phones.map((p, i) => (
                  <li key={p}>
                    <div className="wm-ci"><Phone size={16} /></div>
                    <div>
                      <a href={`tel:${p.replace(/\D/g, "")}`} className="wm-ct">{p}</a>
                      <div className="wm-cs">{LOCATIONS[i]?.name ?? "General Line"}</div>
                    </div>
                  </li>
                ))}
                <li>
                  <div className="wm-ci"><Mail size={16} /></div>
                  <div>
                    <a href={`mailto:${SITE.email}`} className="wm-ct">{SITE.email}</a>
                    <div className="wm-cs">General inquiries &amp; catering</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div className="wm-hours">
              <div className="wm-hours-icon"><Clock size={17} color="#d97706" /></div>
              <div>
                <div className="wm-hours-title">Kitchen Hours</div>
                <div className="wm-hours-times">
                  Sun – Thu &nbsp; 10 AM – 10 PM<br />
                  Fri – Sat &nbsp;&nbsp;&nbsp; 10 AM – 11 PM
                </div>
              </div>
            </div>

            {/* Location cards */}
            {LOCATIONS.map((l, i) => (
              <div key={l.slug} className="wm-loc-card">
                <div className="wm-loc-hdr">
                  <div className="wm-loc-num">0{i + 1} — {l.name.toUpperCase()}</div>
                  <div className="wm-loc-badge">{l.specialty.split(" · ")[0]}</div>
                </div>
                <div className="wm-loc-name">{l.name}</div>
                <div className="wm-loc-addr">{l.address}</div>
                <a href={l.phoneHref} className="wm-loc-phone">
                  <Phone size={12} /> {l.phone} <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </motion.div>

          {/* ── FORM COLUMN ── */}
          <motion.div
            className="wm-form-wrap"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="wm-success"
                >
                  <div className="wm-success-ring">
                    <Check size={42} strokeWidth={2.5} color="#fff" />
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Thanks for reaching out. We'll get back to you within one business day.</p>
                  <button className="wm-reset" onClick={() => setSubmitted(false)}>
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="wm-form-title">Send us a message</div>
                  <div className="wm-form-sub">
                    We typically respond within one business day. For urgent orders, call your nearest location.
                  </div>
                  <div className="wm-form-divider" />

                  <div className="wm-form-grid">
                    {/* Name */}
                    <div className="wm-field">
                      <label htmlFor="name">Full Name</label>
                      <input id="name" name="name" type="text" placeholder="John Smith" maxLength={100} />
                      {errors.name && <span className="wm-err">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="wm-field">
                      <label htmlFor="email">Email Address</label>
                      <input id="email" name="email" type="email" placeholder="john@example.com" maxLength={255} />
                      {errors.email && <span className="wm-err">{errors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div className="wm-field">
                      <label htmlFor="phone">Phone (optional)</label>
                      <input id="phone" name="phone" type="tel" placeholder="(410) 555-0000" maxLength={40} />
                    </div>

                    {/* Subject */}
                    <div className="wm-field">
                      <label htmlFor="subject">Subject</label>
                      <select id="subject" name="subject" defaultValue="">
                        <option value="" disabled>Select a topic…</option>
                        <option value="general">General Inquiry</option>
                        <option value="catering">Catering &amp; Events</option>
                        <option value="order">Order Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="careers">Careers</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && <span className="wm-err">{errors.subject}</span>}
                    </div>

                    {/* Message */}
                    <div className="wm-field full">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        maxLength={1000}
                        placeholder="Tell us how we can help…"
                        onChange={(e) => setCharCount(e.target.value.length)}
                      />
                      <div className="wm-char-count">{charCount} / 1000</div>
                      {errors.message && <span className="wm-err">{errors.message}</span>}
                    </div>
                  </div>

                  <div className="wm-form-footer">
                    <button type="submit" className="wm-submit">
                      <Send size={15} /> Send Message
                    </button>
                    <p className="wm-privacy">
                      Your info is never shared. We'll only use it to respond to your message.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ════════════ LOCATIONS STRIP ════════════ */}
        <section className="wm-strip">
          <div className="wm-strip-inner">
            <div className="wm-strip-hdr">
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d97706" }}>
                Find Us
              </div>
              <div className="wm-strip-title">Three Maryland Kitchens</div>
            </div>
            <div className="wm-strip-grid">
              {LOCATIONS.map((l, i) => (
                <motion.div
                  key={l.slug}
                  className="wm-strip-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wm-strip-num">0{i + 1}</div>
                  <div className="wm-strip-name">{l.name}</div>
                  <div className="wm-strip-tag">{l.specialty.split(" · ")[0]}</div>
                  <div className="wm-strip-addr">{l.address}</div>
                  <a href={l.phoneHref} className="wm-strip-link">
                    <Phone size={12} /> {l.phone} <ArrowRight size={12} />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}