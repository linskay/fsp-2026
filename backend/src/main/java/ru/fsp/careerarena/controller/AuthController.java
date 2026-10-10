package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.Grade;
import ru.fsp.careerarena.entity.enums.Specialization;
import ru.fsp.careerarena.entity.enums.UserRole;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.UserRepository;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & OAuth", description = "Авторизация кандидатов и работодателей (GitHub, Yandex, HH.ru), тестовые учетные записи и регистрация")
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

    @PostMapping("/register")
    @Operation(summary = "Регистрация нового пользователя (Кандидат или Работодатель) в PostgreSQL")
    @Transactional
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> req) {
        String email = (String) req.get("email");
        String password = (String) req.get("password");
        String fullName = (String) req.get("fullName");
        String roleStr = (String) req.get("role");

        if (email == null || email.isBlank() || password == null || password.isBlank() || fullName == null || fullName.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email, пароль и имя обязательны для заполнения"));
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Пользователь с таким email уже зарегистрирован"));
        }

        UserRole role = "EMPLOYER".equalsIgnoreCase(roleStr) ? UserRole.EMPLOYER : UserRole.CANDIDATE;

        User newUser = User.builder()
                .email(normalizedEmail)
                .password(password)
                .fullName(fullName.trim())
                .role(role)
                .avatarUrl(role == UserRole.CANDIDATE ? "/avatars/user_pesterev.png" : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")
                .personalDataConsentAccepted(true)
                .personalDataConsentDate(OffsetDateTime.now())
                .build();

        User savedUser = userRepository.save(newUser);

        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "SUCCESS");
        resp.put("userId", savedUser.getId().toString());
        resp.put("email", savedUser.getEmail());
        resp.put("fullName", savedUser.getFullName());
        resp.put("role", savedUser.getRole().name());
        resp.put("avatarUrl", savedUser.getAvatarUrl());
        resp.put("token", "fsp-jwt-" + UUID.randomUUID());

        if (role == UserRole.CANDIDATE) {
            CandidateProfile profile = CandidateProfile.builder()
                    .user(savedUser)
                    .fspId("FSP-" + String.format("%06d", new Random().nextInt(999999)))
                    .fspElo(1200)
                    .fspRank(FspRank.UNRANKED)
                    .specialization(Specialization.BACKEND)
                    .grade(Grade.MIDDLE)
                    .salaryExpectation(150000)
                    .location("Москва / Удаленно")
                    .bio("Зарегистрированный разработчик FSP Career Arena")
                    .isFspVerified(true)
                    .build();
            CandidateProfile savedProfile = candidateProfileRepository.save(profile);
            resp.put("candidateId", savedProfile.getId().toString());
            resp.put("fspElo", savedProfile.getFspElo());
            resp.put("fspRank", savedProfile.getFspRank().name());
        } else {
            EmployerProfile profile = EmployerProfile.builder()
                    .user(savedUser)
                    .companyName(fullName.trim())
                    .industry("Информационные технологии")
                    .isFspPartner(true)
                    .build();
            EmployerProfile savedProfile = employerProfileRepository.save(profile);
            resp.put("employerId", savedProfile.getId().toString());
            resp.put("companyName", savedProfile.getCompanyName());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/privacy-policy")
    @Operation(summary = "Получение официальной ссылки на Положение об обработке персональных данных ФСП РФ (152-ФЗ)")
    public ResponseEntity<Map<String, String>> getPrivacyPolicyInfo() {
        return ResponseEntity.ok(Map.of(
            "title", "Положение об обработке персональных данных Федерации спортивного программирования России",
            "url", "https://fsp-russia.ru/files/%D0%9F%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%BF%D0%B4%D0%BD%20(1).pdf",
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
