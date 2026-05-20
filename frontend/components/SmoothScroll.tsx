"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    let requestAnimationFrameId: number;
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrameId = requestAnimationFrame(raf);
    }

    requestAnimationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
