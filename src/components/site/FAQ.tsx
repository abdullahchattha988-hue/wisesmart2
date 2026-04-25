import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, HelpCircle } from "lucide-react";

export type FAQItem = { q: string; a: string };

export function FAQ({ items, title = "Frequently Asked Questions", subtitle }: { items: FAQItem[]; title?: string; subtitle?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          <HelpCircle className="h-3.5 w-3.5" /> FAQ
        </span>
        <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </motion.div>

      <div className="mt-10 space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.35, delay: i * 0.04 }}
              className={`overflow-hidden rounded-2xl border transition-all ${isOpen ? "border-primary bg-card shadow-warm" : "border-border bg-card shadow-soft"}`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-display text-base font-semibold md:text-lg">{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                >
                  <Plus className="h-4 w-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
