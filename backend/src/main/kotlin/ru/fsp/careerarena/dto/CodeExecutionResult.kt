package ru.fsp.careerarena.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Автоматически сгенерированный Kotlin Data Class для CodeExecutionResult.
 * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.
 */
@Schema(description = "CodeExecutionResult (Kotlin Data Class)")
data class CodeExecutionResult(
    val submissionId: UUID,
    val verdict: SubmissionVerdict,
    val statusMessage: String = "",
    val testsPassed: Int = 0,
    val totalTests: Int = 0,
    val executionTimeMs: Int = 0,
    val memoryUsedKb: Int = 0,
    val stdout: String = "",
    val stderr: String = "",
    val submittedAt: OffsetDateTime
)
