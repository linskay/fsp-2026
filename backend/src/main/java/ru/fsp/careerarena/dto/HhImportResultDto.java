package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Результат массового импорта вакансий с HeadHunter и авто-матчинга")
public class HhImportResultDto {

    @Schema(description = "Количество успешно импортированных вакансий")
    private int importedCount;

    @Schema(description = "Список созданных вакансий в платформе")
    private List<VacancyDto> vacancies;

    @Schema(description = "Общее число найденных подходящих спортсменов ФСП")
    private int matchedCandidatesTotal;

    @Schema(description = "Сводка предварительного матчинга по каждой вакансии (название вакансии -> число найденных кандидатов)")
    private Map<String, Integer> matchingSummary;

    @Schema(description = "Информационное сообщение")
    private String message;
}
