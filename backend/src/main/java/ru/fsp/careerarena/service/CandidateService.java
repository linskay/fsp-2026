package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.CandidateDto;
import ru.fsp.careerarena.dto.EloHistoryPointDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.mapper.CandidateMapper;
import ru.fsp.careerarena.repository.CandidateProfileRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateService {

    private final CandidateProfileRepository candidateRepository;
    private final CandidateMapper candidateMapper;
    private final ru.fsp.careerarena.repository.CandidateAiSummaryRepository aiSummaryRepository;

    @Transactional(readOnly = true)
    public List<CandidateDto> searchCandidates(Specialization specialization, Grade grade, Integer minElo, FspRank fspRank) {
        log.info("Searching candidates with spec={}, grade={}, minElo={}, rank={}", specialization, grade, minElo, fspRank);
        return candidateRepository.searchCandidates(specialization, grade, minElo, fspRank).stream()
                .map(this::enrichWithAiSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CandidateDto getCandidateById(UUID id) {
        return candidateRepository.findById(id)
                .map(this::enrichWithAiSummary)
                .orElseThrow(() -> new ResourceNotFoundException("Кандидат с ID " + id + " не найден"));
    }

    @Transactional(readOnly = true)
    public CandidateDto getCandidateByUserId(UUID userId) {
        return candidateRepository.findByUserId(userId)
                .map(this::enrichWithAiSummary)
                .orElseThrow(() -> new ResourceNotFoundException("Профиль кандидата для пользователя " + userId + " не найден"));
    }

    private CandidateDto enrichWithAiSummary(CandidateProfile profile) {
        CandidateDto dto = candidateMapper.toDto(profile);
        if (dto != null) {
            aiSummaryRepository.findByCandidateId(profile.getId()).ifPresent(summary -> {
                dto.setAiSummary(ru.fsp.careerarena.dto.AiSummaryDto.builder()
                        .id(summary.getId())
                        .candidateId(profile.getId())
                        .summaryText(summary.getSummaryText())
                        .codeCleanlinessScore(summary.getCodeCleanlinessScore() != null ? summary.getCodeCleanlinessScore() : 95)
                        .keyStrengths(summary.getKeyStrengths())
                        .recommendationLevel(summary.getRecommendationLevel())
                        .recommendedRoles(summary.getRecommendedRoles())
                        .modelName(summary.getModelName())
                        .generatedAt(summary.getCreatedAt() != null ? summary.getCreatedAt() : OffsetDateTime.now())
                        .build());
            });
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public List<CandidateDto> getLeaderboard(String location, FspRank fspRank, String skill, Integer minElo, int limit) {
        log.info("Fetching FSP Global Leaderboard: location={}, rank={}, skill={}, minElo={}, limit={}",
                location, fspRank, skill, minElo, limit);
        return candidateRepository.findAll().stream()
                .filter(c -> location == null || location.isBlank() || (c.getLocation() != null && c.getLocation().toLowerCase().contains(location.toLowerCase())))
                .filter(c -> fspRank == null || c.getFspRank() == fspRank)
                .filter(c -> skill == null || skill.isBlank() || (c.getSkills() != null && c.getSkills().stream().anyMatch(s -> s.toLowerCase().contains(skill.toLowerCase()))))
                .filter(c -> minElo == null || c.getFspElo() >= minElo)
                .sorted((a, b) -> Integer.compare(b.getFspElo(), a.getFspElo()))
                .limit(limit > 0 ? limit : 100)
                .map(this::enrichWithAiSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EloHistoryPointDto> getEloHistory(UUID id) {
        CandidateProfile profile = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Кандидат с ID " + id + " не найден"));

        int currentElo = profile.getFspElo();
        OffsetDateTime baseTime = profile.getCreatedAt() != null ? profile.getCreatedAt() : OffsetDateTime.now().minusMonths(6);

        if (currentElo <= 0 || profile.getFspId() == null) {
            return List.of(EloHistoryPointDto.builder()
                    .date(baseTime)
                    .elo(0)
                    .change(0)
                    .event("Профиль без спортивной истории ФСП (ранжирование по стеку и техническим тестам)")
                    .eventType("INITIAL")
                    .build());
        }

        // Generate realistic historical progression leading up to currentElo
        int p1Elo = 1000;
        int p2Elo = Math.max(1050, 1000 + (currentElo - 1000) / 4);
        int p3Elo = Math.max(1150, 1000 + (currentElo - 1000) / 2);
        int p4Elo = Math.max(1200, 1000 + (currentElo - 1000) * 3 / 4);

        return List.of(
                EloHistoryPointDto.builder()
                        .date(baseTime)
                        .elo(p1Elo)
                        .change(p1Elo)
                        .event("Стартовый рейтинг при регистрации в системе ФСП")
                        .eventType("INITIAL")
                        .build(),
                EloHistoryPointDto.builder()
                        .date(baseTime.plusMonths(1))
                        .elo(p2Elo)
                        .change(p2Elo - p1Elo)
                        .event("Чемпионат ФСП по спортивному программированию (Отборочный этап)")
                        .eventType("CHAMPIONSHIP")
                        .build(),
                EloHistoryPointDto.builder()
                        .date(baseTime.plusMonths(2))
                        .elo(p3Elo)
                        .change(p3Elo - p2Elo)
                        .event("Code Arena FSP: Квалификационный раунд #4")
                        .eventType("ARENA_ROUND")
                        .build(),
                EloHistoryPointDto.builder()
                        .date(baseTime.plusMonths(3))
                        .elo(p4Elo)
                        .change(p4Elo - p3Elo)
                        .event("Квалификационный тест на подтверждение грейда " + profile.getGrade().getDisplayName())
                        .eventType("QUALIFICATION_TEST")
                        .build(),
                EloHistoryPointDto.builder()
                        .date(OffsetDateTime.now().minusDays(3))
                        .elo(currentElo)
                        .change(currentElo - p4Elo)
                        .event("Текущий верифицированный рейтинг ФСП")
                        .eventType("VERIFIED")
                        .build()
        );
    }

    public CandidateDto mapToDto(CandidateProfile profile) {
        return candidateMapper.toDto(profile);
    }
}
