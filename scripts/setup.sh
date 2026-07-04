#!/usr/bin/env bash
set -euo pipefail

PORTS=(3000 5432 5433 9999)
DB_HOST_PORT=5432

# Checks if a port is free on the host
port_free() {
  local port=$1
  ! ss -tlnp "sport = :$port" 2>/dev/null | grep -q LISTEN
}

# Check if the docker compose stack is already running
stack_running() {
  docker compose ps --services --filter "status=running" 2>/dev/null | grep -q . && \
  docker compose ps --services --filter "status=running" 2>/dev/null | wc -l | xargs echo | grep -q "^3$"
}

# Check if any port we need is already in use by our own stack
our_container_using_port() {
  local port=$1
  docker ps --format "{{.Names}} {{.Ports}}" 2>/dev/null | grep aprova-mais | grep -q ":$port->" || return 1
}

cd "$(dirname "$0")/.."

echo "=== Aprova+ Setup ==="

# Check if stack is already running
if stack_running; then
  echo "✓ Stack já está rodando."
  exit 0
fi

# Check if some containers are already up (partial)
running_services=$(docker compose ps --services --filter "status=running" 2>/dev/null | wc -l | tr -d ' ')
if [ "$running_services" -gt 0 ] && [ "$running_services" -lt 3 ]; then
  echo "! Stack está parcialmente rodando. Derrubando para reinício limpo..."
  docker compose down
fi

# Check db host port
if port_free 5432; then
  DB_HOST_PORT=5432
  echo "  Porta 5432: livre (usando padrão)"
elif port_free 5433; then
  DB_HOST_PORT=5433
  echo "  Porta 5432: ocupada → usando 5433"
else
  DB_HOST_PORT=5433
  echo "  Porta 5432 e 5433: ocupadas. Tentando 5433..."
fi

# Update docker-compose.yml with the chosen host port
# (only if the current mapping differs)
CURRENT_PORT=$(grep -oP 'ports: \["\K[0-9]+(?=:5432"\])' docker-compose.yml || echo "")
if [ "$CURRENT_PORT" != "$DB_HOST_PORT" ]; then
  echo "  Atualizando porta do db em docker-compose.yml..."
  sed -i "s/ports: \[\"$CURRENT_PORT:5432\"\]/ports: [\"$DB_HOST_PORT:5432\"]/" docker-compose.yml
fi

# Ensure .env.local exists from example
if [ ! -f .env.local ]; then
  if [ -f .env.example ]; then
    cp .env.example .env.local
    echo "  .env.local criado a partir de .env.example"
    # Fix the DATABASE_URL port in .env.local
    sed -i "s/localhost:5432/localhost:$DB_HOST_PORT/" .env.local
  fi
fi

# Start stack
echo ""
echo "Iniciando stack..."
docker compose up -d

# Ensure auth schema is created in postgres database (for GoTrue)
# and set search_path so GoTrue finds auth.* tables
echo ""
echo "Configurando banco..."
docker compose exec db psql -U postgres -d postgres -c "
  CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION postgres;
  ALTER DATABASE postgres SET search_path TO public, auth;
" 2>/dev/null || true

# Create aprova_mais database if not exists
docker compose exec db psql -U postgres -d postgres -c "CREATE DATABASE aprova_mais;" 2>/dev/null || true
docker compose exec db psql -U postgres -d aprova_mais -c "ALTER DATABASE aprova_mais SET search_path TO public, auth;" 2>/dev/null || true

# Also create the factor_type enum for GoTrue's MFA migration
docker compose exec db psql -U postgres -d postgres -c "
  DO \$\$
  BEGIN
    CREATE TYPE auth.factor_type AS ENUM ('totp', 'webauthn', 'phone');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END \$\$;
" 2>/dev/null || true

# Restart auth to pick up the search path change
docker compose restart auth 2>/dev/null

echo ""
echo "✓ Stack pronta!"
echo "  - App:       http://localhost:3000"
echo "  - DB (host): localhost:$DB_HOST_PORT"
