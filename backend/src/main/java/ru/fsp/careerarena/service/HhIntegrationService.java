package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.HhImportRequest;
import ru.fsp.careerarena.dto.HhImportResultDto;
import ru.fsp.careerarena.dto.HhVacancyDto;
import ru.fsp.careerarena.dto.VacancyDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.Vacancy;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.entity.enums.WorkFormat;
import ru.fsp.careerarena.exception.BadRequestException;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.VacancyRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HhIntegrationService {

    private final EmployerProfileRepository employerRepository;
    private final VacancyRepository vacancyRepository;
    private final CandidateProfileRepository candidateRepository;
    private final VacancyService vacancyService;

    private static final List<HhVacancyDto> HH_CATALOG = List.of(
            HhVacancyDto.builder()
                    .id("hh-vac-1")
                    .externalId("hh-vac-1")
                    .title("Senior Java Backend Engineer (Core Banking & Highload)")
                    .city("Москва / Удаленно")
                    .workFormat("REMOTE")
                    .salaryMin(420000)
                    .salaryMax(550000)
                    .currency("RUB")
                    .specialization(Specialization.BACKEND)
                    .grade(Grade.SENIOR)
                    .skills(List.of("Java 21", "Spring Boot 3", "Kafka", "PostgreSQL", "Redis", "Docker"))
                    .description("Ищем Senior инженера в команду высоконагруженного ядра транзакций. Опыт работы с микросервисами и реляционными СУБД под высокими нагрузками. Плюсом будут победы и разряды в спортивном программировании ФСП.")
                    .url("https://hh.ru/vacancy/98421001")
                    .build(),
            HhVacancyDto.builder()
                    .id("hh-vac-2")
                    .externalId("hh-vac-2")
                    .title("Lead C++ / Highload Архитектор (Matching Engine)")
                    .city("Москва")
                    .workFormat("HYBRID")
                    .salaryMin(520000)
                    .salaryMax(700000)
                    .currency("RUB")
                    .specialization(Specialization.BACKEND)
                    .grade(Grade.LEAD)
                    .skills(List.of("C++20", "Low Latency", "SIMD", "Lock-free", "Linux Kernel", "PostgreSQL"))
                    .description("Разработка биржевого движка сопоставления заявок (Matching Engine) с задержкой исполнения sub-microsecond. Идеально для чемпионов и призеров соревнований ФСП РФ.")
                    .url("https://hh.ru/vacancy/98421002")
                    .build(),
            HhVacancyDto.builder()
                    .id("hh-vac-3")
                    .externalId("hh-vac-3")
                    .title("Fullstack Engineer (React + Spring Boot 3)")
                    .city("Санкт-Петербург / Удаленно")
                    .workFormat("REMOTE")
                    .salaryMin(350000)
                    .salaryMax(460000)
                    .currency("RUB")
                    .specialization(Specialization.FULLSTACK)
                    .grade(Grade.SENIOR)
                    .skills(List.of("TypeScript", "React", "Tailwind CSS", "Java 21", "Spring Boot 3", "PostgreSQL"))
                    .description("Создание передовых внутренних аналитических панелей и сервисов автоматизации клиентских операций для B2B клиентов.")
                    .url("https://hh.ru/vacancy/98421003")
                    .build(),
            HhVacancyDto.builder()
                    .id("hh-vac-4")
                    .externalId("hh-vac-4")
                    .title("DevOps / Platform Engineer (Kubernetes & Bare Metal)")
                    .city("Удаленно")
                    .workFormat("REMOTE")
                    .salaryMin(380000)
                    .salaryMax(500000)
                    .currency("RUB")
                    .specialization(Specialization.DEVOPS)
                    .grade(Grade.SENIOR)
                    .skills(List.of("Kubernetes", "Helm", "Terraform", "Kafka", "Prometheus", "Grafana", "CI/CD"))
                    .description("Развитие отказоустойчивой инфраструктуры в приватном облаке, оркестрация распределенных баз данных PostgreSQL и брокеров Kafka.")
                    .url("https://hh.ru/vacancy/98421004")
                    .build()
    );

    @Transactional(readOnly = true)
    public List<HhVacancyDto> getAvailableVacancies(UUID employerId) {
        Set<String> alreadyImportedHhIds = vacancyRepository.findAll().stream()
                .map(Vacancy::getHhVacancyId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        return HH_CATALOG.stream().map(v -> {
            boolean isImported = alreadyImportedHhIds.contains(v.getExternalId());
            return HhVacancyDto.builder()
                    .id(v.getId())
                    .externalId(v.getExternalId())
                    .title(v.getTitle())
                    .city(v.getCity())
                    .workFormat(v.getWorkFormat())
                    .salaryMin(v.getSalaryMin())
                    .salaryMax(v.getSalaryMax())
                    .currency(v.getCurrency())
                    .specialization(v.getSpecialization())
                    .grade(v.getGrade())
                    .skills(v.getSkills())
                    .description(v.getDescription())
                    .imported(isImported)
                    .url(v.getUrl())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public HhImportResultDto importVacancies(HhImportRequest request) {
        if (request.getExternalIds() == null || request.getExternalIds().isEmpty()) {
            throw new BadRequestException("Список ID вакансий для импорта (externalIds) не может быть пустым");
        }

        EmployerProfile employer;
        if (request.getEmployerId() != null) {
            employer = employerRepository.findById(request.getEmployerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Работодатель с ID " + request.getEmployerId() + " не найден"));
        } else {
            employer = employerRepository.findAll().stream()
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("В системе не найден профиль компании работодателя"));
        }

        List<VacancyDto> createdList = new ArrayList<>();
        Map<String, Integer> matchingSummary = new LinkedHashMap<>();
        int totalMatchedCandidates = 0;

        for (String extId : request.getExternalIds()) {
            HhVacancyDto source = HH_CATALOG.stream()
                    .filter(v -> v.getExternalId().equalsIgnoreCase(extId) || v.getId().equalsIgnoreCase(extId))
                    .findFirst()
                    .orElse(null);

            if (source == null) {
                log.warn("HH vacancy with ID {} not found in catalog, skipping", extId);
                continue;
            }

            // ТЗ validation: mandatory ruble salary range from-to
            if (source.getSalaryMin() <= 0 || source.getSalaryMax() <= 0 || source.getSalaryMax() < source.getSalaryMin()) {
                throw new BadRequestException("Вакансия '" + source.getTitle() + "' нарушает требования ТЗ: обязательна корректная рублевая вилка 'от-до'");
            }

            int minElo = source.getGrade() == Grade.LEAD ? 2200 : (source.getGrade() == Grade.SENIOR ? 1800 : 1200);

            Vacancy vacancy = Vacancy.builder()
                    .employer(employer)
                    .title(source.getTitle())
                    .specialization(source.getSpecialization())
                    .grade(source.getGrade())
                    .salaryFrom(source.getSalaryMin())
                    .salaryTo(source.getSalaryMax())
                    .minFspElo(minElo)
                    .location(source.getCity())
                    .workFormat(source.getWorkFormat().equalsIgnoreCase("REMOTE") ? WorkFormat.REMOTE : WorkFormat.HYBRID)
                    .description(source.getDescription())
                    .isActive(true)
                    .hhVacancyId(source.getExternalId())
                    .requiredSkills(new HashSet<>(source.getSkills()))
                    .build();

            vacancy = vacancyRepository.save(vacancy);
            createdList.add(vacancyService.mapToDto(vacancy));

            // Instant algorithmic matching on candidate pool
            List<CandidateProfile> matches = candidateRepository.searchCandidates(
                    source.getSpecialization(),
                    source.getGrade(),
                    null,
                    null
            );
            int matchedCount = matches.size();
            matchingSummary.put(source.getTitle(), matchedCount);
            totalMatchedCandidates += matchedCount;

            log.info("Successfully imported HH vacancy '{}' ({}) with {} matching FSP candidates",
                    vacancy.getTitle(), vacancy.getId(), matchedCount);
        }

        return HhImportResultDto.builder()
                .importedCount(createdList.size())
                .vacancies(createdList)
                .matchedCandidatesTotal(totalMatchedCandidates)
                .matchingSummary(matchingSummary)
                .message(String.format("Успешно импортировано %d вакансий из HeadHunter. Вакансии активны и ранжируют кандидатов ФСП.", createdList.size()))
                .build();
    }
}
