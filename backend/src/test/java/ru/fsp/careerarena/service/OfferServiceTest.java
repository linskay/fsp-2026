package ru.fsp.careerarena.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.fsp.careerarena.dto.CreateOfferRequest;
import ru.fsp.careerarena.dto.OfferDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.Invitation;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.entity.Vacancy;
import ru.fsp.careerarena.entity.enums.InvitationStatus;
import ru.fsp.careerarena.mapper.OfferMapper;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.InvitationRepository;
import ru.fsp.careerarena.repository.VacancyRepository;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Юнит-тесты Сервиса обратного найма и идемпотентных офферов")
class OfferServiceTest {

    @Mock
    private InvitationRepository invitationRepository;

    @Mock
    private CandidateProfileRepository candidateRepository;

    @Mock
    private EmployerProfileRepository employerRepository;

    @Mock
    private VacancyRepository vacancyRepository;

    @Mock
    private OfferMapper offerMapper;

    @Mock
    private IdempotencyService idempotencyService;

    @Mock
    private WebhookService webhookService;

    @Mock
    private TelegramBotService telegramBotService;

    private OfferService offerService;

    private UUID candidateId;
    private UUID employerId;
    private UUID vacancyId;

    @BeforeEach
    void setUp() {
        offerService = new OfferService(
                invitationRepository,
                candidateRepository,
                employerRepository,
                vacancyRepository,
                offerMapper,
                idempotencyService,
                webhookService,
                telegramBotService
        );

        candidateId = UUID.randomUUID();
        employerId = UUID.randomUUID();
        vacancyId = UUID.randomUUID();
    }

    @Test
    @DisplayName("Идемпотентный перехват повторного запроса по Idempotency-Key")
    void testCreateOfferWithExistingIdempotencyKey() {
        String key = "idem-offer-key-777";
        CreateOfferRequest request = CreateOfferRequest.builder()
                .candidateId(candidateId)
                .employerId(employerId)
                .idempotencyKey(key)
                .build();

        Invitation existingOffer = Invitation.builder()
                .id(UUID.randomUUID())
                .idempotencyKey(key)
                .build();

        OfferDto expectedDto = OfferDto.builder()
                .id(existingOffer.getId())
                .idempotentReplayed(true)
                .build();

        when(invitationRepository.findByIdempotencyKey(key)).thenReturn(Optional.of(existingOffer));
        when(offerMapper.toDto(existingOffer, true)).thenReturn(expectedDto);

        OfferDto result = offerService.createOffer(request);

        assertNotNull(result);
        assertTrue(result.isIdempotentReplayed());
        verify(invitationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Успешное создание нового оффера с указанием зарплатной вилки")
    void testCreateNewOfferSuccess() {
        CreateOfferRequest request = CreateOfferRequest.builder()
                .candidateId(candidateId)
                .employerId(employerId)
                .vacancyId(vacancyId)
                .salaryFrom(300000)
                .salaryTo(450000)
                .salaryOffered(380000)
                .message("Оффер на позицию Senior Java")
                .build();

        User user = User.builder().fullName("Иван Пестерев").build();
        CandidateProfile candidate = CandidateProfile.builder().id(candidateId).user(user).build();
        EmployerProfile employer = EmployerProfile.builder().id(employerId).companyName("СберТех").build();
        Vacancy vacancy = Vacancy.builder().id(vacancyId).title("Senior Java Core Developer").build();

        when(invitationRepository.findFirstByEmployerIdAndCandidateIdAndVacancyIdAndStatus(
                employerId, candidateId, vacancyId, InvitationStatus.PENDING)).thenReturn(Optional.empty());

        when(candidateRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(employerRepository.findById(employerId)).thenReturn(Optional.of(employer));
        when(vacancyRepository.findById(vacancyId)).thenReturn(Optional.of(vacancy));

        Invitation saved = Invitation.builder()
                .id(UUID.randomUUID())
                .candidate(candidate)
                .employer(employer)
                .vacancy(vacancy)
                .salaryOffered(380000)
                .status(InvitationStatus.PENDING)
                .build();

        OfferDto expectedDto = OfferDto.builder().id(saved.getId()).salaryOffered(380000).build();

        when(invitationRepository.save(any(Invitation.class))).thenReturn(saved);
        when(offerMapper.toDto(any(Invitation.class), anyInt(), anyInt(), eq(false))).thenReturn(expectedDto);

        OfferDto result = offerService.createOffer(request);

        assertNotNull(result);
        assertEquals(380000, result.getSalaryOffered());

        ArgumentCaptor<Invitation> captor = ArgumentCaptor.forClass(Invitation.class);
        verify(invitationRepository).save(captor.capture());
        assertEquals(380000, captor.getValue().getSalaryOffered());
        assertEquals(InvitationStatus.PENDING, captor.getValue().getStatus());
    }

    @Test
    @DisplayName("Принятие оффера соискателем: раскрытие контактов по 152-ФЗ")
    void testAcceptOfferRevealsContacts() {
        UUID offerId = UUID.randomUUID();
        Invitation offer = Invitation.builder()
                .id(offerId)
                .status(InvitationStatus.PENDING)
                .build();

        OfferDto expectedDto = OfferDto.builder()
                .id(offerId)
                .status(InvitationStatus.ACCEPTED)
                .contactsUnmasked(true)
                .build();

        when(invitationRepository.findById(offerId)).thenReturn(Optional.of(offer));
        when(invitationRepository.save(any(Invitation.class))).thenAnswer(i -> i.getArguments()[0]);
        when(offerMapper.toDto(any(Invitation.class))).thenReturn(expectedDto);

        OfferDto result = offerService.acceptOffer(offerId);

        assertTrue(result.isContactsUnmasked());
        assertEquals(InvitationStatus.ACCEPTED, offer.getStatus());
        verify(invitationRepository).save(offer);
    }
}
