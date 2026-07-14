"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, SyntheticEvent, TouchEvent } from "react";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const SOLUTIONS_DATA = {
  "apps mobile": {
    tag: "Apps Mobile",
    video: assetPath("/videos/apps_mobile.mp4"),
    poster: assetPath("/imagens/bg_1.jpg"),
    previewTime: 0.8,
    heroQuote: "Seu cliente compra uma vez e some.",
    heroSub:
      "Um app reúne pedidos, agenda e atendimento em um canal próprio.",
    ctaLabel: "Criar meu app",
    trinity: [
      {
        title: "Mais recorrência.",
        text: "O cliente volta sem depender só de anúncio ou mensagem manual.",
      },
      {
        title: "Compra mais fácil.",
        text: "Agendar, comprar ou pedir fica simples em poucos toques.",
      },
      {
        title: "Sua marca no bolso.",
        text: "Sua empresa vira um atalho no celular do cliente.",
      },
    ],
  },
  "sistemas web": {
    tag: "Sistemas Web",
    video: assetPath("/videos/sistemas_web.mp4"),
    poster: assetPath("/imagens/bg_3.jpg"),
    previewTime: 1.1,
    heroQuote: "Sua operação ainda vive no WhatsApp.",
    heroSub:
      "Um sistema próprio organiza pedidos, clientes, agenda e financeiro.",
    ctaLabel: "Organizar minha operação",
    trinity: [
      {
        title: "Menos retrabalho.",
        text: "Informação deixa de circular entre conversa e planilha.",
      },
      {
        title: "Visão mais clara.",
        text: "Você vê o que acontece sem perguntar para todo mundo.",
      },
      {
        title: "Equipe alinhada.",
        text: "Cada pessoa sabe o próximo passo da operação.",
      },
    ],
  },
  "sites high-end": {
    tag: "Sites High-End",
    video: assetPath("/videos/sites_high-end.mp4"),
    poster: assetPath("/imagens/bg_5.jpg"),
    previewTime: 3.2,
    heroQuote: "Seu site não mostra seu valor real.",
    heroSub:
      "Uma página clara ajuda o visitante a entender, confiar e chamar.",
    ctaLabel: "Melhorar meu site",
    trinity: [
      {
        title: "Confiança imediata.",
        text: "A primeira impressão passa cuidado, clareza e segurança.",
      },
      {
        title: "Mensagem direta.",
        text: "O visitante entende rápido o que você resolve.",
      },
      {
        title: "Contatos melhores.",
        text: "O contato chega com mais contexto e menos dúvida básica.",
      },
    ],
  },
  consultoria: {
    tag: "Consultoria UI/UX",
    video: assetPath("/videos/consultoria.mp4"),
    poster: assetPath("/imagens/bg_3.jpg"),
    previewTime: 3.4,
    heroQuote: "Seu sistema funciona, mas trava.",
    heroSub:
      "A consultoria mostra onde a tela confunde e como clarear o fluxo.",
    ctaLabel: "Revisar meu sistema",
    trinity: [
      {
        title: "Menos dúvida.",
        text: "Fluxos confusos viram caminhos mais claros.",
      },
      {
        title: "Mais fluidez.",
        text: "Ações importantes ficam fáceis de encontrar e concluir.",
      },
      {
        title: "Mais confiança.",
        text: "A experiência passa mais cuidado e segurança.",
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
  shouldLoad: boolean;
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

function SidePreview({
  data,
  itemKey,
  className,
  shouldLoad,
}: SidePreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
  }, [itemKey, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || shouldLoad) {
      return;
    }

    video.pause();
    video.removeAttribute("src");
    video.load();
  }, [itemKey, shouldLoad]);

  return (
    <video
      ref={videoRef}
      key={itemKey}
      className={`${className} ${isReady || !shouldLoad ? "is-ready" : ""}`}
      src={shouldLoad ? data.video : undefined}
      poster={data.poster}
      muted
      playsInline
      preload={shouldLoad ? "metadata" : "none"}
      aria-hidden="true"
      onLoadedMetadata={(event) => {
        if (!shouldLoad) {
          return;
        }

        const video = event.currentTarget;

        try {
          const safeDuration = Number.isFinite(video.duration)
            ? video.duration
            : data.previewTime + 0.08;

          video.currentTime = Math.min(
            data.previewTime,
            Math.max(safeDuration - 0.08, 0),
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
  const isMobileLayoutRef = useRef(false);
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
  const setCrownViewport = useCallback((node: HTMLDivElement | null) => {
    crownViewportRef.current = node;
  }, []);

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
  const shouldLoadSidePreview =
    isVisible && isActiveVideoReady && shouldRenderSidePreviewMedia;
  const getCrownOffset = (index: number) => {
    const rawOffset =
      (index - activeIndex + solutionKeys.length) % solutionKeys.length;

    return rawOffset <= solutionKeys.length / 2
      ? rawOffset
      : rawOffset - solutionKeys.length;
  };

  const selectSolution = (key: SolutionKey, index: number) => {
    if (index !== activeIndexRef.current) currentVideoRef.current?.pause();
    activeIndexRef.current = index;
    setActiveKey(key);
    setExpandedDetailIndex(0);
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
    },
    [],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 721px)");

    const syncSidePreviewMedia = () => {
      const isDesktopLayout = mediaQuery.matches;

      isMobileLayoutRef.current = !isDesktopLayout;
      setShouldRenderSidePreviewMedia(isDesktopLayout);
      setIsMobileLayout(!isDesktopLayout);
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

      const threshold = isMobileLayoutRef.current ? 24 : 42;
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

      const rawDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;
      const isDesktopVerticalBackScroll =
        !isMobileLayoutRef.current &&
        event.deltaY < 0 &&
        Math.abs(event.deltaY) >= Math.abs(event.deltaX);

      if (isDesktopVerticalBackScroll) {
        wheelDeltaRef.current = 0;
        return;
      }

      event.preventDefault();
      event.stopPropagation();

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
            <h2>Soluções para rotinas reais.</h2>
            <p>Escolha o que sua operação precisa agora.</p>
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

          <div className="solutions-mobile-next" aria-hidden="true">
            <span>Próximo</span>
            <strong>Essência</strong>
          </div>
        </div>

        <div className="solutions-showcase" aria-label="Soluções Crivo">
          <header className="solutions-showcase-header">
            <div className="solutions-showcase-copy">
              <span>Soluções Crivo</span>
              <h2>Ferramentas para operar melhor.</h2>
              <p>Sistemas, apps e sites criados para a rotina real do negócio.</p>
            </div>

            <nav
              className="solutions-crown"
              ref={setCrownViewport}
              aria-label="Escolher solução"
            >
              <div className="solutions-crown-track">
                {solutionKeys.map((key, index) => {
                  const directDistance = Math.abs(index - activeIndex);
                  const crownDistance = Math.min(
                    directDistance,
                    solutionKeys.length - directDistance,
                  );
                  const crownOffset = getCrownOffset(index);
                  const crownPosition =
                    crownOffset === 0
                      ? "active"
                      : crownOffset === -1
                        ? "prev"
                        : crownOffset === 1
                          ? "next"
                          : "far";

                  if (crownPosition === "far") {
                    return null;
                  }

                  const crownItemStyle = {
                    "--crown-offset": String(crownOffset),
                    order: crownOffset + 3,
                  } as CSSProperties;

                  return (
                    <div
                      className={`solutions-crown-slide is-crown-${crownPosition}`}
                      key={key}
                      style={crownItemStyle}
                    >
                      <button
                        type="button"
                        className={`solutions-crown-item is-distance-${Math.min(
                          crownDistance,
                          2,
                        )} ${key === resolvedActiveKey ? "is-active" : ""}`}
                        aria-pressed={key === resolvedActiveKey}
                        aria-label={`Selecionar solução: ${SOLUTIONS_DATA[key].tag}`}
                        onClick={() => selectSolution(key, index)}
                      >
                        {SOLUTIONS_DATA[key].tag}
                      </button>
                    </div>
                  );
                })}
              </div>
            </nav>
          </header>

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
                  shouldLoad={shouldLoadSidePreview}
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
                    poster={activeData.poster}
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
                  shouldLoad={shouldLoadSidePreview}
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

          <div className="solutions-showcase-footer" aria-hidden="true">
            <span>Próximo</span>
            <strong>Essência</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
