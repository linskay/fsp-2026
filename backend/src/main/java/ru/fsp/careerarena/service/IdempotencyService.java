package ru.fsp.careerarena.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.entity.IdempotencyRecord;
import ru.fsp.careerarena.repository.IdempotencyRecordRepository;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class IdempotencyService {

    private final IdempotencyRecordRepository idempotencyRecordRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public Optional<IdempotencyRecord> findRecord(String idempotencyKey, String requestPath) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            return Optional.empty();
        }
        return idempotencyRecordRepository.findByIdempotencyKeyAndRequestPath(idempotencyKey.trim(), requestPath)
                .filter(rec -> rec.getExpiresAt() == null || rec.getExpiresAt().isAfter(OffsetDateTime.now()));
    }

    @Transactional
    public void recordResponse(String idempotencyKey, String requestPath, Object requestPayload,
                               UUID actorUserId, int httpStatus, Object responsePayload, UUID resourceId) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            return;
        }

        try {
            String requestHash = computeHash(requestPayload);
            String responseBody = responsePayload instanceof String
                    ? (String) responsePayload
                    : objectMapper.writeValueAsString(responsePayload);

            IdempotencyRecord record = IdempotencyRecord.builder()
                    .idempotencyKey(idempotencyKey.trim())
                    .requestPath(requestPath)
                    .requestHash(requestHash)
                    .actorUserId(actorUserId)
                    .responseStatus(httpStatus)
                    .responseBody(responseBody)
                    .resourceId(resourceId)
                    .build();

            idempotencyRecordRepository.save(record);
            log.info("Recorded idempotency key={} for path={} resourceId={}", idempotencyKey, requestPath, resourceId);
        } catch (Exception e) {
            log.warn("Failed to persist idempotency record for key={}: {}", idempotencyKey, e.getMessage());
        }
    }

    public String computeHash(Object payload) {
        if (payload == null) {
            return "empty";
        }
        try {
            String json = objectMapper.writeValueAsString(payload);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(json.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (Exception e) {
            return String.valueOf(payload.hashCode());
        }
    }
}
