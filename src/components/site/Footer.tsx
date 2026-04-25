import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { LOCATIONS, SITE } from "@/data/site";
import logo from "@/assets/logo.png";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="wm-footer">
        <div className="wm-footer__inner">

          {/* ── BRAND ── */}
          <div className="wm-footer__col wm-footer__col--brand">
            <Link to="/" aria-label="Wise Mart — Home" className="wm-footer__logo-link">
              <img src={logo} alt="Wise Mart" className="wm-footer__logo" />
            </Link>
            <p className="wm-footer__tagline">
              Fresh, delicious food crafted with passion. Experience the best taste at Wise Mart.
            </p>
            <div className="wm-footer__social">
              <a href="#" className="wm-footer__social-link" aria-label="Instagram"><Instagram /></a>
              <a href="#" className="wm-footer__social-link" aria-label="Facebook"><Facebook /></a>
              <a href="#" className="wm-footer__social-link" aria-label="Twitter"><Twitter /></a>
            </div>
          </div>

          {/* ── QUICK LINKS ── */}
          <div className="wm-footer__col">
            <div className="wm-footer__heading">Quick Links</div>
            <nav className="wm-footer__links">
              <Link to="/" className="wm-footer__link">Home</Link>
              <Link to="/locations" className="wm-footer__link">Locations</Link>
              <Link to="/order" className="wm-footer__link">Order Now</Link>
              <Link to="/about" className="wm-footer__link">About</Link>
              <Link to="/faq" className="wm-footer__link">FAQ</Link>
              <Link to="/contact" className="wm-footer__link">Contact</Link>
            </nav>
          </div>

          {/* ── LOCATIONS ── */}
          <div className="wm-footer__col">
            <div className="wm-footer__heading">Our Locations</div>
            <div className="wm-footer__locations">
              {LOCATIONS.map((loc) => (
                <Link
                  key={loc.slug}
                  to="/menu/$location"
                  params={{ location: loc.slug as any }}
                  className="wm-footer__location"
                >
                  <div className="wm-footer__location-pin"><MapPin /></div>
                  <div>
                    <div className="wm-footer__location-name">{loc.name}</div>
                    <div className="wm-footer__location-sub">{loc.specialty}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── CONTACT ── */}
          <div className="wm-footer__col">
            <div className="wm-footer__heading">Get In Touch</div>
            <div className="wm-footer__contact">

              <div className="wm-footer__contact-group">
                <div className="wm-footer__contact-label">Email</div>
                <a href="mailto:info@wisemart2.com" className="wm-footer__contact-row">
                  <Mail className="wm-footer__contact-icon" />
                  <span>info@wisemart2.com</span>
                </a>
              </div>

              <div className="wm-footer__contact-divider" />

              <div className="wm-footer__contact-group">
                <div className="wm-footer__contact-label">Phone</div>
                <a href="tel:+14108833648" className="wm-footer__contact-row">
                  <Phone className="wm-footer__contact-icon" />
                  <span>+1 410 883 3648</span>
                </a>
                <a href="tel:+14109436270" className="wm-footer__contact-row">
                  <Phone className="wm-footer__contact-icon" />
                  <span>+1 410 943 6270</span>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="wm-footer__bottom">
          <span>© {year} {SITE.name}. All rights reserved.</span>
          <div className="wm-footer__bottom-links">
            <a href="#" className="wm-footer__bottom-link">Privacy Policy</a>
            <span className="wm-footer__bottom-dot" />
            <a href="#" className="wm-footer__bottom-link">Terms of Service</a>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .wm-footer {
          background: #0f0e0d;
          border-top: 1px solid rgba(255,255,255,0.07);
          font-family: 'DM Sans', sans-serif;
        }
        .wm-footer__inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px 32px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 28px 48px;
        }
        @media (min-width: 640px) {
          .wm-footer__inner { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .wm-footer__inner {
            grid-template-columns: 2fr 1fr 1.4fr 1fr;
            padding: 72px 40px 56px;
          }
        }

        /* ── BRAND ── */
        .wm-footer__logo-link {
          display: inline-flex;
          text-decoration: none;
        }
        .wm-footer__logo {
          height: 48px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transition: filter 0.35s ease, transform 0.35s cubic-bezier(.34,1.56,.64,1);
          display: block;
        }
        .wm-footer__logo-link:hover .wm-footer__logo {
          filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(217,119,6,0.9)) drop-shadow(0 0 20px rgba(217,119,6,0.5));
          transform: scale(1.05);
        }
        .wm-footer__tagline {
          margin-top: 18px;
          font-size: 13.5px;
          line-height: 1.75;
          color: rgba(255,255,255,0.38);
          max-width: 260px;
        }
        .wm-footer__social {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
        }
        .wm-footer__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .wm-footer__social-link svg { width: 15px; height: 15px; }
        .wm-footer__social-link:hover {
          border-color: #d97706;
          color: #d97706;
          background: rgba(217,119,6,0.08);
        }

        /* ── COLUMNS ── */
        .wm-footer__heading {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 20px;
        }

        /* ── LINKS ── */
        .wm-footer__links {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .wm-footer__link {
          font-size: 13.5px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.18s, padding-left 0.18s;
          display: inline-block;
        }
        .wm-footer__link:hover {
          color: #ffffff;
          padding-left: 5px;
        }

        /* ── LOCATIONS ── */
        .wm-footer__locations {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .wm-footer__location {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          text-decoration: none;
        }
        .wm-footer__location-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(217,119,6,0.1);
          color: #d97706;
          flex-shrink: 0;
          margin-top: 1px;
          transition: background 0.18s;
        }
        .wm-footer__location:hover .wm-footer__location-pin {
          background: rgba(217,119,6,0.2);
        }
        .wm-footer__location-pin svg { width: 13px; height: 13px; }
        .wm-footer__location-name {
          font-size: 13.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          font-family: 'Playfair Display', Georgia, serif;
          line-height: 1.3;
          transition: color 0.18s;
        }
        .wm-footer__location:hover .wm-footer__location-name { color: #ffffff; }
        .wm-footer__location-sub {
          font-size: 11.5px;
          color: rgba(255,255,255,0.28);
          margin-top: 3px;
        }

        /* ── CONTACT ── */
        .wm-footer__contact {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .wm-footer__contact-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .wm-footer__contact-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }
        .wm-footer__contact-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 16px 0;
        }
        .wm-footer__contact-row {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.5);
          font-size: 13.5px;
          transition: color 0.18s;
        }
        .wm-footer__contact-row:hover { color: #ffffff; }
        .wm-footer__contact-icon {
          width: 14px;
          height: 14px;
          color: #d97706;
          flex-shrink: 0;
        }

        /* ── BOTTOM BAR ── */
        .wm-footer__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 20px 28px 28px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 12px;
          color: rgba(255,255,255,0.22);
        }
        @media (min-width: 768px) {
          .wm-footer__bottom { padding: 20px 40px 28px; }
        }
        .wm-footer__bottom-links {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .wm-footer__bottom-link {
          font-size: 12px;
          color: rgba(255,255,255,0.22);
          text-decoration: none;
          transition: color 0.18s;
        }
        .wm-footer__bottom-link:hover { color: rgba(255,255,255,0.55); }
        .wm-footer__bottom-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}