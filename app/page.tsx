"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import SolutionsSection from "./components/SolutionsSection";

const sections = [
  { label: "método", href: "#metodo" },
  { label: "soluções", href: "#solucoes" },
  { label: "essência", href: "#essencia" },
  { label: "projetos", href: "#projetos" },
];

const methodSteps = [
  {
    number: "01",
    title: "Imersão",
    description: "Entendemos seu negócio, seus desafios e o que precisa mudar.",
  },
  {
    number: "02",
    title: "Estratégia",
    description: "Transformamos necessidades em um plano claro, viável e mensurável.",
  },
  {
    number: "03",
    title: "Desenvolvimento",
    description: "Construímos, testamos e refinamos cada parte da sua solução.",
  },
  {
    number: "04",
    title: "Evolução",
    description: "Acompanhamos resultados para que seu sistema continue crescendo.",
  },
];

const heroBackgrounds = [
  "/imagens/bg_1.jpg",
  "/imagens/bg_3.jpg",
  "/imagens/bg_5.jpg",
];

export default function Home() {
  const [isDocked, setIsDocked] = useState(false);
  const [hasHeroIntroFinished, setHasHeroIntroFinished] = useState(false);
  const [isHeroReplaying, setIsHeroReplaying] = useState(false);
  const [activeHeroBackground, setActiveHeroBackground] = useState(0);
  const [leavingHeroBackground, setLeavingHeroBackground] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("inicio");
  const [activeMethodStep, setActiveMethodStep] = useState(0);
  const [isMethodReversing, setIsMethodReversing] = useState(false);
  const [shouldLoadMethodMedia, setShouldLoadMethodMedia] = useState(false);
  const [hasCompletedMethod, setHasCompletedMethod] = useState(false);
  const [isSolutionsEntryVisible, setIsSolutionsEntryVisible] = useState(false);
  const [isSolutionsExperienceVisible, setIsSolutionsExperienceVisible] = useState(false);
  const methodSectionRef = useRef<HTMLElement | null>(null);
  const methodTimelineRef = useRef<HTMLDivElement | null>(null);
  const methodVideoRef = useRef<HTMLVideoElement | null>(null);
  const methodReverseVideoRef = useRef<HTMLVideoElement | null>(null);
  const methodIsReversingRef = useRef(false);
  const methodFrameRef = useRef<number | null>(null);
  const methodPlaybackFrameRef = useRef<number | null>(null);
  const methodPlaybackTokenRef = useRef(0);
  const methodFinalReadyRef = useRef(false);
  const solutionsEntryRef = useRef<HTMLElement | null>(null);
  const wasDockedRef = useRef(false);
  const replayTimerRef = useRef<number | null>(null);
  const chromeFrameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    window.scrollTo(0, 0);

    const resetFrame = window.requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => window.cancelAnimationFrame(resetFrame);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("hero-intro-locked", !hasHeroIntroFinished);

    if (hasHeroIntroFinished) {
      return () => {
        root.classList.remove("hero-intro-locked");
      };
    }

    const preventScroll = (event: Event) => event.preventDefault();
    const preventScrollKeys = (event: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "End", "Home", "PageDown", "PageUp", " "].includes(
          event.key,
        )
      ) {
        event.preventDefault();
      }
    };
    const holdAtHero = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    window.scrollTo(0, 0);
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);
    window.addEventListener("scroll", holdAtHero, { passive: true });

    return () => {
      root.classList.remove("hero-intro-locked");
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
      window.removeEventListener("scroll", holdAtHero);
    };
  }, [hasHeroIntroFinished]);

  useEffect(() => {
    let backgroundInterval: number | null = null;
    let leavingTimer: number | null = null;
    let currentBackground = 0;

    const advanceBackground = () => {
      setLeavingHeroBackground(currentBackground);
      currentBackground = (currentBackground + 1) % heroBackgrounds.length;
      setActiveHeroBackground(currentBackground);

      if (leavingTimer) {
        window.clearTimeout(leavingTimer);
      }

      leavingTimer = window.setTimeout(() => {
        setLeavingHeroBackground(null);
      }, 1700);
    };

    const backgroundTimer = window.setTimeout(() => {
      advanceBackground();
      backgroundInterval = window.setInterval(advanceBackground, 7000);
    }, 7250);

    return () => {
      window.clearTimeout(backgroundTimer);
      if (leavingTimer) {
        window.clearTimeout(leavingTimer);
      }
      if (backgroundInterval) {
        window.clearInterval(backgroundInterval);
      }
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const introTimer = window.setTimeout(() => {
      setHasHeroIntroFinished(true);
    }, prefersReducedMotion ? 0 : 5250);

    const updateChrome = () => {
      const nextDocked = window.scrollY > window.innerHeight * 0.45;
      const methodSection = document.getElementById("metodo");
      const solutionsSection = document.getElementById("solucoes");
      const readingLine = window.scrollY + window.innerHeight * 0.38;

      if (solutionsSection && readingLine >= solutionsSection.offsetTop) {
        setActiveSection("solucoes");
      } else if (methodSection && readingLine >= methodSection.offsetTop) {
        setActiveSection("metodo");
      } else {
        setActiveSection("inicio");
      }

      if (wasDockedRef.current && !nextDocked) {
        setHasHeroIntroFinished(true);

        if (replayTimerRef.current) {
          window.clearTimeout(replayTimerRef.current);
        }

        setIsHeroReplaying(false);
        window.requestAnimationFrame(() => {
          setIsHeroReplaying(true);
          replayTimerRef.current = window.setTimeout(() => {
            setIsHeroReplaying(false);
          }, 2500);
        });
      }

      wasDockedRef.current = nextDocked;
      setIsDocked(nextDocked);
    };

    const scheduleChromeUpdate = () => {
      if (chromeFrameRef.current) {
        return;
      }

      chromeFrameRef.current = window.requestAnimationFrame(() => {
        chromeFrameRef.current = null;
        updateChrome();
      });
    };

    updateChrome();
    window.addEventListener("scroll", scheduleChromeUpdate, { passive: true });

    return () => {
      window.clearTimeout(introTimer);
      window.removeEventListener("scroll", scheduleChromeUpdate);
      if (chromeFrameRef.current) {
        window.cancelAnimationFrame(chromeFrameRef.current);
      }
      if (replayTimerRef.current) {
        window.clearTimeout(replayTimerRef.current);
      }
      if (methodFrameRef.current) {
        window.cancelAnimationFrame(methodFrameRef.current);
      }
      if (methodPlaybackFrameRef.current) {
        window.cancelAnimationFrame(methodPlaybackFrameRef.current);
      }
    };
  }, []);

  const syncMethodProgress = () => {
    const section = methodSectionRef.current;
    const timeline = methodTimelineRef.current;

    if (!section || !timeline) {
      return;
    }

    if (methodFrameRef.current) {
      window.cancelAnimationFrame(methodFrameRef.current);
    }

    methodFrameRef.current = window.requestAnimationFrame(() => {
      const pageRange = Math.max(section.offsetHeight - window.innerHeight, 1);
      const pageProgress = Math.min(
        Math.max((window.scrollY - section.offsetTop) / pageRange, 0),
        1,
      );
      const timelineProgress = Math.min(pageProgress / 0.94, 1);
      const timelineRange = Math.max(timeline.scrollHeight - timeline.clientHeight, 0);

      timeline.scrollTop = timelineProgress * timelineRange;
      section.style.setProperty("--method-exit", "0");

      setActiveMethodStep(Math.round(timelineProgress * (methodSteps.length - 1)));
      if (timelineProgress >= 0.995) {
        setHasCompletedMethod(true);
      }
    });
  };

  useEffect(() => {
    syncMethodProgress();
    window.addEventListener("scroll", syncMethodProgress, { passive: true });
    window.addEventListener("resize", syncMethodProgress);

    return () => {
      window.removeEventListener("scroll", syncMethodProgress);
      window.removeEventListener("resize", syncMethodProgress);
    };
  }, []);

  useEffect(() => {
    if (!isSolutionsEntryVisible || isSolutionsExperienceVisible) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const experienceTimer = window.setTimeout(
      () => setIsSolutionsExperienceVisible(true),
      prefersReducedMotion ? 900 : 3000,
    );

    return () => window.clearTimeout(experienceTimer);
  }, [isSolutionsEntryVisible, isSolutionsExperienceVisible]);

  useEffect(() => {
    if (!hasHeroIntroFinished || shouldLoadMethodMedia) {
      return;
    }

    const loadMethodMedia = () => setShouldLoadMethodMedia(true);
    const idleTimer = window.setTimeout(loadMethodMedia, 450);

    window.addEventListener("wheel", loadMethodMedia, { passive: true, once: true });
    window.addEventListener("touchstart", loadMethodMedia, { passive: true, once: true });

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("wheel", loadMethodMedia);
      window.removeEventListener("touchstart", loadMethodMedia);
    };
  }, [hasHeroIntroFinished, shouldLoadMethodMedia]);

  useEffect(() => {
    if (!hasCompletedMethod) {
      return;
    }

    let isTransitioning = false;
    let transitionFrame: number | null = null;
    let previousScrollBehavior: string | null = null;

    const animateScrollTo = (targetY: number, onComplete?: () => void) => {
      const startY = window.scrollY;
      const normalizedTargetY = Math.round(targetY);
      const distance = normalizedTargetY - startY;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const duration = prefersReducedMotion ? 1 : 1100;
      const startedAt = performance.now();

      isTransitioning = true;
      previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";

      const move = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);

        window.scrollTo(0, startY + distance * eased);

        if (progress < 1) {
          transitionFrame = window.requestAnimationFrame(move);
          return;
        }

        transitionFrame = null;
        window.scrollTo(0, normalizedTargetY);
        isTransitioning = false;
        document.documentElement.style.scrollBehavior = previousScrollBehavior ?? "";
        previousScrollBehavior = null;
        onComplete?.();
      };

      transitionFrame = window.requestAnimationFrame(move);
    };

    const transitionSections = (event: WheelEvent) => {
      const methodSection = methodSectionRef.current;
      const solutionsSection = solutionsEntryRef.current;

      if (!methodSection || !solutionsSection) {
        return;
      }

      const methodReturnY =
        methodSection.offsetTop + methodSection.offsetHeight - window.innerHeight;
      const isInsideSolutions =
        window.scrollY >= solutionsSection.offsetTop - 2 &&
        window.scrollY < solutionsSection.offsetTop + solutionsSection.offsetHeight;
      const isAtMethodExit =
        window.scrollY >= methodReturnY - window.innerHeight * 0.22 &&
        window.scrollY < solutionsSection.offsetTop;
      const shouldEnterSolutions = event.deltaY > 0 && isAtMethodExit;
      const shouldReturnToMethod = event.deltaY < 0 && isInsideSolutions;

      if (!shouldEnterSolutions && !shouldReturnToMethod && !isTransitioning) {
        return;
      }

      event.preventDefault();

      if (isTransitioning) {
        return;
      }

      if (shouldEnterSolutions) {
        if (!methodFinalReadyRef.current) {
          return;
        }

        setIsSolutionsExperienceVisible(false);
        setIsSolutionsEntryVisible(false);
        animateScrollTo(solutionsSection.offsetTop, () => {
          setIsSolutionsEntryVisible(true);
        });
        return;
      }

      animateScrollTo(methodReturnY, () => {
        setIsSolutionsExperienceVisible(false);
        setIsSolutionsEntryVisible(false);
      });
    };

    const syncNaturalSolutionsReveal = () => {
      const methodSection = methodSectionRef.current;
      const solutionsSection = solutionsEntryRef.current;

      if (!methodSection || !solutionsSection || isTransitioning) {
        return;
      }

      const methodReturnY =
        methodSection.offsetTop + methodSection.offsetHeight - window.innerHeight;
      const isAtSolutions =
        window.scrollY >= solutionsSection.offsetTop - 4 &&
        window.scrollY < solutionsSection.offsetTop + solutionsSection.offsetHeight;

      if (isAtSolutions && methodFinalReadyRef.current) {
        setIsSolutionsEntryVisible(true);
        return;
      }

      if (window.scrollY < Math.min(solutionsSection.offsetTop - 24, methodReturnY)) {
        setIsSolutionsExperienceVisible(false);
        setIsSolutionsEntryVisible(false);
      }
    };

    window.addEventListener("wheel", transitionSections, { passive: false });
    window.addEventListener("scroll", syncNaturalSolutionsReveal, { passive: true });

    return () => {
      window.removeEventListener("wheel", transitionSections);
      window.removeEventListener("scroll", syncNaturalSolutionsReveal);
      if (transitionFrame) {
        window.cancelAnimationFrame(transitionFrame);
      }
      if (previousScrollBehavior !== null) {
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
      }
    };
  }, [hasCompletedMethod]);

  const handleSolutionsNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    const solutionsSection = solutionsEntryRef.current;

    if (!solutionsSection) {
      return;
    }

    setIsSolutionsExperienceVisible(false);
    setIsSolutionsEntryVisible(false);
    solutionsSection.scrollIntoView({ behavior: "auto", block: "start" });
    window.history.replaceState(null, "", "#solucoes");

    window.requestAnimationFrame(() => {
      setIsSolutionsEntryVisible(true);
    });
  };

  useEffect(() => {
    const video = methodVideoRef.current;
    const reverseVideo = methodReverseVideoRef.current;

    if (
      !video ||
      !reverseVideo ||
      !Number.isFinite(video.duration) ||
      !Number.isFinite(reverseVideo.duration) ||
      video.readyState < 1 ||
      reverseVideo.readyState < 1
    ) {
      return;
    }

    const playbackToken = ++methodPlaybackTokenRef.current;
    let reverseSeekHandler: (() => void) | null = null;
    const isCurrentCommand = () => methodPlaybackTokenRef.current === playbackToken;

    if (methodPlaybackFrameRef.current) {
      window.cancelAnimationFrame(methodPlaybackFrameRef.current);
    }

    const duration = video.duration;
    const finalTime = Math.max(duration - 0.06, 0);
    const reverseFinalTime = Math.max(reverseVideo.duration - 0.06, 0);
    const toReverseTime = (time: number) =>
      Math.min(Math.max(reverseVideo.duration - time, 0), reverseFinalTime);
    const targetTime =
      activeMethodStep === methodSteps.length - 1
        ? finalTime
        : (activeMethodStep / (methodSteps.length - 1)) * duration;
    const startTime = methodIsReversingRef.current
      ? Math.max(duration - reverseVideo.currentTime, 0)
      : video.currentTime;

    if (activeMethodStep !== methodSteps.length - 1) {
      methodFinalReadyRef.current = false;
    }

    if (Math.abs(targetTime - startTime) < 0.06) {
      video.pause();
      reverseVideo.pause();
      video.currentTime = targetTime;
      reverseVideo.currentTime = toReverseTime(targetTime);
      if (activeMethodStep === methodSteps.length - 1) {
        methodFinalReadyRef.current = true;
        syncMethodProgress();
      }
      return;
    }

    if (targetTime > startTime) {
      reverseVideo.pause();
      video.currentTime = startTime;
      video.playbackRate = 3;
      methodIsReversingRef.current = false;
      setIsMethodReversing(false);

      const stopAtTarget = () => {
        if (!isCurrentCommand()) {
          return;
        }

        if (video.currentTime >= targetTime - 0.035) {
          video.pause();
          video.currentTime = targetTime;
          reverseVideo.currentTime = toReverseTime(targetTime);
          if (activeMethodStep === methodSteps.length - 1) {
            methodFinalReadyRef.current = true;
            syncMethodProgress();
          }
          methodPlaybackFrameRef.current = null;
          return;
        }

        methodPlaybackFrameRef.current = window.requestAnimationFrame(stopAtTarget);
      };

      void video
        .play()
        .then(() => {
          if (isCurrentCommand()) {
            methodPlaybackFrameRef.current = window.requestAnimationFrame(stopAtTarget);
          }
        })
        .catch(() => undefined);
    } else {
      methodFinalReadyRef.current = false;
      video.pause();
      reverseVideo.pause();
      reverseVideo.playbackRate = 3;

      const reverseStartTime = toReverseTime(startTime);
      const reverseTargetTime = toReverseTime(targetTime);

      const stopReverseAtTarget = () => {
        if (!isCurrentCommand()) {
          return;
        }

        if (reverseVideo.currentTime >= reverseTargetTime - 0.035) {
          reverseVideo.pause();
          reverseVideo.currentTime = reverseTargetTime;
          video.currentTime = targetTime;
          methodPlaybackFrameRef.current = null;
          return;
        }

        methodPlaybackFrameRef.current = window.requestAnimationFrame(stopReverseAtTarget);
      };

      const playReverse = () => {
        if (!isCurrentCommand()) {
          return;
        }

        methodIsReversingRef.current = true;
        setIsMethodReversing(true);
        void reverseVideo
          .play()
          .then(() => {
            if (isCurrentCommand()) {
              methodPlaybackFrameRef.current = window.requestAnimationFrame(stopReverseAtTarget);
            }
          })
          .catch(() => undefined);
      };

      if (Math.abs(reverseVideo.currentTime - reverseStartTime) < 0.06) {
        playReverse();
      } else {
        reverseSeekHandler = playReverse;
        reverseVideo.addEventListener("seeked", reverseSeekHandler, { once: true });
        reverseVideo.currentTime = reverseStartTime;
      }
    }

    return () => {
      if (methodPlaybackTokenRef.current === playbackToken) {
        methodPlaybackTokenRef.current += 1;
      }
      if (reverseSeekHandler) {
        reverseVideo.removeEventListener("seeked", reverseSeekHandler);
      }
      video.pause();
      reverseVideo.pause();
      if (methodPlaybackFrameRef.current) {
        window.cancelAnimationFrame(methodPlaybackFrameRef.current);
      }
    };
  }, [activeMethodStep]);

  const shouldRenderSolutionsExperience =
    isSolutionsEntryVisible || isSolutionsExperienceVisible;

  return (
    <main
      className={`site-shell ${isDocked ? "is-docked" : ""} ${
        hasHeroIntroFinished ? "is-intro-complete" : ""
      } ${
        isHeroReplaying ? "is-hero-replaying" : ""
      } section-${activeSection} ambient-theme-${activeHeroBackground} ${
        isSolutionsExperienceVisible ? "solutions-experience-active" : ""
      }`}
    >
      <section id="inicio" className="hero-section" aria-label="Crivo">
        {heroBackgrounds.map((background, index) => (
          <div
            key={background}
            className={`scene-bg ${activeHeroBackground === index ? "is-active" : ""} ${
              leavingHeroBackground === index ? "is-leaving" : ""
            }`}
            aria-hidden="true"
          >
            <div className="scene-bg-image">
              <Image
                className="scene-bg-media"
                src={background}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                quality={82}
              />
            </div>
          </div>
        ))}
        <div className="vignette" aria-hidden="true" />

        <p className="hero-service-line">
          Sistemas personalizados
          <br />
          para seu negócio
        </p>

        <h1 className="opening-line">
          Transformando o seu
          <br />
          negócio em ouro
        </h1>

        <section className="brand-reveal" aria-label="Crivo">
          <img
            className="brand-mark"
            src="/assets/crivo-mark-blue.png"
            alt=""
            aria-hidden="true"
          />
          <div className="word-mask">
            <img className="brand-word" src="/assets/crivo-word-blue.png" alt="Crivo" />
          </div>
        </section>
      </section>

      <div className="site-chrome">
        <a className="chrome-mark-link" href="#inicio" aria-label="Crivo início">
          <img className="chrome-mark" src="/assets/crivo-mark-blue.png" alt="" />
        </a>
        <nav className="glass-nav" aria-label="Seções do site">
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              onClick={
                section.href === "#solucoes" ? handleSolutionsNavigation : undefined
              }
              className={activeSection === section.href.slice(1) ? "is-active" : ""}
            >
              {section.label}
            </a>
          ))}
        </nav>
        <a className="chrome-cta" href="#solucoes" onClick={handleSolutionsNavigation}>
          Avançar
        </a>
      </div>

      <section
        ref={methodSectionRef}
        id="metodo"
        className="method-section"
        aria-labelledby="method-title"
      >
        <div className="method-layout">
          <div className="method-copy">
            <p className="section-kicker">Nosso método</p>
            <h2 id="method-title">Da ideia ao sistema em movimento.</h2>

            <div
              ref={methodTimelineRef}
              className="method-timeline"
              aria-label="Etapas do método Crivo"
            >
              <div className="method-scroll-spacer" aria-hidden="true" />
              {methodSteps.map((step, index) => (
                <article
                  key={step.number}
                  className={`method-step ${activeMethodStep === index ? "is-active" : ""}`}
                  aria-current={activeMethodStep === index ? "step" : undefined}
                >
                  <span className="method-step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
              <div className="method-scroll-spacer" aria-hidden="true" />
            </div>
          </div>

          <div
            className={`method-visual ${isMethodReversing ? "is-reversing" : ""}`}
            aria-label="Forma sendo construída"
          >
            <video
              ref={methodVideoRef}
              className="method-video-forward"
              src={shouldLoadMethodMedia ? "/videos/video.mp4" : undefined}
              muted
              playsInline
              preload={shouldLoadMethodMedia ? "metadata" : "none"}
              onLoadedMetadata={() => {
                syncMethodProgress();
              }}
            />
            <video
              ref={methodReverseVideoRef}
              className="method-video-reverse"
              src={shouldLoadMethodMedia ? "/videos/video-reverse.mp4" : undefined}
              muted
              playsInline
              preload={shouldLoadMethodMedia ? "metadata" : "none"}
              onLoadedMetadata={(event) => {
                event.currentTarget.currentTime = Math.max(event.currentTarget.duration - 0.06, 0);
              }}
            />
          </div>
        </div>
      </section>

      <section
        ref={solutionsEntryRef}
        id="solucoes"
        className={`solutions-entry ${isSolutionsEntryVisible ? "is-visible" : ""} ${
          isSolutionsExperienceVisible ? "is-experience-visible" : ""
        }`}
        aria-labelledby="solutions-entry-title"
      >
        <div className="solutions-entry-stage">
          <div className="solutions-entry-copy" aria-hidden={isSolutionsExperienceVisible}>
            <p>O que passa pelo Crivo?</p>
            <h2 id="solutions-entry-title">
              <span>Soluções alinhadas</span>
              <span>ao seu negócio</span>
            </h2>
          </div>

          <div
            className="solutions-experience"
            aria-label="Solucoes Crivo"
            aria-hidden={!isSolutionsExperienceVisible}
          >
            {heroBackgrounds.map((background, index) => (
              <div
                key={`solutions-${background}`}
                className={`solutions-bg ${
                  activeHeroBackground === index ? "is-active" : ""
                } ${leavingHeroBackground === index ? "is-leaving" : ""}`}
                aria-hidden="true"
              >
                <Image
                  className="solutions-bg-media"
                  src={background}
                  alt=""
                  fill
                  sizes="100vw"
                  quality={76}
                />
              </div>
            ))}
            <div className="solutions-ambient-light" aria-hidden="true" />
            {shouldRenderSolutionsExperience ? (
              <SolutionsSection isVisible={isSolutionsExperienceVisible} />
            ) : null}
          </div>
        </div>
      </section>

    </main>
  );
}
