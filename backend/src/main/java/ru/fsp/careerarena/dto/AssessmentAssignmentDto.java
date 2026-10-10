package ru.fsp.careerarena.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Назначенное тестирование / задача для соискателя")
public class AssessmentAssignmentDto {

    @Schema(description = "ID назначения")
    private UUID id;

    @Schema(description = "ID работодателя")
    private UUID employerId;

    @Schema(description = "Название компании")
    private String companyName;

    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @Schema(description = "ФИО кандидата")
    private String candidateName;

    @Schema(description = "Название задачи")
    private String taskTitle;

    @Schema(description = "Сложность")
    private String taskDifficulty;

    @Schema(description = "Условие задачи")
    private String taskDescription;

    @Schema(description = "Стартовый код")
    private String starterCode;

    @Schema(description = "Лимит времени (минут)")
    private int timeLimitMinutes;

    @Schema(description = "Статус (PENDING, IN_PROGRESS, SUBMITTED, REVIEWED)")
    private String status;

    @JsonProperty("isLiveInterview")
    @Schema(description = "Является ли лайв-интервью")
    private boolean liveInterview;

    @Schema(description = "Ссылка на комнату Яндекс Телемост")
    private String telemostRoomUrl;

    @Schema(description = "Запланированное время интервью")
    private OffsetDateTime scheduledInterviewAt;

    @Schema(description = "Язык решения")
    private String submissionLanguage;

    @Schema(description = "Пройдено тестов")
    private Integer testsPassed;

    @Schema(description = "Всего тестов")
    private Integer totalTests;

    @Schema(description = "Время исполнения (мс)")
    private Integer executionTimeMs;

    @Schema(description = "Время сдачи решения")
    private OffsetDateTime submittedAt;

    @Schema(description = "Вердикт ревьюера (HIRED, REJECTED, LIKE, DISLIKE)")
    private String reviewVerdict;

    @Schema(description = "Приватный комментарий для компании")
    private String internalNote;

    @Schema(description = "Сообщение для кандидата")
    private String candidateFeedbackMessage;

    @Schema(description = "ФИО ревьюера")
    private String reviewerName;

    @Schema(description = "Время проведения ревью")
    private OffsetDateTime reviewedAt;

    @Schema(description = "Дата создания")
    private OffsetDateTime createdAt;
}
