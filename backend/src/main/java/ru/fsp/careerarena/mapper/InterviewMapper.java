package ru.fsp.careerarena.mapper;

import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.ScheduledInterviewDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.ScheduledInterview;

@Component
public class InterviewMapper {

    public ScheduledInterviewDto toDto(ScheduledInterview i) {
        if (i == null) return null;
        CandidateProfile c = i.getCandidate();

        return ScheduledInterviewDto.builder()
                .id(i.getId())
                .employerId(i.getEmployer() != null ? i.getEmployer().getId() : null)
                .companyName(i.getEmployer() != null ? i.getEmployer().getCompanyName() : "Не указано")
                .candidateId(c != null ? c.getId() : null)
                .candidateName(c != null && c.getUser() != null ? c.getUser().getFullName() : "Не указано")
                .title(i.getTitle())
                .scheduledAt(i.getScheduledAt())
                .telemostRoomUrl(i.getTelemostRoomUrl())
                .status(i.getStatus())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
