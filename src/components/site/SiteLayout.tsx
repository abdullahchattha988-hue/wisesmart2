import { Header } from "./Header";
import { Footer } from "./Footer";
import { Link } from "@tanstack/react-router";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* sticky mobile order CTA */}
      <Link
        to="/order"
        className="fixed bottom-4 right-4 z-40 inline-flex h-12 items-center justify-center rounded-full px-5 font-semibold text-primary-foreground shadow-warm sm:hidden shimmer-cta"
      >
        Order Now
      </Link>
    </div>
  );
}
