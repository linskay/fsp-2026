package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Сообщение в чате по офферу / диалогу")
public class ChatMessageDto {

    @Schema(description = "ID сообщения", example = "m1111111-1111-1111-1111-111111111111")
    private UUID id;

    @Schema(description = "ID оффера / диалога", example = "o1111111-1111-1111-1111-111111111111")
    private UUID offerId;

    @Schema(description = "ID отправителя")
    private UUID senderId;

    @Schema(description = "Роль отправителя (CANDIDATE, EMPLOYER, SYSTEM)", example = "EMPLOYER")
    private String senderRole;

    @Schema(description = "Имя отправителя", example = "Елена Романова (СberTech HR)")
    private String senderName;

    @Schema(description = "Текст сообщения", example = "Здравствуйте! Готовы обсудить дату технического интервью?")
    private String text;

    @Schema(description = "Дата и время отправки")
    private OffsetDateTime createdAt;
}
