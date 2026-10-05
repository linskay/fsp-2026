package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.SubmissionVerdict;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Результат прогона алгоритмического кода в изолированном контейнере Judge0")
public class CodeExecutionResult {

    @Schema(description = "ID сабмишена в базе данных", example = "s1111111-1111-1111-1111-111111111111")
    private UUID submissionId;

    @Schema(description = "Итоговый вердикт системы тестирования", example = "ACCEPTED")
    private SubmissionVerdict verdict;

    @Schema(description = "Текстовое описание статуса проверки", example = "Решение принято! Все тест-кейсы успешно пройдены.")
    private String statusMessage;

    @Schema(description = "Количество успешно пройденных тест-кейсов", example = "5")
    private int testsPassed;

    @Schema(description = "Общее количество тест-кейсов в наборе", example = "5")
    private int totalTests;

    @Schema(description = "Время исполнения самого тяжелого теста (мс)", example = "42")
    private int executionTimeMs;

    @Schema(description = "Объем использованной оперативной памяти (КБ)", example = "14200")
    private int memoryUsedKb;

    @Schema(description = "Стандартный вывод (stdout)", example = "Running 5 test suites...\n[PASS] Test #1\n[PASS] Test #2\nResult: OK")
    private String stdout;

    @Schema(description = "Стандартный вывод ошибок / логи компилятора (stderr)", example = "null")
    private String stderr;

    @Schema(description = "Временная метка отправки решения", example = "2026-10-05T08:30:00Z")
    private OffsetDateTime submittedAt;
}
