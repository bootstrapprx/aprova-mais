<a name="readme-top"></a>

# Aprova+ - Plataforma de estudos para concursos públicos

Plataforma para estudar para concursos públicos com simulados, questões de múltipla escolha, verdadeiro/falso, múltiplas respostas corretas e questões com texto de apoio. Inclui um jogo 3D interativo (Godot 4.7) com mapa de prédio, salas de questões, mundo aberto com POIs, grafos de conceitos e sistema de XP.

## Stack

| Camada | Tecnologia | Papel |
|--------|-----------|-------|
| **Frontend** | Next.js 16 + React 19 + Tailwind CSS + shadcn/ui | App web + admin |
| **Backend** | Next.js API Routes + Server Actions | API REST + sync |
| **Database** | PostgreSQL 16 via Docker (Supabase GoTrue) | Dados + auth |
| **ORM** | Drizzle ORM com driver `postgres` | Queries |
| **Admin** | React Admin (painel administrativo embutido) | Gestão de conteúdo |
| **Game** | Godot 4.7 (GDScript, Forward+) | Mundo 3D interativo |
| **Sync API** | `/api/sync/*` endpoints | Godot ↔ Next.js |
| **AI Map Gen** | Odoo AI Center + Next.js API | Geração automática de mapas 3D |

## Pré-requisitos

### Web App
- Docker e Docker Compose
- Node.js 24+
- NPM

