package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "grade_test_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeTestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private CandidateProfile candidate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Specialization specialization;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_grade", nullable = false)
    private Grade targetGrade;

    @Column(name = "score_percent")
    private Integer scorePercent;

    @Column(nullable = false)
    @Builder.Default
    private boolean passed = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "assigned_grade")
    private Grade assignedGrade;

    @Column(name = "new_elo")
    private Integer newElo;

    @Column(nullable = false)
    @Builder.Default
    private String status = "IN_PROGRESS"; // "IN_PROGRESS", "COMPLETED"

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }
}
