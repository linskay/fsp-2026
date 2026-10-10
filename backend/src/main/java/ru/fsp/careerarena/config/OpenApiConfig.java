package ru.fsp.careerarena.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI fspCareerArenaOpenAPI() {
        return new OpenAPI()
            .servers(List.of(
                new Server()
                    .url("https://api.fsp-arena.ru")
                    .description("Production Enterprise Gateway"),
                new Server()
                    .url("http://localhost:8080")
                    .description("Local Development Environment")
            ))
            .info(new Info()
                .title("FSP Career Arena API")
                .description("Цифровая платформа-агрегатор ИТ-вакансий с верифицированным профилем достижений ФСП (Федерация спортивного программирования России). Защита персональных данных согласно 152-ФЗ и сквозной аудит доступа.")
                .version("2.0.0")
                .contact(new Contact()
                    .name("ФСП РФ / Career Arena Support")
                    .url("https://fsp-russia.ru")
                    .email("support@fsp-russia.ru"))
                .license(new License()
                    .name("Соответствие 152-ФЗ: маскирование персональных данных и аудит доступа")
                    .url("https://fsp-russia.ru/files/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%BF%D0%B4%D0%BD%20(1).pdf")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
            .components(new Components()
                .addSecuritySchemes("Bearer Authentication", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Введите JWT токен (полученный через OAuth2 или аутентификацию)")));
    }
}
