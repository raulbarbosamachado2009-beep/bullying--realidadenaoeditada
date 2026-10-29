import { createFileRoute, Link } from "@tanstack/react-router";

import {
  ArrowLeft,
  ArrowUp,
  BarChart3,
  BookOpen,
  ChevronDown,
  Gamepad2,
  LifeBuoy,
  PanelLeft,
  Settings,
  SquarePen,
  CircleHelp,
  HeartHandshake,
  Plus,
  School,
  Search,
  Square,
  RotateCcw,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message as ChatMessage,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Copy } from "lucide-react";
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

      if (res.status === 429)
        throw new Error("Muitas mensagens em pouco tempo. Tente novamente em instantes.");
      if (res.status === 402)
        throw new Error(
          "Os créditos de IA acabaram. Peça ao responsável pelo projeto para recarregar.",
        );
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
                if (last && last.role === "assistant")
                  next[next.length - 1] = { ...last, text: answer };
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
            next[next.length - 1] = {
              ...last,
              text: "Não consegui gerar uma resposta. Pode reformular a pergunta?",
            };
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

  function resetChat() {
    abortRef.current?.abort();
    setMessages(initialMessages);
    setError(null);
    setInput("");
  }

  const composer = (
    <div className="w-full">
      {error ? (
        <p role="alert" className="mb-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <PromptInput
        onSubmit={({ text }) => {
          void send(text);
        }}
        className="chat-composer chat-composer-row"
      >
        <button
          type="button"
          onClick={() => setShowSuggestions((v) => !v)}
          aria-expanded={showSuggestions}
          aria-label="Mostrar perguntas sugeridas"
          className="focus-ring ml-3 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-secondary"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
        <PromptInputTextarea
          aria-label="Escreva sua mensagem"
          placeholder="Pergunte qualquer coisa"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-h-[60px] flex-1 px-2 py-[18px] text-base placeholder:text-chat-hollow"
        />
        <PromptInputFooter className="w-auto shrink-0 gap-2 p-0 pr-2.5">
          {!input.trim() && !loading ? (
            <button
              type="button"
              onClick={() => setInput("Como posso pedir ajuda com segurança?")}
              className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-full bg-secondary px-3.5 text-sm font-semibold text-foreground hover:bg-border"
            >
              <ShieldCheck className="size-4" aria-hidden="true" /> Ajuda
            </button>
          ) : (
            <PromptInputSubmit
              status={loading ? "streaming" : "ready"}
              onStop={() => abortRef.current?.abort()}
              aria-label={loading ? "Parar resposta" : "Enviar mensagem"}
              className="size-10 shrink-0 rounded-full bg-chat-control text-background hover:bg-chat-control/85"
            >
              {loading ? <Square className="size-4" /> : <ArrowUp className="size-5" />}
            </PromptInputSubmit>
          )}
        </PromptInputFooter>
      </PromptInput>
      {showSuggestions && !started ? (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {suggestions.map(({ Icon, text }) => (
            <button
              key={text}
              type="button"
              disabled={loading}
              onClick={() => void send(text)}
              className="focus-ring inline-flex h-9 items-center gap-2 rounded-full border border-border px-3.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Icon className="size-4" aria-hidden="true" />
              {text}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );

  const navItem =
    "focus-ring flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-1.5 text-sm text-foreground hover:bg-secondary";

  return (
    <PageTransition>
      <div className="chat-dark flex h-dvh bg-background text-foreground">
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-chat-sidebar md:flex">
          <div className="flex h-14 items-center justify-between px-3">
            <img
              src={iaBullyingIcon.url}
              alt="IA Bullying"
              className="size-7 rounded-lg object-cover"
              width={28}
              height={28}
            />
            <PanelLeft className="size-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <nav aria-label="Menu da IA" className="space-y-0.5 px-2">
            <button type="button" onClick={resetChat} className={navItem}>
              <SquarePen className="size-4" aria-hidden="true" /> Nova conversa
            </button>
            <button type="button" onClick={() => setShowSuggestions(true)} className={navItem}>
              <Search className="size-4" aria-hidden="true" /> Perguntas sugeridas
            </button>
            <Link to="/minigames" className={navItem}>
              <Gamepad2 className="size-4" aria-hidden="true" /> Minigames
            </Link>
            <Link to="/dados" className={navItem}>
              <BarChart3 className="size-4" aria-hidden="true" /> Dados
            </Link>
            <Link to="/home" className={navItem}>
              <BookOpen className="size-4" aria-hidden="true" /> Aprender
            </Link>
            <button
              type="button"
              onClick={() => setInput("Como posso apoiar uma vítima de bullying?")}
              className={navItem}
            >
              <HeartHandshake className="size-4" aria-hidden="true" /> Apoio
            </button>
          </nav>
          <div className="mt-auto space-y-0.5 px-2 pb-3">
            <Link to="/perfil" className={navItem}>
              <Settings className="size-4" aria-hidden="true" /> Configurações
            </Link>
            <button
              type="button"
              onClick={() => setInput("Como posso pedir ajuda com segurança?")}
              className={navItem}
            >
              <LifeBuoy className="size-4" aria-hidden="true" /> Ajuda
            </button>
          </div>
          <div className="border-t border-border px-4 pt-5 pb-4">
            <p className="text-sm font-semibold">Respostas pensadas para você</p>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">
              Entre no seu perfil para acompanhar seus pontos e continuar aprendendo.
            </p>
            <Link
              to="/perfil"
              className="focus-ring mt-4 flex h-11 items-center justify-center rounded-full border border-border bg-background text-sm font-medium hover:bg-secondary"
            >
              Meu perfil
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between gap-3 px-3 pt-[env(safe-area-inset-top)]">
            <div className="flex min-w-0 items-center gap-2">
              <Link
                to="/home"
                aria-label="Voltar para a página inicial"
                className="focus-ring inline-flex size-9 items-center justify-center rounded-[10px] hover:bg-secondary"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <img
                src={iaBullyingIcon.url}
                alt=""
                className="size-8 shrink-0 rounded-lg object-cover"
                width={32}
                height={32}
              />
              <div className="min-w-0 leading-tight">
                <p className="flex items-center gap-1 text-lg font-medium">
                  IA Bullying{" "}
                  <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
                </p>
                <p className="text-xs text-muted-foreground">ajudante pessoal</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {started ? (
                <button
                  type="button"
                  onClick={resetChat}
                  aria-label="Nova conversa"
                  className="focus-ring inline-flex size-9 items-center justify-center rounded-[10px] hover:bg-secondary md:hidden"
                >
                  <RotateCcw className="size-4" />
                </button>
              ) : null}
              <Link
                to="/minigames"
                className="focus-ring hidden h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85 sm:inline-flex"
              >
                Explorar jogos
              </Link>
              <Link
                to="/perfil"
                className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium hover:bg-secondary"
              >
                <UserRound className="size-4 sm:hidden" aria-hidden="true" />
                <span className="hidden sm:inline">Meu perfil</span>
              </Link>
            </div>
          </header>

          {!started ? (
            <main className="flex flex-1 items-center justify-center px-4 pb-16">
              <div className="w-full max-w-[860px]">
                <h1 className="mb-12 text-center text-[28px] font-normal">
                  Por onde vamos começar?
                </h1>
                {composer}
              </div>
            </main>
          ) : (
            <>
              <Conversation className="min-h-0 flex-1">
                <ConversationContent className="mx-auto w-full max-w-[770px] gap-7 px-5 py-6">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} from={message.role}>
                      <MessageContent className="text-base leading-7 group-[.is-user]:rounded-3xl group-[.is-user]:bg-chat-surface group-[.is-user]:text-foreground">
                        {message.text ? (
                          <MessageResponse>{message.text}</MessageResponse>
                        ) : (
                          <Shimmer>Pensando…</Shimmer>
                        )}
                      </MessageContent>
                      {message.role === "assistant" && message.text ? (
                        <MessageActions>
                          <MessageAction
                            label="Copiar resposta"
                            tooltip="Copiar resposta"
                            onClick={() => {
                              void navigator.clipboard.writeText(message.text);
                              toast.success("Resposta copiada");
                            }}
                          >
                            <Copy className="size-3.5" />
                          </MessageAction>
                        </MessageActions>
                      ) : null}
                    </ChatMessage>
                  ))}
                </ConversationContent>
                <ConversationScrollButton className="bg-background" />
              </Conversation>
              <div className="mx-auto w-full max-w-[802px] shrink-0 px-4 pt-3">{composer}</div>
            </>
          )}
          <footer className="shrink-0 px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))] text-center text-xs text-muted-foreground">
            Ao conversar com a IA Bullying, lembre: ela pode cometer erros. Em risco, procure um{" "}
            <Link to="/home" className="underline underline-offset-2 hover:text-foreground">
              adulto de confiança
            </Link>{" "}
            ou veja os{" "}
            <Link to="/dados" className="underline underline-offset-2 hover:text-foreground">
              dados e fontes
            </Link>
            .
          </footer>
        </div>
      </div>
    </PageTransition>
  );
}
