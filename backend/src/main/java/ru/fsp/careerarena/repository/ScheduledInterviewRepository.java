package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.ScheduledInterview;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduledInterviewRepository extends JpaRepository<ScheduledInterview, UUID> {
    List<ScheduledInterview> findByCandidateIdOrderByScheduledAtDesc(UUID candidateId);
    List<ScheduledInterview> findByEmployerIdOrderByScheduledAtDesc(UUID employerId);
}
