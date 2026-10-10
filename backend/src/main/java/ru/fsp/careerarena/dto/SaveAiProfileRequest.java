package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на сохранение сгенерированного ИИ-портрета в профиль соискателя")
public class SaveAiProfileRequest {

    @NotNull(message = "ID кандидата обязателен")
    @Schema(description = "UUID кандидата", example = "e7518117-f0d9-4c2e-9af7-829fecbd9107", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID candidateId;

    @Schema(description = "Сгенерированный текст саммари / технического портрета", example = "Опытный Senior разработчик с глубокой экспертизой в алгоритмах и Highload-архитектуре.")
    private String summaryText;

    @Schema(description = "Оценка чистоты кода (0-100)", example = "98")
    private Integer codeCleanlinessScore;

    @Schema(description = "Ключевые сильные стороны", example = "[\"HighLoad архитектура\", \"Стресс-тестирование\"]")
    private List<String> keyStrengths;

    @Schema(description = "Рекомендуемые роли", example = "[\"Senior Java Engineer\", \"Core Backend Lead\"]")
    private List<String> recommendedRoles;
}
