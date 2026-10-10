package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на верификацию компании-работодателя через государственные реестры (ФНС / ЕГРЮЛ)")
public class EmployerVerifyRequest {

    @Schema(description = "ID профиля работодателя в платформе")
    private UUID employerId;

    @NotBlank
    @Schema(description = "ИНН организации (10 или 12 цифр)")
    private String inn;

    @Schema(description = "ОГРН организации")
    private String ogrn;

    @Schema(description = "Полное юридическое наименование компании")
    private String companyFullName;
}
