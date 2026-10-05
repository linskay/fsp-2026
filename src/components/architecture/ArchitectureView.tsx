import React, { useState } from 'react';
import { 
  Layers, 
  Server, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Copy, 
  Check, 
  Code2, 
  Terminal, 
  CheckCircle2, 
  Boxes, 
  Zap, 
  FileCode,
  HardDrive
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'docker' | 'db' | 'spring'>('diagram');
  const [copied, setCopied] = useState(false);

  const dockerComposeCode = `version: '3.8'

services:
  # 1. PostgreSQL 16 Relational DB
  postgres:
    image: postgres:16-alpine
    container_name: fsp-postgres
    environment:
      POSTGRES_DB: fsp_career_db
      POSTGRES_USER: fsp_admin
      POSTGRES_PASSWORD: fsp_secret_password_2026
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U fsp_admin -d fsp_career_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  # 2. Redis Cache & Grade Cooldowns
  redis:
    image: redis:7.2-alpine
    container_name: fsp-redis
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes

  # 3. Keycloak 24 (ФСП SSO Realm & 152-FZ Consent Vault)
  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    container_name: fsp-keycloak-sso
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin_secret_fsp
    command: start-dev
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy

  # 4. Judge0 Code Sandbox API Engine
  judge0-server:
    image: judge0/judge0:v1.14.0
    container_name: fsp-judge0-server
    ports:
      - "2358:2358"
    privileged: true
    environment:
      REDIS_HOST: redis
      POSTGRES_HOST: postgres
    depends_on:
      - postgres
      - redis

  # 5. Spring Boot 3 Backend Service (Java 21)
  backend-api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: fsp-backend-api
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/fsp_career_db
      SPRING_DATASOURCE_USERNAME: fsp_admin
      SPRING_DATASOURCE_PASSWORD: fsp_secret_password_2026
      SPRING_REDIS_HOST: redis
      KEYCLOAK_AUTH_SERVER_URL: http://keycloak:8080
      JUDGE0_API_URL: http://judge0-server:2358
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

volumes:
  postgres_data:
`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Архитектура & Технологический стек платформы
            </h1>
            <p className="text-xs text-slate-300">
              Производственная микросервисная архитектура: <strong>Java 21 / Spring Boot 3 + PostgreSQL + Keycloak + Judge0 Sandbox</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold font-mono">
            Docker Compose Ready
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('diagram')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'diagram' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Архитектурная схема</span>
        </button>

        <button
          onClick={() => setActiveTab('docker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'docker' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Docker Compose (1-Click Run)</span>
        </button>

        <button
          onClick={() => setActiveTab('spring')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'spring' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Spring Boot 3 Модули</span>
        </button>

        <button
          onClick={() => setActiveTab('db')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'db' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Схема PostgreSQL & Flyway</span>
        </button>
      </div>

      {/* Tab 1: Interactive Diagram */}
      {activeTab === 'diagram' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Frontend Tier */}
            <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">1. Frontend Layer</h3>
                  <p className="text-[11px] text-slate-400">React 19 / TypeScript / Vite</p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Reverse Hiring UX & Kanban</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Интерактивная IDE в браузере</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>152-ФЗ Маскирование контактов</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Explainable Match визуализация</span>
                </li>
              </ul>
            </div>

            {/* Backend Tier */}
            <div className="bg-[#0f172a] rounded-3xl border border-purple-900/40 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">2. Backend Core</h3>
                  <p className="text-[11px] text-slate-400">Java 21 + Spring Boot 3</p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Spring Security 6 + JWT OAuth2</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Keycloak SSO Realm интеграция</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Judge0 Client (Docker Sandbox)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>FSP Match Scoring Engine</span>
                </li>
              </ul>
            </div>

            {/* Storage & Sandbox */}
            <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">3. Data & Isolation</h3>
                  <p className="text-[11px] text-slate-400">Postgres 16 + Redis + Judge0</p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PostgreSQL + Flyway миграции</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Redis для кулдауна (3 мес)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Judge0 Изоляция памяти и CPU</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>152-ФЗ Consent Audit Vault</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Reverse Hiring Event Loop */}
          <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Сквозной процесс обратного найма (Reverse Hiring Workflow):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-center font-mono">
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="text-blue-400 font-bold">1. Решение задач</div>
                <p className="text-[10px] text-slate-400 font-sans mt-1">Кандидат решает задачи ФСП в Judge0 IDE и получает грейд</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="text-purple-400 font-bold">2. Ранжирование</div>
                <p className="text-[10px] text-slate-400 font-sans mt-1">Работодатель видит анонимизированный топ с разбором матча</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="text-yellow-400 font-bold">3. Оффер с вилкой ₽</div>
                <p className="text-[10px] text-slate-400 font-sans mt-1">Компания отправляет конкретную сумму в рамках вилки</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-2xl border border-emerald-900/50">
                <div className="text-emerald-400 font-bold">4. Раскрытие 152-ФЗ</div>
                <p className="text-[10px] text-slate-400 font-sans mt-1">Кандидат жмет «Принять», контакты демаскируются в ATS</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Docker Compose */}
      {activeTab === 'docker' && (
        <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                docker-compose.yml (Запуск локального окружения в 1 команду)
              </h3>
              <p className="text-xs text-slate-400">
                Поднимает PostgreSQL 16, Redis, Keycloak 24, Judge0 Sandbox и Spring Boot бэкенд
              </p>
            </div>
            <button
              onClick={() => handleCopy(dockerComposeCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
            </button>
          </div>

          <pre className="bg-[#090d16] p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
            {dockerComposeCode}
          </pre>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
            $ docker compose up -d
          </div>
        </div>
      )}

      {/* Tab 3: Spring Boot 3 */}
      {activeTab === 'spring' && (
        <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">
            Структура пакетов Spring Boot 3 (Clean Architecture):
          </h3>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-purple-300 space-y-1">
            <p>src/main/java/ru/fsp/arena/</p>
            <p className="pl-4">├── config/ (SecurityConfig, KeycloakOidcConfig, Judge0ClientConfig, SwaggerConfig)</p>
            <p className="pl-4">├── controller/ (AuthController, CandidateController, VacancyController, InvitationController, SandboxController)</p>
            <p className="pl-4">├── domain/ (Candidate, Employer, Vacancy, Invitation, AlgorithmTask, Submission, ConsentLog)</p>
            <p className="pl-4">├── repository/ (CandidateRepository, VacancyRepository, InvitationRepository)</p>
            <p className="pl-4">├── service/ (MatchingEngineService, Judge0ExecutionService, FspVerificationService, PrivacyService)</p>
            <p className="pl-4">└── dto/ (CandidateRankedResponse, SendOfferRequest, SandboxExecutionResult)</p>
          </div>
        </div>
      )}

      {/* Tab 4: DB Schema */}
      {activeTab === 'db' && (
        <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">
            Flyway Миграции PostgreSQL (V1__init_fsp_schema.sql):
          </h3>
          <pre className="bg-[#090d16] p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
{`-- Таблица кандидатов с рейтингом ФСП и привязками OAuth2
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    fsp_id VARCHAR(64) UNIQUE,
    fsp_rank VARCHAR(64),
    fsp_rating INT NOT NULL DEFAULT 1200,
    current_grade VARCHAR(32) NOT NULL,
    github_login VARCHAR(128),
    github_repos_count INT DEFAULT 0,
    hh_resume_id VARCHAR(64),
    phone_masked VARCHAR(64),
    phone_real VARCHAR(64),
    telegram_real VARCHAR(64),
    last_tested_at TIMESTAMP,
    can_retake_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT TRUE
);

-- Таблица вакансий с обязательной вилкой в рублях
CREATE TABLE vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES employers(id),
    title VARCHAR(255) NOT NULL,
    salary_min_rub INT NOT NULL,
    salary_max_rub INT NOT NULL,
    CONSTRAINT chk_salary_fork CHECK (salary_max_rub >= salary_min_rub),
    specialization VARCHAR(64) NOT NULL,
    grade_required VARCHAR(32) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);`}
          </pre>
        </div>
      )}

      {/* Tab 5: Spring Security OAuth2 Configuration */}
      {activeTab === 'spring' && (
        <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Spring Security 6 & OAuth2 Client Configuration (SecurityConfig.java)
              </h3>
              <p className="text-xs text-slate-400">
                Интеграция GitHub, HeadHunter API v1 и Яндекс ID с автоматическим обогащением профиля
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
              Java 21 / Spring Boot 3.3
            </span>
          </div>

          <pre className="bg-[#090d16] p-4 rounded-2xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
{`@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, 
                                           CustomOAuth2UserService oauth2Service,
                                           OAuth2AuthenticationSuccessHandler successHandler) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/public/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers("/api/v1/employer/**").hasRole("EMPLOYER")
                .requestMatchers("/api/v1/candidate/**").hasRole("CANDIDATE")
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(oauth2Service))
                .successHandler(successHandler)
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
}

/**
 * Обработчик успешной OAuth2 авторизации:
 * - При входе через GitHub -> опрашивает GitHub API v3, извлекает коммиты и репозитории
 * - При входе через hh.ru  -> загружает резюме (/resumes/mine), парсит стаж и стек
 * - При входе через Яндекс -> валидирует почту и верифицирует статус
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    // Автоматическая гидратация портфолио в транзакции PostgreSQL
}`}
          </pre>
        </div>
      )}

    </div>
  );
};
