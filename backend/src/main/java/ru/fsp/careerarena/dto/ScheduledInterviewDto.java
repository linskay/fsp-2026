package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запланированное Лайв-интервью в Яндекс Телемосте")
public class ScheduledInterviewDto {

    @Schema(description = "ID интервью")
    private UUID id;

    @Schema(description = "ID работодателя")
    private UUID employerId;

    @Schema(description = "Название компании")
    private String companyName;

    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @Schema(description = "ФИО кандидата")
    private String candidateName;

    @Schema(description = "Тема / Должность")
    private String title;

    @Schema(description = "Время собеседования")
    private OffsetDateTime scheduledAt;

    @Schema(description = "Ссылка для подключения к Яндекс Телемост")
    private String telemostRoomUrl;

    @Schema(description = "Статус интервью (SCHEDULED, COMPLETED, CANCELLED)")
    private String status;

    @Schema(description = "Дата создания")
    private OffsetDateTime createdAt;
}
