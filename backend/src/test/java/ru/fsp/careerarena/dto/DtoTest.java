package ru.fsp.careerarena.dto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import ru.fsp.careerarena.entity.enums.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Тестирование объектов передачи данных (DTO)")
class DtoTest {

    @Test
    @DisplayName("Проверка DTO кандидата (CandidateDto)")
    void testCandidateDto() {
        UUID id = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        CandidateDto dto = CandidateDto.builder()
                .id(id)
                .userId(userId)
                .fullName("Иван Иванов")
                .email("ivan@fsp.ru")
                .avatarUrl("/avatar.png")
                .fspId("FSP-1")
                .fspElo(2100)
                .fspRank(FspRank.KMS)
                .fspRankDisplayName("Кандидат в мастера спорта")
                .specialization(Specialization.BACKEND)
                .grade(Grade.SENIOR)
                .salaryExpectation(350000)
                .location("Москва")
                .bio("Опыт 5 лет")
                .isFspVerified(true)
                .githubUsername("ivan")
                .githubReposCount(10)
                .githubCommitsCount(500)
                .skills(Set.of("Java", "PostgreSQL"))
                .build();

        assertThat(dto.getId()).isEqualTo(id);
        assertThat(dto.getUserId()).isEqualTo(userId);
        assertThat(dto.getFullName()).isEqualTo("Иван Иванов");
        assertThat(dto.getEmail()).isEqualTo("ivan@fsp.ru");
        assertThat(dto.getAvatarUrl()).isEqualTo("/avatar.png");
        assertThat(dto.getFspId()).isEqualTo("FSP-1");
        assertThat(dto.getFspElo()).isEqualTo(2100);
        assertThat(dto.getFspRank()).isEqualTo(FspRank.KMS);
        assertThat(dto.getFspRankDisplayName()).isEqualTo("Кандидат в мастера спорта");
        assertThat(dto.getSpecialization()).isEqualTo(Specialization.BACKEND);
        assertThat(dto.getGrade()).isEqualTo(Grade.SENIOR);
        assertThat(dto.getSalaryExpectation()).isEqualTo(350000);
        assertThat(dto.getLocation()).isEqualTo("Москва");
        assertThat(dto.getBio()).isEqualTo("Опыт 5 лет");
        assertThat(dto.isFspVerified()).isTrue();
        assertThat(dto.getGithubUsername()).isEqualTo("ivan");
        assertThat(dto.getGithubReposCount()).isEqualTo(10);
        assertThat(dto.getGithubCommitsCount()).isEqualTo(500);
        assertThat(dto.getSkills()).contains("Java");

        CandidateDto empty = new CandidateDto();
        empty.setFullName("Новый");
        assertThat(empty.getFullName()).isEqualTo("Новый");
    }

    @Test
    @DisplayName("Проверка DTO вакансии (VacancyDto)")
    void testVacancyDto() {
        UUID id = UUID.randomUUID();
        UUID empId = UUID.randomUUID();

        VacancyDto dto = VacancyDto.builder()
                .id(id)
                .employerId(empId)
                .companyName("Яндекс")
                .companyLogo("/logo.png")
                .title("Java Engineer")
                .specialization(Specialization.BACKEND)
                .grade(Grade.MIDDLE)
                .salaryFrom(200000)
                .salaryTo(300000)
                .minFspElo(1600)
                .requiredFspRank(FspRank.FIRST_CLASS)
                .location("Москва")
                .workFormat(WorkFormat.REMOTE)
                .description("Описание")
                .isActive(true)
                .requiredSkills(Set.of("Spring"))
                .build();

        assertThat(dto.getId()).isEqualTo(id);
        assertThat(dto.getEmployerId()).isEqualTo(empId);
        assertThat(dto.getCompanyName()).isEqualTo("Яндекс");
        assertThat(dto.getCompanyLogo()).isEqualTo("/logo.png");
        assertThat(dto.getTitle()).isEqualTo("Java Engineer");
        assertThat(dto.getSpecialization()).isEqualTo(Specialization.BACKEND);
        assertThat(dto.getGrade()).isEqualTo(Grade.MIDDLE);
        assertThat(dto.getSalaryFrom()).isEqualTo(200000);
        assertThat(dto.getSalaryTo()).isEqualTo(300000);
        assertThat(dto.getMinFspElo()).isEqualTo(1600);
        assertThat(dto.getRequiredFspRank()).isEqualTo(FspRank.FIRST_CLASS);
        assertThat(dto.getLocation()).isEqualTo("Москва");
        assertThat(dto.getWorkFormat()).isEqualTo(WorkFormat.REMOTE);
        assertThat(dto.getDescription()).isEqualTo("Описание");
        assertThat(dto.isActive()).isTrue();
        assertThat(dto.getRequiredSkills()).contains("Spring");

        VacancyDto empty = new VacancyDto();
        empty.setTitle("Заголовок");
        assertThat(empty.getTitle()).isEqualTo("Заголовок");
    }

