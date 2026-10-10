package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Публичная статистика платформы ФСП Карьерная Арена для главной страницы лендинга")
public class SystemStatsDto {

    @Schema(description = "Всего зарегистрированных соискателей и спортсменов ФСП", example = "1420")
    private long registeredAthletesCount;

    @Schema(description = "Количество активных вакансий от аккредитованных IT-компаний", example = "312")
    private long activeVacanciesCount;

    @Schema(description = "Количество решенных задач на Арене и проведенных код-ревью", example = "890")
    private long solvedTasksAndReviewsCount;

    @Schema(description = "Количество отправленных офферов с зарплатными вилками", example = "425")
    private long offersCount;

    @Schema(description = "Количество принятых офферов (успешных наймов)", example = "128")
    private long acceptedOffersCount;

    @Schema(description = "Количество аккредитованных IT-работодателей (Сбер, Яндекс и др.)", example = "84")
    private long accreditedEmployersCount;

    @Schema(description = "Версия платформы", example = "2.0.0-ENTERPRISE")
    private String platformVersion;

    @Schema(description = "Время формирования метрик")
    private OffsetDateTime timestamp;
}
