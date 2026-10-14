import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Brain,
  Check,
  Globe,
  HeartHandshake,
  Landmark,
  MessageSquare,
  ShieldCheck,
  Sparkle,
  Users,
  Zap,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { MobileTabBar, MobileTabBarSpacer } from "@/components/MobileShell";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import solidarityImage from "@/assets/home-solidarity.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Imersão Bullying — Realidade não Editada" },
      {
        name: "description",
        content:
          "Aprenda a identificar, prevenir, denunciar e reverter situações de bullying em uma experiência interativa para estudantes.",
      },
      { property: "og:title", content: "Imersão Bullying — Realidade não Editada" },
      {
        property: "og:description",
        content: "Experiência educativa sobre bullying: identificar, prevenir, agir e apoiar.",
      },
    ],
  }),
  component: HomePage,
});

const types = [
  { Icon: Zap, title: "Físico", text: "Empurrões, chutes, agressões e danos a pertences." },
  { Icon: MessageSquare, title: "Verbal", text: "Apelidos, xingamentos, humilhações e ameaças." },
  { Icon: Brain, title: "Psicológico", text: "Chantagem, manipulação, intimidação e perseguição." },
  { Icon: Globe, title: "Virtual", text: "Cyberbullying: exposição e ataques em redes e grupos." },
  { Icon: Users, title: "Social", text: "Exclusão deliberada, boatos e isolamento do grupo." },
  { Icon: Sparkle, title: "Racial", text: "Ofensas relacionadas a raça, cor, etnia ou origem." },
  { Icon: Landmark, title: "Religioso", text: "Zombarias e discriminação por crença ou fé." },
];

const signs = [
  "Queda repentina no rendimento escolar",
  "Recusa constante em ir à escola",
  "Objetos pessoais danificados ou perdidos",
  "Mudança de humor, irritabilidade ou tristeza",
  "Isolamento de amigos e atividades",
  "Queixas frequentes de dores sem causa aparente",
];

const steps = [
  { title: "Reconheça", text: "Nomeie o que está acontecendo. Bullying não é brincadeira." },
  { title: "Registre", text: "Anote datas, locais e salve prints em casos virtuais." },
  { title: "Comunique", text: "Procure professores, coordenação ou responsáveis." },
  { title: "Acolha", text: "Apoie a vítima, escute sem culpar e mantenha presença." },
  { title: "Acompanhe", text: "Verifique se as medidas funcionaram e siga monitorando." },
];

const faq = [
  {
    q: "Toda briga é bullying?",
    a: "Não. O bullying é repetitivo, intencional e envolve desequilíbrio de poder entre as pessoas.",
  },
  {
    q: "Quem presencia também tem responsabilidade?",
    a: "Sim. Quem observa pode interromper o ciclo ao não rir, não compartilhar e comunicar um adulto.",
  },
  {
    q: "Denunciar é 'dedurar'?",
    a: "Não. Denunciar protege alguém que está sofrendo e é um ato de responsabilidade coletiva.",
  },
  {
    q: "É possível reverter uma situação de bullying?",
    a: "Sim, com mediação, acompanhamento da escola, apoio à vítima e responsabilização educativa.",
  },
];

