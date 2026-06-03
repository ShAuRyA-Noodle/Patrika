"use client";

import { useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Hero from "@/components/Hero";
import PullQuote from "@/components/PullQuote";
import PoemCard from "@/components/PoemCard";
import PoemScroll from "@/components/PoemScroll";
import { POEMS } from "@/lib/poems";

export default function Archive() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = POEMS.find((p) => p.id === openId) ?? null;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <main className="relative flex flex-col flex-1">
      {/* scroll progress hairline */}
      <motion.div
        style={{ scaleX: progress, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[color:var(--c-accent)] z-[60]"
      />

      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-12 lg:px-16">
        <Hero />
      </div>

      <PullQuote />

      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-12 lg:px-16">
        <section id="archive" className="relative pt-24 pb-28">
          <h2
            className="display-tight text-5xl md:text-7xl lg:text-8xl text-[color:var(--c-ink)] mb-14"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            संग्रह
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {POEMS.map((poem, i) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                index={i}
                onOpen={() => setOpenId(poem.id)}
              />
            ))}
          </div>
        </section>

        <footer
          className="pt-10 pb-16 border-t border-[color:var(--c-ink)] flex flex-wrap items-baseline justify-between gap-4"
        >
          <span
            className="text-3xl"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            पत्रिका
          </span>
          <span
            className="italic text-xl text-[color:var(--c-ink-soft)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            कविताएँ <span className="text-[color:var(--c-accent)]">नीलू शोरी</span>, 2026
          </span>
        </footer>
      </div>

      {/* full reading overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            data-lenis-prevent
            className="fixed inset-0 z-50 overflow-y-auto surface theme-forest"
          >
            <div className="sticky top-0 z-10 backdrop-blur-sm bg-[color-mix(in_srgb,var(--c-paper)_84%,transparent)] border-b border-[color:var(--c-rule)]">
              <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12 py-4 flex items-center justify-between">
                <span className="text-2xl" style={{ fontFamily: "var(--font-deva)" }}>
                  पत्रिका
                </span>
                <button
                  onClick={() => setOpenId(null)}
                  className="label-deva text-[color:var(--c-accent)] hover:text-[color:var(--c-ink)] transition-colors"
                >
                  बंद करें ✕
                </button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12 lg:px-16">
              <PoemScroll poem={active} onClose={() => setOpenId(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
