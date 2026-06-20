import ThemeRoot from "@/components/ThemeRoot";
import AuroraBackground from "@/components/AuroraBackground";
import Archive from "@/components/Archive";

// Note: Lenis smooth-scroll now lives in MotionProvider (single shared RAF with the
// GSAP ticker). SmoothScroll.tsx is intentionally no longer mounted.
export default function Home() {
  return (
    <>
      <ThemeRoot theme="forest" />
      <AuroraBackground />
      <Archive />
    </>
  );
}
