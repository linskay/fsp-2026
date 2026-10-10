# FSP Career Arena («ФСП Карьерная Арена»)

**Цифровая платформа-агрегатор ИТ-вакансий с верифицированным профилем достижений Федерации спортивного программирования России (ФСП РФ)**

---

## 🚀 Онлайн Демо (Live Demo 24/7)

Платформа развернута в облаке и доступна онлайн без необходимости локальной установки:
* 🔗 **Публичный адрес платформы:** **[https://linskay-demo-2026.hf.space](https://linskay-demo-2026.hf.space)**
* 🌐 **Hugging Face Space:** [https://huggingface.co/spaces/Linskay/demo-2026](https://huggingface.co/spaces/Linskay/demo-2026)

---

## ⚡ Быстрый старт на любом устройстве в 1 команду (GitHub Packages / Docker)

Все контейнеры упакованы и автоматически публикуются в **GitHub Container Registry (GHCR / GitHub Packages)**:
- `ghcr.io/linskay/fsp-2026/backend:latest` (Spring Boot 3 / Java 21 LTS)
- `ghcr.io/linskay/fsp-2026/frontend:latest` (React SPA + Nginx)

Вам **не нужно устанавливать** Java, Maven или Node.js — достаточно установленного Docker.

### 🐧 Linux / 🍏 macOS:
```bash
git clone https://github.com/linskay/fsp-2026.git
cd fsp-2026
./start.sh
```

### 🪟 Windows:
```cmd
git clone https://github.com/linskay/fsp-2026.git
cd fsp-2026
start.bat
```

### 🐳 Или напрямую через Docker Compose из готовых GitHub пакетов:
```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 🌐 Доступные адреса:
- 🚀 **Публичный стенд платформы (Live Demo 24/7):** [https://linskay-demo-2026.hf.space](https://linskay-demo-2026.hf.space)
- 💻 **Главный экран & UI платформы (Local Frontend):** [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend REST API (Spring Boot 3):** [http://localhost:8080](http://localhost:8080)
- 📚 **Интерактивный Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- 📋 **OpenAPI v3 JSON спецификация:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
- 🗄 **База данных PostgreSQL 16:** `localhost:5432` (`fsp_career_db`)

---

## 🔐 Предопределенные тестовые учетные записи (Pre-seeded Test Accounts)

Перед стартом приложения в базу данных PostgreSQL **автоматически миграцией Flyway** (`backend/src/main/resources/db/migration/V3__seed_test_users.sql`) всегда предзагружаются две учетные записи со всеми связанными профилями, навыками и вакансиями:

| Параметр | 👨‍💻 Кандидат (Соискатель / Спортсмен ФСП) | 🏢 Работодатель (IT-Компания / HR) |
|:---|:---|:---|
| **Логин (Email)** | `candidate@fsp.ru` | `employer@fsp.ru` |
| **Пароль** | `candidate2026` | `employer2026` |
| **ФИО / Контакт** | Иван Пестерев | Елена Романова (СберТех HR) |
| **Организация** | ФСП РФ / Независимый спортсмен | ПАО Сбербанк (СберТех) |
| **Роль в системе** | `CANDIDATE` | `EMPLOYER` |
| **Рейтинг / ELO** | 1200 ELO (честный старт) | Порог найма: от 2000 ELO (1-й разряд) |
| **Опыт / Вакансия** | 5 лет 1 месяц Java (с верификацией hh.ru) | Вакансия: *Senior Java / Highload Core Engineer* (350k–520k ₽) |
| **GitHub** | `@ipesterev` | `https://sbertech.ru` |

> 💡 **Удобство тестирования:** В шапке сайта (Navbar) и на главном экране размещена кнопка **«Войти»**, позволяющая авторизоваться как вручную, так и в **1 клик** по плашкам быстрого заполнения. Эндпоинт аутентификации бэкенда: `POST /api/v1/auth/login`.

---

## 🏗 Архитектура и Стек технологий

### ☕ Backend (Java 21 / Spring Boot 3)
- **Язык & Фреймворк:** Java 21 (LTS), Spring Boot 3.3.4
- **Модули:**
  - `Spring Web (MVC)`: REST API эндпоинты для кандидатов, работодателей, задач и вакансий.
  - `Spring Security 6` & `OAuth2 Client`: сквозная авторизация кандидатов и работодателей (GitHub, Яндекс ID, HeadHunter API).
  - `Spring Data JPA` & `Hibernate 6`: объектно-реляционное отображение сущностей.
  - `Flyway DB`: версионированные миграции схемы PostgreSQL (`V1__init_schema.sql`, `V2__seed_data.sql`).
  - `Springdoc OpenAPI (Swagger UI 3)`: интерактивная документация по адресу `/swagger-ui.html`.
  - `WebClient (Spring WebFlux)`: интеграция с LeetCode GraphQL API и Judge0 API песочницы.
- **Глобальная обработка ошибок (`GlobalExceptionHandler`):** Единый формат `ErrorResponse` для валидации (`@Valid`, `@NotNull`, `@Min`, `@Max`) и бизнес-ошибок.
- **Интеграция с LeetCode GraphQL**: автоматический парсер условий, ограничений, тест-кейсов и стартовых сниппетов (Java, Python, C++, Go, JS).
- **Judge0 Code Sandbox**: безопасное изолированное исполнение и тестирование решений кандидатов на скрытых тест-кейсах.
- **LLM AI-Summary**: модуль автоматической генерации профиля кандидата (YandexGPT / GigaChat / OpenAI).
- **152-ФЗ РФ**: встроенная правовая интеграция с официальным [Положением об обработке ПДН ФСП РФ](https://fsp-russia.ru/files/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%BF%D0%B4%D0%BD%20(1).pdf).

### ⚛️ Frontend
- **React 19**, **TypeScript**, **Tailwind CSS 4**
- **Главный экран (Landing Page):** Двойная точка входа для кандидатов и работодателей в стиле Sport-Tech ФСП РФ.
- **Monaco Editor (VS Code IDE)** для алгоритмического тестирования в песочнице.
- **Lucide Icons**, **Chart.js / SVG Dashboards** в киберспортивном стиле ФСП РФ (`fsp-russia.ru`).

### 🗄 База данных & Инфраструктура
- **PostgreSQL 16**
- **GitHub Packages (GHCR - GitHub Container Registry)**
- **GitHub Actions CI/CD (`.github/workflows/docker-publish.yml`)**
- **Docker** & **Docker Compose**

---

## 📁 Структура репозитория

```
.
├── .github/
│   └── workflows/
│       └── docker-publish.yml           # Автоматическая сборка и публикация пакетов в GHCR
├── backend/                             # Java 21 / Spring Boot 3 Backend
│   ├── pom.xml                          # Maven зависимости (Spring Boot 3, JPA, Security, Flyway, etc.)
│   ├── Dockerfile                       # Multi-stage Dockerfile под Java 21 Alpine
│   └── src/
│       └── main/
│           ├── java/ru/fsp/careerarena/
│           │   ├── FspCareerArenaApplication.java
│           │   ├── config/              # SecurityConfig, OpenApiConfig, WebClientConfig
│           │   ├── controller/          # REST контроллеры (Candidates, Vacancies, LeetCode, Sandbox, AI)
│           │   ├── dto/                 # DTO с валидацией (@NotNull, @Min, @Max, @Schema)
│           │   ├── entity/              # JPA сущности (User, Candidate, Vacancy, Task, etc.)
│           │   ├── exception/           # GlobalExceptionHandler & ErrorResponse
│           │   ├── repository/          # Spring Data JPA интерфейсы
│           │   └── service/             # Бизнес-логика, LeetCode parser, Judge0, AI-Summary
│           └── resources/
│               ├── application.yml      # Конфигурация Spring Boot
│               └── db/migration/        # Flyway миграции (V1 init, V2 seed)
├── src/                                 # Frontend (React 19 + TypeScript + Tailwind)
│   ├── components/
│   │   ├── landing/                     # Главный экран (Sport-Tech Landing Page)
│   │   ├── candidate/                   # Дашборд кандидата & AI Summary
│   │   ├── employer/                    # Дашборд работодателя & создание вакансий
│   │   ├── arena/                       # Monaco IDE песочница & LeetCode импортер
│   │   ├── swagger/                     # Интерактивный Swagger API UI
│   │   ├── architecture/                # Архитектурная схема
│   │   └── roadmap/                     # Презентация и роадмап
│   ├── types/                           # TypeScript интерфейсы
│   └── data/                            # Начальные данные
├── docker-compose.yml                   # Локальная сборка Docker
├── docker-compose.prod.yml              # Запуск из готовых GitHub Packages (ghcr.io)
├── Dockerfile.frontend                  # Multi-stage Dockerfile для Frontend Nginx
├── start.sh                             # Скрипт быстрого запуска для Linux/macOS
├── start.bat                            # Скрипт быстрого запуска для Windows
├── Makefile                             # Команды make prod / make up / make down
└── README.md
```
