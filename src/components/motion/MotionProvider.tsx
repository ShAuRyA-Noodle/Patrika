"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { MotionContext } from "@/lib/motion/context";
import Waterline from "./Waterline";
import InkCursor from "./InkCursor";

/**
 * The single source of truth for the whole motion language.
 * - registers GSAP plugins + house eases (also done at module-eval, belt + braces)
 * - owns the ONE Lenis instance and hands lenis.raf to gsap.ticker (single RAF —
 *   this replaces SmoothScroll's own requestAnimationFrame loop; never run two)
 * - exposes reduce / fine / ready / lenis via context
 * - holds the "ready" gate until fonts settle so the giant Devanagari headline
 *   never surfaces into a font-swap reflow
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({ reduce: false, fine: false, ready: false });
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    registerGsap();

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqFine = window.matchMedia("(pointer: fine)");
    const reduce = mqReduce.matches;

    const instance = new Lenis({
      duration: 1.25,
      // exponential ease-out — the Apple/Framer "glide to a stop" feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: reduce ? 1 : 0.085,
      smoothWheel: !reduce,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });
    lenisRef.current = instance;
    setLenis(instance);

    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // child ScrollTriggers register in child effects (which run before this parent
    // effect); recompute them now that Lenis is driving the ticker
    ScrollTrigger.refresh();

    // reduced-motion / pointer state, kept live
    const syncMedia = () =>
      setState((s) => ({ ...s, reduce: mqReduce.matches, fine: mqFine.matches }));
    syncMedia();
    mqReduce.addEventListener("change", syncMedia);
    mqFine.addEventListener("change", syncMedia);

    // ready gate — wait for fonts (max 600ms) before allowing the load reveal
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setState((s) => ({ ...s, ready: true }));
      ScrollTrigger.refresh();
    };
    const maxWait = window.setTimeout(finish, 600);
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
    if (fonts?.ready) fonts.ready.then(finish).catch(finish);
    else finish();

    return () => {
      window.clearTimeout(maxWait);
      gsap.ticker.remove(tick);
      instance.off("scroll", onScroll);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      mqReduce.removeEventListener("change", syncMedia);
      mqFine.removeEventListener("change", syncMedia);
    };
  }, []);

  return (
    <MotionContext.Provider value={{ ...state, lenis }}>
      <Waterline />
      {children}
      <InkCursor />
    </MotionContext.Provider>
  );
}
