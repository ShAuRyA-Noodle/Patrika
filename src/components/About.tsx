"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMotion } from "@/lib/motion/context";
import { useBreath } from "@/lib/motion/useBreath";
import { useRef } from "react";
import { houseEase } from "@/lib/motion/useStaggerReveal";

// Honest: every line below is drawn from what the family shared about the poet.
// Nothing is invented, there is no dedication, and no relationship is disclosed.
export default function About() {
  const { reduce } = useMotion();
  const breathRef = useRef<HTMLDivElement>(null);
  useBreath(breathRef, { period: 9, y: -5, scale: 1.01, opacity: 0.03 });

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(6px)" },
    whileInView: reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.4 } as const,
    transition: { duration: reduce ? 0.4 : 1.05, ease: houseEase, delay: reduce ? 0 : delay },
  });

  return (
    <section id="about" className="py-[var(--space-section)]">
      <div className="mx-auto grid max-w-[1080px] items-center gap-14 [hyphens:none] md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* the poet at her writing */}
        <motion.figure {...rise(0)} className="relative m-0 mx-auto w-full max-w-[440px]">
          <div ref={breathRef} className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/art/poet.jpg"
              alt="An ink-wash of the poet at her writing, seen from behind, dissolving into the paper."
              fill
              sizes="(max-width: 768px) 88vw, 440px"
              className="object-cover grayscale contrast-[1.05] mix-blend-multiply"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4"
              style={{ background: "linear-gradient(to top, var(--c-paper), transparent)" }}
            />
          </div>
        </motion.figure>

        {/* the words */}
        <div className="text-center md:text-left">
          <motion.div {...rise(0.05)} className="mb-7 flex items-center justify-center gap-4 md:justify-start">
            <span className="eyebrow-quiet text-[color:var(--c-ink-faint-text)]">the poet</span>
            <span className="h-px w-14 bg-[color:var(--c-rule)]" />
          </motion.div>

          <motion.h2
            {...rise(0.1)}
            className="deboss text-[clamp(40px,7vw,76px)] leading-[1.04] text-[color:var(--c-ink)]"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            भारती शोरी
          </motion.h2>
          <motion.p
            {...rise(0.15)}
            className="mt-3 text-lg italic text-[color:var(--c-ink-soft)] md:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bharti Shori, Delhi
          </motion.p>

          <motion.p
            {...rise(0.2)}
            className="mt-9 text-[21px] leading-[1.8] text-[color:var(--c-ink)] md:text-[23px]"
            style={{ fontFamily: "var(--font-deva)" }}
          >
            भारती शोरी दिल्ली से हैं। कवयित्री बनने की चाह उनके मन में हमेशा रही, पर वे उस राह पर चल नहीं पाईं। इसलिए अब वे लिखती हैं, अपने भीतर के भावों और अपने आसपास की दुनिया से। ये कविताएँ उनके बहुत क़रीब हैं, और उनके लिए गहरे मायने रखती हैं।
          </motion.p>

          <motion.p
            {...rise(0.25)}
            className="mt-7 text-lg leading-[1.75] text-[color:var(--c-ink-soft)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Bharti Shori is from Delhi. The wish to become a poet stayed with her always, though she was never able to follow that path. So she writes now, from what she feels within and from the world around her. These poems are close to her, and they hold deep meaning.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
