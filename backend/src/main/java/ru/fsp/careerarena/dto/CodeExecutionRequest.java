package ru.fsp.careerarena.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.SubmissionVerdict;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionRequest {
    private UUID candidateId;
    
    @NotNull(message = "ID задачи обязателен")
    private UUID taskId;

    @NotBlank(message = "Язык программирования обязателен")
    private String language; // java, python, cpp, go, javascript

    @NotBlank(message = "Исходный код обязателен")
    private String sourceCode;
}
