package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "assessment_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private EmployerProfile employer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private CandidateProfile candidate;

    @Column(name = "task_title", nullable = false)
    private String taskTitle;

    @Column(name = "task_difficulty", nullable = false)
    @Builder.Default
    private String taskDifficulty = "Medium";

    @Column(name = "task_description", columnDefinition = "TEXT", nullable = false)
    private String taskDescription;

    @Column(name = "starter_code", columnDefinition = "TEXT")
    private String starterCode;

    @Column(name = "time_limit_minutes", nullable = false)
    @Builder.Default
    private int timeLimitMinutes = 45;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // PENDING, IN_PROGRESS, SUBMITTED, REVIEWED

    @Column(name = "is_live_interview", nullable = false)
    @Builder.Default
    private boolean liveInterview = false;

    @Column(name = "telemost_room_url")
    private String telemostRoomUrl;

    @Column(name = "scheduled_interview_at")
    private OffsetDateTime scheduledInterviewAt;

    @Column(name = "submission_code", columnDefinition = "TEXT")
    private String submissionCode;

    @Column(name = "submission_language")
    private String submissionLanguage;

    @Column(name = "tests_passed")
    @Builder.Default
    private Integer testsPassed = 0;

    @Column(name = "total_tests")
    @Builder.Default
    private Integer totalTests = 0;

    @Column(name = "execution_time_ms")
    @Builder.Default
    private Integer executionTimeMs = 0;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @Column(name = "review_verdict")
    private String reviewVerdict; // HIRED, REJECTED, LIKE, DISLIKE

    @Column(name = "internal_note", columnDefinition = "TEXT")
    private String internalNote;

    @Column(name = "candidate_feedback_message", columnDefinition = "TEXT")
    private String candidateFeedbackMessage;

    @Column(name = "reviewer_name")
    private String reviewerName;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }
}
