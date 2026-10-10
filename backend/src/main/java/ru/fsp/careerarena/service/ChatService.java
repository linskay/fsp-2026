package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.config.ChatWebSocketHandler;
import ru.fsp.careerarena.dto.ChatMessageDto;
import ru.fsp.careerarena.dto.SendMessageRequest;
import ru.fsp.careerarena.entity.ChatMessage;
import ru.fsp.careerarena.entity.Invitation;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.repository.ChatMessageRepository;
import ru.fsp.careerarena.repository.InvitationRepository;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final InvitationRepository invitationRepository;
    private final ChatWebSocketHandler chatWebSocketHandler;

    @Transactional
    public List<ChatMessageDto> getMessagesByOfferId(UUID offerId) {
        log.info("Fetching chat messages for offerId={}", offerId);
        List<ChatMessage> list = new ArrayList<>(chatMessageRepository.findByOfferIdOrderByCreatedAtAsc(offerId));

        // If room is empty, initialize with offer description / invitation greeting
        if (list.isEmpty()) {
            invitationRepository.findById(offerId).ifPresent(inv -> {
                String companyName = inv.getEmployer() != null ? inv.getEmployer().getCompanyName() : "Работодатель";
                ChatMessage initialMsg = ChatMessage.builder()
                        .offer(inv)
                        .senderRole("EMPLOYER")
                        .senderName(companyName + " HR")
                        .text(inv.getMessage())
                        .createdAt(inv.getCreatedAt() != null ? inv.getCreatedAt() : OffsetDateTime.now())
                        .build();
                chatMessageRepository.save(initialMsg);
                list.add(initialMsg);
            });
        }

        return list.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatMessageDto sendMessage(SendMessageRequest request) {
        log.info("Saving message in offerId={} from role={}", request.getOfferId(), request.getSenderRole());

        Invitation offer = invitationRepository.findById(request.getOfferId())
                .orElseThrow(() -> new ResourceNotFoundException("Оффер/диалог с ID " + request.getOfferId() + " не найден"));

        String role = request.getSenderRole() != null ? request.getSenderRole().toUpperCase() : "CANDIDATE";
        String name = request.getSenderName() != null && !request.getSenderName().isBlank()
                ? request.getSenderName()
                : ("CANDIDATE".equals(role) ? "Кандидат" : "Работодатель");

        ChatMessage message = ChatMessage.builder()
                .offer(offer)
                .senderId(request.getSenderId())
                .senderRole(role)
                .senderName(name)
                .text(request.getText())
                .createdAt(OffsetDateTime.now())
                .build();

        ChatMessage saved = chatMessageRepository.save(message);
        ChatMessageDto dto = mapToDto(saved);

        // Broadcast in real-time via WebSocket
        try {
            chatWebSocketHandler.broadcast(offer.getId().toString(), dto);
        } catch (Exception ex) {
            log.warn("WebSocket broadcast failed: {}", ex.getMessage());
        }

        return dto;
    }

    public ChatMessageDto mapToDto(ChatMessage msg) {
        return ChatMessageDto.builder()
                .id(msg.getId())
                .offerId(msg.getOffer() != null ? msg.getOffer().getId() : null)
                .senderId(msg.getSenderId())
                .senderRole(msg.getSenderRole())
                .senderName(msg.getSenderName())
                .text(msg.getText())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
