package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Верифицированный профиль кандидата / спортсмена ФСП")
public class CandidateDto {

    @Schema(description = "Уникальный идентификатор профиля кандидата", example = "c1111111-1111-1111-1111-111111111111")
    private UUID id;

    @Schema(description = "ID пользователя в системе", example = "u1111111-1111-1111-1111-111111111111")
    private UUID userId;

    @Schema(description = "ФИО кандидата", example = "Александр Белов")
    private String fullName;

    @Schema(description = "Электронная почта", example = "alex.belov@fsp-russia.ru")
    private String email;

    @Schema(description = "URL аватара", example = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
    private String avatarUrl;

    @Schema(description = "Официальный ID спортсмена в реестре ФСП РФ", example = "FSP-RUS-2024-8841")
    private String fspId;

    @Schema(description = "Спортивный алгоритмический рейтинг ELO ФСП", example = "2740")
    private int fspElo;

    @Schema(description = "Спортивный разряд / звание ФСП", example = "MS")
    private FspRank fspRank;

    @Schema(description = "Отображаемое название спортивного разряда", example = "Мастер спорта России")
    private String fspRankDisplayName;

    @Schema(description = "Основная специализация", example = "BACKEND")
    private Specialization specialization;

    @Schema(description = "Квалификационный грейд", example = "SENIOR")
    private Grade grade;

    @Schema(description = "Зарплатные ожидания в рублях", example = "350000")
    private int salaryExpectation;

    @Schema(description = "Город проживания", example = "Москва")
    private String location;

    @Schema(description = "Краткое резюме и профессиональные интересы", example = "Highload архитектор, победитель Кубка России ФСП 2024 по спортивному программированию.")
    private String bio;

    @Schema(description = "Статус верификации аккредитационной комиссией ФСП РФ", example = "true")
    private boolean isFspVerified;

    @Schema(description = "Имя пользователя GitHub", example = "alex-belov-fsp")
    private String githubUsername;

    @Schema(description = "Количество публичных репозиториев на GitHub", example = "34")
    private int githubReposCount;

    @Schema(description = "Количество коммитов за последний год", example = "1420")
    private int githubCommitsCount;

    @Schema(description = "Ключевой технологический стек", example = "[\"Java 21\", \"Spring Boot 3\", \"PostgreSQL\", \"Kafka\", \"Dinic Algo\"]")
    private Set<String> skills;
}
