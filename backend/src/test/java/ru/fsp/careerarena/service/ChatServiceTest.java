package ru.fsp.careerarena.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.fsp.careerarena.dto.ChatMessageDto;
import ru.fsp.careerarena.entity.ChatMessage;
import ru.fsp.careerarena.entity.Invitation;
import ru.fsp.careerarena.repository.ChatMessageRepository;
import ru.fsp.careerarena.repository.InvitationRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Юнит-тесты Онлайн-чата между кандидатом и работодателем")
class ChatServiceTest {

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @Mock
    private InvitationRepository invitationRepository;

    private ChatService chatService;

    @BeforeEach
    void setUp() {
        chatService = new ChatService(chatMessageRepository, invitationRepository);
    }

    @Test
    @DisplayName("Отправка сообщения в чат по офферу")
    void testSendMessageSuccess() {
        UUID offerId = UUID.randomUUID();
        Invitation offer = Invitation.builder().id(offerId).build();

        when(invitationRepository.findById(offerId)).thenReturn(Optional.of(offer));

        ChatMessage savedMessage = ChatMessage.builder()
                .id(UUID.randomUUID())
                .invitation(offer)
                .senderRole("CANDIDATE")
                .senderName("Иван Пестерев")
                .text("Согласен на проведение интервью!")
                .createdAt(OffsetDateTime.now())
                .build();

        when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(savedMessage);

        ChatMessageDto dto = chatService.sendMessage(offerId, "CANDIDATE", "Иван Пестерев", "Согласен на проведение интервью!");

        assertNotNull(dto);
        assertEquals("Согласен на проведение интервью!", dto.getText());
        assertEquals("CANDIDATE", dto.getSenderRole());

        ArgumentCaptor<ChatMessage> captor = ArgumentCaptor.forClass(ChatMessage.class);
        verify(chatMessageRepository).save(captor.capture());
        assertEquals("Согласен на проведение интервью!", captor.getValue().getText());
    }

    @Test
    @DisplayName("Получение истории сообщений по ID оффера")
    void testGetMessagesForOffer() {
        UUID offerId = UUID.randomUUID();
        ChatMessage msg1 = ChatMessage.builder().id(UUID.randomUUID()).text("Привет").build();
        ChatMessage msg2 = ChatMessage.builder().id(UUID.randomUUID()).text("Добрый день!").build();

        when(chatMessageRepository.findByInvitationIdOrderByCreatedAtAsc(offerId)).thenReturn(List.of(msg1, msg2));

        List<ChatMessageDto> messages = chatService.getMessagesForOffer(offerId);

        assertEquals(2, messages.size());
        assertEquals("Привет", messages.get(0).getText());
        assertEquals("Добрый день!", messages.get(1).getText());
    }
}
