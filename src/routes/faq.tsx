import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, ArrowRight, MessageSquare, Phone, Mail, Search } from "lucide-react";
import { FAQS } from "@/data/faqs";
import bannerImg from "@/assets/banner-1.webp";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Wise Mart | Hours, Ordering, Catering, Menus" },
      { name: "description", content: "Answers to common questions about Wise Mart hours, online ordering, catering, menu items, and our three Maryland locations." },
      { property: "og:title", content: "Wise Mart — Frequently Asked Questions" },
      { property: "og:description", content: "Hours, ordering, catering, menus — everything you might want to know." },
    ],
  }),
  component: FAQPage,
});

/* ── CATEGORY FILTERS ── */
const CATEGORIES = [
  { id: "all",      label: "All Questions"  },
  { id: "ordering", label: "Ordering"       },
  { id: "hours",    label: "Hours & Locations" },
  { id: "menu",     label: "Menu & Diet"    },
  { id: "catering", label: "Catering"       },
  { id: "other",    label: "Other"          },
];

/* Tag each FAQ — you can move this tagging into /data/faqs.ts later */
type TaggedFAQ = { q: string; a: string; cat: string };

function tagFaqs(raw: { q: string; a: string }[]): TaggedFAQ[] {
  const rules: { pattern: RegExp; cat: string }[] = [
    { pattern: /order|pickup|delivery|online/i,        cat: "ordering" },
    { pattern: /hour|park|location|open|close/i,       cat: "hours"    },
    { pattern: /vegan|vegetarian|allerg|ingredient|local|source/i, cat: "menu" },
    { pattern: /cater|event|party|corporate/i,         cat: "catering" },
    { pattern: /loyalty|reward|job|apply|career/i,     cat: "other"    },
  ];
  return raw.map((item) => {
    const combined = item.q + " " + item.a;
    const match = rules.find((r) => r.pattern.test(combined));
    return { ...item, cat: match?.cat ?? "other" };
  });
}

