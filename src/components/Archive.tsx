"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Hero from "@/components/Hero";
import PullQuote from "@/components/PullQuote";
import PoemCard from "@/components/PoemCard";
import PoemScroll, { type PoemScrollHandle } from "@/components/PoemScroll";
import { POEMS } from "@/lib/poems";
import { useMotion } from "@/lib/motion/context";
import { useStaggerReveal } from "@/lib/motion/useStaggerReveal";

export default function Archive() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = POEMS.find((p) => p.id === openId) ?? null;
  // one reduced-motion source, shared with the GSAP hooks
  const { reduce } = useMotion();

  // framer owns ONLY the top scroll-progress hairline + the overlay backdrop/flood.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  // संग्रह heading + footer rows surface on scroll (GSAP batch, main document).
  // PoemCard owns its OWN entrance, so the cards are NOT tagged data-reveal here.
  const sectionRef = useRef<HTMLDivElement>(null);
  useStaggerReveal(sectionRef, { selector: "[data-reveal]" });

  const scrollHandle = useRef<PoemScrollHandle>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);

  const openPoem = useCallback((id: string) => {
    lastTriggerRef.current = (document.activeElement as HTMLElement) ?? null;
    setOpenId(id);
  }, []);

  const handleClose = useCallback(async () => {
    if (closingRef.current) return; // ignore re-entrant close during teardown
    closingRef.current = true;
    const h = scrollHandle.current;
    if (h) await h.close(); // roll the sheet up, THEN unmount
    setOpenId(null);
    closingRef.current = false;
  }, []);

  // Modal semantics: move focus into the dialog, make the page behind inert,
  // close on Escape, restore focus to the triggering card on close.
  useEffect(() => {
    if (!openId) return;
    const overlay = overlayRef.current;
    const bg = backgroundRef.current;
    bg?.setAttribute("aria-hidden", "true");
    bg?.setAttribute("inert", "");
    overlay?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        void handleClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      bg?.removeAttribute("aria-hidden");
      bg?.removeAttribute("inert");
      lastTriggerRef.current?.focus?.();
    };
  }, [openId, handleClose]);

  return (
    <main className="relative flex flex-col flex-1">
      {/* scroll progress hairline (framer-owned) */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[color:var(--c-accent)] z-[60]"
      />

      {/* everything behind the reading overlay — made inert while a poem is open */}
      <div ref={backgroundRef}>
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-12 lg:px-16">
          <Hero />
        </div>

        <PullQuote />

        <div ref={sectionRef} className="mx-auto w-full max-w-[1280px] px-6 md:px-12 lg:px-16">
          <section id="archive" className="relative pt-24 pb-28">
            {/* surface-level horizon rule — scores the margin before the word surfaces */}
            <div data-reveal aria-hidden className="surface-hairline mb-8" />
            <h2
              data-reveal
              className="display-tight text-5xl md:text-7xl lg:text-8xl text-[color:var(--c-ink)] mb-14"
              style={{ fontFamily: "var(--font-deva)" }}
            >
              संग्रह
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {POEMS.map((poem, i) => (
                <PoemCard key={poem.id} poem={poem} index={i} onOpen={() => openPoem(poem.id)} />
              ))}
            </div>
          </section>

          <footer className="pt-10 pb-16">
            {/* footer top rule draws in before the colophon surfaces */}
            <div data-reveal aria-hidden className="surface-hairline mb-10" />
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <span data-reveal className="text-3xl" style={{ fontFamily: "var(--font-deva)" }}>
                पत्रिका
              </span>
              <span
                data-reveal
                className="italic text-xl text-[color:var(--c-ink-soft)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                कविताएँ{" "}
                <span className="gold-pool text-[color:var(--c-gold)]">नीलू शोरी</span>, 2026
              </span>
            </div>
          </footer>
        </div>
      </div>

      {/* full reading overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.titleDeva} — ${active.titleRoman}`}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            data-lenis-prevent
            className="fixed inset-0 z-50 overflow-y-auto outline-none surface theme-forest"
          >
            {/* cathartic flood-up: a dark wash within palette rising from the bottom on open.
                DISTINCT element from the GSAP-driven manuscript sheet — framer owns it. */}
            <motion.div
              aria-hidden
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: "60%" }}
              animate={reduce ? { opacity: 0.5 } : { opacity: 1, y: "0%" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: "60%" }}
              transition={{ duration: reduce ? 0.35 : 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none fixed inset-x-0 bottom-0 h-[70%] z-0"
              style={{
                background:
                  "linear-gradient(0deg, color-mix(in srgb, var(--c-ink) 26%, transparent) 0%, color-mix(in srgb, var(--c-ink) 10%, transparent) 38%, transparent 80%)",
              }}
            />

            <div className="sticky top-0 z-10 backdrop-blur-sm bg-[color-mix(in_srgb,var(--c-paper)_84%,transparent)] border-b border-[color:var(--c-rule)]">
              <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12 py-4 flex items-center justify-between">
                <span className="text-2xl" style={{ fontFamily: "var(--font-deva)" }}>
                  पत्रिका
                </span>
                <button
                  onClick={handleClose}
                  data-ink
                  aria-label="कविता बंद करें — close poem"
                  className="label-deva text-[color:var(--c-accent)] hover:text-[color:var(--c-ink)] transition-colors"
                >
                  बंद करें <span aria-hidden="true">✕</span>
                </button>
              </div>
            </div>

            <div className="relative z-[1] mx-auto w-full max-w-[1100px] px-6 md:px-12 lg:px-16">
              <PoemScroll ref={scrollHandle} poem={active} onClose={handleClose} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
