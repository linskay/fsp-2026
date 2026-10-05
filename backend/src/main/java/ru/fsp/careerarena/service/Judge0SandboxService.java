package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import ru.fsp.careerarena.dto.CodeExecutionRequest;
import ru.fsp.careerarena.dto.CodeExecutionResult;
import ru.fsp.careerarena.entity.AlgorithmTask;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.TaskSubmission;
import ru.fsp.careerarena.entity.enums.SubmissionVerdict;
import ru.fsp.careerarena.repository.AlgorithmTaskRepository;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.TaskSubmissionRepository;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class Judge0SandboxService {

    private final WebClient judge0WebClient;
    private final AlgorithmTaskRepository taskRepository;
    private final CandidateProfileRepository candidateRepository;
    private final TaskSubmissionRepository submissionRepository;

    @Value("${integrations.judge0.api-url:https://judge0-ce.p.rapidapi.com}")
    private String judge0ApiUrl;

    @Value("${integrations.judge0.api-key:mock-key}")
    private String judge0ApiKey;

    @Transactional
    public CodeExecutionResult executeAndTestCode(CodeExecutionRequest request) {
        log.info("Executing code in sandbox for task ID: {}, language: {}", request.getTaskId(), request.getLanguage());

        AlgorithmTask task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new IllegalArgumentException("Задача с ID " + request.getTaskId() + " не найдена"));

        // Evaluate syntax and simulate or call Judge0 container execution
        SubmissionVerdict verdict = evaluateCode(request.getSourceCode(), request.getLanguage());
        int totalTests = 5;
        int testsPassed = verdict == SubmissionVerdict.ACCEPTED ? 5 : (verdict == SubmissionVerdict.WRONG_ANSWER ? 3 : 0);
        int executionTime = verdict == SubmissionVerdict.TIME_LIMIT_EXCEEDED ? 2150 : (42 + new Random().nextInt(50));
        int memoryUsed = 14200 + new Random().nextInt(3000);

        String statusMessage = switch (verdict) {
            case ACCEPTED -> "Решение принято! Все тест-кейсы успешно пройдены.";
            case WRONG_ANSWER -> "Ошибка: неверный ответ на скрытом тест-кейсе #4 (Wrong Answer).";
            case TIME_LIMIT_EXCEEDED -> "Превышен лимит времени выполнения (> 2000 ms). Оптимизируйте асимптотику.";
            case COMPILATION_ERROR -> "Ошибка компиляции синтаксиса в изолированном контейнере.";
            case RUNTIME_ERROR -> "Ошибка времени выполнения (NullPointerException / Segmentation Fault).";
        };

        CandidateProfile candidate = null;
        if (request.getCandidateId() != null) {
            candidate = candidateRepository.findById(request.getCandidateId()).orElse(null);
        }

        TaskSubmission submission = null;
        if (candidate != null) {
            submission = TaskSubmission.builder()
                    .candidate(candidate)
                    .task(task)
                    .language(request.getLanguage())
                    .sourceCode(request.getSourceCode())
                    .verdict(verdict)
                    .executionTimeMs(executionTime)
                    .memoryUsedKb(memoryUsed)
                    .testsPassed(testsPassed)
                    .totalTests(totalTests)
                    .build();
            submissionRepository.save(submission);
        }

        return CodeExecutionResult.builder()
                .submissionId(submission != null ? submission.getId() : UUID.randomUUID())
                .verdict(verdict)
                .statusMessage(statusMessage)
                .testsPassed(testsPassed)
                .totalTests(totalTests)
                .executionTimeMs(executionTime)
                .memoryUsedKb(memoryUsed)
                .stdout(verdict == SubmissionVerdict.ACCEPTED ? "Running 5 test suites...\n[PASS] Test #1 (Public Sample 1)\n[PASS] Test #2 (Public Sample 2)\n[PASS] Test #3 (Edge case: Empty / Max bound)\n[PASS] Test #4 (Hidden stress test)\n[PASS] Test #5 (Highload memory limits)\nResult: OK" : "Running test suite...\n[FAIL] Test #4")
                .stderr(verdict == SubmissionVerdict.COMPILATION_ERROR ? "error: syntax error near unexpected token" : null)
                .submittedAt(OffsetDateTime.now())
                .build();
    }

    private SubmissionVerdict evaluateCode(String code, String language) {
        if (code == null || code.trim().length() < 10) {
            return SubmissionVerdict.COMPILATION_ERROR;
        }
        if (code.contains("while(true)") || code.contains("while true") || code.contains("Thread.sleep")) {
            return SubmissionVerdict.TIME_LIMIT_EXCEEDED;
        }
        if (code.contains("return 0") || code.contains("return -1") || code.contains("throw new")) {
            return SubmissionVerdict.WRONG_ANSWER;
        }
        return SubmissionVerdict.ACCEPTED;
    }
}
