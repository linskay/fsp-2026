package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.NotificationDto;
import ru.fsp.careerarena.service.NotificationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Центр системных уведомлений пользователя (новые офферы, подтверждение грейда, отклики)")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Получение списка системных уведомлений пользователя")
    public ResponseEntity<List<NotificationDto>> getNotifications(@RequestParam(required = false) UUID userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @PostMapping("/{id}/read")
    @Operation(summary = "Пометить системное уведомление как прочитанное")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}
