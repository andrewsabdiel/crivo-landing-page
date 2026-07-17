"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
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
  { href: "#diagnostico", label: "Diagnóstico" },
  { href: "#entregas", label: "O que fazemos" },
  { href: "#sistemas", label: "Sistemas" },
  { href: "#problemas", label: "Problemas" },
  { href: "#processo", label: "Processo" },
  { href: "#cases", label: "Projetos" },
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
  "comércio local",
  "serviços",
  "operações internas",
  "times pequenos",
  "negócios em crescimento",
  "gestão financeira",
  "atendimento",
] as const;

const systemViews = [
  {
    label: "Visão geral",
    icon: "⌂",
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
    key: "sistemas",
    label: "Sistemas web",
    title: "Um painel para a rotina parar de depender de memória.",
    text: "Cadastros, etapas, responsáveis, status e relatórios no mesmo fluxo.",
    metric: "1 fluxo",
    metricLabel: "para toda a operação",
    modules: ["Clientes", "Agenda", "Pedidos", "Financeiro", "Relatórios"],
  },
  {
    key: "sites",
    label: "Sites e landing pages",
    title: "Páginas que explicam rápido e conduzem para contato.",
    text: "Oferta, prova, diferenciais, FAQ e CTA organizados para conversão.",
    metric: "1 jornada",
    metricLabel: "da oferta ao contato",
    modules: ["Oferta", "Prova", "Cases", "FAQ", "Contato"],
  },
  {
    key: "apps",
    label: "Apps e portais",
    title: "Jornadas simples para clientes, equipe e operação externa.",
    text: "Áreas logadas, rotinas mobile, notificações e experiências guiadas.",
    metric: "24/7",
    metricLabel: "acesso ao fluxo",
    modules: ["Login", "Tarefas", "Arquivos", "Alertas", "Histórico"],
  },
  {
    key: "dashboards",
    label: "Dashboards",
    title: "Indicadores que deixam a próxima decisão óbvia.",
    text: "Dados úteis em telas enxutas para comparar demanda, receita e gargalos.",
    metric: "1 tela",
    metricLabel: "para decidir melhor",
    modules: ["Receita", "Demanda", "Equipe", "Tempo", "Meta"],
  },
] as const;

const problemItems = [
  {
    key: "atendimento",
    title: "Atendimento espalhado",
    symptom: "Pedidos, retornos e histórico ficam misturados em conversas.",
    result: "menos retrabalho",
    before: ["WhatsApp", "caderno", "planilha", "memória"],
    after: ["fila única", "status", "histórico", "próxima ação"],
  },
  {
    key: "processo",
    title: "Processo invisível",
    symptom: "A equipe depende de combinados informais para saber o que fazer.",
    result: "mais controle",
    before: ["sem dono", "sem prazo", "aprovação verbal", "retrabalho"],
    after: ["etapas", "responsável", "alertas", "indicadores"],
  },
  {
    key: "conversao",
    title: "Oferta confusa",
    symptom: "O visitante chega na página, mas não entende o valor rápido.",
    result: "mais contatos",
    before: ["headline vaga", "sem prova", "cta perdido", "texto genérico"],
    after: ["oferta clara", "cases", "comparação", "ação direta"],
  },
] as const;

const processItems = [
  {
    step: "01",
    title: "Diagnóstico",
    text: "Entendemos a rotina, quem usa, onde trava e qual resultado precisa aparecer.",
    output: "mapa do fluxo real",
  },
  {
    step: "02",
    title: "Arquitetura",
    text: "Definimos telas, dados, prioridades e o escopo mínimo para lançar sem improviso.",
    output: "escopo e protótipo",
  },
  {
    step: "03",
    title: "Construção",
    text: "Desenvolvemos a experiência com ciclos curtos, validação visual e regra de negócio.",
    output: "produto navegável",
  },
  {
    step: "04",
    title: "Evolução",
    text: "Publicamos, acompanhamos o uso e ajustamos o produto conforme a operação amadurece.",
    output: "base para crescer",
  },
] as const;

