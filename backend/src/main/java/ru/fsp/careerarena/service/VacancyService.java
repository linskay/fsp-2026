package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.CreateVacancyRequest;
import ru.fsp.careerarena.dto.VacancyDto;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.Vacancy;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.exception.BadRequestException;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.mapper.VacancyMapper;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.VacancyRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VacancyService {

    private final VacancyRepository vacancyRepository;
    private final EmployerProfileRepository employerRepository;
    private final VacancyMapper vacancyMapper;

    @Transactional(readOnly = true)
    public List<VacancyDto> getAllVacancies() {
        return vacancyRepository.findByIsActiveTrue().stream()
                .map(vacancyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VacancyDto> searchVacancies(Specialization specialization, Grade grade, Integer maxRequiredElo) {
        return vacancyRepository.searchVacancies(specialization, grade, maxRequiredElo).stream()
                .map(vacancyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VacancyDto> getVacanciesByEmployer(UUID employerId) {
        return vacancyRepository.findByEmployerId(employerId).stream()
                .map(vacancyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public VacancyDto createVacancy(CreateVacancyRequest request) {
        if (request.getSalaryFrom() > request.getSalaryTo()) {
            throw new BadRequestException("Минимальная зарплата (от) не может превышать максимальную (до)");
        }

        EmployerProfile employer = employerRepository.findById(request.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Работодатель с ID " + request.getEmployerId() + " не найден"));

        Vacancy vacancy = Vacancy.builder()
                .employer(employer)
                .title(request.getTitle())
                .specialization(request.getSpecialization())
                .grade(request.getGrade())
                .salaryFrom(request.getSalaryFrom())
                .salaryTo(request.getSalaryTo())
                .minFspElo(request.getMinFspElo() != null ? request.getMinFspElo() : 0)
                .requiredFspRank(request.getRequiredFspRank())
                .location(request.getLocation())
                .workFormat(request.getWorkFormat())
                .description(request.getDescription())
                .isActive(true)
                .hhVacancyId(request.getHhVacancyId())
                .requiredSkills(request.getRequiredSkills())
                .build();

        Vacancy saved = vacancyRepository.save(vacancy);
        log.info("Created new vacancy ID={} for employer={}", saved.getId(), employer.getCompanyName());
        return vacancyMapper.toDto(saved);
    }

    public VacancyDto mapToDto(Vacancy v) {
        return vacancyMapper.toDto(v);
    }
}
