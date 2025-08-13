up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

build:
	docker compose up -d --build

clear-cache:
	@docker compose exec app php artisan config:clear
	@docker compose exec app php artisan route:clear
	@docker compose exec app php artisan optimize:clear


migrate:
	@docker compose exec app php artisan migrate

migrate-fresh:
	@docker compose exec app php artisan migrate:fresh --seed


composer_install:
	@docker compose exec app composer install

run_command:
	@docker compose exec app $(ARGS)
