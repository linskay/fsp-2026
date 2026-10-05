package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;
import ru.fsp.careerarena.entity.enums.UserRole;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "personal_data_consent_accepted", nullable = false)
    private boolean personalDataConsentAccepted;

    @Column(name = "personal_data_consent_date")
    private OffsetDateTime personalDataConsentDate;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
        if (this.personalDataConsentAccepted && this.personalDataConsentDate == null) {
            this.personalDataConsentDate = OffsetDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
