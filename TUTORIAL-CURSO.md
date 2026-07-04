# Tutorial: Como Criar um Curso (Edital) no Aprova+

> **Base:** Curso INSS 2026 | **Plataforma:** Aprova+ (Next.js 16 + PostgreSQL + Drizzle ORM)

---

## 1. Visão Geral da Hierarquia

```
Curso (Edital)
  └── Unidades (Matérias)
        └── Lições (Tópicos)
              └── Desafios (Questões)
                    └── Opções (Alternativas)
```

Cada nível depende do anterior. Um **Curso** representa um concurso/edital (ex: "INSS 2026 - CESPE"). Uma **Unidade** é uma matéria (ex: "Direito Constitucional"). Uma **Lições** é um tópico (ex: "Conceitos Básicos"). Um **Desafio** é uma questão propriamente dita.

---

## 2. Materiais e Assets Necessários

### 2.1 Imagem do Curso (obrigatório)
Uma bandeira/ícone SVG 32x24px que representa o curso.

| O que | Formato | Tamanho | Onde colocar |
|-------|---------|---------|--------------|
| Bandeira do concurso | SVG | 32x24 | `public/br.svg` |

**Exemplo:** O curso INSS usa `/br.svg` (bandeira do Brasil).

Para criar a sua:
- Crie um SVG 32x24 (use `public/fr.svg` como referência de formato)
- Salve em `public/seu-estado.svg` ou `public/sua-banca.svg`
- Referencie no banco como `/seu-estado.svg`

### 2.2 Assets de Áudio (opcional mas recomendado)
Sons de acerto/erro e finalização:

| Arquivo | Descrição |
|---------|-----------|
| `public/correct.wav` | Som de acerto |
| `public/incorrect.wav` | Som de erro |
| `public/finish.mp3` | Som de conclusão do simulado |

Já existentes no projeto. Não precisa criar novos a menos que queira personalizar.

### 2.3 Imagens do Sistema (já existentes)
| Arquivo | Uso |
|---------|-----|
| `public/mascot.svg` | Logo e avatar padrão |
| `public/hero.svg` | Página de marketing |
| `public/points.svg` | Ícone de pontos |
| `public/finish.svg` | Tela de conclusão |
| `public/learn.svg` | Sidebar - Estudar |
| `public/leaderboard.svg` | Sidebar - Ranking |
| `public/quests.svg` | Sidebar - Metas |
| `public/shop.svg` | Sidebar - Loja |

---

## 3. Duas Formas de Criar um Curso

### 3.1 Via Admin Panel (mais fácil, 1 curso)

1. Acesse `https://seudominio/admin`
2. Faça login com uma conta de administrador
3. No menu, clique em **Courses**
4. Clique em **Create**
5. Preencha:
   - **Edital** → Título do curso (ex: "STF 2026")
   - **Banca** → Nome da banca (ex: "CESPE", "FGV", "CESGRANRIO")
   - **Ano** → Ano do concurso (ex: 2026)
   - **Órgão** → Órgão (ex: "STF", "INSS")
   - **Imagem** → Caminho da imagem (ex: `/br.svg`)
6. Salve

Depois crie as **Unidades**, **Lições**, **Desafios** e **Opções** na mesma ordem.

### 3.2 Via Seed Script (recomendado para muitos dados)

Edite o arquivo `scripts/prod.ts`. Exemplo baseado no INSS:

```typescript
// 1. Crie o curso
const courses = await db.insert(schema.courses).values([
  {
    title: "INSS 2026",
    imageSrc: "/br.svg",
    banca: "CESPE",
    ano: 2026,
    orgao: "INSS",
  },
]).returning();

// 2. Para cada curso, crie unidades
for (const course of courses) {
  const units = await db.insert(schema.units).values([
    {
      courseId: course.id,
      title: "Direito Constitucional",
      description: "Princípios fundamentais, direitos e garantias",
      order: 1,
    },
  ]).returning();

  // 3. Para cada unidade, crie lições
  for (const unit of units) {
    const lessons = await db.insert(schema.lessons).values([
      { unitId: unit.id, title: "Conceitos Básicos", order: 1 },
    ]).returning();

    // 4. Para cada lição, crie desafios (questões)
    for (const lesson of lessons) {
      const challenges = await db.insert(schema.challenges).values([
        {
          lessonId: lesson.id,
          type: "SELECT",
          question: "Assinale a alternativa correta...",
          order: 1,
        },
      ]).returning();

      // 5. Para cada desafio, crie opções (alternativas)
      for (const challenge of challenges) {
        await db.insert(schema.challengeOptions).values([
          { challengeId: challenge.id, correct: true, text: "Resposta correta" },
          { challengeId: challenge.id, correct: false, text: "Resposta errada" },
        ]);
      }
    }
  }
}
```

Depois execute:
```bash
npx tsx ./scripts/prod.ts
```

---

## 4. Tipos de Desafio (Questões)

| Tipo | Descrição | Comportamento no Quiz |
|------|-----------|----------------------|
| `SELECT` | Múltipla escolha (1 resposta) | Grid de 2 colunas |
| `TRUE_FALSE` | Verdadeiro ou Falso | 2 opções: "Verdadeiro" / "Falso" |
| `MULTIPLE_CORRECT` | Múltipla escolha (N respostas) | Seleciona várias, confirma |
| `TEXT_PASSAGE` | Texto de apoio + pergunta | Exibe texto acima da pergunta |

Use `textoApoio` para inserir textos de lei, artigos ou enunciados longos.

---

## 5. Materiais que Você Precisa Adquirir/Preparar

