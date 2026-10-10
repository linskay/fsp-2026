package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос работодателя на назначение кастомного тестирования / лайв-интервью кандидату")
public class AssignAssessmentRequest {

    @NotNull
    @Schema(description = "ID профиля работодателя")
    private UUID employerId;

    @NotNull
    @Schema(description = "ID профиля соискателя")
    private UUID candidateId;

    @NotBlank
    @Schema(description = "Название задачи")
    private String taskTitle;

    @Schema(description = "Сложность (Easy, Medium, Hard)")
    @Builder.Default
    private String taskDifficulty = "Medium";

    @NotBlank
    @Schema(description = "Условие задачи и требования")
    private String taskDescription;

    @Schema(description = "Стартовый шаблон кода")
    private String starterCode;

    @Schema(description = "Лимит времени на решение (минут)")
    @Builder.Default
    private int timeLimitMinutes = 45;

    @Schema(description = "Проводится ли в формате Лайв-интервью")
    @Builder.Default
    private boolean isLiveInterview = false;

    @Schema(description = "Дата и время проведения (для лайв-интервью)")
    private OffsetDateTime scheduledInterviewAt;
}
