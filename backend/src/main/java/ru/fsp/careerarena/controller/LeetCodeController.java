package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.entity.AlgorithmTask;
import ru.fsp.careerarena.service.LeetCodeService;

@RestController
@RequestMapping("/api/v1/leetcode")
@RequiredArgsConstructor
@Tag(name = "LeetCode Parser", description = "Автоматический парсинг задач через публичный GraphQL API LeetCode")
public class LeetCodeController {

    private final LeetCodeService leetCodeService;

    @PostMapping("/fetch/{titleSlug}")
    @Operation(summary = "Парсинг и сохранение задачи LeetCode в базу по slug")
    public ResponseEntity<AlgorithmTask> fetchLeetCodeTask(@PathVariable String titleSlug) {
        return ResponseEntity.ok(leetCodeService.fetchAndSaveTaskBySlug(titleSlug));
    }
}
