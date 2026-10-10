package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на отправку сообщения в чат по офферу")
public class SendMessageRequest {

    @NotNull(message = "ID оффера/комнаты обязателен")
    @Schema(description = "ID оффера / комнаты", example = "o1111111-1111-1111-1111-111111111111", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID offerId;

    @Schema(description = "ID отправителя")
    private UUID senderId;

    @Schema(description = "Роль отправителя (CANDIDATE или EMPLOYER)", example = "CANDIDATE")
    private String senderRole;

    @Schema(description = "Имя отправителя", example = "Иван Пестерев")
    private String senderName;

    @NotBlank(message = "Текст сообщения не может быть пустым")
    @Schema(description = "Текст сообщения", example = "Добрый день! Готов пройти интервью в среду в 15:00.", requiredMode = Schema.RequiredMode.REQUIRED)
    private String text;
}
