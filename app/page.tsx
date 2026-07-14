"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import SolutionsSection from "./components/SolutionsSection";
import { useOneOffReveal } from "./hooks/useOneOffReveal";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const MOBILE_QUERY = "(max-width: 720px)";
// Minimum dwell time before Solutions can advance to the next section on desktop.
const SOLUTIONS_EXIT_LOCK_MS = 520;
const SECTION_IDS = ["inicio", "metodo", "solucoes", "essencia", "avancar"] as const;

type SectionId = (typeof SECTION_IDS)[number];
type NavigationSource = "boot" | "hash" | "nav" | "wheel" | "settle";

const isSectionId = (value: string): value is SectionId =>
  SECTION_IDS.includes(value as SectionId);

const hashToSectionId = (hash: string): SectionId | null => {
  const id = hash.replace(/^#/, "");

  return isSectionId(id) ? id : null;
};

const sections = [
  { label: "método", href: "#metodo" },
  { label: "soluções", href: "#solucoes" },
  { label: "essência", href: "#essencia" },
];

const methodSteps = [
  {
    number: "01",
    title: "Diagnóstico",
    description: "Mapeamos gargalos, tarefas manuais e informações que se perdem na rotina.",
  },
  {
    number: "02",
    title: "Estrutura",
    description:
      "Transformamos a rotina em uma lógica clara de sistema, com etapas, regras e responsabilidades definidas.",
  },
  {
    number: "03",
    title: "Interface",
    description:
      "Criamos telas que mostram o que importa, reduzem dúvidas e ajudam a equipe a agir com segurança.",
  },
  {
    number: "04",
    title: "Evolução",
    description:
      "Refinamos a solução com base no uso real, para que ela continue acompanhando a operação.",
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
    caption: "Processo, regras e estrutura para a solução funcionar no dia a dia.",
    detail: "logic",
  },
  {
    title: "O que se sente",
    caption: "Telas simples, fluxos claros e uma experiência que passa confiança.",
    detail: "sensory",
  },
] as const;

const essenceDetails = {
  logic: {
    title: "O que sustenta",
    caption: "Processo, regras e estrutura",
    supportText: "A base que garante que a ferramenta funcione fora do layout bonito.",
    supportExtra: "Antes da interface, a Crivo organiza regras, etapas e decisões do negócio.",
    contextLabel: "Base do sistema",
    pillars: [
      {
        title: "Estrutura Lógica",
        description:
          "Organizamos processos, informações e regras para que cada parte do sistema tenha uma função clara.",
      },
      {
        title: "Transparência",
        description:
          "Cada tela mostra o que está acontecendo, o que precisa ser feito e qual é o próximo passo.",
      },
      {
        title: "Confiabilidade",
        description:
          "Construímos ferramentas estáveis, consistentes e preparadas para a rotina real da operação.",
      },
    ],
    images: [
      assetPath("/imagens/essencia/back_images/bg_1.jpg"),
      assetPath("/imagens/essencia/back_images/bg_2.jpg"),
      assetPath("/imagens/essencia/back_images/bg_3.jpg"),
    ],
  },
  sensory: {
    title: "O que se sente",
    caption: "Telas simples, fluxos claros e confiança no uso",
    supportText:
      "A experiência que faz o sistema parecer claro desde o primeiro acesso.",
    supportExtra: "O usuário entende onde está, o que fazer e por que pode confiar na ferramenta.",
    contextLabel: "Experiência percebida",
    pillars: [
      {
        title: "Clareza Visual",
        description: "A tela destaca o que importa e reduz a dúvida na hora de agir.",
      },
      {
        title: "Ritmo de Uso",
        description: "O fluxo conduz a pessoa de uma etapa para outra sem excesso, pausa ou confusão.",
      },
      {
        title: "Cuidado Percebido",
        description: "Microdecisões de texto, espaço e feedback fazem o produto parecer seguro e bem acabado.",
      },
    ],
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
  const [activeSection, setActiveSection] = useState<SectionId>("inicio");
  const [chromeSection, setChromeSection] = useState<SectionId>("inicio");
  const [isChromeRelocating, setIsChromeRelocating] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [activeMethodStep, setActiveMethodStep] = useState(0);
  const [isMethodReversing, setIsMethodReversing] = useState(false);
  const [shouldLoadMethodMedia, setShouldLoadMethodMedia] = useState(false);
  const [hasCompletedMethod, setHasCompletedMethod] = useState(false);
  const [isSolutionsEntryVisible, setIsSolutionsEntryVisible] = useState(false);
  const [isSolutionsExperienceVisible, setIsSolutionsExperienceVisible] = useState(false);
  const [isSolutionsLoading, setIsSolutionsLoading] = useState(false);
  const [hasSolutionsLoadingPlayed, setHasSolutionsLoadingPlayed] = useState(false);
  const [isSolutionsReady, setIsSolutionsReady] = useState(false);
  const [isEssenceEntryVisible, setIsEssenceEntryVisible] = useState(false);
  const [isEssenceExperienceVisible, setIsEssenceExperienceVisible] = useState(false);
  const [activeEssenceDetail, setActiveEssenceDetail] = useState<EssenceDetail | null>(null);
  const [isEssenceDetailClosing, setIsEssenceDetailClosing] = useState(false);
  const [lastEssenceDetail, setLastEssenceDetail] = useState<EssenceDetail>("logic");
  const [recentEssenceDetail, setRecentEssenceDetail] = useState<EssenceDetail | null>(null);
  const [visitedEssenceDetails, setVisitedEssenceDetails] = useState<
    Partial<Record<EssenceDetail, boolean>>
  >({});
  const [activeEssenceSlide, setActiveEssenceSlide] = useState(0);
  const { ref: solutionsRevealRef } = useOneOffReveal<HTMLElement>();
  const { ref: essenceRevealRef, hasPlayed: hasEssenceRevealPlayed } =
    useOneOffReveal<HTMLElement>();
  const methodSectionRef = useRef<HTMLElement | null>(null);
  const methodTimelineRef = useRef<HTMLDivElement | null>(null);
  const methodVideoRef = useRef<HTMLVideoElement | null>(null);
  const methodReverseVideoRef = useRef<HTMLVideoElement | null>(null);
  const essenceSectionRef = useRef<HTMLElement | null>(null);
  const essenceDetailScreenRef = useRef<HTMLDivElement | null>(null);
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
  const chromeSectionRef = useRef<SectionId>("inicio");
  const chromeHideTimerRef = useRef<number | null>(null);
  const chromeShowTimerRef = useRef<number | null>(null);
  const suppressHeroReplayUntilRef = useRef(0);
  const lockEssenceNavigationUntilRef = useRef(0);
  const lockSolutionsExitUntilRef = useRef(0);
  const navigationLockUntilRef = useRef(0);
  const recentEssenceTimerRef = useRef<number | null>(null);
  const essenceDetailCloseTimerRef = useRef<number | null>(null);
  const cancelSectionTransitionRef = useRef<(() => void) | null>(null);
  const activeSectionRef = useRef(activeSection);
  const hasHeroIntroFinishedRef = useRef(hasHeroIntroFinished);
  const isSolutionsExperienceVisibleRef = useRef(isSolutionsExperienceVisible);
  const isSolutionsLoadingRef = useRef(isSolutionsLoading);
  const isSolutionsReadyRef = useRef(isSolutionsReady);
  const isEssenceExperienceVisibleRef = useRef(isEssenceExperienceVisible);
  const activeEssenceDetailRef = useRef(activeEssenceDetail);

  activeSectionRef.current = activeSection;
  hasHeroIntroFinishedRef.current = hasHeroIntroFinished;
  isSolutionsExperienceVisibleRef.current =
    isSolutionsExperienceVisible ||
    isSolutionsReady ||
    isMobileViewport;
  isSolutionsLoadingRef.current = isSolutionsLoading;
  isSolutionsReadyRef.current = isSolutionsReady;
  isEssenceExperienceVisibleRef.current = isEssenceExperienceVisible;
  activeEssenceDetailRef.current = activeEssenceDetail;

  const setEssenceSectionRef = useCallback(
    (node: HTMLElement | null) => {
      essenceSectionRef.current = node;
      essenceRevealRef(node);
    },
    [essenceRevealRef],
  );

  const setSolutionsSectionRef = useCallback(
    (node: HTMLElement | null) => {
      solutionsEntryRef.current = node;
      solutionsRevealRef(node);
    },
    [solutionsRevealRef],
  );

  // Solutions flow states:
  // entry = section has become active, loading = dedicated loading screen,
  // ready = visual experience can render, experience = carousel/vitrine is visible.
  const lockSolutionsExit = useCallback(() => {
    lockSolutionsExitUntilRef.current =
      performance.now() + SOLUTIONS_EXIT_LOCK_MS;
  }, []);

  const canLeaveSolutionsFlow = useCallback(
    (now = performance.now()) =>
      now >= lockSolutionsExitUntilRef.current &&
      !isSolutionsLoadingRef.current &&
      isSolutionsReadyRef.current,
    [],
  );

  const resetSolutionsFlow = useCallback(() => {
    setIsSolutionsEntryVisible(false);
    setIsSolutionsExperienceVisible(false);
    setIsSolutionsLoading(false);
    setIsSolutionsReady(false);
  }, []);

  const enterSolutionsFlow = useCallback(
    (isMobile: boolean, entryVisible = true) => {
      lockSolutionsExit();
      setIsSolutionsEntryVisible(entryVisible);
      setIsSolutionsExperienceVisible(isMobile);
      setIsSolutionsLoading(false);
      setIsSolutionsReady(isMobile);
    },
    [lockSolutionsExit],
  );

  const revealSolutionsExperience = useCallback(() => {
    setIsSolutionsEntryVisible(true);
    setIsSolutionsLoading(false);
    setIsSolutionsReady(true);
    setIsSolutionsExperienceVisible(true);
  }, []);

  const closeEssenceDetail = useCallback(() => {
    const closingDetail = activeEssenceDetailRef.current;

    if (essenceDetailCloseTimerRef.current !== null) {
      window.clearTimeout(essenceDetailCloseTimerRef.current);
      essenceDetailCloseTimerRef.current = null;
    }

    if (closingDetail) {
      setRecentEssenceDetail(closingDetail);
      setVisitedEssenceDetails((current) => ({
        ...current,
        [closingDetail]: true,
      }));

      if (recentEssenceTimerRef.current !== null) {
        window.clearTimeout(recentEssenceTimerRef.current);
      }

      recentEssenceTimerRef.current = window.setTimeout(() => {
        setRecentEssenceDetail(null);
        recentEssenceTimerRef.current = null;
      }, 3600);
    }

    setIsEssenceDetailClosing(true);

    essenceDetailCloseTimerRef.current = window.setTimeout(() => {
      setActiveEssenceDetail(null);
      setIsEssenceDetailClosing(false);
      essenceDetailCloseTimerRef.current = null;
    }, 220);
  }, []);

  const openEssenceDetail = useCallback((detail: EssenceDetail) => {
    const currentDetail = activeEssenceDetailRef.current;

    if (recentEssenceTimerRef.current !== null) {
      window.clearTimeout(recentEssenceTimerRef.current);
      recentEssenceTimerRef.current = null;
    }
    if (essenceDetailCloseTimerRef.current !== null) {
      window.clearTimeout(essenceDetailCloseTimerRef.current);
      essenceDetailCloseTimerRef.current = null;
    }

    if (currentDetail && currentDetail !== detail) {
      setVisitedEssenceDetails((current) => ({
        ...current,
        [currentDetail]: true,
      }));
    }

    setRecentEssenceDetail(null);
    setIsEssenceDetailClosing(false);
    setActiveEssenceSlide(0);
    setLastEssenceDetail(detail);
    setActiveEssenceDetail(detail);
  }, []);

  const replaceSectionHash = useCallback((sectionId: SectionId) => {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${sectionId}`,
    );
  }, []);

  const prepareSectionState = useCallback((sectionId: SectionId, source: NavigationSource) => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;

    if (sectionId !== "solucoes") {
      resetSolutionsFlow();
    }

    if (sectionId !== "essencia") {
      setIsEssenceEntryVisible(false);
      setIsEssenceExperienceVisible(false);
      setActiveEssenceDetail(null);
    }

    if (sectionId === "inicio") {
      suppressHeroReplayUntilRef.current = performance.now() + 1400;

      if (replayTimerRef.current) {
        window.clearTimeout(replayTimerRef.current);
        replayTimerRef.current = null;
      }

      setIsHeroReplaying(false);
      return;
    }

    if (sectionId === "metodo") {
      return;
    }

    if (sectionId === "solucoes") {
      methodFinalReadyRef.current = true;
      setHasCompletedMethod(true);
      enterSolutionsFlow(isMobile, source !== "nav");
      return;
    }

    if (sectionId === "essencia") {
      lockEssenceNavigationUntilRef.current = performance.now() + 1400;
      setActiveEssenceSlide(0);
      setIsEssenceEntryVisible(true);
      setIsEssenceExperienceVisible(isMobile);
      return;
    }

    if (sectionId === "avancar") {
      setActiveEssenceDetail(null);
    }
  }, [enterSolutionsFlow, resetSolutionsFlow]);

  const alignSectionToViewport = useCallback((sectionId: SectionId, retries = true) => {
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    const align = () => {
      window.scrollTo(0, target.offsetTop);
    };

    align();

    if (!retries) {
      return;
    }

    window.requestAnimationFrame(align);
    window.requestAnimationFrame(() => window.requestAnimationFrame(align));
    window.setTimeout(align, 80);
    window.setTimeout(align, 260);
  }, []);

  const navigateToSection = useCallback(
    (
      sectionId: SectionId,
      options: {
        source?: NavigationSource;
        updateHash?: boolean;
        lockMs?: number;
        alignRetries?: boolean;
      } = {},
    ) => {
      const {
        source = "nav",
        updateHash = true,
        lockMs = 760,
        alignRetries = true,
      } = options;

      cancelSectionTransitionRef.current?.();
      navigationLockUntilRef.current = performance.now() + lockMs;

      prepareSectionState(sectionId, source);
      setActiveSection(sectionId);

      if (updateHash) {
        replaceSectionHash(sectionId);
      }

      alignSectionToViewport(sectionId, alignRetries);

      if (sectionId === "solucoes") {
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;

        window.requestAnimationFrame(() => {
          enterSolutionsFlow(isMobile);
        });
      }
    },
    [alignSectionToViewport, enterSolutionsFlow, prepareSectionState, replaceSectionHash],
  );

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );

    const alignTop = () => window.scrollTo(0, 0);

    alignTop();
    const resetFrame = window.requestAnimationFrame(alignTop);
    const resetTimers = [
      window.setTimeout(alignTop, 80),
      window.setTimeout(alignTop, 260),
      window.setTimeout(alignTop, 700),
    ];

    return () => {
      window.cancelAnimationFrame(resetFrame);
      resetTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const isHeroHash = window.location.hash === "#inicio";
    const shouldLockHero =
      !hasHeroIntroFinished &&
      (!window.location.hash || isHeroHash) &&
      !window.matchMedia(MOBILE_QUERY).matches;

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
    const syncHashSectionState = () => {
      const sectionId = hashToSectionId(window.location.hash);

      if (!sectionId) {
        return;
      }

      if (
        sectionId === "avancar" &&
        performance.now() < lockEssenceNavigationUntilRef.current
      ) {
        navigateToSection("essencia", {
          source: "hash",
          updateHash: true,
          lockMs: 900,
        });
        return;
      }

      navigateToSection(sectionId, {
        source: "hash",
        updateHash: false,
        lockMs: 900,
      });
    };

    window.addEventListener("hashchange", syncHashSectionState);

    return () => {
      window.removeEventListener("hashchange", syncHashSectionState);
    };
  }, [navigateToSection]);

  useEffect(() => {
    const sectionsToObserve = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sectionsToObserve.length) {
      return;
    }

    let observerFrame: number | null = null;

    const syncDominantSection = () => {
      observerFrame = null;

      if (performance.now() < navigationLockUntilRef.current) {
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      const viewportCenter = viewportHeight / 2;
      const dockThreshold = Math.min(32, viewportHeight * 0.045);
      const dominantSection = sectionsToObserve.reduce<{
        id: string;
        visibleShare: number;
        centerDistance: number;
      } | null>((currentDominant, section) => {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibleShare = Math.max(visibleHeight, 0) / viewportHeight;

        if (visibleShare <= 0) {
          return currentDominant;
        }

        const sectionCenter = rect.top + rect.height / 2;
        const centerDistance = Math.abs(sectionCenter - viewportCenter);
        const candidate = {
          id: section.id,
          visibleShare,
          centerDistance,
        };

        if (!currentDominant) {
          return candidate;
        }

        if (candidate.visibleShare > currentDominant.visibleShare + 0.04) {
          return candidate;
        }

        if (
          Math.abs(candidate.visibleShare - currentDominant.visibleShare) <= 0.04 &&
          candidate.centerDistance < currentDominant.centerDistance
        ) {
          return candidate;
        }

        return currentDominant;
      }, null);

      if (!dominantSection || dominantSection.id === activeSectionRef.current) {
        return;
      }

      if (isSectionId(dominantSection.id)) {
        if (dominantSection.id === "solucoes") {
          const solutionsSection = solutionsEntryRef.current;
          const rect = solutionsSection?.getBoundingClientRect();
          const isSolutionsDocked =
            rect &&
            Math.abs(rect.top) <= dockThreshold &&
            rect.bottom >= viewportHeight * 0.72;

          if (!isSolutionsDocked) {
            return;
          }
        }

        setActiveSection(dominantSection.id);
      }
    };

    const scheduleDominantSectionSync = () => {
      if (observerFrame) {
        return;
      }

      observerFrame = window.requestAnimationFrame(syncDominantSection);
    };

    const observer = new IntersectionObserver(scheduleDominantSectionSync, {
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });

    sectionsToObserve.forEach((section) => observer.observe(section));
    scheduleDominantSectionSync();
    window.addEventListener("resize", scheduleDominantSectionSync);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scheduleDominantSectionSync);

      if (observerFrame) {
        window.cancelAnimationFrame(observerFrame);
      }
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
      chromeHideTimerRef.current = null;
    }

    if (chromeShowTimerRef.current) {
      window.clearTimeout(chromeShowTimerRef.current);
      chromeShowTimerRef.current = null;
    }

    setIsChromeRelocating(false);
    chromeSectionRef.current = activeSection;
    setChromeSection(activeSection);

    return () => {
      if (chromeHideTimerRef.current) {
        window.clearTimeout(chromeHideTimerRef.current);
        chromeHideTimerRef.current = null;
      }

      if (chromeShowTimerRef.current) {
        window.clearTimeout(chromeShowTimerRef.current);
        chromeShowTimerRef.current = null;
      }

      setIsChromeRelocating(false);
    };
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "solucoes") {
      return;
    }

    resetSolutionsFlow();
  }, [activeSection, resetSolutionsFlow]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const syncMobileViewport = () => setIsMobileViewport(mediaQuery.matches);

    syncMobileViewport();
    mediaQuery.addEventListener("change", syncMobileViewport);

    return () => mediaQuery.removeEventListener("change", syncMobileViewport);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobileHeroIntro = window.matchMedia(MOBILE_QUERY).matches;
    const introTimer = window.setTimeout(() => {
      setHasHeroIntroFinished(true);
    }, prefersReducedMotion ? 0 : isMobileHeroIntro ? 980 : 5600);

    const updateChrome = () => {
      const nextDocked = window.scrollY > window.innerHeight * 0.45;

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
          }, 2300);
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
        methodFinalReadyRef.current = true;
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
        const isMobileEssence = window.matchMedia(MOBILE_QUERY).matches;

        setIsEssenceEntryVisible(true);
        if (activeSectionRef.current === "essencia" && isMobileEssence) {
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
    const isMobileEssence = window.matchMedia(MOBILE_QUERY).matches;
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

    const resetDetailScroll = () => {
      if (essenceDetailScreenRef.current) {
        essenceDetailScreenRef.current.scrollTop = 0;
      }
    };

    resetDetailScroll();
    window.requestAnimationFrame(resetDetailScroll);

    const slideCount = essenceDetails[activeEssenceDetail].images.length;
    const slideTimer = window.setInterval(() => {
      setActiveEssenceSlide((current) => (current + 1) % slideCount);
    }, 7600);

    return () => window.clearInterval(slideTimer);
  }, [activeEssenceDetail]);

  useEffect(() => {
    return () => {
      if (recentEssenceTimerRef.current !== null) {
        window.clearTimeout(recentEssenceTimerRef.current);
      }
      if (essenceDetailCloseTimerRef.current !== null) {
        window.clearTimeout(essenceDetailCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeSection !== "solucoes") {
      resetSolutionsFlow();
      return;
    }

    if (!isSolutionsEntryVisible && !isMobileViewport) {
      return;
    }

    if (isMobileViewport) {
      revealSolutionsExperience();
      return;
    }

    if (hasSolutionsLoadingPlayed) {
      revealSolutionsExperience();
      return;
    }

    lockSolutionsExit();
    setIsSolutionsLoading(true);
    setIsSolutionsReady(false);
    setIsSolutionsExperienceVisible(false);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const experienceTimer = window.setTimeout(() => {
      setHasSolutionsLoadingPlayed(true);
      revealSolutionsExperience();
    }, prefersReducedMotion ? 0 : 280);

    return () => window.clearTimeout(experienceTimer);
  }, [
    activeSection,
    hasSolutionsLoadingPlayed,
    isSolutionsEntryVisible,
    isMobileViewport,
    lockSolutionsExit,
    resetSolutionsFlow,
    revealSolutionsExperience,
  ]);

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
    let previousSettleScrollY = window.scrollY;
    let sectionSettleDirection = 0;
    let sectionSettleTimer: number | null = null;
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

      if (sectionSettleTimer) {
        window.clearTimeout(sectionSettleTimer);
        sectionSettleTimer = null;
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
      navigationLockUntilRef.current = performance.now() + duration + 420;
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
        navigationLockUntilRef.current = performance.now() + 360;
        document.documentElement.style.scrollBehavior = previousScrollBehavior ?? "";
        previousScrollBehavior = null;
        onComplete?.();
      };

      transitionFrame = window.requestAnimationFrame(move);
    };

    const transitionSections = (event: WheelEvent) => {
      const heroSection = document.getElementById("inicio");
      const methodSection = methodSectionRef.current;
      const solutionsSection = solutionsEntryRef.current;
      const essenceSection = essenceSectionRef.current;
      const advanceSection = document.getElementById("avancar");
      const eventTarget = event.target;

      if (!heroSection || !methodSection || !solutionsSection || !essenceSection || !advanceSection) {
        return;
      }

      if (window.matchMedia(MOBILE_QUERY).matches) {
        return;
      }

      if (isTransitioning) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < 8) {
        return;
      }

      const now = performance.now();
      if (now < sectionSnapLockedUntil) {
        event.preventDefault();
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      const methodReturnY =
        methodSection.offsetTop + methodSection.offsetHeight - viewportHeight;
      const methodScrollRange = Math.max(methodSection.offsetHeight - viewportHeight, 1);
      const methodProgress = Math.min(
        Math.max((window.scrollY - methodSection.offsetTop) / methodScrollRange, 0),
        1,
      );
      const methodExitWindow = Math.min(viewportHeight * 0.28, 240);
      const readingLine = window.scrollY + viewportHeight * 0.5;
      const solutionsRect = solutionsSection.getBoundingClientRect();
      const solutionsDockThreshold = Math.min(32, viewportHeight * 0.045);
      const isSolutionsDocked =
        Math.abs(solutionsRect.top) <= solutionsDockThreshold &&
        solutionsRect.bottom >= viewportHeight * 0.72;
      const isSolutionsVisibleEnoughToDock =
        solutionsRect.top <= viewportHeight * 0.62 &&
        solutionsRect.bottom >= viewportHeight * 0.38;
      const isSolutionsInteractiveTarget =
        eventTarget instanceof Element &&
        Boolean(eventTarget.closest(".solutions-protagonist-stage, .solutions-crown"));
      const isCurrentHero =
        readingLine >= heroSection.offsetTop &&
        readingLine < heroSection.offsetTop + heroSection.offsetHeight;
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
        window.scrollY >= methodReturnY - methodExitWindow &&
        window.scrollY < solutionsSection.offsetTop;
      const isMethodReadyForSolutions =
        hasCompletedMethod ||
        methodFinalReadyRef.current ||
        methodProgress >= 0.9 ||
        isAtMethodExit;
      const isAtMethodEntry =
        window.scrollY <= methodSection.offsetTop + viewportHeight * 0.12;
      const shouldEnterMethod =
        hasHeroIntroFinishedRef.current &&
        event.deltaY > 0 &&
        isCurrentHero;
      const shouldReturnToHero =
        event.deltaY < 0 &&
        isCurrentMethod &&
        isAtMethodEntry;
      const shouldEnterSolutions =
        isMethodReadyForSolutions &&
        event.deltaY > 0 &&
        isCurrentMethod &&
        isAtMethodExit;
      const shouldDockSolutions =
        isMethodReadyForSolutions &&
        event.deltaY > 0 &&
        !isSolutionsDocked &&
        isSolutionsVisibleEnoughToDock &&
        !isCurrentEssence &&
        !isCurrentAdvance;
      const isSolutionsInReturnRange =
        isCurrentSolutions ||
        activeSectionRef.current === "solucoes" ||
        (window.scrollY >= solutionsSection.offsetTop - viewportHeight * 0.24 &&
          window.scrollY < solutionsSection.offsetTop + solutionsSection.offsetHeight);
      const shouldReturnToMethod =
        now >= suppressReturnToMethodUntil &&
        event.deltaY < 0 &&
        isSolutionsInReturnRange &&
        (isSolutionsDocked ||
          activeSectionRef.current === "solucoes" ||
          solutionsRect.top <= solutionsDockThreshold);
      const shouldRevealSolutionsExperience =
        event.deltaY > 0 &&
        isCurrentSolutions &&
        isSolutionsDocked &&
        !isSolutionsExperienceVisibleRef.current &&
        !isSolutionsLoadingRef.current &&
        isSolutionsReadyRef.current;
      const shouldHoldSolutions =
        event.deltaY > 0 &&
        isCurrentSolutions &&
        isSolutionsDocked &&
        !canLeaveSolutionsFlow(now);
      const shouldEnterEssence =
        canLeaveSolutionsFlow(now) &&
        event.deltaY > 0 &&
        isCurrentSolutions &&
        isSolutionsDocked &&
        isSolutionsExperienceVisibleRef.current;
      const shouldReturnToSolutions =
        event.deltaY < 0 &&
        isCurrentEssence;
      const shouldRevealEssenceExperience =
        event.deltaY > 0 &&
        isCurrentEssence &&
        !isEssenceExperienceVisibleRef.current;
      const shouldEnterAdvance =
        now >= lockEssenceNavigationUntilRef.current &&
        event.deltaY > 0 &&
        isCurrentEssence &&
        isEssenceExperienceVisibleRef.current &&
        !activeEssenceDetailRef.current;
      const shouldReturnToEssence =
        event.deltaY < 0 &&
        isCurrentAdvance;
      const shouldDelegateSolutionsWheel =
        isSolutionsInteractiveTarget &&
        isSolutionsDocked &&
        isSolutionsExperienceVisibleRef.current &&
        !shouldReturnToMethod;

      if (
        shouldDelegateSolutionsWheel ||
        (
          !shouldEnterMethod &&
          !shouldReturnToHero &&
          !shouldEnterSolutions &&
          !shouldDockSolutions &&
          !shouldReturnToMethod &&
          !shouldRevealSolutionsExperience &&
          !shouldHoldSolutions &&
          !shouldEnterEssence &&
          !shouldReturnToSolutions &&
          !shouldRevealEssenceExperience &&
          !shouldEnterAdvance &&
          !shouldReturnToEssence &&
          !isTransitioning
        )
      ) {
        return;
      }

      event.preventDefault();

      if (shouldHoldSolutions) {
        return;
      }

      if (shouldEnterMethod) {
        resetSolutionsFlow();
        setIsEssenceEntryVisible(false);
        setIsEssenceExperienceVisible(false);
        setActiveEssenceDetail(null);
        animateScrollTo(methodSection.offsetTop, () => {
          replaceSectionHash("metodo");
          setActiveSection("metodo");
        }, 720);
        return;
      }

      if (shouldReturnToHero) {
        suppressHeroReplayUntilRef.current = performance.now() + 1400;
        resetSolutionsFlow();
        setIsEssenceEntryVisible(false);
        setIsEssenceExperienceVisible(false);
        setActiveEssenceDetail(null);
        animateScrollTo(heroSection.offsetTop, () => {
          replaceSectionHash("inicio");
          setActiveSection("inicio");
        }, 720);
        return;
      }

      if (shouldEnterSolutions) {
        methodFinalReadyRef.current = true;
        setHasCompletedMethod(true);
        resetSolutionsFlow();
        animateScrollTo(solutionsSection.offsetTop, () => {
          replaceSectionHash("solucoes");
          setActiveSection("solucoes");
          enterSolutionsFlow(false);
        }, 780);
        return;
      }

      if (shouldDockSolutions) {
        methodFinalReadyRef.current = true;
        setHasCompletedMethod(true);
        resetSolutionsFlow();
        animateScrollTo(solutionsSection.offsetTop, () => {
          replaceSectionHash("solucoes");
          setActiveSection("solucoes");
          enterSolutionsFlow(false);
        }, 680);
        return;
      }

      if (shouldReturnToMethod) {
        event.stopPropagation();
        suppressReturnToMethodUntil = 0;
        sectionSnapLockedUntil = 0;
        resetSolutionsFlow();
        replaceSectionHash("metodo");
        setActiveSection("metodo");
        animateScrollTo(methodReturnY, () => {
          replaceSectionHash("metodo");
          setActiveSection("metodo");
          resetSolutionsFlow();
        }, 720);
        return;
      }

      if (shouldRevealSolutionsExperience) {
        replaceSectionHash("solucoes");
        navigationLockUntilRef.current = performance.now() + 760;
        setActiveSection("solucoes");
        revealSolutionsExperience();
        sectionSnapLockedUntil = performance.now() + 760;
        return;
      }

      if (shouldEnterEssence) {
        lockEssenceNavigationUntilRef.current = performance.now() + 1600;
        resetSolutionsFlow();
        setActiveEssenceDetail(null);
        setIsEssenceEntryVisible(false);
        setIsEssenceExperienceVisible(false);
        animateScrollTo(essenceSection.offsetTop, () => {
          replaceSectionHash("essencia");
          setActiveSection("essencia");
          setIsEssenceEntryVisible(true);
        });
        return;
      }

      if (shouldReturnToSolutions) {
        setActiveEssenceDetail(null);
        animateScrollTo(solutionsSection.offsetTop, () => {
          replaceSectionHash("solucoes");
          setActiveSection("solucoes");
          enterSolutionsFlow(false);
          setIsEssenceEntryVisible(false);
          setIsEssenceExperienceVisible(false);
          suppressReturnToMethodUntil = performance.now() + 520;
        });
        return;
      }

      if (shouldRevealEssenceExperience) {
        replaceSectionHash("essencia");
        navigationLockUntilRef.current = performance.now() + 760;
        lockEssenceNavigationUntilRef.current = performance.now() + 900;
        setActiveSection("essencia");
        setIsEssenceEntryVisible(true);
        setIsEssenceExperienceVisible(true);
        sectionSnapLockedUntil = performance.now() + 760;
        return;
      }

      if (shouldEnterAdvance) {
        resetSolutionsFlow();
        setActiveEssenceDetail(null);
        animateScrollTo(advanceSection.offsetTop, () => {
          replaceSectionHash("avancar");
          setActiveSection("avancar");
        });
        return;
      }

      if (shouldReturnToEssence) {
        lockEssenceNavigationUntilRef.current = performance.now() + 1600;
        resetSolutionsFlow();
        animateScrollTo(essenceSection.offsetTop, () => {
          replaceSectionHash("essencia");
          setActiveSection("essencia");
          setIsEssenceEntryVisible(true);
        });
        return;
      }

      resetSolutionsFlow();
      replaceSectionHash("metodo");
      setActiveSection("metodo");
      animateScrollTo(methodReturnY, () => {
        replaceSectionHash("metodo");
        setActiveSection("metodo");
        resetSolutionsFlow();
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
      const enteredSolutionsFromAbove =
        previousScrollY < solutionsSection.offsetTop - 4 &&
        window.scrollY >= solutionsSection.offsetTop - 4 &&
        window.scrollY < solutionsSection.offsetTop + solutionsSection.offsetHeight;
      const enteredSolutionsFromBelow =
        previousScrollY >= solutionsSection.offsetTop + solutionsSection.offsetHeight - 4 &&
        window.scrollY >= solutionsSection.offsetTop - 4 &&
        window.scrollY < solutionsSection.offsetTop + solutionsSection.offsetHeight - 4;

      if (enteredSolutionsFromAbove) {
        lockSolutionsExit();
      }

      if (enteredSolutionsFromBelow) {
        lockSolutionsExit();
        suppressReturnToMethodUntil = performance.now() + 520;
      }

      previousScrollY = window.scrollY;

      if (activeSectionRef.current === "solucoes" && isAtSolutions) {
        const isMobileSolutions = window.matchMedia(MOBILE_QUERY).matches;

        methodFinalReadyRef.current = true;
        setHasCompletedMethod(true);
        setIsSolutionsEntryVisible(true);
        if (isMobileSolutions) {
          setIsSolutionsExperienceVisible(true);
        }
        return;
      }

      if (isAtSolutions && methodFinalReadyRef.current) {
        if (activeSectionRef.current !== "solucoes") {
          return;
        }

        setIsSolutionsEntryVisible(true);
        return;
      }

      if (
        activeSectionRef.current === "solucoes" &&
        window.matchMedia(MOBILE_QUERY).matches
      ) {
        return;
      }

      if (window.scrollY < Math.min(solutionsSection.offsetTop - 24, methodReturnY)) {
        resetSolutionsFlow();
      }
    };

    const scheduleSectionSettle = () => {
      const currentScrollY = window.scrollY;

      sectionSettleDirection =
        currentScrollY === previousSettleScrollY
          ? sectionSettleDirection
          : currentScrollY > previousSettleScrollY
            ? 1
            : -1;
      previousSettleScrollY = currentScrollY;

      if (
        isTransitioning ||
        !hasHeroIntroFinishedRef.current ||
        window.matchMedia(MOBILE_QUERY).matches
      ) {
        return;
      }

      if (sectionSettleTimer) {
        window.clearTimeout(sectionSettleTimer);
      }

      sectionSettleTimer = window.setTimeout(() => {
        const heroSection = document.getElementById("inicio");
        const methodSection = methodSectionRef.current;
        const solutionsSection = solutionsEntryRef.current;

        sectionSettleTimer = null;

        if (!heroSection || !methodSection || !solutionsSection || isTransitioning) {
          return;
        }

        const now = performance.now();

        if (now < sectionSnapLockedUntil) {
          return;
        }

        const viewportHeight = Math.max(window.innerHeight, 1);
        const methodReturnY =
          methodSection.offsetTop + methodSection.offsetHeight - viewportHeight;
        const methodToSolutionsStart =
          methodReturnY - Math.min(viewportHeight * 0.24, 220);
        const methodToSolutionsEnd =
          solutionsSection.offsetTop + Math.min(viewportHeight * 0.32, 280);
        const isBetweenMethodAndSolutions =
          window.scrollY > methodToSolutionsStart &&
          window.scrollY < methodToSolutionsEnd;

        if (
          isBetweenMethodAndSolutions &&
          sectionSettleDirection >= 0 &&
          activeSectionRef.current !== "solucoes"
        ) {
          methodFinalReadyRef.current = true;
          setHasCompletedMethod(true);
          resetSolutionsFlow();
          animateScrollTo(solutionsSection.offsetTop, () => {
            replaceSectionHash("solucoes");
            setActiveSection("solucoes");
            enterSolutionsFlow(false);
          }, 620);
          return;
        }

        const settleStart = heroSection.offsetTop + Math.min(viewportHeight * 0.12, 120);
        const settleEnd = methodSection.offsetTop - Math.min(viewportHeight * 0.08, 80);
        const isBetweenHeroAndMethod =
          window.scrollY > settleStart &&
          window.scrollY < settleEnd;

        if (!isBetweenHeroAndMethod) {
          return;
        }

        if (sectionSettleDirection >= 0) {
          setActiveSection("metodo");
          animateScrollTo(methodSection.offsetTop, () => {
            replaceSectionHash("metodo");
            setActiveSection("metodo");
          }, 620);
          return;
        }

        suppressHeroReplayUntilRef.current = performance.now() + 1400;
        setActiveSection("inicio");
        animateScrollTo(heroSection.offsetTop, () => {
          replaceSectionHash("inicio");
          setActiveSection("inicio");
        }, 620);
      }, 140);
    };

    const handleNaturalScroll = () => {
      syncNaturalSolutionsReveal();
      scheduleSectionSettle();
    };

    window.addEventListener("wheel", transitionSections, {
      capture: true,
      passive: false,
    });
    window.addEventListener("scroll", handleNaturalScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", transitionSections, { capture: true });
      window.removeEventListener("scroll", handleNaturalScroll);
      cancelSectionTransition();
      if (cancelSectionTransitionRef.current === cancelSectionTransition) {
        cancelSectionTransitionRef.current = null;
      }
    };
  }, [
    canLeaveSolutionsFlow,
    enterSolutionsFlow,
    hasCompletedMethod,
    hasHeroIntroFinished,
    lockSolutionsExit,
    replaceSectionHash,
    resetSolutionsFlow,
    revealSolutionsExperience,
  ]);

  const navigateToChromeSection = (href: string) => {
    const sectionId = hashToSectionId(href);

    if (!sectionId) {
      return;
    }

    navigateToSection(sectionId, { source: "nav", lockMs: 900 });
  };

  const navigateToHome = () => {
    navigateToSection("inicio", { source: "nav", lockMs: 900 });
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
    activeSection === "solucoes" &&
    (isSolutionsEntryVisible || isMobileViewport);
  const shouldShowSolutionsExperience =
    activeSection === "solucoes" &&
    (isSolutionsExperienceVisible ||
      isSolutionsReady ||
      isMobileViewport);
  const shouldRenderSolutionsExperience =
    isMobileViewport || shouldShowSolutionsEntry || shouldShowSolutionsExperience;
  const shouldShowEssenceReveal =
    isMobileViewport || isEssenceEntryVisible || hasEssenceRevealPlayed;
  const shouldLoadEssenceMedia =
    isMobileViewport ||
    isEssenceEntryVisible ||
    isEssenceExperienceVisible ||
    Boolean(activeEssenceDetail);

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
      } ${
        isEssenceDetailClosing ? "essence-detail-is-closing" : ""
      } ${
        activeSection === "essencia" && isEssenceExperienceVisible
          ? "essence-ready-to-advance"
          : ""
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
          Sistemas, apps e sites
          <br />
          sob medida
        </p>

        <h1 className="opening-line">
          A Crivo transforma rotinas
          <br />
          em ferramentas digitais claras.
        </h1>

        <section className="brand-reveal" aria-label="Crivo">
          <img
            className="brand-mark"
            src={assetPath("/assets/crivo-mark-blue.png")}
            alt=""
            width={1156}
            height={1200}
            decoding="async"
            fetchPriority="high"
            aria-hidden="true"
          />
          <div className="word-mask">
            <img
              className="brand-word"
              src={assetPath("/assets/crivo-word-blue.png")}
              alt="Crivo"
              width={1200}
              height={423}
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
            width={1156}
            height={1200}
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
          Começar projeto
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
            <p className="section-kicker">Como a Crivo constrói</p>
            <h2 id="method-title">Da operação confusa ao sistema claro.</h2>
            <p className="method-lead">
              Antes de desenvolver, entendemos como sua rotina funciona, onde ela trava
              e o que precisa ficar mais simples.
            </p>

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
                  <span className="method-step-icon" aria-hidden="true" />
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
        ref={setSolutionsSectionRef}
        id="solucoes"
        className={`solutions-entry ${shouldShowSolutionsEntry ? "is-visible" : ""} ${
          shouldShowSolutionsExperience ? "is-experience-visible" : ""
        } ${isSolutionsLoading ? "is-loading" : ""} ${
          isSolutionsReady ? "is-ready" : ""
        } ${hasSolutionsLoadingPlayed ? "has-loaded-once" : ""}`}
        aria-labelledby="solutions-entry-title"
      >
        <div className="solutions-entry-stage">
          <div className="solutions-entry-copy" aria-hidden={shouldShowSolutionsExperience}>
            <p>O que a Crivo constrói?</p>
            <h2 id="solutions-entry-title">Ferramentas para sua rotina.</h2>
          </div>

          <div
            className="solutions-loading-screen"
            aria-hidden={!isSolutionsLoading}
          >
            <div className="solutions-loading-card">
              <span>Preparando</span>
              <strong>Soluções Crivo</strong>
              <i aria-hidden="true" />
            </div>
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
              <SolutionsSection isVisible={isMobileViewport || shouldShowSolutionsExperience} />
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
        } ${isEssenceDetailClosing ? "is-detail-closing" : ""
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
            <p>Por trás da entrega</p>
            <h2 id="essence-title">O jeito Crivo de construir.</h2>
          </div>

          <div className="essence-content-screen">
            <div className="essence-editorial-copy">
              <p className="essence-content-kicker">O jeito Crivo</p>
              <h3 className="essence-content-title">
                Lógica de negócio, interface clara e cuidado visual.
              </h3>
              <p className="essence-manifesto">
                Criamos ferramentas digitais que organizam a rotina e fazem
                sentido para quem usa todos os dias.
              </p>
            </div>

            <div className="essence-cards" aria-label="Frentes da essência Crivo">
              {essenceCards.map((card) => (
                <button
                  type="button"
                  className={`essence-card essence-card--${card.detail} ${
                    recentEssenceDetail === card.detail ? "is-recently-visited" : ""
                  } ${
                    visitedEssenceDetails[card.detail] ? "is-visited" : ""
                  }`}
                  key={card.title}
                  onClick={() => openEssenceDetail(card.detail)}
                  aria-label={`Abrir ${card.title}`}
                >
                  <span className="essence-card-top" aria-hidden="true">
                    <span
                      className={`essence-card-icon essence-card-icon--${card.detail}`}
                    >
                      {card.detail === "logic" ? (
                        <svg viewBox="0 0 24 24" focusable="false">
                          <path d="M12 3.5 4.5 7.6 12 11.7l7.5-4.1L12 3.5Z" />
                          <path d="m5 11.2 7 3.8 7-3.8" />
                          <path d="m5 15 7 3.8 7-3.8" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" focusable="false">
                          <path d="M3.8 12s3-5 8.2-5 8.2 5 8.2 5-3 5-8.2 5-8.2-5-8.2-5Z" />
                          <path d="M12 14.7a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z" />
                          <path d="M18.6 5.2 20 3.8" />
                        </svg>
                      )}
                    </span>
                    <span className="essence-card-arrow">
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M5 12h13" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                  </span>
                  <span className="essence-card-copy">
                    <span className="essence-card-title">{card.title}</span>
                    <span className="essence-card-description">
                      {card.caption}
                    </span>
                    <span className="essence-card-visited" aria-hidden="true">
                      Visitado
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="essence-next-cue" aria-hidden="true">
              <span>Próximo</span>
              <strong>Começar projeto</strong>
            </div>
          </div>

          <div
            ref={essenceDetailScreenRef}
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

            <div className="essence-detail-layout">
              <header className="essence-detail-heading">
                <p className="essence-detail-kicker">
                  <span>Essência</span>
                  <span aria-hidden="true">/</span>
                  <span>{activeEssenceDetailData.title}</span>
                </p>
                <span className="essence-detail-context">
                  {activeEssenceDetailData.contextLabel}
                </span>
                <h3>{activeEssenceDetailData.title}</h3>
                <p>
                  {activeEssenceDetailData.supportText}
                  <span className="essence-detail-support-extra">
                    {activeEssenceDetailData.supportExtra}
                  </span>
                </p>
              </header>

              <div className="essence-detail-switcher" aria-label="Alternar camada da essência">
                {essenceCards.map((card) => (
                  <button
                    type="button"
                    key={`switch-${card.detail}`}
                    className={activeEssenceDetail === card.detail ? "is-active" : ""}
                    onClick={() => openEssenceDetail(card.detail)}
                    disabled={activeEssenceDetail === card.detail}
                  >
                    <span aria-hidden="true" />
                    {card.title}
                  </button>
                ))}
              </div>

              <div className="essence-detail-pillars" aria-label={activeEssenceDetailData.title}>
                {activeEssenceDetailData.pillars.map((pillar, index) => (
                  <article className="essence-detail-pillar" key={pillar.title}>
                    <span className="essence-detail-pillar-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`essence-detail-icon essence-detail-icon-${index + 1}`}
                      aria-hidden="true"
                    />
                    <h4>{pillar.title}</h4>
                    <p>{pillar.description}</p>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="essence-detail-close"
                onClick={closeEssenceDetail}
                aria-label="Voltar para escolhas da essência"
                tabIndex={activeEssenceDetail ? 0 : -1}
              >
                <span aria-hidden="true">←</span>
                Voltar
              </button>

              <div
                className="essence-next-cue essence-next-cue--detail"
                aria-hidden="true"
              >
                <span>Próximo</span>
                <strong>Começar projeto</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="avancar" className="advance-section" aria-labelledby="advance-title">
        <div className="advance-shell">
          <div className="advance-copy">
            <p className="section-kicker">Começar</p>
            <h2 id="advance-title">Mostre onde sua operação perde tempo.</h2>
            <p>
              Você não precisa saber qual sistema criar. Conte como sua rotina
              funciona hoje, onde ela trava e o que sua equipe precisa organizar melhor.
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
              E-mail
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
              O que você quer organizar?
              <textarea
                name="mensagem"
                rows={5}
                placeholder="Ex: meus pedidos ficam no WhatsApp, minha agenda está manual e minha equipe perde tempo procurando informações."
                required
              />
            </label>

            <button type="submit">Enviar minha rotina</button>
          </form>
        </div>

        <footer className="site-footer">
          <span>Crivo</span>
          <span>A Crivo cria ferramentas digitais sob medida para organizar rotinas reais de negócio.</span>
        </footer>
      </section>

    </main>
  );
}
