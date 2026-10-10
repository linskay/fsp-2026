package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.*;
import ru.fsp.careerarena.service.GradeTestService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tests")
@RequiredArgsConstructor
@Tag(name = "Grade Testing & Assessment", description = "Квалификационное тестирование, смена грейда и проверка кулдауна (3 месяца)")
public class GradeTestController {

    private final GradeTestService gradeTestService;

    @GetMapping("/categories")
    @Operation(summary = "Получение доступных отраслей и специализаций для квалификационного тестирования")
    public ResponseEntity<TestCategoriesResponse> getCategories() {
        return ResponseEntity.ok(gradeTestService.getCategories());
    }

    @GetMapping("/cooldown/{candidateId}")
    @Operation(summary = "Проверка доступности повторной сдачи теста (контроль кулдауна в 3 месяца)")
    public ResponseEntity<TestCooldownDto> checkCooldown(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(gradeTestService.checkCooldown(candidateId));
    }

    @PostMapping("/start")
    @Operation(summary = "Генерация и старт прохождения квалификационного теста на заявленный грейд")
    public ResponseEntity<GradeTestSessionDto> startTest(@Valid @RequestBody StartGradeTestRequest request) {
        return ResponseEntity.ok(gradeTestService.startTest(request));
    }

    @PostMapping("/submit")
    @Operation(summary = "Отправка ответов на тест, автоматический расчет категории, ELO и присвоение грейда")
    public ResponseEntity<GradeTestResultDto> submitTest(@Valid @RequestBody SubmitGradeTestRequest request) {
        return ResponseEntity.ok(gradeTestService.submitTest(request));
    }
}
