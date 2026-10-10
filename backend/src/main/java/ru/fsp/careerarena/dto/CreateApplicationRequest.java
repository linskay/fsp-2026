package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос соискателя на отклик на открытую вакансию")
public class CreateApplicationRequest {

    @NotNull
    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @NotNull
    @Schema(description = "ID вакансии компании")
    private UUID vacancyId;

    @Schema(description = "Сопроводительное письмо соискателя")
    private String coverLetter;
}
