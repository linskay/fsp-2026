package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на сохранение результатов код-ревью и оценки соискателя")
public class ReviewAssessmentRequest {

    @NotBlank
    @Schema(description = "Вердикт ревьюера: HIRED, REJECTED, LIKE, DISLIKE")
    private String verdict;

    @Schema(description = "Внутренний комментарий для компании (скрыт от соискателя)")
    private String internalNote;

    @Schema(description = "Сообщение для кандидата в личный кабинет")
    private String candidateFeedbackMessage;

    @Schema(description = "ФИО или логин проверяющего")
    private String reviewerName;
}
