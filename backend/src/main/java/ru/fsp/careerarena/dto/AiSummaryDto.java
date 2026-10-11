package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Автоматически сгенерированный технический портрет кандидата (AI-Summary)")
public class AiSummaryDto {

    @Schema(description = "ID аналитического отчета", example = "a1111111-1111-1111-1111-111111111111")
    private UUID id;

    @Schema(description = "ID кандидата", example = "c1111111-1111-1111-1111-111111111111")
    private UUID candidateId;

    @Schema(description = "Сгенерированное емкое резюме технического уровня кандидата", example = "Сильный Backend-разработчик (Senior). Основной стек: Java, Spring Boot, Go. По данным GitHub, активно развивает микросервисные архитектуры. Задачи уровня LeetCode Medium решает в среднем за 12 минут. Имеет ELO 2740 и статус мастера спорта ФСП. Рекомендуется на Highload-проекты.")
    private String summaryText;

    @Schema(description = "Ключевые сильные стороны по результатам алгоритмического тестирования и анализа репозиториев", example = "[\"Глубокое понимание графовых алгоритмов O(log N)\", \"Высокая скорость алгоритмической декомпозиции\"]")
    private List<String> keyStrengths;

    @Schema(description = "Уровень рекомендации для найма (HIGHLY_RECOMMENDED, RECOMMENDED, ACCEPTABLE)", example = "HIGHLY_RECOMMENDED")
    private String recommendationLevel;

    @Schema(description = "Рекомендуемые роли и позиции", example = "[\"Senior / Lead Backend Developer (Highload)\", \"Distributed Systems Architect\"]")
    private List<String> recommendedRoles;

    @Schema(description = "Оценка чистоты кода кандидата (0-100 баллов)", example = "96")
    private Integer codeCleanlinessScore;

    @Schema(description = "Модель ИИ, выполнившая анализ (YandexGPT 3 Pro / GigaChat Ultra / OpenAI)", example = "YandexGPT 3 Pro / GigaChat Ultra")
    private String modelName;

    @Schema(description = "Временная метка генерации портрета", example = "2026-10-05T08:30:00Z")
    private OffsetDateTime generatedAt;
}
