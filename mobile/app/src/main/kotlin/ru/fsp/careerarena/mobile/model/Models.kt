package ru.fsp.careerarena.mobile.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

/**
 * Модели данных мобильного приложения ФСП Карьерная Арена (Kotlin).
 */

@JsonClass(generateAdapter = true)
data class CandidateProfile(
    val id: String,
    val fullName: String,
    val title: String,
    val city: String = "Москва",
    val avatarUrl: String? = null,
    val fspRating: Int = 1200,
    val fspRank: String = "1-й спортивный разряд",
    val isVerified: Boolean = true,
    val skills: List<String> = emptyList(),
    val solvedTasksCount: Int = 0,
    val experienceYears: Int = 3,
    val about: String = ""
)

@JsonClass(generateAdapter = true)
data class MobileChatMessage(
    val id: String = "msg-${System.currentTimeMillis()}",
    val invitationId: String,
    val sender: String, // "candidate" | "employer"
    val text: String,
    val timestamp: String
)

@JsonClass(generateAdapter = true)
data class Vacancy(
    val id: String,
    val title: String,
    val companyName: String,
    val salaryMin: Int,
    val salaryMax: Int,
    val requiredGrade: String = "Middle",
    val minFspElo: Int = 1200,
    val location: String = "Москва / Удаленно",
    val workFormat: String = "Удаленно"
)

@JsonClass(generateAdapter = true)
data class ArenaTask(
    val id: String,
    val title: String,
    val difficulty: String, // "Easy" | "Medium" | "Hard"
    val pointsElo: Int = 50,
    val solved: Boolean = false
)

@JsonClass(generateAdapter = true)
data class ReverseOffer(
    val id: String,
    val vacancyId: String,
    val vacancyTitle: String,
    val employerId: String,
    val companyName: String,
    val companyLogo: String? = null,
    val candidateId: String,
    val candidateName: String,
    val salary: Int,
    val format: String = "Удаленно",
    val city: String = "Москва",
    val comment: String? = null,
    val status: String = "pending", // "pending" | "accepted" | "declined"
    val createdAt: String
)

@JsonClass(generateAdapter = true)
data class AssessmentAssignment(
    val id: String,
    val employerId: String,
    val companyName: String,
    val companyLogo: String? = null,
    val vacancyId: String? = null,
    val vacancyTitle: String = "Техническая позиция",
    val candidateId: String,
    val candidateName: String,
    val status: String = "pending", // "pending" | "submitted" | "approved" | "rejected"
    val timeLimitMinutes: Int = 45,
    val isLiveInterview: Boolean = false,
    val telemostRoomUrl: String? = null,
    val scheduledInterviewAt: String? = null,
    val createdAt: String? = null
)

@JsonClass(generateAdapter = true)
data class ScheduledInterview(
    val id: String,
    val candidateId: String,
    val employerId: String,
    val companyName: String,
    val positionTitle: String,
    val telemostRoomUrl: String,
    val scheduledAt: String,
    val status: String = "scheduled",
    val durationMinutes: Int = 45
)

@JsonClass(generateAdapter = true)
data class CandidateApplication(
    val id: String,
    val vacancyId: String,
    val vacancyTitle: String,
    val companyName: String,
    val candidateId: String,
    val candidateName: String,
    val status: String = "new",
    val coverLetter: String? = null,
    val createdAt: String
)

@JsonClass(generateAdapter = true)
data class GradeTestCategory(
    val id: String,
    val name: String,
    val description: String,
    val durationMinutes: Int = 45,
    val totalQuestions: Int = 20,
    val requiredPassingScore: Int = 75
)

@JsonClass(generateAdapter = true)
data class GradeCooldownInfo(
    val canTakeTest: Boolean = true,
    val waitHoursRemaining: Int = 0,
    val lastTakenAt: String? = null,
    val message: String? = null
)

@JsonClass(generateAdapter = true)
data class EloHistoryPoint(
    val id: String? = null,
    val candidateId: String? = null,
    val elo: Int,
    val change: Int = 0,
    val reason: String,
    val timestamp: String
)

@JsonClass(generateAdapter = true)
data class UserNotification(
    val id: String,
    val userId: String? = null,
    val title: String,
    val message: String,
    val type: String = "offer",
    val read: Boolean = false,
    val createdAt: String
)
