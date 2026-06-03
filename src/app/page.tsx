import SmoothScroll from "@/components/SmoothScroll";
import ThemeRoot from "@/components/ThemeRoot";
import AuroraBackground from "@/components/AuroraBackground";
import Archive from "@/components/Archive";

export default function Home() {
  return (
    <>
      <ThemeRoot theme="forest" />
      <SmoothScroll />
      <AuroraBackground />
      <Archive />
    </>
  );
}
