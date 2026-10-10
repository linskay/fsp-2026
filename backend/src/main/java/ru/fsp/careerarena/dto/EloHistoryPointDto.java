package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Точка в истории прогресса ELO-рейтинга кандидата ФСП")
public class EloHistoryPointDto {

    @Schema(description = "Дата фиксации рейтинга")
    private OffsetDateTime date;

    @Schema(description = "Значение ELO на момент события")
    private int elo;

    @Schema(description = "Изменение рейтинга (+/-)")
    private int change;

    @Schema(description = "Название спортивного турнира или события")
    private String event;

    @Schema(description = "Тип события (CHAMPIONSHIP, QUALIFICATION_TEST, ARENA_ROUND, INITIAL, GITHUB_SYNC)")
    private String eventType;
}
