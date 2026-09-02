package com.logitrack.notification.dto;

import com.logitrack.notification.model.NotificationType;

public class NotificationRequest {

    private Long orderId;
    private NotificationType type;
    private String message;

    public NotificationRequest() {
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
