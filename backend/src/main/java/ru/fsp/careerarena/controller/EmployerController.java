package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.EmployerDto;
import ru.fsp.careerarena.dto.UpdateEmployerRequest;
import ru.fsp.careerarena.service.EmployerService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employers")
@RequiredArgsConstructor
@Tag(name = "Employers", description = "Управление профилем компании-работодателя и контактами рекрутера")
public class EmployerController {

    private final EmployerService employerService;

    @GetMapping("/{id}")
    @Operation(summary = "Получение профиля компании-работодателя по ID (логотип, описание, вакансии, рекрутер)")
    public ResponseEntity<EmployerDto> getEmployerById(@PathVariable UUID id) {
        return ResponseEntity.ok(employerService.getEmployerById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Редактирование данных компании-работодателя и контактов рекрутера")
    public ResponseEntity<EmployerDto> updateEmployer(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEmployerRequest request
    ) {
        return ResponseEntity.ok(employerService.updateEmployer(id, request));
    }

    @PostMapping("/verify")
    @Operation(summary = "Запрос на верификацию компании-работодателя через базы ФНС / ОГРН (аккредитация партнера ФСП)")
    public ResponseEntity<ru.fsp.careerarena.dto.EmployerVerifyResponse> verifyEmployer(
            @Valid @RequestBody ru.fsp.careerarena.dto.EmployerVerifyRequest request
    ) {
        return ResponseEntity.ok(employerService.verifyEmployer(request));
    }

    @GetMapping("/{id}/analytics")
    @Operation(summary = "Получение сводных метрик для HR-кабинета (воронка найма, конверсия, время ответа, распределение ELO)")
    public ResponseEntity<ru.fsp.careerarena.dto.EmployerAnalyticsDto> getEmployerAnalytics(@PathVariable UUID id) {
        return ResponseEntity.ok(employerService.getEmployerAnalytics(id));
    }
}
