"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/context";

/**
 * Shared scroll-progress of the flood, published as a plain JS value so consumers
 * (the Hero figure-sink) read a number instead of forcing a per-frame getComputedStyle.
 */
export const waterline = { progress: 0 };

/**
 * THE central mechanic: one fixed, pre-softened dark wash anchored to the viewport
 * bottom — the buried flood the reader RAISES by scrolling. translateY + opacity are
 * scrubbed by global scroll; at the PullQuote the crest PEAKS, HOLDS and quivers ±2px
 * (the thesis: water that wants to spill but is never allowed). Pure transform/opacity.
 */
export default function Waterline() {
  const layerRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const { reduce } = useMotion();

  useGSAP(
    () => {
      const wash = washRef.current;
      if (!wash) return;

      if (reduce) {
        gsap.set(wash, { yPercent: 46, opacity: 0.12 });
        waterline.progress = 0.3;
        return;
      }

      gsap.set(wash, { yPercent: 72, opacity: 0 });
      const rise = gsap.to(wash, {
        yPercent: 30,
        opacity: 0.22,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            waterline.progress = self.progress;
          },
        },
      });

      // The Held Waterline: while the PullQuote is centered, the crest holds and
      // trembles ±2px on `y` (a transform channel distinct from the scrub's yPercent,
      // so the two never fight). Releases when the band leaves.
      let quiver: gsap.core.Tween | null = null;
      const anchor = document.querySelector("[data-waterline-crest-anchor]");
      const pin = anchor
        ? ScrollTrigger.create({
            trigger: anchor,
            start: "top 72%",
            end: "bottom 40%",
            onToggle: (self) => {
              if (self.isActive && !quiver) {
                quiver = gsap.to(wash, {
                  y: "-=2",
                  duration: 1.1,
                  ease: "sine.inOut",
                  yoyo: true,
                  repeat: -1,
                });
              } else if (!self.isActive && quiver) {
                quiver.kill();
                quiver = null;
                gsap.to(wash, { y: 0, duration: 0.6, ease: "sine.out" });
              }
            },
          })
        : null;

      // late layout shifts (priority image, late font) move the document height —
      // re-measure so the wash never over-rises past the words it must not cover
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        window.removeEventListener("load", onLoad);
        quiver?.kill();
        pin?.kill();
        rise.scrollTrigger?.kill();
        rise.kill();
      };
    },
    { scope: layerRef, dependencies: [reduce] }
  );

  return (
    <div
      ref={layerRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      <div ref={washRef} className="waterline-wash" />
    </div>
  );
}
