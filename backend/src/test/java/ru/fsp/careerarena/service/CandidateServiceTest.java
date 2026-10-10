package ru.fsp.careerarena.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.fsp.careerarena.dto.CandidateDto;
import ru.fsp.careerarena.dto.EloHistoryPointDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.entity.enums.UserRole;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.mapper.CandidateMapper;
import ru.fsp.careerarena.repository.CandidateProfileRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование сервиса кандидатов (CandidateService)")
class CandidateServiceTest {

    @Mock
    private CandidateProfileRepository candidateRepository;

    @Mock
    private CandidateMapper candidateMapper;

    @InjectMocks
    private CandidateService candidateService;

    private User sampleUser;
    private CandidateProfile sampleProfile;
    private UUID candidateId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        candidateId = UUID.randomUUID();
        userId = UUID.randomUUID();

        sampleUser = User.builder()
                .id(userId)
                .email("ivan@fsp.ru")
                .fullName("Иван Пестерев")
                .role(UserRole.CANDIDATE)
                .avatarUrl("https://example.com/avatar.png")
                .build();

        sampleProfile = CandidateProfile.builder()
                .id(candidateId)
                .user(sampleUser)
                .fspId("FSP-77-001")
                .fspElo(2100)
                .fspRank(FspRank.KMS)
                .specialization(Specialization.BACKEND)
                .grade(Grade.SENIOR)
                .salaryExpectation(350000)
                .location("Москва")
                .bio("Опытный разработчик")
                .isFspVerified(true)
                .githubUsername("ipesterev")
                .githubReposCount(42)
                .githubCommitsCount(850)
                .skills(Set.of("Java", "Spring Boot", "PostgreSQL"))
                .build();
    }

    @Test
    @DisplayName("Поиск кандидатов с заданными фильтрами возвращает список DTO")
    void searchCandidates_withFilters_returnsCandidateDtoList() {
        when(candidateRepository.searchCandidates(Specialization.BACKEND, Grade.SENIOR, 2000, FspRank.KMS))
                .thenReturn(List.of(sampleProfile));

        CandidateDto expectedDto = CandidateDto.builder()
                .id(candidateId)
                .fullName("Иван Пестерев")
                .fspElo(2100)
                .fspRankDisplayName("Кандидат в мастера спорта")
                .build();
        when(candidateMapper.toDto(sampleProfile)).thenReturn(expectedDto);

        List<CandidateDto> result = candidateService.searchCandidates(Specialization.BACKEND, Grade.SENIOR, 2000, FspRank.KMS);

        assertThat(result).hasSize(1);
        CandidateDto dto = result.get(0);
        assertThat(dto.getId()).isEqualTo(candidateId);
        assertThat(dto.getFullName()).isEqualTo("Иван Пестерев");
        assertThat(dto.getFspElo()).isEqualTo(2100);
        assertThat(dto.getFspRankDisplayName()).isEqualTo("Кандидат в мастера спорта");
        verify(candidateRepository).searchCandidates(Specialization.BACKEND, Grade.SENIOR, 2000, FspRank.KMS);
    }

    @Test
    @DisplayName("Получение кандидата по существующему ID возвращает DTO")
    void getCandidateById_existingId_returnsCandidateDto() {
        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(sampleProfile));

        CandidateDto expectedDto = CandidateDto.builder()
                .id(candidateId)
                .email("ivan@fsp.ru")
                .specialization(Specialization.BACKEND)
                .build();
        when(candidateMapper.toDto(sampleProfile)).thenReturn(expectedDto);

        CandidateDto dto = candidateService.getCandidateById(candidateId);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(candidateId);
        assertThat(dto.getEmail()).isEqualTo("ivan@fsp.ru");
        assertThat(dto.getSpecialization()).isEqualTo(Specialization.BACKEND);
        verify(candidateRepository).findById(candidateId);
    }

    @Test
    @DisplayName("Получение кандидата по несуществующему ID выбрасывает исключение ResourceNotFoundException")
    void getCandidateById_notFound_throwsException() {
        UUID unknownId = UUID.randomUUID();
        when(candidateRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateService.getCandidateById(unknownId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("не найден");
    }

    @Test
    @DisplayName("Получение кандидата по ID пользователя возвращает DTO")
    void getCandidateByUserId_existingUserId_returnsCandidateDto() {
        when(candidateRepository.findByUserId(userId)).thenReturn(Optional.of(sampleProfile));

        CandidateDto expectedDto = CandidateDto.builder()
                .userId(userId)
                .fullName("Иван Пестерев")
                .build();
        when(candidateMapper.toDto(sampleProfile)).thenReturn(expectedDto);

        CandidateDto dto = candidateService.getCandidateByUserId(userId);

        assertThat(dto).isNotNull();
        assertThat(dto.getUserId()).isEqualTo(userId);
        assertThat(dto.getFullName()).isEqualTo("Иван Пестерев");
        verify(candidateRepository).findByUserId(userId);
    }

    @Test
    @DisplayName("Получение кандидата по несуществующему ID пользователя выбрасывает исключение ResourceNotFoundException")
    void getCandidateByUserId_notFound_throwsException() {
        UUID unknownUserId = UUID.randomUUID();
        when(candidateRepository.findByUserId(unknownUserId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateService.getCandidateByUserId(unknownUserId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("не найден");
    }

    @Test
    @DisplayName("Маппинг профиля кандидата через CandidateMapper")
    void mapToDto_nullUserAndNullRank_handlesGracefully() {
        CandidateProfile emptyProfile = CandidateProfile.builder()
                .id(UUID.randomUUID())
                .user(null)
                .fspRank(null)
                .fspElo(1000)
                .specialization(Specialization.FRONTEND)
                .grade(Grade.JUNIOR)
                .salaryExpectation(100000)
                .location("Казань")
                .isFspVerified(false)
                .skills(Set.of("JavaScript"))
                .build();

        CandidateDto expectedDto = CandidateDto.builder()
                .id(emptyProfile.getId())
                .fullName("Не указано")
                .build();
        when(candidateMapper.toDto(emptyProfile)).thenReturn(expectedDto);

        CandidateDto dto = candidateService.mapToDto(emptyProfile);

        assertThat(dto).isNotNull();
        assertThat(dto.getFullName()).isEqualTo("Не указано");
    }

    @Test
    @DisplayName("Получение истории ELO рейтинга кандидата")
    void getEloHistory_returnsProgressionPoints() {
        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(sampleProfile));

        List<EloHistoryPointDto> history = candidateService.getEloHistory(candidateId);

        assertThat(history).isNotEmpty();
        assertThat(history.get(history.size() - 1).getElo()).isEqualTo(2100);
    }
}
