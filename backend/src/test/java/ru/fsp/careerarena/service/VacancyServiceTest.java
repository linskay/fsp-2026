package ru.fsp.careerarena.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.fsp.careerarena.dto.CreateVacancyRequest;
import ru.fsp.careerarena.dto.VacancyDto;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.Vacancy;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.entity.enums.WorkFormat;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.VacancyRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование сервиса вакансий (VacancyService)")
class VacancyServiceTest {

    @Mock
    private VacancyRepository vacancyRepository;

    @Mock
    private EmployerProfileRepository employerRepository;

    @InjectMocks
    private VacancyService vacancyService;

    private EmployerProfile employer;
    private Vacancy vacancy;
    private UUID employerId;
    private UUID vacancyId;

    @BeforeEach
    void setUp() {
        employerId = UUID.randomUUID();
        vacancyId = UUID.randomUUID();

        employer = EmployerProfile.builder()
                .id(employerId)
                .companyName("Яндекс")
                .companyLogo("https://example.com/yandex.png")
                .industry("IT")
                .isFspPartner(true)
                .build();

        vacancy = Vacancy.builder()
                .id(vacancyId)
                .employer(employer)
                .title("Senior Java Developer")
                .specialization(Specialization.BACKEND)
                .grade(Grade.SENIOR)
                .salaryFrom(300000)
                .salaryTo(450000)
                .minFspElo(1800)
                .requiredFspRank(FspRank.KMS)
                .location("Москва")
                .workFormat(WorkFormat.REMOTE)
                .description("Разработка высоконагруженных бэкенд сервисов")
                .isActive(true)
                .hhVacancyId("hh-12345")
                .requiredSkills(Set.of("Java 21", "Spring Boot", "Kafka"))
                .build();
    }

    @Test
    @DisplayName("Получение всех активных вакансий возвращает корректный список DTO")
    void getAllVacancies_returnsActiveVacancyList() {
        when(vacancyRepository.findByIsActiveTrue()).thenReturn(List.of(vacancy));

        List<VacancyDto> result = vacancyService.getAllVacancies();

        assertThat(result).hasSize(1);
        VacancyDto dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(vacancyId);
        assertThat(dto.getCompanyName()).isEqualTo("Яндекс");
        assertThat(dto.getTitle()).isEqualTo("Senior Java Developer");
        verify(vacancyRepository).findByIsActiveTrue();
    }

    @Test
    @DisplayName("Поиск вакансий с фильтрами возвращает отфильтрованный список")
    void searchVacancies_withFilters_returnsFilteredList() {
        when(vacancyRepository.searchVacancies(Specialization.BACKEND, Grade.SENIOR, 1800))
                .thenReturn(List.of(vacancy));

        List<VacancyDto> result = vacancyService.searchVacancies(Specialization.BACKEND, Grade.SENIOR, 1800);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Senior Java Developer");
        verify(vacancyRepository).searchVacancies(Specialization.BACKEND, Grade.SENIOR, 1800);
    }

    @Test
    @DisplayName("Получение вакансий по ID работодателя")
    void getVacanciesByEmployer_returnsEmployerVacancies() {
        when(vacancyRepository.findByEmployerId(employerId)).thenReturn(List.of(vacancy));

        List<VacancyDto> result = vacancyService.getVacanciesByEmployer(employerId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmployerId()).isEqualTo(employerId);
        verify(vacancyRepository).findByEmployerId(employerId);
    }

