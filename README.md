# FSP Career Arena («ФСП Карьерная Арена»)

**Цифровая платформа-агрегатор ИТ-вакансий с верифицированным профилем достижений Федерации спортивного программирования России (ФСП РФ)**

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
- **Интеграция с LeetCode GraphQL**: автоматический парсер условий, ограничений, тест-кейсов и стартовых сниппетов (Java, Python, C++, Go, JS).
- **Judge0 Code Sandbox**: безопасное изолированное исполнение и тестирование решений кандидатов на скрытых тест-кейсах.
- **LLM AI-Summary**: модуль автоматической генерации профиля кандидата (YandexGPT / GigaChat / OpenAI).
- **152-ФЗ РФ**: встроенная правовая интеграция с официальным [Положением об обработке ПДН ФСП РФ](https://fsp-russia.ru/files/Положение%20обработку%20пдн%20(1).pdf).

### ⚛️ Frontend
- **React 19**, **TypeScript**, **Tailwind CSS 4**
- **Monaco Editor (VS Code IDE)** для алгоритмического тестирования в песочнице.
- **Lucide Icons**, **Chart.js / SVG Dashboards** в киберспортивном стиле ФСП РФ (`fsp-russia.ru`).

### 🗄 База данных & Инфраструктура
- **PostgreSQL 16**
- **Docker** & **Docker Compose**

---

## 🚀 Быстрый запуск

### 1. Запуск всей системы через Docker Compose
```bash
docker-compose up --build
```
После запуска доступны:
- **Frontend веб-приложение:** `http://localhost:3000`
- **Backend API (Spring Boot):** `http://localhost:8080`
- **Swagger UI документация:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI v3 Docs:** `http://localhost:8080/v3/api-docs`

---

## 📁 Структура проекта

```
.
├── backend/                             # Java 21 / Spring Boot 3 Backend
│   ├── pom.xml                          # Maven зависимости (Spring Boot 3, JPA, Security, Flyway, etc.)
│   ├── Dockerfile                       # Multi-stage Dockerfile под Java 21 Alpine
│   └── src/
│       └── main/
│           ├── java/ru/fsp/careerarena/
│           │   ├── FspCareerArenaApplication.java
│           │   ├── config/              # SecurityConfig, OpenApiConfig, WebClientConfig
│           │   ├── controller/          # REST контроллеры (Candidates, Vacancies, LeetCode, Sandbox, AI)
│           │   ├── dto/                 # DTO и запросы валидации (CreateVacancy, CodeExecution, etc.)
│           │   ├── entity/              # JPA Entities (User, CandidateProfile, Vacancy, Task, etc.)
│           │   │   └── enums/           # FspRank, Grade, Specialization, SubmissionVerdict
│           │   ├── repository/          # Spring Data JPA репозитории
│           │   └── service/             # Бизнес-логика (LeetCode GraphQL, Judge0 Sandbox, AI-Summary)
│           └── resources/
│               ├── application.yml      # Конфигурация приложения
│               └── db/migration/        # Flyway SQL миграции
│                   ├── V1__init_schema.sql
│                   └── V2__seed_data.sql
│
├── src/                                 # Frontend SPA (React + TypeScript)
│   ├── components/
│   │   ├── arena/                       # Monaco Code Sandbox & LeetCode Import
│   │   ├── auth/                        # Spring Security OAuth2 Modal (GitHub, Yandex, HH)
│   │   ├── candidate/                   # Киберспортивный профиль ФСП, ELO, AI-Summary
│   │   ├── employer/                    # Управление вакансиями и импорт из hh.ru API
│   │   ├── architecture/                # Архитектурный хаб Spring Boot / PostgreSQL / Docker
│   │   └── swagger/                     # Встроенный Swagger UI Viewer
│   └── ...
├── docker-compose.yml                   # Мультиконтейнерная оркестрация (Postgres + Spring Boot + Frontend)
├── Dockerfile.frontend                  # Nginx + React build
└── README.md
```

---

## 🔐 152-ФЗ и согласие на обработку персональных данных
Платформа строго соблюдает Федеральный закон № 152-ФЗ «О персональных данных». Регистрация кандидатов и работодателей сопровождается согласием с прямой ссылкой на официальный документ ФСП РФ: [Положение об обработке ПДН](https://fsp-russia.ru/files/Положение%20обработку%20пдн%20(1).pdf).
