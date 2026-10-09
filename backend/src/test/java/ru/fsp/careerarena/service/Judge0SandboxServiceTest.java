package ru.fsp.careerarena.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование сервиса песочницы кода (Judge0SandboxService)")
class Judge0SandboxServiceTest {

    @Mock
    private WebClient judge0WebClient;

    @Mock
    private AlgorithmTaskRepository taskRepository;

    @Mock
    private CandidateProfileRepository candidateRepository;

    @Mock
    private TaskSubmissionRepository submissionRepository;

    @InjectMocks
    private Judge0SandboxService sandboxService;

    private AlgorithmTask sampleTask;
    private CandidateProfile sampleCandidate;
    private UUID taskId;
    private UUID candidateId;

    @BeforeEach
    void setUp() {
        taskId = UUID.randomUUID();
        candidateId = UUID.randomUUID();

        sampleTask = AlgorithmTask.builder()
                .id(taskId)
                .title("Two Sum")
                .slug("two-sum")
                .difficulty("EASY")
                .build();

        sampleCandidate = CandidateProfile.builder()
                .id(candidateId)
                .fspElo(1600)
                .build();
    }

    @Test
    @DisplayName("Успешное исполнение корректного кода завершается вердиктом ACCEPTED и сохранением решения")
    void executeAndTestCode_validCodeWithCandidate_returnsAcceptedAndSavesSubmission() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .candidateId(candidateId)
                .language("java")
                .sourceCode("public int[] twoSum(int[] nums, int target) { int a = 1; int b = 2; return new int[]{a, b}; }")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));
        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(sampleCandidate));
        when(submissionRepository.save(any(TaskSubmission.class))).thenAnswer(invocation -> {
            TaskSubmission s = invocation.getArgument(0);
            s.setId(UUID.randomUUID());
            return s;
        });

        CodeExecutionResult result = sandboxService.executeAndTestCode(request);

        assertThat(result).isNotNull();
        assertThat(result.getVerdict()).isEqualTo(SubmissionVerdict.ACCEPTED);
        assertThat(result.getTestsPassed()).isEqualTo(5);
        assertThat(result.getTotalTests()).isEqualTo(5);
        assertThat(result.getStatusMessage()).contains("Решение принято");
        assertThat(result.getStdout()).contains("Running 5 test suites");
        assertThat(result.getStderr()).isNull();
        verify(submissionRepository).save(any(TaskSubmission.class));
    }

    @Test
    @DisplayName("Исполнение кода без кандидата не пытается сохранить решение в базу")
    void executeAndTestCode_noCandidate_returnsResultWithoutSavingSubmission() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .candidateId(null)
                .language("python")
                .sourceCode("def twoSum(nums, target): return [0, 1]  # solution")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));

        CodeExecutionResult result = sandboxService.executeAndTestCode(request);

        assertThat(result).isNotNull();
        assertThat(result.getVerdict()).isEqualTo(SubmissionVerdict.ACCEPTED);
        verify(candidateRepository, never()).findById(any());
        verify(submissionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Исполнение кода с кандидатом, не найденным в базе")
    void executeAndTestCode_candidateNotFoundInDb_skipsSubmissionSave() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .candidateId(candidateId)
                .language("java")
                .sourceCode("public int[] solve() { int x = 10; return new int[]{x}; }")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));
        when(candidateRepository.findById(candidateId)).thenReturn(Optional.empty());

        CodeExecutionResult result = sandboxService.executeAndTestCode(request);

        assertThat(result).isNotNull();
        assertThat(result.getVerdict()).isEqualTo(SubmissionVerdict.ACCEPTED);
        verify(submissionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Попытка исполнить код для несуществующей задачи выбрасывает IllegalArgumentException")
    void executeAndTestCode_taskNotFound_throwsException() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .language("java")
                .sourceCode("class Solution {}")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sandboxService.executeAndTestCode(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("не найдена");
    }

    @Test
    @DisplayName("Код, содержащий бесконечный цикл 'while(true)', завершается с вердиктом TIME_LIMIT_EXCEEDED")
    void executeAndTestCode_infiniteLoopWhileTrue_returnsTimeLimitExceeded() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .language("cpp")
                .sourceCode("int main() { while(true) {} }")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));

        CodeExecutionResult result = sandboxService.executeAndTestCode(request);

        assertThat(result.getVerdict()).isEqualTo(SubmissionVerdict.TIME_LIMIT_EXCEEDED);
        assertThat(result.getExecutionTimeMs()).isEqualTo(2150);
        assertThat(result.getStatusMessage()).contains("Превышен лимит времени выполнения");
    }

    @Test
    @DisplayName("Код с конструкцией 'while true' завершается с вердиктом TIME_LIMIT_EXCEEDED")
    void executeAndTestCode_pythonWhileTrue_returnsTimeLimitExceeded() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .language("python")
                .sourceCode("while true:\n    pass\nprint('done')")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));

        CodeExecutionResult result = sandboxService.executeAndTestCode(request);

        assertThat(result.getVerdict()).isEqualTo(SubmissionVerdict.TIME_LIMIT_EXCEEDED);
    }

    @Test
    @DisplayName("Код с засыпанием потока 'Thread.sleep' завершается с вердиктом TIME_LIMIT_EXCEEDED")
    void executeAndTestCode_threadSleep_returnsTimeLimitExceeded() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .language("java")
                .sourceCode("public void wait() throws Exception { Thread.sleep(5000); }")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));

        CodeExecutionResult result = sandboxService.executeAndTestCode(request);

        assertThat(result.getVerdict()).isEqualTo(SubmissionVerdict.TIME_LIMIT_EXCEEDED);
    }

    @Test
    @DisplayName("Код с заглушкой 'return 0' завершается с вердиктом WRONG_ANSWER")
    void executeAndTestCode_returnZero_returnsWrongAnswer() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .language("c")
                .sourceCode("int solve() { return 0; }")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));

        CodeExecutionResult result = sandboxService.executeAndTestCode(request);

        assertThat(result.getVerdict()).isEqualTo(SubmissionVerdict.WRONG_ANSWER);
        assertThat(result.getTestsPassed()).isEqualTo(3);
        assertThat(result.getStatusMessage()).contains("Wrong Answer");
        assertThat(result.getStdout()).contains("[FAIL] Test #4");
    }

    @Test
    @DisplayName("Код с заглушкой 'return -1' завершается с вердиктом WRONG_ANSWER")
    void executeAndTestCode_returnMinusOne_returnsWrongAnswer() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .language("c")
                .sourceCode("int solve() { return -1; }")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));

        CodeExecutionResult result = sandboxService.executeAndTestCode(request);

        assertThat(result.getVerdict()).isEqualTo(SubmissionVerdict.WRONG_ANSWER);
    }

    @Test
    @DisplayName("Код с выбросом исключения 'throw new' завершается с вердиктом WRONG_ANSWER")
    void executeAndTestCode_throwNew_returnsWrongAnswer() {
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .taskId(taskId)
                .language("java")
                .sourceCode("public void fail() { throw new RuntimeException(); }")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));

        CodeExecutionResult result = sandboxService.executeAndTestCode(request);

        assertThat(result.getVerdict()).isEqualTo(SubmissionVerdict.WRONG_ANSWER);
    }

    @Test
    @DisplayName("Пустой или слишком короткий код завершается с вердиктом COMPILATION_ERROR")
    void executeAndTestCode_shortOrNullCode_returnsCompilationError() {
        CodeExecutionRequest requestShort = CodeExecutionRequest.builder()
                .taskId(taskId)
                .language("java")
                .sourceCode("  short  ")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(Optional.of(sampleTask));

        CodeExecutionResult resultShort = sandboxService.executeAndTestCode(requestShort);

        assertThat(resultShort.getVerdict()).isEqualTo(SubmissionVerdict.COMPILATION_ERROR);
        assertThat(resultShort.getTestsPassed()).isEqualTo(0);
        assertThat(resultShort.getStatusMessage()).contains("Ошибка компиляции синтаксиса");
        assertThat(resultShort.getStderr()).contains("syntax error");

        CodeExecutionRequest requestNull = CodeExecutionRequest.builder()
                .taskId(taskId)
                .language("java")
                .sourceCode(null)
                .build();

        CodeExecutionResult resultNull = sandboxService.executeAndTestCode(requestNull);
        assertThat(resultNull.getVerdict()).isEqualTo(SubmissionVerdict.COMPILATION_ERROR);
    }
}
