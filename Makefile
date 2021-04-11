MEILI_HOST ?= http://127.0.0.1:7700
MEILI_PRIVATE_KEY ?= test

help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m## /[33m/'
.PHONY: help

##
## Site
## -----------------------------------------------------------------

setup: download ## Setup development environment
	@echo "+ $@"
	@npm install
.PHONY: setup

dev: ## Start development environment
	@echo "+ $@"
	@npm start
.PHONY: dev

build: ## Build site
	@echo "+ $@"
	@npm run prod
	@JEKYLL_ENV=production bundle exec jekyll build
.PHONY: build

deploy: build ## Upload site to S3
	@echo "+ $@"
	@aws s3 sync --exclude gifs _site s3://gifs.mlo.io
.PHONY: deploy

##
## gifs
## -----------------------------------------------------------------

download: ## Download gifs from S3
	@echo "+ $@"
	@aws s3 sync s3://gifs.mlo.io/gifs gifs
.PHONY: download

upload: ## Upload gifs to S3
	@echo "+ $@"
	@aws s3 sync --cache-control max-age=31536000 gifs s3://gifs.mlo.io/gifs
.PHONY: upload

index: ## Update index from gifs.json
	@echo "+ $@"
	@curl -X POST '$(MEILI_HOST)/indexes/gifs/documents' -H 'X-Meili-API-Key: $(MEILI_PRIVATE_KEY)' --data @gifs.json
.PHONY: index
