package ru.fsp.careerarena.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import ru.fsp.careerarena.entity.enums.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Тестирование сущностей базы данных (Entities) и перечислений (Enums)")
class EntitiesAndEnumsTest {

    @Test
    @DisplayName("Проверка перечисления спортивных разрядов ФСП (FspRank)")
    void testFspRankEnum() {
        assertThat(FspRank.MS.getDisplayName()).isEqualTo("Мастер спорта России");
        assertThat(FspRank.KMS.getDisplayName()).isEqualTo("Кандидат в мастера спорта");
        assertThat(FspRank.FIRST_CLASS.getDisplayName()).isEqualTo("I спортивный разряд");
        assertThat(FspRank.SECOND_CLASS.getDisplayName()).isEqualTo("II спортивный разряд");
        assertThat(FspRank.UNRANKED.getDisplayName()).isEqualTo("Без разряда");
        assertThat(FspRank.valueOf("MS")).isEqualTo(FspRank.MS);
        assertThat(FspRank.values()).hasSize(5);
    }

    @Test
    @DisplayName("Проверка перечислений грейдов, специализаций, форматов работы и статусов")
    void testOtherEnums() {
        assertThat(Grade.values()).containsExactly(Grade.JUNIOR, Grade.MIDDLE, Grade.SENIOR, Grade.LEAD);
        assertThat(UserRole.values()).containsExactly(UserRole.CANDIDATE, UserRole.EMPLOYER, UserRole.ADMIN);
        assertThat(WorkFormat.values()).containsExactly(WorkFormat.REMOTE, WorkFormat.OFFICE, WorkFormat.HYBRID);
        assertThat(Specialization.values()).contains(Specialization.BACKEND, Specialization.FRONTEND, Specialization.FULLSTACK, Specialization.MOBILE, Specialization.DEVOPS, Specialization.ML_AI);
        assertThat(SubmissionVerdict.values()).contains(SubmissionVerdict.ACCEPTED, SubmissionVerdict.WRONG_ANSWER, SubmissionVerdict.TIME_LIMIT_EXCEEDED, SubmissionVerdict.COMPILATION_ERROR, SubmissionVerdict.RUNTIME_ERROR);
        assertThat(InvitationStatus.values()).contains(InvitationStatus.PENDING, InvitationStatus.ACCEPTED, InvitationStatus.DECLINED, InvitationStatus.INTERVIEW_SCHEDULED);
    }

    @Test
    @DisplayName("Проверка сущности User: билдер, геттеры, сеттеры и жизненный цикл JPA")
    void testUserEntity() {
        UUID id = UUID.randomUUID();
        User user = User.builder()
                .id(id)
                .email("user@fsp.ru")
                .password("pass")
                .fullName("Тестовый Пользователь")
                .role(UserRole.CANDIDATE)
                .avatarUrl("https://example.com/avatar.png")
                .personalDataConsentAccepted(true)
                .build();

        assertThat(user.getId()).isEqualTo(id);
        assertThat(user.getEmail()).isEqualTo("user@fsp.ru");
        assertThat(user.getPassword()).isEqualTo("pass");
        assertThat(user.getFullName()).isEqualTo("Тестовый Пользователь");
        assertThat(user.getRole()).isEqualTo(UserRole.CANDIDATE);
        assertThat(user.getAvatarUrl()).isEqualTo("https://example.com/avatar.png");
        assertThat(user.isPersonalDataConsentAccepted()).isTrue();

        user.onCreate();
        assertThat(user.getCreatedAt()).isNotNull();
        assertThat(user.getUpdatedAt()).isNotNull();
        assertThat(user.getPersonalDataConsentDate()).isNotNull();

        OffsetDateTime prevUpdate = user.getUpdatedAt();
        user.onUpdate();
        assertThat(user.getUpdatedAt()).isAfterOrEqualTo(prevUpdate);

        User emptyUser = new User();
        emptyUser.setEmail("new@test.ru");
        emptyUser.setFullName("Новый");
        assertThat(emptyUser.getEmail()).isEqualTo("new@test.ru");
        assertThat(emptyUser.getFullName()).isEqualTo("Новый");
    }

