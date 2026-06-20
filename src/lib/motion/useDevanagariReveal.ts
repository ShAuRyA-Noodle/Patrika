"use client";

import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap, SplitText } from "./gsap";
import { useMotion } from "./context";

const DEVANAGARI = /[ऀ-ॿ]/;

export type RevealOpts = {
  /** Devanagari may ONLY split at word or line level — never chars (breaks matras/conjuncts) */
  split?: "words" | "lines";
  stagger?: number;
  /** the one [data-gold] word per block clarifies LAST, a half-beat slower, with a faint settle */
  goldLast?: boolean;
  trigger?: "load" | "scroll";
  y?: number;
  blur?: number;
  /** Latin-only nodes may opt into char split; ignored (forced to words) if the node holds Devanagari */
  allowChars?: boolean;
};

/**
 * The signature "surfacing through wet paper" arrival. Words (or lines) rise from
 * y+blur into full clarity on the house "breath" ease. Devanagari safety is enforced
 * here so no consumer can char-split it.
 */
export function useDevanagariReveal(ref: RefObject<HTMLElement | null>, opts: RevealOpts = {}) {
  const { reduce, ready } = useMotion();
  const {
    split = "words",
    stagger = 0.11,
    goldLast = false,
    trigger = "scroll",
    y = 24,
    blur = 8,
  } = opts;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // load reveals wait for the font-ready gate — but pre-hide the target now so the
      // finished headline never paints in its final state before surfacing (no flash-replay)
      if (trigger === "load" && !ready) {
        if (!reduce) gsap.set(el, { autoAlpha: 0 });
        return;
      }

      const scrollOpts =
        trigger === "scroll"
          ? { scrollTrigger: { trigger: el, start: "top 85%", once: true } }
          : {};

      if (reduce) {
        gsap.from(el, { autoAlpha: 0, duration: 0.4, ...scrollOpts });
        return;
      }

      // Devanagari guard: force word-level when the node holds Devanagari
      const type: "words" | "lines" =
        DEVANAGARI.test(el.textContent || "") && split !== "lines" ? "words" : split;

      const st = new SplitText(el, {
        type,
        linesClass: "st-line",
        wordsClass: "st-word",
      });
      const units = (type === "lines" ? st.lines : st.words) as HTMLElement[];

      const goldEl = goldLast ? (el.querySelector("[data-gold]") as HTMLElement | null) : null;
      const goldUnit = goldEl
        ? units.find((u) => u === goldEl || goldEl.contains(u) || u.contains(goldEl)) ?? null
        : null;
      const mainUnits = goldUnit ? units.filter((u) => u !== goldUnit) : units;

      gsap.set(units, { willChange: "transform, filter, opacity" });

      const t1 = gsap.from(mainUnits, {
        y,
        autoAlpha: 0,
        filter: `blur(${blur}px)`,
        ease: "breath",
        duration: 1.0,
        stagger,
        ...scrollOpts,
        onComplete: () => gsap.set(mainUnits, { clearProps: "filter,willChange" }),
      });

      let t2: gsap.core.Tween | undefined;
      if (goldUnit) {
        t2 = gsap.from(goldUnit, {
          y,
          autoAlpha: 0,
          filter: `blur(${blur}px)`,
          scale: 1.015,
          transformOrigin: "50% 100%",
          ease: "breath",
          duration: 1.3,
          delay: 0.25 + mainUnits.length * stagger * 0.4,
          ...scrollOpts,
          onComplete: () => gsap.set(goldUnit, { clearProps: "filter,willChange" }),
        });
      }

      // kill in-flight tweens + clear will-change before SplitText restores the DOM,
      // so an interrupted reveal (fast scroll, overlay close, fast-refresh) never leaks
      return () => {
        t1.kill();
        t2?.kill();
        gsap.set(units, { clearProps: "filter,willChange" });
        st.revert();
      };
    },
    { scope: ref, dependencies: [reduce, ready] }
  );
}
