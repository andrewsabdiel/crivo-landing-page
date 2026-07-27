"use client";

import Image from "next/image";
import {
  AboutSection,
  AudienceStrip,
  DifferentiatorsSection,
  FaqSection,
  ProcessSection,
  ProjectsSection,
  ServicesSection,
  SiteFooter,
} from "./components/LandingSections";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

const basePath =
  process.env.DEPLOY_TARGET === "github-pages" ? "/crivo-landing-page" : "";

const assetPath = (path: string) => `${basePath}${path}`;

const navItems = [
  { href: "#servicos", label: "O que fazemos" },
  { href: "#sistemas", label: "Sistemas" },
  { href: "#projetos", label: "Projetos" },
  { href: "#processo", label: "Processo" },
  { href: "#sobre", label: "Sobre" },
] as const;

const heroPanels = [
  {
    image: "/imagens/bg_1.jpg",
  },
  {
    image: "/imagens/bg_3.jpg",
  },
  {
    image: "/imagens/bg_5.jpg",
  },
] as const;

const systemViews = [
  {
    label: "Visão geral",
    icon: "⌂",
    context: "Gestão de clínica",
    subtitle: "Bem-vindo de volta, Administrador",
    metrics: [
      { label: "Faturamento mensal", value: "R$ 48.250", trend: "+12%" },
      { label: "Novos pacientes", value: "124", trend: "+4%" },
      { label: "Retenção", value: "92.8%", trend: "Estável" },
    ],
    bars: [42, 58, 49, 72, 64, 83],
    rows: [
      { name: "Marina Silva", detail: "Consulta inicial", status: "Concluído" },
      { name: "Carlos Teixeira", detail: "Retorno", status: "Aguardando" },
      { name: "Ana Santos", detail: "Avaliação", status: "Concluído" },
    ],
  },
  {
    label: "Pacientes",
    icon: "○",
    context: "CRM de relacionamento",
    subtitle: "Relacionamento e histórico em um só lugar",
    metrics: [
      { label: "Pacientes ativos", value: "842", trend: "+8%" },
      { label: "Novos cadastros", value: "124", trend: "+4%" },
      { label: "Retenção", value: "92.8%", trend: "Estável" },
    ],
    bars: [38, 51, 61, 57, 76, 88],
    rows: [
      { name: "Marina Silva", detail: "Plano atualizado", status: "Concluído" },
      { name: "Carlos Teixeira", detail: "Cadastro pendente", status: "Aguardando" },
      { name: "Ana Santos", detail: "Histórico completo", status: "Concluído" },
    ],
  },
  {
    label: "Agenda",
    icon: "□",
    context: "Agenda de serviços",
    subtitle: "O dia organizado por prioridade e confirmação",
    metrics: [
      { label: "Atendimentos hoje", value: "18", trend: "+3" },
      { label: "Confirmados", value: "15", trend: "83%" },
      { label: "Tempo médio", value: "42 min", trend: "-6 min" },
    ],
    bars: [55, 68, 48, 79, 62, 91],
    rows: [
      { name: "Marina Silva", detail: "09:30 · Sala 02", status: "Concluído" },
      { name: "Carlos Teixeira", detail: "11:00 · Sala 01", status: "Aguardando" },
      { name: "Ana Santos", detail: "14:20 · Sala 03", status: "Aguardando" },
    ],
  },
  {
    label: "Relatórios",
    icon: "▥",
    context: "Inteligência comercial",
    subtitle: "Indicadores úteis para a próxima decisão",
    metrics: [
      { label: "Receita", value: "R$ 48.250", trend: "+12%" },
      { label: "Crescimento", value: "24%", trend: "+6 p.p." },
      { label: "Meta mensal", value: "86%", trend: "No ritmo" },
    ],
    bars: [35, 47, 59, 67, 74, 86],
    rows: [
      { name: "Receita por serviço", detail: "Atualizado agora", status: "Concluído" },
      { name: "Taxa de retorno", detail: "Fechamento mensal", status: "Concluído" },
      { name: "Ocupação da agenda", detail: "Dados de hoje", status: "Aguardando" },
    ],
  },
] as const;


