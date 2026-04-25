import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, MapPin, ShoppingBag } from "lucide-react";
import { LOCATIONS, NAV_LINKS } from "@/data/site";
import logo from "@/assets/logo.png";

export function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header className={`wm-header${scrolled ? " wm-header--scrolled" : ""}`}>
        <div className="wm-header__inner">

          {/* LOGO */}
          <Link to="/" className="wm-logo" aria-label="Wise Mart — Home">
            <img src={logo} alt="Wise Mart" className="wm-logo__img" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="wm-nav">
            <Link
              to="/"
              className="wm-nav__link"
              activeProps={{ className: "wm-nav__link wm-nav__link--active" }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>

            <div
              className="wm-dropdown"
              ref={dropdownRef}
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                className={`wm-nav__link wm-dropdown__trigger${menuOpen ? " wm-nav__link--active" : ""}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                Menu
                <ChevronDown className={`wm-dropdown__chevron${menuOpen ? " wm-dropdown__chevron--open" : ""}`} />
              </button>

              <div className={`wm-dropdown__panel${menuOpen ? " wm-dropdown__panel--open" : ""}`} role="menu">
                <div className="wm-dropdown__header">Our Locations</div>
                <div className="wm-dropdown__list">
                  {LOCATIONS.map((loc, i) => (
                    <Link
                      key={loc.slug}
                      to="/menu/$location"
                      params={{ location: loc.slug }}
                      className="wm-dropdown__item"
                      role="menuitem"
                      style={{ animationDelay: `${i * 40}ms` }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="wm-dropdown__item-icon"><MapPin /></div>
                      <div className="wm-dropdown__item-body">
                        <span className="wm-dropdown__item-name">{loc.name}</span>
                        <span className="wm-dropdown__item-sub">{loc.specialty}</span>
                      </div>
                      <span className="wm-dropdown__item-arrow">→</span>
                    </Link>
                  ))}
                </div>
                <div className="wm-dropdown__footer">
                  <Link to="/order" className="wm-dropdown__footer-link" onClick={() => setMenuOpen(false)}>
                    View Full Menu &amp; Order Online →
                  </Link>
                </div>
              </div>
            </div>

            {NAV_LINKS.filter((l) => l.to !== "/").map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="wm-nav__link"
                activeProps={{ className: "wm-nav__link wm-nav__link--active" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="wm-header__actions">
            <Link to="/order" className="wm-cta">
              <ShoppingBag className="wm-cta__icon" />
              <span>Order Now</span>
            </Link>

            <button
              className={`wm-hamburger${open ? " wm-hamburger--open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              <span className="wm-hamburger__bar" />
              <span className="wm-hamburger__bar" />
              <span className="wm-hamburger__bar" />
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <div className={`wm-drawer${open ? " wm-drawer--open" : ""}`} aria-hidden={!open}>
          <div className="wm-drawer__inner">
            <div className="wm-drawer__section">
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="wm-drawer__link" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="wm-drawer__section">
              <div className="wm-drawer__section-label">
                <MapPin className="wm-drawer__section-icon" />
                Our Locations
              </div>
              {LOCATIONS.map((loc) => (
                <Link
                  key={loc.slug}
                  to="/menu/$location"
                  params={{ location: loc.slug }}
                  className="wm-drawer__loc"
                  onClick={() => setOpen(false)}
                >
                  <div>
                    <div className="wm-drawer__loc-name">{loc.name}</div>
                    <div className="wm-drawer__loc-sub">{loc.specialty}</div>
                  </div>
                  <span className="wm-drawer__loc-arrow">→</span>
                </Link>
              ))}
            </div>
            <Link to="/order" className="wm-cta wm-cta--full" onClick={() => setOpen(false)}>
              <ShoppingBag className="wm-cta__icon" />
              <span>Order Now</span>
            </Link>
          </div>
        </div>

        {open && <div className="wm-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}
      </header>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── HEADER SHELL ── */
        .wm-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #0f0e0d;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .wm-header--scrolled {
          background: rgba(15,14,13,0.55);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-bottom-color: rgba(255,255,255,0.1);
          box-shadow: 0 2px 32px rgba(0,0,0,0.4);
        }
        .wm-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
          height: 72px;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .wm-header__inner { padding: 0 40px; }
        }

        /* ── LOGO ── */
        .wm-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          text-decoration: none;
        }
        .wm-logo__img {
          height: 52px;
          width: auto;
          display: block;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transition: filter 0.35s ease, transform 0.35s cubic-bezier(.34,1.56,.64,1);
        }
        .wm-logo:hover .wm-logo__img {
          filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(217,119,6,0.9)) drop-shadow(0 0 20px rgba(217,119,6,0.5));
          transform: scale(1.06);
        }

        /* ── DESKTOP NAV ── */
        .wm-nav {
          display: none;
          align-items: center;
          gap: 0;
          flex: 1;
          justify-content: center;
        }
        @media (min-width: 1024px) {
          .wm-nav { display: flex; }
        }
        .wm-nav__link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          letter-spacing: 0.03em;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
          border-radius: 0;
        }
        .wm-nav__link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 16px;
          right: 16px;
          height: 1px;
          background: #d97706;
          transform: scaleX(0);
          transition: transform 0.22s ease;
        }
        .wm-nav__link:hover {
          color: #ffffff;
        }
        .wm-nav__link:hover::after {
          transform: scaleX(1);
        }
        .wm-nav__link--active {
          color: #ffffff;
        }
        .wm-nav__link--active::after {
          transform: scaleX(1);
        }

        /* ── DROPDOWN ── */
        .wm-dropdown { position: relative; }
        .wm-dropdown__chevron {
          width: 14px;
          height: 14px;
          transition: transform 0.22s ease;
          opacity: 0.6;
        }
        .wm-dropdown__chevron--open { transform: rotate(180deg); }

        .wm-dropdown__panel {
          position: absolute;
          top: calc(100% + 1px);
          left: 50%;
          transform: translateX(-50%) translateY(-4px);
          width: 290px;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.1);
          border-top: 2px solid #d97706;
          border-radius: 0 0 10px 10px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.18);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
          overflow: hidden;
        }
        .wm-dropdown__panel--open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .wm-dropdown__header {
          padding: 12px 18px 8px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9ca3af;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .wm-dropdown__list { padding: 4px 0; }
        .wm-dropdown__item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 18px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .wm-dropdown__item:hover { background: #faf8f5; }
        .wm-dropdown__item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: rgba(217,119,6,0.1);
          color: #d97706;
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .wm-dropdown__item-icon svg { width: 14px; height: 14px; }
        .wm-dropdown__item:hover .wm-dropdown__item-icon {
          background: #d97706;
          color: #fff;
        }
        .wm-dropdown__item-body { flex: 1; min-width: 0; }
        .wm-dropdown__item-name {
          display: block;
          font-size: 13.5px;
          font-weight: 600;
          color: #111;
          font-family: 'Playfair Display', Georgia, serif;
        }
        .wm-dropdown__item-sub {
          display: block;
          font-size: 11.5px;
          color: #9ca3af;
          margin-top: 1px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .wm-dropdown__item-arrow {
          font-size: 13px;
          color: #d97706;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .wm-dropdown__item:hover .wm-dropdown__item-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .wm-dropdown__footer {
          border-top: 1px solid rgba(0,0,0,0.06);
          padding: 10px 18px;
          text-align: center;
        }
        .wm-dropdown__footer-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #d97706;
          text-decoration: none;
          transition: color 0.15s;
        }
        .wm-dropdown__footer-link:hover { color: #b45309; }

        /* ── CTA ── */
        .wm-header__actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .wm-cta {
          display: none;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          background: #d97706;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 6px;
          text-decoration: none;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.15s;
        }
        .wm-cta:hover {
          background: #b45309;
          transform: translateY(-1px);
        }
        .wm-cta:active { transform: translateY(0); }
        .wm-cta--full {
          display: inline-flex !important;
          width: 100%;
          justify-content: center;
          border-radius: 8px;
          padding: 13px 20px;
          font-size: 14px;
          margin-top: 4px;
        }
        .wm-cta__icon { width: 16px; height: 16px; flex-shrink: 0; }
        @media (min-width: 640px) { .wm-cta { display: inline-flex; } }

        /* ── HAMBURGER ── */
        .wm-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent;
          cursor: pointer;
          padding: 0;
          transition: border-color 0.2s, background 0.2s;
        }
        .wm-hamburger:hover {
          border-color: rgba(217,119,6,0.5);
          background: rgba(217,119,6,0.08);
        }
        @media (min-width: 1024px) { .wm-hamburger { display: none; } }
        .wm-hamburger__bar {
          display: block;
          width: 18px;
          height: 1.5px;
          border-radius: 2px;
          background: rgba(255,255,255,0.8);
          transition: transform 0.26s cubic-bezier(.34,1.56,.64,1), opacity 0.2s;
          transform-origin: center;
        }
        .wm-hamburger--open .wm-hamburger__bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .wm-hamburger--open .wm-hamburger__bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .wm-hamburger--open .wm-hamburger__bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── MOBILE DRAWER ── */
        .wm-drawer {
          display: none;
          position: fixed;
          top: 0;
          right: 0;
          height: 100dvh;
          width: min(300px, 85vw);
          background: #0f0e0d;
          z-index: 200;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          box-shadow: -12px 0 48px rgba(0,0,0,0.5);
          overflow-y: auto;
          border-left: 1px solid rgba(255,255,255,0.07);
        }
        @media (max-width: 1023px) { .wm-drawer { display: block; } }
        .wm-drawer--open { transform: translateX(0); }

        .wm-drawer__inner {
          padding: 88px 20px 32px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 100%;
        }
        .wm-drawer__section {
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 4px;
        }
        .wm-drawer__section-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          padding: 6px 10px;
        }
        .wm-drawer__section-icon { width: 12px; height: 12px; }
        .wm-drawer__link {
          display: block;
          padding: 10px 10px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .wm-drawer__link:hover {
          background: rgba(255,255,255,0.06);
          color: #ffffff;
        }
        .wm-drawer__loc {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 10px;
          border-radius: 6px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .wm-drawer__loc:hover { background: rgba(255,255,255,0.06); }
        .wm-drawer__loc-name {
          font-size: 13.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          font-family: 'Playfair Display', Georgia, serif;
        }
        .wm-drawer__loc-sub {
          font-size: 11.5px;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }
        .wm-drawer__loc-arrow { font-size: 12px; color: #d97706; opacity: 0.7; }

        /* ── OVERLAY ── */
        .wm-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 190;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(2px);
          animation: wmFadeIn 0.22s ease forwards;
        }
        @media (max-width: 1023px) { .wm-overlay { display: block; } }
        @keyframes wmFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}