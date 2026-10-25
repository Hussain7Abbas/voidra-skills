# KIOS Scan — local setup & run (uses bun)
# Run `make help` for targets.

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
ECOSYSTEM := ecosystem.config.cjs

.DEFAULT_GOAL := help

.PHONY: help install setup env \
	dev build start \
	lint typecheck clean sync \
	pm2-start pm2-stop pm2-restart pm2-reload pm2-delete pm2-logs pm2-status pm2-deploy \
	nginx-setup nginx-reload nginx-test deploy

help: # Show this help
	@awk 'BEGIN {FS = ": *#+ *"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z0-9_-]+( +[a-zA-Z0-9_-]+)*: *#/ { gsub(/ +/, ", ", $$1); printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

install: # Install dependencies (bun install)
	@cd "$(ROOT)" && bun install

env: # Create .env from .env.example if missing
	@test -f "$(ROOT)/.env.example" || (echo "Missing .env.example" && exit 1)
	@if [[ ! -f "$(ROOT)/.env" ]]; then \
		cp "$(ROOT)/.env.example" "$(ROOT)/.env"; \
		echo "Created .env from .env.example — edit secrets before running."; \
	else \
		echo ".env already exists (left unchanged)."; \
	fi

setup: # Install deps + create .env if missing
	@$(MAKE) install env
	@echo ""
	@echo "Next steps:"
	@echo "  1. Edit .env (NEXT_MISTRAL_API_KEY, APP_DOMAIN, PORT, CERTBOT_EMAIL)"
	@echo "  2. make dev"
	@echo ""

dev: # Next.js dev server (bun run dev, Turbopack)
	@$(MAKE) stop-conflicting-dev
	@cd "$(ROOT)" && bun run dev

stop-conflicting-dev:
	@for port in 3000 3001 3002 3003; do \
		pid=$$(lsof -ti:$$port 2>/dev/null || true); \
		if [[ -n "$$pid" ]]; then \
			cmd=$$(ps -p $$pid -o comm= 2>/dev/null || true); \
			if [[ "$$cmd" == *node* || "$$cmd" == *bun* ]]; then \
				echo "Stopping process on port $$port (pid $$pid)"; \
				kill $$pid 2>/dev/null || true; \
			fi; \
		fi; \
	done

build: # Production build (next build)
	@cd "$(ROOT)" && bun run build

start: # Run production build (next start)
	@cd "$(ROOT)" && bun run start

pm2-start: # pm2 start ecosystem.config.cjs
	@test -f "$(ROOT)/$(ECOSYSTEM)" || (echo "Missing $(ECOSYSTEM)" && exit 1)
	@cd "$(ROOT)" && pm2 start $(ECOSYSTEM)

pm2-stop: # pm2 stop ecosystem.config.cjs
	@cd "$(ROOT)" && pm2 stop $(ECOSYSTEM)

pm2-restart: # pm2 restart ecosystem.config.cjs
	@cd "$(ROOT)" && pm2 restart $(ECOSYSTEM)

pm2-reload: # pm2 reload ecosystem.config.cjs (graceful where supported)
	@cd "$(ROOT)" && pm2 reload $(ECOSYSTEM)

pm2-delete: # pm2 delete ecosystem.config.cjs
	@cd "$(ROOT)" && pm2 delete $(ECOSYSTEM)

pm2-logs: # pm2 logs (all apps)
	@cd "$(ROOT)" && pm2 logs

pm2-status: # pm2 status
	@cd "$(ROOT)" && pm2 status

pm2-deploy: # build + pm2 with PORT sync + health check
	@$(MAKE) build
	@cd "$(ROOT)" && bun run scripts/pm2-deploy.ts

deploy: # build + pm2 (PORT from .env) + nginx-setup
	@cd "$(ROOT)" && bun run scripts/deploy.ts

sync: # git pull + install + build + pm2 restart
	@cd "$(ROOT)" && git pull
	@cd "$(ROOT)" && bun install
	@cd "$(ROOT)" && bun run build
	@cd "$(ROOT)" && pm2 restart $(ECOSYSTEM)

nginx-setup: # nginx config + certbot HTTPS when CERTBOT_EMAIL is set
	@cd "$(ROOT)" && bun run scripts/nginx-setup.ts

nginx-test: # Validate nginx config (sudo)
	@cd "$(ROOT)" && bun run scripts/nginx-test.ts

nginx-reload: # Reload nginx after config changes (sudo)
	@cd "$(ROOT)" && bun run scripts/nginx-reload.ts

lint: # Run next lint
	@cd "$(ROOT)" && bun run lint

typecheck: # Type check (tsc --noEmit)
	@cd "$(ROOT)" && bunx tsc --noEmit

clean: # Remove .next and build cache
	rm -rf "$(ROOT)/.next" "$(ROOT)/node_modules/.cache"
