package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.*;
import ru.fsp.careerarena.service.AssessmentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
@Tag(name = "Assessments & Code Reviews", description = "Управление техническими заданиями, отправка решений, просмотр кода и код-ревью с оценкой")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @GetMapping("/employer/{employerId}")
    @Operation(summary = "Получение списка назначенных работодателем заданий и их статусов ('Ожидает код-ревью', 'Пройдено')")
    public ResponseEntity<List<AssessmentAssignmentDto>> getAssessmentsByEmployer(@PathVariable UUID employerId) {
        return ResponseEntity.ok(assessmentService.getAssessmentsByEmployerId(employerId));
    }

    @GetMapping("/candidate/{candidateId}")
    @Operation(summary = "Получение списка назначенных соискателю заданий")
    public ResponseEntity<List<AssessmentAssignmentDto>> getAssessmentsByCandidate(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(assessmentService.getAssessmentsByCandidateId(candidateId));
    }

    @PostMapping("/assign")
    @Operation(summary = "Отправка кандидату кастомного задания от работодателя (с таймером и опцией лайв-интервью)")
    public ResponseEntity<AssessmentAssignmentDto> assignAssessment(@Valid @RequestBody AssignAssessmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assessmentService.assignAssessment(request));
    }

    @GetMapping("/submissions/{id}")
    @Operation(summary = "Получение кода решения соискателя, времени выполнения и результатов тест-кейсов для страницы код-ревью")
    public ResponseEntity<AssessmentSubmissionDto> getSubmission(@PathVariable UUID id) {
        return ResponseEntity.ok(assessmentService.getSubmission(id));
    }

    @PostMapping("/submissions/{id}/review")
    @Operation(summary = "Сохранение оценки ревьюера/лида (HIRED / REJECTED), приватного комментария и сообщения для кандидата")
    public ResponseEntity<AssessmentAssignmentDto> reviewSubmission(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewAssessmentRequest request
    ) {
        return ResponseEntity.ok(assessmentService.reviewSubmission(id, request));
    }
}
