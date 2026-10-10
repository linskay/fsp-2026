package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на массовый импорт выбранных вакансий из hh.ru")
public class HhImportRequest {

    @Schema(description = "Список ID выбранных вакансий (hh.ru IDs)")
    private List<String> externalIds;

    @Schema(description = "ID профиля работодателя в платформе")
    private UUID employerId;
}
