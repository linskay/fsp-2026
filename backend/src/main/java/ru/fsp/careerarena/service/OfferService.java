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
import ru.fsp.careerarena.mapper.OfferMapper;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.InvitationRepository;
import ru.fsp.careerarena.repository.VacancyRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OfferService {

    private final InvitationRepository invitationRepository;
    private final CandidateProfileRepository candidateRepository;
    private final EmployerProfileRepository employerRepository;
    private final VacancyRepository vacancyRepository;
    private final OfferMapper offerMapper;
    private final IdempotencyService idempotencyService;
    private final WebhookService webhookService;
    private final TelegramBotService telegramBotService;

    @Transactional
    public OfferDto createOffer(CreateOfferRequest request) {
        log.info("Creating reverse recruiting offer from employer={} to candidate={}, idempotencyKey={}",
                request.getEmployerId(), request.getCandidateId(), request.getIdempotencyKey());

        // 1. Проверка по Idempotency Key (RFC 7231 / IETF Idempotency standard)
        String idempotencyKey = request.getIdempotencyKey();
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            idempotencyKey = idempotencyKey.trim();
            var existingByKey = invitationRepository.findByIdempotencyKey(idempotencyKey);
            if (existingByKey.isPresent()) {
                Invitation existing = existingByKey.get();
                log.info("Idempotent offer request intercepted for key={}, returning existing offer ID={}",
                        idempotencyKey, existing.getId());
                return offerMapper.toDto(existing, true);
            }
        }

        // 2. Бизнес-идемпотентность: предотвращение повторной отправки дублирующего активного PENDING оффера
        if (request.getVacancyId() != null) {
            var activeOffer = invitationRepository
                    .findFirstByEmployerIdAndCandidateIdAndVacancyIdAndStatus(
                            request.getEmployerId(), request.getCandidateId(), request.getVacancyId(), InvitationStatus.PENDING);
            if (activeOffer.isPresent()) {
                Invitation existing = activeOffer.get();
                log.info("Active pending offer already exists for employer={} candidate={} vacancy={}. Replaying offer ID={}",
                        request.getEmployerId(), request.getCandidateId(), request.getVacancyId(), existing.getId());
                return offerMapper.toDto(existing, true);
            }
        } else {
            var activeOffer = invitationRepository
                    .findFirstByEmployerIdAndCandidateIdAndStatus(
                            request.getEmployerId(), request.getCandidateId(), InvitationStatus.PENDING);
            if (activeOffer.isPresent()) {
                Invitation existing = activeOffer.get();
                log.info("Active pending offer already exists for employer={} candidate={}. Replaying offer ID={}",
                        request.getEmployerId(), request.getCandidateId(), existing.getId());
                return offerMapper.toDto(existing, true);
            }
        }

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
                .idempotencyKey(idempotencyKey)
                .build();

        Invitation saved = invitationRepository.save(invitation);
        log.info("Created offer ID={} with status PENDING, idempotencyKey={}", saved.getId(), idempotencyKey);
        OfferDto resultDto = offerMapper.toDto(saved, salaryFrom, salaryTo, false);

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            idempotencyService.recordResponse(
                    idempotencyKey,
                    "/api/v1/offers",
                    request,
                    employer.getUser() != null ? employer.getUser().getId() : null,
                    201,
                    resultDto,
                    saved.getId());
        }

        // Webhook integration: оповещение внешних ATS систем о новом оффере
        try {
            webhookService.dispatchOfferEventAsync(employer.getId(), "OFFER_SENT", resultDto);
        } catch (Exception ex) {
            log.warn("Failed to dispatch OFFER_SENT webhook: {}", ex.getMessage());
        }

        // Telegram Bot integration: мгновенный пуш кандидату с кнопками [Принять] и [В чат]
        try {
            telegramBotService.sendOfferNotification(saved, candidate, employer, salaryOffered);
        } catch (Exception ex) {
            log.warn("Failed to dispatch Telegram offer push: {}", ex.getMessage());
        }

        return resultDto;
    }

    @Transactional(readOnly = true)
    public List<OfferDto> getOffersByCandidate(UUID candidateId) {
        log.info("Fetching offers for candidateId={}", candidateId);
        List<Invitation> list = invitationRepository.findByCandidateIdOrderByCreatedAtDesc(candidateId);
        if (list.isEmpty()) {
            candidateRepository.findByUserId(candidateId).ifPresent(cp -> {
                list.addAll(invitationRepository.findByCandidateIdOrderByCreatedAtDesc(cp.getId()));
            });
        }
        return list.stream()
                .map(offerMapper::toDto)
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
                .map(offerMapper::toDto)
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
        OfferDto dto = offerMapper.toDto(saved);

        // Webhook integration: оповещение ATS/ботов о принятии оффера кандидатом
        try {
            if (saved.getEmployer() != null) {
                webhookService.dispatchOfferEventAsync(saved.getEmployer().getId(), "OFFER_ACCEPTED", dto);
            }
        } catch (Exception ex) {
            log.warn("Failed to dispatch OFFER_ACCEPTED webhook: {}", ex.getMessage());
        }

        return dto;
    }

    @Transactional
    public OfferDto declineOffer(UUID offerId) {
        log.info("Declining offer ID={}", offerId);
        Invitation invitation = invitationRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Оффер с ID " + offerId + " не найден"));

        invitation.setStatus(InvitationStatus.DECLINED);
        invitation.setUpdatedAt(OffsetDateTime.now());
        Invitation saved = invitationRepository.save(invitation);
        OfferDto dto = offerMapper.toDto(saved);

        // Webhook integration: оповещение ATS о soft decline оффера
        try {
            if (saved.getEmployer() != null) {
                webhookService.dispatchOfferEventAsync(saved.getEmployer().getId(), "OFFER_DECLINED", dto);
            }
        } catch (Exception ex) {
            log.warn("Failed to dispatch OFFER_DECLINED webhook: {}", ex.getMessage());
        }

        return dto;
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
        return offerMapper.toDto(inv);
    }

    public OfferDto mapToOfferDto(Invitation inv, Integer customSalaryFrom, Integer customSalaryTo) {
        return offerMapper.toDto(inv, customSalaryFrom, customSalaryTo);
    }
}
