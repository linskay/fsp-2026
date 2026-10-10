package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.SecurityAuditLogDto;
import ru.fsp.careerarena.service.SecurityAuditLogService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
@Tag(name = "Security Audit (152-ФЗ)", description = "Журнал аудита безопасности и фиксация доступа к персональным данным соискателей")
public class SecurityAuditController {

    private final SecurityAuditLogService auditLogService;

    @GetMapping("/logs")
    @Operation(summary = "Получение полного журнала аудита обращений к персональным данным (152-ФЗ)")
    public ResponseEntity<List<SecurityAuditLogDto>> getAllAuditLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @GetMapping("/candidate/{candidateId}")
    @Operation(summary = "Получение истории просмотров персональных данных конкретного кандидата")
    public ResponseEntity<List<SecurityAuditLogDto>> getLogsForCandidate(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(auditLogService.getLogsByCandidate(candidateId));
    }

    @PostMapping("/log-view-contacts")
    @Operation(summary = "Фиксация просмотра контактных данных кандидата работодателем (дата, время, IP, рекрутер)")
    public ResponseEntity<SecurityAuditLogDto> logViewContacts(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request
    ) {
        String actorEmail = (String) payload.getOrDefault("employerEmail", "employer@fsp.ru");
        String candidateName = (String) payload.getOrDefault("candidateName", "Иван Пестерев");
        String companyName = (String) payload.getOrDefault("companyName", "ПАО Сбербанк (СберТех)");
        String candidateIdStr = (String) payload.get("candidateId");

        UUID candidateId = null;
        if (candidateIdStr != null) {
            try {
                candidateId = UUID.fromString(candidateIdStr);
            } catch (Exception ignored) {}
        }

        String description = String.format("Рекрутер компании '%s' (%s) просмотрел контактные данные кандидата %s",
                companyName, actorEmail, candidateName);

        SecurityAuditLogDto savedLog = auditLogService.logAction(
                null,
                actorEmail,
                "EMPLOYER",
                "VIEW_PERSONAL_CONTACTS",
                candidateId,
                candidateName,
                description,
                request
        );

        return ResponseEntity.ok(savedLog);
    }
}
