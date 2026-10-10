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
@Tag(name = "Offers & Reverse Recruiting (35% критерий ТЗ)",
     description = "Ядро Reverse Recruiting: отправка прямого оффера с вилкой 'от-до', сокрытие контактов (152-ФЗ) и их открытие только при взаимном согласии соискателя")
public class OfferController {

    private final OfferService offerService;

    @PostMapping
    @Operation(summary = "Отправка работодателем прямого приглашения / оффера кандидату с обязательной зарплатной вилкой 'от-до'")
    public ResponseEntity<OfferDto> createOffer(@Valid @RequestBody CreateOfferRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offerService.createOffer(request));
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
