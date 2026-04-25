import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { LOCATIONS, type LocationSlug } from "@/data/site";
import { MenuPage } from "@/components/site/MenuPage";

export const Route = createFileRoute("/menu/$location")({
  loader: ({ params }) => {
    const loc = LOCATIONS.find((l) => l.slug === params.location);
    if (!loc) throw notFound();
    return { loc };
  },
  head: ({ loaderData }) => {
    const loc = loaderData?.loc;
    if (!loc) return { meta: [{ title: "Menu — Wise Mart" }] };
    return {
      meta: [
        { title: `${loc.name} Menu — Wise Mart | ${loc.specialty}` },
        { name: "description", content: `Full ${loc.name}, MD menu: pizza, fried chicken, hot subs, salads, sides, and breakfast. Call ${loc.phone}.` },
        { property: "og:title", content: `${loc.name} Menu — Wise Mart` },
        { property: "og:description", content: loc.tagline },
      ],
    };
  },
  component: MenuRoute,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <h1 className="font-display text-4xl font-bold">Menu not found</h1>
      <p className="mt-3 text-muted-foreground">That location doesn't exist.</p>
      <Link to="/locations" className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground">See all locations</Link>
    </div>
  ),
});

function MenuRoute() {
  const { loc } = Route.useLoaderData();
  return <MenuPage slug={loc.slug as LocationSlug} />;
}
