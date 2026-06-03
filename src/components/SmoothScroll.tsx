"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: 1.25,
      // exponential ease-out, the Apple/Framer "glide to a stop" feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: reduce ? 1 : 0.085,
      smoothWheel: !reduce,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
