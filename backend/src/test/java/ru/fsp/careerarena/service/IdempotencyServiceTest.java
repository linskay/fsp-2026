package ru.fsp.careerarena.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.fsp.careerarena.entity.IdempotencyRecord;
import ru.fsp.careerarena.repository.IdempotencyRecordRepository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Юнит-тесты Идемпотентности API (RFC 7231 / Idempotency-Key)")
class IdempotencyServiceTest {

    @Mock
    private IdempotencyRecordRepository idempotencyRecordRepository;

    private ObjectMapper objectMapper;
    private IdempotencyService idempotencyService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        idempotencyService = new IdempotencyService(idempotencyRecordRepository, objectMapper);
    }

    @Test
    @DisplayName("Поиск записи по Idempotency-Key и пути запроса")
    void testFindRecordSuccess() {
        String key = "idem-key-123";
        String path = "/api/v1/offers";

        IdempotencyRecord record = IdempotencyRecord.builder()
                .idempotencyKey(key)
                .requestPath(path)
                .responseStatus(201)
                .expiresAt(OffsetDateTime.now().plusHours(1))
                .build();

        when(idempotencyRecordRepository.findByIdempotencyKeyAndRequestPath(key, path))
                .thenReturn(Optional.of(record));

        Optional<IdempotencyRecord> result = idempotencyService.findRecord(key, path);

        assertTrue(result.isPresent());
        assertEquals(key, result.get().getIdempotencyKey());
    }

    @Test
    @DisplayName("Игнорирование истёкших по времени идемпотентных записей")
    void testFindExpiredRecordReturnsEmpty() {
        String key = "expired-key";
        String path = "/api/v1/offers";

        IdempotencyRecord expiredRecord = IdempotencyRecord.builder()
                .idempotencyKey(key)
                .requestPath(path)
                .expiresAt(OffsetDateTime.now().minusHours(1))
                .build();

        when(idempotencyRecordRepository.findByIdempotencyKeyAndRequestPath(key, path))
                .thenReturn(Optional.of(expiredRecord));

        Optional<IdempotencyRecord> result = idempotencyService.findRecord(key, path);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Расчет SHA-256 хэша тела запроса")
    void testComputeHash() {
        String payload = "{\"candidateId\":\"cand-1\",\"salaryOffered\":300000}";
        String hash = idempotencyService.computeHash(payload);

        assertNotNull(hash);
        assertNotEquals("empty", hash);
        assertEquals(64, hash.length()); // SHA-256 hex output is 64 characters long
    }

    @Test
    @DisplayName("Запись нового ответа с сохранением в репозиторий")
    void testRecordResponse() {
        String key = "idem-unique-key";
        String path = "/api/v1/offers";
        UUID actorId = UUID.randomUUID();
        UUID resourceId = UUID.randomUUID();

        idempotencyService.recordResponse(key, path, "payload", actorId, 201, "{\"status\":\"ok\"}", resourceId);

        ArgumentCaptor<IdempotencyRecord> captor = ArgumentCaptor.forClass(IdempotencyRecord.class);
        verify(idempotencyRecordRepository).save(captor.capture());

        IdempotencyRecord saved = captor.getValue();
        assertEquals(key, saved.getIdempotencyKey());
        assertEquals(path, saved.getRequestPath());
        assertEquals(201, saved.getResponseStatus());
        assertEquals(actorId, saved.getActorUserId());
    }
}
