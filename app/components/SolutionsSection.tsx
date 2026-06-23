"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";

const SOLUTIONS_DATA = {
  "apps mobile": {
    tag: "Apps Mobile",
    video: "/videos/apps_mobile.mp4",
    poster: "/imagens/bg_1.jpg",
    previewTime: 0.8,
    heroQuote: "A presença absoluta no bolso do seu cliente.",
    heroSub:
      "Aplicações nativas e híbridas de altíssima performance, desenhadas para retenção máxima.",
    trinity: [
      {
        title: "Arquitetura ARM.",
        text: "Código otimizado para o silício dos smartphones modernos, garantindo fluidez a 120Hz e consumo mínimo de bateria.",
      },
      {
        title: "Ergonomia Gestual.",
        text: "Mapeamento de zonas de calor do polegar para que as ações críticas exijam zero esforço de alongamento da mão.",
      },
      {
        title: "Offline-First.",
        text: "Sincronização silenciosa em background. O seu usuário continua operando o aplicativo mesmo dentro de um elevador.",
      },
    ],
  },
  "sistemas web": {
    tag: "Sistemas Web",
    video: "/videos/sistemas_web.mp4",
    poster: "/imagens/bg_3.jpg",
    previewTime: 1.1,
    heroQuote: "A força de um ecossistema complexo. A leveza de um único clique.",
    heroSub:
      "Plataformas web robustas, desenhadas para automatizar o seu faturamento e libertar a sua equipe.",
    trinity: [
      {
        title: "Engenharia Pura.",
        text: "Nascido do zero absoluto. Sem atalhos ou templates genéricos, apenas uma arquitetura de código limpa, construída para resolver o seu problema real.",
      },
      {
        title: "Design Sensorial.",
        text: "Cada curva, tom e micro-interação reflete o DNA da sua empresa. Uma interface tão imersiva que se torna a extensão natural da sua marca.",
      },
      {
        title: "Fluidez Instintiva.",
        text: "Submetido a testes rigorosos de estresse para entregar o óbvio: uma plataforma que responde instantaneamente, sem travar, sob qualquer volume de acessos.",
      },
    ],
  },
  "sites high-end": {
    tag: "Sites High-End",
    video: "/videos/sites_high-end.mp4",
    poster: "/imagens/bg_5.jpg",
    previewTime: 3.2,
    heroQuote: "O manifesto digital da sua autoridade.",
    heroSub:
      "Páginas com física de WebGL e tipografia de museu que convertem visitantes pela admiração instantânea.",
    trinity: [
      {
        title: "Física Imersiva.",
        text: "Micro-interações, shaders 3D e distorções de vidro líquido que transformam o scroll em uma experiência quase tátil.",
      },
      {
        title: "Performance AAA.",
        text: "Otimização cirúrgica de assets. Entregamos uma estética de estúdio de cinema rodando a 95+ pontos no Google Lighthouse.",
      },
      {
        title: "Copy Esculpida.",
        text: "Cada caractere é posicionado para conduzir o olhar do visitante sem atrito até o ponto inevitável de conversão.",
      },
    ],
  },
  prototipagem: {
    tag: "Prototipagem & MVP",
    video: "/videos/prototipagem_mvp.mp4",
    poster: "/imagens/bg_1.jpg",
    previewTime: 1.6,
    heroQuote: "Validação cirúrgica antes da primeira linha de código.",
    heroSub:
      "Transformamos ideias abstratas em protótipos navegáveis de alta fidelidade em tempo recorde.",
    trinity: [
      {
        title: "Imersão Expressa.",
        text: "Mapeamento intensivo da lógica do seu modelo de negócios para desenhar fluxos à prova de pontas soltas.",
      },
      {
        title: "Fidelity-Mockups.",
        text: "Entregamos telas no Figma tão polidas que seus investidores acreditarão que o software já está codificado e rodando.",
      },
      {
        title: "Pronto para Build.",
        text: "Design System amarrado com tokens de CSS exportáveis, reduzindo o tempo de desenvolvimento futuro pela metade.",
      },
    ],
  },
  consultoria: {
    tag: "Consultoria UI/UX",
    video: "/videos/consultoria.mp4",
    poster: "/imagens/bg_3.jpg",
    previewTime: 3.4,
    heroQuote: "Reconstruindo a usabilidade de softwares que pararam no tempo.",
    heroSub:
      "Avaliamos o seu produto atual para eliminar fricções de interface que estão custando o seu faturamento.",
    trinity: [
      {
        title: "Auditoria Heurística.",
        text: "Diagnóstico completo de usabilidade apontando gargalos de conversão e fluxos que causam abandono de carrinho.",
      },
      {
        title: "Refatoração Visual.",
        text: "Modernização completa da sua interface sem a necessidade de reescrever o seu back-end ou banco de dados.",
      },
      {
        title: "Design System.",
        text: "Padronização de todos os seus componentes visuais para que a sua equipe interna ganhe escala ao criar novas telas.",
      },
    ],
  },
} as const;

