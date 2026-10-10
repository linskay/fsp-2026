package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Решение соискателя по назначенному тестированию (для страницы код-ревью)")
public class AssessmentSubmissionDto {

    @Schema(description = "ID назначения")
    private UUID id;

    @Schema(description = "ID соискателя")
    private UUID candidateId;

    @Schema(description = "ФИО соискателя")
    private String candidateName;

    @Schema(description = "Название задачи")
    private String taskTitle;

    @Schema(description = "Исходный код решения")
    private String code;

    @Schema(description = "Язык программирования")
    private String language;

    @Schema(description = "Количество успешно пройденных тестов")
    private Integer testsPassed;

    @Schema(description = "Всего тестовых сценариев")
    private Integer totalTests;

    @Schema(description = "Время исполнения (мс)")
    private Integer executionTimeMs;

    @Schema(description = "Время сдачи решения")
    private OffsetDateTime submittedAt;

    @Schema(description = "Статус проверки")
    private String status;

    @Schema(description = "Вынесенный вердикт (если проверка завершена)")
    private String reviewVerdict;

    @Schema(description = "Приватный комментарий для компании")
    private String internalNote;

    @Schema(description = "Обратная связь кандидату")
    private String candidateFeedbackMessage;
}
