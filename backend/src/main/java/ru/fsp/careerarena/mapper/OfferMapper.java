package ru.fsp.careerarena.mapper;

import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.OfferDto;
import ru.fsp.careerarena.entity.Invitation;
import ru.fsp.careerarena.entity.enums.InvitationStatus;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class OfferMapper {

    private static final Pattern RANGE_PATTERN = Pattern.compile("от\\s*(\\d+)[\\s\\S]*?до\\s*(\\d+)", Pattern.CASE_INSENSITIVE);

    public OfferDto toDto(Invitation inv) {
        return toDto(inv, null, null, false);
    }

    public OfferDto toDto(Invitation inv, boolean idempotentReplayed) {
        return toDto(inv, null, null, idempotentReplayed);
    }

    public OfferDto toDto(Invitation inv, Integer customSalaryFrom, Integer customSalaryTo) {
        return toDto(inv, customSalaryFrom, customSalaryTo, false);
    }

    public OfferDto toDto(Invitation inv, Integer customSalaryFrom, Integer customSalaryTo, boolean idempotentReplayed) {
        if (inv == null) return null;

        boolean isAccepted = inv.getStatus() == InvitationStatus.ACCEPTED;

        String candidateName = "Кандидат ФСП";
        String candidateEmail = "candidate@fsp.ru";
        String candidateGithub = null;
        if (inv.getCandidate() != null && inv.getCandidate().getUser() != null) {
            candidateName = inv.getCandidate().getUser().getFullName();
            candidateEmail = inv.getCandidate().getUser().getEmail();
            candidateGithub = inv.getCandidate().getGithubUsername();
        }

        Map<String, String> contacts = new HashMap<>();
        if (isAccepted) {
            contacts.put("email", candidateEmail);
            contacts.put("phone", "+7 (999) 450-20-26");
            contacts.put("telegram", candidateGithub != null ? "@" + candidateGithub : "@fsp_engineer");
            if (candidateGithub != null) {
                contacts.put("github", "https://github.com/" + candidateGithub);
            }
            contacts.put("consentStatus", "Обоюдное согласие получено (152-ФЗ РФ соблюден)");
        } else {
            contacts.put("notice", "Контакты скрыты до обоюдного согласия (ст. 9 152-ФЗ РФ)");
        }

        Integer salaryFrom = customSalaryFrom;
        Integer salaryTo = customSalaryTo;

        if (salaryFrom == null || salaryTo == null) {
            if (inv.getVacancy() != null) {
                salaryFrom = inv.getVacancy().getSalaryFrom();
                salaryTo = inv.getVacancy().getSalaryTo();
            } else if (inv.getMessage() != null) {
                Matcher matcher = RANGE_PATTERN.matcher(inv.getMessage().replaceAll("[^0-9а-яА-ЯёЁ\\s]", ""));
                if (matcher.find()) {
                    try {
                        salaryFrom = Integer.parseInt(matcher.group(1).trim());
                        salaryTo = Integer.parseInt(matcher.group(2).trim());
                    } catch (Exception ignored) {
                    }
                }
            }
        }

        if (salaryFrom == null || salaryFrom == 0) {
            salaryFrom = Math.max(100000, inv.getSalaryOffered() - 50000);
        }
        if (salaryTo == null || salaryTo == 0) {
            salaryTo = Math.max(salaryFrom, inv.getSalaryOffered() + 50000);
        }

        String positionTitle = "Senior / Middle Software Engineer";
        if (inv.getVacancy() != null && inv.getVacancy().getTitle() != null) {
            positionTitle = inv.getVacancy().getTitle();
        }

        return OfferDto.builder()
                .id(inv.getId())
                .candidateId(inv.getCandidate() != null ? inv.getCandidate().getId() : null)
                .candidateName(candidateName)
                .employerId(inv.getEmployer() != null ? inv.getEmployer().getId() : null)
                .companyName(inv.getEmployer() != null ? inv.getEmployer().getCompanyName() : "ИТ-Работодатель")
                .companyLogo(inv.getEmployer() != null ? inv.getEmployer().getCompanyLogo() : null)
                .vacancyId(inv.getVacancy() != null ? inv.getVacancy().getId() : null)
                .positionTitle(positionTitle)
                .salaryFrom(salaryFrom)
                .salaryTo(salaryTo)
                .salaryOffered(inv.getSalaryOffered())
                .description(inv.getMessage())
                .status(inv.getStatus())
                .contactsUnmasked(isAccepted)
                .candidateContacts(contacts)
                .createdAt(inv.getCreatedAt())
                .updatedAt(inv.getUpdatedAt())
                .idempotencyKey(inv.getIdempotencyKey())
                .idempotentReplayed(idempotentReplayed)
                .build();
    }
}
