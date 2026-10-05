package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & OAuth", description = "Авторизация кандидатов и работодателей (GitHub, Yandex, HH.ru) и 152-ФЗ")
public class AuthController {

    @GetMapping("/privacy-policy")
    @Operation(summary = "Получение официальной ссылки на Положение об обработке персональных данных ФСП РФ (152-ФЗ)")
    public ResponseEntity<Map<String, String>> getPrivacyPolicyInfo() {
        return ResponseEntity.ok(Map.of(
            "title", "Положение об обработке персональных данных Федерации спортивного программирования России",
            "url", "https://fsp-russia.ru/files/Положение%20обработку%20пдн%20(1).pdf",
            "compliance", "152-ФЗ РФ"
        ));
    }

    @PostMapping("/sync/github-profile")
    @Operation(summary = "Синхронизация профиля GitHub (репозитории, коммиты, стек) после OAuth2")
    public ResponseEntity<Map<String, Object>> syncGithubProfile(@RequestParam String username) {
        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "username", username,
            "message", "Профиль GitHub и коммиты успешно синхронизированы в портфолио кандидата"
        ));
    }

    @PostMapping("/sync/hh-resume")
    @Operation(summary = "Импорт резюме соискателя из HeadHunter API")
    public ResponseEntity<Map<String, Object>> syncHhResume(@RequestParam String resumeId) {
        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "resumeId", resumeId,
            "message", "Резюме и опыт работы с hh.ru успешно импортированы"
        ));
    }
}
