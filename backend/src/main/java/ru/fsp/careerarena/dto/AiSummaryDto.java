package ru.fsp.careerarena.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiSummaryDto {
    private UUID id;
    private UUID candidateId;
    private String summaryText;
    private List<String> keyStrengths;
    private String recommendationLevel;
    private List<String> recommendedRoles;
    private String modelName;
    private OffsetDateTime generatedAt;
}
