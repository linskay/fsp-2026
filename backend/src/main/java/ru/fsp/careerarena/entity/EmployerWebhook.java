package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "employer_webhooks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployerWebhook {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private EmployerProfile employer;

    @Column(nullable = false, length = 1000)
    private String url;

    @Column(name = "secret_token", length = 255)
    private String secretToken;

    @Column(nullable = false, length = 500)
    @Builder.Default
    private String events = "OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED";

    @Column(length = 255)
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "last_status_code")
    private Integer lastStatusCode;

    @Column(name = "last_triggered_at")
    private OffsetDateTime lastTriggeredAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;
}
