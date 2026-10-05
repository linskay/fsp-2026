package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Информация о вакансии с обязательными зарплатными вилками в рублях")
public class VacancyDto {

    @Schema(description = "ID вакансии", example = "v1111111-1111-1111-1111-111111111111")
    private UUID id;

    @Schema(description = "ID профиля работодателя", example = "e1111111-1111-1111-1111-111111111111")
    private UUID employerId;

    @Schema(description = "Название компании работодателя", example = "Positive Technologies")
    private String companyName;

    @Schema(description = "URL логотипа компании", example = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100")
    private String companyLogo;

    @Schema(description = "Наименование позиции", example = "Senior Java / Highload Engineer")
    private String title;

    @Schema(description = "Специализация", example = "BACKEND")
    private Specialization specialization;

    @Schema(description = "Грейд", example = "SENIOR")
    private Grade grade;

    @Schema(description = "Обязательная нижняя граница зарплаты в рублях (от)", example = "300000")
    private int salaryFrom;

    @Schema(description = "Обязательная верхняя граница зарплаты в рублях (до)", example = "450000")
    private int salaryTo;

    @Schema(description = "Минимальный порог рейтинга ELO ФСП", example = "2200")
    private int minFspElo;

    @Schema(description = "Требуемый спортивный разряд ФСП", example = "KMS")
    private FspRank requiredFspRank;

    @Schema(description = "Локация / Город", example = "Москва")
    private String location;

    @Schema(description = "Формат работы", example = "REMOTE")
    private WorkFormat workFormat;

    @Schema(description = "Подробное описание задач и требований", example = "Разработка высоконагруженного ядра распределенной платформы кибербезопасности...")
    private String description;

    @Schema(description = "Флаг активности вакансии", example = "true")
    private boolean isActive;

    @Schema(description = "Стек требуемых технологий", example = "[\"Java 21\", \"Spring Boot\", \"PostgreSQL\", \"Kafka\", \"Docker\"]")
    private Set<String> requiredSkills;
}
