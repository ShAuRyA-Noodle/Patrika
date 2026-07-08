"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMotion } from "@/lib/motion/context";
import { houseEase } from "@/lib/motion/useStaggerReveal";

const LINKS = [
  { label: "the poems", target: "#archive" },
  { label: "the poet", target: "#about" },
  { label: "contact", target: "#contact" },
];

export default function Nav() {
  const { lenis, reduce } = useMotion();
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (target?: string) => {
    setOpen(false);
    const el = target ? (document.querySelector(target) as HTMLElement | null) : null;
    if (target && !el) return;
    if (lenis)
      lenis.scrollTo(el ?? 0, {
        offset: el ? -72 : 0,
        duration: reduce ? 0 : 1.9,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    else if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <nav
        aria-label="Primary"
        className={
          "fixed inset-x-0 top-0 z-40 border-b transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
          "border-[color:var(--c-rule)] bg-[color-mix(in_srgb,var(--c-paper)_82%,transparent)] backdrop-blur-md " +
          (shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0")
        }
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3.5 md:px-12">
          <button
            type="button"
            data-ink
            onClick={() => go()}
            aria-label="पत्रिका, back to top"
            className="text-2xl leading-none text-[color:var(--c-ink)] transition-opacity hover:opacity-70"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            पत्रिका
          </button>

          <div className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.target}
                type="button"
                data-ink
                onClick={() => go(l.target)}
                className="eyebrow-quiet text-[color:var(--c-ink-faint-text)] transition-colors hover:text-[color:var(--c-ink)]"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* mobile menu toggle */}
          <button
            type="button"
            data-ink
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className="h-px w-6 bg-[color:var(--c-ink)]" />
            <span className="h-px w-6 bg-[color:var(--c-ink)]" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: houseEase }}
            className="fixed inset-0 z-[55] bg-[color:var(--c-paper)] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between px-6 py-3.5">
              <span className="text-2xl" style={{ fontFamily: "var(--font-deva)" }}>
                पत्रिका
              </span>
              <button
                type="button"
                data-ink
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="label-deva -m-3 p-3 text-[color:var(--c-accent)]"
              >
                बंद करें <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div className="flex min-h-[70vh] flex-col justify-center gap-10 px-8">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.target}
                  type="button"
                  data-ink
                  onClick={() => go(l.target)}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: reduce ? 0.3 : 0.7, ease: houseEase, delay: reduce ? 0 : 0.1 + i * 0.08 }}
                  className="text-left text-[40px] leading-tight text-[color:var(--c-ink)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {l.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
