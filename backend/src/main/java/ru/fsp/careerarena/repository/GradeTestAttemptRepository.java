package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.GradeTestAttempt;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradeTestAttemptRepository extends JpaRepository<GradeTestAttempt, UUID> {
    Optional<GradeTestAttempt> findTopByCandidateIdAndStatusOrderByCompletedAtDesc(UUID candidateId, String status);
}
