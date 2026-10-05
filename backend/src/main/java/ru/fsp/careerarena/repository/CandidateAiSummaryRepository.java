package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.CandidateAiSummary;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CandidateAiSummaryRepository extends JpaRepository<CandidateAiSummary, UUID> {
    Optional<CandidateAiSummary> findByCandidateId(UUID candidateId);
}
