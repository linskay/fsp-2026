package ru.fsp.careerarena.controller;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.Invitation;
import ru.fsp.careerarena.entity.enums.InvitationStatus;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.InvitationRepository;
import ru.fsp.careerarena.service.OfferService;
import ru.fsp.careerarena.service.TelegramBotService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/telegram")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Telegram Bot Integration", description = "Мгновенные push-уведомления и интерактивные действия через официальный Telegram-бот")
public class TelegramController {

    private final TelegramBotService telegramBotService;
    private final OfferService offerService;
    private final InvitationRepository invitationRepository;
    private final CandidateProfileRepository candidateRepository;
    private final EmployerProfileRepository employerRepository;

    @Data
    public static class TestPushRequest {
        private UUID candidateId;
        private UUID employerId;
        private UUID offerId;
        private String companyName;
        private Integer salary;
    }

    @PostMapping("/webhook")
    @Operation(summary = "Webhook для обработки входящих действий от Telegram Bot API (нажатие кнопок [Принять] / [В чат])")
    public ResponseEntity<Map<String, Object>> handleWebhook(@RequestBody JsonNode updateNode) {
        log.info("Received Telegram webhook update: {}", updateNode);
        Map<String, Object> result = telegramBotService.processTelegramUpdate(updateNode, offerService);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/test-push")
    @Operation(summary = "Отправить тестовое пуш-уведомление в Telegram кандидату: «⚡️ СберТех отправил вам оффер на 520 000 ₽. Посмотреть детали и принять?»")
    public ResponseEntity<Map<String, Object>> sendTestPush(@RequestBody(required = false) TestPushRequest request) {
        String company = (request != null && request.getCompanyName() != null) ? request.getCompanyName() : "СберТех";
        int salary = (request != null && request.getSalary() != null) ? request.getSalary() : 520000;

        CandidateProfile candidate = null;
        if (request != null && request.getCandidateId() != null) {
            candidate = candidateRepository.findById(request.getCandidateId()).orElse(null);
        }
        if (candidate == null) {
            candidate = candidateRepository.findAll().stream().findFirst().orElse(null);
        }

        EmployerProfile employer = null;
        if (request != null && request.getEmployerId() != null) {
            employer = employerRepository.findById(request.getEmployerId()).orElse(null);
        }
        if (employer == null) {
            employer = employerRepository.findAll().stream().findFirst().orElse(
                    EmployerProfile.builder().companyName(company).build()
            );
        }

        Invitation invitation = null;
        if (request != null && request.getOfferId() != null) {
            invitation = invitationRepository.findById(request.getOfferId()).orElse(null);
        }
        if (invitation == null) {
            invitation = Invitation.builder()
                    .id(UUID.randomUUID())
                    .salaryOffered(salary)
                    .candidate(candidate)
                    .employer(employer)
                    .status(InvitationStatus.PENDING)
                    .build();
        }

        boolean sent = telegramBotService.sendOfferNotification(invitation, candidate, employer, salary);

        return ResponseEntity.ok(Map.of(
                "success", sent,
                "message", String.format("⚡️ %s отправил вам оффер на %,d ₽. Посмотреть детали и принять?", company, salary).replace(',', ' '),
                "botUsername", "@fsp_career_bot",
                "actions", new String[]{"Принять", "В чат"}
        ));
    }

    @GetMapping("/status")
    @Operation(summary = "Получить статус подключения Telegram Bot")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(Map.of(
                "active", true,
                "botUsername", "@fsp_career_bot",
                "webhookConfigured", true,
                "instantOffersEnabled", true
        ));
    }
}
