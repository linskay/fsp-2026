package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
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
@Schema(description = "Запрос на создание новой вакансии с обязательными зарплатными вилками в рублях")
public class CreateVacancyRequest {

    @NotNull(message = "ID работодателя обязателен")
    @Schema(description = "Идентификатор компании-работодателя", example = "e1111111-1111-1111-1111-111111111111", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID employerId;

    @NotBlank(message = "Название вакансии не может быть пустым")
    @Size(min = 3, max = 255, message = "Название вакансии должно содержать от 3 до 255 символов")
    @Schema(description = "Наименование должности", example = "Senior Java / Highload Engineer", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @NotNull(message = "Специализация обязательна для заполнения")
    @Schema(description = "Специализация разработчика", example = "BACKEND", requiredMode = Schema.RequiredMode.REQUIRED)
    private Specialization specialization;

    @NotNull(message = "Грейд обязателен для заполнения")
    @Schema(description = "Требуемый грейд", example = "SENIOR", requiredMode = Schema.RequiredMode.REQUIRED)
    private Grade grade;

    @NotNull(message = "Нижняя граница зарплаты (от) обязательна")
    @Min(value = 10000, message = "Минимальная зарплата не может быть меньше 10 000 руб.")
    @Max(value = 5000000, message = "Минимальная зарплата не может превышать 5 000 000 руб.")
    @Schema(description = "Обязательная нижняя граница зарплаты в рублях", example = "300000", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer salaryFrom;

    @NotNull(message = "Верхняя граница зарплаты (до) обязательна")
    @Min(value = 10000, message = "Максимальная зарплата не может быть меньше 10 000 руб.")
    @Max(value = 10000000, message = "Максимальная зарплата не может превышать 10 000 000 руб.")
    @Schema(description = "Обязательная верхняя граница зарплаты в рублях", example = "450000", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer salaryTo;

    @Min(value = 0, message = "Рейтинг ELO не может быть отрицательным")
    @Max(value = 4000, message = "Рейтинг ELO не может превышать 4000")
    @Schema(description = "Минимальный порог спортивного рейтинга ELO ФСП", example = "2200")
    private Integer minFspElo;

    @Schema(description = "Требуемый спортивный разряд или звание ФСП РФ", example = "KMS")
    private FspRank requiredFspRank;

    @NotBlank(message = "Локация обязательна")
    @Size(min = 2, max = 128, message = "Локация должна содержать от 2 до 128 символов")
    @Schema(description = "Город или регион вакансии", example = "Москва / Удаленно", requiredMode = Schema.RequiredMode.REQUIRED)
    private String location;

    @NotNull(message = "Формат работы обязателен")
    @Schema(description = "Формат работы (REMOTE, OFFICE, HYBRID)", example = "REMOTE", requiredMode = Schema.RequiredMode.REQUIRED)
    private WorkFormat workFormat;

    @NotBlank(message = "Описание вакансии обязательно")
    @Size(min = 20, max = 10000, message = "Описание вакансии должно быть от 20 до 10000 символов")
    @Schema(description = "Подробное описание обязанностей и условий", example = "Ищем инженера для проектирования распределенных сервисов обработки потоковых данных...", requiredMode = Schema.RequiredMode.REQUIRED)
    private String description;

    @Schema(description = "Набор требуемых навыков", example = "[\"Java 21\", \"Spring Boot 3\", \"Kafka\", \"PostgreSQL\"]")
    private Set<String> requiredSkills;

    @Schema(description = "ID вакансии на hh.ru при синхронизации", example = "94883102")
    private String hhVacancyId;
}
