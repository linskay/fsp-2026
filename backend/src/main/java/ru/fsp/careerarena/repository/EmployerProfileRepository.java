package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.EmployerProfile;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, UUID> {
    Optional<EmployerProfile> findByUserId(UUID userId);
}
