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
