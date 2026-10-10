package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на синхронизацию с реестром Федерации спортивного программирования")
public class FspSyncRequest {

    @NotNull
    @Schema(description = "ID кандидата в системе")
    private UUID candidateId;

    @Schema(description = "Официальный FSP ID (при наличии, иначе генерируется по стандарту ФСП)")
    private String fspId;

    @Schema(description = "ID учетной записи Keycloak / Единого окна ФСП")
    private String idKeycloak;
}
