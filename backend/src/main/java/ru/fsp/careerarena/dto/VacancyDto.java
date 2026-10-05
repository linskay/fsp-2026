package ru.fsp.careerarena.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.entity.enums.WorkFormat;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VacancyDto {
    private UUID id;
    private UUID employerId;
    private String companyName;
    private String companyLogo;
    private String title;
    private Specialization specialization;
    private Grade grade;
    private int salaryFrom;
    private int salaryTo;
    private int minFspElo;
    private FspRank requiredFspRank;
    private String location;
    private WorkFormat workFormat;
    private String description;
    private boolean isActive;
    private Set<String> requiredSkills;
}
