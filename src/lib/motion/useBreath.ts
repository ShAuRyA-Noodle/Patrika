"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap } from "./gsap";
import { useMotion } from "./context";

export type BreathOpts = {
  period?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  /** 'breath' = the alive-not-animated swell (figure, cards); 'tremor' = the held tear (छलकना) */
  mode?: "breath" | "tremor";
  /** start delay — used to let a one-shot reveal settle before the perpetual loop begins */
  delay?: number;
};

/**
 * Perpetual sub-pixel "alive, not animated" micro-motion on ONE shared rhythm.
 * Amplitude discipline is the craft: breath ≤9px / ≤0.04 opacity, tremor ≤3px / ≤0.4px blur,
 * capped so the tremor NEVER completes into a fall. Transform/opacity only; paused under reduce.
 */
export function useBreath(ref: RefObject<HTMLElement | null>, opts: BreathOpts = {}) {
  const { reduce } = useMotion();
  const { period = 8, y = -6, scale = 1.015, opacity = 0.04, mode = "breath", delay = 0 } = opts;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce) return;

      const tl = gsap.timeline({ repeat: -1, yoyo: true, delay });

      if (mode === "tremor") {
        tl.to(el, {
          y: -3,
          filter: "blur(0.4px)",
          duration: period / 2,
          ease: "sine.inOut",
        });
        return () => {
          tl.kill();
        };
      }

      tl.to(
        el,
        {
          y,
          scale,
          duration: period / 2,
          ease: "sine.inOut",
          transformOrigin: "50% 100%",
        },
        0
      );
      tl.to(
        el,
        {
          opacity: 1 - opacity,
          duration: period / 2,
          ease: "sine.inOut",
        },
        0
      );

      return () => {
        tl.kill();
      };
    },
    { scope: ref, dependencies: [reduce, mode] }
  );
}
