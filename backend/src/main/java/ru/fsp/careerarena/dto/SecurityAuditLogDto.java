package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запись журнала аудита безопасности обработки персональных данных (152-ФЗ)")
public class SecurityAuditLogDto {

    @Schema(description = "Уникальный ID записи аудита")
    private UUID id;

    @Schema(description = "ID инициатора действия")
    private UUID actorUserId;

    @Schema(description = "Email инициатора действия", example = "employer@fsp.ru")
    private String actorEmail;

    @Schema(description = "Роль инициатора", example = "EMPLOYER")
    private String actorRole;

    @Schema(description = "Тип действия", example = "VIEW_PERSONAL_CONTACTS")
    private String action;

    @Schema(description = "ID кандидата, чьи данные просматривались")
    private UUID targetCandidateId;

    @Schema(description = "ФИО кандидата", example = "Иван Пестерев")
    private String targetCandidateName;

    @Schema(description = "Детализированное описание действия", example = "Рекрутер СберТеха просмотрел контакты кандидата Иванова (телефон, telegram)")
    private String description;

    @Schema(description = "IP-адрес инициатора", example = "192.168.1.42")
    private String ipAddress;

    @Schema(description = "User-Agent браузера / приложения", example = "FSP-Career-Arena-Client/2.0")
    private String userAgent;

    @Schema(description = "Временная метка события")
    private OffsetDateTime createdAt;
}
