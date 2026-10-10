package ru.fsp.careerarena.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Автоматически сгенерированный Kotlin Data Class для InvitationDto.
 * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.
 */
@Schema(description = "InvitationDto (Kotlin Data Class)")
data class InvitationDto(
    val id: UUID,
    val candidateId: UUID,
    val candidateName: String = "",
    val employerId: UUID,
    val companyName: String = "",
    val companyLogo: String = "",
    val vacancyId: UUID,
    val vacancyTitle: String = "",
    val salaryOffered: Int = 0,
    val message: String = "",
    val status: InvitationStatus,
    val createdAt: OffsetDateTime
)