    @Test
    @DisplayName("Проверка DTO запроса на создание вакансии (CreateVacancyRequest)")
    void testCreateVacancyRequest() {
        UUID empId = UUID.randomUUID();
        CreateVacancyRequest req = CreateVacancyRequest.builder()
                .employerId(empId)
                .title("Fullstack Dev")
                .specialization(Specialization.FULLSTACK)
                .grade(Grade.SENIOR)
                .salaryFrom(300000)
                .salaryTo(450000)
                .minFspElo(1900)
                .requiredFspRank(FspRank.KMS)
                .location("СПб")
                .workFormat(WorkFormat.HYBRID)
                .description("Подробности")
                .hhVacancyId("hh-1")
                .requiredSkills(Set.of("Java", "React"))
                .build();

        assertThat(req.getEmployerId()).isEqualTo(empId);
        assertThat(req.getTitle()).isEqualTo("Fullstack Dev");
        assertThat(req.getSpecialization()).isEqualTo(Specialization.FULLSTACK);
        assertThat(req.getGrade()).isEqualTo(Grade.SENIOR);
        assertThat(req.getSalaryFrom()).isEqualTo(300000);
        assertThat(req.getSalaryTo()).isEqualTo(450000);
        assertThat(req.getMinFspElo()).isEqualTo(1900);
        assertThat(req.getRequiredFspRank()).isEqualTo(FspRank.KMS);
        assertThat(req.getLocation()).isEqualTo("СПб");
        assertThat(req.getWorkFormat()).isEqualTo(WorkFormat.HYBRID);
        assertThat(req.getDescription()).isEqualTo("Подробности");
        assertThat(req.getHhVacancyId()).isEqualTo("hh-1");
        assertThat(req.getRequiredSkills()).contains("React");

        CreateVacancyRequest empty = new CreateVacancyRequest();
        empty.setTitle("Тест");
        assertThat(empty.getTitle()).isEqualTo("Тест");
    }

    @Test
    @DisplayName("Проверка DTO исполнения кода (CodeExecutionRequest и CodeExecutionResult)")
    void testCodeSandboxDtos() {
        UUID taskId = UUID.randomUUID();
        UUID candId = UUID.randomUUID();
        UUID subId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();

        CodeExecutionRequest req = CodeExecutionRequest.builder()
                .taskId(taskId)
                .candidateId(candId)
                .language("java")
                .sourceCode("class Solution {}")
                .build();

        assertThat(req.getTaskId()).isEqualTo(taskId);
        assertThat(req.getCandidateId()).isEqualTo(candId);
        assertThat(req.getLanguage()).isEqualTo("java");
        assertThat(req.getSourceCode()).isEqualTo("class Solution {}");

        CodeExecutionResult res = CodeExecutionResult.builder()
                .submissionId(subId)
                .verdict(SubmissionVerdict.ACCEPTED)
                .statusMessage("OK")
                .testsPassed(5)
                .totalTests(5)
                .executionTimeMs(35)
                .memoryUsedKb(12000)
                .stdout("All passed")
                .stderr(null)
                .submittedAt(now)
                .build();

        assertThat(res.getSubmissionId()).isEqualTo(subId);
        assertThat(res.getVerdict()).isEqualTo(SubmissionVerdict.ACCEPTED);
        assertThat(res.getStatusMessage()).isEqualTo("OK");
        assertThat(res.getTestsPassed()).isEqualTo(5);
        assertThat(res.getTotalTests()).isEqualTo(5);
        assertThat(res.getExecutionTimeMs()).isEqualTo(35);
        assertThat(res.getMemoryUsedKb()).isEqualTo(12000);
        assertThat(res.getStdout()).isEqualTo("All passed");
        assertThat(res.getStderr()).isNull();
        assertThat(res.getSubmittedAt()).isEqualTo(now);

        CodeExecutionRequest emptyReq = new CodeExecutionRequest();
        emptyReq.setLanguage("python");
        assertThat(emptyReq.getLanguage()).isEqualTo("python");

        CodeExecutionResult emptyRes = new CodeExecutionResult();
        emptyRes.setStatusMessage("Wait");
        assertThat(emptyRes.getStatusMessage()).isEqualTo("Wait");
    }

