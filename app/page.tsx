"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
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
    theme: "cobalt",
    label: "Diagnóstico",
    title: "Fluxos reais antes de qualquer tela.",
    metric: "01",
  },
  {
    image: "/imagens/bg_3.jpg",
    theme: "graphite",
    label: "Produto",
    title: "Interface clara para operação diária.",
    metric: "02",
  },
  {
    image: "/imagens/bg_5.jpg",
    theme: "prism",
    label: "Evolução",
    title: "Entrega preparada para crescer.",
    metric: "03",
  },
] as const;

const audienceItems = [
  "clínicas",
  "mercados",
  "comércio local",
  "prestadores de serviço",
  "gestão financeira",
  "operações pequenas",
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

const serviceItems = [
  {
    icon: "01",
    title: "Sistemas sob medida",
    text: "Organize clientes, agenda, pedidos, financeiro e equipe em um sistema feito para a rotina do seu negócio.",
  },
  {
    icon: "02",
    title: "Sites e páginas de vendas",
    text: "Apresente seu negócio com clareza, seja encontrado e transforme visitas em conversas pelo canal certo.",
  },
  {
    icon: "03",
    title: "Consultoria e evolução",
    text: "Entenda o que vale digitalizar primeiro e evolua sua operação sem comprar ferramentas desnecessárias.",
  },
] as const;

const applicationItems = [
  {
    type: "Clínicas e estúdios",
    title: "Atendimento sem depender de caderno e mensagens soltas.",
    text: "Agenda, cadastro, histórico e cobranças ficam organizados em um único fluxo.",
    benefits: ["Agenda centralizada", "Lembretes e confirmações", "Histórico por cliente"],
  },
  {
    type: "Comércio local",
    title: "Uma presença digital que facilita novos pedidos e contatos.",
    text: "Site rápido, oferta clara e acesso direto ao WhatsApp para o cliente agir sem dificuldade.",
    benefits: ["Oferta fácil de entender", "Contato em poucos cliques", "Experiência mobile"],
  },
  {
    type: "Gestão da operação",
    title: "Informações importantes visíveis para decidir com segurança.",
    text: "Pedidos, estoque, tarefas e financeiro deixam de ficar espalhados entre planilhas.",
    benefits: ["Responsáveis definidos", "Indicadores essenciais", "Menos trabalho repetido"],
  },
] as const;

const processItems = [
  {
    step: "01",
    label: "Entendimento",
    title: "Aprendemos como seu negócio funciona.",
    items: [
      "Conversa sobre a rotina e os problemas atuais",
      "Análise das ferramentas que você já utiliza",
      "Definição do que precisa ser resolvido primeiro",
    ],
  },
  {
    step: "02",
    label: "Desenho e aprovação",
    title: "Você vê a solução antes da programação.",
    items: [
      "Organização das telas e do fluxo principal",
      "Apresentação visual para validação",
      "Ajustes antes do desenvolvimento",
    ],
  },
  {
    step: "03",
    label: "Construção",
    title: "A solução é construída em etapas claras.",
    items: [
      "Desenvolvimento em entregas menores",
      "Acompanhamento claro da evolução",
      "Ambiente de teste antes do lançamento",
    ],
  },
  {
    step: "04",
    label: "Entrega e evolução",
    title: "A solução entra na rotina com suporte.",
    items: [
      "Orientação para começar a usar",
      "Suporte depois da publicação",
      "Novas melhorias conforme o negócio cresce",
    ],
  },
] as const;

const differentiatorItems = [
  {
    number: "01",
    title: "Foco em pequenos negócios",
    text: "A solução parte da realidade da sua rotina, sem pacotes cheios de funções que você não vai usar.",
  },
  {
    number: "02",
    title: "Contato direto com o time",
    text: "Você conversa com quem entende, desenha e desenvolve o projeto, sem camadas de atendimento.",
  },
  {
    number: "03",
    title: "Parceria depois da entrega",
    text: "O produto pode continuar evoluindo conforme novas necessidades aparecem no seu negócio.",
  },
] as const;

const teamItems = [
  {
    image: "/imagens/equipe/vicenzo.jpg",
    name: "Vicenzo",
    role: "Dev Full-Stack",
    text: "Transforma cada ideia em um sistema funcionando de ponta a ponta.",
  },
  {
    image: "/imagens/equipe/fernando.jpg",
    name: "Fernando",
    role: "Backend e Segurança",
    text: "Mantém a estrutura e os dados de cada cliente protegidos de verdade.",
  },
  {
    image: "/imagens/equipe/andrews.jpg",
    name: "Andrews",
    role: "UI/UX e Frontend",
    text: "Garante que cada tela seja simples de usar, mesmo para quem nunca usou um sistema.",
  },
] as const;

const faqItems = [
  {
    question: "Quanto tempo leva para ficar pronto?",
    answer:
      "O prazo depende do tamanho do projeto. Depois da primeira conversa, você recebe uma visão clara das etapas e do tempo estimado antes de começar.",
  },
  {
    question: "Preciso saber exatamente qual solução quero?",
    answer:
      "Não. Você pode chegar apenas com o problema da rotina. A Crivo ajuda a entender se o melhor caminho é um sistema, site ou melhoria mais simples.",
  },
  {
    question: "Vocês atendem empresas de outras cidades?",
    answer:
      "Sim. O processo pode acontecer remotamente, com reuniões curtas, apresentações e acompanhamento online.",
  },
  {
    question: "Preciso entender de tecnologia para usar?",
    answer:
      "Não. As telas são desenhadas para a rotina de quem realmente vai utilizar o produto, com orientação no momento da entrega.",
  },
  {
    question: "Existe suporte depois da entrega?",
    answer:
      "Sim. O projeto pode incluir acompanhamento inicial, suporte contínuo e novas melhorias conforme o negócio evolui.",
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
  const [heroAutoEnabled, setHeroAutoEnabled] = useState(true);
  const [heroInteractionPaused, setHeroInteractionPaused] = useState(false);
  const [systemGuideEnabled, setSystemGuideEnabled] = useState(false);
  const [systemGuidePaused, setSystemGuidePaused] = useState(false);
  const [formStatus, setFormStatus] =
    useState<"idle" | "submitting" | "success" | "error">("idle");
  const systemStageRef = useRef<HTMLDivElement>(null);

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
    if (
      prefersReducedMotion ||
      !documentVisible ||
      !heroAutoEnabled ||
      heroInteractionPaused
    ) {
      return;
    }

    const heroTimer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroPanels.length);
    }, 5200);

    return () => window.clearInterval(heroTimer);
  }, [documentVisible, heroAutoEnabled, heroInteractionPaused, prefersReducedMotion]);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !documentVisible ||
      !systemGuideEnabled ||
      systemGuidePaused
    ) {
      return;
    }

    const guideTimer = window.setInterval(() => {
      setActiveSystemView((current) => (current + 1) % systemViews.length);
    }, 4200);

    return () => window.clearInterval(guideTimer);
  }, [documentVisible, prefersReducedMotion, systemGuideEnabled, systemGuidePaused]);

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

  const activeHeroPanel = heroPanels[activeHero];
  const activeSystemPanel = systemViews[activeSystemView];
  const heroIsPlaying =
    documentVisible &&
    !prefersReducedMotion &&
    heroAutoEnabled &&
    !heroInteractionPaused;

  const selectHeroPanel = (index: number) => {
    setHeroAutoEnabled(false);
    setActiveHero(index);
  };

  const selectSystemView = (index: number) => {
    setSystemGuideEnabled(false);
    setActiveSystemView(index);
  };

  const toggleSystemGuide = () => {
    if (!systemGuideEnabled) {
      setActiveSystemView(0);
    }

    setSystemGuideEnabled((enabled) => !enabled);
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const encodedData = new URLSearchParams();

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        encodedData.append(key, value);
      }
    });

    setFormStatus("submitting");

    try {
      const response = await fetch(assetPath("/__forms.html"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedData.toString(),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar formulário");
      }

      form.reset();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
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
    <main className="site-page">
      <header
        className={`site-header ${headerScrolled ? "is-scrolled" : ""} ${
          headerOverHero ? "is-over-hero" : ""
        } ${mobileMenuOpen ? "is-menu-open" : ""}`}
        aria-label="Navegação principal"
      >
        <a className="header-brand" href="#inicio" aria-label="Crivo">
          <Image
            src={assetPath("/assets/crivo-mark-blue.png")}
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
          {navItems.map((item) => (
            <a
              href={item.href}
              key={item.href}
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
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <section
        className="hero-section"
        id="inicio"
        onMouseEnter={() => setHeroInteractionPaused(true)}
        onMouseLeave={() => setHeroInteractionPaused(false)}
        onFocusCapture={() => setHeroInteractionPaused(true)}
        onBlurCapture={() => setHeroInteractionPaused(false)}
      >
        <div
          className="hero-background"
          key={activeHeroPanel.image}
          style={
            {
              "--hero-image": `url(${assetPath(activeHeroPanel.image)})`,
            } as CSSProperties
          }
          aria-hidden="true"
        />
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

          <div
            className="hero-slider-meta"
            aria-live="polite"
            data-playing={heroIsPlaying}
          >
              <div className="hero-slider-copy">
                <span>
                  {activeHeroPanel.metric} / {String(heroPanels.length).padStart(2, "0")}
                </span>
                <p>{activeHeroPanel.label}</p>
                <h2>{activeHeroPanel.title}</h2>
              </div>

              <div className="hero-control-cluster">
                <div className="hero-slide-controls" aria-label="Slides da hero">
                  {heroPanels.map((panel, index) => (
                    <button
                      type="button"
                      key={panel.label}
                      className={`${activeHero === index ? "is-active" : ""} ${
                        activeHero === index && heroIsPlaying ? "is-running" : ""
                      }`}
                      onClick={() => selectHeroPanel(index)}
                      aria-label={`Mostrar ${panel.label}`}
                    >
                      <span aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="hero-autoplay-toggle"
                  aria-label={heroAutoEnabled ? "Pausar slider" : "Reproduzir slider"}
                  title={heroAutoEnabled ? "Pausar slider" : "Reproduzir slider"}
                  onClick={() => setHeroAutoEnabled((enabled) => !enabled)}
                >
                  <span aria-hidden="true">{heroAutoEnabled ? "Ⅱ" : "▶"}</span>
                </button>
              </div>
          </div>
        </div>
      </section>

      <section className="audience-strip" aria-label="Públicos atendidos">
        <p className="audience-summary">
          Atendemos {audienceItems.join(", ")}.
        </p>
        <div className="strip-track" aria-hidden="true">
          {[0, 1].map((groupIndex) => (
            <div className="strip-group" key={groupIndex}>
              {[...audienceItems, ...audienceItems].map((item, index) => (
                <span key={`${groupIndex}-${item}-${index}`}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section services-section" id="servicos">
        <div className="section-shell" data-reveal>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Serviços</p>
              <h2>O que fazemos.</h2>
            </div>
            <p>
              Soluções diretas para organizar a operação, apresentar seu negócio
              e facilitar o trabalho de quem está à frente dele todos os dias.
            </p>
          </div>

          <div className="service-card-grid">
            {serviceItems.map((service) => (
              <article className="simple-service-card" key={service.title}>
                <span className="simple-card-icon" aria-hidden="true">
                  {service.icon}
                </span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#contato">Conversar sobre isso <span aria-hidden="true">→</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

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
                systemGuideEnabled && !systemGuidePaused ? "is-running" : ""
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
                    key={view.label}
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
            onPointerLeave={() => {
              resetSystemStage();
              setSystemGuidePaused(false);
            }}
            onMouseEnter={() => setSystemGuidePaused(true)}
            onFocusCapture={() => setSystemGuidePaused(true)}
            onBlurCapture={() => setSystemGuidePaused(false)}
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
                      className={activeSystemView === index ? "is-active" : ""}
                      aria-label={`Abrir ${view.label}`}
                      aria-selected={activeSystemView === index}
                      aria-controls="system-view-panel"
                      role="tab"
                      title={view.label}
                      onClick={() => selectSystemView(index)}
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
                      className={activeSystemView === index ? "is-active" : ""}
                      aria-label={`Abrir ${view.label}`}
                      aria-selected={activeSystemView === index}
                      aria-controls="system-phone-view-panel"
                      role="tab"
                      title={view.label}
                      onClick={() => selectSystemView(index)}
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

      <section className="section projects-section" id="projetos">
        <div className="section-shell" data-reveal>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Aplicações</p>
              <h2>Soluções para negócios reais.</h2>
            </div>
            <p>
              Exemplos de como uma solução sob medida pode simplificar tarefas
              comuns de pequenos negócios.
            </p>
          </div>

          <div className="project-card-grid">
            {applicationItems.map((item) => (
              <article className="project-card" key={item.type}>
                <span>{item.type}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul>
                  {item.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <a href="#contato">Quero algo parecido <span aria-hidden="true">→</span></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section differentiators-section" id="diferenciais">
        <div className="section-shell" data-reveal>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Diferenciais</p>
              <h2>Por que escolher a Crivo.</h2>
            </div>
            <p>
              Menos burocracia, comunicação direta e uma solução que acompanha
              o tamanho e o momento do seu negócio.
            </p>
          </div>

          <div className="differentiator-grid">
            {differentiatorItems.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section process-section" id="processo">
        <div className="section-shell" data-reveal>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Nosso processo</p>
              <h2>Como funciona.</h2>
            </div>
            <p>
              Você acompanha as decisões, aprova o caminho e entende o que está
              sendo entregue em cada etapa.
            </p>
          </div>

          <div className="process-step-list">
            {processItems.map((item) => (
              <article className="process-step-card" key={item.step}>
                <header>
                  <span>{item.step}</span>
                  <small>{item.label}</small>
                </header>
                <h3>{item.title}</h3>
                <ul>
                  {item.items.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-section" id="sobre">
        <div className="section-shell about-shell" data-reveal>
          <header className="about-intro">
            <p className="section-kicker">Quem está por trás</p>
            <h2>
              Nós cansamos de ver pequenos negócios perdendo clientes, vendas e
              tempo por falta de um sistema decente.
            </h2>
            <p>
              A Crivo nasceu em Criciúma, Santa Catarina, com um propósito
              simples: resolver o que trava o crescimento de clínicas, estúdios
              e lojas com tecnologia feita sob medida.
            </p>
            <strong>Somos três sócios, cada um cuidando de uma frente:</strong>
          </header>

          <div className="team-grid">
            {teamItems.map((member, index) => (
              <article className={index === 1 ? "is-offset" : undefined} key={member.name}>
                <Image
                  className="team-portrait"
                  src={assetPath(member.image)}
                  alt=""
                  width={112}
                  height={112}
                  sizes="112px"
                />
                <h3>{member.name}</h3>
                <strong>{member.role}</strong>
                <p>{member.text}</p>
              </article>
            ))}
          </div>

          <p className="about-closing">
            Juntos, entregamos um produto completo, sem funções desnecessárias:
            apenas o que o seu negócio precisa para trabalhar melhor, vender e
            crescer.
          </p>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-shell split-shell" data-reveal>
          <div className="section-copy">
            <p className="section-kicker">FAQ</p>
            <h2>Dúvidas comuns.</h2>
          </div>

          <div className="faq-list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

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
            method="POST"
            action={assetPath("/__forms.html")}
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            aria-busy={formStatus === "submitting"}
            onChange={() => {
              if (formStatus !== "idle") {
                setFormStatus("idle");
              }
            }}
            onSubmit={submitContact}
          >
            <input type="hidden" name="form-name" value="contato-crivo" />
            <input type="hidden" name="subject" value="Novo contato Crivo" />
            <p className="contact-honeypot" aria-hidden="true">
              <label>
                Não preencha este campo
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <div className="contact-field-grid">
              <label>
                Nome
                <input
                  name="name"
                  placeholder="Seu nome"
                  required
                  autoComplete="name"
                  disabled={formStatus === "submitting"}
                />
              </label>
              <label>
                WhatsApp ou email
                <input
                  name="contact"
                  placeholder="Como podemos falar com você?"
                  required
                  autoComplete="email"
                  disabled={formStatus === "submitting"}
                />
              </label>
              <label>
                Tipo de projeto
                <select
                  name="project-type"
                  required
                  defaultValue=""
                  disabled={formStatus === "submitting"}
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
                  disabled={formStatus === "submitting"}
                />
              </label>
            </div>

            <button
              className="contact-submit"
              type="submit"
              disabled={formStatus === "submitting"}
            >
              {formStatus === "submitting" ? "Enviando..." : "Enviar solicitação"}
            </button>
            <p
              className={`form-feedback is-${formStatus}`}
              aria-live="polite"
              role={formStatus === "error" ? "alert" : "status"}
            >
              {formStatus === "success" &&
                "Mensagem enviada. Entraremos em contato em breve."}
              {formStatus === "error" &&
                "Não foi possível enviar agora. Tente novamente em instantes."}
            </p>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell footer-shell">
          <div className="footer-main">
            <div className="footer-brand-block">
              <a
                className="footer-brand"
                href="#inicio"
                aria-label="Crivo, voltar ao início"
              >
                <Image
                  src={assetPath("/assets/crivo-mark-blue.png")}
                  alt=""
                  width={36}
                  height={36}
                />
                <span>Crivo</span>
              </a>
              <p>
                Sistemas, sites e experiências digitais para rotinas mais claras.
              </p>
            </div>

            <div className="footer-groups">
              <nav aria-label="Links do rodapé">
                <span>Navegação</span>
                <a href="#servicos">O que fazemos</a>
                <a href="#sistemas">Sistemas</a>
                <a href="#projetos">Projetos</a>
                <a href="#processo">Processo</a>
                <a href="#sobre">Sobre</a>
              </nav>

              <div className="footer-contact">
                <span>Contato</span>
                <a href="mailto:contato@crivo.com.br">contato@crivo.com.br</a>
                <a href="#contato">Iniciar conversa</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Crivo. Todos os direitos reservados.</span>
            <a href="#inicio" aria-label="Voltar ao início da página">
              Voltar ao topo <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
