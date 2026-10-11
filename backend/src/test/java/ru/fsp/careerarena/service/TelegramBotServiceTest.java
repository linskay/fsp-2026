package ru.fsp.careerarena.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.Invitation;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.entity.UserNotification;
import ru.fsp.careerarena.repository.UserNotificationRepository;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование сервиса TelegramBotService для мгновенных пушей офферов")
class TelegramBotServiceTest {

    @Mock
    private UserNotificationRepository notificationRepository;

    @Mock
    private WebClient webClient;

    @Mock
    private OfferService offerService;

    private TelegramBotService telegramBotService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        telegramBotService = new TelegramBotService(notificationRepository, webClient);
        objectMapper = new ObjectMapper();
        ReflectionTestUtils.setField(telegramBotService, "botToken", "");
        ReflectionTestUtils.setField(telegramBotService, "defaultChatId", "@fsp_career_bot");
        ReflectionTestUtils.setField(telegramBotService, "appUrl", "https://fsp-career.ru");
    }

    @Test
    @DisplayName("Успешная отправка мгновенного push-уведомления об оффере соискателю")
    void testSendOfferNotification() {
        User user = User.builder().id(UUID.randomUUID()).email("candidate@fsp.ru").build();
        CandidateProfile candidate = CandidateProfile.builder()
                .id(UUID.randomUUID())
                .user(user)
                .fullName("Иван Пестерев")
                .build();

        EmployerProfile employer = EmployerProfile.builder()
                .id(UUID.randomUUID())
                .companyName("СберТех")
                .build();

        Invitation invitation = Invitation.builder()
                .id(UUID.randomUUID())
                .salaryOffered(520000)
                .candidate(candidate)
                .employer(employer)
                .build();

        when(notificationRepository.save(any(UserNotification.class))).thenAnswer(i -> i.getArgument(0));

        boolean sent = telegramBotService.sendOfferNotification(invitation, candidate, employer, 520000);

        assertTrue(sent);
        verify(notificationRepository, times(1)).save(any(UserNotification.class));
    }

    @Test
    @DisplayName("Обработка callback query 'ACCEPT_OFFER' от кнопки в Telegram-боте")
    void testProcessTelegramUpdateAcceptOffer() {
        UUID offerId = UUID.randomUUID();
        ObjectNode rootNode = objectMapper.createObjectNode();
        ObjectNode callbackNode = rootNode.putObject("callback_query");
        callbackNode.put("id", "cb_123");
        callbackNode.put("data", "ACCEPT_OFFER:" + offerId);

        Map<String, Object> result = telegramBotService.processTelegramUpdate(rootNode, offerService);

        assertNotNull(result);
        assertEquals(true, result.get("handled"));
        assertEquals("OFFER_ACCEPTED", result.get("action"));
        assertEquals(offerId.toString(), result.get("offerId"));
        verify(offerService, times(1)).acceptOffer(offerId);
    }

    @Test
    @DisplayName("Обработка callback query 'OPEN_CHAT' от кнопки в Telegram-боте")
    void testProcessTelegramUpdateOpenChat() {
        UUID offerId = UUID.randomUUID();
        ObjectNode rootNode = objectMapper.createObjectNode();
        ObjectNode callbackNode = rootNode.putObject("callback_query");
        callbackNode.put("id", "cb_456");
        callbackNode.put("data", "OPEN_CHAT:" + offerId);

        Map<String, Object> result = telegramBotService.processTelegramUpdate(rootNode, offerService);

        assertNotNull(result);
        assertEquals(true, result.get("handled"));
        assertEquals("OPEN_CHAT", result.get("action"));
        assertEquals(offerId.toString(), result.get("offerId"));
        verify(offerService, never()).acceptOffer(any());
    }
}
