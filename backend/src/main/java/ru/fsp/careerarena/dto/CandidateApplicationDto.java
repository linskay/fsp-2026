package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Отклик соискателя на вакансию")
public class CandidateApplicationDto {

    @Schema(description = "ID отклика")
    private UUID id;

    @Schema(description = "ID кандидата")
    private UUID candidateId;

    @Schema(description = "ФИО соискателя")
    private String candidateName;

    @Schema(description = "Аватар соискателя")
    private String candidateAvatar;

    @Schema(description = "Специализация соискателя")
    private Specialization candidateSpecialization;

    @Schema(description = "Подтвержденный грейд соискателя")
    private Grade candidateGrade;

    @Schema(description = "Спортивный ELO-рейтинг ФСП")
    private int candidateElo;

    @Schema(description = "Спортивный разряд ФСП")
    private FspRank candidateFspRank;

    @Schema(description = "ID вакансии")
    private UUID vacancyId;

    @Schema(description = "Название вакансии")
    private String vacancyTitle;

    @Schema(description = "Компания работодателя")
    private String companyName;

    @Schema(description = "Сопроводительное письмо")
    private String coverLetter;

    @Schema(description = "Статус отклика (NEW, REVIEWED, INTERVIEW, REJECTED, OFFER)")
    private String status;

    @Schema(description = "Дата подачи отклика")
    private OffsetDateTime createdAt;
}