| Item | Obrigatório? | Como obter |
|------|-------------|------------|
| Bandeira SVG do órgão/estado | Sim | Baixe flag SVGs (ex: flagcdn.com) ou crie/edite |
| Conteúdo das questões | Sim | Elabore ou compre banco de questões |
| Textos de lei/artigos | Opcional | Copie da legislação pertinente |
| Som de acerto/erro | Opcional | Já incluso no projeto |
| Domínio + servidor | Sim | Para deploy (ver seção 7) |

---

## 6. Customizando o Card do Curso

O card do curso fica em `app/(main)/courses/card.tsx`. Ele exibe:

- `imageSrc` → Imagem SVG da bandeira
- `title` → Nome do edital
- Badge verde se for o curso ativo

Se quiser exibir banca/ano/órgão no card, edite `card.tsx`:

```tsx
<p className="mt-3 text-center font-bold text-foreground">{title}</p>
<p className="text-xs text-muted-foreground">{banca} - {ano}</p>
```

Você precisa passar esses campos do `list.tsx` para o `Card`.

---

## 7. Fluxo Completo de Deploy

### 7.1 Pré-requisitos

- Docker e Docker Compose instalados
- Domínio configurado (ex: `aprova.kodoo.online`)
- Acesso ao servidor via SSH
- Cloudflare Tunnel token (se usar)

### 7.2 Preparar Ambiente

```bash
# No servidor
git clone <seu-repo> /opt/aprova-mais
cd /opt/aprova-mais

# Criar .env baseado no .env de produção
cp .env.prod .env
# Editar .env com suas credenciais:
#   POSTGRES_PASSWORD=senha-forte
#   GOTRUE_JWT_SECRET=seu-jwt-32-caracteres
#   SUPABASE_ADMIN_IDS=id-do-usuario-admin
#   CLOUDFLARE_TUNNEL_TOKEN=seu-token (se for usar tunnel)
```

### 7.3 Executar Deploy

```bash
# O script deploy.sh faz tudo automaticamente:
./scripts/deploy.sh
```

O que o script faz:
1. **Build** da imagem Docker da aplicação
2. **Sobe o banco** PostgreSQL
3. **Cria o database** `aprova_mais`
4. **Sobe auth** (GoTrue), app, nginx
5. **Push do schema** Drizzle para o banco
6. **Seed** dos dados (executa `scripts/prod.ts`)

### 7.4 Configurar Nginx Global

No nginx do host, adicione:

```nginx
server {
    listen 80;
    server_name aprova.kodoo.online;

    location / {
        proxy_pass http://localhost:82;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7.5 Acessar

- **App:** `https://seudominio`
- **Admin:** `https://seudominio/admin`

---

## 8. Exemplo: Criar Curso "STF 2026 - CESPE" (passo a passo)

### 8.1 Assets necessários
- Bandeira: `public/br.svg` (já criada, reutilizar para concursos federais)
- Ou criar `public/stf.svg` personalizada

### 8.2 Seed script (`scripts/prod.ts`)

```typescript
// Substitua o array de courses:
const courses = await db
  .insert(schema.courses)
  .values([
    {
      title: "STF 2026",
      imageSrc: "/br.svg",
      banca: "CESPE",
      ano: 2026,
      orgao: "STF",
    },
  ])
  .returning();
```

### 8.3 Unidades sugeridas
| Order | Matéria |
|-------|---------|
| 1 | Direito Constitucional |
| 2 | Direito Administrativo |
| 3 | Língua Portuguesa |
| 4 | Raciocínio Lógico |

### 8.4 Lições por unidade
| Order | Lição |
|-------|-------|
| 1 | Conceitos Básicos |
| 2 | Aplicação Prática |
| 3 | Revisão Completa |

### 8.5 Questões
Crie questões nos tipos SELECT, TRUE_FALSE, TEXT_PASSAGE seguindo o padrão INSS.

### 8.6 Deploy
```bash
./scripts/deploy.sh
```

---

## 9. Resumo de Arquivos Relevantes

| Arquivo | Função |
|---------|--------|
| `db/schema.ts` | Schema do banco (tabelas e relações) |
| `db/queries.ts` | Queries do banco (buscar cursos, unidades, etc.) |
| `db/drizzle.ts` | Conexão com o banco |
| `scripts/prod.ts` | Seed de dados (cursos, unidades, lições, questões) |
| `app/(main)/courses/page.tsx` | Página de listagem de cursos |
| `app/(main)/courses/list.tsx` | Grid de cards de cursos |
| `app/(main)/courses/card.tsx` | Card individual do curso |
| `app/admin/course/create.tsx` | Form de criação no admin |
| `app/admin/course/edit.tsx` | Form de edição no admin |
| `app/admin/course/list.tsx` | Lista no admin |
| `public/br.svg` | Bandeira do Brasil (imagem do curso) |
| `docker-compose.prod.yml` | Stack de produção |
| `scripts/deploy.sh` | Script de deploy automatizado |

---

## 10. Troubleshooting Comum

| Problema | Causa | Solução |
|----------|-------|---------|
| Imagem do curso não aparece | `/br.svg` não existe em `public/` | Criar o SVG |
| Erro "Course is empty" | Curso sem unidades/lições | Adicionar conteúdo via admin ou seed |
| Erro 401 no admin | `SUPABASE_ADMIN_IDS` não configurado | Adicionar seu user ID no `.env` |
| Middleware não protege rotas | Arquivo precisa ser `middleware.ts` | Já corrigido neste projeto |
| Build falha | Variáveis de ambiente não definidas | Verificar `.env` |
