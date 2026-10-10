package ru.fsp.careerarena.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Автоматически сгенерированный Kotlin Data Class для GenerateAiSummaryRequest.
 * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.
 */
@Schema(description = "GenerateAiSummaryRequest (Kotlin Data Class)")
data class GenerateAiSummaryRequest(
    val candidateId: UUID,
    val provider: String = "",
    val model: String = "",
    val apiKey: String = "",
    val folderId: String = "",
    val endpointUrl: String = "",
    val focus: String = ""
)