/* ── FAQ ITEM ── */
function FAQItem({ item, index }: { item: TaggedFAQ; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="wmf-item"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.38, delay: index * 0.04 }}
      layout
    >
      <button className="wmf-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="wmf-q">{item.q}</span>
        <motion.span
          className="wmf-icon"
          animate={{ rotate: open ? 45 : 0, background: open ? "#d97706" : "rgba(217,119,6,0.12)" }}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
        >
          <Plus size={15} style={{ color: open ? "#fff" : "#d97706" }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="wmf-a">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── PAGE ── */
function FAQPage() {
  const [activecat, setActivecat] = useState("all");
  const [query, setQuery] = useState("");

  const tagged = tagFaqs(FAQS);

  const filtered = tagged.filter((item) => {
    const matchCat = activecat === "all" || item.cat === activecat;
    const matchQ   = query.trim() === "" ||
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  /* split into two columns */
  const left  = filtered.filter((_, i) => i % 2 === 0);
  const right = filtered.filter((_, i) => i % 2 !== 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');

        .wmf-page { font-family: 'DM Sans', sans-serif; background: #0a0908; color: #fff; }

        /* ── BANNER ── */
        .wmf-banner {
          position: relative; min-height: 520px;
          display: flex; align-items: flex-end; overflow: hidden;
        }
        .wmf-banner__bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center 30%;
          transform: scale(1.06); transition: transform 14s ease; will-change: transform;
        }
        .wmf-banner:hover .wmf-banner__bg { transform: scale(1.0); }
        .wmf-banner__ov1 {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,9,8,0.22) 0%, rgba(10,9,8,0.6) 40%, rgba(10,9,8,0.97) 100%);
        }
        .wmf-banner__ov2 {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(10,9,8,0.82) 0%, transparent 65%);
        }
        .wmf-banner__inner {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto; padding: 0 40px 64px; width: 100%;
        }
        @media(max-width:640px){ .wmf-banner__inner { padding: 0 24px 48px; } }

        .wmf-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #d97706; margin-bottom: 20px;
        }
        .wmf-eyebrow::before, .wmf-eyebrow::after {
          content: ''; display: inline-block; width: 32px; height: 1px;
          background: #d97706; opacity: 0.5;
        }
        .wmf-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 8vw, 96px); font-weight: 700;
          line-height: 1.0; letter-spacing: -0.01em; color: #fff;
        }
        .wmf-title-accent {
          background: linear-gradient(90deg, #d97706 0%, #fbbf24 45%, #d97706 70%, #b45309 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wmf-shimmer 4s linear infinite;
        }
        @keyframes wmf-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .wmf-sub { font-size: 16px; color: rgba(255,255,255,0.5); margin-top: 16px; line-height: 1.7; max-width: 500px; }

        /* particles */
        .wmf-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .wmf-p {
          position: absolute; border-radius: 50%;
          animation: wmf-float linear infinite; opacity: 0;
        }
        @keyframes wmf-float {
          0%  { transform: translateY(100%) scale(0); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.3; }
          100%{ transform: translateY(-120%) scale(1.4); opacity: 0; }
        }

        /* ── SEARCH + FILTERS ── */
        .wmf-controls {
          max-width: 1280px; margin: 0 auto; padding: 52px 40px 0;
          display: flex; flex-direction: column; gap: 24px;
        }
        @media(max-width:640px){ .wmf-controls { padding: 36px 24px 0; } }

        .wmf-search-wrap {
          position: relative; max-width: 560px;
        }
        .wmf-search-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.25); pointer-events: none;
        }
        .wmf-search {
          width: 100%; background: #161412; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 14px; padding: 13px 16px 13px 44px;
          outline: none; transition: border-color 0.25s, box-shadow 0.25s;
        }
        .wmf-search::placeholder { color: rgba(255,255,255,0.22); }
        .wmf-search:focus { border-color: #d97706; box-shadow: 0 0 0 3px rgba(217,119,6,0.15); }

        .wmf-filters { display: flex; flex-wrap: wrap; gap: 8px; }
        .wmf-filter {
          padding: 8px 18px; border-radius: 50px; font-size: 12px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.1); background: transparent;
          color: rgba(255,255,255,0.5); cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.22s; letter-spacing: 0.02em;
        }
        .wmf-filter:hover { border-color: rgba(217,119,6,0.4); color: #d97706; }
        .wmf-filter.active {
          background: #d97706; border-color: #d97706; color: #fff;
          box-shadow: 0 6px 20px rgba(217,119,6,0.3);
        }

        /* ── FAQ GRID ── */
        .wmf-grid-wrap { max-width: 1280px; margin: 0 auto; padding: 40px 40px 80px; }
        @media(max-width:640px){ .wmf-grid-wrap { padding: 32px 24px 60px; } }

        .wmf-count {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 28px;
        }
        .wmf-count span { color: #d97706; }

        .wmf-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; align-items: start; }
        @media(max-width:800px){ .wmf-cols { grid-template-columns: 1fr; } }

        .wmf-col { display: flex; flex-direction: column; }

        /* FAQ item */
        .wmf-item {
          border-bottom: 1px solid rgba(255,255,255,0.07); overflow: hidden;
        }
        .wmf-btn {
          width: 100%; background: none; border: none; cursor: pointer;
          padding: 22px 0; display: flex; align-items: center;
          justify-content: space-between; gap: 16px; text-align: left;
        }
        .wmf-btn:hover .wmf-q { color: rgba(255,255,255,0.95); }
        .wmf-q { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.78); line-height: 1.5; flex: 1; }
        .wmf-icon {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
          background: rgba(217,119,6,0.12);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.25s;
        }
        .wmf-a {
          font-size: 13px; color: rgba(255,255,255,0.42);
          line-height: 1.8; padding: 0 0 22px 0; padding-right: 46px;
        }

        /* no-results */
        .wmf-empty {
          grid-column: 1/-1; text-align: center; padding: 64px 0;
          font-size: 14px; color: rgba(255,255,255,0.28);
        }
        .wmf-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 700; color: rgba(255,255,255,0.55);
          margin-bottom: 10px;
        }

        /* ── STILL NEED HELP ── */
        .wmf-help { background: #0f0e0d; border-top: 1px solid rgba(255,255,255,0.07); padding: 72px 0; }
        .wmf-help-inner { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
        @media(max-width:640px){ .wmf-help-inner { padding: 0 24px; } }
        .wmf-help-header { text-align: center; margin-bottom: 44px; }
        .wmf-help-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: #d97706; margin-bottom: 12px;
        }
        .wmf-help-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 48px); font-weight: 700; color: #fff; line-height: 1.05;
        }
        .wmf-help-sub { font-size: 14px; color: rgba(255,255,255,0.38); margin-top: 10px; }

        .wmf-help-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media(max-width:800px){ .wmf-help-grid { grid-template-columns: 1fr; } }

        .wmf-help-card {
          border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);
          background: #161412; padding: 32px 28px;
          display: flex; flex-direction: column; gap: 16px;
          transition: border-color 0.3s, box-shadow 0.35s; position: relative; overflow: hidden;
          text-decoration: none;
        }
        .wmf-help-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(217,119,6,0.08) 0%, transparent 65%);
          opacity: 0; transition: opacity 0.4s;
        }
        .wmf-help-card:hover { border-color: rgba(217,119,6,0.4); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .wmf-help-card:hover::before { opacity: 1; }

        .wmf-help-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(217,119,6,0.12); color: #d97706;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.3s, transform 0.4s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
          flex-shrink: 0;
        }
        .wmf-help-card:hover .wmf-help-icon {
          background: #d97706; color: #fff;
          transform: scale(1.12) rotate(-8deg);
          box-shadow: 0 8px 24px rgba(217,119,6,0.4);
        }
        .wmf-help-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 700; color: #fff;
        }
        .wmf-help-card-desc { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.65; }
        .wmf-help-card-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #d97706;
          margin-top: auto; transition: gap 0.25s;
        }
        .wmf-help-card:hover .wmf-help-card-link { gap: 10px; }

        /* ── CTA ── */
        .wmf-cta { padding: 0 40px 80px; max-width: 1280px; margin: 0 auto; }
        @media(max-width:640px){ .wmf-cta { padding: 0 24px 60px; } }
        .wmf-cta-box {
          border-radius: 20px; overflow: hidden; background: #d97706;
          padding: 60px 52px; display: grid; grid-template-columns: 1fr auto;
          gap: 32px; align-items: center; position: relative;
        }
        @media(max-width:700px){ .wmf-cta-box { grid-template-columns: 1fr; padding: 40px 32px; } }
        .wmf-cta-box::before {
          content: ''; position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.4;
        }
        .wmf-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 50px); font-weight: 700; color: #fff;
          line-height: 1.05; position: relative;
        }
        .wmf-cta-sub { font-size: 15px; color: rgba(255,255,255,0.82); margin-top: 10px; position: relative; max-width: 420px; }
        .wmf-cta-btns { display: flex; flex-wrap: wrap; gap: 12px; position: relative; }
        .wmf-btn-dark {
          display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
          background: #0a0908; color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .wmf-btn-dark:hover { background: #1a1612; transform: translateY(-2px); }
        .wmf-btn-light {
          display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
          background: rgba(255,255,255,0.15); color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none;
          border: 1px solid rgba(255,255,255,0.3); transition: background 0.2s, transform 0.2s;
        }
        .wmf-btn-light:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); }
      `}</style>

      <div className="wmf-page">

        {/* ════════════ BANNER ════════════ */}
        <section className="wmf-banner">
          <div className="wmf-banner__bg" style={{ backgroundImage: `url(${bannerImg})` }} />
          <div className="wmf-banner__ov1" />
          <div className="wmf-banner__ov2" />

          {/* Particles */}
          <div className="wmf-particles">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="wmf-p" style={{
                width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
                background: i % 4 === 0 ? "#d97706" : "rgba(255,255,255,0.12)",
                left: `${5 + (i * 6.1) % 90}%`, top: `${10 + (i * 7.7) % 80}%`,
                animationDuration: `${3 + (i % 4)}s`, animationDelay: `${i * 0.45}s`,
              }} />
            ))}
          </div>

          <div className="wmf-banner__inner">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="wmf-eyebrow"><Sparkles size={11} /> Help Center</div>
            </motion.div>

            <motion.h1
              className="wmf-title"
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Got <span className="wmf-title-accent">Questions?</span>
            </motion.h1>

            <motion.p className="wmf-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}>
              Quick answers to the things our guests ask most — from ordering and hours to catering and careers.
            </motion.p>
          </div>
        </section>

        {/* ════════════ SEARCH + FILTERS ════════════ */}
        <motion.div
          className="wmf-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search */}
          <div className="wmf-search-wrap">
            <span className="wmf-search-icon"><Search size={16} /></span>
            <input
              className="wmf-search"
              type="text"
              placeholder="Search questions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Category pills */}
          <div className="wmf-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`wmf-filter${activecat === cat.id ? " active" : ""}`}
                onClick={() => setActivecat(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ════════════ FAQ GRID ════════════ */}
        <div className="wmf-grid-wrap">
          <div className="wmf-count">
            Showing <span>{filtered.length}</span> of <span>{tagged.length}</span> questions
          </div>

          {filtered.length === 0 ? (
            <div className="wmf-empty">
              <div className="wmf-empty-title">No questions found.</div>
              <p>Try a different search or filter — or reach us directly on the Contact page.</p>
            </div>
          ) : (
            <div className="wmf-cols">
              <div className="wmf-col">
                <AnimatePresence>
                  {left.map((item, i) => (
                    <FAQItem key={item.q} item={item} index={i * 2} />
                  ))}
                </AnimatePresence>
              </div>
              <div className="wmf-col">
                <AnimatePresence>
                  {right.map((item, i) => (
                    <FAQItem key={item.q} item={item} index={i * 2 + 1} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* ════════════ STILL NEED HELP ════════════ */}
        <section className="wmf-help">
          <div className="wmf-help-inner">
            <div className="wmf-help-header">
              <div className="wmf-help-eyebrow">Still Need Help?</div>
              <h2 className="wmf-help-title">We're always here.</h2>
              <p className="wmf-help-sub">Reach us any of these ways — we typically respond within one business day.</p>
            </div>

            <div className="wmf-help-grid">
              {/* Contact page */}
              <Link to="/contact" className="wmf-help-card">
                <div className="wmf-help-icon"><MessageSquare size={22} /></div>
                <div>
                  <div className="wmf-help-card-title">Send a Message</div>
                  <div className="wmf-help-card-desc">
                    Use our contact form for general inquiries, catering requests, or feedback.
                    We'll get back to you fast.
                  </div>
                </div>
                <div className="wmf-help-card-link">
                  Go to Contact <ArrowRight size={13} />
                </div>
              </Link>

              {/* Call */}
              <a href="tel:+14105551234" className="wmf-help-card">
                <div className="wmf-help-icon"><Phone size={22} /></div>
                <div>
                  <div className="wmf-help-card-title">Give Us a Call</div>
                  <div className="wmf-help-card-desc">
                    For urgent orders or same-day catering, call your nearest location directly.
                    Our team picks up fast.
                  </div>
                </div>
                <div className="wmf-help-card-link">
                  (410) 555-1234 <ArrowRight size={13} />
                </div>
              </a>

              {/* Email */}
              <a href="mailto:hello@wisemart.com" className="wmf-help-card">
                <div className="wmf-help-icon"><Mail size={22} /></div>
                <div>
                  <div className="wmf-help-card-title">Email Us</div>
                  <div className="wmf-help-card-desc">
                    Drop us a line at hello@wisemart.com for anything that doesn't need an immediate reply.
                  </div>
                </div>
                <div className="wmf-help-card-link">
                  hello@wisemart.com <ArrowRight size={13} />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ════════════ CTA ════════════ */}
        <div className="wmf-cta" style={{ paddingTop: 60 }}>
          <motion.div
            className="wmf-cta-box"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <div>
              <h3 className="wmf-cta-title">Ready to order?</h3>
              <p className="wmf-cta-sub">
                Pick your location, place your order, and we'll have something fresh waiting for you.
              </p>
            </div>
            <div className="wmf-cta-btns">
              <Link to="/order"     className="wmf-btn-dark">Order Now <ArrowRight size={15} /></Link>
              <Link to="/locations" className="wmf-btn-light">Find a Location</Link>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}