import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, Phone, Clock, MapPin,
  ShoppingBag, Truck, Star, ChevronRight,
} from "lucide-react";
import { LOCATIONS, SITE } from "@/data/site";
import bannerImg from "@/assets/banner-3.webp";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order Online — Wise Mart | Maryland Restaurants" },
      { name: "description", content: "Order fresh pizza, famous fried chicken, subs, and salads from Wise Mart. Three Maryland locations — pickup or delivery." },
      { property: "og:title", content: "Order Online — Wise Mart" },
      { property: "og:description", content: "Pick your location and order from Wise Mart. Fresh food, fast service." },
    ],
  }),
  component: OrderPage,
});

const HOW_IT_WORKS = [
  { step: "01", title: "Pick a Location", desc: "Choose your nearest Wise Mart — Sharptown, East New Market, or Vienna." },
  { step: "02", title: "Build Your Order", desc: "Browse the full menu and customize every item exactly the way you like." },
  { step: "03", title: "Pick Up or Delivery", desc: "Swing by when it's ready, or let us bring it to your door." },
];

const PLATFORMS = [
  { name: "DoorDash",   color: "#FF3008", desc: "Fast delivery to your door" },
  { name: "Uber Eats",  color: "#06C167", desc: "Track your order in real time" },
  { name: "Grubhub",    color: "#F63440", desc: "Easy reorder from history"   },
];

function OrderPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');

        .wmo-page { font-family: 'DM Sans', sans-serif; background: #0a0908; color: #fff; }

        /* ── BANNER ── */
        .wmo-banner {
          position: relative; min-height: 560px;
          display: flex; align-items: flex-end; overflow: hidden;
        }
        .wmo-banner__bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center 40%;
          transform: scale(1.06); transition: transform 14s ease; will-change: transform;
        }
        .wmo-banner:hover .wmo-banner__bg { transform: scale(1.0); }
        .wmo-banner__ov1 {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,9,8,0.15) 0%, rgba(10,9,8,0.58) 38%, rgba(10,9,8,0.97) 100%);
        }
        .wmo-banner__ov2 {
          position: absolute; inset: 0;
          background: linear-gradient(100deg, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.4) 55%, transparent 80%);
        }
        .wmo-banner__inner {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto; padding: 0 40px 72px; width: 100%;
        }
        @media(max-width:640px){ .wmo-banner__inner { padding: 0 24px 52px; } }

        .wmo-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #d97706; margin-bottom: 20px;
        }
        .wmo-eyebrow::before, .wmo-eyebrow::after {
          content: ''; display: inline-block; width: 32px; height: 1px; background: #d97706; opacity: 0.5;
        }
        .wmo-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(50px, 8vw, 96px); font-weight: 700;
          line-height: 1.0; letter-spacing: -0.01em; color: #fff;
        }
        .wmo-title-accent {
          background: linear-gradient(90deg, #d97706 0%, #fbbf24 45%, #d97706 70%, #b45309 100%);
          background-size: 200% auto; -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; animation: wmo-shimmer 4s linear infinite;
        }
        @keyframes wmo-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .wmo-sub { font-size: 16px; color: rgba(255,255,255,0.5); margin-top: 16px; line-height: 1.75; max-width: 500px; }
        .wmo-banner-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }

        .wmo-btn-primary {
          display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px;
          background: #d97706; color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none;
          border: none; cursor: pointer; letter-spacing: 0.02em;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .wmo-btn-primary:hover { background: #b45309; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(217,119,6,0.35); }
        .wmo-btn-outline {
          display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px;
          background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8);
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          border-radius: 8px; text-decoration: none; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s;
        }
        .wmo-btn-outline:hover { border-color: rgba(255,255,255,0.6); color: #fff; background: rgba(255,255,255,0.06); transform: translateY(-3px); }

        /* particles */
        .wmo-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .wmo-p { position: absolute; border-radius: 50%; animation: wmo-float linear infinite; opacity: 0; }
        @keyframes wmo-float {
          0%  { transform:translateY(100%) scale(0); opacity:0; }
          20% { opacity:.7; }
          80% { opacity:.3; }
          100%{ transform:translateY(-120%) scale(1.4); opacity:0; }
        }

        /* ── STATS BAR ── */
        .wmo-stats { background: #d97706; }
        .wmo-stats-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 40px;
          display: grid; grid-template-columns: repeat(4,1fr);
        }
        @media(max-width:640px){ .wmo-stats-inner { grid-template-columns:repeat(2,1fr); padding:0 24px; } }
        .wmo-stat {
          padding: 26px 20px; text-align: center;
          border-right: 1px solid rgba(0,0,0,0.12); position: relative; overflow: hidden;
        }
        .wmo-stat:last-child { border-right: none; }
        .wmo-stat::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,0); transition:background .3s; }
        .wmo-stat:hover::after { background:rgba(255,255,255,0.07); }
        .wmo-stat__num  { font-family:'Cormorant Garamond',serif; font-size:38px; font-weight:700; color:#fff; line-height:1; }
        .wmo-stat__label{ font-size:10px; font-weight:600; color:rgba(255,255,255,0.78); margin-top:4px; letter-spacing:.1em; text-transform:uppercase; }

        /* ── SECTION COMMON ── */
        .wmo-section { max-width:1280px; margin:0 auto; padding:0 40px; }
        @media(max-width:640px){ .wmo-section { padding:0 24px; } }
        .wmo-section-eyebrow { font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#d97706; }
        .wmo-section-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,4vw,50px); font-weight:700; color:#fff; margin-top:12px; line-height:1.05; }
        .wmo-section-sub { font-size:14px; color:rgba(255,255,255,0.38); margin-top:10px; }

        /* ── ORDER NOW CARDS ── */
        .wmo-order { padding: 72px 0; }
        .wmo-order-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:44px; }
        @media(max-width:900px){ .wmo-order-grid { grid-template-columns:1fr; } }

        .wmo-loc-card {
          border-radius:16px; border:1px solid rgba(255,255,255,0.08); background:#161412;
          padding:32px 28px; display:flex; flex-direction:column; gap:0;
          transition:border-color .3s, box-shadow .35s; position:relative; overflow:hidden;
          text-decoration:none;
        }
        .wmo-loc-card::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(217,119,6,0.08) 0%,transparent 55%);
          opacity:0; transition:opacity .35s;
        }
        .wmo-loc-card:hover { border-color:rgba(217,119,6,0.45); box-shadow:0 24px 60px rgba(0,0,0,0.45); }
        .wmo-loc-card:hover::before { opacity:1; }

        .wmo-loc-num  { font-size:10px; font-weight:700; letter-spacing:.18em; color:rgba(255,255,255,0.22); }
        .wmo-loc-name { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:700; color:#fff; margin-top:12px; line-height:1; }
        .wmo-loc-addr { font-size:12px; color:rgba(255,255,255,0.38); margin-top:8px; line-height:1.55; }
        .wmo-loc-specialty { font-size:9px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#d97706; margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.07); }

        .wmo-loc-actions { display:flex; flex-direction:column; gap:10px; margin-top:22px; }
        .wmo-order-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          padding:12px 20px; background:#d97706; color:#fff;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
          border-radius:8px; text-decoration:none; border:none; cursor:pointer;
          transition:background .2s, transform .2s, box-shadow .2s;
        }
        .wmo-order-btn:hover { background:#b45309; transform:translateY(-2px); box-shadow:0 8px 24px rgba(217,119,6,0.35); }
        .wmo-call-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          padding:11px 20px; background:transparent; color:rgba(255,255,255,0.65);
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
          border-radius:8px; text-decoration:none; border:1px solid rgba(255,255,255,0.12);
          transition:border-color .2s, color .2s, background .2s;
        }
        .wmo-call-btn:hover { border-color:rgba(255,255,255,0.35); color:#fff; background:rgba(255,255,255,0.05); }

        /* ── HOW IT WORKS ── */
        .wmo-how { background:#0f0e0d; padding:72px 0; border-top:1px solid rgba(255,255,255,0.07); }
        .wmo-how-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; margin-top:44px; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.07); border-radius:16px; overflow:hidden; }
        @media(max-width:700px){ .wmo-how-grid { grid-template-columns:1fr; } }

        .wmo-how-step {
          padding:40px 32px; background:#0f0e0d;
          transition:background .3s; position:relative; overflow:hidden;
        }
        .wmo-how-step::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(circle at 25% 25%, rgba(217,119,6,0.09) 0%, transparent 65%);
          opacity:0; transition:opacity .4s;
        }
        .wmo-how-step:hover { background:#161412; }
        .wmo-how-step:hover::before { opacity:1; }

        .wmo-step-num {
          font-family:'Cormorant Garamond',serif; font-size:52px; font-weight:700;
          color:rgba(217,119,6,0.18); line-height:1;
        }
        .wmo-step-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; color:#fff; margin-top:16px; }
        .wmo-step-desc  { font-size:13px; color:rgba(255,255,255,0.4); margin-top:8px; line-height:1.65; }
        .wmo-step-arrow { margin-top:20px; color:#d97706; }

        /* ── DELIVERY PLATFORMS ── */
        .wmo-delivery { padding:72px 0; }
        .wmo-delivery-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:44px; }
        @media(max-width:700px){ .wmo-delivery-grid { grid-template-columns:1fr; } }

        .wmo-platform {
          border-radius:14px; border:1px solid rgba(255,255,255,0.08); background:#161412;
          padding:28px; display:flex; align-items:center; gap:18px;
          transition:border-color .3s, box-shadow .3s; position:relative; overflow:hidden;
          text-decoration:none;
        }
        .wmo-platform::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(circle at 20% 50%, rgba(217,119,6,0.06) 0%, transparent 65%);
          opacity:0; transition:opacity .4s;
        }
        .wmo-platform:hover { border-color:rgba(217,119,6,0.35); box-shadow:0 16px 40px rgba(0,0,0,0.4); }
        .wmo-platform:hover::before { opacity:1; }

        .wmo-platform-dot { width:14px; height:14px; border-radius:50%; flex-shrink:0; }
        .wmo-platform-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; color:#fff; }
        .wmo-platform-desc { font-size:12px; color:rgba(255,255,255,0.38); margin-top:3px; }
        .wmo-platform-arrow { margin-left:auto; color:#d97706; flex-shrink:0; }

        /* ── CATERING STRIP ── */
        .wmo-catering { background:#0f0e0d; border-top:1px solid rgba(255,255,255,0.07); padding:72px 0; }
        .wmo-catering-inner { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
        @media(max-width:900px){ .wmo-catering-inner { grid-template-columns:1fr; gap:36px; } }

        .wmo-catering-img {
          border-radius:18px; overflow:hidden; aspect-ratio:16/9;
          border:1px solid rgba(255,255,255,0.08); position:relative;
          transition:box-shadow .4s;
        }
        .wmo-catering-img:hover { box-shadow:0 32px 80px rgba(0,0,0,0.55); }
        .wmo-catering-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .8s ease; }
        .wmo-catering-img:hover img { transform:scale(1.04); }
        .wmo-catering-img-caption {
          position:absolute; bottom:0; left:0; right:0; padding:22px;
          background:linear-gradient(to top, rgba(10,9,8,0.88) 0%, transparent 100%);
          font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:#fff;
        }

        .wmo-catering-body p { font-size:14px; color:rgba(255,255,255,0.48); line-height:1.8; margin-top:16px; }
        .wmo-catering-link {
          display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:600;
          color:#d97706; text-decoration:none; margin-top:28px; transition:gap .25s;
        }
        .wmo-catering-link:hover { gap:14px; }

        /* ── CTA ── */
        .wmo-cta { padding:0 0 80px; }
        .wmo-cta-box {
          border-radius:20px; overflow:hidden; background:#d97706;
          padding:60px 52px; display:grid; grid-template-columns:1fr auto;
          gap:32px; align-items:center; position:relative;
        }
        @media(max-width:700px){ .wmo-cta-box { grid-template-columns:1fr; padding:40px 32px; } }
        .wmo-cta-box::before {
          content:''; position:absolute; inset:0;
          background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity:.4;
        }
        .wmo-cta-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,4vw,50px); font-weight:700; color:#fff; line-height:1.05; position:relative; }
        .wmo-cta-sub { font-size:15px; color:rgba(255,255,255,0.82); margin-top:10px; position:relative; max-width:420px; }
        .wmo-cta-btns { display:flex; flex-wrap:wrap; gap:12px; position:relative; }
        .wmo-btn-dark  { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; background:#0a0908; color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; border-radius:8px; text-decoration:none; transition:background .2s,transform .2s; }
        .wmo-btn-dark:hover  { background:#1a1612; transform:translateY(-2px); }
        .wmo-btn-light { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; background:rgba(255,255,255,0.15); color:#fff; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; border-radius:8px; text-decoration:none; border:1px solid rgba(255,255,255,0.3); transition:background .2s,transform .2s; }
        .wmo-btn-light:hover { background:rgba(255,255,255,0.25); transform:translateY(-2px); }
      `}</style>

      <div className="wmo-page">

        {/* ════════════ BANNER ════════════ */}
        <section className="wmo-banner">
          <div className="wmo-banner__bg" style={{ backgroundImage: `url(${bannerImg})` }} />
          <div className="wmo-banner__ov1" />
          <div className="wmo-banner__ov2" />

          <div className="wmo-particles">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="wmo-p" style={{
                width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
                background: i % 4 === 0 ? "#d97706" : "rgba(255,255,255,0.12)",
                left: `${5 + (i * 6.1) % 90}%`, top: `${10 + (i * 7.7) % 80}%`,
                animationDuration: `${3 + (i % 4)}s`, animationDelay: `${i * 0.45}s`,
              }} />
            ))}
          </div>

          <div className="wmo-banner__inner">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="wmo-eyebrow"><Sparkles size={11} /> Order Online</div>
            </motion.div>

            <motion.h1
              className="wmo-title"
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Fresh Food.<br /><span className="wmo-title-accent">Your Way.</span>
            </motion.h1>

            <motion.p className="wmo-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}>
              Pick your location, build your order, and we'll have something hot and fresh waiting for you.
            </motion.p>

            <motion.div className="wmo-banner-ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
              <a href="#order-now" className="wmo-btn-primary">
                <ShoppingBag size={15} /> Order Now
              </a>
              <Link to="/locations" className="wmo-btn-outline">
                View Menus <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ════════════ STATS BAR ════════════ */}
        <motion.div className="wmo-stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="wmo-stats-inner">
            {[
              { num: "3",     label: "Locations"    },
              { num: "15+",   label: "Years Serving" },
              { num: "~15",   label: "Min Ready Time"},
              { num: "★4.8",  label: "Avg. Rating"  },
            ].map((s, i) => (
              <motion.div key={s.label} className="wmo-stat"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              >
                <div className="wmo-stat__num">{s.num}</div>
                <div className="wmo-stat__label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════════════ ORDER NOW ════════════ */}
        <section className="wmo-order" id="order-now">
          <div className="wmo-section">
            <div>
              <div className="wmo-section-eyebrow">Choose Your Kitchen</div>
              <h2 className="wmo-section-title">Pick a location & order.</h2>
              <p className="wmo-section-sub">Each location has its own full menu. Select yours to get started.</p>
            </div>

            <div className="wmo-order-grid">
              {LOCATIONS.map((loc, i) => (
                <motion.div
                  key={loc.slug}
                  initial={{ opacity: 0, y: 40, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wmo-loc-card">
                    <div className="wmo-loc-num">0{i + 1} — {loc.state}</div>
                    <div className="wmo-loc-name">{loc.name}</div>
                    <div className="wmo-loc-addr">{loc.address}</div>
                    <div className="wmo-loc-specialty">{loc.specialty}</div>
                    <div className="wmo-loc-actions">
                      <Link to="/locations" className="wmo-order-btn">
                        <ShoppingBag size={14} /> Order from {loc.name}
                      </Link>
                      <a href={loc.phoneHref} className="wmo-call-btn">
                        <Phone size={13} /> {loc.phone}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ HOW IT WORKS ════════════ */}
        <section className="wmo-how">
          <div className="wmo-section">
            <div style={{ textAlign: "center" }}>
              <div className="wmo-section-eyebrow">Simple Process</div>
              <h2 className="wmo-section-title" style={{ textAlign: "center" }}>How ordering works.</h2>
            </div>
            <div className="wmo-how-grid">
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="wmo-how-step"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="wmo-step-num">{step.step}</div>
                  <div className="wmo-step-title">{step.title}</div>
                  <div className="wmo-step-desc">{step.desc}</div>
                  <div className="wmo-step-arrow"><ChevronRight size={18} /></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ DELIVERY PLATFORMS ════════════ */}
        <section className="wmo-delivery">
          <div className="wmo-section">
            <div>
              <div className="wmo-section-eyebrow">Delivery Options</div>
              <h2 className="wmo-section-title">Order through your favorite app.</h2>
              <p className="wmo-section-sub">We're live on all major delivery platforms. Find your Wise Mart location inside each app.</p>
            </div>
            <div className="wmo-delivery-grid">
              {PLATFORMS.map((p, i) => (
                <motion.div
                  key={p.name}
                  className="wmo-platform"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="wmo-platform-dot" style={{ background: p.color }} />
                  <div>
                    <div className="wmo-platform-name">{p.name}</div>
                    <div className="wmo-platform-desc">{p.desc}</div>
                  </div>
                  <div className="wmo-platform-arrow"><ArrowRight size={16} /></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ CATERING ════════════ */}
        <section className="wmo-catering">
          <div className="wmo-section">
            <div className="wmo-catering-inner">
              <motion.div
                className="wmo-catering-img"
                initial={{ opacity: 0, x: -40, scale: 0.94 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={bannerImg} alt="Wise Mart catering spread" loading="lazy" />
                <div className="wmo-catering-img-caption">Feeding a crowd? We've got you.</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="wmo-catering-body"
              >
                <div className="wmo-section-eyebrow">Catering</div>
                <h2 className="wmo-section-title">Big events deserve great food.</h2>
                <p>From birthday parties to corporate lunches, we've fed every size crowd. Custom menus, generous portions, and the same Wise Mart quality you know.</p>
                <p>Contact your nearest location to talk through a custom quote — we'll handle the rest.</p>
                <Link to="/contact" className="wmo-catering-link">
                  Request a Catering Quote <ArrowRight size={13} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════ CTA ════════════ */}
        <div className="wmo-section" style={{ paddingTop: 60, paddingBottom: 80 }}>
          <motion.div
            className="wmo-cta-box"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            <div>
              <h3 className="wmo-cta-title">Still have questions?</h3>
              <p className="wmo-cta-sub">Check our FAQ or reach out directly — we're happy to help with any order.</p>
            </div>
            <div className="wmo-cta-btns">
              <Link to="/contact"   className="wmo-btn-dark">Contact Us</Link>
              <Link to="/faq"       className="wmo-btn-light">View FAQ</Link>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}
