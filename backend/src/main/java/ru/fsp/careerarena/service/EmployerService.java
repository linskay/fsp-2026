package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.EmployerDto;
import ru.fsp.careerarena.dto.UpdateEmployerRequest;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.UserRepository;
import ru.fsp.careerarena.repository.VacancyRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployerService {

    private final EmployerProfileRepository employerRepository;
    private final VacancyRepository vacancyRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public EmployerDto getEmployerById(UUID id) {
        EmployerProfile profile = employerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Профиль работодателя с ID " + id + " не найден"));

        return mapToDto(profile);
    }

    @Transactional
    public EmployerDto updateEmployer(UUID id, UpdateEmployerRequest request) {
        EmployerProfile profile = employerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Профиль работодателя с ID " + id + " не найден"));

        if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
            profile.setCompanyName(request.getCompanyName());
        }
        if (request.getCompanyLogo() != null) {
            profile.setCompanyLogo(request.getCompanyLogo());
        }
        if (request.getIndustry() != null && !request.getIndustry().isBlank()) {
            profile.setIndustry(request.getIndustry());
        }
        if (request.getDescription() != null) {
            profile.setDescription(request.getDescription());
        }
        if (request.getWebsite() != null) {
            profile.setWebsite(request.getWebsite());
        }

        if (request.getRecruiterName() != null && !request.getRecruiterName().isBlank() && profile.getUser() != null) {
            User user = profile.getUser();
            user.setFullName(request.getRecruiterName());
            userRepository.save(user);
        }

        profile = employerRepository.save(profile);
        return mapToDto(profile);
    }

    private EmployerDto mapToDto(EmployerProfile profile) {
        int activeVacanciesCount = (int) vacancyRepository.findByEmployerId(profile.getId()).stream()
                .filter(v -> v.isActive())
                .count();

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
