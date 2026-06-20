"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";

export type MotionState = {
  /** prefers-reduced-motion is on → collapse every animation to a static/0.4s-fade parity */
  reduce: boolean;
  /** pointer:fine (real mouse) → the InkCursor may manifest */
  fine: boolean;
  /** fonts are ready + first paint settled → the load surfacing reveal may fire */
  ready: boolean;
  lenis: Lenis | null;
};

export const MotionContext = createContext<MotionState>({
  reduce: false,
  fine: false,
  ready: false,
  lenis: null,
});

export const useMotion = () => useContext(MotionContext);
