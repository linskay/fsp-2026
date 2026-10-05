package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Прямое приглашение / оффер кандидату от работодателя")
public class InvitationDto {

    @Schema(description = "ID приглашения", example = "i1111111-1111-1111-1111-111111111111")
    private UUID id;

    @Schema(description = "ID кандидата", example = "c1111111-1111-1111-1111-111111111111")
    private UUID candidateId;

    @Schema(description = "ФИО кандидата", example = "Александр Белов")
    private String candidateName;

    @Schema(description = "ID работодателя", example = "e1111111-1111-1111-1111-111111111111")
    private UUID employerId;

    @Schema(description = "Название компании", example = "Positive Technologies")
    private String companyName;

    @Schema(description = "URL логотипа компании", example = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100")
    private String companyLogo;

    @Schema(description = "ID вакансии", example = "v1111111-1111-1111-1111-111111111111")
    private UUID vacancyId;

    @Schema(description = "Название вакансии", example = "Senior Java / Highload Engineer")
    private String vacancyTitle;

    @Schema(description = "Предложенная зарплата в рублях", example = "420000")
    private int salaryOffered;

    @Schema(description = "Текст сообщения работодателя", example = "Здравствуйте, Александр! Приглашаем на интервью на позицию тимлида распределенной платформы...")
    private String message;

    @Schema(description = "Статус оффера (PENDING, ACCEPTED, DECLINED, INTERVIEW_SCHEDULED)", example = "PENDING")
    private InvitationStatus status;

    @Schema(description = "Дата и время отправки оффера", example = "2026-10-05T08:30:00Z")
    private OffsetDateTime createdAt;
}
