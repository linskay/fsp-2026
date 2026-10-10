<p align="center">
  <img src="docs/logo/fsp-logo.png" alt="FSP Career Arena" width="120" />
</p>

<h1 align="center">🏟 ФСП Карьерная Арена</h1>

<p align="center">
  <b>Цифровая платформа обратного найма ИТ-специалистов с верификацией достижений Федерации спортивного программирования России (ФСП РФ)</b>
</p>

<p align="center">
  <a href="https://huggingface.co/spaces/Linskay/demo-2026"><img src="https://img.shields.io/badge/🌐_Live_Demo-Hugging_Face-blue?style=for-the-badge" alt="Live Demo" /></a>
  <a href="https://linskay-demo-2026.hf.space/swagger"><img src="https://img.shields.io/badge/📚_Swagger-API_Docs-green?style=for-the-badge" alt="Swagger" /></a>
  <a href="docs/MANIFEST.md"><img src="https://img.shields.io/badge/📋_Манифест-Документация-orange?style=for-the-badge" alt="Manifest" /></a>
</p>

---

## 📸 Интерфейс платформы (Реальные скриншоты)

### 🌐 Главная страница (Sport-Tech Landing)
![Главная страница ФСП Карьерная Арена](docs/images/landing_preview.png)

### 👨‍💻 Дашборд соискателя (Верификация ФСП, ELO 2540, Офферы)
![Дашборд соискателя](docs/images/candidate_dashboard.png)

### 🏢 Панель работодателя (ATS-поиск, ELO-фильтрация и офферы)
![Панель работодателя](docs/images/employer_dashboard.png)

### 🏟 Интерактивная Алгоритмическая Арена (Monaco IDE, LeetCode, ELO)
![Интерактивная Алгоритмическая Арена](docs/images/code_arena.png)

---

## 🚀 Live Demo (Облачный стенд 24/7)