    @Test
    @DisplayName("Проверка сущности CandidateProfile: билдер, геттеры, сеттеры и жизненный цикл")
    void testCandidateProfileEntity() {
        UUID id = UUID.randomUUID();
        User user = User.builder().fullName("Кандидат").build();

        CandidateProfile profile = CandidateProfile.builder()
                .id(id)
                .user(user)
                .fspId("FSP-100")
                .fspElo(2000)
                .fspRank(FspRank.KMS)
                .specialization(Specialization.BACKEND)
                .grade(Grade.SENIOR)
                .salaryExpectation(300000)
                .location("Москва")
                .bio("Биография")
                .isFspVerified(true)
                .githubUsername("dev")
                .githubReposCount(15)
                .githubCommitsCount(400)
                .yandexId("yandex-123")
                .hhResumeId("hh-456")
                .skills(Set.of("Java", "PostgreSQL"))
                .build();

        assertThat(profile.getId()).isEqualTo(id);
        assertThat(profile.getUser()).isEqualTo(user);
        assertThat(profile.getFspId()).isEqualTo("FSP-100");
        assertThat(profile.getFspElo()).isEqualTo(2000);
        assertThat(profile.getFspRank()).isEqualTo(FspRank.KMS);
        assertThat(profile.getSpecialization()).isEqualTo(Specialization.BACKEND);
        assertThat(profile.getGrade()).isEqualTo(Grade.SENIOR);
        assertThat(profile.getSalaryExpectation()).isEqualTo(300000);
        assertThat(profile.getLocation()).isEqualTo("Москва");
        assertThat(profile.getBio()).isEqualTo("Биография");
        assertThat(profile.isFspVerified()).isTrue();
        assertThat(profile.getGithubUsername()).isEqualTo("dev");
        assertThat(profile.getGithubReposCount()).isEqualTo(15);
        assertThat(profile.getGithubCommitsCount()).isEqualTo(400);
        assertThat(profile.getYandexId()).isEqualTo("yandex-123");
        assertThat(profile.getHhResumeId()).isEqualTo("hh-456");
        assertThat(profile.getSkills()).contains("Java");

        profile.onCreate();
        assertThat(profile.getCreatedAt()).isNotNull();
        profile.onUpdate();
        assertThat(profile.getUpdatedAt()).isNotNull();

        CandidateProfile empty = new CandidateProfile();
        empty.setLocation("Казань");
        assertThat(empty.getLocation()).isEqualTo("Казань");
    }

    @Test
    @DisplayName("Проверка сущности EmployerProfile: билдер, геттеры, сеттеры и жизненный цикл")
    void testEmployerProfileEntity() {
        UUID id = UUID.randomUUID();
        User user = User.builder().fullName("Работодатель").build();

        EmployerProfile employer = EmployerProfile.builder()
                .id(id)
                .user(user)
                .companyName("СберТех")
                .companyLogo("https://logo.png")
                .industry("Банки и Финтех")
                .description("Крупный IT-работодатель")
                .website("https://sbertech.ru")
                .isFspPartner(true)
                .hhEmployerId("hh-sber")
                .build();

        assertThat(employer.getId()).isEqualTo(id);
        assertThat(employer.getUser()).isEqualTo(user);
        assertThat(employer.getCompanyName()).isEqualTo("СберТех");
        assertThat(employer.getCompanyLogo()).isEqualTo("https://logo.png");
        assertThat(employer.getIndustry()).isEqualTo("Банки и Финтех");
        assertThat(employer.getDescription()).isEqualTo("Крупный IT-работодатель");
        assertThat(employer.getWebsite()).isEqualTo("https://sbertech.ru");
        assertThat(employer.isFspPartner()).isTrue();
        assertThat(employer.getHhEmployerId()).isEqualTo("hh-sber");

        employer.onCreate();
        assertThat(employer.getCreatedAt()).isNotNull();
        employer.onUpdate();
        assertThat(employer.getUpdatedAt()).isNotNull();

        EmployerProfile empty = new EmployerProfile();
        empty.setCompanyName("Компания");
        assertThat(empty.getCompanyName()).isEqualTo("Компания");
    }

    @Test
    @DisplayName("Проверка сущности Vacancy: билдер, геттеры, сеттеры и жизненный цикл")
    void testVacancyEntity() {
        UUID id = UUID.randomUUID();
        EmployerProfile employer = EmployerProfile.builder().companyName("Яндекс").build();

        Vacancy vacancy = Vacancy.builder()
                .id(id)
                .employer(employer)
                .title("Java Developer")
                .specialization(Specialization.BACKEND)
                .grade(Grade.MIDDLE)
                .salaryFrom(200000)
                .salaryTo(280000)
                .minFspElo(1500)
                .requiredFspRank(FspRank.FIRST_CLASS)
                .location("Москва")
                .workFormat(WorkFormat.REMOTE)
                .description("Описание вакансии")
                .isActive(true)
                .hhVacancyId("hh-789")
                .requiredSkills(Set.of("Java", "Spring"))
                .build();

        assertThat(vacancy.getId()).isEqualTo(id);
        assertThat(vacancy.getEmployer()).isEqualTo(employer);
        assertThat(vacancy.getTitle()).isEqualTo("Java Developer");
        assertThat(vacancy.getSpecialization()).isEqualTo(Specialization.BACKEND);
        assertThat(vacancy.getGrade()).isEqualTo(Grade.MIDDLE);
        assertThat(vacancy.getSalaryFrom()).isEqualTo(200000);
        assertThat(vacancy.getSalaryTo()).isEqualTo(280000);
        assertThat(vacancy.getMinFspElo()).isEqualTo(1500);
        assertThat(vacancy.getRequiredFspRank()).isEqualTo(FspRank.FIRST_CLASS);
        assertThat(vacancy.getLocation()).isEqualTo("Москва");
        assertThat(vacancy.getWorkFormat()).isEqualTo(WorkFormat.REMOTE);
        assertThat(vacancy.getDescription()).isEqualTo("Описание вакансии");
        assertThat(vacancy.isActive()).isTrue();
        assertThat(vacancy.getHhVacancyId()).isEqualTo("hh-789");
        assertThat(vacancy.getRequiredSkills()).contains("Java");

        vacancy.onCreate();
        assertThat(vacancy.getCreatedAt()).isNotNull();
        vacancy.onUpdate();
        assertThat(vacancy.getUpdatedAt()).isNotNull();

        Vacancy empty = new Vacancy();
        empty.setTitle("Тест");
        assertThat(empty.getTitle()).isEqualTo("Тест");
    }

