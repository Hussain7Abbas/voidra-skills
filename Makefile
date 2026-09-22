ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help

BLUE := $(shell printf '\033[34m')
GREEN := $(shell printf '\033[32m')
YELLOW := $(shell printf '\033[33m')
RESET := $(shell printf '\033[0m')

SKILL ?=
REMOTE ?= origin
BRANCH ?= main
DRY_RUN ?= 0
export SKILL REMOTE BRANCH DRY_RUN

.PHONY: help setup list validate skills-config check test discover publish

help:
	@echo ""
	@echo "$(BLUE)Development$(RESET)"
	@echo "  $(GREEN)setup$(RESET)      Install pinned tooling with $(YELLOW)npm ci$(RESET)"
	@echo "  $(GREEN)list$(RESET)       List repository skills"
	@echo "  $(GREEN)validate$(RESET)   Validate all skills, or $(YELLOW)SKILL=init$(RESET)"
	@echo "  $(GREEN)skills-config$(RESET) Validate $(YELLOW)skills.sh.json$(RESET) and grouped skill slugs"
	@echo "  $(GREEN)test$(RESET)       Test validation and publishing with local Git remotes"
	@echo "  $(GREEN)check$(RESET)      Validate skills and run tests"
	@echo "  $(GREEN)discover$(RESET)   Confirm the skills CLI discovers this repository"
	@echo ""
	@echo "$(BLUE)Publishing$(RESET)"
	@echo "  $(GREEN)publish$(RESET)    Push one committed skill: $(YELLOW)make publish SKILL=init$(RESET)"
	@echo "             Preview with $(YELLOW)DRY_RUN=1$(RESET); defaults: $(YELLOW)REMOTE=origin BRANCH=main$(RESET)"
	@echo "             First-time GitHub setup: $(YELLOW)docs/publishing.md$(RESET)"
	@echo ""

setup:
	@cd "$(ROOT)" && npm ci

list:
	@cd "$(ROOT)" && node scripts/skills.mjs list

validate:
	@cd "$(ROOT)" && node scripts/skills.mjs validate

skills-config:
	@cd "$(ROOT)" && node scripts/skills-config.ts

test:
	@cd "$(ROOT)" && npm test

check: validate skills-config test

discover:
	@cd "$(ROOT)" && DISABLE_TELEMETRY=1 ./node_modules/.bin/skills add . --list

publish:
	@cd "$(ROOT)" && node scripts/skills.mjs publish
