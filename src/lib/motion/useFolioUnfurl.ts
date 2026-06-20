"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type RefObject } from "react";
import { gsap } from "./gsap";
import { useMotion } from "./context";

export type FolioRefs = {
  sheetRef: RefObject<HTMLElement | null>;
  bottomBarRef?: RefObject<HTMLElement | null>;
};

/**
 * The manuscript unfurl/roll-up ritual for the reading overlay — the site's one
 * cathartic exhale. On mount the sheet UNFURLS from its rolled top bar
 * (scaleY 0.86→1, transformOrigin top, +y settle, blur 6→0); the bottom bar trails.
 * `close()` rolls it respectfully back up and resolves so the caller can then unmount.
 *
 * NEVER animates height/top — scaleY + transformOrigin + translate only (no reflow).
 * framer owns ONLY the backdrop opacity, so the two libs never fight the same element.
 */
export function useFolioUnfurl(refs: FolioRefs, open: boolean) {
  const { reduce } = useMotion();
  const closeRef = useRef<() => Promise<void>>(() => Promise.resolve());

  useGSAP(
    () => {
      const sheet = refs.sheetRef.current;
      if (!sheet) return;

      if (reduce) {
        gsap.set(sheet, { autoAlpha: 1, scaleY: 1, y: 0, clearProps: "filter" });
        closeRef.current = () => Promise.resolve();
        return;
      }

      gsap.set(sheet, { transformOrigin: "50% 0%" });
      const tl = gsap.timeline();
      tl.fromTo(
        sheet,
        { autoAlpha: 0, scaleY: 0.86, y: -14, filter: "blur(6px)" },
        { autoAlpha: 1, scaleY: 1, y: 0, filter: "blur(0px)", duration: 0.95, ease: "breath" }
      );
      if (refs.bottomBarRef?.current) {
        tl.fromTo(
          refs.bottomBarRef.current,
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "breath" },
          0.12
        );
      }

      closeRef.current = () =>
        new Promise<void>((resolve) => {
          gsap.to(sheet, {
            scaleY: 0.94,
            y: -10,
            autoAlpha: 0,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "breath",
            onComplete: () => resolve(),
          });
        });

      return () => {
        tl.kill();
      };
    },
    { scope: refs.sheetRef, dependencies: [open, reduce] }
  );

  return { close: () => closeRef.current() };
}
