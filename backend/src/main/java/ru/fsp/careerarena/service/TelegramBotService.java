package ru.fsp.careerarena.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.Invitation;
import ru.fsp.careerarena.entity.UserNotification;
import ru.fsp.careerarena.repository.UserNotificationRepository;

import java.time.Duration;
import java.util.*;

/**
 * Интеграция с официальным Telegram-ботом Федерации спортивного программирования
 * для мгновенных пуш-уведомлений об офферах и интерактивных действий ("Принять" / "В чат").
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TelegramBotService {

    private final UserNotificationRepository notificationRepository;
    private final WebClient aiWebClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${integrations.telegram.bot-token:}")
    private String botToken;

    @Value("${integrations.telegram.default-chat-id:}")
    private String defaultChatId;

    @Value("${integrations.telegram.app-url:https://fsp-career.ru}")
    private String appUrl;

    /**
     * Отправка мгновенного пуш-уведомления соискателю через Telegram-бота
     * Формат: «⚡️ {Компания} отправил вам оффер на {Зарплата} ₽. Посмотреть детали и принять?»
     * Интерактивные inline-кнопки: [Принять] [В чат]
     */
    public boolean sendOfferNotification(Invitation invitation, CandidateProfile candidate, EmployerProfile employer, int salaryOffered) {
        String companyName = employer != null && employer.getCompanyName() != null 
                ? employer.getCompanyName() 
                : "СберТех";
        String salaryFormatted = String.format("%,d", salaryOffered).replace(',', ' ');
        String text = String.format("⚡️ %s отправил вам оффер на %s ₽. Посмотреть детали и принять?", companyName, salaryFormatted);

        // 1. Сохраняем уведомление в БД платформы
        try {
            UserNotification notification = UserNotification.builder()
                    .user(candidate != null ? candidate.getUser() : null)
                    .title("⚡️ Оффер от " + companyName)
                    .message(text)
                    .type("TELEGRAM_OFFER")
                    .entityId(invitation != null && invitation.getId() != null ? invitation.getId().toString() : null)
                    .read(false)
                    .build();
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.warn("Failed to persist in-app user notification for Telegram offer: {}", e.getMessage());
        }

        // 2. Отправляем в Telegram Bot API
        if (botToken == null || botToken.isBlank()) {
            log.info("[Telegram Bot Simulator] Instant offer push: text='{}'", text);
            return true;
        }

        String targetChatId = defaultChatId;
        if (targetChatId == null || targetChatId.isBlank()) {
            targetChatId = "@fsp_career_bot";
        }

        try {
            String offerIdStr = (invitation != null && invitation.getId() != null)
                    ? invitation.getId().toString()
                    : UUID.randomUUID().toString();

            Map<String, Object> payload = new HashMap<>();
            payload.put("chat_id", targetChatId);
            payload.put("text", text);
            payload.put("parse_mode", "HTML");

            List<Map<String, String>> buttonsRow = new ArrayList<>();
            Map<String, String> acceptBtn = new HashMap<>();
            acceptBtn.put("text", "⚡️ Принять");
            acceptBtn.put("callback_data", "ACCEPT_OFFER:" + offerIdStr);
            buttonsRow.add(acceptBtn);

            Map<String, String> chatBtn = new HashMap<>();
            chatBtn.put("text", "💬 В чат");
            chatBtn.put("callback_data", "OPEN_CHAT:" + offerIdStr);
            buttonsRow.add(chatBtn);

            Map<String, Object> replyMarkup = new HashMap<>();
            replyMarkup.put("inline_keyboard", List.of(buttonsRow));
            payload.put("reply_markup", replyMarkup);

            String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
            aiWebClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .doOnSuccess(resp -> log.info("Telegram offer push successfully delivered: {}", resp))
                    .doOnError(err -> log.warn("Telegram API push call failed (continuing gracefully): {}", err.getMessage()))
                    .subscribe();

            return true;
        } catch (Exception ex) {
            log.warn("Failed to dispatch Telegram message: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * Обработка входящего webhook-запроса от Telegram (например, нажатие inline-кнопок)
     */
    public Map<String, Object> processTelegramUpdate(JsonNode updateNode, OfferService offerService) {
        Map<String, Object> response = new HashMap<>();
        response.put("handled", true);

        if (updateNode.has("callback_query")) {
            JsonNode callbackQuery = updateNode.get("callback_query");
            String callbackId = callbackQuery.has("id") ? callbackQuery.get("id").asText() : "";
            String callbackData = callbackQuery.has("data") ? callbackQuery.get("data").asText() : "";

            if (callbackData.startsWith("ACCEPT_OFFER:")) {
                String offerIdStr = callbackData.replace("ACCEPT_OFFER:", "").trim();
                try {
                    UUID offerId = UUID.fromString(offerIdStr);
                    offerService.acceptOffer(offerId);
                    response.put("action", "OFFER_ACCEPTED");
                    response.put("offerId", offerIdStr);
                    answerCallbackQuery(callbackId, "✅ Оффер принят! Ваши контакты безопасно открыты работодателю.");
                } catch (Exception ex) {
                    log.error("Failed to accept offer via Telegram callback: {}", ex.getMessage());
                    answerCallbackQuery(callbackId, "Оффер уже обработан или устарел.");
                }
            } else if (callbackData.startsWith("OPEN_CHAT:")) {
                String offerIdStr = callbackData.replace("OPEN_CHAT:", "").trim();
                response.put("action", "OPEN_CHAT");
                response.put("offerId", offerIdStr);
                answerCallbackQuery(callbackId, "💬 Переход в защищенный чат на платформе: " + appUrl + "/#candidate");
            }
        }

        return response;
    }

    private void answerCallbackQuery(String callbackId, String text) {
        if (botToken == null || botToken.isBlank() || callbackId.isBlank()) return;
        try {
            Map<String, String> payload = Map.of(
                    "callback_query_id", callbackId,
                    "text", text,
                    "show_alert", "true"
            );
            String url = "https://api.telegram.org/bot" + botToken + "/answerCallbackQuery";
            aiWebClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(4))
                    .subscribe();
        } catch (Exception e) {
            log.warn("Failed to answer Telegram callback query: {}", e.getMessage());
        }
    }
}
