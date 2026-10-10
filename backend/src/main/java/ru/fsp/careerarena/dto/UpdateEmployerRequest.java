package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на обновление профиля компании-работодателя")
public class UpdateEmployerRequest {

    @Schema(description = "Название компании")
    private String companyName;

    @Schema(description = "URL логотипа компании")
    private String companyLogo;

    @Schema(description = "Отрасль")
    private String industry;

    @Schema(description = "Описание компании")
    private String description;

    @Schema(description = "Официальный сайт")
    private String website;

    @Schema(description = "ФИО рекрутера / контактного лица")
    private String recruiterName;
}
