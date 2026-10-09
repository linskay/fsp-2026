package ru.fsp.careerarena.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.fsp.careerarena.dto.AiSummaryDto;
import ru.fsp.careerarena.service.AiSummaryService;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование контроллера AI-резюме (AiSummaryController)")
class AiSummaryControllerTest {

    @Mock
    private AiSummaryService aiSummaryService;

    @InjectMocks
    private AiSummaryController aiSummaryController;

    @Test
    @DisplayName("Получение AI-резюме кандидата возвращает статус 200 OK и сгенерированный профиль")
    void getAiSummary_returnsOkWithSummary() {
        UUID candidateId = UUID.randomUUID();
        AiSummaryDto dto = AiSummaryDto.builder()
                .candidateId(candidateId)
                .summaryText("Высококлассный Java-разработчик")
                .recommendationLevel("HIGHLY_RECOMMENDED")
                .keyStrengths(List.of("Алгоритмы", "Java"))
                .build();

        when(aiSummaryService.generateOrGetAiSummary(candidateId)).thenReturn(dto);

        ResponseEntity<AiSummaryDto> response = aiSummaryController.getAiSummary(candidateId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getSummaryText()).isEqualTo("Высококлассный Java-разработчик");
        verify(aiSummaryService).generateOrGetAiSummary(candidateId);
    }

    @Test
    @DisplayName("Генерация AI-резюме через POST эндпоинт /generate возвращает статус 200 OK")
    void generateAiSummary_postRequest_returnsOkWithSummary() {
        UUID candidateId = UUID.randomUUID();
        ru.fsp.careerarena.dto.GenerateAiSummaryRequest request = ru.fsp.careerarena.dto.GenerateAiSummaryRequest.builder()
                .candidateId(candidateId)
                .provider("gemini")
                .model("gemini-1.5-flash")
                .focus("highload")
                .build();

        AiSummaryDto dto = AiSummaryDto.builder()
                .candidateId(candidateId)
                .summaryText("HighLoad архитектор")
                .modelName("Google Gemini 1.5 Flash (Live API)")
                .build();

        when(aiSummaryService.generateAiSummary(request)).thenReturn(dto);

        ResponseEntity<AiSummaryDto> response = aiSummaryController.generateAiSummary(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getSummaryText()).isEqualTo("HighLoad архитектор");
        verify(aiSummaryService).generateAiSummary(request);
    }
}