    @Test
    @DisplayName("Проверка DTO AI-резюме (AiSummaryDto)")
    void testAiSummaryDto() {
        UUID id = UUID.randomUUID();
        UUID candId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();

        AiSummaryDto dto = AiSummaryDto.builder()
                .id(id)
                .candidateId(candId)
                .summaryText("Профиль инженера")
                .keyStrengths(List.of("Алгоритмы"))
                .recommendationLevel("HIGHLY_RECOMMENDED")
                .recommendedRoles(List.of("Senior Dev"))
                .modelName("YandexGPT 3")
                .generatedAt(now)
                .build();

        assertThat(dto.getId()).isEqualTo(id);
        assertThat(dto.getCandidateId()).isEqualTo(candId);
        assertThat(dto.getSummaryText()).isEqualTo("Профиль инженера");
        assertThat(dto.getKeyStrengths()).contains("Алгоритмы");
        assertThat(dto.getRecommendationLevel()).isEqualTo("HIGHLY_RECOMMENDED");
        assertThat(dto.getRecommendedRoles()).contains("Senior Dev");
        assertThat(dto.getModelName()).isEqualTo("YandexGPT 3");
        assertThat(dto.getGeneratedAt()).isEqualTo(now);

        AiSummaryDto empty = new AiSummaryDto();
        empty.setModelName("OpenAI");
        assertThat(empty.getModelName()).isEqualTo("OpenAI");
    }

    @Test
    @DisplayName("Проверка DTO запроса на генерацию AI-резюме (GenerateAiSummaryRequest)")
    void testGenerateAiSummaryRequest() {
        UUID candId = UUID.randomUUID();
        GenerateAiSummaryRequest req = GenerateAiSummaryRequest.builder()
                .candidateId(candId)
                .provider("gemini")
                .model("gemini-1.5-pro")
                .apiKey("test-key")
                .folderId("folder-1")
                .endpointUrl("http://localhost:11434/v1")
                .focus("highload")
                .forceRefresh(true)
                .build();

        assertThat(req.getCandidateId()).isEqualTo(candId);
        assertThat(req.getProvider()).isEqualTo("gemini");
        assertThat(req.getModel()).isEqualTo("gemini-1.5-pro");
        assertThat(req.getApiKey()).isEqualTo("test-key");
        assertThat(req.getFolderId()).isEqualTo("folder-1");
        assertThat(req.getEndpointUrl()).isEqualTo("http://localhost:11434/v1");
        assertThat(req.getFocus()).isEqualTo("highload");
        assertThat(req.isForceRefresh()).isTrue();

        GenerateAiSummaryRequest empty = new GenerateAiSummaryRequest();
        empty.setProvider("openrouter");
        assertThat(empty.getProvider()).isEqualTo("openrouter");
    }

    @Test
    @DisplayName("Проверка DTO приглашений (InvitationDto и SendInvitationRequest)")
    void testInvitationDtos() {
        UUID invId = UUID.randomUUID();
        UUID candId = UUID.randomUUID();
        UUID empId = UUID.randomUUID();
        UUID vacId = UUID.randomUUID();
        OffsetDateTime now = OffsetDateTime.now();

        InvitationDto dto = InvitationDto.builder()
                .id(invId)
                .candidateId(candId)
                .candidateName("Алексей")
                .employerId(empId)
                .companyName("VK")
                .companyLogo("/vk.png")
                .vacancyId(vacId)
                .vacancyTitle("Backend Dev")
                .salaryOffered(350000)
                .message("Оффер")
                .status(InvitationStatus.PENDING)
                .createdAt(now)
                .build();

        assertThat(dto.getId()).isEqualTo(invId);
        assertThat(dto.getCandidateId()).isEqualTo(candId);
        assertThat(dto.getCandidateName()).isEqualTo("Алексей");
        assertThat(dto.getEmployerId()).isEqualTo(empId);
        assertThat(dto.getCompanyName()).isEqualTo("VK");
        assertThat(dto.getCompanyLogo()).isEqualTo("/vk.png");
        assertThat(dto.getVacancyId()).isEqualTo(vacId);
        assertThat(dto.getVacancyTitle()).isEqualTo("Backend Dev");
        assertThat(dto.getSalaryOffered()).isEqualTo(350000);
        assertThat(dto.getMessage()).isEqualTo("Оффер");
        assertThat(dto.getStatus()).isEqualTo(InvitationStatus.PENDING);
        assertThat(dto.getCreatedAt()).isEqualTo(now);

        SendInvitationRequest req = SendInvitationRequest.builder()
                .candidateId(candId)
                .employerId(empId)
                .vacancyId(vacId)
                .salaryOffered(350000)
                .message("Приглашаем в команду")
                .build();

        assertThat(req.getCandidateId()).isEqualTo(candId);
        assertThat(req.getEmployerId()).isEqualTo(empId);
        assertThat(req.getVacancyId()).isEqualTo(vacId);
        assertThat(req.getSalaryOffered()).isEqualTo(350000);
        assertThat(req.getMessage()).isEqualTo("Приглашаем в команду");

        InvitationDto emptyDto = new InvitationDto();
        emptyDto.setCandidateName("Иван");
        assertThat(emptyDto.getCandidateName()).isEqualTo("Иван");

        SendInvitationRequest emptyReq = new SendInvitationRequest();
        emptyReq.setMessage("Сообщение");
        assertThat(emptyReq.getMessage()).isEqualTo("Сообщение");
    }
}
