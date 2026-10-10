package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Системное уведомление пользователя платформы")
public class NotificationDto {

    @Schema(description = "ID уведомления")
    private UUID id;

    @Schema(description = "Заголовок уведомления")
    private String title;

    @Schema(description = "Текст уведомления")
    private String message;

    @Schema(description = "Тип уведомления (OFFER, INVITATION, CHAT, GRADE_TEST, VERIFICATION, SYSTEM)")
    private String type;

    @Schema(description = "Идентификатор связанной сущности (например, offerId)")
    private String entityId;

    @Schema(description = "Прочитано ли уведомление")
    private boolean read;

    @Schema(description = "Дата и время создания")
    private OffsetDateTime createdAt;
}
