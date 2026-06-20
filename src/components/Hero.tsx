"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/context";
import { useDevanagariReveal } from "@/lib/motion/useDevanagariReveal";
import { useBreath } from "@/lib/motion/useBreath";
import { useScrubParallax } from "@/lib/motion/useScrubParallax";
import { waterline } from "@/components/motion/Waterline";

const houseEase = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const breathRef = useRef<HTMLDivElement>(null);
  const sinkRef = useRef<HTMLDivElement>(null);

  const { reduce, ready } = useMotion();

  // The signature surfacing headline — words condense out of wet paper, gold word (सैलाब) last.
  useDevanagariReveal(headlineRef, {
    split: "words",
    goldLast: true,
    trigger: "load",
  });

  // bua figure breathes on the shared 8s house rhythm (inner wrapper, transform/opacity only).
  useBreath(breathRef, { period: 8 });

  // Opposing scrub parallax: headline rises, figure drifts down — the page moving through liquid.
  useScrubParallax(headlineRef, { from: 0, to: -90 });
  useScrubParallax(figureRef, { from: 0, to: 70 });

  // Masthead rule scores itself in (scaleX 0→1) on loader handoff; figure sinks as the
  // waterline rises (opacity-only, reads --waterline-progress published on :root).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const reduced = ctx.conditions?.reduced;
          const rule = ruleRef.current;

          if (reduced) {
            if (rule) gsap.set(rule, { scaleX: 1, autoAlpha: 1 });
            return;
          }

          // score the masthead rule left → right on the loader-intro tail
          if (rule && ready) {
            gsap.from(rule, {
              scaleX: 0,
              transformOrigin: "left center",
              ease: "breath",
              duration: 0.7,
            });
          }

          // figure sinks into the rising waterline — opacity only, reads the shared
          // waterline.progress value (no per-frame getComputedStyle / style flush)
          const sink = sinkRef.current;
          if (sink) {
            const setOpacity = gsap.quickSetter(sink, "opacity") as (v: number) => void;
            gsap.set(sink, { opacity: 0.45 });
            const st = ScrollTrigger.create({
              trigger: ref.current!,
              start: "top top",
              end: "bottom top",
              onUpdate: () => {
                const p = Math.min(Math.max(waterline.progress, 0), 1);
                // lower-edge dissolve deepens from 0.45 → 1.0 as the flood climbs
                setOpacity(0.45 + p * 0.55);
              },
            });
            return () => st.kill();
          }
        }
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready, reduce] }
  );

  return (
    <section ref={ref} className="relative min-h-[86dvh] flex flex-col">
      {/* masthead */}
      <header className="relative grid grid-cols-3 items-center pt-8 pb-6">
        <span data-ink className="label-deva text-[color:var(--c-ink-soft)]">
          नीलू शोरी
        </span>
        <div className="text-center" data-ink>
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
        <span data-ink className="text-right label-deva text-[color:var(--c-ink-faint)]">
          हिंदी / English
        </span>
        {/* the top rule scores itself in on the loader handoff (scaleX, transformOrigin left) */}
        <span
          ref={ruleRef}
          aria-hidden
          className="surface-hairline absolute inset-x-0 bottom-0"
          style={{ background: "var(--c-ink)" }}
        />
      </header>

      {/* headline */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-12 pt-16 lg:pt-24 pb-10 items-end">
        <div className="lg:col-span-8">
          <h1
            ref={headlineRef}
            className="display-tight text-[58px] md:text-[100px] lg:text-[132px] leading-[0.96] text-[color:var(--c-ink)]"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            जहाँ शब्द थम जाते हैं,
            <br />
            वहाँ{" "}
            <span data-gold className="text-[color:var(--c-gold)]">
              सैलाब
            </span>{" "}
            दफ़्न हो जाते हैं।
          </h1>

          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={
              reduce
                ? { duration: 0.4, delay: 0.1 }
                : { duration: 0.9, delay: 1.0, ease: houseEase }
            }
            className="mt-10 italic text-3xl md:text-[40px] text-[color:var(--c-ink-soft)] max-w-[22ch]"
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.2 }}
          >
            Where the words run out, a flood is buried alive.
          </motion.p>
        </div>

        {/* right rail: the ink figure of silence, then the standfirst */}
        <div className="lg:col-span-4 lg:border-l border-[color:var(--c-rule)] lg:pl-10 flex flex-col gap-8">
          <figure ref={figureRef} data-ink className="group relative m-0">
            {/* slow breathing drift on the shared 8s house rhythm (GSAP, transform/opacity only) */}
            <div ref={breathRef} className="relative aspect-[5/6] w-full overflow-hidden">
              <Image
                src="/bua.png"
                alt="An ink-wash figure sitting alone, head bowed, dissolving into the paper."
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-[78%_center] grayscale contrast-[1.08] mix-blend-multiply"
              />
              {/* ink wash dissolving the lower edge into the page — opacity tracks the rising waterline */}
              <div
                ref={sinkRef}
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                style={{ background: "linear-gradient(to top, var(--c-paper), transparent)" }}
              />
            </div>
            {/* a thin ground rule + quiet caption */}
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-[color:var(--c-rule)]" />
              <span className="eyebrow text-[color:var(--c-ink-faint)]">मौन · silence</span>
            </figcaption>
          </figure>

          <p
            className="text-[26px] text-[color:var(--c-ink-soft)]"
            style={{ fontFamily: "var(--font-body)", lineHeight: 1.5 }}
          >
            तीन कविताएँ, एक ही मौन से उठती हुई। Three poems on the floods a woman is never
            allowed to spill.
          </p>
        </div>
      </div>
    </section>
  );
}