export default function Home() {
  const [activeHero, setActiveHero] = useState(0);
  const [activeSystemView, setActiveSystemView] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [headerOverHero, setHeaderOverHero] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [systemGuideEnabled, setSystemGuideEnabled] = useState(false);
  const [systemPointerPaused, setSystemPointerPaused] = useState(false);
  const [systemFocusPaused, setSystemFocusPaused] = useState(false);
  const [systemCycle, setSystemCycle] = useState(0);
  const firstMobileNavLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuToggleRef = useRef<HTMLButtonElement>(null);
  const systemStageRef = useRef<HTMLDivElement>(null);
  const systemGuidePaused = systemPointerPaused || systemFocusPaused;

  useEffect(() => {
    const updateHeader = () => {
      const hero = document.querySelector<HTMLElement>("#inicio");
      const header = document.querySelector<HTMLElement>(".site-header");

      setHeaderScrolled(window.scrollY > 40);
      setHeaderOverHero(
        Boolean(
          hero &&
            header &&
            hero.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom,
        ),
      );
    };
    const handleResize = () => {
      if (window.innerWidth > 720) {
        setMobileMenuOpen(false);
      }

      updateHeader();
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        mobileMenuToggleRef.current?.focus();
      }
    };
    const updateVisibility = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(motionQuery.matches);
    };

    updateHeader();
    updateVisibility();
    updateMotionPreference();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", closeWithEscape);
    document.addEventListener("visibilitychange", updateVisibility);
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", updateMotionPreference);
    } else {
      motionQuery.addListener(updateMotionPreference);
    }

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", closeWithEscape);
      document.removeEventListener("visibilitychange", updateVisibility);
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", updateMotionPreference);
      } else {
        motionQuery.removeListener(updateMotionPreference);
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !documentVisible) {
      return;
    }

    const heroTimer = window.setTimeout(() => {
      setActiveHero((current) => (current + 1) % heroPanels.length);
    }, 5200);

    return () => window.clearTimeout(heroTimer);
  }, [activeHero, documentVisible, prefersReducedMotion]);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !documentVisible ||
      !systemGuideEnabled ||
      systemGuidePaused
    ) {
      return;
    }

    const guideTimer = window.setTimeout(() => {
      setActiveSystemView((current) => (current + 1) % systemViews.length);
    }, 4200);

    return () => window.clearTimeout(guideTimer);
  }, [
    activeSystemView,
    documentVisible,
    prefersReducedMotion,
    systemCycle,
    systemGuideEnabled,
    systemGuidePaused,
  ]);

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const supportsIntersectionObserver =
      typeof globalThis.IntersectionObserver === "function";

    if (prefersReducedMotion || !supportsIntersectionObserver) {
      revealElements.forEach((element) => element.classList.add("is-revealed"));
    } else {
      document.documentElement.classList.add("reveal-enabled");

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8%", threshold: 0.12 },
      );

      revealElements.forEach((element) => revealObserver.observe(element));

      return () => {
        revealObserver.disconnect();
        document.documentElement.classList.remove("reveal-enabled");
      };
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const sectionElements = [...navItems.map((item) => item.href), "#contato"]
      .map((href) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => Boolean(section));
    const supportsIntersectionObserver =
      typeof globalThis.IntersectionObserver === "function";

    if (!supportsIntersectionObserver) {
      const supportedSections = new Set(sectionElements.map((section) => `#${section.id}`));
      const updateSectionFromHash = () => {
        if (supportedSections.has(window.location.hash)) {
          setActiveSection(window.location.hash);
        }
      };

      updateSectionFromHash();
      window.addEventListener("hashchange", updateSectionFromHash);

      return () => window.removeEventListener("hashchange", updateSectionFromHash);
    }

    const spyObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveSection(`#${visibleEntry.target.id}`);
        }
      },
      { rootMargin: "-34% 0px -56%", threshold: 0 },
    );

    sectionElements.forEach((section) => spyObserver.observe(section));

    return () => spyObserver.disconnect();
  }, []);

  const activeSystemPanel = systemViews[activeSystemView];
  const systemGuideIsPlaying =
    documentVisible &&
    !prefersReducedMotion &&
    systemGuideEnabled &&
    !systemGuidePaused;

  const selectSystemView = (index: number) => {
    setActiveSystemView(index);
    setSystemCycle((cycle) => cycle + 1);
  };

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      mobileMenuToggleRef.current?.focus();
      return;
    }

    setMobileMenuOpen(true);
    window.requestAnimationFrame(() => firstMobileNavLinkRef.current?.focus());
  };

  const handleSystemTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % systemViews.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + systemViews.length) % systemViews.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = systemViews.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectSystemView(nextIndex);
    const tabList = event.currentTarget.closest<HTMLElement>('[role="tablist"]');
    const tabs = tabList?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[nextIndex]?.focus();
  };

  const toggleSystemGuide = () => {
    if (systemGuideEnabled) {
      setSystemGuideEnabled(false);
      return;
    }

    setSystemGuideEnabled(true);
    setSystemPointerPaused(false);
    setSystemFocusPaused(false);
    setSystemCycle((cycle) => cycle + 1);
  };

  const moveSystemStage = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

    event.currentTarget.style.setProperty(
      "--system-tilt-x",
      `${pointerX * 6}deg`,
    );
    event.currentTarget.style.setProperty(
      "--system-tilt-y",
      `${pointerY * -4.8}deg`,
    );
    event.currentTarget.style.setProperty(
      "--system-shift-x",
      `${pointerX * 22}px`,
    );
    event.currentTarget.style.setProperty(
      "--system-shift-y",
      `${pointerY * 16}px`,
    );
    event.currentTarget.style.setProperty(
      "--system-float-x",
      `${pointerX * -32}px`,
    );
    event.currentTarget.style.setProperty(
      "--system-float-y",
      `${pointerY * -26}px`,
    );
  };

  const resetSystemStage = () => {
    const stage = systemStageRef.current;

    if (!stage) {
      return;
    }

    stage.style.setProperty("--system-tilt-x", "0deg");
    stage.style.setProperty("--system-tilt-y", "0deg");
    stage.style.setProperty("--system-shift-x", "0px");
    stage.style.setProperty("--system-shift-y", "0px");
    stage.style.setProperty("--system-float-x", "0px");
    stage.style.setProperty("--system-float-y", "0px");
  };

  return (
    <div className="site-page">
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo
      </a>
      <header
        className={`site-header ${headerScrolled ? "is-scrolled" : ""} ${
          headerOverHero ? "is-over-hero" : ""
        } ${mobileMenuOpen ? "is-menu-open" : ""}`}
        aria-label="Navegação principal"
      >
        <a className="header-brand" href="#inicio" aria-label="Crivo">
          <Image
            src={assetPath("/assets/crivo-mark-blue-ui.png")}
            alt=""
            width={36}
            height={36}
          />
          <span>Crivo</span>
        </a>

        <nav
          className={`header-nav ${mobileMenuOpen ? "is-open" : ""}`}
          id="primary-navigation"
          aria-label="Seções"
        >
          {navItems.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              ref={index === 0 ? firstMobileNavLinkRef : undefined}
              className={activeSection === item.href ? "is-active" : ""}
              aria-current={activeSection === item.href ? "location" : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a
            className="header-cta"
            href="#contato"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="header-cta-long">Agendar diagnóstico</span>
            <span className="header-cta-short">Contato</span>
          </a>
          <button
            type="button"
            className="header-menu-toggle"
            ref={mobileMenuToggleRef}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={toggleMobileMenu}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main id="conteudo-principal">
      <section className="hero-section" id="inicio">
        {heroPanels.map((panel, index) => (
          <div
            className={`hero-background ${
              activeHero === index ? "is-active" : ""
            }`}
            key={panel.image}
            style={
              {
                "--hero-image": `url(${assetPath(panel.image)})`,
              } as CSSProperties
            }
            aria-hidden="true"
          />
        ))}
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-shell">
          <div className="hero-copy">
            <p className="hero-kicker">Desenvolvimento de sistemas</p>
            <h1>Produtos digitais. Rotinas claras.</h1>
            <p className="hero-lead">
              A Crivo transforma processos confusos em sistemas, sites e
              experiências digitais simples de usar.
            </p>

            <div className="hero-proof-row" aria-label="Diferenciais da Crivo">
              <span>Processo em 4 etapas</span>
              <span>100% sob medida</span>
              <span>Suporte contínuo</span>
            </div>

            <div className="hero-actions">
              <a className="button button-primary" href="#contato">
                Agendar uma conversa
              </a>
              <a className="button button-secondary" href="#projetos">
                Ver projetos →
              </a>
            </div>
          </div>

        </div>
      </section>

      <AudienceStrip />
      <ServicesSection />

      <section className="section systems-showcase-section" id="sistemas">
        <div className="section-shell" data-reveal>
          <header className="systems-showcase-intro">
            <p className="section-kicker">Experiência de produto</p>
            <h2>Sistemas bons de usar.</h2>
            <p>
              Não é apenas programação. O visual e a tela são pensados para
              serem fáceis de usar e deixar o dia a dia da sua equipe muito
              mais ágil.
            </p>
            <div
              className={`system-guide-controls ${
                systemGuideIsPlaying ? "is-running" : ""
              }`}
            >
              <button
                type="button"
                className={`system-guide-toggle ${systemGuideEnabled ? "is-active" : ""}`}
                aria-pressed={systemGuideEnabled}
                onClick={toggleSystemGuide}
              >
                <span aria-hidden="true" />
                {systemGuideEnabled
                  ? "Pausar demonstração"
                  : "Reproduzir demonstração"}
              </button>
              <div className="system-guide-progress" aria-hidden="true">
                {systemViews.map((view, index) => (
                  <span
                    key={
                      activeSystemView === index
                        ? `${view.label}-${systemCycle}`
                        : view.label
                    }
                    className={activeSystemView === index ? "is-active" : ""}
                  />
                ))}
              </div>
            </div>
          </header>

          <div
            className="system-stage"
            ref={systemStageRef}
            onPointerMove={moveSystemStage}
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") {
                setSystemPointerPaused(true);
              }
            }}
            onPointerLeave={() => {
              resetSystemStage();
              setSystemPointerPaused(false);
            }}
            onFocusCapture={() => setSystemFocusPaused(true)}
            onBlurCapture={(event) => {
              if (
                !event.currentTarget.contains(event.relatedTarget as Node | null)
              ) {
                setSystemFocusPaused(false);
              }
            }}
          >
            <article
              className="system-dashboard-shell"
              aria-label="Demonstração interativa de um sistema de gestão"
            >
              <aside className="system-sidebar">
                <div className="system-sidebar-brand" aria-hidden="true">
                  C
                </div>
                <nav aria-label="Visões do sistema" role="tablist">
                  {systemViews.map((view, index) => (
                    <button
                      type="button"
                      key={view.label}
                      id={`system-tab-${index}`}
                      className={activeSystemView === index ? "is-active" : ""}
                      aria-label={`Abrir ${view.label}`}
                      aria-selected={activeSystemView === index}
                      aria-controls="system-view-panel"
                      role="tab"
                      tabIndex={activeSystemView === index ? 0 : -1}
                      title={view.label}
                      onKeyDown={(event) => handleSystemTabKeyDown(event, index)}
                      onClick={(event) => {
                        if (event.detail > 0) {
                          setSystemFocusPaused(false);
                        }

                        selectSystemView(index);
                      }}
                    >
                      <span aria-hidden="true">{view.icon}</span>
                      <small>{view.label}</small>
                    </button>
                  ))}
                </nav>
                <span className="system-sidebar-settings" aria-hidden="true">
                  ·
                </span>
              </aside>

              <div
                className="system-dashboard-content"
                key={activeSystemPanel.label}
                id="system-view-panel"
                role="tabpanel"
                aria-labelledby={`system-tab-${activeSystemView}`}
                aria-live="polite"
              >
                <header className="system-dashboard-header">
                  <div>
                    <span>{activeSystemPanel.context}</span>
                    <h3>{activeSystemPanel.label}</h3>
                    <p>{activeSystemPanel.subtitle}</p>
                  </div>
                  <div className="system-user-badge" aria-label="Administrador">
                    AD
                  </div>
                </header>

                {activeSystemView === 0 && (
                  <div className="system-overview-layout">
                    <div className="system-metric-grid">
                      {activeSystemPanel.metrics.map((metric) => (
                        <article key={metric.label}>
                          <span>{metric.label}</span>
                          <strong>{metric.value}</strong>
                          <small
                            className={metric.trend === "Estável" ? "is-neutral" : ""}
                          >
                            {metric.trend === "Estável" ? "— " : "↗ "}
                            {metric.trend}
                          </small>
                        </article>
                      ))}
                    </div>

                    <div className="system-detail-grid">
                      <article className="system-chart-card">
                        <header>
                          <div>
                            <span>Desempenho</span>
                            <h4>Crescimento (2026)</h4>
                          </div>
                          <small>Jan — Jun</small>
                        </header>
                        <div className="system-chart" aria-label="Gráfico de crescimento de janeiro a junho">
                          {activeSystemPanel.bars.map((value, index) => (
                            <div key={`${activeSystemPanel.label}-${index}`}>
                              <span
                                style={
                                  {
                                    "--system-bar": `${value}%`,
                                    "--bar-index": index,
                                  } as CSSProperties
                                }
                              />
                              <small>{["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][index]}</small>
                            </div>
                          ))}
                        </div>
                      </article>

                      <article className="system-appointments-card">
                        <header>
                          <div>
                            <span>Operação</span>
                            <h4>Atendimentos recentes</h4>
                          </div>
                          <small>Hoje</small>
                        </header>
                        <div className="system-appointment-list">
                          {activeSystemPanel.rows.map((row) => (
                            <div key={row.name}>
                              <span className="system-avatar" aria-hidden="true">
                                {row.name
                                  .split(" ")
                                  .map((part) => part[0])
                                  .slice(0, 2)
                                  .join("")}
                              </span>
                              <p>
                                <strong>{row.name}</strong>
                                <small>{row.detail}</small>
                              </p>
                              <span
                                className={`system-status ${
                                  row.status === "Concluído" ? "is-done" : ""
                                }`}
                              >
                                {row.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </article>
                    </div>
                  </div>
                )}

                {activeSystemView === 1 && (
                  <div className="system-patients-layout">
                    <article className="system-patient-directory">
                      <header className="system-panel-heading">
                        <div>
                          <span>Base de clientes</span>
                          <h4>Pacientes ativos</h4>
                        </div>
                        <div className="system-patient-filter" aria-hidden="true">
                          Buscar paciente...
                        </div>
                      </header>
                      <div className="system-patient-list">
                        {activeSystemPanel.rows.map((row, index) => (
                          <div className="system-patient-row" key={row.name}>
                            <span className="system-avatar" aria-hidden="true">
                              {row.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")}
                            </span>
                            <p>
                              <strong>{row.name}</strong>
                              <small>{row.detail}</small>
                            </p>
                            <span className="system-patient-code">
                              #{String(1842 + index).padStart(4, "0")}
                            </span>
                            <span
                              className={`system-status ${
                                row.status === "Concluído" ? "is-done" : ""
                              }`}
                            >
                              {row.status === "Concluído" ? "Ativo" : "Revisar"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>

                    <aside className="system-patient-summary">
                      <span>Relacionamento</span>
                      <strong>842</strong>
                      <small>pacientes ativos</small>
                      <div className="system-retention-ring" aria-label="Retenção de 92,8 por cento">
                        <span>92,8%</span>
                      </div>
                      <dl>
                        <div><dt>Novos</dt><dd>124</dd></div>
                        <div><dt>Retornos</dt><dd>68%</dd></div>
                      </dl>
                    </aside>
                  </div>
                )}

                {activeSystemView === 2 && (
                  <div className="system-agenda-layout">
                    <article className="system-agenda-board">
                      <header className="system-panel-heading">
                        <div>
                          <span>Terça-feira</span>
                          <h4>Agenda de hoje</h4>
                        </div>
                        <strong>18 JUN</strong>
                      </header>
                      <div className="system-agenda-timeline">
                        {activeSystemPanel.rows.map((row, index) => (
                          <div className="system-agenda-entry" key={row.name}>
                            <time>{["09:30", "11:00", "14:20"][index]}</time>
                            <span aria-hidden="true" />
                            <p>
                              <strong>{row.name}</strong>
                              <small>{row.detail.split(" · ").slice(1).join(" · ")}</small>
                            </p>
                            <span
                              className={`system-status ${
                                row.status === "Concluído" ? "is-done" : ""
                              }`}
                            >
                              {row.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>

                    <aside className="system-agenda-summary">
                      <span>Resumo do dia</span>
                      {activeSystemPanel.metrics.map((metric) => (
                        <div key={metric.label}>
                          <small>{metric.label}</small>
                          <strong>{metric.value}</strong>
                          <span>{metric.trend}</span>
                        </div>
                      ))}
                    </aside>
                  </div>
                )}

                {activeSystemView === 3 && (
                  <div className="system-reports-layout">
                    <article className="system-report-chart">
                      <header className="system-panel-heading">
                        <div>
                          <span>Resultado consolidado</span>
                          <h4>Receita no semestre</h4>
                        </div>
                        <small>Jan — Jun</small>
                      </header>
                      <strong>{activeSystemPanel.metrics[0].value}</strong>
                      <span className="system-report-trend">↗ {activeSystemPanel.metrics[0].trend}</span>
                      <div className="system-report-bars" aria-label="Evolução da receita no semestre">
                        {activeSystemPanel.bars.map((value, index) => (
                          <div key={`${activeSystemPanel.label}-${index}`}>
                            <span style={{ height: `${value}%` }} />
                            <small>{["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][index]}</small>
                          </div>
                        ))}
                      </div>
                    </article>

                    <div className="system-report-side">
                      {activeSystemPanel.metrics.slice(1).map((metric) => (
                        <article key={metric.label}>
                          <span>{metric.label}</span>
                          <strong>{metric.value}</strong>
                          <small>{metric.trend}</small>
                        </article>
                      ))}
                      <article className="system-report-breakdown">
                        <span>Composição</span>
                        <div><small>Serviços</small><i style={{ width: "72%" }} /></div>
                        <div><small>Produtos</small><i style={{ width: "48%" }} /></div>
                        <div><small>Recorrência</small><i style={{ width: "34%" }} /></div>
                      </article>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article
              className="system-phone-shell"
              aria-label="Demonstração mobile interativa de um sistema de gestão"
            >
              <div className="system-phone-screen">
                <span className="system-phone-notch" aria-hidden="true" />

                <header className="system-phone-header">
                  <div>
                    <span>{activeSystemPanel.context}</span>
                    <strong>{activeSystemPanel.label}</strong>
                  </div>
                  <span className="system-phone-user" aria-label="Administrador">
                    AD
                  </span>
                </header>

                <div
                  className="system-phone-panel"
                  id="system-phone-view-panel"
                  key={`phone-${activeSystemPanel.label}`}
                  role="tabpanel"
                  aria-labelledby={`system-phone-tab-${activeSystemView}`}
                  aria-live="polite"
                >
                  {activeSystemView === 0 && (
                    <div className="system-phone-overview">
                      <div className="system-phone-metrics">
                        {activeSystemPanel.metrics.map((metric, index) => (
                          <article key={metric.label}>
                            <span
                              className={`system-phone-metric-icon is-tone-${index + 1}`}
                              aria-hidden="true"
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <p>
                              <small>{metric.label}</small>
                              <strong>{metric.value}</strong>
                            </p>
                            <span className="system-phone-trend">{metric.trend}</span>
                          </article>
                        ))}
                      </div>
                      <div className="system-phone-activity" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  )}

                  {activeSystemView === 1 && (
                    <div className="system-phone-patients">
                      <article className="system-phone-spotlight">
                        <span>Pacientes ativos</span>
                        <strong>{activeSystemPanel.metrics[0].value}</strong>
                        <small>{activeSystemPanel.metrics[0].trend} este mês</small>
                        <i aria-label="Retenção de 92,8 por cento">92,8%</i>
                      </article>
                      <div className="system-phone-list">
                        {activeSystemPanel.rows.map((row) => (
                          <article key={row.name}>
                            <span className="system-phone-avatar" aria-hidden="true">
                              {row.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")}
                            </span>
                            <p>
                              <strong>{row.name}</strong>
                              <small>{row.detail}</small>
                            </p>
                            <span className="system-phone-status">
                              {row.status === "Concluído" ? "Ativo" : "Revisar"}
                            </span>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSystemView === 2 && (
                    <div className="system-phone-agenda">
                      <header>
                        <div>
                          <span>Terça-feira</span>
                          <strong>Agenda de hoje</strong>
                        </div>
                        <time>18 JUN</time>
                      </header>
                      <div className="system-phone-timeline">
                        {activeSystemPanel.rows.map((row, index) => (
                          <article key={row.name}>
                            <time>{["09:30", "11:00", "14:20"][index]}</time>
                            <span aria-hidden="true" />
                            <p>
                              <strong>{row.name}</strong>
                              <small>{row.detail}</small>
                            </p>
                          </article>
                        ))}
                      </div>
                      <div className="system-phone-agenda-summary">
                        {activeSystemPanel.metrics.slice(0, 2).map((metric) => (
                          <article key={metric.label}>
                            <small>{metric.label}</small>
                            <strong>{metric.value}</strong>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSystemView === 3 && (
                    <div className="system-phone-reports">
                      <article className="system-phone-report-main">
                        <span>Receita no semestre</span>
                        <strong>{activeSystemPanel.metrics[0].value}</strong>
                        <small>{activeSystemPanel.metrics[0].trend}</small>
                        <div aria-label="Evolução da receita no semestre">
                          {activeSystemPanel.bars.map((value, index) => (
                            <i
                              key={`phone-report-${index}`}
                              style={{ height: `${value}%` }}
                            />
                          ))}
                        </div>
                      </article>
                      <div className="system-phone-report-summary">
                        {activeSystemPanel.metrics.slice(1).map((metric) => (
                          <article key={metric.label}>
                            <small>{metric.label}</small>
                            <strong>{metric.value}</strong>
                            <span>{metric.trend}</span>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <nav className="system-phone-tabs" aria-label="Visões do sistema" role="tablist">
                  {systemViews.map((view, index) => (
                    <button
                      type="button"
                      key={`phone-${view.label}`}
                      id={`system-phone-tab-${index}`}
                      className={activeSystemView === index ? "is-active" : ""}
                      aria-label={`Abrir ${view.label}`}
                      aria-selected={activeSystemView === index}
                      aria-controls="system-phone-view-panel"
                      role="tab"
                      tabIndex={activeSystemView === index ? 0 : -1}
                      title={view.label}
                      onKeyDown={(event) => handleSystemTabKeyDown(event, index)}
                      onClick={(event) => {
                        if (event.detail > 0) {
                          setSystemFocusPaused(false);
                        }

                        selectSystemView(index);
                      }}
                    >
                      <span aria-hidden="true">{view.icon}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </article>

            <div className="system-floating-card system-floating-patients" aria-hidden="true">
              <span>{activeSystemPanel.metrics[1].label}</span>
              <strong>{activeSystemPanel.metrics[1].value}</strong>
              <small>●</small>
            </div>

            <div className="system-floating-card system-floating-revenue" aria-hidden="true">
              <span>{activeSystemPanel.metrics[2].label}</span>
              <strong>{activeSystemPanel.metrics[2].value}</strong>
              <small>↗</small>
            </div>

            <span className="system-demo-tag">Dados ilustrativos</span>
          </div>
        </div>
      </section>

      <ProjectsSection />
      <DifferentiatorsSection />
      <ProcessSection />
      <AboutSection />
      <FaqSection />

      <section className="section contact-section" id="contato">
        <div className="section-shell contact-shell" data-reveal>
          <div className="contact-copy">
            <p className="section-kicker">Contato</p>
            <h2>Conte o que precisa melhorar.</h2>
            <p>
              Não é necessário chegar com uma solução pronta. Explique brevemente
              o problema e a Crivo entra em contato para organizar o próximo passo.
            </p>
            <a href="mailto:contato@crivo.com.br">contato@crivo.com.br</a>
            <span className="contact-response-note">Retorno em até um dia útil.</span>
          </div>

          <form
            className="contact-form"
            name="contato-crivo"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="contact-field-grid">
              <label>
                Nome
                <input
                  name="name"
                  placeholder="Seu nome"
                  required
                  autoComplete="name"
                />
              </label>
              <label>
                WhatsApp ou email
                <input
                  name="contact"
                  placeholder="Como podemos falar com você?"
                  required
                  autoComplete="email"
                />
              </label>
              <label>
                Tipo de projeto
                <select
                  name="project-type"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  <option value="Sistema sob medida">Sistema sob medida</option>
                  <option value="Site ou página de vendas">Site ou página de vendas</option>
                  <option value="Consultoria e evolução">Consultoria e evolução</option>
                  <option value="Ainda não sei">Ainda não sei</option>
                </select>
              </label>
              <label className="contact-message-field">
                Qual é o principal problema hoje?
                <textarea
                  name="message"
                  placeholder="Conte brevemente sobre a rotina, dificuldade ou ideia."
                  required
                />
              </label>
            </div>

            <button
              className="contact-submit"
              type="button"
              aria-disabled="true"
              aria-label="Enviar solicitação, indisponível no momento"
            >
              Enviar solicitação
            </button>
            <p
              className="form-feedback is-idle"
              aria-live="polite"
              role="status"
            />
          </form>
        </div>
      </section>
      </main>

      <SiteFooter />
    </div>
  );
}
