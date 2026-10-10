package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Результат проверки тестового пинга веб-хука")
public class WebhookPingResponse {

    @Schema(description = "ID проверенного веб-хука", example = "wh-7f9a8b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c")
    private UUID webhookId;

    @Schema(description = "Целевой URL", example = "https://ats.sber.ru/api/v1/fsp-hook-receiver")
    private String url;

    @Schema(description = "Код HTTP ответа от сервера-получателя", example = "200")
    private int statusCode;

    @Schema(description = "Флаг успешности доставки", example = "true")
    private boolean success;

    @Schema(description = "Понятное статусное сообщение", example = "Веб-хук успешно доставлен (HTTP 200 OK)")
    private String message;

    @Schema(description = "Временная метка выполнения запроса")
    private OffsetDateTime timestamp;

    @Schema(description = "Пример отправленной полезной нагрузки (JSON)", example = "{\"event\": \"PING\", \"message\": \"FSP Career Arena Webhook Verification\"}")
    private String payloadSample;
}
