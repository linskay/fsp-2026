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
    val minFspElo: Int = 1200
)

@JsonClass(generateAdapter = true)
data class ArenaTask(
    val id: String,
    val title: String,
    val difficulty: String, // "Easy" | "Medium" | "Hard"
    val pointsElo: Int = 50,
    val solved: Boolean = false
)
