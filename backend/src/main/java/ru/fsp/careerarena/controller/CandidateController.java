package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.CandidateDto;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.service.CandidateService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/candidates")
@RequiredArgsConstructor
@Tag(name = "Candidates", description = "Управление профилями кандидатов и поиск спортсменов ФСП")
public class CandidateController {

    private final CandidateService candidateService;

    @GetMapping({"", "/search"})
    @Operation(summary = "Получение списка кандидатов или поиск по фильтрам (специализация, грейд, ELO ФСП, спортивный разряд)")
    public ResponseEntity<List<CandidateDto>> searchCandidates(
            @RequestParam(required = false) Specialization specialization,
            @RequestParam(required = false) Grade grade,
            @RequestParam(required = false) Integer minElo,
            @RequestParam(required = false) FspRank fspRank
    ) {
        return ResponseEntity.ok(candidateService.searchCandidates(specialization, grade, minElo, fspRank));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получение верифицированного профиля кандидата по ID")
    public ResponseEntity<CandidateDto> getCandidateById(@PathVariable UUID id) {
        return ResponseEntity.ok(candidateService.getCandidateById(id));
    }

    private final ru.fsp.careerarena.service.CandidatePdfService candidatePdfService;

    @GetMapping("/{id}/elo-history")
    @Operation(summary = "Получение истории изменения рейтинга ELO кандидата для построения графика прогресса")
    public ResponseEntity<List<ru.fsp.careerarena.dto.EloHistoryPointDto>> getEloHistory(@PathVariable UUID id) {
        return ResponseEntity.ok(candidateService.getEloHistory(id));
    }

    @GetMapping("/{id}/export-pdf")
    @Operation(summary = "Автогенерация и скачивание стандартизированного PDF-профиля соискателя с символикой ФСП и подтвержденным ELO")
    public ResponseEntity<byte[]> exportPdf(@PathVariable UUID id) {
        byte[] pdfBytes = candidatePdfService.generateCandidatePdf(id);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "application/pdf")
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"fsp-candidate-" + id + ".pdf\"")
                .body(pdfBytes);
    }
}

