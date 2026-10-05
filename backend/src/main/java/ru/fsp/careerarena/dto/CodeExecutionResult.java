package ru.fsp.careerarena.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.SubmissionVerdict;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionResult {
    private UUID submissionId;
    private SubmissionVerdict verdict;
    private String statusMessage;
    private int testsPassed;
    private int totalTests;
    private int executionTimeMs;
    private int memoryUsedKb;
    private String stdout;
    private String stderr;
    private OffsetDateTime submittedAt;
}
