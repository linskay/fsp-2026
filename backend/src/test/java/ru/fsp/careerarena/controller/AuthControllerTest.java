package ru.fsp.careerarena.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.entity.enums.FspRank;
import ru.fsp.careerarena.entity.enums.UserRole;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.UserRepository;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Тестирование контроллера аутентификации (AuthController)")
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @Mock
    private EmployerProfileRepository employerProfileRepository;

    @InjectMocks
    private AuthController authController;

    @Test
    @DisplayName("Получение списка тестовых пользователей возвращает учетные записи кандидата и работодателя")
    void getTestUsers_returnsPredefinedUsers() {
        ResponseEntity<List<Map<String, Object>>> response = authController.getTestUsers();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull().hasSize(2);
        assertThat(response.getBody().get(0)).containsEntry("role", "CANDIDATE");
        assertThat(response.getBody().get(1)).containsEntry("role", "EMPLOYER");
    }

    @Test
    @DisplayName("Вход с отсутствующим email или паролем возвращает статус 400 Bad Request")
    void login_missingCredentials_returnsBadRequest() {
        ResponseEntity<Map<String, Object>> responseEmailNull = authController.login(Collections.singletonMap("password", "123"));
        assertThat(responseEmailNull.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(responseEmailNull.getBody()).containsEntry("error", "Email и пароль обязательны");

        ResponseEntity<Map<String, Object>> responsePassNull = authController.login(Collections.singletonMap("email", "test@test.ru"));
        assertThat(responsePassNull.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("Успешный вход кандидата из базы данных возвращает профиль и токен")
    void login_dbCandidateSuccess_returnsCandidateData() {
        UUID userId = UUID.randomUUID();
        UUID candId = UUID.randomUUID();

        User user = User.builder()
                .id(userId)
                .email("candidate@fsp.ru")
                .password("secret123")
                .fullName("Иван Иванов")
                .role(UserRole.CANDIDATE)
                .avatarUrl("/avatar.png")
                .build();

        CandidateProfile profile = CandidateProfile.builder()
                .id(candId)
                .fspElo(1950)
                .fspRank(FspRank.KMS)
                .build();

        when(userRepository.findByEmail("candidate@fsp.ru")).thenReturn(Optional.of(user));
        when(candidateProfileRepository.findByUserId(userId)).thenReturn(Optional.of(profile));

        ResponseEntity<Map<String, Object>> response = authController.login(Map.of(
                "email", "candidate@fsp.ru",
                "password", "secret123"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo("SUCCESS");
        assertThat(body.get("fullName")).isEqualTo("Иван Иванов");
        assertThat(body.get("candidateId")).isEqualTo(candId.toString());
        assertThat(body.get("fspElo")).isEqualTo(1950);
        assertThat(body.get("fspRank")).isEqualTo("KMS");
        assertThat(body.get("token")).toString().startsWith("fsp-jwt-");
    }

    @Test
    @DisplayName("Успешный вход работодателя из базы данных возвращает данные компании")
    void login_dbEmployerSuccess_returnsEmployerData() {
        UUID userId = UUID.randomUUID();
        UUID empId = UUID.randomUUID();

        User user = User.builder()
                .id(userId)
                .email("employer@fsp.ru")
                .password("corp_pass")
                .fullName("Ольга Петрова")
                .role(UserRole.EMPLOYER)
                .build();

        EmployerProfile employerProfile = EmployerProfile.builder()
                .id(empId)
                .companyName("VK Tech")
                .build();

        when(userRepository.findByEmail("employer@fsp.ru")).thenReturn(Optional.of(user));
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.of(employerProfile));

        ResponseEntity<Map<String, Object>> response = authController.login(Map.of(
                "email", "employer@fsp.ru",
                "password", "corp_pass"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo("SUCCESS");
        assertThat(body.get("role")).isEqualTo("EMPLOYER");
        assertThat(body.get("employerId")).isEqualTo(empId.toString());
        assertThat(body.get("companyName")).isEqualTo("VK Tech");
    }

    @Test
    @DisplayName("Успешный fallback-вход кандидата в автономном демо-режиме")
    void login_standaloneCandidateFallback_success() {
        when(userRepository.findByEmail("candidate@fsp.ru")).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = authController.login(Map.of(
                "email", "candidate@fsp.ru",
                "password", "candidate2026"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo("SUCCESS");
        assertThat(body.get("candidateId")).isEqualTo("cand-pesterev");
        assertThat(body.get("fullName")).isEqualTo("Иван Пестерев");
    }

    @Test
    @DisplayName("Успешный fallback-вход работодателя в автономном демо-режиме")
    void login_standaloneEmployerFallback_success() {
        when(userRepository.findByEmail("employer@fsp.ru")).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = authController.login(Map.of(
                "email", "employer@fsp.ru",
                "password", "employer2026"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo("SUCCESS");
        assertThat(body.get("companyName")).isEqualTo("ПАО Сбербанк (СберТех)");
    }

    @Test
    @DisplayName("Неверный логин или пароль возвращает статус 401 Unauthorized")
    void login_invalidCredentials_returnsUnauthorized() {
        when(userRepository.findByEmail("wrong@user.ru")).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = authController.login(Map.of(
                "email", "wrong@user.ru",
                "password", "wrongpass"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).containsEntry("error", "Неверный логин или пароль");
    }

    @Test
    @DisplayName("Получение информации о Положении об обработке ПДН (152-ФЗ)")
    void getPrivacyPolicyInfo_returnsPolicyDetails() {
        ResponseEntity<Map<String, String>> response = authController.getPrivacyPolicyInfo();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("compliance")).isEqualTo("152-ФЗ РФ");
        assertThat(response.getBody().get("url")).contains("fsp-russia.ru");
    }

    @Test
    @DisplayName("Синхронизация профиля GitHub возвращает статус успеха")
    void syncGithubProfile_returnsSuccess() {
        ResponseEntity<Map<String, Object>> response = authController.syncGithubProfile("ipesterev");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("SUCCESS");
        assertThat(response.getBody().get("username")).isEqualTo("ipesterev");
    }

    @Test
    @DisplayName("Синхронизация резюме HeadHunter возвращает статус успеха")
    void syncHhResume_returnsSuccess() {
        ResponseEntity<Map<String, Object>> response = authController.syncHhResume("hh-resume-12345");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("SUCCESS");
        assertThat(response.getBody().get("resumeId")).isEqualTo("hh-resume-12345");
    }
}
