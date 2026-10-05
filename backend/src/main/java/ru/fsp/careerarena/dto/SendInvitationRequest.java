package ru.fsp.careerarena.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.InvitationStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendInvitationRequest {

    @NotNull(message = "ID кандидата обязателен")
    private UUID candidateId;

    @NotNull(message = "ID работодателя обязателен")
    private UUID employerId;

    private UUID vacancyId;

    @NotNull(message = "Предлагаемая зарплата обязательна")
    @Min(value = 10000, message = "Предлагаемая зарплата не может быть меньше 10 000 руб.")
    private Integer salaryOffered;

    @NotBlank(message = "Сопроводительное сообщение обязательно")
    private String message;
}
