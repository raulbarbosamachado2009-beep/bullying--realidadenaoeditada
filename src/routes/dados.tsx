import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, BarChart3, Info, ShieldCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { MobileTabBar, MobileTabBarSpacer } from "@/components/MobileShell";
import { bullyingPercentages, bullyingReferences, bullyingSurvey } from "@/lib/bullying-data";

export const Route = createFileRoute("/dados")({
  head: () => ({
    meta: [
      { title: "Dados sobre bullying — Imersão Bullying" },
      {
        name: "description",
        content:
          "Porcentagens de experiências de bullying, contexto da pesquisa e referências de UNESCO, UNICEF Brasil, SaferNet, CDC e StopBullying.gov.",
      },
      { property: "og:title", content: "Dados sobre bullying — Imersão Bullying" },
      {
        property: "og:description",
        content:
          "Conheça os números sobre bullying e consulte fontes oficiais, com população, período e limites de comparação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DataPage,
});

const formatPercentage = (value: number) => `${value.toLocaleString("pt-BR")}%`;

function DataPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between border-b border-border px-5">
        <Link to="/home" className="focus-ring flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="size-6" aria-hidden="true" /> BRE{" "}
          <span className="hidden font-normal text-muted-foreground sm:inline">
            / Imersão Bullying
          </span>
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link to="/home">
            <ArrowLeft /> Voltar à Home
          </Link>
        </Button>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-12 pt-12 md:pt-16">
        <p className="flex items-center gap-2 text-xs uppercase text-editorial-accent">
          <BarChart3 className="size-4" aria-hidden="true" /> Dados & evidências
        </p>
        <h1 className="mt-4 text-4xl font-medium sm:text-5xl">Bullying em números.</h1>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
          Cada número representa uma experiência real. Veja a frequência de diferentes formas de
          bullying relatadas em uma pesquisa com estudantes.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-5 text-xs text-muted-foreground">
          <span>{bullyingSurvey.country}</span>
          <span>{bullyingSurvey.period}</span>
          <span>{bullyingSurvey.population}</span>
        </div>
        <section aria-labelledby="chart-title" className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="chart-title" className="text-lg font-medium">
              Estudantes que relataram cada experiência (%)
            </h2>
            <a
              href={bullyingSurvey.source}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex items-center gap-1 text-xs text-primary hover:underline"
            >
              StopBullying.gov / NCES <ArrowUpRight className="size-3.5" />
            </a>
          </div>
          <div
            className="mt-5 h-[340px] w-full rounded-lg border border-border bg-card px-1 py-6 sm:px-5"
            role="img"
            aria-label="Gráfico de porcentagens de bullying. Os valores completos estão na lista abaixo."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bullyingPercentages}
                margin={{ top: 20, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 10,
                    fontFamily: "San Francisco",
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis
                  domain={[0, 15]}
                  ticks={[0, 5, 10, 15]}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                    fontFamily: "San Francisco",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  content={({ active, payload }) => {
                    const item = payload?.[0]?.payload;
                    if (!active || !item) return null;
                    return (
                      <div className="max-w-60 rounded-lg border border-border bg-popover p-3 text-sm text-popover-foreground">
                        <p className="font-semibold">
                          {item.label}: {formatPercentage(item.percentage)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="percentage"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={76}
                  isAnimationActive={false}
                >
                  {bullyingPercentages.map((item) => (
                    <Cell key={item.label} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Percentuais sobre todos os estudantes pesquisados, não uma distribuição de relatos. Uma
            pessoa pode relatar mais de uma experiência; os valores não somam 100%. Estes dados são
            dos EUA, não do Brasil.
          </p>
          <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
            {bullyingPercentages.map((item) => (
              <div
                key={item.label}
                className="flex justify-between gap-4 border-t border-border py-5"
              >
                <div>
                  <dt className="text-sm font-medium">
                    {item.type} · {item.label}
                  </dt>
                  <dd className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                    {item.detail}
                  </dd>
                </div>
                <dd className="shrink-0 text-2xl font-medium tabular-nums">
                  {formatPercentage(item.percentage)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            Bullying racial e religioso: esta pesquisa não apresenta percentuais comparáveis
            separados. Os comportamentos acima também não devem ser somados para estimar um total
            por tipo.
          </p>
        </section>
        <section aria-labelledby="sources-title" className="mt-16 border-t border-border pt-10">
          <p className="text-xs uppercase text-editorial-accent">Para consultar e aprofundar</p>
          <h2 id="sources-title" className="mt-3 text-3xl font-normal">
            Fontes e referências.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Os números do gráfico vêm da pesquisa School Crime Supplement 2021–2022 (NCES),
            publicada pelo StopBullying.gov. As demais instituições são referências de educação,
            proteção e prevenção.
          </p>
          <a
            href={bullyingSurvey.originalReport}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Relatório original da pesquisa (PDF, em inglês)
            <ArrowUpRight className="size-4" />
          </a>
          <ul className="mt-8">
            {bullyingReferences.map((source, index) => (
              <li key={source.name} className="border-t border-border">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group flex items-center gap-4 py-5"
                >
                  <span className="text-xs text-muted-foreground">0{index + 1}</span>
                  <div className="flex-1">
                    <h3 className="text-base group-hover:text-primary">{source.name}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {source.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
        <MobileTabBarSpacer />
      </main>
      <MobileTabBar />
    </div>
  );
}
