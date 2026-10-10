package ru.fsp.careerarena.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Автоматически сгенерированный Kotlin Data Class для SendInvitationRequest.
 * Соответствует лучшим практикам Spring Boot 3 & Kotlin 2.0.
 */
@Schema(description = "SendInvitationRequest (Kotlin Data Class)")
data class SendInvitationRequest(
    val candidateId: UUID,
    val employerId: UUID,
    val vacancyId: UUID,
    val salaryOffered: Int = 0,
    val message: String = ""
)
