export const bullyingSurvey = {
  country: "Estados Unidos",
  period: "Ano letivo 2021–2022",
  population: "Estudantes de 12 a 18 anos, do 6º ao 12º ano",
  source: "https://www.stopbullying.gov/resources/facts",
  originalReport: "https://nces.ed.gov/pubs2024/2024109rev.pdf",
};

// Percentages of all surveyed students, not a distribution of reports.
// Multiple experiences can be reported; do not sum or normalize categories.
export const bullyingPercentages = [
  {
    label: "Boatos",
    type: "Social",
    percentage: 13,
    detail: "Espalharam boatos sobre o estudante.",
    color: "var(--chart-2)",
  },
  {
    label: "Ofensas",
    type: "Verbal",
    percentage: 11.9,
    detail: "Zombarias, apelidos ou insultos.",
    color: "var(--chart-1)",
  },
  {
    label: "Agressões",
    type: "Físico",
    percentage: 4.9,
    detail: "Empurrões, tropeços provocados ou cuspidas.",
    color: "var(--chart-3)",
  },
  {
    label: "Exclusão",
    type: "Social",
    percentage: 3.7,
    detail: "Exclusão de atividades, redes sociais ou comunicações.",
    color: "var(--chart-2)",
  },
  {
    label: "Ameaças",
    type: "Psicológico",
    percentage: 3.3,
    detail: "Ameaças de causar danos ao estudante.",
    color: "var(--chart-4)",
  },
  {
    label: "Exposição",
    type: "Virtual / exposição",
    percentage: 2.5,
    detail:
      "Informações, fotos ou vídeos privados compartilhados para machucar. Não representa todo o cyberbullying.",
    color: "var(--editorial-accent)",
  },
  {
    label: "Coação",
    type: "Psicológico",
    percentage: 2.5,
    detail: "Tentativas de obrigar o estudante a fazer algo contra sua vontade.",
    color: "var(--chart-4)",
  },
  {
    label: "Danos",
    type: "Físico / material",
    percentage: 1.4,
    detail: "Destruição proposital de pertences.",
    color: "var(--chart-5)",
  },
];

export const bullyingReferences = [
  {
    name: "UNESCO",
    url: "https://www.unesco.org",
    description: "Educação, violência escolar e prevenção do bullying.",
  },
  {
    name: "UNICEF Brasil",
    url: "https://www.unicef.org/brazil",
    description: "Direitos e proteção de crianças e adolescentes.",
  },
  {
    name: "SaferNet Brasil",
    url: "https://new.safernet.org.br",
    description: "Segurança, direitos humanos e orientação na internet.",
  },
  {
    name: "CDC",
    url: "https://www.cdc.gov/youth-violence/about/about-bullying.html",
    description: "Definição, impactos e prevenção do bullying.",
  },
  {
    name: "StopBullying.gov",
    url: "https://www.stopbullying.gov",
    description: "Estatísticas e orientações para enfrentar o bullying.",
  },
];
