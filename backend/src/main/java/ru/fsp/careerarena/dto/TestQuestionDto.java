package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Вопрос квалификационного теста")
public class TestQuestionDto {

    @Schema(description = "Номер вопроса")
    private int id;

    @Schema(description = "Формулировка вопроса")
    private String question;

    @Schema(description = "Варианты ответа")
    private List<String> options;

    @Schema(description = "Фрагмент кода (если применимо)")
    private String codeSnippet;
}
