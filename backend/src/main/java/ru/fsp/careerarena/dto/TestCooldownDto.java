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
@Schema(description = "Статус кулдауна сдачи квалификационного теста на грейд")
public class TestCooldownDto {

    @Schema(description = "Идентификатор кандидата")
    private UUID candidateId;

    @Schema(description = "Доступна ли повторная сдача теста")
    private boolean canRetake;

    @Schema(description = "Дата последней завершенной попытки")
    private OffsetDateTime lastAttemptDate;

    @Schema(description = "Дата, когда будет доступна следующая сдача теста")
    private OffsetDateTime nextAvailableDate;

    @Schema(description = "Осталось дней до окончания кулдауна")
    private long remainingDays;

    @Schema(description = "Текущий подтвержденный грейд")
    private Grade currentGrade;

    @Schema(description = "Информационное сообщение")
    private String message;
}
