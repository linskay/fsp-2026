package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.TaskSubmission;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, UUID> {
    List<TaskSubmission> findByCandidateIdOrderByCreatedAtDesc(UUID candidateId);
    List<TaskSubmission> findByCandidateIdAndTaskId(UUID candidateId, UUID taskId);
}
