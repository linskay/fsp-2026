package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.CreateOfferRequest;
import ru.fsp.careerarena.dto.OfferDto;
import ru.fsp.careerarena.service.OfferService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/offers")
@RequiredArgsConstructor
@Tag(name = "Offers & Reverse Recruiting",
     description = "Ядро Reverse Recruiting: отправка прямого оффера с вилкой 'от-до', сокрытие контактов (152-ФЗ) и их открытие только при взаимном согласии соискателя")
public class OfferController {

    private final OfferService offerService;

    @PostMapping
    @Operation(summary = "Отправка работодателем прямого приглашения / оффера кандидату с обязательной зарплатной вилкой и защитой от дублирования (Idempotency-Key)")
    public ResponseEntity<OfferDto> createOffer(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKeyHeader,
            @Valid @RequestBody CreateOfferRequest request) {

        if (idempotencyKeyHeader != null && !idempotencyKeyHeader.isBlank()
                && (request.getIdempotencyKey() == null || request.getIdempotencyKey().isBlank())) {
            request.setIdempotencyKey(idempotencyKeyHeader.trim());
        }

        OfferDto offerDto = offerService.createOffer(request);
        boolean isReplay = offerDto.isIdempotentReplayed();
        HttpStatus status = isReplay ? HttpStatus.OK : HttpStatus.CREATED;

        return ResponseEntity.status(status)
                .header("Idempotent-Replayed", String.valueOf(isReplay))
                .header("Idempotency-Key", offerDto.getIdempotencyKey() != null ? offerDto.getIdempotencyKey() : "")
                .body(offerDto);
    }

    @GetMapping("/candidate/{candidateId}")
    @Operation(summary = "Просмотр соискателем всех входящих офферов и приглашений от работодателей")
    public ResponseEntity<List<OfferDto>> getOffersByCandidate(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(offerService.getOffersByCandidate(candidateId));
    }

    @PostMapping("/{id}/accept")
    @Operation(summary = "Принятие оффера соискателем (Обоюдное согласие: контакты кандидата раскрываются работодателю по 152-ФЗ)")
    public ResponseEntity<OfferDto> acceptOffer(@PathVariable UUID id) {
        return ResponseEntity.ok(offerService.acceptOffer(id));
    }

    @PostMapping("/{id}/decline")
    @Operation(summary = "Отклонение оффера соискателем")
    public ResponseEntity<OfferDto> declineOffer(@PathVariable UUID id) {
        return ResponseEntity.ok(offerService.declineOffer(id));
    }

    @GetMapping("/employer/{employerId}")
    @Operation(summary = "Отслеживание работодателем статусов отправленных приглашений и офферов")
    public ResponseEntity<List<OfferDto>> getOffersByEmployer(@PathVariable UUID employerId) {
        return ResponseEntity.ok(offerService.getOffersByEmployer(employerId));
    }
}
