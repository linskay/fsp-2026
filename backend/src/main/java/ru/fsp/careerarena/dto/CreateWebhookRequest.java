package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на регистрацию внешнего веб-хука для ATS или Telegram-ботов")
public class CreateWebhookRequest {

    @NotNull(message = "ID работодателя обязателен")
    @Schema(description = "UUID профиля компании работодателя", example = "b2c3d4e5-f6a7-48b9-bc01-def234567890", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID employerId;

    @NotBlank(message = "URL эндпоинта веб-хука обязателен")
    @Schema(description = "URL эндпоинта для отправки HTTP POST запросов", example = "https://ats.sber.ru/api/v1/fsp-hook-receiver", requiredMode = Schema.RequiredMode.REQUIRED)
    private String url;

    @Schema(description = "Секретный токен для подписи полезной нагрузки HMAC-SHA256 (заголовок X-FSP-Signature)", example = "sber_fsp_secret_webhook_token_2026")
    private String secretToken;

    @Schema(description = "Список отслеживаемых событий через запятую", example = "OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED")
    private String events;

    @Schema(description = "Понятное описание или название внешней системы", example = "Интеграция с корпоративной ATS Сбера (Webhooks)")
    private String description;
}
