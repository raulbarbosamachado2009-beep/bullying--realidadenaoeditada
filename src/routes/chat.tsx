import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowUp, Bot, CircleHelp, HeartHandshake, Plus, School, Search, Square, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { PageTransition } from "@/components/PageTransition";
import iaBullyingIcon from "@/assets/ia-bullying-icon.png.asset.json";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "IA Educacional — Imersão Bullying" },
      {
        name: "description",
        content:
          "Converse com o assistente educacional sobre bullying: identificar, prevenir, agir e denunciar.",
      },
      { property: "og:title", content: "IA Educacional — Imersão Bullying" },
      {
        property: "og:description",
        content: "Interface de conversa educativa sobre bullying, respeito e empatia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Message = { id: number; role: "user" | "assistant"; text: string };

const initialMessages: Message[] = [
  {
    id: 0,
    role: "assistant",
    text: "Olá! Sou o assistente educacional da Imersão Bullying. Posso explicar tipos de bullying, sinais de alerta e formas de agir. Como posso ajudar?",
  },
];

const suggestions = [
  { Icon: CircleHelp, text: "O que é bullying?" },
  { Icon: Search, text: "Como identificar sinais?" },
  { Icon: School, text: "Como denunciar na escola?" },
  { Icon: HeartHandshake, text: "Como apoiar uma vítima?" },
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const value = text.trim();
    if (!value || loading) return;
    setInput("");
    setError(null);

    const history = [...messages, { id: messages.length, role: "user" as const, text: value }];
    setMessages([...history, { id: history.length, role: "assistant", text: "" }]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      if (res.status === 429) throw new Error("Muitas mensagens em pouco tempo. Tente novamente em instantes.");
      if (res.status === 402) throw new Error("Os créditos de IA acabaram. Peça ao responsável pelo projeto para recarregar.");
      if (!res.ok || !res.body) throw new Error("Não consegui responder agora. Tente novamente.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      for (;;) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data) as {
              choices?: { delta?: { content?: string } }[];
            };
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              answer += delta;
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last && last.role === "assistant") next[next.length - 1] = { ...last, text: answer };
                return next;
              });
            }
          } catch {
            // ignora fragmentos incompletos
          }
        }
      }

      if (!answer) {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "assistant")
            next[next.length - 1] = { ...last, text: "Não consegui gerar uma resposta. Pode reformular a pergunta?" };
          return next;
        });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message);
      toast.error((err as Error).message);
      setMessages((prev) => prev.filter((m, i) => !(i === prev.length - 1 && m.text === "")));
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  const started = messages.some((m) => m.role === "user");

  const mobileHeader = (
    <header className="fixed inset-x-0 top-0 z-50 lg:hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "rgba(15, 23, 42, 0.55)",
          backdropFilter: "blur(28px) saturate(140%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)",
        }}
      />
      <div className="relative flex h-[64px] items-center gap-3 px-4 pt-[env(safe-area-inset-top)]">
        <Link
          to="/home"
          aria-label="Voltar para a página inicial"
          className="focus-ring inline-flex size-10 shrink-0 items-center justify-center rounded-full text-foreground"
        >
          <ArrowLeft className="size-7" strokeWidth={2.25} aria-hidden="true" />
        </Link>
        <img
          src={iaBullyingIcon.url}
          alt=""
          aria-hidden="true"
          className="size-11 shrink-0 rounded-[13px] object-cover"
        />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[17px] font-semibold leading-tight">IA Bullying</h1>
          <p className="truncate text-[13px] leading-tight text-muted-foreground">ajudante pessoal</p>
        </div>
      </div>
    </header>
  );

  const composer = (
    <div className="w-full">
      {error ? (
        <p
          role="alert"
          className="mb-3 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 lg:flex-col">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="rounded-[28px] border border-border bg-card/60 p-3 backdrop-blur-2xl"
        >
          <label htmlFor="chat-input" className="sr-only">
            Escreva sua mensagem
          </label>
          <textarea
            id="chat-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Como posso te ajudar hoje?"
            className="max-h-40 w-full resize-none bg-transparent px-2 py-2 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              aria-label="Sugestões de perguntas"
              onClick={() => setShowSuggestions((v) => !v)}
              aria-expanded={showSuggestions}
              className="focus-ring inline-flex size-9 items-center justify-center rounded-full bg-secondary text-foreground transition-transform active:scale-95"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
            <span className="flex-1 text-center text-xs text-muted-foreground">IA Bullying 1.0</span>
            {loading ? (
              <button
                type="button"
                aria-label="Parar resposta"
                onClick={() => abortRef.current?.abort()}
                className="focus-ring inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Square className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                aria-label="Enviar mensagem"
                disabled={!input.trim()}
                className="focus-ring inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              >
                <ArrowUp className="size-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>

        {showSuggestions ? (
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s.text}
                type="button"
                onClick={() => void send(s.text)}
                disabled={loading}
                className="focus-ring rounded-full border border-border bg-card/40 px-3.5 py-2 text-xs text-muted-foreground backdrop-blur-xl transition-all hover:text-foreground active:scale-95"
              >
                <s.Icon aria-hidden="true" className="mr-1 inline size-3.5" />
                {s.text}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );


  if (!started) {
    return (
      <PageTransition>
        <AnimatedBackground />
        {mobileHeader}
        <div className="flex min-h-dvh flex-col pt-[64px] lg:pt-0">
          <header className="hidden items-center gap-3 px-5 py-5 lg:flex">
            <Link
              to="/home"
              aria-label="Voltar para a home"
              className="focus-ring glass inline-flex size-11 items-center justify-center rounded-2xl"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
          </header>

          <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="w-full text-center"
            >
              <h1 className="text-gradient hidden text-3xl font-semibold sm:text-5xl lg:block">
                IA Educativa
              </h1>
              <p className="mx-auto mt-3 hidden max-w-lg text-sm text-muted-foreground sm:text-base lg:block">
                Assistente educacional sobre bullying: entenda os tipos, reconheça sinais de alerta,
                saiba como agir, apoiar e denunciar com segurança.
              </p>
              <div className="lg:mt-8">{composer}</div>
            </motion.div>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <AnimatedBackground />
      {mobileHeader}
      <div className="flex min-h-dvh flex-col pt-[64px] lg:pt-0">
        <header className="hidden items-center gap-3 px-5 py-5 lg:flex">
          <Link
            to="/home"
            aria-label="Voltar para a home"
            className="focus-ring glass inline-flex size-11 items-center justify-center rounded-2xl"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-base font-semibold">IA Educativa</h1>
            <p className="text-xs text-muted-foreground">Assistente sobre bullying</p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-56 sm:pb-52">
          <div className="space-y-6 py-6" role="log" aria-live="polite">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className={
                    m.role === "user" ? "flex justify-end gap-3" : "flex justify-start gap-3"
                  }
                >
                  {m.role === "assistant" ? (
                    <span className="glass mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full">
                      <Bot className="size-4 text-primary" aria-hidden="true" />
                    </span>
                  ) : null}
                  <p
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-3xl bg-primary px-5 py-3 text-sm leading-relaxed text-primary-foreground"
                        : "max-w-[85%] text-sm leading-relaxed text-foreground"
                    }
                  >
                    {m.text || (
                      <span className="animate-pulse text-muted-foreground">Pensando…</span>
                    )}
                  </p>
                  {m.role === "user" ? (
                    <span className="glass mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full">
                      <User className="size-4" aria-hidden="true" />
                    </span>
                  ) : null}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={endRef} />
          </div>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background/90 to-transparent px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-6 lg:pb-4">
          <div className="mx-auto w-full max-w-3xl">{composer}</div>
        </div>
      </div>
    </PageTransition>
  );
}