package ru.fsp.careerarena.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.SecurityAuditLogDto;
import ru.fsp.careerarena.entity.SecurityAuditLog;
import ru.fsp.careerarena.mapper.SecurityAuditLogMapper;
import ru.fsp.careerarena.repository.SecurityAuditLogRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SecurityAuditLogService {

    private final SecurityAuditLogRepository auditLogRepository;
    private final SecurityAuditLogMapper auditLogMapper;

    @Transactional(readOnly = true)
    public List<SecurityAuditLogDto> getAllLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(auditLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SecurityAuditLogDto> getLogsByCandidate(UUID candidateId) {
        return auditLogRepository.findByTargetCandidateIdOrderByCreatedAtDesc(candidateId)
                .stream()
                .map(auditLogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SecurityAuditLogDto logAction(
            UUID actorUserId,
            String actorEmail,
            String actorRole,
            String action,
            UUID targetCandidateId,
            String targetCandidateName,
            String description,
            HttpServletRequest request
    ) {
        String ip = extractClientIp(request);
        String userAgent = request != null ? request.getHeader("User-Agent") : "Unknown";

        SecurityAuditLog logEntry = SecurityAuditLog.builder()
                .actorUserId(actorUserId)
                .actorEmail(actorEmail != null ? actorEmail : "anonymous@fsp.ru")
                .actorRole(actorRole != null ? actorRole : "ANONYMOUS")
                .action(action)
                .targetCandidateId(targetCandidateId)
                .targetCandidateName(targetCandidateName)
                .description(description)
                .ipAddress(ip)
                .userAgent(userAgent)
                .build();

        SecurityAuditLog saved = auditLogRepository.save(logEntry);
        log.info("[152-FZ AUDIT] Action: {} by {} ({}) on target {} - IP: {}", 
                action, actorEmail, actorRole, targetCandidateName, ip);

        return auditLogMapper.toDto(saved);
    }

    private String extractClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip != null ? ip : "127.0.0.1";
    }
}
