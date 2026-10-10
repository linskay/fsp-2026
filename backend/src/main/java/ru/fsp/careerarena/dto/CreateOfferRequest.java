package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос работодателя на отправку оффера / приглашения кандидату с зарплатной вилкой (Reverse Recruiting)")
public class CreateOfferRequest {

    @NotNull(message = "ID кандидата обязателен")
    @Schema(description = "ID профиля соискателя", example = "c1111111-1111-1111-1111-111111111111", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID candidateId;

    @NotNull(message = "ID работодателя обязателен")
    @Schema(description = "ID работодателя", example = "e1111111-1111-1111-1111-111111111111", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID employerId;

    @Schema(description = "ID вакансии (опционально, если оффер привязан к конкретной позиции)")
    private UUID vacancyId;

    @Schema(description = "Название позиции / специализации", example = "Senior Java / Highload Engineer")
    private String positionTitle;

    @Schema(description = "Нижняя планка зарплатной вилки в рублях", example = "350000")
    private Integer salaryFrom;

    @Schema(description = "Верхняя планка зарплатной вилки в рублях", example = "500000")
    private Integer salaryTo;

    @Schema(description = "Точная предлагаемая зарплата (если вилка фиксирована)", example = "420000")
    private Integer salaryOffered;

    @Schema(description = "Текст оффера, описание задачи или сопроводительное письмо техлида",
            example = "Здравствуйте! Приглашаем на позицию Senior Backend в команду ядра. Ваши алгоритмические результаты в Арене ФСП идеально подходят под наши задачи.")
    private String message;

    @Schema(description = "Алиас для message / описания вакансии", example = "Описание задачи")
    private String description;
}
