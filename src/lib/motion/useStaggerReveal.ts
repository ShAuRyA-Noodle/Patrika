"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useMotion } from "./context";

/** house ease as a framer-motion cubic-bezier (for the overlay path, which stays on framer) */
export const houseEase = [0.16, 1, 0.3, 1] as const;

/**
 * Framer variants for the reading-overlay path. The overlay is its own
 * data-lenis-prevent scroll container, so its stanza reveals stay on framer
 * whileInView (zero extra RAF) — we only standardize them to the house ease here.
 */
export function staggerVariants(each = 0.11, y = 22, blur = 6, reduce = false) {
  // reduced-motion: content is pre-revealed (opacity 1, no transform/blur) so the
  // poem body is always legible even if the in-view observer never fires
  if (reduce) {
    return {
      container: { hidden: { opacity: 1 }, show: { opacity: 1 } },
      item: { hidden: { opacity: 1 }, show: { opacity: 1 } },
    };
  }
  return {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: each, delayChildren: 0.05 } },
    },
    item: {
      hidden: { opacity: 0, y, filter: `blur(${blur}px)` },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: houseEase },
      },
    },
  };
}

export type StaggerOpts = {
  selector?: string;
  each?: number;
  y?: number;
  blur?: number;
  start?: string;
};

/**
 * Main-document scroll-into-view stagger (GSAP ScrollTrigger.batch). For section
 * blocks, the grid, the footer — "reading inks the page". Use staggerVariants()
 * inside the reading overlay instead.
 */
export function useStaggerReveal(ref: RefObject<HTMLElement | null>, opts: StaggerOpts = {}) {
  const { reduce } = useMotion();
  const { selector = "[data-reveal]", each = 0.11, y = 22, blur = 6, start = "top 85%" } = opts;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(selector));
      if (!items.length) return;

      if (reduce) {
        gsap.set(items, { autoAlpha: 1, y: 0, filter: "none" });
        return;
      }

      gsap.set(items, {
        autoAlpha: 0,
        y,
        filter: `blur(${blur}px)`,
        willChange: "transform, opacity, filter",
      });

      ScrollTrigger.batch(items, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "breath",
            duration: 0.9,
            stagger: each,
            overwrite: true,
            onComplete: () => gsap.set(batch, { clearProps: "filter,willChange" }),
          }),
      });
    },
    { scope: ref, dependencies: [reduce] }
  );
}
