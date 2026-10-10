package ru.fsp.careerarena.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.fsp.careerarena.entity.UserNotification;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, UUID> {
    List<UserNotification> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<UserNotification> findAllByOrderByCreatedAtDesc();
}
