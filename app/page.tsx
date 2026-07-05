"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import SolutionsSection from "./components/SolutionsSection";
import { useOneOffReveal } from "./hooks/useOneOffReveal";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const sections = [
  { label: "método", href: "#metodo" },
  { label: "soluções", href: "#solucoes" },
  { label: "essência", href: "#essencia" },
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
  assetPath("/imagens/bg_1.jpg"),
  assetPath("/imagens/bg_3.jpg"),
  assetPath("/imagens/bg_5.jpg"),
];

const essenceCards = [
  {
    title: "O que sustenta",
    caption: "Organização, clareza e confiança",
    detail: "logic",
  },
  {
    title: "O que se sente",
    caption: "Tela simples, bonita e fácil de usar",
    detail: "sensory",
  },
] as const;

const essenceDetails = {
  logic: {
    title: "O que sustenta",
    caption: "Organização, clareza e confiança",
    panelLabels: ["Processo", "Controle"],
    images: [
      assetPath("/imagens/essencia/back_images/bg_1.jpg"),
      assetPath("/imagens/essencia/back_images/bg_2.jpg"),
      assetPath("/imagens/essencia/back_images/bg_3.jpg"),
    ],
  },
  sensory: {
    title: "O que se sente",
    caption: "Tela simples, bonita e fácil de usar",
    panelLabels: ["Clareza", "Experiência"],
    images: [
      assetPath("/imagens/essencia/front_images/bg_1.jpg"),
      assetPath("/imagens/essencia/front_images/bg_2.jpg"),
      assetPath("/imagens/essencia/front_images/bg_3.jpg"),
    ],
  },
} as const;

type EssenceDetail = keyof typeof essenceDetails;

