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
@Schema(description = "DTO зарегистрированного внешнего веб-хука работодателя")
public class EmployerWebhookDto {

    @Schema(description = "Уникальный идентификатор веб-хука", example = "wh-7f9a8b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c")
    private UUID id;

    @Schema(description = "ID профиля работодателя", example = "b2c3d4e5-f6a7-48b9-bc01-def234567890")
    private UUID employerId;

    @Schema(description = "Целевой URL эндпоинта веб-хука", example = "https://ats.sber.ru/api/v1/fsp-hook-receiver")
    private String url;

    @Schema(description = "Секретный токен для генерации подписи HMAC-SHA256", example = "sber_fsp_secret_webhook_token_2026")
    private String secretToken;

    @Schema(description = "Подписанные события", example = "OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED")
    private String events;

    @Schema(description = "Описание веб-хука", example = "Интеграция с корпоративной ATS Сбера (Webhooks)")
    private String description;

    @Schema(description = "Активен ли веб-хук", example = "true")
    private boolean active;

    @Schema(description = "HTTP статус код последнего вызова", example = "200")
    private Integer lastStatusCode;

    @Schema(description = "Временная метка последней отправки события")
    private OffsetDateTime lastTriggeredAt;

    @Schema(description = "Дата и время создания веб-хука")
    private OffsetDateTime createdAt;
}
