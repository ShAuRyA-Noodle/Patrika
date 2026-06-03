"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const reveal = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[86dvh] flex flex-col">
      {/* masthead */}
      <header className="grid grid-cols-3 items-center pt-8 pb-6 border-b border-[color:var(--c-ink)]">
        <span className="label-deva text-[color:var(--c-ink-soft)]">नीलू शोरी</span>
        <div className="text-center">
          <div
            className="text-4xl md:text-5xl leading-none"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            पत्रिका
          </div>
          <div
            className="mt-2.5 italic text-base md:text-lg tracking-[0.16em] uppercase text-[color:var(--c-ink-soft)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            a bilingual journal of poems
          </div>
        </div>
        <span className="text-right label-deva text-[color:var(--c-ink-faint)]">हिंदी / English</span>
      </header>

      {/* headline */}
      <motion.div
        style={{ y: titleY, opacity: fade }}
        className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-10 pt-16 lg:pt-24 pb-10 items-end"
      >
        <div className="lg:col-span-9">
          <motion.h1
            variants={reveal}
            custom={1}
            initial="hidden"
            animate="show"
            className="display-tight text-[64px] md:text-[112px] lg:text-[148px] leading-[0.96] text-[color:var(--c-ink)]"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            जहाँ शब्द थम जाते हैं,
            <br />
            वहाँ <span className="text-[color:var(--c-accent)]">सैलाब</span> दफ़्न हो जाते हैं।
          </motion.h1>

          <motion.p
            variants={reveal}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-10 italic text-3xl md:text-[40px] text-[color:var(--c-ink-soft)] max-w-[22ch]"
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.2 }}
          >
            Where the words run out, a flood is buried alive.
          </motion.p>
        </div>

        <motion.div
          variants={reveal}
          custom={3}
          initial="hidden"
          animate="show"
          className="lg:col-span-3 lg:border-l border-[color:var(--c-rule)] lg:pl-10"
        >
          <p
            className="text-[26px] text-[color:var(--c-ink-soft)]"
            style={{ fontFamily: "var(--font-body)", lineHeight: 1.5 }}
          >
            तीन कविताएँ, एक ही मौन से उठती हुई। Three poems on the floods a woman is never
            allowed to spill.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
