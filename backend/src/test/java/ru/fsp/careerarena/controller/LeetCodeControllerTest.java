package ru.fsp.careerarena.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.fsp.careerarena.entity.AlgorithmTask;
import ru.fsp.careerarena.service.LeetCodeService;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование контроллера парсера LeetCode (LeetCodeController)")
class LeetCodeControllerTest {

    @Mock
    private LeetCodeService leetCodeService;

    @InjectMocks
    private LeetCodeController leetCodeController;

    @Test
    @DisplayName("Запрос на парсинг задачи LeetCode возвращает статус 200 OK и объект задачи")
    void fetchLeetCodeTask_returnsOkWithTask() {
        AlgorithmTask task = AlgorithmTask.builder()
                .id(UUID.randomUUID())
                .title("Valid Palindrome")
                .slug("valid-palindrome")
                .difficulty("EASY")
                .build();

        when(leetCodeService.fetchAndSaveTaskBySlug("valid-palindrome")).thenReturn(task);

        ResponseEntity<AlgorithmTask> response = leetCodeController.fetchLeetCodeTask("valid-palindrome");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getTitle()).isEqualTo("Valid Palindrome");
        verify(leetCodeService).fetchAndSaveTaskBySlug("valid-palindrome");
    }
}
