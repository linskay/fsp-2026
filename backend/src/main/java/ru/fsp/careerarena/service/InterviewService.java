package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.ScheduleInterviewRequest;
import ru.fsp.careerarena.dto.ScheduledInterviewDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.ScheduledInterview;
import ru.fsp.careerarena.entity.UserNotification;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.ScheduledInterviewRepository;
import ru.fsp.careerarena.repository.UserNotificationRepository;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewService {

    private final ScheduledInterviewRepository interviewRepository;
    private final EmployerProfileRepository employerRepository;
    private final CandidateProfileRepository candidateRepository;
    private final UserNotificationRepository notificationRepository;

    @Transactional
    public ScheduledInterviewDto scheduleInterview(ScheduleInterviewRequest request) {
        EmployerProfile employer = employerRepository.findById(request.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Работодатель с ID " + request.getEmployerId() + " не найден"));

        CandidateProfile candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Кандидат с ID " + request.getCandidateId() + " не найден"));

        String telemostUrl = request.getTelemostRoomUrl();
        if (telemostUrl == null || telemostUrl.isBlank()) {
            long roomId = 1000000000L + ThreadLocalRandom.current().nextLong(8999999999L);
            telemostUrl = "https://telemost.yandex.ru/j/" + roomId;
        }

        ScheduledInterview interview = ScheduledInterview.builder()
                .employer(employer)
                .candidate(candidate)
                .title(request.getTitle())
                .scheduledAt(request.getScheduledAt())
                .telemostRoomUrl(telemostUrl)
                .status("SCHEDULED")
                .build();

        interview = interviewRepository.save(interview);

        // Notify candidate
        if (candidate.getUser() != null) {
            notificationRepository.save(UserNotification.builder()
                    .user(candidate.getUser())
                    .title("Назначено Лайв-интервью: " + request.getTitle())
                    .message(String.format("Компания %s запланировала онлайн-собеседование на %s. Ссылка на Яндекс Телемост: %s",
                            employer.getCompanyName(),
                            request.getScheduledAt().toString(),
                            telemostUrl))
                    .type("INTERVIEW")
                    .entityId(interview.getId().toString())
                    .read(false)
                    .build());
        }

        log.info("Scheduled live interview {} in Yandex Telemost for candidate {}", interview.getId(), candidate.getId());
        return mapToDto(interview);
    }

    @Transactional(readOnly = true)
    public List<ScheduledInterviewDto> getInterviewsByCandidate(UUID candidateId) {
        return interviewRepository.findByCandidateIdOrderByScheduledAtDesc(candidateId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduledInterviewDto> getInterviewsByEmployer(UUID employerId) {
        return interviewRepository.findByEmployerIdOrderByScheduledAtDesc(employerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ScheduledInterviewDto mapToDto(ScheduledInterview i) {
        return ScheduledInterviewDto.builder()
                .id(i.getId())
                .employerId(i.getEmployer() != null ? i.getEmployer().getId() : null)
                .companyName(i.getEmployer() != null ? i.getEmployer().getCompanyName() : "Не указано")
                .candidateId(i.getCandidate() != null ? i.getCandidate().getId() : null)
                .candidateName(i.getCandidate() != null && i.getCandidate().getUser() != null ? i.getCandidate().getUser().getFullName() : "Не указано")
                .title(i.getTitle())
                .scheduledAt(i.getScheduledAt())
                .telemostRoomUrl(i.getTelemostRoomUrl())
                .status(i.getStatus())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
