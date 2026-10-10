package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.Invitation;

import ru.fsp.careerarena.entity.enums.InvitationStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, UUID> {
    List<Invitation> findByCandidateIdOrderByCreatedAtDesc(UUID candidateId);
    List<Invitation> findByEmployerIdOrderByCreatedAtDesc(UUID employerId);

    Optional<Invitation> findByIdempotencyKey(String idempotencyKey);

    Optional<Invitation> findFirstByEmployerIdAndCandidateIdAndVacancyIdAndStatus(
            UUID employerId, UUID candidateId, UUID vacancyId, InvitationStatus status);

    Optional<Invitation> findFirstByEmployerIdAndCandidateIdAndStatus(
            UUID employerId, UUID candidateId, InvitationStatus status);
}
