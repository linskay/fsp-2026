package ru.fsp.careerarena.service;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.fsp.careerarena.dto.SecurityAuditLogDto;
import ru.fsp.careerarena.entity.SecurityAuditLog;
import ru.fsp.careerarena.mapper.SecurityAuditLogMapper;
import ru.fsp.careerarena.repository.SecurityAuditLogRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Юнит-тесты Журнала аудита безопасности (152-ФЗ РФ)")
class SecurityAuditLogServiceTest {

    @Mock
    private SecurityAuditLogRepository auditLogRepository;

    @Mock
    private SecurityAuditLogMapper auditLogMapper;

    @Mock
    private HttpServletRequest request;

    private SecurityAuditLogService auditLogService;

    @BeforeEach
    void setUp() {
        auditLogService = new SecurityAuditLogService(auditLogRepository, auditLogMapper);
    }

    @Test
    @DisplayName("Логирование раскрытия контактов кандидатов с парсингом IP адреса")
    void testLogActionWithClientIp() {
        UUID actorId = UUID.randomUUID();
        UUID candidateId = UUID.randomUUID();

        when(request.getHeader("X-Forwarded-For")).thenReturn("198.51.100.42, 10.0.0.1");
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0 Chrome");

        SecurityAuditLog savedLog = SecurityAuditLog.builder()
                .id(UUID.randomUUID())
                .actorUserId(actorId)
                .actorEmail("hr@sbertech.ru")
                .actorRole("EMPLOYER")
                .action("CONTACTS_UNMASKED")
                .targetCandidateId(candidateId)
                .targetCandidateName("Иван Пестерев")
                .description("Раскрытие контактов по согласию соискателя")
                .ipAddress("198.51.100.42")
                .userAgent("Mozilla/5.0 Chrome")
                .createdAt(OffsetDateTime.now())
                .build();

        SecurityAuditLogDto expectedDto = SecurityAuditLogDto.builder()
                .id(savedLog.getId())
                .actorEmail("hr@sbertech.ru")
                .action("CONTACTS_UNMASKED")
                .ipAddress("198.51.100.42")
                .build();

        when(auditLogRepository.save(any(SecurityAuditLog.class))).thenReturn(savedLog);
        when(auditLogMapper.toDto(savedLog)).thenReturn(expectedDto);

        SecurityAuditLogDto result = auditLogService.logAction(
                actorId, "hr@sbertech.ru", "EMPLOYER", "CONTACTS_UNMASKED",
                candidateId, "Иван Пестерев", "Раскрытие контактов по согласию соискателя", request
        );

        assertNotNull(result);
        assertEquals("hr@sbertech.ru", result.getActorEmail());
        assertEquals("198.51.100.42", result.getIpAddress());

        ArgumentCaptor<SecurityAuditLog> captor = ArgumentCaptor.forClass(SecurityAuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        assertEquals("198.51.100.42", captor.getValue().getIpAddress());
    }

    @Test
    @DisplayName("Получение всех логов аудита безопасности")
    void testGetAllLogs() {
        SecurityAuditLog entry = SecurityAuditLog.builder().id(UUID.randomUUID()).action("TEST").build();
        SecurityAuditLogDto dto = SecurityAuditLogDto.builder().id(entry.getId()).action("TEST").build();

        when(auditLogRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(entry));
        when(auditLogMapper.toDto(entry)).thenReturn(dto);

        List<SecurityAuditLogDto> logs = auditLogService.getAllLogs();

        assertEquals(1, logs.size());
        assertEquals("TEST", logs.get(0).getAction());
    }
}
