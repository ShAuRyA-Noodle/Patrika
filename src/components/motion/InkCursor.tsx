"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/context";

/**
 * A deliberately de-gimmicked ink-dot. The native cursor is NEVER hidden — this only
 * augments. At rest invisible; over [data-ink] interactive elements it eases in and
 * pools. Gated hard on pointer:fine AND not reduced-motion. Transform/opacity only.
 */
export default function InkCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const { reduce, fine } = useMotion();

  useGSAP(
    () => {
      const dot = dotRef.current;
      if (!dot) return;
      if (reduce || !fine) {
        // a live OS toggle could leave the dot pooled — force it gone
        gsap.set(dot, { opacity: 0, scale: 1 });
        return;
      }

      gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0, scale: 1 });
      const xTo = gsap.quickTo(dot, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(dot, "y", { duration: 0.45, ease: "power3" });

      const inkOf = (n: EventTarget | null) =>
        (n as HTMLElement | null)?.closest?.("[data-ink]") ?? null;

      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const ink = inkOf(e.target);
        if (!ink) return;
        // crossing between children of the same ink region must not re-trigger
        if (inkOf(e.relatedTarget) === ink) return;
        gsap.to(dot, { opacity: 1, scale: 2.6, duration: 0.4, ease: "power2" });
      };
      const out = (e: PointerEvent) => {
        const ink = inkOf(e.target);
        if (!ink) return;
        // still moving within the same ink region → keep pooled
        if (inkOf(e.relatedTarget) === ink) return;
        gsap.to(dot, { opacity: 0, scale: 1, duration: 0.4, ease: "power2" });
      };
      const reset = () => gsap.to(dot, { opacity: 0, scale: 1, duration: 0.3, ease: "power2" });

      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerover", over, { passive: true });
      window.addEventListener("pointerout", out, { passive: true });
      document.documentElement.addEventListener("pointerleave", reset);
      window.addEventListener("blur", reset);

      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
        window.removeEventListener("pointerout", out);
        document.documentElement.removeEventListener("pointerleave", reset);
        window.removeEventListener("blur", reset);
      };
    },
    { dependencies: [reduce, fine] }
  );

  return <div ref={dotRef} aria-hidden className="ink-cursor" />;
}
