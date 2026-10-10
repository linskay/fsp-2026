package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на завершение теста и отправку ответов")
public class SubmitGradeTestRequest {

    @NotNull
    @Schema(description = "ID попытки тестирования")
    private UUID attemptId;

    @NotNull
    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @Schema(description = "Словарь ответов (номер вопроса -> индекс выбранного варианта)")
    private Map<Integer, Integer> answers;
}
