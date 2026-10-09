package ru.fsp.careerarena.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import ru.fsp.careerarena.dto.AiSummaryDto;
import ru.fsp.careerarena.dto.GenerateAiSummaryRequest;
import ru.fsp.careerarena.entity.CandidateAiSummary;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.entity.enums.UserRole;
import ru.fsp.careerarena.repository.CandidateAiSummaryRepository;
import ru.fsp.careerarena.repository.CandidateProfileRepository;

import java.time.OffsetDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование сервиса генерации AI-резюме (AiSummaryService)")
class AiSummaryServiceTest {

    @Mock
    private CandidateProfileRepository candidateRepository;

    @Mock
    private CandidateAiSummaryRepository aiSummaryRepository;

    @Mock
    private WebClient aiWebClient;

    @InjectMocks
    private AiSummaryService aiSummaryService;

    private CandidateProfile candidate;
    private User user;
    private UUID candidateId;

    @BeforeEach
    void setUp() {
        candidateId = UUID.randomUUID();

        user = User.builder()
                .id(UUID.randomUUID())
                .fullName("Александр Попов")
                .email("popov@fsp.ru")
                .role(UserRole.CANDIDATE)
                .build();

        candidate = CandidateProfile.builder()
                .id(candidateId)
                .user(user)
                .fspId("FSP-RUS-777")
                .fspElo(2300)
                .fspRank(FspRank.MS)
                .specialization(Specialization.BACKEND)
                .grade(Grade.SENIOR)
                .salaryExpectation(400000)
                .location("Москва")
                .bio("Победитель кубка ФСП")
                .isFspVerified(true)
                .githubUsername("apopov")
                .githubReposCount(30)
                .githubCommitsCount(950)
                .skills(Set.of("Java", "Spring Boot", "PostgreSQL", "Kafka"))
                .build();

        ReflectionTestUtils.setField(aiSummaryService, "aiApiUrl", "https://llm.api.cloud.yandex.net/foundationModels/v1/completion");
        ReflectionTestUtils.setField(aiSummaryService, "aiProvider", "gemini");
        ReflectionTestUtils.setField(aiSummaryService, "aiModel", "gemini-1.5-flash");
        ReflectionTestUtils.setField(aiSummaryService, "folderId", "b1gmockfolderid");
        ReflectionTestUtils.setField(aiSummaryService, "geminiApiKey", "mock-gemini-key");
        ReflectionTestUtils.setField(aiSummaryService, "geminiApiUrl", "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions");
        ReflectionTestUtils.setField(aiSummaryService, "geminiModel", "gemini-1.5-flash");
        ReflectionTestUtils.setField(aiSummaryService, "openrouterApiKey", "mock-openrouter-key");
        ReflectionTestUtils.setField(aiSummaryService, "openrouterApiUrl", "https://openrouter.ai/api/v1/chat/completions");
        ReflectionTestUtils.setField(aiSummaryService, "openrouterModel", "meta-llama/llama-3.1-8b-instruct:free");
        ReflectionTestUtils.setField(aiSummaryService, "ollamaApiUrl", "http://ollama:11434/v1/chat/completions");
        ReflectionTestUtils.setField(aiSummaryService, "ollamaModel", "llama3:8b");
    }

