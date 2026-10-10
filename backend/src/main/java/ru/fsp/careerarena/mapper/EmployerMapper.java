package ru.fsp.careerarena.mapper;

import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.EmployerDto;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.User;

@Component
public class EmployerMapper {

    public EmployerDto toDto(EmployerProfile profile, int activeVacanciesCount) {
        if (profile == null) return null;

        User user = profile.getUser();

        return EmployerDto.builder()
                .id(profile.getId())
                .userId(user != null ? user.getId() : null)
                .companyName(profile.getCompanyName())
                .companyLogo(profile.getCompanyLogo())
                .industry(profile.getIndustry())
                .description(profile.getDescription())
                .website(profile.getWebsite())
                .isFspPartner(profile.isFspPartner())
                .hhEmployerId(profile.getHhEmployerId())
                .recruiterName(user != null ? user.getFullName() : null)
                .recruiterEmail(user != null ? user.getEmail() : null)
                .recruiterAvatar(user != null ? user.getAvatarUrl() : null)
                .activeVacanciesCount(activeVacanciesCount)
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
