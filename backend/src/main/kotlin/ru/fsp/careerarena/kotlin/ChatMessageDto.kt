package ru.fsp.careerarena.kotlin

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

/**
 * DTO для обмена сообщениями в чате (Kotlin).
 */
@Schema(description = "Сообщение чата кандидата и работодателя")
data class ChatMessageDto(
    @Schema(description = "Уникальный ID сообщения", example = "msg-1728556800000")
    val id: String = "msg-${System.currentTimeMillis()}",

    @Schema(description = "ID приглашения / оффера", example = "inv-1")
    val invitationId: String = "",

    @Schema(description = "Отправитель сообщения", example = "employer")
    val sender: String = "candidate", // "candidate" | "employer"

    @Schema(description = "Текст сообщения", example = "Добрый день! Рассмотрели ваше решение задачи в Арене.")
    val text: String = "",

    @Schema(description = "Время отправки сообщения")
    val timestamp: Instant = Instant.now()
)
