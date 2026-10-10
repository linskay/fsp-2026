package ru.fsp.careerarena.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Автоматически сгенерированный Kotlin Data Class для CodeExecutionRequest.
 * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.
 */
@Schema(description = "CodeExecutionRequest (Kotlin Data Class)")
data class CodeExecutionRequest(
    val candidateId: UUID,
    val taskId: UUID,
    val language: String = "",
    val sourceCode: String = ""
)
