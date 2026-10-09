package ru.fsp.careerarena;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mockStatic;

@SpringBootTest
@DisplayName("Тестирование контекста и точки входа приложения (FspCareerArenaApplication)")
class FspCareerArenaApplicationTest {

    @Test
    @DisplayName("Контекст Spring Boot успешно поднимается с тестовой конфигурацией базы H2")
    void contextLoads() {
        // Проверка успешной инициализации Spring контекста
    }

    @Test
    @DisplayName("Метод main запускает SpringApplication.run")
    void testMainMethod() {
        try (MockedStatic<SpringApplication> mocked = mockStatic(SpringApplication.class)) {
            mocked.when(() -> SpringApplication.run(FspCareerArenaApplication.class, new String[]{}))
                    .thenReturn(null);

            FspCareerArenaApplication.main(new String[]{});

            mocked.verify(() -> SpringApplication.run(FspCareerArenaApplication.class, new String[]{}));
        }

        FspCareerArenaApplication app = new FspCareerArenaApplication();
        assertThat(app).isNotNull();
    }
}
