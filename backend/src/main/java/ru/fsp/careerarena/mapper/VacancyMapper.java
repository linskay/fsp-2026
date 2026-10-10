package ru.fsp.careerarena.mapper;

import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.VacancyDto;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.Vacancy;

import java.util.LinkedHashSet;

@Component
public class VacancyMapper {

    public VacancyDto toDto(Vacancy vacancy) {
        if (vacancy == null) return null;

        EmployerProfile employer = vacancy.getEmployer();

        return VacancyDto.builder()
                .id(vacancy.getId())
                .employerId(employer != null ? employer.getId() : null)
                .companyName(employer != null ? employer.getCompanyName() : "Не указано")
                .companyLogo(employer != null ? employer.getCompanyLogo() : null)
                .title(vacancy.getTitle())
                .specialization(vacancy.getSpecialization())
                .grade(vacancy.getGrade())
                .salaryFrom(vacancy.getSalaryFrom())
                .salaryTo(vacancy.getSalaryTo())
                .minFspElo(vacancy.getMinFspElo())
                .requiredFspRank(vacancy.getRequiredFspRank())
                .location(vacancy.getLocation())
                .workFormat(vacancy.getWorkFormat())
                .description(vacancy.getDescription())
                .isActive(vacancy.isActive())
                .requiredSkills(vacancy.getRequiredSkills() != null ? new LinkedHashSet<>(vacancy.getRequiredSkills()) : new LinkedHashSet<>())
                .build();
    }
}
