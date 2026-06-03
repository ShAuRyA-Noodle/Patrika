"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Poem } from "@/lib/poems";

const isDeva = (s: string) => /[ऀ-ॿ]/.test(s);

export default function PoemScroll({
  poem,
  onClose,
}: {
  poem: Poem;
  onClose?: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scrollBgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative py-16 lg:py-24"
    >
      {/* title block */}
      <header className="mb-12 lg:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
          className="text-[56px] md:text-[92px] lg:text-[118px] leading-[0.92] tracking-tight text-[color:var(--c-ink)]"
          style={{ fontFamily: "var(--font-deva)" }}
        >
          {poem.titleDeva}
        </motion.h2>
        <p
          className="mt-4 italic text-xl md:text-2xl text-[color:var(--c-ink-soft)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {poem.titleRoman}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
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

          {/* unrolling paper */}
          <div className="relative paper-sheet scroll-paper ruled-soft px-8 md:px-16 lg:px-24 py-16 md:py-20 overflow-hidden">
            {/* parallax paper noise */}
            <motion.div
              aria-hidden
              style={{ y: scrollBgY }}
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

            {/* stanzas */}
            <div className="relative space-y-12 md:space-y-16">
              {poem.stanzas.map((stanza, si) => (
                <motion.div
                  key={si}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
                  }}
                  className="space-y-3"
                >
                  {stanza.map((line, li) => {
                    const deva = isDeva(line);
                    return (
                      <motion.p
                        key={li}
                        variants={{
                          hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
                          show: {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] },
                          },
                        }}
                        className={
                          deva
                            ? "text-[26px] md:text-[34px] leading-[1.8] text-[color:var(--c-ink)]"
                            : "italic text-[20px] md:text-[23px] leading-[1.7] text-[color:var(--c-ink-soft)]"
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
              ))}

              {/* closing signature */}
              {poem.closing && (
                <div
                  className="pt-8 mt-8 border-t border-[color:var(--c-rule)] text-right"
                  style={{ fontFamily: "var(--font-deva)" }}
                >
                  <span className="text-[color:var(--c-accent)] text-2xl md:text-3xl">
                    {poem.closing}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* rolled bottom */}
          <div className="relative h-5 mx-[-22px]">
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
            className="label-deva text-[color:var(--c-accent)] hover:text-[color:var(--c-ink)] transition-colors"
          >
            ← सभी कविताएँ
          </button>
        </div>
      )}
    </motion.article>
  );
}
