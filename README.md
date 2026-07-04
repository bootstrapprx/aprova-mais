<a name="readme-top"></a>

# Aprova+ - Plataforma de estudos para concursos públicos

Plataforma para estudar para concursos públicos com simulados, questões de múltipla escolha, verdadeiro/falso, múltiplas respostas corretas e questões com texto de apoio. Stack 100% Docker Compose com Supabase (PostgreSQL + GoTrue) para ambiente de desenvolvimento rastreável e sem dependências externas.

## Stack

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes + Server Actions
- **Database**: PostgreSQL 16 via Docker (Supabase GoTrue incluso)
- **Auth**: Supabase Auth (GoTrue) rodando em container, auto-confirm de email
- **ORM**: Drizzle ORM com driver `postgres`
- **Admin**: React Admin (painel administrativo embutido)

## Pré-requisitos

- Docker e Docker Compose
- Node.js 24+
- NPM

## Configuração rápida

1. Clone o repositório:

```bash
git clone https://github.com/bootstrapprx/aprova-mais.git
cd aprova-mais
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env.local
```

3. Configure as variáveis no `.env.local`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@db:5432/aprova_mais"

# Supabase Auth (valores placeholder, o GoTrue local não valida a anon key)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:9999
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAzMDAwMDAwMH0.abc123

# URL interna para o servidor (rede interna Docker)
SUPABASE_URL=http://auth:9999
SUPABASE_ANON_KEY=<mesma key do NEXT_PUBLIC_SUPABASE_ANON_KEY>

# Admin (IDs dos usuários Supabase que terão acesso ao painel admin)
SUPABASE_ADMIN_IDS=""
```

4. Suba os containers:

```bash
docker compose up -d
```

5. Instale as dependências:

```bash
npm install --legacy-peer-deps
```

6. Push do schema e seed dos dados:

```bash
npm run db:push
npm run db:prod
```

7. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

8. Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do projeto

```
aprova-mais/
  |- actions/          # Server Actions (progresso, assinatura)
  |- app/
    |-- (auth)/        # Sign-in/Sign-up customizados com Supabase
    |-- (main)/        # Learn, Leaderboard, Shop, Quests
    |-- (marketing)/   # Landing page
    |-- admin/         # Painel React Admin
    |-- api/           # API Routes (admin, webhooks)
    |-- lesson/        # Página de simulado/quiz
  |- components/       # Componentes React
  |- config/           # Configuração do site
  |- db/               # Schema Drizzle, queries, conexão
  |- lib/              # Utilitários (Supabase client, Stripe, admin)
  |- public/           # Assets estáticos
  |- scripts/          # Seed scripts
  |- docker-compose.yml
  |- Dockerfile.dev
  |- proxy.ts          # Middleware Next.js 16 (proteção de rotas)
```

## Schema do banco

### courses (editais)
- `id`, `title`, `imageSrc`, `banca` (ex: CESPE), `ano`, `orgao` (ex: INSS)

### units (matérias)
- `id`, `courseId`, `title`, `description`, `order`

### lessons (tópicos)
- `id`, `unitId`, `title`, `order`

### challenges (questões)
- `id`, `lessonId`, `type` (SELECT | TRUE_FALSE | MULTIPLE_CORRECT | TEXT_PASSAGE)
- `question`, `textoApoio` (para questões com texto de apoio), `order`

### challengeOptions (alternativas)
- `id`, `challengeId`, `text`, `correct`

## Tipos de questão suportados

| Tipo | Descrição |
|---|---|
| `SELECT` | Múltipla escolha, uma resposta correta |
| `TRUE_FALSE` | Verdadeiro ou Falso |
| `MULTIPLE_CORRECT` | Múltiplas respostas corretas (toggle) |
| `TEXT_PASSAGE` | Questão com texto de apoio (funciona como SELECT com contexto adicional) |

## Comandos disponíveis

```bash
npm run dev           # Servidor de desenvolvimento
npm run build         # Build de produção
npm run lint          # Lint
npm run format        # Prettier check
npm run format:fix    # Prettier write
npm run db:studio     # Drizzle Studio (UI do banco)
npm run db:push       # Push schema Drizzle
npm run db:prod       # Seed dos dados
```

## Produção

### Stack de produção

| Serviço | Imagem | Função |
|---|---|---|
| `tunnel` | cloudflare/cloudflared:latest | Tunnel Cloudflare dedicado (conexão outbound) |
| `nginx` | nginx:1.27-alpine | Reverse proxy interno (porta 82) |
| `app` | Dockerfile.prod | Next.js buildado e servido com `next start` |
| `auth` | supabase/gotrue:v2.160.0 | Autenticação (GoTrue) |
| `db` | postgres:16-alpine | Banco de dados |

### Arquitetura de rede

```
Browser ──▶ Cloudflare Edge ──▶ tunnel ──▶ nginx:82 ──▶ app:3000
                                                        ──▶ auth:9999
                                                        ──▶ db:5432
```

### Deploy

1. No servidor, clone o repositório:

```bash
git clone https://github.com/bootstrapprx/aprova-mais.git
cd aprova-mais
```

2. Edite `.env.prod` com as credenciais, depois copie:

```bash
cp .env.prod .env
# Preencha CLOUDFLARE_TUNNEL_TOKEN com o token do tunnel
# Confira NGINX_PORT se 82 estiver ocupada
```

3. Execute o deploy:

```bash
bash scripts/deploy.sh
```

4. No **Zero Trust Dashboard**, no tunnel recém-criado, configure o **Public Hostname**:

| Campo | Valor |
|---|---|
| Subdomain | `aprova` |
| Domain | `kodoo.online` |
| Type | `HTTP` |
| URL | `http://nginx:82` |

### Comandos úteis

```bash
task prod-logs          # logs de toda stack
task prod-tunnel-logs   # logs só do tunnel
task prod-down          # derruba tudo
task prod-db            # psql no banco
task prod-seed          # seed manual
make prod-rebuild       # rebuild + restart
```

### Notas

- Nenhuma porta precisa ser aberta no host — o `cloudflared` faz apenas conexão **outbound** HTTPS para a Cloudflare
- O Service URL no dashboard é `http://nginx:82` porque o container `cloudflared` resolve `nginx` pelo DNS interno do Docker
- Se o tunnel cair, o container reinicia automaticamente (`restart: unless-stopped`)
- `GOTRUE_MAILER_AUTOCONFIRM=true` em dev; mude para `false` se quiser confirmação de email
- O JWT secret deve ser uma string de pelo menos 32 caracteres
- Para múltiplos admins, use IDs separados por `, ` em `SUPABASE_ADMIN_IDS`

## Licença

MIT
