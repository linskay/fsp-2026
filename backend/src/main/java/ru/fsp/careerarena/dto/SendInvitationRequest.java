package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос работодателя на отправку прямого оффера / приглашения кандидату")
public class SendInvitationRequest {

    @NotNull(message = "ID кандидата обязателен")
    @Schema(description = "Идентификатор кандидата ФСП", example = "c1111111-1111-1111-1111-111111111111", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID candidateId;

    @NotNull(message = "ID работодателя обязателен")
    @Schema(description = "Идентификатор компании-работодателя", example = "e1111111-1111-1111-1111-111111111111", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID employerId;

    @Schema(description = "Идентификатор конкретной вакансии (если приглашение привязано к позиции)", example = "v1111111-1111-1111-1111-111111111111")
    private UUID vacancyId;

    @NotNull(message = "Предлагаемая зарплата обязательна")
    @Min(value = 10000, message = "Предлагаемая зарплата не может быть меньше 10 000 руб.")
    @Max(value = 10000000, message = "Предлагаемая зарплата не может превышать 10 000 000 руб.")
    @Schema(description = "Предлагаемая зарплата в рублях (net/gross)", example = "420000", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer salaryOffered;

    @NotBlank(message = "Сопроводительное сообщение обязательно")
    @Size(min = 10, max = 5000, message = "Сообщение должно содержать от 10 до 5000 символов")
    @Schema(description = "Текст персонального приглашения со стороны техлида или HR", example = "Здравствуйте, Александр! Впечатлены вашим рейтингом ФСП 2740 и решениями графовых задач на алгоритмической арене...", requiredMode = Schema.RequiredMode.REQUIRED)
    private String message;
}
