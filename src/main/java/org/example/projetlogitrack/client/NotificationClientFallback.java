package org.example.projetlogitrack.client;

import org.example.projetlogitrack.dto.NotificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class NotificationClientFallback implements NotificationClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationClientFallback.class);

    @Override
    public void createNotification(NotificationRequest request) {
        log.warn("Notification Service indisponible : la notification de la commande {} (type {}) n'a pas été envoyée.",
                request.getOrderId(), request.getType());
    }
}