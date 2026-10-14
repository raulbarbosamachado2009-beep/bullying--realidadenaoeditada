import { createFileRoute, Link } from "@tanstack/react-router";

import {
  ArrowLeft,
  ArrowUp,
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
import { Button } from "@/components/ui/button";
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
        className="chat-composer"
      >
        <PromptInputTextarea
          aria-label="Escreva sua mensagem"
          placeholder="Pergunte o que quiser"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-h-[58px] px-5 pt-4 pb-2 text-base placeholder:text-muted-foreground"
        />
        <PromptInputFooter className="justify-between px-3 pb-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSuggestions((value) => !value)}
              aria-expanded={showSuggestions}
              className="h-8 rounded-full border-border bg-transparent px-3 text-xs hover:bg-secondary"
            >
              <Plus aria-hidden="true" /> Perguntas
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setInput("Como posso pedir ajuda com segurança?")}
              className="h-8 rounded-full border-border bg-transparent px-3 text-xs hover:bg-secondary"
            >
              <ShieldCheck aria-hidden="true" /> Pedir ajuda
            </Button>
          </div>
          <PromptInputSubmit
            status={loading ? "streaming" : "ready"}
            onStop={() => abortRef.current?.abort()}
            disabled={!loading && !input.trim()}
            aria-label={loading ? "Parar resposta" : "Enviar mensagem"}
            className="size-9 shrink-0 rounded-full bg-chat-control text-chat-background hover:bg-foreground disabled:bg-secondary disabled:text-muted-foreground"
          >
            {loading ? <Square className="size-4" /> : <ArrowUp className="size-5" />}
          </PromptInputSubmit>
        </PromptInputFooter>
      </PromptInput>
      {showSuggestions && !started ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {suggestions.map(({ Icon, text }, index) => (
            <Button
              key={text}
              variant="outline"
              disabled={loading}
              onClick={() => void send(text)}
              className="h-10 rounded-full border-border bg-transparent px-3.5 text-xs font-normal text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Icon
                aria-hidden="true"
                className={
                  index === 0
                    ? "text-editorial-accent"
                    : index === 1
                      ? "text-primary-glow"
                      : index === 2
                        ? "text-primary"
                        : "text-success"
                }
              />{" "}
              {text}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <PageTransition>
      <div className="flex h-dvh flex-col bg-chat-background text-foreground">
        <header className="z-20 flex h-[76px] shrink-0 items-center justify-between gap-3 bg-chat-background px-4 pt-[env(safe-area-inset-top)] sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full hover:bg-secondary"
            >
              <Link to="/home" aria-label="Voltar para a página inicial">
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <img
              src={iaBullyingIcon.url}
              alt=""
              className="size-10 shrink-0 rounded-xl object-cover"
              width={40}
              height={40}
            />
            <div className="min-w-0">
              <p className="text-base font-semibold">IA Bullying</p>
              <p className="text-xs text-muted-foreground">ajudante pessoal</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {started ? (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-secondary"
                aria-label="Nova conversa"
                title="Nova conversa"
                onClick={() => {
                  abortRef.current?.abort();
                  setMessages(initialMessages);
                  setError(null);
                  setInput("");
                }}
              >
                <RotateCcw />
              </Button>
            ) : null}
            <Button
              asChild
              variant="secondary"
              className="hidden h-8 rounded-full text-xs sm:inline-flex"
            >
              <Link to="/minigames">Explorar jogos</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="size-9 rounded-full border-border bg-transparent p-0 hover:bg-secondary"
            >
              <Link to="/perfil" aria-label="Meu perfil">
                <UserRound />
              </Link>
            </Button>
          </div>
        </header>
        {!started ? (
          <main className="flex flex-1 items-center justify-center px-4 pb-20">
            <div className="w-full max-w-[770px]">
              <h1 className="mb-10 text-center text-3xl font-semibold">IA Bullying</h1>
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
              <ConversationScrollButton className="bg-chat-surface" />
            </Conversation>
            <div className="mx-auto w-full max-w-[802px] shrink-0 px-4 pt-3">{composer}</div>
          </>
        )}
        <footer className="shrink-0 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] text-center text-[11px] text-muted-foreground">
          A IA pode cometer erros. Em situações de risco, procure um adulto de confiança.
        </footer>
      </div>
    </PageTransition>
  );
}