    @Test
    @DisplayName("Проверка сущности AlgorithmTask: билдер, геттеры, сеттеры и создание")
    void testAlgorithmTaskEntity() {
        UUID id = UUID.randomUUID();
        AlgorithmTask task = AlgorithmTask.builder()
                .id(id)
                .title("Двоичный поиск")
                .slug("binary-search")
                .difficulty("EASY")
                .tags("Алгоритмы, Массивы")
                .description("Реализуйте поиск")
                .inputFormat("Массив чисел")
                .outputFormat("Индекс элемента")
                .timeLimitMs(1000)
                .memoryLimitMb(128)
                .initialCodeJava("class Solution {}")
                .initialCodePython("class Solution: pass")
                .initialCodeCpp("class Solution {};")
                .initialCodeGo("package main")
                .initialCodeJs("function solve() {}")
                .build();

        assertThat(task.getId()).isEqualTo(id);
        assertThat(task.getTitle()).isEqualTo("Двоичный поиск");
        assertThat(task.getSlug()).isEqualTo("binary-search");
        assertThat(task.getDifficulty()).isEqualTo("EASY");
        assertThat(task.getTags()).isEqualTo("Алгоритмы, Массивы");
        assertThat(task.getDescription()).isEqualTo("Реализуйте поиск");
        assertThat(task.getInputFormat()).isEqualTo("Массив чисел");
        assertThat(task.getOutputFormat()).isEqualTo("Индекс элемента");
        assertThat(task.getTimeLimitMs()).isEqualTo(1000);
        assertThat(task.getMemoryLimitMb()).isEqualTo(128);
        assertThat(task.getInitialCodeJava()).isEqualTo("class Solution {}");
        assertThat(task.getInitialCodePython()).isEqualTo("class Solution: pass");
        assertThat(task.getInitialCodeCpp()).isEqualTo("class Solution {};");
        assertThat(task.getInitialCodeGo()).isEqualTo("package main");
        assertThat(task.getInitialCodeJs()).isEqualTo("function solve() {}");

        task.onCreate();
        assertThat(task.getCreatedAt()).isNotNull();

        AlgorithmTask empty = new AlgorithmTask();
        empty.setTitle("Пустая");
        assertThat(empty.getTitle()).isEqualTo("Пустая");
    }

    @Test
    @DisplayName("Проверка сущности TaskSubmission: билдер, геттеры, сеттеры")
    void testTaskSubmissionEntity() {
        UUID id = UUID.randomUUID();
        CandidateProfile candidate = CandidateProfile.builder().fspElo(1600).build();
        AlgorithmTask task = AlgorithmTask.builder().title("Задача").build();

        TaskSubmission submission = TaskSubmission.builder()
                .id(id)
                .candidate(candidate)
                .task(task)
                .language("java")
                .sourceCode("public class Main {}")
                .verdict(SubmissionVerdict.ACCEPTED)
                .executionTimeMs(50)
                .memoryUsedKb(15000)
                .testsPassed(5)
                .totalTests(5)
                .build();

        assertThat(submission.getId()).isEqualTo(id);
        assertThat(submission.getCandidate()).isEqualTo(candidate);
        assertThat(submission.getTask()).isEqualTo(task);
        assertThat(submission.getLanguage()).isEqualTo("java");
        assertThat(submission.getSourceCode()).isEqualTo("public class Main {}");
        assertThat(submission.getVerdict()).isEqualTo(SubmissionVerdict.ACCEPTED);
        assertThat(submission.getExecutionTimeMs()).isEqualTo(50);
        assertThat(submission.getMemoryUsedKb()).isEqualTo(15000);
        assertThat(submission.getTestsPassed()).isEqualTo(5);
        assertThat(submission.getTotalTests()).isEqualTo(5);

        submission.onCreate();
        assertThat(submission.getCreatedAt()).isNotNull();

        TaskSubmission empty = new TaskSubmission();
        empty.setLanguage("cpp");
        assertThat(empty.getLanguage()).isEqualTo("cpp");
    }