type SolutionKey = keyof typeof SOLUTIONS_DATA;

const solutionKeys = Object.keys(SOLUTIONS_DATA) as SolutionKey[];

type SolutionsSectionProps = {
  isVisible: boolean;
};

export default function SolutionsSection({ isVisible }: SolutionsSectionProps) {
  const [activeKey, setActiveKey] = useState<SolutionKey>("sistemas web");
  const wheelDeltaRef = useRef(0);
  const wheelFrameRef = useRef<number | null>(null);
  const wheelCooldownUntilRef = useRef(0);
  const activeIndexRef = useRef(1);
  const crownViewportRef = useRef<HTMLDivElement | null>(null);
  const protagonistStageRef = useRef<HTMLDivElement | null>(null);
  const currentVideoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<HTMLVideoElement | null>(null);
  const captureActiveVideo = useCallback((node: HTMLVideoElement | null) => {
    currentVideoRef.current = node;
    setActiveVideo(node);
  }, []);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false,
    skipSnaps: false,
    duration: 22,
  });
  const setCrownViewport = useCallback(
    (node: HTMLDivElement | null) => {
      crownViewportRef.current = node;
      emblaRef(node);
    },
    [emblaRef],
  );

  const activeIndex = solutionKeys.indexOf(activeKey);
  activeIndexRef.current = activeIndex;
  const activeData = SOLUTIONS_DATA[activeKey];
  const previousIndex =
    (activeIndex - 1 + solutionKeys.length) % solutionKeys.length;
  const nextIndex = (activeIndex + 1) % solutionKeys.length;
  const previousData = SOLUTIONS_DATA[solutionKeys[previousIndex]];
  const nextData = SOLUTIONS_DATA[solutionKeys[nextIndex]];

  const syncSelection = useCallback(() => {
    if (!emblaApi) return;
    const nextIndex = emblaApi.selectedScrollSnap();
    if (nextIndex !== activeIndexRef.current) {
      currentVideoRef.current?.pause();
    }
    activeIndexRef.current = nextIndex;
    setActiveKey(solutionKeys[nextIndex]);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", syncSelection);
    emblaApi.on("reInit", syncSelection);
    emblaApi.scrollTo(solutionKeys.indexOf("sistemas web"), true);
    syncSelection();

    return () => {
      emblaApi.off("select", syncSelection);
      emblaApi.off("reInit", syncSelection);
    };
  }, [emblaApi, syncSelection]);

  const selectSolution = (key: SolutionKey, index: number) => {
    if (index !== activeIndexRef.current) currentVideoRef.current?.pause();
    activeIndexRef.current = index;
    setActiveKey(key);
    emblaApi?.scrollTo(index);
  };

  const advanceTimeline = useCallback(
    (direction: -1 | 1) => {
      const nextIndex =
        (activeIndexRef.current + direction + solutionKeys.length) %
        solutionKeys.length;
      activeIndexRef.current = nextIndex;
      setActiveKey(solutionKeys[nextIndex]);
      emblaApi?.scrollTo(nextIndex);
    },
    [emblaApi],
  );

  useEffect(() => {
    const stage = protagonistStageRef.current;
    const crown = crownViewportRef.current;
    if (!stage || !crown) return;

    const consumeWheel = () => {
      wheelFrameRef.current = null;

      const now = performance.now();
      if (now < wheelCooldownUntilRef.current) {
        wheelDeltaRef.current = 0;
        return;
      }

      const threshold = window.matchMedia("(max-width: 720px)").matches
        ? 24
        : 42;
      if (Math.abs(wheelDeltaRef.current) < threshold) return;

      const direction: -1 | 1 = wheelDeltaRef.current > 0 ? 1 : -1;
      wheelDeltaRef.current = 0;
      wheelCooldownUntilRef.current = now + 180;
      advanceTimeline(direction);
    };

    const handleWheel = (event: globalThis.WheelEvent) => {
      const target = event.target;
      if (
        !(target instanceof Element) ||
        !target.closest(".solutions-protagonist, .solutions-crown")
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const rawDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;
      const deltaMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 80 : 1;
      const normalizedDelta = Math.max(-80, Math.min(80, rawDelta * deltaMultiplier));
      wheelDeltaRef.current = Math.max(
        -120,
        Math.min(120, wheelDeltaRef.current + normalizedDelta),
      );

      if (wheelFrameRef.current === null) {
        wheelFrameRef.current = window.requestAnimationFrame(consumeWheel);
      }
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    crown.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", handleWheel);
      crown.removeEventListener("wheel", handleWheel);
      if (wheelFrameRef.current !== null) {
        window.cancelAnimationFrame(wheelFrameRef.current);
      }
      wheelFrameRef.current = null;
      wheelDeltaRef.current = 0;
      wheelCooldownUntilRef.current = 0;
    };
  }, [advanceTimeline]);

  useEffect(() => {
    const video = activeVideo;
    if (!video) return;

    if (!isVisible) {
      video.pause();
      video.removeAttribute("src");
      video.load();
      return;
    }

    let cancelled = false;

    const playFromStart = () => {
      if (cancelled) return;
      try {
        video.currentTime = 0;
      } catch {
        // The browser may reject seeking before metadata is ready.
      }
      void video.play().catch(() => undefined);
    };

    video.addEventListener("loadeddata", playFromStart, { once: true });
    video.load();

    if (video.readyState >= 2) {
      playFromStart();
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", playFromStart);
      video.pause();
    };
  }, [activeKey, activeVideo, isVisible]);

  const playActiveVideo = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (!isVisible) return;
    void event.currentTarget.play().catch(() => undefined);
  };

  return (
    <div className={`solutions-content ${isVisible ? "is-visible" : ""}`}>
      <div className="solutions-content-inner">
        <div className="solutions-crown" ref={setCrownViewport}>
          <div className="solutions-crown-track">
            {solutionKeys.map((key, index) => {
              const directDistance = Math.abs(index - activeIndex);
              const crownDistance = Math.min(
                directDistance,
                solutionKeys.length - directDistance,
              );

              return (
                <div className="solutions-crown-slide" key={key}>
                  <button
                    type="button"
                    className={`solutions-crown-item is-distance-${Math.min(
                      crownDistance,
                      2,
                    )} ${key === activeKey ? "is-active" : ""}`}
                    aria-pressed={key === activeKey}
                    onClick={() => selectSolution(key, index)}
                  >
                    {key}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="solutions-protagonist-stage"
          ref={protagonistStageRef}
          onTouchStart={(event) => {
            touchStartXRef.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const startX = touchStartXRef.current;
            const endX = event.changedTouches[0]?.clientX;
            touchStartXRef.current = null;
            if (startX === null || endX === undefined) return;

            const distance = endX - startX;
            if (Math.abs(distance) < 42) return;
            advanceTimeline(distance < 0 ? 1 : -1);
          }}
        >
          <button
            type="button"
            className="solutions-side-panel is-left"
            onClick={() =>
              selectSolution(solutionKeys[previousIndex], previousIndex)
            }
            aria-label={`Selecionar ${solutionKeys[previousIndex]}`}
          >
            <img
              className="solutions-side-panel-media"
              src={previousData.poster}
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <span className="solutions-side-panel-content">
              <small>{previousData.tag}</small>
              <strong>{previousData.heroQuote}</strong>
              <span>{previousData.heroSub}</span>
            </span>
          </button>
          <div className="solutions-protagonist-slot">
              <article
                className="solutions-protagonist"
              >
                <video
                  key={activeKey}
                  ref={captureActiveVideo}
                  className="solutions-protagonist-media"
                  src={isVisible ? activeData.video : undefined}
                  poster={activeData.poster}
                  muted
                  loop
                  playsInline
                  preload={isVisible ? "metadata" : "none"}
                  aria-hidden="true"
                  onCanPlay={playActiveVideo}
                />
                <div className="solutions-protagonist-shade" aria-hidden="true" />
                <span className="solutions-tag">{activeData.tag}</span>
                <h3>{activeData.heroQuote}</h3>
                <p>{activeData.heroSub}</p>
              </article>
          </div>
          <button
            type="button"
            className="solutions-side-panel is-right"
            onClick={() => selectSolution(solutionKeys[nextIndex], nextIndex)}
            aria-label={`Selecionar ${solutionKeys[nextIndex]}`}
          >
            <img
              className="solutions-side-panel-media"
              src={nextData.poster}
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <span className="solutions-side-panel-content">
              <small>{nextData.tag}</small>
              <strong>{nextData.heroQuote}</strong>
              <span>{nextData.heroSub}</span>
            </span>
          </button>
        </div>

          <div
            className="solutions-trinity"
          >
            {activeData.trinity.map((card) => (
              <article
                key={card.title}
                className="solutions-detail-card"
              >
                <h4>{card.title}</h4>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
      </div>
    </div>
  );
}
