package org.example.projetlogitrack.dto;

public class NotificationRequest {

    private Long orderId;
    private String type;
    private String message;

    public NotificationRequest() {
    }

    public NotificationRequest(Long orderId, String type, String message) {
        this.orderId = orderId;
        this.type = type;
        this.message = message;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}