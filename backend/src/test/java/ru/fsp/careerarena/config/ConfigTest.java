package ru.fsp.careerarena.config;

import io.swagger.v3.oas.models.OpenAPI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.reactive.function.client.WebClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

@DisplayName("Тестирование конфигурационных компонентов приложения")
class ConfigTest {

    @Test
    @DisplayName("Конфигурация OpenAPI содержит корректное название, контакты и схему безопасности Bearer")
    void testOpenApiConfig() {
        OpenApiConfig config = new OpenApiConfig();
        OpenAPI openAPI = config.fspCareerArenaOpenAPI();

        assertThat(openAPI).isNotNull();
        assertThat(openAPI.getInfo().getTitle()).isEqualTo("FSP Career Arena API");
        assertThat(openAPI.getInfo().getVersion()).isEqualTo("1.0.0");
        assertThat(openAPI.getInfo().getContact().getEmail()).isEqualTo("support@fsp-russia.ru");
        assertThat(openAPI.getComponents().getSecuritySchemes()).containsKey("Bearer Authentication");
    }

    @Test
    @DisplayName("Конфигурация WebClient создает клиенты для LeetCode, Judge0 и AI провайдеров")
    void testWebClientConfig() {
        WebClientConfig config = new WebClientConfig();

        WebClient leetCodeClient = config.leetCodeWebClient();
        WebClient judge0Client = config.judge0WebClient();
        WebClient aiClient = config.aiWebClient();

        assertThat(leetCodeClient).isNotNull();
        assertThat(judge0Client).isNotNull();
        assertThat(aiClient).isNotNull();
    }

    @Test
    @DisplayName("Конфигурация CORS разрешает кросс-доменные запросы с необходимыми заголовками и методами")
    void testSecurityConfigCors() {
        SecurityConfig config = new SecurityConfig();
        CorsConfigurationSource source = config.corsConfigurationSource();

        assertThat(source).isNotNull();
        CorsConfiguration corsConfig = source.getCorsConfiguration(new org.springframework.mock.web.MockHttpServletRequest("GET", "/api/v1/candidates"));
        assertThat(corsConfig).isNotNull();
        assertThat(corsConfig.getAllowedOriginPatterns()).contains("*");
        assertThat(corsConfig.getAllowedMethods()).contains("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
        assertThat(corsConfig.getAllowCredentials()).isTrue();
    }
}