const caseItems = [
  {
    type: "Produto próprio",
    title: "Landing Crivo",
    challenge: "Apresentar serviços e método sem transformar a página em um catálogo.",
    solution: "Narrativa enxuta, diagnóstico interativo e demonstrações navegáveis.",
    metric: "Nesta página",
    metricLabel: "experiência publicada",
    href: "#inicio",
    linkLabel: "Explorar página",
    proof: {
      beforeTitle: "Oferta dispersa",
      afterTitle: "Jornada orientada",
      before: ["mensagem genérica", "serviços isolados", "contato sem contexto"],
      after: ["slider temático", "scrollspy", "diagnóstico conectado"],
      evidence: ["Hero responsiva", "8 seções", "Formulário real"],
    },
  },
  {
    type: "Protótipo funcional",
    title: "Dashboard de clínica",
    challenge: "Organizar indicadores, pacientes, agenda e relatórios sem sobrecarregar a tela.",
    solution: "Quatro visões interativas com hierarquia visual e navegação contextual.",
    metric: "4 visões",
    metricLabel: "funcionais nesta página",
    href: "#sistemas",
    linkLabel: "Abrir demonstração",
    proof: {
      beforeTitle: "Dados fragmentados",
      afterTitle: "Operação visível",
      before: ["agenda separada", "histórico manual", "indicadores atrasados"],
      after: ["pacientes", "agenda", "relatórios"],
      evidence: ["Tabs navegáveis", "Gráficos animados", "Modo guiado"],
    },
  },
  {
    type: "Ferramenta interativa",
    title: "Diagnóstico de operação",
    challenge: "Traduzir gargalos abstratos em uma primeira direção de produto.",
    solution: "Cálculo instantâneo conectado ao briefing enviado para a Crivo.",
    metric: "3 variáveis",
    metricLabel: "cálculo em tempo real",
    href: "#diagnostico",
    linkLabel: "Testar diagnóstico",
    proof: {
      beforeTitle: "Problema abstrato",
      afterTitle: "Próximo passo claro",
      before: ["sem prioridade", "impacto incerto", "briefing repetido"],
      after: ["score calculado", "horas recuperáveis", "resumo no contato"],
      evidence: ["Cálculo instantâneo", "Resumo persistente", "Envio estruturado"],
    },
  },
] as const;

const principles = [
  {
    title: "Diagnóstico antes da interface",
    text: "A tela não manda no projeto. O fluxo real manda.",
    href: "#diagnostico",
  },
  {
    title: "Visual limpo com densidade útil",
    text: "Bonito, mas sem sacrificar leitura, contraste e velocidade.",
    href: "#sistemas",
  },
  {
    title: "Entrega com próximo passo",
    text: "Cada etapa precisa gerar decisão, artefato ou versão utilizável.",
    href: "#processo",
  },
] as const;

const faqItems = [
  {
    question: "A Crivo faz só sites?",
    answer:
      "Não. Sites são uma frente. A Crivo também constrói sistemas web, dashboards, apps, portais e automações sob medida.",
  },
  {
    question: "Preciso chegar com escopo pronto?",
    answer:
      "Não. O escopo nasce do diagnóstico. Se você já tiver referências, dores ou fluxos mapeados, isso acelera a definição.",
  },
  {
    question: "Como sei se preciso de sistema ou landing page?",
    answer:
      "Se o problema é venda e clareza de oferta, landing page. Se o problema é rotina, controle e dados, sistema ou dashboard.",
  },
  {
    question: "Depois da entrega existe suporte?",
    answer:
      "Sim. A entrega pode incluir acompanhamento inicial, suporte contínuo e evolução por novas versões.",
  },
] as const;