| Ресурс | Ссылка |
|:---|:---|
| 🌐 **Hugging Face Space** | **[https://huggingface.co/spaces/Linskay/demo-2026](https://huggingface.co/spaces/Linskay/demo-2026)** |
| 🔗 **Прямой адрес стенда** | [https://linskay-demo-2026.hf.space](https://linskay-demo-2026.hf.space) |
| 📚 **Swagger API** | [https://linskay-demo-2026.hf.space/swagger-ui.html](https://linskay-demo-2026.hf.space/swagger-ui.html) |

---

## ⚡ Quick Start — запуск в 1 команду

> **Требуется:** Docker 24+ и Docker Compose v2+. Java, Maven и Node.js **не нужны**.

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

### 🐳 Или напрямую:
```bash
docker compose up -d
```

**Готово!** Откройте [http://localhost:3000](http://localhost:3000)

---

## 🔐 Тестовые доступы (Pre-seeded)

| | 👨‍💻 Кандидат | 🏢 Работодатель |
|:---|:---|:---|
| **Email** | `candidate@fsp.ru` | `employer@fsp.ru` |
| **Пароль** | `candidate2026` | `employer2026` |
| **ФИО** | Иван Пестерев | Елена Романова (СберТех HR) |
| **Роль** | `CANDIDATE` | `EMPLOYER` |

> 💡 В окне входа доступны **плашки быстрого заполнения в 1 клик**. Также работает регистрация через **GitHub**, **Яндекс ID** и **hh.ru**.

---

## 🏗 Экосистема проекта

| Компонент | Технологии | Порт |
|:---|:---|:---|
| ⚛️ **Web Frontend** | React 19, TypeScript 7, Tailwind CSS 4, Vite 8, Monaco Editor | `3000` |
| ☕ **Backend API** | Java 21, Kotlin 2.0, Spring Boot 3.3.4, Spring Security 6, Flyway | `8080` |
| 📱 **Mobile App** | Kotlin 2.0, Jetpack Compose, Material 3, MVVM + StateFlow | Android |
| 🗄 **База данных** | PostgreSQL 16 Alpine | `5432` |
| 🤖 **AI/LLM** | Gemini Flash, OpenRouter, YandexGPT, Ollama | — |
| 🔒 **Sandbox** | Judge0 CE, Docker cgroups v2, seccomp, `--net=none` | — |

---

## ✨ Ключевые возможности

- 🔄 **Обратный найм** — работодатели первыми откликаются на спортсменов ФСП и отправляют офферы с вилкой ₽
- 🏟 **Алгоритмическая Арена** — веб-IDE с автотестами, динамический пересчёт ELO (7 уровней от Квалификации до Гроссмейстера)
- 🤖 **ИИ-портрет кандидата** — автоматическая генерация аналитики по LLM (YandexGPT / Gemini / Ollama)
- 🔗 **Интеграции** — GitHub, HeadHunter, Яндекс ID, LeetCode (живой импорт через GraphQL)
- 🛡 **Антифрод-песочница** — изолированное выполнение кода (Docker `--net=none`, cgroups, seccomp)
- 📝 **Идемпотентность API** — защита от дублирования офферов (RFC 7231 / Idempotency-Key)
- 🔒 **152-ФЗ** — маскирование контактов до принятия оффера, журнал аудита безопасности
- 💬 **Двусторонний чат** — диалог между соискателем и работодателем в реальном времени

---

## 📚 Документация

> 📋 Подробную архитектурную документацию, алгоритмы ранжирования, спецификацию API, схемы безопасности и инструкции по развёртыванию см. в **[сопроводительном документе (Манифест)](docs/MANIFEST.md)**.

| Документ | Описание |
|:---|:---|
| [📋 `docs/MANIFEST.md`](docs/MANIFEST.md) | Полная проектная документация (архитектура, ELO, API, 152-ФЗ, деплой) |
| [🏗 `ARCHITECTURE.md`](ARCHITECTURE.md) | Манифест безопасности и антифрод-система |
| [📚 Swagger UI](http://localhost:8080/swagger-ui.html) | Интерактивная API документация |
| [📄 OpenAPI v3 JSON](http://localhost:8080/v3/api-docs) | Машинная спецификация API |

### 📥 Скачать документацию в PDF

Для экспорта Манифеста в PDF выполните:

```bash
# Вариант 1: через npx (Node.js)
npx md-to-pdf docs/MANIFEST.md --dest docs/MANIFEST.pdf

# Вариант 2: через pandoc
pandoc docs/MANIFEST.md -o docs/MANIFEST.pdf --pdf-engine=xelatex -V mainfont="DejaVu Sans"

# Вариант 3: VS Code → Ctrl+Shift+P → "Markdown: Export to PDF"
```

---

## 📁 Структура репозитория

```
.
├── .github/workflows/          # CI/CD пайплайны GitHub Actions
├── backend/                    # Java 21 & Kotlin 2.0 / Spring Boot 3 Backend
│   ├── pom.xml                 # Maven (Java + Kotlin смешанная компиляция)
│   ├── Dockerfile              # Multi-stage Dockerfile (Java 21 Alpine)
│   └── src/main/
│       ├── java/ru/fsp/        # Java сервисы, сущности, контроллеры
│       ├── kotlin/ru/fsp/      # Kotlin Data Classes, Mobile API
│       └── resources/          # application.yml, миграции Flyway (V1..V9)
├── mobile/                     # Android-приложение (Kotlin + Jetpack Compose)
│   └── app/                    # Экраны: Профиль, Чат, Арена
├── scripts/                    # Автоматизация (bootstrap_mobile.py, convert_to_kotlin.py)
├── src/                        # Frontend (React 19 + TypeScript + Tailwind)
│   ├── components/
│   │   ├── arena/              # Алгоритмическая Арена (CodeArenaIDE)
│   │   ├── candidate/          # Дашборд кандидата
│   │   ├── employer/           # Дашборд работодателя
│   │   ├── auth/               # Авторизация и OAuth2
│   │   └── landing/            # Главная страница
│   ├── services/api.ts         # REST API клиент
│   ├── types/index.ts          # TypeScript интерфейсы
│   └── utils/ratingEngine.ts   # Движок ELO-рейтинга ФСП
├── docs/                       # 📋 Проектная документация
│   ├── MANIFEST.md             # Полный Манифест проекта
│   └── images/                 # 📸 Реальные скриншоты интерфейса
├── docker-compose.yml          # Локальный запуск (Frontend + Backend + Postgres + Ollama)
├── docker-compose.prod.yml     # Production (GHCR образы)
├── Dockerfile.frontend         # Multi-stage Dockerfile (Vite → Nginx)
├── start.sh / start.bat        # Скрипты быстрого запуска
└── README.md                   # ← Вы здесь
```

---

## 🌐 Локальные адреса после запуска

| Сервис | URL |
|:---|:---|
| 💻 **Frontend (UI)** | [http://localhost:3000](http://localhost:3000) |
| ⚙️ **Backend API** | [http://localhost:8080](http://localhost:8080) |
| 📚 **Swagger UI** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) |
| 📋 **OpenAPI JSON** | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) |
| 🗄 **PostgreSQL** | `localhost:5432` (БД: `fsp_career_db`) |

---

## 👥 Команда разработчиков

### «NO PHP — NO PROBLEMS — 2026»

| Зона | Описание |
|:---|:---|
| 🏗 **Архитектура & Backend** | Spring Boot 3, PostgreSQL 16, Flyway, Kotlin 2.0 + Java 21, JWT, 152-ФЗ |
| ⚛️ **Frontend & UX/UI** | React 19 + Vite, Code Arena IDE, GitHub API, OAuth2 |
| 📱 **Mobile (Android)** | Kotlin 2.0, Jetpack Compose, Material 3, MVVM + StateFlow |
| ☁️ **DevOps & AI** | GitHub Actions CI/CD, мульти-LLM скоринг, Hugging Face |

---

<p align="center">
  <b>«NO PHP — NO PROBLEMS — 2026»</b> — создаём цифровое будущее спортивного программирования России! 🇷🇺
</p>
