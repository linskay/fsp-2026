package ru.fsp.careerarena.mapper;

import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.SecurityAuditLogDto;
import ru.fsp.careerarena.entity.SecurityAuditLog;

@Component
public class SecurityAuditLogMapper {

    public SecurityAuditLogDto toDto(SecurityAuditLog entity) {
        if (entity == null) return null;

        return SecurityAuditLogDto.builder()
                .id(entity.getId())
                .actorUserId(entity.getActorUserId())
                .actorEmail(entity.getActorEmail())
                .actorRole(entity.getActorRole())
                .action(entity.getAction())
                .targetCandidateId(entity.getTargetCandidateId())
                .targetCandidateName(entity.getTargetCandidateName())
                .description(entity.getDescription())
                .ipAddress(entity.getIpAddress())
                .userAgent(entity.getUserAgent())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