    @Test
    @DisplayName("Возврат уже существующего AI-Summary без повторного обращения к LLM")
    void generateOrGetAiSummary_existingSummary_returnsExistingDto() {
        CandidateAiSummary existing = CandidateAiSummary.builder()
                .id(UUID.randomUUID())
                .candidate(candidate)
                .summaryText("Существующий технический профиль")
                .keyStrengths(List.of("Алгоритмы", "Java"))
                .recommendationLevel("HIGHLY_RECOMMENDED")
                .recommendedRoles(List.of("Senior Backend Developer"))
                .modelName("YandexGPT 3 Pro")
                .createdAt(OffsetDateTime.now())
                .build();

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.of(existing));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).isEqualTo("Существующий технический профиль");
        assertThat(dto.getRecommendationLevel()).isEqualTo("HIGHLY_RECOMMENDED");
        verify(aiSummaryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Попытка генерации AI-Summary для несуществующего кандидата выбрасывает исключение")
    void generateOrGetAiSummary_candidateNotFound_throwsException() {
        UUID unknownId = UUID.randomUUID();
        when(candidateRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> aiSummaryService.generateOrGetAiSummary(unknownId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("не найден");
    }

    @Test
    @DisplayName("Динамическая генерация резюме для топ-спортсмена (ELO >= 2200, High Commits, Backend)")
    void generateOrGetAiSummary_dynamicProfileTopTierBackend() {
        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "mock-ai-key");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).contains("ТОП-1%");
        assertThat(dto.getSummaryText()).contains("Анализ GitHub (@apopov) выявил высокую инженерную дисциплину");
        assertThat(dto.getRecommendationLevel()).isEqualTo("HIGHLY_RECOMMENDED");
        assertThat(dto.getKeyStrengths()).anyMatch(s -> s.contains("Олимпиадный уровень"));
        assertThat(dto.getKeyStrengths()).anyMatch(s -> s.contains("Enterprise Java"));
        assertThat(dto.getKeyStrengths()).anyMatch(s -> s.contains("PostgreSQL"));
        assertThat(dto.getRecommendedRoles()).anyMatch(r -> r.contains("Java Backend Engineer"));
    }

    @Test
    @DisplayName("Динамическая генерация резюме для фронтенд-разработчика (ELO 1600-2199, React/TypeScript)")
    void generateOrGetAiSummary_dynamicProfileFrontend() {
        candidate.setFspElo(1700);
        candidate.setFspRank(FspRank.FIRST_CLASS);
        candidate.setSpecialization(Specialization.FRONTEND);
        candidate.setGrade(Grade.MIDDLE);
        candidate.setSkills(Set.of("React", "TypeScript", "Redux", "Docker"));
        candidate.setGithubCommitsCount(300);

        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "mock-ai-key");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).contains("Уверенный рейтинг ELO 1700");
        assertThat(dto.getSummaryText()).contains("Профиль GitHub (@apopov) содержит");
        assertThat(dto.getRecommendationLevel()).isEqualTo("RECOMMENDED");
        assertThat(dto.getKeyStrengths()).anyMatch(s -> s.contains("Уверенная алгоритмическая подготовка"));
        assertThat(dto.getKeyStrengths()).anyMatch(s -> s.contains("Современный фронтенд-стек"));
        assertThat(dto.getRecommendedRoles()).anyMatch(r -> r.contains("Frontend Developer"));
    }

    @Test
    @DisplayName("Динамическая генерация резюме для фуллстек-разработчика (ELO 1300-1599)")
    void generateOrGetAiSummary_dynamicProfileFullstack() {
        candidate.setFspElo(1450);
        candidate.setFspRank(FspRank.SECOND_CLASS);
        candidate.setSpecialization(Specialization.FULLSTACK);
        candidate.setGrade(Grade.MIDDLE);
        candidate.setSkills(Set.of("Node.js", "Python"));
        candidate.setGithubCommitsCount(150);

        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).contains("Спортивный рейтинг ELO 1450");
        assertThat(dto.getRecommendationLevel()).isEqualTo("RECOMMENDED");
        assertThat(dto.getRecommendedRoles()).anyMatch(r -> r.contains("Fullstack Software Engineer"));
    }

    @Test
    @DisplayName("Динамическая генерация резюме для ML/AI инженера начального уровня (ELO < 1300)")
    void generateOrGetAiSummary_dynamicProfileMlAiJunior() {
        candidate.setFspElo(1100);
        candidate.setFspRank(FspRank.UNRANKED);
        candidate.setSpecialization(Specialization.ML_AI);
        candidate.setGrade(Grade.JUNIOR);
        candidate.setSkills(Set.of("PyTorch", "Pandas"));
        candidate.setGithubCommitsCount(50);
        candidate.setFspVerified(false);

        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", null);

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).contains("Начальный квалификационный рейтинг ELO 1100");
        assertThat(dto.getRecommendationLevel()).isEqualTo("QUALIFIED");
        assertThat(dto.getKeyStrengths()).anyMatch(s -> s.contains("Базовая алгоритмическая подготовка"));
        assertThat(dto.getRecommendedRoles()).anyMatch(r -> r.contains("Machine Learning Engineer"));
    }

    @Test
    @DisplayName("Динамическая генерация резюме для DevOps инженера со статусом Lead")
    void generateOrGetAiSummary_dynamicProfileDevOpsLead() {
        candidate.setSpecialization(Specialization.DEVOPS);
        candidate.setGrade(Grade.LEAD);
        candidate.setFspElo(1500);
        candidate.setGithubCommitsCount(200);
        candidate.setFspVerified(false);

        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "mock-123");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getRecommendationLevel()).isEqualTo("RECOMMENDED");
        assertThat(dto.getRecommendedRoles()).anyMatch(r -> r.contains("DevOps / SRE Engineer"));
    }

    @Test
    @DisplayName("Динамическая генерация с пустыми и null полями в профиле кандидата")
    void generateOrGetAiSummary_nullFieldsHandledGracefully() {
        CandidateProfile emptyCand = CandidateProfile.builder()
                .id(candidateId)
                .user(null)
                .fspRank(null)
                .fspElo(1200)
                .specialization(Specialization.MOBILE)
                .grade(Grade.JUNIOR)
                .skills(Collections.emptySet())
                .githubUsername(null)
                .githubCommitsCount(0)
                .githubReposCount(0)
                .bio(null)
                .build();

        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "mock-ai-key");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(emptyCand));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).contains("Специалист");
        assertThat(dto.getRecommendedRoles()).anyMatch(r -> r.contains("MOBILE Software Engineer"));
    }

    @Test
    @DisplayName("Успешный вызов live YandexGPT API с парсингом Markdown JSON блока")
    @SuppressWarnings("unchecked")
    void generateOrGetAiSummary_liveYandexGpt_parsesMarkdownJson() {
        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "secret-yandex-token");
        ReflectionTestUtils.setField(aiSummaryService, "aiProvider", "yandexgpt");
        ReflectionTestUtils.setField(aiSummaryService, "folderId", "b1gtestfolder");
        ReflectionTestUtils.setField(aiSummaryService, "aiApiUrl", "https://llm.api.cloud.yandex.net/v1/completion");

        String yandexResponseBody = """
                {
                  "result": {
                    "alternatives": [
                      {
                        "message": {
                          "text": "```json\\n{\\n  \\"summaryText\\": \\"Выдающийся бэкенд инженер ФСП\\",\\n  \\"keyStrengths\\": [\\"Java Core\\", \\"Высокая алгоритмическая база\\"],\\n  \\"recommendationLevel\\": \\"HIGHLY_RECOMMENDED\\",\\n  \\"recommendedRoles\\": [\\"Staff Java Engineer\\"]\\n}\\n```"
                        }
                      }
                    ]
                  }
                }
                """;

        setupWebClientMock(yandexResponseBody);

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).isEqualTo("Выдающийся бэкенд инженер ФСП");
        assertThat(dto.getModelName()).isEqualTo("YandexGPT 3 Pro (Live Cloud API)");
    }

    @Test
    @DisplayName("Успешный вызов live OpenAI-compatible API")
    void generateOrGetAiSummary_liveOpenAi_parsesCleanJson() {
        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "sk-live-openai-key");
        ReflectionTestUtils.setField(aiSummaryService, "aiProvider", "openai");
        ReflectionTestUtils.setField(aiSummaryService, "aiModel", "gpt-4o-mini");

        String openAiResponseBody = """
                {
                  "choices": [
                    {
                      "message": {
                        "content": "{\\"summaryText\\":\\"OpenAI verified profile\\",\\"keyStrengths\\":[\\"Clean Architecture\\",\\"Spring Boot\\"],\\"recommendationLevel\\":\\"RECOMMENDED\\",\\"recommendedRoles\\":[\\"Java Backend Dev\\"]}"
                      }
                    }
                  ]
                }
                """;

        setupWebClientMock(openAiResponseBody);

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).isEqualTo("OpenAI verified profile");
        assertThat(dto.getModelName()).isEqualTo("OpenAI gpt-4o-mini (Live API)");
    }

    @Test
    @DisplayName("Сбой live API вызывает fallback на динамическую генерацию")
    void generateOrGetAiSummary_liveApiFails_fallsBackToDynamicProfile() {
        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "secret-key-network-error");
        ReflectionTestUtils.setField(aiSummaryService, "aiProvider", "yandexgpt");

        WebClient.RequestBodyUriSpec uriSpec = mock(WebClient.RequestBodyUriSpec.class);
        when(aiWebClient.post()).thenReturn(uriSpec);
        when(uriSpec.uri(anyString())).thenThrow(new RuntimeException("Connection timeout"));

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getModelName()).isEqualTo("YandexGPT 3 Pro (Neural Profiler)");
    }

    @Test
    @DisplayName("Ответ live API в виде обычного текста (без JSON) парсится как plain-text summary")
    void generateOrGetAiSummary_plainTextLlmResponse_fallsBackToDerivation() {
        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "valid-key-plain-text");
        ReflectionTestUtils.setField(aiSummaryService, "aiProvider", "openai");

        String openAiPlainResponseBody = """
                {
                  "choices": [
                    {
                      "message": {
                        "content": "Кандидат обладает выдающимися навыками решения олимпиадных задач."
                      }
                    }
                  ]
                }
                """;

        setupWebClientMock(openAiPlainResponseBody);

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).isEqualTo("Кандидат обладает выдающимися навыками решения олимпиадных задач.");
    }

    @Test
    @DisplayName("Некорректный JSON в ответе YandexGPT приводит к fallback на динамический профиль")
    void generateOrGetAiSummary_malformedYandexJson_fallsBack() {
        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "valid-key");
        ReflectionTestUtils.setField(aiSummaryService, "aiProvider", "yandexgpt");

        setupWebClientMock("INVALID_JSON_BODY");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getModelName()).isEqualTo("YandexGPT 3 Pro (Neural Profiler)");
    }

    @Test
    @DisplayName("Некорректный JSON в ответе OpenAI приводит к fallback на динамический профиль")
    void generateOrGetAiSummary_malformedOpenAiJson_fallsBack() {
        ReflectionTestUtils.setField(aiSummaryService, "aiApiKey", "valid-key");
        ReflectionTestUtils.setField(aiSummaryService, "aiProvider", "openai");

        setupWebClientMock("INVALID_OPENAI_BODY");

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AiSummaryDto dto = aiSummaryService.generateOrGetAiSummary(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getModelName()).isEqualTo("YandexGPT 3 Pro (Neural Profiler)");
    }

    @Test
    @DisplayName("Успешная генерация через Google Gemini API с валидным ответом и принудительным обновлением")
    void generateAiSummary_geminiLiveApi_success() {
        CandidateAiSummary oldSummary = CandidateAiSummary.builder()
                .id(UUID.randomUUID())
                .candidate(candidate)
                .summaryText("Старое резюме")
                .keyStrengths(List.of("Старый навык"))
                .recommendationLevel("QUALIFIED")
                .recommendedRoles(List.of("Junior Dev"))
                .modelName("Old Model")
                .build();

        String geminiResponseBody = """
                {
                  "choices": [
                    {
                      "message": {
                        "content": "```json\\n{\\n  \\"summaryText\\": \\"Высококлассный Java архитектор для HighLoad систем.\\",\\n  \\"keyStrengths\\": [\\"HighLoad архитектура\\", \\"Spring Cloud\\", \\"PostgreSQL\\", \\"Олимпиадные алгоритмы\\"],\\n  \\"recommendationLevel\\": \\"HIGHLY_RECOMMENDED\\",\\n  \\"recommendedRoles\\": [\\"HighLoad Architect\\", \\"Lead Java Developer\\"]\\n}\\n```"
                      }
                    }
                  ]
                }
                """;

        setupWebClientMock(geminiResponseBody);

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.of(oldSummary));
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenerateAiSummaryRequest request = GenerateAiSummaryRequest.builder()
                .candidateId(candidateId)
                .provider("gemini")
                .apiKey("AQ.real-gemini-key")
                .focus("highload")
                .forceRefresh(true)
                .build();

        AiSummaryDto dto = aiSummaryService.generateAiSummary(request);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).isEqualTo("Высококлассный Java архитектор для HighLoad систем.");
        assertThat(dto.getModelName()).isEqualTo("Google Gemini gemini-1.5-flash (Live API)");
        assertThat(dto.getRecommendationLevel()).isEqualTo("HIGHLY_RECOMMENDED");
        assertThat(dto.getKeyStrengths()).contains("HighLoad архитектура", "Spring Cloud");
        verify(aiSummaryRepository).save(any(CandidateAiSummary.class));
    }

    @Test
    @DisplayName("Генерация через Google Gemini с mock-ключом приводит к вызову динамического профиля")
    void generateAiSummary_geminiMockKey_dynamicFallback() {
        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenerateAiSummaryRequest request = GenerateAiSummaryRequest.builder()
                .candidateId(candidateId)
                .provider("gemini")
                .apiKey("mock-demo-key")
                .focus("balanced")
                .build();

        AiSummaryDto dto = aiSummaryService.generateAiSummary(request);

        assertThat(dto).isNotNull();
        assertThat(dto.getModelName()).isEqualTo("YandexGPT 3 Pro (Neural Profiler)");
        assertThat(dto.getSummaryText()).contains("ТОП-1%");
        verify(aiWebClient, never()).post();
    }

    @Test
    @DisplayName("Успешная генерация через OpenRouter API с кастомной моделью и фокусом на алгоритмы")
    void generateAiSummary_openRouterLiveApi_success() {
        String openRouterResponseBody = """
                {
                  "choices": [
                    {
                      "message": {
                        "content": "{\\"summaryText\\":\\"OpenRouter аналитика алгоритмической базы кандидата.\\",\\"keyStrengths\\":[\\"Графы\\",\\"Динамическое программирование\\"],\\"recommendationLevel\\":\\"HIGHLY_RECOMMENDED\\",\\"recommendedRoles\\":[\\"Algorithm Engineer\\"]}"
                      }
                    }
                  ]
                }
                """;

        setupWebClientMock(openRouterResponseBody);

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenerateAiSummaryRequest request = GenerateAiSummaryRequest.builder()
                .candidateId(candidateId)
                .provider("openrouter")
                .apiKey("sk-or-v1-real-key")
                .model("meta-llama/llama-3.1-8b-instruct:free")
                .focus("algo")
                .build();

        AiSummaryDto dto = aiSummaryService.generateAiSummary(request);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).isEqualTo("OpenRouter аналитика алгоритмической базы кандидата.");
        assertThat(dto.getModelName()).isEqualTo("OpenRouter (meta-llama/llama-3.1-8b-instruct:free)");
        assertThat(dto.getKeyStrengths()).contains("Графы", "Динамическое программирование");
    }

    @Test
    @DisplayName("Генерация через локальный сервис Ollama Docker")
    void generateAiSummary_ollamaLiveApi_success() {
        String ollamaResponseBody = """
                {
                  "choices": [
                    {
                      "message": {
                        "content": "{\\"summaryText\\":\\"Локальный Ollama анализ технических лидерских качеств.\\",\\"keyStrengths\\":[\\"Tech Leadership\\",\\"System Design\\"],\\"recommendationLevel\\":\\"RECOMMENDED\\",\\"recommendedRoles\\":[\\"Team Lead Backend\\"]}"
                      }
                    }
                  ]
                }
                """;

        setupWebClientMock(ollamaResponseBody);

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenerateAiSummaryRequest request = GenerateAiSummaryRequest.builder()
                .candidateId(candidateId)
                .provider("ollama")
                .endpointUrl("http://localhost:11434/v1/chat/completions")
                .model("llama3:8b")
                .focus("lead")
                .build();

        AiSummaryDto dto = aiSummaryService.generateAiSummary(request);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).isEqualTo("Локальный Ollama анализ технических лидерских качеств.");
        assertThat(dto.getModelName()).isEqualTo("Ollama Local Docker (llama3:8b)");
    }

    @Test
    @DisplayName("Генерация через кастомный OpenAI-совместимый провайдер")
    void generateAiSummary_customOpenAiProvider_success() {
        String customResponseBody = """
                {
                  "choices": [
                    {
                      "message": {
                        "content": "{\\"summaryText\\":\\"Custom DeepSeek V3 аналитический профиль.\\",\\"keyStrengths\\":[\\"Java\\",\\"Architecture\\"],\\"recommendationLevel\\":\\"HIGHLY_RECOMMENDED\\",\\"recommendedRoles\\":[\\"Principal Engineer\\"]}"
                      }
                    }
                  ]
                }
                """;

        setupWebClientMock(customResponseBody);

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(aiSummaryRepository.findByCandidateId(candidateId)).thenReturn(Optional.empty());
        when(aiSummaryRepository.save(any(CandidateAiSummary.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GenerateAiSummaryRequest request = GenerateAiSummaryRequest.builder()
                .candidateId(candidateId)
                .provider("deepseek")
                .apiKey("sk-real-deepseek-key")
                .model("deepseek-chat")
                .build();

        AiSummaryDto dto = aiSummaryService.generateAiSummary(request);

        assertThat(dto).isNotNull();
        assertThat(dto.getSummaryText()).isEqualTo("Custom DeepSeek V3 аналитический профиль.");
        assertThat(dto.getModelName()).isEqualTo("deepseek deepseek-chat (Live API)");
    }

    @SuppressWarnings("unchecked")
    private void setupWebClientMock(String responseBody) {
        WebClient.RequestBodyUriSpec uriSpec = mock(WebClient.RequestBodyUriSpec.class);
        WebClient.RequestBodySpec bodySpec = mock(WebClient.RequestBodySpec.class);
        WebClient.RequestHeadersSpec headersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);

        lenient().when(aiWebClient.post()).thenReturn(uriSpec);
        lenient().when(uriSpec.uri(anyString())).thenReturn(bodySpec);
        lenient().when(bodySpec.header(anyString(), anyString())).thenReturn(bodySpec);
        lenient().when(bodySpec.contentType(any())).thenReturn(bodySpec);
        lenient().when(bodySpec.bodyValue(any())).thenReturn(headersSpec);
        lenient().when(headersSpec.retrieve()).thenReturn(responseSpec);
        lenient().when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(responseBody));
    }
}
