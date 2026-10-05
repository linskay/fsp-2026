package ru.fsp.careerarena.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Стандартизированный ответ об ошибке API")
public class ErrorResponse {

    @Schema(description = "HTTP статус код ошибки", example = "400")
    private int status;

    @Schema(description = "Категория ошибки", example = "BAD_REQUEST")
    private String error;

    @Schema(description = "Человекочитаемое сообщение об ошибке", example = "Минимальная зарплата (от) не может превышать максимальную (до)")
    private String message;

    @Schema(description = "Путь запроса, вызвавшего ошибку", example = "/api/v1/vacancies")
    private String path;

    @Schema(description = "Временная метка возникновения ошибки", example = "2026-10-05T08:30:00Z")
    private OffsetDateTime timestamp;

    @Schema(description = "Детализированные ошибки по полям (при валидации DTO)")
    private Map<String, String> validationErrors;
}
