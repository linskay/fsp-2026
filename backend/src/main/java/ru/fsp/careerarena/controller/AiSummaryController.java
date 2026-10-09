package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.AiSummaryDto;
import ru.fsp.careerarena.service.AiSummaryService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai-summary")
@RequiredArgsConstructor
@Tag(name = "AI Summary", description = "Генерация технического портрета кандидата на базе LLM")
public class AiSummaryController {

    private final AiSummaryService aiSummaryService;

    @GetMapping("/candidate/{candidateId}")
    @Operation(summary = "Получение или генерация AI-Summary для кандидата")
    public ResponseEntity<AiSummaryDto> getAiSummary(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(aiSummaryService.generateOrGetAiSummary(candidateId));
    }

    @PostMapping("/generate")
    @Operation(summary = "Генерация AI-Summary кандидата с указанием провайдера, модели и фокуса анализа")
    public ResponseEntity<AiSummaryDto> generateAiSummary(@jakarta.validation.Valid @RequestBody ru.fsp.careerarena.dto.GenerateAiSummaryRequest request) {
        return ResponseEntity.ok(aiSummaryService.generateAiSummary(request));
    }
}
