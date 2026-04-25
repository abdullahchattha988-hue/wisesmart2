import { lazy, Suspense, useEffect, useState } from "react";

const FloatingFoodScene = lazy(() =>
  import("@/components/three/FloatingFoodScene").then((m) => ({ default: m.FloatingFoodScene })),
);

/** Lazy, client-only Three.js wrapper. Falls back to a warm gradient. */
export function SceneBackground({
  density = "med",
  className = "",
}: {
  density?: "low" | "med" | "high";
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Lightweight fallback for low-end devices
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowMem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (reduce || (typeof lowMem === "number" && lowMem <= 2)) setEnabled(false);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ background: "var(--gradient-hero)" }}
    >
      {mounted && enabled && (
        <Suspense fallback={null}>
          <FloatingFoodScene className="absolute inset-0 h-full w-full" density={density} />
        </Suspense>
      )}
    </div>
  );
}
