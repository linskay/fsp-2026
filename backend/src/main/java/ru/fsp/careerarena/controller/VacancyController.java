package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.CreateVacancyRequest;
import ru.fsp.careerarena.dto.VacancyDto;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.service.VacancyService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vacancies")
@RequiredArgsConstructor
@Tag(name = "Vacancies", description = "Управление вакансиями с обязательными зарплатными вилками")
public class VacancyController {

    private final VacancyService vacancyService;

    @GetMapping
    @Operation(summary = "Получение списка всех активных вакансий (с опциональными фильтрами)")
    public ResponseEntity<List<VacancyDto>> getAllVacancies(
            @RequestParam(required = false) Specialization specialization,
            @RequestParam(required = false) Grade grade,
            @RequestParam(required = false) Integer maxRequiredElo
    ) {
        if (specialization != null || grade != null || maxRequiredElo != null) {
            return ResponseEntity.ok(vacancyService.searchVacancies(specialization, grade, maxRequiredElo));
        }
        return ResponseEntity.ok(vacancyService.getAllVacancies());
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск активных вакансий по фильтрам")
    public ResponseEntity<List<VacancyDto>> searchVacancies(
            @RequestParam(required = false) Specialization specialization,
            @RequestParam(required = false) Grade grade,
            @RequestParam(required = false) Integer maxRequiredElo
    ) {
        return ResponseEntity.ok(vacancyService.searchVacancies(specialization, grade, maxRequiredElo));
    }

    @GetMapping("/employer/{employerId}")
    @Operation(summary = "Получение списка вакансий конкретного работодателя")
    public ResponseEntity<List<VacancyDto>> getVacanciesByEmployer(@PathVariable UUID employerId) {
        return ResponseEntity.ok(vacancyService.getVacanciesByEmployer(employerId));
    }

    @PostMapping
    @Operation(summary = "Создание новой вакансии (с обязательной вилкой зарплат 'от-до' в рублях)")
    public ResponseEntity<VacancyDto> createVacancy(@Valid @RequestBody CreateVacancyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vacancyService.createVacancy(request));
    }

    private final ru.fsp.careerarena.repository.VacancyReportRepository vacancyReportRepository;
    private final ru.fsp.careerarena.repository.VacancyRepository vacancyRepository;

    @PostMapping("/{id}/report")
    @Operation(summary = "Жалоба соискателя на фиктивную или подозрительную вакансию (Антифрод-система ФСП)")
    public ResponseEntity<java.util.Map<String, Object>> reportVacancy(
            @PathVariable UUID id,
            @Valid @RequestBody ru.fsp.careerarena.dto.VacancyReportRequest request
    ) {
        var vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new ru.fsp.careerarena.exception.ResourceNotFoundException("Вакансия с ID " + id + " не найдена"));

        var report = ru.fsp.careerarena.entity.VacancyReport.builder()
                .vacancy(vacancy)
                .candidateId(request.getCandidateId())
                .reason(request.getReason())
                .comment(request.getComment())
                .status("PENDING")
                .build();

        report = vacancyReportRepository.save(report);

        return ResponseEntity.ok(java.util.Map.of(
                "status", "REPORTED",
                "reportId", report.getId().toString(),
                "vacancyId", vacancy.getId().toString(),
                "reason", report.getReason(),
                "message", "Жалоба успешно зарегистрирована в антифрод-системе ФСП. Вакансия направлена на проверку модератором."
        ));
    }
}
