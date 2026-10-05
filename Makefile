.PHONY: up down pull logs build restart prod help

help:
	@echo "Команды для управления FSP Career Arena:"
	@echo "  make prod     - Запуск из готовых GitHub Packages (без сборки)"
	@echo "  make up       - Локальная сборка и запуск контейнеров"
	@echo "  make down     - Остановка всех контейнеров"
	@echo "  make pull     - Обновление Docker-образов из GitHub Registry"
	@echo "  make logs     - Просмотр логов бэкенда и фронтенда"
	@echo "  make restart  - Перезапуск сервисов"

prod:
	docker compose -f docker-compose.prod.yml up -d

up:
	docker compose up --build -d

down:
	docker compose down

pull:
	docker compose -f docker-compose.prod.yml pull

logs:
	docker compose logs -f

restart:
	docker compose restart
