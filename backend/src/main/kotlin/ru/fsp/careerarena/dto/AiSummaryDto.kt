package ru.fsp.careerarena.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Автоматически сгенерированный Kotlin Data Class для AiSummaryDto.
 * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.
 */
@Schema(description = "AiSummaryDto (Kotlin Data Class)")
data class AiSummaryDto(
    val id: UUID,
    val candidateId: UUID,
    val summaryText: String = "",
    val keyStrengths: List<String> = emptyList(),
    val recommendationLevel: String = "",
    val recommendedRoles: List<String> = emptyList(),
    val modelName: String = "",
    val generatedAt: OffsetDateTime
)
