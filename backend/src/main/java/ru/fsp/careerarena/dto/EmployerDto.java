package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Профиль компании-работодателя")
public class EmployerDto {

    @Schema(description = "ID профиля работодателя")
    private UUID id;

    @Schema(description = "ID пользователя-аккаунта")
    private UUID userId;

    @Schema(description = "Название компании")
    private String companyName;

    @Schema(description = "URL логотипа компании")
    private String companyLogo;

    @Schema(description = "Отрасль (финтех, ритейл и др.)")
    private String industry;

    @Schema(description = "Описание компании и миссия")
    private String description;

    @Schema(description = "Официальный сайт")
    private String website;

    @com.fasterxml.jackson.annotation.JsonProperty("isFspPartner")
    @Schema(description = "Является ли официальным партнером ФСП")
    private boolean isFspPartner;

    @Schema(description = "ID работодателя в HeadHunter")
    private String hhEmployerId;

    @Schema(description = "ФИО рекрутера / контактного лица")
    private String recruiterName;

    @Schema(description = "Email рекрутера")
    private String recruiterEmail;

    @Schema(description = "Аватар рекрутера")
    private String recruiterAvatar;

    @Schema(description = "Количество активных вакансий")
    private int activeVacanciesCount;

    @Schema(description = "Дата создания профиля")
    private OffsetDateTime createdAt;
}
