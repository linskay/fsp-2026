package ru.fsp.careerarena.kotlin

import com.fasterxml.jackson.annotation.JsonProperty
import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * Идиоматичный Kotlin Data Class для представления сводки по кандидату ФСП.
 * Содержит null-safety, значения по умолчанию и поддержку JSON.
 */
@Schema(description = "Сводка профиля кандидата ФСП (Kotlin Data Class)")
data class CandidateSummaryResponse(
    @Schema(description = "Идентификатор соискателя", example = "cand-pesterev")
    val id: String,

    @Schema(description = "ФИО соискателя", example = "Иван Пестерев")
    val fullName: String,

    @Schema(description = "Рейтинг ФСП ELO", example = "2540")
    val fspRating: Int = 1200,

    @Schema(description = "Официальный спортивный разряд ФСП", example = "1-й спортивный разряд")
    val fspRank: String = "1-й спортивный разряд",

    @Schema(description = "Верифицирован ФСП РФ", example = "true")
    @JsonProperty("isVerified")
    val isVerified: Boolean = true,

    @Schema(description = "Стек подтвержденных технологий")
    val skills: List<String> = emptyList(),

    @Schema(description = "Временная метка генерации")
    val timestamp: Instant = Instant.now()
)
