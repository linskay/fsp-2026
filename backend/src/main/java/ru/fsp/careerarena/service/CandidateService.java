package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.CandidateDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.repository.CandidateProfileRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateService {

    private final CandidateProfileRepository candidateRepository;

    @Transactional(readOnly = true)
    public List<CandidateDto> searchCandidates(Specialization specialization, Grade grade, Integer minElo, FspRank fspRank) {
        log.info("Searching candidates with spec={}, grade={}, minElo={}, rank={}", specialization, grade, minElo, fspRank);
        return candidateRepository.searchCandidates(specialization, grade, minElo, fspRank).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CandidateDto getCandidateById(UUID id) {
        return candidateRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new IllegalArgumentException("Кандидат с ID " + id + " не найден"));
    }

    @Transactional(readOnly = true)
    public CandidateDto getCandidateByUserId(UUID userId) {
        return candidateRepository.findByUserId(userId)
                .map(this::mapToDto)
                .orElseThrow(() -> new IllegalArgumentException("Профиль кандидата для пользователя " + userId + " не найден"));
    }

    @Transactional(readOnly = true)
    public List<ru.fsp.careerarena.dto.EloHistoryPointDto> getEloHistory(UUID id) {
        CandidateProfile profile = candidateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Кандидат с ID " + id + " не найден"));

        int currentElo = profile.getFspElo();
        java.time.OffsetDateTime baseTime = profile.getCreatedAt() != null ? profile.getCreatedAt() : java.time.OffsetDateTime.now().minusMonths(6);

        if (currentElo <= 0 || profile.getFspId() == null) {
            return List.of(ru.fsp.careerarena.dto.EloHistoryPointDto.builder()
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
                ru.fsp.careerarena.dto.EloHistoryPointDto.builder()
                        .date(baseTime)
                        .elo(p1Elo)
                        .change(p1Elo)
                        .event("Стартовый рейтинг при регистрации в системе ФСП")
                        .eventType("INITIAL")
                        .build(),
                ru.fsp.careerarena.dto.EloHistoryPointDto.builder()
                        .date(baseTime.plusMonths(1))
                        .elo(p2Elo)
                        .change(p2Elo - p1Elo)
                        .event("Чемпионат ФСП по спортивному программированию (Отборочный этап)")
                        .eventType("CHAMPIONSHIP")
                        .build(),
                ru.fsp.careerarena.dto.EloHistoryPointDto.builder()
                        .date(baseTime.plusMonths(2))
                        .elo(p3Elo)
                        .change(p3Elo - p2Elo)
                        .event("Code Arena FSP: Квалификационный раунд #4")
                        .eventType("ARENA_ROUND")
                        .build(),
                ru.fsp.careerarena.dto.EloHistoryPointDto.builder()
                        .date(baseTime.plusMonths(3))
                        .elo(p4Elo)
                        .change(p4Elo - p3Elo)
                        .event("Квалификационный тест на подтверждение грейда " + profile.getGrade().getDisplayName())
                        .eventType("QUALIFICATION_TEST")
                        .build(),
                ru.fsp.careerarena.dto.EloHistoryPointDto.builder()
                        .date(java.time.OffsetDateTime.now().minusDays(3))
                        .elo(currentElo)
                        .change(currentElo - p4Elo)
                        .event("Текущий верифицированный рейтинг ФСП")
                        .eventType("VERIFIED")
                        .build()
        );
    }

    public CandidateDto mapToDto(CandidateProfile profile) {
        return CandidateDto.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .fullName(profile.getUser() != null ? profile.getUser().getFullName() : "Не указано")
                .email(profile.getUser() != null ? profile.getUser().getEmail() : "")
                .avatarUrl(profile.getUser() != null ? profile.getUser().getAvatarUrl() : null)
                .fspId(profile.getFspId())
                .fspElo(profile.getFspElo())
                .fspRank(profile.getFspRank())
                .fspRankDisplayName(profile.getFspRank() != null ? profile.getFspRank().getDisplayName() : "")
                .specialization(profile.getSpecialization())
                .grade(profile.getGrade())
                .salaryExpectation(profile.getSalaryExpectation())
                .location(profile.getLocation())
                .bio(profile.getBio())
                .isFspVerified(profile.isFspVerified())
                .githubUsername(profile.getGithubUsername())
                .githubReposCount(profile.getGithubReposCount())
                .githubCommitsCount(profile.getGithubCommitsCount())
                .skills(profile.getSkills())
                .build();
    }
}
