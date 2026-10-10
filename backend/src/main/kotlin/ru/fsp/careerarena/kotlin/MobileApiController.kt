package ru.fsp.careerarena.kotlin

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

/**
 * Высокопроизводительный Kotlin REST Controller для обслуживания мобильного приложения.
 */
@RestController
@RequestMapping("/api/v1/mobile")
@Tag(name = "Mobile API (Kotlin)", description = "Эндпоинты для мобильного клиента на Kotlin / Jetpack Compose")
@CrossOrigin(origins = ["*"])
class MobileApiController {

    @GetMapping("/status")
    @Operation(summary = "Статус мобильного API и Kotlin-движка")
    fun getStatus(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "status" to "UP",
                "engine" to "Kotlin 2.0 / Spring Boot 3",
                "mobileSupported" to true,
                "timestamp" to Instant.now().toString()
            )
        )
    }

    @PostMapping("/chat/send")
    @Operation(summary = "Отправка сообщения чата через мобильное приложение")
    fun sendChatMessage(@RequestBody message: ChatMessageDto): ResponseEntity<ChatMessageDto> {
        return ResponseEntity.ok(message)
    }
}
