package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "fsp_id", unique = true)
    private String fspId;

    @Column(name = "fsp_elo", nullable = false)
    private int fspElo;

    @Enumerated(EnumType.STRING)
    @Column(name = "fsp_rank", nullable = false)
    private FspRank fspRank;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Specialization specialization;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grade grade;

    @Column(name = "salary_expectation", nullable = false)
    private int salaryExpectation;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "is_fsp_verified", nullable = false)
    private boolean isFspVerified;

    @Column(name = "github_username")
    private String githubUsername;

    @Column(name = "github_repos_count")
    private int githubReposCount;

    @Column(name = "github_commits_count")
    private int githubCommitsCount;

    @Column(name = "yandex_id")
    private String yandexId;

    @Column(name = "hh_resume_id")
    private String hhResumeId;

    @ElementCollection
    @CollectionTable(name = "candidate_skills", joinColumns = @JoinColumn(name = "candidate_id"))
    @Column(name = "skill_name")
    @Builder.Default
    private Set<String> skills = new HashSet<>();

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
