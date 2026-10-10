package ru.fsp.careerarena.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Юнит-тесты JWT Безопасности (Spring Security 6)")
class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    @DisplayName("Генерация и валидация реального JWT токена")
    void testGenerateAndValidateToken() {
        String token = jwtService.generateToken("candidate@fsp.ru", "CANDIDATE", "Иван Пестерев", "user-uuid-123");

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertTrue(jwtService.validateToken(token));
        assertEquals("candidate@fsp.ru", jwtService.extractEmail(token));
        assertEquals("ROLE_CANDIDATE", jwtService.extractRole(token));
    }

    @Test
    @DisplayName("Генерация токена работодателя с приставкой ROLE_")
    void testGenerateEmployerToken() {
        String token = jwtService.generateToken("employer@fsp.ru", "EMPLOYER", "Елена Романова", "emp-uuid-456");

        assertTrue(jwtService.validateToken(token));
        assertEquals("employer@fsp.ru", jwtService.extractEmail(token));
        assertEquals("ROLE_EMPLOYER", jwtService.extractRole(token));
    }

    @Test
    @DisplayName("Валидация префиксов демо-токенов для хакатона")
    void testValidateDemoTokens() {
        assertTrue(jwtService.validateToken("fsp-jwt-candidate-token"));
        assertTrue(jwtService.validateToken("fsp-jwt-123456789"));
        assertTrue(jwtService.validateToken("jwt-oauth-github-token"));

        assertFalse(jwtService.validateToken(null));
        assertFalse(jwtService.validateToken(""));
        assertFalse(jwtService.validateToken("invalid.corrupted.token"));
    }

    @Test
    @DisplayName("Извлечение роли из демо-токенов")
    void testExtractRoleFromDemoTokens() {
        assertEquals("ROLE_CANDIDATE", jwtService.extractRole("fsp-jwt-candidate-token"));
        assertEquals("ROLE_EMPLOYER", jwtService.extractRole("fsp-jwt-employer-token"));
    }
}
