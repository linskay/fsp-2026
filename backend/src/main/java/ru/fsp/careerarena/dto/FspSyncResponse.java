package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import ru.fsp.careerarena.entity.enums.FspRank;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Результат верификации и синхронизации с ФСП")
public class FspSyncResponse {

    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @Schema(description = "Верифицированный спортивный FSP ID")
    private String fspId;

    @Schema(description = "Присвоенный спортивный разряд ФСП")
    private FspRank fspRank;

    @Schema(description = "Текущий спортивный ELO-рейтинг")
    private int fspElo;

    @com.fasterxml.jackson.annotation.JsonProperty("isFspVerified")
    @Schema(description = "Флаг официальной верификации в реестре")
    private boolean isFspVerified;

    @Schema(description = "Время синхронизации")
    private OffsetDateTime syncedAt;

    @Schema(description = "Статус и сообщение верификации")
    private String message;
}
