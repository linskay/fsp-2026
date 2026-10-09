package ru.fsp.careerarena.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.fsp.careerarena.dto.CodeExecutionRequest;
import ru.fsp.careerarena.dto.CodeExecutionResult;
import ru.fsp.careerarena.entity.enums.SubmissionVerdict;
import ru.fsp.careerarena.service.Judge0SandboxService;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование контроллера песочницы кода (CodeSandboxController)")
class CodeSandboxControllerTest {

    @Mock
    private Judge0SandboxService sandboxService;

    @InjectMocks
    private CodeSandboxController sandboxController;

    @Test
    @DisplayName("Запуск решения задачи возвращает статус 200 OK и результат тестирования")
    void executeCode_returnsOkWithResult() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(UUID.randomUUID())
                .language("java")
                .sourceCode("public int solve() { return 42; }")
                .build();

        CodeExecutionResult result = CodeExecutionResult.builder()
                .verdict(SubmissionVerdict.ACCEPTED)
                .statusMessage("Все тесты пройдены")
                .testsPassed(5)
                .totalTests(5)
                .build();

        when(sandboxService.executeAndTestCode(request)).thenReturn(result);

        ResponseEntity<CodeExecutionResult> response = sandboxController.executeCode(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getVerdict()).isEqualTo(SubmissionVerdict.ACCEPTED);
        verify(sandboxService).executeAndTestCode(request);
    }
}
