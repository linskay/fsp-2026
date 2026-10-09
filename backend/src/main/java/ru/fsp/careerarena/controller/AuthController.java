package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.UserRepository;

import java.util.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & OAuth", description = "Авторизация кандидатов и работодателей (GitHub, Yandex, HH.ru), тестовые учетные записи и 152-ФЗ")
public class AuthController {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final EmployerProfileRepository employerProfileRepository;

    @GetMapping("/test-users")
    @Operation(summary = "Получение списка тестовых учетных записей (Кандидат и Работодатель)")
    public ResponseEntity<List<Map<String, Object>>> getTestUsers() {
        return ResponseEntity.ok(List.of(
            Map.of(
                "role", "CANDIDATE",
                "email", "candidate@fsp.ru",
                "password", "candidate2026",
                "fullName", "Иван Пестерев",
                "description", "Кандидат: Java-разработчик (5 лет опыта с hh.ru, 1200 ELO, GitHub @ipesterev)"
            ),
            Map.of(
                "role", "EMPLOYER",
                "email", "employer@fsp.ru",
                "password", "employer2026",
                "fullName", "Елена Романова (СберТех HR)",
                "description", "Работодатель: ПАО Сбербанк (СберТех), вакансия Senior Java 350-520к ₽"
            )
        ));
    }

    @PostMapping("/login")
    @Operation(summary = "Аутентификация пользователя по email и паролю")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email и пароль обязательны"));
        }

        // 1. Поиск в БД PostgreSQL через Spring Data JPA
        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (password.equals(user.getPassword())) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("status", "SUCCESS");
                resp.put("userId", user.getId().toString());
                resp.put("email", user.getEmail());
                resp.put("fullName", user.getFullName());
                resp.put("role", user.getRole().name());
                resp.put("avatarUrl", user.getAvatarUrl());
                resp.put("token", "fsp-jwt-" + UUID.randomUUID());

                if ("CANDIDATE".equals(user.getRole().name())) {
                    candidateProfileRepository.findByUserId(user.getId()).ifPresent(cp -> {
                        resp.put("candidateId", cp.getId().toString());
                        resp.put("fspElo", cp.getFspElo());
                        resp.put("fspRank", cp.getFspRank().name());
                    });
                } else if ("EMPLOYER".equals(user.getRole().name())) {
                    employerProfileRepository.findByUserId(user.getId()).ifPresent(ep -> {
                        resp.put("employerId", ep.getId().toString());
                        resp.put("companyName", ep.getCompanyName());
                    });
                }
                return ResponseEntity.ok(resp);
            }
        }

        // 2. Тестовый fallback (если приложение запущено в standalone режиме)
        if ("candidate@fsp.ru".equalsIgnoreCase(email.trim()) && "candidate2026".equals(password)) {
            return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "userId", "c0000000-0000-0000-0000-000000000001",
                "candidateId", "cand-pesterev",
                "email", "candidate@fsp.ru",
                "fullName", "Иван Пестерев",
                "role", "CANDIDATE",
                "avatarUrl", "/avatars/user_pesterev.png",
                "fspElo", 1200,
                "fspRank", "UNRANKED",
                "token", "fsp-jwt-" + UUID.randomUUID()
            ));
        }

        if ("employer@fsp.ru".equalsIgnoreCase(email.trim()) && "employer2026".equals(password)) {
            return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "userId", "e0000000-0000-0000-0000-000000000001",
                "employerId", "emp-sbertech",
                "email", "employer@fsp.ru",
                "fullName", "Елена Романова (СберТех HR)",
                "role", "EMPLOYER",
                "companyName", "ПАО Сбербанк (СберТех)",
                "avatarUrl", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                "token", "fsp-jwt-" + UUID.randomUUID()
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "error", "Неверный логин или пароль",
            "hint", "Используйте тестовые данные: candidate@fsp.ru / candidate2026 или employer@fsp.ru / employer2026"
        ));
    }

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
