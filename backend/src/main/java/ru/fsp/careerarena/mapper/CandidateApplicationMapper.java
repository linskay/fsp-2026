package ru.fsp.careerarena.mapper;

import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.CandidateApplicationDto;
import ru.fsp.careerarena.entity.CandidateApplication;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.entity.Vacancy;

@Component
public class CandidateApplicationMapper {

    public CandidateApplicationDto toDto(CandidateApplication app) {
        if (app == null) return null;
        CandidateProfile c = app.getCandidate();
        User u = c != null ? c.getUser() : null;
        Vacancy v = app.getVacancy();

        return CandidateApplicationDto.builder()
                .id(app.getId())
                .candidateId(c != null ? c.getId() : null)
                .candidateName(u != null ? u.getFullName() : "Не указано")
                .candidateAvatar(u != null ? u.getAvatarUrl() : null)
                .candidateSpecialization(c != null ? c.getSpecialization() : null)
                .candidateGrade(c != null ? c.getGrade() : null)
                .candidateElo(c != null ? c.getFspElo() : 0)
                .candidateFspRank(c != null ? c.getFspRank() : null)
                .vacancyId(v != null ? v.getId() : null)
                .vacancyTitle(v != null ? v.getTitle() : "Не указано")
                .companyName(v != null && v.getEmployer() != null ? v.getEmployer().getCompanyName() : "Не указано")
                .coverLetter(app.getCoverLetter())
                .status(app.getStatus())
                .createdAt(app.getCreatedAt())
                .build();
    }
}
