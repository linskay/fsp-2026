package ru.fsp.careerarena.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDto {
    private UUID id;
    private UUID userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String fspId;
    private int fspElo;
    private FspRank fspRank;
    private String fspRankDisplayName;
    private Specialization specialization;
    private Grade grade;
    private int salaryExpectation;
    private String location;
    private String bio;
    private boolean isFspVerified;
    private String githubUsername;
    private int githubReposCount;
    private int githubCommitsCount;
    private Set<String> skills;
}
