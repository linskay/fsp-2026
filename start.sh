#!/bin/bash
# ==============================================================================
# FSP Career Arena: Quick Start Script for Linux & macOS
# Downloads pre-built GitHub Packages and launches the full stack in Docker
# ==============================================================================

set -e

echo "========================================================="
echo "   ФСП CAREER ARENA — БЫСТРЫЙ СТАРТ ПЛАТФОРМЫ (DOCKER)   "
echo "========================================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Ошибка: Docker не установлен. Установите Docker Desktop или docker-ce."
    exit 1
fi

echo "📦 1. Загрузка готовых пакетов из GitHub Packages (ghcr.io)..."
if docker compose -f docker-compose.prod.yml pull; then
    echo "✅ Пакеты успешно загружены из GitHub Registry!"
    echo "🚀 2. Запуск контейнеров (PostgreSQL 16 + Spring Boot 3 + React)..."
    docker compose -f docker-compose.prod.yml up -d
else
    echo "⚠️ Пакеты еще не опубликованы в GHCR, собираем локально через Docker Compose..."
    docker compose -f docker-compose.yml up --build -d
fi

echo ""
echo "========================================================="
echo "🎉 Платформа успешно запущена и готова к работе!"
echo "========================================================="
echo "🌐 Главная страница (Frontend): http://localhost:3000"
echo "⚙️ Backend REST API:             http://localhost:8080"
echo "📚 Swagger / OpenAPI UI:         http://localhost:8080/swagger-ui.html"
echo "🗄️ База данных PostgreSQL:      localhost:5432 (fsp_career_db)"
echo "========================================================="
echo ""
echo "Для остановки выполните: docker compose -f docker-compose.prod.yml down"
