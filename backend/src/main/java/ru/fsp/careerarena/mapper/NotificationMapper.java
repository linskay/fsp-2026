package ru.fsp.careerarena.mapper;

import org.springframework.stereotype.Component;
import ru.fsp.careerarena.dto.NotificationDto;
import ru.fsp.careerarena.entity.UserNotification;

@Component
public class NotificationMapper {

    public NotificationDto toDto(UserNotification n) {
        if (n == null) return null;

        return NotificationDto.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .entityId(n.getEntityId())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
