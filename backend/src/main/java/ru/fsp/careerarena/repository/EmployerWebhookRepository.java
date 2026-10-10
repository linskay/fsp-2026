package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.EmployerWebhook;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmployerWebhookRepository extends JpaRepository<EmployerWebhook, UUID> {
    List<EmployerWebhook> findByEmployerIdOrderByCreatedAtDesc(UUID employerId);
    List<EmployerWebhook> findByEmployerIdAndActiveTrue(UUID employerId);
}
