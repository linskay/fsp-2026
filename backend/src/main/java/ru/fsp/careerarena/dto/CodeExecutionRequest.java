package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на запуск и автоматическое тестирование алгоритмического решения в песочнице (Judge0)")
public class CodeExecutionRequest {

    @Schema(description = "ID профиля кандидата (опционально, если выполняется в сессии)", example = "c1111111-1111-1111-1111-111111111111")
    private UUID candidateId;
    
    @NotNull(message = "ID задачи обязателен")
    @Schema(description = "ID алгоритмической задачи ФСП / LeetCode", example = "a0000000-0000-0000-0000-000000000001", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID taskId;

    @NotBlank(message = "Язык программирования обязателен")
    @Pattern(regexp = "^(java|python|cpp|go|javascript)$", message = "Поддерживаемые языки: java, python, cpp, go, javascript")
    @Schema(description = "Целевой язык программирования (java, python, cpp, go, javascript)", example = "java", requiredMode = Schema.RequiredMode.REQUIRED)
    private String language;

    @NotBlank(message = "Исходный код решения не может быть пустым")
    @Size(min = 5, max = 50000, message = "Размер исходного кода должен быть от 5 до 50000 символов")
    @Schema(description = "Исходный код решения для компиляции и прогона на тестах", example = "class Solution {\n    public long maxFlow(int n, int s, int t, int[][] edges) {\n        // реализация\n        return 42;\n    }\n}", requiredMode = Schema.RequiredMode.REQUIRED)
    private String sourceCode;
}
