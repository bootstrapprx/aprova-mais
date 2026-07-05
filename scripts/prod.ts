import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "@/db/schema";

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

type ChallengeDef = {
  type: "SELECT" | "TRUE_FALSE" | "MULTIPLE_CORRECT" | "TEXT_PASSAGE";
  question: string;
  textoApoio?: string;
  options: { text: string; correct: boolean }[];
};

type LessonDef = {
  title: string;
  challenges: ChallengeDef[];
};

type UnitDef = {
  title: string;
  description: string;
  lessons: LessonDef[];
};

const courseData: {
  title: string;
  imageSrc: string;
  banca: string;
  ano: number;
  orgao: string;
  description?: string;
  active?: boolean;
  units: UnitDef[];
} = {
  title: "INSS 2026",
  imageSrc: "/br.svg",
  banca: "CESPE",
  ano: 2026,
  orgao: "INSS",
  description: "Curso completo para o concurso do INSS 2026, abordando todos os tópicos do edital com questões comentadas.",
  active: true,
  units: [
    {
      title: "Língua Portuguesa",
      description: "Interpretação de textos, gramática, ortografia e sintaxe",
      lessons: [
        {
          title: "Compreensão e Interpretação de Textos",
          challenges: [
            {
              type: "SELECT",
              question: "Assinale a alternativa que apresenta uma estratégia adequada para identificar a ideia principal de um texto:",
              options: [
                { text: "Localizar a frase que resume o conteúdo do texto, geralmente no primeiro ou último parágrafo", correct: true },
                { text: "Contar o número de palavras do texto para determinar sua importância", correct: false },
                { text: "Ignorar os conectivos e preposições durante a leitura", correct: false },
                { text: "Ler apenas o título e as palavras em destaque", correct: false },
              ],
            },
            {
              type: "TEXT_PASSAGE",
              question: "De acordo com o texto, assinale a alternativa correta:",
              textoApoio: "A comunicação oficial deve primar pela clareza, precisão e impessoalidade. O uso de linguagem técnica é permitido quando necessário, mas deve-se evitar jargões que dificultem a compreensão. A formalidade não significa linguagem rebuscada, mas sim respeito às convenções e à hierarquia administrativa.",
              options: [
                { text: "A comunicação oficial exige apenas clareza, sendo a impessoalidade opcional", correct: false },
                { text: "A formalidade na comunicação oficial exige linguagem rebuscada e técnica", correct: false },
                { text: "A comunicação oficial deve priorizar clareza, precisão e impessoalidade", correct: true },
                { text: "Jargões são recomendados na comunicação oficial para demonstrar conhecimento técnico", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A intertextualidade ocorre quando um texto faz referência a outro texto, seja de forma explícita ou implícita.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Ortografia Oficial",
          challenges: [
            {
              type: "SELECT",
              question: "Assinale a alternativa em que todas as palavras estão grafadas corretamente:",
              options: [
                { text: "Exceção, paralisar, analisar, beneficente", correct: true },
                { text: "Excessão, paralizar, analizar, beneficiente", correct: false },
                { text: "Exceção, paralizar, analisar, beneficente", correct: false },
                { text: "Excessão, paralisar, analizar, beneficiente", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Quanto ao uso dos porquês, assinale a alternativa correta:",
              options: [
                { text: "'Por que' separado sem acento é usado em perguntas indiretas", correct: false },
                { text: "'Porquê' junto com acento é usado em respostas", correct: false },
                { text: "'Por que' separado sem acento é usado em perguntas diretas ou indiretas", correct: true },
                { text: "'Porque' junto sem acento é usado apenas no início de perguntas", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A palavra 'mal' é antônima de 'bem' e é usada quando se opõe a 'bem', enquanto 'mau' é antônimo de 'bom'.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Acentuação Gráfica",
          challenges: [
            {
              type: "SELECT",
              question: "Assinale a alternativa em que todas as palavras são acentuadas pela mesma regra:",
              options: [
                { text: "Pá, pé, só, pó, má", correct: true },
                { text: "Árvore, tórax, ônix, vírus", correct: false },
                { text: "Herói, chapéu, céu, dói", correct: false },
                { text: "Amável, útil, fácil, caráter", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "As palavras 'voo', 'enjoo' e 'veem' não recebem acento conforme o Novo Acordo Ortográfico.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa em que todas as palavras estão corretamente acentuadas:",
              options: [
                { text: "Proibido, contribuinte, feiura, baiuca", correct: true },
                { text: "Proibído, contribuinte, feiúra, baiúca", correct: false },
                { text: "Proibido, contribuinte, feiúra, baiuca", correct: false },
                { text: "Proibído, contribuinte, feiura, baiúca", correct: false },
              ],
            },
          ],
        },
        {
          title: "Classes de Palavras",
          challenges: [
            {
              type: "SELECT",
              question: "Em 'O aluno estava bastante cansado após a prova', o termo 'bastante' classifica-se como:",
              options: [
                { text: "Advérbio de intensidade", correct: true },
                { text: "Adjetivo", correct: false },
                { text: "Substantivo", correct: false },
                { text: "Pronome indefinido", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa em que o termo destacado é um pronome relativo:",
              options: [
                { text: "O livro 'que' comprei é muito interessante.", correct: true },
                { text: "'Que' horas são?", correct: false },
                { text: "'Que' bom que você veio!", correct: false },
                { text: "Ele falou 'que' chegaria atrasado.", correct: false },
              ],
            },
            {
              type: "MULTIPLE_CORRECT",
              question: "Assinale as alternativas em que as palavras são substantivos:",
              options: [
                { text: "Beleza", correct: true },
                { text: "Correr", correct: false },
                { text: "Livro", correct: true },
                { text: "Feliz", correct: false },
              ],
            },
          ],
        },
        {
          title: "Sintaxe da Oração e Período",
          challenges: [
            {
              type: "SELECT",
              question: "Em 'O diretor entregou o prêmio ao aluno', o termo 'ao aluno' exerce função de:",
              options: [
                { text: "Objeto indireto", correct: true },
                { text: "Objeto direto", correct: false },
                { text: "Complemento nominal", correct: false },
                { text: "Adjunto adverbial", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "Na oração 'Aluga-se casas', o verbo deve concordar com o sujeito, portanto o correto é 'Alugam-se casas'.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa em que o período é composto por coordenação:",
              options: [
                { text: "Acordou, tomou café e saiu para trabalhar.", correct: true },
                { text: "É importante que você estude para a prova.", correct: false },
                { text: "O candidato que estudou foi aprovado.", correct: false },
                { text: "Quando chegar, me avise.", correct: false },
              ],
            },
          ],
        },
        {
          title: "Concordância Verbal e Nominal",
          challenges: [
            {
              type: "SELECT",
              question: "Assinale a alternativa em que a concordância verbal está correta:",
              options: [
                { text: "Fazem cinco anos que trabalho neste órgão.", correct: false },
                { text: "Havia muitas pessoas na reunião.", correct: true },
                { text: "Devem haver soluções para o problema.", correct: false },
                { text: "Existia muitas vagas no concurso.", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa em que a concordância nominal está correta:",
              options: [
                { text: "Ela mesmo resolveu o problema.", correct: false },
                { text: "As meninas ficaram meia preocupadas.", correct: false },
                { text: "É proibida a entrada de animais.", correct: true },
                { text: "Anexo ao processo, seguem os documentos.", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Em 'Mais de um candidato ______ classificado' e 'Mais de um candidato ______ se ausentaram', a sequência correta é:",
              options: [
                { text: "foi / se", correct: false },
                { text: "foram / se", correct: false },
                { text: "foi / se ausentou", correct: false },
                { text: "foi / se ausentaram", correct: true },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Raciocínio Lógico",
      description: "Estruturas lógicas, diagramas, probabilidade e análise combinatória",
      lessons: [
        {
          title: "Estruturas Lógicas",
          challenges: [
            {
              type: "SELECT",
              question: "Se todos os A são B e nenhum B é C, então pode-se concluir que:",
              options: [
                { text: "Nenhum A é C", correct: true },
                { text: "Todo C é A", correct: false },
                { text: "Algum A é C", correct: false },
                { text: "Todo A é C", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A proposição 'Se chove, então a rua fica molhada' é logicamente equivalente a 'Se a rua não fica molhada, então não chove'.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Considere a proposição: 'Todo servidor público é honesto'. Sua negação lógica é:",
              options: [
                { text: "Algum servidor público não é honesto", correct: true },
                { text: "Nenhum servidor público é honesto", correct: false },
                { text: "Todo servidor público é desonesto", correct: false },
                { text: "Existe servidor público honesto", correct: false },
              ],
            },
          ],
        },
        {
          title: "Equivalências Lógicas",
          challenges: [
            {
              type: "TRUE_FALSE",
              question: "A proposição 'P → Q' é logicamente equivalente a '~P ∨ Q'.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "A negação de 'Todos os servidores são eficientes e dedicados' é:",
              options: [
                { text: "Existe servidor que não é eficiente ou não é dedicado", correct: true },
                { text: "Nenhum servidor é eficiente ou dedicado", correct: false },
                { text: "Todos os servidores são ineficientes e não dedicados", correct: false },
                { text: "Existe servidor que não é eficiente e não é dedicado", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Se 'P → Q' é verdadeiro e 'Q' é falso, então:",
              options: [
                { text: "P é falso", correct: true },
                { text: "P é verdadeiro", correct: false },
                { text: "Q → P é verdadeiro", correct: false },
                { text: "Não é possível determinar o valor de P", correct: false },
              ],
            },
          ],
        },
        {
          title: "Diagramas Lógicos (Conjuntos)",
          challenges: [
            {
              type: "SELECT",
              question: "Em uma sala com 40 servidores, 25 dominam o inglês, 20 dominam o espanhol e 10 dominam ambos. Quantos servidores não dominam nenhum dos dois idiomas?",
              options: [
                { text: "5 servidores", correct: true },
                { text: "10 servidores", correct: false },
                { text: "15 servidores", correct: false },
                { text: "20 servidores", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Dados os conjuntos A = {1, 2, 3, 4} e B = {3, 4, 5, 6}, assinale a alternativa que representa A ∩ B:",
              options: [
                { text: "{3, 4}", correct: true },
                { text: "{1, 2, 3, 4, 5, 6}", correct: false },
                { text: "{1, 2}", correct: false },
                { text: "{5, 6}", correct: false },
              ],
            },
            {
              type: "MULTIPLE_CORRECT",
              question: "Considerando os conjuntos A = {1, 2, 3, 4} e B = {3, 4, 5, 6}, assinale as alternativas corretas:",
              options: [
                { text: "A ∪ B = {1, 2, 3, 4, 5, 6}", correct: true },
                { text: "A ∩ B = {3, 4}", correct: true },
                { text: "A - B = {5, 6}", correct: false },
                { text: "B - A = {5, 6}", correct: true },
              ],
            },
          ],
        },
        {
          title: "Raciocínio Sequencial",
          challenges: [
            {
              type: "SELECT",
              question: "Considere a sequência: 2, 6, 18, 54, ... Qual é o próximo termo?",
              options: [
                { text: "162", correct: true },
                { text: "108", correct: false },
                { text: "216", correct: false },
                { text: "1620", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Qual é o próximo termo da sequência: 1, 4, 9, 16, 25, ...?",
              options: [
                { text: "36", correct: true },
                { text: "30", correct: false },
                { text: "49", correct: false },
                { text: "35", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "Na sequência 1, 1, 2, 3, 5, 8, 13, ... o próximo termo é 21 (sequência de Fibonacci).",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Probabilidade e Análise Combinatória",
          challenges: [
            {
              type: "SELECT",
              question: "Em uma urna há 5 bolas vermelhas e 3 bolas azuis. Retirando-se uma bola ao acaso, qual a probabilidade de ela ser vermelha?",
              options: [
                { text: "5/8", correct: true },
                { text: "3/8", correct: false },
                { text: "5/3", correct: false },
                { text: "1/2", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "De quantas maneiras diferentes podemos organizar 5 livros em uma estante?",
              options: [
                { text: "120", correct: true },
                { text: "25", correct: false },
                { text: "60", correct: false },
                { text: "720", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Em uma prova com 10 questões de múltipla escolha, cada uma com 4 alternativas, de quantas formas um candidato pode preencher o gabarito?",
              options: [
                { text: "4^10", correct: true },
                { text: "10^4", correct: false },
                { text: "10!", correct: false },
                { text: "C(10,4)", correct: false },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Direito Constitucional",
      description: "Princípios fundamentais, direitos e garantias, organização do Estado e administração pública",
      lessons: [
        {
          title: "Princípios Fundamentais",
          challenges: [
            {
              type: "SELECT",
              question: "Assinale a alternativa que apresenta um fundamento da República Federativa do Brasil:",
              options: [
                { text: "A cidadania", correct: true },
                { text: "O presidencialismo", correct: false },
                { text: "O federalismo", correct: false },
                { text: "A separação dos poderes", correct: false },
              ],
            },
            {
              type: "TEXT_PASSAGE",
              question: "De acordo com o texto constitucional, assinale a alternativa correta:",
              textoApoio: "Art. 1º A República Federativa do Brasil, formada pela união indissolúvel dos Estados e Municípios e do Distrito Federal, constitui-se em Estado Democrático de Direito e tem como fundamentos: I - a soberania; II - a cidadania; III - a dignidade da pessoa humana; IV - os valores sociais do trabalho e da livre iniciativa; V - o pluralismo político.",
              options: [
                { text: "A dignidade da pessoa humana é um fundamento constitucional", correct: true },
                { text: "A República é formada pela união dissolúvel dos Estados", correct: false },
                { text: "O pluralismo político não é fundamento constitucional", correct: false },
                { text: "A soberania não integra os fundamentos da República", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A República Federativa do Brasil tem como fundamento a dignidade da pessoa humana.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Direitos e Garantias Fundamentais",
          challenges: [
            {
              type: "SELECT",
              question: "De acordo com a Constituição Federal, são direitos sociais:",
              options: [
                { text: "Educação, saúde, trabalho, moradia, lazer", correct: true },
                { text: "Propriedade, herança, contrato", correct: false },
                { text: "Vida, liberdade, igualdade, segurança", correct: false },
                { text: "Expressão, reunião, associação", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A educação é um direito social previsto na Constituição Federal.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa correta sobre o direito de reunião:",
              options: [
                { text: "É garantido desde que seja pacífica, sem armas e com prévio aviso à autoridade competente", correct: true },
                { text: "Depende de autorização prévia da autoridade competente", correct: false },
                { text: "Só é permitida em locais públicos mediante pagamento de taxa", correct: false },
                { text: "Pode ser proibida por decreto do Chefe do Executivo", correct: false },
              ],
            },
          ],
        },
        {
          title: "Organização do Estado",
          challenges: [
            {
              type: "SELECT",
              question: "São Poderes da União, independentes e harmônicos entre si:",
              options: [
                { text: "Legislativo, Executivo e Judiciário", correct: true },
                { text: "Executivo, Legislativo e Judiciário", correct: false },
                { text: "Judiciário, Executivo e Legislativo", correct: false },
                { text: "Executivo, Judiciário e Ministério Público", correct: false },
              ],
            },
            {
              type: "MULTIPLE_CORRECT",
              question: "Assinale as alternativas que correspondem a entidades federativas:",
              options: [
                { text: "União", correct: true },
                { text: "Estados", correct: true },
                { text: "Ministérios", correct: false },
                { text: "Municípios", correct: true },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O Distrito Federal é um ente federativo com capacidade de auto-organização, sendo equiparado aos Estados para fins de competências legislativas.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Administração Pública",
          challenges: [
            {
              type: "SELECT",
              question: "Assinale a alternativa que apresenta um princípio expresso da Administração Pública no art. 37 da Constituição Federal:",
              options: [
                { text: "Impessoalidade", correct: true },
                { text: "Proporcionalidade", correct: false },
                { text: "Razoabilidade", correct: false },
                { text: "Supremacia do interesse público", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O princípio da publicidade exige que todos os atos administrativos sejam amplamente divulgados, inclusive aqueles que contenham dados pessoais sensíveis.",
              options: [
                { text: "Verdadeiro", correct: false },
                { text: "Falso", correct: true },
              ],
            },
            {
              type: "SELECT",
              question: "Quanto ao acesso aos cargos públicos, assinale a alternativa correta:",
              options: [
                { text: "A investidura em cargo público efetivo depende de aprovação prévia em concurso público", correct: true },
                { text: "Todos os cargos públicos são acessíveis exclusivamente por concurso público", correct: false },
                { text: "O concurso público pode ser dispensado para cargos em comissão de livre nomeação", correct: false },
                { text: "O prazo de validade do concurso público é de até 3 anos, prorrogável uma vez", correct: false },
              ],
            },
          ],
        },
        {
          title: "Poder Legislativo, Executivo e Judiciário",
          challenges: [
            {
              type: "SELECT",
              question: "Compete privativamente ao Senado Federal:",
              options: [
                { text: "Processar e julgar o Presidente da República nos crimes de responsabilidade", correct: true },
                { text: "Autorizar a instauração de processo contra o Presidente da República", correct: false },
                { text: "Elaborar o plano plurianual", correct: false },
                { text: "Fiscalizar a execução orçamentária", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O Presidente da República pode ser investigado por atos praticados antes do mandato apenas após autorização da Câmara dos Deputados.",
              options: [
                { text: "Verdadeiro", correct: false },
                { text: "Falso", correct: true },
              ],
            },
            {
              type: "SELECT",
              question: "São órgãos do Poder Judiciário:",
              options: [
                { text: "Supremo Tribunal Federal, STJ, Tribunais Regionais Federais e Juízes Federais", correct: true },
                { text: "STF, STJ, TSE e Ministério Público", correct: false },
                { text: "STF, STJ, Tribunais de Contas e Defensoria Pública", correct: false },
                { text: "STF, STJ, AGU e Polícia Federal", correct: false },
              ],
            },
          ],
        },
        {
          title: "Ordem Social",
          challenges: [
            {
              type: "TEXT_PASSAGE",
              question: "Com base no texto constitucional, assinale a alternativa correta:",
              textoApoio: "Art. 194. A seguridade social compreende um conjunto integrado de ações de iniciativa dos Poderes Públicos e da sociedade, destinadas a assegurar os direitos relativos à saúde, à previdência e à assistência social. Art. 195. A seguridade social será financiada por toda a sociedade, de forma direta e indireta, mediante recursos provenientes dos orçamentos da União, dos Estados, do Distrito Federal e dos Municípios, e das contribuições sociais.",
              options: [
                { text: "A seguridade social abrange saúde, previdência e assistência social", correct: true },
                { text: "A seguridade social é financiada exclusivamente pelo trabalhador", correct: false },
                { text: "A assistência social depende de contribuição direta do beneficiário", correct: false },
                { text: "A previdência social é gratuita para todos os cidadãos", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa correta sobre a seguridade social:",
              options: [
                { text: "A saúde é direito de todos e dever do Estado", correct: true },
                { text: "A previdência social é direito de todos independentemente de contribuição", correct: false },
                { text: "A assistência social é contributiva e exige contrapartida do beneficiário", correct: false },
                { text: "A seguridade social é financiada apenas pelo orçamento da União", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A assistência social será prestada a quem dela necessitar, independentemente de contribuição à seguridade social.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Direito Administrativo",
      description: "Princípios, atos administrativos, licitações, servidores e responsabilidade civil",
      lessons: [
        {
          title: "Princípios da Administração Pública",
          challenges: [
            {
              type: "SELECT",
              question: "O princípio que impõe ao administrador público a obrigação de agir de acordo com a lei é o princípio da:",
              options: [
                { text: "Legalidade", correct: true },
                { text: "Moralidade", correct: false },
                { text: "Publicidade", correct: false },
                { text: "Eficiência", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O princípio da eficiência foi expressamente incluído no caput do art. 37 da Constituição Federal pela Emenda Constitucional nº 19/1998.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Diferentemente do particular, o administrador público só pode fazer o que a lei autoriza. Essa afirmação decorre do princípio da:",
              options: [
                { text: "Legalidade", correct: true },
                { text: "Autonomia da vontade", correct: false },
                { text: "Liberdade contratual", correct: false },
                { text: "Presunção de legitimidade", correct: false },
              ],
            },
          ],
        },
        {
          title: "Atos Administrativos",
          challenges: [
            {
              type: "SELECT",
              question: "São requisitos do ato administrativo:",
              options: [
                { text: "Competência, finalidade, forma, motivo e objeto", correct: true },
                { text: "Competência, legalidade, publicidade, motivo e objeto", correct: false },
                { text: "Capacidade, forma, motivo, objeto e finalidade", correct: false },
                { text: "Competência, finalidade, forma, motivo e conveniência", correct: false },
              ],
            },
            {
              type: "MULTIPLE_CORRECT",
              question: "Assinale as alternativas que são atributos do ato administrativo:",
              options: [
                { text: "Presunção de legitimidade", correct: true },
                { text: "Imperatividade", correct: true },
                { text: "Bilateralidade", correct: false },
                { text: "Autoexecutoriedade", correct: true },
              ],
            },
            {
              type: "SELECT",
              question: "A anulação do ato administrativo ocorre quando:",
              options: [
                { text: "Há vício de legalidade que o torna ilegítimo", correct: true },
                { text: "O ato é inconveniente ou inoportuno", correct: false },
                { text: "O administrador decide revogá-lo por critérios de mérito", correct: false },
                { text: "O ato já produziu todos os seus efeitos", correct: false },
              ],
            },
          ],
        },
        {
          title: "Licitações e Contratos",
          challenges: [
            {
              type: "TEXT_PASSAGE",
              question: "De acordo com a Lei 14.133/2021, assinale a alternativa correta:",
              textoApoio: "Art. 11. O processo licitatório tem por objetivos: I - assegurar a seleção da proposta mais vantajosa para a Administração Pública; II - assegurar tratamento isonômico entre os licitantes; III - evitar contratações com sobrepreço ou superfaturamento; IV - incentivar a inovação e o desenvolvimento nacional sustentável.",
              options: [
                { text: "A licitação visa assegurar a proposta mais vantajosa e tratamento isonômico aos licitantes", correct: true },
                { text: "A licitação pode dispensar o tratamento isonômico entre licitantes", correct: false },
                { text: "O desenvolvimento nacional sustentável não é objetivo da licitação", correct: false },
                { text: "A licitação busca selecionar a proposta de maior valor", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "São modalidades de licitação previstas na Lei 14.133/2021:",
              options: [
                { text: "Pregão, concorrência, concurso, leilão e diálogo competitivo", correct: true },
                { text: "Tomada de preços, convite, concorrência e leilão", correct: false },
                { text: "Pregão, tomada de preços, concurso e leilão", correct: false },
                { text: "Concorrência, pregão, convite e concurso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "O pregão é modalidade de licitação obrigatória para aquisição de:",
              options: [
                { text: "Bens e serviços comuns", correct: true },
                { text: "Serviços de engenharia de grande porte", correct: false },
                { text: "Obras de infraestrutura", correct: false },
                { text: "Serviços técnicos especializados", correct: false },
              ],
            },
          ],
        },
        {
          title: "Servidores Públicos",
          challenges: [
            {
              type: "SELECT",
              question: "A CF estabelece que o servidor público estável só perderá o cargo em virtude de:",
              options: [
                { text: "Sentença judicial transitada em julgado, processo administrativo disciplinar ou avaliação periódica de desempenho", correct: true },
                { text: "Decisão exclusiva do chefe do Executivo", correct: false },
                { text: "Aposentadoria compulsória ou pedido de demissão", correct: false },
                { text: "Extinção do cargo ou exoneração ad nutum", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O servidor público adquire estabilidade após 3 anos de efetivo exercício, desde que aprovado em estágio probatório.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa correta sobre a acumulação de cargos públicos:",
              options: [
                { text: "É proibida, salvo nas hipóteses constitucionais de acumulação lícita", correct: true },
                { text: "É permitida para todos os servidores desde que haja compatibilidade de horários", correct: false },
                { text: "É livre para cargos em comissão", correct: false },
                { text: "É permitida apenas para médicos e professores", correct: false },
              ],
            },
          ],
        },
        {
          title: "Responsabilidade Civil do Estado",
          challenges: [
            {
              type: "SELECT",
              question: "A responsabilidade civil do Estado no Brasil adota, como regra geral, a teoria:",
              options: [
                { text: "Da responsabilidade objetiva (risco administrativo)", correct: true },
                { text: "Da responsabilidade subjetiva (culpa administrativa)", correct: false },
                { text: "Do risco integral", correct: false },
                { text: "Da culpa presumida", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O Estado responde objetivamente pelos danos causados por seus agentes, independentemente de culpa, mas pode exercer direito de regresso contra o agente culpado.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "A ação de regresso da Administração Pública contra o agente causador do dano:",
              options: [
                { text: "Depende da comprovação de culpa ou dolo do agente", correct: true },
                { text: "É automática, independentemente de culpa", correct: false },
                { text: "Prescreve em 3 anos", correct: false },
                { text: "Não é cabível quando o Estado já indenizou a vítima", correct: false },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Direito Previdenciário",
      description: "Regime Geral, segurados, dependentes, benefícios e contribuições",
      lessons: [
        {
          title: "Regime Geral de Previdência Social (RGPS)",
          challenges: [
            {
              type: "TEXT_PASSAGE",
              question: "Com base no texto, assinale a alternativa correta:",
              textoApoio: "O Regime Geral de Previdência Social (RGPS) é o sistema previdenciário aplicável aos trabalhadores da iniciativa privada e aos servidores públicos não vinculados a regime próprio. É gerido pelo INSS e tem caráter contributivo e solidário. A filiação ao RGPS é obrigatória para os segurados obrigatórios e facultativa para os demais.",
              options: [
                { text: "O RGPS é gerido pelo INSS e tem caráter contributivo e solidário", correct: true },
                { text: "O RGPS é um sistema de capitalização individual", correct: false },
                { text: "A filiação ao RGPS é voluntária para todos os trabalhadores", correct: false },
                { text: "O RGPS atende apenas servidores públicos federais", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "São princípios da seguridade social, EXCETO:",
              options: [
                { text: "Lucro do segurado", correct: true },
                { text: "Solidariedade", correct: false },
                { text: "Universalidade da cobertura", correct: false },
                { text: "Equidade na participação do custeio", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A seguridade social compreende saúde, previdência social e assistência social, sendo a previdência de caráter contributivo.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Segurados Obrigatórios e Facultativos",
          challenges: [
            {
              type: "MULTIPLE_CORRECT",
              question: "Assinale as alternativas que correspondem a segurados obrigatórios do RGPS:",
              options: [
                { text: "Empregado", correct: true },
                { text: "Trabalhador avulso", correct: true },
                { text: "Estudante maior de 16 anos", correct: false },
                { text: "Contribuinte individual", correct: true },
              ],
            },
            {
              type: "SELECT",
              question: "É segurado facultativo do RGPS:",
              options: [
                { text: "O estudante maior de 14 anos que não exerce atividade remunerada", correct: true },
                { text: "O empregado de empresa privada", correct: false },
                { text: "O servidor público estatutário", correct: false },
                { text: "O trabalhador avulso", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O empregado doméstico é segurado obrigatório do RGPS.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Dependentes",
          challenges: [
            {
              type: "SELECT",
              question: "São dependentes do segurado do RGPS, na classe 1:",
              options: [
                { text: "Cônjuge, companheiro(a) e filho não emancipado menor de 21 anos", correct: true },
                { text: "Pais do segurado", correct: false },
                { text: "Irmão não emancipado menor de 21 anos", correct: false },
                { text: "Avós do segurado", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A dependência econômica dos dependentes da classe 1 (cônjuge, companheiro e filho menor de 21 anos) é presumida.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Na falta de dependentes das classes 1 e 2, são beneficiários do RGPS:",
              options: [
                { text: "O irmão não emancipado menor de 21 anos ou inválido", correct: true },
                { text: "O tio do segurado", correct: false },
                { text: "O primo do segurado", correct: false },
                { text: "O sobrinho do segurado", correct: false },
              ],
            },
          ],
        },
        {
          title: "Benefícios em Espécie: Aposentadorias",
          challenges: [
            {
              type: "TEXT_PASSAGE",
              question: "Com base na legislação previdenciária, assinale a alternativa correta:",
              textoApoio: "A aposentadoria por idade é devida ao segurado que completar 65 anos (homem) ou 62 anos (mulher), desde que cumprida a carência de 180 contribuições mensais. A aposentadoria por tempo de contribuição exige 35 anos (homem) ou 30 anos (mulher), sem idade mínima, para quem já estava no mercado antes da Reforma da Previdência (EC 103/2019).",
              options: [
                { text: "A aposentadoria por idade exige carência de 180 contribuições mensais", correct: true },
                { text: "A aposentadoria por idade exige 30 anos de contribuição para homens", correct: false },
                { text: "A aposentadoria por tempo de contribuição exige 40 anos de contribuição", correct: false },
                { text: "A carência para aposentadoria por idade é de 60 contribuições", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "A aposentadoria especial é devida ao segurado que exerce atividade com efetiva exposição a agentes nocivos à saúde por:",
              options: [
                { text: "15, 20 ou 25 anos, conforme o grau de risco", correct: true },
                { text: "30 anos para qualquer atividade de risco", correct: false },
                { text: "20 anos para todas as atividades insalubres", correct: false },
                { text: "35 anos de contribuição, independentemente da atividade", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A aposentadoria por invalidez é devida ao segurado que for considerado permanentemente incapaz para o trabalho, desde que cumprida a carência de 12 contribuições, salvo exceções.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Benefícios em Espécie: Pensão e Auxílios",
          challenges: [
            {
              type: "MULTIPLE_CORRECT",
              question: "Assinale as alternativas que correspondem a benefícios previdenciários do RGPS:",
              options: [
                { text: "Pensão por morte", correct: true },
                { text: "Auxílio-doença", correct: true },
                { text: "Seguro-desemprego", correct: false },
                { text: "Salário-maternidade", correct: true },
              ],
            },
            {
              type: "SELECT",
              question: "O auxílio-doença será devido ao segurado que ficar incapacitado para o trabalho por mais de:",
              options: [
                { text: "15 dias consecutivos", correct: true },
                { text: "30 dias consecutivos", correct: false },
                { text: "7 dias consecutivos", correct: false },
                { text: "60 dias consecutivos", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "A pensão por morte é devida aos dependentes do segurado que falecer, sendo o valor do benefício:",
              options: [
                { text: "Equivalente a 50% da aposentadoria + 10% por dependente, limitado a 100%", correct: true },
                { text: "100% do valor da aposentadoria que o segurado recebia", correct: false },
                { text: "50% do salário mínimo para cada dependente", correct: false },
                { text: "80% do salário de contribuição do segurado", correct: false },
              ],
            },
          ],
        },
        {
          title: "Salário de Contribuição",
          challenges: [
            {
              type: "SELECT",
              question: "O salário de contribuição do empregado é composto:",
              options: [
                { text: "Pela totalidade dos rendimentos recebidos, incluindo salário-base e adicionais", correct: true },
                { text: "Apenas pelo salário-base registrado na carteira de trabalho", correct: false },
                { text: "Exclusivamente pelo valor das comissões recebidas", correct: false },
                { text: "Pelo salário mínimo nacional, independentemente da remuneração", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O salário de contribuição do empregado tem limite mínimo de um salário mínimo e limite máximo igual ao teto do RGPS.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa correta sobre o salário de contribuição do contribuinte individual:",
              options: [
                { text: "É calculado sobre a receita bruta, observados os limites mínimo e máximo do RGPS", correct: true },
                { text: "É fixo e independente da receita auferida", correct: false },
                { text: "É calculado sobre o lucro líquido do exercício", correct: false },
                { text: "Corresponde a 50% do valor do salário mínimo", correct: false },
              ],
            },
          ],
        },
        {
          title: "Carência e Período de Graça",
          challenges: [
            {
              type: "SELECT",
              question: "O período de graça do segurado obrigatório é de:",
              options: [
                { text: "12 meses após a cessação das contribuições, prorrogável por até 24 meses em caso de desemprego", correct: true },
                { text: "6 meses após a última contribuição", correct: false },
                { text: "24 meses para qualquer segurado", correct: false },
                { text: "3 meses para segurado facultativo", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "Para o segurado facultativo, o período de graça é de 6 meses, sem possibilidade de prorrogação.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "A carência para concessão de auxílio-doença e aposentadoria por invalidez é de:",
              options: [
                { text: "12 contribuições mensais", correct: true },
                { text: "24 contribuições mensais", correct: false },
                { text: "6 contribuições mensais", correct: false },
                { text: "180 contribuições mensais", correct: false },
              ],
            },
          ],
        },
        {
          title: "Decadência e Prescrição",
          challenges: [
            {
              type: "SELECT",
              question: "O prazo decadencial para revisão de benefício previdenciário é de:",
              options: [
                { text: "10 anos, contados do dia primeiro do mês seguinte ao do recebimento da primeira prestação", correct: true },
                { text: "5 anos, contados da data do requerimento", correct: false },
                { text: "3 anos, contados da ciência do ato", correct: false },
                { text: "20 anos, contados do início do benefício", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O prazo prescricional para cobrança de prestações vencidas é de 5 anos, contados da data em que deveriam ter sido pagas.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa correta sobre decadência e prescrição no RGPS:",
              options: [
                { text: "A decadência atinge o próprio direito ao benefício, enquanto a prescrição atinge as prestações vencidas", correct: true },
                { text: "Decadência e prescrição são sinônimos no direito previdenciário", correct: false },
                { text: "A prescrição atinge o direito ao benefício, enquanto a decadência atinge as prestações", correct: false },
                { text: "Não há prazos decadenciais ou prescricionais no RGPS", correct: false },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Noções de Informática",
      description: "Hardware, software, sistemas operacionais, editores e segurança",
      lessons: [
        {
          title: "Conceitos de Hardware e Software",
          challenges: [
            {
              type: "SELECT",
              question: "Assinale a alternativa que apresenta apenas componentes de hardware:",
              options: [
                { text: "CPU, memória RAM, disco rígido, placa-mãe", correct: true },
                { text: "Word, Excel, PowerPoint, Outlook", correct: false },
                { text: "Windows, Linux, macOS, Android", correct: false },
                { text: "CPU, Windows, disco rígido, placa-mãe", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A memória RAM é uma memória volátil, ou seja, perde seus dados quando o computador é desligado.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa correta sobre software:",
              options: [
                { text: "Software é a parte lógica do computador, composta por programas e dados", correct: true },
                { text: "Software é a parte física do computador", correct: false },
                { text: "Software livre é aquele que não pode ser modificado pelo usuário", correct: false },
                { text: "Software de sistema inclui aplicativos como Excel e Photoshop", correct: false },
              ],
            },
          ],
        },
        {
          title: "Sistema Operacional Windows/Linux",
          challenges: [
            {
              type: "SELECT",
              question: "No Windows, o atalho Ctrl + C é utilizado para:",
              options: [
                { text: "Copiar o item selecionado", correct: true },
                { text: "Recortar o item selecionado", correct: false },
                { text: "Colar o item copiado", correct: false },
                { text: "Fechar o programa ativo", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "No Linux, o comando utilizado para listar arquivos e diretórios é:",
              options: [
                { text: "ls", correct: true },
                { text: "dir", correct: false },
                { text: "list", correct: false },
                { text: "show", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O Windows é um sistema operacional de código fechado (proprietário), enquanto o Linux é um sistema operacional de código aberto (open source).",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Editores de Texto (Word/LibreOffice)",
          challenges: [
            {
              type: "SELECT",
              question: "No Microsoft Word, a tecla de atalho Ctrl + B é utilizada para:",
              options: [
                { text: "Aplicar negrito ao texto selecionado", correct: true },
                { text: "Inserir uma quebra de página", correct: false },
                { text: "Salvar o documento", correct: false },
                { text: "Abrir a caixa de diálogo Fonte", correct: false },
              ],
            },
            {
              type: "MULTIPLE_CORRECT",
              question: "Assinale as alternativas que são funcionalidades do Microsoft Word:",
              options: [
                { text: "Inserir tabelas", correct: true },
                { text: "Criar mala direta", correct: true },
                { text: "Criar fórmulas matemáticas complexas", correct: false },
                { text: "Inserir cabeçalho e rodapé", correct: true },
              ],
            },
            {
              type: "SELECT",
              question: "No LibreOffice Writer, o atalho Ctrl + S tem a função de:",
              options: [
                { text: "Salvar o documento atual", correct: true },
                { text: "Selecionar todo o texto", correct: false },
                { text: "Sublinhar o texto selecionado", correct: false },
                { text: "Inserir uma tabela", correct: false },
              ],
            },
          ],
        },
        {
          title: "Planilhas Eletrônicas (Excel/LibreOffice Calc)",
          challenges: [
            {
              type: "SELECT",
              question: "No Microsoft Excel, a fórmula =SOMA(A1:A10) tem como resultado:",
              options: [
                { text: "A soma dos valores contidos nas células de A1 a A10", correct: true },
                { text: "A média dos valores de A1 a A10", correct: false },
                { text: "O maior valor entre A1 e A10", correct: false },
                { text: "O menor valor entre A1 e A10", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "No Excel, a referência $A$1 é um exemplo de referência:",
              options: [
                { text: "Absoluta", correct: true },
                { text: "Relativa", correct: false },
                { text: "Mista", correct: false },
                { text: "Circular", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "No Excel, a função MÉDIA calcula a média aritmética dos valores de um intervalo de células.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Internet, Navegadores e Segurança",
          challenges: [
            {
              type: "SELECT",
              question: "HTTPS é um protocolo que garante:",
              options: [
                { text: "A comunicação segura e criptografada entre o navegador e o servidor", correct: true },
                { text: "A transferência de arquivos entre computadores", correct: false },
                { text: "O envio de e-mails criptografados", correct: false },
                { text: "A autenticação de usuários em redes sociais", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "Phishing é uma técnica de ataque cibernético em que o criminoso se passa por uma entidade confiável para obter dados pessoais e financeiros da vítima.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa que apresenta uma prática recomendada de segurança da informação:",
              options: [
                { text: "Utilizar senhas fortes com letras, números e caracteres especiais", correct: true },
                { text: "Compartilhar a mesma senha em todos os serviços", correct: false },
                { text: "Clicar em links recebidos por e-mail de remetentes desconhecidos", correct: false },
                { text: "Manter o sistema operacional desatualizado", correct: false },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Ética no Serviço Público",
      description: "Ética, moral, deveres, código de ética e improbidade administrativa",
      lessons: [
        {
          title: "Ética, Moral e Direito",
          challenges: [
            {
              type: "SELECT",
              question: "A ética no serviço público distingue-se da moral porque:",
              options: [
                { text: "A ética é um conjunto sistemático de princípios que orientam a conduta, enquanto a moral são costumes socialmente aceitos", correct: true },
                { text: "Ética e moral são sinônimos no serviço público", correct: false },
                { text: "A moral é sempre mais rigorosa que a ética", correct: false },
                { text: "A ética é facultativa, enquanto a moral é obrigatória", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "O direito disciplina condutas externas e é heterônomo, enquanto a ética abrange a intenção do agente e é autônoma.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Assinale a alternativa correta sobre a relação entre ética e direito:",
              options: [
                { text: "O direito positivo pode incorporar princípios éticos, mas nem toda conduta ética é juridicamente exigível", correct: true },
                { text: "Toda conduta ética é obrigatoriamente uma conduta legal", correct: false },
                { text: "O direito e a ética são campos totalmente independentes e sem intersecção", correct: false },
                { text: "A ética substitui o direito quando a lei é omissa", correct: false },
              ],
            },
          ],
        },
        {
          title: "Deveres do Servidor Público",
          challenges: [
            {
              type: "SELECT",
              question: "Assinale a alternativa que apresenta um dever fundamental do servidor público:",
              options: [
                { text: "Ser assíduo e pontual ao serviço", correct: true },
                { text: "Exigir vantagens pessoais para agilizar processos", correct: false },
                { text: "Utilizar recursos públicos para benefício próprio", correct: false },
                { text: "Manter sigilo apenas quando for conveniente", correct: false },
              ],
            },
            {
              type: "MULTIPLE_CORRECT",
              question: "Assinale as alternativas que representam deveres do servidor público:",
              options: [
                { text: "Tratar com urbanidade as pessoas", correct: true },
                { text: "Representar contra ilegalidades de que tiver ciência", correct: true },
                { text: "Aproveitar material de escritório para uso pessoal quando sobrar", correct: false },
                { text: "Manter sigilo sobre assuntos restritos", correct: true },
              ],
            },
            {
              type: "SELECT",
              question: "O servidor público que utiliza o cargo para obter vantagem indevida para si ou para outrem comete:",
              options: [
                { text: "Ato de improbidade administrativa", correct: true },
                { text: "Mero desvio de conduta sem consequências legais", correct: false },
                { text: "Infração disciplinar leve", correct: false },
                { text: "Ato de natureza exclusivamente ética", correct: false },
              ],
            },
          ],
        },
        {
          title: "Código de Ética do Servidor Público",
          challenges: [
            {
              type: "TEXT_PASSAGE",
              question: "De acordo com o Código de Ética do Servidor Público (Decreto 1.171/1994), assinale a alternativa correta:",
              textoApoio: "A dignidade, o decoro, o zelo, a eficácia e a consciência dos princípios morais são primados maiores que devem nortear o servidor público, seja no exercício do cargo ou função, ou fora dele, já que refletirá o exercício da vocação do próprio poder estatal. O servidor público não poderá jamais desprezar o elemento ético de sua conduta.",
              options: [
                { text: "O servidor deve nortear sua conduta pela dignidade, decoro, zelo, eficácia e consciência moral", correct: true },
                { text: "A conduta ética do servidor é relevante apenas durante o expediente", correct: false },
                { text: "O Código de Ética trata apenas de infrações disciplinares graves", correct: false },
                { text: "O decoro é exigido apenas para cargos de chefia", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "Segundo o Decreto 1.171/1994, a Comissão de Ética Pública tem competência para:",
              options: [
                { text: "Aplicar a censura ética ao servidor público", correct: true },
                { text: "Demitir servidores públicos", correct: false },
                { text: "Suspender o servidor por até 90 dias", correct: false },
                { text: "Aplicar multas ao servidor infrator", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A pena aplicável no âmbito do Código de Ética é a de censura ética, que será registrada nos assentamentos funcionais do servidor.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
          ],
        },
        {
          title: "Improbidade Administrativa",
          challenges: [
            {
              type: "SELECT",
              question: "A Lei de Improbidade Administrativa (Lei 8.429/1992) tem como principal objetivo:",
              options: [
                { text: "Punir agentes públicos que pratiquem atos de improbidade", correct: true },
                { text: "Regular as licitações públicas", correct: false },
                { text: "Estabelecer o plano de carreira dos servidores", correct: false },
                { text: "Definir as regras para aposentadoria do servidor", correct: false },
              ],
            },
            {
              type: "TRUE_FALSE",
              question: "A improbidade administrativa exige a comprovação de dolo do agente público, não sendo punível a conduta meramente culposa após a reforma da Lei pela Lei 14.230/2021.",
              options: [
                { text: "Verdadeiro", correct: true },
                { text: "Falso", correct: false },
              ],
            },
            {
              type: "SELECT",
              question: "São sanções previstas na Lei de Improbidade Administrativa, EXCETO:",
              options: [
                { text: "Pena de prisão", correct: true },
                { text: "Perda da função pública", correct: false },
                { text: "Suspensão dos direitos políticos", correct: false },
                { text: "Ressarcimento integral do dano", correct: false },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const main = async () => {
  try {
    console.log("=== Seeding Database ===");

    // Clear existing data
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challengeProgress),
      db.delete(schema.challengeOptions),
      db.delete(schema.challenges),
      db.delete(schema.lessons),
      db.delete(schema.units),
      db.delete(schema.courses),
      db.delete(schema.userSubscription),
    ]);
    console.log("Existing data cleared");

    // Create course
    const [course] = await db
      .insert(schema.courses)
      .values({
        title: courseData.title,
        imageSrc: courseData.imageSrc,
        banca: courseData.banca,
        ano: courseData.ano,
        orgao: courseData.orgao,
        description: courseData.description,
        active: courseData.active,
      })
      .returning();
    console.log(`Course created: ${course.title}`);

    // Create units, lessons, challenges, options
    for (const unitDef of courseData.units) {
      const [unit] = await db
        .insert(schema.units)
        .values({
          courseId: course.id,
          title: unitDef.title,
          description: unitDef.description,
          order: unitDef.lessons.length > 0 ? courseData.units.indexOf(unitDef) + 1 : 0,
        })
        .returning();
      console.log(`  Unit created: ${unit.title}`);

      for (const lessonDef of unitDef.lessons) {
        const [lesson] = await db
          .insert(schema.lessons)
          .values({
            unitId: unit.id,
            title: lessonDef.title,
            order: unitDef.lessons.indexOf(lessonDef) + 1,
          })
          .returning();
        console.log(`    Lesson created: ${lesson.title}`);

        for (const challengeDef of lessonDef.challenges) {
          const challengeData: Record<string, unknown> = {
            lessonId: lesson.id,
            type: challengeDef.type,
            question: challengeDef.question,
            order: lessonDef.challenges.indexOf(challengeDef) + 1,
          };

          if (challengeDef.textoApoio) {
            challengeData.textoApoio = challengeDef.textoApoio;
          }

          const [challenge] = await db
            .insert(schema.challenges)
            .values(challengeData as typeof schema.challenges.$inferInsert)
            .returning();

          await db.insert(schema.challengeOptions).values(
            challengeDef.options.map((opt) => ({
              challengeId: challenge.id,
              text: opt.text,
              correct: opt.correct,
            }))
          );
        }
      }
    }

    console.log("=== Database seeded successfully ===");
    console.log(`  Units: ${courseData.units.length}`);
    const totalLessons = courseData.units.reduce((s, u) => s + u.lessons.length, 0);
    console.log(`  Lessons: ${totalLessons}`);
    const totalChallenges = courseData.units.reduce((s, u) => s + u.lessons.reduce((s2, l) => s2 + l.challenges.length, 0), 0);
    console.log(`  Challenges: ${totalChallenges}`);
    const totalOptions = courseData.units.reduce((s, u) => s + u.lessons.reduce((s2, l) => s2 + l.challenges.reduce((s3, c) => s3 + c.options.length, 0), 0), 0);
    console.log(`  Options: ${totalOptions}`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
