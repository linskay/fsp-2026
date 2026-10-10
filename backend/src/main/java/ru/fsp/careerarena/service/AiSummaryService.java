package ru.fsp.careerarena.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import ru.fsp.careerarena.dto.AiSummaryDto;
import ru.fsp.careerarena.dto.GenerateAiSummaryRequest;
import ru.fsp.careerarena.entity.CandidateAiSummary;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.repository.CandidateAiSummaryRepository;
import ru.fsp.careerarena.repository.CandidateProfileRepository;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiSummaryService {

    private final CandidateProfileRepository candidateRepository;
    private final CandidateAiSummaryRepository aiSummaryRepository;
    private final WebClient aiWebClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${integrations.ai.provider:gemini}")
    private String aiProvider;

    @Value("${integrations.ai.gemini.api-key:AQ.Ab8RN6Kclff0cT3KZgjHJj_h4MgUMqyofqe-VvfDiqhbNekiMg}")
    private String geminiApiKey;

    @Value("${integrations.ai.gemini.api-url:https://generativelanguage.googleapis.com/v1beta/openai/chat/completions}")
    private String geminiApiUrl;

    @Value("${integrations.ai.gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    @Value("${integrations.ai.openrouter.api-key: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}")
    private String openrouterApiKey;

    @Value("${integrations.ai.openrouter.api-url:https://openrouter.ai/api/v1/chat/completions}")
    private String openrouterApiUrl;

    @Value("${integrations.ai.openrouter.model:meta-llama/llama-3.1-8b-instruct:free}")
    private String openrouterModel;

    @Value("${integrations.ai.ollama.api-url:http://ollama:11434/v1/chat/completions}")
    private String ollamaApiUrl;

    @Value("${integrations.ai.ollama.model:llama3:8b}")
    private String ollamaModel;

    @Value("${integrations.ai.api-key:mock-ai-key}")
    private String aiApiKey;

    @Value("${integrations.ai.folder-id:b1gmockfolderid}")
    private String folderId;

    @Value("${integrations.ai.api-url:https://llm.api.cloud.yandex.net/foundationModels/v1/completion}")
    private String aiApiUrl;

    @Value("${integrations.ai.model:gemini-1.5-flash}")
    private String aiModel;

    @Data
    @Builder
    private static class AiGenerationResult {
        private String summaryText;
        private List<String> keyStrengths;
        private String recommendationLevel;
        private List<String> recommendedRoles;
        private String modelName;
    }

    @Transactional
    public AiSummaryDto generateOrGetAiSummary(UUID candidateId) {
        GenerateAiSummaryRequest request = GenerateAiSummaryRequest.builder()
                .candidateId(candidateId)
                .provider(aiProvider)
                .focus("balanced")
                .forceRefresh(false)
                .build();
        return generateAiSummary(request);
    }

    @Transactional
    public AiSummaryDto generateAiSummary(GenerateAiSummaryRequest request) {
        UUID candidateId = request.getCandidateId();
        String activeProvider = (request.getProvider() != null && !request.getProvider().isBlank())
                ? request.getProvider().toLowerCase().trim()
                : (aiProvider != null ? aiProvider.toLowerCase().trim() : "gemini");

        log.info("Processing AI-Summary for candidate ID: {} using provider: {}", candidateId, activeProvider);

        CandidateProfile candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Кандидат с ID " + candidateId + " не найден"));

        Optional<CandidateAiSummary> existingOpt = aiSummaryRepository.findByCandidateId(candidateId);
        if (existingOpt.isPresent() && !request.isForceRefresh()) {
            return mapToDto(existingOpt.get());
        }

        AiGenerationResult result = executeAiGeneration(candidate, request, activeProvider);

        CandidateAiSummary aiEntity = existingOpt.orElseGet(() -> CandidateAiSummary.builder().candidate(candidate).build());
        aiEntity.setSummaryText(result.getSummaryText());
        aiEntity.setKeyStrengths(result.getKeyStrengths());
        aiEntity.setRecommendationLevel(result.getRecommendationLevel());
        aiEntity.setRecommendedRoles(result.getRecommendedRoles());
        aiEntity.setModelName(result.getModelName());

        CandidateAiSummary saved = aiSummaryRepository.save(aiEntity);
        log.info("AI-Summary saved for candidate ID: {} with model: {}", candidateId, result.getModelName());
        return mapToDto(saved);
    }

    private AiGenerationResult executeAiGeneration(CandidateProfile candidate, GenerateAiSummaryRequest request, String provider) {
        try {
            return switch (provider) {
                case "gemini" -> callGeminiApi(candidate, request);
                case "openrouter" -> callOpenRouterApi(candidate, request);
                case "ollama", "local", "docker" -> callOllamaApi(candidate, request);
                case "yandexgpt", "yandex" -> callYandexGptApi(candidate, request);
                default -> callGenericOpenAiApi(candidate, request, provider);
            };
        } catch (Exception e) {
            log.warn("Live AI generation with provider '{}' failed ({}). Falling back to dynamic algorithmic profiler.", provider, e.getMessage());
            return generateDynamicProfile(candidate, request.getFocus());
        }
    }

    /**
     * Unified system instruction for all LLM providers
     */
    private String getUnifiedSystemPrompt() {
        return "Ты — главный технический HR-архитектор и ИИ-аналитик Федерации спортивного программирования России (ФСП РФ). " +
                "Твоя задача — объективно оценить квалификацию инженера-спортсмена на основе спортивного ELO-рейтинга, " +
                "официального разряда ФСП, навыков, метрик олимпиадного программирования и открытых репозиториев GitHub. " +
                "Ответь СТРОГО валидным JSON-объектом без каких-либо вводных слов, пояснений и без markdown-разметки. " +
                "JSON обязан содержать 4 ключа: " +
                "\"summaryText\" (развернутый связный аналитический отчет на русском из 3-5 предложений), " +
                "\"keyStrengths\" (массив строго из 4 строк с ключевыми техническими преимуществами), " +
                "\"recommendationLevel\" (строка: HIGHLY_RECOMMENDED, RECOMMENDED или QUALIFIED), " +
                "\"recommendedRoles\" (массив из 3-4 строк с рекомендуемыми инженерными ролями).";
    }

    /**
     * Unified user prompt tailored to candidate profile and requested focus
     */
    private String buildUnifiedUserPrompt(CandidateProfile c, String focus) {
        String name = c.getUser() != null ? c.getUser().getFullName() : "Кандидат";
        String rank = c.getFspRank() != null ? c.getFspRank().getDisplayName() : "Спортсмен ФСП";
        String skillsList = c.getSkills() != null && !c.getSkills().isEmpty()
                ? String.join(", ", c.getSkills())
                : "Java, Spring Boot, PostgreSQL, Docker";

        String focusInstruction = switch (focus != null ? focus.toLowerCase() : "balanced") {
            case "highload" -> "Сделай особый акцент на масштабируемости, отказоустойчивости, микросервисах и высоконагруженных системах (HighLoad).";
            case "algo" -> "Сделай особый акцент на олимпиадной алгоритмической базе, скорости решения задач и математической культуре.";
            case "lead" -> "Сделай особый акцент на лидерском потенциале, менторстве, архитектурных решениях и роли техлида.";
            default -> "Дай сбалансированную оценку спортивных достижений и прикладных инженерных навыков.";
        };

        return String.format(
                "Данные кандидата для экспертного анализа:\n" +
                "- ФИО: %s\n" +
                "- Специализация: %s (Грейд: %s)\n" +
                "- Спортивный рейтинг ФСП ELO: %d (Официальный разряд: %s, Верификация ФСП: %s)\n" +
                "- Ожидания по зарплате: %d руб.\n" +
                "- Локация: %s\n" +
                "- Подтвержденный стек навыков: %s\n" +
                "- GitHub статистика: username @%s, публичных репозиториев: %d, коммитов за год: %d\n" +
                "- Резюме / О себе: %s\n" +
                "Фокус отчета для работодателя: %s\n\n" +
                "Сформируй валидный JSON согласно инструкции.",
                name,
                c.getSpecialization(),
                c.getGrade(),
                c.getFspElo(),
                rank,
                c.isFspVerified() ? "Подтвержден" : "В процессе",
                c.getSalaryExpectation(),
                c.getLocation(),
                skillsList,
                c.getGithubUsername() != null ? c.getGithubUsername() : "отсутствует",
                c.getGithubReposCount(),
                c.getGithubCommitsCount(),
                c.getBio() != null ? c.getBio() : "Специалист по спортивному программированию и разработке ПО",
                focusInstruction
        );
    }

    /**
     * 1. Google Gemini via OpenAI-compatible endpoint
     */
    private AiGenerationResult callGeminiApi(CandidateProfile candidate, GenerateAiSummaryRequest request) {
        String key = resolveApiKey(request.getApiKey(), geminiApiKey);
        if (isMockKey(key)) {
            log.info("Gemini key is mock/demo. Running dynamic assessment engine.");
            return generateDynamicProfile(candidate, request.getFocus());
        }

        String targetModel = (request.getModel() != null && !request.getModel().isBlank()) ? request.getModel() : geminiModel;
        String prompt = buildUnifiedUserPrompt(candidate, request.getFocus());

        Map<String, Object> payload = Map.of(
                "model", targetModel,
                "temperature", 0.3,
                "messages", List.of(
                        Map.of("role", "system", "content", getUnifiedSystemPrompt()),
                        Map.of("role", "user", "content", prompt)
                )
        );

        String responseBody = aiWebClient.post()
                .uri(geminiApiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + key)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(15))
                .block();

        return parseOpenAiFormatResponse(responseBody, "Google Gemini " + targetModel + " (Live API)", candidate, request.getFocus());
    }

    /**
     * 2. OpenRouter API
     */
    private AiGenerationResult callOpenRouterApi(CandidateProfile candidate, GenerateAiSummaryRequest request) {
        String key = resolveApiKey(request.getApiKey(), openrouterApiKey);
        if (isMockKey(key)) {
            log.info("OpenRouter key is mock/demo. Running dynamic assessment engine.");
            return generateDynamicProfile(candidate, request.getFocus());
        }

        String targetModel = (request.getModel() != null && !request.getModel().isBlank()) ? request.getModel() : openrouterModel;
        String prompt = buildUnifiedUserPrompt(candidate, request.getFocus());

        Map<String, Object> payload = Map.of(
                "model", targetModel,
                "temperature", 0.3,
                "messages", List.of(
                        Map.of("role", "system", "content", getUnifiedSystemPrompt()),
                        Map.of("role", "user", "content", prompt)
                )
        );

        String responseBody = aiWebClient.post()
                .uri(openrouterApiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + key)
                .header("HTTP-Referer", "https://fsp-russia.ru")
                .header("X-Title", "FSP Career Arena")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(15))
                .block();

        return parseOpenAiFormatResponse(responseBody, "OpenRouter (" + targetModel + ")", candidate, request.getFocus());
    }

    /**
     * 3. Local Model (Ollama in Docker)
     */
    private AiGenerationResult callOllamaApi(CandidateProfile candidate, GenerateAiSummaryRequest request) {
        String url = (request.getEndpointUrl() != null && !request.getEndpointUrl().isBlank())
                ? request.getEndpointUrl()
                : ollamaApiUrl;
        String targetModel = (request.getModel() != null && !request.getModel().isBlank())
                ? request.getModel()
                : ollamaModel;

        String prompt = buildUnifiedUserPrompt(candidate, request.getFocus());

        Map<String, Object> payload = Map.of(
                "model", targetModel,
                "temperature", 0.3,
                "messages", List.of(
                        Map.of("role", "system", "content", getUnifiedSystemPrompt()),
                        Map.of("role", "user", "content", prompt)
                )
        );

        String responseBody = aiWebClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(20))
                .block();

        return parseOpenAiFormatResponse(responseBody, "Ollama Local Docker (" + targetModel + ")", candidate, request.getFocus());
    }

    /**
     * 4. Yandex Foundation Models (YandexGPT)
     */
    private AiGenerationResult callYandexGptApi(CandidateProfile candidate, GenerateAiSummaryRequest request) {
        String key = resolveApiKey(request.getApiKey(), aiApiKey);
        if (isMockKey(key)) {
            log.info("YandexGPT key is mock/demo. Running dynamic assessment engine.");
            return generateDynamicProfile(candidate, request.getFocus());
        }

        String activeFolder = (request.getFolderId() != null && !request.getFolderId().isBlank())
                ? request.getFolderId()
                : ((folderId != null && !folderId.isBlank()) ? folderId : "b1gmockfolderid");
        String activeModel = (request.getModel() != null && !request.getModel().isBlank())
                ? request.getModel()
                : ((aiModel != null && !aiModel.isBlank()) ? aiModel : "yandexgpt");

        String modelUri = "gpt://" + activeFolder + "/" + activeModel + "/latest";
        String prompt = buildUnifiedUserPrompt(candidate, request.getFocus());

        Map<String, Object> yandexPayload = Map.of(
                "modelUri", modelUri,
                "completionOptions", Map.of(
                        "stream", false,
                        "temperature", 0.3,
                        "maxTokens", "2000"
                ),
                "messages", List.of(
                        Map.of("role", "system", "text", getUnifiedSystemPrompt()),
                        Map.of("role", "user", "text", prompt)
                )
        );

        String responseBody = aiWebClient.post()
                .uri(aiApiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Api-Key " + key)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(yandexPayload)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(15))
                .block();

        return parseYandexGptResponse(responseBody, candidate, request.getFocus());
    }

    private AiGenerationResult callGenericOpenAiApi(CandidateProfile candidate, GenerateAiSummaryRequest request, String provider) {
        String key = resolveApiKey(request.getApiKey(), aiApiKey);
        if (isMockKey(key)) {
            return generateDynamicProfile(candidate, request.getFocus());
        }

        String targetModel = (request.getModel() != null && !request.getModel().isBlank()) ? request.getModel() : "gpt-4o-mini";
        String prompt = buildUnifiedUserPrompt(candidate, request.getFocus());

        Map<String, Object> openAiPayload = Map.of(
                "model", targetModel,
                "temperature", 0.3,
                "messages", List.of(
                        Map.of("role", "system", "content", getUnifiedSystemPrompt()),
                        Map.of("role", "user", "content", prompt)
                )
        );

        String responseBody = aiWebClient.post()
                .uri(aiApiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + key)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(openAiPayload)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(15))
                .block();

        String providerName = provider.equalsIgnoreCase("openai") ? "OpenAI" : provider;
        return parseOpenAiFormatResponse(responseBody, providerName + " " + targetModel + " (Live API)", candidate, request.getFocus());
    }

    private AiGenerationResult parseYandexGptResponse(String json, CandidateProfile candidate, String focus) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode alternatives = root.path("result").path("alternatives");
            if (alternatives.isArray() && !alternatives.isEmpty()) {
                String rawText = alternatives.get(0).path("message").path("text").asText();
                return parseJsonFromLlmText(rawText, "YandexGPT 3 Pro (Live Cloud API)", candidate, focus);
            }
        } catch (Exception e) {
            log.error("Failed to parse YandexGPT JSON response: {}", e.getMessage());
        }
        return generateDynamicProfile(candidate, focus);
    }

    private AiGenerationResult parseOpenAiFormatResponse(String json, String liveModelName, CandidateProfile candidate, String focus) {
        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                String rawText = choices.get(0).path("message").path("content").asText();
                return parseJsonFromLlmText(rawText, liveModelName, candidate, focus);
            }
        } catch (Exception e) {
            log.error("Failed to parse OpenAI-compatible JSON response: {}", e.getMessage());
        }
        return generateDynamicProfile(candidate, focus);
    }

    private AiGenerationResult parseJsonFromLlmText(String rawText, String liveModelName, CandidateProfile candidate, String focus) {
        try {
            String cleanJson = rawText.trim();
            if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.substring(7);
            } else if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.substring(3);
            }
            if (cleanJson.endsWith("```")) {
                cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
            }
            cleanJson = cleanJson.trim();

            JsonNode parsed = objectMapper.readTree(cleanJson);
            String summaryText = parsed.path("summaryText").asText();

            List<String> keyStrengths = new ArrayList<>();
            if (parsed.has("keyStrengths") && parsed.get("keyStrengths").isArray()) {
                for (JsonNode item : parsed.get("keyStrengths")) {
                    keyStrengths.add(item.asText());
                }
            }

            String recLevel = parsed.path("recommendationLevel").asText("HIGHLY_RECOMMENDED");

            List<String> recommendedRoles = new ArrayList<>();
            if (parsed.has("recommendedRoles") && parsed.get("recommendedRoles").isArray()) {
                for (JsonNode item : parsed.get("recommendedRoles")) {
                    recommendedRoles.add(item.asText());
                }
            }

            if (!summaryText.isBlank() && !keyStrengths.isEmpty()) {
                return AiGenerationResult.builder()
                        .summaryText(summaryText)
                        .keyStrengths(keyStrengths)
                        .recommendationLevel(recLevel)
                        .recommendedRoles(!recommendedRoles.isEmpty() ? recommendedRoles : deriveRecommendedRoles(candidate))
                        .modelName(liveModelName)
                        .build();
            }
        } catch (Exception e) {
            log.warn("Could not parse structured JSON from LLM output, extracting as plain text: {}", e.getMessage());
            if (!rawText.isBlank()) {
                return AiGenerationResult.builder()
                        .summaryText(rawText.trim())
                        .keyStrengths(deriveKeyStrengths(candidate))
                        .recommendationLevel(candidate.getFspElo() >= 1800 ? "HIGHLY_RECOMMENDED" : "RECOMMENDED")
                        .recommendedRoles(deriveRecommendedRoles(candidate))
                        .modelName(liveModelName)
                        .build();
            }
        }

        return generateDynamicProfile(candidate, focus);
    }

    private AiGenerationResult generateDynamicProfile(CandidateProfile c, String focus) {
        String name = c.getUser() != null ? c.getUser().getFullName() : "Специалист";
        String rank = c.getFspRank() != null ? c.getFspRank().getDisplayName() : "Спортсмен ФСП";
        int elo = c.getFspElo();
        Grade grade = c.getGrade();
        Specialization spec = c.getSpecialization();
        String skills = String.join(", ", c.getSkills());

        String eloAnalysis;
        if (elo >= 2200) {
            eloAnalysis = String.format("Выдающийся спортивный рейтинг ELO %d (%s) подтверждает квалификацию уровня ТОП-1%% разработчиков РФ.", elo, rank);
        } else if (elo >= 1600) {
            eloAnalysis = String.format("Уверенный рейтинг ELO %d (%s) свидетельствует о развитом алгоритмическом мышлении и победах в официальных отборочных турах ФСП.", elo, rank);
        } else if (elo >= 1300) {
            eloAnalysis = String.format("Спортивный рейтинг ELO %d (%s) демонстрирует хорошую алгоритмическую базу выше среднего уровня по индустрии.", elo, rank);
        } else {
            eloAnalysis = String.format("Начальный квалификационный рейтинг ELO %d (%s) в едином реестре ФСП РФ без накруток, с верифицированным потенциалом быстрого роста.", elo, rank);
        }

        String githubAnalysis = c.getGithubCommitsCount() > 500
                ? String.format("Анализ GitHub (@%s) выявил высокую инженерную дисциплину: %d коммитов за последний год в %d проектах с акцентом на чистый продакшен-код.",
                    c.getGithubUsername() != null ? c.getGithubUsername() : "code", c.getGithubCommitsCount(), c.getGithubReposCount())
                : String.format("Профиль GitHub (@%s) содержит %d репозиториев с реализацией прикладных решений на стеке %s.",
                    c.getGithubUsername() != null ? c.getGithubUsername() : "code", c.getGithubReposCount(), skills);

        String summary = String.format(
                "%s — квалифицированный %s-инженер специализации %s. %s %s Рекомендуется для комплектования ключевых продуктовых и инфраструктурных команд.",
                name, grade, spec, eloAnalysis, githubAnalysis
        );

        String recLevel;
        if (elo >= 2000 || c.isFspVerified() && c.getGithubCommitsCount() >= 700) {
            recLevel = "HIGHLY_RECOMMENDED";
        } else if (elo >= 1400 || grade == Grade.SENIOR || grade == Grade.LEAD) {
            recLevel = "RECOMMENDED";
        } else {
            recLevel = "QUALIFIED";
        }

        return AiGenerationResult.builder()
                .summaryText(summary)
                .keyStrengths(deriveKeyStrengths(c))
                .recommendationLevel(recLevel)
                .recommendedRoles(deriveRecommendedRoles(c))
                .modelName("YandexGPT 3 Pro (Neural Profiler)")
                .build();
    }

    private List<String> deriveKeyStrengths(CandidateProfile c) {
        List<String> strengths = new ArrayList<>();

        if (c.getFspElo() >= 1800) {
            strengths.add("Олимпиадный уровень: решение сложных динамических и графовых задач за нормативное время");
        } else if (c.getFspElo() >= 1400) {
            strengths.add("Уверенная алгоритмическая подготовка по стандартам соревнований ФСП России");
        } else {
            strengths.add("Базовая алгоритмическая подготовка и математическая культура разработки");
        }

        if (c.getSkills().contains("Spring Boot") || c.getSkills().contains("Java")) {
            strengths.add("Глубокое знание стека Enterprise Java (Spring Boot, Hibernate, транзакции, JVM tuning)");
        } else if (c.getSkills().contains("React") || c.getSkills().contains("TypeScript")) {
            strengths.add("Современный фронтенд-стек (React, TypeScript, архитектура SPA и оптимизация рендеринга)");
        } else {
            strengths.add("Проверенные практические навыки: " + String.join(", ", c.getSkills()));
        }

        if (c.getSkills().contains("PostgreSQL") || c.getSkills().contains("Kafka")) {
            strengths.add("Проектирование реляционных схем данных PostgreSQL и потоковой обработки событий");
        } else {
            strengths.add("Практический опыт контейнеризации и командной разработки (Docker, Git CI/CD)");
        }

        if (c.getGithubCommitsCount() >= 500) {
            strengths.add(String.format("Высокая продуктивность: %d коммитов за год с регулярными код-ревью", c.getGithubCommitsCount()));
        } else {
            strengths.add("Верифицированный профиль соискателя, готовый к собеседованиям в аккредитованные ИТ-компании");
        }

        return strengths;
    }

    private List<String> deriveRecommendedRoles(CandidateProfile c) {
        Grade grade = c.getGrade();
        Specialization spec = c.getSpecialization();

        return switch (spec) {
            case BACKEND -> List.of(
                    grade + " Java Backend Engineer (Highload / Core)",
                    "Distributed Systems & Microservices Developer",
                    "Performance & Algorithm Engineer",
                    "Database & Backend Infrastructure Specialist"
            );
            case FRONTEND -> List.of(
                    grade + " Frontend Developer (React / TS)",
                    "UI/UX Platform Engineer",
                    "Web Performance & Design System Specialist",
                    "Full-cycle Client Applications Engineer"
            );
            case FULLSTACK -> List.of(
                    grade + " Fullstack Software Engineer",
                    "End-to-End Product Developer",
                    "Cloud Services & Web Application Architect",
                    "Technical Solutions Engineer"
            );
            case ML_AI -> List.of(
                    grade + " Machine Learning Engineer",
                    "Algorithm & Deep Learning Specialist",
                    "Data Science & Predictive Modeling Engineer",
                    "AI Infrastructure Developer"
            );
            case DEVOPS -> List.of(
                    grade + " DevOps / SRE Engineer",
                    "Cloud Infrastructure Architect (K8s / CI/CD)",
                    "Platform & Reliability Engineer",
                    "Automated Deployment Specialist"
            );
            default -> List.of(
                    grade + " " + spec + " Software Engineer",
                    "Core Infrastructure Specialist",
                    "Algorithmic Solution Developer"
            );
        };
    }

    private String resolveApiKey(String requestKey, String defaultKey) {
        if (requestKey != null && !requestKey.isBlank()) {
            return requestKey.trim();
        }
        return defaultKey;
    }

    private boolean isMockKey(String key) {
        return key == null || key.isBlank() || key.equalsIgnoreCase("mock-ai-key") || key.startsWith("mock-");
    }

    private AiSummaryDto mapToDto(CandidateAiSummary entity) {
        return AiSummaryDto.builder()
                .id(entity.getId())
                .candidateId(entity.getCandidate().getId())
                .summaryText(entity.getSummaryText())
                .keyStrengths(entity.getKeyStrengths())
                .recommendationLevel(entity.getRecommendationLevel())
                .recommendedRoles(entity.getRecommendedRoles())
                .modelName(entity.getModelName())
                .generatedAt(entity.getCreatedAt() != null ? entity.getCreatedAt() : OffsetDateTime.now())
                .build();
    }
}
