package ru.fsp.careerarena.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI fspCareerArenaOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("FSP Career Arena API")
                .description("Цифровая платформа-агрегатор ИТ-вакансий с верифицированным профилем достижений ФСП (Федерация спортивного программирования России)")
                .version("1.0.0")
                .contact(new Contact()
                    .name("ФСП РФ / Career Arena Support")
                    .url("https://fsp-russia.ru")
                    .email("support@fsp-russia.ru"))
                .license(new License()
                    .name("Положение об обработке ПДН 152-ФЗ")
                    .url("https://fsp-russia.ru/files/Положение%20обработку%20пдн%20(1).pdf")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
            .components(new Components()
                .addSecuritySchemes("Bearer Authentication", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Введите JWT токен (полученный через OAuth2 или аутентификацию)")));
    }
}