    @Test
    @DisplayName("Успешное создание вакансии с валидными параметрами")
    void createVacancy_validRequest_createsAndReturnsDto() {
        CreateVacancyRequest request = CreateVacancyRequest.builder()
                .employerId(employerId)
                .title("Lead Java Architect")
                .specialization(Specialization.BACKEND)
                .grade(Grade.LEAD)
                .salaryFrom(400000)
                .salaryTo(600000)
                .minFspElo(2000)
                .requiredFspRank(FspRank.MS)
                .location("Санкт-Петербург")
                .workFormat(WorkFormat.HYBRID)
                .description("Архитектура масштабируемых систем")
                .requiredSkills(Set.of("Java", "Kubernetes", "Architecture"))
                .hhVacancyId("hh-lead-999")
                .build();

        when(employerRepository.findById(employerId)).thenReturn(Optional.of(employer));
        when(vacancyRepository.save(any(Vacancy.class))).thenAnswer(invocation -> {
            Vacancy v = invocation.getArgument(0);
            v.setId(UUID.randomUUID());
            return v;
        });

        VacancyDto created = vacancyService.createVacancy(request);

        assertThat(created).isNotNull();
        assertThat(created.getTitle()).isEqualTo("Lead Java Architect");
        assertThat(created.getSalaryFrom()).isEqualTo(400000);
        assertThat(created.getSalaryTo()).isEqualTo(600000);
        assertThat(created.getMinFspElo()).isEqualTo(2000);
        assertThat(created.getCompanyName()).isEqualTo("Яндекс");
        verify(employerRepository).findById(employerId);
        verify(vacancyRepository).save(any(Vacancy.class));
    }

    @Test
    @DisplayName("Создание вакансии со значением minFspElo равным null устанавливает 0 по умолчанию")
    void createVacancy_nullMinElo_defaultsToZero() {
        CreateVacancyRequest request = CreateVacancyRequest.builder()
                .employerId(employerId)
                .title("Junior Java Developer")
                .specialization(Specialization.BACKEND)
                .grade(Grade.JUNIOR)
                .salaryFrom(80000)
                .salaryTo(120000)
                .minFspElo(null)
                .location("Удаленно")
                .workFormat(WorkFormat.REMOTE)
                .description("Стажировка")
                .build();

        when(employerRepository.findById(employerId)).thenReturn(Optional.of(employer));
        when(vacancyRepository.save(any(Vacancy.class))).thenAnswer(invocation -> invocation.getArgument(0));

        VacancyDto created = vacancyService.createVacancy(request);

        assertThat(created.getMinFspElo()).isEqualTo(0);
    }

    @Test
    @DisplayName("Создание вакансии с минимальной зарплатой больше максимальной выбрасывает исключение")
    void createVacancy_salaryFromGreaterThanSalaryTo_throwsException() {
        CreateVacancyRequest invalidRequest = CreateVacancyRequest.builder()
                .employerId(employerId)
                .title("Invalid Vacancy")
                .salaryFrom(500000)
                .salaryTo(300000)
                .build();

        assertThatThrownBy(() -> vacancyService.createVacancy(invalidRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Минимальная зарплата (от) не может превышать максимальную (до)");
    }

    @Test
    @DisplayName("Создание вакансии для несуществующего работодателя выбрасывает исключение")
    void createVacancy_employerNotFound_throwsException() {
        UUID unknownEmpId = UUID.randomUUID();
        CreateVacancyRequest request = CreateVacancyRequest.builder()
                .employerId(unknownEmpId)
                .title("Backend Dev")
                .salaryFrom(150000)
                .salaryTo(200000)
                .build();

        when(employerRepository.findById(unknownEmpId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vacancyService.createVacancy(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("не найден");
    }

    @Test
    @DisplayName("Маппинг вакансии без связанного работодателя корректно подставляет значения по умолчанию")
    void mapToDto_nullEmployer_handlesGracefully() {
        Vacancy v = Vacancy.builder()
                .id(UUID.randomUUID())
                .employer(null)
                .title("Independent Vacancy")
                .specialization(Specialization.DEVOPS)
                .grade(Grade.MIDDLE)
                .salaryFrom(150000)
                .salaryTo(220000)
                .minFspElo(1300)
                .location("Новосибирск")
                .workFormat(WorkFormat.OFFICE)
                .description("Поддержка CI/CD")
                .isActive(true)
                .build();

        VacancyDto dto = vacancyService.mapToDto(v);

        assertThat(dto.getEmployerId()).isNull();
        assertThat(dto.getCompanyName()).isEqualTo("Компания");
        assertThat(dto.getCompanyLogo()).isNull();
    }
}
