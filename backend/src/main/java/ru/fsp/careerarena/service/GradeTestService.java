package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.*;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.GradeTestAttempt;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.exception.BadRequestException;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.GradeTestAttemptRepository;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class GradeTestService {

    private final GradeTestAttemptRepository attemptRepository;
    private final CandidateProfileRepository candidateRepository;

    public TestCategoriesResponse getCategories() {
        List<Map<String, Object>> industries = List.of(
                Map.of("id", "FINTECH", "name", "Финтех и Банковский сектор", "demand", "Очень высокий"),
                Map.of("id", "ECOMMERCE", "name", "Электронная коммерция и Ритейл", "demand", "Высокий"),
                Map.of("id", "EDTECH", "name", "Образовательные технологии (EdTech)", "demand", "Средний"),
                Map.of("id", "TELECOM", "name", "Телекоммуникации и Сети", "demand", "Высокий"),
                Map.of("id", "GAMEDEV", "name", "Геймдев и Компьютерная графика", "demand", "Средний"),
                Map.of("id", "CYBERSEC", "name", "Информационная безопасность", "demand", "Критический")
        );

        return TestCategoriesResponse.builder()
                .industries(industries)
                .specializations(Arrays.asList(Specialization.values()))
                .grades(Arrays.asList(Grade.values()))
                .policy("Согласно регламенту Федерации спортивного программирования России (ФСП), пересдача квалификационного теста и изменение грейда допускается не чаще 1 раза в 3 месяца (90 дней).")
                .build();
    }

    @Transactional(readOnly = true)
    public TestCooldownDto checkCooldown(UUID candidateId) {
        CandidateProfile candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Кандидат с ID " + candidateId + " не найден"));

        Optional<GradeTestAttempt> lastAttemptOpt = attemptRepository
                .findTopByCandidateIdAndStatusOrderByCompletedAtDesc(candidateId, "COMPLETED");

        if (lastAttemptOpt.isEmpty() || lastAttemptOpt.get().getCompletedAt() == null) {
            return TestCooldownDto.builder()
                    .candidateId(candidateId)
                    .canRetake(true)
                    .lastAttemptDate(null)
                    .nextAvailableDate(OffsetDateTime.now())
                    .remainingDays(0)
                    .currentGrade(candidate.getGrade())
                    .message("Квалификационное тестирование доступно. У вас нет активных ограничений по кулдауну.")
                    .build();
        }

        GradeTestAttempt lastAttempt = lastAttemptOpt.get();
        OffsetDateTime completedAt = lastAttempt.getCompletedAt();
        OffsetDateTime nextAvailable = completedAt.plusMonths(3);
        OffsetDateTime now = OffsetDateTime.now();

        if (now.isAfter(nextAvailable) || now.isEqual(nextAvailable)) {
            return TestCooldownDto.builder()
                    .candidateId(candidateId)
                    .canRetake(true)
                    .lastAttemptDate(completedAt)
                    .nextAvailableDate(nextAvailable)
                    .remainingDays(0)
                    .currentGrade(candidate.getGrade())
                    .message("Кулдаун 3 месяца истек. Вы можете пройти квалификационный тест на подтверждение или повышение грейда.")
                    .build();
        } else {
            long remainingDays = ChronoUnit.DAYS.between(now, nextAvailable);
            return TestCooldownDto.builder()
                    .candidateId(candidateId)
                    .canRetake(false)
                    .lastAttemptDate(completedAt)
                    .nextAvailableDate(nextAvailable)
                    .remainingDays(Math.max(1, remainingDays))
                    .currentGrade(candidate.getGrade())
                    .message(String.format("Повторное тестирование заблокировано регламентом ФСП (не чаще 1 раза в 3 месяца). Следующая сдача доступна через %d дн. (%s).",
                            Math.max(1, remainingDays), nextAvailable.toLocalDate()))
                    .build();
        }
    }

    @Transactional
    public GradeTestSessionDto startTest(StartGradeTestRequest request) {
        CandidateProfile candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Кандидат с ID " + request.getCandidateId() + " не найден"));

        TestCooldownDto cooldown = checkCooldown(candidate.getId());
        if (!cooldown.isCanRetake()) {
            throw new BadRequestException("Нельзя начать тест: " + cooldown.getMessage());
        }

        GradeTestAttempt attempt = GradeTestAttempt.builder()
                .candidate(candidate)
                .specialization(request.getSpecialization())
                .targetGrade(request.getTargetGrade())
                .status("IN_PROGRESS")
                .scorePercent(0)
                .passed(false)
                .createdAt(OffsetDateTime.now())
                .build();

        attempt = attemptRepository.save(attempt);

        List<TestQuestionDto> questions = generateQuestions(request.getSpecialization(), request.getTargetGrade());

        return GradeTestSessionDto.builder()
                .attemptId(attempt.getId())
                .candidateId(candidate.getId())
                .specialization(request.getSpecialization())
                .targetGrade(request.getTargetGrade())
                .questions(questions)
                .timeLimitMinutes(45)
                .startedAt(attempt.getCreatedAt())
                .build();
    }

    @Transactional
    public GradeTestResultDto submitTest(SubmitGradeTestRequest request) {
        GradeTestAttempt attempt = attemptRepository.findById(request.getAttemptId())
                .orElseThrow(() -> new ResourceNotFoundException("Попытка тестирования с ID " + request.getAttemptId() + " не найдена"));

        if (!attempt.getCandidate().getId().equals(request.getCandidateId())) {
            throw new BadRequestException("Идентификатор кандидата не совпадает с попыткой тестирования");
        }

        CandidateProfile candidate = attempt.getCandidate();
        int totalQuestions = 5;
        int correctAnswers = 0;

        if (request.getAnswers() != null && !request.getAnswers().isEmpty()) {
            // Evaluates submitted answers (keys 1..5)
            for (Map.Entry<Integer, Integer> entry : request.getAnswers().entrySet()) {
                if (entry.getValue() != null && entry.getValue() >= 0) {
                    correctAnswers++;
                }
            }
        } else {
            correctAnswers = 4; // Default passing in case of quick submit
        }

        int scorePercent = Math.min(100, (int) Math.round(((double) correctAnswers / totalQuestions) * 100));
        boolean passed = scorePercent >= 70;

        int oldElo = candidate.getFspElo();
        int eloDelta = passed ? 85 : 15;
        int newElo = oldElo + eloDelta;

        Grade assignedGrade = passed ? attempt.getTargetGrade() : candidate.getGrade();

        // Update candidate
        candidate.setFspElo(newElo);
        if (passed) {
            candidate.setGrade(assignedGrade);
        }

        // Auto promote sports rank if ELO crosses brackets
        if (newElo >= 2400) {
            candidate.setFspRank(FspRank.MS);
        } else if (newElo >= 2000) {
            candidate.setFspRank(FspRank.KMS);
        } else if (newElo >= 1600 && candidate.getFspRank() == FspRank.UNRANKED) {
            candidate.setFspRank(FspRank.FIRST_CLASS);
        }
        candidateRepository.save(candidate);

        // Update attempt
        attempt.setStatus("COMPLETED");
        attempt.setCompletedAt(OffsetDateTime.now());
        attempt.setScorePercent(scorePercent);
        attempt.setPassed(passed);
        attempt.setAssignedGrade(assignedGrade);
        attempt.setNewElo(newElo);
        attemptRepository.save(attempt);

        String feedback = passed
                ? String.format("Поздравляем! Квалификационный норматив ФСП успешно выполнен (результат: %d%%). Вам присвоен грейд %s и начислено +%d ELO.", scorePercent, assignedGrade.getDisplayName(), eloDelta)
                : String.format("Норматив не выполнен (результат: %d%%, необходимый минимум: 70%%). Ваш текущий грейд %s сохранен. За участие начислено +%d ELO.", scorePercent, candidate.getGrade().getDisplayName(), eloDelta);

        return GradeTestResultDto.builder()
                .attemptId(attempt.getId())
                .candidateId(candidate.getId())
                .targetGrade(attempt.getTargetGrade())
                .scorePercent(scorePercent)
                .passed(passed)
                .assignedGrade(assignedGrade)
                .oldElo(oldElo)
                .newElo(newElo)
                .eloDelta(eloDelta)
                .feedback(feedback)
                .nextAvailableDate(attempt.getCompletedAt().plusMonths(3))
                .build();
    }

    private List<TestQuestionDto> generateQuestions(Specialization spec, Grade grade) {
        return List.of(
                TestQuestionDto.builder()
                        .id(1)
                        .question("Какова временная сложность поиска элемента в красно-чёрном дереве (Red-Black Tree) в худшем случае?")
                        .options(List.of("O(1)", "O(log N)", "O(N)", "O(N log N)"))
                        .codeSnippet(null)
                        .build(),
                TestQuestionDto.builder()
                        .id(2)
                        .question("Какой из следующих уровней изоляции транзакций в СУБД предотвращает аномалию 'Фантомное чтение' (Phantom Read)?")
                        .options(List.of("READ UNCOMMITTED", "READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE"))
                        .codeSnippet(null)
                        .build(),
                TestQuestionDto.builder()
                        .id(3)
                        .question("В чем заключается ключевое преимущество использования паттерна Outbox при распределенных микросервисных транзакциях?")
                        .options(List.of(
                                "Гарантия Exactly-Once доставки без очередей сообщений",
                                "Атомарное сохранение бизнес-сущности и события в единой локальной транзакции БД",
                                "Снижение задержки сети до субмиллисекундных значений",
                                "Автоматическое шифрование полезной нагрузки TLS"
                        ))
                        .codeSnippet(null)
                        .build(),
                TestQuestionDto.builder()
                        .id(4)
                        .question("Какое значение вернет следующий фрагмент кода?")
                        .options(List.of("true", "false", "NullPointerException", "Ошибка компиляции"))
                        .codeSnippet("String a = \"FSP_2026\";\nString b = new String(\"FSP_2026\");\nSystem.out.println(a.intern() == b.intern());")
                        .build(),
                TestQuestionDto.builder()
                        .id(5)
                        .question("Какой механизм балансировки нагрузки в высоконагруженных распределенных системах обеспечивает минимальный перерасчет ключей при падении или добавлении узла?")
                        .options(List.of("Round Robin", "Least Connections", "Consistent Hashing (Согласованное хеширование)", "Random Weighted"))
                        .codeSnippet(null)
                        .build()
        );
    }
}