export default function Home() {
  const [isDocked, setIsDocked] = useState(false);
  const [hasHeroIntroFinished, setHasHeroIntroFinished] = useState(false);
  const [isHeroReplaying, setIsHeroReplaying] = useState(false);
  const [activeHeroBackground, setActiveHeroBackground] = useState(0);
  const [leavingHeroBackground, setLeavingHeroBackground] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("inicio");
  const [chromeSection, setChromeSection] = useState("inicio");
  const [isChromeRelocating, setIsChromeRelocating] = useState(false);
  const [activeMethodStep, setActiveMethodStep] = useState(0);
  const [isMethodReversing, setIsMethodReversing] = useState(false);
  const [shouldLoadMethodMedia, setShouldLoadMethodMedia] = useState(false);
  const [hasCompletedMethod, setHasCompletedMethod] = useState(false);
  const [isSolutionsEntryVisible, setIsSolutionsEntryVisible] = useState(false);
  const [isSolutionsExperienceVisible, setIsSolutionsExperienceVisible] = useState(false);
  const [isEssenceEntryVisible, setIsEssenceEntryVisible] = useState(false);
  const [isEssenceExperienceVisible, setIsEssenceExperienceVisible] = useState(false);
  const [activeEssenceDetail, setActiveEssenceDetail] = useState<EssenceDetail | null>(null);
  const [lastEssenceDetail, setLastEssenceDetail] = useState<EssenceDetail>("logic");
  const [activeEssenceSlide, setActiveEssenceSlide] = useState(0);
  const { ref: essenceRevealRef, hasPlayed: hasEssenceRevealPlayed } =
    useOneOffReveal<HTMLElement>();
  const methodSectionRef = useRef<HTMLElement | null>(null);
  const methodTimelineRef = useRef<HTMLDivElement | null>(null);
  const methodVideoRef = useRef<HTMLVideoElement | null>(null);
  const methodReverseVideoRef = useRef<HTMLVideoElement | null>(null);
  const essenceSectionRef = useRef<HTMLElement | null>(null);
  const methodIsReversingRef = useRef(false);
  const methodFrameRef = useRef<number | null>(null);
  const methodPlaybackFrameRef = useRef<number | null>(null);
  const methodPlaybackTokenRef = useRef(0);
  const methodFinalReadyRef = useRef(false);
  const solutionsEntryRef = useRef<HTMLElement | null>(null);
  const wasDockedRef = useRef(false);
  const replayTimerRef = useRef<number | null>(null);
  const chromeFrameRef = useRef<number | null>(null);
  const chromeHasMountedRef = useRef(false);
  const chromeSectionRef = useRef("inicio");
  const chromeHideTimerRef = useRef<number | null>(null);
  const chromeShowTimerRef = useRef<number | null>(null);
  const suppressHeroReplayUntilRef = useRef(0);
  const lockEssenceNavigationUntilRef = useRef(0);
  const cancelSectionTransitionRef = useRef<(() => void) | null>(null);
  const setEssenceSectionRef = useCallback(
    (node: HTMLElement | null) => {
      essenceSectionRef.current = node;
      essenceRevealRef(node);
    },
    [essenceRevealRef],
  );

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    const initialHash = window.location.hash;
    const initialHashTimers: number[] = [];

    if (!initialHash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
      window.scrollTo(0, 0);
    } else {
      setHasHeroIntroFinished(true);
    }

    const alignInitialHash = () => {
      if (!initialHash) {
        window.scrollTo(0, 0);
        return;
      }

      const target = document.querySelector<HTMLElement>(initialHash);

      if (target) {
        window.scrollTo(0, target.offsetTop);
      }
    };

    const resetFrame = window.requestAnimationFrame(() => {
      alignInitialHash();
    });

    if (initialHash) {
      initialHashTimers.push(
        window.setTimeout(alignInitialHash, 80),
        window.setTimeout(alignInitialHash, 260),
        window.setTimeout(alignInitialHash, 700),
      );
    }

    return () => {
      window.cancelAnimationFrame(resetFrame);
      initialHashTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const shouldLockHero = !hasHeroIntroFinished && !window.location.hash;

    root.classList.toggle("hero-intro-locked", shouldLockHero);

    if (!shouldLockHero) {
      return () => {
        root.classList.remove("hero-intro-locked");
      };
    }

    window.scrollTo(0, 0);

    return () => {
      root.classList.remove("hero-intro-locked");
    };
  }, [hasHeroIntroFinished]);

  useEffect(() => {
    if (!hasHeroIntroFinished || !window.location.hash) {
      return;
    }

    const target = document.querySelector<HTMLElement>(window.location.hash);

    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      window.scrollTo(0, target.offsetTop);
    });
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
    const alignHashTarget = (hash: string) => {
      const target = document.querySelector<HTMLElement>(hash);

      if (!target) {
        return;
      }

      const align = () => {
        window.scrollTo(0, target.offsetTop);
      };

      align();
      window.requestAnimationFrame(align);
      window.setTimeout(align, 80);
      window.setTimeout(align, 260);
    };

    const syncHashSectionState = () => {
      if (window.location.hash === "#solucoes") {
        const isMobileSolutions = window.matchMedia("(max-width: 720px)").matches;

        setHasCompletedMethod(true);
        methodFinalReadyRef.current = true;
        setIsSolutionsEntryVisible(true);
        setIsSolutionsExperienceVisible(isMobileSolutions);
        setIsEssenceEntryVisible(false);
        setIsEssenceExperienceVisible(false);
        setActiveEssenceDetail(null);
        setActiveSection("solucoes");
        alignHashTarget("#solucoes");
        return;
      }

      if (window.location.hash === "#essencia") {
        const isMobileEssence = window.matchMedia("(max-width: 720px)").matches;

        lockEssenceNavigationUntilRef.current = performance.now() + 1400;
        setIsSolutionsEntryVisible(false);
        setIsSolutionsExperienceVisible(false);
        setActiveEssenceDetail(null);
        setActiveEssenceSlide(0);
        setIsEssenceEntryVisible(true);
        setIsEssenceExperienceVisible(isMobileEssence);
        setActiveSection("essencia");
        alignHashTarget("#essencia");
        return;
      }

      if (window.location.hash === "#avancar") {
        if (performance.now() < lockEssenceNavigationUntilRef.current) {
          const isMobileEssence = window.matchMedia("(max-width: 720px)").matches;

          window.history.replaceState(null, "", "#essencia");
          setIsSolutionsEntryVisible(false);
          setIsSolutionsExperienceVisible(false);
          setActiveEssenceDetail(null);
          setActiveEssenceSlide(0);
          setIsEssenceEntryVisible(true);
          setIsEssenceExperienceVisible(isMobileEssence);
          setActiveSection("essencia");
          alignHashTarget("#essencia");
          return;
        }

        setIsSolutionsEntryVisible(false);
        setIsSolutionsExperienceVisible(false);
        setActiveEssenceDetail(null);
        setActiveSection("avancar");
        alignHashTarget("#avancar");
        return;
      }

      if (window.location.hash === "#metodo") {
        setIsSolutionsEntryVisible(false);
        setIsSolutionsExperienceVisible(false);
        setIsEssenceEntryVisible(false);
        setIsEssenceExperienceVisible(false);
        setActiveEssenceDetail(null);
        setActiveSection("metodo");
        alignHashTarget("#metodo");
      }
    };

    syncHashSectionState();
    window.addEventListener("hashchange", syncHashSectionState);

    return () => {
      window.removeEventListener("hashchange", syncHashSectionState);
    };
  }, []);

  useEffect(() => {
    if (!chromeHasMountedRef.current) {
      chromeHasMountedRef.current = true;
      chromeSectionRef.current = activeSection;
      setChromeSection(activeSection);
      return;
    }

    if (activeSection === chromeSectionRef.current) {
      return;
    }

    if (chromeHideTimerRef.current) {
      window.clearTimeout(chromeHideTimerRef.current);
    }

    if (chromeShowTimerRef.current) {
      window.clearTimeout(chromeShowTimerRef.current);
    }

    setIsChromeRelocating(true);

    chromeHideTimerRef.current = window.setTimeout(() => {
      chromeSectionRef.current = activeSection;
      setChromeSection(activeSection);

      chromeShowTimerRef.current = window.setTimeout(() => {
        setIsChromeRelocating(false);
      }, 70);
    }, 110);

    return () => {
      if (chromeHideTimerRef.current) {
        window.clearTimeout(chromeHideTimerRef.current);
      }

      if (chromeShowTimerRef.current) {
        window.clearTimeout(chromeShowTimerRef.current);
      }
    };
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "solucoes") {
      return;
    }

    setIsSolutionsEntryVisible(false);
    setIsSolutionsExperienceVisible(false);
  }, [activeSection]);

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
      const essenceSection = document.getElementById("essencia");
      const advanceSection = document.getElementById("avancar");
      const readingLine = window.scrollY + window.innerHeight * 0.38;

      if (window.location.hash === "#avancar") {
        setActiveSection("avancar");
      } else if (window.location.hash === "#essencia") {
        setActiveSection("essencia");
      } else if (window.location.hash === "#solucoes") {
        setActiveSection("solucoes");
      } else if (window.location.hash === "#metodo") {
        setActiveSection("metodo");
      } else if (advanceSection && readingLine >= advanceSection.offsetTop) {
        setActiveSection("avancar");
      } else if (essenceSection && readingLine >= essenceSection.offsetTop) {
        setActiveSection("essencia");
      } else if (solutionsSection && readingLine >= solutionsSection.offsetTop) {
        setActiveSection("solucoes");
      } else if (methodSection && readingLine >= methodSection.offsetTop) {
        setActiveSection("metodo");
      } else {
        setActiveSection("inicio");
      }

      if (
        wasDockedRef.current &&
        !nextDocked &&
        performance.now() > suppressHeroReplayUntilRef.current
      ) {
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
    window.addEventListener("hashchange", scheduleChromeUpdate);
    window.addEventListener("resize", scheduleChromeUpdate);

    return () => {
      window.clearTimeout(introTimer);
      window.removeEventListener("scroll", scheduleChromeUpdate);
      window.removeEventListener("hashchange", scheduleChromeUpdate);
      window.removeEventListener("resize", scheduleChromeUpdate);
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
    let essenceScrollFrame: number | null = null;

    const syncEssenceReveal = () => {
      const section = essenceSectionRef.current;

      if (!section) {
        return;
      }

      const readingLine = window.scrollY + window.innerHeight * 0.48;
      const isInsideEssence =
        readingLine >= section.offsetTop &&
        window.scrollY < section.offsetTop + section.offsetHeight - window.innerHeight * 0.12;

      if (isInsideEssence) {
        const isMobileEssence = window.matchMedia("(max-width: 720px)").matches;

        setIsEssenceEntryVisible(true);
        if (window.location.hash === "#essencia" && isMobileEssence) {
          setIsEssenceExperienceVisible(true);
        }
        return;
      }

      if (
        window.scrollY < section.offsetTop - window.innerHeight * 0.4 ||
        window.scrollY >= section.offsetTop + section.offsetHeight
      ) {
        setIsEssenceEntryVisible(false);
        setIsEssenceExperienceVisible(false);
        setActiveEssenceDetail(null);
      }
    };

    const scheduleEssenceReveal = () => {
      if (essenceScrollFrame) {
        return;
      }

      essenceScrollFrame = window.requestAnimationFrame(() => {
        essenceScrollFrame = null;
        syncEssenceReveal();
      });
    };

    syncEssenceReveal();
    window.addEventListener("scroll", scheduleEssenceReveal, { passive: true });
    window.addEventListener("resize", scheduleEssenceReveal);

    return () => {
      window.removeEventListener("scroll", scheduleEssenceReveal);
      window.removeEventListener("resize", scheduleEssenceReveal);
      if (essenceScrollFrame) {
        window.cancelAnimationFrame(essenceScrollFrame);
      }
    };
  }, []);

  useEffect(() => {
    if (!isEssenceEntryVisible || isEssenceExperienceVisible) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobileEssence = window.matchMedia("(max-width: 720px)").matches;
    const essenceTimer = window.setTimeout(
      () => setIsEssenceExperienceVisible(true),
      prefersReducedMotion || isMobileEssence ? 0 : 1500,
    );

    return () => window.clearTimeout(essenceTimer);
  }, [isEssenceEntryVisible, isEssenceExperienceVisible]);

  useEffect(() => {
    if (!activeEssenceDetail) {
      setActiveEssenceSlide(0);
      return;
    }

    const slideCount = essenceDetails[activeEssenceDetail].images.length;
    const slideTimer = window.setInterval(() => {
      setActiveEssenceSlide((current) => (current + 1) % slideCount);
    }, 7600);

    return () => window.clearInterval(slideTimer);
  }, [activeEssenceDetail]);

  useEffect(() => {
    if (
      activeSection !== "solucoes" ||
      !isSolutionsEntryVisible ||
      isSolutionsExperienceVisible
    ) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobileSolutions = window.matchMedia("(max-width: 720px)").matches;
    const experienceTimer = window.setTimeout(() => {
      if (window.location.hash !== "#solucoes") {
        return;
      }

      setIsSolutionsExperienceVisible(true);
    }, prefersReducedMotion || isMobileSolutions ? 0 : 1500);

    return () => window.clearTimeout(experienceTimer);
  }, [activeSection, isSolutionsEntryVisible, isSolutionsExperienceVisible]);

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
    let isTransitioning = false;
    let transitionFrame: number | null = null;
    let previousScrollBehavior: string | null = null;
    let previousScrollY = window.scrollY;
    let suppressReturnToMethodUntil = 0;
    let sectionSnapLockedUntil = 0;

    const cancelSectionTransition = () => {
      if (transitionFrame) {
        window.cancelAnimationFrame(transitionFrame);
        transitionFrame = null;
      }

      isTransitioning = false;
      sectionSnapLockedUntil = performance.now() + 360;

      if (previousScrollBehavior !== null) {
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        previousScrollBehavior = null;
      }
    };

    cancelSectionTransitionRef.current = cancelSectionTransition;

    const animateScrollTo = (
      targetY: number,
      onComplete?: () => void,
      durationMs = 620,
    ) => {
      const startY = window.scrollY;
      const normalizedTargetY = Math.round(targetY);
      const distance = normalizedTargetY - startY;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const duration = prefersReducedMotion ? 1 : durationMs;
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
        previousScrollY = normalizedTargetY;
        sectionSnapLockedUntil = performance.now() + 360;
        document.documentElement.style.scrollBehavior = previousScrollBehavior ?? "";
        previousScrollBehavior = null;
        onComplete?.();
      };

      transitionFrame = window.requestAnimationFrame(move);
    };

    const transitionSections = (event: WheelEvent) => {
      const methodSection = methodSectionRef.current;
      const solutionsSection = solutionsEntryRef.current;
      const essenceSection = essenceSectionRef.current;
      const advanceSection = document.getElementById("avancar");
      const eventTarget = event.target;

      if (!methodSection || !solutionsSection || !essenceSection || !advanceSection) {
        return;
      }

      if (window.matchMedia("(max-width: 720px)").matches) {
        return;
      }

      if (isTransitioning) {
        event.preventDefault();
        return;
      }

      if (
        eventTarget instanceof Element &&
        eventTarget.closest(".solutions-protagonist-stage, .solutions-crown")
      ) {
        return;
      }

      if (Math.abs(event.deltaY) < 2) {
        return;
      }

      const now = performance.now();
      if (now < sectionSnapLockedUntil) {
        event.preventDefault();
        return;
      }

      const methodReturnY =
        methodSection.offsetTop + methodSection.offsetHeight - window.innerHeight;
      const readingLine = window.scrollY + window.innerHeight * 0.5;
      const isCurrentSolutions =
        readingLine >= solutionsSection.offsetTop &&
        readingLine < solutionsSection.offsetTop + solutionsSection.offsetHeight;
      const isCurrentMethod =
        readingLine >= methodSection.offsetTop &&
        readingLine < methodSection.offsetTop + methodSection.offsetHeight;
      const isCurrentEssence =
        readingLine >= essenceSection.offsetTop &&
        readingLine < essenceSection.offsetTop + essenceSection.offsetHeight;
      const isCurrentAdvance =
        readingLine >= advanceSection.offsetTop &&
        readingLine < advanceSection.offsetTop + advanceSection.offsetHeight;
      const isAtMethodExit =
        window.scrollY >= methodReturnY - window.innerHeight * 0.42 &&
        window.scrollY < solutionsSection.offsetTop;
      const shouldEnterSolutions =
        hasCompletedMethod &&
        methodFinalReadyRef.current &&
        event.deltaY > 0 &&
        isCurrentMethod &&
        isAtMethodExit;
      const shouldReturnToMethod =
        now >= suppressReturnToMethodUntil &&
        event.deltaY < 0 &&
        (isCurrentSolutions ||
          (window.scrollY >= solutionsSection.offsetTop - window.innerHeight * 0.2 &&
            window.scrollY < solutionsSection.offsetTop + solutionsSection.offsetHeight));
      const shouldEnterEssence =
        event.deltaY > 0 &&
        isCurrentSolutions;
      const shouldReturnToSolutions =
        event.deltaY < 0 &&
        isCurrentEssence;
      const shouldEnterAdvance =
        now >= lockEssenceNavigationUntilRef.current &&
        event.deltaY > 0 &&
        isCurrentEssence;
      const shouldReturnToEssence =
        event.deltaY < 0 &&
        isCurrentAdvance;

      if (
        !shouldEnterSolutions &&
        !shouldReturnToMethod &&
        !shouldEnterEssence &&
        !shouldReturnToSolutions &&
        !shouldEnterAdvance &&
        !shouldReturnToEssence &&
        !isTransitioning
      ) {
        return;
      }

      event.preventDefault();

      if (shouldEnterSolutions) {
        setIsSolutionsExperienceVisible(false);
        setIsSolutionsEntryVisible(false);
        animateScrollTo(solutionsSection.offsetTop, () => {
          window.history.replaceState(null, "", "#solucoes");
          setActiveSection("solucoes");
          setIsSolutionsEntryVisible(true);
        }, 780);
        return;
      }

      if (shouldEnterEssence) {
        lockEssenceNavigationUntilRef.current = performance.now() + 1600;
        setIsSolutionsExperienceVisible(false);
        setIsSolutionsEntryVisible(false);
        setActiveEssenceDetail(null);
        setIsEssenceEntryVisible(false);
        setIsEssenceExperienceVisible(false);
        animateScrollTo(essenceSection.offsetTop, () => {
          window.history.replaceState(null, "", "#essencia");
          setActiveSection("essencia");
          setIsEssenceEntryVisible(true);
        });
        return;
      }

      if (shouldReturnToSolutions) {
        setActiveEssenceDetail(null);
        animateScrollTo(solutionsSection.offsetTop, () => {
          window.history.replaceState(null, "", "#solucoes");
          setActiveSection("solucoes");
          setIsSolutionsEntryVisible(true);
          setIsEssenceEntryVisible(false);
          setIsEssenceExperienceVisible(false);
          suppressReturnToMethodUntil = performance.now() + 1200;
        });
        return;
      }

      if (shouldEnterAdvance) {
        setIsSolutionsExperienceVisible(false);
        setIsSolutionsEntryVisible(false);
        setActiveEssenceDetail(null);
        animateScrollTo(advanceSection.offsetTop, () => {
          window.history.replaceState(null, "", "#avancar");
          setActiveSection("avancar");
        });
        return;
      }

      if (shouldReturnToEssence) {
        lockEssenceNavigationUntilRef.current = performance.now() + 1600;
        setIsSolutionsExperienceVisible(false);
        setIsSolutionsEntryVisible(false);
        animateScrollTo(essenceSection.offsetTop, () => {
          window.history.replaceState(null, "", "#essencia");
          setActiveSection("essencia");
          setIsEssenceEntryVisible(true);
        });
        return;
      }

      setIsSolutionsExperienceVisible(false);
      setIsSolutionsEntryVisible(false);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#metodo`,
      );
      setActiveSection("metodo");
      animateScrollTo(methodReturnY, () => {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}#metodo`,
        );
        setActiveSection("metodo");
        setIsSolutionsExperienceVisible(false);
        setIsSolutionsEntryVisible(false);
      }, 780);
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
      const enteredSolutionsFromBelow =
        previousScrollY >= solutionsSection.offsetTop + solutionsSection.offsetHeight - 4 &&
        window.scrollY >= solutionsSection.offsetTop - 4 &&
        window.scrollY < solutionsSection.offsetTop + solutionsSection.offsetHeight - 4;

      if (enteredSolutionsFromBelow) {
        suppressReturnToMethodUntil = performance.now() + 1200;
      }

      previousScrollY = window.scrollY;

      if (window.location.hash === "#solucoes" && isAtSolutions) {
        const isMobileSolutions = window.matchMedia("(max-width: 720px)").matches;

        methodFinalReadyRef.current = true;
        setHasCompletedMethod(true);
        setIsSolutionsEntryVisible(true);
        if (isMobileSolutions) {
          setIsSolutionsExperienceVisible(true);
        }
        return;
      }

      if (isAtSolutions && methodFinalReadyRef.current) {
        if (window.location.hash !== "#solucoes") {
          return;
        }

        setIsSolutionsEntryVisible(true);
        return;
      }

      if (
        window.location.hash === "#solucoes" &&
        window.matchMedia("(max-width: 720px)").matches
      ) {
        return;
      }

      if (window.scrollY < Math.min(solutionsSection.offsetTop - 24, methodReturnY)) {
        setIsSolutionsExperienceVisible(false);
        setIsSolutionsEntryVisible(false);
      }
    };

    window.addEventListener("wheel", transitionSections, {
      capture: true,
      passive: false,
    });
    window.addEventListener("scroll", syncNaturalSolutionsReveal, { passive: true });

    return () => {
      window.removeEventListener("wheel", transitionSections, { capture: true });
      window.removeEventListener("scroll", syncNaturalSolutionsReveal);
      cancelSectionTransition();
      if (cancelSectionTransitionRef.current === cancelSectionTransition) {
        cancelSectionTransitionRef.current = null;
      }
    };
  }, [hasCompletedMethod]);

  const scrollToHashTarget = (hash: string) => {
    const target = document.querySelector<HTMLElement>(hash);

    if (!target) {
      return;
    }

    cancelSectionTransitionRef.current?.();

    const alignTarget = () => {
      window.scrollTo(0, target.offsetTop);
    };

    alignTarget();
    window.history.replaceState(null, "", hash);
    window.requestAnimationFrame(alignTarget);
    window.requestAnimationFrame(() => window.requestAnimationFrame(alignTarget));
    window.setTimeout(alignTarget, 80);
    window.setTimeout(alignTarget, 260);
  };

  const navigateToSolutions = () => {
    const solutionsSection = solutionsEntryRef.current;

    if (!solutionsSection) {
      return;
    }

    const isMobileSolutions = window.matchMedia("(max-width: 720px)").matches;

    setIsSolutionsExperienceVisible(isMobileSolutions);
    setIsSolutionsEntryVisible(false);
    solutionsSection.scrollIntoView({ behavior: "auto", block: "start" });
    window.history.replaceState(null, "", "#solucoes");

    window.requestAnimationFrame(() => {
      setIsSolutionsEntryVisible(true);
      setIsSolutionsExperienceVisible(isMobileSolutions);
    });
  };

  const navigateToEssence = () => {
    const isMobileEssence = window.matchMedia("(max-width: 720px)").matches;

    lockEssenceNavigationUntilRef.current = performance.now() + 1400;
    setIsSolutionsEntryVisible(false);
    setIsSolutionsExperienceVisible(false);
    setActiveEssenceDetail(null);
    setActiveEssenceSlide(0);
    setIsEssenceEntryVisible(true);
    setIsEssenceExperienceVisible(isMobileEssence);
    setActiveSection("essencia");
    scrollToHashTarget("#essencia");
  };

  const navigateToChromeSection = (href: string) => {
    if (href === "#solucoes") {
      navigateToSolutions();
      return;
    }

    if (href === "#essencia") {
      navigateToEssence();
      return;
    }

    setIsSolutionsEntryVisible(false);
    setIsSolutionsExperienceVisible(false);
    setActiveEssenceDetail(null);

    if (href === "#metodo") {
      setIsEssenceEntryVisible(false);
      setIsEssenceExperienceVisible(false);
      setActiveSection("metodo");
      scrollToHashTarget("#metodo");
      return;
    }

    if (href === "#avancar") {
      setActiveSection("avancar");
      scrollToHashTarget("#avancar");
    }
  };

  const navigateToHome = () => {
    suppressHeroReplayUntilRef.current = performance.now() + 1400;

    if (replayTimerRef.current) {
      window.clearTimeout(replayTimerRef.current);
      replayTimerRef.current = null;
    }

    setIsHeroReplaying(false);
    setIsSolutionsEntryVisible(false);
    setIsSolutionsExperienceVisible(false);
    setIsEssenceEntryVisible(false);
    setIsEssenceExperienceVisible(false);
    setActiveEssenceDetail(null);
    setActiveSection("inicio");
    scrollToHashTarget("#inicio");
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

  const shouldShowSolutionsEntry =
    activeSection === "solucoes" && isSolutionsEntryVisible;
  const shouldShowSolutionsExperience =
    activeSection === "solucoes" && isSolutionsExperienceVisible;
  const shouldRenderSolutionsExperience =
    shouldShowSolutionsEntry || shouldShowSolutionsExperience;
  const shouldShowEssenceReveal = isEssenceEntryVisible || hasEssenceRevealPlayed;
  const shouldLoadEssenceMedia =
    isEssenceEntryVisible || isEssenceExperienceVisible || Boolean(activeEssenceDetail);

  const activeEssenceDetailData = essenceDetails[activeEssenceDetail ?? lastEssenceDetail];

  return (
    <main
      className={`site-shell ${isDocked ? "is-docked" : ""} ${
        hasHeroIntroFinished ? "is-intro-complete" : ""
      } ${
        isHeroReplaying ? "is-hero-replaying" : ""
      } section-${activeSection} chrome-section-${chromeSection} ${
        isChromeRelocating ? "chrome-is-relocating" : ""
      } ambient-theme-${activeHeroBackground} ${
        shouldShowSolutionsExperience ? "solutions-experience-active" : ""
      } ${
        activeEssenceDetail ? "essence-detail-active" : ""
      } ${
        activeEssenceDetail ? `essence-detail-${activeEssenceDetail}` : ""
      } essence-detail-slide-${activeEssenceSlide}`}
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
            src={assetPath("/assets/crivo-mark-blue.png")}
            alt=""
            width={2088}
            height={2167}
            decoding="async"
            fetchPriority="high"
            aria-hidden="true"
          />
          <div className="word-mask">
            <img
              className="brand-word"
              src={assetPath("/assets/crivo-word-blue.png")}
              alt="Crivo"
              width={2493}
              height={878}
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </section>
      </section>

      <div className="site-chrome">
        <a
          className="chrome-mark-link"
          href="#inicio"
          aria-label="Crivo início"
          onClick={(event) => {
            event.preventDefault();
            navigateToHome();
          }}
        >
          <img
            className="chrome-mark"
            src={assetPath("/assets/crivo-mark-blue.png")}
            alt=""
            width={2088}
            height={2167}
            loading="lazy"
            decoding="async"
          />
        </a>
        <nav
          className="glass-nav"
          aria-label="Seções do site"
        >
          {sections.map((section) => (
            <button
              type="button"
              key={section.href}
              onClick={() => navigateToChromeSection(section.href)}
              className={activeSection === section.href.slice(1) ? "is-active" : ""}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="chrome-cta"
          onClick={() => navigateToChromeSection("#avancar")}
        >
          Avançar
        </button>
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
              src={shouldLoadMethodMedia ? assetPath("/videos/video.mp4") : undefined}
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
              src={
                shouldLoadMethodMedia
                  ? assetPath("/videos/video-reverse.mp4")
                  : undefined
              }
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
        className={`solutions-entry ${shouldShowSolutionsEntry ? "is-visible" : ""} ${
          shouldShowSolutionsExperience ? "is-experience-visible" : ""
        }`}
        aria-labelledby="solutions-entry-title"
      >
        <div className="solutions-entry-stage">
          <div className="solutions-entry-copy" aria-hidden={shouldShowSolutionsExperience}>
            <p>O que passa pelo Crivo?</p>
            <h2 id="solutions-entry-title">
              <span>Soluções alinhadas</span>
              <span>ao seu negócio</span>
            </h2>
          </div>

          <div
            className="solutions-experience"
            aria-label="Solucoes Crivo"
            aria-hidden={!shouldShowSolutionsExperience}
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
              <SolutionsSection isVisible={shouldShowSolutionsExperience} />
            ) : null}
          </div>
        </div>
      </section>

      <section
        ref={setEssenceSectionRef}
        id="essencia"
        className={`essence-section ${shouldShowEssenceReveal ? "is-visible" : ""} ${
          isEssenceExperienceVisible ? "is-experience-visible" : ""
        } ${activeEssenceDetail ? "is-detail-visible" : ""} ${
          activeEssenceDetail ? `detail-${activeEssenceDetail}` : ""
        } detail-slide-${activeEssenceSlide}`}
        aria-labelledby="essence-title"
      >
        <div className="essence-stage">
          <video
            className="essence-bg-video"
            src={shouldLoadEssenceMedia ? assetPath("/videos/essencia/bg_.mp4") : undefined}
            muted
            autoPlay
            loop
            playsInline
            preload={shouldLoadEssenceMedia ? "metadata" : "none"}
            aria-hidden="true"
          />
          <div className="essence-bg-wash" aria-hidden="true" />

          <div className="essence-title-screen">
            <p>Quem está por trás</p>
            <h2 id="essence-title">Nossa essência?</h2>
          </div>

          <div className="essence-content-screen">
            <p className="essence-manifesto">
              A Crivo existe para transformar rotina confusa em ferramenta clara.
              A gente escuta como o negócio funciona, corta o que atrapalha e
              constrói telas que parecem óbvias desde o primeiro uso. O detalhe
              importa porque é nele que o cliente sente cuidado.
            </p>

            <div className="essence-cards" aria-label="Frentes da essência Crivo">
              {essenceCards.map((card) => (
                <button
                  type="button"
                  className="essence-card"
                  key={card.title}
                  onClick={() => {
                    setActiveEssenceSlide(0);
                    setLastEssenceDetail(card.detail);
                    setActiveEssenceDetail(card.detail);
                  }}
                  aria-label={`Abrir ${card.title}`}
                >
                  <h3>{card.title}</h3>
                  <p>{card.caption}</p>
                </button>
              ))}
            </div>
          </div>

          <div
            className="essence-detail-screen"
            aria-hidden={!activeEssenceDetail}
          >
            <div className="essence-detail-bg" aria-hidden="true">
              {activeEssenceDetailData.images.map((image, index) => (
                <img
                  key={image}
                  className={`essence-detail-bg-image ${
                    activeEssenceSlide === index ? "is-active" : ""
                  }`}
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                />
              ))}
              <div className="essence-detail-bg-wash" />
            </div>

            <button
              type="button"
              className="essence-detail-close"
              onClick={() => setActiveEssenceDetail(null)}
              aria-label="Voltar para essência"
              tabIndex={activeEssenceDetail ? 0 : -1}
            >
              Voltar
            </button>

            <div className="essence-detail-grid">
              <article className="essence-detail-panel is-main">
                <h3>{activeEssenceDetailData.title}</h3>
                <p>{activeEssenceDetailData.caption}</p>
              </article>
              {activeEssenceDetailData.panelLabels.map((label) => (
                <article className="essence-detail-panel" aria-label={label} key={label} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="avancar" className="advance-section" aria-labelledby="advance-title">
        <div className="advance-shell">
          <div className="advance-copy">
            <p className="section-kicker">Começar</p>
            <h2 id="advance-title">Conte onde a rotina trava.</h2>
            <p>
              Você não precisa chegar com a solução pronta. Explique o que hoje
              toma tempo, gera erro ou depende demais de mensagem e planilha.
            </p>

            <div className="advance-contact" aria-label="Canais de contato Crivo">
              <a href="tel:+5511999990000">+55 (11) 99999-0000</a>
              <a href="mailto:contato@crivo.com.br">contato@crivo.com.br</a>
            </div>
          </div>

          <form
            className="advance-form"
            action="mailto:contato@crivo.com.br?subject=Novo%20contato%20pelo%20site%20Crivo"
            method="post"
            encType="text/plain"
            aria-label="Enviar mensagem para a Crivo"
          >
            <label>
              Nome
              <input
                name="nome"
                type="text"
                autoComplete="name"
                placeholder="Seu nome"
                required
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@empresa.com.br"
                required
              />
            </label>

            <label>
              Telefone
              <input
                name="telefone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(11) 99999-0000"
              />
            </label>

            <label>
              Mensagem
              <textarea
                name="mensagem"
                rows={5}
                placeholder="Ex: minha agenda fica no WhatsApp e está difícil acompanhar tudo."
                required
              />
            </label>

            <button type="submit">Enviar para a Crivo</button>
          </form>
        </div>

        <footer className="site-footer">
          <span>Crivo</span>
          <span>Ferramentas digitais claras para negócios que querem avançar.</span>
        </footer>
      </section>

    </main>
  );
}
