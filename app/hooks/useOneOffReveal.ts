"use client";

import { useCallback, useEffect, useState } from "react";

export function useOneOffReveal<T extends Element>() {
  const [element, setElement] = useState<T | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const ref = useCallback((node: T | null) => setElement(node), []);

  useEffect(() => {
    if (!element || hasPlayed) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setHasPlayed(true);
        observer.unobserve(element);
      },
      {
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.05,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, hasPlayed]);

  return { ref, hasPlayed };
}
