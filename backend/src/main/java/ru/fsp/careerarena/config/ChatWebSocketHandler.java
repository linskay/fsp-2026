package ru.fsp.careerarena.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@Slf4j
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
    private final Map<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String offerId = extractOfferId(session.getUri());
        if (offerId != null) {
            roomSessions.computeIfAbsent(offerId, k -> new CopyOnWriteArraySet<>()).add(session);
            log.info("WebSocket connected for room/offerId={} [session={}]", offerId, session.getId());
        } else {
            log.info("WebSocket connected globally [session={}]", session.getId());
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            String payload = message.getPayload();
            log.info("Received WebSocket message: {}", payload);
            var node = objectMapper.readTree(payload);
            String offerId = node.has("offerId") ? node.get("offerId").asText() : extractOfferId(session.getUri());
            if (offerId != null) {
                broadcast(offerId, payload);
            }
        } catch (Exception e) {
            log.warn("Error handling WebSocket text message: {}", e.getMessage());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String offerId = extractOfferId(session.getUri());
        if (offerId != null && roomSessions.containsKey(offerId)) {
            roomSessions.get(offerId).remove(session);
        }
        log.info("WebSocket closed for session={} with status={}", session.getId(), status);
    }

    public void broadcast(String offerId, Object messageDto) {
        Set<WebSocketSession> sessions = roomSessions.get(offerId);
        if (sessions == null || sessions.isEmpty()) {
            return;
        }

        try {
            String json = messageDto instanceof String ? (String) messageDto : objectMapper.writeValueAsString(messageDto);
            TextMessage textMessage = new TextMessage(json);
            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    try {
                        s.sendMessage(textMessage);
                    } catch (Exception ex) {
                        log.warn("Failed to send message to session {}: {}", s.getId(), ex.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to serialize message for WebSocket broadcast: {}", e.getMessage());
        }
    }

    private String extractOfferId(URI uri) {
        if (uri == null || uri.getQuery() == null) return null;
        for (String param : uri.getQuery().split("&")) {
            String[] pair = param.split("=");
            if (pair.length == 2 && ("offerId".equalsIgnoreCase(pair[0]) || "roomId".equalsIgnoreCase(pair[0]))) {
                return pair[1];
            }
        }
        return null;
    }
}
