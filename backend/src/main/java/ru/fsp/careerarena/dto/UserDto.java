package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.UserRole;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO текущего пользователя системы")
public class UserDto {

    @Schema(description = "UUID пользователя", example = "a1b2c3d4-e5f6-7890-abcd-ef0123456789")
    private UUID id;

    @Schema(description = "Электронная почта (логин)", example = "candidate@fsp.ru")
    private String email;

    @Schema(description = "Полное имя / ФИО", example = "Иван Пестерев")
    private String fullName;

    @Schema(description = "Роль пользователя в системе", example = "CANDIDATE")
    private UserRole role;

    @Schema(description = "URL аватара профиля", example = "https://images.unsplash.com/photo-1534528741775-53994a69daeb")
    private String avatarUrl;

    @Schema(description = "Флаг согласия на обработку персональных данных (152-ФЗ)", example = "true")
    private boolean personalDataConsentAccepted;

    @Schema(description = "Дата согласия на обработку ПДН")
    private OffsetDateTime personalDataConsentDate;

    @Schema(description = "UUID связанного профиля кандидата (если роль CANDIDATE)")
    private UUID candidateProfileId;

    @Schema(description = "UUID связанного профиля компании (если роль EMPLOYER)")
    private UUID employerProfileId;
}
