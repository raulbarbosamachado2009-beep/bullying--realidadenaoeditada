import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Menu, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Início", to: "/home", hash: "inicio" },
  { label: "Sobre", to: "/home", hash: "sobre" },
  { label: "Aprender", to: "/home", hash: "aprender" },
  { label: "Dados", to: "/dados", hash: undefined },
  { label: "Minigames", to: "/minigames", hash: undefined },
  { label: "IA Educacional", to: "/chat", hash: undefined },
  { label: "Contato", to: "/home", hash: "contato" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-x-0 top-0 z-50 hidden px-4 pt-4 lg:block"
    >
      <nav
        aria-label="Navegação principal"
        className="glass mx-auto flex max-w-6xl items-center justify-between rounded-3xl px-5 py-3"
      >
        <Link
          to="/home"
          className="focus-ring flex items-center gap-2 rounded-full text-sm font-semibold"
        >
          <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
          Imersão Bullying
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                {...(l.hash ? { hash: l.hash } : {})}
                className="focus-ring rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="hidden rounded-full sm:inline-flex"
          >
            <Link to="/" aria-label="Voltar para o início de tudo">
              <RotateCcw className="size-4" aria-hidden="true" />
              Recomeçar
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
            <Link to="/minigames">Começar Agora</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="focus-ring inline-flex size-11 items-center justify-center rounded-full text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="glass mx-auto mt-2 max-w-6xl space-y-1 rounded-3xl p-3 lg:hidden"
        >
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                {...(l.hash ? { hash: l.hash } : {})}
                onClick={() => setOpen(false)}
                className="focus-ring block rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="focus-ring flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Recomeçar do início
            </Link>
          </li>
        </motion.ul>
      ) : null}
    </motion.header>
  );
}
