// Central GSAP setup. Registers plugins + the house custom eases exactly ONCE,
// on the client, at module-eval time (before any component effect runs — React
// fires child effects before parent effects, so registering inside a provider
// effect would be too late for nested hooks).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  registered = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip, Observer);
  // house ease — mirrors the existing cubic-bezier(0.16,1,0.3,1) "glide to a stop"
  CustomEase.create("breath", "M0,0 C0.16,1 0.3,1 1,1");
  // slower, heavier settle — silt coming to rest after the flood
  CustomEase.create("sediment", "M0,0 C0.22,1 0.36,1 1,1");
}

// register immediately on first client import
registerGsap();

export { gsap, ScrollTrigger, SplitText, CustomEase, Flip, Observer };
