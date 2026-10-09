package ru.fsp.careerarena.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Тестирование пользовательских классов исключений и DTO ошибок")
class ExceptionsTest {

    @Test
    @DisplayName("Проверка создания ResourceNotFoundException с сообщением")
    void testResourceNotFoundException() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Ресурс не найден");
        assertThat(ex.getMessage()).isEqualTo("Ресурс не найден");
    }

    @Test
    @DisplayName("Проверка создания BadRequestException с сообщением")
    void testBadRequestException() {
        BadRequestException ex = new BadRequestException("Неверный запрос");
        assertThat(ex.getMessage()).isEqualTo("Неверный запрос");
    }

    @Test
    @DisplayName("Проверка создания FspIntegrationException с сообщением и причиной")
    void testFspIntegrationException() {
        Throwable cause = new RuntimeException("Сетевой сбой");
        FspIntegrationException exWithCause = new FspIntegrationException("Ошибка интеграции", cause);
        assertThat(exWithCause.getMessage()).isEqualTo("Ошибка интеграции");
        assertThat(exWithCause.getCause()).isEqualTo(cause);

        FspIntegrationException exSimple = new FspIntegrationException("Простая ошибка интеграции");
        assertThat(exSimple.getMessage()).isEqualTo("Простая ошибка интеграции");
    }

    @Test
    @DisplayName("Проверка геттеров, сеттеров и билдера ErrorResponse")
    void testErrorResponse() {
        OffsetDateTime now = OffsetDateTime.now();
        ErrorResponse response = ErrorResponse.builder()
                .status(400)
                .error("Bad Request")
                .message("Ошибка запроса")
                .path("/api/test")
                .timestamp(now)
                .validationErrors(Map.of("field", "ошибка"))
                .build();

        assertThat(response.getStatus()).isEqualTo(400);
        assertThat(response.getError()).isEqualTo("Bad Request");
        assertThat(response.getMessage()).isEqualTo("Ошибка запроса");
        assertThat(response.getPath()).isEqualTo("/api/test");
        assertThat(response.getTimestamp()).isEqualTo(now);
        assertThat(response.getValidationErrors()).containsEntry("field", "ошибка");

        response.setStatus(500);
        response.setError("Internal");
        response.setMessage("Сервер упал");
        response.setPath("/api/error");
        response.setValidationErrors(null);

        assertThat(response.getStatus()).isEqualTo(500);
        assertThat(response.getError()).isEqualTo("Internal");
        assertThat(response.getMessage()).isEqualTo("Сервер упал");
        assertThat(response.getPath()).isEqualTo("/api/error");
        assertThat(response.getValidationErrors()).isNull();
    }
}