    @Test
    @DisplayName("Проверка сущности CandidateAiSummary: билдер, геттеры, сеттеры")
    void testCandidateAiSummaryEntity() {
        UUID id = UUID.randomUUID();
        CandidateProfile candidate = CandidateProfile.builder().fspElo(2100).build();

        CandidateAiSummary summary = CandidateAiSummary.builder()
                .id(id)
                .candidate(candidate)
                .summaryText("Квалифицированный архитектор")
                .keyStrengths(List.of("Архитектура", "Highload"))
                .recommendationLevel("HIGHLY_RECOMMENDED")
                .recommendedRoles(List.of("Staff Engineer"))
                .modelName("YandexGPT 3 Pro")
                .build();

        assertThat(summary.getId()).isEqualTo(id);
        assertThat(summary.getCandidate()).isEqualTo(candidate);
        assertThat(summary.getSummaryText()).isEqualTo("Квалифицированный архитектор");
        assertThat(summary.getKeyStrengths()).contains("Highload");
        assertThat(summary.getRecommendationLevel()).isEqualTo("HIGHLY_RECOMMENDED");
        assertThat(summary.getRecommendedRoles()).contains("Staff Engineer");
        assertThat(summary.getModelName()).isEqualTo("YandexGPT 3 Pro");

        summary.onCreate();
        assertThat(summary.getCreatedAt()).isNotNull();

        CandidateAiSummary empty = new CandidateAiSummary();
        empty.setModelName("GPT-4");
        assertThat(empty.getModelName()).isEqualTo("GPT-4");
    }

    @Test
    @DisplayName("Проверка сущности Invitation: билдер, геттеры, сеттеры и жизненный цикл")
    void testInvitationEntity() {
        UUID id = UUID.randomUUID();
        CandidateProfile candidate = CandidateProfile.builder().fspElo(1800).build();
        EmployerProfile employer = EmployerProfile.builder().companyName("Банк").build();
        Vacancy vacancy = Vacancy.builder().title("Вакансии").build();

        Invitation invitation = Invitation.builder()
                .id(id)
                .candidate(candidate)
                .employer(employer)
                .vacancy(vacancy)
                .salaryOffered(320000)
                .message("Приглашаем на техническое собеседование")
                .status(InvitationStatus.PENDING)
                .build();

        assertThat(invitation.getId()).isEqualTo(id);
        assertThat(invitation.getCandidate()).isEqualTo(candidate);
        assertThat(invitation.getEmployer()).isEqualTo(employer);
        assertThat(invitation.getVacancy()).isEqualTo(vacancy);
        assertThat(invitation.getSalaryOffered()).isEqualTo(320000);
        assertThat(invitation.getMessage()).isEqualTo("Приглашаем на техническое собеседование");
        assertThat(invitation.getStatus()).isEqualTo(InvitationStatus.PENDING);

        invitation.onCreate();
        assertThat(invitation.getCreatedAt()).isNotNull();
        invitation.onUpdate();
        assertThat(invitation.getUpdatedAt()).isNotNull();

        Invitation empty = new Invitation();
        empty.setStatus(InvitationStatus.ACCEPTED);
        empty.setIdempotencyKey("idem-test-999");
        assertThat(empty.getStatus()).isEqualTo(InvitationStatus.ACCEPTED);
        assertThat(empty.getIdempotencyKey()).isEqualTo("idem-test-999");
    }

    @Test
    @DisplayName("Проверка сущности IdempotencyRecord: билдер, геттеры и жизненный цикл")
    void testIdempotencyRecordEntity() {
        UUID id = UUID.randomUUID();
        IdempotencyRecord record = IdempotencyRecord.builder()
                .id(id)
                .idempotencyKey("idem-key-1")
                .requestPath("/api/v1/offers")
                .requestHash("abc123hash")
                .responseStatus(201)
                .responseBody("{\"id\":\"test\"}")
                .build();

        assertThat(record.getId()).isEqualTo(id);
        assertThat(record.getIdempotencyKey()).isEqualTo("idem-key-1");
        assertThat(record.getRequestPath()).isEqualTo("/api/v1/offers");
        assertThat(record.getResponseStatus()).isEqualTo(201);

        record.onCreate();
        assertThat(record.getCreatedAt()).isNotNull();
        assertThat(record.getExpiresAt()).isNotNull();
    }
}
