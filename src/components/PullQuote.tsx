"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export default function PullQuote() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  return (
    <section
      ref={ref}
      className="relative py-28 lg:py-44 border-y border-[color:var(--c-ink)] overflow-hidden"
    >
      <motion.div style={{ y }} className="mx-auto max-w-[1100px] px-6 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="display-tight text-[38px] md:text-[58px] lg:text-[76px] leading-[1.16] text-[color:var(--c-ink)]"
          style={{ fontFamily: "var(--font-deva)" }}
        >
          जो चाहते हुए भी नहीं छलकता,
          <br />
          पर <span className="text-[color:var(--c-accent)]">छलकना</span> चाहता है।
        </motion.blockquote>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25 }}
          className="mt-10 flex items-center justify-center gap-4 text-[color:var(--c-ink-faint)]"
        >
          <span className="h-px w-12 bg-[color:var(--c-rule)]" />
          <span className="label-deva text-lg">अनकहा दर्द</span>
          <span className="h-px w-12 bg-[color:var(--c-rule)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
