.PHONY: dev dev-down dev-logs \
        setup db-push db-seed db-studio \
        deploy prod-build prod-up prod-down prod-logs prod-rebuild prod-db prod-seed \
        lint lint-fix format format-fix

# ─── Desenvolvimento ───────────────────────────────────────────

dev:
	docker compose up -d

dev-down:
	docker compose down

dev-logs:
	docker compose logs -f

setup:
	bash scripts/setup.sh

db-push:
	docker compose exec app npx drizzle-kit push

db-seed:
	docker compose exec app npx tsx ./scripts/prod.ts

db-studio:
	docker compose exec app npx drizzle-kit studio

# ─── Produção ──────────────────────────────────────────────────

deploy:
	bash scripts/deploy.sh

prod-build:
	docker compose -f docker-compose.prod.yml build app

prod-up:
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

prod-rebuild:
	docker compose -f docker-compose.prod.yml up -d --build

prod-db:
	docker compose -f docker-compose.prod.yml exec db psql -U postgres -d aprova_mais

prod-seed:
	docker compose -f docker-compose.prod.yml exec app npx tsx ./scripts/prod.ts

prod-tunnel-logs:
	docker compose -f docker-compose.prod.yml logs -f tunnel

# ─── Qualidade ─────────────────────────────────────────────────

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

format-fix:
	npm run format:fix
