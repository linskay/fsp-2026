package ru.fsp.careerarena.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.CreateWebhookRequest;
import ru.fsp.careerarena.dto.EmployerWebhookDto;
import ru.fsp.careerarena.dto.WebhookPingResponse;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.EmployerWebhook;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.EmployerWebhookRepository;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookService {

    private final EmployerWebhookRepository webhookRepository;
    private final EmployerProfileRepository employerRepository;
    private final ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .build();

    @Transactional
    public EmployerWebhookDto createWebhook(CreateWebhookRequest request) {
        log.info("Registering new webhook for employerId={} url={}", request.getEmployerId(), request.getUrl());
        EmployerProfile employer = employerRepository.findById(request.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Профиль работодателя не найден"));

        String events = (request.getEvents() != null && !request.getEvents().isBlank())
                ? request.getEvents()
                : "OFFER_ACCEPTED,OFFER_DECLINED,OFFER_SENT,TEST_PASSED";

        EmployerWebhook webhook = EmployerWebhook.builder()
                .employer(employer)
                .url(request.getUrl().trim())
                .secretToken(request.getSecretToken() != null ? request.getSecretToken().trim() : null)
                .events(events)
                .description(request.getDescription())
                .active(true)
                .build();

        EmployerWebhook saved = webhookRepository.save(webhook);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<EmployerWebhookDto> getWebhooksByEmployer(UUID employerId) {
        return webhookRepository.findByEmployerIdOrderByCreatedAtDesc(employerId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteWebhook(UUID webhookId) {
        log.info("Deleting webhook id={}", webhookId);
        webhookRepository.deleteById(webhookId);
    }

    @Transactional
    public WebhookPingResponse testPingWebhook(UUID webhookId) {
        EmployerWebhook webhook = webhookRepository.findById(webhookId)
                .orElseThrow(() -> new ResourceNotFoundException("Веб-хук не найден"));

        Map<String, Object> pingPayload = new LinkedHashMap<>();
        pingPayload.put("event", "PING");
        pingPayload.put("timestamp", OffsetDateTime.now().toString());
        pingPayload.put("webhookId", webhook.getId().toString());
        pingPayload.put("message", "FSP Career Arena Webhook Test Ping Verification");
        pingPayload.put("fspPlatform", "Russian Sports Programming Federation");

        try {
            String jsonPayload = objectMapper.writeValueAsString(pingPayload);
            HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(webhook.getUrl()))
                    .timeout(Duration.ofSeconds(4))
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "FSP-Career-Arena-Webhook-Dispatcher/2.0")
                    .header("X-FSP-Event", "PING")
                    .header("X-FSP-Delivery-Id", UUID.randomUUID().toString());

            if (webhook.getSecretToken() != null && !webhook.getSecretToken().isBlank()) {
                reqBuilder.header("X-FSP-Signature", "sha256=" + calculateHmacSha256(jsonPayload, webhook.getSecretToken()));
            }

            HttpResponse<String> response = httpClient.send(reqBuilder.POST(HttpRequest.BodyPublishers.ofString(jsonPayload)).build(), HttpResponse.BodyHandlers.ofString());
            int status = response.statusCode();

            webhook.setLastStatusCode(status);
            webhook.setLastTriggeredAt(OffsetDateTime.now());
            webhookRepository.save(webhook);

            boolean success = status >= 200 && status < 300;
            return WebhookPingResponse.builder()
                    .webhookId(webhook.getId())
                    .url(webhook.getUrl())
                    .statusCode(status)
                    .success(success)
                    .message(success ? "Веб-хук успешно доставлен (HTTP " + status + ")" : "Принят с кодом HTTP " + status)
                    .timestamp(OffsetDateTime.now())
                    .payloadSample(jsonPayload)
                    .build();

        } catch (Exception e) {
            log.warn("Test ping to webhook url={} failed: {}", webhook.getUrl(), e.getMessage());
            webhook.setLastStatusCode(504);
            webhook.setLastTriggeredAt(OffsetDateTime.now());
            webhookRepository.save(webhook);

            return WebhookPingResponse.builder()
                    .webhookId(webhook.getId())
                    .url(webhook.getUrl())
                    .statusCode(504)
                    .success(false)
                    .message("Не удалось подключиться к целевому URL (" + e.getClass().getSimpleName() + "): " + e.getMessage())
                    .timestamp(OffsetDateTime.now())
                    .payloadSample(pingPayload.toString())
                    .build();
        }
    }

    public void dispatchOfferEventAsync(UUID employerId, String eventType, Object payload) {
        CompletableFuture.runAsync(() -> {
            try {
                List<EmployerWebhook> webhooks = webhookRepository.findByEmployerIdAndActiveTrue(employerId);
                if (webhooks.isEmpty()) {
                    return;
                }

                Map<String, Object> body = new LinkedHashMap<>();
                body.put("event", eventType);
                body.put("timestamp", OffsetDateTime.now().toString());
                body.put("employerId", employerId.toString());
                body.put("data", payload);

                String jsonBody = objectMapper.writeValueAsString(body);

                for (EmployerWebhook hook : webhooks) {
                    if (hook.getEvents() != null && !hook.getEvents().contains(eventType)) {
                        continue;
                    }

                    try {
                        HttpRequest.Builder reqBuilder = HttpRequest.newBuilder()
                                .uri(URI.create(hook.getUrl()))
                                .timeout(Duration.ofSeconds(4))
                                .header("Content-Type", "application/json")
                                .header("User-Agent", "FSP-Career-Arena-Webhook-Dispatcher/2.0")
                                .header("X-FSP-Event", eventType)
                                .header("X-FSP-Delivery-Id", UUID.randomUUID().toString());

                        if (hook.getSecretToken() != null && !hook.getSecretToken().isBlank()) {
                            reqBuilder.header("X-FSP-Signature", "sha256=" + calculateHmacSha256(jsonBody, hook.getSecretToken()));
                        }

                        HttpResponse<String> resp = httpClient.send(reqBuilder.POST(HttpRequest.BodyPublishers.ofString(jsonBody)).build(), HttpResponse.BodyHandlers.ofString());
                        hook.setLastStatusCode(resp.statusCode());
                        hook.setLastTriggeredAt(OffsetDateTime.now());
                        webhookRepository.save(hook);
                        log.info("Webhook {} dispatched event {} to {} with status {}", hook.getId(), eventType, hook.getUrl(), resp.statusCode());
                    } catch (Exception ex) {
                        log.warn("Webhook dispatch error for {}: {}", hook.getUrl(), ex.getMessage());
                        hook.setLastStatusCode(500);
                        hook.setLastTriggeredAt(OffsetDateTime.now());
                        webhookRepository.save(hook);
                    }
                }
            } catch (Exception e) {
                log.error("Failed to serialize webhook event {}: {}", eventType, e.getMessage());
            }
        });
    }

    private String calculateHmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hmacBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            return "error-generating-signature";
        }
    }

    private EmployerWebhookDto toDto(EmployerWebhook w) {
        return EmployerWebhookDto.builder()
                .id(w.getId())
                .employerId(w.getEmployer() != null ? w.getEmployer().getId() : null)
                .url(w.getUrl())
                .secretToken(w.getSecretToken())
                .events(w.getEvents())
                .description(w.getDescription())
                .active(w.isActive())
                .lastStatusCode(w.getLastStatusCode())
                .lastTriggeredAt(w.getLastTriggeredAt())
                .createdAt(w.getCreatedAt())
                .build();
    }
}
