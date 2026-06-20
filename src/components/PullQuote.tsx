"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/context";
import { useDevanagariReveal } from "@/lib/motion/useDevanagariReveal";
import { useScrubParallax } from "@/lib/motion/useScrubParallax";
import { useBreath } from "@/lib/motion/useBreath";

export default function PullQuote() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const goldWordRef = useRef<HTMLSpanElement>(null);
  const leftRuleRef = useRef<HTMLSpanElement>(null);
  const rightRuleRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const { reduce } = useMotion();

  // Band depth: scrubbed translateY +60 → -60 on the shared gsap.ticker (no framer scroll math).
  useScrubParallax(innerRef, { from: 60, to: -60 });

  // The couplet surfaces word-by-word out of wet paper; gold छलकना clarifies last.
  useDevanagariReveal(quoteRef, {
    split: "words",
    goldLast: true,
    trigger: "scroll",
    y: 24,
    blur: 8,
    stagger: 0.11,
  });

  // The Held Tear — perpetual sub-pixel tremor on छलकना (≤3px, never falls). Delayed so
  // it begins only after the surfacing reveal of the word has settled (no overlap on the
  // wrapper span vs the split word inside it).
  useBreath(goldWordRef, { mode: "tremor", period: 5, delay: 1.8 });

  // The frame tightens: the two hairline rules draw INWARD toward the label, then the
  // label fades in. scaleX + transformOrigin only (zero reflow). Distinct elements from
  // every other animation here, so no two libs touch one property on one element.
  useGSAP(
    () => {
      const left = leftRuleRef.current;
      const right = rightRuleRef.current;
      const label = labelRef.current;
      if (!left || !right || !label) return;

      if (reduce) {
        // Parity: rules pre-drawn full width, label visible, nothing draws.
        gsap.set([left, right], { scaleX: 1 });
        gsap.set(label, { autoAlpha: 1 });
        return;
      }

      gsap.set(left, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(right, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(label, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });

      // Land AFTER the couplet settles.
      tl.to(
        [left, right],
        { scaleX: 1, duration: 0.7, ease: "breath" },
        0.9
      ).to(
        label,
        { autoAlpha: 1, duration: 0.6, ease: "breath" },
        "+=0.15"
      );
    },
    { scope: sectionRef, dependencies: [reduce] }
  );

  return (
    <section
      ref={sectionRef}
      data-waterline-crest-anchor
      className="relative py-28 lg:py-44 border-y border-[color:var(--c-ink)] overflow-hidden"
    >
      <div ref={innerRef} className="mx-auto max-w-[1100px] px-6 text-center">
        <blockquote
          ref={quoteRef}
          className="display-tight text-[38px] md:text-[58px] lg:text-[76px] leading-[1.16] text-[color:var(--c-ink)]"
          style={{ fontFamily: "var(--font-deva)" }}
        >
          जो चाहते हुए भी नहीं छलकता,
          <br />
          पर{" "}
          <span
            ref={goldWordRef}
            className="held-tear gold-pool text-[color:var(--c-gold)]"
            data-gold
          >
            छलकना
          </span>{" "}
          चाहता है।
        </blockquote>
        <div className="mt-10 flex items-center justify-center gap-4 text-[color:var(--c-ink-faint)]">
          <span ref={leftRuleRef} className="surface-hairline w-12" />
          <span ref={labelRef} className="label-deva text-lg">
            अनकहा दर्द
          </span>
          <span ref={rightRuleRef} className="surface-hairline w-12" />
        </div>
      </div>
    </section>
  );
}
