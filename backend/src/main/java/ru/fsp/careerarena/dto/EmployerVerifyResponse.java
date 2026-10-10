package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Результат проверки и верификации работодателя")
public class EmployerVerifyResponse {

    @Schema(description = "ID работодателя")
    private UUID employerId;

    @Schema(description = "Статус верификации")
    private String status;

    @Schema(description = "ИНН")
    private String inn;

    @Schema(description = "Официальный статус аккредитации ФСП")
    private boolean isFspPartner;

    @Schema(description = "Дата прохождения проверки")
    private OffsetDateTime verifiedAt;

    @Schema(description = "Информационное заключение проверки")
    private String message;
}
