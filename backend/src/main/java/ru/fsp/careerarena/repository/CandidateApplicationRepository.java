package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.CandidateApplication;

import java.util.List;
import java.util.UUID;

@Repository
public interface CandidateApplicationRepository extends JpaRepository<CandidateApplication, UUID> {
    List<CandidateApplication> findByVacancyIdOrderByCreatedAtDesc(UUID vacancyId);
    List<CandidateApplication> findByCandidateIdOrderByCreatedAtDesc(UUID candidateId);
}
