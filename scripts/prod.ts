import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "@/db/schema";

const sql = postgres(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    const courses = await db
      .insert(schema.courses)
      .values([
        {
          title: "INSS 2026",
          imageSrc: "/br.svg",
          banca: "CESPE",
          ano: 2026,
          orgao: "INSS",
        },
      ])
      .returning();

    for (const course of courses) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Direito Constitucional",
            description: "Princípios fundamentais, direitos e garantias, organização do Estado",
            order: 1,
          },
          {
            courseId: course.id,
            title: "Língua Portuguesa",
            description: "Interpretação de textos, gramática, redação oficial",
            order: 2,
          },
          {
            courseId: course.id,
            title: "Raciocínio Lógico",
            description: "Estruturas lógicas, probabilidade, análise combinatória",
            order: 3,
          },
        ])
        .returning();

      for (const unit of units) {
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "Conceitos Básicos", order: 1 },
            { unitId: unit.id, title: "Aplicação Prática", order: 2 },
            { unitId: unit.id, title: "Revisão Completa", order: 3 },
          ])
          .returning();

        for (const lesson of lessons) {
          if (unit.title === "Direito Constitucional") {
            if (lesson.title === "Conceitos Básicos") {
              const challenges = await db
                .insert(schema.challenges)
                .values([
                  {
                    lessonId: lesson.id,
                    type: "SELECT",
                    question: "Assinale a alternativa que apresenta um fundamento da República Federativa do Brasil.",
                    order: 1,
                  },
                  {
                    lessonId: lesson.id,
                    type: "TRUE_FALSE",
                    question: "A República Federativa do Brasil tem como fundamento a cidadania.",
                    order: 2,
                  },
                  {
                    lessonId: lesson.id,
                    type: "SELECT",
                    question: "São Poderes da União, independentes e harmônicos entre si:",
                    order: 3,
                  },
                  {
                    lessonId: lesson.id,
                    type: "TEXT_PASSAGE",
                    question: "De acordo com o texto constitucional, assinale a alternativa correta:",
                    textoApoio: "Art. 1º A República Federativa do Brasil, formada pela união indissolúvel dos Estados e Municípios e do Distrito Federal, constitui-se em Estado Democrático de Direito e tem como fundamentos: I - a soberania; II - a cidadania; III - a dignidade da pessoa humana; IV - os valores sociais do trabalho e da livre iniciativa; V - o pluralismo político.",
                    order: 4,
                  },
                  {
                    lessonId: lesson.id,
                    type: "TRUE_FALSE",
                    question: "A dignidade da pessoa humana é um dos fundamentos da República Federativa do Brasil.",
                    order: 5,
                  },
                ])
                .returning();

              for (const challenge of challenges) {
                if (challenge.order === 1) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "A cidadania" },
                    { challengeId: challenge.id, correct: false, text: "O presidencialismo" },
                    { challengeId: challenge.id, correct: false, text: "O federalismo" },
                    { challengeId: challenge.id, correct: false, text: "A separação dos poderes" },
                  ]);
                }

                if (challenge.order === 2) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "Verdadeiro" },
                    { challengeId: challenge.id, correct: false, text: "Falso" },
                  ]);
                }

                if (challenge.order === 3) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: false, text: "Executivo, Legislativo e Judiciário" },
                    { challengeId: challenge.id, correct: true, text: "Legislativo, Executivo e Judiciário" },
                    { challengeId: challenge.id, correct: false, text: "Judiciário, Executivo e Legislativo" },
                    { challengeId: challenge.id, correct: false, text: "Executivo, Judiciário e Legislativo" },
                  ]);
                }

                if (challenge.order === 4) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "A dignidade da pessoa humana é um fundamento constitucional" },
                    { challengeId: challenge.id, correct: false, text: "A República Federativa do Brasil é formada pela união dissolúvel dos Estados" },
                    { challengeId: challenge.id, correct: false, text: "O pluralismo político não é um fundamento constitucional" },
                    { challengeId: challenge.id, correct: false, text: "A soberania não integra os fundamentos da República" },
                  ]);
                }

                if (challenge.order === 5) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "Verdadeiro" },
                    { challengeId: challenge.id, correct: false, text: "Falso" },
                  ]);
                }
              }
            }

            if (lesson.title === "Aplicação Prática") {
              const challenges = await db
                .insert(schema.challenges)
                .values([
                  {
                    lessonId: lesson.id,
                    type: "SELECT",
                    question: "De acordo com a Constituição Federal, são direitos sociais:",
                    order: 1,
                  },
                  {
                    lessonId: lesson.id,
                    type: "TRUE_FALSE",
                    question: "A educação é um direito social previsto na Constituição Federal.",
                    order: 2,
                  },
                ])
                .returning();

              for (const challenge of challenges) {
                if (challenge.order === 1) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "Educação, saúde, trabalho, moradia, lazer" },
                    { challengeId: challenge.id, correct: false, text: "Propriedade, herança, contrato" },
                    { challengeId: challenge.id, correct: false, text: "Vida, liberdade, igualdade, segurança" },
                    { challengeId: challenge.id, correct: false, text: "Expressão, reunião, associação" },
                  ]);
                }

                if (challenge.order === 2) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "Verdadeiro" },
                    { challengeId: challenge.id, correct: false, text: "Falso" },
                  ]);
                }
              }
            }
          }

          if (unit.title === "Língua Portuguesa") {
            if (lesson.title === "Conceitos Básicos") {
              const challenges = await db
                .insert(schema.challenges)
                .values([
                  {
                    lessonId: lesson.id,
                    type: "SELECT",
                    question: "Assinale a alternativa em que todas as palavras estão grafadas corretamente:",
                    order: 1,
                  },
                  {
                    lessonId: lesson.id,
                    type: "TRUE_FALSE",
                    question: "A palavra 'exceção' é grafada com 'ç'.",
                    order: 2,
                  },
                  {
                    lessonId: lesson.id,
                    type: "TEXT_PASSAGE",
                    question: "De acordo com o texto, assinale a alternativa correta:",
                    textoApoio: "O Brasil é um país de dimensões continentais, com uma diversidade cultural ímpar. De norte a sul, encontramos manifestações culturais que refletem a rica história de nosso povo. O patrimônio cultural brasileiro é um dos mais vastos do mundo, abrangendo desde sítios arqueológicos até manifestações imateriais como o frevo e o samba.",
                    order: 3,
                  },
                ])
                .returning();

              for (const challenge of challenges) {
                if (challenge.order === 1) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: false, text: "Excessão, paralisar, analisar" },
                    { challengeId: challenge.id, correct: true, text: "Exceção, paralisar, analisar" },
                    { challengeId: challenge.id, correct: false, text: "Exceção, paralizar, analizar" },
                    { challengeId: challenge.id, correct: false, text: "Excessão, paralizar, analisar" },
                  ]);
                }

                if (challenge.order === 2) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "Verdadeiro" },
                    { challengeId: challenge.id, correct: false, text: "Falso" },
                  ]);
                }

                if (challenge.order === 3) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "O patrimônio cultural brasileiro inclui manifestações imateriais como o frevo e o samba" },
                    { challengeId: challenge.id, correct: false, text: "O Brasil possui pouca diversidade cultural devido às suas dimensões continentais" },
                    { challengeId: challenge.id, correct: false, text: "As manifestações culturais brasileiras são homogêneas em todo o território" },
                    { challengeId: challenge.id, correct: false, text: "O patrimônio cultural brasileiro limita-se a sítios arqueológicos" },
                  ]);
                }
              }
            }

            if (lesson.title === "Aplicação Prática") {
              const challenges = await db
                .insert(schema.challenges)
                .values([
                  {
                    lessonId: lesson.id,
                    type: "SELECT",
                    question: "Em 'Os alunos estudaram bastante para a prova', o termo 'bastante' é:",
                    order: 1,
                  },
                  {
                    lessonId: lesson.id,
                    type: "TRUE_FALSE",
                    question: "Na frase 'Havia muitos candidatos', o verbo 'haver' pode ser flexionado para o plural.",
                    order: 2,
                  },
                ])
                .returning();

              for (const challenge of challenges) {
                if (challenge.order === 1) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: false, text: "Adjetivo" },
                    { challengeId: challenge.id, correct: true, text: "Advérbio" },
                    { challengeId: challenge.id, correct: false, text: "Substantivo" },
                    { challengeId: challenge.id, correct: false, text: "Pronome" },
                  ]);
                }

                if (challenge.order === 2) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: false, text: "Verdadeiro" },
                    { challengeId: challenge.id, correct: true, text: "Falso" },
                  ]);
                }
              }
            }
          }

          if (unit.title === "Raciocínio Lógico") {
            if (lesson.title === "Conceitos Básicos") {
              const challenges = await db
                .insert(schema.challenges)
                .values([
                  {
                    lessonId: lesson.id,
                    type: "SELECT",
                    question: "Se todos os A são B e nenhum B é C, então pode-se concluir que:",
                    order: 1,
                  },
                  {
                    lessonId: lesson.id,
                    type: "TRUE_FALSE",
                    question: "A proposição 'Se chove, então a rua fica molhada' é logicamente equivalente a 'Se a rua não fica molhada, então não chove'.",
                    order: 2,
                  },
                ])
                .returning();

              for (const challenge of challenges) {
                if (challenge.order === 1) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "Nenhum A é C" },
                    { challengeId: challenge.id, correct: false, text: "Todo C é A" },
                    { challengeId: challenge.id, correct: false, text: "Algum A é C" },
                    { challengeId: challenge.id, correct: false, text: "Todo A é C" },
                  ]);
                }

                if (challenge.order === 2) {
                  await db.insert(schema.challengeOptions).values([
                    { challengeId: challenge.id, correct: true, text: "Verdadeiro" },
                    { challengeId: challenge.id, correct: false, text: "Falso" },
                  ]);
                }
              }
            }
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
