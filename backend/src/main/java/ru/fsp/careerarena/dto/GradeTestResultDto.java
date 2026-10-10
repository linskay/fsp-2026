package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import ru.fsp.careerarena.entity.enums.Grade;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Результат квалификационного тестирования и подтверждения грейда")
public class GradeTestResultDto {

    @Schema(description = "ID попытки")
    private UUID attemptId;

    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @Schema(description = "Целевой грейд")
    private Grade targetGrade;

    @Schema(description = "Процент правильных ответов")
    private int scorePercent;

    @Schema(description = "Успешно ли сдан тест (порог 70%)")
    private boolean passed;

    @Schema(description = "Присвоенный грейд")
    private Grade assignedGrade;

    @Schema(description = "Предыдущий ELO-рейтинг")
    private int oldElo;

    @Schema(description = "Новый ELO-рейтинг")
    private int newElo;

    @Schema(description = "Изменение ELO")
    private int eloDelta;

    @Schema(description = "Заключение и рекомендации системы")
    private String feedback;

    @Schema(description = "Дата следующей возможной попытки сдачи (кулдаун 3 месяца)")
    private OffsetDateTime nextAvailableDate;
}
