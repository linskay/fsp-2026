package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Запрос на генерацию технического портрета кандидата с выбором нейросетевого провайдера")
public class GenerateAiSummaryRequest {

    @NotNull(message = "ID кандидата обязателен")
    @Schema(description = "Идентификатор кандидата ФСП", example = "c1111111-1111-1111-1111-111111111111", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID candidateId;

    @Schema(description = "Провайдер нейросети (gemini, yandexgpt, openrouter, ollama)", example = "gemini")
    private String provider;

    @Schema(description = "Конкретная модель нейросети", example = "gemini-1.5-flash")
    private String model;

    @Schema(description = "Пользовательский API-ключ (если введен на фронтенде)", example = "AIzaSy...")
    private String apiKey;

    @Schema(description = "Идентификатор каталога Yandex Cloud (для YandexGPT)", example = "b1gmockfolderid")
    private String folderId;

    @Schema(description = "Пользовательский URL локального эндпоинта (для Ollama)", example = "http://localhost:11434/v1/chat/completions")
    private String endpointUrl;

    @Schema(description = "Фокус анализа (highload, algo, lead, balanced)", example = "highload")
    private String focus;

    @Schema(description = "Принудительное обновление кэша (игнорировать ранее сохраненный отчет)", example = "false")
    @Builder.Default
    private boolean forceRefresh = false;
}
