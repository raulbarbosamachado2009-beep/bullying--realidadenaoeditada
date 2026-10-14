import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Brain,
  CheckCircle2,
  Gamepad2,
  ListOrdered,
  PenLine,
  Scale,
  LockKeyhole,
  Thermometer,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";
import { MobileTabBar, MobileTabBarSpacer, MobileTopBar } from "@/components/MobileShell";
import { PageTransition } from "@/components/PageTransition";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { BentoGrid } from "@/components/ui/bento-grid";


export const Route = createFileRoute("/minigames")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Minigames Educativos — Imersão Bullying" },
      {
        name: "description",
        content:
          "Quiz, verdadeiro ou falso, ordem da ação e termômetro da situação: jogos para aprender a identificar e combater o bullying.",
      },
      { property: "og:title", content: "Minigames Educativos — Imersão Bullying" },
      {
        property: "og:description",
        content: "Jogos rápidos que ensinam empatia, prevenção e como agir diante do bullying.",
      },
    ],
  }),
  component: MinigamesPage,
});

type Question = { prompt: string; options: string[]; correct: number; explain: string };
type OrderRound = { prompt: string; steps: string[]; explain: string };
type ScaleRound = {
  prompt: string;
  min: number;
  max: number;
  explain: string;
  labels: [string, string];
};

type Game =
  | {
      kind: "quiz";
      id: string;
      title: string;
      description: string;
      Icon: typeof Brain;
      questions: Question[];
    }
  | {
      kind: "order";
      id: string;
      title: string;
      description: string;
      Icon: typeof Brain;
      rounds: OrderRound[];
    }
  | {
      kind: "scale";
      id: string;
      title: string;
      description: string;
      Icon: typeof Brain;
      rounds: ScaleRound[];
    };

