package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.CandidateApplicationDto;
import ru.fsp.careerarena.dto.CreateApplicationRequest;
import ru.fsp.careerarena.entity.CandidateApplication;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.Vacancy;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.mapper.CandidateApplicationMapper;
import ru.fsp.careerarena.repository.CandidateApplicationRepository;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.VacancyRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateApplicationService {

    private final CandidateApplicationRepository applicationRepository;
    private final CandidateProfileRepository candidateRepository;
    private final VacancyRepository vacancyRepository;
    private final CandidateApplicationMapper candidateApplicationMapper;

    @Transactional
    public CandidateApplicationDto createApplication(CreateApplicationRequest request) {
        CandidateProfile candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Кандидат с ID " + request.getCandidateId() + " не найден"));

        Vacancy vacancy = vacancyRepository.findById(request.getVacancyId())
                .orElseThrow(() -> new ResourceNotFoundException("Вакансия с ID " + request.getVacancyId() + " не найдена"));

        CandidateApplication application = CandidateApplication.builder()
                .candidate(candidate)
                .vacancy(vacancy)
                .coverLetter(request.getCoverLetter())
                .status("NEW")
                .build();

        application = applicationRepository.save(application);
        log.info("Created candidate application {} for vacancy {}", application.getId(), vacancy.getId());
        return candidateApplicationMapper.toDto(application);
    }

    @Transactional(readOnly = true)
    public List<CandidateApplicationDto> getApplicationsByVacancyId(UUID vacancyId) {
        return applicationRepository.findByVacancyIdOrderByCreatedAtDesc(vacancyId).stream()
                .map(candidateApplicationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CandidateApplicationDto> getApplicationsByCandidateId(UUID candidateId) {
        return applicationRepository.findByCandidateIdOrderByCreatedAtDesc(candidateId).stream()
                .map(candidateApplicationMapper::toDto)
                .collect(Collectors.toList());
    }

    public CandidateApplicationDto mapToDto(CandidateApplication app) {
        return candidateApplicationMapper.toDto(app);
    }
}
