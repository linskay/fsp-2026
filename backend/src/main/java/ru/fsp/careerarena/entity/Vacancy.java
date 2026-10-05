package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.entity.enums.WorkFormat;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "vacancies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vacancy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private EmployerProfile employer;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Specialization specialization;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grade grade;

    @Column(name = "salary_from", nullable = false)
    private int salaryFrom;

    @Column(name = "salary_to", nullable = false)
    private int salaryTo;

    @Column(name = "min_fsp_elo")
    private int minFspElo;

    @Enumerated(EnumType.STRING)
    @Column(name = "required_fsp_rank")
    private FspRank requiredFspRank;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_format", nullable = false)
    private WorkFormat workFormat;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "hh_vacancy_id")
    private String hhVacancyId;

    @ElementCollection
    @CollectionTable(name = "vacancy_skills", joinColumns = @JoinColumn(name = "vacancy_id"))
    @Column(name = "skill_name")
    @Builder.Default
    private Set<String> requiredSkills = new HashSet<>();

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
