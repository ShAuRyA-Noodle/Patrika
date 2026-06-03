"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Poem } from "@/lib/poems";

export default function PoemCard({
  poem,
  index,
  onOpen,
}: {
  poem: Poem;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] },
      }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="poem-card group text-left paper-sheet p-0 overflow-hidden flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--c-paper)]"
    >
      {/* thumbnail (square). Drop an image path into poem.thumb to replace the typographic plate. */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-[color:var(--c-rule)]">
        {poem.thumb ? (
          <Image
            src={poem.thumb}
            alt={poem.cardTitle}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--c-paper-2)] px-6">
            <span
              className="text-[60px] md:text-[76px] leading-[1.04] text-center text-[color:var(--c-ink)] transition-transform duration-[1.2s] group-hover:scale-[1.04]"
              style={{ fontFamily: "var(--font-deva)" }}
            >
              {poem.cardTitle}
            </span>
          </div>
        )}
      </div>

      {/* body */}
      <div className="p-8 lg:p-9 flex flex-col flex-1">
        <div
          className="italic text-2xl text-[color:var(--c-ink-faint)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {poem.titleRoman.split(",")[0].trim()}
        </div>
        <p
          className="mt-5 text-[23px] leading-[1.52] text-[color:var(--c-ink-soft)] flex-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {poem.blurb}
        </p>
        <span
          className="mt-8 inline-flex items-center gap-2.5 text-xl text-[color:var(--c-accent)]"
          style={{ fontFamily: "var(--font-deva)" }}
        >
          पढ़िए
          <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
        </span>
      </div>
    </motion.button>
  );
}
