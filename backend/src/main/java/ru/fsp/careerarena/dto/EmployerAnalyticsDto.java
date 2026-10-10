package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Сводные аналитические метрики для HR-кабинета работодателя")
public class EmployerAnalyticsDto {

    @Schema(description = "ID профиля компании")
    private UUID employerId;

    @Schema(description = "Название компании")
    private String companyName;

    @Schema(description = "Всего вакансий компании")
    private int totalVacancies;

    @Schema(description = "Активных открытых вакансий")
    private int activeVacancies;

    @Schema(description = "Просмотрено профилей спортсменов ФСП")
    private int profilesViewed;

    @Schema(description = "Отправлено офферов и приглашений")
    private int offersSent;

    @Schema(description = "Принято офферов кандидатами")
    private int offersAccepted;

    @Schema(description = "Отклонено офферов кандидатами")
    private int offersDeclined;

    @Schema(description = "Конверсия воронки найма (%)")
    private double conversionRatePercent;

    @Schema(description = "Среднее время ответа кандидата (часы)")
    private double avgResponseTimeHours;

    @Schema(description = "Распределение релевантных кандидатов по грейдам")
    private Map<String, Integer> talentPoolByGrade;

    @Schema(description = "Распределение кандидатов по ELO рейтингу ФСП")
    private Map<String, Integer> talentPoolByElo;

    @Schema(description = "Количество прямых откликов соискателей")
    private int directApplicationsCount;
}
