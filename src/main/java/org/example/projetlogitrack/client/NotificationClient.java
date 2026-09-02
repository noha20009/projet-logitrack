package org.example.projetlogitrack.client;

// TODO: Créez l'interface Feign NotificationClient
//  Annotée avec @FeignClient(name = "notification-service", url = "${notification.service.url}")
//
//  Méthodes à déclarer :
//  - @PostMapping("/api/notifications") Notification createNotification(@RequestBody NotificationRequest request)
//
//  Conseils :
//  - Le fallback peut être géré via @FeignClient(fallback = ...) ou un ErrorDecoder
//  - L'URL du notification service sera dans application.properties :
//      notification.service.url=http://notification-service:8081
