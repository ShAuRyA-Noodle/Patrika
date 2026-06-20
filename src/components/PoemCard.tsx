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
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  // breath lives on an inner wrapper INSIDE the plate so it never shares a
  // transform/opacity target with the GSAP surfacing reveal (which animates the
  // [data-reveal] plate container) or with the framer hover/tap on the root.
  const breathRef = useRef<HTMLDivElement>(null);
  // one reduced-motion source shared with the GSAP hooks (no framer/GSAP desync)
  const { reduce } = useMotion();

  // GSAP ScrollTrigger.batch surfaces the inner folio lines (folio-num, plate,
  // subtitle, blurb, link) on scroll — scope cleanup via the hook's useGSAP.
  // GSAP owns these children's transform/opacity/blur; framer never touches them.
  useStaggerReveal(cardRef, { each: 0.11, y: 22, blur: 6, start: "top 85%" });

  // Perpetual sub-pixel breath on the inner plate wrapper — one shared 8s rhythm
  // across all three folios. Disabled under reduced-motion by the hook itself.
  useBreath(breathRef, { period: 8, y: -6, scale: 1.015, opacity: 0.04, mode: "breath" });

  return (
    <motion.button
      ref={cardRef}
      onClick={onOpen}
      data-ink
      aria-label={`${poem.titleRoman.split(",")[0].trim()} — पढ़िए / read poem`}
      // Entrance is owned by GSAP (inner [data-reveal] surfacing). Framer keeps
      // only the root's distinct interaction transforms so the two libraries
      // never animate the same property on the same node.
      whileHover={reduce ? undefined : { y: -10 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="poem-card group text-left paper-sheet p-0 overflow-hidden flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--c-paper)]"
    >
      {/* thumbnail (square). Drop an image path into poem.thumb to replace the typographic plate. */}
      <div
        data-reveal
        className="relative aspect-square w-full overflow-hidden border-b border-[color:var(--c-rule)]"
        style={{ transitionDelay: `${index * 0.1}s` }}
      >
        {/* breathing inner wrapper — GSAP useBreath owns this node's transform/opacity */}
        <div ref={breathRef} className="absolute inset-0">
          {poem.thumb ? (
            <Image
              src={poem.thumb}
              alt={poem.cardTitle}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--c-paper-2)] px-6">
              {/* Devanagari cardTitle — kept as ONE static text node, never char-split */}
              <span
                className="text-[60px] md:text-[76px] leading-[1.04] text-center text-[color:var(--c-ink)]"
                style={{ fontFamily: "var(--font-deva)" }}
              >
                {poem.cardTitle}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* body */}
      <div className="p-8 lg:p-9 flex flex-col flex-1">
        {/* manuscript apparatus — folio number (mono, NEVER on Devanagari) */}
        <div data-reveal className="folio-num">
          {poem.number}
        </div>
        <div
          data-reveal
          className="mt-3 italic text-2xl text-[color:var(--c-ink-faint)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {poem.titleRoman.split(",")[0].trim()}
        </div>
        <p
          data-reveal
          className="mt-5 text-[23px] leading-[1.52] text-[color:var(--c-ink-soft)] flex-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {poem.blurb}
        </p>
        <span
          data-reveal
          className="mt-8 inline-flex items-center gap-2.5 text-xl text-[color:var(--c-accent)]"
          style={{ fontFamily: "var(--font-deva)" }}
        >
          पढ़िए
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
        </span>
      </div>
    </motion.button>
  );
}
