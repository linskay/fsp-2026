package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Жалоба соискателя на подозрительную или фиктивную вакансию (Антифрод ФСП)")
public class VacancyReportRequest {

    @Schema(description = "ID кандидата, подающего жалобу")
    private UUID candidateId;

    @NotBlank
    @Schema(description = "Причина жалобы (FICTITIOUS_SALARY, FAKE_COMPANY, SPAM, DISCRIMINATION, OTHER)")
    private String reason;

    @Schema(description = "Подробный комментарий соискателя")
    private String comment;
}
