package ru.fsp.careerarena.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Автоматически сгенерированный Kotlin Data Class для CreateVacancyRequest.
 * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.
 */
@Schema(description = "CreateVacancyRequest (Kotlin Data Class)")
data class CreateVacancyRequest(
    val employerId: UUID,
    val title: String = "",
    val specialization: Specialization,
    val grade: Grade,
    val salaryFrom: Int = 0,
    val salaryTo: Int = 0,
    val minFspElo: Int = 0,
    val requiredFspRank: FspRank,
    val location: String = "",
    val workFormat: WorkFormat,
    val description: String = "",
    val requiredSkills: Set<String>,
    val hhVacancyId: String = ""
)
