package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Сессия прохождения квалификационного теста")
public class GradeTestSessionDto {

    @Schema(description = "ID попытки тестирования")
    private UUID attemptId;

    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @Schema(description = "Специализация")
    private Specialization specialization;

    @Schema(description = "Целевой грейд")
    private Grade targetGrade;

    @Schema(description = "Список вопросов теста")
    private List<TestQuestionDto> questions;

    @Schema(description = "Лимит времени в минутах")
    private int timeLimitMinutes;

    @Schema(description = "Время старта")
    private OffsetDateTime startedAt;
}
