package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Доступные категории, отрасли и специализации для квалификационного тестирования ФСП")
public class TestCategoriesResponse {

    @Schema(description = "Отрасли ИТ-индустрии")
    private List<Map<String, Object>> industries;

    @Schema(description = "Специализации разработки")
    private List<Specialization> specializations;

    @Schema(description = "Квалификационные грейды")
    private List<Grade> grades;

    @Schema(description = "Регламент смены грейда")
    private String policy;
}
