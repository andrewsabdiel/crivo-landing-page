"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const layers = [1, 2, 3, 4, 5] as const;
const layerSpeeds = [0.45, 0.55, 0.68, 0.82, 1] as const;

export default function ParallaxLandscape({
  children,
  basePath,
}: {
  children: ReactNode;
  basePath: string;
}) {
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const artwork = story.querySelector<HTMLElement>(".parallax-artwork");
      const viewport = story.querySelector<HTMLElement>(".parallax-viewport");
      if (!artwork || !viewport) return;

      const context = gsap.context(() => {
        const distance = () => Math.max(
          0,
          artwork.offsetHeight - viewport.offsetHeight + artwork.offsetTop,
        );

        ScrollTrigger.create({
          trigger: story,
          pin: viewport,
          pinSpacing: false,
          start: "top top",
          end: "bottom top",
          invalidateOnRefresh: true,
        });

        layerSpeeds.forEach((speed, index) => {
          gsap.to(story.querySelector(`[data-landscape-layer="${index + 1}"]`), {
            y: () => -distance() * speed,
            ease: "none",
            scrollTrigger: {
              trigger: story,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          });
        });

        story.querySelectorAll<HTMLElement>("[data-story-title]").forEach((title) => {
          SplitText.create(title, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 55,
                autoAlpha: 0,
                duration: 0.75,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: title,
                  start: "top 85%",
                  once: true,
                },
              });
            },
          });
        });
      }, story);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <div className="parallax-story" ref={storyRef}>
      <div className="parallax-viewport" aria-hidden="true">
        <div
          className="parallax-mobile-base"
          style={{ backgroundImage: `url("${basePath}/imagens/parallax/vale-base-mobile.webp")` }}
        />
        <div className="parallax-artwork">
          {layers.map((layer) => (
            <Image
              key={layer}
              className="parallax-layer"
              data-landscape-layer={layer}
              src={`${basePath}/imagens/parallax/camada-${layer}.webp`}
              alt=""
              width={1536}
              height={2752}
              decoding="async"
              fetchPriority={layer === 1 ? "high" : "auto"}
              preload={layer === 1}
            />
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
