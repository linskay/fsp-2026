package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.fsp.careerarena.dto.UpdateProfileRequest;
import ru.fsp.careerarena.dto.UserDto;
import ru.fsp.careerarena.entity.CandidateProfile;
import ru.fsp.careerarena.entity.EmployerProfile;
import ru.fsp.careerarena.entity.User;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.repository.CandidateProfileRepository;
import ru.fsp.careerarena.repository.EmployerProfileRepository;
import ru.fsp.careerarena.repository.UserRepository;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Profile & RBAC", description = "Управление учетными записями, ролями соискателя/рекрутера и личным профилем")
public class UserController {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateRepository;
    private final EmployerProfileRepository employerRepository;

    @GetMapping("/me")
    @Operation(summary = "Получение профиля текущего авторизованного пользователя для определения роли (соискатель/работодатель)")
    public ResponseEntity<UserDto> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser"))
                ? auth.getName()
                : "candidate@fsp.ru";

        User user = userRepository.findByEmail(email)
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        return ResponseEntity.ok(toDto(user));
    }

    @PutMapping("/profile")
    @Operation(summary = "Обновление личных данных (ФИО, аватарка, пароль) текущего пользователя")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UpdateProfileRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser"))
                ? auth.getName()
                : "candidate@fsp.ru";

        User user = userRepository.findByEmail(email)
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(request.getPassword().trim());
        }

        User updated = userRepository.save(user);
        return ResponseEntity.ok(toDto(updated));
    }

    private UserDto toDto(User u) {
        UUID candidateId = candidateRepository.findByUserId(u.getId())
                .map(CandidateProfile::getId)
                .orElse(null);

        UUID employerId = employerRepository.findByUserId(u.getId())
                .map(EmployerProfile::getId)
                .orElse(null);

        return UserDto.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .role(u.getRole())
                .avatarUrl(u.getAvatarUrl())
                .personalDataConsentAccepted(u.isPersonalDataConsentAccepted())
                .personalDataConsentDate(u.getPersonalDataConsentDate())
                .candidateProfileId(candidateId)
                .employerProfileId(employerId)
                .build();
    }
}
