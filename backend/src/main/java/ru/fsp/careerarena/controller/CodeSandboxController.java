package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.CodeExecutionRequest;
import ru.fsp.careerarena.dto.CodeExecutionResult;
import ru.fsp.careerarena.service.Judge0SandboxService;

@RestController
@RequestMapping("/api/v1/sandbox")
@RequiredArgsConstructor
@Tag(name = "Code Sandbox", description = "Безопасное изолированное исполнение и тестирование кода в Judge0")
public class CodeSandboxController {

    private final Judge0SandboxService sandboxService;

    @PostMapping("/execute")
    @Operation(summary = "Запуск решения задачи в изолированной среде с набором тест-кейсов")
    public ResponseEntity<CodeExecutionResult> executeCode(@Valid @RequestBody CodeExecutionRequest request) {
        return ResponseEntity.ok(sandboxService.executeAndTestCode(request));
    }
}
