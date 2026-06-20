"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "./gsap";
import { useMotion } from "./context";

export type ParallaxOpts = {
  from?: number;
  to?: number;
  start?: string;
  end?: string;
};

/**
 * Lenis-driven, transform-only opposing parallax on the single shared ScrollTrigger
 * ticker — "the page is heavier than the cursor, moving through liquid". No parallel
 * scroll math. Reduced-motion → static (from=to=0).
 */
export function useScrubParallax(ref: RefObject<HTMLElement | null>, opts: ParallaxOpts) {
  const { reduce } = useMotion();
  const { from = 0, to = 0, start = "top bottom", end = "bottom top" } = opts;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce || from === to) return;

      gsap.fromTo(
        el,
        { y: from },
        {
          y: to,
          ease: "none",
          scrollTrigger: { trigger: el, start, end, scrub: true },
        }
      );
    },
    { scope: ref, dependencies: [reduce, from, to] }
  );
}