export default function Home() {
  const [activeHero, setActiveHero] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [activeSystemView, setActiveSystemView] = useState(0);
  const [activeProblemKey, setActiveProblemKey] =
    useState<(typeof problemItems)[number]["key"]>("atendimento");
  const [activeProcess, setActiveProcess] = useState(0);
  const [activeCase, setActiveCase] = useState(0);
  const [lostHours, setLostHours] = useState(8);
  const [handoffs, setHandoffs] = useState(4);
  const [channels, setChannels] = useState(3);
  const [activeSection, setActiveSection] = useState("");
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [heroAutoEnabled, setHeroAutoEnabled] = useState(true);
  const [heroInteractionPaused, setHeroInteractionPaused] = useState(false);
  const [caseAutoEnabled, setCaseAutoEnabled] = useState(true);
  const [caseInteractionPaused, setCaseInteractionPaused] = useState(false);
  const [caseComparison, setCaseComparison] = useState(58);
  const [systemGuideEnabled, setSystemGuideEnabled] = useState(false);
  const [systemGuidePaused, setSystemGuidePaused] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [diagnosisApplied, setDiagnosisApplied] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formStatus, setFormStatus] =
    useState<"idle" | "submitting" | "success" | "error">("idle");
  const systemStageRef = useRef<HTMLDivElement>(null);
  const contactFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 40);
    const closeDesktopMenu = () => {
      if (window.innerWidth > 1060) {
        setMobileMenuOpen(false);
      }
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
    window.addEventListener("resize", closeDesktopMenu);
    window.addEventListener("keydown", closeWithEscape);
    document.addEventListener("visibilitychange", updateVisibility);
    motionQuery.addEventListener("change", updateMotionPreference);

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", closeDesktopMenu);
      window.removeEventListener("keydown", closeWithEscape);
      document.removeEventListener("visibilitychange", updateVisibility);
      motionQuery.removeEventListener("change", updateMotionPreference);
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
    const root = document.documentElement;
    root.dataset.heroTheme = heroPanels[activeHero].theme;

    return () => {
      delete root.dataset.heroTheme;
    };
  }, [activeHero]);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !documentVisible ||
      !caseAutoEnabled ||
      caseInteractionPaused
    ) {
      return;
    }

    const caseTimer = window.setInterval(() => {
      setActiveCase((current) => (current + 1) % caseItems.length);
    }, 6800);

    return () => window.clearInterval(caseTimer);
  }, [caseAutoEnabled, caseInteractionPaused, documentVisible, prefersReducedMotion]);

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

    if (prefersReducedMotion) {
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
  const activeServiceItem = serviceItems[activeService];
  const activeSystemPanel = systemViews[activeSystemView];
  const activeProblem = useMemo(
    () =>
      problemItems.find((problem) => problem.key === activeProblemKey) ??
      problemItems[0],
    [activeProblemKey],
  );
  const activeProcessItem = processItems[activeProcess];
  const activeCaseItem = caseItems[activeCase];
  const diagnosisScore = Math.min(
    96,
    Math.round(lostHours * 1.6 + handoffs * 6 + channels * 7),
  );
  const recoveredHours = Math.round(lostHours * 4 * 0.45);
  const diagnosisType =
    diagnosisScore >= 74
      ? "Sistema operacional"
      : diagnosisScore >= 52
        ? "Dashboard + automação"
        : "Landing ou fluxo leve";
  const diagnosisUrgency =
    diagnosisScore >= 74 ? "Alta" : diagnosisScore >= 52 ? "Moderada" : "Inicial";
  const diagnosisFocus =
    lostHours / 30 >= handoffs / 12 && lostHours / 30 >= channels / 8
      ? "tempo operacional"
      : handoffs / 12 >= channels / 8
        ? "passagens de responsabilidade"
        : "canais paralelos";
  const diagnosisSummary = `Diagnóstico inicial: ${diagnosisType}. Prioridade estimada em ${diagnosisScore}%, com potencial de recuperar aproximadamente ${recoveredHours} horas por mês. Contexto: ${lostHours} horas perdidas por semana, ${handoffs} passagens de responsabilidade e ${channels} canais no processo.`;
  const heroIsPlaying =
    documentVisible &&
    !prefersReducedMotion &&
    heroAutoEnabled &&
    !heroInteractionPaused;

  const changeCase = (direction: 1 | -1) => {
    setCaseAutoEnabled(false);
    setCaseComparison(58);
    setActiveCase(
      (current) => (current + direction + caseItems.length) % caseItems.length,
    );
  };

  const selectHeroPanel = (index: number) => {
    setHeroAutoEnabled(false);
    setActiveHero(index);
  };

  const selectCase = (index: number) => {
    setCaseAutoEnabled(false);
    setActiveCase(index);
    setCaseComparison(58);
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

  const useDiagnosisInContact = () => {
    setContactMessage(diagnosisSummary);
    setDiagnosisApplied(true);
    setFormStep(1);
    setFormStatus("idle");
    document.querySelector("#contato")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    window.setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>("#contato textarea")?.focus();
    }, 500);
  };

  const goToFormStep = (nextStep: number) => {
    if (nextStep > formStep) {
      const currentPanel = contactFormRef.current?.querySelector<HTMLElement>(
        `[data-form-step="${formStep}"]`,
      );
      const controls = Array.from(
        currentPanel?.querySelectorAll<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >("input, select, textarea") ?? [],
      ).filter((control) => !control.disabled && control.type !== "hidden");
      const invalidControl = controls.find((control) => !control.checkValidity());

      if (invalidControl) {
        invalidControl.reportValidity();
        invalidControl.focus();
        return;
      }
    }

    setFormStatus("idle");
    setFormStep(Math.min(3, Math.max(1, nextStep)));
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
      setContactMessage("");
      setDiagnosisApplied(false);
      setFormStep(1);
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  };

  const moveInteractiveGlass = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    event.currentTarget.style.setProperty("--glass-pointer-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--glass-pointer-y", `${y * 100}%`);
    event.currentTarget.style.setProperty("--glass-shift-x", `${(x - 0.5) * 4}px`);
    event.currentTarget.style.setProperty("--glass-shift-y", `${(y - 0.5) * 4}px`);
  };

  const resetInteractiveGlass = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--glass-pointer-x", "50%");
    event.currentTarget.style.setProperty("--glass-pointer-y", "50%");
    event.currentTarget.style.setProperty("--glass-shift-x", "0px");
    event.currentTarget.style.setProperty("--glass-shift-y", "0px");
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
      `${pointerX * 3.2}deg`,
    );
    event.currentTarget.style.setProperty(
      "--system-tilt-y",
      `${pointerY * -2.4}deg`,
    );
    event.currentTarget.style.setProperty(
      "--system-shift-x",
      `${pointerX * 12}px`,
    );
    event.currentTarget.style.setProperty(
      "--system-shift-y",
      `${pointerY * 9}px`,
    );
    event.currentTarget.style.setProperty(
      "--system-float-x",
      `${pointerX * -18}px`,
    );
    event.currentTarget.style.setProperty(
      "--system-float-y",
      `${pointerY * -14}px`,
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
    <main className="site-page" data-theme={activeHeroPanel.theme}>
      <header
        className={`site-header ${headerScrolled ? "is-scrolled" : ""} ${
          mobileMenuOpen ? "is-menu-open" : ""
        }`}
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

      <section className="hero-section" id="inicio">
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
            <Image
              className="hero-logo"
              src={assetPath("/assets/crivo-word-blue.png")}
              alt="Crivo"
              width={407}
              height={103}
              priority
            />
            <h1>Produtos digitais. Rotinas claras.</h1>
            <p className="hero-lead">
              A Crivo transforma processos confusos em sistemas, sites e
              experiências digitais simples de usar.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#diagnostico">
                Diagnosticar rotina
              </a>
              <a className="button button-secondary" href="#entregas">
                Ver entregas →
              </a>
            </div>
          </div>

          <div
            className="hero-slider-meta"
            aria-live="polite"
            data-playing={heroIsPlaying}
            onMouseEnter={() => setHeroInteractionPaused(true)}
            onMouseLeave={() => setHeroInteractionPaused(false)}
            onFocusCapture={() => setHeroInteractionPaused(true)}
            onBlurCapture={() => setHeroInteractionPaused(false)}
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
        <div className="strip-track">
          {[...audienceItems, ...audienceItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section diagnostic-section" id="diagnostico">
        <div className="section-shell split-shell" data-reveal>
          <div className="section-copy">
            <p className="section-kicker">Diagnóstico interativo</p>
            <h2>Onde sua rotina trava.</h2>
            <p>
              Volume de tarefas, trocas de responsabilidade e canais paralelos
              ajudam a indicar qual solução deve vir primeiro.
            </p>
          </div>

          <div className="diagnostic-lab">
            <div className="range-group">
              <label>
                Horas perdidas por semana
                <strong>{lostHours}h</strong>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={lostHours}
                  onChange={(event) => setLostHours(Number(event.target.value))}
                />
              </label>
              <label>
                Passagens de responsabilidade
                <strong>{handoffs}</strong>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={handoffs}
                  onChange={(event) => setHandoffs(Number(event.target.value))}
                />
              </label>
              <label>
                Canais usados no processo
                <strong>{channels}</strong>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={channels}
                  onChange={(event) => setChannels(Number(event.target.value))}
                />
              </label>
            </div>

            <div
              className="diagnostic-result interactive-glass"
              onPointerMove={moveInteractiveGlass}
              onPointerLeave={resetInteractiveGlass}
            >
              <span>Prioridade estimada</span>
              <strong>{diagnosisScore}%</strong>
              <h3>{diagnosisType}</h3>
              <p>
                Potencial de recuperar aproximadamente {recoveredHours} horas
                por mês com um fluxo digital mais claro.
              </p>
              <dl className="diagnostic-facts">
                <div>
                  <dt>Urgência</dt>
                  <dd>{diagnosisUrgency}</dd>
                </div>
                <div>
                  <dt>Foco</dt>
                  <dd>{diagnosisFocus}</dd>
                </div>
              </dl>
              <button type="button" onClick={useDiagnosisInContact}>
                {diagnosisApplied ? "Diagnóstico adicionado" : "Usar este diagnóstico"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section deliveries-section" id="entregas">
        <div className="section-shell" data-reveal>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Entregas</p>
              <h2>O que fazemos.</h2>
            </div>
            <p>
              Produto, módulos e objetivo são definidos a partir da rotina que
              precisa melhorar, não de um pacote pronto.
            </p>
          </div>

          <div className="service-builder">
            <div className="service-tabs" role="tablist" aria-label="Entregas">
              {serviceItems.map((service, index) => (
                <button
                  type="button"
                  key={service.key}
                  role="tab"
                  aria-selected={activeService === index}
                  className={activeService === index ? "is-active" : ""}
                  onClick={() => setActiveService(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {service.label}
                </button>
              ))}
            </div>

            <article
              className="service-preview interactive-glass"
              aria-live="polite"
              onPointerMove={moveInteractiveGlass}
              onPointerLeave={resetInteractiveGlass}
            >
              <div className="service-preview-copy">
                <span>{activeServiceItem.label}</span>
                <h3>{activeServiceItem.title}</h3>
                <p>{activeServiceItem.text}</p>
              </div>

              <div className="product-window">
                <header>
                  <span />
                  <span />
                  <span />
                </header>
                <div className="product-window-grid">
                  <div className="metric-tile">
                    <small>{activeServiceItem.metricLabel}</small>
                    <strong>{activeServiceItem.metric}</strong>
                  </div>
                  <div className="module-list">
                    {activeServiceItem.modules.map((module, index) => (
                      <p
                        key={module}
                        style={{ "--item-index": index } as CSSProperties}
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {module}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
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
                    <span>Visão do sistema</span>
                    <h3>{activeSystemPanel.label}</h3>
                    <p>{activeSystemPanel.subtitle}</p>
                  </div>
                  <div className="system-user-badge" aria-label="Administrador">
                    AD
                  </div>
                </header>

                <div className="system-metric-grid">
                  {activeSystemPanel.metrics.map((metric) => (
                    <article key={metric.label}>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                      <small
                        className={
                          metric.trend === "Estável" || metric.trend === "No ritmo"
                            ? "is-neutral"
                            : ""
                        }
                      >
                        {metric.trend !== "Estável" && metric.trend !== "No ritmo"
                          ? "↗ "
                          : "— "}
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
            </article>

            <div className="system-floating-card system-floating-patients" aria-hidden="true">
              <span>Pacientes</span>
              <strong>842</strong>
              <small>●</small>
            </div>

            <div className="system-floating-card system-floating-revenue" aria-hidden="true">
              <span>Receita</span>
              <strong>+24%</strong>
              <small>↗</small>
            </div>

            <span className="system-demo-tag">Dados ilustrativos</span>
          </div>
        </div>
      </section>

      <section className="section problems-section" id="problemas">
        <div className="section-shell" data-reveal>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Problemas que resolvemos</p>
              <h2>Do caos ao fluxo.</h2>
            </div>
            <p>
              Atendimento, processo e oferta deixam de depender de memória,
              conversas soltas e decisões sem contexto.
            </p>
          </div>

          <div className="problem-workbench">
            <div className="problem-tabs" role="tablist" aria-label="Problemas">
              {problemItems.map((problem) => (
                <button
                  type="button"
                  key={problem.key}
                  role="tab"
                  aria-selected={activeProblem.key === problem.key}
                  className={activeProblem.key === problem.key ? "is-active" : ""}
                  onClick={() => setActiveProblemKey(problem.key)}
                >
                  <span>{problem.title}</span>
                  <strong>{problem.result}</strong>
                </button>
              ))}
            </div>

            <article className="problem-panel">
              <div className="problem-copy">
                <span>Diagnóstico</span>
                <h3>{activeProblem.symptom}</h3>
              </div>

              <div className="problem-map">
                <div className="map-column map-column-bad">
                  <span>Antes</span>
                  {activeProblem.before.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
                <div className="map-bridge" aria-hidden="true">
                  <span />
                  <strong>-&gt;</strong>
                  <span />
                </div>
                <div className="map-column map-column-good">
                  <span>Depois</span>
                  {activeProblem.after.map((item, index) => (
                    <p key={item}>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section process-section" id="processo">
        <div className="section-shell split-shell" data-reveal>
          <div className="section-copy">
            <p className="section-kicker">Como acontece</p>
            <h2>Como o projeto acontece.</h2>
            <p>
              Cada fase termina com uma decisão, um artefato ou uma versão que
              pode ser validada antes do próximo investimento.
            </p>
          </div>

          <div className="process-lab">
            <div className="process-track">
              {processItems.map((item, index) => (
                <button
                  type="button"
                  key={item.step}
                  className={activeProcess === index ? "is-active" : ""}
                  onClick={() => setActiveProcess(index)}
                >
                  <span>{item.step}</span>
                  {item.title}
                </button>
              ))}
            </div>

            <article className="process-detail">
              <span>{activeProcessItem.step}</span>
              <h3>{activeProcessItem.title}</h3>
              <p>{activeProcessItem.text}</p>
              <strong>{activeProcessItem.output}</strong>
              <div className="process-progress">
                <span style={{ width: `${(activeProcess + 1) * 25}%` }} />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section cases-section" id="cases">
        <div className="section-shell split-shell" data-reveal>
          <div className="section-copy">
            <p className="section-kicker">Evidências</p>
            <h2>Projetos em prática.</h2>
            <p>
              Diferentes rotinas pedem produtos diferentes, mas todas precisam
              de uma mudança que seja fácil de perceber e usar.
            </p>
          </div>

          <div
            className="case-carousel"
            onMouseEnter={() => setCaseInteractionPaused(true)}
            onMouseLeave={() => setCaseInteractionPaused(false)}
            onFocusCapture={() => setCaseInteractionPaused(true)}
            onBlurCapture={() => setCaseInteractionPaused(false)}
          >
            <div className="case-experience">
              <div
                className="case-proof"
                style={{ "--case-reveal": `${caseComparison}%` } as CSSProperties}
              >
                <header>
                  <span>Evidência do produto</span>
                  <strong>{activeCaseItem.type}</strong>
                </header>
                <div className="case-proof-canvas">
                  <div className="case-proof-layer is-before">
                    <span>Antes</span>
                    <h3>{activeCaseItem.proof.beforeTitle}</h3>
                    <div>
                      {activeCaseItem.proof.before.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                  <div className="case-proof-layer is-after">
                    <span>Depois</span>
                    <h3>{activeCaseItem.proof.afterTitle}</h3>
                    <div>
                      {activeCaseItem.proof.after.map((item, index) => (
                        <p key={item}>
                          <small>{String(index + 1).padStart(2, "0")}</small>
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <span className="case-proof-handle" aria-hidden="true" />
                </div>
                <label className="case-comparison-control">
                  <span>Antes</span>
                  <input
                    type="range"
                    min="12"
                    max="88"
                    value={caseComparison}
                    aria-label="Comparar antes e depois"
                    onChange={(event) => {
                      setCaseAutoEnabled(false);
                      setCaseComparison(Number(event.target.value));
                    }}
                  />
                  <span>Depois</span>
                </label>
              </div>

              <article
                className="case-card interactive-glass"
                onPointerMove={moveInteractiveGlass}
                onPointerLeave={resetInteractiveGlass}
              >
                <span>{activeCaseItem.type}</span>
                <h3>{activeCaseItem.title}</h3>
                <dl>
                  <div>
                    <dt>Dor</dt>
                    <dd>{activeCaseItem.challenge}</dd>
                  </div>
                  <div>
                    <dt>Solução</dt>
                    <dd>{activeCaseItem.solution}</dd>
                  </div>
                </dl>
                <div className="case-evidence-list" aria-label="Evidências disponíveis">
                  {activeCaseItem.proof.evidence.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="case-metric">
                  <strong>{activeCaseItem.metric}</strong>
                  <span>{activeCaseItem.metricLabel}</span>
                </div>
                <a href={activeCaseItem.href}>{activeCaseItem.linkLabel}</a>
              </article>
            </div>

            <div className="case-controls">
              <button
                type="button"
                aria-label="Case anterior"
                title="Case anterior"
                onClick={() => changeCase(-1)}
              >
                <span aria-hidden="true">←</span>
              </button>
              <div>
                {caseItems.map((item, index) => (
                  <button
                    type="button"
                    key={item.type}
                    className={activeCase === index ? "is-active" : ""}
                    onClick={() => selectCase(index)}
                    aria-label={`Mostrar ${item.type}`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Próximo case"
                title="Próximo case"
                onClick={() => changeCase(1)}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section principles-section">
        <div className="section-shell" data-reveal>
          <div className="section-heading">
            <div>
              <p className="section-kicker">Essência</p>
              <h2>O essencial bem resolvido.</h2>
            </div>
            <p>
              Cada decisão visual reduz ruído, organiza a informação e deixa o
              próximo passo mais evidente para quem usa.
            </p>
          </div>

          <div className="principle-grid">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className="interactive-glass"
                onPointerMove={moveInteractiveGlass}
                onPointerLeave={resetInteractiveGlass}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
                <a href={principle.href}>Ver seção</a>
              </article>
            ))}
          </div>
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

      <section className="closing-cta-section" aria-labelledby="closing-cta-title">
        <div className="section-shell closing-cta-shell" data-reveal>
          <div>
            <p className="section-kicker">Próxima decisão</p>
            <h2 id="closing-cta-title">Clareza para o próximo passo.</h2>
          </div>
          <p>
            Conte onde a operação trava. A primeira conversa organiza prioridade,
            escopo e formato de entrega.
          </p>
          <a className="button button-primary" href="#contato">
            Conversar sobre o projeto
          </a>
        </div>
      </section>

      <section className="section contact-section" id="contato">
        <div className="section-shell contact-shell" data-reveal>
          <div className="contact-copy">
            <p className="section-kicker">Próximo passo</p>
            <h2>Vamos começar.</h2>
            <p>
              Envie o contexto do projeto para receber um primeiro direcionamento
              sobre escopo, prioridade e melhor formato de entrega.
            </p>
            <a href="mailto:contato@crivo.com.br">contato@crivo.com.br</a>
          </div>

          <form
            ref={contactFormRef}
            className="contact-form"
            name="diagnostico-crivo"
            method="POST"
            action={assetPath("/__forms.html")}
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            aria-busy={formStatus === "submitting"}
            onSubmit={submitContact}
          >
            <input type="hidden" name="form-name" value="diagnostico-crivo" />
            <input type="hidden" name="subject" value="Novo diagnóstico Crivo" />
            <input type="hidden" name="diagnosis-type" value={diagnosisType} />
            <input
              type="hidden"
              name="diagnosis-score"
              value={`${diagnosisScore}%`}
            />
            <input type="hidden" name="diagnosis-hours" value={lostHours} />
            <input type="hidden" name="diagnosis-handoffs" value={handoffs} />
            <input type="hidden" name="diagnosis-channels" value={channels} />
            <input
              type="hidden"
              name="diagnosis-summary"
              value={diagnosisApplied ? diagnosisSummary : "Não aplicado"}
            />
            <p className="contact-honeypot" aria-hidden="true">
              <label>
                Não preencha este campo
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>
            <div className="form-stepper" aria-label="Etapas do formulário">
              {["Necessidade", "Contexto", "Contato"].map((step, index) => (
                <span
                  key={step}
                  className={formStep === index + 1 ? "is-active" : ""}
                  aria-current={formStep === index + 1 ? "step" : undefined}
                >
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  {step}
                </span>
              ))}
            </div>

            <div
              className="form-step-panel"
              data-form-step="1"
              hidden={formStep !== 1}
            >
              <label>
                O que você precisa?
                <select
                  name="project-type"
                  required
                  defaultValue=""
                  disabled={formStatus === "submitting"}
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  <option value="Sistema web">Sistema web</option>
                  <option value="Site ou landing page">Site ou landing page</option>
                  <option value="Dashboard">Dashboard</option>
                  <option value="App ou portal">App ou portal</option>
                  <option value="Ainda não sei">Ainda não sei</option>
                </select>
              </label>
              <label>
                O que precisa melhorar?
                <textarea
                  name="message"
                  placeholder="Conte sobre a rotina, o problema ou a ideia."
                  required
                  value={contactMessage}
                  disabled={formStatus === "submitting"}
                  onChange={(event) => {
                    setContactMessage(event.target.value);
                    setDiagnosisApplied(false);
                    if (formStatus !== "idle") {
                      setFormStatus("idle");
                    }
                  }}
                />
              </label>
              <div className="form-actions is-forward">
                <button type="button" onClick={() => goToFormStep(2)}>
                  Continuar
                </button>
              </div>
            </div>

            <div
              className="form-step-panel"
              data-form-step="2"
              hidden={formStep !== 2}
            >
              <label>
                Quando precisa começar?
                <select
                  name="timeline"
                  required
                  defaultValue=""
                  disabled={formStatus === "submitting"}
                >
                  <option value="" disabled>
                    Selecione um prazo
                  </option>
                  <option value="Agora">Agora</option>
                  <option value="Em até 3 meses">Em até 3 meses</option>
                  <option value="Neste semestre">Neste semestre</option>
                  <option value="Ainda estou avaliando">Ainda estou avaliando</option>
                </select>
              </label>
              <label>
                Empresa ou operação <span>opcional</span>
                <input
                  name="company"
                  placeholder="Nome da empresa"
                  disabled={formStatus === "submitting"}
                />
              </label>
              {diagnosisApplied && (
                <div className="contact-diagnosis-summary">
                  <span>Diagnóstico conectado</span>
                  <strong>{diagnosisType}</strong>
                  <p>
                    Prioridade {diagnosisScore}% · foco em {diagnosisFocus} · cerca de {recoveredHours}h recuperáveis por mês.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDiagnosisApplied(false);
                      setContactMessage("");
                    }}
                  >
                    Remover
                  </button>
                </div>
              )}
              <div className="form-actions">
                <button type="button" className="is-secondary" onClick={() => goToFormStep(1)}>
                  Voltar
                </button>
                <button type="button" onClick={() => goToFormStep(3)}>
                  Continuar
                </button>
              </div>
            </div>

            <div
              className="form-step-panel"
              data-form-step="3"
              hidden={formStep !== 3}
            >
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
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="voce@email.com"
                  required
                  autoComplete="email"
                  disabled={formStatus === "submitting"}
                />
              </label>
              <div className="form-actions">
                <button type="button" className="is-secondary" onClick={() => goToFormStep(2)}>
                  Voltar
                </button>
                <button type="submit" disabled={formStatus === "submitting"}>
                  {formStatus === "submitting"
                    ? "Enviando..."
                    : "Solicitar diagnóstico"}
                </button>
              </div>
            </div>
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
                <a href="#diagnostico">Diagnóstico</a>
                <a href="#entregas">Entregas</a>
                <a href="#sistemas">Sistemas</a>
                <a href="#processo">Processo</a>
                <a href="#cases">Projetos</a>
              </nav>

              <div className="footer-contact">
                <span>Contato</span>
                <a href="mailto:contato@crivo.com.br">contato@crivo.com.br</a>
                <a href="#contato">Agendar diagnóstico</a>
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
