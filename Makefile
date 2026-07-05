.PHONY: dev dev-down dev-logs \
        setup db-push db-seed db-studio \
        deploy prod-build prod-up prod-down prod-logs prod-rebuild prod-db prod-seed \
        prod-update prod-full-update \
        lint lint-fix format format-fix \
        mobile-init mobile-sync mobile-build-android mobile-build-ios \
        mobile-open-android mobile-open-ios mobile-dev-android mobile-dev-ios

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

# ─── Atualização Completa de Produção ──────────────────────────

prod-update: confirm
	git pull
	docker compose -f docker-compose.prod.yml build app
	docker compose -f docker-compose.prod.yml up -d --remove-orphans
	@echo "Aguardando app iniciar..."
	@sleep 15
	docker compose -f docker-compose.prod.yml exec -T app npx drizzle-kit push || true
	@echo ""
	@echo "✓ Atualização concluída! Acesse https://aprova.kodoo.online"

prod-full-update: confirm
	git pull
	docker compose -f docker-compose.prod.yml down --remove-orphans
	docker compose -f docker-compose.prod.yml build app
	docker compose -f docker-compose.prod.yml up -d
	@echo "Aguardando serviços iniciarem..."
	@sleep 20
	docker compose -f docker-compose.prod.yml exec -T app npx drizzle-kit push || true
	docker compose -f docker-compose.prod.yml exec -T app npx tsx ./scripts/prod.ts || true
	@echo ""
	@echo "✓ Atualização total concluída! Acesse https://aprova.kodoo.online"

confirm:
	@echo "╔════════════════════════════════════════════╗"
	@echo "║  ATUALIZAÇÃO TOTAL DE PRODUÇÃO            ║"
	@echo "╠════════════════════════════════════════════╣"
	@echo "║  • Aplicação: aprova.kodoo.online          ║"
	@echo "║  • Docker Compose: docker-compose.prod.yml ║"
	@echo "╚════════════════════════════════════════════╝"
	@echo ""
	@read -p "Confirmar atualização? (Enter para continuar, Ctrl+C para cancelar)"

# ─── Qualidade ─────────────────────────────────────────────────

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

format-fix:
	npm run format:fix

# ─── Mobile (Capacitor) ──────────────────────────────────────────

mobile-init:
	npm run mobile:init

mobile-sync:
	npm run mobile:sync

mobile-open-android:
	npm run mobile:open:android

mobile-open-ios:
	npm run mobile:open:ios

mobile-dev-android:
	npm run mobile:dev:android

mobile-dev-ios:
	npm run mobile:dev:ios

mobile-build-android:
	bash scripts/mobile-build-android.sh debug

mobile-build-android-release:
	bash scripts/mobile-build-android.sh release

mobile-build-ios:
	bash scripts/mobile-build-ios.sh debug

mobile-build-ios-release:
	bash scripts/mobile-build-ios.sh release
