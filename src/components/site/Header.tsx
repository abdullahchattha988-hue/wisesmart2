import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, MapPin, ShoppingBag, ArrowRight } from "lucide-react";
import { LOCATIONS, NAV_LINKS } from "@/data/site";
import logo from "@/assets/logo.png";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface NavLinkItem {
  to: string;
  label: string;
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

interface HamburgerProps {
  open: boolean;
  onToggle: () => void;
}

function Hamburger({ open, onToggle }: HamburgerProps) {
  return (
    <button
      className={`wm-hamburger${open ? " wm-hamburger--open" : ""}`}
      onClick={onToggle}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      aria-controls="wm-drawer"
    >
      <span className="wm-hamburger__bar" />
      <span className="wm-hamburger__bar" />
      <span className="wm-hamburger__bar" />
    </button>
  );
}

interface LocationDropdownProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onLinkClick: () => void;
}

function LocationDropdown({ open, onOpen, onClose, onLinkClick }: LocationDropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  /* keyboard: Escape closes, arrow keys navigate items */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
      if (e.key === "ArrowDown" && open) {
        e.preventDefault();
        (panelRef.current?.querySelector("[role='menuitem']") as HTMLElement)?.focus();
      }
    },
    [open, onClose],
  );

  return (
    <div
      className="wm-dropdown"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onKeyDown={onKeyDown}
    >
      <button
        ref={triggerRef}
        className={`wm-nav__link wm-dropdown__trigger${open ? " wm-nav__link--active" : ""}`}
        onClick={() => (open ? onClose() : onOpen())}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="wm-location-menu"
      >
        Menu
        <ChevronDown className={`wm-dropdown__chevron${open ? " wm-dropdown__chevron--open" : ""}`} aria-hidden="true" />
      </button>

      <div
        id="wm-location-menu"
        ref={panelRef}
        className={`wm-dropdown__panel${open ? " wm-dropdown__panel--open" : ""}`}
        role="menu"
        aria-label="Location menus"
      >
        {/* panel top bar */}
        <div className="wm-dropdown__top-bar" />

        <div className="wm-dropdown__header">Choose a Location</div>

        <div className="wm-dropdown__list">
          {LOCATIONS.map((loc, i) => (
            <Link
              key={loc.slug}
              to="/menu/$location"
              params={{ location: loc.slug }}
              className="wm-dropdown__item"
              role="menuitem"
              style={{ "--item-delay": `${i * 45}ms` } as React.CSSProperties}
              onClick={() => { onLinkClick(); onClose(); }}
            >
              <div className="wm-dropdown__item-icon" aria-hidden="true">
                <MapPin />
              </div>
              <div className="wm-dropdown__item-body">
                <span className="wm-dropdown__item-name">{loc.name}</span>
                <span className="wm-dropdown__item-sub">{loc.specialty}</span>
              </div>
              <ArrowRight className="wm-dropdown__item-arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <div className="wm-dropdown__footer">
          <Link
            to="/order"
            className="wm-dropdown__footer-cta"
            onClick={() => { onLinkClick(); onClose(); }}
          >
            <span>Order Online</span>
            <ArrowRight style={{ width: 12, height: 12 }} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Header
───────────────────────────────────────────── */

export function Header() {
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [atTop,        setAtTop]        = useState(true);

  /* scroll detection — dual state: "scrolled a bit" + "at very top" */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setAtTop(y < 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close drawer on desktop resize */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setDrawerOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  /* close drawer on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const closeAll = useCallback(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
  }, []);

  return (
    <>
      <header
        className={[
          "wm-header",
          scrolled  ? "wm-header--scrolled" : "",
          atTop     ? "wm-header--top"      : "",
        ].filter(Boolean).join(" ")}
        role="banner"
      >
        <div className="wm-header__inner">

          {/* ── Logo ── */}
          <Link to="/" className="wm-logo" aria-label="Wise Mart — Home" onClick={closeAll}>
            <img src={logo} alt="Wise Mart" className="wm-logo__img" width={120} height={52} />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="wm-nav" aria-label="Main navigation">
            <Link
              to="/"
              className="wm-nav__link"
              activeProps={{ className: "wm-nav__link wm-nav__link--active" }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>

            <LocationDropdown
              open={dropdownOpen}
              onOpen={()  => setDropdownOpen(true)}
              onClose={()  => setDropdownOpen(false)}
              onLinkClick={closeAll}
            />

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

          {/* ── Right Actions ── */}
          <div className="wm-header__actions">
            <Link to="/order" className="wm-order-cta" aria-label="Order now">
              <ShoppingBag className="wm-order-cta__icon" aria-hidden="true" />
              <span>Order Now</span>
            </Link>

            <Hamburger open={drawerOpen} onToggle={() => setDrawerOpen((v) => !v)} />
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <nav
          id="wm-drawer"
          className={`wm-drawer${drawerOpen ? " wm-drawer--open" : ""}`}
          aria-label="Mobile navigation"
          aria-hidden={!drawerOpen}
          inert={!drawerOpen ? ("" as unknown as boolean) : undefined}
        >
          <div className="wm-drawer__inner">

            {/* primary links */}
            <div className="wm-drawer__group">
              {(NAV_LINKS as unknown as NavLinkItem[]).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="wm-drawer__link"
                  activeProps={{ className: "wm-drawer__link wm-drawer__link--active" }}
                  activeOptions={l.to === "/" ? { exact: true } : undefined}
                  onClick={() => setDrawerOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* locations */}
            <div className="wm-drawer__group">
              <div className="wm-drawer__group-label">
                <MapPin aria-hidden="true" />
                Our Locations
              </div>
              {LOCATIONS.map((loc) => (
                <Link
                  key={loc.slug}
                  to="/menu/$location"
                  params={{ location: loc.slug }}
                  className="wm-drawer__loc-item"
                  onClick={() => setDrawerOpen(false)}
                >
                  <div className="wm-drawer__loc-dot" aria-hidden="true" />
                  <div className="wm-drawer__loc-body">
                    <span className="wm-drawer__loc-name">{loc.name}</span>
                    <span className="wm-drawer__loc-sub">{loc.specialty}</span>
                  </div>
                  <ArrowRight className="wm-drawer__loc-arrow" aria-hidden="true" />
                </Link>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/order"
              className="wm-drawer__cta"
              onClick={() => setDrawerOpen(false)}
            >
              <ShoppingBag aria-hidden="true" />
              Order Now
            </Link>

          </div>
        </nav>

        {/* scrim */}
        {drawerOpen && (
          <div
            className="wm-scrim"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}
      </header>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        /* ══════════════════════════════
           TOKENS (scoped to header)
        ══════════════════════════════ */
        .wm-header {
          --hd-amber:        #c8590a;
          --hd-amber-mid:    #d96b18;
          --hd-amber-glow:   rgba(200,89,10,0.28);
          --hd-amber-pale:   rgba(200,89,10,0.10);
          --hd-amber-border: rgba(200,89,10,0.28);

          --hd-bg:           #0a0806;
          --hd-bg-blur:      rgba(10,8,6,0.62);
          --hd-border:       rgba(240,235,228,0.07);
          --hd-border-mid:   rgba(240,235,228,0.12);

          --hd-text:         rgba(240,235,228,0.92);
          --hd-text-dim:     rgba(240,235,228,0.50);
          --hd-text-faint:   rgba(240,235,228,0.26);

          --hd-radius-sm:    7px;
          --hd-radius-md:    12px;
          --hd-radius-lg:    18px;

          --hd-ease-out:     cubic-bezier(0.22,1,0.36,1);
          --hd-ease-spring:  cubic-bezier(0.34,1.56,0.64,1);

          /* structure */
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;

          background: var(--hd-bg);
          border-bottom: 1px solid var(--hd-border);
          transition:
            background 0.45s ease,
            border-color 0.45s ease,
            box-shadow 0.45s ease;
        }

        .wm-header--scrolled {
          background: var(--hd-bg-blur);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border-bottom-color: var(--hd-border-mid);
          box-shadow:
            0 1px 0 rgba(240,235,228,0.04),
            0 4px 40px rgba(0,0,0,0.55);
        }

        /* ── inner layout ── */
        .wm-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1360px;
          margin: 0 auto;
          padding: 0 28px;
          height: 70px;
          gap: 12px;
        }
        @media (min-width: 768px)  { .wm-header__inner { padding: 0 48px; } }
        @media (min-width: 1280px) { .wm-header__inner { padding: 0 72px; } }

        /* ════════════════════════════
           LOGO
        ════════════════════════════ */
        .wm-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          text-decoration: none;
          outline-offset: 4px;
        }
        .wm-logo__img {
          height: 48px;
          width: auto;
          display: block;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transition:
            filter 0.38s ease,
            transform 0.38s var(--hd-ease-spring);
          will-change: filter, transform;
        }
        .wm-logo:hover .wm-logo__img {
          filter:
            brightness(0) invert(1)
            drop-shadow(0 0 6px rgba(200,89,10,0.9))
            drop-shadow(0 0 18px rgba(200,89,10,0.45));
          transform: scale(1.05);
        }

        /* ════════════════════════════
           DESKTOP NAV
        ════════════════════════════ */
        .wm-nav {
          display: none;
          align-items: center;
          flex: 1;
          justify-content: center;
          gap: 2px;
        }
        @media (min-width: 1024px) { .wm-nav { display: flex; } }

        .wm-nav__link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 8px 15px;
          font-size: 13px;
          font-weight: 500;
          color: var(--hd-text-dim);
          text-decoration: none;
          letter-spacing: 0.035em;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: var(--hd-radius-sm);
          transition: color 0.22s ease, background 0.22s ease;
          white-space: nowrap;
          /* no underline trick — use ::after for the indicator */
        }
        /* hover fill */
        .wm-nav__link::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--hd-radius-sm);
          background: rgba(240,235,228,0.0);
          transition: background 0.22s ease;
        }
        /* bottom indicator */
        .wm-nav__link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 15px;
          right: 15px;
          height: 1.5px;
          border-radius: 2px;
          background: var(--hd-amber);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.26s var(--hd-ease-out);
        }
        .wm-nav__link:hover {
          color: var(--hd-text);
        }
        .wm-nav__link:hover::before {
          background: rgba(240,235,228,0.05);
        }
        .wm-nav__link:hover::after,
        .wm-nav__link--active::after {
          transform: scaleX(1);
        }
        .wm-nav__link--active {
          color: var(--hd-text);
        }
        .wm-nav__link--active::before {
          background: rgba(240,235,228,0.04);
        }

        /* ════════════════════════════
           DROPDOWN
        ════════════════════════════ */
        .wm-dropdown { position: relative; }

        .wm-dropdown__trigger { /* inherits .wm-nav__link */ }

        .wm-dropdown__chevron {
          width: 13px;
          height: 13px;
          opacity: 0.55;
          flex-shrink: 0;
          transition: transform 0.26s var(--hd-ease-out), opacity 0.22s;
        }
        .wm-dropdown__chevron--open {
          transform: rotate(180deg);
          opacity: 0.85;
        }

        /* panel */
        .wm-dropdown__panel {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(-6px);
          width: 300px;

          background: #ffffff;
          border-radius: var(--hd-radius-md);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.08),
            0 4px 8px rgba(0,0,0,0.06),
            0 20px 56px rgba(0,0,0,0.18);

          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 0.22s ease,
            transform 0.22s var(--hd-ease-out),
            visibility 0.22s;
        }
        .wm-dropdown__panel--open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        /* amber top accent */
        .wm-dropdown__top-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--hd-amber), #e8a030);
        }
        .wm-dropdown__header {
          padding: 12px 20px 9px;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #9ca3af;
        }
        .wm-dropdown__list { padding: 4px 8px; }

        .wm-dropdown__item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 9px;
          text-decoration: none;
          transition: background 0.18s ease;
          /* staggered reveal when panel opens */
          opacity: 0;
          transform: translateY(4px);
          animation: none;
        }
        .wm-dropdown__panel--open .wm-dropdown__item {
          animation: dropItemIn 0.32s var(--hd-ease-out) forwards;
          animation-delay: var(--item-delay, 0ms);
        }
        @keyframes dropItemIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .wm-dropdown__item:hover { background: #faf7f3; }
        .wm-dropdown__item:focus-visible {
          outline: 2px solid var(--hd-amber);
          outline-offset: -2px;
          background: #faf7f3;
        }

        .wm-dropdown__item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(200,89,10,0.09);
          color: var(--hd-amber);
          flex-shrink: 0;
          transition:
            background 0.18s ease,
            color 0.18s ease,
            transform 0.32s var(--hd-ease-spring);
        }
        .wm-dropdown__item-icon svg { width: 14px; height: 14px; }
        .wm-dropdown__item:hover .wm-dropdown__item-icon {
          background: var(--hd-amber);
          color: #fff;
          transform: scale(1.1) rotate(-6deg);
        }

        .wm-dropdown__item-body { flex: 1; min-width: 0; }
        .wm-dropdown__item-name {
          display: block;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
        }
        .wm-dropdown__item-sub {
          display: block;
          font-size: 11px;
          color: #9ca3af;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 400;
        }

        .wm-dropdown__item-arrow {
          width: 14px;
          height: 14px;
          color: var(--hd-amber);
          opacity: 0;
          transform: translateX(-5px);
          transition: opacity 0.18s ease, transform 0.24s var(--hd-ease-out);
          flex-shrink: 0;
        }
        .wm-dropdown__item:hover .wm-dropdown__item-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .wm-dropdown__footer {
          border-top: 1px solid rgba(0,0,0,0.06);
          padding: 12px 20px;
        }
        .wm-dropdown__footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--hd-amber);
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: gap 0.26s var(--hd-ease-out), color 0.2s;
        }
        .wm-dropdown__footer-cta:hover {
          gap: 10px;
          color: #a84e08;
        }

        /* ════════════════════════════
           RIGHT ACTIONS
        ════════════════════════════ */
        .wm-header__actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* Order CTA button */
        .wm-order-cta {
          display: none;
          align-items: center;
          gap: 7px;
          padding: 9px 22px;
          background: var(--hd-amber);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: var(--hd-radius-sm);
          text-decoration: none;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          transition:
            background 0.25s ease,
            transform 0.25s var(--hd-ease-spring),
            box-shadow 0.25s ease;
        }
        /* shimmer on hover */
        .wm-order-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .wm-order-cta:hover {
          background: #a84e08;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(200,89,10,0.42);
        }
        .wm-order-cta:hover::before { opacity: 1; }
        .wm-order-cta:active { transform: translateY(0); }

        .wm-order-cta__icon { width: 15px; height: 15px; flex-shrink: 0; }

        @media (min-width: 580px) { .wm-order-cta { display: inline-flex; } }

        /* ════════════════════════════
           HAMBURGER
        ════════════════════════════ */
        .wm-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          border-radius: var(--hd-radius-sm);
          border: 1px solid var(--hd-border-mid);
          background: transparent;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          transition:
            border-color 0.22s ease,
            background 0.22s ease;
        }
        .wm-hamburger:hover {
          border-color: var(--hd-amber-border);
          background: var(--hd-amber-pale);
        }
        .wm-hamburger:focus-visible {
          outline: 2px solid var(--hd-amber);
          outline-offset: 2px;
        }
        @media (min-width: 1024px) { .wm-hamburger { display: none; } }

        .wm-hamburger__bar {
          display: block;
          width: 18px;
          height: 1.5px;
          border-radius: 2px;
          background: rgba(240,235,228,0.75);
          transition:
            transform 0.3s var(--hd-ease-spring),
            opacity 0.2s ease,
            width 0.25s ease;
          transform-origin: center;
        }
        .wm-hamburger--open .wm-hamburger__bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .wm-hamburger--open .wm-hamburger__bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .wm-hamburger--open .wm-hamburger__bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ════════════════════════════
           MOBILE DRAWER
        ════════════════════════════ */
        .wm-drawer {
          display: block;
          position: fixed;
          top: 0;
          right: 0;
          height: 100dvh;
          width: min(320px, 88vw);
          background: #0c0a08;
          z-index: 200;
          transform: translateX(105%);
          transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -16px 0 60px rgba(0,0,0,0.6);
          overflow-y: auto;
          overflow-x: hidden;
          border-left: 1px solid rgba(240,235,228,0.06);
          overscroll-behavior: contain;
        }
        @media (min-width: 1024px) { .wm-drawer { display: none; } }
        .wm-drawer--open { transform: translateX(0); }

        .wm-drawer__inner {
          padding: 90px 20px 36px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 100%;
        }

        /* group */
        .wm-drawer__group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(240,235,228,0.06);
          margin-bottom: 6px;
        }
        .wm-drawer__group:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .wm-drawer__group-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240,235,228,0.28);
          padding: 4px 12px 8px;
        }
        .wm-drawer__group-label svg { width: 11px; height: 11px; }

        /* primary links */
        .wm-drawer__link {
          display: block;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(240,235,228,0.62);
          text-decoration: none;
          transition: background 0.18s ease, color 0.18s ease;
          letter-spacing: 0.01em;
        }
        .wm-drawer__link:hover {
          background: rgba(240,235,228,0.06);
          color: rgba(240,235,228,0.92);
        }
        .wm-drawer__link--active {
          color: var(--hd-amber);
          background: var(--hd-amber-pale);
        }

        /* location items */
        .wm-drawer__loc-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 9px;
          text-decoration: none;
          transition: background 0.18s ease;
        }
        .wm-drawer__loc-item:hover {
          background: rgba(240,235,228,0.06);
        }
        .wm-drawer__loc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--hd-amber);
          flex-shrink: 0;
          box-shadow: 0 0 8px var(--hd-amber-glow);
        }
        .wm-drawer__loc-body { flex: 1; min-width: 0; }
        .wm-drawer__loc-name {
          display: block;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px;
          font-weight: 700;
          color: rgba(240,235,228,0.88);
          line-height: 1.2;
        }
        .wm-drawer__loc-sub {
          display: block;
          font-size: 11px;
          color: rgba(240,235,228,0.32);
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .wm-drawer__loc-arrow {
          width: 13px;
          height: 13px;
          color: var(--hd-amber);
          opacity: 0.5;
          flex-shrink: 0;
          transition: opacity 0.18s, transform 0.24s var(--hd-ease-out);
        }
        .wm-drawer__loc-item:hover .wm-drawer__loc-arrow {
          opacity: 1;
          transform: translateX(3px);
        }

        /* drawer CTA */
        .wm-drawer__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px 24px;
          margin-top: auto;
          background: var(--hd-amber);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: var(--hd-radius-md);
          text-decoration: none;
          transition: background 0.22s ease, box-shadow 0.22s ease;
        }
        .wm-drawer__cta svg { width: 15px; height: 15px; }
        .wm-drawer__cta:hover {
          background: #a84e08;
          box-shadow: 0 8px 28px rgba(200,89,10,0.4);
        }

        /* ════════════════════════════
           SCRIM
        ════════════════════════════ */
        .wm-scrim {
          position: fixed;
          inset: 0;
          z-index: 190;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          animation: scrimIn 0.28s ease forwards;
        }
        @keyframes scrimIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (min-width: 1024px) { .wm-scrim { display: none; } }

        /* ════════════════════════════
           REDUCED MOTION
        ════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          .wm-header,
          .wm-logo__img,
          .wm-nav__link::after,
          .wm-order-cta,
          .wm-hamburger__bar,
          .wm-drawer,
          .wm-dropdown__panel,
          .wm-dropdown__item,
          .wm-dropdown__item-icon,
          .wm-dropdown__item-arrow,
          .wm-scrim {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}