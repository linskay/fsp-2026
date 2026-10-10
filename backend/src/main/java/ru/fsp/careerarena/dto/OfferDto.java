package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.InvitationStatus;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Оффер / приглашение кандидату в модели Reverse Recruiting")
public class OfferDto {

    @Schema(description = "ID оффера", example = "i1111111-1111-1111-1111-111111111111")
    private UUID id;

    @Schema(description = "ID кандидата", example = "c1111111-1111-1111-1111-111111111111")
    private UUID candidateId;

    @Schema(description = "ФИО соискателя", example = "Иван Пестерев")
    private String candidateName;

    @Schema(description = "ID работодателя", example = "e1111111-1111-1111-1111-111111111111")
    private UUID employerId;

    @Schema(description = "Название компании", example = "ПАО Сбербанк (СберТех)")
    private String companyName;

    @Schema(description = "Логотип компании", example = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100")
    private String companyLogo;

    @Schema(description = "ID вакансии", example = "v1111111-1111-1111-1111-111111111111")
    private UUID vacancyId;

    @Schema(description = "Название вакансии / проекта", example = "Senior Java / Highload Engineer")
    private String positionTitle;

    @Schema(description = "Зарплатная вилка 'от' в рублях", example = "350000")
    private Integer salaryFrom;

    @Schema(description = "Зарплатная вилка 'до' в рублях", example = "520000")
    private Integer salaryTo;

    @Schema(description = "Предложенная зарплата в рублях", example = "450000")
    private Integer salaryOffered;

    @Schema(description = "Описание вакансии и задач / текст оффера",
            example = "Приглашаем в команду ядра распределенной платформы. Стек: Java 21, Spring Boot, Kafka, Postgres.")
    private String description;

    @Schema(description = "Статус оффера (PENDING, ACCEPTED, DECLINED, INTERVIEW_SCHEDULED)", example = "PENDING")
    private InvitationStatus status;

    @Schema(description = "Раскрыты ли контакты (только при ACCEPTED согласно 152-ФЗ РФ)", example = "false")
    private boolean contactsUnmasked;

    @Schema(description = "Контактные данные кандидата (доступны только после принятия оффера)",
            example = "{\"email\":\"candidate@fsp.ru\",\"phone\":\"+7 (999) 123-45-67\",\"telegram\":\"@candidate_fsp\"}")
    private Map<String, String> candidateContacts;

    @Schema(description = "Дата отправки оффера")
    private OffsetDateTime createdAt;

    @Schema(description = "Дата обновления статуса")
    private OffsetDateTime updatedAt;
}
