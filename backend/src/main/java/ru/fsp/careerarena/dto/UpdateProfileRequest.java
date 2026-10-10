package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос на обновление профиля пользователя")
public class UpdateProfileRequest {

    @Schema(description = "Обновленное ФИО / имя", example = "Иван Пестерев")
    private String fullName;

    @Schema(description = "Новый URL аватара", example = "https://images.unsplash.com/photo-1534528741775-53994a69daeb")
    private String avatarUrl;

    @Schema(description = "Новый пароль (опционально, если меняется)", example = "newSecurePassword2026")
    private String password;
}
