package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Вакансия из аккаунта работодателя на hh.ru")
public class HhVacancyDto {

    @Schema(description = "Идентификатор вакансии на hh.ru")
    private String id;

    @Schema(description = "Внешний ID (externalId)")
    private String externalId;

    @Schema(description = "Название позиции")
    private String title;

    @Schema(description = "Город / Локация")
    private String city;

    @Schema(description = "Формат работы (REMOTE, HYBRID, OFFICE)")
    private String workFormat;

    @Schema(description = "Нижняя планка зарплаты (руб.)")
    private int salaryMin;

    @Schema(description = "Верхняя планка зарплаты (руб.)")
    private int salaryMax;

    @Schema(description = "Валюта оклада")
    private String currency;

    @Schema(description = "Специализация")
    private Specialization specialization;

    @Schema(description = "Требуемый грейд")
    private Grade grade;

    @Schema(description = "Ключевые навыки и стек")
    private List<String> skills;

    @Schema(description = "Описание вакансии")
    private String description;

    @Schema(description = "Уже импортирована ли в Career Arena")
    private boolean imported;

    @Schema(description = "Ссылка на вакансию на hh.ru")
    private String url;
}
