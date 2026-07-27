import Image from "next/image";

const basePath =
  process.env.DEPLOY_TARGET === "github-pages" ? "/crivo-landing-page" : "";

const assetPath = (path: string) => `${basePath}${path}`;

const audienceItems = [
  "clínicas",
  "mercados",
  "comércio local",
  "prestadores de serviço",
  "gestão financeira",
  "operações pequenas",
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

export function AudienceStrip() {
  return (
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
  );
}

export function ServicesSection() {
  return (
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
  );
}

export function ProjectsSection() {
  return (
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
  );
}

export function DifferentiatorsSection() {
  return (
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
  );
}

export function ProcessSection() {
  return (
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
  );
}

export function AboutSection() {
  return (
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
  );
}

export function FaqSection() {
  return (
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
  );
}

export function SiteFooter() {
  return (
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
                src={assetPath("/assets/crivo-mark-blue-ui.png")}
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
  );
}
