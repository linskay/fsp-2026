package ru.fsp.careerarena.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.fsp.careerarena.dto.NotificationDto;
import ru.fsp.careerarena.entity.UserNotification;
import ru.fsp.careerarena.exception.ResourceNotFoundException;
import ru.fsp.careerarena.mapper.NotificationMapper;
import ru.fsp.careerarena.repository.UserNotificationRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final UserNotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(UUID userId) {
        List<UserNotification> list;
        if (userId != null) {
            list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
            if (list.isEmpty()) {
                list = notificationRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            list = notificationRepository.findAllByOrderByCreatedAtDesc();
        }

        return list.stream().map(notificationMapper::toDto).collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto markAsRead(UUID id) {
        UserNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Уведомление с ID " + id + " не найдено"));

        notification.setRead(true);
        notification = notificationRepository.save(notification);
        return notificationMapper.toDto(notification);
    }

    public NotificationDto mapToDto(UserNotification n) {
        return notificationMapper.toDto(n);
    }
}
