"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { Poem } from "@/lib/poems";
import { useMotion } from "@/lib/motion/context";
import { useFolioUnfurl } from "@/lib/motion/useFolioUnfurl";
import { useDevanagariReveal } from "@/lib/motion/useDevanagariReveal";
import { staggerVariants, houseEase } from "@/lib/motion/useStaggerReveal";

const isDeva = (s: string) => /[ऀ-ॿ]/.test(s);

// sediment settle: slow silt coming heavily to rest, distinct from the breath arrival.
const sedimentEase = [0.2, 0.8, 0.2, 1] as const;

export type PoemScrollHandle = { close: () => Promise<void> };

const PoemScroll = forwardRef<PoemScrollHandle, { poem: Poem; onClose?: () => void }>(
  function PoemScroll({ poem, onClose }, ref) {
    // one reduced-motion source shared with the GSAP hooks (folio/title) — no desync
    const { reduce } = useMotion();

    // GSAP-owned manuscript chrome
    const articleRef = useRef<HTMLElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const bottomBarRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // The sheet UNFURLS on mount; close() rolls it back up before unmount.
    const { close } = useFolioUnfurl(
      { sheetRef, bottomBarRef },
      true
    );
    useImperativeHandle(ref, () => ({ close }), [close]);

    // Devanagari title inks in word-by-word (matra-safe). trigger:'load' fires on mount
    // (the title is in view the instant the overlay opens) — NO ScrollTrigger inside the
    // overlay's own data-lenis-prevent scroll container.
    useDevanagariReveal(titleRef, { split: "words", trigger: "load", y: 24, blur: 8 });

    // Stanza pacing: the drowning poem (poem-02) sinks one slow line at a time.
    const each = poem.id === "poem-02" ? 0.16 : 0.11;
    const variants = staggerVariants(each, 22, 6, !!reduce);

    // overlay-local parallax noise — transform-only, on the overlay's own scroll.
    const { scrollYProgress } = useScroll({
      target: articleRef,
      offset: ["start end", "end start"],
    });
    const scrollBgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

    return (
      <article ref={articleRef} className="relative py-16 lg:py-24">
        {/* title block */}
        <header className="mb-12 lg:mb-16">
          <h2
            ref={titleRef}
            className="text-[56px] md:text-[92px] lg:text-[118px] leading-[0.92] tracking-tight text-[color:var(--c-ink)]"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            {poem.titleDeva}
          </h2>
          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0.4 } : { duration: 0.6, ease: houseEase, delay: 0.4 }}
            className="mt-4 italic text-xl md:text-2xl text-[color:var(--c-ink-soft)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {poem.titleRoman}
          </motion.p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="folio-num">{poem.number}</span>
            <span className="label-deva text-[color:var(--c-ink-faint)]">कवयित्री</span>
            <span
              className="text-[color:var(--c-ink)] text-lg"
              style={{ fontFamily: "var(--font-deva)" }}
            >
              {poem.author}
            </span>
            <span className="h-3.5 w-px bg-[color:var(--c-rule)]" />
            <span className="eyebrow text-[color:var(--c-ink-soft)]">{poem.date}</span>
          </div>
        </header>

        {/* the scroll */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-10 lg:col-start-2 relative">
            {/* rolled top */}
            <div className="relative h-5 mx-[-22px]">
              <div
                className="absolute inset-x-0 top-2 h-4 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--c-paper-edge) 60%, var(--c-ink)) 0%, color-mix(in srgb, var(--c-paper-edge) 95%, transparent) 50%, color-mix(in srgb, var(--c-paper-edge) 60%, var(--c-ink)) 100%)",
                  boxShadow:
                    "0 2px 6px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.25)",
                }}
              />
            </div>

            {/* unrolling paper — GSAP (useFolioUnfurl) owns this element's transform/opacity/blur */}
            <div
              ref={sheetRef}
              className="relative paper-sheet scroll-paper ruled-soft px-8 md:px-16 lg:px-24 py-16 md:py-20 overflow-hidden"
            >
              {/* parallax paper noise (framer, transform-only, on the overlay's own scroll) */}
              <motion.div
                aria-hidden
                style={{ y: reduce ? 0 : scrollBgY }}
                className="absolute inset-x-0 -top-10 -bottom-10 opacity-[0.07] pointer-events-none"
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.12  0 0 0 0 0.10  0 0 0 0 0.06  0 0 0 0.10 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
                  }}
                />
              </motion.div>

              {/* stanzas — framer whileInView (overlay is its own scroll container) */}
              <div className="relative space-y-12 md:space-y-16">
                {poem.stanzas.map((stanza, si) => {
                  // illuminate the first stanza's first Devanagari line with the drop-cap
                  let dropMarked = false;
                  return (
                    <motion.div
                      key={si}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-60px" }}
                      variants={variants.container}
                      className="space-y-3"
                    >
                      {stanza.map((line, li) => {
                        const deva = isDeva(line);
                        const isDropCap = si === 0 && deva && !dropMarked;
                        if (isDropCap) dropMarked = true;
                        return (
                          <motion.p
                            key={li}
                            variants={variants.item}
                            className={
                              (deva
                                ? "text-[26px] md:text-[34px] leading-[1.8] text-[color:var(--c-ink)]"
                                : "italic text-[20px] md:text-[23px] leading-[1.7] text-[color:var(--c-ink-soft)]") +
                              (isDropCap ? " drop-cap" : "")
                            }
                            style={
                              deva
                                ? { fontFamily: "var(--font-deva)" }
                                : { fontFamily: "var(--font-display)" }
                            }
                          >
                            {line}
                          </motion.p>
                        );
                      })}
                    </motion.div>
                  );
                })}

                {/* closing signature — settles like sediment, not a fade */}
                {poem.closing && (
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    className="pt-8 mt-8 text-right"
                  >
                    {/* rule draws in first (scaleX, transformOrigin left) */}
                    <motion.div
                      aria-hidden
                      className="surface-hairline mb-8"
                      variants={{
                        hidden: reduce ? { opacity: 1 } : { scaleX: 0, opacity: 1 },
                        show: reduce
                          ? { opacity: 1, transition: { duration: 0.4 } }
                          : {
                              scaleX: 1,
                              transition: { duration: 0.7, ease: houseEase },
                            },
                      }}
                    />
                    <motion.span
                      className="inline-block text-[color:var(--c-gold)] text-2xl md:text-3xl"
                      style={{ fontFamily: "var(--font-deva)" }}
                      variants={{
                        hidden: reduce ? { opacity: 1 } : { opacity: 0, y: -10 },
                        show: reduce
                          ? { opacity: 1, transition: { duration: 0.4, delay: 0.1 } }
                          : {
                              opacity: 1,
                              y: 0,
                              transition: { duration: 1.4, ease: sedimentEase, delay: 0.2 },
                            },
                      }}
                    >
                      {poem.closing}
                    </motion.span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* rolled bottom — GSAP (useFolioUnfurl) owns its trailing settle */}
            <div ref={bottomBarRef} className="relative h-5 mx-[-22px]">
              <div
                className="absolute inset-x-0 top-1 h-4 rounded-full"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--c-paper-edge) 60%, var(--c-ink)) 0%, color-mix(in srgb, var(--c-paper-edge) 95%, transparent) 50%, color-mix(in srgb, var(--c-paper-edge) 60%, var(--c-ink)) 100%)",
                  boxShadow:
                    "0 2px 6px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.25)",
                }}
              />
            </div>
          </div>
        </div>

        {onClose && (
          <div className="mt-14 text-center">
            <button
              onClick={onClose}
              data-ink
              aria-label="सभी कविताएँ — back to all poems"
              className="label-deva text-[color:var(--c-accent)] hover:text-[color:var(--c-ink)] transition-colors"
            >
              <span aria-hidden="true">←</span> सभी कविताएँ
            </button>
          </div>
        )}
      </article>
    );
  }
);

export default PoemScroll;
