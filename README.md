# ФСП Карьерная Арена (FSP Career Arena)

Платформа обратного найма ИТ-специалистов с официальной верификацией спортивных достижений и ELO-рейтинга Федерации спортивного программирования России (ФСП РФ).

[![Status](https://img.shields.io/badge/Status-Production_Ready-emerald?style=flat-square)](https://huggingface.co/spaces/Linskay/demo-2026)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Hugging_Face-0284c7?style=flat-square)](https://huggingface.co/spaces/Linskay/demo-2026)
[![OpenAPI / Swagger](https://img.shields.io/badge/OpenAPI_3.0-Swagger_UI-059669?style=flat-square)](https://linskay-demo-2026.hf.space/swagger)
[![Java](https://img.shields.io/badge/Java-21_LTS-f97316?style=flat-square)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-65a30d?style=flat-square)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0-38bdf8?style=flat-square)](https://react.dev/)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.0_Compose-7c3aed?style=flat-square)](https://kotlinlang.org/)
[![Android APK](https://img.shields.io/badge/Android-APK_Download-3ddc84?style=flat-square&logo=android&logoColor=white)](https://github.com/linskay/fsp-2026/releases/latest)
[![152--FZ](https://img.shields.io/badge/Compliance-152--FZ_PDN-blue?style=flat-square)](docs/MANIFEST.md#53-соответствие-152-фз-о-персональных-данных)

---

## Демонстрационные стенды (Live Demo)

- **Облачный веб-стенд платформы (24/7):** [https://huggingface.co/spaces/Linskay/demo-2026](https://huggingface.co/spaces/Linskay/demo-2026)
- **Прямой адрес веб-интерфейса:** [https://linskay-demo-2026.hf.space](https://linskay-demo-2026.hf.space)
- **Интерактивная документация (GitHub Pages):** [https://linskay.github.io/fsp-2026/](https://linskay.github.io/fsp-2026/)
- **Интерактивная API спецификация (Swagger UI):** [https://linskay-demo-2026.hf.space/swagger](https://linskay-demo-2026.hf.space/swagger)
- **Мобильное Android-приложение (APK):** [Скачать в GitHub Releases](https://github.com/linskay/fsp-2026/releases/latest) *(прямая ссылка: [fsp-career-arena.apk](https://linskay.github.io/fsp-2026/fsp-career-arena.apk))*

---

## 📸 Галерея интерфейса (Screenshots)

| 🏠 Главная страница (Обратный найм) | 🏅 Личный кабинет атлета (Паспорт ФСП) |
| :---: | :---: |
| [![Главная страница](docs/images/landing_preview.png)](docs/images/landing_preview.png) | [![Кабинет кандидата](docs/images/candidate_dashboard.png)](docs/images/candidate_dashboard.png) |
| *Модель Reverse Recruiting и прямой коннект к Spring Boot 3* | *ELO 1420 pts, разряды ЕВСК, LeetCode, GitHub и AI-портрет* |

| 💻 Интерактивная Code Arena IDE | 🏢 Дашборд работодателя («Слепой» наем) |
| :---: | :---: |
| [![Code Arena](docs/images/code_arena.png)](docs/images/code_arena.png) | [![Панель работодателя](docs/images/employer_dashboard.png)](docs/images/employer_dashboard.png) |
| *Monaco Editor, запуск тестов Judge0, подсказки и вердикты* | *ATS-поиск по ELO, Zero-Bias режим «Слепого» найма, 152-ФЗ* |

---

## Быстрый старт (Quick Start за 10 секунд)

Требуется только **Docker 24+** и **Docker Compose v2+**. Установка Java, Maven и Node.js на хост-систему не требуется.

### Linux / macOS
```bash
git clone https://github.com/linskay/fsp-2026.git
cd fsp-2026
./start.sh
```

### Windows (CMD / PowerShell)
```cmd
git clone https://github.com/linskay/fsp-2026.git
cd fsp-2026
start.bat
```

### Универсальный прямой запуск
```bash
docker compose up -d
```

Интерфейс доступен по адресу: **[http://localhost:3000](http://localhost:3000)**

---

## Тестовые доступы (Pre-seeded Accounts)

В базе данных предзаполнены аккаунты с подтверждёнными спортивными профилями и вакансиями. В модальном окне авторизации доступны кнопки **быстрого входа в 1 клик**.

| Роль | Email | Пароль | ФИО / Организация | Доступный функционал |
| :--- | :--- | :--- | :--- | :--- |
| **Соискатель** (`CANDIDATE`) | `candidate@fsp.ru` | `candidate2026` | Иван Пестерев (КМС по СП, ELO 2480) | Дашборд атлета, отклики с вилками ₽, Алгоритмическая Арена, паспорт ФСП |
| **Работодатель** (`EMPLOYER`) | `employer@fsp.ru` | `employer2026` | Елена Романова (ПАО СберБанк) | ATS-поиск по ELO, «Слепой» наем, отправка офферов, веб-хуки интеграций |

---

## Экосистема проекта

- **Web Frontend:** React 19, TypeScript, Tailwind CSS, Monaco Code Editor, Framer Motion animations. Порт: `3000`.
- **Backend Core:** Java 21 LTS, Kotlin 2.0, Spring Boot 3.3.4, Spring Security 6 (JWT stateless), Flyway Migrations (V1–V10). Порт: `8080`.
- **Mobile Client:** Android Native (Kotlin 2.0, Jetpack Compose, Material 3, MVVM + Coroutines/StateFlow).
- **База данных:** PostgreSQL 16 Alpine, пул соединений HikariCP, строгая реляционная схема с аудитом безопасности. Порт: `5432`.
- **Песочница тестирования кода:** Judge0 CE + Docker cgroups v2, seccomp профилирование, сетевая изоляция `--net=none`.
- **AI Мультимодельный скоринг:** Strategy паттерн с поддержкой Gemini Flash, YandexGPT Pro, OpenRouter, Ollama.
- **Интеграционная шина:** Асинхронные исходящие веб-хуки с криптографической подписью HMAC-SHA256 (`X-FSP-Signature`).

---

## Проектная документация (Манифест & Mintlify)

Полная техническая документация с компонентными схемами, детальным описанием алгоритма ELO-ранжирования, защитой от утечки тестов, ролевой моделью и соответствием 152-ФЗ РФ представлена в следующих форматах:

- **Интерактивный веб-портал документации (GitHub Pages):** [https://linskay.github.io/fsp-2026/](https://linskay.github.io/fsp-2026/) *(зеркало на HF: [https://linskay-demo-2026.hf.space/docs/](https://linskay-demo-2026.hf.space/docs/), локально: [http://localhost:3000/docs/](http://localhost:3000/docs/))*
- **Официальный релизный PDF (на русском языке):** [docs/MANIFEST.pdf](docs/MANIFEST.pdf)
- **Исходный Манифест (Markdown):** [docs/MANIFEST.md](docs/MANIFEST.md)

[![Скачать Манифест в PDF](https://img.shields.io/badge/📥_Скачать_Манифест_в_PDF-docs%2FMANIFEST.pdf-0369a1?style=for-the-badge)](docs/MANIFEST.pdf)

### 🌿 Поддержка Mintlify CLI & Mintlify Cloud
Каталог [`docs/`](docs/) полностью соответствует стандарту **Mintlify** (`docs/mint.json` + MDX-страницы):
- **Локальный предпросмотр через Mintlify CLI**:
  ```bash
  cd docs
  npx mintlify dev
  ```
- **Облачное развертывание на Mintlify.com**:
  При подключении репозитория к сервису [Mintlify](https://mintlify.com), документация автоматически компилируется и хостится на вашем поддомене.

Дополнительные разделы документации:
- [Архитектурный обзор и безопасность](docs/architecture/overview.mdx)
- [Полная спецификация REST API (все 9 групп эндпоинтов)](docs/api-reference/endpoints.mdx)
- [Спецификация мобильного клиента Android](docs/architecture/mobile.mdx)
- [Спецификация бэкенда и микромодулей](docs/architecture/backend.mdx)

---

## Локальные интерфейсы после запуска

| Сервис | Назначение | Адрес |
| :--- | :--- | :--- |
| **Карьерная Арена Web** | Веб-интерфейс соискателя и работодателя | [http://localhost:3000](http://localhost:3000) |
| **Backend REST API** | Базовый API шлюз | [http://localhost:8080/api/v1](http://localhost:8080/api/v1) |
| **Swagger UI** | Интерактивное тестирование эндпоинтов | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) |
| **OpenAPI Schema** | Машиночитаемая спецификация v3 | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) |
| **PostgreSQL** | Реляционная СУБД (`fsp_career_db`) | `localhost:5432` |

---

## Команда разработки

### «NO PHP — NO PROBLEMS — 2026»

- **Архитектура & Backend:** Spring Boot 3, Java 21, Kotlin 2.0, PostgreSQL 16, Flyway, JWT, 152-ФЗ, Webhooks
- **Frontend & UX/UI:** React 19, TypeScript, Monaco IDE, Tailwind CSS, Explainable Matching, Blind Hiring
- **Mobile Development:** Kotlin 2.0, Android Jetpack Compose, Material 3, Clean Architecture
- **DevOps & QA:** Docker Compose, GitHub Actions CI/CD, Judge0 Sandbox, Multi-LLM Synthesis
