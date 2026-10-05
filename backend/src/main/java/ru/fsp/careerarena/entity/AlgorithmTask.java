package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "algorithm_tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlgorithmTask {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String difficulty; // EASY, MEDIUM, HARD

    @Column(nullable = false)
    private String tags;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "input_format", columnDefinition = "TEXT")
    private String inputFormat;

    @Column(name = "output_format", columnDefinition = "TEXT")
    private String outputFormat;

    @Column(name = "time_limit_ms")
    @Builder.Default
    private int timeLimitMs = 2000;

    @Column(name = "memory_limit_mb")
    @Builder.Default
    private int memoryLimitMb = 256;

    @Column(name = "initial_code_java", columnDefinition = "TEXT")
    private String initialCodeJava;

    @Column(name = "initial_code_python", columnDefinition = "TEXT")
    private String initialCodePython;

    @Column(name = "initial_code_cpp", columnDefinition = "TEXT")
    private String initialCodeCpp;

    @Column(name = "initial_code_go", columnDefinition = "TEXT")
    private String initialCodeGo;

    @Column(name = "initial_code_js", columnDefinition = "TEXT")
    private String initialCodeJs;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}
