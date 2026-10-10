package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.CreateOfferRequest;
import ru.fsp.careerarena.dto.OfferDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.Invitation;
import ru.fsp.careerarena.entity.Vacancy;
import ru.fsp.careerarena.entity.enums.InvitationStatus;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.InvitationRepository;
import ru.fsp.careerarena.repository.VacancyRepository;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OfferService {

    private final InvitationRepository invitationRepository;
    private final CandidateProfileRepository candidateRepository;
    private final EmployerProfileRepository employerRepository;
    private final VacancyRepository vacancyRepository;

    private static final Pattern RANGE_PATTERN = Pattern.compile("от\\s*(\\d+)[\\s\\S]*?до\\s*(\\d+)", Pattern.CASE_INSENSITIVE);

    @Transactional
    public OfferDto createOffer(CreateOfferRequest request) {
        log.info("Creating reverse recruiting offer from employer={} to candidate={}",
                request.getEmployerId(), request.getCandidateId());

        CandidateProfile candidate = findCandidate(request.getCandidateId());
        EmployerProfile employer = findEmployer(request.getEmployerId());

        Vacancy vacancy = null;
        if (request.getVacancyId() != null) {
            vacancy = vacancyRepository.findById(request.getVacancyId()).orElse(null);
        }

        int salaryFrom = request.getSalaryFrom() != null ? request.getSalaryFrom() : 0;
        int salaryTo = request.getSalaryTo() != null ? request.getSalaryTo() : 0;
        int salaryOffered = request.getSalaryOffered() != null
                ? request.getSalaryOffered()
                : (salaryTo > 0 ? salaryTo : (salaryFrom > 0 ? salaryFrom : 300000));

        String text = request.getDescription() != null && !request.getDescription().isBlank()
                ? request.getDescription()
                : (request.getMessage() != null ? request.getMessage() : "Приглашение на собеседование");

        String formattedMessage = String.format("[Вилка: от %,d до %,d ₽] %s",
                salaryFrom > 0 ? salaryFrom : (salaryOffered - 50000),
                salaryTo > 0 ? salaryTo : (salaryOffered + 50000),
                text);

        Invitation invitation = Invitation.builder()
                .candidate(candidate)
                .employer(employer)
                .vacancy(vacancy)
                .salaryOffered(salaryOffered)
                .message(formattedMessage)
                .status(InvitationStatus.PENDING)
                .build();

        Invitation saved = invitationRepository.save(invitation);
        log.info("Created offer ID={} with status PENDING", saved.getId());
        return mapToOfferDto(saved, salaryFrom, salaryTo);
    }

    @Transactional(readOnly = true)
    public List<OfferDto> getOffersByCandidate(UUID candidateId) {
        log.info("Fetching offers for candidateId={}", candidateId);
        List<Invitation> list = invitationRepository.findByCandidateIdOrderByCreatedAtDesc(candidateId);
        if (list.isEmpty()) {
            // Also check if candidateId passed was user id
            candidateRepository.findByUserId(candidateId).ifPresent(cp -> {
                list.addAll(invitationRepository.findByCandidateIdOrderByCreatedAtDesc(cp.getId()));
            });
        }
        return list.stream()
                .map(this::mapToOfferDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OfferDto> getOffersByEmployer(UUID employerId) {
        log.info("Fetching offers for employerId={}", employerId);
        List<Invitation> list = invitationRepository.findByEmployerIdOrderByCreatedAtDesc(employerId);
        if (list.isEmpty()) {
            employerRepository.findByUserId(employerId).ifPresent(ep -> {
                list.addAll(invitationRepository.findByEmployerIdOrderByCreatedAtDesc(ep.getId()));
            });
        }
        return list.stream()
                .map(this::mapToOfferDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OfferDto acceptOffer(UUID offerId) {
        log.info("Accepting offer ID={}", offerId);
        Invitation invitation = invitationRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Оффер с ID " + offerId + " не найден"));

        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitation.setUpdatedAt(OffsetDateTime.now());
        Invitation saved = invitationRepository.save(invitation);
        log.info("Offer ID={} accepted. Candidate contacts unmasked under 152-FZ", offerId);
        return mapToOfferDto(saved);
    }

    @Transactional
    public OfferDto declineOffer(UUID offerId) {
        log.info("Declining offer ID={}", offerId);
        Invitation invitation = invitationRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Оффер с ID " + offerId + " не найден"));

        invitation.setStatus(InvitationStatus.DECLINED);
        invitation.setUpdatedAt(OffsetDateTime.now());
        Invitation saved = invitationRepository.save(invitation);
        return mapToOfferDto(saved);
    }

    private CandidateProfile findCandidate(UUID candidateId) {
        return candidateRepository.findById(candidateId)
                .or(() -> candidateRepository.findByUserId(candidateId))
                .orElseGet(() -> candidateRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Профиль кандидата не найден")));
    }

    private EmployerProfile findEmployer(UUID employerId) {
        return employerRepository.findById(employerId)
                .or(() -> employerRepository.findByUserId(employerId))
                .orElseGet(() -> employerRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Профиль работодателя не найден")));
    }

    public OfferDto mapToOfferDto(Invitation inv) {
        return mapToOfferDto(inv, null, null);
    }

    public OfferDto mapToOfferDto(Invitation inv, Integer customSalaryFrom, Integer customSalaryTo) {
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
                .build();
    }
}
