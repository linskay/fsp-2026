package ru.fsp.careerarena.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.fsp.careerarena.dto.CreateVacancyRequest;
import ru.fsp.careerarena.dto.VacancyDto;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.service.VacancyService;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование контроллера вакансий (VacancyController)")
class VacancyControllerTest {

    @Mock
    private VacancyService vacancyService;

    @InjectMocks
    private VacancyController vacancyController;

    private VacancyDto sampleVacancyDto;
    private UUID employerId;

    @BeforeEach
    void setUp() {
        employerId = UUID.randomUUID();
        sampleVacancyDto = VacancyDto.builder()
                .id(UUID.randomUUID())
                .employerId(employerId)
                .companyName("Тинькофф")
                .title("Java Middle Developer")
                .specialization(Specialization.BACKEND)
                .grade(Grade.MIDDLE)
                .salaryFrom(200000)
                .salaryTo(300000)
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Получение всех вакансий без параметров фильтрации вызывает getAllVacancies")
    void getAllVacancies_withoutParams_callsGetAllVacancies() {
        when(vacancyService.getAllVacancies()).thenReturn(List.of(sampleVacancyDto));

        ResponseEntity<List<VacancyDto>> response = vacancyController.getAllVacancies(null, null, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().hasSize(1);
        verify(vacancyService).getAllVacancies();
    }

    @Test
    @DisplayName("Получение всех вакансий с параметрами вызывает searchVacancies")
    void getAllVacancies_withParams_callsSearchVacancies() {
        when(vacancyService.searchVacancies(Specialization.BACKEND, Grade.MIDDLE, 1600))
                .thenReturn(List.of(sampleVacancyDto));

        ResponseEntity<List<VacancyDto>> response = vacancyController.getAllVacancies(Specialization.BACKEND, Grade.MIDDLE, 1600);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().hasSize(1);
        verify(vacancyService).searchVacancies(Specialization.BACKEND, Grade.MIDDLE, 1600);
    }

    @Test
    @DisplayName("Поиск вакансий через endpoint /search вызывает searchVacancies")
    void searchVacancies_callsSearchVacancies() {
        when(vacancyService.searchVacancies(Specialization.BACKEND, null, null))
                .thenReturn(List.of(sampleVacancyDto));

        ResponseEntity<List<VacancyDto>> response = vacancyController.searchVacancies(Specialization.BACKEND, null, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().hasSize(1);
        verify(vacancyService).searchVacancies(Specialization.BACKEND, null, null);
    }

    @Test
    @DisplayName("Получение вакансий конкретного работодателя по его ID")
    void getVacanciesByEmployer_returnsEmployerVacancies() {
        when(vacancyService.getVacanciesByEmployer(employerId)).thenReturn(List.of(sampleVacancyDto));

        ResponseEntity<List<VacancyDto>> response = vacancyController.getVacanciesByEmployer(employerId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().hasSize(1);
        verify(vacancyService).getVacanciesByEmployer(employerId);
    }

    @Test
    @DisplayName("Создание новой вакансии возвращает статус 201 CREATED")
    void createVacancy_returnsCreatedStatus() {
        CreateVacancyRequest request = CreateVacancyRequest.builder()
                .employerId(employerId)
                .title("Java Middle Developer")
                .salaryFrom(200000)
                .salaryTo(300000)
                .build();

        when(vacancyService.createVacancy(request)).thenReturn(sampleVacancyDto);

        ResponseEntity<VacancyDto> response = vacancyController.createVacancy(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getTitle()).isEqualTo("Java Middle Developer");
        verify(vacancyService).createVacancy(request);
    }
}
