package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "api_idempotency_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdempotencyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "idempotency_key", length = 128, nullable = false, unique = true)
    private String idempotencyKey;

    @Column(name = "request_path", length = 256, nullable = false)
    private String requestPath;

    @Column(name = "request_hash", length = 64, nullable = false)
    private String requestHash;

    @Column(name = "actor_user_id")
    private UUID actorUserId;

    @Column(name = "response_status", nullable = false)
    private int responseStatus;

    @Column(name = "response_body", columnDefinition = "TEXT", nullable = false)
    private String responseBody;

    @Column(name = "resource_id")
    private UUID resourceId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
        if (this.expiresAt == null) {
            this.expiresAt = OffsetDateTime.now().plusHours(24);
        }
    }
}
