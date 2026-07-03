"use client";

import { motion } from "framer-motion";
import { VERSES } from "@/lib/verses";
import { useMotion } from "@/lib/motion/context";
import { houseEase } from "@/lib/motion/useStaggerReveal";

// the lines already carried by the hero + pullquote, kept out so this reads fresh
const SHOWN_ELSEWHERE = ["जहाँ शब्द", "जो चाहते"];

export default function VerseGallery() {
  const { reduce } = useMotion();
  const verses = VERSES.filter((v) => !SHOWN_ELSEWHERE.some((s) => v.deva.startsWith(s)));

  return (
    <section className="py-[var(--space-section)]">
      <div className="mb-20 flex items-center justify-center gap-5">
        <span className="h-px w-16 bg-[color:var(--c-rule)]" />
        <span className="eyebrow-quiet">in her words</span>
        <span className="h-px w-16 bg-[color:var(--c-rule)]" />
      </div>

      <div className="flex flex-col items-center gap-[clamp(72px,12vh,150px)]">
        {verses.map((v) => (
          <motion.blockquote
            key={v.deva}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(8px)" }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0.4 : 1.1, ease: houseEase }}
            className="mx-auto max-w-[46rem] text-center"
          >
            <p
              className="deboss whitespace-pre-line text-[clamp(24px,3.4vw,42px)] leading-[1.4] text-[color:var(--c-ink)]"
              style={{ fontFamily: "var(--font-deva)" }}
            >
              {v.deva}
            </p>
            <p
              className="mx-auto mt-7 max-w-[38ch] text-base italic text-[color:var(--c-ink-soft)] md:text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {v.gloss}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="eyebrow-quiet">from</span>
              <span
                className="text-[15px] text-[color:var(--c-ink-faint-text)]"
                style={{ fontFamily: "var(--font-deva)" }}
              >
                {v.poemTitle}
              </span>
            </div>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}
