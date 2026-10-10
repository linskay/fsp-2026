package ru.fsp.careerarena.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id", nullable = false)
    private Invitation offer;

    @Column(name = "sender_id")
    private UUID senderId;

    @Column(name = "sender_role", nullable = false)
    private String senderRole; // "CANDIDATE", "EMPLOYER", "SYSTEM"

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }
}