const games: Game[] = [
  {
    kind: "quiz",
    id: "quiz",
    title: "Quiz",
    description: "Teste seus conhecimentos sobre os conceitos essenciais.",
    Icon: Brain,
    questions: [
      {
        prompt: "O que caracteriza o bullying?",
        options: [
          "Uma briga isolada entre colegas",
          "Agressões repetidas e intencionais com desequilíbrio de poder",
          "Qualquer desentendimento na sala",
        ],
        correct: 1,
        explain:
          "Bullying é repetitivo, intencional e envolve desequilíbrio de poder entre as partes.",
      },
      {
        prompt: "Quem pode ajudar a interromper uma situação de bullying?",
        options: [
          "Apenas a vítima",
          "Somente os pais",
          "Toda a comunidade escolar, inclusive quem observa",
        ],
        correct: 2,
        explain: "Quem observa tem papel decisivo: silenciar fortalece o agressor.",
      },
      {
        prompt: "Espalhar boatos e excluir alguém do grupo é qual tipo de bullying?",
        options: ["Social", "Físico", "Nenhum, é só fofoca"],
        correct: 0,
        explain: "Bullying social usa exclusão, boatos e isolamento para machucar sem tocar.",
      },
      {
        prompt: "Qual destes é um sinal de alerta comum em quem sofre bullying?",
        options: [
          "Querer ir à escola mais cedo todos os dias",
          "Queda repentina nas notas e recusa em ir à escola",
          "Fazer muitos amigos novos",
        ],
        correct: 1,
        explain: "Mudanças bruscas de comportamento e queda no rendimento são sinais clássicos.",
      },
      {
        prompt: "Qual canal nacional recebe denúncias de violência contra crianças e adolescentes?",
        options: ["Disque 100", "Disque 300", "Disque 999"],
        correct: 0,
        explain:
          "O Disque 100 é o canal de direitos humanos; a escola e o Conselho Tutelar também devem ser acionados.",
      },
      {
        prompt: "A Lei 13.185/2015 no Brasil institui:",
        options: [
          "A proibição do celular na escola",
          "O Programa de Combate à Intimidação Sistemática (bullying)",
          "O uso obrigatório de uniforme",
        ],
        correct: 1,
        explain:
          "A lei define bullying como intimidação sistemática e obriga escolas a prevenir e combater.",
      },
      {
        prompt: "Qual atitude ajuda mais uma vítima logo após um episódio?",
        options: [
          "Dizer para ela ignorar e ficar quieta",
          "Ouvir sem julgar e oferecer companhia para procurar ajuda",
          "Confrontar o agressor sozinho",
        ],
        correct: 1,
        explain: "Escuta sem julgamento e apoio para buscar um adulto responsável é o caminho.",
      },
      {
        prompt: "O que diferencia o cyberbullying do bullying presencial?",
        options: [
          "Ele acontece 24h, se espalha rápido e deixa registros públicos",
          "Ele não causa sofrimento real",
          "Ele só acontece entre desconhecidos",
        ],
        correct: 0,
        explain:
          "A ausência de pausa e o alcance da internet ampliam o impacto — mas também deixam provas.",
      },
    ],
  },
  {
    kind: "quiz",
    id: "vf",
    title: "Verdadeiro ou Falso",
    description: "Separe mitos de fatos sobre convivência escolar.",
    Icon: Scale,
    questions: [
      {
        prompt: "“Bullying é só brincadeira e faz parte do crescimento.”",
        options: ["Verdadeiro", "Falso"],
        correct: 1,
        explain: "Falso. Bullying causa sofrimento real e impactos duradouros na saúde mental.",
      },
      {
        prompt: "“Cyberbullying pode acontecer 24 horas por dia.”",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explain: "Verdadeiro. O ambiente digital não tem pausa, o que amplia o sofrimento.",
      },
      {
        prompt: "“Quem assiste calado também sustenta o bullying.”",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explain: "Verdadeiro. A plateia silenciosa dá poder ao agressor; apoiar a vítima muda a cena.",
      },
      {
        prompt: "“Só existe bullying quando há agressão física.”",
        options: ["Verdadeiro", "Falso"],
        correct: 1,
        explain: "Falso. Bullying verbal, social, psicológico e virtual machucam tanto quanto.",
      },
      {
        prompt: "“Revidar com outra ofensa resolve o problema.”",
        options: ["Verdadeiro", "Falso"],
        correct: 1,
        explain: "Falso. Revidar aumenta o conflito e costuma prejudicar quem já está sofrendo.",
      },
      {
        prompt: "“Prints e capturas de tela são provas úteis em casos de cyberbullying.”",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explain: "Verdadeiro. Registrar data, autor e conteúdo ajuda escola e responsáveis a agirem.",
      },
      {
        prompt: "“Quem pratica bullying nunca precisa de acompanhamento.”",
        options: ["Verdadeiro", "Falso"],
        correct: 1,
        explain:
          "Falso. Quem agride também precisa de orientação para entender e mudar o comportamento.",
      },
      {
        prompt: "“A escola tem obrigação legal de agir diante de casos de bullying.”",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explain: "Verdadeiro. A legislação brasileira responsabiliza a escola pela prevenção e ação.",
      },
    ],
  },
  {
    kind: "quiz",
    id: "atitude",
    title: "Escolha a Melhor Atitude",
    description: "Decida como agir em cenários reais do dia a dia.",
    Icon: Gamepad2,
    questions: [
      {
        prompt: "Você vê um colega sendo humilhado em um grupo de mensagens. Você:",
        options: [
          "Sai do grupo em silêncio",
          "Registra o print e comunica um adulto responsável",
          "Responde com outra ofensa",
        ],
        correct: 1,
        explain: "Registrar e comunicar protege a vítima e cria provas para a escola agir.",
      },
      {
        prompt: "Um colega recebe apelidos todos os dias e finge rir. Você:",
        options: [
          "Ri junto para não virar alvo",
          "Procura essa pessoa depois e pergunta como ela está",
          "Finge que não viu",
        ],
        correct: 1,
        explain: "Perguntar em particular mostra apoio sem expor ainda mais quem está sofrendo.",
      },
      {
        prompt: "Alguém cria um perfil falso para zoar uma pessoa da sua turma. Você:",
        options: [
          "Denuncia o perfil na plataforma e avisa a escola",
          "Compartilha para todo mundo ver",
          "Comenta pedindo para pararem e deixa por isso mesmo",
        ],
        correct: 0,
        explain: "Denunciar na plataforma e à escola interrompe a circulação do conteúdo.",
      },
      {
        prompt: "Você percebe que estava sendo o agressor sem se dar conta. Você:",
        options: [
          "Ignora, foi só brincadeira",
          "Para imediatamente, pede desculpas sinceras e muda a atitude",
          "Espera a pessoa reclamar",
        ],
        correct: 1,
        explain: "Reconhecer, parar e reparar é o que interrompe o ciclo de violência.",
      },
      {
        prompt: "A vítima pede para você não contar a ninguém. Você:",
        options: [
          "Promete guardar segredo para sempre",
          "Explica com carinho que precisa de ajuda de um adulto e se oferece para ir junto",
          "Conta para toda a turma",
        ],
        correct: 1,
        explain: "Segredo protege o agressor. Acolher e acompanhar até um adulto protege a vítima.",
      },
      {
        prompt: "Um professor faz piadas sobre um estudante e a turma ri. Você:",
        options: [
          "Comunica a coordenação ou a direção",
          "Ri também, é um professor",
          "Grava e posta na internet",
        ],
        correct: 0,
        explain: "Bullying também pode partir de adultos; a coordenação precisa ser informada.",
      },
    ],
  },
  {
    kind: "quiz",
    id: "situacao",
    title: "Complete a Situação",
    description: "Finalize a cena escolhendo o desfecho mais empático.",
    Icon: PenLine,
    questions: [
      {
        prompt: "No recreio, alguém está sempre sozinho. A melhor atitude é…",
        options: [
          "…deixar como está, é escolha dele",
          "…convidar para participar e apresentar o grupo",
          "…comentar sobre isso com outros colegas",
        ],
        correct: 1,
        explain: "O acolhimento reduz o isolamento, principal fator de risco em casos de bullying.",
      },
      {
        prompt: "Na formação dos grupos de trabalho, sobra sempre a mesma pessoa. O ideal é…",
        options: [
          "…chamar essa pessoa para o seu grupo",
          "…esperar o professor resolver",
          "…formar grupos só com quem você gosta",
        ],
        correct: 0,
        explain: "Pequenos convites quebram padrões de exclusão que se repetem o ano inteiro.",
      },
      {
        prompt: "Um colega novo é chamado por um apelido ofensivo desde o primeiro dia. O certo é…",
        options: [
          "…usar o apelido também, já pegou",
          "…chamar pelo nome e pedir que os outros façam o mesmo",
          "…não se envolver",
        ],
        correct: 1,
        explain: "Chamar pelo nome devolve dignidade e mostra à turma qual é o padrão aceitável.",
      },
      {
        prompt: "Você recebe um vídeo constrangedor de uma colega. O certo é…",
        options: [
          "…apagar, não repassar e avisar um adulto responsável",
          "…encaminhar só para os amigos próximos",
          "…comentar com emoji de risada",
        ],
        correct: 0,
        explain: "Não repassar interrompe a corrente; avisar um adulto ajuda a retirar o conteúdo.",
      },
      {
        prompt: "Depois de um caso resolvido pela escola, a turma deveria…",
        options: [
          "…reforçar acordos de convivência e acolher quem sofreu",
          "…continuar comentando o caso nos corredores",
          "…isolar quem denunciou",
        ],
        correct: 0,
        explain: "A reparação coletiva evita reincidência e protege quem teve coragem de falar.",
      },
    ],
  },
  {
    kind: "order",
    id: "ordem",
    title: "Ordem da Ação",
    description: "Monte a sequência correta de atitudes clicando na ordem certa.",
    Icon: ListOrdered,
    rounds: [
      {
        prompt: "Você presenciou um caso de bullying. Coloque os passos na ordem certa:",
        steps: [
          "Acolher a vítima e mostrar que ela não está sozinha",
          "Registrar o que aconteceu (data, local, pessoas envolvidas)",
          "Comunicar um adulto de confiança ou a escola",
          "Acompanhar a vítima nos dias seguintes",
        ],
        explain: "Acolher, registrar, comunicar e acompanhar: essa ordem protege sem expor.",
      },
      {
        prompt: "Cyberbullying em um grupo de mensagens. Ordene as ações:",
        steps: [
          "Não repassar o conteúdo",
          "Salvar prints com data e autor",
          "Denunciar e bloquear na plataforma",
          "Mostrar as provas para os responsáveis e a escola",
        ],
        explain: "Primeiro pare a circulação, depois preserve provas, denuncie e leve a adultos.",
      },
      {
        prompt: "A escola foi informada. Qual a sequência esperada?",
        steps: [
          "Escuta separada da vítima e do agressor",
          "Registro formal da ocorrência",
          "Chamada dos responsáveis das duas partes",
          "Plano de acompanhamento e mediação",
        ],
        explain: "O protocolo escolar prevê escuta, registro, envolvimento das famílias e acompanhamento.",
      },
    ],
  },
  {
    kind: "scale",
    id: "termometro",
    title: "Termômetro da Situação",
    description: "Arraste e avalie a gravidade de cada cena antes de ver a análise.",
    Icon: Thermometer,
    rounds: [
      {
        prompt: "Dois amigos se provocam de igual para igual, riem juntos e ninguém se sente mal.",
        min: 0,
        max: 3,
        labels: ["Convivência saudável", "Bullying grave"],
        explain:
          "Baixa gravidade: há reciprocidade e nenhum sofrimento. Brincadeira só é brincadeira quando todos riem.",
      },
      {
        prompt: "Um colega é chamado por um apelido que ele já pediu para pararem, todos os dias.",
        min: 5,
        max: 8,
        labels: ["Convivência saudável", "Bullying grave"],
        explain:
          "Alta gravidade: repetição + pedido ignorado = bullying verbal. Precisa de intervenção da escola.",
      },
      {
        prompt: "Um vídeo constrangedor de uma estudante circula em vários grupos da escola.",
        min: 8,
        max: 10,
        labels: ["Convivência saudável", "Bullying grave"],
        explain:
          "Gravíssimo: exposição pública e cyberbullying. Exige denúncia imediata na plataforma, escola e responsáveis.",
      },
      {
        prompt: "Uma turma combina de não falar com um colega durante a semana inteira.",
        min: 6,
        max: 9,
        labels: ["Convivência saudável", "Bullying grave"],
        explain:
          "Grave: exclusão combinada é bullying social e provoca sofrimento intenso, mesmo sem agressão física.",
      },
    ],
  },
];

function MinigamesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [orderDone, setOrderDone] = useState(false);
  const [value, setValue] = useState(5);
  const [rated, setRated] = useState(false);

  const game = games.find((g) => g.id === activeId) ?? null;
  const total =
    game === null ? 0 : game.kind === "quiz" ? game.questions.length : game.rounds.length;
  const finished = game !== null && index >= total;

  function reset() {
    setIndex(0);
    setChoice(null);
    setScore(0);
    setPicked([]);
    setOrderDone(false);
    setValue(5);
    setRated(false);
  }

  function start(id: string) {
    setActiveId(id);
    reset();
  }

  function next() {
    setIndex((i) => i + 1);
    setChoice(null);
    setPicked([]);
    setOrderDone(false);
    setValue(5);
    setRated(false);
  }

  return (
    <PageTransition>
      <AnimatedBackground />
      <Navbar />
      <MobileTopBar Icon={Gamepad2} title="Minigames" subtitle="Aprender jogando" />
      <main className="flex min-h-dvh flex-col items-center px-4 pb-16 pt-20 sm:px-6 lg:pt-28">
        <div className="mx-auto w-full max-w-5xl">
          <div className="hidden lg:block">
            <SectionTitle
              eyebrow="Minigames"
              title="Aprender jogando"
              subtitle="Seis desafios com formatos diferentes e pontuação local. Nada é enviado para lugar nenhum."
            />
          </div>
          <p className="mt-2 text-center text-[13px] text-muted-foreground lg:hidden">
            Seis desafios rápidos. Sua pontuação fica só no seu aparelho.
            <LockKeyhole className="ml-1 inline size-3.5" aria-hidden="true" />
          </p>

          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="mt-5 sm:mt-8"
          >
            <BentoGrid
              items={games.map((g, i) => ({
                title: g.title,
                description: g.description,
                icon: <g.Icon className="size-5" aria-hidden="true" />,
                meta: `${g.kind === "quiz" ? g.questions.length : g.rounds.length} desafios`,
                status: i === 0 ? "Comece aqui" : undefined,
                hasPersistentHover: i === 0,
                colSpan: i === 0 ? 2 : 1,
                tags: [g.kind === "quiz" ? "perguntas" : g.kind === "order" ? "ordem" : "escala"],
                cta: "Jogar →",
                onClick: () => start(g.id),
              }))}
            />
          </motion.div>
        </div>


        <AnimatePresence>
          {game ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-xl sm:p-4"
              role="dialog"
              aria-modal="true"
              aria-label={game.title}
            >
              <motion.div
                initial={{ scale: 0.94, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="glass max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">{game.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pontuação: {score}/{total}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="focus-ring rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Fechar
                  </button>
                </div>

                {finished ? (
                  <div className="mt-8 text-center">
                    <h3 className="text-2xl font-semibold">Muito bem!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Você acertou {score} de {total} desafios.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                      <Button className="rounded-full" onClick={() => start(game.id)}>
                        Jogar novamente
                      </Button>
                      <Button
                        variant="secondary"
                        className="rounded-full"
                        onClick={() => setActiveId(null)}
                      >
                        Voltar
                      </Button>
                    </div>
                  </div>
                ) : game.kind === "quiz" ? (
                  (() => {
                    const question = game.questions[index]!;
                    return (
                      <div className="mt-4">
                        <h3 className="text-base font-semibold leading-snug sm:text-lg">{question.prompt}</h3>
                        <ul className="mt-4 space-y-2">
                          {question.options.map((opt, i) => {
                            const selected = choice === i;
                            const isCorrect = i === question.correct;
                            return (
                              <li key={opt}>
                                <button
                                  type="button"
                                  disabled={choice !== null}
                                  onClick={() => {
                                    setChoice(i);
                                    if (isCorrect) setScore((s) => s + 1);
                                  }}
                                  className={`focus-ring w-full rounded-2xl border px-4 py-2.5 text-left text-sm transition-all duration-500 ${
                                    choice !== null && isCorrect
                                      ? "border-success/60 bg-success/10"
                                      : selected
                                        ? "border-destructive/60 bg-destructive/10"
                                        : "border-border hover:border-white/30 hover:bg-white/5"
                                  }`}
                                >
                                  {opt}
                                </button>
                              </li>
                            );
                          })}
                        </ul>

                        {choice !== null ? (
                          <Feedback
                            ok={choice === question.correct}
                            text={question.explain}
                            onNext={next}
                          />
                        ) : null}
                      </div>
                    );
                  })()
                ) : game.kind === "order" ? (
                  (() => {
                    const round = game.rounds[index]!;
                    const remaining = round.steps.filter((s) => !picked.includes(s));
                    const shuffled = [...remaining].sort((a, b) => a.localeCompare(b));
                    const correctSoFar = picked.every((s, i) => s === round.steps[i]);
                    return (
                      <div className="mt-4">
                        <h3 className="text-base font-semibold leading-snug sm:text-lg">{round.prompt}</h3>
                        <ol className="mt-5 space-y-2">
                          {picked.map((s, i) => (
                            <li
                              key={s}
                              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                                s === round.steps[i]
                                  ? "border-success/60 bg-success/10"
                                  : "border-destructive/60 bg-destructive/10"
                              }`}
                            >
                              <span className="text-xs text-muted-foreground">{i + 1}</span>
                              {s}
                            </li>
                          ))}
                        </ol>
                        {!orderDone ? (
                          <ul className="mt-4 space-y-2">
                            {shuffled.map((s) => (
                              <li key={s}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextPicked = [...picked, s];
                                    setPicked(nextPicked);
                                    if (nextPicked.length === round.steps.length) {
                                      setOrderDone(true);
                                      if (nextPicked.every((v, i) => v === round.steps[i]))
                                        setScore((sc) => sc + 1);
                                    }
                                  }}
                                  className="focus-ring w-full rounded-2xl border border-border px-4 py-2.5 text-left text-sm transition-all duration-300 hover:border-white/30 hover:bg-white/5"
                                >
                                  {s}
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {orderDone ? (
                          <Feedback ok={correctSoFar} text={round.explain} onNext={next} />
                        ) : (
                          <p className="mt-4 text-xs text-muted-foreground">
                            Clique nas atitudes na ordem em que devem acontecer.
                          </p>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  (() => {
                    const round = game.rounds[index]!;
                    const ok = value >= round.min && value <= round.max;
                    return (
                      <div className="mt-4">
                        <h3 className="text-base font-semibold leading-snug sm:text-lg">{round.prompt}</h3>
                        <div className="mt-8">
                          <label htmlFor="termometro" className="sr-only">
                            Gravidade da situação
                          </label>
                          <input
                            id="termometro"
                            type="range"
                            min={0}
                            max={10}
                            step={1}
                            value={value}
                            disabled={rated}
                            onChange={(e) => setValue(Number(e.target.value))}
                            className="focus-ring h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-primary"
                          />
                          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                            <span>{round.labels[0]}</span>
                            <span className="text-base font-semibold text-foreground">{value}</span>
                            <span>{round.labels[1]}</span>
                          </div>
                        </div>
                        {!rated ? (
                          <Button
                            className="mt-6 w-full rounded-full"
                            onClick={() => {
                              setRated(true);
                              if (ok) setScore((s) => s + 1);
                            }}
                          >
                            Confirmar avaliação
                          </Button>
                        ) : (
                          <Feedback
                            ok={ok}
                            text={`${round.explain} (faixa esperada: ${round.min}–${round.max})`}
                            onNext={next}
                          />
                        )}
                      </div>
                    );
                  })()
                )}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <MobileTabBarSpacer />
      </main>
      <MobileTabBar />
    </PageTransition>
  );
}

function Feedback({ ok, text, onNext }: { ok: boolean; text: string; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className="mt-4"
    >
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        {ok ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
        ) : (
          <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
        )}
        {text}
      </p>
      <Button className="mt-4 w-full rounded-full" onClick={onNext}>
        Continuar
      </Button>
    </motion.div>
  );
}
