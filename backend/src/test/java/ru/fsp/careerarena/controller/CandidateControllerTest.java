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
import ru.fsp.careerarena.dto.CandidateDto;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.service.CandidateService;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование контроллера кандидатов (CandidateController)")
class CandidateControllerTest {

    @Mock
    private CandidateService candidateService;

    @InjectMocks
    private CandidateController candidateController;

    private CandidateDto sampleCandidateDto;
    private UUID candidateId;

    @BeforeEach
    void setUp() {
        candidateId = UUID.randomUUID();
        sampleCandidateDto = CandidateDto.builder()
                .id(candidateId)
                .fullName("Иван Пестерев")
                .fspElo(2100)
                .specialization(Specialization.BACKEND)
                .grade(Grade.SENIOR)
                .build();
    }

    @Test
    @DisplayName("Поиск кандидатов по фильтрам возвращает статус 200 OK и список кандидатов")
    void searchCandidates_returnsOkWithList() {
        when(candidateService.searchCandidates(Specialization.BACKEND, Grade.SENIOR, 2000, FspRank.KMS))
                .thenReturn(List.of(sampleCandidateDto));

        ResponseEntity<List<CandidateDto>> response = candidateController.searchCandidates(
                Specialization.BACKEND, Grade.SENIOR, 2000, FspRank.KMS
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().hasSize(1);
        assertThat(response.getBody().get(0).getFullName()).isEqualTo("Иван Пестерев");
        verify(candidateService).searchCandidates(Specialization.BACKEND, Grade.SENIOR, 2000, FspRank.KMS);
    }

    @Test
    @DisplayName("Получение профиля кандидата по ID возвращает статус 200 OK")
    void getCandidateById_returnsOkWithCandidate() {
        when(candidateService.getCandidateById(candidateId)).thenReturn(sampleCandidateDto);

        ResponseEntity<CandidateDto> response = candidateController.getCandidateById(candidateId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(candidateId);
        verify(candidateService).getCandidateById(candidateId);
    }
}