### Jogo 3D (Godot)
- Godot 4.7+ ([download](https://godotengine.org/download))
- Blender 4.x (opcional, para assets 3D)
- Nenhuma conta ou API key necessária

## Configuração rápida

### 1. Web App

```bash
git clone https://github.com/bootstrapprx/aprova-mais.git
cd aprova-mais
cp .env.example .env.local
```

Configure `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/aprova_mais"
NEXT_PUBLIC_SUPABASE_URL=http://localhost:9999
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=http://auth:9999
SUPABASE_ANON_KEY=<mesma key do NEXT_PUBLIC_SUPABASE_ANON_KEY>
SUPABASE_ADMIN_IDS=""
```

```bash
docker compose up -d
npm install --legacy-peer-deps
npm run db:push
npm run db:prod
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 2. Jogo 3D (Godot)

```bash
# Abrir no Godot Editor
# File → Import → selecionar godot-app/project.godot
# Ou via terminal:
godot --editor --path godot-app/
```

Para rodar direto:
```bash
godot --path godot-app/
```

## Estrutura do projeto

```
aprova-mais/
├── app/
│   ├── (auth)/           # Sign-in/Sign-up (Supabase)
│   ├── (main)/           # Learn, Leaderboard, Shop, Quests
│   ├── (marketing)/      # Landing page
│   ├── admin/            # Painel React Admin
│   ├── api/
│   │   ├── courses/      # CRUD admin (react-admin)
│   │   ├── units/
│   │   ├── lessons/
│   │   ├── challenges/
│   │   ├── sync/         # ← API de sync Godot ↔ Next.js
│   │   │   ├── auth/     # POST: autenticação Godot
│   │   │   ├── courses/  # GET: exporta cursos aninhados
│   │   │   ├── map/      # GET: layout do mapa 3D
│   │   │   └── progress/ # GET/POST: progresso do aluno
│   │   ├── mapLayouts/   # CRUD admin de mapas 3D
│   │   │   ├── generate/ # POST: geração com IA (Odoo AI Center)
│   │   │   └── [courseId]/ # GET/PUT/DELETE
│   │   └── webhooks/
│   └── lesson/           # Quiz/ simulado
├── db/
│   ├── schema.ts         # Drizzle schema (7 tabelas)
│   ├── queries.ts        # Server-side queries
│   └── drizzle.ts        # Conexão DB
├── lib/
│   ├── sync-auth.ts      # Auth middleware para Godot
│   ├── supabase-server.ts
│   └── ...
├── godot-app/            # ← Jogo 3D (Godot 4.7)
│   ├── project.godot
│   ├── scenes/
│   │   ├── Main.tscn              # Menu principal + mundo 3D
│   │   ├── challenge/
│   │   │   ├── BuildingBoard.tscn # Tabuleiro de prédio
│   │   │   ├── ChallengeRoom.tscn # Sala de questão 3D
│   │   │   └── GraphScene.tscn   # Grafo de conceitos
│   │   ├── world/
│   │   │   └── OpenWorld.tscn    # Mundo aberto com POIs
│   │   └── fallbacks/
│   │       └── TreePlaceholder.tscn
│   ├── scripts/
│   │   ├── autoload/
│   │   │   ├── game_manager.gd    # Estado global + state machine
│   │   │   ├── data_manager.gd    # Load/save JSON + map layouts
│   │   │   ├── xp_manager.gd      # Sistema de XP e níveis
│   │   │   ├── audio_manager.gd   # Gerenciamento de áudio
│   │   │   └── asset_manager.gd   # Load .glb ou fallback procedural
│   │   ├── data/
│   │   │   ├── course_loader.gd   # Parse de JSON
│   │   │   └── api_sync.gd        # HTTP requests
│   │   ├── challenge/
│   │   │   ├── challenge_controller.gd  # Lógica de questões
│   │   │   └── building_board.gd        # Lógica do tabuleiro
│   │   ├── ui/
│   │   │   ├── open_world.gd      # Mundo aberto 3D
│   │   │   └── player_controller.gd # WASD + mouse
│   │   └── main.gd               # Entry point
│   ├── assets/
│   │   ├── models/               # .glb (Blender/Kenney)
│   │   │   ├── environment/      # trees, rocks, ground
│   │   │   ├── characters/       # player
│   │   │   └── props/            # bench, flag
│   │   ├── audio/
│   │   │   ├── sfx/              # .wav (correct, incorrect, click)
│   │   │   └── music/            # .ogg (menu_theme, world_theme)
│   │   ├── textures/
│   │   └── fonts/
│   ├── data/
│   │   └── courses.json          # Dados dos cursos (export)
│   └── export/
│       └── presets.cfg           # Web/Linux/Windows/Android
├── scripts/
│   ├── prod.ts            # Seed do banco
│   └── export_lessons_json.ts  # Export → courses.json
├── docker-compose.yml
└── Dockerfile.dev / Dockerfile.prod
```

## Schema do banco

| Tabela | Campos-chave |
|--------|-------------|
| **courses** | `id`, `title`, `imageSrc`, `banca`, `ano`, `orgao`, `active` |
| **units** | `id`, `courseId`, `title`, `description`, `order` |
| **lessons** | `id`, `unitId`, `title`, `order` |
| **challenges** | `id`, `lessonId`, `type`, `question`, `textoApoio`, `order` |
| **challengeOptions** | `id`, `challengeId`, `text`, `correct`, `imageSrc`, `audioSrc` |
| **challengeProgress** | `id`, `userId`, `challengeId`, `completed` (unique: userId+challengeId) |
| **userProgress** | `userId` (PK), `userName`, `points`, `activeCourseId` |

## Tipos de questão

| Tipo | Descrição | Sala 3D |
|------|-----------|---------|
| `SELECT` | Múltipla escolha, 1 correta | 4 botões, 1 acende verde |
| `TRUE_FALSE` | Verdadeiro ou Falso | 2 botões grandes |
| `MULTIPLE_CORRECT` | Múltiplas corretas (toggle) | Checkboxes 3D |
| `TEXT_PASSAGE` | Questão com texto de apoio | Painel lateral + botões |

## Fluxo do jogo 3D

```
Menu Principal
  ├── Selecionar Curso
  │     └── BuildingBoard (tabuleiro com andares)
  │           ├── Andar 1: Térreo (4 salas/aulas)
  │           ├── Andar 2: 1º andar
  │           └── ...
  │                 └── Clicar na sala
  │                       └── ChallengeRoom (questão 3D)
  │                             ├── Selecionar alternativa
  │                             ├── Feedback (partículas + som)
  │                             └── XP adicionado
  │                                   └── Próxima questão / Voltar ao tabuleiro
  ├── Explorar Mundo (OpenWorld)
  │     └── Mover com WASD, interagir com [E]
  │           └── Entrar em curso
  └── Ver Grafo (GraphScene)
        └── Nós de unidade/aula com cores de progresso
```

## Editando o conteúdo

### Criar curso no admin

1. Acesse `/admin` (precisa estar em `SUPABASE_ADMIN_IDS`)
2. **Courses** → Create → preencher título, banca, ano, órgão
3. **Units** → Create → selecionar o curso, adicionar matérias
4. **Lessons** → Create → selecionar unidade, adicionar tópicos
5. **Challenges** → Create → selecionar lição, criar questões
6. **Challenge Options** → Create → adicionar alternativas (marcar a correta)

### Exportar para o jogo

```bash
# Exportar dados do banco → godot-app/data/courses.json
npx tsx scripts/export_lessons_json.ts
```

### Editar mapas no Godot

1. Abrir `godot-app/` no Godot Editor
2. Editar `BuildingBoard.tscn` para layout do tabuleiro
3. Editar `ChallengeRoom.tscn` para design da sala
4. Adicionar assets 3D em `godot-app/assets/` (formato `.glb`)
5. Adicionar áudio em `godot-app/assets/audio/sfx/` (.wav) e `music/` (.ogg)

### Mapas 3D (Admin)

1. Acesse `/admin` → **Mapas 3D**
2. Criar layout manualmente ou usar **"Gerar Mapa com IA"**
3. A IA usa o Odoo AI Center para gerar positions de prédios, andares e salas
4. Layouts ficam salvos em `data/map_layouts/{courseId}.json`
5. O Godot carrega automaticamente via `DataManager.get_map_layout()`

### Adicionar novos tipos de questão

1. Criar tipo no admin: **Tipos de Questão** → Create
2. Código: `SELECT`, `TRUE_FALSE`, `MULTIPLE_CORRECT`, `TEXT_PASSAGE`
3. O jogo detecta automaticamente pelo campo `type` no JSON

## Comandos disponíveis

```bash
# Web App
npm run dev           # Servidor de desenvolvimento
npm run build         # Build de produção
npm run lint          # Lint
npm run format        # Prettier check
npm run format:fix    # Prettier write
npm run db:studio     # Drizzle Studio (UI do banco)
npm run db:push       # Push schema Drizzle
npm run db:prod       # Seed dos dados

# Export para Godot
npx tsx scripts/export_lessons_json.ts

# Godot (via terminal)
godot --path godot-app/                          # Rodar jogo
godot --editor --path godot-app/                 # Abrir editor
godot --headless --export-release "Linux" godot-app/build/game.x86_64  # Export Linux
```

## Produção

### Stack de produção

| Serviço | Imagem | Função |
|---------|--------|--------|
| `tunnel` | cloudflare/cloudflared:latest | Tunnel Cloudflare (outbound) |
| `nginx` | nginx:1.27-alpine | Reverse proxy (porta 82) |
| `app` | Dockerfile.prod | Next.js com `next start` |
| `auth` | supabase/gotrue:v2.160.0 | Autenticação |
| `db` | postgres:16-alpine | Banco de dados |

### Arquitetura de rede

```
Browser ──▶ Cloudflare Edge ──▶ tunnel ──▶ nginx:82 ──▶ app:3000
                                                        ──▶ auth:9999
                                                        ──▶ db:5432

Godot (3D) ──HTTP──▶ app:3000/api/sync/*
```

### Deploy web

1. No servidor:

```bash
git clone https://github.com/bootstrapprx/aprova-mais.git
cd aprova-mais
cp .env.prod .env
# Preencha CLOUDFLARE_TUNNEL_TOKEN
# Confira NGINX_PORT se 82 estiver ocupada
bash scripts/deploy.sh
```

2. No **Zero Trust Dashboard**, configure o **Public Hostname**:

| Campo | Valor |
|-------|-------|
| Subdomain | `aprova` |
| Domain | `kodoo.online` |
| Type | `HTTP` |
| URL | `http://nginx:82` |

### Deploy jogo 3D

#### Web (WASM)

```bash
# No Godot Editor:
# Project → Export → adicionar preset "Web"
# Export → Export Project → godot-app/build/web/

# Copiar para public/ do Next.js:
cp -r godot-app/build/web/ public/game/
```

#### Android (APK)

```bash
# No Godot Editor:
# Project → Export → adicionar preset "Android"
# Configurar keystore (debug ou release)
# Export → Export Project → godot-app/build/android/
```

#### Desktop (Linux/Windows/macOS)

```bash
# No Godot Editor:
# Project → Export → adicionar preset "Linux" ou "Windows"
# Export → Export Project → godot-app/build/
```

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

- Nenhuma porta precisa ser aberta no host — o `cloudflared` faz apenas conexão **outbound**
- O Service URL no dashboard é `http://nginx:82` (DNS interno do Docker)
- Se o tunnel cair, o container reinicia automaticamente (`restart: unless-stopped`)
- `GOTRUE_MAILER_AUTOCONFIRM=true` em dev; mude para `false` se quiser confirmação de email
- O JWT secret deve ter pelo menos 32 caracteres
- Para múltiplos admins, use IDs separados por `, ` em `SUPABASE_ADMIN_IDS`
- O jogo 3D consome `/api/sync/*` — esses endpoints precisam de auth (Bearer token)
- Para testar o sync localmente, o Godot deve apontar para `http://localhost:3000`

## Licença

MIT
