package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на планирование Лайв-интервью и генерацию комнаты в Яндекс Телемост")
public class ScheduleInterviewRequest {

    @NotNull
    @Schema(description = "ID работодателя")
    private UUID employerId;

    @NotNull
    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @NotBlank
    @Schema(description = "Тема / Название собеседования")
    private String title;

    @NotNull
    @Schema(description = "Запланированная дата и время")
    private OffsetDateTime scheduledAt;

    @Schema(description = "Кастомная ссылка на Яндекс Телемост (при наличии, иначе генерируется)")
    private String telemostRoomUrl;
}
