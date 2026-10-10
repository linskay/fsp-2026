package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.ChatMessageDto;
import ru.fsp.careerarena.dto.SendMessageRequest;
import ru.fsp.careerarena.service.ChatService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Tag(name = "Chat & Real-time Messaging", description = "Управление диалогами по офферам, история переписки и отправка сообщений (REST + WebSocket /ws/chat)")
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/rooms/{offerId}")
    @Operation(summary = "Получение истории сообщений по конкретному диалогу / офферу")
    public ResponseEntity<List<ChatMessageDto>> getMessagesByOfferId(@PathVariable UUID offerId) {
        return ResponseEntity.ok(chatService.getMessagesByOfferId(offerId));
    }

    @PostMapping("/messages")
    @Operation(summary = "Отправка текстового сообщения в чат по офферу (с автоматической рассылкой в WebSocket /ws/chat)")
    public ResponseEntity<ChatMessageDto> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chatService.sendMessage(request));
    }
}
