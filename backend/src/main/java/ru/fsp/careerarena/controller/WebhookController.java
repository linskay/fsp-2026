package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.CreateWebhookRequest;
import ru.fsp.careerarena.dto.EmployerWebhookDto;
import ru.fsp.careerarena.dto.WebhookPingResponse;
import ru.fsp.careerarena.service.WebhookService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
@Tag(name = "Employer Webhooks", description = "Управление внешними веб-хуками для интеграции с ATS (Сбер, Яндекс), ботами Telegram и корпоративными HR-системами")
public class WebhookController {

    private final WebhookService webhookService;

    @PostMapping
    @Operation(summary = "Регистрация нового веб-хука для работодателя")
    public ResponseEntity<EmployerWebhookDto> createWebhook(@Valid @RequestBody CreateWebhookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(webhookService.createWebhook(request));
    }

    @GetMapping("/employer/{employerId}")
    @Operation(summary = "Получение списка активных веб-хуков работодателя")
    public ResponseEntity<List<EmployerWebhookDto>> getWebhooksByEmployer(@PathVariable UUID employerId) {
        return ResponseEntity.ok(webhookService.getWebhooksByEmployer(employerId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удаление веб-хука")
    public ResponseEntity<Void> deleteWebhook(@PathVariable UUID id) {
        webhookService.deleteWebhook(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/ping")
    @Operation(summary = "Отправка тестового пинга на зарегистрированный URL веб-хука с проверкой HMAC-подписи")
    public ResponseEntity<WebhookPingResponse> testPingWebhook(@PathVariable UUID id) {
        return ResponseEntity.ok(webhookService.testPingWebhook(id));
    }
}