function HomePage() {
  return (
    <PageTransition>
      <div className="home-editorial bg-background text-foreground">
        <header className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-5 border-b border-border px-5 lg:px-0">
          <Link to="/home" className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-6" /> BRE
            <span className="hidden font-normal text-muted-foreground sm:inline">
              {" "}
              / Imersão Bullying
            </span>
          </Link>
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-7 text-xs text-muted-foreground md:flex"
          >
            <a href="#sobre" className="hover:text-foreground">
              O projeto
            </a>
            <a href="#aprender" className="hover:text-foreground">
              Aprender
            </a>
            <Link to="/minigames" className="hover:text-foreground">
              Minigames
            </Link>
            <a href="#perguntas" className="hover:text-foreground">
              Perguntas
            </a>
          </nav>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <Link to="/chat">
              Conversar com IA <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </header>
        <main>
          <section
            id="inicio"
            className="relative mx-auto flex min-h-[560px] max-w-6xl items-center overflow-hidden px-5 py-20 lg:px-0"
          >
            <img
              src={solidarityImage}
              alt="Estudantes unidos no ambiente escolar"
              width={1536}
              height={1024}
              fetchPriority="high"
              className="editorial-hero-image absolute inset-0 h-full w-full object-cover object-right"
            />
            <div className="relative z-10 max-w-[580px]">
              <p className="mb-6 flex items-center gap-3 text-[10px] font-medium uppercase text-muted-foreground">
                <span className="h-1 w-5 bg-editorial-accent" /> Uma nova perspectiva
              </p>
              <h1 className="text-5xl font-medium leading-[1.08] sm:text-6xl">
                Bullying.
                <br />
                Realidade
                <br />
                não editada.
              </h1>
              <p className="mt-6 max-w-[350px] text-sm leading-6 text-muted-foreground">
                Por trás de uma “brincadeira”, existe uma história real. Entenda os sinais, encontre
                apoio e faça parte da mudança.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-full bg-foreground px-5 text-background hover:bg-foreground/90"
                >
                  <Link to="/minigames">
                    Explore os desafios <ArrowUpRight />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-border bg-background/60 px-5 hover:bg-secondary"
                >
                  <a href="#aprender">
                    Entenda o bullying <ArrowDown className="size-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </section>
          <section
            id="sobre"
            className="mx-auto max-w-6xl border-y border-border px-5 py-6 lg:px-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-6 text-xs text-muted-foreground">
              <span>Respeito não é opcional.</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4" /> Reconhecer
              </span>
              <span className="flex items-center gap-2">
                <HeartHandshake className="size-4" /> Acolher
              </span>
              <span className="flex items-center gap-2">
                <Users className="size-4" /> Transformar
              </span>
            </div>
          </section>
          <section className="mx-auto max-w-5xl px-5 py-20 md:py-24">
            <div className="mb-12 max-w-xl">
              <p className="text-[10px] uppercase text-editorial-accent">
                O que você leva desta imersão
              </p>
              <h2 className="mt-4 text-3xl font-normal leading-tight sm:text-4xl">
                Um novo olhar.
                <br />
                <span className="text-muted-foreground">Atitudes que fazem diferença.</span>
              </h2>
            </div>
            <div className="editorial-grid grid md:grid-cols-2">
              <article className="pb-10 md:pr-12">
                <p className="text-[10px] uppercase text-editorial-accent">01 / Reconhecer</p>
                <h3 className="mt-3 text-3xl font-normal">Nem tudo é brincadeira.</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Intenção de machucar, repetição e desequilíbrio de poder. Reconhecer esse padrão é
                  o primeiro passo.
                </p>
                <div className="mt-8 space-y-3">
                  <div className="editorial-bar h-2 w-4/5 rounded-r-full" />
                  <p className="text-xs text-muted-foreground">
                    Uma palavra pode deixar marcas invisíveis.
                  </p>
                  <div className="h-2 w-1/2 rounded-r-full bg-secondary" />
                </div>
              </article>
              <article className="py-10 md:py-0 md:pb-10 md:pl-12">
                <p className="text-[10px] uppercase text-editorial-accent">02 / Acolher</p>
                <h3 className="mt-3 text-3xl font-normal">Ninguém precisa ficar só.</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Escutar sem julgar, não compartilhar ofensas e procurar um adulto de confiança são
                  atitudes de proteção.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <HeartHandshake className="size-12 text-editorial-accent" strokeWidth={1} />
                  <span className="text-sm">
                    Sua presença
                    <br />
                    <span className="text-muted-foreground">pode mudar uma história.</span>
                  </span>
                </div>
              </article>
              <article className="py-10 md:pr-12">
                <p className="text-[10px] uppercase text-editorial-accent">03 / Experimentar</p>
                <h3 className="mt-3 text-3xl font-normal">Aprender na prática.</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Situações reais, escolhas e reflexões. Explore os jogos e descubra diferentes
                  formas de agir.
                </p>
                <Button asChild variant="link" className="mt-5 h-auto p-0 text-foreground">
                  <Link to="/minigames">
                    Ir para os minigames <ArrowUpRight />
                  </Link>
                </Button>
              </article>
              <article className="py-10 md:pl-12">
                <p className="text-[10px] uppercase text-editorial-accent">04 / Conversar</p>
                <h3 className="mt-3 text-3xl font-normal">Toda dúvida tem espaço.</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Converse com a IA educativa sobre sinais de alerta, formas de apoiar e caminhos
                  para pedir ajuda.
                </p>
                <Button asChild variant="link" className="mt-5 h-auto p-0 text-foreground">
                  <Link to="/chat">
                    Conhecer a IA Bullying <ArrowUpRight />
                  </Link>
                </Button>
              </article>
            </div>
          </section>
          <section id="aprender" className="border-y border-border">
            <div className="mx-auto max-w-5xl px-5 py-20">
              <p className="text-[10px] uppercase text-editorial-accent">
                Além do que os olhos veem
              </p>
              <h2 className="mt-4 max-w-lg text-3xl font-normal sm:text-4xl">
                O bullying tem muitas formas.
                <br />
                <span className="text-muted-foreground">Todas merecem atenção.</span>
              </h2>
              <div className="mt-12 grid gap-x-12 sm:grid-cols-2">
                {types.map(({ Icon, title, text }, index) => (
                  <article key={title} className="flex gap-4 border-t border-border py-6">
                    <span className="pt-1 text-[10px] text-muted-foreground">0{index + 1}</span>
                    <div className="flex-1">
                      <h3 className="flex items-center gap-2 text-lg">
                        <Icon className="size-4 text-editorial-accent" />
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
          <section className="mx-auto grid max-w-5xl gap-12 px-5 py-20 md:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase text-editorial-accent">Perceber é cuidar</p>
              <h2 className="mt-4 text-3xl font-normal">
                Sinais que
                <br />
                pedem atenção.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                Um sinal isolado não confirma bullying. Mudanças persistentes merecem escuta e
                acompanhamento.
              </p>
            </div>
            <ul className="space-y-5">
              {signs.map((sign) => (
                <li
                  key={sign}
                  className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <Check className="mt-1 size-4 shrink-0 text-editorial-accent" />
                  {sign}
                </li>
              ))}
            </ul>
          </section>
          <section className="border-y border-border">
            <div className="mx-auto max-w-5xl px-5 py-20">
              <h2 className="text-3xl font-normal">Do silêncio à ação.</h2>
              <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                {steps.map((step, index) => (
                  <li key={step.title}>
                    <span className="text-xs text-editorial-accent">0{index + 1}</span>
                    <h3 className="mt-4 text-lg">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <section id="perguntas" className="mx-auto max-w-3xl px-5 py-20">
            <h2 className="mb-8 text-center text-3xl font-normal">
              Vamos esclarecer algumas coisas.
            </h2>
            <Accordion type="single" collapsible>
              {faq.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="py-5 text-left text-base font-normal">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-6 text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          <section className="border-t border-border px-5 py-16 text-center">
            <p className="text-xs text-editorial-accent">O próximo passo pode ser seu.</p>
            <h2 className="mx-auto mt-4 max-w-xl text-3xl font-normal sm:text-4xl">
              Uma escola mais segura
              <br />
              começa com a gente.
            </h2>
            <Button
              asChild
              className="mt-7 rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <Link to="/chat">
                Vamos conversar <ArrowUpRight />
              </Link>
            </Button>
          </section>
          <MobileTabBarSpacer />
        </main>
        <Footer />
        <MobileTabBar />
      </div>
    </PageTransition>
  );
}
