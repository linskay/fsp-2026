package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "vacancy_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VacancyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacancy_id", nullable = false)
    private Vacancy vacancy;

    @Column(name = "candidate_id")
    private UUID candidateId;

    @Column(nullable = false)
    private String reason; // "FICTITIOUS_SALARY", "FAKE_COMPANY", "SPAM", "DISCRIMINATION", "OTHER"

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // "PENDING", "INVESTIGATING", "RESOLVED", "REJECTED"

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }
}
