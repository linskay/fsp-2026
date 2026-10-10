package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.ScheduleInterviewRequest;
import ru.fsp.careerarena.dto.ScheduledInterviewDto;
import ru.fsp.careerarena.service.InterviewService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
@Tag(name = "Live Interviews & Yandex Telemost", description = "Планирование лайв-интервью, генерация комнат в Яндекс Телемост и синхронизация с соискателем")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/schedule")
    @Operation(summary = "Создание комнаты Лайв-интервью, генерация ссылки на Яндекс Телемост и привязка к карточке кандидата")
    public ResponseEntity<ScheduledInterviewDto> scheduleInterview(@Valid @RequestBody ScheduleInterviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interviewService.scheduleInterview(request));
    }

    @GetMapping("/candidate/{candidateId}")
    @Operation(summary = "Получение списка запланированных онлайн-интервью соискателя")
    public ResponseEntity<List<ScheduledInterviewDto>> getInterviewsByCandidate(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(interviewService.getInterviewsByCandidate(candidateId));
    }

    @GetMapping("/employer/{employerId}")
    @Operation(summary = "Получение списка запланированных онлайн-интервью работодателя")
    public ResponseEntity<List<ScheduledInterviewDto>> getInterviewsByEmployer(@PathVariable UUID employerId) {
        return ResponseEntity.ok(interviewService.getInterviewsByEmployer(employerId));
    }
}
