package ru.fsp.careerarena.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Автоматически сгенерированный Kotlin Data Class для CandidateDto.
 * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.
 */
@Schema(description = "CandidateDto (Kotlin Data Class)")
data class CandidateDto(
    val id: UUID,
    val userId: UUID,
    val fullName: String = "",
    val email: String = "",
    val avatarUrl: String = "",
    val fspId: String = "",
    val fspElo: Int = 0,
    val fspRank: FspRank,
    val fspRankDisplayName: String = "",
    val specialization: Specialization,
    val grade: Grade,
    val salaryExpectation: Int = 0,
    val location: String = "",
    val bio: String = "",
    val isFspVerified: Boolean = false,
    val githubUsername: String = "",
    val githubReposCount: Int = 0,
    val githubCommitsCount: Int = 0,
    val skills: Set<String>
)
