"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SyntheticEvent, TouchEvent } from "react";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const SOLUTIONS_DATA = {
  "apps mobile": {
    tag: "Apps Mobile",
    video: assetPath("/videos/apps_mobile.mp4"),
    poster: assetPath("/imagens/bg_1.jpg"),
    previewTime: 0.8,
    heroQuote: "Seu cliente some depois da primeira compra.",
    heroSub:
      "Um app deixa sua marca sempre por perto, com pedidos, agenda ou atendimento em poucos toques.",
    ctaLabel: "Criar nosso app",
    trinity: [
      {
        title: "Mais retorno.",
        text: "O cliente lembra de você sem depender só de post, anúncio ou mensagem manual.",
      },
      {
        title: "Menos atrito.",
        text: "Agendamento, compra ou pedido ficam simples o bastante para acontecer na hora.",
      },
      {
        title: "Presença diária.",
        text: "Sua empresa vira um atalho no celular, não só mais uma conversa perdida no WhatsApp.",
      },
    ],
  },
  "sistemas web": {
    tag: "Sistemas Web",
    video: assetPath("/videos/sistemas_web.mp4"),
    poster: assetPath("/imagens/bg_3.jpg"),
    previewTime: 1.1,
    heroQuote: "Sua operação ainda mora no WhatsApp.",
    heroSub:
      "Um sistema próprio organiza pedidos, clientes, agenda e financeiro em um lugar que sua equipe entende.",
    ctaLabel: "Organizar minha operação",
    trinity: [
      {
        title: "Menos retrabalho.",
        text: "Informação não precisa ser copiada de conversa para planilha no fim do dia.",
      },
      {
        title: "Mais controle.",
        text: "Você enxerga o que está acontecendo sem perguntar para três pessoas diferentes.",
      },
      {
        title: "Equipe alinhada.",
        text: "Cada pessoa sabe o próximo passo, sem depender de memória ou improviso.",
      },
    ],
  },
  "sites high-end": {
    tag: "Sites High-End",
    video: assetPath("/videos/sites_high-end.mp4"),
    poster: assetPath("/imagens/bg_5.jpg"),
    previewTime: 3.2,
    heroQuote: "Seu site não mostra o valor que você entrega.",
    heroSub:
      "Uma página bem pensada faz o visitante entender rápido por que confiar, chamar e comprar.",
    ctaLabel: "Melhorar meu site",
    trinity: [
      {
        title: "Confiança imediata.",
        text: "A primeira impressão passa cuidado, clareza e segurança para quem acabou de conhecer você.",
      },
      {
        title: "Mensagem direta.",
        text: "O visitante entende o que você resolve sem garimpar informação pela página.",
      },
      {
        title: "Mais conversas certas.",
        text: "O contato chega com mais contexto e menos pergunta básica no atendimento.",
      },
    ],
  },
  consultoria: {
    tag: "Consultoria UI/UX",
    video: assetPath("/videos/consultoria.mp4"),
    poster: assetPath("/imagens/bg_3.jpg"),
    previewTime: 3.4,
    heroQuote: "Seu sistema funciona, mas trava sua equipe.",
    heroSub:
      "A consultoria mostra onde a tela confunde, onde o cliente desiste e onde sua equipe perde tempo.",
    ctaLabel: "Revisar meu sistema",
    trinity: [
      {
        title: "Menos dúvida.",
        text: "Fluxos confusos viram caminhos mais claros para quem usa todos os dias.",
      },
      {
        title: "Mais fluidez.",
        text: "As ações importantes ficam fáceis de encontrar, entender e concluir.",
      },
      {
        title: "Produto mais confiável.",
        text: "A experiência passa a sensação de cuidado que seu negócio já entrega fora da tela.",
      },
    ],
  },
} as const;

type SolutionKey = keyof typeof SOLUTIONS_DATA;

const solutionKeys = Object.keys(SOLUTIONS_DATA) as SolutionKey[];

type SolutionsSectionProps = {
  isVisible: boolean;
};

type SidePreviewProps = {
  data: (typeof SOLUTIONS_DATA)[SolutionKey];
  itemKey: SolutionKey;
  className: string;
};

type MobileSolutionMediaProps = {
  data: (typeof SOLUTIONS_DATA)[SolutionKey];
  itemKey: SolutionKey;
  shouldLoad: boolean;
};

function MobileSolutionMedia({
  data,
  itemKey,
  shouldLoad,
}: MobileSolutionMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const shouldPlay = shouldLoad && isNearViewport;

  useEffect(() => {
    setIsReady(false);
  }, [itemKey, shouldPlay]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "720px 0px", threshold: 0.01 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || shouldPlay) {
      return;
    }

    video.pause();
    video.removeAttribute("src");
    video.load();
  }, [shouldPlay]);

  const playVideo = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (!shouldPlay) {
      return;
    }

    setIsReady(true);
    void event.currentTarget.play().catch(() => undefined);
  };

  return (
    <video
      ref={videoRef}
      key={itemKey}
      className={isReady ? "is-ready" : ""}
      src={shouldPlay ? data.video : undefined}
      poster={data.poster}
      muted
      autoPlay
      loop
      playsInline
      preload={shouldPlay ? "metadata" : "none"}
      aria-hidden="true"
      onLoadedData={playVideo}
      onCanPlay={playVideo}
    />
  );
}

