#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Aprova+ Deploy ==="

# --- Validações ---
if [ ! -f .env ]; then
  echo "! Arquivo .env não encontrado."
  echo "  Crie a partir de .env.prod: cp .env.prod .env"
  exit 1
fi

if ! command -v docker &>/dev/null; then
  echo "! Docker não encontrado. Instale: https://docs.docker.com/engine/install/"
  exit 1
fi

if ! docker compose version &>/dev/null; then
  echo "! Docker Compose não encontrado."
  exit 1
fi

COMPOSE_FILE="docker-compose.prod.yml"
COMPOSE="docker compose -f $COMPOSE_FILE"

# --- Build ---
echo ""
echo "1. Construindo imagem da aplicação..."
$COMPOSE build app

# --- Deploy do banco primeiro ---
echo ""
echo "2. Iniciando banco de dados..."
$COMPOSE up -d db
echo "   Aguardando db ficar saudável..."
$COMPOSE exec db sh -c "
  until pg_isready -U postgres; do
    sleep 1
  done
  echo '  db pronto'
"

echo ""
echo "3. Garantindo que o banco aprova_mais existe..."
$COMPOSE exec -T db psql -U postgres -d postgres \
  -c "SELECT 'CREATE DATABASE aprova_mais' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'aprova_mais')\gexec" 2>/dev/null || {
  $COMPOSE exec -T db psql -U postgres -c "CREATE DATABASE aprova_mais;" 2>/dev/null || true
}

# --- Deploy do resto ---
echo ""
echo "4. Iniciando auth, app e nginx..."
$COMPOSE up -d auth app nginx

echo ""
echo "5. Aguardando inicialização..."
sleep 10

echo ""
echo "6. Rodando push do schema..."
$COMPOSE exec -T app npx drizzle-kit push && echo "   schema ok" || {
  echo "   ! Schema push falhou. Execute manualmente:"
  echo "     $COMPOSE exec app npx drizzle-kit push"
}

echo ""
echo "7. Rodando seed..."
$COMPOSE exec -T app npx tsx ./scripts/prod.ts && echo "   seed ok" || {
  echo "   ! Seed falhou. Execute manualmente:"
  echo "     $COMPOSE exec app npx tsx ./scripts/prod.ts"
}

echo ""
echo "=== Deploy concluído! ==="
echo ""
echo "Stack pronta. Adicione no global nginx (host) para não cair no Meridian:"
echo ""
echo "  server {"
echo "      listen 80;"
echo "      server_name aprova.kodoo.online;"
echo ""
echo "      location / {"
echo "          proxy_pass http://localhost:82;"
echo "          proxy_set_header Host \$host;"
echo "          proxy_set_header X-Real-IP \$remote_addr;"
echo "          proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
echo "          proxy_set_header X-Forwarded-Proto \$scheme;"
echo "      }"
echo "  }"
echo ""
echo "Logs: $COMPOSE logs -f"
echo "Parar: $COMPOSE down"
