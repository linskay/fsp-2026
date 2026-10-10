package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.IdempotencyRecord;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface IdempotencyRecordRepository extends JpaRepository<IdempotencyRecord, UUID> {
    Optional<IdempotencyRecord> findByIdempotencyKeyAndRequestPath(String idempotencyKey, String requestPath);
    Optional<IdempotencyRecord> findByIdempotencyKey(String idempotencyKey);
}
