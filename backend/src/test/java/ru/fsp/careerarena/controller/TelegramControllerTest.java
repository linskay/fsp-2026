package ru.fsp.careerarena.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.InvitationRepository;
import ru.fsp.careerarena.service.OfferService;
import ru.fsp.careerarena.service.TelegramBotService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование контроллера TelegramController для push-уведомлений")
class TelegramControllerTest {

    @Mock
    private TelegramBotService telegramBotService;

    @Mock
    private OfferService offerService;

    @Mock
    private InvitationRepository invitationRepository;

    @Mock
    private CandidateProfileRepository candidateRepository;

    @Mock
    private EmployerProfileRepository employerRepository;

    private TelegramController telegramController;

    @BeforeEach
    void setUp() {
        telegramController = new TelegramController(
                telegramBotService,
                offerService,
                invitationRepository,
                candidateRepository,
                employerRepository
        );
    }

    @Test
    @DisplayName("Отправка тестового push-уведомления соискателю")
    void testSendTestPush() {
        UUID candidateId = UUID.randomUUID();
        User user = User.builder().id(UUID.randomUUID()).fullName("Иван").build();
        CandidateProfile candidate = CandidateProfile.builder().id(candidateId).user(user).build();
        EmployerProfile employer = EmployerProfile.builder().id(UUID.randomUUID()).companyName("СберТех").build();

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(employerRepository.findAll()).thenReturn(List.of(employer));
        when(telegramBotService.sendOfferNotification(any(), any(), any(), anyInt())).thenReturn(true);

        TelegramController.TestPushRequest req = new TelegramController.TestPushRequest();
        req.setCandidateId(candidateId);
        req.setCompanyName("СберТех");
        req.setSalary(520000);

        ResponseEntity<Map<String, Object>> response = telegramController.sendTestPush(req);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(true, response.getBody().get("success"));
        assertEquals("@fsp_career_bot", response.getBody().get("botUsername"));
        assertTrue(response.getBody().get("message").toString().contains("520 000 ₽"));
    }

    @Test
    @DisplayName("Получение статуса подключения бота")
    void testGetStatus() {
        ResponseEntity<Map<String, Object>> response = telegramController.getStatus();

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(true, response.getBody().get("active"));
        assertEquals("@fsp_career_bot", response.getBody().get("botUsername"));
    }
}
