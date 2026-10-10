package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.HhImportRequest;
import ru.fsp.careerarena.dto.HhImportResultDto;
import ru.fsp.careerarena.dto.HhVacancyDto;
import ru.fsp.careerarena.service.HhIntegrationService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/integrations/hh")
@RequiredArgsConstructor
@Tag(name = "HeadHunter Integration", description = "Интеграция с hh.ru for Employers: получение активных вакансий компании и массовый импорт в базу платформы")
public class HhIntegrationController {

    private final HhIntegrationService hhIntegrationService;

    @GetMapping("/vacancies")
    @Operation(summary = "Получение списка доступных вакансий из аккаунта работодателя на hh.ru")
    public ResponseEntity<List<HhVacancyDto>> getAvailableVacancies(@RequestParam(required = false) UUID employerId) {
        return ResponseEntity.ok(hhIntegrationService.getAvailableVacancies(employerId));
    }

    @PostMapping("/import")
    @Operation(summary = "Массовый импорт выбранных вакансий из hh.ru в базу Career Arena с валидацией оклада и авто-матчингом")
    public ResponseEntity<HhImportResultDto> importVacancies(@RequestBody Object payload) {
        HhImportRequest request = new HhImportRequest();

        if (payload instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> ids = (List<String>) payload;
            request.setExternalIds(ids);
        } else if (payload instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = (Map<String, Object>) payload;
            if (map.containsKey("externalIds")) {
                @SuppressWarnings("unchecked")
                List<String> ids = (List<String>) map.get("externalIds");
                request.setExternalIds(ids);
            } else if (map.containsKey("vacancyIds")) {
                @SuppressWarnings("unchecked")
                List<String> ids = (List<String>) map.get("vacancyIds");
                request.setExternalIds(ids);
            }
            if (map.containsKey("employerId") && map.get("employerId") != null) {
                request.setEmployerId(UUID.fromString(map.get("employerId").toString()));
            }
        }

        return ResponseEntity.ok(hhIntegrationService.importVacancies(request));
    }
}