function SidePreview({ data, itemKey, className }: SidePreviewProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
  }, [itemKey]);

  return (
    <video
      key={itemKey}
      className={`${className} ${isReady ? "is-ready" : ""}`}
      src={data.video}
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
      onLoadedMetadata={(event) => {
        const video = event.currentTarget;

        try {
          video.currentTime = Math.min(
            data.previewTime,
            Math.max(video.duration - 0.08, 0),
          );
        } catch {
          setIsReady(true);
        }
      }}
      onSeeked={() => setIsReady(true)}
    />
  );
}

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
  const touchStartYRef = useRef<number | null>(null);
  const [expandedDetailIndex, setExpandedDetailIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<HTMLVideoElement | null>(null);
  const [isActiveVideoReady, setIsActiveVideoReady] = useState(false);
  const [shouldRenderSidePreviewMedia, setShouldRenderSidePreviewMedia] =
    useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
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

  const resolvedActiveKey: SolutionKey = solutionKeys.includes(activeKey)
    ? activeKey
    : "sistemas web";
  const activeIndex = solutionKeys.indexOf(resolvedActiveKey);
  activeIndexRef.current = activeIndex;
  const activeData = SOLUTIONS_DATA[resolvedActiveKey];
  const previousIndex =
    (activeIndex - 1 + solutionKeys.length) % solutionKeys.length;
  const nextIndex = (activeIndex + 1) % solutionKeys.length;
  const previousData = SOLUTIONS_DATA[solutionKeys[previousIndex]];
  const nextData = SOLUTIONS_DATA[solutionKeys[nextIndex]];

  const syncSelection = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    const nextIndex =
      ((selectedIndex % solutionKeys.length) + solutionKeys.length) %
      solutionKeys.length;
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
    setExpandedDetailIndex(0);
    emblaApi?.scrollTo(index);
  };

  const selectMobileSolution = (key: SolutionKey, index: number) => {
    activeIndexRef.current = index;
    setActiveKey(key);
    setExpandedDetailIndex(0);

    const target = document.querySelector<HTMLElement>(
      `[data-mobile-solution-index="${index}"]`,
    );

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  const advanceTimeline = useCallback(
    (direction: -1 | 1) => {
      const nextIndex =
        (activeIndexRef.current + direction + solutionKeys.length) %
        solutionKeys.length;
      activeIndexRef.current = nextIndex;
      setActiveKey(solutionKeys[nextIndex]);
      setExpandedDetailIndex(0);
      emblaApi?.scrollTo(nextIndex);
    },
    [emblaApi],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 721px)");

    const syncSidePreviewMedia = () => {
      setShouldRenderSidePreviewMedia(mediaQuery.matches);
      setIsMobileLayout(!mediaQuery.matches);
    };

    syncSidePreviewMedia();
    mediaQuery.addEventListener("change", syncSidePreviewMedia);

    return () => {
      mediaQuery.removeEventListener("change", syncSidePreviewMedia);
    };
  }, []);

  const handleSectionTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleSectionTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    const endX = event.changedTouches[0]?.clientX;
    const endY = event.changedTouches[0]?.clientY;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (startX === null || startY === null || endX === undefined || endY === undefined) {
      return;
    }

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) {
      return;
    }

    advanceTimeline(deltaX < 0 ? 1 : -1);
  };

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
        !target.closest(".solutions-protagonist-stage, .solutions-crown")
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

    stage.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    });
    crown.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    });
    return () => {
      stage.removeEventListener("wheel", handleWheel, { capture: true });
      crown.removeEventListener("wheel", handleWheel, { capture: true });
      if (wheelFrameRef.current !== null) {
        window.cancelAnimationFrame(wheelFrameRef.current);
      }
      wheelFrameRef.current = null;
      wheelDeltaRef.current = 0;
      wheelCooldownUntilRef.current = 0;
    };
  }, [advanceTimeline]);

  useEffect(() => {
    setIsActiveVideoReady(false);

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
      setIsActiveVideoReady(true);
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
    setIsActiveVideoReady(true);
    void event.currentTarget.play().catch(() => undefined);
  };

  return (
    <div
      className={`solutions-content ${isVisible ? "is-visible" : ""} ${
        isMobileLayout ? "is-mobile-layout" : ""
      }`}
      onTouchStart={handleSectionTouchStart}
      onTouchEnd={handleSectionTouchEnd}
    >
      <div className="solutions-content-inner">
        <div className="solutions-mobile-list" aria-label="Soluções Crivo">
          <header className="solutions-mobile-intro">
            <span>Soluções Crivo</span>
            <h2>Ferramentas digitais para cada trava do negócio.</h2>
            <p>
              Cada card mostra um caminho possível: app, sistema, site ou
              consultoria para deixar a operação mais clara.
            </p>
          </header>

          <nav className="solutions-mobile-nav" aria-label="Escolher solução">
            {solutionKeys.map((key, index) => {
              const data = SOLUTIONS_DATA[key];

              return (
                <button
                  type="button"
                  key={key}
                  className={key === resolvedActiveKey ? "is-active" : ""}
                  onClick={() => selectMobileSolution(key, index)}
                >
                  {data.tag}
                </button>
              );
            })}
          </nav>

          {solutionKeys.map((key, index) => {
            const data = SOLUTIONS_DATA[key];

            return (
              <article
                className="solutions-mobile-card"
                key={key}
                data-mobile-solution-index={index}
              >
                <span className="solutions-mobile-eyebrow">
                  {String(index + 1).padStart(2, "0")} / {data.tag}
                </span>
                <div className="solutions-mobile-media" aria-hidden="true">
                  <MobileSolutionMedia
                    data={data}
                    itemKey={key}
                    shouldLoad={isVisible}
                  />
                </div>
                <div className="solutions-mobile-copy">
                  <a
                    className="solutions-inline-cta"
                    href="#avancar"
                    aria-label={`${data.ctaLabel} com a Crivo`}
                  >
                    {data.ctaLabel}
                  </a>
                  <h3>{data.heroQuote}</h3>
                  <p>{data.heroSub}</p>
                  <div className="solutions-mobile-points">
                    {data.trinity.slice(0, 2).map((card) => (
                      <div key={card.title}>
                        <strong>{card.title}</strong>
                        <span>{card.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

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
                    )} ${key === resolvedActiveKey ? "is-active" : ""}`}
                    aria-pressed={key === resolvedActiveKey}
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
        >
          <article
            className="solutions-side-panel is-left"
            onClick={() =>
              selectSolution(solutionKeys[previousIndex], previousIndex)
            }
            onKeyDown={(event) => {
              if (event.target instanceof Element && event.target.closest("a")) {
                return;
              }

              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectSolution(solutionKeys[previousIndex], previousIndex);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Selecionar ${solutionKeys[previousIndex]}`}
          >
            {shouldRenderSidePreviewMedia ? (
              <SidePreview
                className="solutions-side-panel-media"
                data={previousData}
                itemKey={solutionKeys[previousIndex]}
              />
            ) : null}
            <span className="solutions-side-panel-content">
              <a
                className="solutions-inline-cta is-compact"
                href="#avancar"
                aria-label={`${previousData.ctaLabel} com a Crivo`}
                onClick={(event) => event.stopPropagation()}
              >
                {previousData.ctaLabel}
              </a>
              <strong>{previousData.heroQuote}</strong>
              <span>{previousData.heroSub}</span>
            </span>
          </article>
          <div className="solutions-protagonist-slot">
              <article
                className="solutions-protagonist"
              >
                <video
                  key={resolvedActiveKey}
                  ref={captureActiveVideo}
                  className={`solutions-protagonist-media ${
                    isActiveVideoReady ? "is-ready" : ""
                  }`}
                  src={isVisible ? activeData.video : undefined}
                  muted
                  loop
                  playsInline
                  preload={isVisible ? "metadata" : "none"}
                  aria-hidden="true"
                  onCanPlay={playActiveVideo}
                />
                <div className="solutions-protagonist-shade" aria-hidden="true" />
                <a
                  className="solutions-inline-cta"
                  href="#avancar"
                  aria-label={`${activeData.ctaLabel} com a Crivo`}
                >
                  {activeData.ctaLabel}
                </a>
                <h3>{activeData.heroQuote}</h3>
                <p>{activeData.heroSub}</p>
              </article>
          </div>
          <article
            className="solutions-side-panel is-right"
            onClick={() => selectSolution(solutionKeys[nextIndex], nextIndex)}
            onKeyDown={(event) => {
              if (event.target instanceof Element && event.target.closest("a")) {
                return;
              }

              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectSolution(solutionKeys[nextIndex], nextIndex);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Selecionar ${solutionKeys[nextIndex]}`}
          >
            {shouldRenderSidePreviewMedia ? (
              <SidePreview
                className="solutions-side-panel-media"
                data={nextData}
                itemKey={solutionKeys[nextIndex]}
              />
            ) : null}
            <span className="solutions-side-panel-content">
              <a
                className="solutions-inline-cta is-compact"
                href="#avancar"
                aria-label={`${nextData.ctaLabel} com a Crivo`}
                onClick={(event) => event.stopPropagation()}
              >
                {nextData.ctaLabel}
              </a>
              <strong>{nextData.heroQuote}</strong>
              <span>{nextData.heroSub}</span>
            </span>
          </article>
        </div>

          <div
            className="solutions-trinity"
          >
            {activeData.trinity.map((card, index) => (
              <article
                key={card.title}
                className={`solutions-detail-card ${
                  expandedDetailIndex === index ? "is-expanded" : "is-collapsed"
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setExpandedDetailIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setExpandedDetailIndex(index);
                  }
                }}
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
