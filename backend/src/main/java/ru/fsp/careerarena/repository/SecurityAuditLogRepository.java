package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.SecurityAuditLog;

import java.util.List;
import java.util.UUID;

@Repository
public interface SecurityAuditLogRepository extends JpaRepository<SecurityAuditLog, UUID> {

    List<SecurityAuditLog> findAllByOrderByCreatedAtDesc();

    List<SecurityAuditLog> findByTargetCandidateIdOrderByCreatedAtDesc(UUID targetCandidateId);

    List<SecurityAuditLog> findByActorEmailOrderByCreatedAtDesc(String actorEmail);
}
