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

