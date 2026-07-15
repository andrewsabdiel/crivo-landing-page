"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOneOffReveal } from "./hooks/useOneOffReveal";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const MOBILE_QUERY = "(max-width: 720px)";
const SECTION_IDS = ["inicio", "metodo", "entregas", "problemas", "projeto", "essencia", "avancar"] as const;

type SectionId = (typeof SECTION_IDS)[number];

const isSectionId = (value: string): value is SectionId =>
  SECTION_IDS.includes(value as SectionId);

const hashToSectionId = (hash: string): SectionId | null => {
  const id = hash.replace(/^#/, "");

  return isSectionId(id) ? id : null;
};

const sections = [
  { label: "método", href: "#metodo" },
  { label: "entregas", href: "#entregas" },
  { label: "problemas", href: "#problemas" },
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

const deliveryItems = [
  {
    number: "01",
    title: "Sistemas web sob medida",
    description:
      "Painéis, portais e ferramentas internas para organizar operação, clientes, pedidos e dados.",
    fit: "Quando planilhas, mensagens e controles soltos já não sustentam a rotina.",
  },
  {
    number: "02",
    title: "Apps mobile",
    description:
      "Aplicativos para aproximar clientes, equipes ou operações que precisam de acesso rápido e recorrente.",
    fit: "Quando a experiência precisa caber na mão de quem usa todos os dias.",
  },
  {
    number: "03",
    title: "Sites premium",
    description:
      "Páginas institucionais com narrativa, performance e hierarquia visual para comunicar valor com clareza.",
    fit: "Quando a primeira impressão precisa gerar confiança antes do contato.",
  },
  {
    number: "04",
    title: "Dashboards internos",
    description:
      "Visões operacionais para acompanhar indicadores, filas, status e decisões sem depender de improviso.",
    fit: "Quando o time precisa enxergar o que está acontecendo em tempo útil.",
  },
  {
    number: "05",
    title: "Automação de processos",
    description:
      "Fluxos digitais que reduzem tarefas repetidas, padronizam etapas e evitam perda de informação.",
    fit: "Quando retrabalho vira custo, atraso e ruído entre pessoas.",
  },
  {
    number: "06",
    title: "Consultoria UI/UX",
    description:
      "Diagnóstico de telas, fluxos e percepção para transformar produtos confusos em experiências claras.",
    fit: "Quando o produto funciona, mas ainda exige explicação demais.",
  },
] as const;

const problemItems = [
  {
    key: "whatsapp",
    title: "WhatsApp demais",
    symptom: "A operação depende demais de mensagens.",
    impact:
      "Pedidos, aprovações e histórico ficam presos em conversas, então a equipe perde contexto e o cliente precisa repetir informação.",
    resolution:
      "Centralizamos etapas, status e responsáveis em um fluxo visível, com cada solicitação seguindo um caminho claro.",
    brokenNodes: ["cliente", "pedido", "aprovação", "histórico"],
    resolvedNodes: ["entrada", "status", "responsável", "histórico"],
  },
  {
    key: "dados",
    title: "Dados espalhados",
    symptom: "Cada informação mora em uma planilha, conversa ou memória.",
    impact:
      "A decisão chega atrasada, incompleta ou baseada em versões diferentes da mesma informação.",
    resolution:
      "Transformamos dados soltos em uma fonte confiável, com painel e rotina de acompanhamento para a operação.",
    brokenNodes: ["planilha", "agenda", "financeiro", "CRM"],
    resolvedNodes: ["base única", "painel", "alertas", "decisão"],
  },
  {
    key: "retrabalho",
    title: "Retrabalho",
    symptom: "A equipe repete tarefas que poderiam seguir um fluxo padrão.",
    impact:
      "Tempo operacional vira custo invisível, erros pequenos se acumulam e tarefas simples dependem de cobrança manual.",
    resolution:
      "Desenhamos automações e checkpoints para reduzir repetição, padronizar etapas e registrar o que já foi feito.",
    brokenNodes: ["copiar", "conferir", "cobrar", "corrigir"],
    resolvedNodes: ["gatilho", "regra", "validação", "registro"],
  },
  {
    key: "cliente",
    title: "Cliente perdido",
    symptom: "O cliente não entende o próximo passo.",
    impact:
      "A experiência parece improvisada, o atendimento precisa explicar tudo e a confiança cai antes da entrega terminar.",
    resolution:
      "Criamos jornadas com orientação, feedback e linguagem clara para o cliente saber onde está e o que fazer.",
    brokenNodes: ["dúvida", "espera", "retorno", "fricção"],
    resolvedNodes: ["orientação", "prazo", "feedback", "ação"],
  },
  {
    key: "decisao",
    title: "Decisão no escuro",
    symptom: "A gestão só percebe o problema depois que ele já cresceu.",
    impact:
      "Indicadores chegam tarde, gargalos ficam invisíveis e a prioridade do dia depende mais de sensação do que de evidência.",
    resolution:
      "Montamos visões operacionais que mostram volume, status e gargalos para a decisão acontecer no tempo certo.",
    brokenNodes: ["fila", "atraso", "volume", "risco"],
    resolvedNodes: ["indicador", "prioridade", "alerta", "ação"],
  },
] as const;

const projectPhases = [
  {
    number: "01",
    title: "Leitura da operação",
    decision: "O que realmente precisa ser resolvido.",
    delivery: "Mapa inicial do fluxo, gargalos e prioridades.",
    client: "Traz contexto, exemplos, restrições e situações reais.",
  },
  {
    number: "02",
    title: "Desenho do fluxo",
    decision: "Como a rotina deve funcionar com menos atrito.",
    delivery: "Arquitetura de etapas, regras e responsabilidades.",
    client: "Valida prioridades antes da interface virar tela.",
  },
  {
    number: "03",
    title: "Protótipo navegável",
    decision: "Se a experiência está clara antes de desenvolver.",
    delivery: "Telas principais para testar lógica, linguagem e caminho.",
    client: "Revisa uso, conteúdo e pontos de dúvida.",
  },
  {
    number: "04",
    title: "Construção",
    decision: "Como transformar o fluxo validado em produto funcional.",
    delivery: "Sistema, app, site ou painel pronto para uso.",
    client: "Acompanha checkpoints e valida entregas intermediárias.",
  },
  {
    number: "05",
    title: "Ajuste e evolução",
    decision: "O que precisa melhorar depois do uso real.",
    delivery: "Refinamentos, correções e próximos ciclos priorizados.",
    client: "Usa, reporta, decide prioridades e evolui com a ferramenta.",
  },
] as const;

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
type ProblemKey = (typeof problemItems)[number]["key"];

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
  const [activeProblemKey, setActiveProblemKey] = useState<ProblemKey>("whatsapp");
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
  const { ref: deliveriesRevealRef, hasPlayed: hasDeliveriesRevealPlayed } =
    useOneOffReveal<HTMLElement>();
  const { ref: problemsRevealRef, hasPlayed: hasProblemsRevealPlayed } =
    useOneOffReveal<HTMLElement>();
  const { ref: projectRevealRef, hasPlayed: hasProjectRevealPlayed } =
    useOneOffReveal<HTMLElement>();
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
  const wasDockedRef = useRef(false);
  const replayTimerRef = useRef<number | null>(null);
  const chromeFrameRef = useRef<number | null>(null);
  const chromeHasMountedRef = useRef(false);
  const chromeSectionRef = useRef<SectionId>("inicio");
  const chromeHideTimerRef = useRef<number | null>(null);
  const chromeShowTimerRef = useRef<number | null>(null);
  const suppressHeroReplayUntilRef = useRef(0);
  const recentEssenceTimerRef = useRef<number | null>(null);
  const essenceDetailCloseTimerRef = useRef<number | null>(null);
  const activeSectionRef = useRef(activeSection);
  const activeEssenceDetailRef = useRef(activeEssenceDetail);

  activeSectionRef.current = activeSection;
  activeEssenceDetailRef.current = activeEssenceDetail;

  const setEssenceSectionRef = useCallback(
    (node: HTMLElement | null) => {
      essenceSectionRef.current = node;
      essenceRevealRef(node);
    },
    [essenceRevealRef],
  );

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

  const syncSectionState = useCallback((sectionId: SectionId) => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;

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

    if (sectionId === "essencia") {
      setActiveEssenceSlide(0);
      setIsEssenceEntryVisible(true);
      setIsEssenceExperienceVisible(isMobile);
      return;
    }

    if (sectionId === "avancar") {
      setActiveEssenceDetail(null);
    }
  }, []);

  const navigateToSection = useCallback((sectionId: SectionId) => {
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    syncSectionState(sectionId);
    setActiveSection(sectionId);
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${sectionId}`,
    );

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, [syncSectionState]);

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

      syncSectionState(sectionId);
      setActiveSection(sectionId);
    };

    syncHashSectionState();
    window.addEventListener("hashchange", syncHashSectionState);

    return () => {
      window.removeEventListener("hashchange", syncHashSectionState);
    };
  }, [syncSectionState]);

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

      const viewportHeight = Math.max(window.innerHeight, 1);
      const viewportCenter = viewportHeight / 2;
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
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;

        if (isMobile && dominantSection.id === "essencia") {
          setIsEssenceEntryVisible(true);
          setIsEssenceExperienceVisible(true);
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
    }, prefersReducedMotion ? 0 : isMobileHeroIntro ? 480 : 900);

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

  const navigateToChromeSection = (href: string) => {
    const sectionId = hashToSectionId(href);

    if (!sectionId) {
      return;
    }

    navigateToSection(sectionId);
  };

  const navigateToHome = () => {
    navigateToSection("inicio");
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

    if (Math.abs(targetTime - startTime) < 0.06) {
      video.pause();
      reverseVideo.pause();
      video.currentTime = targetTime;
      reverseVideo.currentTime = toReverseTime(targetTime);
      if (activeMethodStep === methodSteps.length - 1) {
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

  const shouldShowDeliveriesReveal =
    isMobileViewport || hasDeliveriesRevealPlayed;
  const shouldShowProblemsReveal =
    isMobileViewport || hasProblemsRevealPlayed;
  const shouldShowProjectReveal =
    isMobileViewport || hasProjectRevealPlayed;
  const shouldShowEssenceReveal =
    isMobileViewport || isEssenceEntryVisible || hasEssenceRevealPlayed;
  const shouldLoadEssenceMedia =
    isMobileViewport ||
    isEssenceEntryVisible ||
    isEssenceExperienceVisible ||
    Boolean(activeEssenceDetail);

  const activeEssenceDetailData = essenceDetails[activeEssenceDetail ?? lastEssenceDetail];
  const activeProblem =
    problemItems.find((problem) => problem.key === activeProblemKey) ?? problemItems[0];

  return (
    <main
      className={`site-shell ${isDocked ? "is-docked" : ""} ${
        hasHeroIntroFinished ? "is-intro-complete" : ""
      } ${
        isHeroReplaying ? "is-hero-replaying" : ""
      } section-${activeSection} chrome-section-${chromeSection} ${
        isChromeRelocating ? "chrome-is-relocating" : ""
      } ambient-theme-${activeHeroBackground} ${
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
      <section id="inicio" className="hero-section" aria-labelledby="hero-title">
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

        <div className="hero-content">
          <div className="hero-copy">
            <h1 id="hero-title" className="hero-brand-heading">
              <a className="hero-brand" href="#inicio" aria-label="Crivo">
                <img
                  className="hero-brand-mark"
                  src={assetPath("/assets/crivo-mark-blue.png")}
                  alt=""
                  width={1156}
                  height={1200}
                  decoding="async"
                  fetchPriority="high"
                  aria-hidden="true"
                />
                <span className="hero-brand-word-mask">
                  <img
                    className="hero-brand-word"
                    src={assetPath("/assets/crivo-word-blue.png")}
                    alt="Crivo"
                    width={1200}
                    height={423}
                    decoding="async"
                    fetchPriority="high"
                  />
                </span>
              </a>
            </h1>

            <p className="hero-lead">
              Rotinas confusas viram produtos digitais claros.
            </p>

            <div className="hero-actions" aria-label="Ações principais">
              <button
                type="button"
                className="hero-action hero-action-primary"
                onClick={() => navigateToChromeSection("#avancar")}
              >
                Começar projeto
              </button>
            </div>

          </div>
        </div>

        <aside className="hero-signal" aria-label="Processo Crivo">
          <div className="hero-signal-panel">
            <div className="hero-background-status" aria-hidden="true">
              <span>{String(activeHeroBackground + 1).padStart(2, "0")}</span>
              <div>
                {heroBackgrounds.map((background, index) => (
                  <i
                    key={background}
                    className={activeHeroBackground === index ? "is-active" : ""}
                  />
                ))}
              </div>
            </div>
            <span className="hero-signal-step">01</span>
            <strong>Diagnóstico antes da interface.</strong>
            <p>
              Primeiro entendemos o fluxo real. Depois desenhamos a solução que
              organiza a operação.
            </p>
          </div>
        </aside>

      </section>

      <div className="site-chrome">
        <button
          type="button"
          className="chrome-mark-link"
          aria-label="Crivo início"
          onClick={navigateToHome}
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
        </button>
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
        ref={deliveriesRevealRef}
        id="entregas"
        className={`deliveries-section ${shouldShowDeliveriesReveal ? "is-visible" : ""}`}
        aria-labelledby="deliveries-title"
      >
        <div className="deliveries-shell">
          <div className="deliveries-header">
            <p className="section-kicker">Entregas</p>
            <h2 id="deliveries-title">
              O que a Crivo coloca de pé.
            </h2>
            <p>
              Produtos digitais desenhados para dar forma à operação real:
              clareza para quem usa, estrutura para quem gerencia e presença
              para quem precisa vender melhor.
            </p>
          </div>

          <div className="deliveries-layout">
            <aside className="deliveries-feature" aria-label="Critério de entrega">
              <div className="deliveries-feature-media" aria-hidden="true">
                <Image
                  src={assetPath("/imagens/bg_3.jpg")}
                  alt=""
                  fill
                  sizes="(min-width: 980px) 34vw, 100vw"
                  className="deliveries-feature-image"
                />
              </div>
              <div className="deliveries-feature-copy">
                <span>Critério</span>
                <h3>Não é sobre empilhar telas.</h3>
                <p>
                  Cada entrega precisa resolver um fluxo específico, reduzir
                  ruído operacional e deixar o próximo passo evidente.
                </p>
              </div>
            </aside>

            <div className="deliveries-grid" aria-label="Tipos de entrega">
              {deliveryItems.map((item) => (
                <article className="delivery-card" key={item.number}>
                  <span className="delivery-card-number">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="delivery-card-fit">
                    <span>Faz sentido quando</span>
                    <strong>{item.fit}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={problemsRevealRef}
        id="problemas"
        className={`problems-section ${shouldShowProblemsReveal ? "is-visible" : ""}`}
        aria-labelledby="problems-title"
      >
        <div className="problems-shell">
          <div className="problems-copy">
            <p className="section-kicker">Problemas que resolvemos</p>
            <h2 id="problems-title">Problemas que viram sistema.</h2>
            <p>
              Antes de desenhar telas, a Crivo identifica onde a operação perde
              clareza, contexto e ritmo. O objetivo não é digitalizar bagunça:
              é redesenhar o fluxo.
            </p>
          </div>

          <div className="problems-workbench">
            <div
              className="problems-tabs"
              role="tablist"
              aria-label="Problemas operacionais"
            >
              {problemItems.map((problem) => (
                <button
                  type="button"
                  key={problem.key}
                  role="tab"
                  aria-selected={activeProblem.key === problem.key}
                  aria-controls="problem-panel"
                  className={`problem-tab ${
                    activeProblem.key === problem.key ? "is-active" : ""
                  }`}
                  onClick={() => setActiveProblemKey(problem.key)}
                >
                  <span>{problem.title}</span>
                  <strong>{problem.symptom}</strong>
                </button>
              ))}
            </div>

            <article
              id="problem-panel"
              key={activeProblem.key}
              className={`problem-panel problem-${activeProblem.key}`}
              role="tabpanel"
              tabIndex={0}
            >
              <div className="problem-panel-copy">
                <span>Diagnóstico</span>
                <h3>{activeProblem.symptom}</h3>
                <p>{activeProblem.impact}</p>
              </div>

              <div className="problem-map" aria-label="Antes e depois operacional">
                <div className="problem-map-column problem-map-column--broken">
                  <span className="problem-map-label">Antes</span>
                  <div className="problem-node-field problem-node-field--broken">
                    {activeProblem.brokenNodes.map((node) => (
                      <span className="problem-node" key={node}>
                        {node}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="problem-map-bridge" aria-hidden="true">
                  <span />
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M4 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </div>

                <div className="problem-map-column problem-map-column--clear">
                  <span className="problem-map-label">Depois</span>
                  <div className="problem-node-field problem-node-field--clear">
                    {activeProblem.resolvedNodes.map((node, index) => (
                      <span className="problem-node" key={node}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="problem-resolution">
                <span>Como reorganizamos</span>
                <p>{activeProblem.resolution}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        ref={projectRevealRef}
        id="projeto"
        className={`project-section ${shouldShowProjectReveal ? "is-visible" : ""}`}
        aria-labelledby="project-title"
      >
        <div className="project-shell">
          <div className="project-intro">
            <p className="section-kicker">Como um projeto acontece</p>
            <h2 id="project-title">Da primeira conversa ao produto em uso.</h2>
            <p>
              O projeto avança como um quadro de produção: cada fase resolve
              uma decisão, gera uma entrega concreta e deixa claro onde o
              cliente participa.
            </p>
          </div>

          <div className="project-board" aria-label="Fases do projeto">
            {projectPhases.map((phase) => (
              <article className="project-phase-card" key={phase.number}>
                <span className="project-phase-number">{phase.number}</span>
                <h3>{phase.title}</h3>

                <dl className="project-phase-details">
                  <div>
                    <dt>Decisão</dt>
                    <dd>{phase.decision}</dd>
                  </div>
                  <div>
                    <dt>Entrega</dt>
                    <dd>{phase.delivery}</dd>
                  </div>
                  <div>
                    <dt>Cliente</dt>
                    <dd>{phase.client}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="project-note">
            <span>Ritmo</span>
            <p>
              O processo evita surpresa: antes de construir, alinhamos o que
              precisa funcionar, o que será validado e qual é o próximo passo.
            </p>
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
