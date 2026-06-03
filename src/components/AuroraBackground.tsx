"use client";

// Fixed, pointer-events-none warm aurora that drifts slowly behind all content.
// Sits behind the page (painted before <main>, same stacking context) and never
// intercepts clicks. Motion is pure CSS transform, so it costs almost nothing.
export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="live-bg"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}
    >
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />
    </div>
  );
}
