package ru.fsp.careerarena.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import ru.fsp.careerarena.entity.AlgorithmTask;
import ru.fsp.careerarena.repository.AlgorithmTaskRepository;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование сервиса интеграции с LeetCode (LeetCodeService)")
class LeetCodeServiceTest {

    @Mock
    private WebClient leetCodeWebClient;

    @Mock
    private AlgorithmTaskRepository taskRepository;

    @InjectMocks
    private LeetCodeService leetCodeService;

    private AlgorithmTask existingTask;

    @BeforeEach
    void setUp() {
        existingTask = AlgorithmTask.builder()
                .id(UUID.randomUUID())
                .title("Two Sum")
                .slug("two-sum")
                .difficulty("EASY")
                .tags("Array, Hash Table")
                .description("<p>Given an array of integers nums and an integer target...</p>")
                .build();
    }

    @Test
    @DisplayName("Возврат задачи из локальной базы, если она уже была сохранена ранее")
    void fetchAndSaveTaskBySlug_taskAlreadyExists_returnsFromDb() {
        when(taskRepository.findBySlug("two-sum")).thenReturn(Optional.of(existingTask));

        AlgorithmTask task = leetCodeService.fetchAndSaveTaskBySlug("two-sum");

        assertThat(task).isNotNull();
        assertThat(task.getTitle()).isEqualTo("Two Sum");
        assertThat(task.getSlug()).isEqualTo("two-sum");
        verify(taskRepository, never()).save(any());
        verify(leetCodeWebClient, never()).post();
    }

    @Test
    @DisplayName("Успешный парсинг задачи через GraphQL API LeetCode со сниппетами на разных языках")
    @SuppressWarnings("unchecked")
    void fetchAndSaveTaskBySlug_liveGraphQlSuccess_savesTaskWithSnippets() {
        String graphqlResponse = """
                {
                  "data": {
                    "question": {
                      "questionId": "1",
                      "title": "Two Sum",
                      "titleSlug": "two-sum",
                      "difficulty": "Easy",
                      "content": "<p>Given an array...</p>",
                      "topicTags": [
                        {"name": "Array", "slug": "array"},
                        {"name": "Hash Table", "slug": "hash-table"}
                      ],
                      "codeSnippets": [
                        {"lang": "Java", "langSlug": "java", "code": "class Solution { public int[] twoSum() {} }"},
                        {"lang": "Python3", "langSlug": "python3", "code": "class Solution: def twoSum(self): pass"},
                        {"lang": "C++", "langSlug": "cpp", "code": "class Solution { public: vector<int> twoSum() {} };"},
                        {"lang": "Go", "langSlug": "golang", "code": "func twoSum() []int {}"},
                        {"lang": "JavaScript", "langSlug": "javascript", "code": "var twoSum = function() {};"}
                      ],
                      "sampleTestCase": "[2,7,11,15]\\n9"
                    }
                  }
                }
                """;

        setupWebClientMock(graphqlResponse);

        when(taskRepository.findBySlug("two-sum")).thenReturn(Optional.empty());
        when(taskRepository.save(any(AlgorithmTask.class))).thenAnswer(inv -> inv.getArgument(0));

        AlgorithmTask task = leetCodeService.fetchAndSaveTaskBySlug("two-sum");

        assertThat(task).isNotNull();
        assertThat(task.getTitle()).isEqualTo("Two Sum");
        assertThat(task.getDifficulty()).isEqualTo("Easy");
        assertThat(task.getTags()).contains("Array, Hash Table");
        assertThat(task.getInitialCodeJava()).contains("class Solution");
        assertThat(task.getInitialCodePython()).contains("def twoSum");
        assertThat(task.getInitialCodeCpp()).contains("vector<int>");
        assertThat(task.getInitialCodeGo()).contains("func twoSum");
        assertThat(task.getInitialCodeJs()).contains("var twoSum");
        verify(taskRepository).save(any(AlgorithmTask.class));
    }

    @Test
    @DisplayName("Ответ GraphQL с отсутствующим полем question переключается на fallback шаблон")
    void fetchAndSaveTaskBySlug_missingQuestionNode_fallsBackToTemplate() {
        String emptyQuestionResponse = """
                {
                  "data": {
                    "question": null
                  }
                }
                """;

        setupWebClientMock(emptyQuestionResponse);

        when(taskRepository.findBySlug("unknown-task")).thenReturn(Optional.empty());
        when(taskRepository.save(any(AlgorithmTask.class))).thenAnswer(inv -> inv.getArgument(0));

        AlgorithmTask task = leetCodeService.fetchAndSaveTaskBySlug("unknown-task");

        assertThat(task).isNotNull();
        assertThat(task.getTitle()).isEqualTo("UNKNOWN TASK");
        assertThat(task.getDifficulty()).isEqualTo("MEDIUM");
        assertThat(task.getTags()).contains("Алгоритмы");
        verify(taskRepository).save(any(AlgorithmTask.class));
    }

    @Test
    @DisplayName("Сбой сетевого запроса к GraphQL переключается на fallback шаблон задачи")
    void fetchAndSaveTaskBySlug_networkError_fallsBackToTemplate() {
        WebClient.RequestBodyUriSpec uriSpec = mock(WebClient.RequestBodyUriSpec.class);
        when(leetCodeWebClient.post()).thenReturn(uriSpec);
        when(uriSpec.uri(anyString())).thenThrow(new RuntimeException("GraphQL timeout"));

        when(taskRepository.findBySlug("3sum")).thenReturn(Optional.empty());
        when(taskRepository.save(any(AlgorithmTask.class))).thenAnswer(inv -> inv.getArgument(0));

        AlgorithmTask task = leetCodeService.fetchAndSaveTaskBySlug("3sum");

        assertThat(task).isNotNull();
        assertThat(task.getTitle()).isEqualTo("3SUM");
        assertThat(task.getSlug()).isEqualTo("3sum");
        assertThat(task.getInitialCodeJava()).contains("public int solve()");
        verify(taskRepository).save(any(AlgorithmTask.class));
    }

    @SuppressWarnings("unchecked")
    private void setupWebClientMock(String responseBody) {
        WebClient.RequestBodyUriSpec uriSpec = mock(WebClient.RequestBodyUriSpec.class);
        WebClient.RequestHeadersSpec headersSpec = mock(WebClient.RequestHeadersSpec.class);
        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);

        when(leetCodeWebClient.post()).thenReturn(uriSpec);
        when(uriSpec.uri("/graphql")).thenReturn(uriSpec);
        when(uriSpec.bodyValue(any())).thenReturn(headersSpec);
        when(headersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(responseBody));
    }
}
