package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.AlgorithmTask;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AlgorithmTaskRepository extends JpaRepository<AlgorithmTask, UUID> {
    Optional<AlgorithmTask> findBySlug(String slug);
}
