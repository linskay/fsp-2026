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

    @GetMapping("/search")
    @Operation(summary = "Поиск кандидатов по фильтрам (специализация, грейд, ELO ФСП, спортивный разряд)")
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
}
