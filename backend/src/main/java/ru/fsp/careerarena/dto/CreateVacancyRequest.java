package ru.fsp.careerarena.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.entity.enums.WorkFormat;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateVacancyRequest {

    @NotNull(message = "ID работодателя обязателен")
    private UUID employerId;

    @NotBlank(message = "Название вакансии обязательно")
    private String title;

    @NotNull(message = "Специализация обязательна")
    private Specialization specialization;

    @NotNull(message = "Грейд обязателен")
    private Grade grade;

    @NotNull(message = "Минимальная зарплата обязательна")
    @Min(value = 10000, message = "Зарплата 'от' должна быть не менее 10 000 руб.")
    private Integer salaryFrom;

    @NotNull(message = "Максимальная зарплата обязательна")
    @Min(value = 10000, message = "Зарплата 'до' должна быть не менее 10 000 руб.")
    private Integer salaryTo;

    private Integer minFspElo;

    private FspRank requiredFspRank;

    @NotBlank(message = "Локация обязательна")
    private String location;

    @NotNull(message = "Формат работы обязателен")
    private WorkFormat workFormat;

    @NotBlank(message = "Описание вакансии обязательно")
    private String description;

    private Set<String> requiredSkills;

    private String hhVacancyId;
}
