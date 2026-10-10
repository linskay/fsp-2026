package ru.fsp.careerarena.mapper;

import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.AssessmentAssignmentDto;
import ru.fsp.careerarena.dto.AssessmentSubmissionDto;
import ru.fsp.careerarena.entity.AssessmentAssignment;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.User;

@Component
public class AssessmentMapper {

    public AssessmentAssignmentDto toDto(AssessmentAssignment a) {
        if (a == null) return null;
        CandidateProfile c = a.getCandidate();
        User u = c != null ? c.getUser() : null;

        return AssessmentAssignmentDto.builder()
                .id(a.getId())
                .employerId(a.getEmployer() != null ? a.getEmployer().getId() : null)
                .companyName(a.getEmployer() != null ? a.getEmployer().getCompanyName() : "Не указано")
                .candidateId(c != null ? c.getId() : null)
                .candidateName(u != null ? u.getFullName() : "Не указано")
                .taskTitle(a.getTaskTitle())
                .taskDifficulty(a.getTaskDifficulty())
                .taskDescription(a.getTaskDescription())
                .starterCode(a.getStarterCode())
                .timeLimitMinutes(a.getTimeLimitMinutes())
                .status(a.getStatus())
                .liveInterview(a.isLiveInterview())
                .telemostRoomUrl(a.getTelemostRoomUrl())
                .scheduledInterviewAt(a.getScheduledInterviewAt())
                .submissionLanguage(a.getSubmissionLanguage())
                .testsPassed(a.getTestsPassed())
                .totalTests(a.getTotalTests())
                .executionTimeMs(a.getExecutionTimeMs())
                .submittedAt(a.getSubmittedAt())
                .reviewVerdict(a.getReviewVerdict())
                .internalNote(a.getInternalNote())
                .candidateFeedbackMessage(a.getCandidateFeedbackMessage())
                .reviewerName(a.getReviewerName())
                .reviewedAt(a.getReviewedAt())
                .createdAt(a.getCreatedAt())
                .build();
    }

    public AssessmentSubmissionDto toSubmissionDto(AssessmentAssignment a) {
        if (a == null) return null;
        CandidateProfile c = a.getCandidate();
        User u = c != null ? c.getUser() : null;

        return AssessmentSubmissionDto.builder()
                .id(a.getId())
                .candidateId(c != null ? c.getId() : null)
                .candidateName(u != null ? u.getFullName() : "Не указано")
                .taskTitle(a.getTaskTitle())
                .code(a.getSubmissionCode() != null ? a.getSubmissionCode() : "// Решение кандидата еще не отправлено")
                .language(a.getSubmissionLanguage() != null ? a.getSubmissionLanguage() : "javascript")
                .testsPassed(a.getTestsPassed() != null ? a.getTestsPassed() : 0)
                .totalTests(a.getTotalTests() != null ? a.getTotalTests() : 0)
                .executionTimeMs(a.getExecutionTimeMs() != null ? a.getExecutionTimeMs() : 0)
                .submittedAt(a.getSubmittedAt())
                .status(a.getStatus())
                .reviewVerdict(a.getReviewVerdict())
                .internalNote(a.getInternalNote())
                .candidateFeedbackMessage(a.getCandidateFeedbackMessage())
                .build();
    }
}
