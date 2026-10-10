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

    @Schema(description = "Провайдер нейросети (GEMINI, YANDEX_GPT, OPENROUTER, OLLAMA)", example = "GEMINI")
    private String provider;

    @Schema(description = "Конкретная модель нейросети", example = "gemini-1.5-flash")
    private String model;

    @Schema(description = "Альтернативное имя поля модели", example = "gemini-1.5-flash")
    private String modelName;

    @Schema(description = "Пользовательский API-ключ (если введен на фронтенде)", example = "AIzaSy...")
    private String apiKey;

    @Schema(description = "Альтернативное имя поля пользовательского API-ключа", example = "AIzaSy...")
    private String customApiKey;

    @Schema(description = "Идентификатор каталога Yandex Cloud (для YandexGPT)", example = "b1gmockfolderid")
    private String folderId;

    @Schema(description = "Пользовательский URL локального эндпоинта (для Ollama)", example = "http://localhost:11434/v1/chat/completions")
    private String endpointUrl;

    @Schema(description = "Фокус анализа (HIGH_LOAD_CORE, ALGORITHMS, TECH_LEAD, BALANCED)", example = "HIGH_LOAD_CORE")
    private String focus;

    @Schema(description = "Принудительное обновление кэша (игнорировать ранее сохраненный отчет)", example = "false")
    @Builder.Default
    private boolean forceRefresh = false;

    public String getEffectiveModel() {
        if (modelName != null && !modelName.isBlank()) return modelName;
        return model;
    }

    public String getEffectiveApiKey() {
        if (customApiKey != null && !customApiKey.isBlank()) return customApiKey;
        return apiKey;
    }
}
