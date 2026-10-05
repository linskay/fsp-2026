@echo off
chcp 65001 > nul
echo =========================================================
echo    ФСП CAREER ARENA — БЫСТРЫЙ СТАРТ ПЛАТФОРМЫ (DOCKER)
echo =========================================================
echo.

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker не найден. Установите Docker Desktop для Windows.
    pause
    exit /b 1
)

echo [1/2] Загрузка готовых пакетов из GitHub Container Registry (ghcr.io)...
docker compose -f docker-compose.prod.yml pull
if %errorlevel% neq 0 (
    echo [WARN] Пакеты не найдены в GHCR, собираем локально...
    docker compose -f docker-compose.yml up --build -d
) else (
    echo [2/2] Запуск контейнеров платформы...
    docker compose -f docker-compose.prod.yml up -d
)

echo.
echo =========================================================
echo [OK] Платформа успешно запущена!
echo =========================================================
echo Frontend (Главная страница): http://localhost:3000
echo Backend REST API:            http://localhost:8080
echo Swagger UI документация:    http://localhost:8080/swagger-ui.html
echo PostgreSQL 16:               localhost:5432
echo =========================================================
echo.
pause
