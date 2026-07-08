"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Poem } from "@/lib/poems";
import { useMotion } from "@/lib/motion/context";
import { useStaggerReveal } from "@/lib/motion/useStaggerReveal";
import { useBreath } from "@/lib/motion/useBreath";

export default function PoemCard({
  poem,
  index,
  onOpen,
}: {
  poem: Poem;
  index: number;
  onOpen: (origin: string) => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);

  // hand the reading overlay the clicked card's centre, so it can bloom from here
  const handleOpen = () => {
    const r = cardRef.current?.getBoundingClientRect();
    const origin = r
      ? `${(((r.left + r.width / 2) / window.innerWidth) * 100).toFixed(1)}% ${(((r.top + r.height / 2) / window.innerHeight) * 100).toFixed(1)}%`
      : "50% 45%";
    onOpen(origin);
  };
  // breath lives on an inner wrapper so it never shares a transform target with the
  // GSAP surfacing reveal (the [data-reveal] children) or the framer hover on the root.
  const breathRef = useRef<HTMLDivElement>(null);
  const { reduce } = useMotion();

  useStaggerReveal(cardRef, { each: 0.11, y: 22, blur: 6, start: "top 85%" });
  useBreath(breathRef, { period: 8, y: -6, scale: 1.012, opacity: 0.04, mode: "breath" });

  const romanDetail = poem.titleRoman.split(",").slice(1).join(",").trim() || poem.titleRoman;

  return (
    <motion.button
      ref={cardRef}
      onClick={handleOpen}
      data-ink
      aria-label={`${poem.titleRoman.split(",")[0].trim()} : पढ़िए / read poem`}
      whileHover={reduce ? undefined : { y: -10 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="poem-card group text-left paper-sheet p-0 overflow-hidden flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--c-paper)]"
    >
      {/* ink-wash cover plate; the Devanagari title debosses over the empty upper paper */}
      <div
        data-reveal
        className="relative aspect-[4/5] w-full overflow-hidden border-b border-[color:var(--c-rule)]"
      >
        <div ref={breathRef} className="absolute inset-0">
          <Image
            src={poem.plate}
            alt={`Ink-wash artwork for ${poem.titleRoman}`}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="object-cover"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-6 md:p-7">
          <h3
            className="deboss text-[32px] leading-[1.04] text-[color:var(--c-ink)] md:text-[38px]"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            {poem.cardTitle}
          </h3>
          <span className="folio-num mt-2 shrink-0">{poem.number}</span>
        </div>
      </div>

      {/* body: her real opening line, the English descriptor, and the read cue */}
      <div className="flex flex-1 flex-col gap-5 p-7 lg:p-8">
        <p
          data-reveal
          className="text-[19px] leading-[1.55] text-[color:var(--c-ink-soft)] md:text-[21px]"
          style={{ fontFamily: "var(--font-deva)" }}
        >
          {poem.teaser}
        </p>
        <div
          data-reveal
          className="text-lg italic text-[color:var(--c-ink-faint-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {romanDetail}
        </div>
        <span
          data-reveal
          className="mt-auto inline-flex items-center gap-2.5 text-lg text-[color:var(--c-accent)]"
          style={{ fontFamily: "var(--font-deva)" }}
        >
          पढ़िए
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
          >
            →
          </span>
        </span>
      </div>
    </motion.button>
  );
}
