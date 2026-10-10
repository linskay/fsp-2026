package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.*;
import ru.fsp.careerarena.entity.*;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.mapper.AssessmentMapper;
import ru.fsp.careerarena.repository.AssessmentAssignmentRepository;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.UserNotificationRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentService {

    private final AssessmentAssignmentRepository assessmentRepository;
    private final EmployerProfileRepository employerRepository;
    private final CandidateProfileRepository candidateRepository;
    private final UserNotificationRepository notificationRepository;
    private final AssessmentMapper assessmentMapper;

    @Transactional(readOnly = true)
    public List<AssessmentAssignmentDto> getAssessmentsByEmployerId(UUID employerId) {
        return assessmentRepository.findByEmployerIdOrderByCreatedAtDesc(employerId).stream()
                .map(assessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssessmentAssignmentDto> getAssessmentsByCandidateId(UUID candidateId) {
        return assessmentRepository.findByCandidateIdOrderByCreatedAtDesc(candidateId).stream()
                .map(assessmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AssessmentAssignmentDto assignAssessment(AssignAssessmentRequest request) {
        EmployerProfile employer = employerRepository.findById(request.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Работодатель с ID " + request.getEmployerId() + " не найден"));

        CandidateProfile candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Кандидат с ID " + request.getCandidateId() + " не найден"));

        String telemostUrl = null;
        if (request.isLiveInterview()) {
            long roomId = 1000000000L + ThreadLocalRandom.current().nextLong(8999999999L);
            telemostUrl = "https://telemost.yandex.ru/j/" + roomId;
        }

        AssessmentAssignment assignment = AssessmentAssignment.builder()
                .employer(employer)
                .candidate(candidate)
                .taskTitle(request.getTaskTitle())
                .taskDifficulty(request.getTaskDifficulty() != null ? request.getTaskDifficulty() : "Medium")
                .taskDescription(request.getTaskDescription())
                .starterCode(request.getStarterCode())
                .timeLimitMinutes(request.getTimeLimitMinutes() > 0 ? request.getTimeLimitMinutes() : 45)
                .status("PENDING")
                .liveInterview(request.isLiveInterview())
                .telemostRoomUrl(telemostUrl)
                .scheduledInterviewAt(request.getScheduledInterviewAt())
                .build();

        assignment = assessmentRepository.save(assignment);

        // Notify candidate
        if (candidate.getUser() != null) {
            notificationRepository.save(UserNotification.builder()
                    .user(candidate.getUser())
                    .title("Новое техническое задание от " + employer.getCompanyName())
                    .message(String.format("Вам назначена задача '%s' (лимит: %d мин.).%s",
                            request.getTaskTitle(),
                            assignment.getTimeLimitMinutes(),
                            request.isLiveInterview() ? " Формат: Лайв-интервью в Яндекс Телемост." : ""))
                    .type(request.isLiveInterview() ? "LIVE_INTERVIEW" : "ASSESSMENT")
                    .entityId(assignment.getId().toString())
                    .read(false)
                    .build());
        }

        log.info("Assigned assessment {} to candidate {} from employer {}",
                assignment.getId(), candidate.getId(), employer.getId());

        return assessmentMapper.toDto(assignment);
    }

    @Transactional(readOnly = true)
    public AssessmentSubmissionDto getSubmission(UUID id) {
        AssessmentAssignment assignment = assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Назначенное задание с ID " + id + " не найдено"));

        return assessmentMapper.toSubmissionDto(assignment);
    }

    @Transactional
    public AssessmentAssignmentDto reviewSubmission(UUID id, ReviewAssessmentRequest request) {
        AssessmentAssignment assignment = assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Назначенное задание с ID " + id + " не найдено"));

        assignment.setStatus("REVIEWED");
        assignment.setReviewVerdict(request.getVerdict());
        assignment.setInternalNote(request.getInternalNote());
        assignment.setCandidateFeedbackMessage(request.getCandidateFeedbackMessage());
        assignment.setReviewerName(request.getReviewerName() != null ? request.getReviewerName() : "Team Lead");
        assignment.setReviewedAt(OffsetDateTime.now());

        assignment = assessmentRepository.save(assignment);

        // Notify candidate
        CandidateProfile c = assignment.getCandidate();
        if (c != null && c.getUser() != null) {
            notificationRepository.save(UserNotification.builder()
                    .user(c.getUser())
                    .title("Код-ревью завершено: " + assignment.getTaskTitle())
                    .message(String.format("Компания %s оценила решение: вердикт '%s'. Комментарий: %s",
                            assignment.getEmployer().getCompanyName(),
                            assignment.getReviewVerdict(),
                            request.getCandidateFeedbackMessage() != null ? request.getCandidateFeedbackMessage() : "Оценка выставлена."))
                    .type("REVIEW_RESULT")
                    .entityId(assignment.getId().toString())
                    .read(false)
                    .build());
        }

        log.info("Reviewed assessment {} with verdict {}", assignment.getId(), request.getVerdict());
        return assessmentMapper.toDto(assignment);
    }

    public AssessmentAssignmentDto mapToDto(AssessmentAssignment a) {
        return assessmentMapper.toDto(a);
    }
}
