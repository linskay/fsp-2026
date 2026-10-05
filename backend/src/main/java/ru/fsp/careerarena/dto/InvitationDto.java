package ru.fsp.careerarena.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.fsp.careerarena.entity.enums.InvitationStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationDto {
    private UUID id;
    private UUID candidateId;
    private String candidateName;
    private UUID employerId;
    private String companyName;
    private String companyLogo;
    private UUID vacancyId;
    private String vacancyTitle;
    private int salaryOffered;
    private String message;
    private InvitationStatus status;
    private OffsetDateTime createdAt;
}
