package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на запуск квалификационного тестирования на грейд")
public class StartGradeTestRequest {

    @NotNull
    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @NotNull
    @Schema(description = "Выбранная специализация")
    private Specialization specialization;

    @NotNull
    @Schema(description = "Целевой грейд для подтверждения")
    private Grade targetGrade;
}
