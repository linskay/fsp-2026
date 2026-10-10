package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.AiSummaryDto;
import ru.fsp.careerarena.dto.GenerateAiSummaryRequest;
import ru.fsp.careerarena.dto.SaveAiProfileRequest;
import ru.fsp.careerarena.service.AiSummaryService;

import java.util.UUID;

@RestController
@RequestMapping({"/api/v1/ai", "/api/v1/ai-summary"})
@RequiredArgsConstructor
@Tag(name = "AI Summary & Profile Analysis", description = "Мультимодельная генерация технического портрета кандидата (Gemini, YandexGPT, OpenRouter, Ollama) с паттерном Strategy и сохранением в PostgreSQL")
public class AiSummaryController {

    private final AiSummaryService aiSummaryService;

    @GetMapping("/candidate/{candidateId}")
    @Operation(summary = "Получение или генерация AI-Summary для кандидата")
    public ResponseEntity<AiSummaryDto> getAiSummary(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(aiSummaryService.generateOrGetAiSummary(candidateId));
    }

    @PostMapping({"/generate", "/generate-summary"})
    @Operation(summary = "Мультимодельная генерация AI-портрета соискателя (Gemini, YandexGPT, OpenRouter, Ollama) с паттерном Strategy и фокусировкой")
    public ResponseEntity<AiSummaryDto> generateAiSummary(@Valid @RequestBody GenerateAiSummaryRequest request) {
        return ResponseEntity.ok(aiSummaryService.generateAiSummary(request));
    }

    @PostMapping("/save-profile")
    @Operation(summary = "Сохранение сгенерированного ИИ-портрета в профиль соискателя в базе данных PostgreSQL")
    public ResponseEntity<AiSummaryDto> saveAiProfile(@Valid @RequestBody SaveAiProfileRequest request) {
        return ResponseEntity.ok(aiSummaryService.saveAiProfile(request));
    }
}
