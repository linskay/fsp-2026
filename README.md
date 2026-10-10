# FSP Career Arena («ФСП Карьерная Арена»)

**Цифровая платформа-агрегатор ИТ-вакансий с обратной механикой найма и верифицированным профилем достижений Федерации спортивного программирования России (ФСП РФ)**

---

## 👥 Команда разработчиков
### **«NO PHP — NO PROBLEMS — 2026»**

*Разработка полнофункциональной цифровой платформы найма и алгоритмической верификации ИТ-кадров для Федерации спортивного программирования России (ФСП).*

---

## 🚀 Онлайн Демо (Live Demo 24/7)

Платформа развернута в облаке и доступна онлайн без необходимости локальной установки:
* 🌐 **Hugging Face Space:** **[https://huggingface.co/spaces/Linskay/demo-2026](https://huggingface.co/spaces/Linskay/demo-2026)**
* 🔗 **Прямой адрес стенда:** [https://linskay-demo-2026.hf.space](https://linskay-demo-2026.hf.space)

---

## ⚡ Быстрый старт на любом устройстве в 1 команду (Docker)

Все компоненты платформы упакованы в легковесные контейнеры.  
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

### 🐳 Или напрямую через Docker Compose:
```bash
docker compose up -d
```

---

## 🌐 Доступные локальные адреса:
* 💻 **Главный экран & UI платформы (Frontend):** **[http://localhost:3000](http://localhost:3000)** *(строго по http://)*
* ⚙️ **Backend REST API (Spring Boot 3):** [http://localhost:8080](http://localhost:8080)
* 📚 **Интерактивный Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* 📋 **OpenAPI v3 JSON спецификация:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
* 🗄 **База данных PostgreSQL 16:** `localhost:5432` (`fsp_career_db`)

---

## 🔐 Предопределенные тестовые учетные записи (Pre-seeded Accounts)

При первом старте база данных PostgreSQL **автоматически инициализируется миграцией Flyway** (`backend/src/main/resources/db/migration/V3__seed_test_users.sql`). В систему предзагружены демонстрационные аккаунты:

| Параметр | 👨‍💻 Кандидат (Соискатель / Спортсмен ФСП) | 🏢 Работодатель (IT-Компания / HR) |
|:---|:---|:---|
| **Логин (Email)** | `candidate@fsp.ru` | `employer@fsp.ru` |
| **Пароль** | `candidate2026` | `employer2026` |
| **ФИО / Контакт** | Иван Пестерев | Елена Романова (СберТех HR) |
| **Организация** | ФСП РФ / Независимый спортсмен | ПАО Сбербанк (СберТех) |
| **Роль в системе** | `CANDIDATE` | `EMPLOYER` |
| **Рейтинг / ELO** | 2540 ELO (1-й спортивный разряд) | Порог найма: от 2000 ELO |
| **Опыт / Вакансия** | 5 лет 1 месяц Java (с верификацией hh.ru) | Вакансия: *Senior Java / Highload Core Engineer* (350k–520k ₽) |
| **GitHub** | `@ipesterev` | `https://sbertech.ru` |

> 💡 **Быстрый вход и Регистрация:**
> * В окне входа доступны плашки **быстрого заполнения в 1 клик**.
> * Доступна полноценная **регистрация новых пользователей**: по Email/Паролю с выбором роли, а также быстрая регистрация через **GitHub** (с подтягиванием реальных открытых репозиториев, коммитов и аватара через GitHub API), **Яндекс ID** и **hh.ru**.

---

## ✨ Ключевые возможности платформы

1. **Обратная механика найма (Reverse Recruiting):**
   * Работодатели первыми откликаются на подтвержденные достижения спортсменов ФСП и направляют офферы с конкретной вилкой заработной платы.
   * Контакты соискателя скрыты до момента обоюдного согласия на оффер.

2. **Интерактивный двухсторонний Чат:**
   * Прямой диалог между соискателем и работодателем в реальном времени.
   * Возможность согласования условий, обсуждения оффера и назначения технических интервью.

3. **Интеграция с GitHub, HeadHunter и Яндекс:**
   * Автоматический парсинг открытой активности разработчика (коммиты за год, стек языков, репозитории).
   * Синхронизация резюме с hh.ru и верификация навыков.

4. **Алгоритмическая Арена ФСП:**
   * Встроенный веб-редактор кода с поддержкой автотестов.
   * Динамический пересчет спортивного рейтинга (ELO), разрядов и грейда соискателя по результатам решения задач.

5. **ИИ-портрет кандидата (AI Summary):**
   * Автоматическая генерация аналитического саммари разработчика на базе отечественных и мировых LLM (YandexGPT / GigaChat / Gemini / локальная Ollama).

6. **Соответствие 152-ФЗ РФ:**
   * Правовая интеграция с официальным [Положением об обработке ПДН ФСП РФ](https://fsp-russia.ru/files/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%BF%D0%B4%D0%BD%20(1).pdf).
   * Согласие пользователя при регистрации и маскирование персональных данных до принятия оффера.

---

## 🏗 Архитектура и Стек технологий

### ☕ Backend (Java 21 / Spring Boot 3)
* **Язык & Фреймворк:** Java 21 (LTS), Spring Boot 3.3.4
* **Модули:**
  * `Spring Web (MVC)`: REST API эндпоинты для кандидатов, работодателей, задач, вакансий и аутентификации.
  * `Spring Security 6` & `JWT`: сквозная авторизация, защита эндпоинтов и управление ролями (`CANDIDATE`, `EMPLOYER`).
  * `Spring Data JPA` & `Hibernate 6`: объектно-реляционное отображение и транзакционная работа с данными.
  * `Flyway DB`: версионированные миграции схемы PostgreSQL (`V1__init_schema.sql`, `V2__seed_data.sql`, `V3__seed_test_users.sql`).
  * `Springdoc OpenAPI (Swagger UI 3)`: интерактивная спецификация эндпоинтов.
  * `WebClient (Spring WebFlux)`: интеграции с внешними API.
* **Глобальная обработка ошибок (`GlobalExceptionHandler`):** Единый формат `ErrorResponse` для валидации (`@Valid`, `@NotNull`, `@Min`, `@Max`) и бизнес-исключений.

### ⚛️ Frontend (React 19 / TypeScript)
* **React 19**, **TypeScript**, **Tailwind CSS**, **Vite**
* **Lucide Icons**, **Canvas Confetti**, **Monaco Editor** для алгоритмических задач
* **Адаптивный интерфейс** в фирменном киберспортивном стиле Федерации спортивного программирования РФ.

### 🗄 База данных & Инфраструктура
* **PostgreSQL 16**
* **Docker** & **Docker Compose**
* **Nginx** (SPA routing & reverse proxy)
* **GitHub Container Registry (GHCR)** & **GitHub Actions CI/CD**

---

## 📁 Структура репозитория

```
.
├── .github/
│   └── workflows/               # CI/CD пайплайны GitHub Actions
├── backend/                     # Java 21 / Spring Boot 3 Backend
│   ├── pom.xml                  # Maven зависимости (Spring Boot 3, JPA, Security, Flyway, etc.)
│   ├── Dockerfile               # Multi-stage Dockerfile под Java 21 Alpine
│   └── src/
│       └── main/
│           ├── java/ru/fsp/careerarena/
│           │   ├── FspCareerArenaApplication.java
│           │   ├── config/      # SecurityConfig, OpenApiConfig, WebClientConfig
│           │   ├── controller/  # REST контроллеры (Auth, Candidates, Vacancies, AI)
│           │   ├── dto/         # DTO с валидацией (@NotNull, @Min, @Max, @Schema)
│           │   ├── entity/      # JPA сущности (User, CandidateProfile, Vacancy, etc.)
│           │   ├── exception/   # GlobalExceptionHandler & ErrorResponse
│           │   ├── repository/  # Spring Data JPA интерфейсы
│           │   └── service/     # Бизнес-логика, AuthService, CandidateService, AI
│           └── resources/
│               ├── application.yml      # Конфигурация Spring Boot
│               └── db/migration/        # Flyway миграции (V1 init, V2 seed, V3 test users)
├── src/                         # Frontend (React 19 + TypeScript + Tailwind)
│   ├── components/
│   │   ├── landing/             # Главный экран (Sport-Tech Landing Page)
│   │   ├── candidate/           # Дашборд кандидата & интеграции
│   │   ├── employer/            # Дашборд работодателя & вакансии
│   │   ├── arena/               # Алгоритмическая Арена
│   │   ├── auth/                # Модальные окна авторизации и OAuth2 интеграций
│   │   └── common/              # Общие компоненты и футер
│   ├── types/                   # TypeScript интерфейсы
│   └── services/                # API клиент (REST эндпоинты бэкенда)
├── docker-compose.yml           # Локальный запуск стека (Frontend + Backend + Postgres)
├── Dockerfile.frontend          # Multi-stage Dockerfile для Frontend Nginx
├── start.sh                     # Скрипт быстрого запуска для Linux/macOS
├── start.bat                    # Скрипт быстрого запуска для Windows
└── README.md                    # Документация проекта
```
