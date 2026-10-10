package ru.fsp.careerarena.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Автоматически сгенерированный Kotlin Data Class для VacancyDto.
 * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.
 */
@Schema(description = "VacancyDto (Kotlin Data Class)")
data class VacancyDto(
    val id: UUID,
    val employerId: UUID,
    val companyName: String = "",
    val companyLogo: String = "",
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
    val isActive: Boolean = false,
    val requiredSkills: Set<String>
)
