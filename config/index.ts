import type { Metadata } from "next";

export const siteConfig: Metadata = {
  title: "Aprova+",
  description:
    "Plataforma de estudos para concursos públicos com simulados, questões e acompanhamento de desempenho.",
  keywords: [
    "concursos",
    "estudos",
    "simulados",
    "nextjs",
    "react",
    "shadcn",
    "postgresql",
    "drizzle",
    "tailwindcss",
    "typescript",
  ] as Array<string>,
  authors: {
    name: "bootstrapprx",
    url: "https://github.com/bootstrapprx",
  },
} as const;

export const links = {
  sourceCode: "https://github.com/bootstrapprx/aprova-mais",
} as const;
