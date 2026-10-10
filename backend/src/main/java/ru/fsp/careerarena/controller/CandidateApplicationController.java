package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.CandidateApplicationDto;
import ru.fsp.careerarena.dto.CreateApplicationRequest;
import ru.fsp.careerarena.service.CandidateApplicationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Tag(name = "Job Applications", description = "Прямые отклики кандидатов на открытые вакансии работодателей")
public class CandidateApplicationController {

    private final CandidateApplicationService applicationService;

    @PostMapping
    @Operation(summary = "Отправка отклика соискателем на открытую вакансию компании")
    public ResponseEntity<CandidateApplicationDto> createApplication(@Valid @RequestBody CreateApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.createApplication(request));
    }

    @GetMapping("/vacancy/{vacancyId}")
    @Operation(summary = "Просмотр работодателем откликов на конкретную вакансию")
    public ResponseEntity<List<CandidateApplicationDto>> getApplicationsByVacancyId(@PathVariable UUID vacancyId) {
        return ResponseEntity.ok(applicationService.getApplicationsByVacancyId(vacancyId));
    }

    @GetMapping("/candidate/{candidateId}")
    @Operation(summary = "Просмотр кандидатом истории своих поданных откликов")
    public ResponseEntity<List<CandidateApplicationDto>> getApplicationsByCandidateId(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(applicationService.getApplicationsByCandidateId(candidateId));
    }
}
