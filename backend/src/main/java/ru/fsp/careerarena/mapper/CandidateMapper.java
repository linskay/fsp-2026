package ru.fsp.careerarena.mapper;

import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.CandidateDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.User;

@Component
public class CandidateMapper {

    public CandidateDto toDto(CandidateProfile profile) {
        if (profile == null) return null;

        User user = profile.getUser();

        return CandidateDto.builder()
                .id(profile.getId())
                .userId(user != null ? user.getId() : null)
                .fullName(user != null ? user.getFullName() : "Не указано")
                .email(user != null ? user.getEmail() : "")
                .avatarUrl(user != null ? user.getAvatarUrl() : null)
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
