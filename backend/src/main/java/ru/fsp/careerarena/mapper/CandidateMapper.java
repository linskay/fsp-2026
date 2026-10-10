package ru.fsp.careerarena.mapper;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.CandidateDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.util.DataMaskingUtils;

@Component
public class CandidateMapper {

    public CandidateDto toDto(CandidateProfile profile) {
        if (profile == null) return null;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isCandidateThemselves = false;
        boolean isAdmin = false;

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String currentEmail = auth.getName();
            if (profile.getUser() != null && profile.getUser().getEmail().equalsIgnoreCase(currentEmail)) {
                isCandidateThemselves = true;
            }
            if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                isAdmin = true;
            }
        }

        boolean revealContacts = isCandidateThemselves || isAdmin;

        return mapInternal(profile, revealContacts);
    }

    public CandidateDto toMaskedDto(CandidateProfile profile) {
        return mapInternal(profile, false);
    }

    public CandidateDto toUnmaskedDto(CandidateProfile profile) {
        return mapInternal(profile, true);
    }

    private CandidateDto mapInternal(CandidateProfile profile, boolean revealContacts) {
        if (profile == null) return null;

        User user = profile.getUser();
        String rawFullName = user != null ? user.getFullName() : "Не указано";
        String rawEmail = user != null ? user.getEmail() : "";
        String rawPhone = "+7 (999) 123-45-21";
        String rawTelegram = user != null ? "@" + user.getEmail().split("@")[0] : "@ipesterev";

        String displayFullName = revealContacts ? rawFullName : DataMaskingUtils.maskFullName(rawFullName);
        String displayEmail = revealContacts ? rawEmail : DataMaskingUtils.maskEmail(rawEmail);
        String displayPhone = revealContacts ? rawPhone : DataMaskingUtils.maskPhone(rawPhone);
        String displayTelegram = revealContacts ? rawTelegram : DataMaskingUtils.maskTelegram(rawTelegram);

        return CandidateDto.builder()
                .id(profile.getId())
                .userId(user != null ? user.getId() : null)
                .fullName(displayFullName)
                .email(displayEmail)
                .phone(displayPhone)
                .telegram(displayTelegram)
                .contactsRevealed(revealContacts)
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
