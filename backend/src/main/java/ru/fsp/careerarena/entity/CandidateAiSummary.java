package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "candidate_ai_summaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateAiSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false, unique = true)
    private CandidateProfile candidate;

    @Column(name = "summary_text", columnDefinition = "TEXT", nullable = false)
    private String summaryText;

    @Column(name = "key_strengths")
    private List<String> keyStrengths;

    @Column(name = "recommendation_level")
    private String recommendationLevel;

    @Column(name = "recommended_roles")
    private List<String> recommendedRoles;

    @Column(name = "model_name", nullable = false)
    private String modelName;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}
