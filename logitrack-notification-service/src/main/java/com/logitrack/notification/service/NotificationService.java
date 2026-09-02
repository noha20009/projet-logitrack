package com.logitrack.notification.service;

import com.logitrack.notification.dto.NotificationRequest;
import com.logitrack.notification.dto.NotificationResponse;
import com.logitrack.notification.model.Notification;
import com.logitrack.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<NotificationResponse> getAll() {
        return notificationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public NotificationResponse getById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable avec l'id " + id));
        return toResponse(notification);
    }

    public List<NotificationResponse> getByOrderId(Long orderId) {
        return notificationRepository.findByOrderId(orderId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public NotificationResponse create(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setOrderId(request.getOrderId());
        notification.setType(request.getType());
        notification.setMessage(request.getMessage());
        notification.setDateCreation(LocalDateTime.now());
        notification.setRead(false);
        return toResponse(notificationRepository.save(notification));
    }

    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable avec l'id " + id));
        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setDateCreation(notification.getDateCreation());
        response.setRead(notification.isRead());
        response.setOrderId(notification.getOrderId());
        return response;
    }
}
