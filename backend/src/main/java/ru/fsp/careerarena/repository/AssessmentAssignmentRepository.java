package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.AssessmentAssignment;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssessmentAssignmentRepository extends JpaRepository<AssessmentAssignment, UUID> {
    List<AssessmentAssignment> findByEmployerIdOrderByCreatedAtDesc(UUID employerId);
    List<AssessmentAssignment> findByCandidateIdOrderByCreatedAtDesc(UUID candidateId);
}
